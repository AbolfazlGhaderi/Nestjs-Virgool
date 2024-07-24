import { SetMetadata } from '@nestjs/common';
import { RoleKey } from '../enums/role.enum';

export const ROLE_ACCESS = 'ROLE_ACCESS';

export const CanAccess = (...roles: RoleKey[]) => SetMetadata(ROLE_ACCESS, roles);
