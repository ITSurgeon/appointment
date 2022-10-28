import { number } from '@hapi/joi';

export class EntityService {
  paginate(builder, paginationQuery) {
    const { page, limit } = paginationQuery;
    const skip = (page - 1) * limit;
    builder.offset(skip);
    builder.limit(limit);
    return builder;
  }

  filterByRelation(builder, relationsQuery) {
    for (const relationKey in relationsQuery) {
      if (relationsQuery[relationKey]) {
        builder.andWhere(`${relationKey}.id = ANY(:${relationKey}Id)`, {
          [`${relationKey}Id`]: [relationsQuery[relationKey]],
        });
      }
    }
    return builder;
  }

  filterByColumn(builder, columnsQuery) {
    for (const columnKey in columnsQuery) {
      if (typeof columnsQuery[columnKey] == 'number') {
        builder.andWhere(`"${columnKey}" = :${columnKey}`, {
          [`${columnKey}`]: `${columnsQuery[columnKey].trim()}`,
        });
      }
      builder.andWhere(`"${columnKey}" ilike :${columnKey}`, {
        [`${columnKey}`]: `%${columnsQuery[columnKey].trim()}%`,
      });
    }
    return builder;
  }
}
