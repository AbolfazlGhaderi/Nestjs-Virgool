import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangeUserNameDTO
{
   @IsNotEmpty()
   @IsString()
   @Length(3, 100)
   username: string;
}
