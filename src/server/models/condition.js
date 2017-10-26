"use strict";

let mongoose            = require('mongoose'),
    Schema              = mongoose.Schema;

/***************** Condition Model *******************/

/* Schema for overall response */
let Condition = new Schema({
    id:             { type: Number, required: true },
    worker_id:      { type: String },
    assignment_id:  { type: String },
    hit_id:         { type: String },
    status:         { type: String, required: true, enum: [
        'open',
        'in-use',
        'completed'
    ] } }, { collection : 'condition'});

Condition.pre('validate', function(next) {
    // Sanitize strings
    //...
    next();
});

/***************** Registration *******************/

module.exports = mongoose.model('Condition', Condition);