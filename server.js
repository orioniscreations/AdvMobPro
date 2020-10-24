var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
        extended: false
}))

var Message = mongoose.model('Message', {
        name: String,
        icon: String,
        message: String
})


var dbUrl = 'mongodb+srv://orionis:<password>@cluster0.1yzy7.mongodb.net/<dbname>?retryWrites=true&w=majority'

app.get('/messages', (req, res) => {
        Message.find({}, (err, messages) => {
                res.send(messages);
        })
})


app.get('/messages/:user', (req, res) => {
        var user = req.params.user
        Message.find({
                name: user
        }, (err, messages) => {
                res.send(messages);
        })
})


app.post('/messages', async (req, res) => {
        try {
                var message = new Message(req.body);

                var savedMessage = await message.save()
                console.log('saved');

                var censored = await Message.findOne({
                        message: 'badword'
                });
                if (censored)
                        await Message.remove({
                                _id: censored.id
                        })
                else
                        io.emit('message', req.body);
                res.sendStatus(200);
        } catch (error) {
                res.sendStatus(500);
                return console.log('error', error);
        } finally {
                console.log('Message Posted')
        }

})

app.use(express.static("public"));

io.on('connection', socket => {
        console.log('a Mun has connected')
        socket.on("chat msg", msg => {

                io.emit('message', msg)
        })
})



mongoose.connect(dbUrl, {
        useMongoClient: true
}, (err) => {
        console.log('mongodb connected', err);
})

var server = http.listen(3000, () => {
        console.log('server is running on port', server.address().port);
});