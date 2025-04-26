import { Transaction } from "../model/transaction.model.js";
import {calculateNextGenerateDate} from "../utils/date.utils.js";

const processRecurringTransactions = async () => {
    try {
        // console.log("Processing recurring transaction...", new Date());

        // Get current date in IST
        const currentDate = new Date();
        // Convert to IST
        const currentDateIST = new Date(currentDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        currentDateIST.setHours(0, 0, 0, 0);
        
        // console.log("Current date for processing (IST):", currentDateIST.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

        const recurringTransactions = await Transaction.find({
            isRecurring: true,
            isActive: true,
        });

        if (!recurringTransactions || recurringTransactions.length === 0) {
            console.log("No Active recurring transaction found");
            return;
        }

        console.log(`Found ${recurringTransactions.length} recurring transactions`);

        for (const transaction of recurringTransactions) {
            try {
                // console.log(`Processing transaction: ${transaction._id}, name: ${transaction.transName}, frequency: ${transaction.frequency}`);
                
                // Check if endDate has passed
                if (transaction.endDate) {
                    const endDate = new Date(transaction.endDate);
                    if (endDate < currentDateIST) {
                        console.log(`Transaction ${transaction._id} has passed end date`);
                        transaction.isActive = false;
                        await transaction.save();
                        continue;
                    }
                }

                // Determine the last generated date
                let lastGenDate;
                if (transaction.lastGeneratedDate) {
                    lastGenDate = new Date(transaction.lastGeneratedDate);
                } else if (transaction.startDate) {
                    lastGenDate = new Date(transaction.startDate);
                } else {
                    lastGenDate = new Date(transaction.createdAt);
                }

                // console.log(`Last generated date for ${transaction.transName}: ${lastGenDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`);

                // Check if startDate is in the future
                if (transaction.startDate) {
                    const startDate = new Date(transaction.startDate);
                    if (startDate > currentDateIST) {
                        console.log(`Transaction ${transaction._id} start date is in future`);
                        continue;
                    }
                }

                let checkDate = new Date(lastGenDate);
                const MAX_TRANSACTIONS_TO_GENERATE = 10;
                let transactionGenerated = 0;
                let latestGeneratedDate = null;

                while (transactionGenerated < MAX_TRANSACTIONS_TO_GENERATE) {
                    checkDate = await calculateNextGenerateDate(checkDate, transaction.frequency);
                    
                    if (!checkDate || isNaN(checkDate.getTime())) {
                        console.error("Invalid next date calculated");
                        break;
                    }
                    
                    // console.log(`Next generation date for ${transaction.transName}: ${checkDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`);
                    
                    // Compare dates in IST
                    const checkDateIST = new Date(checkDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
                    checkDateIST.setHours(0, 0, 0, 0);
                    
                    if (checkDateIST > currentDateIST) {
                        console.log("Next date is in future, breaking loop");
                        break;
                    }

                    // Check for existing transaction on this date to prevent duplicates
                    const existingTransaction = await Transaction.findOne({
                        addBy: transaction.addBy,
                        transType: transaction.transType,
                        transName: transaction.transName,
                        amount: transaction.amount,
                        date: {
                            $gte: new Date(checkDate.setHours(0, 0, 0, 0)),
                            $lt: new Date(checkDate.setHours(23, 59, 59, 999))
                        },
                        generatedFromRecurring: true
                    });

                    if (existingTransaction) {
                        // console.log(`Transaction already exists for ${transaction.transName} on ${checkDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`);
                        latestGeneratedDate = checkDate;
                        continue;
                    }

                    const newTransaction = new Transaction({
                        addBy: transaction.addBy,
                        transType: transaction.transType,
                        transName: transaction.transName,
                        amount: transaction.amount,
                        date: new Date(checkDate),
                        tag: transaction.tag,
                        paymentMode: transaction.paymentMode,
                        isRecurring: false,
                        generatedFromRecurring: true,
                    });

                    await newTransaction.save();
                    transactionGenerated++;
                    latestGeneratedDate = checkDate;
                    // console.log(`Generated transaction for ${transaction.transName} on date: ${checkDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`);
                }

                // Update lastGeneratedDate even if no new transactions were generated
                if (latestGeneratedDate) {
                    transaction.lastGeneratedDate = latestGeneratedDate;
                    await transaction.save();
                    // console.log(`Updated last generated date for ${transaction.transName} to: ${latestGeneratedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })}`);
                }

                console.log(`Generated ${transactionGenerated} transactions for ${transaction.transName}`);
            } catch (error) {
                console.error(`Error processing transaction ${transaction._id}:`, error);
            }
        }

        console.log("Recurring transaction processed successfully");
    } catch (error) {
        console.error("Error processing recurring transactions:", error);
        return error;
    }
};

export default processRecurringTransactions;