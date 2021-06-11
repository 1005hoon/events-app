import { AuthGuardJwt } from './../auth/auth-guard.jwt';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttendeesService } from './attendees.service';
import { EventsService } from './events.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('events-attendance')
@SerializeOptions({ strategy: 'excludeAll' })
export class CurrentUserEventAttendanceController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendeeService: AttendeesService,
  ) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ) {
    return await this.eventsService.getEventsAttendedByUserIdPaginated(
      user.id,
      {
        currentPage: page,
        limit: 5,
      },
    );
  }

  @Get(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(
    @CurrentUser() user: User,
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    const attendee = await this.attendeeService.findOneByEventIdAndUserId(
      eventId,
      user.id,
    );

    if (!attendee) {
      throw new NotFoundException();
    }
    return attendee;
  }

  @Put(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseGuards(AuthGuardJwt)
  async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() createAttendeeDto: CreateAttendeeDto,
    @CurrentUser() user: User,
  ) {
    return this.attendeeService.createOrUpdate(
      createAttendeeDto,
      user.id,
      eventId,
    );
  }
}
