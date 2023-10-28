import { ValidationError, validate } from "class-validator";
import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import {
  findCustomerById,
  findUserById,
  handleError,
  linkCustomerToUser,
  unlinkCustomerFromUser,
} from "./serviceLayer";

const router = express.Router();

router.post(
  "/link",
  async (req: Request<{}, {}, { customerId: string }>, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await findUserById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const customer = await findCustomerById(req.body.customerId);

      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Link the customer to the user
      const updatedUser = await linkCustomerToUser(user, customer);

      // Validate the updated user
      const errors: ValidationError[] = await validate(updatedUser);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Save the updated user
      const results = await AppDataSource.getRepository(User).save(updatedUser);

      return res.send(results);
    } catch (error) {
      handleError(res, "Linking customer failed");
    }
  }
);

router.post(
  "/unlink",
  async (req: Request<{}, {}, { customerId: string }>, res: Response) => {
    try {
      const user = await findUserById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const customer = await findCustomerById(req.body.customerId);

      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      // Unlink the customer from the user
      const updatedUser = await unlinkCustomerFromUser(user, customer);

      // Validate the updated user
      const errors: ValidationError[] = await validate(updatedUser);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      // Save the updated user
      const results = await AppDataSource.getRepository(User).save(updatedUser);

      return res.send(results);
    } catch (error) {
      handleError(res, "Unlinking customer failed");
    }
  }
);

export default router;
