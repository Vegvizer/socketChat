var socket = io();

socket.on('connect', ()=>{
    console.log('Connected to Server');
    // getLocation();
    var id = socket.id;

    $('form').submit(function(){
        if($('#m').val() === ''){
            return false;
        }
        else{
            socket.emit('createMsg',{
                from:id,
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
});

socket.on('newLocationMsg', function(msg){
    var template = $('#location-message-template').html();
    var html = Mustache.render(template,{
        from: msg.from,
        url: msg.url,
        createdAt: msg.createdAt
    });

    $('#messages').append(html);   
    //  $('#messages').append($('<li>').text(msg.from).append(`<a href="${msg.url}">My Current Location</a>`));
 
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