import express from 'express';  
import bootstrap from './src/app.controller.js';
import connectDB from './src/DB/connection.js';
import dotenv from "dotenv";
import messageRouter from './src/Modules/message/message.controller.js'; 
dotenv.config({path:"./src/config/.env.dev"});
const app  = express();
app.use(express.json());
const PORT = Number(process.env.PORT) || 3000;

app.use('/api/v1/user/message', messageRouter);
await connectDB();
await bootstrap(app , express);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})