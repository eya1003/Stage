const express = require('express')
const env = require('dotenv').config()

const mongodb = require ('./Config/database.js')
const morgan = require('morgan')
const cors = require('cors');
const cookieSession = require('cookie-session');
const passport = require('passport')

//connect database
mongodb() 


const app =express()
const server = require('http').createServer(app);

app.use(express.json())
app.use(
    cookieSession({ name: "session", keys: ["stage"], maxAge: 24 * 60 * 60 * 100 })
  );
  //passport for the authentification with google, github..
app.use(passport.initialize())
app.use(passport.session()) 

app.use(cors({
  origin:"http://localhost:3000",
  methods:"GET ,POST ,PUT ,DELETE",
  credentials : true  ,
  exposedHeaders:"Authorization"
}));


const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  } , allowEIO3: true // add this option to support Socket.IO 4.1.2 protocol

});

io.on('connection', (socket)=> {
  socket.emit('me', socket.id);
  socket.on('disconnect', ()=> {
    socket.broadcast.emit("callended");
  });
  
  socket.on("calluser", ({userToCall, signalData, from, name})=> {
    io.to(userToCall).emit("callUser", {signal: signalData, from, name});
  });
  
  socket.on("answercall", (data)=> {
    io.to(data.to).emit("callaccepted", data.signal)
  });
});


app.use(express.urlencoded({extended : false}))
app.use('/user',require('./Routes/userRoute.js'));
app.use('/qu',require('./Routes/queueRoute.js'));
app.use('/file',require('./Routes/fileRoute.js'));
app.use('/email',require('./Routes/EmailRoute.js'));




app.get('/', (req, res) => {
  res.send('Running');
});

server.listen(5000, () => {
  console.log(`Server is listening on port 5000`);
});
