// server.js
import dotenv from "dotenv";
import 'dotenv/config';
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);


console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? "Loaded ✅" : "Missing ❌");


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server on", PORT));
