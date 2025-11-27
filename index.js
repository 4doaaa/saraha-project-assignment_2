import express from 'express';  
import bootstrap from './src/app.controller.js';
import connectDB from './src/DB/connection.js';
import dotenv from "dotenv";
dotenv.config({path:"./src/config/.env.dev"});
const app  = express();
const PORT = Number(process.env.PORT) || 3000;


await connectDB();
await bootstrap(app , express);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})