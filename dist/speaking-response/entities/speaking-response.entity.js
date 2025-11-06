var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Table, Column, Model, DataType } from "sequelize-typescript";
let SpeakingResponse = class SpeakingResponse extends Model {
};
__decorate([
    Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    }),
    __metadata("design:type", String)
], SpeakingResponse.prototype, "id", void 0);
__decorate([
    Column(DataType.UUID),
    __metadata("design:type", String)
], SpeakingResponse.prototype, "speaking_id", void 0);
__decorate([
    Column(DataType.UUID),
    __metadata("design:type", String)
], SpeakingResponse.prototype, "student_id", void 0);
__decorate([
    Column({
        type: DataType.ENUM('part1', 'part2', 'part3', 'pronunciation'),
        allowNull: false,
        comment: 'Type of speaking response (IELTS speaking part or pronunciation)',
    }),
    __metadata("design:type", String)
], SpeakingResponse.prototype, "response_type", void 0);
__decorate([
    Column({
        type: DataType.ARRAY(DataType.STRING),
        allowNull: true,
        comment: 'URLs to the audio recordings',
        defaultValue: []
    }),
    __metadata("design:type", Array)
], SpeakingResponse.prototype, "audio_url", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Transcription of the audio recording',
    }),
    __metadata("design:type", String)
], SpeakingResponse.prototype, "transcription", void 0);
__decorate([
    Column({
        type: DataType.JSON,
        allowNull: true,
        comment: 'General assessment result data',
    }),
    __metadata("design:type", Object)
], SpeakingResponse.prototype, "result", void 0);
__decorate([
    Column({
        type: DataType.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Overall pronunciation score (0-100)',
    }),
    __metadata("design:type", Number)
], SpeakingResponse.prototype, "pronunciation_score", void 0);
__decorate([
    Column({
        type: DataType.TEXT,
        allowNull: true,
        comment: 'Feedback on errors and improvement suggestions',
    }),
    __metadata("design:type", String)
], SpeakingResponse.prototype, "feedback", void 0);
SpeakingResponse = __decorate([
    Table({
        tableName: "speaking_responses",
        timestamps: true,
        paranoid: true,
        underscored: true,
    })
], SpeakingResponse);
export { SpeakingResponse };
//# sourceMappingURL=speaking-response.entity.js.map