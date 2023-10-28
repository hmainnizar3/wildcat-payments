import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Customer } from "./entity/Customer";
import { Payment } from "./entity/Payment";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "example",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [User, Customer, Payment],
  migrations: [],
  subscribers: [],
});
