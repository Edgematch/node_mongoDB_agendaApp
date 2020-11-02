const Router = require('express').Router()
const passport = require('passport')

const {Events} = require('../models/models')
const {eventValidation, idValidation, updateValidation} = require('../validation')

Router.get('/all', async (req, res)=>{
    if(req.isAuthenticated()) {
        let events = await Events.find({user: req.user._id})
        let newEvents = []
        events.forEach(element => {
            newEvents.push({
                id: element._id,
                title: element.title,
                start: element.start,
                end: element.end
            })
        })
    
        res.send(newEvents)

    } else {
        res.redirect('/index.html')
    }
})

Router.post('/new', async (req, res)=>{
    if(req.isAuthenticated()) {
        const {error} = eventValidation(req.body); 
        if(error) return res.status(400).send(error.details[0].message) 
    
        let event = new Events({
            user: req.user._id, 
            title: req.body.title,
            start: req.body.start, 
            end: req.body.end
        })

        try {
            const saveEvent = await event.save();
            res.send("Evento guardado exitosamente")
        } catch (err) {
            res.status(400).send(err)
        }
        
    } else {
        res.redirect('/index.html')
    }

})


Router.post('/delete/:id', async(req, res)=>{
    if(req.isAuthenticated()) {
        
        const {error} = idValidation(req.body); 
        if(error) return res.status(400).send(error.details[0].message) 

        let event = await Events.deleteOne({ _id: req.body.id }, function (err) {
            if(err) console.log(err);
            res.send("Evento eliminado exitosamente");
          });

        

    } else {
        res.redirect('/index.html')
    }
})

Router.post('/update', async(req, res)=>{

    if(req.isAuthenticated()) {
        const {error} = updateValidation(req.body); 
        if(error) return res.status(400).send(error.details[0].message) 


        let update = await Events.updateOne({ _id: req.body.id }, {$set:{start: req.body.start, end: req.body.end}}, function (err) {
            if(err) console.log(err);
            res.send("Evento actualizado exitosamente");
          });

    } else {
        res.redirect('/index.html')
    }

})


module.exports = Router