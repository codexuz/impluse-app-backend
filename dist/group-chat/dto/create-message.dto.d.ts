export declare enum MessageType {
    TEXT = "text",
    IMAGE = "image",
    FILE = "file",
    VIDEO = "video",
    AUDIO = "audio"
}
export declare class CreateMessageDto {
    group_id: string;
    content: string;
    message_type?: MessageType;
}
