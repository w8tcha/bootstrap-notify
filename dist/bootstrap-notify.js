/*
* Project: Bootstrap Notify = v5.0.2
* Description: Turns standard Bootstrap toasts into "Growl-like" notifications.
* Author: Mouse0270 aka Robert McIntosh
* Fork by w8tcha
* License: MIT License
* Website: https://w8tcha.github.io/bootstrap-notify/
*/
import * as c from "bootstrap";
import './bootstrap-notify.css';class d {
  $ele = document.createElement("div");
  settings;
  _defaults;
  animations;
  notify;
  constructor(t, e) {
    const s = {
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
    this.settings = s;
    const i = {
      content: {
        message: typeof t == "object" ? t.message : t,
        title: typeof t == "object" && t.title ? t.title : "",
        icon: typeof t == "object" && t.icon ? t.icon : ""
      }
    };
    e = r({}, i, e), this.settings = r({}, s, e), this._defaults = s, this.animations = {
      start: "webkitAnimationStart oanimationstart MSAnimationStart animationstart",
      end: "webkitAnimationEnd oanimationend MSAnimationEnd animationend"
    }, typeof this.settings.offset == "number" && (this.settings.offset = { x: this.settings.offset, y: this.settings.offset }), (this.settings.allow_duplicates || !this.settings.allow_duplicates && !this.isDuplicateNotification(this)) && this.init();
  }
  isDuplicateNotification(t) {
    let e = !1;
    return document.querySelectorAll('[data-notify="container"]').forEach((s) => {
      const i = s.querySelector('[data-notify="title"]')?.innerHTML.trim() ?? "", a = s.querySelector('[data-notify="message"]')?.innerHTML.trim() ?? "", n = i === t.settings.content?.title?.trim(), o = a === t.settings.content?.message?.trim();
      return n && o && (e = !0), !e;
    }), e;
  }
  init() {
    var t = this;
    this.buildNotify(), this.settings.content && this.settings.content.icon && this.setIcon(this.settings.content.icon), this.placement(), this.bind(), this.notify = {
      $ele: this.$ele,
      close() {
        t.close();
      }
    };
  }
  update(t, e) {
    const s = typeof t == "string" ? { [t]: e } : t;
    for (const i in s) {
      const a = this.$ele.querySelector(`[data-notify="${i}"]`);
      a && (a.innerHTML = s[i]);
    }
  }
  buildNotify() {
    const t = this.settings.content, e = document.createElement("div");
    if (e.innerHTML = this.formatTemplate(
      this.settings.template,
      this.settings.type,
      t.title,
      t.message
    ), this.$ele = e.firstChild, this.$ele.dataset.notifyPosition = `${this.settings.placement.from}-${this.settings.placement.align}`, this.$ele.dataset.bsDelay = this.settings.delay.toString(), !this.settings.allow_dismiss) {
      const s = this.$ele.querySelector('[data-notify="dismiss"]');
      s && (s.style.display = "none");
    }
    (this.settings.delay <= 0 && !this.settings.showProgressbar || !this.settings.showProgressbar) && this.$ele.querySelector('[data-notify="progressbar"]') && this.$ele.querySelector('[data-notify="progressbar"]').remove();
  }
  setIcon(t) {
    if (this.settings.icon_type && this.settings.icon_type.toLowerCase() === "class")
      this.$ele.querySelector('[data-notify="icon"]').className += ` ${t}`;
    else if (this.$ele.querySelector('[data-notify="icon"]').nodeName === "IMG") {
      const e = this.$ele.querySelector('[data-notify="icon"]');
      e.src = this.settings.content.icon, e.className = "me-2";
    } else {
      const e = document.createElement("img");
      e.src = `${this.settings.content.icon}`, e.alt = "Notify Icon", e.className = "me-2", this.$ele.querySelector('[data-notify="icon"]').append(e);
    }
  }
  placement() {
    const t = this;
    if (this.$ele.className += ` ${this.settings.animate.enter}`, new c.Toast(this.$ele).show(), document.querySelector(".toast-container") == null) {
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
    const s = document.querySelector(".toast-container");
    s && (this.settings.newest_on_top ? s.prepend(this.$ele) : s.append(this.$ele)), typeof t.settings.onShow == "function" && t.settings.onShow.call(this.$ele);
  }
  bind() {
    var t = this;
    const e = this.$ele.querySelector('[data-notify="dismiss"]');
    if (e && e.addEventListener(
      "click",
      () => {
        t.close();
      }
    ), t.settings.onClick && this.$ele.addEventListener(
      "click",
      (i) => {
        i.target !== t.$ele.querySelector('[data-notify="dismiss"]') && t.settings.onClick.call(this);
      }
    ), this.$ele.addEventListener(
      "mouseover",
      () => {
        this.$ele.dataset.hover = "true";
      }
    ), this.$ele.addEventListener(
      "mouseout",
      () => {
        this.$ele.dataset.hover = "false";
      }
    ), this.$ele.dataset.hover = "false", this.settings.delay && this.settings.delay > 0) {
      t.$ele.dataset.notifyDelay = t.settings.delay.toString();
      var s = setInterval(
        () => {
          const i = this.settings.delay - this.settings.timer;
          if (this.$ele.dataset.hover === "false" && this.settings.mouse_over === "pause" || this.settings.mouse_over !== "pause") {
            const a = (this.settings.delay - i) / this.settings.delay * 100;
            if (this.$ele.dataset.notifyDelay = i.toString(), this.settings.showProgressbar) {
              const n = this.$ele.querySelector('[data-notify="progressbar"] > div');
              n.setAttribute(
                "aria-valuenow",
                a.toString()
              ), n.style.width = a + "%";
            }
          }
          i <= -t.settings.timer && (clearInterval(s), this.close());
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
      (s) => {
        if (s.substring(0, 2) === "{{") return s;
        const i = parseInt(s.match(/\d/)[0]);
        return t[i + 1];
      }
    );
  }
}
function r(...l) {
  const t = {};
  let e = !1, s = 0;
  const i = l.length;
  Object.prototype.toString.call(l[0]) === "[object Boolean]" && (e = l[0], s++);
  const a = (n) => {
    for (const o in n)
      Object.prototype.hasOwnProperty.call(n, o) && (e && Object.prototype.toString.call(n[o]) === "[object Object]" ? t[o] = r(!0, t[o], n[o]) : t[o] = n[o]);
  };
  for (; s < i; s++) {
    const n = l[s];
    a(n);
  }
  return t;
}
export {
  d as default
};
//# sourceMappingURL=bootstrap-notify.js.map
