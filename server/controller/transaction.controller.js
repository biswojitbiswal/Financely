import { Transaction } from "../model/transaction.model.js";
import processCSV from "../utils/processCsv.util.js";
import mongoose from "mongoose";
import fs from "fs";

const addTransaction = async (req, res) => {
  try {
    const { transName, amount, type, date, tag, paymentMode } = req.body;

    if (
      [transName, amount, type, date, tag, paymentMode].some(
        (field) => field.trim() === ""
      )
    ) {
      return res.status(400).json({ message: "All Fields Are Required!" });
    }

    const transaction = new Transaction({
      addBy: req.user?._id,
      transType: type,
      transName,
      amount,
      date,
      tag,
      paymentMode,
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

    const totalIncome = await Transaction.aggregate([
      { $match: { addBy: userId, transType: "Income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const totalExpense = await Transaction.aggregate([
      { $match: { addBy: userId, transType: "Expense" } },
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
    } = req.query;

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
    let startDate;

    if (timeRange === "weekly") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeRange === "monthly") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeRange === "yearly") {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const incomeData = await Transaction.find({
      date: { $gte: startDate },
      transType: "Income",
    }).sort({ date: 1 });

    const chartData = incomeData.map((data) => ({
      x: data.date,
      y: data.amount,
    }));

    return res.status(200).json({ chartData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Errors" });
  }
};

const expenseAnalytic = async (req, res) => {
  try {
    const { timeRange } = req.params;
    let startDate;

    if (timeRange === "weekly") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeRange === "monthly") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (timeRange === "yearly") {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
    }

    const expenseData = await Transaction.aggregate([
      {
        $match: {
          date: { $gte: startDate },
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
    const { transName, amount, tag, paymentMode, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid Transaction ID" });
    }

    if (
      [transName, date, tag, paymentMode].some(field => field?.trim() === "") || amount === undefined
    ) {
      return res.status(400).json({ message: "All Fields Are Required!" });
    }

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      {
        $set: {
          transName,
          amount,
          date,
          tag,
          paymentMode,
        }
      },
      {new: true},
    )

    if(!transaction){
      return res.status(404).json({message: "Not Found"});
    }

    return res.status(200).json({message: "Transaction Updated", transaction})
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Errors" });
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
};
