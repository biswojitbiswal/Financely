import nodeCron from 'node-cron';
import processRecurringTransactions from '../services/recurring.services.js';


const initializeRecurringTransactions = () => {
    nodeCron.schedule("0 0 * * *", processRecurringTransactions, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });

    console.log("Recurring Transaction Scheduler Initialized With Node-Cron")
}

export default initializeRecurringTransactions;
