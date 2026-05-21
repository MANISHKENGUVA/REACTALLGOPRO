import te, { useState as P, useEffect as L, useRef as W, useMemo as ee } from "react";
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
    var d = null;
    if (n !== void 0 && (d = "" + n), i.key !== void 0 && (d = "" + i.key), "key" in i) {
      n = {};
      for (var u in i)
        u !== "key" && (n[u] = i[u]);
    } else n = i;
    return i = n.ref, {
      $$typeof: s,
      type: c,
      key: d,
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
        case m:
          return "Fragment";
        case b:
          return "Profiler";
        case g:
          return "StrictMode";
        case T:
          return "Suspense";
        case w:
          return "SuspenseList";
        case U:
          return "Activity";
      }
      if (typeof a == "object")
        switch (typeof a.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), a.$$typeof) {
          case x:
            return "Portal";
          case j:
            return (a.displayName || "Context") + ".Provider";
          case E:
            return (a._context.displayName || "Context") + ".Consumer";
          case C:
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
        var y = h.error, A = typeof Symbol == "function" && Symbol.toStringTag && a[Symbol.toStringTag] || a.constructor.name || "Object";
        return y.call(
          h,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          A
        ), t(a);
      }
    }
    function c(a) {
      if (a === m) return "<>";
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
      var a = k.A;
      return a === null ? null : a.getOwner();
    }
    function n() {
      return Error("react-stack-top-frame");
    }
    function d(a) {
      if (B.call(a, "key")) {
        var h = Object.getOwnPropertyDescriptor(a, "key").get;
        if (h && h.isReactWarning) return !1;
      }
      return a.key !== void 0;
    }
    function u(a, h) {
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
    function _() {
      var a = s(this.type);
      return D[a] || (D[a] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), a = this.props.ref, a !== void 0 ? a : null;
    }
    function f(a, h, y, A, G, Y, Z, K) {
      return y = Y.ref, a = {
        $$typeof: v,
        type: a,
        key: h,
        props: Y,
        _owner: G
      }, (y !== void 0 ? y : null) !== null ? Object.defineProperty(a, "ref", {
        enumerable: !1,
        get: _
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
    function r(a, h, y, A, G, Y, Z, K) {
      var S = h.children;
      if (S !== void 0)
        if (A)
          if (V(S)) {
            for (A = 0; A < S.length; A++)
              o(S[A]);
            Object.freeze && Object.freeze(S);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else o(S);
      if (B.call(h, "key")) {
        S = s(a);
        var z = Object.keys(h).filter(function(re) {
          return re !== "key";
        });
        A = 0 < z.length ? "{key: someKey, " + z.join(": ..., ") + ": ...}" : "{key: someKey}", R[S + A] || (z = 0 < z.length ? "{" + z.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          A,
          S,
          z,
          S
        ), R[S + A] = !0);
      }
      if (S = null, y !== void 0 && (l(y), S = "" + y), d(h) && (l(h.key), S = "" + h.key), "key" in h) {
        y = {};
        for (var Q in h)
          Q !== "key" && (y[Q] = h[Q]);
      } else y = h;
      return S && u(
        y,
        typeof a == "function" ? a.displayName || a.name || "Unknown" : a
      ), f(
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
    function o(a) {
      typeof a == "object" && a !== null && a.$$typeof === v && a._store && (a._store.validated = 1);
    }
    var p = te, v = Symbol.for("react.transitional.element"), x = Symbol.for("react.portal"), m = Symbol.for("react.fragment"), g = Symbol.for("react.strict_mode"), b = Symbol.for("react.profiler"), E = Symbol.for("react.consumer"), j = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), T = Symbol.for("react.suspense"), w = Symbol.for("react.suspense_list"), I = Symbol.for("react.memo"), O = Symbol.for("react.lazy"), U = Symbol.for("react.activity"), $ = Symbol.for("react.client.reference"), k = p.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, B = Object.prototype.hasOwnProperty, V = Array.isArray, M = console.createTask ? console.createTask : function() {
      return null;
    };
    p = {
      react_stack_bottom_frame: function(a) {
        return a();
      }
    };
    var F, D = {}, X = p.react_stack_bottom_frame.bind(
      p,
      n
    )(), N = M(c(n)), R = {};
    J.Fragment = m, J.jsx = function(a, h, y, A, G) {
      var Y = 1e4 > k.recentlyCreatedOwnerStacks++;
      return r(
        a,
        h,
        y,
        !1,
        A,
        G,
        Y ? Error("react-stack-top-frame") : X,
        Y ? M(c(a)) : N
      );
    }, J.jsxs = function(a, h, y, A, G) {
      var Y = 1e4 > k.recentlyCreatedOwnerStacks++;
      return r(
        a,
        h,
        y,
        !0,
        A,
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
  rounded: d = !1,
  onClick: u,
  type: _ = "button",
  className: f = "",
  ...r
}) {
  const o = c || l, v = [
    "au-button",
    `au-button--${oe.includes(t) ? t : "primary"}`,
    d && "au-button--rounded",
    l && "au-button--loading",
    f
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: _,
      onClick: u,
      className: v,
      disabled: o,
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
  placeholder: d = "",
  error: u,
  helperText: _,
  prefixIcon: f,
  suffixIcon: r,
  clearable: o = !1,
  disabled: p = !1,
  className: v = "",
  name: x,
  ...m
}) {
  const g = ue.includes(l) ? l : "text", [b, E] = P(c ?? i), j = c !== void 0, C = j ? c : b, T = o && !p && C?.toString().length > 0, w = !!u, I = [
    "au-input",
    w && "au-input--error",
    p && "au-input--disabled",
    v
  ].filter(Boolean).join(" ");
  L(() => {
    j && E(c);
  }, [c, j]);
  function O($) {
    const k = $.target.value;
    j || E(k), n && n($);
  }
  function U() {
    p || (j || E(""), n && n({
      target: { value: "", name: x },
      currentTarget: { value: "", name: x },
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
      f ? /* @__PURE__ */ e.jsx("div", { className: "au-input__adornment au-input__adornment--prefix", children: f }) : null,
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: s,
          name: x,
          type: g,
          value: C,
          onChange: O,
          placeholder: d,
          disabled: p,
          className: "au-input__control",
          "aria-invalid": w ? "true" : "false",
          "aria-describedby": u ? `${s}-error` : _ ? `${s}-helper` : void 0,
          ...m
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
    _ && !w ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-helper` : void 0, className: "au-input__helper", children: _ }) : null,
    w ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-error` : void 0, className: "au-input__error", children: u }) : null
  ] });
}
function Ee({
  id: s,
  label: t,
  value: l,
  defaultValue: c = "",
  onChange: i,
  placeholder: n = "",
  error: d,
  helperText: u,
  maxLength: _,
  autoResize: f = !0,
  charCount: r = !1,
  disabled: o = !1,
  className: p = "",
  name: v,
  ...x
}) {
  const m = l !== void 0, [g, b] = P(l ?? c), E = m ? l : g, j = W(null), C = [
    "au-textarea",
    d && "au-textarea--error",
    o && "au-textarea--disabled",
    p
  ].filter(Boolean).join(" ");
  L(() => {
    m && b(l);
  }, [l, m]), L(() => {
    f && j.current && (j.current.style.height = "auto", j.current.style.height = `${j.current.scrollHeight}px`);
  }, [E, f]);
  function T(I) {
    const O = I.target.value;
    m || b(O), i && i(I);
  }
  const w = E?.toString().length ?? 0;
  return /* @__PURE__ */ e.jsxs("div", { className: C, children: [
    t ? /* @__PURE__ */ e.jsx("label", { className: "au-textarea__label", htmlFor: s, children: t }) : null,
    /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: s,
        name: v,
        ref: j,
        className: "au-textarea__control",
        value: E,
        onChange: T,
        placeholder: n,
        maxLength: _,
        disabled: o,
        "aria-invalid": d ? "true" : "false",
        "aria-describedby": d ? `${s}-error` : u ? `${s}-helper` : void 0,
        ...x
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__meta", children: [
      u && !d ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-helper` : void 0, className: "au-textarea__helper", children: u }) : null,
      d ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-error` : void 0, className: "au-textarea__error", children: d }) : null,
      r && _ ? /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__counter", children: [
        w,
        "/",
        _
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
  error: d,
  helperText: u,
  options: _ = [],
  searchable: f = !1,
  multiple: r = !1,
  checkbox: o = !1,
  loading: p = !1,
  asyncText: v = "Loading...",
  disabled: x = !1,
  className: m = "",
  name: g,
  layout: b = "vertical",
  ...E
}) {
  const j = l !== void 0, [C, T] = P(
    c ?? (r ? [] : "")
  ), [w, I] = P(!1), [O, U] = P(""), $ = W(null), k = j ? l : C, B = ee(() => de(_), [_]);
  L(() => {
    j && T(l);
  }, [l, j]), L(() => {
    function N(R) {
      $.current && !$.current.contains(R.target) && I(!1);
    }
    return document.addEventListener("mousedown", N), () => document.removeEventListener("mousedown", N);
  }, []);
  function V(N) {
    j || T(N), i && i({
      target: { value: N, name: g },
      currentTarget: { value: N, name: g }
    });
  }
  function M(N) {
    if (!x)
      if (r) {
        const R = Array.isArray(k) ? [...k] : [], a = R.indexOf(N);
        a >= 0 ? R.splice(a, 1) : R.push(N), V(R);
      } else
        V(N), I(!1);
  }
  const F = ee(() => {
    const N = O.trim().toLowerCase();
    return N ? B.map((R) => {
      if (R.options) {
        const a = R.options.filter(
          (h) => h.label.toLowerCase().includes(N)
        );
        return { ...R, options: a };
      }
      return R;
    }).filter((R) => R.options ? R.options.length > 0 : R.label.toLowerCase().includes(N)) : B;
  }, [B, O]), D = ee(() => {
    if (r) {
      if (!Array.isArray(k)) return "";
      const a = [];
      return B.forEach((h) => {
        (h.options ? h.options : [h]).forEach((A) => {
          k.includes(A.value) && a.push(A.label);
        });
      }), a.join(", ");
    }
    const R = B.flatMap((a) => a.options ? a.options : [a]).find((a) => a.value === k);
    return R ? R.label : "";
  }, [k, B, r]), X = [
    "au-select",
    d && "au-select--error",
    x && "au-select--disabled",
    m,
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
        disabled: x,
        "aria-expanded": w,
        "aria-haspopup": "listbox",
        ...E,
        children: [
          /* @__PURE__ */ e.jsx("span", { className: D ? "au-select__value" : "au-select__placeholder", children: D || n }),
          /* @__PURE__ */ e.jsx("span", { className: "au-select__arrow", children: "▾" })
        ]
      }
    ),
    w ? /* @__PURE__ */ e.jsxs("div", { className: "au-select__menu", children: [
      f ? /* @__PURE__ */ e.jsx("div", { className: "au-select__search", children: /* @__PURE__ */ e.jsx(
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
      p ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", children: v }) : F.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", children: "No options" }) : F.map(
        (N, R) => N.options ? /* @__PURE__ */ e.jsxs("div", { className: "au-select__group", children: [
          /* @__PURE__ */ e.jsx("div", { className: "au-select__group-label", children: N.label }),
          N.options.map((a) => {
            const h = r ? Array.isArray(k) && k.includes(a.value) : k === a.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                className: `au-select__item ${h ? "au-select__item--selected" : ""}`,
                onClick: () => M(a.value),
                disabled: a.disabled || x,
                children: [
                  o && r ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", children: h ? "✓" : "" }) : null,
                  /* @__PURE__ */ e.jsx("span", { children: a.label })
                ]
              },
              a.value
            );
          })
        ] }, `group-${R}`) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: `au-select__item ${k === N.value ? "au-select__item--selected" : ""}`,
            onClick: () => M(N.value),
            disabled: N.disabled || x,
            children: [
              o && r ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", children: Array.isArray(k) && k.includes(N.value) ? "✓" : "" }) : null,
              /* @__PURE__ */ e.jsx("span", { children: N.label })
            ]
          },
          N.value
        )
      )
    ] }) : null,
    u && !d ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-helper` : void 0, className: "au-select__helper", children: u }) : null,
    d ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-error` : void 0, className: "au-select__error", children: d }) : null
  ] });
}
function ye({
  id: s,
  label: t,
  checked: l = !1,
  activeLabel: c = "On",
  inactiveLabel: i = "Off",
  disabled: n = !1,
  onChange: d,
  name: u,
  className: _ = "",
  ...f
}) {
  function r(o) {
    n || d && d(o);
  }
  return /* @__PURE__ */ e.jsxs(
    "label",
    {
      className: ["au-toggle", n && "au-toggle--disabled", _].filter(Boolean).join(" "),
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
              name: u,
              type: "checkbox",
              checked: l,
              disabled: n,
              onChange: r,
              className: "au-toggle__input",
              ...f
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "au-toggle__slider" })
        ] })
      ]
    }
  );
}
function Re({
  id: s,
  label: t,
  value: l,
  defaultValue: c = 0,
  onChange: i,
  min: n = 0,
  max: d = 100,
  step: u = 1,
  range: _ = !1,
  tooltip: f = !1,
  helperText: r,
  error: o,
  disabled: p = !1,
  className: v = "",
  name: x,
  ...m
}) {
  const g = l !== void 0, b = {
    min: Array.isArray(c) ? c[0] : n,
    max: Array.isArray(c) ? c[1] : d
  }, [E, j] = P(
    _ ? b : c
  ), C = g ? l : E, T = [
    "au-range",
    o && "au-range--error",
    p && "au-range--disabled",
    v
  ].filter(Boolean).join(" ");
  L(() => {
    g && j(l);
  }, [l, g]);
  function w($) {
    const k = Number($.target.value);
    g || j(k), i && i({ target: { value: k, name: x }, currentTarget: { value: k, name: x } });
  }
  function I($) {
    return (k) => {
      const B = Number(k.target.value), V = {
        min: $ === "min" ? B : C.min,
        max: $ === "max" ? B : C.max
      };
      g || j(V), i && i({ target: { value: V, name: x }, currentTarget: { value: V, name: x } });
    };
  }
  const O = _ ? null : Number(C ?? c), U = _ ? {
    min: Number(C?.min ?? b.min),
    max: Number(C?.max ?? b.max)
  } : null;
  return /* @__PURE__ */ e.jsxs("div", { className: T, children: [
    t ? /* @__PURE__ */ e.jsx("label", { className: "au-range__label", htmlFor: s, children: t }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-range__field", children: _ ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "au-range__slider-row", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${s}-min`,
            name: x,
            type: "range",
            min: n,
            max: d,
            step: u,
            value: U.min,
            disabled: p,
            onChange: I("min"),
            className: "au-range__input",
            ...m
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${s}-max`,
            name: x,
            type: "range",
            min: n,
            max: d,
            step: u,
            value: U.max,
            disabled: p,
            onChange: I("max"),
            className: "au-range__input",
            ...m
          }
        )
      ] }),
      f ? /* @__PURE__ */ e.jsxs("div", { className: "au-range__tooltip", children: [
        U.min,
        " — ",
        U.max
      ] }) : null
    ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: s,
          name: x,
          type: "range",
          min: n,
          max: d,
          step: u,
          value: O,
          disabled: p,
          onChange: w,
          className: "au-range__input",
          ...m
        }
      ),
      f ? /* @__PURE__ */ e.jsx("div", { className: "au-range__tooltip", children: O }) : null
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-range__meta", children: [
      r && !o ? /* @__PURE__ */ e.jsx("div", { className: "au-range__helper", children: r }) : null,
      o ? /* @__PURE__ */ e.jsx("div", { className: "au-range__error", children: o }) : null
    ] })
  ] });
}
const pe = {
  date: "date",
  datetime: "datetime-local",
  time: "time"
};
function Ae({
  id: s,
  label: t,
  mode: l = "date",
  value: c,
  startValue: i,
  endValue: n,
  defaultValue: d = "",
  defaultStartValue: u = "",
  defaultEndValue: _ = "",
  onChange: f,
  placeholder: r = "",
  error: o,
  helperText: p,
  disabled: v = !1,
  className: x = "",
  name: m,
  ...g
}) {
  const b = l === "range", E = c !== void 0 || i !== void 0 || n !== void 0, [j, C] = P(d), [T, w] = P(u), [I, O] = P(_), U = b ? {
    start: i ?? T,
    end: n ?? I
  } : c ?? j;
  L(() => {
    E && !b && c !== void 0 && C(c), E && b && (i !== void 0 && w(i), n !== void 0 && O(n));
  }, [E, l, c, i, n]);
  function $(M) {
    const F = M.target.value;
    E || C(F), f && f({ target: { value: F, name: m }, currentTarget: { value: F, name: m } });
  }
  function k(M) {
    return (F) => {
      const D = { ...U, [M]: F.target.value };
      E || (M === "start" && w(D.start), M === "end" && O(D.end)), f && f({ target: { value: D, name: m }, currentTarget: { value: D, name: m } });
    };
  }
  const B = [
    "au-datepicker",
    o && "au-datepicker--error",
    v && "au-datepicker--disabled",
    x
  ].filter(Boolean).join(" "), V = pe[l] || "date";
  return /* @__PURE__ */ e.jsxs("div", { className: B, children: [
    t ? /* @__PURE__ */ e.jsx("label", { className: "au-datepicker__label", htmlFor: s, children: t }) : null,
    b ? /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__range", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: `${s}-start`,
          name: m,
          type: "date",
          value: U.start,
          onChange: k("start"),
          disabled: v,
          className: "au-datepicker__control",
          ...g
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "au-datepicker__range-separator", children: "to" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: `${s}-end`,
          name: m,
          type: "date",
          value: U.end,
          onChange: k("end"),
          disabled: v,
          className: "au-datepicker__control",
          ...g
        }
      )
    ] }) : /* @__PURE__ */ e.jsx(
      "input",
      {
        id: s,
        name: m,
        type: V,
        value: U,
        onChange: $,
        placeholder: r,
        disabled: v,
        className: "au-datepicker__control",
        "aria-invalid": o ? "true" : "false",
        "aria-describedby": o ? `${s}-error` : p ? `${s}-helper` : void 0,
        ...g
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__meta", children: [
      p && !o ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-helper` : void 0, className: "au-datepicker__helper", children: p }) : null,
      o ? /* @__PURE__ */ e.jsx("div", { id: s ? `${s}-error` : void 0, className: "au-datepicker__error", children: o }) : null
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
  value: d,
  name: u,
  className: _ = "",
  ...f
}) {
  const r = W(null);
  L(() => {
    r.current && (r.current.indeterminate = c);
  }, [c]);
  function o(p) {
    i || n && n(p);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-checkbox", i && "au-checkbox--disabled", _].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: r,
        id: s,
        name: u,
        type: "checkbox",
        checked: l,
        disabled: i,
        onChange: o,
        value: d,
        ...f
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
  className: d = "",
  name: u,
  ..._
}) {
  function f(r, o) {
    const p = Array.isArray(t) ? [...t] : [], v = p.indexOf(o);
    v >= 0 ? p.splice(v, 1) : p.push(o), l && l({
      target: { value: p, name: u },
      currentTarget: { value: p, name: u }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-checkbox-group", `au-checkbox-group--${n}`, d].filter(Boolean).join(" "), ..._, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__list", children: s.map((r) => /* @__PURE__ */ e.jsx(
      _e,
      {
        id: `${u}-${r.value}`,
        name: u,
        label: r.label,
        checked: Array.isArray(t) && t.includes(r.value),
        disabled: c || r.disabled,
        onChange: (o) => f(o, r.value),
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
  name: d,
  className: u = "",
  ..._
}) {
  function f(r) {
    c || i && i(r);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-radio", c && "au-radio--disabled", u].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        id: s,
        name: d,
        type: "radio",
        checked: l,
        disabled: c,
        onChange: f,
        value: n,
        ..._
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
  className: d = "",
  name: u,
  ..._
}) {
  function f(r, o) {
    l && l({
      target: { value: o, name: u },
      currentTarget: { value: o, name: u }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-radio-group", `au-radio-group--${n}`, d].filter(Boolean).join(" "), ..._, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__list", children: s.map((r) => /* @__PURE__ */ e.jsx(
      fe,
      {
        id: `${u}-${r.value}`,
        name: u,
        label: r.label,
        checked: t === r.value,
        disabled: c || r.disabled,
        onChange: (o) => f(o, r.value),
        value: r.value
      },
      r.value
    )) })
  ] });
}
function Oe({ children: s }) {
  return /* @__PURE__ */ e.jsx(
    "div",
    {
      style: {
        border: "1px solid #ddd",
        borderRadius: "6px",
        padding: "16px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        backgroundColor: "#fff",
        maxWidth: "400px"
      },
      children: s
    }
  );
}
function $e({
  isOpen: s,
  onClose: t,
  title: l,
  children: c,
  footer: i,
  confirmText: n = "Confirm",
  cancelText: d = "Cancel",
  onConfirm: u,
  showCloseButton: _ = !0,
  size: f = "medium",
  className: r = "",
  ...o
}) {
  if (L(() => {
    const x = (m) => {
      m.key === "Escape" && s && t();
    };
    return s && (document.addEventListener("keydown", x), document.body.style.overflow = "hidden"), () => {
      document.removeEventListener("keydown", x), document.body.style.overflow = "unset";
    };
  }, [s, t]), !s) return null;
  const p = (x) => {
    x.target === x.currentTarget && t();
  }, v = [
    "au-modal",
    `au-modal--${f}`,
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: "au-modal-overlay", onClick: p, ...o, children: /* @__PURE__ */ e.jsxs("div", { className: v, role: "dialog", "aria-modal": "true", children: [
    (l || _) && /* @__PURE__ */ e.jsxs("div", { className: "au-modal__header", children: [
      l && /* @__PURE__ */ e.jsx("h2", { className: "au-modal__title", children: l }),
      _ && /* @__PURE__ */ e.jsx(
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
    i || u ? /* @__PURE__ */ e.jsx("div", { className: "au-modal__footer", children: i || /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "au-button au-button--secondary",
          onClick: t,
          children: d
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "au-button au-button--primary",
          onClick: u,
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
  className: d = "",
  ...u
}) {
  const [_, f] = P(!0);
  L(() => {
    if (l > 0) {
      const v = setTimeout(() => {
        f(!1), setTimeout(c, 300);
      }, l);
      return () => clearTimeout(v);
    }
  }, [l, c]);
  const r = () => {
    f(!1), setTimeout(c, 300);
  }, p = [
    "au-toast",
    `au-toast--${me.includes(t) ? t : "info"}`,
    `au-toast--${i}`,
    !_ && "au-toast--hidden",
    d
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: p, role: "alert", ...u, children: [
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
  className: d = "",
  ...u
}) {
  const [_, f] = P(!1), [r, o] = P({ x: 0, y: 0 }), p = W(null), v = W(null), x = W(null), m = xe.includes(l) ? l : "info", g = je.includes(c) ? c : "top", b = () => {
    x.current && clearTimeout(x.current), x.current = setTimeout(() => {
      if (p.current) {
        const T = p.current.getBoundingClientRect();
        o({
          x: T.left + T.width / 2,
          y: T.top + T.height / 2
        });
      }
      f(!0);
    }, i);
  }, E = () => {
    x.current && clearTimeout(x.current), f(!1);
  };
  L(() => () => {
    x.current && clearTimeout(x.current);
  }, []);
  const j = [
    "au-tooltip",
    `au-tooltip--${m}`,
    `au-tooltip--${g}`,
    n && "au-tooltip--with-arrow",
    d
  ].filter(Boolean).join(" "), C = [
    "au-tooltip-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: p,
        className: C,
        onMouseEnter: b,
        onMouseLeave: E,
        onFocus: b,
        onBlur: E,
        ...u,
        children: s
      }
    ),
    _ && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: v,
        className: j,
        style: {
          left: r.x,
          top: r.y
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
  ...d
}) {
  const [u, _] = P(!1), [f, r] = P({ x: 0, y: 0 }), o = W(null), p = W(null), v = {
    top: { x: 0, y: -10 },
    bottom: { x: 0, y: 10 },
    left: { x: -10, y: 0 },
    right: { x: 10, y: 0 }
  }, x = () => {
    if (o.current) {
      const j = o.current.getBoundingClientRect(), C = v[c] || v.bottom;
      r({
        x: j.left + j.width / 2 + C.x,
        y: j.top + j.height / 2 + C.y
      });
    }
    _(!u);
  }, m = () => {
    l === "hover" && x();
  }, g = () => {
    l === "hover" && _(!1);
  };
  L(() => {
    const j = (C) => {
      p.current && !p.current.contains(C.target) && o.current && !o.current.contains(C.target) && _(!1);
    };
    return u && document.addEventListener("mousedown", j), () => {
      document.removeEventListener("mousedown", j);
    };
  }, [u]);
  const b = [
    "au-popover",
    `au-popover--${c}`,
    i && "au-popover--with-arrow",
    n
  ].filter(Boolean).join(" "), E = [
    "au-popover-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: o,
        className: E,
        onClick: l === "click" ? x : void 0,
        onMouseEnter: m,
        onMouseLeave: g,
        ...d,
        children: s
      }
    ),
    u && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: p,
        className: b,
        style: {
          left: f.x,
          top: f.y
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
  className: d = "",
  ...u
}) {
  const _ = ve.includes(s) ? s : "linear", f = Math.min(Math.max(t / l * 100, 0), 100), r = [
    "au-progress",
    `au-progress--${_}`,
    `au-progress--${c}`,
    `au-progress--${i}`,
    d
  ].filter(Boolean).join(" ");
  if (_ === "linear")
    return /* @__PURE__ */ e.jsxs("div", { className: r, ...u, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-progress__track", children: /* @__PURE__ */ e.jsx(
        "div",
        {
          className: "au-progress__bar",
          style: { width: `${f}%` }
        }
      ) }),
      n && /* @__PURE__ */ e.jsxs("span", { className: "au-progress__value", children: [
        Math.round(f),
        "%"
      ] })
    ] });
  if (_ === "circular") {
    const p = 2 * Math.PI * 20, v = p, x = p - f / 100 * p;
    return /* @__PURE__ */ e.jsxs("div", { className: r, ...u, children: [
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
            strokeDasharray: v,
            strokeDashoffset: x,
            transform: "rotate(-90 25 25)"
          }
        )
      ] }),
      n && /* @__PURE__ */ e.jsxs("span", { className: "au-progress__value", children: [
        Math.round(f),
        "%"
      ] })
    ] });
  }
  return _ === "dots" ? /* @__PURE__ */ e.jsx("div", { className: r, ...u, children: /* @__PURE__ */ e.jsxs("div", { className: "au-progress__dots", children: [
    /* @__PURE__ */ e.jsx("span", {}),
    /* @__PURE__ */ e.jsx("span", {}),
    /* @__PURE__ */ e.jsx("span", {})
  ] }) }) : _ === "spinner" ? /* @__PURE__ */ e.jsx("div", { className: r, ...u, children: /* @__PURE__ */ e.jsx("div", { className: "au-progress__spinner" }) }) : null;
}
function Be({
  currentPage: s = 1,
  totalPages: t = 1,
  onPageChange: l,
  showPageSize: c = !1,
  pageSize: i = 10,
  pageSizeOptions: n = [10, 25, 50, 100],
  onPageSizeChange: d,
  showJumpToPage: u = !1,
  className: _ = "",
  ...f
}) {
  const r = (m) => {
    m >= 1 && m <= t && m !== s && l(m);
  }, o = (m) => {
    const g = parseInt(m.target.value);
    d(g);
  }, p = (m) => {
    m.preventDefault();
    const g = parseInt(m.target.elements.page.value);
    g >= 1 && g <= t && l(g);
  }, v = () => {
    const m = [];
    if (t <= 5)
      for (let b = 1; b <= t; b++)
        m.push(
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
      m.push(
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: `au-pagination__page ${s === 1 ? "au-pagination__page--active" : ""}`,
            onClick: () => r(1),
            children: "1"
          },
          1
        )
      ), s > 3 && m.push(/* @__PURE__ */ e.jsx("span", { className: "au-pagination__ellipsis", children: "..." }, "start-ellipsis"));
      const b = Math.max(2, s - 1), E = Math.min(t - 1, s + 1);
      for (let j = b; j <= E; j++)
        m.push(
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: `au-pagination__page ${j === s ? "au-pagination__page--active" : ""}`,
              onClick: () => r(j),
              children: j
            },
            j
          )
        );
      s < t - 2 && m.push(/* @__PURE__ */ e.jsx("span", { className: "au-pagination__ellipsis", children: "..." }, "end-ellipsis")), t > 1 && m.push(
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
    return m;
  }, x = [
    "au-pagination",
    _
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: x, ...f, children: [
    c && /* @__PURE__ */ e.jsxs("div", { className: "au-pagination__page-size", children: [
      /* @__PURE__ */ e.jsx("label", { htmlFor: "page-size", children: "Items per page:" }),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "page-size",
          value: i,
          onChange: o,
          children: n.map((m) => /* @__PURE__ */ e.jsx("option", { value: m, children: m }, m))
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
      /* @__PURE__ */ e.jsx("div", { className: "au-pagination__pages", children: v() }),
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
    u && /* @__PURE__ */ e.jsxs("form", { className: "au-pagination__jump", onSubmit: p, children: [
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
  ].filter(Boolean).join(" "), i = (n, d) => n.divider ? /* @__PURE__ */ e.jsx("div", { className: "au-menu__divider" }, d) : n.checkbox ? /* @__PURE__ */ e.jsxs("label", { className: "au-menu__item au-menu__item--checkbox", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: n.checked || !1,
        onChange: n.onChange
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: n.label })
  ] }, n.id || d) : n.radio ? /* @__PURE__ */ e.jsxs("label", { className: "au-menu__item au-menu__item--radio", children: [
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
  ] }, n.id || d) : n.children ? /* @__PURE__ */ e.jsx(
    ge,
    {
      trigger: n.label,
      items: n.children,
      icon: n.icon
    },
    n.id || d
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
    n.id || d
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
  const [d, u] = P(!1), _ = () => {
    u(!d);
  }, f = (o) => {
    o.onClick && o.onClick(), u(!1);
  }, r = [
    "au-menu-dropdown",
    `au-menu-dropdown--${l}`,
    d && "au-menu-dropdown--open",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: r, ...n, children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: "au-menu-dropdown__trigger",
        onClick: _,
        "aria-expanded": d,
        "aria-haspopup": "true",
        children: [
          c && /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-icon", children: c }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-label", children: s }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-arrow", children: "▼" })
        ]
      }
    ),
    d && /* @__PURE__ */ e.jsx("div", { className: "au-menu-dropdown__menu", children: t.map((o, p) => o.divider ? /* @__PURE__ */ e.jsx("div", { className: "au-menu__divider" }, p) : /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: `au-menu__item ${o.active ? "au-menu__item--active" : ""}`,
        onClick: () => f(o),
        disabled: o.disabled,
        children: [
          o.icon && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-icon", children: o.icon }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: o.label }),
          o.badge && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-badge", children: o.badge })
        ]
      },
      o.id || p
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
  return /* @__PURE__ */ e.jsx("div", { className: n, ...i, children: s.map((d, u) => {
    const _ = u < t, f = u === t, r = u > t, o = [
      "au-stepper__step",
      _ && "au-stepper__step--completed",
      f && "au-stepper__step--active",
      r && "au-stepper__step--pending"
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: o, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-stepper__indicator", children: _ ? /* @__PURE__ */ e.jsx("span", { className: "au-stepper__check", children: "✓" }) : /* @__PURE__ */ e.jsx("span", { className: "au-stepper__number", children: u + 1 }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "au-stepper__content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "au-stepper__title", children: d.title }),
        d.description && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__description", children: d.description })
      ] }),
      u < s.length - 1 && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__connector" })
    ] }, d.id || u);
  }) });
}
function Fe({
  children: s,
  variant: t = "default",
  size: l = "medium",
  closable: c = !1,
  selectable: i = !1,
  selected: n = !1,
  onClose: d,
  onClick: u,
  className: _ = "",
  ...f
}) {
  const r = (v) => {
    v.stopPropagation(), d?.();
  }, o = () => {
    i && u?.();
  }, p = [
    "au-chip",
    `au-chip--${t}`,
    `au-chip--${l}`,
    i && "au-chip--selectable",
    n && "au-chip--selected",
    _
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: p,
      onClick: o,
      role: i ? "button" : void 0,
      tabIndex: i ? 0 : void 0,
      ...f,
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
  return /* @__PURE__ */ e.jsx("div", { className: i, ...c, children: s.map((n, d) => {
    const u = [
      "au-timeline__item",
      n.status && `au-timeline__item--${n.status}`
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: u, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-timeline__indicator", children: n.icon ? /* @__PURE__ */ e.jsx("span", { className: "au-timeline__icon", children: n.icon }) : /* @__PURE__ */ e.jsx("span", { className: "au-timeline__dot" }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "au-timeline__content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "au-timeline__title", children: n.title }),
        n.description && /* @__PURE__ */ e.jsx("div", { className: "au-timeline__description", children: n.description }),
        n.timestamp && /* @__PURE__ */ e.jsx("div", { className: "au-timeline__timestamp", children: n.timestamp })
      ] })
    ] }, n.id || d);
  }) });
}
function De({
  items: s = [],
  selectable: t = !1,
  selectedItems: l = [],
  onSelectionChange: c,
  emptyState: i,
  className: n = "",
  ...d
}) {
  const u = (r) => {
    if (t && c) {
      const o = l.includes(r.id);
      let p;
      o ? p = l.filter((v) => v !== r.id) : p = [...l, r.id], c(p);
    }
    r.onClick && r.onClick(r);
  }, _ = (r, o, p = 0) => {
    const v = t && l.includes(r.id), x = [
      "au-list-group__item",
      v && "au-list-group__item--selected",
      r.disabled && "au-list-group__item--disabled",
      `au-list-group__item--level-${p}`
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: x, children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "au-list-group__item-content",
          onClick: () => u(r),
          role: t ? "button" : void 0,
          tabIndex: t ? 0 : void 0,
          children: [
            r.icon && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-icon", children: r.icon }),
            /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__item-text", children: [
              /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-title", children: r.title }),
              r.description && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-description", children: r.description })
            ] }),
            r.badge && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-badge", children: r.badge }),
            t && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-check", children: v ? "✓" : "" })
          ]
        }
      ),
      r.children && r.children.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__children", children: r.children.map((m, g) => _(m, g, p + 1)) })
    ] }, r.id || o);
  }, f = [
    "au-list-group",
    t && "au-list-group--selectable",
    n
  ].filter(Boolean).join(" ");
  return s.length === 0 && i ? /* @__PURE__ */ e.jsx("div", { className: `${f} au-list-group--empty`, ...d, children: /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__empty", children: [
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
  ] }) }) : /* @__PURE__ */ e.jsx("div", { className: f, ...d, children: s.map((r, o) => _(r, o)) });
}
export {
  be as AUBUTTON,
  Oe as AUCARD,
  _e as AUCHECKBOX,
  Te as AUCHECKBOXGROUP,
  Fe as AUCHIP,
  Ae as AUDATEPICKER,
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
  Re as AURANGE,
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
