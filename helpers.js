Handlebars.registerHelper("debug", function(optionalValue) {
	console.log(this);
});



function SexyApp() {
	this.templates = {}

	this.registerTemplate = function(id){
		this.templates[id] = Handlebars.compile(document.getElementById(id).innerHTML);
		return this.templates[id];
	}

	this.render = function(templateId, content){
		var template = this.templates[templateId];
		if (template === undefined) {
    	template = this.registerTemplate(templateId)
    }
		return this.templates[templateId](content);
	}
}
