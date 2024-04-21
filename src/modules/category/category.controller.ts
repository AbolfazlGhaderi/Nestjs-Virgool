import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateCatetegoryDto } from './dto/create.category.dto';
import { SwaggerConsumes } from 'src/common/enums';
import { PaginationDto } from 'src/common/dtos';
import { Pagination } from 'src/common/decorators';
import { PaginationConfig } from 'src/app/utils/pagination.util';
import { UpdateCategoryDTO } from './dto/update.category.dsto';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('new-category')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  async createCategoryC(@Body() categoryDto: CreateCatetegoryDto) {
    return await this.categoryService.CreateCategoryS(categoryDto);
  }

  @Get()
  @Pagination()
  async GetAllCategoriesC(@Query() paginationDto: PaginationDto) {
    return this.categoryService.GetAllCategoriesS(paginationDto);
  }
  
  @Put('/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)

  async UpdateC(@Param('id',ParseIntPipe) id : number , @Body() updateDto : UpdateCategoryDTO){
    return await this.categoryService.UpdateCategoryC(id,updateDto)
    
  }

}
