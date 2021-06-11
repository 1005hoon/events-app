import { Profile } from './profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from 'src/events/event.entity';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @Expose()
  public id: number;

  @Column({ unique: true })
  @Expose()
  public username: string;

  @Column()
  @Exclude()
  public password: string;

  @Column({ unique: true })
  @Expose()
  public email: string;

  @Column()
  @Expose()
  public firstName: string;

  @Column()
  @Expose()
  public lastName: string;

  @OneToOne(() => Profile)
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Event, (event: Event) => event.organizer)
  @Expose()
  organized: Event[];
}
