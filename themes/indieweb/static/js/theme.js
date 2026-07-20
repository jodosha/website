/* IndieWeb theme toggle — light/dark persisted in localStorage.
   The initial theme is applied by an inline blocking script in <head>
   (partials/theme-init.html) to avoid a flash; this file only wires up
   the toggle buttons and keeps their icon in sync. */
(function () {
  "use strict";
  var KEY = "lg-theme";

  function current() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  function apply(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    updateIcons(theme);
  }

  function updateIcons(theme) {
    var icon = theme === "dark" ? "☀" : "☾"; /* ☀ / ☾ */
    var label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    var els = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < els.length; i++) {
      els[i].textContent = icon;
      els[i].setAttribute("aria-label", label);
    }
  }

  function toggle() {
    var next = current() === "dark" ? "light" : "dark";
    try { localStorage.setItem(KEY, next); } catch (e) {}
    apply(next);
  }

  function init() {
    updateIcons(current());
    var btns = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", toggle);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
