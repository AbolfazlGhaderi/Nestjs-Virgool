import { UserEntity } from '../../app/models';

declare global {
    namespace Express {
        export interface Request {
            user?: UserEntity;
        }
    }
}