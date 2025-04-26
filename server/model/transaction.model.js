import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    addBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    transType: {
        type: String,
        enum: ['Income', 'Expense'],
        required: true,
    },
    transName: {
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
        min: 1,
    },
    paymentMode: {
        type: String,
        enum: ['Cash', 'UPI', 'Credit Card', 'Debit Card'],
        default: 'Cash',
    },
    date: {
        type: Date,
        required: true,
        
    },
    tag:{
        type: String,
        required: true,
        enum: ['Salary', 'Freelancing', 'Investment', 'Bonus', 'Education', 'Food', 'Health', 'Investment', 'Recharge', 'Rent', 'Transport', 'Bill', 'Others']
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    frequency: {
        type: String,
        enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUATERLY', 'HALF_YEARLY', 'YEARLY'],
        required: function() {
            return this.isRecurring === true;
        }
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    lastGeneratedDate: {
        type: Date
    },
    generatedFromRecurring: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, {timestamps: true})

export const Transaction = mongoose.model("Transaction", transactionSchema);