/* Copyright G. Hemingway @2017 - All rights reserved */
"use strict";

let mongoose            = require('mongoose'),
    Schema              = mongoose.Schema;

/***************** Response Model *******************/

/* Schema for randomly generated struct */
let GeneratedTrial = new Schema({
    coordinate_loc:     [ Schema.Types.Object ],
    polar_loc:          [ Number ],
    polar_orient:       [ Number ],
    prac:               { type: Number },
    response:           { type: Number },
    setsize:            { type: Number },
    stimtype:           { type: Number },
    target:             { type: Number },
    trial:              { type: Number },
});

/* Schema for pregenerated struct */
let PregeneratedTrial = new Schema({
    coordinate_loc:     [ Schema.Types.Object ],
    displayID:          { type: Number },
    polar_loc:          [ Number ],
    polar_orient:       [ Number ],
    prac:               { type: Number },
    setsize:            { type: Number },
    response:           { type: Number },
    stimtype:           { type: Number },
    subjID:             { type: Number },
    target:             { type: Number },
    trial:              { type: Number },
});

/* Schema for overall response data */
let Response = new Schema({
    assignment_id:          { type: String, required: true },
    worker_id:              { type: String, required: true },
    current_date:           { type: String },
    user_agent:             { type: String },
    window_width:           { type: Number },
    window_height:          { type: Number },
    screen_width:           { type: Number },
    screen_height:          { type: Number },
    //total_time: Number,
    //comments: $('#comments').val(),
    generated_trials:       [{ type: GeneratedTrial, required: true }],
    pre_generated_trials:   [{ type: PregeneratedTrial, required: true }]
});

Response.pre('validate', function(next) {
    // Sanitize strings
    //...
    next();
});

/***************** Registration *******************/

module.exports = mongoose.model('Response', Response);

