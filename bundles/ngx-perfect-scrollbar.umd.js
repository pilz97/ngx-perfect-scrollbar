(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('rxjs/operators'), require('@angular/core'), require('@angular/common'), require('perfect-scrollbar')) :
    typeof define === 'function' && define.amd ? define(['exports', 'rxjs', 'rxjs/operators', '@angular/core', '@angular/common', 'perfect-scrollbar'], factory) :
    (global = global || self, factory((global.zef = global.zef || {}, global.zef.ngxPerfectScrollbar = {}), global.Rx, global.Rx.Observable.prototype, global.ng.core, global.ng.common, global.PerfectScrollbar));
}(this, function (exports, rxjs, operators, core, common, PerfectScrollbar) { 'use strict';

    PerfectScrollbar = PerfectScrollbar && PerfectScrollbar.hasOwnProperty('default') ? PerfectScrollbar['default'] : PerfectScrollbar;

    /**
     * A collection of shims that provide minimal functionality of the ES6 collections.
     *
     * These implementations are not meant to be used outside of the ResizeObserver
     * modules as they cover only a limited range of use cases.
     */
    /* eslint-disable require-jsdoc, valid-jsdoc */
    var MapShim = (function () {
        if (typeof Map !== 'undefined') {
            return Map;
        }
        /**
         * Returns index in provided array that matches the specified key.
         *
         * @param {Array<Array>} arr
         * @param {*} key
         * @returns {number}
         */
        function getIndex(arr, key) {
            var result = -1;
            arr.some(function (entry, index) {
                if (entry[0] === key) {
                    result = index;
                    return true;
                }
                return false;
            });
            return result;
        }
        return /** @class */ (function () {
            function class_1() {
                this.__entries__ = [];
            }
            Object.defineProperty(class_1.prototype, "size", {
                /**
                 * @returns {boolean}
                 */
                get: function () {
                    return this.__entries__.length;
                },
                enumerable: true,
                configurable: true
            });
            /**
             * @param {*} key
             * @returns {*}
             */
            class_1.prototype.get = function (key) {
                var index = getIndex(this.__entries__, key);
                var entry = this.__entries__[index];
                return entry && entry[1];
            };
            /**
             * @param {*} key
             * @param {*} value
             * @returns {void}
             */
            class_1.prototype.set = function (key, value) {
                var index = getIndex(this.__entries__, key);
                if (~index) {
                    this.__entries__[index][1] = value;
                }
                else {
                    this.__entries__.push([key, value]);
                }
            };
            /**
             * @param {*} key
             * @returns {void}
             */
            class_1.prototype.delete = function (key) {
                var entries = this.__entries__;
                var index = getIndex(entries, key);
                if (~index) {
                    entries.splice(index, 1);
                }
            };
            /**
             * @param {*} key
             * @returns {void}
             */
            class_1.prototype.has = function (key) {
                return !!~getIndex(this.__entries__, key);
            };
            /**
             * @returns {void}
             */
            class_1.prototype.clear = function () {
                this.__entries__.splice(0);
            };
            /**
             * @param {Function} callback
             * @param {*} [ctx=null]
             * @returns {void}
             */
            class_1.prototype.forEach = function (callback, ctx) {
                if (ctx === void 0) { ctx = null; }
                for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
                    var entry = _a[_i];
                    callback.call(ctx, entry[1], entry[0]);
                }
            };
            return class_1;
        }());
    })();

    /**
     * Detects whether window and document objects are available in current environment.
     */
    var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && window.document === document;

    // Returns global object of a current environment.
    var global$1 = (function () {
        if (typeof global !== 'undefined' && global.Math === Math) {
            return global;
        }
        if (typeof self !== 'undefined' && self.Math === Math) {
            return self;
        }
        if (typeof window !== 'undefined' && window.Math === Math) {
            return window;
        }
        // eslint-disable-next-line no-new-func
        return Function('return this')();
    })();

    /**
     * A shim for the requestAnimationFrame which falls back to the setTimeout if
     * first one is not supported.
     *
     * @returns {number} Requests' identifier.
     */
    var requestAnimationFrame$1 = (function () {
        if (typeof requestAnimationFrame === 'function') {
            // It's required to use a bounded function because IE sometimes throws
            // an "Invalid calling object" error if rAF is invoked without the global
            // object on the left hand side.
            return requestAnimationFrame.bind(global$1);
        }
        return function (callback) { return setTimeout(function () { return callback(Date.now()); }, 1000 / 60); };
    })();

    // Defines minimum timeout before adding a trailing call.
    var trailingTimeout = 2;
    /**
     * Creates a wrapper function which ensures that provided callback will be
     * invoked only once during the specified delay period.
     *
     * @param {Function} callback - Function to be invoked after the delay period.
     * @param {number} delay - Delay after which to invoke callback.
     * @returns {Function}
     */
    function throttle (callback, delay) {
        var leadingCall = false, trailingCall = false, lastCallTime = 0;
        /**
         * Invokes the original callback function and schedules new invocation if
         * the "proxy" was called during current request.
         *
         * @returns {void}
         */
        function resolvePending() {
            if (leadingCall) {
                leadingCall = false;
                callback();
            }
            if (trailingCall) {
                proxy();
            }
        }
        /**
         * Callback invoked after the specified delay. It will further postpone
         * invocation of the original function delegating it to the
         * requestAnimationFrame.
         *
         * @returns {void}
         */
        function timeoutCallback() {
            requestAnimationFrame$1(resolvePending);
        }
        /**
         * Schedules invocation of the original function.
         *
         * @returns {void}
         */
        function proxy() {
            var timeStamp = Date.now();
            if (leadingCall) {
                // Reject immediately following calls.
                if (timeStamp - lastCallTime < trailingTimeout) {
                    return;
                }
                // Schedule new call to be in invoked when the pending one is resolved.
                // This is important for "transitions" which never actually start
                // immediately so there is a chance that we might miss one if change
                // happens amids the pending invocation.
                trailingCall = true;
            }
            else {
                leadingCall = true;
                trailingCall = false;
                setTimeout(timeoutCallback, delay);
            }
            lastCallTime = timeStamp;
        }
        return proxy;
    }

    // Minimum delay before invoking the update of observers.
    var REFRESH_DELAY = 20;
    // A list of substrings of CSS properties used to find transition events that
    // might affect dimensions of observed elements.
    var transitionKeys = ['top', 'right', 'bottom', 'left', 'width', 'height', 'size', 'weight'];
    // Check if MutationObserver is available.
    var mutationObserverSupported = typeof MutationObserver !== 'undefined';
    /**
     * Singleton controller class which handles updates of ResizeObserver instances.
     */
    var ResizeObserverController = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserverController.
         *
         * @private
         */
        function ResizeObserverController() {
            /**
             * Indicates whether DOM listeners have been added.
             *
             * @private {boolean}
             */
            this.connected_ = false;
            /**
             * Tells that controller has subscribed for Mutation Events.
             *
             * @private {boolean}
             */
            this.mutationEventsAdded_ = false;
            /**
             * Keeps reference to the instance of MutationObserver.
             *
             * @private {MutationObserver}
             */
            this.mutationsObserver_ = null;
            /**
             * A list of connected observers.
             *
             * @private {Array<ResizeObserverSPI>}
             */
            this.observers_ = [];
            this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
            this.refresh = throttle(this.refresh.bind(this), REFRESH_DELAY);
        }
        /**
         * Adds observer to observers list.
         *
         * @param {ResizeObserverSPI} observer - Observer to be added.
         * @returns {void}
         */
        ResizeObserverController.prototype.addObserver = function (observer) {
            if (!~this.observers_.indexOf(observer)) {
                this.observers_.push(observer);
            }
            // Add listeners if they haven't been added yet.
            if (!this.connected_) {
                this.connect_();
            }
        };
        /**
         * Removes observer from observers list.
         *
         * @param {ResizeObserverSPI} observer - Observer to be removed.
         * @returns {void}
         */
        ResizeObserverController.prototype.removeObserver = function (observer) {
            var observers = this.observers_;
            var index = observers.indexOf(observer);
            // Remove observer if it's present in registry.
            if (~index) {
                observers.splice(index, 1);
            }
            // Remove listeners if controller has no connected observers.
            if (!observers.length && this.connected_) {
                this.disconnect_();
            }
        };
        /**
         * Invokes the update of observers. It will continue running updates insofar
         * it detects changes.
         *
         * @returns {void}
         */
        ResizeObserverController.prototype.refresh = function () {
            var changesDetected = this.updateObservers_();
            // Continue running updates if changes have been detected as there might
            // be future ones caused by CSS transitions.
            if (changesDetected) {
                this.refresh();
            }
        };
        /**
         * Updates every observer from observers list and notifies them of queued
         * entries.
         *
         * @private
         * @returns {boolean} Returns "true" if any observer has detected changes in
         *      dimensions of it's elements.
         */
        ResizeObserverController.prototype.updateObservers_ = function () {
            // Collect observers that have active observations.
            var activeObservers = this.observers_.filter(function (observer) {
                return observer.gatherActive(), observer.hasActive();
            });
            // Deliver notifications in a separate cycle in order to avoid any
            // collisions between observers, e.g. when multiple instances of
            // ResizeObserver are tracking the same element and the callback of one
            // of them changes content dimensions of the observed target. Sometimes
            // this may result in notifications being blocked for the rest of observers.
            activeObservers.forEach(function (observer) { return observer.broadcastActive(); });
            return activeObservers.length > 0;
        };
        /**
         * Initializes DOM listeners.
         *
         * @private
         * @returns {void}
         */
        ResizeObserverController.prototype.connect_ = function () {
            // Do nothing if running in a non-browser environment or if listeners
            // have been already added.
            if (!isBrowser || this.connected_) {
                return;
            }
            // Subscription to the "Transitionend" event is used as a workaround for
            // delayed transitions. This way it's possible to capture at least the
            // final state of an element.
            document.addEventListener('transitionend', this.onTransitionEnd_);
            window.addEventListener('resize', this.refresh);
            if (mutationObserverSupported) {
                this.mutationsObserver_ = new MutationObserver(this.refresh);
                this.mutationsObserver_.observe(document, {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                });
            }
            else {
                document.addEventListener('DOMSubtreeModified', this.refresh);
                this.mutationEventsAdded_ = true;
            }
            this.connected_ = true;
        };
        /**
         * Removes DOM listeners.
         *
         * @private
         * @returns {void}
         */
        ResizeObserverController.prototype.disconnect_ = function () {
            // Do nothing if running in a non-browser environment or if listeners
            // have been already removed.
            if (!isBrowser || !this.connected_) {
                return;
            }
            document.removeEventListener('transitionend', this.onTransitionEnd_);
            window.removeEventListener('resize', this.refresh);
            if (this.mutationsObserver_) {
                this.mutationsObserver_.disconnect();
            }
            if (this.mutationEventsAdded_) {
                document.removeEventListener('DOMSubtreeModified', this.refresh);
            }
            this.mutationsObserver_ = null;
            this.mutationEventsAdded_ = false;
            this.connected_ = false;
        };
        /**
         * "Transitionend" event handler.
         *
         * @private
         * @param {TransitionEvent} event
         * @returns {void}
         */
        ResizeObserverController.prototype.onTransitionEnd_ = function (_a) {
            var _b = _a.propertyName, propertyName = _b === void 0 ? '' : _b;
            // Detect whether transition may affect dimensions of an element.
            var isReflowProperty = transitionKeys.some(function (key) {
                return !!~propertyName.indexOf(key);
            });
            if (isReflowProperty) {
                this.refresh();
            }
        };
        /**
         * Returns instance of the ResizeObserverController.
         *
         * @returns {ResizeObserverController}
         */
        ResizeObserverController.getInstance = function () {
            if (!this.instance_) {
                this.instance_ = new ResizeObserverController();
            }
            return this.instance_;
        };
        /**
         * Holds reference to the controller's instance.
         *
         * @private {ResizeObserverController}
         */
        ResizeObserverController.instance_ = null;
        return ResizeObserverController;
    }());

    /**
     * Defines non-writable/enumerable properties of the provided target object.
     *
     * @param {Object} target - Object for which to define properties.
     * @param {Object} props - Properties to be defined.
     * @returns {Object} Target object.
     */
    var defineConfigurable = (function (target, props) {
        for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
            var key = _a[_i];
            Object.defineProperty(target, key, {
                value: props[key],
                enumerable: false,
                writable: false,
                configurable: true
            });
        }
        return target;
    });

    /**
     * Returns the global object associated with provided element.
     *
     * @param {Object} target
     * @returns {Object}
     */
    var getWindowOf = (function (target) {
        // Assume that the element is an instance of Node, which means that it
        // has the "ownerDocument" property from which we can retrieve a
        // corresponding global object.
        var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
        // Return the local global object if it's not possible extract one from
        // provided element.
        return ownerGlobal || global$1;
    });

    // Placeholder of an empty content rectangle.
    var emptyRect = createRectInit(0, 0, 0, 0);
    /**
     * Converts provided string to a number.
     *
     * @param {number|string} value
     * @returns {number}
     */
    function toFloat(value) {
        return parseFloat(value) || 0;
    }
    /**
     * Extracts borders size from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @param {...string} positions - Borders positions (top, right, ...)
     * @returns {number}
     */
    function getBordersSize(styles) {
        var positions = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            positions[_i - 1] = arguments[_i];
        }
        return positions.reduce(function (size, position) {
            var value = styles['border-' + position + '-width'];
            return size + toFloat(value);
        }, 0);
    }
    /**
     * Extracts paddings sizes from provided styles.
     *
     * @param {CSSStyleDeclaration} styles
     * @returns {Object} Paddings box.
     */
    function getPaddings(styles) {
        var positions = ['top', 'right', 'bottom', 'left'];
        var paddings = {};
        for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
            var position = positions_1[_i];
            var value = styles['padding-' + position];
            paddings[position] = toFloat(value);
        }
        return paddings;
    }
    /**
     * Calculates content rectangle of provided SVG element.
     *
     * @param {SVGGraphicsElement} target - Element content rectangle of which needs
     *      to be calculated.
     * @returns {DOMRectInit}
     */
    function getSVGContentRect(target) {
        var bbox = target.getBBox();
        return createRectInit(0, 0, bbox.width, bbox.height);
    }
    /**
     * Calculates content rectangle of provided HTMLElement.
     *
     * @param {HTMLElement} target - Element for which to calculate the content rectangle.
     * @returns {DOMRectInit}
     */
    function getHTMLElementContentRect(target) {
        // Client width & height properties can't be
        // used exclusively as they provide rounded values.
        var clientWidth = target.clientWidth, clientHeight = target.clientHeight;
        // By this condition we can catch all non-replaced inline, hidden and
        // detached elements. Though elements with width & height properties less
        // than 0.5 will be discarded as well.
        //
        // Without it we would need to implement separate methods for each of
        // those cases and it's not possible to perform a precise and performance
        // effective test for hidden elements. E.g. even jQuery's ':visible' filter
        // gives wrong results for elements with width & height less than 0.5.
        if (!clientWidth && !clientHeight) {
            return emptyRect;
        }
        var styles = getWindowOf(target).getComputedStyle(target);
        var paddings = getPaddings(styles);
        var horizPad = paddings.left + paddings.right;
        var vertPad = paddings.top + paddings.bottom;
        // Computed styles of width & height are being used because they are the
        // only dimensions available to JS that contain non-rounded values. It could
        // be possible to utilize the getBoundingClientRect if only it's data wasn't
        // affected by CSS transformations let alone paddings, borders and scroll bars.
        var width = toFloat(styles.width), height = toFloat(styles.height);
        // Width & height include paddings and borders when the 'border-box' box
        // model is applied (except for IE).
        if (styles.boxSizing === 'border-box') {
            // Following conditions are required to handle Internet Explorer which
            // doesn't include paddings and borders to computed CSS dimensions.
            //
            // We can say that if CSS dimensions + paddings are equal to the "client"
            // properties then it's either IE, and thus we don't need to subtract
            // anything, or an element merely doesn't have paddings/borders styles.
            if (Math.round(width + horizPad) !== clientWidth) {
                width -= getBordersSize(styles, 'left', 'right') + horizPad;
            }
            if (Math.round(height + vertPad) !== clientHeight) {
                height -= getBordersSize(styles, 'top', 'bottom') + vertPad;
            }
        }
        // Following steps can't be applied to the document's root element as its
        // client[Width/Height] properties represent viewport area of the window.
        // Besides, it's as well not necessary as the <html> itself neither has
        // rendered scroll bars nor it can be clipped.
        if (!isDocumentElement(target)) {
            // In some browsers (only in Firefox, actually) CSS width & height
            // include scroll bars size which can be removed at this step as scroll
            // bars are the only difference between rounded dimensions + paddings
            // and "client" properties, though that is not always true in Chrome.
            var vertScrollbar = Math.round(width + horizPad) - clientWidth;
            var horizScrollbar = Math.round(height + vertPad) - clientHeight;
            // Chrome has a rather weird rounding of "client" properties.
            // E.g. for an element with content width of 314.2px it sometimes gives
            // the client width of 315px and for the width of 314.7px it may give
            // 314px. And it doesn't happen all the time. So just ignore this delta
            // as a non-relevant.
            if (Math.abs(vertScrollbar) !== 1) {
                width -= vertScrollbar;
            }
            if (Math.abs(horizScrollbar) !== 1) {
                height -= horizScrollbar;
            }
        }
        return createRectInit(paddings.left, paddings.top, width, height);
    }
    /**
     * Checks whether provided element is an instance of the SVGGraphicsElement.
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */
    var isSVGGraphicsElement = (function () {
        // Some browsers, namely IE and Edge, don't have the SVGGraphicsElement
        // interface.
        if (typeof SVGGraphicsElement !== 'undefined') {
            return function (target) { return target instanceof getWindowOf(target).SVGGraphicsElement; };
        }
        // If it's so, then check that element is at least an instance of the
        // SVGElement and that it has the "getBBox" method.
        // eslint-disable-next-line no-extra-parens
        return function (target) { return (target instanceof getWindowOf(target).SVGElement &&
            typeof target.getBBox === 'function'); };
    })();
    /**
     * Checks whether provided element is a document element (<html>).
     *
     * @param {Element} target - Element to be checked.
     * @returns {boolean}
     */
    function isDocumentElement(target) {
        return target === getWindowOf(target).document.documentElement;
    }
    /**
     * Calculates an appropriate content rectangle for provided html or svg element.
     *
     * @param {Element} target - Element content rectangle of which needs to be calculated.
     * @returns {DOMRectInit}
     */
    function getContentRect(target) {
        if (!isBrowser) {
            return emptyRect;
        }
        if (isSVGGraphicsElement(target)) {
            return getSVGContentRect(target);
        }
        return getHTMLElementContentRect(target);
    }
    /**
     * Creates rectangle with an interface of the DOMRectReadOnly.
     * Spec: https://drafts.fxtf.org/geometry/#domrectreadonly
     *
     * @param {DOMRectInit} rectInit - Object with rectangle's x/y coordinates and dimensions.
     * @returns {DOMRectReadOnly}
     */
    function createReadOnlyRect(_a) {
        var x = _a.x, y = _a.y, width = _a.width, height = _a.height;
        // If DOMRectReadOnly is available use it as a prototype for the rectangle.
        var Constr = typeof DOMRectReadOnly !== 'undefined' ? DOMRectReadOnly : Object;
        var rect = Object.create(Constr.prototype);
        // Rectangle's properties are not writable and non-enumerable.
        defineConfigurable(rect, {
            x: x, y: y, width: width, height: height,
            top: y,
            right: x + width,
            bottom: height + y,
            left: x
        });
        return rect;
    }
    /**
     * Creates DOMRectInit object based on the provided dimensions and the x/y coordinates.
     * Spec: https://drafts.fxtf.org/geometry/#dictdef-domrectinit
     *
     * @param {number} x - X coordinate.
     * @param {number} y - Y coordinate.
     * @param {number} width - Rectangle's width.
     * @param {number} height - Rectangle's height.
     * @returns {DOMRectInit}
     */
    function createRectInit(x, y, width, height) {
        return { x: x, y: y, width: width, height: height };
    }

    /**
     * Class that is responsible for computations of the content rectangle of
     * provided DOM element and for keeping track of it's changes.
     */
    var ResizeObservation = /** @class */ (function () {
        /**
         * Creates an instance of ResizeObservation.
         *
         * @param {Element} target - Element to be observed.
         */
        function ResizeObservation(target) {
            /**
             * Broadcasted width of content rectangle.
             *
             * @type {number}
             */
            this.broadcastWidth = 0;
            /**
             * Broadcasted height of content rectangle.
             *
             * @type {number}
             */
            this.broadcastHeight = 0;
            /**
             * Reference to the last observed content rectangle.
             *
             * @private {DOMRectInit}
             */
            this.contentRect_ = createRectInit(0, 0, 0, 0);
            this.target = target;
        }
        /**
         * Updates content rectangle and tells whether it's width or height properties
         * have changed since the last broadcast.
         *
         * @returns {boolean}
         */
        ResizeObservation.prototype.isActive = function () {
            var rect = getContentRect(this.target);
            this.contentRect_ = rect;
            return (rect.width !== this.broadcastWidth ||
                rect.height !== this.broadcastHeight);
        };
        /**
         * Updates 'broadcastWidth' and 'broadcastHeight' properties with a data
         * from the corresponding properties of the last observed content rectangle.
         *
         * @returns {DOMRectInit} Last observed content rectangle.
         */
        ResizeObservation.prototype.broadcastRect = function () {
            var rect = this.contentRect_;
            this.broadcastWidth = rect.width;
            this.broadcastHeight = rect.height;
            return rect;
        };
        return ResizeObservation;
    }());

    var ResizeObserverEntry = /** @class */ (function () {
        /**
         * Creates an instance of ResizeObserverEntry.
         *
         * @param {Element} target - Element that is being observed.
         * @param {DOMRectInit} rectInit - Data of the element's content rectangle.
         */
        function ResizeObserverEntry(target, rectInit) {
            var contentRect = createReadOnlyRect(rectInit);
            // According to the specification following properties are not writable
            // and are also not enumerable in the native implementation.
            //
            // Property accessors are not being used as they'd require to define a
            // private WeakMap storage which may cause memory leaks in browsers that
            // don't support this type of collections.
            defineConfigurable(this, { target: target, contentRect: contentRect });
        }
        return ResizeObserverEntry;
    }());

    var ResizeObserverSPI = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserver.
         *
         * @param {ResizeObserverCallback} callback - Callback function that is invoked
         *      when one of the observed elements changes it's content dimensions.
         * @param {ResizeObserverController} controller - Controller instance which
         *      is responsible for the updates of observer.
         * @param {ResizeObserver} callbackCtx - Reference to the public
         *      ResizeObserver instance which will be passed to callback function.
         */
        function ResizeObserverSPI(callback, controller, callbackCtx) {
            /**
             * Collection of resize observations that have detected changes in dimensions
             * of elements.
             *
             * @private {Array<ResizeObservation>}
             */
            this.activeObservations_ = [];
            /**
             * Registry of the ResizeObservation instances.
             *
             * @private {Map<Element, ResizeObservation>}
             */
            this.observations_ = new MapShim();
            if (typeof callback !== 'function') {
                throw new TypeError('The callback provided as parameter 1 is not a function.');
            }
            this.callback_ = callback;
            this.controller_ = controller;
            this.callbackCtx_ = callbackCtx;
        }
        /**
         * Starts observing provided element.
         *
         * @param {Element} target - Element to be observed.
         * @returns {void}
         */
        ResizeObserverSPI.prototype.observe = function (target) {
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            // Do nothing if current environment doesn't have the Element interface.
            if (typeof Element === 'undefined' || !(Element instanceof Object)) {
                return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
                throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            // Do nothing if element is already being observed.
            if (observations.has(target)) {
                return;
            }
            observations.set(target, new ResizeObservation(target));
            this.controller_.addObserver(this);
            // Force the update of observations.
            this.controller_.refresh();
        };
        /**
         * Stops observing provided element.
         *
         * @param {Element} target - Element to stop observing.
         * @returns {void}
         */
        ResizeObserverSPI.prototype.unobserve = function (target) {
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            // Do nothing if current environment doesn't have the Element interface.
            if (typeof Element === 'undefined' || !(Element instanceof Object)) {
                return;
            }
            if (!(target instanceof getWindowOf(target).Element)) {
                throw new TypeError('parameter 1 is not of type "Element".');
            }
            var observations = this.observations_;
            // Do nothing if element is not being observed.
            if (!observations.has(target)) {
                return;
            }
            observations.delete(target);
            if (!observations.size) {
                this.controller_.removeObserver(this);
            }
        };
        /**
         * Stops observing all elements.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.disconnect = function () {
            this.clearActive();
            this.observations_.clear();
            this.controller_.removeObserver(this);
        };
        /**
         * Collects observation instances the associated element of which has changed
         * it's content rectangle.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.gatherActive = function () {
            var _this = this;
            this.clearActive();
            this.observations_.forEach(function (observation) {
                if (observation.isActive()) {
                    _this.activeObservations_.push(observation);
                }
            });
        };
        /**
         * Invokes initial callback function with a list of ResizeObserverEntry
         * instances collected from active resize observations.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.broadcastActive = function () {
            // Do nothing if observer doesn't have active observations.
            if (!this.hasActive()) {
                return;
            }
            var ctx = this.callbackCtx_;
            // Create ResizeObserverEntry instance for every active observation.
            var entries = this.activeObservations_.map(function (observation) {
                return new ResizeObserverEntry(observation.target, observation.broadcastRect());
            });
            this.callback_.call(ctx, entries, ctx);
            this.clearActive();
        };
        /**
         * Clears the collection of active observations.
         *
         * @returns {void}
         */
        ResizeObserverSPI.prototype.clearActive = function () {
            this.activeObservations_.splice(0);
        };
        /**
         * Tells whether observer has active observations.
         *
         * @returns {boolean}
         */
        ResizeObserverSPI.prototype.hasActive = function () {
            return this.activeObservations_.length > 0;
        };
        return ResizeObserverSPI;
    }());

    // Registry of internal observers. If WeakMap is not available use current shim
    // for the Map collection as it has all required methods and because WeakMap
    // can't be fully polyfilled anyway.
    var observers = typeof WeakMap !== 'undefined' ? new WeakMap() : new MapShim();
    /**
     * ResizeObserver API. Encapsulates the ResizeObserver SPI implementation
     * exposing only those methods and properties that are defined in the spec.
     */
    var ResizeObserver = /** @class */ (function () {
        /**
         * Creates a new instance of ResizeObserver.
         *
         * @param {ResizeObserverCallback} callback - Callback that is invoked when
         *      dimensions of the observed elements change.
         */
        function ResizeObserver(callback) {
            if (!(this instanceof ResizeObserver)) {
                throw new TypeError('Cannot call a class as a function.');
            }
            if (!arguments.length) {
                throw new TypeError('1 argument required, but only 0 present.');
            }
            var controller = ResizeObserverController.getInstance();
            var observer = new ResizeObserverSPI(callback, controller, this);
            observers.set(this, observer);
        }
        return ResizeObserver;
    }());
    // Expose public methods of ResizeObserver.
    [
        'observe',
        'unobserve',
        'disconnect'
    ].forEach(function (method) {
        ResizeObserver.prototype[method] = function () {
            var _a;
            return (_a = observers.get(this))[method].apply(_a, arguments);
        };
    });

    var index = (function () {
        // Export existing implementation if available.
        if (typeof global$1.ResizeObserver !== 'undefined') {
            return global$1.ResizeObserver;
        }
        return ResizeObserver;
    })();

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var PERFECT_SCROLLBAR_CONFIG = new core.InjectionToken('PERFECT_SCROLLBAR_CONFIG');
    var Geometry = /** @class */ (function () {
        function Geometry(x, y, w, h) {
            this.x = x;
            this.y = y;
            this.w = w;
            this.h = h;
        }
        return Geometry;
    }());
    var Position = /** @class */ (function () {
        function Position(x, y) {
            this.x = x;
            this.y = y;
        }
        return Position;
    }());
    /** @type {?} */
    var PerfectScrollbarEvents = [
        'psScrollY',
        'psScrollX',
        'psScrollUp',
        'psScrollDown',
        'psScrollLeft',
        'psScrollRight',
        'psYReachEnd',
        'psYReachStart',
        'psXReachEnd',
        'psXReachStart'
    ];
    var PerfectScrollbarConfig = /** @class */ (function () {
        function PerfectScrollbarConfig(config) {
            if (config === void 0) { config = {}; }
            this.assign(config);
        }
        /**
         * @param {?=} config
         * @return {?}
         */
        PerfectScrollbarConfig.prototype.assign = /**
         * @param {?=} config
         * @return {?}
         */
        function (config) {
            if (config === void 0) { config = {}; }
            for (var key in config) {
                this[(/** @type {?} */ (key))] = config[(/** @type {?} */ (key))];
            }
        };
        return PerfectScrollbarConfig;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PerfectScrollbarDirective = /** @class */ (function () {
        function PerfectScrollbarDirective(zone, differs, elementRef, platformId, defaults) {
            this.zone = zone;
            this.differs = differs;
            this.elementRef = elementRef;
            this.platformId = platformId;
            this.defaults = defaults;
            this.instance = null;
            this.ro = null;
            this.timeout = null;
            this.animation = null;
            this.configDiff = null;
            this.ngDestroy = new rxjs.Subject();
            this.disabled = false;
            this.psScrollY = new core.EventEmitter();
            this.psScrollX = new core.EventEmitter();
            this.psScrollUp = new core.EventEmitter();
            this.psScrollDown = new core.EventEmitter();
            this.psScrollLeft = new core.EventEmitter();
            this.psScrollRight = new core.EventEmitter();
            this.psYReachEnd = new core.EventEmitter();
            this.psYReachStart = new core.EventEmitter();
            this.psXReachEnd = new core.EventEmitter();
            this.psXReachStart = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.ngOnInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            if (!this.disabled && common.isPlatformBrowser(this.platformId)) {
                /** @type {?} */
                var config_1 = new PerfectScrollbarConfig(this.defaults);
                config_1.assign(this.config); // Custom configuration
                this.zone.runOutsideAngular((/**
                 * @return {?}
                 */
                function () {
                    _this.instance = new PerfectScrollbar(_this.elementRef.nativeElement, config_1);
                }));
                if (!this.configDiff) {
                    this.configDiff = this.differs.find(this.config || {}).create();
                    this.configDiff.diff(this.config || {});
                }
                this.zone.runOutsideAngular((/**
                 * @return {?}
                 */
                function () {
                    _this.ro = new index((/**
                     * @return {?}
                     */
                    function () {
                        _this.update();
                    }));
                    if (_this.elementRef.nativeElement.children[0]) {
                        _this.ro.observe(_this.elementRef.nativeElement.children[0]);
                    }
                    _this.ro.observe(_this.elementRef.nativeElement);
                }));
                this.zone.runOutsideAngular((/**
                 * @return {?}
                 */
                function () {
                    PerfectScrollbarEvents.forEach((/**
                     * @param {?} eventName
                     * @return {?}
                     */
                    function (eventName) {
                        /** @type {?} */
                        var eventType = eventName.replace(/([A-Z])/g, (/**
                         * @param {?} c
                         * @return {?}
                         */
                        function (c) { return "-" + c.toLowerCase(); }));
                        rxjs.fromEvent(_this.elementRef.nativeElement, eventType)
                            .pipe(operators.auditTime(20), operators.takeUntil(_this.ngDestroy))
                            .subscribe((/**
                         * @param {?} event
                         * @return {?}
                         */
                        function (event) {
                            _this[eventName].emit(event);
                        }));
                    }));
                }));
            }
        };
        /**
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () {
            var _this = this;
            if (common.isPlatformBrowser(this.platformId)) {
                this.ngDestroy.next();
                this.ngDestroy.complete();
                if (this.ro) {
                    this.ro.disconnect();
                }
                if (this.timeout && typeof window !== 'undefined') {
                    window.clearTimeout(this.timeout);
                }
                this.zone.runOutsideAngular((/**
                 * @return {?}
                 */
                function () {
                    if (_this.instance) {
                        _this.instance.destroy();
                    }
                }));
                this.instance = null;
            }
        };
        /**
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.ngDoCheck = /**
         * @return {?}
         */
        function () {
            if (!this.disabled && this.configDiff && common.isPlatformBrowser(this.platformId)) {
                /** @type {?} */
                var changes = this.configDiff.diff(this.config || {});
                if (changes) {
                    this.ngOnDestroy();
                    this.ngOnInit();
                }
            }
        };
        /**
         * @param {?} changes
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
        function (changes) {
            if (changes['disabled'] && !changes['disabled'].isFirstChange() && common.isPlatformBrowser(this.platformId)) {
                if (changes['disabled'].currentValue !== changes['disabled'].previousValue) {
                    if (changes['disabled'].currentValue === true) {
                        this.ngOnDestroy();
                    }
                    else if (changes['disabled'].currentValue === false) {
                        this.ngOnInit();
                    }
                }
            }
        };
        /**
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.ps = /**
         * @return {?}
         */
        function () {
            return this.instance;
        };
        /**
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.update = /**
         * @return {?}
         */
        function () {
            var _this = this;
            if (typeof window !== 'undefined') {
                if (this.timeout) {
                    window.clearTimeout(this.timeout);
                }
                this.timeout = window.setTimeout((/**
                 * @return {?}
                 */
                function () {
                    if (!_this.disabled && _this.configDiff) {
                        try {
                            _this.zone.runOutsideAngular((/**
                             * @return {?}
                             */
                            function () {
                                if (_this.instance) {
                                    _this.instance.update();
                                }
                            }));
                        }
                        catch (error) {
                            // Update can be finished after destroy so catch errors
                        }
                    }
                }), 0);
            }
        };
        /**
         * @param {?=} prefix
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.geometry = /**
         * @param {?=} prefix
         * @return {?}
         */
        function (prefix) {
            if (prefix === void 0) { prefix = 'scroll'; }
            return new Geometry(this.elementRef.nativeElement[prefix + 'Left'], this.elementRef.nativeElement[prefix + 'Top'], this.elementRef.nativeElement[prefix + 'Width'], this.elementRef.nativeElement[prefix + 'Height']);
        };
        /**
         * @param {?=} absolute
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.position = /**
         * @param {?=} absolute
         * @return {?}
         */
        function (absolute) {
            if (absolute === void 0) { absolute = false; }
            if (!absolute && this.instance) {
                return new Position(this.instance.reach.x || 0, this.instance.reach.y || 0);
            }
            else {
                return new Position(this.elementRef.nativeElement.scrollLeft, this.elementRef.nativeElement.scrollTop);
            }
        };
        /**
         * @param {?=} direction
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.scrollable = /**
         * @param {?=} direction
         * @return {?}
         */
        function (direction) {
            if (direction === void 0) { direction = 'any'; }
            /** @type {?} */
            var element = this.elementRef.nativeElement;
            if (direction === 'any') {
                return element.classList.contains('ps--active-x') ||
                    element.classList.contains('ps--active-y');
            }
            else if (direction === 'both') {
                return element.classList.contains('ps--active-x') &&
                    element.classList.contains('ps--active-y');
            }
            else {
                return element.classList.contains('ps--active-' + direction);
            }
        };
        /**
         * @param {?} x
         * @param {?=} y
         * @param {?=} speed
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.scrollTo = /**
         * @param {?} x
         * @param {?=} y
         * @param {?=} speed
         * @return {?}
         */
        function (x, y, speed) {
            if (!this.disabled) {
                if (y == null && speed == null) {
                    this.animateScrolling('scrollTop', x, speed);
                }
                else {
                    if (x != null) {
                        this.animateScrolling('scrollLeft', x, speed);
                    }
                    if (y != null) {
                        this.animateScrolling('scrollTop', y, speed);
                    }
                }
            }
        };
        /**
         * @param {?} x
         * @param {?=} speed
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.scrollToX = /**
         * @param {?} x
         * @param {?=} speed
         * @return {?}
         */
        function (x, speed) {
            this.animateScrolling('scrollLeft', x, speed);
        };
        /**
         * @param {?} y
         * @param {?=} speed
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.scrollToY = /**
         * @param {?} y
         * @param {?=} speed
         * @return {?}
         */
        function (y, speed) {
            this.animateScrolling('scrollTop', y, speed);
        };
        /**
         * @param {?=} offset
         * @param {?=} speed
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.scrollToTop = /**
         * @param {?=} offset
         * @param {?=} speed
         * @return {?}
         */
        function (offset, speed) {
            this.animateScrolling('scrollTop', (offset || 0), speed);
        };
        /**
         * @param {?=} offset
         * @param {?=} speed
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.scrollToLeft = /**
         * @param {?=} offset
         * @param {?=} speed
         * @return {?}
         */
        function (offset, speed) {
            this.animateScrolling('scrollLeft', (offset || 0), speed);
        };
        /**
         * @param {?=} offset
         * @param {?=} speed
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.scrollToRight = /**
         * @param {?=} offset
         * @param {?=} speed
         * @return {?}
         */
        function (offset, speed) {
            /** @type {?} */
            var left = this.elementRef.nativeElement.scrollWidth -
                this.elementRef.nativeElement.clientWidth;
            this.animateScrolling('scrollLeft', left - (offset || 0), speed);
        };
        /**
         * @param {?=} offset
         * @param {?=} speed
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.scrollToBottom = /**
         * @param {?=} offset
         * @param {?=} speed
         * @return {?}
         */
        function (offset, speed) {
            /** @type {?} */
            var top = this.elementRef.nativeElement.scrollHeight -
                this.elementRef.nativeElement.clientHeight;
            this.animateScrolling('scrollTop', top - (offset || 0), speed);
        };
        /**
         * @param {?} qs
         * @param {?=} offset
         * @param {?=} speed
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.scrollToElement = /**
         * @param {?} qs
         * @param {?=} offset
         * @param {?=} speed
         * @return {?}
         */
        function (qs, offset, speed) {
            /** @type {?} */
            var element = this.elementRef.nativeElement.querySelector(qs);
            if (element) {
                /** @type {?} */
                var elementPos = element.getBoundingClientRect();
                /** @type {?} */
                var scrollerPos = this.elementRef.nativeElement.getBoundingClientRect();
                if (this.elementRef.nativeElement.classList.contains('ps--active-x')) {
                    /** @type {?} */
                    var currentPos = this.elementRef.nativeElement['scrollLeft'];
                    /** @type {?} */
                    var position = elementPos.left - scrollerPos.left + currentPos;
                    this.animateScrolling('scrollLeft', position + (offset || 0), speed);
                }
                if (this.elementRef.nativeElement.classList.contains('ps--active-y')) {
                    /** @type {?} */
                    var currentPos = this.elementRef.nativeElement['scrollTop'];
                    /** @type {?} */
                    var position = elementPos.top - scrollerPos.top + currentPos;
                    this.animateScrolling('scrollTop', position + (offset || 0), speed);
                }
            }
        };
        /**
         * @private
         * @param {?} target
         * @param {?} value
         * @param {?=} speed
         * @return {?}
         */
        PerfectScrollbarDirective.prototype.animateScrolling = /**
         * @private
         * @param {?} target
         * @param {?} value
         * @param {?=} speed
         * @return {?}
         */
        function (target, value, speed) {
            var _this = this;
            if (this.animation) {
                window.cancelAnimationFrame(this.animation);
                this.animation = null;
            }
            if (!speed || typeof window === 'undefined') {
                this.elementRef.nativeElement[target] = value;
            }
            else if (value !== this.elementRef.nativeElement[target]) {
                /** @type {?} */
                var newValue_1 = 0;
                /** @type {?} */
                var scrollCount_1 = 0;
                /** @type {?} */
                var oldTimestamp_1 = performance.now();
                /** @type {?} */
                var oldValue_1 = this.elementRef.nativeElement[target];
                /** @type {?} */
                var cosParameter_1 = (oldValue_1 - value) / 2;
                /** @type {?} */
                var step_1 = (/**
                 * @param {?} newTimestamp
                 * @return {?}
                 */
                function (newTimestamp) {
                    scrollCount_1 += Math.PI / (speed / (newTimestamp - oldTimestamp_1));
                    newValue_1 = Math.round(value + cosParameter_1 + cosParameter_1 * Math.cos(scrollCount_1));
                    // Only continue animation if scroll position has not changed
                    if (_this.elementRef.nativeElement[target] === oldValue_1) {
                        if (scrollCount_1 >= Math.PI) {
                            _this.animateScrolling(target, value, 0);
                        }
                        else {
                            _this.elementRef.nativeElement[target] = newValue_1;
                            // On a zoomed out page the resulting offset may differ
                            oldValue_1 = _this.elementRef.nativeElement[target];
                            oldTimestamp_1 = newTimestamp;
                            _this.animation = window.requestAnimationFrame(step_1);
                        }
                    }
                });
                window.requestAnimationFrame(step_1);
            }
        };
        PerfectScrollbarDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[perfectScrollbar]',
                        exportAs: 'ngxPerfectScrollbar'
                    },] }
        ];
        /** @nocollapse */
        PerfectScrollbarDirective.ctorParameters = function () { return [
            { type: core.NgZone },
            { type: core.KeyValueDiffers },
            { type: core.ElementRef },
            { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] }] },
            { type: undefined, decorators: [{ type: core.Optional }, { type: core.Inject, args: [PERFECT_SCROLLBAR_CONFIG,] }] }
        ]; };
        PerfectScrollbarDirective.propDecorators = {
            disabled: [{ type: core.Input }],
            config: [{ type: core.Input, args: ['perfectScrollbar',] }],
            psScrollY: [{ type: core.Output }],
            psScrollX: [{ type: core.Output }],
            psScrollUp: [{ type: core.Output }],
            psScrollDown: [{ type: core.Output }],
            psScrollLeft: [{ type: core.Output }],
            psScrollRight: [{ type: core.Output }],
            psYReachEnd: [{ type: core.Output }],
            psYReachStart: [{ type: core.Output }],
            psXReachEnd: [{ type: core.Output }],
            psXReachStart: [{ type: core.Output }]
        };
        return PerfectScrollbarDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PerfectScrollbarComponent = /** @class */ (function () {
        function PerfectScrollbarComponent(zone, cdRef, platformId) {
            this.zone = zone;
            this.cdRef = cdRef;
            this.platformId = platformId;
            this.states = {};
            this.indicatorX = false;
            this.indicatorY = false;
            this.interaction = false;
            this.scrollPositionX = 0;
            this.scrollPositionY = 0;
            this.scrollDirectionX = 0;
            this.scrollDirectionY = 0;
            this.usePropagationX = false;
            this.usePropagationY = false;
            this.allowPropagationX = false;
            this.allowPropagationY = false;
            this.stateTimeout = null;
            this.ngDestroy = new rxjs.Subject();
            this.stateUpdate = new rxjs.Subject();
            this.disabled = false;
            this.usePSClass = true;
            this.autoPropagation = false;
            this.scrollIndicators = false;
            this.psScrollY = new core.EventEmitter();
            this.psScrollX = new core.EventEmitter();
            this.psScrollUp = new core.EventEmitter();
            this.psScrollDown = new core.EventEmitter();
            this.psScrollLeft = new core.EventEmitter();
            this.psScrollRight = new core.EventEmitter();
            this.psYReachEnd = new core.EventEmitter();
            this.psYReachStart = new core.EventEmitter();
            this.psXReachEnd = new core.EventEmitter();
            this.psXReachStart = new core.EventEmitter();
        }
        /**
         * @return {?}
         */
        PerfectScrollbarComponent.prototype.ngOnInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            if (common.isPlatformBrowser(this.platformId)) {
                this.stateUpdate
                    .pipe(operators.takeUntil(this.ngDestroy), operators.distinctUntilChanged((/**
                 * @param {?} a
                 * @param {?} b
                 * @return {?}
                 */
                function (a, b) { return (a === b && !_this.stateTimeout); })))
                    .subscribe((/**
                 * @param {?} state
                 * @return {?}
                 */
                function (state) {
                    if (_this.stateTimeout && typeof window !== 'undefined') {
                        window.clearTimeout(_this.stateTimeout);
                        _this.stateTimeout = null;
                    }
                    if (state === 'x' || state === 'y') {
                        _this.interaction = false;
                        if (state === 'x') {
                            _this.indicatorX = false;
                            _this.states.left = false;
                            _this.states.right = false;
                            if (_this.autoPropagation && _this.usePropagationX) {
                                _this.allowPropagationX = false;
                            }
                        }
                        else if (state === 'y') {
                            _this.indicatorY = false;
                            _this.states.top = false;
                            _this.states.bottom = false;
                            if (_this.autoPropagation && _this.usePropagationY) {
                                _this.allowPropagationY = false;
                            }
                        }
                    }
                    else {
                        if (state === 'left' || state === 'right') {
                            _this.states.left = false;
                            _this.states.right = false;
                            _this.states[state] = true;
                            if (_this.autoPropagation && _this.usePropagationX) {
                                _this.indicatorX = true;
                            }
                        }
                        else if (state === 'top' || state === 'bottom') {
                            _this.states.top = false;
                            _this.states.bottom = false;
                            _this.states[state] = true;
                            if (_this.autoPropagation && _this.usePropagationY) {
                                _this.indicatorY = true;
                            }
                        }
                        if (_this.autoPropagation && typeof window !== 'undefined') {
                            _this.stateTimeout = window.setTimeout((/**
                             * @return {?}
                             */
                            function () {
                                _this.indicatorX = false;
                                _this.indicatorY = false;
                                _this.stateTimeout = null;
                                if (_this.interaction && (_this.states.left || _this.states.right)) {
                                    _this.allowPropagationX = true;
                                }
                                if (_this.interaction && (_this.states.top || _this.states.bottom)) {
                                    _this.allowPropagationY = true;
                                }
                                _this.cdRef.markForCheck();
                            }), 500);
                        }
                    }
                    _this.cdRef.markForCheck();
                    _this.cdRef.detectChanges();
                }));
                this.zone.runOutsideAngular((/**
                 * @return {?}
                 */
                function () {
                    if (_this.directiveRef) {
                        /** @type {?} */
                        var element = _this.directiveRef.elementRef.nativeElement;
                        rxjs.fromEvent(element, 'wheel')
                            .pipe(operators.takeUntil(_this.ngDestroy))
                            .subscribe((/**
                         * @param {?} event
                         * @return {?}
                         */
                        function (event) {
                            if (!_this.disabled && _this.autoPropagation) {
                                /** @type {?} */
                                var scrollDeltaX = event.deltaX;
                                /** @type {?} */
                                var scrollDeltaY = event.deltaY;
                                _this.checkPropagation(event, scrollDeltaX, scrollDeltaY);
                            }
                        }));
                        rxjs.fromEvent(element, 'touchmove')
                            .pipe(operators.takeUntil(_this.ngDestroy))
                            .subscribe((/**
                         * @param {?} event
                         * @return {?}
                         */
                        function (event) {
                            if (!_this.disabled && _this.autoPropagation) {
                                /** @type {?} */
                                var scrollPositionX = event.touches[0].clientX;
                                /** @type {?} */
                                var scrollPositionY = event.touches[0].clientY;
                                /** @type {?} */
                                var scrollDeltaX = scrollPositionX - _this.scrollPositionX;
                                /** @type {?} */
                                var scrollDeltaY = scrollPositionY - _this.scrollPositionY;
                                _this.checkPropagation(event, scrollDeltaX, scrollDeltaY);
                                _this.scrollPositionX = scrollPositionX;
                                _this.scrollPositionY = scrollPositionY;
                            }
                        }));
                        rxjs.merge(rxjs.fromEvent(element, 'ps-scroll-x')
                            .pipe(operators.mapTo('x')), rxjs.fromEvent(element, 'ps-scroll-y')
                            .pipe(operators.mapTo('y')), rxjs.fromEvent(element, 'ps-x-reach-end')
                            .pipe(operators.mapTo('right')), rxjs.fromEvent(element, 'ps-y-reach-end')
                            .pipe(operators.mapTo('bottom')), rxjs.fromEvent(element, 'ps-x-reach-start')
                            .pipe(operators.mapTo('left')), rxjs.fromEvent(element, 'ps-y-reach-start')
                            .pipe(operators.mapTo('top')))
                            .pipe(operators.takeUntil(_this.ngDestroy))
                            .subscribe((/**
                         * @param {?} state
                         * @return {?}
                         */
                        function (state) {
                            if (!_this.disabled && (_this.autoPropagation || _this.scrollIndicators)) {
                                _this.stateUpdate.next(state);
                            }
                        }));
                    }
                }));
                window.setTimeout((/**
                 * @return {?}
                 */
                function () {
                    PerfectScrollbarEvents.forEach((/**
                     * @param {?} eventName
                     * @return {?}
                     */
                    function (eventName) {
                        if (_this.directiveRef) {
                            _this.directiveRef[eventName] = _this[eventName];
                        }
                    }));
                }), 0);
            }
        };
        /**
         * @return {?}
         */
        PerfectScrollbarComponent.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () {
            if (common.isPlatformBrowser(this.platformId)) {
                this.ngDestroy.next();
                this.ngDestroy.unsubscribe();
                if (this.stateTimeout && typeof window !== 'undefined') {
                    window.clearTimeout(this.stateTimeout);
                }
            }
        };
        /**
         * @return {?}
         */
        PerfectScrollbarComponent.prototype.ngDoCheck = /**
         * @return {?}
         */
        function () {
            if (common.isPlatformBrowser(this.platformId)) {
                if (!this.disabled && this.autoPropagation && this.directiveRef) {
                    /** @type {?} */
                    var element = this.directiveRef.elementRef.nativeElement;
                    this.usePropagationX = element.classList.contains('ps--active-x');
                    this.usePropagationY = element.classList.contains('ps--active-y');
                }
            }
        };
        /**
         * @private
         * @param {?} event
         * @param {?} deltaX
         * @param {?} deltaY
         * @return {?}
         */
        PerfectScrollbarComponent.prototype.checkPropagation = /**
         * @private
         * @param {?} event
         * @param {?} deltaX
         * @param {?} deltaY
         * @return {?}
         */
        function (event, deltaX, deltaY) {
            this.interaction = true;
            /** @type {?} */
            var scrollDirectionX = (deltaX < 0) ? -1 : 1;
            /** @type {?} */
            var scrollDirectionY = (deltaY < 0) ? -1 : 1;
            if ((this.usePropagationX && this.usePropagationY) ||
                (this.usePropagationX && (!this.allowPropagationX ||
                    (this.scrollDirectionX !== scrollDirectionX))) ||
                (this.usePropagationY && (!this.allowPropagationY ||
                    (this.scrollDirectionY !== scrollDirectionY)))) {
                event.preventDefault();
                event.stopPropagation();
            }
            if (!!deltaX) {
                this.scrollDirectionX = scrollDirectionX;
            }
            if (!!deltaY) {
                this.scrollDirectionY = scrollDirectionY;
            }
            this.stateUpdate.next('interaction');
            this.cdRef.detectChanges();
        };
        PerfectScrollbarComponent.decorators = [
            { type: core.Component, args: [{
                        selector: 'perfect-scrollbar',
                        exportAs: 'ngxPerfectScrollbar',
                        template: "<div style=\"position: static;\" [class.ps]=\"usePSClass\" [perfectScrollbar]=\"config\" [disabled]=\"disabled\">\r\n  <div class=\"ps-content\">\r\n    <ng-content></ng-content>\r\n  </div>\r\n\r\n  <div *ngIf=\"scrollIndicators\" class=\"ps-overlay\" [class.ps-at-top]=\"states.top\" [class.ps-at-left]=\"states.left\" [class.ps-at-right]=\"states.right\" [class.ps-at-bottom]=\"states.bottom\">\r\n    <div class=\"ps-indicator-top\" [class.ps-indicator-show]=\"indicatorY && interaction\"></div>\r\n    <div class=\"ps-indicator-left\" [class.ps-indicator-show]=\"indicatorX && interaction\"></div>\r\n    <div class=\"ps-indicator-right\" [class.ps-indicator-show]=\"indicatorX && interaction\"></div>\r\n    <div class=\"ps-indicator-bottom\" [class.ps-indicator-show]=\"indicatorY && interaction\"></div>\r\n  </div>\r\n</div>\r\n",
                        encapsulation: core.ViewEncapsulation.None,
                        styles: ["/*\r\n  TODO: Remove important flags after this bug if fixed:\r\n  https://github.com/angular/flex-layout/issues/381\r\n*/\r\n\r\nperfect-scrollbar {\r\n  position: relative;\r\n\r\n  display: block;\r\n  overflow: hidden;\r\n  width: 100%;\r\n  height: 100%;\r\n  max-width: 100%;\r\n  max-height: 100%;\r\n}\r\n\r\nperfect-scrollbar[hidden] {\r\n  display: none;\r\n}\r\n\r\nperfect-scrollbar[fxflex] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  height: auto;\r\n  min-width: 0;\r\n  min-height: 0;\r\n\r\n  -webkit-box-direction: column;\r\n  -webkit-box-orient: column;\r\n}\r\n\r\nperfect-scrollbar[fxflex] > .ps {\r\n  -ms-flex: 1 1 auto;\r\n\r\n  flex: 1 1 auto;\r\n  width: auto;\r\n  height: auto;\r\n  min-width: 0;\r\n  min-height: 0;\r\n\r\n  -webkit-box-flex: 1;\r\n}\r\n\r\nperfect-scrollbar[fxlayout] > .ps,\r\nperfect-scrollbar[fxlayout] > .ps > .ps-content {\r\n  display: flex;\r\n\r\n  -ms-flex: 1 1 auto;\r\n\r\n  flex: 1 1 auto;\r\n  flex-direction: inherit;\r\n  align-items: inherit;\r\n  align-content: inherit;\r\n  justify-content: inherit;\r\n  width: 100%;\r\n  height: 100%;\r\n\r\n  -webkit-box-align: inherit;\r\n  -webkit-box-direction: inherit;\r\n  -webkit-box-flex: 1;\r\n  -webkit-box-orient: inherit;\r\n  -webkit-box-pack: inherit;\r\n}\r\n\r\nperfect-scrollbar[fxlayout='row'] > .ps,\r\nperfect-scrollbar[fxlayout='row'] > .ps > .ps-content, {\r\n  flex-direction: row !important;\r\n\r\n  -webkit-box-direction: row !important;\r\n  -webkit-box-orient: row !important;\r\n}\r\n\r\nperfect-scrollbar[fxlayout='column'] > .ps,\r\nperfect-scrollbar[fxlayout='column'] > .ps > .ps-content {\r\n  flex-direction: column !important;\r\n\r\n  -webkit-box-direction: column !important;\r\n  -webkit-box-orient: column !important;\r\n}\r\n\r\nperfect-scrollbar > .ps {\r\n  position: static;\r\n\r\n  display: block;\r\n  width: inherit;\r\n  height: inherit;\r\n  max-width: inherit;\r\n  max-height: inherit;\r\n}\r\n\r\nperfect-scrollbar > .ps textarea {\r\n  -ms-overflow-style: scrollbar;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay {\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n\r\n  display: block;\r\n  overflow: hidden;\r\n\r\n  pointer-events: none;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-top,\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-left,\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-right,\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-bottom {\r\n  position: absolute;\r\n\r\n  opacity: 0;\r\n\r\n  transition: opacity 300ms ease-in-out;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-top,\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-bottom {\r\n  left: 0;\r\n\r\n  min-width: 100%;\r\n  min-height: 24px;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-left,\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-right {\r\n  top: 0;\r\n\r\n  min-width: 24px;\r\n  min-height: 100%;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-top {\r\n  top: 0;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-left {\r\n  left: 0;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-right {\r\n  right: 0;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-bottom {\r\n  bottom: 0;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-y > .ps__rail-y {\r\n  top: 0 !important;\r\n  right: 0 !important;\r\n  left: auto !important;\r\n\r\n  width: 10px;\r\n\r\n  cursor: default;\r\n\r\n  transition:\r\n    width 200ms linear,\r\n    opacity 200ms linear,\r\n    background-color 200ms linear;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-y > .ps__rail-y:hover,\r\nperfect-scrollbar > .ps.ps--active-y > .ps__rail-y.ps--clicking {\r\n  width: 15px;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-x > .ps__rail-x {\r\n  top: auto !important;\r\n  bottom: 0 !important;\r\n  left: 0 !important;\r\n\r\n  height: 10px;\r\n\r\n  cursor: default;\r\n\r\n  transition:\r\n    height 200ms linear,\r\n    opacity 200ms linear,\r\n    background-color 200ms linear;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-x > .ps__rail-x:hover,\r\nperfect-scrollbar > .ps.ps--active-x > .ps__rail-x.ps--clicking {\r\n  height: 15px;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-x.ps--active-y > .ps__rail-y {\r\n  margin: 0 0 10px;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-x.ps--active-y > .ps__rail-x {\r\n  margin: 0 10px 0 0;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--scrolling-y > .ps__rail-y,\r\nperfect-scrollbar > .ps.ps--scrolling-x > .ps__rail-x {\r\n  opacity: 0.9;\r\n\r\n  background-color: #eee;\r\n}\r\n\r\nperfect-scrollbar.ps-show-always > .ps.ps--active-y > .ps__rail-y,\r\nperfect-scrollbar.ps-show-always > .ps.ps--active-x > .ps__rail-x {\r\n  opacity: 0.6;\r\n}\r\n\r\nperfect-scrollbar.ps-show-active > .ps.ps--active-y > .ps-overlay:not(.ps-at-top) .ps-indicator-top {\r\n  opacity: 1;\r\n\r\n  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active > .ps.ps--active-y > .ps-overlay:not(.ps-at-bottom) .ps-indicator-bottom {\r\n  opacity: 1;\r\n\r\n  background: linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active > .ps.ps--active-x > .ps-overlay:not(.ps-at-left) .ps-indicator-left {\r\n  opacity: 1;\r\n\r\n  background: linear-gradient(to right, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active > .ps.ps--active-x > .ps-overlay:not(.ps-at-right) .ps-indicator-right {\r\n  opacity: 1;\r\n\r\n  background: linear-gradient(to left, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-y > .ps-overlay.ps-at-top .ps-indicator-top {\r\n  background: linear-gradient(to bottom, rgba(170, 170, 170, 0.5) 0%, rgba(170, 170, 170, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-y > .ps-overlay.ps-at-bottom .ps-indicator-bottom {\r\n  background: linear-gradient(to top, rgba(170, 170, 170, 0.5) 0%, rgba(170, 170, 170, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-x > .ps-overlay.ps-at-left .ps-indicator-left {\r\n  background: linear-gradient(to right, rgba(170, 170, 170, 0.5) 0%, rgba(170, 170, 170, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-x > .ps-overlay.ps-at-right .ps-indicator-right {\r\n  background: linear-gradient(to left, rgba(170, 170, 170, 0.5) 0%, rgba(170, 170, 170, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-y > .ps-overlay.ps-at-top .ps-indicator-top.ps-indicator-show,\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-y > .ps-overlay.ps-at-bottom .ps-indicator-bottom.ps-indicator-show,\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-x > .ps-overlay.ps-at-left .ps-indicator-left.ps-indicator-show,\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-x > .ps-overlay.ps-at-right .ps-indicator-right.ps-indicator-show {\r\n  opacity: 1;\r\n}\r\n", "/*\n * Container style\n */\n.ps {\n  overflow: hidden !important;\n  overflow-anchor: none;\n  -ms-overflow-style: none;\n  touch-action: auto;\n  -ms-touch-action: auto;\n}\n\n/*\n * Scrollbar rail styles\n */\n.ps__rail-x {\n  display: none;\n  opacity: 0;\n  transition: background-color .2s linear, opacity .2s linear;\n  -webkit-transition: background-color .2s linear, opacity .2s linear;\n  height: 15px;\n  /* there must be 'bottom' or 'top' for ps__rail-x */\n  bottom: 0px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__rail-y {\n  display: none;\n  opacity: 0;\n  transition: background-color .2s linear, opacity .2s linear;\n  -webkit-transition: background-color .2s linear, opacity .2s linear;\n  width: 15px;\n  /* there must be 'right' or 'left' for ps__rail-y */\n  right: 0;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps--active-x > .ps__rail-x,\n.ps--active-y > .ps__rail-y {\n  display: block;\n  background-color: transparent;\n}\n\n.ps:hover > .ps__rail-x,\n.ps:hover > .ps__rail-y,\n.ps--focus > .ps__rail-x,\n.ps--focus > .ps__rail-y,\n.ps--scrolling-x > .ps__rail-x,\n.ps--scrolling-y > .ps__rail-y {\n  opacity: 0.6;\n}\n\n.ps .ps__rail-x:hover,\n.ps .ps__rail-y:hover,\n.ps .ps__rail-x:focus,\n.ps .ps__rail-y:focus,\n.ps .ps__rail-x.ps--clicking,\n.ps .ps__rail-y.ps--clicking {\n  background-color: #eee;\n  opacity: 0.9;\n}\n\n/*\n * Scrollbar thumb styles\n */\n.ps__thumb-x {\n  background-color: #aaa;\n  border-radius: 6px;\n  transition: background-color .2s linear, height .2s ease-in-out;\n  -webkit-transition: background-color .2s linear, height .2s ease-in-out;\n  height: 6px;\n  /* there must be 'bottom' for ps__thumb-x */\n  bottom: 2px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__thumb-y {\n  background-color: #aaa;\n  border-radius: 6px;\n  transition: background-color .2s linear, width .2s ease-in-out;\n  -webkit-transition: background-color .2s linear, width .2s ease-in-out;\n  width: 6px;\n  /* there must be 'right' for ps__thumb-y */\n  right: 2px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__rail-x:hover > .ps__thumb-x,\n.ps__rail-x:focus > .ps__thumb-x,\n.ps__rail-x.ps--clicking .ps__thumb-x {\n  background-color: #999;\n  height: 11px;\n}\n\n.ps__rail-y:hover > .ps__thumb-y,\n.ps__rail-y:focus > .ps__thumb-y,\n.ps__rail-y.ps--clicking .ps__thumb-y {\n  background-color: #999;\n  width: 11px;\n}\n\n/* MS supports */\n@supports (-ms-overflow-style: none) {\n  .ps {\n    overflow: auto !important;\n  }\n}\n\n@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {\n  .ps {\n    overflow: auto !important;\n  }\n}\n"]
                    }] }
        ];
        /** @nocollapse */
        PerfectScrollbarComponent.ctorParameters = function () { return [
            { type: core.NgZone },
            { type: core.ChangeDetectorRef },
            { type: Object, decorators: [{ type: core.Inject, args: [core.PLATFORM_ID,] }] }
        ]; };
        PerfectScrollbarComponent.propDecorators = {
            disabled: [{ type: core.Input }],
            usePSClass: [{ type: core.Input }],
            autoPropagation: [{ type: core.HostBinding, args: ['class.ps-show-limits',] }, { type: core.Input }],
            scrollIndicators: [{ type: core.HostBinding, args: ['class.ps-show-active',] }, { type: core.Input }],
            config: [{ type: core.Input }],
            psScrollY: [{ type: core.Output }],
            psScrollX: [{ type: core.Output }],
            psScrollUp: [{ type: core.Output }],
            psScrollDown: [{ type: core.Output }],
            psScrollLeft: [{ type: core.Output }],
            psScrollRight: [{ type: core.Output }],
            psYReachEnd: [{ type: core.Output }],
            psYReachStart: [{ type: core.Output }],
            psXReachEnd: [{ type: core.Output }],
            psXReachStart: [{ type: core.Output }],
            directiveRef: [{ type: core.ViewChild, args: [PerfectScrollbarDirective, { static: true },] }]
        };
        return PerfectScrollbarComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var PerfectScrollbarModule = /** @class */ (function () {
        function PerfectScrollbarModule() {
        }
        PerfectScrollbarModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [common.CommonModule],
                        declarations: [PerfectScrollbarComponent, PerfectScrollbarDirective],
                        exports: [common.CommonModule, PerfectScrollbarComponent, PerfectScrollbarDirective]
                    },] }
        ];
        return PerfectScrollbarModule;
    }());

    exports.Geometry = Geometry;
    exports.PERFECT_SCROLLBAR_CONFIG = PERFECT_SCROLLBAR_CONFIG;
    exports.PerfectScrollbarComponent = PerfectScrollbarComponent;
    exports.PerfectScrollbarConfig = PerfectScrollbarConfig;
    exports.PerfectScrollbarDirective = PerfectScrollbarDirective;
    exports.PerfectScrollbarModule = PerfectScrollbarModule;
    exports.Position = Position;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=ngx-perfect-scrollbar.umd.js.map
