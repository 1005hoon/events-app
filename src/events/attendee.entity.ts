import { Expose } from 'class-transformer';
import { User } from 'src/auth/user.entity';
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

  @ManyToOne(() => Event, (event: Event) => event.attendees, { nullable: true })
  @JoinColumn()
  public event: Event;

  @Column()
  public eventId: number;

  @Column('enum', {
    enum: AttendResponse,
    default: AttendResponse.Attending,
  })
  public response: AttendResponse;

  @ManyToOne(() => User, (user: User) => user.attended)
  @Expose()
  public user: User;

  @Column()
  public userId: number;
}
