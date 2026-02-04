const categories = ["Stress & Anxiety", "Depression & Sadness", "Relationship Issues", "Work/Academic Issues", "Career Guidance", "Self‑esteem & Confidence", "Anger Management & Emotional Control", "Addictions & Habits", "Life Transition & Challenges", "Other / Unspecified"]

let store = {
  user: { authenticated: false, email: "", name: "", token: "" },
  counselor: { authenticated: false, id: null, email: "", name: "", token: "" },
  admin: { authenticated: false, id: null, email: "", name: "", token: "" },
  activities: [],
  sessions: [],
  counselors: [],
  appointments: [],
  payments: [],
  notifications: [],
  settings: { language: "en", sectionLangs: {}, theme: "dark", accent: "#6aa5ff", reduced: false, fontScale: 1, contrast: "normal", kbdHints: false, accounts: [], lastResourcesCategory: categories[0], openaiKey: "" }
};

let editingProfile = false;
let openaiKey = "";
const openaiModel = "gpt-4o";
let chatHistory = [];
let chatAbort = null;
let authToken = "";
const APP_VERSION = "33";
console.log("app.js version", APP_VERSION);

// API Helpers
async function api(path, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (authToken) options.headers['Authorization'] = 'Bearer ' + authToken;
  if (body) options.body = JSON.stringify(body);
  try {
    const res = await fetch(path, options);
    let data = null;
    try { data = await res.json() } catch (e) { data = null }
    if (data && typeof data === 'object' && !('ok' in data)) data.ok = res.ok;
    if (data) return data;
    return { ok: res.ok, status: res.status };
  } catch (e) {
    console.error(`API Error on ${path}:`, e);
    return { ok: false, error: String(e) };
  }
}

function saveLocal() { localStorage.setItem("mh_store", JSON.stringify(store)); }
function loadLocal() {
  const data = JSON.parse(localStorage.getItem("mh_store"));
  if (data) {
    if (data.user) store.user = data.user;
    if (data.settings) store.settings = data.settings;
    if (data.activities) store.activities = data.activities;
    if (data.settings && data.settings.openaiKey) openaiKey = data.settings.openaiKey;
  }
  authToken = (store.user && store.user.token) || "";
}

function renderLegalText(type) {
  const container = document.getElementById(type + '-content');
  if (!container) return;

  const lang = store.settings.language || 'en';

  if (type === 'privacy') {
    if (lang === 'si') {
      container.innerHTML = `
        <p>ඔබේ පෞද්ගලිකත්වය අපට ඉතා වැදගත් වේ. ඔබගේ සියලුම දත්ත ඔබගේ බ්‍රවුසරයේ දේශීයව ගබඩා කර ඇත.</p>
        <p>සංවාද දත්ත OpenAI වෙත යවනු ලබන්නේ ඔබ ඔබේම යතුරක් ලබා දුන්නේ නම් පමණි. කිසිදු පෞද්ගලික තොරතුරක් තෙවන පාර්ශවයන් සමඟ බෙදා නොගනී.</p>
        <p>අපි ඇතුල්වීමේ අවශ්‍යතා සහ සැමවිටම ආරක්ෂාව පිළිබඳ ඉහළ ප්‍රමිතීන් පවත්වා ගනිමු.</p>
      `;
    } else {
      container.innerHTML = `
        <p>Your privacy is important to us. All your mental health data is stored locally in your browser (LocalStorage).</p>
        <p>Chat conversations are only sent to OpenAI if you provide your own API key. No personal identity information is recorded or sold to third parties.</p>
        <p>We use industry-standard encryption protocols to ensure your data remains confidential during your sessions.</p>
      `;
    }
  } else if (type === 'terms') {
    if (lang === 'si') {
      container.innerHTML = `
        <p>මෙම වේදිකාව භාවිතා කිරීමෙන්, AI සහායකයා සහ උපදේශක උපදෙස් මාර්ගෝපදේශ පමණක් වන අතර වෘත්තීය වෛද්‍ය හදිසි සේවාවන් සඳහා ආදේශකයක් නොවන බව ඔබ එකඟ වේ.</p>
        <p>ජීවිතයට තර්ජනයක් වන හදිසි අවස්ථාවකදී, කරුණාකර වහාම ඔබේ දේශීය හදිසි අංකය අමතන්න.</p>
        <p>සියලුම ගනුදෙනු සහ පත්වීම් ශ්‍රී ලංකාවේ නීතිමය රාමුවට යටත් වේ.</p>
      `;
    } else {
      container.innerHTML = `
        <p>By using this platform, you agree that the AI assistant and counselor advice are educational guides and NOT a replacement for professional clinical diagnosis or emergency services.</p>
        <p>In case of a life-threatening emergency or crisis, please contact your local emergency number (e.g., 119 or 1990 in Sri Lanka) immediately.</p>
        <p>All counselor registrations and client bookings are subject to verification and ethical usage guidelines.</p>
      `;
    }
  }
}

function setStatus(t) { const s = document.getElementById('chat-status'); if (s) s.textContent = t || '' }

const resourcesMap = {
  "Stress & Anxiety": {
    advice: ["Inhale 4, hold 4, exhale 6 for 3 minutes", "Limit caffeine; schedule short walks", "Write down the top worry and one action"],
    motivation: [
      { t: "How to Make Stress Your Friend (TED)", u: "https://www.youtube.com/watch?v=RcGyVTAoXEU" },
      { t: "Therapy in a Nutshell: Anxiety Skills", u: "https://www.youtube.com/results?search_query=therapy+in+a+nutshell+anxiety+skills" },
      { t: "Headspace: Managing Anxiety", u: "https://www.youtube.com/results?search_query=headspace+managing+anxiety" }
    ],
    relax: [
      { t: "Box Breathing Guide", u: "https://www.youtube.com/watch?v=aNXKjGFUlMs" },
      { t: "Mindfulness Body Scan", u: "https://www.youtube.com/watch?v=ZToicYcHIOU" },
      { t: "4-7-8 Breathing Technique", u: "https://www.youtube.com/results?search_query=4-7-8+breathing" },
      { t: "Guided Meditation for Anxiety", u: "https://www.youtube.com/results?search_query=guided+meditation+for+anxiety" }
    ]
  },
  "Depression & Sadness": {
    advice: ["List one support person and one small task", "Get sunlight or a short walk", "Reduce social media before sleep"],
    motivation: [
      { t: "Andrew Solomon: Depression (TED)", u: "https://www.youtube.com/results?search_query=andrew+solomon+depression+ted+talk" },
      { t: "Kati Morton: Dealing with Depression", u: "https://www.youtube.com/results?search_query=kati+morton+depression" },
      { t: "Motivation for Difficult Days", u: "https://www.youtube.com/results?search_query=motivation+depression+hard+days" }
    ],
    relax: [
      { t: "Guided Meditation for Low Mood", u: "https://www.youtube.com/results?search_query=guided+meditation+for+depression" },
      { t: "Sleep Relaxation", u: "https://www.youtube.com/watch?v=7nJY0L2uWqs" },
      { t: "Progressive Muscle Relaxation", u: "https://www.youtube.com/results?search_query=progressive+muscle+relaxation" }
    ]
  },
  "Relationship Issues": {
    advice: ["Use I‑statements and listen actively", "Set boundaries kindly", "Pause and revisit when calm"],
    motivation: [
      { t: "Nonviolent Communication Basics", u: "https://www.youtube.com/results?search_query=nonviolent+communication+basics" },
      { t: "Setting Healthy Boundaries", u: "https://www.youtube.com/results?search_query=healthy+boundaries+relationships" },
      { t: "Active Listening Skills", u: "https://www.youtube.com/results?search_query=active+listening+skills" }
    ],
    relax: [
      { t: "Breathing for Conflict De-escalation", u: "https://www.youtube.com/results?search_query=breathing+for+conflict+de-escalation" },
      { t: "Calming Meditation before Conversation", u: "https://www.youtube.com/results?search_query=calming+meditation+before+difficult+conversation" },
      { t: "Box Breathing Guide", u: "https://www.youtube.com/watch?v=aNXKjGFUlMs" }
    ]
  },
  "Work/Academic Issues": {
    advice: ["Break tasks into 25‑minute blocks", "Ask for help early", "Write a next‑step list"],
    motivation: [
      { t: "Study Motivation", u: "https://www.youtube.com/results?search_query=study+motivation" },
      { t: "Productivity Tips", u: "https://www.youtube.com/results?search_query=productivity+tips" },
      { t: "Pomodoro Technique", u: "https://www.youtube.com/results?search_query=pomodoro+technique" }
    ],
    relax: [
      { t: "5‑Minute Mindful Break", u: "https://www.youtube.com/results?search_query=5+minute+mindfulness" },
      { t: "Desk Stretch Routine", u: "https://www.youtube.com/results?search_query=desk+stretch+routine" }
    ]
  },
  "Career Guidance": {
    advice: ["List strengths and interests", "Do 2 informational interviews", "Update your resume"],
    motivation: [
      { t: "Finding Purpose (TED)", u: "https://www.youtube.com/results?search_query=ted+finding+purpose" },
      { t: "Career Planning", u: "https://www.youtube.com/results?search_query=career+planning+tips" }
    ],
    relax: [
      { t: "Decision Calm Breathing", u: "https://www.youtube.com/results?search_query=breathing+for+decision+making" }
    ]
  },
  "Self‑esteem & Confidence": {
    advice: ["Write three strengths", "Track small wins", "Reduce comparisons"],
    motivation: [
      { t: "Build Confidence", u: "https://www.youtube.com/results?search_query=build+confidence" },
      { t: "Self‑Compassion", u: "https://www.youtube.com/results?search_query=self+compassion+talk" },
      { t: "Imposter Syndrome (TED)", u: "https://www.youtube.com/results?search_query=imposter+syndrome+ted" }
    ],
    relax: [
      { t: "Self‑Compassion Meditation", u: "https://www.youtube.com/results?search_query=self+compassion+meditation" }
    ]
  },
  "Anger Management & Emotional Control": {
    advice: ["Pause and name the feeling", "Take a short walk", "Use cold water on wrists"],
    motivation: [
      { t: "Anger Management Techniques", u: "https://www.youtube.com/results?search_query=anger+management+techniques" },
      { t: "DBT Skills for Emotions", u: "https://www.youtube.com/results?search_query=dbt+skills+emotions" }
    ],
    relax: [
      { t: "Counting Breath", u: "https://www.youtube.com/results?search_query=counting+breath+exercise" },
      { t: "Progressive Muscle Relaxation", u: "https://www.youtube.com/results?search_query=progressive+muscle+relaxation" }
    ]
  },
  "Addictions & Habits": {
    advice: ["Identify triggers", "Replace with a safer habit", "Use accountability"],
    motivation: [
      { t: "Quit Bad Habits", u: "https://www.youtube.com/results?search_query=quit+bad+habits" },
      { t: "Atomic Habits Overview", u: "https://www.youtube.com/results?search_query=atomic+habits+summary" }
    ],
    relax: [
      { t: "Urge Surfing Mindfulness", u: "https://www.youtube.com/results?search_query=urge+surfing+mindfulness" }
    ]
  },
  "Life Transition & Challenges": {
    advice: ["Write the next small step", "Map your support network", "Keep a simple routine"],
    motivation: [
      { t: "Resilience Stories", u: "https://www.youtube.com/results?search_query=resilience+stories" },
      { t: "Growth Mindset", u: "https://www.youtube.com/results?search_query=growth+mindset+video" }
    ],
    relax: [
      { t: "Grounding 5‑4‑3‑2‑1", u: "https://www.youtube.com/results?search_query=grounding+5+4+3+2+1" }
    ]
  },
  "Other / Unspecified": {
    advice: ["Take one breath and one note", "Write one gratitude", "Walk 10 minutes"],
    motivation: [
      { t: "General Motivation", u: "https://www.youtube.com/results?search_query=motivation+video" }
    ],
    relax: [
      { t: "Body Scan", u: "https://www.youtube.com/watch?v=ZToicYcHIOU" }
    ]
  }
}

