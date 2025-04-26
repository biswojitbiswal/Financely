import { Transaction } from "../model/transaction.model.js";
import {
    calculateNextGenerateDate,
    calculatePreviousDate,
} from "../utils/date.utils.js";

const processRecurringTransactions = async () => {
    try {
        console.log("Processing recurring transaction...", new Date());

        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0);

        const recurringTransactions = await Transaction.find({
            isRecurring: true,
            isActive: true,
        });

        if (!recurringTransactions || recurringTransactions.length === 0) {
            console.log("No Active recurring transaction found");
            return;
        }

        for (const transaction of recurringTransactions) {
            try {
                if (transaction.endDate) {
                    const endDate = new Date(transaction.endDate);
                    endDate.setUTCHours(0, 0, 0, 0);
                    if (endDate < currentDate) {
                        transaction.isActive = false;
                        await transaction.save();
                        continue;
                    }
                }

                let lastGenDate;
                if (transaction.lastGeneratedDate) {
                    lastGenDate = new Date(transaction.lastGeneratedDate);
                } else if (transaction.startDate) {
                    lastGenDate = new Date(transaction.startDate);
                } else {
                    lastGenDate = new Date(transaction.createdAt);
                }

                lastGenDate.setUTCHours(0, 0, 0, 0);

                const nextDate = await calculateNextGenerateDate(
                    lastGenDate,
                    transaction.frequency
                );

                if (!nextDate || isNaN(nextDate.getTime())) {
                    console.log("Invalid nextdate");
                    continue;
                }


                if (transaction.startDate) {
                    const startDate = new Date(transaction.startDate);
                    startDate.setUTCHours(0, 0, 0, 0);

                    if (startDate > currentDate) {
                        console.log("Startdate is in future");
                        continue;
                    }
                }

                let checckDate = new Date(nextDate);
                checckDate.setUTCHours(0, 0, 0, 0);

                const MAX_TRANSACTIONS_TO_GENERATE = 10;
                let transactionGenerated = 0;

                while (
                    checckDate <= currentDate &&
                    transactionGenerated < MAX_TRANSACTIONS_TO_GENERATE
                ) {
                    const newTransaction = new Transaction({
                        addBy: transaction.addBy,
                        transType: transaction.transType,
                        transName: transaction.transName,
                        amount: transaction.amount,
                        date: new Date(checckDate),
                        tag: transaction.tag,
                        paymentMode: transaction.paymentMode,
                        isRecurring: false,
                        generatedFromRecurring: true,
                    });

                    await newTransaction.save();
                    transactionGenerated++;
                    
                    checckDate = await calculateNextGenerateDate(
                        checckDate,
                        transaction.frequency
                    );

                    if (!checckDate || isNaN(checckDate.getTime())) {
                        console.error("Error while calculating next date");
                        break;
                    }
                }

                if (transactionGenerated > 0) {
                    const lastGenerated = await calculatePreviousDate(
                        checckDate,
                        transaction.frequency
                    );
                    if (lastGenerated instanceof Date && !isNaN(lastGenerated.getTime())) {
                        transaction.lastGeneratedDate = lastGenerated;
                        await transaction.save();
                        console.log("Update Last generated Date");
                    } else {
                        console.error("Invalid date from calculatePreviousDate:", lastGenerated);
                    }
                }
            } catch (error) {
                console.log("Error processing recurring transactions", error);
            }
        }

        console.log("Recurring transaction processed successfully");
    } catch (error) {
        console.error("Error processing recurring transactions:", error);
        return error;
    }
};

export default processRecurringTransactions;