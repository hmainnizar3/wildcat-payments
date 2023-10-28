import { Response } from "express";
import { AppDataSource } from "../data-source";
import { Customer } from "../entity/Customer";
import { User } from "../entity/User";

// Middleware to handle errors
export const handleError = (res: Response, message: string, status = 500) => {
  console.error(message);
  res.status(status).json({ message });
};

// Reusable function to find a user by ID
export const findUserById = async (userId: string) => {
  return await AppDataSource.getRepository(User).findOne({
    where: { id: userId },
    relations: ["customers"],
  });
};

// Reusable function to find a customer by ID
export const findCustomerById = async (customerId: string) => {
  return await AppDataSource.getRepository(Customer).findOne({
    where: { id: customerId },
  });
};

// Link a customer to a user
export const linkCustomerToUser = async (user: User, customer: Customer) => {
  const updatedCustomers = user.customers.filter((c) => c.id !== customer.id);
  user.customers = [...updatedCustomers, customer];
  return user;
};

// Unlink a customer from a user
export const unlinkCustomerFromUser = async (
  user: User,
  customer: Customer
) => {
  user.customers = user.customers.filter((c) => c.id !== customer.id);
  return user;
};
