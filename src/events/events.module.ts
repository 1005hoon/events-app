import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { EventAttendeesController } from './event-attendees.controller';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { Attendee } from './attendee.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AttendeesService } from './attendees.service';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    CurrentUserEventAttendanceController,
    EventAttendeesController,
    EventsOrganizedByUserController,
  ],
  providers: [EventsService, AttendeesService],
})
export class EventsModule {}
