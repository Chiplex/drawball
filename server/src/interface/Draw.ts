import { User } from "./User";
export interface Draw{
    id: string;
    json: string;
    image?: string;
    description?: string;
    readonly created_at?: Date;
    readonly updated_at?: Date;
    readonly deleted_at?: Date;
    user?: User[];
}