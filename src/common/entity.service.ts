import { Repository, SelectQueryBuilder } from 'typeorm';

export class EntityService {
  async findMany(
    query,
    repository: Repository<any>,
  ): Promise<{ entities: any[]; totalCount: number }> {
    const newQuery = { page: 1, limit: 9, ...query };
    const { page, limit, ...filterQuery } = newQuery;
    const skip = (page - 1) * limit;

    const builder: SelectQueryBuilder<any> = repository.createQueryBuilder();
    builder.offset(skip);
    builder.limit(limit);

    if (filterQuery && Object.keys(filterQuery).length > 0) {
      for (const property in filterQuery) {
        builder.andWhere(`"${property}" ilike :${property}`, {
          [`${property}`]: `%${filterQuery[property].trim()}%`,
        });
      }
    }
    const totalCount = await builder.getCount();
    const entities = await builder.getMany();
    return { totalCount, entities };
  }
}