function fillList(ul, items) { ul.innerHTML = ""; items.forEach(it => { const li = document.createElement("li"); if (typeof it === "string") { li.textContent = it } else { const a = document.createElement("a"); a.href = it.u; a.target = "_blank"; a.textContent = it.t; li.appendChild(a) } ul.appendChild(li) }) }
function renderResources() { const sel = document.getElementById("resources-category"); if (!sel) return; const cat = sel.value || store.settings?.lastResourcesCategory || categories[0]; const data = resourcesMap[cat] || { advice: ["Try a brief breathing exercise", "Write one gratitude", "Take a 10‑minute walk"], motivation: [{ t: "Motivation", u: "https://www.google.com/search?q=motivation+video" }], relax: [{ t: "Body Scan", u: "https://www.youtube.com/watch?v=ZToicYcHIOU" }] }; const adv = document.getElementById("advice-list"); const mot = document.getElementById("motivational-links"); const rel = document.getElementById("relaxation-links"); if (adv) fillList(adv, data.advice); if (mot) fillList(mot, data.motivation); if (rel) fillList(rel, data.relax) }
function renderResourcesCategories() { const sel = document.getElementById("resources-category"); if (!sel) return; sel.innerHTML = ""; const placeholder = document.createElement("option"); placeholder.value = ""; placeholder.textContent = "Select a category"; sel.appendChild(placeholder); categories.forEach(c => { const o = document.createElement("option"); o.value = c; o.textContent = c; sel.appendChild(o) }); const cur = store.settings?.lastResourcesCategory || categories[0]; sel.value = cur }

async function addActivity(type, detail) {
  store.activities.unshift({ type, detail, ts: Date.now() });
  if (store.activities.length > 200) store.activities.pop();
  saveLocal();
  renderActivity();
  if (store.user && store.user.email) {
    const msg = `${type} • ${detail}`;
    await api('/api/notifications', 'POST', { email: store.user.email, msg, status: 'info' });
    const view = document.getElementById("notifications");
    if (view && view.classList.contains("active")) renderNotifications();
  }
}

