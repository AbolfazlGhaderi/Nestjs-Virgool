import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CreateCatetegoryDto } from './dto/create.category.dto';
import { SwaggerConsumes } from 'src/common/enums';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('new-category')
  @ApiConsumes(SwaggerConsumes.UrlEncoded,SwaggerConsumes.Json)
  async createCategory(@Body() categoryDto: CreateCatetegoryDto) {}
}
