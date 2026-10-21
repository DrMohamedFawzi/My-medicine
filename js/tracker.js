/**
 * MediFind Developer Telemetry & Journey Tracker (v1.0)
 * نظام تتبع مسار وسلوك المبرمجين والمختبرين وتحليل زمن المكوث والتفاعلات
 */

(function () {
  'use strict';

  const STORAGE_KEY_SESSIONS = 'medifind_dev_sessions';
  const STORAGE_KEY_ACTIVE = 'medifind_dev_session_active';
  const CHANNEL_NAME = 'medifind_dev_telemetry';

  // قناة البث المباشر بين التبويبات
  let broadcastChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
    }
  } catch (e) {
    console.warn('BroadcastChannel not supported');
  }

  // الحصول على الجلسات المحفوظة
  function getStoredSessions() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // حفظ الجلسات
  function saveStoredSessions(sessions) {
    try {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(sessions));
    } catch (e) {
      console.error('Failed to save dev sessions', e);
    }
  }

  // الحصول على الجلسة النشطة
  function getActiveSession() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ACTIVE);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  // تحديث الجلسة النشطة وحفظها في القائمة العامة (مع كبح الحجم وتفادي تجميد الذاكرة)
  function updateActiveSession(session) {
    try {
      // كبح حجم المصفوفات لتفادي بطء JSON.stringify
      if (session.events && session.events.length > 30) {
        session.events = session.events.slice(-30);
      }
      if (session.pageVisits && session.pageVisits.length > 20) {
        session.pageVisits = session.pageVisits.slice(-20);
      }
      if (session.errors && session.errors.length > 15) {
        session.errors = session.errors.slice(-15);
      }

      localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(session));
      let sessions = getStoredSessions();
      const idx = sessions.findIndex(s => s.id === session.id);
      if (idx >= 0) {
        sessions[idx] = session;
      } else {
        sessions.unshift(session);
      }
      // إبقاء آخر 8 جلسات فقط لتسريع القراءة والكتابة
      if (sessions.length > 8) {
        sessions = sessions.slice(0, 8);
      }
      saveStoredSessions(sessions);

      // بث التحديث
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'SESSION_UPDATED', session });
      }
    } catch (e) {
      console.warn('Dev session update deferred', e);
    }
  }

  // اسم الصفحة الحالية النظيف
  function getCurrentPageName() {
    const path = window.location.pathname;
    let page = path.split('/').pop();
    if (!page || page.trim() === '') page = 'index.html';
    return page;
  }

  // تسمية مقروءة للصفحة
  function getPageReadableTitle(page) {
    const titles = {
      'index.html': 'الرئيسية (Landing Page)',
      'index_patient.html': 'بوابة المريض والبحث الدوائي',
      'index_pharmacy.html': 'لوحة الصيدلية وإدارة المخزون',
      'index_admin.html': 'مركز قيادة الرقابة والإدارة (Admin)',
      'dev_session.html': 'بوابة دخول المبرمجين',
      'dev_analytics.html': 'لوحة تحليلات سلوك المبرمجين',
      'about.html': 'من نحن',
      'contact.html': 'تواصل معنا',
      'features.html': 'مميزات المنصة',
      'how_it_works.html': 'كيف تعمل المنصة'
    };
    return titles[page] || document.title || page;
  }

  // التحقق من معلمات الرابط لبدء جلسة سريعة عبر الرابط (مثل ?dev=1&name=Ahmed)
  function checkUrlForAutoSession() {
    const urlParams = new URLSearchParams(window.location.search);
    const devParam = urlParams.get('dev') || urlParams.get('dev_mode');
    const devName = urlParams.get('dev_name') || urlParams.get('name');

    if (devParam && devName && !getActiveSession()) {
      startSession(devName, urlParams.get('role') || 'مبرمج / مختبر', urlParams.get('task') || 'فحص عام عبر الرابط السريع');
    }
  }

  // بدء جلسة جديدة
  function startSession(developerName, role = 'مبرمج عام', task = 'اختبار شامل') {
    const sessionId = 'dev_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();
    const session = {
      id: sessionId,
      developerName: developerName.trim() || 'مبرمج غير مسمى',
      role: role,
      task: task,
      status: 'active',
      startedAt: now,
      lastActiveAt: now,
      endedAt: null,
      totalDurationSeconds: 0,
      browser: getBrowserInfo(),
      screen: `${window.screen.width}x${window.screen.height}`,
      pageVisits: [],
      events: [],
      errors: [],
      notes: []
    };

    localStorage.setItem(STORAGE_KEY_ACTIVE, JSON.stringify(session));
    const sessions = getStoredSessions();
    sessions.unshift(session);
    saveStoredSessions(sessions);

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'SESSION_STARTED', session });
    }

    // إعادة تهيئة التتبع للجلسة الحالية
    initCurrentPageTracking();
    renderDevBadge();
    return session;
  }

  // إنهاء الجلسة الحالية
  function endSession() {
    const session = getActiveSession();
    if (!session) return;

    finishCurrentPageVisit();
    session.status = 'completed';
    session.endedAt = new Date().toISOString();
    session.lastActiveAt = session.endedAt;

    // احتساب إجمالي الوقت
    let totalSec = 0;
    (session.pageVisits || []).forEach(v => {
      totalSec += (v.durationSeconds || 0);
    });
    session.totalDurationSeconds = totalSec;

    const sessions = getStoredSessions();
    const idx = sessions.findIndex(s => s.id === session.id);
    if (idx >= 0) sessions[idx] = session;
    saveStoredSessions(sessions);

    localStorage.removeItem(STORAGE_KEY_ACTIVE);

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'SESSION_ENDED', session });
    }

    // إزالة الشارة العائمة
    const badge = document.getElementById('medifind-dev-badge');
    if (badge) badge.remove();

    alert(`تم إنهاء جلسة المبرمج [${session.developerName}] بنجاح!\nإجمالي الوقت المسجل: ${formatDuration(totalSec)}`);
  }

  // إضافة ملاحظة من المبرمج
  function addNote(noteText, category = 'ملاحظة عامة') {
    const session = getActiveSession();
    if (!session) return;

    const note = {
      id: 'note_' + Date.now(),
      text: noteText,
      category: category,
      page: getCurrentPageName(),
      timestamp: new Date().toISOString()
    };

    session.notes = session.notes || [];
    session.notes.push(note);
    updateActiveSession(session);

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'NOTE_ADDED', session, note });
    }
  }

  // تسجيل حدث تفاعل
  function logEvent(actionType, targetDesc, extraData = {}) {
    const session = getActiveSession();
    if (!session || session.status !== 'active') return;

    const event = {
      id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      page: getCurrentPageName(),
      action: actionType,
      target: targetDesc,
      extra: extraData,
      timestamp: new Date().toISOString()
    };

    session.events = session.events || [];
    session.events.push(event);

    // زيادة عدد تفاعلات الزيارة الحالية
    if (session.pageVisits && session.pageVisits.length > 0) {
      const currentVisit = session.pageVisits[session.pageVisits.length - 1];
      if (currentVisit.page === getCurrentPageName() && !currentVisit.exitedAt) {
        currentVisit.interactionsCount = (currentVisit.interactionsCount || 0) + 1;
      }
    }

    session.lastActiveAt = new Date().toISOString();
    updateActiveSession(session);

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'EVENT_LOGGED', session, event });
    }
  }

  // تسجيل خطأ كود (JS Error)
  function logError(errorMsg, source, line, col, stack) {
    const session = getActiveSession();
    if (!session || session.status !== 'active') return;

    const err = {
      id: 'err_' + Date.now(),
      page: getCurrentPageName(),
      message: errorMsg || 'Unknown Error',
      source: source || 'inline/script',
      line: line || 0,
      col: col || 0,
      stack: stack ? stack.toString().slice(0, 300) : '',
      timestamp: new Date().toISOString()
    };

    session.errors = session.errors || [];
    session.errors.push(err);
    session.lastActiveAt = new Date().toISOString();
    updateActiveSession(session);

    if (broadcastChannel) {
      broadcastChannel.postMessage({ type: 'ERROR_LOGGED', session, error: err });
    }
  }

  // تتبع الصفحة الحالية وزمن المكوث
  let pageEnterTime = Date.now();
  let currentVisitId = null;
  let heartbeatInterval = null;

  function initCurrentPageTracking() {
    const session = getActiveSession();
    if (!session || session.status !== 'active') return;

    // لا نتتبع صفحات التحليلات نفسها إلا إذا رغبنا، ولكن سنستثني dev_analytics من التشويش
    const currentPage = getCurrentPageName();
    pageEnterTime = Date.now();
    currentVisitId = 'visit_' + Date.now();

    session.pageVisits = session.pageVisits || [];
    
    // إذا كانت هناك زيارة سابقة لم تغلق، اغلقها
    if (session.pageVisits.length > 0) {
      const last = session.pageVisits[session.pageVisits.length - 1];
      if (!last.exitedAt) {
        last.exitedAt = new Date().toISOString();
      }
    }

    const visit = {
      id: currentVisitId,
      page: currentPage,
      title: getPageReadableTitle(currentPage),
      url: window.location.href,
      enteredAt: new Date().toISOString(),
      exitedAt: null,
      durationSeconds: 0,
      interactionsCount: 0
    };

    session.pageVisits.push(visit);
    session.lastActiveAt = new Date().toISOString();
    updateActiveSession(session);

    // نبض دوري كل 15 ثانية لتحديث وقت المكوث في الصفحة باعتدال
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    heartbeatInterval = setInterval(updateCurrentVisitDuration, 15000);
  }

  function updateCurrentVisitDuration() {
    const session = getActiveSession();
    if (!session || session.status !== 'active') return;

    const seconds = Math.floor((Date.now() - pageEnterTime) / 1000);
    if (session.pageVisits && session.pageVisits.length > 0) {
      const current = session.pageVisits.find(v => v.id === currentVisitId);
      if (current) {
        current.durationSeconds = seconds;
        current.lastPingAt = new Date().toISOString();
        session.lastActiveAt = current.lastPingAt;
        updateActiveSession(session);
      }
    }
  }

  function finishCurrentPageVisit() {
    const session = getActiveSession();
    if (!session || !currentVisitId) return;

    const seconds = Math.floor((Date.now() - pageEnterTime) / 1000);
    if (session.pageVisits) {
      const current = session.pageVisits.find(v => v.id === currentVisitId);
      if (current) {
        current.durationSeconds = Math.max(current.durationSeconds || 0, seconds);
        current.exitedAt = new Date().toISOString();
        updateActiveSession(session);
      }
    }
  }

  let lastClickLogTime = 0;

  // مستمعات التفاعل العام (نقرات، أزرار، نماذج، روابط) - محسّنة للأداء
  function setupInteractionListeners() {
    // 1. النقرات (مع كبح زمني لتفادي الضغط على السيرفر والذاكرة)
    document.addEventListener('click', function (e) {
      const session = getActiveSession();
      if (!session || session.status !== 'active') return;

      const now = Date.now();
      if (now - lastClickLogTime < 400) return; // كبح التكرار السريع

      // تجنب تسجيل نقرات الودجت الخاص بالتتبع
      if (e.target.closest('#medifind-dev-badge') || e.target.closest('#medifind-note-modal')) {
        return;
      }

      const targetEl = e.target;
      const clickable = targetEl.closest('button, a, input[type="button"], input[type="submit"], select, .tab, [role="button"]');
      
      if (clickable) {
        lastClickLogTime = now;
        const tagName = clickable.tagName.toLowerCase();
        let label = clickable.innerText || clickable.title || clickable.getAttribute('aria-label') || clickable.value || '';
        label = label.replace(/\s+/g, ' ').trim().slice(0, 45);

        let identifier = '';
        if (clickable.id) identifier += '#' + clickable.id;

        const desc = `${tagName.toUpperCase()}: ${label || identifier || 'عنصر'}`;
        logEvent('click', desc, {
          element: tagName,
          id: clickable.id || null
        });
      }
    }, true);

    // 2. عمليات البحث والإدخال
    document.addEventListener('change', function (e) {
      const session = getActiveSession();
      if (!session || session.status !== 'active') return;
      if (e.target.closest('#medifind-dev-badge') || e.target.closest('#medifind-note-modal')) return;

      const el = e.target;
      if (el.tagName === 'INPUT' || el.tagName === 'SELECT') {
        const type = el.type;
        const nameOrId = el.name || el.id || el.placeholder || 'حقل';
        // لا نسجل كلمات المرور أو البيانات الحساسة جداً
        const val = type === 'password' ? '***' : (el.value || '').slice(0, 40);
        logEvent('input_change', `تغيير في [${nameOrId}]: "${val}"`, { field: nameOrId, type });
      }
    }, true);

    // 3. التقاط مغادرة الصفحة
    window.addEventListener('beforeunload', function () {
      finishCurrentPageVisit();
    });

    window.addEventListener('pagehide', function () {
      finishCurrentPageVisit();
    });

    // 4. التقاط أخطاء الجافاسكريبت
    window.addEventListener('error', function (e) {
      logError(e.message, e.filename, e.lineno, e.colno, e.error ? e.error.stack : null);
    });

    window.addEventListener('unhandledrejection', function (e) {
      logError(e.reason ? (e.reason.message || String(e.reason)) : 'Promise Rejection', '', 0, 0, e.reason ? e.reason.stack : null);
    });
  }

  // رسم الشارة العائمة المتقدمة للمبرمج (Floating Dev Badge)
  function renderDevBadge() {
    const session = getActiveSession();
    if (!session || session.status !== 'active') {
      const existing = document.getElementById('medifind-dev-badge');
      if (existing) existing.remove();
      return;
    }

    if (document.getElementById('medifind-dev-badge')) return;

    // إنشاء الودجت
    const badge = document.createElement('div');
    badge.id = 'medifind-dev-badge';
    badge.className = 'fixed bottom-4 left-4 z-[99999] font-sans select-none';
    badge.dir = 'rtl';
    badge.innerHTML = `
      <div id="medifind-badge-pill" class="bg-slate-900/95 backdrop-blur-md text-white border border-teal-500/40 rounded-full shadow-2xl p-2 px-4 flex items-center gap-3 transition-all duration-300 hover:border-teal-400">
        <span class="flex h-3 w-3 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
        </span>
        <div class="text-xs">
          <div class="flex items-center gap-1.5 font-bold">
            <span class="text-teal-400">مراقبة الاختبار:</span>
            <span class="text-slate-100 max-w-[120px] truncate" id="dev-badge-name">${escapeHTML(session.developerName)}</span>
          </div>
          <div class="text-[10px] text-slate-400 font-mono" id="dev-badge-timer">00:00</div>
        </div>
        <div class="flex items-center gap-1 border-r border-slate-700 pr-2 mr-1">
          <button id="btn-quick-note" class="btn btn-ghost btn-circle btn-xs text-amber-300 hover:bg-amber-400/20" title="إضافة ملاحظة أو بلاغ سريع">
            <i class="fa-solid fa-comment-dots text-xs"></i>
          </button>
          <button id="btn-end-session" class="btn btn-ghost btn-circle btn-xs text-rose-400 hover:bg-rose-500/20" title="إنهاء الجلسة">
            <i class="fa-solid fa-power-off text-xs"></i>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(badge);

    // تحديث مؤقت الشارة الحية
    const timerEl = document.getElementById('dev-badge-timer');
    const startTimestamp = new Date(session.startedAt).getTime();
    setInterval(() => {
      if (timerEl) {
        const elapsedSec = Math.floor((Date.now() - startTimestamp) / 1000);
        timerEl.innerText = formatDuration(elapsedSec);
      }
    }, 1000);

    // أحداث أزرار الشارة
    document.getElementById('btn-quick-note').addEventListener('click', showNoteModal);
    document.getElementById('btn-end-session').addEventListener('click', () => {
      if (confirm(`هل ترغب بالتأكيد في إنهاء جلسة اختبار المبرمج [${session.developerName}]؟`)) {
        endSession();
      }
    });
  }

  // نافذة إضافة ملاحظة سريعة
  function showNoteModal() {
    let modal = document.getElementById('medifind-note-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'medifind-note-modal';
      modal.className = 'fixed inset-0 z-[100000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 font-sans';
      modal.dir = 'rtl';
      modal.innerHTML = `
        <div class="bg-slate-900 border border-teal-500/30 rounded-3xl p-6 max-w-md w-full shadow-2xl text-slate-100">
          <div class="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-bug text-amber-400 text-lg"></i>
              <h3 class="font-bold text-sm">تسجيل ملاحظة / بلاغ فحص للمطور</h3>
            </div>
            <button id="close-note-modal" class="btn btn-ghost btn-circle btn-xs text-slate-400">✕</button>
          </div>
          <div class="space-y-3">
            <div>
              <label class="text-[11px] text-slate-400 block mb-1">نوع الملاحظة:</label>
              <select id="note-category-select" class="select select-bordered select-sm w-full bg-slate-800 text-slate-200 border-slate-700">
                <option value="ملاحظة عامة">💡 ملاحظة عامة أو اقتراح تحسين</option>
                <option value="خلل في واجهة المستخدم (UI Bug)">🎨 خلل في واجهة المستخدم (UI Bug)</option>
                <option value="خلل في الوظائف والأزرار (Logic Bug)">⚙️ خلل وظيفي أو زر لا يعمل</option>
                <option value="بطء في الاستجابة والأداء">⏱️ بطء أو تأخر في الاستجابة</option>
                <option value="صعوبة في تجربة الاستخدام (UX)">🧭 صعوبة وتشتت في الخطوات</option>
              </select>
            </div>
            <div>
              <label class="text-[11px] text-slate-400 block mb-1">تفاصيل الملاحظة:</label>
              <textarea id="note-text-input" rows="3" class="textarea textarea-bordered w-full bg-slate-800 text-slate-100 border-slate-700 placeholder-slate-500 text-xs" placeholder="صف ما لاحظته في هذه الصفحة بالتحديد..."></textarea>
            </div>
            <div class="text-[10px] text-slate-500 flex items-center gap-1">
              <i class="fa-solid fa-location-dot text-teal-400"></i>
              <span>الصفحة الحالية: <span class="text-teal-300 font-mono">${getCurrentPageName()}</span></span>
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <button id="cancel-note-btn" class="btn btn-ghost btn-sm text-xs">إلغاء</button>
              <button id="submit-note-btn" class="btn btn-teal bg-teal-600 hover:bg-teal-500 text-white btn-sm text-xs px-4">حفظ الملاحظة</button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('close-note-modal').onclick = () => modal.classList.add('hidden');
      document.getElementById('cancel-note-btn').onclick = () => modal.classList.add('hidden');
      document.getElementById('submit-note-btn').onclick = () => {
        const text = document.getElementById('note-text-input').value.trim();
        const cat = document.getElementById('note-category-select').value;
        if (!text) {
          alert('يرجى كتابة نص الملاحظة');
          return;
        }
        addNote(text, cat);
        document.getElementById('note-text-input').value = '';
        modal.classList.add('hidden');
        alert('تم حفظ الملاحظة وربطها بمسارك البرمجي بنجاح!');
      };
    } else {
      modal.classList.remove('hidden');
      document.getElementById('note-text-input').focus();
    }
  }

  // دوال مساعدة
  function formatDuration(seconds) {
    if (!seconds || seconds <= 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  function getBrowserInfo() {
    const ua = navigator.userAgent;
    if (ua.indexOf('Chrome') > -1) return 'Google Chrome';
    if (ua.indexOf('Firefox') > -1) return 'Mozilla Firefox';
    if (ua.indexOf('Safari') > -1) return 'Apple Safari';
    if (ua.indexOf('Edge') > -1) return 'Microsoft Edge';
    return 'Unknown Browser';
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // توليد بيانات تجريبية واقعية لأول مرة للتحليل والمقارنة
  function seedDemoSessionsIfEmpty(force = false) {
    if (!force && localStorage.getItem('medifind_dev_seeded') === 'cleared') {
      return;
    }
    const sessions = getStoredSessions();
    if (!force && sessions.length > 0) return;

    const demoSessions = [
      {
        id: 'dev_demo_01',
        developerName: 'م. أحمد بربخ',
        role: 'مطور واجهات ومختبر أداء',
        task: 'فحص حجز أدوية الطوارئ وتجربة المريض في قطاع غزة',
        status: 'completed',
        startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
        endedAt: new Date(Date.now() - 15 * 60000).toISOString(),
        lastActiveAt: new Date(Date.now() - 15 * 60000).toISOString(),
        totalDurationSeconds: 1800,
        browser: 'Google Chrome',
        screen: '1920x1080',
        pageVisits: [
          {
            id: 'v_1',
            page: 'index.html',
            title: 'الرئيسية (Landing Page)',
            enteredAt: new Date(Date.now() - 45 * 60000).toISOString(),
            exitedAt: new Date(Date.now() - 40 * 60000).toISOString(),
            durationSeconds: 300,
            interactionsCount: 4
          },
          {
            id: 'v_2',
            page: 'index_patient.html',
            title: 'بوابة المريض والبحث الدوائي',
            enteredAt: new Date(Date.now() - 40 * 60000).toISOString(),
            exitedAt: new Date(Date.now() - 25 * 60000).toISOString(),
            durationSeconds: 900,
            interactionsCount: 18
          },
          {
            id: 'v_3',
            page: 'index_pharmacy.html',
            title: 'لوحة الصيدلية وإدارة المخزون',
            enteredAt: new Date(Date.now() - 25 * 60000).toISOString(),
            exitedAt: new Date(Date.now() - 15 * 60000).toISOString(),
            durationSeconds: 600,
            interactionsCount: 12
          }
        ],
        events: [
          { id: 'e1', page: 'index.html', action: 'click', target: 'A: دخول بوابة المريض', timestamp: new Date(Date.now() - 40 * 60000).toISOString() },
          { id: 'e2', page: 'index_patient.html', action: 'input_change', target: 'تغيير في [search-input]: "أكامول"', timestamp: new Date(Date.now() - 38 * 60000).toISOString() },
          { id: 'e3', page: 'index_patient.html', action: 'click', target: 'BUTTON: حجز مؤقت للدواء (15 دقيقة)', timestamp: new Date(Date.now() - 35 * 60000).toISOString() },
          { id: 'e4', page: 'index_patient.html', action: 'click', target: 'BUTTON: تأكيد حجز عبوتين', timestamp: new Date(Date.now() - 32 * 60000).toISOString() },
          { id: 'e5', page: 'index_pharmacy.html', action: 'click', target: 'BUTTON: فتح قائمة طلبات الحجز المعلقة', timestamp: new Date(Date.now() - 22 * 60000).toISOString() }
        ],
        errors: [],
        notes: [
          {
            id: 'n1',
            text: 'سرعة التحميل ممتازة، زر الحجز يستجيب فورا ومؤقت 15 دقيقة يعمل بالشكل المطلوب.',
            category: 'ملاحظة عامة',
            page: 'index_patient.html',
            timestamp: new Date(Date.now() - 30 * 60000).toISOString()
          }
        ]
      },
      {
        id: 'dev_demo_02',
        developerName: 'م. سارة قاسم',
        role: 'مختبر جودة QA وأنظمة',
        task: 'فحص لوحة تحكم الرقابة وإدارة الصيدليات ورادار النقص',
        status: 'completed',
        startedAt: new Date(Date.now() - 90 * 60000).toISOString(),
        endedAt: new Date(Date.now() - 55 * 60000).toISOString(),
        lastActiveAt: new Date(Date.now() - 55 * 60000).toISOString(),
        totalDurationSeconds: 2100,
        browser: 'Mozilla Firefox',
        screen: '1440x900',
        pageVisits: [
          {
            id: 'v_4',
            page: 'index_admin.html',
            title: 'مركز قيادة الرقابة والإدارة (Admin)',
            enteredAt: new Date(Date.now() - 90 * 60000).toISOString(),
            exitedAt: new Date(Date.now() - 65 * 60000).toISOString(),
            durationSeconds: 1500,
            interactionsCount: 26
          },
          {
            id: 'v_5',
            page: 'index_pharmacy.html',
            title: 'لوحة الصيدلية وإدارة المخزون',
            enteredAt: new Date(Date.now() - 65 * 60000).toISOString(),
            exitedAt: new Date(Date.now() - 55 * 60000).toISOString(),
            durationSeconds: 600,
            interactionsCount: 9
          }
        ],
        events: [
          { id: 'e6', page: 'index_admin.html', action: 'click', target: 'BUTTON: تبديل إلى رادار النقص الدوائي B2B', timestamp: new Date(Date.now() - 85 * 60000).toISOString() },
          { id: 'e7', page: 'index_admin.html', action: 'click', target: 'BUTTON: اعتماد صيدلية جديدة (د. إبراهيم)', timestamp: new Date(Date.now() - 75 * 60000).toISOString() },
          { id: 'e8', page: 'index_admin.html', action: 'click', target: 'BUTTON: تصدير تقرير الإغاثة الطبية JSON', timestamp: new Date(Date.now() - 68 * 60000).toISOString() }
        ],
        errors: [],
        notes: [
          {
            id: 'n2',
            text: 'تصدير ملف JSON يعمل بسلاسة ويحتوي على كافة أدوية الطوارئ المصنفة بنجاح.',
            category: 'ملاحظة عامة',
            page: 'index_admin.html',
            timestamp: new Date(Date.now() - 67 * 60000).toISOString()
          }
        ]
      }
    ];

    localStorage.removeItem('medifind_dev_seeded');
    saveStoredSessions(demoSessions);
  }

  // تصدير الواجهة البرمجية للكائن العالمي
  window.MediFindTracker = {
    startSession,
    endSession,
    getActiveSession,
    getAllSessions: getStoredSessions,
    saveSession: updateActiveSession,
    addNote,
    logEvent,
    logError,
    formatDuration,
    seedDemoSessions: () => seedDemoSessionsIfEmpty(true),
    clearDemoSessions: function () {
      let sessions = getStoredSessions();
      sessions = sessions.filter(s => !s.id.startsWith('dev_demo_'));
      saveStoredSessions(sessions);
      localStorage.setItem('medifind_dev_seeded', 'cleared');
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'SESSIONS_CLEARED' });
      }
      return sessions;
    },
    clearAllSessions: function () {
      localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify([]));
      localStorage.removeItem(STORAGE_KEY_ACTIVE);
      localStorage.setItem('medifind_dev_seeded', 'cleared');
      if (broadcastChannel) {
        broadcastChannel.postMessage({ type: 'SESSIONS_CLEARED' });
      }
    }
  };

  // التهيئة عند تحميل الصفحة
  document.addEventListener('DOMContentLoaded', function () {
    seedDemoSessionsIfEmpty(false);
    checkUrlForAutoSession();
    initCurrentPageTracking();
    setupInteractionListeners();
    renderDevBadge();
  });

})();
