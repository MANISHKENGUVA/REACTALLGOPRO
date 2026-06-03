import Ae, { useState as D, useEffect as U, useRef as H, useMemo as se } from "react";
var de = { exports: {} }, le = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var je;
function Re() {
  if (je) return le;
  je = 1;
  var a = Symbol.for("react.transitional.element"), s = Symbol.for("react.fragment");
  function r(c, i, t) {
    var o = null;
    if (t !== void 0 && (o = "" + t), i.key !== void 0 && (o = "" + i.key), "key" in i) {
      t = {};
      for (var u in i)
        u !== "key" && (t[u] = i[u]);
    } else t = i;
    return i = t.ref, {
      $$typeof: a,
      type: c,
      key: o,
      ref: i !== void 0 ? i : null,
      props: t
    };
  }
  return le.Fragment = s, le.jsx = r, le.jsxs = r, le;
}
var ie = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ve;
function Se() {
  return ve || (ve = 1, process.env.NODE_ENV !== "production" && function() {
    function a(n) {
      if (n == null) return null;
      if (typeof n == "function")
        return n.$$typeof === M ? null : n.displayName || n.name || null;
      if (typeof n == "string") return n;
      switch (n) {
        case p:
          return "Fragment";
        case T:
          return "Profiler";
        case k:
          return "StrictMode";
        case R:
          return "Suspense";
        case b:
          return "SuspenseList";
        case V:
          return "Activity";
      }
      if (typeof n == "object")
        switch (typeof n.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), n.$$typeof) {
          case x:
            return "Portal";
          case g:
            return (n.displayName || "Context") + ".Provider";
          case j:
            return (n._context.displayName || "Context") + ".Consumer";
          case C:
            var m = n.render;
            return n = n.displayName, n || (n = m.displayName || m.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
          case F:
            return m = n.displayName || null, m !== null ? m : a(n.type) || "Memo";
          case S:
            m = n._payload, n = n._init;
            try {
              return a(n(m));
            } catch {
            }
        }
      return null;
    }
    function s(n) {
      return "" + n;
    }
    function r(n) {
      try {
        s(n);
        var m = !1;
      } catch {
        m = !0;
      }
      if (m) {
        m = console;
        var A = m.error, $ = typeof Symbol == "function" && Symbol.toStringTag && n[Symbol.toStringTag] || n.constructor.name || "Object";
        return A.call(
          m,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          $
        ), s(n);
      }
    }
    function c(n) {
      if (n === p) return "<>";
      if (typeof n == "object" && n !== null && n.$$typeof === S)
        return "<...>";
      try {
        var m = a(n);
        return m ? "<" + m + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var n = w.A;
      return n === null ? null : n.getOwner();
    }
    function t() {
      return Error("react-stack-top-frame");
    }
    function o(n) {
      if (B.call(n, "key")) {
        var m = Object.getOwnPropertyDescriptor(n, "key").get;
        if (m && m.isReactWarning) return !1;
      }
      return n.key !== void 0;
    }
    function u(n, m) {
      function A() {
        X || (X = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          m
        ));
      }
      A.isReactWarning = !0, Object.defineProperty(n, "key", {
        get: A,
        configurable: !0
      });
    }
    function _() {
      var n = a(this.type);
      return J[n] || (J[n] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), n = this.props.ref, n !== void 0 ? n : null;
    }
    function h(n, m, A, $, q, W, te, ae) {
      return A = W.ref, n = {
        $$typeof: v,
        type: n,
        key: m,
        props: W,
        _owner: q
      }, (A !== void 0 ? A : null) !== null ? Object.defineProperty(n, "ref", {
        enumerable: !1,
        get: _
      }) : Object.defineProperty(n, "ref", { enumerable: !1, value: null }), n._store = {}, Object.defineProperty(n._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(n, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(n, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: te
      }), Object.defineProperty(n, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: ae
      }), Object.freeze && (Object.freeze(n.props), Object.freeze(n)), n;
    }
    function l(n, m, A, $, q, W, te, ae) {
      var I = m.children;
      if (I !== void 0)
        if ($)
          if (Y(I)) {
            for ($ = 0; $ < I.length; $++)
              d(I[$]);
            Object.freeze && Object.freeze(I);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else d(I);
      if (B.call(m, "key")) {
        I = a(n);
        var z = Object.keys(m).filter(function(ne) {
          return ne !== "key";
        });
        $ = 0 < z.length ? "{key: someKey, " + z.join(": ..., ") + ": ...}" : "{key: someKey}", E[I + $] || (z = 0 < z.length ? "{" + z.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          $,
          I,
          z,
          I
        ), E[I + $] = !0);
      }
      if (I = null, A !== void 0 && (r(A), I = "" + A), o(m) && (r(m.key), I = "" + m.key), "key" in m) {
        A = {};
        for (var re in m)
          re !== "key" && (A[re] = m[re]);
      } else A = m;
      return I && u(
        A,
        typeof n == "function" ? n.displayName || n.name || "Unknown" : n
      ), h(
        n,
        I,
        W,
        q,
        i(),
        A,
        te,
        ae
      );
    }
    function d(n) {
      typeof n == "object" && n !== null && n.$$typeof === v && n._store && (n._store.validated = 1);
    }
    var f = Ae, v = Symbol.for("react.transitional.element"), x = Symbol.for("react.portal"), p = Symbol.for("react.fragment"), k = Symbol.for("react.strict_mode"), T = Symbol.for("react.profiler"), j = Symbol.for("react.consumer"), g = Symbol.for("react.context"), C = Symbol.for("react.forward_ref"), R = Symbol.for("react.suspense"), b = Symbol.for("react.suspense_list"), F = Symbol.for("react.memo"), S = Symbol.for("react.lazy"), V = Symbol.for("react.activity"), M = Symbol.for("react.client.reference"), w = f.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, B = Object.prototype.hasOwnProperty, Y = Array.isArray, L = console.createTask ? console.createTask : function() {
      return null;
    };
    f = {
      react_stack_bottom_frame: function(n) {
        return n();
      }
    };
    var X, J = {}, G = f.react_stack_bottom_frame.bind(
      f,
      t
    )(), y = L(c(t)), E = {};
    ie.Fragment = p, ie.jsx = function(n, m, A, $, q) {
      var W = 1e4 > w.recentlyCreatedOwnerStacks++;
      return l(
        n,
        m,
        A,
        !1,
        $,
        q,
        W ? Error("react-stack-top-frame") : G,
        W ? L(c(n)) : y
      );
    }, ie.jsxs = function(n, m, A, $, q) {
      var W = 1e4 > w.recentlyCreatedOwnerStacks++;
      return l(
        n,
        m,
        A,
        !0,
        $,
        q,
        W ? Error("react-stack-top-frame") : G,
        W ? L(c(n)) : y
      );
    };
  }()), ie;
}
var ge;
function $e() {
  return ge || (ge = 1, process.env.NODE_ENV === "production" ? de.exports = Re() : de.exports = Se()), de.exports;
}
var e = $e();
const Oe = ["primary", "secondary", "outline", "ghost", "danger", "gradient", "link"];
function Ke({
  children: a,
  variant: s = "primary",
  loading: r = !1,
  loadingText: c = "Loading",
  disabled: i = !1,
  leftIcon: t,
  rightIcon: o,
  rounded: u = !1,
  onClick: _,
  type: h = "button",
  className: l = "",
  ...d
}) {
  const f = i || r, x = [
    "au-button",
    `au-button--${Oe.includes(s) ? s : "primary"}`,
    u && "au-button--rounded",
    r && "au-button--loading",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: h,
      onClick: _,
      className: x,
      disabled: f,
      "aria-busy": r ? "true" : void 0,
      ...d,
      children: r ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("span", { className: "au-button__spinner", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "au-button__label", children: c })
      ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        t && /* @__PURE__ */ e.jsx("span", { className: "au-button__icon au-button__icon--left", children: t }),
        /* @__PURE__ */ e.jsx("span", { className: "au-button__label", children: a }),
        o && /* @__PURE__ */ e.jsx("span", { className: "au-button__icon au-button__icon--right", children: o })
      ] })
    }
  );
}
const De = ["text", "password", "email", "number"];
function Qe({
  id: a,
  label: s,
  type: r = "text",
  value: c,
  defaultValue: i = "",
  onChange: t,
  placeholder: o = "",
  error: u,
  helperText: _,
  prefixIcon: h,
  suffixIcon: l,
  clearable: d = !1,
  showPasswordToggle: f = !1,
  disabled: v = !1,
  className: x = "",
  name: p,
  ...k
}) {
  const T = De.includes(r) ? r : "text", j = a ?? p ?? "au-input", g = !!s, [C, R] = D(c ?? i), [b, F] = D(!1), [S, V] = D(!1), M = c !== void 0, w = M ? c : C, B = w?.toString().length > 0, Y = d && !v && B, L = !!u, X = [
    "au-input",
    g && "au-input--has-label",
    L && "au-input--error",
    v && "au-input--disabled",
    x
  ].filter(Boolean).join(" ");
  U(() => {
    M && R(c);
  }, [c, M]);
  function J(E) {
    const n = E.target.value;
    M || R(n), t && t(E);
  }
  function G() {
    v || (M || R(""), t && t({
      target: { value: "", name: p },
      currentTarget: { value: "", name: p },
      nativeEvent: null,
      preventDefault: () => {
      },
      stopPropagation: () => {
      }
    }));
  }
  function y() {
    V((E) => !E);
  }
  return /* @__PURE__ */ e.jsxs("div", { className: X, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "au-input__field", children: [
      h ? /* @__PURE__ */ e.jsx("div", { className: "au-input__adornment au-input__adornment--prefix", children: h }) : null,
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: j,
          name: p,
          type: T === "password" && S ? "text" : T,
          value: w,
          onChange: J,
          placeholder: g ? "" : o || "",
          disabled: v,
          className: "au-input__control",
          "aria-invalid": L ? "true" : "false",
          "aria-describedby": L ? `${j}-error` : _ ? `${j}-helper` : void 0,
          onFocus: () => F(!0),
          onBlur: () => F(!1),
          ...k
        }
      ),
      s ? /* @__PURE__ */ e.jsx(
        "label",
        {
          className: `au-input__floating-label ${b || B ? "au-input__floating-label--active" : ""}`,
          htmlFor: j,
          children: s
        }
      ) : null,
      Y ? /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "au-input__clear",
          onClick: G,
          "aria-label": "Clear input",
          children: "×"
        }
      ) : null,
      f && T === "password" ? /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "au-input__visibility",
          onClick: y,
          "aria-label": S ? "Hide password" : "Show password",
          children: S ? "Hide" : "Show"
        }
      ) : null,
      l ? /* @__PURE__ */ e.jsx("div", { className: "au-input__adornment au-input__adornment--suffix", children: l }) : null
    ] }),
    _ && !L ? /* @__PURE__ */ e.jsx("div", { id: j ? `${j}-helper` : void 0, className: "au-input__helper", children: _ }) : null,
    L ? /* @__PURE__ */ e.jsx("div", { id: j ? `${j}-error` : void 0, className: "au-input__error", children: u }) : null
  ] });
}
function Ze({
  id: a,
  label: s,
  value: r,
  defaultValue: c = "",
  onChange: i,
  placeholder: t = "",
  error: o,
  helperText: u,
  maxLength: _,
  autoResize: h = !0,
  charCount: l = !1,
  disabled: d = !1,
  className: f = "",
  name: v,
  ...x
}) {
  const p = r !== void 0, [k, T] = D(r ?? c), j = p ? r : k, g = H(null), C = [
    "au-textarea",
    o && "au-textarea--error",
    d && "au-textarea--disabled",
    f
  ].filter(Boolean).join(" ");
  U(() => {
    p && T(r);
  }, [r, p]), U(() => {
    h && g.current && (g.current.style.height = "auto", g.current.style.height = `${g.current.scrollHeight}px`);
  }, [j, h]);
  function R(F) {
    const S = F.target.value;
    p || T(S), i && i(F);
  }
  const b = j?.toString().length ?? 0;
  return /* @__PURE__ */ e.jsxs("div", { className: C, children: [
    s ? /* @__PURE__ */ e.jsx("label", { className: "au-textarea__label", htmlFor: a, children: s }) : null,
    /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: a,
        name: v,
        ref: g,
        className: "au-textarea__control",
        value: j,
        onChange: R,
        placeholder: t,
        maxLength: _,
        disabled: d,
        "aria-invalid": o ? "true" : "false",
        "aria-describedby": o ? `${a}-error` : u ? `${a}-helper` : void 0,
        ...x
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__meta", children: [
      u && !o ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-helper` : void 0, className: "au-textarea__helper", children: u }) : null,
      o ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-error` : void 0, className: "au-textarea__error", children: o }) : null,
      l && _ ? /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__counter", children: [
        b,
        "/",
        _
      ] }) : null
    ] })
  ] });
}
function Ie(a) {
  return a.map((s) => s.options ? {
    label: s.label,
    options: s.options.map((r) => ({
      label: r.label,
      value: r.value,
      disabled: r.disabled || !1
    }))
  } : {
    label: s.label,
    value: s.value,
    disabled: s.disabled || !1
  });
}
function ea({
  id: a,
  label: s,
  value: r,
  defaultValue: c,
  onChange: i,
  placeholder: t = "Select...",
  error: o,
  helperText: u,
  options: _ = [],
  searchable: h = !1,
  multiple: l = !1,
  checkbox: d = !1,
  loading: f = !1,
  asyncText: v = "Loading...",
  disabled: x = !1,
  className: p = "",
  name: k,
  layout: T = "vertical",
  ...j
}) {
  const g = r !== void 0, [C, R] = D(
    c ?? (l ? [] : "")
  ), [b, F] = D(!1), [S, V] = D(""), M = H(null), w = g ? r : C, B = se(() => Ie(_), [_]);
  U(() => {
    g && R(r);
  }, [r, g]), U(() => {
    function y(E) {
      M.current && !M.current.contains(E.target) && F(!1);
    }
    return document.addEventListener("mousedown", y), () => document.removeEventListener("mousedown", y);
  }, []);
  function Y(y) {
    g || R(y), i && i({
      target: { value: y, name: k },
      currentTarget: { value: y, name: k }
    });
  }
  function L(y) {
    if (!x)
      if (l) {
        const E = Array.isArray(w) ? [...w] : [], n = E.indexOf(y);
        n >= 0 ? E.splice(n, 1) : E.push(y), Y(E);
      } else
        Y(y), F(!1);
  }
  const X = se(() => {
    const y = S.trim().toLowerCase();
    return y ? B.map((E) => {
      if (E.options) {
        const n = E.options.filter(
          (m) => m.label.toLowerCase().includes(y)
        );
        return { ...E, options: n };
      }
      return E;
    }).filter((E) => E.options ? E.options.length > 0 : E.label.toLowerCase().includes(y)) : B;
  }, [B, S]), J = se(() => {
    if (l) {
      if (!Array.isArray(w)) return "";
      const n = [];
      return B.forEach((m) => {
        (m.options ? m.options : [m]).forEach(($) => {
          w.includes($.value) && n.push($.label);
        });
      }), n.join(", ");
    }
    const E = B.flatMap((n) => n.options ? n.options : [n]).find((n) => n.value === w);
    return E ? E.label : "";
  }, [w, B, l]), G = [
    "au-select",
    o && "au-select--error",
    x && "au-select--disabled",
    p,
    T === "horizontal" && "au-select--horizontal"
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: G, ref: M, children: [
    s ? /* @__PURE__ */ e.jsx("label", { className: "au-select__label", htmlFor: a, children: s }) : null,
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        id: a,
        name: k,
        className: "au-select__control",
        onClick: () => F((y) => !y),
        disabled: x,
        "aria-expanded": b,
        "aria-haspopup": "listbox",
        ...j,
        children: [
          /* @__PURE__ */ e.jsx("span", { className: J ? "au-select__value" : "au-select__placeholder", children: J || t }),
          /* @__PURE__ */ e.jsx("span", { className: "au-select__arrow", children: "▾" })
        ]
      }
    ),
    b ? /* @__PURE__ */ e.jsxs("div", { className: "au-select__menu", children: [
      h ? /* @__PURE__ */ e.jsx("div", { className: "au-select__search", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "search",
          value: S,
          onChange: (y) => V(y.target.value),
          placeholder: "Search...",
          className: "au-select__search-input",
          autoComplete: "off"
        }
      ) }) : null,
      f ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", children: v }) : X.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", children: "No options" }) : X.map(
        (y, E) => y.options ? /* @__PURE__ */ e.jsxs("div", { className: "au-select__group", children: [
          /* @__PURE__ */ e.jsx("div", { className: "au-select__group-label", children: y.label }),
          y.options.map((n) => {
            const m = l ? Array.isArray(w) && w.includes(n.value) : w === n.value;
            return /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                className: `au-select__item ${m ? "au-select__item--selected" : ""}`,
                onClick: () => L(n.value),
                disabled: n.disabled || x,
                children: [
                  d && l ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", children: m ? "✓" : "" }) : null,
                  /* @__PURE__ */ e.jsx("span", { children: n.label })
                ]
              },
              n.value
            );
          })
        ] }, `group-${E}`) : /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            className: `au-select__item ${w === y.value ? "au-select__item--selected" : ""}`,
            onClick: () => L(y.value),
            disabled: y.disabled || x,
            children: [
              d && l ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", children: Array.isArray(w) && w.includes(y.value) ? "✓" : "" }) : null,
              /* @__PURE__ */ e.jsx("span", { children: y.label })
            ]
          },
          y.value
        )
      )
    ] }) : null,
    u && !o ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-helper` : void 0, className: "au-select__helper", children: u }) : null,
    o ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-error` : void 0, className: "au-select__error", children: o }) : null
  ] });
}
function aa({
  id: a,
  label: s,
  checked: r = !1,
  activeLabel: c = "On",
  inactiveLabel: i = "Off",
  disabled: t = !1,
  onChange: o,
  name: u,
  className: _ = "",
  ...h
}) {
  function l(d) {
    t || o && o(d);
  }
  return /* @__PURE__ */ e.jsxs(
    "label",
    {
      className: ["au-toggle", t && "au-toggle--disabled", _].filter(Boolean).join(" "),
      htmlFor: a,
      children: [
        /* @__PURE__ */ e.jsxs("span", { className: "au-toggle__labels", children: [
          s ? /* @__PURE__ */ e.jsx("span", { className: "au-toggle__label", children: s }) : null,
          /* @__PURE__ */ e.jsx("span", { className: "au-toggle__state", children: r ? c : i })
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
              ...h
            }
          ),
          /* @__PURE__ */ e.jsx("span", { className: "au-toggle__slider" })
        ] })
      ]
    }
  );
}
function na({
  id: a,
  label: s,
  value: r,
  defaultValue: c = 0,
  onChange: i,
  min: t = 0,
  max: o = 100,
  step: u = 1,
  range: _ = !1,
  tooltip: h = !1,
  helperText: l,
  error: d,
  disabled: f = !1,
  className: v = "",
  name: x,
  ...p
}) {
  const k = r !== void 0, T = {
    min: Array.isArray(c) ? c[0] : t,
    max: Array.isArray(c) ? c[1] : o
  }, [j, g] = D(
    _ ? T : c
  ), C = k ? r : j, R = [
    "au-range",
    d && "au-range--error",
    f && "au-range--disabled",
    v
  ].filter(Boolean).join(" ");
  U(() => {
    k && g(r);
  }, [r, k]);
  function b(M) {
    const w = Number(M.target.value);
    k || g(w), i && i({ target: { value: w, name: x }, currentTarget: { value: w, name: x } });
  }
  function F(M) {
    return (w) => {
      const B = Number(w.target.value), Y = {
        min: M === "min" ? B : C.min,
        max: M === "max" ? B : C.max
      };
      k || g(Y), i && i({ target: { value: Y, name: x }, currentTarget: { value: Y, name: x } });
    };
  }
  const S = _ ? null : Number(C ?? c), V = _ ? {
    min: Number(C?.min ?? T.min),
    max: Number(C?.max ?? T.max)
  } : null;
  return /* @__PURE__ */ e.jsxs("div", { className: R, children: [
    s ? /* @__PURE__ */ e.jsx("label", { className: "au-range__label", htmlFor: a, children: s }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-range__field", children: _ ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "au-range__slider-row", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${a}-min`,
            name: x,
            type: "range",
            min: t,
            max: o,
            step: u,
            value: V.min,
            disabled: f,
            onChange: F("min"),
            className: "au-range__input",
            ...p
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${a}-max`,
            name: x,
            type: "range",
            min: t,
            max: o,
            step: u,
            value: V.max,
            disabled: f,
            onChange: F("max"),
            className: "au-range__input",
            ...p
          }
        )
      ] }),
      h ? /* @__PURE__ */ e.jsxs("div", { className: "au-range__tooltip", children: [
        V.min,
        " — ",
        V.max
      ] }) : null
    ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: a,
          name: x,
          type: "range",
          min: t,
          max: o,
          step: u,
          value: S,
          disabled: f,
          onChange: b,
          className: "au-range__input",
          ...p
        }
      ),
      h ? /* @__PURE__ */ e.jsx("div", { className: "au-range__tooltip", children: S }) : null
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-range__meta", children: [
      l && !d ? /* @__PURE__ */ e.jsx("div", { className: "au-range__helper", children: l }) : null,
      d ? /* @__PURE__ */ e.jsx("div", { className: "au-range__error", children: d }) : null
    ] })
  ] });
}
const Me = {
  date: "date",
  datetime: "datetime-local",
  time: "time"
}, Pe = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], Be = [
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
function ee(a) {
  if (!(a instanceof Date) || Number.isNaN(a.getTime())) return "";
  const s = a.getFullYear(), r = String(a.getMonth() + 1).padStart(2, "0"), c = String(a.getDate()).padStart(2, "0");
  return `${s}-${r}-${c}`;
}
function Q(a) {
  if (!a) return null;
  const [s, r, c] = a.split("-").map(Number);
  return !s || !r || !c ? null : new Date(s, r - 1, c);
}
function oe(a) {
  return new Date(a.getFullYear(), a.getMonth(), 1);
}
function be(a, s) {
  return new Date(a.getFullYear(), a.getMonth() + s, 1);
}
function he(a, s) {
  const r = new Date(a);
  return r.setDate(a.getDate() + s), r;
}
function pe(a, s) {
  return !!(a && s && ee(a) === ee(s));
}
function Fe(a, s, r) {
  if (!a || !s || !r) return !1;
  const c = a.getTime();
  return c > s.getTime() && c < r.getTime();
}
function Ue(a) {
  const s = oe(a), r = new Date(s);
  return r.setDate(s.getDate() - s.getDay()), Array.from({ length: 42 }, (c, i) => {
    const t = new Date(r);
    return t.setDate(r.getDate() + i), t;
  });
}
function Ne(a, s) {
  const r = a ? s.start || s.end : s;
  return oe(Q(r) || /* @__PURE__ */ new Date());
}
function K(a) {
  const s = Q(a);
  return s ? s.toLocaleDateString(void 0, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) : "";
}
function ce(a, s) {
  return {
    target: { value: a, name: s },
    currentTarget: { value: a, name: s }
  };
}
function Le(a) {
  return a.start && a.end ? `${K(a.start)} - ${K(a.end)}` : a.start ? `${K(a.start)} - Select end` : "Select a start and end date";
}
function sa({
  id: a,
  label: s,
  mode: r = "date",
  range: c = !1,
  value: i,
  startValue: t,
  endValue: o,
  defaultValue: u = "",
  defaultStartValue: _ = "",
  defaultEndValue: h = "",
  onChange: l,
  placeholder: d = "Select date",
  startPlaceholder: f = "Start date",
  endPlaceholder: v = "End date",
  error: x,
  helperText: p,
  disabled: k = !1,
  className: T = "",
  name: j,
  min: g,
  max: C,
  ...R
}) {
  const b = c || r === "range", F = b || r === "date", S = i !== void 0 || t !== void 0 || o !== void 0, V = H(null), [M, w] = D(u), [B, Y] = D(_), [L, X] = D(h), [J, G] = D(!1), [y, E] = D("start"), n = b ? {
    start: t ?? B,
    end: o ?? L
  } : i ?? M, [m, A] = D(() => Ne(b, n));
  U(() => {
    S && !b && i !== void 0 && w(i), S && b && (t !== void 0 && Y(t), o !== void 0 && X(o));
  }, [S, b, i, t, o]), U(() => {
    function N(P) {
      V.current?.contains(P.target) || G(!1);
    }
    return document.addEventListener("mousedown", N), () => document.removeEventListener("mousedown", N);
  }, []);
  const $ = se(() => Q(g), [g]), q = se(() => Q(C), [C]), W = se(() => Ue(m), [m]), te = b ? null : Q(n), ae = b ? Q(n.start) : null, I = b ? Q(n.end) : null;
  function z(N) {
    return !!($ && N < $ || q && N > q);
  }
  function re(N) {
    const P = N.target.value;
    S || w(P), l?.(ce(P, j));
  }
  function ne(N) {
    S || (Y(N.start), X(N.end)), l?.(ce(N, j));
  }
  function ke(N) {
    if (k || z(N)) return;
    const P = ee(N);
    if (!b) {
      S || w(P), l?.(ce(P, j)), G(!1);
      return;
    }
    const O = { ...n };
    if (y === "start" || !O.start || O.start && O.end) {
      O.start = P, O.end = "", E("end"), ne(O);
      return;
    }
    const Z = Q(O.start);
    Z && N < Z ? (O.end = O.start, O.start = P) : O.end = P, E("start"), ne(O), G(!1);
  }
  function fe(N) {
    const P = he(/* @__PURE__ */ new Date(), N);
    if (z(P)) return;
    const O = ee(P);
    S || w(O), A(oe(P)), l?.(ce(O, j)), G(!1);
  }
  function _e(N, P) {
    const O = he(/* @__PURE__ */ new Date(), N), Z = he(/* @__PURE__ */ new Date(), P);
    if (z(O) || z(Z)) return;
    const ue = {
      start: ee(O),
      end: ee(Z)
    };
    A(oe(O)), E("start"), ne(ue), G(!1);
  }
  const Ee = [
    "au-datepicker",
    J && "au-datepicker--open",
    x && "au-datepicker--error",
    k && "au-datepicker--disabled",
    T
  ].filter(Boolean).join(" "), me = a ? x ? `${a}-error` : p ? `${a}-helper` : void 0 : void 0, Ce = Me[r] || "date", xe = b ? [K(n.start), K(n.end)].filter(Boolean).join(" - ") : K(n), Te = b ? Le(n) : K(n) || "Choose a date";
  return /* @__PURE__ */ e.jsxs("div", { className: Ee, ref: V, children: [
    s ? /* @__PURE__ */ e.jsx("label", { className: "au-datepicker__label", htmlFor: a, children: s }) : null,
    F ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          id: a,
          className: "au-datepicker__trigger",
          disabled: k,
          "aria-invalid": x ? "true" : "false",
          "aria-describedby": me,
          "aria-expanded": J,
          onClick: () => {
            A(Ne(b, n)), G((N) => !N);
          },
          ...R,
          children: [
            /* @__PURE__ */ e.jsx("span", { className: xe ? "au-datepicker__value" : "au-datepicker__placeholder", children: xe || (b ? `${f} - ${v}` : d) }),
            /* @__PURE__ */ e.jsx("span", { className: "au-datepicker__icon", "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("span", {}) })
          ]
        }
      ),
      b ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("input", { type: "hidden", name: j ? `${j}Start` : void 0, value: n.start, readOnly: !0 }),
        /* @__PURE__ */ e.jsx("input", { type: "hidden", name: j ? `${j}End` : void 0, value: n.end, readOnly: !0 })
      ] }) : /* @__PURE__ */ e.jsx("input", { type: "hidden", name: j, value: n, readOnly: !0 }),
      J ? /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__panel", role: "dialog", "aria-label": s || "Choose date", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__panel-hero", children: [
          /* @__PURE__ */ e.jsx("span", { children: b ? "Date range" : "Calendar date" }),
          /* @__PURE__ */ e.jsx("strong", { children: Te })
        ] }),
        b ? /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__range-preview", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: y === "start" ? "is-active" : "",
              onClick: () => E("start"),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: "Start" }),
                /* @__PURE__ */ e.jsx("strong", { children: K(n.start) || f })
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: y === "end" ? "is-active" : "",
              onClick: () => E("end"),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: "End" }),
                /* @__PURE__ */ e.jsx("strong", { children: K(n.end) || v })
              ]
            }
          )
        ] }) : null,
        /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__panel-header", children: [
          /* @__PURE__ */ e.jsx("button", { className: "au-datepicker__nav-button", type: "button", onClick: () => A((N) => be(N, -1)), "aria-label": "Previous month", children: "<" }),
          /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__month-title", children: [
            /* @__PURE__ */ e.jsx("strong", { children: Be[m.getMonth()] }),
            /* @__PURE__ */ e.jsx("span", { children: m.getFullYear() })
          ] }),
          /* @__PURE__ */ e.jsx("button", { className: "au-datepicker__nav-button", type: "button", onClick: () => A((N) => be(N, 1)), "aria-label": "Next month", children: ">" })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__weekdays", "aria-hidden": "true", children: Pe.map((N) => /* @__PURE__ */ e.jsx("span", { children: N }, N)) }),
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__days", children: W.map((N) => {
          const P = ee(N), O = N.getMonth() !== m.getMonth(), Z = z(N), ue = b ? pe(N, ae) || pe(N, I) : pe(N, te), we = b && Fe(N, ae, I);
          return /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: [
                "au-datepicker__day",
                O && "is-muted",
                ue && "is-selected",
                we && "is-in-range",
                pe(N, /* @__PURE__ */ new Date()) && "is-today"
              ].filter(Boolean).join(" "),
              disabled: Z,
              onClick: () => ke(N),
              "aria-pressed": ue,
              children: N.getDate()
            },
            P
          );
        }) }),
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__presets", "aria-label": "Quick selections", children: b ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => _e(0, 6), children: "This week" }),
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => _e(7, 13), children: "Next week" }),
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => _e(0, 29), children: "30 days" })
        ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => fe(0), children: "Today" }),
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => fe(1), children: "Tomorrow" }),
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => fe(7), children: "Next week" })
        ] }) }),
        /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => A(oe(/* @__PURE__ */ new Date())), children: "Today" }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                b ? (ne({ start: "", end: "" }), E("start")) : (S || w(""), l?.(ce("", j)));
              },
              children: "Clear"
            }
          )
        ] })
      ] }) : null
    ] }) : /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__native-wrap", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: a,
          name: j,
          type: Ce,
          value: n,
          onChange: re,
          placeholder: d,
          disabled: k,
          min: g,
          max: C,
          className: "au-datepicker__control",
          "aria-invalid": x ? "true" : "false",
          "aria-describedby": me,
          ...R
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "au-datepicker__icon", "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("span", {}) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__meta", children: [
      p && !x ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-helper` : void 0, className: "au-datepicker__helper", children: p }) : null,
      x ? /* @__PURE__ */ e.jsx("div", { id: a ? `${a}-error` : void 0, className: "au-datepicker__error", children: x }) : null
    ] })
  ] });
}
function Ve({
  id: a,
  label: s,
  checked: r = !1,
  indeterminate: c = !1,
  disabled: i = !1,
  onChange: t,
  value: o,
  name: u,
  className: _ = "",
  ...h
}) {
  const l = H(null);
  U(() => {
    l.current && (l.current.indeterminate = c);
  }, [c]);
  function d(f) {
    i || t && t(f);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-checkbox", i && "au-checkbox--disabled", _].filter(Boolean).join(" "), children: [
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
        value: o,
        ...h
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__box", children: r ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__check", children: "✓" }) : c ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__indeterminate", children: "—" }) : null }),
    s ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__label", children: s }) : null
  ] });
}
function ta({
  options: a = [],
  value: s = [],
  onChange: r,
  disabled: c = !1,
  label: i,
  layout: t = "vertical",
  className: o = "",
  name: u,
  ..._
}) {
  function h(l, d) {
    const f = Array.isArray(s) ? [...s] : [], v = f.indexOf(d);
    v >= 0 ? f.splice(v, 1) : f.push(d), r && r({
      target: { value: f, name: u },
      currentTarget: { value: f, name: u }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-checkbox-group", `au-checkbox-group--${t}`, o].filter(Boolean).join(" "), ..._, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__list", children: a.map((l) => /* @__PURE__ */ e.jsx(
      Ve,
      {
        id: `${u}-${l.value}`,
        name: u,
        label: l.label,
        checked: Array.isArray(s) && s.includes(l.value),
        disabled: c || l.disabled,
        onChange: (d) => h(d, l.value),
        value: l.value
      },
      l.value
    )) })
  ] });
}
function Ye({
  id: a,
  label: s,
  checked: r = !1,
  disabled: c = !1,
  onChange: i,
  value: t,
  name: o,
  className: u = "",
  ..._
}) {
  function h(l) {
    c || i && i(l);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-radio", c && "au-radio--disabled", u].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        id: a,
        name: o,
        type: "radio",
        checked: r,
        disabled: c,
        onChange: h,
        value: t,
        ..._
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-radio__circle", children: r ? /* @__PURE__ */ e.jsx("span", { className: "au-radio__dot" }) : null }),
    s ? /* @__PURE__ */ e.jsx("span", { className: "au-radio__label", children: s }) : null
  ] });
}
function ra({
  options: a = [],
  value: s,
  onChange: r,
  disabled: c = !1,
  label: i,
  layout: t = "vertical",
  className: o = "",
  name: u,
  ..._
}) {
  function h(l, d) {
    r && r({
      target: { value: d, name: u },
      currentTarget: { value: d, name: u }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-radio-group", `au-radio-group--${t}`, o].filter(Boolean).join(" "), ..._, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__list", children: a.map((l) => /* @__PURE__ */ e.jsx(
      Ye,
      {
        id: `${u}-${l.value}`,
        name: u,
        label: l.label,
        checked: s === l.value,
        disabled: c || l.disabled,
        onChange: (d) => h(d, l.value),
        value: l.value
      },
      l.value
    )) })
  ] });
}
function la({
  title: a,
  description: s,
  footer: r,
  children: c,
  className: i = "",
  style: t = {},
  ...o
}) {
  const u = ["au-card", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: u, style: t, ...o, children: [
    (a || s) && /* @__PURE__ */ e.jsxs("div", { className: "au-card__header", children: [
      a && /* @__PURE__ */ e.jsx("h2", { className: "au-card__title", children: a }),
      s && /* @__PURE__ */ e.jsx("p", { className: "au-card__description", children: s })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "au-card__body", children: c }),
    r && /* @__PURE__ */ e.jsx("div", { className: "au-card__footer", children: r })
  ] });
}
const ye = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");
function ia({
  isOpen: a,
  onClose: s,
  title: r,
  children: c,
  footer: i,
  confirmText: t = "Confirm",
  cancelText: o = "Cancel",
  onConfirm: u,
  showCloseButton: _ = !0,
  size: h = "medium",
  className: l = "",
  ...d
}) {
  const [f, v] = D(a), x = H(null), p = H(null);
  if (U(() => (a && (p.current = document.activeElement, v(!0), document.body.style.overflow = "hidden"), () => {
    document.body.style.overflow = "unset", p.current instanceof HTMLElement && p.current.focus();
  }), [a]), U(() => {
    if (!a && f) {
      const j = setTimeout(() => v(!1), 240);
      return () => clearTimeout(j);
    }
  }, [a, f]), U(() => {
    if (a && x.current) {
      const j = x.current.querySelectorAll(ye);
      j.length ? j[0].focus() : x.current.focus();
    }
  }, [a]), U(() => {
    function j(g) {
      if (a && (g.key === "Escape" && (g.preventDefault(), s()), g.key === "Tab" && x.current)) {
        const C = Array.from(x.current.querySelectorAll(ye));
        if (C.length === 0) return;
        const R = C.indexOf(document.activeElement), b = g.shiftKey ? R - 1 : R + 1;
        b >= C.length ? (g.preventDefault(), C[0].focus()) : b < 0 && (g.preventDefault(), C[C.length - 1].focus());
      }
    }
    return document.addEventListener("keydown", j), () => document.removeEventListener("keydown", j);
  }, [a, s]), !f) return null;
  const k = (j) => {
    j.target === j.currentTarget && s();
  }, T = [
    "au-modal",
    `au-modal--${h}`,
    a ? "au-modal--open" : "au-modal--closing",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: "au-modal-overlay", onClick: k, role: "presentation", ...d, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: x,
      className: T,
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
              onClick: s,
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
              onClick: s,
              children: o
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
const Ge = ["success", "error", "warning", "info", "alert"];
function We({
  message: a,
  variant: s = "info",
  duration: r = 4e3,
  onClose: c,
  position: i = "top-right",
  showCloseButton: t = !0,
  className: o = "",
  ...u
}) {
  const [_, h] = D(!0);
  U(() => {
    if (r > 0) {
      const v = setTimeout(() => {
        h(!1), setTimeout(c, 300);
      }, r);
      return () => clearTimeout(v);
    }
  }, [r, c]);
  const l = () => {
    h(!1), setTimeout(c, 300);
  }, f = [
    "au-toast",
    `au-toast--${Ge.includes(s) ? s : "info"}`,
    `au-toast--${i}`,
    !_ && "au-toast--hidden",
    o
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
function ca({ toasts: a, position: s = "top-right" }) {
  const r = [
    "au-toast-container",
    `au-toast-container--${s}`
  ].join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: r, children: a.map((c, i) => /* @__PURE__ */ e.jsx(
    We,
    {
      ...c
    },
    c.id || i
  )) });
}
const ze = ["success", "error", "warning", "info"], Je = ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"];
function oa({
  children: a,
  content: s,
  variant: r = "info",
  position: c = "top",
  delay: i = 300,
  showArrow: t = !0,
  className: o = "",
  style: u = {},
  ..._
}) {
  const [h, l] = D(!1), [d, f] = D({ x: 0, y: 0 }), v = H(null), x = H(null), p = H(null), k = ze.includes(r) ? r : "info", T = Je.includes(c) ? c : "top", j = () => {
    p.current && clearTimeout(p.current), p.current = setTimeout(() => {
      if (v.current) {
        const b = v.current.getBoundingClientRect();
        f({
          x: b.left + b.width / 2,
          y: b.top + b.height / 2
        });
      }
      l(!0);
    }, i);
  }, g = () => {
    p.current && clearTimeout(p.current), l(!1);
  };
  U(() => () => {
    p.current && clearTimeout(p.current);
  }, []);
  const C = [
    "au-tooltip",
    `au-tooltip--${k}`,
    `au-tooltip--${T}`,
    t && "au-tooltip--with-arrow",
    o
  ].filter(Boolean).join(" "), R = [
    "au-tooltip-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: v,
        className: R,
        onMouseEnter: j,
        onMouseLeave: g,
        onFocus: j,
        onBlur: g,
        ..._,
        children: a
      }
    ),
    h && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: x,
        className: C,
        style: {
          ...u,
          "--au-tooltip-left": `${d.x}px`,
          "--au-tooltip-top": `${d.y}px`
        },
        role: "tooltip",
        children: [
          s,
          t && /* @__PURE__ */ e.jsx("div", { className: "au-tooltip__arrow" })
        ]
      }
    )
  ] });
}
function ua({
  children: a,
  content: s,
  trigger: r = "click",
  position: c = "bottom",
  showArrow: i = !0,
  className: t = "",
  style: o = {},
  ...u
}) {
  const [_, h] = D(!1), [l, d] = D({ x: 0, y: 0 }), f = H(null), v = H(null), x = {
    top: { x: 0, y: -10 },
    bottom: { x: 0, y: 10 },
    left: { x: -10, y: 0 },
    right: { x: 10, y: 0 }
  }, p = () => {
    if (f.current) {
      const C = f.current.getBoundingClientRect(), R = x[c] || x.bottom;
      d({
        x: C.left + C.width / 2 + R.x,
        y: C.top + C.height / 2 + R.y
      });
    }
    h(!_);
  }, k = () => {
    r === "hover" && p();
  }, T = () => {
    r === "hover" && h(!1);
  };
  U(() => {
    const C = (R) => {
      v.current && !v.current.contains(R.target) && f.current && !f.current.contains(R.target) && h(!1);
    };
    return _ && document.addEventListener("mousedown", C), () => {
      document.removeEventListener("mousedown", C);
    };
  }, [_]);
  const j = [
    "au-popover",
    `au-popover--${c}`,
    i && "au-popover--with-arrow",
    t
  ].filter(Boolean).join(" "), g = [
    "au-popover-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: f,
        className: g,
        onClick: r === "click" ? p : void 0,
        onMouseEnter: k,
        onMouseLeave: T,
        ...u,
        children: a
      }
    ),
    _ && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: v,
        className: j,
        style: {
          ...o,
          "--au-popover-left": `${l.x}px`,
          "--au-popover-top": `${l.y}px`
        },
        role: "dialog",
        children: [
          s,
          i && /* @__PURE__ */ e.jsx("div", { className: "au-popover__arrow" })
        ]
      }
    )
  ] });
}
const qe = ["linear", "circular", "dots", "spinner"];
function da({
  variant: a = "linear",
  value: s = 0,
  max: r = 100,
  size: c = "medium",
  color: i = "primary",
  showValue: t = !1,
  className: o = "",
  style: u = {},
  ..._
}) {
  const h = qe.includes(a) ? a : "linear", l = Math.min(Math.max(s / r * 100, 0), 100), d = {
    ...u,
    "--au-progress-width": `${l}%`
  }, f = [
    "au-progress",
    `au-progress--${h}`,
    `au-progress--${c}`,
    `au-progress--${i}`,
    o
  ].filter(Boolean).join(" ");
  if (h === "linear")
    return /* @__PURE__ */ e.jsxs("div", { className: f, style: d, ..._, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-progress__track", children: /* @__PURE__ */ e.jsx("div", { className: "au-progress__bar" }) }),
      t && /* @__PURE__ */ e.jsxs("span", { className: "au-progress__value", children: [
        Math.round(l),
        "%"
      ] })
    ] });
  if (h === "circular") {
    const x = 2 * Math.PI * 20, p = x, k = x - l / 100 * x;
    return /* @__PURE__ */ e.jsxs("div", { className: f, ..._, children: [
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
  return h === "dots" ? /* @__PURE__ */ e.jsx("div", { className: f, ..._, children: /* @__PURE__ */ e.jsxs("div", { className: "au-progress__dots", children: [
    /* @__PURE__ */ e.jsx("span", {}),
    /* @__PURE__ */ e.jsx("span", {}),
    /* @__PURE__ */ e.jsx("span", {})
  ] }) }) : h === "spinner" ? /* @__PURE__ */ e.jsx("div", { className: f, ..._, children: /* @__PURE__ */ e.jsx("div", { className: "au-progress__spinner" }) }) : null;
}
function pa({
  currentPage: a = 1,
  totalPages: s = 1,
  onPageChange: r,
  showPageSize: c = !1,
  pageSize: i = 10,
  pageSizeOptions: t = [10, 25, 50, 100],
  onPageSizeChange: o,
  showJumpToPage: u = !1,
  className: _ = "",
  ...h
}) {
  const l = (p) => {
    p >= 1 && p <= s && p !== a && r(p);
  }, d = (p) => {
    const k = parseInt(p.target.value);
    o(k);
  }, f = (p) => {
    p.preventDefault();
    const k = parseInt(p.target.elements.page.value);
    k >= 1 && k <= s && r(k);
  }, v = () => {
    const p = [];
    if (s <= 5)
      for (let T = 1; T <= s; T++)
        p.push(
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: `au-pagination__page ${T === a ? "au-pagination__page--active" : ""}`,
              onClick: () => l(T),
              children: T
            },
            T
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
      const T = Math.max(2, a - 1), j = Math.min(s - 1, a + 1);
      for (let g = T; g <= j; g++)
        p.push(
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: `au-pagination__page ${g === a ? "au-pagination__page--active" : ""}`,
              onClick: () => l(g),
              children: g
            },
            g
          )
        );
      a < s - 2 && p.push(/* @__PURE__ */ e.jsx("span", { className: "au-pagination__ellipsis", children: "..." }, "end-ellipsis")), s > 1 && p.push(
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: `au-pagination__page ${s === a ? "au-pagination__page--active" : ""}`,
            onClick: () => l(s),
            children: s
          },
          s
        )
      );
    }
    return p;
  }, x = [
    "au-pagination",
    _
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: x, ...h, children: [
    c && /* @__PURE__ */ e.jsxs("div", { className: "au-pagination__page-size", children: [
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
          disabled: a === s,
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
          max: s,
          defaultValue: a
        }
      ),
      /* @__PURE__ */ e.jsx("button", { type: "submit", children: "Go" })
    ] })
  ] });
}
function fa({
  items: a = [],
  className: s = "",
  ...r
}) {
  const c = [
    "au-menu",
    s
  ].filter(Boolean).join(" "), i = (t, o) => t.divider ? /* @__PURE__ */ e.jsx("div", { className: "au-menu__divider" }, o) : t.checkbox ? /* @__PURE__ */ e.jsxs("label", { className: "au-menu__item au-menu__item--checkbox", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: t.checked || !1,
        onChange: t.onChange
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: t.label })
  ] }, t.id || o) : t.radio ? /* @__PURE__ */ e.jsxs("label", { className: "au-menu__item au-menu__item--radio", children: [
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
  ] }, t.id || o) : t.children ? /* @__PURE__ */ e.jsx(
    He,
    {
      trigger: t.label,
      items: t.children,
      icon: t.icon
    },
    t.id || o
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
    t.id || o
  );
  return /* @__PURE__ */ e.jsx("div", { className: c, ...r, children: a.map(i) });
}
function He({
  trigger: a,
  items: s = [],
  position: r = "bottom-left",
  icon: c,
  className: i = "",
  ...t
}) {
  const [o, u] = D(!1), _ = () => {
    u(!o);
  }, h = (d) => {
    d.onClick && d.onClick(), u(!1);
  }, l = [
    "au-menu-dropdown",
    `au-menu-dropdown--${r}`,
    o && "au-menu-dropdown--open",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: l, ...t, children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: "au-menu-dropdown__trigger",
        onClick: _,
        "aria-expanded": o,
        "aria-haspopup": "true",
        children: [
          c && /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-icon", children: c }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-label", children: a }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-arrow", children: "▼" })
        ]
      }
    ),
    o && /* @__PURE__ */ e.jsx("div", { className: "au-menu-dropdown__menu", children: s.map((d, f) => d.divider ? /* @__PURE__ */ e.jsx("div", { className: "au-menu__divider" }, f) : /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: `au-menu__item ${d.active ? "au-menu__item--active" : ""}`,
        onClick: () => h(d),
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
function _a({
  steps: a = [],
  activeStep: s = 0,
  orientation: r = "horizontal",
  className: c = "",
  ...i
}) {
  const t = [
    "au-stepper",
    `au-stepper--${r}`,
    c
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: t, ...i, children: a.map((o, u) => {
    const _ = u < s, h = u === s, l = u > s, d = [
      "au-stepper__step",
      _ && "au-stepper__step--completed",
      h && "au-stepper__step--active",
      l && "au-stepper__step--pending"
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: d, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-stepper__indicator", children: _ ? /* @__PURE__ */ e.jsx("span", { className: "au-stepper__check", children: "✓" }) : /* @__PURE__ */ e.jsx("span", { className: "au-stepper__number", children: u + 1 }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "au-stepper__content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "au-stepper__title", children: o.title }),
        o.description && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__description", children: o.description })
      ] }),
      u < a.length - 1 && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__connector" })
    ] }, o.id || u);
  }) });
}
function ha({
  children: a,
  variant: s = "default",
  size: r = "medium",
  closable: c = !1,
  selectable: i = !1,
  selected: t = !1,
  onClose: o,
  onClick: u,
  className: _ = "",
  ...h
}) {
  const l = (v) => {
    v.stopPropagation(), o?.();
  }, d = () => {
    i && u?.();
  }, f = [
    "au-chip",
    `au-chip--${s}`,
    `au-chip--${r}`,
    i && "au-chip--selectable",
    t && "au-chip--selected",
    _
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: f,
      onClick: d,
      role: i ? "button" : void 0,
      tabIndex: i ? 0 : void 0,
      ...h,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "au-chip__content", children: a }),
        c && /* @__PURE__ */ e.jsx(
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
function ma({
  items: a = [],
  orientation: s = "vertical",
  className: r = "",
  ...c
}) {
  const i = [
    "au-timeline",
    `au-timeline--${s}`,
    r
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: i, ...c, children: a.map((t, o) => {
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
    ] }, t.id || o);
  }) });
}
function xa({
  items: a = [],
  selectable: s = !1,
  selectedItems: r = [],
  onSelectionChange: c,
  emptyState: i,
  className: t = "",
  ...o
}) {
  const u = (l) => {
    if (s && c) {
      const d = r.includes(l.id);
      let f;
      d ? f = r.filter((v) => v !== l.id) : f = [...r, l.id], c(f);
    }
    l.onClick && l.onClick(l);
  }, _ = (l, d, f = 0) => {
    const v = s && r.includes(l.id), x = [
      "au-list-group__item",
      v && "au-list-group__item--selected",
      l.disabled && "au-list-group__item--disabled",
      `au-list-group__item--level-${f}`
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: x, children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "au-list-group__item-content",
          onClick: () => u(l),
          role: s ? "button" : void 0,
          tabIndex: s ? 0 : void 0,
          children: [
            l.icon && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-icon", children: l.icon }),
            /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__item-text", children: [
              /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-title", children: l.title }),
              l.description && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-description", children: l.description })
            ] }),
            l.badge && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-badge", children: l.badge }),
            s && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-check", children: v ? "✓" : "" })
          ]
        }
      ),
      l.children && l.children.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__children", children: l.children.map((p, k) => _(p, k, f + 1)) })
    ] }, l.id || d);
  }, h = [
    "au-list-group",
    s && "au-list-group--selectable",
    t
  ].filter(Boolean).join(" ");
  return a.length === 0 && i ? /* @__PURE__ */ e.jsx("div", { className: `${h} au-list-group--empty`, ...o, children: /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__empty", children: [
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
  ] }) }) : /* @__PURE__ */ e.jsx("div", { className: h, ...o, children: a.map((l, d) => _(l, d)) });
}
export {
  Ke as AUBUTTON,
  la as AUCARD,
  Ve as AUCHECKBOX,
  ta as AUCHECKBOXGROUP,
  ha as AUCHIP,
  sa as AUDATEPICKER,
  Qe as AUINPUT,
  xa as AULISTGROUP,
  fa as AUMENU,
  He as AUMENUDROPDOWN,
  ia as AUMODAL,
  pa as AUPAGINATION,
  ua as AUPOPOVER,
  da as AUPROGRESS,
  Ye as AURADIO,
  ra as AURADIOGROUP,
  na as AURANGE,
  ea as AUSELECT,
  _a as AUSTEPPER,
  Ze as AUTEXTAREA,
  ma as AUTIMELINE,
  We as AUTOAST,
  ca as AUTOASTCONTAINER,
  aa as AUTOGGLE,
  oa as AUTOOLTIP
};
//# sourceMappingURL=router-engine.es.js.map
