// JavaScript Document
/*
METHODS
generateResultsAndLink(str, isSingleInstance, idOfResultPlace, idOfMsgPlace): Generates results, creates links to the PE project, puts results in designated areas
parsefromForm(formId, numberOfResId): Parses input from GUI 
*/
	var facade = new playerFacade();
	facade.loadSamples('https://github.com/fightangel/PolymetricExpression/tree/master/acoustic-kit', false);

		  function generateResultsAndLink(str, isSingleInstance, idOfResultPlace, idOfMsgPlace) {
				var allResults = generateLanguage(str, isSingleInstance);
				if (allResults) {
					allResults = allResults.split('\n');
				}
				else {
					return;
				}
				$(idOfMsgPlace).html('');
				$(idOfResultPlace).html('');
				allResults.forEach(function(line) {
					var $link = $('<a href="#" class="test-link"></a>');
					$link.html(line);
					$link.click(function() {
						facade.play();
						//player.play(line, controlParams, 1, stopCallback);
					});
					$(idOfResultPlace).append($link);
					$(idOfResultPlace).append("<br />");
				});
			}
			
			function parseFromForm(formId, numberOfResId) {
				var strInput = '';
				var numberPattern = /^\d+$/g;
				var inputForNumber = $(numberOfResId).val().trim().match(numberPattern);
				if (inputForNumber) {
					strInput = strInput.concat(inputForNumber + "\n");
					//alert (strInput);
				}		
				
					for (var i = 1; i<=$(formId).length; i++){
						var LHS = $('#LHS'+i).val();
						var RHS = $('#RHS'+i).val();
						if (LHS.trim() !== '' && RHS.trim() !== ''){
							strInput = strInput.concat(LHS + "-->" + RHS + "\n");
						}					
					}
					
					return strInput;
			}
			/*
			$(function() {
				SampleManager.init(16, {
					didInitialize: loadSamples
				}, {
					audioContext: audioContext
				});
			});
			
			function loadSamples(sampleManager) {
				sampleManager.loadSampleSet("acoustic-kit", "acoustic-kit", {
				   didFinishLoadingSampleSet: function(name, result) {
					   var samples = result;
					   for (name in samples) {
						   player.addAudioPrototype(name, samples[name], name == "sine");
					   }
				   }
				});
			}
			
			var controlParams = {gain: 0.25, ADSRParams: {a: 0.1, d: 0.1, r: 0.2, maxAmp: 1.5, sustainAmp: 1}};
			//player.play(exp, controlParams, 1);*/