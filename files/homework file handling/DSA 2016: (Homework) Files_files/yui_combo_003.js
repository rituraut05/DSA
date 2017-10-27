/*
YUI 3.17.2 (build 9c3c78e)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add('plugin', function (Y, NAME) {

    /**
     * Provides the base Plugin class, which plugin developers should extend, when creating custom plugins
     *
     * @module plugin
     */

    /**
     * The base class for all Plugin instances.
     *
     * @class Plugin.Base
     * @extends Base
     * @param {Object} config Configuration object with property name/value pairs.
     */
    function Plugin(config) {
        if (! (this.hasImpl && this.hasImpl(Y.Plugin.Base)) ) {
            Plugin.superclass.constructor.apply(this, arguments);
        } else {
            Plugin.prototype.initializer.apply(this, arguments);
        }
    }

    /**
     * Object defining the set of attributes supported by the Plugin.Base class
     *
     * @property ATTRS
     * @type Object
     * @static
     */
    Plugin.ATTRS = {

        /**
         * The plugin's host object.
         *
         * @attribute host
         * @writeonce
         * @type Plugin.Host
         */
        host : {
            writeOnce: true
        }
    };

    /**
     * The string identifying the Plugin.Base class. Plugins extending
     * Plugin.Base should set their own NAME value.
     *
     * @property NAME
     * @type String
     * @static
     */
    Plugin.NAME = 'plugin';

    /**
     * The name of the property the the plugin will be attached to
     * when plugged into a Plugin Host. Plugins extending Plugin.Base,
     * should set their own NS value.
     *
     * @property NS
     * @type String
     * @static
     */
    Plugin.NS = 'plugin';

    Y.extend(Plugin, Y.Base, {

        /**
         * The list of event handles for event listeners or AOP injected methods
         * applied by the plugin to the host object.
         *
         * @property _handles
         * @private
         * @type Array
         * @value null
         */
        _handles: null,

        /**
         * Initializer lifecycle implementation.
         *
         * @method initializer
         * @param {Object} config Configuration object with property name/value pairs.
         */
        initializer : function(config) {
            this._handles = [];
        },

        /**
         * Destructor lifecycle implementation.
         *
         * Removes any event listeners or injected methods applied by the Plugin
         *
         * @method destructor
         */
        destructor: function() {
            // remove all handles
            if (this._handles) {
                for (var i = 0, l = this._handles.length; i < l; i++) {
                   this._handles[i].detach();
                }
            }
        },

        /**
         * Listens for the "on" moment of events fired by the host,
         * or injects code "before" a given method on the host.
         *
         * @method doBefore
         *
         * @param strMethod {String} The event to listen for, or method to inject logic before.
         * @param fn {Function} The handler function. For events, the "on" moment listener. For methods, the function to execute before the given method is executed.
         * @param context {Object} An optional context to call the handler with. The default context is the plugin instance.
         * @return handle {EventHandle} The detach handle for the handler.
         */
        doBefore: function(strMethod, fn, context) {
            var host = this.get("host"), handle;

            if (strMethod in host) { // method
                handle = this.beforeHostMethod(strMethod, fn, context);
            } else if (host.on) { // event
                handle = this.onHostEvent(strMethod, fn, context);
            }

            return handle;
        },

        /**
         * Listens for the "after" moment of events fired by the host,
         * or injects code "after" a given method on the host.
         *
         * @method doAfter
         *
         * @param strMethod {String} The event to listen for, or method to inject logic after.
         * @param fn {Function} The handler function. For events, the "after" moment listener. For methods, the function to execute after the given method is executed.
         * @param context {Object} An optional context to call the handler with. The default context is the plugin instance.
         * @return handle {EventHandle} The detach handle for the listener.
         */
        doAfter: function(strMethod, fn, context) {
            var host = this.get("host"), handle;

            if (strMethod in host) { // method
                handle = this.afterHostMethod(strMethod, fn, context);
            } else if (host.after) { // event
                handle = this.afterHostEvent(strMethod, fn, context);
            }

            return handle;
        },

        /**
         * Listens for the "on" moment of events fired by the host object.
         *
         * Listeners attached through this method will be detached when the plugin is unplugged.
         *
         * @method onHostEvent
         * @param {String | Object} type The event type.
         * @param {Function} fn The listener.
         * @param {Object} context The execution context. Defaults to the plugin instance.
         * @return handle {EventHandle} The detach handle for the listener.
         */
        onHostEvent : function(type, fn, context) {
            var handle = this.get("host").on(type, fn, context || this);
            this._handles.push(handle);
            return handle;
        },

        /**
         * Listens for the "on" moment of events fired by the host object one time only.
         * The listener is immediately detached when it is executed.
         *
         * Listeners attached through this method will be detached when the plugin is unplugged.
         *
         * @method onceHostEvent
         * @param {String | Object} type The event type.
         * @param {Function} fn The listener.
         * @param {Object} context The execution context. Defaults to the plugin instance.
         * @return handle {EventHandle} The detach handle for the listener.
         */
        onceHostEvent : function(type, fn, context) {
            var handle = this.get("host").once(type, fn, context || this);
            this._handles.push(handle);
            return handle;
        },

        /**
         * Listens for the "after" moment of events fired by the host object.
         *
         * Listeners attached through this method will be detached when the plugin is unplugged.
         *
         * @method afterHostEvent
         * @param {String | Object} type The event type.
         * @param {Function} fn The listener.
         * @param {Object} context The execution context. Defaults to the plugin instance.
         * @return handle {EventHandle} The detach handle for the listener.
         */
        afterHostEvent : function(type, fn, context) {
            var handle = this.get("host").after(type, fn, context || this);
            this._handles.push(handle);
            return handle;
        },

        /**
         * Listens for the "after" moment of events fired by the host object one time only.
         * The listener is immediately detached when it is executed.
         *
         * Listeners attached through this method will be detached when the plugin is unplugged.
         *
         * @method onceAfterHostEvent
         * @param {String | Object} type The event type.
         * @param {Function} fn The listener.
         * @param {Object} context The execution context. Defaults to the plugin instance.
         * @return handle {EventHandle} The detach handle for the listener.
         */
        onceAfterHostEvent : function(type, fn, context) {
            var handle = this.get("host").onceAfter(type, fn, context || this);
            this._handles.push(handle);
            return handle;
        },

        /**
         * Injects a function to be executed before a given method on host object.
         *
         * The function will be detached when the plugin is unplugged.
         *
         * @method beforeHostMethod
         * @param {String} method The name of the method to inject the function before.
         * @param {Function} fn The function to inject.
         * @param {Object} context The execution context. Defaults to the plugin instance.
         * @return handle {EventHandle} The detach handle for the injected function.
         */
        beforeHostMethod : function(strMethod, fn, context) {
            var handle = Y.Do.before(fn, this.get("host"), strMethod, context || this);
            this._handles.push(handle);
            return handle;
        },

        /**
         * Injects a function to be executed after a given method on host object.
         *
         * The function will be detached when the plugin is unplugged.
         *
         * @method afterHostMethod
         * @param {String} method The name of the method to inject the function after.
         * @param {Function} fn The function to inject.
         * @param {Object} context The execution context. Defaults to the plugin instance.
         * @return handle {EventHandle} The detach handle for the injected function.
         */
        afterHostMethod : function(strMethod, fn, context) {
            var handle = Y.Do.after(fn, this.get("host"), strMethod, context || this);
            this._handles.push(handle);
            return handle;
        },

        toString: function() {
            return this.constructor.NAME + '[' + this.constructor.NS + ']';
        }
    });

    Y.namespace("Plugin").Base = Plugin;


}, '3.17.2', {"requires": ["base-base"]});
/*
YUI 3.17.2 (build 9c3c78e)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add('event-simulate', function (Y, NAME) {

(function() {
/**
 * Simulate user interaction by generating native DOM events.
 *
 * @module event-simulate
 * @requires event
 */

//shortcuts
var L   = Y.Lang,
    win = Y.config.win,
    isFunction  = L.isFunction,
    isString    = L.isString,
    isBoolean   = L.isBoolean,
    isObject    = L.isObject,
    isNumber    = L.isNumber,

    //mouse events supported
    mouseEvents = {
        click:      1,
        dblclick:   1,
        mouseover:  1,
        mouseout:   1,
        mousedown:  1,
        mouseup:    1,
        mousemove:  1,
        contextmenu:1
    },

    pointerEvents = (win && win.PointerEvent) ? {
        pointerover:  1,
        pointerout:   1,
        pointerdown:  1,
        pointerup:    1,
        pointermove:  1
    } : {
        MSPointerOver:  1,
        MSPointerOut:   1,
        MSPointerDown:  1,
        MSPointerUp:    1,
        MSPointerMove:  1
    },

    //key events supported
    keyEvents   = {
        keydown:    1,
        keyup:      1,
        keypress:   1
    },

    //HTML events supported
    uiEvents  = {
        submit:     1,
        blur:       1,
        change:     1,
        focus:      1,
        resize:     1,
        scroll:     1,
        select:     1
    },

    //events that bubble by default
    bubbleEvents = {
        scroll:     1,
        resize:     1,
        reset:      1,
        submit:     1,
        change:     1,
        select:     1,
        error:      1,
        abort:      1
    },

    //touch events supported
    touchEvents = {
        touchstart: 1,
        touchmove: 1,
        touchend: 1,
        touchcancel: 1
    },

    gestureEvents = {
        gesturestart: 1,
        gesturechange: 1,
        gestureend: 1
    };

//all key, mouse and touch events bubble
Y.mix(bubbleEvents, mouseEvents);
Y.mix(bubbleEvents, keyEvents);
Y.mix(bubbleEvents, touchEvents);

/*
 * Note: Intentionally not for YUIDoc generation.
 * Simulates a key event using the given event information to populate
 * the generated event object. This method does browser-equalizing
 * calculations to account for differences in the DOM and IE event models
 * as well as different browser quirks. Note: keydown causes Safari 2.x to
 * crash.
 * @method simulateKeyEvent
 * @private
 * @static
 * @param {HTMLElement} target The target of the given event.
 * @param {String} type The type of event to fire. This can be any one of
 *      the following: keyup, keydown, and keypress.
 * @param {Boolean} [bubbles=true] Indicates if the event can be
 *      bubbled up. DOM Level 3 specifies that all key events bubble by
 *      default.
 * @param {Boolean} [cancelable=true] Indicates if the event can be
 *      canceled using preventDefault(). DOM Level 3 specifies that all
 *      key events can be cancelled.
 * @param {Window} [view=window] The view containing the target. This is
 *      typically the window object.
 * @param {Boolean} [ctrlKey=false] Indicates if one of the CTRL keys
 *      is pressed while the event is firing.
 * @param {Boolean} [altKey=false] Indicates if one of the ALT keys
 *      is pressed while the event is firing.
 * @param {Boolean} [shiftKey=false] Indicates if one of the SHIFT keys
 *      is pressed while the event is firing.
 * @param {Boolean} [metaKey=false] Indicates if one of the META keys
 *      is pressed while the event is firing.
 * @param {Number} [keyCode=0] The code for the key that is in use.
 * @param {Number} [charCode=0] The Unicode code for the character
 *      associated with the key being used.
 */
