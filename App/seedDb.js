
const User = require('./models/user.js'),
bcrypt = require('bcrypt'),
config= require('./config'),
mongoose = require('mongoose');
const accounts = [{
    "firstName":"Anurag",
    "lastName":"Verma",
    "username":"anurag",
    "password":"12345"
},{
    "firstName":"Sayantan",
    "lastName":"Ghosh",
    "username":"sayantan",
    "password":"12345"
},{
    "firstName":"Amit",
    "lastName":"Singh",
    "username":"amit",
    "password":"12345"
},{
    "firstName":"Akash",
    "lastName":"Ranjan",
    "username":"akash003",
    "password":"12345",
},{
    "firstName":"K",
    "lastName":"Rohit",
    "username":"alpha909",
    "password":"12345",
},{
    "firstName":"Tony",
    "lastName":"Stark",
    "username":"bravo101",
    "password":"12345"
}]
mongoose.connect('mongodb://localhost:27017/ChatCrypt',{
   useNewUrlParser: true,
   useFindAndModify: false,
   useCreateIndex: true,
   useUnifiedTopology: true 
});
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
// // delete all entries
User.deleteMany({},(async (err, obj)=>{
    if(err){
        throw new Error(err)
    }
    console.log("Deleted All User entries !")
    // add entries
    await asyncForEach(accounts, async (account)=>{
        const raw_password = account.password;
        const  hashed = await bcrypt.hash(raw_password,config.saltingRounds).catch((err)=>{throw new Error(err)})
        const user = new User();
        user.username = account.username;
        user.firstName = account.firstName;
        user.lastName = account.lastName;
        user.password = hashed;
        await User.create(user).catch(err=>{throw new Error(err)});
    })
    console.log("Seed Complete!")
    mongoose.connection.close(function() {
        console.log("DB connection closed!")
    });
}))

