import { Appointment } from '../appointment/entity/appointment.entity';

export interface AppointmentSearchResult {
  data: Appointment[];
  totalCount: any;
  currentPage: number;
}
