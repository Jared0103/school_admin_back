const express = require('express')
const cors = require('cors')
require('dotenv').config()
const authRoutes = require('./routes/authRoutes')
const app = express()
const PORT = process.env.PORT || 6010
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');

app.use(cors())
app.use(express.json())

app.use('/', authRoutes);
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);


app.listen(PORT, () => {
    console.log("🚀 ~ Server is Running on ~ PORT:", PORT);
});
