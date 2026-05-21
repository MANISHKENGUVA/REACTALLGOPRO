import te, { useState as P, useEffect as L, useRef as z, useMemo as ee } from "react";
var H = { exports: {} }, q = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ae;
function le() {
  if (ae) return q;
  ae = 1;
  var s = Symbol.for("react.transitional.element"), t = Symbol.for("react.fragment");
  function l(c, i, n) {
    var o = null;
    if (n !== void 0 && (o = "" + n), i.key !== void 0 && (o = "" + i.key), "key" in i) {
      n = {};
      for (var d in i)
        d !== "key" && (n[d] = i[d]);
    } else n = i;
    return i = n.ref, {
      $$typeof: s,
      type: c,
      key: o,
      ref: i !== void 0 ? i : null,
      props: n
    };
  }
  return q.Fragment = t, q.jsx = l, q.jsxs = l, q;
}
var J = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var se;
function ie() {
  return se || (se = 1, process.env.NODE_ENV !== "production" && function() {
    function s(a) {
      if (a == null) return null;
      if (typeof a == "function")
        return a.$$typeof === $ ? null : a.displayName || a.name || null;
      if (typeof a == "string") return a;
      switch (a) {
        case p:
          return "Fragment";
        case b:
          return "Profiler";
        case g:
          return "StrictMode";
        case T:
          return "Suspense";
        case R:
          return "SuspenseList";
        case U:
          return "Activity";
      }
      if (typeof a == "object")
        switch (typeof a.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), a.$$typeof) {
          case j:
            return "Portal";
          case v:
            return (a.displayName || "Context") + ".Provider";
          case C:
            return (a._context.displayName || "Context") + ".Consumer";
          case k:
            var h = a.render;
            return a = a.displayName, a || (a = h.displayName || h.name || "", a = a !== "" ? "ForwardRef(" + a + ")" : "ForwardRef"), a;
          case I:
            return h = a.displayName || null, h !== null ? h : s(a.type) || "Memo";
          case O:
            h = a._payload, a = a._init;
            try {
              return s(a(h));
            } catch {
            }
        }
      return null;
    }
    function t(a) {
      return "" + a;
    }
    function l(a) {
      try {
        t(a);
        var h = !1;
      } catch {
        h = !0;
      }
      if (h) {
        h = console;
        var y = h.error, w = typeof Symbol == "function" && Symbol.toStringTag && a[Symbol.toStringTag] || a.constructor.name || "Object";
        return y.call(
          h,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          w
        ), t(a);
      }
    }
    function c(a) {
      if (a === p) return "<>";
      if (typeof a == "object" && a !== null && a.$$typeof === O)
        return "<...>";
      try {
        var h = s(a);
        return h ? "<" + h + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var a = E.A;
      return a === null ? null : a.getOwner();
    }
    function n() {
      return Error("react-stack-top-frame");
    }
    function o(a) {
      if (B.call(a, "key")) {
        var h = Object.getOwnPropertyDescriptor(a, "key").get;
        if (h && h.isReactWarning) return !1;
      }
      return a.key !== void 0;
    }
    function d(a, h) {
      function y() {
        F || (F = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          h
        ));
      }
      y.isReactWarning = !0, Object.defineProperty(a, "key", {
        get: y,
        configurable: !0
      });
    }
    function f() {
      var a = s(this.type);
      return D[a] || (D[a] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), a = this.props.ref, a !== void 0 ? a : null;
    }
    function m(a, h, y, w, G, Y, Z, K) {
      return y = Y.ref, a = {
        $$typeof: x,
        type: a,
        key: h,
        props: Y,
        _owner: G
      }, (y !== void 0 ? y : null) !== null ? Object.defineProperty(a, "ref", {
        enumerable: !1,
        get: f
      }) : Object.defineProperty(a, "ref", { enumerable: !1, value: null }), a._store = {}, Object.defineProperty(a._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(a, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(a, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: Z
      }), Object.defineProperty(a, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: K
      }), Object.freeze && (Object.freeze(a.props), Object.freeze(a)), a;
    }
    function r(a, h, y, w, G, Y, Z, K) {
      var S = h.children;
      if (S !== void 0)
        if (w)
          if (V(S)) {
            for (w = 0; w < S.length; w++)
              u(S[w]);
            Object.freeze && Object.freeze(S);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else u(S);
      if (B.call(h, "key")) {
        S = s(a);
        var W = Object.keys(h).filter(function(re) {
          return re !== "key";
        });
        w = 0 < W.length ? "{key: someKey, " + W.join(": ..., ") + ": ...}" : "{key: someKey}", A[S + w] || (W = 0 < W.length ? "{" + W.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          w,
          S,
          W,
          S
        ), A[S + w] = !0);
      }
      if (S = null, y !== void 0 && (l(y), S = "" + y), o(h) && (l(h.key), S = "" + h.key), "key" in h) {
        y = {};
        for (var Q in h)
          Q !== "key" && (y[Q] = h[Q]);
      } else y = h;
      return S && d(
        y,
        typeof a == "function" ? a.displayName || a.name || "Unknown" : a
      ), m(
        a,
        S,
        Y,
        G,
        i(),
        y,
        Z,
        K
      );
    }
    function u(a) {
      typeof a == "object" && a !== null && a.$$typeof === x && a._store && (a._store.validated = 1);
    }
    var _ = te, x = Symbol.for("react.transitional.element"), j = Symbol.for("react.portal"), p = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), b = Symbol.for("react.profiler"), C = Symbol.for("react.consumer"), v = Symbol.for("react.context"), k = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), R = Symbol.for("react.suspense_list"), I = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), U = Symbol.for("react.activity"), $ = Symbol.for("react.client.reference"), E = _.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, B = Object.prototype.hasOwnProperty, V = Array.isArray, M = console.createTask ? console.createTask : function() {
      return null;
    };
    _ = {
      react_stack_bottom_frame: function(a) {
        return a();
      }
    };
    var F, D = {}, X = _.react_stack_bottom_frame.bind(
      _,
      n
    )(), N = M(c(n)), A = {};
    J.Fragment = p, J.jsx = function(a, h, y, w, G) {
      var Y = 1e4 > E.recentlyCreatedOwnerStacks++;
      return r(
        a,
        h,
        y,
        !1,
        w,
        G,
        Y ? Error("react-stack-top-frame") : X,
        Y ? M(c(a)) : N
      );
    }, J.jsxs = function(a, h, y, w, G) {
      var Y = 1e4 > E.recentlyCreatedOwnerStacks++;
      return r(
        a,
        h,
        y,
        !0,
        w,
        G,
        Y ? Error("react-stack-top-frame") : X,
        Y ? M(c(a)) : N
      );
    };
  }()), J;
}
var ne;
function ce() {
  return ne || (ne = 1, process.env.NODE_ENV === "production" ? H.exports = le() : H.exports = ie()), H.exports;
}
var e = ce();
const oe = ["primary", "secondary", "outline", "ghost", "danger", "link"];
function be({
  children: s,
  variant: t = "primary",
  loading: l = !1,
  disabled: c = !1,
  leftIcon: i,
  rightIcon: n,
  rounded: o = !1,
  onClick: d,
  type: f = "button",
  className: m = "",
  ...r
}) {
  const u = c || l, x = [
    "au-button",
    `au-button--${oe.includes(t) ? t : "primary"}`,
    o && "au-button--rounded",
    l && "au-button--loading",
    m
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: f,
      onClick: d,
      className: x,
      disabled: u,
      "aria-busy": l ? "true" : void 0,
      ...r,
      children: l ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("span", { className: "au-button__spinner", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "au-button__label", children: "Loading" })
      ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        i && /* @__PURE__ */ e.jsx("span", { className: "au-button__icon au-button__icon--left", children: i }),
        /* @__PURE__ */ e.jsx("span", { className: "au-button__label", children: s }),
        n && /* @__PURE__ */ e.jsx("span", { className: "au-button__icon au-button__icon--right", children: n })
      ] })
    }
  );
}
const ue = ["text", "password", "email", "number"];
function ke({
  id: s,
  label: t,
  type: l = "text",
  value: c,
  defaultValue: i = "",
  onChange: n,
  placeholder: o = "",
  error: d,
  helperText: f,
  prefixIcon: m,
  suffixIcon: r,
  clearable: u = !1,
  disabled: _ = !1,
  className: x = "",
  name: j,
  ...p
}) {
  const g = ue.includes(l) ? l : "text", [b, C] = P(c ?? i), v = c !== void 0, k = v ? c : b, T = u && !_ && k?.toString().length > 0, R = !!d, I = [
    "au-input",
    R && "au-input--error",
    _ && "au-input--disabled",
    x
  ].filter(Boolean).join(" ");
  L(() => {
    v && C(c);
  }, [c, v]);
  function O($) {
    const E = $.target.value;
    v || C(E), n && n($);
  }
  function U() {
    _ || (v || C(""), n && n({
      target: { value: "", name: j },
      currentTarget: { value: "", name: j },
      nativeEvent: null,
      preventDefault: () => {
      },
      stopPropagation: () => {
      }
    }));
  }
  return /* @__PURE__ */ e.jsxs("div", { className: I, children: [
    t ? /* @__PURE__ */ e.jsx("label", { className: "au-input__label", htmlFor: s, children: t }) : null,
    /* @__PURE__ */ e.jsxs("div", { className: "au-input__field", children: [
      m ? /* @__PURE__ */ e.jsx("div", { className: "au-input__adornment au-input__adornment--prefix", children: m }) : null,
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: s,
          name: j,
          type: g,
          value: k,
          onChange: O,
          placeholder: o,
          disabled: _,
          className: "au-input__control",
          "aria-invalid": R ? "true" : "false",
          "aria-describedby": d ? `${s}-error` : f ? `${s}-helper` : void 0,
          ...p
        }
      ),
      T ? /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "au-input__clear",
          onClick: U,
          "aria-label": "Clear input",
          children: "×"
        }
      ) : null,
      r ? /* @__PURE__ */ e.jsx("div", { className: "au-input__adornment au-input__adornment--suffix", children: r }) : null
    ] }),
    f && !R ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-helper` : void 0, className: "au-input__helper", children: f }) : null,
    R ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-error` : void 0, className: "au-input__error", children: d }) : null
  ] });
}
function Ee({
  id: s,
  label: t,
  value: l,
  defaultValue: c = "",
  onChange: i,
  placeholder: n = "",
  error: o,
  helperText: d,
  maxLength: f,
  autoResize: m = !0,
  charCount: r = !1,
  disabled: u = !1,
  className: _ = "",
  name: x,
  ...j
}) {
  const p = l !== void 0, [g, b] = P(l ?? c), C = p ? l : g, v = z(null), k = [
    "au-textarea",
    o && "au-textarea--error",
    u && "au-textarea--disabled",
    _
  ].filter(Boolean).join(" ");
  L(() => {
    p && b(l);
  }, [l, p]), L(() => {
    m && v.current && (v.current.style.height = "auto", v.current.style.height = `${v.current.scrollHeight}px`);
  }, [C, m]);
  function T(I) {
    const O = I.target.value;
    p || b(O), i && i(I);
  }
  const R = C?.toString().length ?? 0;
  return /* @__PURE__ */ e.jsxs("div", { className: k, children: [
    t ? /* @__PURE__ */ e.jsx("label", { className: "au-textarea__label", htmlFor: s, children: t }) : null,
    /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: s,
        name: x,
        ref: v,
        className: "au-textarea__control",
        value: C,
        onChange: T,
        placeholder: n,
        maxLength: f,
        disabled: u,
        "aria-invalid": o ? "true" : "false",
        "aria-describedby": o ? `${s}-error` : d ? `${s}-helper` : void 0,
        ...j
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__meta", children: [
      d && !o ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-helper` : void 0, className: "au-textarea__helper", children: d }) : null,
      o ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-error` : void 0, className: "au-textarea__error", children: o }) : null,
      r && f ? /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__counter", children: [
        R,
        "/",
        f
      ] }) : null
    ] })
  ] });
}
function de(s) {
  return s.map((t) => t.options ? {
    label: t.label,
    options: t.options.map((l) => ({
      label: l.label,
      value: l.value,
      disabled: l.disabled || !1
    }))
  } : {
    label: t.label,
    value: t.value,
    disabled: t.disabled || !1
  });
}
function Ce({
  id: s,
  label: t,
  value: l,
  defaultValue: c,
  onChange: i,
  placeholder: n = "Select...",
  error: o,
  helperText: d,
  options: f = [],
  searchable: m = !1,
  multiple: r = !1,
  checkbox: u = !1,
  loading: _ = !1,
  asyncText: x = "Loading...",
  disabled: j = !1,
  className: p = "",
  name: g,
  layout: b = "vertical",
  ...C
}) {
  const v = l !== void 0, [k, T] = P(
    c ?? (r ? [] : "")
  ), [R, I] = P(!1), [O, U] = P(""), $ = z(null), E = v ? l : k, B = ee(() => de(f), [f]);
  L(() => {
    v && T(l);
  }, [l, v]), L(() => {
    function N(A) {
      $.current && !$.current.contains(A.target) && I(!1);
    }
    return document.addEventListener("mousedown", N), () => document.removeEventListener("mousedown", N);
  }, []);
  function V(N) {
    v || T(N), i && i({
      target: { value: N, name: g },
      currentTarget: { value: N, name: g }
    });
  }
  function M(N) {
    if (!j)
      if (r) {
        const A = Array.isArray(E) ? [...E] : [], a = A.indexOf(N);
        a >= 0 ? A.splice(a, 1) : A.push(N), V(A);
      } else
        V(N), I(!1);
  }
  const F = ee(() => {
    const N = O.trim().toLowerCase();
    return N ? B.map((A) => {
      if (A.options) {
        const a = A.options.filter(
          (h) => h.label.toLowerCase().includes(N)
        );
        return { ...A, options: a };
      }
      return A;
    }).filter((A) => A.options ? A.options.length > 0 : A.label.toLowerCase().includes(N)) : B;
  }, [B, O]), D = ee(() => {
    if (r) {
      if (!Array.isArray(E)) return "";
      const a = [];
      return B.forEach((h) => {
        (h.options ? h.options : [h]).forEach((w) => {
          E.includes(w.value) && a.push(w.label);
        });
      }), a.join(", ");
    }
    const A = B.flatMap((a) => a.options ? a.options : [a]).find((a) => a.value === E);
    return A ? A.label : "";
  }, [E, B, r]), X = [
    "au-select",
    o && "au-select--error",
    j && "au-select--disabled",
    p,
    b === "horizontal" && "au-select--horizontal"
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: X, ref: $, children: [
    t ? /* @__PURE__ */ e.jsx("label", { className: "au-select__label", htmlFor: s, children: t }) : null,
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        id: s,
        name: g,
        className: "au-select__control",
        onClick: () => I((N) => !N),
        disabled: j,
        "aria-expanded": R,
        "aria-haspopup": "listbox",
        ...C,
        children: [
          /* @__PURE__ */ e.jsx("span", { className: D ? "au-select__value" : "au-select__placeholder", children: D || n }),
          /* @__PURE__ */ e.jsx("span", { className: "au-select__arrow", children: "▾" })
        ]
      }
    ),
    R ? /* @__PURE__ */ e.jsxs("div", { className: "au-select__menu", children: [
      m ? /* @__PURE__ */ e.jsx("div", { className: "au-select__search", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "search",
          value: O,
          onChange: (N) => U(N.target.value),
          placeholder: "Search...",
          className: "au-select__search-input",
          autoComplete: "off"
        }
      ) }) : null,
      _ ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", children: x }) : F.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", children: "No options" }) : F.map(
        (N, A) => N.options ? /* @__PURE__ */ e.jsxs("div", { className: "au-select__group", children: [
          /* @__PURE__ */ e.jsx("div", { className: "au-select__group-label", children: N.label }),
          N.options.map((a) => {
            const h = r ? Array.isArray(E) && E.includes(a.value) : E === a.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                className: `au-select__item ${h ? "au-select__item--selected" : ""}`,
                onClick: () => M(a.value),
                disabled: a.disabled || j,
                children: [
                  u && r ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", children: h ? "✓" : "" }) : null,
                  /* @__PURE__ */ e.jsx("span", { children: a.label })
                ]
              },
              a.value
            );
          })
        ] }, `group-${A}`) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: `au-select__item ${E === N.value ? "au-select__item--selected" : ""}`,
            onClick: () => M(N.value),
            disabled: N.disabled || j,
            children: [
              u && r ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", children: Array.isArray(E) && E.includes(N.value) ? "✓" : "" }) : null,
              /* @__PURE__ */ e.jsx("span", { children: N.label })
            ]
          },
          N.value
        )
      )
    ] }) : null,
    d && !o ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-helper` : void 0, className: "au-select__helper", children: d }) : null,
    o ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-error` : void 0, className: "au-select__error", children: o }) : null
  ] });
}
function ye({
  id: s,
  label: t,
  checked: l = !1,
  activeLabel: c = "On",
  inactiveLabel: i = "Off",
  disabled: n = !1,
  onChange: o,
  name: d,
  className: f = "",
  ...m
}) {
  function r(u) {
    n || o && o(u);
  }
  return /* @__PURE__ */ e.jsxs(
    "label",
    {
      className: ["au-toggle", n && "au-toggle--disabled", f].filter(Boolean).join(" "),
      htmlFor: s,
      children: [
        /* @__PURE__ */ e.jsxs("span", { className: "au-toggle__labels", children: [
          t ? /* @__PURE__ */ e.jsx("span", { className: "au-toggle__label", children: t }) : null,
          /* @__PURE__ */ e.jsx("span", { className: "au-toggle__state", children: l ? c : i })
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "au-toggle__switch", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              id: s,
              name: d,
              type: "checkbox",
              checked: l,
              disabled: n,
              onChange: r,
              className: "au-toggle__input",
              ...m
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "au-toggle__slider" })
        ] })
      ]
    }
  );
}
function Ae({
  id: s,
  label: t,
  value: l,
  defaultValue: c = 0,
  onChange: i,
  min: n = 0,
  max: o = 100,
  step: d = 1,
  range: f = !1,
  tooltip: m = !1,
  helperText: r,
  error: u,
  disabled: _ = !1,
  className: x = "",
  name: j,
  ...p
}) {
  const g = l !== void 0, b = {
    min: Array.isArray(c) ? c[0] : n,
    max: Array.isArray(c) ? c[1] : o
  }, [C, v] = P(
    f ? b : c
  ), k = g ? l : C, T = [
    "au-range",
    u && "au-range--error",
    _ && "au-range--disabled",
    x
  ].filter(Boolean).join(" ");
  L(() => {
    g && v(l);
  }, [l, g]);
  function R($) {
    const E = Number($.target.value);
    g || v(E), i && i({ target: { value: E, name: j }, currentTarget: { value: E, name: j } });
  }
  function I($) {
    return (E) => {
      const B = Number(E.target.value), V = {
        min: $ === "min" ? B : k.min,
        max: $ === "max" ? B : k.max
      };
      g || v(V), i && i({ target: { value: V, name: j }, currentTarget: { value: V, name: j } });
    };
  }
  const O = f ? null : Number(k ?? c), U = f ? {
    min: Number(k?.min ?? b.min),
    max: Number(k?.max ?? b.max)
  } : null;
  return /* @__PURE__ */ e.jsxs("div", { className: T, children: [
    t ? /* @__PURE__ */ e.jsx("label", { className: "au-range__label", htmlFor: s, children: t }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-range__field", children: f ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "au-range__slider-row", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${s}-min`,
            name: j,
            type: "range",
            min: n,
            max: o,
            step: d,
            value: U.min,
            disabled: _,
            onChange: I("min"),
            className: "au-range__input",
            ...p
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${s}-max`,
            name: j,
            type: "range",
            min: n,
            max: o,
            step: d,
            value: U.max,
            disabled: _,
            onChange: I("max"),
            className: "au-range__input",
            ...p
          }
        )
      ] }),
      m ? /* @__PURE__ */ e.jsxs("div", { className: "au-range__tooltip", children: [
        U.min,
        " — ",
        U.max
      ] }) : null
    ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: s,
          name: j,
          type: "range",
          min: n,
          max: o,
          step: d,
          value: O,
          disabled: _,
          onChange: R,
          className: "au-range__input",
          ...p
        }
      ),
      m ? /* @__PURE__ */ e.jsx("div", { className: "au-range__tooltip", children: O }) : null
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-range__meta", children: [
      r && !u ? /* @__PURE__ */ e.jsx("div", { className: "au-range__helper", children: r }) : null,
      u ? /* @__PURE__ */ e.jsx("div", { className: "au-range__error", children: u }) : null
    ] })
  ] });
}
const pe = {
  date: "date",
  datetime: "datetime-local",
  time: "time"
};
function Re({
  id: s,
  label: t,
  mode: l = "date",
  value: c,
  startValue: i,
  endValue: n,
  defaultValue: o = "",
  defaultStartValue: d = "",
  defaultEndValue: f = "",
  onChange: m,
  placeholder: r = "",
  error: u,
  helperText: _,
  disabled: x = !1,
  className: j = "",
  name: p,
  ...g
}) {
  const b = l === "range", C = c !== void 0 || i !== void 0 || n !== void 0, [v, k] = P(o), [T, R] = P(d), [I, O] = P(f), U = b ? {
    start: i ?? T,
    end: n ?? I
  } : c ?? v;
  L(() => {
    C && !b && c !== void 0 && k(c), C && b && (i !== void 0 && R(i), n !== void 0 && O(n));
  }, [C, l, c, i, n]);
  function $(M) {
    const F = M.target.value;
    C || k(F), m && m({ target: { value: F, name: p }, currentTarget: { value: F, name: p } });
  }
  function E(M) {
    return (F) => {
      const D = { ...U, [M]: F.target.value };
      C || (M === "start" && R(D.start), M === "end" && O(D.end)), m && m({ target: { value: D, name: p }, currentTarget: { value: D, name: p } });
    };
  }
  const B = [
    "au-datepicker",
    u && "au-datepicker--error",
    x && "au-datepicker--disabled",
    j
  ].filter(Boolean).join(" "), V = pe[l] || "date";
  return /* @__PURE__ */ e.jsxs("div", { className: B, children: [
    t ? /* @__PURE__ */ e.jsx("label", { className: "au-datepicker__label", htmlFor: s, children: t }) : null,
    b ? /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__range", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: `${s}-start`,
          name: p,
          type: "date",
          value: U.start,
          onChange: E("start"),
          disabled: x,
          className: "au-datepicker__control",
          ...g
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "au-datepicker__range-separator", children: "to" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: `${s}-end`,
          name: p,
          type: "date",
          value: U.end,
          onChange: E("end"),
          disabled: x,
          className: "au-datepicker__control",
          ...g
        }
      )
    ] }) : /* @__PURE__ */ e.jsx(
      "input",
      {
        id: s,
        name: p,
        type: V,
        value: U,
        onChange: $,
        placeholder: r,
        disabled: x,
        className: "au-datepicker__control",
        "aria-invalid": u ? "true" : "false",
        "aria-describedby": u ? `${s}-error` : _ ? `${s}-helper` : void 0,
        ...g
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__meta", children: [
      _ && !u ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-helper` : void 0, className: "au-datepicker__helper", children: _ }) : null,
      u ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-error` : void 0, className: "au-datepicker__error", children: u }) : null
    ] })
  ] });
}
function _e({
  id: s,
  label: t,
  checked: l = !1,
  indeterminate: c = !1,
  disabled: i = !1,
  onChange: n,
  value: o,
  name: d,
  className: f = "",
  ...m
}) {
  const r = z(null);
  L(() => {
    r.current && (r.current.indeterminate = c);
  }, [c]);
  function u(_) {
    i || n && n(_);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-checkbox", i && "au-checkbox--disabled", f].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: r,
        id: s,
        name: d,
        type: "checkbox",
        checked: l,
        disabled: i,
        onChange: u,
        value: o,
        ...m
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__box", children: l ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__check", children: "✓" }) : c ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__indeterminate", children: "—" }) : null }),
    t ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__label", children: t }) : null
  ] });
}
function Te({
  options: s = [],
  value: t = [],
  onChange: l,
  disabled: c = !1,
  label: i,
  layout: n = "vertical",
  className: o = "",
  name: d,
  ...f
}) {
  function m(r, u) {
    const _ = Array.isArray(t) ? [...t] : [], x = _.indexOf(u);
    x >= 0 ? _.splice(x, 1) : _.push(u), l && l({
      target: { value: _, name: d },
      currentTarget: { value: _, name: d }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-checkbox-group", `au-checkbox-group--${n}`, o].filter(Boolean).join(" "), ...f, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__list", children: s.map((r) => /* @__PURE__ */ e.jsx(
      _e,
      {
        id: `${d}-${r.value}`,
        name: d,
        label: r.label,
        checked: Array.isArray(t) && t.includes(r.value),
        disabled: c || r.disabled,
        onChange: (u) => m(u, r.value),
        value: r.value
      },
      r.value
    )) })
  ] });
}
function fe({
  id: s,
  label: t,
  checked: l = !1,
  disabled: c = !1,
  onChange: i,
  value: n,
  name: o,
  className: d = "",
  ...f
}) {
  function m(r) {
    c || i && i(r);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-radio", c && "au-radio--disabled", d].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        id: s,
        name: o,
        type: "radio",
        checked: l,
        disabled: c,
        onChange: m,
        value: n,
        ...f
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-radio__circle", children: l ? /* @__PURE__ */ e.jsx("span", { className: "au-radio__dot" }) : null }),
    t ? /* @__PURE__ */ e.jsx("span", { className: "au-radio__label", children: t }) : null
  ] });
}
function we({
  options: s = [],
  value: t,
  onChange: l,
  disabled: c = !1,
  label: i,
  layout: n = "vertical",
  className: o = "",
  name: d,
  ...f
}) {
  function m(r, u) {
    l && l({
      target: { value: u, name: d },
      currentTarget: { value: u, name: d }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-radio-group", `au-radio-group--${n}`, o].filter(Boolean).join(" "), ...f, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__list", children: s.map((r) => /* @__PURE__ */ e.jsx(
      fe,
      {
        id: `${d}-${r.value}`,
        name: d,
        label: r.label,
        checked: t === r.value,
        disabled: c || r.disabled,
        onChange: (u) => m(u, r.value),
        value: r.value
      },
      r.value
    )) })
  ] });
}
function Oe({ children: s, className: t = "", style: l = {}, ...c }) {
  const i = ["au-card", t].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: i, style: l, ...c, children: s });
}
function $e({
  isOpen: s,
  onClose: t,
  title: l,
  children: c,
  footer: i,
  confirmText: n = "Confirm",
  cancelText: o = "Cancel",
  onConfirm: d,
  showCloseButton: f = !0,
  size: m = "medium",
  className: r = "",
  ...u
}) {
  if (L(() => {
    const j = (p) => {
      p.key === "Escape" && s && t();
    };
    return s && (document.addEventListener("keydown", j), document.body.style.overflow = "hidden"), () => {
      document.removeEventListener("keydown", j), document.body.style.overflow = "unset";
    };
  }, [s, t]), !s) return null;
  const _ = (j) => {
    j.target === j.currentTarget && t();
  }, x = [
    "au-modal",
    `au-modal--${m}`,
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: "au-modal-overlay", onClick: _, ...u, children: /* @__PURE__ */ e.jsxs("div", { className: x, role: "dialog", "aria-modal": "true", children: [
    (l || f) && /* @__PURE__ */ e.jsxs("div", { className: "au-modal__header", children: [
      l && /* @__PURE__ */ e.jsx("h2", { className: "au-modal__title", children: l }),
      f && /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "au-modal__close",
          onClick: t,
          "aria-label": "Close modal",
          children: "×"
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "au-modal__body", children: c }),
    i || d ? /* @__PURE__ */ e.jsx("div", { className: "au-modal__footer", children: i || /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "au-button au-button--secondary",
          onClick: t,
          children: o
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "au-button au-button--primary",
          onClick: d,
          children: n
        }
      )
    ] }) }) : null
  ] }) });
}
const me = ["success", "error", "warning", "info", "alert"];
function he({
  message: s,
  variant: t = "info",
  duration: l = 4e3,
  onClose: c,
  position: i = "top-right",
  showCloseButton: n = !0,
  className: o = "",
  ...d
}) {
  const [f, m] = P(!0);
  L(() => {
    if (l > 0) {
      const x = setTimeout(() => {
        m(!1), setTimeout(c, 300);
      }, l);
      return () => clearTimeout(x);
    }
  }, [l, c]);
  const r = () => {
    m(!1), setTimeout(c, 300);
  }, _ = [
    "au-toast",
    `au-toast--${me.includes(t) ? t : "info"}`,
    `au-toast--${i}`,
    !f && "au-toast--hidden",
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: _, role: "alert", ...d, children: [
    /* @__PURE__ */ e.jsx("div", { className: "au-toast__content", children: s }),
    n && /* @__PURE__ */ e.jsx(
      "button",
      {
        className: "au-toast__close",
        onClick: r,
        "aria-label": "Close notification",
        children: "×"
      }
    )
  ] });
}
function Se({ toasts: s, position: t = "top-right" }) {
  const l = [
    "au-toast-container",
    `au-toast-container--${t}`
  ].join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: l, children: s.map((c, i) => /* @__PURE__ */ e.jsx(
    he,
    {
      ...c
    },
    c.id || i
  )) });
}
const xe = ["success", "error", "warning", "info"], je = ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"];
function Ie({
  children: s,
  content: t,
  variant: l = "info",
  position: c = "top",
  delay: i = 300,
  showArrow: n = !0,
  className: o = "",
  style: d = {},
  ...f
}) {
  const [m, r] = P(!1), [u, _] = P({ x: 0, y: 0 }), x = z(null), j = z(null), p = z(null), g = xe.includes(l) ? l : "info", b = je.includes(c) ? c : "top", C = () => {
    p.current && clearTimeout(p.current), p.current = setTimeout(() => {
      if (x.current) {
        const R = x.current.getBoundingClientRect();
        _({
          x: R.left + R.width / 2,
          y: R.top + R.height / 2
        });
      }
      r(!0);
    }, i);
  }, v = () => {
    p.current && clearTimeout(p.current), r(!1);
  };
  L(() => () => {
    p.current && clearTimeout(p.current);
  }, []);
  const k = [
    "au-tooltip",
    `au-tooltip--${g}`,
    `au-tooltip--${b}`,
    n && "au-tooltip--with-arrow",
    o
  ].filter(Boolean).join(" "), T = [
    "au-tooltip-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: x,
        className: T,
        onMouseEnter: C,
        onMouseLeave: v,
        onFocus: C,
        onBlur: v,
        ...f,
        children: s
      }
    ),
    m && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: j,
        className: k,
        style: {
          ...d,
          "--au-tooltip-left": `${u.x}px`,
          "--au-tooltip-top": `${u.y}px`
        },
        role: "tooltip",
        children: [
          t,
          n && /* @__PURE__ */ e.jsx("div", { className: "au-tooltip__arrow" })
        ]
      }
    )
  ] });
}
function Ue({
  children: s,
  content: t,
  trigger: l = "click",
  position: c = "bottom",
  showArrow: i = !0,
  className: n = "",
  style: o = {},
  ...d
}) {
  const [f, m] = P(!1), [r, u] = P({ x: 0, y: 0 }), _ = z(null), x = z(null), j = {
    top: { x: 0, y: -10 },
    bottom: { x: 0, y: 10 },
    left: { x: -10, y: 0 },
    right: { x: 10, y: 0 }
  }, p = () => {
    if (_.current) {
      const k = _.current.getBoundingClientRect(), T = j[c] || j.bottom;
      u({
        x: k.left + k.width / 2 + T.x,
        y: k.top + k.height / 2 + T.y
      });
    }
    m(!f);
  }, g = () => {
    l === "hover" && p();
  }, b = () => {
    l === "hover" && m(!1);
  };
  L(() => {
    const k = (T) => {
      x.current && !x.current.contains(T.target) && _.current && !_.current.contains(T.target) && m(!1);
    };
    return f && document.addEventListener("mousedown", k), () => {
      document.removeEventListener("mousedown", k);
    };
  }, [f]);
  const C = [
    "au-popover",
    `au-popover--${c}`,
    i && "au-popover--with-arrow",
    n
  ].filter(Boolean).join(" "), v = [
    "au-popover-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: _,
        className: v,
        onClick: l === "click" ? p : void 0,
        onMouseEnter: g,
        onMouseLeave: b,
        ...d,
        children: s
      }
    ),
    f && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: x,
        className: C,
        style: {
          ...o,
          "--au-popover-left": `${r.x}px`,
          "--au-popover-top": `${r.y}px`
        },
        role: "dialog",
        children: [
          t,
          i && /* @__PURE__ */ e.jsx("div", { className: "au-popover__arrow" })
        ]
      }
    )
  ] });
}
const ve = ["linear", "circular", "dots", "spinner"];
function Pe({
  variant: s = "linear",
  value: t = 0,
  max: l = 100,
  size: c = "medium",
  color: i = "primary",
  showValue: n = !1,
  className: o = "",
  style: d = {},
  ...f
}) {
  const m = ve.includes(s) ? s : "linear", r = Math.min(Math.max(t / l * 100, 0), 100), u = {
    ...d,
    "--au-progress-width": `${r}%`
  }, _ = [
    "au-progress",
    `au-progress--${m}`,
    `au-progress--${c}`,
    `au-progress--${i}`,
    o
  ].filter(Boolean).join(" ");
  if (m === "linear")
    return /* @__PURE__ */ e.jsxs("div", { className: _, style: u, ...f, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-progress__track", children: /* @__PURE__ */ e.jsx("div", { className: "au-progress__bar" }) }),
      n && /* @__PURE__ */ e.jsxs("span", { className: "au-progress__value", children: [
        Math.round(r),
        "%"
      ] })
    ] });
  if (m === "circular") {
    const j = 2 * Math.PI * 20, p = j, g = j - r / 100 * j;
    return /* @__PURE__ */ e.jsxs("div", { className: _, ...f, children: [
      /* @__PURE__ */ e.jsxs("svg", { className: "au-progress__circle", viewBox: "0 0 50 50", children: [
        /* @__PURE__ */ e.jsx(
          "circle",
          {
            className: "au-progress__circle-track",
            cx: "25",
            cy: "25",
            r: 20,
            strokeWidth: "4",
            fill: "none"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "circle",
          {
            className: "au-progress__circle-bar",
            cx: "25",
            cy: "25",
            r: 20,
            strokeWidth: "4",
            fill: "none",
            strokeDasharray: p,
            strokeDashoffset: g,
            transform: "rotate(-90 25 25)"
          }
        )
      ] }),
      n && /* @__PURE__ */ e.jsxs("span", { className: "au-progress__value", children: [
        Math.round(r),
        "%"
      ] })
    ] });
  }
  return m === "dots" ? /* @__PURE__ */ e.jsx("div", { className: _, ...f, children: /* @__PURE__ */ e.jsxs("div", { className: "au-progress__dots", children: [
    /* @__PURE__ */ e.jsx("span", {}),
    /* @__PURE__ */ e.jsx("span", {}),
    /* @__PURE__ */ e.jsx("span", {})
  ] }) }) : m === "spinner" ? /* @__PURE__ */ e.jsx("div", { className: _, ...f, children: /* @__PURE__ */ e.jsx("div", { className: "au-progress__spinner" }) }) : null;
}
function Be({
  currentPage: s = 1,
  totalPages: t = 1,
  onPageChange: l,
  showPageSize: c = !1,
  pageSize: i = 10,
  pageSizeOptions: n = [10, 25, 50, 100],
  onPageSizeChange: o,
  showJumpToPage: d = !1,
  className: f = "",
  ...m
}) {
  const r = (p) => {
    p >= 1 && p <= t && p !== s && l(p);
  }, u = (p) => {
    const g = parseInt(p.target.value);
    o(g);
  }, _ = (p) => {
    p.preventDefault();
    const g = parseInt(p.target.elements.page.value);
    g >= 1 && g <= t && l(g);
  }, x = () => {
    const p = [];
    if (t <= 5)
      for (let b = 1; b <= t; b++)
        p.push(
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: `au-pagination__page ${b === s ? "au-pagination__page--active" : ""}`,
              onClick: () => r(b),
              children: b
            },
            b
          )
        );
    else {
      p.push(
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: `au-pagination__page ${s === 1 ? "au-pagination__page--active" : ""}`,
            onClick: () => r(1),
            children: "1"
          },
          1
        )
      ), s > 3 && p.push(/* @__PURE__ */ e.jsx("span", { className: "au-pagination__ellipsis", children: "..." }, "start-ellipsis"));
      const b = Math.max(2, s - 1), C = Math.min(t - 1, s + 1);
      for (let v = b; v <= C; v++)
        p.push(
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: `au-pagination__page ${v === s ? "au-pagination__page--active" : ""}`,
              onClick: () => r(v),
              children: v
            },
            v
          )
        );
      s < t - 2 && p.push(/* @__PURE__ */ e.jsx("span", { className: "au-pagination__ellipsis", children: "..." }, "end-ellipsis")), t > 1 && p.push(
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: `au-pagination__page ${t === s ? "au-pagination__page--active" : ""}`,
            onClick: () => r(t),
            children: t
          },
          t
        )
      );
    }
    return p;
  }, j = [
    "au-pagination",
    f
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: j, ...m, children: [
    c && /* @__PURE__ */ e.jsxs("div", { className: "au-pagination__page-size", children: [
      /* @__PURE__ */ e.jsx("label", { htmlFor: "page-size", children: "Items per page:" }),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "page-size",
          value: i,
          onChange: u,
          children: n.map((p) => /* @__PURE__ */ e.jsx("option", { value: p, children: p }, p))
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-pagination__controls", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "au-pagination__nav au-pagination__nav--prev",
          onClick: () => r(s - 1),
          disabled: s === 1,
          children: "Previous"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "au-pagination__pages", children: x() }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "au-pagination__nav au-pagination__nav--next",
          onClick: () => r(s + 1),
          disabled: s === t,
          children: "Next"
        }
      )
    ] }),
    d && /* @__PURE__ */ e.jsxs("form", { className: "au-pagination__jump", onSubmit: _, children: [
      /* @__PURE__ */ e.jsx("label", { htmlFor: "jump-page", children: "Go to page:" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: "jump-page",
          name: "page",
          type: "number",
          min: "1",
          max: t,
          defaultValue: s
        }
      ),
      /* @__PURE__ */ e.jsx("button", { type: "submit", children: "Go" })
    ] })
  ] });
}
function Me({
  items: s = [],
  className: t = "",
  ...l
}) {
  const c = [
    "au-menu",
    t
  ].filter(Boolean).join(" "), i = (n, o) => n.divider ? /* @__PURE__ */ e.jsx("div", { className: "au-menu__divider" }, o) : n.checkbox ? /* @__PURE__ */ e.jsxs("label", { className: "au-menu__item au-menu__item--checkbox", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: n.checked || !1,
        onChange: n.onChange
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: n.label })
  ] }, n.id || o) : n.radio ? /* @__PURE__ */ e.jsxs("label", { className: "au-menu__item au-menu__item--radio", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "radio",
        name: n.name,
        value: n.value,
        checked: n.checked || !1,
        onChange: n.onChange
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: n.label })
  ] }, n.id || o) : n.children ? /* @__PURE__ */ e.jsx(
    ge,
    {
      trigger: n.label,
      items: n.children,
      icon: n.icon
    },
    n.id || o
  ) : /* @__PURE__ */ e.jsxs(
    "button",
    {
      className: `au-menu__item ${n.active ? "au-menu__item--active" : ""}`,
      onClick: n.onClick,
      disabled: n.disabled,
      children: [
        n.icon && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-icon", children: n.icon }),
        /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: n.label }),
        n.badge && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-badge", children: n.badge })
      ]
    },
    n.id || o
  );
  return /* @__PURE__ */ e.jsx("div", { className: c, ...l, children: s.map(i) });
}
function ge({
  trigger: s,
  items: t = [],
  position: l = "bottom-left",
  icon: c,
  className: i = "",
  ...n
}) {
  const [o, d] = P(!1), f = () => {
    d(!o);
  }, m = (u) => {
    u.onClick && u.onClick(), d(!1);
  }, r = [
    "au-menu-dropdown",
    `au-menu-dropdown--${l}`,
    o && "au-menu-dropdown--open",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: r, ...n, children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: "au-menu-dropdown__trigger",
        onClick: f,
        "aria-expanded": o,
        "aria-haspopup": "true",
        children: [
          c && /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-icon", children: c }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-label", children: s }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-arrow", children: "▼" })
        ]
      }
    ),
    o && /* @__PURE__ */ e.jsx("div", { className: "au-menu-dropdown__menu", children: t.map((u, _) => u.divider ? /* @__PURE__ */ e.jsx("div", { className: "au-menu__divider" }, _) : /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: `au-menu__item ${u.active ? "au-menu__item--active" : ""}`,
        onClick: () => m(u),
        disabled: u.disabled,
        children: [
          u.icon && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-icon", children: u.icon }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: u.label }),
          u.badge && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-badge", children: u.badge })
        ]
      },
      u.id || _
    )) })
  ] });
}
function Le({
  steps: s = [],
  activeStep: t = 0,
  orientation: l = "horizontal",
  className: c = "",
  ...i
}) {
  const n = [
    "au-stepper",
    `au-stepper--${l}`,
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: n, ...i, children: s.map((o, d) => {
    const f = d < t, m = d === t, r = d > t, u = [
      "au-stepper__step",
      f && "au-stepper__step--completed",
      m && "au-stepper__step--active",
      r && "au-stepper__step--pending"
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: u, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-stepper__indicator", children: f ? /* @__PURE__ */ e.jsx("span", { className: "au-stepper__check", children: "✓" }) : /* @__PURE__ */ e.jsx("span", { className: "au-stepper__number", children: d + 1 }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "au-stepper__content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "au-stepper__title", children: o.title }),
        o.description && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__description", children: o.description })
      ] }),
      d < s.length - 1 && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__connector" })
    ] }, o.id || d);
  }) });
}
function Fe({
  children: s,
  variant: t = "default",
  size: l = "medium",
  closable: c = !1,
  selectable: i = !1,
  selected: n = !1,
  onClose: o,
  onClick: d,
  className: f = "",
  ...m
}) {
  const r = (x) => {
    x.stopPropagation(), o?.();
  }, u = () => {
    i && d?.();
  }, _ = [
    "au-chip",
    `au-chip--${t}`,
    `au-chip--${l}`,
    i && "au-chip--selectable",
    n && "au-chip--selected",
    f
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: _,
      onClick: u,
      role: i ? "button" : void 0,
      tabIndex: i ? 0 : void 0,
      ...m,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "au-chip__content", children: s }),
        c && /* @__PURE__ */ e.jsx(
          "button",
          {
            className: "au-chip__close",
            onClick: r,
            "aria-label": "Remove",
            children: "×"
          }
        )
      ]
    }
  );
}
function Ve({
  items: s = [],
  orientation: t = "vertical",
  className: l = "",
  ...c
}) {
  const i = [
    "au-timeline",
    `au-timeline--${t}`,
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: i, ...c, children: s.map((n, o) => {
    const d = [
      "au-timeline__item",
      n.status && `au-timeline__item--${n.status}`
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: d, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-timeline__indicator", children: n.icon ? /* @__PURE__ */ e.jsx("span", { className: "au-timeline__icon", children: n.icon }) : /* @__PURE__ */ e.jsx("span", { className: "au-timeline__dot" }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "au-timeline__content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "au-timeline__title", children: n.title }),
        n.description && /* @__PURE__ */ e.jsx("div", { className: "au-timeline__description", children: n.description }),
        n.timestamp && /* @__PURE__ */ e.jsx("div", { className: "au-timeline__timestamp", children: n.timestamp })
      ] })
    ] }, n.id || o);
  }) });
}
function De({
  items: s = [],
  selectable: t = !1,
  selectedItems: l = [],
  onSelectionChange: c,
  emptyState: i,
  className: n = "",
  ...o
}) {
  const d = (r) => {
    if (t && c) {
      const u = l.includes(r.id);
      let _;
      u ? _ = l.filter((x) => x !== r.id) : _ = [...l, r.id], c(_);
    }
    r.onClick && r.onClick(r);
  }, f = (r, u, _ = 0) => {
    const x = t && l.includes(r.id), j = [
      "au-list-group__item",
      x && "au-list-group__item--selected",
      r.disabled && "au-list-group__item--disabled",
      `au-list-group__item--level-${_}`
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: j, children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "au-list-group__item-content",
          onClick: () => d(r),
          role: t ? "button" : void 0,
          tabIndex: t ? 0 : void 0,
          children: [
            r.icon && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-icon", children: r.icon }),
            /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__item-text", children: [
              /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-title", children: r.title }),
              r.description && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-description", children: r.description })
            ] }),
            r.badge && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-badge", children: r.badge }),
            t && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-check", children: x ? "✓" : "" })
          ]
        }
      ),
      r.children && r.children.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__children", children: r.children.map((p, g) => f(p, g, _ + 1)) })
    ] }, r.id || u);
  }, m = [
    "au-list-group",
    t && "au-list-group--selectable",
    n
  ].filter(Boolean).join(" ");
  return s.length === 0 && i ? /* @__PURE__ */ e.jsx("div", { className: `${m} au-list-group--empty`, ...o, children: /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__empty", children: [
    i.icon && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__empty-icon", children: i.icon }),
    /* @__PURE__ */ e.jsx("div", { className: "au-list-group__empty-title", children: i.title }),
    i.description && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__empty-description", children: i.description }),
    i.action && /* @__PURE__ */ e.jsx(
      "button",
      {
        className: "au-button au-button--primary au-list-group__empty-action",
        onClick: i.action.onClick,
        children: i.action.label
      }
    )
  ] }) }) : /* @__PURE__ */ e.jsx("div", { className: m, ...o, children: s.map((r, u) => f(r, u)) });
}
export {
  be as AUBUTTON,
  Oe as AUCARD,
  _e as AUCHECKBOX,
  Te as AUCHECKBOXGROUP,
  Fe as AUCHIP,
  Re as AUDATEPICKER,
  ke as AUINPUT,
  De as AULISTGROUP,
  Me as AUMENU,
  ge as AUMENUDROPDOWN,
  $e as AUMODAL,
  Be as AUPAGINATION,
  Ue as AUPOPOVER,
  Pe as AUPROGRESS,
  fe as AURADIO,
  we as AURADIOGROUP,
  Ae as AURANGE,
  Ce as AUSELECT,
  Le as AUSTEPPER,
  Ee as AUTEXTAREA,
  Ve as AUTIMELINE,
  he as AUTOAST,
  Se as AUTOASTCONTAINER,
  ye as AUTOGGLE,
  Ie as AUTOOLTIP
};
//# sourceMappingURL=router-engine.es.js.map
