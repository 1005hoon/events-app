import { AuthGuardJwt } from './../auth/auth-guard.jwt';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import CreateEventDto from './dto/create-event.dto';
import UpdateEventDto from './dto/update-event.dto';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventDateFilterDto } from './dto/event-date-filter.dto';
import { PaginationResult } from './pagination/paginator';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';
import { EventNotFoundException } from './exception/event-not-found.exception';

@Controller('events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query() filter: EventDateFilterDto,
  ): Promise<PaginationResult<Event>> {
    return this.eventsService.getEventsWithAttendeeCountFilteredPaginated(
      filter,
      {
        total: true,
        currentPage: filter.page,
        limit: 10,
      },
    );
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Event | undefined> {
    const event = await this.eventsService.getEventWithAttendeeCount(id);
    if (!event) {
      throw new EventNotFoundException(id);
    }
    return event;
  }

  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async createEvent(
    @CurrentUser() user: User,
    @Body() createEventDto: CreateEventDto,
  ) {
    return await this.eventsService.createEvent(createEventDto, user);
  }

  @Patch(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt)
  async updateEvent(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    const event = await this.eventsService.findOne(id);

    if (event.organizer.id !== user.id) {
      throw new ForbiddenException(
        null,
        '이벤트 주최자만 수정 및 삭제가 가능합니다',
      );
    }

    return this.eventsService.updateEvent(event, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    const event = await this.eventsService.findOne(id);

    if (event.organizer.id !== user.id) {
      throw new ForbiddenException(
        null,
        '이벤트 주최자만 수정 및 삭제가 가능합니다',
      );
    }

    await this.eventsService.deleteEvent(id);
  }
}
