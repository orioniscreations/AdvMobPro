var socket = io("http://localhost:3000");
$(() => {
        $("#send").click(() => {
                sendMessage({
                        name: $("#name").val(),
                        icon: $("#icon").val(),
                        message: $("#message").val()
                });
        })

        getMessages()
})

socket.on('message', addMessages)

function addMessages(message) {
        $("#messages").append(`
               <div class = "container">
                       <div class = "row">
                               
                                 <div class = "col" style="max-width:'100px;'">
                                         <h4>${message.name}</h4>
                                 </div>   
                                 
                       </div>
                       <div class="row">
                                 <div class = "col">
                                          ${message.icon} 
                                  </div> 
                                <div class = "col">
                                        ${message.msg} 
                                </div> 
                       </div>
                </div>
        `)
}

function getMessages() {
        $.get('http://localhost:3000/messages', (data) => {
                data.forEach(addMessages);
        })
}

function sendMessage(message) {
        // $.post('http://localhost:3000/messages', message)
        socket.emit("chat msg", {
                // jquery grab
                name: $("#name").val(),
                icon: $("#icon").val(),
                msg: $("#message").val(),
        })
}