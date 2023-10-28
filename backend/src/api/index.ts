import express from "express";

import passport from "passport";
import auth from "./auth";
import customers from "./customers";
import payments from "./payments";
import users from "./users";

const router = express.Router();

// Auth route
router.use("/auth", auth);

// Protected routes

// Could add swagger to document the API
router.use("/users", passport.authenticate("jwt", { session: false }), users);
router.use(
  "/payments",
  passport.authenticate("jwt", { session: false }),
  payments
);
router.use(
  "/customers",
  passport.authenticate("jwt", { session: false }),
  customers
);
export default router;
