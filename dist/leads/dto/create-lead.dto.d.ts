export declare enum LeadStatus {
    YANGI = "Yangi",
    ALOQADA = "Aloqada",
    SINOVDA = "Sinovda",
    SINOVDA_QATNASHDI = "Sinovda qatnashdi",
    SINOVDAN_KETDI = "Sinovdan ketdi",
    OQISHGA_YOZILDI = "O'qishga yozildi",
    YOQOTILDI = "Yo'qotildi"
}
export declare enum LeadSource {
    INSTAGRAM = "Instagram",
    TELEGRAM = "Telegram",
    DOSTIMDAN = "Do'stimdan",
    OZIM_KELDIM = "O'zim keldim",
    FLAYER = "Flayer",
    BANNER_YONDAGI = "Banner(yondagi)",
    BANNER_KOCHADAGI = "Banner(ko'chadagi)",
    BOSHQA = "Boshqa"
}
export declare class CreateLeadDto {
    phone: string;
    question: string;
    first_name: string;
    last_name: string;
    status: LeadStatus;
    source: LeadSource;
    course_id: string;
    admin_id: string;
    notes: string;
}
