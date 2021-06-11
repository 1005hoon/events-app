import { EventDateFilter } from '../enum/event-date-filter.enum';

export class EventDateFilterDto {
  when?: EventDateFilter = EventDateFilter.All;
  page = 1;
}
