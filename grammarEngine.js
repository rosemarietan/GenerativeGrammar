
/*-------------------------Terminal/NonTerminal------------------------//

Terminal and NonTerminal objects are the building blocks of Rules/partial-strings
A Terminal object does not contain a rule, whereas a NonTerminal object does.

*/

//Terminal object
function Terminal(val) {
	//attributes
	this.type = "Terminal";
	this.value = val; // val should be a string (single or multiple characters)
	
	//methods
	this.isTerminal = 
		function() {
			return true;
		}
}

//Non-terminal object
function NonTerminal(val) {
	//attributes
	this.type = "NonTerminal";
	this.value = val; // val should be a string (single or multiple characters)
	
	//methods
	this.isTerminal = 
		function() {
			return false;
		}
}

/*---------------------------------Grammar---------------------------------//

A Grammar is a set of Rules.

*/

function Grammar(g) {
	//attributes
	this.type = "Grammar";
	this.grammarArray = g; //array of Rules
	
	//methods
	//adds a Rule to the current set of rules in this grammar
	this.addRule =
		function(rule) {
			this.grammarArray[this.grammarArray.length] = rule;
		}
	
	//given a string
	//returns true if there is a Rule with rule name == string value, false otherwise
	this.findStrRule = function (str) {
		for(var i = 0; i<this.grammarArray.length; i++) {
			//document.write(this.grammarArray[i].name + " " + str);
			if(this.grammarArray[i].name == str) {
				return this.grammarArray[i];
			}
		}
			return false;
	}
	
	//given a Terminal/NonTerminal object
	//returns true if there is a Rule with rule name == object value, false otherwise
	this.findRule =
		function (object) {
			var ruleNameToFind = object.value;
			var found = false;
			for(var i = 0; i<this.grammarArray.length; i++) {
				if(this.grammarArray[i].name == ruleNameToFind) {
					found = this.grammarArray[i];
				}
			}
			return found;
		}
}

/*---------------------------------Rule---------------------------------//

A Rule has a LHS and RHS
We call the LHS its name
RHS can take mulitple variations, each variation is made up of Terminal and/or NonTerminal objects

*/

function Rule(name, a) {
	//attributes
	this.type = "Rule";
	this.name = name; //LHS
	this.ruleArray = a; // RHS: an array of arrays, each smaller array is 1 variation of the Rule
	
	//methods
	this.addVariation = function(r) {
		this.ruleArray.push(r);
	}
	
	//for random tree walking. Right now, the way this function works causes a bias to shorter strings.
	this.selectVariation = function() {
		var upperLimit = this.ruleArray.length;
		return (Math.floor(Math.random()*upperLimit));
	}
}

/*---------------------------------Language/Node---------------------------------//

A Language produces a set of strings based on a certain Grammar.
In order to generate all possible strings, we create a tree of Nodes.
Each Node stores a partial or final string, formed by the expansion of Rules.
To traverse the tree, we use the BFS method.

*/

//Language
function Language(grammar, startRule) {
	//attributes
	this.type = "Language";
	this.grammar = grammar;
	this.startNode = new Node([new NonTerminal(startRule.name)], null, grammar);
	this.queue = new Array();
	this.queue.push(this.startNode);
	
	//methods
	this.generateRandomString =
		function() {
			var infiniteGrammarLimit = 1000; //to prevent infinite rule looping without output
			var infiniteGrammarCounter = 0; //to prevent infinite rule looping without output
			var done = false;
			var toExpand = this.startNode;
			
			while(!done) {
				if(toExpand.isTerminal()) {
					done = true;
					return toExpand.valueToString();
				} else {
					for(var i=0; i<toExpand.value.length; i++) {
						var objectToCheck = toExpand.value[i];
						if(!objectToCheck.isTerminal()) { //if this object is not terminal
						var r = this.grammar.findRule(objectToCheck);
							if(r != false) { //precaution
								var selectedRuleVariant = r.selectVariation(); //an integer
								var v = new Array();
								v = v.concat(toExpand.value.slice(0,i));
								v = v.concat(r.ruleArray[selectedRuleVariant]);
								v = v.concat(toExpand.value.slice(i+1));
								infiniteGrammarCounter++;
								if(infiniteGrammarCounter > infiniteGrammarLimit) {
									done = true;
									alert("Please check that your grammar has terminal output strings.");
								} else {
									toExpand = (new Node(v,toExpand,this.grammar));
								}
							}
						}
					}
				}
			}
		}
	
	//for BFS traversal of tree, checks if all possible strings have been exhausted
	this.hasNext =
		function() {
			if(this.queue.length == 0) {
				return false;
			} else {
				return true;
			}
		}
	
	//for BFS traversal of tree, generates next string if there are more strings
	this.next =
		function() {
			if(!this.hasNext()) {
				alert("ERROR: Sentences exhausted");
			} else {
				var infiniteGrammarLimit = 1000; //to prevent infinite rule looping without output
				var infiniteGrammarCounter = 0; //to prevent infinite rule looping without output
				var done = false;
				while(!done) {
					var n = this.queue.shift();
					if(n.isTerminal()) {
						infiniteGrammarCounter = 0;
						done = true;
						return n.valueToString();
					} else {
						infiniteGrammarCounter ++;
						if(infiniteGrammarCounter > infiniteGrammarLimit) {
							done = true;
							alert("Please check that your grammar has terminal output strings.");
						} else {
							n.tryGenerateAndSetChildren();
							for(var i=0; i<n.children.length; i++) {
								this.queue.push(n.children[i]);
							}
						}
					}
				}
			}
		}
}

//Node
function Node(value, parent, grammar) {
	//attributes
	this.type = "Node";
	this.value = value; //is an array of Terminal/NonTerminal objects
	this.parent = parent; //should be a node object as well
	this.children = new Array(); //array of nodes
	this.grammar = grammar;
	
	//methods
	//for final output of string 
	this.valueToString =
		function() {
			var toReturn = '';
			for(var i=0; i<this.value.length; i++) {
				toReturn += this.value[i].value + ' ';
			}
			return toReturn;
		}
		
	//generates child Nodes if this Node is non-terminal
	this.tryGenerateAndSetChildren =
		function() {
			//check for Rules in this value (is this node terminal or not)
			for(var i=0; i<this.value.length; i++) {
				var objectToCheck = this.value[i];
				if(!objectToCheck.isTerminal()) { //if this object is not terminal
					//generate children based on this rule
					var r = this.grammar.findRule(objectToCheck);
					if(r != false) {
						for(var j=0; j<r.ruleArray.length; j++) { //for each variant of this rule
							var v = new Array();
							v = v.concat(this.value.slice(0,i));
							//find its new value
							v = v.concat(r.ruleArray[j]);
							v = v.concat(this.value.slice(i+1));
							//create a child node
							this.children.push(new Node(v,this,this.grammar));
						}
					}
					break;
				}
			}
		}
	
	
	
	//boolean check if this node is terminal (a leaf) or not
	this.isTerminal =
		function() {
			var result = true;
			for(var i=0; i<this.value.length; i++) {
				if(!this.value[i].isTerminal()) {
					result = false;
				}
			}
			return result;
		}
}