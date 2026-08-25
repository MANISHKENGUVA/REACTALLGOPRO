import Le, { useState as M, useEffect as Y, useRef as q, useMemo as ee } from "react";
var _e = { exports: {} }, ue = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var we;
function Ue() {
  if (we) return ue;
  we = 1;
  var a = Symbol.for("react.transitional.element"), n = Symbol.for("react.fragment");
  function r(o, i, t) {
    var c = null;
    if (t !== void 0 && (c = "" + t), i.key !== void 0 && (c = "" + i.key), "key" in i) {
      t = {};
      for (var u in i)
        u !== "key" && (t[u] = i[u]);
    } else t = i;
    return i = t.ref, {
      $$typeof: a,
      type: o,
      key: c,
      ref: i !== void 0 ? i : null,
      props: t
    };
  }
  return ue.Fragment = n, ue.jsx = r, ue.jsxs = r, ue;
}
var de = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ce;
function Ye() {
  return Ce || (Ce = 1, process.env.NODE_ENV !== "production" && function() {
    function a(s) {
      if (s == null) return null;
      if (typeof s == "function")
        return s.$$typeof === N ? null : s.displayName || s.name || null;
      if (typeof s == "string") return s;
      switch (s) {
        case p:
          return "Fragment";
        case E:
          return "Profiler";
        case k:
          return "StrictMode";
        case $:
          return "Suspense";
        case B:
          return "SuspenseList";
        case V:
          return "Activity";
      }
      if (typeof s == "object")
        switch (typeof s.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), s.$$typeof) {
          case g:
            return "Portal";
          case b:
            return (s.displayName || "Context") + ".Provider";
          case j:
            return (s._context.displayName || "Context") + ".Consumer";
          case y:
            var x = s.render;
            return s = s.displayName, s || (s = x.displayName || x.name || "", s = s !== "" ? "ForwardRef(" + s + ")" : "ForwardRef"), s;
          case U:
            return x = s.displayName || null, x !== null ? x : a(s.type) || "Memo";
          case L:
            x = s._payload, s = s._init;
            try {
              return a(s(x));
            } catch {
            }
        }
      return null;
    }
    function n(s) {
      return "" + s;
    }
    function r(s) {
      try {
        n(s);
        var x = !1;
      } catch {
        x = !0;
      }
      if (x) {
        x = console;
        var T = x.error, A = typeof Symbol == "function" && Symbol.toStringTag && s[Symbol.toStringTag] || s.constructor.name || "Object";
        return T.call(
          x,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          A
        ), n(s);
      }
    }
    function o(s) {
      if (s === p) return "<>";
      if (typeof s == "object" && s !== null && s.$$typeof === L)
        return "<...>";
      try {
        var x = a(s);
        return x ? "<" + x + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var s = R.A;
      return s === null ? null : s.getOwner();
    }
    function t() {
      return Error("react-stack-top-frame");
    }
    function c(s) {
      if (O.call(s, "key")) {
        var x = Object.getOwnPropertyDescriptor(s, "key").get;
        if (x && x.isReactWarning) return !1;
      }
      return s.key !== void 0;
    }
    function u(s, x) {
      function T() {
        G || (G = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          x
        ));
      }
      T.isReactWarning = !0, Object.defineProperty(s, "key", {
        get: T,
        configurable: !0
      });
    }
    function h() {
      var s = a(this.type);
      return X[s] || (X[s] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), s = this.props.ref, s !== void 0 ? s : null;
    }
    function m(s, x, T, A, S, P, J, ne) {
      return T = P.ref, s = {
        $$typeof: v,
        type: s,
        key: x,
        props: P,
        _owner: S
      }, (T !== void 0 ? T : null) !== null ? Object.defineProperty(s, "ref", {
        enumerable: !1,
        get: h
      }) : Object.defineProperty(s, "ref", { enumerable: !1, value: null }), s._store = {}, Object.defineProperty(s._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(s, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(s, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: J
      }), Object.defineProperty(s, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: ne
      }), Object.freeze && (Object.freeze(s.props), Object.freeze(s)), s;
    }
    function l(s, x, T, A, S, P, J, ne) {
      var F = x.children;
      if (F !== void 0)
        if (A)
          if (z(F)) {
            for (A = 0; A < F.length; A++)
              d(F[A]);
            Object.freeze && Object.freeze(F);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else d(F);
      if (O.call(x, "key")) {
        F = a(s);
        var H = Object.keys(x).filter(function(le) {
          return le !== "key";
        });
        A = 0 < H.length ? "{key: someKey, " + H.join(": ..., ") + ": ...}" : "{key: someKey}", C[F + A] || (H = 0 < H.length ? "{" + H.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          A,
          F,
          H,
          F
        ), C[F + A] = !0);
      }
      if (F = null, T !== void 0 && (r(T), F = "" + T), c(x) && (r(x.key), F = "" + x.key), "key" in x) {
        T = {};
        for (var re in x)
          re !== "key" && (T[re] = x[re]);
      } else T = x;
      return F && u(
        T,
        typeof s == "function" ? s.displayName || s.name || "Unknown" : s
      ), m(
        s,
        F,
        P,
        S,
        i(),
        T,
        J,
        ne
      );
    }
    function d(s) {
      typeof s == "object" && s !== null && s.$$typeof === v && s._store && (s._store.validated = 1);
    }
    var f = Le, v = Symbol.for("react.transitional.element"), g = Symbol.for("react.portal"), p = Symbol.for("react.fragment"), k = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), j = Symbol.for("react.consumer"), b = Symbol.for("react.context"), y = Symbol.for("react.forward_ref"), $ = Symbol.for("react.suspense"), B = Symbol.for("react.suspense_list"), U = Symbol.for("react.memo"), L = Symbol.for("react.lazy"), V = Symbol.for("react.activity"), N = Symbol.for("react.client.reference"), R = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, O = Object.prototype.hasOwnProperty, z = Array.isArray, W = console.createTask ? console.createTask : function() {
      return null;
    };
    f = {
      react_stack_bottom_frame: function(s) {
        return s();
      }
    };
    var G, X = {}, Q = f.react_stack_bottom_frame.bind(
      f,
      t
    )(), w = W(o(t)), C = {};
    de.Fragment = p, de.jsx = function(s, x, T, A, S) {
      var P = 1e4 > R.recentlyCreatedOwnerStacks++;
      return l(
        s,
        x,
        T,
        !1,
        A,
        S,
        P ? Error("react-stack-top-frame") : Q,
        P ? W(o(s)) : w
      );
    }, de.jsxs = function(s, x, T, A, S) {
      var P = 1e4 > R.recentlyCreatedOwnerStacks++;
      return l(
        s,
        x,
        T,
        !0,
        A,
        S,
        P ? Error("react-stack-top-frame") : Q,
        P ? W(o(s)) : w
      );
    };
  }()), de;
}
var Ee;
function Ve() {
  return Ee || (Ee = 1, process.env.NODE_ENV === "production" ? _e.exports = Ue() : _e.exports = Ye()), _e.exports;
}
var e = Ve();
const We = ["primary", "secondary", "outline", "ghost", "danger", "gradient", "link"];
function oa({
  children: a,
  variant: n = "primary",
  loading: r = !1,
  loadingText: o = "Loading",
  disabled: i = !1,
  leftIcon: t,
  rightIcon: c,
  rounded: u = !1,
  onClick: h,
  type: m = "button",
  className: l = "",
  ...d
}) {
  const f = i || r, g = [
    "au-button",
    `au-button--${We.includes(n) ? n : "primary"}`,
    u && "au-button--rounded",
    r && "au-button--loading",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: m,
      onClick: h,
      className: g,
      disabled: f,
      "aria-busy": r ? "true" : void 0,
      ...d,
      children: r ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("span", { className: "au-button__spinner", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "au-button__label", children: o })
      ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        t && /* @__PURE__ */ e.jsx("span", { className: "au-button__icon au-button__icon--left", children: t }),
        /* @__PURE__ */ e.jsx("span", { className: "au-button__label", children: a }),
        c && /* @__PURE__ */ e.jsx("span", { className: "au-button__icon au-button__icon--right", children: c })
      ] })
    }
  );
}
const ze = ["text", "password", "email", "number"];
function ca({
  id: a,
  label: n,
  type: r = "text",
  value: o,
  defaultValue: i = "",
  onChange: t,
  placeholder: c = "",
  error: u,
  helperText: h,
  prefixIcon: m,
  suffixIcon: l,
  clearable: d = !1,
  showPasswordToggle: f = !1,
  disabled: v = !1,
  className: g = "",
  name: p,
  ...k
}) {
  const E = ze.includes(r) ? r : "text", j = a ?? p ?? "au-input", b = !!n, [y, $] = M(o ?? i), [B, U] = M(!1), [L, V] = M(!1), N = o !== void 0, R = N ? o : y, O = R?.toString().length > 0, z = d && !v && O, W = !!u, G = [
    "au-input",
    b && "au-input--has-label",
    W && "au-input--error",
    v && "au-input--disabled",
    g
  ].filter(Boolean).join(" ");
  Y(() => {
    N && $(o);
  }, [o, N]);
  function X(C) {
    const s = C.target.value;
    N || $(s), t && t(C);
  }
  function Q() {
    v || (N || $(""), t && t({
      target: { value: "", name: p },
      currentTarget: { value: "", name: p },
      nativeEvent: null,
      preventDefault: () => {
      },
      stopPropagation: () => {
      }
    }));
  }
  function w() {
    V((C) => !C);
  }
  return /* @__PURE__ */ e.jsxs("div", { className: G, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "au-input__field", children: [
      m ? /* @__PURE__ */ e.jsx("div", { className: "au-input__adornment au-input__adornment--prefix", children: m }) : null,
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: j,
          name: p,
          type: E === "password" && L ? "text" : E,
          value: R,
          onChange: X,
          placeholder: b ? "" : c || "",
          disabled: v,
          className: "au-input__control",
          "aria-invalid": W ? "true" : "false",
          "aria-describedby": W ? `${j}-error` : h ? `${j}-helper` : void 0,
          onFocus: () => U(!0),
          onBlur: () => U(!1),
          ...k
        }
      ),
      n ? /* @__PURE__ */ e.jsx(
        "label",
        {
          className: `au-input__floating-label ${B || O ? "au-input__floating-label--active" : ""}`,
          htmlFor: j,
          children: n
        }
      ) : null,
      z ? /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "au-input__clear",
          onClick: Q,
          "aria-label": "Clear input",
          children: "×"
        }
      ) : null,
      f && E === "password" ? /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "au-input__visibility",
          onClick: w,
          "aria-label": L ? "Hide password" : "Show password",
          children: L ? "Hide" : "Show"
        }
      ) : null,
      l ? /* @__PURE__ */ e.jsx("div", { className: "au-input__adornment au-input__adornment--suffix", children: l }) : null
    ] }),
    h && !W ? /* @__PURE__ */ e.jsx("div", { id: j ? `${j}-helper` : void 0, className: "au-input__helper", children: h }) : null,
    W ? /* @__PURE__ */ e.jsx("div", { id: j ? `${j}-error` : void 0, className: "au-input__error", children: u }) : null
  ] });
}
function ua({
  id: a,
  label: n,
  value: r,
  defaultValue: o = "",
  onChange: i,
  placeholder: t = "",
  error: c,
  helperText: u,
  maxLength: h,
  autoResize: m = !0,
  charCount: l = !1,
  disabled: d = !1,
  className: f = "",
  name: v,
  ...g
}) {
  const p = r !== void 0, [k, E] = M(r ?? o), j = p ? r : k, b = q(null), y = [
    "au-textarea",
    c && "au-textarea--error",
    d && "au-textarea--disabled",
    f
  ].filter(Boolean).join(" ");
  Y(() => {
    p && E(r);
  }, [r, p]), Y(() => {
    m && b.current && (b.current.style.height = "auto", b.current.style.height = `${b.current.scrollHeight}px`);
  }, [j, m]);
  function $(U) {
    const L = U.target.value;
    p || E(L), i && i(U);
  }
  const B = j?.toString().length ?? 0;
  return /* @__PURE__ */ e.jsxs("div", { className: y, children: [
    n ? /* @__PURE__ */ e.jsx("label", { className: "au-textarea__label", htmlFor: a, children: n }) : null,
    /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: a,
        name: v,
        ref: b,
        className: "au-textarea__control",
        value: j,
        onChange: $,
        placeholder: t,
        maxLength: h,
        disabled: d,
        "aria-invalid": c ? "true" : "false",
        "aria-describedby": c ? `${a}-error` : u ? `${a}-helper` : void 0,
        ...g
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__meta", children: [
      u && !c ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-helper` : void 0, className: "au-textarea__helper", children: u }) : null,
      c ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-error` : void 0, className: "au-textarea__error", children: c }) : null,
      l && h ? /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__counter", children: [
        B,
        "/",
        h
      ] }) : null
    ] })
  ] });
}
function Ge(a) {
  return a.map((n) => n.options ? {
    label: n.label,
    options: n.options.map((r) => ({
      label: r.label,
      value: r.value,
      disabled: r.disabled || !1
    }))
  } : {
    label: n.label,
    value: n.value,
    disabled: n.disabled || !1
  });
}
function da({
  id: a,
  label: n,
  value: r,
  defaultValue: o,
  onChange: i,
  placeholder: t = "Select...",
  error: c,
  helperText: u,
  options: h = [],
  searchable: m = !1,
  multiple: l = !1,
  checkbox: d = !1,
  loading: f = !1,
  asyncText: v = "Loading...",
  disabled: g = !1,
  className: p = "",
  name: k,
  layout: E = "vertical",
  ...j
}) {
  const b = r !== void 0, [y, $] = M(
    o ?? (l ? [] : "")
  ), [B, U] = M(!1), [L, V] = M(""), N = q(null), R = b ? r : y, O = ee(() => Ge(h), [h]);
  Y(() => {
    b && $(r);
  }, [r, b]), Y(() => {
    function w(C) {
      N.current && !N.current.contains(C.target) && U(!1);
    }
    return document.addEventListener("mousedown", w), () => document.removeEventListener("mousedown", w);
  }, []);
  function z(w) {
    b || $(w), i && i({
      target: { value: w, name: k },
      currentTarget: { value: w, name: k }
    });
  }
  function W(w) {
    if (!g)
      if (l) {
        const C = Array.isArray(R) ? [...R] : [], s = C.indexOf(w);
        s >= 0 ? C.splice(s, 1) : C.push(w), z(C);
      } else
        z(w), U(!1);
  }
  const G = ee(() => {
    const w = L.trim().toLowerCase();
    return w ? O.map((C) => {
      if (C.options) {
        const s = C.options.filter(
          (x) => x.label.toLowerCase().includes(w)
        );
        return { ...C, options: s };
      }
      return C;
    }).filter((C) => C.options ? C.options.length > 0 : C.label.toLowerCase().includes(w)) : O;
  }, [O, L]), X = ee(() => {
    if (l) {
      if (!Array.isArray(R)) return "";
      const s = [];
      return O.forEach((x) => {
        (x.options ? x.options : [x]).forEach((A) => {
          R.includes(A.value) && s.push(A.label);
        });
      }), s.join(", ");
    }
    const C = O.flatMap((s) => s.options ? s.options : [s]).find((s) => s.value === R);
    return C ? C.label : "";
  }, [R, O, l]), Q = [
    "au-select",
    c && "au-select--error",
    g && "au-select--disabled",
    p,
    E === "horizontal" && "au-select--horizontal"
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: Q, ref: N, children: [
    n ? /* @__PURE__ */ e.jsx("label", { className: "au-select__label", htmlFor: a, children: n }) : null,
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        id: a,
        name: k,
        className: "au-select__control",
        onClick: () => U((w) => !w),
        disabled: g,
        "aria-expanded": B,
        "aria-haspopup": "listbox",
        ...j,
        children: [
          /* @__PURE__ */ e.jsx("span", { className: X ? "au-select__value" : "au-select__placeholder", children: X || t }),
          /* @__PURE__ */ e.jsx("span", { className: "au-select__arrow", children: "▾" })
        ]
      }
    ),
    B ? /* @__PURE__ */ e.jsxs("div", { className: "au-select__menu", children: [
      m ? /* @__PURE__ */ e.jsx("div", { className: "au-select__search", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "search",
          value: L,
          onChange: (w) => V(w.target.value),
          placeholder: "Search...",
          className: "au-select__search-input",
          autoComplete: "off"
        }
      ) }) : null,
      f ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", children: v }) : G.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", children: "No options" }) : G.map(
        (w, C) => w.options ? /* @__PURE__ */ e.jsxs("div", { className: "au-select__group", children: [
          /* @__PURE__ */ e.jsx("div", { className: "au-select__group-label", children: w.label }),
          w.options.map((s) => {
            const x = l ? Array.isArray(R) && R.includes(s.value) : R === s.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                className: `au-select__item ${x ? "au-select__item--selected" : ""}`,
                onClick: () => W(s.value),
                disabled: s.disabled || g,
                children: [
                  d && l ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", children: x ? "✓" : "" }) : null,
                  /* @__PURE__ */ e.jsx("span", { children: s.label })
                ]
              },
              s.value
            );
          })
        ] }, `group-${C}`) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: `au-select__item ${R === w.value ? "au-select__item--selected" : ""}`,
            onClick: () => W(w.value),
            disabled: w.disabled || g,
            children: [
              d && l ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", children: Array.isArray(R) && R.includes(w.value) ? "✓" : "" }) : null,
              /* @__PURE__ */ e.jsx("span", { children: w.label })
            ]
          },
          w.value
        )
      )
    ] }) : null,
    u && !c ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-helper` : void 0, className: "au-select__helper", children: u }) : null,
    c ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-error` : void 0, className: "au-select__error", children: c }) : null
  ] });
}
function pa({
  id: a,
  label: n,
  checked: r = !1,
  activeLabel: o = "On",
  inactiveLabel: i = "Off",
  disabled: t = !1,
  onChange: c,
  name: u,
  className: h = "",
  ...m
}) {
  function l(d) {
    t || c && c(d);
  }
  return /* @__PURE__ */ e.jsxs(
    "label",
    {
      className: ["au-toggle", t && "au-toggle--disabled", h].filter(Boolean).join(" "),
      htmlFor: a,
      children: [
        /* @__PURE__ */ e.jsxs("span", { className: "au-toggle__labels", children: [
          n ? /* @__PURE__ */ e.jsx("span", { className: "au-toggle__label", children: n }) : null,
          /* @__PURE__ */ e.jsx("span", { className: "au-toggle__state", children: r ? o : i })
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "au-toggle__switch", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              id: a,
              name: u,
              type: "checkbox",
              checked: r,
              disabled: t,
              onChange: l,
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
function fa({
  id: a,
  label: n,
  value: r,
  defaultValue: o = 0,
  onChange: i,
  min: t = 0,
  max: c = 100,
  step: u = 1,
  range: h = !1,
  tooltip: m = !1,
  helperText: l,
  error: d,
  disabled: f = !1,
  className: v = "",
  name: g,
  ...p
}) {
  const k = r !== void 0, E = {
    min: Array.isArray(o) ? o[0] : t,
    max: Array.isArray(o) ? o[1] : c
  }, [j, b] = M(
    h ? E : o
  ), y = k ? r : j, $ = [
    "au-range",
    d && "au-range--error",
    f && "au-range--disabled",
    v
  ].filter(Boolean).join(" ");
  Y(() => {
    k && b(r);
  }, [r, k]);
  function B(N) {
    const R = Number(N.target.value);
    k || b(R), i && i({ target: { value: R, name: g }, currentTarget: { value: R, name: g } });
  }
  function U(N) {
    return (R) => {
      const O = Number(R.target.value), z = {
        min: N === "min" ? O : y.min,
        max: N === "max" ? O : y.max
      };
      k || b(z), i && i({ target: { value: z, name: g }, currentTarget: { value: z, name: g } });
    };
  }
  const L = h ? null : Number(y ?? o), V = h ? {
    min: Number(y?.min ?? E.min),
    max: Number(y?.max ?? E.max)
  } : null;
  return /* @__PURE__ */ e.jsxs("div", { className: $, children: [
    n ? /* @__PURE__ */ e.jsx("label", { className: "au-range__label", htmlFor: a, children: n }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-range__field", children: h ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "au-range__slider-row", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${a}-min`,
            name: g,
            type: "range",
            min: t,
            max: c,
            step: u,
            value: V.min,
            disabled: f,
            onChange: U("min"),
            className: "au-range__input",
            ...p
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${a}-max`,
            name: g,
            type: "range",
            min: t,
            max: c,
            step: u,
            value: V.max,
            disabled: f,
            onChange: U("max"),
            className: "au-range__input",
            ...p
          }
        )
      ] }),
      m ? /* @__PURE__ */ e.jsxs("div", { className: "au-range__tooltip", children: [
        V.min,
        " — ",
        V.max
      ] }) : null
    ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: a,
          name: g,
          type: "range",
          min: t,
          max: c,
          step: u,
          value: L,
          disabled: f,
          onChange: B,
          className: "au-range__input",
          ...p
        }
      ),
      m ? /* @__PURE__ */ e.jsx("div", { className: "au-range__tooltip", children: L }) : null
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-range__meta", children: [
      l && !d ? /* @__PURE__ */ e.jsx("div", { className: "au-range__helper", children: l }) : null,
      d ? /* @__PURE__ */ e.jsx("div", { className: "au-range__error", children: d }) : null
    ] })
  ] });
}
const Je = {
  date: "date",
  datetime: "datetime-local",
  time: "time"
}, qe = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], He = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];
function Z(a) {
  if (!(a instanceof Date) || Number.isNaN(a.getTime())) return "";
  const n = a.getFullYear(), r = String(a.getMonth() + 1).padStart(2, "0"), o = String(a.getDate()).padStart(2, "0");
  return `${n}-${r}-${o}`;
}
function te(a) {
  if (!a) return null;
  const [n, r, o] = a.split("-").map(Number);
  return !n || !r || !o ? null : new Date(n, r - 1, o);
}
function fe(a) {
  return new Date(a.getFullYear(), a.getMonth(), 1);
}
function Te(a, n) {
  return new Date(a.getFullYear(), a.getMonth() + n, 1);
}
function ge(a, n) {
  const r = new Date(a);
  return r.setDate(a.getDate() + n), r;
}
function me(a, n) {
  return !!(a && n && Z(a) === Z(n));
}
function Ke(a, n, r) {
  if (!a || !n || !r) return !1;
  const o = a.getTime();
  return o > n.getTime() && o < r.getTime();
}
function Xe(a) {
  const n = fe(a), r = new Date(n);
  return r.setDate(n.getDate() - n.getDay()), Array.from({ length: 42 }, (o, i) => {
    const t = new Date(r);
    return t.setDate(r.getDate() + i), t;
  });
}
function Re(a, n) {
  const r = a ? n.start || n.end : n;
  return fe(te(r) || /* @__PURE__ */ new Date());
}
function ae(a) {
  const n = te(a);
  return n ? n.toLocaleDateString(void 0, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) : "";
}
function pe(a, n) {
  return {
    target: { value: a, name: n },
    currentTarget: { value: a, name: n }
  };
}
function Qe(a) {
  return a.start && a.end ? `${ae(a.start)} - ${ae(a.end)}` : a.start ? `${ae(a.start)} - Select end date` : "Select start and end dates";
}
function ha({
  id: a,
  label: n,
  mode: r = "date",
  range: o = !1,
  value: i,
  startValue: t,
  endValue: c,
  defaultValue: u = "",
  defaultStartValue: h = "",
  defaultEndValue: m = "",
  onChange: l,
  placeholder: d = "Select date",
  startPlaceholder: f = "Start date",
  endPlaceholder: v = "End date",
  error: g,
  helperText: p,
  disabled: k = !1,
  className: E = "",
  name: j,
  min: b,
  max: y,
  disableFuture: $ = !1,
  disableFutureDates: B = !1,
  disablePast: U = !1,
  disablePastDates: L = !1,
  ...V
}) {
  const N = o || r === "range", R = N || r === "date", O = i !== void 0 || t !== void 0 || c !== void 0, z = q(null), [W, G] = M(u), [X, Q] = M(h), [w, C] = M(m), [s, x] = M(!1), [T, A] = M("start"), S = N ? {
    start: t ?? X,
    end: c ?? w
  } : i ?? W, [P, J] = M(() => Re(N, S));
  Y(() => {
    O && !N && i !== void 0 && G(i), O && N && (t !== void 0 && Q(t), c !== void 0 && C(c));
  }, [O, N, i, t, c]), Y(() => {
    function _(D) {
      z.current?.contains(D.target) || x(!1);
    }
    return document.addEventListener("mousedown", _), () => document.removeEventListener("mousedown", _);
  }, []);
  const ne = $ || B, F = U || L, H = ee(() => {
    if (ne) {
      const _ = Z(/* @__PURE__ */ new Date());
      return y && y < _ ? y : _;
    }
    return y;
  }, [ne, y]), re = ee(() => {
    if (F) {
      const _ = Z(/* @__PURE__ */ new Date());
      return b && b > _ ? b : _;
    }
    return b;
  }, [F, b]), le = ee(() => te(re), [re]), ie = ee(() => te(H), [H]), Se = ee(() => Xe(P), [P]), De = N ? null : te(S), je = N ? te(S.start) : null, be = N ? te(S.end) : null, ve = V.minYear, Ne = V.maxYear, $e = ee(() => {
    const _ = (/* @__PURE__ */ new Date()).getFullYear(), D = le ? le.getFullYear() : ve || 1920, I = ie ? ie.getFullYear() : Ne || _ + 10, K = [];
    for (let se = I; se >= D; se--)
      K.push(se);
    return K;
  }, [le, ie, ve, Ne]);
  function oe(_) {
    return !!(le && _ < le || ie && _ > ie);
  }
  function Oe(_) {
    const D = _.target.value;
    O || G(D), l?.(pe(D, j));
  }
  function he(_) {
    O || (Q(_.start), C(_.end)), l?.(pe(_, j));
  }
  function Ie(_) {
    if (k || oe(_)) return;
    const D = Z(_);
    if (!N) {
      O || G(D), l?.(pe(D, j)), x(!1);
      return;
    }
    const I = { ...S };
    if (T === "start" || !I.start || I.start && I.end) {
      I.start = D, I.end = "", A("end"), he(I);
      return;
    }
    const K = te(I.start);
    K && _ < K ? (I.end = I.start, I.start = D) : I.end = D, A("start"), he(I), x(!1);
  }
  function ce(_) {
    const D = ge(/* @__PURE__ */ new Date(), _);
    if (oe(D)) return;
    const I = Z(D);
    O || G(I), J(fe(D)), l?.(pe(I, j)), x(!1);
  }
  function xe(_, D) {
    const I = ge(/* @__PURE__ */ new Date(), _), K = ge(/* @__PURE__ */ new Date(), D);
    if (oe(I) || oe(K)) return;
    const se = {
      start: Z(I),
      end: Z(K)
    };
    J(fe(I)), A("start"), he(se), x(!1);
  }
  const Me = [
    "au-datepicker",
    s && "au-datepicker--open",
    g && "au-datepicker--error",
    k && "au-datepicker--disabled",
    E
  ].filter(Boolean).join(" "), ke = a ? g ? `${a}-error` : p ? `${a}-helper` : void 0 : void 0, Be = Je[r] || "date", ye = N ? [ae(S.start), ae(S.end)].filter(Boolean).join(" - ") : ae(S), Fe = N ? Qe(S) : ae(S) || "Choose a date";
  return /* @__PURE__ */ e.jsxs("div", { className: Me, ref: z, children: [
    n && /* @__PURE__ */ e.jsx("label", { className: "au-datepicker__label", htmlFor: a, children: n }),
    R ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          id: a,
          className: "au-datepicker__trigger",
          disabled: k,
          "aria-invalid": g ? "true" : "false",
          "aria-describedby": ke,
          "aria-expanded": s,
          onClick: () => {
            J(Re(N, S)), x((_) => !_);
          },
          ...V,
          children: [
            /* @__PURE__ */ e.jsx("span", { className: ye ? "au-datepicker__value" : "au-datepicker__placeholder", children: ye || (N ? `${f} - ${v}` : d) }),
            /* @__PURE__ */ e.jsx("span", { className: "au-datepicker__icon", "aria-hidden": "true", children: "📅" })
          ]
        }
      ),
      N ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("input", { type: "hidden", name: j ? `${j}Start` : void 0, value: S.start, readOnly: !0 }),
        /* @__PURE__ */ e.jsx("input", { type: "hidden", name: j ? `${j}End` : void 0, value: S.end, readOnly: !0 })
      ] }) : /* @__PURE__ */ e.jsx("input", { type: "hidden", name: j, value: S, readOnly: !0 }),
      s && /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__panel", role: "dialog", "aria-label": n || "Choose date", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__panel-hero", children: [
          /* @__PURE__ */ e.jsx("span", { children: N ? "Date Range" : "Calendar Date" }),
          /* @__PURE__ */ e.jsx("strong", { children: Fe })
        ] }),
        N && /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__range-preview", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: T === "start" ? "is-active" : "",
              onClick: () => A("start"),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: "Start" }),
                /* @__PURE__ */ e.jsx("strong", { children: ae(S.start) || f })
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: T === "end" ? "is-active" : "",
              onClick: () => A("end"),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: "End" }),
                /* @__PURE__ */ e.jsx("strong", { children: ae(S.end) || v })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__panel-header", style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 10px",
          borderBottom: "1px solid #f1f5f9",
          marginBottom: "10px"
        }, children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "au-datepicker__nav-button",
              onClick: () => J((_) => Te(_, -1)),
              "aria-label": "Previous month",
              style: {
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                color: "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
              },
              children: /* @__PURE__ */ e.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ e.jsx("path", { d: "M15 18l-6-6 6-6" }) })
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__month-title", style: { display: "flex", gap: "8px", alignItems: "center" }, children: [
            /* @__PURE__ */ e.jsx(
              "select",
              {
                className: "au-datepicker__month-select",
                value: P.getMonth(),
                onChange: (_) => {
                  const D = Number(_.target.value);
                  J(new Date(P.getFullYear(), D, 1));
                },
                style: {
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  backgroundColor: "#f8fafc",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                  padding: "6px 26px 6px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#1e293b",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  outline: "none"
                },
                children: He.map((_, D) => /* @__PURE__ */ e.jsx("option", { value: D, children: _ }, _))
              }
            ),
            /* @__PURE__ */ e.jsx(
              "select",
              {
                className: "au-datepicker__year-select",
                value: P.getFullYear(),
                onChange: (_) => {
                  const D = Number(_.target.value);
                  J(new Date(D, P.getMonth(), 1));
                },
                style: {
                  appearance: "none",
                  WebkitAppearance: "none",
                  MozAppearance: "none",
                  backgroundColor: "#f8fafc",
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23475569' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 8px center",
                  padding: "6px 26px 6px 12px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#1e293b",
                  cursor: "pointer",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                  outline: "none"
                },
                children: $e.map((_) => /* @__PURE__ */ e.jsx("option", { value: _, children: _ }, _))
              }
            )
          ] }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "au-datepicker__nav-button",
              onClick: () => J((_) => Te(_, 1)),
              "aria-label": "Next month",
              style: {
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                color: "#475569",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)"
              },
              children: /* @__PURE__ */ e.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ e.jsx("path", { d: "M9 18l6-6-6-6" }) })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__weekdays", "aria-hidden": "true", children: qe.map((_) => /* @__PURE__ */ e.jsx("span", { children: _ }, _)) }),
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__days", children: Se.map((_) => {
          const D = Z(_), I = _.getMonth() !== P.getMonth(), K = oe(_), se = N ? me(_, je) || me(_, be) : me(_, De), Pe = N && Ke(_, je, be);
          return /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: [
                "au-datepicker__day",
                I && "is-muted",
                se && "is-selected",
                Pe && "is-in-range",
                me(_, /* @__PURE__ */ new Date()) && "is-today"
              ].filter(Boolean).join(" "),
              disabled: K,
              onClick: () => Ie(_),
              "aria-pressed": se,
              children: _.getDate()
            },
            D
          );
        }) }),
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__presets", "aria-label": "Quick selections", children: N ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => xe(0, 6), children: "This week" }),
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => xe(7, 13), children: "Next week" }),
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => xe(0, 29), children: "30 days" })
        ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => ce(0), children: "Today" }),
          !ne && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => ce(1), children: "Tomorrow" }),
            /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => ce(7), children: "Next week" })
          ] }),
          ne && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => ce(-1), children: "Yesterday" }),
            /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => ce(-7), children: "Last week" })
          ] })
        ] }) }),
        /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => J(fe(/* @__PURE__ */ new Date())), children: "Today" }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                N ? (he({ start: "", end: "" }), A("start")) : (O || G(""), l?.(pe("", j)));
              },
              children: "Clear"
            }
          )
        ] })
      ] })
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__native-wrap", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: a,
          name: j,
          type: Be,
          value: S,
          onChange: Oe,
          placeholder: d,
          disabled: k,
          min: re,
          max: H,
          className: "au-datepicker__control",
          "aria-invalid": g ? "true" : "false",
          "aria-describedby": ke,
          ...V
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "au-datepicker__icon", "aria-hidden": "true", children: "📅" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__meta", children: [
      p && !g && /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-helper` : void 0, className: "au-datepicker__helper", children: p }),
      g && /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-error` : void 0, className: "au-datepicker__error", children: g })
    ] })
  ] });
}
function Ze({
  id: a,
  label: n,
  checked: r = !1,
  indeterminate: o = !1,
  disabled: i = !1,
  onChange: t,
  value: c,
  name: u,
  className: h = "",
  ...m
}) {
  const l = q(null);
  Y(() => {
    l.current && (l.current.indeterminate = o);
  }, [o]);
  function d(f) {
    i || t && t(f);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-checkbox", i && "au-checkbox--disabled", h].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: l,
        id: a,
        name: u,
        type: "checkbox",
        checked: r,
        disabled: i,
        onChange: d,
        value: c,
        ...m
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__box", children: r ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__check", children: "✓" }) : o ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__indeterminate", children: "—" }) : null }),
    n ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__label", children: n }) : null
  ] });
}
function _a({
  options: a = [],
  value: n = [],
  onChange: r,
  disabled: o = !1,
  label: i,
  layout: t = "vertical",
  className: c = "",
  name: u,
  ...h
}) {
  function m(l, d) {
    const f = Array.isArray(n) ? [...n] : [], v = f.indexOf(d);
    v >= 0 ? f.splice(v, 1) : f.push(d), r && r({
      target: { value: f, name: u },
      currentTarget: { value: f, name: u }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-checkbox-group", `au-checkbox-group--${t}`, c].filter(Boolean).join(" "), ...h, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__list", children: a.map((l) => /* @__PURE__ */ e.jsx(
      Ze,
      {
        id: `${u}-${l.value}`,
        name: u,
        label: l.label,
        checked: Array.isArray(n) && n.includes(l.value),
        disabled: o || l.disabled,
        onChange: (d) => m(d, l.value),
        value: l.value
      },
      l.value
    )) })
  ] });
}
function ea({
  id: a,
  label: n,
  checked: r = !1,
  disabled: o = !1,
  onChange: i,
  value: t,
  name: c,
  className: u = "",
  ...h
}) {
  function m(l) {
    o || i && i(l);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-radio", o && "au-radio--disabled", u].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        id: a,
        name: c,
        type: "radio",
        checked: r,
        disabled: o,
        onChange: m,
        value: t,
        ...h
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-radio__circle", children: r ? /* @__PURE__ */ e.jsx("span", { className: "au-radio__dot" }) : null }),
    n ? /* @__PURE__ */ e.jsx("span", { className: "au-radio__label", children: n }) : null
  ] });
}
function ma({
  options: a = [],
  value: n,
  onChange: r,
  disabled: o = !1,
  label: i,
  layout: t = "vertical",
  className: c = "",
  name: u,
  ...h
}) {
  function m(l, d) {
    r && r({
      target: { value: d, name: u },
      currentTarget: { value: d, name: u }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-radio-group", `au-radio-group--${t}`, c].filter(Boolean).join(" "), ...h, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__list", children: a.map((l) => /* @__PURE__ */ e.jsx(
      ea,
      {
        id: `${u}-${l.value}`,
        name: u,
        label: l.label,
        checked: n === l.value,
        disabled: o || l.disabled,
        onChange: (d) => m(d, l.value),
        value: l.value
      },
      l.value
    )) })
  ] });
}
function xa({
  title: a,
  description: n,
  footer: r,
  children: o,
  className: i = "",
  style: t = {},
  ...c
}) {
  const u = ["au-card", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: u, style: t, ...c, children: [
    (a || n) && /* @__PURE__ */ e.jsxs("div", { className: "au-card__header", children: [
      a && /* @__PURE__ */ e.jsx("h2", { className: "au-card__title", children: a }),
      n && /* @__PURE__ */ e.jsx("p", { className: "au-card__description", children: n })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "au-card__body", children: o }),
    r && /* @__PURE__ */ e.jsx("div", { className: "au-card__footer", children: r })
  ] });
}
const Ae = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");
function ga({
  isOpen: a,
  onClose: n,
  title: r,
  children: o,
  footer: i,
  confirmText: t = "Confirm",
  cancelText: c = "Cancel",
  onConfirm: u,
  showCloseButton: h = !0,
  size: m = "medium",
  className: l = "",
  ...d
}) {
  const [f, v] = M(a), g = q(null), p = q(null);
  if (Y(() => (a && (p.current = document.activeElement, v(!0), document.body.style.overflow = "hidden"), () => {
    document.body.style.overflow = "unset", p.current instanceof HTMLElement && p.current.focus();
  }), [a]), Y(() => {
    if (!a && f) {
      const j = setTimeout(() => v(!1), 240);
      return () => clearTimeout(j);
    }
  }, [a, f]), Y(() => {
    if (a && g.current) {
      const j = g.current.querySelectorAll(Ae);
      j.length ? j[0].focus() : g.current.focus();
    }
  }, [a]), Y(() => {
    function j(b) {
      if (a && (b.key === "Escape" && (b.preventDefault(), n()), b.key === "Tab" && g.current)) {
        const y = Array.from(g.current.querySelectorAll(Ae));
        if (y.length === 0) return;
        const $ = y.indexOf(document.activeElement), B = b.shiftKey ? $ - 1 : $ + 1;
        B >= y.length ? (b.preventDefault(), y[0].focus()) : B < 0 && (b.preventDefault(), y[y.length - 1].focus());
      }
    }
    return document.addEventListener("keydown", j), () => document.removeEventListener("keydown", j);
  }, [a, n]), !f) return null;
  const k = (j) => {
    j.target === j.currentTarget && n();
  }, E = [
    "au-modal",
    `au-modal--${m}`,
    a ? "au-modal--open" : "au-modal--closing",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: "au-modal-overlay", onClick: k, role: "presentation", ...d, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: g,
      className: E,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": r ? "au-modal-title" : void 0,
      tabIndex: -1,
      children: [
        (r || h) && /* @__PURE__ */ e.jsxs("div", { className: "au-modal__header", children: [
          r && /* @__PURE__ */ e.jsx("h2", { id: "au-modal-title", className: "au-modal__title", children: r }),
          h && /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "au-modal__close",
              onClick: n,
              "aria-label": "Close modal",
              children: "×"
            }
          )
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "au-modal__body", children: o }),
        i || u ? /* @__PURE__ */ e.jsx("div", { className: "au-modal__footer", children: i || /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "au-button au-button--secondary",
              onClick: n,
              children: c
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "au-button au-button--primary",
              onClick: u,
              children: t
            }
          )
        ] }) }) : null
      ]
    }
  ) });
}
const aa = ["success", "error", "warning", "info", "alert"];
function na({
  message: a,
  variant: n = "info",
  duration: r = 4e3,
  onClose: o,
  position: i = "top-right",
  showCloseButton: t = !0,
  className: c = "",
  ...u
}) {
  const [h, m] = M(!0);
  Y(() => {
    if (r > 0) {
      const v = setTimeout(() => {
        m(!1), setTimeout(o, 300);
      }, r);
      return () => clearTimeout(v);
    }
  }, [r, o]);
  const l = () => {
    m(!1), setTimeout(o, 300);
  }, f = [
    "au-toast",
    `au-toast--${aa.includes(n) ? n : "info"}`,
    `au-toast--${i}`,
    !h && "au-toast--hidden",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: f, role: "alert", ...u, children: [
    /* @__PURE__ */ e.jsx("div", { className: "au-toast__content", children: a }),
    t && /* @__PURE__ */ e.jsx(
      "button",
      {
        className: "au-toast__close",
        onClick: l,
        "aria-label": "Close notification",
        children: "×"
      }
    )
  ] });
}
function ja({ toasts: a, position: n = "top-right" }) {
  const r = [
    "au-toast-container",
    `au-toast-container--${n}`
  ].join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: r, children: a.map((o, i) => /* @__PURE__ */ e.jsx(
    na,
    {
      ...o
    },
    o.id || i
  )) });
}
const sa = ["success", "error", "warning", "info"], ta = ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"];
function ba({
  children: a,
  content: n,
  variant: r = "info",
  position: o = "top",
  delay: i = 300,
  showArrow: t = !0,
  className: c = "",
  style: u = {},
  ...h
}) {
  const [m, l] = M(!1), [d, f] = M({ x: 0, y: 0 }), v = q(null), g = q(null), p = q(null), k = sa.includes(r) ? r : "info", E = ta.includes(o) ? o : "top", j = () => {
    p.current && clearTimeout(p.current), p.current = setTimeout(() => {
      if (v.current) {
        const B = v.current.getBoundingClientRect();
        f({
          x: B.left + B.width / 2,
          y: B.top + B.height / 2
        });
      }
      l(!0);
    }, i);
  }, b = () => {
    p.current && clearTimeout(p.current), l(!1);
  };
  Y(() => () => {
    p.current && clearTimeout(p.current);
  }, []);
  const y = [
    "au-tooltip",
    `au-tooltip--${k}`,
    `au-tooltip--${E}`,
    t && "au-tooltip--with-arrow",
    c
  ].filter(Boolean).join(" "), $ = [
    "au-tooltip-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: v,
        className: $,
        onMouseEnter: j,
        onMouseLeave: b,
        onFocus: j,
        onBlur: b,
        ...h,
        children: a
      }
    ),
    m && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: g,
        className: y,
        style: {
          ...u,
          "--au-tooltip-left": `${d.x}px`,
          "--au-tooltip-top": `${d.y}px`
        },
        role: "tooltip",
        children: [
          n,
          t && /* @__PURE__ */ e.jsx("div", { className: "au-tooltip__arrow" })
        ]
      }
    )
  ] });
}
function va({
  children: a,
  content: n,
  trigger: r = "click",
  position: o = "bottom",
  showArrow: i = !0,
  className: t = "",
  style: c = {},
  ...u
}) {
  const [h, m] = M(!1), [l, d] = M({ x: 0, y: 0 }), f = q(null), v = q(null), g = {
    top: { x: 0, y: -10 },
    bottom: { x: 0, y: 10 },
    left: { x: -10, y: 0 },
    right: { x: 10, y: 0 }
  }, p = () => {
    if (f.current) {
      const y = f.current.getBoundingClientRect(), $ = g[o] || g.bottom;
      d({
        x: y.left + y.width / 2 + $.x,
        y: y.top + y.height / 2 + $.y
      });
    }
    m(!h);
  }, k = () => {
    r === "hover" && p();
  }, E = () => {
    r === "hover" && m(!1);
  };
  Y(() => {
    const y = ($) => {
      v.current && !v.current.contains($.target) && f.current && !f.current.contains($.target) && m(!1);
    };
    return h && document.addEventListener("mousedown", y), () => {
      document.removeEventListener("mousedown", y);
    };
  }, [h]);
  const j = [
    "au-popover",
    `au-popover--${o}`,
    i && "au-popover--with-arrow",
    t
  ].filter(Boolean).join(" "), b = [
    "au-popover-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: f,
        className: b,
        onClick: r === "click" ? p : void 0,
        onMouseEnter: k,
        onMouseLeave: E,
        ...u,
        children: a
      }
    ),
    h && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: v,
        className: j,
        style: {
          ...c,
          "--au-popover-left": `${l.x}px`,
          "--au-popover-top": `${l.y}px`
        },
        role: "dialog",
        children: [
          n,
          i && /* @__PURE__ */ e.jsx("div", { className: "au-popover__arrow" })
        ]
      }
    )
  ] });
}
const ra = ["linear", "circular", "dots", "spinner"];
function Na({
  variant: a = "linear",
  value: n = 0,
  max: r = 100,
  size: o = "medium",
  color: i = "primary",
  showValue: t = !1,
  className: c = "",
  style: u = {},
  ...h
}) {
  const m = ra.includes(a) ? a : "linear", l = Math.min(Math.max(n / r * 100, 0), 100), d = {
    ...u,
    "--au-progress-width": `${l}%`
  }, f = [
    "au-progress",
    `au-progress--${m}`,
    `au-progress--${o}`,
    `au-progress--${i}`,
    c
  ].filter(Boolean).join(" ");
  if (m === "linear")
    return /* @__PURE__ */ e.jsxs("div", { className: f, style: d, ...h, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-progress__track", children: /* @__PURE__ */ e.jsx("div", { className: "au-progress__bar" }) }),
      t && /* @__PURE__ */ e.jsxs("span", { className: "au-progress__value", children: [
        Math.round(l),
        "%"
      ] })
    ] });
  if (m === "circular") {
    const g = 2 * Math.PI * 20, p = g, k = g - l / 100 * g;
    return /* @__PURE__ */ e.jsxs("div", { className: f, ...h, children: [
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
            strokeDashoffset: k,
            transform: "rotate(-90 25 25)"
          }
        )
      ] }),
      t && /* @__PURE__ */ e.jsxs("span", { className: "au-progress__value", children: [
        Math.round(l),
        "%"
      ] })
    ] });
  }
  return m === "dots" ? /* @__PURE__ */ e.jsx("div", { className: f, ...h, children: /* @__PURE__ */ e.jsxs("div", { className: "au-progress__dots", children: [
    /* @__PURE__ */ e.jsx("span", {}),
    /* @__PURE__ */ e.jsx("span", {}),
    /* @__PURE__ */ e.jsx("span", {})
  ] }) }) : m === "spinner" ? /* @__PURE__ */ e.jsx("div", { className: f, ...h, children: /* @__PURE__ */ e.jsx("div", { className: "au-progress__spinner" }) }) : null;
}
function ka({
  currentPage: a = 1,
  totalPages: n = 1,
  onPageChange: r,
  showPageSize: o = !1,
  pageSize: i = 10,
  pageSizeOptions: t = [10, 25, 50, 100],
  onPageSizeChange: c,
  showJumpToPage: u = !1,
  className: h = "",
  ...m
}) {
  const l = (p) => {
    p >= 1 && p <= n && p !== a && r(p);
  }, d = (p) => {
    const k = parseInt(p.target.value);
    c(k);
  }, f = (p) => {
    p.preventDefault();
    const k = parseInt(p.target.elements.page.value);
    k >= 1 && k <= n && r(k);
  }, v = () => {
    const p = [];
    if (n <= 5)
      for (let E = 1; E <= n; E++)
        p.push(
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: `au-pagination__page ${E === a ? "au-pagination__page--active" : ""}`,
              onClick: () => l(E),
              children: E
            },
            E
          )
        );
    else {
      p.push(
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: `au-pagination__page ${a === 1 ? "au-pagination__page--active" : ""}`,
            onClick: () => l(1),
            children: "1"
          },
          1
        )
      ), a > 3 && p.push(/* @__PURE__ */ e.jsx("span", { className: "au-pagination__ellipsis", children: "..." }, "start-ellipsis"));
      const E = Math.max(2, a - 1), j = Math.min(n - 1, a + 1);
      for (let b = E; b <= j; b++)
        p.push(
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: `au-pagination__page ${b === a ? "au-pagination__page--active" : ""}`,
              onClick: () => l(b),
              children: b
            },
            b
          )
        );
      a < n - 2 && p.push(/* @__PURE__ */ e.jsx("span", { className: "au-pagination__ellipsis", children: "..." }, "end-ellipsis")), n > 1 && p.push(
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: `au-pagination__page ${n === a ? "au-pagination__page--active" : ""}`,
            onClick: () => l(n),
            children: n
          },
          n
        )
      );
    }
    return p;
  }, g = [
    "au-pagination",
    h
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: g, ...m, children: [
    o && /* @__PURE__ */ e.jsxs("div", { className: "au-pagination__page-size", children: [
      /* @__PURE__ */ e.jsx("label", { htmlFor: "page-size", children: "Items per page:" }),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "page-size",
          value: i,
          onChange: d,
          children: t.map((p) => /* @__PURE__ */ e.jsx("option", { value: p, children: p }, p))
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-pagination__controls", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "au-pagination__nav au-pagination__nav--prev",
          onClick: () => l(a - 1),
          disabled: a === 1,
          children: "Previous"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "au-pagination__pages", children: v() }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "au-pagination__nav au-pagination__nav--next",
          onClick: () => l(a + 1),
          disabled: a === n,
          children: "Next"
        }
      )
    ] }),
    u && /* @__PURE__ */ e.jsxs("form", { className: "au-pagination__jump", onSubmit: f, children: [
      /* @__PURE__ */ e.jsx("label", { htmlFor: "jump-page", children: "Go to page:" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: "jump-page",
          name: "page",
          type: "number",
          min: "1",
          max: n,
          defaultValue: a
        }
      ),
      /* @__PURE__ */ e.jsx("button", { type: "submit", children: "Go" })
    ] })
  ] });
}
function ya({
  items: a = [],
  className: n = "",
  ...r
}) {
  const o = [
    "au-menu",
    n
  ].filter(Boolean).join(" "), i = (t, c) => t.divider ? /* @__PURE__ */ e.jsx("div", { className: "au-menu__divider" }, c) : t.checkbox ? /* @__PURE__ */ e.jsxs("label", { className: "au-menu__item au-menu__item--checkbox", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: t.checked || !1,
        onChange: t.onChange
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: t.label })
  ] }, t.id || c) : t.radio ? /* @__PURE__ */ e.jsxs("label", { className: "au-menu__item au-menu__item--radio", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "radio",
        name: t.name,
        value: t.value,
        checked: t.checked || !1,
        onChange: t.onChange
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: t.label })
  ] }, t.id || c) : t.children ? /* @__PURE__ */ e.jsx(
    la,
    {
      trigger: t.label,
      items: t.children,
      icon: t.icon
    },
    t.id || c
  ) : /* @__PURE__ */ e.jsxs(
    "button",
    {
      className: `au-menu__item ${t.active ? "au-menu__item--active" : ""}`,
      onClick: t.onClick,
      disabled: t.disabled,
      children: [
        t.icon && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-icon", children: t.icon }),
        /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: t.label }),
        t.badge && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-badge", children: t.badge })
      ]
    },
    t.id || c
  );
  return /* @__PURE__ */ e.jsx("div", { className: o, ...r, children: a.map(i) });
}
function la({
  trigger: a,
  items: n = [],
  position: r = "bottom-left",
  icon: o,
  className: i = "",
  ...t
}) {
  const [c, u] = M(!1), h = () => {
    u(!c);
  }, m = (d) => {
    d.onClick && d.onClick(), u(!1);
  }, l = [
    "au-menu-dropdown",
    `au-menu-dropdown--${r}`,
    c && "au-menu-dropdown--open",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: l, ...t, children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: "au-menu-dropdown__trigger",
        onClick: h,
        "aria-expanded": c,
        "aria-haspopup": "true",
        children: [
          o && /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-icon", children: o }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-label", children: a }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-arrow", children: "▼" })
        ]
      }
    ),
    c && /* @__PURE__ */ e.jsx("div", { className: "au-menu-dropdown__menu", children: n.map((d, f) => d.divider ? /* @__PURE__ */ e.jsx("div", { className: "au-menu__divider" }, f) : /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: `au-menu__item ${d.active ? "au-menu__item--active" : ""}`,
        onClick: () => m(d),
        disabled: d.disabled,
        children: [
          d.icon && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-icon", children: d.icon }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: d.label }),
          d.badge && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-badge", children: d.badge })
        ]
      },
      d.id || f
    )) })
  ] });
}
function wa({
  steps: a = [],
  activeStep: n = 0,
  orientation: r = "horizontal",
  className: o = "",
  ...i
}) {
  const t = [
    "au-stepper",
    `au-stepper--${r}`,
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: t, ...i, children: a.map((c, u) => {
    const h = u < n, m = u === n, l = u > n, d = [
      "au-stepper__step",
      h && "au-stepper__step--completed",
      m && "au-stepper__step--active",
      l && "au-stepper__step--pending"
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: d, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-stepper__indicator", children: h ? /* @__PURE__ */ e.jsx("span", { className: "au-stepper__check", children: "✓" }) : /* @__PURE__ */ e.jsx("span", { className: "au-stepper__number", children: u + 1 }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "au-stepper__content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "au-stepper__title", children: c.title }),
        c.description && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__description", children: c.description })
      ] }),
      u < a.length - 1 && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__connector" })
    ] }, c.id || u);
  }) });
}
function Ca({
  children: a,
  variant: n = "default",
  size: r = "medium",
  closable: o = !1,
  selectable: i = !1,
  selected: t = !1,
  onClose: c,
  onClick: u,
  className: h = "",
  ...m
}) {
  const l = (v) => {
    v.stopPropagation(), c?.();
  }, d = () => {
    i && u?.();
  }, f = [
    "au-chip",
    `au-chip--${n}`,
    `au-chip--${r}`,
    i && "au-chip--selectable",
    t && "au-chip--selected",
    h
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: f,
      onClick: d,
      role: i ? "button" : void 0,
      tabIndex: i ? 0 : void 0,
      ...m,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "au-chip__content", children: a }),
        o && /* @__PURE__ */ e.jsx(
          "button",
          {
            className: "au-chip__close",
            onClick: l,
            "aria-label": "Remove",
            children: "×"
          }
        )
      ]
    }
  );
}
function Ea({
  items: a = [],
  orientation: n = "vertical",
  className: r = "",
  ...o
}) {
  const i = [
    "au-timeline",
    `au-timeline--${n}`,
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: i, ...o, children: a.map((t, c) => {
    const u = [
      "au-timeline__item",
      t.status && `au-timeline__item--${t.status}`
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: u, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-timeline__indicator", children: t.icon ? /* @__PURE__ */ e.jsx("span", { className: "au-timeline__icon", children: t.icon }) : /* @__PURE__ */ e.jsx("span", { className: "au-timeline__dot" }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "au-timeline__content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "au-timeline__title", children: t.title }),
        t.description && /* @__PURE__ */ e.jsx("div", { className: "au-timeline__description", children: t.description }),
        t.timestamp && /* @__PURE__ */ e.jsx("div", { className: "au-timeline__timestamp", children: t.timestamp })
      ] })
    ] }, t.id || c);
  }) });
}
function Ta({
  items: a = [],
  selectable: n = !1,
  selectedItems: r = [],
  onSelectionChange: o,
  emptyState: i,
  className: t = "",
  ...c
}) {
  const u = (l) => {
    if (n && o) {
      const d = r.includes(l.id);
      let f;
      d ? f = r.filter((v) => v !== l.id) : f = [...r, l.id], o(f);
    }
    l.onClick && l.onClick(l);
  }, h = (l, d, f = 0) => {
    const v = n && r.includes(l.id), g = [
      "au-list-group__item",
      v && "au-list-group__item--selected",
      l.disabled && "au-list-group__item--disabled",
      `au-list-group__item--level-${f}`
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: g, children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "au-list-group__item-content",
          onClick: () => u(l),
          role: n ? "button" : void 0,
          tabIndex: n ? 0 : void 0,
          children: [
            l.icon && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-icon", children: l.icon }),
            /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__item-text", children: [
              /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-title", children: l.title }),
              l.description && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-description", children: l.description })
            ] }),
            l.badge && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-badge", children: l.badge }),
            n && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-check", children: v ? "✓" : "" })
          ]
        }
      ),
      l.children && l.children.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__children", children: l.children.map((p, k) => h(p, k, f + 1)) })
    ] }, l.id || d);
  }, m = [
    "au-list-group",
    n && "au-list-group--selectable",
    t
  ].filter(Boolean).join(" ");
  return a.length === 0 && i ? /* @__PURE__ */ e.jsx("div", { className: `${m} au-list-group--empty`, ...c, children: /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__empty", children: [
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
  ] }) }) : /* @__PURE__ */ e.jsx("div", { className: m, ...c, children: a.map((l, d) => h(l, d)) });
}
export {
  oa as AUBUTTON,
  xa as AUCARD,
  Ze as AUCHECKBOX,
  _a as AUCHECKBOXGROUP,
  Ca as AUCHIP,
  ha as AUDATEPICKER,
  ca as AUINPUT,
  Ta as AULISTGROUP,
  ya as AUMENU,
  la as AUMENUDROPDOWN,
  ga as AUMODAL,
  ka as AUPAGINATION,
  va as AUPOPOVER,
  Na as AUPROGRESS,
  ea as AURADIO,
  ma as AURADIOGROUP,
  fa as AURANGE,
  da as AUSELECT,
  wa as AUSTEPPER,
  ua as AUTEXTAREA,
  Ea as AUTIMELINE,
  na as AUTOAST,
  ja as AUTOASTCONTAINER,
  pa as AUTOGGLE,
  ba as AUTOOLTIP
};
//# sourceMappingURL=router-engine.es.js.map
