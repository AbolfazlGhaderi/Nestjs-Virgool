import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateCatetegoryDto } from './dto/create.category.dto';
import { SwaggerConsumes } from 'src/common/enums';
import { PaginationDto } from 'src/common/dtos';
import { Pagination } from 'src/common/decorators';

@Controller('category')
@ApiTags('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('new-category')
  @ApiConsumes(SwaggerConsumes.UrlEncoded,SwaggerConsumes.Json)
  async createCategoryC(@Body() categoryDto: CreateCatetegoryDto) {
    return await this.categoryService.CreateCategoryS(categoryDto)
  }

  @Get()
  @Pagination()
  async GetAllCategoriesC(@Query() paginationDto : PaginationDto){
    return this.categoryService.GetAllCategoriesS(paginationDto)
  }
}
