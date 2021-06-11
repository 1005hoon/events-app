import { NotFoundException } from '@nestjs/common';

export class EventNotFoundException extends NotFoundException {
  constructor(eventId: number) {
    super(`${eventId} 에 해당하는 이벤트를 찾을 수 없습니다`);
  }
}