let renderingNotifications = false;
async function renderNotifications() {
  if (renderingNotifications) return;
  renderingNotifications = true;
  const list = document.getElementById("notification-list");
  if (!list) { renderingNotifications = false; return; }
  list.innerHTML = "";
  const nap = document.getElementById("n-appointments");
  const npay = document.getElementById("n-payments");
  const nfb = document.getElementById("n-feedback-list");
  const grid = document.getElementById("c-notification-grid");
  if (nap) nap.innerHTML = "";
  if (npay) npay.innerHTML = "";
  if (nfb) nfb.innerHTML = "";
  try {
    const isCounselor = !!store.counselor.authenticated;
    if (grid) grid.style.display = isCounselor ? '' : 'none';
    list.style.display = isCounselor ? 'none' : '';
    if (isCounselor) {
      // Counselors manage data via specialized functions, skip general notifications
      await Promise.all([
        nap ? renderCounselorAppointments(nap) : Promise.resolve(),
        npay ? renderCounselorPayments(npay) : Promise.resolve(),
        nfb ? renderCounselorFeedback(nfb) : Promise.resolve()
      ]);
      return;
    }

    await purgeDuplicateNotifications(store.user.email || '');
    let ns = await api(`/api/notifications?email=${store.user.email || ''}`);
    // No demo defaults: if empty, show nothing until real notifications exist.

    const byKey = new Map();
    const makeKey = (msg) => {
      const m = (msg || '').trim().toLowerCase();
      const re1 = /^your appointment with\s+.+?\s+on\s+\d{4}-\d{2}-\d{2}\s+at\s+\d{2}:\d{2}/i;
      const re2 = /^booked appointment with\s+.+?\s+on\s+\d{4}-\d{2}-\d{2}\s+at\s+\d{2}:\d{2}/i;
      const match = m.match(re1) || m.match(re2);
      if (match && match[0]) return match[0];
      return m;
    };
    const statusPriority = (st) => {
      const s = String(st || '').toLowerCase();
      if (s === 'accepted') return 3;
      if (s === 'declined') return 2;
      if (s === 'pending') return 1;
      return 0;
    };
    (ns || []).forEach(n => {
      const k = makeKey(n.msg);
      const cur = byKey.get(k);
      if (!cur) { byKey.set(k, n); return }
      const pNew = statusPriority(n.status);
      const pCur = statusPriority(cur.status);
      if (pNew > pCur || (pNew === pCur && (n.ts || 0) > (cur.ts || 0))) {
        byKey.set(k, n);
      }
    });
    if (!isCounselor) {
      const groups = new Map();
      (ns || []).forEach(n => {
        const k = makeKey(n.msg);
        const arr = groups.get(k) || [];
        arr.push(n);
        groups.set(k, arr);
      });
      for (const [k, arr] of groups.entries()) {
        if (arr.length > 1) {
          arr.sort((a, b) => (b.ts || 0) - (a.ts || 0));
          for (let i = 1; i < arr.length; i++) {
            await api(`/api/notifications/${arr[i].id}`, 'DELETE');
          }
        }
      }
    }
    const viewNs = Array.from(byKey.values()).sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 4);
    const rendered = new Set();
    const isApMsg = (msg) => {
      const m = (msg || '').toLowerCase();
      const re1 = /^your appointment with\s+.+?\s+on\s+\d{4}-\d{2}-\d{2}\s+at\s+\d{2}:\d{2}/i;
      const re2 = /^booked appointment with\s+.+?\s+on\s+\d{4}-\d{2}-\d{2}\s+at\s+\d{2}:\d{2}/i;
      return re1.test(m) || re2.test(m) || m.includes('appointment');
    };
    const items = isCounselor ? viewNs : viewNs.filter(n => isApMsg(n.msg));
    items.forEach(n => {
      const rKey = makeKey(n.msg);
      if (rendered.has(rKey)) return;
      rendered.add(rKey);
      let displayMsg = n.msg;
      const apMatch = (n.msg || '').match(/^Your appointment with\s+(.+?)\s+on\s+(\d{4}-\d{2}-\d{2})\s+at\s+(\d{2}:\d{2})/i);
      if (apMatch && String(n.status || '').toLowerCase() === 'pending') {
        const [, nm, dt, tm] = apMatch;
        displayMsg = `Booked appointment with ${nm} on ${dt} at ${tm}`;
      }
      if (!isCounselor) {
        const card = document.createElement("div");
        card.className = "n-card";
        if (n.status) card.classList.add(n.status);
        let avatarHtml = '<div class="n-avatar placeholder"><span>🔔</span></div>';
        const nameFromMsg = (msg) => {
          const m = msg || '';
          const m1 = m.match(/^Booked appointment with\s+(.+?)\s+on\s+\d{4}-\d{2}-\d{2}\s+at\s+\d{2}:\d{2}/i);
          const m2 = m.match(/^Your appointment with\s+(.+?)\s+on\s+\d{4}-\d{2}-\d{2}\s+at\s+\d{2}:\d{2}/i);
          return (m1 && m1[1]) || (m2 && m2[1]) || '';
        };
        const cname = nameFromMsg(n.msg);
        const counselor = cname ? (store.counselors || []).find(c => c.name === cname) : null;
        const src = counselor ? (counselor.profileImage || '') : '';
        if (src) {
          avatarHtml = `<div class="n-avatar"><img src="${src}" alt="${cname}"></div>`;
        } else {
          if (n.msg.includes("P.K.I.S. Bandara")) avatarHtml = '<div class="n-avatar"><img src="MyOff.jpg" alt="Counselor"></div>';
          else if (n.msg.includes("W.A.M.Waduwaththa")) avatarHtml = '<div class="n-avatar"><img src="picures/AvskOff.jpg" alt="Counselor"></div>';
          else if (n.msg.includes("N. Silva")) avatarHtml = '<div class="n-avatar"><img src="picures/SilvaProfile.jpg" alt="Counselor"></div>';
          else if (n.msg.includes("A. Perera")) avatarHtml = '<div class="n-avatar"><img src="picures/PereraProfile.jpg" alt="Counselor"></div>';
        }
        const checkmark = card.classList.contains("accepted") ? '<div class="n-status-mark">✓</div>' : '';
        const delBtn = `<button class="n-delete" onclick="deleteNotification('${n.id}')" title="Delete notification">&times;</button>`;
        const st = String(n.status || 'info').toLowerCase();
        const badgeColor = st === 'pending' ? '#3bd380' : st === 'accepted' ? '#6aa5ff' : st === 'declined' ? '#ff5f6d' : '#ffaa33';
        const statusBadge = `<span class="n-badge" style="margin-left:auto;padding:4px 10px;border-radius:999px;background:#102a43;border:1px solid ${badgeColor};color:${badgeColor};font-size:0.85em">${st}</span>`;
        card.innerHTML = `
        ${avatarHtml}
        <div class="n-content">
          <div class="n-time">${fmt(n.ts).date} ${fmt(n.ts).time}</div>
          <div class="n-msg">${displayMsg.replace(/\n/g, '<br>')}</div>
        </div>
        ${checkmark}
        ${statusBadge}
        ${delBtn}
      `;
        list.appendChild(card);
      }
      const li = document.createElement("li");
      const time = `${fmt(n.ts).date} ${fmt(n.ts).time}`;
      const ml = n.msg.toLowerCase();
      const isAp = ml.includes("appointment");
      const isPay = ml.includes("payment");
      const icon = isAp ? "📅" : isPay ? "💳" : "📝";
      const statusColor = isAp ? "#3bd380" : isPay ? "#6aa5ff" : "#ffaa33";
      li.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;justify-content:space-between;padding:10px 12px;background:rgba(16,42,67,0.6);border:1px solid #1e2852;border-radius:10px">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:1.2em">${icon}</span>
          <div>
            <div style="font-weight:600">${displayMsg}</div>
            <div style="color:var(--muted);font-size:0.9em">${time}</div>
          </div>
        </div>
        <span style="padding:4px 10px;border-radius:999px;background:#102a43;border:1px solid ${statusColor};color:${statusColor};font-size:0.85em">${n.status || 'info'}</span>
      </div>
    `;
      if (nap && (ml.includes("appointment") || ml.includes("pending") || ml.includes("accepted") || ml.includes("declined"))) nap.appendChild(li);
      else if (npay && (ml.includes("payment") || ml.includes("amount") || ml.includes("package"))) npay.appendChild(li);
      else if (nfb && (ml.includes("feedback") || ml.includes("sentiment"))) nfb.appendChild(li);
    });
    const apH = nap ? nap.previousElementSibling : null;
    const payH = npay ? npay.previousElementSibling : null;
    const fbH = nfb ? nfb.previousElementSibling : null;
    if (apH) apH.innerHTML = `Appointments <span style="margin-left:6px;padding:2px 8px;border-radius:999px;background:#102a43;border:1px solid #1e2852;color:#9fb3c8;font-size:0.85em">${nap.childElementCount}</span>`;
    if (payH) payH.innerHTML = `Payments <span style="margin-left:6px;padding:2px 8px;border-radius:999px;background:#102a43;border:1px solid #1e2852;color:#9fb3c8;font-size:0.85em">${npay.childElementCount}</span>`;
    if (fbH) fbH.innerHTML = `Feedback <span style="margin-left:6px;padding:2px 8px;border-radius:999px;background:#102a43;border:1px solid #1e2852;color:#9fb3c8;font-size:0.85em">${nfb.childElementCount}</span>`;
  } finally {
    renderingNotifications = false;
  }

}

async function deleteNotification(id) {
  await api(`/api/notifications/${id}`, 'DELETE');
  renderNotifications();
}

async function purgeDuplicateNotifications(email) {
  const ns = await api(`/api/notifications?email=${email || ''}`);
  if (!ns || ns.length === 0) return;
  const isApMsg = (msg) => {
    const m = (msg || '').toLowerCase();
    const re1 = /^your appointment with\s+.+?\s+on\s+\d{4}-\d{2}-\d{2}\s+at\s+\d{2}:\d{2}/i;
    const re2 = /^booked appointment with\s+.+?\s+on\s+\d{4}-\d{2}-\d{2}\s+at\s+\d{2}:\d{2}/i;
    return re1.test(m) || re2.test(m) || m.includes('appointment');
  };
  const makeKey = (msg) => {
    const m = (msg || '').trim().toLowerCase();
    const re1 = /^your appointment with\s+.+?\s+on\s+\d{4}-\d{2}-\d{2}\s+at\s+\d{2}:\d{2}/i;
    const re2 = /^booked appointment with\s+.+?\s+on\s+\d{4}-\d{2}-\d{2}\s+at\s+\d{2}:\d{2}/i;
    const match = m.match(re1) || m.match(re2);
    return (match && match[0]) ? match[0] : m;
  };
  const statusPriority = (st) => {
    const s = String(st || '').toLowerCase();
    if (s === 'accepted') return 3;
    if (s === 'declined') return 2;
    if (s === 'pending') return 1;
    return 0;
  };
  const groups = new Map();
  ns.forEach(n => {
    if (!isApMsg(n.msg)) return;
    const k = makeKey(n.msg);
    const arr = groups.get(k) || [];
    arr.push(n);
    groups.set(k, arr);
  });
  for (const arr of groups.values()) {
    if (arr.length > 1) {
      arr.sort((a, b) => {
        const pa = statusPriority(a.status), pb = statusPriority(b.status);
        if (pa !== pb) return pb - pa;
        return (b.ts || 0) - (a.ts || 0);
      });
      for (let i = 1; i < arr.length; i++) {
        await api(`/api/notifications/${arr[i].id}`, 'DELETE');
      }
    }
  }
}

function navigate(view) {
  console.log('navigate() called with view:', view);
  ensureAuthUI();
  if (!view) return;
  const isAuth = store.user.authenticated || store.counselor.authenticated || store.admin.authenticated;
  const loginViews = new Set(['landing-login', 'client-login', 'client-register', 'counselor-login', 'admin-login', 'admin-register', 'register-counselor']);
  if (!isAuth && !loginViews.has(view)) view = 'landing-login';
  if (view === 'counselor-dashboard' && !store.counselor.authenticated) view = 'counselor-login';
  if (store.counselor.authenticated) {
    const allowed = new Set(['notifications']);
    if (!allowed.has(view)) view = 'notifications';
  }
  const header = document.querySelector('header');
  const navEl = header ? header.querySelector('nav') : null;
  const hideNavViews = new Set(['landing-login', 'client-login', 'counselor-login', 'admin-login', 'admin-register']);
  if (navEl) navEl.style.display = hideNavViews.has(view) ? 'none' : '';
  const targetView = document.getElementById(view);
  if (!targetView) { console.error('View not found:', view); return }

  document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  targetView.classList.add("active");
  ensureAuthUI();

  const btn = document.querySelector(`.nav-btn[data-view="${view}"]`);
  if (btn) btn.classList.add("active");

  if (view === "resources") { renderResourcesCategories(); renderResources(); }
  if (view === "notifications") {
    renderNotifications();
  }
  if (view === "counselors") { renderCounselors(); renderAppointments(); renderPayments() }
  if (view === "home") { renderSessions() }
  if (view === "counselor-dashboard") { renderCounselorDashboard() }
  if (view === "chat") { renderChat() }
  if (view === "about") { const c = document.getElementById("user-count"); if (c) c.textContent = "1,245+ Members"; }
  if (view === "privacy" || view === "terms") renderLegalText(view);
  if (view === "counselor-task") initExam();

  if (view === "counselor-task") initExam();
  if (view === "feedback") {
    // Populate counselor dropdown
    const sel = document.getElementById("feedback-counselor");
    const details = document.getElementById('feedback-details');

    if (sel && store.counselors) {
      sel.innerHTML = "";
      store.counselors.forEach(c => {
        const o = document.createElement("option");
        o.value = c.id;
        o.textContent = c.name;
        sel.appendChild(o);
      });

      if (details) details.style.display = sel.options.length ? 'block' : 'none';

      sel.onchange = () => {
        if (details) details.style.display = sel.value ? 'block' : 'none';
      };
    }
  }

  addActivity("navigate", view);
  if (view === "profile") { setProfileEditing(false) }
}

function pad(n) { return String(n).padStart(2, "0") }
function fmt(ts) {
  const d = new Date(ts);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return {
    date: `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`
  };
}

async function renderSessions() {
  const list = document.getElementById("session-list");
  if (!list) return;
  list.innerHTML = "";

  const ss = await api(`/api/sessions?email=${store.user.email || ''}`);
  if (!ss) return;

  ss.forEach(s => {
    const li = document.createElement("li");
    li.className = "s-item";
    const timeParts = fmt(s.start);

    let content = "";
    if (s.counselorName) {
      const counselor = store.counselors.find(c => c.name === s.counselorName);
      const avatarSrc = counselor ? (counselor.profileImage || "MyOff.jpg") : "MyOff.jpg";

      const titles = ["Step Towards Inner Peace", "Emotional Discovery", "Growth Milestone", "Empowering Talk", "Healing Progress"];
      const rTitle = titles[Math.floor((s.start % 1000) / 200)] || titles[0];

      content = `
        <div class="s-badge">
          <span class="s-date">${timeParts.date}</span>
          <span class="s-time">${timeParts.time}</span>
        </div>
        <div class="s-avatar"><img src="${avatarSrc}" alt="${s.counselorName}"></div>
        <div class="s-info">
          <div class="s-title">${rTitle} • 1h</div>
          <div class="s-desc">A powerful step forward. Completed session with <span class="s-name">${s.counselorName}</span>.</div>
        </div>
        <div class="s-status" title="Session Verified">✓</div>
      `;
    } else {
      const end = s.end ? fmt(s.end).time : "ongoing";
      const feat = s.category || "Soulful Exploration";
      content = `
        <div class="s-badge">
          <span class="s-date">${timeParts.date}</span>
          <span class="s-time">${timeParts.time}</span>
        </div>
        <div class="s-info">
          <div class="s-title">${feat}</div>
          <div class="s-desc">Status: ${end === 'ongoing' ? 'Still blooming...' : 'Completed with harmony'}.</div>
        </div>
      `;
    }
    li.innerHTML = content;
    list.appendChild(li);
  })
}

function renderActivity() {
  const list = document.getElementById("activity-list");
  if (!list) return;
  list.innerHTML = "";
  store.activities.slice(0, 12).forEach(a => {
    const li = document.createElement("li");
    const f = fmt(a.ts);
    li.textContent = `${f.date} ${f.time} • ${a.type} • ${a.detail}`;
    list.appendChild(li)
  })
}

function ensureAuthUI() {
  const header = document.querySelector('header');
  const active = document.querySelector('.view.active');
  const curView = active ? active.id : '';
  const navEl = header ? header.querySelector('nav') : null;
  const hideNavViews = new Set(['landing-login', 'client-login', 'counselor-login', 'admin-login', 'admin-register']);
  if (hideNavViews.has(curView)) {
    if (navEl) navEl.style.display = 'none';
    if (header) header.style.display = '';
    return;
  } else {
    if (navEl) navEl.style.display = '';
  }
  const isUserOrAdmin = store.user.authenticated || store.admin.authenticated;
  const isCounselor = store.counselor.authenticated;
  if (header) header.style.display = (isUserOrAdmin || isCounselor) ? '' : 'none';
  if (isCounselor) {
    const nav = header ? header.querySelector('nav') : null;
    if (nav) {
      if (!store._origNav) store._origNav = nav.innerHTML;
      if (nav.dataset.role !== 'counselor') {
        nav.innerHTML = '<button data-view="notifications" class="nav-btn active">Notifications</button>';
        nav.dataset.role = 'counselor';
        nav.querySelectorAll(".nav-btn").forEach(b => { b.addEventListener("click", (e) => { e.preventDefault(); navigate(b.dataset.view); applyLanguage(b.dataset.view) }) });
      }
    }
  } else {
    const nav = header ? header.querySelector('nav') : null;
    if (nav && nav.dataset.role === 'counselor' && store._origNav) {
      nav.innerHTML = store._origNav;
      nav.dataset.role = 'default';
      nav.querySelectorAll(".nav-btn").forEach(b => { b.addEventListener("click", (e) => { e.preventDefault(); navigate(b.dataset.view); applyLanguage(b.dataset.view) }) });
    } else {
      document.querySelectorAll('nav .nav-btn').forEach(b => { b.style.display = '' });
    }
  }
}
async function onLogin(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const email = (fd.get('email') || '').trim();
  const password = fd.get('password') || '';
  let res = await api('/api/accounts/login', 'POST', { email, password });
  if (!res || !res.ok) {
    // Fallback to legacy auth endpoint if available
    const qs = new URLSearchParams({ email, password }).toString();
    res = await api('/api/auth/login?' + qs, 'GET');
  }
  if (res && res.ok) {
    store.user.authenticated = true;
    store.user.email = res.user.email;
    store.user.name = res.user.name || '';
    store.user.token = res.token || '';
    authToken = store.user.token;
    saveLocal();
    addActivity('login', email);
    ensureAuthUI();
    navigate('home');
  } else {
    alert('Invalid email or password');
  }
}
async function onRegister(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = (fd.get('name') || '').trim();
  const email = (fd.get('email') || '').trim();
  const password = fd.get('password') || '';
  let res = await api('/api/accounts', 'POST', { name, email, password });
  if (!res || !res.ok) {
    // Fallback to legacy auth endpoint if available
    const qs = new URLSearchParams({ name, email, password }).toString();
    res = await api('/api/auth/register?' + qs, 'GET');
  }
  if (res && res.ok) {
    alert('Registration successful. Please sign in.');
    navigate('login');
  } else {
    alert('Registration failed. Try a different email.');
  }
}
function onGoogle() { navigate('home') }
function onApple() { navigate('home') }
function closeLogin() { navigate('home') }
async function logout() {
  const token = authToken || (store.user && store.user.token) || (store.counselor && store.counselor.token) || (store.admin && store.admin.token) || '';
  if (token) await api('/api/auth/logout', 'POST', { token });
  store.user = { authenticated: false, email: "", name: "", token: "" };
  store.counselor = { authenticated: false, id: null, email: "", name: "", token: "" };
  store.admin = { authenticated: false, id: null, email: "", name: "", token: "" };
  authToken = "";
  saveLocal();
  addActivity('logout', 'ok');
  ensureAuthUI();
  navigate('landing-login');
}

async function onClientLogin(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const email = (fd.get('email') || '').trim();
  const password = fd.get('password') || '';
  let res = await api('/api/accounts/login', 'POST', { email, password });
  if (!res || !res.ok) {
    const qs = new URLSearchParams({ email, password }).toString();
    res = await api('/api/auth/login?' + qs, 'GET');
  }
  if (res && res.ok) {
    store.user.authenticated = true;
    store.user.email = res.user.email;
    store.user.name = res.user.name || '';
    store.user.token = res.token || '';
    authToken = store.user.token;
    saveLocal();
    ensureAuthUI();
    navigate('home');
  } else {
    alert('Invalid email or password');
  }
}

async function onCounselorLogin(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const email = (fd.get('email') || '').trim();
  const password = fd.get('password') || '';
  const res = await api('/api/counselor/auth/login', 'POST', { email, password });
  if (res && res.ok) {
    store.counselor.authenticated = true;
    store.counselor.id = res.counselor.id;
    store.counselor.email = res.counselor.email;
    store.counselor.name = res.counselor.name || '';
    store.counselor.token = res.token || '';
    authToken = store.counselor.token;
    saveLocal();
    ensureAuthUI();
    navigate('notifications');
  } else {
    alert('Invalid counselor credentials');
  }
}

async function onAdminLogin(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const email = (fd.get('email') || '').trim();
  const password = fd.get('password') || '';
  const res = await api('/api/admin/auth/login', 'POST', { email, password });
  if (res && res.ok) {
    store.admin.authenticated = true;
    store.admin.id = res.admin.id;
    store.admin.email = res.admin.email;
    store.admin.name = res.admin.name || '';
    store.admin.token = res.token || '';
    authToken = store.admin.token;
    saveLocal();
    ensureAuthUI();
    navigate('home');
  } else {
    alert('Invalid admin credentials');
  }
}

async function onClientRegister(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = (fd.get('name') || '').trim();
  const email = (fd.get('email') || '').trim();
  const password = fd.get('password') || '';
  let res = await api('/api/accounts', 'POST', { name, email, password });
  if (!res || !res.ok) {
    const qs = new URLSearchParams({ name, email, password }).toString();
    res = await api('/api/auth/register?' + qs, 'GET');
  }
  if (res && res.ok) {
    alert('Registration successful. Please sign in.');
    navigate('client-login');
  } else {
    alert('Registration failed. Try a different email.');
  }
}

async function onAdminRegister(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = (fd.get('name') || '').trim();
  const email = (fd.get('email') || '').trim();
  const password = fd.get('password') || '';
  const res = await api('/api/admin/auth/register', 'POST', { name, email, password });
  if (res && res.ok) {
    alert('Admin registered. Please sign in.');
    navigate('admin-login');
  } else {
    alert('Admin registration failed.');
  }
}

async function renderCounselorDashboard() {
  await renderCounselorAppointments();
  await renderCounselorPayments();
  await renderCounselorFeedback();
}

async function renderCounselorAppointments(targetEl = null) {
  const root = targetEl || document.querySelector('.view.active #c-appointments') || document.querySelector('.view.active #n-appointments') || document.getElementById("c-appointments") || document.getElementById("n-appointments");
  if (!root) return;
  root.innerHTML = "";
  const cid = store.counselor.id;
  if (!cid) { root.textContent = "No counselor logged in"; return }
  const aps = await api(`/api/appointments?cid=${cid}`);
  if (!aps || aps.length === 0) {
    const li = document.createElement("li");
    li.style.color = "var(--muted)";
    li.textContent = "No appointments found";
    root.appendChild(li);
    return;
  }
  const counselor = (store.counselors || []).find(c => String(c.id) === String(cid));
  const src = counselor ? (counselor.profileImage || '') : '';
  const avatarHtml = src ? `<div class="n-avatar small"><img src="${src}" alt="Counselor"></div>` : '<div class="n-avatar placeholder"><span>👤</span></div>';

  aps.forEach(a => {
    const li = document.createElement("li");
    li.style.marginBottom = "10px";
    if (root.id === "n-appointments") {
      const status = String(a.status || '').toLowerCase();
      const actions = status === 'pending' ? `
        <div style="display:flex;gap:8px;">
          <button class="btn-formal" style="background:#1f2a48;border-color:#3bd380;color:#3bd380;padding:4px 10px;font-size:0.85em" onclick="acceptAppointment(${a.id})">Accept</button>
          <button class="btn-formal" style="background:#1f2a48;border-color:#ff5f6d;color:#ff5f6d;padding:4px 10px;font-size:0.85em" onclick="declineAppointment(${a.id})">Decline</button>
        </div>
      ` : `<div style="color:var(--muted);font-size:0.85em">${status.charAt(0).toUpperCase() + status.slice(1)}</div>`;
      li.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;padding:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px">
          ${avatarHtml}
          <div style="flex:1">
            <div style="font-weight:600;font-size:0.95em">${a.userEmail || 'Client'}</div>
            <div style="color:var(--muted);font-size:0.85em">${fmt(a.ts).date} • ${a.date} ${a.time}</div>
          </div>
          ${actions}
        </div>
      `;
    } else {
      li.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;padding:8px">
          ${avatarHtml}
          <div style="flex:1">
            <div style="font-weight:600">${a.userEmail || ''}</div>
            <div style="color:var(--muted);font-size:0.9em">${fmt(a.ts).date} • ${a.date} ${a.time} • ${a.status}</div>
            <div style="display:flex;gap:8px;margin-top:8px;">
              <button class="btn-formal" style="padding:4px 10px;font-size:0.85em" onclick="acceptAppointment(${a.id})">Accept</button>
              <input type="text" id="zoom-${a.id}" placeholder="Zoom link" value="${a.zoomLink || ''}" style="flex:1;padding:4px 8px;font-size:0.85em;background:#102a43;border:1px solid #1e2852;border-radius:4px;color:#fff">
              <button class="btn-formal" style="padding:4px 10px;font-size:0.85em" onclick="sendZoomLink(${a.id})">Send</button>
            </div>
          </div>
        </div>`;
    }
    root.appendChild(li);
  });
}

async function acceptAppointment(aid) {
  const res = await api(`/api/appointments/${aid}`, 'PUT', { status: 'accepted' });
  if (res && res.ok) {
    const aps = await api(`/api/appointments?cid=${store.counselor.id}`);
    const a = (aps || []).find(x => String(x.id) === String(aid));
    const userEmail = a ? a.userEmail : "";
    const date = a ? a.date : "";
    const time = a ? a.time : "";
    if (userEmail) {
      await upsertAppointmentNotification(userEmail, (store.counselor.name || 'Counselor'), date, time, 'accepted');
      await purgeDuplicateNotifications(userEmail);
    }
    await renderCounselorAppointments();
    await renderNotifications();
  }
}

async function sendZoomLink(aid) {
  const input = document.getElementById(`zoom-${aid}`);
  const link = (input && input.value || '').trim();
  if (!link) { alert("Enter a Zoom link"); return }
  const aps = await api(`/api/appointments?cid=${store.counselor.id}`);
  const a = (aps || []).find(x => String(x.id) === String(aid));
  const userEmail = a ? a.userEmail : "";
  await api(`/api/appointments/${aid}`, 'PUT', { zoomLink: link });
  if (userEmail) {
    await api('/api/emails', 'POST', {
      sender: store.counselor.email || "Counselor",
      recipient: userEmail,
      subject: "Your Session Zoom Link",
      body: `Dear Client,\n\nYour session link is:\n${link}\n\nBest regards,\n${store.counselor.name || 'Counselor'}`
    });
  }
  await renderCounselorAppointments();
}

async function declineAppointment(aid) {
  const res = await api(`/api/appointments/${aid}`, 'PUT', { status: 'declined' });
  if (res && res.ok) {
    const aps = await api(`/api/appointments?cid=${store.counselor.id}`);
    const a = (aps || []).find(x => String(x.id) === String(aid));
    const userEmail = a ? a.userEmail : "";
    const date = a ? a.date : "";
    const time = a ? a.time : "";
    if (userEmail) {
      await upsertAppointmentNotification(userEmail, (store.counselor.name || 'Counselor'), date, time, 'declined');
      await purgeDuplicateNotifications(userEmail);
    }
    await renderCounselorAppointments();
    await renderNotifications();
  }
}

async function upsertAppointmentNotification(userEmail, counselorName, date, time, status) {
  const booked = `Booked appointment with ${counselorName} on ${date} at ${time}`;
  const legacy = `Your appointment with ${counselorName} on ${date} at ${time}`;
  const ns = await api(`/api/notifications?email=${userEmail || ''}`);
  const existing = (ns || []).find(n => {
    const m = (n.msg || '').toLowerCase();
    return m.startsWith(booked.toLowerCase()) || m.startsWith(legacy.toLowerCase());
  });
  const msg =
    status === 'accepted' ? `${legacy} has been ACCEPTED.` :
      status === 'declined' ? `${legacy} was DECLINED.` :
        `${booked}`;
  if (existing) {
    await api(`/api/notifications/${existing.id}`, 'PUT', { msg, status });
  } else {
    await api('/api/notifications', 'POST', { email: userEmail, msg, status });
  }
}
async function renderCounselorPayments(targetEl = null) {
  const root = targetEl || document.querySelector('.view.active #c-payments') || document.querySelector('.view.active #n-payments') || document.getElementById("c-payments") || document.getElementById("n-payments");
  if (!root) return;
  root.innerHTML = "";
  const cid = store.counselor.id;
  if (!cid) { root.textContent = "No counselor logged in"; return }
  const pays = await api(`/api/payments?cid=${cid}`);
  if (!pays || pays.length === 0) {
    const li = document.createElement("li");
    li.style.color = "var(--muted)";
    li.textContent = "No payments found";
    root.appendChild(li);
    return;
  }
  pays.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${fmt(p.ts).date} • ${p.package} • ${p.name} • ${p.card}`;
    root.appendChild(li);
  });
}

