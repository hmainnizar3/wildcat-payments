import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { User } from "./User";
import { Payment } from "./Payment";

@Entity()
export class Customer {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  companyName: string;

  @Column()
  country: string;

  @Column()
  active: boolean;

  @Column({ nullable: true })
  businessSegment: string;

  @ManyToMany(() => User, (user) => user.customers)
  users: User[];

  @OneToMany(() => Payment, (payment) => payment.customer)
  payments: Payment[];
}
