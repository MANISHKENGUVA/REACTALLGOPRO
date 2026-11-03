import Je, { useId as Ce, useState as U, useEffect as z, useRef as ne, useMemo as ce } from "react";
var ke = { exports: {} }, ve = {};
var Ie;
function He() {
  if (Ie) return ve;
  Ie = 1;
  var n = /* @__PURE__ */ Symbol.for("react.transitional.element"), a = /* @__PURE__ */ Symbol.for("react.fragment");
  function t(o, i, r) {
    var u = null;
    if (r !== void 0 && (u = "" + r), i.key !== void 0 && (u = "" + i.key), "key" in i) {
      r = {};
      for (var d in i)
        d !== "key" && (r[d] = i[d]);
    } else r = i;
    return i = r.ref, {
      $$typeof: n,
      type: o,
      key: u,
      ref: i !== void 0 ? i : null,
      props: r
    };
  }
  return ve.Fragment = a, ve.jsx = t, ve.jsxs = t, ve;
}
var je = {};
var Le;
function Xe() {
  return Le || (Le = 1, process.env.NODE_ENV !== "production" && (function() {
    function n(s) {
      if (s == null) return null;
      if (typeof s == "function")
        return s.$$typeof === k ? null : s.displayName || s.name || null;
      if (typeof s == "string") return s;
      switch (s) {
        case w:
          return "Fragment";
        case E:
          return "Profiler";
        case y:
          return "StrictMode";
        case D:
          return "Suspense";
        case B:
          return "SuspenseList";
        case q:
          return "Activity";
        case Y:
          return "ViewTransition";
      }
      if (typeof s == "object")
        switch (typeof s.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), s.$$typeof) {
          case p:
            return "Portal";
          case b:
            return s.displayName || "Context";
          case R:
            return (s._context.displayName || "Context") + ".Consumer";
          case T:
            var v = s.render;
            return s = s.displayName, s || (s = v.displayName || v.name || "", s = s !== "" ? "ForwardRef(" + s + ")" : "ForwardRef"), s;
          case K:
            return v = s.displayName || null, v !== null ? v : n(s.type) || "Memo";
          case F:
            v = s._payload, s = s._init;
            try {
              return n(s(v));
            } catch {
            }
        }
      return null;
    }
    function a(s) {
      return "" + s;
    }
    function t(s) {
      try {
        a(s);
        var v = !1;
      } catch {
        v = !0;
      }
      if (v) {
        v = console;
        var C = v.error, L = typeof Symbol == "function" && Symbol.toStringTag && s[Symbol.toStringTag] || s.constructor.name || "Object";
        return C.call(
          v,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          L
        ), a(s);
      }
    }
    function o(s) {
      if (s === w) return "<>";
      if (typeof s == "object" && s !== null && s.$$typeof === F)
        return "<...>";
      try {
        var v = n(s);
        return v ? "<" + v + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function i() {
      var s = V.A;
      return s === null ? null : s.getOwner();
    }
    function r() {
      return Error("react-stack-top-frame");
    }
    function u(s) {
      if (W.call(s, "key")) {
        var v = Object.getOwnPropertyDescriptor(s, "key").get;
        if (v && v.isReactWarning) return !1;
      }
      return s.key !== void 0;
    }
    function d(s, v) {
      function C() {
        H || (H = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          v
        ));
      }
      C.isReactWarning = !0, Object.defineProperty(s, "key", {
        get: C,
        configurable: !0
      });
    }
    function h() {
      var s = n(this.type);
      return se[s] || (se[s] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), s = this.props.ref, s !== void 0 ? s : null;
    }
    function m(s, v, C, L, X, G) {
      var $ = C.ref;
      return s = {
        $$typeof: x,
        type: s,
        key: v,
        props: C,
        _owner: L
      }, ($ !== void 0 ? $ : null) !== null ? Object.defineProperty(s, "ref", {
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
        value: X
      }), Object.defineProperty(s, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: G
      }), Object.freeze && (Object.freeze(s.props), Object.freeze(s)), s;
    }
    function l(s, v, C, L, X, G) {
      var $ = v.children;
      if ($ !== void 0)
        if (L)
          if (te($)) {
            for (L = 0; L < $.length; L++)
              c($[L]);
            Object.freeze && Object.freeze($);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else c($);
      if (W.call(v, "key")) {
        $ = n(s);
        var Q = Object.keys(v).filter(function(P) {
          return P !== "key";
        });
        L = 0 < Q.length ? "{key: someKey, " + Q.join(": ..., ") + ": ...}" : "{key: someKey}", O[$ + L] || (Q = 0 < Q.length ? "{" + Q.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          L,
          $,
          Q,
          $
        ), O[$ + L] = !0);
      }
      if ($ = null, C !== void 0 && (t(C), $ = "" + C), u(v) && (t(v.key), $ = "" + v.key), "key" in v) {
        C = {};
        for (var ee in v)
          ee !== "key" && (C[ee] = v[ee]);
      } else C = v;
      return $ && d(
        C,
        typeof s == "function" ? s.displayName || s.name || "Unknown" : s
      ), m(
        s,
        $,
        C,
        i(),
        X,
        G
      );
    }
    function c(s) {
      f(s) ? s._store && (s._store.validated = 1) : typeof s == "object" && s !== null && s.$$typeof === F && (s._payload.status === "fulfilled" ? f(s._payload.value) && s._payload.value._store && (s._payload.value._store.validated = 1) : s._store && (s._store.validated = 1));
    }
    function f(s) {
      return typeof s == "object" && s !== null && s.$$typeof === x;
    }
    var N = Je, x = /* @__PURE__ */ Symbol.for("react.transitional.element"), p = /* @__PURE__ */ Symbol.for("react.portal"), w = /* @__PURE__ */ Symbol.for("react.fragment"), y = /* @__PURE__ */ Symbol.for("react.strict_mode"), E = /* @__PURE__ */ Symbol.for("react.profiler"), R = /* @__PURE__ */ Symbol.for("react.consumer"), b = /* @__PURE__ */ Symbol.for("react.context"), T = /* @__PURE__ */ Symbol.for("react.forward_ref"), D = /* @__PURE__ */ Symbol.for("react.suspense"), B = /* @__PURE__ */ Symbol.for("react.suspense_list"), K = /* @__PURE__ */ Symbol.for("react.memo"), F = /* @__PURE__ */ Symbol.for("react.lazy"), q = /* @__PURE__ */ Symbol.for("react.activity"), Y = /* @__PURE__ */ Symbol.for("react.view_transition"), k = /* @__PURE__ */ Symbol.for("react.client.reference"), V = N.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, W = Object.prototype.hasOwnProperty, te = Array.isArray, I = console.createTask ? console.createTask : function() {
      return null;
    };
    N = {
      react_stack_bottom_frame: function(s) {
        return s();
      }
    };
    var H, se = {}, J = N.react_stack_bottom_frame.bind(
      N,
      r
    )(), re = I(o(r)), O = {};
    je.Fragment = w, je.jsx = function(s, v, C) {
      var L = 1e4 > V.recentlyCreatedOwnerStacks++;
      if (L) {
        var X = Error.stackTraceLimit;
        Error.stackTraceLimit = 10;
        var G = Error("react-stack-top-frame");
        Error.stackTraceLimit = X;
      } else G = J;
      return l(
        s,
        v,
        C,
        !1,
        G,
        L ? I(o(s)) : re
      );
    }, je.jsxs = function(s, v, C) {
      var L = 1e4 > V.recentlyCreatedOwnerStacks++;
      if (L) {
        var X = Error.stackTraceLimit;
        Error.stackTraceLimit = 10;
        var G = Error("react-stack-top-frame");
        Error.stackTraceLimit = X;
      } else G = J;
      return l(
        s,
        v,
        C,
        !0,
        G,
        L ? I(o(s)) : re
      );
    };
  })()), je;
}
var Me;
function Qe() {
  return Me || (Me = 1, process.env.NODE_ENV === "production" ? ke.exports = He() : ke.exports = Xe()), ke.exports;
}
var e = Qe();
const Ze = ["primary", "secondary", "outline", "ghost", "danger", "gradient", "link"];
function ba({
  children: n,
  variant: a = "primary",
  loading: t = !1,
  loadingText: o = "Loading",
  disabled: i = !1,
  leftIcon: r,
  rightIcon: u,
  rounded: d = !1,
  onClick: h,
  type: m = "button",
  className: l = "",
  ...c
}) {
  const f = i || t, x = [
    "au-button",
    `au-button--${Ze.includes(a) ? a : "primary"}`,
    d && "au-button--rounded",
    t && "au-button--loading",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx(
    "button",
    {
      type: m,
      onClick: h,
      className: x,
      disabled: f,
      "aria-busy": t ? "true" : void 0,
      ...c,
      children: t ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("span", { className: "au-button__spinner", "aria-hidden": "true" }),
        /* @__PURE__ */ e.jsx("span", { className: "au-button__label", children: o })
      ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        r && /* @__PURE__ */ e.jsx("span", { className: "au-button__icon au-button__icon--left", children: r }),
        /* @__PURE__ */ e.jsx("span", { className: "au-button__label", children: n }),
        u && /* @__PURE__ */ e.jsx("span", { className: "au-button__icon au-button__icon--right", children: u })
      ] })
    }
  );
}
const ea = ["text", "password", "email", "number", "tel", "url", "search"], aa = "This field is required.";
function Na({
  id: n,
  label: a,
  type: t = "text",
  value: o,
  defaultValue: i = "",
  onChange: r,
  placeholder: u = "",
  error: d,
  errormessage: h,
  helperText: m,
  prefixIcon: l,
  suffixIcon: c,
  clearable: f = !1,
  showPasswordToggle: N = !1,
  disabled: x = !1,
  required: p = !1,
  className: w = "",
  name: y,
  ...E
}) {
  const R = ea.includes(t) ? t : "text", b = Ce(), T = n ?? y ?? `au-input-${b.replace(/:/g, "")}`, [D, B] = U(o ?? i), [K, F] = U(!1), q = o !== void 0, Y = q ? o : D, k = Y?.toString().length > 0, V = f && !x && k, W = typeof d == "string" ? d.trim() : "", te = typeof h == "string" && h.trim() || W || (d ? aa : ""), I = !!(d || te), H = [
    "au-input",
    I && "au-input--error",
    x && "au-input--disabled",
    w
  ].filter(Boolean).join(" "), se = I ? `${T}-error` : m ? `${T}-helper` : void 0;
  z(() => {
    q && B(o);
  }, [o, q]);
  function J(s) {
    const v = s.target.value;
    q || B(v), r && r(s);
  }
  function re() {
    x || (q || B(""), r && r({
      target: { value: "", name: y },
      currentTarget: { value: "", name: y },
      nativeEvent: null,
      preventDefault: () => {
      },
      stopPropagation: () => {
      }
    }));
  }
  function O() {
    F((s) => !s);
  }
  return /* @__PURE__ */ e.jsxs("div", { className: H, children: [
    a ? /* @__PURE__ */ e.jsxs("label", { className: "au-input__label", htmlFor: T, children: [
      a,
      p ? /* @__PURE__ */ e.jsx("span", { className: "au-required", "aria-hidden": "true", children: " *" }) : null,
      p ? /* @__PURE__ */ e.jsx("span", { className: "au-visually-hidden", children: " (required)" }) : null
    ] }) : null,
    /* @__PURE__ */ e.jsxs("div", { className: "au-input__field", children: [
      l ? /* @__PURE__ */ e.jsx("div", { className: "au-input__adornment au-input__adornment--prefix", children: l }) : null,
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: T,
          name: y,
          type: R === "password" && K ? "text" : R,
          value: Y,
          onChange: J,
          placeholder: u || "",
          disabled: x,
          required: p,
          className: "au-input__control",
          "aria-invalid": I ? "true" : "false",
          "aria-required": p ? "true" : void 0,
          "aria-describedby": se,
          ...E
        }
      ),
      V ? /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "au-input__clear",
          onClick: re,
          "aria-label": "Clear input",
          children: "×"
        }
      ) : null,
      N && R === "password" ? /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "au-input__visibility",
          onClick: O,
          "aria-label": K ? "Hide password" : "Show password",
          children: K ? "Hide" : "Show"
        }
      ) : null,
      c ? /* @__PURE__ */ e.jsx("div", { className: "au-input__adornment au-input__adornment--suffix", children: c }) : null
    ] }),
    m && !I ? /* @__PURE__ */ e.jsx("div", { id: `${T}-helper`, className: "au-input__helper", children: m }) : null,
    I ? /* @__PURE__ */ e.jsx("div", { id: `${T}-error`, className: "au-input__error", children: te }) : null
  ] });
}
const na = "This field is required.";
function ya({
  id: n,
  label: a,
  value: t,
  defaultValue: o = "",
  onChange: i,
  placeholder: r = "",
  error: u,
  helperText: d,
  maxLength: h,
  autoResize: m = !0,
  charCount: l = !1,
  disabled: c = !1,
  required: f = !1,
  className: N = "",
  name: x,
  ...p
}) {
  const w = Ce(), y = n ?? x ?? `au-textarea-${w.replace(/:/g, "")}`, E = t !== void 0, [R, b] = U(t ?? o), T = E ? t : R, D = ne(null), K = (typeof u == "string" ? u.trim() : "") || (u ? na : ""), F = !!K, q = F ? `${y}-error` : d ? `${y}-helper` : void 0, Y = [
    "au-textarea",
    F && "au-textarea--error",
    c && "au-textarea--disabled",
    N
  ].filter(Boolean).join(" ");
  z(() => {
    E && b(t);
  }, [t, E]), z(() => {
    m && D.current && (D.current.style.height = "auto", D.current.style.height = `${D.current.scrollHeight}px`);
  }, [T, m]);
  function k(W) {
    const te = W.target.value;
    E || b(te), i && i(W);
  }
  const V = T?.toString().length ?? 0;
  return /* @__PURE__ */ e.jsxs("div", { className: Y, children: [
    a ? /* @__PURE__ */ e.jsxs("label", { className: "au-textarea__label", htmlFor: y, children: [
      a,
      f ? /* @__PURE__ */ e.jsx("span", { className: "au-required", "aria-hidden": "true", children: " *" }) : null,
      f ? /* @__PURE__ */ e.jsx("span", { className: "au-visually-hidden", children: " (required)" }) : null
    ] }) : null,
    /* @__PURE__ */ e.jsx(
      "textarea",
      {
        id: y,
        name: x,
        ref: D,
        className: "au-textarea__control",
        value: T,
        onChange: k,
        placeholder: r,
        maxLength: h,
        disabled: c,
        required: f || void 0,
        "aria-invalid": F ? "true" : "false",
        "aria-required": f ? "true" : void 0,
        "aria-describedby": q,
        ...p
      }
    ),
    /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__meta", children: [
      d && !F ? /* @__PURE__ */ e.jsx("div", { id: `${y}-helper`, className: "au-textarea__helper", children: d }) : null,
      F ? /* @__PURE__ */ e.jsx("div", { id: `${y}-error`, className: "au-textarea__error", children: K }) : null,
      l && h ? /* @__PURE__ */ e.jsxs("div", { className: "au-textarea__counter", children: [
        V,
        "/",
        h
      ] }) : null
    ] })
  ] });
}
const sa = "Please select an option.";
function ta(n) {
  return n.map((a) => a.options ? {
    label: a.label,
    options: a.options.map((t) => ({
      label: t.label,
      value: t.value,
      disabled: t.disabled || !1
    }))
  } : {
    label: a.label,
    value: a.value,
    disabled: a.disabled || !1
  });
}
function ra(n) {
  const a = [];
  return n.forEach((t) => {
    t.options ? t.options.forEach((o) => a.push(o)) : a.push(t);
  }), a;
}
function ka({
  id: n,
  label: a,
  value: t,
  defaultValue: o,
  onChange: i,
  placeholder: r = "Select...",
  error: u,
  errormessage: d,
  helperText: h,
  options: m = [],
  searchable: l = !1,
  multiple: c = !1,
  checkbox: f = !1,
  loading: N = !1,
  asyncText: x = "Loading...",
  disabled: p = !1,
  required: w = !1,
  className: y = "",
  name: E,
  layout: R = "vertical",
  ...b
}) {
  const T = t !== void 0, D = Ce(), B = n ?? `au-select-${D.replace(/:/g, "")}`, K = `${B}-label`, F = `${B}-listbox`, [q, Y] = U(
    o ?? (c ? [] : "")
  ), [k, V] = U(!1), [W, te] = U(""), [I, H] = U(-1), se = ne(null), J = ne(null), re = ne(null), O = T ? t : q, s = ce(() => ta(m), [m]), v = ce(() => {
    const j = W.trim().toLowerCase();
    return j ? s.map((g) => {
      if (g.options) {
        const A = g.options.filter(
          (Z) => Z.label.toLowerCase().includes(j)
        );
        return { ...g, options: A };
      }
      return g;
    }).filter((g) => g.options ? g.options.length > 0 : g.label.toLowerCase().includes(j)) : s;
  }, [s, W]), C = ce(() => ra(v), [v]), L = typeof u == "string" ? u.trim() : "", X = typeof d == "string" && d.trim() || L || (u ? sa : ""), G = !!(u || X);
  z(() => {
    T && Y(t);
  }, [t, T]), z(() => {
    function j(g) {
      se.current && !se.current.contains(g.target) && V(!1);
    }
    return document.addEventListener("mousedown", j), () => document.removeEventListener("mousedown", j);
  }, []), z(() => {
    if (!k) return;
    if (l) {
      re.current?.focus();
      return;
    }
    const j = C.findIndex(
      (g) => c ? Array.isArray(O) && O.includes(g.value) : g.value === O
    );
    H(j >= 0 ? j : 0);
  }, [k, l, C, c, O]);
  function $(j) {
    T || Y(j), i && i({
      target: { value: j, name: E },
      currentTarget: { value: j, name: E }
    });
  }
  function Q(j) {
    if (!p)
      if (c) {
        const g = Array.isArray(O) ? [...O] : [], A = g.indexOf(j);
        A >= 0 ? g.splice(A, 1) : g.push(j), $(g);
      } else
        $(j), V(!1), J.current?.focus();
  }
  function ee(j) {
    if (!C.length) return;
    let g = I;
    for (let A = 0; A < C.length; A += 1)
      if (g = (g + j + C.length) % C.length, !C[g].disabled) {
        H(g);
        return;
      }
  }
  function P(j) {
    if (p) return;
    const { key: g } = j;
    if (!k && (g === "ArrowDown" || g === "ArrowUp" || g === "Enter" || g === " ")) {
      j.preventDefault(), V(!0);
      return;
    }
    if (k) {
      if (g === "Escape") {
        j.preventDefault(), V(!1), J.current?.focus();
        return;
      }
      if (g === "Tab") {
        V(!1);
        return;
      }
      if (g === "ArrowDown") {
        j.preventDefault(), ee(1);
        return;
      }
      if (g === "ArrowUp") {
        j.preventDefault(), ee(-1);
        return;
      }
      if (g === "Home") {
        j.preventDefault(), H(C.findIndex((A) => !A.disabled));
        return;
      }
      if (g === "End") {
        j.preventDefault();
        for (let A = C.length - 1; A >= 0; A -= 1)
          if (!C[A].disabled) {
            H(A);
            break;
          }
        return;
      }
      if (g === "Enter" || g === " ") {
        const A = C[I];
        A && !A.disabled && (j.preventDefault(), Q(A.value));
      }
    }
  }
  const le = ce(() => {
    if (c) {
      if (!Array.isArray(O)) return "";
      const A = [];
      return s.forEach((Z) => {
        (Z.options ? Z.options : [Z]).forEach((pe) => {
          O.includes(pe.value) && A.push(pe.label);
        });
      }), A.join(", ");
    }
    const g = s.flatMap((A) => A.options ? A.options : [A]).find((A) => A.value === O);
    return g ? g.label : "";
  }, [O, s, c]), ie = [
    "au-select",
    G && "au-select--error",
    p && "au-select--disabled",
    y,
    R === "horizontal" && "au-select--horizontal"
  ].filter(Boolean).join(" ");
  let ue = -1;
  return /* @__PURE__ */ e.jsxs("div", { className: ie, ref: se, children: [
    a ? /* @__PURE__ */ e.jsx("span", { className: "au-select__label", id: K, children: a }) : null,
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        ref: J,
        id: B,
        name: E,
        className: "au-select__control",
        onClick: () => V((j) => !j),
        onKeyDown: P,
        disabled: p,
        "aria-expanded": k,
        "aria-haspopup": "listbox",
        "aria-controls": k ? F : void 0,
        "aria-labelledby": a ? K : void 0,
        "aria-invalid": G ? "true" : "false",
        "aria-required": w ? "true" : void 0,
        "aria-describedby": G ? `${B}-error` : h ? `${B}-helper` : void 0,
        "aria-activedescendant": k && I >= 0 ? `${B}-option-${I}` : void 0,
        ...b,
        children: [
          /* @__PURE__ */ e.jsx("span", { className: le ? "au-select__value" : "au-select__placeholder", children: le || r }),
          /* @__PURE__ */ e.jsx("span", { className: "au-select__arrow", "aria-hidden": "true", children: "▾" })
        ]
      }
    ),
    k ? /* @__PURE__ */ e.jsxs("div", { className: "au-select__menu", id: F, role: "listbox", "aria-multiselectable": c || void 0, "aria-labelledby": a ? K : void 0, children: [
      l ? /* @__PURE__ */ e.jsx("div", { className: "au-select__search", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          ref: re,
          type: "search",
          value: W,
          onChange: (j) => {
            te(j.target.value), H(0);
          },
          onKeyDown: P,
          placeholder: "Search...",
          className: "au-select__search-input",
          autoComplete: "off",
          "aria-label": "Search options"
        }
      ) }) : null,
      N ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", role: "status", children: x }) : v.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "au-select__empty", role: "status", children: "No options" }) : v.map((j, g) => {
        if (j.options)
          return /* @__PURE__ */ e.jsxs("div", { className: "au-select__group", children: [
            /* @__PURE__ */ e.jsx("div", { className: "au-select__group-label", children: j.label }),
            j.options.map((ae) => {
              ue += 1;
              const pe = ue, me = c ? Array.isArray(O) && O.includes(ae.value) : O === ae.value;
              return /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  id: `${B}-option-${pe}`,
                  role: "option",
                  "aria-selected": me,
                  tabIndex: -1,
                  className: [
                    "au-select__item",
                    me ? "au-select__item--selected" : "",
                    I === pe ? "au-select__item--active" : ""
                  ].filter(Boolean).join(" "),
                  onClick: () => Q(ae.value),
                  onMouseEnter: () => H(pe),
                  disabled: ae.disabled || p,
                  children: [
                    f && c ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", "aria-hidden": "true", children: me ? "✓" : "" }) : null,
                    /* @__PURE__ */ e.jsx("span", { children: ae.label })
                  ]
                },
                ae.value
              );
            })
          ] }, `group-${g}`);
        ue += 1;
        const A = ue, Z = c ? Array.isArray(O) && O.includes(j.value) : O === j.value;
        return /* @__PURE__ */ e.jsxs(
          "button",
          {
            type: "button",
            id: `${B}-option-${A}`,
            role: "option",
            "aria-selected": Z,
            tabIndex: -1,
            className: [
              "au-select__item",
              Z ? "au-select__item--selected" : "",
              I === A ? "au-select__item--active" : ""
            ].filter(Boolean).join(" "),
            onClick: () => Q(j.value),
            onMouseEnter: () => H(A),
            disabled: j.disabled || p,
            children: [
              f && c ? /* @__PURE__ */ e.jsx("span", { className: "au-select__checkbox", "aria-hidden": "true", children: Array.isArray(O) && O.includes(j.value) ? "✓" : "" }) : null,
              /* @__PURE__ */ e.jsx("span", { children: j.label })
            ]
          },
          j.value
        );
      })
    ] }) : null,
    h && !G ? /* @__PURE__ */ e.jsx("div", { id: `${B}-helper`, className: "au-select__helper", children: h }) : null,
    G ? /* @__PURE__ */ e.jsx("div", { id: `${B}-error`, className: "au-select__error", children: X }) : null
  ] });
}
function Ea({
  id: n,
  label: a,
  checked: t = !1,
  activeLabel: o = "On",
  inactiveLabel: i = "Off",
  disabled: r = !1,
  onChange: u,
  name: d,
  className: h = "",
  ...m
}) {
  function l(c) {
    r || u && u(c);
  }
  return /* @__PURE__ */ e.jsxs(
    "label",
    {
      className: ["au-toggle", r && "au-toggle--disabled", h].filter(Boolean).join(" "),
      htmlFor: n,
      children: [
        /* @__PURE__ */ e.jsxs("span", { className: "au-toggle__labels", children: [
          a ? /* @__PURE__ */ e.jsx("span", { className: "au-toggle__label", children: a }) : null,
          /* @__PURE__ */ e.jsx("span", { className: "au-toggle__state", children: t ? o : i })
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "au-toggle__switch", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              id: n,
              name: d,
              type: "checkbox",
              checked: t,
              disabled: r,
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
function Ca({
  id: n,
  label: a,
  value: t,
  defaultValue: o = 0,
  onChange: i,
  min: r = 0,
  max: u = 100,
  step: d = 1,
  range: h = !1,
  tooltip: m = !1,
  helperText: l,
  error: c,
  disabled: f = !1,
  className: N = "",
  name: x,
  ...p
}) {
  const w = t !== void 0, y = {
    min: Array.isArray(o) ? o[0] : r,
    max: Array.isArray(o) ? o[1] : u
  }, [E, R] = U(
    h ? y : o
  ), b = w ? t : E, T = [
    "au-range",
    c && "au-range--error",
    f && "au-range--disabled",
    N
  ].filter(Boolean).join(" ");
  z(() => {
    w && R(t);
  }, [t, w]);
  function D(q) {
    const Y = Number(q.target.value);
    w || R(Y), i && i({ target: { value: Y, name: x }, currentTarget: { value: Y, name: x } });
  }
  function B(q) {
    return (Y) => {
      const k = Number(Y.target.value), V = {
        min: q === "min" ? k : b.min,
        max: q === "max" ? k : b.max
      };
      w || R(V), i && i({ target: { value: V, name: x }, currentTarget: { value: V, name: x } });
    };
  }
  const K = h ? null : Number(b ?? o), F = h ? {
    min: Number(b?.min ?? y.min),
    max: Number(b?.max ?? y.max)
  } : null;
  return /* @__PURE__ */ e.jsxs("div", { className: T, children: [
    a ? /* @__PURE__ */ e.jsx("label", { className: "au-range__label", htmlFor: n, children: a }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-range__field", children: h ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "au-range__slider-row", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${n}-min`,
            name: x,
            type: "range",
            min: r,
            max: u,
            step: d,
            value: F.min,
            disabled: f,
            onChange: B("min"),
            className: "au-range__input",
            ...p
          }
        ),
        /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${n}-max`,
            name: x,
            type: "range",
            min: r,
            max: u,
            step: d,
            value: F.max,
            disabled: f,
            onChange: B("max"),
            className: "au-range__input",
            ...p
          }
        )
      ] }),
      m ? /* @__PURE__ */ e.jsxs("div", { className: "au-range__tooltip", children: [
        F.min,
        " — ",
        F.max
      ] }) : null
    ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: n,
          name: x,
          type: "range",
          min: r,
          max: u,
          step: d,
          value: K,
          disabled: f,
          onChange: D,
          className: "au-range__input",
          ...p
        }
      ),
      m ? /* @__PURE__ */ e.jsx("div", { className: "au-range__tooltip", children: K }) : null
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-range__meta", children: [
      l && !c ? /* @__PURE__ */ e.jsx("div", { className: "au-range__helper", children: l }) : null,
      c ? /* @__PURE__ */ e.jsx("div", { className: "au-range__error", children: c }) : null
    ] })
  ] });
}
const la = {
  date: "date",
  datetime: "datetime-local",
  time: "time"
}, ia = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], oa = [
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
function de(n) {
  if (!(n instanceof Date) || Number.isNaN(n.getTime())) return "";
  const a = n.getFullYear(), t = String(n.getMonth() + 1).padStart(2, "0"), o = String(n.getDate()).padStart(2, "0");
  return `${a}-${t}-${o}`;
}
function _e(n) {
  if (!n) return null;
  const [a, t, o] = n.split("-").map(Number);
  return !a || !t || !o ? null : new Date(a, t - 1, o);
}
function be(n) {
  return new Date(n.getFullYear(), n.getMonth(), 1);
}
function Be(n, a) {
  return new Date(n.getFullYear(), n.getMonth() + a, 1);
}
function Te(n, a) {
  const t = new Date(n);
  return t.setDate(n.getDate() + a), t;
}
function Ee(n, a) {
  return !!(n && a && de(n) === de(a));
}
function ca(n, a, t) {
  if (!n || !a || !t) return !1;
  const o = n.getTime();
  return o > a.getTime() && o < t.getTime();
}
function ua(n) {
  const a = be(n), t = new Date(a);
  return t.setDate(a.getDate() - a.getDay()), Array.from({ length: 42 }, (o, i) => {
    const r = new Date(t);
    return r.setDate(t.getDate() + i), r;
  });
}
function Pe(n, a) {
  const t = n ? a.start || a.end : a;
  return be(_e(t) || /* @__PURE__ */ new Date());
}
function fe(n) {
  const a = _e(n);
  return a ? a.toLocaleDateString(void 0, {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }) : "";
}
function ge(n, a) {
  return {
    target: { value: n, name: a },
    currentTarget: { value: n, name: a }
  };
}
function da(n) {
  return n.start && n.end ? `${fe(n.start)} - ${fe(n.end)}` : n.start ? `${fe(n.start)} - Select end date` : "Select start and end dates";
}
function Fe() {
  return /* @__PURE__ */ e.jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
    /* @__PURE__ */ e.jsx("rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }),
    /* @__PURE__ */ e.jsx("path", { d: "M16 2v4M8 2v4M3 10h18" })
  ] });
}
function wa({
  id: n,
  label: a,
  mode: t = "date",
  range: o = !1,
  value: i,
  startValue: r,
  endValue: u,
  defaultValue: d = "",
  defaultStartValue: h = "",
  defaultEndValue: m = "",
  onChange: l,
  placeholder: c = "Select date",
  startPlaceholder: f = "Start date",
  endPlaceholder: N = "End date",
  error: x,
  errormessage: p,
  helperText: w,
  disabled: y = !1,
  required: E = !1,
  className: R = "",
  name: b,
  min: T,
  max: D,
  disableFuture: B = !1,
  disableFutureDates: K = !1,
  disablePast: F = !1,
  disablePastDates: q = !1,
  ...Y
}) {
  const k = o || t === "range", V = k || t === "date", W = i !== void 0 || r !== void 0 || u !== void 0, te = Ce(), I = n ?? `au-datepicker-${te.replace(/:/g, "")}`, H = typeof x == "string" ? x.trim() : "", se = typeof p == "string" && p.trim() || H || (x ? "Please choose a valid date." : ""), J = !!(x || se), re = ne(null), [O, s] = U(d), [v, C] = U(h), [L, X] = U(m), [G, $] = U(!1), [Q, ee] = U("start"), P = k ? {
    start: r ?? v,
    end: u ?? L
  } : i ?? O, [le, ie] = U(() => Pe(k, P));
  z(() => {
    W && !k && i !== void 0 && s(i), W && k && (r !== void 0 && C(r), u !== void 0 && X(u));
  }, [W, k, i, r, u]), z(() => {
    function _(S) {
      re.current?.contains(S.target) || $(!1);
    }
    return document.addEventListener("mousedown", _), () => document.removeEventListener("mousedown", _);
  }, []);
  const ue = B || K, j = F || q, g = ce(() => {
    if (ue) {
      const _ = de(/* @__PURE__ */ new Date());
      return D && D < _ ? D : _;
    }
    return D;
  }, [ue, D]), A = ce(() => {
    if (j) {
      const _ = de(/* @__PURE__ */ new Date());
      return T && T > _ ? T : _;
    }
    return T;
  }, [j, T]), Z = ce(() => _e(A), [A]), ae = ce(() => _e(g), [g]), pe = ce(() => ua(le), [le]), me = k ? null : _e(P), Ae = k ? _e(P.start) : null, Re = k ? _e(P.end) : null, $e = Y.minYear, De = Y.maxYear, Ye = ce(() => {
    const _ = (/* @__PURE__ */ new Date()).getFullYear(), S = Z ? Z.getFullYear() : $e || 1920, M = ae ? ae.getFullYear() : De || _ + 10, oe = [];
    for (let he = M; he >= S; he--)
      oe.push(he);
    return oe;
  }, [Z, ae, $e, De]);
  function xe(_) {
    return !!(Z && _ < Z || ae && _ > ae);
  }
  function Ve(_) {
    const S = _.target.value;
    W || s(S), l?.(ge(S, b));
  }
  function Ne(_) {
    W || (C(_.start), X(_.end)), l?.(ge(_, b));
  }
  function We(_) {
    if (y || xe(_)) return;
    const S = de(_);
    if (!k) {
      W || s(S), l?.(ge(S, b)), $(!1);
      return;
    }
    const M = { ...P };
    if (Q === "start" || !M.start || M.start && M.end) {
      M.start = S, M.end = "", ee("end"), Ne(M);
      return;
    }
    const oe = _e(M.start);
    oe && _ < oe ? (M.end = M.start, M.start = S) : M.end = S, ee("start"), Ne(M), $(!1);
  }
  function ye(_) {
    const S = Te(/* @__PURE__ */ new Date(), _);
    if (xe(S)) return;
    const M = de(S);
    W || s(M), ie(be(S)), l?.(ge(M, b)), $(!1);
  }
  function we(_, S) {
    const M = Te(/* @__PURE__ */ new Date(), _), oe = Te(/* @__PURE__ */ new Date(), S);
    if (xe(M) || xe(oe)) return;
    const he = {
      start: de(M),
      end: de(oe)
    };
    ie(be(M)), ee("start"), Ne(he), $(!1);
  }
  const Ge = [
    "au-datepicker",
    G && "au-datepicker--open",
    J && "au-datepicker--error",
    y && "au-datepicker--disabled",
    R
  ].filter(Boolean).join(" "), Se = J ? `${I}-error` : w ? `${I}-helper` : void 0, qe = la[t] || "date", Oe = k ? [fe(P.start), fe(P.end)].filter(Boolean).join(" - ") : fe(P), Ke = k ? da(P) : fe(P) || "Choose a date";
  return /* @__PURE__ */ e.jsxs("div", { className: Ge, ref: re, children: [
    a && /* @__PURE__ */ e.jsxs("label", { className: "au-datepicker__label", htmlFor: I, children: [
      a,
      E ? /* @__PURE__ */ e.jsx("span", { className: "au-required", "aria-hidden": "true", children: " *" }) : null,
      E ? /* @__PURE__ */ e.jsx("span", { className: "au-visually-hidden", children: " (required)" }) : null
    ] }),
    V ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          id: I,
          className: "au-datepicker__trigger",
          disabled: y,
          "aria-invalid": J ? "true" : "false",
          "aria-required": E ? "true" : void 0,
          "aria-describedby": Se,
          "aria-expanded": G,
          onClick: () => {
            ie(Pe(k, P)), $((_) => !_);
          },
          ...Y,
          children: [
            /* @__PURE__ */ e.jsx("span", { className: Oe ? "au-datepicker__value" : "au-datepicker__placeholder", children: Oe || (k ? `${f} - ${N}` : c) }),
            /* @__PURE__ */ e.jsx("span", { className: "au-datepicker__icon", children: /* @__PURE__ */ e.jsx(Fe, {}) })
          ]
        }
      ),
      k ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("input", { type: "hidden", name: b ? `${b}Start` : void 0, value: P.start, readOnly: !0 }),
        /* @__PURE__ */ e.jsx("input", { type: "hidden", name: b ? `${b}End` : void 0, value: P.end, readOnly: !0 })
      ] }) : /* @__PURE__ */ e.jsx("input", { type: "hidden", name: b, value: P, readOnly: !0 }),
      G && /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__panel", role: "dialog", "aria-label": a || "Choose date", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__panel-hero", children: [
          /* @__PURE__ */ e.jsx("span", { children: k ? "Date Range" : "Calendar Date" }),
          /* @__PURE__ */ e.jsx("strong", { children: Ke })
        ] }),
        k && /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__range-preview", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: Q === "start" ? "is-active" : "",
              onClick: () => ee("start"),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: "Start" }),
                /* @__PURE__ */ e.jsx("strong", { children: fe(P.start) || f })
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: Q === "end" ? "is-active" : "",
              onClick: () => ee("end"),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: "End" }),
                /* @__PURE__ */ e.jsx("strong", { children: fe(P.end) || N })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__panel-header", children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "au-datepicker__nav-button",
              onClick: () => ie((_) => Be(_, -1)),
              "aria-label": "Previous month",
              children: /* @__PURE__ */ e.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ e.jsx("path", { d: "M15 18l-6-6 6-6" }) })
            }
          ),
          /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__month-title", children: [
            /* @__PURE__ */ e.jsx(
              "select",
              {
                className: "au-datepicker__month-select",
                value: le.getMonth(),
                onChange: (_) => {
                  const S = Number(_.target.value);
                  ie(new Date(le.getFullYear(), S, 1));
                },
                children: oa.map((_, S) => /* @__PURE__ */ e.jsx("option", { value: S, children: _ }, _))
              }
            ),
            /* @__PURE__ */ e.jsx(
              "select",
              {
                className: "au-datepicker__year-select",
                value: le.getFullYear(),
                onChange: (_) => {
                  const S = Number(_.target.value);
                  ie(new Date(S, le.getMonth(), 1));
                },
                children: Ye.map((_) => /* @__PURE__ */ e.jsx("option", { value: _, children: _ }, _))
              }
            )
          ] }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "au-datepicker__nav-button",
              onClick: () => ie((_) => Be(_, 1)),
              "aria-label": "Next month",
              children: /* @__PURE__ */ e.jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ e.jsx("path", { d: "M9 18l6-6-6-6" }) })
            }
          )
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__weekdays", "aria-hidden": "true", children: ia.map((_) => /* @__PURE__ */ e.jsx("span", { children: _ }, _)) }),
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__days", children: pe.map((_) => {
          const S = de(_), M = _.getMonth() !== le.getMonth(), oe = xe(_), he = k ? Ee(_, Ae) || Ee(_, Re) : Ee(_, me), ze = k && ca(_, Ae, Re);
          return /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: [
                "au-datepicker__day",
                M && "is-muted",
                he && "is-selected",
                ze && "is-in-range",
                Ee(_, /* @__PURE__ */ new Date()) && "is-today"
              ].filter(Boolean).join(" "),
              disabled: oe,
              onClick: () => We(_),
              "aria-pressed": he,
              children: _.getDate()
            },
            S
          );
        }) }),
        /* @__PURE__ */ e.jsx("div", { className: "au-datepicker__presets", "aria-label": "Quick selections", children: k ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => we(0, 6), children: "This week" }),
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => we(7, 13), children: "Next week" }),
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => we(0, 29), children: "30 days" })
        ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          !ue && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => ye(1), children: "Tomorrow" }),
            /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => ye(7), children: "Next week" })
          ] }),
          ue && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => ye(-1), children: "Yesterday" }),
            /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => ye(-7), children: "Last week" })
          ] })
        ] }) }),
        /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", onClick: () => ie(be(/* @__PURE__ */ new Date())), children: "Today" }),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                k ? (Ne({ start: "", end: "" }), ee("start")) : (W || s(""), l?.(ge("", b)));
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
          id: I,
          name: b,
          type: qe,
          value: P,
          onChange: Ve,
          placeholder: c,
          disabled: y,
          required: E,
          min: A,
          max: g,
          className: "au-datepicker__control",
          "aria-invalid": J ? "true" : "false",
          "aria-required": E ? "true" : void 0,
          "aria-describedby": Se,
          ...Y
        }
      ),
      /* @__PURE__ */ e.jsx("span", { className: "au-datepicker__icon", children: /* @__PURE__ */ e.jsx(Fe, {}) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-datepicker__meta", children: [
      w && !J && /* @__PURE__ */ e.jsx("div", { id: `${I}-helper`, className: "au-datepicker__helper", children: w }),
      J && /* @__PURE__ */ e.jsx("div", { id: `${I}-error`, className: "au-datepicker__error", children: se })
    ] })
  ] });
}
function fa({
  id: n,
  label: a,
  checked: t = !1,
  indeterminate: o = !1,
  disabled: i = !1,
  onChange: r,
  value: u,
  name: d,
  className: h = "",
  ...m
}) {
  const l = ne(null);
  z(() => {
    l.current && (l.current.indeterminate = o);
  }, [o]);
  function c(f) {
    i || r && r(f);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-checkbox", i && "au-checkbox--disabled", h].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: l,
        id: n,
        name: d,
        type: "checkbox",
        checked: t,
        disabled: i,
        onChange: c,
        value: u,
        ...m
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__box", children: t ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__check", children: "✓" }) : o ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__indeterminate", children: "—" }) : null }),
    a ? /* @__PURE__ */ e.jsx("span", { className: "au-checkbox__label", children: a }) : null
  ] });
}
function Ta({
  options: n = [],
  value: a = [],
  onChange: t,
  disabled: o = !1,
  label: i,
  layout: r = "vertical",
  className: u = "",
  name: d,
  ...h
}) {
  function m(l, c) {
    const f = Array.isArray(a) ? [...a] : [], N = f.indexOf(c);
    N >= 0 ? f.splice(N, 1) : f.push(c), t && t({
      target: { value: f, name: d },
      currentTarget: { value: f, name: d }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-checkbox-group", `au-checkbox-group--${r}`, u].filter(Boolean).join(" "), ...h, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-checkbox-group__list", children: n.map((l) => /* @__PURE__ */ e.jsx(
      fa,
      {
        id: `${d}-${l.value}`,
        name: d,
        label: l.label,
        checked: Array.isArray(a) && a.includes(l.value),
        disabled: o || l.disabled,
        onChange: (c) => m(c, l.value),
        value: l.value
      },
      l.value
    )) })
  ] });
}
function pa({
  id: n,
  label: a,
  checked: t = !1,
  disabled: o = !1,
  onChange: i,
  value: r,
  name: u,
  className: d = "",
  ...h
}) {
  function m(l) {
    o || i && i(l);
  }
  return /* @__PURE__ */ e.jsxs("label", { className: ["au-radio", o && "au-radio--disabled", d].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        id: n,
        name: u,
        type: "radio",
        checked: t,
        disabled: o,
        onChange: m,
        value: r,
        ...h
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-radio__circle", children: t ? /* @__PURE__ */ e.jsx("span", { className: "au-radio__dot" }) : null }),
    a ? /* @__PURE__ */ e.jsx("span", { className: "au-radio__label", children: a }) : null
  ] });
}
function Aa({
  options: n = [],
  value: a,
  onChange: t,
  disabled: o = !1,
  label: i,
  layout: r = "vertical",
  className: u = "",
  name: d,
  ...h
}) {
  function m(l, c) {
    t && t({
      target: { value: c, name: d },
      currentTarget: { value: c, name: d }
    });
  }
  return /* @__PURE__ */ e.jsxs("div", { className: ["au-radio-group", `au-radio-group--${r}`, u].filter(Boolean).join(" "), ...h, children: [
    i ? /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__label", children: i }) : null,
    /* @__PURE__ */ e.jsx("div", { className: "au-radio-group__list", children: n.map((l) => /* @__PURE__ */ e.jsx(
      pa,
      {
        id: `${d}-${l.value}`,
        name: d,
        label: l.label,
        checked: a === l.value,
        disabled: o || l.disabled,
        onChange: (c) => m(c, l.value),
        value: l.value
      },
      l.value
    )) })
  ] });
}
function Ra({
  title: n,
  description: a,
  footer: t,
  children: o,
  className: i = "",
  style: r = {},
  ...u
}) {
  const d = ["au-card", i].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: d, style: r, ...u, children: [
    (n || a) && /* @__PURE__ */ e.jsxs("div", { className: "au-card__header", children: [
      n && /* @__PURE__ */ e.jsx("h2", { className: "au-card__title", children: n }),
      a && /* @__PURE__ */ e.jsx("p", { className: "au-card__description", children: a })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "au-card__body", children: o }),
    t && /* @__PURE__ */ e.jsx("div", { className: "au-card__footer", children: t })
  ] });
}
const Ue = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])"
].join(",");
function $a({
  isOpen: n,
  onClose: a,
  title: t,
  children: o,
  footer: i,
  confirmText: r = "Confirm",
  cancelText: u = "Cancel",
  onConfirm: d,
  showCloseButton: h = !0,
  size: m = "medium",
  className: l = "",
  ...c
}) {
  const [f, N] = U(n), x = ne(null), p = ne(null);
  if (z(() => (n && (p.current = document.activeElement, N(!0), document.body.style.overflow = "hidden"), () => {
    document.body.style.overflow = "unset", p.current instanceof HTMLElement && p.current.focus();
  }), [n]), z(() => {
    if (!n && f) {
      const E = setTimeout(() => N(!1), 240);
      return () => clearTimeout(E);
    }
  }, [n, f]), z(() => {
    if (n && x.current) {
      const E = x.current.querySelectorAll(Ue);
      E.length ? E[0].focus() : x.current.focus();
    }
  }, [n]), z(() => {
    function E(R) {
      if (n && (R.key === "Escape" && (R.preventDefault(), a()), R.key === "Tab" && x.current)) {
        const b = Array.from(x.current.querySelectorAll(Ue));
        if (b.length === 0) return;
        const T = b.indexOf(document.activeElement), D = R.shiftKey ? T - 1 : T + 1;
        D >= b.length ? (R.preventDefault(), b[0].focus()) : D < 0 && (R.preventDefault(), b[b.length - 1].focus());
      }
    }
    return document.addEventListener("keydown", E), () => document.removeEventListener("keydown", E);
  }, [n, a]), !f) return null;
  const w = (E) => {
    E.target === E.currentTarget && a();
  }, y = [
    "au-modal",
    `au-modal--${m}`,
    n ? "au-modal--open" : "au-modal--closing",
    l
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: "au-modal-overlay", onClick: w, role: "presentation", ...c, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      ref: x,
      className: y,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": t ? "au-modal-title" : void 0,
      tabIndex: -1,
      children: [
        (t || h) && /* @__PURE__ */ e.jsxs("div", { className: "au-modal__header", children: [
          t && /* @__PURE__ */ e.jsx("h2", { id: "au-modal-title", className: "au-modal__title", children: t }),
          h && /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "au-modal__close",
              onClick: a,
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
              onClick: a,
              children: u
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "au-button au-button--primary",
              onClick: d,
              children: r
            }
          )
        ] }) }) : null
      ]
    }
  ) });
}
const ha = ["success", "error", "warning", "info", "alert"];
function _a({
  message: n,
  variant: a = "info",
  duration: t = 4e3,
  onClose: o,
  position: i = "top-right",
  showCloseButton: r = !0,
  className: u = "",
  ...d
}) {
  const [h, m] = U(!0);
  z(() => {
    if (t > 0) {
      const N = setTimeout(() => {
        m(!1), setTimeout(o, 300);
      }, t);
      return () => clearTimeout(N);
    }
  }, [t, o]);
  const l = () => {
    m(!1), setTimeout(o, 300);
  }, f = [
    "au-toast",
    `au-toast--${ha.includes(a) ? a : "info"}`,
    `au-toast--${i}`,
    !h && "au-toast--hidden",
    u
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: f, role: "alert", ...d, children: [
    /* @__PURE__ */ e.jsx("div", { className: "au-toast__content", children: n }),
    r && /* @__PURE__ */ e.jsx(
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
function Da({ toasts: n, position: a = "top-right" }) {
  const t = [
    "au-toast-container",
    `au-toast-container--${a}`
  ].join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: t, children: n.map((o, i) => /* @__PURE__ */ e.jsx(
    _a,
    {
      ...o
    },
    o.id || i
  )) });
}
const ma = ["success", "error", "warning", "info"], xa = ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"];
function Sa({
  children: n,
  content: a,
  variant: t = "info",
  position: o = "top",
  delay: i = 300,
  showArrow: r = !0,
  className: u = "",
  style: d = {},
  ...h
}) {
  const [m, l] = U(!1), [c, f] = U({ x: 0, y: 0 }), N = ne(null), x = ne(null), p = ne(null), w = ma.includes(t) ? t : "info", y = xa.includes(o) ? o : "top", E = () => {
    p.current && clearTimeout(p.current), p.current = setTimeout(() => {
      if (N.current) {
        const D = N.current.getBoundingClientRect();
        f({
          x: D.left + D.width / 2,
          y: D.top + D.height / 2
        });
      }
      l(!0);
    }, i);
  }, R = () => {
    p.current && clearTimeout(p.current), l(!1);
  };
  z(() => () => {
    p.current && clearTimeout(p.current);
  }, []);
  const b = [
    "au-tooltip",
    `au-tooltip--${w}`,
    `au-tooltip--${y}`,
    r && "au-tooltip--with-arrow",
    u
  ].filter(Boolean).join(" "), T = [
    "au-tooltip-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: N,
        className: T,
        onMouseEnter: E,
        onMouseLeave: R,
        onFocus: E,
        onBlur: R,
        ...h,
        children: n
      }
    ),
    m && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: x,
        className: b,
        style: {
          ...d,
          "--au-tooltip-left": `${c.x}px`,
          "--au-tooltip-top": `${c.y}px`
        },
        role: "tooltip",
        children: [
          a,
          r && /* @__PURE__ */ e.jsx("div", { className: "au-tooltip__arrow" })
        ]
      }
    )
  ] });
}
function Oa({
  children: n,
  content: a,
  trigger: t = "click",
  position: o = "bottom",
  showArrow: i = !0,
  className: r = "",
  style: u = {},
  ...d
}) {
  const [h, m] = U(!1), [l, c] = U({ x: 0, y: 0 }), f = ne(null), N = ne(null), x = {
    top: { x: 0, y: -10 },
    bottom: { x: 0, y: 10 },
    left: { x: -10, y: 0 },
    right: { x: 10, y: 0 }
  }, p = () => {
    if (f.current) {
      const b = f.current.getBoundingClientRect(), T = x[o] || x.bottom;
      c({
        x: b.left + b.width / 2 + T.x,
        y: b.top + b.height / 2 + T.y
      });
    }
    m(!h);
  }, w = () => {
    t === "hover" && p();
  }, y = () => {
    t === "hover" && m(!1);
  };
  z(() => {
    const b = (T) => {
      N.current && !N.current.contains(T.target) && f.current && !f.current.contains(T.target) && m(!1);
    };
    return h && document.addEventListener("mousedown", b), () => {
      document.removeEventListener("mousedown", b);
    };
  }, [h]);
  const E = [
    "au-popover",
    `au-popover--${o}`,
    i && "au-popover--with-arrow",
    r
  ].filter(Boolean).join(" "), R = [
    "au-popover-trigger"
  ].join(" ");
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(
      "span",
      {
        ref: f,
        className: R,
        onClick: t === "click" ? p : void 0,
        onMouseEnter: w,
        onMouseLeave: y,
        ...d,
        children: n
      }
    ),
    h && /* @__PURE__ */ e.jsxs(
      "div",
      {
        ref: N,
        className: E,
        style: {
          ...u,
          "--au-popover-left": `${l.x}px`,
          "--au-popover-top": `${l.y}px`
        },
        role: "dialog",
        children: [
          a,
          i && /* @__PURE__ */ e.jsx("div", { className: "au-popover__arrow" })
        ]
      }
    )
  ] });
}
const va = ["linear", "circular", "dots", "spinner"];
function Ia({
  variant: n = "linear",
  value: a = 0,
  max: t = 100,
  size: o = "medium",
  color: i = "primary",
  showValue: r = !1,
  className: u = "",
  style: d = {},
  ...h
}) {
  const m = va.includes(n) ? n : "linear", l = Math.min(Math.max(a / t * 100, 0), 100), c = {
    ...d,
    "--au-progress-width": `${l}%`
  }, f = [
    "au-progress",
    `au-progress--${m}`,
    `au-progress--${o}`,
    `au-progress--${i}`,
    u
  ].filter(Boolean).join(" ");
  if (m === "linear")
    return /* @__PURE__ */ e.jsxs("div", { className: f, style: c, ...h, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-progress__track", children: /* @__PURE__ */ e.jsx("div", { className: "au-progress__bar" }) }),
      r && /* @__PURE__ */ e.jsxs("span", { className: "au-progress__value", children: [
        Math.round(l),
        "%"
      ] })
    ] });
  if (m === "circular") {
    const x = 2 * Math.PI * 20, p = x, w = x - l / 100 * x;
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
            strokeDashoffset: w,
            transform: "rotate(-90 25 25)"
          }
        )
      ] }),
      r && /* @__PURE__ */ e.jsxs("span", { className: "au-progress__value", children: [
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
function La({
  currentPage: n = 1,
  totalPages: a = 1,
  onPageChange: t,
  showPageSize: o = !1,
  pageSize: i = 10,
  pageSizeOptions: r = [10, 25, 50, 100],
  onPageSizeChange: u,
  showJumpToPage: d = !1,
  className: h = "",
  ...m
}) {
  const l = (p) => {
    p >= 1 && p <= a && p !== n && t(p);
  }, c = (p) => {
    const w = parseInt(p.target.value);
    u(w);
  }, f = (p) => {
    p.preventDefault();
    const w = parseInt(p.target.elements.page.value);
    w >= 1 && w <= a && t(w);
  }, N = () => {
    const p = [];
    if (a <= 5)
      for (let y = 1; y <= a; y++)
        p.push(
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: `au-pagination__page ${y === n ? "au-pagination__page--active" : ""}`,
              onClick: () => l(y),
              children: y
            },
            y
          )
        );
    else {
      p.push(
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: `au-pagination__page ${n === 1 ? "au-pagination__page--active" : ""}`,
            onClick: () => l(1),
            children: "1"
          },
          1
        )
      ), n > 3 && p.push(/* @__PURE__ */ e.jsx("span", { className: "au-pagination__ellipsis", children: "..." }, "start-ellipsis"));
      const y = Math.max(2, n - 1), E = Math.min(a - 1, n + 1);
      for (let R = y; R <= E; R++)
        p.push(
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: `au-pagination__page ${R === n ? "au-pagination__page--active" : ""}`,
              onClick: () => l(R),
              children: R
            },
            R
          )
        );
      n < a - 2 && p.push(/* @__PURE__ */ e.jsx("span", { className: "au-pagination__ellipsis", children: "..." }, "end-ellipsis")), a > 1 && p.push(
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: `au-pagination__page ${a === n ? "au-pagination__page--active" : ""}`,
            onClick: () => l(a),
            children: a
          },
          a
        )
      );
    }
    return p;
  }, x = [
    "au-pagination",
    h
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: x, ...m, children: [
    o && /* @__PURE__ */ e.jsxs("div", { className: "au-pagination__page-size", children: [
      /* @__PURE__ */ e.jsx("label", { htmlFor: "page-size", children: "Items per page:" }),
      /* @__PURE__ */ e.jsx(
        "select",
        {
          id: "page-size",
          value: i,
          onChange: c,
          children: r.map((p) => /* @__PURE__ */ e.jsx("option", { value: p, children: p }, p))
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "au-pagination__controls", children: [
      /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "au-pagination__nav au-pagination__nav--prev",
          onClick: () => l(n - 1),
          disabled: n === 1,
          children: "Previous"
        }
      ),
      /* @__PURE__ */ e.jsx("div", { className: "au-pagination__pages", children: N() }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "au-pagination__nav au-pagination__nav--next",
          onClick: () => l(n + 1),
          disabled: n === a,
          children: "Next"
        }
      )
    ] }),
    d && /* @__PURE__ */ e.jsxs("form", { className: "au-pagination__jump", onSubmit: f, children: [
      /* @__PURE__ */ e.jsx("label", { htmlFor: "jump-page", children: "Go to page:" }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          id: "jump-page",
          name: "page",
          type: "number",
          min: "1",
          max: a,
          defaultValue: n
        }
      ),
      /* @__PURE__ */ e.jsx("button", { type: "submit", children: "Go" })
    ] })
  ] });
}
function Ma({
  items: n = [],
  className: a = "",
  ...t
}) {
  const o = [
    "au-menu",
    a
  ].filter(Boolean).join(" "), i = (r, u) => r.divider ? /* @__PURE__ */ e.jsx("div", { className: "au-menu__divider" }, u) : r.checkbox ? /* @__PURE__ */ e.jsxs("label", { className: "au-menu__item au-menu__item--checkbox", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "checkbox",
        checked: r.checked || !1,
        onChange: r.onChange
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: r.label })
  ] }, r.id || u) : r.radio ? /* @__PURE__ */ e.jsxs("label", { className: "au-menu__item au-menu__item--radio", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        type: "radio",
        name: r.name,
        value: r.value,
        checked: r.checked || !1,
        onChange: r.onChange
      }
    ),
    /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: r.label })
  ] }, r.id || u) : r.children ? /* @__PURE__ */ e.jsx(
    ja,
    {
      trigger: r.label,
      items: r.children,
      icon: r.icon
    },
    r.id || u
  ) : /* @__PURE__ */ e.jsxs(
    "button",
    {
      className: `au-menu__item ${r.active ? "au-menu__item--active" : ""}`,
      onClick: r.onClick,
      disabled: r.disabled,
      children: [
        r.icon && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-icon", children: r.icon }),
        /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: r.label }),
        r.badge && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-badge", children: r.badge })
      ]
    },
    r.id || u
  );
  return /* @__PURE__ */ e.jsx("div", { className: o, ...t, children: n.map(i) });
}
function ja({
  trigger: n,
  items: a = [],
  position: t = "bottom-left",
  icon: o,
  className: i = "",
  ...r
}) {
  const [u, d] = U(!1), h = () => {
    d(!u);
  }, m = (c) => {
    c.onClick && c.onClick(), d(!1);
  }, l = [
    "au-menu-dropdown",
    `au-menu-dropdown--${t}`,
    u && "au-menu-dropdown--open",
    i
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs("div", { className: l, ...r, children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: "au-menu-dropdown__trigger",
        onClick: h,
        "aria-expanded": u,
        "aria-haspopup": "true",
        children: [
          o && /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-icon", children: o }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-label", children: n }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu-dropdown__trigger-arrow", children: "▼" })
        ]
      }
    ),
    u && /* @__PURE__ */ e.jsx("div", { className: "au-menu-dropdown__menu", children: a.map((c, f) => c.divider ? /* @__PURE__ */ e.jsx("div", { className: "au-menu__divider" }, f) : /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: `au-menu__item ${c.active ? "au-menu__item--active" : ""}`,
        onClick: () => m(c),
        disabled: c.disabled,
        children: [
          c.icon && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-icon", children: c.icon }),
          /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-label", children: c.label }),
          c.badge && /* @__PURE__ */ e.jsx("span", { className: "au-menu__item-badge", children: c.badge })
        ]
      },
      c.id || f
    )) })
  ] });
}
function Ba({
  steps: n = [],
  activeStep: a = 0,
  orientation: t = "horizontal",
  className: o = "",
  ...i
}) {
  const r = [
    "au-stepper",
    `au-stepper--${t}`,
    o
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: r, ...i, children: n.map((u, d) => {
    const h = d < a, m = d === a, l = d > a, c = [
      "au-stepper__step",
      h && "au-stepper__step--completed",
      m && "au-stepper__step--active",
      l && "au-stepper__step--pending"
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: c, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-stepper__indicator", children: h ? /* @__PURE__ */ e.jsx("span", { className: "au-stepper__check", children: "✓" }) : /* @__PURE__ */ e.jsx("span", { className: "au-stepper__number", children: d + 1 }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "au-stepper__content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "au-stepper__title", children: u.title }),
        u.description && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__description", children: u.description })
      ] }),
      d < n.length - 1 && /* @__PURE__ */ e.jsx("div", { className: "au-stepper__connector" })
    ] }, u.id || d);
  }) });
}
function Pa({
  children: n,
  variant: a = "default",
  size: t = "medium",
  closable: o = !1,
  selectable: i = !1,
  selected: r = !1,
  onClose: u,
  onClick: d,
  className: h = "",
  ...m
}) {
  const l = (N) => {
    N.stopPropagation(), u?.();
  }, c = () => {
    i && d?.();
  }, f = [
    "au-chip",
    `au-chip--${a}`,
    `au-chip--${t}`,
    i && "au-chip--selectable",
    r && "au-chip--selected",
    h
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: f,
      onClick: c,
      role: i ? "button" : void 0,
      tabIndex: i ? 0 : void 0,
      ...m,
      children: [
        /* @__PURE__ */ e.jsx("span", { className: "au-chip__content", children: n }),
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
function Fa({
  items: n = [],
  orientation: a = "vertical",
  className: t = "",
  ...o
}) {
  const i = [
    "au-timeline",
    `au-timeline--${a}`,
    t
  ].filter(Boolean).join(" ");
  return /* @__PURE__ */ e.jsx("div", { className: i, ...o, children: n.map((r, u) => {
    const d = [
      "au-timeline__item",
      r.status && `au-timeline__item--${r.status}`
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: d, children: [
      /* @__PURE__ */ e.jsx("div", { className: "au-timeline__indicator", children: r.icon ? /* @__PURE__ */ e.jsx("span", { className: "au-timeline__icon", children: r.icon }) : /* @__PURE__ */ e.jsx("span", { className: "au-timeline__dot" }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "au-timeline__content", children: [
        /* @__PURE__ */ e.jsx("div", { className: "au-timeline__title", children: r.title }),
        r.description && /* @__PURE__ */ e.jsx("div", { className: "au-timeline__description", children: r.description }),
        r.timestamp && /* @__PURE__ */ e.jsx("div", { className: "au-timeline__timestamp", children: r.timestamp })
      ] })
    ] }, r.id || u);
  }) });
}
function Ua({
  items: n = [],
  selectable: a = !1,
  selectedItems: t = [],
  onSelectionChange: o,
  emptyState: i,
  className: r = "",
  ...u
}) {
  const d = (l) => {
    if (a && o) {
      const c = t.includes(l.id);
      let f;
      c ? f = t.filter((N) => N !== l.id) : f = [...t, l.id], o(f);
    }
    l.onClick && l.onClick(l);
  }, h = (l, c, f = 0) => {
    const N = a && t.includes(l.id), x = [
      "au-list-group__item",
      N && "au-list-group__item--selected",
      l.disabled && "au-list-group__item--disabled",
      `au-list-group__item--level-${f}`
    ].filter(Boolean).join(" ");
    return /* @__PURE__ */ e.jsxs("div", { className: x, children: [
      /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: "au-list-group__item-content",
          onClick: () => d(l),
          role: a ? "button" : void 0,
          tabIndex: a ? 0 : void 0,
          children: [
            l.icon && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-icon", children: l.icon }),
            /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__item-text", children: [
              /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-title", children: l.title }),
              l.description && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__item-description", children: l.description })
            ] }),
            l.badge && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-badge", children: l.badge }),
            a && /* @__PURE__ */ e.jsx("span", { className: "au-list-group__item-check", children: N ? "✓" : "" })
          ]
        }
      ),
      l.children && l.children.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "au-list-group__children", children: l.children.map((p, w) => h(p, w, f + 1)) })
    ] }, l.id || c);
  }, m = [
    "au-list-group",
    a && "au-list-group--selectable",
    r
  ].filter(Boolean).join(" ");
  return n.length === 0 && i ? /* @__PURE__ */ e.jsx("div", { className: `${m} au-list-group--empty`, ...u, children: /* @__PURE__ */ e.jsxs("div", { className: "au-list-group__empty", children: [
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
  ] }) }) : /* @__PURE__ */ e.jsx("div", { className: m, ...u, children: n.map((l, c) => h(l, c)) });
}
export {
  ba as AUBUTTON,
  Ra as AUCARD,
  fa as AUCHECKBOX,
  Ta as AUCHECKBOXGROUP,
  Pa as AUCHIP,
  wa as AUDATEPICKER,
  Na as AUINPUT,
  Ua as AULISTGROUP,
  Ma as AUMENU,
  ja as AUMENUDROPDOWN,
  $a as AUMODAL,
  La as AUPAGINATION,
  Oa as AUPOPOVER,
  Ia as AUPROGRESS,
  pa as AURADIO,
  Aa as AURADIOGROUP,
  Ca as AURANGE,
  ka as AUSELECT,
  Ba as AUSTEPPER,
  ya as AUTEXTAREA,
  Fa as AUTIMELINE,
  _a as AUTOAST,
  Da as AUTOASTCONTAINER,
  Ea as AUTOGGLE,
  Sa as AUTOOLTIP
};
//# sourceMappingURL=router-engine.es.js.map
