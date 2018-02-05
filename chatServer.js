/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;
var location = 'Hawaii';


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Aloha,  I am a travelbot."); //We start with the introduction;
  setTimeout(timedQuestion, 1500, socket,"What is your Name?"); // Wait a moment and respond with a question.

});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  socket.emit('changeFont','white');
  answer= 'Aloha ' + input + ' :-)';// output response
  socket.emit('changeBG', 'blue');
  waitTime =2000;
  question = 'Where would you like to travel?';			    	// load next question
  }
  else if (questionNum == 1) {
  socket.emit('changeFont','white');
  answer= 'Awesome, ' + input + ' has amazing views!';// output response
  socket.emit('changeBG', 'red');
  location = input;
  waitTime =2000;
  question = 'What would you like to do at this place?';			    	// load next question
  }
  else if (questionNum == 2) {
  socket.emit('changeFont','white');
  answer= 'Awesome! I also enjoy ' + input+'.';
  socket.emit('changeBG', 'green');
  waitTime =2000;
  question = 'What would you like to see at this place?';			    	// load next question
  }
  else if (questionNum == 3) {
  answer= 'In ' + location + ', you can find a lot of ' + input;
  socket.emit('changeBG','purple');
  
  waitTime = 2000;
  question = 'Any other things you would like to see?';			    	// load next question
  }
  else if (questionNum == 4) {
  answer= 'In ' + location + ', there is not much ' + input + ', but you can find more to eat!';
  socket.emit('changeBG','purple');
  
  waitTime = 2000;
  question = 'Wanna try something very fancy?';             // load next question
  }
  else{
    if (answer === 'yes') {
    answer= 'I suggest you also tryout flying in a helicopter!';// output response
    socket.emit('changeBG','LightSkyBlue');
    waitTime =0;
    question = '';
    } else {
    answer= 'So sad, I will try to improve next time!';// output response
    socket.emit('changeBG','tomato');
    waitTime =0;
    question = '';
    }
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