function simulateKeyEvent(target /*:HTMLElement*/, type /*:String*/,
                             bubbles /*:Boolean*/,  cancelable /*:Boolean*/,
                             view /*:Window*/,
                             ctrlKey /*:Boolean*/,    altKey /*:Boolean*/,
                             shiftKey /*:Boolean*/,   metaKey /*:Boolean*/,
                             keyCode /*:int*/,        charCode /*:int*/) /*:Void*/
{
    //check target
    if (!target){
        Y.error("simulateKeyEvent(): Invalid target.");
    }

    //check event type
    if (isString(type)){
        type = type.toLowerCase();
        switch(type){
            case "textevent": //DOM Level 3
                type = "keypress";
                break;
            case "keyup":
            case "keydown":
            case "keypress":
                break;
            default:
                Y.error("simulateKeyEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        Y.error("simulateKeyEvent(): Event type must be a string.");
    }

    //setup default values
    if (!isBoolean(bubbles)){
        bubbles = true; //all key events bubble
    }
    if (!isBoolean(cancelable)){
        cancelable = true; //all key events can be cancelled
    }
    if (!isObject(view)){
        view = Y.config.win; //view is typically window
    }
    if (!isBoolean(ctrlKey)){
        ctrlKey = false;
    }
    if (!isBoolean(altKey)){
        altKey = false;
    }
    if (!isBoolean(shiftKey)){
        shiftKey = false;
    }
    if (!isBoolean(metaKey)){
        metaKey = false;
    }
    if (!isNumber(keyCode)){
        keyCode = 0;
    }
    if (!isNumber(charCode)){
        charCode = 0;
    }

    //try to create a mouse event
    var customEvent /*:MouseEvent*/ = null;

    //check for DOM-compliant browsers first
    if (isFunction(Y.config.doc.createEvent)){

        try {

            //try to create key event
            customEvent = Y.config.doc.createEvent("KeyEvents");

            /*
             * Interesting problem: Firefox implemented a non-standard
             * version of initKeyEvent() based on DOM Level 2 specs.
             * Key event was removed from DOM Level 2 and re-introduced
             * in DOM Level 3 with a different interface. Firefox is the
             * only browser with any implementation of Key Events, so for
             * now, assume it's Firefox if the above line doesn't error.
             */
            // @TODO: Decipher between Firefox's implementation and a correct one.
            customEvent.initKeyEvent(type, bubbles, cancelable, view, ctrlKey,
                altKey, shiftKey, metaKey, keyCode, charCode);

        } catch (ex /*:Error*/){

            /*
             * If it got here, that means key events aren't officially supported.
             * Safari/WebKit is a real problem now. WebKit 522 won't let you
             * set keyCode, charCode, or other properties if you use a
             * UIEvent, so we first must try to create a generic event. The
             * fun part is that this will throw an error on Safari 2.x. The
             * end result is that we need another try...catch statement just to
             * deal with this mess.
             */
            try {

                //try to create generic event - will fail in Safari 2.x
                customEvent = Y.config.doc.createEvent("Events");

            } catch (uierror /*:Error*/){

                //the above failed, so create a UIEvent for Safari 2.x
                customEvent = Y.config.doc.createEvent("UIEvents");

            } finally {

                customEvent.initEvent(type, bubbles, cancelable);

                //initialize
                customEvent.view = view;
                customEvent.altKey = altKey;
                customEvent.ctrlKey = ctrlKey;
                customEvent.shiftKey = shiftKey;
                customEvent.metaKey = metaKey;
                customEvent.keyCode = keyCode;
                customEvent.charCode = charCode;

            }

        }

        //fire the event
        target.dispatchEvent(customEvent);

    } else if (isObject(Y.config.doc.createEventObject)){ //IE

        //create an IE event object
        customEvent = Y.config.doc.createEventObject();

        //assign available properties
        customEvent.bubbles = bubbles;
        customEvent.cancelable = cancelable;
        customEvent.view = view;
        customEvent.ctrlKey = ctrlKey;
        customEvent.altKey = altKey;
        customEvent.shiftKey = shiftKey;
        customEvent.metaKey = metaKey;

        /*
         * IE doesn't support charCode explicitly. CharCode should
         * take precedence over any keyCode value for accurate
         * representation.
         */
        customEvent.keyCode = (charCode > 0) ? charCode : keyCode;

        //fire the event
        target.fireEvent("on" + type, customEvent);

    } else {
        Y.error("simulateKeyEvent(): No event simulation framework present.");
    }
}

/*
 * Note: Intentionally not for YUIDoc generation.
 * Simulates a mouse event using the given event information to populate
 * the generated event object. This method does browser-equalizing
 * calculations to account for differences in the DOM and IE event models
 * as well as different browser quirks.
 * @method simulateMouseEvent
 * @private
 * @static
 * @param {HTMLElement} target The target of the given event.
 * @param {String} type The type of event to fire. This can be any one of
 *      the following: click, dblclick, mousedown, mouseup, mouseout,
 *      mouseover, and mousemove.
 * @param {Boolean} bubbles (Optional) Indicates if the event can be
 *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
 *      default. The default is true.
 * @param {Boolean} cancelable (Optional) Indicates if the event can be
 *      canceled using preventDefault(). DOM Level 2 specifies that all
 *      mouse events except mousemove can be cancelled. The default
 *      is true for all events except mousemove, for which the default
 *      is false.
 * @param {Window} view (Optional) The view containing the target. This is
 *      typically the window object. The default is window.
 * @param {Number} detail (Optional) The number of times the mouse button has
 *      been used. The default value is 1.
 * @param {Number} screenX (Optional) The x-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {Number} screenY (Optional) The y-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {Number} clientX (Optional) The x-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {Number} clientY (Optional) The y-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
 *      is pressed while the event is firing. The default is false.
 * @param {Number} button (Optional) The button being pressed while the event
 *      is executing. The value should be 0 for the primary mouse button
 *      (typically the left button), 1 for the terciary mouse button
 *      (typically the middle button), and 2 for the secondary mouse button
 *      (typically the right button). The default is 0.
 * @param {HTMLElement} relatedTarget (Optional) For mouseout events,
 *      this is the element that the mouse has moved to. For mouseover
 *      events, this is the element that the mouse has moved from. This
 *      argument is ignored for all other events. The default is null.
 */
function simulateMouseEvent(target /*:HTMLElement*/, type /*:String*/,
                               bubbles /*:Boolean*/,  cancelable /*:Boolean*/,
                               view /*:Window*/,        detail /*:int*/,
                               screenX /*:int*/,        screenY /*:int*/,
                               clientX /*:int*/,        clientY /*:int*/,
                               ctrlKey /*:Boolean*/,    altKey /*:Boolean*/,
                               shiftKey /*:Boolean*/,   metaKey /*:Boolean*/,
                               button /*:int*/,         relatedTarget /*:HTMLElement*/) /*:Void*/
{
    //check target
    if (!target){
        Y.error("simulateMouseEvent(): Invalid target.");
    }


    if (isString(type)){

        //make sure it's a supported mouse event or an msPointerEvent.
        if (!mouseEvents[type.toLowerCase()] && !pointerEvents[type]){
            Y.error("simulateMouseEvent(): Event type '" + type + "' not supported.");
        }
    }
    else {
        Y.error("simulateMouseEvent(): Event type must be a string.");
    }

    //setup default values
    if (!isBoolean(bubbles)){
        bubbles = true; //all mouse events bubble
    }
    if (!isBoolean(cancelable)){
        cancelable = (type !== "mousemove"); //mousemove is the only one that can't be cancelled
    }
    if (!isObject(view)){
        view = Y.config.win; //view is typically window
    }
    if (!isNumber(detail)){
        detail = 1;  //number of mouse clicks must be at least one
    }
    if (!isNumber(screenX)){
        screenX = 0;
    }
    if (!isNumber(screenY)){
        screenY = 0;
    }
    if (!isNumber(clientX)){
        clientX = 0;
    }
    if (!isNumber(clientY)){
        clientY = 0;
    }
    if (!isBoolean(ctrlKey)){
        ctrlKey = false;
    }
    if (!isBoolean(altKey)){
        altKey = false;
    }
    if (!isBoolean(shiftKey)){
        shiftKey = false;
    }
    if (!isBoolean(metaKey)){
        metaKey = false;
    }
    if (!isNumber(button)){
        button = 0;
    }

    relatedTarget = relatedTarget || null;

    //try to create a mouse event
    var customEvent /*:MouseEvent*/ = null;

    //check for DOM-compliant browsers first
    if (isFunction(Y.config.doc.createEvent)){

        customEvent = Y.config.doc.createEvent("MouseEvents");

        //Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
        if (customEvent.initMouseEvent){
            customEvent.initMouseEvent(type, bubbles, cancelable, view, detail,
                                 screenX, screenY, clientX, clientY,
                                 ctrlKey, altKey, shiftKey, metaKey,
                                 button, relatedTarget);
        } else { //Safari

            //the closest thing available in Safari 2.x is UIEvents
            customEvent = Y.config.doc.createEvent("UIEvents");
            customEvent.initEvent(type, bubbles, cancelable);
            customEvent.view = view;
            customEvent.detail = detail;
            customEvent.screenX = screenX;
            customEvent.screenY = screenY;
            customEvent.clientX = clientX;
            customEvent.clientY = clientY;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.metaKey = metaKey;
            customEvent.shiftKey = shiftKey;
            customEvent.button = button;
            customEvent.relatedTarget = relatedTarget;
        }

        /*
         * Check to see if relatedTarget has been assigned. Firefox
         * versions less than 2.0 don't allow it to be assigned via
         * initMouseEvent() and the property is readonly after event
         * creation, so in order to keep YAHOO.util.getRelatedTarget()
         * working, assign to the IE proprietary toElement property
         * for mouseout event and fromElement property for mouseover
         * event.
         */
        if (relatedTarget && !customEvent.relatedTarget){
            if (type === "mouseout"){
                customEvent.toElement = relatedTarget;
            } else if (type === "mouseover"){
                customEvent.fromElement = relatedTarget;
            }
        }

        //fire the event
        target.dispatchEvent(customEvent);

    } else if (isObject(Y.config.doc.createEventObject)){ //IE

        //create an IE event object
        customEvent = Y.config.doc.createEventObject();

        //assign available properties
        customEvent.bubbles = bubbles;
        customEvent.cancelable = cancelable;
        customEvent.view = view;
        customEvent.detail = detail;
        customEvent.screenX = screenX;
        customEvent.screenY = screenY;
        customEvent.clientX = clientX;
        customEvent.clientY = clientY;
        customEvent.ctrlKey = ctrlKey;
        customEvent.altKey = altKey;
        customEvent.metaKey = metaKey;
        customEvent.shiftKey = shiftKey;

        //fix button property for IE's wacky implementation
        switch(button){
            case 0:
                customEvent.button = 1;
                break;
            case 1:
                customEvent.button = 4;
                break;
            case 2:
                //leave as is
                break;
            default:
                customEvent.button = 0;
        }

        /*
         * Have to use relatedTarget because IE won't allow assignment
         * to toElement or fromElement on generic events. This keeps
         * YAHOO.util.customEvent.getRelatedTarget() functional.
         */
        customEvent.relatedTarget = relatedTarget;

        //fire the event
        target.fireEvent("on" + type, customEvent);

    } else {
        Y.error("simulateMouseEvent(): No event simulation framework present.");
    }
}

/*
 * Note: Intentionally not for YUIDoc generation.
 * Simulates a UI event using the given event information to populate
 * the generated event object. This method does browser-equalizing
 * calculations to account for differences in the DOM and IE event models
 * as well as different browser quirks.
 * @method simulateHTMLEvent
 * @private
 * @static
 * @param {HTMLElement} target The target of the given event.
 * @param {String} type The type of event to fire. This can be any one of
 *      the following: click, dblclick, mousedown, mouseup, mouseout,
 *      mouseover, and mousemove.
 * @param {Boolean} bubbles (Optional) Indicates if the event can be
 *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
 *      default. The default is true.
 * @param {Boolean} cancelable (Optional) Indicates if the event can be
 *      canceled using preventDefault(). DOM Level 2 specifies that all
 *      mouse events except mousemove can be cancelled. The default
 *      is true for all events except mousemove, for which the default
 *      is false.
 * @param {Window} view (Optional) The view containing the target. This is
 *      typically the window object. The default is window.
 * @param {Number} detail (Optional) The number of times the mouse button has
 *      been used. The default value is 1.
 */
function simulateUIEvent(target /*:HTMLElement*/, type /*:String*/,
                               bubbles /*:Boolean*/,  cancelable /*:Boolean*/,
                               view /*:Window*/,        detail /*:int*/) /*:Void*/
{

    //check target
    if (!target){
        Y.error("simulateUIEvent(): Invalid target.");
    }

    //check event type
    if (isString(type)){
        type = type.toLowerCase();

        //make sure it's a supported mouse event
        if (!uiEvents[type]){
            Y.error("simulateUIEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        Y.error("simulateUIEvent(): Event type must be a string.");
    }

    //try to create a mouse event
    var customEvent = null;


    //setup default values
    if (!isBoolean(bubbles)){
        bubbles = (type in bubbleEvents);  //not all events bubble
    }
    if (!isBoolean(cancelable)){
        cancelable = (type === "submit"); //submit is the only one that can be cancelled
    }
    if (!isObject(view)){
        view = Y.config.win; //view is typically window
    }
    if (!isNumber(detail)){
        detail = 1;  //usually not used but defaulted to this
    }

    //check for DOM-compliant browsers first
    if (isFunction(Y.config.doc.createEvent)){

        //just a generic UI Event object is needed
        customEvent = Y.config.doc.createEvent("UIEvents");
        customEvent.initUIEvent(type, bubbles, cancelable, view, detail);

        //fire the event
        target.dispatchEvent(customEvent);

    } else if (isObject(Y.config.doc.createEventObject)){ //IE

        //create an IE event object
        customEvent = Y.config.doc.createEventObject();

        //assign available properties
        customEvent.bubbles = bubbles;
        customEvent.cancelable = cancelable;
        customEvent.view = view;
        customEvent.detail = detail;

        //fire the event
        target.fireEvent("on" + type, customEvent);

    } else {
        Y.error("simulateUIEvent(): No event simulation framework present.");
    }
}

/*
 * (iOS only) This is for creating native DOM gesture events which only iOS
 * v2.0+ is supporting.
 *
 * @method simulateGestureEvent
 * @private
 * @param {HTMLElement} target The target of the given event.
 * @param {String} type The type of event to fire. This can be any one of
 *      the following: touchstart, touchmove, touchend, touchcancel.
 * @param {Boolean} bubbles (Optional) Indicates if the event can be
 *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
 *      default. The default is true.
 * @param {Boolean} cancelable (Optional) Indicates if the event can be
 *      canceled using preventDefault(). DOM Level 2 specifies that all
 *      touch events except touchcancel can be cancelled. The default
 *      is true for all events except touchcancel, for which the default
 *      is false.
 * @param {Window} view (Optional) The view containing the target. This is
 *      typically the window object. The default is window.
 * @param {Number} detail (Optional) Specifies some detail information about
 *      the event depending on the type of event.
 * @param {Number} screenX (Optional) The x-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {Number} screenY (Optional) The y-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {Number} clientX (Optional) The x-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {Number} clientY (Optional) The y-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
 *      is pressed while the event is firing. The default is false.
 * @param {Number} scale (iOS v2+ only) The distance between two fingers
 *      since the start of an event as a multiplier of the initial distance.
 *      The default value is 1.0.
 * @param {Number} rotation (iOS v2+ only) The delta rotation since the start
 *      of an event, in degrees, where clockwise is positive and
 *      counter-clockwise is negative. The default value is 0.0.
 */
function simulateGestureEvent(target, type,
    bubbles,            // boolean
    cancelable,         // boolean
    view,               // DOMWindow
    detail,             // long
    screenX, screenY,   // long
    clientX, clientY,   // long
    ctrlKey, altKey, shiftKey, metaKey, // boolean
    scale,              // float
    rotation            // float
) {
    var customEvent;

    if(!Y.UA.ios || Y.UA.ios<2.0) {
        Y.error("simulateGestureEvent(): Native gesture DOM eventframe is not available in this platform.");
    }

    // check taget
    if (!target){
        Y.error("simulateGestureEvent(): Invalid target.");
    }

    //check event type
    if (Y.Lang.isString(type)) {
        type = type.toLowerCase();

        //make sure it's a supported touch event
        if (!gestureEvents[type]){
            Y.error("simulateTouchEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        Y.error("simulateGestureEvent(): Event type must be a string.");
    }

    // setup default values
    if (!Y.Lang.isBoolean(bubbles)) { bubbles = true; } // bubble by default
    if (!Y.Lang.isBoolean(cancelable)) { cancelable = true; }
    if (!Y.Lang.isObject(view))     { view = Y.config.win; }
    if (!Y.Lang.isNumber(detail))   { detail = 2; }     // usually not used.
    if (!Y.Lang.isNumber(screenX))  { screenX = 0; }
    if (!Y.Lang.isNumber(screenY))  { screenY = 0; }
    if (!Y.Lang.isNumber(clientX))  { clientX = 0; }
    if (!Y.Lang.isNumber(clientY))  { clientY = 0; }
    if (!Y.Lang.isBoolean(ctrlKey)) { ctrlKey = false; }
    if (!Y.Lang.isBoolean(altKey))  { altKey = false; }
    if (!Y.Lang.isBoolean(shiftKey)){ shiftKey = false; }
    if (!Y.Lang.isBoolean(metaKey)) { metaKey = false; }

    if (!Y.Lang.isNumber(scale)){ scale = 1.0; }
    if (!Y.Lang.isNumber(rotation)){ rotation = 0.0; }

    customEvent = Y.config.doc.createEvent("GestureEvent");

    customEvent.initGestureEvent(type, bubbles, cancelable, view, detail,
        screenX, screenY, clientX, clientY,
        ctrlKey, altKey, shiftKey, metaKey,
        target, scale, rotation);

    target.dispatchEvent(customEvent);
}


/*
 * @method simulateTouchEvent
 * @private
 * @param {HTMLElement} target The target of the given event.
 * @param {String} type The type of event to fire. This can be any one of
 *      the following: touchstart, touchmove, touchend, touchcancel.
 * @param {Boolean} bubbles (Optional) Indicates if the event can be
 *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
 *      default. The default is true.
 * @param {Boolean} cancelable (Optional) Indicates if the event can be
 *      canceled using preventDefault(). DOM Level 2 specifies that all
 *      touch events except touchcancel can be cancelled. The default
 *      is true for all events except touchcancel, for which the default
 *      is false.
 * @param {Window} view (Optional) The view containing the target. This is
 *      typically the window object. The default is window.
 * @param {Number} detail (Optional) Specifies some detail information about
 *      the event depending on the type of event.
 * @param {Number} screenX (Optional) The x-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {Number} screenY (Optional) The y-coordinate on the screen at which
 *      point the event occured. The default is 0.
 * @param {Number} clientX (Optional) The x-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {Number} clientY (Optional) The y-coordinate on the client at which
 *      point the event occured. The default is 0.
 * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
 *      is pressed while the event is firing. The default is false.
 * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
 *      is pressed while the event is firing. The default is false.
 * @param {TouchList} touches A collection of Touch objects representing
 *      all touches associated with this event.
 * @param {TouchList} targetTouches A collection of Touch objects
 *      representing all touches associated with this target.
 * @param {TouchList} changedTouches A collection of Touch objects
 *      representing all touches that changed in this event.
 * @param {Number} scale (iOS v2+ only) The distance between two fingers
 *      since the start of an event as a multiplier of the initial distance.
 *      The default value is 1.0.
 * @param {Number} rotation (iOS v2+ only) The delta rotation since the start
 *      of an event, in degrees, where clockwise is positive and
 *      counter-clockwise is negative. The default value is 0.0.
 */
function simulateTouchEvent(target, type,
    bubbles,            // boolean
    cancelable,         // boolean
    view,               // DOMWindow
    detail,             // long
    screenX, screenY,   // long
    clientX, clientY,   // long
    ctrlKey, altKey, shiftKey, metaKey, // boolean
    touches,            // TouchList
    targetTouches,      // TouchList
    changedTouches,     // TouchList
    scale,              // float
    rotation            // float
) {

    var customEvent;

    // check taget
    if (!target){
        Y.error("simulateTouchEvent(): Invalid target.");
    }

    //check event type
    if (Y.Lang.isString(type)) {
        type = type.toLowerCase();

        //make sure it's a supported touch event
        if (!touchEvents[type]){
            Y.error("simulateTouchEvent(): Event type '" + type + "' not supported.");
        }
    } else {
        Y.error("simulateTouchEvent(): Event type must be a string.");
    }

    // note that the caller is responsible to pass appropriate touch objects.
    // check touch objects
    // Android(even 4.0) doesn't define TouchList yet
    /*if(type === 'touchstart' || type === 'touchmove') {
        if(!touches instanceof TouchList) {
            Y.error('simulateTouchEvent(): Invalid touches. It must be a TouchList');
        } else {
            if(touches.length === 0) {
                Y.error('simulateTouchEvent(): No touch object found.');
            }
        }
    } else if(type === 'touchend') {
        if(!changedTouches instanceof TouchList) {
            Y.error('simulateTouchEvent(): Invalid touches. It must be a TouchList');
        } else {
            if(changedTouches.length === 0) {
                Y.error('simulateTouchEvent(): No touch object found.');
            }
        }
    }*/

    if(type === 'touchstart' || type === 'touchmove') {
        if(touches.length === 0) {
            Y.error('simulateTouchEvent(): No touch object in touches');
        }
    } else if(type === 'touchend') {
        if(changedTouches.length === 0) {
            Y.error('simulateTouchEvent(): No touch object in changedTouches');
        }
    }

    // setup default values
    if (!Y.Lang.isBoolean(bubbles)) { bubbles = true; } // bubble by default.
    if (!Y.Lang.isBoolean(cancelable)) {
        cancelable = (type !== "touchcancel"); // touchcancel is not cancelled
    }
    if (!Y.Lang.isObject(view))     { view = Y.config.win; }
    if (!Y.Lang.isNumber(detail))   { detail = 1; } // usually not used. defaulted to # of touch objects.
    if (!Y.Lang.isNumber(screenX))  { screenX = 0; }
    if (!Y.Lang.isNumber(screenY))  { screenY = 0; }
    if (!Y.Lang.isNumber(clientX))  { clientX = 0; }
    if (!Y.Lang.isNumber(clientY))  { clientY = 0; }
    if (!Y.Lang.isBoolean(ctrlKey)) { ctrlKey = false; }
    if (!Y.Lang.isBoolean(altKey))  { altKey = false; }
    if (!Y.Lang.isBoolean(shiftKey)){ shiftKey = false; }
    if (!Y.Lang.isBoolean(metaKey)) { metaKey = false; }
    if (!Y.Lang.isNumber(scale))    { scale = 1.0; }
    if (!Y.Lang.isNumber(rotation)) { rotation = 0.0; }


    //check for DOM-compliant browsers first
    if (Y.Lang.isFunction(Y.config.doc.createEvent)) {
        if (Y.UA.android) {
            /*
                * Couldn't find android start version that supports touch event.
                * Assumed supported(btw APIs broken till icecream sandwitch)
                * from the beginning.
            */
            if(Y.UA.android < 4.0) {
                /*
                    * Touch APIs are broken in androids older than 4.0. We will use
                    * simulated touch apis for these versions.
                    * App developer still can listen for touch events. This events
                    * will be dispatched with touch event types.
                    *
                    * (Note) Used target for the relatedTarget. Need to verify if
                    * it has a side effect.
                */
                customEvent = Y.config.doc.createEvent("MouseEvents");
                customEvent.initMouseEvent(type, bubbles, cancelable, view, detail,
                    screenX, screenY, clientX, clientY,
                    ctrlKey, altKey, shiftKey, metaKey,
                    0, target);

                customEvent.touches = touches;
                customEvent.targetTouches = targetTouches;
                customEvent.changedTouches = changedTouches;
            } else {
                customEvent = Y.config.doc.createEvent("TouchEvent");

                // Andoroid isn't compliant W3C initTouchEvent method signature.
                customEvent.initTouchEvent(touches, targetTouches, changedTouches,
                    type, view,
                    screenX, screenY, clientX, clientY,
                    ctrlKey, altKey, shiftKey, metaKey);
            }
        } else if (Y.UA.ios) {
            if(Y.UA.ios >= 2.0) {
                customEvent = Y.config.doc.createEvent("TouchEvent");

                // Available iOS 2.0 and later
                customEvent.initTouchEvent(type, bubbles, cancelable, view, detail,
                    screenX, screenY, clientX, clientY,
                    ctrlKey, altKey, shiftKey, metaKey,
                    touches, targetTouches, changedTouches,
                    scale, rotation);
            } else {
                Y.error('simulateTouchEvent(): No touch event simulation framework present for iOS, '+Y.UA.ios+'.');
            }
        } else {
            Y.error('simulateTouchEvent(): Not supported agent yet, '+Y.UA.userAgent);
        }

        //fire the event
        target.dispatchEvent(customEvent);
    //} else if (Y.Lang.isObject(doc.createEventObject)){ // Windows Mobile/IE, support later
    } else {
        Y.error('simulateTouchEvent(): No event simulation framework present.');
    }
}

/**
 * Simulates the event or gesture with the given name on a target.
 * @param {HTMLElement} target The DOM element that's the target of the event.
 * @param {String} type The type of event or name of the supported gesture to simulate
 *      (i.e., "click", "doubletap", "flick").
 * @param {Object} options (Optional) Extra options to copy onto the event object.
 *      For gestures, options are used to refine the gesture behavior.
 * @for Event
 * @method simulate
 * @static
 */
Y.Event.simulate = function(target, type, options){

    options = options || {};

    if (mouseEvents[type] || pointerEvents[type]){
        simulateMouseEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.detail, options.screenX,
            options.screenY, options.clientX, options.clientY, options.ctrlKey,
            options.altKey, options.shiftKey, options.metaKey, options.button,
            options.relatedTarget);
    } else if (keyEvents[type]){
        simulateKeyEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.ctrlKey,
            options.altKey, options.shiftKey, options.metaKey,
            options.keyCode, options.charCode);
    } else if (uiEvents[type]){
        simulateUIEvent(target, type, options.bubbles,
            options.cancelable, options.view, options.detail);

    // touch low-level event simulation
    } else if (touchEvents[type]) {
        if((Y.config.win && ("ontouchstart" in Y.config.win)) && !(Y.UA.phantomjs) && !(Y.UA.chrome && Y.UA.chrome < 6)) {
            simulateTouchEvent(target, type,
                options.bubbles, options.cancelable, options.view, options.detail,
                options.screenX, options.screenY, options.clientX, options.clientY,
                options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                options.touches, options.targetTouches, options.changedTouches,
                options.scale, options.rotation);
        } else {
            Y.error("simulate(): Event '" + type + "' can't be simulated. Use gesture-simulate module instead.");
        }

    // ios gesture low-level event simulation (iOS v2+ only)
    } else if(Y.UA.ios && Y.UA.ios >= 2.0 && gestureEvents[type]) {
        simulateGestureEvent(target, type,
            options.bubbles, options.cancelable, options.view, options.detail,
            options.screenX, options.screenY, options.clientX, options.clientY,
            options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
            options.scale, options.rotation);

    // anything else
    } else {
        Y.error("simulate(): Event '" + type + "' can't be simulated.");
    }
};


})();



}, '3.17.2', {"requires": ["event-base"]});
/*
YUI 3.17.2 (build 9c3c78e)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add('async-queue', function (Y, NAME) {

/**
 * <p>AsyncQueue allows you create a chain of function callbacks executed
 * via setTimeout (or synchronously) that are guaranteed to run in order.
 * Items in the queue can be promoted or removed.  Start or resume the
 * execution chain with run().  pause() to temporarily delay execution, or
 * stop() to halt and clear the queue.</p>
 *
 * @module async-queue
 */

/**
 * <p>A specialized queue class that supports scheduling callbacks to execute
 * sequentially, iteratively, even asynchronously.</p>
 *
 * <p>Callbacks can be function refs or objects with the following keys.  Only
 * the <code>fn</code> key is required.</p>
 *
 * <ul>
 * <li><code>fn</code> -- The callback function</li>
 * <li><code>context</code> -- The execution context for the callbackFn.</li>
 * <li><code>args</code> -- Arguments to pass to callbackFn.</li>
 * <li><code>timeout</code> -- Millisecond delay before executing callbackFn.
 *                     (Applies to each iterative execution of callback)</li>
 * <li><code>iterations</code> -- Number of times to repeat the callback.
 * <li><code>until</code> -- Repeat the callback until this function returns
 *                         true.  This setting trumps iterations.</li>
 * <li><code>autoContinue</code> -- Set to false to prevent the AsyncQueue from
 *                        executing the next callback in the Queue after
 *                        the callback completes.</li>
 * <li><code>id</code> -- Name that can be used to get, promote, get the
 *                        indexOf, or delete this callback.</li>
 * </ul>
 *
 * @class AsyncQueue
 * @extends EventTarget
 * @constructor
 * @param callback* {Function|Object} 0..n callbacks to seed the queue
 */
Y.AsyncQueue = function() {
    this._init();
    this.add.apply(this, arguments);
};

var Queue   = Y.AsyncQueue,
    EXECUTE = 'execute',
    SHIFT   = 'shift',
    PROMOTE = 'promote',
    REMOVE  = 'remove',

    isObject   = Y.Lang.isObject,
    isFunction = Y.Lang.isFunction;

/**
 * <p>Static default values used to populate callback configuration properties.
 * Preconfigured defaults include:</p>
 *
 * <ul>
 *  <li><code>autoContinue</code>: <code>true</code></li>
 *  <li><code>iterations</code>: 1</li>
 *  <li><code>timeout</code>: 10 (10ms between callbacks)</li>
 *  <li><code>until</code>: (function to run until iterations &lt;= 0)</li>
 * </ul>
 *
 * @property defaults
 * @type {Object}
 * @static
 */
Queue.defaults = Y.mix({
    autoContinue : true,
    iterations   : 1,
    timeout      : 10,
    until        : function () {
        this.iterations |= 0;
        return this.iterations <= 0;
    }
}, Y.config.queueDefaults || {});

