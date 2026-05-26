import { Router } from "express";
import { createIssueController } from "./issue.controller";

const router = Router();

router.post("/", createIssueController);

export const issueRoute = router;