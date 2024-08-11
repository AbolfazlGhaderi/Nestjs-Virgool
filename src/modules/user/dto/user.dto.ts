import { ApiProperty } from '@nestjs/swagger';
import { CheckOtpMethods, CheckOtpTypes } from '../enums/enums';
import { IsEmail, IsEnum, IsJWT, IsNumberString, IsPhoneNumber, IsString, Length } from 'class-validator';

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

    @ApiProperty()
    @IsJWT()
    token:string;

}


export class ChangeEmailDTO
{
   @ApiProperty()
   @IsEmail()
   @IsString()
   email: string;
}

export class EmailDto
{
   @ApiProperty()
   @IsEmail()
   @IsString()
   email: string;
}

export class PhoneDto
{
    @ApiProperty()
    @IsPhoneNumber('IR')
    phone:string;
}
