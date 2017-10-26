"use strict";

module.exports = app => {
    // Handle GET to fetch game state
    app.get('/v1/condition', (req, res) => {
        if (!req.session.worker_id) {
            return res.status(401).send({ error: 'unauthorized' });
        }

        const worker_id = req.session.worker_id;
        const assignment_id = req.session.assignment_id;
        const hit_id = req.session.hit_id;
        app.models.Condition.findOneAndUpdate({status: 'open'}, {$set:{worker_id: worker_id,
            assignment_id: assignment_id, hit_id: hit_id, status: 'in-use'}}, (err, condition) => {
            if (err || ! condition) {
                console.log(`Condition get and update failure: ${err}`);
                res.status(404).send({error: `Failed condition retrieval.`});
            } else {
                const response = condition.id;
                res.status(200).send(response.toString());
            }
        });
    });

    // Handle PUT for game update
    app.put('/v1/condition/:assignment', (req, res) => {
        if (!req.session.worker_id) {
            return res.status(401).send({ error: 'unauthorized' });
        }

        app.models.Condition.findOneAndUpdate({id: req.params.assignment}, {$set:{worker_id: null,
            assignment_id: null, hit_id: null, status: 'open'}}, (err, condition) => {
            if (err) {
                console.log(`Condition clear: ${err}`);
                res.status(404).send({ error: `Condition clear error: ${req.params.id}` });
            } else {
                res.status(200).send(`Condition ${condition.id} freed.`);
            }
        });
    });
};