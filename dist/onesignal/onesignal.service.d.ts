import * as OneSignal from '@onesignal/node-onesignal';
export declare class OnesignalService {
    private client;
    constructor();
    sendNotification(notification: OneSignal.Notification): Promise<OneSignal.CreateNotificationSuccessResponse>;
}
