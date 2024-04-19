import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateCatetegoryDto } from './dto/create.category.dto';
import { SwaggerConsumes } from 'src/common/enums';

@Controller('categories')
@ApiTags('Categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('new-category')
  @ApiConsumes(SwaggerConsumes.UrlEncoded,SwaggerConsumes.Json)
  async createCategoryC(@Body() categoryDto: CreateCatetegoryDto) {
    return await this.categoryService.CreateCategoryS(categoryDto)
  }

  @Get('')
  async GetAllCategoriesC(){
    return this.categoryService.GetAllCategoriesS()
  }
}
