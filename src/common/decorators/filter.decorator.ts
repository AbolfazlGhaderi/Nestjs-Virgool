import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'

export function FilterBlog()
{
    return applyDecorators(
        ApiQuery({ name: 'category', example: 'database', required: false }),
        ApiQuery({ name: 'search', example: 'database', required: false }),
    )
}
