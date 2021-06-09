import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import CreateEventDto from './dto/create-event.dto';
import UpdateEventDto from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    console.log(createEventDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
