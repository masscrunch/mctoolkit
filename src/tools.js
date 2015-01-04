define('tools', function(require, exports, module){
    var isPlainObject = function(obj){
        if(!obj.hasOwnProperty('constructor') && typeof obj == 'object' && obj.constructor == Object){
            return true;
        }

        return false;
    };
    exports.isPlainObject = isPlainObject;
    var mix = function(base, child, deep){
        var o = new Object();
        for(var key in base){
            o[key] = base[key];
        }
        for(var key in child){
            if(deep && isPlainObject(o[key])){
                o[key] = mix(o[key], child[key]);
            }else{
                o[key] = child[key];
            }
        }
        return o;
    };
    exports.mix = mix;

    var extend = function(subClass, baseClass){
        var parent = {
            /**
             * parent construct
             * @param obj currentObject
             * @param args
             */
            '__construct': function(obj, args){
                baseClass.apply(obj, args);
            }
        };
        var _subPrototype = subClass.prototype;
        if(Object.create){
            subClass.prototype = Object.create(baseClass.prototype);
        }else{
            var F = new Function();
            F.prototype = baseClass.prototype;
            subClass.prototype = new F();
        }
        subClass.parent = mix(parent, baseClass.prototype);

        for(var method in _subPrototype){
            subClass.prototype[method] = _subPrototype[method];
        }
    };
    exports.extend = extend;

    var trim = function(str, spliter){
        var regexp;
        if(!spliter){
            regexp = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;
        }else{
            regexp = new RegExp("^(" + spliter + ")+|(" + spliter + ")+$", "g");
        }

        return str.replace(regexp, '');
    };
    exports.trim = trim;


    var dashToUnderScore = function(str){
        return str.replace(/-/g, '_');
    };
    exports.dashToUnderScore = dashToUnderScore;

    var dashToCamel = function(str){
        return str.replace(/-([a-z])/, function(matches){
            return matches[1].toUpperCase();
        });
    };

    exports.dashToCamel = dashToCamel;

    var camel2Dash = function(str){
        return str.replace(/.+([A-Z])/, function(matches){
            return "-" + matches[1].toLowerCase();
        });
    };
    exports.camel2Dash = camel2Dash;

    //array enhance

    var indexOf = function(array, element){
        for(var i = 0, len = array.length; i < len; i++){
            if(array[i] === element){
                return i;
            }
        }
        return -1;
    };
    exports.indexOf = indexOf;

    var eles = {
        div: document.createElement('div'),
        ul: document.createElement('ul'),
        li: document.createElement('li'),
        span: document.createElement('span'),
        p: document.createElement('p'),
        a: document.createElement('a'),
        fragment: document.createDocumentFragment(),
        input: document.createElement('input')
    }
    /**
     * create element
     * @param tagName
     * @param id
     * @param className
     * @returns {null}
     */
    var $c = function(tagName, id, className){
        var ele = null;
        if(!eles[tagName]){
            eles[tagName] = document.createElement(tagName);
            ele = eles[tagName].cloneNode(true);
        }else{
            ele = eles[tagName].cloneNode(true);
        }
        if(id){
            ele.id = id;
        }
        if(className){
            ele.className = className;
        }
        return ele;
    };
    exports.$c = $c;

    var rand = function (m, n) {
        return Math.floor((n - m + 1) * Math.random() + m);
    };
    exports.rand = rand;

    var EventEmitter = function(){
        this._initEventEmitter();
    };

    EventEmitter.prototype = {
        _initEventEmitter: function(){
            this._events = {};
        },

        emit: function(type, eventObject, target){
            var eventTarget = this;
            target || (eventTarget = target);
            if(this._events[type]){
                var events = this._events[type].slice();

                for(var i = 0, len = events.length; i < len; i++){
                    events[i].listener.call(eventTarget, eventObject);
                }
            }
        },

        addListener: function(type, listener){
            if(!this._events[type]){
                this._events[type] = [];
            }
            this._events[type].push({
                type: type,
                listener: listener
            });
        },

        on: function(type, listener){
            this.addListener(type, listener);
        },
        once: function(type, listener){
            var fired = false;

            function g(eventObject) {
                this.removeListener(type, g);

                if (!fired) {
                    fired = true;
                    listener.apply(this, eventObject);
                }
            }

              g.listener = listener;
              this.on(type, g);
        },
        removeListener: function(type, listener){
            var events = this._events[type];

            for(var i = 0, len = events.length; i < len; i++){
                if(events[i] == listener){
                    this._events[type].splice(i, 1);
                }
            }
        },
        removeAllListeners: function(type){
            if(type == undefined){
                this._events = {};
            }else{
                delete this._events[type];
            }
        }

    };
    exports.EventEmitter = EventEmitter;

});