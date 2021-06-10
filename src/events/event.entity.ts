import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  public id: number;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column({ name: 'event_date' })
  when: Date;
  @Column()
  address: string;
}
