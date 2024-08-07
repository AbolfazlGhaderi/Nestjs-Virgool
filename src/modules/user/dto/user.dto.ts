import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, Length } from 'class-validator';
import { CheckOtpMethods, CheckOtpTypes } from '../enums/enums';

export class UserCheckOtpDto
{

    @ApiProperty()
    @IsNumberString()
    @Length(5, 5)
    code:string;

    @ApiProperty({ enum: CheckOtpMethods })
    @IsEnum(CheckOtpMethods)
    method: CheckOtpMethods;

    @ApiProperty({ enum: CheckOtpTypes })
    @IsEnum(CheckOtpTypes)
    type: CheckOtpTypes;

}