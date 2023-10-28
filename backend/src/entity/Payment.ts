import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Customer } from "./Customer";
import { User } from "./User";

enum SUPPORTED_CURRENCIES {
  DKK = "DKK",
  EUR = "EUR",
  USD = "USD",
  GBP = "GBP",
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  /**
   * This is the payment reference id
   * It should be decoupled from the primary ID key because I've imagined a scenario where we migrate database for example
   * and the primary keys there are different for whatever reason.
   */
  @Column({ unique: true })
  paymentRefId: string;

  // This is a special PGQL type, it's a timestamp with timezone.
  // During my dev, I found out that it stores it in UTC.
  // Not sure if the docker container is running in UTC or if it's a PGQL thing.

  @Column({ type: "timestamptz" })
  date: Date;

  @Column()
  amount: number;

  @Column({ type: "varchar", enum: SUPPORTED_CURRENCIES })
  currency: string;

  @Column()
  thirdParty: string;

  @ManyToOne(() => Customer)
  @JoinColumn()
  customer: Customer;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