async function renderCounselorFeedback(targetEl = null) {
  const root = targetEl || document.querySelector('.view.active #c-feedback-list') || document.querySelector('.view.active #n-feedback-list') || document.getElementById("c-feedback-list") || document.getElementById("n-feedback-list");
  if (!root) return;
  root.innerHTML = "";
  const cid = store.counselor.id;
  if (!cid) { root.textContent = "No counselor logged in"; return }
  const items = await api(`/api/feedback?cid=${cid}`);
  if (!items || items.length === 0) {
    const li = document.createElement("li");
    li.style.color = "var(--muted)";
    li.textContent = "No feedback yet";
    root.appendChild(li);
    return;
  }
  const counselor = (store.counselors || []).find(c => String(c.id) === String(cid));
  const src = counselor ? (counselor.profileImage || '') : '';
  const avatarHtml = src ? `<div class="n-avatar small"><img src="${src}" alt="Counselor"></div>` : '<div class="n-avatar placeholder"><span>👤</span></div>';

  items.forEach(f => {
    const li = document.createElement("li");
    li.style.marginBottom = "10px";
    const st = (f.sentiment || 'neutral').toLowerCase();
    const stColor = st === 'positive' ? '#3bd380' : st === 'negative' ? '#ff5f6d' : '#6aa5ff';
    const stLabel = `<span style="font-size:0.75em;padding:2px 8px;border-radius:999px;background:rgba(16,42,67,0.6);border:1px solid ${stColor};color:${stColor}">${st.toUpperCase()}</span>`;

    li.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:12px;padding:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px">
        ${avatarHtml}
        <div style="flex:1">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <div style="color:var(--muted);font-size:0.8em">${fmt(f.ts).date}</div>
            ${stLabel}
          </div>
          <div style="font-size:0.92em;line-height:1.4;color:var(--text)">"${f.comment || ''}"</div>
        </div>
      </div>
    `;
    root.appendChild(li);
  });
}

function usageCount(period) { const now = Date.now(); let since = now; const day = 86400000; if (period === "weekly") since = now - 7 * day; else since = now - 30 * day; return store.activities.filter(a => a.ts >= since).length }
function ratingFromCount(cnt, period) { if (period === "weekly") { if (cnt >= 7) return 5; if (cnt >= 5) return 4; if (cnt >= 3) return 3; if (cnt >= 2) return 2; if (cnt >= 1) return 1; return 0 } else { if (cnt >= 21) return 5; if (cnt >= 13) return 4; if (cnt >= 8) return 3; if (cnt >= 4) return 2; if (cnt >= 1) return 1; return 0 } }

function renderUsage() {
  const sel = document.querySelector('input[name="period"]:checked');
  const period = sel ? sel.value : 'weekly';
  const cnt = usageCount(period);
  const stars = document.getElementById("usage-stars");
  if (!stars) return;
  stars.innerHTML = "";
  const score = ratingFromCount(cnt, period);
  for (let i = 0; i < 5; i++) {
    const s = document.createElement("div");
    s.className = "star";
    if (i < score) s.classList.add("fill");
    stars.appendChild(s);
  }
  const summary = document.getElementById("usage-summary");
  if (summary) {
    const label = cnt === 1 ? "activity" : "activities";
    summary.textContent = `${cnt} ${label} ${period === 'weekly' ? 'this week' : 'this month'}`;
  }
}

function renderProfile() { const f = document.getElementById("profile-form"); if (!f) return; const saveBtn = document.getElementById("save-profile"); if (saveBtn) saveBtn.style.display = editingProfile ? "inline-block" : "none";["name", "dob", "nic", "contact", "education", "job", "about"].forEach(k => { const el = f.elements[k]; if (!el) return; el.disabled = !editingProfile; if (editingProfile) { el.value = store.user[k] || "" } else { el.value = " " } }) }
function setProfileEditing(on) { editingProfile = !!on; renderProfile() }

async function renderCounselors() {
  const list = document.getElementById("counselor-list");
  if (!list) return;
  list.innerHTML = "";

  console.log('Fetching counselors...');
  const cs = await api('/api/counselors');
  if (!cs) {
    console.error('Failed to fetch counselors');
    return;
  }
  console.log('Counselors received:', cs.length);
  store.counselors = cs;

  cs.forEach(c => {
    const card = document.createElement("div");
    card.className = "c-card";
    const head = document.createElement("div");
    head.className = "c-head";
    const avatar = document.createElement("div");
    avatar.className = "avatar";

    if (c.profileImage) {
      const img = document.createElement("img");
      img.src = c.profileImage;
      img.alt = c.name;
      avatar.appendChild(img);
    }

    const title = document.createElement("div");
    const avg = ((c.ratings.empathy + c.ratings.clarity + c.ratings.impact) / 3).toFixed(1);
    const languagesInfo = c.languages ? `<div class="c-languages">${c.languages}</div>` : "";
    const specialtyInfo = c.details.specialty ? `<div class="c-specialty" style="font-size:0.8em;color:var(--accent);margin-top:2px">${c.details.specialty}</div>` : "";
    const emailInfo = c.email ? `<div class="c-email" style="font-size:0.85em;color:var(--muted);margin-top:2px">📧 ${c.email}</div>` : "";
    title.innerHTML = `<div>${c.name}</div>${specialtyInfo}<div class="badge">⭐ ${avg}</div>${languagesInfo}${emailInfo}`;

    const status = document.createElement("div");
    status.className = "badge";
    status.style.marginLeft = "auto";
    status.textContent = c.available ? "Available" : "Busy";

    head.appendChild(avatar);
    head.appendChild(title);
    head.appendChild(status);

    const bars = document.createElement("div");
    bars.className = "bars";
    ["empathy", "clarity", "impact"].forEach(k => {
      const label = document.createElement("div");
      label.textContent = k;
      const bar = document.createElement("div");
      bar.className = "bar";
      const span = document.createElement("span");
      span.style.width = (c.ratings[k] / 5 * 100) + "%";
      bar.appendChild(span);
      bars.appendChild(label);
      bars.appendChild(bar);
    });

    card.appendChild(head);
    card.appendChild(bars);

    if (c.country && c.flag) {
      const countryEl = document.createElement("div");
      countryEl.className = "c-country";
      const isImg = c.flag.includes('/') || c.flag.includes('.');
      const flagHtml = isImg ? `<img src="${c.flag}" alt="${c.country}" style="width:20px;height:12px;object-fit:cover;border-radius:2px">` : c.flag;
      countryEl.innerHTML = `${flagHtml} <span>${c.country}</span>`;
      card.insertBefore(countryEl, card.firstChild);
    }

    list.appendChild(card);
  });

  const sel = document.getElementById("appointment-counselor");
  if (sel) {
    sel.innerHTML = "";
    cs.filter(c => c.available).forEach(c => {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = c.name;
      sel.appendChild(o);
    });
  }
}


async function startSession() {
  const cat = document.getElementById("session-category").value || categories[0];
  const notes = document.getElementById("session-notes").value || "";
  await api('/api/sessions', 'POST', { email: store.user.email, category: cat, notes, start: Date.now() });
  await api('/api/notifications', 'POST', { email: store.user.email, msg: `Live session started • ${cat}`, status: 'info' });
  renderSessions();
  if (document.getElementById("notifications").classList.contains("active")) renderNotifications();
}

async function endSession() {
  // For simplicity, we just mark the last one as ended
  const ss = await api(`/api/sessions?email=${store.user.email || ''}`);
  if (ss && ss.length > 0 && !ss[0].end) {
    const notes = document.getElementById("session-notes").value || ss[0].notes;
    await api('/api/sessions', 'POST', { ...ss[0], email: store.user.email, end: Date.now(), notes });
    const cat = ss[0].category || 'Session';
    await api('/api/notifications', 'POST', { email: store.user.email, msg: `Live session ended • ${cat}`, status: 'info' });
    renderSessions();
    if (document.getElementById("notifications").classList.contains("active")) renderNotifications();
  }
}

function maskCard(num) { const d = num.replace(/\D/g, ""); if (d.length < 4) return "****"; return "**** **** **** " + d.slice(-4) }

async function pay(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const pkg = fd.get("package");
  const card = fd.get("card");
  const name = fd.get("name");
  const expiry = fd.get("expiry");
  const body = { email: store.user.email, package: pkg, card: maskCard(String(card || "")), name, expiry };
  await api('/api/payments', 'POST', body);
  await api('/api/notifications', 'POST', { email: store.user.email, msg: `Payment processed • Package: ${pkg} • Name: ${name}`, status: 'accepted' });
  renderPayments();
  if (document.getElementById("notifications").classList.contains("active")) renderNotifications();
  e.target.reset();
}

async function renderPayments() {
  const ul = document.getElementById("payment-history");
  if (!ul) return;
  ul.innerHTML = "";
  const ps = await api(`/api/payments?email=${store.user.email || ''}`);
  if (ps) {
    ps.forEach(p => {
      const li = document.createElement("li");
      li.textContent = `${fmt(p.ts).date} • ${p.package} • ${p.card}`;
      ul.appendChild(li)
    });
  }
}

async function book(e) {
  e.preventDefault();
  const cid = document.getElementById("appointment-counselor").value;
  const date = document.getElementById("appointment-date").value;
  const time = document.getElementById("appointment-time").value;
  if (!cid || !date || !time) return;

  const counselor = store.counselors.find(c => String(c.id) === String(cid));
  const counselorName = counselor ? counselor.name : "Unknown";

  await api('/api/appointments', 'POST', { cid, date, time, email: store.user.email });
  e.target.reset();
  renderAppointments();

  showSuccessMessage(`Appointment booked successfully with ${counselorName}`);

  // Initial Pending Notification (upsert to avoid duplicates)
  await upsertAppointmentNotification(store.user.email, counselorName, date, time, 'pending');
  await purgeDuplicateNotifications(store.user.email);
  if (document.getElementById("notifications").classList.contains("active")) renderNotifications();

  // EMAIL: User Confirmation
  await api('/api/emails', 'POST', {
    sender: "System",
    recipient: store.user.email,
    subject: "Appointment Confirmation",
    body: `Dear User,\n\nYour appointment request with ${counselorName} for ${date} at ${time} has been received and is pending approval.\n\nThank you,\nMental Health Platform`
  });

  // EMAIL: To Counselor (Simulated)
  if (counselor && counselor.email) {
    await api('/api/emails', 'POST', {
      sender: store.user.email || "User",
      recipient: counselor.email,
      subject: "New Appointment Request",
      body: `Dear ${counselorName},\n\nYou have a new appointment request for ${date} at ${time}.\n\nPlease check your dashboard to accept or decline.`
    });
  }
}

function showSuccessMessage(message) { const form = document.getElementById("appointment-form"); if (!form) return; let msgDiv = document.getElementById("appointment-success"); if (!msgDiv) { msgDiv = document.createElement("div"); msgDiv.id = "appointment-success"; msgDiv.style.cssText = "background:var(--good);color:#fff;padding:12px 16px;border-radius:8px;margin-top:12px;font-weight:500;transition:opacity 0.3s ease;box-shadow:0 2px 8px rgba(59,211,128,0.3)"; form.parentNode.insertBefore(msgDiv, form.nextSibling) } msgDiv.textContent = message; msgDiv.style.opacity = "1"; setTimeout(() => { if (msgDiv) { msgDiv.style.opacity = "0"; setTimeout(() => { if (msgDiv) msgDiv.remove() }, 300) } }, 3000) }

async function renderAppointments() {
  const ul = document.getElementById("appointment-history");
  if (!ul) return;
  ul.innerHTML = "";
  const aps = await api(`/api/appointments?email=${store.user.email || ''}`);
  if (!aps || aps.length === 0) {
    ul.innerHTML = "<li style='color:var(--muted)'>No appointments booked yet</li>";
    return;
  }
  aps.forEach(a => {
    const li = document.createElement("li");
    li.textContent = `${fmt(a.ts).date} • ${a.counselorName} • ${a.date} at ${a.time} (${a.status})`;
    ul.appendChild(li)
  })
}

function speak(text) { const w = document.getElementById("chat-window"); const row = document.createElement("div"); row.className = "msg"; const b = document.createElement("div"); b.className = "bubble bot"; b.textContent = text; row.appendChild(b); w.appendChild(row); w.scrollTop = w.scrollHeight }
function sayUser(text) { const w = document.getElementById("chat-window"); const row = document.createElement("div"); row.className = "msg user"; const b = document.createElement("div"); b.className = "bubble user"; b.textContent = text; row.appendChild(b); w.appendChild(row); w.scrollTop = w.scrollHeight }
function renderChat() { const w = document.getElementById("chat-window"); if (!w) return; w.innerHTML = ""; chatHistory.forEach(m => { const row = document.createElement("div"); row.className = "msg" + (m.role === 'user' ? ' user' : ''); const b = document.createElement("div"); b.className = "bubble " + (m.role === 'user' ? 'user' : 'bot'); b.textContent = m.content; row.appendChild(b); w.appendChild(row) }); w.scrollTop = w.scrollHeight }
function reply(q) { const t = q.toLowerCase(); if (/panic|attack/.test(t)) return "Place a hand on your belly, breathe slowly: inhale 4, hold 4, exhale 6 for 3 minutes. Name five things you see."; if (/anxiety|stress|overwhelmed/.test(t)) return "Start with one small step. Try inhale 4, hold 4, exhale 6 for 3 minutes, then write one action you’ll do today."; if (/depress|sad|low mood|hopeless/.test(t)) return "You’re not alone. Text a supportive person and choose one 10‑minute activity (walk, shower, tidy). Small steps count."; if (/anger|irritat/.test(t)) return "Pause and name the feeling. Step away, splash cool water on wrists, return after 5 minutes."; if (/sleep|insomnia|night/.test(t)) return "Screens off 30 minutes before bed, dim lights, try a 10‑minute body scan or breathing."; if (/study|exam|workload|deadline|work/.test(t)) return "Break tasks into 25‑minute blocks. Write the next step, start one block, then take a 5‑minute break."; if (/relationship|partner|breakup|conflict/.test(t)) return "Use I‑statements, listen, and set a calm time to talk. If heated, pause and return later."; if (/confidence|esteem|imposter/.test(t)) return "Write three strengths and one small win today. Compare less; practice more."; if (/addict|habit|drinking|smoking/.test(t)) return "Identify triggers, plan a replacement action, and message an accountability partner."; if (/counselor|therap/.test(t)) return "Check the counselors tab for availability and booking. You can schedule an online session."; return "Tell me more about what’s happening. I’ll suggest a short, practical step." }

async function llm(q) { if (!openaiKey) return null; try { const messages = [{ role: "system", content: "You are a warm, empathetic, and friendly mental health companion. Your goal is to listen without judgment and provide support. Respond in a natural, human-like manner. Validate the user's feelings first. You can offer gentle, practical advice, but prioritize making the user feel heard and understood. Avoid repetitive or overly clinical phrasing. If the user mentions self-harm or severe crisis, kindly and firmly encourage seeking professional help immediately, but stay supportive." }, ...chatHistory.map(m => ({ role: m.role, content: m.content })), { role: "user", content: q }]; const res = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + openaiKey }, body: JSON.stringify({ model: openaiModel, messages, temperature: 0.7 }) }); if (!res.ok) { setStatus(`AI error ${res.status}`); return null } const data = await res.json(); const text = data?.choices?.[0]?.message?.content; return (text || "").trim() } catch (e) { setStatus('Network error'); return null } }
async function llmStream(q, onDelta) { if (!openaiKey) return null; try { chatAbort = new AbortController(); const messages = [{ role: "system", content: "You are a warm, empathetic, and friendly mental health companion. Your goal is to listen without judgment and provide support. Respond in a natural, human-like manner. Validate the user's feelings first. You can offer gentle, practical advice, but prioritize making the user feel heard and understood. Avoid repetitive or overly clinical phrasing. If the user mentions self-harm or severe crisis, kindly and firmly encourage seeking professional help immediately, but stay supportive." }, ...chatHistory.map(m => ({ role: m.role, content: m.content })), { role: "user", content: q }]; const res = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer " + openaiKey }, body: JSON.stringify({ model: openaiModel, messages, temperature: 0.7, stream: true }), signal: chatAbort.signal }); if (!res.ok) { setStatus(`AI error ${res.status}`); return null } const reader = res.body.getReader(); const decoder = new TextDecoder("utf-8"); let text = ""; while (true) { const { done, value } = await reader.read(); if (done) break; const chunk = decoder.decode(value, { stream: true }); chunk.split("\n").forEach(line => { const m = line.trim(); if (!m.startsWith("data:")) return; const data = m.slice(5).trim(); if (data === "[DONE]") return; try { const json = JSON.parse(data); const delta = json?.choices?.[0]?.delta?.content || ""; if (delta) { text += delta; onDelta(text) } } catch { } }) } return text } catch (e) { setStatus('Network error'); return null } finally { chatAbort = null } }

async function onChat(e) { e.preventDefault(); const input = document.getElementById("chat-input"); const q = input.value.trim(); if (!q) return; chatHistory.push({ role: 'user', content: q }); renderChat(); addActivity("chat", "message"); setStatus('Generating...'); let final = null; if (openaiKey) { const w = document.getElementById("chat-window"); const row = document.createElement("div"); row.className = "msg"; const b = document.createElement("div"); b.className = "bubble bot"; b.textContent = ""; row.appendChild(b); w.appendChild(row); w.scrollTop = w.scrollHeight; final = await llmStream(q, t => { b.textContent = t; w.scrollTop = w.scrollHeight }) } else { final = await llm(q) } if (!final) final = reply(q); chatHistory.push({ role: 'assistant', content: final }); renderChat(); input.value = ""; setStatus('') }

function renderCategories() { const sel = document.getElementById("session-category"); if (!sel) return; sel.innerHTML = ""; categories.forEach(c => { const o = document.createElement("option"); o.value = c; o.textContent = c; sel.appendChild(o) }) }

function onTimerStart() { const mins = parseInt(document.getElementById("timer-mins").value || "3", 10); let t = mins * 60; const d = document.getElementById("timer-display"); d.textContent = `${pad(Math.floor(t / 60))}:${pad(t % 60)}`; addActivity("timer_start", `${mins}m`); const id = setInterval(() => { t--; d.textContent = `${pad(Math.floor(t / 60))}:${pad(t % 60)}`; if (t <= 0) { clearInterval(id); d.textContent = "Done"; addActivity("timer_end", `${mins}m`) } }, 1000) }

let calDate = new Date();
function renderCalendar() { const m = document.getElementById("cal-month"); const g = document.getElementById("cal-grid"); if (!m || !g) return; const y = calDate.getFullYear(); const mo = calDate.getMonth(); const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; m.textContent = `${months[mo]} ${y}`; g.innerHTML = ""; const first = new Date(y, mo, 1).getDay(); const days = new Date(y, mo + 1, 0).getDate(); const today = new Date(); for (let i = 0; i < first; i++) { const d = document.createElement("div"); d.className = "cal-day empty"; g.appendChild(d) } for (let i = 1; i <= days; i++) { const d = document.createElement("div"); d.className = "cal-day"; d.textContent = i; if (y === today.getFullYear() && mo === today.getMonth() && i === today.getDate()) d.classList.add("today"); const dateStr = `${y}-${pad(mo + 1)}-${pad(i)}`; d.title = dateStr; g.appendChild(d) } }

async function registerCounselor(e) {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = {
    name: fd.get("name"),
    available: true, // Auto-enabled on registration
    email: fd.get("email"),
    password: fd.get("password"),
    languages: fd.get("languages") || "English",
    country: fd.get("country") || "Sri Lanka",
    nic: fd.get("nic"),
    profileImage: fd.get("profileImage") || "picures/Counselor.jpg",
    ratings: { empathy: 5.0, clarity: 5.0, impact: 5.0 },
    details: {
      dob: fd.get("dob"),
      civilStatus: fd.get("civilStatus"),
      education: fd.get("education"),
      experience: parseInt(fd.get("experience") || "0", 10)
    }
  };
  console.log('Registering counselor:', body);
  const res = await api('/api/counselors', 'POST', body);
  console.log('Registration response:', res);
  if (res && res.ok) {
    alert("Counselor registered successfully!");
    navigate("counselor-login");
    e.target.reset();
  } else {
    alert("Full registration failed. Please try again.");
  }
}

async function onJoinSession(e) {
  e.preventDefault();
  const link = document.getElementById("session-link").value.trim();

  if (link && (link.startsWith("http://") || link.startsWith("https://"))) {
    window.open(link, "_blank");
    await api('/api/notifications', 'POST', { email: store.user.email, msg: `Joined live session • ${link}`, status: 'info' });
    if (document.getElementById("notifications").classList.contains("active")) renderNotifications();
  } else if (link && !link.startsWith("http")) {
    // Auto-fix missing protocol if user forgets it
    window.open("https://" + link, "_blank");
    await api('/api/notifications', 'POST', { email: store.user.email, msg: `Joined live session • https://${link}`, status: 'info' });
    if (document.getElementById("notifications").classList.contains("active")) renderNotifications();
  } else {
    alert("Please enter a valid Zoom link provided by your counselor.");
  }
}

async function onFeedbackSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const counselorId = document.getElementById("feedback-counselor").value;
  const text = document.getElementById("feedback-text").value;
  const ePct = parseInt(document.getElementById("feedback-empathy")?.value || "0", 10);
  const cPct = parseInt(document.getElementById("feedback-clarity")?.value || "0", 10);
  const iPct = parseInt(document.getElementById("feedback-impact")?.value || "0", 10);

  if (!text) {
    alert("Please write a short review.");
    return;
  }

  const toFive = v => Math.max(0, Math.min(5, v / 20));
  const e5 = toFive(ePct);
  const c5 = toFive(cPct);
  const i5 = toFive(iPct);
  const overall = Math.round(((e5 + c5 + i5) / 3));
  const body = { counselorId, text, rating: overall, empathy: e5, clarity: c5, impact: i5 };

  const res = await api('/api/feedback', 'POST', body);
  if (res && res.ok) {
    // Update sentiment UI box
    const resultBox = document.getElementById('sentiment-result');
    const labelEl = document.getElementById('sentiment-label');
    const emojiEl = document.getElementById('sentiment-emoji');
    const details = document.getElementById('feedback-details');
    if (details) details.style.display = 'block';
    if (resultBox && labelEl && emojiEl) {
      const label = (res.sentiment || 'neutral').toUpperCase();
      let emoji = '😐';
      let bg = 'var(--card)';
      let border = '#1e2852';
      if (label === 'POSITIVE') { emoji = '😊'; bg = '#102a43'; border = '#3bd380' }
      else if (label === 'NEGATIVE') { emoji = '☹️'; bg = '#102a43'; border = '#ff5f6d' }
      labelEl.textContent = label;
      emojiEl.textContent = emoji;
      resultBox.style.display = 'block';
      resultBox.style.background = bg;
      resultBox.style.border = '1px solid ' + border;
      resultBox.style.boxShadow = '0 8px 18px rgba(106, 165, 255, 0.18)';
    }
    alert(`Thank you for your feedback!\nSentiment Analysis: ${(res.sentiment || 'neutral').toUpperCase()}\nYour ratings have been updated.`);
    form.reset();
    await renderCounselors(); // Refresh the counselor list to show new stats
    navigate('counselors');
  } else {
    alert("Failed to submit feedback. Please try again.");
  }
}

