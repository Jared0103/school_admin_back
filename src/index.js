const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Configuración de CORS
app.use(cors({
    origin: 'http://localhost:3000', // Cambia esto a la URL de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

app.use('/', authRoutes);
app.use('/teachers', teacherRoutes);
app.use('/students', studentRoutes);

const PORT = process.env.PORT || 6010;
app.listen(PORT, () => {
    console.log("🚀 ~ Server is Running on ~ PORT:", PORT);
});
