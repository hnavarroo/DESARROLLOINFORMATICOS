const express = require('express');
const cors = require('cors');
require('dotenv').config();

const ticketsRoutes = require('./routes/tickets');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/tickets', ticketsRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});