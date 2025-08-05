import { Injectable } from '@nestjs/common';
import * as OneSignal from '@onesignal/node-onesignal';

@Injectable()
export class OnesignalService {
  private client: OneSignal.DefaultApi;

  constructor() {
    const configuration = OneSignal.createConfiguration({
     organizationApiKey: '0011559f-4a23-49a0-93e8-782ed04a61cb', 
      restApiKey: 'os_v2_app_mlca543frjhhvn4qjvnpizgb2xdreaizvd7ei45cazd6vphxugjeyeiiho23pumrw4f2jqg2viqi4rimbupghs5n4eie4jjpftmzuaq', 
    });

    this.client = new OneSignal.DefaultApi(configuration);
  }

  async sendNotification(notification: OneSignal.Notification) {
    try {
      const response = await this.client.createNotification(notification);
      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
}