function bind() {
  document.querySelectorAll(".nav-btn").forEach(b => { b.addEventListener("click", (e) => { e.preventDefault(); navigate(b.dataset.view); applyLanguage(b.dataset.view) }) });
  document.querySelectorAll(".card .goto").forEach(b => b.addEventListener("click", () => { navigate(b.closest('.card').dataset.view) }));
  document.querySelectorAll(".legal-link").forEach(a => a.addEventListener("click", () => { navigate(a.dataset.view); applyLanguage() }));
  document.querySelectorAll(".back-btn").forEach(b => b.addEventListener("click", () => { navigate(b.dataset.view); applyLanguage() }));
  document.querySelectorAll(".goto-task, .goto-interview").forEach(b => b.addEventListener("click", () => { navigate(b.dataset.view) }));
  document.querySelectorAll('input[name="period"]').forEach(r => r.addEventListener("change", renderUsage));

  const forms = [
    { id: "profile-form", fn: e => { e.preventDefault(); const fd = new FormData(e.target);["name", "dob", "nic", "contact", "education", "job", "about"].forEach(k => store.user[k] = fd.get(k)); saveLocal(); addActivity("profile_update", "ok"); setProfileEditing(false) } },
    { id: "payment-form", fn: pay },
    { id: "appointment-form", fn: book },
    { id: "chat-form", fn: onChat },
    { id: "client-login-form", fn: onClientLogin },
    { id: "client-register-form", fn: onClientRegister },
    { id: "register-form", fn: onRegister },
    { id: "counselor-registration-form", fn: registerCounselor },
    { id: "counselor-login-form", fn: onCounselorLogin },
    { id: "admin-login-form", fn: onAdminLogin },
    { id: "admin-register-form", fn: onAdminRegister },
    { id: "join-session-form", fn: onJoinSession },
    { id: "feedback-form", fn: onFeedbackSubmit }
  ];
  forms.forEach(f => { const el = document.getElementById(f.id); if (el) el.addEventListener("submit", f.fn) });

  const clicks = [
    { id: "profile-edit", fn: () => setProfileEditing(true) },
    { id: "start-session", fn: startSession },
    { id: "end-session", fn: endSession },
    { id: "start-timer", fn: onTimerStart },
    { id: "login-google", fn: onGoogle },
    { id: "login-apple", fn: onApple },
    { id: "close-login", fn: closeLogin },
    { id: "logout", fn: logout },
    { id: "chat-stop", fn: () => { if (chatAbort) chatAbort.abort() } },
    { id: "chat-clear", fn: () => { chatHistory = []; renderChat(); addActivity('chat', 'clear') } },
    { id: "cal-prev", fn: () => { calDate.setMonth(calDate.getMonth() - 1); renderCalendar() } },
    { id: "cal-next", fn: () => { calDate.setMonth(calDate.getMonth() + 1); renderCalendar() } }
  ];
  clicks.forEach(c => { const el = document.getElementById(c.id); if (el) el.addEventListener("click", c.fn) });

  const fileInput = document.getElementById('counselor-file-input');
  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.ok) {
        document.getElementById('counselor-file-path').value = data.path;
      } else {
        alert('Upload failed: ' + data.error);
      }
    });
  }

  const analyzeBtn = document.getElementById('analyze-sentiment-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', async () => {
      const textEl = document.getElementById('feedback-text');
      const resultBox = document.getElementById('sentiment-result');
      const labelEl = document.getElementById('sentiment-label');
      const emojiEl = document.getElementById('sentiment-emoji');
      const details = document.getElementById('feedback-details');
      if (!textEl || !resultBox || !labelEl || !emojiEl) return;
      const t = (textEl.value || "").trim();
      if (!t) { alert("Please write your feedback first."); return }
      if (details) details.style.display = 'block';
      let label = 'neutral';
      let score = 0;
      const res = await api('/api/sentiment', 'POST', { text: t });
      if (res && res.ok) {
        label = res.label || 'neutral';
        score = res.score || 0;
      } else {
        const pos = ["good", "great", "excellent", "helpful", "kind", "supportive", "positive", "improve", "better", "happy", "satisfied", "love", "amazing", "fantastic"];
        const neg = ["bad", "poor", "terrible", "rude", "unhelpful", "negative", "worse", "sad", "angry", "unsatisfied", "disappointed", "hate", "awful", "horrible"];
        const tl = t.toLowerCase();
        const p = pos.filter(w => tl.includes(w)).length;
        const n = neg.filter(w => tl.includes(w)).length;
        if (n > p && n > 0) label = 'negative';
        else if (p > n && p > 0) label = 'positive';
        else label = 'neutral';
      }
      let emoji = '😐';
      let bg = 'var(--card)';
      let border = '#1e2852';
      if (label === 'positive') { emoji = '😊'; bg = '#102a43'; border = '#3bd380' }
      else if (label === 'negative') { emoji = '☹️'; bg = '#102a43'; border = '#ff5f6d' }
      labelEl.textContent = label.toUpperCase();
      emojiEl.textContent = emoji;
      resultBox.style.display = 'block';
      resultBox.style.background = bg;
      resultBox.style.border = '1px solid ' + border;
      resultBox.style.boxShadow = '0 8px 18px rgba(106, 165, 255, 0.18)';
    });
  }
  const emp = document.getElementById('feedback-empathy');
  const cla = document.getElementById('feedback-clarity');
  const imp = document.getElementById('feedback-impact');
  const ev = document.getElementById('feedback-empathy-val');
  const cv = document.getElementById('feedback-clarity-val');
  const iv = document.getElementById('feedback-impact-val');
  const upd = (el, lbl) => { if (el && lbl) { lbl.textContent = (el.value || "0") + "%" } };
  if (emp) emp.addEventListener('input', () => upd(emp, ev));
  if (cla) cla.addEventListener('input', () => upd(cla, cv));
  if (imp) imp.addEventListener('input', () => upd(imp, iv));
  upd(emp, ev); upd(cla, cv); upd(imp, iv);
}

