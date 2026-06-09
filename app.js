/* Sweden 2026 PWA — app.js */
(function(){
const S = window.SWEDEN, V = document.getElementById('view');
let map=null,curDay=null,showSaved=false,markers=[];
const $ = s=>document.querySelector(s);
const esc = t=>(''+t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const dayById = id=>S.DAYS.find(d=>d.id===id);
const gmaps = (n,ll)=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n)}%20${ll[0]},${ll[1]}`;
const dirURL = stops=>{const p=stops.filter(s=>!s.opt).sort((a,b)=>a.o-b.o).map(s=>s.ll[0]+','+s.ll[1]);
  if(p.length<2)return null;return`https://www.google.com/maps/dir/?api=1&origin=${p[0]}&destination=${p[p.length-1]}`+(p.length>2?`&waypoints=${encodeURIComponent(p.slice(1,-1).join('|'))}`:'')+`&travelmode=transit`;};

/* ---------- theme + font ---------- */
const root=document.documentElement;
function applyTheme(t){root.setAttribute('data-theme',t);localStorage.sw_theme=t;if(map)setTimeout(()=>map.resize(),50);}
$('#themeBtn').onclick=()=>{const cur=localStorage.sw_theme||'auto';applyTheme(cur==='auto'?'dark':cur==='dark'?'light':'auto');};
applyTheme(localStorage.sw_theme||'auto');
let fs=+(localStorage.sw_fs||16);const setFs=v=>{fs=Math.max(13,Math.min(21,v));root.style.setProperty('--fs',fs+'px');localStorage.sw_fs=fs;};
$('#fontUp').onclick=()=>setFs(fs+1);$('#fontDown').onclick=()=>setFs(fs-1);setFs(fs);

/* ---------- tabs ---------- */
document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>go(b.dataset.tab));
function go(tab,arg){
  document.querySelectorAll('.tab').forEach(b=>b.classList.toggle('is-active',b.dataset.tab===tab));
  window.scrollTo(0,0);
  ({home:renderHome,days:renderDays,map:renderMap,transit:renderTransit,pack:renderPack,sos:renderSos}[tab]||renderHome)(arg);
}

/* ---------- HOME ---------- */
function renderHome(){
  const D=S.DAYS, bkAll=D.flatMap(d=>d.bk||[]);
  const paid=bkAll.filter(b=>b.s==='paid').length, pend=bkAll.filter(b=>b.s==='pend').length;
  const todo=bkAll.filter(b=>b.s==='todo').length, hold=bkAll.filter(b=>b.s==='hold').length;
  const notesBtn = S.TRIP.notesUrl
    ? `<a class="btn ghost" href="${S.TRIP.notesUrl}">🔐 機密 code（Apple Note）</a>`
    : `<a class="btn ghost" href="mobilenotes://" onclick="return true">🔐 開 Apple Notes 睇 code</a>`;
  V.innerHTML=`
  <div class="hero">
    <h1 class="pg">${esc(S.TRIP.title)}</h1>
    <div class="pg-sub">${esc(S.TRIP.sub)}</div>
    <div class="muted" style="font-size:13px">22 日 · 北段行山 + Arctic Bath → Göteborg → Älmhult IKEA → Stockholm。撳「行程」揀一日睇足細節,「地圖」睇逐日路線。</div>
  </div>

  <div class="jackpot">🎵 <b>JACKPOT：Robyn @ Avicii Arena</b> — 7/16 或 7/17 晚 19:30。瑞典電音國寶喺 hometown 開騷,正卡你 Stockholm 日子。<b>要早買飛</b> → <a href="https://robyn.com/tour" target="_blank">robyn.com/tour</a></div>

  <div class="alert">⛔ <b>最大風險：Sixt 租車 = 全程單點故障</b><br>Arctic Bath + 7/8 飛 GOT + 成個南段都吊喺呢架車。<b>Sixt confirm 前唔好買 SK2051 機票。</b>Plan B = 火車去 Luleå。詳見「交通」tab。</div>

  <div class="sec-h">📊 Booking 狀態總覽</div>
  <div class="statgrid">
    <div><div class="n" style="color:var(--green)">${paid}</div><div class="l">✅ 已訂/已付</div></div>
    <div><div class="n" style="color:var(--amber)">${pend}</div><div class="l">⏳ 等緊確認</div></div>
    <div><div class="n" style="color:var(--cyan)">${todo}</div><div class="l">🕒 仲要訂</div></div>
  </div>
  ${hold?`<div class="muted" style="font-size:12px;margin-top:-4px">⛔ ${hold} 項 on-hold（等 Sixt 依賴）—— 見「交通」tab dependency。</div>`:''}

  <div class="sec-h">🔐 機密資料</div>
  <div class="card"><div class="muted" style="font-size:12.5px;margin-bottom:8px">機票 PNR / confirmation code / QR <b>唔放公開站</b>（安全）→ 喺你 iPhone 私人 Apple Note（只有你 iCloud 登入睇到）。</div>${notesBtn}</div>

  <div class="sec-h">⚡ 快速狀態</div>
  <div class="card" style="font-size:13px;line-height:1.9">
    <span class="st hold">⛔ Sixt 車（等 confirm·南段命脈）</span>
    <span class="st todo">🕒 SK2051 機票（等 Sixt 先買）</span>
    <span class="st todo">🕒 Arctic Bath（等 Sixt）</span>
    <span class="st pend">⏳ WOW Apartments（訂時 check）</span>
    <span class="st pend">⏳ Stockholm Airbnb（講遲到）</span>
    <span class="st todo">🕒 World of Volvo 時段</span>
    <span class="st todo">🎵 Robyn 飛（早買）</span>
    <span class="st todo">🕒 保險（cover 行山）</span>
  </div>
  <div class="muted" style="font-size:11.5px;margin-top:14px">⚠️ 所有 2026 年 7 月暑期 hours / 班次 / 天氣 = 臨行前一星期 reconfirm。座標 OSM 驗證。更新 ${esc(S.TRIP.updated)}。</div>`;
}

