import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import * as database from './database.js';

const app = express();

app.use(cors()) // TODO limit cors

app.use(express.json());

const port = process.env.PORT || 3001; 

app.listen(port, () => {
    console.log('App is listenning on ' + port);
    database.connect();
});

// TODO seperate to router and controllers 
app.post('/signup', async (req, res, next) => {
    
    try {
        const name = req.body.name; // TODO handle escaping 

        const user = await database.UserModel.findOne({
            name
        });
        
        if(user) {
            console.log('found user' + user);
            return res.status(200).send({
                user: user._id,
                success: true,
            });
        } 

        const newUser = new database.UserModel({
            name
        });

        await newUser.save();

        console.log('created user' + newUser);
        return res.status(201).send({
            user: newUser._id,
            success: true
        });

    } catch(err) {
        // TODO handle error
        console.log(err)
    }
    
});

app.get('/users', async (req, res, next) => {
    // verify indexes and performance
    const pipeline = [{
        $match: {}
    }, {
        $lookup: {
            from: 'useranalytics',
            localField: '_id',
            foreignField: 'user',
            as: 'answers'
        }
    }, {
        $unwind: {
            path: '$answers',
            includeArrayIndex: 'string'
        }
    }, {
        $project: {
            'answers.correct': 1,
            name: 1,
            _id: 1
        }
    }, {
        $sort: {
            'answers.correct': 1
        }
    }];

    const result = await database.UserModel.aggregate(pipeline)
    res.json({
        result
    });
});


app.post('/:id/answer', async (req, res, next) => {
    try {
        const user = await database.UserModel.findOne({
            _id: req.params.id
        });

        if(!user) {
            return res.status(500).json({
                success: false,
                err: 'User not found' //potential risk
            });
        }

        console.log('user found on answer route');
        
        await database.UserAnalyticsModel.findOneAndUpdate({
            user
        }, {
            $inc: {'total': 1, 'correct': req.body.answer ? 1 : 0}
        }, {
            upsert: true
        });
        console.log('updated db in answer route');
        
        res.status(200).send({
            success: true
        });
    } catch(err) {
        // handle errors
        console.log(err);
        res.status(400);
    }
});
