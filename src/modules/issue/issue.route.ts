import { Router } from "express";
import { createIssueController, deleteIssueController, getAllIssuesController, getIssueByIdController, updateIssueController } from "./issue.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth() ,createIssueController);
router.get("/", getAllIssuesController);
router.get("/:id", getIssueByIdController);
router.patch("/:id", auth(), updateIssueController);
router.delete("/:id", auth("maintainer"), deleteIssueController);

export const issueRoute = router;