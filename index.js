var app = require('express')()
var http = require('http').createServer(app)
var io = require('socket.io')(http)

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/view/index.html')
});

let online_user_count = 0
io.on('connection', function (socket) {
    online_user_count += 1
    socket.broadcast.emit('user join', '有個使用者進入了聊天室，跟他說聲 Hi 吧')
    io.emit('online user count', online_user_count)

    socket.on('disconnect', function () {
        online_user_count -= 1
        socket.broadcast.emit('user exit', '有個使用者離開了聊天室，我們懷念他')
        io.emit('online user count', online_user_count)
    });

    socket.on('chat message', function (msg) {
        socket.broadcast.emit('chat message', msg)
    });
});

http.listen(3000, function () {
    console.log('express service on, listening on :3000')
});