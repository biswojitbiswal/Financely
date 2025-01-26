import {Router} from 'express'
import authVerify from '../middleware/auth.middleware.js'
import {addTransaction, fetchTotalSummary, getAllTransaction} from '../controller/transaction.controller.js'

const router = Router();

router.route('/add').post(authVerify, addTransaction);
router.route('/summary').get(authVerify, fetchTotalSummary);
router.route("/get").get(authVerify, getAllTransaction);

export default router