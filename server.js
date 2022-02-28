const express =  require("express") ;
const dotenv = require("dotenv").config();
// const connectDB = require('./config/db.js');
const app = express();
const cors = require("cors");
// const router = React.router();
const PORT = process.env.PORT || 4000;
const {chats} = require('./data/data')


app.use(express.json())
app.get('/', (req, res) => {
        res.send("Hello Home");

});

app.get('/api/chats', (req, res) => {
        res.send(chats);

});

app.get('/api/chat/:id', (req, res) => {
        const id = req.params.id ;

        const chat = chats.find((c) => c._id === req.params.id);

        if(chat){
            res.send(chat);
        }else{
            res.send("ERROR...")
        }

        

});
   

app.listen(PORT , console.log(`SERVER listening to PORT : ${PORT}`));

