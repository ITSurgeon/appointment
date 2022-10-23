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
      builder.andWhere(`"${columnKey}" ilike :${columnKey}`, {
        [`${columnKey}`]: `%${columnsQuery[columnKey].trim()}%`,
      });
    }
    return builder;
  }
}