const i18n = {
  en: {
    nav: { home: "Home", resources: "Readings", chat: "ChatUs", counselors: "Live", "register-counselor": "Register Counselor", notifications: "Notifications", settings: "Settings" },
    titles: { notifications: "Notifications", home: "Welcome", resources: "Common Section", chat: "Mini AI Chat", counselors: "Hire Counselor", settings: "Settings", "register-counselor": "Register as Counselor" },
    ui: {
      home_h1: "Welcome",
      welcome_p: "Select an option to begin",
      common_h3: "Common Section",
      common_p: "Advice, videos, relaxation",
      ai_h3: "Mini AI Chat",
      ai_p: "Ask and get guidance",
      hire_h3: "Hire Counselor",
      hire_p: "Availability, ratings, appointments",
      usage_h2: "Usage Rating",
      history_h2: "Session History",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      signout: "Sign out of all accounts",
      add_acc: "Add another account",
      available_immediately: "Available for appointments immediately",
      register_btn: "Register Counselor",
      back_to_settings: "← Back to Settings"
    }
  },
  si: {
    nav: { home: "මුල් පිටුව", resources: "කියවීම්", chat: "සංවාදය", counselors: "සජීවී", "register-counselor": "උපදේශක ලියාපදිංචි කිරීම", notifications: "නිවේදන", settings: "සැකසුම්" },
    titles: { notifications: "නිවේදන", home: "සාදරයෙන් පිළිගනිමු", resources: "සාමාන්‍ය අංශය", chat: "කුඩා AI සංවාදය", counselors: "උපදේශකයෝ", settings: "සැකසුම්", "register-counselor": "උපදේශක ලෙස ලියාපදිංචි වන්න" },
    ui: {
      home_h1: "සාදරයෙන් පිළිගනිමු",
      welcome_p: "ආරම්භ කිරීමට විකල්පයක් තෝරන්න",
      common_h3: "සාමාන්‍ය අංශය",
      common_p: "උපදෙස්, වීඩියෝ, ලිහිල් කිරීම",
      ai_h3: "කුඩා AI සංවාදය",
      ai_p: "විමසන්න සහ මග පෙන්වීම ලබා ගන්න",
      hire_h3: "උපදේශකයෙකු බඳවා ගන්න",
      hire_p: "ලබා ගත හැකි බව, ශ්‍රේණිගත කිරීම්, හමුවීම්",
      usage_h2: "භාවිත ශ්‍රේණිගත කිරීම",
      history_h2: "සැසි ඉතිහාසය",
      privacy: "පෞද්ගලිකත්ව ප්‍රතිපත්තිය",
      terms: "සේවා කොන්දේසි",
      signout: "සියලුම ගිණුම් වලින් ඉවත්වන්න",
      add_acc: "තවත් ගිණුමක් එක් කරන්න",
      available_immediately: "වහාම හමුවීම් සඳහා ලබා ගත හැකිය",
      register_btn: "උපදේශක ලියාපදිංචි කරන්න",
      back_to_settings: "← සැකසුම් වලට ආපසු යන්න"
    }
  }
};

