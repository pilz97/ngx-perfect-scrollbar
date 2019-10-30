/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Subject, merge, fromEvent } from 'rxjs';
import { mapTo, takeUntil, distinctUntilChanged } from 'rxjs/operators';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgZone, Inject, Component, Input, Output, EventEmitter, HostBinding, ViewChild, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { PerfectScrollbarDirective } from './perfect-scrollbar.directive';
import { PerfectScrollbarEvents } from './perfect-scrollbar.interfaces';
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
export { PerfectScrollbarComponent };
if (false) {
    /** @type {?} */
    PerfectScrollbarComponent.prototype.states;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.indicatorX;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.indicatorY;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.interaction;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.scrollPositionX;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.scrollPositionY;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.scrollDirectionX;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.scrollDirectionY;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.usePropagationX;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.usePropagationY;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.allowPropagationX;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.allowPropagationY;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.stateTimeout;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.ngDestroy;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.stateUpdate;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.disabled;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.usePSClass;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.autoPropagation;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.scrollIndicators;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.config;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.psScrollY;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.psScrollX;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.psScrollUp;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.psScrollDown;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.psScrollLeft;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.psScrollRight;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.psYReachEnd;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.psYReachStart;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.psXReachEnd;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.psXReachStart;
    /** @type {?} */
    PerfectScrollbarComponent.prototype.directiveRef;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.zone;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.cdRef;
    /**
     * @type {?}
     * @private
     */
    PerfectScrollbarComponent.prototype.platformId;
}
//# sourceMappingURL=perfect-scrollbar.component.js.map