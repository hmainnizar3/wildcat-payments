import express, { Request, Response } from "express";

import { randomUUID } from "crypto";
import { Between, FindOptionsWhere } from "typeorm";
import { AppDataSource } from "../data-source";
import { Payment } from "../entity/Payment";
import { findCustomerById, findUserById, handleError } from "./serviceLayer";

const router = express.Router();

interface CreateRequest {
  thirdParty: string;
  amount: number;
  currency: string;
  onBehalfOf: string;
}

interface PaymentRequestFilter {
  page: number;
  perPage: number;
  customerFilter: string | undefined;
  paymentRef: string | undefined;
  from: string | undefined;
  to: string | undefined;
}

router.get(
  "/",
  async (req: Request<{}, {}, {}, PaymentRequestFilter>, res: Response) => {
    try {
      // pagination logic
      const page = req.query.page || 1;
      const perPage = req.query.perPage || 3;
      const skip = (page - 1) * perPage;

      const user = await findUserById(req.user.id);

      // this user not found could probably be included directly in the findUserById
      // so that we exit early in the flow
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // we prepare our filters here
      const where: FindOptionsWhere<Payment> = {
        user: user,
        customer:
          user.customers.find((c) => c.id === req.query.customerFilter) ??
          undefined,
        paymentRefId: req.query.paymentRef ?? undefined,
      };

      if (req.query.from !== undefined && req.query.to !== undefined) {
        const fromDate = new Date(req.query.from);
        const toDate = new Date(req.query.to);

        // this is to make sure that the between query is inclusive for the dates
        toDate.setHours(23, 59, 59, 999);
        where.date = Between(fromDate, toDate);
      }

      // get the payments after we've filtered them
      const [payments, total] = await AppDataSource.getRepository(
        Payment
      ).findAndCount({
        where,
        skip: skip,
        take: perPage,
        relations: ["customer"],
        order: {
          date: "DESC",
        },
      });

      // calculate the total number of pages
      const totalPages = Math.ceil(total / perPage);

      // return the payments
      res.status(200).json({
        payments,
        page,
        perPage,
        total,
        totalPages,
      });
    } catch (error) {
      handleError(res, "An error occurred while fetching the payments");
    }
  }
);

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const payment = await AppDataSource.getRepository(Payment).findOneBy({
      paymentRefId: req.params.id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ payment });
  } catch (error) {
    handleError(res, "An error occurred while fetching the payment");
  }
});

router.post(
  "/create",
  async (req: Request<{}, {}, CreateRequest>, res: Response) => {
    const { thirdParty, amount, currency, onBehalfOf } = req.body;
    const user = await findUserById(req.user.id);
    const customer = await findCustomerById(onBehalfOf);

    // could also be part of a validation layer of some sorts
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    try {
      if (user.active && user.customers.some((c) => c.id === onBehalfOf)) {
        const payment = await AppDataSource.manager.save(Payment, {
          amount,
          currency,
          date: new Date(),
          paymentRefId: randomUUID(),
          thirdParty,
          customer,
          user,
        });

        const paymentWithoutUser = {
          amount: payment.amount,
          currency: payment.currency,
          date: payment.date,
          paymentRefId: payment.paymentRefId,
          thirdParty: payment.thirdParty,
        };

        res.status(201).json({ ...paymentWithoutUser });
      } else {
        handleError(res, "Payment failed ❌", 500);
      }
    } catch (e: any) {
      handleError(res, "User registration failed");
    }
  }
);

export default router;
