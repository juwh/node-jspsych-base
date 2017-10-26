/**
 * Created by tonglab on 3/24/17.
 */
let hitId = GetHitId();
let workerId = GetWorkerId();
let assignmentId = GetAssignmentId();

var parameters = {
    'hitId': hitId,
    'workerId': workerId,
    'assignmentId': assignmentId
};

console.log(parameters);

function openwindow() {
    let expWindow = window.open('/exp.html');
}

if (IsOnTurk() && IsTurkPreview()) {
    $("#accepted").hide();
    $("#preview").show();
}