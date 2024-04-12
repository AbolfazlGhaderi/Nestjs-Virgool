import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateCatetegoryDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    title:string
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    description:string

    @ApiProperty()
    @IsOptional()
    @IsNotEmpty()
    @IsNumberString()
    parentId:string

    
}