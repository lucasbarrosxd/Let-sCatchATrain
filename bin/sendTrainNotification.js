#!/usr/bin/env node

//Add your Account SID 
var accountSid = 'ACfa72e06cda69a82aaed91d3d7a69f129'; 

//Add your Auth Token here
var authToken = '1677492b8db400f17e4e169a0a6df9e0';   

var destinationStation = 'Glasgow Queen Street';
var userPhoneNumber = '+5585988443887';
var sourceStationCode = 'EDB';
var sourceStation = 'Edinburgh Waverley';

function sendSMS(msg, userPhoneNumber){
    var twilio = require('twilio');
    var client = new twilio(accountSid, authToken);
    //Create a message with to and from numbers
    client.messages.create({
        body: msg,
        to: userPhoneNumber, 
        from: '+15852944599' //YOUR_NUMBER 
    }).then((message) => console.log(message.sid));
}

 function getTrains(sourceStation, sourceStationCode, 
                                 destinationStation, 
                                 userPhoneNumber){
    var request = require('request');
    var url = 'http://transportapi.com/v3/uk/train/station/' + 
               sourceStationCode   + '/live.json?app_id=bfb1f38b&app_key=a289354b7b2261ad75700a930685ba8e';
    
    request(url, function (error, response, body) {
       if (response){
            var json = JSON.parse(body);
            if (json.departures){
                //console.log('Departures:', 
                //JSON.stringify(json.departures)); 
                
                var dep = 
                getTrainsToDestination(destinationStation,
                json.departures.all);
                
                var summary = summarize(destinationStation, 
                                        sourceStation, dep);
    
                console.log('Summary: ' + summary);
                sendSMS(summary, userPhoneNumber);
            } else {
                console.log('No Departures found!');
            } 
        } else {
            console.log('error:', error); // Print the error if one 
                                          // occurred 
        }
    });
}

function getTrainsToDestination(destination, allDepartures){
    var d = [];
    
    if (allDepartures){
        for (var i=0; i < allDepartures.length; i++){
            var service = allDepartures[i];
            if (service.destination_name == destination){
                d.push(service)
            }
        }
    }
    return d;
}

function summarize(destinationStation, sourceStation, departures){
    
    var out = '';
    if (departures.length > 0){
        out = 'Here are the departures this morning to ' + 
               destinationStation 
                                 + ".\n";
        for (var i=0; i< departures.length; i++){
            var service = departures[i];
            var serviceSummary = service.operator_name 
                                 + " at " +    
                                         
            service.expected_departure_time; 
            out += serviceSummary + "\n"
        }
    } else {
        out = 'There are no trains to ' + destinationStation + 
                                                ' from ' + 
                                          sourceStation;
    }
    return out;
}


getTrains(sourceStation, sourceStationCode, destinationStation, userPhoneNumber);