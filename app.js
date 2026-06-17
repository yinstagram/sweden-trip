/* Sweden 2026 PWA — app.js v2 (5 tabs, visual) */
(function(){
const S = window.SWEDEN, V = document.getElementById('view');
let map=null,dmap=null,curDay=null,showSaved=false,photoLayer=false,kitSub='pack',markers=[];
window.addEventListener('unhandledrejection',e=>{if(String(e.reason&&e.reason.name||e.reason||'').includes('AbortError'))e.preventDefault();});
const consoleError=console.error.bind(console);
console.error=(...args)=>{if(args.some(x=>String((x&&x.message)||x).includes('AbortError')))return;consoleError(...args);};
const $ = s=>document.querySelector(s);
const esc = t=>(''+t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const dayById = id=>S.DAYS.find(d=>d.id===id);
const legOf = id=>(S.LEGS.find(l=>l.days.includes(id))||{}).key;
const img = d=>'img/'+(S.HERO[d.id]||'stockholm')+'.jpg';
const DAY_MS=864e5, TRIP_START=new Date(2026,5,27);
const clockMin=t=>{const m=(''+(t||'')).match(/(\d{1,2}):(\d{2})/);return m?(+m[1])*60+(+m[2]):9999;};
const stepLabel=s=>s?(s.title||s.a||''):'';
function nowInfo(){
  const q=new URLSearchParams(location.search), raw=q.get('now')||q.get('mockNow')||localStorage.sw_mock_now||'';
  if(raw){const d=new Date(raw.replace(' ','T'));if(!Number.isNaN(+d))return{date:d,mock:true,raw};}
  return{date:new Date(),mock:false,raw:''};
}
const getNow=()=>nowInfo().date;
const tripIdx=(now=getNow())=>Math.floor((now-TRIP_START)/DAY_MS);
const short=t=>{t=(''+(t||'')).replace(/\s+/g,' ').trim();return t.length>92?t.slice(0,90)+'…':t;};
const bkMeta=s=>S.BK[s]||{ico:'•',t:'狀態未分類',c:'#9ca3af'};
const bkClass=s=>S.BK[s]?s:'todo';
// 用「地名」query → Google Maps 顯示有名嘅標點(有營業時間/相/評價);冇名先用座標 fallback
const gmaps = (q,ll)=>{
  if(q&&typeof q==='string'){const name=q.replace(/（[^）]*）|\([^)]*\)/g,'').replace(/[:：].*$/,'').trim();
    if(name&&!/^(到|去|搭|退房|起身|執|早餐|晚餐|起行|轉機)/.test(name))
      return`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name+' Sweden')}`;}
  return ll?`https://www.google.com/maps/search/?api=1&query=${ll[0]}%2C${ll[1]}`:'#';
};
// 路線:座標 origin/dest/waypoints,唔指定 travelmode → Google 自動揀,保證畫到路線
const dirURL = stops=>{const p=stops.filter(s=>!s.opt).sort((a,b)=>a.o-b.o).map(s=>s.ll[0]+','+s.ll[1]);
  if(p.length<2)return null;return`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(p[0])}&destination=${encodeURIComponent(p[p.length-1])}`+(p.length>2?`&waypoints=${encodeURIComponent(p.slice(1,-1).join('|'))}`:'');};
// 電話自動 tel: link(esc 之後先 call,避免 over-escape);保守 regex(+46 / 0 開頭長號)
const telLink=t=>(''+t).replace(/(\+46[\s\d-]{6,}\d|\b0\d{2,3}[\s-]?\d{2}[\s-]?\d{2}[\d\s-]*\d)/g,m=>`<a href="tel:${m.replace(/[^\d+]/g,'')}">${m.trim()}</a>`);
const wxURL=ll=>`https://www.yr.no/en/forecast/daily-table/${ll[0]},${ll[1]}`;
function chips(d){const set=new Set();(d.stops||[]).forEach(s=>{const t=(s.cat||'')+(s.note||'')+(s.n||'');
  if(/攝影|影相|晨攝|觀景|日落|午夜太陽|舊城|步道|群島|湖|公園/.test(t))set.add('📷 攝影');
  if(/咖啡|café|fika|Café/i.test(t))set.add('☕ 咖啡');
  if(/🎵|演唱會|Robyn|Avicii|Allsång|電音|indie|戲院/.test(t))set.add('🎵 音樂');
  if(/🧶|毛線|手工藝|紡織/.test(t))set.add('🧶 毛線');
  if(/餐廳|魚湯|肉丸|brunch|Saluhall|市場|餐/.test(t))set.add('🍽 食');});
  return [...set];}
function isPhoto(s){return /攝影|影相|晨攝|觀景|日落|午夜太陽|舊城|步道|群島|湖|塔|hero/.test((s.cat||'')+(s.note||''));}

/* theme + font */
const root=document.documentElement;
function applyTheme(t){root.setAttribute('data-theme',t);localStorage.sw_theme=t;if(map)setTimeout(()=>map.resize(),60);}
$('#themeBtn').onclick=()=>{const c=localStorage.sw_theme||'auto';applyTheme(c==='auto'?'dark':c==='dark'?'light':'auto');};
applyTheme(localStorage.sw_theme||'auto');
let fs=+(localStorage.sw_fs||16);const setFs=v=>{fs=Math.max(13,Math.min(21,v));root.style.setProperty('--fs',fs+'px');localStorage.sw_fs=fs;};
$('#fontUp').onclick=()=>setFs(fs+1);$('#fontDown').onclick=()=>setFs(fs-1);setFs(fs);

/* tabs */
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>go(b.dataset.tab));
function killDmap(){if(dmap){try{dmap.remove()}catch(e){}dmap=null;}}
function go(tab,arg){killDmap();document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('is-active',b.dataset.tab===tab));window.scrollTo(0,0);
  ({now:renderNow,days:renderDays,map:renderMap,status:renderStatus,kit:renderKit}[tab]||renderNow)(arg);}