Y.extend(Queue, Y.EventTarget, {
    /**
     * Used to indicate the queue is currently executing a callback.
     *
     * @property _running
     * @type {Boolean|Object} true for synchronous callback execution, the
     *                        return handle from Y.later for async callbacks.
     *                        Otherwise false.
     * @protected
     */
    _running : false,

    /**
     * Initializes the AsyncQueue instance properties and events.
     *
     * @method _init
     * @protected
     */
    _init : function () {
        Y.EventTarget.call(this, { prefix: 'queue', emitFacade: true });

        this._q = [];

        /**
         * Callback defaults for this instance.  Static defaults that are not
         * overridden are also included.
         *
         * @property defaults
         * @type {Object}
         */
        this.defaults = {};

        this._initEvents();
    },

    /**
     * Initializes the instance events.
     *
     * @method _initEvents
     * @protected
     */
    _initEvents : function () {
        this.publish({
            'execute' : { defaultFn : this._defExecFn,    emitFacade: true },
            'shift'   : { defaultFn : this._defShiftFn,   emitFacade: true },
            'add'     : { defaultFn : this._defAddFn,     emitFacade: true },
            'promote' : { defaultFn : this._defPromoteFn, emitFacade: true },
            'remove'  : { defaultFn : this._defRemoveFn,  emitFacade: true }
        });
    },

    /**
     * Returns the next callback needing execution.  If a callback is
     * configured to repeat via iterations or until, it will be returned until
     * the completion criteria is met.
     *
     * When the queue is empty, null is returned.
     *
     * @method next
     * @return {Function} the callback to execute
     */
    next : function () {
        var callback;

        while (this._q.length) {
            callback = this._q[0] = this._prepare(this._q[0]);
            if (callback && callback.until()) {
                this.fire(SHIFT, { callback: callback });
                callback = null;
            } else {
                break;
            }
        }

        return callback || null;
    },

    /**
     * Default functionality for the &quot;shift&quot; event.  Shifts the
     * callback stored in the event object's <em>callback</em> property from
     * the queue if it is the first item.
     *
     * @method _defShiftFn
     * @param e {Event} The event object
     * @protected
     */
    _defShiftFn : function (e) {
        if (this.indexOf(e.callback) === 0) {
            this._q.shift();
        }
    },

    /**
     * Creates a wrapper function to execute the callback using the aggregated
     * configuration generated by combining the static AsyncQueue.defaults, the
     * instance defaults, and the specified callback settings.
     *
     * The wrapper function is decorated with the callback configuration as
     * properties for runtime modification.
     *
     * @method _prepare
     * @param callback {Object|Function} the raw callback
     * @return {Function} a decorated function wrapper to execute the callback
     * @protected
     */
    _prepare: function (callback) {
        if (isFunction(callback) && callback._prepared) {
            return callback;
        }

        var config = Y.merge(
            Queue.defaults,
            { context : this, args: [], _prepared: true },
            this.defaults,
            (isFunction(callback) ? { fn: callback } : callback)),

            wrapper = Y.bind(function () {
                if (!wrapper._running) {
                    wrapper.iterations--;
                }
                if (isFunction(wrapper.fn)) {
                    wrapper.fn.apply(wrapper.context || Y,
                                     Y.Array(wrapper.args));
                }
            }, this);

        return Y.mix(wrapper, config);
    },

    /**
     * Sets the queue in motion.  All queued callbacks will be executed in
     * order unless pause() or stop() is called or if one of the callbacks is
     * configured with autoContinue: false.
     *
     * @method run
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    run : function () {
        var callback,
            cont = true;

        if (this._executing) {
            this._running = true;
            return this;
        }

        for (callback = this.next();
            callback && !this.isRunning();
            callback = this.next())
        {
            cont = (callback.timeout < 0) ?
                this._execute(callback) :
                this._schedule(callback);

            // Break to avoid an extra call to next (final-expression of the
            // 'for' loop), because the until function of the next callback
            // in the queue may return a wrong result if it depends on the
            // not-yet-finished work of the previous callback.
            if (!cont) {
                break;
            }
        }

        if (!callback) {
            /**
             * Event fired when there is no remaining callback in the running queue. Also fired after stop().
             * @event complete
             */
            this.fire('complete');
        }

        return this;
    },

    /**
     * Handles the execution of callbacks. Returns a boolean indicating
     * whether it is appropriate to continue running.
     *
     * @method _execute
     * @param callback {Object} the callback object to execute
     * @return {Boolean} whether the run loop should continue
     * @protected
     */
    _execute : function (callback) {

        this._running   = callback._running = true;
        this._executing = callback;

        callback.iterations--;
        this.fire(EXECUTE, { callback: callback });

        var cont = this._running && callback.autoContinue;

        this._running   = callback._running = false;
        this._executing = false;

        return cont;
    },

    /**
     * Schedules the execution of asynchronous callbacks.
     *
     * @method _schedule
     * @param callback {Object} the callback object to execute
     * @return {Boolean} whether the run loop should continue
     * @protected
     */
    _schedule : function (callback) {
        this._running = Y.later(callback.timeout, this, function () {
            if (this._execute(callback)) {
                this.run();
            }
        });

        return false;
    },

    /**
     * Determines if the queue is waiting for a callback to complete execution.
     *
     * @method isRunning
     * @return {Boolean} true if queue is waiting for a
     *                   from any initiated transactions
     */
    isRunning : function () {
        return !!this._running;
    },

    /**
     * Default functionality for the &quot;execute&quot; event.  Executes the
     * callback function
     *
     * @method _defExecFn
     * @param e {Event} the event object
     * @protected
     */
    _defExecFn : function (e) {
        e.callback();
    },

    /**
     * Add any number of callbacks to the end of the queue. Callbacks may be
     * provided as functions or objects.
     *
     * @method add
     * @param callback* {Function|Object} 0..n callbacks
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    add : function () {
        this.fire('add', { callbacks: Y.Array(arguments,0,true) });

        return this;
    },

    /**
     * Default functionality for the &quot;add&quot; event.  Adds the callbacks
     * in the event facade to the queue. Callbacks successfully added to the
     * queue are present in the event's <code>added</code> property in the
     * after phase.
     *
     * @method _defAddFn
     * @param e {Event} the event object
     * @protected
     */
    _defAddFn : function(e) {
        var _q = this._q,
            added = [];

        Y.Array.each(e.callbacks, function (c) {
            if (isObject(c)) {
                _q.push(c);
                added.push(c);
            }
        });

        e.added = added;
    },

    /**
     * Pause the execution of the queue after the execution of the current
     * callback completes.  If called from code outside of a queued callback,
     * clears the timeout for the pending callback. Paused queue can be
     * restarted with q.run()
     *
     * @method pause
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    pause: function () {
        if (this._running && isObject(this._running)) {
            this._running.cancel();
        }

        this._running = false;

        return this;
    },

    /**
     * Stop and clear the queue after the current execution of the
     * current callback completes.
     *
     * @method stop
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    stop : function () {

        this._q = [];

        if (this._running && isObject(this._running)) {
            this._running.cancel();
            this._running = false;
        }
        // otherwise don't systematically set this._running to false, because if
        // stop has been called from inside a queued callback, the _execute method
        // currenty running needs to call run() one more time for the 'complete'
        // event to be fired.

        // if stop is called from outside a callback, we need to explicitely call
        // run() once again to fire the 'complete' event.
        if (!this._executing) {
            this.run();
        }

        return this;
    },

    /**
     * Returns the current index of a callback.  Pass in either the id or
     * callback function from getCallback.
     *
     * @method indexOf
     * @param callback {String|Function} the callback or its specified id
     * @return {Number} index of the callback or -1 if not found
     */
    indexOf : function (callback) {
        var i = 0, len = this._q.length, c;

        for (; i < len; ++i) {
            c = this._q[i];
            if (c === callback || c.id === callback) {
                return i;
            }
        }

        return -1;
    },

    /**
     * Retrieve a callback by its id.  Useful to modify the configuration
     * while the queue is running.
     *
     * @method getCallback
     * @param id {String} the id assigned to the callback
     * @return {Object} the callback object
     */
    getCallback : function (id) {
        var i = this.indexOf(id);

        return (i > -1) ? this._q[i] : null;
    },

    /**
     * Promotes the named callback to the top of the queue. If a callback is
     * currently executing or looping (via until or iterations), the promotion
     * is scheduled to occur after the current callback has completed.
     *
     * @method promote
     * @param callback {String|Object} the callback object or a callback's id
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    promote : function (callback) {
        var payload = { callback : callback },e;

        if (this.isRunning()) {
            e = this.after(SHIFT, function () {
                    this.fire(PROMOTE, payload);
                    e.detach();
                }, this);
        } else {
            this.fire(PROMOTE, payload);
        }

        return this;
    },

    /**
     * <p>Default functionality for the &quot;promote&quot; event.  Promotes the
     * named callback to the head of the queue.</p>
     *
     * <p>The event object will contain a property &quot;callback&quot;, which
     * holds the id of a callback or the callback object itself.</p>
     *
     * @method _defPromoteFn
     * @param e {Event} the custom event
     * @protected
     */
    _defPromoteFn : function (e) {
        var i = this.indexOf(e.callback),
            promoted = (i > -1) ? this._q.splice(i,1)[0] : null;

        e.promoted = promoted;

        if (promoted) {
            this._q.unshift(promoted);
        }
    },

    /**
     * Removes the callback from the queue.  If the queue is active, the
     * removal is scheduled to occur after the current callback has completed.
     *
     * @method remove
     * @param callback {String|Object} the callback object or a callback's id
     * @return {AsyncQueue} the AsyncQueue instance
     * @chainable
     */
    remove : function (callback) {
        var payload = { callback : callback },e;

        // Can't return the removed callback because of the deferral until
        // current callback is complete
        if (this.isRunning()) {
            e = this.after(SHIFT, function () {
                    this.fire(REMOVE, payload);
                    e.detach();
                },this);
        } else {
            this.fire(REMOVE, payload);
        }

        return this;
    },

    /**
     * <p>Default functionality for the &quot;remove&quot; event.  Removes the
     * callback from the queue.</p>
     *
     * <p>The event object will contain a property &quot;callback&quot;, which
     * holds the id of a callback or the callback object itself.</p>
     *
     * @method _defRemoveFn
     * @param e {Event} the custom event
     * @protected
     */
    _defRemoveFn : function (e) {
        var i = this.indexOf(e.callback);

        e.removed = (i > -1) ? this._q.splice(i,1)[0] : null;
    },

    /**
     * Returns the number of callbacks in the queue.
     *
     * @method size
     * @return {Number}
     */
    size : function () {
        // next() flushes callbacks that have met their until() criteria and
        // therefore shouldn't count since they wouldn't execute anyway.
        if (!this.isRunning()) {
            this.next();
        }

        return this._q.length;
    }
});



}, '3.17.2', {"requires": ["event-custom"]});
/*
YUI 3.17.2 (build 9c3c78e)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add('gesture-simulate', function (Y, NAME) {

/**
 * Simulate high-level user gestures by generating a set of native DOM events.
 *
 * @module gesture-simulate
 * @requires event-simulate, async-queue, node-screen
 */

var NAME = "gesture-simulate",

    // phantomjs check may be temporary, until we determine if it really support touch all the way through, like it claims to (http://code.google.com/p/phantomjs/issues/detail?id=375)
    SUPPORTS_TOUCH = ((Y.config.win && ("ontouchstart" in Y.config.win)) && !(Y.UA.phantomjs) && !(Y.UA.chrome && Y.UA.chrome < 6)),

    gestureNames = {
        tap: 1,
        doubletap: 1,
        press: 1,
        move: 1,
        flick: 1,
        pinch: 1,
        rotate: 1
    },

    touchEvents = {
        touchstart: 1,
        touchmove: 1,
        touchend: 1,
        touchcancel: 1
    },

    document = Y.config.doc,
    emptyTouchList,

    EVENT_INTERVAL = 20,        // 20ms
    START_PAGEX,                // will be adjusted to the node element center
    START_PAGEY,                // will be adjusted to the node element center

    // defaults that user can override.
    DEFAULTS = {
        // tap gestures
        HOLD_TAP: 10,           // 10ms
        DELAY_TAP: 10,          // 10ms

        // press gesture
        HOLD_PRESS: 3000,       // 3sec
        MIN_HOLD_PRESS: 1000,   // 1sec
        MAX_HOLD_PRESS: 60000,  // 1min

        // move gesture
        DISTANCE_MOVE: 200,     // 200 pixels
        DURATION_MOVE: 1000,    // 1sec
        MAX_DURATION_MOVE: 5000,// 5sec

        // flick gesture
        MIN_VELOCITY_FLICK: 1.3,
        DISTANCE_FLICK: 200,     // 200 pixels
        DURATION_FLICK: 1000,    // 1sec
        MAX_DURATION_FLICK: 5000,// 5sec

        // pinch/rotation
        DURATION_PINCH: 1000     // 1sec
    },

    TOUCH_START = 'touchstart',
    TOUCH_MOVE = 'touchmove',
    TOUCH_END = 'touchend',

    GESTURE_START = 'gesturestart',
    GESTURE_CHANGE = 'gesturechange',
    GESTURE_END = 'gestureend',

    MOUSE_UP    = 'mouseup',
    MOUSE_MOVE  = 'mousemove',
    MOUSE_DOWN  = 'mousedown',
    MOUSE_CLICK = 'click',
    MOUSE_DBLCLICK = 'dblclick',

    X_AXIS = 'x',
    Y_AXIS = 'y';


function Simulations(node) {
    if(!node) {
        Y.error(NAME+': invalid target node');
    }
    this.node = node;
    this.target = Y.Node.getDOMNode(node);

    var startXY = this.node.getXY(),
        dims = this._getDims();

    START_PAGEX = startXY[0] + (dims[0])/2;
    START_PAGEY = startXY[1] + (dims[1])/2;
}

