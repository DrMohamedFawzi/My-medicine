(() => {
  function addTableLabels(table) {
    const headings = [...table.querySelectorAll('thead th')].map(cell => cell.textContent.trim());
    table.querySelectorAll('tbody tr').forEach(row => {
      [...row.cells].forEach((cell, index) => {
        if (!cell.hasAttribute('colspan') && headings[index]) {
          cell.dataset.label = headings[index];
        }
      });
    });
  }

  document.querySelectorAll('.dashboard-main table').forEach(table => {
    addTableLabels(table);
    const body = table.tBodies[0];
    if (body) new MutationObserver(() => addTableLabels(table)).observe(body, { childList: true, subtree: true });
  });

  function setSidebarOpen(open) {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const toggle = document.querySelector('.dashboard-nav-toggle');
    if (!sidebar || !toggle) return;

    sidebar.classList.toggle('is-open', open);
    document.body.classList.toggle('dashboard-nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  }

  document.addEventListener('click', event => {
    const toggle = event.target.closest('.dashboard-nav-toggle');
    if (toggle) {
      setSidebarOpen(!document.body.classList.contains('dashboard-nav-open'));
      return;
    }

    if (!document.body.classList.contains('dashboard-nav-open')) return;
    if (event.target.closest('.dashboard-sidebar')) {
      if (event.target.closest('a, .admin-nav-btn')) setSidebarOpen(false);
      return;
    }
    setSidebarOpen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('dashboard-nav-open')) {
      setSidebarOpen(false);
    }
  });
})();
