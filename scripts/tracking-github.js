/* LIA Intelligence v2. GitHub Pages only; never collects field values, raw queries, or persistent visitor IDs. */
(() => {
  const root=document.documentElement;
  const HOST='thealanlu.github.io',PATHS=['/lia/','/lia/about/','/lia/admission/','/lia/inquire/','/lia/request-info/','/lia/serve/'];
  if(location.hostname!==HOST||!PATHS.includes(location.pathname))return;
  // This preference is local to this browser; it is never a visitor identifier.
  const exclusion=new URLSearchParams(location.search).get('lia_tracking');
  try{if(exclusion==='exclude')localStorage.setItem('lia-exclude-self','1');if(exclusion==='include')localStorage.removeItem('lia-exclude-self');if(exclusion){const clean=new URL(location.href);clean.searchParams.delete('lia_tracking');history.replaceState(null,'',clean.pathname+clean.search+clean.hash)}if(localStorage.getItem('lia-exclude-self')==='1'){root.dataset.liaAnalytics='owner-excluded';return}}catch{}
  if(navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true){root.dataset.liaAnalytics='privacy-disabled';return;}
  const endpoint='https://lia-intelligence.thealanlu.chatgpt.site/collect';
  const uid=()=>crypto.randomUUID(),pageId=uid(),engagementId=uid(),performanceId=uid(),pagePath=location.pathname;
  const round=(n,step)=>Math.round(n/step)*step;
  const tag=v=>typeof v==='string'&&/^[a-z0-9][a-z0-9_. -]{0,49}$/i.test(v)&&!/^\d{8,}$/.test(v)?v.trim().replace(/\s+/g,'-'):'';
  let referrer='';try{referrer=document.referrer?new URL(document.referrer).hostname:''}catch{}
  const params=new URLSearchParams(location.search),campaign={};
  for(const key of ['source','medium','campaign','content']){const value=tag(params.get('utm_'+key));if(value)campaign['utm_'+key]=value;}
  let sessionValue;try{sessionValue=JSON.parse(sessionStorage.getItem('lia-intelligence-session')||'null')}catch{}
  if(!sessionValue||!sessionValue.id||Date.now()-sessionValue.at>=1800000)sessionValue={id:uid(),at:Date.now(),attribution:{referrer:referrer&&referrer!==HOST?referrer:'',...campaign}};
  if(!sessionValue.attribution)sessionValue.attribution={referrer:referrer&&referrer!==HOST?referrer:'',...campaign};
  function session(){if(Date.now()-sessionValue.at>=1800000)sessionValue={id:uid(),at:Date.now(),attribution:{referrer:referrer&&referrer!==HOST?referrer:'',...campaign}};sessionValue.at=Date.now();try{sessionStorage.setItem('lia-intelligence-session',JSON.stringify(sessionValue))}catch{}return sessionValue.id;}
  function context(){return {schemaVersion:2,pageId,session:session(),path:pagePath,referrer,attribution:sessionValue.attribution,language:(navigator.language||'').split('-')[0].toLowerCase(),timezone:Intl.DateTimeFormat().resolvedOptions().timeZone,screenBucket:round(screen.width,100)+'×'+round(screen.height,100),viewportBucket:round(innerWidth,50)+'×'+round(innerHeight,50),network:navigator.connection?.effectiveType||'Unknown',colorScheme:matchMedia('(prefers-color-scheme: dark)').matches?'Dark':'Light'};}
  function send(type,extra={},id=uid()){root.dataset.liaAnalytics='sending';const body=JSON.stringify({id,type,...context(),...extra});fetch(endpoint,{method:'POST',headers:{'Content-Type':'text/plain'},body,credentials:'omit',keepalive:true,mode:'cors'}).then(r=>{root.dataset.liaAnalytics=r.ok?'delivered':'rejected-'+r.status}).catch(()=>{root.dataset.liaAnalytics='delivery-failed'});}
  let viewed=false,visibleMs=0,visibleStart=document.visibilityState==='visible'?performance.now():null,maxScroll=0,lastScroll=0;
  const milestones=new Set();let hadInput=false;
  const visibleTime=()=>Math.round(visibleMs+(visibleStart===null?0:performance.now()-visibleStart));
  function depth(){const denom=Math.max(0,document.documentElement.scrollHeight-innerHeight);maxScroll=Math.max(maxScroll,denom?Math.min(100,Math.round(scrollY/denom*100)):100);}
  function view(){if(!viewed&&document.visibilityState==='visible'){viewed=true;send('page_view');}}
  function engagement(){if(!viewed)return;depth();send('engagement',{visibleMs:visibleTime(),scrollPercent:maxScroll,hadInput},engagementId);}
  const perf={};let clsWindow=0,clsStart=0,clsLast=0,maxCls=0;
  function observe(type,callback){try{if(PerformanceObserver.supportedEntryTypes.includes(type)){const o=new PerformanceObserver(list=>callback(list.getEntries()));o.observe({type,buffered:true,...(type==='event'?{durationThreshold:16}:{})});return o;}}catch{}}
  observe('paint',entries=>{for(const e of entries)if(e.name==='first-contentful-paint')perf.fcpMs=Math.round(e.startTime)});
  observe('largest-contentful-paint',entries=>{const e=entries.at(-1);if(e)perf.lcpMs=Math.round(e.startTime)});
  const layoutObserver=observe('layout-shift',entries=>{for(const e of entries){if(e.hadRecentInput)continue;if(e.startTime-clsLast<1000&&e.startTime-clsStart<5000)clsWindow+=e.value;else{clsWindow=e.value;clsStart=e.startTime}clsLast=e.startTime;maxCls=Math.max(maxCls,clsWindow)}perf.cls=Math.round(maxCls*10000)/10000;});if(layoutObserver)perf.cls=0;
  observe('event',entries=>{for(const e of entries)if(e.interactionId)perf.maxInteractionMs=Math.max(perf.maxInteractionMs||0,Math.round(e.duration));});
  function performanceReport(){if(!viewed)return;const nav=performance.getEntriesByType('navigation')[0];if(nav){perf.ttfbMs=Math.round(nav.responseStart-nav.requestStart);if(nav.domContentLoadedEventEnd>0)perf.domReadyMs=Math.round(nav.domContentLoadedEventEnd);if(nav.loadEventEnd>0)perf.loadMs=Math.round(nav.loadEventEnd);perf.navigationType=nav.type;perf.transferBytes=nav.transferSize;perf.resourceCount=performance.getEntriesByType('resource').length;}if(Object.keys(perf).length)send('performance',perf,performanceId);}
  view();document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){if(visibleStart!==null)visibleMs+=performance.now()-visibleStart;visibleStart=null;engagement();performanceReport();}else{visibleStart=performance.now();view();}});
  addEventListener('pagehide',()=>{engagement();performanceReport()});addEventListener('pageshow',e=>{if(e.persisted)visibleStart=performance.now()});
  setTimeout(()=>{performanceReport();engagement()},5000);
  setInterval(()=>{if(document.visibilityState==='visible'){engagement();performanceReport()}},15000);
  addEventListener('scroll',()=>{if(!viewed||performance.now()-lastScroll<200)return;lastScroll=performance.now();depth();for(const threshold of [25,50,75,90,100])if(maxScroll>=threshold&&!milestones.has(threshold)){milestones.add(threshold);send('scroll_depth',{scrollPercent:threshold})}},{passive:true});
  document.addEventListener('pointerdown',()=>{hadInput=true},{passive:true});document.addEventListener('keydown',()=>{hadInput=true},{passive:true});
  document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;try{const u=new URL(a.href);if(['mailto:','tel:'].includes(u.protocol))send('contact_click',{actionKey:u.protocol==='mailto:'?'email':'phone'});else if(u.origin===location.origin&&PATHS.includes(u.pathname)){if(u.pathname!==pagePath)send('navigation_click',{targetPath:u.pathname,actionKey:u.pathname==='/lia/inquire/'?'inquire':'navigation'});else if(/^#[a-z0-9_-]{1,40}$/i.test(u.hash))send('anchor_click',{actionKey:'section',targetKey:u.hash.slice(1)})}else if(u.protocol==='https:')send('outbound_click',{targetHost:u.hostname,actionKey:u.hostname==='maps.app.goo.gl'?'map':'outbound'});}catch{}});
  const inquiryForm=document.querySelector('#inquiry-form');
  if(inquiryForm){for(const [name,value]of Object.entries({'lia-source':'github-pages','lia-session':session(),'lia-page-id':pageId})){let field=inquiryForm.querySelector('[name="'+name+'"]');if(!field){field=document.createElement('input');field.type='hidden';field.name=name;inquiryForm.append(field)}field.value=value}}
  let formStarted=false,lastInvalid=0;
  document.addEventListener('focusin',e=>{if(!formStarted&&e.target.closest('form')&&['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)){formStarted=true;send('inquiry_start',{actionKey:'form-start'})}});
  document.addEventListener('submit',e=>{if(e.target.matches('form'))send('form_submit',{actionKey:'form-attempt'})},true);
  document.addEventListener('invalid',e=>{if(Date.now()-lastInvalid<1000)return;lastInvalid=Date.now();send('form_validation',{fieldType:['email','tel','text','textarea','select-one'].includes(e.target.type)?e.target.type:'other',errorKind:e.target.validity?.valueMissing?'required':e.target.validity?.typeMismatch?'type':'format'})},true);
  const status=document.querySelector('#form-status');if(status)new MutationObserver(()=>{if(status.dataset.state==='error')send('form_error',{actionKey:'form-error'})}).observe(status,{attributes:true,attributeFilter:['data-state']});
  let errors=0;const errorClass=e=>['Error','TypeError','ReferenceError','SyntaxError','RangeError','URIError'].includes(e?.name)?e.name:'Error';
  addEventListener('error',e=>{if(errors++>=5)return;if(e.target!==window){send('client_error',{errorKind:'resource',resourceType:['IMG','SCRIPT','LINK','VIDEO','AUDIO'].includes(e.target.tagName)?e.target.tagName:'OTHER'});return}let file='';try{const u=new URL(e.filename);if(u.origin===location.origin&&u.pathname.startsWith('/lia/assets/'))file=u.pathname}catch{}send('client_error',{errorKind:'javascript',errorClass:errorClass(e.error),errorFile:file,errorLine:Math.min(e.lineno||0,100000)})},true);
  addEventListener('unhandledrejection',e=>{if(errors++<5)send('client_error',{errorKind:'unhandled-promise',errorClass:errorClass(e.reason)})});
})();
