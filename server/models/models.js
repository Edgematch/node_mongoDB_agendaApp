const mongoose = require('mongoose')

//mongoose schema for user data
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true 
    }, 
    email: {
        type: String, 
        required: true
    }, 
    password: {
        type: String, require: true
    },
    
    date: {
        type: Date, 
        default: Date.now
    }
})

//mongoose schema for event data
const eventSchema = new mongoose.Schema({
    user: {
         type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    title: {
        type: String,
        required: true
    }, 
    start: {
        type: String, 
        required: true
    },
    end: {
        type: String
    }

})

module.exports.User = mongoose.model('User', userSchema)
module.exports.Events = mongoose.model('Events', eventSchema)