Simulations.prototype = {

    /**
     * Helper method to convert a degree to a radian.
     *
     * @method _toRadian
     * @private
     * @param {Number} deg A degree to be converted to a radian.
     * @return {Number} The degree in radian.
     */
    _toRadian: function(deg) {
        return deg * (Math.PI/180);
    },

    /**
     * Helper method to get height/width while accounting for
     * rotation/scale transforms where possible by using the
     * bounding client rectangle height/width instead of the
     * offsetWidth/Height which region uses.
     * @method _getDims
     * @private
     * @return {Array} Array with [height, width]
     */
    _getDims : function() {
        var region,
            width,
            height;

        // Ideally, this should be in DOM somewhere.
        if (this.target.getBoundingClientRect) {
            region = this.target.getBoundingClientRect();

            if ("height" in region) {
                height = region.height;
            } else {
                // IE7,8 has getBCR, but no height.
                height = Math.abs(region.bottom - region.top);
            }

            if ("width" in region) {
                width = region.width;
            } else {
                // IE7,8 has getBCR, but no width.
                width = Math.abs(region.right - region.left);
            }
        } else {
            region = this.node.get("region");
            width = region.width;
            height = region.height;
        }

        return [width, height];
    },

    /**
     * Helper method to convert a point relative to the node element into
     * the point in the page coordination.
     *
     * @method _calculateDefaultPoint
     * @private
     * @param {Array} point A point relative to the node element.
     * @return {Array} The same point in the page coordination.
     */
    _calculateDefaultPoint: function(point) {

        var height;

        if(!Y.Lang.isArray(point) || point.length === 0) {
            point = [START_PAGEX, START_PAGEY];
        } else {
            if(point.length == 1) {
                height = this._getDims[1];
                point[1] = height/2;
            }
            // convert to page(viewport) coordination
            point[0] = this.node.getX() + point[0];
            point[1] = this.node.getY() + point[1];
        }

        return point;
    },

    /**
     * The "rotate" and "pinch" methods are essencially same with the exact same
     * arguments. Only difference is the required parameters. The rotate method
     * requires "rotation" parameter while the pinch method requires "startRadius"
     * and "endRadius" parameters.
     *
     * @method rotate
     * @param {Function} cb The callback to execute when the gesture simulation
     *      is completed.
     * @param {Array} center A center point where the pinch gesture of two fingers
     *      should happen. It is relative to the top left corner of the target
     *      node element.
     * @param {Number} startRadius A radius of start circle where 2 fingers are
     *      on when the gesture starts. This is optional. The default is a fourth of
     *      either target node width or height whichever is smaller.
     * @param {Number} endRadius A radius of end circle where 2 fingers will be on when
     *      the pinch or spread gestures are completed. This is optional.
     *      The default is a fourth of either target node width or height whichever is less.
     * @param {Number} duration A duration of the gesture in millisecond.
     * @param {Number} start A start angle(0 degree at 12 o'clock) where the
     *      gesture should start. Default is 0.
     * @param {Number} rotation A rotation in degree. It is required.
     */
    rotate: function(cb, center, startRadius, endRadius, duration, start, rotation) {
        var radius,
            r1 = startRadius,   // optional
            r2 = endRadius;     // optional

        if(!Y.Lang.isNumber(r1) || !Y.Lang.isNumber(r2) || r1<0 || r2<0) {
            radius = (this.target.offsetWidth < this.target.offsetHeight)?
                this.target.offsetWidth/4 : this.target.offsetHeight/4;
            r1 = radius;
            r2 = radius;
        }

        // required
        if(!Y.Lang.isNumber(rotation)) {
            Y.error(NAME+'Invalid rotation detected.');
        }

        this.pinch(cb, center, r1, r2, duration, start, rotation);
    },

    /**
     * The "rotate" and "pinch" methods are essencially same with the exact same
     * arguments. Only difference is the required parameters. The rotate method
     * requires "rotation" parameter while the pinch method requires "startRadius"
     * and "endRadius" parameters.
     *
     * The "pinch" gesture can simulate various 2 finger gestures such as pinch,
     * spread and/or rotation. The "startRadius" and "endRadius" are required.
     * If endRadius is larger than startRadius, it becomes a spread gesture
     * otherwise a pinch gesture.
     *
     * @method pinch
     * @param {Function} cb The callback to execute when the gesture simulation
     *      is completed.
     * @param {Array} center A center point where the pinch gesture of two fingers
     *      should happen. It is relative to the top left corner of the target
     *      node element.
     * @param {Number} startRadius A radius of start circle where 2 fingers are
     *      on when the gesture starts. This paramenter is required.
     * @param {Number} endRadius A radius of end circle where 2 fingers will be on when
     *      the pinch or spread gestures are completed. This parameter is required.
     * @param {Number} duration A duration of the gesture in millisecond.
     * @param {Number} start A start angle(0 degree at 12 o'clock) where the
     *      gesture should start. Default is 0.
     * @param {Number} rotation If rotation is desired during the pinch or
     *      spread gestures, this parameter can be used. Default is 0 degree.
     */
    pinch: function(cb, center, startRadius, endRadius, duration, start, rotation) {
        var eventQueue,
            i,
            interval = EVENT_INTERVAL,
            touches,
            id = 0,
            r1 = startRadius,   // required
            r2 = endRadius,     // required
            radiusPerStep,
            centerX, centerY,
            startScale, endScale, scalePerStep,
            startRot, endRot, rotPerStep,
            path1 = {start: [], end: []}, // paths for 1st and 2nd fingers.
            path2 = {start: [], end: []},
            steps,
            touchMove;

        center = this._calculateDefaultPoint(center);

        if(!Y.Lang.isNumber(r1) || !Y.Lang.isNumber(r2) || r1<0 || r2<0) {
            Y.error(NAME+'Invalid startRadius and endRadius detected.');
        }

        if(!Y.Lang.isNumber(duration) || duration <= 0) {
            duration = DEFAULTS.DURATION_PINCH;
        }

        if(!Y.Lang.isNumber(start)) {
            start = 0.0;
        } else {
            start = start%360;
            while(start < 0) {
                start += 360;
            }
        }

        if(!Y.Lang.isNumber(rotation)) {
            rotation = 0.0;
        }

        Y.AsyncQueue.defaults.timeout = interval;
        eventQueue = new Y.AsyncQueue();

        // range determination
        centerX = center[0];
        centerY = center[1];

        startRot = start;
        endRot = start + rotation;

        // 1st finger path
        path1.start = [
            centerX + r1*Math.sin(this._toRadian(startRot)),
            centerY - r1*Math.cos(this._toRadian(startRot))
        ];
        path1.end   = [
            centerX + r2*Math.sin(this._toRadian(endRot)),
            centerY - r2*Math.cos(this._toRadian(endRot))
        ];

        // 2nd finger path
        path2.start = [
            centerX - r1*Math.sin(this._toRadian(startRot)),
            centerY + r1*Math.cos(this._toRadian(startRot))
        ];
        path2.end   = [
            centerX - r2*Math.sin(this._toRadian(endRot)),
            centerY + r2*Math.cos(this._toRadian(endRot))
        ];

        startScale = 1.0;
        endScale = endRadius/startRadius;

        // touch/gesture start
        eventQueue.add({
            fn: function() {
                var coord1, coord2, coord, touches;

                // coordinate for each touch object.
                coord1 = {
                    pageX: path1.start[0],
                    pageY: path1.start[1],
                    clientX: path1.start[0],
                    clientY: path1.start[1]
                };
                coord2 = {
                    pageX: path2.start[0],
                    pageY: path2.start[1],
                    clientX: path2.start[0],
                    clientY: path2.start[1]
                };
                touches = this._createTouchList([Y.merge({
                    identifier: (id++)
                }, coord1), Y.merge({
                    identifier: (id++)
                }, coord2)]);

                // coordinate for top level event
                coord = {
                    pageX: (path1.start[0] + path2.start[0])/2,
                    pageY: (path1.start[0] + path2.start[1])/2,
                    clientX: (path1.start[0] + path2.start[0])/2,
                    clientY: (path1.start[0] + path2.start[1])/2
                };

                this._simulateEvent(this.target, TOUCH_START, Y.merge({
                    touches: touches,
                    targetTouches: touches,
                    changedTouches: touches,
                    scale: startScale,
                    rotation: startRot
                }, coord));

                if(Y.UA.ios >= 2.0) {
                    /* gesture starts when the 2nd finger touch starts.
                    * The implementation will fire 1 touch start event for both fingers,
                    * simulating 2 fingers touched on the screen at the same time.
                    */
                    this._simulateEvent(this.target, GESTURE_START, Y.merge({
                        scale: startScale,
                        rotation: startRot
                    }, coord));
                }
            },
            timeout: 0,
            context: this
        });

        // gesture change
        steps = Math.floor(duration/interval);
        radiusPerStep = (r2 - r1)/steps;
        scalePerStep = (endScale - startScale)/steps;
        rotPerStep = (endRot - startRot)/steps;

        touchMove = function(step) {
            var radius = r1 + (radiusPerStep)*step,
                px1 = centerX + radius*Math.sin(this._toRadian(startRot + rotPerStep*step)),
                py1 = centerY - radius*Math.cos(this._toRadian(startRot + rotPerStep*step)),
                px2 = centerX - radius*Math.sin(this._toRadian(startRot + rotPerStep*step)),
                py2 = centerY + radius*Math.cos(this._toRadian(startRot + rotPerStep*step)),
                px = (px1+px2)/2,
                py = (py1+py2)/2,
                coord1, coord2, coord, touches;

            // coordinate for each touch object.
            coord1 = {
                pageX: px1,
                pageY: py1,
                clientX: px1,
                clientY: py1
            };
            coord2 = {
                pageX: px2,
                pageY: py2,
                clientX: px2,
                clientY: py2
            };
            touches = this._createTouchList([Y.merge({
                identifier: (id++)
            }, coord1), Y.merge({
                identifier: (id++)
            }, coord2)]);

            // coordinate for top level event
            coord = {
                pageX: px,
                pageY: py,
                clientX: px,
                clientY: py
            };

            this._simulateEvent(this.target, TOUCH_MOVE, Y.merge({
                touches: touches,
                targetTouches: touches,
                changedTouches: touches,
                scale: startScale + scalePerStep*step,
                rotation: startRot + rotPerStep*step
            }, coord));

            if(Y.UA.ios >= 2.0) {
                this._simulateEvent(this.target, GESTURE_CHANGE, Y.merge({
                    scale: startScale + scalePerStep*step,
                    rotation: startRot + rotPerStep*step
                }, coord));
            }
        };

        for (i=0; i < steps; i++) {
            eventQueue.add({
                fn: touchMove,
                args: [i],
                context: this
            });
        }

        // gesture end
        eventQueue.add({
            fn: function() {
                var emptyTouchList = this._getEmptyTouchList(),
                    coord1, coord2, coord, touches;

                // coordinate for each touch object.
                coord1 = {
                    pageX: path1.end[0],
                    pageY: path1.end[1],
                    clientX: path1.end[0],
                    clientY: path1.end[1]
                };
                coord2 = {
                    pageX: path2.end[0],
                    pageY: path2.end[1],
                    clientX: path2.end[0],
                    clientY: path2.end[1]
                };
                touches = this._createTouchList([Y.merge({
                    identifier: (id++)
                }, coord1), Y.merge({
                    identifier: (id++)
                }, coord2)]);

                // coordinate for top level event
                coord = {
                    pageX: (path1.end[0] + path2.end[0])/2,
                    pageY: (path1.end[0] + path2.end[1])/2,
                    clientX: (path1.end[0] + path2.end[0])/2,
                    clientY: (path1.end[0] + path2.end[1])/2
                };

                if(Y.UA.ios >= 2.0) {
                    this._simulateEvent(this.target, GESTURE_END, Y.merge({
                        scale: endScale,
                        rotation: endRot
                    }, coord));
                }

                this._simulateEvent(this.target, TOUCH_END, Y.merge({
                    touches: emptyTouchList,
                    targetTouches: emptyTouchList,
                    changedTouches: touches,
                    scale: endScale,
                    rotation: endRot
                }, coord));
            },
            context: this
        });

        if(cb && Y.Lang.isFunction(cb)) {
            eventQueue.add({
                fn: cb,

                // by default, the callback runs the node context where
                // simulateGesture method is called.
                context: this.node

                //TODO: Use args to pass error object as 1st param if there is an error.
                //args:
            });
        }

        eventQueue.run();
    },

    /**
     * The "tap" gesture can be used for various single touch point gestures
     * such as single tap, N number of taps, long press. The default is a single
     * tap.
     *
     * @method tap
     * @param {Function} cb The callback to execute when the gesture simulation
     *      is completed.
     * @param {Array} point A point(relative to the top left corner of the
     *      target node element) where the tap gesture should start. The default
     *      is the center of the taget node.
     * @param {Number} times The number of taps. Default is 1.
     * @param {Number} hold The hold time in milliseconds between "touchstart" and
     *      "touchend" event generation. Default is 10ms.
     * @param {Number} delay The time gap in millisecond between taps if this
     *      gesture has more than 1 tap. Default is 10ms.
     */
    tap: function(cb, point, times, hold, delay) {
        var eventQueue = new Y.AsyncQueue(),
            emptyTouchList = this._getEmptyTouchList(),
            touches,
            coord,
            i,
            touchStart,
            touchEnd;

        point = this._calculateDefaultPoint(point);

        if(!Y.Lang.isNumber(times) || times < 1) {
            times = 1;
        }

        if(!Y.Lang.isNumber(hold)) {
            hold = DEFAULTS.HOLD_TAP;
        }

        if(!Y.Lang.isNumber(delay)) {
            delay = DEFAULTS.DELAY_TAP;
        }

        coord = {
            pageX: point[0],
            pageY: point[1],
            clientX: point[0],
            clientY: point[1]
        };

        touches = this._createTouchList([Y.merge({identifier: 0}, coord)]);

        touchStart = function() {
            this._simulateEvent(this.target, TOUCH_START, Y.merge({
                touches: touches,
                targetTouches: touches,
                changedTouches: touches
            }, coord));
        };

        touchEnd = function() {
            this._simulateEvent(this.target, TOUCH_END, Y.merge({
                touches: emptyTouchList,
                targetTouches: emptyTouchList,
                changedTouches: touches
            }, coord));
        };

        for (i=0; i < times; i++) {
            eventQueue.add({
                fn: touchStart,
                context: this,
                timeout: (i === 0)? 0 : delay
            });

            eventQueue.add({
                fn: touchEnd,
                context: this,
                timeout: hold
            });
        }

        if(times > 1 && !SUPPORTS_TOUCH) {
            eventQueue.add({
                fn: function() {
                    this._simulateEvent(this.target, MOUSE_DBLCLICK, coord);
                },
                context: this
            });
        }

        if(cb && Y.Lang.isFunction(cb)) {
            eventQueue.add({
                fn: cb,

                // by default, the callback runs the node context where
                // simulateGesture method is called.
                context: this.node

                //TODO: Use args to pass error object as 1st param if there is an error.
                //args:
            });
        }

        eventQueue.run();
    },

    /**
     * The "flick" gesture is a specialized "move" that has some velocity
     * and the movement always runs either x or y axis. The velocity is calculated
     * with "distance" and "duration" arguments. If the calculated velocity is
     * below than the minimum velocity, the given duration will be ignored and
     * new duration will be created to make a valid flick gesture.
     *
     * @method flick
     * @param {Function} cb The callback to execute when the gesture simulation
     *      is completed.
     * @param {Array} point A point(relative to the top left corner of the
     *      target node element) where the flick gesture should start. The default
     *      is the center of the taget node.
     * @param {String} axis Either "x" or "y".
     * @param {Number} distance A distance in pixels to flick.
     * @param {Number} duration A duration of the gesture in millisecond.
     *
     */
    flick: function(cb, point, axis, distance, duration) {
        var path;

        point = this._calculateDefaultPoint(point);

        if(!Y.Lang.isString(axis)) {
            axis = X_AXIS;
        } else {
            axis = axis.toLowerCase();
            if(axis !== X_AXIS && axis !== Y_AXIS) {
                Y.error(NAME+'(flick): Only x or y axis allowed');
            }
        }

        if(!Y.Lang.isNumber(distance)) {
            distance = DEFAULTS.DISTANCE_FLICK;
        }

        if(!Y.Lang.isNumber(duration)){
            duration = DEFAULTS.DURATION_FLICK; // ms
        } else {
            if(duration > DEFAULTS.MAX_DURATION_FLICK) {
                duration = DEFAULTS.MAX_DURATION_FLICK;
            }
        }

        /*
         * Check if too slow for a flick.
         * Adjust duration if the calculated velocity is less than
         * the minimum velcocity to be claimed as a flick.
         */
        if(Math.abs(distance)/duration < DEFAULTS.MIN_VELOCITY_FLICK) {
            duration = Math.abs(distance)/DEFAULTS.MIN_VELOCITY_FLICK;
        }

        path = {
            start: Y.clone(point),
            end: [
                (axis === X_AXIS) ? point[0]+distance : point[0],
                (axis === Y_AXIS) ? point[1]+distance : point[1]
            ]
        };

        this._move(cb, path, duration);
    },

    /**
     * The "move" gesture simulate the movement of any direction between
     * the straight line of start and end point for the given duration.
     * The path argument is an object with "point", "xdist" and "ydist" properties.
     * The "point" property is an array with x and y coordinations(relative to the
     * top left corner of the target node element) while "xdist" and "ydist"
     * properties are used for the distance along the x and y axis. A negative
     * distance number can be used to drag either left or up direction.
     *
     * If no arguments are given, it will simulate the default move, which
     * is moving 200 pixels from the center of the element to the positive X-axis
     * direction for 1 sec.
     *
     * @method move
     * @param {Function} cb The callback to execute when the gesture simulation
     *      is completed.
     * @param {Object} path An object with "point", "xdist" and "ydist".
     * @param {Number} duration A duration of the gesture in millisecond.
     */
    move: function(cb, path, duration) {
        var convertedPath;

        if(!Y.Lang.isObject(path)) {
            path = {
                point: this._calculateDefaultPoint([]),
                xdist: DEFAULTS.DISTANCE_MOVE,
                ydist: 0
            };
        } else {
            // convert to the page coordination
            if(!Y.Lang.isArray(path.point)) {
                path.point = this._calculateDefaultPoint([]);
            } else {
                path.point = this._calculateDefaultPoint(path.point);
            }

            if(!Y.Lang.isNumber(path.xdist)) {
                path.xdist = DEFAULTS.DISTANCE_MOVE;
            }

            if(!Y.Lang.isNumber(path.ydist)) {
                path.ydist = 0;
            }
        }

        if(!Y.Lang.isNumber(duration)){
            duration = DEFAULTS.DURATION_MOVE; // ms
        } else {
            if(duration > DEFAULTS.MAX_DURATION_MOVE) {
                duration = DEFAULTS.MAX_DURATION_MOVE;
            }
        }

        convertedPath = {
            start: Y.clone(path.point),
            end: [path.point[0]+path.xdist, path.point[1]+path.ydist]
        };

        this._move(cb, convertedPath, duration);
    },

    /**
     * A base method on top of "move" and "flick" methods. The method takes
     * the path with start/end properties and duration to generate a set of
     * touch events for the movement gesture.
     *
     * @method _move
     * @private
     * @param {Function} cb The callback to execute when the gesture simulation
     *      is completed.
     * @param {Object} path An object with "start" and "end" properties. Each
     *      property should be an array with x and y coordination (e.g. start: [100, 50])
     * @param {Number} duration A duration of the gesture in millisecond.
     */
    _move: function(cb, path, duration) {
        var eventQueue,
            i,
            interval = EVENT_INTERVAL,
            steps, stepX, stepY,
            id = 0,
            touchMove;

        if(!Y.Lang.isNumber(duration)){
            duration = DEFAULTS.DURATION_MOVE; // ms
        } else {
            if(duration > DEFAULTS.MAX_DURATION_MOVE) {
                duration = DEFAULTS.MAX_DURATION_MOVE;
            }
        }

        if(!Y.Lang.isObject(path)) {
            path = {
                start: [
                    START_PAGEX,
                    START_PAGEY
                ],
                end: [
                    START_PAGEX + DEFAULTS.DISTANCE_MOVE,
                    START_PAGEY
                ]
            };
        } else {
            if(!Y.Lang.isArray(path.start)) {
                path.start = [
                    START_PAGEX,
                    START_PAGEY
                ];
            }
            if(!Y.Lang.isArray(path.end)) {
                path.end = [
                    START_PAGEX + DEFAULTS.DISTANCE_MOVE,
                    START_PAGEY
                ];
            }
        }

        Y.AsyncQueue.defaults.timeout = interval;
        eventQueue = new Y.AsyncQueue();

        // start
        eventQueue.add({
            fn: function() {
                var coord = {
                        pageX: path.start[0],
                        pageY: path.start[1],
                        clientX: path.start[0],
                        clientY: path.start[1]
                    },
                    touches = this._createTouchList([
                        Y.merge({identifier: (id++)}, coord)
                    ]);

                this._simulateEvent(this.target, TOUCH_START, Y.merge({
                    touches: touches,
                    targetTouches: touches,
                    changedTouches: touches
                }, coord));
            },
            timeout: 0,
            context: this
        });

        // move
        steps = Math.floor(duration/interval);
        stepX = (path.end[0] - path.start[0])/steps;
        stepY = (path.end[1] - path.start[1])/steps;

        touchMove = function(step) {
            var px = path.start[0]+(stepX * step),
                py = path.start[1]+(stepY * step),
                coord = {
                    pageX: px,
                    pageY: py,
                    clientX: px,
                    clientY: py
                },
                touches = this._createTouchList([
                    Y.merge({identifier: (id++)}, coord)
                ]);

            this._simulateEvent(this.target, TOUCH_MOVE, Y.merge({
                touches: touches,
                targetTouches: touches,
                changedTouches: touches
            }, coord));
        };

        for (i=0; i < steps; i++) {
            eventQueue.add({
                fn: touchMove,
                args: [i],
                context: this
            });
        }

        // last move
        eventQueue.add({
            fn: function() {
                var coord = {
                        pageX: path.end[0],
                        pageY: path.end[1],
                        clientX: path.end[0],
                        clientY: path.end[1]
                    },
                    touches = this._createTouchList([
                        Y.merge({identifier: id}, coord)
                    ]);

                this._simulateEvent(this.target, TOUCH_MOVE, Y.merge({
                    touches: touches,
                    targetTouches: touches,
                    changedTouches: touches
                }, coord));
            },
            timeout: 0,
            context: this
        });

        // end
        eventQueue.add({
            fn: function() {
                var coord = {
                    pageX: path.end[0],
                    pageY: path.end[1],
                    clientX: path.end[0],
                    clientY: path.end[1]
                },
                emptyTouchList = this._getEmptyTouchList(),
                touches = this._createTouchList([
                    Y.merge({identifier: id}, coord)
                ]);

                this._simulateEvent(this.target, TOUCH_END, Y.merge({
                    touches: emptyTouchList,
                    targetTouches: emptyTouchList,
                    changedTouches: touches
                }, coord));
            },
            context: this
        });

        if(cb && Y.Lang.isFunction(cb)) {
            eventQueue.add({
                fn: cb,

                // by default, the callback runs the node context where
                // simulateGesture method is called.
                context: this.node

                //TODO: Use args to pass error object as 1st param if there is an error.
                //args:
            });
        }

        eventQueue.run();
    },

    /**
     * Helper method to return a singleton instance of empty touch list.
     *
     * @method _getEmptyTouchList
     * @private
     * @return {TouchList | Array} An empty touch list object.
     */
    _getEmptyTouchList: function() {
        if(!emptyTouchList) {
            emptyTouchList = this._createTouchList([]);
        }

        return emptyTouchList;
    },

    /**
     * Helper method to convert an array with touch points to TouchList object as
     * defined in http://www.w3.org/TR/touch-events/
     *
     * @method _createTouchList
     * @private
     * @param {Array} touchPoints
     * @return {TouchList | Array} If underlaying platform support creating touch list
     *      a TouchList object will be returned otherwise a fake Array object
     *      will be returned.
     */
    _createTouchList: function(touchPoints) {
        /*
        * Android 4.0.3 emulator:
        * Native touch api supported starting in version 4.0 (Ice Cream Sandwich).
        * However the support seems limited. In Android 4.0.3 emulator, I got
        * "TouchList is not defined".
        */
        var touches = [],
            touchList,
            self = this;

        if(!!touchPoints && Y.Lang.isArray(touchPoints)) {
            if(Y.UA.android && Y.UA.android >= 4.0 || Y.UA.ios && Y.UA.ios >= 2.0) {
                Y.each(touchPoints, function(point) {
                    if(!point.identifier) {point.identifier = 0;}
                    if(!point.pageX) {point.pageX = 0;}
                    if(!point.pageY) {point.pageY = 0;}
                    if(!point.screenX) {point.screenX = 0;}
                    if(!point.screenY) {point.screenY = 0;}

                    touches.push(document.createTouch(Y.config.win,
                        self.target,
                        point.identifier,
                        point.pageX, point.pageY,
                        point.screenX, point.screenY));
                });

                touchList = document.createTouchList.apply(document, touches);
            } else if(Y.UA.ios && Y.UA.ios < 2.0) {
                Y.error(NAME+': No touch event simulation framework present.');
            } else {
                // this will inclide android(Y.UA.android && Y.UA.android < 4.0)
                // and desktops among all others.

                /*
                 * Touch APIs are broken in androids older than 4.0. We will use
                 * simulated touch apis for these versions.
                 */
                touchList = [];
                Y.each(touchPoints, function(point) {
                    if(!point.identifier) {point.identifier = 0;}
                    if(!point.clientX)  {point.clientX = 0;}
                    if(!point.clientY)  {point.clientY = 0;}
                    if(!point.pageX)    {point.pageX = 0;}
                    if(!point.pageY)    {point.pageY = 0;}
                    if(!point.screenX)  {point.screenX = 0;}
                    if(!point.screenY)  {point.screenY = 0;}

                    touchList.push({
                        target: self.target,
                        identifier: point.identifier,
                        clientX: point.clientX,
                        clientY: point.clientY,
                        pageX: point.pageX,
                        pageY: point.pageY,
                        screenX: point.screenX,
                        screenY: point.screenY
                    });
                });

                touchList.item = function(i) {
                    return touchList[i];
                };
            }
        } else {
            Y.error(NAME+': Invalid touchPoints passed');
        }

        return touchList;
    },

    /**
     * @method _simulateEvent
     * @private
     * @param {HTMLElement} target The DOM element that's the target of the event.
     * @param {String} type The type of event or name of the supported gesture to simulate
     *      (i.e., "click", "doubletap", "flick").
     * @param {Object} options (Optional) Extra options to copy onto the event object.
     *      For gestures, options are used to refine the gesture behavior.
     */
    _simulateEvent: function(target, type, options) {
        var touches;

        if (touchEvents[type]) {
            if(SUPPORTS_TOUCH) {
                Y.Event.simulate(target, type, options);
            } else {
                // simulate using mouse events if touch is not applicable on this platform.
                // but only single touch event can be simulated.
                if(this._isSingleTouch(options.touches, options.targetTouches, options.changedTouches)) {
                    type = {
                        touchstart: MOUSE_DOWN,
                        touchmove: MOUSE_MOVE,
                        touchend: MOUSE_UP
                    }[type];

                    options.button = 0;
                    options.relatedTarget = null; // since we are not using mouseover event.

                    // touchend has none in options.touches.
                    touches = (type === MOUSE_UP)? options.changedTouches : options.touches;

                    options = Y.mix(options, {
                        screenX: touches.item(0).screenX,
                        screenY: touches.item(0).screenY,
                        clientX: touches.item(0).clientX,
                        clientY: touches.item(0).clientY
                    }, true);

                    Y.Event.simulate(target, type, options);

                    if(type == MOUSE_UP) {
                        Y.Event.simulate(target, MOUSE_CLICK, options);
                    }
                } else {
                    Y.error("_simulateEvent(): Event '" + type + "' has multi touch objects that can't be simulated in your platform.");
                }
            }
        } else {
            // pass thru for all non touch events
            Y.Event.simulate(target, type, options);
        }
    },

    /**
     * Helper method to check the single touch.
     * @method _isSingleTouch
     * @private
     * @param {TouchList} touches
     * @param {TouchList} targetTouches
     * @param {TouchList} changedTouches
     */
    _isSingleTouch: function(touches, targetTouches, changedTouches) {
        return (touches && (touches.length <= 1)) &&
            (targetTouches && (targetTouches.length <= 1)) &&
            (changedTouches && (changedTouches.length <= 1));
    }
};

/*
 * A gesture simulation class.
 */
Y.GestureSimulation = Simulations;

/*
 * Various simulation default behavior properties. If user override
 * Y.GestureSimulation.defaults, overriden values will be used and this
 * should be done before the gesture simulation.
 */
Y.GestureSimulation.defaults = DEFAULTS;

/*
 * The high level gesture names that YUI knows how to simulate.
 */
Y.GestureSimulation.GESTURES = gestureNames;

/**
 * Simulates the higher user level gesture of the given name on a target.
 * This method generates a set of low level touch events(Apple specific gesture
 * events as well for the iOS platforms) asynchronously. Note that gesture
 * simulation is relying on `Y.Event.simulate()` method to generate
 * the touch events under the hood. The `Y.Event.simulate()` method
 * itself is a synchronous method.
 *
 * Users are suggested to use `Node.simulateGesture()` method which
 * basically calls this method internally. Supported gestures are `tap`,
 * `doubletap`, `press`, `move`, `flick`, `pinch` and `rotate`.
 *
 * The `pinch` gesture is used to simulate the pinching and spreading of two
 * fingers. During a pinch simulation, rotation is also possible. Essentially
 * `pinch` and `rotate` simulations share the same base implementation to allow
 * both pinching and rotation at the same time. The only difference is `pinch`
 * requires `start` and `end` option properties while `rotate` requires `rotation`
 * option property.
 *
 * The `pinch` and `rotate` gestures can be described as placing 2 fingers along a
 * circle. Pinching and spreading can be described by start and end circles while
 * rotation occurs on a single circle. If the radius of the start circle is greater
 * than the end circle, the gesture becomes a pinch, otherwise it is a spread spread.
 *
 * @example
 *
 *     var node = Y.one("#target");
 *
 *     // double tap example
 *     node.simulateGesture("doubletap", function() {
 *         // my callback function
 *     });
 *
 *     // flick example from the center of the node, move 50 pixels down for 50ms)
 *     node.simulateGesture("flick", {
 *         axis: y,
 *         distance: -100
 *         duration: 50
 *     }, function() {
 *         // my callback function
 *     });
 *
 *     // simulate rotating a node 75 degrees counter-clockwise
 *     node.simulateGesture("rotate", {
 *         rotation: -75
 *     });
 *
 *     // simulate a pinch and a rotation at the same time.
 *     // fingers start on a circle of radius 100 px, placed at top/bottom
 *     // fingers end on a circle of radius 50px, placed at right/left
 *     node.simulateGesture("pinch", {
 *         r1: 100,
 *         r2: 50,
 *         start: 0
 *         rotation: 90
 *     });
 *
 * @method simulateGesture
 * @param {HTMLElement|Node} node The YUI node or HTML element that's the target
 *      of the event.
 * @param {String} name The name of the supported gesture to simulate. The
 *      supported gesture name is one of "tap", "doubletap", "press", "move",
 *      "flick", "pinch" and "rotate".
 * @param {Object} [options] Extra options used to define the gesture behavior:
 *
 *      Valid options properties for the `tap` gesture:
 *
 *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates
 *        where the tap should be simulated. Default is the center of the node
 *        element.
 *      @param {Number} [options.hold=10] (Optional) The hold time in milliseconds.
 *        This is the time between `touchstart` and `touchend` event generation.
 *      @param {Number} [options.times=1] (Optional) Indicates the number of taps.
 *      @param {Number} [options.delay=10] (Optional) The number of milliseconds
 *        before the next tap simulation happens. This is valid only when `times`
 *        is more than 1.
 *
 *      Valid options properties for the `doubletap` gesture:
 *
 *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates
 *        where the doubletap should be simulated. Default is the center of the
 *        node element.
 *
 *      Valid options properties for the `press` gesture:
 *
 *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates
 *        where the press should be simulated. Default is the center of the node
 *        element.
 *      @param {Number} [options.hold=3000] (Optional) The hold time in milliseconds.
 *        This is the time between `touchstart` and `touchend` event generation.
 *        Default is 3000ms (3 seconds).
 *
 *      Valid options properties for the `move` gesture:
 *
 *      @param {Object} [options.path] (Optional) Indicates the path of the finger
 *        movement. It's an object with three optional properties: `point`,
 *        `xdist` and  `ydist`.
 *        @param {Array} [options.path.point] A starting point of the gesture.
 *          Default is the center of the node element.
 *        @param {Number} [options.path.xdist=200] A distance to move in pixels
 *          along the X axis. A negative distance value indicates moving left.
 *        @param {Number} [options.path.ydist=0] A distance to move in pixels
 *          along the Y axis. A negative distance value indicates moving up.
 *      @param {Number} [options.duration=1000] (Optional) The duration of the
 *        gesture in milliseconds.
 *
 *      Valid options properties for the `flick` gesture:
 *
 *      @param {Array} [options.point] (Optional) Indicates the [x, y] coordinates
 *        where the flick should be simulated. Default is the center of the
 *        node element.
 *      @param {String} [options.axis='x'] (Optional) Valid values are either
 *        "x" or "y". Indicates axis to move along. The flick can move to one of
 *        4 directions(left, right, up and down).
 *      @param {Number} [options.distance=200] (Optional) Distance to move in pixels
 *      @param {Number} [options.duration=1000] (Optional) The duration of the
 *        gesture in milliseconds. User given value could be automatically
 *        adjusted by the framework if it is below the minimum velocity to be
 *        a flick gesture.
 *
 *      Valid options properties for the `pinch` gesture:
 *
 *      @param {Array} [options.center] (Optional) The center of the circle where
 *        two fingers are placed. Default is the center of the node element.
 *      @param {Number} [options.r1] (Required) Pixel radius of the start circle
 *        where 2 fingers will be on when the gesture starts. The circles are
 *        centered at the center of the element.
 *      @param {Number} [options.r2] (Required) Pixel radius of the end circle
 *        when this gesture ends.
 *      @param {Number} [options.duration=1000] (Optional) The duration of the
 *        gesture in milliseconds.
 *      @param {Number} [options.start=0] (Optional) Starting degree of the first
 *        finger. The value is relative to the path of the north. Default is 0
 *        (i.e., 12:00 on a clock).
 *      @param {Number} [options.rotation=0] (Optional) Degrees to rotate from
 *        the starting degree. A negative value means rotation to the
 *        counter-clockwise direction.
 *
 *      Valid options properties for the `rotate` gesture:
 *
 *      @param {Array} [options.center] (Optional) The center of the circle where
 *        two fingers are placed. Default is the center of the node element.
 *      @param {Number} [options.r1] (Optional) Pixel radius of the start circle
 *        where 2 fingers will be on when the gesture starts. The circles are
 *        centered at the center of the element. Default is a fourth of the node
 *        element width or height, whichever is smaller.
 *      @param {Number} [options.r2] (Optional) Pixel radius of the end circle
 *        when this gesture ends. Default is a fourth of the node element width or
 *        height, whichever is smaller.
 *      @param {Number} [options.duration=1000] (Optional) The duration of the
 *        gesture in milliseconds.
 *      @param {Number} [options.start=0] (Optional) Starting degree of the first
 *        finger. The value is relative to the path of the north. Default is 0
 *        (i.e., 12:00 on a clock).
 *      @param {Number} [options.rotation] (Required) Degrees to rotate from
 *        the starting degree. A negative value means rotation to the
 *        counter-clockwise direction.
 *
 * @param {Function} [cb] The callback to execute when the asynchronouse gesture
 *      simulation is completed.
 *      @param {Error} cb.err An error object if the simulation is failed.
 * @for Event
 * @static
 */
