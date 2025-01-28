import fs from "fs";
import csv from "csv-parser";
import moment from "moment";

const processCSV = async (filePath) => {
  const transactions = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        transactions.push({
          transName: row.Name, // Use 'Name' from your CSV
          tag: row.Tag, // Use 'Tag' from your CSV
          transType: row.Type, // Use 'Type' from your CSV
          amount: row.Amount, // Use 'Amount' from your CSV
          paymentMode: row["Payment Mode"], // Use 'Payment Mode' from your CSV
          date: moment(row.Date, "DD-MM-YYYY").toDate(), // Convert to Date object
        });
      })
      .on("end", () => {
        console.log(transactions);
        resolve(transactions);
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

export default processCSV;
