/**
 * Authorization Module
 * @author Jefferson Puchalski
 */
//Includes
var express = require('express')
var router = express.Router()
var jwt = require('jsonwebtoken')

const secret = process.env.API_KEY



/**
 * Authorization class handler.
 */
class Auth {

    /**
     * Default constructor.
     */
    constructor(){
    }

    /**
     * Verify if token inside requisition are valid.
     * @param {*} res response to send.
     * @param {*} req requisition to be used on auth process.
     * @param {*} next If we are good advance on the process.
     */
    VerifyAuth(res, req, next) {
        //Grabe the bearer header and verify if we have any token for user
        const bearerHeader = req.req.headers['authorization']

        if(typeof bearerHeader !== 'undefined'){
            // Split spaces to get AUTH token inside bearer
            const processedToken = bearerHeader.split(' ')[1]
            req.token = processedToken
            if(req.token === 'undefined'){ next(Error) }
        } else{
            res.res.sendStatus(403)
                next(Error)
        }

        jwt.verify(req.token, process.env.API_KEY, (err, authData) => {
            if(err){
                console.log('Authorization Error: ', err)
                res.res.send({
                    message: err
                })
                //try refresh token
                CreateAuthToken
                next(err)
            } else {
                console.log('User email %s: ',authData.email)
                next()
            }
        })
    }

    /**
     * Create in asyncronous mode the Authorization token by given credentials
     * @param {object} credentials Object containing email and password credentials
     * @returns {Promise} The String result for creating token
     */
    async CreateAuthToken(credentials) {
        if(typeof credentials == 'undefined'){
            console.log('An error has occured when generating JWT token, Error: credentias is undefined')
            throw Error;
        }
        return new Promise(function (resolve, reject) {
            jwt.sign(credentials, secret, { expiresIn: 3600 }, (err, token)=> {
                if(err){
                    console.log('An error while generating Auth Token: ', err)
                    reject(err)
                }
                resolve(token)
            })
        });
    }

    async CreateRefreshToken(Token){
        if(typeof Token === 'undefined'){
            console.log('Error: The given token is undefined')
            throw Error
        }
    }
}


module.exports = Auth