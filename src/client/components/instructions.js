import React    from 'react';
import ReactDOM from 'react-dom';

const center = {
    textAlign: 'center',
    maxWidth: '650px'
};

/* Instruction content returned with the index starting at 0 */
const instructions = (block, state, cb) => {
    let instructionMap = new Map();

    let instruct_motor = (<div id="test1"><h1>Thank you! </h1>
        <hr/>

        <h2>How to rotate the central line in the display </h2>

        <div><img src="./assets/images/adjust_line_angle.png" style={{maxWidth: '100%'}}/></div>

        <br></br>

        <p> Move the mouse around the fixation point to adjust the angle of the central line, so it matches the angle of
            the other line. They should be <b>parallel</b>.

            Be as accurate as you can.
            To pass this test, <b>your average accuracy must be greater than 95%</b></p>

        <br></br>

        <div>
            <button type="button" className="btn btn-success" onClick={cb}>Start Practice Trials</button>
        </div>
    </div>);
    let instruct_prac2 = (<div id="test2"><h1>Practice: Memory for 2 items</h1>
        <hr/>

        <div><img src="./assets/images/memory_for_2items.png" style={{maxWidth: '100%'}}/></div>

        <br></br>

        <p>Please keep your eyes focused on the central dot throughout each trial, which should take about 4-6
            seconds.</p>
        <p>2 lines will briefly appear in the periphery, too briefly to look at directly, so you will do best if you
            keep your eyes on the central dot.</p>
        <p>After a short delay, a circle will appear at one of the line locations.

            Report the angle of that line from memory by adjusting the angle of the central line.</p>
        <p><b>Be as accurate as you can, and take your time to respond accurately.</b></p>
        <p>To pass this test, your average accuracy should be above
            <mark>80%</mark>
            !
        </p>

        <br></br>

        <div>
            <button type="button" className="btn btn-primary" onClick={cb}>Start Practice: Memory for 2 items</button>
        </div>
    </div>);
    let instruct_prac6 = (<div id="test3"><h1>Practice: Memory for 6 items</h1>
        <hr/>

        <p>
            You will have 10 practice trials that match the real test.
            You will be presented with 6 lines to remember.
            Don't worry if you find this more challenging, just do the best you can.

            Try to remember as many items as you can, as precisely as you can.
        </p>

        <br></br>

        <div>
            <button type="button" className="btn btn-primary" onClick={cb}>Start Practice: Memory for 6 items</button>
        </div>
    </div>);
    let instruct_exp = (<div id="actual"><h1>Actual Test: Memory for 6 items</h1>
        <hr/>

        <p>This is the actual experiment.
            Do the best you can!</p>
        <p>You will receive a total of 106 trials, which should take about 12 minutes.</p>
        <h2>Reminder:</h2>
        <p>Try to remember as many items as possible, and respond as accurately as possible. </p>
        <p>Keep your eyes on the central dot while doing this task.</p>

        <br></br>

        <div>
            <button type="button" className="btn btn-primary" onClick={cb}>Start Actual Test: Memory for 6 items
            </button>
        </div>
    </div>);
    instructionMap.set('motor', instruct_motor);
    instructionMap.set('prac2', instruct_prac2);
    instructionMap.set('prac6', instruct_prac6);
    instructionMap.set('exp', instruct_exp);

    switch(state) {
        case 'request':
            return (<div style={center} className="alert alert-info">Retrieving trial conditions from server If this display does not change within 10 seconds, please close and reopen the window.</div>);
            break;
        case 'error':
            return (<div style={center} className="alert alert-danger"><strong>Error!</strong> Could not retrieve trial conditions. Refresh to retry or return the HIT and contact: <mark>ftonglab@gmail.com</mark></div>);
            break;
        default:
            return (<div style={center} className="container-fluid">{instructionMap.get(block)}</div>);
    }
};

module.exports = {
    instructions: instructions
};