Y.Event.simulateGesture = function(node, name, options, cb) {

    node = Y.one(node);

    var sim = new Y.GestureSimulation(node);
    name = name.toLowerCase();

    if(!cb && Y.Lang.isFunction(options)) {
        cb = options;
        options = {};
    }

    options = options || {};

    if (gestureNames[name]) {
        switch(name) {
            // single-touch: point gestures
            case 'tap':
                sim.tap(cb, options.point, options.times, options.hold, options.delay);
                break;
            case 'doubletap':
                sim.tap(cb, options.point, 2);
                break;
            case 'press':
                if(!Y.Lang.isNumber(options.hold)) {
                    options.hold = DEFAULTS.HOLD_PRESS;
                } else if(options.hold < DEFAULTS.MIN_HOLD_PRESS) {
                    options.hold = DEFAULTS.MIN_HOLD_PRESS;
                } else if(options.hold > DEFAULTS.MAX_HOLD_PRESS) {
                    options.hold = DEFAULTS.MAX_HOLD_PRESS;
                }
                sim.tap(cb, options.point, 1, options.hold);
                break;

            // single-touch: move gestures
            case 'move':
                sim.move(cb, options.path, options.duration);
                break;
            case 'flick':
                sim.flick(cb, options.point, options.axis, options.distance,
                    options.duration);
                break;

            // multi-touch: pinch/rotation gestures
            case 'pinch':
                sim.pinch(cb, options.center, options.r1, options.r2,
                    options.duration, options.start, options.rotation);
                break;
            case 'rotate':
                sim.rotate(cb, options.center, options.r1, options.r2,
                    options.duration, options.start, options.rotation);
                break;
        }
    } else {
        Y.error(NAME+': Not a supported gesture simulation: '+name);
    }
};


}, '3.17.2', {"requires": ["async-queue", "event-simulate", "node-screen"]});
/*
YUI 3.17.2 (build 9c3c78e)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add('node-event-simulate', function (Y, NAME) {

/**
 * Adds functionality to simulate events.
 * @module node
 * @submodule node-event-simulate
 */

/**
 * Simulates an event on the node.
 * @param {String} type The type of event (i.e., "click").
 * @param {Object} options (Optional) Extra options to copy onto the event object.
 * @for Node
 * @method simulate
 */
Y.Node.prototype.simulate = function (type, options) {

    Y.Event.simulate(Y.Node.getDOMNode(this), type, options);
};

/**
 * Simulates the higher user level gesture of the given name on this node.
 * This method generates a set of low level touch events(Apple specific gesture
 * events as well for the iOS platforms) asynchronously. Note that gesture
 * simulation is relying on `Y.Event.simulate()` method to generate
 * the touch events under the hood. The `Y.Event.simulate()` method
 * itself is a synchronous method.
 *
 * Supported gestures are `tap`, `doubletap`, `press`, `move`, `flick`, `pinch`
 * and `rotate`.
 *
 * The `pinch` gesture is used to simulate the pinching and spreading of two
 * fingers. During a pinch simulation, rotation is also possible. Essentially
 * `pinch` and `rotate` simulations share the same base implementation to allow
 * both pinching and rotation at the same time. The only difference is `pinch`
 * requires `start` and `end` option properties while `rotate` requires `rotation`
 * option property.
 *
 * The `pinch` and `rotate` gestures can be described as placing 2 fingers along a
 * circle. Pinching and spreading can be described by start and end circles while
 * rotation occurs on a single circle. If the radius of the start circle is greater
 * than the end circle, the gesture becomes a pinch, otherwise it is a spread spread.
 *
 * @example
 *
 *     var node = Y.one("#target");
 *
 *     // double tap example
 *     node.simulateGesture("doubletap", function() {
 *         // my callback function
 *     });
 *
 *     // flick example from the center of the node, move 50 pixels down for 50ms)
 *     node.simulateGesture("flick", {
 *         axis: y,
 *         distance: -100
 *         duration: 50
 *     }, function() {
 *         // my callback function
 *     });
 *
 *     // simulate rotating a node 75 degrees counter-clockwise
 *     node.simulateGesture("rotate", {
 *         rotation: -75
 *     });
 *
 *     // simulate a pinch and a rotation at the same time.
 *     // fingers start on a circle of radius 100 px, placed at top/bottom
 *     // fingers end on a circle of radius 50px, placed at right/left
 *     node.simulateGesture("pinch", {
 *         r1: 100,
 *         r2: 50,
 *         start: 0
 *         rotation: 90
 *     });
 *
 * @method simulateGesture
 * @param {String} name The name of the supported gesture to simulate. The
 *      supported gesture name is one of "tap", "doubletap", "press", "move",
 *      "flick", "pinch" and "rotate".
 * @param {Object} [options] Extra options used to define the gesture behavior:
 *
 *      Valid options properties for the `tap` gesture:
 *
 *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates
 *        where the tap should be simulated. Default is the center of the node
 *        element.
 *      @param {Number} [options.hold=10] (Optional) The hold time in milliseconds.
 *        This is the time between `touchstart` and `touchend` event generation.
 *      @param {Number} [options.times=1] (Optional) Indicates the number of taps.
 *      @param {Number} [options.delay=10] (Optional) The number of milliseconds
 *        before the next tap simulation happens. This is valid only when `times`
 *        is more than 1.
 *
 *      Valid options properties for the `doubletap` gesture:
 *
 *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates
 *        where the doubletap should be simulated. Default is the center of the
 *        node element.
 *
 *      Valid options properties for the `press` gesture:
 *
 *      @param {Array} [options.point] (Optional) Indicates the [x,y] coordinates
 *        where the press should be simulated. Default is the center of the node
 *        element.
 *      @param {Number} [options.hold=3000] (Optional) The hold time in milliseconds.
 *        This is the time between `touchstart` and `touchend` event generation.
 *        Default is 3000ms (3 seconds).
 *
 *      Valid options properties for the `move` gesture:
 *
 *      @param {Object} [options.path] (Optional) Indicates the path of the finger
 *        movement. It's an object with three optional properties: `point`,
 *        `xdist` and  `ydist`.
 *        @param {Array} [options.path.point] A starting point of the gesture.
 *          Default is the center of the node element.
 *        @param {Number} [options.path.xdist=200] A distance to move in pixels
 *          along the X axis. A negative distance value indicates moving left.
 *        @param {Number} [options.path.ydist=0] A distance to move in pixels
 *          along the Y axis. A negative distance value indicates moving up.
 *      @param {Number} [options.duration=1000] (Optional) The duration of the
 *        gesture in milliseconds.
 *
 *      Valid options properties for the `flick` gesture:
 *
 *      @param {Array} [options.point] (Optional) Indicates the [x, y] coordinates
 *        where the flick should be simulated. Default is the center of the
 *        node element.
 *      @param {String} [options.axis='x'] (Optional) Valid values are either
 *        "x" or "y". Indicates axis to move along. The flick can move to one of
 *        4 directions(left, right, up and down).
 *      @param {Number} [options.distance=200] (Optional) Distance to move in pixels
 *      @param {Number} [options.duration=1000] (Optional) The duration of the
 *        gesture in milliseconds. User given value could be automatically
 *        adjusted by the framework if it is below the minimum velocity to be
 *        a flick gesture.
 *
 *      Valid options properties for the `pinch` gesture:
 *
 *      @param {Array} [options.center] (Optional) The center of the circle where
 *        two fingers are placed. Default is the center of the node element.
 *      @param {Number} [options.r1] (Required) Pixel radius of the start circle
 *        where 2 fingers will be on when the gesture starts. The circles are
 *        centered at the center of the element.
 *      @param {Number} [options.r2] (Required) Pixel radius of the end circle
 *        when this gesture ends.
 *      @param {Number} [options.duration=1000] (Optional) The duration of the
 *        gesture in milliseconds.
 *      @param {Number} [options.start=0] (Optional) Starting degree of the first
 *        finger. The value is relative to the path of the north. Default is 0
 *        (i.e., 12:00 on a clock).
 *      @param {Number} [options.rotation=0] (Optional) Degrees to rotate from
 *        the starting degree. A negative value means rotation to the
 *        counter-clockwise direction.
 *
 *      Valid options properties for the `rotate` gesture:
 *
 *      @param {Array} [options.center] (Optional) The center of the circle where
 *        two fingers are placed. Default is the center of the node element.
 *      @param {Number} [options.r1] (Optional) Pixel radius of the start circle
 *        where 2 fingers will be on when the gesture starts. The circles are
 *        centered at the center of the element. Default is a fourth of the node
 *        element width or height, whichever is smaller.
 *      @param {Number} [options.r2] (Optional) Pixel radius of the end circle
 *        when this gesture ends. Default is a fourth of the node element width or
 *        height, whichever is smaller.
 *      @param {Number} [options.duration=1000] (Optional) The duration of the
 *        gesture in milliseconds.
 *      @param {Number} [options.start=0] (Optional) Starting degree of the first
 *        finger. The value is relative to the path of the north. Default is 0
 *        (i.e., 12:00 on a clock).
 *      @param {Number} [options.rotation] (Required) Degrees to rotate from
 *        the starting degree. A negative value means rotation to the
 *        counter-clockwise direction.
 *
 * @param {Function} [cb] The callback to execute when the asynchronouse gesture
 *      simulation is completed.
 *      @param {Error} cb.err An error object if the simulation is failed.
 * @for Node
 */
Y.Node.prototype.simulateGesture = function (name, options, cb) {

    Y.Event.simulateGesture(this, name, options, cb);
};


}, '3.17.2', {"requires": ["node-base", "event-simulate", "gesture-simulate"]});
/*
YUI 3.17.2 (build 9c3c78e)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add('node-focusmanager', function (Y, NAME) {

/**
* <p>The Focus Manager Node Plugin makes it easy to manage focus among
* a Node's descendants.  Primarily intended to help with widget development,
* the Focus Manager Node Plugin can be used to improve the keyboard
* accessibility of widgets.</p>
*
* <p>
* When designing widgets that manage a set of descendant controls (i.e. buttons
* in a toolbar, tabs in a tablist, menuitems in a menu, etc.) it is important to
* limit the number of descendants in the browser's default tab flow.  The fewer
* number of descendants in the default tab flow, the easier it is for keyboard
* users to navigate between widgets by pressing the tab key.  When a widget has
* focus it should provide a set of shortcut keys (typically the arrow keys)
* to move focus among its descendants.
* </p>
*
* <p>
* To this end, the Focus Manager Node Plugin makes it easy to define a Node's
* focusable descendants, define which descendant should be in the default tab
* flow, and define the keys that move focus among each descendant.
* Additionally, as the CSS
* <a href="http://www.w3.org/TR/CSS21/selector.html#x38"><code>:focus</code></a>
* pseudo class is not supported on all elements in all
* <a href="http://developer.yahoo.com/yui/articles/gbs/">A-Grade browsers</a>,
* the Focus Manager Node Plugin provides an easy, cross-browser means of
* styling focus.
* </p>
*

DEPRECATED: The FocusManager Node Plugin has been deprecated as of YUI 3.9.0. This module will be removed from the library in a future version. If you require functionality similar to the one provided by this  module, consider taking a look at the various modules in the YUI Gallery <http://yuilibrary.com/gallery/>.

* @module node-focusmanager
* @deprecated 3.9.0
*/

	//	Frequently used strings

var ACTIVE_DESCENDANT = "activeDescendant",
	ID = "id",
	DISABLED = "disabled",
	TAB_INDEX = "tabIndex",
	FOCUSED = "focused",
	FOCUS_CLASS = "focusClass",
	CIRCULAR = "circular",
	UI = "UI",
	KEY = "key",
	ACTIVE_DESCENDANT_CHANGE = ACTIVE_DESCENDANT + "Change",
	HOST = "host",

	//	Collection of keys that, when pressed, cause the browser viewport
	//	to scroll.
	scrollKeys = {
		37: true,
		38: true,
		39: true,
		40: true
	},

	clickableElements = {
		"a": true,
		"button": true,
		"input": true,
		"object": true
	},

	//	Library shortcuts

	Lang = Y.Lang,
 	UA = Y.UA,

	/**
	* The NodeFocusManager class is a plugin for a Node instance.  The class is used
	* via the <a href="Node.html#method_plug"><code>plug</code></a> method of Node
	* and should not be instantiated directly.
	* @namespace plugin
	* @class NodeFocusManager
	*/
	NodeFocusManager = function () {

		NodeFocusManager.superclass.constructor.apply(this, arguments);

	};


NodeFocusManager.ATTRS = {

	/**
	* Boolean indicating that one of the descendants is focused.
	*
	* @attribute focused
	* @readOnly
	* @default false
	* @type boolean
	*/
	focused: {

		value: false,
		readOnly: true

	},


	/**
	* String representing the CSS selector used to define the descendant Nodes
	* whose focus should be managed.
	*
	* @attribute descendants
	* @type Y.NodeList
	*/
	descendants: {

		getter: function (value) {

			return this.get(HOST).all(value);

		}

	},


	/**
	* <p>Node, or index of the Node, representing the descendant that is either
	* focused or is focusable (<code>tabIndex</code> attribute is set to 0).
	* The value cannot represent a disabled descendant Node.  Use a value of -1
	* to remove all descendant Nodes from the default tab flow.
	* If no value is specified, the active descendant will be inferred using
	* the following criteria:</p>
	* <ol>
	* <li>Examining the <code>tabIndex</code> attribute of each descendant and
	* using the first descendant whose <code>tabIndex</code> attribute is set
	* to 0</li>
	* <li>If no default can be inferred then the value is set to either 0 or
	* the index of the first enabled descendant.</li>
	* </ol>
	*
	* @attribute activeDescendant
	* @type Number
	*/
	activeDescendant: {

		setter: function (value) {

			var isNumber = Lang.isNumber,
				INVALID_VALUE = Y.Attribute.INVALID_VALUE,
				descendantsMap = this._descendantsMap,
				descendants = this._descendants,
				nodeIndex,
				returnValue,
				oNode;


			if (isNumber(value)) {
				nodeIndex = value;
				returnValue = nodeIndex;
			}
			else if ((value instanceof Y.Node) && descendantsMap) {

				nodeIndex = descendantsMap[value.get(ID)];

				if (isNumber(nodeIndex)) {
					returnValue = nodeIndex;
				}
				else {

					//	The user passed a reference to a Node that wasn't one
					//	of the descendants.
					returnValue = INVALID_VALUE;

				}

			}
			else {
				returnValue = INVALID_VALUE;
			}


			if (descendants) {

				oNode = descendants.item(nodeIndex);

				if (oNode && oNode.get("disabled")) {

					//	Setting the "activeDescendant" attribute to the index
					//	of a disabled descendant is invalid.
					returnValue = INVALID_VALUE;

				}

			}


			return returnValue;

		}

	},


	/**
	* Object literal representing the keys to be used to navigate between the
	* next/previous descendant.  The format for the attribute's value is
	* <code>{ next: "down:40", previous: "down:38" }</code>.  The value for the
	* "next" and "previous" properties are used to attach
	* <a href="event/#keylistener"><code>key</code></a> event listeners. See
	* the <a href="event/#keylistener">Using the key Event</a> section of
	* the Event documentation for more information on "key" event listeners.
	*
	* @attribute keys
	* @type Object
	*/
	keys: {

		value: {

			next: null,
			previous: null

		}


	},


	/**
	* String representing the name of class applied to the focused active
	* descendant Node.  Can also be an object literal used to define both the
	* class name, and the Node to which the class should be applied.  If using
	* an object literal, the format is:
	* <code>{ className: "focus", fn: myFunction }</code>.  The function
	* referenced by the <code>fn</code> property in the object literal will be
	* passed a reference to the currently focused active descendant Node.
	*
	* @attribute focusClass
	* @type String|Object
	*/
	focusClass: { },


	/**
	* Boolean indicating if focus should be set to the first/last descendant
	* when the end or beginning of the descendants has been reached.
	*
	* @attribute circular
	* @type Boolean
	* @default true
	*/
	circular: {
		value: true
	}

};

