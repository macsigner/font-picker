(function () {
	'use strict';
	
	jQuery(function($){
	
		$(document).ready(function(){
			var strHtmlTags = "h1,h2,h3,h4,h5,h6,p,pre";
			
			var lorem;
			lorem = JSON.parse( localStorage.getItem("lorem") );
			
			setTimeout(function(){
				if( lorem !== null ) {
					for(var tag in objTags){
						var currentTag = objTags[tag];
						
						currentTag.content.fillContent(lorem);
					}
				} else {
					$.post("http://api.chrisvalleskey.com/fillerama/get.php?count=10&format=json&show=starwars",
						{ "post_parameter" : "post_value" },
						function(data){							
							lorem = JSON.parse( data );
							
							localStorage.setItem("lorem", JSON.stringify( lorem ) );
							
							for(var tag in objTags){
								var currentTag = objTags[tag];
								
								currentTag.content.fillContent(lorem);
							}
						}
					);
				}
			},200);
		
/*
			setTimeout(function(){
				for(var tag in objTags){
					var currentTag = objTags[tag];
					
					currentTag.content.fillContent(lorem);
				}

			}, 2000)
*/
			var Content = function() {
				this.type = "text";
				this.sentenceLength = 3;
				this.source = false;
				this.text;
				
				this.fillContent = function(lorem) {
					var textArray = new Array;
					var text = "not loaded";
					
					if( lorem ) {
						if ( this.type == "text" ) {
							lorem["db"].forEach(function(current){
								textArray.push( current["quote"] );
							});
						} else if ( this.type == "title") {
							textArray = lorem["headers"];
						}
						
						text = this.getRandomText(textArray);
					}
					
					this.text = text;
					return text;
				}
				
				this.getRandomText = function(textArray) {
					var randomText = "";
					
					for (var i = 1; i <= this.sentenceLength; i++) {
						randomText += textArray[Math.floor(Math.random()*textArray.length)] + " ";
					}
					
					return randomText;
				}
				
				this.fillContent();
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
			
			var DefaultProperties = function(){
					this["font-family"] = new Property;
					
					this["font-size"] = new Property;
					this["font-size"].value = 16;
					
					this["line-height"] = new Property;
					this["line-height"].value = 1.4;
					this["line-height"].unit = "";
			
					this["letter-spacing"] = new Property;
			};
			
			var Tag = function(){
				this.properties = new DefaultProperties;
				
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
				
				this.getMarkup = function(){
					var inlineStyle = this.getInlineStyle();
					
					console.log(this);
					
					var markup = "";
					
					markup = "<" + this.name + " " + inlineStyle + " >" + this.content.text + "</" + this.name + ">";
					
					return markup;
					
		/*
					for (var prop in this.properties) {
						var curProp = this.properties[prop];
						
						if( curProp instanceof Property ) {
							var cssValue = curProp.getCssValue();
							
							if(cssValue) {
								
							}
							curProp.getCssValue();
						}
					}
					return "getMarkup function";
		*/
				}
			}
			
			var MarkupCollection = function(){
				var tags = 'h1,p,p,p,h2,p,ul,';
/*
				this.tags = {
					'h1'
					'p'
					'p'
				};
*/
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
						"font-size": 30,
						"line-height": 1.1,
					}
				},
				"h2": {
					properties: {
						"font-size": 20,
						"text-transform": "uppercase",
					}
				}
			};
			
			for(var item in objCustomDefaults){
				for(var property in objCustomDefaults[item].properties) {
					if ( objTags[item].properties[property] ) {
						objTags[item].properties[property].value = objCustomDefaults[item].properties[property];
					} else {
						var currentProperty = objTags[item].properties[property] = new Property;
						currentProperty.value = objCustomDefaults[item].properties[property];
						currentProperty.unit = "";
					}
				}
			}
			
			setTimeout(function(){
				for(var tag in objTags){
					var currentTag = objTags[tag];
					
					var markup = currentTag.getMarkup();
					
// 					console.log(currentTag.getMarkup());
					
					$("#html").append(markup);
				}
			}, 2000);
		});
	
	});
}());

