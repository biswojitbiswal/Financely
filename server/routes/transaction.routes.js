import {Router} from 'express'
import authVerify from '../middleware/auth.middleware.js'
import {addTransaction, fetchTotalSummary, getAllTransaction, importTransaction} from '../controller/transaction.controller.js'
import {upload} from '../middleware/multer.middleware.js';

const router = Router();

router.route('/add').post(authVerify, addTransaction);
router.route('/summary').get(authVerify, fetchTotalSummary);
router.route("/get").get(authVerify, getAllTransaction);
router.route("/import").post(upload.single('file'), authVerify, importTransaction)

export default router