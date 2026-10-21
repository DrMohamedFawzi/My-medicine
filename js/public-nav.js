(() => {
  const destinations = new Map([
    ["index.html", "home"],
    ["index.html#how-it-works", "how-it-works"],
    ["index.html#features", "features"],
    ["contact.html", "pharmacy"],
    ["about.html", "about"],
    ["contact_us.html", "contact"]
  ]);

  function setActiveNav(activeKey) {
    const desktopNav = document.querySelector('nav[aria-label="التنقل الرئيسي"]');
    const mobileNav = document.querySelector('nav[aria-label="التنقل عبر الهاتف"]');

    desktopNav?.querySelectorAll("a").forEach((link) => {
      const key = destinations.get(link.getAttribute("href"));
      link.classList.remove("text-teal-800");
      link.removeAttribute("aria-current");

      if (key === activeKey) {
        link.classList.add("text-teal-800");
        link.setAttribute("aria-current", "page");
      }
    });

    mobileNav?.querySelectorAll("a").forEach((link) => {
      const key = destinations.get(link.getAttribute("href"));
      link.classList.remove("bg-teal-50", "font-extrabold", "text-teal-800");
      link.removeAttribute("aria-current");

      if (key === activeKey) {
        link.classList.add("bg-teal-50", "font-extrabold", "text-teal-800");
        link.classList.remove("font-bold", "hover:bg-slate-50");
        link.setAttribute("aria-current", "page");
      } else {
        link.classList.add("font-bold", "hover:bg-slate-50");
      }
    });
  }

  function updateActiveNav() {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash;
    let activeKey = null;

    if (path.endsWith("/index.html") || path.endsWith("/")) {
      if (hash === "#features") activeKey = "features";
      else if (hash === "#how-it-works") activeKey = "how-it-works";
      else activeKey = "home";
    } else if (path.endsWith("/contact.html")) {
      activeKey = "pharmacy";
    } else if (path.endsWith("/about.html")) {
      activeKey = "about";
    } else if (path.endsWith("/contact_us.html")) {
      activeKey = "contact";
    }

    setActiveNav(activeKey);
  }

  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element
      ? event.target.closest('nav[aria-label="التنقل الرئيسي"] a, nav[aria-label="التنقل عبر الهاتف"] a')
      : null;
    const activeKey = link && destinations.get(link.getAttribute("href"));

    if (activeKey) setActiveNav(activeKey);
  });

  updateActiveNav();
  window.addEventListener("hashchange", updateActiveNav);
  window.addEventListener("popstate", updateActiveNav);
})();
