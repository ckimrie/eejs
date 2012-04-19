(function($, EE, eejsConfig) {

	var Eejs = function(a, b) {
		return Eejs.fn.init(a, b)
	};


	Eejs.fn = Eejs.prototype = {

		/**
		 * Initialise the module
		 */
		init: function(a, b) {
            //delete window.eejsConfig;
			return this;
		}
    };


	/**
	 * Retrieve EE Configuration Variable
	 * 
	 * If a key is supplied it retrieves that item, if not supplied, an object of all 
	 * config items is returned
	 * 
	 * @param  {string} key The EE configuration variable [optional]
	 * @return {mixed}     Returns an object, the item requested or false on failure
	 */
	Eejs.fn.config = function(key) {

		if(typeof key === "undefined"){
			return eejsConfig.config;
		}

		if(eejsConfig.config.hasOwnProperty(key)){
			return eejsConfig.config[key];
		}

		return false;
	};


    /**
     * Retrieve EE Constants
     * 
     * @param  {string} key The name of the EE constant
     * @return {mixed}     Returns an object, the item specified or false on failure
     */
	Eejs.fn.constant = function(key) {

		if(typeof key === "undefined"){
			return eejsConfig.constants;
		}

		if(eejsConfig.constants.hasOwnProperty(key)){
			return eejsConfig.constants[key];
		}

		return false;
	};


    /**
     * Build URL
     * @param  {string|array|object}    value   A string, object or array to append to the url
     * @param  {string}                 base    The base URL to use
     * @return {string}                         The completed URL
     */
    Eejs.fn.url = function(value, base, trailingSlash) {

        var segments = "";

        //No base URL specified? Use the site url as default
        if(typeof base !== "string"){
            base = this.config("site_url");
        }

        //Add trailing slash if necessary
        if(base.substr(-1) !== "/"){
            base += "/";
        }



        if(typeof value === "string"){
            segments = value;
        }
        if(typeof value === "object"){
            
            if(value.hasOwnProperty("length") && value.length > 0){
                //Array 
                segments = value.join("/");
            }else{
                //Object - query string
                segments = queryString(value)
            }   
            
        }


        //Add/remove trailing slash as necessary
        if(trailingSlash === true && segments.substr(-1) !== "/"){
            segments += "/";
        }

        if(trailingSlash === false && segments.substr(-1) === "/"){
            segments = segments.substr(0, segments.length-1);
        }

        return base + segments;
    }



    /**
     * Action IDs
     * 
     * Returns the action id for specified class & methods
     * 
     * @param  {className} className    The name of the class that has registered an action
     * @param  {methodName} methodName  The method name
     * @return {mixed}                  Returns integer or an object if the method is not specified
     */
    Eejs.fn.action = function(className, methodName) {
        
        //Must have at least a className string or it must exist in our config object
        if(!className || className.length === 0 || typeof className !== "string" 
            || typeof eejsConfig.actions[className] !== 'object'){
            
            return false;
        }

        

        //Return the class object if that is all that was provided
        if(typeof className === 'string' && !methodName &&  typeof eejsConfig.actions[className] === 'object'){
            return eejsConfig.actions[className];
        }

        if(typeof eejsConfig.actions[className][methodName] === 'number'){
            return eejsConfig.actions[className][methodName];
        }

        return false;
    }




	/**
	 * URL Convenience Methods
	 */
    

    /**
     * Theme URL
     * 
     * @param  {string} uri   The URI to be appended to the theme folder URL
     * @return {mixed} 
     */
	Eejs.fn.themeUrl = function(uri) {
		
		return this.url(uri, this.config("theme_folder_url"));
		
	};


    /**
     * Site URL
     * 
     * @param  {string} uri The URI to be appended to the theme folder URL
     * @return {mixed}
     */
	 Eejs.fn.siteUrl = function(uri) {

        return this.url(uri);
	 	
	 };


     /**
      * Action URL
      * 
      * @param  {string} className  The class name of the action
      * @param  {string} methodName The method name of the action
      * @return {mixed}            
      */
     Eejs.fn.actionUrl = function(className, methodName) {
        var id ;

        id = this.action(className, methodName);

        if(id !== false){
            return this.url({ ACT: id });
        }

        return false;
     }


     /**
      * Masked URL
      * 
      * @param  {string} url The destination URL
      * @return {mixed}     
      */
     Eejs.fn.maskedUrl = function(url) {

        if(typeof url !== 'string'){
            return false;
        }

        return this.url({ URL: url});
     }


     Eejs.fn.cpUrl = function(value) {
        var base = this.url(this.constant('SYSDIR') + "/" + this.constant('BASE'), false);
        
        if(!value){
            value = "";
        }
        if(typeof value === 'object'){
            return base + queryString(value, false);
        }
        return base + value;
     }





    /**
    * Private Methods
    */



    /**
     * Query String Converter
     * 
     * Takes an object and converts it into a query string
     * 
     * @param  {object} obj             The Object to convert
     * @param  {boolean} questionMark   Whether to prepend a question mark (default: TRUE)
     * @return {string}              
     */
    function queryString(obj, questionMark) {
        var queryString = "";

        if(questionMark !== false){
            queryString = "?";
        }else{
            queryString = "&";
        }

        for(key in obj){
            queryString += key + "=" + obj[key] + "&"
        }
        queryString = queryString.substr(0, queryString.length-1);

        return queryString;
    }

	window.eejs = new Eejs();
})(jQuery, EE, eejsConfig);