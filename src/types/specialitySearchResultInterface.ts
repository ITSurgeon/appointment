import { Speciality } from '../speciality/entity/speciality.entity';

export interface SpecialitySearchResultInterface {
  specialities: Speciality[];
  totalCount: any;
  currentPage: number;
}
