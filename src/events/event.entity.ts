import { Expose } from 'class-transformer';
import { User } from './../auth/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { PaginationResult } from './pagination/paginator';

@Entity()
export class Event {
  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  @Expose()
  public id: number;

  @Column()
  @Expose()
  public name: string;

  @Column()
  @Expose()
  public description: string;

  @Column({ name: 'event_date' })
  @Expose()
  public when: Date;

  @Column()
  @Expose()
  public address: string;

  @OneToMany(() => Attendee, (attendee: Attendee) => attendee.event, {
    eager: true,
  })
  @Expose()
  public attendees: Attendee[];

  @ManyToOne(() => User, (user: User) => user.organized, { eager: true })
  @Expose()
  organizer: User;

  @Column({ nullable: true })
  organizerId: number;

  // virtual property
  @Expose()
  attendeesCount?: number;
  @Expose()
  attendeeAttending?: number;
  @Expose()
  attendeeMaybe?: number;
  @Expose()
  attendeeNotAttending?: number;
}

export type PaginatedEvents = PaginationResult<Event>;
