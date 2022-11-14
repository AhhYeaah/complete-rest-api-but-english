import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Account {
  @Column()
  name: string;

  @PrimaryColumn({ unique: true })
  cpf: string;

  @Column({ default: 0, type: 'float' })
  balance: number;
}
