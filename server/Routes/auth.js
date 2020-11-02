const Router = require('express').Router()
const {User} = require('../models/models')
const bcrypt = require('bcrypt')

const passport = require('passport')


const {registerValidation, loginValidation} = require('../validation')


Router.post('/register', async (req, res)=>{
    //uso del modelo de usuarios
    //used to validate user data before other actions
    const {error} = registerValidation(req.body); 
    if(error) return res.status(400).send(error.details[0].message) 

    //validates if the user already exists
    const emailExist = await User.findOne({email: req.body.email})
    if (emailExist) return res.status(400).send("El Correo ya tiene asociado un usuario")

    //encrypts password to be stored in the database
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //creates a new user schema to be stored
    const user = new User({
        name: req.body.name, 
        email : req.body.email, 
        password: hashedPassword
    });

    try {
        const saveUser = await user.save();
        res.send({user: user._id})
    } catch (err) {
        res.status(400).send(err)
    }
})

Router.post('/', (req, res, next)=>{
    //validar la informacion antes de crear un usuario
    const {error} = loginValidation(req.body); 
    if(error) return res.status(400).send(error.details[0].message);

    passport.authenticate('local', (err, user, info) => {
        if(info) {return res.send(info.message)}
        if (err) { return next(err); }
        if (!user) { return res.redirect('/login'); }
        req.login(user, (err) => {
          if (err) { return next(err); }
          return res.send('Validado');
        })
      })(req, res, next);
})

module.exports = Router