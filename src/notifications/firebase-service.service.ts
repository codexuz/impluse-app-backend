import { Injectable } from '@nestjs/common';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getMessaging, Message, MulticastMessage, Messaging } from 'firebase-admin/messaging';
import { cert } from 'firebase-admin/app';

@Injectable()
export class FirebaseServiceService {
    private readonly messaging: Messaging;


    constructor() {
        if (!getApps().length) {
            // Use environment variables for Firebase credentials
            try {
                initializeApp({
                    credential: cert({
                        type: process.env.FIREBASE_TYPE,
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
                        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        clientId: process.env.FIREBASE_CLIENT_ID,
                        authUri: process.env.FIREBASE_AUTH_URI,
                        tokenUri: process.env.FIREBASE_TOKEN_URI,
                        authProviderX509CertUrl: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
                        clientC509CertUrl: process.env.FIREBASE_CLIENT_X509_CERT_URL,
                        universeDomain: process.env.FIREBASE_UNIVERSE_DOMAIN,
                    } as any),
                });
            } catch (error) {
                console.error('Failed to initialize Firebase:', error);
                throw new Error(
                    'Failed to initialize Firebase. Please ensure the environment variables are set correctly.'
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
