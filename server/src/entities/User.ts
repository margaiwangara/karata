import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Game } from './Game';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  // @Column({ default: 1 })
  // level: number;

  @Column({ default: 0 })
  points: number;

  @OneToMany(() => Game, (game) => game.player)
  games: Game[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
