/* Sweden 2026 PWA — app.js v2 (5 tabs, visual) */
(function(){
const S = window.SWEDEN, V = document.getElementById('view');
let map=null,dmap=null,curDay=null,showSaved=false,photoLayer=false,kitSub='pack',markers=[];
const $ = s=>document.querySelector(s);
const esc = t=>(''+t).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
const dayById = id=>S.DAYS.find(d=>d.id===id);
const legOf = id=>(S.LEGS.find(l=>l.days.includes(id))||{}).key;
const img = d=>'img/'+(S.HERO[d.id]||'stockholm')+'.jpg';
// 純座標 → 保證跳到正確位置(唔會"no result");名做 label query 但用座標做中心
const gmaps = (n,ll)=>`https://www.google.com/maps/search/?api=1&query=${ll[0]}%2C${ll[1]}`;
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
  const start=new Date(2026,5,27), now=new Date();
  const dd=Math.ceil((start-now)/864e5);
  const cd = dd>0?`距離出發 <b style="font-size:1.5em">${dd}</b> 日`:(dd>-22?`旅程 Day ${23+dd}`:'旅程已完');
  const D=S.DAYS, bk=D.flatMap(d=>(d.bk||[]).map(b=>({...b,date:d.date})));
  const paid=bk.filter(b=>b.s==='paid').length,pend=bk.filter(b=>b.s==='pend').length,todo=bk.filter(b=>b.s==='todo').length,hold=bk.filter(b=>b.s==='hold').length;
  const dayIdx=Math.floor((now-start)/864e5);
  const today=(dayIdx>=0&&dayIdx<D.length)?D[dayIdx]:null,nx=today?D[dayIdx+1]:null;
  const heroD=today||dayById('d0629');
  const dis=JSON.parse(localStorage.sw_dismiss||'{}');
  const tEX=today?S.EX[today.id]:null;
  const todayBlock=today?`<div class="card" style="border-color:color-mix(in srgb,${today.color} 55%,transparent)"><div style="font-weight:800;font-size:14px;color:${today.color};margin-bottom:7px">📍 今日 ${today.date}（${today.dow}）· ${esc(today.title)}</div>${tEX?`<div style="font-size:13px"><b style="color:var(--gold2)">🎒</b> ${telLink(esc(tEX.carry))}</div><div style="font-size:13px;margin-top:5px"><b style="color:var(--gold2)">⏱</b> ${telLink(esc(tEX.pace))}</div>`:''}<button class="btn ghost" style="margin-top:9px" onclick="window.__dayDetail('${today.id}')">睇今日全部 ›</button>${nx?`<div class="muted" style="font-size:12px;margin-top:9px">明日 ${nx.date}：${esc(nx.title)}</div>`:''}</div>`:'';
  V.innerHTML=`
   <div class="nowhero" style="background-image:linear-gradient(180deg,rgba(5,6,14,.15),rgba(5,6,14,.92)),url('${img(heroD)}')">
     <div class="nh-top">🇸🇪 Sweden 2026</div>
     <div class="nh-big">${cd}</div>
     <div class="nh-sub">${esc(S.TRIP.sub)} · 22 日</div>
   </div>
   ${todayBlock}
   ${dis.robynfix?'':`<div class="alert">🎵 <b>更正：Robyn 唔係 7 月</b> — 場館官方(Stockholm Live)證實 Robyn Stockholm 場 = <b>10/17 @ 3Arena</b>(trip 之後),之前「7/16-17 Avicii Arena」係錯誤情報,已剔除。行程期間替代 live/電音查緊中。<button class="lnk" onclick="window.__dismiss('robynfix')">✕ 知道</button></div>`}
   ${dis.sixt?'':`<div class="alert">⛔ <b>南段命脈：Sixt 租車未 confirm</b> — Arctic Bath + 飛 GOT 全吊喺佢。<b>confirm 前唔好買 SK2051 機票。</b><button class="lnk" onclick="window.__go('status')">睇狀態 ›</button> <button class="lnk" onclick="window.__dismiss('sixt')">✕ 搞掂</button></div>`}
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
     <button class="quick" onclick="window.__photomap()">📷<span>攝影點</span></button>
     <button class="quick" onclick="window.__go('kit')">🆘<span>緊急/清單</span></button>
   </div>
   <div class="muted" style="font-size:11.5px;margin-top:16px">⚠️ 所有 2026 年 7 月暑期 hours/班次/天氣 = 臨行前一星期 reconfirm。圖片 CC 授權(見實用 tab)。更新 ${esc(S.TRIP.updated)}。</div>`;
}
window.__go=go; window.__photomap=()=>{photoLayer=true;go('map');};
window.__dayDetail=id=>{go('days');setTimeout(()=>renderDayDetail(id),20);};
window.__dismiss=k=>{const d=JSON.parse(localStorage.sw_dismiss||'{}');d[k]=1;localStorage.sw_dismiss=JSON.stringify(d);renderNow();};

/* ---------- 行程 DAYS ---------- */
let dayLeg='all';
function renderDays(){
  let legbtns=`<button class="legchip ${dayLeg==='all'?'on':''}" data-l="all">全部</button>`+
    S.LEGS.map(l=>`<button class="legchip ${dayLeg===l.key?'on':''}" data-l="${l.key}">${esc(l.name.replace(/ ·.*/,''))}</button>`).join('');
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
function renderDayDetail(id){
  killDmap();const d=dayById(id);window.scrollTo(0,0);
  const sun=S.SUN[legOf(id)];const ex=S.EX[id];
  const cap=S.HERO_CAP[id]||'';
  const meals=`<div class="meal"><span>🌅 ${esc(d.meals.b)}</span><span>☀️ ${esc(d.meals.l)}</span><span>🌙 ${esc(d.meals.d)}</span></div>`;
  const stops=(d.stops||[]).sort((a,b)=>a.o-b.o).map(s=>`
    <div class="stop ${s.opt?'opt':''}"><div class="o">${s.opt?'＋':s.o}</div>
      <div class="sb"><b>${esc(s.n)}</b> <span class="c">· ${esc(s.cat)}</span>${isPhoto(s)?' <span class="pc">📷</span>':''}<div class="nt">${telLink(esc(s.note||''))}</div></div>
      <a class="gm" href="${gmaps(s.n,s.ll)}" target="_blank">📍Maps</a></div>`).join('');
  const notes=(d.notes||[]).map(n=>`<div class="note-li">${telLink(esc(n))}</div>`).join('');
  const noSig=['d0630','d0701','d0702','d0703','d0704','d0705'].includes(id);
  const bks=(d.bk||[]).map(b=>`<span class="st ${b.s}">${S.BK[b.s].ico} ${esc(b.t)}</span>`).join('');
  const dir=dirURL(d.stops||[]);
  V.innerHTML=`
   <button class="ic" style="margin-bottom:10px" onclick="window.__back()">‹ 返行程</button>
   <div class="dd-hero" style="background-image:linear-gradient(180deg,rgba(0,0,0,.1),rgba(0,0,0,.8)),url('${img(d)}')">
     <div class="dd-date">${d.date}（${d.dow}）</div><div class="dd-ttl">${esc(d.title)}</div><div class="dd-th">${esc(d.theme)}</div>
     ${cap?`<div class="dd-cap">${esc(cap)}</div>`:''}</div>
   ${sun?`<div class="sunbar"><b>${sun.badge}</b> ${esc(sun.txt)}</div>`:''}
   ${ex?`<div class="exbox"><div class="exrow"><span class="exi">🎒</span><div><b>帶咩</b> ${telLink(esc(ex.carry))}</div></div><div class="exrow"><span class="exi">💡</span><div><b>小提示</b> ${telLink(esc(ex.tip))}</div></div><div class="exrow"><span class="exi">⏱</span><div><b>節奏</b> ${telLink(esc(ex.pace))}</div></div></div>`:''}
   <div class="block"><div class="bh">🛏 住邊 <span class="st ${d.accom.status}" style="margin-left:auto">${S.BK[d.accom.status].ico} ${S.BK[d.accom.status].t}</span></div><div style="font-size:13.5px">${esc(d.accom.name)}</div></div>
   <div class="block"><div class="bh">🍽 早 / 午 / 晚</div>${meals}</div>
   <div class="block"><div class="bh">📍 去邊 · 點行順 ${d.stops&&d.stops[0]?`<a class="wxlink" href="${wxURL(d.stops[0].ll)}" target="_blank">🌤 查天氣</a>`:''}${dir?`<a class="gm" style="margin-left:8px" href="${dir}" target="_blank">🧭 路線</a>`:''}</div>
     ${noSig?`<div class="offwarn">⚠️ 山段冇手機訊號 → 地圖底圖載唔到,靠紙本 Kungsleden 地圖 + 預載離線 GPS（Gaia/Maps.me）導航。</div>`:'<div id="dmap" class="dmap"></div>'}${stops||'<div class="muted">—</div>'}</div>
   <div class="block"><div class="bh">⚠️ 注意</div>${notes||'<div class="muted">—</div>'}</div>
   <div class="block"><div class="bh">🎟 買飛 / 狀態</div><div style="line-height:2.1">${bks||'<div class="muted">—</div>'}</div></div>`;
  if(document.getElementById('dmap'))makeMini(d);
}
window.__back=()=>{killDmap();go('days');};
function makeMini(d){
  const pts=(d.stops||[]).map(s=>[s.ll[1],s.ll[0]]);if(!pts.length)return;
  try{dmap=new maplibregl.Map({container:'dmap',style:MAP_STYLE,interactive:true,attributionControl:false});
    dmap.on('load',()=>{
      const main=(d.stops||[]).filter(s=>!s.opt).sort((a,b)=>a.o-b.o).map(s=>[s.ll[1],s.ll[0]]);
      if(main.length>1){dmap.addSource('r',{type:'geojson',data:{type:'Feature',geometry:{type:'LineString',coordinates:main}}});
        dmap.addLayer({id:'r',type:'line',source:'r',paint:{'line-color':d.color,'line-width':3.5,'line-opacity':.85}});}
      (d.stops||[]).forEach(s=>{const el=document.createElement('div');el.style.cssText=`width:${s.opt?11:15}px;height:${s.opt?11:15}px;border-radius:50%;background:${s.opt?'#bdb6a6':d.color};border:2px solid #fff`;
        new maplibregl.Marker({element:el}).setLngLat([s.ll[1],s.ll[0]]).setPopup(new maplibregl.Popup({offset:12,closeButton:false}).setHTML(`<b>${esc(s.n)}</b><br><a href="${gmaps(s.n,s.ll)}" target="_blank">📍 Maps ›</a>`)).addTo(dmap);});
      const b=pts.reduce((B,p)=>B.extend(p),new maplibregl.LngLatBounds(pts[0],pts[0]));dmap.fitBounds(b,{padding:34,maxZoom:13,duration:0});
    });
  }catch(e){}
}

/* ---------- 地圖 MAP ---------- */
const MAP_STYLE='https://tiles.openfreemap.org/styles/bright';
function renderMap(){
  const chipsHtml=S.DAYS.map(d=>`<button class="daychip ${curDay===d.id?'on':''}" style="${curDay===d.id?`background:${d.color}`:''}" data-d="${d.id}"><span class="dot" style="background:${d.color}"></span>${d.date}</button>`).join('');
  V.innerHTML=`<h1 class="pg">🗺️ 地圖</h1><div class="pg-sub">撳一日 → 只見嗰日 + 真路線 + 動畫</div>
    <div class="maptools"><button class="daychip ${!curDay?'on':''}" style="${!curDay?'background:var(--gold)':''}" data-d="">全程</button>${chipsHtml}</div>
    <div id="mapwrap"><div id="map"></div></div>
    <div class="maptools" style="margin-top:10px">
      <label class="savedtog"><input type="checkbox" id="savedChk" ${showSaved?'checked':''}> 顯示 optional/saved</label>
      <label class="savedtog"><input type="checkbox" id="photoChk" ${photoLayer?'checked':''}> 📷 攝影點圖層</label></div>`;
  if(!map){map=new maplibregl.Map({container:'map',style:MAP_STYLE,center:[17,63],zoom:3.4});
    map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');map.on('load',()=>drawDay());
  }else{document.getElementById('map').replaceWith(map.getContainer());setTimeout(()=>{map.resize();drawDay();},60);}
  V.querySelectorAll('.daychip').forEach(c=>c.onclick=()=>{curDay=c.dataset.d||null;renderMap();});
  $('#savedChk').onchange=e=>{showSaved=e.target.checked;drawDay();};
  $('#photoChk').onchange=e=>{photoLayer=e.target.checked;drawDay();};
}
function clearMap(){markers.forEach(m=>m.remove());markers=[];['route'].forEach(id=>{if(map.getLayer(id))map.removeLayer(id);if(map.getSource(id))map.removeSource(id);});}
function haversine(a,b){const R=6371,dLat=(b[1]-a[1])*Math.PI/180,dLon=(b[0]-a[0])*Math.PI/180,x=Math.sin(dLat/2)**2+Math.cos(a[1]*Math.PI/180)*Math.cos(b[1]*Math.PI/180)*Math.sin(dLon/2)**2;return 2*R*Math.asin(Math.sqrt(x));}
async function osrm(a,b){if(haversine(a,b)>8)return[a,b];try{const r=await fetch(`https://router.project-osrm.org/route/v1/foot/${a[0]},${a[1]};${b[0]},${b[1]}?overview=full&geometries=geojson`);const j=await r.json();return j.routes&&j.routes[0]?j.routes[0].geometry.coordinates:[a,b];}catch(e){return[a,b];}}
function mkr(ll,color,opt,photo,html){const el=document.createElement('div');el.style.cssText=`width:${opt?13:17}px;height:${opt?13:17}px;border-radius:50%;background:${opt?'#bdb6a6':color};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);${opt?'opacity:.7;':''}${photo?'box-shadow:0 0 0 3px rgba(245,200,66,.6);':''}`;
  const m=new maplibregl.Marker({element:el}).setLngLat(ll).setPopup(new maplibregl.Popup({offset:14,closeButton:false}).setHTML(html)).addTo(map);markers.push(m);}
async function drawDay(){
  if(!map||!map.isStyleLoaded()){map&&map.once('idle',drawDay);return;}
  clearMap();let stops=[];
  if(curDay){const d=dayById(curDay);stops=(d.stops||[]).map(s=>({...s,color:d.color}));}
  else{S.DAYS.forEach(d=>(d.stops||[]).forEach(s=>stops.push({...s,color:'#8a93b5'})));}
  if(photoLayer)stops=stops.filter(isPhoto);
  const shown=stops.filter(s=>!s.opt||showSaved);const pts=[];
  shown.forEach(s=>{const ll=[s.ll[1],s.ll[0]];pts.push(ll);
    mkr(ll,s.color,s.opt,isPhoto(s),`<b>${esc(s.n)}</b><br>${esc(s.cat)}<br><span style="opacity:.85">${esc(s.note||'')}</span><br><a href="${gmaps(s.n,s.ll)}" target="_blank">📍 Google Maps ›</a>`);});
  if(showSaved&&!photoLayer){const rT={in:'✅ 排咗',opt:'🤔 可選',skip:'💭 我建議 skip'};S.SAVED.forEach(s=>{mkr([s.ll[1],s.ll[0]],s.rec==='skip'?'#c8a59a':'#d8c08a',true,false,`<b>${esc(s.n)}</b><br>${rT[s.rec]||''}<br><span style="opacity:.85">${esc(s.why)}</span><br><a href="${gmaps(s.n,s.ll)}" target="_blank">📍 Google Maps ›</a>`);});}
  if(curDay&&!photoLayer){const d=dayById(curDay);const main=(d.stops||[]).filter(s=>!s.opt).sort((a,b)=>a.o-b.o).map(s=>[s.ll[1],s.ll[0]]);
    if(main.length>1){let full=[];for(let i=0;i<main.length-1;i++){const seg=await osrm(main[i],main[i+1]);full=full.concat(i?seg.slice(1):seg);}
      if(map.getSource('route')){if(map.getLayer('route'))map.removeLayer('route');map.removeSource('route');}
      map.addSource('route',{type:'geojson',data:{type:'Feature',geometry:{type:'LineString',coordinates:full}}});
      map.addLayer({id:'route',type:'line',source:'route',paint:{'line-color':d.color,'line-width':3.5,'line-opacity':.9}});}}
  if(pts.length){const b=pts.reduce((B,p)=>B.extend(p),new maplibregl.LngLatBounds(pts[0],pts[0]));map.fitBounds(b,{padding:50,maxZoom:curDay?13:5,duration:900});}
}

/* ---------- 狀態 STATUS ---------- */
function renderStatus(){
  const bk=S.DAYS.flatMap(d=>(d.bk||[]).map(b=>({...b,date:d.date})));
  const order=['hold','todo','pend','paid'],lbl={hold:'⛔ On-hold（等依賴）',todo:'🕒 仲要訂',pend:'⏳ 等緊確認',paid:'✅ 已訂/已付'};
  const cnt=s=>bk.filter(b=>b.s===s).length, tot=bk.length, paid=cnt('paid'), pct=Math.round(paid/tot*100);
  const segs=[['paid',cnt('paid')],['pend',cnt('pend')],['todo',cnt('todo')],['hold',cnt('hold')]];
  const segbar=`<div class="segbar">${segs.map(([s,n])=>n?`<i style="width:${(n/tot*100).toFixed(1)}%;background:${S.BK[s].c}"></i>`:'').join('')}</div><div class="seglegend">${segs.map(([s,n])=>`<span><b style="background:${S.BK[s].c}"></b>${S.BK[s].t} ${n}</span>`).join('')}</div>`;
  const bookHtml=(S.BOOK||[]).map(b=>`<div class="bookcard ${b.s}">
    <div class="bc-top"><b class="bc-ttl">${esc(b.t)}</b><span class="st ${b.s}" style="margin:0">${S.BK[b.s].ico} ${S.BK[b.s].t}</span></div>
    <div class="bc-grid">
      <div><span class="bc-k">📅 訂邊日</span><span class="bc-v">${esc(b.d)}</span></div>
      <div><span class="bc-k">👥 幾多人</span><span class="bc-v">${esc(b.pax)}</span></div>
      <div class="bc-wide"><span class="bc-k">💰 幾多錢</span><span class="bc-v">${esc(b.price)}</span></div>
    </div>
    <div class="bc-dl">⏰ ${telLink(esc(b.dl))}</div>
    <a class="bc-go" href="${b.where}" target="_blank">🔗 去 ${esc(b.wl)} 訂 ›</a>
  </div>`).join('');
  const groups=order.map(s=>{const items=bk.filter(b=>b.s===s);if(!items.length)return'';
    return `<div class="sec-h">${lbl[s]} <span class="muted">(${items.length})</span></div><div class="card">${items.map(b=>`<div class="strow"><span class="st ${b.s}" style="margin:0">${S.BK[b.s].ico}</span><div class="sm"><b>${esc(b.t)}</b><small>${b.date}</small></div></div>`).join('')}</div>`;}).join('');
  const pb=S.PLANB;
  const notesHtml=S.TRIP.notesUrl?`<a class="btn ghost" href="${S.TRIP.notesUrl}">🔐 開 Apple Note 睇 code ›</a>`:`<div style="font-size:13px">喺你 iPhone <b>備忘錄/Notes</b> 搜尋「<b>🇸🇪 Sweden 2026 · Booking Codes</b>」(只有你 iCloud 登入睇到)。</div><div class="muted" style="font-size:11px;margin-top:6px">想一撳直達?喺 Notes 整條 iCloud 分享 link 俾我,我嵌落呢度。</div>`;
  V.innerHTML=`<h1 class="pg">✅ 狀態</h1><div class="pg-sub">你最在意嘅——一眼睇晒 booking · 行動 · 依賴</div>
   <div class="card"><div style="display:flex;justify-content:space-between;font-size:13px"><b style="color:var(--white)">已搞掂 ${paid}/${tot}</b><span class="muted">${pct}%</span></div>${segbar}</div>
   <div class="planb"><div class="pbt">${esc(pb.title)}</div>${pb.steps.map(s=>`<div style="margin:6px 0">${telLink(esc(s))}</div>`).join('')}</div>
   <div class="sec-h">🎯 你要訂嘅嘢 · 訂邊日 · 邊度 · 幾多人 · 幾多錢 · 幾時截</div>
   <div class="pg-sub" style="margin:-2px 2px 6px">由最緊要排落去 · 撳藍掣直接去嗰個官方訂位／報價</div>
   ${bookHtml}
   ${groups}
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
