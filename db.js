
function dbConnect(){
        const mongoose = require('mongoose');
    const url = 'mongodb://localhost/comments'

    mongoose.connect(url , {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })

    const connection = mongoose.connection
    connection.once('open' , ()=>{
        console.log('database connected')
    })
}

module.exports  = dbConnect