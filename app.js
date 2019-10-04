const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const moment = require('moment');

// Update Service
class UpdateService {
    constructor(){
        this.updates = [];
    }

    async find(){
        return this.updates;
    }

    async create(data){
        const update = {
            id: this.updates.length,
            text: data.text,
            location: data.location,
            observer: data.observer
        };

        update.time = moment().format('h:mm:ss a');

        this.updates.push(update);

        return update;
    }
}

const app = express(feathers());

// Parse JSON
app.use(express.json());

// Config Socket.io realtime APIs
app.configure(socketio());

//Enable rest services
app.configure(express.rest());

// Register Services
app.use('/updates', new UpdateService());

// New connection connect to stream channel
app.on('connection', conn => app.channel('stream').join(conn));

// Publish events to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;

app.listen(PORT).on('listening', () => console.log(`Real time Server running on port ${PORT}`));

app.service('updates').create({
    text: 'VIO check going on ',
    location: 'Bode Thomas, around SPAR',
    observer: 'Raymond Akintunde'
});