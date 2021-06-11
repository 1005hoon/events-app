import { IsEnum } from 'class-validator';
import { AttendResponse } from './../enum/attendee-response.enum';

export class CreateAttendeeDto {
  @IsEnum(AttendResponse)
  answer: AttendResponse;
}
