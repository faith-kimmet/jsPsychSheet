function ExampleExperiment(jsPsychHandle, experimentCodes) {
    const sessionBuilder = new SessionBuilder();
    sessionBuilder.createSession(RunExperiment);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      SET UP         /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function RunExperiment(session) {
        // Generate a random subject ID (6 characters)
        var subjectID = jsPsych.randomization.randomID(6);
        var subjectCondition = null; /* change this later depending on what condition participants are assigned to */
        const WEBGAZER_TARGET_CSS_ID = '#jspsych-video-button-response-stimulus';
        
        // Record the condition assignment in the jsPsych data
        // Adds "subject" and "condition" properties to each trial
        jsPsych.data.addProperties({subject: subjectID, condition: subjectCondition});
        jsPsych.data.addProperties(experimentCodes);

        // Welcome message
        var welcome = {
            type: "html-keyboard-response",
            stimulus: "Welcome to the experiment- thank you for your participation. Press any key to begin."
        };

        // Participant consent
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

        // Check participants' browsers for Chrome/Firefox
        let browser = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>Please complete this experiment using <strong>Google Chrome or Firefox</strong>. ' +
                    'If you are not using Google Chrome or Firefox, please close the experiment and ' +
                    'reopen it in one of the suggested browsers.' + 
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(5000)
        };

        let chinrest = {
            type: "virtual-chinrest",
            blindspot_reps: 3,
            resize_units: "none",
            pixels_per_unit: 50,
        };

        // Alert user about the delay
        let cameraWarning1 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p> Soon, the experiment will request access to your camera. Please grant it permission when prompted.</p>' +
                       '<p>The <b>only</b> webcam data collected will be the region of the screen you are looking at.</p>' +
                       '<p>Neither images nor recordings will be collected.</p>' +
                        jsPsych.timelineVariable('extra_instruction', true)
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(5000)
        };
        
        let cameraWarning2 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>Once granting webcam access, please allow a few minutes for the experiment to load.</p>' +
                       '<p>Please do <b>NOT</b> refresh or exit the experiment while it is waiting, as this will reset ' +
                       'your progress to the starting page.</p>' +
                        jsPsych.timelineVariable('extra_instruction', true)
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(5000)
        };

        var cameraInit = {
            type: 'webgazer-init-camera',
            instructions: `<p>Using the video in the upper-left corner as a guide, please center your face in the box and position your head so that the webcam has a clear image of your eyes. </p>
            <p>It is very important that you carefully maintain this position for the duration of the experiment, so please take a moment to adjust your setup as needed.</p>
            <p>When ready, move your face to the center of the box and look directly towards the camera.</p>
            <p>When your face is properly positioned, the box will turn green and you can click the button below to continue.</p>
            <p>Reminder: the <b>ONLY</b> webcam data collected is the point on the screen you are looking at. No images or recordings will ever leave your computer.</p>`
        };
    
        // Participant age
        var survey = {
            type: "survey-text",
            questions: [
                {prompt: "How old are you?",
                    required: true,
                    name: "Age"}
            ]
        };

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////       INSTRUCTIONS     //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ----------------------------------   Generic instructions    ---------------------------------------------------*/
        
        

        /* instructions pg 1  */
        let introInstructions = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>Thank you for your participation in this experiment. ' +
                ' Please read the instructions entirely before you begin.</p>' +
                jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(3000)
        };

        /* instructions pg 2 - sound check instructions */
        let soundCheckInstructions = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>For the duration of the experiment, please use headphones or turn your speakers ' +
                       'up to a comfortable volume. Please use the following screen as an opportunity ' +
                       'to check your audio settings and adjust the sound as necessary.</p> ' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(5000)
        };

        /* sound check screen */
        var pre_if_trial = {
            type: 'video-keyboard-response',
            stimulus: ['resources/AuditoryBaVisualBa.mp4'],
            width: 800,
            prompt:
                '<p>Press any key to repeat the video and adjust your volume as necessary. When you are ready to continue, press C.</p>'
        };

        var loop_node = {
            timeline: [pre_if_trial],
            loop_function: function(data){
                if('c' == data.values()[0].response){
                    return false;
                }
                else {
                    return true;
                }
            }
        };

        /* instructions pg 3 */
        var instructions_p3wait = {
            type: "image-keyboard-response",
            stimulus: "resources/arm.png",
            prompt: "<p>Throughout the duration of the experiment, please sit at an arm's distance " +
                    "from your computer screen, as illustrated above. Additionally, please focus your " +
                    "attention to the center of your screen.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
        };
        var instructions_p3go = {
            type: "image-keyboard-response",
            stimulus: "resources/arm.png",
            prompt: "<p>Throughout the duration of the experiment, please sit at an arm's distance " +
                    "from your computer screen, as illustrated above. Additionally, please focus your " +
                    "attention to the center of your screen.</p>" +
                    "<p> Once you have done so, press any key to continue.</p>",
        };


