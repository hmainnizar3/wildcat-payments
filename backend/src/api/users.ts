import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const router = express.Router();

// Fetches relevant information for you personal profile
// including the customers that are tied to this user
router.get("/me", async (req: Request<{}, {}, {}>, res: Response) => {
  try {
    // this comes from the middleware in src/middleware/auth.ts
    // it's populated by passport when the auth the comparison is successful
    if (req.user) {
      const user = await AppDataSource.getRepository(User).findOne({
        where: { id: req.user.id },
        relations: ["customers"],
      });

      res.json({
        user,
      });
    }
  } catch (e: any) {
    res.status(500).json({ message: "Fetching personal information failed" });
  }
});

export default router;
