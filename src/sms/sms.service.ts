import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { EskizSms } from 'eskiz-sms';

export interface SendSmsDto {
  mobile_phone: string;
  message: string;
}

export interface SendBulkSmsDto {
  messages: {
    user_sms_id?: string;
    mobile_phone: string;
    message: string;
  }[];
}

export interface CreateTemplateDto {
  template: string;
}

@Injectable()
export class SmsService implements OnModuleInit {
  private readonly logger = new Logger(SmsService.name);
  private smsClient: EskizSms;
  private isInitialized = false;
  private readonly eskizBaseUrl = 'https://notify.eskiz.uz/api';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {
    this.smsClient = new EskizSms({
      email: this.configService.get<string>('ESKIZ_EMAIL') || '',
      password: this.configService.get<string>('ESKIZ_PASSWORD') || '',
    });
  }

  async onModuleInit() {
    try {
      await this.initializeSmsClient();
    } catch (error) {
      this.logger.error('Failed to initialize SMS client on module init:', error);
    }
  }

  private async initializeSmsClient(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      await this.smsClient.init();
      this.isInitialized = true;
      this.logger.log('Eskiz SMS client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Eskiz SMS client:', error);
      throw error;
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      await this.initializeSmsClient();
    }
  }

  /**
   * Get the current authentication token from the SMS client
   * @returns The authentication token
   */
  private getAuthToken(): string {
    // Access the token from the EskizSms client
    // The token is stored after initialization
    return (this.smsClient as any).token || '';
  }

  /**
   * Send a single SMS message
   * @param sendSmsDto - SMS details including phone number and message
   * @returns Response from Eskiz SMS API
   */
  async sendSms(sendSmsDto: SendSmsDto): Promise<any> {
    try {
      await this.ensureInitialized();

      this.logger.log(`Sending SMS to ${sendSmsDto.mobile_phone}`);

      const response = await this.smsClient.send({
        mobile_phone: sendSmsDto.mobile_phone,
        message: sendSmsDto.message
      });

      this.logger.log(`SMS sent successfully to ${sendSmsDto.mobile_phone}`);
      
      // Extract safe data from response to avoid circular reference issues
      const safeResponse = {
        status: response?.status || 'unknown',
        statusText: response?.statusText || 'unknown',
        data: response?.data || null,
        message: 'SMS sent successfully',
      };
      
      return safeResponse;
    } catch (error) {
      this.logger.error(`Failed to send SMS to ${sendSmsDto.mobile_phone}:`, error);
      throw error;
    }
  }

  /**
   * Send SMS to multiple recipients using batch API
   * @param sendBulkSmsDto - Bulk SMS details
   * @returns Response from Eskiz SMS batch API
   */
  async sendBulkSms(sendBulkSmsDto: SendBulkSmsDto): Promise<any> {
    try {
      await this.ensureInitialized();

      this.logger.log(`Sending bulk SMS to ${sendBulkSmsDto.messages.length} recipients`);

      // Generate unique dispatch_id as number
      const dispatchId = Date.now();

      // Transform messages to Eskiz batch format
      const payload = {
        dispatch_id: dispatchId,
        messages: sendBulkSmsDto.messages.map((msg, index) => ({
          user_sms_id: msg.user_sms_id || `sms${index + 1}`,
          to: parseInt(msg.mobile_phone.replace(/\D/g, '')), // Remove non-digits and convert to number
          text: msg.message,
        })),
      };

      const response = await this.smsClient.sendBatch(payload);

      this.logger.log(`Bulk SMS sent successfully. Total: ${sendBulkSmsDto.messages.length}`);

      // Extract safe data from response
      const safeResponse = {
        status: response?.status || 'unknown',
        statusText: response?.statusText || 'unknown',
        data: response?.data || null,
        message: 'Bulk SMS sent successfully',
        total: sendBulkSmsDto.messages.length,
        dispatch_id: dispatchId,
      };

      return safeResponse;
    } catch (error) {
      this.logger.error('Failed to send bulk SMS:', error);
      throw error;
    }
  }

  /**
   * Send verification code SMS
   * @param mobile_phone - Phone number to send verification code
   * @param code - Verification code
   * @returns Response from Eskiz SMS API
   */
  async sendVerificationCode(mobile_phone: string, code: string): Promise<any> {
    const message = `Your verification code is: ${code}. Do not share this code with anyone.`;
    
    return this.sendSms({
      mobile_phone,
      message,
    });
  }

  /**
   * Send notification SMS
   * @param mobile_phone - Phone number to send notification
   * @param title - Notification title
   * @param body - Notification body
   * @returns Response from Eskiz SMS API
   */
  async sendNotification(mobile_phone: string, title: string, body: string): Promise<any> {
    const message = `${title}\n${body}`;
    
    return this.sendSms({
      mobile_phone,
      message,
    });
  }

  /**
   * Get SMS balance and account info
   * @returns Account balance information
   */
  async getBalance(): Promise<any> {
    try {
      await this.ensureInitialized();
      
      this.logger.log('Fetching SMS balance');
      
      const response = await this.smsClient.getBalance();
      
      // Extract safe data from response
      const safeResponse = {
        status: response?.status || 'unknown',
        statusText: response?.statusText || 'unknown',
        data: response?.data || null,
        message: 'Balance retrieved successfully',
      };
      
      return safeResponse;
    } catch (error) {
      this.logger.error('Failed to get balance:', error);
      throw error;
    }
  }

  /**
   * Get monthly SMS report for a specific year
   * @param year - Year for the report (e.g., 2024)
   * @returns Monthly SMS usage report
   */
  async getReportMonthly(year: number): Promise<any> {
    try {
      await this.ensureInitialized();
      
      this.logger.log(`Fetching monthly SMS report for year ${year}`);
      
      const response = await this.smsClient.getReportMonthly(year);
      
      // Extract safe data from response
      const safeResponse = {
        status: response?.status || 'unknown',
        statusText: response?.statusText || 'unknown',
        data: response?.data || null,
        message: 'Monthly report retrieved successfully',
        year,
      };
      
      return safeResponse;
    } catch (error) {
      this.logger.error(`Failed to get monthly report for year ${year}:`, error);
      throw error;
    }
  }

  /**
   * Create a new SMS template
   * @param createTemplateDto - Template content
   * @returns Response from Eskiz SMS API
   */
  async createTemplate(createTemplateDto: CreateTemplateDto): Promise<any> {
    try {
      await this.ensureInitialized();
      
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not available');
      }

      this.logger.log('Creating SMS template');

      const response = await firstValueFrom(
        this.httpService.post(
          `${this.eskizBaseUrl}/user/template`,
          createTemplateDto,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      this.logger.log('SMS template created successfully');

      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        message: 'Template created successfully',
      };
    } catch (error) {
      this.logger.error('Failed to create template:', error);
      throw error;
    }
  }

  /**
   * Get all SMS templates
   * @returns List of SMS templates
   */
  async getTemplates(): Promise<any> {
    try {
      await this.ensureInitialized();
      
      const token = this.getAuthToken();
      
      if (!token) {
        throw new Error('Authentication token not available');
      }

      this.logger.log('Fetching SMS templates');

      const response = await firstValueFrom(
        this.httpService.get(
          `${this.eskizBaseUrl}/user/templates`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      );

      this.logger.log('SMS templates retrieved successfully');

      return {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        message: 'Templates retrieved successfully',
      };
    } catch (error) {
      this.logger.error('Failed to get templates:', error);
      throw error;
    }
  }

  /**
   * Check if SMS service is initialized and ready
   * @returns boolean indicating initialization status
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Reinitialize SMS client (useful for token refresh)
   */
  async reinitialize(): Promise<void> {
    this.isInitialized = false;
    await this.initializeSmsClient();
  }
}
