export class CreateAppointmentDto {
  comment?: string;
  minCost?: string;
  specificTimeSlotId: number;
  clientId: number;
  specialistId: number;
  serviceId: number;
}
