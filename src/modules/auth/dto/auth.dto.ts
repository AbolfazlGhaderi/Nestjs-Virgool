import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator'

import { AuthType } from '../../../common/enums'
import { AuthMethods } from '../../../common/enums/auth/method.enum'

export class AuthDto
{
  @ApiProperty()
  @IsString()
  @MinLength(3)
  username: string
  @ApiProperty({ enum: AuthType })
  @IsEnum(AuthType)
  type: string
  @ApiProperty({ enum: AuthMethods })
  @IsEnum(AuthMethods)
  method: AuthMethods
}

export class CheckRefreshTokenDto
{
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string
}
