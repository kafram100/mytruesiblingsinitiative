(function () {
  function removeSimulatorPreLoaders() {
    try {
      var elements = document.querySelectorAll(
        ".simulator-pre-loader,div[class*=simulator]"
      );
      for (var i = 0; i < elements.length; i++) elements[i].remove();
    } catch (e) {}
  }
  removeSimulatorPreLoaders();
  try {
    new MutationObserver(removeSimulatorPreLoaders).observe(
      document.documentElement,
      { childList: true, subtree: true }
    );
  } catch (e) {}
})();
