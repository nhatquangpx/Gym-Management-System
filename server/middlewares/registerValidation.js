const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

const registerValidation = async (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
        phone: Joi.string().pattern(/^[0-9]{10,11}$/).required(),
        role: Joi.string().valid('member', 'admin', 'employee', 'trainer').optional()
    });

    try {
        await schema.validateAsync(req.body);
        next(); 
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            message: error.details[0].message
        });
    }
};

module.exports = registerValidation;
