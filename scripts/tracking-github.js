/* LIA Intelligence: this file is added only to the GitHub Pages build. */
(() => {
  if (location.hostname !== 'thealanlu.github.io' || !location.pathname.startsWith('/lia/')) return;
  if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) { document.documentElement.dataset.liaAnalytics = 'privacy-disabled'; return; }
  const endpoint = 'https://lia-intelligence-collector.thealanlu.chatgpt.site/collect';
  const allowed = ['/lia/', '/lia/about/', '/lia/admission/', '/lia/inquire/', '/lia/request-info/', '/lia/serve/'];
  if (!allowed.includes(location.pathname)) return;
  let fallback = crypto.randomUUID();
  function session() {
    try {
      const old = JSON.parse(sessionStorage.getItem('lia-intelligence-session') || 'null');
      const value = {id: old && Date.now() - old.at < 1800000 ? old.id : crypto.randomUUID(), at: Date.now()};
      sessionStorage.setItem('lia-intelligence-session', JSON.stringify(value));
      return value.id;
    } catch { return fallback; }
  }
  let referrer = '';
  try { referrer = document.referrer ? new URL(document.referrer).origin : ''; } catch {}
  function send(type) {
    const body = JSON.stringify({id:crypto.randomUUID(),session:session(),type,path:location.pathname,referrer});
    document.documentElement.dataset.liaAnalytics = 'sending';
    fetch(endpoint, {method:'POST', body, headers:{'Content-Type':'text/plain'},credentials:'omit',keepalive:true,mode:'cors'}).then(response => { document.documentElement.dataset.liaAnalytics = response.ok ? 'delivered' : 'rejected-' + response.status; }).catch(() => { document.documentElement.dataset.liaAnalytics = 'delivery-failed'; });
  }
  let viewed = false;
  function view() { if (!viewed && document.visibilityState === 'visible') { viewed = true; send('page_view'); } }
  view();document.addEventListener('visibilitychange',view);
  document.addEventListener('click', e => {
    const link=e.target.closest('a[href]');if(!link)return;
    try { const u=new URL(link.href);if(['mailto:','tel:'].includes(u.protocol))send('contact_click');else if(u.protocol==='https:'&&u.origin!==location.origin)send('outbound_click'); } catch {}
  });
  let started=false;
  document.addEventListener('focusin', e => {if(!started&&e.target.closest('form')&&['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)){started=true;send('inquiry_start');}});
})();
