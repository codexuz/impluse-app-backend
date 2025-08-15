import { SpeakingService } from './speaking.service.js';
import { CreateSpeakingDto } from './dto/create-speaking.dto.js';
import { UpdateSpeakingDto } from './dto/update-speaking.dto.js';
export declare class SpeakingController {
    private readonly speakingService;
    constructor(speakingService: SpeakingService);
    create(createSpeakingDto: CreateSpeakingDto): Promise<import("./entities/speaking.entity.js").Speaking>;
    findAll(): Promise<import("./entities/speaking.entity.js").Speaking[]>;
    findOne(id: string): Promise<import("./entities/speaking.entity.js").Speaking>;
    update(id: string, updateSpeakingDto: UpdateSpeakingDto): Promise<import("./entities/speaking.entity.js").Speaking>;
    remove(id: string): Promise<void>;
}
