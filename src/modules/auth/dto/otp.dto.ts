import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, Length } from 'class-validator';

export class CheckOtpDto
{
    @ApiProperty()
    @IsNumberString()
    @Length(5, 5)
    code:string;
}