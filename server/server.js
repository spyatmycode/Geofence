import express from 'express';
import cors from 'cors';
import axios from 'axios';


const app = express();

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
      Authorization: "Bearer sendchamp_live_$2a$10$cbYEsziD//Xfmkvd/nsxC.hP.GZHkm3uOQB5lDOZoMzjuCNoBd7Qi"
    }
  }

  axios.post('https://api.sendchamp.com/api/v1/sms/send', requestBody, config).then(res.json("Done"))
  .catch((err)=> console.log(err))
  

 
  

  

  
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