function applyLanguage(view) {
  const lang = store.settings.language || 'en';
  const dict = i18n[lang] || i18n.en;

  // Update Nav
  document.querySelectorAll('nav .nav-btn').forEach(b => {
    const t = dict.nav[b.dataset.view];
    if (t) b.textContent = t;
  });

  // Update Section H2s
  Object.keys(dict.titles).forEach(id => {
    const s = document.getElementById(id);
    if (s && s.querySelector('h2')) s.querySelector('h2').textContent = dict.titles[id];
  });

  // Update general UI elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict.ui[key]) {
      if (el.tagName === 'INPUT' && (el.type === 'button' || el.type === 'submit')) {
        el.value = dict.ui[key];
      } else if (el.classList.contains('back-btn')) {
        el.textContent = dict.ui.back_to_settings;
      } else {
        el.textContent = dict.ui[key];
      }
    }
  });
}

function applyTheme() {
  const d = document.documentElement;
  d.dataset.theme = store.settings.theme;
  d.dataset.contrast = store.settings.contrast;
  d.dataset.reduced = store.settings.reduced ? "true" : "false";
  d.style.setProperty('--accent', store.settings.accent);
  d.style.setProperty('--font-scale', String(store.settings.fontScale || 1));
}

function renderAccountUI() {
  const cur = document.getElementById('account-current-email'); if (cur) cur.textContent = store.user.email || 'Not signed in';
  const greet = document.getElementById('account-greeting'); if (greet) greet.textContent = store.user.email ? `Hi, ${store.user.email.split('@')[0]}!` : 'Select an account';
  const list = document.getElementById('accounts-list'); if (list) {
    list.innerHTML = "";
    (store.settings.accounts || []).forEach(e => {
      const btn = document.createElement('button');
      btn.className = 'account-item';
      btn.innerHTML = `<span class="dot">${e[0].toUpperCase()}</span><span>${e}</span>`;
      btn.onclick = () => { store.user.email = e; saveLocal(); renderAccountUI(); renderSessions(); renderAppointments(); renderNotifications(); renderPayments(); };
      list.appendChild(btn);
    });
  }
}