/* ---------- DAYS list ---------- */
function renderDays(){
  let h=`<h1 class="pg">📅 逐日行程</h1><div class="pg-sub">撳一日睇足：住 / 早午晚 / 順路 / 注意 / booking</div>`;
  S.LEGS.forEach(leg=>{
    h+=`<div class="leg-h">${esc(leg.name)}</div>`;
    leg.days.forEach(id=>{const d=dayById(id);if(!d)return;
      h+=`<button class="drow" style="--dc:${d.color}" data-d="${id}">
        <span class="dt">${d.date}<br><small>${d.dow}</small></span>
        <span class="tt"><b>${esc(d.title)}</b><small>${esc(d.theme)}</small></span>
        <span class="chev">›</span></button>`;});
  });
  V.innerHTML=h;
  V.querySelectorAll('.drow').forEach(b=>b.onclick=()=>renderDayDetail(b.dataset.d));
}
function renderDayDetail(id){
  const d=dayById(id);window.scrollTo(0,0);
  const meals=`<div class="meal"><span>🌅 ${esc(d.meals.b)}</span><span>☀️ ${esc(d.meals.l)}</span><span>🌙 ${esc(d.meals.d)}</span></div>`;
  const stops=(d.stops||[]).sort((a,b)=>a.o-b.o).map(s=>`
    <div class="stop ${s.opt?'opt':''}"><div class="o">${s.opt?'＋':s.o}</div>
      <div class="sb"><b>${esc(s.n)}</b> <span class="c">· ${esc(s.cat)}</span><div class="nt">${esc(s.note||'')}</div></div>
      <a class="gm" href="${gmaps(s.n,s.ll)}" target="_blank">📍Maps</a></div>`).join('');
  const notes=(d.notes||[]).map(n=>`<div class="note-li">${esc(n)}</div>`).join('');
  const bks=(d.bk||[]).map(b=>`<span class="st ${b.s}">${S.BK[b.s].ico} ${esc(b.t)}</span>`).join('');
  const dir=dirURL(d.stops||[]);
  V.innerHTML=`
   <button class="ic" style="margin-bottom:10px" onclick="window.__back()">‹ 返行程</button>
   <div class="dd-head" style="background:linear-gradient(135deg,${d.color},color-mix(in srgb,${d.color} 70%,#000))">
     <div class="d1">${d.date}（${d.dow}）· ${esc(d.title)}</div><div class="d2">${esc(d.theme)}</div></div>
   <div class="block"><div class="bh">🛏 住邊 <span class="st ${d.accom.status}" style="margin-left:auto">${S.BK[d.accom.status].ico} ${S.BK[d.accom.status].t}</span></div><div style="font-size:13.5px">${esc(d.accom.name)}</div></div>
   <div class="block"><div class="bh">🍽 早 / 午 / 晚</div>${meals}</div>
   <div class="block"><div class="bh">📍 去邊 · 點行順 ${dir?`<a class="gm" style="margin-left:auto" href="${dir}" target="_blank">🧭 Google Maps 路線</a>`:''}</div>${stops||'<div class="muted">—</div>'}</div>
   <div class="block"><div class="bh">⚠️ 注意</div>${notes||'<div class="muted">—</div>'}</div>
   <div class="block"><div class="bh">🎟 買飛 / 狀態</div><div style="line-height:2">${bks||'<div class="muted">—</div>'}</div></div>
   <button class="btn ghost" onclick="window.__mapday('${id}')">🗺️ 喺地圖睇呢日</button>`;
}
window.__back=()=>go('days');
window.__mapday=id=>{curDay=id;go('map');};

