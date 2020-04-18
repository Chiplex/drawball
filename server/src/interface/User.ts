import { Draw } from "./Draw";
export interface User{
    id: string;
    email: string;
    password: string;
    readonly created_at?: Date;
    readonly updated_at?: Date;
    readonly deleted_at?: Date;
    draws?: Draw[];
}