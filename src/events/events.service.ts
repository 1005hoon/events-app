import { EventNotFoundException } from './exception/event-not-found.exception';
import { AttendResponse } from './enum/attendee-response.enum';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, SelectQueryBuilder } from 'typeorm';

import { Event } from './event.entity';
import { EventDateFilterDto } from './dto/event-date-filter.dto';
import { EventDateFilter } from './enum/event-date-filter.enum';
import { paginate, PaginationOptions } from './pagination/paginator';
import CreateEventDto from './dto/create-event.dto';
import { User } from 'src/auth/user.entity';
import UpdateEventDto from './dto/update-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  public async getPaginatedEvents(
    filter: EventDateFilterDto,
    paginationOptions: PaginationOptions,
  ) {
    return await paginate(
      await this.getEventsWithDateFilter(filter),
      paginationOptions,
    );
  }

  public async getEvent(id: number): Promise<Event> {
    const event = await this.getEventsWithAttendeeCount()
      .andWhere('event.id =:id', {
        id,
      })
      .getOne();

    if (!event) {
      throw new EventNotFoundException(id);
    }

    return event;
  }

  public async getEventWithOrganizer(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne(id);

    if (!event) {
      throw new EventNotFoundException(id);
    }
    return event;
  }

  public async createEvent(createEventDto: CreateEventDto, user: User) {
    return await this.eventsRepository.save({
      ...createEventDto,
      when: new Date(createEventDto.when),
      organizer: user,
    });
  }

  public async updateEvent(id: number, updateEventDto: UpdateEventDto) {
    return await this.eventsRepository.update(id, updateEventDto);
  }

  public async deleteEvent(id: number): Promise<DeleteResult> {
    return this.eventsRepository
      .createQueryBuilder('e')
      .delete()
      .where('id = :id', { id })
      .execute();
  }

  private getEventsBaseQuery() {
    return this.eventsRepository
      .createQueryBuilder('event')
      .orderBy('event.id', 'DESC');
  }

  private getEventsWithAttendeeCount() {
    return this.getEventsBaseQuery()
      .loadRelationCountAndMap('event.attendeeCount', 'event.attendees')
      .loadRelationCountAndMap(
        'event.attendeeAttending',
        'event.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.response = :response', {
            response: AttendResponse.Attending,
          }),
      )
      .loadRelationCountAndMap(
        'event.attendeeMaybe',
        'event.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.response = :response', {
            response: AttendResponse.Maybe,
          }),
      )
      .loadRelationCountAndMap(
        'event.attendeeNotAttending',
        'event.attendees',
        'attendee',
        (qb) =>
          qb.where('attendee.response = :response', {
            response: AttendResponse.NotAttending,
          }),
      );
  }

  private async getEventsWithDateFilter(
    filter?: EventDateFilterDto,
  ): Promise<SelectQueryBuilder<Event>> {
    let query = this.getEventsWithAttendeeCount();

    if (!filter) {
      return query;
    }

    if (filter.when) {
      switch (filter.when) {
        case EventDateFilter.Today:
          query = query.andWhere(
            `event.when >= CURDATE() AND event.when <= CURDATE() + INTERVAL 1 DAY`,
          );
          break;
        case EventDateFilter.Tomorrow:
          query = query.andWhere(
            `event.when >= CURDATE() + INTERVAL 1 DAY AND event.when <= CURDATE() + INTERVAL 2 DAY`,
          );
          break;
        case EventDateFilter.ThisWeek:
          query = query.andWhere(
            'YEARWEEK(event.when, 1) = YEARWEEK(CURDATE(), 1)',
          );
          break;
        case EventDateFilter.NextWeek:
          query = query.andWhere(
            'YEARWEEK(event.when, 1) = YEARWEEK(CURDATE(), 1) + 1',
          );
          break;

        default:
          break;
      }
    }

    return query;
  }
}
