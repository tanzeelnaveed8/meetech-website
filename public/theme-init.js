!(function () {
  try {
    var s = localStorage.getItem("theme");
    if (s === "light" || s === "dark")
      document.documentElement.dataset.theme = s;
  } catch (e) {}
})();
