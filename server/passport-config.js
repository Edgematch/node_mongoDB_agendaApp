const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const {User} = require('./models/models')

function initialize(passport) {

    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done)=>{
       
        const user = await User.findOne({email: email});
        if(user == null){
            return done(null, false, {message: 'Correo incorrecto'})
        }
        
        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, {message: 'correo o contraseña equivocada'})
            }
        } catch (error) {
            return done(error)
        }

    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser( async (id, done) => {
        const user = await User.findOne({_id: id});
        if(!user) return done(null, false, { message: 'credenciales invalidas' })
        done(null, user);
      });
}

module.exports = initialize



