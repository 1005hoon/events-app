import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AttendResponse } from './enum/attendee-response.enum';
import { Event } from './event.entity';

@Entity()
export class Attendee {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @ManyToOne(() => Event, (event: Event) => event.attendees)
  @JoinColumn()
  public event: Event;

  @Column('enum', {
    enum: AttendResponse,
    default: AttendResponse.Attending,
  })
  response: AttendResponse;
}
