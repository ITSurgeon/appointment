import { Service } from '../service/entity/service.entity';

export interface ServiceSearchResultInterface {
  services: Service[];
  totalCount: any;
  currentPage: number;
}
