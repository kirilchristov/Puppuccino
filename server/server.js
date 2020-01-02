const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// BODY PARSING (EXPRESS' BUILT IN PARSER)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// SERVING THE BUILD FILE
app.use('/build', express.static(path.join(__dirname, '../build')));

// SERVING THE MAIN PAGE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

//SOCKET.IO CHAT
const http = require('http').Server(app);
const io = require('socket.io')(http);

// ROUTERS
const userRouter = require('./routers/userRouter');
const chatRouter = require('./routers/chatRouter');
app.use('/user', userRouter);
app.use('/chat', chatRouter);


// 404 NOT FOUND HANDLER
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })} | server/err `, err);
  res.status(500).send('Internal Server Error');
});

// INITIALIZE SERVER
// app.listen(PORT, () => {
//   console.log(`${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}`, `Server listening on port ${PORT}...`);
// });


/*** SOCKETS */
io.on('connection', function(socket) {
  let roomId;
  console.log('a user connected');
  socket.on('find room', function(venue) {
    roomId = venue;
    socket.join(roomId)
  })
  
  socket.on('chat message', function(msg) {
    console.log("msg: ", msg)
    io.sockets.in(roomId).emit('chat message', msg);
  })
})

io.on('disconnect', function() {
  console.log('user disconnected');
});

//SERVER LISTEN
http.listen(PORT, () => {
  console.log(`Server Listening on PORT ${PORT}`);
})
module.exports = app;