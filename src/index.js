const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);

const PORT = process.env.PORT || 6010;
app.listen(PORT, () => {
    console.log("🚀 ~ Server is Running on ~ PORT:", PORT)
});
