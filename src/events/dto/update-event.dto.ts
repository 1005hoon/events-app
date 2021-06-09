import { PartialType } from '@nestjs/mapped-types';
import CreateEventDto from './create-event.dto';

export default class UpdateEventDto extends PartialType(CreateEventDto) {}
