import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issue/issue.route";

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  console.log("server hello");
  res.send("Hello World!");
});

app.use("/api/auth", authRoute)
app.use("/api/issues", issueRoute)

export default app;