Y.extend(NodeFocusManager, Y.Plugin.Base, {

	//	Protected properties

	//	Boolean indicating if the NodeFocusManager is active.
	_stopped: true,

	//	NodeList representing the descendants selected via the
	//	"descendants" attribute.
	_descendants: null,

	//	Object literal mapping the IDs of each descendant to its index in the
	//	"_descendants" NodeList.
	_descendantsMap: null,

	//	Reference to the Node instance to which the focused class (defined
	//	by the "focusClass" attribute) is currently applied.
	_focusedNode: null,

	//	Number representing the index of the last descendant Node.
	_lastNodeIndex: 0,

	//	Array of handles for event handlers used for a NodeFocusManager instance.
	_eventHandlers: null,



	//	Protected methods

	/**
	* @method _initDescendants
	* @description Sets the <code>tabIndex</code> attribute of all of the
	* descendants to -1, except the active descendant, whose
	* <code>tabIndex</code> attribute is set to 0.
	* @protected
	*/
	_initDescendants: function () {

		var descendants = this.get("descendants"),
			descendantsMap = {},
			nFirstEnabled = -1,
			nDescendants,
			nActiveDescendant = this.get(ACTIVE_DESCENDANT),
			oNode,
			sID,
			i = 0;



		if (Lang.isUndefined(nActiveDescendant)) {
			nActiveDescendant = -1;
		}


		if (descendants) {

			nDescendants = descendants.size();


            for (i = 0; i < nDescendants; i++) {

                oNode = descendants.item(i);

                if (nFirstEnabled === -1 && !oNode.get(DISABLED)) {
                    nFirstEnabled = i;
                }


                //	If the user didn't specify a value for the
                //	"activeDescendant" attribute try to infer it from
                //	the markup.

                //	Need to pass "2" when using "getAttribute" for IE to get
                //	the attribute value as it is set in the markup.
                //	Need to use "parseInt" because IE always returns the
                //	value as a number, whereas all other browsers return
                //	the attribute as a string when accessed
                //	via "getAttribute".

                if (nActiveDescendant < 0 &&
                        parseInt(oNode.getAttribute(TAB_INDEX, 2), 10) === 0) {

                    nActiveDescendant = i;

                }

                if (oNode) {
                    oNode.set(TAB_INDEX, -1);
                }

                sID = oNode.get(ID);

                if (!sID) {
                    sID = Y.guid();
                    oNode.set(ID, sID);
                }

                descendantsMap[sID] = i;

            }


            //	If the user didn't specify a value for the
            //	"activeDescendant" attribute and no default value could be
            //	determined from the markup, then default to 0.

            if (nActiveDescendant < 0) {
                nActiveDescendant = 0;
            }


            oNode = descendants.item(nActiveDescendant);

            //	Check to make sure the active descendant isn't disabled,
            //	and fall back to the first enabled descendant if it is.

            if (!oNode || oNode.get(DISABLED)) {
                oNode = descendants.item(nFirstEnabled);
                nActiveDescendant = nFirstEnabled;
            }

            this._lastNodeIndex = nDescendants - 1;
            this._descendants = descendants;
            this._descendantsMap = descendantsMap;

            this.set(ACTIVE_DESCENDANT, nActiveDescendant);

            //	Need to set the "tabIndex" attribute here, since the
            //	"activeDescendantChange" event handler used to manage
            //	the setting of the "tabIndex" attribute isn't wired up yet.

            if (oNode) {
                oNode.set(TAB_INDEX, 0);
            }

		}

	},


	/**
	* @method _isDescendant
	* @description Determines if the specified Node instance is a descendant
	* managed by the Focus Manager.
	* @param node {Node} Node instance to be checked.
	* @return {Boolean} Boolean indicating if the specified Node instance is a
	* descendant managed by the Focus Manager.
	* @protected
	*/
	_isDescendant: function (node) {

		return (node.get(ID) in this._descendantsMap);

	},


	/**
	* @method _removeFocusClass
	* @description Removes the class name representing focus (as specified by
	* the "focusClass" attribute) from the Node instance to which it is
	* currently applied.
	* @protected
	*/
	_removeFocusClass: function () {

		var oFocusedNode = this._focusedNode,
			focusClass = this.get(FOCUS_CLASS),
			sClassName;

		if (focusClass) {
			sClassName = Lang.isString(focusClass) ?
				focusClass : focusClass.className;
		}

		if (oFocusedNode && sClassName) {
			oFocusedNode.removeClass(sClassName);
		}

	},


	/**
	* @method _detachKeyHandler
	* @description Detaches the "key" event handlers used to support the "keys"
	* attribute.
	* @protected
	*/
	_detachKeyHandler: function () {

		var prevKeyHandler = this._prevKeyHandler,
			nextKeyHandler = this._nextKeyHandler;

		if (prevKeyHandler) {
			prevKeyHandler.detach();
		}

		if (nextKeyHandler) {
			nextKeyHandler.detach();
		}

	},


	/**
	* @method _preventScroll
	* @description Prevents the viewport from scolling when the user presses
	* the up, down, left, or right key.
	* @protected
	*/
	_preventScroll: function (event) {

		if (scrollKeys[event.keyCode] && this._isDescendant(event.target)) {
			event.preventDefault();
		}

	},


	/**
	* @method _fireClick
	* @description Fires the click event if the enter key is pressed while
	* focused on an HTML element that is not natively clickable.
	* @protected
	*/
	_fireClick: function (event) {

		var oTarget = event.target,
			sNodeName = oTarget.get("nodeName").toLowerCase();

		if (event.keyCode === 13 && (!clickableElements[sNodeName] ||
				(sNodeName === "a" && !oTarget.getAttribute("href")))) {


			oTarget.simulate("click");

		}

	},


	/**
	* @method _attachKeyHandler
	* @description Attaches the "key" event handlers used to support the "keys"
	* attribute.
	* @protected
	*/
	_attachKeyHandler: function () {

		this._detachKeyHandler();

		var sNextKey = this.get("keys.next"),
			sPrevKey = this.get("keys.previous"),
			oNode = this.get(HOST),
			aHandlers = this._eventHandlers;

		if (sPrevKey) {
 			this._prevKeyHandler =
				Y.on(KEY, Y.bind(this._focusPrevious, this), oNode, sPrevKey);
		}

		if (sNextKey) {
 			this._nextKeyHandler =
				Y.on(KEY, Y.bind(this._focusNext, this), oNode, sNextKey);
		}


		//	In Opera it is necessary to call the "preventDefault" method in
		//	response to the user pressing the arrow keys in order to prevent
		//	the viewport from scrolling when the user is moving focus among
		//	the focusable descendants.

		if (UA.opera) {
			aHandlers.push(oNode.on("keypress", this._preventScroll, this));
		}


		//	For all browsers except Opera: HTML elements that are not natively
		//	focusable but made focusable via the tabIndex attribute don't
		//	fire a click event when the user presses the enter key.  It is
		//	possible to work around this problem by simplying dispatching a
		//	click event in response to the user pressing the enter key.

		if (!UA.opera) {
			aHandlers.push(oNode.on("keypress", this._fireClick, this));
		}

	},


	/**
	* @method _detachEventHandlers
	* @description Detaches all event handlers used by the Focus Manager.
	* @protected
	*/
	_detachEventHandlers: function () {

		this._detachKeyHandler();

		var aHandlers = this._eventHandlers;

		if (aHandlers) {

			Y.Array.each(aHandlers, function (handle) {
				handle.detach();
			});

			this._eventHandlers = null;

		}

	},


	/**
	* @method _detachEventHandlers
	* @description Attaches all event handlers used by the Focus Manager.
	* @protected
	*/
	_attachEventHandlers: function () {

		var descendants = this._descendants,
			aHandlers,
			oDocument,
			handle;

		if (descendants && descendants.size()) {

			aHandlers = this._eventHandlers || [];
			oDocument = this.get(HOST).get("ownerDocument");


			if (aHandlers.length === 0) {


				aHandlers.push(oDocument.on("focus", this._onDocFocus, this));

				aHandlers.push(oDocument.on("mousedown",
					this._onDocMouseDown, this));

				aHandlers.push(
						this.after("keysChange", this._attachKeyHandler));

				aHandlers.push(
						this.after("descendantsChange", this._initDescendants));

				aHandlers.push(
						this.after(ACTIVE_DESCENDANT_CHANGE,
								this._afterActiveDescendantChange));


				//	For performance: defer attaching all key-related event
				//	handlers until the first time one of the specified
				//	descendants receives focus.

				handle = this.after("focusedChange", Y.bind(function (event) {

					if (event.newVal) {


						this._attachKeyHandler();

						//	Detach this "focusedChange" handler so that the
						//	key-related handlers only get attached once.

						handle.detach();

					}

				}, this));

				aHandlers.push(handle);

			}


			this._eventHandlers = aHandlers;

		}

	},


	//	Protected event handlers

	/**
	* @method _onDocMouseDown
	* @description "mousedown" event handler for the owner document of the
	* Focus Manager's Node.
	* @protected
	* @param event {Object} Object representing the DOM event.
	*/
	_onDocMouseDown: function (event) {

		var oHost = this.get(HOST),
			oTarget = event.target,
			bChildNode = oHost.contains(oTarget),
			node,

			getFocusable = function (node) {

				var returnVal = false;

				if (!node.compareTo(oHost)) {

					returnVal = this._isDescendant(node) ? node :
									getFocusable.call(this, node.get("parentNode"));

				}

				return returnVal;

			};


		if (bChildNode) {

			//	Check to make sure that the target isn't a child node of one
			//	of the focusable descendants.

			node = getFocusable.call(this, oTarget);

			if (node) {
				oTarget = node;
			}
			else if (!node && this.get(FOCUSED)) {

				//	The target was a non-focusable descendant of the root
				//	node, so the "focused" attribute should be set to false.

	 			this._set(FOCUSED, false);
	 			this._onDocFocus(event);

			}

		}


		if (bChildNode && this._isDescendant(oTarget)) {

			//	Fix general problem in Webkit: mousing down on a button or an
			//	anchor element doesn't focus it.

			//	For all browsers: makes sure that the descendant that
			//	was the target of the mousedown event is now considered the
			//	active descendant.

			this.focus(oTarget);
		}
		else if (UA.webkit && this.get(FOCUSED) &&
			(!bChildNode || (bChildNode && !this._isDescendant(oTarget)))) {

			//	Fix for Webkit:

			//	Document doesn't receive focus in Webkit when the user mouses
			//	down on it, so the "focused" attribute won't get set to the
			//	correct value.

			//	The goal is to force a blur if the user moused down on
			//	either: 1) A descendant node, but not one that managed by
			//	the FocusManager, or 2) an element outside of the
			//	FocusManager

 			this._set(FOCUSED, false);
 			this._onDocFocus(event);

		}

	},


	/**
	* @method _onDocFocus
	* @description "focus" event handler for the owner document of the
	* Focus Manager's Node.
	* @protected
	* @param event {Object} Object representing the DOM event.
	*/
	_onDocFocus: function (event) {

		var oTarget = this._focusTarget || event.target,
			bFocused = this.get(FOCUSED),
			focusClass = this.get(FOCUS_CLASS),
			oFocusedNode = this._focusedNode,
			bInCollection;

		if (this._focusTarget) {
			this._focusTarget = null;
		}


		if (this.get(HOST).contains(oTarget)) {

			//	The target is a descendant of the root Node.

			bInCollection = this._isDescendant(oTarget);

			if (!bFocused && bInCollection) {

				//	The user has focused a focusable descendant.

				bFocused = true;

			}
			else if (bFocused && !bInCollection) {

				//	The user has focused a child of the root Node that is
				//	not one of the descendants managed by this Focus Manager
				//	so clear the currently focused descendant.

				bFocused = false;

			}

		}
		else {

			// The target is some other node in the document.

			bFocused = false;

		}


		if (focusClass) {

			if (oFocusedNode && (!oFocusedNode.compareTo(oTarget) || !bFocused)) {
				this._removeFocusClass();
			}

			if (bInCollection && bFocused) {

				if (focusClass.fn) {
					oTarget = focusClass.fn(oTarget);
					oTarget.addClass(focusClass.className);
				}
				else {
					oTarget.addClass(focusClass);
				}

				this._focusedNode = oTarget;

			}

		}


		this._set(FOCUSED, bFocused);

	},


	/**
	* @method _focusNext
	* @description Keydown event handler that moves focus to the next
	* enabled descendant.
	* @protected
	* @param event {Object} Object representing the DOM event.
	* @param activeDescendant {Number} Number representing the index of the
	* next descendant to be focused
	*/
	_focusNext: function (event, activeDescendant) {

		var nActiveDescendant = activeDescendant || this.get(ACTIVE_DESCENDANT),
			oNode;


		if (this._isDescendant(event.target) &&
			(nActiveDescendant <= this._lastNodeIndex)) {

			nActiveDescendant = nActiveDescendant + 1;

			if (nActiveDescendant === (this._lastNodeIndex + 1) &&
				this.get(CIRCULAR)) {

				nActiveDescendant = 0;

			}

			oNode = this._descendants.item(nActiveDescendant);

            if (oNode) {

                if (oNode.get("disabled")) {
                    this._focusNext(event, nActiveDescendant);
                }
                else {
                    this.focus(nActiveDescendant);
                }

            }

		}

		this._preventScroll(event);

	},


	/**
	* @method _focusPrevious
	* @description Keydown event handler that moves focus to the previous
	* enabled descendant.
	* @protected
	* @param event {Object} Object representing the DOM event.
	* @param activeDescendant {Number} Number representing the index of the
	* next descendant to be focused.
	*/
	_focusPrevious: function (event, activeDescendant) {

		var nActiveDescendant = activeDescendant || this.get(ACTIVE_DESCENDANT),
			oNode;

		if (this._isDescendant(event.target) && nActiveDescendant >= 0) {

			nActiveDescendant = nActiveDescendant - 1;

			if (nActiveDescendant === -1 && this.get(CIRCULAR)) {
				nActiveDescendant = this._lastNodeIndex;
			}

            oNode = this._descendants.item(nActiveDescendant);

            if (oNode) {

                if (oNode.get("disabled")) {
                    this._focusPrevious(event, nActiveDescendant);
                }
                else {
                    this.focus(nActiveDescendant);
                }

            }

		}

		this._preventScroll(event);

	},


	/**
	* @method _afterActiveDescendantChange
	* @description afterChange event handler for the
	* "activeDescendant" attribute.
	* @protected
	* @param event {Object} Object representing the change event.
	*/
	_afterActiveDescendantChange: function (event) {

		var oNode = this._descendants.item(event.prevVal);

		if (oNode) {
			oNode.set(TAB_INDEX, -1);
		}

		oNode = this._descendants.item(event.newVal);

		if (oNode) {
			oNode.set(TAB_INDEX, 0);
		}

	},



	//	Public methods

    initializer: function (config) {
		this.start();

    },

	destructor: function () {

		this.stop();
		this.get(HOST).focusManager = null;

    },


	/**
	* @method focus
	* @description Focuses the active descendant and sets the
	* <code>focused</code> attribute to true.
	* @param index {Number|Node} Optional. Number representing the index of the
	* descendant to be set as the active descendant or Node instance
	* representing the descendant to be set as the active descendant.
	*/
	focus: function (index) {

		if (Lang.isUndefined(index)) {
			index = this.get(ACTIVE_DESCENDANT);
		}

		this.set(ACTIVE_DESCENDANT, index, { src: UI });

		var oNode = this._descendants.item(this.get(ACTIVE_DESCENDANT));

		if (oNode) {

			oNode.focus();

			//	In Opera focusing a <BUTTON> element programmatically
			//	will result in the document-level focus event handler
			//	"_onDocFocus" being called, resulting in the handler
			//	incorrectly setting the "focused" Attribute to false.  To fix
			//	this, set a flag ("_focusTarget") that the "_onDocFocus" method
			//	can look for to properly handle this edge case.

			if (UA.opera && oNode.get("nodeName").toLowerCase() === "button") {
				this._focusTarget = oNode;
			}

		}

	},


	/**
	* @method blur
	* @description Blurs the current active descendant and sets the
	* <code>focused</code> attribute to false.
	*/
	blur: function () {

		var oNode;

		if (this.get(FOCUSED)) {

			oNode = this._descendants.item(this.get(ACTIVE_DESCENDANT));

			if (oNode) {

				oNode.blur();

				//	For Opera and Webkit:  Blurring an element in either browser
				//	doesn't result in another element (such as the document)
				//	being focused.  Therefore, the "_onDocFocus" method
				//	responsible for managing the application and removal of the
				//	focus indicator class name is never called.

				this._removeFocusClass();

			}

			this._set(FOCUSED, false, { src: UI });
		}

	},


	/**
	* @method start
	* @description Enables the Focus Manager.
	*/
	start: function () {

		if (this._stopped) {

			this._initDescendants();
			this._attachEventHandlers();

			this._stopped = false;

		}

	},


	/**
	* @method stop
	* @description Disables the Focus Manager by detaching all event handlers.
	*/
	stop: function () {

		if (!this._stopped) {

			this._detachEventHandlers();

			this._descendants = null;
			this._focusedNode = null;
			this._lastNodeIndex = 0;
			this._stopped = true;

		}

	},


	/**
	* @method refresh
	* @description Refreshes the Focus Manager's descendants by re-executing the
	* CSS selector query specified by the <code>descendants</code> attribute.
	*/
	refresh: function () {

		this._initDescendants();

		if (!this._eventHandlers) {
			this._attachEventHandlers();
		}

	}

});


NodeFocusManager.NAME = "nodeFocusManager";
NodeFocusManager.NS = "focusManager";

Y.namespace("Plugin");
Y.Plugin.NodeFocusManager = NodeFocusManager;


}, '3.17.2', {"requires": ["attribute", "node", "plugin", "node-event-simulate", "event-key", "event-focus"]});
/*
YUI 3.17.2 (build 9c3c78e)
Copyright 2014 Yahoo! Inc. All rights reserved.
Licensed under the BSD License.
http://yuilibrary.com/license/
*/

