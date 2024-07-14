import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ChangeEmailDTO
{
   @ApiProperty()
   @IsEmail()
   @IsString()
   email: string;
}
