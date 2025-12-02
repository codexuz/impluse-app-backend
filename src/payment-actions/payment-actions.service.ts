import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { PaymentAction } from "./entities/payment-action.entity.js";
import { StudentPayment } from "../student-payment/entities/student-payment.entity.js";
import { User } from "../users/entities/user.entity.js";
import { CreatePaymentActionDto } from "./dto/create-payment-action.dto.js";
import { UpdatePaymentActionDto } from "./dto/update-payment-action.dto.js";
import { PaymentActionResponseDto } from "./dto/payment-action-response.dto.js";

@Injectable()
export class PaymentActionsService {
  private readonly logger = new Logger(PaymentActionsService.name);

  constructor(
    @InjectModel(PaymentAction)
    private paymentActionModel: typeof PaymentAction,
    @InjectModel(StudentPayment)
    private studentPaymentModel: typeof StudentPayment,
    @InjectModel(User)
    private userModel: typeof User
  ) {}

  async create(
    createPaymentActionDto: CreatePaymentActionDto
  ): Promise<PaymentActionResponseDto> {
    try {
      // Verify payment exists
      const payment = await this.studentPaymentModel.findByPk(
        createPaymentActionDto.payment_id
      );
      if (!payment) {
        throw new NotFoundException(
          `Payment with ID ${createPaymentActionDto.payment_id} not found`
        );
      }

      // Verify manager exists
      const manager = await this.userModel.findByPk(
        createPaymentActionDto.manager_id
      );
      if (!manager) {
        throw new NotFoundException(
          `Manager with ID ${createPaymentActionDto.manager_id} not found`
        );
      }

      const paymentAction = await this.paymentActionModel.create({
        ...createPaymentActionDto,
      });

      return paymentAction.toJSON() as PaymentActionResponseDto;
    } catch (error) {
      this.logger.error(
        `Error creating payment action: ${error.message}`,
        error.stack
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create payment action: ${error.message}`
      );
    }
  }

  async findAll(filters?: {
    payment_id?: string;
    manager_id?: string;
    stage?: string;
    action_type?: string;
  }): Promise<PaymentActionResponseDto[]> {
    try {
      const where: any = {};

      if (filters?.payment_id) {
        where.payment_id = filters.payment_id;
      }
      if (filters?.manager_id) {
        where.manager_id = filters.manager_id;
      }
      if (filters?.stage) {
        where.stage = filters.stage;
      }
      if (filters?.action_type) {
        where.action_type = filters.action_type;
      }

      const paymentActions = await this.paymentActionModel.findAll({
        where,
        include: [
          {
            model: StudentPayment,
            as: "payment",
            attributes: ["id", "student_id", "amount"],
          },
          {
            model: User,
            as: "manager",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return paymentActions.map(
        (pa) => pa.toJSON() as PaymentActionResponseDto
      );
    } catch (error) {
      this.logger.error(
        `Error fetching payment actions: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(
        `Failed to fetch payment actions: ${error.message}`
      );
    }
  }

  async findOne(id: string): Promise<PaymentActionResponseDto> {
    try {
      const paymentAction = await this.paymentActionModel.findByPk(id, {
        include: [
          {
            model: StudentPayment,
            as: "payment",
            attributes: ["id", "student_id", "amount"],
          },
          {
            model: User,
            as: "manager",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
      });

      if (!paymentAction) {
        throw new NotFoundException(`Payment action with ID ${id} not found`);
      }

      return paymentAction.toJSON() as PaymentActionResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error fetching payment action: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(
        `Failed to fetch payment action: ${error.message}`
      );
    }
  }

  async update(
    id: string,
    updatePaymentActionDto: UpdatePaymentActionDto
  ): Promise<PaymentActionResponseDto> {
    try {
      const paymentAction = await this.paymentActionModel.findByPk(id);

      if (!paymentAction) {
        throw new NotFoundException(`Payment action with ID ${id} not found`);
      }

      await paymentAction.update(updatePaymentActionDto);

      const updated = await this.paymentActionModel.findByPk(id, {
        include: [
          {
            model: StudentPayment,
            as: "payment",
            attributes: ["id", "student_id", "amount"],
          },
          {
            model: User,
            as: "manager",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
      });

      return updated.toJSON() as PaymentActionResponseDto;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error updating payment action: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(
        `Failed to update payment action: ${error.message}`
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const paymentAction = await this.paymentActionModel.findByPk(id);

      if (!paymentAction) {
        throw new NotFoundException(`Payment action with ID ${id} not found`);
      }

      await paymentAction.destroy();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Error deleting payment action: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(
        `Failed to delete payment action: ${error.message}`
      );
    }
  }

  async findByPaymentId(
    paymentId: string
  ): Promise<PaymentActionResponseDto[]> {
    try {
      const paymentActions = await this.paymentActionModel.findAll({
        where: { payment_id: paymentId },
        include: [
          {
            model: User,
            as: "manager",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return paymentActions.map(
        (pa) => pa.toJSON() as PaymentActionResponseDto
      );
    } catch (error) {
      this.logger.error(
        `Error fetching payment actions by payment ID: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(
        `Failed to fetch payment actions: ${error.message}`
      );
    }
  }

  async findByManagerId(
    managerId: string
  ): Promise<PaymentActionResponseDto[]> {
    try {
      const paymentActions = await this.paymentActionModel.findAll({
        where: { manager_id: managerId },
        include: [
          {
            model: StudentPayment,
            as: "payment",
            attributes: ["id", "student_id", "amount"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return paymentActions.map(
        (pa) => pa.toJSON() as PaymentActionResponseDto
      );
    } catch (error) {
      this.logger.error(
        `Error fetching payment actions by manager ID: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(
        `Failed to fetch payment actions: ${error.message}`
      );
    }
  }

  async findByStage(stage: string): Promise<PaymentActionResponseDto[]> {
    try {
      const paymentActions = await this.paymentActionModel.findAll({
        where: { stage },
        include: [
          {
            model: StudentPayment,
            as: "payment",
            attributes: ["id", "student_id", "amount"],
          },
          {
            model: User,
            as: "manager",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return paymentActions.map(
        (pa) => pa.toJSON() as PaymentActionResponseDto
      );
    } catch (error) {
      this.logger.error(
        `Error fetching payment actions by stage: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(
        `Failed to fetch payment actions: ${error.message}`
      );
    }
  }

  async getUpcomingActions(): Promise<PaymentActionResponseDto[]> {
    try {
      const today = new Date();
      const paymentActions = await this.paymentActionModel.findAll({
        where: {
          next_action_date: {
            [Op.lte]: today,
          },
        },
        include: [
          {
            model: StudentPayment,
            as: "payment",
            attributes: ["id", "student_id", "amount"],
          },
          {
            model: User,
            as: "manager",
            attributes: ["id", "first_name", "last_name", "email"],
          },
        ],
        order: [["next_action_date", "ASC"]],
      });

      return paymentActions.map(
        (pa) => pa.toJSON() as PaymentActionResponseDto
      );
    } catch (error) {
      this.logger.error(
        `Error fetching upcoming actions: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(
        `Failed to fetch upcoming actions: ${error.message}`
      );
    }
  }
}