YUI.add('node-menunav', function (Y, NAME) {

/**
* <p>The MenuNav Node Plugin makes it easy to transform existing list-based
* markup into traditional, drop down navigational menus that are both accessible
* and easy to customize, and only require a small set of dependencies.</p>
*
*
* <p>To use the MenuNav Node Plugin, simply pass a reference to the plugin to a
* Node instance's <code>plug</code> method.</p>
*
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
* 		//	Call the "use" method, passing in "node-menunav".  This will <br>
* 		//	load the script and CSS for the MenuNav Node Plugin and all of <br>
* 		//	the required dependencies. <br>
* <br>
* 		YUI().use("node-menunav", function(Y) { <br>
* <br>
* 			//	Use the "contentready" event to initialize the menu when <br>
* 			//	the subtree of element representing the root menu <br>
* 			//	(&#60;div id="menu-1"&#62;) is ready to be scripted. <br>
* <br>
* 			Y.on("contentready", function () { <br>
* <br>
* 				//	The scope of the callback will be a Node instance <br>
* 				//	representing the root menu (&#60;div id="menu-1"&#62;). <br>
* 				//	Therefore, since "this" represents a Node instance, it <br>
* 				//	is possible to just call "this.plug" passing in a <br>
*				//	reference to the MenuNav Node Plugin. <br>
* <br>
* 				this.plug(Y.Plugin.NodeMenuNav); <br>
* <br>
* 			}, "#menu-1"); <br>
* <br>
* 		}); <br>
* <br>
* 	&#60;/script&#62; <br>
* </code>
* </p>
*
* <p>The MenuNav Node Plugin has several configuration properties that can be
* set via an object literal that is passed as a second argument to a Node
* instance's <code>plug</code> method.
* </p>
*
* <p>
* <code>
* &#60;script type="text/javascript"&#62; <br>
* <br>
* 		//	Call the "use" method, passing in "node-menunav".  This will <br>
* 		//	load the script and CSS for the MenuNav Node Plugin and all of <br>
* 		//	the required dependencies. <br>
* <br>
* 		YUI().use("node-menunav", function(Y) { <br>
* <br>
* 			//	Use the "contentready" event to initialize the menu when <br>
* 			//	the subtree of element representing the root menu <br>
* 			//	(&#60;div id="menu-1"&#62;) is ready to be scripted. <br>
* <br>
* 			Y.on("contentready", function () { <br>
* <br>
* 				//	The scope of the callback will be a Node instance <br>
* 				//	representing the root menu (&#60;div id="menu-1"&#62;). <br>
* 				//	Therefore, since "this" represents a Node instance, it <br>
* 				//	is possible to just call "this.plug" passing in a <br>
*				//	reference to the MenuNav Node Plugin. <br>
* <br>
* 				this.plug(Y.Plugin.NodeMenuNav, { mouseOutHideDelay: 1000 });
* <br><br>
* 			}, "#menu-1"); <br>
* <br>
* 		}); <br>
* <br>
* 	&#60;/script&#62; <br>
* </code>
* </p>
*
DEPRECATED. The MenuNav Node Plugin has been deprecated as of YUI 3.9.0. This module will be removed from the library in a future version. If you require functionality similar to the one provided by this module, consider taking a look at the various modules in the YUI Gallery <http://yuilibrary.com/gallery/>.

@module node-menunav
@deprecated 3.9.0
*/


	//	Util shortcuts

var UA = Y.UA,
	later = Y.later,
	getClassName = Y.ClassNameManager.getClassName,



	//	Frequently used strings

	MENU = "menu",
	MENUITEM = "menuitem",
	HIDDEN = "hidden",
	PARENT_NODE = "parentNode",
	CHILDREN = "children",
	OFFSET_HEIGHT = "offsetHeight",
	OFFSET_WIDTH = "offsetWidth",
	PX = "px",
	ID = "id",
	PERIOD = ".",
	HANDLED_MOUSEOUT = "handledMouseOut",
	HANDLED_MOUSEOVER = "handledMouseOver",
	ACTIVE = "active",
	LABEL = "label",
	LOWERCASE_A = "a",
	MOUSEDOWN = "mousedown",
	KEYDOWN = "keydown",
	CLICK = "click",
	EMPTY_STRING = "",
	FIRST_OF_TYPE = "first-of-type",
	ROLE = "role",
	PRESENTATION = "presentation",
	DESCENDANTS = "descendants",
	UI = "UI",
	ACTIVE_DESCENDANT = "activeDescendant",
	USE_ARIA = "useARIA",
	ARIA_HIDDEN = "aria-hidden",
	CONTENT = "content",
	HOST = "host",
	ACTIVE_DESCENDANT_CHANGE = ACTIVE_DESCENDANT + "Change",


	//	Attribute keys

	AUTO_SUBMENU_DISPLAY = "autoSubmenuDisplay",
	MOUSEOUT_HIDE_DELAY = "mouseOutHideDelay",


	//	CSS class names

	CSS_MENU = getClassName(MENU),
	CSS_MENU_HIDDEN = getClassName(MENU, HIDDEN),
	CSS_MENU_HORIZONTAL = getClassName(MENU, "horizontal"),
	CSS_MENU_LABEL = getClassName(MENU, LABEL),
	CSS_MENU_LABEL_ACTIVE = getClassName(MENU, LABEL, ACTIVE),
	CSS_MENU_LABEL_MENUVISIBLE = getClassName(MENU, LABEL, (MENU + "visible")),
	CSS_MENUITEM = getClassName(MENUITEM),
	CSS_MENUITEM_ACTIVE = getClassName(MENUITEM, ACTIVE),


	//	CSS selectors

	MENU_SELECTOR = PERIOD + CSS_MENU,
	MENU_TOGGLE_SELECTOR = (PERIOD + getClassName(MENU, "toggle")),
    MENU_CONTENT_SELECTOR = PERIOD + getClassName(MENU, CONTENT),
    MENU_LABEL_SELECTOR = PERIOD + CSS_MENU_LABEL,

	STANDARD_QUERY = ">" + MENU_CONTENT_SELECTOR + ">ul>li>a",
	EXTENDED_QUERY = ">" + MENU_CONTENT_SELECTOR + ">ul>li>" + MENU_LABEL_SELECTOR + ">a:first-child";

//	Utility functions


var getPreviousSibling = function (node) {

	var oPrevious = node.previous(),
		oChildren;

	if (!oPrevious) {
		oChildren = node.get(PARENT_NODE).get(CHILDREN);
		oPrevious = oChildren.item(oChildren.size() - 1);
	}


	return oPrevious;

};


var getNextSibling = function (node) {

	var oNext = node.next();

	if (!oNext) {
		oNext = node.get(PARENT_NODE).get(CHILDREN).item(0);
	}

	return oNext;

};


var isAnchor = function (node) {

	var bReturnVal = false;

	if (node) {
		bReturnVal = node.get("nodeName").toLowerCase() === LOWERCASE_A;
	}

	return bReturnVal;

};


var isMenuItem = function (node) {

	return node.hasClass(CSS_MENUITEM);

};


var isMenuLabel = function (node) {

	return node.hasClass(CSS_MENU_LABEL);

};


var isHorizontalMenu = function (menu) {

	return menu.hasClass(CSS_MENU_HORIZONTAL);

};


var hasVisibleSubmenu = function (menuLabel) {

	return menuLabel.hasClass(CSS_MENU_LABEL_MENUVISIBLE);

};


var getItemAnchor = function (node) {

	return isAnchor(node) ? node : node.one(LOWERCASE_A);

};


var getNodeWithClass = function (node, className, searchAncestors) {

	var oItem;

	if (node) {

		if (node.hasClass(className)) {
			oItem = node;
		}

		if (!oItem && searchAncestors) {
			oItem = node.ancestor((PERIOD + className));
		}

	}

	return oItem;

};


var getParentMenu = function (node) {

	return node.ancestor(MENU_SELECTOR);

};


var getMenu = function (node, searchAncestors) {

	return getNodeWithClass(node, CSS_MENU, searchAncestors);

};


var getMenuItem = function (node, searchAncestors) {

	var oItem;

	if (node) {
		oItem = getNodeWithClass(node, CSS_MENUITEM, searchAncestors);
	}

	return oItem;

};


var getMenuLabel = function (node, searchAncestors) {

	var oItem;

	if (node) {

		if (searchAncestors) {
			oItem = getNodeWithClass(node, CSS_MENU_LABEL, searchAncestors);
		}
		else {
			oItem = getNodeWithClass(node, CSS_MENU_LABEL) ||
				node.one((PERIOD + CSS_MENU_LABEL));
		}

	}

	return oItem;

};


var getItem = function (node, searchAncestors) {

	var oItem;

	if (node) {
		oItem = getMenuItem(node, searchAncestors) ||
			getMenuLabel(node, searchAncestors);
	}

	return oItem;

};


var getFirstItem = function (menu) {

	return getItem(menu.one("li"));

};


var getActiveClass = function (node) {

	return isMenuItem(node) ? CSS_MENUITEM_ACTIVE : CSS_MENU_LABEL_ACTIVE;

};


var handleMouseOverForNode = function (node, target) {

	return node && !node[HANDLED_MOUSEOVER] &&
		(node.compareTo(target) || node.contains(target));

};


var handleMouseOutForNode = function (node, relatedTarget) {

	return node && !node[HANDLED_MOUSEOUT] &&
		(!node.compareTo(relatedTarget) && !node.contains(relatedTarget));

};

/**
* The NodeMenuNav class is a plugin for a Node instance.  The class is used via
* the <a href="Node.html#method_plug"><code>plug</code></a> method of Node and
* should not be instantiated directly.
* @namespace plugin
* @class NodeMenuNav
*/
var NodeMenuNav = function () {

	NodeMenuNav.superclass.constructor.apply(this, arguments);

};

NodeMenuNav.NAME = "nodeMenuNav";
NodeMenuNav.NS = "menuNav";


/**
* @property SHIM_TEMPLATE_TITLE
* @description String representing the value for the <code>title</code>
* attribute for the shim used to prevent <code>&#60;select&#62;</code> elements
* from poking through menus in IE 6.
* @default "Menu Stacking Shim"
* @type String
*/
NodeMenuNav.SHIM_TEMPLATE_TITLE = "Menu Stacking Shim";


/**
* @property SHIM_TEMPLATE
* @description String representing the HTML used to create the
* <code>&#60;iframe&#62;</code> shim used to prevent
* <code>&#60;select&#62;</code> elements from poking through menus in IE 6.
* @default &#34;&#60;iframe frameborder=&#34;0&#34; tabindex=&#34;-1&#34;
* class=&#34;yui-shim&#34; title=&#34;Menu Stacking Shim&#34;
* src=&#34;javascript:false;&#34;&#62;&#60;/iframe&#62;&#34;
* @type String
*/

//	<iframe> shim notes:
//
//	1) Need to set the "frameBorder" property to 0 to suppress the default
//	<iframe> border in IE.  (Setting the CSS "border" property alone doesn't
//	suppress it.)
//
//	2) The "src" attribute of the <iframe> is set to "javascript:false;" so
//	that it won't load a page inside it, preventing the secure/nonsecure
//	warning in IE when using HTTPS.
//
//	3) Since the role of the <iframe> shim is completely presentational, its
//	"tabindex" attribute is set to "-1" and its title attribute is set to
//	"Menu Stacking Shim".  Both strategies help users of screen readers to
//	avoid mistakenly interacting with the <iframe> shim.

NodeMenuNav.SHIM_TEMPLATE = '<iframe frameborder="0" tabindex="-1" class="' +
							getClassName("shim") +
							'" title="' + NodeMenuNav.SHIM_TEMPLATE_TITLE +
							'" src="javascript:false;"></iframe>';


NodeMenuNav.ATTRS = {

	/**
	* Boolean indicating if use of the WAI-ARIA Roles and States should be
	* enabled for the menu.
	*
	* @attribute useARIA
	* @readOnly
	* @writeOnce
	* @default true
	* @type boolean
	*/
	useARIA: {

		value: true,
		writeOnce: true,
		lazyAdd: false,
		setter: function (value) {

			var oMenu = this.get(HOST),
				oMenuLabel,
				oMenuToggle,
				oSubmenu,
				sID;

			if (value) {

				oMenu.set(ROLE, MENU);

				oMenu.all("ul,li," + MENU_CONTENT_SELECTOR).set(ROLE, PRESENTATION);

				oMenu.all((PERIOD + getClassName(MENUITEM, CONTENT))).set(ROLE, MENUITEM);

				oMenu.all((PERIOD + CSS_MENU_LABEL)).each(function (node) {

					oMenuLabel = node;
					oMenuToggle = node.one(MENU_TOGGLE_SELECTOR);

					if (oMenuToggle) {
						oMenuToggle.set(ROLE, PRESENTATION);
						oMenuLabel = oMenuToggle.previous();
					}

					oMenuLabel.set(ROLE, MENUITEM);
					oMenuLabel.set("aria-haspopup", true);

					oSubmenu = node.next();

					if (oSubmenu) {

						oSubmenu.set(ROLE, MENU);

						oMenuLabel = oSubmenu.previous();
						oMenuToggle = oMenuLabel.one(MENU_TOGGLE_SELECTOR);

						if (oMenuToggle) {
							oMenuLabel = oMenuToggle;
						}

						sID = Y.stamp(oMenuLabel);

						if (!oMenuLabel.get(ID)) {
							oMenuLabel.set(ID, sID);
						}

						oSubmenu.set("aria-labelledby", sID);
						oSubmenu.set(ARIA_HIDDEN, true);

					}

				});

			}

		}

	},


	/**
	* Boolean indicating if submenus are automatically made visible when the
	* user mouses over the menu's items.
	*
	* @attribute autoSubmenuDisplay
	* @readOnly
	* @writeOnce
	* @default true
	* @type boolean
	*/
	autoSubmenuDisplay: {

		value: true,
		writeOnce: true

	},


	/**
	* Number indicating the time (in milliseconds) that should expire before a
	* submenu is made visible when the user mouses over the menu's label.
	*
	* @attribute submenuShowDelay
	* @readOnly
	* @writeOnce
	* @default 250
	* @type Number
	*/
	submenuShowDelay: {

		value: 250,
		writeOnce: true

	},


	/**
	* Number indicating the time (in milliseconds) that should expire before a
	* submenu is hidden when the user mouses out of a menu label heading in the
	* direction of a submenu.
	*
	* @attribute submenuHideDelay
	* @readOnly
	* @writeOnce
	* @default 250
	* @type Number
	*/
	submenuHideDelay: {

		value: 250,
		writeOnce: true

	},


	/**
	* Number indicating the time (in milliseconds) that should expire before a
	* submenu is hidden when the user mouses out of it.
	*
	* @attribute mouseOutHideDelay
	* @readOnly
	* @writeOnce
	* @default 750
	* @type Number
	*/
	mouseOutHideDelay: {

		value: 750,
		writeOnce: true

	}

};


Y.extend(NodeMenuNav, Y.Plugin.Base, {

	//	Protected properties

	/**
	* @property _rootMenu
	* @description Node instance representing the root menu in the menu.
	* @default null
	* @protected
	* @type Node
	*/
	_rootMenu: null,


	/**
	* @property _activeItem
	* @description Node instance representing the menu's active descendent:
	* the menuitem or menu label the user is currently interacting with.
	* @default null
	* @protected
	* @type Node
	*/
	_activeItem: null,


	/**
	* @property _activeMenu
	* @description Node instance representing the menu that is the parent of
	* the menu's active descendent.
	* @default null
	* @protected
	* @type Node
	*/
	_activeMenu: null,


	/**
	* @property _hasFocus
	* @description Boolean indicating if the menu has focus.
	* @default false
	* @protected
	* @type Boolean
	*/
	_hasFocus: false,


	//	In gecko-based browsers a mouseover and mouseout event will fire even
	//	if a DOM element moves out from under the mouse without the user
	//	actually moving the mouse.  This bug affects NodeMenuNav because the
	//	user can hit the Esc key to hide a menu, and if the mouse is over the
	//	menu when the user presses Esc, the _onMenuMouseOut handler will be
	//	called.  To fix this bug the following flag (_blockMouseEvent) is used
	// to block the code in the _onMenuMouseOut handler from executing.

	/**
	* @property _blockMouseEvent
	* @description Boolean indicating whether or not to handle the
	* "mouseover" event.
	* @default false
	* @protected
	* @type Boolean
	*/
	_blockMouseEvent: false,


	/**
	* @property _currentMouseX
	* @description Number representing the current x coordinate of the mouse
	* inside the menu.
	* @default 0
	* @protected
	* @type Number
	*/
	_currentMouseX: 0,


	/**
	* @property _movingToSubmenu
	* @description Boolean indicating if the mouse is moving from a menu
	* label to its corresponding submenu.
	* @default false
	* @protected
	* @type Boolean
	*/
	_movingToSubmenu: false,


	/**
	* @property _showSubmenuTimer
	* @description Timer used to show a submenu.
	* @default null
	* @protected
	* @type Object
	*/
	_showSubmenuTimer: null,


	/**
	* @property _hideSubmenuTimer
	* @description Timer used to hide a submenu.
	* @default null
	* @protected
	* @type Object
	*/
	_hideSubmenuTimer: null,


	/**
	* @property _hideAllSubmenusTimer
	* @description Timer used to hide a all submenus.
	* @default null
	* @protected
	* @type Object
	*/
	_hideAllSubmenusTimer: null,


	/**
	* @property _firstItem
	* @description Node instance representing the first item (menuitem or menu
	* label) in the root menu of a menu.
	* @default null
	* @protected
	* @type Node
	*/
	_firstItem: null,


	//	Public methods


    initializer: function (config) {

		var menuNav = this,
			oRootMenu = this.get(HOST),
			aHandlers = [],
			oDoc;


		if (oRootMenu) {

			menuNav._rootMenu = oRootMenu;

			oRootMenu.all("ul:first-child").addClass(FIRST_OF_TYPE);

			//	Hide all visible submenus

			oRootMenu.all(MENU_SELECTOR).addClass(CSS_MENU_HIDDEN);


			//	Wire up all event handlers

			aHandlers.push(oRootMenu.on("mouseover", menuNav._onMouseOver, menuNav));
			aHandlers.push(oRootMenu.on("mouseout", menuNav._onMouseOut, menuNav));
			aHandlers.push(oRootMenu.on("mousemove", menuNav._onMouseMove, menuNav));
			aHandlers.push(oRootMenu.on(MOUSEDOWN, menuNav._toggleSubmenuDisplay, menuNav));
			aHandlers.push(Y.on("key", menuNav._toggleSubmenuDisplay, oRootMenu, "down:13", menuNav));
			aHandlers.push(oRootMenu.on(CLICK, menuNav._toggleSubmenuDisplay, menuNav));
			aHandlers.push(oRootMenu.on("keypress", menuNav._onKeyPress, menuNav));
			aHandlers.push(oRootMenu.on(KEYDOWN, menuNav._onKeyDown, menuNav));

			oDoc = oRootMenu.get("ownerDocument");

		    aHandlers.push(oDoc.on(MOUSEDOWN, menuNav._onDocMouseDown, menuNav));
			aHandlers.push(oDoc.on("focus", menuNav._onDocFocus, menuNav));

			this._eventHandlers = aHandlers;

			menuNav._initFocusManager();

		}


    },

	destructor: function () {

		var aHandlers = this._eventHandlers;

		if (aHandlers) {

			Y.Array.each(aHandlers, function (handle) {
				handle.detach();
			});

			this._eventHandlers = null;

		}

		this.get(HOST).unplug("focusManager");

    },



	//	Protected methods

	/**
	* @method _isRoot
	* @description Returns a boolean indicating if the specified menu is the
	* root menu in the menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	* @return {Boolean} Boolean indicating if the specified menu is the root
	* menu in the menu.
	*/
	_isRoot: function (menu) {

		return this._rootMenu.compareTo(menu);

	},


	/**
	* @method _getTopmostSubmenu
	* @description Returns the topmost submenu of a submenu hierarchy.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	* @return {Node} Node instance representing a menu.
	*/
	_getTopmostSubmenu: function (menu) {

		var menuNav = this,
			oMenu = getParentMenu(menu),
			returnVal;


		if (!oMenu) {
			returnVal = menu;
		}
		else if (menuNav._isRoot(oMenu)) {
			returnVal = menu;
		}
		else {
			returnVal = menuNav._getTopmostSubmenu(oMenu);
		}

		return returnVal;

	},


	/**
	* @method _clearActiveItem
	* @description Clears the menu's active descendent.
	* @protected
	*/
	_clearActiveItem: function () {

		var menuNav = this,
			oActiveItem = menuNav._activeItem;

		if (oActiveItem) {
			oActiveItem.removeClass(getActiveClass(oActiveItem));
		}

		menuNav._activeItem = null;

	},


	/**
	* @method _setActiveItem
	* @description Sets the specified menuitem or menu label as the menu's
	* active descendent.
	* @protected
	* @param {Node} item Node instance representing a menuitem or menu label.
	*/
	_setActiveItem: function (item) {

		var menuNav = this;

		if (item) {

			menuNav._clearActiveItem();

			item.addClass(getActiveClass(item));

			menuNav._activeItem = item;

		}

	},


	/**
	* @method _focusItem
	* @description Focuses the specified menuitem or menu label.
	* @protected
	* @param {Node} item Node instance representing a menuitem or menu label.
	*/
	_focusItem: function (item) {

		var menuNav = this,
			oMenu,
			oItem;

		if (item && menuNav._hasFocus) {

			oMenu = getParentMenu(item);
			oItem = getItemAnchor(item);

			if (oMenu && !oMenu.compareTo(menuNav._activeMenu)) {
				menuNav._activeMenu = oMenu;
				menuNav._initFocusManager();
			}

			menuNav._focusManager.focus(oItem);

		}

	},


	/**
	* @method _showMenu
	* @description Shows the specified menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	*/
	_showMenu: function (menu) {

		var oParentMenu = getParentMenu(menu),
			oLI = menu.get(PARENT_NODE),
			aXY = oLI.getXY();


		if (this.get(USE_ARIA)) {
			menu.set(ARIA_HIDDEN, false);
		}


		if (isHorizontalMenu(oParentMenu)) {
			aXY[1] = aXY[1] + oLI.get(OFFSET_HEIGHT);
		}
		else {
			aXY[0] = aXY[0] + oLI.get(OFFSET_WIDTH);
		}

		menu.setXY(aXY);

		if (UA.ie && UA.ie < 8) {

			if (UA.ie === 6 && !menu.hasIFrameShim) {

				menu.appendChild(Y.Node.create(NodeMenuNav.SHIM_TEMPLATE));
				menu.hasIFrameShim = true;

			}

			//	Clear previous values for height and width

			menu.setStyles({ height: EMPTY_STRING, width: EMPTY_STRING });

			//	Set the width and height of the menu's bounding box - this is
			//	necessary for IE 6 so that the CSS for the <iframe> shim can
			//	simply set the <iframe>'s width and height to 100% to ensure
			//	that dimensions of an <iframe> shim are always sync'd to the
			//	that of its parent menu.  Specifying a width and height also
			//	helps when positioning decorator elements (for creating effects
			//	like rounded corners) inside a menu's bounding box in IE 7.

			menu.setStyles({
				height: (menu.get(OFFSET_HEIGHT) + PX),
				width: (menu.get(OFFSET_WIDTH) + PX) });

		}

		menu.previous().addClass(CSS_MENU_LABEL_MENUVISIBLE);
		menu.removeClass(CSS_MENU_HIDDEN);

	},


	/**
	* @method _hideMenu
	* @description Hides the specified menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	* @param {Boolean} activateAndFocusLabel Boolean indicating if the label
	* for the specified
	* menu should be focused and set as active.
	*/
	_hideMenu: function (menu, activateAndFocusLabel) {

		var menuNav = this,
			oLabel = menu.previous(),
			oActiveItem;

		oLabel.removeClass(CSS_MENU_LABEL_MENUVISIBLE);


		if (activateAndFocusLabel) {
			menuNav._focusItem(oLabel);
			menuNav._setActiveItem(oLabel);
		}

		oActiveItem = menu.one((PERIOD + CSS_MENUITEM_ACTIVE));

		if (oActiveItem) {
			oActiveItem.removeClass(CSS_MENUITEM_ACTIVE);
		}

		//	Clear the values for top and left that were set by the call to
		//	"setXY" when the menu was shown so that the hidden position
		//	specified in the core CSS file will take affect.

		menu.setStyles({ left: EMPTY_STRING, top: EMPTY_STRING });

		menu.addClass(CSS_MENU_HIDDEN);

		if (menuNav.get(USE_ARIA)) {
			menu.set(ARIA_HIDDEN, true);
		}

	},


	/**
	* @method _hideAllSubmenus
	* @description Hides all submenus of the specified menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	*/
	_hideAllSubmenus: function (menu) {

		var menuNav = this;

		menu.all(MENU_SELECTOR).each(Y.bind(function (submenuNode) {

			menuNav._hideMenu(submenuNode);

		}, menuNav));

	},


	/**
	* @method _cancelShowSubmenuTimer
	* @description Cancels the timer used to show a submenu.
	* @protected
	*/
	_cancelShowSubmenuTimer: function () {

		var menuNav = this,
			oShowSubmenuTimer = menuNav._showSubmenuTimer;

		if (oShowSubmenuTimer) {
			oShowSubmenuTimer.cancel();
			menuNav._showSubmenuTimer = null;
		}

	},


	/**
	* @method _cancelHideSubmenuTimer
	* @description Cancels the timer used to hide a submenu.
	* @protected
	*/
	_cancelHideSubmenuTimer: function () {

		var menuNav = this,
			oHideSubmenuTimer = menuNav._hideSubmenuTimer;


		if (oHideSubmenuTimer) {
			oHideSubmenuTimer.cancel();
			menuNav._hideSubmenuTimer = null;
		}

	},


	/**
	* @method _initFocusManager
	* @description Initializes and updates the Focus Manager so that is is
	* always managing descendants of the active menu.
	* @protected
	*/
	_initFocusManager: function () {

		var menuNav = this,
			oRootMenu = menuNav._rootMenu,
			oMenu = menuNav._activeMenu || oRootMenu,
			sSelectorBase =
				menuNav._isRoot(oMenu) ? EMPTY_STRING : ("#" + oMenu.get("id")),
			oFocusManager = menuNav._focusManager,
			sKeysVal,
			sDescendantSelector,
			sQuery;

		if (isHorizontalMenu(oMenu)) {

			sDescendantSelector = sSelectorBase + STANDARD_QUERY + "," +
				sSelectorBase + EXTENDED_QUERY;

			sKeysVal = { next: "down:39", previous: "down:37" };

		}
		else {

			sDescendantSelector = sSelectorBase + STANDARD_QUERY;
			sKeysVal = { next: "down:40", previous: "down:38" };

		}


		if (!oFocusManager) {

			oRootMenu.plug(Y.Plugin.NodeFocusManager, {
				descendants: sDescendantSelector,
				keys: sKeysVal,
				circular: true
			});

			oFocusManager = oRootMenu.focusManager;

			sQuery = "#" + oRootMenu.get("id") + MENU_SELECTOR + " a," +
							MENU_TOGGLE_SELECTOR;

			oRootMenu.all(sQuery).set("tabIndex", -1);

			oFocusManager.on(ACTIVE_DESCENDANT_CHANGE,
				this._onActiveDescendantChange, oFocusManager, this);

			oFocusManager.after(ACTIVE_DESCENDANT_CHANGE,
				this._afterActiveDescendantChange, oFocusManager, this);

			menuNav._focusManager = oFocusManager;

		}
		else {

			oFocusManager.set(ACTIVE_DESCENDANT, -1);
			oFocusManager.set(DESCENDANTS, sDescendantSelector);
			oFocusManager.set("keys", sKeysVal);

		}

	},


	//	Event handlers for discrete pieces of pieces of the menu


	/**
	* @method _onActiveDescendantChange
	* @description "activeDescendantChange" event handler for menu's
	* Focus Manager.
	* @protected
	* @param {Object} event Object representing the Attribute change event.
	* @param {NodeMenuNav} menuNav Object representing the NodeMenuNav instance.
	*/
	_onActiveDescendantChange: function (event, menuNav) {

		if (event.src === UI && menuNav._activeMenu &&
				!menuNav._movingToSubmenu) {

			menuNav._hideAllSubmenus(menuNav._activeMenu);

		}

	},


	/**
	* @method _afterActiveDescendantChange
	* @description "activeDescendantChange" event handler for menu's
	* Focus Manager.
	* @protected
	* @param {Object} event Object representing the Attribute change event.
	* @param {NodeMenuNav} menuNav Object representing the NodeMenuNav instance.
	*/
	_afterActiveDescendantChange: function (event, menuNav) {

		var oItem;

		if (event.src === UI) {
			oItem = getItem(this.get(DESCENDANTS).item(event.newVal), true);
			menuNav._setActiveItem(oItem);
		}

	},


	/**
	* @method _onDocFocus
	* @description "focus" event handler for the owner document of the MenuNav.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onDocFocus: function (event) {

		var menuNav = this,
			oActiveItem = menuNav._activeItem,
			oTarget = event.target,
			oMenu;


		if (menuNav._rootMenu.contains(oTarget)) {	//	The menu has focus

			if (menuNav._hasFocus) {

				oMenu = getParentMenu(oTarget);

				//	If the element that was focused is a descendant of the
				//	root menu, but is in a submenu not currently being
				//	managed by the Focus Manager, update the Focus Manager so
				//	that it is now managing the submenu that is the parent of
				//	the element that was focused.

				if (!menuNav._activeMenu.compareTo(oMenu)) {

					menuNav._activeMenu = oMenu;
					menuNav._initFocusManager();
					menuNav._focusManager.set(ACTIVE_DESCENDANT, oTarget);
					menuNav._setActiveItem(getItem(oTarget, true));

				}

			}
			else { //	Initial focus

				//	First time the menu has been focused, need to setup focused
				//	state and established active active descendant

				menuNav._hasFocus = true;

				oActiveItem = getItem(oTarget, true);

				if (oActiveItem) {
					menuNav._setActiveItem(oActiveItem);
				}

			}

		}
		else {	//	The menu has lost focus

			menuNav._clearActiveItem();

			menuNav._cancelShowSubmenuTimer();
			menuNav._hideAllSubmenus(menuNav._rootMenu);

			menuNav._activeMenu = menuNav._rootMenu;
			menuNav._initFocusManager();

			menuNav._focusManager.set(ACTIVE_DESCENDANT, 0);

			menuNav._hasFocus = false;

		}

	},


	/**
	* @method _onMenuMouseOver
	* @description "mouseover" event handler for a menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuMouseOver: function (menu, event) {

		var menuNav = this,
			oHideAllSubmenusTimer = menuNav._hideAllSubmenusTimer;

		if (oHideAllSubmenusTimer) {
			oHideAllSubmenusTimer.cancel();
			menuNav._hideAllSubmenusTimer = null;
		}

		menuNav._cancelHideSubmenuTimer();

		//	Need to update the FocusManager in advance of focus a new
		//	Menu in order to avoid the FocusManager thinking that
		//	it has lost focus

		if (menu && !menu.compareTo(menuNav._activeMenu)) {
			menuNav._activeMenu = menu;

			if (menuNav._hasFocus) {
				menuNav._initFocusManager();
			}

		}

		if (menuNav._movingToSubmenu && isHorizontalMenu(menu)) {
			menuNav._movingToSubmenu = false;
		}

	},


	/**
	* @method _hideAndFocusLabel
	* @description Hides all of the submenus of the root menu and focuses the
	* label of the topmost submenu
	* @protected
	*/
	_hideAndFocusLabel: function () {

		var	menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oSubmenu;

		menuNav._hideAllSubmenus(menuNav._rootMenu);

		if (oActiveMenu) {

			//	Focus the label element for the topmost submenu
			oSubmenu = menuNav._getTopmostSubmenu(oActiveMenu);
			menuNav._focusItem(oSubmenu.previous());

		}

	},


	/**
	* @method _onMenuMouseOut
	* @description "mouseout" event handler for a menu.
	* @protected
	* @param {Node} menu Node instance representing a menu.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuMouseOut: function (menu, event) {

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oRelatedTarget = event.relatedTarget,
			oActiveItem = menuNav._activeItem,
			oParentMenu,
			oMenu;


		if (oActiveMenu && !oActiveMenu.contains(oRelatedTarget)) {

			oParentMenu = getParentMenu(oActiveMenu);


			if (oParentMenu && !oParentMenu.contains(oRelatedTarget)) {

				if (menuNav.get(MOUSEOUT_HIDE_DELAY) > 0) {

					menuNav._cancelShowSubmenuTimer();

					menuNav._hideAllSubmenusTimer =

						later(menuNav.get(MOUSEOUT_HIDE_DELAY),
							menuNav, menuNav._hideAndFocusLabel);

				}

			}
			else {

				if (oActiveItem) {

					oMenu = getParentMenu(oActiveItem);

					if (!menuNav._isRoot(oMenu)) {
						menuNav._focusItem(oMenu.previous());
					}

				}

			}

		}

	},


	/**
	* @method _onMenuLabelMouseOver
	* @description "mouseover" event handler for a menu label.
	* @protected
	* @param {Node} menuLabel Node instance representing a menu label.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuLabelMouseOver: function (menuLabel, event) {

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bIsRoot = menuNav._isRoot(oActiveMenu),
			bUseAutoSubmenuDisplay =
				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot),
            submenuShowDelay = menuNav.get("submenuShowDelay"),
			oSubmenu;


        var showSubmenu = function (delay) {

			menuNav._cancelHideSubmenuTimer();
			menuNav._cancelShowSubmenuTimer();

			if (!hasVisibleSubmenu(menuLabel)) {

				oSubmenu = menuLabel.next();

				if (oSubmenu) {
					menuNav._hideAllSubmenus(oActiveMenu);
					menuNav._showSubmenuTimer = later(delay, menuNav, menuNav._showMenu, oSubmenu);
				}

			}

        };


		menuNav._focusItem(menuLabel);
		menuNav._setActiveItem(menuLabel);


		if (bUseAutoSubmenuDisplay) {

	        if (menuNav._movingToSubmenu) {

	            //  If the user is moving diagonally from a submenu to
	            //  another submenu and they then stop and pause on a
	            //  menu label for an amount of time equal to the amount of
	            //  time defined for the display of a submenu then show the
	            //  submenu immediately.
	            //  http://yuilibrary.com/projects/yui3/ticket/2528316

	            //Y.message("Pause path");

	            menuNav._hoverTimer = later(submenuShowDelay, menuNav, function () {
                    showSubmenu(0);
	            });

	        }
	        else {
                showSubmenu(submenuShowDelay);
	        }

		}

	},


	/**
	* @method _onMenuLabelMouseOut
	* @description "mouseout" event handler for a menu label.
	* @protected
	* @param {Node} menuLabel Node instance representing a menu label.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuLabelMouseOut: function (menuLabel, event) {

		var menuNav = this,
			bIsRoot = menuNav._isRoot(menuNav._activeMenu),
			bUseAutoSubmenuDisplay =
				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot),

			oRelatedTarget = event.relatedTarget,
			oSubmenu = menuLabel.next(),
			hoverTimer = menuNav._hoverTimer;

        if (hoverTimer) {
            hoverTimer.cancel();
        }

		menuNav._clearActiveItem();

		if (bUseAutoSubmenuDisplay) {

			if (menuNav._movingToSubmenu &&
					!menuNav._showSubmenuTimer && oSubmenu) {

				//	If the mouse is moving diagonally toward the submenu and
				//	another submenu isn't in the process of being displayed
				//	(via a timer), then hide the submenu via a timer to give
				//	the user some time to reach the submenu.

				menuNav._hideSubmenuTimer =
					later(menuNav.get("submenuHideDelay"), menuNav,
						menuNav._hideMenu, oSubmenu);

			}
			else if (!menuNav._movingToSubmenu && oSubmenu && (!oRelatedTarget ||
			        (oRelatedTarget &&
			            !oSubmenu.contains(oRelatedTarget) &&
			            !oRelatedTarget.compareTo(oSubmenu)))) {

				//	If the mouse is not moving toward the submenu, cancel any
				//	submenus that might be in the process of being displayed
				//	(via a timer) and hide this submenu immediately.

				menuNav._cancelShowSubmenuTimer();

				menuNav._hideMenu(oSubmenu);

			}

		}

	},


	/**
	* @method _onMenuItemMouseOver
	* @description "mouseover" event handler for a menuitem.
	* @protected
	* @param {Node} menuItem Node instance representing a menuitem.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuItemMouseOver: function (menuItem, event) {

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bIsRoot = menuNav._isRoot(oActiveMenu),
			bUseAutoSubmenuDisplay =
				(menuNav.get(AUTO_SUBMENU_DISPLAY) && bIsRoot || !bIsRoot);


		menuNav._focusItem(menuItem);
		menuNav._setActiveItem(menuItem);


		if (bUseAutoSubmenuDisplay && !menuNav._movingToSubmenu) {

			menuNav._hideAllSubmenus(oActiveMenu);

		}

	},


	/**
	* @method _onMenuItemMouseOut
	* @description "mouseout" event handler for a menuitem.
	* @protected
	* @param {Node} menuItem Node instance representing a menuitem.
	* @param {Object} event Object representing the DOM event.
	*/
	_onMenuItemMouseOut: function (menuItem, event) {

		this._clearActiveItem();

	},


	/**
	* @method _onVerticalMenuKeyDown
	* @description "keydown" event handler for vertical menus.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onVerticalMenuKeyDown: function (event) {

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oRootMenu = menuNav._rootMenu,
			oTarget = event.target,
			bPreventDefault = false,
			nKeyCode = event.keyCode,
			oSubmenu,
			oParentMenu,
			oLI,
			oItem;


		switch (nKeyCode) {

			case 37:	//	left arrow

				oParentMenu = getParentMenu(oActiveMenu);

				if (oParentMenu && isHorizontalMenu(oParentMenu)) {

					menuNav._hideMenu(oActiveMenu);
					oLI = getPreviousSibling(oActiveMenu.get(PARENT_NODE));
					oItem = getItem(oLI);

					if (oItem) {

						if (isMenuLabel(oItem)) {	//	Menu label

							oSubmenu = oItem.next();


							if (oSubmenu) {

								menuNav._showMenu(oSubmenu);
								menuNav._focusItem(getFirstItem(oSubmenu));
								menuNav._setActiveItem(getFirstItem(oSubmenu));

							}
							else {

								menuNav._focusItem(oItem);
								menuNav._setActiveItem(oItem);

							}

						}
						else {	//	MenuItem

							menuNav._focusItem(oItem);
							menuNav._setActiveItem(oItem);

						}

					}

				}
				else if (!menuNav._isRoot(oActiveMenu)) {
					menuNav._hideMenu(oActiveMenu, true);
				}


				bPreventDefault = true;

			break;

			case 39:	//	right arrow

				if (isMenuLabel(oTarget)) {

					oSubmenu = oTarget.next();

					if (oSubmenu) {

						menuNav._showMenu(oSubmenu);
						menuNav._focusItem(getFirstItem(oSubmenu));
						menuNav._setActiveItem(getFirstItem(oSubmenu));

					}

				}
				else if (isHorizontalMenu(oRootMenu)) {

					oSubmenu = menuNav._getTopmostSubmenu(oActiveMenu);
					oLI = getNextSibling(oSubmenu.get(PARENT_NODE));
					oItem = getItem(oLI);

					menuNav._hideAllSubmenus(oRootMenu);

					if (oItem) {

						if (isMenuLabel(oItem)) {	//	Menu label

							oSubmenu = oItem.next();

							if (oSubmenu) {

								menuNav._showMenu(oSubmenu);
								menuNav._focusItem(getFirstItem(oSubmenu));
								menuNav._setActiveItem(getFirstItem(oSubmenu));

							}
							else {

								menuNav._focusItem(oItem);
								menuNav._setActiveItem(oItem);

							}

						}
						else {	//	MenuItem

							menuNav._focusItem(oItem);
							menuNav._setActiveItem(oItem);

						}

					}

				}

				bPreventDefault = true;

			break;

		}


		if (bPreventDefault) {

			//	Prevent the browser from scrolling the window

			event.preventDefault();

		}

	},


	/**
	* @method _onHorizontalMenuKeyDown
	* @description "keydown" event handler for horizontal menus.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onHorizontalMenuKeyDown: function (event) {

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			oTarget = event.target,
			oFocusedItem = getItem(oTarget, true),
			bPreventDefault = false,
			nKeyCode = event.keyCode,
			oSubmenu;


		if (nKeyCode === 40) {

			menuNav._hideAllSubmenus(oActiveMenu);

			if (isMenuLabel(oFocusedItem)) {

				oSubmenu = oFocusedItem.next();

				if (oSubmenu) {

					menuNav._showMenu(oSubmenu);
					menuNav._focusItem(getFirstItem(oSubmenu));
					menuNav._setActiveItem(getFirstItem(oSubmenu));

				}

				bPreventDefault = true;

			}

		}


		if (bPreventDefault) {

			//	Prevent the browser from scrolling the window

			event.preventDefault();

		}

	},


	//	Generic DOM Event handlers


	/**
	* @method _onMouseMove
	* @description "mousemove" event handler for the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onMouseMove: function (event) {

		var menuNav = this;

		//	Using a timer to set the value of the "_currentMouseX" property
		//	helps improve the reliability of the calculation used to set the
		//	value of the "_movingToSubmenu" property - especially in Opera.

		later(10, menuNav, function () {

			menuNav._currentMouseX = event.pageX;

		});

	},


	/**
	* @method _onMouseOver
	* @description "mouseover" event handler for the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onMouseOver: function (event) {

		var menuNav = this,
			oTarget,
			oMenu,
			oMenuLabel,
			oParentMenu,
			oMenuItem;


		if (menuNav._blockMouseEvent) {
			menuNav._blockMouseEvent = false;
		}
		else {

			oTarget = event.target;
			oMenu = getMenu(oTarget, true);
			oMenuLabel = getMenuLabel(oTarget, true);
			oMenuItem = getMenuItem(oTarget, true);


			if (handleMouseOverForNode(oMenu, oTarget)) {

				menuNav._onMenuMouseOver(oMenu, event);

				oMenu[HANDLED_MOUSEOVER] = true;
				oMenu[HANDLED_MOUSEOUT] = false;

				oParentMenu = getParentMenu(oMenu);

				if (oParentMenu) {

					oParentMenu[HANDLED_MOUSEOUT] = true;
					oParentMenu[HANDLED_MOUSEOVER] = false;

				}

			}

			if (handleMouseOverForNode(oMenuLabel, oTarget)) {

				menuNav._onMenuLabelMouseOver(oMenuLabel, event);

				oMenuLabel[HANDLED_MOUSEOVER] = true;
				oMenuLabel[HANDLED_MOUSEOUT] = false;

			}

			if (handleMouseOverForNode(oMenuItem, oTarget)) {

				menuNav._onMenuItemMouseOver(oMenuItem, event);

				oMenuItem[HANDLED_MOUSEOVER] = true;
				oMenuItem[HANDLED_MOUSEOUT] = false;

			}

		}

	},


	/**
	* @method _onMouseOut
	* @description "mouseout" event handler for the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onMouseOut: function (event) {

		var menuNav = this,
			oActiveMenu = menuNav._activeMenu,
			bMovingToSubmenu = false,
			oTarget,
			oRelatedTarget,
			oMenu,
			oMenuLabel,
			oSubmenu,
			oMenuItem;


		menuNav._movingToSubmenu =
					(oActiveMenu && !isHorizontalMenu(oActiveMenu) &&
						((event.pageX - 5) > menuNav._currentMouseX));

		oTarget = event.target;
		oRelatedTarget = event.relatedTarget;
		oMenu = getMenu(oTarget, true);
		oMenuLabel = getMenuLabel(oTarget, true);
		oMenuItem = getMenuItem(oTarget, true);


		if (handleMouseOutForNode(oMenuLabel, oRelatedTarget)) {

			menuNav._onMenuLabelMouseOut(oMenuLabel, event);

			oMenuLabel[HANDLED_MOUSEOUT] = true;
			oMenuLabel[HANDLED_MOUSEOVER] = false;

		}

		if (handleMouseOutForNode(oMenuItem, oRelatedTarget)) {

			menuNav._onMenuItemMouseOut(oMenuItem, event);

			oMenuItem[HANDLED_MOUSEOUT] = true;
			oMenuItem[HANDLED_MOUSEOVER] = false;

		}


		if (oMenuLabel) {

			oSubmenu = oMenuLabel.next();

			if (oSubmenu && oRelatedTarget &&
				(oRelatedTarget.compareTo(oSubmenu) ||
					oSubmenu.contains(oRelatedTarget))) {

				bMovingToSubmenu = true;

			}

		}


		if (handleMouseOutForNode(oMenu, oRelatedTarget) || bMovingToSubmenu) {

			menuNav._onMenuMouseOut(oMenu, event);

			oMenu[HANDLED_MOUSEOUT] = true;
			oMenu[HANDLED_MOUSEOVER] = false;

		}

	},


	/**
	* @method _toggleSubmenuDisplay
	* @description "mousedown," "keydown," and "click" event handler for the
	* menu used to toggle the display of a submenu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_toggleSubmenuDisplay: function (event) {

		var menuNav = this,
			oTarget = event.target,
			oMenuLabel = getMenuLabel(oTarget, true),
			sType = event.type,
			oAnchor,
			oSubmenu,
			sHref,
			nHashPos,
			nLen,
			sId;


		if (oMenuLabel) {

			oAnchor = isAnchor(oTarget) ? oTarget : oTarget.ancestor(isAnchor);


			if (oAnchor) {

				//	Need to pass "2" as a second argument to "getAttribute" for
				//	IE otherwise IE will return a fully qualified URL for the
				//	value of the "href" attribute.
				//	http://msdn.microsoft.com/en-us/library/ms536429(VS.85).aspx

				sHref = oAnchor.getAttribute("href", 2);
				nHashPos = sHref.indexOf("#");
				nLen = sHref.length;

				if (nHashPos === 0 && nLen > 1) {

					sId = sHref.substr(1, nLen);
					oSubmenu = oMenuLabel.next();

					if (oSubmenu && (oSubmenu.get(ID) === sId)) {

						if (sType === MOUSEDOWN || sType === KEYDOWN) {

							if ((UA.opera || UA.gecko || UA.ie) && sType === KEYDOWN && !menuNav._preventClickHandle) {

								//	Prevent the browser from following the URL of
								//	the anchor element

								menuNav._preventClickHandle = menuNav._rootMenu.on("click", function (event) {

									event.preventDefault();

									menuNav._preventClickHandle.detach();
									menuNav._preventClickHandle = null;

								});

							}

							if (sType == MOUSEDOWN) {

								//	Prevent the target from getting focused by
								//	default, since the element to be focused will
								//	be determined by weather or not the submenu
								//	is visible.
								event.preventDefault();

								//	FocusManager will attempt to focus any
								//	descendant that is the target of the mousedown
								//	event.  Since we want to explicitly control
	 							//	where focus is going, we need to call
								//	"stopImmediatePropagation" to stop the
								//	FocusManager from doing its thing.
								event.stopImmediatePropagation();

								//	The "_focusItem" method relies on the
								//	"_hasFocus" property being set to true.  The
								//	"_hasFocus" property is normally set via a
								//	"focus" event listener, but since we've
								//	blocked focus from happening, we need to set
								//	this property manually.
								menuNav._hasFocus = true;

							}


							if (menuNav._isRoot(getParentMenu(oTarget))) {	//	Event target is a submenu label in the root menu

								//	Menu label toggle functionality

								if (hasVisibleSubmenu(oMenuLabel)) {

									menuNav._hideMenu(oSubmenu);
									menuNav._focusItem(oMenuLabel);
									menuNav._setActiveItem(oMenuLabel);

								}
								else {

									menuNav._hideAllSubmenus(menuNav._rootMenu);
									menuNav._showMenu(oSubmenu);

									menuNav._focusItem(getFirstItem(oSubmenu));
									menuNav._setActiveItem(getFirstItem(oSubmenu));

								}

							}
							else {	//	Event target is a submenu label within a submenu

								if (menuNav._activeItem == oMenuLabel) {

									menuNav._showMenu(oSubmenu);
									menuNav._focusItem(getFirstItem(oSubmenu));
									menuNav._setActiveItem(getFirstItem(oSubmenu));

								}
								else {

									if (!oMenuLabel._clickHandle) {

										oMenuLabel._clickHandle = oMenuLabel.on("click", function () {

											menuNav._hideAllSubmenus(menuNav._rootMenu);

											menuNav._hasFocus = false;
											menuNav._clearActiveItem();


											oMenuLabel._clickHandle.detach();

											oMenuLabel._clickHandle = null;

										});

									}

								}

							}

						}


						if (sType === CLICK) {

							//	Prevent the browser from following the URL of
							//	the anchor element

							event.preventDefault();

						}

					}

				}


			}

		}

	},


	/**
	* @method _onKeyPress
	* @description "keypress" event handler for the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onKeyPress: function (event) {

		switch (event.keyCode) {

			case 37:	//	left arrow
			case 38:	//	up arrow
			case 39:	//	right arrow
			case 40:	//	down arrow

				//	Prevent the browser from scrolling the window

				event.preventDefault();

			break;

		}

	},


	/**
	* @method _onKeyDown
	* @description "keydown" event handler for the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onKeyDown: function (event) {

		var menuNav = this,
			oActiveItem = menuNav._activeItem,
			oTarget = event.target,
			oActiveMenu = getParentMenu(oTarget),
			oSubmenu;

		if (oActiveMenu) {

			menuNav._activeMenu = oActiveMenu;

			if (isHorizontalMenu(oActiveMenu)) {
				menuNav._onHorizontalMenuKeyDown(event);
			}
			else {
				menuNav._onVerticalMenuKeyDown(event);
			}


			if (event.keyCode === 27) {

				if (!menuNav._isRoot(oActiveMenu)) {

					if (UA.opera) {
						later(0, menuNav, function () {
							menuNav._hideMenu(oActiveMenu, true);
						});
					}
					else {
						menuNav._hideMenu(oActiveMenu, true);
					}

					event.stopPropagation();
					menuNav._blockMouseEvent = UA.gecko ? true : false;

				}
				else if (oActiveItem) {

					if (isMenuLabel(oActiveItem) &&
							hasVisibleSubmenu(oActiveItem)) {

						oSubmenu = oActiveItem.next();

						if (oSubmenu) {
							menuNav._hideMenu(oSubmenu);
						}

					}
					else {

						menuNav._focusManager.blur();

						//	This is necessary for Webkit since blurring the
						//	active menuitem won't result in the document
						//	gaining focus, meaning the that _onDocFocus
						//	listener won't clear the active menuitem.

						menuNav._clearActiveItem();

						menuNav._hasFocus = false;

					}

				}

			}

		}

	},

	/**
	* @method _onDocMouseDown
	* @description "mousedown" event handler for the owner document of
	* the menu.
	* @protected
	* @param {Object} event Object representing the DOM event.
	*/
	_onDocMouseDown: function (event) {

		var menuNav = this,
			oRoot = menuNav._rootMenu,
			oTarget = event.target;


		if (!(oRoot.compareTo(oTarget) || oRoot.contains(oTarget))) {

			menuNav._hideAllSubmenus(oRoot);

			//	Document doesn't receive focus in Webkit when the user mouses
			//	down on it, so the "_hasFocus" property won't get set to the
			//	correct value.  The following line corrects the problem.

			if (UA.webkit) {
				menuNav._hasFocus = false;
				menuNav._clearActiveItem();
			}

		}

	}

});


Y.namespace('Plugin');

Y.Plugin.NodeMenuNav = NodeMenuNav;


}, '3.17.2', {"requires": ["node", "classnamemanager", "plugin", "node-focusmanager"], "skinnable": true});
