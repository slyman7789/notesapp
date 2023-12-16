import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import createHttpError, {isHttpError} from "http-errors";
import morgan from "morgan";
import userRoutes from './routes/user.js';
import noteRoutes from "./routes/note.js";

const app = express();
app.use(cors());
app.use(json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.send("Hello Page");
});

app.use("/api/auth", userRoutes)

// define api endpoints
app.use("/api/auth", userRoutes);
app.use("/api/note", noteRoutes);

//error endpoits
app.use((req, res, next)=> {
next(createHttpError(404, "Endpoint not found"));
});

// general errors
app.use((error, req, res) => {
    console.error(error);
    let errorMessage = "An unkown error has occurred";
    let statusCode = 500;
    if(isHttpError(error)) {
      statusCode = error.status;
      errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;