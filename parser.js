// JavaScript Document

/*
METHODS:

FIRST LEVEL
generateLanguage(grammarString, isSingleInstance): Generates either the whole language or one instance of the language given raw string input

SECOND LEVEL
makeLanguage(number, str): Sets new terminal and non-terminal symbols. The number parameter is required to check what not to parse.
checkIfTerminal(str): checks if a symbol keyed in is a terminal by a negative match to the non-terminal pattern


*/

/*===========STATIC VARIABLES==========*/
var NUMBER_PATTERN = /^\s*(\d+)\s*\n+/;
var RULE_PATTERN = /^([A-Z]+\S*\s*)\-\-\>((\s*\S+)*)$/;
var ARROW_PATTERN = /\-\-\>/g;
var PUNCTUATION_PATTERN = /\x20*([{},\\.])\x20*/g;
var EMPTY_STRING_PATTERN = /\~\x20*/g;
var NON_TERMINAL_PATTERN = /^[A-Z]/;
var UPPER_LIMIT = 100;


/*===========FIRST LEVEL==========*/
function generateLanguage(str, isSingleInstance) {
	str.match(NUMBER_PATTERN);
	var number = RegExp.$1 || false;
	var language = makeLanguage(number, str);
	return (generateResults(number, language, isSingleInstance));
}

/*===========SECOND LEVEL==========*/
function makeLanguage(number, str) {
	var lines = str.trim().split("\n");
	var grammar = new Grammar([]);
	var language;
	var start = 0;
	if (number) {
		start = 1;
	}
	
	for (var i = start; i<lines.length; i++) {
		//Error checks
		if (!lines[i] || lines[i]==="") {
			continue;
		}
		if(!checkIfValid(lines[i])) {
			var lineNumber = i+1;		
			alert("Invalid rule on line " + lineNumber + ", please correct.");
			return false;
		}
		
		//Variables
		var LHS = RegExp.$1.trim();
		var RHS = format(RegExp.$2.trim());		
		var existingRule = grammar.findStrRule(LHS);
		var ruleVariation = setRuleVariations(RHS);	
		
		//Making rules		
		if (existingRule){				
			existingRule.addVariation(ruleVariation);
		}
		else {
			var newRule = new Rule(LHS, new Array(ruleVariation));
			grammar.addRule(newRule);
		}
	}
	
	//Error check
	if (grammar.grammarArray.length === 0) {
		alert ("Please input rules!");
		return false;
	}
	
	//Making language
	language = new Language(grammar, grammar.grammarArray[0]);
	return language;			
}



function generateResults(number, language, isSingleInstance) {
	var results = "";
	if (!language) {
		return false;
	}
	
	if (isSingleInstance) {
		var counter = 0; 
		if (!number){
			number = UPPER_LIMIT; 
			}	
		while (results === "" && counter < number) {
			results = unformat(language.generateRandomString());
			counter++;
		}
		if (counter===number) {
			results = false;
			alert("Your rules didn't produce any results :(");
		}
	}
	else {
		var counter = 0; 
		if (!number){
			number = UPPER_LIMIT; 
			}	
		while(language.hasNext() && counter < number) {
			var next = unformat(language.next());
			if (next!== "") {
				results = results.concat(next, '\n');
				counter++;
			}
		}
	}
	return results;
}
	

/*===========THIRD LEVEL==========*/
function setRuleVariations(str) {
	
	var RHS = str.split(" ");
	var ruleVariation = new Array();
	
	
	for (var k = 0; k<RHS.length; k++){
		if (RHS[k]==="" || RHS[k]===null) {
			continue;
		}
		if (checkIfTerminal(RHS[k])){
		  var ruleVariationPart = new Terminal(RHS[k]);
		}
		else {
		  var ruleVariationPart = new NonTerminal(RHS[k]);
		}
		ruleVariation.push(ruleVariationPart);  
	}
	return ruleVariation;
}

function checkIfValid(str) {
	if (str.match(ARROW_PATTERN).length>1) {
		return false;
	}	
	return str.trim().match(RULE_PATTERN);
}

function format(str) {
	return str.replace(PUNCTUATION_PATTERN, " $1 ");
}
	
function unformat(str) {
	return str.replace(EMPTY_STRING_PATTERN, "").replace(PUNCTUATION_PATTERN, "$1");
	
}
	
function checkIfTerminal(str){ 
	if (str.match(NON_TERMINAL_PATTERN)) {
		return false;
	}
	else return true;
}

