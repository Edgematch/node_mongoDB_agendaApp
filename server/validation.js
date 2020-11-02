const Joi = require('@hapi/joi')//library used to validate data from the client


//schema for register validation
const registerValidation = (data)=>{

    const schema = Joi.object({ 
        name: Joi.string().required(), 
        email: Joi.string().min(6).required().email(), 
        password: Joi.string().min(6).required()
    }); 

    return schema.validate(data)

};

//schmea for login validation
const loginValidation = (data)=>{
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(), 
        password: Joi.string().min(6).required()
    }); 

    return schema.validate(data)
};

//schema for event validation
const eventValidation = (data)=>{
    const schema = Joi.object({
        title: Joi.string().max(30).required(),
        start: Joi.date().iso().required(), 
        end: Joi.date().iso().allow('')
    });

    return schema.validate(data)
}

const idValidation = (data)=>{
    const schema = Joi.object({
        id: Joi.string().required()
    });

    return schema.validate(data)
}

const updateValidation = (data)=>{
    const schema = Joi.object({
        id: Joi.string().required(),
        start: Joi.date().iso().required(), 
        end: Joi.date().iso().allow('')
    });

    return schema.validate(data)
}



module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.eventValidation = eventValidation
module.exports.idValidation =idValidation
module.exports.updateValidation =updateValidation