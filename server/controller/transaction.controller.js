import { Transaction } from "../model/transaction.model.js";
import processCSV from "../utils/processCsv.util.js";
import mongoose from "mongoose";
import fs from "fs";
import processRecurringTransactions from "../services/recurring.services.js";

const addTransaction = async (req, res) => {
  try {
    const { transName, amount, type, date, tag, paymentMode, isRecurring, frequency, startDate, endDate } = req.body;

    if (
      [transName, amount, type, date, tag, paymentMode].some(
        (field) => field?.toString().trim() === ""
      )
    ) {
      return res.status(400).json({ message: "All Fields Are Required!" });
    }

    if(isRecurring){
      if(!frequency){
        return res.status(400).json({ message: "Frequency is required for recurring transactions" });
      }
      if(!startDate){
        return res.status(400).json({ message: "Start date is required for recurring transactions" });
      }
    }

    const transaction = new Transaction({
      addBy: req.user?._id,
      transType: type,
      transName,
      amount,
      date,
      tag,
      paymentMode,
      isRecurring,
      frequency: isRecurring ? frequency : undefined,
      startDate: isRecurring ? startDate : undefined,
      endDate: isRecurring ? endDate : undefined,
      lastGeneratedDate: isRecurring ? new Date(startDate) : undefined,
      generatedFromRecurring: isRecurring ? true : false,
      isActive: isRecurring ? true : false,
    });

    await transaction.save();

    if (!transaction) {
      return res.status(401).json({ message: "Something Went Wrong" });
    }

    return res.status(200).json({
      message: "Transaction Added",
      transaction: transaction,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const importTransaction = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log(req.file.path);
    const transactions = await processCSV(req.file.path);

    transactions.forEach((transaction) => {
      transaction.addBy = req.user._id;
    });

    await Transaction.insertMany(transactions);

    fs.unlinkSync(req.file.path);

    return res
      .status(200)
      .json({ message: "Transactions imported successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const fetchTotalSummary = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { year = new Date().getFullYear(), month = new Date().getMonth() } =
      req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);

    const totalIncome = await Transaction.aggregate([
      {
        $match: {
          addBy: userId,
          transType: "Income",
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Transaction.aggregate([
      {
        $match: {
          addBy: userId,
          transType: "Expense",
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const income = totalIncome[0]?.total || 0;
    const expense = totalExpense[0]?.total || 0;
    const balance = income - expense;

    return res.status(200).json({
      income,
      expense,
      balance,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllTransaction = async (req, res) => {
  try {
    const userId = req.user?._id;
    const {
      sortBy = "createdAt",
      sortOrder = "dsc",
      search = "",
      filter = "",
      year = new Date().getFullYear(),
      month = new Date().getMonth(),
    } = req.query;

    // console.log(year, month);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    let query = { addBy: userId };

    if (search) {
      query.$or = [
        { transName: { $regex: search, $options: "i" } },
        { tag: { $regex: search, $options: "i" } },
      ];
    }

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      endDate.setHours(23, 59, 59, 999);
      // console.log(startDate, endDate)
      query.date = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (filter) {
      query.$and = query.$and || [];
      query.$and.push({
        $or: [
          { transType: { $regex: filter, $options: "i" } },
          { paymentMode: { $regex: filter, $options: "i" } },
        ],
      });
    }

    const sortOption = {};

    if (sortBy === "date") {
      sortOption.date = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "amount") {
      sortOption.amount = sortOrder === "asc" ? 1 : -1;
    } else if (sortBy === "createdAt") {
      sortOption.createdAt = sortOrder === "asc" ? 1 : -1;
    }

    const transactions = await Transaction.find(query).sort(sortOption);

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({ message: "Transaction Not Found" });
    }

    return res.status(200).json(transactions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const incomeAnalytic = async (req, res) => {
  try {
    const { timeRange } = req.params;
    const { year, month } = req.query;

    let startDate, endDate;
    const currentMonth = new Date();

    if (year && month) {
      const selectedYear = parseInt(year);
      const selectedMonth = parseInt(month);

      if (
        timeRange === "weekly" &&
        selectedYear === new Date().getFullYear() &&
        selectedMonth === new Date().getMonth() + 1
      ) {
        startDate = new Date(); 
        startDate.setDate(startDate.getDate() - 7);
        endDate = new Date();
      } else if (timeRange === "monthly") {
        startDate = new Date(selectedYear, selectedMonth - 1, 1);
        endDate = new Date(selectedYear, selectedMonth, 0);
        endDate.setHours(23, 59, 59, 999);
      } else if (timeRange === "yearly") {
        startDate = new Date(selectedYear - 1, selectedMonth - 1, 1);
        endDate = new Date(selectedYear, selectedMonth, 0);
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate = new Date(selectedYear, selectedMonth - 1, 1);
        endDate = new Date(selectedYear, selectedMonth, 0);
        endDate.setHours(23, 59, 59, 999);
      }
    }

    const incomeData = await Transaction.aggregate([
      {
        $match: {
          addBy: req.user._id,
          transType: "Income",
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $sort: { date: 1 },
      },
      {
        $project: {
          _id: 0,
          x: "$date",
          y: "$amount",
        },
      },
    ]);

    return res.status(200).json({ chartData: incomeData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Errors" });
  }
};

const expenseAnalytic = async (req, res) => {
  try {
    const { timeRange } = req.params;
    const { year, month } = req.query;

    let startDate, endDate;
    const currentMonth = new Date();

    if (year && month) {
      const selectedYear = parseInt(year);
      const selectedMonth = parseInt(month);

      if (
        timeRange === "weekly" &&
        selectedYear === new Date().getFullYear() &&
        selectedMonth === new Date().getMonth() + 1
      ) {
        startDate = new Date(); 
        startDate.setDate(startDate.getDate() - 7);
        endDate = new Date();
      } else if (timeRange === "monthly") {
        startDate = new Date(selectedYear, selectedMonth - 1, 1);
        endDate = new Date(selectedYear, selectedMonth, 0);
        endDate.setHours(23, 59, 59, 999);
      } else if (timeRange === "yearly") {
        startDate = new Date(selectedYear - 1, selectedMonth - 1, 1);
        endDate = new Date(selectedYear, selectedMonth, 0);
        endDate.setHours(23, 59, 59, 999);
      } else {
        startDate = new Date(selectedYear, selectedMonth - 1, 1);
        endDate = new Date(selectedYear, selectedMonth, 0);
        endDate.setHours(23, 59, 59, 999);
      }
    }

    const expenseData = await Transaction.aggregate([
      {
        $match: {
          addBy: req.user._id,
          date: {
            $gte: startDate,
            $lte: endDate,
          },
          transType: "Expense",
        },
      },
      {
        $group: {
          _id: "$tag",
          totalAmount: { $sum: "$amount" },
        },
      },
      {
        $project: {
          label: "$_id",
          value: "$totalAmount",
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({ chartData: expenseData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Errors" });
  }
};

const deleteById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction Not Found" });
    }

    return res.status(200).json({ message: "Transaction Deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Errors" });
  }
};

const handleEditById = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      transName, 
      amount, 
      tag, 
      paymentMode, 
      date, 
      isRecurring, 
      frequency, 
      startDate, 
      endDate 
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }

    if (
      [transName, date, tag, paymentMode].some(
        (field) => field?.trim() === ""
      ) ||
      amount === undefined
    ) {
      return res.status(400).json({ message: "Basic Fields Are Required!" });
    }

    if (isRecurring) {
      if (!frequency || !startDate || !endDate) {
        return res.status(400).json({ 
          message: "Frequency and Start Date are required for recurring transactions" 
        });
      }
    }

    const updateObject = {
      transName,
      amount,
      date,
      tag,
      paymentMode,
      isRecurring: Boolean(isRecurring)
    };

    if (isRecurring) {
      updateObject.frequency = frequency;
      updateObject.startDate = startDate;
      updateObject.endDate = endDate || null;
    } else {
      updateObject.frequency = null;
      updateObject.startDate = null;
      updateObject.endDate = null;
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { $set: updateObject },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction Not Found" });
    }

    return res
      .status(200)
      .json({ message: "Transaction Updated", transaction });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Errors" });
  }
};

const handleBalanceReset = async (req, res, next) => {
  try {
    const { year = new Date().getFullYear(), month = new Date().getMonth() } =
      req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999)

    const deleteTransaction = await Transaction.deleteMany({
      addBy: req.user?._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });

    // console.log(deleteTransaction)
    if (!deleteTransaction) {
      return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json({ message: "Balance Reset Successful!" });
  } catch (error) {
    next(error);
  }
};

const triggerRecurringTransactions = async(req, res, next) =>{
  try {

    await processRecurringTransactions();

    return res.status(200).json({
      message: "Recurring transactions processing triggered successfully",
    });
  } catch (error) {
    next(error);
  }
}

const getAllRecurringTransactions = async (req, res, next) => {
  try {
      const userId = req.user?._id;
      const transactions = await Transaction.find({
        addBy: userId,
        isRecurring: true,
      }).sort({ createdAt: -1 });

      if(!transactions || transactions.length === 0) {
        return res.status(404).json({ message: "No Recurring Transactions Found" });
      }

      return res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
}

const toggleRecurringStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (!transaction.isRecurring) {
      return res.status(400).json({ message: "This is not a recurring transaction" });
    }

    // Toggle the status
    transaction.isActive = !transaction.isActive;
    await transaction.save();

    return res.status(200).json({
      message: `Transaction ${transaction.isActive ? 'activated' : 'paused'} successfully`,
      transaction
    });
  } catch (error) {
    console.error('Error toggling status:', error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export {
  addTransaction,
  importTransaction,
  fetchTotalSummary,
  getAllTransaction,
  incomeAnalytic,
  expenseAnalytic,
  deleteById,
  handleEditById,
  handleBalanceReset,
  triggerRecurringTransactions,
  getAllRecurringTransactions,
  toggleRecurringStatus
};
