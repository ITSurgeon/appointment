import { Repository, SelectQueryBuilder } from 'typeorm';

export class EntityService {
  async findMany(
    query,
    repository: Repository<any>,
  ): Promise<{ entities: any[]; totalCount: number }> {
    const newQuery = { page: 1, limit: 9, ...query };
    const { page, limit, ...filterQuery } = newQuery;
    const skip = (page - 1) * limit;

    const paginationQuery = {
      skip,
      limit,
    };

    const builder: SelectQueryBuilder<any> = repository.createQueryBuilder();
    builder.offset(paginationQuery.skip);
    builder.limit(paginationQuery.limit);

    if (filterQuery && Object.keys(filterQuery).length > 0) {
      for (const property in filterQuery) {
        builder.andWhere(`"${property}" ilike :filter`, {
          filter: `%${filterQuery[property].trim()}%`,
        });
      }
    }

    const totalCount = await builder.getCount();
    const entities = await builder.getMany();
    return { totalCount, entities };
  }
}
