import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import { StaffProfile } from "./entities/staff-profile.entity.js";
import { User } from "../users/entities/user.entity.js";
import { CreateStaffProfileDto } from "./dto/create-staff-profile.dto.js";
import { UpdateStaffProfileDto } from "./dto/update-staff-profile.dto.js";

@Injectable()
export class StaffProfileService {
  async create(dto: CreateStaffProfileDto) {
    const user = await User.findByPk(dto.staff_id);
    if (!user) {
      throw new NotFoundException("Foydalanuvchi topilmadi");
    }

    const existing = await StaffProfile.findOne({
      where: { staff_id: dto.staff_id },
    });
    if (existing) {
      throw new ConflictException(
        "Ushbu xodim uchun profil allaqachon mavjud",
      );
    }

    return StaffProfile.create({
      staff_id: dto.staff_id,
      in_time: dto.in_time ?? null,
      out_time: dto.out_time ?? null,
    } as any);
  }

  async findAll() {
    return StaffProfile.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        {
          association: "staff",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
      ],
    });
  }

  async findOne(id: string) {
    const profile = await StaffProfile.findByPk(id, {
      include: [
        {
          association: "staff",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
      ],
    });
    if (!profile) {
      throw new NotFoundException("Xodim profili topilmadi");
    }
    return profile;
  }

  async findByStaffId(staffId: string) {
    const profile = await StaffProfile.findOne({
      where: { staff_id: staffId },
      include: [
        {
          association: "staff",
          attributes: [
            "user_id",
            "username",
            "first_name",
            "last_name",
            "avatar_url",
          ],
        },
      ],
    });
    if (!profile) {
      throw new NotFoundException("Xodim profili topilmadi");
    }
    return profile;
  }

  async update(id: string, dto: UpdateStaffProfileDto) {
    const profile = await this.findOne(id);
    await profile.update({
      ...(dto.in_time !== undefined ? { in_time: dto.in_time } : {}),
      ...(dto.out_time !== undefined ? { out_time: dto.out_time } : {}),
    });
    return profile;
  }

  async remove(id: string) {
    const profile = await this.findOne(id);
    await profile.destroy();
    return { message: "Xodim profili o'chirildi" };
  }
}
