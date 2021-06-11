import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';
import { EventDateFilterDto } from './dto/event-date-filter.dto';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventNotFoundException } from './exception/event-not-found.exception';

describe('EventsController', () => {
  let eventsService: EventsService;
  let eventsController: EventsController;
  let eventsRepository: Repository<Event>;

  beforeEach(() => {
    eventsService = new EventsService(eventsRepository);
    eventsController = new EventsController(eventsService);
  });

  it('should return a list of events', async () => {
    const result = {
      first: 1,
      last: 1,
      limit: 10,
      data: [],
    };

    const spy = jest
      .spyOn(eventsService, 'getEventsWithAttendeeCountFilteredPaginated')
      .mockImplementation((): any => result);

    expect(await eventsController.findAll(new EventDateFilterDto())).toBe(
      result,
    );

    expect(spy).toBeCalledTimes(1);
  });

  it('should throw not found exception and not delete anything if event is not found', async () => {
    const deleteSpy = jest.spyOn(eventsService, 'deleteEvent');
    const findSpy = jest
      .spyOn(eventsService, 'findOne')
      .mockImplementation((): any => undefined);

    try {
      await eventsController.remove(new User(), 1);
    } catch (error) {
      expect(error).toBeInstanceOf(EventNotFoundException);
    }

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledTimes(0);
  });
});
