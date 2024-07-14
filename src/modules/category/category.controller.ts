import { PaginationDto } from '../../common/dtos';
import { SwaggerConsumes } from '../../common/enums';
import { CategoryService } from './category.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateCategoryDTO } from './dto/update.category.dsto';
import { CreateCatetegoryDto } from './dto/create.category.dto';
import { Pagination } from '../../common/decorators/pagination.decorator';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

@Controller('category')
@ApiTags('category')
export class CategoryController
{
    constructor(private readonly categoryService: CategoryService) {}

   @Post('new')
   @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    async createCategoryC(@Body() categoryDto: CreateCatetegoryDto)
    {
        return await this.categoryService.CreateCategoryS(categoryDto);
    }

   @Get()
   @Pagination()
   async GetAllCategoriesC(@Query() paginationDto: PaginationDto)
   {
       return this.categoryService.GetAllCategoriesS(paginationDto);
   }

   @Put('/:id')
   @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
   async UpdateC(@Param('id') id: string, @Body() updateDto: UpdateCategoryDTO)
   {
       return await this.categoryService.UpdateCategoryC(id, updateDto);
   }

   @Delete('/:id')
   async DeleteCategoryC(@Param('id') id: string)
   {
       return await this.categoryService.DeleteCategoryS(id);
   }
}
