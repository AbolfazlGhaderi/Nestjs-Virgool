import { ApiQuery } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

export function FilterBlog()
{
    return applyDecorators(
        ApiQuery({ name: 'category', example: 'database', required: false }),
    );
}
