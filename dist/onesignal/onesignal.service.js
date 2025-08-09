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
import * as OneSignal from '@onesignal/node-onesignal';
let OnesignalService = class OnesignalService {
    constructor() {
        const configuration = OneSignal.createConfiguration({
            organizationApiKey: '0011559f-4a23-49a0-93e8-782ed04a61cb',
            restApiKey: 'os_v2_app_mlca543frjhhvn4qjvnpizgb2xdreaizvd7ei45cazd6vphxugjeyeiiho23pumrw4f2jqg2viqi4rimbupghs5n4eie4jjpftmzuaq',
        });
        this.client = new OneSignal.DefaultApi(configuration);
    }
    async sendNotification(notification) {
        try {
            const response = await this.client.createNotification(notification);
            return response;
        }
        catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }
};
OnesignalService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], OnesignalService);
export { OnesignalService };
//# sourceMappingURL=onesignal.service.js.map