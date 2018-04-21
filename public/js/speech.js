var socket = io.connect( {secure: true});
var botui = new BotUI('botui-app');
var continuous = false;
var query = getQueryParams(document.location.search);



function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}
window.onload = function() {

    /*load speech API*/
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
    var colors = [ ];
    var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();

    botui.message.add({
        content: 'Say my name to begin...'
    }); //add to conversation UI

    // Start listening, don't restart automatically
    if (annyang) {
        var commands = {
            'jarvis': function() {
                bangOnGooglesDoor();
            },
            'hey jarvis': function() {
                bangOnGooglesDoor();
            },
            'oh jarvis': function() {
                bangOnGooglesDoor();
            },
            'um jarvis': function() {
                bangOnGooglesDoor();
            },
            'yo jarvis': function() {
                bangOnGooglesDoor();
            },
            'oi jarvis': function() {
                bangOnGooglesDoor();
            },
            'ok jarvis': function() {
                bangOnGooglesDoor();
            },
            'listen to me': function() {
                bangOnGooglesDoor();
            },
            "I'm talking to you jarvis": function() {
                bangOnGooglesDoor();
            }
        };
        annyang.addCommands(commands);
        annyang.start();
    } //listens for Jarvis to begin Google rec


    function bangOnGooglesDoor(){
        annyang.abort();

        botui.message.add({
            content: 'How can I help?'
        }); //add to conversation UI
        var audio = new Audio('wake.wav');
        audio.play();  
        setTimeout(startListening,500);
    }
    speechRecognitionList.addFromString(grammar, 1);
    recognition.grammars = speechRecognitionList;
    recognition.continuous = false;
    recognition.lang = 'en-GB';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    socket.on('message', function (message) {
        botui.message.add({
            content: message.data
        }); //add to conversation UI
        responsiveVoice.speak(message.data); //say response     
        annyang.start();
    }); //on message from server

    document.body.onclick = function() {


    } //on page click start listening

    recognition.onresult = function(event) {
        var last = event.results.length - 1;
        var input = event.results[last][0].transcript;
        console.log(input);
        if(!continuous){
            if(input.toLowerCase().indexOf('Jarvis')){
                ask(input);

                recognition.stop();
                $('.title').text("J A R V I S");
            }

        }
        else{
            ask(input);

            recognition.stop();
            $('.title').text("J A R V I S");
        }


    } //once a word or phrase has been understood send message to server

    recognition.onspeechend = function() {


    } //on end of phrase or command

    recognition.onnomatch = function(event) {
        responsiveVoice.speak("Could you repeat that please?");
    } //on no match DO SOMETHING

    recognition.onerror = function(event) {
        console.log('Error occurred in recognition: ' + event.error);
    } //on error DO SOMETHING

    function startListening(){
        $('.title').text("LISTENING");
        recognition.start();
      
    } //start listening

}
function ask(x){
    botui.message.add({ // show next message
        human: true,
        content: x
    });

    socket.emit('message', {data: x});
      scrollToBottom();
}
function scrollToBottom(){
    $(".chat").animate({ scrollTop: $(document).height() }, 1000); 
}