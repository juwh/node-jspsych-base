"use strict";

module.exports = app => {
    /*
     * Initialize a session token (called on socket connection in exp)
     *
     * @return { 200, {username, primary_email} }
     */
    app.post('/v1/session', (req, res) => {
        req.session.regenerate(() => {
            req.session.worker_id = req.body.worker_id;
            req.session.assignment_id = req.body.assignment_id;
            req.session.hit_id = req.body.hit_id;
            console.log(`Session initialization success: ${req.session.worker_id}`);
            res.status(200).send({
                worker_id: req.body.worker_id,
                assignment_id: req.body.assignment_id,
                hit_id: req.body.hit_id
            });
        });
    });

    /*
     * Destroy session (currently no way to initiate)
     *
     * @return { 204 if was logged in, 200 if no user in session }
     */
    app.delete('/v1/session', (req, res) => {
        if (req.session.token) {
            req.session.destroy(() => {
                res.status(204).end();
            });
        } else {
            res.status(200).end();
        }
    });

};
