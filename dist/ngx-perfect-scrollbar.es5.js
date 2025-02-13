import { fromEvent, Subject, merge } from 'rxjs';
import { auditTime, takeUntil, distinctUntilChanged, mapTo } from 'rxjs/operators';
import { InjectionToken, Directive, NgZone, KeyValueDiffers, ElementRef, Inject, PLATFORM_ID, Optional, Input, Output, EventEmitter, Component, ViewEncapsulation, ChangeDetectorRef, HostBinding, ViewChild, NgModule } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import PerfectScrollbar from 'perfect-scrollbar';
import ResizeObserver from 'resize-observer-polyfill';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var PERFECT_SCROLLBAR_CONFIG = new InjectionToken('PERFECT_SCROLLBAR_CONFIG');
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
        this.ngDestroy = new Subject();
        this.disabled = false;
        this.psScrollY = new EventEmitter();
        this.psScrollX = new EventEmitter();
        this.psScrollUp = new EventEmitter();
        this.psScrollDown = new EventEmitter();
        this.psScrollLeft = new EventEmitter();
        this.psScrollRight = new EventEmitter();
        this.psYReachEnd = new EventEmitter();
        this.psYReachStart = new EventEmitter();
        this.psXReachEnd = new EventEmitter();
        this.psXReachStart = new EventEmitter();
    }
    /**
     * @return {?}
     */
    PerfectScrollbarDirective.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.disabled && isPlatformBrowser(this.platformId)) {
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
                _this.ro = new ResizeObserver((/**
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
                    fromEvent(_this.elementRef.nativeElement, eventType)
                        .pipe(auditTime(20), takeUntil(_this.ngDestroy))
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
        if (isPlatformBrowser(this.platformId)) {
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
        if (!this.disabled && this.configDiff && isPlatformBrowser(this.platformId)) {
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
        if (changes['disabled'] && !changes['disabled'].isFirstChange() && isPlatformBrowser(this.platformId)) {
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
        { type: Directive, args: [{
                    selector: '[perfectScrollbar]',
                    exportAs: 'ngxPerfectScrollbar'
                },] }
    ];
    /** @nocollapse */
    PerfectScrollbarDirective.ctorParameters = function () { return [
        { type: NgZone },
        { type: KeyValueDiffers },
        { type: ElementRef },
        { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [PERFECT_SCROLLBAR_CONFIG,] }] }
    ]; };
    PerfectScrollbarDirective.propDecorators = {
        disabled: [{ type: Input }],
        config: [{ type: Input, args: ['perfectScrollbar',] }],
        psScrollY: [{ type: Output }],
        psScrollX: [{ type: Output }],
        psScrollUp: [{ type: Output }],
        psScrollDown: [{ type: Output }],
        psScrollLeft: [{ type: Output }],
        psScrollRight: [{ type: Output }],
        psYReachEnd: [{ type: Output }],
        psYReachStart: [{ type: Output }],
        psXReachEnd: [{ type: Output }],
        psXReachStart: [{ type: Output }]
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
        this.ngDestroy = new Subject();
        this.stateUpdate = new Subject();
        this.disabled = false;
        this.usePSClass = true;
        this.autoPropagation = false;
        this.scrollIndicators = false;
        this.psScrollY = new EventEmitter();
        this.psScrollX = new EventEmitter();
        this.psScrollUp = new EventEmitter();
        this.psScrollDown = new EventEmitter();
        this.psScrollLeft = new EventEmitter();
        this.psScrollRight = new EventEmitter();
        this.psYReachEnd = new EventEmitter();
        this.psYReachStart = new EventEmitter();
        this.psXReachEnd = new EventEmitter();
        this.psXReachStart = new EventEmitter();
    }
    /**
     * @return {?}
     */
    PerfectScrollbarComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (isPlatformBrowser(this.platformId)) {
            this.stateUpdate
                .pipe(takeUntil(this.ngDestroy), distinctUntilChanged((/**
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
                    fromEvent(element, 'wheel')
                        .pipe(takeUntil(_this.ngDestroy))
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
                    fromEvent(element, 'touchmove')
                        .pipe(takeUntil(_this.ngDestroy))
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
                    merge(fromEvent(element, 'ps-scroll-x')
                        .pipe(mapTo('x')), fromEvent(element, 'ps-scroll-y')
                        .pipe(mapTo('y')), fromEvent(element, 'ps-x-reach-end')
                        .pipe(mapTo('right')), fromEvent(element, 'ps-y-reach-end')
                        .pipe(mapTo('bottom')), fromEvent(element, 'ps-x-reach-start')
                        .pipe(mapTo('left')), fromEvent(element, 'ps-y-reach-start')
                        .pipe(mapTo('top')))
                        .pipe(takeUntil(_this.ngDestroy))
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
        if (isPlatformBrowser(this.platformId)) {
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
        if (isPlatformBrowser(this.platformId)) {
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
        { type: Component, args: [{
                    selector: 'perfect-scrollbar',
                    exportAs: 'ngxPerfectScrollbar',
                    template: "<div style=\"position: static;\" [class.ps]=\"usePSClass\" [perfectScrollbar]=\"config\" [disabled]=\"disabled\">\r\n  <div class=\"ps-content\">\r\n    <ng-content></ng-content>\r\n  </div>\r\n\r\n  <div *ngIf=\"scrollIndicators\" class=\"ps-overlay\" [class.ps-at-top]=\"states.top\" [class.ps-at-left]=\"states.left\" [class.ps-at-right]=\"states.right\" [class.ps-at-bottom]=\"states.bottom\">\r\n    <div class=\"ps-indicator-top\" [class.ps-indicator-show]=\"indicatorY && interaction\"></div>\r\n    <div class=\"ps-indicator-left\" [class.ps-indicator-show]=\"indicatorX && interaction\"></div>\r\n    <div class=\"ps-indicator-right\" [class.ps-indicator-show]=\"indicatorX && interaction\"></div>\r\n    <div class=\"ps-indicator-bottom\" [class.ps-indicator-show]=\"indicatorY && interaction\"></div>\r\n  </div>\r\n</div>\r\n",
                    encapsulation: ViewEncapsulation.None,
                    styles: ["/*\r\n  TODO: Remove important flags after this bug if fixed:\r\n  https://github.com/angular/flex-layout/issues/381\r\n*/\r\n\r\nperfect-scrollbar {\r\n  position: relative;\r\n\r\n  display: block;\r\n  overflow: hidden;\r\n  width: 100%;\r\n  height: 100%;\r\n  max-width: 100%;\r\n  max-height: 100%;\r\n}\r\n\r\nperfect-scrollbar[hidden] {\r\n  display: none;\r\n}\r\n\r\nperfect-scrollbar[fxflex] {\r\n  display: flex;\r\n  flex-direction: column;\r\n  height: auto;\r\n  min-width: 0;\r\n  min-height: 0;\r\n\r\n  -webkit-box-direction: column;\r\n  -webkit-box-orient: column;\r\n}\r\n\r\nperfect-scrollbar[fxflex] > .ps {\r\n  -ms-flex: 1 1 auto;\r\n\r\n  flex: 1 1 auto;\r\n  width: auto;\r\n  height: auto;\r\n  min-width: 0;\r\n  min-height: 0;\r\n\r\n  -webkit-box-flex: 1;\r\n}\r\n\r\nperfect-scrollbar[fxlayout] > .ps,\r\nperfect-scrollbar[fxlayout] > .ps > .ps-content {\r\n  display: flex;\r\n\r\n  -ms-flex: 1 1 auto;\r\n\r\n  flex: 1 1 auto;\r\n  flex-direction: inherit;\r\n  align-items: inherit;\r\n  align-content: inherit;\r\n  justify-content: inherit;\r\n  width: 100%;\r\n  height: 100%;\r\n\r\n  -webkit-box-align: inherit;\r\n  -webkit-box-direction: inherit;\r\n  -webkit-box-flex: 1;\r\n  -webkit-box-orient: inherit;\r\n  -webkit-box-pack: inherit;\r\n}\r\n\r\nperfect-scrollbar[fxlayout='row'] > .ps,\r\nperfect-scrollbar[fxlayout='row'] > .ps > .ps-content, {\r\n  flex-direction: row !important;\r\n\r\n  -webkit-box-direction: row !important;\r\n  -webkit-box-orient: row !important;\r\n}\r\n\r\nperfect-scrollbar[fxlayout='column'] > .ps,\r\nperfect-scrollbar[fxlayout='column'] > .ps > .ps-content {\r\n  flex-direction: column !important;\r\n\r\n  -webkit-box-direction: column !important;\r\n  -webkit-box-orient: column !important;\r\n}\r\n\r\nperfect-scrollbar > .ps {\r\n  position: static;\r\n\r\n  display: block;\r\n  width: inherit;\r\n  height: inherit;\r\n  max-width: inherit;\r\n  max-height: inherit;\r\n}\r\n\r\nperfect-scrollbar > .ps textarea {\r\n  -ms-overflow-style: scrollbar;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay {\r\n  position: absolute;\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n\r\n  display: block;\r\n  overflow: hidden;\r\n\r\n  pointer-events: none;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-top,\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-left,\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-right,\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-bottom {\r\n  position: absolute;\r\n\r\n  opacity: 0;\r\n\r\n  transition: opacity 300ms ease-in-out;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-top,\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-bottom {\r\n  left: 0;\r\n\r\n  min-width: 100%;\r\n  min-height: 24px;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-left,\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-right {\r\n  top: 0;\r\n\r\n  min-width: 24px;\r\n  min-height: 100%;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-top {\r\n  top: 0;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-left {\r\n  left: 0;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-right {\r\n  right: 0;\r\n}\r\n\r\nperfect-scrollbar > .ps > .ps-overlay .ps-indicator-bottom {\r\n  bottom: 0;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-y > .ps__rail-y {\r\n  top: 0 !important;\r\n  right: 0 !important;\r\n  left: auto !important;\r\n\r\n  width: 10px;\r\n\r\n  cursor: default;\r\n\r\n  transition:\r\n    width 200ms linear,\r\n    opacity 200ms linear,\r\n    background-color 200ms linear;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-y > .ps__rail-y:hover,\r\nperfect-scrollbar > .ps.ps--active-y > .ps__rail-y.ps--clicking {\r\n  width: 15px;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-x > .ps__rail-x {\r\n  top: auto !important;\r\n  bottom: 0 !important;\r\n  left: 0 !important;\r\n\r\n  height: 10px;\r\n\r\n  cursor: default;\r\n\r\n  transition:\r\n    height 200ms linear,\r\n    opacity 200ms linear,\r\n    background-color 200ms linear;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-x > .ps__rail-x:hover,\r\nperfect-scrollbar > .ps.ps--active-x > .ps__rail-x.ps--clicking {\r\n  height: 15px;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-x.ps--active-y > .ps__rail-y {\r\n  margin: 0 0 10px;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--active-x.ps--active-y > .ps__rail-x {\r\n  margin: 0 10px 0 0;\r\n}\r\n\r\nperfect-scrollbar > .ps.ps--scrolling-y > .ps__rail-y,\r\nperfect-scrollbar > .ps.ps--scrolling-x > .ps__rail-x {\r\n  opacity: 0.9;\r\n\r\n  background-color: #eee;\r\n}\r\n\r\nperfect-scrollbar.ps-show-always > .ps.ps--active-y > .ps__rail-y,\r\nperfect-scrollbar.ps-show-always > .ps.ps--active-x > .ps__rail-x {\r\n  opacity: 0.6;\r\n}\r\n\r\nperfect-scrollbar.ps-show-active > .ps.ps--active-y > .ps-overlay:not(.ps-at-top) .ps-indicator-top {\r\n  opacity: 1;\r\n\r\n  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active > .ps.ps--active-y > .ps-overlay:not(.ps-at-bottom) .ps-indicator-bottom {\r\n  opacity: 1;\r\n\r\n  background: linear-gradient(to top, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active > .ps.ps--active-x > .ps-overlay:not(.ps-at-left) .ps-indicator-left {\r\n  opacity: 1;\r\n\r\n  background: linear-gradient(to right, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active > .ps.ps--active-x > .ps-overlay:not(.ps-at-right) .ps-indicator-right {\r\n  opacity: 1;\r\n\r\n  background: linear-gradient(to left, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-y > .ps-overlay.ps-at-top .ps-indicator-top {\r\n  background: linear-gradient(to bottom, rgba(170, 170, 170, 0.5) 0%, rgba(170, 170, 170, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-y > .ps-overlay.ps-at-bottom .ps-indicator-bottom {\r\n  background: linear-gradient(to top, rgba(170, 170, 170, 0.5) 0%, rgba(170, 170, 170, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-x > .ps-overlay.ps-at-left .ps-indicator-left {\r\n  background: linear-gradient(to right, rgba(170, 170, 170, 0.5) 0%, rgba(170, 170, 170, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-x > .ps-overlay.ps-at-right .ps-indicator-right {\r\n  background: linear-gradient(to left, rgba(170, 170, 170, 0.5) 0%, rgba(170, 170, 170, 0) 100%);\r\n}\r\n\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-y > .ps-overlay.ps-at-top .ps-indicator-top.ps-indicator-show,\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-y > .ps-overlay.ps-at-bottom .ps-indicator-bottom.ps-indicator-show,\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-x > .ps-overlay.ps-at-left .ps-indicator-left.ps-indicator-show,\r\nperfect-scrollbar.ps-show-active.ps-show-limits > .ps.ps--active-x > .ps-overlay.ps-at-right .ps-indicator-right.ps-indicator-show {\r\n  opacity: 1;\r\n}\r\n", "/*\n * Container style\n */\n.ps {\n  overflow: hidden !important;\n  overflow-anchor: none;\n  -ms-overflow-style: none;\n  touch-action: auto;\n  -ms-touch-action: auto;\n}\n\n/*\n * Scrollbar rail styles\n */\n.ps__rail-x {\n  display: none;\n  opacity: 0;\n  transition: background-color .2s linear, opacity .2s linear;\n  -webkit-transition: background-color .2s linear, opacity .2s linear;\n  height: 15px;\n  /* there must be 'bottom' or 'top' for ps__rail-x */\n  bottom: 0px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__rail-y {\n  display: none;\n  opacity: 0;\n  transition: background-color .2s linear, opacity .2s linear;\n  -webkit-transition: background-color .2s linear, opacity .2s linear;\n  width: 15px;\n  /* there must be 'right' or 'left' for ps__rail-y */\n  right: 0;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps--active-x > .ps__rail-x,\n.ps--active-y > .ps__rail-y {\n  display: block;\n  background-color: transparent;\n}\n\n.ps:hover > .ps__rail-x,\n.ps:hover > .ps__rail-y,\n.ps--focus > .ps__rail-x,\n.ps--focus > .ps__rail-y,\n.ps--scrolling-x > .ps__rail-x,\n.ps--scrolling-y > .ps__rail-y {\n  opacity: 0.6;\n}\n\n.ps .ps__rail-x:hover,\n.ps .ps__rail-y:hover,\n.ps .ps__rail-x:focus,\n.ps .ps__rail-y:focus,\n.ps .ps__rail-x.ps--clicking,\n.ps .ps__rail-y.ps--clicking {\n  background-color: #eee;\n  opacity: 0.9;\n}\n\n/*\n * Scrollbar thumb styles\n */\n.ps__thumb-x {\n  background-color: #aaa;\n  border-radius: 6px;\n  transition: background-color .2s linear, height .2s ease-in-out;\n  -webkit-transition: background-color .2s linear, height .2s ease-in-out;\n  height: 6px;\n  /* there must be 'bottom' for ps__thumb-x */\n  bottom: 2px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__thumb-y {\n  background-color: #aaa;\n  border-radius: 6px;\n  transition: background-color .2s linear, width .2s ease-in-out;\n  -webkit-transition: background-color .2s linear, width .2s ease-in-out;\n  width: 6px;\n  /* there must be 'right' for ps__thumb-y */\n  right: 2px;\n  /* please don't change 'position' */\n  position: absolute;\n}\n\n.ps__rail-x:hover > .ps__thumb-x,\n.ps__rail-x:focus > .ps__thumb-x,\n.ps__rail-x.ps--clicking .ps__thumb-x {\n  background-color: #999;\n  height: 11px;\n}\n\n.ps__rail-y:hover > .ps__thumb-y,\n.ps__rail-y:focus > .ps__thumb-y,\n.ps__rail-y.ps--clicking .ps__thumb-y {\n  background-color: #999;\n  width: 11px;\n}\n\n/* MS supports */\n@supports (-ms-overflow-style: none) {\n  .ps {\n    overflow: auto !important;\n  }\n}\n\n@media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {\n  .ps {\n    overflow: auto !important;\n  }\n}\n"]
                }] }
    ];
    /** @nocollapse */
    PerfectScrollbarComponent.ctorParameters = function () { return [
        { type: NgZone },
        { type: ChangeDetectorRef },
        { type: Object, decorators: [{ type: Inject, args: [PLATFORM_ID,] }] }
    ]; };
    PerfectScrollbarComponent.propDecorators = {
        disabled: [{ type: Input }],
        usePSClass: [{ type: Input }],
        autoPropagation: [{ type: HostBinding, args: ['class.ps-show-limits',] }, { type: Input }],
        scrollIndicators: [{ type: HostBinding, args: ['class.ps-show-active',] }, { type: Input }],
        config: [{ type: Input }],
        psScrollY: [{ type: Output }],
        psScrollX: [{ type: Output }],
        psScrollUp: [{ type: Output }],
        psScrollDown: [{ type: Output }],
        psScrollLeft: [{ type: Output }],
        psScrollRight: [{ type: Output }],
        psYReachEnd: [{ type: Output }],
        psYReachStart: [{ type: Output }],
        psXReachEnd: [{ type: Output }],
        psXReachStart: [{ type: Output }],
        directiveRef: [{ type: ViewChild, args: [PerfectScrollbarDirective, { static: true },] }]
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
        { type: NgModule, args: [{
                    imports: [CommonModule],
                    declarations: [PerfectScrollbarComponent, PerfectScrollbarDirective],
                    exports: [CommonModule, PerfectScrollbarComponent, PerfectScrollbarDirective]
                },] }
    ];
    return PerfectScrollbarModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { Geometry, PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarComponent, PerfectScrollbarConfig, PerfectScrollbarDirective, PerfectScrollbarModule, Position };
//# sourceMappingURL=ngx-perfect-scrollbar.es5.js.map
