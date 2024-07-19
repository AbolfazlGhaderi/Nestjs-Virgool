import { Repository } from 'typeorm';
import { CategoryEntity } from '../../app/models';
import { PaginationDto } from '../../common/dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictMessages } from '../../common/enums';
import { UpdateCategoryDTO } from './dto/update.category.dsto';
import { CreateCatetegoryDto } from './dto/create.category.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { NotFoundMessages, PublicMessage } from '../../common/enums/message.enum';
import { PaginationConfig, paginationGenerator } from '../../app/utils/pagination.util';

@Injectable()
export class CategoryService
{
    constructor(
      @InjectRepository(CategoryEntity)
      private readonly categoryRepository: Repository<CategoryEntity>,
    ) {}

    async CreateCategoryS(categoryData: CreateCatetegoryDto)
    {
        let {  title } = categoryData;
        const { description, parentId } = categoryData;

        title = title.trim().toLowerCase();


        // Check Parent Category ===>
        let ParentCategory;
        if (parentId)
        {
            ParentCategory = await this.CheckExistCategoryById(parentId);
            if (!ParentCategory) throw new HttpException(NotFoundMessages.CategoryNotFound, HttpStatus.NOT_FOUND);
        }

        // check Exist ===>
        const category = await this.checkExistByTitle(title);
        if (category) throw new HttpException(ConflictMessages.CategoryConflict, HttpStatus.CONFLICT);

        // Save Category
        const newCategory = this.categoryRepository.create({
            description: description,
            title: title,
            parent: ParentCategory,
        });

        await this.categoryRepository.save(newCategory);

        // return
        return { message: PublicMessage.CreateSuccess };
    }

    async FindCategoryByTitle(title:string)
    {
        return await this.categoryRepository.findOne({ where:{ title:title } });
    }

    async InsertCategory(title:string)
    {
        title = title.trim().toLowerCase();
        return await this.categoryRepository.save({ title:title });
    }

    async GetAllCategoriesS(paginationData: PaginationDto)
    {
        const { limit, page, skip } = PaginationConfig(paginationData);

        const [ categories, count ] = await this.categoryRepository.findAndCount({
            relations: { parent: true },
            order: { id: 'ASC' },
            skip,
            take: limit,
        });
        if (categories.length === 0)
        {
            throw new HttpException(NotFoundMessages.CategoriesNotFound, HttpStatus.NOT_FOUND);
        }
        return {
            psgination: paginationGenerator(count, page, limit),
            categories,
        };

        // const {} = await this.categoryRepository.
    }

    // Update Category
    async UpdateCategoryC(id: string, data: UpdateCategoryDTO)
    {
        const category = await this.categoryRepository.findOne({
            where: { id: id },
        });
        if (!category) throw new HttpException(NotFoundMessages.CategoryNotFound, HttpStatus.NOT_FOUND);

        category.title = data.title.trim().toLowerCase() ?? category.title;
        category.description = data.description ?? category.description;
        category.parent.id = data.parentId ?? category.parent.id;

        const updated = await this.categoryRepository.save(category);
        return {
            message: PublicMessage.UpdateSuccess,
            category: updated,
        };
    }

    // Delete Category
    async DeleteCategoryS(id: string)
    {
        const category = await this.categoryRepository.findOne({
            where: { id: id },
        });
        if (!category) throw new HttpException(NotFoundMessages.CategoryNotFound, HttpStatus.NOT_FOUND);

        await this.categoryRepository.remove(category);

        return {
            message: PublicMessage.DeleteSuccess,
        };
    }

    async checkExistByTitle(title: string)
    {
        const category = await this.categoryRepository.findOne({
            where: { title: title },
        });
        return category;
    }

    async CheckExistCategoryById(id: string)
    {
        const category = await this.categoryRepository.findOne({
            where: { id: id },
        });
        return category;
    }
}
