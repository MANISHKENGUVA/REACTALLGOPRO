import Le, { useState as B, useEffect as V, useRef as J, useMemo as ee } from "react";
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
      for (var d in i)
        d !== "key" && (t[d] = i[d]);
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
        return s.$$typeof === w ? null : s.displayName || s.name || null;
      if (typeof s == "string") return s;
      switch (s) {
        case f:
          return "Fragment";
        case E:
          return "Profiler";
        case N:
          return "StrictMode";
        case O:
          return "Suspense";
        case M:
          return "SuspenseList";
        case L:
          return "Activity";
      }
      if (typeof s == "object")
        switch (typeof s.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), s.$$typeof) {
          case g:
            return "Portal";
          case j:
            return (s.displayName || "Context") + ".Provider";
          case v:
            return (s._context.displayName || "Context") + ".Consumer";
          case k:
            var m = s.render;
            return s = s.displayName, s || (s = m.displayName || m.name || "", s = s !== "" ? "ForwardRef(" + s + ")" : "ForwardRef"), s;
          case W:
            return m = s.displayName || null, m !== null ? m : a(s.type) || "Memo";
          case Y:
            m = s._payload, s = s._init;
            try {
              return a(s(m));
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
        var m = !1;
      } catch {
        m = !0;
      }
      if (m) {
        m = console;
        var R = m.error, A = typeof Symbol == "function" && Symbol.toStringTag && s[Symbol.toStringTag] || s.constructor.name || "Object";
        return R.call(
          m,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          A
        ), n(s);
      }
    }
    function o(s) {
      if (s === f) return "<>";
      if (typeof s == "object" && s !== null && s.$$typeof === Y)
        return "<...>";
      try {
        var m = a(s);
        return m ? "<" + m + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var s = C.A;
      return s === null ? null : s.getOwner();
    }
    function t() {
      return Error("react-stack-top-frame");
    }
    function c(s) {
      if ($.call(s, "key")) {
        var m = Object.getOwnPropertyDescriptor(s, "key").get;
        if (m && m.isReactWarning) return !1;
      }
      return s.key !== void 0;
    }
    function d(s, m) {
      function R() {
        U || (U = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          m
        ));
      }
      R.isReactWarning = !0, Object.defineProperty(s, "key", {
        get: R,
        configurable: !0
      });
    }
    function _() {
      var s = a(this.type);
      return X[s] || (X[s] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), s = this.props.ref, s !== void 0 ? s : null;
    }
    function x(s, m, R, A, S, P, G, ne) {
      return R = P.ref, s = {
        $$typeof: b,
        type: s,
        key: m,
        props: P,
        _owner: S
      }, (R !== void 0 ? R : null) !== null ? Object.defineProperty(s, "ref", {
        enumerable: !1,
        get: _
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
        value: G
      }), Object.defineProperty(s, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: ne
      }), Object.freeze && (Object.freeze(s.props), Object.freeze(s)), s;
    }
    function l(s, m, R, A, S, P, G, ne) {
      var F = m.children;
      if (F !== void 0)
        if (A)
          if (z(F)) {
            for (A = 0; A < F.length; A++)
              u(F[A]);
            Object.freeze && Object.freeze(F);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else u(F);
      if ($.call(m, "key")) {
        F = a(s);
        var H = Object.keys(m).filter(function(le) {
          return le !== "key";
        });
        A = 0 < H.length ? "{key: someKey, " + H.join(": ..., ") + ": ...}" : "{key: someKey}", T[F + A] || (H = 0 < H.length ? "{" + H.join(": ..., ") + ": ...}" : "{}", console.error(
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
        ), T[F + A] = !0);
      }
      if (F = null, R !== void 0 && (r(R), F = "" + R), c(m) && (r(m.key), F = "" + m.key), "key" in m) {
        R = {};
        for (var re in m)
          re !== "key" && (R[re] = m[re]);
      } else R = m;
      return F && d(
        R,
        typeof s == "function" ? s.displayName || s.name || "Unknown" : s
      ), x(
        s,
        F,
        P,
        S,
        i(),
        R,
        G,
        ne
      );
    }
    function u(s) {
      typeof s == "object" && s !== null && s.$$typeof === b && s._store && (s._store.validated = 1);
    }
    var p = Le, b = Symbol.for("react.transitional.element"), g = Symbol.for("react.portal"), f = Symbol.for("react.fragment"), N = Symbol.for("react.strict_mode"), E = Symbol.for("react.profiler"), v = Symbol.for("react.consumer"), j = Symbol.for("react.context"), k = Symbol.for("react.forward_ref"), O = Symbol.for("react.suspense"), M = Symbol.for("react.suspense_list"), W = Symbol.for("react.memo"), Y = Symbol.for("react.lazy"), L = Symbol.for("react.activity"), w = Symbol.for("react.client.reference"), C = p.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, $ = Object.prototype.hasOwnProperty, z = Array.isArray, q = console.createTask ? console.createTask : function() {
      return null;
    };
    p = {
      react_stack_bottom_frame: function(s) {
        return s();
      }
    };
    var U, X = {}, Q = p.react_stack_bottom_frame.bind(
      p,
      t
    )(), y = q(o(t)), T = {};
    de.Fragment = f, de.jsx = function(s, m, R, A, S) {
      var P = 1e4 > C.recentlyCreatedOwnerStacks++;
      return l(
        s,
        m,
        R,
        !1,
        A,
        S,
        P ? Error("react-stack-top-frame") : Q,
        P ? q(o(s)) : y
      );
    }, de.jsxs = function(s, m, R, A, S) {
      var P = 1e4 > C.recentlyCreatedOwnerStacks++;
      return l(
        s,
        m,
        R,
        !0,
        A,
        S,
        P ? Error("react-stack-top-frame") : Q,
        P ? q(o(s)) : y
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
  rounded: d = !1,
  onClick: _,
  type: x = "button",
  className: l = "",
  ...u
}) {
  const p = i || r, g = [
    "au-button",
    `au-button--${We.includes(n) ? n : "primary"}`,
    d && "au-button--rounded",
    r && "au-button--loading",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: x,
      onClick: _,
      className: g,
      disabled: p,
      "aria-busy": r ? "true" : void 0,
      ...u,
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
  error: d,
  errormessage: _,
  helperText: x,
  prefixIcon: l,
  suffixIcon: u,
  clearable: p = !1,
  showPasswordToggle: b = !1,
  disabled: g = !1,
  className: f = "",
  name: N,
  ...E
}) {
  const v = ze.includes(r) ? r : "text", j = a ?? N ?? "au-input", k = !!n, [O, M] = B(o ?? i), [W, Y] = B(!1), [L, w] = B(!1), C = o !== void 0, $ = C ? o : O, z = $?.toString().length > 0, q = p && !g && z, U = !!d, X = [
    "au-input",
    k && "au-input--has-label",
    U && "au-input--error",
    g && "au-input--disabled",
    f
  ].filter(Boolean).join(" ");
  V(() => {
    C && M(o);
  }, [o, C]);
  function Q(s) {
    const m = s.target.value;
    C || M(m), t && t(s);
  }
  function y() {
    g || (C || M(""), t && t({
      target: { value: "", name: N },
      currentTarget: { value: "", name: N },
      nativeEvent: null,
      preventDefault: () => {
      },
      stopPropagation: () => {
      }
    }));
  }
  function T() {
    w((s) => !s);
  }
  return /* @__PURE__ */ e.jsxs("div", { className: X, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "au-input__field", children: [
      l ? /* @__PURE__ */ e.jsx("div", { className: "au-input__adornment au-input__adornment--prefix", children: l }) : null,
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: j,
          name: N,
          type: v === "password" && L ? "text" : v,
          value: $,
          onChange: Q,
          placeholder: k ? "" : c || "",
          disabled: g,
          className: "au-input__control",
          "aria-invalid": U ? "true" : "false",
          "aria-describedby": U ? `${j}-error` : x ? `${j}-helper` : void 0,
          onFocus: () => Y(!0),
          onBlur: () => Y(!1),
          ...E
        }
      ),
      n ? /* @__PURE__ */ e.jsx(
        "label",
        {
          className: `au-input__floating-label ${W || z ? "au-input__floating-label--active" : ""}`,
          htmlFor: j,
          children: n
        }
      ) : null,
      q ? /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "au-input__clear",
          onClick: y,
          "aria-label": "Clear input",
          children: "×"
        }
      ) : null,
      b && v === "password" ? /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "au-input__visibility",
          onClick: T,
          "aria-label": L ? "Hide password" : "Show password",
          children: L ? "Hide" : "Show"
        }
      ) : null,
      u ? /* @__PURE__ */ e.jsx("div", { className: "au-input__adornment au-input__adornment--suffix", children: u }) : null
    ] }),
    x && !U ? /* @__PURE__ */ e.jsx("div", { id: j ? `${j}-helper` : void 0, className: "au-input__helper", children: x }) : null,
    U ? /* @__PURE__ */ e.jsx("div", { id: j ? `${j}-error` : void 0, className: "au-input__error", children: d }) : null,
    _ ? /* @__PURE__ */ e.jsx("div", { id: j ? `${j}-error` : void 0, className: "au-input__error", children: _ }) : null
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
  helperText: d,
  maxLength: _,
  autoResize: x = !0,
  charCount: l = !1,
  disabled: u = !1,
  className: p = "",
  name: b,
  ...g
}) {
  const f = r !== void 0, [N, E] = B(r ?? o), v = f ? r : N, j = J(null), k = [
    "au-textarea",
    c && "au-textarea--error",
    u && "au-textarea--disabled",
    p
  ].filter(Boolean).join(" ");
  V(() => {
    f && E(r);
  }, [r, f]), V(() => {
    x && j.current && (j.current.style.height = "auto", j.current.style.height = `${j.current.scrollHeight}px`);
  }, [v, x]);
  function O(W) {
    const Y = W.target.value;
    f || E(Y), i && i(W);
  }
  const M = v?.toString().length ?? 0;
  return /* @__PURE__ */ e.jsxs("div", { className: k, children: [
    n ? /* @__PURE__ */ e.jsx("label", { className: "au-textarea__label", htmlFor: a, children: n }) : null,
    /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: a,
        name: b,
        ref: j,
        className: "au-textarea__control",
        value: v,
        onChange: O,
        placeholder: t,
        maxLength: _,
        disabled: u,
        "aria-invalid": c ? "true" : "false",
        "aria-describedby": c ? `${a}-error` : d ? `${a}-helper` : void 0,
        ...g
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__meta", children: [
      d && !c ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-helper` : void 0, className: "au-textarea__helper", children: d }) : null,
      c ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-error` : void 0, className: "au-textarea__error", children: c }) : null,
      l && _ ? /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__counter", children: [
        M,
        "/",
        _
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
  helperText: d,
  options: _ = [],
  searchable: x = !1,
  multiple: l = !1,
  checkbox: u = !1,
  loading: p = !1,
  asyncText: b = "Loading...",
  disabled: g = !1,
  className: f = "",
  name: N,
  layout: E = "vertical",
  ...v
}) {
  const j = r !== void 0, [k, O] = B(
    o ?? (l ? [] : "")
  ), [M, W] = B(!1), [Y, L] = B(""), w = J(null), C = j ? r : k, $ = ee(() => Ge(_), [_]);
  V(() => {
    j && O(r);
  }, [r, j]), V(() => {
    function y(T) {
      w.current && !w.current.contains(T.target) && W(!1);
    }
    return document.addEventListener("mousedown", y), () => document.removeEventListener("mousedown", y);
  }, []);
  function z(y) {
    j || O(y), i && i({
      target: { value: y, name: N },
      currentTarget: { value: y, name: N }
    });
  }
  function q(y) {
    if (!g)
      if (l) {
        const T = Array.isArray(C) ? [...C] : [], s = T.indexOf(y);
        s >= 0 ? T.splice(s, 1) : T.push(y), z(T);
      } else
        z(y), W(!1);
  }
  const U = ee(() => {
    const y = Y.trim().toLowerCase();
    return y ? $.map((T) => {
      if (T.options) {
        const s = T.options.filter(
          (m) => m.label.toLowerCase().includes(y)
        );
        return { ...T, options: s };
      }
      return T;
    }).filter((T) => T.options ? T.options.length > 0 : T.label.toLowerCase().includes(y)) : $;
  }, [$, Y]), X = ee(() => {
    if (l) {
      if (!Array.isArray(C)) return "";
      const s = [];
      return $.forEach((m) => {
        (m.options ? m.options : [m]).forEach((A) => {
          C.includes(A.value) && s.push(A.label);
        });
      }), s.join(", ");
    }
    const T = $.flatMap((s) => s.options ? s.options : [s]).find((s) => s.value === C);
    return T ? T.label : "";
  }, [C, $, l]), Q = [
    "au-select",
    c && "au-select--error",
    g && "au-select--disabled",
    f,
    E === "horizontal" && "au-select--horizontal"
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: Q, ref: w, children: [
    n ? /* @__PURE__ */ e.jsx("label", { className: "au-select__label", htmlFor: a, children: n }) : null,
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        id: a,
        name: N,
        className: "au-select__control",
        onClick: () => W((y) => !y),
        disabled: g,
        "aria-expanded": M,
        "aria-haspopup": "listbox",
        ...v,
        children: [
          /* @__PURE__ */ e.jsx("span", { className: X ? "au-select__value" : "au-select__placeholder", children: X || t }),
          /* @__PURE__ */ e.jsx("span", { className: "au-select__arrow", children: "▾" })
        ]
      }
    ),
    M ? /* @__PURE__ */ e.jsxs("div", { className: "au-select__menu", children: [
      x ? /* @__PURE__ */ e.jsx("div", { className: "au-select__search", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "search",
          value: Y,
          onChange: (y) => L(y.target.value),
          placeholder: "Search...",
          className: "au-select__search-input",
          autoComplete: "off"
        }
      ) }) : null,
      p ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", children: b }) : U.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", children: "No options" }) : U.map(
        (y, T) => y.options ? /* @__PURE__ */ e.jsxs("div", { className: "au-select__group", children: [
          /* @__PURE__ */ e.jsx("div", { className: "au-select__group-label", children: y.label }),
          y.options.map((s) => {
            const m = l ? Array.isArray(C) && C.includes(s.value) : C === s.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                className: `au-select__item ${m ? "au-select__item--selected" : ""}`,
                onClick: () => q(s.value),
                disabled: s.disabled || g,
                children: [
                  u && l ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", children: m ? "✓" : "" }) : null,
                  /* @__PURE__ */ e.jsx("span", { children: s.label })
                ]
              },
              s.value
            );
          })
        ] }, `group-${T}`) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: `au-select__item ${C === y.value ? "au-select__item--selected" : ""}`,
            onClick: () => q(y.value),
            disabled: y.disabled || g,
            children: [
              u && l ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", children: Array.isArray(C) && C.includes(y.value) ? "✓" : "" }) : null,
              /* @__PURE__ */ e.jsx("span", { children: y.label })
            ]
          },
          y.value
        )
      )
    ] }) : null,
    d && !c ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-helper` : void 0, className: "au-select__helper", children: d }) : null,
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
  name: d,
  className: _ = "",
  ...x
}) {
  function l(u) {
    t || c && c(u);
  }
  return /* @__PURE__ */ e.jsxs(
    "label",
    {
      className: ["au-toggle", t && "au-toggle--disabled", _].filter(Boolean).join(" "),
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
              name: d,
              type: "checkbox",
              checked: r,
              disabled: t,
              onChange: l,
              className: "au-toggle__input",
              ...x
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
  step: d = 1,
  range: _ = !1,
  tooltip: x = !1,
  helperText: l,
  error: u,
  disabled: p = !1,
  className: b = "",
  name: g,
  ...f
}) {
  const N = r !== void 0, E = {
    min: Array.isArray(o) ? o[0] : t,
    max: Array.isArray(o) ? o[1] : c
  }, [v, j] = B(
    _ ? E : o
  ), k = N ? r : v, O = [
    "au-range",
    u && "au-range--error",
    p && "au-range--disabled",
    b
  ].filter(Boolean).join(" ");
  V(() => {
    N && j(r);
  }, [r, N]);
  function M(w) {
    const C = Number(w.target.value);
    N || j(C), i && i({ target: { value: C, name: g }, currentTarget: { value: C, name: g } });
  }
  function W(w) {
    return (C) => {
      const $ = Number(C.target.value), z = {
        min: w === "min" ? $ : k.min,
        max: w === "max" ? $ : k.max
      };
      N || j(z), i && i({ target: { value: z, name: g }, currentTarget: { value: z, name: g } });
    };
  }
  const Y = _ ? null : Number(k ?? o), L = _ ? {
    min: Number(k?.min ?? E.min),
    max: Number(k?.max ?? E.max)
  } : null;
  return /* @__PURE__ */ e.jsxs("div", { className: O, children: [
    n ? /* @__PURE__ */ e.jsx("label", { className: "au-range__label", htmlFor: a, children: n }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-range__field", children: _ ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "au-range__slider-row", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${a}-min`,
            name: g,
            type: "range",
            min: t,
            max: c,
            step: d,
            value: L.min,
            disabled: p,
            onChange: W("min"),
            className: "au-range__input",
            ...f
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
            step: d,
            value: L.max,
            disabled: p,
            onChange: W("max"),
            className: "au-range__input",
            ...f
          }
        )
      ] }),
      x ? /* @__PURE__ */ e.jsxs("div", { className: "au-range__tooltip", children: [
        L.min,
        " — ",
        L.max
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
          step: d,
          value: Y,
          disabled: p,
          onChange: M,
          className: "au-range__input",
          ...f
        }
      ),
      x ? /* @__PURE__ */ e.jsx("div", { className: "au-range__tooltip", children: Y }) : null
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-range__meta", children: [
      l && !u ? /* @__PURE__ */ e.jsx("div", { className: "au-range__helper", children: l }) : null,
      u ? /* @__PURE__ */ e.jsx("div", { className: "au-range__error", children: u }) : null
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
  defaultValue: d = "",
  defaultStartValue: _ = "",
  defaultEndValue: x = "",
  onChange: l,
  placeholder: u = "Select date",
  startPlaceholder: p = "Start date",
  endPlaceholder: b = "End date",
  error: g,
  helperText: f,
  disabled: N = !1,
  className: E = "",
  name: v,
  min: j,
  max: k,
  disableFuture: O = !1,
  disableFutureDates: M = !1,
  disablePast: W = !1,
  disablePastDates: Y = !1,
  ...L
}) {
  const w = o || r === "range", C = w || r === "date", $ = i !== void 0 || t !== void 0 || c !== void 0, z = J(null), [q, U] = B(d), [X, Q] = B(_), [y, T] = B(x), [s, m] = B(!1), [R, A] = B("start"), S = w ? {
    start: t ?? X,
    end: c ?? y
  } : i ?? q, [P, G] = B(() => Re(w, S));
  V(() => {
    $ && !w && i !== void 0 && U(i), $ && w && (t !== void 0 && Q(t), c !== void 0 && T(c));
  }, [$, w, i, t, c]), V(() => {
    function h(D) {
      z.current?.contains(D.target) || m(!1);
    }
    return document.addEventListener("mousedown", h), () => document.removeEventListener("mousedown", h);
  }, []);
  const ne = O || M, F = W || Y, H = ee(() => {
    if (ne) {
      const h = Z(/* @__PURE__ */ new Date());
      return k && k < h ? k : h;
    }
    return k;
  }, [ne, k]), re = ee(() => {
    if (F) {
      const h = Z(/* @__PURE__ */ new Date());
      return j && j > h ? j : h;
    }
    return j;
  }, [F, j]), le = ee(() => te(re), [re]), ie = ee(() => te(H), [H]), Se = ee(() => Xe(P), [P]), De = w ? null : te(S), je = w ? te(S.start) : null, ve = w ? te(S.end) : null, be = L.minYear, Ne = L.maxYear, $e = ee(() => {
    const h = (/* @__PURE__ */ new Date()).getFullYear(), D = le ? le.getFullYear() : be || 1920, I = ie ? ie.getFullYear() : Ne || h + 10, K = [];
    for (let se = I; se >= D; se--)
      K.push(se);
    return K;
  }, [le, ie, be, Ne]);
  function oe(h) {
    return !!(le && h < le || ie && h > ie);
  }
  function Oe(h) {
    const D = h.target.value;
    $ || U(D), l?.(pe(D, v));
  }
  function he(h) {
    $ || (Q(h.start), T(h.end)), l?.(pe(h, v));
  }
  function Ie(h) {
    if (N || oe(h)) return;
    const D = Z(h);
    if (!w) {
      $ || U(D), l?.(pe(D, v)), m(!1);
      return;
    }
    const I = { ...S };
    if (R === "start" || !I.start || I.start && I.end) {
      I.start = D, I.end = "", A("end"), he(I);
      return;
    }
    const K = te(I.start);
    K && h < K ? (I.end = I.start, I.start = D) : I.end = D, A("start"), he(I), m(!1);
  }
  function ce(h) {
    const D = ge(/* @__PURE__ */ new Date(), h);
    if (oe(D)) return;
    const I = Z(D);
    $ || U(I), G(fe(D)), l?.(pe(I, v)), m(!1);
  }
  function xe(h, D) {
    const I = ge(/* @__PURE__ */ new Date(), h), K = ge(/* @__PURE__ */ new Date(), D);
    if (oe(I) || oe(K)) return;
    const se = {
      start: Z(I),
      end: Z(K)
    };
    G(fe(I)), A("start"), he(se), m(!1);
  }
  const Me = [
    "au-datepicker",
    s && "au-datepicker--open",
    g && "au-datepicker--error",
    N && "au-datepicker--disabled",
    E
  ].filter(Boolean).join(" "), ke = a ? g ? `${a}-error` : f ? `${a}-helper` : void 0 : void 0, Be = Je[r] || "date", ye = w ? [ae(S.start), ae(S.end)].filter(Boolean).join(" - ") : ae(S), Fe = w ? Qe(S) : ae(S) || "Choose a date";
  return /* @__PURE__ */ e.jsxs("div", { className: Me, ref: z, children: [
    n && /* @__PURE__ */ e.jsx("label", { className: "au-datepicker__label", htmlFor: a, children: n }),
    C ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          id: a,
          className: "au-datepicker__trigger",
          disabled: N,
          "aria-invalid": g ? "true" : "false",
          "aria-describedby": ke,
          "aria-expanded": s,
          onClick: () => {
            G(Re(w, S)), m((h) => !h);
          },
          ...L,
          children: [
            /* @__PURE__ */ e.jsx("span", { className: ye ? "au-datepicker__value" : "au-datepicker__placeholder", children: ye || (w ? `${p} - ${b}` : u) }),
            /* @__PURE__ */ e.jsx("span", { className: "au-datepicker__icon", "aria-hidden": "true", children: "📅" })
          ]
        }
      ),
      w ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("input", { type: "hidden", name: v ? `${v}Start` : void 0, value: S.start, readOnly: !0 }),
        /* @__PURE__ */ e.jsx("input", { type: "hidden", name: v ? `${v}End` : void 0, value: S.end, readOnly: !0 })
      ] }) : /* @__PURE__ */ e.jsx("input", { type: "hidden", name: v, value: S, readOnly: !0 }),
      s && /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__panel", role: "dialog", "aria-label": n || "Choose date", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__panel-hero", children: [
          /* @__PURE__ */ e.jsx("span", { children: w ? "Date Range" : "Calendar Date" }),
          /* @__PURE__ */ e.jsx("strong", { children: Fe })
        ] }),
        w && /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__range-preview", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: R === "start" ? "is-active" : "",
              onClick: () => A("start"),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: "Start" }),
                /* @__PURE__ */ e.jsx("strong", { children: ae(S.start) || p })
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: R === "end" ? "is-active" : "",
              onClick: () => A("end"),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: "End" }),
                /* @__PURE__ */ e.jsx("strong", { children: ae(S.end) || b })
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
              onClick: () => G((h) => Te(h, -1)),
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
                onChange: (h) => {
                  const D = Number(h.target.value);
                  G(new Date(P.getFullYear(), D, 1));
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
                children: He.map((h, D) => /* @__PURE__ */ e.jsx("option", { value: D, children: h }, h))
              }
            ),
            /* @__PURE__ */ e.jsx(
              "select",
              {
                className: "au-datepicker__year-select",
                value: P.getFullYear(),
                onChange: (h) => {
                  const D = Number(h.target.value);
                  G(new Date(D, P.getMonth(), 1));
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
                children: $e.map((h) => /* @__PURE__ */ e.jsx("option", { value: h, children: h }, h))
              }
            )
          ] }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "au-datepicker__nav-button",
              onClick: () => G((h) => Te(h, 1)),
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
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__weekdays", "aria-hidden": "true", children: qe.map((h) => /* @__PURE__ */ e.jsx("span", { children: h }, h)) }),
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__days", children: Se.map((h) => {
          const D = Z(h), I = h.getMonth() !== P.getMonth(), K = oe(h), se = w ? me(h, je) || me(h, ve) : me(h, De), Pe = w && Ke(h, je, ve);
          return /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: [
                "au-datepicker__day",
                I && "is-muted",
                se && "is-selected",
                Pe && "is-in-range",
                me(h, /* @__PURE__ */ new Date()) && "is-today"
              ].filter(Boolean).join(" "),
              disabled: K,
              onClick: () => Ie(h),
              "aria-pressed": se,
              children: h.getDate()
            },
            D
          );
        }) }),
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__presets", "aria-label": "Quick selections", children: w ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => G(fe(/* @__PURE__ */ new Date())), children: "Today" }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                w ? (he({ start: "", end: "" }), A("start")) : ($ || U(""), l?.(pe("", v)));
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
          name: v,
          type: Be,
          value: S,
          onChange: Oe,
          placeholder: u,
          disabled: N,
          min: re,
          max: H,
          className: "au-datepicker__control",
          "aria-invalid": g ? "true" : "false",
          "aria-describedby": ke,
          ...L
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "au-datepicker__icon", "aria-hidden": "true", children: "📅" })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__meta", children: [
      f && !g && /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-helper` : void 0, className: "au-datepicker__helper", children: f }),
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
  name: d,
  className: _ = "",
  ...x
}) {
  const l = J(null);
  V(() => {
    l.current && (l.current.indeterminate = o);
  }, [o]);
  function u(p) {
    i || t && t(p);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-checkbox", i && "au-checkbox--disabled", _].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: l,
        id: a,
        name: d,
        type: "checkbox",
        checked: r,
        disabled: i,
        onChange: u,
        value: c,
        ...x
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
  name: d,
  ..._
}) {
  function x(l, u) {
    const p = Array.isArray(n) ? [...n] : [], b = p.indexOf(u);
    b >= 0 ? p.splice(b, 1) : p.push(u), r && r({
      target: { value: p, name: d },
      currentTarget: { value: p, name: d }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-checkbox-group", `au-checkbox-group--${t}`, c].filter(Boolean).join(" "), ..._, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__list", children: a.map((l) => /* @__PURE__ */ e.jsx(
      Ze,
      {
        id: `${d}-${l.value}`,
        name: d,
        label: l.label,
        checked: Array.isArray(n) && n.includes(l.value),
        disabled: o || l.disabled,
        onChange: (u) => x(u, l.value),
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
  className: d = "",
  ..._
}) {
  function x(l) {
    o || i && i(l);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-radio", o && "au-radio--disabled", d].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        id: a,
        name: c,
        type: "radio",
        checked: r,
        disabled: o,
        onChange: x,
        value: t,
        ..._
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
  name: d,
  ..._
}) {
  function x(l, u) {
    r && r({
      target: { value: u, name: d },
      currentTarget: { value: u, name: d }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-radio-group", `au-radio-group--${t}`, c].filter(Boolean).join(" "), ..._, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__list", children: a.map((l) => /* @__PURE__ */ e.jsx(
      ea,
      {
        id: `${d}-${l.value}`,
        name: d,
        label: l.label,
        checked: n === l.value,
        disabled: o || l.disabled,
        onChange: (u) => x(u, l.value),
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
  const d = ["au-card", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: d, style: t, ...c, children: [
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
  onConfirm: d,
  showCloseButton: _ = !0,
  size: x = "medium",
  className: l = "",
  ...u
}) {
  const [p, b] = B(a), g = J(null), f = J(null);
  if (V(() => (a && (f.current = document.activeElement, b(!0), document.body.style.overflow = "hidden"), () => {
    document.body.style.overflow = "unset", f.current instanceof HTMLElement && f.current.focus();
  }), [a]), V(() => {
    if (!a && p) {
      const v = setTimeout(() => b(!1), 240);
      return () => clearTimeout(v);
    }
  }, [a, p]), V(() => {
    if (a && g.current) {
      const v = g.current.querySelectorAll(Ae);
      v.length ? v[0].focus() : g.current.focus();
    }
  }, [a]), V(() => {
    function v(j) {
      if (a && (j.key === "Escape" && (j.preventDefault(), n()), j.key === "Tab" && g.current)) {
        const k = Array.from(g.current.querySelectorAll(Ae));
        if (k.length === 0) return;
        const O = k.indexOf(document.activeElement), M = j.shiftKey ? O - 1 : O + 1;
        M >= k.length ? (j.preventDefault(), k[0].focus()) : M < 0 && (j.preventDefault(), k[k.length - 1].focus());
      }
    }
    return document.addEventListener("keydown", v), () => document.removeEventListener("keydown", v);
  }, [a, n]), !p) return null;
  const N = (v) => {
    v.target === v.currentTarget && n();
  }, E = [
    "au-modal",
    `au-modal--${x}`,
    a ? "au-modal--open" : "au-modal--closing",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: "au-modal-overlay", onClick: N, role: "presentation", ...u, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: g,
      className: E,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": r ? "au-modal-title" : void 0,
      tabIndex: -1,
      children: [
        (r || _) && /* @__PURE__ */ e.jsxs("div", { className: "au-modal__header", children: [
          r && /* @__PURE__ */ e.jsx("h2", { id: "au-modal-title", className: "au-modal__title", children: r }),
          _ && /* @__PURE__ */ e.jsx(
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
        i || d ? /* @__PURE__ */ e.jsx("div", { className: "au-modal__footer", children: i || /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
              onClick: d,
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
  ...d
}) {
  const [_, x] = B(!0);
  V(() => {
    if (r > 0) {
      const b = setTimeout(() => {
        x(!1), setTimeout(o, 300);
      }, r);
      return () => clearTimeout(b);
    }
  }, [r, o]);
  const l = () => {
    x(!1), setTimeout(o, 300);
  }, p = [
    "au-toast",
    `au-toast--${aa.includes(n) ? n : "info"}`,
    `au-toast--${i}`,
    !_ && "au-toast--hidden",
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: p, role: "alert", ...d, children: [
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
function va({
  children: a,
  content: n,
  variant: r = "info",
  position: o = "top",
  delay: i = 300,
  showArrow: t = !0,
  className: c = "",
  style: d = {},
  ..._
}) {
  const [x, l] = B(!1), [u, p] = B({ x: 0, y: 0 }), b = J(null), g = J(null), f = J(null), N = sa.includes(r) ? r : "info", E = ta.includes(o) ? o : "top", v = () => {
    f.current && clearTimeout(f.current), f.current = setTimeout(() => {
      if (b.current) {
        const M = b.current.getBoundingClientRect();
        p({
          x: M.left + M.width / 2,
          y: M.top + M.height / 2
        });
      }
      l(!0);
    }, i);
  }, j = () => {
    f.current && clearTimeout(f.current), l(!1);
  };
  V(() => () => {
    f.current && clearTimeout(f.current);
  }, []);
  const k = [
    "au-tooltip",
    `au-tooltip--${N}`,
    `au-tooltip--${E}`,
    t && "au-tooltip--with-arrow",
    c
  ].filter(Boolean).join(" "), O = [
    "au-tooltip-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: b,
        className: O,
        onMouseEnter: v,
        onMouseLeave: j,
        onFocus: v,
        onBlur: j,
        ..._,
        children: a
      }
    ),
    x && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: g,
        className: k,
        style: {
          ...d,
          "--au-tooltip-left": `${u.x}px`,
          "--au-tooltip-top": `${u.y}px`
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
function ba({
  children: a,
  content: n,
  trigger: r = "click",
  position: o = "bottom",
  showArrow: i = !0,
  className: t = "",
  style: c = {},
  ...d
}) {
  const [_, x] = B(!1), [l, u] = B({ x: 0, y: 0 }), p = J(null), b = J(null), g = {
    top: { x: 0, y: -10 },
    bottom: { x: 0, y: 10 },
    left: { x: -10, y: 0 },
    right: { x: 10, y: 0 }
  }, f = () => {
    if (p.current) {
      const k = p.current.getBoundingClientRect(), O = g[o] || g.bottom;
      u({
        x: k.left + k.width / 2 + O.x,
        y: k.top + k.height / 2 + O.y
      });
    }
    x(!_);
  }, N = () => {
    r === "hover" && f();
  }, E = () => {
    r === "hover" && x(!1);
  };
  V(() => {
    const k = (O) => {
      b.current && !b.current.contains(O.target) && p.current && !p.current.contains(O.target) && x(!1);
    };
    return _ && document.addEventListener("mousedown", k), () => {
      document.removeEventListener("mousedown", k);
    };
  }, [_]);
  const v = [
    "au-popover",
    `au-popover--${o}`,
    i && "au-popover--with-arrow",
    t
  ].filter(Boolean).join(" "), j = [
    "au-popover-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: p,
        className: j,
        onClick: r === "click" ? f : void 0,
        onMouseEnter: N,
        onMouseLeave: E,
        ...d,
        children: a
      }
    ),
    _ && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: b,
        className: v,
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
  style: d = {},
  ..._
}) {
  const x = ra.includes(a) ? a : "linear", l = Math.min(Math.max(n / r * 100, 0), 100), u = {
    ...d,
    "--au-progress-width": `${l}%`
  }, p = [
    "au-progress",
    `au-progress--${x}`,
    `au-progress--${o}`,
    `au-progress--${i}`,
    c
  ].filter(Boolean).join(" ");
  if (x === "linear")
    return /* @__PURE__ */ e.jsxs("div", { className: p, style: u, ..._, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-progress__track", children: /* @__PURE__ */ e.jsx("div", { className: "au-progress__bar" }) }),
      t && /* @__PURE__ */ e.jsxs("span", { className: "au-progress__value", children: [
        Math.round(l),
        "%"
      ] })
    ] });
  if (x === "circular") {
    const g = 2 * Math.PI * 20, f = g, N = g - l / 100 * g;
    return /* @__PURE__ */ e.jsxs("div", { className: p, ..._, children: [
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
            strokeDasharray: f,
            strokeDashoffset: N,
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
  return x === "dots" ? /* @__PURE__ */ e.jsx("div", { className: p, ..._, children: /* @__PURE__ */ e.jsxs("div", { className: "au-progress__dots", children: [
    /* @__PURE__ */ e.jsx("span", {}),
    /* @__PURE__ */ e.jsx("span", {}),
    /* @__PURE__ */ e.jsx("span", {})
  ] }) }) : x === "spinner" ? /* @__PURE__ */ e.jsx("div", { className: p, ..._, children: /* @__PURE__ */ e.jsx("div", { className: "au-progress__spinner" }) }) : null;
}
function ka({
  currentPage: a = 1,
  totalPages: n = 1,
  onPageChange: r,
  showPageSize: o = !1,
  pageSize: i = 10,
  pageSizeOptions: t = [10, 25, 50, 100],
  onPageSizeChange: c,
  showJumpToPage: d = !1,
  className: _ = "",
  ...x
}) {
  const l = (f) => {
    f >= 1 && f <= n && f !== a && r(f);
  }, u = (f) => {
    const N = parseInt(f.target.value);
    c(N);
  }, p = (f) => {
    f.preventDefault();
    const N = parseInt(f.target.elements.page.value);
    N >= 1 && N <= n && r(N);
  }, b = () => {
    const f = [];
    if (n <= 5)
      for (let E = 1; E <= n; E++)
        f.push(
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
      f.push(
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: `au-pagination__page ${a === 1 ? "au-pagination__page--active" : ""}`,
            onClick: () => l(1),
            children: "1"
          },
          1
        )
      ), a > 3 && f.push(/* @__PURE__ */ e.jsx("span", { className: "au-pagination__ellipsis", children: "..." }, "start-ellipsis"));
      const E = Math.max(2, a - 1), v = Math.min(n - 1, a + 1);
      for (let j = E; j <= v; j++)
        f.push(
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: `au-pagination__page ${j === a ? "au-pagination__page--active" : ""}`,
              onClick: () => l(j),
              children: j
            },
            j
          )
        );
      a < n - 2 && f.push(/* @__PURE__ */ e.jsx("span", { className: "au-pagination__ellipsis", children: "..." }, "end-ellipsis")), n > 1 && f.push(
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
    return f;
  }, g = [
    "au-pagination",
    _
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: g, ...x, children: [
    o && /* @__PURE__ */ e.jsxs("div", { className: "au-pagination__page-size", children: [
      /* @__PURE__ */ e.jsx("label", { htmlFor: "page-size", children: "Items per page:" }),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "page-size",
          value: i,
          onChange: u,
          children: t.map((f) => /* @__PURE__ */ e.jsx("option", { value: f, children: f }, f))
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
      /* @__PURE__ */ e.jsx("div", { className: "au-pagination__pages", children: b() }),
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
    d && /* @__PURE__ */ e.jsxs("form", { className: "au-pagination__jump", onSubmit: p, children: [
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
  const [c, d] = B(!1), _ = () => {
    d(!c);
  }, x = (u) => {
    u.onClick && u.onClick(), d(!1);
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
        onClick: _,
        "aria-expanded": c,
        "aria-haspopup": "true",
        children: [
          o && /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-icon", children: o }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-label", children: a }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-arrow", children: "▼" })
        ]
      }
    ),
    c && /* @__PURE__ */ e.jsx("div", { className: "au-menu-dropdown__menu", children: n.map((u, p) => u.divider ? /* @__PURE__ */ e.jsx("div", { className: "au-menu__divider" }, p) : /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: `au-menu__item ${u.active ? "au-menu__item--active" : ""}`,
        onClick: () => x(u),
        disabled: u.disabled,
        children: [
          u.icon && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-icon", children: u.icon }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: u.label }),
          u.badge && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-badge", children: u.badge })
        ]
      },
      u.id || p
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
  return /* @__PURE__ */ e.jsx("div", { className: t, ...i, children: a.map((c, d) => {
    const _ = d < n, x = d === n, l = d > n, u = [
      "au-stepper__step",
      _ && "au-stepper__step--completed",
      x && "au-stepper__step--active",
      l && "au-stepper__step--pending"
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: u, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-stepper__indicator", children: _ ? /* @__PURE__ */ e.jsx("span", { className: "au-stepper__check", children: "✓" }) : /* @__PURE__ */ e.jsx("span", { className: "au-stepper__number", children: d + 1 }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "au-stepper__content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "au-stepper__title", children: c.title }),
        c.description && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__description", children: c.description })
      ] }),
      d < a.length - 1 && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__connector" })
    ] }, c.id || d);
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
  onClick: d,
  className: _ = "",
  ...x
}) {
  const l = (b) => {
    b.stopPropagation(), c?.();
  }, u = () => {
    i && d?.();
  }, p = [
    "au-chip",
    `au-chip--${n}`,
    `au-chip--${r}`,
    i && "au-chip--selectable",
    t && "au-chip--selected",
    _
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: p,
      onClick: u,
      role: i ? "button" : void 0,
      tabIndex: i ? 0 : void 0,
      ...x,
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
    const d = [
      "au-timeline__item",
      t.status && `au-timeline__item--${t.status}`
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: d, children: [
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
  const d = (l) => {
    if (n && o) {
      const u = r.includes(l.id);
      let p;
      u ? p = r.filter((b) => b !== l.id) : p = [...r, l.id], o(p);
    }
    l.onClick && l.onClick(l);
  }, _ = (l, u, p = 0) => {
    const b = n && r.includes(l.id), g = [
      "au-list-group__item",
      b && "au-list-group__item--selected",
      l.disabled && "au-list-group__item--disabled",
      `au-list-group__item--level-${p}`
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: g, children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "au-list-group__item-content",
          onClick: () => d(l),
          role: n ? "button" : void 0,
          tabIndex: n ? 0 : void 0,
          children: [
            l.icon && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-icon", children: l.icon }),
            /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__item-text", children: [
              /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-title", children: l.title }),
              l.description && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-description", children: l.description })
            ] }),
            l.badge && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-badge", children: l.badge }),
            n && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-check", children: b ? "✓" : "" })
          ]
        }
      ),
      l.children && l.children.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__children", children: l.children.map((f, N) => _(f, N, p + 1)) })
    ] }, l.id || u);
  }, x = [
    "au-list-group",
    n && "au-list-group--selectable",
    t
  ].filter(Boolean).join(" ");
  return a.length === 0 && i ? /* @__PURE__ */ e.jsx("div", { className: `${x} au-list-group--empty`, ...c, children: /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__empty", children: [
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
  ] }) }) : /* @__PURE__ */ e.jsx("div", { className: x, ...c, children: a.map((l, u) => _(l, u)) });
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
  ba as AUPOPOVER,
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
  va as AUTOOLTIP
};
//# sourceMappingURL=router-engine.es.js.map
