import { ApiPropertyOptional } from "@nestjs/swagger"
import { IsNotEmpty, IsNumberString } from "class-validator"

export class PaginationDto {
    @ApiPropertyOptional({ type : 'integer'})
    @IsNotEmpty()
    @IsNumberString()
    page: string
    @ApiPropertyOptional({ type : 'integer'})
    @IsNotEmpty()
    @IsNumberString()
    limit: string
}