/*  --------------------------------- EXPERIMENT INFORMATION -------------------------------------------------------*/
        // Insert experiment instructions here //

        let  instructionsPg3 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>For this experiment, you will be watching videos of a woman prounouncing a syllable. ' +
                    'Each video will play only <strong>once</strong> per trial.</p>' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(3000)
        };

        let instructionsPg4 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>After watching the video, select the syllable that best matches the sound made by the woman. </p>' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(2000)
        };

        let instructionsPg5 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>After providing a response, please indicate how confident you feel in your selection on a scale of 0 to 100. ' +
                    '0 indicates <strong>no confidence</strong> and 100 indicates <strong>full confidence</strong>.</p>' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(3000)
        };

        let instructionsPg6 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return ' <p> After providing a confidence response, the next video will automatically play and this sequence will repeat. ' +
                    ' The experiment will be conducted in three blocks. Each block will be separated by a short break period. ' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(4000)
        };

/* ----------------------------------------    PRACTICE    ------------------------------------------------------ */

        let instructionsPg7 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p> Before the experiment begins, we will conduct some practice trials.' +
                    ' These trials are only for practice and your responses will not be recorded.</p>' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(3000)
        };

        var practiceTrial = {
            timeline: [
                // Show video
                { type: 'video-button-response',
                    stimulus: jsPsych.timelineVariable('video'),
                    width: 800,
                    choices: [],
                    data: jsPsych.timelineVariable('video'),
                    trial_ends_after_video: true,
                    prompt: '<p></p>'
                },

                // Participant percept
                { type: 'video-button-response',
                    stimulus: [],
                    width: 800,
                    choices: jsPsych.timelineVariable('syllables'),
                    data: jsPsych.timelineVariable('syllables'),
                    prompt: '<p>Which syllable did you perceive?</p>'
                },

                // Participant confidence
                { type: 'html-slider-response',
                    stimulus: '<p>How confident are you in your answer?</p>',
                    labels: ['0','25','50','75','100'],
                    min: 0,
                    max: 100,
                    start: function(){
                        return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];},
                    step: 1,
                    prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>",
                    require_movement:true
                }
            ],
            timeline_variables: [
                { video: ['resources/AuditoryBaVisualBa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
                { video: ['resources/AuditoryBaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Da','Ga','Pa'],1) },
                { video: ['resources/AuditoryBaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ka','Ga','Da'],1) }
            ],
            randomize_order: false,
            repetitions: 0
        };
        
