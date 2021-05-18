function ExampleExperiment(jsSheetHandle, jsPsychHandle, survey_code) {
    jsSheetHandle.CreateSession(RunExperiment)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      SET UP         /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function RunExperiment(session) {
        // Generate a random subject ID (6 characters)
        var subjectID = jsPsych.randomization.randomID(6);
        var subjectCondition = null; /* change this later depending on what condition participants are assigned to */

        // Record the condition assignment in the jsPsych data
        // Adds "subject" and "condition" properties to each trial
        jsPsych.data.addProperties({subject: subjectID, condition: subjectCondition});

        // Create the timeline
        var timeline = [];

        // Welcome message
        var welcome = {type: "html-keyboard-response",
            stimulus: "Welcome to the experiment- thank you for your participation. Press any key to begin."};
        timeline.push(welcome);

        // Participant consent
        // NOTE: We're doing a new experiment, need to source new consent form
        // NOTE: deleting this chunk and the check_fn in the trial variable breaks the continue button
        var check_consent = function(elem) {
            if (document.getElementById('consent_checkbox').checked) {
                return true;
            }
            else {
                alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
                return false;
            }
            return false;
        };

        var trial = {
            type:'external-html',
            url: "resources/Consent.html",
            cont_btn: "consent-button",
            //check_fn: check_consent
        };
        timeline.push(trial);

        // Check participants' browsers for Chrome/Firefox
        let browser = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>Please complete this experiment using <strong>Google Chrome or Firefox</strong>. If you are not using Google Chrome or Firefox, please close the experiment and reopen it in a suggested browser.'+
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 7500, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(browser);

        // Participant age
        var survey = {
            type: "survey-text",
            questions: [
                {prompt: "How old are you?",
                    required: true,
                    name: "Age"}
            ]
        };
        timeline.push(survey);

        // Participant sex
        var sex_options = ["Male", "Female", "Intersex"];
        var sex = {
            type: "survey-multi-choice",
            questions: [
                {prompt:"Please identify your sex.",
                    name: "Sex",
                    options: sex_options,
                    required:true}
            ]
        };
        timeline.push(sex);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////       INSTRUCTIONS     //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ----------------------------------   Generic instructions    ---------------------------------------------------*/

        /* instructions pg 1  */
        var instructions_p1wait = {
            type: "html-keyboard-response",
            stimulus:
                "<p>Thank you for your participation in this experiment. " +
                "Please read the instructions entirely before beginning.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 5000,
        };
        var instructions_p1go = {
            type:"html-keyboard-response",
            stimulus:
                "<p>Thank you for your participation in this experiment. " +
                "Please read the instructions entirely before beginning.</p>"+
                "<p>Press any key to continue.</p>",
        };
        timeline.push(instructions_p1wait, instructions_p1go);

        /* sound check instructions */
        var sound_instructionswait = {
            type: "html-keyboard-response",
            stimulus:
                "<p>For the duration of the experiment, please use headphones or turn your speakers to a comfortable volume. " +
                "Please use the following screen as an opportunity to check your audio settings and adjust as necessary.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
        };
        var sound_instructionsgo = {
            type: "html-keyboard-response",
            stimulus:
                "<p>For the duration of the experiment, please use headphones or turn your speakers to a comfortable volume. "+
                "Please use the following screen as an opportunity to check your audio settings and adjust as necessary.</p>" +
                "<p>Press any key to continue.</p>",
        };
        timeline.push(sound_instructionswait, sound_instructionsgo);

        /* sound check screen */
        var pre_if_trial = {
            type: 'video-keyboard-response',
            sources: ['resources/AuditoryBaVisualBa.mp4'],
            width: 800,
            prompt:
                '<p>Press any key to repeat the video and adjust your volume as necessary. When you are ready to continue, press C.</p>'
        }
        var loop_node = {
            timeline: [pre_if_trial],
            loop_function: function(data){
                if(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('c') == data.values()[0].key_press){
                    return false;
                }
                else {
                    return true;
                }
            }
        };
        timeline.push(pre_if_trial, loop_node);


        /* instructions pg 2 */
        var instructions_p2wait = {
            type: "image-keyboard-response",
            stimulus: "resources/arm.png",
            prompt: "<p>Throughout the duration of the experiment, please sit at an arm's distance from your computer " +
                "screen, as illustrated above. Additionally, please focus your attention to the center of your screen.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
        };
        var instructions_p2go = {
            type: "image-keyboard-response",
            stimulus: "resources/arm.png",
            prompt: "<p>Throughout the duration of the experiment, please sit at an arm's distance from your computer " +
                "screen, as illustrated above. Your attention should also be focused on the center of your screen.</p>" +
                "<p> Once you have done so, press any key to continue.</p>",
        };
        timeline.push(instructions_p2wait, instructions_p2go);


/*  --------------------------------- EXPERIMENT INFORMATION -------------------------------------------------------*/
        // Insert experiment instructions here //

        /* compensation information */
        var compensationwait = {
            type: "html-keyboard-response",
            stimulus: "<p>Once you have completed the experiment, <strong>do not close your browser window</strong> until your responses have been confirmed as recorded. "+
                "You will be automatically be compensated for your participation. Credits will be added to your SONA account shortly after completing the experiment. </p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
        };
        var compensationgo = {
            type: "html-keyboard-response",
            stimulus: "<p>Once you have completed the experiment, <strong>do not close your browser window</strong> until your responses have been confirmed as recorded."+
                "You will be automatically be compensated for your participation. Credits will be added to your SONA account shortly after completing the experiment. </p>"+
                "<p>Press any key to continue.</p>",
        };
        timeline.push(compensationwait, compensationgo);

/* ----------------------------------------    PRACTICE    ------------------------------------------------------ */

        /* instructions pg 7 */
        var instructions_p7wait = {
            type: "html-keyboard-response",
            stimulus: "<p>Before the experiment begins, we will conduct some practice trials."+
                "These trials are only for practice and your responses will not be recorded.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 5000,
        };
        var instructions_p7go = {
            type: "html-keyboard-response",
            stimulus: "<p>Before the experiment begins, we will conduct some practice trials."+
                "These trials are only for practice and your responses will not be recorded.</p>"+
                "<p> Press any key to begin.</p>",
        };
        timeline.push(instructions_p7wait,instructions_p7go);

        /* define practice trial */
        /* this needs to be edited to run like new experiment*/
        // Copy from trial format ~ 30 lines below
        // var practice_trial = {};

        /* prepare to begin experiment */
        var pretestwait = {
            type: "html-keyboard-response",
            stimulus: "<p>Now that you have completed the practice trials, we are ready to begin the first part of the experiment. " +
                "Please be sure that you are seated arm's distance from your screen. <strong>Your responses will now be recorded.</strong></p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 6000,
        };
        var pretestgo = {
            type: "html-keyboard-response",
            stimulus: "<p>Now that you have completed the practice trials, we are ready to begin the first part of the experiment. " +
                "Please be sure that you are seated arm's distance from your screen. <strong>Your responses will now be recorded.</strong></p>" +
                "<p>Press any key to begin the experiment.</p>",
        };
        timeline.push(pretestwait,pretestgo);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      EXPERIMENT     /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      CLOSING         /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        /* closing page */
        var endwait = {
            type: "html-keyboard-response",
            stimulus: "<p>This now concludes the experiment. <strong> Please do not close the experiment until your responses have been confirmed as recorded.</strong> Press the right arrow key to receive automated SONA credit.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
        };
        var endgo = {
            type: "html-keyboard-response",
            stimulus: "<p>This now concludes the experiment. <strong> Please do not close the experiment until your responses have been confirmed as recorded.</strong> Press the right arrow key to receive automated SONA credit. </p>"+
                "<p> Press any key to continue.</p>",
        };
        timeline.push(endwait,endgo);


        /* experiment initiation sequence */
        jsPsych.init({
            timeline: timeline,
            show_progress_bar: true,
            on_trial_finish: session.insert,
            on_finish: function() {
                window.top.location.href = `https://ufl.sona-systems.com/webstudy_credit.aspx?experiment_id=144&credit_token=97e1a7b13d9e4e098133f23a76e40e04&survey_code=${survey_code}`
            }
        });
    }
}
