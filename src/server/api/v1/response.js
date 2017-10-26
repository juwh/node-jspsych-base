"use strict";

module.exports = app => {
    // Handle POST to save user data
    app.post('/v1/response', (req, res) => {
        if (!req.session.worker_id) {
            res.status(401).send({ error: 'unauthorized' });
        } else {
            let response = new app.models.Response(req.body);
            response.save(err => {
                if (err) {
                    console.log(`Response.create save failure: ${err}`);
                    res.status(400).send({ error: 'failure saving responses' });
                } else {
                    res.status(201).send({
                        assignment: response.assignment_id
                    });
                }
            });
        }
    });
};