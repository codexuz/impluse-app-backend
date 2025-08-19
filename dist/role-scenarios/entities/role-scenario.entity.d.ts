import { Model } from "sequelize-typescript";
export declare class RoleScenario extends Model {
    id: string;
    speaking_id: string;
    bot_sentence: string;
    user_sentence: string;
}
