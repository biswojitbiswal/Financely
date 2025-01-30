import "dotenv/config"
import express from 'express'
import cors from 'cors'
import connectDb from './DB/db.js';
import userRouter from './routes/user.routes.js'
import transactionRouter from './routes/transaction.routes.js'


const app = express();


const PORT = process.env.PORT || 7070;

const allowedOrigins = process.env.NODE_ENV === "production"
  ? ["https://financely-five.vercel.app"]
  : "*";

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET, POST, PUT, DELETE, PATCH, HEAD"],
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "10mb"}))
app.use(express.static("public"));

app.use("/api/financely/user", userRouter);
app.use("/api/financely/transaction", transactionRouter);


app.get("/", (req, res) => {
    res.send("My yoga product app page");
})

connectDb()
.then(() => {
    app.on("error", (error) => {
        console.log("Error", error);
        throw error;
    })
    app.listen(PORT, () => {
        console.log(`App is Listening on: ${PORT}`);
    })
    
})
.catch((error) => {
    console.log("Connection Failed", error);
})