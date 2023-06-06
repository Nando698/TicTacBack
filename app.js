import express from "express";
import cors from 'cors';
import { Server as SocketServer} from "socket.io";
import http from 'http';
import { Session } from "./sessions.js";
import { checkWin } from "./utils/utils.js";
import * as dotenv from 'dotenv' 
dotenv.config()


const app = express();
const server = http.createServer(app)
const io = new SocketServer(server, {
    cors: {
        origin: "*",
        allowedHeaders: ["userID"],
    credentials: true
        
      }
})





app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



let sessions = []
let users = []
let inactive = 1
setInterval(() => {
    inactive++
    if(inactive > 3600){
        users = []
        inactive = 1
    }
}, 1000);

app.get('/', (req, res) => {
    res.sendStatus(200)
  })


server.listen(0, function () {
    console.log(`Server listening port  ${this.address().port}`);
});

io.on('connection', (socket) => {
    
    
   
    inactive = 1
    
    
    
    
    sessions = sessions.filter(session => session.init < 120)
    

    
    

    if(socket.handshake.headers.userid == 'null'){
        socket.emit('refresh')
    }
    
        
        let user = users.find( user => user.uid === socket.handshake.headers.userid);
        
        if (user) {
            if (user.sessionCode) {
                socket.join(user.sessionCode)
            }
        } else {
            users.push({ uid:  socket.handshake.headers.userid });
        }
        
   
    
    
    
    socket.on('client:created', (data) => {
        sessions.push(new Session(data.code, {uid: data.uid, name: data.name}))
        let user = users.find(user => user.uid == data.uid)
        console.log('creando sesion...', user)
        user.name = data.name
        user.sessionCode = data.code
        console.log(user.name, 'ha creado una sala')
        socket.join(data.code)
    })

 


    socket.on('client:connectedPlayer2', (data) => {
        let session = sessions.find(ses => ses.code === data.code)
        
        
        if(session){
            session.playerTwo = {uid: data.uid, name: data.name}
            
            let user = users.find(user => user.uid == data.uid)
            user.name = data.name
            user.sessionCode = data.code
            socket.join(session.code)
            socket.to(session.code).emit('server:newPlayer', session)
            
            

        }
    })
    

    socket.on('client:clicked', (data) => {
        
        let code = data.code
        let session = sessions.find(sess => sess.code == code)
        let index = sessions.indexOf(session)
        let numberOfSquare = parseInt(data.clicked.slice(9))

        session.restartTimer()
        session.turn = !session.turn
        if(session.playerOne.uid == data.user){
            
            sessions[index].classes = {...sessions[index].classes, [data.clicked]: 'cruz'}
            sessions[index].matrix[numberOfSquare-1] = 1
            if(checkWin(sessions[index].matrix,1)){
                sessions[index].score.p1++
                io.to(code).emit('update', sessions[index])

                io.to(code).emit('p1win')
                
                setTimeout(() => {
                    sessions[index].restoreSession()
                }, 2000);
            }
        }else{
            sessions[index].classes = {...sessions[index].classes, [data.clicked]: 'circulo'} 
            sessions[index].matrix[numberOfSquare-1] = 2
            if(checkWin(sessions[index].matrix,2)){
                sessions[index].score.p2++

                io.to(code).emit('update', sessions[index])
                io.to(code).emit('p2win')
                
                setTimeout(() => {
                    sessions[index].restoreSession()
                }, 2000);
            }
            
        }
        
        if(!sessions[index].matrix.includes(0)){
            io.to(code).emit('tie')
            sessions[index].restoreSession()
        }
        
        io.to(code).emit('server:click', sessions[index])
        

    })


   

})


















//RUTAS

app.get('/info', (req, res)=> {
    res.json({inactive, sessions, users})
})

app.get('/:code',  (req, res) => {
    let code = req.params.code
    let session = (sessions.find(session => session.code === code))

    if(session){
        res.send(session)
    }else{
        res.send({'respuesta':'no existe sesion'})
    }
    

})


app.get('/sessions/all', (req, res) => {
    res.send(sessions)
})

