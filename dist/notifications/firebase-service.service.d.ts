export declare class FirebaseServiceService {
    private readonly messaging;
    constructor();
    sendNotification(token: string, title: string, body: string, data?: Record<string, string>): Promise<string>;
    sendMulticastNotification(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<import("firebase-admin/messaging").BatchResponse>;
    sendToTopic(topic: string, title: string, body: string, data?: Record<string, string>): Promise<string>;
    sendAppUpdateNotification(tokens: string[], customBody?: string, playStoreUrl?: string): Promise<import("firebase-admin/messaging").BatchResponse>;
}
