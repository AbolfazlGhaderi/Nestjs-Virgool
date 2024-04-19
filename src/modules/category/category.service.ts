import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatetegoryDto } from './dto/create.category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/app/models';
import { Repository } from 'typeorm';
import { ConflictMessages } from 'src/common/enums';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}
  async CreateCategoryS(categoryData: CreateCatetegoryDto) {

    let { description, parentId, title } = categoryData;
    title = title.trim().toLowerCase();

    // check Exist
    let category = await this.checkExistByTitle(title);
    if (category)
      throw new ConflictException(ConflictMessages.categoryConflict);

    // Save Category
    let newCategory = this.categoryRepository.create({
      description: description,
      title: title,
      parentId: parentId,
    });
    await this.categoryRepository.save(newCategory)

    // return 
    return newCategory
  }

  
  async checkExistByTitle(title: string) {
    const category = await this.categoryRepository.findOne({
      where: { title: title },
    });
    return category;
  }
}
