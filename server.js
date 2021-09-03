const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const { ExpressPeerServer } = require("peer");

const app = express();

const server = http.createServer(app);
// const io = require("socket.io")(server, {
// 	cors: {
// 		origin: "http://localhost:3000",
// 		methods: [ "GET", "POST" ]
// 	}
// })
//const io = require("socket.io").listen(server);
const io = socketio(server).sockets;
//app.use(express.json());    
//** Peer Server */
//const customGenerationFunction = () =>
  //(Math.random().toString(36) + "0000000000000000000").substr(2, 16);

//const peerServer = ExpressPeerServer(server, {
 // debug: true,
 // path: "/",
 // generateClientId: customGenerationFunction,
//});

//app.use("/mypeer", peerServer);

//** Config */

//* Websocket *//


io.on("connection", (socket) => {
	console.log('connected')
//   socket.on("join-room",({roomId,userId})=>{
//     // console.log
//      console.log(roomId)
//      socket.join(roomId);
//      socket.to(roomId).broadcast.emit("user-connected",userId);
//  })
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

const port = process.env.PORT || 5000;
server.listen(port, () => console.log(`Server started on port ${port}`));
