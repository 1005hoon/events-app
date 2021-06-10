import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateEventDto from './dto/create-event.dto';
import UpdateEventDto from './dto/update-event.dto';
import { Event } from './event.entity';

@Controller('events')
export class EventsController {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  @Get()
  async findAll(): Promise<Event[]> {
    return this.eventsRepository.find();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Event> {
    console.log(typeof id);

    return this.eventsRepository.findOne({ id });
  }

  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    const when = new Date(createEventDto.when);

    const newEvent = this.eventsRepository.create({
      ...createEventDto,
      when,
    });

    await this.eventsRepository.save(newEvent);
    return newEvent;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const event = await this.findOne(id);
    const updatedPost = {
      ...event,
      ...updateEventDto,
      when: updateEventDto.when ? new Date(updateEventDto.when) : event.when,
    };
    await this.eventsRepository.update(+id, updatedPost);
    return updatedPost;
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const event = await this.findOne(id);
    await this.eventsRepository.remove(event);
  }
}
