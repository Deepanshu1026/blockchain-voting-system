import express from "express";
import cors from "cors";
import voterRoutes from "./routes/voter.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/voter", voterRoutes);

app.listen(3001, () =>
    console.log("Backend running on http://localhost:3001")
);