async function init() {
  loadLocal();
  ensureAuthUI();
  bind();
  renderProfile();
  renderActivity();
  renderUsage();
  renderCategories();
  renderResourcesCategories();
  renderResources();
  renderChat();
  renderCalendar();
  applyTheme();
  renderAccountUI();

  // Initial API Sync
  await renderCounselors();
  navigate('landing-login');
  applyLanguage('home');
  addActivity("open", "app");

  // Settings listeners
  const ac = document.getElementById('accent-color'); if (ac) {
    ac.value = store.settings.accent || "#6aa5ff";
    ac.oninput = () => { store.settings.accent = ac.value; saveLocal(); applyTheme() };
  }
  const fs = document.getElementById('font-size'); if (fs) {
    fs.value = store.settings.fontScale || "1";
    fs.onchange = () => { store.settings.fontScale = parseFloat(fs.value); saveLocal(); applyTheme() };
  }
  const ok = document.getElementById('openai-key-input'); if (ok) {
    ok.value = store.settings.openaiKey || "";
    ok.onchange = () => { store.settings.openaiKey = ok.value; openaiKey = ok.value; saveLocal(); };
  }
  const lsel = document.getElementById('language'); if (lsel) {
    lsel.value = store.settings.language || "en";
    lsel.onchange = () => { store.settings.language = lsel.value; saveLocal(); applyLanguage(); };
  }

  // Theme & Accessibility Listeners
  document.querySelectorAll('input[name="theme"]').forEach(r => {
    if (r.value === store.settings.theme) r.checked = true;
    r.onchange = () => { store.settings.theme = r.value; saveLocal(); applyTheme(); };
  });

  const hc = document.getElementById('high-contrast'); if (hc) {
    hc.checked = store.settings.contrast === 'high';
    hc.onchange = () => { store.settings.contrast = hc.checked ? 'high' : 'normal'; saveLocal(); applyTheme(); };
  }

  const rm = document.getElementById('reduced-motion'); if (rm) {
    rm.checked = !!store.settings.reduced;
    rm.onchange = () => { store.settings.reduced = rm.checked; saveLocal(); applyTheme(); };
  }

  // TEST BYPASS: Unlock registration counselor part without exam/interview
  unlockRegistration();
}

document.addEventListener("DOMContentLoaded", init);

const mcqs = [
  { q: "A client tells you they are planning to hurt themselves tonight. What is the most important first step for a counselor?", a: ["Ask them about their childhood experiences.", "Assess the immediate risk and ensure a safety plan is in place.", "Tell them to try and think more positively.", "End the session early to give them space."], c: 1 },
  { q: "Which of these is an example of an 'Open-Ended' question used in counseling?", a: ["Did you have a good day yesterday?", "Are you feeling angry right now?", "Can you tell me more about how that situation made you feel?", "Do you want to stop the session now?"], c: 2 },
  { q: "What does 'Empathy' mean in a counseling context?", a: ["Feeling sorry for the client and their problems.", "Giving the client money or physical help.", "Understanding the client's experience from their point of view.", "Agreeing with everything the client says."], c: 2 },
  { q: "A counselor remains calm and non-judgmental even when a client admits to doing something wrong. This is known as:", a: ["Unconditional Positive Regard", "Cognitive Behavioral Therapy", "Transference", "Active Listening"], c: 0 },
  { q: "In counseling, what is 'Confidentiality'?", a: ["Sharing the client's stories with your friends.", "The rule that what is said in a session stays between the counselor and client (with some exceptions).", "Recording sessions and posting them online for education.", "Only telling the client's family about their problems."], c: 1 },
  { q: "If a counselor starts feeling angry at a client because the client reminds them of their own difficult father, this is called:", a: ["Empathy", "Counter-transference", "Congruence", "Professionalism"], c: 1 },
  { q: "What is the main goal of 'Active Listening'?", a: ["To wait for your turn to speak.", "To show the client you are truly hearing and understanding them.", "To solve the client's problems as quickly as possible.", "To memorize every word the client says."], c: 1 },
  { q: "When should a counselor break confidentiality?", a: ["Whenever the client says something interesting.", "When there is a serious risk of harm to the client or someone else.", "If the counselor's boss asks for the details for fun.", "If the client stops paying for the sessions."], c: 1 },
  { q: "What is a 'Boundary' in counseling?", a: ["A physical wall between the counselor and client.", "The limit of the professional relationship (e.g., no social media contact).", "The city limit where the counselor works.", "The number of words a client is allowed to speak."], c: 1 },
  { q: "Which approach focuses on changing negative thought patterns to improve behavior?", a: ["Psychoanalysis", "Cognitive Behavioral Therapy (CBT)", "Person-Centered Therapy", "Art Therapy"], c: 1 },
  { q: "A counselor paraphrases what a client said to check for understanding. This is called:", a: ["Reflecting", "Judging", "Interrupting", "Ignoring"], c: 0 },
  { q: "What is the 'Initial Intake' session?", a: ["The final session before therapy ends.", "The first meeting where the counselor gathers basic information and history.", "A session where the counselor talks about their own problems.", "An emergency session held in a hospital."], c: 1 },
  { q: "Why is 'Self-Care' important for counselors?", a: ["To make more money.", "To prevent 'burnout' and emotional exhaustion.", "Because counselors don't like working hard.", "To show off to the clients."], c: 1 },
  { q: "Which of these is a 'Non-Verbal' cue in counseling?", a: ["Speaking loudly.", "The counselor's body posture and eye contact.", "Asking a question about the past.", "Writing a prescription."], c: 1 },
  { q: "What should a counselor do if they realize a client is a close personal friend?", a: ["Counsel them anyway to save time.", "Refer them to a different counselor.", "Tell them all your secrets during the session.", "Charge them double the price."], c: 1 },
  { q: "In counseling, what does 'Empowerment' mean?", a: ["Giving the client orders to follow.", "Helping the client find their own strength to make decisions.", "Taking over the client's life for them.", "Making the client feel weak so they stay in therapy."], c: 1 },
  { q: "What is 'Termination' in a counseling context?", a: ["Firing the counselor.", "The planned ending of the counseling relationship.", "The counselor getting a new job.", "A punishment for a bad client."], c: 1 },
  { q: "If a client is silent for a long time during a session, the counselor should usually:", a: ["Start talking about their own day to fill the time.", "Allow the silence for a moment to let the client think.", "Shout to wake the client up.", "End the session immediately because it is boring."], c: 1 },
  { q: "What is 'Informed Consent'?", a: ["When the client pays the bill.", "When the counselor explains the risks, benefits, and rules of therapy before starting.", "When the client agrees to everything the counselor says without asking.", "A secret agreement between two counselors."], c: 1 },
  { q: "Which of these is a common 'Defense Mechanism' where a person blames others for their own feelings?", a: ["Projection", "Meditation", "Sublimation", "Happiness"], c: 0 }
];

let examTimerInterval = null;
let startTime = 0;
let counselorPassed = false;

function initExam() {
  document.getElementById('exam-intro').classList.remove('hidden');
  document.getElementById('exam-form-container').classList.add('hidden');
  document.getElementById('exam-results').classList.add('hidden');

  const startBtn = document.getElementById('start-exam-btn');
  startBtn.replaceWith(startBtn.cloneNode(true));
  document.getElementById('start-exam-btn').onclick = startExam;

  const submitBtn = document.getElementById('submit-exam-btn');
  submitBtn.onclick = submitExam;

  const retryBtn = document.getElementById('retry-exam-btn');
  retryBtn.onclick = initExam;

  const finishBtn = document.getElementById('finish-exam-btn');
  finishBtn.onclick = () => { navigate('register-counselor'); };
}

function startExam() {
  document.getElementById('exam-intro').classList.add('hidden');
  document.getElementById('exam-form-container').classList.remove('hidden');

  const container = document.getElementById('question-container');
  container.innerHTML = "";

  mcqs.forEach((m, i) => {
    const qDiv = document.createElement('div');
    qDiv.className = "q-block";
    qDiv.setAttribute('data-number', i + 1);
    qDiv.innerHTML = `<div class="q-text">${m.q}</div>`;
    const optsDiv = document.createElement('div');
    optsDiv.className = "q-opts";
    m.a.forEach((opt, oi) => {
      const lbl = document.createElement('label');
      lbl.className = "opt-label";
      lbl.innerHTML = `<input type="radio" name="q${i}" value="${oi}"> <span>${opt}</span>`;
      optsDiv.appendChild(lbl);
    });
    qDiv.appendChild(optsDiv);
    container.appendChild(qDiv);
  });

  startTime = Date.now();
  if (examTimerInterval) clearInterval(examTimerInterval);
  examTimerInterval = setInterval(() => {
    const s = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('exam-timer').textContent = `Time elapsed: ${Math.floor(s / 60)}m ${s % 60}s`;

    const answered = document.querySelectorAll('#question-container input:checked').length;
    document.getElementById('exam-progress').style.width = (answered / mcqs.length * 100) + "%";
  }, 1000);
}

function submitExam() {
  let score = 0;
  mcqs.forEach((m, i) => {
    const sel = document.querySelector(`input[name="q${i}"]:checked`);
    if (sel && parseInt(sel.value) === m.c) score++;
  });

  const perc = Math.round((score / mcqs.length) * 100);
  clearInterval(examTimerInterval);

  document.getElementById('exam-form-container').classList.add('hidden');
  document.getElementById('exam-results').classList.remove('hidden');

  const title = document.getElementById('results-title');
  const scoreEl = document.getElementById('results-score');
  const msg = document.getElementById('results-msg');
  const retry = document.getElementById('retry-exam-btn');
  const finish = document.getElementById('finish-exam-btn');

  scoreEl.textContent = perc;
  if (perc >= 80) {
    title.textContent = "Congratulations!";
    title.style.color = "var(--good)";
    msg.textContent = `You scored ${score}/20. You have successfully passed the competency test and are now authorized to register.`;
    retry.classList.add('hidden');
    finish.classList.remove('hidden');
    unlockRegistration();
  } else {
    title.textContent = "Not Quite There";
    title.style.color = "var(--bad)";
    msg.textContent = `You scored ${score}/20 (${perc}%). You need at least 80% to register. Please review the materials and try again.`;
    retry.classList.remove('hidden');
    finish.classList.add('hidden');
  }
}

function unlockRegistration() {
  counselorPassed = true;
  const panel = document.getElementById('registration-form-panel');
  panel.style.opacity = "1";
  panel.style.pointerEvents = "all";
  panel.style.filter = "none";

  // SHOW BOTH: Keep the original buttons/warning, and append the success message below.
  const status = document.getElementById('task-unlock-status');
  // Avoid duplicating if called multiple times
  if (status && !document.getElementById('demo-success-msg')) {
    const successDiv = document.createElement('div');
    successDiv.id = 'demo-success-msg';
    successDiv.innerHTML = "<span>✅ <strong>Verification Successful:</strong> Assessment passed. Form unlocked below.</span>";

    // Inline styling for the success message
    successDiv.style.marginTop = "15px";
    successDiv.style.padding = "12px";
    successDiv.style.background = "rgba(59, 211, 128, 0.1)";
    successDiv.style.border = "1px solid var(--good)";
    successDiv.style.borderRadius = "8px";
    successDiv.style.color = "var(--good)";
    successDiv.style.fontWeight = "500";
    successDiv.style.display = "flex";
    successDiv.style.alignItems = "center";
    successDiv.style.gap = "10px";

    status.parentNode.insertBefore(successDiv, status.nextSibling);
  }
}
