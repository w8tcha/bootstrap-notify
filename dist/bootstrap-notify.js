/*
* Project: Bootstrap Notify = v5.0.0
* Description: Turns standard Bootstrap toasts into "Growl-like" notifications.
* Author: Mouse0270 aka Robert McIntosh
* License: MIT License
* Website: https://github.com/mouse0270/bootstrap-growl
*/
var u = Object.defineProperty;
var p = (n, t, s) => t in n ? u(n, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : n[t] = s;
var r = (n, t, s) => p(n, typeof t != "symbol" ? t + "" : t, s);
import * as b from "bootstrap";
class v {
  constructor(t, s) {
    r(this, "$ele", document.createElement("div"));
    r(this, "settings");
    r(this, "_defaults");
    r(this, "animations");
    r(this, "notify");
    const e = {
      element: "body",
      type: "info",
      allow_dismiss: !0,
      allow_duplicates: !0,
      newest_on_top: !0,
      showProgressbar: !1,
      placement: { from: "top", align: "right" },
      delay: 5e3,
      timer: 1e3,
      mouse_over: "pause",
      animate: { enter: "animated fadeInDown", exit: "animated fadeOutUp" },
      onShow: void 0,
      onShown: null,
      onClose: void 0,
      onClosed: null,
      onClick: null,
      icon_type: "class",
      offset: { x: 0, y: 0 },
      template: [
        '<div data-notify="container" class="toast fade m-3" role="alert" aria-live="assertive" aria-atomic="true">',
        '<div class="toast-header">',
        '<span data-notify="icon" class="me-2 text-{0}"></span>',
        '<strong class="me-auto fw-bold" data-notify="title">{1}</strong>',
        '<button type="button" class="ms-2 mb-1 btn-close" data-bs-dismiss="toast" data-notify="dismiss" aria-label="Close">',
        "</button>",
        "</div>",
        '<div class="toast-body" data-notify="message">',
        "{2}",
        '<div class="progress" role="progressbar" data-notify="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">',
        '<div class="progress-bar bg-{0}" style="width: 0%;"></div>',
        "</div>",
        "</div>"
      ].join("")
    };
    this.settings = e;
    const i = {
      content: {
        message: typeof t == "object" ? t.message : t,
        title: typeof t == "object" && t.title ? t.title : "",
        icon: typeof t == "object" && t.icon ? t.icon : ""
      }
    };
    s = c({}, i, s), this.settings = c({}, e, s), this._defaults = e, this.animations = {
      start: "webkitAnimationStart oanimationstart MSAnimationStart animationstart",
      end: "webkitAnimationEnd oanimationend MSAnimationEnd animationend"
    }, typeof this.settings.offset == "number" && (this.settings.offset = { x: this.settings.offset, y: this.settings.offset }), (this.settings.allow_duplicates || !this.settings.allow_duplicates && !this.isDuplicateNotification(this)) && this.init();
  }
  isDuplicateNotification(t) {
    let s = !1;
    return document.querySelectorAll('[data-notify="container"]').forEach((e) => {
      var d, h, m, f, g, y;
      const i = ((d = e.querySelector('[data-notify="title"]')) == null ? void 0 : d.innerHTML.trim()) ?? "", o = ((h = e.querySelector('[data-notify="message"]')) == null ? void 0 : h.innerHTML.trim()) ?? "", a = i === ((f = (m = t.settings.content) == null ? void 0 : m.title) == null ? void 0 : f.trim()), l = o === ((y = (g = t.settings.content) == null ? void 0 : g.message) == null ? void 0 : y.trim());
      return a && l && (s = !0), !s;
    }), s;
  }
  init() {
    var t = this;
    this.buildNotify(), this.settings.content && this.settings.content.icon && this.setIcon(), this.placement(), this.bind(), this.notify = {
      $ele: this.$ele,
      close() {
        t.close();
      }
    };
  }
  update(t, s) {
    const e = typeof t == "string" ? { [t]: s } : t;
    for (const i in e) {
      const o = this.$ele.querySelector(`[data-notify="${i}"]`);
      o && (o.innerHTML = e[i]);
    }
  }
  buildNotify() {
    const t = this.settings.content, s = document.createElement("div");
    if (s.innerHTML = this.formatTemplate(
      this.settings.template,
      this.settings.type,
      t.title,
      t.message
    ), this.$ele = s.firstChild, this.$ele.dataset.notifyPosition = `${this.settings.placement.from}-${this.settings.placement.align}`, this.$ele.dataset.bsDelay = this.settings.delay.toString(), !this.settings.allow_dismiss) {
      const e = this.$ele.querySelector('[data-notify="dismiss"]');
      e && (e.style.display = "none");
    }
    (this.settings.delay <= 0 && !this.settings.showProgressbar || !this.settings.showProgressbar) && this.$ele.querySelector('[data-notify="progressbar"]') && this.$ele.querySelector('[data-notify="progressbar"]').remove();
  }
  setIcon() {
    if (this.settings.icon_type && this.settings.icon_type.toLowerCase() === "class")
      this.$ele.querySelector('[data-notify="icon"]').className += ` ${this.settings.content.icon}`;
    else if (this.$ele.querySelector('[data-notify="icon"]').nodeName === "IMG") {
      const t = this.$ele.querySelector('[data-notify="icon"]');
      t.src = this.settings.content.icon, t.className = "me-2";
    } else {
      const t = document.createElement("img");
      t.src = `${this.settings.content.icon}`, t.alt = "Notify Icon", t.className = "me-2", this.$ele.querySelector('[data-notify="icon"]').append(t);
    }
  }
  placement() {
    const t = this;
    if (this.$ele.className += ` ${this.settings.animate.enter}`, new b.Toast(this.$ele).show(), document.querySelector(".toast-container") == null) {
      const i = document.createElement("div");
      switch (i.className = "toast-container position-fixed", this.settings.placement.from) {
        case "top":
          i.className += " top-0";
          break;
        case "bottom":
          i.className += " bottom-0";
          break;
      }
      switch (this.settings.placement.align) {
        case "left":
          i.className += " start-0";
          break;
        case "right":
          i.className += " end-0";
          break;
        case "center":
          i.className += " start-50 translate-middle-x";
          break;
      }
      document.querySelector(this.settings.element).append(i);
    }
    const e = document.querySelector(".toast-container");
    e && (this.settings.newest_on_top ? e.prepend(this.$ele) : e.append(this.$ele)), typeof t.settings.onShow == "function" && t.settings.onShow.call(this.$ele);
  }
  bind() {
    var t = this;
    const s = this.$ele.querySelector('[data-notify="dismiss"]');
    if (s && s.addEventListener("click", () => {
      t.close();
    }), t.settings.onClick && this.$ele.addEventListener(
      "click",
      (i) => {
        i.target !== t.$ele.querySelector('[data-notify="dismiss"]') && t.settings.onClick.call(this);
      }
    ), this.$ele.addEventListener("mouseover", () => {
      this.$ele.dataset.hover = "true";
    }), this.$ele.addEventListener("mouseout", () => {
      this.$ele.dataset.hover = "false";
    }), this.$ele.dataset.hover = "false", this.settings.delay && this.settings.delay > 0) {
      t.$ele.dataset.notifyDelay = t.settings.delay.toString();
      var e = setInterval(
        () => {
          const i = parseInt(this.$ele.dataset.notifyDelay) - this.settings.timer;
          if (this.$ele.dataset.hover === "false" && this.settings.mouse_over === "pause" || this.settings.mouse_over !== "pause") {
            const o = (this.settings.delay - i) / this.settings.delay * 100;
            if (this.$ele.dataset.notifyDelay = i.toString(), this.settings.showProgressbar) {
              const a = this.$ele.querySelector('[data-notify="progressbar"] > div');
              this.$ele.querySelector('[data-notify="progressbar"]').setAttribute("aria-valuenow", o.toString()), a.style.width = o + "%";
            }
          }
          i <= -this.settings.timer && (clearInterval(e), this.close());
        },
        t.settings.timer
      );
    }
  }
  close() {
    const t = this;
    this.$ele.dataset.closing = "true", this.$ele.className = `toast ${this.settings.animate.exit}`, t.settings.onClose && t.settings.onClose.call(this.$ele), t.$ele.remove();
  }
  formatTemplate(...t) {
    return t[0].replace(
      /(\{\{\d\}\}|\{\d\})/g,
      (e) => {
        if (e.substring(0, 2) === "{{") return e;
        const i = parseInt(e.match(/\d/)[0]);
        return t[i + 1];
      }
    );
  }
}
function c(...n) {
  const t = {};
  let s = !1, e = 0;
  const i = n.length;
  Object.prototype.toString.call(n[0]) === "[object Boolean]" && (s = n[0], e++);
  const o = (a) => {
    for (const l in a)
      Object.prototype.hasOwnProperty.call(a, l) && (s && Object.prototype.toString.call(a[l]) === "[object Object]" ? t[l] = c(!0, t[l], a[l]) : t[l] = a[l]);
  };
  for (; e < i; e++) {
    const a = n[e];
    o(a);
  }
  return t;
}
export {
  v as default
};
//# sourceMappingURL=bootstrap-notify.js.map
