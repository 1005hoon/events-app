import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventsService } from './events.service';
import { paginate } from './pagination/paginator';

jest.mock('./pagination/paginator');

describe('EventsService', () => {
  let service: EventsService;
  let repository: Repository<Event>;
  let selectQb;
  let deleteQb;
  let mockedPaginator;

  beforeEach(async () => {
    mockedPaginator = paginate as jest.Mock;
    selectQb = {
      delete: jest.fn().mockReturnValue(deleteQb),
      orderBy: jest.fn(),
      leftJoinAndSelect: jest.fn(),
      where: jest.fn(),
    };

    deleteQb = {
      where: jest.fn(),
      execute: jest.fn(),
    };

    // create testing module
    const module = await Test.createTestingModule({
      // provide event service
      providers: [
        EventsService,
        // provide constructor
        {
          // we use events repository
          provide: getRepositoryToken(Event),
          // methods to be used in service using repository
          useValue: {
            createQueryBuilder: jest.fn().mockReturnValue(selectQb),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  describe('updateEvent method', () => {
    it('should update the event', async () => {
      const repoSpy = jest
        .spyOn(repository, 'save')
        .mockResolvedValue({ id: 1 } as Event);

      expect(
        service.updateEvent(new Event({ id: 1 }), {
          name: 'test event',
        }),
      ).resolves.toEqual({ id: 1 });

      expect(repoSpy).toBeCalledWith({ id: 1, name: 'test event' });
    });
  });

  describe('deleteEvent method', () => {
    it('should delete an event', async () => {
      const createQbSpy = jest.spyOn(repository, 'createQueryBuilder');
      const deleteSpy = jest
        .spyOn(selectQb, 'delete')
        .mockReturnValue(deleteQb);
      const whereSpy = jest.spyOn(deleteQb, 'where').mockReturnValue(deleteQb);
      const executeSpy = jest.spyOn(deleteQb, 'execute');

      expect(service.deleteEvent(1)).resolves.toBe(undefined);

      expect(createQbSpy).toHaveBeenCalledTimes(1);
      expect(createQbSpy).toHaveBeenCalledWith('e');
      expect(deleteSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('id = :id', { id: 1 });
      expect(executeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getEventsAttendedByUserIdPaginated', () => {
    it('should return a list of paginated events', async () => {
      const createQbSpy = jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValue(selectQb);
      const orderBySpy = jest
        .spyOn(selectQb, 'orderBy')
        .mockReturnValue(selectQb);
      const leftJoinSpy = jest
        .spyOn(selectQb, 'leftJoinAndSelect')
        .mockReturnValue(selectQb);
      const whereSpy = jest.spyOn(selectQb, 'where').mockReturnValue(selectQb);

      mockedPaginator.mockResolvedValue({
        first: 1,
        last: 1,
        total: 10,
        limit: 10,
        data: [],
      });

      expect(
        service.getEventsAttendedByUserIdPaginated(123, {
          currentPage: 1,
          limit: 10,
        }),
      ).resolves.toEqual({ first: 1, last: 1, total: 10, limit: 10, data: [] });

      expect(createQbSpy).toHaveBeenCalledTimes(1);
      expect(createQbSpy).toHaveBeenCalledWith('e');

      expect(orderBySpy).toHaveBeenCalledTimes(1);
      expect(orderBySpy).toHaveBeenCalledWith('e.id', 'DESC');

      expect(leftJoinSpy).toHaveBeenCalledTimes(1);
      expect(leftJoinSpy).toHaveBeenCalledWith('e.attendees', 'a');

      expect(whereSpy).toHaveBeenCalledTimes(1);
      expect(whereSpy).toHaveBeenCalledWith('a.userId = :userId', {
        userId: 123,
      });

      expect(mockedPaginator).toHaveBeenCalledTimes(1);
      expect(mockedPaginator).toHaveBeenCalledWith(selectQb, {
        currentPage: 1,
        limit: 10,
      });
    });
  });
});
