import { Event } from './event.entity';

test('Event Entity should be initialized through constructor', () => {
  const event = new Event({
    name: 'test event',
    description: 'testing event entity',
    id: undefined,
    when: undefined,
    address: undefined,
    attendees: undefined,
    organizer: undefined,
    organizerId: undefined,
    attendeesCount: undefined,
    attendeeNotAttending: undefined,
    attendeeAttending: undefined,
    attendeeMaybe: undefined,
  });

  expect(event).toEqual({
    name: 'test event',
    description: 'testing event entity',
  });
});
