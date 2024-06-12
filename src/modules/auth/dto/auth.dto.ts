import { ApiProperty } from '@nestjs/swagger';
import { AuthType } from 'src/common/enums';
import { AuthMethods } from '../../../common/enums/auth/method.enum';
import { IsEnum, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  username: string;
  @ApiProperty({ enum: AuthType })
  @IsEnum(AuthType)
  type: string;
  @ApiProperty({ enum: AuthMethods })
  @IsEnum(AuthMethods)
  method: AuthMethods;
}
