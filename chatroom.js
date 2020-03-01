const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.get('/:room_name', function (req, res) {
    res.sendFile(__dirname + '/view/chatroom.html')
});

io.on('connection', function (socket) {
    
    // 客戶端加入聊天室
    socket.on('join room', (room_name) => {
        socket.join(room_name)
        io.to(room_name).emit('new user', `有個使用者進入了聊天室 ${room_name} 跟他說聲 Hi 吧`)
    })

    // 接收客戶端訊息
    socket.on('chat message', ({room_name, msg}) => {
        console.log(`get message from room name '${room_name}' msg = ${msg}`)
        io.to(room_name).emit('chat message', msg)
    })
})


http.listen(3000, function () {
    console.log('express chatroom service on, listening on :3000')
})