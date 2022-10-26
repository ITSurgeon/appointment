import { User } from '../user/entities/user.entity';

export interface UserSearchResultInterface {
  data: User[];
  totalCount: any;
  currentPage: number;
}
