import mongoose from 'mongoose';

mongoose.connection.on('connecting', function(){
    console.info("Trying to establish a connection to mongo");
});

mongoose.connection.on('connected', function() {
    console.info("Connection to DB established successfully");
});

mongoose.connection.on('error', function(err) {
    console.error('Connection to mongo failed ' + err);
});

mongoose.connection.on('disconnected', function() {
    console.log('Mongo db connection closed');
})

const connect = () => {
    mongoose.connect('mongodb://0.0.0.0:27017/stormaven', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

//TODO seperate to different file 
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, {
    timestamps: true
});

const UserAnalytics = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    correct: Number,
    total: Number
}, {
    timestamps: true
})
// TODO no indexes here, should add

const UserModel = mongoose.model('User', UserSchema);
const UserAnalyticsModel = mongoose.model('UserAnalytics', UserAnalytics);


export {
    connect, UserModel, UserAnalyticsModel
}