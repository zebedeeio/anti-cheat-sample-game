!(function t(e, r, i) {
  function n(s, a) {
    if (!r[s]) {
      if (!e[s]) {
        var f = "function" == typeof require && require;
        if (!a && f) return f(s, !0);
        if (o) return o(s, !0);
        var h = new Error("Cannot find module '" + s + "'");
        throw ((h.code = "MODULE_NOT_FOUND"), h);
      }
      var u = (r[s] = { exports: {} });
      e[s][0].call(
        u.exports,
        function (t) {
          return n(e[s][1][t] || t);
        },
        u,
        u.exports,
        t,
        e,
        r,
        i
      );
    }
    return r[s].exports;
  }
  for (
    var o = "function" == typeof require && require, s = 0;
    s < i.length;
    s++
  )
    n(i[s]);
  return n;
})(
  {
    1: [
      function (t, e, r) {
        "use strict";
        const i = r;
        (i.bignum = t("bn.js")),
          (i.define = t("./asn1/api").define),
          (i.base = t("./asn1/base")),
          (i.constants = t("./asn1/constants")),
          (i.decoders = t("./asn1/decoders")),
          (i.encoders = t("./asn1/encoders"));
      },
      {
        "./asn1/api": 2,
        "./asn1/base": 4,
        "./asn1/constants": 8,
        "./asn1/decoders": 10,
        "./asn1/encoders": 13,
        "bn.js": 15,
      },
    ],
    2: [
      function (t, e, r) {
        "use strict";
        const i = t("./encoders"),
          n = t("./decoders"),
          o = t("inherits");
        function s(t, e) {
          (this.name = t),
            (this.body = e),
            (this.decoders = {}),
            (this.encoders = {});
        }
        (r.define = function (t, e) {
          return new s(t, e);
        }),
          (s.prototype._createNamed = function (t) {
            const e = this.name;
            function r(t) {
              this._initNamed(t, e);
            }
            return (
              o(r, t),
              (r.prototype._initNamed = function (e, r) {
                t.call(this, e, r);
              }),
              new r(this)
            );
          }),
          (s.prototype._getDecoder = function (t) {
            return (
              (t = t || "der"),
              this.decoders.hasOwnProperty(t) ||
                (this.decoders[t] = this._createNamed(n[t])),
              this.decoders[t]
            );
          }),
          (s.prototype.decode = function (t, e, r) {
            return this._getDecoder(e).decode(t, r);
          }),
          (s.prototype._getEncoder = function (t) {
            return (
              (t = t || "der"),
              this.encoders.hasOwnProperty(t) ||
                (this.encoders[t] = this._createNamed(i[t])),
              this.encoders[t]
            );
          }),
          (s.prototype.encode = function (t, e, r) {
            return this._getEncoder(e).encode(t, r);
          });
      },
      { "./decoders": 10, "./encoders": 13, inherits: 132 },
    ],
    3: [
      function (t, e, r) {
        "use strict";
        const i = t("inherits"),
          n = t("../base/reporter").Reporter,
          o = t("safer-buffer").Buffer;
        function s(t, e) {
          n.call(this, e),
            o.isBuffer(t)
              ? ((this.base = t), (this.offset = 0), (this.length = t.length))
              : this.error("Input not Buffer");
        }
        function a(t, e) {
          if (Array.isArray(t))
            (this.length = 0),
              (this.value = t.map(function (t) {
                return (
                  a.isEncoderBuffer(t) || (t = new a(t, e)),
                  (this.length += t.length),
                  t
                );
              }, this));
          else if ("number" == typeof t) {
            if (!(0 <= t && t <= 255))
              return e.error("non-byte EncoderBuffer value");
            (this.value = t), (this.length = 1);
          } else if ("string" == typeof t)
            (this.value = t), (this.length = o.byteLength(t));
          else {
            if (!o.isBuffer(t)) return e.error("Unsupported type: " + typeof t);
            (this.value = t), (this.length = t.length);
          }
        }
        i(s, n),
          (r.DecoderBuffer = s),
          (s.isDecoderBuffer = function (t) {
            if (t instanceof s) return !0;
            return (
              "object" == typeof t &&
              o.isBuffer(t.base) &&
              "DecoderBuffer" === t.constructor.name &&
              "number" == typeof t.offset &&
              "number" == typeof t.length &&
              "function" == typeof t.save &&
              "function" == typeof t.restore &&
              "function" == typeof t.isEmpty &&
              "function" == typeof t.readUInt8 &&
              "function" == typeof t.skip &&
              "function" == typeof t.raw
            );
          }),
          (s.prototype.save = function () {
            return {
              offset: this.offset,
              reporter: n.prototype.save.call(this),
            };
          }),
          (s.prototype.restore = function (t) {
            const e = new s(this.base);
            return (
              (e.offset = t.offset),
              (e.length = this.offset),
              (this.offset = t.offset),
              n.prototype.restore.call(this, t.reporter),
              e
            );
          }),
          (s.prototype.isEmpty = function () {
            return this.offset === this.length;
          }),
          (s.prototype.readUInt8 = function (t) {
            return this.offset + 1 <= this.length
              ? this.base.readUInt8(this.offset++, !0)
              : this.error(t || "DecoderBuffer overrun");
          }),
          (s.prototype.skip = function (t, e) {
            if (!(this.offset + t <= this.length))
              return this.error(e || "DecoderBuffer overrun");
            const r = new s(this.base);
            return (
              (r._reporterState = this._reporterState),
              (r.offset = this.offset),
              (r.length = this.offset + t),
              (this.offset += t),
              r
            );
          }),
          (s.prototype.raw = function (t) {
            return this.base.slice(t ? t.offset : this.offset, this.length);
          }),
          (r.EncoderBuffer = a),
          (a.isEncoderBuffer = function (t) {
            if (t instanceof a) return !0;
            return (
              "object" == typeof t &&
              "EncoderBuffer" === t.constructor.name &&
              "number" == typeof t.length &&
              "function" == typeof t.join
            );
          }),
          (a.prototype.join = function (t, e) {
            return (
              t || (t = o.alloc(this.length)),
              e || (e = 0),
              0 === this.length ||
                (Array.isArray(this.value)
                  ? this.value.forEach(function (r) {
                      r.join(t, e), (e += r.length);
                    })
                  : ("number" == typeof this.value
                      ? (t[e] = this.value)
                      : "string" == typeof this.value
                      ? t.write(this.value, e)
                      : o.isBuffer(this.value) && this.value.copy(t, e),
                    (e += this.length))),
              t
            );
          });
      },
      { "../base/reporter": 6, inherits: 132, "safer-buffer": 161 },
    ],
    4: [
      function (t, e, r) {
        "use strict";
        const i = r;
        (i.Reporter = t("./reporter").Reporter),
          (i.DecoderBuffer = t("./buffer").DecoderBuffer),
          (i.EncoderBuffer = t("./buffer").EncoderBuffer),
          (i.Node = t("./node"));
      },
      { "./buffer": 3, "./node": 5, "./reporter": 6 },
    ],
    5: [
      function (t, e, r) {
        "use strict";
        const i = t("../base/reporter").Reporter,
          n = t("../base/buffer").EncoderBuffer,
          o = t("../base/buffer").DecoderBuffer,
          s = t("minimalistic-assert"),
          a = [
            "seq",
            "seqof",
            "set",
            "setof",
            "objid",
            "bool",
            "gentime",
            "utctime",
            "null_",
            "enum",
            "int",
            "objDesc",
            "bitstr",
            "bmpstr",
            "charstr",
            "genstr",
            "graphstr",
            "ia5str",
            "iso646str",
            "numstr",
            "octstr",
            "printstr",
            "t61str",
            "unistr",
            "utf8str",
            "videostr",
          ],
          f = [
            "key",
            "obj",
            "use",
            "optional",
            "explicit",
            "implicit",
            "def",
            "choice",
            "any",
            "contains",
          ].concat(a);
        function h(t, e, r) {
          const i = {};
          (this._baseState = i),
            (i.name = r),
            (i.enc = t),
            (i.parent = e || null),
            (i.children = null),
            (i.tag = null),
            (i.args = null),
            (i.reverseArgs = null),
            (i.choice = null),
            (i.optional = !1),
            (i.any = !1),
            (i.obj = !1),
            (i.use = null),
            (i.useDecoder = null),
            (i.key = null),
            (i.default = null),
            (i.explicit = null),
            (i.implicit = null),
            (i.contains = null),
            i.parent || ((i.children = []), this._wrap());
        }
        e.exports = h;
        const u = [
          "enc",
          "parent",
          "children",
          "tag",
          "args",
          "reverseArgs",
          "choice",
          "optional",
          "any",
          "obj",
          "use",
          "alteredUse",
          "key",
          "default",
          "explicit",
          "implicit",
          "contains",
        ];
        (h.prototype.clone = function () {
          const t = this._baseState,
            e = {};
          u.forEach(function (r) {
            e[r] = t[r];
          });
          const r = new this.constructor(e.parent);
          return (r._baseState = e), r;
        }),
          (h.prototype._wrap = function () {
            const t = this._baseState;
            f.forEach(function (e) {
              this[e] = function () {
                const r = new this.constructor(this);
                return t.children.push(r), r[e].apply(r, arguments);
              };
            }, this);
          }),
          (h.prototype._init = function (t) {
            const e = this._baseState;
            s(null === e.parent),
              t.call(this),
              (e.children = e.children.filter(function (t) {
                return t._baseState.parent === this;
              }, this)),
              s.equal(
                e.children.length,
                1,
                "Root node can have only one child"
              );
          }),
          (h.prototype._useArgs = function (t) {
            const e = this._baseState,
              r = t.filter(function (t) {
                return t instanceof this.constructor;
              }, this);
            (t = t.filter(function (t) {
              return !(t instanceof this.constructor);
            }, this)),
              0 !== r.length &&
                (s(null === e.children),
                (e.children = r),
                r.forEach(function (t) {
                  t._baseState.parent = this;
                }, this)),
              0 !== t.length &&
                (s(null === e.args),
                (e.args = t),
                (e.reverseArgs = t.map(function (t) {
                  if ("object" != typeof t || t.constructor !== Object)
                    return t;
                  const e = {};
                  return (
                    Object.keys(t).forEach(function (r) {
                      r == (0 | r) && (r |= 0);
                      const i = t[r];
                      e[i] = r;
                    }),
                    e
                  );
                })));
          }),
          [
            "_peekTag",
            "_decodeTag",
            "_use",
            "_decodeStr",
            "_decodeObjid",
            "_decodeTime",
            "_decodeNull",
            "_decodeInt",
            "_decodeBool",
            "_decodeList",
            "_encodeComposite",
            "_encodeStr",
            "_encodeObjid",
            "_encodeTime",
            "_encodeNull",
            "_encodeInt",
            "_encodeBool",
          ].forEach(function (t) {
            h.prototype[t] = function () {
              const e = this._baseState;
              throw new Error(t + " not implemented for encoding: " + e.enc);
            };
          }),
          a.forEach(function (t) {
            h.prototype[t] = function () {
              const e = this._baseState,
                r = Array.prototype.slice.call(arguments);
              return s(null === e.tag), (e.tag = t), this._useArgs(r), this;
            };
          }),
          (h.prototype.use = function (t) {
            s(t);
            const e = this._baseState;
            return s(null === e.use), (e.use = t), this;
          }),
          (h.prototype.optional = function () {
            return (this._baseState.optional = !0), this;
          }),
          (h.prototype.def = function (t) {
            const e = this._baseState;
            return (
              s(null === e.default), (e.default = t), (e.optional = !0), this
            );
          }),
          (h.prototype.explicit = function (t) {
            const e = this._baseState;
            return (
              s(null === e.explicit && null === e.implicit),
              (e.explicit = t),
              this
            );
          }),
          (h.prototype.implicit = function (t) {
            const e = this._baseState;
            return (
              s(null === e.explicit && null === e.implicit),
              (e.implicit = t),
              this
            );
          }),
          (h.prototype.obj = function () {
            const t = this._baseState,
              e = Array.prototype.slice.call(arguments);
            return (t.obj = !0), 0 !== e.length && this._useArgs(e), this;
          }),
          (h.prototype.key = function (t) {
            const e = this._baseState;
            return s(null === e.key), (e.key = t), this;
          }),
          (h.prototype.any = function () {
            return (this._baseState.any = !0), this;
          }),
          (h.prototype.choice = function (t) {
            const e = this._baseState;
            return (
              s(null === e.choice),
              (e.choice = t),
              this._useArgs(
                Object.keys(t).map(function (e) {
                  return t[e];
                })
              ),
              this
            );
          }),
          (h.prototype.contains = function (t) {
            const e = this._baseState;
            return s(null === e.use), (e.contains = t), this;
          }),
          (h.prototype._decode = function (t, e) {
            const r = this._baseState;
            if (null === r.parent)
              return t.wrapResult(r.children[0]._decode(t, e));
            let i,
              n = r.default,
              s = !0,
              a = null;
            if ((null !== r.key && (a = t.enterKey(r.key)), r.optional)) {
              let i = null;
              if (
                (null !== r.explicit
                  ? (i = r.explicit)
                  : null !== r.implicit
                  ? (i = r.implicit)
                  : null !== r.tag && (i = r.tag),
                null !== i || r.any)
              ) {
                if (((s = this._peekTag(t, i, r.any)), t.isError(s))) return s;
              } else {
                const i = t.save();
                try {
                  null === r.choice
                    ? this._decodeGeneric(r.tag, t, e)
                    : this._decodeChoice(t, e),
                    (s = !0);
                } catch (t) {
                  s = !1;
                }
                t.restore(i);
              }
            }
            if ((r.obj && s && (i = t.enterObject()), s)) {
              if (null !== r.explicit) {
                const e = this._decodeTag(t, r.explicit);
                if (t.isError(e)) return e;
                t = e;
              }
              const i = t.offset;
              if (null === r.use && null === r.choice) {
                let e;
                r.any && (e = t.save());
                const i = this._decodeTag(
                  t,
                  null !== r.implicit ? r.implicit : r.tag,
                  r.any
                );
                if (t.isError(i)) return i;
                r.any ? (n = t.raw(e)) : (t = i);
              }
              if (
                (e &&
                  e.track &&
                  null !== r.tag &&
                  e.track(t.path(), i, t.length, "tagged"),
                e &&
                  e.track &&
                  null !== r.tag &&
                  e.track(t.path(), t.offset, t.length, "content"),
                r.any ||
                  (n =
                    null === r.choice
                      ? this._decodeGeneric(r.tag, t, e)
                      : this._decodeChoice(t, e)),
                t.isError(n))
              )
                return n;
              if (
                (r.any ||
                  null !== r.choice ||
                  null === r.children ||
                  r.children.forEach(function (r) {
                    r._decode(t, e);
                  }),
                r.contains && ("octstr" === r.tag || "bitstr" === r.tag))
              ) {
                const i = new o(n);
                n = this._getUse(r.contains, t._reporterState.obj)._decode(
                  i,
                  e
                );
              }
            }
            return (
              r.obj && s && (n = t.leaveObject(i)),
              null === r.key || (null === n && !0 !== s)
                ? null !== a && t.exitKey(a)
                : t.leaveKey(a, r.key, n),
              n
            );
          }),
          (h.prototype._decodeGeneric = function (t, e, r) {
            const i = this._baseState;
            return "seq" === t || "set" === t
              ? null
              : "seqof" === t || "setof" === t
              ? this._decodeList(e, t, i.args[0], r)
              : /str$/.test(t)
              ? this._decodeStr(e, t, r)
              : "objid" === t && i.args
              ? this._decodeObjid(e, i.args[0], i.args[1], r)
              : "objid" === t
              ? this._decodeObjid(e, null, null, r)
              : "gentime" === t || "utctime" === t
              ? this._decodeTime(e, t, r)
              : "null_" === t
              ? this._decodeNull(e, r)
              : "bool" === t
              ? this._decodeBool(e, r)
              : "objDesc" === t
              ? this._decodeStr(e, t, r)
              : "int" === t || "enum" === t
              ? this._decodeInt(e, i.args && i.args[0], r)
              : null !== i.use
              ? this._getUse(i.use, e._reporterState.obj)._decode(e, r)
              : e.error("unknown tag: " + t);
          }),
          (h.prototype._getUse = function (t, e) {
            const r = this._baseState;
            return (
              (r.useDecoder = this._use(t, e)),
              s(null === r.useDecoder._baseState.parent),
              (r.useDecoder = r.useDecoder._baseState.children[0]),
              r.implicit !== r.useDecoder._baseState.implicit &&
                ((r.useDecoder = r.useDecoder.clone()),
                (r.useDecoder._baseState.implicit = r.implicit)),
              r.useDecoder
            );
          }),
          (h.prototype._decodeChoice = function (t, e) {
            const r = this._baseState;
            let i = null,
              n = !1;
            return (
              Object.keys(r.choice).some(function (o) {
                const s = t.save(),
                  a = r.choice[o];
                try {
                  const r = a._decode(t, e);
                  if (t.isError(r)) return !1;
                  (i = { type: o, value: r }), (n = !0);
                } catch (e) {
                  return t.restore(s), !1;
                }
                return !0;
              }, this),
              n ? i : t.error("Choice not matched")
            );
          }),
          (h.prototype._createEncoderBuffer = function (t) {
            return new n(t, this.reporter);
          }),
          (h.prototype._encode = function (t, e, r) {
            const i = this._baseState;
            if (null !== i.default && i.default === t) return;
            const n = this._encodeValue(t, e, r);
            return void 0 === n || this._skipDefault(n, e, r) ? void 0 : n;
          }),
          (h.prototype._encodeValue = function (t, e, r) {
            const n = this._baseState;
            if (null === n.parent)
              return n.children[0]._encode(t, e || new i());
            let o = null;
            if (((this.reporter = e), n.optional && void 0 === t)) {
              if (null === n.default) return;
              t = n.default;
            }
            let s = null,
              a = !1;
            if (n.any) o = this._createEncoderBuffer(t);
            else if (n.choice) o = this._encodeChoice(t, e);
            else if (n.contains)
              (s = this._getUse(n.contains, r)._encode(t, e)), (a = !0);
            else if (n.children)
              (s = n.children
                .map(function (r) {
                  if ("null_" === r._baseState.tag)
                    return r._encode(null, e, t);
                  if (null === r._baseState.key)
                    return e.error("Child should have a key");
                  const i = e.enterKey(r._baseState.key);
                  if ("object" != typeof t)
                    return e.error("Child expected, but input is not object");
                  const n = r._encode(t[r._baseState.key], e, t);
                  return e.leaveKey(i), n;
                }, this)
                .filter(function (t) {
                  return t;
                })),
                (s = this._createEncoderBuffer(s));
            else if ("seqof" === n.tag || "setof" === n.tag) {
              if (!n.args || 1 !== n.args.length)
                return e.error("Too many args for : " + n.tag);
              if (!Array.isArray(t))
                return e.error("seqof/setof, but data is not Array");
              const r = this.clone();
              (r._baseState.implicit = null),
                (s = this._createEncoderBuffer(
                  t.map(function (r) {
                    const i = this._baseState;
                    return this._getUse(i.args[0], t)._encode(r, e);
                  }, r)
                ));
            } else
              null !== n.use
                ? (o = this._getUse(n.use, r)._encode(t, e))
                : ((s = this._encodePrimitive(n.tag, t)), (a = !0));
            if (!n.any && null === n.choice) {
              const t = null !== n.implicit ? n.implicit : n.tag,
                r = null === n.implicit ? "universal" : "context";
              null === t
                ? null === n.use &&
                  e.error("Tag could be omitted only for .use()")
                : null === n.use && (o = this._encodeComposite(t, a, r, s));
            }
            return (
              null !== n.explicit &&
                (o = this._encodeComposite(n.explicit, !1, "context", o)),
              o
            );
          }),
          (h.prototype._encodeChoice = function (t, e) {
            const r = this._baseState,
              i = r.choice[t.type];
            return (
              i ||
                s(
                  !1,
                  t.type +
                    " not found in " +
                    JSON.stringify(Object.keys(r.choice))
                ),
              i._encode(t.value, e)
            );
          }),
          (h.prototype._encodePrimitive = function (t, e) {
            const r = this._baseState;
            if (/str$/.test(t)) return this._encodeStr(e, t);
            if ("objid" === t && r.args)
              return this._encodeObjid(e, r.reverseArgs[0], r.args[1]);
            if ("objid" === t) return this._encodeObjid(e, null, null);
            if ("gentime" === t || "utctime" === t)
              return this._encodeTime(e, t);
            if ("null_" === t) return this._encodeNull();
            if ("int" === t || "enum" === t)
              return this._encodeInt(e, r.args && r.reverseArgs[0]);
            if ("bool" === t) return this._encodeBool(e);
            if ("objDesc" === t) return this._encodeStr(e, t);
            throw new Error("Unsupported tag: " + t);
          }),
          (h.prototype._isNumstr = function (t) {
            return /^[0-9 ]*$/.test(t);
          }),
          (h.prototype._isPrintstr = function (t) {
            return /^[A-Za-z0-9 '()+,-./:=?]*$/.test(t);
          });
      },
      {
        "../base/buffer": 3,
        "../base/reporter": 6,
        "minimalistic-assert": 136,
      },
    ],
    6: [
      function (t, e, r) {
        "use strict";
        const i = t("inherits");
        function n(t) {
          this._reporterState = {
            obj: null,
            path: [],
            options: t || {},
            errors: [],
          };
        }
        function o(t, e) {
          (this.path = t), this.rethrow(e);
        }
        (r.Reporter = n),
          (n.prototype.isError = function (t) {
            return t instanceof o;
          }),
          (n.prototype.save = function () {
            const t = this._reporterState;
            return { obj: t.obj, pathLen: t.path.length };
          }),
          (n.prototype.restore = function (t) {
            const e = this._reporterState;
            (e.obj = t.obj), (e.path = e.path.slice(0, t.pathLen));
          }),
          (n.prototype.enterKey = function (t) {
            return this._reporterState.path.push(t);
          }),
          (n.prototype.exitKey = function (t) {
            const e = this._reporterState;
            e.path = e.path.slice(0, t - 1);
          }),
          (n.prototype.leaveKey = function (t, e, r) {
            const i = this._reporterState;
            this.exitKey(t), null !== i.obj && (i.obj[e] = r);
          }),
          (n.prototype.path = function () {
            return this._reporterState.path.join("/");
          }),
          (n.prototype.enterObject = function () {
            const t = this._reporterState,
              e = t.obj;
            return (t.obj = {}), e;
          }),
          (n.prototype.leaveObject = function (t) {
            const e = this._reporterState,
              r = e.obj;
            return (e.obj = t), r;
          }),
          (n.prototype.error = function (t) {
            let e;
            const r = this._reporterState,
              i = t instanceof o;
            if (
              ((e = i
                ? t
                : new o(
                    r.path
                      .map(function (t) {
                        return "[" + JSON.stringify(t) + "]";
                      })
                      .join(""),
                    t.message || t,
                    t.stack
                  )),
              !r.options.partial)
            )
              throw e;
            return i || r.errors.push(e), e;
          }),
          (n.prototype.wrapResult = function (t) {
            const e = this._reporterState;
            return e.options.partial
              ? { result: this.isError(t) ? null : t, errors: e.errors }
              : t;
          }),
          i(o, Error),
          (o.prototype.rethrow = function (t) {
            if (
              ((this.message = t + " at: " + (this.path || "(shallow)")),
              Error.captureStackTrace && Error.captureStackTrace(this, o),
              !this.stack)
            )
              try {
                throw new Error(this.message);
              } catch (t) {
                this.stack = t.stack;
              }
            return this;
          });
      },
      { inherits: 132 },
    ],
    7: [
      function (t, e, r) {
        "use strict";
        function i(t) {
          const e = {};
          return (
            Object.keys(t).forEach(function (r) {
              (0 | r) == r && (r |= 0);
              const i = t[r];
              e[i] = r;
            }),
            e
          );
        }
        (r.tagClass = {
          0: "universal",
          1: "application",
          2: "context",
          3: "private",
        }),
          (r.tagClassByName = i(r.tagClass)),
          (r.tag = {
            0: "end",
            1: "bool",
            2: "int",
            3: "bitstr",
            4: "octstr",
            5: "null_",
            6: "objid",
            7: "objDesc",
            8: "external",
            9: "real",
            10: "enum",
            11: "embed",
            12: "utf8str",
            13: "relativeOid",
            16: "seq",
            17: "set",
            18: "numstr",
            19: "printstr",
            20: "t61str",
            21: "videostr",
            22: "ia5str",
            23: "utctime",
            24: "gentime",
            25: "graphstr",
            26: "iso646str",
            27: "genstr",
            28: "unistr",
            29: "charstr",
            30: "bmpstr",
          }),
          (r.tagByName = i(r.tag));
      },
      {},
    ],
    8: [
      function (t, e, r) {
        "use strict";
        const i = r;
        (i._reverse = function (t) {
          const e = {};
          return (
            Object.keys(t).forEach(function (r) {
              (0 | r) == r && (r |= 0);
              const i = t[r];
              e[i] = r;
            }),
            e
          );
        }),
          (i.der = t("./der"));
      },
      { "./der": 7 },
    ],
    9: [
      function (t, e, r) {
        "use strict";
        const i = t("inherits"),
          n = t("bn.js"),
          o = t("../base/buffer").DecoderBuffer,
          s = t("../base/node"),
          a = t("../constants/der");
        function f(t) {
          (this.enc = "der"),
            (this.name = t.name),
            (this.entity = t),
            (this.tree = new h()),
            this.tree._init(t.body);
        }
        function h(t) {
          s.call(this, "der", t);
        }
        function u(t, e) {
          let r = t.readUInt8(e);
          if (t.isError(r)) return r;
          const i = a.tagClass[r >> 6],
            n = 0 == (32 & r);
          if (31 == (31 & r)) {
            let i = r;
            for (r = 0; 128 == (128 & i); ) {
              if (((i = t.readUInt8(e)), t.isError(i))) return i;
              (r <<= 7), (r |= 127 & i);
            }
          } else r &= 31;
          return { cls: i, primitive: n, tag: r, tagStr: a.tag[r] };
        }
        function c(t, e, r) {
          let i = t.readUInt8(r);
          if (t.isError(i)) return i;
          if (!e && 128 === i) return null;
          if (0 == (128 & i)) return i;
          const n = 127 & i;
          if (n > 4) return t.error("length octect is too long");
          i = 0;
          for (let e = 0; e < n; e++) {
            i <<= 8;
            const e = t.readUInt8(r);
            if (t.isError(e)) return e;
            i |= e;
          }
          return i;
        }
        (e.exports = f),
          (f.prototype.decode = function (t, e) {
            return (
              o.isDecoderBuffer(t) || (t = new o(t, e)), this.tree._decode(t, e)
            );
          }),
          i(h, s),
          (h.prototype._peekTag = function (t, e, r) {
            if (t.isEmpty()) return !1;
            const i = t.save(),
              n = u(t, 'Failed to peek tag: "' + e + '"');
            return t.isError(n)
              ? n
              : (t.restore(i),
                n.tag === e || n.tagStr === e || n.tagStr + "of" === e || r);
          }),
          (h.prototype._decodeTag = function (t, e, r) {
            const i = u(t, 'Failed to decode tag of "' + e + '"');
            if (t.isError(i)) return i;
            let n = c(t, i.primitive, 'Failed to get length of "' + e + '"');
            if (t.isError(n)) return n;
            if (!r && i.tag !== e && i.tagStr !== e && i.tagStr + "of" !== e)
              return t.error('Failed to match tag: "' + e + '"');
            if (i.primitive || null !== n)
              return t.skip(n, 'Failed to match body of: "' + e + '"');
            const o = t.save(),
              s = this._skipUntilEnd(
                t,
                'Failed to skip indefinite length body: "' + this.tag + '"'
              );
            return t.isError(s)
              ? s
              : ((n = t.offset - o.offset),
                t.restore(o),
                t.skip(n, 'Failed to match body of: "' + e + '"'));
          }),
          (h.prototype._skipUntilEnd = function (t, e) {
            for (;;) {
              const r = u(t, e);
              if (t.isError(r)) return r;
              const i = c(t, r.primitive, e);
              if (t.isError(i)) return i;
              let n;
              if (
                ((n =
                  r.primitive || null !== i
                    ? t.skip(i)
                    : this._skipUntilEnd(t, e)),
                t.isError(n))
              )
                return n;
              if ("end" === r.tagStr) break;
            }
          }),
          (h.prototype._decodeList = function (t, e, r, i) {
            const n = [];
            for (; !t.isEmpty(); ) {
              const e = this._peekTag(t, "end");
              if (t.isError(e)) return e;
              const o = r.decode(t, "der", i);
              if (t.isError(o) && e) break;
              n.push(o);
            }
            return n;
          }),
          (h.prototype._decodeStr = function (t, e) {
            if ("bitstr" === e) {
              const e = t.readUInt8();
              return t.isError(e) ? e : { unused: e, data: t.raw() };
            }
            if ("bmpstr" === e) {
              const e = t.raw();
              if (e.length % 2 == 1)
                return t.error(
                  "Decoding of string type: bmpstr length mismatch"
                );
              let r = "";
              for (let t = 0; t < e.length / 2; t++)
                r += String.fromCharCode(e.readUInt16BE(2 * t));
              return r;
            }
            if ("numstr" === e) {
              const e = t.raw().toString("ascii");
              return this._isNumstr(e)
                ? e
                : t.error(
                    "Decoding of string type: numstr unsupported characters"
                  );
            }
            if ("octstr" === e) return t.raw();
            if ("objDesc" === e) return t.raw();
            if ("printstr" === e) {
              const e = t.raw().toString("ascii");
              return this._isPrintstr(e)
                ? e
                : t.error(
                    "Decoding of string type: printstr unsupported characters"
                  );
            }
            return /str$/.test(e)
              ? t.raw().toString()
              : t.error("Decoding of string type: " + e + " unsupported");
          }),
          (h.prototype._decodeObjid = function (t, e, r) {
            let i;
            const n = [];
            let o = 0,
              s = 0;
            for (; !t.isEmpty(); )
              (s = t.readUInt8()),
                (o <<= 7),
                (o |= 127 & s),
                0 == (128 & s) && (n.push(o), (o = 0));
            128 & s && n.push(o);
            const a = (n[0] / 40) | 0,
              f = n[0] % 40;
            if (((i = r ? n : [a, f].concat(n.slice(1))), e)) {
              let t = e[i.join(" ")];
              void 0 === t && (t = e[i.join(".")]), void 0 !== t && (i = t);
            }
            return i;
          }),
          (h.prototype._decodeTime = function (t, e) {
            const r = t.raw().toString();
            let i, n, o, s, a, f;
            if ("gentime" === e)
              (i = 0 | r.slice(0, 4)),
                (n = 0 | r.slice(4, 6)),
                (o = 0 | r.slice(6, 8)),
                (s = 0 | r.slice(8, 10)),
                (a = 0 | r.slice(10, 12)),
                (f = 0 | r.slice(12, 14));
            else {
              if ("utctime" !== e)
                return t.error("Decoding " + e + " time is not supported yet");
              (i = 0 | r.slice(0, 2)),
                (n = 0 | r.slice(2, 4)),
                (o = 0 | r.slice(4, 6)),
                (s = 0 | r.slice(6, 8)),
                (a = 0 | r.slice(8, 10)),
                (f = 0 | r.slice(10, 12)),
                (i = i < 70 ? 2e3 + i : 1900 + i);
            }
            return Date.UTC(i, n - 1, o, s, a, f, 0);
          }),
          (h.prototype._decodeNull = function () {
            return null;
          }),
          (h.prototype._decodeBool = function (t) {
            const e = t.readUInt8();
            return t.isError(e) ? e : 0 !== e;
          }),
          (h.prototype._decodeInt = function (t, e) {
            const r = t.raw();
            let i = new n(r);
            return e && (i = e[i.toString(10)] || i), i;
          }),
          (h.prototype._use = function (t, e) {
            return (
              "function" == typeof t && (t = t(e)), t._getDecoder("der").tree
            );
          });
      },
      {
        "../base/buffer": 3,
        "../base/node": 5,
        "../constants/der": 7,
        "bn.js": 15,
        inherits: 132,
      },
    ],
    10: [
      function (t, e, r) {
        "use strict";
        const i = r;
        (i.der = t("./der")), (i.pem = t("./pem"));
      },
      { "./der": 9, "./pem": 11 },
    ],
    11: [
      function (t, e, r) {
        "use strict";
        const i = t("inherits"),
          n = t("safer-buffer").Buffer,
          o = t("./der");
        function s(t) {
          o.call(this, t), (this.enc = "pem");
        }
        i(s, o),
          (e.exports = s),
          (s.prototype.decode = function (t, e) {
            const r = t.toString().split(/[\r\n]+/g),
              i = e.label.toUpperCase(),
              s = /^-----(BEGIN|END) ([^-]+)-----$/;
            let a = -1,
              f = -1;
            for (let t = 0; t < r.length; t++) {
              const e = r[t].match(s);
              if (null !== e && e[2] === i) {
                if (-1 !== a) {
                  if ("END" !== e[1]) break;
                  f = t;
                  break;
                }
                if ("BEGIN" !== e[1]) break;
                a = t;
              }
            }
            if (-1 === a || -1 === f)
              throw new Error("PEM section not found for: " + i);
            const h = r.slice(a + 1, f).join("");
            h.replace(/[^a-z0-9+/=]+/gi, "");
            const u = n.from(h, "base64");
            return o.prototype.decode.call(this, u, e);
          });
      },
      { "./der": 9, inherits: 132, "safer-buffer": 161 },
    ],
    12: [
      function (t, e, r) {
        "use strict";
        const i = t("inherits"),
          n = t("safer-buffer").Buffer,
          o = t("../base/node"),
          s = t("../constants/der");
        function a(t) {
          (this.enc = "der"),
            (this.name = t.name),
            (this.entity = t),
            (this.tree = new f()),
            this.tree._init(t.body);
        }
        function f(t) {
          o.call(this, "der", t);
        }
        function h(t) {
          return t < 10 ? "0" + t : t;
        }
        (e.exports = a),
          (a.prototype.encode = function (t, e) {
            return this.tree._encode(t, e).join();
          }),
          i(f, o),
          (f.prototype._encodeComposite = function (t, e, r, i) {
            const o = (function (t, e, r, i) {
              let n;
              "seqof" === t ? (t = "seq") : "setof" === t && (t = "set");
              if (s.tagByName.hasOwnProperty(t)) n = s.tagByName[t];
              else {
                if ("number" != typeof t || (0 | t) !== t)
                  return i.error("Unknown tag: " + t);
                n = t;
              }
              if (n >= 31)
                return i.error("Multi-octet tag encoding unsupported");
              e || (n |= 32);
              return (n |= s.tagClassByName[r || "universal"] << 6), n;
            })(t, e, r, this.reporter);
            if (i.length < 128) {
              const t = n.alloc(2);
              return (
                (t[0] = o), (t[1] = i.length), this._createEncoderBuffer([t, i])
              );
            }
            let a = 1;
            for (let t = i.length; t >= 256; t >>= 8) a++;
            const f = n.alloc(2 + a);
            (f[0] = o), (f[1] = 128 | a);
            for (let t = 1 + a, e = i.length; e > 0; t--, e >>= 8)
              f[t] = 255 & e;
            return this._createEncoderBuffer([f, i]);
          }),
          (f.prototype._encodeStr = function (t, e) {
            if ("bitstr" === e)
              return this._createEncoderBuffer([0 | t.unused, t.data]);
            if ("bmpstr" === e) {
              const e = n.alloc(2 * t.length);
              for (let r = 0; r < t.length; r++)
                e.writeUInt16BE(t.charCodeAt(r), 2 * r);
              return this._createEncoderBuffer(e);
            }
            return "numstr" === e
              ? this._isNumstr(t)
                ? this._createEncoderBuffer(t)
                : this.reporter.error(
                    "Encoding of string type: numstr supports only digits and space"
                  )
              : "printstr" === e
              ? this._isPrintstr(t)
                ? this._createEncoderBuffer(t)
                : this.reporter.error(
                    "Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark"
                  )
              : /str$/.test(e) || "objDesc" === e
              ? this._createEncoderBuffer(t)
              : this.reporter.error(
                  "Encoding of string type: " + e + " unsupported"
                );
          }),
          (f.prototype._encodeObjid = function (t, e, r) {
            if ("string" == typeof t) {
              if (!e)
                return this.reporter.error(
                  "string objid given, but no values map found"
                );
              if (!e.hasOwnProperty(t))
                return this.reporter.error("objid not found in values map");
              t = e[t].split(/[\s.]+/g);
              for (let e = 0; e < t.length; e++) t[e] |= 0;
            } else if (Array.isArray(t)) {
              t = t.slice();
              for (let e = 0; e < t.length; e++) t[e] |= 0;
            }
            if (!Array.isArray(t))
              return this.reporter.error(
                "objid() should be either array or string, got: " +
                  JSON.stringify(t)
              );
            if (!r) {
              if (t[1] >= 40)
                return this.reporter.error("Second objid identifier OOB");
              t.splice(0, 2, 40 * t[0] + t[1]);
            }
            let i = 0;
            for (let e = 0; e < t.length; e++) {
              let r = t[e];
              for (i++; r >= 128; r >>= 7) i++;
            }
            const o = n.alloc(i);
            let s = o.length - 1;
            for (let e = t.length - 1; e >= 0; e--) {
              let r = t[e];
              for (o[s--] = 127 & r; (r >>= 7) > 0; ) o[s--] = 128 | (127 & r);
            }
            return this._createEncoderBuffer(o);
          }),
          (f.prototype._encodeTime = function (t, e) {
            let r;
            const i = new Date(t);
            return (
              "gentime" === e
                ? (r = [
                    h(i.getUTCFullYear()),
                    h(i.getUTCMonth() + 1),
                    h(i.getUTCDate()),
                    h(i.getUTCHours()),
                    h(i.getUTCMinutes()),
                    h(i.getUTCSeconds()),
                    "Z",
                  ].join(""))
                : "utctime" === e
                ? (r = [
                    h(i.getUTCFullYear() % 100),
                    h(i.getUTCMonth() + 1),
                    h(i.getUTCDate()),
                    h(i.getUTCHours()),
                    h(i.getUTCMinutes()),
                    h(i.getUTCSeconds()),
                    "Z",
                  ].join(""))
                : this.reporter.error(
                    "Encoding " + e + " time is not supported yet"
                  ),
              this._encodeStr(r, "octstr")
            );
          }),
          (f.prototype._encodeNull = function () {
            return this._createEncoderBuffer("");
          }),
          (f.prototype._encodeInt = function (t, e) {
            if ("string" == typeof t) {
              if (!e)
                return this.reporter.error(
                  "String int or enum given, but no values map"
                );
              if (!e.hasOwnProperty(t))
                return this.reporter.error(
                  "Values map doesn't contain: " + JSON.stringify(t)
                );
              t = e[t];
            }
            if ("number" != typeof t && !n.isBuffer(t)) {
              const e = t.toArray();
              !t.sign && 128 & e[0] && e.unshift(0), (t = n.from(e));
            }
            if (n.isBuffer(t)) {
              let e = t.length;
              0 === t.length && e++;
              const r = n.alloc(e);
              return (
                t.copy(r),
                0 === t.length && (r[0] = 0),
                this._createEncoderBuffer(r)
              );
            }
            if (t < 128) return this._createEncoderBuffer(t);
            if (t < 256) return this._createEncoderBuffer([0, t]);
            let r = 1;
            for (let e = t; e >= 256; e >>= 8) r++;
            const i = new Array(r);
            for (let e = i.length - 1; e >= 0; e--) (i[e] = 255 & t), (t >>= 8);
            return (
              128 & i[0] && i.unshift(0), this._createEncoderBuffer(n.from(i))
            );
          }),
          (f.prototype._encodeBool = function (t) {
            return this._createEncoderBuffer(t ? 255 : 0);
          }),
          (f.prototype._use = function (t, e) {
            return (
              "function" == typeof t && (t = t(e)), t._getEncoder("der").tree
            );
          }),
          (f.prototype._skipDefault = function (t, e, r) {
            const i = this._baseState;
            let n;
            if (null === i.default) return !1;
            const o = t.join();
            if (
              (void 0 === i.defaultBuffer &&
                (i.defaultBuffer = this._encodeValue(i.default, e, r).join()),
              o.length !== i.defaultBuffer.length)
            )
              return !1;
            for (n = 0; n < o.length; n++)
              if (o[n] !== i.defaultBuffer[n]) return !1;
            return !0;
          });
      },
      {
        "../base/node": 5,
        "../constants/der": 7,
        inherits: 132,
        "safer-buffer": 161,
      },
    ],
    13: [
      function (t, e, r) {
        "use strict";
        const i = r;
        (i.der = t("./der")), (i.pem = t("./pem"));
      },
      { "./der": 12, "./pem": 14 },
    ],
    14: [
      function (t, e, r) {
        "use strict";
        const i = t("inherits"),
          n = t("./der");
        function o(t) {
          n.call(this, t), (this.enc = "pem");
        }
        i(o, n),
          (e.exports = o),
          (o.prototype.encode = function (t, e) {
            const r = n.prototype.encode.call(this, t).toString("base64"),
              i = ["-----BEGIN " + e.label + "-----"];
            for (let t = 0; t < r.length; t += 64) i.push(r.slice(t, t + 64));
            return i.push("-----END " + e.label + "-----"), i.join("\n");
          });
      },
      { "./der": 12, inherits: 132 },
    ],
    15: [
      function (t, e, r) {
        !(function (e, r) {
          "use strict";
          function i(t, e) {
            if (!t) throw new Error(e || "Assertion failed");
          }
          function n(t, e) {
            t.super_ = e;
            var r = function () {};
            (r.prototype = e.prototype),
              (t.prototype = new r()),
              (t.prototype.constructor = t);
          }
          function o(t, e, r) {
            if (o.isBN(t)) return t;
            (this.negative = 0),
              (this.words = null),
              (this.length = 0),
              (this.red = null),
              null !== t &&
                (("le" !== e && "be" !== e) || ((r = e), (e = 10)),
                this._init(t || 0, e || 10, r || "be"));
          }
          var s;
          "object" == typeof e ? (e.exports = o) : (r.BN = o),
            (o.BN = o),
            (o.wordSize = 26);
          try {
            s =
              "undefined" != typeof window && void 0 !== window.Buffer
                ? window.Buffer
                : t("buffer").Buffer;
          } catch (t) {}
          function a(t, e) {
            var r = t.charCodeAt(e);
            return r >= 65 && r <= 70
              ? r - 55
              : r >= 97 && r <= 102
              ? r - 87
              : (r - 48) & 15;
          }
          function f(t, e, r) {
            var i = a(t, r);
            return r - 1 >= e && (i |= a(t, r - 1) << 4), i;
          }
          function h(t, e, r, i) {
            for (var n = 0, o = Math.min(t.length, r), s = e; s < o; s++) {
              var a = t.charCodeAt(s) - 48;
              (n *= i),
                (n += a >= 49 ? a - 49 + 10 : a >= 17 ? a - 17 + 10 : a);
            }
            return n;
          }
          (o.isBN = function (t) {
            return (
              t instanceof o ||
              (null !== t &&
                "object" == typeof t &&
                t.constructor.wordSize === o.wordSize &&
                Array.isArray(t.words))
            );
          }),
            (o.max = function (t, e) {
              return t.cmp(e) > 0 ? t : e;
            }),
            (o.min = function (t, e) {
              return t.cmp(e) < 0 ? t : e;
            }),
            (o.prototype._init = function (t, e, r) {
              if ("number" == typeof t) return this._initNumber(t, e, r);
              if ("object" == typeof t) return this._initArray(t, e, r);
              "hex" === e && (e = 16), i(e === (0 | e) && e >= 2 && e <= 36);
              var n = 0;
              "-" === (t = t.toString().replace(/\s+/g, ""))[0] &&
                (n++, (this.negative = 1)),
                n < t.length &&
                  (16 === e
                    ? this._parseHex(t, n, r)
                    : (this._parseBase(t, e, n),
                      "le" === r && this._initArray(this.toArray(), e, r)));
            }),
            (o.prototype._initNumber = function (t, e, r) {
              t < 0 && ((this.negative = 1), (t = -t)),
                t < 67108864
                  ? ((this.words = [67108863 & t]), (this.length = 1))
                  : t < 4503599627370496
                  ? ((this.words = [67108863 & t, (t / 67108864) & 67108863]),
                    (this.length = 2))
                  : (i(t < 9007199254740992),
                    (this.words = [67108863 & t, (t / 67108864) & 67108863, 1]),
                    (this.length = 3)),
                "le" === r && this._initArray(this.toArray(), e, r);
            }),
            (o.prototype._initArray = function (t, e, r) {
              if ((i("number" == typeof t.length), t.length <= 0))
                return (this.words = [0]), (this.length = 1), this;
              (this.length = Math.ceil(t.length / 3)),
                (this.words = new Array(this.length));
              for (var n = 0; n < this.length; n++) this.words[n] = 0;
              var o,
                s,
                a = 0;
              if ("be" === r)
                for (n = t.length - 1, o = 0; n >= 0; n -= 3)
                  (s = t[n] | (t[n - 1] << 8) | (t[n - 2] << 16)),
                    (this.words[o] |= (s << a) & 67108863),
                    (this.words[o + 1] = (s >>> (26 - a)) & 67108863),
                    (a += 24) >= 26 && ((a -= 26), o++);
              else if ("le" === r)
                for (n = 0, o = 0; n < t.length; n += 3)
                  (s = t[n] | (t[n + 1] << 8) | (t[n + 2] << 16)),
                    (this.words[o] |= (s << a) & 67108863),
                    (this.words[o + 1] = (s >>> (26 - a)) & 67108863),
                    (a += 24) >= 26 && ((a -= 26), o++);
              return this.strip();
            }),
            (o.prototype._parseHex = function (t, e, r) {
              (this.length = Math.ceil((t.length - e) / 6)),
                (this.words = new Array(this.length));
              for (var i = 0; i < this.length; i++) this.words[i] = 0;
              var n,
                o = 0,
                s = 0;
              if ("be" === r)
                for (i = t.length - 1; i >= e; i -= 2)
                  (n = f(t, e, i) << o),
                    (this.words[s] |= 67108863 & n),
                    o >= 18
                      ? ((o -= 18), (s += 1), (this.words[s] |= n >>> 26))
                      : (o += 8);
              else
                for (
                  i = (t.length - e) % 2 == 0 ? e + 1 : e;
                  i < t.length;
                  i += 2
                )
                  (n = f(t, e, i) << o),
                    (this.words[s] |= 67108863 & n),
                    o >= 18
                      ? ((o -= 18), (s += 1), (this.words[s] |= n >>> 26))
                      : (o += 8);
              this.strip();
            }),
            (o.prototype._parseBase = function (t, e, r) {
              (this.words = [0]), (this.length = 1);
              for (var i = 0, n = 1; n <= 67108863; n *= e) i++;
              i--, (n = (n / e) | 0);
              for (
                var o = t.length - r,
                  s = o % i,
                  a = Math.min(o, o - s) + r,
                  f = 0,
                  u = r;
                u < a;
                u += i
              )
                (f = h(t, u, u + i, e)),
                  this.imuln(n),
                  this.words[0] + f < 67108864
                    ? (this.words[0] += f)
                    : this._iaddn(f);
              if (0 !== s) {
                var c = 1;
                for (f = h(t, u, t.length, e), u = 0; u < s; u++) c *= e;
                this.imuln(c),
                  this.words[0] + f < 67108864
                    ? (this.words[0] += f)
                    : this._iaddn(f);
              }
              this.strip();
            }),
            (o.prototype.copy = function (t) {
              t.words = new Array(this.length);
              for (var e = 0; e < this.length; e++) t.words[e] = this.words[e];
              (t.length = this.length),
                (t.negative = this.negative),
                (t.red = this.red);
            }),
            (o.prototype.clone = function () {
              var t = new o(null);
              return this.copy(t), t;
            }),
            (o.prototype._expand = function (t) {
              for (; this.length < t; ) this.words[this.length++] = 0;
              return this;
            }),
            (o.prototype.strip = function () {
              for (; this.length > 1 && 0 === this.words[this.length - 1]; )
                this.length--;
              return this._normSign();
            }),
            (o.prototype._normSign = function () {
              return (
                1 === this.length && 0 === this.words[0] && (this.negative = 0),
                this
              );
            }),
            (o.prototype.inspect = function () {
              return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
            });
          var u = [
              "",
              "0",
              "00",
              "000",
              "0000",
              "00000",
              "000000",
              "0000000",
              "00000000",
              "000000000",
              "0000000000",
              "00000000000",
              "000000000000",
              "0000000000000",
              "00000000000000",
              "000000000000000",
              "0000000000000000",
              "00000000000000000",
              "000000000000000000",
              "0000000000000000000",
              "00000000000000000000",
              "000000000000000000000",
              "0000000000000000000000",
              "00000000000000000000000",
              "000000000000000000000000",
              "0000000000000000000000000",
            ],
            c = [
              0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6,
              6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
            ],
            d = [
              0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607,
              16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536,
              11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101,
              5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368,
              20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875,
              60466176,
            ];
          function l(t, e, r) {
            r.negative = e.negative ^ t.negative;
            var i = (t.length + e.length) | 0;
            (r.length = i), (i = (i - 1) | 0);
            var n = 0 | t.words[0],
              o = 0 | e.words[0],
              s = n * o,
              a = 67108863 & s,
              f = (s / 67108864) | 0;
            r.words[0] = a;
            for (var h = 1; h < i; h++) {
              for (
                var u = f >>> 26,
                  c = 67108863 & f,
                  d = Math.min(h, e.length - 1),
                  l = Math.max(0, h - t.length + 1);
                l <= d;
                l++
              ) {
                var p = (h - l) | 0;
                (u +=
                  ((s = (n = 0 | t.words[p]) * (o = 0 | e.words[l]) + c) /
                    67108864) |
                  0),
                  (c = 67108863 & s);
              }
              (r.words[h] = 0 | c), (f = 0 | u);
            }
            return 0 !== f ? (r.words[h] = 0 | f) : r.length--, r.strip();
          }
          (o.prototype.toString = function (t, e) {
            var r;
            if (((e = 0 | e || 1), 16 === (t = t || 10) || "hex" === t)) {
              r = "";
              for (var n = 0, o = 0, s = 0; s < this.length; s++) {
                var a = this.words[s],
                  f = (16777215 & ((a << n) | o)).toString(16);
                (r =
                  0 !== (o = (a >>> (24 - n)) & 16777215) ||
                  s !== this.length - 1
                    ? u[6 - f.length] + f + r
                    : f + r),
                  (n += 2) >= 26 && ((n -= 26), s--);
              }
              for (0 !== o && (r = o.toString(16) + r); r.length % e != 0; )
                r = "0" + r;
              return 0 !== this.negative && (r = "-" + r), r;
            }
            if (t === (0 | t) && t >= 2 && t <= 36) {
              var h = c[t],
                l = d[t];
              r = "";
              var p = this.clone();
              for (p.negative = 0; !p.isZero(); ) {
                var b = p.modn(l).toString(t);
                r = (p = p.idivn(l)).isZero() ? b + r : u[h - b.length] + b + r;
              }
              for (this.isZero() && (r = "0" + r); r.length % e != 0; )
                r = "0" + r;
              return 0 !== this.negative && (r = "-" + r), r;
            }
            i(!1, "Base should be between 2 and 36");
          }),
            (o.prototype.toNumber = function () {
              var t = this.words[0];
              return (
                2 === this.length
                  ? (t += 67108864 * this.words[1])
                  : 3 === this.length && 1 === this.words[2]
                  ? (t += 4503599627370496 + 67108864 * this.words[1])
                  : this.length > 2 &&
                    i(!1, "Number can only safely store up to 53 bits"),
                0 !== this.negative ? -t : t
              );
            }),
            (o.prototype.toJSON = function () {
              return this.toString(16);
            }),
            (o.prototype.toBuffer = function (t, e) {
              return i(void 0 !== s), this.toArrayLike(s, t, e);
            }),
            (o.prototype.toArray = function (t, e) {
              return this.toArrayLike(Array, t, e);
            }),
            (o.prototype.toArrayLike = function (t, e, r) {
              var n = this.byteLength(),
                o = r || Math.max(1, n);
              i(n <= o, "byte array longer than desired length"),
                i(o > 0, "Requested array length <= 0"),
                this.strip();
              var s,
                a,
                f = "le" === e,
                h = new t(o),
                u = this.clone();
              if (f) {
                for (a = 0; !u.isZero(); a++)
                  (s = u.andln(255)), u.iushrn(8), (h[a] = s);
                for (; a < o; a++) h[a] = 0;
              } else {
                for (a = 0; a < o - n; a++) h[a] = 0;
                for (a = 0; !u.isZero(); a++)
                  (s = u.andln(255)), u.iushrn(8), (h[o - a - 1] = s);
              }
              return h;
            }),
            Math.clz32
              ? (o.prototype._countBits = function (t) {
                  return 32 - Math.clz32(t);
                })
              : (o.prototype._countBits = function (t) {
                  var e = t,
                    r = 0;
                  return (
                    e >= 4096 && ((r += 13), (e >>>= 13)),
                    e >= 64 && ((r += 7), (e >>>= 7)),
                    e >= 8 && ((r += 4), (e >>>= 4)),
                    e >= 2 && ((r += 2), (e >>>= 2)),
                    r + e
                  );
                }),
            (o.prototype._zeroBits = function (t) {
              if (0 === t) return 26;
              var e = t,
                r = 0;
              return (
                0 == (8191 & e) && ((r += 13), (e >>>= 13)),
                0 == (127 & e) && ((r += 7), (e >>>= 7)),
                0 == (15 & e) && ((r += 4), (e >>>= 4)),
                0 == (3 & e) && ((r += 2), (e >>>= 2)),
                0 == (1 & e) && r++,
                r
              );
            }),
            (o.prototype.bitLength = function () {
              var t = this.words[this.length - 1],
                e = this._countBits(t);
              return 26 * (this.length - 1) + e;
            }),
            (o.prototype.zeroBits = function () {
              if (this.isZero()) return 0;
              for (var t = 0, e = 0; e < this.length; e++) {
                var r = this._zeroBits(this.words[e]);
                if (((t += r), 26 !== r)) break;
              }
              return t;
            }),
            (o.prototype.byteLength = function () {
              return Math.ceil(this.bitLength() / 8);
            }),
            (o.prototype.toTwos = function (t) {
              return 0 !== this.negative
                ? this.abs().inotn(t).iaddn(1)
                : this.clone();
            }),
            (o.prototype.fromTwos = function (t) {
              return this.testn(t - 1)
                ? this.notn(t).iaddn(1).ineg()
                : this.clone();
            }),
            (o.prototype.isNeg = function () {
              return 0 !== this.negative;
            }),
            (o.prototype.neg = function () {
              return this.clone().ineg();
            }),
            (o.prototype.ineg = function () {
              return this.isZero() || (this.negative ^= 1), this;
            }),
            (o.prototype.iuor = function (t) {
              for (; this.length < t.length; ) this.words[this.length++] = 0;
              for (var e = 0; e < t.length; e++)
                this.words[e] = this.words[e] | t.words[e];
              return this.strip();
            }),
            (o.prototype.ior = function (t) {
              return i(0 == (this.negative | t.negative)), this.iuor(t);
            }),
            (o.prototype.or = function (t) {
              return this.length > t.length
                ? this.clone().ior(t)
                : t.clone().ior(this);
            }),
            (o.prototype.uor = function (t) {
              return this.length > t.length
                ? this.clone().iuor(t)
                : t.clone().iuor(this);
            }),
            (o.prototype.iuand = function (t) {
              var e;
              e = this.length > t.length ? t : this;
              for (var r = 0; r < e.length; r++)
                this.words[r] = this.words[r] & t.words[r];
              return (this.length = e.length), this.strip();
            }),
            (o.prototype.iand = function (t) {
              return i(0 == (this.negative | t.negative)), this.iuand(t);
            }),
            (o.prototype.and = function (t) {
              return this.length > t.length
                ? this.clone().iand(t)
                : t.clone().iand(this);
            }),
            (o.prototype.uand = function (t) {
              return this.length > t.length
                ? this.clone().iuand(t)
                : t.clone().iuand(this);
            }),
            (o.prototype.iuxor = function (t) {
              var e, r;
              this.length > t.length
                ? ((e = this), (r = t))
                : ((e = t), (r = this));
              for (var i = 0; i < r.length; i++)
                this.words[i] = e.words[i] ^ r.words[i];
              if (this !== e)
                for (; i < e.length; i++) this.words[i] = e.words[i];
              return (this.length = e.length), this.strip();
            }),
            (o.prototype.ixor = function (t) {
              return i(0 == (this.negative | t.negative)), this.iuxor(t);
            }),
            (o.prototype.xor = function (t) {
              return this.length > t.length
                ? this.clone().ixor(t)
                : t.clone().ixor(this);
            }),
            (o.prototype.uxor = function (t) {
              return this.length > t.length
                ? this.clone().iuxor(t)
                : t.clone().iuxor(this);
            }),
            (o.prototype.inotn = function (t) {
              i("number" == typeof t && t >= 0);
              var e = 0 | Math.ceil(t / 26),
                r = t % 26;
              this._expand(e), r > 0 && e--;
              for (var n = 0; n < e; n++)
                this.words[n] = 67108863 & ~this.words[n];
              return (
                r > 0 &&
                  (this.words[n] = ~this.words[n] & (67108863 >> (26 - r))),
                this.strip()
              );
            }),
            (o.prototype.notn = function (t) {
              return this.clone().inotn(t);
            }),
            (o.prototype.setn = function (t, e) {
              i("number" == typeof t && t >= 0);
              var r = (t / 26) | 0,
                n = t % 26;
              return (
                this._expand(r + 1),
                (this.words[r] = e
                  ? this.words[r] | (1 << n)
                  : this.words[r] & ~(1 << n)),
                this.strip()
              );
            }),
            (o.prototype.iadd = function (t) {
              var e, r, i;
              if (0 !== this.negative && 0 === t.negative)
                return (
                  (this.negative = 0),
                  (e = this.isub(t)),
                  (this.negative ^= 1),
                  this._normSign()
                );
              if (0 === this.negative && 0 !== t.negative)
                return (
                  (t.negative = 0),
                  (e = this.isub(t)),
                  (t.negative = 1),
                  e._normSign()
                );
              this.length > t.length
                ? ((r = this), (i = t))
                : ((r = t), (i = this));
              for (var n = 0, o = 0; o < i.length; o++)
                (e = (0 | r.words[o]) + (0 | i.words[o]) + n),
                  (this.words[o] = 67108863 & e),
                  (n = e >>> 26);
              for (; 0 !== n && o < r.length; o++)
                (e = (0 | r.words[o]) + n),
                  (this.words[o] = 67108863 & e),
                  (n = e >>> 26);
              if (((this.length = r.length), 0 !== n))
                (this.words[this.length] = n), this.length++;
              else if (r !== this)
                for (; o < r.length; o++) this.words[o] = r.words[o];
              return this;
            }),
            (o.prototype.add = function (t) {
              var e;
              return 0 !== t.negative && 0 === this.negative
                ? ((t.negative = 0), (e = this.sub(t)), (t.negative ^= 1), e)
                : 0 === t.negative && 0 !== this.negative
                ? ((this.negative = 0),
                  (e = t.sub(this)),
                  (this.negative = 1),
                  e)
                : this.length > t.length
                ? this.clone().iadd(t)
                : t.clone().iadd(this);
            }),
            (o.prototype.isub = function (t) {
              if (0 !== t.negative) {
                t.negative = 0;
                var e = this.iadd(t);
                return (t.negative = 1), e._normSign();
              }
              if (0 !== this.negative)
                return (
                  (this.negative = 0),
                  this.iadd(t),
                  (this.negative = 1),
                  this._normSign()
                );
              var r,
                i,
                n = this.cmp(t);
              if (0 === n)
                return (
                  (this.negative = 0),
                  (this.length = 1),
                  (this.words[0] = 0),
                  this
                );
              n > 0 ? ((r = this), (i = t)) : ((r = t), (i = this));
              for (var o = 0, s = 0; s < i.length; s++)
                (o = (e = (0 | r.words[s]) - (0 | i.words[s]) + o) >> 26),
                  (this.words[s] = 67108863 & e);
              for (; 0 !== o && s < r.length; s++)
                (o = (e = (0 | r.words[s]) + o) >> 26),
                  (this.words[s] = 67108863 & e);
              if (0 === o && s < r.length && r !== this)
                for (; s < r.length; s++) this.words[s] = r.words[s];
              return (
                (this.length = Math.max(this.length, s)),
                r !== this && (this.negative = 1),
                this.strip()
              );
            }),
            (o.prototype.sub = function (t) {
              return this.clone().isub(t);
            });
          var p = function (t, e, r) {
            var i,
              n,
              o,
              s = t.words,
              a = e.words,
              f = r.words,
              h = 0,
              u = 0 | s[0],
              c = 8191 & u,
              d = u >>> 13,
              l = 0 | s[1],
              p = 8191 & l,
              b = l >>> 13,
              m = 0 | s[2],
              y = 8191 & m,
              g = m >>> 13,
              v = 0 | s[3],
              w = 8191 & v,
              _ = v >>> 13,
              M = 0 | s[4],
              S = 8191 & M,
              E = M >>> 13,
              A = 0 | s[5],
              k = 8191 & A,
              B = A >>> 13,
              x = 0 | s[6],
              I = 8191 & x,
              R = x >>> 13,
              j = 0 | s[7],
              T = 8191 & j,
              L = j >>> 13,
              C = 0 | s[8],
              P = 8191 & C,
              O = C >>> 13,
              U = 0 | s[9],
              D = 8191 & U,
              N = U >>> 13,
              q = 0 | a[0],
              z = 8191 & q,
              F = q >>> 13,
              K = 0 | a[1],
              H = 8191 & K,
              W = K >>> 13,
              V = 0 | a[2],
              Z = 8191 & V,
              G = V >>> 13,
              X = 0 | a[3],
              Y = 8191 & X,
              $ = X >>> 13,
              J = 0 | a[4],
              Q = 8191 & J,
              tt = J >>> 13,
              et = 0 | a[5],
              rt = 8191 & et,
              it = et >>> 13,
              nt = 0 | a[6],
              ot = 8191 & nt,
              st = nt >>> 13,
              at = 0 | a[7],
              ft = 8191 & at,
              ht = at >>> 13,
              ut = 0 | a[8],
              ct = 8191 & ut,
              dt = ut >>> 13,
              lt = 0 | a[9],
              pt = 8191 & lt,
              bt = lt >>> 13;
            (r.negative = t.negative ^ e.negative), (r.length = 19);
            var mt =
              (((h + (i = Math.imul(c, z))) | 0) +
                ((8191 & (n = ((n = Math.imul(c, F)) + Math.imul(d, z)) | 0)) <<
                  13)) |
              0;
            (h =
              ((((o = Math.imul(d, F)) + (n >>> 13)) | 0) + (mt >>> 26)) | 0),
              (mt &= 67108863),
              (i = Math.imul(p, z)),
              (n = ((n = Math.imul(p, F)) + Math.imul(b, z)) | 0),
              (o = Math.imul(b, F));
            var yt =
              (((h + (i = (i + Math.imul(c, H)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, W)) | 0) + Math.imul(d, H)) | 0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, W)) | 0) + (n >>> 13)) | 0) +
                (yt >>> 26)) |
              0),
              (yt &= 67108863),
              (i = Math.imul(y, z)),
              (n = ((n = Math.imul(y, F)) + Math.imul(g, z)) | 0),
              (o = Math.imul(g, F)),
              (i = (i + Math.imul(p, H)) | 0),
              (n = ((n = (n + Math.imul(p, W)) | 0) + Math.imul(b, H)) | 0),
              (o = (o + Math.imul(b, W)) | 0);
            var gt =
              (((h + (i = (i + Math.imul(c, Z)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, G)) | 0) + Math.imul(d, Z)) | 0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, G)) | 0) + (n >>> 13)) | 0) +
                (gt >>> 26)) |
              0),
              (gt &= 67108863),
              (i = Math.imul(w, z)),
              (n = ((n = Math.imul(w, F)) + Math.imul(_, z)) | 0),
              (o = Math.imul(_, F)),
              (i = (i + Math.imul(y, H)) | 0),
              (n = ((n = (n + Math.imul(y, W)) | 0) + Math.imul(g, H)) | 0),
              (o = (o + Math.imul(g, W)) | 0),
              (i = (i + Math.imul(p, Z)) | 0),
              (n = ((n = (n + Math.imul(p, G)) | 0) + Math.imul(b, Z)) | 0),
              (o = (o + Math.imul(b, G)) | 0);
            var vt =
              (((h + (i = (i + Math.imul(c, Y)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, $)) | 0) + Math.imul(d, Y)) | 0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, $)) | 0) + (n >>> 13)) | 0) +
                (vt >>> 26)) |
              0),
              (vt &= 67108863),
              (i = Math.imul(S, z)),
              (n = ((n = Math.imul(S, F)) + Math.imul(E, z)) | 0),
              (o = Math.imul(E, F)),
              (i = (i + Math.imul(w, H)) | 0),
              (n = ((n = (n + Math.imul(w, W)) | 0) + Math.imul(_, H)) | 0),
              (o = (o + Math.imul(_, W)) | 0),
              (i = (i + Math.imul(y, Z)) | 0),
              (n = ((n = (n + Math.imul(y, G)) | 0) + Math.imul(g, Z)) | 0),
              (o = (o + Math.imul(g, G)) | 0),
              (i = (i + Math.imul(p, Y)) | 0),
              (n = ((n = (n + Math.imul(p, $)) | 0) + Math.imul(b, Y)) | 0),
              (o = (o + Math.imul(b, $)) | 0);
            var wt =
              (((h + (i = (i + Math.imul(c, Q)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, tt)) | 0) + Math.imul(d, Q)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, tt)) | 0) + (n >>> 13)) | 0) +
                (wt >>> 26)) |
              0),
              (wt &= 67108863),
              (i = Math.imul(k, z)),
              (n = ((n = Math.imul(k, F)) + Math.imul(B, z)) | 0),
              (o = Math.imul(B, F)),
              (i = (i + Math.imul(S, H)) | 0),
              (n = ((n = (n + Math.imul(S, W)) | 0) + Math.imul(E, H)) | 0),
              (o = (o + Math.imul(E, W)) | 0),
              (i = (i + Math.imul(w, Z)) | 0),
              (n = ((n = (n + Math.imul(w, G)) | 0) + Math.imul(_, Z)) | 0),
              (o = (o + Math.imul(_, G)) | 0),
              (i = (i + Math.imul(y, Y)) | 0),
              (n = ((n = (n + Math.imul(y, $)) | 0) + Math.imul(g, Y)) | 0),
              (o = (o + Math.imul(g, $)) | 0),
              (i = (i + Math.imul(p, Q)) | 0),
              (n = ((n = (n + Math.imul(p, tt)) | 0) + Math.imul(b, Q)) | 0),
              (o = (o + Math.imul(b, tt)) | 0);
            var _t =
              (((h + (i = (i + Math.imul(c, rt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, it)) | 0) + Math.imul(d, rt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, it)) | 0) + (n >>> 13)) | 0) +
                (_t >>> 26)) |
              0),
              (_t &= 67108863),
              (i = Math.imul(I, z)),
              (n = ((n = Math.imul(I, F)) + Math.imul(R, z)) | 0),
              (o = Math.imul(R, F)),
              (i = (i + Math.imul(k, H)) | 0),
              (n = ((n = (n + Math.imul(k, W)) | 0) + Math.imul(B, H)) | 0),
              (o = (o + Math.imul(B, W)) | 0),
              (i = (i + Math.imul(S, Z)) | 0),
              (n = ((n = (n + Math.imul(S, G)) | 0) + Math.imul(E, Z)) | 0),
              (o = (o + Math.imul(E, G)) | 0),
              (i = (i + Math.imul(w, Y)) | 0),
              (n = ((n = (n + Math.imul(w, $)) | 0) + Math.imul(_, Y)) | 0),
              (o = (o + Math.imul(_, $)) | 0),
              (i = (i + Math.imul(y, Q)) | 0),
              (n = ((n = (n + Math.imul(y, tt)) | 0) + Math.imul(g, Q)) | 0),
              (o = (o + Math.imul(g, tt)) | 0),
              (i = (i + Math.imul(p, rt)) | 0),
              (n = ((n = (n + Math.imul(p, it)) | 0) + Math.imul(b, rt)) | 0),
              (o = (o + Math.imul(b, it)) | 0);
            var Mt =
              (((h + (i = (i + Math.imul(c, ot)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, st)) | 0) + Math.imul(d, ot)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, st)) | 0) + (n >>> 13)) | 0) +
                (Mt >>> 26)) |
              0),
              (Mt &= 67108863),
              (i = Math.imul(T, z)),
              (n = ((n = Math.imul(T, F)) + Math.imul(L, z)) | 0),
              (o = Math.imul(L, F)),
              (i = (i + Math.imul(I, H)) | 0),
              (n = ((n = (n + Math.imul(I, W)) | 0) + Math.imul(R, H)) | 0),
              (o = (o + Math.imul(R, W)) | 0),
              (i = (i + Math.imul(k, Z)) | 0),
              (n = ((n = (n + Math.imul(k, G)) | 0) + Math.imul(B, Z)) | 0),
              (o = (o + Math.imul(B, G)) | 0),
              (i = (i + Math.imul(S, Y)) | 0),
              (n = ((n = (n + Math.imul(S, $)) | 0) + Math.imul(E, Y)) | 0),
              (o = (o + Math.imul(E, $)) | 0),
              (i = (i + Math.imul(w, Q)) | 0),
              (n = ((n = (n + Math.imul(w, tt)) | 0) + Math.imul(_, Q)) | 0),
              (o = (o + Math.imul(_, tt)) | 0),
              (i = (i + Math.imul(y, rt)) | 0),
              (n = ((n = (n + Math.imul(y, it)) | 0) + Math.imul(g, rt)) | 0),
              (o = (o + Math.imul(g, it)) | 0),
              (i = (i + Math.imul(p, ot)) | 0),
              (n = ((n = (n + Math.imul(p, st)) | 0) + Math.imul(b, ot)) | 0),
              (o = (o + Math.imul(b, st)) | 0);
            var St =
              (((h + (i = (i + Math.imul(c, ft)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, ht)) | 0) + Math.imul(d, ft)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, ht)) | 0) + (n >>> 13)) | 0) +
                (St >>> 26)) |
              0),
              (St &= 67108863),
              (i = Math.imul(P, z)),
              (n = ((n = Math.imul(P, F)) + Math.imul(O, z)) | 0),
              (o = Math.imul(O, F)),
              (i = (i + Math.imul(T, H)) | 0),
              (n = ((n = (n + Math.imul(T, W)) | 0) + Math.imul(L, H)) | 0),
              (o = (o + Math.imul(L, W)) | 0),
              (i = (i + Math.imul(I, Z)) | 0),
              (n = ((n = (n + Math.imul(I, G)) | 0) + Math.imul(R, Z)) | 0),
              (o = (o + Math.imul(R, G)) | 0),
              (i = (i + Math.imul(k, Y)) | 0),
              (n = ((n = (n + Math.imul(k, $)) | 0) + Math.imul(B, Y)) | 0),
              (o = (o + Math.imul(B, $)) | 0),
              (i = (i + Math.imul(S, Q)) | 0),
              (n = ((n = (n + Math.imul(S, tt)) | 0) + Math.imul(E, Q)) | 0),
              (o = (o + Math.imul(E, tt)) | 0),
              (i = (i + Math.imul(w, rt)) | 0),
              (n = ((n = (n + Math.imul(w, it)) | 0) + Math.imul(_, rt)) | 0),
              (o = (o + Math.imul(_, it)) | 0),
              (i = (i + Math.imul(y, ot)) | 0),
              (n = ((n = (n + Math.imul(y, st)) | 0) + Math.imul(g, ot)) | 0),
              (o = (o + Math.imul(g, st)) | 0),
              (i = (i + Math.imul(p, ft)) | 0),
              (n = ((n = (n + Math.imul(p, ht)) | 0) + Math.imul(b, ft)) | 0),
              (o = (o + Math.imul(b, ht)) | 0);
            var Et =
              (((h + (i = (i + Math.imul(c, ct)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, dt)) | 0) + Math.imul(d, ct)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, dt)) | 0) + (n >>> 13)) | 0) +
                (Et >>> 26)) |
              0),
              (Et &= 67108863),
              (i = Math.imul(D, z)),
              (n = ((n = Math.imul(D, F)) + Math.imul(N, z)) | 0),
              (o = Math.imul(N, F)),
              (i = (i + Math.imul(P, H)) | 0),
              (n = ((n = (n + Math.imul(P, W)) | 0) + Math.imul(O, H)) | 0),
              (o = (o + Math.imul(O, W)) | 0),
              (i = (i + Math.imul(T, Z)) | 0),
              (n = ((n = (n + Math.imul(T, G)) | 0) + Math.imul(L, Z)) | 0),
              (o = (o + Math.imul(L, G)) | 0),
              (i = (i + Math.imul(I, Y)) | 0),
              (n = ((n = (n + Math.imul(I, $)) | 0) + Math.imul(R, Y)) | 0),
              (o = (o + Math.imul(R, $)) | 0),
              (i = (i + Math.imul(k, Q)) | 0),
              (n = ((n = (n + Math.imul(k, tt)) | 0) + Math.imul(B, Q)) | 0),
              (o = (o + Math.imul(B, tt)) | 0),
              (i = (i + Math.imul(S, rt)) | 0),
              (n = ((n = (n + Math.imul(S, it)) | 0) + Math.imul(E, rt)) | 0),
              (o = (o + Math.imul(E, it)) | 0),
              (i = (i + Math.imul(w, ot)) | 0),
              (n = ((n = (n + Math.imul(w, st)) | 0) + Math.imul(_, ot)) | 0),
              (o = (o + Math.imul(_, st)) | 0),
              (i = (i + Math.imul(y, ft)) | 0),
              (n = ((n = (n + Math.imul(y, ht)) | 0) + Math.imul(g, ft)) | 0),
              (o = (o + Math.imul(g, ht)) | 0),
              (i = (i + Math.imul(p, ct)) | 0),
              (n = ((n = (n + Math.imul(p, dt)) | 0) + Math.imul(b, ct)) | 0),
              (o = (o + Math.imul(b, dt)) | 0);
            var At =
              (((h + (i = (i + Math.imul(c, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, bt)) | 0) + Math.imul(d, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, bt)) | 0) + (n >>> 13)) | 0) +
                (At >>> 26)) |
              0),
              (At &= 67108863),
              (i = Math.imul(D, H)),
              (n = ((n = Math.imul(D, W)) + Math.imul(N, H)) | 0),
              (o = Math.imul(N, W)),
              (i = (i + Math.imul(P, Z)) | 0),
              (n = ((n = (n + Math.imul(P, G)) | 0) + Math.imul(O, Z)) | 0),
              (o = (o + Math.imul(O, G)) | 0),
              (i = (i + Math.imul(T, Y)) | 0),
              (n = ((n = (n + Math.imul(T, $)) | 0) + Math.imul(L, Y)) | 0),
              (o = (o + Math.imul(L, $)) | 0),
              (i = (i + Math.imul(I, Q)) | 0),
              (n = ((n = (n + Math.imul(I, tt)) | 0) + Math.imul(R, Q)) | 0),
              (o = (o + Math.imul(R, tt)) | 0),
              (i = (i + Math.imul(k, rt)) | 0),
              (n = ((n = (n + Math.imul(k, it)) | 0) + Math.imul(B, rt)) | 0),
              (o = (o + Math.imul(B, it)) | 0),
              (i = (i + Math.imul(S, ot)) | 0),
              (n = ((n = (n + Math.imul(S, st)) | 0) + Math.imul(E, ot)) | 0),
              (o = (o + Math.imul(E, st)) | 0),
              (i = (i + Math.imul(w, ft)) | 0),
              (n = ((n = (n + Math.imul(w, ht)) | 0) + Math.imul(_, ft)) | 0),
              (o = (o + Math.imul(_, ht)) | 0),
              (i = (i + Math.imul(y, ct)) | 0),
              (n = ((n = (n + Math.imul(y, dt)) | 0) + Math.imul(g, ct)) | 0),
              (o = (o + Math.imul(g, dt)) | 0);
            var kt =
              (((h + (i = (i + Math.imul(p, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(p, bt)) | 0) + Math.imul(b, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(b, bt)) | 0) + (n >>> 13)) | 0) +
                (kt >>> 26)) |
              0),
              (kt &= 67108863),
              (i = Math.imul(D, Z)),
              (n = ((n = Math.imul(D, G)) + Math.imul(N, Z)) | 0),
              (o = Math.imul(N, G)),
              (i = (i + Math.imul(P, Y)) | 0),
              (n = ((n = (n + Math.imul(P, $)) | 0) + Math.imul(O, Y)) | 0),
              (o = (o + Math.imul(O, $)) | 0),
              (i = (i + Math.imul(T, Q)) | 0),
              (n = ((n = (n + Math.imul(T, tt)) | 0) + Math.imul(L, Q)) | 0),
              (o = (o + Math.imul(L, tt)) | 0),
              (i = (i + Math.imul(I, rt)) | 0),
              (n = ((n = (n + Math.imul(I, it)) | 0) + Math.imul(R, rt)) | 0),
              (o = (o + Math.imul(R, it)) | 0),
              (i = (i + Math.imul(k, ot)) | 0),
              (n = ((n = (n + Math.imul(k, st)) | 0) + Math.imul(B, ot)) | 0),
              (o = (o + Math.imul(B, st)) | 0),
              (i = (i + Math.imul(S, ft)) | 0),
              (n = ((n = (n + Math.imul(S, ht)) | 0) + Math.imul(E, ft)) | 0),
              (o = (o + Math.imul(E, ht)) | 0),
              (i = (i + Math.imul(w, ct)) | 0),
              (n = ((n = (n + Math.imul(w, dt)) | 0) + Math.imul(_, ct)) | 0),
              (o = (o + Math.imul(_, dt)) | 0);
            var Bt =
              (((h + (i = (i + Math.imul(y, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(y, bt)) | 0) + Math.imul(g, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(g, bt)) | 0) + (n >>> 13)) | 0) +
                (Bt >>> 26)) |
              0),
              (Bt &= 67108863),
              (i = Math.imul(D, Y)),
              (n = ((n = Math.imul(D, $)) + Math.imul(N, Y)) | 0),
              (o = Math.imul(N, $)),
              (i = (i + Math.imul(P, Q)) | 0),
              (n = ((n = (n + Math.imul(P, tt)) | 0) + Math.imul(O, Q)) | 0),
              (o = (o + Math.imul(O, tt)) | 0),
              (i = (i + Math.imul(T, rt)) | 0),
              (n = ((n = (n + Math.imul(T, it)) | 0) + Math.imul(L, rt)) | 0),
              (o = (o + Math.imul(L, it)) | 0),
              (i = (i + Math.imul(I, ot)) | 0),
              (n = ((n = (n + Math.imul(I, st)) | 0) + Math.imul(R, ot)) | 0),
              (o = (o + Math.imul(R, st)) | 0),
              (i = (i + Math.imul(k, ft)) | 0),
              (n = ((n = (n + Math.imul(k, ht)) | 0) + Math.imul(B, ft)) | 0),
              (o = (o + Math.imul(B, ht)) | 0),
              (i = (i + Math.imul(S, ct)) | 0),
              (n = ((n = (n + Math.imul(S, dt)) | 0) + Math.imul(E, ct)) | 0),
              (o = (o + Math.imul(E, dt)) | 0);
            var xt =
              (((h + (i = (i + Math.imul(w, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(w, bt)) | 0) + Math.imul(_, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(_, bt)) | 0) + (n >>> 13)) | 0) +
                (xt >>> 26)) |
              0),
              (xt &= 67108863),
              (i = Math.imul(D, Q)),
              (n = ((n = Math.imul(D, tt)) + Math.imul(N, Q)) | 0),
              (o = Math.imul(N, tt)),
              (i = (i + Math.imul(P, rt)) | 0),
              (n = ((n = (n + Math.imul(P, it)) | 0) + Math.imul(O, rt)) | 0),
              (o = (o + Math.imul(O, it)) | 0),
              (i = (i + Math.imul(T, ot)) | 0),
              (n = ((n = (n + Math.imul(T, st)) | 0) + Math.imul(L, ot)) | 0),
              (o = (o + Math.imul(L, st)) | 0),
              (i = (i + Math.imul(I, ft)) | 0),
              (n = ((n = (n + Math.imul(I, ht)) | 0) + Math.imul(R, ft)) | 0),
              (o = (o + Math.imul(R, ht)) | 0),
              (i = (i + Math.imul(k, ct)) | 0),
              (n = ((n = (n + Math.imul(k, dt)) | 0) + Math.imul(B, ct)) | 0),
              (o = (o + Math.imul(B, dt)) | 0);
            var It =
              (((h + (i = (i + Math.imul(S, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(S, bt)) | 0) + Math.imul(E, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(E, bt)) | 0) + (n >>> 13)) | 0) +
                (It >>> 26)) |
              0),
              (It &= 67108863),
              (i = Math.imul(D, rt)),
              (n = ((n = Math.imul(D, it)) + Math.imul(N, rt)) | 0),
              (o = Math.imul(N, it)),
              (i = (i + Math.imul(P, ot)) | 0),
              (n = ((n = (n + Math.imul(P, st)) | 0) + Math.imul(O, ot)) | 0),
              (o = (o + Math.imul(O, st)) | 0),
              (i = (i + Math.imul(T, ft)) | 0),
              (n = ((n = (n + Math.imul(T, ht)) | 0) + Math.imul(L, ft)) | 0),
              (o = (o + Math.imul(L, ht)) | 0),
              (i = (i + Math.imul(I, ct)) | 0),
              (n = ((n = (n + Math.imul(I, dt)) | 0) + Math.imul(R, ct)) | 0),
              (o = (o + Math.imul(R, dt)) | 0);
            var Rt =
              (((h + (i = (i + Math.imul(k, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(k, bt)) | 0) + Math.imul(B, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(B, bt)) | 0) + (n >>> 13)) | 0) +
                (Rt >>> 26)) |
              0),
              (Rt &= 67108863),
              (i = Math.imul(D, ot)),
              (n = ((n = Math.imul(D, st)) + Math.imul(N, ot)) | 0),
              (o = Math.imul(N, st)),
              (i = (i + Math.imul(P, ft)) | 0),
              (n = ((n = (n + Math.imul(P, ht)) | 0) + Math.imul(O, ft)) | 0),
              (o = (o + Math.imul(O, ht)) | 0),
              (i = (i + Math.imul(T, ct)) | 0),
              (n = ((n = (n + Math.imul(T, dt)) | 0) + Math.imul(L, ct)) | 0),
              (o = (o + Math.imul(L, dt)) | 0);
            var jt =
              (((h + (i = (i + Math.imul(I, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(I, bt)) | 0) + Math.imul(R, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(R, bt)) | 0) + (n >>> 13)) | 0) +
                (jt >>> 26)) |
              0),
              (jt &= 67108863),
              (i = Math.imul(D, ft)),
              (n = ((n = Math.imul(D, ht)) + Math.imul(N, ft)) | 0),
              (o = Math.imul(N, ht)),
              (i = (i + Math.imul(P, ct)) | 0),
              (n = ((n = (n + Math.imul(P, dt)) | 0) + Math.imul(O, ct)) | 0),
              (o = (o + Math.imul(O, dt)) | 0);
            var Tt =
              (((h + (i = (i + Math.imul(T, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(T, bt)) | 0) + Math.imul(L, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(L, bt)) | 0) + (n >>> 13)) | 0) +
                (Tt >>> 26)) |
              0),
              (Tt &= 67108863),
              (i = Math.imul(D, ct)),
              (n = ((n = Math.imul(D, dt)) + Math.imul(N, ct)) | 0),
              (o = Math.imul(N, dt));
            var Lt =
              (((h + (i = (i + Math.imul(P, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(P, bt)) | 0) + Math.imul(O, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(O, bt)) | 0) + (n >>> 13)) | 0) +
                (Lt >>> 26)) |
              0),
              (Lt &= 67108863);
            var Ct =
              (((h + (i = Math.imul(D, pt))) | 0) +
                ((8191 &
                  (n = ((n = Math.imul(D, bt)) + Math.imul(N, pt)) | 0)) <<
                  13)) |
              0;
            return (
              (h =
                ((((o = Math.imul(N, bt)) + (n >>> 13)) | 0) + (Ct >>> 26)) |
                0),
              (Ct &= 67108863),
              (f[0] = mt),
              (f[1] = yt),
              (f[2] = gt),
              (f[3] = vt),
              (f[4] = wt),
              (f[5] = _t),
              (f[6] = Mt),
              (f[7] = St),
              (f[8] = Et),
              (f[9] = At),
              (f[10] = kt),
              (f[11] = Bt),
              (f[12] = xt),
              (f[13] = It),
              (f[14] = Rt),
              (f[15] = jt),
              (f[16] = Tt),
              (f[17] = Lt),
              (f[18] = Ct),
              0 !== h && ((f[19] = h), r.length++),
              r
            );
          };
          function b(t, e, r) {
            return new m().mulp(t, e, r);
          }
          function m(t, e) {
            (this.x = t), (this.y = e);
          }
          Math.imul || (p = l),
            (o.prototype.mulTo = function (t, e) {
              var r,
                i = this.length + t.length;
              return (
                (r =
                  10 === this.length && 10 === t.length
                    ? p(this, t, e)
                    : i < 63
                    ? l(this, t, e)
                    : i < 1024
                    ? (function (t, e, r) {
                        (r.negative = e.negative ^ t.negative),
                          (r.length = t.length + e.length);
                        for (var i = 0, n = 0, o = 0; o < r.length - 1; o++) {
                          var s = n;
                          n = 0;
                          for (
                            var a = 67108863 & i,
                              f = Math.min(o, e.length - 1),
                              h = Math.max(0, o - t.length + 1);
                            h <= f;
                            h++
                          ) {
                            var u = o - h,
                              c = (0 | t.words[u]) * (0 | e.words[h]),
                              d = 67108863 & c;
                            (a = 67108863 & (d = (d + a) | 0)),
                              (n +=
                                (s =
                                  ((s = (s + ((c / 67108864) | 0)) | 0) +
                                    (d >>> 26)) |
                                  0) >>> 26),
                              (s &= 67108863);
                          }
                          (r.words[o] = a), (i = s), (s = n);
                        }
                        return (
                          0 !== i ? (r.words[o] = i) : r.length--, r.strip()
                        );
                      })(this, t, e)
                    : b(this, t, e)),
                r
              );
            }),
            (m.prototype.makeRBT = function (t) {
              for (
                var e = new Array(t), r = o.prototype._countBits(t) - 1, i = 0;
                i < t;
                i++
              )
                e[i] = this.revBin(i, r, t);
              return e;
            }),
            (m.prototype.revBin = function (t, e, r) {
              if (0 === t || t === r - 1) return t;
              for (var i = 0, n = 0; n < e; n++)
                (i |= (1 & t) << (e - n - 1)), (t >>= 1);
              return i;
            }),
            (m.prototype.permute = function (t, e, r, i, n, o) {
              for (var s = 0; s < o; s++) (i[s] = e[t[s]]), (n[s] = r[t[s]]);
            }),
            (m.prototype.transform = function (t, e, r, i, n, o) {
              this.permute(o, t, e, r, i, n);
              for (var s = 1; s < n; s <<= 1)
                for (
                  var a = s << 1,
                    f = Math.cos((2 * Math.PI) / a),
                    h = Math.sin((2 * Math.PI) / a),
                    u = 0;
                  u < n;
                  u += a
                )
                  for (var c = f, d = h, l = 0; l < s; l++) {
                    var p = r[u + l],
                      b = i[u + l],
                      m = r[u + l + s],
                      y = i[u + l + s],
                      g = c * m - d * y;
                    (y = c * y + d * m),
                      (m = g),
                      (r[u + l] = p + m),
                      (i[u + l] = b + y),
                      (r[u + l + s] = p - m),
                      (i[u + l + s] = b - y),
                      l !== a &&
                        ((g = f * c - h * d), (d = f * d + h * c), (c = g));
                  }
            }),
            (m.prototype.guessLen13b = function (t, e) {
              var r = 1 | Math.max(e, t),
                i = 1 & r,
                n = 0;
              for (r = (r / 2) | 0; r; r >>>= 1) n++;
              return 1 << (n + 1 + i);
            }),
            (m.prototype.conjugate = function (t, e, r) {
              if (!(r <= 1))
                for (var i = 0; i < r / 2; i++) {
                  var n = t[i];
                  (t[i] = t[r - i - 1]),
                    (t[r - i - 1] = n),
                    (n = e[i]),
                    (e[i] = -e[r - i - 1]),
                    (e[r - i - 1] = -n);
                }
            }),
            (m.prototype.normalize13b = function (t, e) {
              for (var r = 0, i = 0; i < e / 2; i++) {
                var n =
                  8192 * Math.round(t[2 * i + 1] / e) +
                  Math.round(t[2 * i] / e) +
                  r;
                (t[i] = 67108863 & n),
                  (r = n < 67108864 ? 0 : (n / 67108864) | 0);
              }
              return t;
            }),
            (m.prototype.convert13b = function (t, e, r, n) {
              for (var o = 0, s = 0; s < e; s++)
                (o += 0 | t[s]),
                  (r[2 * s] = 8191 & o),
                  (o >>>= 13),
                  (r[2 * s + 1] = 8191 & o),
                  (o >>>= 13);
              for (s = 2 * e; s < n; ++s) r[s] = 0;
              i(0 === o), i(0 == (-8192 & o));
            }),
            (m.prototype.stub = function (t) {
              for (var e = new Array(t), r = 0; r < t; r++) e[r] = 0;
              return e;
            }),
            (m.prototype.mulp = function (t, e, r) {
              var i = 2 * this.guessLen13b(t.length, e.length),
                n = this.makeRBT(i),
                o = this.stub(i),
                s = new Array(i),
                a = new Array(i),
                f = new Array(i),
                h = new Array(i),
                u = new Array(i),
                c = new Array(i),
                d = r.words;
              (d.length = i),
                this.convert13b(t.words, t.length, s, i),
                this.convert13b(e.words, e.length, h, i),
                this.transform(s, o, a, f, i, n),
                this.transform(h, o, u, c, i, n);
              for (var l = 0; l < i; l++) {
                var p = a[l] * u[l] - f[l] * c[l];
                (f[l] = a[l] * c[l] + f[l] * u[l]), (a[l] = p);
              }
              return (
                this.conjugate(a, f, i),
                this.transform(a, f, d, o, i, n),
                this.conjugate(d, o, i),
                this.normalize13b(d, i),
                (r.negative = t.negative ^ e.negative),
                (r.length = t.length + e.length),
                r.strip()
              );
            }),
            (o.prototype.mul = function (t) {
              var e = new o(null);
              return (
                (e.words = new Array(this.length + t.length)), this.mulTo(t, e)
              );
            }),
            (o.prototype.mulf = function (t) {
              var e = new o(null);
              return (
                (e.words = new Array(this.length + t.length)), b(this, t, e)
              );
            }),
            (o.prototype.imul = function (t) {
              return this.clone().mulTo(t, this);
            }),
            (o.prototype.imuln = function (t) {
              i("number" == typeof t), i(t < 67108864);
              for (var e = 0, r = 0; r < this.length; r++) {
                var n = (0 | this.words[r]) * t,
                  o = (67108863 & n) + (67108863 & e);
                (e >>= 26),
                  (e += (n / 67108864) | 0),
                  (e += o >>> 26),
                  (this.words[r] = 67108863 & o);
              }
              return 0 !== e && ((this.words[r] = e), this.length++), this;
            }),
            (o.prototype.muln = function (t) {
              return this.clone().imuln(t);
            }),
            (o.prototype.sqr = function () {
              return this.mul(this);
            }),
            (o.prototype.isqr = function () {
              return this.imul(this.clone());
            }),
            (o.prototype.pow = function (t) {
              var e = (function (t) {
                for (
                  var e = new Array(t.bitLength()), r = 0;
                  r < e.length;
                  r++
                ) {
                  var i = (r / 26) | 0,
                    n = r % 26;
                  e[r] = (t.words[i] & (1 << n)) >>> n;
                }
                return e;
              })(t);
              if (0 === e.length) return new o(1);
              for (
                var r = this, i = 0;
                i < e.length && 0 === e[i];
                i++, r = r.sqr()
              );
              if (++i < e.length)
                for (var n = r.sqr(); i < e.length; i++, n = n.sqr())
                  0 !== e[i] && (r = r.mul(n));
              return r;
            }),
            (o.prototype.iushln = function (t) {
              i("number" == typeof t && t >= 0);
              var e,
                r = t % 26,
                n = (t - r) / 26,
                o = (67108863 >>> (26 - r)) << (26 - r);
              if (0 !== r) {
                var s = 0;
                for (e = 0; e < this.length; e++) {
                  var a = this.words[e] & o,
                    f = ((0 | this.words[e]) - a) << r;
                  (this.words[e] = f | s), (s = a >>> (26 - r));
                }
                s && ((this.words[e] = s), this.length++);
              }
              if (0 !== n) {
                for (e = this.length - 1; e >= 0; e--)
                  this.words[e + n] = this.words[e];
                for (e = 0; e < n; e++) this.words[e] = 0;
                this.length += n;
              }
              return this.strip();
            }),
            (o.prototype.ishln = function (t) {
              return i(0 === this.negative), this.iushln(t);
            }),
            (o.prototype.iushrn = function (t, e, r) {
              var n;
              i("number" == typeof t && t >= 0),
                (n = e ? (e - (e % 26)) / 26 : 0);
              var o = t % 26,
                s = Math.min((t - o) / 26, this.length),
                a = 67108863 ^ ((67108863 >>> o) << o),
                f = r;
              if (((n -= s), (n = Math.max(0, n)), f)) {
                for (var h = 0; h < s; h++) f.words[h] = this.words[h];
                f.length = s;
              }
              if (0 === s);
              else if (this.length > s)
                for (this.length -= s, h = 0; h < this.length; h++)
                  this.words[h] = this.words[h + s];
              else (this.words[0] = 0), (this.length = 1);
              var u = 0;
              for (h = this.length - 1; h >= 0 && (0 !== u || h >= n); h--) {
                var c = 0 | this.words[h];
                (this.words[h] = (u << (26 - o)) | (c >>> o)), (u = c & a);
              }
              return (
                f && 0 !== u && (f.words[f.length++] = u),
                0 === this.length && ((this.words[0] = 0), (this.length = 1)),
                this.strip()
              );
            }),
            (o.prototype.ishrn = function (t, e, r) {
              return i(0 === this.negative), this.iushrn(t, e, r);
            }),
            (o.prototype.shln = function (t) {
              return this.clone().ishln(t);
            }),
            (o.prototype.ushln = function (t) {
              return this.clone().iushln(t);
            }),
            (o.prototype.shrn = function (t) {
              return this.clone().ishrn(t);
            }),
            (o.prototype.ushrn = function (t) {
              return this.clone().iushrn(t);
            }),
            (o.prototype.testn = function (t) {
              i("number" == typeof t && t >= 0);
              var e = t % 26,
                r = (t - e) / 26,
                n = 1 << e;
              return !(this.length <= r) && !!(this.words[r] & n);
            }),
            (o.prototype.imaskn = function (t) {
              i("number" == typeof t && t >= 0);
              var e = t % 26,
                r = (t - e) / 26;
              if (
                (i(
                  0 === this.negative,
                  "imaskn works only with positive numbers"
                ),
                this.length <= r)
              )
                return this;
              if (
                (0 !== e && r++,
                (this.length = Math.min(r, this.length)),
                0 !== e)
              ) {
                var n = 67108863 ^ ((67108863 >>> e) << e);
                this.words[this.length - 1] &= n;
              }
              return this.strip();
            }),
            (o.prototype.maskn = function (t) {
              return this.clone().imaskn(t);
            }),
            (o.prototype.iaddn = function (t) {
              return (
                i("number" == typeof t),
                i(t < 67108864),
                t < 0
                  ? this.isubn(-t)
                  : 0 !== this.negative
                  ? 1 === this.length && (0 | this.words[0]) < t
                    ? ((this.words[0] = t - (0 | this.words[0])),
                      (this.negative = 0),
                      this)
                    : ((this.negative = 0),
                      this.isubn(t),
                      (this.negative = 1),
                      this)
                  : this._iaddn(t)
              );
            }),
            (o.prototype._iaddn = function (t) {
              this.words[0] += t;
              for (var e = 0; e < this.length && this.words[e] >= 67108864; e++)
                (this.words[e] -= 67108864),
                  e === this.length - 1
                    ? (this.words[e + 1] = 1)
                    : this.words[e + 1]++;
              return (this.length = Math.max(this.length, e + 1)), this;
            }),
            (o.prototype.isubn = function (t) {
              if ((i("number" == typeof t), i(t < 67108864), t < 0))
                return this.iaddn(-t);
              if (0 !== this.negative)
                return (
                  (this.negative = 0), this.iaddn(t), (this.negative = 1), this
                );
              if (
                ((this.words[0] -= t), 1 === this.length && this.words[0] < 0)
              )
                (this.words[0] = -this.words[0]), (this.negative = 1);
              else
                for (var e = 0; e < this.length && this.words[e] < 0; e++)
                  (this.words[e] += 67108864), (this.words[e + 1] -= 1);
              return this.strip();
            }),
            (o.prototype.addn = function (t) {
              return this.clone().iaddn(t);
            }),
            (o.prototype.subn = function (t) {
              return this.clone().isubn(t);
            }),
            (o.prototype.iabs = function () {
              return (this.negative = 0), this;
            }),
            (o.prototype.abs = function () {
              return this.clone().iabs();
            }),
            (o.prototype._ishlnsubmul = function (t, e, r) {
              var n,
                o,
                s = t.length + r;
              this._expand(s);
              var a = 0;
              for (n = 0; n < t.length; n++) {
                o = (0 | this.words[n + r]) + a;
                var f = (0 | t.words[n]) * e;
                (a = ((o -= 67108863 & f) >> 26) - ((f / 67108864) | 0)),
                  (this.words[n + r] = 67108863 & o);
              }
              for (; n < this.length - r; n++)
                (a = (o = (0 | this.words[n + r]) + a) >> 26),
                  (this.words[n + r] = 67108863 & o);
              if (0 === a) return this.strip();
              for (i(-1 === a), a = 0, n = 0; n < this.length; n++)
                (a = (o = -(0 | this.words[n]) + a) >> 26),
                  (this.words[n] = 67108863 & o);
              return (this.negative = 1), this.strip();
            }),
            (o.prototype._wordDiv = function (t, e) {
              var r = (this.length, t.length),
                i = this.clone(),
                n = t,
                s = 0 | n.words[n.length - 1];
              0 !== (r = 26 - this._countBits(s)) &&
                ((n = n.ushln(r)),
                i.iushln(r),
                (s = 0 | n.words[n.length - 1]));
              var a,
                f = i.length - n.length;
              if ("mod" !== e) {
                ((a = new o(null)).length = f + 1),
                  (a.words = new Array(a.length));
                for (var h = 0; h < a.length; h++) a.words[h] = 0;
              }
              var u = i.clone()._ishlnsubmul(n, 1, f);
              0 === u.negative && ((i = u), a && (a.words[f] = 1));
              for (var c = f - 1; c >= 0; c--) {
                var d =
                  67108864 * (0 | i.words[n.length + c]) +
                  (0 | i.words[n.length + c - 1]);
                for (
                  d = Math.min((d / s) | 0, 67108863), i._ishlnsubmul(n, d, c);
                  0 !== i.negative;

                )
                  d--,
                    (i.negative = 0),
                    i._ishlnsubmul(n, 1, c),
                    i.isZero() || (i.negative ^= 1);
                a && (a.words[c] = d);
              }
              return (
                a && a.strip(),
                i.strip(),
                "div" !== e && 0 !== r && i.iushrn(r),
                { div: a || null, mod: i }
              );
            }),
            (o.prototype.divmod = function (t, e, r) {
              return (
                i(!t.isZero()),
                this.isZero()
                  ? { div: new o(0), mod: new o(0) }
                  : 0 !== this.negative && 0 === t.negative
                  ? ((a = this.neg().divmod(t, e)),
                    "mod" !== e && (n = a.div.neg()),
                    "div" !== e &&
                      ((s = a.mod.neg()), r && 0 !== s.negative && s.iadd(t)),
                    { div: n, mod: s })
                  : 0 === this.negative && 0 !== t.negative
                  ? ((a = this.divmod(t.neg(), e)),
                    "mod" !== e && (n = a.div.neg()),
                    { div: n, mod: a.mod })
                  : 0 != (this.negative & t.negative)
                  ? ((a = this.neg().divmod(t.neg(), e)),
                    "div" !== e &&
                      ((s = a.mod.neg()), r && 0 !== s.negative && s.isub(t)),
                    { div: a.div, mod: s })
                  : t.length > this.length || this.cmp(t) < 0
                  ? { div: new o(0), mod: this }
                  : 1 === t.length
                  ? "div" === e
                    ? { div: this.divn(t.words[0]), mod: null }
                    : "mod" === e
                    ? { div: null, mod: new o(this.modn(t.words[0])) }
                    : {
                        div: this.divn(t.words[0]),
                        mod: new o(this.modn(t.words[0])),
                      }
                  : this._wordDiv(t, e)
              );
              var n, s, a;
            }),
            (o.prototype.div = function (t) {
              return this.divmod(t, "div", !1).div;
            }),
            (o.prototype.mod = function (t) {
              return this.divmod(t, "mod", !1).mod;
            }),
            (o.prototype.umod = function (t) {
              return this.divmod(t, "mod", !0).mod;
            }),
            (o.prototype.divRound = function (t) {
              var e = this.divmod(t);
              if (e.mod.isZero()) return e.div;
              var r = 0 !== e.div.negative ? e.mod.isub(t) : e.mod,
                i = t.ushrn(1),
                n = t.andln(1),
                o = r.cmp(i);
              return o < 0 || (1 === n && 0 === o)
                ? e.div
                : 0 !== e.div.negative
                ? e.div.isubn(1)
                : e.div.iaddn(1);
            }),
            (o.prototype.modn = function (t) {
              i(t <= 67108863);
              for (
                var e = (1 << 26) % t, r = 0, n = this.length - 1;
                n >= 0;
                n--
              )
                r = (e * r + (0 | this.words[n])) % t;
              return r;
            }),
            (o.prototype.idivn = function (t) {
              i(t <= 67108863);
              for (var e = 0, r = this.length - 1; r >= 0; r--) {
                var n = (0 | this.words[r]) + 67108864 * e;
                (this.words[r] = (n / t) | 0), (e = n % t);
              }
              return this.strip();
            }),
            (o.prototype.divn = function (t) {
              return this.clone().idivn(t);
            }),
            (o.prototype.egcd = function (t) {
              i(0 === t.negative), i(!t.isZero());
              var e = this,
                r = t.clone();
              e = 0 !== e.negative ? e.umod(t) : e.clone();
              for (
                var n = new o(1),
                  s = new o(0),
                  a = new o(0),
                  f = new o(1),
                  h = 0;
                e.isEven() && r.isEven();

              )
                e.iushrn(1), r.iushrn(1), ++h;
              for (var u = r.clone(), c = e.clone(); !e.isZero(); ) {
                for (
                  var d = 0, l = 1;
                  0 == (e.words[0] & l) && d < 26;
                  ++d, l <<= 1
                );
                if (d > 0)
                  for (e.iushrn(d); d-- > 0; )
                    (n.isOdd() || s.isOdd()) && (n.iadd(u), s.isub(c)),
                      n.iushrn(1),
                      s.iushrn(1);
                for (
                  var p = 0, b = 1;
                  0 == (r.words[0] & b) && p < 26;
                  ++p, b <<= 1
                );
                if (p > 0)
                  for (r.iushrn(p); p-- > 0; )
                    (a.isOdd() || f.isOdd()) && (a.iadd(u), f.isub(c)),
                      a.iushrn(1),
                      f.iushrn(1);
                e.cmp(r) >= 0
                  ? (e.isub(r), n.isub(a), s.isub(f))
                  : (r.isub(e), a.isub(n), f.isub(s));
              }
              return { a: a, b: f, gcd: r.iushln(h) };
            }),
            (o.prototype._invmp = function (t) {
              i(0 === t.negative), i(!t.isZero());
              var e = this,
                r = t.clone();
              e = 0 !== e.negative ? e.umod(t) : e.clone();
              for (
                var n, s = new o(1), a = new o(0), f = r.clone();
                e.cmpn(1) > 0 && r.cmpn(1) > 0;

              ) {
                for (
                  var h = 0, u = 1;
                  0 == (e.words[0] & u) && h < 26;
                  ++h, u <<= 1
                );
                if (h > 0)
                  for (e.iushrn(h); h-- > 0; )
                    s.isOdd() && s.iadd(f), s.iushrn(1);
                for (
                  var c = 0, d = 1;
                  0 == (r.words[0] & d) && c < 26;
                  ++c, d <<= 1
                );
                if (c > 0)
                  for (r.iushrn(c); c-- > 0; )
                    a.isOdd() && a.iadd(f), a.iushrn(1);
                e.cmp(r) >= 0 ? (e.isub(r), s.isub(a)) : (r.isub(e), a.isub(s));
              }
              return (n = 0 === e.cmpn(1) ? s : a).cmpn(0) < 0 && n.iadd(t), n;
            }),
            (o.prototype.gcd = function (t) {
              if (this.isZero()) return t.abs();
              if (t.isZero()) return this.abs();
              var e = this.clone(),
                r = t.clone();
              (e.negative = 0), (r.negative = 0);
              for (var i = 0; e.isEven() && r.isEven(); i++)
                e.iushrn(1), r.iushrn(1);
              for (;;) {
                for (; e.isEven(); ) e.iushrn(1);
                for (; r.isEven(); ) r.iushrn(1);
                var n = e.cmp(r);
                if (n < 0) {
                  var o = e;
                  (e = r), (r = o);
                } else if (0 === n || 0 === r.cmpn(1)) break;
                e.isub(r);
              }
              return r.iushln(i);
            }),
            (o.prototype.invm = function (t) {
              return this.egcd(t).a.umod(t);
            }),
            (o.prototype.isEven = function () {
              return 0 == (1 & this.words[0]);
            }),
            (o.prototype.isOdd = function () {
              return 1 == (1 & this.words[0]);
            }),
            (o.prototype.andln = function (t) {
              return this.words[0] & t;
            }),
            (o.prototype.bincn = function (t) {
              i("number" == typeof t);
              var e = t % 26,
                r = (t - e) / 26,
                n = 1 << e;
              if (this.length <= r)
                return this._expand(r + 1), (this.words[r] |= n), this;
              for (var o = n, s = r; 0 !== o && s < this.length; s++) {
                var a = 0 | this.words[s];
                (o = (a += o) >>> 26), (a &= 67108863), (this.words[s] = a);
              }
              return 0 !== o && ((this.words[s] = o), this.length++), this;
            }),
            (o.prototype.isZero = function () {
              return 1 === this.length && 0 === this.words[0];
            }),
            (o.prototype.cmpn = function (t) {
              var e,
                r = t < 0;
              if (0 !== this.negative && !r) return -1;
              if (0 === this.negative && r) return 1;
              if ((this.strip(), this.length > 1)) e = 1;
              else {
                r && (t = -t), i(t <= 67108863, "Number is too big");
                var n = 0 | this.words[0];
                e = n === t ? 0 : n < t ? -1 : 1;
              }
              return 0 !== this.negative ? 0 | -e : e;
            }),
            (o.prototype.cmp = function (t) {
              if (0 !== this.negative && 0 === t.negative) return -1;
              if (0 === this.negative && 0 !== t.negative) return 1;
              var e = this.ucmp(t);
              return 0 !== this.negative ? 0 | -e : e;
            }),
            (o.prototype.ucmp = function (t) {
              if (this.length > t.length) return 1;
              if (this.length < t.length) return -1;
              for (var e = 0, r = this.length - 1; r >= 0; r--) {
                var i = 0 | this.words[r],
                  n = 0 | t.words[r];
                if (i !== n) {
                  i < n ? (e = -1) : i > n && (e = 1);
                  break;
                }
              }
              return e;
            }),
            (o.prototype.gtn = function (t) {
              return 1 === this.cmpn(t);
            }),
            (o.prototype.gt = function (t) {
              return 1 === this.cmp(t);
            }),
            (o.prototype.gten = function (t) {
              return this.cmpn(t) >= 0;
            }),
            (o.prototype.gte = function (t) {
              return this.cmp(t) >= 0;
            }),
            (o.prototype.ltn = function (t) {
              return -1 === this.cmpn(t);
            }),
            (o.prototype.lt = function (t) {
              return -1 === this.cmp(t);
            }),
            (o.prototype.lten = function (t) {
              return this.cmpn(t) <= 0;
            }),
            (o.prototype.lte = function (t) {
              return this.cmp(t) <= 0;
            }),
            (o.prototype.eqn = function (t) {
              return 0 === this.cmpn(t);
            }),
            (o.prototype.eq = function (t) {
              return 0 === this.cmp(t);
            }),
            (o.red = function (t) {
              return new S(t);
            }),
            (o.prototype.toRed = function (t) {
              return (
                i(!this.red, "Already a number in reduction context"),
                i(0 === this.negative, "red works only with positives"),
                t.convertTo(this)._forceRed(t)
              );
            }),
            (o.prototype.fromRed = function () {
              return (
                i(
                  this.red,
                  "fromRed works only with numbers in reduction context"
                ),
                this.red.convertFrom(this)
              );
            }),
            (o.prototype._forceRed = function (t) {
              return (this.red = t), this;
            }),
            (o.prototype.forceRed = function (t) {
              return (
                i(!this.red, "Already a number in reduction context"),
                this._forceRed(t)
              );
            }),
            (o.prototype.redAdd = function (t) {
              return (
                i(this.red, "redAdd works only with red numbers"),
                this.red.add(this, t)
              );
            }),
            (o.prototype.redIAdd = function (t) {
              return (
                i(this.red, "redIAdd works only with red numbers"),
                this.red.iadd(this, t)
              );
            }),
            (o.prototype.redSub = function (t) {
              return (
                i(this.red, "redSub works only with red numbers"),
                this.red.sub(this, t)
              );
            }),
            (o.prototype.redISub = function (t) {
              return (
                i(this.red, "redISub works only with red numbers"),
                this.red.isub(this, t)
              );
            }),
            (o.prototype.redShl = function (t) {
              return (
                i(this.red, "redShl works only with red numbers"),
                this.red.shl(this, t)
              );
            }),
            (o.prototype.redMul = function (t) {
              return (
                i(this.red, "redMul works only with red numbers"),
                this.red._verify2(this, t),
                this.red.mul(this, t)
              );
            }),
            (o.prototype.redIMul = function (t) {
              return (
                i(this.red, "redMul works only with red numbers"),
                this.red._verify2(this, t),
                this.red.imul(this, t)
              );
            }),
            (o.prototype.redSqr = function () {
              return (
                i(this.red, "redSqr works only with red numbers"),
                this.red._verify1(this),
                this.red.sqr(this)
              );
            }),
            (o.prototype.redISqr = function () {
              return (
                i(this.red, "redISqr works only with red numbers"),
                this.red._verify1(this),
                this.red.isqr(this)
              );
            }),
            (o.prototype.redSqrt = function () {
              return (
                i(this.red, "redSqrt works only with red numbers"),
                this.red._verify1(this),
                this.red.sqrt(this)
              );
            }),
            (o.prototype.redInvm = function () {
              return (
                i(this.red, "redInvm works only with red numbers"),
                this.red._verify1(this),
                this.red.invm(this)
              );
            }),
            (o.prototype.redNeg = function () {
              return (
                i(this.red, "redNeg works only with red numbers"),
                this.red._verify1(this),
                this.red.neg(this)
              );
            }),
            (o.prototype.redPow = function (t) {
              return (
                i(this.red && !t.red, "redPow(normalNum)"),
                this.red._verify1(this),
                this.red.pow(this, t)
              );
            });
          var y = { k256: null, p224: null, p192: null, p25519: null };
          function g(t, e) {
            (this.name = t),
              (this.p = new o(e, 16)),
              (this.n = this.p.bitLength()),
              (this.k = new o(1).iushln(this.n).isub(this.p)),
              (this.tmp = this._tmp());
          }
          function v() {
            g.call(
              this,
              "k256",
              "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
            );
          }
          function w() {
            g.call(
              this,
              "p224",
              "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
            );
          }
          function _() {
            g.call(
              this,
              "p192",
              "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
            );
          }
          function M() {
            g.call(
              this,
              "25519",
              "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
            );
          }
          function S(t) {
            if ("string" == typeof t) {
              var e = o._prime(t);
              (this.m = e.p), (this.prime = e);
            } else
              i(t.gtn(1), "modulus must be greater than 1"),
                (this.m = t),
                (this.prime = null);
          }
          function E(t) {
            S.call(this, t),
              (this.shift = this.m.bitLength()),
              this.shift % 26 != 0 && (this.shift += 26 - (this.shift % 26)),
              (this.r = new o(1).iushln(this.shift)),
              (this.r2 = this.imod(this.r.sqr())),
              (this.rinv = this.r._invmp(this.m)),
              (this.minv = this.rinv.mul(this.r).isubn(1).div(this.m)),
              (this.minv = this.minv.umod(this.r)),
              (this.minv = this.r.sub(this.minv));
          }
          (g.prototype._tmp = function () {
            var t = new o(null);
            return (t.words = new Array(Math.ceil(this.n / 13))), t;
          }),
            (g.prototype.ireduce = function (t) {
              var e,
                r = t;
              do {
                this.split(r, this.tmp),
                  (e = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength());
              } while (e > this.n);
              var i = e < this.n ? -1 : r.ucmp(this.p);
              return (
                0 === i
                  ? ((r.words[0] = 0), (r.length = 1))
                  : i > 0
                  ? r.isub(this.p)
                  : void 0 !== r.strip
                  ? r.strip()
                  : r._strip(),
                r
              );
            }),
            (g.prototype.split = function (t, e) {
              t.iushrn(this.n, 0, e);
            }),
            (g.prototype.imulK = function (t) {
              return t.imul(this.k);
            }),
            n(v, g),
            (v.prototype.split = function (t, e) {
              for (
                var r = 4194303, i = Math.min(t.length, 9), n = 0;
                n < i;
                n++
              )
                e.words[n] = t.words[n];
              if (((e.length = i), t.length <= 9))
                return (t.words[0] = 0), void (t.length = 1);
              var o = t.words[9];
              for (e.words[e.length++] = o & r, n = 10; n < t.length; n++) {
                var s = 0 | t.words[n];
                (t.words[n - 10] = ((s & r) << 4) | (o >>> 22)), (o = s);
              }
              (o >>>= 22),
                (t.words[n - 10] = o),
                0 === o && t.length > 10 ? (t.length -= 10) : (t.length -= 9);
            }),
            (v.prototype.imulK = function (t) {
              (t.words[t.length] = 0),
                (t.words[t.length + 1] = 0),
                (t.length += 2);
              for (var e = 0, r = 0; r < t.length; r++) {
                var i = 0 | t.words[r];
                (e += 977 * i),
                  (t.words[r] = 67108863 & e),
                  (e = 64 * i + ((e / 67108864) | 0));
              }
              return (
                0 === t.words[t.length - 1] &&
                  (t.length--, 0 === t.words[t.length - 1] && t.length--),
                t
              );
            }),
            n(w, g),
            n(_, g),
            n(M, g),
            (M.prototype.imulK = function (t) {
              for (var e = 0, r = 0; r < t.length; r++) {
                var i = 19 * (0 | t.words[r]) + e,
                  n = 67108863 & i;
                (i >>>= 26), (t.words[r] = n), (e = i);
              }
              return 0 !== e && (t.words[t.length++] = e), t;
            }),
            (o._prime = function (t) {
              if (y[t]) return y[t];
              var e;
              if ("k256" === t) e = new v();
              else if ("p224" === t) e = new w();
              else if ("p192" === t) e = new _();
              else {
                if ("p25519" !== t) throw new Error("Unknown prime " + t);
                e = new M();
              }
              return (y[t] = e), e;
            }),
            (S.prototype._verify1 = function (t) {
              i(0 === t.negative, "red works only with positives"),
                i(t.red, "red works only with red numbers");
            }),
            (S.prototype._verify2 = function (t, e) {
              i(
                0 == (t.negative | e.negative),
                "red works only with positives"
              ),
                i(t.red && t.red === e.red, "red works only with red numbers");
            }),
            (S.prototype.imod = function (t) {
              return this.prime
                ? this.prime.ireduce(t)._forceRed(this)
                : t.umod(this.m)._forceRed(this);
            }),
            (S.prototype.neg = function (t) {
              return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
            }),
            (S.prototype.add = function (t, e) {
              this._verify2(t, e);
              var r = t.add(e);
              return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this);
            }),
            (S.prototype.iadd = function (t, e) {
              this._verify2(t, e);
              var r = t.iadd(e);
              return r.cmp(this.m) >= 0 && r.isub(this.m), r;
            }),
            (S.prototype.sub = function (t, e) {
              this._verify2(t, e);
              var r = t.sub(e);
              return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this);
            }),
            (S.prototype.isub = function (t, e) {
              this._verify2(t, e);
              var r = t.isub(e);
              return r.cmpn(0) < 0 && r.iadd(this.m), r;
            }),
            (S.prototype.shl = function (t, e) {
              return this._verify1(t), this.imod(t.ushln(e));
            }),
            (S.prototype.imul = function (t, e) {
              return this._verify2(t, e), this.imod(t.imul(e));
            }),
            (S.prototype.mul = function (t, e) {
              return this._verify2(t, e), this.imod(t.mul(e));
            }),
            (S.prototype.isqr = function (t) {
              return this.imul(t, t.clone());
            }),
            (S.prototype.sqr = function (t) {
              return this.mul(t, t);
            }),
            (S.prototype.sqrt = function (t) {
              if (t.isZero()) return t.clone();
              var e = this.m.andln(3);
              if ((i(e % 2 == 1), 3 === e)) {
                var r = this.m.add(new o(1)).iushrn(2);
                return this.pow(t, r);
              }
              for (
                var n = this.m.subn(1), s = 0;
                !n.isZero() && 0 === n.andln(1);

              )
                s++, n.iushrn(1);
              i(!n.isZero());
              var a = new o(1).toRed(this),
                f = a.redNeg(),
                h = this.m.subn(1).iushrn(1),
                u = this.m.bitLength();
              for (
                u = new o(2 * u * u).toRed(this);
                0 !== this.pow(u, h).cmp(f);

              )
                u.redIAdd(f);
              for (
                var c = this.pow(u, n),
                  d = this.pow(t, n.addn(1).iushrn(1)),
                  l = this.pow(t, n),
                  p = s;
                0 !== l.cmp(a);

              ) {
                for (var b = l, m = 0; 0 !== b.cmp(a); m++) b = b.redSqr();
                i(m < p);
                var y = this.pow(c, new o(1).iushln(p - m - 1));
                (d = d.redMul(y)), (c = y.redSqr()), (l = l.redMul(c)), (p = m);
              }
              return d;
            }),
            (S.prototype.invm = function (t) {
              var e = t._invmp(this.m);
              return 0 !== e.negative
                ? ((e.negative = 0), this.imod(e).redNeg())
                : this.imod(e);
            }),
            (S.prototype.pow = function (t, e) {
              if (e.isZero()) return new o(1).toRed(this);
              if (0 === e.cmpn(1)) return t.clone();
              var r = new Array(16);
              (r[0] = new o(1).toRed(this)), (r[1] = t);
              for (var i = 2; i < r.length; i++) r[i] = this.mul(r[i - 1], t);
              var n = r[0],
                s = 0,
                a = 0,
                f = e.bitLength() % 26;
              for (0 === f && (f = 26), i = e.length - 1; i >= 0; i--) {
                for (var h = e.words[i], u = f - 1; u >= 0; u--) {
                  var c = (h >> u) & 1;
                  n !== r[0] && (n = this.sqr(n)),
                    0 !== c || 0 !== s
                      ? ((s <<= 1),
                        (s |= c),
                        (4 === ++a || (0 === i && 0 === u)) &&
                          ((n = this.mul(n, r[s])), (a = 0), (s = 0)))
                      : (a = 0);
                }
                f = 26;
              }
              return n;
            }),
            (S.prototype.convertTo = function (t) {
              var e = t.umod(this.m);
              return e === t ? e.clone() : e;
            }),
            (S.prototype.convertFrom = function (t) {
              var e = t.clone();
              return (e.red = null), e;
            }),
            (o.mont = function (t) {
              return new E(t);
            }),
            n(E, S),
            (E.prototype.convertTo = function (t) {
              return this.imod(t.ushln(this.shift));
            }),
            (E.prototype.convertFrom = function (t) {
              var e = this.imod(t.mul(this.rinv));
              return (e.red = null), e;
            }),
            (E.prototype.imul = function (t, e) {
              if (t.isZero() || e.isZero())
                return (t.words[0] = 0), (t.length = 1), t;
              var r = t.imul(e),
                i = r
                  .maskn(this.shift)
                  .mul(this.minv)
                  .imaskn(this.shift)
                  .mul(this.m),
                n = r.isub(i).iushrn(this.shift),
                o = n;
              return (
                n.cmp(this.m) >= 0
                  ? (o = n.isub(this.m))
                  : n.cmpn(0) < 0 && (o = n.iadd(this.m)),
                o._forceRed(this)
              );
            }),
            (E.prototype.mul = function (t, e) {
              if (t.isZero() || e.isZero()) return new o(0)._forceRed(this);
              var r = t.mul(e),
                i = r
                  .maskn(this.shift)
                  .mul(this.minv)
                  .imaskn(this.shift)
                  .mul(this.m),
                n = r.isub(i).iushrn(this.shift),
                s = n;
              return (
                n.cmp(this.m) >= 0
                  ? (s = n.isub(this.m))
                  : n.cmpn(0) < 0 && (s = n.iadd(this.m)),
                s._forceRed(this)
              );
            }),
            (E.prototype.invm = function (t) {
              return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this);
            });
        })(void 0 === e || e, this);
      },
      { buffer: 19 },
    ],
    16: [
      function (t, e, r) {
        "use strict";
        (r.byteLength = function (t) {
          var e = h(t),
            r = e[0],
            i = e[1];
          return (3 * (r + i)) / 4 - i;
        }),
          (r.toByteArray = function (t) {
            var e,
              r,
              i = h(t),
              s = i[0],
              a = i[1],
              f = new o(
                (function (t, e, r) {
                  return (3 * (e + r)) / 4 - r;
                })(0, s, a)
              ),
              u = 0,
              c = a > 0 ? s - 4 : s;
            for (r = 0; r < c; r += 4)
              (e =
                (n[t.charCodeAt(r)] << 18) |
                (n[t.charCodeAt(r + 1)] << 12) |
                (n[t.charCodeAt(r + 2)] << 6) |
                n[t.charCodeAt(r + 3)]),
                (f[u++] = (e >> 16) & 255),
                (f[u++] = (e >> 8) & 255),
                (f[u++] = 255 & e);
            2 === a &&
              ((e = (n[t.charCodeAt(r)] << 2) | (n[t.charCodeAt(r + 1)] >> 4)),
              (f[u++] = 255 & e));
            1 === a &&
              ((e =
                (n[t.charCodeAt(r)] << 10) |
                (n[t.charCodeAt(r + 1)] << 4) |
                (n[t.charCodeAt(r + 2)] >> 2)),
              (f[u++] = (e >> 8) & 255),
              (f[u++] = 255 & e));
            return f;
          }),
          (r.fromByteArray = function (t) {
            for (
              var e,
                r = t.length,
                n = r % 3,
                o = [],
                s = 16383,
                a = 0,
                f = r - n;
              a < f;
              a += s
            )
              o.push(u(t, a, a + s > f ? f : a + s));
            1 === n
              ? ((e = t[r - 1]), o.push(i[e >> 2] + i[(e << 4) & 63] + "=="))
              : 2 === n &&
                ((e = (t[r - 2] << 8) + t[r - 1]),
                o.push(i[e >> 10] + i[(e >> 4) & 63] + i[(e << 2) & 63] + "="));
            return o.join("");
          });
        for (
          var i = [],
            n = [],
            o = "undefined" != typeof Uint8Array ? Uint8Array : Array,
            s =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            a = 0,
            f = s.length;
          a < f;
          ++a
        )
          (i[a] = s[a]), (n[s.charCodeAt(a)] = a);
        function h(t) {
          var e = t.length;
          if (e % 4 > 0)
            throw new Error("Invalid string. Length must be a multiple of 4");
          var r = t.indexOf("=");
          return -1 === r && (r = e), [r, r === e ? 0 : 4 - (r % 4)];
        }
        function u(t, e, r) {
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
          return s.join("");
        }
        (n["-".charCodeAt(0)] = 62), (n["_".charCodeAt(0)] = 63);
      },
      {},
    ],
    17: [
      function (t, e, r) {
        !(function (e, r) {
          "use strict";
          function i(t, e) {
            if (!t) throw new Error(e || "Assertion failed");
          }
          function n(t, e) {
            t.super_ = e;
            var r = function () {};
            (r.prototype = e.prototype),
              (t.prototype = new r()),
              (t.prototype.constructor = t);
          }
          function o(t, e, r) {
            if (o.isBN(t)) return t;
            (this.negative = 0),
              (this.words = null),
              (this.length = 0),
              (this.red = null),
              null !== t &&
                (("le" !== e && "be" !== e) || ((r = e), (e = 10)),
                this._init(t || 0, e || 10, r || "be"));
          }
          var s;
          "object" == typeof e ? (e.exports = o) : (r.BN = o),
            (o.BN = o),
            (o.wordSize = 26);
          try {
            s =
              "undefined" != typeof window && void 0 !== window.Buffer
                ? window.Buffer
                : t("buffer").Buffer;
          } catch (t) {}
          function a(t, e) {
            var r = t.charCodeAt(e);
            return r >= 48 && r <= 57
              ? r - 48
              : r >= 65 && r <= 70
              ? r - 55
              : r >= 97 && r <= 102
              ? r - 87
              : void i(!1, "Invalid character in " + t);
          }
          function f(t, e, r) {
            var i = a(t, r);
            return r - 1 >= e && (i |= a(t, r - 1) << 4), i;
          }
          function h(t, e, r, n) {
            for (
              var o = 0, s = 0, a = Math.min(t.length, r), f = e;
              f < a;
              f++
            ) {
              var h = t.charCodeAt(f) - 48;
              (o *= n),
                (s = h >= 49 ? h - 49 + 10 : h >= 17 ? h - 17 + 10 : h),
                i(h >= 0 && s < n, "Invalid character"),
                (o += s);
            }
            return o;
          }
          function u(t, e) {
            (t.words = e.words),
              (t.length = e.length),
              (t.negative = e.negative),
              (t.red = e.red);
          }
          if (
            ((o.isBN = function (t) {
              return (
                t instanceof o ||
                (null !== t &&
                  "object" == typeof t &&
                  t.constructor.wordSize === o.wordSize &&
                  Array.isArray(t.words))
              );
            }),
            (o.max = function (t, e) {
              return t.cmp(e) > 0 ? t : e;
            }),
            (o.min = function (t, e) {
              return t.cmp(e) < 0 ? t : e;
            }),
            (o.prototype._init = function (t, e, r) {
              if ("number" == typeof t) return this._initNumber(t, e, r);
              if ("object" == typeof t) return this._initArray(t, e, r);
              "hex" === e && (e = 16), i(e === (0 | e) && e >= 2 && e <= 36);
              var n = 0;
              "-" === (t = t.toString().replace(/\s+/g, ""))[0] &&
                (n++, (this.negative = 1)),
                n < t.length &&
                  (16 === e
                    ? this._parseHex(t, n, r)
                    : (this._parseBase(t, e, n),
                      "le" === r && this._initArray(this.toArray(), e, r)));
            }),
            (o.prototype._initNumber = function (t, e, r) {
              t < 0 && ((this.negative = 1), (t = -t)),
                t < 67108864
                  ? ((this.words = [67108863 & t]), (this.length = 1))
                  : t < 4503599627370496
                  ? ((this.words = [67108863 & t, (t / 67108864) & 67108863]),
                    (this.length = 2))
                  : (i(t < 9007199254740992),
                    (this.words = [67108863 & t, (t / 67108864) & 67108863, 1]),
                    (this.length = 3)),
                "le" === r && this._initArray(this.toArray(), e, r);
            }),
            (o.prototype._initArray = function (t, e, r) {
              if ((i("number" == typeof t.length), t.length <= 0))
                return (this.words = [0]), (this.length = 1), this;
              (this.length = Math.ceil(t.length / 3)),
                (this.words = new Array(this.length));
              for (var n = 0; n < this.length; n++) this.words[n] = 0;
              var o,
                s,
                a = 0;
              if ("be" === r)
                for (n = t.length - 1, o = 0; n >= 0; n -= 3)
                  (s = t[n] | (t[n - 1] << 8) | (t[n - 2] << 16)),
                    (this.words[o] |= (s << a) & 67108863),
                    (this.words[o + 1] = (s >>> (26 - a)) & 67108863),
                    (a += 24) >= 26 && ((a -= 26), o++);
              else if ("le" === r)
                for (n = 0, o = 0; n < t.length; n += 3)
                  (s = t[n] | (t[n + 1] << 8) | (t[n + 2] << 16)),
                    (this.words[o] |= (s << a) & 67108863),
                    (this.words[o + 1] = (s >>> (26 - a)) & 67108863),
                    (a += 24) >= 26 && ((a -= 26), o++);
              return this._strip();
            }),
            (o.prototype._parseHex = function (t, e, r) {
              (this.length = Math.ceil((t.length - e) / 6)),
                (this.words = new Array(this.length));
              for (var i = 0; i < this.length; i++) this.words[i] = 0;
              var n,
                o = 0,
                s = 0;
              if ("be" === r)
                for (i = t.length - 1; i >= e; i -= 2)
                  (n = f(t, e, i) << o),
                    (this.words[s] |= 67108863 & n),
                    o >= 18
                      ? ((o -= 18), (s += 1), (this.words[s] |= n >>> 26))
                      : (o += 8);
              else
                for (
                  i = (t.length - e) % 2 == 0 ? e + 1 : e;
                  i < t.length;
                  i += 2
                )
                  (n = f(t, e, i) << o),
                    (this.words[s] |= 67108863 & n),
                    o >= 18
                      ? ((o -= 18), (s += 1), (this.words[s] |= n >>> 26))
                      : (o += 8);
              this._strip();
            }),
            (o.prototype._parseBase = function (t, e, r) {
              (this.words = [0]), (this.length = 1);
              for (var i = 0, n = 1; n <= 67108863; n *= e) i++;
              i--, (n = (n / e) | 0);
              for (
                var o = t.length - r,
                  s = o % i,
                  a = Math.min(o, o - s) + r,
                  f = 0,
                  u = r;
                u < a;
                u += i
              )
                (f = h(t, u, u + i, e)),
                  this.imuln(n),
                  this.words[0] + f < 67108864
                    ? (this.words[0] += f)
                    : this._iaddn(f);
              if (0 !== s) {
                var c = 1;
                for (f = h(t, u, t.length, e), u = 0; u < s; u++) c *= e;
                this.imuln(c),
                  this.words[0] + f < 67108864
                    ? (this.words[0] += f)
                    : this._iaddn(f);
              }
              this._strip();
            }),
            (o.prototype.copy = function (t) {
              t.words = new Array(this.length);
              for (var e = 0; e < this.length; e++) t.words[e] = this.words[e];
              (t.length = this.length),
                (t.negative = this.negative),
                (t.red = this.red);
            }),
            (o.prototype._move = function (t) {
              u(t, this);
            }),
            (o.prototype.clone = function () {
              var t = new o(null);
              return this.copy(t), t;
            }),
            (o.prototype._expand = function (t) {
              for (; this.length < t; ) this.words[this.length++] = 0;
              return this;
            }),
            (o.prototype._strip = function () {
              for (; this.length > 1 && 0 === this.words[this.length - 1]; )
                this.length--;
              return this._normSign();
            }),
            (o.prototype._normSign = function () {
              return (
                1 === this.length && 0 === this.words[0] && (this.negative = 0),
                this
              );
            }),
            "undefined" != typeof Symbol && "function" == typeof Symbol.for)
          )
            try {
              o.prototype[Symbol.for("nodejs.util.inspect.custom")] = c;
            } catch (t) {
              o.prototype.inspect = c;
            }
          else o.prototype.inspect = c;
          function c() {
            return (this.red ? "<BN-R: " : "<BN: ") + this.toString(16) + ">";
          }
          var d = [
              "",
              "0",
              "00",
              "000",
              "0000",
              "00000",
              "000000",
              "0000000",
              "00000000",
              "000000000",
              "0000000000",
              "00000000000",
              "000000000000",
              "0000000000000",
              "00000000000000",
              "000000000000000",
              "0000000000000000",
              "00000000000000000",
              "000000000000000000",
              "0000000000000000000",
              "00000000000000000000",
              "000000000000000000000",
              "0000000000000000000000",
              "00000000000000000000000",
              "000000000000000000000000",
              "0000000000000000000000000",
            ],
            l = [
              0, 0, 25, 16, 12, 11, 10, 9, 8, 8, 7, 7, 7, 7, 6, 6, 6, 6, 6, 6,
              6, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
            ],
            p = [
              0, 0, 33554432, 43046721, 16777216, 48828125, 60466176, 40353607,
              16777216, 43046721, 1e7, 19487171, 35831808, 62748517, 7529536,
              11390625, 16777216, 24137569, 34012224, 47045881, 64e6, 4084101,
              5153632, 6436343, 7962624, 9765625, 11881376, 14348907, 17210368,
              20511149, 243e5, 28629151, 33554432, 39135393, 45435424, 52521875,
              60466176,
            ];
          (o.prototype.toString = function (t, e) {
            var r;
            if (((e = 0 | e || 1), 16 === (t = t || 10) || "hex" === t)) {
              r = "";
              for (var n = 0, o = 0, s = 0; s < this.length; s++) {
                var a = this.words[s],
                  f = (16777215 & ((a << n) | o)).toString(16);
                (r =
                  0 !== (o = (a >>> (24 - n)) & 16777215) ||
                  s !== this.length - 1
                    ? d[6 - f.length] + f + r
                    : f + r),
                  (n += 2) >= 26 && ((n -= 26), s--);
              }
              for (0 !== o && (r = o.toString(16) + r); r.length % e != 0; )
                r = "0" + r;
              return 0 !== this.negative && (r = "-" + r), r;
            }
            if (t === (0 | t) && t >= 2 && t <= 36) {
              var h = l[t],
                u = p[t];
              r = "";
              var c = this.clone();
              for (c.negative = 0; !c.isZero(); ) {
                var b = c.modrn(u).toString(t);
                r = (c = c.idivn(u)).isZero() ? b + r : d[h - b.length] + b + r;
              }
              for (this.isZero() && (r = "0" + r); r.length % e != 0; )
                r = "0" + r;
              return 0 !== this.negative && (r = "-" + r), r;
            }
            i(!1, "Base should be between 2 and 36");
          }),
            (o.prototype.toNumber = function () {
              var t = this.words[0];
              return (
                2 === this.length
                  ? (t += 67108864 * this.words[1])
                  : 3 === this.length && 1 === this.words[2]
                  ? (t += 4503599627370496 + 67108864 * this.words[1])
                  : this.length > 2 &&
                    i(!1, "Number can only safely store up to 53 bits"),
                0 !== this.negative ? -t : t
              );
            }),
            (o.prototype.toJSON = function () {
              return this.toString(16, 2);
            }),
            s &&
              (o.prototype.toBuffer = function (t, e) {
                return this.toArrayLike(s, t, e);
              }),
            (o.prototype.toArray = function (t, e) {
              return this.toArrayLike(Array, t, e);
            });
          function b(t, e, r) {
            r.negative = e.negative ^ t.negative;
            var i = (t.length + e.length) | 0;
            (r.length = i), (i = (i - 1) | 0);
            var n = 0 | t.words[0],
              o = 0 | e.words[0],
              s = n * o,
              a = 67108863 & s,
              f = (s / 67108864) | 0;
            r.words[0] = a;
            for (var h = 1; h < i; h++) {
              for (
                var u = f >>> 26,
                  c = 67108863 & f,
                  d = Math.min(h, e.length - 1),
                  l = Math.max(0, h - t.length + 1);
                l <= d;
                l++
              ) {
                var p = (h - l) | 0;
                (u +=
                  ((s = (n = 0 | t.words[p]) * (o = 0 | e.words[l]) + c) /
                    67108864) |
                  0),
                  (c = 67108863 & s);
              }
              (r.words[h] = 0 | c), (f = 0 | u);
            }
            return 0 !== f ? (r.words[h] = 0 | f) : r.length--, r._strip();
          }
          (o.prototype.toArrayLike = function (t, e, r) {
            this._strip();
            var n = this.byteLength(),
              o = r || Math.max(1, n);
            i(n <= o, "byte array longer than desired length"),
              i(o > 0, "Requested array length <= 0");
            var s = (function (t, e) {
              return t.allocUnsafe ? t.allocUnsafe(e) : new t(e);
            })(t, o);
            return this["_toArrayLike" + ("le" === e ? "LE" : "BE")](s, n), s;
          }),
            (o.prototype._toArrayLikeLE = function (t, e) {
              for (var r = 0, i = 0, n = 0, o = 0; n < this.length; n++) {
                var s = (this.words[n] << o) | i;
                (t[r++] = 255 & s),
                  r < t.length && (t[r++] = (s >> 8) & 255),
                  r < t.length && (t[r++] = (s >> 16) & 255),
                  6 === o
                    ? (r < t.length && (t[r++] = (s >> 24) & 255),
                      (i = 0),
                      (o = 0))
                    : ((i = s >>> 24), (o += 2));
              }
              if (r < t.length) for (t[r++] = i; r < t.length; ) t[r++] = 0;
            }),
            (o.prototype._toArrayLikeBE = function (t, e) {
              for (
                var r = t.length - 1, i = 0, n = 0, o = 0;
                n < this.length;
                n++
              ) {
                var s = (this.words[n] << o) | i;
                (t[r--] = 255 & s),
                  r >= 0 && (t[r--] = (s >> 8) & 255),
                  r >= 0 && (t[r--] = (s >> 16) & 255),
                  6 === o
                    ? (r >= 0 && (t[r--] = (s >> 24) & 255), (i = 0), (o = 0))
                    : ((i = s >>> 24), (o += 2));
              }
              if (r >= 0) for (t[r--] = i; r >= 0; ) t[r--] = 0;
            }),
            Math.clz32
              ? (o.prototype._countBits = function (t) {
                  return 32 - Math.clz32(t);
                })
              : (o.prototype._countBits = function (t) {
                  var e = t,
                    r = 0;
                  return (
                    e >= 4096 && ((r += 13), (e >>>= 13)),
                    e >= 64 && ((r += 7), (e >>>= 7)),
                    e >= 8 && ((r += 4), (e >>>= 4)),
                    e >= 2 && ((r += 2), (e >>>= 2)),
                    r + e
                  );
                }),
            (o.prototype._zeroBits = function (t) {
              if (0 === t) return 26;
              var e = t,
                r = 0;
              return (
                0 == (8191 & e) && ((r += 13), (e >>>= 13)),
                0 == (127 & e) && ((r += 7), (e >>>= 7)),
                0 == (15 & e) && ((r += 4), (e >>>= 4)),
                0 == (3 & e) && ((r += 2), (e >>>= 2)),
                0 == (1 & e) && r++,
                r
              );
            }),
            (o.prototype.bitLength = function () {
              var t = this.words[this.length - 1],
                e = this._countBits(t);
              return 26 * (this.length - 1) + e;
            }),
            (o.prototype.zeroBits = function () {
              if (this.isZero()) return 0;
              for (var t = 0, e = 0; e < this.length; e++) {
                var r = this._zeroBits(this.words[e]);
                if (((t += r), 26 !== r)) break;
              }
              return t;
            }),
            (o.prototype.byteLength = function () {
              return Math.ceil(this.bitLength() / 8);
            }),
            (o.prototype.toTwos = function (t) {
              return 0 !== this.negative
                ? this.abs().inotn(t).iaddn(1)
                : this.clone();
            }),
            (o.prototype.fromTwos = function (t) {
              return this.testn(t - 1)
                ? this.notn(t).iaddn(1).ineg()
                : this.clone();
            }),
            (o.prototype.isNeg = function () {
              return 0 !== this.negative;
            }),
            (o.prototype.neg = function () {
              return this.clone().ineg();
            }),
            (o.prototype.ineg = function () {
              return this.isZero() || (this.negative ^= 1), this;
            }),
            (o.prototype.iuor = function (t) {
              for (; this.length < t.length; ) this.words[this.length++] = 0;
              for (var e = 0; e < t.length; e++)
                this.words[e] = this.words[e] | t.words[e];
              return this._strip();
            }),
            (o.prototype.ior = function (t) {
              return i(0 == (this.negative | t.negative)), this.iuor(t);
            }),
            (o.prototype.or = function (t) {
              return this.length > t.length
                ? this.clone().ior(t)
                : t.clone().ior(this);
            }),
            (o.prototype.uor = function (t) {
              return this.length > t.length
                ? this.clone().iuor(t)
                : t.clone().iuor(this);
            }),
            (o.prototype.iuand = function (t) {
              var e;
              e = this.length > t.length ? t : this;
              for (var r = 0; r < e.length; r++)
                this.words[r] = this.words[r] & t.words[r];
              return (this.length = e.length), this._strip();
            }),
            (o.prototype.iand = function (t) {
              return i(0 == (this.negative | t.negative)), this.iuand(t);
            }),
            (o.prototype.and = function (t) {
              return this.length > t.length
                ? this.clone().iand(t)
                : t.clone().iand(this);
            }),
            (o.prototype.uand = function (t) {
              return this.length > t.length
                ? this.clone().iuand(t)
                : t.clone().iuand(this);
            }),
            (o.prototype.iuxor = function (t) {
              var e, r;
              this.length > t.length
                ? ((e = this), (r = t))
                : ((e = t), (r = this));
              for (var i = 0; i < r.length; i++)
                this.words[i] = e.words[i] ^ r.words[i];
              if (this !== e)
                for (; i < e.length; i++) this.words[i] = e.words[i];
              return (this.length = e.length), this._strip();
            }),
            (o.prototype.ixor = function (t) {
              return i(0 == (this.negative | t.negative)), this.iuxor(t);
            }),
            (o.prototype.xor = function (t) {
              return this.length > t.length
                ? this.clone().ixor(t)
                : t.clone().ixor(this);
            }),
            (o.prototype.uxor = function (t) {
              return this.length > t.length
                ? this.clone().iuxor(t)
                : t.clone().iuxor(this);
            }),
            (o.prototype.inotn = function (t) {
              i("number" == typeof t && t >= 0);
              var e = 0 | Math.ceil(t / 26),
                r = t % 26;
              this._expand(e), r > 0 && e--;
              for (var n = 0; n < e; n++)
                this.words[n] = 67108863 & ~this.words[n];
              return (
                r > 0 &&
                  (this.words[n] = ~this.words[n] & (67108863 >> (26 - r))),
                this._strip()
              );
            }),
            (o.prototype.notn = function (t) {
              return this.clone().inotn(t);
            }),
            (o.prototype.setn = function (t, e) {
              i("number" == typeof t && t >= 0);
              var r = (t / 26) | 0,
                n = t % 26;
              return (
                this._expand(r + 1),
                (this.words[r] = e
                  ? this.words[r] | (1 << n)
                  : this.words[r] & ~(1 << n)),
                this._strip()
              );
            }),
            (o.prototype.iadd = function (t) {
              var e, r, i;
              if (0 !== this.negative && 0 === t.negative)
                return (
                  (this.negative = 0),
                  (e = this.isub(t)),
                  (this.negative ^= 1),
                  this._normSign()
                );
              if (0 === this.negative && 0 !== t.negative)
                return (
                  (t.negative = 0),
                  (e = this.isub(t)),
                  (t.negative = 1),
                  e._normSign()
                );
              this.length > t.length
                ? ((r = this), (i = t))
                : ((r = t), (i = this));
              for (var n = 0, o = 0; o < i.length; o++)
                (e = (0 | r.words[o]) + (0 | i.words[o]) + n),
                  (this.words[o] = 67108863 & e),
                  (n = e >>> 26);
              for (; 0 !== n && o < r.length; o++)
                (e = (0 | r.words[o]) + n),
                  (this.words[o] = 67108863 & e),
                  (n = e >>> 26);
              if (((this.length = r.length), 0 !== n))
                (this.words[this.length] = n), this.length++;
              else if (r !== this)
                for (; o < r.length; o++) this.words[o] = r.words[o];
              return this;
            }),
            (o.prototype.add = function (t) {
              var e;
              return 0 !== t.negative && 0 === this.negative
                ? ((t.negative = 0), (e = this.sub(t)), (t.negative ^= 1), e)
                : 0 === t.negative && 0 !== this.negative
                ? ((this.negative = 0),
                  (e = t.sub(this)),
                  (this.negative = 1),
                  e)
                : this.length > t.length
                ? this.clone().iadd(t)
                : t.clone().iadd(this);
            }),
            (o.prototype.isub = function (t) {
              if (0 !== t.negative) {
                t.negative = 0;
                var e = this.iadd(t);
                return (t.negative = 1), e._normSign();
              }
              if (0 !== this.negative)
                return (
                  (this.negative = 0),
                  this.iadd(t),
                  (this.negative = 1),
                  this._normSign()
                );
              var r,
                i,
                n = this.cmp(t);
              if (0 === n)
                return (
                  (this.negative = 0),
                  (this.length = 1),
                  (this.words[0] = 0),
                  this
                );
              n > 0 ? ((r = this), (i = t)) : ((r = t), (i = this));
              for (var o = 0, s = 0; s < i.length; s++)
                (o = (e = (0 | r.words[s]) - (0 | i.words[s]) + o) >> 26),
                  (this.words[s] = 67108863 & e);
              for (; 0 !== o && s < r.length; s++)
                (o = (e = (0 | r.words[s]) + o) >> 26),
                  (this.words[s] = 67108863 & e);
              if (0 === o && s < r.length && r !== this)
                for (; s < r.length; s++) this.words[s] = r.words[s];
              return (
                (this.length = Math.max(this.length, s)),
                r !== this && (this.negative = 1),
                this._strip()
              );
            }),
            (o.prototype.sub = function (t) {
              return this.clone().isub(t);
            });
          var m = function (t, e, r) {
            var i,
              n,
              o,
              s = t.words,
              a = e.words,
              f = r.words,
              h = 0,
              u = 0 | s[0],
              c = 8191 & u,
              d = u >>> 13,
              l = 0 | s[1],
              p = 8191 & l,
              b = l >>> 13,
              m = 0 | s[2],
              y = 8191 & m,
              g = m >>> 13,
              v = 0 | s[3],
              w = 8191 & v,
              _ = v >>> 13,
              M = 0 | s[4],
              S = 8191 & M,
              E = M >>> 13,
              A = 0 | s[5],
              k = 8191 & A,
              B = A >>> 13,
              x = 0 | s[6],
              I = 8191 & x,
              R = x >>> 13,
              j = 0 | s[7],
              T = 8191 & j,
              L = j >>> 13,
              C = 0 | s[8],
              P = 8191 & C,
              O = C >>> 13,
              U = 0 | s[9],
              D = 8191 & U,
              N = U >>> 13,
              q = 0 | a[0],
              z = 8191 & q,
              F = q >>> 13,
              K = 0 | a[1],
              H = 8191 & K,
              W = K >>> 13,
              V = 0 | a[2],
              Z = 8191 & V,
              G = V >>> 13,
              X = 0 | a[3],
              Y = 8191 & X,
              $ = X >>> 13,
              J = 0 | a[4],
              Q = 8191 & J,
              tt = J >>> 13,
              et = 0 | a[5],
              rt = 8191 & et,
              it = et >>> 13,
              nt = 0 | a[6],
              ot = 8191 & nt,
              st = nt >>> 13,
              at = 0 | a[7],
              ft = 8191 & at,
              ht = at >>> 13,
              ut = 0 | a[8],
              ct = 8191 & ut,
              dt = ut >>> 13,
              lt = 0 | a[9],
              pt = 8191 & lt,
              bt = lt >>> 13;
            (r.negative = t.negative ^ e.negative), (r.length = 19);
            var mt =
              (((h + (i = Math.imul(c, z))) | 0) +
                ((8191 & (n = ((n = Math.imul(c, F)) + Math.imul(d, z)) | 0)) <<
                  13)) |
              0;
            (h =
              ((((o = Math.imul(d, F)) + (n >>> 13)) | 0) + (mt >>> 26)) | 0),
              (mt &= 67108863),
              (i = Math.imul(p, z)),
              (n = ((n = Math.imul(p, F)) + Math.imul(b, z)) | 0),
              (o = Math.imul(b, F));
            var yt =
              (((h + (i = (i + Math.imul(c, H)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, W)) | 0) + Math.imul(d, H)) | 0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, W)) | 0) + (n >>> 13)) | 0) +
                (yt >>> 26)) |
              0),
              (yt &= 67108863),
              (i = Math.imul(y, z)),
              (n = ((n = Math.imul(y, F)) + Math.imul(g, z)) | 0),
              (o = Math.imul(g, F)),
              (i = (i + Math.imul(p, H)) | 0),
              (n = ((n = (n + Math.imul(p, W)) | 0) + Math.imul(b, H)) | 0),
              (o = (o + Math.imul(b, W)) | 0);
            var gt =
              (((h + (i = (i + Math.imul(c, Z)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, G)) | 0) + Math.imul(d, Z)) | 0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, G)) | 0) + (n >>> 13)) | 0) +
                (gt >>> 26)) |
              0),
              (gt &= 67108863),
              (i = Math.imul(w, z)),
              (n = ((n = Math.imul(w, F)) + Math.imul(_, z)) | 0),
              (o = Math.imul(_, F)),
              (i = (i + Math.imul(y, H)) | 0),
              (n = ((n = (n + Math.imul(y, W)) | 0) + Math.imul(g, H)) | 0),
              (o = (o + Math.imul(g, W)) | 0),
              (i = (i + Math.imul(p, Z)) | 0),
              (n = ((n = (n + Math.imul(p, G)) | 0) + Math.imul(b, Z)) | 0),
              (o = (o + Math.imul(b, G)) | 0);
            var vt =
              (((h + (i = (i + Math.imul(c, Y)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, $)) | 0) + Math.imul(d, Y)) | 0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, $)) | 0) + (n >>> 13)) | 0) +
                (vt >>> 26)) |
              0),
              (vt &= 67108863),
              (i = Math.imul(S, z)),
              (n = ((n = Math.imul(S, F)) + Math.imul(E, z)) | 0),
              (o = Math.imul(E, F)),
              (i = (i + Math.imul(w, H)) | 0),
              (n = ((n = (n + Math.imul(w, W)) | 0) + Math.imul(_, H)) | 0),
              (o = (o + Math.imul(_, W)) | 0),
              (i = (i + Math.imul(y, Z)) | 0),
              (n = ((n = (n + Math.imul(y, G)) | 0) + Math.imul(g, Z)) | 0),
              (o = (o + Math.imul(g, G)) | 0),
              (i = (i + Math.imul(p, Y)) | 0),
              (n = ((n = (n + Math.imul(p, $)) | 0) + Math.imul(b, Y)) | 0),
              (o = (o + Math.imul(b, $)) | 0);
            var wt =
              (((h + (i = (i + Math.imul(c, Q)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, tt)) | 0) + Math.imul(d, Q)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, tt)) | 0) + (n >>> 13)) | 0) +
                (wt >>> 26)) |
              0),
              (wt &= 67108863),
              (i = Math.imul(k, z)),
              (n = ((n = Math.imul(k, F)) + Math.imul(B, z)) | 0),
              (o = Math.imul(B, F)),
              (i = (i + Math.imul(S, H)) | 0),
              (n = ((n = (n + Math.imul(S, W)) | 0) + Math.imul(E, H)) | 0),
              (o = (o + Math.imul(E, W)) | 0),
              (i = (i + Math.imul(w, Z)) | 0),
              (n = ((n = (n + Math.imul(w, G)) | 0) + Math.imul(_, Z)) | 0),
              (o = (o + Math.imul(_, G)) | 0),
              (i = (i + Math.imul(y, Y)) | 0),
              (n = ((n = (n + Math.imul(y, $)) | 0) + Math.imul(g, Y)) | 0),
              (o = (o + Math.imul(g, $)) | 0),
              (i = (i + Math.imul(p, Q)) | 0),
              (n = ((n = (n + Math.imul(p, tt)) | 0) + Math.imul(b, Q)) | 0),
              (o = (o + Math.imul(b, tt)) | 0);
            var _t =
              (((h + (i = (i + Math.imul(c, rt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, it)) | 0) + Math.imul(d, rt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, it)) | 0) + (n >>> 13)) | 0) +
                (_t >>> 26)) |
              0),
              (_t &= 67108863),
              (i = Math.imul(I, z)),
              (n = ((n = Math.imul(I, F)) + Math.imul(R, z)) | 0),
              (o = Math.imul(R, F)),
              (i = (i + Math.imul(k, H)) | 0),
              (n = ((n = (n + Math.imul(k, W)) | 0) + Math.imul(B, H)) | 0),
              (o = (o + Math.imul(B, W)) | 0),
              (i = (i + Math.imul(S, Z)) | 0),
              (n = ((n = (n + Math.imul(S, G)) | 0) + Math.imul(E, Z)) | 0),
              (o = (o + Math.imul(E, G)) | 0),
              (i = (i + Math.imul(w, Y)) | 0),
              (n = ((n = (n + Math.imul(w, $)) | 0) + Math.imul(_, Y)) | 0),
              (o = (o + Math.imul(_, $)) | 0),
              (i = (i + Math.imul(y, Q)) | 0),
              (n = ((n = (n + Math.imul(y, tt)) | 0) + Math.imul(g, Q)) | 0),
              (o = (o + Math.imul(g, tt)) | 0),
              (i = (i + Math.imul(p, rt)) | 0),
              (n = ((n = (n + Math.imul(p, it)) | 0) + Math.imul(b, rt)) | 0),
              (o = (o + Math.imul(b, it)) | 0);
            var Mt =
              (((h + (i = (i + Math.imul(c, ot)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, st)) | 0) + Math.imul(d, ot)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, st)) | 0) + (n >>> 13)) | 0) +
                (Mt >>> 26)) |
              0),
              (Mt &= 67108863),
              (i = Math.imul(T, z)),
              (n = ((n = Math.imul(T, F)) + Math.imul(L, z)) | 0),
              (o = Math.imul(L, F)),
              (i = (i + Math.imul(I, H)) | 0),
              (n = ((n = (n + Math.imul(I, W)) | 0) + Math.imul(R, H)) | 0),
              (o = (o + Math.imul(R, W)) | 0),
              (i = (i + Math.imul(k, Z)) | 0),
              (n = ((n = (n + Math.imul(k, G)) | 0) + Math.imul(B, Z)) | 0),
              (o = (o + Math.imul(B, G)) | 0),
              (i = (i + Math.imul(S, Y)) | 0),
              (n = ((n = (n + Math.imul(S, $)) | 0) + Math.imul(E, Y)) | 0),
              (o = (o + Math.imul(E, $)) | 0),
              (i = (i + Math.imul(w, Q)) | 0),
              (n = ((n = (n + Math.imul(w, tt)) | 0) + Math.imul(_, Q)) | 0),
              (o = (o + Math.imul(_, tt)) | 0),
              (i = (i + Math.imul(y, rt)) | 0),
              (n = ((n = (n + Math.imul(y, it)) | 0) + Math.imul(g, rt)) | 0),
              (o = (o + Math.imul(g, it)) | 0),
              (i = (i + Math.imul(p, ot)) | 0),
              (n = ((n = (n + Math.imul(p, st)) | 0) + Math.imul(b, ot)) | 0),
              (o = (o + Math.imul(b, st)) | 0);
            var St =
              (((h + (i = (i + Math.imul(c, ft)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, ht)) | 0) + Math.imul(d, ft)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, ht)) | 0) + (n >>> 13)) | 0) +
                (St >>> 26)) |
              0),
              (St &= 67108863),
              (i = Math.imul(P, z)),
              (n = ((n = Math.imul(P, F)) + Math.imul(O, z)) | 0),
              (o = Math.imul(O, F)),
              (i = (i + Math.imul(T, H)) | 0),
              (n = ((n = (n + Math.imul(T, W)) | 0) + Math.imul(L, H)) | 0),
              (o = (o + Math.imul(L, W)) | 0),
              (i = (i + Math.imul(I, Z)) | 0),
              (n = ((n = (n + Math.imul(I, G)) | 0) + Math.imul(R, Z)) | 0),
              (o = (o + Math.imul(R, G)) | 0),
              (i = (i + Math.imul(k, Y)) | 0),
              (n = ((n = (n + Math.imul(k, $)) | 0) + Math.imul(B, Y)) | 0),
              (o = (o + Math.imul(B, $)) | 0),
              (i = (i + Math.imul(S, Q)) | 0),
              (n = ((n = (n + Math.imul(S, tt)) | 0) + Math.imul(E, Q)) | 0),
              (o = (o + Math.imul(E, tt)) | 0),
              (i = (i + Math.imul(w, rt)) | 0),
              (n = ((n = (n + Math.imul(w, it)) | 0) + Math.imul(_, rt)) | 0),
              (o = (o + Math.imul(_, it)) | 0),
              (i = (i + Math.imul(y, ot)) | 0),
              (n = ((n = (n + Math.imul(y, st)) | 0) + Math.imul(g, ot)) | 0),
              (o = (o + Math.imul(g, st)) | 0),
              (i = (i + Math.imul(p, ft)) | 0),
              (n = ((n = (n + Math.imul(p, ht)) | 0) + Math.imul(b, ft)) | 0),
              (o = (o + Math.imul(b, ht)) | 0);
            var Et =
              (((h + (i = (i + Math.imul(c, ct)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, dt)) | 0) + Math.imul(d, ct)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, dt)) | 0) + (n >>> 13)) | 0) +
                (Et >>> 26)) |
              0),
              (Et &= 67108863),
              (i = Math.imul(D, z)),
              (n = ((n = Math.imul(D, F)) + Math.imul(N, z)) | 0),
              (o = Math.imul(N, F)),
              (i = (i + Math.imul(P, H)) | 0),
              (n = ((n = (n + Math.imul(P, W)) | 0) + Math.imul(O, H)) | 0),
              (o = (o + Math.imul(O, W)) | 0),
              (i = (i + Math.imul(T, Z)) | 0),
              (n = ((n = (n + Math.imul(T, G)) | 0) + Math.imul(L, Z)) | 0),
              (o = (o + Math.imul(L, G)) | 0),
              (i = (i + Math.imul(I, Y)) | 0),
              (n = ((n = (n + Math.imul(I, $)) | 0) + Math.imul(R, Y)) | 0),
              (o = (o + Math.imul(R, $)) | 0),
              (i = (i + Math.imul(k, Q)) | 0),
              (n = ((n = (n + Math.imul(k, tt)) | 0) + Math.imul(B, Q)) | 0),
              (o = (o + Math.imul(B, tt)) | 0),
              (i = (i + Math.imul(S, rt)) | 0),
              (n = ((n = (n + Math.imul(S, it)) | 0) + Math.imul(E, rt)) | 0),
              (o = (o + Math.imul(E, it)) | 0),
              (i = (i + Math.imul(w, ot)) | 0),
              (n = ((n = (n + Math.imul(w, st)) | 0) + Math.imul(_, ot)) | 0),
              (o = (o + Math.imul(_, st)) | 0),
              (i = (i + Math.imul(y, ft)) | 0),
              (n = ((n = (n + Math.imul(y, ht)) | 0) + Math.imul(g, ft)) | 0),
              (o = (o + Math.imul(g, ht)) | 0),
              (i = (i + Math.imul(p, ct)) | 0),
              (n = ((n = (n + Math.imul(p, dt)) | 0) + Math.imul(b, ct)) | 0),
              (o = (o + Math.imul(b, dt)) | 0);
            var At =
              (((h + (i = (i + Math.imul(c, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(c, bt)) | 0) + Math.imul(d, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(d, bt)) | 0) + (n >>> 13)) | 0) +
                (At >>> 26)) |
              0),
              (At &= 67108863),
              (i = Math.imul(D, H)),
              (n = ((n = Math.imul(D, W)) + Math.imul(N, H)) | 0),
              (o = Math.imul(N, W)),
              (i = (i + Math.imul(P, Z)) | 0),
              (n = ((n = (n + Math.imul(P, G)) | 0) + Math.imul(O, Z)) | 0),
              (o = (o + Math.imul(O, G)) | 0),
              (i = (i + Math.imul(T, Y)) | 0),
              (n = ((n = (n + Math.imul(T, $)) | 0) + Math.imul(L, Y)) | 0),
              (o = (o + Math.imul(L, $)) | 0),
              (i = (i + Math.imul(I, Q)) | 0),
              (n = ((n = (n + Math.imul(I, tt)) | 0) + Math.imul(R, Q)) | 0),
              (o = (o + Math.imul(R, tt)) | 0),
              (i = (i + Math.imul(k, rt)) | 0),
              (n = ((n = (n + Math.imul(k, it)) | 0) + Math.imul(B, rt)) | 0),
              (o = (o + Math.imul(B, it)) | 0),
              (i = (i + Math.imul(S, ot)) | 0),
              (n = ((n = (n + Math.imul(S, st)) | 0) + Math.imul(E, ot)) | 0),
              (o = (o + Math.imul(E, st)) | 0),
              (i = (i + Math.imul(w, ft)) | 0),
              (n = ((n = (n + Math.imul(w, ht)) | 0) + Math.imul(_, ft)) | 0),
              (o = (o + Math.imul(_, ht)) | 0),
              (i = (i + Math.imul(y, ct)) | 0),
              (n = ((n = (n + Math.imul(y, dt)) | 0) + Math.imul(g, ct)) | 0),
              (o = (o + Math.imul(g, dt)) | 0);
            var kt =
              (((h + (i = (i + Math.imul(p, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(p, bt)) | 0) + Math.imul(b, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(b, bt)) | 0) + (n >>> 13)) | 0) +
                (kt >>> 26)) |
              0),
              (kt &= 67108863),
              (i = Math.imul(D, Z)),
              (n = ((n = Math.imul(D, G)) + Math.imul(N, Z)) | 0),
              (o = Math.imul(N, G)),
              (i = (i + Math.imul(P, Y)) | 0),
              (n = ((n = (n + Math.imul(P, $)) | 0) + Math.imul(O, Y)) | 0),
              (o = (o + Math.imul(O, $)) | 0),
              (i = (i + Math.imul(T, Q)) | 0),
              (n = ((n = (n + Math.imul(T, tt)) | 0) + Math.imul(L, Q)) | 0),
              (o = (o + Math.imul(L, tt)) | 0),
              (i = (i + Math.imul(I, rt)) | 0),
              (n = ((n = (n + Math.imul(I, it)) | 0) + Math.imul(R, rt)) | 0),
              (o = (o + Math.imul(R, it)) | 0),
              (i = (i + Math.imul(k, ot)) | 0),
              (n = ((n = (n + Math.imul(k, st)) | 0) + Math.imul(B, ot)) | 0),
              (o = (o + Math.imul(B, st)) | 0),
              (i = (i + Math.imul(S, ft)) | 0),
              (n = ((n = (n + Math.imul(S, ht)) | 0) + Math.imul(E, ft)) | 0),
              (o = (o + Math.imul(E, ht)) | 0),
              (i = (i + Math.imul(w, ct)) | 0),
              (n = ((n = (n + Math.imul(w, dt)) | 0) + Math.imul(_, ct)) | 0),
              (o = (o + Math.imul(_, dt)) | 0);
            var Bt =
              (((h + (i = (i + Math.imul(y, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(y, bt)) | 0) + Math.imul(g, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(g, bt)) | 0) + (n >>> 13)) | 0) +
                (Bt >>> 26)) |
              0),
              (Bt &= 67108863),
              (i = Math.imul(D, Y)),
              (n = ((n = Math.imul(D, $)) + Math.imul(N, Y)) | 0),
              (o = Math.imul(N, $)),
              (i = (i + Math.imul(P, Q)) | 0),
              (n = ((n = (n + Math.imul(P, tt)) | 0) + Math.imul(O, Q)) | 0),
              (o = (o + Math.imul(O, tt)) | 0),
              (i = (i + Math.imul(T, rt)) | 0),
              (n = ((n = (n + Math.imul(T, it)) | 0) + Math.imul(L, rt)) | 0),
              (o = (o + Math.imul(L, it)) | 0),
              (i = (i + Math.imul(I, ot)) | 0),
              (n = ((n = (n + Math.imul(I, st)) | 0) + Math.imul(R, ot)) | 0),
              (o = (o + Math.imul(R, st)) | 0),
              (i = (i + Math.imul(k, ft)) | 0),
              (n = ((n = (n + Math.imul(k, ht)) | 0) + Math.imul(B, ft)) | 0),
              (o = (o + Math.imul(B, ht)) | 0),
              (i = (i + Math.imul(S, ct)) | 0),
              (n = ((n = (n + Math.imul(S, dt)) | 0) + Math.imul(E, ct)) | 0),
              (o = (o + Math.imul(E, dt)) | 0);
            var xt =
              (((h + (i = (i + Math.imul(w, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(w, bt)) | 0) + Math.imul(_, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(_, bt)) | 0) + (n >>> 13)) | 0) +
                (xt >>> 26)) |
              0),
              (xt &= 67108863),
              (i = Math.imul(D, Q)),
              (n = ((n = Math.imul(D, tt)) + Math.imul(N, Q)) | 0),
              (o = Math.imul(N, tt)),
              (i = (i + Math.imul(P, rt)) | 0),
              (n = ((n = (n + Math.imul(P, it)) | 0) + Math.imul(O, rt)) | 0),
              (o = (o + Math.imul(O, it)) | 0),
              (i = (i + Math.imul(T, ot)) | 0),
              (n = ((n = (n + Math.imul(T, st)) | 0) + Math.imul(L, ot)) | 0),
              (o = (o + Math.imul(L, st)) | 0),
              (i = (i + Math.imul(I, ft)) | 0),
              (n = ((n = (n + Math.imul(I, ht)) | 0) + Math.imul(R, ft)) | 0),
              (o = (o + Math.imul(R, ht)) | 0),
              (i = (i + Math.imul(k, ct)) | 0),
              (n = ((n = (n + Math.imul(k, dt)) | 0) + Math.imul(B, ct)) | 0),
              (o = (o + Math.imul(B, dt)) | 0);
            var It =
              (((h + (i = (i + Math.imul(S, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(S, bt)) | 0) + Math.imul(E, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(E, bt)) | 0) + (n >>> 13)) | 0) +
                (It >>> 26)) |
              0),
              (It &= 67108863),
              (i = Math.imul(D, rt)),
              (n = ((n = Math.imul(D, it)) + Math.imul(N, rt)) | 0),
              (o = Math.imul(N, it)),
              (i = (i + Math.imul(P, ot)) | 0),
              (n = ((n = (n + Math.imul(P, st)) | 0) + Math.imul(O, ot)) | 0),
              (o = (o + Math.imul(O, st)) | 0),
              (i = (i + Math.imul(T, ft)) | 0),
              (n = ((n = (n + Math.imul(T, ht)) | 0) + Math.imul(L, ft)) | 0),
              (o = (o + Math.imul(L, ht)) | 0),
              (i = (i + Math.imul(I, ct)) | 0),
              (n = ((n = (n + Math.imul(I, dt)) | 0) + Math.imul(R, ct)) | 0),
              (o = (o + Math.imul(R, dt)) | 0);
            var Rt =
              (((h + (i = (i + Math.imul(k, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(k, bt)) | 0) + Math.imul(B, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(B, bt)) | 0) + (n >>> 13)) | 0) +
                (Rt >>> 26)) |
              0),
              (Rt &= 67108863),
              (i = Math.imul(D, ot)),
              (n = ((n = Math.imul(D, st)) + Math.imul(N, ot)) | 0),
              (o = Math.imul(N, st)),
              (i = (i + Math.imul(P, ft)) | 0),
              (n = ((n = (n + Math.imul(P, ht)) | 0) + Math.imul(O, ft)) | 0),
              (o = (o + Math.imul(O, ht)) | 0),
              (i = (i + Math.imul(T, ct)) | 0),
              (n = ((n = (n + Math.imul(T, dt)) | 0) + Math.imul(L, ct)) | 0),
              (o = (o + Math.imul(L, dt)) | 0);
            var jt =
              (((h + (i = (i + Math.imul(I, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(I, bt)) | 0) + Math.imul(R, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(R, bt)) | 0) + (n >>> 13)) | 0) +
                (jt >>> 26)) |
              0),
              (jt &= 67108863),
              (i = Math.imul(D, ft)),
              (n = ((n = Math.imul(D, ht)) + Math.imul(N, ft)) | 0),
              (o = Math.imul(N, ht)),
              (i = (i + Math.imul(P, ct)) | 0),
              (n = ((n = (n + Math.imul(P, dt)) | 0) + Math.imul(O, ct)) | 0),
              (o = (o + Math.imul(O, dt)) | 0);
            var Tt =
              (((h + (i = (i + Math.imul(T, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(T, bt)) | 0) + Math.imul(L, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(L, bt)) | 0) + (n >>> 13)) | 0) +
                (Tt >>> 26)) |
              0),
              (Tt &= 67108863),
              (i = Math.imul(D, ct)),
              (n = ((n = Math.imul(D, dt)) + Math.imul(N, ct)) | 0),
              (o = Math.imul(N, dt));
            var Lt =
              (((h + (i = (i + Math.imul(P, pt)) | 0)) | 0) +
                ((8191 &
                  (n =
                    ((n = (n + Math.imul(P, bt)) | 0) + Math.imul(O, pt)) |
                    0)) <<
                  13)) |
              0;
            (h =
              ((((o = (o + Math.imul(O, bt)) | 0) + (n >>> 13)) | 0) +
                (Lt >>> 26)) |
              0),
              (Lt &= 67108863);
            var Ct =
              (((h + (i = Math.imul(D, pt))) | 0) +
                ((8191 &
                  (n = ((n = Math.imul(D, bt)) + Math.imul(N, pt)) | 0)) <<
                  13)) |
              0;
            return (
              (h =
                ((((o = Math.imul(N, bt)) + (n >>> 13)) | 0) + (Ct >>> 26)) |
                0),
              (Ct &= 67108863),
              (f[0] = mt),
              (f[1] = yt),
              (f[2] = gt),
              (f[3] = vt),
              (f[4] = wt),
              (f[5] = _t),
              (f[6] = Mt),
              (f[7] = St),
              (f[8] = Et),
              (f[9] = At),
              (f[10] = kt),
              (f[11] = Bt),
              (f[12] = xt),
              (f[13] = It),
              (f[14] = Rt),
              (f[15] = jt),
              (f[16] = Tt),
              (f[17] = Lt),
              (f[18] = Ct),
              0 !== h && ((f[19] = h), r.length++),
              r
            );
          };
          function y(t, e, r) {
            (r.negative = e.negative ^ t.negative),
              (r.length = t.length + e.length);
            for (var i = 0, n = 0, o = 0; o < r.length - 1; o++) {
              var s = n;
              n = 0;
              for (
                var a = 67108863 & i,
                  f = Math.min(o, e.length - 1),
                  h = Math.max(0, o - t.length + 1);
                h <= f;
                h++
              ) {
                var u = o - h,
                  c = (0 | t.words[u]) * (0 | e.words[h]),
                  d = 67108863 & c;
                (a = 67108863 & (d = (d + a) | 0)),
                  (n +=
                    (s =
                      ((s = (s + ((c / 67108864) | 0)) | 0) + (d >>> 26)) |
                      0) >>> 26),
                  (s &= 67108863);
              }
              (r.words[o] = a), (i = s), (s = n);
            }
            return 0 !== i ? (r.words[o] = i) : r.length--, r._strip();
          }
          function g(t, e, r) {
            return y(t, e, r);
          }
          function v(t, e) {
            (this.x = t), (this.y = e);
          }
          Math.imul || (m = b),
            (o.prototype.mulTo = function (t, e) {
              var r = this.length + t.length;
              return 10 === this.length && 10 === t.length
                ? m(this, t, e)
                : r < 63
                ? b(this, t, e)
                : r < 1024
                ? y(this, t, e)
                : g(this, t, e);
            }),
            (v.prototype.makeRBT = function (t) {
              for (
                var e = new Array(t), r = o.prototype._countBits(t) - 1, i = 0;
                i < t;
                i++
              )
                e[i] = this.revBin(i, r, t);
              return e;
            }),
            (v.prototype.revBin = function (t, e, r) {
              if (0 === t || t === r - 1) return t;
              for (var i = 0, n = 0; n < e; n++)
                (i |= (1 & t) << (e - n - 1)), (t >>= 1);
              return i;
            }),
            (v.prototype.permute = function (t, e, r, i, n, o) {
              for (var s = 0; s < o; s++) (i[s] = e[t[s]]), (n[s] = r[t[s]]);
            }),
            (v.prototype.transform = function (t, e, r, i, n, o) {
              this.permute(o, t, e, r, i, n);
              for (var s = 1; s < n; s <<= 1)
                for (
                  var a = s << 1,
                    f = Math.cos((2 * Math.PI) / a),
                    h = Math.sin((2 * Math.PI) / a),
                    u = 0;
                  u < n;
                  u += a
                )
                  for (var c = f, d = h, l = 0; l < s; l++) {
                    var p = r[u + l],
                      b = i[u + l],
                      m = r[u + l + s],
                      y = i[u + l + s],
                      g = c * m - d * y;
                    (y = c * y + d * m),
                      (m = g),
                      (r[u + l] = p + m),
                      (i[u + l] = b + y),
                      (r[u + l + s] = p - m),
                      (i[u + l + s] = b - y),
                      l !== a &&
                        ((g = f * c - h * d), (d = f * d + h * c), (c = g));
                  }
            }),
            (v.prototype.guessLen13b = function (t, e) {
              var r = 1 | Math.max(e, t),
                i = 1 & r,
                n = 0;
              for (r = (r / 2) | 0; r; r >>>= 1) n++;
              return 1 << (n + 1 + i);
            }),
            (v.prototype.conjugate = function (t, e, r) {
              if (!(r <= 1))
                for (var i = 0; i < r / 2; i++) {
                  var n = t[i];
                  (t[i] = t[r - i - 1]),
                    (t[r - i - 1] = n),
                    (n = e[i]),
                    (e[i] = -e[r - i - 1]),
                    (e[r - i - 1] = -n);
                }
            }),
            (v.prototype.normalize13b = function (t, e) {
              for (var r = 0, i = 0; i < e / 2; i++) {
                var n =
                  8192 * Math.round(t[2 * i + 1] / e) +
                  Math.round(t[2 * i] / e) +
                  r;
                (t[i] = 67108863 & n),
                  (r = n < 67108864 ? 0 : (n / 67108864) | 0);
              }
              return t;
            }),
            (v.prototype.convert13b = function (t, e, r, n) {
              for (var o = 0, s = 0; s < e; s++)
                (o += 0 | t[s]),
                  (r[2 * s] = 8191 & o),
                  (o >>>= 13),
                  (r[2 * s + 1] = 8191 & o),
                  (o >>>= 13);
              for (s = 2 * e; s < n; ++s) r[s] = 0;
              i(0 === o), i(0 == (-8192 & o));
            }),
            (v.prototype.stub = function (t) {
              for (var e = new Array(t), r = 0; r < t; r++) e[r] = 0;
              return e;
            }),
            (v.prototype.mulp = function (t, e, r) {
              var i = 2 * this.guessLen13b(t.length, e.length),
                n = this.makeRBT(i),
                o = this.stub(i),
                s = new Array(i),
                a = new Array(i),
                f = new Array(i),
                h = new Array(i),
                u = new Array(i),
                c = new Array(i),
                d = r.words;
              (d.length = i),
                this.convert13b(t.words, t.length, s, i),
                this.convert13b(e.words, e.length, h, i),
                this.transform(s, o, a, f, i, n),
                this.transform(h, o, u, c, i, n);
              for (var l = 0; l < i; l++) {
                var p = a[l] * u[l] - f[l] * c[l];
                (f[l] = a[l] * c[l] + f[l] * u[l]), (a[l] = p);
              }
              return (
                this.conjugate(a, f, i),
                this.transform(a, f, d, o, i, n),
                this.conjugate(d, o, i),
                this.normalize13b(d, i),
                (r.negative = t.negative ^ e.negative),
                (r.length = t.length + e.length),
                r._strip()
              );
            }),
            (o.prototype.mul = function (t) {
              var e = new o(null);
              return (
                (e.words = new Array(this.length + t.length)), this.mulTo(t, e)
              );
            }),
            (o.prototype.mulf = function (t) {
              var e = new o(null);
              return (
                (e.words = new Array(this.length + t.length)), g(this, t, e)
              );
            }),
            (o.prototype.imul = function (t) {
              return this.clone().mulTo(t, this);
            }),
            (o.prototype.imuln = function (t) {
              var e = t < 0;
              e && (t = -t), i("number" == typeof t), i(t < 67108864);
              for (var r = 0, n = 0; n < this.length; n++) {
                var o = (0 | this.words[n]) * t,
                  s = (67108863 & o) + (67108863 & r);
                (r >>= 26),
                  (r += (o / 67108864) | 0),
                  (r += s >>> 26),
                  (this.words[n] = 67108863 & s);
              }
              return (
                0 !== r && ((this.words[n] = r), this.length++),
                e ? this.ineg() : this
              );
            }),
            (o.prototype.muln = function (t) {
              return this.clone().imuln(t);
            }),
            (o.prototype.sqr = function () {
              return this.mul(this);
            }),
            (o.prototype.isqr = function () {
              return this.imul(this.clone());
            }),
            (o.prototype.pow = function (t) {
              var e = (function (t) {
                for (
                  var e = new Array(t.bitLength()), r = 0;
                  r < e.length;
                  r++
                ) {
                  var i = (r / 26) | 0,
                    n = r % 26;
                  e[r] = (t.words[i] >>> n) & 1;
                }
                return e;
              })(t);
              if (0 === e.length) return new o(1);
              for (
                var r = this, i = 0;
                i < e.length && 0 === e[i];
                i++, r = r.sqr()
              );
              if (++i < e.length)
                for (var n = r.sqr(); i < e.length; i++, n = n.sqr())
                  0 !== e[i] && (r = r.mul(n));
              return r;
            }),
            (o.prototype.iushln = function (t) {
              i("number" == typeof t && t >= 0);
              var e,
                r = t % 26,
                n = (t - r) / 26,
                o = (67108863 >>> (26 - r)) << (26 - r);
              if (0 !== r) {
                var s = 0;
                for (e = 0; e < this.length; e++) {
                  var a = this.words[e] & o,
                    f = ((0 | this.words[e]) - a) << r;
                  (this.words[e] = f | s), (s = a >>> (26 - r));
                }
                s && ((this.words[e] = s), this.length++);
              }
              if (0 !== n) {
                for (e = this.length - 1; e >= 0; e--)
                  this.words[e + n] = this.words[e];
                for (e = 0; e < n; e++) this.words[e] = 0;
                this.length += n;
              }
              return this._strip();
            }),
            (o.prototype.ishln = function (t) {
              return i(0 === this.negative), this.iushln(t);
            }),
            (o.prototype.iushrn = function (t, e, r) {
              var n;
              i("number" == typeof t && t >= 0),
                (n = e ? (e - (e % 26)) / 26 : 0);
              var o = t % 26,
                s = Math.min((t - o) / 26, this.length),
                a = 67108863 ^ ((67108863 >>> o) << o),
                f = r;
              if (((n -= s), (n = Math.max(0, n)), f)) {
                for (var h = 0; h < s; h++) f.words[h] = this.words[h];
                f.length = s;
              }
              if (0 === s);
              else if (this.length > s)
                for (this.length -= s, h = 0; h < this.length; h++)
                  this.words[h] = this.words[h + s];
              else (this.words[0] = 0), (this.length = 1);
              var u = 0;
              for (h = this.length - 1; h >= 0 && (0 !== u || h >= n); h--) {
                var c = 0 | this.words[h];
                (this.words[h] = (u << (26 - o)) | (c >>> o)), (u = c & a);
              }
              return (
                f && 0 !== u && (f.words[f.length++] = u),
                0 === this.length && ((this.words[0] = 0), (this.length = 1)),
                this._strip()
              );
            }),
            (o.prototype.ishrn = function (t, e, r) {
              return i(0 === this.negative), this.iushrn(t, e, r);
            }),
            (o.prototype.shln = function (t) {
              return this.clone().ishln(t);
            }),
            (o.prototype.ushln = function (t) {
              return this.clone().iushln(t);
            }),
            (o.prototype.shrn = function (t) {
              return this.clone().ishrn(t);
            }),
            (o.prototype.ushrn = function (t) {
              return this.clone().iushrn(t);
            }),
            (o.prototype.testn = function (t) {
              i("number" == typeof t && t >= 0);
              var e = t % 26,
                r = (t - e) / 26,
                n = 1 << e;
              return !(this.length <= r) && !!(this.words[r] & n);
            }),
            (o.prototype.imaskn = function (t) {
              i("number" == typeof t && t >= 0);
              var e = t % 26,
                r = (t - e) / 26;
              if (
                (i(
                  0 === this.negative,
                  "imaskn works only with positive numbers"
                ),
                this.length <= r)
              )
                return this;
              if (
                (0 !== e && r++,
                (this.length = Math.min(r, this.length)),
                0 !== e)
              ) {
                var n = 67108863 ^ ((67108863 >>> e) << e);
                this.words[this.length - 1] &= n;
              }
              return this._strip();
            }),
            (o.prototype.maskn = function (t) {
              return this.clone().imaskn(t);
            }),
            (o.prototype.iaddn = function (t) {
              return (
                i("number" == typeof t),
                i(t < 67108864),
                t < 0
                  ? this.isubn(-t)
                  : 0 !== this.negative
                  ? 1 === this.length && (0 | this.words[0]) <= t
                    ? ((this.words[0] = t - (0 | this.words[0])),
                      (this.negative = 0),
                      this)
                    : ((this.negative = 0),
                      this.isubn(t),
                      (this.negative = 1),
                      this)
                  : this._iaddn(t)
              );
            }),
            (o.prototype._iaddn = function (t) {
              this.words[0] += t;
              for (var e = 0; e < this.length && this.words[e] >= 67108864; e++)
                (this.words[e] -= 67108864),
                  e === this.length - 1
                    ? (this.words[e + 1] = 1)
                    : this.words[e + 1]++;
              return (this.length = Math.max(this.length, e + 1)), this;
            }),
            (o.prototype.isubn = function (t) {
              if ((i("number" == typeof t), i(t < 67108864), t < 0))
                return this.iaddn(-t);
              if (0 !== this.negative)
                return (
                  (this.negative = 0), this.iaddn(t), (this.negative = 1), this
                );
              if (
                ((this.words[0] -= t), 1 === this.length && this.words[0] < 0)
              )
                (this.words[0] = -this.words[0]), (this.negative = 1);
              else
                for (var e = 0; e < this.length && this.words[e] < 0; e++)
                  (this.words[e] += 67108864), (this.words[e + 1] -= 1);
              return this._strip();
            }),
            (o.prototype.addn = function (t) {
              return this.clone().iaddn(t);
            }),
            (o.prototype.subn = function (t) {
              return this.clone().isubn(t);
            }),
            (o.prototype.iabs = function () {
              return (this.negative = 0), this;
            }),
            (o.prototype.abs = function () {
              return this.clone().iabs();
            }),
            (o.prototype._ishlnsubmul = function (t, e, r) {
              var n,
                o,
                s = t.length + r;
              this._expand(s);
              var a = 0;
              for (n = 0; n < t.length; n++) {
                o = (0 | this.words[n + r]) + a;
                var f = (0 | t.words[n]) * e;
                (a = ((o -= 67108863 & f) >> 26) - ((f / 67108864) | 0)),
                  (this.words[n + r] = 67108863 & o);
              }
              for (; n < this.length - r; n++)
                (a = (o = (0 | this.words[n + r]) + a) >> 26),
                  (this.words[n + r] = 67108863 & o);
              if (0 === a) return this._strip();
              for (i(-1 === a), a = 0, n = 0; n < this.length; n++)
                (a = (o = -(0 | this.words[n]) + a) >> 26),
                  (this.words[n] = 67108863 & o);
              return (this.negative = 1), this._strip();
            }),
            (o.prototype._wordDiv = function (t, e) {
              var r = (this.length, t.length),
                i = this.clone(),
                n = t,
                s = 0 | n.words[n.length - 1];
              0 !== (r = 26 - this._countBits(s)) &&
                ((n = n.ushln(r)),
                i.iushln(r),
                (s = 0 | n.words[n.length - 1]));
              var a,
                f = i.length - n.length;
              if ("mod" !== e) {
                ((a = new o(null)).length = f + 1),
                  (a.words = new Array(a.length));
                for (var h = 0; h < a.length; h++) a.words[h] = 0;
              }
              var u = i.clone()._ishlnsubmul(n, 1, f);
              0 === u.negative && ((i = u), a && (a.words[f] = 1));
              for (var c = f - 1; c >= 0; c--) {
                var d =
                  67108864 * (0 | i.words[n.length + c]) +
                  (0 | i.words[n.length + c - 1]);
                for (
                  d = Math.min((d / s) | 0, 67108863), i._ishlnsubmul(n, d, c);
                  0 !== i.negative;

                )
                  d--,
                    (i.negative = 0),
                    i._ishlnsubmul(n, 1, c),
                    i.isZero() || (i.negative ^= 1);
                a && (a.words[c] = d);
              }
              return (
                a && a._strip(),
                i._strip(),
                "div" !== e && 0 !== r && i.iushrn(r),
                { div: a || null, mod: i }
              );
            }),
            (o.prototype.divmod = function (t, e, r) {
              return (
                i(!t.isZero()),
                this.isZero()
                  ? { div: new o(0), mod: new o(0) }
                  : 0 !== this.negative && 0 === t.negative
                  ? ((a = this.neg().divmod(t, e)),
                    "mod" !== e && (n = a.div.neg()),
                    "div" !== e &&
                      ((s = a.mod.neg()), r && 0 !== s.negative && s.iadd(t)),
                    { div: n, mod: s })
                  : 0 === this.negative && 0 !== t.negative
                  ? ((a = this.divmod(t.neg(), e)),
                    "mod" !== e && (n = a.div.neg()),
                    { div: n, mod: a.mod })
                  : 0 != (this.negative & t.negative)
                  ? ((a = this.neg().divmod(t.neg(), e)),
                    "div" !== e &&
                      ((s = a.mod.neg()), r && 0 !== s.negative && s.isub(t)),
                    { div: a.div, mod: s })
                  : t.length > this.length || this.cmp(t) < 0
                  ? { div: new o(0), mod: this }
                  : 1 === t.length
                  ? "div" === e
                    ? { div: this.divn(t.words[0]), mod: null }
                    : "mod" === e
                    ? { div: null, mod: new o(this.modrn(t.words[0])) }
                    : {
                        div: this.divn(t.words[0]),
                        mod: new o(this.modrn(t.words[0])),
                      }
                  : this._wordDiv(t, e)
              );
              var n, s, a;
            }),
            (o.prototype.div = function (t) {
              return this.divmod(t, "div", !1).div;
            }),
            (o.prototype.mod = function (t) {
              return this.divmod(t, "mod", !1).mod;
            }),
            (o.prototype.umod = function (t) {
              return this.divmod(t, "mod", !0).mod;
            }),
            (o.prototype.divRound = function (t) {
              var e = this.divmod(t);
              if (e.mod.isZero()) return e.div;
              var r = 0 !== e.div.negative ? e.mod.isub(t) : e.mod,
                i = t.ushrn(1),
                n = t.andln(1),
                o = r.cmp(i);
              return o < 0 || (1 === n && 0 === o)
                ? e.div
                : 0 !== e.div.negative
                ? e.div.isubn(1)
                : e.div.iaddn(1);
            }),
            (o.prototype.modrn = function (t) {
              var e = t < 0;
              e && (t = -t), i(t <= 67108863);
              for (
                var r = (1 << 26) % t, n = 0, o = this.length - 1;
                o >= 0;
                o--
              )
                n = (r * n + (0 | this.words[o])) % t;
              return e ? -n : n;
            }),
            (o.prototype.modn = function (t) {
              return this.modrn(t);
            }),
            (o.prototype.idivn = function (t) {
              var e = t < 0;
              e && (t = -t), i(t <= 67108863);
              for (var r = 0, n = this.length - 1; n >= 0; n--) {
                var o = (0 | this.words[n]) + 67108864 * r;
                (this.words[n] = (o / t) | 0), (r = o % t);
              }
              return this._strip(), e ? this.ineg() : this;
            }),
            (o.prototype.divn = function (t) {
              return this.clone().idivn(t);
            }),
            (o.prototype.egcd = function (t) {
              i(0 === t.negative), i(!t.isZero());
              var e = this,
                r = t.clone();
              e = 0 !== e.negative ? e.umod(t) : e.clone();
              for (
                var n = new o(1),
                  s = new o(0),
                  a = new o(0),
                  f = new o(1),
                  h = 0;
                e.isEven() && r.isEven();

              )
                e.iushrn(1), r.iushrn(1), ++h;
              for (var u = r.clone(), c = e.clone(); !e.isZero(); ) {
                for (
                  var d = 0, l = 1;
                  0 == (e.words[0] & l) && d < 26;
                  ++d, l <<= 1
                );
                if (d > 0)
                  for (e.iushrn(d); d-- > 0; )
                    (n.isOdd() || s.isOdd()) && (n.iadd(u), s.isub(c)),
                      n.iushrn(1),
                      s.iushrn(1);
                for (
                  var p = 0, b = 1;
                  0 == (r.words[0] & b) && p < 26;
                  ++p, b <<= 1
                );
                if (p > 0)
                  for (r.iushrn(p); p-- > 0; )
                    (a.isOdd() || f.isOdd()) && (a.iadd(u), f.isub(c)),
                      a.iushrn(1),
                      f.iushrn(1);
                e.cmp(r) >= 0
                  ? (e.isub(r), n.isub(a), s.isub(f))
                  : (r.isub(e), a.isub(n), f.isub(s));
              }
              return { a: a, b: f, gcd: r.iushln(h) };
            }),
            (o.prototype._invmp = function (t) {
              i(0 === t.negative), i(!t.isZero());
              var e = this,
                r = t.clone();
              e = 0 !== e.negative ? e.umod(t) : e.clone();
              for (
                var n, s = new o(1), a = new o(0), f = r.clone();
                e.cmpn(1) > 0 && r.cmpn(1) > 0;

              ) {
                for (
                  var h = 0, u = 1;
                  0 == (e.words[0] & u) && h < 26;
                  ++h, u <<= 1
                );
                if (h > 0)
                  for (e.iushrn(h); h-- > 0; )
                    s.isOdd() && s.iadd(f), s.iushrn(1);
                for (
                  var c = 0, d = 1;
                  0 == (r.words[0] & d) && c < 26;
                  ++c, d <<= 1
                );
                if (c > 0)
                  for (r.iushrn(c); c-- > 0; )
                    a.isOdd() && a.iadd(f), a.iushrn(1);
                e.cmp(r) >= 0 ? (e.isub(r), s.isub(a)) : (r.isub(e), a.isub(s));
              }
              return (n = 0 === e.cmpn(1) ? s : a).cmpn(0) < 0 && n.iadd(t), n;
            }),
            (o.prototype.gcd = function (t) {
              if (this.isZero()) return t.abs();
              if (t.isZero()) return this.abs();
              var e = this.clone(),
                r = t.clone();
              (e.negative = 0), (r.negative = 0);
              for (var i = 0; e.isEven() && r.isEven(); i++)
                e.iushrn(1), r.iushrn(1);
              for (;;) {
                for (; e.isEven(); ) e.iushrn(1);
                for (; r.isEven(); ) r.iushrn(1);
                var n = e.cmp(r);
                if (n < 0) {
                  var o = e;
                  (e = r), (r = o);
                } else if (0 === n || 0 === r.cmpn(1)) break;
                e.isub(r);
              }
              return r.iushln(i);
            }),
            (o.prototype.invm = function (t) {
              return this.egcd(t).a.umod(t);
            }),
            (o.prototype.isEven = function () {
              return 0 == (1 & this.words[0]);
            }),
            (o.prototype.isOdd = function () {
              return 1 == (1 & this.words[0]);
            }),
            (o.prototype.andln = function (t) {
              return this.words[0] & t;
            }),
            (o.prototype.bincn = function (t) {
              i("number" == typeof t);
              var e = t % 26,
                r = (t - e) / 26,
                n = 1 << e;
              if (this.length <= r)
                return this._expand(r + 1), (this.words[r] |= n), this;
              for (var o = n, s = r; 0 !== o && s < this.length; s++) {
                var a = 0 | this.words[s];
                (o = (a += o) >>> 26), (a &= 67108863), (this.words[s] = a);
              }
              return 0 !== o && ((this.words[s] = o), this.length++), this;
            }),
            (o.prototype.isZero = function () {
              return 1 === this.length && 0 === this.words[0];
            }),
            (o.prototype.cmpn = function (t) {
              var e,
                r = t < 0;
              if (0 !== this.negative && !r) return -1;
              if (0 === this.negative && r) return 1;
              if ((this._strip(), this.length > 1)) e = 1;
              else {
                r && (t = -t), i(t <= 67108863, "Number is too big");
                var n = 0 | this.words[0];
                e = n === t ? 0 : n < t ? -1 : 1;
              }
              return 0 !== this.negative ? 0 | -e : e;
            }),
            (o.prototype.cmp = function (t) {
              if (0 !== this.negative && 0 === t.negative) return -1;
              if (0 === this.negative && 0 !== t.negative) return 1;
              var e = this.ucmp(t);
              return 0 !== this.negative ? 0 | -e : e;
            }),
            (o.prototype.ucmp = function (t) {
              if (this.length > t.length) return 1;
              if (this.length < t.length) return -1;
              for (var e = 0, r = this.length - 1; r >= 0; r--) {
                var i = 0 | this.words[r],
                  n = 0 | t.words[r];
                if (i !== n) {
                  i < n ? (e = -1) : i > n && (e = 1);
                  break;
                }
              }
              return e;
            }),
            (o.prototype.gtn = function (t) {
              return 1 === this.cmpn(t);
            }),
            (o.prototype.gt = function (t) {
              return 1 === this.cmp(t);
            }),
            (o.prototype.gten = function (t) {
              return this.cmpn(t) >= 0;
            }),
            (o.prototype.gte = function (t) {
              return this.cmp(t) >= 0;
            }),
            (o.prototype.ltn = function (t) {
              return -1 === this.cmpn(t);
            }),
            (o.prototype.lt = function (t) {
              return -1 === this.cmp(t);
            }),
            (o.prototype.lten = function (t) {
              return this.cmpn(t) <= 0;
            }),
            (o.prototype.lte = function (t) {
              return this.cmp(t) <= 0;
            }),
            (o.prototype.eqn = function (t) {
              return 0 === this.cmpn(t);
            }),
            (o.prototype.eq = function (t) {
              return 0 === this.cmp(t);
            }),
            (o.red = function (t) {
              return new k(t);
            }),
            (o.prototype.toRed = function (t) {
              return (
                i(!this.red, "Already a number in reduction context"),
                i(0 === this.negative, "red works only with positives"),
                t.convertTo(this)._forceRed(t)
              );
            }),
            (o.prototype.fromRed = function () {
              return (
                i(
                  this.red,
                  "fromRed works only with numbers in reduction context"
                ),
                this.red.convertFrom(this)
              );
            }),
            (o.prototype._forceRed = function (t) {
              return (this.red = t), this;
            }),
            (o.prototype.forceRed = function (t) {
              return (
                i(!this.red, "Already a number in reduction context"),
                this._forceRed(t)
              );
            }),
            (o.prototype.redAdd = function (t) {
              return (
                i(this.red, "redAdd works only with red numbers"),
                this.red.add(this, t)
              );
            }),
            (o.prototype.redIAdd = function (t) {
              return (
                i(this.red, "redIAdd works only with red numbers"),
                this.red.iadd(this, t)
              );
            }),
            (o.prototype.redSub = function (t) {
              return (
                i(this.red, "redSub works only with red numbers"),
                this.red.sub(this, t)
              );
            }),
            (o.prototype.redISub = function (t) {
              return (
                i(this.red, "redISub works only with red numbers"),
                this.red.isub(this, t)
              );
            }),
            (o.prototype.redShl = function (t) {
              return (
                i(this.red, "redShl works only with red numbers"),
                this.red.shl(this, t)
              );
            }),
            (o.prototype.redMul = function (t) {
              return (
                i(this.red, "redMul works only with red numbers"),
                this.red._verify2(this, t),
                this.red.mul(this, t)
              );
            }),
            (o.prototype.redIMul = function (t) {
              return (
                i(this.red, "redMul works only with red numbers"),
                this.red._verify2(this, t),
                this.red.imul(this, t)
              );
            }),
            (o.prototype.redSqr = function () {
              return (
                i(this.red, "redSqr works only with red numbers"),
                this.red._verify1(this),
                this.red.sqr(this)
              );
            }),
            (o.prototype.redISqr = function () {
              return (
                i(this.red, "redISqr works only with red numbers"),
                this.red._verify1(this),
                this.red.isqr(this)
              );
            }),
            (o.prototype.redSqrt = function () {
              return (
                i(this.red, "redSqrt works only with red numbers"),
                this.red._verify1(this),
                this.red.sqrt(this)
              );
            }),
            (o.prototype.redInvm = function () {
              return (
                i(this.red, "redInvm works only with red numbers"),
                this.red._verify1(this),
                this.red.invm(this)
              );
            }),
            (o.prototype.redNeg = function () {
              return (
                i(this.red, "redNeg works only with red numbers"),
                this.red._verify1(this),
                this.red.neg(this)
              );
            }),
            (o.prototype.redPow = function (t) {
              return (
                i(this.red && !t.red, "redPow(normalNum)"),
                this.red._verify1(this),
                this.red.pow(this, t)
              );
            });
          var w = { k256: null, p224: null, p192: null, p25519: null };
          function _(t, e) {
            (this.name = t),
              (this.p = new o(e, 16)),
              (this.n = this.p.bitLength()),
              (this.k = new o(1).iushln(this.n).isub(this.p)),
              (this.tmp = this._tmp());
          }
          function M() {
            _.call(
              this,
              "k256",
              "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f"
            );
          }
          function S() {
            _.call(
              this,
              "p224",
              "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001"
            );
          }
          function E() {
            _.call(
              this,
              "p192",
              "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff"
            );
          }
          function A() {
            _.call(
              this,
              "25519",
              "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed"
            );
          }
          function k(t) {
            if ("string" == typeof t) {
              var e = o._prime(t);
              (this.m = e.p), (this.prime = e);
            } else
              i(t.gtn(1), "modulus must be greater than 1"),
                (this.m = t),
                (this.prime = null);
          }
          function B(t) {
            k.call(this, t),
              (this.shift = this.m.bitLength()),
              this.shift % 26 != 0 && (this.shift += 26 - (this.shift % 26)),
              (this.r = new o(1).iushln(this.shift)),
              (this.r2 = this.imod(this.r.sqr())),
              (this.rinv = this.r._invmp(this.m)),
              (this.minv = this.rinv.mul(this.r).isubn(1).div(this.m)),
              (this.minv = this.minv.umod(this.r)),
              (this.minv = this.r.sub(this.minv));
          }
          (_.prototype._tmp = function () {
            var t = new o(null);
            return (t.words = new Array(Math.ceil(this.n / 13))), t;
          }),
            (_.prototype.ireduce = function (t) {
              var e,
                r = t;
              do {
                this.split(r, this.tmp),
                  (e = (r = (r = this.imulK(r)).iadd(this.tmp)).bitLength());
              } while (e > this.n);
              var i = e < this.n ? -1 : r.ucmp(this.p);
              return (
                0 === i
                  ? ((r.words[0] = 0), (r.length = 1))
                  : i > 0
                  ? r.isub(this.p)
                  : void 0 !== r.strip
                  ? r.strip()
                  : r._strip(),
                r
              );
            }),
            (_.prototype.split = function (t, e) {
              t.iushrn(this.n, 0, e);
            }),
            (_.prototype.imulK = function (t) {
              return t.imul(this.k);
            }),
            n(M, _),
            (M.prototype.split = function (t, e) {
              for (
                var r = 4194303, i = Math.min(t.length, 9), n = 0;
                n < i;
                n++
              )
                e.words[n] = t.words[n];
              if (((e.length = i), t.length <= 9))
                return (t.words[0] = 0), void (t.length = 1);
              var o = t.words[9];
              for (e.words[e.length++] = o & r, n = 10; n < t.length; n++) {
                var s = 0 | t.words[n];
                (t.words[n - 10] = ((s & r) << 4) | (o >>> 22)), (o = s);
              }
              (o >>>= 22),
                (t.words[n - 10] = o),
                0 === o && t.length > 10 ? (t.length -= 10) : (t.length -= 9);
            }),
            (M.prototype.imulK = function (t) {
              (t.words[t.length] = 0),
                (t.words[t.length + 1] = 0),
                (t.length += 2);
              for (var e = 0, r = 0; r < t.length; r++) {
                var i = 0 | t.words[r];
                (e += 977 * i),
                  (t.words[r] = 67108863 & e),
                  (e = 64 * i + ((e / 67108864) | 0));
              }
              return (
                0 === t.words[t.length - 1] &&
                  (t.length--, 0 === t.words[t.length - 1] && t.length--),
                t
              );
            }),
            n(S, _),
            n(E, _),
            n(A, _),
            (A.prototype.imulK = function (t) {
              for (var e = 0, r = 0; r < t.length; r++) {
                var i = 19 * (0 | t.words[r]) + e,
                  n = 67108863 & i;
                (i >>>= 26), (t.words[r] = n), (e = i);
              }
              return 0 !== e && (t.words[t.length++] = e), t;
            }),
            (o._prime = function (t) {
              if (w[t]) return w[t];
              var e;
              if ("k256" === t) e = new M();
              else if ("p224" === t) e = new S();
              else if ("p192" === t) e = new E();
              else {
                if ("p25519" !== t) throw new Error("Unknown prime " + t);
                e = new A();
              }
              return (w[t] = e), e;
            }),
            (k.prototype._verify1 = function (t) {
              i(0 === t.negative, "red works only with positives"),
                i(t.red, "red works only with red numbers");
            }),
            (k.prototype._verify2 = function (t, e) {
              i(
                0 == (t.negative | e.negative),
                "red works only with positives"
              ),
                i(t.red && t.red === e.red, "red works only with red numbers");
            }),
            (k.prototype.imod = function (t) {
              return this.prime
                ? this.prime.ireduce(t)._forceRed(this)
                : (u(t, t.umod(this.m)._forceRed(this)), t);
            }),
            (k.prototype.neg = function (t) {
              return t.isZero() ? t.clone() : this.m.sub(t)._forceRed(this);
            }),
            (k.prototype.add = function (t, e) {
              this._verify2(t, e);
              var r = t.add(e);
              return r.cmp(this.m) >= 0 && r.isub(this.m), r._forceRed(this);
            }),
            (k.prototype.iadd = function (t, e) {
              this._verify2(t, e);
              var r = t.iadd(e);
              return r.cmp(this.m) >= 0 && r.isub(this.m), r;
            }),
            (k.prototype.sub = function (t, e) {
              this._verify2(t, e);
              var r = t.sub(e);
              return r.cmpn(0) < 0 && r.iadd(this.m), r._forceRed(this);
            }),
            (k.prototype.isub = function (t, e) {
              this._verify2(t, e);
              var r = t.isub(e);
              return r.cmpn(0) < 0 && r.iadd(this.m), r;
            }),
            (k.prototype.shl = function (t, e) {
              return this._verify1(t), this.imod(t.ushln(e));
            }),
            (k.prototype.imul = function (t, e) {
              return this._verify2(t, e), this.imod(t.imul(e));
            }),
            (k.prototype.mul = function (t, e) {
              return this._verify2(t, e), this.imod(t.mul(e));
            }),
            (k.prototype.isqr = function (t) {
              return this.imul(t, t.clone());
            }),
            (k.prototype.sqr = function (t) {
              return this.mul(t, t);
            }),
            (k.prototype.sqrt = function (t) {
              if (t.isZero()) return t.clone();
              var e = this.m.andln(3);
              if ((i(e % 2 == 1), 3 === e)) {
                var r = this.m.add(new o(1)).iushrn(2);
                return this.pow(t, r);
              }
              for (
                var n = this.m.subn(1), s = 0;
                !n.isZero() && 0 === n.andln(1);

              )
                s++, n.iushrn(1);
              i(!n.isZero());
              var a = new o(1).toRed(this),
                f = a.redNeg(),
                h = this.m.subn(1).iushrn(1),
                u = this.m.bitLength();
              for (
                u = new o(2 * u * u).toRed(this);
                0 !== this.pow(u, h).cmp(f);

              )
                u.redIAdd(f);
              for (
                var c = this.pow(u, n),
                  d = this.pow(t, n.addn(1).iushrn(1)),
                  l = this.pow(t, n),
                  p = s;
                0 !== l.cmp(a);

              ) {
                for (var b = l, m = 0; 0 !== b.cmp(a); m++) b = b.redSqr();
                i(m < p);
                var y = this.pow(c, new o(1).iushln(p - m - 1));
                (d = d.redMul(y)), (c = y.redSqr()), (l = l.redMul(c)), (p = m);
              }
              return d;
            }),
            (k.prototype.invm = function (t) {
              var e = t._invmp(this.m);
              return 0 !== e.negative
                ? ((e.negative = 0), this.imod(e).redNeg())
                : this.imod(e);
            }),
            (k.prototype.pow = function (t, e) {
              if (e.isZero()) return new o(1).toRed(this);
              if (0 === e.cmpn(1)) return t.clone();
              var r = new Array(16);
              (r[0] = new o(1).toRed(this)), (r[1] = t);
              for (var i = 2; i < r.length; i++) r[i] = this.mul(r[i - 1], t);
              var n = r[0],
                s = 0,
                a = 0,
                f = e.bitLength() % 26;
              for (0 === f && (f = 26), i = e.length - 1; i >= 0; i--) {
                for (var h = e.words[i], u = f - 1; u >= 0; u--) {
                  var c = (h >> u) & 1;
                  n !== r[0] && (n = this.sqr(n)),
                    0 !== c || 0 !== s
                      ? ((s <<= 1),
                        (s |= c),
                        (4 === ++a || (0 === i && 0 === u)) &&
                          ((n = this.mul(n, r[s])), (a = 0), (s = 0)))
                      : (a = 0);
                }
                f = 26;
              }
              return n;
            }),
            (k.prototype.convertTo = function (t) {
              var e = t.umod(this.m);
              return e === t ? e.clone() : e;
            }),
            (k.prototype.convertFrom = function (t) {
              var e = t.clone();
              return (e.red = null), e;
            }),
            (o.mont = function (t) {
              return new B(t);
            }),
            n(B, k),
            (B.prototype.convertTo = function (t) {
              return this.imod(t.ushln(this.shift));
            }),
            (B.prototype.convertFrom = function (t) {
              var e = this.imod(t.mul(this.rinv));
              return (e.red = null), e;
            }),
            (B.prototype.imul = function (t, e) {
              if (t.isZero() || e.isZero())
                return (t.words[0] = 0), (t.length = 1), t;
              var r = t.imul(e),
                i = r
                  .maskn(this.shift)
                  .mul(this.minv)
                  .imaskn(this.shift)
                  .mul(this.m),
                n = r.isub(i).iushrn(this.shift),
                o = n;
              return (
                n.cmp(this.m) >= 0
                  ? (o = n.isub(this.m))
                  : n.cmpn(0) < 0 && (o = n.iadd(this.m)),
                o._forceRed(this)
              );
            }),
            (B.prototype.mul = function (t, e) {
              if (t.isZero() || e.isZero()) return new o(0)._forceRed(this);
              var r = t.mul(e),
                i = r
                  .maskn(this.shift)
                  .mul(this.minv)
                  .imaskn(this.shift)
                  .mul(this.m),
                n = r.isub(i).iushrn(this.shift),
                s = n;
              return (
                n.cmp(this.m) >= 0
                  ? (s = n.isub(this.m))
                  : n.cmpn(0) < 0 && (s = n.iadd(this.m)),
                s._forceRed(this)
              );
            }),
            (B.prototype.invm = function (t) {
              return this.imod(t._invmp(this.m).mul(this.r2))._forceRed(this);
            });
        })(void 0 === e || e, this);
      },
      { buffer: 19 },
    ],
    18: [
      function (t, e, r) {
        var i;
        function n(t) {
          this.rand = t;
        }
        if (
          ((e.exports = function (t) {
            return i || (i = new n(null)), i.generate(t);
          }),
          (e.exports.Rand = n),
          (n.prototype.generate = function (t) {
            return this._rand(t);
          }),
          (n.prototype._rand = function (t) {
            if (this.rand.getBytes) return this.rand.getBytes(t);
            for (var e = new Uint8Array(t), r = 0; r < e.length; r++)
              e[r] = this.rand.getByte();
            return e;
          }),
          "object" == typeof self)
        )
          self.crypto && self.crypto.getRandomValues
            ? (n.prototype._rand = function (t) {
                var e = new Uint8Array(t);
                return self.crypto.getRandomValues(e), e;
              })
            : self.msCrypto && self.msCrypto.getRandomValues
            ? (n.prototype._rand = function (t) {
                var e = new Uint8Array(t);
                return self.msCrypto.getRandomValues(e), e;
              })
            : "object" == typeof window &&
              (n.prototype._rand = function () {
                throw new Error("Not implemented yet");
              });
        else
          try {
            var o = t("crypto");
            if ("function" != typeof o.randomBytes)
              throw new Error("Not supported");
            n.prototype._rand = function (t) {
              return o.randomBytes(t);
            };
          } catch (t) {}
      },
      { crypto: 19 },
    ],
    19: [function (t, e, r) {}, {}],
    20: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer;
        function n(t) {
          i.isBuffer(t) || (t = i.from(t));
          for (var e = (t.length / 4) | 0, r = new Array(e), n = 0; n < e; n++)
            r[n] = t.readUInt32BE(4 * n);
          return r;
        }
        function o(t) {
          for (; 0 < t.length; t++) t[0] = 0;
        }
        function s(t, e, r, i, n) {
          for (
            var o,
              s,
              a,
              f,
              h = r[0],
              u = r[1],
              c = r[2],
              d = r[3],
              l = t[0] ^ e[0],
              p = t[1] ^ e[1],
              b = t[2] ^ e[2],
              m = t[3] ^ e[3],
              y = 4,
              g = 1;
            g < n;
            g++
          )
            (o =
              h[l >>> 24] ^
              u[(p >>> 16) & 255] ^
              c[(b >>> 8) & 255] ^
              d[255 & m] ^
              e[y++]),
              (s =
                h[p >>> 24] ^
                u[(b >>> 16) & 255] ^
                c[(m >>> 8) & 255] ^
                d[255 & l] ^
                e[y++]),
              (a =
                h[b >>> 24] ^
                u[(m >>> 16) & 255] ^
                c[(l >>> 8) & 255] ^
                d[255 & p] ^
                e[y++]),
              (f =
                h[m >>> 24] ^
                u[(l >>> 16) & 255] ^
                c[(p >>> 8) & 255] ^
                d[255 & b] ^
                e[y++]),
              (l = o),
              (p = s),
              (b = a),
              (m = f);
          return (
            (o =
              ((i[l >>> 24] << 24) |
                (i[(p >>> 16) & 255] << 16) |
                (i[(b >>> 8) & 255] << 8) |
                i[255 & m]) ^
              e[y++]),
            (s =
              ((i[p >>> 24] << 24) |
                (i[(b >>> 16) & 255] << 16) |
                (i[(m >>> 8) & 255] << 8) |
                i[255 & l]) ^
              e[y++]),
            (a =
              ((i[b >>> 24] << 24) |
                (i[(m >>> 16) & 255] << 16) |
                (i[(l >>> 8) & 255] << 8) |
                i[255 & p]) ^
              e[y++]),
            (f =
              ((i[m >>> 24] << 24) |
                (i[(l >>> 16) & 255] << 16) |
                (i[(p >>> 8) & 255] << 8) |
                i[255 & b]) ^
              e[y++]),
            [(o >>>= 0), (s >>>= 0), (a >>>= 0), (f >>>= 0)]
          );
        }
        var a = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
          f = (function () {
            for (var t = new Array(256), e = 0; e < 256; e++)
              t[e] = e < 128 ? e << 1 : (e << 1) ^ 283;
            for (
              var r = [],
                i = [],
                n = [[], [], [], []],
                o = [[], [], [], []],
                s = 0,
                a = 0,
                f = 0;
              f < 256;
              ++f
            ) {
              var h = a ^ (a << 1) ^ (a << 2) ^ (a << 3) ^ (a << 4);
              (h = (h >>> 8) ^ (255 & h) ^ 99), (r[s] = h), (i[h] = s);
              var u = t[s],
                c = t[u],
                d = t[c],
                l = (257 * t[h]) ^ (16843008 * h);
              (n[0][s] = (l << 24) | (l >>> 8)),
                (n[1][s] = (l << 16) | (l >>> 16)),
                (n[2][s] = (l << 8) | (l >>> 24)),
                (n[3][s] = l),
                (l = (16843009 * d) ^ (65537 * c) ^ (257 * u) ^ (16843008 * s)),
                (o[0][h] = (l << 24) | (l >>> 8)),
                (o[1][h] = (l << 16) | (l >>> 16)),
                (o[2][h] = (l << 8) | (l >>> 24)),
                (o[3][h] = l),
                0 === s
                  ? (s = a = 1)
                  : ((s = u ^ t[t[t[d ^ u]]]), (a ^= t[t[a]]));
            }
            return { SBOX: r, INV_SBOX: i, SUB_MIX: n, INV_SUB_MIX: o };
          })();
        function h(t) {
          (this._key = n(t)), this._reset();
        }
        (h.blockSize = 16),
          (h.keySize = 32),
          (h.prototype.blockSize = h.blockSize),
          (h.prototype.keySize = h.keySize),
          (h.prototype._reset = function () {
            for (
              var t = this._key,
                e = t.length,
                r = e + 6,
                i = 4 * (r + 1),
                n = [],
                o = 0;
              o < e;
              o++
            )
              n[o] = t[o];
            for (o = e; o < i; o++) {
              var s = n[o - 1];
              o % e == 0
                ? ((s = (s << 8) | (s >>> 24)),
                  (s =
                    (f.SBOX[s >>> 24] << 24) |
                    (f.SBOX[(s >>> 16) & 255] << 16) |
                    (f.SBOX[(s >>> 8) & 255] << 8) |
                    f.SBOX[255 & s]),
                  (s ^= a[(o / e) | 0] << 24))
                : e > 6 &&
                  o % e == 4 &&
                  (s =
                    (f.SBOX[s >>> 24] << 24) |
                    (f.SBOX[(s >>> 16) & 255] << 16) |
                    (f.SBOX[(s >>> 8) & 255] << 8) |
                    f.SBOX[255 & s]),
                (n[o] = n[o - e] ^ s);
            }
            for (var h = [], u = 0; u < i; u++) {
              var c = i - u,
                d = n[c - (u % 4 ? 0 : 4)];
              h[u] =
                u < 4 || c <= 4
                  ? d
                  : f.INV_SUB_MIX[0][f.SBOX[d >>> 24]] ^
                    f.INV_SUB_MIX[1][f.SBOX[(d >>> 16) & 255]] ^
                    f.INV_SUB_MIX[2][f.SBOX[(d >>> 8) & 255]] ^
                    f.INV_SUB_MIX[3][f.SBOX[255 & d]];
            }
            (this._nRounds = r),
              (this._keySchedule = n),
              (this._invKeySchedule = h);
          }),
          (h.prototype.encryptBlockRaw = function (t) {
            return s(
              (t = n(t)),
              this._keySchedule,
              f.SUB_MIX,
              f.SBOX,
              this._nRounds
            );
          }),
          (h.prototype.encryptBlock = function (t) {
            var e = this.encryptBlockRaw(t),
              r = i.allocUnsafe(16);
            return (
              r.writeUInt32BE(e[0], 0),
              r.writeUInt32BE(e[1], 4),
              r.writeUInt32BE(e[2], 8),
              r.writeUInt32BE(e[3], 12),
              r
            );
          }),
          (h.prototype.decryptBlock = function (t) {
            var e = (t = n(t))[1];
            (t[1] = t[3]), (t[3] = e);
            var r = s(
                t,
                this._invKeySchedule,
                f.INV_SUB_MIX,
                f.INV_SBOX,
                this._nRounds
              ),
              o = i.allocUnsafe(16);
            return (
              o.writeUInt32BE(r[0], 0),
              o.writeUInt32BE(r[3], 4),
              o.writeUInt32BE(r[2], 8),
              o.writeUInt32BE(r[1], 12),
              o
            );
          }),
          (h.prototype.scrub = function () {
            o(this._keySchedule), o(this._invKeySchedule), o(this._key);
          }),
          (e.exports.AES = h);
      },
      { "safe-buffer": 160 },
    ],
    21: [
      function (t, e, r) {
        var i = t("./aes"),
          n = t("safe-buffer").Buffer,
          o = t("cipher-base"),
          s = t("inherits"),
          a = t("./ghash"),
          f = t("buffer-xor"),
          h = t("./incr32");
        function u(t, e, r, s) {
          o.call(this);
          var f = n.alloc(4, 0);
          this._cipher = new i.AES(e);
          var u = this._cipher.encryptBlock(f);
          (this._ghash = new a(u)),
            (r = (function (t, e, r) {
              if (12 === e.length)
                return (
                  (t._finID = n.concat([e, n.from([0, 0, 0, 1])])),
                  n.concat([e, n.from([0, 0, 0, 2])])
                );
              var i = new a(r),
                o = e.length,
                s = o % 16;
              i.update(e),
                s && ((s = 16 - s), i.update(n.alloc(s, 0))),
                i.update(n.alloc(8, 0));
              var f = 8 * o,
                u = n.alloc(8);
              u.writeUIntBE(f, 0, 8), i.update(u), (t._finID = i.state);
              var c = n.from(t._finID);
              return h(c), c;
            })(this, r, u)),
            (this._prev = n.from(r)),
            (this._cache = n.allocUnsafe(0)),
            (this._secCache = n.allocUnsafe(0)),
            (this._decrypt = s),
            (this._alen = 0),
            (this._len = 0),
            (this._mode = t),
            (this._authTag = null),
            (this._called = !1);
        }
        s(u, o),
          (u.prototype._update = function (t) {
            if (!this._called && this._alen) {
              var e = 16 - (this._alen % 16);
              e < 16 && ((e = n.alloc(e, 0)), this._ghash.update(e));
            }
            this._called = !0;
            var r = this._mode.encrypt(this, t);
            return (
              this._decrypt ? this._ghash.update(t) : this._ghash.update(r),
              (this._len += t.length),
              r
            );
          }),
          (u.prototype._final = function () {
            if (this._decrypt && !this._authTag)
              throw new Error(
                "Unsupported state or unable to authenticate data"
              );
            var t = f(
              this._ghash.final(8 * this._alen, 8 * this._len),
              this._cipher.encryptBlock(this._finID)
            );
            if (
              this._decrypt &&
              (function (t, e) {
                var r = 0;
                t.length !== e.length && r++;
                for (var i = Math.min(t.length, e.length), n = 0; n < i; ++n)
                  r += t[n] ^ e[n];
                return r;
              })(t, this._authTag)
            )
              throw new Error(
                "Unsupported state or unable to authenticate data"
              );
            (this._authTag = t), this._cipher.scrub();
          }),
          (u.prototype.getAuthTag = function () {
            if (this._decrypt || !n.isBuffer(this._authTag))
              throw new Error(
                "Attempting to get auth tag in unsupported state"
              );
            return this._authTag;
          }),
          (u.prototype.setAuthTag = function (t) {
            if (!this._decrypt)
              throw new Error(
                "Attempting to set auth tag in unsupported state"
              );
            this._authTag = t;
          }),
          (u.prototype.setAAD = function (t) {
            if (this._called)
              throw new Error("Attempting to set AAD in unsupported state");
            this._ghash.update(t), (this._alen += t.length);
          }),
          (e.exports = u);
      },
      {
        "./aes": 20,
        "./ghash": 25,
        "./incr32": 26,
        "buffer-xor": 62,
        "cipher-base": 64,
        inherits: 132,
        "safe-buffer": 160,
      },
    ],
    22: [
      function (t, e, r) {
        var i = t("./encrypter"),
          n = t("./decrypter"),
          o = t("./modes/list.json");
        (r.createCipher = r.Cipher = i.createCipher),
          (r.createCipheriv = r.Cipheriv = i.createCipheriv),
          (r.createDecipher = r.Decipher = n.createDecipher),
          (r.createDecipheriv = r.Decipheriv = n.createDecipheriv),
          (r.listCiphers = r.getCiphers =
            function () {
              return Object.keys(o);
            });
      },
      { "./decrypter": 23, "./encrypter": 24, "./modes/list.json": 34 },
    ],
    23: [
      function (t, e, r) {
        var i = t("./authCipher"),
          n = t("safe-buffer").Buffer,
          o = t("./modes"),
          s = t("./streamCipher"),
          a = t("cipher-base"),
          f = t("./aes"),
          h = t("evp_bytestokey");
        function u(t, e, r) {
          a.call(this),
            (this._cache = new c()),
            (this._last = void 0),
            (this._cipher = new f.AES(e)),
            (this._prev = n.from(r)),
            (this._mode = t),
            (this._autopadding = !0);
        }
        function c() {
          this.cache = n.allocUnsafe(0);
        }
        function d(t, e, r) {
          var a = o[t.toLowerCase()];
          if (!a) throw new TypeError("invalid suite type");
          if (
            ("string" == typeof r && (r = n.from(r)),
            "GCM" !== a.mode && r.length !== a.iv)
          )
            throw new TypeError("invalid iv length " + r.length);
          if (("string" == typeof e && (e = n.from(e)), e.length !== a.key / 8))
            throw new TypeError("invalid key length " + e.length);
          return "stream" === a.type
            ? new s(a.module, e, r, !0)
            : "auth" === a.type
            ? new i(a.module, e, r, !0)
            : new u(a.module, e, r);
        }
        t("inherits")(u, a),
          (u.prototype._update = function (t) {
            var e, r;
            this._cache.add(t);
            for (var i = []; (e = this._cache.get(this._autopadding)); )
              (r = this._mode.decrypt(this, e)), i.push(r);
            return n.concat(i);
          }),
          (u.prototype._final = function () {
            var t = this._cache.flush();
            if (this._autopadding)
              return (function (t) {
                var e = t[15];
                if (e < 1 || e > 16) throw new Error("unable to decrypt data");
                var r = -1;
                for (; ++r < e; )
                  if (t[r + (16 - e)] !== e)
                    throw new Error("unable to decrypt data");
                if (16 === e) return;
                return t.slice(0, 16 - e);
              })(this._mode.decrypt(this, t));
            if (t) throw new Error("data not multiple of block length");
          }),
          (u.prototype.setAutoPadding = function (t) {
            return (this._autopadding = !!t), this;
          }),
          (c.prototype.add = function (t) {
            this.cache = n.concat([this.cache, t]);
          }),
          (c.prototype.get = function (t) {
            var e;
            if (t) {
              if (this.cache.length > 16)
                return (
                  (e = this.cache.slice(0, 16)),
                  (this.cache = this.cache.slice(16)),
                  e
                );
            } else if (this.cache.length >= 16)
              return (
                (e = this.cache.slice(0, 16)),
                (this.cache = this.cache.slice(16)),
                e
              );
            return null;
          }),
          (c.prototype.flush = function () {
            if (this.cache.length) return this.cache;
          }),
          (r.createDecipher = function (t, e) {
            var r = o[t.toLowerCase()];
            if (!r) throw new TypeError("invalid suite type");
            var i = h(e, !1, r.key, r.iv);
            return d(t, i.key, i.iv);
          }),
          (r.createDecipheriv = d);
      },
      {
        "./aes": 20,
        "./authCipher": 21,
        "./modes": 33,
        "./streamCipher": 36,
        "cipher-base": 64,
        evp_bytestokey: 101,
        inherits: 132,
        "safe-buffer": 160,
      },
    ],
    24: [
      function (t, e, r) {
        var i = t("./modes"),
          n = t("./authCipher"),
          o = t("safe-buffer").Buffer,
          s = t("./streamCipher"),
          a = t("cipher-base"),
          f = t("./aes"),
          h = t("evp_bytestokey");
        function u(t, e, r) {
          a.call(this),
            (this._cache = new d()),
            (this._cipher = new f.AES(e)),
            (this._prev = o.from(r)),
            (this._mode = t),
            (this._autopadding = !0);
        }
        t("inherits")(u, a),
          (u.prototype._update = function (t) {
            var e, r;
            this._cache.add(t);
            for (var i = []; (e = this._cache.get()); )
              (r = this._mode.encrypt(this, e)), i.push(r);
            return o.concat(i);
          });
        var c = o.alloc(16, 16);
        function d() {
          this.cache = o.allocUnsafe(0);
        }
        function l(t, e, r) {
          var a = i[t.toLowerCase()];
          if (!a) throw new TypeError("invalid suite type");
          if (("string" == typeof e && (e = o.from(e)), e.length !== a.key / 8))
            throw new TypeError("invalid key length " + e.length);
          if (
            ("string" == typeof r && (r = o.from(r)),
            "GCM" !== a.mode && r.length !== a.iv)
          )
            throw new TypeError("invalid iv length " + r.length);
          return "stream" === a.type
            ? new s(a.module, e, r)
            : "auth" === a.type
            ? new n(a.module, e, r)
            : new u(a.module, e, r);
        }
        (u.prototype._final = function () {
          var t = this._cache.flush();
          if (this._autopadding)
            return (t = this._mode.encrypt(this, t)), this._cipher.scrub(), t;
          if (!t.equals(c))
            throw (
              (this._cipher.scrub(),
              new Error("data not multiple of block length"))
            );
        }),
          (u.prototype.setAutoPadding = function (t) {
            return (this._autopadding = !!t), this;
          }),
          (d.prototype.add = function (t) {
            this.cache = o.concat([this.cache, t]);
          }),
          (d.prototype.get = function () {
            if (this.cache.length > 15) {
              var t = this.cache.slice(0, 16);
              return (this.cache = this.cache.slice(16)), t;
            }
            return null;
          }),
          (d.prototype.flush = function () {
            for (
              var t = 16 - this.cache.length, e = o.allocUnsafe(t), r = -1;
              ++r < t;

            )
              e.writeUInt8(t, r);
            return o.concat([this.cache, e]);
          }),
          (r.createCipheriv = l),
          (r.createCipher = function (t, e) {
            var r = i[t.toLowerCase()];
            if (!r) throw new TypeError("invalid suite type");
            var n = h(e, !1, r.key, r.iv);
            return l(t, n.key, n.iv);
          });
      },
      {
        "./aes": 20,
        "./authCipher": 21,
        "./modes": 33,
        "./streamCipher": 36,
        "cipher-base": 64,
        evp_bytestokey: 101,
        inherits: 132,
        "safe-buffer": 160,
      },
    ],
    25: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer,
          n = i.alloc(16, 0);
        function o(t) {
          var e = i.allocUnsafe(16);
          return (
            e.writeUInt32BE(t[0] >>> 0, 0),
            e.writeUInt32BE(t[1] >>> 0, 4),
            e.writeUInt32BE(t[2] >>> 0, 8),
            e.writeUInt32BE(t[3] >>> 0, 12),
            e
          );
        }
        function s(t) {
          (this.h = t),
            (this.state = i.alloc(16, 0)),
            (this.cache = i.allocUnsafe(0));
        }
        (s.prototype.ghash = function (t) {
          for (var e = -1; ++e < t.length; ) this.state[e] ^= t[e];
          this._multiply();
        }),
          (s.prototype._multiply = function () {
            for (
              var t,
                e,
                r,
                i = [
                  (t = this.h).readUInt32BE(0),
                  t.readUInt32BE(4),
                  t.readUInt32BE(8),
                  t.readUInt32BE(12),
                ],
                n = [0, 0, 0, 0],
                s = -1;
              ++s < 128;

            ) {
              for (
                0 != (this.state[~~(s / 8)] & (1 << (7 - (s % 8)))) &&
                  ((n[0] ^= i[0]),
                  (n[1] ^= i[1]),
                  (n[2] ^= i[2]),
                  (n[3] ^= i[3])),
                  r = 0 != (1 & i[3]),
                  e = 3;
                e > 0;
                e--
              )
                i[e] = (i[e] >>> 1) | ((1 & i[e - 1]) << 31);
              (i[0] = i[0] >>> 1), r && (i[0] = i[0] ^ (225 << 24));
            }
            this.state = o(n);
          }),
          (s.prototype.update = function (t) {
            var e;
            for (
              this.cache = i.concat([this.cache, t]);
              this.cache.length >= 16;

            )
              (e = this.cache.slice(0, 16)),
                (this.cache = this.cache.slice(16)),
                this.ghash(e);
          }),
          (s.prototype.final = function (t, e) {
            return (
              this.cache.length && this.ghash(i.concat([this.cache, n], 16)),
              this.ghash(o([0, t, 0, e])),
              this.state
            );
          }),
          (e.exports = s);
      },
      { "safe-buffer": 160 },
    ],
    26: [
      function (t, e, r) {
        e.exports = function (t) {
          for (var e, r = t.length; r--; ) {
            if (255 !== (e = t.readUInt8(r))) {
              e++, t.writeUInt8(e, r);
              break;
            }
            t.writeUInt8(0, r);
          }
        };
      },
      {},
    ],
    27: [
      function (t, e, r) {
        var i = t("buffer-xor");
        (r.encrypt = function (t, e) {
          var r = i(e, t._prev);
          return (t._prev = t._cipher.encryptBlock(r)), t._prev;
        }),
          (r.decrypt = function (t, e) {
            var r = t._prev;
            t._prev = e;
            var n = t._cipher.decryptBlock(e);
            return i(n, r);
          });
      },
      { "buffer-xor": 62 },
    ],
    28: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer,
          n = t("buffer-xor");
        function o(t, e, r) {
          var o = e.length,
            s = n(e, t._cache);
          return (
            (t._cache = t._cache.slice(o)),
            (t._prev = i.concat([t._prev, r ? e : s])),
            s
          );
        }
        r.encrypt = function (t, e, r) {
          for (var n, s = i.allocUnsafe(0); e.length; ) {
            if (
              (0 === t._cache.length &&
                ((t._cache = t._cipher.encryptBlock(t._prev)),
                (t._prev = i.allocUnsafe(0))),
              !(t._cache.length <= e.length))
            ) {
              s = i.concat([s, o(t, e, r)]);
              break;
            }
            (n = t._cache.length),
              (s = i.concat([s, o(t, e.slice(0, n), r)])),
              (e = e.slice(n));
          }
          return s;
        };
      },
      { "buffer-xor": 62, "safe-buffer": 160 },
    ],
    29: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer;
        function n(t, e, r) {
          for (var i, n, s = -1, a = 0; ++s < 8; )
            (i = e & (1 << (7 - s)) ? 128 : 0),
              (a +=
                (128 & (n = t._cipher.encryptBlock(t._prev)[0] ^ i)) >> s % 8),
              (t._prev = o(t._prev, r ? i : n));
          return a;
        }
        function o(t, e) {
          var r = t.length,
            n = -1,
            o = i.allocUnsafe(t.length);
          for (t = i.concat([t, i.from([e])]); ++n < r; )
            o[n] = (t[n] << 1) | (t[n + 1] >> 7);
          return o;
        }
        r.encrypt = function (t, e, r) {
          for (var o = e.length, s = i.allocUnsafe(o), a = -1; ++a < o; )
            s[a] = n(t, e[a], r);
          return s;
        };
      },
      { "safe-buffer": 160 },
    ],
    30: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer;
        function n(t, e, r) {
          var n = t._cipher.encryptBlock(t._prev)[0] ^ e;
          return (
            (t._prev = i.concat([t._prev.slice(1), i.from([r ? e : n])])), n
          );
        }
        r.encrypt = function (t, e, r) {
          for (var o = e.length, s = i.allocUnsafe(o), a = -1; ++a < o; )
            s[a] = n(t, e[a], r);
          return s;
        };
      },
      { "safe-buffer": 160 },
    ],
    31: [
      function (t, e, r) {
        var i = t("buffer-xor"),
          n = t("safe-buffer").Buffer,
          o = t("../incr32");
        function s(t) {
          var e = t._cipher.encryptBlockRaw(t._prev);
          return o(t._prev), e;
        }
        r.encrypt = function (t, e) {
          var r = Math.ceil(e.length / 16),
            o = t._cache.length;
          t._cache = n.concat([t._cache, n.allocUnsafe(16 * r)]);
          for (var a = 0; a < r; a++) {
            var f = s(t),
              h = o + 16 * a;
            t._cache.writeUInt32BE(f[0], h + 0),
              t._cache.writeUInt32BE(f[1], h + 4),
              t._cache.writeUInt32BE(f[2], h + 8),
              t._cache.writeUInt32BE(f[3], h + 12);
          }
          var u = t._cache.slice(0, e.length);
          return (t._cache = t._cache.slice(e.length)), i(e, u);
        };
      },
      { "../incr32": 26, "buffer-xor": 62, "safe-buffer": 160 },
    ],
    32: [
      function (t, e, r) {
        (r.encrypt = function (t, e) {
          return t._cipher.encryptBlock(e);
        }),
          (r.decrypt = function (t, e) {
            return t._cipher.decryptBlock(e);
          });
      },
      {},
    ],
    33: [
      function (t, e, r) {
        var i = {
            ECB: t("./ecb"),
            CBC: t("./cbc"),
            CFB: t("./cfb"),
            CFB8: t("./cfb8"),
            CFB1: t("./cfb1"),
            OFB: t("./ofb"),
            CTR: t("./ctr"),
            GCM: t("./ctr"),
          },
          n = t("./list.json");
        for (var o in n) n[o].module = i[n[o].mode];
        e.exports = n;
      },
      {
        "./cbc": 27,
        "./cfb": 28,
        "./cfb1": 29,
        "./cfb8": 30,
        "./ctr": 31,
        "./ecb": 32,
        "./list.json": 34,
        "./ofb": 35,
      },
    ],
    34: [
      function (t, e, r) {
        e.exports = {
          "aes-128-ecb": {
            cipher: "AES",
            key: 128,
            iv: 0,
            mode: "ECB",
            type: "block",
          },
          "aes-192-ecb": {
            cipher: "AES",
            key: 192,
            iv: 0,
            mode: "ECB",
            type: "block",
          },
          "aes-256-ecb": {
            cipher: "AES",
            key: 256,
            iv: 0,
            mode: "ECB",
            type: "block",
          },
          "aes-128-cbc": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CBC",
            type: "block",
          },
          "aes-192-cbc": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CBC",
            type: "block",
          },
          "aes-256-cbc": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CBC",
            type: "block",
          },
          aes128: {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CBC",
            type: "block",
          },
          aes192: {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CBC",
            type: "block",
          },
          aes256: {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CBC",
            type: "block",
          },
          "aes-128-cfb": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CFB",
            type: "stream",
          },
          "aes-192-cfb": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CFB",
            type: "stream",
          },
          "aes-256-cfb": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CFB",
            type: "stream",
          },
          "aes-128-cfb8": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CFB8",
            type: "stream",
          },
          "aes-192-cfb8": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CFB8",
            type: "stream",
          },
          "aes-256-cfb8": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CFB8",
            type: "stream",
          },
          "aes-128-cfb1": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CFB1",
            type: "stream",
          },
          "aes-192-cfb1": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CFB1",
            type: "stream",
          },
          "aes-256-cfb1": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CFB1",
            type: "stream",
          },
          "aes-128-ofb": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "OFB",
            type: "stream",
          },
          "aes-192-ofb": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "OFB",
            type: "stream",
          },
          "aes-256-ofb": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "OFB",
            type: "stream",
          },
          "aes-128-ctr": {
            cipher: "AES",
            key: 128,
            iv: 16,
            mode: "CTR",
            type: "stream",
          },
          "aes-192-ctr": {
            cipher: "AES",
            key: 192,
            iv: 16,
            mode: "CTR",
            type: "stream",
          },
          "aes-256-ctr": {
            cipher: "AES",
            key: 256,
            iv: 16,
            mode: "CTR",
            type: "stream",
          },
          "aes-128-gcm": {
            cipher: "AES",
            key: 128,
            iv: 12,
            mode: "GCM",
            type: "auth",
          },
          "aes-192-gcm": {
            cipher: "AES",
            key: 192,
            iv: 12,
            mode: "GCM",
            type: "auth",
          },
          "aes-256-gcm": {
            cipher: "AES",
            key: 256,
            iv: 12,
            mode: "GCM",
            type: "auth",
          },
        };
      },
      {},
    ],
    35: [
      function (t, e, r) {
        (function (e) {
          (function () {
            var i = t("buffer-xor");
            function n(t) {
              return (t._prev = t._cipher.encryptBlock(t._prev)), t._prev;
            }
            r.encrypt = function (t, r) {
              for (; t._cache.length < r.length; )
                t._cache = e.concat([t._cache, n(t)]);
              var o = t._cache.slice(0, r.length);
              return (t._cache = t._cache.slice(r.length)), i(r, o);
            };
          }).call(this);
        }).call(this, t("buffer").Buffer);
      },
      { buffer: 63, "buffer-xor": 62 },
    ],
    36: [
      function (t, e, r) {
        var i = t("./aes"),
          n = t("safe-buffer").Buffer,
          o = t("cipher-base");
        function s(t, e, r, s) {
          o.call(this),
            (this._cipher = new i.AES(e)),
            (this._prev = n.from(r)),
            (this._cache = n.allocUnsafe(0)),
            (this._secCache = n.allocUnsafe(0)),
            (this._decrypt = s),
            (this._mode = t);
        }
        t("inherits")(s, o),
          (s.prototype._update = function (t) {
            return this._mode.encrypt(this, t, this._decrypt);
          }),
          (s.prototype._final = function () {
            this._cipher.scrub();
          }),
          (e.exports = s);
      },
      { "./aes": 20, "cipher-base": 64, inherits: 132, "safe-buffer": 160 },
    ],
    37: [
      function (t, e, r) {
        var i = t("browserify-des"),
          n = t("browserify-aes/browser"),
          o = t("browserify-aes/modes"),
          s = t("browserify-des/modes"),
          a = t("evp_bytestokey");
        function f(t, e, r) {
          if (((t = t.toLowerCase()), o[t])) return n.createCipheriv(t, e, r);
          if (s[t]) return new i({ key: e, iv: r, mode: t });
          throw new TypeError("invalid suite type");
        }
        function h(t, e, r) {
          if (((t = t.toLowerCase()), o[t])) return n.createDecipheriv(t, e, r);
          if (s[t]) return new i({ key: e, iv: r, mode: t, decrypt: !0 });
          throw new TypeError("invalid suite type");
        }
        (r.createCipher = r.Cipher =
          function (t, e) {
            var r, i;
            if (((t = t.toLowerCase()), o[t])) (r = o[t].key), (i = o[t].iv);
            else {
              if (!s[t]) throw new TypeError("invalid suite type");
              (r = 8 * s[t].key), (i = s[t].iv);
            }
            var n = a(e, !1, r, i);
            return f(t, n.key, n.iv);
          }),
          (r.createCipheriv = r.Cipheriv = f),
          (r.createDecipher = r.Decipher =
            function (t, e) {
              var r, i;
              if (((t = t.toLowerCase()), o[t])) (r = o[t].key), (i = o[t].iv);
              else {
                if (!s[t]) throw new TypeError("invalid suite type");
                (r = 8 * s[t].key), (i = s[t].iv);
              }
              var n = a(e, !1, r, i);
              return h(t, n.key, n.iv);
            }),
          (r.createDecipheriv = r.Decipheriv = h),
          (r.listCiphers = r.getCiphers =
            function () {
              return Object.keys(s).concat(n.getCiphers());
            });
      },
      {
        "browserify-aes/browser": 22,
        "browserify-aes/modes": 33,
        "browserify-des": 38,
        "browserify-des/modes": 39,
        evp_bytestokey: 101,
      },
    ],
    38: [
      function (t, e, r) {
        var i = t("cipher-base"),
          n = t("des.js"),
          o = t("inherits"),
          s = t("safe-buffer").Buffer,
          a = {
            "des-ede3-cbc": n.CBC.instantiate(n.EDE),
            "des-ede3": n.EDE,
            "des-ede-cbc": n.CBC.instantiate(n.EDE),
            "des-ede": n.EDE,
            "des-cbc": n.CBC.instantiate(n.DES),
            "des-ecb": n.DES,
          };
        function f(t) {
          i.call(this);
          var e,
            r = t.mode.toLowerCase(),
            n = a[r];
          e = t.decrypt ? "decrypt" : "encrypt";
          var o = t.key;
          s.isBuffer(o) || (o = s.from(o)),
            ("des-ede" !== r && "des-ede-cbc" !== r) ||
              (o = s.concat([o, o.slice(0, 8)]));
          var f = t.iv;
          s.isBuffer(f) || (f = s.from(f)),
            (this._des = n.create({ key: o, iv: f, type: e }));
        }
        (a.des = a["des-cbc"]),
          (a.des3 = a["des-ede3-cbc"]),
          (e.exports = f),
          o(f, i),
          (f.prototype._update = function (t) {
            return s.from(this._des.update(t));
          }),
          (f.prototype._final = function () {
            return s.from(this._des.final());
          });
      },
      { "cipher-base": 64, "des.js": 72, inherits: 132, "safe-buffer": 160 },
    ],
    39: [
      function (t, e, r) {
        (r["des-ecb"] = { key: 8, iv: 0 }),
          (r["des-cbc"] = r.des = { key: 8, iv: 8 }),
          (r["des-ede3-cbc"] = r.des3 = { key: 24, iv: 8 }),
          (r["des-ede3"] = { key: 24, iv: 0 }),
          (r["des-ede-cbc"] = { key: 16, iv: 8 }),
          (r["des-ede"] = { key: 16, iv: 0 });
      },
      {},
    ],
    40: [
      function (t, e, r) {
        (function (r) {
          (function () {
            var i = t("bn.js"),
              n = t("randombytes");
            function o(t) {
              var e,
                r = t.modulus.byteLength();
              do {
                e = new i(n(r));
              } while (
                e.cmp(t.modulus) >= 0 ||
                !e.umod(t.prime1) ||
                !e.umod(t.prime2)
              );
              return e;
            }
            function s(t, e) {
              var n = (function (t) {
                  var e = o(t);
                  return {
                    blinder: e
                      .toRed(i.mont(t.modulus))
                      .redPow(new i(t.publicExponent))
                      .fromRed(),
                    unblinder: e.invm(t.modulus),
                  };
                })(e),
                s = e.modulus.byteLength(),
                a = new i(t).mul(n.blinder).umod(e.modulus),
                f = a.toRed(i.mont(e.prime1)),
                h = a.toRed(i.mont(e.prime2)),
                u = e.coefficient,
                c = e.prime1,
                d = e.prime2,
                l = f.redPow(e.exponent1).fromRed(),
                p = h.redPow(e.exponent2).fromRed(),
                b = l.isub(p).imul(u).umod(c).imul(d);
              return p
                .iadd(b)
                .imul(n.unblinder)
                .umod(e.modulus)
                .toArrayLike(r, "be", s);
            }
            (s.getr = o), (e.exports = s);
          }).call(this);
        }).call(this, t("buffer").Buffer);
      },
      { "bn.js": 17, buffer: 63, randombytes: 157 },
    ],
    41: [
      function (t, e, r) {
        e.exports = t("./browser/algorithms.json");
      },
      { "./browser/algorithms.json": 42 },
    ],
    42: [
      function (t, e, r) {
        e.exports = {
          sha224WithRSAEncryption: {
            sign: "rsa",
            hash: "sha224",
            id: "302d300d06096086480165030402040500041c",
          },
          "RSA-SHA224": {
            sign: "ecdsa/rsa",
            hash: "sha224",
            id: "302d300d06096086480165030402040500041c",
          },
          sha256WithRSAEncryption: {
            sign: "rsa",
            hash: "sha256",
            id: "3031300d060960864801650304020105000420",
          },
          "RSA-SHA256": {
            sign: "ecdsa/rsa",
            hash: "sha256",
            id: "3031300d060960864801650304020105000420",
          },
          sha384WithRSAEncryption: {
            sign: "rsa",
            hash: "sha384",
            id: "3041300d060960864801650304020205000430",
          },
          "RSA-SHA384": {
            sign: "ecdsa/rsa",
            hash: "sha384",
            id: "3041300d060960864801650304020205000430",
          },
          sha512WithRSAEncryption: {
            sign: "rsa",
            hash: "sha512",
            id: "3051300d060960864801650304020305000440",
          },
          "RSA-SHA512": {
            sign: "ecdsa/rsa",
            hash: "sha512",
            id: "3051300d060960864801650304020305000440",
          },
          "RSA-SHA1": {
            sign: "rsa",
            hash: "sha1",
            id: "3021300906052b0e03021a05000414",
          },
          "ecdsa-with-SHA1": { sign: "ecdsa", hash: "sha1", id: "" },
          sha256: { sign: "ecdsa", hash: "sha256", id: "" },
          sha224: { sign: "ecdsa", hash: "sha224", id: "" },
          sha384: { sign: "ecdsa", hash: "sha384", id: "" },
          sha512: { sign: "ecdsa", hash: "sha512", id: "" },
          "DSA-SHA": { sign: "dsa", hash: "sha1", id: "" },
          "DSA-SHA1": { sign: "dsa", hash: "sha1", id: "" },
          DSA: { sign: "dsa", hash: "sha1", id: "" },
          "DSA-WITH-SHA224": { sign: "dsa", hash: "sha224", id: "" },
          "DSA-SHA224": { sign: "dsa", hash: "sha224", id: "" },
          "DSA-WITH-SHA256": { sign: "dsa", hash: "sha256", id: "" },
          "DSA-SHA256": { sign: "dsa", hash: "sha256", id: "" },
          "DSA-WITH-SHA384": { sign: "dsa", hash: "sha384", id: "" },
          "DSA-SHA384": { sign: "dsa", hash: "sha384", id: "" },
          "DSA-WITH-SHA512": { sign: "dsa", hash: "sha512", id: "" },
          "DSA-SHA512": { sign: "dsa", hash: "sha512", id: "" },
          "DSA-RIPEMD160": { sign: "dsa", hash: "rmd160", id: "" },
          ripemd160WithRSA: {
            sign: "rsa",
            hash: "rmd160",
            id: "3021300906052b2403020105000414",
          },
          "RSA-RIPEMD160": {
            sign: "rsa",
            hash: "rmd160",
            id: "3021300906052b2403020105000414",
          },
          md5WithRSAEncryption: {
            sign: "rsa",
            hash: "md5",
            id: "3020300c06082a864886f70d020505000410",
          },
          "RSA-MD5": {
            sign: "rsa",
            hash: "md5",
            id: "3020300c06082a864886f70d020505000410",
          },
        };
      },
      {},
    ],
    43: [
      function (t, e, r) {
        e.exports = {
          "1.3.132.0.10": "secp256k1",
          "1.3.132.0.33": "p224",
          "1.2.840.10045.3.1.1": "p192",
          "1.2.840.10045.3.1.7": "p256",
          "1.3.132.0.34": "p384",
          "1.3.132.0.35": "p521",
        };
      },
      {},
    ],
    44: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer,
          n = t("create-hash"),
          o = t("readable-stream"),
          s = t("inherits"),
          a = t("./sign"),
          f = t("./verify"),
          h = t("./algorithms.json");
        function u(t) {
          o.Writable.call(this);
          var e = h[t];
          if (!e) throw new Error("Unknown message digest");
          (this._hashType = e.hash),
            (this._hash = n(e.hash)),
            (this._tag = e.id),
            (this._signType = e.sign);
        }
        function c(t) {
          o.Writable.call(this);
          var e = h[t];
          if (!e) throw new Error("Unknown message digest");
          (this._hash = n(e.hash)),
            (this._tag = e.id),
            (this._signType = e.sign);
        }
        function d(t) {
          return new u(t);
        }
        function l(t) {
          return new c(t);
        }
        Object.keys(h).forEach(function (t) {
          (h[t].id = i.from(h[t].id, "hex")), (h[t.toLowerCase()] = h[t]);
        }),
          s(u, o.Writable),
          (u.prototype._write = function (t, e, r) {
            this._hash.update(t), r();
          }),
          (u.prototype.update = function (t, e) {
            return (
              "string" == typeof t && (t = i.from(t, e)),
              this._hash.update(t),
              this
            );
          }),
          (u.prototype.sign = function (t, e) {
            this.end();
            var r = this._hash.digest(),
              i = a(r, t, this._hashType, this._signType, this._tag);
            return e ? i.toString(e) : i;
          }),
          s(c, o.Writable),
          (c.prototype._write = function (t, e, r) {
            this._hash.update(t), r();
          }),
          (c.prototype.update = function (t, e) {
            return (
              "string" == typeof t && (t = i.from(t, e)),
              this._hash.update(t),
              this
            );
          }),
          (c.prototype.verify = function (t, e, r) {
            "string" == typeof e && (e = i.from(e, r)), this.end();
            var n = this._hash.digest();
            return f(e, n, t, this._signType, this._tag);
          }),
          (e.exports = { Sign: d, Verify: l, createSign: d, createVerify: l });
      },
      {
        "./algorithms.json": 42,
        "./sign": 45,
        "./verify": 46,
        "create-hash": 67,
        inherits: 132,
        "readable-stream": 61,
        "safe-buffer": 160,
      },
    ],
    45: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer,
          n = t("create-hmac"),
          o = t("browserify-rsa"),
          s = t("elliptic").ec,
          a = t("bn.js"),
          f = t("parse-asn1"),
          h = t("./curves.json");
        function u(t, e, r, o) {
          if ((t = i.from(t.toArray())).length < e.byteLength()) {
            var s = i.alloc(e.byteLength() - t.length);
            t = i.concat([s, t]);
          }
          var a = r.length,
            f = (function (t, e) {
              (t = c(t, e)), (t = t.mod(e));
              var r = i.from(t.toArray());
              if (r.length < e.byteLength()) {
                var n = i.alloc(e.byteLength() - r.length);
                r = i.concat([n, r]);
              }
              return r;
            })(r, e),
            h = i.alloc(a);
          h.fill(1);
          var u = i.alloc(a);
          return (
            (u = n(o, u)
              .update(h)
              .update(i.from([0]))
              .update(t)
              .update(f)
              .digest()),
            (h = n(o, u).update(h).digest()),
            {
              k: (u = n(o, u)
                .update(h)
                .update(i.from([1]))
                .update(t)
                .update(f)
                .digest()),
              v: (h = n(o, u).update(h).digest()),
            }
          );
        }
        function c(t, e) {
          var r = new a(t),
            i = (t.length << 3) - e.bitLength();
          return i > 0 && r.ishrn(i), r;
        }
        function d(t, e, r) {
          var o, s;
          do {
            for (o = i.alloc(0); 8 * o.length < t.bitLength(); )
              (e.v = n(r, e.k).update(e.v).digest()), (o = i.concat([o, e.v]));
            (s = c(o, t)),
              (e.k = n(r, e.k)
                .update(e.v)
                .update(i.from([0]))
                .digest()),
              (e.v = n(r, e.k).update(e.v).digest());
          } while (-1 !== s.cmp(t));
          return s;
        }
        function l(t, e, r, i) {
          return t.toRed(a.mont(r)).redPow(e).fromRed().mod(i);
        }
        (e.exports = function (t, e, r, n, p) {
          var b = f(e);
          if (b.curve) {
            if ("ecdsa" !== n && "ecdsa/rsa" !== n)
              throw new Error("wrong private key type");
            return (function (t, e) {
              var r = h[e.curve.join(".")];
              if (!r) throw new Error("unknown curve " + e.curve.join("."));
              var n = new s(r).keyFromPrivate(e.privateKey),
                o = n.sign(t);
              return i.from(o.toDER());
            })(t, b);
          }
          if ("dsa" === b.type) {
            if ("dsa" !== n) throw new Error("wrong private key type");
            return (function (t, e, r) {
              var n,
                o = e.params.priv_key,
                s = e.params.p,
                f = e.params.q,
                h = e.params.g,
                p = new a(0),
                b = c(t, f).mod(f),
                m = !1,
                y = u(o, f, t, r);
              for (; !1 === m; )
                (p = l(h, (n = d(f, y, r)), s, f)),
                  0 ===
                    (m = n
                      .invm(f)
                      .imul(b.add(o.mul(p)))
                      .mod(f)).cmpn(0) && ((m = !1), (p = new a(0)));
              return (function (t, e) {
                (t = t.toArray()),
                  (e = e.toArray()),
                  128 & t[0] && (t = [0].concat(t));
                128 & e[0] && (e = [0].concat(e));
                var r = t.length + e.length + 4,
                  n = [48, r, 2, t.length];
                return (n = n.concat(t, [2, e.length], e)), i.from(n);
              })(p, m);
            })(t, b, r);
          }
          if ("rsa" !== n && "ecdsa/rsa" !== n)
            throw new Error("wrong private key type");
          t = i.concat([p, t]);
          for (
            var m = b.modulus.byteLength(), y = [0, 1];
            t.length + y.length + 1 < m;

          )
            y.push(255);
          y.push(0);
          for (var g = -1; ++g < t.length; ) y.push(t[g]);
          return o(y, b);
        }),
          (e.exports.getKey = u),
          (e.exports.makeKey = d);
      },
      {
        "./curves.json": 43,
        "bn.js": 17,
        "browserify-rsa": 40,
        "create-hmac": 69,
        elliptic: 83,
        "parse-asn1": 142,
        "safe-buffer": 160,
      },
    ],
    46: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer,
          n = t("bn.js"),
          o = t("elliptic").ec,
          s = t("parse-asn1"),
          a = t("./curves.json");
        function f(t, e) {
          if (t.cmpn(0) <= 0) throw new Error("invalid sig");
          if (t.cmp(e) >= e) throw new Error("invalid sig");
        }
        e.exports = function (t, e, r, h, u) {
          var c = s(r);
          if ("ec" === c.type) {
            if ("ecdsa" !== h && "ecdsa/rsa" !== h)
              throw new Error("wrong public key type");
            return (function (t, e, r) {
              var i = a[r.data.algorithm.curve.join(".")];
              if (!i)
                throw new Error(
                  "unknown curve " + r.data.algorithm.curve.join(".")
                );
              var n = new o(i),
                s = r.data.subjectPrivateKey.data;
              return n.verify(e, t, s);
            })(t, e, c);
          }
          if ("dsa" === c.type) {
            if ("dsa" !== h) throw new Error("wrong public key type");
            return (function (t, e, r) {
              var i = r.data.p,
                o = r.data.q,
                a = r.data.g,
                h = r.data.pub_key,
                u = s.signature.decode(t, "der"),
                c = u.s,
                d = u.r;
              f(c, o), f(d, o);
              var l = n.mont(i),
                p = c.invm(o),
                b = a
                  .toRed(l)
                  .redPow(new n(e).mul(p).mod(o))
                  .fromRed()
                  .mul(h.toRed(l).redPow(d.mul(p).mod(o)).fromRed())
                  .mod(i)
                  .mod(o);
              return 0 === b.cmp(d);
            })(t, e, c);
          }
          if ("rsa" !== h && "ecdsa/rsa" !== h)
            throw new Error("wrong public key type");
          e = i.concat([u, e]);
          for (
            var d = c.modulus.byteLength(), l = [1], p = 0;
            e.length + l.length + 2 < d;

          )
            l.push(255), p++;
          l.push(0);
          for (var b = -1; ++b < e.length; ) l.push(e[b]);
          l = i.from(l);
          var m = n.mont(c.modulus);
          (t = (t = new n(t).toRed(m)).redPow(new n(c.publicExponent))),
            (t = i.from(t.fromRed().toArray()));
          var y = p < 8 ? 1 : 0;
          for (
            d = Math.min(t.length, l.length),
              t.length !== l.length && (y = 1),
              b = -1;
            ++b < d;

          )
            y |= t[b] ^ l[b];
          return 0 === y;
        };
      },
      {
        "./curves.json": 43,
        "bn.js": 17,
        elliptic: 83,
        "parse-asn1": 142,
        "safe-buffer": 160,
      },
    ],
    47: [
      function (t, e, r) {
        "use strict";
        var i = {};
        function n(t, e, r) {
          r || (r = Error);
          var n = (function (t) {
            var r, i;
            function n(r, i, n) {
              return (
                t.call(
                  this,
                  (function (t, r, i) {
                    return "string" == typeof e ? e : e(t, r, i);
                  })(r, i, n)
                ) || this
              );
            }
            return (
              (i = t),
              ((r = n).prototype = Object.create(i.prototype)),
              (r.prototype.constructor = r),
              (r.__proto__ = i),
              n
            );
          })(r);
          (n.prototype.name = r.name), (n.prototype.code = t), (i[t] = n);
        }
        function o(t, e) {
          if (Array.isArray(t)) {
            var r = t.length;
            return (
              (t = t.map(function (t) {
                return String(t);
              })),
              r > 2
                ? "one of "
                    .concat(e, " ")
                    .concat(t.slice(0, r - 1).join(", "), ", or ") + t[r - 1]
                : 2 === r
                ? "one of ".concat(e, " ").concat(t[0], " or ").concat(t[1])
                : "of ".concat(e, " ").concat(t[0])
            );
          }
          return "of ".concat(e, " ").concat(String(t));
        }
        n(
          "ERR_INVALID_OPT_VALUE",
          function (t, e) {
            return 'The value "' + e + '" is invalid for option "' + t + '"';
          },
          TypeError
        ),
          n(
            "ERR_INVALID_ARG_TYPE",
            function (t, e, r) {
              var i, n, s, a;
              if (
                ("string" == typeof e &&
                ((n = "not "), e.substr(!s || s < 0 ? 0 : +s, n.length) === n)
                  ? ((i = "must not be"), (e = e.replace(/^not /, "")))
                  : (i = "must be"),
                (function (t, e, r) {
                  return (
                    (void 0 === r || r > t.length) && (r = t.length),
                    t.substring(r - e.length, r) === e
                  );
                })(t, " argument"))
              )
                a = "The ".concat(t, " ").concat(i, " ").concat(o(e, "type"));
              else {
                var f = (function (t, e, r) {
                  return (
                    "number" != typeof r && (r = 0),
                    !(r + e.length > t.length) && -1 !== t.indexOf(e, r)
                  );
                })(t, ".")
                  ? "property"
                  : "argument";
                a = 'The "'
                  .concat(t, '" ')
                  .concat(f, " ")
                  .concat(i, " ")
                  .concat(o(e, "type"));
              }
              return (a += ". Received type ".concat(typeof r));
            },
            TypeError
          ),
          n("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF"),
          n("ERR_METHOD_NOT_IMPLEMENTED", function (t) {
            return "The " + t + " method is not implemented";
          }),
          n("ERR_STREAM_PREMATURE_CLOSE", "Premature close"),
          n("ERR_STREAM_DESTROYED", function (t) {
            return "Cannot call " + t + " after a stream was destroyed";
          }),
          n("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"),
          n("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable"),
          n("ERR_STREAM_WRITE_AFTER_END", "write after end"),
          n(
            "ERR_STREAM_NULL_VALUES",
            "May not write null values to stream",
            TypeError
          ),
          n(
            "ERR_UNKNOWN_ENCODING",
            function (t) {
              return "Unknown encoding: " + t;
            },
            TypeError
          ),
          n(
            "ERR_STREAM_UNSHIFT_AFTER_END_EVENT",
            "stream.unshift() after end event"
          ),
          (e.exports.codes = i);
      },
      {},
    ],
    48: [
      function (t, e, r) {
        (function (r) {
          (function () {
            "use strict";
            var i =
              Object.keys ||
              function (t) {
                var e = [];
                for (var r in t) e.push(r);
                return e;
              };
            e.exports = h;
            var n = t("./_stream_readable"),
              o = t("./_stream_writable");
            t("inherits")(h, n);
            for (var s = i(o.prototype), a = 0; a < s.length; a++) {
              var f = s[a];
              h.prototype[f] || (h.prototype[f] = o.prototype[f]);
            }
            function h(t) {
              if (!(this instanceof h)) return new h(t);
              n.call(this, t),
                o.call(this, t),
                (this.allowHalfOpen = !0),
                t &&
                  (!1 === t.readable && (this.readable = !1),
                  !1 === t.writable && (this.writable = !1),
                  !1 === t.allowHalfOpen &&
                    ((this.allowHalfOpen = !1), this.once("end", u)));
            }
            function u() {
              this._writableState.ended || r.nextTick(c, this);
            }
            function c(t) {
              t.end();
            }
            Object.defineProperty(h.prototype, "writableHighWaterMark", {
              enumerable: !1,
              get: function () {
                return this._writableState.highWaterMark;
              },
            }),
              Object.defineProperty(h.prototype, "writableBuffer", {
                enumerable: !1,
                get: function () {
                  return this._writableState && this._writableState.getBuffer();
                },
              }),
              Object.defineProperty(h.prototype, "writableLength", {
                enumerable: !1,
                get: function () {
                  return this._writableState.length;
                },
              }),
              Object.defineProperty(h.prototype, "destroyed", {
                enumerable: !1,
                get: function () {
                  return (
                    void 0 !== this._readableState &&
                    void 0 !== this._writableState &&
                    this._readableState.destroyed &&
                    this._writableState.destroyed
                  );
                },
                set: function (t) {
                  void 0 !== this._readableState &&
                    void 0 !== this._writableState &&
                    ((this._readableState.destroyed = t),
                    (this._writableState.destroyed = t));
                },
              });
          }).call(this);
        }).call(this, t("_process"));
      },
      {
        "./_stream_readable": 50,
        "./_stream_writable": 52,
        _process: 149,
        inherits: 132,
      },
    ],
    49: [
      function (t, e, r) {
        "use strict";
        e.exports = n;
        var i = t("./_stream_transform");
        function n(t) {
          if (!(this instanceof n)) return new n(t);
          i.call(this, t);
        }
        t("inherits")(n, i),
          (n.prototype._transform = function (t, e, r) {
            r(null, t);
          });
      },
      { "./_stream_transform": 51, inherits: 132 },
    ],
    50: [
      function (t, e, r) {
        (function (r, i) {
          (function () {
            "use strict";
            var n;
            (e.exports = A), (A.ReadableState = E);
            t("events").EventEmitter;
            var o = function (t, e) {
                return t.listeners(e).length;
              },
              s = t("./internal/streams/stream"),
              a = t("buffer").Buffer,
              f = i.Uint8Array || function () {};
            var h,
              u = t("util");
            h = u && u.debuglog ? u.debuglog("stream") : function () {};
            var c,
              d,
              l,
              p = t("./internal/streams/buffer_list"),
              b = t("./internal/streams/destroy"),
              m = t("./internal/streams/state").getHighWaterMark,
              y = t("../errors").codes,
              g = y.ERR_INVALID_ARG_TYPE,
              v = y.ERR_STREAM_PUSH_AFTER_EOF,
              w = y.ERR_METHOD_NOT_IMPLEMENTED,
              _ = y.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;
            t("inherits")(A, s);
            var M = b.errorOrDestroy,
              S = ["error", "close", "destroy", "pause", "resume"];
            function E(e, r, i) {
              (n = n || t("./_stream_duplex")),
                (e = e || {}),
                "boolean" != typeof i && (i = r instanceof n),
                (this.objectMode = !!e.objectMode),
                i &&
                  (this.objectMode = this.objectMode || !!e.readableObjectMode),
                (this.highWaterMark = m(this, e, "readableHighWaterMark", i)),
                (this.buffer = new p()),
                (this.length = 0),
                (this.pipes = null),
                (this.pipesCount = 0),
                (this.flowing = null),
                (this.ended = !1),
                (this.endEmitted = !1),
                (this.reading = !1),
                (this.sync = !0),
                (this.needReadable = !1),
                (this.emittedReadable = !1),
                (this.readableListening = !1),
                (this.resumeScheduled = !1),
                (this.paused = !0),
                (this.emitClose = !1 !== e.emitClose),
                (this.autoDestroy = !!e.autoDestroy),
                (this.destroyed = !1),
                (this.defaultEncoding = e.defaultEncoding || "utf8"),
                (this.awaitDrain = 0),
                (this.readingMore = !1),
                (this.decoder = null),
                (this.encoding = null),
                e.encoding &&
                  (c || (c = t("string_decoder/").StringDecoder),
                  (this.decoder = new c(e.encoding)),
                  (this.encoding = e.encoding));
            }
            function A(e) {
              if (((n = n || t("./_stream_duplex")), !(this instanceof A)))
                return new A(e);
              var r = this instanceof n;
              (this._readableState = new E(e, this, r)),
                (this.readable = !0),
                e &&
                  ("function" == typeof e.read && (this._read = e.read),
                  "function" == typeof e.destroy &&
                    (this._destroy = e.destroy)),
                s.call(this);
            }
            function k(t, e, r, i, n) {
              h("readableAddChunk", e);
              var o,
                s = t._readableState;
              if (null === e)
                (s.reading = !1),
                  (function (t, e) {
                    if ((h("onEofChunk"), e.ended)) return;
                    if (e.decoder) {
                      var r = e.decoder.end();
                      r &&
                        r.length &&
                        (e.buffer.push(r),
                        (e.length += e.objectMode ? 1 : r.length));
                    }
                    (e.ended = !0),
                      e.sync
                        ? R(t)
                        : ((e.needReadable = !1),
                          e.emittedReadable ||
                            ((e.emittedReadable = !0), j(t)));
                  })(t, s);
              else if (
                (n ||
                  (o = (function (t, e) {
                    var r;
                    (i = e),
                      a.isBuffer(i) ||
                        i instanceof f ||
                        "string" == typeof e ||
                        void 0 === e ||
                        t.objectMode ||
                        (r = new g(
                          "chunk",
                          ["string", "Buffer", "Uint8Array"],
                          e
                        ));
                    var i;
                    return r;
                  })(s, e)),
                o)
              )
                M(t, o);
              else if (s.objectMode || (e && e.length > 0))
                if (
                  ("string" == typeof e ||
                    s.objectMode ||
                    Object.getPrototypeOf(e) === a.prototype ||
                    (e = (function (t) {
                      return a.from(t);
                    })(e)),
                  i)
                )
                  s.endEmitted ? M(t, new _()) : B(t, s, e, !0);
                else if (s.ended) M(t, new v());
                else {
                  if (s.destroyed) return !1;
                  (s.reading = !1),
                    s.decoder && !r
                      ? ((e = s.decoder.write(e)),
                        s.objectMode || 0 !== e.length
                          ? B(t, s, e, !1)
                          : T(t, s))
                      : B(t, s, e, !1);
                }
              else i || ((s.reading = !1), T(t, s));
              return !s.ended && (s.length < s.highWaterMark || 0 === s.length);
            }
            function B(t, e, r, i) {
              e.flowing && 0 === e.length && !e.sync
                ? ((e.awaitDrain = 0), t.emit("data", r))
                : ((e.length += e.objectMode ? 1 : r.length),
                  i ? e.buffer.unshift(r) : e.buffer.push(r),
                  e.needReadable && R(t)),
                T(t, e);
            }
            Object.defineProperty(A.prototype, "destroyed", {
              enumerable: !1,
              get: function () {
                return (
                  void 0 !== this._readableState &&
                  this._readableState.destroyed
                );
              },
              set: function (t) {
                this._readableState && (this._readableState.destroyed = t);
              },
            }),
              (A.prototype.destroy = b.destroy),
              (A.prototype._undestroy = b.undestroy),
              (A.prototype._destroy = function (t, e) {
                e(t);
              }),
              (A.prototype.push = function (t, e) {
                var r,
                  i = this._readableState;
                return (
                  i.objectMode
                    ? (r = !0)
                    : "string" == typeof t &&
                      ((e = e || i.defaultEncoding) !== i.encoding &&
                        ((t = a.from(t, e)), (e = "")),
                      (r = !0)),
                  k(this, t, e, !1, r)
                );
              }),
              (A.prototype.unshift = function (t) {
                return k(this, t, null, !0, !1);
              }),
              (A.prototype.isPaused = function () {
                return !1 === this._readableState.flowing;
              }),
              (A.prototype.setEncoding = function (e) {
                c || (c = t("string_decoder/").StringDecoder);
                var r = new c(e);
                (this._readableState.decoder = r),
                  (this._readableState.encoding =
                    this._readableState.decoder.encoding);
                for (
                  var i = this._readableState.buffer.head, n = "";
                  null !== i;

                )
                  (n += r.write(i.data)), (i = i.next);
                return (
                  this._readableState.buffer.clear(),
                  "" !== n && this._readableState.buffer.push(n),
                  (this._readableState.length = n.length),
                  this
                );
              });
            var x = 1073741824;
            function I(t, e) {
              return t <= 0 || (0 === e.length && e.ended)
                ? 0
                : e.objectMode
                ? 1
                : t != t
                ? e.flowing && e.length
                  ? e.buffer.head.data.length
                  : e.length
                : (t > e.highWaterMark &&
                    (e.highWaterMark = (function (t) {
                      return (
                        t >= x
                          ? (t = x)
                          : (t--,
                            (t |= t >>> 1),
                            (t |= t >>> 2),
                            (t |= t >>> 4),
                            (t |= t >>> 8),
                            (t |= t >>> 16),
                            t++),
                        t
                      );
                    })(t)),
                  t <= e.length
                    ? t
                    : e.ended
                    ? e.length
                    : ((e.needReadable = !0), 0));
            }
            function R(t) {
              var e = t._readableState;
              h("emitReadable", e.needReadable, e.emittedReadable),
                (e.needReadable = !1),
                e.emittedReadable ||
                  (h("emitReadable", e.flowing),
                  (e.emittedReadable = !0),
                  r.nextTick(j, t));
            }
            function j(t) {
              var e = t._readableState;
              h("emitReadable_", e.destroyed, e.length, e.ended),
                e.destroyed ||
                  (!e.length && !e.ended) ||
                  (t.emit("readable"), (e.emittedReadable = !1)),
                (e.needReadable =
                  !e.flowing && !e.ended && e.length <= e.highWaterMark),
                U(t);
            }
            function T(t, e) {
              e.readingMore || ((e.readingMore = !0), r.nextTick(L, t, e));
            }
            function L(t, e) {
              for (
                ;
                !e.reading &&
                !e.ended &&
                (e.length < e.highWaterMark || (e.flowing && 0 === e.length));

              ) {
                var r = e.length;
                if ((h("maybeReadMore read 0"), t.read(0), r === e.length))
                  break;
              }
              e.readingMore = !1;
            }
            function C(t) {
              var e = t._readableState;
              (e.readableListening = t.listenerCount("readable") > 0),
                e.resumeScheduled && !e.paused
                  ? (e.flowing = !0)
                  : t.listenerCount("data") > 0 && t.resume();
            }
            function P(t) {
              h("readable nexttick read 0"), t.read(0);
            }
            function O(t, e) {
              h("resume", e.reading),
                e.reading || t.read(0),
                (e.resumeScheduled = !1),
                t.emit("resume"),
                U(t),
                e.flowing && !e.reading && t.read(0);
            }
            function U(t) {
              var e = t._readableState;
              for (h("flow", e.flowing); e.flowing && null !== t.read(); );
            }
            function D(t, e) {
              return 0 === e.length
                ? null
                : (e.objectMode
                    ? (r = e.buffer.shift())
                    : !t || t >= e.length
                    ? ((r = e.decoder
                        ? e.buffer.join("")
                        : 1 === e.buffer.length
                        ? e.buffer.first()
                        : e.buffer.concat(e.length)),
                      e.buffer.clear())
                    : (r = e.buffer.consume(t, e.decoder)),
                  r);
              var r;
            }
            function N(t) {
              var e = t._readableState;
              h("endReadable", e.endEmitted),
                e.endEmitted || ((e.ended = !0), r.nextTick(q, e, t));
            }
            function q(t, e) {
              if (
                (h("endReadableNT", t.endEmitted, t.length),
                !t.endEmitted &&
                  0 === t.length &&
                  ((t.endEmitted = !0),
                  (e.readable = !1),
                  e.emit("end"),
                  t.autoDestroy))
              ) {
                var r = e._writableState;
                (!r || (r.autoDestroy && r.finished)) && e.destroy();
              }
            }
            function z(t, e) {
              for (var r = 0, i = t.length; r < i; r++)
                if (t[r] === e) return r;
              return -1;
            }
            (A.prototype.read = function (t) {
              h("read", t), (t = parseInt(t, 10));
              var e = this._readableState,
                r = t;
              if (
                (0 !== t && (e.emittedReadable = !1),
                0 === t &&
                  e.needReadable &&
                  ((0 !== e.highWaterMark
                    ? e.length >= e.highWaterMark
                    : e.length > 0) ||
                    e.ended))
              )
                return (
                  h("read: emitReadable", e.length, e.ended),
                  0 === e.length && e.ended ? N(this) : R(this),
                  null
                );
              if (0 === (t = I(t, e)) && e.ended)
                return 0 === e.length && N(this), null;
              var i,
                n = e.needReadable;
              return (
                h("need readable", n),
                (0 === e.length || e.length - t < e.highWaterMark) &&
                  h("length less than watermark", (n = !0)),
                e.ended || e.reading
                  ? h("reading or ended", (n = !1))
                  : n &&
                    (h("do read"),
                    (e.reading = !0),
                    (e.sync = !0),
                    0 === e.length && (e.needReadable = !0),
                    this._read(e.highWaterMark),
                    (e.sync = !1),
                    e.reading || (t = I(r, e))),
                null === (i = t > 0 ? D(t, e) : null)
                  ? ((e.needReadable = e.length <= e.highWaterMark), (t = 0))
                  : ((e.length -= t), (e.awaitDrain = 0)),
                0 === e.length &&
                  (e.ended || (e.needReadable = !0),
                  r !== t && e.ended && N(this)),
                null !== i && this.emit("data", i),
                i
              );
            }),
              (A.prototype._read = function (t) {
                M(this, new w("_read()"));
              }),
              (A.prototype.pipe = function (t, e) {
                var i = this,
                  n = this._readableState;
                switch (n.pipesCount) {
                  case 0:
                    n.pipes = t;
                    break;
                  case 1:
                    n.pipes = [n.pipes, t];
                    break;
                  default:
                    n.pipes.push(t);
                }
                (n.pipesCount += 1),
                  h("pipe count=%d opts=%j", n.pipesCount, e);
                var s =
                  (!e || !1 !== e.end) && t !== r.stdout && t !== r.stderr
                    ? f
                    : m;
                function a(e, r) {
                  h("onunpipe"),
                    e === i &&
                      r &&
                      !1 === r.hasUnpiped &&
                      ((r.hasUnpiped = !0),
                      h("cleanup"),
                      t.removeListener("close", p),
                      t.removeListener("finish", b),
                      t.removeListener("drain", u),
                      t.removeListener("error", l),
                      t.removeListener("unpipe", a),
                      i.removeListener("end", f),
                      i.removeListener("end", m),
                      i.removeListener("data", d),
                      (c = !0),
                      !n.awaitDrain ||
                        (t._writableState && !t._writableState.needDrain) ||
                        u());
                }
                function f() {
                  h("onend"), t.end();
                }
                n.endEmitted ? r.nextTick(s) : i.once("end", s),
                  t.on("unpipe", a);
                var u = (function (t) {
                  return function () {
                    var e = t._readableState;
                    h("pipeOnDrain", e.awaitDrain),
                      e.awaitDrain && e.awaitDrain--,
                      0 === e.awaitDrain &&
                        o(t, "data") &&
                        ((e.flowing = !0), U(t));
                  };
                })(i);
                t.on("drain", u);
                var c = !1;
                function d(e) {
                  h("ondata");
                  var r = t.write(e);
                  h("dest.write", r),
                    !1 === r &&
                      (((1 === n.pipesCount && n.pipes === t) ||
                        (n.pipesCount > 1 && -1 !== z(n.pipes, t))) &&
                        !c &&
                        (h("false write response, pause", n.awaitDrain),
                        n.awaitDrain++),
                      i.pause());
                }
                function l(e) {
                  h("onerror", e),
                    m(),
                    t.removeListener("error", l),
                    0 === o(t, "error") && M(t, e);
                }
                function p() {
                  t.removeListener("finish", b), m();
                }
                function b() {
                  h("onfinish"), t.removeListener("close", p), m();
                }
                function m() {
                  h("unpipe"), i.unpipe(t);
                }
                return (
                  i.on("data", d),
                  (function (t, e, r) {
                    if ("function" == typeof t.prependListener)
                      return t.prependListener(e, r);
                    t._events && t._events[e]
                      ? Array.isArray(t._events[e])
                        ? t._events[e].unshift(r)
                        : (t._events[e] = [r, t._events[e]])
                      : t.on(e, r);
                  })(t, "error", l),
                  t.once("close", p),
                  t.once("finish", b),
                  t.emit("pipe", i),
                  n.flowing || (h("pipe resume"), i.resume()),
                  t
                );
              }),
              (A.prototype.unpipe = function (t) {
                var e = this._readableState,
                  r = { hasUnpiped: !1 };
                if (0 === e.pipesCount) return this;
                if (1 === e.pipesCount)
                  return (
                    (t && t !== e.pipes) ||
                      (t || (t = e.pipes),
                      (e.pipes = null),
                      (e.pipesCount = 0),
                      (e.flowing = !1),
                      t && t.emit("unpipe", this, r)),
                    this
                  );
                if (!t) {
                  var i = e.pipes,
                    n = e.pipesCount;
                  (e.pipes = null), (e.pipesCount = 0), (e.flowing = !1);
                  for (var o = 0; o < n; o++)
                    i[o].emit("unpipe", this, { hasUnpiped: !1 });
                  return this;
                }
                var s = z(e.pipes, t);
                return (
                  -1 === s ||
                    (e.pipes.splice(s, 1),
                    (e.pipesCount -= 1),
                    1 === e.pipesCount && (e.pipes = e.pipes[0]),
                    t.emit("unpipe", this, r)),
                  this
                );
              }),
              (A.prototype.on = function (t, e) {
                var i = s.prototype.on.call(this, t, e),
                  n = this._readableState;
                return (
                  "data" === t
                    ? ((n.readableListening =
                        this.listenerCount("readable") > 0),
                      !1 !== n.flowing && this.resume())
                    : "readable" === t &&
                      (n.endEmitted ||
                        n.readableListening ||
                        ((n.readableListening = n.needReadable = !0),
                        (n.flowing = !1),
                        (n.emittedReadable = !1),
                        h("on readable", n.length, n.reading),
                        n.length ? R(this) : n.reading || r.nextTick(P, this))),
                  i
                );
              }),
              (A.prototype.addListener = A.prototype.on),
              (A.prototype.removeListener = function (t, e) {
                var i = s.prototype.removeListener.call(this, t, e);
                return "readable" === t && r.nextTick(C, this), i;
              }),
              (A.prototype.removeAllListeners = function (t) {
                var e = s.prototype.removeAllListeners.apply(this, arguments);
                return (
                  ("readable" !== t && void 0 !== t) || r.nextTick(C, this), e
                );
              }),
              (A.prototype.resume = function () {
                var t = this._readableState;
                return (
                  t.flowing ||
                    (h("resume"),
                    (t.flowing = !t.readableListening),
                    (function (t, e) {
                      e.resumeScheduled ||
                        ((e.resumeScheduled = !0), r.nextTick(O, t, e));
                    })(this, t)),
                  (t.paused = !1),
                  this
                );
              }),
              (A.prototype.pause = function () {
                return (
                  h("call pause flowing=%j", this._readableState.flowing),
                  !1 !== this._readableState.flowing &&
                    (h("pause"),
                    (this._readableState.flowing = !1),
                    this.emit("pause")),
                  (this._readableState.paused = !0),
                  this
                );
              }),
              (A.prototype.wrap = function (t) {
                var e = this,
                  r = this._readableState,
                  i = !1;
                for (var n in (t.on("end", function () {
                  if ((h("wrapped end"), r.decoder && !r.ended)) {
                    var t = r.decoder.end();
                    t && t.length && e.push(t);
                  }
                  e.push(null);
                }),
                t.on("data", function (n) {
                  (h("wrapped data"),
                  r.decoder && (n = r.decoder.write(n)),
                  r.objectMode && null == n) ||
                    ((r.objectMode || (n && n.length)) &&
                      (e.push(n) || ((i = !0), t.pause())));
                }),
                t))
                  void 0 === this[n] &&
                    "function" == typeof t[n] &&
                    (this[n] = (function (e) {
                      return function () {
                        return t[e].apply(t, arguments);
                      };
                    })(n));
                for (var o = 0; o < S.length; o++)
                  t.on(S[o], this.emit.bind(this, S[o]));
                return (
                  (this._read = function (e) {
                    h("wrapped _read", e), i && ((i = !1), t.resume());
                  }),
                  this
                );
              }),
              "function" == typeof Symbol &&
                (A.prototype[Symbol.asyncIterator] = function () {
                  return (
                    void 0 === d &&
                      (d = t("./internal/streams/async_iterator")),
                    d(this)
                  );
                }),
              Object.defineProperty(A.prototype, "readableHighWaterMark", {
                enumerable: !1,
                get: function () {
                  return this._readableState.highWaterMark;
                },
              }),
              Object.defineProperty(A.prototype, "readableBuffer", {
                enumerable: !1,
                get: function () {
                  return this._readableState && this._readableState.buffer;
                },
              }),
              Object.defineProperty(A.prototype, "readableFlowing", {
                enumerable: !1,
                get: function () {
                  return this._readableState.flowing;
                },
                set: function (t) {
                  this._readableState && (this._readableState.flowing = t);
                },
              }),
              (A._fromList = D),
              Object.defineProperty(A.prototype, "readableLength", {
                enumerable: !1,
                get: function () {
                  return this._readableState.length;
                },
              }),
              "function" == typeof Symbol &&
                (A.from = function (e, r) {
                  return (
                    void 0 === l && (l = t("./internal/streams/from")),
                    l(A, e, r)
                  );
                });
          }).call(this);
        }).call(
          this,
          t("_process"),
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        );
      },
      {
        "../errors": 47,
        "./_stream_duplex": 48,
        "./internal/streams/async_iterator": 53,
        "./internal/streams/buffer_list": 54,
        "./internal/streams/destroy": 55,
        "./internal/streams/from": 57,
        "./internal/streams/state": 59,
        "./internal/streams/stream": 60,
        _process: 149,
        buffer: 63,
        events: 100,
        inherits: 132,
        "string_decoder/": 185,
        util: 19,
      },
    ],
    51: [
      function (t, e, r) {
        "use strict";
        e.exports = u;
        var i = t("../errors").codes,
          n = i.ERR_METHOD_NOT_IMPLEMENTED,
          o = i.ERR_MULTIPLE_CALLBACK,
          s = i.ERR_TRANSFORM_ALREADY_TRANSFORMING,
          a = i.ERR_TRANSFORM_WITH_LENGTH_0,
          f = t("./_stream_duplex");
        function h(t, e) {
          var r = this._transformState;
          r.transforming = !1;
          var i = r.writecb;
          if (null === i) return this.emit("error", new o());
          (r.writechunk = null),
            (r.writecb = null),
            null != e && this.push(e),
            i(t);
          var n = this._readableState;
          (n.reading = !1),
            (n.needReadable || n.length < n.highWaterMark) &&
              this._read(n.highWaterMark);
        }
        function u(t) {
          if (!(this instanceof u)) return new u(t);
          f.call(this, t),
            (this._transformState = {
              afterTransform: h.bind(this),
              needTransform: !1,
              transforming: !1,
              writecb: null,
              writechunk: null,
              writeencoding: null,
            }),
            (this._readableState.needReadable = !0),
            (this._readableState.sync = !1),
            t &&
              ("function" == typeof t.transform &&
                (this._transform = t.transform),
              "function" == typeof t.flush && (this._flush = t.flush)),
            this.on("prefinish", c);
        }
        function c() {
          var t = this;
          "function" != typeof this._flush || this._readableState.destroyed
            ? d(this, null, null)
            : this._flush(function (e, r) {
                d(t, e, r);
              });
        }
        function d(t, e, r) {
          if (e) return t.emit("error", e);
          if ((null != r && t.push(r), t._writableState.length)) throw new a();
          if (t._transformState.transforming) throw new s();
          return t.push(null);
        }
        t("inherits")(u, f),
          (u.prototype.push = function (t, e) {
            return (
              (this._transformState.needTransform = !1),
              f.prototype.push.call(this, t, e)
            );
          }),
          (u.prototype._transform = function (t, e, r) {
            r(new n("_transform()"));
          }),
          (u.prototype._write = function (t, e, r) {
            var i = this._transformState;
            if (
              ((i.writecb = r),
              (i.writechunk = t),
              (i.writeencoding = e),
              !i.transforming)
            ) {
              var n = this._readableState;
              (i.needTransform ||
                n.needReadable ||
                n.length < n.highWaterMark) &&
                this._read(n.highWaterMark);
            }
          }),
          (u.prototype._read = function (t) {
            var e = this._transformState;
            null === e.writechunk || e.transforming
              ? (e.needTransform = !0)
              : ((e.transforming = !0),
                this._transform(
                  e.writechunk,
                  e.writeencoding,
                  e.afterTransform
                ));
          }),
          (u.prototype._destroy = function (t, e) {
            f.prototype._destroy.call(this, t, function (t) {
              e(t);
            });
          });
      },
      { "../errors": 47, "./_stream_duplex": 48, inherits: 132 },
    ],
    52: [
      function (t, e, r) {
        (function (r, i) {
          (function () {
            "use strict";
            function n(t) {
              var e = this;
              (this.next = null),
                (this.entry = null),
                (this.finish = function () {
                  !(function (t, e, r) {
                    var i = t.entry;
                    t.entry = null;
                    for (; i; ) {
                      var n = i.callback;
                      e.pendingcb--, n(r), (i = i.next);
                    }
                    e.corkedRequestsFree.next = t;
                  })(e, t);
                });
            }
            var o;
            (e.exports = A), (A.WritableState = E);
            var s = { deprecate: t("util-deprecate") },
              a = t("./internal/streams/stream"),
              f = t("buffer").Buffer,
              h = i.Uint8Array || function () {};
            var u,
              c = t("./internal/streams/destroy"),
              d = t("./internal/streams/state").getHighWaterMark,
              l = t("../errors").codes,
              p = l.ERR_INVALID_ARG_TYPE,
              b = l.ERR_METHOD_NOT_IMPLEMENTED,
              m = l.ERR_MULTIPLE_CALLBACK,
              y = l.ERR_STREAM_CANNOT_PIPE,
              g = l.ERR_STREAM_DESTROYED,
              v = l.ERR_STREAM_NULL_VALUES,
              w = l.ERR_STREAM_WRITE_AFTER_END,
              _ = l.ERR_UNKNOWN_ENCODING,
              M = c.errorOrDestroy;
            function S() {}
            function E(e, i, s) {
              (o = o || t("./_stream_duplex")),
                (e = e || {}),
                "boolean" != typeof s && (s = i instanceof o),
                (this.objectMode = !!e.objectMode),
                s &&
                  (this.objectMode = this.objectMode || !!e.writableObjectMode),
                (this.highWaterMark = d(this, e, "writableHighWaterMark", s)),
                (this.finalCalled = !1),
                (this.needDrain = !1),
                (this.ending = !1),
                (this.ended = !1),
                (this.finished = !1),
                (this.destroyed = !1);
              var a = !1 === e.decodeStrings;
              (this.decodeStrings = !a),
                (this.defaultEncoding = e.defaultEncoding || "utf8"),
                (this.length = 0),
                (this.writing = !1),
                (this.corked = 0),
                (this.sync = !0),
                (this.bufferProcessing = !1),
                (this.onwrite = function (t) {
                  !(function (t, e) {
                    var i = t._writableState,
                      n = i.sync,
                      o = i.writecb;
                    if ("function" != typeof o) throw new m();
                    if (
                      ((function (t) {
                        (t.writing = !1),
                          (t.writecb = null),
                          (t.length -= t.writelen),
                          (t.writelen = 0);
                      })(i),
                      e)
                    )
                      !(function (t, e, i, n, o) {
                        --e.pendingcb,
                          i
                            ? (r.nextTick(o, n),
                              r.nextTick(j, t, e),
                              (t._writableState.errorEmitted = !0),
                              M(t, n))
                            : (o(n),
                              (t._writableState.errorEmitted = !0),
                              M(t, n),
                              j(t, e));
                      })(t, i, n, e, o);
                    else {
                      var s = I(i) || t.destroyed;
                      s ||
                        i.corked ||
                        i.bufferProcessing ||
                        !i.bufferedRequest ||
                        x(t, i),
                        n ? r.nextTick(B, t, i, s, o) : B(t, i, s, o);
                    }
                  })(i, t);
                }),
                (this.writecb = null),
                (this.writelen = 0),
                (this.bufferedRequest = null),
                (this.lastBufferedRequest = null),
                (this.pendingcb = 0),
                (this.prefinished = !1),
                (this.errorEmitted = !1),
                (this.emitClose = !1 !== e.emitClose),
                (this.autoDestroy = !!e.autoDestroy),
                (this.bufferedRequestCount = 0),
                (this.corkedRequestsFree = new n(this));
            }
            function A(e) {
              var r = this instanceof (o = o || t("./_stream_duplex"));
              if (!r && !u.call(A, this)) return new A(e);
              (this._writableState = new E(e, this, r)),
                (this.writable = !0),
                e &&
                  ("function" == typeof e.write && (this._write = e.write),
                  "function" == typeof e.writev && (this._writev = e.writev),
                  "function" == typeof e.destroy && (this._destroy = e.destroy),
                  "function" == typeof e.final && (this._final = e.final)),
                a.call(this);
            }
            function k(t, e, r, i, n, o, s) {
              (e.writelen = i),
                (e.writecb = s),
                (e.writing = !0),
                (e.sync = !0),
                e.destroyed
                  ? e.onwrite(new g("write"))
                  : r
                  ? t._writev(n, e.onwrite)
                  : t._write(n, o, e.onwrite),
                (e.sync = !1);
            }
            function B(t, e, r, i) {
              r ||
                (function (t, e) {
                  0 === e.length &&
                    e.needDrain &&
                    ((e.needDrain = !1), t.emit("drain"));
                })(t, e),
                e.pendingcb--,
                i(),
                j(t, e);
            }
            function x(t, e) {
              e.bufferProcessing = !0;
              var r = e.bufferedRequest;
              if (t._writev && r && r.next) {
                var i = e.bufferedRequestCount,
                  o = new Array(i),
                  s = e.corkedRequestsFree;
                s.entry = r;
                for (var a = 0, f = !0; r; )
                  (o[a] = r), r.isBuf || (f = !1), (r = r.next), (a += 1);
                (o.allBuffers = f),
                  k(t, e, !0, e.length, o, "", s.finish),
                  e.pendingcb++,
                  (e.lastBufferedRequest = null),
                  s.next
                    ? ((e.corkedRequestsFree = s.next), (s.next = null))
                    : (e.corkedRequestsFree = new n(e)),
                  (e.bufferedRequestCount = 0);
              } else {
                for (; r; ) {
                  var h = r.chunk,
                    u = r.encoding,
                    c = r.callback;
                  if (
                    (k(t, e, !1, e.objectMode ? 1 : h.length, h, u, c),
                    (r = r.next),
                    e.bufferedRequestCount--,
                    e.writing)
                  )
                    break;
                }
                null === r && (e.lastBufferedRequest = null);
              }
              (e.bufferedRequest = r), (e.bufferProcessing = !1);
            }
            function I(t) {
              return (
                t.ending &&
                0 === t.length &&
                null === t.bufferedRequest &&
                !t.finished &&
                !t.writing
              );
            }
            function R(t, e) {
              t._final(function (r) {
                e.pendingcb--,
                  r && M(t, r),
                  (e.prefinished = !0),
                  t.emit("prefinish"),
                  j(t, e);
              });
            }
            function j(t, e) {
              var i = I(e);
              if (
                i &&
                ((function (t, e) {
                  e.prefinished ||
                    e.finalCalled ||
                    ("function" != typeof t._final || e.destroyed
                      ? ((e.prefinished = !0), t.emit("prefinish"))
                      : (e.pendingcb++,
                        (e.finalCalled = !0),
                        r.nextTick(R, t, e)));
                })(t, e),
                0 === e.pendingcb &&
                  ((e.finished = !0), t.emit("finish"), e.autoDestroy))
              ) {
                var n = t._readableState;
                (!n || (n.autoDestroy && n.endEmitted)) && t.destroy();
              }
              return i;
            }
            t("inherits")(A, a),
              (E.prototype.getBuffer = function () {
                for (var t = this.bufferedRequest, e = []; t; )
                  e.push(t), (t = t.next);
                return e;
              }),
              (function () {
                try {
                  Object.defineProperty(E.prototype, "buffer", {
                    get: s.deprecate(
                      function () {
                        return this.getBuffer();
                      },
                      "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.",
                      "DEP0003"
                    ),
                  });
                } catch (t) {}
              })(),
              "function" == typeof Symbol &&
              Symbol.hasInstance &&
              "function" == typeof Function.prototype[Symbol.hasInstance]
                ? ((u = Function.prototype[Symbol.hasInstance]),
                  Object.defineProperty(A, Symbol.hasInstance, {
                    value: function (t) {
                      return (
                        !!u.call(this, t) ||
                        (this === A && t && t._writableState instanceof E)
                      );
                    },
                  }))
                : (u = function (t) {
                    return t instanceof this;
                  }),
              (A.prototype.pipe = function () {
                M(this, new y());
              }),
              (A.prototype.write = function (t, e, i) {
                var n,
                  o = this._writableState,
                  s = !1,
                  a =
                    !o.objectMode && ((n = t), f.isBuffer(n) || n instanceof h);
                return (
                  a &&
                    !f.isBuffer(t) &&
                    (t = (function (t) {
                      return f.from(t);
                    })(t)),
                  "function" == typeof e && ((i = e), (e = null)),
                  a ? (e = "buffer") : e || (e = o.defaultEncoding),
                  "function" != typeof i && (i = S),
                  o.ending
                    ? (function (t, e) {
                        var i = new w();
                        M(t, i), r.nextTick(e, i);
                      })(this, i)
                    : (a ||
                        (function (t, e, i, n) {
                          var o;
                          return (
                            null === i
                              ? (o = new v())
                              : "string" == typeof i ||
                                e.objectMode ||
                                (o = new p("chunk", ["string", "Buffer"], i)),
                            !o || (M(t, o), r.nextTick(n, o), !1)
                          );
                        })(this, o, t, i)) &&
                      (o.pendingcb++,
                      (s = (function (t, e, r, i, n, o) {
                        if (!r) {
                          var s = (function (t, e, r) {
                            t.objectMode ||
                              !1 === t.decodeStrings ||
                              "string" != typeof e ||
                              (e = f.from(e, r));
                            return e;
                          })(e, i, n);
                          i !== s && ((r = !0), (n = "buffer"), (i = s));
                        }
                        var a = e.objectMode ? 1 : i.length;
                        e.length += a;
                        var h = e.length < e.highWaterMark;
                        h || (e.needDrain = !0);
                        if (e.writing || e.corked) {
                          var u = e.lastBufferedRequest;
                          (e.lastBufferedRequest = {
                            chunk: i,
                            encoding: n,
                            isBuf: r,
                            callback: o,
                            next: null,
                          }),
                            u
                              ? (u.next = e.lastBufferedRequest)
                              : (e.bufferedRequest = e.lastBufferedRequest),
                            (e.bufferedRequestCount += 1);
                        } else k(t, e, !1, a, i, n, o);
                        return h;
                      })(this, o, a, t, e, i))),
                  s
                );
              }),
              (A.prototype.cork = function () {
                this._writableState.corked++;
              }),
              (A.prototype.uncork = function () {
                var t = this._writableState;
                t.corked &&
                  (t.corked--,
                  t.writing ||
                    t.corked ||
                    t.bufferProcessing ||
                    !t.bufferedRequest ||
                    x(this, t));
              }),
              (A.prototype.setDefaultEncoding = function (t) {
                if (
                  ("string" == typeof t && (t = t.toLowerCase()),
                  !(
                    [
                      "hex",
                      "utf8",
                      "utf-8",
                      "ascii",
                      "binary",
                      "base64",
                      "ucs2",
                      "ucs-2",
                      "utf16le",
                      "utf-16le",
                      "raw",
                    ].indexOf((t + "").toLowerCase()) > -1
                  ))
                )
                  throw new _(t);
                return (this._writableState.defaultEncoding = t), this;
              }),
              Object.defineProperty(A.prototype, "writableBuffer", {
                enumerable: !1,
                get: function () {
                  return this._writableState && this._writableState.getBuffer();
                },
              }),
              Object.defineProperty(A.prototype, "writableHighWaterMark", {
                enumerable: !1,
                get: function () {
                  return this._writableState.highWaterMark;
                },
              }),
              (A.prototype._write = function (t, e, r) {
                r(new b("_write()"));
              }),
              (A.prototype._writev = null),
              (A.prototype.end = function (t, e, i) {
                var n = this._writableState;
                return (
                  "function" == typeof t
                    ? ((i = t), (t = null), (e = null))
                    : "function" == typeof e && ((i = e), (e = null)),
                  null != t && this.write(t, e),
                  n.corked && ((n.corked = 1), this.uncork()),
                  n.ending ||
                    (function (t, e, i) {
                      (e.ending = !0),
                        j(t, e),
                        i && (e.finished ? r.nextTick(i) : t.once("finish", i));
                      (e.ended = !0), (t.writable = !1);
                    })(this, n, i),
                  this
                );
              }),
              Object.defineProperty(A.prototype, "writableLength", {
                enumerable: !1,
                get: function () {
                  return this._writableState.length;
                },
              }),
              Object.defineProperty(A.prototype, "destroyed", {
                enumerable: !1,
                get: function () {
                  return (
                    void 0 !== this._writableState &&
                    this._writableState.destroyed
                  );
                },
                set: function (t) {
                  this._writableState && (this._writableState.destroyed = t);
                },
              }),
              (A.prototype.destroy = c.destroy),
              (A.prototype._undestroy = c.undestroy),
              (A.prototype._destroy = function (t, e) {
                e(t);
              });
          }).call(this);
        }).call(
          this,
          t("_process"),
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        );
      },
      {
        "../errors": 47,
        "./_stream_duplex": 48,
        "./internal/streams/destroy": 55,
        "./internal/streams/state": 59,
        "./internal/streams/stream": 60,
        _process: 149,
        buffer: 63,
        inherits: 132,
        "util-deprecate": 186,
      },
    ],
    53: [
      function (t, e, r) {
        (function (r) {
          (function () {
            "use strict";
            var i;
            function n(t, e, r) {
              return (
                e in t
                  ? Object.defineProperty(t, e, {
                      value: r,
                      enumerable: !0,
                      configurable: !0,
                      writable: !0,
                    })
                  : (t[e] = r),
                t
              );
            }
            var o = t("./end-of-stream"),
              s = Symbol("lastResolve"),
              a = Symbol("lastReject"),
              f = Symbol("error"),
              h = Symbol("ended"),
              u = Symbol("lastPromise"),
              c = Symbol("handlePromise"),
              d = Symbol("stream");
            function l(t, e) {
              return { value: t, done: e };
            }
            function p(t) {
              var e = t[s];
              if (null !== e) {
                var r = t[d].read();
                null !== r &&
                  ((t[u] = null), (t[s] = null), (t[a] = null), e(l(r, !1)));
              }
            }
            function b(t) {
              r.nextTick(p, t);
            }
            var m = Object.getPrototypeOf(function () {}),
              y = Object.setPrototypeOf(
                (n(
                  (i = {
                    get stream() {
                      return this[d];
                    },
                    next: function () {
                      var t = this,
                        e = this[f];
                      if (null !== e) return Promise.reject(e);
                      if (this[h]) return Promise.resolve(l(void 0, !0));
                      if (this[d].destroyed)
                        return new Promise(function (e, i) {
                          r.nextTick(function () {
                            t[f] ? i(t[f]) : e(l(void 0, !0));
                          });
                        });
                      var i,
                        n = this[u];
                      if (n)
                        i = new Promise(
                          (function (t, e) {
                            return function (r, i) {
                              t.then(function () {
                                e[h] ? r(l(void 0, !0)) : e[c](r, i);
                              }, i);
                            };
                          })(n, this)
                        );
                      else {
                        var o = this[d].read();
                        if (null !== o) return Promise.resolve(l(o, !1));
                        i = new Promise(this[c]);
                      }
                      return (this[u] = i), i;
                    },
                  }),
                  Symbol.asyncIterator,
                  function () {
                    return this;
                  }
                ),
                n(i, "return", function () {
                  var t = this;
                  return new Promise(function (e, r) {
                    t[d].destroy(null, function (t) {
                      t ? r(t) : e(l(void 0, !0));
                    });
                  });
                }),
                i),
                m
              );
            e.exports = function (t) {
              var e,
                r = Object.create(
                  y,
                  (n((e = {}), d, { value: t, writable: !0 }),
                  n(e, s, { value: null, writable: !0 }),
                  n(e, a, { value: null, writable: !0 }),
                  n(e, f, { value: null, writable: !0 }),
                  n(e, h, { value: t._readableState.endEmitted, writable: !0 }),
                  n(e, c, {
                    value: function (t, e) {
                      var i = r[d].read();
                      i
                        ? ((r[u] = null),
                          (r[s] = null),
                          (r[a] = null),
                          t(l(i, !1)))
                        : ((r[s] = t), (r[a] = e));
                    },
                    writable: !0,
                  }),
                  e)
                );
              return (
                (r[u] = null),
                o(t, function (t) {
                  if (t && "ERR_STREAM_PREMATURE_CLOSE" !== t.code) {
                    var e = r[a];
                    return (
                      null !== e &&
                        ((r[u] = null), (r[s] = null), (r[a] = null), e(t)),
                      void (r[f] = t)
                    );
                  }
                  var i = r[s];
                  null !== i &&
                    ((r[u] = null),
                    (r[s] = null),
                    (r[a] = null),
                    i(l(void 0, !0))),
                    (r[h] = !0);
                }),
                t.on("readable", b.bind(null, r)),
                r
              );
            };
          }).call(this);
        }).call(this, t("_process"));
      },
      { "./end-of-stream": 56, _process: 149 },
    ],
    54: [
      function (t, e, r) {
        "use strict";
        function i(t, e) {
          var r = Object.keys(t);
          if (Object.getOwnPropertySymbols) {
            var i = Object.getOwnPropertySymbols(t);
            e &&
              (i = i.filter(function (e) {
                return Object.getOwnPropertyDescriptor(t, e).enumerable;
              })),
              r.push.apply(r, i);
          }
          return r;
        }
        function n(t, e, r) {
          return (
            e in t
              ? Object.defineProperty(t, e, {
                  value: r,
                  enumerable: !0,
                  configurable: !0,
                  writable: !0,
                })
              : (t[e] = r),
            t
          );
        }
        function o(t, e) {
          for (var r = 0; r < e.length; r++) {
            var i = e[r];
            (i.enumerable = i.enumerable || !1),
              (i.configurable = !0),
              "value" in i && (i.writable = !0),
              Object.defineProperty(t, i.key, i);
          }
        }
        var s = t("buffer").Buffer,
          a = t("util").inspect,
          f = (a && a.custom) || "inspect";
        e.exports = (function () {
          function t() {
            !(function (t, e) {
              if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function");
            })(this, t),
              (this.head = null),
              (this.tail = null),
              (this.length = 0);
          }
          var e, r, h;
          return (
            (e = t),
            (r = [
              {
                key: "push",
                value: function (t) {
                  var e = { data: t, next: null };
                  this.length > 0 ? (this.tail.next = e) : (this.head = e),
                    (this.tail = e),
                    ++this.length;
                },
              },
              {
                key: "unshift",
                value: function (t) {
                  var e = { data: t, next: this.head };
                  0 === this.length && (this.tail = e),
                    (this.head = e),
                    ++this.length;
                },
              },
              {
                key: "shift",
                value: function () {
                  if (0 !== this.length) {
                    var t = this.head.data;
                    return (
                      1 === this.length
                        ? (this.head = this.tail = null)
                        : (this.head = this.head.next),
                      --this.length,
                      t
                    );
                  }
                },
              },
              {
                key: "clear",
                value: function () {
                  (this.head = this.tail = null), (this.length = 0);
                },
              },
              {
                key: "join",
                value: function (t) {
                  if (0 === this.length) return "";
                  for (var e = this.head, r = "" + e.data; (e = e.next); )
                    r += t + e.data;
                  return r;
                },
              },
              {
                key: "concat",
                value: function (t) {
                  if (0 === this.length) return s.alloc(0);
                  for (
                    var e,
                      r,
                      i,
                      n = s.allocUnsafe(t >>> 0),
                      o = this.head,
                      a = 0;
                    o;

                  )
                    (e = o.data),
                      (r = n),
                      (i = a),
                      s.prototype.copy.call(e, r, i),
                      (a += o.data.length),
                      (o = o.next);
                  return n;
                },
              },
              {
                key: "consume",
                value: function (t, e) {
                  var r;
                  return (
                    t < this.head.data.length
                      ? ((r = this.head.data.slice(0, t)),
                        (this.head.data = this.head.data.slice(t)))
                      : (r =
                          t === this.head.data.length
                            ? this.shift()
                            : e
                            ? this._getString(t)
                            : this._getBuffer(t)),
                    r
                  );
                },
              },
              {
                key: "first",
                value: function () {
                  return this.head.data;
                },
              },
              {
                key: "_getString",
                value: function (t) {
                  var e = this.head,
                    r = 1,
                    i = e.data;
                  for (t -= i.length; (e = e.next); ) {
                    var n = e.data,
                      o = t > n.length ? n.length : t;
                    if (
                      (o === n.length ? (i += n) : (i += n.slice(0, t)),
                      0 == (t -= o))
                    ) {
                      o === n.length
                        ? (++r,
                          e.next
                            ? (this.head = e.next)
                            : (this.head = this.tail = null))
                        : ((this.head = e), (e.data = n.slice(o)));
                      break;
                    }
                    ++r;
                  }
                  return (this.length -= r), i;
                },
              },
              {
                key: "_getBuffer",
                value: function (t) {
                  var e = s.allocUnsafe(t),
                    r = this.head,
                    i = 1;
                  for (r.data.copy(e), t -= r.data.length; (r = r.next); ) {
                    var n = r.data,
                      o = t > n.length ? n.length : t;
                    if ((n.copy(e, e.length - t, 0, o), 0 == (t -= o))) {
                      o === n.length
                        ? (++i,
                          r.next
                            ? (this.head = r.next)
                            : (this.head = this.tail = null))
                        : ((this.head = r), (r.data = n.slice(o)));
                      break;
                    }
                    ++i;
                  }
                  return (this.length -= i), e;
                },
              },
              {
                key: f,
                value: function (t, e) {
                  return a(
                    this,
                    (function (t) {
                      for (var e = 1; e < arguments.length; e++) {
                        var r = null != arguments[e] ? arguments[e] : {};
                        e % 2
                          ? i(Object(r), !0).forEach(function (e) {
                              n(t, e, r[e]);
                            })
                          : Object.getOwnPropertyDescriptors
                          ? Object.defineProperties(
                              t,
                              Object.getOwnPropertyDescriptors(r)
                            )
                          : i(Object(r)).forEach(function (e) {
                              Object.defineProperty(
                                t,
                                e,
                                Object.getOwnPropertyDescriptor(r, e)
                              );
                            });
                      }
                      return t;
                    })({}, e, { depth: 0, customInspect: !1 })
                  );
                },
              },
            ]),
            r && o(e.prototype, r),
            h && o(e, h),
            t
          );
        })();
      },
      { buffer: 63, util: 19 },
    ],
    55: [
      function (t, e, r) {
        (function (t) {
          (function () {
            "use strict";
            function r(t, e) {
              n(t, e), i(t);
            }
            function i(t) {
              (t._writableState && !t._writableState.emitClose) ||
                (t._readableState && !t._readableState.emitClose) ||
                t.emit("close");
            }
            function n(t, e) {
              t.emit("error", e);
            }
            e.exports = {
              destroy: function (e, o) {
                var s = this,
                  a = this._readableState && this._readableState.destroyed,
                  f = this._writableState && this._writableState.destroyed;
                return a || f
                  ? (o
                      ? o(e)
                      : e &&
                        (this._writableState
                          ? this._writableState.errorEmitted ||
                            ((this._writableState.errorEmitted = !0),
                            t.nextTick(n, this, e))
                          : t.nextTick(n, this, e)),
                    this)
                  : (this._readableState &&
                      (this._readableState.destroyed = !0),
                    this._writableState && (this._writableState.destroyed = !0),
                    this._destroy(e || null, function (e) {
                      !o && e
                        ? s._writableState
                          ? s._writableState.errorEmitted
                            ? t.nextTick(i, s)
                            : ((s._writableState.errorEmitted = !0),
                              t.nextTick(r, s, e))
                          : t.nextTick(r, s, e)
                        : o
                        ? (t.nextTick(i, s), o(e))
                        : t.nextTick(i, s);
                    }),
                    this);
              },
              undestroy: function () {
                this._readableState &&
                  ((this._readableState.destroyed = !1),
                  (this._readableState.reading = !1),
                  (this._readableState.ended = !1),
                  (this._readableState.endEmitted = !1)),
                  this._writableState &&
                    ((this._writableState.destroyed = !1),
                    (this._writableState.ended = !1),
                    (this._writableState.ending = !1),
                    (this._writableState.finalCalled = !1),
                    (this._writableState.prefinished = !1),
                    (this._writableState.finished = !1),
                    (this._writableState.errorEmitted = !1));
              },
              errorOrDestroy: function (t, e) {
                var r = t._readableState,
                  i = t._writableState;
                (r && r.autoDestroy) || (i && i.autoDestroy)
                  ? t.destroy(e)
                  : t.emit("error", e);
              },
            };
          }).call(this);
        }).call(this, t("_process"));
      },
      { _process: 149 },
    ],
    56: [
      function (t, e, r) {
        "use strict";
        var i = t("../../../errors").codes.ERR_STREAM_PREMATURE_CLOSE;
        function n() {}
        e.exports = function t(e, r, o) {
          if ("function" == typeof r) return t(e, null, r);
          r || (r = {}),
            (o = (function (t) {
              var e = !1;
              return function () {
                if (!e) {
                  e = !0;
                  for (
                    var r = arguments.length, i = new Array(r), n = 0;
                    n < r;
                    n++
                  )
                    i[n] = arguments[n];
                  t.apply(this, i);
                }
              };
            })(o || n));
          var s = r.readable || (!1 !== r.readable && e.readable),
            a = r.writable || (!1 !== r.writable && e.writable),
            f = function () {
              e.writable || u();
            },
            h = e._writableState && e._writableState.finished,
            u = function () {
              (a = !1), (h = !0), s || o.call(e);
            },
            c = e._readableState && e._readableState.endEmitted,
            d = function () {
              (s = !1), (c = !0), a || o.call(e);
            },
            l = function (t) {
              o.call(e, t);
            },
            p = function () {
              var t;
              return s && !c
                ? ((e._readableState && e._readableState.ended) ||
                    (t = new i()),
                  o.call(e, t))
                : a && !h
                ? ((e._writableState && e._writableState.ended) ||
                    (t = new i()),
                  o.call(e, t))
                : void 0;
            },
            b = function () {
              e.req.on("finish", u);
            };
          return (
            !(function (t) {
              return t.setHeader && "function" == typeof t.abort;
            })(e)
              ? a && !e._writableState && (e.on("end", f), e.on("close", f))
              : (e.on("complete", u),
                e.on("abort", p),
                e.req ? b() : e.on("request", b)),
            e.on("end", d),
            e.on("finish", u),
            !1 !== r.error && e.on("error", l),
            e.on("close", p),
            function () {
              e.removeListener("complete", u),
                e.removeListener("abort", p),
                e.removeListener("request", b),
                e.req && e.req.removeListener("finish", u),
                e.removeListener("end", f),
                e.removeListener("close", f),
                e.removeListener("finish", u),
                e.removeListener("end", d),
                e.removeListener("error", l),
                e.removeListener("close", p);
            }
          );
        };
      },
      { "../../../errors": 47 },
    ],
    57: [
      function (t, e, r) {
        e.exports = function () {
          throw new Error("Readable.from is not available in the browser");
        };
      },
      {},
    ],
    58: [
      function (t, e, r) {
        "use strict";
        var i;
        var n = t("../../../errors").codes,
          o = n.ERR_MISSING_ARGS,
          s = n.ERR_STREAM_DESTROYED;
        function a(t) {
          if (t) throw t;
        }
        function f(t) {
          t();
        }
        function h(t, e) {
          return t.pipe(e);
        }
        e.exports = function () {
          for (var e = arguments.length, r = new Array(e), n = 0; n < e; n++)
            r[n] = arguments[n];
          var u,
            c = (function (t) {
              return t.length
                ? "function" != typeof t[t.length - 1]
                  ? a
                  : t.pop()
                : a;
            })(r);
          if ((Array.isArray(r[0]) && (r = r[0]), r.length < 2))
            throw new o("streams");
          var d = r.map(function (e, n) {
            var o = n < r.length - 1;
            return (function (e, r, n, o) {
              o = (function (t) {
                var e = !1;
                return function () {
                  e || ((e = !0), t.apply(void 0, arguments));
                };
              })(o);
              var a = !1;
              e.on("close", function () {
                a = !0;
              }),
                void 0 === i && (i = t("./end-of-stream")),
                i(e, { readable: r, writable: n }, function (t) {
                  if (t) return o(t);
                  (a = !0), o();
                });
              var f = !1;
              return function (t) {
                if (!a && !f)
                  return (
                    (f = !0),
                    (function (t) {
                      return t.setHeader && "function" == typeof t.abort;
                    })(e)
                      ? e.abort()
                      : "function" == typeof e.destroy
                      ? e.destroy()
                      : void o(t || new s("pipe"))
                  );
              };
            })(e, o, n > 0, function (t) {
              u || (u = t), t && d.forEach(f), o || (d.forEach(f), c(u));
            });
          });
          return r.reduce(h);
        };
      },
      { "../../../errors": 47, "./end-of-stream": 56 },
    ],
    59: [
      function (t, e, r) {
        "use strict";
        var i = t("../../../errors").codes.ERR_INVALID_OPT_VALUE;
        e.exports = {
          getHighWaterMark: function (t, e, r, n) {
            var o = (function (t, e, r) {
              return null != t.highWaterMark
                ? t.highWaterMark
                : e
                ? t[r]
                : null;
            })(e, n, r);
            if (null != o) {
              if (!isFinite(o) || Math.floor(o) !== o || o < 0)
                throw new i(n ? r : "highWaterMark", o);
              return Math.floor(o);
            }
            return t.objectMode ? 16 : 16384;
          },
        };
      },
      { "../../../errors": 47 },
    ],
    60: [
      function (t, e, r) {
        e.exports = t("events").EventEmitter;
      },
      { events: 100 },
    ],
    61: [
      function (t, e, r) {
        ((r = e.exports = t("./lib/_stream_readable.js")).Stream = r),
          (r.Readable = r),
          (r.Writable = t("./lib/_stream_writable.js")),
          (r.Duplex = t("./lib/_stream_duplex.js")),
          (r.Transform = t("./lib/_stream_transform.js")),
          (r.PassThrough = t("./lib/_stream_passthrough.js")),
          (r.finished = t("./lib/internal/streams/end-of-stream.js")),
          (r.pipeline = t("./lib/internal/streams/pipeline.js"));
      },
      {
        "./lib/_stream_duplex.js": 48,
        "./lib/_stream_passthrough.js": 49,
        "./lib/_stream_readable.js": 50,
        "./lib/_stream_transform.js": 51,
        "./lib/_stream_writable.js": 52,
        "./lib/internal/streams/end-of-stream.js": 56,
        "./lib/internal/streams/pipeline.js": 58,
      },
    ],
    62: [
      function (t, e, r) {
        (function (t) {
          (function () {
            e.exports = function (e, r) {
              for (
                var i = Math.min(e.length, r.length), n = new t(i), o = 0;
                o < i;
                ++o
              )
                n[o] = e[o] ^ r[o];
              return n;
            };
          }).call(this);
        }).call(this, t("buffer").Buffer);
      },
      { buffer: 63 },
    ],
    63: [
      function (t, e, r) {
        (function (e) {
          (function () {
            "use strict";
            var e = t("base64-js"),
              i = t("ieee754");
            (r.Buffer = s),
              (r.SlowBuffer = function (t) {
                +t != t && (t = 0);
                return s.alloc(+t);
              }),
              (r.INSPECT_MAX_BYTES = 50);
            var n = 2147483647;
            function o(t) {
              if (t > n)
                throw new RangeError(
                  'The value "' + t + '" is invalid for option "size"'
                );
              var e = new Uint8Array(t);
              return (e.__proto__ = s.prototype), e;
            }
            function s(t, e, r) {
              if ("number" == typeof t) {
                if ("string" == typeof e)
                  throw new TypeError(
                    'The "string" argument must be of type string. Received type number'
                  );
                return h(t);
              }
              return a(t, e, r);
            }
            function a(t, e, r) {
              if ("string" == typeof t)
                return (function (t, e) {
                  ("string" == typeof e && "" !== e) || (e = "utf8");
                  if (!s.isEncoding(e))
                    throw new TypeError("Unknown encoding: " + e);
                  var r = 0 | d(t, e),
                    i = o(r),
                    n = i.write(t, e);
                  n !== r && (i = i.slice(0, n));
                  return i;
                })(t, e);
              if (ArrayBuffer.isView(t)) return u(t);
              if (null == t)
                throw TypeError(
                  "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
                    typeof t
                );
              if (q(t, ArrayBuffer) || (t && q(t.buffer, ArrayBuffer)))
                return (function (t, e, r) {
                  if (e < 0 || t.byteLength < e)
                    throw new RangeError(
                      '"offset" is outside of buffer bounds'
                    );
                  if (t.byteLength < e + (r || 0))
                    throw new RangeError(
                      '"length" is outside of buffer bounds'
                    );
                  var i;
                  i =
                    void 0 === e && void 0 === r
                      ? new Uint8Array(t)
                      : void 0 === r
                      ? new Uint8Array(t, e)
                      : new Uint8Array(t, e, r);
                  return (i.__proto__ = s.prototype), i;
                })(t, e, r);
              if ("number" == typeof t)
                throw new TypeError(
                  'The "value" argument must not be of type number. Received type number'
                );
              var i = t.valueOf && t.valueOf();
              if (null != i && i !== t) return s.from(i, e, r);
              var n = (function (t) {
                if (s.isBuffer(t)) {
                  var e = 0 | c(t.length),
                    r = o(e);
                  return 0 === r.length || t.copy(r, 0, 0, e), r;
                }
                if (void 0 !== t.length)
                  return "number" != typeof t.length || z(t.length)
                    ? o(0)
                    : u(t);
                if ("Buffer" === t.type && Array.isArray(t.data))
                  return u(t.data);
              })(t);
              if (n) return n;
              if (
                "undefined" != typeof Symbol &&
                null != Symbol.toPrimitive &&
                "function" == typeof t[Symbol.toPrimitive]
              )
                return s.from(t[Symbol.toPrimitive]("string"), e, r);
              throw new TypeError(
                "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
                  typeof t
              );
            }
            function f(t) {
              if ("number" != typeof t)
                throw new TypeError('"size" argument must be of type number');
              if (t < 0)
                throw new RangeError(
                  'The value "' + t + '" is invalid for option "size"'
                );
            }
            function h(t) {
              return f(t), o(t < 0 ? 0 : 0 | c(t));
            }
            function u(t) {
              for (
                var e = t.length < 0 ? 0 : 0 | c(t.length), r = o(e), i = 0;
                i < e;
                i += 1
              )
                r[i] = 255 & t[i];
              return r;
            }
            function c(t) {
              if (t >= n)
                throw new RangeError(
                  "Attempt to allocate Buffer larger than maximum size: 0x" +
                    n.toString(16) +
                    " bytes"
                );
              return 0 | t;
            }
            function d(t, e) {
              if (s.isBuffer(t)) return t.length;
              if (ArrayBuffer.isView(t) || q(t, ArrayBuffer))
                return t.byteLength;
              if ("string" != typeof t)
                throw new TypeError(
                  'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' +
                    typeof t
                );
              var r = t.length,
                i = arguments.length > 2 && !0 === arguments[2];
              if (!i && 0 === r) return 0;
              for (var n = !1; ; )
                switch (e) {
                  case "ascii":
                  case "latin1":
                  case "binary":
                    return r;
                  case "utf8":
                  case "utf-8":
                    return U(t).length;
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return 2 * r;
                  case "hex":
                    return r >>> 1;
                  case "base64":
                    return D(t).length;
                  default:
                    if (n) return i ? -1 : U(t).length;
                    (e = ("" + e).toLowerCase()), (n = !0);
                }
            }
            function l(t, e, r) {
              var i = !1;
              if (((void 0 === e || e < 0) && (e = 0), e > this.length))
                return "";
              if (
                ((void 0 === r || r > this.length) && (r = this.length), r <= 0)
              )
                return "";
              if ((r >>>= 0) <= (e >>>= 0)) return "";
              for (t || (t = "utf8"); ; )
                switch (t) {
                  case "hex":
                    return x(this, e, r);
                  case "utf8":
                  case "utf-8":
                    return E(this, e, r);
                  case "ascii":
                    return k(this, e, r);
                  case "latin1":
                  case "binary":
                    return B(this, e, r);
                  case "base64":
                    return S(this, e, r);
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return I(this, e, r);
                  default:
                    if (i) throw new TypeError("Unknown encoding: " + t);
                    (t = (t + "").toLowerCase()), (i = !0);
                }
            }
            function p(t, e, r) {
              var i = t[e];
              (t[e] = t[r]), (t[r] = i);
            }
            function b(t, e, r, i, n) {
              if (0 === t.length) return -1;
              if (
                ("string" == typeof r
                  ? ((i = r), (r = 0))
                  : r > 2147483647
                  ? (r = 2147483647)
                  : r < -2147483648 && (r = -2147483648),
                z((r = +r)) && (r = n ? 0 : t.length - 1),
                r < 0 && (r = t.length + r),
                r >= t.length)
              ) {
                if (n) return -1;
                r = t.length - 1;
              } else if (r < 0) {
                if (!n) return -1;
                r = 0;
              }
              if (("string" == typeof e && (e = s.from(e, i)), s.isBuffer(e)))
                return 0 === e.length ? -1 : m(t, e, r, i, n);
              if ("number" == typeof e)
                return (
                  (e &= 255),
                  "function" == typeof Uint8Array.prototype.indexOf
                    ? n
                      ? Uint8Array.prototype.indexOf.call(t, e, r)
                      : Uint8Array.prototype.lastIndexOf.call(t, e, r)
                    : m(t, [e], r, i, n)
                );
              throw new TypeError("val must be string, number or Buffer");
            }
            function m(t, e, r, i, n) {
              var o,
                s = 1,
                a = t.length,
                f = e.length;
              if (
                void 0 !== i &&
                ("ucs2" === (i = String(i).toLowerCase()) ||
                  "ucs-2" === i ||
                  "utf16le" === i ||
                  "utf-16le" === i)
              ) {
                if (t.length < 2 || e.length < 2) return -1;
                (s = 2), (a /= 2), (f /= 2), (r /= 2);
              }
              function h(t, e) {
                return 1 === s ? t[e] : t.readUInt16BE(e * s);
              }
              if (n) {
                var u = -1;
                for (o = r; o < a; o++)
                  if (h(t, o) === h(e, -1 === u ? 0 : o - u)) {
                    if ((-1 === u && (u = o), o - u + 1 === f)) return u * s;
                  } else -1 !== u && (o -= o - u), (u = -1);
              } else
                for (r + f > a && (r = a - f), o = r; o >= 0; o--) {
                  for (var c = !0, d = 0; d < f; d++)
                    if (h(t, o + d) !== h(e, d)) {
                      c = !1;
                      break;
                    }
                  if (c) return o;
                }
              return -1;
            }
            function y(t, e, r, i) {
              r = Number(r) || 0;
              var n = t.length - r;
              i ? (i = Number(i)) > n && (i = n) : (i = n);
              var o = e.length;
              i > o / 2 && (i = o / 2);
              for (var s = 0; s < i; ++s) {
                var a = parseInt(e.substr(2 * s, 2), 16);
                if (z(a)) return s;
                t[r + s] = a;
              }
              return s;
            }
            function g(t, e, r, i) {
              return N(U(e, t.length - r), t, r, i);
            }
            function v(t, e, r, i) {
              return N(
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
            function w(t, e, r, i) {
              return v(t, e, r, i);
            }
            function _(t, e, r, i) {
              return N(D(e), t, r, i);
            }
            function M(t, e, r, i) {
              return N(
                (function (t, e) {
                  for (
                    var r, i, n, o = [], s = 0;
                    s < t.length && !((e -= 2) < 0);
                    ++s
                  )
                    (i = (r = t.charCodeAt(s)) >> 8),
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
            function S(t, r, i) {
              return 0 === r && i === t.length
                ? e.fromByteArray(t)
                : e.fromByteArray(t.slice(r, i));
            }
            function E(t, e, r) {
              r = Math.min(t.length, r);
              for (var i = [], n = e; n < r; ) {
                var o,
                  s,
                  a,
                  f,
                  h = t[n],
                  u = null,
                  c = h > 239 ? 4 : h > 223 ? 3 : h > 191 ? 2 : 1;
                if (n + c <= r)
                  switch (c) {
                    case 1:
                      h < 128 && (u = h);
                      break;
                    case 2:
                      128 == (192 & (o = t[n + 1])) &&
                        (f = ((31 & h) << 6) | (63 & o)) > 127 &&
                        (u = f);
                      break;
                    case 3:
                      (o = t[n + 1]),
                        (s = t[n + 2]),
                        128 == (192 & o) &&
                          128 == (192 & s) &&
                          (f = ((15 & h) << 12) | ((63 & o) << 6) | (63 & s)) >
                            2047 &&
                          (f < 55296 || f > 57343) &&
                          (u = f);
                      break;
                    case 4:
                      (o = t[n + 1]),
                        (s = t[n + 2]),
                        (a = t[n + 3]),
                        128 == (192 & o) &&
                          128 == (192 & s) &&
                          128 == (192 & a) &&
                          (f =
                            ((15 & h) << 18) |
                            ((63 & o) << 12) |
                            ((63 & s) << 6) |
                            (63 & a)) > 65535 &&
                          f < 1114112 &&
                          (u = f);
                  }
                null === u
                  ? ((u = 65533), (c = 1))
                  : u > 65535 &&
                    ((u -= 65536),
                    i.push(((u >>> 10) & 1023) | 55296),
                    (u = 56320 | (1023 & u))),
                  i.push(u),
                  (n += c);
              }
              return (function (t) {
                var e = t.length;
                if (e <= A) return String.fromCharCode.apply(String, t);
                var r = "",
                  i = 0;
                for (; i < e; )
                  r += String.fromCharCode.apply(String, t.slice(i, (i += A)));
                return r;
              })(i);
            }
            (r.kMaxLength = n),
              (s.TYPED_ARRAY_SUPPORT = (function () {
                try {
                  var t = new Uint8Array(1);
                  return (
                    (t.__proto__ = {
                      __proto__: Uint8Array.prototype,
                      foo: function () {
                        return 42;
                      },
                    }),
                    42 === t.foo()
                  );
                } catch (t) {
                  return !1;
                }
              })()),
              s.TYPED_ARRAY_SUPPORT ||
                "undefined" == typeof console ||
                "function" != typeof console.error ||
                console.error(
                  "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
                ),
              Object.defineProperty(s.prototype, "parent", {
                enumerable: !0,
                get: function () {
                  if (s.isBuffer(this)) return this.buffer;
                },
              }),
              Object.defineProperty(s.prototype, "offset", {
                enumerable: !0,
                get: function () {
                  if (s.isBuffer(this)) return this.byteOffset;
                },
              }),
              "undefined" != typeof Symbol &&
                null != Symbol.species &&
                s[Symbol.species] === s &&
                Object.defineProperty(s, Symbol.species, {
                  value: null,
                  configurable: !0,
                  enumerable: !1,
                  writable: !1,
                }),
              (s.poolSize = 8192),
              (s.from = function (t, e, r) {
                return a(t, e, r);
              }),
              (s.prototype.__proto__ = Uint8Array.prototype),
              (s.__proto__ = Uint8Array),
              (s.alloc = function (t, e, r) {
                return (function (t, e, r) {
                  return (
                    f(t),
                    t <= 0
                      ? o(t)
                      : void 0 !== e
                      ? "string" == typeof r
                        ? o(t).fill(e, r)
                        : o(t).fill(e)
                      : o(t)
                  );
                })(t, e, r);
              }),
              (s.allocUnsafe = function (t) {
                return h(t);
              }),
              (s.allocUnsafeSlow = function (t) {
                return h(t);
              }),
              (s.isBuffer = function (t) {
                return null != t && !0 === t._isBuffer && t !== s.prototype;
              }),
              (s.compare = function (t, e) {
                if (
                  (q(t, Uint8Array) && (t = s.from(t, t.offset, t.byteLength)),
                  q(e, Uint8Array) && (e = s.from(e, e.offset, e.byteLength)),
                  !s.isBuffer(t) || !s.isBuffer(e))
                )
                  throw new TypeError(
                    'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
                  );
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
              (s.isEncoding = function (t) {
                switch (String(t).toLowerCase()) {
                  case "hex":
                  case "utf8":
                  case "utf-8":
                  case "ascii":
                  case "latin1":
                  case "binary":
                  case "base64":
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return !0;
                  default:
                    return !1;
                }
              }),
              (s.concat = function (t, e) {
                if (!Array.isArray(t))
                  throw new TypeError(
                    '"list" argument must be an Array of Buffers'
                  );
                if (0 === t.length) return s.alloc(0);
                var r;
                if (void 0 === e)
                  for (e = 0, r = 0; r < t.length; ++r) e += t[r].length;
                var i = s.allocUnsafe(e),
                  n = 0;
                for (r = 0; r < t.length; ++r) {
                  var o = t[r];
                  if ((q(o, Uint8Array) && (o = s.from(o)), !s.isBuffer(o)))
                    throw new TypeError(
                      '"list" argument must be an Array of Buffers'
                    );
                  o.copy(i, n), (n += o.length);
                }
                return i;
              }),
              (s.byteLength = d),
              (s.prototype._isBuffer = !0),
              (s.prototype.swap16 = function () {
                var t = this.length;
                if (t % 2 != 0)
                  throw new RangeError(
                    "Buffer size must be a multiple of 16-bits"
                  );
                for (var e = 0; e < t; e += 2) p(this, e, e + 1);
                return this;
              }),
              (s.prototype.swap32 = function () {
                var t = this.length;
                if (t % 4 != 0)
                  throw new RangeError(
                    "Buffer size must be a multiple of 32-bits"
                  );
                for (var e = 0; e < t; e += 4)
                  p(this, e, e + 3), p(this, e + 1, e + 2);
                return this;
              }),
              (s.prototype.swap64 = function () {
                var t = this.length;
                if (t % 8 != 0)
                  throw new RangeError(
                    "Buffer size must be a multiple of 64-bits"
                  );
                for (var e = 0; e < t; e += 8)
                  p(this, e, e + 7),
                    p(this, e + 1, e + 6),
                    p(this, e + 2, e + 5),
                    p(this, e + 3, e + 4);
                return this;
              }),
              (s.prototype.toString = function () {
                var t = this.length;
                return 0 === t
                  ? ""
                  : 0 === arguments.length
                  ? E(this, 0, t)
                  : l.apply(this, arguments);
              }),
              (s.prototype.toLocaleString = s.prototype.toString),
              (s.prototype.equals = function (t) {
                if (!s.isBuffer(t))
                  throw new TypeError("Argument must be a Buffer");
                return this === t || 0 === s.compare(this, t);
              }),
              (s.prototype.inspect = function () {
                var t = "",
                  e = r.INSPECT_MAX_BYTES;
                return (
                  (t = this.toString("hex", 0, e)
                    .replace(/(.{2})/g, "$1 ")
                    .trim()),
                  this.length > e && (t += " ... "),
                  "<Buffer " + t + ">"
                );
              }),
              (s.prototype.compare = function (t, e, r, i, n) {
                if (
                  (q(t, Uint8Array) && (t = s.from(t, t.offset, t.byteLength)),
                  !s.isBuffer(t))
                )
                  throw new TypeError(
                    'The "target" argument must be one of type Buffer or Uint8Array. Received type ' +
                      typeof t
                  );
                if (
                  (void 0 === e && (e = 0),
                  void 0 === r && (r = t ? t.length : 0),
                  void 0 === i && (i = 0),
                  void 0 === n && (n = this.length),
                  e < 0 || r > t.length || i < 0 || n > this.length)
                )
                  throw new RangeError("out of range index");
                if (i >= n && e >= r) return 0;
                if (i >= n) return -1;
                if (e >= r) return 1;
                if (this === t) return 0;
                for (
                  var o = (n >>>= 0) - (i >>>= 0),
                    a = (r >>>= 0) - (e >>>= 0),
                    f = Math.min(o, a),
                    h = this.slice(i, n),
                    u = t.slice(e, r),
                    c = 0;
                  c < f;
                  ++c
                )
                  if (h[c] !== u[c]) {
                    (o = h[c]), (a = u[c]);
                    break;
                  }
                return o < a ? -1 : a < o ? 1 : 0;
              }),
              (s.prototype.includes = function (t, e, r) {
                return -1 !== this.indexOf(t, e, r);
              }),
              (s.prototype.indexOf = function (t, e, r) {
                return b(this, t, e, r, !0);
              }),
              (s.prototype.lastIndexOf = function (t, e, r) {
                return b(this, t, e, r, !1);
              }),
              (s.prototype.write = function (t, e, r, i) {
                if (void 0 === e) (i = "utf8"), (r = this.length), (e = 0);
                else if (void 0 === r && "string" == typeof e)
                  (i = e), (r = this.length), (e = 0);
                else {
                  if (!isFinite(e))
                    throw new Error(
                      "Buffer.write(string, encoding, offset[, length]) is no longer supported"
                    );
                  (e >>>= 0),
                    isFinite(r)
                      ? ((r >>>= 0), void 0 === i && (i = "utf8"))
                      : ((i = r), (r = void 0));
                }
                var n = this.length - e;
                if (
                  ((void 0 === r || r > n) && (r = n),
                  (t.length > 0 && (r < 0 || e < 0)) || e > this.length)
                )
                  throw new RangeError(
                    "Attempt to write outside buffer bounds"
                  );
                i || (i = "utf8");
                for (var o = !1; ; )
                  switch (i) {
                    case "hex":
                      return y(this, t, e, r);
                    case "utf8":
                    case "utf-8":
                      return g(this, t, e, r);
                    case "ascii":
                      return v(this, t, e, r);
                    case "latin1":
                    case "binary":
                      return w(this, t, e, r);
                    case "base64":
                      return _(this, t, e, r);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                      return M(this, t, e, r);
                    default:
                      if (o) throw new TypeError("Unknown encoding: " + i);
                      (i = ("" + i).toLowerCase()), (o = !0);
                  }
              }),
              (s.prototype.toJSON = function () {
                return {
                  type: "Buffer",
                  data: Array.prototype.slice.call(this._arr || this, 0),
                };
              });
            var A = 4096;
            function k(t, e, r) {
              var i = "";
              r = Math.min(t.length, r);
              for (var n = e; n < r; ++n) i += String.fromCharCode(127 & t[n]);
              return i;
            }
            function B(t, e, r) {
              var i = "";
              r = Math.min(t.length, r);
              for (var n = e; n < r; ++n) i += String.fromCharCode(t[n]);
              return i;
            }
            function x(t, e, r) {
              var i = t.length;
              (!e || e < 0) && (e = 0), (!r || r < 0 || r > i) && (r = i);
              for (var n = "", o = e; o < r; ++o) n += O(t[o]);
              return n;
            }
            function I(t, e, r) {
              for (var i = t.slice(e, r), n = "", o = 0; o < i.length; o += 2)
                n += String.fromCharCode(i[o] + 256 * i[o + 1]);
              return n;
            }
            function R(t, e, r) {
              if (t % 1 != 0 || t < 0)
                throw new RangeError("offset is not uint");
              if (t + e > r)
                throw new RangeError("Trying to access beyond buffer length");
            }
            function j(t, e, r, i, n, o) {
              if (!s.isBuffer(t))
                throw new TypeError(
                  '"buffer" argument must be a Buffer instance'
                );
              if (e > n || e < o)
                throw new RangeError('"value" argument is out of bounds');
              if (r + i > t.length) throw new RangeError("Index out of range");
            }
            function T(t, e, r, i, n, o) {
              if (r + i > t.length) throw new RangeError("Index out of range");
              if (r < 0) throw new RangeError("Index out of range");
            }
            function L(t, e, r, n, o) {
              return (
                (e = +e),
                (r >>>= 0),
                o || T(t, 0, r, 4),
                i.write(t, e, r, n, 23, 4),
                r + 4
              );
            }
            function C(t, e, r, n, o) {
              return (
                (e = +e),
                (r >>>= 0),
                o || T(t, 0, r, 8),
                i.write(t, e, r, n, 52, 8),
                r + 8
              );
            }
            (s.prototype.slice = function (t, e) {
              var r = this.length;
              (t = ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r),
                (e = void 0 === e ? r : ~~e) < 0
                  ? (e += r) < 0 && (e = 0)
                  : e > r && (e = r),
                e < t && (e = t);
              var i = this.subarray(t, e);
              return (i.__proto__ = s.prototype), i;
            }),
              (s.prototype.readUIntLE = function (t, e, r) {
                (t >>>= 0), (e >>>= 0), r || R(t, e, this.length);
                for (var i = this[t], n = 1, o = 0; ++o < e && (n *= 256); )
                  i += this[t + o] * n;
                return i;
              }),
              (s.prototype.readUIntBE = function (t, e, r) {
                (t >>>= 0), (e >>>= 0), r || R(t, e, this.length);
                for (var i = this[t + --e], n = 1; e > 0 && (n *= 256); )
                  i += this[t + --e] * n;
                return i;
              }),
              (s.prototype.readUInt8 = function (t, e) {
                return (t >>>= 0), e || R(t, 1, this.length), this[t];
              }),
              (s.prototype.readUInt16LE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || R(t, 2, this.length),
                  this[t] | (this[t + 1] << 8)
                );
              }),
              (s.prototype.readUInt16BE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || R(t, 2, this.length),
                  (this[t] << 8) | this[t + 1]
                );
              }),
              (s.prototype.readUInt32LE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || R(t, 4, this.length),
                  (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
                    16777216 * this[t + 3]
                );
              }),
              (s.prototype.readUInt32BE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || R(t, 4, this.length),
                  16777216 * this[t] +
                    ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
                );
              }),
              (s.prototype.readIntLE = function (t, e, r) {
                (t >>>= 0), (e >>>= 0), r || R(t, e, this.length);
                for (var i = this[t], n = 1, o = 0; ++o < e && (n *= 256); )
                  i += this[t + o] * n;
                return i >= (n *= 128) && (i -= Math.pow(2, 8 * e)), i;
              }),
              (s.prototype.readIntBE = function (t, e, r) {
                (t >>>= 0), (e >>>= 0), r || R(t, e, this.length);
                for (var i = e, n = 1, o = this[t + --i]; i > 0 && (n *= 256); )
                  o += this[t + --i] * n;
                return o >= (n *= 128) && (o -= Math.pow(2, 8 * e)), o;
              }),
              (s.prototype.readInt8 = function (t, e) {
                return (
                  (t >>>= 0),
                  e || R(t, 1, this.length),
                  128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
                );
              }),
              (s.prototype.readInt16LE = function (t, e) {
                (t >>>= 0), e || R(t, 2, this.length);
                var r = this[t] | (this[t + 1] << 8);
                return 32768 & r ? 4294901760 | r : r;
              }),
              (s.prototype.readInt16BE = function (t, e) {
                (t >>>= 0), e || R(t, 2, this.length);
                var r = this[t + 1] | (this[t] << 8);
                return 32768 & r ? 4294901760 | r : r;
              }),
              (s.prototype.readInt32LE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || R(t, 4, this.length),
                  this[t] |
                    (this[t + 1] << 8) |
                    (this[t + 2] << 16) |
                    (this[t + 3] << 24)
                );
              }),
              (s.prototype.readInt32BE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || R(t, 4, this.length),
                  (this[t] << 24) |
                    (this[t + 1] << 16) |
                    (this[t + 2] << 8) |
                    this[t + 3]
                );
              }),
              (s.prototype.readFloatLE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || R(t, 4, this.length),
                  i.read(this, t, !0, 23, 4)
                );
              }),
              (s.prototype.readFloatBE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || R(t, 4, this.length),
                  i.read(this, t, !1, 23, 4)
                );
              }),
              (s.prototype.readDoubleLE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || R(t, 8, this.length),
                  i.read(this, t, !0, 52, 8)
                );
              }),
              (s.prototype.readDoubleBE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || R(t, 8, this.length),
                  i.read(this, t, !1, 52, 8)
                );
              }),
              (s.prototype.writeUIntLE = function (t, e, r, i) {
                ((t = +t), (e >>>= 0), (r >>>= 0), i) ||
                  j(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                var n = 1,
                  o = 0;
                for (this[e] = 255 & t; ++o < r && (n *= 256); )
                  this[e + o] = (t / n) & 255;
                return e + r;
              }),
              (s.prototype.writeUIntBE = function (t, e, r, i) {
                ((t = +t), (e >>>= 0), (r >>>= 0), i) ||
                  j(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                var n = r - 1,
                  o = 1;
                for (this[e + n] = 255 & t; --n >= 0 && (o *= 256); )
                  this[e + n] = (t / o) & 255;
                return e + r;
              }),
              (s.prototype.writeUInt8 = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || j(this, t, e, 1, 255, 0),
                  (this[e] = 255 & t),
                  e + 1
                );
              }),
              (s.prototype.writeUInt16LE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || j(this, t, e, 2, 65535, 0),
                  (this[e] = 255 & t),
                  (this[e + 1] = t >>> 8),
                  e + 2
                );
              }),
              (s.prototype.writeUInt16BE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || j(this, t, e, 2, 65535, 0),
                  (this[e] = t >>> 8),
                  (this[e + 1] = 255 & t),
                  e + 2
                );
              }),
              (s.prototype.writeUInt32LE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || j(this, t, e, 4, 4294967295, 0),
                  (this[e + 3] = t >>> 24),
                  (this[e + 2] = t >>> 16),
                  (this[e + 1] = t >>> 8),
                  (this[e] = 255 & t),
                  e + 4
                );
              }),
              (s.prototype.writeUInt32BE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || j(this, t, e, 4, 4294967295, 0),
                  (this[e] = t >>> 24),
                  (this[e + 1] = t >>> 16),
                  (this[e + 2] = t >>> 8),
                  (this[e + 3] = 255 & t),
                  e + 4
                );
              }),
              (s.prototype.writeIntLE = function (t, e, r, i) {
                if (((t = +t), (e >>>= 0), !i)) {
                  var n = Math.pow(2, 8 * r - 1);
                  j(this, t, e, r, n - 1, -n);
                }
                var o = 0,
                  s = 1,
                  a = 0;
                for (this[e] = 255 & t; ++o < r && (s *= 256); )
                  t < 0 && 0 === a && 0 !== this[e + o - 1] && (a = 1),
                    (this[e + o] = (((t / s) >> 0) - a) & 255);
                return e + r;
              }),
              (s.prototype.writeIntBE = function (t, e, r, i) {
                if (((t = +t), (e >>>= 0), !i)) {
                  var n = Math.pow(2, 8 * r - 1);
                  j(this, t, e, r, n - 1, -n);
                }
                var o = r - 1,
                  s = 1,
                  a = 0;
                for (this[e + o] = 255 & t; --o >= 0 && (s *= 256); )
                  t < 0 && 0 === a && 0 !== this[e + o + 1] && (a = 1),
                    (this[e + o] = (((t / s) >> 0) - a) & 255);
                return e + r;
              }),
              (s.prototype.writeInt8 = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || j(this, t, e, 1, 127, -128),
                  t < 0 && (t = 255 + t + 1),
                  (this[e] = 255 & t),
                  e + 1
                );
              }),
              (s.prototype.writeInt16LE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || j(this, t, e, 2, 32767, -32768),
                  (this[e] = 255 & t),
                  (this[e + 1] = t >>> 8),
                  e + 2
                );
              }),
              (s.prototype.writeInt16BE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || j(this, t, e, 2, 32767, -32768),
                  (this[e] = t >>> 8),
                  (this[e + 1] = 255 & t),
                  e + 2
                );
              }),
              (s.prototype.writeInt32LE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || j(this, t, e, 4, 2147483647, -2147483648),
                  (this[e] = 255 & t),
                  (this[e + 1] = t >>> 8),
                  (this[e + 2] = t >>> 16),
                  (this[e + 3] = t >>> 24),
                  e + 4
                );
              }),
              (s.prototype.writeInt32BE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || j(this, t, e, 4, 2147483647, -2147483648),
                  t < 0 && (t = 4294967295 + t + 1),
                  (this[e] = t >>> 24),
                  (this[e + 1] = t >>> 16),
                  (this[e + 2] = t >>> 8),
                  (this[e + 3] = 255 & t),
                  e + 4
                );
              }),
              (s.prototype.writeFloatLE = function (t, e, r) {
                return L(this, t, e, !0, r);
              }),
              (s.prototype.writeFloatBE = function (t, e, r) {
                return L(this, t, e, !1, r);
              }),
              (s.prototype.writeDoubleLE = function (t, e, r) {
                return C(this, t, e, !0, r);
              }),
              (s.prototype.writeDoubleBE = function (t, e, r) {
                return C(this, t, e, !1, r);
              }),
              (s.prototype.copy = function (t, e, r, i) {
                if (!s.isBuffer(t))
                  throw new TypeError("argument should be a Buffer");
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
                if (e < 0) throw new RangeError("targetStart out of bounds");
                if (r < 0 || r >= this.length)
                  throw new RangeError("Index out of range");
                if (i < 0) throw new RangeError("sourceEnd out of bounds");
                i > this.length && (i = this.length),
                  t.length - e < i - r && (i = t.length - e + r);
                var n = i - r;
                if (
                  this === t &&
                  "function" == typeof Uint8Array.prototype.copyWithin
                )
                  this.copyWithin(e, r, i);
                else if (this === t && r < e && e < i)
                  for (var o = n - 1; o >= 0; --o) t[o + e] = this[o + r];
                else Uint8Array.prototype.set.call(t, this.subarray(r, i), e);
                return n;
              }),
              (s.prototype.fill = function (t, e, r, i) {
                if ("string" == typeof t) {
                  if (
                    ("string" == typeof e
                      ? ((i = e), (e = 0), (r = this.length))
                      : "string" == typeof r && ((i = r), (r = this.length)),
                    void 0 !== i && "string" != typeof i)
                  )
                    throw new TypeError("encoding must be a string");
                  if ("string" == typeof i && !s.isEncoding(i))
                    throw new TypeError("Unknown encoding: " + i);
                  if (1 === t.length) {
                    var n = t.charCodeAt(0);
                    (("utf8" === i && n < 128) || "latin1" === i) && (t = n);
                  }
                } else "number" == typeof t && (t &= 255);
                if (e < 0 || this.length < e || this.length < r)
                  throw new RangeError("Out of range index");
                if (r <= e) return this;
                var o;
                if (
                  ((e >>>= 0),
                  (r = void 0 === r ? this.length : r >>> 0),
                  t || (t = 0),
                  "number" == typeof t)
                )
                  for (o = e; o < r; ++o) this[o] = t;
                else {
                  var a = s.isBuffer(t) ? t : s.from(t, i),
                    f = a.length;
                  if (0 === f)
                    throw new TypeError(
                      'The value "' + t + '" is invalid for argument "value"'
                    );
                  for (o = 0; o < r - e; ++o) this[o + e] = a[o % f];
                }
                return this;
              });
            var P = /[^+/0-9A-Za-z-_]/g;
            function O(t) {
              return t < 16 ? "0" + t.toString(16) : t.toString(16);
            }
            function U(t, e) {
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
                  o.push(
                    (r >> 12) | 224,
                    ((r >> 6) & 63) | 128,
                    (63 & r) | 128
                  );
                } else {
                  if (!(r < 1114112)) throw new Error("Invalid code point");
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
            function D(t) {
              return e.toByteArray(
                (function (t) {
                  if (
                    (t = (t = t.split("=")[0]).trim().replace(P, "")).length < 2
                  )
                    return "";
                  for (; t.length % 4 != 0; ) t += "=";
                  return t;
                })(t)
              );
            }
            function N(t, e, r, i) {
              for (
                var n = 0;
                n < i && !(n + r >= e.length || n >= t.length);
                ++n
              )
                e[n + r] = t[n];
              return n;
            }
            function q(t, e) {
              return (
                t instanceof e ||
                (null != t &&
                  null != t.constructor &&
                  null != t.constructor.name &&
                  t.constructor.name === e.name)
              );
            }
            function z(t) {
              return t != t;
            }
          }).call(this);
        }).call(this, t("buffer").Buffer);
      },
      { "base64-js": 16, buffer: 63, ieee754: 131 },
    ],
    64: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer,
          n = t("stream").Transform,
          o = t("string_decoder").StringDecoder;
        function s(t) {
          n.call(this),
            (this.hashMode = "string" == typeof t),
            this.hashMode
              ? (this[t] = this._finalOrDigest)
              : (this.final = this._finalOrDigest),
            this._final && ((this.__final = this._final), (this._final = null)),
            (this._decoder = null),
            (this._encoding = null);
        }
        t("inherits")(s, n),
          (s.prototype.update = function (t, e, r) {
            "string" == typeof t && (t = i.from(t, e));
            var n = this._update(t);
            return this.hashMode ? this : (r && (n = this._toString(n, r)), n);
          }),
          (s.prototype.setAutoPadding = function () {}),
          (s.prototype.getAuthTag = function () {
            throw new Error("trying to get auth tag in unsupported state");
          }),
          (s.prototype.setAuthTag = function () {
            throw new Error("trying to set auth tag in unsupported state");
          }),
          (s.prototype.setAAD = function () {
            throw new Error("trying to set aad in unsupported state");
          }),
          (s.prototype._transform = function (t, e, r) {
            var i;
            try {
              this.hashMode ? this._update(t) : this.push(this._update(t));
            } catch (t) {
              i = t;
            } finally {
              r(i);
            }
          }),
          (s.prototype._flush = function (t) {
            var e;
            try {
              this.push(this.__final());
            } catch (t) {
              e = t;
            }
            t(e);
          }),
          (s.prototype._finalOrDigest = function (t) {
            var e = this.__final() || i.alloc(0);
            return t && (e = this._toString(e, t, !0)), e;
          }),
          (s.prototype._toString = function (t, e, r) {
            if (
              (this._decoder ||
                ((this._decoder = new o(e)), (this._encoding = e)),
              this._encoding !== e)
            )
              throw new Error("can't switch encodings");
            var i = this._decoder.write(t);
            return r && (i += this._decoder.end()), i;
          }),
          (e.exports = s);
      },
      { inherits: 132, "safe-buffer": 160, stream: 170, string_decoder: 185 },
    ],
    65: [
      function (t, e, r) {
        (function (r) {
          (function () {
            var i = t("elliptic"),
              n = t("bn.js");
            e.exports = function (t) {
              return new s(t);
            };
            var o = {
              secp256k1: { name: "secp256k1", byteLength: 32 },
              secp224r1: { name: "p224", byteLength: 28 },
              prime256v1: { name: "p256", byteLength: 32 },
              prime192v1: { name: "p192", byteLength: 24 },
              ed25519: { name: "ed25519", byteLength: 32 },
              secp384r1: { name: "p384", byteLength: 48 },
              secp521r1: { name: "p521", byteLength: 66 },
            };
            function s(t) {
              (this.curveType = o[t]),
                this.curveType || (this.curveType = { name: t }),
                (this.curve = new i.ec(this.curveType.name)),
                (this.keys = void 0);
            }
            function a(t, e, i) {
              Array.isArray(t) || (t = t.toArray());
              var n = new r(t);
              if (i && n.length < i) {
                var o = new r(i - n.length);
                o.fill(0), (n = r.concat([o, n]));
              }
              return e ? n.toString(e) : n;
            }
            (o.p224 = o.secp224r1),
              (o.p256 = o.secp256r1 = o.prime256v1),
              (o.p192 = o.secp192r1 = o.prime192v1),
              (o.p384 = o.secp384r1),
              (o.p521 = o.secp521r1),
              (s.prototype.generateKeys = function (t, e) {
                return (
                  (this.keys = this.curve.genKeyPair()), this.getPublicKey(t, e)
                );
              }),
              (s.prototype.computeSecret = function (t, e, i) {
                return (
                  (e = e || "utf8"),
                  r.isBuffer(t) || (t = new r(t, e)),
                  a(
                    this.curve
                      .keyFromPublic(t)
                      .getPublic()
                      .mul(this.keys.getPrivate())
                      .getX(),
                    i,
                    this.curveType.byteLength
                  )
                );
              }),
              (s.prototype.getPublicKey = function (t, e) {
                var r = this.keys.getPublic("compressed" === e, !0);
                return (
                  "hybrid" === e &&
                    (r[r.length - 1] % 2 ? (r[0] = 7) : (r[0] = 6)),
                  a(r, t)
                );
              }),
              (s.prototype.getPrivateKey = function (t) {
                return a(this.keys.getPrivate(), t);
              }),
              (s.prototype.setPublicKey = function (t, e) {
                return (
                  (e = e || "utf8"),
                  r.isBuffer(t) || (t = new r(t, e)),
                  this.keys._importPublic(t),
                  this
                );
              }),
              (s.prototype.setPrivateKey = function (t, e) {
                (e = e || "utf8"), r.isBuffer(t) || (t = new r(t, e));
                var i = new n(t);
                return (
                  (i = i.toString(16)),
                  (this.keys = this.curve.genKeyPair()),
                  this.keys._importPrivate(i),
                  this
                );
              });
          }).call(this);
        }).call(this, t("buffer").Buffer);
      },
      { "bn.js": 66, buffer: 63, elliptic: 83 },
    ],
    66: [
      function (t, e, r) {
        arguments[4][15][0].apply(r, arguments);
      },
      { buffer: 19, dup: 15 },
    ],
    67: [
      function (t, e, r) {
        "use strict";
        var i = t("inherits"),
          n = t("md5.js"),
          o = t("ripemd160"),
          s = t("sha.js"),
          a = t("cipher-base");
        function f(t) {
          a.call(this, "digest"), (this._hash = t);
        }
        i(f, a),
          (f.prototype._update = function (t) {
            this._hash.update(t);
          }),
          (f.prototype._final = function () {
            return this._hash.digest();
          }),
          (e.exports = function (t) {
            return "md5" === (t = t.toLowerCase())
              ? new n()
              : "rmd160" === t || "ripemd160" === t
              ? new o()
              : new f(s(t));
          });
      },
      {
        "cipher-base": 64,
        inherits: 132,
        "md5.js": 133,
        ripemd160: 159,
        "sha.js": 163,
      },
    ],
    68: [
      function (t, e, r) {
        var i = t("md5.js");
        e.exports = function (t) {
          return new i().update(t).digest();
        };
      },
      { "md5.js": 133 },
    ],
    69: [
      function (t, e, r) {
        "use strict";
        var i = t("inherits"),
          n = t("./legacy"),
          o = t("cipher-base"),
          s = t("safe-buffer").Buffer,
          a = t("create-hash/md5"),
          f = t("ripemd160"),
          h = t("sha.js"),
          u = s.alloc(128);
        function c(t, e) {
          o.call(this, "digest"), "string" == typeof e && (e = s.from(e));
          var r = "sha512" === t || "sha384" === t ? 128 : 64;
          ((this._alg = t), (this._key = e), e.length > r)
            ? (e = ("rmd160" === t ? new f() : h(t)).update(e).digest())
            : e.length < r && (e = s.concat([e, u], r));
          for (
            var i = (this._ipad = s.allocUnsafe(r)),
              n = (this._opad = s.allocUnsafe(r)),
              a = 0;
            a < r;
            a++
          )
            (i[a] = 54 ^ e[a]), (n[a] = 92 ^ e[a]);
          (this._hash = "rmd160" === t ? new f() : h(t)), this._hash.update(i);
        }
        i(c, o),
          (c.prototype._update = function (t) {
            this._hash.update(t);
          }),
          (c.prototype._final = function () {
            var t = this._hash.digest();
            return ("rmd160" === this._alg ? new f() : h(this._alg))
              .update(this._opad)
              .update(t)
              .digest();
          }),
          (e.exports = function (t, e) {
            return "rmd160" === (t = t.toLowerCase()) || "ripemd160" === t
              ? new c("rmd160", e)
              : "md5" === t
              ? new n(a, e)
              : new c(t, e);
          });
      },
      {
        "./legacy": 70,
        "cipher-base": 64,
        "create-hash/md5": 68,
        inherits: 132,
        ripemd160: 159,
        "safe-buffer": 160,
        "sha.js": 163,
      },
    ],
    70: [
      function (t, e, r) {
        "use strict";
        var i = t("inherits"),
          n = t("safe-buffer").Buffer,
          o = t("cipher-base"),
          s = n.alloc(128),
          a = 64;
        function f(t, e) {
          o.call(this, "digest"),
            "string" == typeof e && (e = n.from(e)),
            (this._alg = t),
            (this._key = e),
            e.length > a
              ? (e = t(e))
              : e.length < a && (e = n.concat([e, s], a));
          for (
            var r = (this._ipad = n.allocUnsafe(a)),
              i = (this._opad = n.allocUnsafe(a)),
              f = 0;
            f < a;
            f++
          )
            (r[f] = 54 ^ e[f]), (i[f] = 92 ^ e[f]);
          this._hash = [r];
        }
        i(f, o),
          (f.prototype._update = function (t) {
            this._hash.push(t);
          }),
          (f.prototype._final = function () {
            var t = this._alg(n.concat(this._hash));
            return this._alg(n.concat([this._opad, t]));
          }),
          (e.exports = f);
      },
      { "cipher-base": 64, inherits: 132, "safe-buffer": 160 },
    ],
    71: [
      function (t, e, r) {
        "use strict";
        (r.randomBytes =
          r.rng =
          r.pseudoRandomBytes =
          r.prng =
            t("randombytes")),
          (r.createHash = r.Hash = t("create-hash")),
          (r.createHmac = r.Hmac = t("create-hmac"));
        var i = t("browserify-sign/algos"),
          n = Object.keys(i),
          o = [
            "sha1",
            "sha224",
            "sha256",
            "sha384",
            "sha512",
            "md5",
            "rmd160",
          ].concat(n);
        r.getHashes = function () {
          return o;
        };
        var s = t("pbkdf2");
        (r.pbkdf2 = s.pbkdf2), (r.pbkdf2Sync = s.pbkdf2Sync);
        var a = t("browserify-cipher");
        (r.Cipher = a.Cipher),
          (r.createCipher = a.createCipher),
          (r.Cipheriv = a.Cipheriv),
          (r.createCipheriv = a.createCipheriv),
          (r.Decipher = a.Decipher),
          (r.createDecipher = a.createDecipher),
          (r.Decipheriv = a.Decipheriv),
          (r.createDecipheriv = a.createDecipheriv),
          (r.getCiphers = a.getCiphers),
          (r.listCiphers = a.listCiphers);
        var f = t("diffie-hellman");
        (r.DiffieHellmanGroup = f.DiffieHellmanGroup),
          (r.createDiffieHellmanGroup = f.createDiffieHellmanGroup),
          (r.getDiffieHellman = f.getDiffieHellman),
          (r.createDiffieHellman = f.createDiffieHellman),
          (r.DiffieHellman = f.DiffieHellman);
        var h = t("browserify-sign");
        (r.createSign = h.createSign),
          (r.Sign = h.Sign),
          (r.createVerify = h.createVerify),
          (r.Verify = h.Verify),
          (r.createECDH = t("create-ecdh"));
        var u = t("public-encrypt");
        (r.publicEncrypt = u.publicEncrypt),
          (r.privateEncrypt = u.privateEncrypt),
          (r.publicDecrypt = u.publicDecrypt),
          (r.privateDecrypt = u.privateDecrypt);
        var c = t("randomfill");
        (r.randomFill = c.randomFill),
          (r.randomFillSync = c.randomFillSync),
          (r.createCredentials = function () {
            throw new Error(
              [
                "sorry, createCredentials is not implemented yet",
                "we accept pull requests",
                "https://github.com/crypto-browserify/crypto-browserify",
              ].join("\n")
            );
          }),
          (r.constants = {
            DH_CHECK_P_NOT_SAFE_PRIME: 2,
            DH_CHECK_P_NOT_PRIME: 1,
            DH_UNABLE_TO_CHECK_GENERATOR: 4,
            DH_NOT_SUITABLE_GENERATOR: 8,
            NPN_ENABLED: 1,
            ALPN_ENABLED: 1,
            RSA_PKCS1_PADDING: 1,
            RSA_SSLV23_PADDING: 2,
            RSA_NO_PADDING: 3,
            RSA_PKCS1_OAEP_PADDING: 4,
            RSA_X931_PADDING: 5,
            RSA_PKCS1_PSS_PADDING: 6,
            POINT_CONVERSION_COMPRESSED: 2,
            POINT_CONVERSION_UNCOMPRESSED: 4,
            POINT_CONVERSION_HYBRID: 6,
          });
      },
      {
        "browserify-cipher": 37,
        "browserify-sign": 44,
        "browserify-sign/algos": 41,
        "create-ecdh": 65,
        "create-hash": 67,
        "create-hmac": 69,
        "diffie-hellman": 78,
        pbkdf2: 143,
        "public-encrypt": 150,
        randombytes: 157,
        randomfill: 158,
      },
    ],
    72: [
      function (t, e, r) {
        "use strict";
        (r.utils = t("./des/utils")),
          (r.Cipher = t("./des/cipher")),
          (r.DES = t("./des/des")),
          (r.CBC = t("./des/cbc")),
          (r.EDE = t("./des/ede"));
      },
      {
        "./des/cbc": 73,
        "./des/cipher": 74,
        "./des/des": 75,
        "./des/ede": 76,
        "./des/utils": 77,
      },
    ],
    73: [
      function (t, e, r) {
        "use strict";
        var i = t("minimalistic-assert"),
          n = t("inherits"),
          o = {};
        function s(t) {
          i.equal(t.length, 8, "Invalid IV length"), (this.iv = new Array(8));
          for (var e = 0; e < this.iv.length; e++) this.iv[e] = t[e];
        }
        (r.instantiate = function (t) {
          function e(e) {
            t.call(this, e), this._cbcInit();
          }
          n(e, t);
          for (var r = Object.keys(o), i = 0; i < r.length; i++) {
            var s = r[i];
            e.prototype[s] = o[s];
          }
          return (
            (e.create = function (t) {
              return new e(t);
            }),
            e
          );
        }),
          (o._cbcInit = function () {
            var t = new s(this.options.iv);
            this._cbcState = t;
          }),
          (o._update = function (t, e, r, i) {
            var n = this._cbcState,
              o = this.constructor.super_.prototype,
              s = n.iv;
            if ("encrypt" === this.type) {
              for (var a = 0; a < this.blockSize; a++) s[a] ^= t[e + a];
              o._update.call(this, s, 0, r, i);
              for (a = 0; a < this.blockSize; a++) s[a] = r[i + a];
            } else {
              o._update.call(this, t, e, r, i);
              for (a = 0; a < this.blockSize; a++) r[i + a] ^= s[a];
              for (a = 0; a < this.blockSize; a++) s[a] = t[e + a];
            }
          });
      },
      { inherits: 132, "minimalistic-assert": 136 },
    ],
    74: [
      function (t, e, r) {
        "use strict";
        var i = t("minimalistic-assert");
        function n(t) {
          (this.options = t),
            (this.type = this.options.type),
            (this.blockSize = 8),
            this._init(),
            (this.buffer = new Array(this.blockSize)),
            (this.bufferOff = 0);
        }
        (e.exports = n),
          (n.prototype._init = function () {}),
          (n.prototype.update = function (t) {
            return 0 === t.length
              ? []
              : "decrypt" === this.type
              ? this._updateDecrypt(t)
              : this._updateEncrypt(t);
          }),
          (n.prototype._buffer = function (t, e) {
            for (
              var r = Math.min(
                  this.buffer.length - this.bufferOff,
                  t.length - e
                ),
                i = 0;
              i < r;
              i++
            )
              this.buffer[this.bufferOff + i] = t[e + i];
            return (this.bufferOff += r), r;
          }),
          (n.prototype._flushBuffer = function (t, e) {
            return (
              this._update(this.buffer, 0, t, e),
              (this.bufferOff = 0),
              this.blockSize
            );
          }),
          (n.prototype._updateEncrypt = function (t) {
            var e = 0,
              r = 0,
              i = ((this.bufferOff + t.length) / this.blockSize) | 0,
              n = new Array(i * this.blockSize);
            0 !== this.bufferOff &&
              ((e += this._buffer(t, e)),
              this.bufferOff === this.buffer.length &&
                (r += this._flushBuffer(n, r)));
            for (
              var o = t.length - ((t.length - e) % this.blockSize);
              e < o;
              e += this.blockSize
            )
              this._update(t, e, n, r), (r += this.blockSize);
            for (; e < t.length; e++, this.bufferOff++)
              this.buffer[this.bufferOff] = t[e];
            return n;
          }),
          (n.prototype._updateDecrypt = function (t) {
            for (
              var e = 0,
                r = 0,
                i = Math.ceil((this.bufferOff + t.length) / this.blockSize) - 1,
                n = new Array(i * this.blockSize);
              i > 0;
              i--
            )
              (e += this._buffer(t, e)), (r += this._flushBuffer(n, r));
            return (e += this._buffer(t, e)), n;
          }),
          (n.prototype.final = function (t) {
            var e, r;
            return (
              t && (e = this.update(t)),
              (r =
                "encrypt" === this.type
                  ? this._finalEncrypt()
                  : this._finalDecrypt()),
              e ? e.concat(r) : r
            );
          }),
          (n.prototype._pad = function (t, e) {
            if (0 === e) return !1;
            for (; e < t.length; ) t[e++] = 0;
            return !0;
          }),
          (n.prototype._finalEncrypt = function () {
            if (!this._pad(this.buffer, this.bufferOff)) return [];
            var t = new Array(this.blockSize);
            return this._update(this.buffer, 0, t, 0), t;
          }),
          (n.prototype._unpad = function (t) {
            return t;
          }),
          (n.prototype._finalDecrypt = function () {
            i.equal(
              this.bufferOff,
              this.blockSize,
              "Not enough data to decrypt"
            );
            var t = new Array(this.blockSize);
            return this._flushBuffer(t, 0), this._unpad(t);
          });
      },
      { "minimalistic-assert": 136 },
    ],
    75: [
      function (t, e, r) {
        "use strict";
        var i = t("minimalistic-assert"),
          n = t("inherits"),
          o = t("./utils"),
          s = t("./cipher");
        function a() {
          (this.tmp = new Array(2)), (this.keys = null);
        }
        function f(t) {
          s.call(this, t);
          var e = new a();
          (this._desState = e), this.deriveKeys(e, t.key);
        }
        n(f, s),
          (e.exports = f),
          (f.create = function (t) {
            return new f(t);
          });
        var h = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
        (f.prototype.deriveKeys = function (t, e) {
          (t.keys = new Array(32)),
            i.equal(e.length, this.blockSize, "Invalid key length");
          var r = o.readUInt32BE(e, 0),
            n = o.readUInt32BE(e, 4);
          o.pc1(r, n, t.tmp, 0), (r = t.tmp[0]), (n = t.tmp[1]);
          for (var s = 0; s < t.keys.length; s += 2) {
            var a = h[s >>> 1];
            (r = o.r28shl(r, a)), (n = o.r28shl(n, a)), o.pc2(r, n, t.keys, s);
          }
        }),
          (f.prototype._update = function (t, e, r, i) {
            var n = this._desState,
              s = o.readUInt32BE(t, e),
              a = o.readUInt32BE(t, e + 4);
            o.ip(s, a, n.tmp, 0),
              (s = n.tmp[0]),
              (a = n.tmp[1]),
              "encrypt" === this.type
                ? this._encrypt(n, s, a, n.tmp, 0)
                : this._decrypt(n, s, a, n.tmp, 0),
              (s = n.tmp[0]),
              (a = n.tmp[1]),
              o.writeUInt32BE(r, s, i),
              o.writeUInt32BE(r, a, i + 4);
          }),
          (f.prototype._pad = function (t, e) {
            for (var r = t.length - e, i = e; i < t.length; i++) t[i] = r;
            return !0;
          }),
          (f.prototype._unpad = function (t) {
            for (var e = t[t.length - 1], r = t.length - e; r < t.length; r++)
              i.equal(t[r], e);
            return t.slice(0, t.length - e);
          }),
          (f.prototype._encrypt = function (t, e, r, i, n) {
            for (var s = e, a = r, f = 0; f < t.keys.length; f += 2) {
              var h = t.keys[f],
                u = t.keys[f + 1];
              o.expand(a, t.tmp, 0), (h ^= t.tmp[0]), (u ^= t.tmp[1]);
              var c = o.substitute(h, u),
                d = a;
              (a = (s ^ o.permute(c)) >>> 0), (s = d);
            }
            o.rip(a, s, i, n);
          }),
          (f.prototype._decrypt = function (t, e, r, i, n) {
            for (var s = r, a = e, f = t.keys.length - 2; f >= 0; f -= 2) {
              var h = t.keys[f],
                u = t.keys[f + 1];
              o.expand(s, t.tmp, 0), (h ^= t.tmp[0]), (u ^= t.tmp[1]);
              var c = o.substitute(h, u),
                d = s;
              (s = (a ^ o.permute(c)) >>> 0), (a = d);
            }
            o.rip(s, a, i, n);
          });
      },
      {
        "./cipher": 74,
        "./utils": 77,
        inherits: 132,
        "minimalistic-assert": 136,
      },
    ],
    76: [
      function (t, e, r) {
        "use strict";
        var i = t("minimalistic-assert"),
          n = t("inherits"),
          o = t("./cipher"),
          s = t("./des");
        function a(t, e) {
          i.equal(e.length, 24, "Invalid key length");
          var r = e.slice(0, 8),
            n = e.slice(8, 16),
            o = e.slice(16, 24);
          this.ciphers =
            "encrypt" === t
              ? [
                  s.create({ type: "encrypt", key: r }),
                  s.create({ type: "decrypt", key: n }),
                  s.create({ type: "encrypt", key: o }),
                ]
              : [
                  s.create({ type: "decrypt", key: o }),
                  s.create({ type: "encrypt", key: n }),
                  s.create({ type: "decrypt", key: r }),
                ];
        }
        function f(t) {
          o.call(this, t);
          var e = new a(this.type, this.options.key);
          this._edeState = e;
        }
        n(f, o),
          (e.exports = f),
          (f.create = function (t) {
            return new f(t);
          }),
          (f.prototype._update = function (t, e, r, i) {
            var n = this._edeState;
            n.ciphers[0]._update(t, e, r, i),
              n.ciphers[1]._update(r, i, r, i),
              n.ciphers[2]._update(r, i, r, i);
          }),
          (f.prototype._pad = s.prototype._pad),
          (f.prototype._unpad = s.prototype._unpad);
      },
      {
        "./cipher": 74,
        "./des": 75,
        inherits: 132,
        "minimalistic-assert": 136,
      },
    ],
    77: [
      function (t, e, r) {
        "use strict";
        (r.readUInt32BE = function (t, e) {
          return (
            ((t[0 + e] << 24) |
              (t[1 + e] << 16) |
              (t[2 + e] << 8) |
              t[3 + e]) >>>
            0
          );
        }),
          (r.writeUInt32BE = function (t, e, r) {
            (t[0 + r] = e >>> 24),
              (t[1 + r] = (e >>> 16) & 255),
              (t[2 + r] = (e >>> 8) & 255),
              (t[3 + r] = 255 & e);
          }),
          (r.ip = function (t, e, r, i) {
            for (var n = 0, o = 0, s = 6; s >= 0; s -= 2) {
              for (var a = 0; a <= 24; a += 8)
                (n <<= 1), (n |= (e >>> (a + s)) & 1);
              for (a = 0; a <= 24; a += 8)
                (n <<= 1), (n |= (t >>> (a + s)) & 1);
            }
            for (s = 6; s >= 0; s -= 2) {
              for (a = 1; a <= 25; a += 8)
                (o <<= 1), (o |= (e >>> (a + s)) & 1);
              for (a = 1; a <= 25; a += 8)
                (o <<= 1), (o |= (t >>> (a + s)) & 1);
            }
            (r[i + 0] = n >>> 0), (r[i + 1] = o >>> 0);
          }),
          (r.rip = function (t, e, r, i) {
            for (var n = 0, o = 0, s = 0; s < 4; s++)
              for (var a = 24; a >= 0; a -= 8)
                (n <<= 1),
                  (n |= (e >>> (a + s)) & 1),
                  (n <<= 1),
                  (n |= (t >>> (a + s)) & 1);
            for (s = 4; s < 8; s++)
              for (a = 24; a >= 0; a -= 8)
                (o <<= 1),
                  (o |= (e >>> (a + s)) & 1),
                  (o <<= 1),
                  (o |= (t >>> (a + s)) & 1);
            (r[i + 0] = n >>> 0), (r[i + 1] = o >>> 0);
          }),
          (r.pc1 = function (t, e, r, i) {
            for (var n = 0, o = 0, s = 7; s >= 5; s--) {
              for (var a = 0; a <= 24; a += 8)
                (n <<= 1), (n |= (e >> (a + s)) & 1);
              for (a = 0; a <= 24; a += 8) (n <<= 1), (n |= (t >> (a + s)) & 1);
            }
            for (a = 0; a <= 24; a += 8) (n <<= 1), (n |= (e >> (a + s)) & 1);
            for (s = 1; s <= 3; s++) {
              for (a = 0; a <= 24; a += 8) (o <<= 1), (o |= (e >> (a + s)) & 1);
              for (a = 0; a <= 24; a += 8) (o <<= 1), (o |= (t >> (a + s)) & 1);
            }
            for (a = 0; a <= 24; a += 8) (o <<= 1), (o |= (t >> (a + s)) & 1);
            (r[i + 0] = n >>> 0), (r[i + 1] = o >>> 0);
          }),
          (r.r28shl = function (t, e) {
            return ((t << e) & 268435455) | (t >>> (28 - e));
          });
        var i = [
          14, 11, 17, 4, 27, 23, 25, 0, 13, 22, 7, 18, 5, 9, 16, 24, 2, 20, 12,
          21, 1, 8, 15, 26, 15, 4, 25, 19, 9, 1, 26, 16, 5, 11, 23, 8, 12, 7,
          17, 0, 22, 3, 10, 14, 6, 20, 27, 24,
        ];
        (r.pc2 = function (t, e, r, n) {
          for (var o = 0, s = 0, a = i.length >>> 1, f = 0; f < a; f++)
            (o <<= 1), (o |= (t >>> i[f]) & 1);
          for (f = a; f < i.length; f++) (s <<= 1), (s |= (e >>> i[f]) & 1);
          (r[n + 0] = o >>> 0), (r[n + 1] = s >>> 0);
        }),
          (r.expand = function (t, e, r) {
            var i = 0,
              n = 0;
            i = ((1 & t) << 5) | (t >>> 27);
            for (var o = 23; o >= 15; o -= 4) (i <<= 6), (i |= (t >>> o) & 63);
            for (o = 11; o >= 3; o -= 4) (n |= (t >>> o) & 63), (n <<= 6);
            (n |= ((31 & t) << 1) | (t >>> 31)),
              (e[r + 0] = i >>> 0),
              (e[r + 1] = n >>> 0);
          });
        var n = [
          14, 0, 4, 15, 13, 7, 1, 4, 2, 14, 15, 2, 11, 13, 8, 1, 3, 10, 10, 6,
          6, 12, 12, 11, 5, 9, 9, 5, 0, 3, 7, 8, 4, 15, 1, 12, 14, 8, 8, 2, 13,
          4, 6, 9, 2, 1, 11, 7, 15, 5, 12, 11, 9, 3, 7, 14, 3, 10, 10, 0, 5, 6,
          0, 13, 15, 3, 1, 13, 8, 4, 14, 7, 6, 15, 11, 2, 3, 8, 4, 14, 9, 12, 7,
          0, 2, 1, 13, 10, 12, 6, 0, 9, 5, 11, 10, 5, 0, 13, 14, 8, 7, 10, 11,
          1, 10, 3, 4, 15, 13, 4, 1, 2, 5, 11, 8, 6, 12, 7, 6, 12, 9, 0, 3, 5,
          2, 14, 15, 9, 10, 13, 0, 7, 9, 0, 14, 9, 6, 3, 3, 4, 15, 6, 5, 10, 1,
          2, 13, 8, 12, 5, 7, 14, 11, 12, 4, 11, 2, 15, 8, 1, 13, 1, 6, 10, 4,
          13, 9, 0, 8, 6, 15, 9, 3, 8, 0, 7, 11, 4, 1, 15, 2, 14, 12, 3, 5, 11,
          10, 5, 14, 2, 7, 12, 7, 13, 13, 8, 14, 11, 3, 5, 0, 6, 6, 15, 9, 0,
          10, 3, 1, 4, 2, 7, 8, 2, 5, 12, 11, 1, 12, 10, 4, 14, 15, 9, 10, 3, 6,
          15, 9, 0, 0, 6, 12, 10, 11, 1, 7, 13, 13, 8, 15, 9, 1, 4, 3, 5, 14,
          11, 5, 12, 2, 7, 8, 2, 4, 14, 2, 14, 12, 11, 4, 2, 1, 12, 7, 4, 10, 7,
          11, 13, 6, 1, 8, 5, 5, 0, 3, 15, 15, 10, 13, 3, 0, 9, 14, 8, 9, 6, 4,
          11, 2, 8, 1, 12, 11, 7, 10, 1, 13, 14, 7, 2, 8, 13, 15, 6, 9, 15, 12,
          0, 5, 9, 6, 10, 3, 4, 0, 5, 14, 3, 12, 10, 1, 15, 10, 4, 15, 2, 9, 7,
          2, 12, 6, 9, 8, 5, 0, 6, 13, 1, 3, 13, 4, 14, 14, 0, 7, 11, 5, 3, 11,
          8, 9, 4, 14, 3, 15, 2, 5, 12, 2, 9, 8, 5, 12, 15, 3, 10, 7, 11, 0, 14,
          4, 1, 10, 7, 1, 6, 13, 0, 11, 8, 6, 13, 4, 13, 11, 0, 2, 11, 14, 7,
          15, 4, 0, 9, 8, 1, 13, 10, 3, 14, 12, 3, 9, 5, 7, 12, 5, 2, 10, 15, 6,
          8, 1, 6, 1, 6, 4, 11, 11, 13, 13, 8, 12, 1, 3, 4, 7, 10, 14, 7, 10, 9,
          15, 5, 6, 0, 8, 15, 0, 14, 5, 2, 9, 3, 2, 12, 13, 1, 2, 15, 8, 13, 4,
          8, 6, 10, 15, 3, 11, 7, 1, 4, 10, 12, 9, 5, 3, 6, 14, 11, 5, 0, 0, 14,
          12, 9, 7, 2, 7, 2, 11, 1, 4, 14, 1, 7, 9, 4, 12, 10, 14, 8, 2, 13, 0,
          15, 6, 12, 10, 9, 13, 0, 15, 3, 3, 5, 5, 6, 8, 11,
        ];
        r.substitute = function (t, e) {
          for (var r = 0, i = 0; i < 4; i++) {
            (r <<= 4), (r |= n[64 * i + ((t >>> (18 - 6 * i)) & 63)]);
          }
          for (i = 0; i < 4; i++) {
            (r <<= 4), (r |= n[256 + 64 * i + ((e >>> (18 - 6 * i)) & 63)]);
          }
          return r >>> 0;
        };
        var o = [
          16, 25, 12, 11, 3, 20, 4, 15, 31, 17, 9, 6, 27, 14, 1, 22, 30, 24, 8,
          18, 0, 5, 29, 23, 13, 19, 2, 26, 10, 21, 28, 7,
        ];
        (r.permute = function (t) {
          for (var e = 0, r = 0; r < o.length; r++)
            (e <<= 1), (e |= (t >>> o[r]) & 1);
          return e >>> 0;
        }),
          (r.padSplit = function (t, e, r) {
            for (var i = t.toString(2); i.length < e; ) i = "0" + i;
            for (var n = [], o = 0; o < e; o += r) n.push(i.slice(o, o + r));
            return n.join(" ");
          });
      },
      {},
    ],
    78: [
      function (t, e, r) {
        (function (e) {
          (function () {
            var i = t("./lib/generatePrime"),
              n = t("./lib/primes.json"),
              o = t("./lib/dh");
            var s = { binary: !0, hex: !0, base64: !0 };
            (r.DiffieHellmanGroup =
              r.createDiffieHellmanGroup =
              r.getDiffieHellman =
                function (t) {
                  var r = new e(n[t].prime, "hex"),
                    i = new e(n[t].gen, "hex");
                  return new o(r, i);
                }),
              (r.createDiffieHellman = r.DiffieHellman =
                function t(r, n, a, f) {
                  return e.isBuffer(n) || void 0 === s[n]
                    ? t(r, "binary", n, a)
                    : ((n = n || "binary"),
                      (f = f || "binary"),
                      (a = a || new e([2])),
                      e.isBuffer(a) || (a = new e(a, f)),
                      "number" == typeof r
                        ? new o(i(r, a), a, !0)
                        : (e.isBuffer(r) || (r = new e(r, n)),
                          new o(r, a, !0)));
                });
          }).call(this);
        }).call(this, t("buffer").Buffer);
      },
      {
        "./lib/dh": 79,
        "./lib/generatePrime": 80,
        "./lib/primes.json": 81,
        buffer: 63,
      },
    ],
    79: [
      function (t, e, r) {
        (function (r) {
          (function () {
            var i = t("bn.js"),
              n = new (t("miller-rabin"))(),
              o = new i(24),
              s = new i(11),
              a = new i(10),
              f = new i(3),
              h = new i(7),
              u = t("./generatePrime"),
              c = t("randombytes");
            function d(t, e) {
              return (
                (e = e || "utf8"),
                r.isBuffer(t) || (t = new r(t, e)),
                (this._pub = new i(t)),
                this
              );
            }
            function l(t, e) {
              return (
                (e = e || "utf8"),
                r.isBuffer(t) || (t = new r(t, e)),
                (this._priv = new i(t)),
                this
              );
            }
            e.exports = b;
            var p = {};
            function b(t, e, r) {
              this.setGenerator(e),
                (this.__prime = new i(t)),
                (this._prime = i.mont(this.__prime)),
                (this._primeLen = t.length),
                (this._pub = void 0),
                (this._priv = void 0),
                (this._primeCode = void 0),
                r
                  ? ((this.setPublicKey = d), (this.setPrivateKey = l))
                  : (this._primeCode = 8);
            }
            function m(t, e) {
              var i = new r(t.toArray());
              return e ? i.toString(e) : i;
            }
            Object.defineProperty(b.prototype, "verifyError", {
              enumerable: !0,
              get: function () {
                return (
                  "number" != typeof this._primeCode &&
                    (this._primeCode = (function (t, e) {
                      var r = e.toString("hex"),
                        i = [r, t.toString(16)].join("_");
                      if (i in p) return p[i];
                      var c,
                        d = 0;
                      if (
                        t.isEven() ||
                        !u.simpleSieve ||
                        !u.fermatTest(t) ||
                        !n.test(t)
                      )
                        return (
                          (d += 1),
                          (d += "02" === r || "05" === r ? 8 : 4),
                          (p[i] = d),
                          d
                        );
                      switch ((n.test(t.shrn(1)) || (d += 2), r)) {
                        case "02":
                          t.mod(o).cmp(s) && (d += 8);
                          break;
                        case "05":
                          (c = t.mod(a)).cmp(f) && c.cmp(h) && (d += 8);
                          break;
                        default:
                          d += 4;
                      }
                      return (p[i] = d), d;
                    })(this.__prime, this.__gen)),
                  this._primeCode
                );
              },
            }),
              (b.prototype.generateKeys = function () {
                return (
                  this._priv || (this._priv = new i(c(this._primeLen))),
                  (this._pub = this._gen
                    .toRed(this._prime)
                    .redPow(this._priv)
                    .fromRed()),
                  this.getPublicKey()
                );
              }),
              (b.prototype.computeSecret = function (t) {
                var e = (t = (t = new i(t)).toRed(this._prime))
                    .redPow(this._priv)
                    .fromRed(),
                  n = new r(e.toArray()),
                  o = this.getPrime();
                if (n.length < o.length) {
                  var s = new r(o.length - n.length);
                  s.fill(0), (n = r.concat([s, n]));
                }
                return n;
              }),
              (b.prototype.getPublicKey = function (t) {
                return m(this._pub, t);
              }),
              (b.prototype.getPrivateKey = function (t) {
                return m(this._priv, t);
              }),
              (b.prototype.getPrime = function (t) {
                return m(this.__prime, t);
              }),
              (b.prototype.getGenerator = function (t) {
                return m(this._gen, t);
              }),
              (b.prototype.setGenerator = function (t, e) {
                return (
                  (e = e || "utf8"),
                  r.isBuffer(t) || (t = new r(t, e)),
                  (this.__gen = t),
                  (this._gen = new i(t)),
                  this
                );
              });
          }).call(this);
        }).call(this, t("buffer").Buffer);
      },
      {
        "./generatePrime": 80,
        "bn.js": 82,
        buffer: 63,
        "miller-rabin": 134,
        randombytes: 157,
      },
    ],
    80: [
      function (t, e, r) {
        var i = t("randombytes");
        (e.exports = g), (g.simpleSieve = m), (g.fermatTest = y);
        var n = t("bn.js"),
          o = new n(24),
          s = new (t("miller-rabin"))(),
          a = new n(1),
          f = new n(2),
          h = new n(5),
          u = (new n(16), new n(8), new n(10)),
          c = new n(3),
          d = (new n(7), new n(11)),
          l = new n(4),
          p = (new n(12), null);
        function b() {
          if (null !== p) return p;
          var t = [];
          t[0] = 2;
          for (var e = 1, r = 3; r < 1048576; r += 2) {
            for (
              var i = Math.ceil(Math.sqrt(r)), n = 0;
              n < e && t[n] <= i && r % t[n] != 0;
              n++
            );
            (e !== n && t[n] <= i) || (t[e++] = r);
          }
          return (p = t), t;
        }
        function m(t) {
          for (var e = b(), r = 0; r < e.length; r++)
            if (0 === t.modn(e[r])) return 0 === t.cmpn(e[r]);
          return !0;
        }
        function y(t) {
          var e = n.mont(t);
          return 0 === f.toRed(e).redPow(t.subn(1)).fromRed().cmpn(1);
        }
        function g(t, e) {
          if (t < 16) return new n(2 === e || 5 === e ? [140, 123] : [140, 39]);
          var r, p;
          for (e = new n(e); ; ) {
            for (r = new n(i(Math.ceil(t / 8))); r.bitLength() > t; )
              r.ishrn(1);
            if ((r.isEven() && r.iadd(a), r.testn(1) || r.iadd(f), e.cmp(f))) {
              if (!e.cmp(h)) for (; r.mod(u).cmp(c); ) r.iadd(l);
            } else for (; r.mod(o).cmp(d); ) r.iadd(l);
            if (
              m((p = r.shrn(1))) &&
              m(r) &&
              y(p) &&
              y(r) &&
              s.test(p) &&
              s.test(r)
            )
              return r;
          }
        }
      },
      { "bn.js": 82, "miller-rabin": 134, randombytes: 157 },
    ],
    81: [
      function (t, e, r) {
        e.exports = {
          modp1: {
            gen: "02",
            prime:
              "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a63a3620ffffffffffffffff",
          },
          modp2: {
            gen: "02",
            prime:
              "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece65381ffffffffffffffff",
          },
          modp5: {
            gen: "02",
            prime:
              "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca237327ffffffffffffffff",
          },
          modp14: {
            gen: "02",
            prime:
              "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aacaa68ffffffffffffffff",
          },
          modp15: {
            gen: "02",
            prime:
              "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a93ad2caffffffffffffffff",
          },
          modp16: {
            gen: "02",
            prime:
              "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c934063199ffffffffffffffff",
          },
          modp17: {
            gen: "02",
            prime:
              "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dcc4024ffffffffffffffff",
          },
          modp18: {
            gen: "02",
            prime:
              "ffffffffffffffffc90fdaa22168c234c4c6628b80dc1cd129024e088a67cc74020bbea63b139b22514a08798e3404ddef9519b3cd3a431b302b0a6df25f14374fe1356d6d51c245e485b576625e7ec6f44c42e9a637ed6b0bff5cb6f406b7edee386bfb5a899fa5ae9f24117c4b1fe649286651ece45b3dc2007cb8a163bf0598da48361c55d39a69163fa8fd24cf5f83655d23dca3ad961c62f356208552bb9ed529077096966d670c354e4abc9804f1746c08ca18217c32905e462e36ce3be39e772c180e86039b2783a2ec07a28fb5c55df06f4c52c9de2bcbf6955817183995497cea956ae515d2261898fa051015728e5a8aaac42dad33170d04507a33a85521abdf1cba64ecfb850458dbef0a8aea71575d060c7db3970f85a6e1e4c7abf5ae8cdb0933d71e8c94e04a25619dcee3d2261ad2ee6bf12ffa06d98a0864d87602733ec86a64521f2b18177b200cbbe117577a615d6c770988c0bad946e208e24fa074e5ab3143db5bfce0fd108e4b82d120a92108011a723c12a787e6d788719a10bdba5b2699c327186af4e23c1a946834b6150bda2583e9ca2ad44ce8dbbbc2db04de8ef92e8efc141fbecaa6287c59474e6bc05d99b2964fa090c3a2233ba186515be7ed1f612970cee2d7afb81bdd762170481cd0069127d5b05aa993b4ea988d8fddc186ffb7dc90a6c08f4df435c93402849236c3fab4d27c7026c1d4dcb2602646dec9751e763dba37bdf8ff9406ad9e530ee5db382f413001aeb06a53ed9027d831179727b0865a8918da3edbebcf9b14ed44ce6cbaced4bb1bdb7f1447e6cc254b332051512bd7af426fb8f401378cd2bf5983ca01c64b92ecf032ea15d1721d03f482d7ce6e74fef6d55e702f46980c82b5a84031900b1c9e59e7c97fbec7e8f323a97a7e36cc88be0f1d45b7ff585ac54bd407b22b4154aacc8f6d7ebf48e1d814cc5ed20f8037e0a79715eef29be32806a1d58bb7c5da76f550aa3d8a1fbff0eb19ccb1a313d55cda56c9ec2ef29632387fe8d76e3c0468043e8f663f4860ee12bf2d5b0b7474d6e694f91e6dbe115974a3926f12fee5e438777cb6a932df8cd8bec4d073b931ba3bc832b68d9dd300741fa7bf8afc47ed2576f6936ba424663aab639c5ae4f5683423b4742bf1c978238f16cbe39d652de3fdb8befc848ad922222e04a4037c0713eb57a81a23f0c73473fc646cea306b4bcbc8862f8385ddfa9d4b7fa2c087e879683303ed5bdd3a062b3cf5b3a278a66d2a13f83f44f82ddf310ee074ab6a364597e899a0255dc164f31cc50846851df9ab48195ded7ea1b1d510bd7ee74d73faf36bc31ecfa268359046f4eb879f924009438b481c6cd7889a002ed5ee382bc9190da6fc026e479558e4475677e9aa9e3050e2765694dfc81f56e880b96e7160c980dd98edd3dfffffffffffffffff",
          },
        };
      },
      {},
    ],
    82: [
      function (t, e, r) {
        arguments[4][15][0].apply(r, arguments);
      },
      { buffer: 19, dup: 15 },
    ],
    83: [
      function (t, e, r) {
        "use strict";
        var i = r;
        (i.version = t("../package.json").version),
          (i.utils = t("./elliptic/utils")),
          (i.rand = t("brorand")),
          (i.curve = t("./elliptic/curve")),
          (i.curves = t("./elliptic/curves")),
          (i.ec = t("./elliptic/ec")),
          (i.eddsa = t("./elliptic/eddsa"));
      },
      {
        "../package.json": 99,
        "./elliptic/curve": 86,
        "./elliptic/curves": 89,
        "./elliptic/ec": 90,
        "./elliptic/eddsa": 93,
        "./elliptic/utils": 97,
        brorand: 18,
      },
    ],
    84: [
      function (t, e, r) {
        "use strict";
        var i = t("bn.js"),
          n = t("../utils"),
          o = n.getNAF,
          s = n.getJSF,
          a = n.assert;
        function f(t, e) {
          (this.type = t),
            (this.p = new i(e.p, 16)),
            (this.red = e.prime ? i.red(e.prime) : i.mont(this.p)),
            (this.zero = new i(0).toRed(this.red)),
            (this.one = new i(1).toRed(this.red)),
            (this.two = new i(2).toRed(this.red)),
            (this.n = e.n && new i(e.n, 16)),
            (this.g = e.g && this.pointFromJSON(e.g, e.gRed)),
            (this._wnafT1 = new Array(4)),
            (this._wnafT2 = new Array(4)),
            (this._wnafT3 = new Array(4)),
            (this._wnafT4 = new Array(4)),
            (this._bitLength = this.n ? this.n.bitLength() : 0);
          var r = this.n && this.p.div(this.n);
          !r || r.cmpn(100) > 0
            ? (this.redN = null)
            : ((this._maxwellTrick = !0), (this.redN = this.n.toRed(this.red)));
        }
        function h(t, e) {
          (this.curve = t), (this.type = e), (this.precomputed = null);
        }
        (e.exports = f),
          (f.prototype.point = function () {
            throw new Error("Not implemented");
          }),
          (f.prototype.validate = function () {
            throw new Error("Not implemented");
          }),
          (f.prototype._fixedNafMul = function (t, e) {
            a(t.precomputed);
            var r = t._getDoubles(),
              i = o(e, 1, this._bitLength),
              n = (1 << (r.step + 1)) - (r.step % 2 == 0 ? 2 : 1);
            n /= 3;
            var s,
              f,
              h = [];
            for (s = 0; s < i.length; s += r.step) {
              f = 0;
              for (var u = s + r.step - 1; u >= s; u--) f = (f << 1) + i[u];
              h.push(f);
            }
            for (
              var c = this.jpoint(null, null, null),
                d = this.jpoint(null, null, null),
                l = n;
              l > 0;
              l--
            ) {
              for (s = 0; s < h.length; s++)
                (f = h[s]) === l
                  ? (d = d.mixedAdd(r.points[s]))
                  : f === -l && (d = d.mixedAdd(r.points[s].neg()));
              c = c.add(d);
            }
            return c.toP();
          }),
          (f.prototype._wnafMul = function (t, e) {
            var r = 4,
              i = t._getNAFPoints(r);
            r = i.wnd;
            for (
              var n = i.points,
                s = o(e, r, this._bitLength),
                f = this.jpoint(null, null, null),
                h = s.length - 1;
              h >= 0;
              h--
            ) {
              for (var u = 0; h >= 0 && 0 === s[h]; h--) u++;
              if ((h >= 0 && u++, (f = f.dblp(u)), h < 0)) break;
              var c = s[h];
              a(0 !== c),
                (f =
                  "affine" === t.type
                    ? c > 0
                      ? f.mixedAdd(n[(c - 1) >> 1])
                      : f.mixedAdd(n[(-c - 1) >> 1].neg())
                    : c > 0
                    ? f.add(n[(c - 1) >> 1])
                    : f.add(n[(-c - 1) >> 1].neg()));
            }
            return "affine" === t.type ? f.toP() : f;
          }),
          (f.prototype._wnafMulAdd = function (t, e, r, i, n) {
            var a,
              f,
              h,
              u = this._wnafT1,
              c = this._wnafT2,
              d = this._wnafT3,
              l = 0;
            for (a = 0; a < i; a++) {
              var p = (h = e[a])._getNAFPoints(t);
              (u[a] = p.wnd), (c[a] = p.points);
            }
            for (a = i - 1; a >= 1; a -= 2) {
              var b = a - 1,
                m = a;
              if (1 === u[b] && 1 === u[m]) {
                var y = [e[b], null, null, e[m]];
                0 === e[b].y.cmp(e[m].y)
                  ? ((y[1] = e[b].add(e[m])),
                    (y[2] = e[b].toJ().mixedAdd(e[m].neg())))
                  : 0 === e[b].y.cmp(e[m].y.redNeg())
                  ? ((y[1] = e[b].toJ().mixedAdd(e[m])),
                    (y[2] = e[b].add(e[m].neg())))
                  : ((y[1] = e[b].toJ().mixedAdd(e[m])),
                    (y[2] = e[b].toJ().mixedAdd(e[m].neg())));
                var g = [-3, -1, -5, -7, 0, 7, 5, 1, 3],
                  v = s(r[b], r[m]);
                for (
                  l = Math.max(v[0].length, l),
                    d[b] = new Array(l),
                    d[m] = new Array(l),
                    f = 0;
                  f < l;
                  f++
                ) {
                  var w = 0 | v[0][f],
                    _ = 0 | v[1][f];
                  (d[b][f] = g[3 * (w + 1) + (_ + 1)]),
                    (d[m][f] = 0),
                    (c[b] = y);
                }
              } else
                (d[b] = o(r[b], u[b], this._bitLength)),
                  (d[m] = o(r[m], u[m], this._bitLength)),
                  (l = Math.max(d[b].length, l)),
                  (l = Math.max(d[m].length, l));
            }
            var M = this.jpoint(null, null, null),
              S = this._wnafT4;
            for (a = l; a >= 0; a--) {
              for (var E = 0; a >= 0; ) {
                var A = !0;
                for (f = 0; f < i; f++)
                  (S[f] = 0 | d[f][a]), 0 !== S[f] && (A = !1);
                if (!A) break;
                E++, a--;
              }
              if ((a >= 0 && E++, (M = M.dblp(E)), a < 0)) break;
              for (f = 0; f < i; f++) {
                var k = S[f];
                0 !== k &&
                  (k > 0
                    ? (h = c[f][(k - 1) >> 1])
                    : k < 0 && (h = c[f][(-k - 1) >> 1].neg()),
                  (M = "affine" === h.type ? M.mixedAdd(h) : M.add(h)));
              }
            }
            for (a = 0; a < i; a++) c[a] = null;
            return n ? M : M.toP();
          }),
          (f.BasePoint = h),
          (h.prototype.eq = function () {
            throw new Error("Not implemented");
          }),
          (h.prototype.validate = function () {
            return this.curve.validate(this);
          }),
          (f.prototype.decodePoint = function (t, e) {
            t = n.toArray(t, e);
            var r = this.p.byteLength();
            if (
              (4 === t[0] || 6 === t[0] || 7 === t[0]) &&
              t.length - 1 == 2 * r
            )
              return (
                6 === t[0]
                  ? a(t[t.length - 1] % 2 == 0)
                  : 7 === t[0] && a(t[t.length - 1] % 2 == 1),
                this.point(t.slice(1, 1 + r), t.slice(1 + r, 1 + 2 * r))
              );
            if ((2 === t[0] || 3 === t[0]) && t.length - 1 === r)
              return this.pointFromX(t.slice(1, 1 + r), 3 === t[0]);
            throw new Error("Unknown point format");
          }),
          (h.prototype.encodeCompressed = function (t) {
            return this.encode(t, !0);
          }),
          (h.prototype._encode = function (t) {
            var e = this.curve.p.byteLength(),
              r = this.getX().toArray("be", e);
            return t
              ? [this.getY().isEven() ? 2 : 3].concat(r)
              : [4].concat(r, this.getY().toArray("be", e));
          }),
          (h.prototype.encode = function (t, e) {
            return n.encode(this._encode(e), t);
          }),
          (h.prototype.precompute = function (t) {
            if (this.precomputed) return this;
            var e = { doubles: null, naf: null, beta: null };
            return (
              (e.naf = this._getNAFPoints(8)),
              (e.doubles = this._getDoubles(4, t)),
              (e.beta = this._getBeta()),
              (this.precomputed = e),
              this
            );
          }),
          (h.prototype._hasDoubles = function (t) {
            if (!this.precomputed) return !1;
            var e = this.precomputed.doubles;
            return (
              !!e && e.points.length >= Math.ceil((t.bitLength() + 1) / e.step)
            );
          }),
          (h.prototype._getDoubles = function (t, e) {
            if (this.precomputed && this.precomputed.doubles)
              return this.precomputed.doubles;
            for (var r = [this], i = this, n = 0; n < e; n += t) {
              for (var o = 0; o < t; o++) i = i.dbl();
              r.push(i);
            }
            return { step: t, points: r };
          }),
          (h.prototype._getNAFPoints = function (t) {
            if (this.precomputed && this.precomputed.naf)
              return this.precomputed.naf;
            for (
              var e = [this],
                r = (1 << t) - 1,
                i = 1 === r ? null : this.dbl(),
                n = 1;
              n < r;
              n++
            )
              e[n] = e[n - 1].add(i);
            return { wnd: t, points: e };
          }),
          (h.prototype._getBeta = function () {
            return null;
          }),
          (h.prototype.dblp = function (t) {
            for (var e = this, r = 0; r < t; r++) e = e.dbl();
            return e;
          });
      },
      { "../utils": 97, "bn.js": 98 },
    ],
    85: [
      function (t, e, r) {
        "use strict";
        var i = t("../utils"),
          n = t("bn.js"),
          o = t("inherits"),
          s = t("./base"),
          a = i.assert;
        function f(t) {
          (this.twisted = 1 != (0 | t.a)),
            (this.mOneA = this.twisted && -1 == (0 | t.a)),
            (this.extended = this.mOneA),
            s.call(this, "edwards", t),
            (this.a = new n(t.a, 16).umod(this.red.m)),
            (this.a = this.a.toRed(this.red)),
            (this.c = new n(t.c, 16).toRed(this.red)),
            (this.c2 = this.c.redSqr()),
            (this.d = new n(t.d, 16).toRed(this.red)),
            (this.dd = this.d.redAdd(this.d)),
            a(!this.twisted || 0 === this.c.fromRed().cmpn(1)),
            (this.oneC = 1 == (0 | t.c));
        }
        function h(t, e, r, i, o) {
          s.BasePoint.call(this, t, "projective"),
            null === e && null === r && null === i
              ? ((this.x = this.curve.zero),
                (this.y = this.curve.one),
                (this.z = this.curve.one),
                (this.t = this.curve.zero),
                (this.zOne = !0))
              : ((this.x = new n(e, 16)),
                (this.y = new n(r, 16)),
                (this.z = i ? new n(i, 16) : this.curve.one),
                (this.t = o && new n(o, 16)),
                this.x.red || (this.x = this.x.toRed(this.curve.red)),
                this.y.red || (this.y = this.y.toRed(this.curve.red)),
                this.z.red || (this.z = this.z.toRed(this.curve.red)),
                this.t &&
                  !this.t.red &&
                  (this.t = this.t.toRed(this.curve.red)),
                (this.zOne = this.z === this.curve.one),
                this.curve.extended &&
                  !this.t &&
                  ((this.t = this.x.redMul(this.y)),
                  this.zOne || (this.t = this.t.redMul(this.z.redInvm()))));
        }
        o(f, s),
          (e.exports = f),
          (f.prototype._mulA = function (t) {
            return this.mOneA ? t.redNeg() : this.a.redMul(t);
          }),
          (f.prototype._mulC = function (t) {
            return this.oneC ? t : this.c.redMul(t);
          }),
          (f.prototype.jpoint = function (t, e, r, i) {
            return this.point(t, e, r, i);
          }),
          (f.prototype.pointFromX = function (t, e) {
            (t = new n(t, 16)).red || (t = t.toRed(this.red));
            var r = t.redSqr(),
              i = this.c2.redSub(this.a.redMul(r)),
              o = this.one.redSub(this.c2.redMul(this.d).redMul(r)),
              s = i.redMul(o.redInvm()),
              a = s.redSqrt();
            if (0 !== a.redSqr().redSub(s).cmp(this.zero))
              throw new Error("invalid point");
            var f = a.fromRed().isOdd();
            return (
              ((e && !f) || (!e && f)) && (a = a.redNeg()), this.point(t, a)
            );
          }),
          (f.prototype.pointFromY = function (t, e) {
            (t = new n(t, 16)).red || (t = t.toRed(this.red));
            var r = t.redSqr(),
              i = r.redSub(this.c2),
              o = r.redMul(this.d).redMul(this.c2).redSub(this.a),
              s = i.redMul(o.redInvm());
            if (0 === s.cmp(this.zero)) {
              if (e) throw new Error("invalid point");
              return this.point(this.zero, t);
            }
            var a = s.redSqrt();
            if (0 !== a.redSqr().redSub(s).cmp(this.zero))
              throw new Error("invalid point");
            return (
              a.fromRed().isOdd() !== e && (a = a.redNeg()), this.point(a, t)
            );
          }),
          (f.prototype.validate = function (t) {
            if (t.isInfinity()) return !0;
            t.normalize();
            var e = t.x.redSqr(),
              r = t.y.redSqr(),
              i = e.redMul(this.a).redAdd(r),
              n = this.c2.redMul(this.one.redAdd(this.d.redMul(e).redMul(r)));
            return 0 === i.cmp(n);
          }),
          o(h, s.BasePoint),
          (f.prototype.pointFromJSON = function (t) {
            return h.fromJSON(this, t);
          }),
          (f.prototype.point = function (t, e, r, i) {
            return new h(this, t, e, r, i);
          }),
          (h.fromJSON = function (t, e) {
            return new h(t, e[0], e[1], e[2]);
          }),
          (h.prototype.inspect = function () {
            return this.isInfinity()
              ? "<EC Point Infinity>"
              : "<EC Point x: " +
                  this.x.fromRed().toString(16, 2) +
                  " y: " +
                  this.y.fromRed().toString(16, 2) +
                  " z: " +
                  this.z.fromRed().toString(16, 2) +
                  ">";
          }),
          (h.prototype.isInfinity = function () {
            return (
              0 === this.x.cmpn(0) &&
              (0 === this.y.cmp(this.z) ||
                (this.zOne && 0 === this.y.cmp(this.curve.c)))
            );
          }),
          (h.prototype._extDbl = function () {
            var t = this.x.redSqr(),
              e = this.y.redSqr(),
              r = this.z.redSqr();
            r = r.redIAdd(r);
            var i = this.curve._mulA(t),
              n = this.x.redAdd(this.y).redSqr().redISub(t).redISub(e),
              o = i.redAdd(e),
              s = o.redSub(r),
              a = i.redSub(e),
              f = n.redMul(s),
              h = o.redMul(a),
              u = n.redMul(a),
              c = s.redMul(o);
            return this.curve.point(f, h, c, u);
          }),
          (h.prototype._projDbl = function () {
            var t,
              e,
              r,
              i,
              n,
              o,
              s = this.x.redAdd(this.y).redSqr(),
              a = this.x.redSqr(),
              f = this.y.redSqr();
            if (this.curve.twisted) {
              var h = (i = this.curve._mulA(a)).redAdd(f);
              this.zOne
                ? ((t = s.redSub(a).redSub(f).redMul(h.redSub(this.curve.two))),
                  (e = h.redMul(i.redSub(f))),
                  (r = h.redSqr().redSub(h).redSub(h)))
                : ((n = this.z.redSqr()),
                  (o = h.redSub(n).redISub(n)),
                  (t = s.redSub(a).redISub(f).redMul(o)),
                  (e = h.redMul(i.redSub(f))),
                  (r = h.redMul(o)));
            } else
              (i = a.redAdd(f)),
                (n = this.curve._mulC(this.z).redSqr()),
                (o = i.redSub(n).redSub(n)),
                (t = this.curve._mulC(s.redISub(i)).redMul(o)),
                (e = this.curve._mulC(i).redMul(a.redISub(f))),
                (r = i.redMul(o));
            return this.curve.point(t, e, r);
          }),
          (h.prototype.dbl = function () {
            return this.isInfinity()
              ? this
              : this.curve.extended
              ? this._extDbl()
              : this._projDbl();
          }),
          (h.prototype._extAdd = function (t) {
            var e = this.y.redSub(this.x).redMul(t.y.redSub(t.x)),
              r = this.y.redAdd(this.x).redMul(t.y.redAdd(t.x)),
              i = this.t.redMul(this.curve.dd).redMul(t.t),
              n = this.z.redMul(t.z.redAdd(t.z)),
              o = r.redSub(e),
              s = n.redSub(i),
              a = n.redAdd(i),
              f = r.redAdd(e),
              h = o.redMul(s),
              u = a.redMul(f),
              c = o.redMul(f),
              d = s.redMul(a);
            return this.curve.point(h, u, d, c);
          }),
          (h.prototype._projAdd = function (t) {
            var e,
              r,
              i = this.z.redMul(t.z),
              n = i.redSqr(),
              o = this.x.redMul(t.x),
              s = this.y.redMul(t.y),
              a = this.curve.d.redMul(o).redMul(s),
              f = n.redSub(a),
              h = n.redAdd(a),
              u = this.x
                .redAdd(this.y)
                .redMul(t.x.redAdd(t.y))
                .redISub(o)
                .redISub(s),
              c = i.redMul(f).redMul(u);
            return (
              this.curve.twisted
                ? ((e = i.redMul(h).redMul(s.redSub(this.curve._mulA(o)))),
                  (r = f.redMul(h)))
                : ((e = i.redMul(h).redMul(s.redSub(o))),
                  (r = this.curve._mulC(f).redMul(h))),
              this.curve.point(c, e, r)
            );
          }),
          (h.prototype.add = function (t) {
            return this.isInfinity()
              ? t
              : t.isInfinity()
              ? this
              : this.curve.extended
              ? this._extAdd(t)
              : this._projAdd(t);
          }),
          (h.prototype.mul = function (t) {
            return this._hasDoubles(t)
              ? this.curve._fixedNafMul(this, t)
              : this.curve._wnafMul(this, t);
          }),
          (h.prototype.mulAdd = function (t, e, r) {
            return this.curve._wnafMulAdd(1, [this, e], [t, r], 2, !1);
          }),
          (h.prototype.jmulAdd = function (t, e, r) {
            return this.curve._wnafMulAdd(1, [this, e], [t, r], 2, !0);
          }),
          (h.prototype.normalize = function () {
            if (this.zOne) return this;
            var t = this.z.redInvm();
            return (
              (this.x = this.x.redMul(t)),
              (this.y = this.y.redMul(t)),
              this.t && (this.t = this.t.redMul(t)),
              (this.z = this.curve.one),
              (this.zOne = !0),
              this
            );
          }),
          (h.prototype.neg = function () {
            return this.curve.point(
              this.x.redNeg(),
              this.y,
              this.z,
              this.t && this.t.redNeg()
            );
          }),
          (h.prototype.getX = function () {
            return this.normalize(), this.x.fromRed();
          }),
          (h.prototype.getY = function () {
            return this.normalize(), this.y.fromRed();
          }),
          (h.prototype.eq = function (t) {
            return (
              this === t ||
              (0 === this.getX().cmp(t.getX()) &&
                0 === this.getY().cmp(t.getY()))
            );
          }),
          (h.prototype.eqXToP = function (t) {
            var e = t.toRed(this.curve.red).redMul(this.z);
            if (0 === this.x.cmp(e)) return !0;
            for (var r = t.clone(), i = this.curve.redN.redMul(this.z); ; ) {
              if ((r.iadd(this.curve.n), r.cmp(this.curve.p) >= 0)) return !1;
              if ((e.redIAdd(i), 0 === this.x.cmp(e))) return !0;
            }
          }),
          (h.prototype.toP = h.prototype.normalize),
          (h.prototype.mixedAdd = h.prototype.add);
      },
      { "../utils": 97, "./base": 84, "bn.js": 98, inherits: 132 },
    ],
    86: [
      function (t, e, r) {
        "use strict";
        var i = r;
        (i.base = t("./base")),
          (i.short = t("./short")),
          (i.mont = t("./mont")),
          (i.edwards = t("./edwards"));
      },
      { "./base": 84, "./edwards": 85, "./mont": 87, "./short": 88 },
    ],
    87: [
      function (t, e, r) {
        "use strict";
        var i = t("bn.js"),
          n = t("inherits"),
          o = t("./base"),
          s = t("../utils");
        function a(t) {
          o.call(this, "mont", t),
            (this.a = new i(t.a, 16).toRed(this.red)),
            (this.b = new i(t.b, 16).toRed(this.red)),
            (this.i4 = new i(4).toRed(this.red).redInvm()),
            (this.two = new i(2).toRed(this.red)),
            (this.a24 = this.i4.redMul(this.a.redAdd(this.two)));
        }
        function f(t, e, r) {
          o.BasePoint.call(this, t, "projective"),
            null === e && null === r
              ? ((this.x = this.curve.one), (this.z = this.curve.zero))
              : ((this.x = new i(e, 16)),
                (this.z = new i(r, 16)),
                this.x.red || (this.x = this.x.toRed(this.curve.red)),
                this.z.red || (this.z = this.z.toRed(this.curve.red)));
        }
        n(a, o),
          (e.exports = a),
          (a.prototype.validate = function (t) {
            var e = t.normalize().x,
              r = e.redSqr(),
              i = r.redMul(e).redAdd(r.redMul(this.a)).redAdd(e);
            return 0 === i.redSqrt().redSqr().cmp(i);
          }),
          n(f, o.BasePoint),
          (a.prototype.decodePoint = function (t, e) {
            return this.point(s.toArray(t, e), 1);
          }),
          (a.prototype.point = function (t, e) {
            return new f(this, t, e);
          }),
          (a.prototype.pointFromJSON = function (t) {
            return f.fromJSON(this, t);
          }),
          (f.prototype.precompute = function () {}),
          (f.prototype._encode = function () {
            return this.getX().toArray("be", this.curve.p.byteLength());
          }),
          (f.fromJSON = function (t, e) {
            return new f(t, e[0], e[1] || t.one);
          }),
          (f.prototype.inspect = function () {
            return this.isInfinity()
              ? "<EC Point Infinity>"
              : "<EC Point x: " +
                  this.x.fromRed().toString(16, 2) +
                  " z: " +
                  this.z.fromRed().toString(16, 2) +
                  ">";
          }),
          (f.prototype.isInfinity = function () {
            return 0 === this.z.cmpn(0);
          }),
          (f.prototype.dbl = function () {
            var t = this.x.redAdd(this.z).redSqr(),
              e = this.x.redSub(this.z).redSqr(),
              r = t.redSub(e),
              i = t.redMul(e),
              n = r.redMul(e.redAdd(this.curve.a24.redMul(r)));
            return this.curve.point(i, n);
          }),
          (f.prototype.add = function () {
            throw new Error("Not supported on Montgomery curve");
          }),
          (f.prototype.diffAdd = function (t, e) {
            var r = this.x.redAdd(this.z),
              i = this.x.redSub(this.z),
              n = t.x.redAdd(t.z),
              o = t.x.redSub(t.z).redMul(r),
              s = n.redMul(i),
              a = e.z.redMul(o.redAdd(s).redSqr()),
              f = e.x.redMul(o.redISub(s).redSqr());
            return this.curve.point(a, f);
          }),
          (f.prototype.mul = function (t) {
            for (
              var e = t.clone(),
                r = this,
                i = this.curve.point(null, null),
                n = [];
              0 !== e.cmpn(0);
              e.iushrn(1)
            )
              n.push(e.andln(1));
            for (var o = n.length - 1; o >= 0; o--)
              0 === n[o]
                ? ((r = r.diffAdd(i, this)), (i = i.dbl()))
                : ((i = r.diffAdd(i, this)), (r = r.dbl()));
            return i;
          }),
          (f.prototype.mulAdd = function () {
            throw new Error("Not supported on Montgomery curve");
          }),
          (f.prototype.jumlAdd = function () {
            throw new Error("Not supported on Montgomery curve");
          }),
          (f.prototype.eq = function (t) {
            return 0 === this.getX().cmp(t.getX());
          }),
          (f.prototype.normalize = function () {
            return (
              (this.x = this.x.redMul(this.z.redInvm())),
              (this.z = this.curve.one),
              this
            );
          }),
          (f.prototype.getX = function () {
            return this.normalize(), this.x.fromRed();
          });
      },
      { "../utils": 97, "./base": 84, "bn.js": 98, inherits: 132 },
    ],
    88: [
      function (t, e, r) {
        "use strict";
        var i = t("../utils"),
          n = t("bn.js"),
          o = t("inherits"),
          s = t("./base"),
          a = i.assert;
        function f(t) {
          s.call(this, "short", t),
            (this.a = new n(t.a, 16).toRed(this.red)),
            (this.b = new n(t.b, 16).toRed(this.red)),
            (this.tinv = this.two.redInvm()),
            (this.zeroA = 0 === this.a.fromRed().cmpn(0)),
            (this.threeA = 0 === this.a.fromRed().sub(this.p).cmpn(-3)),
            (this.endo = this._getEndomorphism(t)),
            (this._endoWnafT1 = new Array(4)),
            (this._endoWnafT2 = new Array(4));
        }
        function h(t, e, r, i) {
          s.BasePoint.call(this, t, "affine"),
            null === e && null === r
              ? ((this.x = null), (this.y = null), (this.inf = !0))
              : ((this.x = new n(e, 16)),
                (this.y = new n(r, 16)),
                i &&
                  (this.x.forceRed(this.curve.red),
                  this.y.forceRed(this.curve.red)),
                this.x.red || (this.x = this.x.toRed(this.curve.red)),
                this.y.red || (this.y = this.y.toRed(this.curve.red)),
                (this.inf = !1));
        }
        function u(t, e, r, i) {
          s.BasePoint.call(this, t, "jacobian"),
            null === e && null === r && null === i
              ? ((this.x = this.curve.one),
                (this.y = this.curve.one),
                (this.z = new n(0)))
              : ((this.x = new n(e, 16)),
                (this.y = new n(r, 16)),
                (this.z = new n(i, 16))),
            this.x.red || (this.x = this.x.toRed(this.curve.red)),
            this.y.red || (this.y = this.y.toRed(this.curve.red)),
            this.z.red || (this.z = this.z.toRed(this.curve.red)),
            (this.zOne = this.z === this.curve.one);
        }
        o(f, s),
          (e.exports = f),
          (f.prototype._getEndomorphism = function (t) {
            if (this.zeroA && this.g && this.n && 1 === this.p.modn(3)) {
              var e, r;
              if (t.beta) e = new n(t.beta, 16).toRed(this.red);
              else {
                var i = this._getEndoRoots(this.p);
                e = (e = i[0].cmp(i[1]) < 0 ? i[0] : i[1]).toRed(this.red);
              }
              if (t.lambda) r = new n(t.lambda, 16);
              else {
                var o = this._getEndoRoots(this.n);
                0 === this.g.mul(o[0]).x.cmp(this.g.x.redMul(e))
                  ? (r = o[0])
                  : ((r = o[1]),
                    a(0 === this.g.mul(r).x.cmp(this.g.x.redMul(e))));
              }
              return {
                beta: e,
                lambda: r,
                basis: t.basis
                  ? t.basis.map(function (t) {
                      return { a: new n(t.a, 16), b: new n(t.b, 16) };
                    })
                  : this._getEndoBasis(r),
              };
            }
          }),
          (f.prototype._getEndoRoots = function (t) {
            var e = t === this.p ? this.red : n.mont(t),
              r = new n(2).toRed(e).redInvm(),
              i = r.redNeg(),
              o = new n(3).toRed(e).redNeg().redSqrt().redMul(r);
            return [i.redAdd(o).fromRed(), i.redSub(o).fromRed()];
          }),
          (f.prototype._getEndoBasis = function (t) {
            for (
              var e,
                r,
                i,
                o,
                s,
                a,
                f,
                h,
                u,
                c = this.n.ushrn(Math.floor(this.n.bitLength() / 2)),
                d = t,
                l = this.n.clone(),
                p = new n(1),
                b = new n(0),
                m = new n(0),
                y = new n(1),
                g = 0;
              0 !== d.cmpn(0);

            ) {
              var v = l.div(d);
              (h = l.sub(v.mul(d))), (u = m.sub(v.mul(p)));
              var w = y.sub(v.mul(b));
              if (!i && h.cmp(c) < 0)
                (e = f.neg()), (r = p), (i = h.neg()), (o = u);
              else if (i && 2 == ++g) break;
              (f = h), (l = d), (d = h), (m = p), (p = u), (y = b), (b = w);
            }
            (s = h.neg()), (a = u);
            var _ = i.sqr().add(o.sqr());
            return (
              s.sqr().add(a.sqr()).cmp(_) >= 0 && ((s = e), (a = r)),
              i.negative && ((i = i.neg()), (o = o.neg())),
              s.negative && ((s = s.neg()), (a = a.neg())),
              [
                { a: i, b: o },
                { a: s, b: a },
              ]
            );
          }),
          (f.prototype._endoSplit = function (t) {
            var e = this.endo.basis,
              r = e[0],
              i = e[1],
              n = i.b.mul(t).divRound(this.n),
              o = r.b.neg().mul(t).divRound(this.n),
              s = n.mul(r.a),
              a = o.mul(i.a),
              f = n.mul(r.b),
              h = o.mul(i.b);
            return { k1: t.sub(s).sub(a), k2: f.add(h).neg() };
          }),
          (f.prototype.pointFromX = function (t, e) {
            (t = new n(t, 16)).red || (t = t.toRed(this.red));
            var r = t
                .redSqr()
                .redMul(t)
                .redIAdd(t.redMul(this.a))
                .redIAdd(this.b),
              i = r.redSqrt();
            if (0 !== i.redSqr().redSub(r).cmp(this.zero))
              throw new Error("invalid point");
            var o = i.fromRed().isOdd();
            return (
              ((e && !o) || (!e && o)) && (i = i.redNeg()), this.point(t, i)
            );
          }),
          (f.prototype.validate = function (t) {
            if (t.inf) return !0;
            var e = t.x,
              r = t.y,
              i = this.a.redMul(e),
              n = e.redSqr().redMul(e).redIAdd(i).redIAdd(this.b);
            return 0 === r.redSqr().redISub(n).cmpn(0);
          }),
          (f.prototype._endoWnafMulAdd = function (t, e, r) {
            for (
              var i = this._endoWnafT1, n = this._endoWnafT2, o = 0;
              o < t.length;
              o++
            ) {
              var s = this._endoSplit(e[o]),
                a = t[o],
                f = a._getBeta();
              s.k1.negative && (s.k1.ineg(), (a = a.neg(!0))),
                s.k2.negative && (s.k2.ineg(), (f = f.neg(!0))),
                (i[2 * o] = a),
                (i[2 * o + 1] = f),
                (n[2 * o] = s.k1),
                (n[2 * o + 1] = s.k2);
            }
            for (
              var h = this._wnafMulAdd(1, i, n, 2 * o, r), u = 0;
              u < 2 * o;
              u++
            )
              (i[u] = null), (n[u] = null);
            return h;
          }),
          o(h, s.BasePoint),
          (f.prototype.point = function (t, e, r) {
            return new h(this, t, e, r);
          }),
          (f.prototype.pointFromJSON = function (t, e) {
            return h.fromJSON(this, t, e);
          }),
          (h.prototype._getBeta = function () {
            if (this.curve.endo) {
              var t = this.precomputed;
              if (t && t.beta) return t.beta;
              var e = this.curve.point(
                this.x.redMul(this.curve.endo.beta),
                this.y
              );
              if (t) {
                var r = this.curve,
                  i = function (t) {
                    return r.point(t.x.redMul(r.endo.beta), t.y);
                  };
                (t.beta = e),
                  (e.precomputed = {
                    beta: null,
                    naf: t.naf && {
                      wnd: t.naf.wnd,
                      points: t.naf.points.map(i),
                    },
                    doubles: t.doubles && {
                      step: t.doubles.step,
                      points: t.doubles.points.map(i),
                    },
                  });
              }
              return e;
            }
          }),
          (h.prototype.toJSON = function () {
            return this.precomputed
              ? [
                  this.x,
                  this.y,
                  this.precomputed && {
                    doubles: this.precomputed.doubles && {
                      step: this.precomputed.doubles.step,
                      points: this.precomputed.doubles.points.slice(1),
                    },
                    naf: this.precomputed.naf && {
                      wnd: this.precomputed.naf.wnd,
                      points: this.precomputed.naf.points.slice(1),
                    },
                  },
                ]
              : [this.x, this.y];
          }),
          (h.fromJSON = function (t, e, r) {
            "string" == typeof e && (e = JSON.parse(e));
            var i = t.point(e[0], e[1], r);
            if (!e[2]) return i;
            function n(e) {
              return t.point(e[0], e[1], r);
            }
            var o = e[2];
            return (
              (i.precomputed = {
                beta: null,
                doubles: o.doubles && {
                  step: o.doubles.step,
                  points: [i].concat(o.doubles.points.map(n)),
                },
                naf: o.naf && {
                  wnd: o.naf.wnd,
                  points: [i].concat(o.naf.points.map(n)),
                },
              }),
              i
            );
          }),
          (h.prototype.inspect = function () {
            return this.isInfinity()
              ? "<EC Point Infinity>"
              : "<EC Point x: " +
                  this.x.fromRed().toString(16, 2) +
                  " y: " +
                  this.y.fromRed().toString(16, 2) +
                  ">";
          }),
          (h.prototype.isInfinity = function () {
            return this.inf;
          }),
          (h.prototype.add = function (t) {
            if (this.inf) return t;
            if (t.inf) return this;
            if (this.eq(t)) return this.dbl();
            if (this.neg().eq(t)) return this.curve.point(null, null);
            if (0 === this.x.cmp(t.x)) return this.curve.point(null, null);
            var e = this.y.redSub(t.y);
            0 !== e.cmpn(0) && (e = e.redMul(this.x.redSub(t.x).redInvm()));
            var r = e.redSqr().redISub(this.x).redISub(t.x),
              i = e.redMul(this.x.redSub(r)).redISub(this.y);
            return this.curve.point(r, i);
          }),
          (h.prototype.dbl = function () {
            if (this.inf) return this;
            var t = this.y.redAdd(this.y);
            if (0 === t.cmpn(0)) return this.curve.point(null, null);
            var e = this.curve.a,
              r = this.x.redSqr(),
              i = t.redInvm(),
              n = r.redAdd(r).redIAdd(r).redIAdd(e).redMul(i),
              o = n.redSqr().redISub(this.x.redAdd(this.x)),
              s = n.redMul(this.x.redSub(o)).redISub(this.y);
            return this.curve.point(o, s);
          }),
          (h.prototype.getX = function () {
            return this.x.fromRed();
          }),
          (h.prototype.getY = function () {
            return this.y.fromRed();
          }),
          (h.prototype.mul = function (t) {
            return (
              (t = new n(t, 16)),
              this.isInfinity()
                ? this
                : this._hasDoubles(t)
                ? this.curve._fixedNafMul(this, t)
                : this.curve.endo
                ? this.curve._endoWnafMulAdd([this], [t])
                : this.curve._wnafMul(this, t)
            );
          }),
          (h.prototype.mulAdd = function (t, e, r) {
            var i = [this, e],
              n = [t, r];
            return this.curve.endo
              ? this.curve._endoWnafMulAdd(i, n)
              : this.curve._wnafMulAdd(1, i, n, 2);
          }),
          (h.prototype.jmulAdd = function (t, e, r) {
            var i = [this, e],
              n = [t, r];
            return this.curve.endo
              ? this.curve._endoWnafMulAdd(i, n, !0)
              : this.curve._wnafMulAdd(1, i, n, 2, !0);
          }),
          (h.prototype.eq = function (t) {
            return (
              this === t ||
              (this.inf === t.inf &&
                (this.inf || (0 === this.x.cmp(t.x) && 0 === this.y.cmp(t.y))))
            );
          }),
          (h.prototype.neg = function (t) {
            if (this.inf) return this;
            var e = this.curve.point(this.x, this.y.redNeg());
            if (t && this.precomputed) {
              var r = this.precomputed,
                i = function (t) {
                  return t.neg();
                };
              e.precomputed = {
                naf: r.naf && { wnd: r.naf.wnd, points: r.naf.points.map(i) },
                doubles: r.doubles && {
                  step: r.doubles.step,
                  points: r.doubles.points.map(i),
                },
              };
            }
            return e;
          }),
          (h.prototype.toJ = function () {
            return this.inf
              ? this.curve.jpoint(null, null, null)
              : this.curve.jpoint(this.x, this.y, this.curve.one);
          }),
          o(u, s.BasePoint),
          (f.prototype.jpoint = function (t, e, r) {
            return new u(this, t, e, r);
          }),
          (u.prototype.toP = function () {
            if (this.isInfinity()) return this.curve.point(null, null);
            var t = this.z.redInvm(),
              e = t.redSqr(),
              r = this.x.redMul(e),
              i = this.y.redMul(e).redMul(t);
            return this.curve.point(r, i);
          }),
          (u.prototype.neg = function () {
            return this.curve.jpoint(this.x, this.y.redNeg(), this.z);
          }),
          (u.prototype.add = function (t) {
            if (this.isInfinity()) return t;
            if (t.isInfinity()) return this;
            var e = t.z.redSqr(),
              r = this.z.redSqr(),
              i = this.x.redMul(e),
              n = t.x.redMul(r),
              o = this.y.redMul(e.redMul(t.z)),
              s = t.y.redMul(r.redMul(this.z)),
              a = i.redSub(n),
              f = o.redSub(s);
            if (0 === a.cmpn(0))
              return 0 !== f.cmpn(0)
                ? this.curve.jpoint(null, null, null)
                : this.dbl();
            var h = a.redSqr(),
              u = h.redMul(a),
              c = i.redMul(h),
              d = f.redSqr().redIAdd(u).redISub(c).redISub(c),
              l = f.redMul(c.redISub(d)).redISub(o.redMul(u)),
              p = this.z.redMul(t.z).redMul(a);
            return this.curve.jpoint(d, l, p);
          }),
          (u.prototype.mixedAdd = function (t) {
            if (this.isInfinity()) return t.toJ();
            if (t.isInfinity()) return this;
            var e = this.z.redSqr(),
              r = this.x,
              i = t.x.redMul(e),
              n = this.y,
              o = t.y.redMul(e).redMul(this.z),
              s = r.redSub(i),
              a = n.redSub(o);
            if (0 === s.cmpn(0))
              return 0 !== a.cmpn(0)
                ? this.curve.jpoint(null, null, null)
                : this.dbl();
            var f = s.redSqr(),
              h = f.redMul(s),
              u = r.redMul(f),
              c = a.redSqr().redIAdd(h).redISub(u).redISub(u),
              d = a.redMul(u.redISub(c)).redISub(n.redMul(h)),
              l = this.z.redMul(s);
            return this.curve.jpoint(c, d, l);
          }),
          (u.prototype.dblp = function (t) {
            if (0 === t) return this;
            if (this.isInfinity()) return this;
            if (!t) return this.dbl();
            var e;
            if (this.curve.zeroA || this.curve.threeA) {
              var r = this;
              for (e = 0; e < t; e++) r = r.dbl();
              return r;
            }
            var i = this.curve.a,
              n = this.curve.tinv,
              o = this.x,
              s = this.y,
              a = this.z,
              f = a.redSqr().redSqr(),
              h = s.redAdd(s);
            for (e = 0; e < t; e++) {
              var u = o.redSqr(),
                c = h.redSqr(),
                d = c.redSqr(),
                l = u.redAdd(u).redIAdd(u).redIAdd(i.redMul(f)),
                p = o.redMul(c),
                b = l.redSqr().redISub(p.redAdd(p)),
                m = p.redISub(b),
                y = l.redMul(m);
              y = y.redIAdd(y).redISub(d);
              var g = h.redMul(a);
              e + 1 < t && (f = f.redMul(d)), (o = b), (a = g), (h = y);
            }
            return this.curve.jpoint(o, h.redMul(n), a);
          }),
          (u.prototype.dbl = function () {
            return this.isInfinity()
              ? this
              : this.curve.zeroA
              ? this._zeroDbl()
              : this.curve.threeA
              ? this._threeDbl()
              : this._dbl();
          }),
          (u.prototype._zeroDbl = function () {
            var t, e, r;
            if (this.zOne) {
              var i = this.x.redSqr(),
                n = this.y.redSqr(),
                o = n.redSqr(),
                s = this.x.redAdd(n).redSqr().redISub(i).redISub(o);
              s = s.redIAdd(s);
              var a = i.redAdd(i).redIAdd(i),
                f = a.redSqr().redISub(s).redISub(s),
                h = o.redIAdd(o);
              (h = (h = h.redIAdd(h)).redIAdd(h)),
                (t = f),
                (e = a.redMul(s.redISub(f)).redISub(h)),
                (r = this.y.redAdd(this.y));
            } else {
              var u = this.x.redSqr(),
                c = this.y.redSqr(),
                d = c.redSqr(),
                l = this.x.redAdd(c).redSqr().redISub(u).redISub(d);
              l = l.redIAdd(l);
              var p = u.redAdd(u).redIAdd(u),
                b = p.redSqr(),
                m = d.redIAdd(d);
              (m = (m = m.redIAdd(m)).redIAdd(m)),
                (t = b.redISub(l).redISub(l)),
                (e = p.redMul(l.redISub(t)).redISub(m)),
                (r = (r = this.y.redMul(this.z)).redIAdd(r));
            }
            return this.curve.jpoint(t, e, r);
          }),
          (u.prototype._threeDbl = function () {
            var t, e, r;
            if (this.zOne) {
              var i = this.x.redSqr(),
                n = this.y.redSqr(),
                o = n.redSqr(),
                s = this.x.redAdd(n).redSqr().redISub(i).redISub(o);
              s = s.redIAdd(s);
              var a = i.redAdd(i).redIAdd(i).redIAdd(this.curve.a),
                f = a.redSqr().redISub(s).redISub(s);
              t = f;
              var h = o.redIAdd(o);
              (h = (h = h.redIAdd(h)).redIAdd(h)),
                (e = a.redMul(s.redISub(f)).redISub(h)),
                (r = this.y.redAdd(this.y));
            } else {
              var u = this.z.redSqr(),
                c = this.y.redSqr(),
                d = this.x.redMul(c),
                l = this.x.redSub(u).redMul(this.x.redAdd(u));
              l = l.redAdd(l).redIAdd(l);
              var p = d.redIAdd(d),
                b = (p = p.redIAdd(p)).redAdd(p);
              (t = l.redSqr().redISub(b)),
                (r = this.y.redAdd(this.z).redSqr().redISub(c).redISub(u));
              var m = c.redSqr();
              (m = (m = (m = m.redIAdd(m)).redIAdd(m)).redIAdd(m)),
                (e = l.redMul(p.redISub(t)).redISub(m));
            }
            return this.curve.jpoint(t, e, r);
          }),
          (u.prototype._dbl = function () {
            var t = this.curve.a,
              e = this.x,
              r = this.y,
              i = this.z,
              n = i.redSqr().redSqr(),
              o = e.redSqr(),
              s = r.redSqr(),
              a = o.redAdd(o).redIAdd(o).redIAdd(t.redMul(n)),
              f = e.redAdd(e),
              h = (f = f.redIAdd(f)).redMul(s),
              u = a.redSqr().redISub(h.redAdd(h)),
              c = h.redISub(u),
              d = s.redSqr();
            d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
            var l = a.redMul(c).redISub(d),
              p = r.redAdd(r).redMul(i);
            return this.curve.jpoint(u, l, p);
          }),
          (u.prototype.trpl = function () {
            if (!this.curve.zeroA) return this.dbl().add(this);
            var t = this.x.redSqr(),
              e = this.y.redSqr(),
              r = this.z.redSqr(),
              i = e.redSqr(),
              n = t.redAdd(t).redIAdd(t),
              o = n.redSqr(),
              s = this.x.redAdd(e).redSqr().redISub(t).redISub(i),
              a = (s = (s = (s = s.redIAdd(s)).redAdd(s).redIAdd(s)).redISub(
                o
              )).redSqr(),
              f = i.redIAdd(i);
            f = (f = (f = f.redIAdd(f)).redIAdd(f)).redIAdd(f);
            var h = n.redIAdd(s).redSqr().redISub(o).redISub(a).redISub(f),
              u = e.redMul(h);
            u = (u = u.redIAdd(u)).redIAdd(u);
            var c = this.x.redMul(a).redISub(u);
            c = (c = c.redIAdd(c)).redIAdd(c);
            var d = this.y.redMul(h.redMul(f.redISub(h)).redISub(s.redMul(a)));
            d = (d = (d = d.redIAdd(d)).redIAdd(d)).redIAdd(d);
            var l = this.z.redAdd(s).redSqr().redISub(r).redISub(a);
            return this.curve.jpoint(c, d, l);
          }),
          (u.prototype.mul = function (t, e) {
            return (t = new n(t, e)), this.curve._wnafMul(this, t);
          }),
          (u.prototype.eq = function (t) {
            if ("affine" === t.type) return this.eq(t.toJ());
            if (this === t) return !0;
            var e = this.z.redSqr(),
              r = t.z.redSqr();
            if (0 !== this.x.redMul(r).redISub(t.x.redMul(e)).cmpn(0))
              return !1;
            var i = e.redMul(this.z),
              n = r.redMul(t.z);
            return 0 === this.y.redMul(n).redISub(t.y.redMul(i)).cmpn(0);
          }),
          (u.prototype.eqXToP = function (t) {
            var e = this.z.redSqr(),
              r = t.toRed(this.curve.red).redMul(e);
            if (0 === this.x.cmp(r)) return !0;
            for (var i = t.clone(), n = this.curve.redN.redMul(e); ; ) {
              if ((i.iadd(this.curve.n), i.cmp(this.curve.p) >= 0)) return !1;
              if ((r.redIAdd(n), 0 === this.x.cmp(r))) return !0;
            }
          }),
          (u.prototype.inspect = function () {
            return this.isInfinity()
              ? "<EC JPoint Infinity>"
              : "<EC JPoint x: " +
                  this.x.toString(16, 2) +
                  " y: " +
                  this.y.toString(16, 2) +
                  " z: " +
                  this.z.toString(16, 2) +
                  ">";
          }),
          (u.prototype.isInfinity = function () {
            return 0 === this.z.cmpn(0);
          });
      },
      { "../utils": 97, "./base": 84, "bn.js": 98, inherits: 132 },
    ],
    89: [
      function (t, e, r) {
        "use strict";
        var i,
          n = r,
          o = t("hash.js"),
          s = t("./curve"),
          a = t("./utils").assert;
        function f(t) {
          "short" === t.type
            ? (this.curve = new s.short(t))
            : "edwards" === t.type
            ? (this.curve = new s.edwards(t))
            : (this.curve = new s.mont(t)),
            (this.g = this.curve.g),
            (this.n = this.curve.n),
            (this.hash = t.hash),
            a(this.g.validate(), "Invalid curve"),
            a(this.g.mul(this.n).isInfinity(), "Invalid curve, G*N != O");
        }
        function h(t, e) {
          Object.defineProperty(n, t, {
            configurable: !0,
            enumerable: !0,
            get: function () {
              var r = new f(e);
              return (
                Object.defineProperty(n, t, {
                  configurable: !0,
                  enumerable: !0,
                  value: r,
                }),
                r
              );
            },
          });
        }
        (n.PresetCurve = f),
          h("p192", {
            type: "short",
            prime: "p192",
            p: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff",
            a: "ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc",
            b: "64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1",
            n: "ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831",
            hash: o.sha256,
            gRed: !1,
            g: [
              "188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012",
              "07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811",
            ],
          }),
          h("p224", {
            type: "short",
            prime: "p224",
            p: "ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001",
            a: "ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe",
            b: "b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4",
            n: "ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d",
            hash: o.sha256,
            gRed: !1,
            g: [
              "b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21",
              "bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34",
            ],
          }),
          h("p256", {
            type: "short",
            prime: null,
            p: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff",
            a: "ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc",
            b: "5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b",
            n: "ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551",
            hash: o.sha256,
            gRed: !1,
            g: [
              "6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296",
              "4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5",
            ],
          }),
          h("p384", {
            type: "short",
            prime: null,
            p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff",
            a: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc",
            b: "b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef",
            n: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973",
            hash: o.sha384,
            gRed: !1,
            g: [
              "aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7",
              "3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f",
            ],
          }),
          h("p521", {
            type: "short",
            prime: null,
            p: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff",
            a: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc",
            b: "00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00",
            n: "000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409",
            hash: o.sha512,
            gRed: !1,
            g: [
              "000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66",
              "00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650",
            ],
          }),
          h("curve25519", {
            type: "mont",
            prime: "p25519",
            p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
            a: "76d06",
            b: "1",
            n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
            hash: o.sha256,
            gRed: !1,
            g: ["9"],
          }),
          h("ed25519", {
            type: "edwards",
            prime: "p25519",
            p: "7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed",
            a: "-1",
            c: "1",
            d: "52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3",
            n: "1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed",
            hash: o.sha256,
            gRed: !1,
            g: [
              "216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a",
              "6666666666666666666666666666666666666666666666666666666666666658",
            ],
          });
        try {
          i = t("./precomputed/secp256k1");
        } catch (t) {
          i = void 0;
        }
        h("secp256k1", {
          type: "short",
          prime: "k256",
          p: "ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f",
          a: "0",
          b: "7",
          n: "ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141",
          h: "1",
          hash: o.sha256,
          beta: "7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee",
          lambda:
            "5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72",
          basis: [
            {
              a: "3086d221a7d46bcde86c90e49284eb15",
              b: "-e4437ed6010e88286f547fa90abfe4c3",
            },
            {
              a: "114ca50f7a8e2f3f657c1108d9d44cfd8",
              b: "3086d221a7d46bcde86c90e49284eb15",
            },
          ],
          gRed: !1,
          g: [
            "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
            "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8",
            i,
          ],
        });
      },
      {
        "./curve": 86,
        "./precomputed/secp256k1": 96,
        "./utils": 97,
        "hash.js": 118,
      },
    ],
    90: [
      function (t, e, r) {
        "use strict";
        var i = t("bn.js"),
          n = t("hmac-drbg"),
          o = t("../utils"),
          s = t("../curves"),
          a = t("brorand"),
          f = o.assert,
          h = t("./key"),
          u = t("./signature");
        function c(t) {
          if (!(this instanceof c)) return new c(t);
          "string" == typeof t &&
            (f(
              Object.prototype.hasOwnProperty.call(s, t),
              "Unknown curve " + t
            ),
            (t = s[t])),
            t instanceof s.PresetCurve && (t = { curve: t }),
            (this.curve = t.curve.curve),
            (this.n = this.curve.n),
            (this.nh = this.n.ushrn(1)),
            (this.g = this.curve.g),
            (this.g = t.curve.g),
            this.g.precompute(t.curve.n.bitLength() + 1),
            (this.hash = t.hash || t.curve.hash);
        }
        (e.exports = c),
          (c.prototype.keyPair = function (t) {
            return new h(this, t);
          }),
          (c.prototype.keyFromPrivate = function (t, e) {
            return h.fromPrivate(this, t, e);
          }),
          (c.prototype.keyFromPublic = function (t, e) {
            return h.fromPublic(this, t, e);
          }),
          (c.prototype.genKeyPair = function (t) {
            t || (t = {});
            for (
              var e = new n({
                  hash: this.hash,
                  pers: t.pers,
                  persEnc: t.persEnc || "utf8",
                  entropy: t.entropy || a(this.hash.hmacStrength),
                  entropyEnc: (t.entropy && t.entropyEnc) || "utf8",
                  nonce: this.n.toArray(),
                }),
                r = this.n.byteLength(),
                o = this.n.sub(new i(2));
              ;

            ) {
              var s = new i(e.generate(r));
              if (!(s.cmp(o) > 0)) return s.iaddn(1), this.keyFromPrivate(s);
            }
          }),
          (c.prototype._truncateToN = function (t, e) {
            var r = 8 * t.byteLength() - this.n.bitLength();
            return (
              r > 0 && (t = t.ushrn(r)),
              !e && t.cmp(this.n) >= 0 ? t.sub(this.n) : t
            );
          }),
          (c.prototype.sign = function (t, e, r, o) {
            "object" == typeof r && ((o = r), (r = null)),
              o || (o = {}),
              (e = this.keyFromPrivate(e, r)),
              (t = this._truncateToN(new i(t, 16)));
            for (
              var s = this.n.byteLength(),
                a = e.getPrivate().toArray("be", s),
                f = t.toArray("be", s),
                h = new n({
                  hash: this.hash,
                  entropy: a,
                  nonce: f,
                  pers: o.pers,
                  persEnc: o.persEnc || "utf8",
                }),
                c = this.n.sub(new i(1)),
                d = 0;
              ;
              d++
            ) {
              var l = o.k ? o.k(d) : new i(h.generate(this.n.byteLength()));
              if (
                !((l = this._truncateToN(l, !0)).cmpn(1) <= 0 || l.cmp(c) >= 0)
              ) {
                var p = this.g.mul(l);
                if (!p.isInfinity()) {
                  var b = p.getX(),
                    m = b.umod(this.n);
                  if (0 !== m.cmpn(0)) {
                    var y = l.invm(this.n).mul(m.mul(e.getPrivate()).iadd(t));
                    if (0 !== (y = y.umod(this.n)).cmpn(0)) {
                      var g =
                        (p.getY().isOdd() ? 1 : 0) | (0 !== b.cmp(m) ? 2 : 0);
                      return (
                        o.canonical &&
                          y.cmp(this.nh) > 0 &&
                          ((y = this.n.sub(y)), (g ^= 1)),
                        new u({ r: m, s: y, recoveryParam: g })
                      );
                    }
                  }
                }
              }
            }
          }),
          (c.prototype.verify = function (t, e, r, n) {
            (t = this._truncateToN(new i(t, 16))),
              (r = this.keyFromPublic(r, n));
            var o = (e = new u(e, "hex")).r,
              s = e.s;
            if (o.cmpn(1) < 0 || o.cmp(this.n) >= 0) return !1;
            if (s.cmpn(1) < 0 || s.cmp(this.n) >= 0) return !1;
            var a,
              f = s.invm(this.n),
              h = f.mul(t).umod(this.n),
              c = f.mul(o).umod(this.n);
            return this.curve._maxwellTrick
              ? !(a = this.g.jmulAdd(h, r.getPublic(), c)).isInfinity() &&
                  a.eqXToP(o)
              : !(a = this.g.mulAdd(h, r.getPublic(), c)).isInfinity() &&
                  0 === a.getX().umod(this.n).cmp(o);
          }),
          (c.prototype.recoverPubKey = function (t, e, r, n) {
            f((3 & r) === r, "The recovery param is more than two bits"),
              (e = new u(e, n));
            var o = this.n,
              s = new i(t),
              a = e.r,
              h = e.s,
              c = 1 & r,
              d = r >> 1;
            if (a.cmp(this.curve.p.umod(this.curve.n)) >= 0 && d)
              throw new Error("Unable to find sencond key candinate");
            a = d
              ? this.curve.pointFromX(a.add(this.curve.n), c)
              : this.curve.pointFromX(a, c);
            var l = e.r.invm(o),
              p = o.sub(s).mul(l).umod(o),
              b = h.mul(l).umod(o);
            return this.g.mulAdd(p, a, b);
          }),
          (c.prototype.getKeyRecoveryParam = function (t, e, r, i) {
            if (null !== (e = new u(e, i)).recoveryParam)
              return e.recoveryParam;
            for (var n = 0; n < 4; n++) {
              var o;
              try {
                o = this.recoverPubKey(t, e, n);
              } catch (t) {
                continue;
              }
              if (o.eq(r)) return n;
            }
            throw new Error("Unable to find valid recovery factor");
          });
      },
      {
        "../curves": 89,
        "../utils": 97,
        "./key": 91,
        "./signature": 92,
        "bn.js": 98,
        brorand: 18,
        "hmac-drbg": 130,
      },
    ],
    91: [
      function (t, e, r) {
        "use strict";
        var i = t("bn.js"),
          n = t("../utils").assert;
        function o(t, e) {
          (this.ec = t),
            (this.priv = null),
            (this.pub = null),
            e.priv && this._importPrivate(e.priv, e.privEnc),
            e.pub && this._importPublic(e.pub, e.pubEnc);
        }
        (e.exports = o),
          (o.fromPublic = function (t, e, r) {
            return e instanceof o ? e : new o(t, { pub: e, pubEnc: r });
          }),
          (o.fromPrivate = function (t, e, r) {
            return e instanceof o ? e : new o(t, { priv: e, privEnc: r });
          }),
          (o.prototype.validate = function () {
            var t = this.getPublic();
            return t.isInfinity()
              ? { result: !1, reason: "Invalid public key" }
              : t.validate()
              ? t.mul(this.ec.curve.n).isInfinity()
                ? { result: !0, reason: null }
                : { result: !1, reason: "Public key * N != O" }
              : { result: !1, reason: "Public key is not a point" };
          }),
          (o.prototype.getPublic = function (t, e) {
            return (
              "string" == typeof t && ((e = t), (t = null)),
              this.pub || (this.pub = this.ec.g.mul(this.priv)),
              e ? this.pub.encode(e, t) : this.pub
            );
          }),
          (o.prototype.getPrivate = function (t) {
            return "hex" === t ? this.priv.toString(16, 2) : this.priv;
          }),
          (o.prototype._importPrivate = function (t, e) {
            (this.priv = new i(t, e || 16)),
              (this.priv = this.priv.umod(this.ec.curve.n));
          }),
          (o.prototype._importPublic = function (t, e) {
            if (t.x || t.y)
              return (
                "mont" === this.ec.curve.type
                  ? n(t.x, "Need x coordinate")
                  : ("short" !== this.ec.curve.type &&
                      "edwards" !== this.ec.curve.type) ||
                    n(t.x && t.y, "Need both x and y coordinate"),
                void (this.pub = this.ec.curve.point(t.x, t.y))
              );
            this.pub = this.ec.curve.decodePoint(t, e);
          }),
          (o.prototype.derive = function (t) {
            return (
              t.validate() || n(t.validate(), "public point not validated"),
              t.mul(this.priv).getX()
            );
          }),
          (o.prototype.sign = function (t, e, r) {
            return this.ec.sign(t, this, e, r);
          }),
          (o.prototype.verify = function (t, e) {
            return this.ec.verify(t, e, this);
          }),
          (o.prototype.inspect = function () {
            return (
              "<Key priv: " +
              (this.priv && this.priv.toString(16, 2)) +
              " pub: " +
              (this.pub && this.pub.inspect()) +
              " >"
            );
          });
      },
      { "../utils": 97, "bn.js": 98 },
    ],
    92: [
      function (t, e, r) {
        "use strict";
        var i = t("bn.js"),
          n = t("../utils"),
          o = n.assert;
        function s(t, e) {
          if (t instanceof s) return t;
          this._importDER(t, e) ||
            (o(t.r && t.s, "Signature without r or s"),
            (this.r = new i(t.r, 16)),
            (this.s = new i(t.s, 16)),
            void 0 === t.recoveryParam
              ? (this.recoveryParam = null)
              : (this.recoveryParam = t.recoveryParam));
        }
        function a() {
          this.place = 0;
        }
        function f(t, e) {
          var r = t[e.place++];
          if (!(128 & r)) return r;
          var i = 15 & r;
          if (0 === i || i > 4) return !1;
          for (var n = 0, o = 0, s = e.place; o < i; o++, s++)
            (n <<= 8), (n |= t[s]), (n >>>= 0);
          return !(n <= 127) && ((e.place = s), n);
        }
        function h(t) {
          for (
            var e = 0, r = t.length - 1;
            !t[e] && !(128 & t[e + 1]) && e < r;

          )
            e++;
          return 0 === e ? t : t.slice(e);
        }
        function u(t, e) {
          if (e < 128) t.push(e);
          else {
            var r = 1 + ((Math.log(e) / Math.LN2) >>> 3);
            for (t.push(128 | r); --r; ) t.push((e >>> (r << 3)) & 255);
            t.push(e);
          }
        }
        (e.exports = s),
          (s.prototype._importDER = function (t, e) {
            t = n.toArray(t, e);
            var r = new a();
            if (48 !== t[r.place++]) return !1;
            var o = f(t, r);
            if (!1 === o) return !1;
            if (o + r.place !== t.length) return !1;
            if (2 !== t[r.place++]) return !1;
            var s = f(t, r);
            if (!1 === s) return !1;
            var h = t.slice(r.place, s + r.place);
            if (((r.place += s), 2 !== t[r.place++])) return !1;
            var u = f(t, r);
            if (!1 === u) return !1;
            if (t.length !== u + r.place) return !1;
            var c = t.slice(r.place, u + r.place);
            if (0 === h[0]) {
              if (!(128 & h[1])) return !1;
              h = h.slice(1);
            }
            if (0 === c[0]) {
              if (!(128 & c[1])) return !1;
              c = c.slice(1);
            }
            return (
              (this.r = new i(h)),
              (this.s = new i(c)),
              (this.recoveryParam = null),
              !0
            );
          }),
          (s.prototype.toDER = function (t) {
            var e = this.r.toArray(),
              r = this.s.toArray();
            for (
              128 & e[0] && (e = [0].concat(e)),
                128 & r[0] && (r = [0].concat(r)),
                e = h(e),
                r = h(r);
              !(r[0] || 128 & r[1]);

            )
              r = r.slice(1);
            var i = [2];
            u(i, e.length), (i = i.concat(e)).push(2), u(i, r.length);
            var o = i.concat(r),
              s = [48];
            return u(s, o.length), (s = s.concat(o)), n.encode(s, t);
          });
      },
      { "../utils": 97, "bn.js": 98 },
    ],
    93: [
      function (t, e, r) {
        "use strict";
        var i = t("hash.js"),
          n = t("../curves"),
          o = t("../utils"),
          s = o.assert,
          a = o.parseBytes,
          f = t("./key"),
          h = t("./signature");
        function u(t) {
          if (
            (s("ed25519" === t, "only tested with ed25519 so far"),
            !(this instanceof u))
          )
            return new u(t);
          (t = n[t].curve),
            (this.curve = t),
            (this.g = t.g),
            this.g.precompute(t.n.bitLength() + 1),
            (this.pointClass = t.point().constructor),
            (this.encodingLength = Math.ceil(t.n.bitLength() / 8)),
            (this.hash = i.sha512);
        }
        (e.exports = u),
          (u.prototype.sign = function (t, e) {
            t = a(t);
            var r = this.keyFromSecret(e),
              i = this.hashInt(r.messagePrefix(), t),
              n = this.g.mul(i),
              o = this.encodePoint(n),
              s = this.hashInt(o, r.pubBytes(), t).mul(r.priv()),
              f = i.add(s).umod(this.curve.n);
            return this.makeSignature({ R: n, S: f, Rencoded: o });
          }),
          (u.prototype.verify = function (t, e, r) {
            (t = a(t)), (e = this.makeSignature(e));
            var i = this.keyFromPublic(r),
              n = this.hashInt(e.Rencoded(), i.pubBytes(), t),
              o = this.g.mul(e.S());
            return e.R().add(i.pub().mul(n)).eq(o);
          }),
          (u.prototype.hashInt = function () {
            for (var t = this.hash(), e = 0; e < arguments.length; e++)
              t.update(arguments[e]);
            return o.intFromLE(t.digest()).umod(this.curve.n);
          }),
          (u.prototype.keyFromPublic = function (t) {
            return f.fromPublic(this, t);
          }),
          (u.prototype.keyFromSecret = function (t) {
            return f.fromSecret(this, t);
          }),
          (u.prototype.makeSignature = function (t) {
            return t instanceof h ? t : new h(this, t);
          }),
          (u.prototype.encodePoint = function (t) {
            var e = t.getY().toArray("le", this.encodingLength);
            return (
              (e[this.encodingLength - 1] |= t.getX().isOdd() ? 128 : 0), e
            );
          }),
          (u.prototype.decodePoint = function (t) {
            var e = (t = o.parseBytes(t)).length - 1,
              r = t.slice(0, e).concat(-129 & t[e]),
              i = 0 != (128 & t[e]),
              n = o.intFromLE(r);
            return this.curve.pointFromY(n, i);
          }),
          (u.prototype.encodeInt = function (t) {
            return t.toArray("le", this.encodingLength);
          }),
          (u.prototype.decodeInt = function (t) {
            return o.intFromLE(t);
          }),
          (u.prototype.isPoint = function (t) {
            return t instanceof this.pointClass;
          });
      },
      {
        "../curves": 89,
        "../utils": 97,
        "./key": 94,
        "./signature": 95,
        "hash.js": 118,
      },
    ],
    94: [
      function (t, e, r) {
        "use strict";
        var i = t("../utils"),
          n = i.assert,
          o = i.parseBytes,
          s = i.cachedProperty;
        function a(t, e) {
          (this.eddsa = t),
            (this._secret = o(e.secret)),
            t.isPoint(e.pub)
              ? (this._pub = e.pub)
              : (this._pubBytes = o(e.pub));
        }
        (a.fromPublic = function (t, e) {
          return e instanceof a ? e : new a(t, { pub: e });
        }),
          (a.fromSecret = function (t, e) {
            return e instanceof a ? e : new a(t, { secret: e });
          }),
          (a.prototype.secret = function () {
            return this._secret;
          }),
          s(a, "pubBytes", function () {
            return this.eddsa.encodePoint(this.pub());
          }),
          s(a, "pub", function () {
            return this._pubBytes
              ? this.eddsa.decodePoint(this._pubBytes)
              : this.eddsa.g.mul(this.priv());
          }),
          s(a, "privBytes", function () {
            var t = this.eddsa,
              e = this.hash(),
              r = t.encodingLength - 1,
              i = e.slice(0, t.encodingLength);
            return (i[0] &= 248), (i[r] &= 127), (i[r] |= 64), i;
          }),
          s(a, "priv", function () {
            return this.eddsa.decodeInt(this.privBytes());
          }),
          s(a, "hash", function () {
            return this.eddsa.hash().update(this.secret()).digest();
          }),
          s(a, "messagePrefix", function () {
            return this.hash().slice(this.eddsa.encodingLength);
          }),
          (a.prototype.sign = function (t) {
            return (
              n(this._secret, "KeyPair can only verify"),
              this.eddsa.sign(t, this)
            );
          }),
          (a.prototype.verify = function (t, e) {
            return this.eddsa.verify(t, e, this);
          }),
          (a.prototype.getSecret = function (t) {
            return (
              n(this._secret, "KeyPair is public only"),
              i.encode(this.secret(), t)
            );
          }),
          (a.prototype.getPublic = function (t) {
            return i.encode(this.pubBytes(), t);
          }),
          (e.exports = a);
      },
      { "../utils": 97 },
    ],
    95: [
      function (t, e, r) {
        "use strict";
        var i = t("bn.js"),
          n = t("../utils"),
          o = n.assert,
          s = n.cachedProperty,
          a = n.parseBytes;
        function f(t, e) {
          (this.eddsa = t),
            "object" != typeof e && (e = a(e)),
            Array.isArray(e) &&
              (e = {
                R: e.slice(0, t.encodingLength),
                S: e.slice(t.encodingLength),
              }),
            o(e.R && e.S, "Signature without R or S"),
            t.isPoint(e.R) && (this._R = e.R),
            e.S instanceof i && (this._S = e.S),
            (this._Rencoded = Array.isArray(e.R) ? e.R : e.Rencoded),
            (this._Sencoded = Array.isArray(e.S) ? e.S : e.Sencoded);
        }
        s(f, "S", function () {
          return this.eddsa.decodeInt(this.Sencoded());
        }),
          s(f, "R", function () {
            return this.eddsa.decodePoint(this.Rencoded());
          }),
          s(f, "Rencoded", function () {
            return this.eddsa.encodePoint(this.R());
          }),
          s(f, "Sencoded", function () {
            return this.eddsa.encodeInt(this.S());
          }),
          (f.prototype.toBytes = function () {
            return this.Rencoded().concat(this.Sencoded());
          }),
          (f.prototype.toHex = function () {
            return n.encode(this.toBytes(), "hex").toUpperCase();
          }),
          (e.exports = f);
      },
      { "../utils": 97, "bn.js": 98 },
    ],
    96: [
      function (t, e, r) {
        e.exports = {
          doubles: {
            step: 4,
            points: [
              [
                "e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a",
                "f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821",
              ],
              [
                "8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508",
                "11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf",
              ],
              [
                "175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739",
                "d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695",
              ],
              [
                "363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640",
                "4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9",
              ],
              [
                "8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c",
                "4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36",
              ],
              [
                "723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda",
                "96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f",
              ],
              [
                "eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa",
                "5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999",
              ],
              [
                "100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0",
                "cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09",
              ],
              [
                "e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d",
                "9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d",
              ],
              [
                "feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d",
                "e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088",
              ],
              [
                "da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1",
                "9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d",
              ],
              [
                "53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0",
                "5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8",
              ],
              [
                "8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047",
                "10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a",
              ],
              [
                "385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862",
                "283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453",
              ],
              [
                "6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7",
                "7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160",
              ],
              [
                "3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd",
                "56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0",
              ],
              [
                "85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83",
                "7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6",
              ],
              [
                "948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a",
                "53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589",
              ],
              [
                "6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8",
                "bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17",
              ],
              [
                "e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d",
                "4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda",
              ],
              [
                "e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725",
                "7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd",
              ],
              [
                "213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754",
                "4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2",
              ],
              [
                "4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c",
                "17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6",
              ],
              [
                "fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6",
                "6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f",
              ],
              [
                "76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39",
                "c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01",
              ],
              [
                "c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891",
                "893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3",
              ],
              [
                "d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b",
                "febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f",
              ],
              [
                "b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03",
                "2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7",
              ],
              [
                "e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d",
                "eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78",
              ],
              [
                "a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070",
                "7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1",
              ],
              [
                "90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4",
                "e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150",
              ],
              [
                "8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da",
                "662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82",
              ],
              [
                "e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11",
                "1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc",
              ],
              [
                "8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e",
                "efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b",
              ],
              [
                "e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41",
                "2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51",
              ],
              [
                "b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef",
                "67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45",
              ],
              [
                "d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8",
                "db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120",
              ],
              [
                "324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d",
                "648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84",
              ],
              [
                "4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96",
                "35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d",
              ],
              [
                "9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd",
                "ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d",
              ],
              [
                "6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5",
                "9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8",
              ],
              [
                "a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266",
                "40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8",
              ],
              [
                "7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71",
                "34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac",
              ],
              [
                "928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac",
                "c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f",
              ],
              [
                "85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751",
                "1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962",
              ],
              [
                "ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e",
                "493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907",
              ],
              [
                "827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241",
                "c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec",
              ],
              [
                "eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3",
                "be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d",
              ],
              [
                "e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f",
                "4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414",
              ],
              [
                "1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19",
                "aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd",
              ],
              [
                "146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be",
                "b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0",
              ],
              [
                "fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9",
                "6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811",
              ],
              [
                "da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2",
                "8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1",
              ],
              [
                "a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13",
                "7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c",
              ],
              [
                "174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c",
                "ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73",
              ],
              [
                "959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba",
                "2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd",
              ],
              [
                "d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151",
                "e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405",
              ],
              [
                "64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073",
                "d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589",
              ],
              [
                "8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458",
                "38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e",
              ],
              [
                "13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b",
                "69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27",
              ],
              [
                "bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366",
                "d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1",
              ],
              [
                "8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa",
                "40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482",
              ],
              [
                "8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0",
                "620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945",
              ],
              [
                "dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787",
                "7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573",
              ],
              [
                "f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e",
                "ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82",
              ],
            ],
          },
          naf: {
            wnd: 7,
            points: [
              [
                "f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9",
                "388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672",
              ],
              [
                "2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4",
                "d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6",
              ],
              [
                "5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc",
                "6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da",
              ],
              [
                "acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe",
                "cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37",
              ],
              [
                "774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb",
                "d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b",
              ],
              [
                "f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8",
                "ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81",
              ],
              [
                "d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e",
                "581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58",
              ],
              [
                "defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34",
                "4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77",
              ],
              [
                "2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c",
                "85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a",
              ],
              [
                "352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5",
                "321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c",
              ],
              [
                "2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f",
                "2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67",
              ],
              [
                "9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714",
                "73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402",
              ],
              [
                "daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729",
                "a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55",
              ],
              [
                "c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db",
                "2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482",
              ],
              [
                "6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4",
                "e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82",
              ],
              [
                "1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5",
                "b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396",
              ],
              [
                "605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479",
                "2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49",
              ],
              [
                "62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d",
                "80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf",
              ],
              [
                "80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f",
                "1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a",
              ],
              [
                "7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb",
                "d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7",
              ],
              [
                "d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9",
                "eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933",
              ],
              [
                "49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963",
                "758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a",
              ],
              [
                "77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74",
                "958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6",
              ],
              [
                "f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530",
                "e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37",
              ],
              [
                "463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b",
                "5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e",
              ],
              [
                "f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247",
                "cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6",
              ],
              [
                "caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1",
                "cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476",
              ],
              [
                "2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120",
                "4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40",
              ],
              [
                "7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435",
                "91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61",
              ],
              [
                "754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18",
                "673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683",
              ],
              [
                "e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8",
                "59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5",
              ],
              [
                "186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb",
                "3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b",
              ],
              [
                "df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f",
                "55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417",
              ],
              [
                "5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143",
                "efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868",
              ],
              [
                "290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba",
                "e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a",
              ],
              [
                "af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45",
                "f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6",
              ],
              [
                "766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a",
                "744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996",
              ],
              [
                "59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e",
                "c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e",
              ],
              [
                "f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8",
                "e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d",
              ],
              [
                "7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c",
                "30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2",
              ],
              [
                "948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519",
                "e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e",
              ],
              [
                "7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab",
                "100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437",
              ],
              [
                "3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca",
                "ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311",
              ],
              [
                "d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf",
                "8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4",
              ],
              [
                "1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610",
                "68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575",
              ],
              [
                "733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4",
                "f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d",
              ],
              [
                "15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c",
                "d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d",
              ],
              [
                "a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940",
                "edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629",
              ],
              [
                "e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980",
                "a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06",
              ],
              [
                "311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3",
                "66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374",
              ],
              [
                "34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf",
                "9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee",
              ],
              [
                "f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63",
                "4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1",
              ],
              [
                "d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448",
                "fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b",
              ],
              [
                "32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf",
                "5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661",
              ],
              [
                "7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5",
                "8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6",
              ],
              [
                "ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6",
                "8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e",
              ],
              [
                "16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5",
                "5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d",
              ],
              [
                "eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99",
                "f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc",
              ],
              [
                "78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51",
                "f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4",
              ],
              [
                "494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5",
                "42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c",
              ],
              [
                "a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5",
                "204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b",
              ],
              [
                "c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997",
                "4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913",
              ],
              [
                "841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881",
                "73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154",
              ],
              [
                "5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5",
                "39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865",
              ],
              [
                "36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66",
                "d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc",
              ],
              [
                "336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726",
                "ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224",
              ],
              [
                "8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede",
                "6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e",
              ],
              [
                "1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94",
                "60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6",
              ],
              [
                "85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31",
                "3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511",
              ],
              [
                "29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51",
                "b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b",
              ],
              [
                "a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252",
                "ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2",
              ],
              [
                "4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5",
                "cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c",
              ],
              [
                "d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b",
                "6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3",
              ],
              [
                "ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4",
                "322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d",
              ],
              [
                "af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f",
                "6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700",
              ],
              [
                "e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889",
                "2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4",
              ],
              [
                "591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246",
                "b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196",
              ],
              [
                "11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984",
                "998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4",
              ],
              [
                "3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a",
                "b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257",
              ],
              [
                "cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030",
                "bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13",
              ],
              [
                "c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197",
                "6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096",
              ],
              [
                "c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593",
                "c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38",
              ],
              [
                "a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef",
                "21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f",
              ],
              [
                "347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38",
                "60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448",
              ],
              [
                "da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a",
                "49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a",
              ],
              [
                "c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111",
                "5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4",
              ],
              [
                "4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502",
                "7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437",
              ],
              [
                "3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea",
                "be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7",
              ],
              [
                "cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26",
                "8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d",
              ],
              [
                "b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986",
                "39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a",
              ],
              [
                "d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e",
                "62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54",
              ],
              [
                "48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4",
                "25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77",
              ],
              [
                "dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda",
                "ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517",
              ],
              [
                "6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859",
                "cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10",
              ],
              [
                "e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f",
                "f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125",
              ],
              [
                "eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c",
                "6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e",
              ],
              [
                "13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942",
                "fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1",
              ],
              [
                "ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a",
                "1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2",
              ],
              [
                "b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80",
                "5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423",
              ],
              [
                "ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d",
                "438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8",
              ],
              [
                "8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1",
                "cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758",
              ],
              [
                "52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63",
                "c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375",
              ],
              [
                "e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352",
                "6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d",
              ],
              [
                "7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193",
                "ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec",
              ],
              [
                "5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00",
                "9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0",
              ],
              [
                "32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58",
                "ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c",
              ],
              [
                "e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7",
                "d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4",
              ],
              [
                "8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8",
                "c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f",
              ],
              [
                "4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e",
                "67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649",
              ],
              [
                "3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d",
                "cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826",
              ],
              [
                "674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b",
                "299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5",
              ],
              [
                "d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f",
                "f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87",
              ],
              [
                "30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6",
                "462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b",
              ],
              [
                "be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297",
                "62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc",
              ],
              [
                "93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a",
                "7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c",
              ],
              [
                "b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c",
                "ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f",
              ],
              [
                "d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52",
                "4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a",
              ],
              [
                "d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb",
                "bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46",
              ],
              [
                "463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065",
                "bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f",
              ],
              [
                "7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917",
                "603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03",
              ],
              [
                "74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9",
                "cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08",
              ],
              [
                "30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3",
                "553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8",
              ],
              [
                "9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57",
                "712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373",
              ],
              [
                "176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66",
                "ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3",
              ],
              [
                "75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8",
                "9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8",
              ],
              [
                "809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721",
                "9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1",
              ],
              [
                "1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180",
                "4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9",
              ],
            ],
          },
        };
      },
      {},
    ],
    97: [
      function (t, e, r) {
        "use strict";
        var i = r,
          n = t("bn.js"),
          o = t("minimalistic-assert"),
          s = t("minimalistic-crypto-utils");
        (i.assert = o),
          (i.toArray = s.toArray),
          (i.zero2 = s.zero2),
          (i.toHex = s.toHex),
          (i.encode = s.encode),
          (i.getNAF = function (t, e, r) {
            var i = new Array(Math.max(t.bitLength(), r) + 1);
            i.fill(0);
            for (
              var n = 1 << (e + 1), o = t.clone(), s = 0;
              s < i.length;
              s++
            ) {
              var a,
                f = o.andln(n - 1);
              o.isOdd()
                ? ((a = f > (n >> 1) - 1 ? (n >> 1) - f : f), o.isubn(a))
                : (a = 0),
                (i[s] = a),
                o.iushrn(1);
            }
            return i;
          }),
          (i.getJSF = function (t, e) {
            var r = [[], []];
            (t = t.clone()), (e = e.clone());
            for (var i, n = 0, o = 0; t.cmpn(-n) > 0 || e.cmpn(-o) > 0; ) {
              var s,
                a,
                f = (t.andln(3) + n) & 3,
                h = (e.andln(3) + o) & 3;
              3 === f && (f = -1),
                3 === h && (h = -1),
                (s =
                  0 == (1 & f)
                    ? 0
                    : (3 !== (i = (t.andln(7) + n) & 7) && 5 !== i) || 2 !== h
                    ? f
                    : -f),
                r[0].push(s),
                (a =
                  0 == (1 & h)
                    ? 0
                    : (3 !== (i = (e.andln(7) + o) & 7) && 5 !== i) || 2 !== f
                    ? h
                    : -h),
                r[1].push(a),
                2 * n === s + 1 && (n = 1 - n),
                2 * o === a + 1 && (o = 1 - o),
                t.iushrn(1),
                e.iushrn(1);
            }
            return r;
          }),
          (i.cachedProperty = function (t, e, r) {
            var i = "_" + e;
            t.prototype[e] = function () {
              return void 0 !== this[i] ? this[i] : (this[i] = r.call(this));
            };
          }),
          (i.parseBytes = function (t) {
            return "string" == typeof t ? i.toArray(t, "hex") : t;
          }),
          (i.intFromLE = function (t) {
            return new n(t, "hex", "le");
          });
      },
      {
        "bn.js": 98,
        "minimalistic-assert": 136,
        "minimalistic-crypto-utils": 137,
      },
    ],
    98: [
      function (t, e, r) {
        arguments[4][15][0].apply(r, arguments);
      },
      { buffer: 19, dup: 15 },
    ],
    99: [
      function (t, e, r) {
        e.exports = {
          _from: "elliptic@^6.5.3",
          _id: "elliptic@6.5.4",
          _inBundle: !1,
          _integrity:
            "sha512-iLhC6ULemrljPZb+QutR5TQGB+pdW6KGD5RSegS+8sorOZT+rdQFbsQFJgvN3eRqNALqJer4oQ16YvJHlU8hzQ==",
          _location: "/browserify/elliptic",
          _phantomChildren: {},
          _requested: {
            type: "range",
            registry: !0,
            raw: "elliptic@^6.5.3",
            name: "elliptic",
            escapedName: "elliptic",
            rawSpec: "^6.5.3",
            saveSpec: null,
            fetchSpec: "^6.5.3",
          },
          _requiredBy: [
            "/browserify/browserify-sign",
            "/browserify/create-ecdh",
          ],
          _resolved: "https://registry.npmjs.org/elliptic/-/elliptic-6.5.4.tgz",
          _shasum: "da37cebd31e79a1367e941b592ed1fbebd58abbb",
          _spec: "elliptic@^6.5.3",
          _where:
            "/Users/chris/.nvm/versions/node/v12.13.0/lib/node_modules/browserify/node_modules/browserify-sign",
          author: { name: "Fedor Indutny", email: "fedor@indutny.com" },
          bugs: { url: "https://github.com/indutny/elliptic/issues" },
          bundleDependencies: !1,
          dependencies: {
            "bn.js": "^4.11.9",
            brorand: "^1.1.0",
            "hash.js": "^1.0.0",
            "hmac-drbg": "^1.0.1",
            inherits: "^2.0.4",
            "minimalistic-assert": "^1.0.1",
            "minimalistic-crypto-utils": "^1.0.1",
          },
          deprecated: !1,
          description: "EC cryptography",
          devDependencies: {
            brfs: "^2.0.2",
            coveralls: "^3.1.0",
            eslint: "^7.6.0",
            grunt: "^1.2.1",
            "grunt-browserify": "^5.3.0",
            "grunt-cli": "^1.3.2",
            "grunt-contrib-connect": "^3.0.0",
            "grunt-contrib-copy": "^1.0.0",
            "grunt-contrib-uglify": "^5.0.0",
            "grunt-mocha-istanbul": "^5.0.2",
            "grunt-saucelabs": "^9.0.1",
            istanbul: "^0.4.5",
            mocha: "^8.0.1",
          },
          files: ["lib"],
          homepage: "https://github.com/indutny/elliptic",
          keywords: ["EC", "Elliptic", "curve", "Cryptography"],
          license: "MIT",
          main: "lib/elliptic.js",
          name: "elliptic",
          repository: {
            type: "git",
            url: "git+ssh://git@github.com/indutny/elliptic.git",
          },
          scripts: {
            lint: "eslint lib test",
            "lint:fix": "npm run lint -- --fix",
            test: "npm run lint && npm run unit",
            unit: "istanbul test _mocha --reporter=spec test/index.js",
            version: "grunt dist && git add dist/",
          },
          version: "6.5.4",
        };
      },
      {},
    ],
    100: [
      function (t, e, r) {
        "use strict";
        var i,
          n = "object" == typeof Reflect ? Reflect : null,
          o =
            n && "function" == typeof n.apply
              ? n.apply
              : function (t, e, r) {
                  return Function.prototype.apply.call(t, e, r);
                };
        i =
          n && "function" == typeof n.ownKeys
            ? n.ownKeys
            : Object.getOwnPropertySymbols
            ? function (t) {
                return Object.getOwnPropertyNames(t).concat(
                  Object.getOwnPropertySymbols(t)
                );
              }
            : function (t) {
                return Object.getOwnPropertyNames(t);
              };
        var s =
          Number.isNaN ||
          function (t) {
            return t != t;
          };
        function a() {
          a.init.call(this);
        }
        (e.exports = a),
          (e.exports.once = function (t, e) {
            return new Promise(function (r, i) {
              function n(r) {
                t.removeListener(e, o), i(r);
              }
              function o() {
                "function" == typeof t.removeListener &&
                  t.removeListener("error", n),
                  r([].slice.call(arguments));
              }
              y(t, e, o, { once: !0 }),
                "error" !== e &&
                  (function (t, e, r) {
                    "function" == typeof t.on && y(t, "error", e, r);
                  })(t, n, { once: !0 });
            });
          }),
          (a.EventEmitter = a),
          (a.prototype._events = void 0),
          (a.prototype._eventsCount = 0),
          (a.prototype._maxListeners = void 0);
        var f = 10;
        function h(t) {
          if ("function" != typeof t)
            throw new TypeError(
              'The "listener" argument must be of type Function. Received type ' +
                typeof t
            );
        }
        function u(t) {
          return void 0 === t._maxListeners
            ? a.defaultMaxListeners
            : t._maxListeners;
        }
        function c(t, e, r, i) {
          var n, o, s, a;
          if (
            (h(r),
            void 0 === (o = t._events)
              ? ((o = t._events = Object.create(null)), (t._eventsCount = 0))
              : (void 0 !== o.newListener &&
                  (t.emit("newListener", e, r.listener ? r.listener : r),
                  (o = t._events)),
                (s = o[e])),
            void 0 === s)
          )
            (s = o[e] = r), ++t._eventsCount;
          else if (
            ("function" == typeof s
              ? (s = o[e] = i ? [r, s] : [s, r])
              : i
              ? s.unshift(r)
              : s.push(r),
            (n = u(t)) > 0 && s.length > n && !s.warned)
          ) {
            s.warned = !0;
            var f = new Error(
              "Possible EventEmitter memory leak detected. " +
                s.length +
                " " +
                String(e) +
                " listeners added. Use emitter.setMaxListeners() to increase limit"
            );
            (f.name = "MaxListenersExceededWarning"),
              (f.emitter = t),
              (f.type = e),
              (f.count = s.length),
              (a = f),
              console && console.warn && console.warn(a);
          }
          return t;
        }
        function d() {
          if (!this.fired)
            return (
              this.target.removeListener(this.type, this.wrapFn),
              (this.fired = !0),
              0 === arguments.length
                ? this.listener.call(this.target)
                : this.listener.apply(this.target, arguments)
            );
        }
        function l(t, e, r) {
          var i = {
              fired: !1,
              wrapFn: void 0,
              target: t,
              type: e,
              listener: r,
            },
            n = d.bind(i);
          return (n.listener = r), (i.wrapFn = n), n;
        }
        function p(t, e, r) {
          var i = t._events;
          if (void 0 === i) return [];
          var n = i[e];
          return void 0 === n
            ? []
            : "function" == typeof n
            ? r
              ? [n.listener || n]
              : [n]
            : r
            ? (function (t) {
                for (var e = new Array(t.length), r = 0; r < e.length; ++r)
                  e[r] = t[r].listener || t[r];
                return e;
              })(n)
            : m(n, n.length);
        }
        function b(t) {
          var e = this._events;
          if (void 0 !== e) {
            var r = e[t];
            if ("function" == typeof r) return 1;
            if (void 0 !== r) return r.length;
          }
          return 0;
        }
        function m(t, e) {
          for (var r = new Array(e), i = 0; i < e; ++i) r[i] = t[i];
          return r;
        }
        function y(t, e, r, i) {
          if ("function" == typeof t.on) i.once ? t.once(e, r) : t.on(e, r);
          else {
            if ("function" != typeof t.addEventListener)
              throw new TypeError(
                'The "emitter" argument must be of type EventEmitter. Received type ' +
                  typeof t
              );
            t.addEventListener(e, function n(o) {
              i.once && t.removeEventListener(e, n), r(o);
            });
          }
        }
        Object.defineProperty(a, "defaultMaxListeners", {
          enumerable: !0,
          get: function () {
            return f;
          },
          set: function (t) {
            if ("number" != typeof t || t < 0 || s(t))
              throw new RangeError(
                'The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' +
                  t +
                  "."
              );
            f = t;
          },
        }),
          (a.init = function () {
            (void 0 !== this._events &&
              this._events !== Object.getPrototypeOf(this)._events) ||
              ((this._events = Object.create(null)), (this._eventsCount = 0)),
              (this._maxListeners = this._maxListeners || void 0);
          }),
          (a.prototype.setMaxListeners = function (t) {
            if ("number" != typeof t || t < 0 || s(t))
              throw new RangeError(
                'The value of "n" is out of range. It must be a non-negative number. Received ' +
                  t +
                  "."
              );
            return (this._maxListeners = t), this;
          }),
          (a.prototype.getMaxListeners = function () {
            return u(this);
          }),
          (a.prototype.emit = function (t) {
            for (var e = [], r = 1; r < arguments.length; r++)
              e.push(arguments[r]);
            var i = "error" === t,
              n = this._events;
            if (void 0 !== n) i = i && void 0 === n.error;
            else if (!i) return !1;
            if (i) {
              var s;
              if ((e.length > 0 && (s = e[0]), s instanceof Error)) throw s;
              var a = new Error(
                "Unhandled error." + (s ? " (" + s.message + ")" : "")
              );
              throw ((a.context = s), a);
            }
            var f = n[t];
            if (void 0 === f) return !1;
            if ("function" == typeof f) o(f, this, e);
            else {
              var h = f.length,
                u = m(f, h);
              for (r = 0; r < h; ++r) o(u[r], this, e);
            }
            return !0;
          }),
          (a.prototype.addListener = function (t, e) {
            return c(this, t, e, !1);
          }),
          (a.prototype.on = a.prototype.addListener),
          (a.prototype.prependListener = function (t, e) {
            return c(this, t, e, !0);
          }),
          (a.prototype.once = function (t, e) {
            return h(e), this.on(t, l(this, t, e)), this;
          }),
          (a.prototype.prependOnceListener = function (t, e) {
            return h(e), this.prependListener(t, l(this, t, e)), this;
          }),
          (a.prototype.removeListener = function (t, e) {
            var r, i, n, o, s;
            if ((h(e), void 0 === (i = this._events))) return this;
            if (void 0 === (r = i[t])) return this;
            if (r === e || r.listener === e)
              0 == --this._eventsCount
                ? (this._events = Object.create(null))
                : (delete i[t],
                  i.removeListener &&
                    this.emit("removeListener", t, r.listener || e));
            else if ("function" != typeof r) {
              for (n = -1, o = r.length - 1; o >= 0; o--)
                if (r[o] === e || r[o].listener === e) {
                  (s = r[o].listener), (n = o);
                  break;
                }
              if (n < 0) return this;
              0 === n
                ? r.shift()
                : (function (t, e) {
                    for (; e + 1 < t.length; e++) t[e] = t[e + 1];
                    t.pop();
                  })(r, n),
                1 === r.length && (i[t] = r[0]),
                void 0 !== i.removeListener &&
                  this.emit("removeListener", t, s || e);
            }
            return this;
          }),
          (a.prototype.off = a.prototype.removeListener),
          (a.prototype.removeAllListeners = function (t) {
            var e, r, i;
            if (void 0 === (r = this._events)) return this;
            if (void 0 === r.removeListener)
              return (
                0 === arguments.length
                  ? ((this._events = Object.create(null)),
                    (this._eventsCount = 0))
                  : void 0 !== r[t] &&
                    (0 == --this._eventsCount
                      ? (this._events = Object.create(null))
                      : delete r[t]),
                this
              );
            if (0 === arguments.length) {
              var n,
                o = Object.keys(r);
              for (i = 0; i < o.length; ++i)
                "removeListener" !== (n = o[i]) && this.removeAllListeners(n);
              return (
                this.removeAllListeners("removeListener"),
                (this._events = Object.create(null)),
                (this._eventsCount = 0),
                this
              );
            }
            if ("function" == typeof (e = r[t])) this.removeListener(t, e);
            else if (void 0 !== e)
              for (i = e.length - 1; i >= 0; i--) this.removeListener(t, e[i]);
            return this;
          }),
          (a.prototype.listeners = function (t) {
            return p(this, t, !0);
          }),
          (a.prototype.rawListeners = function (t) {
            return p(this, t, !1);
          }),
          (a.listenerCount = function (t, e) {
            return "function" == typeof t.listenerCount
              ? t.listenerCount(e)
              : b.call(t, e);
          }),
          (a.prototype.listenerCount = b),
          (a.prototype.eventNames = function () {
            return this._eventsCount > 0 ? i(this._events) : [];
          });
      },
      {},
    ],
    101: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer,
          n = t("md5.js");
        e.exports = function (t, e, r, o) {
          if (
            (i.isBuffer(t) || (t = i.from(t, "binary")),
            e && (i.isBuffer(e) || (e = i.from(e, "binary")), 8 !== e.length))
          )
            throw new RangeError("salt should be Buffer with 8 byte length");
          for (
            var s = r / 8, a = i.alloc(s), f = i.alloc(o || 0), h = i.alloc(0);
            s > 0 || o > 0;

          ) {
            var u = new n();
            u.update(h), u.update(t), e && u.update(e), (h = u.digest());
            var c = 0;
            if (s > 0) {
              var d = a.length - s;
              (c = Math.min(s, h.length)), h.copy(a, d, 0, c), (s -= c);
            }
            if (c < h.length && o > 0) {
              var l = f.length - o,
                p = Math.min(o, h.length - c);
              h.copy(f, l, c, c + p), (o -= p);
            }
          }
          return h.fill(0), { key: a, iv: f };
        };
      },
      { "md5.js": 133, "safe-buffer": 160 },
    ],
    102: [
      function (t, e, r) {
        "use strict";
        var i = t("safe-buffer").Buffer,
          n = t("readable-stream").Transform;
        function o(t) {
          n.call(this),
            (this._block = i.allocUnsafe(t)),
            (this._blockSize = t),
            (this._blockOffset = 0),
            (this._length = [0, 0, 0, 0]),
            (this._finalized = !1);
        }
        t("inherits")(o, n),
          (o.prototype._transform = function (t, e, r) {
            var i = null;
            try {
              this.update(t, e);
            } catch (t) {
              i = t;
            }
            r(i);
          }),
          (o.prototype._flush = function (t) {
            var e = null;
            try {
              this.push(this.digest());
            } catch (t) {
              e = t;
            }
            t(e);
          }),
          (o.prototype.update = function (t, e) {
            if (
              ((function (t, e) {
                if (!i.isBuffer(t) && "string" != typeof t)
                  throw new TypeError(e + " must be a string or a buffer");
              })(t, "Data"),
              this._finalized)
            )
              throw new Error("Digest already called");
            i.isBuffer(t) || (t = i.from(t, e));
            for (
              var r = this._block, n = 0;
              this._blockOffset + t.length - n >= this._blockSize;

            ) {
              for (var o = this._blockOffset; o < this._blockSize; )
                r[o++] = t[n++];
              this._update(), (this._blockOffset = 0);
            }
            for (; n < t.length; ) r[this._blockOffset++] = t[n++];
            for (var s = 0, a = 8 * t.length; a > 0; ++s)
              (this._length[s] += a),
                (a = (this._length[s] / 4294967296) | 0) > 0 &&
                  (this._length[s] -= 4294967296 * a);
            return this;
          }),
          (o.prototype._update = function () {
            throw new Error("_update is not implemented");
          }),
          (o.prototype.digest = function (t) {
            if (this._finalized) throw new Error("Digest already called");
            this._finalized = !0;
            var e = this._digest();
            void 0 !== t && (e = e.toString(t)),
              this._block.fill(0),
              (this._blockOffset = 0);
            for (var r = 0; r < 4; ++r) this._length[r] = 0;
            return e;
          }),
          (o.prototype._digest = function () {
            throw new Error("_digest is not implemented");
          }),
          (e.exports = o);
      },
      { inherits: 132, "readable-stream": 117, "safe-buffer": 160 },
    ],
    103: [
      function (t, e, r) {
        arguments[4][47][0].apply(r, arguments);
      },
      { dup: 47 },
    ],
    104: [
      function (t, e, r) {
        arguments[4][48][0].apply(r, arguments);
      },
      {
        "./_stream_readable": 106,
        "./_stream_writable": 108,
        _process: 149,
        dup: 48,
        inherits: 132,
      },
    ],
    105: [
      function (t, e, r) {
        arguments[4][49][0].apply(r, arguments);
      },
      { "./_stream_transform": 107, dup: 49, inherits: 132 },
    ],
    106: [
      function (t, e, r) {
        arguments[4][50][0].apply(r, arguments);
      },
      {
        "../errors": 103,
        "./_stream_duplex": 104,
        "./internal/streams/async_iterator": 109,
        "./internal/streams/buffer_list": 110,
        "./internal/streams/destroy": 111,
        "./internal/streams/from": 113,
        "./internal/streams/state": 115,
        "./internal/streams/stream": 116,
        _process: 149,
        buffer: 63,
        dup: 50,
        events: 100,
        inherits: 132,
        "string_decoder/": 185,
        util: 19,
      },
    ],
    107: [
      function (t, e, r) {
        arguments[4][51][0].apply(r, arguments);
      },
      { "../errors": 103, "./_stream_duplex": 104, dup: 51, inherits: 132 },
    ],
    108: [
      function (t, e, r) {
        arguments[4][52][0].apply(r, arguments);
      },
      {
        "../errors": 103,
        "./_stream_duplex": 104,
        "./internal/streams/destroy": 111,
        "./internal/streams/state": 115,
        "./internal/streams/stream": 116,
        _process: 149,
        buffer: 63,
        dup: 52,
        inherits: 132,
        "util-deprecate": 186,
      },
    ],
    109: [
      function (t, e, r) {
        arguments[4][53][0].apply(r, arguments);
      },
      { "./end-of-stream": 112, _process: 149, dup: 53 },
    ],
    110: [
      function (t, e, r) {
        arguments[4][54][0].apply(r, arguments);
      },
      { buffer: 63, dup: 54, util: 19 },
    ],
    111: [
      function (t, e, r) {
        arguments[4][55][0].apply(r, arguments);
      },
      { _process: 149, dup: 55 },
    ],
    112: [
      function (t, e, r) {
        arguments[4][56][0].apply(r, arguments);
      },
      { "../../../errors": 103, dup: 56 },
    ],
    113: [
      function (t, e, r) {
        arguments[4][57][0].apply(r, arguments);
      },
      { dup: 57 },
    ],
    114: [
      function (t, e, r) {
        arguments[4][58][0].apply(r, arguments);
      },
      { "../../../errors": 103, "./end-of-stream": 112, dup: 58 },
    ],
    115: [
      function (t, e, r) {
        arguments[4][59][0].apply(r, arguments);
      },
      { "../../../errors": 103, dup: 59 },
    ],
    116: [
      function (t, e, r) {
        arguments[4][60][0].apply(r, arguments);
      },
      { dup: 60, events: 100 },
    ],
    117: [
      function (t, e, r) {
        arguments[4][61][0].apply(r, arguments);
      },
      {
        "./lib/_stream_duplex.js": 104,
        "./lib/_stream_passthrough.js": 105,
        "./lib/_stream_readable.js": 106,
        "./lib/_stream_transform.js": 107,
        "./lib/_stream_writable.js": 108,
        "./lib/internal/streams/end-of-stream.js": 112,
        "./lib/internal/streams/pipeline.js": 114,
        dup: 61,
      },
    ],
    118: [
      function (t, e, r) {
        var i = r;
        (i.utils = t("./hash/utils")),
          (i.common = t("./hash/common")),
          (i.sha = t("./hash/sha")),
          (i.ripemd = t("./hash/ripemd")),
          (i.hmac = t("./hash/hmac")),
          (i.sha1 = i.sha.sha1),
          (i.sha256 = i.sha.sha256),
          (i.sha224 = i.sha.sha224),
          (i.sha384 = i.sha.sha384),
          (i.sha512 = i.sha.sha512),
          (i.ripemd160 = i.ripemd.ripemd160);
      },
      {
        "./hash/common": 119,
        "./hash/hmac": 120,
        "./hash/ripemd": 121,
        "./hash/sha": 122,
        "./hash/utils": 129,
      },
    ],
    119: [
      function (t, e, r) {
        "use strict";
        var i = t("./utils"),
          n = t("minimalistic-assert");
        function o() {
          (this.pending = null),
            (this.pendingTotal = 0),
            (this.blockSize = this.constructor.blockSize),
            (this.outSize = this.constructor.outSize),
            (this.hmacStrength = this.constructor.hmacStrength),
            (this.padLength = this.constructor.padLength / 8),
            (this.endian = "big"),
            (this._delta8 = this.blockSize / 8),
            (this._delta32 = this.blockSize / 32);
        }
        (r.BlockHash = o),
          (o.prototype.update = function (t, e) {
            if (
              ((t = i.toArray(t, e)),
              this.pending
                ? (this.pending = this.pending.concat(t))
                : (this.pending = t),
              (this.pendingTotal += t.length),
              this.pending.length >= this._delta8)
            ) {
              var r = (t = this.pending).length % this._delta8;
              (this.pending = t.slice(t.length - r, t.length)),
                0 === this.pending.length && (this.pending = null),
                (t = i.join32(t, 0, t.length - r, this.endian));
              for (var n = 0; n < t.length; n += this._delta32)
                this._update(t, n, n + this._delta32);
            }
            return this;
          }),
          (o.prototype.digest = function (t) {
            return (
              this.update(this._pad()),
              n(null === this.pending),
              this._digest(t)
            );
          }),
          (o.prototype._pad = function () {
            var t = this.pendingTotal,
              e = this._delta8,
              r = e - ((t + this.padLength) % e),
              i = new Array(r + this.padLength);
            i[0] = 128;
            for (var n = 1; n < r; n++) i[n] = 0;
            if (((t <<= 3), "big" === this.endian)) {
              for (var o = 8; o < this.padLength; o++) i[n++] = 0;
              (i[n++] = 0),
                (i[n++] = 0),
                (i[n++] = 0),
                (i[n++] = 0),
                (i[n++] = (t >>> 24) & 255),
                (i[n++] = (t >>> 16) & 255),
                (i[n++] = (t >>> 8) & 255),
                (i[n++] = 255 & t);
            } else
              for (
                i[n++] = 255 & t,
                  i[n++] = (t >>> 8) & 255,
                  i[n++] = (t >>> 16) & 255,
                  i[n++] = (t >>> 24) & 255,
                  i[n++] = 0,
                  i[n++] = 0,
                  i[n++] = 0,
                  i[n++] = 0,
                  o = 8;
                o < this.padLength;
                o++
              )
                i[n++] = 0;
            return i;
          });
      },
      { "./utils": 129, "minimalistic-assert": 136 },
    ],
    120: [
      function (t, e, r) {
        "use strict";
        var i = t("./utils"),
          n = t("minimalistic-assert");
        function o(t, e, r) {
          if (!(this instanceof o)) return new o(t, e, r);
          (this.Hash = t),
            (this.blockSize = t.blockSize / 8),
            (this.outSize = t.outSize / 8),
            (this.inner = null),
            (this.outer = null),
            this._init(i.toArray(e, r));
        }
        (e.exports = o),
          (o.prototype._init = function (t) {
            t.length > this.blockSize &&
              (t = new this.Hash().update(t).digest()),
              n(t.length <= this.blockSize);
            for (var e = t.length; e < this.blockSize; e++) t.push(0);
            for (e = 0; e < t.length; e++) t[e] ^= 54;
            for (
              this.inner = new this.Hash().update(t), e = 0;
              e < t.length;
              e++
            )
              t[e] ^= 106;
            this.outer = new this.Hash().update(t);
          }),
          (o.prototype.update = function (t, e) {
            return this.inner.update(t, e), this;
          }),
          (o.prototype.digest = function (t) {
            return this.outer.update(this.inner.digest()), this.outer.digest(t);
          });
      },
      { "./utils": 129, "minimalistic-assert": 136 },
    ],
    121: [
      function (t, e, r) {
        "use strict";
        var i = t("./utils"),
          n = t("./common"),
          o = i.rotl32,
          s = i.sum32,
          a = i.sum32_3,
          f = i.sum32_4,
          h = n.BlockHash;
        function u() {
          if (!(this instanceof u)) return new u();
          h.call(this),
            (this.h = [
              1732584193, 4023233417, 2562383102, 271733878, 3285377520,
            ]),
            (this.endian = "little");
        }
        function c(t, e, r, i) {
          return t <= 15
            ? e ^ r ^ i
            : t <= 31
            ? (e & r) | (~e & i)
            : t <= 47
            ? (e | ~r) ^ i
            : t <= 63
            ? (e & i) | (r & ~i)
            : e ^ (r | ~i);
        }
        function d(t) {
          return t <= 15
            ? 0
            : t <= 31
            ? 1518500249
            : t <= 47
            ? 1859775393
            : t <= 63
            ? 2400959708
            : 2840853838;
        }
        function l(t) {
          return t <= 15
            ? 1352829926
            : t <= 31
            ? 1548603684
            : t <= 47
            ? 1836072691
            : t <= 63
            ? 2053994217
            : 0;
        }
        i.inherits(u, h),
          (r.ripemd160 = u),
          (u.blockSize = 512),
          (u.outSize = 160),
          (u.hmacStrength = 192),
          (u.padLength = 64),
          (u.prototype._update = function (t, e) {
            for (
              var r = this.h[0],
                i = this.h[1],
                n = this.h[2],
                h = this.h[3],
                u = this.h[4],
                g = r,
                v = i,
                w = n,
                _ = h,
                M = u,
                S = 0;
              S < 80;
              S++
            ) {
              var E = s(o(f(r, c(S, i, n, h), t[p[S] + e], d(S)), m[S]), u);
              (r = u),
                (u = h),
                (h = o(n, 10)),
                (n = i),
                (i = E),
                (E = s(
                  o(f(g, c(79 - S, v, w, _), t[b[S] + e], l(S)), y[S]),
                  M
                )),
                (g = M),
                (M = _),
                (_ = o(w, 10)),
                (w = v),
                (v = E);
            }
            (E = a(this.h[1], n, _)),
              (this.h[1] = a(this.h[2], h, M)),
              (this.h[2] = a(this.h[3], u, g)),
              (this.h[3] = a(this.h[4], r, v)),
              (this.h[4] = a(this.h[0], i, w)),
              (this.h[0] = E);
          }),
          (u.prototype._digest = function (t) {
            return "hex" === t
              ? i.toHex32(this.h, "little")
              : i.split32(this.h, "little");
          });
        var p = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1,
            10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1,
            2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15,
            14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
          ],
          b = [
            5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7,
            0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9,
            11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13,
            9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
          ],
          m = [
            11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13,
            11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13,
            15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14,
            5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8,
            5, 6,
          ],
          y = [
            8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15,
            7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6,
            14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9,
            12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13,
            11, 11,
          ];
      },
      { "./common": 119, "./utils": 129 },
    ],
    122: [
      function (t, e, r) {
        "use strict";
        (r.sha1 = t("./sha/1")),
          (r.sha224 = t("./sha/224")),
          (r.sha256 = t("./sha/256")),
          (r.sha384 = t("./sha/384")),
          (r.sha512 = t("./sha/512"));
      },
      {
        "./sha/1": 123,
        "./sha/224": 124,
        "./sha/256": 125,
        "./sha/384": 126,
        "./sha/512": 127,
      },
    ],
    123: [
      function (t, e, r) {
        "use strict";
        var i = t("../utils"),
          n = t("../common"),
          o = t("./common"),
          s = i.rotl32,
          a = i.sum32,
          f = i.sum32_5,
          h = o.ft_1,
          u = n.BlockHash,
          c = [1518500249, 1859775393, 2400959708, 3395469782];
        function d() {
          if (!(this instanceof d)) return new d();
          u.call(this),
            (this.h = [
              1732584193, 4023233417, 2562383102, 271733878, 3285377520,
            ]),
            (this.W = new Array(80));
        }
        i.inherits(d, u),
          (e.exports = d),
          (d.blockSize = 512),
          (d.outSize = 160),
          (d.hmacStrength = 80),
          (d.padLength = 64),
          (d.prototype._update = function (t, e) {
            for (var r = this.W, i = 0; i < 16; i++) r[i] = t[e + i];
            for (; i < r.length; i++)
              r[i] = s(r[i - 3] ^ r[i - 8] ^ r[i - 14] ^ r[i - 16], 1);
            var n = this.h[0],
              o = this.h[1],
              u = this.h[2],
              d = this.h[3],
              l = this.h[4];
            for (i = 0; i < r.length; i++) {
              var p = ~~(i / 20),
                b = f(s(n, 5), h(p, o, u, d), l, r[i], c[p]);
              (l = d), (d = u), (u = s(o, 30)), (o = n), (n = b);
            }
            (this.h[0] = a(this.h[0], n)),
              (this.h[1] = a(this.h[1], o)),
              (this.h[2] = a(this.h[2], u)),
              (this.h[3] = a(this.h[3], d)),
              (this.h[4] = a(this.h[4], l));
          }),
          (d.prototype._digest = function (t) {
            return "hex" === t
              ? i.toHex32(this.h, "big")
              : i.split32(this.h, "big");
          });
      },
      { "../common": 119, "../utils": 129, "./common": 128 },
    ],
    124: [
      function (t, e, r) {
        "use strict";
        var i = t("../utils"),
          n = t("./256");
        function o() {
          if (!(this instanceof o)) return new o();
          n.call(this),
            (this.h = [
              3238371032, 914150663, 812702999, 4144912697, 4290775857,
              1750603025, 1694076839, 3204075428,
            ]);
        }
        i.inherits(o, n),
          (e.exports = o),
          (o.blockSize = 512),
          (o.outSize = 224),
          (o.hmacStrength = 192),
          (o.padLength = 64),
          (o.prototype._digest = function (t) {
            return "hex" === t
              ? i.toHex32(this.h.slice(0, 7), "big")
              : i.split32(this.h.slice(0, 7), "big");
          });
      },
      { "../utils": 129, "./256": 125 },
    ],
    125: [
      function (t, e, r) {
        "use strict";
        var i = t("../utils"),
          n = t("../common"),
          o = t("./common"),
          s = t("minimalistic-assert"),
          a = i.sum32,
          f = i.sum32_4,
          h = i.sum32_5,
          u = o.ch32,
          c = o.maj32,
          d = o.s0_256,
          l = o.s1_256,
          p = o.g0_256,
          b = o.g1_256,
          m = n.BlockHash,
          y = [
            1116352408, 1899447441, 3049323471, 3921009573, 961987163,
            1508970993, 2453635748, 2870763221, 3624381080, 310598401,
            607225278, 1426881987, 1925078388, 2162078206, 2614888103,
            3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983,
            1249150122, 1555081692, 1996064986, 2554220882, 2821834349,
            2952996808, 3210313671, 3336571891, 3584528711, 113926993,
            338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700,
            1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
            3259730800, 3345764771, 3516065817, 3600352804, 4094571909,
            275423344, 430227734, 506948616, 659060556, 883997877, 958139571,
            1322822218, 1537002063, 1747873779, 1955562222, 2024104815,
            2227730452, 2361852424, 2428436474, 2756734187, 3204031479,
            3329325298,
          ];
        function g() {
          if (!(this instanceof g)) return new g();
          m.call(this),
            (this.h = [
              1779033703, 3144134277, 1013904242, 2773480762, 1359893119,
              2600822924, 528734635, 1541459225,
            ]),
            (this.k = y),
            (this.W = new Array(64));
        }
        i.inherits(g, m),
          (e.exports = g),
          (g.blockSize = 512),
          (g.outSize = 256),
          (g.hmacStrength = 192),
          (g.padLength = 64),
          (g.prototype._update = function (t, e) {
            for (var r = this.W, i = 0; i < 16; i++) r[i] = t[e + i];
            for (; i < r.length; i++)
              r[i] = f(b(r[i - 2]), r[i - 7], p(r[i - 15]), r[i - 16]);
            var n = this.h[0],
              o = this.h[1],
              m = this.h[2],
              y = this.h[3],
              g = this.h[4],
              v = this.h[5],
              w = this.h[6],
              _ = this.h[7];
            for (s(this.k.length === r.length), i = 0; i < r.length; i++) {
              var M = h(_, l(g), u(g, v, w), this.k[i], r[i]),
                S = a(d(n), c(n, o, m));
              (_ = w),
                (w = v),
                (v = g),
                (g = a(y, M)),
                (y = m),
                (m = o),
                (o = n),
                (n = a(M, S));
            }
            (this.h[0] = a(this.h[0], n)),
              (this.h[1] = a(this.h[1], o)),
              (this.h[2] = a(this.h[2], m)),
              (this.h[3] = a(this.h[3], y)),
              (this.h[4] = a(this.h[4], g)),
              (this.h[5] = a(this.h[5], v)),
              (this.h[6] = a(this.h[6], w)),
              (this.h[7] = a(this.h[7], _));
          }),
          (g.prototype._digest = function (t) {
            return "hex" === t
              ? i.toHex32(this.h, "big")
              : i.split32(this.h, "big");
          });
      },
      {
        "../common": 119,
        "../utils": 129,
        "./common": 128,
        "minimalistic-assert": 136,
      },
    ],
    126: [
      function (t, e, r) {
        "use strict";
        var i = t("../utils"),
          n = t("./512");
        function o() {
          if (!(this instanceof o)) return new o();
          n.call(this),
            (this.h = [
              3418070365, 3238371032, 1654270250, 914150663, 2438529370,
              812702999, 355462360, 4144912697, 1731405415, 4290775857,
              2394180231, 1750603025, 3675008525, 1694076839, 1203062813,
              3204075428,
            ]);
        }
        i.inherits(o, n),
          (e.exports = o),
          (o.blockSize = 1024),
          (o.outSize = 384),
          (o.hmacStrength = 192),
          (o.padLength = 128),
          (o.prototype._digest = function (t) {
            return "hex" === t
              ? i.toHex32(this.h.slice(0, 12), "big")
              : i.split32(this.h.slice(0, 12), "big");
          });
      },
      { "../utils": 129, "./512": 127 },
    ],
    127: [
      function (t, e, r) {
        "use strict";
        var i = t("../utils"),
          n = t("../common"),
          o = t("minimalistic-assert"),
          s = i.rotr64_hi,
          a = i.rotr64_lo,
          f = i.shr64_hi,
          h = i.shr64_lo,
          u = i.sum64,
          c = i.sum64_hi,
          d = i.sum64_lo,
          l = i.sum64_4_hi,
          p = i.sum64_4_lo,
          b = i.sum64_5_hi,
          m = i.sum64_5_lo,
          y = n.BlockHash,
          g = [
            1116352408, 3609767458, 1899447441, 602891725, 3049323471,
            3964484399, 3921009573, 2173295548, 961987163, 4081628472,
            1508970993, 3053834265, 2453635748, 2937671579, 2870763221,
            3664609560, 3624381080, 2734883394, 310598401, 1164996542,
            607225278, 1323610764, 1426881987, 3590304994, 1925078388,
            4068182383, 2162078206, 991336113, 2614888103, 633803317,
            3248222580, 3479774868, 3835390401, 2666613458, 4022224774,
            944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983,
            1495990901, 1249150122, 1856431235, 1555081692, 3175218132,
            1996064986, 2198950837, 2554220882, 3999719339, 2821834349,
            766784016, 2952996808, 2566594879, 3210313671, 3203337956,
            3336571891, 1034457026, 3584528711, 2466948901, 113926993,
            3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912,
            1546045734, 1294757372, 1522805485, 1396182291, 2643833823,
            1695183700, 2343527390, 1986661051, 1014477480, 2177026350,
            1206759142, 2456956037, 344077627, 2730485921, 1290863460,
            2820302411, 3158454273, 3259730800, 3505952657, 3345764771,
            106217008, 3516065817, 3606008344, 3600352804, 1432725776,
            4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752,
            506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280,
            958139571, 3318307427, 1322822218, 3812723403, 1537002063,
            2003034995, 1747873779, 3602036899, 1955562222, 1575990012,
            2024104815, 1125592928, 2227730452, 2716904306, 2361852424,
            442776044, 2428436474, 593698344, 2756734187, 3733110249,
            3204031479, 2999351573, 3329325298, 3815920427, 3391569614,
            3928383900, 3515267271, 566280711, 3940187606, 3454069534,
            4118630271, 4000239992, 116418474, 1914138554, 174292421,
            2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733,
            587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580,
            2618297676, 1288033470, 3409855158, 1501505948, 4234509866,
            1607167915, 987167468, 1816402316, 1246189591,
          ];
        function v() {
          if (!(this instanceof v)) return new v();
          y.call(this),
            (this.h = [
              1779033703, 4089235720, 3144134277, 2227873595, 1013904242,
              4271175723, 2773480762, 1595750129, 1359893119, 2917565137,
              2600822924, 725511199, 528734635, 4215389547, 1541459225,
              327033209,
            ]),
            (this.k = g),
            (this.W = new Array(160));
        }
        function w(t, e, r, i, n) {
          var o = (t & r) ^ (~t & n);
          return o < 0 && (o += 4294967296), o;
        }
        function _(t, e, r, i, n, o) {
          var s = (e & i) ^ (~e & o);
          return s < 0 && (s += 4294967296), s;
        }
        function M(t, e, r, i, n) {
          var o = (t & r) ^ (t & n) ^ (r & n);
          return o < 0 && (o += 4294967296), o;
        }
        function S(t, e, r, i, n, o) {
          var s = (e & i) ^ (e & o) ^ (i & o);
          return s < 0 && (s += 4294967296), s;
        }
        function E(t, e) {
          var r = s(t, e, 28) ^ s(e, t, 2) ^ s(e, t, 7);
          return r < 0 && (r += 4294967296), r;
        }
        function A(t, e) {
          var r = a(t, e, 28) ^ a(e, t, 2) ^ a(e, t, 7);
          return r < 0 && (r += 4294967296), r;
        }
        function k(t, e) {
          var r = s(t, e, 14) ^ s(t, e, 18) ^ s(e, t, 9);
          return r < 0 && (r += 4294967296), r;
        }
        function B(t, e) {
          var r = a(t, e, 14) ^ a(t, e, 18) ^ a(e, t, 9);
          return r < 0 && (r += 4294967296), r;
        }
        function x(t, e) {
          var r = s(t, e, 1) ^ s(t, e, 8) ^ f(t, e, 7);
          return r < 0 && (r += 4294967296), r;
        }
        function I(t, e) {
          var r = a(t, e, 1) ^ a(t, e, 8) ^ h(t, e, 7);
          return r < 0 && (r += 4294967296), r;
        }
        function R(t, e) {
          var r = s(t, e, 19) ^ s(e, t, 29) ^ f(t, e, 6);
          return r < 0 && (r += 4294967296), r;
        }
        function j(t, e) {
          var r = a(t, e, 19) ^ a(e, t, 29) ^ h(t, e, 6);
          return r < 0 && (r += 4294967296), r;
        }
        i.inherits(v, y),
          (e.exports = v),
          (v.blockSize = 1024),
          (v.outSize = 512),
          (v.hmacStrength = 192),
          (v.padLength = 128),
          (v.prototype._prepareBlock = function (t, e) {
            for (var r = this.W, i = 0; i < 32; i++) r[i] = t[e + i];
            for (; i < r.length; i += 2) {
              var n = R(r[i - 4], r[i - 3]),
                o = j(r[i - 4], r[i - 3]),
                s = r[i - 14],
                a = r[i - 13],
                f = x(r[i - 30], r[i - 29]),
                h = I(r[i - 30], r[i - 29]),
                u = r[i - 32],
                c = r[i - 31];
              (r[i] = l(n, o, s, a, f, h, u, c)),
                (r[i + 1] = p(n, o, s, a, f, h, u, c));
            }
          }),
          (v.prototype._update = function (t, e) {
            this._prepareBlock(t, e);
            var r = this.W,
              i = this.h[0],
              n = this.h[1],
              s = this.h[2],
              a = this.h[3],
              f = this.h[4],
              h = this.h[5],
              l = this.h[6],
              p = this.h[7],
              y = this.h[8],
              g = this.h[9],
              v = this.h[10],
              x = this.h[11],
              I = this.h[12],
              R = this.h[13],
              j = this.h[14],
              T = this.h[15];
            o(this.k.length === r.length);
            for (var L = 0; L < r.length; L += 2) {
              var C = j,
                P = T,
                O = k(y, g),
                U = B(y, g),
                D = w(y, g, v, x, I),
                N = _(y, g, v, x, I, R),
                q = this.k[L],
                z = this.k[L + 1],
                F = r[L],
                K = r[L + 1],
                H = b(C, P, O, U, D, N, q, z, F, K),
                W = m(C, P, O, U, D, N, q, z, F, K);
              (C = E(i, n)),
                (P = A(i, n)),
                (O = M(i, n, s, a, f)),
                (U = S(i, n, s, a, f, h));
              var V = c(C, P, O, U),
                Z = d(C, P, O, U);
              (j = I),
                (T = R),
                (I = v),
                (R = x),
                (v = y),
                (x = g),
                (y = c(l, p, H, W)),
                (g = d(p, p, H, W)),
                (l = f),
                (p = h),
                (f = s),
                (h = a),
                (s = i),
                (a = n),
                (i = c(H, W, V, Z)),
                (n = d(H, W, V, Z));
            }
            u(this.h, 0, i, n),
              u(this.h, 2, s, a),
              u(this.h, 4, f, h),
              u(this.h, 6, l, p),
              u(this.h, 8, y, g),
              u(this.h, 10, v, x),
              u(this.h, 12, I, R),
              u(this.h, 14, j, T);
          }),
          (v.prototype._digest = function (t) {
            return "hex" === t
              ? i.toHex32(this.h, "big")
              : i.split32(this.h, "big");
          });
      },
      { "../common": 119, "../utils": 129, "minimalistic-assert": 136 },
    ],
    128: [
      function (t, e, r) {
        "use strict";
        var i = t("../utils").rotr32;
        function n(t, e, r) {
          return (t & e) ^ (~t & r);
        }
        function o(t, e, r) {
          return (t & e) ^ (t & r) ^ (e & r);
        }
        function s(t, e, r) {
          return t ^ e ^ r;
        }
        (r.ft_1 = function (t, e, r, i) {
          return 0 === t
            ? n(e, r, i)
            : 1 === t || 3 === t
            ? s(e, r, i)
            : 2 === t
            ? o(e, r, i)
            : void 0;
        }),
          (r.ch32 = n),
          (r.maj32 = o),
          (r.p32 = s),
          (r.s0_256 = function (t) {
            return i(t, 2) ^ i(t, 13) ^ i(t, 22);
          }),
          (r.s1_256 = function (t) {
            return i(t, 6) ^ i(t, 11) ^ i(t, 25);
          }),
          (r.g0_256 = function (t) {
            return i(t, 7) ^ i(t, 18) ^ (t >>> 3);
          }),
          (r.g1_256 = function (t) {
            return i(t, 17) ^ i(t, 19) ^ (t >>> 10);
          });
      },
      { "../utils": 129 },
    ],
    129: [
      function (t, e, r) {
        "use strict";
        var i = t("minimalistic-assert"),
          n = t("inherits");
        function o(t, e) {
          return (
            55296 == (64512 & t.charCodeAt(e)) &&
            !(e < 0 || e + 1 >= t.length) &&
            56320 == (64512 & t.charCodeAt(e + 1))
          );
        }
        function s(t) {
          return (
            ((t >>> 24) |
              ((t >>> 8) & 65280) |
              ((t << 8) & 16711680) |
              ((255 & t) << 24)) >>>
            0
          );
        }
        function a(t) {
          return 1 === t.length ? "0" + t : t;
        }
        function f(t) {
          return 7 === t.length
            ? "0" + t
            : 6 === t.length
            ? "00" + t
            : 5 === t.length
            ? "000" + t
            : 4 === t.length
            ? "0000" + t
            : 3 === t.length
            ? "00000" + t
            : 2 === t.length
            ? "000000" + t
            : 1 === t.length
            ? "0000000" + t
            : t;
        }
        (r.inherits = n),
          (r.toArray = function (t, e) {
            if (Array.isArray(t)) return t.slice();
            if (!t) return [];
            var r = [];
            if ("string" == typeof t)
              if (e) {
                if ("hex" === e)
                  for (
                    (t = t.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 &&
                      (t = "0" + t),
                      n = 0;
                    n < t.length;
                    n += 2
                  )
                    r.push(parseInt(t[n] + t[n + 1], 16));
              } else
                for (var i = 0, n = 0; n < t.length; n++) {
                  var s = t.charCodeAt(n);
                  s < 128
                    ? (r[i++] = s)
                    : s < 2048
                    ? ((r[i++] = (s >> 6) | 192), (r[i++] = (63 & s) | 128))
                    : o(t, n)
                    ? ((s =
                        65536 +
                        ((1023 & s) << 10) +
                        (1023 & t.charCodeAt(++n))),
                      (r[i++] = (s >> 18) | 240),
                      (r[i++] = ((s >> 12) & 63) | 128),
                      (r[i++] = ((s >> 6) & 63) | 128),
                      (r[i++] = (63 & s) | 128))
                    : ((r[i++] = (s >> 12) | 224),
                      (r[i++] = ((s >> 6) & 63) | 128),
                      (r[i++] = (63 & s) | 128));
                }
            else for (n = 0; n < t.length; n++) r[n] = 0 | t[n];
            return r;
          }),
          (r.toHex = function (t) {
            for (var e = "", r = 0; r < t.length; r++)
              e += a(t[r].toString(16));
            return e;
          }),
          (r.htonl = s),
          (r.toHex32 = function (t, e) {
            for (var r = "", i = 0; i < t.length; i++) {
              var n = t[i];
              "little" === e && (n = s(n)), (r += f(n.toString(16)));
            }
            return r;
          }),
          (r.zero2 = a),
          (r.zero8 = f),
          (r.join32 = function (t, e, r, n) {
            var o = r - e;
            i(o % 4 == 0);
            for (
              var s = new Array(o / 4), a = 0, f = e;
              a < s.length;
              a++, f += 4
            ) {
              var h;
              (h =
                "big" === n
                  ? (t[f] << 24) | (t[f + 1] << 16) | (t[f + 2] << 8) | t[f + 3]
                  : (t[f + 3] << 24) |
                    (t[f + 2] << 16) |
                    (t[f + 1] << 8) |
                    t[f]),
                (s[a] = h >>> 0);
            }
            return s;
          }),
          (r.split32 = function (t, e) {
            for (
              var r = new Array(4 * t.length), i = 0, n = 0;
              i < t.length;
              i++, n += 4
            ) {
              var o = t[i];
              "big" === e
                ? ((r[n] = o >>> 24),
                  (r[n + 1] = (o >>> 16) & 255),
                  (r[n + 2] = (o >>> 8) & 255),
                  (r[n + 3] = 255 & o))
                : ((r[n + 3] = o >>> 24),
                  (r[n + 2] = (o >>> 16) & 255),
                  (r[n + 1] = (o >>> 8) & 255),
                  (r[n] = 255 & o));
            }
            return r;
          }),
          (r.rotr32 = function (t, e) {
            return (t >>> e) | (t << (32 - e));
          }),
          (r.rotl32 = function (t, e) {
            return (t << e) | (t >>> (32 - e));
          }),
          (r.sum32 = function (t, e) {
            return (t + e) >>> 0;
          }),
          (r.sum32_3 = function (t, e, r) {
            return (t + e + r) >>> 0;
          }),
          (r.sum32_4 = function (t, e, r, i) {
            return (t + e + r + i) >>> 0;
          }),
          (r.sum32_5 = function (t, e, r, i, n) {
            return (t + e + r + i + n) >>> 0;
          }),
          (r.sum64 = function (t, e, r, i) {
            var n = t[e],
              o = (i + t[e + 1]) >>> 0,
              s = (o < i ? 1 : 0) + r + n;
            (t[e] = s >>> 0), (t[e + 1] = o);
          }),
          (r.sum64_hi = function (t, e, r, i) {
            return (((e + i) >>> 0 < e ? 1 : 0) + t + r) >>> 0;
          }),
          (r.sum64_lo = function (t, e, r, i) {
            return (e + i) >>> 0;
          }),
          (r.sum64_4_hi = function (t, e, r, i, n, o, s, a) {
            var f = 0,
              h = e;
            return (
              (f += (h = (h + i) >>> 0) < e ? 1 : 0),
              (f += (h = (h + o) >>> 0) < o ? 1 : 0),
              (t + r + n + s + (f += (h = (h + a) >>> 0) < a ? 1 : 0)) >>> 0
            );
          }),
          (r.sum64_4_lo = function (t, e, r, i, n, o, s, a) {
            return (e + i + o + a) >>> 0;
          }),
          (r.sum64_5_hi = function (t, e, r, i, n, o, s, a, f, h) {
            var u = 0,
              c = e;
            return (
              (u += (c = (c + i) >>> 0) < e ? 1 : 0),
              (u += (c = (c + o) >>> 0) < o ? 1 : 0),
              (u += (c = (c + a) >>> 0) < a ? 1 : 0),
              (t + r + n + s + f + (u += (c = (c + h) >>> 0) < h ? 1 : 0)) >>> 0
            );
          }),
          (r.sum64_5_lo = function (t, e, r, i, n, o, s, a, f, h) {
            return (e + i + o + a + h) >>> 0;
          }),
          (r.rotr64_hi = function (t, e, r) {
            return ((e << (32 - r)) | (t >>> r)) >>> 0;
          }),
          (r.rotr64_lo = function (t, e, r) {
            return ((t << (32 - r)) | (e >>> r)) >>> 0;
          }),
          (r.shr64_hi = function (t, e, r) {
            return t >>> r;
          }),
          (r.shr64_lo = function (t, e, r) {
            return ((t << (32 - r)) | (e >>> r)) >>> 0;
          });
      },
      { inherits: 132, "minimalistic-assert": 136 },
    ],
    130: [
      function (t, e, r) {
        "use strict";
        var i = t("hash.js"),
          n = t("minimalistic-crypto-utils"),
          o = t("minimalistic-assert");
        function s(t) {
          if (!(this instanceof s)) return new s(t);
          (this.hash = t.hash),
            (this.predResist = !!t.predResist),
            (this.outLen = this.hash.outSize),
            (this.minEntropy = t.minEntropy || this.hash.hmacStrength),
            (this._reseed = null),
            (this.reseedInterval = null),
            (this.K = null),
            (this.V = null);
          var e = n.toArray(t.entropy, t.entropyEnc || "hex"),
            r = n.toArray(t.nonce, t.nonceEnc || "hex"),
            i = n.toArray(t.pers, t.persEnc || "hex");
          o(
            e.length >= this.minEntropy / 8,
            "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
          ),
            this._init(e, r, i);
        }
        (e.exports = s),
          (s.prototype._init = function (t, e, r) {
            var i = t.concat(e).concat(r);
            (this.K = new Array(this.outLen / 8)),
              (this.V = new Array(this.outLen / 8));
            for (var n = 0; n < this.V.length; n++)
              (this.K[n] = 0), (this.V[n] = 1);
            this._update(i),
              (this._reseed = 1),
              (this.reseedInterval = 281474976710656);
          }),
          (s.prototype._hmac = function () {
            return new i.hmac(this.hash, this.K);
          }),
          (s.prototype._update = function (t) {
            var e = this._hmac().update(this.V).update([0]);
            t && (e = e.update(t)),
              (this.K = e.digest()),
              (this.V = this._hmac().update(this.V).digest()),
              t &&
                ((this.K = this._hmac()
                  .update(this.V)
                  .update([1])
                  .update(t)
                  .digest()),
                (this.V = this._hmac().update(this.V).digest()));
          }),
          (s.prototype.reseed = function (t, e, r, i) {
            "string" != typeof e && ((i = r), (r = e), (e = null)),
              (t = n.toArray(t, e)),
              (r = n.toArray(r, i)),
              o(
                t.length >= this.minEntropy / 8,
                "Not enough entropy. Minimum is: " + this.minEntropy + " bits"
              ),
              this._update(t.concat(r || [])),
              (this._reseed = 1);
          }),
          (s.prototype.generate = function (t, e, r, i) {
            if (this._reseed > this.reseedInterval)
              throw new Error("Reseed is required");
            "string" != typeof e && ((i = r), (r = e), (e = null)),
              r && ((r = n.toArray(r, i || "hex")), this._update(r));
            for (var o = []; o.length < t; )
              (this.V = this._hmac().update(this.V).digest()),
                (o = o.concat(this.V));
            var s = o.slice(0, t);
            return this._update(r), this._reseed++, n.encode(s, e);
          });
      },
      {
        "hash.js": 118,
        "minimalistic-assert": 136,
        "minimalistic-crypto-utils": 137,
      },
    ],
    131: [
      function (t, e, r) {
        (r.read = function (t, e, r, i, n) {
          var o,
            s,
            a = 8 * n - i - 1,
            f = (1 << a) - 1,
            h = f >> 1,
            u = -7,
            c = r ? n - 1 : 0,
            d = r ? -1 : 1,
            l = t[e + c];
          for (
            c += d, o = l & ((1 << -u) - 1), l >>= -u, u += a;
            u > 0;
            o = 256 * o + t[e + c], c += d, u -= 8
          );
          for (
            s = o & ((1 << -u) - 1), o >>= -u, u += i;
            u > 0;
            s = 256 * s + t[e + c], c += d, u -= 8
          );
          if (0 === o) o = 1 - h;
          else {
            if (o === f) return s ? NaN : (1 / 0) * (l ? -1 : 1);
            (s += Math.pow(2, i)), (o -= h);
          }
          return (l ? -1 : 1) * s * Math.pow(2, o - i);
        }),
          (r.write = function (t, e, r, i, n, o) {
            var s,
              a,
              f,
              h = 8 * o - n - 1,
              u = (1 << h) - 1,
              c = u >> 1,
              d = 23 === n ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
              l = i ? 0 : o - 1,
              p = i ? 1 : -1,
              b = e < 0 || (0 === e && 1 / e < 0) ? 1 : 0;
            for (
              e = Math.abs(e),
                isNaN(e) || e === 1 / 0
                  ? ((a = isNaN(e) ? 1 : 0), (s = u))
                  : ((s = Math.floor(Math.log(e) / Math.LN2)),
                    e * (f = Math.pow(2, -s)) < 1 && (s--, (f *= 2)),
                    (e += s + c >= 1 ? d / f : d * Math.pow(2, 1 - c)) * f >=
                      2 && (s++, (f /= 2)),
                    s + c >= u
                      ? ((a = 0), (s = u))
                      : s + c >= 1
                      ? ((a = (e * f - 1) * Math.pow(2, n)), (s += c))
                      : ((a = e * Math.pow(2, c - 1) * Math.pow(2, n)),
                        (s = 0)));
              n >= 8;
              t[r + l] = 255 & a, l += p, a /= 256, n -= 8
            );
            for (
              s = (s << n) | a, h += n;
              h > 0;
              t[r + l] = 255 & s, l += p, s /= 256, h -= 8
            );
            t[r + l - p] |= 128 * b;
          });
      },
      {},
    ],
    132: [
      function (t, e, r) {
        "function" == typeof Object.create
          ? (e.exports = function (t, e) {
              e &&
                ((t.super_ = e),
                (t.prototype = Object.create(e.prototype, {
                  constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0,
                  },
                })));
            })
          : (e.exports = function (t, e) {
              if (e) {
                t.super_ = e;
                var r = function () {};
                (r.prototype = e.prototype),
                  (t.prototype = new r()),
                  (t.prototype.constructor = t);
              }
            });
      },
      {},
    ],
    133: [
      function (t, e, r) {
        "use strict";
        var i = t("inherits"),
          n = t("hash-base"),
          o = t("safe-buffer").Buffer,
          s = new Array(16);
        function a() {
          n.call(this, 64),
            (this._a = 1732584193),
            (this._b = 4023233417),
            (this._c = 2562383102),
            (this._d = 271733878);
        }
        function f(t, e) {
          return (t << e) | (t >>> (32 - e));
        }
        function h(t, e, r, i, n, o, s) {
          return (f((t + ((e & r) | (~e & i)) + n + o) | 0, s) + e) | 0;
        }
        function u(t, e, r, i, n, o, s) {
          return (f((t + ((e & i) | (r & ~i)) + n + o) | 0, s) + e) | 0;
        }
        function c(t, e, r, i, n, o, s) {
          return (f((t + (e ^ r ^ i) + n + o) | 0, s) + e) | 0;
        }
        function d(t, e, r, i, n, o, s) {
          return (f((t + (r ^ (e | ~i)) + n + o) | 0, s) + e) | 0;
        }
        i(a, n),
          (a.prototype._update = function () {
            for (var t = s, e = 0; e < 16; ++e)
              t[e] = this._block.readInt32LE(4 * e);
            var r = this._a,
              i = this._b,
              n = this._c,
              o = this._d;
            (r = h(r, i, n, o, t[0], 3614090360, 7)),
              (o = h(o, r, i, n, t[1], 3905402710, 12)),
              (n = h(n, o, r, i, t[2], 606105819, 17)),
              (i = h(i, n, o, r, t[3], 3250441966, 22)),
              (r = h(r, i, n, o, t[4], 4118548399, 7)),
              (o = h(o, r, i, n, t[5], 1200080426, 12)),
              (n = h(n, o, r, i, t[6], 2821735955, 17)),
              (i = h(i, n, o, r, t[7], 4249261313, 22)),
              (r = h(r, i, n, o, t[8], 1770035416, 7)),
              (o = h(o, r, i, n, t[9], 2336552879, 12)),
              (n = h(n, o, r, i, t[10], 4294925233, 17)),
              (i = h(i, n, o, r, t[11], 2304563134, 22)),
              (r = h(r, i, n, o, t[12], 1804603682, 7)),
              (o = h(o, r, i, n, t[13], 4254626195, 12)),
              (n = h(n, o, r, i, t[14], 2792965006, 17)),
              (r = u(
                r,
                (i = h(i, n, o, r, t[15], 1236535329, 22)),
                n,
                o,
                t[1],
                4129170786,
                5
              )),
              (o = u(o, r, i, n, t[6], 3225465664, 9)),
              (n = u(n, o, r, i, t[11], 643717713, 14)),
              (i = u(i, n, o, r, t[0], 3921069994, 20)),
              (r = u(r, i, n, o, t[5], 3593408605, 5)),
              (o = u(o, r, i, n, t[10], 38016083, 9)),
              (n = u(n, o, r, i, t[15], 3634488961, 14)),
              (i = u(i, n, o, r, t[4], 3889429448, 20)),
              (r = u(r, i, n, o, t[9], 568446438, 5)),
              (o = u(o, r, i, n, t[14], 3275163606, 9)),
              (n = u(n, o, r, i, t[3], 4107603335, 14)),
              (i = u(i, n, o, r, t[8], 1163531501, 20)),
              (r = u(r, i, n, o, t[13], 2850285829, 5)),
              (o = u(o, r, i, n, t[2], 4243563512, 9)),
              (n = u(n, o, r, i, t[7], 1735328473, 14)),
              (r = c(
                r,
                (i = u(i, n, o, r, t[12], 2368359562, 20)),
                n,
                o,
                t[5],
                4294588738,
                4
              )),
              (o = c(o, r, i, n, t[8], 2272392833, 11)),
              (n = c(n, o, r, i, t[11], 1839030562, 16)),
              (i = c(i, n, o, r, t[14], 4259657740, 23)),
              (r = c(r, i, n, o, t[1], 2763975236, 4)),
              (o = c(o, r, i, n, t[4], 1272893353, 11)),
              (n = c(n, o, r, i, t[7], 4139469664, 16)),
              (i = c(i, n, o, r, t[10], 3200236656, 23)),
              (r = c(r, i, n, o, t[13], 681279174, 4)),
              (o = c(o, r, i, n, t[0], 3936430074, 11)),
              (n = c(n, o, r, i, t[3], 3572445317, 16)),
              (i = c(i, n, o, r, t[6], 76029189, 23)),
              (r = c(r, i, n, o, t[9], 3654602809, 4)),
              (o = c(o, r, i, n, t[12], 3873151461, 11)),
              (n = c(n, o, r, i, t[15], 530742520, 16)),
              (r = d(
                r,
                (i = c(i, n, o, r, t[2], 3299628645, 23)),
                n,
                o,
                t[0],
                4096336452,
                6
              )),
              (o = d(o, r, i, n, t[7], 1126891415, 10)),
              (n = d(n, o, r, i, t[14], 2878612391, 15)),
              (i = d(i, n, o, r, t[5], 4237533241, 21)),
              (r = d(r, i, n, o, t[12], 1700485571, 6)),
              (o = d(o, r, i, n, t[3], 2399980690, 10)),
              (n = d(n, o, r, i, t[10], 4293915773, 15)),
              (i = d(i, n, o, r, t[1], 2240044497, 21)),
              (r = d(r, i, n, o, t[8], 1873313359, 6)),
              (o = d(o, r, i, n, t[15], 4264355552, 10)),
              (n = d(n, o, r, i, t[6], 2734768916, 15)),
              (i = d(i, n, o, r, t[13], 1309151649, 21)),
              (r = d(r, i, n, o, t[4], 4149444226, 6)),
              (o = d(o, r, i, n, t[11], 3174756917, 10)),
              (n = d(n, o, r, i, t[2], 718787259, 15)),
              (i = d(i, n, o, r, t[9], 3951481745, 21)),
              (this._a = (this._a + r) | 0),
              (this._b = (this._b + i) | 0),
              (this._c = (this._c + n) | 0),
              (this._d = (this._d + o) | 0);
          }),
          (a.prototype._digest = function () {
            (this._block[this._blockOffset++] = 128),
              this._blockOffset > 56 &&
                (this._block.fill(0, this._blockOffset, 64),
                this._update(),
                (this._blockOffset = 0)),
              this._block.fill(0, this._blockOffset, 56),
              this._block.writeUInt32LE(this._length[0], 56),
              this._block.writeUInt32LE(this._length[1], 60),
              this._update();
            var t = o.allocUnsafe(16);
            return (
              t.writeInt32LE(this._a, 0),
              t.writeInt32LE(this._b, 4),
              t.writeInt32LE(this._c, 8),
              t.writeInt32LE(this._d, 12),
              t
            );
          }),
          (e.exports = a);
      },
      { "hash-base": 102, inherits: 132, "safe-buffer": 160 },
    ],
    134: [
      function (t, e, r) {
        var i = t("bn.js"),
          n = t("brorand");
        function o(t) {
          this.rand = t || new n.Rand();
        }
        (e.exports = o),
          (o.create = function (t) {
            return new o(t);
          }),
          (o.prototype._randbelow = function (t) {
            var e = t.bitLength(),
              r = Math.ceil(e / 8);
            do {
              var n = new i(this.rand.generate(r));
            } while (n.cmp(t) >= 0);
            return n;
          }),
          (o.prototype._randrange = function (t, e) {
            var r = e.sub(t);
            return t.add(this._randbelow(r));
          }),
          (o.prototype.test = function (t, e, r) {
            var n = t.bitLength(),
              o = i.mont(t),
              s = new i(1).toRed(o);
            e || (e = Math.max(1, (n / 48) | 0));
            for (var a = t.subn(1), f = 0; !a.testn(f); f++);
            for (var h = t.shrn(f), u = a.toRed(o); e > 0; e--) {
              var c = this._randrange(new i(2), a);
              r && r(c);
              var d = c.toRed(o).redPow(h);
              if (0 !== d.cmp(s) && 0 !== d.cmp(u)) {
                for (var l = 1; l < f; l++) {
                  if (0 === (d = d.redSqr()).cmp(s)) return !1;
                  if (0 === d.cmp(u)) break;
                }
                if (l === f) return !1;
              }
            }
            return !0;
          }),
          (o.prototype.getDivisor = function (t, e) {
            var r = t.bitLength(),
              n = i.mont(t),
              o = new i(1).toRed(n);
            e || (e = Math.max(1, (r / 48) | 0));
            for (var s = t.subn(1), a = 0; !s.testn(a); a++);
            for (var f = t.shrn(a), h = s.toRed(n); e > 0; e--) {
              var u = this._randrange(new i(2), s),
                c = t.gcd(u);
              if (0 !== c.cmpn(1)) return c;
              var d = u.toRed(n).redPow(f);
              if (0 !== d.cmp(o) && 0 !== d.cmp(h)) {
                for (var l = 1; l < a; l++) {
                  if (0 === (d = d.redSqr()).cmp(o))
                    return d.fromRed().subn(1).gcd(t);
                  if (0 === d.cmp(h)) break;
                }
                if (l === a) return (d = d.redSqr()).fromRed().subn(1).gcd(t);
              }
            }
            return !1;
          });
      },
      { "bn.js": 135, brorand: 18 },
    ],
    135: [
      function (t, e, r) {
        arguments[4][15][0].apply(r, arguments);
      },
      { buffer: 19, dup: 15 },
    ],
    136: [
      function (t, e, r) {
        function i(t, e) {
          if (!t) throw new Error(e || "Assertion failed");
        }
        (e.exports = i),
          (i.equal = function (t, e, r) {
            if (t != e)
              throw new Error(r || "Assertion failed: " + t + " != " + e);
          });
      },
      {},
    ],
    137: [
      function (t, e, r) {
        "use strict";
        var i = r;
        function n(t) {
          return 1 === t.length ? "0" + t : t;
        }
        function o(t) {
          for (var e = "", r = 0; r < t.length; r++) e += n(t[r].toString(16));
          return e;
        }
        (i.toArray = function (t, e) {
          if (Array.isArray(t)) return t.slice();
          if (!t) return [];
          var r = [];
          if ("string" != typeof t) {
            for (var i = 0; i < t.length; i++) r[i] = 0 | t[i];
            return r;
          }
          if ("hex" === e) {
            (t = t.replace(/[^a-z0-9]+/gi, "")).length % 2 != 0 &&
              (t = "0" + t);
            for (i = 0; i < t.length; i += 2)
              r.push(parseInt(t[i] + t[i + 1], 16));
          } else
            for (i = 0; i < t.length; i++) {
              var n = t.charCodeAt(i),
                o = n >> 8,
                s = 255 & n;
              o ? r.push(o, s) : r.push(s);
            }
          return r;
        }),
          (i.zero2 = n),
          (i.toHex = o),
          (i.encode = function (t, e) {
            return "hex" === e ? o(t) : t;
          });
      },
      {},
    ],
    138: [
      function (t, e, r) {
        e.exports = {
          "2.16.840.1.101.3.4.1.1": "aes-128-ecb",
          "2.16.840.1.101.3.4.1.2": "aes-128-cbc",
          "2.16.840.1.101.3.4.1.3": "aes-128-ofb",
          "2.16.840.1.101.3.4.1.4": "aes-128-cfb",
          "2.16.840.1.101.3.4.1.21": "aes-192-ecb",
          "2.16.840.1.101.3.4.1.22": "aes-192-cbc",
          "2.16.840.1.101.3.4.1.23": "aes-192-ofb",
          "2.16.840.1.101.3.4.1.24": "aes-192-cfb",
          "2.16.840.1.101.3.4.1.41": "aes-256-ecb",
          "2.16.840.1.101.3.4.1.42": "aes-256-cbc",
          "2.16.840.1.101.3.4.1.43": "aes-256-ofb",
          "2.16.840.1.101.3.4.1.44": "aes-256-cfb",
        };
      },
      {},
    ],
    139: [
      function (t, e, r) {
        "use strict";
        var i = t("asn1.js");
        r.certificate = t("./certificate");
        var n = i.define("RSAPrivateKey", function () {
          this.seq().obj(
            this.key("version").int(),
            this.key("modulus").int(),
            this.key("publicExponent").int(),
            this.key("privateExponent").int(),
            this.key("prime1").int(),
            this.key("prime2").int(),
            this.key("exponent1").int(),
            this.key("exponent2").int(),
            this.key("coefficient").int()
          );
        });
        r.RSAPrivateKey = n;
        var o = i.define("RSAPublicKey", function () {
          this.seq().obj(
            this.key("modulus").int(),
            this.key("publicExponent").int()
          );
        });
        r.RSAPublicKey = o;
        var s = i.define("SubjectPublicKeyInfo", function () {
          this.seq().obj(
            this.key("algorithm").use(a),
            this.key("subjectPublicKey").bitstr()
          );
        });
        r.PublicKey = s;
        var a = i.define("AlgorithmIdentifier", function () {
            this.seq().obj(
              this.key("algorithm").objid(),
              this.key("none").null_().optional(),
              this.key("curve").objid().optional(),
              this.key("params")
                .seq()
                .obj(
                  this.key("p").int(),
                  this.key("q").int(),
                  this.key("g").int()
                )
                .optional()
            );
          }),
          f = i.define("PrivateKeyInfo", function () {
            this.seq().obj(
              this.key("version").int(),
              this.key("algorithm").use(a),
              this.key("subjectPrivateKey").octstr()
            );
          });
        r.PrivateKey = f;
        var h = i.define("EncryptedPrivateKeyInfo", function () {
          this.seq().obj(
            this.key("algorithm")
              .seq()
              .obj(
                this.key("id").objid(),
                this.key("decrypt")
                  .seq()
                  .obj(
                    this.key("kde")
                      .seq()
                      .obj(
                        this.key("id").objid(),
                        this.key("kdeparams")
                          .seq()
                          .obj(
                            this.key("salt").octstr(),
                            this.key("iters").int()
                          )
                      ),
                    this.key("cipher")
                      .seq()
                      .obj(this.key("algo").objid(), this.key("iv").octstr())
                  )
              ),
            this.key("subjectPrivateKey").octstr()
          );
        });
        r.EncryptedPrivateKey = h;
        var u = i.define("DSAPrivateKey", function () {
          this.seq().obj(
            this.key("version").int(),
            this.key("p").int(),
            this.key("q").int(),
            this.key("g").int(),
            this.key("pub_key").int(),
            this.key("priv_key").int()
          );
        });
        (r.DSAPrivateKey = u),
          (r.DSAparam = i.define("DSAparam", function () {
            this.int();
          }));
        var c = i.define("ECPrivateKey", function () {
          this.seq().obj(
            this.key("version").int(),
            this.key("privateKey").octstr(),
            this.key("parameters").optional().explicit(0).use(d),
            this.key("publicKey").optional().explicit(1).bitstr()
          );
        });
        r.ECPrivateKey = c;
        var d = i.define("ECParameters", function () {
          this.choice({ namedCurve: this.objid() });
        });
        r.signature = i.define("signature", function () {
          this.seq().obj(this.key("r").int(), this.key("s").int());
        });
      },
      { "./certificate": 140, "asn1.js": 1 },
    ],
    140: [
      function (t, e, r) {
        "use strict";
        var i = t("asn1.js"),
          n = i.define("Time", function () {
            this.choice({
              utcTime: this.utctime(),
              generalTime: this.gentime(),
            });
          }),
          o = i.define("AttributeTypeValue", function () {
            this.seq().obj(this.key("type").objid(), this.key("value").any());
          }),
          s = i.define("AlgorithmIdentifier", function () {
            this.seq().obj(
              this.key("algorithm").objid(),
              this.key("parameters").optional(),
              this.key("curve").objid().optional()
            );
          }),
          a = i.define("SubjectPublicKeyInfo", function () {
            this.seq().obj(
              this.key("algorithm").use(s),
              this.key("subjectPublicKey").bitstr()
            );
          }),
          f = i.define("RelativeDistinguishedName", function () {
            this.setof(o);
          }),
          h = i.define("RDNSequence", function () {
            this.seqof(f);
          }),
          u = i.define("Name", function () {
            this.choice({ rdnSequence: this.use(h) });
          }),
          c = i.define("Validity", function () {
            this.seq().obj(
              this.key("notBefore").use(n),
              this.key("notAfter").use(n)
            );
          }),
          d = i.define("Extension", function () {
            this.seq().obj(
              this.key("extnID").objid(),
              this.key("critical").bool().def(!1),
              this.key("extnValue").octstr()
            );
          }),
          l = i.define("TBSCertificate", function () {
            this.seq().obj(
              this.key("version").explicit(0).int().optional(),
              this.key("serialNumber").int(),
              this.key("signature").use(s),
              this.key("issuer").use(u),
              this.key("validity").use(c),
              this.key("subject").use(u),
              this.key("subjectPublicKeyInfo").use(a),
              this.key("issuerUniqueID").implicit(1).bitstr().optional(),
              this.key("subjectUniqueID").implicit(2).bitstr().optional(),
              this.key("extensions").explicit(3).seqof(d).optional()
            );
          }),
          p = i.define("X509Certificate", function () {
            this.seq().obj(
              this.key("tbsCertificate").use(l),
              this.key("signatureAlgorithm").use(s),
              this.key("signatureValue").bitstr()
            );
          });
        e.exports = p;
      },
      { "asn1.js": 1 },
    ],
    141: [
      function (t, e, r) {
        var i =
            /Proc-Type: 4,ENCRYPTED[\n\r]+DEK-Info: AES-((?:128)|(?:192)|(?:256))-CBC,([0-9A-H]+)[\n\r]+([0-9A-z\n\r+/=]+)[\n\r]+/m,
          n = /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----/m,
          o =
            /^-----BEGIN ((?:.*? KEY)|CERTIFICATE)-----([0-9A-z\n\r+/=]+)-----END \1-----$/m,
          s = t("evp_bytestokey"),
          a = t("browserify-aes"),
          f = t("safe-buffer").Buffer;
        e.exports = function (t, e) {
          var r,
            h = t.toString(),
            u = h.match(i);
          if (u) {
            var c = "aes" + u[1],
              d = f.from(u[2], "hex"),
              l = f.from(u[3].replace(/[\r\n]/g, ""), "base64"),
              p = s(e, d.slice(0, 8), parseInt(u[1], 10)).key,
              b = [],
              m = a.createDecipheriv(c, p, d);
            b.push(m.update(l)), b.push(m.final()), (r = f.concat(b));
          } else {
            var y = h.match(o);
            r = f.from(y[2].replace(/[\r\n]/g, ""), "base64");
          }
          return { tag: h.match(n)[1], data: r };
        };
      },
      { "browserify-aes": 22, evp_bytestokey: 101, "safe-buffer": 160 },
    ],
    142: [
      function (t, e, r) {
        var i = t("./asn1"),
          n = t("./aesid.json"),
          o = t("./fixProc"),
          s = t("browserify-aes"),
          a = t("pbkdf2"),
          f = t("safe-buffer").Buffer;
        function h(t) {
          var e;
          "object" != typeof t ||
            f.isBuffer(t) ||
            ((e = t.passphrase), (t = t.key)),
            "string" == typeof t && (t = f.from(t));
          var r,
            h,
            u = o(t, e),
            c = u.tag,
            d = u.data;
          switch (c) {
            case "CERTIFICATE":
              h = i.certificate.decode(d, "der").tbsCertificate
                .subjectPublicKeyInfo;
            case "PUBLIC KEY":
              switch (
                (h || (h = i.PublicKey.decode(d, "der")),
                (r = h.algorithm.algorithm.join(".")))
              ) {
                case "1.2.840.113549.1.1.1":
                  return i.RSAPublicKey.decode(h.subjectPublicKey.data, "der");
                case "1.2.840.10045.2.1":
                  return (
                    (h.subjectPrivateKey = h.subjectPublicKey),
                    { type: "ec", data: h }
                  );
                case "1.2.840.10040.4.1":
                  return (
                    (h.algorithm.params.pub_key = i.DSAparam.decode(
                      h.subjectPublicKey.data,
                      "der"
                    )),
                    { type: "dsa", data: h.algorithm.params }
                  );
                default:
                  throw new Error("unknown key id " + r);
              }
            case "ENCRYPTED PRIVATE KEY":
              d = (function (t, e) {
                var r = t.algorithm.decrypt.kde.kdeparams.salt,
                  i = parseInt(
                    t.algorithm.decrypt.kde.kdeparams.iters.toString(),
                    10
                  ),
                  o = n[t.algorithm.decrypt.cipher.algo.join(".")],
                  h = t.algorithm.decrypt.cipher.iv,
                  u = t.subjectPrivateKey,
                  c = parseInt(o.split("-")[1], 10) / 8,
                  d = a.pbkdf2Sync(e, r, i, c, "sha1"),
                  l = s.createDecipheriv(o, d, h),
                  p = [];
                return p.push(l.update(u)), p.push(l.final()), f.concat(p);
              })((d = i.EncryptedPrivateKey.decode(d, "der")), e);
            case "PRIVATE KEY":
              switch (
                (r = (h = i.PrivateKey.decode(
                  d,
                  "der"
                )).algorithm.algorithm.join("."))
              ) {
                case "1.2.840.113549.1.1.1":
                  return i.RSAPrivateKey.decode(h.subjectPrivateKey, "der");
                case "1.2.840.10045.2.1":
                  return {
                    curve: h.algorithm.curve,
                    privateKey: i.ECPrivateKey.decode(
                      h.subjectPrivateKey,
                      "der"
                    ).privateKey,
                  };
                case "1.2.840.10040.4.1":
                  return (
                    (h.algorithm.params.priv_key = i.DSAparam.decode(
                      h.subjectPrivateKey,
                      "der"
                    )),
                    { type: "dsa", params: h.algorithm.params }
                  );
                default:
                  throw new Error("unknown key id " + r);
              }
            case "RSA PUBLIC KEY":
              return i.RSAPublicKey.decode(d, "der");
            case "RSA PRIVATE KEY":
              return i.RSAPrivateKey.decode(d, "der");
            case "DSA PRIVATE KEY":
              return { type: "dsa", params: i.DSAPrivateKey.decode(d, "der") };
            case "EC PRIVATE KEY":
              return {
                curve: (d = i.ECPrivateKey.decode(d, "der")).parameters.value,
                privateKey: d.privateKey,
              };
            default:
              throw new Error("unknown key type " + c);
          }
        }
        (e.exports = h), (h.signature = i.signature);
      },
      {
        "./aesid.json": 138,
        "./asn1": 139,
        "./fixProc": 141,
        "browserify-aes": 22,
        pbkdf2: 143,
        "safe-buffer": 160,
      },
    ],
    143: [
      function (t, e, r) {
        (r.pbkdf2 = t("./lib/async")), (r.pbkdf2Sync = t("./lib/sync"));
      },
      { "./lib/async": 144, "./lib/sync": 147 },
    ],
    144: [
      function (t, e, r) {
        (function (r) {
          (function () {
            var i,
              n,
              o = t("safe-buffer").Buffer,
              s = t("./precondition"),
              a = t("./default-encoding"),
              f = t("./sync"),
              h = t("./to-buffer"),
              u = r.crypto && r.crypto.subtle,
              c = {
                sha: "SHA-1",
                "sha-1": "SHA-1",
                sha1: "SHA-1",
                sha256: "SHA-256",
                "sha-256": "SHA-256",
                sha384: "SHA-384",
                "sha-384": "SHA-384",
                "sha-512": "SHA-512",
                sha512: "SHA-512",
              },
              d = [];
            function l() {
              return (
                n ||
                (n =
                  r.process && r.process.nextTick
                    ? r.process.nextTick
                    : r.queueMicrotask
                    ? r.queueMicrotask
                    : r.setImmediate
                    ? r.setImmediate
                    : r.setTimeout)
              );
            }
            function p(t, e, r, i, n) {
              return u
                .importKey("raw", t, { name: "PBKDF2" }, !1, ["deriveBits"])
                .then(function (t) {
                  return u.deriveBits(
                    {
                      name: "PBKDF2",
                      salt: e,
                      iterations: r,
                      hash: { name: n },
                    },
                    t,
                    i << 3
                  );
                })
                .then(function (t) {
                  return o.from(t);
                });
            }
            e.exports = function (t, e, n, b, m, y) {
              "function" == typeof m && ((y = m), (m = void 0));
              var g = c[(m = m || "sha1").toLowerCase()];
              if (g && "function" == typeof r.Promise) {
                if (
                  (s(n, b),
                  (t = h(t, a, "Password")),
                  (e = h(e, a, "Salt")),
                  "function" != typeof y)
                )
                  throw new Error("No callback provided to pbkdf2");
                !(function (t, e) {
                  t.then(
                    function (t) {
                      l()(function () {
                        e(null, t);
                      });
                    },
                    function (t) {
                      l()(function () {
                        e(t);
                      });
                    }
                  );
                })(
                  (function (t) {
                    if (r.process && !r.process.browser)
                      return Promise.resolve(!1);
                    if (!u || !u.importKey || !u.deriveBits)
                      return Promise.resolve(!1);
                    if (void 0 !== d[t]) return d[t];
                    var e = p((i = i || o.alloc(8)), i, 10, 128, t)
                      .then(function () {
                        return !0;
                      })
                      .catch(function () {
                        return !1;
                      });
                    return (d[t] = e), e;
                  })(g).then(function (r) {
                    return r ? p(t, e, n, b, g) : f(t, e, n, b, m);
                  }),
                  y
                );
              } else
                l()(function () {
                  var r;
                  try {
                    r = f(t, e, n, b, m);
                  } catch (t) {
                    return y(t);
                  }
                  y(null, r);
                });
            };
          }).call(this);
        }).call(
          this,
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        );
      },
      {
        "./default-encoding": 145,
        "./precondition": 146,
        "./sync": 147,
        "./to-buffer": 148,
        "safe-buffer": 160,
      },
    ],
    145: [
      function (t, e, r) {
        (function (t, r) {
          (function () {
            var i;
            if (r.process && r.process.browser) i = "utf-8";
            else if (r.process && r.process.version) {
              i =
                parseInt(t.version.split(".")[0].slice(1), 10) >= 6
                  ? "utf-8"
                  : "binary";
            } else i = "utf-8";
            e.exports = i;
          }).call(this);
        }).call(
          this,
          t("_process"),
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        );
      },
      { _process: 149 },
    ],
    146: [
      function (t, e, r) {
        var i = Math.pow(2, 30) - 1;
        e.exports = function (t, e) {
          if ("number" != typeof t)
            throw new TypeError("Iterations not a number");
          if (t < 0) throw new TypeError("Bad iterations");
          if ("number" != typeof e)
            throw new TypeError("Key length not a number");
          if (e < 0 || e > i || e != e) throw new TypeError("Bad key length");
        };
      },
      {},
    ],
    147: [
      function (t, e, r) {
        var i = t("create-hash/md5"),
          n = t("ripemd160"),
          o = t("sha.js"),
          s = t("safe-buffer").Buffer,
          a = t("./precondition"),
          f = t("./default-encoding"),
          h = t("./to-buffer"),
          u = s.alloc(128),
          c = {
            md5: 16,
            sha1: 20,
            sha224: 28,
            sha256: 32,
            sha384: 48,
            sha512: 64,
            rmd160: 20,
            ripemd160: 20,
          };
        function d(t, e, r) {
          var a = (function (t) {
              function e(e) {
                return o(t).update(e).digest();
              }
              function r(t) {
                return new n().update(t).digest();
              }
              return "rmd160" === t || "ripemd160" === t
                ? r
                : "md5" === t
                ? i
                : e;
            })(t),
            f = "sha512" === t || "sha384" === t ? 128 : 64;
          e.length > f ? (e = a(e)) : e.length < f && (e = s.concat([e, u], f));
          for (
            var h = s.allocUnsafe(f + c[t]), d = s.allocUnsafe(f + c[t]), l = 0;
            l < f;
            l++
          )
            (h[l] = 54 ^ e[l]), (d[l] = 92 ^ e[l]);
          var p = s.allocUnsafe(f + r + 4);
          h.copy(p, 0, 0, f),
            (this.ipad1 = p),
            (this.ipad2 = h),
            (this.opad = d),
            (this.alg = t),
            (this.blocksize = f),
            (this.hash = a),
            (this.size = c[t]);
        }
        (d.prototype.run = function (t, e) {
          return (
            t.copy(e, this.blocksize),
            this.hash(e).copy(this.opad, this.blocksize),
            this.hash(this.opad)
          );
        }),
          (e.exports = function (t, e, r, i, n) {
            a(r, i);
            var o = new d(
                (n = n || "sha1"),
                (t = h(t, f, "Password")),
                (e = h(e, f, "Salt")).length
              ),
              u = s.allocUnsafe(i),
              l = s.allocUnsafe(e.length + 4);
            e.copy(l, 0, 0, e.length);
            for (
              var p = 0, b = c[n], m = Math.ceil(i / b), y = 1;
              y <= m;
              y++
            ) {
              l.writeUInt32BE(y, e.length);
              for (var g = o.run(l, o.ipad1), v = g, w = 1; w < r; w++) {
                v = o.run(v, o.ipad2);
                for (var _ = 0; _ < b; _++) g[_] ^= v[_];
              }
              g.copy(u, p), (p += b);
            }
            return u;
          });
      },
      {
        "./default-encoding": 145,
        "./precondition": 146,
        "./to-buffer": 148,
        "create-hash/md5": 68,
        ripemd160: 159,
        "safe-buffer": 160,
        "sha.js": 163,
      },
    ],
    148: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer;
        e.exports = function (t, e, r) {
          if (i.isBuffer(t)) return t;
          if ("string" == typeof t) return i.from(t, e);
          if (ArrayBuffer.isView(t)) return i.from(t.buffer);
          throw new TypeError(
            r + " must be a string, a Buffer, a typed array or a DataView"
          );
        };
      },
      { "safe-buffer": 160 },
    ],
    149: [
      function (t, e, r) {
        var i,
          n,
          o = (e.exports = {});
        function s() {
          throw new Error("setTimeout has not been defined");
        }
        function a() {
          throw new Error("clearTimeout has not been defined");
        }
        function f(t) {
          if (i === setTimeout) return setTimeout(t, 0);
          if ((i === s || !i) && setTimeout)
            return (i = setTimeout), setTimeout(t, 0);
          try {
            return i(t, 0);
          } catch (e) {
            try {
              return i.call(null, t, 0);
            } catch (e) {
              return i.call(this, t, 0);
            }
          }
        }
        !(function () {
          try {
            i = "function" == typeof setTimeout ? setTimeout : s;
          } catch (t) {
            i = s;
          }
          try {
            n = "function" == typeof clearTimeout ? clearTimeout : a;
          } catch (t) {
            n = a;
          }
        })();
        var h,
          u = [],
          c = !1,
          d = -1;
        function l() {
          c &&
            h &&
            ((c = !1),
            h.length ? (u = h.concat(u)) : (d = -1),
            u.length && p());
        }
        function p() {
          if (!c) {
            var t = f(l);
            c = !0;
            for (var e = u.length; e; ) {
              for (h = u, u = []; ++d < e; ) h && h[d].run();
              (d = -1), (e = u.length);
            }
            (h = null),
              (c = !1),
              (function (t) {
                if (n === clearTimeout) return clearTimeout(t);
                if ((n === a || !n) && clearTimeout)
                  return (n = clearTimeout), clearTimeout(t);
                try {
                  return n(t);
                } catch (e) {
                  try {
                    return n.call(null, t);
                  } catch (e) {
                    return n.call(this, t);
                  }
                }
              })(t);
          }
        }
        function b(t, e) {
          (this.fun = t), (this.array = e);
        }
        function m() {}
        (o.nextTick = function (t) {
          var e = new Array(arguments.length - 1);
          if (arguments.length > 1)
            for (var r = 1; r < arguments.length; r++) e[r - 1] = arguments[r];
          u.push(new b(t, e)), 1 !== u.length || c || f(p);
        }),
          (b.prototype.run = function () {
            this.fun.apply(null, this.array);
          }),
          (o.title = "browser"),
          (o.browser = !0),
          (o.env = {}),
          (o.argv = []),
          (o.version = ""),
          (o.versions = {}),
          (o.on = m),
          (o.addListener = m),
          (o.once = m),
          (o.off = m),
          (o.removeListener = m),
          (o.removeAllListeners = m),
          (o.emit = m),
          (o.prependListener = m),
          (o.prependOnceListener = m),
          (o.listeners = function (t) {
            return [];
          }),
          (o.binding = function (t) {
            throw new Error("process.binding is not supported");
          }),
          (o.cwd = function () {
            return "/";
          }),
          (o.chdir = function (t) {
            throw new Error("process.chdir is not supported");
          }),
          (o.umask = function () {
            return 0;
          });
      },
      {},
    ],
    150: [
      function (t, e, r) {
        (r.publicEncrypt = t("./publicEncrypt")),
          (r.privateDecrypt = t("./privateDecrypt")),
          (r.privateEncrypt = function (t, e) {
            return r.publicEncrypt(t, e, !0);
          }),
          (r.publicDecrypt = function (t, e) {
            return r.privateDecrypt(t, e, !0);
          });
      },
      { "./privateDecrypt": 153, "./publicEncrypt": 154 },
    ],
    151: [
      function (t, e, r) {
        var i = t("create-hash"),
          n = t("safe-buffer").Buffer;
        function o(t) {
          var e = n.allocUnsafe(4);
          return e.writeUInt32BE(t, 0), e;
        }
        e.exports = function (t, e) {
          for (var r, s = n.alloc(0), a = 0; s.length < e; )
            (r = o(a++)),
              (s = n.concat([s, i("sha1").update(t).update(r).digest()]));
          return s.slice(0, e);
        };
      },
      { "create-hash": 67, "safe-buffer": 160 },
    ],
    152: [
      function (t, e, r) {
        arguments[4][15][0].apply(r, arguments);
      },
      { buffer: 19, dup: 15 },
    ],
    153: [
      function (t, e, r) {
        var i = t("parse-asn1"),
          n = t("./mgf"),
          o = t("./xor"),
          s = t("bn.js"),
          a = t("browserify-rsa"),
          f = t("create-hash"),
          h = t("./withPublic"),
          u = t("safe-buffer").Buffer;
        e.exports = function (t, e, r) {
          var c;
          c = t.padding ? t.padding : r ? 1 : 4;
          var d,
            l = i(t),
            p = l.modulus.byteLength();
          if (e.length > p || new s(e).cmp(l.modulus) >= 0)
            throw new Error("decryption error");
          d = r ? h(new s(e), l) : a(e, l);
          var b = u.alloc(p - d.length);
          if (((d = u.concat([b, d], p)), 4 === c))
            return (function (t, e) {
              var r = t.modulus.byteLength(),
                i = f("sha1").update(u.alloc(0)).digest(),
                s = i.length;
              if (0 !== e[0]) throw new Error("decryption error");
              var a = e.slice(1, s + 1),
                h = e.slice(s + 1),
                c = o(a, n(h, s)),
                d = o(h, n(c, r - s - 1));
              if (
                (function (t, e) {
                  (t = u.from(t)), (e = u.from(e));
                  var r = 0,
                    i = t.length;
                  t.length !== e.length &&
                    (r++, (i = Math.min(t.length, e.length)));
                  var n = -1;
                  for (; ++n < i; ) r += t[n] ^ e[n];
                  return r;
                })(i, d.slice(0, s))
              )
                throw new Error("decryption error");
              var l = s;
              for (; 0 === d[l]; ) l++;
              if (1 !== d[l++]) throw new Error("decryption error");
              return d.slice(l);
            })(l, d);
          if (1 === c)
            return (function (t, e, r) {
              var i = e.slice(0, 2),
                n = 2,
                o = 0;
              for (; 0 !== e[n++]; )
                if (n >= e.length) {
                  o++;
                  break;
                }
              var s = e.slice(2, n - 1);
              (("0002" !== i.toString("hex") && !r) ||
                ("0001" !== i.toString("hex") && r)) &&
                o++;
              s.length < 8 && o++;
              if (o) throw new Error("decryption error");
              return e.slice(n);
            })(0, d, r);
          if (3 === c) return d;
          throw new Error("unknown padding");
        };
      },
      {
        "./mgf": 151,
        "./withPublic": 155,
        "./xor": 156,
        "bn.js": 152,
        "browserify-rsa": 40,
        "create-hash": 67,
        "parse-asn1": 142,
        "safe-buffer": 160,
      },
    ],
    154: [
      function (t, e, r) {
        var i = t("parse-asn1"),
          n = t("randombytes"),
          o = t("create-hash"),
          s = t("./mgf"),
          a = t("./xor"),
          f = t("bn.js"),
          h = t("./withPublic"),
          u = t("browserify-rsa"),
          c = t("safe-buffer").Buffer;
        e.exports = function (t, e, r) {
          var d;
          d = t.padding ? t.padding : r ? 1 : 4;
          var l,
            p = i(t);
          if (4 === d)
            l = (function (t, e) {
              var r = t.modulus.byteLength(),
                i = e.length,
                h = o("sha1").update(c.alloc(0)).digest(),
                u = h.length,
                d = 2 * u;
              if (i > r - d - 2) throw new Error("message too long");
              var l = c.alloc(r - i - d - 2),
                p = r - u - 1,
                b = n(u),
                m = a(c.concat([h, l, c.alloc(1, 1), e], p), s(b, p)),
                y = a(b, s(m, u));
              return new f(c.concat([c.alloc(1), y, m], r));
            })(p, e);
          else if (1 === d)
            l = (function (t, e, r) {
              var i,
                o = e.length,
                s = t.modulus.byteLength();
              if (o > s - 11) throw new Error("message too long");
              i = r
                ? c.alloc(s - o - 3, 255)
                : (function (t) {
                    var e,
                      r = c.allocUnsafe(t),
                      i = 0,
                      o = n(2 * t),
                      s = 0;
                    for (; i < t; )
                      s === o.length && ((o = n(2 * t)), (s = 0)),
                        (e = o[s++]) && (r[i++] = e);
                    return r;
                  })(s - o - 3);
              return new f(
                c.concat([c.from([0, r ? 1 : 2]), i, c.alloc(1), e], s)
              );
            })(p, e, r);
          else {
            if (3 !== d) throw new Error("unknown padding");
            if ((l = new f(e)).cmp(p.modulus) >= 0)
              throw new Error("data too long for modulus");
          }
          return r ? u(l, p) : h(l, p);
        };
      },
      {
        "./mgf": 151,
        "./withPublic": 155,
        "./xor": 156,
        "bn.js": 152,
        "browserify-rsa": 40,
        "create-hash": 67,
        "parse-asn1": 142,
        randombytes: 157,
        "safe-buffer": 160,
      },
    ],
    155: [
      function (t, e, r) {
        var i = t("bn.js"),
          n = t("safe-buffer").Buffer;
        e.exports = function (t, e) {
          return n.from(
            t
              .toRed(i.mont(e.modulus))
              .redPow(new i(e.publicExponent))
              .fromRed()
              .toArray()
          );
        };
      },
      { "bn.js": 152, "safe-buffer": 160 },
    ],
    156: [
      function (t, e, r) {
        e.exports = function (t, e) {
          for (var r = t.length, i = -1; ++i < r; ) t[i] ^= e[i];
          return t;
        };
      },
      {},
    ],
    157: [
      function (t, e, r) {
        (function (r, i) {
          (function () {
            "use strict";
            var n = 65536,
              o = 4294967295;
            var s = t("safe-buffer").Buffer,
              a = i.crypto || i.msCrypto;
            a && a.getRandomValues
              ? (e.exports = function (t, e) {
                  if (t > o)
                    throw new RangeError("requested too many random bytes");
                  var i = s.allocUnsafe(t);
                  if (t > 0)
                    if (t > n)
                      for (var f = 0; f < t; f += n)
                        a.getRandomValues(i.slice(f, f + n));
                    else a.getRandomValues(i);
                  if ("function" == typeof e)
                    return r.nextTick(function () {
                      e(null, i);
                    });
                  return i;
                })
              : (e.exports = function () {
                  throw new Error(
                    "Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11"
                  );
                });
          }).call(this);
        }).call(
          this,
          t("_process"),
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        );
      },
      { _process: 149, "safe-buffer": 160 },
    ],
    158: [
      function (t, e, r) {
        (function (e, i) {
          (function () {
            "use strict";
            function n() {
              throw new Error(
                "secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11"
              );
            }
            var o = t("safe-buffer"),
              s = t("randombytes"),
              a = o.Buffer,
              f = o.kMaxLength,
              h = i.crypto || i.msCrypto,
              u = Math.pow(2, 32) - 1;
            function c(t, e) {
              if ("number" != typeof t || t != t)
                throw new TypeError("offset must be a number");
              if (t > u || t < 0)
                throw new TypeError("offset must be a uint32");
              if (t > f || t > e) throw new RangeError("offset out of range");
            }
            function d(t, e, r) {
              if ("number" != typeof t || t != t)
                throw new TypeError("size must be a number");
              if (t > u || t < 0) throw new TypeError("size must be a uint32");
              if (t + e > r || t > f) throw new RangeError("buffer too small");
            }
            function l(t, r, i, n) {
              if (e.browser) {
                var o = t.buffer,
                  a = new Uint8Array(o, r, i);
                return (
                  h.getRandomValues(a),
                  n
                    ? void e.nextTick(function () {
                        n(null, t);
                      })
                    : t
                );
              }
              if (!n) return s(i).copy(t, r), t;
              s(i, function (e, i) {
                if (e) return n(e);
                i.copy(t, r), n(null, t);
              });
            }
            (h && h.getRandomValues) || !e.browser
              ? ((r.randomFill = function (t, e, r, n) {
                  if (!(a.isBuffer(t) || t instanceof i.Uint8Array))
                    throw new TypeError(
                      '"buf" argument must be a Buffer or Uint8Array'
                    );
                  if ("function" == typeof e) (n = e), (e = 0), (r = t.length);
                  else if ("function" == typeof r) (n = r), (r = t.length - e);
                  else if ("function" != typeof n)
                    throw new TypeError('"cb" argument must be a function');
                  return c(e, t.length), d(r, e, t.length), l(t, e, r, n);
                }),
                (r.randomFillSync = function (t, e, r) {
                  void 0 === e && (e = 0);
                  if (!(a.isBuffer(t) || t instanceof i.Uint8Array))
                    throw new TypeError(
                      '"buf" argument must be a Buffer or Uint8Array'
                    );
                  c(e, t.length), void 0 === r && (r = t.length - e);
                  return d(r, e, t.length), l(t, e, r);
                }))
              : ((r.randomFill = n), (r.randomFillSync = n));
          }).call(this);
        }).call(
          this,
          t("_process"),
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        );
      },
      { _process: 149, randombytes: 157, "safe-buffer": 160 },
    ],
    159: [
      function (t, e, r) {
        "use strict";
        var i = t("buffer").Buffer,
          n = t("inherits"),
          o = t("hash-base"),
          s = new Array(16),
          a = [
            0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1,
            10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8, 1,
            2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15,
            14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13,
          ],
          f = [
            5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7,
            0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9,
            11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13,
            9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11,
          ],
          h = [
            11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8, 13,
            11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14, 9, 13,
            15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9, 8, 9, 14,
            5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8,
            5, 6,
          ],
          u = [
            8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15,
            7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6, 6,
            14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14, 6, 9,
            12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13,
            11, 11,
          ],
          c = [0, 1518500249, 1859775393, 2400959708, 2840853838],
          d = [1352829926, 1548603684, 1836072691, 2053994217, 0];
        function l() {
          o.call(this, 64),
            (this._a = 1732584193),
            (this._b = 4023233417),
            (this._c = 2562383102),
            (this._d = 271733878),
            (this._e = 3285377520);
        }
        function p(t, e) {
          return (t << e) | (t >>> (32 - e));
        }
        function b(t, e, r, i, n, o, s, a) {
          return (p((t + (e ^ r ^ i) + o + s) | 0, a) + n) | 0;
        }
        function m(t, e, r, i, n, o, s, a) {
          return (p((t + ((e & r) | (~e & i)) + o + s) | 0, a) + n) | 0;
        }
        function y(t, e, r, i, n, o, s, a) {
          return (p((t + ((e | ~r) ^ i) + o + s) | 0, a) + n) | 0;
        }
        function g(t, e, r, i, n, o, s, a) {
          return (p((t + ((e & i) | (r & ~i)) + o + s) | 0, a) + n) | 0;
        }
        function v(t, e, r, i, n, o, s, a) {
          return (p((t + (e ^ (r | ~i)) + o + s) | 0, a) + n) | 0;
        }
        n(l, o),
          (l.prototype._update = function () {
            for (var t = s, e = 0; e < 16; ++e)
              t[e] = this._block.readInt32LE(4 * e);
            for (
              var r = 0 | this._a,
                i = 0 | this._b,
                n = 0 | this._c,
                o = 0 | this._d,
                l = 0 | this._e,
                w = 0 | this._a,
                _ = 0 | this._b,
                M = 0 | this._c,
                S = 0 | this._d,
                E = 0 | this._e,
                A = 0;
              A < 80;
              A += 1
            ) {
              var k, B;
              A < 16
                ? ((k = b(r, i, n, o, l, t[a[A]], c[0], h[A])),
                  (B = v(w, _, M, S, E, t[f[A]], d[0], u[A])))
                : A < 32
                ? ((k = m(r, i, n, o, l, t[a[A]], c[1], h[A])),
                  (B = g(w, _, M, S, E, t[f[A]], d[1], u[A])))
                : A < 48
                ? ((k = y(r, i, n, o, l, t[a[A]], c[2], h[A])),
                  (B = y(w, _, M, S, E, t[f[A]], d[2], u[A])))
                : A < 64
                ? ((k = g(r, i, n, o, l, t[a[A]], c[3], h[A])),
                  (B = m(w, _, M, S, E, t[f[A]], d[3], u[A])))
                : ((k = v(r, i, n, o, l, t[a[A]], c[4], h[A])),
                  (B = b(w, _, M, S, E, t[f[A]], d[4], u[A]))),
                (r = l),
                (l = o),
                (o = p(n, 10)),
                (n = i),
                (i = k),
                (w = E),
                (E = S),
                (S = p(M, 10)),
                (M = _),
                (_ = B);
            }
            var x = (this._b + n + S) | 0;
            (this._b = (this._c + o + E) | 0),
              (this._c = (this._d + l + w) | 0),
              (this._d = (this._e + r + _) | 0),
              (this._e = (this._a + i + M) | 0),
              (this._a = x);
          }),
          (l.prototype._digest = function () {
            (this._block[this._blockOffset++] = 128),
              this._blockOffset > 56 &&
                (this._block.fill(0, this._blockOffset, 64),
                this._update(),
                (this._blockOffset = 0)),
              this._block.fill(0, this._blockOffset, 56),
              this._block.writeUInt32LE(this._length[0], 56),
              this._block.writeUInt32LE(this._length[1], 60),
              this._update();
            var t = i.alloc ? i.alloc(20) : new i(20);
            return (
              t.writeInt32LE(this._a, 0),
              t.writeInt32LE(this._b, 4),
              t.writeInt32LE(this._c, 8),
              t.writeInt32LE(this._d, 12),
              t.writeInt32LE(this._e, 16),
              t
            );
          }),
          (e.exports = l);
      },
      { buffer: 63, "hash-base": 102, inherits: 132 },
    ],
    160: [
      function (t, e, r) {
        var i = t("buffer"),
          n = i.Buffer;
        function o(t, e) {
          for (var r in t) e[r] = t[r];
        }
        function s(t, e, r) {
          return n(t, e, r);
        }
        n.from && n.alloc && n.allocUnsafe && n.allocUnsafeSlow
          ? (e.exports = i)
          : (o(i, r), (r.Buffer = s)),
          (s.prototype = Object.create(n.prototype)),
          o(n, s),
          (s.from = function (t, e, r) {
            if ("number" == typeof t)
              throw new TypeError("Argument must not be a number");
            return n(t, e, r);
          }),
          (s.alloc = function (t, e, r) {
            if ("number" != typeof t)
              throw new TypeError("Argument must be a number");
            var i = n(t);
            return (
              void 0 !== e
                ? "string" == typeof r
                  ? i.fill(e, r)
                  : i.fill(e)
                : i.fill(0),
              i
            );
          }),
          (s.allocUnsafe = function (t) {
            if ("number" != typeof t)
              throw new TypeError("Argument must be a number");
            return n(t);
          }),
          (s.allocUnsafeSlow = function (t) {
            if ("number" != typeof t)
              throw new TypeError("Argument must be a number");
            return i.SlowBuffer(t);
          });
      },
      { buffer: 63 },
    ],
    161: [
      function (t, e, r) {
        (function (r) {
          (function () {
            "use strict";
            var i,
              n = t("buffer"),
              o = n.Buffer,
              s = {};
            for (i in n)
              n.hasOwnProperty(i) &&
                "SlowBuffer" !== i &&
                "Buffer" !== i &&
                (s[i] = n[i]);
            var a = (s.Buffer = {});
            for (i in o)
              o.hasOwnProperty(i) &&
                "allocUnsafe" !== i &&
                "allocUnsafeSlow" !== i &&
                (a[i] = o[i]);
            if (
              ((s.Buffer.prototype = o.prototype),
              (a.from && a.from !== Uint8Array.from) ||
                (a.from = function (t, e, r) {
                  if ("number" == typeof t)
                    throw new TypeError(
                      'The "value" argument must not be of type number. Received type ' +
                        typeof t
                    );
                  if (t && void 0 === t.length)
                    throw new TypeError(
                      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
                        typeof t
                    );
                  return o(t, e, r);
                }),
              a.alloc ||
                (a.alloc = function (t, e, r) {
                  if ("number" != typeof t)
                    throw new TypeError(
                      'The "size" argument must be of type number. Received type ' +
                        typeof t
                    );
                  if (t < 0 || t >= 2 * (1 << 30))
                    throw new RangeError(
                      'The value "' + t + '" is invalid for option "size"'
                    );
                  var i = o(t);
                  return (
                    e && 0 !== e.length
                      ? "string" == typeof r
                        ? i.fill(e, r)
                        : i.fill(e)
                      : i.fill(0),
                    i
                  );
                }),
              !s.kStringMaxLength)
            )
              try {
                s.kStringMaxLength = r.binding("buffer").kStringMaxLength;
              } catch (t) {}
            s.constants ||
              ((s.constants = { MAX_LENGTH: s.kMaxLength }),
              s.kStringMaxLength &&
                (s.constants.MAX_STRING_LENGTH = s.kStringMaxLength)),
              (e.exports = s);
          }).call(this);
        }).call(this, t("_process"));
      },
      { _process: 149, buffer: 63 },
    ],
    162: [
      function (t, e, r) {
        var i = t("safe-buffer").Buffer;
        function n(t, e) {
          (this._block = i.alloc(t)),
            (this._finalSize = e),
            (this._blockSize = t),
            (this._len = 0);
        }
        (n.prototype.update = function (t, e) {
          "string" == typeof t && ((e = e || "utf8"), (t = i.from(t, e)));
          for (
            var r = this._block,
              n = this._blockSize,
              o = t.length,
              s = this._len,
              a = 0;
            a < o;

          ) {
            for (var f = s % n, h = Math.min(o - a, n - f), u = 0; u < h; u++)
              r[f + u] = t[a + u];
            (a += h), (s += h) % n == 0 && this._update(r);
          }
          return (this._len += o), this;
        }),
          (n.prototype.digest = function (t) {
            var e = this._len % this._blockSize;
            (this._block[e] = 128),
              this._block.fill(0, e + 1),
              e >= this._finalSize &&
                (this._update(this._block), this._block.fill(0));
            var r = 8 * this._len;
            if (r <= 4294967295)
              this._block.writeUInt32BE(r, this._blockSize - 4);
            else {
              var i = (4294967295 & r) >>> 0,
                n = (r - i) / 4294967296;
              this._block.writeUInt32BE(n, this._blockSize - 8),
                this._block.writeUInt32BE(i, this._blockSize - 4);
            }
            this._update(this._block);
            var o = this._hash();
            return t ? o.toString(t) : o;
          }),
          (n.prototype._update = function () {
            throw new Error("_update must be implemented by subclass");
          }),
          (e.exports = n);
      },
      { "safe-buffer": 160 },
    ],
    163: [
      function (t, e, r) {
        ((r = e.exports =
          function (t) {
            t = t.toLowerCase();
            var e = r[t];
            if (!e)
              throw new Error(
                t + " is not supported (we accept pull requests)"
              );
            return new e();
          }).sha = t("./sha")),
          (r.sha1 = t("./sha1")),
          (r.sha224 = t("./sha224")),
          (r.sha256 = t("./sha256")),
          (r.sha384 = t("./sha384")),
          (r.sha512 = t("./sha512"));
      },
      {
        "./sha": 164,
        "./sha1": 165,
        "./sha224": 166,
        "./sha256": 167,
        "./sha384": 168,
        "./sha512": 169,
      },
    ],
    164: [
      function (t, e, r) {
        var i = t("inherits"),
          n = t("./hash"),
          o = t("safe-buffer").Buffer,
          s = [1518500249, 1859775393, -1894007588, -899497514],
          a = new Array(80);
        function f() {
          this.init(), (this._w = a), n.call(this, 64, 56);
        }
        function h(t) {
          return (t << 30) | (t >>> 2);
        }
        function u(t, e, r, i) {
          return 0 === t
            ? (e & r) | (~e & i)
            : 2 === t
            ? (e & r) | (e & i) | (r & i)
            : e ^ r ^ i;
        }
        i(f, n),
          (f.prototype.init = function () {
            return (
              (this._a = 1732584193),
              (this._b = 4023233417),
              (this._c = 2562383102),
              (this._d = 271733878),
              (this._e = 3285377520),
              this
            );
          }),
          (f.prototype._update = function (t) {
            for (
              var e,
                r = this._w,
                i = 0 | this._a,
                n = 0 | this._b,
                o = 0 | this._c,
                a = 0 | this._d,
                f = 0 | this._e,
                c = 0;
              c < 16;
              ++c
            )
              r[c] = t.readInt32BE(4 * c);
            for (; c < 80; ++c)
              r[c] = r[c - 3] ^ r[c - 8] ^ r[c - 14] ^ r[c - 16];
            for (var d = 0; d < 80; ++d) {
              var l = ~~(d / 20),
                p =
                  0 |
                  ((((e = i) << 5) | (e >>> 27)) +
                    u(l, n, o, a) +
                    f +
                    r[d] +
                    s[l]);
              (f = a), (a = o), (o = h(n)), (n = i), (i = p);
            }
            (this._a = (i + this._a) | 0),
              (this._b = (n + this._b) | 0),
              (this._c = (o + this._c) | 0),
              (this._d = (a + this._d) | 0),
              (this._e = (f + this._e) | 0);
          }),
          (f.prototype._hash = function () {
            var t = o.allocUnsafe(20);
            return (
              t.writeInt32BE(0 | this._a, 0),
              t.writeInt32BE(0 | this._b, 4),
              t.writeInt32BE(0 | this._c, 8),
              t.writeInt32BE(0 | this._d, 12),
              t.writeInt32BE(0 | this._e, 16),
              t
            );
          }),
          (e.exports = f);
      },
      { "./hash": 162, inherits: 132, "safe-buffer": 160 },
    ],
    165: [
      function (t, e, r) {
        var i = t("inherits"),
          n = t("./hash"),
          o = t("safe-buffer").Buffer,
          s = [1518500249, 1859775393, -1894007588, -899497514],
          a = new Array(80);
        function f() {
          this.init(), (this._w = a), n.call(this, 64, 56);
        }
        function h(t) {
          return (t << 5) | (t >>> 27);
        }
        function u(t) {
          return (t << 30) | (t >>> 2);
        }
        function c(t, e, r, i) {
          return 0 === t
            ? (e & r) | (~e & i)
            : 2 === t
            ? (e & r) | (e & i) | (r & i)
            : e ^ r ^ i;
        }
        i(f, n),
          (f.prototype.init = function () {
            return (
              (this._a = 1732584193),
              (this._b = 4023233417),
              (this._c = 2562383102),
              (this._d = 271733878),
              (this._e = 3285377520),
              this
            );
          }),
          (f.prototype._update = function (t) {
            for (
              var e,
                r = this._w,
                i = 0 | this._a,
                n = 0 | this._b,
                o = 0 | this._c,
                a = 0 | this._d,
                f = 0 | this._e,
                d = 0;
              d < 16;
              ++d
            )
              r[d] = t.readInt32BE(4 * d);
            for (; d < 80; ++d)
              r[d] =
                ((e = r[d - 3] ^ r[d - 8] ^ r[d - 14] ^ r[d - 16]) << 1) |
                (e >>> 31);
            for (var l = 0; l < 80; ++l) {
              var p = ~~(l / 20),
                b = (h(i) + c(p, n, o, a) + f + r[l] + s[p]) | 0;
              (f = a), (a = o), (o = u(n)), (n = i), (i = b);
            }
            (this._a = (i + this._a) | 0),
              (this._b = (n + this._b) | 0),
              (this._c = (o + this._c) | 0),
              (this._d = (a + this._d) | 0),
              (this._e = (f + this._e) | 0);
          }),
          (f.prototype._hash = function () {
            var t = o.allocUnsafe(20);
            return (
              t.writeInt32BE(0 | this._a, 0),
              t.writeInt32BE(0 | this._b, 4),
              t.writeInt32BE(0 | this._c, 8),
              t.writeInt32BE(0 | this._d, 12),
              t.writeInt32BE(0 | this._e, 16),
              t
            );
          }),
          (e.exports = f);
      },
      { "./hash": 162, inherits: 132, "safe-buffer": 160 },
    ],
    166: [
      function (t, e, r) {
        var i = t("inherits"),
          n = t("./sha256"),
          o = t("./hash"),
          s = t("safe-buffer").Buffer,
          a = new Array(64);
        function f() {
          this.init(), (this._w = a), o.call(this, 64, 56);
        }
        i(f, n),
          (f.prototype.init = function () {
            return (
              (this._a = 3238371032),
              (this._b = 914150663),
              (this._c = 812702999),
              (this._d = 4144912697),
              (this._e = 4290775857),
              (this._f = 1750603025),
              (this._g = 1694076839),
              (this._h = 3204075428),
              this
            );
          }),
          (f.prototype._hash = function () {
            var t = s.allocUnsafe(28);
            return (
              t.writeInt32BE(this._a, 0),
              t.writeInt32BE(this._b, 4),
              t.writeInt32BE(this._c, 8),
              t.writeInt32BE(this._d, 12),
              t.writeInt32BE(this._e, 16),
              t.writeInt32BE(this._f, 20),
              t.writeInt32BE(this._g, 24),
              t
            );
          }),
          (e.exports = f);
      },
      { "./hash": 162, "./sha256": 167, inherits: 132, "safe-buffer": 160 },
    ],
    167: [
      function (t, e, r) {
        var i = t("inherits"),
          n = t("./hash"),
          o = t("safe-buffer").Buffer,
          s = [
            1116352408, 1899447441, 3049323471, 3921009573, 961987163,
            1508970993, 2453635748, 2870763221, 3624381080, 310598401,
            607225278, 1426881987, 1925078388, 2162078206, 2614888103,
            3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983,
            1249150122, 1555081692, 1996064986, 2554220882, 2821834349,
            2952996808, 3210313671, 3336571891, 3584528711, 113926993,
            338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700,
            1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
            3259730800, 3345764771, 3516065817, 3600352804, 4094571909,
            275423344, 430227734, 506948616, 659060556, 883997877, 958139571,
            1322822218, 1537002063, 1747873779, 1955562222, 2024104815,
            2227730452, 2361852424, 2428436474, 2756734187, 3204031479,
            3329325298,
          ],
          a = new Array(64);
        function f() {
          this.init(), (this._w = a), n.call(this, 64, 56);
        }
        function h(t, e, r) {
          return r ^ (t & (e ^ r));
        }
        function u(t, e, r) {
          return (t & e) | (r & (t | e));
        }
        function c(t) {
          return (
            ((t >>> 2) | (t << 30)) ^
            ((t >>> 13) | (t << 19)) ^
            ((t >>> 22) | (t << 10))
          );
        }
        function d(t) {
          return (
            ((t >>> 6) | (t << 26)) ^
            ((t >>> 11) | (t << 21)) ^
            ((t >>> 25) | (t << 7))
          );
        }
        function l(t) {
          return ((t >>> 7) | (t << 25)) ^ ((t >>> 18) | (t << 14)) ^ (t >>> 3);
        }
        i(f, n),
          (f.prototype.init = function () {
            return (
              (this._a = 1779033703),
              (this._b = 3144134277),
              (this._c = 1013904242),
              (this._d = 2773480762),
              (this._e = 1359893119),
              (this._f = 2600822924),
              (this._g = 528734635),
              (this._h = 1541459225),
              this
            );
          }),
          (f.prototype._update = function (t) {
            for (
              var e,
                r = this._w,
                i = 0 | this._a,
                n = 0 | this._b,
                o = 0 | this._c,
                a = 0 | this._d,
                f = 0 | this._e,
                p = 0 | this._f,
                b = 0 | this._g,
                m = 0 | this._h,
                y = 0;
              y < 16;
              ++y
            )
              r[y] = t.readInt32BE(4 * y);
            for (; y < 64; ++y)
              r[y] =
                0 |
                (((((e = r[y - 2]) >>> 17) | (e << 15)) ^
                  ((e >>> 19) | (e << 13)) ^
                  (e >>> 10)) +
                  r[y - 7] +
                  l(r[y - 15]) +
                  r[y - 16]);
            for (var g = 0; g < 64; ++g) {
              var v = (m + d(f) + h(f, p, b) + s[g] + r[g]) | 0,
                w = (c(i) + u(i, n, o)) | 0;
              (m = b),
                (b = p),
                (p = f),
                (f = (a + v) | 0),
                (a = o),
                (o = n),
                (n = i),
                (i = (v + w) | 0);
            }
            (this._a = (i + this._a) | 0),
              (this._b = (n + this._b) | 0),
              (this._c = (o + this._c) | 0),
              (this._d = (a + this._d) | 0),
              (this._e = (f + this._e) | 0),
              (this._f = (p + this._f) | 0),
              (this._g = (b + this._g) | 0),
              (this._h = (m + this._h) | 0);
          }),
          (f.prototype._hash = function () {
            var t = o.allocUnsafe(32);
            return (
              t.writeInt32BE(this._a, 0),
              t.writeInt32BE(this._b, 4),
              t.writeInt32BE(this._c, 8),
              t.writeInt32BE(this._d, 12),
              t.writeInt32BE(this._e, 16),
              t.writeInt32BE(this._f, 20),
              t.writeInt32BE(this._g, 24),
              t.writeInt32BE(this._h, 28),
              t
            );
          }),
          (e.exports = f);
      },
      { "./hash": 162, inherits: 132, "safe-buffer": 160 },
    ],
    168: [
      function (t, e, r) {
        var i = t("inherits"),
          n = t("./sha512"),
          o = t("./hash"),
          s = t("safe-buffer").Buffer,
          a = new Array(160);
        function f() {
          this.init(), (this._w = a), o.call(this, 128, 112);
        }
        i(f, n),
          (f.prototype.init = function () {
            return (
              (this._ah = 3418070365),
              (this._bh = 1654270250),
              (this._ch = 2438529370),
              (this._dh = 355462360),
              (this._eh = 1731405415),
              (this._fh = 2394180231),
              (this._gh = 3675008525),
              (this._hh = 1203062813),
              (this._al = 3238371032),
              (this._bl = 914150663),
              (this._cl = 812702999),
              (this._dl = 4144912697),
              (this._el = 4290775857),
              (this._fl = 1750603025),
              (this._gl = 1694076839),
              (this._hl = 3204075428),
              this
            );
          }),
          (f.prototype._hash = function () {
            var t = s.allocUnsafe(48);
            function e(e, r, i) {
              t.writeInt32BE(e, i), t.writeInt32BE(r, i + 4);
            }
            return (
              e(this._ah, this._al, 0),
              e(this._bh, this._bl, 8),
              e(this._ch, this._cl, 16),
              e(this._dh, this._dl, 24),
              e(this._eh, this._el, 32),
              e(this._fh, this._fl, 40),
              t
            );
          }),
          (e.exports = f);
      },
      { "./hash": 162, "./sha512": 169, inherits: 132, "safe-buffer": 160 },
    ],
    169: [
      function (t, e, r) {
        var i = t("inherits"),
          n = t("./hash"),
          o = t("safe-buffer").Buffer,
          s = [
            1116352408, 3609767458, 1899447441, 602891725, 3049323471,
            3964484399, 3921009573, 2173295548, 961987163, 4081628472,
            1508970993, 3053834265, 2453635748, 2937671579, 2870763221,
            3664609560, 3624381080, 2734883394, 310598401, 1164996542,
            607225278, 1323610764, 1426881987, 3590304994, 1925078388,
            4068182383, 2162078206, 991336113, 2614888103, 633803317,
            3248222580, 3479774868, 3835390401, 2666613458, 4022224774,
            944711139, 264347078, 2341262773, 604807628, 2007800933, 770255983,
            1495990901, 1249150122, 1856431235, 1555081692, 3175218132,
            1996064986, 2198950837, 2554220882, 3999719339, 2821834349,
            766784016, 2952996808, 2566594879, 3210313671, 3203337956,
            3336571891, 1034457026, 3584528711, 2466948901, 113926993,
            3758326383, 338241895, 168717936, 666307205, 1188179964, 773529912,
            1546045734, 1294757372, 1522805485, 1396182291, 2643833823,
            1695183700, 2343527390, 1986661051, 1014477480, 2177026350,
            1206759142, 2456956037, 344077627, 2730485921, 1290863460,
            2820302411, 3158454273, 3259730800, 3505952657, 3345764771,
            106217008, 3516065817, 3606008344, 3600352804, 1432725776,
            4094571909, 1467031594, 275423344, 851169720, 430227734, 3100823752,
            506948616, 1363258195, 659060556, 3750685593, 883997877, 3785050280,
            958139571, 3318307427, 1322822218, 3812723403, 1537002063,
            2003034995, 1747873779, 3602036899, 1955562222, 1575990012,
            2024104815, 1125592928, 2227730452, 2716904306, 2361852424,
            442776044, 2428436474, 593698344, 2756734187, 3733110249,
            3204031479, 2999351573, 3329325298, 3815920427, 3391569614,
            3928383900, 3515267271, 566280711, 3940187606, 3454069534,
            4118630271, 4000239992, 116418474, 1914138554, 174292421,
            2731055270, 289380356, 3203993006, 460393269, 320620315, 685471733,
            587496836, 852142971, 1086792851, 1017036298, 365543100, 1126000580,
            2618297676, 1288033470, 3409855158, 1501505948, 4234509866,
            1607167915, 987167468, 1816402316, 1246189591,
          ],
          a = new Array(160);
        function f() {
          this.init(), (this._w = a), n.call(this, 128, 112);
        }
        function h(t, e, r) {
          return r ^ (t & (e ^ r));
        }
        function u(t, e, r) {
          return (t & e) | (r & (t | e));
        }
        function c(t, e) {
          return (
            ((t >>> 28) | (e << 4)) ^
            ((e >>> 2) | (t << 30)) ^
            ((e >>> 7) | (t << 25))
          );
        }
        function d(t, e) {
          return (
            ((t >>> 14) | (e << 18)) ^
            ((t >>> 18) | (e << 14)) ^
            ((e >>> 9) | (t << 23))
          );
        }
        function l(t, e) {
          return ((t >>> 1) | (e << 31)) ^ ((t >>> 8) | (e << 24)) ^ (t >>> 7);
        }
        function p(t, e) {
          return (
            ((t >>> 1) | (e << 31)) ^
            ((t >>> 8) | (e << 24)) ^
            ((t >>> 7) | (e << 25))
          );
        }
        function b(t, e) {
          return ((t >>> 19) | (e << 13)) ^ ((e >>> 29) | (t << 3)) ^ (t >>> 6);
        }
        function m(t, e) {
          return (
            ((t >>> 19) | (e << 13)) ^
            ((e >>> 29) | (t << 3)) ^
            ((t >>> 6) | (e << 26))
          );
        }
        function y(t, e) {
          return t >>> 0 < e >>> 0 ? 1 : 0;
        }
        i(f, n),
          (f.prototype.init = function () {
            return (
              (this._ah = 1779033703),
              (this._bh = 3144134277),
              (this._ch = 1013904242),
              (this._dh = 2773480762),
              (this._eh = 1359893119),
              (this._fh = 2600822924),
              (this._gh = 528734635),
              (this._hh = 1541459225),
              (this._al = 4089235720),
              (this._bl = 2227873595),
              (this._cl = 4271175723),
              (this._dl = 1595750129),
              (this._el = 2917565137),
              (this._fl = 725511199),
              (this._gl = 4215389547),
              (this._hl = 327033209),
              this
            );
          }),
          (f.prototype._update = function (t) {
            for (
              var e = this._w,
                r = 0 | this._ah,
                i = 0 | this._bh,
                n = 0 | this._ch,
                o = 0 | this._dh,
                a = 0 | this._eh,
                f = 0 | this._fh,
                g = 0 | this._gh,
                v = 0 | this._hh,
                w = 0 | this._al,
                _ = 0 | this._bl,
                M = 0 | this._cl,
                S = 0 | this._dl,
                E = 0 | this._el,
                A = 0 | this._fl,
                k = 0 | this._gl,
                B = 0 | this._hl,
                x = 0;
              x < 32;
              x += 2
            )
              (e[x] = t.readInt32BE(4 * x)),
                (e[x + 1] = t.readInt32BE(4 * x + 4));
            for (; x < 160; x += 2) {
              var I = e[x - 30],
                R = e[x - 30 + 1],
                j = l(I, R),
                T = p(R, I),
                L = b((I = e[x - 4]), (R = e[x - 4 + 1])),
                C = m(R, I),
                P = e[x - 14],
                O = e[x - 14 + 1],
                U = e[x - 32],
                D = e[x - 32 + 1],
                N = (T + O) | 0,
                q = (j + P + y(N, T)) | 0;
              (q =
                ((q = (q + L + y((N = (N + C) | 0), C)) | 0) +
                  U +
                  y((N = (N + D) | 0), D)) |
                0),
                (e[x] = q),
                (e[x + 1] = N);
            }
            for (var z = 0; z < 160; z += 2) {
              (q = e[z]), (N = e[z + 1]);
              var F = u(r, i, n),
                K = u(w, _, M),
                H = c(r, w),
                W = c(w, r),
                V = d(a, E),
                Z = d(E, a),
                G = s[z],
                X = s[z + 1],
                Y = h(a, f, g),
                $ = h(E, A, k),
                J = (B + Z) | 0,
                Q = (v + V + y(J, B)) | 0;
              Q =
                ((Q =
                  ((Q = (Q + Y + y((J = (J + $) | 0), $)) | 0) +
                    G +
                    y((J = (J + X) | 0), X)) |
                  0) +
                  q +
                  y((J = (J + N) | 0), N)) |
                0;
              var tt = (W + K) | 0,
                et = (H + F + y(tt, W)) | 0;
              (v = g),
                (B = k),
                (g = f),
                (k = A),
                (f = a),
                (A = E),
                (a = (o + Q + y((E = (S + J) | 0), S)) | 0),
                (o = n),
                (S = M),
                (n = i),
                (M = _),
                (i = r),
                (_ = w),
                (r = (Q + et + y((w = (J + tt) | 0), J)) | 0);
            }
            (this._al = (this._al + w) | 0),
              (this._bl = (this._bl + _) | 0),
              (this._cl = (this._cl + M) | 0),
              (this._dl = (this._dl + S) | 0),
              (this._el = (this._el + E) | 0),
              (this._fl = (this._fl + A) | 0),
              (this._gl = (this._gl + k) | 0),
              (this._hl = (this._hl + B) | 0),
              (this._ah = (this._ah + r + y(this._al, w)) | 0),
              (this._bh = (this._bh + i + y(this._bl, _)) | 0),
              (this._ch = (this._ch + n + y(this._cl, M)) | 0),
              (this._dh = (this._dh + o + y(this._dl, S)) | 0),
              (this._eh = (this._eh + a + y(this._el, E)) | 0),
              (this._fh = (this._fh + f + y(this._fl, A)) | 0),
              (this._gh = (this._gh + g + y(this._gl, k)) | 0),
              (this._hh = (this._hh + v + y(this._hl, B)) | 0);
          }),
          (f.prototype._hash = function () {
            var t = o.allocUnsafe(64);
            function e(e, r, i) {
              t.writeInt32BE(e, i), t.writeInt32BE(r, i + 4);
            }
            return (
              e(this._ah, this._al, 0),
              e(this._bh, this._bl, 8),
              e(this._ch, this._cl, 16),
              e(this._dh, this._dl, 24),
              e(this._eh, this._el, 32),
              e(this._fh, this._fl, 40),
              e(this._gh, this._gl, 48),
              e(this._hh, this._hl, 56),
              t
            );
          }),
          (e.exports = f);
      },
      { "./hash": 162, inherits: 132, "safe-buffer": 160 },
    ],
    170: [
      function (t, e, r) {
        e.exports = n;
        var i = t("events").EventEmitter;
        function n() {
          i.call(this);
        }
        t("inherits")(n, i),
          (n.Readable = t("readable-stream/lib/_stream_readable.js")),
          (n.Writable = t("readable-stream/lib/_stream_writable.js")),
          (n.Duplex = t("readable-stream/lib/_stream_duplex.js")),
          (n.Transform = t("readable-stream/lib/_stream_transform.js")),
          (n.PassThrough = t("readable-stream/lib/_stream_passthrough.js")),
          (n.finished = t(
            "readable-stream/lib/internal/streams/end-of-stream.js"
          )),
          (n.pipeline = t("readable-stream/lib/internal/streams/pipeline.js")),
          (n.Stream = n),
          (n.prototype.pipe = function (t, e) {
            var r = this;
            function n(e) {
              t.writable && !1 === t.write(e) && r.pause && r.pause();
            }
            function o() {
              r.readable && r.resume && r.resume();
            }
            r.on("data", n),
              t.on("drain", o),
              t._isStdio ||
                (e && !1 === e.end) ||
                (r.on("end", a), r.on("close", f));
            var s = !1;
            function a() {
              s || ((s = !0), t.end());
            }
            function f() {
              s || ((s = !0), "function" == typeof t.destroy && t.destroy());
            }
            function h(t) {
              if ((u(), 0 === i.listenerCount(this, "error"))) throw t;
            }
            function u() {
              r.removeListener("data", n),
                t.removeListener("drain", o),
                r.removeListener("end", a),
                r.removeListener("close", f),
                r.removeListener("error", h),
                t.removeListener("error", h),
                r.removeListener("end", u),
                r.removeListener("close", u),
                t.removeListener("close", u);
            }
            return (
              r.on("error", h),
              t.on("error", h),
              r.on("end", u),
              r.on("close", u),
              t.on("close", u),
              t.emit("pipe", r),
              t
            );
          });
      },
      {
        events: 100,
        inherits: 132,
        "readable-stream/lib/_stream_duplex.js": 172,
        "readable-stream/lib/_stream_passthrough.js": 173,
        "readable-stream/lib/_stream_readable.js": 174,
        "readable-stream/lib/_stream_transform.js": 175,
        "readable-stream/lib/_stream_writable.js": 176,
        "readable-stream/lib/internal/streams/end-of-stream.js": 180,
        "readable-stream/lib/internal/streams/pipeline.js": 182,
      },
    ],
    171: [
      function (t, e, r) {
        arguments[4][47][0].apply(r, arguments);
      },
      { dup: 47 },
    ],
    172: [
      function (t, e, r) {
        arguments[4][48][0].apply(r, arguments);
      },
      {
        "./_stream_readable": 174,
        "./_stream_writable": 176,
        _process: 149,
        dup: 48,
        inherits: 132,
      },
    ],
    173: [
      function (t, e, r) {
        arguments[4][49][0].apply(r, arguments);
      },
      { "./_stream_transform": 175, dup: 49, inherits: 132 },
    ],
    174: [
      function (t, e, r) {
        arguments[4][50][0].apply(r, arguments);
      },
      {
        "../errors": 171,
        "./_stream_duplex": 172,
        "./internal/streams/async_iterator": 177,
        "./internal/streams/buffer_list": 178,
        "./internal/streams/destroy": 179,
        "./internal/streams/from": 181,
        "./internal/streams/state": 183,
        "./internal/streams/stream": 184,
        _process: 149,
        buffer: 63,
        dup: 50,
        events: 100,
        inherits: 132,
        "string_decoder/": 185,
        util: 19,
      },
    ],
    175: [
      function (t, e, r) {
        arguments[4][51][0].apply(r, arguments);
      },
      { "../errors": 171, "./_stream_duplex": 172, dup: 51, inherits: 132 },
    ],
    176: [
      function (t, e, r) {
        arguments[4][52][0].apply(r, arguments);
      },
      {
        "../errors": 171,
        "./_stream_duplex": 172,
        "./internal/streams/destroy": 179,
        "./internal/streams/state": 183,
        "./internal/streams/stream": 184,
        _process: 149,
        buffer: 63,
        dup: 52,
        inherits: 132,
        "util-deprecate": 186,
      },
    ],
    177: [
      function (t, e, r) {
        arguments[4][53][0].apply(r, arguments);
      },
      { "./end-of-stream": 180, _process: 149, dup: 53 },
    ],
    178: [
      function (t, e, r) {
        arguments[4][54][0].apply(r, arguments);
      },
      { buffer: 63, dup: 54, util: 19 },
    ],
    179: [
      function (t, e, r) {
        arguments[4][55][0].apply(r, arguments);
      },
      { _process: 149, dup: 55 },
    ],
    180: [
      function (t, e, r) {
        arguments[4][56][0].apply(r, arguments);
      },
      { "../../../errors": 171, dup: 56 },
    ],
    181: [
      function (t, e, r) {
        arguments[4][57][0].apply(r, arguments);
      },
      { dup: 57 },
    ],
    182: [
      function (t, e, r) {
        arguments[4][58][0].apply(r, arguments);
      },
      { "../../../errors": 171, "./end-of-stream": 180, dup: 58 },
    ],
    183: [
      function (t, e, r) {
        arguments[4][59][0].apply(r, arguments);
      },
      { "../../../errors": 171, dup: 59 },
    ],
    184: [
      function (t, e, r) {
        arguments[4][60][0].apply(r, arguments);
      },
      { dup: 60, events: 100 },
    ],
    185: [
      function (t, e, r) {
        "use strict";
        var i = t("safe-buffer").Buffer,
          n =
            i.isEncoding ||
            function (t) {
              switch ((t = "" + t) && t.toLowerCase()) {
                case "hex":
                case "utf8":
                case "utf-8":
                case "ascii":
                case "binary":
                case "base64":
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                case "raw":
                  return !0;
                default:
                  return !1;
              }
            };
        function o(t) {
          var e;
          switch (
            ((this.encoding = (function (t) {
              var e = (function (t) {
                if (!t) return "utf8";
                for (var e; ; )
                  switch (t) {
                    case "utf8":
                    case "utf-8":
                      return "utf8";
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                      return "utf16le";
                    case "latin1":
                    case "binary":
                      return "latin1";
                    case "base64":
                    case "ascii":
                    case "hex":
                      return t;
                    default:
                      if (e) return;
                      (t = ("" + t).toLowerCase()), (e = !0);
                  }
              })(t);
              if ("string" != typeof e && (i.isEncoding === n || !n(t)))
                throw new Error("Unknown encoding: " + t);
              return e || t;
            })(t)),
            this.encoding)
          ) {
            case "utf16le":
              (this.text = f), (this.end = h), (e = 4);
              break;
            case "utf8":
              (this.fillLast = a), (e = 4);
              break;
            case "base64":
              (this.text = u), (this.end = c), (e = 3);
              break;
            default:
              return (this.write = d), void (this.end = l);
          }
          (this.lastNeed = 0),
            (this.lastTotal = 0),
            (this.lastChar = i.allocUnsafe(e));
        }
        function s(t) {
          return t <= 127
            ? 0
            : t >> 5 == 6
            ? 2
            : t >> 4 == 14
            ? 3
            : t >> 3 == 30
            ? 4
            : t >> 6 == 2
            ? -1
            : -2;
        }
        function a(t) {
          var e = this.lastTotal - this.lastNeed,
            r = (function (t, e, r) {
              if (128 != (192 & e[0])) return (t.lastNeed = 0), "�";
              if (t.lastNeed > 1 && e.length > 1) {
                if (128 != (192 & e[1])) return (t.lastNeed = 1), "�";
                if (t.lastNeed > 2 && e.length > 2 && 128 != (192 & e[2]))
                  return (t.lastNeed = 2), "�";
              }
            })(this, t);
          return void 0 !== r
            ? r
            : this.lastNeed <= t.length
            ? (t.copy(this.lastChar, e, 0, this.lastNeed),
              this.lastChar.toString(this.encoding, 0, this.lastTotal))
            : (t.copy(this.lastChar, e, 0, t.length),
              void (this.lastNeed -= t.length));
        }
        function f(t, e) {
          if ((t.length - e) % 2 == 0) {
            var r = t.toString("utf16le", e);
            if (r) {
              var i = r.charCodeAt(r.length - 1);
              if (i >= 55296 && i <= 56319)
                return (
                  (this.lastNeed = 2),
                  (this.lastTotal = 4),
                  (this.lastChar[0] = t[t.length - 2]),
                  (this.lastChar[1] = t[t.length - 1]),
                  r.slice(0, -1)
                );
            }
            return r;
          }
          return (
            (this.lastNeed = 1),
            (this.lastTotal = 2),
            (this.lastChar[0] = t[t.length - 1]),
            t.toString("utf16le", e, t.length - 1)
          );
        }
        function h(t) {
          var e = t && t.length ? this.write(t) : "";
          if (this.lastNeed) {
            var r = this.lastTotal - this.lastNeed;
            return e + this.lastChar.toString("utf16le", 0, r);
          }
          return e;
        }
        function u(t, e) {
          var r = (t.length - e) % 3;
          return 0 === r
            ? t.toString("base64", e)
            : ((this.lastNeed = 3 - r),
              (this.lastTotal = 3),
              1 === r
                ? (this.lastChar[0] = t[t.length - 1])
                : ((this.lastChar[0] = t[t.length - 2]),
                  (this.lastChar[1] = t[t.length - 1])),
              t.toString("base64", e, t.length - r));
        }
        function c(t) {
          var e = t && t.length ? this.write(t) : "";
          return this.lastNeed
            ? e + this.lastChar.toString("base64", 0, 3 - this.lastNeed)
            : e;
        }
        function d(t) {
          return t.toString(this.encoding);
        }
        function l(t) {
          return t && t.length ? this.write(t) : "";
        }
        (r.StringDecoder = o),
          (o.prototype.write = function (t) {
            if (0 === t.length) return "";
            var e, r;
            if (this.lastNeed) {
              if (void 0 === (e = this.fillLast(t))) return "";
              (r = this.lastNeed), (this.lastNeed = 0);
            } else r = 0;
            return r < t.length
              ? e
                ? e + this.text(t, r)
                : this.text(t, r)
              : e || "";
          }),
          (o.prototype.end = function (t) {
            var e = t && t.length ? this.write(t) : "";
            return this.lastNeed ? e + "�" : e;
          }),
          (o.prototype.text = function (t, e) {
            var r = (function (t, e, r) {
              var i = e.length - 1;
              if (i < r) return 0;
              var n = s(e[i]);
              if (n >= 0) return n > 0 && (t.lastNeed = n - 1), n;
              if (--i < r || -2 === n) return 0;
              if (((n = s(e[i])), n >= 0))
                return n > 0 && (t.lastNeed = n - 2), n;
              if (--i < r || -2 === n) return 0;
              if (((n = s(e[i])), n >= 0))
                return n > 0 && (2 === n ? (n = 0) : (t.lastNeed = n - 3)), n;
              return 0;
            })(this, t, e);
            if (!this.lastNeed) return t.toString("utf8", e);
            this.lastTotal = r;
            var i = t.length - (r - this.lastNeed);
            return t.copy(this.lastChar, 0, i), t.toString("utf8", e, i);
          }),
          (o.prototype.fillLast = function (t) {
            if (this.lastNeed <= t.length)
              return (
                t.copy(
                  this.lastChar,
                  this.lastTotal - this.lastNeed,
                  0,
                  this.lastNeed
                ),
                this.lastChar.toString(this.encoding, 0, this.lastTotal)
              );
            t.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, t.length),
              (this.lastNeed -= t.length);
          });
      },
      { "safe-buffer": 160 },
    ],
    186: [
      function (t, e, r) {
        (function (t) {
          (function () {
            function r(e) {
              try {
                if (!t.localStorage) return !1;
              } catch (t) {
                return !1;
              }
              var r = t.localStorage[e];
              return null != r && "true" === String(r).toLowerCase();
            }
            e.exports = function (t, e) {
              if (r("noDeprecation")) return t;
              var i = !1;
              return function () {
                if (!i) {
                  if (r("throwDeprecation")) throw new Error(e);
                  r("traceDeprecation") ? console.trace(e) : console.warn(e),
                    (i = !0);
                }
                return t.apply(this, arguments);
              };
            };
          }).call(this);
        }).call(
          this,
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        );
      },
      {},
    ],
    187: [
      function (t, e, r) {
        var i = t("crypto"),
          n = t("buffer/").Buffer;
        const o =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        (unscramble = function (t, e) {
          const r = n.from(t, "base64"),
            i = [];
          for (let t = 0; t < r.length; t += 4) i.push(r.readUInt32LE(t));
          const s = i.join(",").split(","),
            a = (function (t) {
              let e = 0;
              for (let r = 0; r < t.length; r += 1) e += o.indexOf(t[r]);
              return e;
            })(e);
          let f = "";
          for (let t = 0; t < s.length; t += 1) {
            const r = s[t];
            if (0 === r.length) continue;
            const i = parseInt(r, 10) / (a + t),
              n = e[t % e.length],
              h = o.indexOf(n);
            f += o[i - h];
          }
          return f;
        }),
          (decryptData = function (t, e, r) {
            const o = new n.from(r, "base64"),
              s = new n.from(e, "base64"),
              a = i.createDecipheriv("aes-256-cbc", s, o),
              f = new n.from(t, "base64").toString("binary");
            let h = a.update(f, "binary", "utf8");
            return (h += a.final("utf8")), h;
          }),
          (decrypt = function (t, e) {
            try {
              const i = e.split("."),
                n = t.split(".");
              if (2 != i.length) throw new Error("key not correct");
              if (2 != n.length) throw new Error("data not correct");
              const o = i[0],
                s = i[1],
                a = n[0],
                f = n[1];
              var r = unscramble(a, s);
              return decryptData(r, o, f);
            } catch (t) {
              throw new Error(t);
            }
          }),
          console.log(
            decrypt(
              "i14BAHimAACRfAIA2BEBAPOmAQDM6AEAt4MBAKi/AQDa+gAASrQBAKecAQDkqAEAl9EAAEQzAgCpCQIAAIABAGRYAgAylgAANWsCAEjtAQDwIAEAHB4CAFoGAgAISQIA.XOK7nRWb8MifaN8RUdvGig==",
              "wI66ng98yMw7YZFuQoKQp4bu0F8Cm7jEt9wGZNPkBpY=.TJ/ZlzJzbNagCnvKwOvzY6WhZ/8onCk02oZselSb6Wc="
            )
          );
      },
      { "buffer/": 189, crypto: 71 },
    ],
    188: [
      function (t, e, r) {
        arguments[4][16][0].apply(r, arguments);
      },
      { dup: 16 },
    ],
    189: [
      function (t, e, r) {
        (function (e) {
          (function () {
            "use strict";
            const e = t("base64-js"),
              i = t("ieee754"),
              n =
                "function" == typeof Symbol && "function" == typeof Symbol.for
                  ? Symbol.for("nodejs.util.inspect.custom")
                  : null;
            (r.Buffer = a),
              (r.SlowBuffer = function (t) {
                +t != t && (t = 0);
                return a.alloc(+t);
              }),
              (r.INSPECT_MAX_BYTES = 50);
            const o = 2147483647;
            function s(t) {
              if (t > o)
                throw new RangeError(
                  'The value "' + t + '" is invalid for option "size"'
                );
              const e = new Uint8Array(t);
              return Object.setPrototypeOf(e, a.prototype), e;
            }
            function a(t, e, r) {
              if ("number" == typeof t) {
                if ("string" == typeof e)
                  throw new TypeError(
                    'The "string" argument must be of type string. Received type number'
                  );
                return u(t);
              }
              return f(t, e, r);
            }
            function f(t, e, r) {
              if ("string" == typeof t)
                return (function (t, e) {
                  ("string" == typeof e && "" !== e) || (e = "utf8");
                  if (!a.isEncoding(e))
                    throw new TypeError("Unknown encoding: " + e);
                  const r = 0 | p(t, e);
                  let i = s(r);
                  const n = i.write(t, e);
                  n !== r && (i = i.slice(0, n));
                  return i;
                })(t, e);
              if (ArrayBuffer.isView(t))
                return (function (t) {
                  if (G(t, Uint8Array)) {
                    const e = new Uint8Array(t);
                    return d(e.buffer, e.byteOffset, e.byteLength);
                  }
                  return c(t);
                })(t);
              if (null == t)
                throw new TypeError(
                  "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
                    typeof t
                );
              if (G(t, ArrayBuffer) || (t && G(t.buffer, ArrayBuffer)))
                return d(t, e, r);
              if (
                "undefined" != typeof SharedArrayBuffer &&
                (G(t, SharedArrayBuffer) ||
                  (t && G(t.buffer, SharedArrayBuffer)))
              )
                return d(t, e, r);
              if ("number" == typeof t)
                throw new TypeError(
                  'The "value" argument must not be of type number. Received type number'
                );
              const i = t.valueOf && t.valueOf();
              if (null != i && i !== t) return a.from(i, e, r);
              const n = (function (t) {
                if (a.isBuffer(t)) {
                  const e = 0 | l(t.length),
                    r = s(e);
                  return 0 === r.length || t.copy(r, 0, 0, e), r;
                }
                if (void 0 !== t.length)
                  return "number" != typeof t.length || X(t.length)
                    ? s(0)
                    : c(t);
                if ("Buffer" === t.type && Array.isArray(t.data))
                  return c(t.data);
              })(t);
              if (n) return n;
              if (
                "undefined" != typeof Symbol &&
                null != Symbol.toPrimitive &&
                "function" == typeof t[Symbol.toPrimitive]
              )
                return a.from(t[Symbol.toPrimitive]("string"), e, r);
              throw new TypeError(
                "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
                  typeof t
              );
            }
            function h(t) {
              if ("number" != typeof t)
                throw new TypeError('"size" argument must be of type number');
              if (t < 0)
                throw new RangeError(
                  'The value "' + t + '" is invalid for option "size"'
                );
            }
            function u(t) {
              return h(t), s(t < 0 ? 0 : 0 | l(t));
            }
            function c(t) {
              const e = t.length < 0 ? 0 : 0 | l(t.length),
                r = s(e);
              for (let i = 0; i < e; i += 1) r[i] = 255 & t[i];
              return r;
            }
            function d(t, e, r) {
              if (e < 0 || t.byteLength < e)
                throw new RangeError('"offset" is outside of buffer bounds');
              if (t.byteLength < e + (r || 0))
                throw new RangeError('"length" is outside of buffer bounds');
              let i;
              return (
                (i =
                  void 0 === e && void 0 === r
                    ? new Uint8Array(t)
                    : void 0 === r
                    ? new Uint8Array(t, e)
                    : new Uint8Array(t, e, r)),
                Object.setPrototypeOf(i, a.prototype),
                i
              );
            }
            function l(t) {
              if (t >= o)
                throw new RangeError(
                  "Attempt to allocate Buffer larger than maximum size: 0x" +
                    o.toString(16) +
                    " bytes"
                );
              return 0 | t;
            }
            function p(t, e) {
              if (a.isBuffer(t)) return t.length;
              if (ArrayBuffer.isView(t) || G(t, ArrayBuffer))
                return t.byteLength;
              if ("string" != typeof t)
                throw new TypeError(
                  'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' +
                    typeof t
                );
              const r = t.length,
                i = arguments.length > 2 && !0 === arguments[2];
              if (!i && 0 === r) return 0;
              let n = !1;
              for (;;)
                switch (e) {
                  case "ascii":
                  case "latin1":
                  case "binary":
                    return r;
                  case "utf8":
                  case "utf-8":
                    return W(t).length;
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return 2 * r;
                  case "hex":
                    return r >>> 1;
                  case "base64":
                    return V(t).length;
                  default:
                    if (n) return i ? -1 : W(t).length;
                    (e = ("" + e).toLowerCase()), (n = !0);
                }
            }
            function b(t, e, r) {
              let i = !1;
              if (((void 0 === e || e < 0) && (e = 0), e > this.length))
                return "";
              if (
                ((void 0 === r || r > this.length) && (r = this.length), r <= 0)
              )
                return "";
              if ((r >>>= 0) <= (e >>>= 0)) return "";
              for (t || (t = "utf8"); ; )
                switch (t) {
                  case "hex":
                    return I(this, e, r);
                  case "utf8":
                  case "utf-8":
                    return A(this, e, r);
                  case "ascii":
                    return B(this, e, r);
                  case "latin1":
                  case "binary":
                    return x(this, e, r);
                  case "base64":
                    return E(this, e, r);
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return R(this, e, r);
                  default:
                    if (i) throw new TypeError("Unknown encoding: " + t);
                    (t = (t + "").toLowerCase()), (i = !0);
                }
            }
            function m(t, e, r) {
              const i = t[e];
              (t[e] = t[r]), (t[r] = i);
            }
            function y(t, e, r, i, n) {
              if (0 === t.length) return -1;
              if (
                ("string" == typeof r
                  ? ((i = r), (r = 0))
                  : r > 2147483647
                  ? (r = 2147483647)
                  : r < -2147483648 && (r = -2147483648),
                X((r = +r)) && (r = n ? 0 : t.length - 1),
                r < 0 && (r = t.length + r),
                r >= t.length)
              ) {
                if (n) return -1;
                r = t.length - 1;
              } else if (r < 0) {
                if (!n) return -1;
                r = 0;
              }
              if (("string" == typeof e && (e = a.from(e, i)), a.isBuffer(e)))
                return 0 === e.length ? -1 : g(t, e, r, i, n);
              if ("number" == typeof e)
                return (
                  (e &= 255),
                  "function" == typeof Uint8Array.prototype.indexOf
                    ? n
                      ? Uint8Array.prototype.indexOf.call(t, e, r)
                      : Uint8Array.prototype.lastIndexOf.call(t, e, r)
                    : g(t, [e], r, i, n)
                );
              throw new TypeError("val must be string, number or Buffer");
            }
            function g(t, e, r, i, n) {
              let o,
                s = 1,
                a = t.length,
                f = e.length;
              if (
                void 0 !== i &&
                ("ucs2" === (i = String(i).toLowerCase()) ||
                  "ucs-2" === i ||
                  "utf16le" === i ||
                  "utf-16le" === i)
              ) {
                if (t.length < 2 || e.length < 2) return -1;
                (s = 2), (a /= 2), (f /= 2), (r /= 2);
              }
              function h(t, e) {
                return 1 === s ? t[e] : t.readUInt16BE(e * s);
              }
              if (n) {
                let i = -1;
                for (o = r; o < a; o++)
                  if (h(t, o) === h(e, -1 === i ? 0 : o - i)) {
                    if ((-1 === i && (i = o), o - i + 1 === f)) return i * s;
                  } else -1 !== i && (o -= o - i), (i = -1);
              } else
                for (r + f > a && (r = a - f), o = r; o >= 0; o--) {
                  let r = !0;
                  for (let i = 0; i < f; i++)
                    if (h(t, o + i) !== h(e, i)) {
                      r = !1;
                      break;
                    }
                  if (r) return o;
                }
              return -1;
            }
            function v(t, e, r, i) {
              r = Number(r) || 0;
              const n = t.length - r;
              i ? (i = Number(i)) > n && (i = n) : (i = n);
              const o = e.length;
              let s;
              for (i > o / 2 && (i = o / 2), s = 0; s < i; ++s) {
                const i = parseInt(e.substr(2 * s, 2), 16);
                if (X(i)) return s;
                t[r + s] = i;
              }
              return s;
            }
            function w(t, e, r, i) {
              return Z(W(e, t.length - r), t, r, i);
            }
            function _(t, e, r, i) {
              return Z(
                (function (t) {
                  const e = [];
                  for (let r = 0; r < t.length; ++r)
                    e.push(255 & t.charCodeAt(r));
                  return e;
                })(e),
                t,
                r,
                i
              );
            }
            function M(t, e, r, i) {
              return Z(V(e), t, r, i);
            }
            function S(t, e, r, i) {
              return Z(
                (function (t, e) {
                  let r, i, n;
                  const o = [];
                  for (let s = 0; s < t.length && !((e -= 2) < 0); ++s)
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
            function E(t, r, i) {
              return 0 === r && i === t.length
                ? e.fromByteArray(t)
                : e.fromByteArray(t.slice(r, i));
            }
            function A(t, e, r) {
              r = Math.min(t.length, r);
              const i = [];
              let n = e;
              for (; n < r; ) {
                const e = t[n];
                let o = null,
                  s = e > 239 ? 4 : e > 223 ? 3 : e > 191 ? 2 : 1;
                if (n + s <= r) {
                  let r, i, a, f;
                  switch (s) {
                    case 1:
                      e < 128 && (o = e);
                      break;
                    case 2:
                      (r = t[n + 1]),
                        128 == (192 & r) &&
                          ((f = ((31 & e) << 6) | (63 & r)),
                          f > 127 && (o = f));
                      break;
                    case 3:
                      (r = t[n + 1]),
                        (i = t[n + 2]),
                        128 == (192 & r) &&
                          128 == (192 & i) &&
                          ((f = ((15 & e) << 12) | ((63 & r) << 6) | (63 & i)),
                          f > 2047 && (f < 55296 || f > 57343) && (o = f));
                      break;
                    case 4:
                      (r = t[n + 1]),
                        (i = t[n + 2]),
                        (a = t[n + 3]),
                        128 == (192 & r) &&
                          128 == (192 & i) &&
                          128 == (192 & a) &&
                          ((f =
                            ((15 & e) << 18) |
                            ((63 & r) << 12) |
                            ((63 & i) << 6) |
                            (63 & a)),
                          f > 65535 && f < 1114112 && (o = f));
                  }
                }
                null === o
                  ? ((o = 65533), (s = 1))
                  : o > 65535 &&
                    ((o -= 65536),
                    i.push(((o >>> 10) & 1023) | 55296),
                    (o = 56320 | (1023 & o))),
                  i.push(o),
                  (n += s);
              }
              return (function (t) {
                const e = t.length;
                if (e <= k) return String.fromCharCode.apply(String, t);
                let r = "",
                  i = 0;
                for (; i < e; )
                  r += String.fromCharCode.apply(String, t.slice(i, (i += k)));
                return r;
              })(i);
            }
            (r.kMaxLength = o),
              (a.TYPED_ARRAY_SUPPORT = (function () {
                try {
                  const t = new Uint8Array(1),
                    e = {
                      foo: function () {
                        return 42;
                      },
                    };
                  return (
                    Object.setPrototypeOf(e, Uint8Array.prototype),
                    Object.setPrototypeOf(t, e),
                    42 === t.foo()
                  );
                } catch (t) {
                  return !1;
                }
              })()),
              a.TYPED_ARRAY_SUPPORT ||
                "undefined" == typeof console ||
                "function" != typeof console.error ||
                console.error(
                  "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
                ),
              Object.defineProperty(a.prototype, "parent", {
                enumerable: !0,
                get: function () {
                  if (a.isBuffer(this)) return this.buffer;
                },
              }),
              Object.defineProperty(a.prototype, "offset", {
                enumerable: !0,
                get: function () {
                  if (a.isBuffer(this)) return this.byteOffset;
                },
              }),
              (a.poolSize = 8192),
              (a.from = function (t, e, r) {
                return f(t, e, r);
              }),
              Object.setPrototypeOf(a.prototype, Uint8Array.prototype),
              Object.setPrototypeOf(a, Uint8Array),
              (a.alloc = function (t, e, r) {
                return (function (t, e, r) {
                  return (
                    h(t),
                    t <= 0
                      ? s(t)
                      : void 0 !== e
                      ? "string" == typeof r
                        ? s(t).fill(e, r)
                        : s(t).fill(e)
                      : s(t)
                  );
                })(t, e, r);
              }),
              (a.allocUnsafe = function (t) {
                return u(t);
              }),
              (a.allocUnsafeSlow = function (t) {
                return u(t);
              }),
              (a.isBuffer = function (t) {
                return null != t && !0 === t._isBuffer && t !== a.prototype;
              }),
              (a.compare = function (t, e) {
                if (
                  (G(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)),
                  G(e, Uint8Array) && (e = a.from(e, e.offset, e.byteLength)),
                  !a.isBuffer(t) || !a.isBuffer(e))
                )
                  throw new TypeError(
                    'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
                  );
                if (t === e) return 0;
                let r = t.length,
                  i = e.length;
                for (let n = 0, o = Math.min(r, i); n < o; ++n)
                  if (t[n] !== e[n]) {
                    (r = t[n]), (i = e[n]);
                    break;
                  }
                return r < i ? -1 : i < r ? 1 : 0;
              }),
              (a.isEncoding = function (t) {
                switch (String(t).toLowerCase()) {
                  case "hex":
                  case "utf8":
                  case "utf-8":
                  case "ascii":
                  case "latin1":
                  case "binary":
                  case "base64":
                  case "ucs2":
                  case "ucs-2":
                  case "utf16le":
                  case "utf-16le":
                    return !0;
                  default:
                    return !1;
                }
              }),
              (a.concat = function (t, e) {
                if (!Array.isArray(t))
                  throw new TypeError(
                    '"list" argument must be an Array of Buffers'
                  );
                if (0 === t.length) return a.alloc(0);
                let r;
                if (void 0 === e)
                  for (e = 0, r = 0; r < t.length; ++r) e += t[r].length;
                const i = a.allocUnsafe(e);
                let n = 0;
                for (r = 0; r < t.length; ++r) {
                  let e = t[r];
                  if (G(e, Uint8Array))
                    n + e.length > i.length
                      ? (a.isBuffer(e) || (e = a.from(e)), e.copy(i, n))
                      : Uint8Array.prototype.set.call(i, e, n);
                  else {
                    if (!a.isBuffer(e))
                      throw new TypeError(
                        '"list" argument must be an Array of Buffers'
                      );
                    e.copy(i, n);
                  }
                  n += e.length;
                }
                return i;
              }),
              (a.byteLength = p),
              (a.prototype._isBuffer = !0),
              (a.prototype.swap16 = function () {
                const t = this.length;
                if (t % 2 != 0)
                  throw new RangeError(
                    "Buffer size must be a multiple of 16-bits"
                  );
                for (let e = 0; e < t; e += 2) m(this, e, e + 1);
                return this;
              }),
              (a.prototype.swap32 = function () {
                const t = this.length;
                if (t % 4 != 0)
                  throw new RangeError(
                    "Buffer size must be a multiple of 32-bits"
                  );
                for (let e = 0; e < t; e += 4)
                  m(this, e, e + 3), m(this, e + 1, e + 2);
                return this;
              }),
              (a.prototype.swap64 = function () {
                const t = this.length;
                if (t % 8 != 0)
                  throw new RangeError(
                    "Buffer size must be a multiple of 64-bits"
                  );
                for (let e = 0; e < t; e += 8)
                  m(this, e, e + 7),
                    m(this, e + 1, e + 6),
                    m(this, e + 2, e + 5),
                    m(this, e + 3, e + 4);
                return this;
              }),
              (a.prototype.toString = function () {
                const t = this.length;
                return 0 === t
                  ? ""
                  : 0 === arguments.length
                  ? A(this, 0, t)
                  : b.apply(this, arguments);
              }),
              (a.prototype.toLocaleString = a.prototype.toString),
              (a.prototype.equals = function (t) {
                if (!a.isBuffer(t))
                  throw new TypeError("Argument must be a Buffer");
                return this === t || 0 === a.compare(this, t);
              }),
              (a.prototype.inspect = function () {
                let t = "";
                const e = r.INSPECT_MAX_BYTES;
                return (
                  (t = this.toString("hex", 0, e)
                    .replace(/(.{2})/g, "$1 ")
                    .trim()),
                  this.length > e && (t += " ... "),
                  "<Buffer " + t + ">"
                );
              }),
              n && (a.prototype[n] = a.prototype.inspect),
              (a.prototype.compare = function (t, e, r, i, n) {
                if (
                  (G(t, Uint8Array) && (t = a.from(t, t.offset, t.byteLength)),
                  !a.isBuffer(t))
                )
                  throw new TypeError(
                    'The "target" argument must be one of type Buffer or Uint8Array. Received type ' +
                      typeof t
                  );
                if (
                  (void 0 === e && (e = 0),
                  void 0 === r && (r = t ? t.length : 0),
                  void 0 === i && (i = 0),
                  void 0 === n && (n = this.length),
                  e < 0 || r > t.length || i < 0 || n > this.length)
                )
                  throw new RangeError("out of range index");
                if (i >= n && e >= r) return 0;
                if (i >= n) return -1;
                if (e >= r) return 1;
                if (this === t) return 0;
                let o = (n >>>= 0) - (i >>>= 0),
                  s = (r >>>= 0) - (e >>>= 0);
                const f = Math.min(o, s),
                  h = this.slice(i, n),
                  u = t.slice(e, r);
                for (let t = 0; t < f; ++t)
                  if (h[t] !== u[t]) {
                    (o = h[t]), (s = u[t]);
                    break;
                  }
                return o < s ? -1 : s < o ? 1 : 0;
              }),
              (a.prototype.includes = function (t, e, r) {
                return -1 !== this.indexOf(t, e, r);
              }),
              (a.prototype.indexOf = function (t, e, r) {
                return y(this, t, e, r, !0);
              }),
              (a.prototype.lastIndexOf = function (t, e, r) {
                return y(this, t, e, r, !1);
              }),
              (a.prototype.write = function (t, e, r, i) {
                if (void 0 === e) (i = "utf8"), (r = this.length), (e = 0);
                else if (void 0 === r && "string" == typeof e)
                  (i = e), (r = this.length), (e = 0);
                else {
                  if (!isFinite(e))
                    throw new Error(
                      "Buffer.write(string, encoding, offset[, length]) is no longer supported"
                    );
                  (e >>>= 0),
                    isFinite(r)
                      ? ((r >>>= 0), void 0 === i && (i = "utf8"))
                      : ((i = r), (r = void 0));
                }
                const n = this.length - e;
                if (
                  ((void 0 === r || r > n) && (r = n),
                  (t.length > 0 && (r < 0 || e < 0)) || e > this.length)
                )
                  throw new RangeError(
                    "Attempt to write outside buffer bounds"
                  );
                i || (i = "utf8");
                let o = !1;
                for (;;)
                  switch (i) {
                    case "hex":
                      return v(this, t, e, r);
                    case "utf8":
                    case "utf-8":
                      return w(this, t, e, r);
                    case "ascii":
                    case "latin1":
                    case "binary":
                      return _(this, t, e, r);
                    case "base64":
                      return M(this, t, e, r);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                      return S(this, t, e, r);
                    default:
                      if (o) throw new TypeError("Unknown encoding: " + i);
                      (i = ("" + i).toLowerCase()), (o = !0);
                  }
              }),
              (a.prototype.toJSON = function () {
                return {
                  type: "Buffer",
                  data: Array.prototype.slice.call(this._arr || this, 0),
                };
              });
            const k = 4096;
            function B(t, e, r) {
              let i = "";
              r = Math.min(t.length, r);
              for (let n = e; n < r; ++n) i += String.fromCharCode(127 & t[n]);
              return i;
            }
            function x(t, e, r) {
              let i = "";
              r = Math.min(t.length, r);
              for (let n = e; n < r; ++n) i += String.fromCharCode(t[n]);
              return i;
            }
            function I(t, e, r) {
              const i = t.length;
              (!e || e < 0) && (e = 0), (!r || r < 0 || r > i) && (r = i);
              let n = "";
              for (let i = e; i < r; ++i) n += Y[t[i]];
              return n;
            }
            function R(t, e, r) {
              const i = t.slice(e, r);
              let n = "";
              for (let t = 0; t < i.length - 1; t += 2)
                n += String.fromCharCode(i[t] + 256 * i[t + 1]);
              return n;
            }
            function j(t, e, r) {
              if (t % 1 != 0 || t < 0)
                throw new RangeError("offset is not uint");
              if (t + e > r)
                throw new RangeError("Trying to access beyond buffer length");
            }
            function T(t, e, r, i, n, o) {
              if (!a.isBuffer(t))
                throw new TypeError(
                  '"buffer" argument must be a Buffer instance'
                );
              if (e > n || e < o)
                throw new RangeError('"value" argument is out of bounds');
              if (r + i > t.length) throw new RangeError("Index out of range");
            }
            function L(t, e, r, i, n) {
              z(e, i, n, t, r, 7);
              let o = Number(e & BigInt(4294967295));
              (t[r++] = o),
                (o >>= 8),
                (t[r++] = o),
                (o >>= 8),
                (t[r++] = o),
                (o >>= 8),
                (t[r++] = o);
              let s = Number((e >> BigInt(32)) & BigInt(4294967295));
              return (
                (t[r++] = s),
                (s >>= 8),
                (t[r++] = s),
                (s >>= 8),
                (t[r++] = s),
                (s >>= 8),
                (t[r++] = s),
                r
              );
            }
            function C(t, e, r, i, n) {
              z(e, i, n, t, r, 7);
              let o = Number(e & BigInt(4294967295));
              (t[r + 7] = o),
                (o >>= 8),
                (t[r + 6] = o),
                (o >>= 8),
                (t[r + 5] = o),
                (o >>= 8),
                (t[r + 4] = o);
              let s = Number((e >> BigInt(32)) & BigInt(4294967295));
              return (
                (t[r + 3] = s),
                (s >>= 8),
                (t[r + 2] = s),
                (s >>= 8),
                (t[r + 1] = s),
                (s >>= 8),
                (t[r] = s),
                r + 8
              );
            }
            function P(t, e, r, i, n, o) {
              if (r + i > t.length) throw new RangeError("Index out of range");
              if (r < 0) throw new RangeError("Index out of range");
            }
            function O(t, e, r, n, o) {
              return (
                (e = +e),
                (r >>>= 0),
                o || P(t, 0, r, 4),
                i.write(t, e, r, n, 23, 4),
                r + 4
              );
            }
            function U(t, e, r, n, o) {
              return (
                (e = +e),
                (r >>>= 0),
                o || P(t, 0, r, 8),
                i.write(t, e, r, n, 52, 8),
                r + 8
              );
            }
            (a.prototype.slice = function (t, e) {
              const r = this.length;
              (t = ~~t) < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r),
                (e = void 0 === e ? r : ~~e) < 0
                  ? (e += r) < 0 && (e = 0)
                  : e > r && (e = r),
                e < t && (e = t);
              const i = this.subarray(t, e);
              return Object.setPrototypeOf(i, a.prototype), i;
            }),
              (a.prototype.readUintLE = a.prototype.readUIntLE =
                function (t, e, r) {
                  (t >>>= 0), (e >>>= 0), r || j(t, e, this.length);
                  let i = this[t],
                    n = 1,
                    o = 0;
                  for (; ++o < e && (n *= 256); ) i += this[t + o] * n;
                  return i;
                }),
              (a.prototype.readUintBE = a.prototype.readUIntBE =
                function (t, e, r) {
                  (t >>>= 0), (e >>>= 0), r || j(t, e, this.length);
                  let i = this[t + --e],
                    n = 1;
                  for (; e > 0 && (n *= 256); ) i += this[t + --e] * n;
                  return i;
                }),
              (a.prototype.readUint8 = a.prototype.readUInt8 =
                function (t, e) {
                  return (t >>>= 0), e || j(t, 1, this.length), this[t];
                }),
              (a.prototype.readUint16LE = a.prototype.readUInt16LE =
                function (t, e) {
                  return (
                    (t >>>= 0),
                    e || j(t, 2, this.length),
                    this[t] | (this[t + 1] << 8)
                  );
                }),
              (a.prototype.readUint16BE = a.prototype.readUInt16BE =
                function (t, e) {
                  return (
                    (t >>>= 0),
                    e || j(t, 2, this.length),
                    (this[t] << 8) | this[t + 1]
                  );
                }),
              (a.prototype.readUint32LE = a.prototype.readUInt32LE =
                function (t, e) {
                  return (
                    (t >>>= 0),
                    e || j(t, 4, this.length),
                    (this[t] | (this[t + 1] << 8) | (this[t + 2] << 16)) +
                      16777216 * this[t + 3]
                  );
                }),
              (a.prototype.readUint32BE = a.prototype.readUInt32BE =
                function (t, e) {
                  return (
                    (t >>>= 0),
                    e || j(t, 4, this.length),
                    16777216 * this[t] +
                      ((this[t + 1] << 16) | (this[t + 2] << 8) | this[t + 3])
                  );
                }),
              (a.prototype.readBigUInt64LE = $(function (t) {
                F((t >>>= 0), "offset");
                const e = this[t],
                  r = this[t + 7];
                (void 0 !== e && void 0 !== r) || K(t, this.length - 8);
                const i =
                    e +
                    256 * this[++t] +
                    65536 * this[++t] +
                    this[++t] * 2 ** 24,
                  n =
                    this[++t] +
                    256 * this[++t] +
                    65536 * this[++t] +
                    r * 2 ** 24;
                return BigInt(i) + (BigInt(n) << BigInt(32));
              })),
              (a.prototype.readBigUInt64BE = $(function (t) {
                F((t >>>= 0), "offset");
                const e = this[t],
                  r = this[t + 7];
                (void 0 !== e && void 0 !== r) || K(t, this.length - 8);
                const i =
                    e * 2 ** 24 +
                    65536 * this[++t] +
                    256 * this[++t] +
                    this[++t],
                  n =
                    this[++t] * 2 ** 24 +
                    65536 * this[++t] +
                    256 * this[++t] +
                    r;
                return (BigInt(i) << BigInt(32)) + BigInt(n);
              })),
              (a.prototype.readIntLE = function (t, e, r) {
                (t >>>= 0), (e >>>= 0), r || j(t, e, this.length);
                let i = this[t],
                  n = 1,
                  o = 0;
                for (; ++o < e && (n *= 256); ) i += this[t + o] * n;
                return (n *= 128), i >= n && (i -= Math.pow(2, 8 * e)), i;
              }),
              (a.prototype.readIntBE = function (t, e, r) {
                (t >>>= 0), (e >>>= 0), r || j(t, e, this.length);
                let i = e,
                  n = 1,
                  o = this[t + --i];
                for (; i > 0 && (n *= 256); ) o += this[t + --i] * n;
                return (n *= 128), o >= n && (o -= Math.pow(2, 8 * e)), o;
              }),
              (a.prototype.readInt8 = function (t, e) {
                return (
                  (t >>>= 0),
                  e || j(t, 1, this.length),
                  128 & this[t] ? -1 * (255 - this[t] + 1) : this[t]
                );
              }),
              (a.prototype.readInt16LE = function (t, e) {
                (t >>>= 0), e || j(t, 2, this.length);
                const r = this[t] | (this[t + 1] << 8);
                return 32768 & r ? 4294901760 | r : r;
              }),
              (a.prototype.readInt16BE = function (t, e) {
                (t >>>= 0), e || j(t, 2, this.length);
                const r = this[t + 1] | (this[t] << 8);
                return 32768 & r ? 4294901760 | r : r;
              }),
              (a.prototype.readInt32LE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || j(t, 4, this.length),
                  this[t] |
                    (this[t + 1] << 8) |
                    (this[t + 2] << 16) |
                    (this[t + 3] << 24)
                );
              }),
              (a.prototype.readInt32BE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || j(t, 4, this.length),
                  (this[t] << 24) |
                    (this[t + 1] << 16) |
                    (this[t + 2] << 8) |
                    this[t + 3]
                );
              }),
              (a.prototype.readBigInt64LE = $(function (t) {
                F((t >>>= 0), "offset");
                const e = this[t],
                  r = this[t + 7];
                (void 0 !== e && void 0 !== r) || K(t, this.length - 8);
                const i =
                  this[t + 4] +
                  256 * this[t + 5] +
                  65536 * this[t + 6] +
                  (r << 24);
                return (
                  (BigInt(i) << BigInt(32)) +
                  BigInt(
                    e +
                      256 * this[++t] +
                      65536 * this[++t] +
                      this[++t] * 2 ** 24
                  )
                );
              })),
              (a.prototype.readBigInt64BE = $(function (t) {
                F((t >>>= 0), "offset");
                const e = this[t],
                  r = this[t + 7];
                (void 0 !== e && void 0 !== r) || K(t, this.length - 8);
                const i =
                  (e << 24) + 65536 * this[++t] + 256 * this[++t] + this[++t];
                return (
                  (BigInt(i) << BigInt(32)) +
                  BigInt(
                    this[++t] * 2 ** 24 +
                      65536 * this[++t] +
                      256 * this[++t] +
                      r
                  )
                );
              })),
              (a.prototype.readFloatLE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || j(t, 4, this.length),
                  i.read(this, t, !0, 23, 4)
                );
              }),
              (a.prototype.readFloatBE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || j(t, 4, this.length),
                  i.read(this, t, !1, 23, 4)
                );
              }),
              (a.prototype.readDoubleLE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || j(t, 8, this.length),
                  i.read(this, t, !0, 52, 8)
                );
              }),
              (a.prototype.readDoubleBE = function (t, e) {
                return (
                  (t >>>= 0),
                  e || j(t, 8, this.length),
                  i.read(this, t, !1, 52, 8)
                );
              }),
              (a.prototype.writeUintLE = a.prototype.writeUIntLE =
                function (t, e, r, i) {
                  if (((t = +t), (e >>>= 0), (r >>>= 0), !i)) {
                    T(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                  }
                  let n = 1,
                    o = 0;
                  for (this[e] = 255 & t; ++o < r && (n *= 256); )
                    this[e + o] = (t / n) & 255;
                  return e + r;
                }),
              (a.prototype.writeUintBE = a.prototype.writeUIntBE =
                function (t, e, r, i) {
                  if (((t = +t), (e >>>= 0), (r >>>= 0), !i)) {
                    T(this, t, e, r, Math.pow(2, 8 * r) - 1, 0);
                  }
                  let n = r - 1,
                    o = 1;
                  for (this[e + n] = 255 & t; --n >= 0 && (o *= 256); )
                    this[e + n] = (t / o) & 255;
                  return e + r;
                }),
              (a.prototype.writeUint8 = a.prototype.writeUInt8 =
                function (t, e, r) {
                  return (
                    (t = +t),
                    (e >>>= 0),
                    r || T(this, t, e, 1, 255, 0),
                    (this[e] = 255 & t),
                    e + 1
                  );
                }),
              (a.prototype.writeUint16LE = a.prototype.writeUInt16LE =
                function (t, e, r) {
                  return (
                    (t = +t),
                    (e >>>= 0),
                    r || T(this, t, e, 2, 65535, 0),
                    (this[e] = 255 & t),
                    (this[e + 1] = t >>> 8),
                    e + 2
                  );
                }),
              (a.prototype.writeUint16BE = a.prototype.writeUInt16BE =
                function (t, e, r) {
                  return (
                    (t = +t),
                    (e >>>= 0),
                    r || T(this, t, e, 2, 65535, 0),
                    (this[e] = t >>> 8),
                    (this[e + 1] = 255 & t),
                    e + 2
                  );
                }),
              (a.prototype.writeUint32LE = a.prototype.writeUInt32LE =
                function (t, e, r) {
                  return (
                    (t = +t),
                    (e >>>= 0),
                    r || T(this, t, e, 4, 4294967295, 0),
                    (this[e + 3] = t >>> 24),
                    (this[e + 2] = t >>> 16),
                    (this[e + 1] = t >>> 8),
                    (this[e] = 255 & t),
                    e + 4
                  );
                }),
              (a.prototype.writeUint32BE = a.prototype.writeUInt32BE =
                function (t, e, r) {
                  return (
                    (t = +t),
                    (e >>>= 0),
                    r || T(this, t, e, 4, 4294967295, 0),
                    (this[e] = t >>> 24),
                    (this[e + 1] = t >>> 16),
                    (this[e + 2] = t >>> 8),
                    (this[e + 3] = 255 & t),
                    e + 4
                  );
                }),
              (a.prototype.writeBigUInt64LE = $(function (t, e = 0) {
                return L(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
              })),
              (a.prototype.writeBigUInt64BE = $(function (t, e = 0) {
                return C(this, t, e, BigInt(0), BigInt("0xffffffffffffffff"));
              })),
              (a.prototype.writeIntLE = function (t, e, r, i) {
                if (((t = +t), (e >>>= 0), !i)) {
                  const i = Math.pow(2, 8 * r - 1);
                  T(this, t, e, r, i - 1, -i);
                }
                let n = 0,
                  o = 1,
                  s = 0;
                for (this[e] = 255 & t; ++n < r && (o *= 256); )
                  t < 0 && 0 === s && 0 !== this[e + n - 1] && (s = 1),
                    (this[e + n] = (((t / o) >> 0) - s) & 255);
                return e + r;
              }),
              (a.prototype.writeIntBE = function (t, e, r, i) {
                if (((t = +t), (e >>>= 0), !i)) {
                  const i = Math.pow(2, 8 * r - 1);
                  T(this, t, e, r, i - 1, -i);
                }
                let n = r - 1,
                  o = 1,
                  s = 0;
                for (this[e + n] = 255 & t; --n >= 0 && (o *= 256); )
                  t < 0 && 0 === s && 0 !== this[e + n + 1] && (s = 1),
                    (this[e + n] = (((t / o) >> 0) - s) & 255);
                return e + r;
              }),
              (a.prototype.writeInt8 = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || T(this, t, e, 1, 127, -128),
                  t < 0 && (t = 255 + t + 1),
                  (this[e] = 255 & t),
                  e + 1
                );
              }),
              (a.prototype.writeInt16LE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || T(this, t, e, 2, 32767, -32768),
                  (this[e] = 255 & t),
                  (this[e + 1] = t >>> 8),
                  e + 2
                );
              }),
              (a.prototype.writeInt16BE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || T(this, t, e, 2, 32767, -32768),
                  (this[e] = t >>> 8),
                  (this[e + 1] = 255 & t),
                  e + 2
                );
              }),
              (a.prototype.writeInt32LE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || T(this, t, e, 4, 2147483647, -2147483648),
                  (this[e] = 255 & t),
                  (this[e + 1] = t >>> 8),
                  (this[e + 2] = t >>> 16),
                  (this[e + 3] = t >>> 24),
                  e + 4
                );
              }),
              (a.prototype.writeInt32BE = function (t, e, r) {
                return (
                  (t = +t),
                  (e >>>= 0),
                  r || T(this, t, e, 4, 2147483647, -2147483648),
                  t < 0 && (t = 4294967295 + t + 1),
                  (this[e] = t >>> 24),
                  (this[e + 1] = t >>> 16),
                  (this[e + 2] = t >>> 8),
                  (this[e + 3] = 255 & t),
                  e + 4
                );
              }),
              (a.prototype.writeBigInt64LE = $(function (t, e = 0) {
                return L(
                  this,
                  t,
                  e,
                  -BigInt("0x8000000000000000"),
                  BigInt("0x7fffffffffffffff")
                );
              })),
              (a.prototype.writeBigInt64BE = $(function (t, e = 0) {
                return C(
                  this,
                  t,
                  e,
                  -BigInt("0x8000000000000000"),
                  BigInt("0x7fffffffffffffff")
                );
              })),
              (a.prototype.writeFloatLE = function (t, e, r) {
                return O(this, t, e, !0, r);
              }),
              (a.prototype.writeFloatBE = function (t, e, r) {
                return O(this, t, e, !1, r);
              }),
              (a.prototype.writeDoubleLE = function (t, e, r) {
                return U(this, t, e, !0, r);
              }),
              (a.prototype.writeDoubleBE = function (t, e, r) {
                return U(this, t, e, !1, r);
              }),
              (a.prototype.copy = function (t, e, r, i) {
                if (!a.isBuffer(t))
                  throw new TypeError("argument should be a Buffer");
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
                if (e < 0) throw new RangeError("targetStart out of bounds");
                if (r < 0 || r >= this.length)
                  throw new RangeError("Index out of range");
                if (i < 0) throw new RangeError("sourceEnd out of bounds");
                i > this.length && (i = this.length),
                  t.length - e < i - r && (i = t.length - e + r);
                const n = i - r;
                return (
                  this === t &&
                  "function" == typeof Uint8Array.prototype.copyWithin
                    ? this.copyWithin(e, r, i)
                    : Uint8Array.prototype.set.call(t, this.subarray(r, i), e),
                  n
                );
              }),
              (a.prototype.fill = function (t, e, r, i) {
                if ("string" == typeof t) {
                  if (
                    ("string" == typeof e
                      ? ((i = e), (e = 0), (r = this.length))
                      : "string" == typeof r && ((i = r), (r = this.length)),
                    void 0 !== i && "string" != typeof i)
                  )
                    throw new TypeError("encoding must be a string");
                  if ("string" == typeof i && !a.isEncoding(i))
                    throw new TypeError("Unknown encoding: " + i);
                  if (1 === t.length) {
                    const e = t.charCodeAt(0);
                    (("utf8" === i && e < 128) || "latin1" === i) && (t = e);
                  }
                } else
                  "number" == typeof t
                    ? (t &= 255)
                    : "boolean" == typeof t && (t = Number(t));
                if (e < 0 || this.length < e || this.length < r)
                  throw new RangeError("Out of range index");
                if (r <= e) return this;
                let n;
                if (
                  ((e >>>= 0),
                  (r = void 0 === r ? this.length : r >>> 0),
                  t || (t = 0),
                  "number" == typeof t)
                )
                  for (n = e; n < r; ++n) this[n] = t;
                else {
                  const o = a.isBuffer(t) ? t : a.from(t, i),
                    s = o.length;
                  if (0 === s)
                    throw new TypeError(
                      'The value "' + t + '" is invalid for argument "value"'
                    );
                  for (n = 0; n < r - e; ++n) this[n + e] = o[n % s];
                }
                return this;
              });
            const D = {};
            function N(t, e, r) {
              D[t] = class extends r {
                constructor() {
                  super(),
                    Object.defineProperty(this, "message", {
                      value: e.apply(this, arguments),
                      writable: !0,
                      configurable: !0,
                    }),
                    (this.name = `${this.name} [${t}]`),
                    this.stack,
                    delete this.name;
                }
                get code() {
                  return t;
                }
                set code(t) {
                  Object.defineProperty(this, "code", {
                    configurable: !0,
                    enumerable: !0,
                    value: t,
                    writable: !0,
                  });
                }
                toString() {
                  return `${this.name} [${t}]: ${this.message}`;
                }
              };
            }
            function q(t) {
              let e = "",
                r = t.length;
              const i = "-" === t[0] ? 1 : 0;
              for (; r >= i + 4; r -= 3) e = `_${t.slice(r - 3, r)}${e}`;
              return `${t.slice(0, r)}${e}`;
            }
            function z(t, e, r, i, n, o) {
              if (t > r || t < e) {
                const i = "bigint" == typeof e ? "n" : "";
                let n;
                throw (
                  ((n =
                    o > 3
                      ? 0 === e || e === BigInt(0)
                        ? `>= 0${i} and < 2${i} ** ${8 * (o + 1)}${i}`
                        : `>= -(2${i} ** ${8 * (o + 1) - 1}${i}) and < 2 ** ${
                            8 * (o + 1) - 1
                          }${i}`
                      : `>= ${e}${i} and <= ${r}${i}`),
                  new D.ERR_OUT_OF_RANGE("value", n, t))
                );
              }
              !(function (t, e, r) {
                F(e, "offset"),
                  (void 0 !== t[e] && void 0 !== t[e + r]) ||
                    K(e, t.length - (r + 1));
              })(i, n, o);
            }
            function F(t, e) {
              if ("number" != typeof t)
                throw new D.ERR_INVALID_ARG_TYPE(e, "number", t);
            }
            function K(t, e, r) {
              if (Math.floor(t) !== t)
                throw (
                  (F(t, r),
                  new D.ERR_OUT_OF_RANGE(r || "offset", "an integer", t))
                );
              if (e < 0) throw new D.ERR_BUFFER_OUT_OF_BOUNDS();
              throw new D.ERR_OUT_OF_RANGE(
                r || "offset",
                `>= ${r ? 1 : 0} and <= ${e}`,
                t
              );
            }
            N(
              "ERR_BUFFER_OUT_OF_BOUNDS",
              function (t) {
                return t
                  ? `${t} is outside of buffer bounds`
                  : "Attempt to access memory outside buffer bounds";
              },
              RangeError
            ),
              N(
                "ERR_INVALID_ARG_TYPE",
                function (t, e) {
                  return `The "${t}" argument must be of type number. Received type ${typeof e}`;
                },
                TypeError
              ),
              N(
                "ERR_OUT_OF_RANGE",
                function (t, e, r) {
                  let i = `The value of "${t}" is out of range.`,
                    n = r;
                  return (
                    Number.isInteger(r) && Math.abs(r) > 2 ** 32
                      ? (n = q(String(r)))
                      : "bigint" == typeof r &&
                        ((n = String(r)),
                        (r > BigInt(2) ** BigInt(32) ||
                          r < -(BigInt(2) ** BigInt(32))) &&
                          (n = q(n)),
                        (n += "n")),
                    (i += ` It must be ${e}. Received ${n}`),
                    i
                  );
                },
                RangeError
              );
            const H = /[^+/0-9A-Za-z-_]/g;
            function W(t, e) {
              let r;
              e = e || 1 / 0;
              const i = t.length;
              let n = null;
              const o = [];
              for (let s = 0; s < i; ++s) {
                if (((r = t.charCodeAt(s)), r > 55295 && r < 57344)) {
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
                  o.push(
                    (r >> 12) | 224,
                    ((r >> 6) & 63) | 128,
                    (63 & r) | 128
                  );
                } else {
                  if (!(r < 1114112)) throw new Error("Invalid code point");
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
            function V(t) {
              return e.toByteArray(
                (function (t) {
                  if (
                    (t = (t = t.split("=")[0]).trim().replace(H, "")).length < 2
                  )
                    return "";
                  for (; t.length % 4 != 0; ) t += "=";
                  return t;
                })(t)
              );
            }
            function Z(t, e, r, i) {
              let n;
              for (n = 0; n < i && !(n + r >= e.length || n >= t.length); ++n)
                e[n + r] = t[n];
              return n;
            }
            function G(t, e) {
              return (
                t instanceof e ||
                (null != t &&
                  null != t.constructor &&
                  null != t.constructor.name &&
                  t.constructor.name === e.name)
              );
            }
            function X(t) {
              return t != t;
            }
            const Y = (function () {
              const t = "0123456789abcdef",
                e = new Array(256);
              for (let r = 0; r < 16; ++r) {
                const i = 16 * r;
                for (let n = 0; n < 16; ++n) e[i + n] = t[r] + t[n];
              }
              return e;
            })();
            function $(t) {
              return "undefined" == typeof BigInt ? J : t;
            }
            function J() {
              throw new Error("BigInt not supported");
            }
          }).call(this);
        }).call(this, t("buffer").Buffer);
      },
      { "base64-js": 188, buffer: 63, ieee754: 190 },
    ],
    190: [
      function (t, e, r) {
        arguments[4][131][0].apply(r, arguments);
      },
      { dup: 131 },
    ],
  },
  {},
  [187]
);

var MAX_EARN_SCORE = 3;

handlers.GetEarnModeScore = function (args, context) {
  return { earnModeScore: MAX_EARN_SCORE };
};

function addPoints(points) {
  var addResult = server.AddUserVirtualCurrency({
    PlayFabId: currentPlayerId,
    VirtualCurrency: "OB",
    Amount: points,
  });

  return addResult;
}

handlers.avoidobstacles = function (args, context) {
  var addResult = addPoints(1);
  var request = {
    PlayFabId: currentPlayerId,
    Statistics: [
      {
        StatisticName: "PlayerHighScore",
        Value: 1,
      },
    ],
  };

  var result = server.UpdatePlayerStatistics(request);

  return {
    type: "avoidobstacles",
    success: true,
    data: addResult.Balance,
  };
};

handlers.updateAndRetrieveScore = function (args, context) {
  var payload = args.payload;

  var encryptionKey =
    "n4hKhuwYmvaiVQFs9VEwzq/n/JJ2Re1MZlDqziqt3BE=.hX26teFMi8zB88oaAOg8lZ/Izy8Om8XvwVfuYLOBSEU=";
  var receivedNonce = decrypt(payload, encryptionKey);

  if (!receivedNonce) {
    log.error("Nonce not provided.");
    throw "Nonce is required.";
  }

  // Fetch the player's current nonce and the "cheated" flag from their data
  var playerData = server.GetUserReadOnlyData({
    PlayFabId: currentPlayerId,
    Keys: ["nonce", "cheated"],
  });

  var existingNonce = playerData.Data.nonce
    ? playerData.Data.nonce.Value
    : null;
  // Initialize the flag to false
  var cheatedFlag = false;

  // Check if the 'cheated' key exists in the data and if its value is 'true'
  if (
    playerData.Data.hasOwnProperty("cheated") &&
    playerData.Data.cheated.Value === "true"
  ) {
    cheatedFlag = true;
  }

  if (cheatedFlag === true) {
    return { error: true, message: "Please contact support" };
  }

  // If the existing nonce matches the received nonce, consider it a replay attack
  if (existingNonce === receivedNonce) {
    cheatedFlag = true; // Update the "cheated" flag
  } else {
    // Otherwise, update the nonce with the received nonce
    existingNonce = receivedNonce;
  }

  // Save the updated nonce and "cheated" flag back to the player's data
  server.UpdateUserReadOnlyData({
    PlayFabId: currentPlayerId,
    Data: {
      nonce: existingNonce,
      cheated: cheatedFlag,
    },
  });

  if (cheatedFlag === true) {
    return { error: true, message: "Please contact support" };
  }

  var increaseAmount = 1; // Increase score by 1 for each obstacle avoided

  // Retrieve the player's current score from the internal data
  var internalDataResult = server.GetUserInternalData({
    PlayFabId: currentPlayerId,
    Keys: ["Score", "HighScore"],
  });

  var currentScore = 0;
  if (internalDataResult.Data && internalDataResult.Data.Score) {
    currentScore = parseInt(internalDataResult.Data.Score.Value);
  }

  // Increase the score by one
  currentScore += increaseAmount;

  var currentHighScore = currentScore;
  if (internalDataResult.Data && internalDataResult.Data.HighScore) {
    var storedHighScore = parseInt(internalDataResult.Data.HighScore.Value);
    if (currentScore > storedHighScore) {
      currentHighScore = currentScore;
    } else {
      currentHighScore = storedHighScore;
    }
  }

  // Update the player's score statistic
  var updateStatResult = server.UpdatePlayerStatistics({
    PlayFabId: currentPlayerId,
    Statistics: [
      {
        StatisticName: "Score",
        Value: currentScore,
      },
      {
        StatisticName: "HighScore",
        Value: currentHighScore,
      },
    ],
  });

  // Update the player's internal data with the new score and high score
  server.UpdateUserInternalData({
    PlayFabId: currentPlayerId,
    Data: {
      Score: currentScore.toString(),
      HighScore: currentHighScore.toString(),
    },
  });

  // Return the updated score and high score to Unity
  return { score: currentScore, highScore: currentHighScore };
};

handlers.resetScore = function (args, context) {
  var updateStatResult = server.UpdatePlayerStatistics({
    PlayFabId: currentPlayerId,
    Statistics: [
      {
        StatisticName: "Score",
        Value: 0,
      },
    ],
  });

  server.UpdateUserInternalData({
    PlayFabId: currentPlayerId,
    Data: {
      Score: "0",
    },
  });

  var response = {
    score: 0,
  };

  return JSON.stringify(response);
};

handlers.SaveGamertag = function (args, context) {
  var gamertag = args.gamertag; // Retrieve the gamertag from the function parameter

  // Save the gamertag in player internal data (title data)
  var updateInternalDataResult = server.UpdateUserInternalData({
    PlayFabId: currentPlayerId,
    Data: {
      Gamertag: gamertag,
    },
  });

  // Retrieve the player's score from the player internal data (title data)
  var internalData = server.GetUserInternalData({
    PlayFabId: currentPlayerId,
    Keys: ["Score"],
  });

  var score = 0;
  if (internalData.Data && internalData.Data.Score) {
    score = parseInt(internalData.Data.Score.Value);
  } else {
    // Score data not available
    var response = {
      success: false,
      reason: "Score data not found.",
    };

    // Return the response object
    return response;
  }

  // Save the score as the withdraw amount in player internal data (title data)
  var updateInternalDataResult = server.UpdateUserInternalData({
    PlayFabId: currentPlayerId,
    Data: {
      WithdrawAmount: score.toString(),
    },
  });

  // Send payment to the API and get the response
  var paymentResponse = sendPaymentToAPI(
    score,
    "Sending to ZBD Gamertag",
    gamertag
  );

  if (!paymentResponse.success) {
    // Payment failed, return the response object
    return paymentResponse;
  }

  // Response object for successful gamertag save
  var response = {
    success: true,
    reason: "Gamertag saved successfully.",
  };

  // Return the response object
  return response;
};

function sendPaymentToAPI(amount, description, gamertag) {
  try {
    // Fetch the player's current nonce and the "cheated" flag from their data
    var playerData = server.GetUserInternalData({
      PlayFabId: currentPlayerId,
      Keys: ["verified", "whitelisted"],
    });

    var whitelisted = false;

    if (
      playerData.Data.hasOwnProperty("whitelisted") &&
      playerData.Data.whitelisted.Value === "true"
    ) {
      whitelisted = true;
    }

    if (!whitelisted) {
      if (
        !playerData.Data.hasOwnProperty("verified") ||
        playerData.Data.verified.Value !== "true"
      ) {
        return { success: false, reason: "Please contact support." };
      }
    }

    var apiKey = "w3IOKzoD62rnwqWt1xXnmKIXtknqJENb";
    var url = "https://api.zebedee.io/v0/gamertag/send-payment";
    var httpMethod = "post";
    var contentType = "application/json";
    var headers = {
      "Content-Type": contentType,
      apikey: apiKey,
    };

    var amountInAPIUnits = amount * 1000;
    var requestBody = {
      amount: amountInAPIUnits.toString(),
      description: description,
      gamertag: gamertag,
    };
    var requestBodyString = JSON.stringify(requestBody);

    // Make the POST request
    var response = http.request(
      url,
      httpMethod,
      requestBodyString,
      contentType,
      headers
    );

    var responseObject = JSON.parse(response);

    if (responseObject.success === true) {
      // Return the response object indicating success
      return { success: true, reason: responseObject.reason };
    } else {
      // Return the response object indicating failure
      return { success: false, reason: "Failed to send payment." };
    }
  } catch (error) {
    // Return the response object indicating error
    return {
      success: false,
      reason: "An error occurred while sending the payment.",
    };
  }
}
