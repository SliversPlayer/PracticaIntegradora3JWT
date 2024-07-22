import mongoose from 'mongoose';

//Modulo para conectar a server

let base = "ecommerce"
let pass = "123456a."
let conString = `mongodb+srv://usuario1:${pass}@cluster0.24yvhip.mongodb.net/${base}?retryWrites=true&w=majority&appName=Cluster0`


mongoose.connect(conString);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

export default db;