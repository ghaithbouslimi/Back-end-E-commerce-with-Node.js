
const {expressJwt : jwt }  = require('express-jwt'); 



module.exports=authJwt; 

function authJwt() {
    const secret = process.env.secret;
   
    return  jwt ({secret,  algorithms: ['HS256']}).unless

        
   
} 



     
 




/*

.unless({
        path:[
            '/api/v1/users/login',
        ]
    })

const { expressJwt } = require('express-jwt'); 

exports.requireSignin = expressJwt({
secret: process.env.secret,
algorithms: ["HS256"],
userProperty: "auth",});
*/