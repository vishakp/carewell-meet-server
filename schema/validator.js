const Ajv = require('ajv');
const ajv = Ajv({ allErrors: true, removeAdditional: 'all' });

const meetingSchema = require('./create-meeting.json');
const userSchema = require('./register-user.json');

ajv.addSchema(meetingSchema, 'create-meeting');
ajv.addSchema(userSchema, 'user-registeration');

/**
 * Format error responses
 * @param {Object} schemaErrors - array of json-schema errors, describing each validation failure
 */
function errorResponse(schemaErrors) {
    let errors = schemaErrors.map((error) => {
        return {
            path: error.dataPath,
            message: error.message
        }
    });
    return {
        success: 0,
        errors: errors
    }
}

/**
 * Validates incoming request bodies against the given schema,
 * providing an error response when validation fails
 * @param {String} schemaName - name of the schema to validate
 * @return {Object} response
 */
module.exports = (schemaName) => {
    return (req, res, next) => {
        let valid = ajv.validate(schemaName, req.body)
        if(!valid){
            return res.json(errorResponse(ajv.errors))
        }
        next();
    }
}