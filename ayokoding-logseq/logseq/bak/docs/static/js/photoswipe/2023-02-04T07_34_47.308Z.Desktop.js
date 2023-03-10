/*! For license information please see main.js.LICENSE.txt */
(() => {
  'use strict';
  var t = {
      d: (i, e) => {
        for (var s in e)
          t.o(e, s) &&
            !t.o(i, s) &&
            Object.defineProperty(i, s, { enumerable: !0, get: e[s] });
      },
      o: (t, i) => Object.prototype.hasOwnProperty.call(t, i),
      r: (t) => {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(t, '__esModule', { value: !0 });
      },
    },
    i = {};
  function e(t, i, e) {
    const s = document.createElement(i || 'div');
    return t && (s.className = t), e && e.appendChild(s), s;
  }
  function s(t, i) {
    return (t.x = i.x), (t.y = i.y), void 0 !== i.id && (t.id = i.id), t;
  }
  function o(t) {
    (t.x = Math.round(t.x)), (t.y = Math.round(t.y));
  }
  function n(t, i) {
    const e = Math.abs(t.x - i.x),
      s = Math.abs(t.y - i.y);
    return Math.sqrt(e * e + s * s);
  }
  function a(t, i) {
    return t.x === i.x && t.y === i.y;
  }
  function r(t, i, e) {
    return Math.min(Math.max(t, i), e);
  }
  function h(t, i, e) {
    let s = 'translate3d(' + t + 'px,' + (i || 0) + 'px,0)';
    return void 0 !== e && (s += ' scale3d(' + e + ',' + e + ',1)'), s;
  }
  function l(t, i, e, s) {
    t.style.transform = h(i, e, s);
  }
  function p(t, i, e, s) {
    t.style.transition = i
      ? i + ' ' + e + 'ms ' + (s || 'cubic-bezier(.4,0,.22,1)')
      : 'none';
  }
  function c(t, i, e) {
    (t.style.width = 'number' == typeof i ? i + 'px' : i),
      (t.style.height = 'number' == typeof e ? e + 'px' : e);
  }
  t.r(i),
    t.d(i, {
      HTMLSlide: () => w,
      ImageSlide: () => f,
      Slide: () => v,
      default: () => Y,
    });
  let d = !1;
  try {
    window.addEventListener(
      'test',
      null,
      Object.defineProperty({}, 'passive', {
        get: () => {
          d = !0;
        },
      })
    );
  } catch (t) {}
  class m {
    constructor() {
      this._pool = [];
    }
    add(t, i, e, s) {
      this._toggleListener(t, i, e, s);
    }
    remove(t, i, e, s) {
      this._toggleListener(t, i, e, s, !0);
    }
    removeAll() {
      this._pool.forEach((t) => {
        this._toggleListener(t.target, t.type, t.listener, t.passive, !0, !0);
      }),
        (this._pool = []);
    }
    _toggleListener(t, i, e, s, o, n) {
      if (!t) return;
      const a = (o ? 'remove' : 'add') + 'EventListener';
      (i = i.split(' ')).forEach((i) => {
        if (i) {
          n ||
            (o
              ? (this._pool = this._pool.filter(
                  (s) => s.type !== i || s.listener !== e || s.target !== t
                ))
              : this._pool.push({
                  target: t,
                  type: i,
                  listener: e,
                  passive: s,
                }));
          const r = !!d && { passive: s || !1 };
          t[a](i, e, r);
        }
      });
    }
  }
  class u {
    constructor(t) {
      (this.slide = t),
        (this.currZoomLevel = 1),
        (this.center = {}),
        (this.max = {}),
        (this.min = {}),
        this.reset();
    }
    update(t) {
      (this.currZoomLevel = t),
        this.slide.width
          ? (this._updateAxis('x'),
            this._updateAxis('y'),
            this.slide.pswp.dispatch('calcBounds', { slide: this.slide }))
          : this.reset();
    }
    _updateAxis(t) {
      const i = this.slide['x' === t ? 'width' : 'height'] * this.currZoomLevel,
        e = 'x' === t ? 'Left' : 'Top',
        s = this.slide.pswp.options['padding' + e] || 0,
        o = this.slide.panAreaSize[t];
      (this.center[t] = Math.round((o - i) / 2) + s),
        (this.max[t] = i > o ? Math.round(o - i) + s : this.center[t]),
        (this.min[t] = i > o ? s : this.center[t]);
    }
    reset() {
      (this.center.x = 0),
        (this.center.y = 0),
        (this.max.x = 0),
        (this.max.y = 0),
        (this.min.x = 0),
        (this.min.y = 0);
    }
    correctPan(t, i) {
      return r(i, this.max[t], this.min[t]);
    }
  }
  class _ {
    constructor(t, i, e) {
      (this.options = t), (this.itemData = i), (this.index = e);
    }
    update(t, i, e) {
      (this.elementSize = { x: t, y: i }), (this.panAreaSize = e);
      const s = this.panAreaSize.x / this.elementSize.x,
        o = this.panAreaSize.y / this.elementSize.y;
      (this.fit = Math.min(1, s < o ? s : o)),
        (this.fill = Math.min(1, s > o ? s : o)),
        (this.vFill = Math.min(1, o)),
        (this.initial = this._getInitial()),
        (this.secondary = this._getSecondary()),
        (this.max = Math.max(this.initial, this.secondary, this._getMax())),
        (this.min = Math.min(this.fit, this.initial, this.secondary));
    }
    _parseZoomLevelOption(t) {
      const i = this.options[t + 'ZoomLevel'];
      if (i)
        return 'function' == typeof i
          ? i(this)
          : 'fill' === i
          ? this.fill
          : 'fit' === i
          ? this.fit
          : Number(i);
    }
    _getSecondary() {
      let t = this._parseZoomLevelOption('secondary');
      return (
        t ||
        ((t = Math.min(1, 2.5 * this.fit)),
        t * this.elementSize.x > 3e3 && (t = 3e3 / this.elementSize.x),
        t)
      );
    }
    _getInitial() {
      return this._parseZoomLevelOption('initial') || this.fit;
    }
    _getMax() {
      return this._parseZoomLevelOption('max') || Math.max(1, 4 * this.fit);
    }
  }
  function g(t, i) {
    if (t.getViewportSizeFn) {
      const e = t.getViewportSizeFn(t, i);
      if (e) return e;
    }
    return { x: document.documentElement.clientWidth, y: window.innerHeight };
  }
  function y(t, i) {
    return {
      x: i.x - (t.paddingLeft || 0) - (t.paddingRight || 0),
      y: i.y - (t.paddingTop || 0) - (t.paddingBottom || 0),
    };
  }
  class v {
    constructor(t, i, e) {
      (this.data = t),
        (this.index = i),
        (this.pswp = e),
        (this.isActive = i === e.currIndex),
        (this.currentResolution = 0),
        (this.panAreaSize = {}),
        (this.isFirstSlide = this.isActive && !e.opener.isOpen),
        (this.zoomLevels = new _(e.options, t, i)),
        this.pswp.dispatch('gettingData', {
          slide: this,
          data: this.data,
          index: i,
        }),
        (this.pan = { x: 0, y: 0 }),
        (this.currZoomLevel = 1),
        (this.width = Number(t.w) || 0),
        (this.height = Number(t.h) || 0),
        (this.bounds = new u(this)),
        (this.prevWidth = -1),
        (this.prevHeight = -1),
        (this.prevScaleMultiplier = -1),
        this.pswp.dispatch('slideInit', { slide: this });
    }
    setIsActive(t) {
      t && !this.isActive
        ? this.activate()
        : !t && this.isActive && this.deactivate();
    }
    append(t) {
      (this.holderElement = t),
        this.data
          ? (this.calculateSize(),
            (this.container = e('pswp__zoom-wrap')),
            (this.container.transformOrigin = '0 0'),
            this.appendContent(),
            this.appendHeavy(),
            this.updateContentSize(),
            (this.holderElement.innerHTML = ''),
            this.holderElement.appendChild(this.container),
            this.zoomAndPanToInitial(),
            this.pswp.dispatch('firstZoomPan', { slide: this }),
            this.applyCurrentZoomPan(),
            this.pswp.dispatch('afterSetContent', { slide: this }),
            this.isActive && this.activate())
          : (this.holderElement.innerHTML = '');
    }
    appendContent() {
      this.setSlideHTML(this.data.html);
    }
    appendHeavy() {
      const { pswp: t } = this;
      !this.heavyAppended &&
        t.opener.isOpen &&
        !t.mainScroll.isShifted() &&
        (this.isActive, 1) &&
        (this.pswp.dispatch('appendHeavy', { slide: this }).defaultPrevented ||
          ((this.heavyAppended = !0), this.appendHeavyContent()));
    }
    appendHeavyContent() {
      this.pswp.dispatch('appendHeavyContent', { slide: this });
    }
    setSlideHTML(t) {
      const { container: i } = this;
      t.tagName ? i.appendChild(t) : (i.innerHTML = t),
        (i.style.width = '100%'),
        (i.style.height = '100%'),
        i.classList.add('pswp__zoom-wrap--html');
    }
    activate() {
      (this.isActive = !0),
        this.appendHeavy(),
        this.pswp.dispatch('slideActivate', { slide: this });
    }
    deactivate() {
      (this.isActive = !1),
        this.zoomAndPanToInitial(),
        this.applyCurrentZoomPan(),
        this.pswp.dispatch('slideDeactivate', { slide: this });
    }
    destroy() {
      this.pswp.dispatch('slideDestroy', { slide: this });
    }
    resize() {
      this.calculateSize(),
        (this.currentResolution = 0),
        this.updateContentSize(),
        this.zoomAndPanToInitial(),
        this.applyCurrentZoomPan();
    }
    updateContentSize() {
      return !0;
    }
    getPlaceholder() {
      return !1;
    }
    zoomTo(t, i, e, s) {
      const { pswp: n } = this;
      if (!this.isZoomable() || n.mainScroll.isShifted()) return;
      n.dispatch('beforeZoomTo', {
        destZoomLevel: t,
        centerPoint: i,
        transitionDuration: e,
      }),
        n.animations.stopAllPan();
      const a = this.currZoomLevel;
      s || (t = r(t, this.zoomLevels.min, this.zoomLevels.max)),
        this.setZoomLevel(t),
        (this.pan.x = this.calculateZoomToPanOffset('x', i, a)),
        (this.pan.y = this.calculateZoomToPanOffset('y', i, a)),
        o(this.pan);
      const h = () => {
        this._setResolution(t), this.applyCurrentZoomPan();
      };
      e
        ? n.animations.startTransition({
            isPan: !0,
            name: 'zoomTo',
            target: this.container,
            transform: this.getCurrentTransform(),
            onComplete: h,
            duration: e,
            easing: n.options.easing,
          })
        : h();
    }
    toggleZoom(t) {
      this.zoomTo(
        this.currZoomLevel === this.zoomLevels.initial
          ? this.zoomLevels.secondary
          : this.zoomLevels.initial,
        t,
        this.pswp.options.zoomAnimationDuration
      );
    }
    setZoomLevel(t) {
      (this.currZoomLevel = t), this.bounds.update(this.currZoomLevel);
    }
    calculateZoomToPanOffset(t, i, e) {
      if (0 == this.bounds.max[t] - this.bounds.min[t])
        return this.bounds.center[t];
      i || (i = this.pswp.getViewportCenterPoint());
      const s = this.currZoomLevel / e;
      return this.bounds.correctPan(t, (this.pan[t] - i[t]) * s + i[t]);
    }
    panTo(t, i) {
      (this.pan.x = this.bounds.correctPan('x', t)),
        (this.pan.y = this.bounds.correctPan('y', i)),
        this.applyCurrentZoomPan();
    }
    isPannable() {
      return !1;
    }
    isZoomable() {
      return !1;
    }
    applyCurrentZoomPan() {
      this._applyZoomTransform(this.pan.x, this.pan.y, this.currZoomLevel),
        this === this.pswp.currSlide &&
          this.pswp.dispatch('zoomPanUpdate', { slide: this });
    }
    zoomAndPanToInitial() {
      (this.currZoomLevel = this.zoomLevels.initial),
        this.bounds.update(this.currZoomLevel),
        s(this.pan, this.bounds.center),
        this.pswp.dispatch('initialZoomPan', { slide: this });
    }
    _applyZoomTransform(t, i, e) {
      (e /= this.currentResolution || this.zoomLevels.initial),
        l(this.container, t, i, e);
    }
    calculateSize() {
      const { pswp: t } = this;
      s(this.panAreaSize, y(t.options, t.viewportSize)),
        this.zoomLevels.update(this.width, this.height, this.panAreaSize),
        t.dispatch('calcSlideSize', { slide: this });
    }
    getCurrentTransform() {
      const t =
        this.currZoomLevel /
        (this.currentResolution || this.zoomLevels.initial);
      return h(this.pan.x, this.pan.y, t);
    }
    _setResolution(t) {
      t !== this.currentResolution &&
        ((this.currentResolution = t),
        this.updateContentSize(),
        this.pswp.dispatch('resolutionChanged'));
    }
  }
  class f extends v {
    appendContent() {
      const t = this.data.msrc && this.isFirstSlide;
      (this.placeholder = e(
        'pswp__img pswp__img--placeholder',
        t ? 'img' : '',
        this.container
      )),
        t &&
          ((this.placeholder.decoding = 'async'),
          (this.placeholder.alt = ''),
          (this.placeholder.src = this.data.msrc)),
        this.placeholder.setAttribute('aria-hiden', 'true'),
        this.pswp.dispatch('placeholderCreated', {
          placeholder: this.placeholder,
          slide: this,
        }),
        this.image || this.loadMainImage(),
        (this.isLoading = !0);
    }
    appendHeavyContent() {
      super.appendHeavyContent(),
        this.image &&
          (this._appendMainImage(),
          this.image.complete
            ? this._onImageLoaded()
            : ((this.image.onload = () => this._onImageLoaded()),
              (this.image.onerror = () => this._onImageLoaded(!0))));
    }
    loadMainImage() {
      (this.image = e('pswp__img', 'img')),
        this.updateContentSize(),
        this.data.srcset && (this.image.srcset = this.data.srcset),
        (this.image.src = this.data.src),
        (this.image.alt = this.data.alt || ''),
        !this.isActive && 'decode' in this.image && this.image.decode(),
        this.pswp.lazyLoader.addRecent(this.index);
    }
    getPlaceholder() {
      return this.placeholder;
    }
    sizeChanged(t, i, e) {
      return (
        (t !== this.prevScaleMultiplier ||
          i !== this.prevWidth ||
          e !== this.prevHeight) &&
        ((this.prevScaleMultiplier = t),
        (this.prevWidth = i),
        (this.prevHeight = e),
        !0)
      );
    }
    _appendMainImage() {
      this._imageAppended ||
        (this.container.appendChild(this.image), (this._imageAppended = !0));
    }
    _onImageLoaded(t) {
      this._appendMainImage(),
        (this.isLoading = !1),
        this.pswp.dispatch('loadComplete', { slide: this, isError: t }),
        this.placeholder &&
          setTimeout(() => {
            this.placeholder &&
              (this.placeholder.remove(), (this.placeholder = null));
          }, 500),
        t && this._handleError();
    }
    _handleError() {
      this.setSlideHTML(this.pswp.options.errorMsg);
      const t = this.container.querySelector('.pswp__error-msg a');
      t && this.data.src && (t.href = this.data.src),
        (this.loadError = !0),
        (this.image = null),
        this.calculateSize(),
        this.setZoomLevel(1),
        this.panTo(0, 0),
        this.pswp.dispatch('loadError', { slide: this });
    }
    isPannable() {
      return this.width && this.currZoomLevel > this.zoomLevels.fit;
    }
    isZoomable() {
      return this.width > 0;
    }
    updateContentSize() {
      const t = this.currentResolution || this.zoomLevels.initial;
      if (!t) return;
      if (!this.sizeChanged(t, this.width, this.height)) return;
      const i = Math.round(this.width * t),
        e = Math.round(this.height * t);
      this.placeholder && c(this.placeholder, i, 'auto');
      const { image: s } = this;
      return (
        s &&
          (c(s, i, 'auto'),
          (!s.dataset.largestUsedSize || i > s.dataset.largestUsedSize) &&
            ((s.sizes = i + 'px'), (s.dataset.largestUsedSize = i)),
          this.pswp.dispatch('imageSizeChange', {
            slide: this,
            width: i,
            height: e,
          })),
        !0
      );
    }
  }
  class w extends v {}
  class x {
    constructor(t) {
      (this.gestures = t), (this.pswp = t.pswp), (this.startPan = {});
    }
    start() {
      s(this.startPan, this.pswp.currSlide.pan), this.pswp.animations.stopAll();
    }
    change() {
      const { p1: t, prevP1: i, dragAxis: e, pswp: s } = this.gestures,
        { currSlide: n } = s;
      if (
        'y' === e &&
        s.options.closeOnVerticalDrag &&
        n.currZoomLevel <= n.zoomLevels.vFill &&
        !this.gestures.isMultitouch
      ) {
        const e = n.pan.y + (t.y - i.y);
        if (!s.dispatch('verticalDrag', { panY: e }).defaultPrevented) {
          this._setPanWithFriction('y', e, 0.6);
          const t = 1 - Math.abs(this._getVerticalDragRatio(n.pan.y));
          s.applyBgOpacity(t), n.applyCurrentZoomPan();
        }
      } else
        this._panOrMoveMainScroll('x') ||
          (this._panOrMoveMainScroll('y'), o(n.pan), n.applyCurrentZoomPan());
    }
    end() {
      const { pswp: t, velocity: i } = this.gestures,
        { mainScroll: e } = t;
      let s = 0;
      if ((t.animations.stopAll(), e.isShifted())) {
        const o = (e.x - e.getCurrSlideX()) / t.viewportSize.x;
        (i.x < -0.5 && o < 0) || (i.x < 0.1 && o < -0.5)
          ? ((s = 1), (i.x = Math.min(i.x, 0)))
          : ((i.x > 0.5 && o > 0) || (i.x > -0.1 && o > 0.5)) &&
            ((s = -1), (i.x = Math.max(i.x, 0))),
          e.moveIndexBy(s, !0, i.x);
      }
      (t.currSlide.currZoomLevel > t.currSlide.zoomLevels.max &&
        this.pswp.options.limitMaxZoom) ||
      this.gestures.isMultitouch
        ? this.gestures.zoomLevels.correctZoomPan(!0)
        : (this._finishPanGestureForAxis('x'),
          this._finishPanGestureForAxis('y'));
    }
    _finishPanGestureForAxis(t) {
      const { pswp: i } = this,
        { currSlide: e } = i,
        { velocity: s } = this.gestures,
        { pan: o, bounds: n } = e,
        a = o[t],
        h = i.bgOpacity < 1 && 'y' === t,
        l = a + (0.995 * s[t]) / (1 - 0.995);
      if (h) {
        const t = this._getVerticalDragRatio(a),
          e = this._getVerticalDragRatio(l);
        if ((t < 0 && e < -0.4) || (t > 0 && e > 0.4)) return void i.close();
      }
      const p = n.correctPan(t, l);
      if (a === p) return;
      const c = p === l ? 1 : 0.82,
        d = i.bgOpacity,
        m = p - a;
      i.animations.startSpring({
        name: 'panGesture' + t,
        isPan: !0,
        start: a,
        end: p,
        velocity: s[t],
        dampingRatio: c,
        onUpdate: (s) => {
          if (h && i.bgOpacity < 1) {
            const t = 1 - (p - s) / m;
            i.applyBgOpacity(r(d + (1 - d) * t, 0, 1));
          }
          (o[t] = Math.floor(s)), e.applyCurrentZoomPan();
        },
      });
    }
    _panOrMoveMainScroll(t) {
      const {
          p1: i,
          pswp: e,
          dragAxis: s,
          prevP1: o,
          isMultitouch: n,
        } = this.gestures,
        { currSlide: a, mainScroll: r } = e,
        h = i[t] - o[t],
        l = r.x + h;
      if (!h) return;
      if ('x' === t && !a.isPannable() && !n) return r.moveTo(l, !0), !0;
      const { bounds: p } = a,
        c = a.pan[t] + h;
      if (e.options.allowPanToNext && 'x' === s && 'x' === t && !n) {
        const i = r.getCurrSlideX(),
          e = r.x - i,
          s = h > 0,
          o = !s;
        if (c > p.min[t] && s) {
          if (p.min[t] <= this.startPan[t]) return r.moveTo(l, !0), !0;
          this._setPanWithFriction(t, c);
        } else if (c < p.max[t] && o) {
          if (this.startPan[t] <= p.max[t]) return r.moveTo(l, !0), !0;
          this._setPanWithFriction(t, c);
        } else if (0 !== e) {
          if (e > 0) return r.moveTo(Math.max(l, i), !0), !0;
          if (e < 0) return r.moveTo(Math.min(l, i), !0), !0;
        } else this._setPanWithFriction(t, c);
      } else
        ('y' === t && (r.isShifted() || p.min.y === p.max.y)) ||
          this._setPanWithFriction(t, c);
    }
    _getVerticalDragRatio(t) {
      return (
        (t - this.pswp.currSlide.bounds.center.y) /
        (this.pswp.viewportSize.y / 3)
      );
    }
    _setPanWithFriction(t, i, e) {
      const { pan: s, bounds: o } = this.pswp.currSlide;
      if (o.correctPan(t, i) !== i || e) {
        const o = Math.round(i - s[t]);
        s[t] += o * (e || 0.35);
      } else s[t] = i;
    }
  }
  function S(t, i, e) {
    return (t.x = (i.x + e.x) / 2), (t.y = (i.y + e.y) / 2), t;
  }
  class P {
    constructor(t) {
      (this.gestures = t),
        (this.pswp = this.gestures.pswp),
        (this._startPan = {}),
        (this._startZoomPoint = {}),
        (this._zoomPoint = {});
    }
    start() {
      (this._startZoomLevel = this.pswp.currSlide.currZoomLevel),
        s(this._startPan, this.pswp.currSlide.pan),
        this.pswp.animations.stopAllPan(),
        (this._wasOverFitZoomLevel = !1);
    }
    change() {
      const { p1: t, startP1: i, p2: e, startP2: s, pswp: o } = this.gestures,
        { currSlide: a } = o,
        r = a.zoomLevels.min,
        h = a.zoomLevels.max;
      if (!a.isZoomable() || o.mainScroll.isShifted()) return;
      S(this._startZoomPoint, i, s), S(this._zoomPoint, t, e);
      let l = (1 / n(i, s)) * n(t, e) * this._startZoomLevel;
      if (
        (l > a.zoomLevels.initial + a.zoomLevels.initial / 15 &&
          (this._wasOverFitZoomLevel = !0),
        l < r)
      )
        if (
          o.options.pinchToClose &&
          !this._wasOverFitZoomLevel &&
          this._startZoomLevel <= a.zoomLevels.initial
        ) {
          const t = 1 - (r - l) / (r / 1.2);
          o.dispatch('pinchClose', { bgOpacity: t }).defaultPrevented ||
            o.applyBgOpacity(t);
        } else l = r - 0.25 * (r - l);
      else l > h && (l = h + 0.15 * (l - h));
      (a.pan.x = this._calculatePanForZoomLevel('x', l)),
        (a.pan.y = this._calculatePanForZoomLevel('y', l)),
        a.setZoomLevel(l),
        a.applyCurrentZoomPan();
    }
    end() {
      const { pswp: t } = this,
        { currSlide: i } = t;
      i.currZoomLevel < i.zoomLevels.initial &&
      !this._wasOverFitZoomLevel &&
      t.options.pinchToClose
        ? t.close()
        : this.correctZoomPan();
    }
    _calculatePanForZoomLevel(t, i) {
      const e = i / this._startZoomLevel;
      return (
        this._zoomPoint[t] - (this._startZoomPoint[t] - this._startPan[t]) * e
      );
    }
    correctZoomPan(t) {
      const { pswp: i } = this,
        { currSlide: e } = i;
      if (!e.isZoomable()) return;
      const o = e.currZoomLevel;
      let n,
        h = !0;
      o < e.zoomLevels.initial
        ? (n = e.zoomLevels.initial)
        : o > e.zoomLevels.max
        ? (n = e.zoomLevels.max)
        : ((h = !1), (n = o));
      const l = i.bgOpacity,
        p = i.bgOpacity < 1,
        c = s({}, e.pan);
      let d = s({}, c);
      t &&
        ((this._zoomPoint.x = 0),
        (this._zoomPoint.y = 0),
        (this._startZoomPoint.x = 0),
        (this._startZoomPoint.y = 0),
        s(this._startPan, this.pswp.currSlide.pan)),
        h &&
          (d = {
            x: this._calculatePanForZoomLevel('x', n),
            y: this._calculatePanForZoomLevel('y', n),
          }),
        e.setZoomLevel(n),
        (d = {
          x: e.bounds.correctPan('x', d.x),
          y: e.bounds.correctPan('y', d.y),
        }),
        e.setZoomLevel(o);
      let m = !0;
      if ((a(d, c) && (m = !1), !m && !h && !p))
        return e._setResolution(n), void e.applyCurrentZoomPan();
      i.animations.stopAllPan(),
        i.animations.startSpring({
          isPan: !0,
          start: 0,
          end: 1e3,
          velocity: 0,
          dampingRatio: 1,
          naturalFrequency: 30,
          onUpdate: (t) => {
            if (((t /= 1e3), m || h)) {
              if (
                (m &&
                  ((e.pan.x = c.x + (d.x - c.x) * t),
                  (e.pan.y = c.y + (d.y - c.y) * t)),
                h)
              ) {
                const i = o + (n - o) * t;
                e.setZoomLevel(i);
              }
              e.applyCurrentZoomPan();
            }
            p && i.bgOpacity < 1 && i.applyBgOpacity(r(l + (1 - l) * t, 0, 1));
          },
          onComplete: () => {
            e._setResolution(n), e.applyCurrentZoomPan();
          },
        });
    }
  }
  function b(t) {
    return !!t.target.closest('.pswp__container');
  }
  class z {
    constructor(t) {
      this.gestures = t;
    }
    click(t, i) {
      const e = i.target.classList,
        s = e.contains('pswp__img'),
        o = e.contains('pswp__item') || e.contains('pswp__zoom-wrap');
      s
        ? this._doClickOrTapAction('imageClick', t, i)
        : o && this._doClickOrTapAction('bgClick', t, i);
    }
    tap(t, i) {
      b(i) && this._doClickOrTapAction('tap', t, i);
    }
    doubleTap(t, i) {
      b(i) && this._doClickOrTapAction('doubleTap', t, i);
    }
    _doClickOrTapAction(t, i, e) {
      const { pswp: s } = this.gestures,
        { currSlide: o } = s,
        n = s.options[t + 'Action'];
      if ('function' != typeof n)
        switch (n) {
          case 'close':
          case 'next':
            s[n]();
            break;
          case 'zoom':
            o.toggleZoom(i);
            break;
          case 'zoom-or-close':
            o.isZoomable() && o.zoomLevels.secondary !== o.zoomLevels.initial
              ? o.toggleZoom(i)
              : s.options.clickToCloseNonZoomable && s.close();
            break;
          case 'toggle-controls':
            this.gestures.pswp.template.classList.toggle('pswp--ui-visible');
        }
      else n.call(s, i, e);
    }
  }
  class L {
    constructor(t) {
      (this.pswp = t),
        (this.p1 = {}),
        (this.p2 = {}),
        (this.prevP1 = {}),
        (this.prevP2 = {}),
        (this.startP1 = {}),
        (this.startP2 = {}),
        (this.velocity = {}),
        (this._lastStartP1 = {}),
        (this._intervalP1 = {}),
        (this._numActivePoints = 0),
        (this._ongoingPointers = []),
        (this._touchEventEnabled = 'ontouchstart' in window),
        (this._pointerEventEnabled = !!window.PointerEvent),
        (this.supportsTouch =
          this._touchEventEnabled ||
          (this._pointerEventEnabled && navigator.maxTouchPoints > 1)),
        this.supportsTouch || (t.options.allowPanToNext = !1),
        (this.drag = new x(this)),
        (this.zoomLevels = new P(this)),
        (this.tapHandler = new z(this)),
        t.on('bindEvents', () => {
          t.events.add(t.scrollWrap, 'click', (t) => this._onClick(t)),
            this._pointerEventEnabled
              ? this._bindEvents('pointer', 'down', 'up', 'cancel')
              : this._touchEventEnabled
              ? (this._bindEvents('touch', 'start', 'end', 'cancel'),
                (t.scrollWrap.ontouchmove = () => {}),
                (t.scrollWrap.ontouchend = () => {}))
              : this._bindEvents('mouse', 'down', 'up');
        });
    }
    _bindEvents(t, i, e, s) {
      const { pswp: o } = this,
        { events: n } = o,
        a = s ? t + s : '';
      n.add(o.scrollWrap, t + i, this.onPointerDown.bind(this)),
        n.add(window, t + 'move', this.onPointerMove.bind(this)),
        n.add(window, t + e, this.onPointerUp.bind(this)),
        a && n.add(o.scrollWrap, a, this.onPointerUp.bind(this));
    }
    onPointerDown(t) {
      let i;
      if (
        (('mousedown' !== t.type && 'mouse' !== t.pointerType) || (i = !0),
        i && t.button > 0)
      )
        return;
      const { pswp: e } = this;
      e.opener.isOpen
        ? e.dispatch('pointerDown', { originalEvent: t }).defaultPrevented ||
          (i && (e.mouseDetected(), this._preventPointerEventBehaviour(t)),
          e.animations.stopAll(),
          this._updatePoints(t),
          (this.pointerDown = !0),
          1 === this._numActivePoints &&
            ((this.dragAxis = null), s(this.startP1, this.p1)),
          this._numActivePoints > 1
            ? (this._clearTapTimer(), (this.isMultitouch = !0))
            : (this.isMultitouch = !1))
        : t.preventDefault();
    }
    onPointerMove(t) {
      t.preventDefault(),
        this._numActivePoints &&
          (this._updatePoints(t),
          this.pswp.dispatch('pointerMove', { originalEvent: t })
            .defaultPrevented ||
            (1 !== this._numActivePoints || this.isDragging
              ? this._numActivePoints > 1 &&
                !this.isZooming &&
                (this._finishDrag(),
                (this.isZooming = !0),
                this._updateStartPoints(),
                this.zoomLevels.start(),
                this._rafStopLoop(),
                this._rafRenderLoop())
              : (this.dragAxis || this._calculateDragDirection(),
                this.dragAxis &&
                  !this.isDragging &&
                  (this.isZooming &&
                    ((this.isZooming = !1), this.zoomLevels.end()),
                  (this.isDragging = !0),
                  this._clearTapTimer(),
                  this._updateStartPoints(),
                  (this._intervalTime = Date.now()),
                  (this._velocityCalculated = !1),
                  s(this._intervalP1, this.p1),
                  (this.velocity.x = 0),
                  (this.velocity.y = 0),
                  this.drag.start(),
                  this._rafStopLoop(),
                  this._rafRenderLoop()))));
    }
    _finishDrag() {
      this.isDragging &&
        ((this.isDragging = !1),
        this._velocityCalculated || this._updateVelocity(!0),
        this.drag.end(),
        (this.dragAxis = null));
    }
    onPointerUp(t) {
      this._numActivePoints &&
        (this._updatePoints(t, !0),
        this.pswp.dispatch('pointerUp', { originalEvent: t })
          .defaultPrevented ||
          (0 === this._numActivePoints &&
            ((this.pointerDown = !1),
            this._rafStopLoop(),
            this.isDragging
              ? this._finishDrag()
              : this.isZooming || this.isMultitouch || this._finishTap(t)),
          this._numActivePoints < 2 &&
            this.isZooming &&
            ((this.isZooming = !1),
            this.zoomLevels.end(),
            1 === this._numActivePoints &&
              ((this.dragAxis = null), this._updateStartPoints()))));
    }
    _rafRenderLoop() {
      (this.isDragging || this.isZooming) &&
        (this._updateVelocity(),
        this.isDragging
          ? a(this.p1, this.prevP1) || this.drag.change()
          : a(this.p1, this.prevP1) ||
            a(this.p2, this.prevP2) ||
            this.zoomLevels.change(),
        this._updatePrevPoints(),
        (this.raf = requestAnimationFrame(this._rafRenderLoop.bind(this))));
    }
    _updateVelocity(t) {
      const i = Date.now(),
        e = i - this._intervalTime;
      (e < 50 && !t) ||
        ((this.velocity.x = this._getVelocity('x', e)),
        (this.velocity.y = this._getVelocity('y', e)),
        (this._intervalTime = i),
        s(this._intervalP1, this.p1),
        (this._velocityCalculated = !0));
    }
    _finishTap(t) {
      const { mainScroll: i } = this.pswp;
      if (i.isShifted()) return void i.moveIndexBy(0, !0);
      if (t.type.indexOf('cancel') > 0) return;
      if ('mouseup' === t.type || 'mouse' === t.pointerType)
        return void this.tapHandler.click(this.startP1, t);
      const e = this.pswp.options.doubleTapAction ? 300 : 0;
      this._tapTimer
        ? (this._clearTapTimer(),
          n(this._lastStartP1, this.startP1) < 25 &&
            this.tapHandler.doubleTap(this.startP1, t))
        : (s(this._lastStartP1, this.startP1),
          (this._tapTimer = setTimeout(() => {
            this.tapHandler.tap(this.startP1, t), this._clearTapTimer();
          }, e)));
    }
    _clearTapTimer() {
      this._tapTimer && (clearTimeout(this._tapTimer), (this._tapTimer = null));
    }
    _getVelocity(t, i) {
      const e = this.p1[t] - this._intervalP1[t];
      return Math.abs(e) > 1 && i > 5 ? e / i : 0;
    }
    _rafStopLoop() {
      this.raf && (cancelAnimationFrame(this.raf), (this.raf = null));
    }
    _preventPointerEventBehaviour(t) {
      return t.preventDefault(), !0;
    }
    _updatePoints(t, i) {
      if (this._pointerEventEnabled) {
        const e = this._ongoingPointers.findIndex((i) => i.id === t.pointerId);
        i && e > -1
          ? this._ongoingPointers.splice(e, 1)
          : i || -1 !== e
          ? e > -1 && this._convertEventPosToPoint(t, this._ongoingPointers[e])
          : this._ongoingPointers.push(this._convertEventPosToPoint(t, {})),
          (this._numActivePoints = this._ongoingPointers.length),
          this._numActivePoints > 0 && s(this.p1, this._ongoingPointers[0]),
          this._numActivePoints > 1 && s(this.p2, this._ongoingPointers[1]);
      } else
        (this._numActivePoints = 0),
          t.type.indexOf('touch') > -1
            ? t.touches &&
              t.touches.length > 0 &&
              (this._convertEventPosToPoint(t.touches[0], this.p1),
              this._numActivePoints++,
              t.touches.length > 1 &&
                (this._convertEventPosToPoint(t.touches[1], this.p2),
                this._numActivePoints++))
            : (this._convertEventPosToPoint(t, this.p1),
              i ? (this._numActivePoints = 0) : this._numActivePoints++);
    }
    _updatePrevPoints() {
      s(this.prevP1, this.p1), s(this.prevP2, this.p2);
    }
    _updateStartPoints() {
      s(this.startP1, this.p1),
        s(this.startP2, this.p2),
        this._updatePrevPoints();
    }
    _calculateDragDirection() {
      if (this.pswp.mainScroll.isShifted()) this.dragAxis = 'x';
      else {
        const t =
          Math.abs(this.p1.x - this.startP1.x) -
          Math.abs(this.p1.y - this.startP1.y);
        if (0 !== t) {
          const i = t > 0 ? 'x' : 'y';
          Math.abs(this.p1[i] - this.startP1[i]) >= 10 && (this.dragAxis = i);
        }
      }
    }
    _convertEventPosToPoint(t, i) {
      return (
        (i.x = t.pageX - this.pswp.offset.x),
        (i.y = t.pageY - this.pswp.offset.y),
        void 0 !== t.pointerId
          ? (i.id = t.pointerId)
          : void 0 !== t.identifier && (i.id = t.identifier),
        i
      );
    }
    _onClick(t) {
      this.pswp.mainScroll.isShifted() &&
        (t.preventDefault(), t.stopPropagation());
    }
  }
  class T {
    constructor(t) {
      (this.pswp = t),
        (this.x = 0),
        (this.slideWidth = 0),
        this.resetPosition();
    }
    resize(t) {
      const { pswp: i } = this;
      (this.slideWidth = Math.round(
        i.viewportSize.x + i.viewportSize.x * i.options.spacing
      )),
        this.moveTo(this.getCurrSlideX()),
        this.itemHolders.forEach((i, e) => {
          l(i.el, (e + this._containerShiftIndex) * this.slideWidth),
            t && i.slide && i.slide.resize();
        });
    }
    resetPosition() {
      (this._currPositionIndex = 0),
        (this._prevPositionIndex = 0),
        (this._containerShiftIndex = -1);
    }
    appendHolders() {
      this.itemHolders = [];
      for (let t = 0; t < 3; t++) {
        const i = e('pswp__item', !1, this.pswp.container);
        (i.style.display = 1 === t ? 'block' : 'none'),
          this.itemHolders.push({ el: i });
      }
    }
    canBeSwiped() {
      return this.pswp.getNumItems() > 1;
    }
    moveIndexBy(t, i, e) {
      const { pswp: s } = this;
      let o = s.potentialIndex + t;
      s.options.loop
        ? (o = s.getLoopedIndex(o))
        : (o < 0 ? (o = 0) : o >= s.getNumItems() && (o = s.getNumItems() - 1),
          (t = o - s.potentialIndex)),
        (s.potentialIndex = o),
        (this._currPositionIndex -= t),
        s.animations.stopMainScroll();
      const n = this.getCurrSlideX();
      if (
        (i
          ? (s.animations.startSpring({
              isMainScroll: !0,
              start: this.x,
              end: n,
              velocity: e || 0,
              naturalFrequency: 30,
              dampingRatio: 1,
              onUpdate: (t) => {
                this.moveTo(t);
              },
              onComplete: () => {
                this.updateCurrItem(), s.appendHeavy();
              },
            }),
            Math.abs(s.potentialIndex - s.currIndex) > 1 &&
              this.updateCurrItem())
          : (this.moveTo(n), this.updateCurrItem()),
        t)
      )
        return !0;
    }
    getCurrSlideX() {
      return this.slideWidth * this._currPositionIndex;
    }
    isShifted() {
      return this.x !== this.getCurrSlideX();
    }
    updateCurrItem() {
      const { pswp: t } = this,
        i = this._prevPositionIndex - this._currPositionIndex;
      if (!i) return;
      (this._prevPositionIndex = this._currPositionIndex),
        (t.currIndex = t.potentialIndex);
      let e,
        s = Math.abs(i);
      s >= 3 && ((this._containerShiftIndex += i + (i > 0 ? -3 : 3)), (s = 3));
      for (let o = 0; o < s; o++)
        i > 0
          ? ((e = this.itemHolders.shift()),
            (this.itemHolders[2] = e),
            this._containerShiftIndex++,
            l(e.el, (this._containerShiftIndex + 2) * this.slideWidth),
            t.setContent(e, t.currIndex - s + o + 2))
          : ((e = this.itemHolders.pop()),
            this.itemHolders.unshift(e),
            this._containerShiftIndex--,
            l(e.el, this._containerShiftIndex * this.slideWidth),
            t.setContent(e, t.currIndex + s - o - 2));
      Math.abs(this._containerShiftIndex) > 50 &&
        !this.isShifted() &&
        (this.resetPosition(), this.resize()),
        t.animations.stopAllPan(),
        this.itemHolders.forEach((t, i) => {
          t.slide && t.slide.setIsActive(1 === i);
        }),
        (t.currSlide = this.itemHolders[1].slide),
        t.lazyLoader.update(i),
        t.currSlide.applyCurrentZoomPan(),
        t.dispatch('change');
    }
    moveTo(t, i) {
      let e, s;
      !this.pswp.options.loop &&
        i &&
        ((e =
          (this.slideWidth * this._currPositionIndex - t) / this.slideWidth),
        (e += this.pswp.currIndex),
        (s = Math.round(t - this.x)),
        ((e < 0 && s > 0) || (e >= this.pswp.getNumItems() - 1 && s < 0)) &&
          (t = this.x + 0.35 * s)),
        (this.x = t),
        l(this.pswp.container, t),
        this.pswp.dispatch('moveMainScroll', { x: t, dragging: i });
    }
  }
  class C {
    constructor(t) {
      (this.pswp = t),
        t.on('bindEvents', () => {
          t.options.initialPointerPos || this._focusRoot(),
            t.events.add(document, 'focusin', this._onFocusIn.bind(this)),
            t.events.add(document, 'keydown', this._onKeyDown.bind(this));
        });
      const i = document.activeElement;
      t.on('destroy', () => {
        t.options.returnFocus && i && this._wasFocused && i.focus();
      });
    }
    _focusRoot() {
      this._wasFocused || (this.pswp.template.focus(), (this._wasFocused = !0));
    }
    _onKeyDown(t) {
      const { pswp: i } = this;
      if (i.dispatch('keydown', { originalEvent: t }).defaultPrevented) return;
      if (
        (function (t) {
          if (2 === t.which || t.ctrlKey || t.metaKey || t.altKey || t.shiftKey)
            return !0;
        })(t)
      )
        return;
      let e, s, o;
      switch (t.keyCode) {
        case 27:
          i.options.escKey && (e = 'close');
          break;
        case 90:
          e = 'toggleZoom';
          break;
        case 37:
          s = 'x';
          break;
        case 38:
          s = 'y';
          break;
        case 39:
          (s = 'x'), (o = !0);
          break;
        case 40:
          (o = !0), (s = 'y');
          break;
        case 9:
          this._focusRoot();
      }
      if (s) {
        t.preventDefault();
        const { currSlide: n } = i;
        i.options.arrowKeys && 'x' === s && i.getNumItems() > 1
          ? (e = o ? 'next' : 'prev')
          : n &&
            n.currZoomLevel > n.zoomLevels.fit &&
            ((n.pan[s] += o ? -80 : 80), n.panTo(n.pan.x, n.pan.y));
      }
      e && (t.preventDefault(), i[e]());
    }
    _onFocusIn(t) {
      const { template: i } = this.pswp;
      document === t.target ||
        i === t.target ||
        i.contains(t.target) ||
        i.focus();
    }
  }
  class I {
    constructor(t) {
      this.props = t;
      const { target: i, onComplete: e, transform: s } = t;
      let { duration: o, easing: n } = t;
      const a = s ? 'transform' : 'opacity',
        r = t[a];
      (this._target = i),
        (this._onComplete = e),
        (o = o || 333),
        (n = n || 'cubic-bezier(.4,0,.22,1)'),
        (this._onTransitionEnd = this._onTransitionEnd.bind(this)),
        (this._firstFrameTimeout = setTimeout(() => {
          p(i, a, o, n),
            (this._firstFrameTimeout = setTimeout(() => {
              i.addEventListener('transitionend', this._onTransitionEnd, !1),
                i.addEventListener(
                  'transitioncancel',
                  this._onTransitionEnd,
                  !1
                ),
                (i.style[a] = r);
            }, 30));
        }, 0));
    }
    _onTransitionEnd(t) {
      t.target === this._target && this._finalizeAnimation();
    }
    _finalizeAnimation() {
      this._finished ||
        ((this._finished = !0),
        this.onFinish(),
        this._onComplete && this._onComplete());
    }
    destroy() {
      this._firstFrameTimeout && clearTimeout(this._firstFrameTimeout),
        p(this._target),
        this._target.removeEventListener(
          'transitionend',
          this._onTransitionEnd,
          !1
        ),
        this._target.removeEventListener(
          'transitioncancel',
          this._onTransitionEnd,
          !1
        ),
        this._finished || this._finalizeAnimation();
    }
  }
  class A {
    constructor(t, i, e) {
      (this.velocity = 1e3 * t),
        (this._dampingRatio = i || 0.75),
        (this._naturalFrequency = e || 12),
        this._dampingRatio < 1 &&
          (this._dampedFrequency =
            this._naturalFrequency *
            Math.sqrt(1 - this._dampingRatio * this._dampingRatio));
    }
    easeFrame(t, i) {
      let e,
        s = 0;
      i /= 1e3;
      const o = Math.E ** (-this._dampingRatio * this._naturalFrequency * i);
      if (1 === this._dampingRatio)
        (e = this.velocity + this._naturalFrequency * t),
          (s = (t + e * i) * o),
          (this.velocity = s * -this._naturalFrequency + e * o);
      else if (this._dampingRatio < 1) {
        e =
          (1 / this._dampedFrequency) *
          (this._dampingRatio * this._naturalFrequency * t + this.velocity);
        const n = Math.cos(this._dampedFrequency * i),
          a = Math.sin(this._dampedFrequency * i);
        (s = o * (t * n + e * a)),
          (this.velocity =
            s * -this._naturalFrequency * this._dampingRatio +
            o *
              (-this._dampedFrequency * t * a + this._dampedFrequency * e * n));
      }
      return s;
    }
  }
  class Z {
    constructor(t) {
      this.props = t;
      const {
          start: i,
          end: e,
          velocity: s,
          onUpdate: o,
          onComplete: n,
          onFinish: a,
          dampingRatio: r,
          naturalFrequency: h,
        } = t,
        l = new A(s, r, h);
      let p = Date.now(),
        c = i - e;
      this._onFinish = a;
      const d = () => {
        this._raf &&
          ((c = l.easeFrame(c, Date.now() - p)),
          Math.abs(c) < 1 && Math.abs(l.velocity) < 50
            ? (o(e), n && n(), this.onFinish())
            : ((p = Date.now()),
              o(c + e),
              (this._raf = requestAnimationFrame(d))));
      };
      this._raf = requestAnimationFrame(d);
    }
    destroy() {
      this._raf >= 0 && cancelAnimationFrame(this._raf), (this._raf = null);
    }
  }
  class O {
    constructor() {
      this.activeAnimations = [];
    }
    startSpring(t) {
      this._start(t, !0);
    }
    startTransition(t) {
      this._start(t);
    }
    _start(t, i) {
      let e;
      return (
        (e = i ? new Z(t) : new I(t)),
        this.activeAnimations.push(e),
        (e.onFinish = () => this.stop(e)),
        e
      );
    }
    stop(t) {
      t.destroy();
      const i = this.activeAnimations.indexOf(t);
      i > -1 && this.activeAnimations.splice(i, 1);
    }
    stopAll() {
      this.activeAnimations.forEach((t) => {
        t.destroy();
      }),
        (this.activeAnimations = []);
    }
    stopAllPan() {
      this.activeAnimations = this.activeAnimations.filter(
        (t) => !t.props.isPan || (t.destroy(), !1)
      );
    }
    stopMainScroll() {
      this.activeAnimations = this.activeAnimations.filter(
        (t) => !t.props.isMainScroll || (t.destroy(), !1)
      );
    }
    isPanRunning() {
      return this.activeAnimations.some((t) => t.props.isPan);
    }
  }
  class M {
    constructor(t) {
      (this.pswp = t),
        t.events.add(t.template, 'wheel', this._onWheel.bind(this));
    }
    _onWheel(t) {
      t.preventDefault();
      const { currSlide: i } = this.pswp;
      let { deltaX: e, deltaY: s } = t;
      if (i)
        if (
          (this.pswp.dispatch('wheel'),
          t.ctrlKey || this.pswp.options.wheelToZoom)
        ) {
          if (i.isZoomable()) {
            let e = -s;
            1 === t.deltaMode ? (e *= 0.05) : (e *= t.deltaMode ? 1 : 0.002),
              (e = 2 ** e),
              this.pswp.options.getWheelZoomFactorFn &&
                (e = this.pswp.options.getWheelZoomFactorFn(t, this.pswp));
            const o = i.currZoomLevel * e;
            i.zoomTo(o, { x: t.clientX, y: t.clientY });
          }
        } else
          i.isPannable() &&
            (1 === t.deltaMode && ((e *= 18), (s *= 18)),
            i.panTo(i.pan.x - e, i.pan.y - s));
    }
  }
  class D {
    constructor(t, i) {
      const s = i.name || i.class;
      let o = i.html;
      if (!1 === t.options[s]) return;
      'string' == typeof t.options[s + 'SVG'] && (o = t.options[s + 'SVG']),
        t.dispatch('uiElementCreate', { data: i });
      let n,
        a = 'pswp__';
      i.isButton && (a += 'button pswp__button--'),
        (a += i.class || i.name),
        i.isButton
          ? ((n = e(a, 'button')),
            (n.type = 'button'),
            (n.innerHTML = (function (t) {
              if ('string' == typeof t) return t;
              if (!t || !t.isCustomSVG) return '';
              const i = t;
              let e =
                '<svg aria-hidden="true" class="pswp__icn" viewBox="0 0 %d %d" width="%d" height="%d">';
              return (
                (e = e.split('%d').join(i.size || 32)),
                i.outlineID &&
                  (e +=
                    '<use class="pswp__icn-shadow" xlink:href="#' +
                    i.outlineID +
                    '"/>'),
                (e += i.inner),
                (e += '</svg>'),
                e
              );
            })(o)),
            'string' == typeof t.options[s + 'Title']
              ? (n.title = t.options[s + 'Title'])
              : i.title && (n.title = i.title))
          : (n = e(a)),
        i.onInit && i.onInit(n, t),
        i.onClick &&
          (n.onclick = (e) => {
            'string' == typeof i.onClick ? t[i.onClick]() : i.onClick(e, n, t);
          });
      const r = i.appendTo || 'bar';
      let h;
      'bar' === r
        ? (t.topBar ||
            (t.topBar = e(
              'pswp__top-bar pswp__hide-on-close',
              !1,
              t.scrollWrap
            )),
          (h = t.topBar))
        : (n.classList.add('pswp__hide-on-close'),
          (h = 'wrapper' === r ? t.scrollWrap : t.template)),
        h.appendChild(n);
    }
  }
  function E(t, i, e) {
    t.classList.add('pswp__button--arrow'),
      i.on('change', () => {
        i.options.loop ||
          (t.disabled = e
            ? !(i.currIndex < i.getNumItems() - 1)
            : !(i.currIndex > 0));
      });
  }
  const F = {
      name: 'arrowPrev',
      class: 'arrow--prev',
      title: 'Previous',
      order: 10,
      isButton: !0,
      appendTo: 'wrapper',
      html: {
        isCustomSVG: !0,
        size: 60,
        inner:
          '<path d="M29 43l-3 3-16-16 16-16 3 3-13 13 13 13z" id="pswp__icn-arrow"/>',
        outlineID: 'pswp__icn-arrow',
      },
      onClick: 'prev',
      onInit: E,
    },
    R = {
      name: 'arrowNext',
      class: 'arrow--next',
      title: 'Next',
      order: 11,
      isButton: !0,
      appendTo: 'wrapper',
      html: {
        isCustomSVG: !0,
        size: 60,
        inner: '<use xlink:href="#pswp__icn-arrow"/>',
        outlineID: 'pswp__icn-arrow',
      },
      onClick: 'next',
      onInit: (t, i) => {
        E(t, i, !0);
      },
    },
    k = {
      name: 'close',
      title: 'Close',
      order: 20,
      isButton: !0,
      html: {
        isCustomSVG: !0,
        inner:
          '<path d="M24 10l-2-2-6 6-6-6-2 2 6 6-6 6 2 2 6-6 6 6 2-2-6-6z" id="pswp__icn-close"/>',
        outlineID: 'pswp__icn-close',
      },
      onClick: 'close',
    },
    B = {
      name: 'zoom',
      title: 'Zoom (z)',
      order: 10,
      isButton: !0,
      html: {
        isCustomSVG: !0,
        inner:
          '<path d="M17.426 19.926a6 6 0 1 1 1.5-1.5L23 22.5 21.5 24l-4.074-4.074z" id="pswp__icn-zoom"/><path fill="currentColor" class="pswp__zoom-icn-bar-h" d="M11 16v-2h6v2z"/><path fill="currentColor" class="pswp__zoom-icn-bar-v" d="M13 12h2v6h-2z"/>',
        outlineID: 'pswp__icn-zoom',
      },
      onClick: 'toggleZoom',
    },
    H = {
      name: 'preloader',
      appendTo: 'wrapper',
      onInit: (t, i) => {
        let e, s, o;
        const n = () => {
            e &&
              ((t.style.left = Math.round((i.viewportSize.x - 24) / 2) + 'px'),
              (t.style.top = Math.round((i.viewportSize.y - 24) / 2) + 'px'));
          },
          a = (i, e) => {
            t.classList[e ? 'add' : 'remove']('pswp__preloader--' + i);
          },
          r = (t) => {
            e !== t &&
              ((e = t),
              clearTimeout(o),
              a('hiding', !t),
              t
                ? (n(), a('active', !0))
                : (o = setTimeout(() => {
                    a('active', !1);
                  }, 350)));
          };
        i.on('change', () => {
          i.currSlide.isLoading
            ? (clearTimeout(s),
              (s = setTimeout(() => {
                r(i.currSlide.isLoading);
              }, 1100)))
            : r(!1);
        }),
          i.on('loadComplete', (t) => {
            i.currSlide === t.slide && r(!1);
          }),
          i.on('resize', n);
      },
    },
    N = {
      name: 'counter',
      order: 5,
      onInit: (t, i) => {
        i.on('change', () => {
          t.innerHTML =
            i.currIndex + 1 + i.options.indexIndicatorSep + i.getNumItems();
        });
      },
    };
  function W(t, i) {
    t.classList[i ? 'add' : 'remove']('pswp--zoomed-in');
  }
  class q {
    constructor(t) {
      this.pswp = t;
    }
    init() {
      const { pswp: t } = this;
      (this.isRegistered = !1),
        (this.uiElementsData = [k, F, R, B, H, N]),
        t.dispatch('uiRegister'),
        this.uiElementsData.sort((t, i) => (t.order || 0) - (i.order || 0)),
        (this.items = []),
        (this.isRegistered = !0),
        this.uiElementsData.forEach((t) => {
          this.registerElement(t);
        }),
        1 === t.getNumItems() && t.template.classList.add('pswp--one-slide'),
        t.on('zoomPanUpdate', () => this._onZoomPanUpdate());
    }
    registerElement(t) {
      this.isRegistered
        ? this.items.push(new D(this.pswp, t))
        : this.uiElementsData.push(t);
    }
    _onZoomPanUpdate() {
      const { template: t, currSlide: i, options: e } = this.pswp;
      let { currZoomLevel: s } = i;
      if (this.pswp.opener.isClosing) return;
      if (
        (this.pswp.opener.isOpen || (s = i.zoomLevels.initial),
        s === this._lastUpdatedZoomLevel)
      )
        return;
      this._lastUpdatedZoomLevel = s;
      const o = i.zoomLevels.initial - i.zoomLevels.secondary;
      if (Math.abs(o) < 0.01)
        return W(t, !1), void t.classList.remove('pswp--zoom-allowed');
      t.classList.add('pswp--zoom-allowed');
      const n = o < 0;
      s === i.zoomLevels.secondary
        ? W(t, n)
        : s > i.zoomLevels.secondary
        ? W(t, !0)
        : W(t, !1),
        ('zoom' !== e.imageClickAction &&
          'zoom-or-close' !== e.imageClickAction) ||
          t.classList.add('pswp--click-to-zoom');
    }
  }
  function V(t, i, e) {
    if (t.src && t.w && t.h) {
      const { options: s } = i,
        o = y(s, i.viewportSize || g(s)),
        n = new _(s, t, -1);
      n.update(t.w, t.h, o);
      const a = document.createElement('img');
      return (
        (a.decoding = 'async'),
        (a.sizes = Math.ceil(t.w * n.initial) + 'px'),
        t.srcset && (a.srcset = t.srcset),
        (a.src = t.src),
        e && 'decode' in a && a.decode(),
        a
      );
    }
  }
  class G {
    constructor(t) {
      (this.pswp = t), this.clearRecent();
    }
    update(t) {
      const { pswp: i } = this;
      if (i.dispatch('lazyLoad').defaultPrevented) return;
      const { preload: e } = i.options,
        s = void 0 === t || t >= 0;
      let o;
      for (o = 0; o <= e[1]; o++)
        this.loadSlideByIndex(i.currIndex + (s ? o : -o));
      for (o = 1; o <= e[0]; o++)
        this.loadSlideByIndex(i.currIndex + (s ? -o : o));
    }
    clearRecent() {
      this._recentlyLazyLoadedIndexes = [];
    }
    addRecent(t) {
      if (!(this._recentlyLazyLoadedIndexes.indexOf(t) > -1))
        return (
          this._recentlyLazyLoadedIndexes.length > 14 &&
            this._recentlyLazyLoadedIndexes.pop(),
          this._recentlyLazyLoadedIndexes.unshift(t),
          !0
        );
    }
    loadSlideByIndex(t) {
      (t = this.pswp.getLoopedIndex(t)),
        this.addRecent(t) &&
          (function (t, i) {
            const e = i.getItemData(t);
            i.dispatch('lazyLoadSlide', { index: t, itemData: e })
              .defaultPrevented || V(e, i);
          })(t, this.pswp);
    }
    loadSlideByData(t, i) {
      V(t, this.pswp, i);
    }
  }
  class U {
    constructor(t, i) {
      (this.type = t), i && Object.assign(this, i);
    }
    preventDefault() {
      this.defaultPrevented = !0;
    }
  }
  const K = 0.003;
  class j {
    constructor(t) {
      (this.pswp = t),
        (this.isClosed = !0),
        (this._prepareOpen = this._prepareOpen.bind(this)),
        t.on('firstZoomPan', this._prepareOpen);
    }
    open() {
      this._prepareOpen(), this._start();
    }
    close() {
      return !(
        this.isClosed ||
        this.isClosing ||
        this.isOpening ||
        ((this.isOpen = !1),
        (this.isOpening = !1),
        (this.isClosing = !0),
        (this._duration = this.pswp.options.hideAnimationDuration),
        this._applyStartProps(),
        setTimeout(
          () => {
            this._start();
          },
          this._croppedZoom ? 30 : 0
        ),
        0)
      );
    }
    _prepareOpen() {
      this.pswp.off('firstZoomPan', this._prepareOpen),
        this.isOpening ||
          ((this.isOpening = !0),
          (this.isClosing = !1),
          (this._duration = this.pswp.options.showAnimationDuration),
          this._applyStartProps());
    }
    _applyStartProps() {
      const { pswp: t } = this,
        i = this.pswp.currSlide,
        { options: e } = t;
      if (
        ('fade' === e.showHideAnimationType
          ? ((e.showHideOpacity = !0), (this._thumbBounds = !1))
          : 'none' === e.showHideAnimationType
          ? ((e.showHideOpacity = !1),
            (this._duration = 0),
            (this._thumbBounds = !1))
          : this.isOpening && t._initialThumbBounds
          ? (this._thumbBounds = t._initialThumbBounds)
          : (this._thumbBounds = this.pswp.getThumbBounds()),
        (this._placeholder = i.getPlaceholder()),
        t.animations.stopAll(),
        (this._useAnimation = this._duration > 50),
        (this._animateZoom =
          Boolean(this._thumbBounds) &&
          i.isZoomable() &&
          (!this.isClosing || !t.mainScroll.isShifted())),
        this._animateZoom
          ? (this._animateRootOpacity = e.showHideOpacity)
          : ((this._animateRootOpacity = !0),
            this.isOpening &&
              (i.zoomAndPanToInitial(), i.applyCurrentZoomPan())),
        (this._animateBgOpacity = !this._animateRootOpacity),
        (this._opacityElement = this._animateRootOpacity ? t.template : t.bg),
        !this._useAnimation)
      )
        return (
          (this._duration = 0),
          (this._animateZoom = !1),
          (this._animateBgOpacity = !1),
          (this._animateRootOpacity = !0),
          void (
            this.isOpening &&
            ((t.template.style.opacity = K), t.applyBgOpacity(1))
          )
        );
      this._animateZoom && this._thumbBounds.innerRect
        ? ((this._croppedZoom = !0),
          (this._cropContainer1 = this.pswp.container),
          (this._cropContainer2 = this.pswp.currSlide.holderElement),
          (t.container.style.overflow = 'hidden'),
          (t.container.style.width = t.viewportSize.x + 'px'))
        : (this._croppedZoom = !1),
        this.isOpening
          ? (this._animateBgOpacity &&
              ((t.bg.style.opacity = K), (t.template.style.opacity = 1)),
            this._animateRootOpacity &&
              ((t.template.style.opacity = K), t.applyBgOpacity(1)),
            this._animateZoom &&
              (this._setClosedStateZoomPan(),
              this._placeholder &&
                ((this._placeholder.willChange = 'transform'),
                (this._placeholder.style.opacity = K))))
          : this.isClosing &&
            ((t.mainScroll.itemHolders[0].el.style.display = 'none'),
            (t.mainScroll.itemHolders[2].el.style.display = 'none'),
            this._croppedZoom &&
              0 !== t.mainScroll.x &&
              (t.mainScroll.resetPosition(), t.mainScroll.resize()));
    }
    _start() {
      this.isOpening &&
      this._useAnimation &&
      this._placeholder &&
      'IMG' === this._placeholder.tagName
        ? new Promise((t) => {
            let i = !1,
              e = !0;
            var s;
            ((s = this._placeholder),
            'decode' in s
              ? s.decode()
              : s.complete
              ? Promise.resolve(s)
              : new Promise((t, i) => {
                  (s.onload = () => t(s)), (s.onerror = i);
                })).finally(() => {
              (i = !0), e || t();
            }),
              setTimeout(() => {
                (e = !1), i && t();
              }, 50),
              setTimeout(t, 250);
          }).finally(() => this._initiate())
        : this._initiate();
    }
    _initiate() {
      this.pswp.template.style.setProperty(
        '--pswp-transition-duration',
        this._duration + 'ms'
      ),
        this.pswp.dispatch('initialZoom' + (this.isOpening ? 'In' : 'Out')),
        this.pswp.template.classList[this.isOpening ? 'add' : 'remove'](
          'pswp--ui-visible'
        ),
        this.isOpening
          ? (this._placeholder && (this._placeholder.style.opacity = 1),
            this._animateToOpenState())
          : this.isClosing && this._animateToClosedState(),
        this._useAnimation || this._onAnimationComplete();
    }
    _onAnimationComplete() {
      const { pswp: t } = this;
      (this.isOpen = this.isOpening),
        (this.isClosed = this.isClosing),
        (this.isOpening = !1),
        (this.isClosing = !1),
        t.dispatch('initialZoom' + (this.isOpen ? 'InEnd' : 'OutEnd')),
        this.isClosed
          ? t.destroy()
          : this.isOpen &&
            (this._animateZoom &&
              ((t.container.style.overflow = 'visible'),
              (t.container.style.width = '100%')),
            t.currSlide.applyCurrentZoomPan());
    }
    _animateToOpenState() {
      const { pswp: t } = this;
      this._animateZoom &&
        (this._croppedZoom &&
          (this._animateTo(
            this._cropContainer1,
            'transform',
            'translate3d(0,0,0)'
          ),
          this._animateTo(this._cropContainer2, 'transform', 'none')),
        t.currSlide.zoomAndPanToInitial(),
        this._animateTo(
          t.currSlide.container,
          'transform',
          t.currSlide.getCurrentTransform()
        )),
        this._animateBgOpacity &&
          this._animateTo(t.bg, 'opacity', t.options.bgOpacity),
        this._animateRootOpacity && this._animateTo(t.template, 'opacity', 1);
    }
    _animateToClosedState() {
      const { pswp: t } = this;
      this._animateZoom && this._setClosedStateZoomPan(!0),
        this._animateBgOpacity &&
          t.bgOpacity > 0.01 &&
          this._animateTo(t.bg, 'opacity', 0),
        this._animateRootOpacity && this._animateTo(t.template, 'opacity', 0);
    }
    _setClosedStateZoomPan(t) {
      const { pswp: i } = this,
        { innerRect: e } = this._thumbBounds,
        { currSlide: o, viewportSize: n } = i;
      if (this._croppedZoom) {
        const i = -n.x + (this._thumbBounds.x - e.x) + e.w,
          s = -n.y + (this._thumbBounds.y - e.y) + e.h,
          o = n.x - e.w,
          a = n.y - e.h;
        t
          ? (this._animateTo(this._cropContainer1, 'transform', h(i, s)),
            this._animateTo(this._cropContainer2, 'transform', h(o, a)))
          : (l(this._cropContainer1, i, s), l(this._cropContainer2, o, a));
      }
      s(o.pan, e || this._thumbBounds),
        (o.currZoomLevel = this._thumbBounds.w / o.width),
        t
          ? this._animateTo(o.container, 'transform', o.getCurrentTransform())
          : o.applyCurrentZoomPan();
    }
    _animateTo(t, i, e) {
      if (!this._duration) return void (t.style[i] = e);
      const { animations: s } = this.pswp,
        o = {
          duration: this._duration,
          easing: this.pswp.options.easing,
          onComplete: () => {
            s.activeAnimations.length || this._onAnimationComplete();
          },
          target: t,
        };
      (o[i] = e), s.startTransition(o);
    }
  }
  const X = {
    allowPanToNext: !0,
    spacing: 0.1,
    loop: !0,
    pinchToClose: !0,
    closeOnVerticalDrag: !0,
    hideAnimationDuration: 333,
    showAnimationDuration: 333,
    zoomAnimationDuration: 333,
    escKey: !0,
    arrowKeys: !0,
    returnFocus: !0,
    limitMaxZoom: !0,
    clickToCloseNonZoomable: !0,
    imageClickAction: 'zoom-or-close',
    bgClickAction: 'close',
    tapAction: 'toggle-controls',
    doubleTapAction: 'zoom',
    indexIndicatorSep: ' / ',
    bgOpacity: 0.8,
    index: 0,
    errorMsg:
      '<div class="pswp__error-msg"><a href="" target="_blank">The image</a> could not be loaded.</div>',
    preload: [1, 2],
    easing: 'cubic-bezier(.4,0,.22,1)',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  };
  class Y extends class extends class {
    constructor() {
      this._listeners = {};
    }
    on(t, i) {
      this._listeners[t] || (this._listeners[t] = []),
        this._listeners[t].push(i),
        this.pswp && this.pswp.on(t, i);
    }
    off(t, i) {
      this._listeners[t] &&
        (this._listeners[t] = this._listeners[t].filter((t) => i !== t)),
        this.pswp && this.pswp.off(t, i);
    }
    dispatch(t, i) {
      if (this.pswp) return this.pswp.dispatch(t, i);
      const e = new U(t, i);
      return this._listeners
        ? (this._listeners[t] &&
            this._listeners[t].forEach((t) => {
              t.call(this, e);
            }),
          e)
        : e;
    }
  } {
    getNumItems() {
      let t;
      const { dataSource: i } = this.options;
      return (
        i
          ? i.length
            ? (t = i.length)
            : i.gallery &&
              (i.items || (i.items = this._getGalleryDOMElements(i.gallery)),
              i.items && (t = i.items.length))
          : (t = 0),
        this.dispatch('numItems', { dataSource: i, numItems: t }).numItems
      );
    }
    getItemData(t) {
      const { dataSource: i } = this.options;
      let e;
      Array.isArray(i)
        ? (e = i[t])
        : i &&
          i.gallery &&
          (i.items || (i.items = this._getGalleryDOMElements(i.gallery)),
          (e = i.items[t]));
      let s = e;
      return (
        s instanceof Element && (s = this._domElementToItemData(s)),
        this.dispatch('itemData', { itemData: s || {}, index: t }).itemData
      );
    }
    _getGalleryDOMElements(t) {
      return this.options.children || this.options.childSelector
        ? (function (t, i, e = document) {
            let s = [];
            if (t instanceof Element) s = [t];
            else if (t instanceof NodeList || Array.isArray(t))
              s = Array.from(t);
            else {
              const o = 'string' == typeof t ? t : i;
              o && (s = Array.from(e.querySelectorAll(o)));
            }
            return s;
          })(this.options.children, this.options.childSelector, t) || []
        : [t];
    }
    _domElementToItemData(t) {
      const i = { element: t },
        e = 'A' === t.tagName ? t : t.querySelector('a');
      if (!e) return i;
      (i.src = e.dataset.pswpSrc || e.href),
        (i.srcset = e.dataset.pswpSrcset),
        (i.w = parseInt(e.dataset.pswpWidth, 10)),
        (i.h = parseInt(e.dataset.pswpHeight, 10));
      const s = t.querySelector('img');
      return (
        s &&
          ((i.msrc = s.currentSrc || s.src), (i.alt = s.getAttribute('alt'))),
        e.dataset.cropped && (i.thumbCropped = !0),
        i
      );
    }
  } {
    constructor(t, i) {
      super(),
        (this.items = t),
        this._prepareOptions(i),
        (this.offset = {}),
        (this._prevViewportSize = {}),
        (this.viewportSize = {}),
        (this.bgOpacity = 1),
        (this.events = new m()),
        (this.animations = new O()),
        (this.mainScroll = new T(this)),
        (this.gestures = new L(this)),
        (this.opener = new j(this)),
        (this.keyboard = new C(this)),
        (this.lazyLoader = new G(this));
    }
    init() {
      if (this.isOpen || this.isDestroying) return;
      (this.isOpen = !0),
        this.getNumItems() < 3 && (this.options.loop = !1),
        this.dispatch('init'),
        this._createMainStructure();
      let t = 'pswp--open';
      return (
        this.gestures.supportsTouch && (t += ' pswp--touch'),
        this.options.allowMouseDrag || (t += ' pswp--no-mouse-drag'),
        this.options.mainClass && (t += ' ' + this.options.mainClass),
        (this.template.className += ' ' + t),
        (this.currIndex = this.options.index || 0),
        (this.potentialIndex = this.currIndex),
        this.dispatch('firstUpdate'),
        (this.scrollWheel = new M(this)),
        (Number.isNaN(this.currIndex) ||
          this.currIndex < 0 ||
          this.currIndex >= this.getNumItems()) &&
          (this.currIndex = 0),
        this.gestures.supportsTouch || this.mouseDetected(),
        this.updateSize(),
        (this.offset.y = window.pageYOffset),
        (this._initialItemData = this.getItemData(this.currIndex)),
        this.dispatch('gettingData', this.currIndex, this._initialItemData, !0),
        (this._initialThumbBounds = this.getThumbBounds()),
        this.dispatch('initialLayout'),
        this.on('initialZoomInEnd', () => {
          this.setContent(this.mainScroll.itemHolders[0], this.currIndex - 1),
            this.setContent(this.mainScroll.itemHolders[2], this.currIndex + 1),
            (this.mainScroll.itemHolders[0].el.style.display = 'block'),
            (this.mainScroll.itemHolders[2].el.style.display = 'block'),
            this.appendHeavy(),
            this.lazyLoader.update(),
            this.events.add(
              window,
              'resize',
              this._handlePageResize.bind(this)
            ),
            this.events.add(
              window,
              'scroll',
              this._updatePageScrollOffset.bind(this)
            ),
            this.dispatch('bindEvents');
        }),
        this.setContent(this.mainScroll.itemHolders[1], this.currIndex),
        this.dispatch('change'),
        this.opener.open(),
        this.dispatch('afterInit'),
        !0
      );
    }
    getLoopedIndex(t) {
      const i = this.getNumItems();
      return (
        this.options.loop && (t > i - 1 && (t -= i), t < 0 && (t += i)),
        r(t, 0, i - 1)
      );
    }
    getIndexDiff(t) {
      if (this.options.loop) {
        const i = this.getNumItems() - 1;
        if (0 === this.currIndex && t === i) return -1;
        if (this.currIndex === i && 0 === t) return 1;
      }
      return t - this.currIndex;
    }
    appendHeavy() {
      this.mainScroll.itemHolders.forEach((t) => {
        t.slide && t.slide.appendHeavy();
      });
    }
    goTo(t) {
      (t = this.getLoopedIndex(t)),
        this.mainScroll.moveIndexBy(t - this.potentialIndex) &&
          this.dispatch('afterGoto');
    }
    next() {
      this.goTo(this.potentialIndex + 1);
    }
    prev() {
      this.goTo(this.potentialIndex - 1);
    }
    zoomTo(...t) {
      this.currSlide.zoomTo(...t);
    }
    toggleZoom() {
      this.currSlide.toggleZoom();
    }
    close() {
      this.opener.isOpen &&
        !this.isDestroying &&
        ((this.isDestroying = !0),
        this.dispatch('close'),
        this.events.removeAll(),
        this.opener.close());
    }
    destroy() {
      this.isDestroying
        ? (this.dispatch('destroy'),
          (this.listeners = null),
          (this.scrollWrap.ontouchmove = null),
          (this.scrollWrap.ontouchend = null),
          this.template.remove(),
          this.events.removeAll())
        : this.close();
    }
    setContent(t, i) {
      if ((t.slide && t.slide.destroy(), this.options.loop))
        i = this.getLoopedIndex(i);
      else if (i < 0 || i >= this.getNumItems())
        return void (t.el.innerHTML = '');
      const e = this.getItemData(i),
        s = this.getSlideClass(e, i);
      (t.slide = new s(e, i, this)),
        i === this.currIndex && (this.currSlide = t.slide),
        t.slide.append(t.el);
    }
    getSlideClass(t, i) {
      let e;
      return (
        (e = t.html ? w : t.src ? f : v),
        this.dispatch('slideClass', { itemData: t, index: i, slideClass: e })
          .slideClass || e
      );
    }
    getViewportCenterPoint() {
      return { x: this.viewportSize.x / 2, y: this.viewportSize.y / 2 };
    }
    updateSize(t) {
      if (this.isDestroying) return;
      const i = g(this.options, this);
      (!t && a(i, this._prevViewportSize)) ||
        (s(this._prevViewportSize, i),
        this.dispatch('beforeResize'),
        s(this.viewportSize, this._prevViewportSize),
        this._updatePageScrollOffset(),
        this.dispatch('viewportSize'),
        this.mainScroll.resize(this.opener.isOpen),
        !this.hasMouse &&
          window.matchMedia('(any-hover: hover)').matches &&
          this.mouseDetected(),
        this.dispatch('resize'));
    }
    applyBgOpacity(t) {
      (this.bgOpacity = Math.max(t, 0)),
        (this.bg.style.opacity = this.bgOpacity * this.options.bgOpacity);
    }
    mouseDetected() {
      this.hasMouse ||
        ((this.hasMouse = !0), this.template.classList.add('pswp--has_mouse'));
    }
    _handlePageResize() {
      this.updateSize(),
        /iPhone|iPad|iPod/i.test(window.navigator.userAgent) &&
          setTimeout(() => {
            this.updateSize();
          }, 500);
    }
    _updatePageScrollOffset() {
      this.setScrollOffset(0, window.pageYOffset);
    }
    setScrollOffset(t, i) {
      (this.offset.x = t),
        (this.offset.y = i),
        this.dispatch('updateScrollOffset');
    }
    _createMainStructure() {
      (this.template = e('pswp')),
        this.template.setAttribute('tabindex', -1),
        this.template.setAttribute('role', 'dialog'),
        (this.bg = e('pswp__bg', !1, this.template)),
        (this.scrollWrap = e('pswp__scroll-wrap', !1, this.template)),
        (this.container = e('pswp__container', !1, this.scrollWrap)),
        this.mainScroll.appendHolders(),
        (this.ui = new q(this)),
        this.ui.init(),
        (this.options.appendToEl || document.body).appendChild(this.template);
    }
    getThumbBounds() {
      return (function (t, i, e) {
        const s = e.dispatch('thumbBounds', {
          index: t,
          itemData: i,
          instance: e,
        });
        if (s.thumbBounds) return s.thumbBounds;
        const { element: o } = i;
        if (!o || !1 === e.options.thumbSelector) return;
        const n = e.options.thumbSelector || 'img',
          a = o.matches(n) ? o : o.querySelector(n);
        if (!a) return;
        const r = a.getBoundingClientRect();
        if (!i.thumbCropped) return { x: r.left, y: r.top, w: r.width };
        const h = i.w,
          l = i.h;
        if (!h || !l) return;
        const p = r.width / h,
          c = r.height / l,
          d = p > c ? p : c,
          m = (r.width - h * d) / 2,
          u = (r.height - l * d) / 2,
          _ = { x: r.left + m, y: r.top + u, w: h * d };
        return (_.innerRect = { w: r.width, h: r.height, x: m, y: u }), _;
      })(
        this.currIndex,
        this.currSlide ? this.currSlide.data : this._initialItemData,
        this
      );
    }
    _prepareOptions(t) {
      window.matchMedia('(prefers-reduced-motion), (update: slow)').matches &&
        ((t.showHideAnimationType = 'none'), (t.zoomAnimationDuration = 0)),
        (this.options = { ...X, ...t });
    }
  }
  function J(t, i, e = document) {
    let s = [];
    if (t instanceof Element) s = [t];
    else if (t instanceof NodeList || Array.isArray(t)) s = Array.from(t);
    else {
      const o = 'string' == typeof t ? t : i;
      o && (s = Array.from(e.querySelectorAll(o)));
    }
    return s;
  }
  class Q {
    constructor(t, i, e) {
      (this.options = t), (this.itemData = i), (this.index = e);
    }
    update(t, i, e) {
      (this.elementSize = { x: t, y: i }), (this.panAreaSize = e);
      const s = this.panAreaSize.x / this.elementSize.x,
        o = this.panAreaSize.y / this.elementSize.y;
      (this.fit = Math.min(1, s < o ? s : o)),
        (this.fill = Math.min(1, s > o ? s : o)),
        (this.vFill = Math.min(1, o)),
        (this.initial = this._getInitial()),
        (this.secondary = this._getSecondary()),
        (this.max = Math.max(this.initial, this.secondary, this._getMax())),
        (this.min = Math.min(this.fit, this.initial, this.secondary));
    }
    _parseZoomLevelOption(t) {
      const i = this.options[t + 'ZoomLevel'];
      if (i)
        return 'function' == typeof i
          ? i(this)
          : 'fill' === i
          ? this.fill
          : 'fit' === i
          ? this.fit
          : Number(i);
    }
    _getSecondary() {
      let t = this._parseZoomLevelOption('secondary');
      return (
        t ||
        ((t = Math.min(1, 2.5 * this.fit)),
        t * this.elementSize.x > 3e3 && (t = 3e3 / this.elementSize.x),
        t)
      );
    }
    _getInitial() {
      return this._parseZoomLevelOption('initial') || this.fit;
    }
    _getMax() {
      return this._parseZoomLevelOption('max') || Math.max(1, 4 * this.fit);
    }
  }
  class $ {
    constructor(t, i) {
      (this.type = t), i && Object.assign(this, i);
    }
    preventDefault() {
      this.defaultPrevented = !0;
    }
  }
  window.photoswipe = {
    ...i,
    PhotoSwipeLightbox: class extends class extends class {
      constructor() {
        this._listeners = {};
      }
      on(t, i) {
        this._listeners[t] || (this._listeners[t] = []),
          this._listeners[t].push(i),
          this.pswp && this.pswp.on(t, i);
      }
      off(t, i) {
        this._listeners[t] &&
          (this._listeners[t] = this._listeners[t].filter((t) => i !== t)),
          this.pswp && this.pswp.off(t, i);
      }
      dispatch(t, i) {
        if (this.pswp) return this.pswp.dispatch(t, i);
        const e = new $(t, i);
        return this._listeners
          ? (this._listeners[t] &&
              this._listeners[t].forEach((t) => {
                t.call(this, e);
              }),
            e)
          : e;
      }
    } {
      getNumItems() {
        let t;
        const { dataSource: i } = this.options;
        return (
          i
            ? i.length
              ? (t = i.length)
              : i.gallery &&
                (i.items || (i.items = this._getGalleryDOMElements(i.gallery)),
                i.items && (t = i.items.length))
            : (t = 0),
          this.dispatch('numItems', { dataSource: i, numItems: t }).numItems
        );
      }
      getItemData(t) {
        const { dataSource: i } = this.options;
        let e;
        Array.isArray(i)
          ? (e = i[t])
          : i &&
            i.gallery &&
            (i.items || (i.items = this._getGalleryDOMElements(i.gallery)),
            (e = i.items[t]));
        let s = e;
        return (
          s instanceof Element && (s = this._domElementToItemData(s)),
          this.dispatch('itemData', { itemData: s || {}, index: t }).itemData
        );
      }
      _getGalleryDOMElements(t) {
        return this.options.children || this.options.childSelector
          ? J(this.options.children, this.options.childSelector, t) || []
          : [t];
      }
      _domElementToItemData(t) {
        const i = { element: t },
          e = 'A' === t.tagName ? t : t.querySelector('a');
        if (!e) return i;
        (i.src = e.dataset.pswpSrc || e.href),
          (i.srcset = e.dataset.pswpSrcset),
          (i.w = parseInt(e.dataset.pswpWidth, 10)),
          (i.h = parseInt(e.dataset.pswpHeight, 10));
        const s = t.querySelector('img');
        return (
          s &&
            ((i.msrc = s.currentSrc || s.src), (i.alt = s.getAttribute('alt'))),
          e.dataset.cropped && (i.thumbCropped = !0),
          i
        );
      }
    } {
      constructor(t) {
        super(), (this.options = t || {}), (this._uid = 0);
      }
      init() {
        (this.onThumbnailsClick = this.onThumbnailsClick.bind(this)),
          J(this.options.gallery, this.options.gallerySelector).forEach((t) => {
            t.addEventListener('click', this.onThumbnailsClick, !1);
          });
      }
      onThumbnailsClick(t) {
        if (
          (function (t) {
            if (
              2 === t.which ||
              t.ctrlKey ||
              t.metaKey ||
              t.altKey ||
              t.shiftKey
            )
              return !0;
          })(t) ||
          window.pswp ||
          !1 === window.navigator.onLine
        )
          return;
        let i = { x: t.clientX, y: t.clientY };
        i.x || i.y || (i = null);
        const e = this.getClickedIndex(t),
          s = { gallery: t.currentTarget };
        e >= 0 && (t.preventDefault(), this.loadAndOpen(e, s, i));
      }
      getClickedIndex(t) {
        if (this.options.getClickedIndexFn)
          return this.options.getClickedIndexFn.call(this, t);
        const i = t.target,
          e = J(
            this.options.children,
            this.options.childSelector,
            t.currentTarget
          ).findIndex((t) => t === i || t.contains(i));
        return -1 !== e ? e : 0;
      }
      loadAndOpen(t, i, e) {
        return (
          !window.pswp &&
          ((this.options.index = t),
          (this.options.initialPointerPos = e),
          (this.shouldOpen = !0),
          this.preload(t, i),
          !0)
        );
      }
      preload(t, i) {
        const { options: e } = this;
        i && (e.dataSource = i);
        const s = [((o = e.pswpModule), 'string' == typeof o ? import(o) : o)];
        var o;
        'function' == typeof e.openPromise && s.push(e.openPromise()),
          !1 !== e.preloadFirstSlide &&
            t >= 0 &&
            (function (t, i) {
              const e = i.getItemData(t);
              i.dispatch('lazyLoadSlide', { index: t, itemData: e })
                .defaultPrevented ||
                (function (t, i, e) {
                  if (t.src && t.w && t.h) {
                    const { options: s } = i,
                      o =
                        i.viewportSize ||
                        (function (t, i) {
                          if (t.getViewportSizeFn) {
                            const i = t.getViewportSizeFn(t, void 0);
                            if (i) return i;
                          }
                          return {
                            x: document.documentElement.clientWidth,
                            y: window.innerHeight,
                          };
                        })(s),
                      n = (function (t, i) {
                        return {
                          x: i.x - (t.paddingLeft || 0) - (t.paddingRight || 0),
                          y: i.y - (t.paddingTop || 0) - (t.paddingBottom || 0),
                        };
                      })(s, o),
                      a = new Q(s, t, -1);
                    a.update(t.w, t.h, n);
                    const r = document.createElement('img');
                    (r.decoding = 'async'),
                      (r.sizes = Math.ceil(t.w * a.initial) + 'px'),
                      t.srcset && (r.srcset = t.srcset),
                      (r.src = t.src),
                      e && 'decode' in r && r.decode();
                  }
                })(e, i);
            })(t, this);
        const n = ++this._uid;
        Promise.all(s).then((t) => {
          if (this.shouldOpen) {
            const i = t[0];
            this._openPhotoswipe(i, n);
          }
        });
      }
      _openPhotoswipe(t, i) {
        if (i !== this._uid && this.shouldOpen) return;
        if (((this.shouldOpen = !1), window.pswp)) return;
        const e =
          'object' == typeof t
            ? new t.default(null, this.options)
            : new t(null, this.options);
        (this.pswp = e),
          (window.pswp = e),
          Object.keys(this._listeners).forEach((t) => {
            this._listeners[t].forEach((i) => {
              e.on(t, i);
            });
          }),
          e.on('destroy', () => {
            (this.pswp = null), (window.pswp = null);
          }),
          e.init();
      }
      destroy() {
        this.pswp && this.pswp.close(),
          (this.shouldOpen = !1),
          (this._listeners = null),
          J(this.options.gallery, this.options.gallerySelector).forEach((t) => {
            t.removeEventListener('click', this.onThumbnailsClick, !1);
          });
      }
    },
  };
})();
