import { PaginationDto } from '../../common/dtos';

export function PaginationConfig(paginationData: PaginationDto)
{
    const { limit = '5', page = '0' } = paginationData;

    let pageN = Number.parseInt(page);
    let limitN = Number.parseInt(limit);

    if (!page || pageN <= 1) pageN = 0;
    else pageN = pageN - 1;

    if (!limitN || limitN <= 0) limitN = 5;

    const skip = pageN * limitN;

    return {
        page : pageN === 0 ? 1 : pageN,
        limit : limitN,
        skip : skip,
    };
}

export function paginationGenerator(count : number = 0, page : number = 0, limit : number = 0 )
{
    return {
        totalCount : +count,
        page : +page,
        limit : +limit,
        pageCount : Math.ceil(count / limit),
    };
}
