function ExampleExperiment(jsSheetHandle, jsPsychHandle, survey_code) {
    jsSheetHandle.CreateSession(RunExperiment)

    function RunExperiment(session) {
        // generate a random subject ID with 15 characters
	var subject_id = jsPsych.randomization.randomID(6);
	
	// record the condition assignment in the jsPsych data
	// this adds a property called 'subject' and a property called 'condition' to every trial
	jsPsych.data.addProperties({
  		subject: subject_id,
	});
	    
	/* create timeline */
	var timeline = [];

	/* define welcome message trial */	
	var welcome = {
  		type: "html-keyboard-response",
  		stimulus: "Welcome to the experiment- thank you for your participation. Press any key to begin."
	};
	timeline.push(welcome);
    
    /* define consent form - note: deleting this chunk and the check_fn in the trial variable doesn't make the consent form continue button work */
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


   /* require consent */
      var trial = {
        type:'external-html',
        url: "resources/Consent.html",
        cont_btn: "consent-button",
        //check_fn: check_consent
    };
    timeline.push(trial);
    
    /* browser check */
    
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
          
    /* collect participant data - age */
    var survey = {
      type: "survey-text",
      questions: [
        {prompt: "How old are you?", required: true, name: "Age"}
       ]
    };
    timeline.push(survey);
    
    /* collect participant data - sex */
    var sex_options = ["Male", "Female", "Intersex"];
    
    var sex = {
      type: "survey-multi-choice",
      questions: [
        {prompt:"Please identify your sex.", name: "Sex", options: sex_options, required:true}
        ]
     };
     timeline.push(sex);
     
    /* instructions pg 1  */ 
         var instructions_p1wait = {
           type: "html-keyboard-response",
           stimulus: "<p>Thank you for your participation in this experiment. " + 
           "Please read the instructions entirely before beginning.</p>",
           choices: jsPsych.NO_KEYS,
           trial_duration: 5000,
          };
      
         var instructions_p1go = {
           type:"html-keyboard-response",
           stimulus: "<p>Thank you for your participation in this experiment. " + 
           "Please read the instructions entirely before beginning.</p>"+
           "<p>Press any key to continue.</p>",
          };
          timeline.push(instructions_p1wait, instructions_p1go);
      
      /* sound check */   
          var sound_instructionswait = {
            type: "html-keyboard-response",
            stimulus: "<p>For the duration of the experiment, please use headphones or turn your speakers to a comfortable volume. " + 
            "Please use the following screen as an opportunity to check your audio settings and adjust as necessary.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
         };
         
           var sound_instructionsgo = {
            type: "html-keyboard-response",
            stimulus: "<p>For the duration of the experiment, please use headphones or turn your speakers to a comfortable volume. "+ 
            "Please use the following screen as an opportunity to check your audio settings and adjust as necessary.</p>" +
            "<p>Press any key to continue.</p>",
         };
           timeline.push(sound_instructionswait, sound_instructionsgo);
       
       var pre_if_trial = {
      type: 'video-keyboard-response',
      sources: ['resources/AuditoryBaVisualBa.mp4'],
      width: 800,
  		prompt: '<p>Press any key to repeat the video and adjust your volume as necessary. When you are ready to continue, press C.</p>'
  	}

    var loop_node = {
      timeline: [pre_if_trial],
      loop_function: function(data){
          if(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('c') == data.values()[0].key_press){
              return false;
          } else {
            return true;
          }
      }
  	};
      timeline.push(pre_if_trial, loop_node);
      
    /* instructions pg 2 
    Need to insert instruction image*/
          var instructions_p2wait = {
            type: "image-keyboard-response",
            stimulus: "resources/arm.png",
            prompt: "<p>This experiment consists of three parts, each part having multiple trials.</p>"+ 
            "<p>Throughout the entirety of the experiment, please sit at an arm's distance from your computer screen, as illustrated above. "+ 
            "Your attention should also be focused on the center of your screen.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
            };
           
           var instructions_p2go = {
            type: "image-keyboard-response",
            stimulus: "resources/arm.png",
            prompt: "<p>This experiment consists of three parts, each part having multiple trials.</p> "+ 
            "<p>Throughout the entirity of the experiment, please sit at an arm's distance from your computer screen, as illustrated above. "+ 
            "Your attention should also be focused on the center of your screen.</p>"+
            "<p> Once you have done so, press any key to continue.</p>",
            };
          timeline.push(instructions_p2wait, instructions_p2go);
      
      
     
    /* instructions pg 3 */
          var instructions_p3wait = {
            type: "html-keyboard-response",
            stimulus: "<p>During the first part of the experiment, you will be watching videos and providing responses. "+
            "These videos consist of a woman making sounds.</p>" +
            "<p>Each video will play only <strong>once</strong> per trial.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
            };
          var instructions_p3go = {
            type: "html-keyboard-response",
            stimulus:"<p>During the first part of the experiment, you will be watching videos and providing responses. "+
            "These videos consist of a woman making sounds.</p>" +
            "<p>Each video will play only <strong>once</strong> per trial.</p>"+
            "<p>Press any key to continue.</p>",
            };
        timeline.push(instructions_p3wait,instructions_p3go);
        
        
    /* instructions pg 4 */
          var instructions_p4wait = {
            type: "html-keyboard-response",
            stimulus: "<p>After watching a video, you will be asked to select a syllable that matches the sound made by the woman. "+
            "After providing a response, you will then be asked to rank how confident you are in your selection. "+
            "0 indicates <strong>not confident</strong> and 100 indicates <strong>fully confident</strong>.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
            };
          var instructions_p4go = {
            type: "html-keyboard-response",
            stimulus: "<p>After watching a video, you will be asked to select a syllable that matches the sound made by the woman. "+
            "After providing a response, you will then be asked to rank how confident you are in your selection. "+
            "0 indicates <strong>not confident</strong> and 100 indicates <strong>fully confident</strong>.</p>"+
           "<p> Press any key to continue.</p>",
            };
          timeline.push(instructions_p4wait, instructions_p4go);
      
    /* instructions pg 5 */
          var instructions_p5wait = {
            type: "html-keyboard-response",
            stimulus: "<p>During the second part of the experiment, you will be presented with a series of videos.</p> " +
            "<p>Please be sure to maintain your position and keep your eyes on the screen as videos play one after the other in a long series." +
            "This will last for 2-3 minutes total. <strong>Make sure you do not look away.</strong></p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 5000,
            };
           var instructions_p5go = {
            type: "html-keyboard-response",
            stimulus: "<p>During the second part of the experiment, you will be presented with a series of videos.</p> " +
            "<p>Please be sure to maintain your position and keep your eyes on the screen as videos play one after the other in a long series." +
            "This will last for 2-3 minutes total. <strong>Make sure you do not look away.</strong></p>"+
            "<p>Press any key to continue.</p>",
            };
          timeline.push(instructions_p5wait, instructions_p5go);
          
    /* instructions pg 6 */
          var instructions_p6wait = {
            type: "html-keyboard-response",
            stimulus: "<p>In the third and final phase of the experiment, you will once again be watching videos one at a time and providing responses. "+
            "Please select the syllable you think corresponds with the sound made by the woman in the video. "+
            "After, you will then rank your response on a scale 0 (not confident) to 100 (fully confident).</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
            };
           var instructions_p6go = {
            type: "html-keyboard-response",
            stimulus: "<p>In the third and final phase of the experiment, you will once again be watching videos one at a time and providing responses. "+
            "Please select the syllable you think corresponds with the sound made by the woman in the video. "+
            "After, you will then rank your response on a scale 0 (not confident) to 100 (fully confident).</p>"+
            "<p>Press any key to continue.</p>",
            };
          timeline.push(instructions_p6wait,instructions_p6go);
          
    /* compensation page */
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
    var practice_trial = {
		timeline: [
			{
				type: 'video-button-response',
				sources: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>'
				
			},
			{
				type: 'video-button-response',
				sources: [],
				width: 800,
				choices: jsPsych.timelineVariable('syllables'),
				data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
				prompt: '<p>Which syllable did you perceive?</p>'
				
			},
			{
				type: 'html-slider-response',
				stimulus: '<p>How confident are you in your answer?</p>',
				labels: ['0','25','50','75','100'],
				min: 0,
				max: 100,
				start: function(){
					return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
					},
				step: 1,
				prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>",
               require_movement:true
			}
		],
		timeline_variables: [
			{ video: ['resources/AuditoryBaVisualBa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) }, 
			{ video: ['resources/AuditoryBaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Da','Ga','Pa'],1) }, 
			{ video: ['resources/AuditoryBaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ka','Ga','Da'],1) },  
		],
		randomize_order: true,
    	repetitions: 0
	}
	timeline.push(practice_trial);
    
    /* prep for experiment trials */ 
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
    
    
    /*define pre-exposure */
	var pre_exposure = {
		timeline: [
			{
				type: 'video-button-response',
				sources: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>'
				
			},
			{
				type: 'video-button-response',
				sources: [],
				width: 800,
				choices: jsPsych.timelineVariable('syllables'),
				data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
				prompt: '<p>Which syllable did you perceive?</p>'
				
			},
			{
				type: 'html-slider-response',
				stimulus: '<p>How confident are you in your answer?</p>',
				labels: ['0','25','50','75','100'],
				min: 0,
				max: 100,
				start: function(){
					return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
					},
				step: 1,
				prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>",
               require_movement:true
			}
		],
		timeline_variables: [
            { video: ['resources/AuditoryBaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
	    { video: ['resources/AuditoryBaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ka','Ga','Da'],1) },
	    { video: ['resources/AuditoryMaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ta','Na','La'],1) },
            { video: ['resources/AuditoryMaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ga','Na','Ba'],1) },
            { video: ['resources/AuditoryPaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Ka','Da','Ta'],1) },
            { video: ['resources/AuditoryPaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Da','Ka','Ta'],1) },
            					
        ],
		randomize_order: true,
    	repetitions: 15
	}
	timeline.push(pre_exposure);
    
     /* prep for exposure trial */ 
         var exposure_prepwait = {
           type: "html-keyboard-response",
           stimulus: "<p>This concludes the first part of the experiment. In this next part, you will be watching a series of videos.</p>"+
           "<p>Please be sure to maintain your position and keep your eyes on the screen as videos play one after the other in a long series." +
            "This will last for 2-3 minutes total. <strong>Make sure you do not look away.</strong></p>",
           choices: jsPsych.NO_KEYS,
            trial_duration: 5000,
         };
         var exposure_prepgo = {
           type: "html-keyboard-response",
           stimulus: "<p>This concludes the first part of the experiment. In this next part, you will be watching a series of videos.</p>"+
           "<p>Please be sure to maintain your position and keep your eyes on the screen as videos play one after the other in a long series." +
            "This will last for 2-3 minutes total. <strong>Make sure you do not look away.</strong></p>"+
           "<p>Press any key to begin the second part.</p>",
         };
         timeline.push(exposure_prepwait,exposure_prepgo);
	
    /* define exposure condition CONGRUENT STIMULI*/
