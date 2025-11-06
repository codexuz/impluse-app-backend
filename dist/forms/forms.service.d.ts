import { Form } from './entities/form.entity.js';
import { Response } from './entities/response.entity.js';
import { CreateFormDto } from './dto/create-form.dto.js';
import { UpdateFormDto } from './dto/update-form.dto.js';
import { CreateResponseDto } from './dto/create-response.dto.js';
import { UpdateResponseDto } from './dto/update-response.dto.js';
export declare class FormsService {
    private formModel;
    private responseModel;
    constructor(formModel: typeof Form, responseModel: typeof Response);
    create(createFormDto: CreateFormDto): Promise<Form>;
    findAll(): Promise<Form[]>;
    findOne(id: string): Promise<Form>;
    update(id: string, updateFormDto: UpdateFormDto): Promise<Form>;
    remove(id: string): Promise<void>;
    createResponse(createResponseDto: CreateResponseDto): Promise<Response>;
    findAllResponses(): Promise<Response[]>;
    findResponsesByForm(formId: number): Promise<Response[]>;
    findOneResponse(id: number): Promise<Response>;
    updateResponse(id: number, updateResponseDto: UpdateResponseDto): Promise<Response>;
    removeResponse(id: number): Promise<void>;
}
