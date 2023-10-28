import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Customer } from "../entity/Customer";

const router = express.Router();

/**
 * Validation is not super duper important for this demo, but it's missing
 * I would use something like express-validator to validate the request body
 *
 * The typing of the responses has also been omitted for the sake of time
 *
 * there are two methods here,
 *
 * This is where users can get registered
 * A customer is automatically assigned to a user
 *
 */
interface RegisterPayload {
  username: string;
  password: string;
}

router.post(
  "/register",
  async (req: Request<{}, {}, RegisterPayload>, res: Response) => {
    // start a new transaction
    try {
      const { username, password } = req.body;

      // encrypt the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create the customer
      const customer = AppDataSource.manager.create(Customer, {
        companyName: `${username}'s Company`,
        country: "DK",
        active: true,
      });

      // save the user, and assign the customer to the user
      // this will cascade save the customer as well and create a record in the user_customer db, so that we could find them later
      const user = await AppDataSource.manager.save(User, {
        username: username ?? "",
        password: hashedPassword ?? "",
        active: true,
        customers: [customer],
      });

      // if all goes well, return a 201, and the user is now registered
      res
        .status(201)
        .json({ message: "User registered successfully", user: user.username });
    } catch (e: any) {
      res.status(500).json({ message: "User registration failed" });
    }
  }
);

/**
 * This is where users can login
 * We first check if the user exists, and then we compare the password
 */
router.post(
  "/login",
  async (req: Request<{}, {}, RegisterPayload>, res: Response) => {
    try {
      // get the jwt secret from the environment variables
      // if it fails, exit early
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(400).json({ message: "Jwt secret not found" });
      }

      // get the username and password from the request body
      const { username, password } = req.body;

      const user = await AppDataSource.manager.findOne(User, {
        where: { username: username },
        // we only care about selecting the password and the id here, and we don't care about the other fields
        select: { password: true, id: true },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res
          .status(400)
          .json({ message: "Invalid username or password" });
      }

      // I've set them to be abnormally high for the sake of this demo
      // so I do not have to login every time
      // in a real world scenario, I would set this to something like 1 hour
      // as well, as I would use refresh tokens to refresh the access token
      const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: "1w",
      });
      res.json({ message: "Logged in successfully", token });

      // errors should be typed here, but I'm omitting it for the sake of time
    } catch (e: any) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  }
);

export default router;
