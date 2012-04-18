describe("EEJS", function() {

    it("should be accessible globally as eejs", function() {
        expect(eejs).toBeDefined()
    });

    it("should be an object", function() {
        expect(typeof eejs === "object").toBeTruthy();
    })



    describe("Config method", function() {

        it("method exists", function() {
            expect(eejs.config).toBeDefined()
            expect(typeof eejs.config === "function").toBeTruthy()
        });

        it("returns an object when no argument is supplied", function() {
        expect(typeof eejs.config() == "object").toBe(true);
            expect(eejs.config().site_url).toBeDefined();
        })
        it("returns a variable when a valid key is supplied", function() {
            expect(eejs.config("site_index")).toBe("index.php");
        })
        it("returns false for invalid keys", function() {
            expect(eejs.config("ji&6gs")).toBe(false);
        })

    });

    describe("Constants method", function() {

        it("exists", function() {
            expect(eejs.constant).toBeDefined()
            expect(typeof eejs.constant === "function").toBeTruthy()
        });

        it("returns an object when no argument is supplied", function() {
            expect(typeof eejs.constant() == "object").toBe(true);
            expect(eejs.constant().SYSDIR).toBeDefined();
        })
        it("returns a config variable when a valid config key is supplied", function() {
            expect(eejs.constant("SYSDIR")).toBe("system");
        })
        it("returns false for invalid config keys", function() {
            expect(eejs.constant("ji&6gs")).toBe(false);
        })

    });




    /**
     * URL Methods
     */

    describe("URL Method", function() {

        it("exists", function() {
            expect(eejs.url).toBeDefined()
            expect(typeof eejs.url === "function").toBe(true);
        })

        it("returns the site url when no arguments are supplied", function() {
            expect(eejs.url()).toBe("http://localhost/");
        })
        it("appends a string argument", function() {
            expect(eejs.url("")).toBe("http://localhost/");
            expect(eejs.url("abc")).toBe("http://localhost/abc");
        })
        it("converts an array argument to url segments", function() {
            expect(eejs.url(["abc", "def"])).toBe("http://localhost/abc/def");
        })
        it("does not accept booleans as an argument", function() {
            expect(eejs.url(true)).toBe("http://localhost/");
            expect(eejs.url(false)).toBe("http://localhost/");
        })
        it("converts an object argument to a query string", function() {
            expect(eejs.url({foo:"bar", fizz:"buzz"})).toBe("http://localhost/?foo=bar&fizz=buzz");
        })
        it("can use the second argument as the base url", function() {
            expect(eejs.url(undefined, "abc")).toBe("abc/");
            expect(eejs.url("", "abc")).toBe("abc/");            
            expect(eejs.url("def", "abc")).toBe("abc/def");
            expect(eejs.url(['def', 'hij'], "abc")).toBe("abc/def/hij");
        })
        it("always appends a slash to the base url", function() {
            expect(eejs.url("", "abc")).toBe("abc/");
            expect(eejs.url("", "abc/")).toBe("abc/");
            expect(eejs.url("def", "abc")).toBe("abc/def");
            expect(eejs.url("def", "abc/")).toBe("abc/def");
        });
        it("always adds a trailing slash if third argument is true", function() {
            expect(eejs.url("def", "abc", true)).toBe("abc/def/");
            expect(eejs.url("def/", "abc", true)).toBe("abc/def/");
            expect(eejs.url("def", undefined, true)).toBe("http://localhost/def/");
        });
        it("always removes the trailing slash if third argument is false", function() {
            expect(eejs.url("def", "abc", false)).toBe("abc/def");
            expect(eejs.url("def/", "abc", false)).toBe("abc/def");
            expect(eejs.url("def", undefined, false)).toBe("http://localhost/def");
        });
    });



    describe('Theme URL method', function() {
        it('returns appends a string to the base url', function() {
            expect(eejs.themeUrl('foo')).toBe('http://localhost/themes/foo');
        })
        it('does not accept number type arguments', function() {
            expect(eejs.themeUrl(5)).toBe('http://localhost/themes/');
        })
        it('turns object arguments into a query string', function() {
            expect(eejs.themeUrl({foo:'bar'})).toBe('http://localhost/themes/?foo=bar');
        })
    });


    describe('Site URL method', function() {
        it('appends a string argument to the base url', function() {
            expect(eejs.siteUrl('foo')).toBe('http://localhost/foo');
        })
        it('does not accept number type arguments', function() {
            expect(eejs.siteUrl(5)).toBe('http://localhost/');
        })
        it('turns object arguments into a query string', function() {
            expect(eejs.siteUrl({foo:'bar'})).toBe('http://localhost/?foo=bar');
        })
    });



    describe('Action URL method', function() {
        it('must have at least one argument', function() {
            expect(eejs.actionUrl()).toBe(false);
        })
        it('only accepts two string arguments', function() {
            expect(eejs.actionUrl('Fizz')).toBe(false);
            expect(eejs.actionUrl('Foo', 5)).toBe(false);
            expect(eejs.actionUrl(5, "Bar")).toBe(false);
            expect(eejs.actionUrl({Foo: "Bar"})).toBe(false);
        })
        it('appends a string argument to the base url', function() {
            expect(eejs.actionUrl('Fizz', 'Bar')).toBe(false);
        });
        it('returns a url for a valid className and methodName combination', function() {
            expect(eejs.actionUrl('Foo', 'Bar')).toBe('http://localhost/?ACT=1');
        });
        
    });


    describe('Masked URL method', function() {
        it('returns false when no argument is supplied', function() {
            expect(eejs.maskedUrl()).toBe(false);
        });
        it('does not accept non-string arguments', function() {
            expect(eejs.maskedUrl(5)).toBe(false);
            expect(eejs.maskedUrl(true)).toBe(false);
            expect(eejs.maskedUrl({foo: 'bar'})).toBe(false);
        })
        it('returns a url when a string is supplied', function() {
            expect(eejs.maskedUrl('http://example.com')).toBe("http://localhost/?URL=http://example.com");
        })
    });


    describe('CP URL method', function() {
        it('does not need any arguments', function() {
            expect(eejs.cpUrl()).toBe('http://localhost/index.php?S=6f4df591172f8d51475e52d07ca4819c074dd3a7&amp;D=cp');
        });
        it('appends a string argument to the BASE url', function() {
            expect(eejs.cpUrl('foo')).toBe('http://localhost/index.php?S=6f4df591172f8d51475e52d07ca4819c074dd3a7&amp;D=cpfoo');
        });
        it('converts an object to a query string', function() {
            expect(eejs.cpUrl({foo: 'bar'})).toBe('http://localhost/index.php?S=6f4df591172f8d51475e52d07ca4819c074dd3a7&amp;D=cp&foo=bar');
            expect(eejs.cpUrl({foo: 'bar', fizz: 'buzz'})).toBe('http://localhost/index.php?S=6f4df591172f8d51475e52d07ca4819c074dd3a7&amp;D=cp&foo=bar&fizz=buzz');
        })
    })





    /**
     * Actions
     */

    describe("Action method", function() {
        it("exists", function() {
            expect(eejs.hasOwnProperty("action")).toBe(true);
            expect(typeof eejs.action === "function").toBe(true);
        });
        it("returns false when no argument is supplied", function() {
            expect(eejs.action()).toBe(false);
        })
        it("only accepts non-zero length string arguments", function() {
            expect(eejs.action("")).toBe(false);
            expect(eejs.action(true)).toBe(false);
            expect(eejs.action({foo:"bar"})).toBe(false);
            expect(eejs.action(5)).toBe(false);
            expect(eejs.action("", "")).toBe(false);
            expect(eejs.action(true, false)).toBe(false);
            expect(eejs.action(false, true)).toBe(false);
            expect(eejs.action({fizz:"buzz"}, {foo:"bar"})).toBe(false);
            expect(eejs.action(2, 5)).toBe(false);
        });
        it("returns an integer for valid action classes and methods", function() {
            expect(typeof eejs.action("Foo", "Bar") === "number").toBe(true);
        })
        it('returns false for invalid action classes and method pair', function() {
            expect(eejs.action("Fizz", "Bar")).toBe(false);
            expect(eejs.action("Foo", "Buzz")).toBe(false);
        })
        it("returns false for invalid action classes", function() {
            expect(eejs.action("Fizz")).toBe(false);
        });
        it("returns an object for valid action classes", function() {
            expect(typeof eejs.action("Foo") === "object").toBe(true);
            expect(eejs.action("Foo").Bar).toBeDefined(true);
        });
        
    });

});