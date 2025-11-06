var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { cert } from 'firebase-admin/app';
import * as path from 'path';
let FirebaseServiceService = class FirebaseServiceService {
    constructor() {
        if (!getApps().length) {
            const serviceAccountPath = path.join(process.cwd(), 'impulse-lc-firebase-adminsdk-fbsvc-4f28538148.json');
            try {
                initializeApp({
                    credential: cert(serviceAccountPath),
                });
            }
            catch (error) {
                console.error('Failed to initialize Firebase:', error);
                throw new Error('Failed to initialize Firebase. Please ensure the service account file exists and is valid.');
            }
        }
        this.messaging = getMessaging();
    }
    async sendNotification(token, title, body, data) {
        const message = {
            token,
            notification: { title, body },
            data,
        };
        try {
            return await this.messaging.send(message);
        }
        catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }
    async sendMulticastNotification(tokens, title, body, data) {
        const message = {
            tokens,
            notification: { title, body },
            data,
        };
        try {
            return await this.messaging.sendEachForMulticast(message);
        }
        catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }
    async sendToTopic(topic, title, body, data) {
        const message = {
            topic,
            notification: { title, body },
            data,
        };
        try {
            return await this.messaging.send(message);
        }
        catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }
    async sendAppUpdateNotification(tokens, customBody, playStoreUrl = 'https://play.google.com/store/apps/details?id=edu.impulse.uz') {
        const message = {
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
        }
        catch (error) {
            console.error('Error sending app update notification:', error);
            throw error;
        }
    }
};
FirebaseServiceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], FirebaseServiceService);
export { FirebaseServiceService };
//# sourceMappingURL=firebase-service.service.js.map