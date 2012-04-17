// JavaScript Document
/*
METHODS
generateResultsAndLink(str, isSingleInstance, idOfResultPlace, idOfMsgPlace): Generates results, creates links to the PE project, puts results in designated areas
parsefromForm(formId, numberOfResId): Parses input from GUI 
*/
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
						playExp(line);
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