var exposure = {
		timeline: [
			{
				type: 'video-button-response',
				sources: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>'
				
			},
			
		],
		timeline_variables: [
			{ video: ['resources/AuditoryBaVisualBa.mp4']},
			{ video: ['resources/AuditoryMaVisualMa.mp4']},
			{ video: ['resources/AuditoryPaVisualPa.mp4']},
		],
		randomize_order: true,
    	repetitions: 15
	}
	timeline.push(exposure);
    
    /* prep for post-exposure trial */ 
         var postexposure_prepwait = {
           type: "html-keyboard-response",
           stimulus: "<p>This concludes the second part of the experiment. You will now begin the last part. " +
           "Remember, you will be watching videos of a syllable being pronounced. "+
           "You will then be selecting which response was said and ranking the confidence of your response. " +
           "0 represents <strong>not confident</strong>, while 100 represents <strong>fully confident</strong>.</p>",
           choices: jsPsych.NO_KEYS,
            trial_duration: 8000,
         };
         var postexposure_prepgo = {
           type: "html-keyboard-response",
           stimulus: "<p>This concludes the second part of the experiment. You will now begin the last part. " +
           "Remember, you will be watching videos of a syllable being pronounced. "+
           "You will then be selecting which response was said and ranking the confidence of your response. " +
           "0 represents <strong>not confident</strong>, while 100 represents <strong>fully confident</strong>.</p>"+
           "<p>Press any key to begin the third part.</p>",
         };
         timeline.push(postexposure_prepwait,postexposure_prepgo);
	    
   /* define post-exposure condition */     
