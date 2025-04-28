import { Router } from "express";
import processRecurringTransactions from "../services/recurring.services.js";

const router = Router();

router.route("/api/recurring-transactions").get(processRecurringTransactions);

export default router;