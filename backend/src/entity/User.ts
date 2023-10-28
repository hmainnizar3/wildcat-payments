import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";

import { Customer } from "./Customer";
import { Payment } from "./Payment";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  /**
   * We do not want to select this or accidentally return it
   */
  @Column({ select: false })
  password: string;

  @Column()
  active: boolean;

  @ManyToMany(() => Customer, (customer) => customer.users, {
    cascade: true,
  })
  @JoinTable()
  customers: Customer[];

  @OneToMany(() => Payment, (payment) => payment.user)
  payments: Payment[];
}
