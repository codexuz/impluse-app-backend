import { FormsService } from './forms.service.js';
import { CreateFormDto } from './dto/create-form.dto.js';
import { UpdateFormDto } from './dto/update-form.dto.js';
import { CreateResponseDto } from './dto/create-response.dto.js';
import { UpdateResponseDto } from './dto/update-response.dto.js';
export declare class FormsController {
    private readonly formsService;
    constructor(formsService: FormsService);
    create(createFormDto: CreateFormDto): Promise<import("./entities/form.entity.js").Form>;
    findAll(): Promise<import("./entities/form.entity.js").Form[]>;
    findOne(id: string): Promise<import("./entities/form.entity.js").Form>;
    update(id: string, updateFormDto: UpdateFormDto): Promise<import("./entities/form.entity.js").Form>;
    remove(id: string): Promise<void>;
    createResponse(createResponseDto: CreateResponseDto): Promise<import("./entities/response.entity.js").Response>;
    findAllResponses(): Promise<import("./entities/response.entity.js").Response[]>;
    findResponsesByForm(formId: string): Promise<import("./entities/response.entity.js").Response[]>;
    findOneResponse(id: string): Promise<import("./entities/response.entity.js").Response>;
    updateResponse(id: string, updateResponseDto: UpdateResponseDto): Promise<import("./entities/response.entity.js").Response>;
    removeResponse(id: string): Promise<void>;
}
