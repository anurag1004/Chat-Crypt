const express = require('express'),
router = express.Router(),
bcrypt = require('bcrypt'),
jwt = require('jsonwebtoken'),
User = require('../models/user.js'),
Bearer = require('../models/issuedToken.js'),
config= require('../config.js')

router.get('/login',(req, res)=>{
    console.log("Session Active Status "+req.session.status);
    // console.log(req.headers)
    if(req.session.status){
       
        res.redirect('/');
    }
    else{
        
        res.render("login");
    }
});

router.post('/login',(req, res)=>{
    console.log("login post request");
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username: username},(err, user)=>{
        if(err){
            console.log(err);
            res.redirect('/login');
        }else{
          try{
            if(user.length !=0){
                bcrypt.compare(password, user.password).then(passwordsMatch=>{
                    if(passwordsMatch){
                    //   const date = new Date();
                    //    const expiresIn = new Date();
                    //    expiresIn.setMinutes(date.getMinutes()+1);
                    //    console.log(date.getTime());
                    //    console.log(expiresIn.getTime());
                        // const JWT = create_token(username,"60000"); //1min = 60000ms
                        //store active tokens in the database
                        //if client is trying to log in again then delete all the previous token issued to him//
                        //it is just for extra security//

                        Bearer.deleteMany({bearer : username},(err)=>{console.log(err)});

                        Bearer.create({bearer: username,user_id: user._id},(err, issued)=>{
                            if(err){
                                console.log(err);
                            }else{
                                const JWT = create_token(username,"600000", issued._id); //1min = 60000ms
                                //cookie will be deleted after 10min
                                res.cookie("jwt", JWT, {expire: 600000 + Date.now(),httpOnly: true,sameSite:true});
                                res.cookie("AES_KEY",process.env.AES_KEY,{expire: 600000 + Date.now(),httpOnly: true,sameSite:true})
                                //managing session using express session, just using to check login status
                                req.session.user_id = user._id;
                                req.session.status = true;
                                res.redirect('/');
                            }
                        })

                    }else{
                       res.sendStatus(401).send("Authentication error");
                    }
                }).catch(err=>{
                    console.log(err);
                });
            }else{
                console.log("No such user found");
                res.redirect('/register');
            }
          }catch(err){
            console.log("No such user found");
            res.redirect('/register');
          }
            
        }
    })
});
router.get('/logout',validate_token,(req, res)=>{
    //clear all cookies
    res.clearCookie("jwt");
    res.clearCookie("AES_KEY")
    //delete all active tokens from the database
    Bearer.deleteMany({user_id: req.user_id},(err)=> console.log(err));

    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            //destroy the session and redirect back to login page
            res.redirect('/login');
        }
    });
    
})
//Routes for new user
router.get('/register',(req, res)=>{
    if(req.session.status) res.redirect('/');
    else
    res.render("register");
});
router.post('/register',(req, res)=>{
    console.log("post register route");
    const username = req.body.username
    const password = req.body.password
    const fname = req.body.inputfname
    const lname = req.body.inputlname
    User.find({username: username},(err,foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser.length == 0){
                const hash = bcrypt.hash(password,config.saltingRounds,(err, hashed)=>{
                    if(err){
                        console.log("error hashing the password");
                    }
                    else{
                        const user = new User();
                        user.username = username;
                        user.password = hashed;
                        user.firstName = fname;
                        user.lastName = lname;
                        User.create(user,(err, newUser)=>{
                            if(err){
                                console.log(err);
                                }else{
                                //redirect to login route
                                
                                res.redirect('/login');
                            }
                        })
                    }
                })
            }else{

                console.log("user already exists");
                res.redirect('/login');
            }
        }
    })
});
function create_token(username, expiresIn, _id){

    const payload = { user: username, _id};
    // console.log(payload)
    const options = { expiresIn:expiresIn, issuer: 'AxDu' };
    const secret = config.jwt_secret;
    const token = jwt.sign(payload, secret, options);
    return token;

    }
function validate_token(req, res, next){
    const client_token = req.cookies.jwt;
    // console.log(client_token);
    jwt.verify(client_token, config.jwt_secret, (err, decoded)=>{
        if(err){
            // console.log(err);
            console.log("Token Expired!!");
            res.clearCookie("jwt");
            res.clearCookie("AES_KEY");
            res.redirect("/login");
        }else{
            // console.log(decoded);
            //{ user : ,iat: , exp: , iss}
            Bearer.find({_id: decoded._id},(err, foundToken)=>{
                if(err){
                    console.log(err);
                }
                    else{
                        if(foundToken.length == 1){
                                req.user_id = foundToken[0].user_id
                                req.headers["user_id"] = foundToken[0].user_id
                                req.headers["loggedInUser"] = foundToken[0].bearer
	                            res.locals.loggedInUser = req.headers["loggedInUser"]

                                //routerend a user object to request header//
                                //console.log(req.user_id);
                                next();

                        }else{
                            console.log("Token couldn't be found!");

                            res.clearCookie("jwt"); //user not found on the issued token list
                            res.clearCookie("AES_KEY");
                            req.session.status = false;
                            res.redirect('/login');
                        }
                    }
            })
        }
    });
}
module.exports = router