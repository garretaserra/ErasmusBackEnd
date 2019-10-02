'use strict';
let Test = require('./../models/test');

exports.test = async function (req, res){
    res.status(200).send('It works');
};

exports.add = async function (req, res){
    let test = req.body;

    //Check if user has been sent
    if(!test){
        console.log('Error: at test has not been added');
        res.status(400).send('Test not added');
        return;
    }

    //Check for existing tests with same name
    let testFound = await Test.findOne({testName: test.testName});
    if(testFound){
        console.log('Error: test with existing name ' + testFound.testName + ' already exists');
        res.status(400).send('Error: test with existing name ' + testFound.email + ' already exists');
        return;
    }

    //Add user to database
    let newTest = new Test(test);
    await newTest.save().then( test =>{
            console.log('Test has been registered successfully\n'+test);
            res.status(200).send('Test has been registered successfully\n'+test);
        }
    )
};


