import { Injectable } from '@nestjs/common';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getMessaging, Message, MulticastMessage, Messaging } from 'firebase-admin/messaging';
import { cert } from 'firebase-admin/app';
import * as path from 'path';
@Injectable()
export class FirebaseServiceService {
    private readonly messaging: Messaging;


    constructor() {
        if (!getApps().length) {
            // Use the service account JSON file
            const serviceAccountPath = path.join(process.cwd(), 'impulse-lc-firebase-adminsdk-fbsvc-4f28538148.json');
            
            try {
                initializeApp({
                    credential: cert(serviceAccountPath),
                });
            } catch (error) {
                console.error('Failed to initialize Firebase:', error);
                throw new Error(
                    'Failed to initialize Firebase. Please ensure the service account file exists and is valid.'
                );
            }
        }

        this.messaging = getMessaging();
    }


    async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message: Message = {
      token,
      notification: { title, body },
      data,
    };

    try {
      return await this.messaging.send(message);
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

    async sendMulticastNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message: MulticastMessage = {
      tokens,
      notification: { title, body },
      data,
    };

    try {
      return await this.messaging.sendEachForMulticast(message);
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }
    async sendToTopic(
    topic: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ) {
    const message: Message = {
      topic,
      notification: { title, body },
      data,
    }; 

    try {
      return await this.messaging.send(message);
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Send app update notification to multiple devices
   * @param tokens Array of FCM tokens to send the notification to
   * @param customBody Optional custom message (defaults to "Please, update to the latest version.")
   * @param playStoreUrl Optional custom Play Store URL
   */
  async sendAppUpdateNotification(
    tokens: string[],
    customBody?: string,
    playStoreUrl: string = 'https://play.google.com/store/apps/details?id=edu.impulse.uz'
  ) {
    const message: MulticastMessage = {
      tokens,
      notification: {
        title: 'App Update',
        body: customBody || 'Please, update to the latest version.',
      },
      data: {
        url: playStoreUrl,
        type: 'app_update'
      },
      android: {
        priority: 'high',
        notification: {
          clickAction: 'FLUTTER_NOTIFICATION_CLICK'
        }
      }
    };

    try {
      return await this.messaging.sendEachForMulticast(message);
    } catch (error) {
      console.error('Error sending app update notification:', error);
      throw error;
    }
  }
}