/* ---------- 此刻 NOW ---------- */
function renderNow(){
  const ni=nowInfo(), now=ni.date;
  const D=S.DAYS, bk=D.flatMap(d=>(d.bk||[]).map(b=>({...b,date:d.date})));
  const paid=bk.filter(b=>b.s==='paid').length,pend=bk.filter(b=>b.s==='pend').length,todo=bk.filter(b=>b.s==='todo').length,hold=bk.filter(b=>b.s==='hold').length;
  const dayIdx=tripIdx(now);
  const daysUntil=Math.ceil((TRIP_START-now)/DAY_MS);
  const cd = daysUntil>0?`出發前 <b>${daysUntil}</b> 日`:(dayIdx>=0&&dayIdx<D.length?`旅程第 ${dayIdx+1} 日`:'旅程已完');
  const today=(dayIdx>=0&&dayIdx<D.length)?D[dayIdx]:null,nx=today?D[dayIdx+1]:null;
  const heroD=today||dayById('d0629');
  const dis=JSON.parse(localStorage.sw_dismiss||'{}');
  const tEX=today?S.EX[today.id]:null;
  // 時間感「下一步」timeline(旅程進行中)
  const nowMin=now.getHours()*60+now.getMinutes();
  let stepsHtml='',assistHtml='';
  const ssrc=today&&((S.TL&&S.TL[today.id])||today.tl||today.steps);
  if(ssrc&&ssrc.length){
    const ss=ssrc; let cur=-1; ss.forEach((s,i)=>{if(clockMin(s.t)<=nowMin)cur=i;});
    const nextI=cur+1; const lbl=s=>s.title||s.a;
    const current=cur>=0?ss[cur]:null,next=ss[nextI]||null;
    const tonight=ss.find((s,i)=>i>=Math.max(nextI,0)&&clockMin(s.t)>=17*60&&/晚餐|dinner|獨木舟|kayak|Fotografiska|Hermans|Aifur|Sturehof|Arctic Culinary|check-in|就寢|返回|返 /.test(stepLabel(s)))||ss.find(s=>clockMin(s.t)>=18*60);
    const prepRe=/帶齊|準備|執|買|check|裝備|泳衣|防水袋|乾衫|毛巾|退稅|護照|叉滿/i;
    const needsPrep=s=>prepRe.test([stepLabel(s),s.desc,s.warn,...(s.buy||[]),...(s.tips||[])].filter(Boolean).join(' '));
    const futurePrep=ss.filter((s,i)=>i>=Math.max(nextI,0)&&needsPrep(s)).slice(0,2);
    const prepPool=[current,next,...futurePrep].filter(Boolean);
    const prepBits=s=>[...(s.buy||[]),s.warn,...(s.tips||[]),needsPrep(s)?`${s.t||''} ${stepLabel(s)}${s.desc?'：'+s.desc:''}`:''].filter(Boolean);
    const prep=[...new Set(prepPool.flatMap(prepBits).map(short))].slice(0,3);
    const concern=short((current&&current.warn)||(next&&next.warn)||(tonight&&tonight.warn)||(tEX&&tEX.tip)||'跟住時間線行就得,下一步開始前先飲水/叉電/睇路線。');
    const fmt=s=>s?`<b>${esc(s.t||'')}</b> ${telLink(esc(short(stepLabel(s))))}`:'<span class="muted">未開始</span>';
    assistHtml=`<div class="nowassist">
      <div class="na-head"><span>${ni.mock?'🧪 測試此刻':'⚡ 此刻提示'}</span><b>${today.date} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}</b></div>
      <div class="na-grid">
        <div class="na-card focus"><span>而家</span><p>${fmt(current)}</p></div>
        <div class="na-card"><span>下一步</span><p>${fmt(next)}</p></div>
        <div class="na-card"><span>今晚</span><p>${fmt(tonight)}</p></div>
        <div class="na-card warn"><span>即時關注</span><p>${telLink(esc(concern))}</p></div>
      </div>
      ${prep.length?`<div class="na-prep"><b>出門前 / 轉場前</b>${prep.map(x=>`<div>${telLink(esc(x))}</div>`).join('')}</div>`:''}
      <button class="notifybtn" onclick="window.__notifyToday()">🔔 開今日提醒</button>
      <div class="na-note">通知係 best-effort: app/瀏覽器開住最可靠,無 backend 時唔保證關 app 後仍會響。</div>
    </div>`;
    stepsHtml=`<div class="ns">${ss.map((s,i)=>{
      const cl=i<cur?'done':i===cur?'now':i===nextI?'next':'up';
      const tag=i===nextI?'👉 ':i===cur?'▸ ':'';
      return `<div class="ns-row ${cl}"><span class="ns-t">${s.t}</span><span class="ns-a">${tag}${telLink(esc(lbl(s)))}</span></div>`;
    }).join('')}${cur>=ss.length-1?`<div class="ns-row up"><span class="ns-t">✓</span><span class="ns-a">今日行程完${nx?`,準備聽日 ${esc(nx.title)}`:''}</span></div>`:''}</div>`;
  }
  const todayInner = stepsHtml || (tEX?`<div style="font-size:13px"><b style="color:var(--gold2)">🎒</b> ${telLink(esc(tEX.carry))}</div><div style="font-size:13px;margin-top:5px"><b style="color:var(--gold2)">⏱</b> ${telLink(esc(tEX.pace))}</div>`:'');
  const todayBlock=today?`<div class="card today" style="border-left:4px solid ${today.color}"><div class="today-h" style="color:${today.color}">📍 今日 ${today.date}（${today.dow}）· ${esc(today.title)}</div>${todayInner}<button class="btn ghost" style="margin-top:11px" onclick="window.__dayDetail('${today.id}')">睇今日全部 ›</button>${nx&&!stepsHtml?`<div class="muted" style="font-size:12px;margin-top:9px">明日 ${nx.date}：${esc(nx.title)}</div>`:''}</div>`:'';
  V.innerHTML=`
   <div class="nowhero ${today?'live':''}" style="background-image:linear-gradient(180deg,rgba(5,6,14,.15),rgba(5,6,14,.92)),url('${img(heroD)}')">
     <div class="nh-top">🇸🇪 Sweden 2026</div>
     <div class="nh-big">${cd}</div>
   </div>
   ${assistHtml}
   ${todayBlock}
   <div class="sec-h">📊 一眼睇晒 Booking</div>
   <div class="statgrid">
     <div onclick="window.__go('status')"><div class="n" style="color:var(--green)">${paid}</div><div class="l">✅ 已訂</div></div>
     <div onclick="window.__go('status')"><div class="n" style="color:var(--amber)">${pend}</div><div class="l">⏳ 等緊</div></div>
     <div onclick="window.__go('status')"><div class="n" style="color:var(--cyan)">${todo+hold}</div><div class="l">🕒 要訂/依賴</div></div>
   </div>
   <div class="sec-h">⚡ 快捷</div>
   <div class="quickrow">
     <button class="quick" onclick="window.__go('days')">📅<span>行程</span></button>
     <button class="quick" onclick="window.__go('map')">🗺️<span>地圖</span></button>
     <button class="quick" onclick="window.__go('status')">📋<span>狀態</span></button>
     <button class="quick" onclick="window.__go('kit')">🆘<span>緊急/清單</span></button>
   </div>
   <div class="muted" style="font-size:11.5px;margin-top:16px">⚠️ 所有 2026 年 7 月暑期 hours/班次/天氣 = 臨行前一星期 reconfirm。圖片 CC 授權(見實用 tab)。更新 ${esc(S.TRIP.updated)}。</div>`;
}
window.__go=go; window.__photomap=()=>{photoLayer=true;go('map');};
window.__dayDetail=id=>{go('days');setTimeout(()=>renderDayDetail(id),20);};
window.__dismiss=k=>{const d=JSON.parse(localStorage.sw_dismiss||'{}');d[k]=1;localStorage.sw_dismiss=JSON.stringify(d);renderNow();};
let notifyTimers=[];
window.__notifyToday=async()=>{
  const now=getNow(), i=tripIdx(now), today=(i>=0&&i<S.DAYS.length)?S.DAYS[i]:null;
  if(!today){alert('而家唔喺旅程日期內,未有今日提醒。');return;}
  if(!('Notification' in window)){alert('呢個瀏覽器唔支援通知;請用此刻頁面做 in-app 提醒。');return;}
  const perm=Notification.permission==='granted'?'granted':await Notification.requestPermission();
  if(perm!=='granted'){alert('通知未開到;你仍然可以用此刻頁面睇即時提示。');return;}
  notifyTimers.forEach(clearTimeout);notifyTimers=[];
  const ss=((S.TL&&S.TL[today.id])||today.tl||today.steps||[]), nowMin=getNow().getHours()*60+getNow().getMinutes();
  const important=s=>s.k==='fixed'||s.warn||/晚餐|火車|巴士|飛|出發|check|獨木舟|kayak|買|取車|還車|登機|早餐/.test(stepLabel(s));
  const upcoming=ss.filter(s=>clockMin(s.t)>nowMin&&important(s)).slice(0,6);
  const show=(title,body,tag)=>{
    const opt={body,tag,renotify:false,icon:'icons/icon-192.png'};
    if(navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(r=>r.showNotification(title,opt)).catch(()=>new Notification(title,opt));
    else new Notification(title,opt);
  };
  if(!upcoming.length){show('🇸🇪 今日提醒','今日餘下冇重大固定提醒;繼續跟此刻頁面。','sw-done');return;}
  show('🇸🇪 今日提醒已開',`已排 ${upcoming.length} 個 app 開住時嘅提醒。`,'sw-ready');
  upcoming.forEach(s=>{const delay=Math.max(1000,(clockMin(s.t)-nowMin)*60000);notifyTimers.push(setTimeout(()=>show(`⏰ ${s.t} ${short(stepLabel(s))}`,short(s.warn||s.desc||'到時間處理下一步。'),`sw-${today.id}-${s.t}`),delay));});
};

/* ---------- 行程 DAYS ---------- */
let dayLeg='all';
function renderDays(){
  let legbtns=`<button class="legchip ${dayLeg==='all'?'on':''}" data-l="all">全部</button>`+
    S.LEGS.map(l=>`<button class="legchip ${dayLeg===l.key?'on':''}" data-l="${l.key}" style="${dayLeg===l.key?`background:${l.accent};border-color:${l.accent};color:#10141f`:`border-color:color-mix(in srgb,${l.accent} 55%,transparent);color:${l.accent}`}">${esc(l.name)}</button>`).join('');
  let cards='';
  S.DAYS.filter(d=>dayLeg==='all'||legOf(d.id)===dayLeg).forEach(d=>{
    const cs=chips(d).map(c=>`<span class="chip">${c}</span>`).join('');
    const sun=S.SUN[legOf(d.id)];
    cards+=`<button class="daycard" data-d="${d.id}" style="--dc:${d.color}">
      <div class="dc-img" style="background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.78)),url('${img(d)}')">
        <div class="dc-date">${d.date} ${d.dow}</div>
        ${sun?`<div class="dc-sun">${sun.badge}</div>`:''}
        <div class="dc-ttl">${esc(d.title)}</div>
        <div class="dc-th">${esc(d.theme)}</div>
      </div>
      <div class="dc-chips">${cs||'<span class="chip">📍 行程</span>'}</div></button>`;
  });
  V.innerHTML=`<h1 class="pg">📅 行程</h1><div class="pg-sub">撳一日 = 大相 + 地圖 + 黃金時刻 + 全細節</div>
    <div class="legrow">${legbtns}</div>${cards}`;
  V.querySelectorAll('.legchip').forEach(b=>b.onclick=()=>{dayLeg=b.dataset.l;renderDays();});
  V.querySelectorAll('.daycard').forEach(b=>b.onclick=()=>renderDayDetail(b.dataset.d));
}
/* ---------- 時間軸 timeline（收合卡）---------- */
let BUY=JSON.parse(localStorage.sw_buy||'{}');
const KIND={fixed:{c:'#e8956a'},move:{c:'#7c89b5'},task:{c:'#34c6d8'},flex:{c:'#a78bda'}};
const toMinT=t=>{const p=(''+(t||'0:0')).split(':');return (+p[0]||0)*60+(+p[1]||0);};
function tripDayId(){const i=tripIdx(getNow());return (i>=0&&i<S.DAYS.length)?S.DAYS[i].id:null;}
function wxBar(leg){const w=S.WX&&S.WX[leg];if(!w)return'';
  const rows=(w.rows||[]).map(r=>`<div class="wxrow"><span class="wxk">${esc(r[0])}</span><span class="wxv">${esc(r[1])}</span></div>`).join('');
  return`<details class="wxbar"><summary><span>🌤 今日天氣</span><span class="wxchip">${esc(w.chip)}</span><span class="wxcaret">▾</span></summary><div class="wxd">${rows||esc(w.detail||'')}${w.note?`<div class="wxnote">⚠️ ${esc(w.note)}</div>`:''}</div></details>`;}
function hikePlanBHtml(id){
  const p=S.HIKE_PLAN_B&&S.HIKE_PLAN_B[id]; if(!p)return'';
  const rows=[['觸發',p.trigger],['cut-off',p.cutoff],['點做',p.action],['後備',p.fallback],['先準備',p.prep]].filter(r=>r[1]);
  return`<details class="hikepb" open><summary><span class="hpbi">🅱️</span><span><b>${esc(p.title)}</b><small>天氣 / 體力 / 交通出事先睇呢張</small></span><span class="wxcaret">▾</span></summary><div class="hpbgrid">${rows.map(r=>`<div class="hpbrow"><span>${esc(r[0])}</span><p>${telLink(esc(r[1]))}</p></div>`).join('')}</div></details>`;
}
function tlItem(d,it,ti){
  const ki=KIND[it.k]||KIND.flex;
  const buy=(it.buy&&it.buy.length)?`<div class="tl-buy"><div class="tl-buyh">🛒 要買 / 要做（撳格仔 tick 住去做）</div>${it.buy.map((b,bi)=>{const k='b_'+d.id+'_'+ti+'_'+bi;const on=BUY[k];return`<label class="buyck ${on?'done':''}" data-k="${k}"><input type="checkbox" ${on?'checked':''}><span>${telLink(esc(b))}</span></label>`;}).join('')}</div>`:'';
  const fk={open:'🕐',price:'💰',booking:'📋'};
  const facts=it.facts?Object.entries(it.facts).filter(e=>e[1]).map(e=>`<span class="tl-fact">${fk[e[0]]||''} ${esc(e[1])}</span>`).join(''):'';
  const tips=(it.tips&&it.tips.length)?`<ul class="tl-tips">${it.tips.map(t=>`<li>${telLink(esc(t))}</li>`).join('')}</ul>`:'';
  const warn=it.warn?`<div class="tl-warn">⚠️ ${telLink(esc(it.warn))}</div>`:'';
  let acts='';
  if(it.ll||it.q)acts+=`<a class="tl-act" target="_blank" href="${gmaps(it.q,it.ll)}">📍 ${esc(it.q||'Maps')}</a>`;
  if(it.phone)acts+=`<a class="tl-act" href="tel:${(''+it.phone).replace(/[^\d+]/g,'')}">📞 ${esc(it.phone)}</a>`;
  if(it.link)acts+=`<a class="tl-act" target="_blank" href="${esc(it.link)}">🔗 ${esc(it.linkLabel||'官網')}</a>`;
  const bkm=it.bk?bkMeta(it.bk.s):null, bkc=it.bk?bkClass(it.bk.s):'';
  const bk=it.bk?`<span class="st ${bkc}">${bkm.ico} ${esc(it.bk.t)}</span>`:'';
  const tags=`${it.buy?'<span class="tl-tag buy">🛒</span>':''}${it.warn?'<span class="tl-tag warn">⚠️</span>':''}${it.bk?`<span class="tl-tag s-${bkc}">${bkm.ico}</span>`:''}`;
  const body=it.desc||facts||buy||tips||warn||acts||bk;
  return`<div class="tl k-${it.k||'flex'}" style="--kc:${ki.c}">
    <div class="tl-time">${esc(it.t)}</div><span class="tl-node"></span>
    <div class="tl-card">
      <button class="tl-main" type="button" aria-expanded="false"${body?'':' disabled'}>
        <span class="tl-ico">${it.ico||'•'}</span>
        <span class="tl-head"><span class="tl-ttl">${esc(it.title)}</span>${it.loc?`<span class="tl-loc">📍 ${esc(it.loc)}</span>`:''}</span>
        <span class="tl-tags">${tags}</span>${body?'<span class="tl-caret">▾</span>':''}
      </button>
      ${body?`<div class="tl-body"><div class="tl-bodyin">
        ${it.desc?`<p class="tl-desc">${telLink(esc(it.desc))}</p>`:''}
        ${facts?`<div class="tl-facts">${facts}</div>`:''}${buy}${tips}${warn}
        ${(acts||bk)?`<div class="tl-acts">${acts}${bk}</div>`:''}
      </div></div>`:''}
    </div></div>`;
}
function bindTl(scope){
  scope.querySelectorAll('.tl-main:not([disabled])').forEach(btn=>{btn.onclick=e=>{if(e.target.closest('a,label,input'))return;const tl=btn.closest('.tl');const o=tl.classList.toggle('is-open');btn.setAttribute('aria-expanded',o?'true':'false');};});
  scope.querySelectorAll('.buyck').forEach(l=>{l.querySelector('input').onchange=e=>{if(e.target.checked)BUY[l.dataset.k]=1;else delete BUY[l.dataset.k];localStorage.sw_buy=JSON.stringify(BUY);l.classList.toggle('done',e.target.checked);};});
}
function renderDayDetail(id){
  killDmap();const d=dayById(id);window.scrollTo(0,0);
  const sun=S.SUN[legOf(id)];const ex=S.EX[id];const cap=S.HERO_CAP[id]||'';
  const noSig=['d0630','d0701','d0702','d0703','d0704','d0705'].includes(id);
  const bks=(d.bk||[]).map(b=>{const m=bkMeta(b.s);return`<span class="st ${bkClass(b.s)}">${m.ico} ${esc(b.t)}</span>`;}).join('');
  const dir=dirURL(d.stops||[]);
  const idx=S.DAYS.findIndex(x=>x.id===id),pv=S.DAYS[idx-1],nx2=S.DAYS[idx+1];
  const navHtml=`<div class="daynav">${pv?`<button class="dnav" onclick="window.__day('${pv.id}')"><span>‹ 上一日</span><b>${pv.date} ${esc(pv.title)}</b></button>`:'<span></span>'}${nx2?`<button class="dnav nx" onclick="window.__day('${nx2.id}')"><span>下一日 ›</span><b>${nx2.date} ${esc(nx2.title)}</b></button>`:'<span></span>'}</div>`;
  const heroHtml=`<div class="dd-hero" style="background-image:linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.8)),url('${img(d)}')">
     <div class="dd-date">${d.date}（${d.dow}）</div><div class="dd-ttl">${esc(d.title)}</div><div class="dd-th">${esc(d.theme)}</div>
     ${cap?`<div class="dd-cap">${esc(cap)}</div>`:''}</div>`;
  const hikePbHtml=hikePlanBHtml(id);
  const exHtml=ex?`<div class="exbox"><div class="exrow"><span class="exi">🎒</span><div><b>帶咩</b> ${telLink(esc(ex.carry))}</div></div><div class="exrow"><span class="exi">💡</span><div><b>小提示</b> ${telLink(esc(ex.tip))}</div></div><div class="exrow"><span class="exi">⏱</span><div><b>節奏</b> ${telLink(esc(ex.pace))}</div></div></div>`:'';
  const am=bkMeta(d.accom.status);
  const accomHtml=`<div class="block"><div class="bh">🛏 住邊 <span class="st ${bkClass(d.accom.status)}" style="margin-left:auto">${am.ico} ${am.t}</span></div><div style="font-size:13.5px">${esc(d.accom.name)}</div></div>`;
  const dtl=(S.TL&&S.TL[id])||d.tl;
  if(dtl&&dtl.length){
    const tlHtml=`<div class="timeline">${dtl.map((it,ti)=>tlItem(d,it,ti)).join('')}</div>`;
    // 地圖由時間線啲有座標嘅 item 自動砌（同當日 timeline 一致）
    const mapStops=dtl.filter(it=>it.ll&&it.ll.length===2).map((it,i)=>({n:it.q||it.title,ll:it.ll,o:i+1}));
    const dirTl=dirURL(mapStops);
    const mapBlock=noSig?`<div class="offwarn">⚠️ 山段冇手機訊號 → 地圖底圖載唔到,靠紙本 Kungsleden 地圖 + 預載離線 GPS（Gaia/Maps.me）導航。</div>`
      :(mapStops.length?`<div class="block"><div class="bh">🗺 今日地圖 ${dirTl?`<a class="gm" style="margin-left:auto" href="${dirTl}" target="_blank">🧭 Google 路線</a>`:''}</div><div id="dmap" class="dmap"></div></div>`:'');
    V.innerHTML=`<button class="ic" style="margin-bottom:10px" onclick="window.__back()">‹ 返行程</button>
      ${heroHtml}${wxBar(legOf(id))}
      ${hikePbHtml}
      <div class="tl-h">⏱ 今日時間線<span class="muted"> · 撳一格展開詳情 / 要買咩 / 注意</span></div>
      ${tlHtml}${accomHtml}${mapBlock}
      <div class="block"><div class="bh">🎟 今日 booking 狀態</div><div style="line-height:2.1">${bks||'<div class="muted">—</div>'}</div></div>
      ${navHtml}`;
    bindTl(V);if(document.getElementById('dmap'))makeMini(mapStops,d.color);
    // 🔦 Spotlight：如果係今日,框住「而家」應該做緊嗰格 + 自動展開 + scroll 過去
    if(id===tripDayId()){
      const _now=getNow(), nm=_now.getHours()*60+_now.getMinutes();
      let ni=-1; dtl.forEach((it,i)=>{ if(toMinT(it.t)<=nm) ni=i; });
      if(ni>=0){ const els=V.querySelectorAll('.timeline .tl'); const el=els[ni];
        if(el){ el.classList.add('tl-now'); const b=el.querySelector('.tl-main');
          if(b&&!el.classList.contains('is-open')){ el.classList.add('is-open'); b.setAttribute('aria-expanded','true'); }
          setTimeout(()=>{try{el.scrollIntoView({block:'center',behavior:'smooth'});}catch(e){}},120); } }
    }
    return;
  }
  /* —— fallback：未轉 timeline 嘅日子 —— */
  const meals=`<div class="meal"><span>🌅 ${esc(d.meals.b)}</span><span>☀️ ${esc(d.meals.l)}</span><span>🌙 ${esc(d.meals.d)}</span></div>`;
  const stops=(d.stops||[]).sort((a,b)=>a.o-b.o).map(s=>`
    <div class="stop ${s.opt?'opt':''}"><div class="o">${s.opt?'＋':s.o}</div>
      <div class="sb"><b>${esc(s.n)}</b> <span class="c">· ${esc(s.cat)}</span>${isPhoto(s)?' <span class="pc">📷</span>':''}<div class="nt">${telLink(esc(s.note||''))}</div></div>
      <a class="gm" href="${gmaps(s.n,s.ll)}" target="_blank">📍Maps</a></div>`).join('');
  const notes=(d.notes||[]).map(n=>`<div class="note-li">${telLink(esc(n))}</div>`).join('');
  V.innerHTML=`
   <button class="ic" style="margin-bottom:10px" onclick="window.__back()">‹ 返行程</button>
   ${heroHtml}${wxBar(legOf(id))}
   ${sun?`<div class="sunbar"><b>${sun.badge}</b> ${esc(sun.txt)}</div>`:''}
   ${hikePbHtml}
   ${exHtml}
   ${accomHtml}
   <div class="block"><div class="bh">🍽 早 / 午 / 晚</div>${meals}</div>
   <div class="block"><div class="bh">📍 去邊 · 點行順 ${dir?`<a class="gm" style="margin-left:8px" href="${dir}" target="_blank">🧭 路線</a>`:''}</div>
     ${noSig?`<div class="offwarn">⚠️ 山段冇手機訊號 → 地圖底圖載唔到,靠紙本 Kungsleden 地圖 + 預載離線 GPS（Gaia/Maps.me）導航。</div>`:'<div id="dmap" class="dmap"></div>'}${stops||'<div class="muted">—</div>'}</div>
   <div class="block"><div class="bh">⚠️ 注意</div>${notes||'<div class="muted">—</div>'}</div>
   ${rvDay(id)}
   <div class="block"><div class="bh">🎟 買飛 / 狀態</div><div style="line-height:2.1">${bks||'<div class="muted">—</div>'}</div></div>
   ${navHtml}`;
  if(document.getElementById('dmap'))makeMini(d.stops,d.color);
}
window.__day=id=>{killDmap();renderDayDetail(id);};
window.__back=()=>{killDmap();go('days');};
function makeMini(stops,color){
  stops=(stops||[]).filter(s=>s.ll&&s.ll.length===2);
  const pts=stops.map(s=>[s.ll[1],s.ll[0]]);if(!pts.length)return;
  color=color||'#8a93b5';
  try{dmap=new maplibregl.Map({container:'dmap',style:MAP_STYLE,interactive:true,attributionControl:false});
    dmap.on('load',()=>{
      const main=stops.filter(s=>!s.opt).sort((a,b)=>(a.o||0)-(b.o||0)).map(s=>[s.ll[1],s.ll[0]]);
      if(main.length>1){dmap.addSource('r',{type:'geojson',data:{type:'Feature',geometry:{type:'LineString',coordinates:main}}});
        dmap.addLayer({id:'r',type:'line',source:'r',paint:{'line-color':color,'line-width':3.5,'line-opacity':.85}});}
      stops.forEach(s=>{const el=document.createElement('div');el.style.cssText=`width:${s.opt?11:15}px;height:${s.opt?11:15}px;border-radius:50%;background:${s.opt?'#bdb6a6':color};border:2px solid #fff`;
        new maplibregl.Marker({element:el}).setLngLat([s.ll[1],s.ll[0]]).setPopup(new maplibregl.Popup({offset:12,closeButton:false}).setHTML(`<b>${esc(s.n)}</b><br><a href="${gmaps(s.n,s.ll)}" target="_blank">📍 Maps ›</a>`)).addTo(dmap);});
      const b=pts.reduce((B,p)=>B.extend(p),new maplibregl.LngLatBounds(pts[0],pts[0]));dmap.fitBounds(b,{padding:34,maxZoom:13,duration:0});
    });
  }catch(e){}
}

/* ---------- 地圖 MAP ---------- */
const MAP_STYLE='https://tiles.openfreemap.org/styles/bright';
function renderMap(){
  const noSigDays=['d0630','d0701','d0702','d0703','d0704','d0705'];
  // 📍 每日 Google Maps 路線（用嗰日 timeline 嘅座標砌）
  const dayRoutes=S.DAYS.map(d=>{
    const tl=(S.TL&&S.TL[d.id])||d.tl||[];
    const stops=tl.filter(it=>it.ll&&it.ll.length===2).map((it,i)=>({n:it.q||it.title,ll:it.ll,o:i+1}));
    const dir=dirURL(stops);
    const act=dir?`<a class="rr-go" href="${dir}" target="_blank">🧭 開路線</a>`
      :(noSigDays.includes(d.id)?'<span class="rr-no">山段·離線</span>':'<span class="rr-no">—</span>');
    return `<div class="routerow"><span class="rr-dot" style="background:${d.color}"></span><span class="rr-day" onclick="window.__day('${d.id}')"><b class="rr-d">${d.date}</b> <span class="rr-t">${esc(d.title)}</span></span>${act}</div>`;
  }).join('');
  const chipsHtml=S.DAYS.map(d=>`<button class="daychip ${curDay===d.id?'on':''}" style="${curDay===d.id?`background:${d.color}`:''}" data-d="${d.id}"><span class="dot" style="background:${d.color}"></span>${d.date}</button>`).join('');
  V.innerHTML=`<h1 class="pg">🗺️ 地圖 / 路線</h1><div class="pg-sub">每日一鍵開 Google Maps 行嗰日路線 · 下面有全程概覽</div>
    <div class="sec-h">📍 每日 Google Maps 路線</div>
    <div class="card routelist">${dayRoutes}</div>
    <div class="sec-h">🗺 全程概覽 · 撳一日只睇嗰日</div>
    <div class="maptools"><button class="daychip ${!curDay?'on':''}" style="${!curDay?'background:var(--gold)':''}" data-d="">全程</button>${chipsHtml}</div>
    <div id="mapwrap"><div id="map"></div></div>
    <div class="maptools" style="margin-top:10px">
      <label class="savedtog"><input type="checkbox" id="savedChk" ${showSaved?'checked':''}> 顯示 optional / saved 地方</label></div>`;
  if(!map){map=new maplibregl.Map({container:'map',style:MAP_STYLE,center:[17,63],zoom:3.4});
    map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');map.on('load',()=>drawDay());
  }else{document.getElementById('map').replaceWith(map.getContainer());setTimeout(()=>{map.resize();drawDay();},60);}
  V.querySelectorAll('.daychip').forEach(c=>c.onclick=()=>{curDay=c.dataset.d||null;renderMap();});
  $('#savedChk').onchange=e=>{showSaved=e.target.checked;drawDay();};
}
function clearMap(){markers.forEach(m=>m.remove());markers=[];['route'].forEach(id=>{if(map.getLayer(id))map.removeLayer(id);if(map.getSource(id))map.removeSource(id);});}
function haversine(a,b){const R=6371,dLat=(b[1]-a[1])*Math.PI/180,dLon=(b[0]-a[0])*Math.PI/180,x=Math.sin(dLat/2)**2+Math.cos(a[1]*Math.PI/180)*Math.cos(b[1]*Math.PI/180)*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
async function osrm(a,b){if(haversine(a,b)>8)return[a,b];try{const r=await fetch(`https://router.project-osrm.org/route/v1/foot/${a[0]},${a[1]};${b[0]},${b[1]}?overview=full&geometries=geojson`);const j=await r.json();return j.routes&&j.routes[0]?j.routes[0].geometry.coordinates:[a,b];}catch(e){return[a,b];}}
function mkr(ll,color,opt,photo,html){const el=document.createElement('div');el.style.cssText=`width:${opt?13:17}px;height:${opt?13:17}px;border-radius:50%;background:${opt?'#bdb6a6':color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);${opt?'opacity:.7;':''}${photo?'box-shadow:0 0 0 3px rgba(245,200,66,.6);':''}`;
  const m=new maplibregl.Marker({element:el}).setLngLat(ll).setPopup(new maplibregl.Popup({offset:14,closeButton:false}).setHTML(html)).addTo(map);markers.push(m);}
async function drawDay(){
  if(!map||!map.isStyleLoaded()){map&&map.once('idle',drawDay);return;}
  clearMap();
  // 地圖 pin 由每日 timeline(TL) 座標砌 → 同行程永遠一致（唔再靠舊 DAYS.stops，避免對調後 pin 唔啱）
  const tlStops=id=>{const tl=(S.TL&&S.TL[id])||((dayById(id)||{}).tl)||[];
    return tl.filter(it=>it.ll&&it.ll.length===2).map((it,i)=>({n:it.q||it.title,ll:it.ll,cat:it.loc||'',note:it.title||'',o:i+1}));};
  let stops=[];
  if(curDay){const d=dayById(curDay);stops=tlStops(curDay).map(s=>({...s,color:d.color}));}
  else{S.DAYS.forEach(d=>tlStops(d.id).forEach(s=>stops.push({...s,color:'#8a93b5'})));}
  const pts=[];
  stops.forEach(s=>{const ll=[s.ll[1],s.ll[0]];pts.push(ll);
    mkr(ll,s.color,false,false,`<b>${esc(s.n)}</b><br>${esc(s.cat)}<br><span style="opacity:.85">${esc(s.note||'')}</span><br><a href="${gmaps(s.n,s.ll)}" target="_blank">📍 Google Maps ›</a>`);});
  if(showSaved){const rT={in:'✅ 排咗',opt:'🤔 可選',skip:'💭 我建議 skip'};S.SAVED.forEach(s=>{mkr([s.ll[1],s.ll[0]],s.rec==='skip'?'#c8a59a':'#d8c08a',true,false,`<b>${esc(s.n)}</b><br>${rT[s.rec]||''}<br><span style="opacity:.85">${esc(s.why)}</span><br><a href="${gmaps(s.n,s.ll)}" target="_blank">📍 Google Maps ›</a>`);});}
  if(curDay){const main=tlStops(curDay).map(s=>[s.ll[1],s.ll[0]]);
    if(main.length>1){let full=[];for(let i=0;i<main.length-1;i++){const seg=await osrm(main[i],main[i+1]);full=full.concat(i?seg.slice(1):seg);}
      if(map.getSource('route')){if(map.getLayer('route'))map.removeLayer('route');map.removeSource('route');}
      map.addSource('route',{type:'geojson',data:{type:'Feature',geometry:{type:'LineString',coordinates:full}}});
      map.addLayer({id:'route',type:'line',source:'route',paint:{'line-color':dayById(curDay).color,'line-width':3.5,'line-opacity':.9}});}}
  if(pts.length){const b=pts.reduce((B,p)=>B.extend(p),new maplibregl.LngLatBounds(pts[0],pts[0]));map.fitBounds(b,{padding:50,maxZoom:curDay?13:5,duration:900});}
}

/* ---------- 審查 REVIEW（多 agent audit 結果）---------- */
const RV = window.REVIEW||{days:{},global:[],wins:[]};
const rvSev = {high:'🔴',med:'🟡',low:'🟢'};
const rvItem = r=>`<div class="rv ${r.sev}"><div class="rv-t">${rvSev[r.sev]||''} ${esc(r.t)}</div><div class="rv-fix">→ ${telLink(esc(r.fix||''))}</div>${r.deadline?`<div class="rv-src">⏰ ${esc(r.deadline)}</div>`:''}</div>`;
function rvDay(id){return'';} /* 每日 agent 審查層已撤——重點已整合入每日「⚠️ 注意」(notes) */
/* 行前/行程中 仲要做 — 人話清單(唔再 show agent 審查) */
const TODO_LIST=[
  '⏳ ── 而家–出發前（喺香港搞掂）──',
  '🛡 打 Zurich 2968 2288 / email 攞書面確認：Kungsleden 自助重裝行山 + 7/11 水上活動受唔受保',
  '💬 message Évika host：7/11 個體驗係咪 eFoil？帶咩？天氣有變點安排（Airbnb app）',
  '📅 share 你個 Google Calendar 俾 Kling（klingggg0621@gmail.com）+ send 網站 link 俾佢',
  '🛒 買齊新加嘅 gear：細風槍 · 太陽帽 · 求生哨 · 保溫毯 · 防水手機袋 · 頸枕 · 可摺 day bag · Kam Ling 鈎針',
  '📞 報平安 protocol：留行程＋山屋 code 俾一個信得過嘅人（山上 6/30–7/5 冇訊號）',
  '💳 決定取車按金卡（Mox 趕唔切就用現有實體卡·袋好）',
  '🎶 ABBA 7/14（想去就而家提前官網訂時段·夏天爆飛·二揀一同 Viking）',
  '🎤 Allsång på Skansen 7/14 — 6 月尾上 skansen.se 睇有冇場先計',
  '📲 預載離線地圖 + 截圖所有 booking + 保險 PDF 離線',
  '✈️ ── 旅程中（特定日先做）──',
  '🛒 6/28 Kiruna：ICA 買 6 日糧 + 氣罐（週日 Jaktia 多數閉·Coop 後備）',
  '🎫 7/8 搶 Stadshuset Tower 飛（7/15 上塔·T-7=7/8 放·一放即清）',
  '🎟 7/9 World of Volvo 飛（當日手機網購慳 10%）',
  '📞 7/10 Saab 去之前打 +46-520-289440 confirm 開放',
  '🛒 到埗即買 SL 7 日票（Stockholm 段）',
];

/* ---------- 狀態 STATUS ---------- */
function renderStatus(){
  const bk=S.DAYS.flatMap(d=>(d.bk||[]).map(b=>({...b,date:d.date})));
  const order=['hold','todo','pend','paid'],lbl={hold:'⛔ On-hold（等依賴）',todo:'🕒 仲要訂',pend:'⏳ 等緊確認',paid:'✅ 已訂/已付'};
  const cnt=s=>bk.filter(b=>b.s===s).length, tot=bk.length, paid=cnt('paid'), pct=Math.round(paid/tot*100);
  const segs=[['paid',cnt('paid')],['pend',cnt('pend')],['todo',cnt('todo')],['hold',cnt('hold')]];
  const segbar=`<div class="segbar">${segs.map(([s,n])=>n?`<i style="width:${(n/tot*100).toFixed(1)}%;background:${S.BK[s].c}"></i>`:'').join('')}</div><div class="seglegend">${segs.map(([s,n])=>`<span><b style="background:${S.BK[s].c}"></b>${S.BK[s].t} ${n}</span>`).join('')}</div>`;
  const bookCard=b=>`<div class="bookcard ${b.s}">
    <div class="bc-top"><b class="bc-ttl">${esc(b.t)}</b><span class="st ${bkClass(b.s)}" style="margin:0">${bkMeta(b.s).ico} ${bkMeta(b.s).t}</span></div>
    <div class="bc-grid">
      <div><span class="bc-k">📅 訂邊日</span><span class="bc-v">${esc(b.d)}</span></div>
      <div><span class="bc-k">👥 幾多人</span><span class="bc-v">${esc(b.pax)}</span></div>
      <div class="bc-wide"><span class="bc-k">💰 幾多錢</span><span class="bc-v">${esc(b.price)}</span></div>
    </div>
    <div class="bc-dl">⏰ ${telLink(esc(b.dl))}</div>
    <a class="bc-go" href="${b.where}" target="_blank">🔗 去 ${esc(b.wl)} 訂 ›</a>
  </div>`;
  const undone=(S.BOOK||[]).filter(b=>b.s!=='paid');
  const doneB=(S.BOOK||[]).filter(b=>b.s==='paid');
  const undoneHtml=undone.length?undone.map(bookCard).join(''):'<div class="card" style="color:var(--green)">🎉 BOOK 清單全部搞掂!</div>';
  const paidDetail=b=>/旅遊保險/.test(b.t)
    ? '⚠️ 保障好薄：Kungsleden 可能受 exclusion 2(d) 影響；7·11 水上活動要 Zurich 書面確認；取消/縮短、行李、租車自負額唔受保。'
    : b.d;
  const doneHtml=doneB.map(b=>`<div class="strow"><span class="st ${bkClass(b.s)}" style="margin:0">${bkMeta(b.s).ico}</span><div class="sm"><b>${esc(b.t)}</b><small>${esc(paidDetail(b))}</small></div></div>`).join('');
  const pb=S.PLANB;
  const notesHtml=S.TRIP.notesUrl?`<a class="btn ghost" href="${S.TRIP.notesUrl}">🔐 開 Apple Note 睇 code ›</a>`:`<div style="font-size:13px">喺你 iPhone <b>備忘錄/Notes</b> 搜尋「<b>🇸🇪 Sweden 2026 · Booking Codes</b>」(只有你 iCloud 登入睇到)。</div><div class="muted" style="font-size:11px;margin-top:6px">想一撳直達?喺 Notes 整條 iCloud 分享 link 俾我,我嵌落呢度。</div>`;
  V.innerHTML=`<h1 class="pg">✅ 狀態</h1><div class="pg-sub">未搞掂嘅喺最上面 · 訂咗嘅自動排落每日時間線</div>
   <div class="sec-h">🔴 仲要訂 / 未處理（最緊要·由上做落）</div>
   <div class="pg-sub" style="margin:-2px 2px 8px">撳藍掣直接去官方訂位／報價</div>
   ${undoneHtml}
   <div class="sec-h">📌 行前 / 行程中 要做</div>
   <div class="card">${TODO_LIST.map(x=>`<div class="todo-li">${telLink(esc(x))}</div>`).join('')}</div>
   <div class="sec-h">📊 進度 — 已搞掂 ${paid}/${tot}（${pct}%）</div>
   <div class="card">${segbar}</div>
   <div class="sec-h">✅ 已訂 / 已付（${doneB.length}）</div>
   <div class="card">${doneHtml||'<div class="muted">—</div>'}</div>
   <div class="planb"><div class="pbt">${esc(pb.title)}</div>${pb.steps.map(s=>`<div style="margin:6px 0">${telLink(esc(s))}</div>`).join('')}</div>
   <div class="sec-h">🔐 機密 code</div>
   <div class="card"><div class="muted" style="font-size:12.5px;margin-bottom:8px">機票 PNR / confirmation / QR 唔放公開站(安全) → 喺你 iPhone 私人 Apple Note。</div>${notesHtml}</div>`;
}

/* ---------- 實用 KIT ---------- */
function renderKit(){
  const subs=[['pack','🎒 行李'],['sos','🆘 緊急'],['cheat','📋 小抄']];
  let body='';
  if(kitSub==='pack'){const ck=JSON.parse(localStorage.sw_ck||'{}');
    S.CHECKLIST.forEach((g,gi)=>{body+=`<div class="sec-h">${esc(g.grp)}</div><div class="card">`;
      g.items.forEach((it,ii)=>{const k=gi+'_'+ii,done=ck[k];body+=`<label class="ck ${done?'done':''}" data-k="${k}"><input type="checkbox" ${done?'checked':''}><span>${esc(it)}</span></label>`;});body+=`</div>`;});}
  else if(kitSub==='sos'){body=S.EMERGENCY.map(e=>{const tel=e.num.replace(/[^0-9+]/g,'');const call=/[0-9]/.test(e.num)?`<a class="call" href="tel:${tel}">撥打</a>`:'';
      return `<div class="sos"><div class="sl"><b>${esc(e.cat)}</b><small>${esc(e.num)} · ${esc(e.note)}</small></div>${call}</div>`;}).join('')+`<div class="card" style="font-size:12.5px;margin-top:12px">${esc(S.EMERG_NOTE)}</div>`;}
  else{body=S.CHEAT.map(c=>`<div class="sec-h">${esc(c.h)}</div><div class="card"><ul class="cheat">${c.items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')+
    `<div class="sec-h">🖼 圖片來源 (CC)</div><div class="card"><div class="muted" style="font-size:11px;line-height:1.8">${S.IMG_CREDITS.map(c=>esc(c[1])).join(' · ')} — via Wikimedia Commons</div></div>`;}
  V.innerHTML=`<h1 class="pg">🧰 實用</h1><div class="subtabs">${subs.map(s=>`<button class="subtab ${kitSub===s[0]?'on':''}" data-s="${s[0]}">${s[1]}</button>`).join('')}</div>${body}`;
  V.querySelectorAll('.subtab').forEach(b=>b.onclick=()=>{kitSub=b.dataset.s;renderKit();});
  if(kitSub==='pack')V.querySelectorAll('.ck').forEach(l=>l.querySelector('input').onchange=e=>{const c=JSON.parse(localStorage.sw_ck||'{}');c[l.dataset.k]=e.target.checked;localStorage.sw_ck=JSON.stringify(c);l.classList.toggle('done',e.target.checked);});
}

go('now');
})();
