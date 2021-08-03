import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User';

@Entity('game')
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // @Column({ default: 1 })
  // level: number;

  @Column({ default: 0 })
  points: number;

  @Column()
  playerId: number;

  @ManyToOne(() => User, (user) => user.games)
  player: User;

  @CreateDateColumn()
  createdAt: Date;
}