/* ----------------------------------------   END PRACTICE    ------------------------------------------------------ */
        
        let instructionsPg8 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>Now that you have completed the practice trials, we are ready to begin the first part of the experiment. ' +
                    'Please be sure that you are seated arm\'s distance from your screen. ' +
                    '<strong>Your responses will now be recorded.</strong></p>' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(5000)
        };


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      EXPERIMENT    /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Stimuli bank
        /*

        congruentStimuli: [
        { video: ['resources/AuditoryNaVisualNa.mp4'], syllables: jsPsych.randomization.repeat(['Na', 'Ma', 'La', 'Ka' ],1) },
        { video: ['resources/AuditoryPaVisualPa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Ta', 'Ga', 'Ba'],1) },
        { video: ['resources/AuditoryGaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ga', 'Da', 'Ka', 'Ta'],1) },
        { video: ['resources/AuditoryTaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ta', 'Ka', 'Ga', 'Da'],1) },
        ]

        mcGurkStimuli: [
        { video: ['resources/AuditoryMaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ma', 'Ta', 'Na', 'La'],1) },
        { video: ['resources/AuditoryBaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ba', 'Ta', 'Pa', 'Da'],1) },
        { video: ['resources/AuditoryBaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Ba', 'Da', 'Ga', 'Pa'],1) },
        { video: ['resources/AuditoryPaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Da', 'Ka', 'Ta'],1) },
        ]

        incongruentStimuli: [
         { video: ['resources/AuditoryNaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Na', 'Da', 'Ka', 'Ma'],1) },
         { video: ['resources/AuditoryPaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Ta', 'Ka', 'Da'],1) },
         { video: ['resources/AuditoryGaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ga', 'Ta', 'Ka', 'Na'],1) },
         { video: ['resources/AuditoryTaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ta', 'Ma', 'Pa', 'Da'],1) }
        ]

        */


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      Congruent Exposure         ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
         let beginExp1 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>Press any key to begin.' +                    
                    jsPsych.timelineVariable('extra_instruction', false)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(500)
        };
        
        var congruentTimeline = {
            timeline: [
                {   // Show video
                    type: 'video-button-response',
                    stimulus: jsPsych.timelineVariable('video'),
                    width: 800,
                    choices: [],
                    data: jsPsych.timelineVariable('video'), /* Store the video name */
                    trial_ends_after_video: true,
                    prompt: '<p></p>',
                    extensions: [
                        {
                            type: 'webgazer',
                            params: {
                                targets: [WEBGAZER_TARGET_CSS_ID]
                            }
                        }
                    ],
                },
                {   // Collect participant's percept
                    type: 'video-button-response',
                    stimulus: [],
                    width: 800,
                    choices: jsPsych.timelineVariable('syllables'),
                    data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
                    prompt: '<p>Which syllable did you perceive?</p>'
                },
                {
                    // Participant confidence
                    type: 'html-slider-response',
                    stimulus: '<p>How confident are you in your answer?</p>',
                    labels: ['0','25','50','75','100'],
                    min: 0,
                    max: 100,
                    start: function(){
                        return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
                    },
                    step: 1,
                    prompt: "<p>Rate your confidence from 0 (no confidence) to 100 (fully confident)</p>",
                    require_movement:true
                }
                ],
            timeline_variables: [
                { video: ['resources/AuditoryNaVisualNa.mp4'], syllables: jsPsych.randomization.repeat(['Na', 'Ma', 'La', 'Ka' ],1) },
                { video: ['resources/AuditoryPaVisualPa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Ta', 'Ga', 'Ba'],1) },
                { video: ['resources/AuditoryGaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ga', 'Da', 'Ka', 'Ta'],1) },
                { video: ['resources/AuditoryTaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ta', 'Ka', 'Ga', 'Da'],1) },
                ],
            randomize_order: true,
            repetitions: 15 //This may change
        };

        let endCongruentExposure = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p> This concludes the first portion of the experiment. Please use this screen to take a break. ' +
                    ' There is no time-limit. ' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(2000)
        };

        var startMcGurkExposure = {
            type: "html-keyboard-response",
            stimulus:
                "<p> Press any key to begin the next part of the experiment. </p>"
        };



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      McGurk Exposure         ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var mcGurkTimeline = {
            timeline: [
                {   // Show video
                    type: 'video-button-response',
                    stimulus: jsPsych.timelineVariable('video'),
                    width: 800,
                    choices: [],
                    data: jsPsych.timelineVariable('video'), /* Store the video name */
                    trial_ends_after_video: true,
                    prompt: '<p></p>',
                    extensions: [
                        {
                            type: 'webgazer',
                            params: {
                                targets: [WEBGAZER_TARGET_CSS_ID]
                            }
                        }
                    ],
                },
                {   // Collect participant's percept
                    type: 'video-button-response',
                    stimulus: [],
                    width: 800,
                    choices: jsPsych.timelineVariable('syllables'),
                    data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
                    prompt: '<p>Which syllable did you perceive?</p>'
                },
                {
                    // Participant confidence
                    type: 'html-slider-response',
                    stimulus: '<p>How confident are you in your answer?</p>',
                    labels: ['0','25','50','75','100'],
                    min: 0,
                    max: 100,
                    start: function(){
                        return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
                    },
                    step: 1,
                    prompt: "<p>Rate your confidence from 0 (no confidence) to 100 (fully confident)</p>",
                    require_movement:true
                }
            ],
            timeline_variables: [
                { video: ['resources/AuditoryMaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ma', 'Ta', 'Na', 'La'],1) },
                { video: ['resources/AuditoryBaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ba', 'Ta', 'Pa', 'Da'],1) },
                { video: ['resources/AuditoryBaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Ba', 'Ka', 'Ga', 'Da'],1) },
                { video: ['resources/AuditoryPaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Da', 'Ka', 'Ta'],1) },
            ],
            randomize_order: true,
            repetitions: 15 //This may change
        };

        let endMcGurkExposure = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p> This concludes the second portion of the experiment. Please use this screen to take a break. ' +
                    ' There is no time-limit. ' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(2000)
        };

        var startNonBindingExposure = {
            type: "html-keyboard-response",
            stimulus:
                "<p> Press any key to begin the last part of the experiment. </p>"
        };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      NonBinding Exposure         ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var nonBindingTimeline = {
            timeline: [
                {   // Show video
                    type: 'video-button-response',
                    stimulus: jsPsych.timelineVariable('video'),
                    width: 800,
                    choices: [],
                    data: jsPsych.timelineVariable('video'), /* Store the video name */
                    trial_ends_after_video: true,
                    prompt: '<p></p>',
                    extensions: [
                        {
                            type: 'webgazer',
                            params: {
                                targets: [WEBGAZER_TARGET_CSS_ID]
                            }
                        }
                    ],
                },
                {   // Collect participant's percept
                    type: 'video-button-response',
                    stimulus: [],
                    width: 800,
                    choices: jsPsych.timelineVariable('syllables'),
                    data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
                    prompt: '<p>Which syllable did you perceive?</p>'
                },
                {
                    // Participant confidence
                    type: 'html-slider-response',
                    stimulus: '<p>How confident are you in your answer?</p>',
                    labels: ['0','25','50','75','100'],
                    min: 0,
                    max: 100,
                    start: function(){
                        return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
                    },
                    step: 1,
                    prompt: "<p>Rate your confidence from 0 (no confidence) to 100 (fully confident)</p>",
                    require_movement:true
                }
            ],
            timeline_variables: [
                 { video: ['resources/AuditoryNaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Na', 'Da', 'Ka', 'Ma'],1) },
                 { video: ['resources/AuditoryPaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Ta', 'Ka', 'Da'],1) },
                 { video: ['resources/AuditoryGaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ga', 'Ta', 'Ka', 'Na'],1) },
                 { video: ['resources/AuditoryTaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ta', 'Ma', 'Pa', 'Da'],1) }
                ],
            randomize_order: true,
            repetitions: 15 //This may change
        };

        let cameraCheck = {
            timeline: [
                {
                    type: 'html-keyboard-response',
                    stimulus: function() {
                        return `<p>The following event will calibrate our eyetracking. Please focus on dots as they appear, and then left-click each one with your mouse.</p>
                        ${jsPsych.timelineVariable('extra_instruction', true)}`
                    },
                    trial_duration: jsPsych.timelineVariable('trial_duration'),
                    timeline: [{}],
                    timeline_variables: CreateTrialDelay(2000)
                },
                {
                    type: 'webgazer-calibrate'
                },
                {
                    type: 'html-keyboard-response',
                    stimulus: function() {
                        return `<p>The following event will test the accuracy of our eye tracking. Please focus on the black dots as they appear.</p>
                        ${jsPsych.timelineVariable('extra_instruction', true)}`
                    },
                    trial_duration: jsPsych.timelineVariable('trial_duration'),
                    timeline: [{}],
                    timeline_variables: CreateTrialDelay(2000)
                },
                {
                    type: 'webgazer-validate'
                }
            ]
        }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      CLOSING         /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        /* closing page */
        let closingPage = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return ' <p>This now concludes the experiment. <strong> '+
                    jsPsych.timelineVariable('extra_instruction', true)
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: CreateTrialDelay(1000)
        };

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        /* experiment initiation sequence */
        jsPsych.init({
            timeline: [
                //Setup
                welcome,
                trial,
                browser,
                cameraWarning1,
                cameraWarning2,
                cameraInit,
                survey,
                sex,
                introInstructions,
                soundCheckInstructions,
                pre_if_trial, loop_node,
                
                //Instructions
                instructions_p3wait, instructions_p3go,
                instructionsPg3,
                instructionsPg4,
                instructionsPg5,
                instructionsPg6,
                instructionsPg7,
                practiceTrial,
                instructionsPg8,
                //beginExp1,

                //Experiment
                chinrest,
                cameraCheck,
                congruentTimeline,
                endCongruentExposure,
                chinrest,
                cameraCheck,
                startMcGurkExposure,
                mcGurkTimeline,
                endMcGurkExposure,
                chinrest,
                cameraCheck,
                startNonBindingExposure,
                nonBindingTimeline,
                closingPage
            ],
            show_progress_bar: true,
            on_trial_finish: function(data) {
                session.processWebgazerData(data, WEBGAZER_TARGET_CSS_ID);
                session.processValidationData(data);
                session.insert(data);
            },
            on_finish: function() {
                window.top.location.href = 'https://app.prolific.co/submissions/complete?cc=10770AE6'
            },
            extensions: [{ type: 'webgazer' }]
        });
    }

    function CreateTrialDelay(duration) {
        return [
            {
                choices: jsPsych.NO_KEYS,
                trial_duration: duration,
                extra_instruction: ''
            },
            {
                choices: jsPsych.ALL_KEYS,
                trial_duration: null,
                extra_instruction: '<p>Press any key to continue.</p>'
            }
        ]
    }
}
