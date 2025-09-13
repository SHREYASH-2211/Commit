import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import backtestRoutes from "./routes/backtest.routes.js";
import geminiRouter from './gemini/gemini.js';
const app   = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:8080",
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
app.use("/api/v1/backtest", backtestRoutes);
app.use('/api/gemini', geminiRouter);
//http://localhost:8000/api/v1/users/register

export default app;