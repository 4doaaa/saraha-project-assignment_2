import express from 'express';  
import bootstrap from './src/app.controller.js';
import connectDB from './src/DB/connection.js';
const app  = express();
const port = 3000;


await connectDB();
await bootstrap(app , express);

app.listen(port ,()=>{
    console.log(`Server is running http://localhost:${port} `);
    
});