var post_exposure = {
		timeline: [
			{
				type: 'video-button-response',
				sources: jsPsych.timelineVariable('video'),
				width: 800,
				choices: [],
				data: jsPsych.timelineVariable('video'), /* Store the video name */
				trial_ends_after_video: true,
				prompt: '<p></p>'
				
			},
			{
				type: 'video-button-response',
				sources: [],
				width: 800,
				choices: jsPsych.timelineVariable('syllables'),
				data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
				prompt: '<p>Which syllable did you perceive?</p>'
				
			},
			{
				type: 'html-slider-response',
				stimulus: '<p>How confident are you in your answer?</p>',
				labels: ['0','25','50','75','100'],
				min: 0,
				max: 100,
				start: function(){
					return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
					},
				step: 1,
				prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>",
               require_movement:true
			}
		],
		timeline_variables: [
            { video: ['resources/AuditoryBaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
	    { video: ['resources/AuditoryBaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ka','Ga','Da'],1) },
	    { video: ['resources/AuditoryMaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ta','Na','La'],1) },
            { video: ['resources/AuditoryMaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ma','Ga','Na','Ba'],1) },
            { video: ['resources/AuditoryPaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Ka','Da','Ta'],1) },
            { video: ['resources/AuditoryPaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Pa','Da','Ka','Ta'],1) },
            					
        ],
		randomize_order: true,
    	repetitions: 15
	}
	timeline.push(post_exposure);
    
    /* closing page */
      var endwait = {
        type: "html-keyboard-response",
        stimulus: "<p>This now concludes the experiment. <strong> Please do not close the experiment until your responses have been confirmed as recorded.</strong></p>",
        choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
        };
       var endgo = {
        type: "html-keyboard-response",
        stimulus: "<p>This now concludes the experiment. <strong> Please do not close the experiment until your responses have been confirmed as recorded.</strong> "+
       "<p> Press any key to continue.</p>",
        };
      timeline.push(endwait,endgo);
    

	/* start the experiment */
	jsPsych.init({
  		timeline: timeline,
        show_progress_bar: true,
        on_trial_finish: session.insert, 
  		on_finish: function() {
      	window.top.location.href = `https://ufl.sona-systems.com/webstudy_credit.aspx?experiment_id=142&credit_token=3741fe5ad9094ae1b8897c626c5aa9fd&survey_code=${survey_code}`	
  		}
	});
    }
}
