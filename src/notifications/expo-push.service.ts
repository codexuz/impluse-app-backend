import { Injectable } from '@nestjs/common';
import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';
import { isExpoPushToken } from '../utils/expo.util.js';

@Injectable()
export class ExpoPushService {
  private readonly expo: Expo;

  constructor() {
    this.expo = new Expo({
      accessToken: process.env.EXPO_ACCESS_TOKEN,
    });
  }

  private async sendChunk(chunk: ExpoPushMessage[]): Promise<ExpoPushTicket[]> {
    try {
      const ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
      ticketChunk.forEach((ticket) => {
        if (ticket.status === 'error') {
          console.error(
            `Expo push error: ${ticket.message}`,
            ticket.details?.error ? `(${ticket.details.error})` : '',
          );
        }
      });
      return ticketChunk;
    } catch (error: any) {
      if (error?.code === 'PUSH_TOO_MANY_EXPERIENCE_IDS' && error?.details) {
        // The batch contains tokens from multiple Expo projects; split by project and retry.
        const projectTokens = error.details as Record<string, string[]>;
        const tokenToProject = new Map<string, string>();
        for (const [project, tokens] of Object.entries(projectTokens)) {
          for (const token of tokens) tokenToProject.set(token, project);
        }

        const byProject = new Map<string, ExpoPushMessage[]>();
        for (const msg of chunk) {
          const token = msg.to as string;
          const project = tokenToProject.get(token);
          if (project) {
            if (!byProject.has(project)) byProject.set(project, []);
            byProject.get(project)!.push(msg);
          }
        }

        const retryTickets: ExpoPushTicket[] = [];
        for (const [project, msgs] of byProject) {
          try {
            const t = await this.expo.sendPushNotificationsAsync(msgs);
            retryTickets.push(...t);
          } catch (retryError) {
            console.error(`Error retrying push for project ${project}:`, retryError);
          }
        }
        return retryTickets;
      }

      console.error('Error sending Expo push chunk:', error);
      return [];
    }
  }

  private async send(messages: ExpoPushMessage[]): Promise<ExpoPushTicket[]> {
    const chunks = this.expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      const chunkTickets = await this.sendChunk(chunk);
      tickets.push(...chunkTickets);
    }

    return tickets;
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<ExpoPushTicket[]> {
    if (!isExpoPushToken(token)) {
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
      .filter((token) => isExpoPushToken(token))
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
      .filter((token) => isExpoPushToken(token))
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