/* ---------- MAP ---------- */
const MAP_STYLE='https://tiles.openfreemap.org/styles/bright';
function renderMap(){
  const chips=S.DAYS.map(d=>`<button class="daychip ${curDay===d.id?'on':''}" style="${curDay===d.id?`background:${d.color}`:''}" data-d="${d.id}"><span class="dot" style="background:${d.color}"></span>${d.date}</button>`).join('');
  V.innerHTML=`<h1 class="pg">🗺️ 地圖</h1><div class="pg-sub">撳一日 → 只見嗰日點 + 路線 + 動畫飛過去</div>
    <div class="maptools"><button class="daychip ${!curDay?'on':''}" style="${!curDay?'background:var(--gold)':''}" data-d="">全程</button>${chips}</div>
    <div id="mapwrap"><div id="map"></div></div>
    <label class="savedtog" style="margin-top:10px"><input type="checkbox" id="savedChk" ${showSaved?'checked':''}> 顯示 optional / 我 saved 嘅地方（淺色 + 淺色路線）</label>
    <div id="legendpop" class="muted" style="font-size:11.5px;margin-top:6px">撳地圖上嘅點 = 彈出 Google Maps link。北段山屋為 STF 約位。</div>`;
  if(!map){
    map=new maplibregl.Map({container:'map',style:MAP_STYLE,center:[17,63],zoom:3.4,attributionControl:true});
    map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');
    map.on('load',()=>drawDay());
  }else{const el=document.getElementById('map');el.replaceWith(map.getContainer());setTimeout(()=>{map.resize();drawDay();},60);}
  V.querySelectorAll('.daychip').forEach(c=>c.onclick=()=>{curDay=c.dataset.d||null;renderMap();});
  $('#savedChk').onchange=e=>{showSaved=e.target.checked;drawDay();};
}
function clearMap(){markers.forEach(m=>m.remove());markers=[];['route','route-opt'].forEach(id=>{if(map.getLayer(id))map.removeLayer(id);if(map.getSource(id))map.removeSource(id);});}
function addLine(id,coords,color,opacity,dash){
  map.addSource(id,{type:'geojson',data:{type:'Feature',geometry:{type:'LineString',coordinates:coords}}});
  map.addLayer({id,type:'line',source:id,paint:{'line-color':color,'line-width':3.5,'line-opacity':opacity,...(dash?{'line-dasharray':[2,2]}:{})}});
}
async function osrmRoute(a,b){ // foot route if short, else straight
  const km=haversine(a,b); if(km>8) return [a,b];
  try{const r=await fetch(`https://router.project-osrm.org/route/v1/foot/${a[0]},${a[1]};${b[0]},${b[1]}?overview=full&geometries=geojson`);
    const j=await r.json(); return j.routes&&j.routes[0]?j.routes[0].geometry.coordinates:[a,b];}catch(e){return [a,b];}
}
function haversine(a,b){const R=6371,dLat=(b[1]-a[1])*Math.PI/180,dLon=(b[0]-a[0])*Math.PI/180,
  x=Math.sin(dLat/2)**2+Math.cos(a[1]*Math.PI/180)*Math.cos(b[1]*Math.PI/180)*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
function mk(lngLat,color,opt,html){
  const el=document.createElement('div');el.style.cssText=`width:${opt?13:17}px;height:${opt?13:17}px;border-radius:50%;background:${opt?'#bdb6a6':color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);${opt?'opacity:.7':''}`;
  const m=new maplibregl.Marker({element:el}).setLngLat(lngLat).setPopup(new maplibregl.Popup({offset:14,closeButton:false}).setHTML(html)).addTo(map);
  markers.push(m);return m;
}
async function drawDay(){
  if(!map||!map.isStyleLoaded()){map&&map.once('idle',drawDay);return;}
  clearMap();
  let stops=[];
  if(curDay){const d=dayById(curDay);stops=(d.stops||[]).map(s=>({...s,color:d.color}));}
  else{S.DAYS.forEach(d=>(d.stops||[]).forEach(s=>stops.push({...s,color:'#8a93b5',_grey:true})));}
  const shown=stops.filter(s=>!s.opt||showSaved);
  const pts=[];
  shown.forEach(s=>{const ll=[s.ll[1],s.ll[0]];pts.push(ll);
    mk(ll,s.color,s.opt,`<b>${esc(s.n)}</b><br>${esc(s.cat)}${curDay?'':' · '+(dayById(stopsDay(s))||{}).date||''}<br><span style="opacity:.85">${esc(s.note||'')}</span><br><a href="${gmaps(s.n,s.ll)}" target="_blank">📍 Google Maps ›</a>`);});
  // routes (only when a single day selected)
  if(curDay){
    const d=dayById(curDay);
    const main=(d.stops||[]).filter(s=>!s.opt).sort((a,b)=>a.o-b.o).map(s=>[s.ll[1],s.ll[0]]);
    if(main.length>1){
      // straight first (instant), then OSRM enhance
      addLine('route',main,d.color,.85,true);
      let full=[];for(let i=0;i<main.length-1;i++){const seg=await osrmRoute(main[i],main[i+1]);full=full.concat(i?seg.slice(1):seg);}
      if(map.getLayer('route'))map.removeLayer('route');if(map.getSource('route'))map.removeSource('route');
      addLine('route',full,d.color,.9,false);
    }
    if(showSaved){const opt=(d.stops||[]).filter(s=>s.opt);
      opt.forEach((s,i)=>{const near=main[0]||[s.ll[1],s.ll[0]];addLine('route-opt'+i,[[s.ll[1],s.ll[0]],near],'#bdb6a6',.5,true);markers.push({remove:()=>{if(map.getLayer('route-opt'+i))map.removeLayer('route-opt'+i);if(map.getSource('route-opt'+i))map.removeSource('route-opt'+i);}});});}
  }
  if(pts.length){const b=pts.reduce((B,p)=>B.extend(p),new maplibregl.LngLatBounds(pts[0],pts[0]));
    map.fitBounds(b,{padding:50,maxZoom:curDay?13:5,duration:900});}
}
function stopsDay(s){for(const d of S.DAYS){if((d.stops||[]).some(x=>x.n===s.n))return d.id;}return null;}

/* ---------- TRANSIT ---------- */
function renderTransit(){
  let rows=S.TRANSPORT.map(t=>`<div class="tr"><div class="tm"><b>${esc(t.seg)}</b><small>${esc(t.mode)} · ${esc(t.time)} · ${esc(t.tick)}</small></div><span class="st ${t.s}">${S.BK[t.s].ico}</span></div>`).join('');
  V.innerHTML=`<h1 class="pg">🚆 交通</h1><div class="pg-sub">全程每段 + 票 + 狀態</div>
   <div class="alert">⛔ <b>依賴鏈：南段命脈 = Sixt 一架車</b><br>Sixt 冇車 → Arctic Bath 訂唔到 → 7/8 唔喺 Luleå → SK2051 上唔到 → Göteborg 連鎖延後。<br><b>Plan B（首選）</b>：火車 Kiruna→Luleå，Arctic Bath 安排接駁（email 問），仍 7/8 飛 GOT。<b>cut-off：行山出山 7/5 前 Sixt 仍未 confirm 就切 Plan B。Sixt confirm 前唔好買 SK2051。</b></div>
   <div class="card">${rows}</div>
   <div class="muted" style="font-size:11.5px">⚠️ SL 票只 Stockholm 用,Göteborg 用 Västtrafik(zon A)。SL 290 平票 20 歲到埗試買(慳360)。Arlanda Express ≠ Flygbussarna ≠ SL,分開買。</div>`;
}

/* ---------- PACK ---------- */
function renderPack(){
  const ck=JSON.parse(localStorage.sw_ck||'{}');
  let h=`<h1 class="pg">🎒 清單</h1><div class="pg-sub">行李 / 買糧氣罐 · 撳 = 剔除(記住)</div>`;
  S.CHECKLIST.forEach((g,gi)=>{h+=`<div class="sec-h">${esc(g.grp)}</div><div class="card">`;
    g.items.forEach((it,ii)=>{const k=gi+'_'+ii,done=ck[k];h+=`<label class="ck ${done?'done':''}" data-k="${k}"><input type="checkbox" ${done?'checked':''}><span>${esc(it)}</span></label>`;});
    h+=`</div>`;});
  V.innerHTML=h;
  V.querySelectorAll('.ck').forEach(l=>l.querySelector('input').onchange=e=>{const c=JSON.parse(localStorage.sw_ck||'{}');c[l.dataset.k]=e.target.checked;localStorage.sw_ck=JSON.stringify(c);l.classList.toggle('done',e.target.checked);});
}

/* ---------- SOS ---------- */
function renderSos(){
  let rows=S.EMERGENCY.map(e=>{const tel=e.num.replace(/[^0-9+]/g,'');const call=/[0-9]/.test(e.num)?`<a class="call" href="tel:${tel}">撥打</a>`:'';
    return `<div class="sos"><div class="sl"><b>${esc(e.cat)}</b><small>${esc(e.num)} · ${esc(e.note)}</small></div>${call}</div>`;}).join('');
  V.innerHTML=`<h1 class="pg">☎ 緊急</h1><div class="pg-sub">號碼多源驗證 · 撳「撥打」直接打</div>
   ${rows}
   <div class="card" style="margin-top:12px;font-size:12.5px">${esc(S.EMERG_NOTE)}</div>`;
}

go('home');
})();
