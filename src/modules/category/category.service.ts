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
import { NotFoundMessages } from '../../common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos';

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

  async GetAllCategoriesS (paginationData : PaginationDto) : Promise<Array<CategoryEntity>> {

    console.log(paginationData);
    const categories : CategoryEntity[] =  await this.categoryRepository.find()
    if(categories.length === 0){
      throw new NotFoundException(NotFoundMessages.categoriesNotFound)

    } 
    return categories

  }

  
  async checkExistByTitle(title: string) {
    const category = await this.categoryRepository.findOne({
      where: { title: title },
    });
    return category;
  }
}
