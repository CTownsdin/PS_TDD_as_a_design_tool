'use strict';

var controller = require('../../controllers/event.server.controller.js'),
  mongoose = require('mongoose'),
  EventModel = mongoose.model('Event');

describe('Event Controller', function() {   // test the entire controller, use nested describe blocks to organize

  var req,
    res,
    statusCode,
    sentData;

  beforeEach(function() {
    res = {     // setup response mock
      send: function(code, data) {
        statusCode = code;
        sentData = data;
      }
    };
    EventModel.find = function(callback) {     // mongo find where name: event1
      callback(null, [{name: 'event1'}]);
    };
  });

  describe('When fetching all events', function() {

    // simplest test first
    it('Should return 200', function() {
      controller.getAllEvents(req, res);
      statusCode.should.equal(200);
    });

    it('Should send back data', function() {
      controller.getAllEvents(req, res);
      sentData[0].name.should.equal('event1');
    });

    it('Should return 500 when find errors', function() {
      EventModel.find = function(callback){
        callback({err: 1}, null);
      };

      controller.getAllEvents(req, res); // hit overridden err-find
      statusCode.should.equal(500);
    });
  });

  describe('When fetching single event', function(){

    beforeEach(function(){
      req = {
        params: {
          id: 1
        }
      };
    });

    it('should return 404 when not found', function(){
      EventModel.findById = function(id, callback){
        callback(undefined, undefined);
      };

      controller.findSingle(req, res);

      statusCode.should.equal(404);
    });

    it('should return 500 when find errors', function(){
      EventModel.findById = function(id, callback){
        callback({err:1}, undefined);
      };

      controller.findSingle(req, res);
      statusCode.should.equal(500);
    });

    it('should return data when successful', function(){
      EventModel.findById = function(id, callback){
        callback(undefined, {id: id, name: 'Test Event'});
      };

      controller.findSingle(req, res);
      sentData.id.should.equal(1);
    });
  });
});
