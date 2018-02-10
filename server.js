const express = require( 'express' );  
const app = express(); 
const server = require( 'http' ).createServer( app );
const io = require( 'socket.io' )( server );
const fs = require('fs');              
const path = require('path');

const users = [];                   
let usersNum = 0;  

server.listen( 3000, ()=>{
    console.log( 'server is running at localhost:3000' );
});
app.use( express.static( './public' ));
// app.use('/',express.static(path.join(__dirname,'./public')));

app.get('/',( req, res )=>{
    res.sendfile( __dirname + '/index.html', (err,data)=>{
        err && console.log('-----err----' + err );
        err && res.send('404') || res.send( data );
    });
})

io.on('connection', ( socket ) => { 

    usersNum++;
    console.log( '一共有' + usersNum + '个用户连接了' );

    socket.on('login',( data )=>{  
 
        users.push({  
            username: data.username,  
            message: []  
        });  
          
       
        socket.emit( 'loginSuccess', data );   
    });  

    socket.on('sendMessage', ( data ) => {  

        console.log( 'recieve-------------' );
        console.log( data );
        console.log( socket );
        
        data.id = socket.id;  
        io.emit('receiveMessage', data);  
    })  

    socket.on('sendImg', ( data ) => {  

        data.id = socket.id;  
        io.emit( 'receiveImg', data );  

    })  

    socket.on('disconnect',()=>{

        console.log('disconnect------------------');
    })

    socket.on('error',( err )=>{

        console.log( err );

    })

});  