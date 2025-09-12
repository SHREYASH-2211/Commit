import express from "express";
import {
  startBacktest,
  getBacktestById,
  listBacktests,
} from "../controllers/backtest.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/start", verifyJWT, startBacktest);
router.get("/:id", verifyJWT, getBacktestById);
router.get("/", verifyJWT, listBacktests);

export default router;
