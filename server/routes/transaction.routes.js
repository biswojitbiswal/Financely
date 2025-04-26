import {Router} from 'express'
import authVerify from '../middleware/auth.middleware.js'
import {addTransaction, fetchTotalSummary, getAllTransaction, importTransaction, incomeAnalytic, expenseAnalytic, deleteById, handleEditById, handleBalanceReset, triggerRecurringTransactions, getAllRecurringTransactions, toggleRecurringStatus} from '../controller/transaction.controller.js'
import {upload} from '../middleware/multer.middleware.js';

const router = Router();

router.route('/add').post(authVerify, addTransaction);
router.route('/summary').get(authVerify, fetchTotalSummary);
router.route("/get").get(authVerify, getAllTransaction);
router.route("/import").post(upload.single('file'), authVerify, importTransaction)
router.route("/income/:timeRange").get(authVerify, incomeAnalytic)
router.route("/expense/:timeRange").get(authVerify, expenseAnalytic)
router.route("/delete/:id").delete(authVerify, deleteById)
router.route("/edit/:id").patch(authVerify, handleEditById)
router.route("/reset").delete(authVerify, handleBalanceReset)

router.route("/recurring/create").post(triggerRecurringTransactions);

router.route("/recurring").get(authVerify, getAllRecurringTransactions)
router.route('/recurring/:id/toggle-status').patch(authVerify, toggleRecurringStatus);
export default router