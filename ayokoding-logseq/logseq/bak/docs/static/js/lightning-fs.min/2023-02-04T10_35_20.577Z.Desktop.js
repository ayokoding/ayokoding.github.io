!(function (t, e) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define([], e)
    : 'object' == typeof exports
    ? (exports.LightningFS = e())
    : (t.LightningFS = e());
})(self, function () {
  return (function (t) {
    var e = {};
    function r(i) {
      if (e[i]) return e[i].exports;
      var n = (e[i] = { i: i, l: !1, exports: {} });
      return t[i].call(n.exports, n, n.exports, r), (n.l = !0), n.exports;
    }
    return (
      (r.m = t),
      (r.c = e),
      (r.d = function (t, e, i) {
        r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: i });
      }),
      (r.r = function (t) {
        'undefined' != typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
          Object.defineProperty(t, '__esModule', { value: !0 });
      }),
      (r.t = function (t, e) {
        if ((1 & e && (t = r(t)), 8 & e)) return t;
        if (4 & e && 'object' == typeof t && t && t.__esModule) return t;
        var i = Object.create(null);
        if (
          (r.r(i),
          Object.defineProperty(i, 'default', { enumerable: !0, value: t }),
          2 & e && 'string' != typeof t)
        )
          for (var n in t)
            r.d(
              i,
              n,
              function (e) {
                return t[e];
              }.bind(null, n)
            );
        return i;
      }),
      (r.n = function (t) {
        var e =
          t && t.__esModule
            ? function () {
                return t.default;
              }
            : function () {
                return t;
              };
        return r.d(e, 'a', e), e;
      }),
      (r.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (r.p = ''),
      r((r.s = 4))
    );
  })([
    function (t, e) {
      var r;
      r = (function () {
        return this;
      })();
      try {
        r = r || new Function('return this')();
      } catch (t) {
        'object' == typeof window && (r = window);
      }
      t.exports = r;
    },
    function (t, e) {
      function r(t) {
        if (0 === t.length) return '.';
        let e = n(t);
        return (e = e.reduce(o, [])), i(...e);
      }
      function i(...t) {
        if (0 === t.length) return '';
        let e = t.join('/');
        return (e = e.replace(/\/{2,}/g, '/')), e;
      }
      function n(t) {
        if (0 === t.length) return [];
        if ('/' === t) return ['/'];
        let e = t.split('/');
        return (
          '' === e[e.length - 1] && e.pop(),
          '/' === t[0] ? (e[0] = '/') : '.' !== e[0] && e.unshift('.'),
          e
        );
      }
      function o(t, e) {
        if (0 === t.length) return t.push(e), t;
        if ('.' === e) return t;
        if ('..' === e) {
          if (1 === t.length) {
            if ('/' === t[0])
              throw new Error(
                'Unable to normalize path - traverses above root directory'
              );
            if ('.' === t[0]) return t.push(e), t;
          }
          return '..' === t[t.length - 1] ? (t.push('..'), t) : (t.pop(), t);
        }
        return t.push(e), t;
      }
      t.exports = {
        join: i,
        normalize: r,
        split: n,
        basename: function (t) {
          if ('/' === t) throw new Error(`Cannot get basename of "${t}"`);
          const e = t.lastIndexOf('/');
          return -1 === e ? t : t.slice(e + 1);
        },
        dirname: function (t) {
          const e = t.lastIndexOf('/');
          if (-1 === e) throw new Error(`Cannot get dirname of "${t}"`);
          return 0 === e ? '/' : t.slice(0, e);
        },
        resolve: function (...t) {
          let e = '';
          for (let n of t) e = n.startsWith('/') ? n : r(i(e, n));
          return e;
        },
      };
    },
    function (t, e) {
      function r(t) {
        return class extends Error {
          constructor(...e) {
            super(...e),
              (this.code = t),
              this.message
                ? (this.message = t + ': ' + this.message)
                : (this.message = t);
          }
        };
      }
      const i = r('EEXIST'),
        n = r('ENOENT'),
        o = r('ENOTDIR'),
        s = r('ENOTEMPTY'),
        a = r('ETIMEDOUT');
      t.exports = {
        EEXIST: i,
        ENOENT: n,
        ENOTDIR: o,
        ENOTEMPTY: s,
        ETIMEDOUT: a,
      };
    },
    function (t, e, r) {
      'use strict';
      r.r(e),
        r.d(e, 'Store', function () {
          return i;
        }),
        r.d(e, 'get', function () {
          return a;
        }),
        r.d(e, 'set', function () {
          return u;
        }),
        r.d(e, 'update', function () {
          return c;
        }),
        r.d(e, 'del', function () {
          return f;
        }),
        r.d(e, 'clear', function () {
          return l;
        }),
        r.d(e, 'keys', function () {
          return p;
        }),
        r.d(e, 'close', function () {
          return d;
        });
      class i {
        constructor(t = 'keyval-store', e = 'keyval') {
          (this.storeName = e),
            (this._dbName = t),
            (this._storeName = e),
            (this.id = `dbName:${t};;storeName:${e}`),
            this._init();
        }
        _init() {
          this._dbp ||
            (this._dbp = new Promise((t, e) => {
              const r = indexedDB.open(this._dbName);
              (r.onerror = () => e(r.error)),
                (r.onsuccess = () => t(r.result)),
                (r.onupgradeneeded = () => {
                  r.result.createObjectStore(this._storeName);
                });
            }));
        }
        _withIDBStore(t, e) {
          return (
            this._init(),
            this._dbp.then(
              (r) =>
                new Promise((i, n) => {
                  const o = r.transaction(this.storeName, t);
                  (o.oncomplete = () => i()),
                    (o.onabort = o.onerror = () => n(o.error)),
                    e(o.objectStore(this.storeName));
                })
            )
          );
        }
        _close() {
          return (
            this._init(),
            this._dbp.then((t) => {
              t.close(), (this._dbp = void 0);
            })
          );
        }
      }
      class n {
        constructor(t) {
          (this.executor = t), (this.items = []);
        }
        async process() {
          const t = this.items;
          (this.items = []),
            await this.executor(t.map(({ item: t }) => t)),
            t.map(({ onProcessed: t }) => t()),
            this.items.length
              ? (this.ongoing = this.process())
              : (this.ongoing = void 0);
        }
        async queue(t) {
          const e = new Promise((e) =>
            this.items.push({ item: t, onProcessed: e })
          );
          return this.ongoing || (this.ongoing = this.process()), e;
        }
      }
      let o;
      function s() {
        return o || (o = new i()), o;
      }
      function a(t, e = s()) {
        let r;
        return e
          ._withIDBStore('readwrite', (e) => {
            r = e.get(t);
          })
          .then(() => r.result);
      }
      const h = {};
      function u(t, e, r = s()) {
        return (
          h[r.id] ||
            (h[r.id] = new n((t) =>
              r._withIDBStore('readwrite', (e) => {
                for (const r of t) e.put(r.value, r.key);
              })
            )),
          h[r.id].queue({ key: t, value: e })
        );
      }
      function c(t, e, r = s()) {
        return r._withIDBStore('readwrite', (r) => {
          const i = r.get(t);
          i.onsuccess = () => {
            r.put(e(i.result), t);
          };
        });
      }
      function f(t, e = s()) {
        return e._withIDBStore('readwrite', (e) => {
          e.delete(t);
        });
      }
      function l(t = s()) {
        return t._withIDBStore('readwrite', (t) => {
          t.clear();
        });
      }
      function p(t = s()) {
        const e = [];
        return t
          ._withIDBStore('readwrite', (t) => {
            (t.openKeyCursor || t.openCursor).call(t).onsuccess = function () {
              this.result && (e.push(this.result.key), this.result.continue());
            };
          })
          .then(() => e);
      }
      function d(t = s()) {
        return t._close();
      }
    },
    function (t, e, r) {
      const i = r(5),
        n = r(6);
      function o(t, e) {
        'function' == typeof t && (e = t);
        return [(...t) => e(null, ...t), (e = i(e))];
      }
      t.exports = class {
        constructor(...t) {
          (this.promises = new n(...t)),
            (this.init = this.init.bind(this)),
            (this.readFile = this.readFile.bind(this)),
            (this.writeFile = this.writeFile.bind(this)),
            (this.unlink = this.unlink.bind(this)),
            (this.readdir = this.readdir.bind(this)),
            (this.mkdir = this.mkdir.bind(this)),
            (this.rmdir = this.rmdir.bind(this)),
            (this.rename = this.rename.bind(this)),
            (this.stat = this.stat.bind(this)),
            (this.lstat = this.lstat.bind(this)),
            (this.readlink = this.readlink.bind(this)),
            (this.symlink = this.symlink.bind(this)),
            (this.backFile = this.backFile.bind(this)),
            (this.du = this.du.bind(this));
        }
        init(t, e) {
          this.promises.init(t, e);
        }
        readFile(t, e, r) {
          const [i, n] = o(e, r);
          this.promises.readFile(t, e).then(i).catch(n);
        }
        writeFile(t, e, r, i) {
          const [n, s] = o(r, i);
          this.promises.writeFile(t, e, r).then(n).catch(s);
        }
        unlink(t, e, r) {
          const [i, n] = o(e, r);
          this.promises.unlink(t, e).then(i).catch(n);
        }
        readdir(t, e, r) {
          const [i, n] = o(e, r);
          this.promises.readdir(t, e).then(i).catch(n);
        }
        mkdir(t, e, r) {
          const [i, n] = o(e, r);
          this.promises.mkdir(t, e).then(i).catch(n);
        }
        rmdir(t, e, r) {
          const [i, n] = o(e, r);
          this.promises.rmdir(t, e).then(i).catch(n);
        }
        rename(t, e, r) {
          const [i, n] = o(r);
          this.promises.rename(t, e).then(i).catch(n);
        }
        stat(t, e, r) {
          const [i, n] = o(e, r);
          this.promises.stat(t).then(i).catch(n);
        }
        lstat(t, e, r) {
          const [i, n] = o(e, r);
          this.promises.lstat(t).then(i).catch(n);
        }
        readlink(t, e, r) {
          const [i, n] = o(e, r);
          this.promises.readlink(t).then(i).catch(n);
        }
        symlink(t, e, r) {
          const [i, n] = o(r);
          this.promises.symlink(t, e).then(i).catch(n);
        }
        backFile(t, e, r) {
          const [i, n] = o(e, r);
          this.promises.backFile(t, e).then(i).catch(n);
        }
        du(t, e) {
          const [r, i] = o(e);
          this.promises.du(t).then(r).catch(i);
        }
      };
    },
    function (t, e) {
      t.exports = function (t) {
        var e, r;
        if ('function' != typeof t)
          throw new Error('expected a function but got ' + t);
        return function () {
          return e ? r : ((e = !0), (r = t.apply(this, arguments)));
        };
      };
    },
    function (t, e, r) {
      const { encode: i, decode: n } = r(7),
        o = r(13),
        s = r(14),
        a = r(15),
        { ENOENT: h, ENOTEMPTY: u, ETIMEDOUT: c } = r(2),
        f = r(16),
        l = r(17),
        p = r(18),
        d = r(19),
        w = r(1);
      r(20);
      function _(t, e) {
        return (
          (void 0 !== e && 'function' != typeof e) || (e = {}),
          'string' == typeof e && (e = { encoding: e }),
          [(t = w.normalize(t)), e]
        );
      }
      function y(t, e) {
        return [w.normalize(t), w.normalize(e)];
      }
      t.exports = class {
        constructor(t, e) {
          (this.init = this.init.bind(this)),
            (this.readFile = this._wrap(this.readFile, !1)),
            (this.writeFile = this._wrap(this.writeFile, !0)),
            (this.unlink = this._wrap(this.unlink, !0)),
            (this.readdir = this._wrap(this.readdir, !1)),
            (this.mkdir = this._wrap(this.mkdir, !0)),
            (this.rmdir = this._wrap(this.rmdir, !0)),
            (this.rename = this._wrap(this.rename, !0)),
            (this.stat = this._wrap(this.stat, !1)),
            (this.lstat = this._wrap(this.lstat, !1)),
            (this.readlink = this._wrap(this.readlink, !1)),
            (this.symlink = this._wrap(this.symlink, !0)),
            (this.backFile = this._wrap(this.backFile, !0)),
            (this.du = this._wrap(this.du, !1)),
            (this.saveSuperblock = o(() => {
              this._saveSuperblock();
            }, 500)),
            (this._deactivationPromise = null),
            (this._deactivationTimeout = null),
            (this._activationPromise = null),
            (this._operations = new Set()),
            t && this.init(t, e);
        }
        async init(...t) {
          return (
            this._initPromiseResolve && (await this._initPromise),
            (this._initPromise = this._init(...t)),
            this._initPromise
          );
        }
        async _init(
          t,
          {
            wipe: e,
            url: r,
            urlauto: i,
            fileDbName: n = t,
            fileStoreName: o = t + '_files',
            lockDbName: s = t + '_lock',
            lockStoreName: h = t + '_lock',
            defer: u = !1,
          } = {}
        ) {
          await this._gracefulShutdown(),
            (this._name = t),
            (this._idb = new f(n, o)),
            (this._mutex = navigator.locks ? new d(t) : new p(s, h)),
            (this._cache = new a(t)),
            (this._opts = { wipe: e, url: r }),
            (this._needsWipe = !!e),
            r && ((this._http = new l(r)), (this._urlauto = !!i)),
            this._initPromiseResolve &&
              (this._initPromiseResolve(), (this._initPromiseResolve = null)),
            u || this.stat('/');
        }
        async _gracefulShutdown() {
          this._operations.size > 0 &&
            ((this._isShuttingDown = !0),
            await new Promise((t) => (this._gracefulShutdownResolve = t)),
            (this._isShuttingDown = !1),
            (this._gracefulShutdownResolve = null));
        }
        _wrap(t, e) {
          return async (...r) => {
            let i = { name: t.name, args: r };
            this._operations.add(i);
            try {
              return await this._activate(), await t.apply(this, r);
            } finally {
              this._operations.delete(i),
                e && this.saveSuperblock(),
                0 === this._operations.size &&
                  (this._deactivationTimeout ||
                    clearTimeout(this._deactivationTimeout),
                  (this._deactivationTimeout = setTimeout(
                    this._deactivate.bind(this),
                    500
                  )));
            }
          };
        }
        async _activate() {
          if (
            (this._initPromise ||
              console.warn(
                new Error(
                  `Attempted to use LightningFS ${this._name} before it was initialized.`
                )
              ),
            await this._initPromise,
            this._deactivationTimeout &&
              (clearTimeout(this._deactivationTimeout),
              (this._deactivationTimeout = null)),
            this._deactivationPromise && (await this._deactivationPromise),
            (this._deactivationPromise = null),
            this._activationPromise ||
              (this._activationPromise = this.__activate()),
            await this._activationPromise,
            !(await this._mutex.has()))
          )
            throw new c();
        }
        async __activate() {
          if (this._cache.activated) return;
          this._needsWipe &&
            ((this._needsWipe = !1),
            await this._idb.wipe(),
            await this._mutex.release({ force: !0 })),
            (await this._mutex.has()) || (await this._mutex.wait());
          const t = await this._idb.loadSuperblock();
          if (t) this._cache.activate(t);
          else if (this._http) {
            const t = await this._http.loadSuperblock();
            this._cache.activate(t), await this._saveSuperblock();
          } else this._cache.activate();
        }
        async _deactivate() {
          return (
            this._activationPromise && (await this._activationPromise),
            this._deactivationPromise ||
              (this._deactivationPromise = this.__deactivate()),
            (this._activationPromise = null),
            this._gracefulShutdownResolve && this._gracefulShutdownResolve(),
            this._deactivationPromise
          );
        }
        async __deactivate() {
          (await this._mutex.has()) && (await this._saveSuperblock()),
            this._cache.deactivate();
          try {
            await this._mutex.release();
          } catch (t) {
            console.log(t);
          }
          await this._idb.close();
        }
        async _saveSuperblock() {
          this._cache.activated &&
            ((this._lastSavedAt = Date.now()),
            await this._idb.saveSuperblock(this._cache._root));
        }
        async _writeStat(t, e, r) {
          let i = w.split(w.dirname(t)),
            n = i.shift();
          for (let t of i) {
            n = w.join(n, t);
            try {
              this._cache.mkdir(n, { mode: 511 });
            } catch (t) {}
          }
          return this._cache.writeStat(t, e, r);
        }
        async readFile(t, e) {
          [t, e] = _(t, e);
          const { encoding: r } = e;
          if (r && 'utf8' !== r)
            throw new Error('Only "utf8" encoding is supported in readFile');
          let i = null,
            o = null;
          try {
            (o = this._cache.stat(t)), (i = await this._idb.readFile(o.ino));
          } catch (t) {
            if (!this._urlauto) throw t;
          }
          if (!i && this._http) {
            let e = this._cache.lstat(t);
            for (; 'symlink' === e.type; )
              (t = w.resolve(w.dirname(t), e.target)),
                (e = this._cache.lstat(t));
            i = await this._http.readFile(t);
          }
          if (
            (i &&
              ((o && o.size == i.byteLength) ||
                ((o = await this._writeStat(t, i.byteLength, {
                  mode: o ? o.mode : 438,
                })),
                this.saveSuperblock()),
              'utf8' === r && (i = n(i))),
            !o)
          )
            throw new h(t);
          return i;
        }
        async writeFile(t, e, r) {
          [t, r] = _(t, r);
          const { mode: n, encoding: o = 'utf8' } = r;
          if ('string' == typeof e) {
            if ('utf8' !== o)
              throw new Error('Only "utf8" encoding is supported in writeFile');
            e = i(e);
          }
          const s = await this._cache.writeStat(t, e.byteLength, { mode: n });
          return await this._idb.writeFile(s.ino, e), null;
        }
        async unlink(t, e) {
          [t, e] = _(t, e);
          const r = this._cache.lstat(t);
          return (
            this._cache.unlink(t),
            'symlink' !== r.type && (await this._idb.unlink(r.ino)),
            null
          );
        }
        async readdir(t, e) {
          return ([t, e] = _(t, e)), this._cache.readdir(t);
        }
        async mkdir(t, e) {
          [t, e] = _(t, e);
          const { mode: r = 511 } = e;
          return await this._cache.mkdir(t, { mode: r }), null;
        }
        async rmdir(t, e) {
          if ((([t, e] = _(t, e)), '/' === t)) throw new u();
          return this._cache.rmdir(t), null;
        }
        async rename(t, e) {
          return ([t, e] = y(t, e)), this._cache.rename(t, e), null;
        }
        async stat(t, e) {
          [t, e] = _(t, e);
          const r = this._cache.stat(t);
          return new s(r);
        }
        async lstat(t, e) {
          [t, e] = _(t, e);
          let r = this._cache.lstat(t);
          return new s(r);
        }
        async readlink(t, e) {
          return ([t, e] = _(t, e)), this._cache.readlink(t);
        }
        async symlink(t, e) {
          return ([t, e] = y(t, e)), this._cache.symlink(t, e), null;
        }
        async backFile(t, e) {
          [t, e] = _(t, e);
          let r = await this._http.sizeFile(t);
          return await this._writeStat(t, r, e), null;
        }
        async du(t) {
          return this._cache.du(t);
        }
      };
    },
    function (t, e, r) {
      r(8),
        (t.exports = {
          encode: (t) => new TextEncoder().encode(t),
          decode: (t) => new TextDecoder().decode(t),
        });
    },
    function (t, e, r) {
      (function (t, e) {
        !(function (t) {
          function r() {}
          function i(t, e) {
            if (
              ((t = void 0 === t ? 'utf-8' : t),
              (e = void 0 === e ? { fatal: !1 } : e),
              -1 === o.indexOf(t.toLowerCase()))
            )
              throw new RangeError(
                "Failed to construct 'TextDecoder': The encoding label provided ('" +
                  t +
                  "') is invalid."
              );
            if (e.fatal)
              throw Error(
                "Failed to construct 'TextDecoder': the 'fatal' option is unsupported."
              );
          }
          function n(t) {
            for (
              var e = 0,
                r = Math.min(65536, t.length + 1),
                i = new Uint16Array(r),
                n = [],
                o = 0;
              ;

            ) {
              var s = e < t.length;
              if (!s || o >= r - 1) {
                if (
                  (n.push(String.fromCharCode.apply(null, i.subarray(0, o))),
                  !s)
                )
                  return n.join('');
                (t = t.subarray(e)), (o = e = 0);
              }
              if (0 == (128 & (s = t[e++]))) i[o++] = s;
              else if (192 == (224 & s)) {
                var a = 63 & t[e++];
                i[o++] = ((31 & s) << 6) | a;
              } else if (224 == (240 & s)) {
                a = 63 & t[e++];
                var h = 63 & t[e++];
                i[o++] = ((31 & s) << 12) | (a << 6) | h;
              } else if (240 == (248 & s)) {
                65535 <
                  (s =
                    ((7 & s) << 18) |
                    ((a = 63 & t[e++]) << 12) |
                    ((h = 63 & t[e++]) << 6) |
                    (63 & t[e++])) &&
                  ((s -= 65536),
                  (i[o++] = ((s >>> 10) & 1023) | 55296),
                  (s = 56320 | (1023 & s))),
                  (i[o++] = s);
              }
            }
          }
          if (t.TextEncoder && t.TextDecoder) return !1;
          var o = ['utf-8', 'utf8', 'unicode-1-1-utf-8'];
          Object.defineProperty(r.prototype, 'encoding', { value: 'utf-8' }),
            (r.prototype.encode = function (t, e) {
              if ((e = void 0 === e ? { stream: !1 } : e).stream)
                throw Error(
                  "Failed to encode: the 'stream' option is unsupported."
                );
              e = 0;
              for (
                var r = t.length,
                  i = 0,
                  n = Math.max(32, r + (r >>> 1) + 7),
                  o = new Uint8Array((n >>> 3) << 3);
                e < r;

              ) {
                var s = t.charCodeAt(e++);
                if (55296 <= s && 56319 >= s) {
                  if (e < r) {
                    var a = t.charCodeAt(e);
                    56320 == (64512 & a) &&
                      (++e, (s = ((1023 & s) << 10) + (1023 & a) + 65536));
                  }
                  if (55296 <= s && 56319 >= s) continue;
                }
                if (
                  (i + 4 > o.length &&
                    ((n += 8),
                    (n = ((n *= 1 + (e / t.length) * 2) >>> 3) << 3),
                    (a = new Uint8Array(n)).set(o),
                    (o = a)),
                  0 == (4294967168 & s))
                )
                  o[i++] = s;
                else {
                  if (0 == (4294965248 & s)) o[i++] = ((s >>> 6) & 31) | 192;
                  else if (0 == (4294901760 & s))
                    (o[i++] = ((s >>> 12) & 15) | 224),
                      (o[i++] = ((s >>> 6) & 63) | 128);
                  else {
                    if (0 != (4292870144 & s)) continue;
                    (o[i++] = ((s >>> 18) & 7) | 240),
                      (o[i++] = ((s >>> 12) & 63) | 128),
                      (o[i++] = ((s >>> 6) & 63) | 128);
                  }
                  o[i++] = (63 & s) | 128;
                }
              }
              return o.slice ? o.slice(0, i) : o.subarray(0, i);
            }),
            Object.defineProperty(i.prototype, 'encoding', { value: 'utf-8' }),
            Object.defineProperty(i.prototype, 'fatal', { value: !1 }),
            Object.defineProperty(i.prototype, 'ignoreBOM', { value: !1 });
          var s = n;
          'function' == typeof e && e.from
            ? (s = function (t) {
                return e
                  .from(t.buffer, t.byteOffset, t.byteLength)
                  .toString('utf-8');
              })
            : 'function' == typeof Blob &&
              'function' == typeof URL &&
              'function' == typeof URL.createObjectURL &&
              (s = function (t) {
                var e = URL.createObjectURL(
                  new Blob([t], { type: 'text/plain;charset=UTF-8' })
                );
                try {
                  var r = new XMLHttpRequest();
                  return r.open('GET', e, !1), r.send(), r.responseText;
                } catch (e) {
                  return n(t);
                } finally {
                  URL.revokeObjectURL(e);
                }
              }),
            (i.prototype.decode = function (t, e) {
              if ((e = void 0 === e ? { stream: !1 } : e).stream)
                throw Error(
                  "Failed to decode: the 'stream' option is unsupported."
                );
              return (
                (t =
                  t instanceof Uint8Array
                    ? t
                    : t.buffer instanceof ArrayBuffer
                    ? new Uint8Array(t.buffer)
                    : new Uint8Array(t)),
                s(t)
              );
            }),
            (t.TextEncoder = r),
            (t.TextDecoder = i);
        })('undefined' != typeof window ? window : void 0 !== t ? t : this);
      }).call(this, r(0), r(9).Buffer);
    },
    function (t, e, r) {
      'use strict';
      (function (t) {
        /*!
         * The buffer module from node.js, for the browser.
         *
         * @author   Feross Aboukhadijeh <http://feross.org>
         * @license  MIT
         */
        var i = r(10),
          n = r(11),
          o = r(12);
        function s() {
          return h.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
        }
        function a(t, e) {
          if (s() < e) throw new RangeError('Invalid typed array length');
          return (
            h.TYPED_ARRAY_SUPPORT
              ? ((t = new Uint8Array(e)).__proto__ = h.prototype)
              : (null === t && (t = new h(e)), (t.length = e)),
            t
          );
        }
        function h(t, e, r) {
          if (!(h.TYPED_ARRAY_SUPPORT || this instanceof h))
            return new h(t, e, r);
          if ('number' == typeof t) {
            if ('string' == typeof e)
              throw new Error(
                'If encoding is specified then the first argument must be a string'
              );
            return f(this, t);
          }
          return u(this, t, e, r);
        }
        function u(t, e, r, i) {
          if ('number' == typeof e)
            throw new TypeError('"value" argument must not be a number');
          return 'undefined' != typeof ArrayBuffer && e instanceof ArrayBuffer
            ? (function (t, e, r, i) {
                if ((e.byteLength, r < 0 || e.byteLength < r))
                  throw new RangeError("'offset' is out of bounds");
                if (e.byteLength < r + (i || 0))
                  throw new RangeError("'length' is out of bounds");
                e =
                  void 0 === r && void 0 === i
                    ? new Uint8Array(e)
                    : void 0 === i
                    ? new Uint8Array(e, r)
                    : new Uint8Array(e, r, i);
                h.TYPED_ARRAY_SUPPORT
                  ? ((t = e).__proto__ = h.prototype)
                  : (t = l(t, e));
                return t;
              })(t, e, r, i)
            : 'string' == typeof e
            ? (function (t, e, r) {
                ('string' == typeof r && '' !== r) || (r = 'utf8');
                if (!h.isEncoding(r))
                  throw new TypeError(
                    '"encoding" must be a valid string encoding'
                  );
                var i = 0 | d(e, r),
                  n = (t = a(t, i)).write(e, r);
                n !== i && (t = t.slice(0, n));
                return t;
              })(t, e, r)
            : (function (t, e) {
                if (h.isBuffer(e)) {
                  var r = 0 | p(e.length);
                  return 0 === (t = a(t, r)).length || e.copy(t, 0, 0, r), t;
                }
                if (e) {
                  if (
                    ('undefined' != typeof ArrayBuffer &&
                      e.buffer instanceof ArrayBuffer) ||
                    'length' in e
                  )
                    return 'number' != typeof e.length || (i = e.length) != i
                      ? a(t, 0)
                      : l(t, e);
                  if ('Buffer' === e.type && o(e.data)) return l(t, e.data);
                }
                var i;
                throw new TypeError(
                  'First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.'
                );
              })(t, e);
        }
        function c(t) {
          if ('number' != typeof t)
            throw new TypeError('"size" argument must be a number');
          if (t < 0)
            throw new RangeError('"size" argument must not be negative');
        }
        function f(t, e) {
          if ((c(e), (t = a(t, e < 0 ? 0 : 0 | p(e))), !h.TYPED_ARRAY_SUPPORT))
            for (var r = 0; r < e; ++r) t[r] = 0;
          return t;
        }
        function l(t, e) {
          var r = e.length < 0 ? 0 : 0 | p(e.length);
          t = a(t, r);
          for (var i = 0; i < r; i += 1) t[i] = 255 & e[i];
          return t;
        }
        function p(t) {
          if (t >= s())
            throw new RangeError(
              'Attempt to allocate Buffer larger than maximum size: 0x' +
                s().toString(16) +
                ' bytes'
            );
          return 0 | t;
        }
        function d(t, e) {
          if (h.isBuffer(t)) return t.length;
          if (
            'undefined' != typeof ArrayBuffer &&
            'function' == typeof ArrayBuffer.isView &&
            (ArrayBuffer.isView(t) || t instanceof ArrayBuffer)
          )
            return t.byteLength;
          'string' != typeof t && (t = '' + t);
          var r = t.length;
          if (0 === r) return 0;
          for (var i = !1; ; )
            switch (e) {
              case 'ascii':
              case 'latin1':
              case 'binary':
                return r;
              case 'utf8':
              case 'utf-8':
              case void 0:
                return C(t).length;
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return 2 * r;
              case 'hex':
                return r >>> 1;
              case 'base64':
                return j(t).length;
              default:
                if (i) return C(t).length;
                (e = ('' + e).toLowerCase()), (i = !0);
            }
        }
        function w(t, e, r) {
          var i = !1;
          if (((void 0 === e || e < 0) && (e = 0), e > this.length)) return '';
          if (((void 0 === r || r > this.length) && (r = this.length), r <= 0))
            return '';
          if ((r >>>= 0) <= (e >>>= 0)) return '';
          for (t || (t = 'utf8'); ; )
            switch (t) {
              case 'hex':
                return x(this, e, r);
              case 'utf8':
              case 'utf-8':
                return P(this, e, r);
              case 'ascii':
                return R(this, e, r);
              case 'latin1':
              case 'binary':
                return S(this, e, r);
              case 'base64':
                return A(this, e, r);
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return B(this, e, r);
              default:
                if (i) throw new TypeError('Unknown encoding: ' + t);
                (t = (t + '').toLowerCase()), (i = !0);
            }
        }
        function _(t, e, r) {
          var i = t[e];
          (t[e] = t[r]), (t[r] = i);
        }
        function y(t, e, r, i, n) {
          if (0 === t.length) return -1;
          if (
            ('string' == typeof r
              ? ((i = r), (r = 0))
              : r > 2147483647
              ? (r = 2147483647)
              : r < -2147483648 && (r = -2147483648),
            (r = +r),
            isNaN(r) && (r = n ? 0 : t.length - 1),
            r < 0 && (r = t.length + r),
            r >= t.length)
          ) {
            if (n) return -1;
            r = t.length - 1;
          } else if (r < 0) {
            if (!n) return -1;
            r = 0;
          }
          if (('string' == typeof e && (e = h.from(e, i)), h.isBuffer(e)))
            return 0 === e.length ? -1 : m(t, e, r, i, n);
          if ('number' == typeof e)
            return (
              (e &= 255),
              h.TYPED_ARRAY_SUPPORT &&
              'function' == typeof Uint8Array.prototype.indexOf
                ? n
                  ? Uint8Array.prototype.indexOf.call(t, e, r)
                  : Uint8Array.prototype.lastIndexOf.call(t, e, r)
                : m(t, [e], r, i, n)
            );
          throw new TypeError('val must be string, number or Buffer');
        }
        function m(t, e, r, i, n) {
          var o,
            s = 1,
            a = t.length,
            h = e.length;
          if (
            void 0 !== i &&
            ('ucs2' === (i = String(i).toLowerCase()) ||
              'ucs-2' === i ||
              'utf16le' === i ||
              'utf-16le' === i)
          ) {
            if (t.length < 2 || e.length < 2) return -1;
            (s = 2), (a /= 2), (h /= 2), (r /= 2);
          }
          function u(t, e) {
            return 1 === s ? t[e] : t.readUInt16BE(e * s);
          }
          if (n) {
            var c = -1;
            for (o = r; o < a; o++)
              if (u(t, o) === u(e, -1 === c ? 0 : o - c)) {
                if ((-1 === c && (c = o), o - c + 1 === h)) return c * s;
              } else -1 !== c && (o -= o - c), (c = -1);
          } else
            for (r + h > a && (r = a - h), o = r; o >= 0; o--) {
              for (var f = !0, l = 0; l < h; l++)
                if (u(t, o + l) !== u(e, l)) {
                  f = !1;
                  break;
                }
              if (f) return o;
            }
          return -1;
        }
        function g(t, e, r, i) {
          r = Number(r) || 0;
          var n = t.length - r;
          i ? (i = Number(i)) > n && (i = n) : (i = n);
          var o = e.length;
          if (o % 2 != 0) throw new TypeError('Invalid hex string');
          i > o / 2 && (i = o / 2);
          for (var s = 0; s < i; ++s) {
            var a = parseInt(e.substr(2 * s, 2), 16);
            if (isNaN(a)) return s;
            t[r + s] = a;
          }
          return s;
        }
        function v(t, e, r, i) {
          return z(C(e, t.length - r), t, r, i);
        }
        function b(t, e, r, i) {
          return z(
            (function (t) {
              for (var e = [], r = 0; r < t.length; ++r)
                e.push(255 & t.charCodeAt(r));
              return e;
            })(e),
            t,
            r,
            i
          );
        }
        function E(t, e, r, i) {
          return b(t, e, r, i);
        }
        function k(t, e, r, i) {
          return z(j(e), t, r, i);
        }
        function T(t, e, r, i) {
          return z(
            (function (t, e) {
              for (
                var r, i, n, o = [], s = 0;
                s < t.length && !((e -= 2) < 0);
                ++s
              )
                (r = t.charCodeAt(s)),
                  (i = r >> 8),
                  (n = r % 256),
                  o.push(n),
                  o.push(i);
              return o;
            })(e, t.length - r),
            t,
            r,
            i
          );
        }
        function A(t, e, r) {
          return 0 === e && r === t.length
            ? i.fromByteArray(t)
            : i.fromByteArray(t.slice(e, r));
        }
        function P(t, e, r) {
          r = Math.min(t.length, r);
          for (var i = [], n = e; n < r; ) {
            var o,
              s,
              a,
              h,
              u = t[n],
              c = null,
              f = u > 239 ? 4 : u > 223 ? 3 : u > 191 ? 2 : 1;
            if (n + f <= r)
              switch (f) {
                case 1:
                  u < 128 && (c = u);
                  break;
                case 2:
                  128 == (192 & (o = t[n + 1])) &&
                    (h = ((31 & u) << 6) | (63 & o)) > 127 &&
                    (c = h);
                  break;
                case 3:
                  (o = t[n + 1]),
                    (s = t[n + 2]),
                    128 == (192 & o) &&
                      128 == (192 & s) &&
                      (h = ((15 & u) << 12) | ((63 & o) << 6) | (63 & s)) >
                        2047 &&
                      (h < 55296 || h > 57343) &&
                      (c = h);
                  break;
                case 4:
                  (o = t[n + 1]),
                    (s = t[n + 2]),
                    (a = t[n + 3]),
                    128 == (192 & o) &&
                      128 == (192 & s) &&
                      128 == (192 & a) &&
                      (h =
                        ((15 & u) << 18) |
                        ((63 & o) << 12) |
                        ((63 & s) << 6) |
                        (63 & a)) > 65535 &&
                      h < 1114112 &&
                      (c = h);
              }
            null === c
              ? ((c = 65533), (f = 1))
              : c > 65535 &&
                ((c -= 65536),
                i.push(((c >>> 10) & 1023) | 55296),
                (c = 56320 | (1023 & c))),
              i.push(c),
              (n += f);
          }
          return (function (t) {
            var e = t.length;
            if (e <= 4096) return String.fromCharCode.apply(String, t);
            var r = '',
              i = 0;
            for (; i < e; )
              r += String.fromCharCode.apply(String, t.slice(i, (i += 4096)));
            return r;
          })(i);
        }
        (e.Buffer = h),
          (e.SlowBuffer = function (t) {
            +t != t && (t = 0);
            return h.alloc(+t);
          }),
          (e.INSPECT_MAX_BYTES = 50),
          (h.TYPED_ARRAY_SUPPORT =
            void 0 !== t.TYPED_ARRAY_SUPPORT
              ? t.TYPED_ARRAY_SUPPORT
              : (function () {
                  try {
                    var t = new Uint8Array(1);
                    return (
                      (t.__proto__ = {
                        __proto__: Uint8Array.prototype,
                        foo: function () {
                          return 42;
                        },
                      }),
                      42 === t.foo() &&
                        'function' == typeof t.subarray &&
                        0 === t.subarray(1, 1).byteLength
                    );
                  } catch (t) {
                    return !1;
                  }
                })()),
          (e.kMaxLength = s()),
          (h.poolSize = 8192),
          (h._augment = function (t) {
            return (t.__proto__ = h.prototype), t;
          }),
          (h.from = function (t, e, r) {
            return u(null, t, e, r);
          }),
          h.TYPED_ARRAY_SUPPORT &&
            ((h.prototype.__proto__ = Uint8Array.prototype),
            (h.__proto__ = Uint8Array),
            'undefined' != typeof Symbol &&
              Symbol.species &&
              h[Symbol.species] === h &&
              Object.defineProperty(h, Symbol.species, {
                value: null,
                configurable: !0,
              })),
          (h.alloc = function (t, e, r) {
            return (function (t, e, r, i) {
              return (
                c(e),
                e <= 0
                  ? a(t, e)
                  : void 0 !== r
                  ? 'string' == typeof i
                    ? a(t, e).fill(r, i)
                    : a(t, e).fill(r)
                  : a(t, e)
              );
            })(null, t, e, r);
          }),
          (h.allocUnsafe = function (t) {
            return f(null, t);
          }),
          (h.allocUnsafeSlow = function (t) {
            return f(null, t);
          }),
          (h.isBuffer = function (t) {
            return !(null == t || !t._isBuffer);
          }),
          (h.compare = function (t, e) {
            if (!h.isBuffer(t) || !h.isBuffer(e))
              throw new TypeError('Arguments must be Buffers');
            if (t === e) return 0;
            for (
              var r = t.length, i = e.length, n = 0, o = Math.min(r, i);
              n < o;
              ++n
            )
              if (t[n] !== e[n]) {
                (r = t[n]), (i = e[n]);
                break;
              }
            return r < i ? -1 : i < r ? 1 : 0;
          }),
          (h.isEncoding = function (t) {
            switch (String(t).toLowerCase()) {
              case 'hex':
              case 'utf8':
              case 'utf-8':
              case 'ascii':
              case 'latin1':
              case 'binary':
              case 'base64':
              case 'ucs2':
              case 'ucs-2':
              case 'utf16le':
              case 'utf-16le':
                return !0;
              default:
                return !1;
            }
          }),
          (h.concat = function (t, e) {
            if (!o(t))
              throw new TypeError(
                '"list" argument must be an Array of Buffers'
              );
            if (0 === t.length) return h.alloc(0);
            var r;
            if (void 0 === e)
              for (e = 0, r = 0; r < t.length; ++r) e += t[r].length;
            var i = h.allocUnsafe(e),
              n = 0;
            for (r = 0; r < t.length; ++r) {
              var s = t[r];
              if (!h.isBuffer(s))
                throw new TypeError(
                  '"list" argument must be an Array of Buffers'
                );
              s.copy(i, n), (n += s.length);
            }
            return i;
          }),
          (h.byteLength = d),
          (h.prototype._isBuffer = !0),
          (h.prototype.swap16 = function () {
            var t = this.length;
            if (t % 2 != 0)
              throw new RangeError('Buffer size must be a multiple of 16-bits');
            for (var e = 0; e < t; e += 2) _(this, e, e + 1);
            return this;
          }),
          (h.prototype.swap32 = function () {
            var t = this.length;
            if (t % 4 != 0)
              throw new RangeError('Buffer size must be a multiple of 32-bits');
            for (var e = 0; e < t; e += 4)
              _(this, e, e + 3), _(this, e + 1, e + 2);
            return this;
          }),
          (h.prototype.swap64 = function () {
            var t = this.length;
            if (t % 8 != 0)
              throw new RangeError('Buffer size must be a multiple of 64-bits');
            for (var e = 0; e < t; e += 8)
              _(this, e, e + 7),
                _(this, e + 1, e + 6),
                _(this, e + 2, e + 5),
                _(this, e + 3, e + 4);
            return this;
          }),
          (h.prototype.toString = function () {
            var t = 0 | this.length;
            return 0 === t
              ? ''
              : 0 === arguments.length
              ? P(this, 0, t)
              : w.apply(this, arguments);
          }),
          (h.prototype.equals = function (t) {
            if (!h.isBuffer(t))
              throw new TypeError('Argument must be a Buffer');
            return this === t || 0 === h.compare(this, t);
          }),
          (h.prototype.inspect = function () {
            var t = '',
              r = e.INSPECT_MAX_BYTES;
            return (
              this.length > 0 &&
                ((t = this.toString('hex', 0, r).match(/.{2}/g).join(' ')),
                this.length > r && (t += ' ... ')),
              '<Buffer ' + t + '>'
            );
          }),
          (h.prototype.compare = function (t, e, r, i, n) {
            if (!h.isBuffer(t))
              throw new TypeError('Argument must be a Buffer');
            if (
              (void 0 === e && (e = 0),
              void 0 === r && (r = t ? t.length : 0),
              void 0 === i && (i = 0),
              void 0 === n && (n = this.length),
              e < 0 || r > t.length || i < 0 || n > this.length)
            )
              throw new RangeError('out of range index');
            if (i >= n && e >= r) return 0;
            if (i >= n) return -1;
            if (e >= r) return 1;
            if (this === t) return 0;
            for (
              var o = (n >>>= 0) - (i >>>= 0),
                s = (r >>>= 0) - (e >>>= 0),
                a = Math.min(o, s),
                u = this.slice(i, n),
                c = t.slice(e, r),
                f = 0;
              f < a;
              ++f
            )
              if (u[f] !== c[f]) {
                (o = u[f]), (s = c[f]);
                break;
              }
            return o < s ? -1 : s < o ? 1 : 0;
          }),
          (h.prototype.includes = function (t, e, r) {
            return -1 !== this.indexOf(t, e, r);
          }),
          (h.prototype.indexOf = function (t, e, r) {
            return y(this, t, e, r, !0);
          }),
          (h.prototype.lastIndexOf = function (t, e, r) {
            return y(this, t, e, r, !1);
          }),
          (h.prototype.write = function (t, e, r, i) {
            if (void 0 === e) (i = 'utf8'), (r = this.length), (e = 0);
            else if (void 0 === r && 'string' == typeof e)
              (i = e), (r = this.length), (e = 0);
            else {
              if (!isFinite(e))
                throw new Error(
                  'Buffer.write(string, encoding, offset[, length]) is no longer supported'
                );
              (e |= 0),
                isFinite(r)
                  ? ((r |= 0), void 0 === i && (i = 'utf8'))
                  : ((i = r), (r = void 0));
            }
            var n = this.length - e;
            if (
              ((void 0 === r || r > n) && (r = n),
              (t.length > 0 && (r < 0 || e < 0)) || e > this.length)
            )
              throw new RangeError('Attempt to write outside buffer bounds');
            i || (i = 'utf8');
            for (var o = !1; ; )
              switch (i) {
                case 'hex':
                  return g(this, t, e, r);
                case 'utf8':
                case 'utf-8':
                  return v(this, t, e, r);
                case 'ascii':
                  return b(this, t, e, r);
                case 'latin1':
                case 'binary':
                  return E(this, t, e, r);
                case 'base64':
                  return k(this, t, e, r);
                case 'ucs2':
                case 'ucs-2':
                case 'utf16le':
                case 'utf-16le':
                  return T(this, t, e, r);
                default:
                  if (o) throw new TypeError('Unknown encoding: ' + i);
                  (i = ('' + i).toLowerCase()), (o = !0);
              }
          }),
          (h.prototype.toJSON = function () {
            return {
              type: 'Buffer',
              data: Array.prototype.slice.call(this._arr || this, 0),
            };
          });
        function R(t, e, r) {
          var i = '';
          r = Math.min(t.length, r);
          for (var n = e; n < r; ++n) i += String.fromCharCode(127 & t[n]);
          return i;
        }
        function S(t, e, r) {
          var i = '';
          r = Math.min(t.length, r);
          for (var n = e; n < r; ++n) i += String.fromCharCode(t[n]);
          return i;
        }
        function x(t, e, r) {
          var i = t.length;
          (!e || e < 0) && (e = 0), (!r || r < 0 || r > i) && (r = i);
          for (var n = '', o = e; o < r; ++o) n += N(t[o]);
          return n;
        }
        function B(t, e, r) {
          for (var i = t.slice(e, r), n = '', o = 0; o < i.length; o += 2)
            n += String.fromCharCode(i[o] + 256 * i[o + 1]);
          return n;
        }
        function U(t, e, r) {
          if (t % 1 != 0 || t < 0) throw new RangeError('offset is not uint');
          if (t + e > r)
            throw new RangeError('Trying to access beyond buffer length');
        }
        function M(t, e, r, i, n, o) {
          if (!h.isBuffer(t))
            throw new TypeError('"buffer" argument must be a Buffer instance');
          if (e > n || e < o)
            throw new RangeError('"value" argument is out of bounds');
          if (r + i > t.length) throw new RangeError('Index out of range');
        }
        function O(t, e, r, i) {
          e < 0 && (e = 65535 + e + 1);
          for (var n = 0, o = Math.min(t.length - r, 2); n < o; ++n)
            t[r + n] =
              (e & (255 << (8 * (i ? n : 1 - n)))) >>> (8 * (i ? n : 1 - n));
        }
        function I(t, e, r, i) {
          e < 0 && (e = 4294967295 + e + 1);
          for (var n = 0, o = Math.min(t.length - r, 4); n < o; ++n)
            t[r + n] = (e >>> (8 * (i ? n : 3 - n))) & 255;
        }
        function D(t, e, r, i, n, o) {
          if (r + i > t.length) throw new RangeError('Index out of range');
          if (r < 0) throw new RangeError('Index out of range');
        }
        function Y(t, e, r, i, o) {
          return o || D(t, 0, r, 4), n.write(t, e, r, i, 23, 4), r + 4;
        }
        function F(t, e, r, i, o) {
          return o || D(t, 0, r, 8), n.write(t, e, r, i, 52, 8), r + 8;
        }
        (h.prototype.slice = function (t, e) {
          var r,
            i = this.length;
          if (
            ((t = ~~t) < 0 ? (t += i) < 0 && (t = 0) : t > i && (t = i),
            (e = void 0 === e ? i : ~~e) < 0
              ? (e += i) < 0 && (e = 0)
              : e > i && (e = i),
            e < t && (e = t),
            h.TYPED_ARRAY_SUPPORT)
          )
            (r = this.subarray(t, e)).__proto__ = h.prototype;
          else {
            var n = e - t;
            r = new h(n, void 0);
            for (var o = 0; o < n; ++o) r[o] = this[o + t];
          }
          return r;
        }),
          (h.prototype.readUIntLE = function (t, e, r) {
            (t |= 0), (e |= 0), r || U(t, e, this.length);
            for (var i = this[t], n = 1, o = 0; ++o < e && (n *= 256); )
              i += this[t + o] * n;
            return i;
          }),
          (h.prototype.readUIntBE = function (t, e, r) {
            (t |= 0), (e |= 0), r || U(t, e, this.length);
            for (var i = this[t + --e], n = 1; e > 0 && (n *= 256); )
              i += this[t + --e] * n;
            return i;
          }),
          (h.prototype.readUInt8 = function (t, e) {
            return e || U(t, 1, this.length), this[t];
          }),
          (h.prototype.readUInt16LE = function (t, e) {
            return e || U(t, 2, this.length), this[t] | (this[t + 1] << 8);
          }),
          (h.prototype.readUInt16BE = function (t, e) {
            return e || U(t, 2, this.length), (this[t] << 8) | this[t + 1];
          }),
          (h.prototype.readUInt32LE = function (t, e) {
            return (
              e || U(t, 4, this.length),
              (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
                16777216 * this[t + 3]
            );
          }),
          (h.prototype.readUInt32BE = function (t, e) {
            return (
              e || U(t, 4, this.length),
              16777216 * this[t] +
                ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
            );
          }),
          (h.prototype.readIntLE = function (t, e, r) {
            (t |= 0), (e |= 0), r || U(t, e, this.length);
            for (var i = this[t], n = 1, o = 0; ++o < e && (n *= 256); )
              i += this[t + o] * n;
            return i >= (n *= 128) && (i -= Math.pow(2, 8 * e)), i;
          }),
          (h.prototype.readIntBE = function (t, e, r) {
            (t |= 0), (e |= 0), r || U(t, e, this.length);
            for (var i = e, n = 1, o = this[t + --i]; i > 0 && (n *= 256); )
              o += this[t + --i] * n;
            return o >= (n *= 128) && (o -= Math.pow(2, 8 * e)), o;
          }),
          (h.prototype.readInt8 = function (t, e) {
            return (
              e || U(t, 1, this.length),
              128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
            );
          }),
          (h.prototype.readInt16LE = function (t, e) {
            e || U(t, 2, this.length);
            var r = this[t] | (this[t + 1] << 8);
            return 32768 & r ? 4294901760 | r : r;
          }),
          (h.prototype.readInt16BE = function (t, e) {
            e || U(t, 2, this.length);
            var r = this[t + 1] | (this[t] << 8);
            return 32768 & r ? 4294901760 | r : r;
          }),
          (h.prototype.readInt32LE = function (t, e) {
            return (
              e || U(t, 4, this.length),
              this[t] |
                (this[t + 1] << 8) |
                (this[t + 2] << 16) |
                (this[t + 3] << 24)
            );
          }),
          (h.prototype.readInt32BE = function (t, e) {
            return (
              e || U(t, 4, this.length),
              (this[t] << 24) |
                (this[t + 1] << 16) |
                (this[t + 2] << 8) |
                this[t + 3]
            );
          }),
          (h.prototype.readFloatLE = function (t, e) {
            return e || U(t, 4, this.length), n.read(this, t, !0, 23, 4);
          }),
          (h.prototype.readFloatBE = function (t, e) {
            return e || U(t, 4, this.length), n.read(this, t, !1, 23, 4);
          }),
          (h.prototype.readDoubleLE = function (t, e) {
            return e || U(t, 8, this.length), n.read(this, t, !0, 52, 8);
          }),
          (h.prototype.readDoubleBE = function (t, e) {
            return e || U(t, 8, this.length), n.read(this, t, !1, 52, 8);
          }),
          (h.prototype.writeUIntLE = function (t, e, r, i) {
            ((t = +t), (e |= 0), (r |= 0), i) ||
              M(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
            var n = 1,
              o = 0;
            for (this[e] = 255 & t; ++o < r && (n *= 256); )
              this[e + o] = (t / n) & 255;
            return e + r;
          }),
          (h.prototype.writeUIntBE = function (t, e, r, i) {
            ((t = +t), (e |= 0), (r |= 0), i) ||
              M(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
            var n = r - 1,
              o = 1;
            for (this[e + n] = 255 & t; --n >= 0 && (o *= 256); )
              this[e + n] = (t / o) & 255;
            return e + r;
          }),
          (h.prototype.writeUInt8 = function (t, e, r) {
            return (
              (t = +t),
              (e |= 0),
              r || M(this, t, e, 1, 255, 0),
              h.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
              (this[e] = 255 & t),
              e + 1
            );
          }),
          (h.prototype.writeUInt16LE = function (t, e, r) {
            return (
              (t = +t),
              (e |= 0),
              r || M(this, t, e, 2, 65535, 0),
              h.TYPED_ARRAY_SUPPORT
                ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8))
                : O(this, t, e, !0),
              e + 2
            );
          }),
          (h.prototype.writeUInt16BE = function (t, e, r) {
            return (
              (t = +t),
              (e |= 0),
              r || M(this, t, e, 2, 65535, 0),
              h.TYPED_ARRAY_SUPPORT
                ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t))
                : O(this, t, e, !1),
              e + 2
            );
          }),
          (h.prototype.writeUInt32LE = function (t, e, r) {
            return (
              (t = +t),
              (e |= 0),
              r || M(this, t, e, 4, 4294967295, 0),
              h.TYPED_ARRAY_SUPPORT
                ? ((this[e + 3] = t >>> 24),
                  (this[e + 2] = t >>> 16),
                  (this[e + 1] = t >>> 8),
                  (this[e] = 255 & t))
                : I(this, t, e, !0),
              e + 4
            );
          }),
          (h.prototype.writeUInt32BE = function (t, e, r) {
            return (
              (t = +t),
              (e |= 0),
              r || M(this, t, e, 4, 4294967295, 0),
              h.TYPED_ARRAY_SUPPORT
                ? ((this[e] = t >>> 24),
                  (this[e + 1] = t >>> 16),
                  (this[e + 2] = t >>> 8),
                  (this[e + 3] = 255 & t))
                : I(this, t, e, !1),
              e + 4
            );
          }),
          (h.prototype.writeIntLE = function (t, e, r, i) {
            if (((t = +t), (e |= 0), !i)) {
              var n = Math.pow(2, 8 * r - 1);
              M(this, t, e, r, n - 1, -n);
            }
            var o = 0,
              s = 1,
              a = 0;
            for (this[e] = 255 & t; ++o < r && (s *= 256); )
              t < 0 && 0 === a && 0 !== this[e + o - 1] && (a = 1),
                (this[e + o] = (((t / s) >> 0) - a) & 255);
            return e + r;
          }),
          (h.prototype.writeIntBE = function (t, e, r, i) {
            if (((t = +t), (e |= 0), !i)) {
              var n = Math.pow(2, 8 * r - 1);
              M(this, t, e, r, n - 1, -n);
            }
            var o = r - 1,
              s = 1,
              a = 0;
            for (this[e + o] = 255 & t; --o >= 0 && (s *= 256); )
              t < 0 && 0 === a && 0 !== this[e + o + 1] && (a = 1),
                (this[e + o] = (((t / s) >> 0) - a) & 255);
            return e + r;
          }),
          (h.prototype.writeInt8 = function (t, e, r) {
            return (
              (t = +t),
              (e |= 0),
              r || M(this, t, e, 1, 127, -128),
              h.TYPED_ARRAY_SUPPORT || (t = Math.floor(t)),
              t < 0 && (t = 255 + t + 1),
              (this[e] = 255 & t),
              e + 1
            );
          }),
          (h.prototype.writeInt16LE = function (t, e, r) {
            return (
              (t = +t),
              (e |= 0),
              r || M(this, t, e, 2, 32767, -32768),
              h.TYPED_ARRAY_SUPPORT
                ? ((this[e] = 255 & t), (this[e + 1] = t >>> 8))
                : O(this, t, e, !0),
              e + 2
            );
          }),
          (h.prototype.writeInt16BE = function (t, e, r) {
            return (
              (t = +t),
              (e |= 0),
              r || M(this, t, e, 2, 32767, -32768),
              h.TYPED_ARRAY_SUPPORT
                ? ((this[e] = t >>> 8), (this[e + 1] = 255 & t))
                : O(this, t, e, !1),
              e + 2
            );
          }),
          (h.prototype.writeInt32LE = function (t, e, r) {
            return (
              (t = +t),
              (e |= 0),
              r || M(this, t, e, 4, 2147483647, -2147483648),
              h.TYPED_ARRAY_SUPPORT
                ? ((this[e] = 255 & t),
                  (this[e + 1] = t >>> 8),
                  (this[e + 2] = t >>> 16),
                  (this[e + 3] = t >>> 24))
                : I(this, t, e, !0),
              e + 4
            );
          }),
          (h.prototype.writeInt32BE = function (t, e, r) {
            return (
              (t = +t),
              (e |= 0),
              r || M(this, t, e, 4, 2147483647, -2147483648),
              t < 0 && (t = 4294967295 + t + 1),
              h.TYPED_ARRAY_SUPPORT
                ? ((this[e] = t >>> 24),
                  (this[e + 1] = t >>> 16),
                  (this[e + 2] = t >>> 8),
                  (this[e + 3] = 255 & t))
                : I(this, t, e, !1),
              e + 4
            );
          }),
          (h.prototype.writeFloatLE = function (t, e, r) {
            return Y(this, t, e, !0, r);
          }),
          (h.prototype.writeFloatBE = function (t, e, r) {
            return Y(this, t, e, !1, r);
          }),
          (h.prototype.writeDoubleLE = function (t, e, r) {
            return F(this, t, e, !0, r);
          }),
          (h.prototype.writeDoubleBE = function (t, e, r) {
            return F(this, t, e, !1, r);
          }),
          (h.prototype.copy = function (t, e, r, i) {
            if (
              (r || (r = 0),
              i || 0 === i || (i = this.length),
              e >= t.length && (e = t.length),
              e || (e = 0),
              i > 0 && i < r && (i = r),
              i === r)
            )
              return 0;
            if (0 === t.length || 0 === this.length) return 0;
            if (e < 0) throw new RangeError('targetStart out of bounds');
            if (r < 0 || r >= this.length)
              throw new RangeError('sourceStart out of bounds');
            if (i < 0) throw new RangeError('sourceEnd out of bounds');
            i > this.length && (i = this.length),
              t.length - e < i - r && (i = t.length - e + r);
            var n,
              o = i - r;
            if (this === t && r < e && e < i)
              for (n = o - 1; n >= 0; --n) t[n + e] = this[n + r];
            else if (o < 1e3 || !h.TYPED_ARRAY_SUPPORT)
              for (n = 0; n < o; ++n) t[n + e] = this[n + r];
            else Uint8Array.prototype.set.call(t, this.subarray(r, r + o), e);
            return o;
          }),
          (h.prototype.fill = function (t, e, r, i) {
            if ('string' == typeof t) {
              if (
                ('string' == typeof e
                  ? ((i = e), (e = 0), (r = this.length))
                  : 'string' == typeof r && ((i = r), (r = this.length)),
                1 === t.length)
              ) {
                var n = t.charCodeAt(0);
                n < 256 && (t = n);
              }
              if (void 0 !== i && 'string' != typeof i)
                throw new TypeError('encoding must be a string');
              if ('string' == typeof i && !h.isEncoding(i))
                throw new TypeError('Unknown encoding: ' + i);
            } else 'number' == typeof t && (t &= 255);
            if (e < 0 || this.length < e || this.length < r)
              throw new RangeError('Out of range index');
            if (r <= e) return this;
            var o;
            if (
              ((e >>>= 0),
              (r = void 0 === r ? this.length : r >>> 0),
              t || (t = 0),
              'number' == typeof t)
            )
              for (o = e; o < r; ++o) this[o] = t;
            else {
              var s = h.isBuffer(t) ? t : C(new h(t, i).toString()),
                a = s.length;
              for (o = 0; o < r - e; ++o) this[o + e] = s[o % a];
            }
            return this;
          });
        var L = /[^+\/0-9A-Za-z-_]/g;
        function N(t) {
          return t < 16 ? '0' + t.toString(16) : t.toString(16);
        }
        function C(t, e) {
          var r;
          e = e || 1 / 0;
          for (var i = t.length, n = null, o = [], s = 0; s < i; ++s) {
            if ((r = t.charCodeAt(s)) > 55295 && r < 57344) {
              if (!n) {
                if (r > 56319) {
                  (e -= 3) > -1 && o.push(239, 191, 189);
                  continue;
                }
                if (s + 1 === i) {
                  (e -= 3) > -1 && o.push(239, 191, 189);
                  continue;
                }
                n = r;
                continue;
              }
              if (r < 56320) {
                (e -= 3) > -1 && o.push(239, 191, 189), (n = r);
                continue;
              }
              r = 65536 + (((n - 55296) << 10) | (r - 56320));
            } else n && (e -= 3) > -1 && o.push(239, 191, 189);
            if (((n = null), r < 128)) {
              if ((e -= 1) < 0) break;
              o.push(r);
            } else if (r < 2048) {
              if ((e -= 2) < 0) break;
              o.push((r >> 6) | 192, (63 & r) | 128);
            } else if (r < 65536) {
              if ((e -= 3) < 0) break;
              o.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (63 & r) | 128);
            } else {
              if (!(r < 1114112)) throw new Error('Invalid code point');
              if ((e -= 4) < 0) break;
              o.push(
                (r >> 18) | 240,
                ((r >> 12) & 63) | 128,
                ((r >> 6) & 63) | 128,
                (63 & r) | 128
              );
            }
          }
          return o;
        }
        function j(t) {
          return i.toByteArray(
            (function (t) {
              if (
                (t = (function (t) {
                  return t.trim ? t.trim() : t.replace(/^\s+|\s+$/g, '');
                })(t).replace(L, '')).length < 2
              )
                return '';
              for (; t.length % 4 != 0; ) t += '=';
              return t;
            })(t)
          );
        }
        function z(t, e, r, i) {
          for (var n = 0; n < i && !(n + r >= e.length || n >= t.length); ++n)
            e[n + r] = t[n];
          return n;
        }
      }).call(this, r(0));
    },
    function (t, e, r) {
      'use strict';
      (e.byteLength = function (t) {
        var e = u(t),
          r = e[0],
          i = e[1];
        return (3 * (r + i)) / 4 - i;
      }),
        (e.toByteArray = function (t) {
          var e,
            r,
            i = u(t),
            s = i[0],
            a = i[1],
            h = new o(
              (function (t, e, r) {
                return (3 * (e + r)) / 4 - r;
              })(0, s, a)
            ),
            c = 0,
            f = a > 0 ? s - 4 : s;
          for (r = 0; r < f; r += 4)
            (e =
              (n[t.charCodeAt(r)] << 18) |
              (n[t.charCodeAt(r + 1)] << 12) |
              (n[t.charCodeAt(r + 2)] << 6) |
              n[t.charCodeAt(r + 3)]),
              (h[c++] = (e >> 16) & 255),
              (h[c++] = (e >> 8) & 255),
              (h[c++] = 255 & e);
          2 === a &&
            ((e = (n[t.charCodeAt(r)] << 2) | (n[t.charCodeAt(r + 1)] >> 4)),
            (h[c++] = 255 & e));
          1 === a &&
            ((e =
              (n[t.charCodeAt(r)] << 10) |
              (n[t.charCodeAt(r + 1)] << 4) |
              (n[t.charCodeAt(r + 2)] >> 2)),
            (h[c++] = (e >> 8) & 255),
            (h[c++] = 255 & e));
          return h;
        }),
        (e.fromByteArray = function (t) {
          for (
            var e, r = t.length, n = r % 3, o = [], s = 0, a = r - n;
            s < a;
            s += 16383
          )
            o.push(c(t, s, s + 16383 > a ? a : s + 16383));
          1 === n
            ? ((e = t[r - 1]), o.push(i[e >> 2] + i[(e << 4) & 63] + '=='))
            : 2 === n &&
              ((e = (t[r - 2] << 8) + t[r - 1]),
              o.push(i[e >> 10] + i[(e >> 4) & 63] + i[(e << 2) & 63] + '='));
          return o.join('');
        });
      for (
        var i = [],
          n = [],
          o = 'undefined' != typeof Uint8Array ? Uint8Array : Array,
          s =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
          a = 0,
          h = s.length;
        a < h;
        ++a
      )
        (i[a] = s[a]), (n[s.charCodeAt(a)] = a);
      function u(t) {
        var e = t.length;
        if (e % 4 > 0)
          throw new Error('Invalid string. Length must be a multiple of 4');
        var r = t.indexOf('=');
        return -1 === r && (r = e), [r, r === e ? 0 : 4 - (r % 4)];
      }
      function c(t, e, r) {
        for (var n, o, s = [], a = e; a < r; a += 3)
          (n =
            ((t[a] << 16) & 16711680) +
            ((t[a + 1] << 8) & 65280) +
            (255 & t[a + 2])),
            s.push(
              i[((o = n) >> 18) & 63] +
                i[(o >> 12) & 63] +
                i[(o >> 6) & 63] +
                i[63 & o]
            );
        return s.join('');
      }
      (n['-'.charCodeAt(0)] = 62), (n['_'.charCodeAt(0)] = 63);
    },
    function (t, e) {
      (e.read = function (t, e, r, i, n) {
        var o,
          s,
          a = 8 * n - i - 1,
          h = (1 << a) - 1,
          u = h >> 1,
          c = -7,
          f = r ? n - 1 : 0,
          l = r ? -1 : 1,
          p = t[e + f];
        for (
          f += l, o = p & ((1 << -c) - 1), p >>= -c, c += a;
          c > 0;
          o = 256 * o + t[e + f], f += l, c -= 8
        );
        for (
          s = o & ((1 << -c) - 1), o >>= -c, c += i;
          c > 0;
          s = 256 * s + t[e + f], f += l, c -= 8
        );
        if (0 === o) o = 1 - u;
        else {
          if (o === h) return s ? NaN : (1 / 0) * (p ? -1 : 1);
          (s += Math.pow(2, i)), (o -= u);
        }
        return (p ? -1 : 1) * s * Math.pow(2, o - i);
      }),
        (e.write = function (t, e, r, i, n, o) {
          var s,
            a,
            h,
            u = 8 * o - n - 1,
            c = (1 << u) - 1,
            f = c >> 1,
            l = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
            p = i ? 0 : o - 1,
            d = i ? 1 : -1,
            w = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0;
          for (
            e = Math.abs(e),
              isNaN(e) || e === 1 / 0
                ? ((a = isNaN(e) ? 1 : 0), (s = c))
                : ((s = Math.floor(Math.log(e) / Math.LN2)),
                  e * (h = Math.pow(2, -s)) < 1 && (s--, (h *= 2)),
                  (e += s + f >= 1 ? l / h : l * Math.pow(2, 1 - f)) * h >= 2 &&
                    (s++, (h /= 2)),
                  s + f >= c
                    ? ((a = 0), (s = c))
                    : s + f >= 1
                    ? ((a = (e * h - 1) * Math.pow(2, n)), (s += f))
                    : ((a = e * Math.pow(2, f - 1) * Math.pow(2, n)), (s = 0)));
            n >= 8;
            t[r + p] = 255 & a, p += d, a /= 256, n -= 8
          );
          for (
            s = (s << n) | a, u += n;
            u > 0;
            t[r + p] = 255 & s, p += d, s /= 256, u -= 8
          );
          t[r + p - d] |= 128 * w;
        });
    },
    function (t, e) {
      var r = {}.toString;
      t.exports =
        Array.isArray ||
        function (t) {
          return '[object Array]' == r.call(t);
        };
    },
    function (t, e) {
      t.exports = function (t, e, r) {
        var i;
        return function () {
          if (!e) return t.apply(this, arguments);
          var n = this,
            o = arguments,
            s = r && !i;
          return (
            clearTimeout(i),
            (i = setTimeout(function () {
              if (((i = null), !s)) return t.apply(n, o);
            }, e)),
            s ? t.apply(this, arguments) : void 0
          );
        };
      };
    },
    function (t, e) {
      t.exports = class {
        constructor(t) {
          (this.type = t.type),
            (this.mode = t.mode),
            (this.size = t.size),
            (this.ino = t.ino),
            (this.mtimeMs = t.mtimeMs),
            (this.ctimeMs = t.ctimeMs || t.mtimeMs),
            (this.uid = 1),
            (this.gid = 1),
            (this.dev = 1);
        }
        isFile() {
          return 'file' === this.type;
        }
        isDirectory() {
          return 'dir' === this.type;
        }
        isSymbolicLink() {
          return 'symlink' === this.type;
        }
      };
    },
    function (t, e, r) {
      const i = r(1),
        { EEXIST: n, ENOENT: o, ENOTDIR: s, ENOTEMPTY: a } = r(2);
      t.exports = class {
        constructor() {}
        _makeRoot(t = new Map()) {
          return (
            t.set(0, {
              mode: 511,
              type: 'dir',
              size: 0,
              ino: 0,
              mtimeMs: Date.now(),
            }),
            t
          );
        }
        activate(t = null) {
          this._root =
            null === t
              ? new Map([['/', this._makeRoot()]])
              : 'string' == typeof t
              ? new Map([['/', this._makeRoot(this.parse(t))]])
              : t;
        }
        get activated() {
          return !!this._root;
        }
        deactivate() {
          this._root = void 0;
        }
        size() {
          return this._countInodes(this._root.get('/')) - 1;
        }
        _countInodes(t) {
          let e = 1;
          for (let [r, i] of t) 0 !== r && (e += this._countInodes(i));
          return e;
        }
        autoinc() {
          return this._maxInode(this._root.get('/')) + 1;
        }
        _maxInode(t) {
          let e = t.get(0).ino;
          for (let [r, i] of t) 0 !== r && (e = Math.max(e, this._maxInode(i)));
          return e;
        }
        print(t = this._root.get('/')) {
          let e = '';
          const r = (t, i) => {
            for (let [n, o] of t) {
              if (0 === n) continue;
              let t = o.get(0),
                s = t.mode.toString(8);
              (e += `${'\t'.repeat(i)}${n}\t${s}`),
                'file' === t.type
                  ? (e += `\t${t.size}\t${t.mtimeMs}\n`)
                  : ((e += '\n'), r(o, i + 1));
            }
          };
          return r(t, 0), e;
        }
        parse(t) {
          let e = 0;
          function r(t) {
            const r = ++e,
              i = 1 === t.length ? 'dir' : 'file';
            let [n, o, s] = t;
            return (
              (n = parseInt(n, 8)),
              (o = o ? parseInt(o) : 0),
              (s = s ? parseInt(s) : Date.now()),
              new Map([[0, { mode: n, type: i, size: o, mtimeMs: s, ino: r }]])
            );
          }
          let i = t.trim().split('\n'),
            n = this._makeRoot(),
            o = [
              { indent: -1, node: n },
              { indent: 0, node: null },
            ];
          for (let t of i) {
            let e = t.match(/^\t*/)[0].length;
            t = t.slice(e);
            let [i, ...n] = t.split('\t'),
              s = r(n);
            if (e <= o[o.length - 1].indent)
              for (; e <= o[o.length - 1].indent; ) o.pop();
            o.push({ indent: e, node: s }), o[o.length - 2].node.set(i, s);
          }
          return n;
        }
        _lookup(t, e = !0) {
          let r = this._root,
            n = '/',
            s = i.split(t);
          for (let a = 0; a < s.length; ++a) {
            let h = s[a];
            if (((r = r.get(h)), !r)) throw new o(t);
            if (e || a < s.length - 1) {
              const t = r.get(0);
              if ('symlink' === t.type) {
                let e = i.resolve(n, t.target);
                r = this._lookup(e);
              }
              n = n ? i.join(n, h) : h;
            }
          }
          return r;
        }
        mkdir(t, { mode: e }) {
          if ('/' === t) throw new n();
          let r = this._lookup(i.dirname(t)),
            o = i.basename(t);
          if (r.has(o)) throw new n();
          let s = new Map(),
            a = {
              mode: e,
              type: 'dir',
              size: 0,
              mtimeMs: Date.now(),
              ino: this.autoinc(),
            };
          s.set(0, a), r.set(o, s);
        }
        rmdir(t) {
          let e = this._lookup(t);
          if ('dir' !== e.get(0).type) throw new s();
          if (e.size > 1) throw new a();
          let r = this._lookup(i.dirname(t)),
            n = i.basename(t);
          r.delete(n);
        }
        readdir(t) {
          let e = this._lookup(t);
          if ('dir' !== e.get(0).type) throw new s();
          return [...e.keys()].filter((t) => 'string' == typeof t);
        }
        writeStat(t, e, { mode: r }) {
          let n;
          try {
            let e = this.stat(t);
            null == r && (r = e.mode), (n = e.ino);
          } catch (t) {}
          null == r && (r = 438), null == n && (n = this.autoinc());
          let o = this._lookup(i.dirname(t)),
            s = i.basename(t),
            a = { mode: r, type: 'file', size: e, mtimeMs: Date.now(), ino: n },
            h = new Map();
          return h.set(0, a), o.set(s, h), a;
        }
        unlink(t) {
          let e = this._lookup(i.dirname(t)),
            r = i.basename(t);
          e.delete(r);
        }
        rename(t, e) {
          let r = i.basename(e),
            n = this._lookup(t);
          this._lookup(i.dirname(e)).set(r, n), this.unlink(t);
        }
        stat(t) {
          return this._lookup(t).get(0);
        }
        lstat(t) {
          return this._lookup(t, !1).get(0);
        }
        readlink(t) {
          return this._lookup(t, !1).get(0).target;
        }
        symlink(t, e) {
          let r, n;
          try {
            let t = this.stat(e);
            null === n && (n = t.mode), (r = t.ino);
          } catch (t) {}
          null == n && (n = 40960), null == r && (r = this.autoinc());
          let o = this._lookup(i.dirname(e)),
            s = i.basename(e),
            a = {
              mode: n,
              type: 'symlink',
              target: t,
              size: 0,
              mtimeMs: Date.now(),
              ino: r,
            },
            h = new Map();
          return h.set(0, a), o.set(s, h), a;
        }
        _du(t) {
          let e = 0;
          for (const [r, i] of t.entries()) e += 0 === r ? i.size : this._du(i);
          return e;
        }
        du(t) {
          let e = this._lookup(t);
          return this._du(e);
        }
      };
    },
    function (t, e, r) {
      const i = r(3);
      t.exports = class {
        constructor(t, e) {
          (this._database = t),
            (this._storename = e),
            (this._store = new i.Store(this._database, this._storename));
        }
        saveSuperblock(t) {
          return i.set('!root', t, this._store);
        }
        loadSuperblock() {
          return i.get('!root', this._store);
        }
        readFile(t) {
          return i.get(t, this._store);
        }
        writeFile(t, e) {
          return i.set(t, e, this._store);
        }
        unlink(t) {
          return i.del(t, this._store);
        }
        wipe() {
          return i.clear(this._store);
        }
        close() {
          return i.close(this._store);
        }
      };
    },
    function (t, e) {
      t.exports = class {
        constructor(t) {
          this._url = t;
        }
        loadSuperblock() {
          return fetch(this._url + '/.superblock.txt').then((t) =>
            t.ok ? t.text() : null
          );
        }
        async readFile(t) {
          const e = await fetch(this._url + t);
          if (200 === e.status) return e.arrayBuffer();
          throw new Error('ENOENT');
        }
        async sizeFile(t) {
          const e = await fetch(this._url + t, { method: 'HEAD' });
          if (200 === e.status) return e.headers.get('content-length');
          throw new Error('ENOENT');
        }
      };
    },
    function (t, e, r) {
      const i = r(3),
        n = (t) => new Promise((e) => setTimeout(e, t));
      t.exports = class {
        constructor(t, e) {
          (this._id = Math.random()),
            (this._database = t),
            (this._storename = e),
            (this._store = new i.Store(this._database, this._storename)),
            (this._lock = null);
        }
        async has({ margin: t = 2e3 } = {}) {
          if (this._lock && this._lock.holder === this._id) {
            const e = Date.now();
            return this._lock.expires > e + t || (await this.renew());
          }
          return !1;
        }
        async renew({ ttl: t = 5e3 } = {}) {
          let e;
          return (
            await i.update(
              'lock',
              (r) => {
                const i = Date.now() + t;
                return (
                  (e = r && r.holder === this._id),
                  (this._lock = e ? { holder: this._id, expires: i } : r),
                  this._lock
                );
              },
              this._store
            ),
            e
          );
        }
        async acquire({ ttl: t = 5e3 } = {}) {
          let e, r, n;
          if (
            (await i.update(
              'lock',
              (i) => {
                const o = Date.now(),
                  s = o + t;
                return (
                  (r = i && i.expires < o),
                  (e = void 0 === i || r),
                  (n = i && i.holder === this._id),
                  (this._lock = e ? { holder: this._id, expires: s } : i),
                  this._lock
                );
              },
              this._store
            ),
            n)
          )
            throw new Error('Mutex double-locked');
          return e;
        }
        async wait({ interval: t = 100, limit: e = 6e3, ttl: r } = {}) {
          for (; e--; ) {
            if (await this.acquire({ ttl: r })) return !0;
            await n(t);
          }
          throw new Error('Mutex timeout');
        }
        async release({ force: t = !1 } = {}) {
          let e, r, n;
          if (
            (await i.update(
              'lock',
              (i) => (
                (e = t || (i && i.holder === this._id)),
                (r = void 0 === i),
                (n = i && i.holder !== this._id),
                (this._lock = e ? void 0 : i),
                this._lock
              ),
              this._store
            ),
            await i.close(this._store),
            !e && !t)
          ) {
            if (r) throw new Error('Mutex double-freed');
            if (n) throw new Error('Mutex lost ownership');
          }
          return e;
        }
      };
    },
    function (t, e) {
      t.exports = class {
        constructor(t) {
          (this._id = Math.random()),
            (this._database = t),
            (this._has = !1),
            (this._release = null);
        }
        async has() {
          return this._has;
        }
        async acquire() {
          return new Promise((t) => {
            navigator.locks.request(
              this._database + '_lock',
              { ifAvailable: !0 },
              (e) => (
                (this._has = !!e),
                t(!!e),
                new Promise((t) => {
                  this._release = t;
                })
              )
            );
          });
        }
        async wait({ timeout: t = 6e5 } = {}) {
          return new Promise((e, r) => {
            const i = new AbortController();
            setTimeout(() => {
              i.abort(), r(new Error('Mutex timeout'));
            }, t),
              navigator.locks.request(
                this._database + '_lock',
                { signal: i.signal },
                (t) => (
                  (this._has = !!t),
                  e(!!t),
                  new Promise((t) => {
                    this._release = t;
                  })
                )
              );
          });
        }
        async release({ force: t = !1 } = {}) {
          (this._has = !1),
            this._release
              ? this._release()
              : t &&
                navigator.locks.request(
                  this._database + '_lock',
                  { steal: !0 },
                  (t) => !0
                );
        }
      };
    },
    function (t, e) {
      const r = 'undefined' == typeof window ? 'worker' : 'main';
      t.exports = function (t) {
        return (
          performance.mark(t + ' start'),
          console.log(`${r}: ${t}`),
          console.time(`${r}: ${t}`),
          function () {
            performance.mark(t + ' end'),
              console.timeEnd(`${r}: ${t}`),
              performance.measure('' + t, t + ' start', t + ' end');
          }
        );
      };
    },
  ]);
});
