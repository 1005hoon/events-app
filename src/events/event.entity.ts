import { User } from 'src/auth/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column({ name: 'event_date' })
  public when: Date;

  @Column()
  public address: string;

  @OneToMany(() => Attendee, (attendee: Attendee) => attendee.event, {
    eager: true,
  })
  public attendees: Attendee[];

  @ManyToOne(() => User, (user: User) => user.organized, { eager: true })
  organizer: User;

  // virtual property
  attendeesCount?: number;
  attendeeAttending?: number;
  attendeeMaybe?: number;
  attendeeNotAttending?: number;
}
