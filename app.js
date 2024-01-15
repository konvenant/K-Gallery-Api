// File: app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const saveImageRouter = require('./routes/saveImageRoutes');
const saveVideoRouter = require('./routes/saveVideoRoutes');
const sendImageRouter = require('./routes/sendImageRoutes');
const sendVideoRouter = require('./routes/sendVideoRoutes');
const favoriteImageRouter = require('./routes/FavoriteImageRoutes');
const favoriteVideoRouter = require('./routes/FavoriteVideoRoutes');
const getUserRouter = require('./routes/getUserRoutes');
const settingsRouter = require('./routes/settingsRoutes');
require('dotenv').config();


const app = express();
app.use(cors()); // Enable CORS

// Parse URL-encoded bodies (for form data)
app.use(bodyParser.urlencoded({ extended: true }));

// Parse JSON-encoded bodies
app.use(bodyParser.json());

app.use(express.static("public"));
// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true
})
.then(() => {
  console.log('Connected to the database');
})
.catch(error => {
  console.error('Database connection error:', error);
});



app.use('/user', userRouter);
app.use('/auth', authRouter);
app.use('/action',saveImageRouter);
app.use('/action',saveVideoRouter);
app.use('/action',sendImageRouter)
app.use('/action',sendVideoRouter);
app.use('/action',favoriteImageRouter);
app.use('/action',favoriteVideoRouter);
app.use("/action",getUserRouter);
app.use("/action", settingsRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});



