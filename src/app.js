const express = require('express');
const mongoose = require('mongoose');
const tradeRoutes = require('./routes/tradeRoutes');
const lotRoutes = require('./routes/lotRoutes');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI 
//   , {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }

)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.use('/api/trades', tradeRoutes);
app.use('/api/lots', lotRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`your app is listening at port ${process.env.PORT}`);
    
})

module.exports = app;