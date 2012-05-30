/**
 * EEJS
 * 
 * A Javascript Library for retrieving ExpressionEngine settings and resources
 * 
 */
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
     * @param  {string} className       The name of the class that has registered an action
     * @param  {string} methodName      The method name
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


    /**
     * Control Panel URL
     * 
     * @param  {object|string} value    An object to convert to a query string or a string 
     *                                  to append to the control panel base URL
     * @return {string}
     */
    Eejs.fn.cpUrl = function(value) {
        var base = this.url(this.constant('SYSDIR') + "/" + this.constant('BASE'), false);

        if(!value){
            value = "";
        }
        if(typeof value === 'object'){
            return base + queryString(value, false);
        }
        console.log(arguments)
        return base + value;
    }



    Eejs.fn.channels = function (/* channelArg, callbackArg, errbackArg */) {
        var def = new $.Deferred(),
            config = {},
            channel_identifier = "",
            channel,
            callback,
            errback,
            args = parseArguments(arguments);

        //Register callbacks
        if(args.callback){
            def.done(args.callback);
        }
        if(args.errback){
            def.fail(args.errback);
        }


        //String
        if(typeof args.channel === 'string'){
            channel_identifier = "channel_name";
        }

        //Number
        else if(Number(args.channel) !== NaN){
            channel_identifier = "channel_id";
        }

        if(args.channel !== null){
            config[channel_identifier] = args.channel;
        }

        fetch("channels", config).then(function(data) {
            def.resolve(data)
        })
        


        return def;
    }
    Eejs.fn.channel = Eejs.fn.channels;


    Eejs.fn.entries = function (/* channelArg, callbackArg, errbackArg */) {
        var def = new $.Deferred(),
            config = {},
            channel_identifier = "",
            channel,
            callback,
            errback,
            args = parseArguments(arguments);

        //Register callbacks
        if(args.callback){
            def.done(args.callback);
        }
        if(args.errback){
            def.fail(args.errback);
        }


        //String
        if(typeof args.channel === 'string'){
            channel_identifier = "channel_name";
        }

        //Number
        else if(Number(args.channel) !== NaN){
            channel_identifier = "channel_id";
        }

        if(args.channel !== null){
            config[channel_identifier] = args.channel;
        }

        fetch("entries", config).then(function(data) {
            def.resolve(data)
        })
        


        return def;
    }



    Eejs.fn.entry = function (/* entryId, callbackArg, errbackArg */) {
        var def = new $.Deferred(),
            config = {},
            channel_identifier = "",
            channel,
            callback,
            errback,
            args = parseArguments(arguments);

        //Register callbacks
        if(args.callback){
            def.done(args.callback);
        }
        if(args.errback){
            def.fail(args.errback);
        }


        //String
        if(typeof args.channel === 'string'){
            channel_identifier = "channel_name";
        }

        //Number
        else if(Number(args.channel) !== NaN){
            channel_identifier = "entry_id";
        }

        if(args.channel !== null){
            config[channel_identifier] = args.channel;
        }

        fetch("entry", config).then(function(data) {
            def.resolve(data)
        })
        


        return def;
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



    function parseArguments (args) {
        var o = {
            channel : null,
            callback: null,
            errback: null
        };

        if(args.length === 0){
            
            return o;

        } else if ( args.length === 1){
            if(typeof args[0] === "string" || typeof Number(args[0]) === "number"){
                o.channel = args[0];
            }
            else if (typeof args[0] === "function"){
                o.callback = args[0];
            }
            else {
                console.error("Invalid argument. Must be a string, number or callback function");
            }
        }

        if(args.length === 2){
            if((typeof args[0] === "string" || typeof Number(args[0]) === "number") && typeof args[1] === "function"){
                o.channel = args[0];
                o.callback = args[1];
            }
            else if ( typeof arguments[0] === "function" && typeof args[1] === "function"){
                o.callback = args[0]
                o.errback = args[0]
            } else {
                console.error("Invalid arguments. Must be a string or number followed by a callback function."
                + " Alternatively you can supply two functions as arguments for callback and errback");   
            }
        }

        if(args.length >= 3){
            if((typeof args[0] === "string" || typeof Number(args[0]) === "number") || typeof args[1] === "function" ||  typeof args[2] === "function"){
                o.channel = args[0];
                o.callback = args[1];
                o.errback = args[1];
            } else {
                console.error("Invalid arguments. Must be a string or number followed by a callback function and an errback function.");   
            }
        }

        return o;
    }


    function fetch (resourceName, data) {
        var dfd = new $.Deferred(),
            url = eejs.cpUrl({
                C:"addons_extensions", 
                M: "extension_settings", 
                file: "eejs",
                method: "api", 
                resource: resourceName
            });
            
           // http://ee240/system/index.php?S=0caa14e3b5a17a25c3b911ac23a1a91ce2e8e1e3&D=cp&C=addons_extensions&M=extension_settings&file=safecracker

        url += queryString(data, false);

        $.get(url, function(data, status, jQDeferred) {          
            if(typeof data === "object" && status == "success"){
                dfd.resolve(data);
            }else{
                dfd.reject(data);
            }
        })

        //TODO
        //Fetch data via AJAX

        return dfd;
    }


	window.eejs = new Eejs();
})(jQuery, EE, eejsConfig);