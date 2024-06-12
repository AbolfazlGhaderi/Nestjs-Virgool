import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/app/models';
import { PaginationConfig, paginationGenerator } from 'src/app/utils/pagination.util';
import { PaginationDto } from 'src/common/dtos';
import { ConflictMessages } from 'src/common/enums';
import { Repository } from 'typeorm';
import { NotFoundMessages, PublicMessage } from '../../common/enums/message.enum';
import { CreateCatetegoryDto } from './dto/create.category.dto';
import { UpdateCategoryDTO } from './dto/update.category.dsto';

@Injectable()
export class CategoryService {
   constructor(
      @InjectRepository(CategoryEntity)
      private readonly categoryRepository: Repository<CategoryEntity>
   ) {}

   async CreateCategoryS(categoryData: CreateCatetegoryDto) {
      let { description, parentId, title } = categoryData;
      title = title.trim().toLowerCase();

      // check Exist
      let category = await this.checkExistByTitle(title);
      if (category) throw new HttpException(ConflictMessages.categoryConflict, HttpStatus.CONFLICT);

      // Save Category
      let newCategory = this.categoryRepository.create({
         description: description,
         title: title,
         parentId: parentId
      });
      await this.categoryRepository.save(newCategory);

      // return
      return newCategory;
   }

   async GetAllCategoriesS(paginationData: PaginationDto) {
      const { limit, page, skip } = PaginationConfig(paginationData);

      const [categories, count] = await this.categoryRepository.findAndCount({
         order: { id: 'ASC' },
         skip,
         take: limit
      });
      if (categories.length === 0) {
         throw new HttpException(NotFoundMessages.categoriesNotFound, HttpStatus.NOT_FOUND);
      }
      return {
         psgination: paginationGenerator(count, page, limit),
         categories
      };

      // const {} = await this.categoryRepository.
   }

   // Update Category
   async UpdateCategoryC(id: string, data: UpdateCategoryDTO) {
      const category = await this.categoryRepository.findOne({
         where: { id: id }
      });
      if (!category) throw new HttpException(NotFoundMessages.categoryNotFound, HttpStatus.NOT_FOUND);

      category.title = data.title.trim().toLowerCase() ?? category.title;
      category.description = data.description ?? category.description;
      category.parentId = data.parentId ?? category.parentId;

      const updated = await this.categoryRepository.save(category);
      return {
         message: PublicMessage.updateSuccess,
         category: updated
      };
   }

   // Delete Category
   async DeleteCategoryS(id: string) {
      const category = await this.categoryRepository.findOne({
         where: { id: id }
      });
      if (!category) throw new HttpException(NotFoundMessages.categoryNotFound, HttpStatus.NOT_FOUND);

      await this.categoryRepository.remove(category);

      return {
         message: PublicMessage.deleteSuccess
      };
   }

   async checkExistByTitle(title: string) {
      const category = await this.categoryRepository.findOne({
         where: { title: title }
      });
      return category;
   }
}
