import { PaginationDto } from '../../common/dtos';
import { SwaggerConsumes } from '../../common/enums';
import { CategoryService } from './category.service';
import { RoleKey } from '../../common/enums/role.enum';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateCategoryDTO } from './dto/update.category.dsto';
import { CreateCatetegoryDto } from './dto/create.category.dto';
import { AuthDecorator } from '../../common/decorators/auth.decorator';
import { Pagination } from '../../common/decorators/pagination.decorator';
import { CanAccess } from '../../common/decorators/role.access.decorator';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

@Controller('category')
@ApiTags('category')
export class CategoryController
{
    constructor(private readonly categoryService: CategoryService) {}

   @Post('new')
   @AuthDecorator()
   @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
    async CreateCategoryC(@Body() categoryDto: CreateCatetegoryDto)
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
   @AuthDecorator()
   @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
   @CanAccess(RoleKey.Admin)
   async UpdateC(@Param('id') id: string, @Body() updateDto: UpdateCategoryDTO)
   {
       return await this.categoryService.UpdateCategoryC(id, updateDto);
   }

   @Delete('/:id')
   @AuthDecorator()
   @CanAccess(RoleKey.Admin)
   async DeleteCategoryC(@Param('id') id: string)
   {
       return await this.categoryService.DeleteCategoryS(id);
   }
}
