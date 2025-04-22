const http = require("http");
const app = require("./app");
const {initializeSocket}=require('./socket')
const server=http.createServer(app)
initializeSocket(server)
const port = process.env.PORT || 3000;

server.listen(port,()=>{
    console.log(`running on port ${port}`)
})