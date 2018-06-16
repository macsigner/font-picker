(function () {
	'use strict';
	
	jQuery(function($){
	
		$(document).ready(function(){
			var strHtmlTags = "h1,h2,h3,h4,h5,h6,p,pre";
			
			var lorem;
			var defaultTexts;
			var localTexts = JSON.parse( localStorage.getItem("defaultTexts") );
			
			if( localTexts !== null ) {
				defaultTexts = localTexts;
			} else {
				defaultTexts = {
					"text": [],
					"title": [],
				}
			}
			
			setTimeout(function(){
				if( localTexts !== null ) {
					for(var tag in objTags){
						var currentTag = objTags[tag];
						
						currentTag.content.generateContent(defaultTexts);
					}
					
// 					$("#html").append( colMarkup.getMarkup() );
				} else {
					loadContent();
				}
			},1000);
			
			function loadContent( content ) {
				$.post("http://api.chrisvalleskey.com/fillerama/get.php?count=10&format=json&show=starwars",
					{ "post_parameter" : "post_value" },
					function(data){							
						lorem = JSON.parse( data );
						
						for (var key in defaultTexts){
							defaultTexts[key] = [];
						}
						
						lorem["db"].forEach(function(current){
							defaultTexts["text"].push( current.quote );
						});
						
						lorem["headers"].forEach(function(current){
							defaultTexts["title"].push( current["header"] );
						});
						
						for(var tag in objTags){
							var currentTag = objTags[tag];
							
							currentTag.content.generateContent(defaultTexts);
						}
						
						localStorage.setItem("defaultTexts", JSON.stringify( defaultTexts ) );
						
						$("#html").html( content.getMarkup() );
					}
				);
			}
			
			
			var Content = function() {
				this.type = "text";
				this.sentenceLength = 5;
				this.source = false;
				this.text;
				
				this.generateContent = function(lorem) {
					this.text = '';
					var textArray = new Array;
					var text = "not loaded";
					
					if( defaultTexts ) {
						if ( this.type == "text" ) {
							textArray = defaultTexts["text"];
						} else if ( this.type == "title") {
							textArray = defaultTexts["title"];
						}
						
						text = this.generateRandomContent(this, textArray);
					}
					
					this.text = text;
				}
				
				this.generateRandomContent = function(current = this, texts = defaultTexts[this.type]) {
					var randomText = "";
					var sentenceLength = this.sentenceLength;
					
					for (var i = 0; i < sentenceLength; i++) {
						randomText += texts[Math.floor(Math.random()*texts.length)] + " ";
					}
					
					this.text = randomText;
					
					return randomText;
				}
				
				this.getText = function() {
					this.text = this.generateRandomContent(this, defaultTexts[this.type]);
					
					return this.text;
				}

				this.generateRandomContent();
			}
		
			
			var Property = function(){
				this.name,
				this.value = false,
				this.minValue = false,
				this.maxValue = false,
				this.unit = "px";
				
				this.getCssValue = function(){
					var cssVal = "";
					
					if( this.value ) {
						cssVal = this.value + this.unit;
					} else {
						cssVal = false;
					}
					
					return cssVal;
				}
			};
			
			
			var PropertyCollection = function(){
				var defaultProperties = {
					"font-family": {},
					"font-size": {
						value: 16,
					},
					"line-height": {
						value: 1.4,
						unit: "",
					},
					"letter-spacing": {},
					"border-width": {
						value: false,
					},
					"border-style": {
						value: false,
						unit: "",
					},
					"border-color": {
						value: false,
						unit: "",
					},
					"text-transform": {
						value: false,
						unit: "",
					},
				}
				
				for (var propertyKey in defaultProperties) {
					this[propertyKey] = new Property;
					
					for (var valKey in defaultProperties[propertyKey] ){
						this[propertyKey][valKey] = defaultProperties[propertyKey][valKey];
					}
				}
			};
			
			
			var Tag = function(){
				this.properties = new PropertyCollection;
				
				this.name;
				
				this.content = new Content;
				
				this.getInlineStyle = function() {
					var inlineStyle = "style='";
					for (var prop in this.properties) {
						var curProp = this.properties[prop];
						
						if( curProp instanceof Property ) {
							var cssValue = curProp.getCssValue();
							
							if(cssValue) {
								inlineStyle += prop + ":" + cssValue + ";"
							}
						}
					}
					
					inlineStyle += "'";
					
					return inlineStyle;
				}
				
				this.getStylesSheet = function() {
					var styleSheet = this.name + "{";
					for (var prop in this.properties) {
						var curProp = this.properties[prop];
						
						if( curProp instanceof Property ) {
							var cssValue = curProp.getCssValue();
							
							if(cssValue) {
								inlineStyle += prop + ":" + cssValue + ";"
							}
						}
					}
					
					styleSheet += "}";
					
					return styleSheet;
				}
				
				this.getMarkup = function(){
					var inlineStyle = this.getInlineStyle();
					
					var markup = "";
					
					markup = "<" + this.name + " " + inlineStyle + " >" + this.content.getText() + "</" + this.name + ">";
					
					return markup;
				}
				
				this.setPropertySettings = function(newProperties) {
					console.log("setPropertySettings");
					console.log(newProperties);
				}

				this.overwriteDefaults = function(objCustom, objDefault = this){
					if( objCustom instanceof Object ) {
						// is object
						
						for(var key in objCustom){
							if ( key in objDefault && objCustom[key] instanceof Object ) {
								if ( objCustom[key] instanceof Function ) {
									objDefault[key] = objCustom[key];
								} else {
									this.overwriteDefaults(objCustom[key], objDefault[key]);
								}
							} else if ( key in objDefault ) {
								objDefault[key] = objCustom[key];
								// instance_of
// 								console.log(objDefault[key]);
// 								console.log(objCustom[key]);
							} else {
								console.log(objDefault);
								console.log(objCustom);
								objDefault[key] = objCustom[key];
							}
						}
					} else {
						// not an object
// 						objDefault.value = objCustom;
					}
				}
				
			}
			
			var MarkupCollection = function( availableTags ){
				this.availableTags = availableTags;
				
				var availableTags = this.availableTags;
				
				this.strTags = 'h1,p,pre,p,p,h2,p,ul,h3,p,p,h4,p,p,p,p';
				
				var arrTags = this.strTags.split(',');
				
				var markup = '';
				
				this.getMarkup = function(){
					markup = '';
					
					for (var key in arrTags){
						if ( arrTags[key] in this.availableTags ) {
							markup += this.availableTags[arrTags[key]].getMarkup();
						}
					}
					
					return markup;
				}
			}
			
			
			var arrHtmlTags = strHtmlTags.split(',');
			
			var objTags = new Object;
			
			
			arrHtmlTags.forEach(function(item, index){
				objTags[item] = new Tag;
				objTags[item].name = item;
			});
			
			var objCustomDefaults = {
				"h1": {
					properties: {
						"font-size": {
							value: 30,
						},
						"line-height": {
							value: 1.1,
						},
					},
					content: {
						type: "title",
						sentenceLength: 1,
					}
				},
				"h2": {
					properties: {
						"font-size": {
							value: 20,
						},
						"text-transform": {
							value: "uppercase",
						},
					},
					content: {
						type: "title",
						sentenceLength: 1,
					}
				},
				"pre": {
					content: {
						generateRandomContent: function() {
							var element = document.querySelector("head");
							
							var encodedStr = element.innerHTML.replace(/[\u00A0-\u9999<>\&]/gim, function(i) {
								return '&#' + i.charCodeAt(0) + ';';
							});
							
							return encodedStr;
						}
					}
				}
			};

			for(var key in objCustomDefaults){
				if ( key in objTags ) {
					objTags[key].overwriteDefaults(objCustomDefaults[key]);
				} else {
					objTags[key] = new Tag;
					objTags[key].overwriteDefaults(objCustomDefaults[key]);
				}
			}
			
			var colMarkup = new MarkupCollection( objTags );
			
			setTimeout(function(){
				$("#html").append( colMarkup.getMarkup() );
			}, 1000);

			$("button").on("click", function(e){
				loadContent( colMarkup );
				
				console.log(colMarkup);
			});
			
			function arrayFindByValue(arr,val) {
				var index = false;
				
				for (var i=0; i<arr.length; i++) {
					if (arr[i] === val) {
						index = i;
						break;
					}
				}
				
				return index;
			}

		});
	
	});
}());

