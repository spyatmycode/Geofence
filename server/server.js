import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from "dotenv"

dotenv.config()


const app = express();

console.log(process.env.SENDCHAMP_AUTH);

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Define a route to handle form submissions
app.post('/submit',  async (req, res) => {

  console.log(req.body);
  const { phonenumber, time, content,  } = req.body;

  

  const requestBody = {
    to: phonenumber,
    message: content,
    sender_name: 'SAlert',
    route: 'dnd'
  }

  console.log(requestBody);
  
  const config = {
    headers:{
      Authorization: process.env.SENDCHAMP_AUTH
    }
  }

  axios.post('https://api.sendchamp.com/api/v1/sms/send', requestBody, config).then(res.json("Done"))
  .catch((err)=> console.log(err))
  

 
  

  

  
});

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


