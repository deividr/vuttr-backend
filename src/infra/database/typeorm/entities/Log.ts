import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('logs')
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  stack: string
}
