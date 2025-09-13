import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import backtestRoutes from "./routes/backtest.routes.js";
const app   = express();

app.use(cors({
    origin: process.env.PORT,
    credentials: true
}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import userRouter from "./routes/user.routes.js";
// ...existing code...
import strategyRouter from "./routes/strategyRoutes.js";
// ...existing code...
app.use("/api/v1/strategies", strategyRouter);
//Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/backtests", backtestRoutes);
//http://localhost:8000/api/v1/users/register

export default app;