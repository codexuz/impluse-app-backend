import { Injectable } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

@Injectable()
export class ExpoPushService {
  private readonly expo: Expo;

  constructor() {
    this.expo = new Expo({
      accessToken: process.env.EXPO_ACCESS_TOKEN,
    });
  }

  private async send(messages: ExpoPushMessage[]): Promise<ExpoPushTicket[]> {
    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);

        ticketChunk.forEach((ticket) => {
          if (ticket.status === 'error') {
            console.error(
              `Expo push error: ${ticket.message}`,
              ticket.details?.error ? `(${ticket.details.error})` : '',
            );
          }
        });
      } catch (error) {
        console.error('Error sending Expo push chunk:', error);
      }
    }

    return tickets;
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<ExpoPushTicket[]> {
    if (!Expo.isExpoPushToken(token)) {
      throw new Error(`Push token ${token} is not a valid Expo push token`);
    }

    return this.send([{ to: token, title, body, data, sound: 'default' }]);
  }

  async sendMulticastNotification(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<ExpoPushTicket[]> {
    const messages: ExpoPushMessage[] = tokens
      .filter((token) => Expo.isExpoPushToken(token))
      .map((token) => ({ to: token, title, body, data, sound: 'default' }));

    if (messages.length === 0) {
      return [];
    }

    return this.send(messages);
  }

  async sendAppUpdateNotification(
    tokens: string[],
    customBody?: string,
    playStoreUrl: string = 'https://play.google.com/store/apps/details?id=edu.impulse.uz',
  ): Promise<ExpoPushTicket[]> {
    const messages: ExpoPushMessage[] = tokens
      .filter((token) => Expo.isExpoPushToken(token))
      .map((token) => ({
        to: token,
        title: 'App Update',
        body: customBody || 'Please, update to the latest version.',
        data: { url: playStoreUrl, type: 'app_update' },
        sound: 'default',
        priority: 'high',
      }));

    if (messages.length === 0) {
      return [];
    }

    return this.send(messages);
  }
}
