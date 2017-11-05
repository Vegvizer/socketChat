var socket = io();
var urlParams = $.deparam(window.location.search);

function scrollToBottom(){
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight')
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight= newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', ()=>{
    console.log('Connected to Server');
    // getLocation();
    // var name = !jQuery.isEmptyObject(urlParams) ? urlParams.name : socket.id;

    socket.emit('join', urlParams, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        } else {
            console.log('No error.')
        }
    });

    $('form').submit(function(){
        if($('#m').val() === ''){
            return false;
        }
        else{
            socket.emit('createMsg',{
                text: $('#m').val()
            }, function (data){
                console.log(data);
            });
            $('#m').val('');
            return false;
        }
      });
});

socket.on('disconnect', ()=>{
    console.log('Disconnected from server');
})

socket.on('newMsg', (msg)=>{
     console.log('new Message: ', msg);
    var template = $('#message-template').html();
    var html = Mustache.render(template,{
        from: msg.from,
        text: msg.text,
        createdAt: msg.createdAt
    });

    $('#messages').append(html);
    scrollToBottom();   
})

socket.on('createMsg', function(msg){
    var template = $('#message-template').html();
    var html = Mustache.render(template,{
        from: msg.from,
        text: msg.text,
        createdAt: msg.createdAt
    });

    $('#messages').append(html);   
    // $('#messages').append($('<li>').text(msg.createdAt +`  `+ msg.from + ': '+ msg.text));
    scrollToBottom();
});

socket.on('updateUserList', function(users){
    var ol = $('<ul></ul>');
    users.forEach(function(user) {
        ol.append($('<li></li>').text(user));
    });

    $('#users').html(ol);
})

socket.on('newLocationMsg', function(msg){
    var template = $('#location-message-template').html();
    var html = Mustache.render(template,{
        from: msg.from,
        url: msg.url,
        createdAt: msg.createdAt
    });

    $('#messages').append(html);   
    //  $('#messages').append($('<li>').text(msg.from).append(`<a href="${msg.url}">My Current Location</a>`));
    scrollToBottom();
})

$(`#send-location`).on('click', function() {
    if(!navigator.geolocation){
        return alert('Geolocation not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        socket.emit('createLocationMsg', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });
        // console.log(position);
    }, function(){
        alert('unable to fetch location');
    })
 });
//  var getLocation = () =>{
//     if(!navigator.geolocation){
//         return alert('Geolocation not supported by your browser');
//     }

//     navigator.geolocation.getCurrentPosition(function(position) {
//         socket.emit('createLocationMsg', {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//         });
//         // console.log(position);
//     }, function(){
//         alert('unable to fetch location');
//     })
//  }