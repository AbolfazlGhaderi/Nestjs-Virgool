import { UserEntity } from "src/app/models";

declare global {
    namespace Express {
        export interface Request {
            user?: UserEntity;
        }
    }
}