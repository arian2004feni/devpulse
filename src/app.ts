import express, {
  type Application,
  type Request,
  type Response,
} from "express";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  console.log("server hello");
  res.send("Hello World!");
});

export default app;
