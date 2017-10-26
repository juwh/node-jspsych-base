/**
 * Created by tonglab on 3/31/17.
 */
'use strict';


import React, { Component }     from 'react';

const styles = {
        container: {
        padding: '5%',
        paddingTop: '4%'
    },
    adlogo: {
        padding: '5%',
        paddingBottom: '10%',
        paddingRight: '10%'
    }
};

/*************************************************************************/

/*************************************************************************/

export class Ad extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accepted: false,
            parameters: null
        };

        this.openWindow = this.openWindow.bind(this);
    }

    componentWillMount() {
        let hitId = GetHitId();
        let workerId = GetWorkerId();
        let assignmentId = GetAssignmentId();

        let parameters = {
            'hit_id': hitId,
            'worker_id': workerId,
            'assignment_id': assignmentId
        };

        console.log(parameters);
        console.log(IsOnTurk());
        console.log(IsTurkPreview());

        localStorage.setItem('parameters', JSON.stringify(parameters));

        //IsOnTurk() && !IsTurkPreview()
        if (IsOnTurk() && !IsTurkPreview()) {
            this.setState((prevState, props) => {
                return {accepted: true, parameters: parameters};
            });
        }
    }

    openWindow() {
        $.ajax({
            url: "/v1/session",
            method: "post",
            data: this.state.parameters,
            success: (data) => {
                let expWindow = window.open('/setup');
            },
            error: (err) => {
                console.log('Error initializing session token!')
            }
        });
    }

    render() {
        const text = this.state.accepted ?
            <div id="accepted">
                <h1>Thank you for accepting this HIT!</h1>

                <p>
                    By clicking the following button, you will be taken to the experiment, including complete instructions.
                </p>
            </div>:
            <div id="preview">
                <h1>Participate in a study on visual short-term memory!</h1>

                <p>
                    You are invited to participate in a research project conducted by Dr. Frank Tong from the Department of Psychology at Vanderbilt University. We are interested in learning about people's ability to hold visual information actively in mind for a brief period of time, an ability called <i>visual working memory</i>.
                </p>
                <p>
                    In this study, you will be briefly shown arrays of randomly tilted lines, and after a short delay, you will be asked to report the angle of a particular line from memory. <b>Respond as accurately as you can.</b>
                </p>
                <p>
                    You will receive some practice trials to learn the task. You will need to perform the task accurately to continue to the main experiment. This experiment will take about <mark>15-20 minutes</mark>, and you will be paid after completing the full experiment.
                </p>
                <div className="alert alert-danger">
                    You can opt to quit performing this HIT at any time without penalty, <strong>but you will not be paid and will not be eligible to participate in this HIT again.</strong>
                </div>
                <p>
                    To participate, you must be at least 18 years of age, have normal healthy vision either with or without corrective lenses, and reside in the United States. You may choose to provide information about your age, gender, ethnicity, and level of education. The information collected for this study will be maintained confidentially, and will be used only for the purposes of this study.
                </p>
                <p>
                    If you have any questions about this study, please contact: <mark>ftonglab@gmail.com</mark>
                </p>
                <p>
                    By accepting this HIT, you are consenting to the terms of the experiment explained above and voluntarily agree to participate in this study.
                </p>
            </div>;

        const button = this.state.accepted ?
            <div>
                <br/>
                <div className="alert alert-warning">
                    <b>Warning</b>: Please disable pop-up/ad blockers and maximize your browser window before continuing.
                </div>

                <button type="button" className="btn btn-primary" onClick={this.openWindow}>
                    Open Experiment
                </button>
            </div>:
            '';
        /*
         <div id="error">
         <h1>Sorry, there was an error</h1>
         <p>
         Sorry, our records indicate that you have attempted to complete this HIT, but quit before finishing. Because this is a Psychology experiment, you can only complete this HIT once. Please return the HIT so someone else can perform the experiment.
         </p>
         </div>
         */

        return <div className="container" style={styles.container}>
            <div className="row">
                <div className="col-xs-4 col-md-3">
                    <img id="adlogo" className="img-responsive" style={styles.adlogo} src="/images/university.png"/>
                </div>
                {text}
            </div>
            {button}
        </div>
    };
}
