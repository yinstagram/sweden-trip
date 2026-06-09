/* ============================================================
   Sweden Trip 2026 — 單一真相資料層 (data.js)
   Ng Cho Yin + Cheng Kam Ling · 6/27–7/18 (22 日)
   機密 booking code 唔放呢度（公開站）→ 喺 Apple Note + brain。
   座標 OSM Nominatim 驗證；北段山屋 = STF 地圖約位(remote)。
   ============================================================ */
const TRIP = {
  title: 'Sweden 2026',
  sub: 'Ng Cho Yin & Cheng Kam Ling · 6/27 – 7/18',
  notesUrl: '',           // ← Yin Apple Note iCloud 私人 link（你出，我嵌；暫空 = 掣開 Notes app）
  updated: '2026-06-09',
};

// booking 狀態色：paid 已付 / pend 暫定等確認 / todo 未訂 / hold on-hold(依賴)
const BK = { paid:{ico:'✅',t:'已付/已訂',c:'#4ade80'}, pend:{ico:'⏳',t:'暫定·等確認',c:'#e8a930'},
             todo:{ico:'🕒',t:'未訂',c:'#22d3ee'}, hold:{ico:'⛔',t:'On-hold·等依賴',c:'#f87171'} };

const LEGS = [
  { key:'north', name:'🏔 北段 · 行山 + Arctic Bath', days:['d0627','d0628','d0629','d0630','d0701','d0702','d0703','d0704','d0705','d0706','d0707','d0708'] },
  { key:'gbg',   name:'🇸🇪 Göteborg',                 days:['d0709','d0710','d0711'] },
  { key:'alm',   name:'🛋 Älmhult · IKEA',            days:['d0712','d0713'] },
  { key:'sto',   name:'🏙 Stockholm',                  days:['d0714','d0715','d0716','d0717','d0718'] },
];

/* 每日: id,date,dow,leg,color,title,theme, accom{name,status},
   meals{b,l,d}, stops[{n,ll,cat,note,o,opt}], notes[], bk[{s,t}], events[] */
const DAYS = [
//──────────────────── 北段 ────────────────────
{ id:'d0627', date:'6/27', dow:'六', leg:'north', color:'#6b7a8f',
  title:'抵瑞典', theme:'HK → Arlanda 過夜',
  accom:{name:'Comfort Hotel Arlanda（機場過夜）', status:'paid'},
  meals:{b:'機上', l:'機上', d:'機場 / 酒店'},
  stops:[{n:'Comfort Hotel Arlanda',ll:[59.6468,17.9370],cat:'機場酒店',note:'落機過一晚,翌日飛 Kiruna',o:1}],
  notes:['⚠️ PVG 轉機只 2 鐘 25 分(14:50 起飛)——行李直掛但人要趕過轉機。','落 ARN 21:00 後到酒店,買定水/早餐。'],
  bk:[{s:'paid',t:'✈️ China Eastern 來回(PNR 喺 Apple Note)'},{s:'paid',t:'🏨 Comfort Hotel Arlanda'}] },

{ id:'d0628', date:'6/28', dow:'日', leg:'north', color:'#5a7a8c',
  title:'飛 Kiruna · 買糧+氣罐', theme:'極圈補給日',
  accom:{name:'STF Kiruna', status:'paid'},
  meals:{b:'酒店', l:'機上 / Kiruna', d:'Kiruna'},
  stops:[
    {n:'Kiruna（極圈城）',ll:[67.8496,20.3063],cat:'城/補給',note:'ARN→Kiruna 11:35–13:10(Norwegian D8 4063)',o:1},
    {n:'ICA Kvantum Kiruna',ll:[67.8485,20.2538],cat:'超市·買糧',note:'Österleden 2 · 每日 07–22 · 行山乾糧/凍乾餐一站買齊 · 黃昏買最順',o:2},
    {n:'Jaktia Kiruna（氣罐）',ll:[67.8444,20.2537],cat:'戶外舖·氣罐',note:'Österleden 12 · 一–五10–18/六10–15 · 買 2×230g 螺紋 gasol · ⚠️氣罐唔上得飛機!',o:3}],
  notes:['🔥 落 Kiruna 即買 7 日糧(ICA Kvantum)+ 氣罐(Jaktia/Intersport,螺紋EN417)。','⚠️ 氣罐飛機唔可帶 → 一定當地買;趕唔切市區 → 6/29 Abisko Fjällboden 買(會 sell out,email abisko.butik@stfturist.se 預留)。','沿途山屋有得補:Abiskojaure/Alesjaure/Sälka 都有 shop 賣 gasol → 唔使孭7日量,孭2日 buffer。'],
  bk:[{s:'paid',t:'✈️ Norwegian ARN→Kiruna'},{s:'paid',t:'🛏 STF Kiruna'},{s:'todo',t:'🛒 行山糧+氣罐(當地買)'}] },

{ id:'d0629', date:'6/29', dow:'一', leg:'north', color:'#3f8c66',
  title:'Abisko 安頓 + 午夜太陽', theme:'輕鬆熱身日(唔行正路)',
  accom:{name:'STF Abisko Turiststation（有餐廳/shop Fjällboden）', status:'paid'},
  meals:{b:'山屋', l:'山屋 Restaurang Kungsleden', d:'山屋'},
  stops:[
    {n:'STF Abisko Turiststation',ll:[68.3574,18.7825],cat:'山屋·起點',note:'Fjällboden shop 有 gas/凍乾餐;可寄行李去 Nikkaluokta',o:1},
    {n:'Aurora Sky Station（吊椅）',ll:[68.3530,18.7300],cat:'吊椅·觀景',note:'午夜太陽班 6/14–7/19 20:00–01:30 → 6/29 行得 · 頂俯瞰 Torneträsk + Lapporten',o:2}],
  notes:['🌞 午夜太陽(Abisko ~5/25–7月中,24 小時日照)——6/29 上 Nuolja 頂影 midnight sun + Lapporten U 形谷。','山頂風大保暖;吊椅班次臨行 confirm。','喺 Fjällboden 安排寄行李去 Nikkaluokta(出山輕身)。'],
  bk:[{s:'paid',t:'🛏 STF Abisko'},{s:'todo',t:'🎟 Aurora Sky Station 吊椅(現場)'}] },

{ id:'d0630', date:'6/30', dow:'二', leg:'north', color:'#3f8c66',
  title:'Abisko → Abiskojaure', theme:'15km · +100m · 4–5h（最易·熱身）',
  accom:{name:'STF Abiskojaure（桑拿 + shop）', status:'paid'},
  meals:{b:'山屋', l:'行山乾糧', d:'山屋自煮（共用煤氣爐）'},
  stops:[{n:'STF Abiskojaure',ll:[68.2960,18.6900],cat:'山屋(約位)',note:'沿 Abiskojokk 河 · 穿 Abisko 國家公園 · 有桑拿+補給賣',o:1}],
  notes:['全程最易一日,當熱身。','河水清可直飲;低地蚊多 → 戴頭網。','過河有橋,唔使涉水。'],
  bk:[{s:'paid',t:'🛏 STF Abiskojaure'}] },

{ id:'d0701', date:'7/1', dow:'三', leg:'north', color:'#3f8c66',
  title:'Abiskojaure → Alesjaure', theme:'21km · +300m · 6–7h',
  accom:{name:'STF Alesjaure（柴火桑拿 + shop）', status:'paid'},
  meals:{b:'山屋', l:'行山乾糧', d:'山屋自煮'},
  stops:[{n:'STF Alesjaure',ll:[68.1710,18.4820],cat:'山屋(約位)',note:'全程最大山屋之一 · 湖景 · 柴火桑拿 · 有 shop 補給',o:1}],
  notes:['開揚 fell 地貌,「Lapland 最美一面」野河廣谷。','21km 較長,早出發;下午到歎桑拿。','部分行程暑期有船過湖可省路(臨行查船期)。'],
  bk:[{s:'paid',t:'🛏 STF Alesjaure'}] },

{ id:'d0702', date:'7/2', dow:'四', leg:'north', color:'#b0673a',
  title:'Alesjaure → Sälka（過 Tjäktja 山口）', theme:'⚠️ ~25km · 全程最高 1140m · 8–9h（炸彈日）',
  accom:{name:'STF Sälka（桑拿 + shop）', status:'paid'},
  meals:{b:'山屋', l:'行山乾糧（補夠水）', d:'山屋自煮'},
  stops:[
    {n:'Tjäktja Pass 1140m（全程最高）',ll:[68.0500,18.4900],cat:'山口·最高點',note:'兩邊兩種地貌 · 冰川背景 · 過後落谷碎石濕滑',o:1},
    {n:'STF Sälka',ll:[67.9670,18.5030],cat:'山屋(約位)',note:'有桑拿 + shop',o:2}],
  notes:['🔴 全程最辛苦一日!STF 官方拆做兩日,你哋夾一日 ~25km 過最高山口 → 攝影 pace 隨時 10–11 鐘。','務必最早出發(理想 7–8am)。山口天氣變化大、7 月都可能風雪、能見度低 → 慢行、帶行山杖。','高原溪流稀疏,過山口前後補夠水。','💡 可考慮喺 Tjäktja 加一晚拆兩日(要 rebook STF)——同 Yin confirm。'],
  bk:[{s:'paid',t:'🛏 STF Sälka'}] },

{ id:'d0703', date:'7/3', dow:'五', leg:'north', color:'#3f8c66',
  title:'Sälka → Singi', theme:'12km · −100m · 3–4h（最短·歎）',
  accom:{name:'STF Singi（❌ 冇 shop）', status:'paid'},
  meals:{b:'山屋', l:'行山乾糧', d:'山屋自煮（糧要 Sälka 買定）'},
  stops:[{n:'STF Singi',ll:[67.9160,18.5000],cat:'山屋·岔路口(約位)',note:'⚠️冇 shop · Kungsleden 喺度分叉(南落 Vakkotavare / 東去 Kebnekaise)',o:1}],
  notes:['穿宏偉 U 形 Tjäktjavagge 冰蝕谷,平坦易行,可慢慢影。','過 Gaskkasjohka 河吊橋;有馴鹿圍欄標 Sami 邊界。','⚠️ Singi 冇補給 → 7/2 Sälka 買定 7/3 全日糧。岔路口睇路標東行 Kebnekaise,唔好行錯。'],
  bk:[{s:'paid',t:'🛏 STF Singi'}] },

{ id:'d0704', date:'7/4', dow:'六', leg:'north', color:'#3f8c66',
  title:'Singi → Kebnekaise（經 Kaffedalen）', theme:'14km · ±150m · 4–5h',
  accom:{name:'STF Kebnekaise Fjällstation（淋浴/桑拿/餐廳）', status:'paid'},
  meals:{b:'山屋', l:'行山乾糧 / 打包', d:'🍽 Elsas kök 餐廳 buffet（全程最舒適一晚）'},
  stops:[{n:'STF Kebnekaise Fjällstation',ll:[67.8680,18.6195],cat:'山站·補給點',note:'瑞典最高峰山腳 · 有淋浴/桑拿/正式晚餐餐廳',o:1}],
  notes:['轉東入 Ladtjovagge 谷,經 Kaffedalen「咖啡谷」;瑞典最高峰 Kebnekaise(2097m)逐漸現身。','到站洗澡 + 食好餐回氣,為明日 19km 出山養神。','登頂 Kebnekaise 係另一日 round-trip(行程冇排,唔好臨時加)。','💡 喺呢度有訊號 → 訂定 7/5 16:55 巴士飛(山中冇訊號)。'],
  bk:[{s:'paid',t:'🛏 STF Kebnekaise'}] },

{ id:'d0705', date:'7/5', dow:'日', leg:'north', color:'#5a7a8c',
  title:'出山 → Nikkaluokta → 巴士 → Kiruna', theme:'19km(可搭船省6km) → 巴士 16:55',
  accom:{name:'STF Kiruna', status:'paid'},
  meals:{b:'山屋', l:'🦌 Nikkaluokta「Lap Dånalds」馴鹿漢堡', d:'Kiruna'},
  stops:[
    {n:'Nikkaluokta（出山口·巴士站）',ll:[67.8514,19.0154],cat:'村·巴士總站',note:'下船碼頭有 Sami 帳篷咖啡 Kaffekåta + 馴鹿漢堡',o:1},
    {n:'Kiruna',ll:[67.8496,20.3063],cat:'城',note:'巴士 18:30 到 · 落 Norrmalm 站最近 STF',o:2}],
  notes:['🚍 巴士 16:55→18:30(青年票已買)。⚠️ 網訂 15:55 截 → 喺 Kebnekaise(有訊號)訂定;現場上車 +200/人罰貴。','倒推:全走 19km(5.5–6.5h)→ 最遲 8:30am 出發最穩;搭 Ladtjojaure 湖船省 6km(~13km)可遲到 10:30 但船按 timetable,臨行 confirm 唔好賭。','蚊極多(防蚊+頭網照叮);錯過尾班 = 瞓 Nikkaluokta。'],
  bk:[{s:'paid',t:'🚌 Nikkaluokta→Kiruna 巴士'},{s:'paid',t:'🛏 STF Kiruna'}] },

{ id:'d0706', date:'7/6', dow:'一', leg:'north', color:'#7a9cb0',
  title:'Kiruna 取車 → Arctic Bath', theme:'⛔ 等 Sixt confirm',
  accom:{name:'Arctic Bath（2 晚 · Harads）', status:'hold'},
  meals:{b:'Kiruna', l:'途中', d:'🍽 Arctic Bath 餐廳'},
  stops:[
    {n:'Arctic Bath',ll:[66.0887,20.9370],cat:'🧖 漂浮 spa 酒店',note:'Harads · 揸 ~3h 由 Kiruna · 浮喺 Lule 河上',o:1}],
  notes:['🚗 Kiruna 10:00 取 Sixt EX30(電動)→ 揸 ~3h → Arctic Bath。取車帶國際駕照 + 實體信用卡按金。','⚠️⚠️ 整段南段吊喺 Sixt 一架車度(見「交通」tab 依賴鏈)。Sixt 未 confirm = Arctic Bath 都未落實。Plan B = 火車去 Luleå。','EX30 電動車 → 確認沿途充電到 Harads。'],
  bk:[{s:'hold',t:'🚗 Sixt EX30(等 confirm·Hertz 拒單程→Sixt 唯一)'},{s:'hold',t:'🧖 Arctic Bath(等 Sixt)'}] },

{ id:'d0707', date:'7/7', dow:'二', leg:'north', color:'#7a9cb0',
  title:'🎂 Yin 21 歲 · Arctic Bath spa', theme:'純享受日',
  accom:{name:'Arctic Bath', status:'hold'},
  meals:{b:'Arctic Bath', l:'Arctic Bath', d:'🎂 生日晚餐（提早訂枱）'},
  stops:[{n:'Arctic Bath',ll:[66.0887,20.9370],cat:'🧖 spa',note:'冷池 + sauna + 浮 cabin · 全日 relax',o:1}],
  notes:['🎂 Yin 21 歲生日!提早同 Arctic Bath 講有冇生日 surprise / 訂枱。','純 relax,養返行山攰。'],
  bk:[{s:'hold',t:'🧖 Arctic Bath spa'}] },

{ id:'d0708', date:'7/8', dow:'三', leg:'north', color:'#c98a5e',
  title:'還車 → 飛 GOT → Göteborg 到埗', theme:'⚠️ 超趕 + 轉戰南方',
  accom:{name:'WOW Apartments（Göteborg）', status:'pend'},
  meals:{b:'Arctic Bath', l:'機上 / 到埗', d:'🍽 Magasinsgatan 一帶'},
  stops:[
    {n:'Luleå 機場（還車）',ll:[65.5431,22.1219],cat:'還車+機場',note:'Harads→Luleå ~1h+ · 還 Sixt → SK2051 09:55–11:35 飛 GOT',o:1},
    {n:'Haga Nygata（Göteborg）',ll:[57.6987,11.9552],cat:'老區散步',note:'落機後 Flygbussarna ~35分入市 → check-in → Haga',o:2},
    {n:'Café Husaren',ll:[57.6984,11.9597],cat:'Café',note:'巨型肉桂卷 Hagabullen(vegan)',o:3},
    {n:'da Matteo',ll:[57.7032,11.9624],cat:'咖啡',note:'2025 北歐最佳烘焙 · Magasinsgatan 17A',o:4}],
  notes:['⚠️ 超趕:Harads→Luleå 機場 ~1h+ 揸 + 還車手續,09:55 起飛 → ~07:30 到機場。還車前影低車況 + 油/電量。','⚠️ SK2051 機票未買(等 Sixt confirm 先買,LLA 起飛改唔到)。','落 GOT → Flygbussarna 入市(唔係 Västtrafik 票) → WOW check-in → Haga 老城 + da Matteo 收身。'],
  bk:[{s:'todo',t:'✈️ SK2051 LLA→GOT(等 Sixt 先買)'},{s:'pend',t:'🏠 WOW Apartments(訂時 check)'}] },

//──────────────────── Göteborg ────────────────────
{ id:'d0709', date:'7/9', dow:'四', leg:'gbg', color:'#9a5b34',
  title:'World of Volvo + Hasselblad', theme:'車 + 攝影（兩個地方·搭 tram）',
  accom:{name:'WOW Apartments', status:'pend'},
  meals:{b:'WOW / café', l:'🍽 Ceno Brasserie（場內）', d:'🍽 Mr P / Familjen（Götaplatsen）'},
  stops:[
    {n:'World of Volvo',ll:[57.6895,11.9978],cat:'體驗館',note:'Lyckholms Torg 1 · 10:00 開 · 訂時段慳10% · 成人 220–250 · tram 2/4 Liseberg Södra',o:1},
    {n:'Hasselblad Center',ll:[57.6966,11.9807],cat:'攝影館',note:'@Konstmuseum Götaplatsen 6(離 Volvo ~3km,搭 tram) · 75 SEK · <20 免 · 逢一閉',o:2},
    {n:'Mr P',ll:[57.6975,11.9790],cat:'餐廳(食)',note:'Götaplatsen · 分享菜+cocktail · Hasselblad 出門口左手',o:3,opt:true}],
  notes:['World of Volvo 同 Hasselblad 係兩個唔同地方相隔 ~3km,中間搭 tram。','Volvo 訂時段慳10%(Comet 訂,俾錢前停)。Konstmuseum 逢一閉(今日四 OK);20 歲要俾 75,帶學生證問免費。','食:場內 Ceno(唔使走) 或 Götaplatsen 嗰邊 Mr P/Familjen(夾 Hasselblad)。'],
  bk:[{s:'todo',t:'🎟 World of Volvo 時段(Comet 訂)'}] },

{ id:'d0710', date:'7/10', dow:'五', leg:'gbg', color:'#b0673a',
  title:'Saab Car Museum @ Trollhättan', theme:'火車 day-trip（換走 Vrångö）',
  accom:{name:'WOW Apartments', status:'pend'},
  meals:{b:'WOW', l:'Innovatum 一帶 café', d:'🍽 Göteborg 市區'},
  stops:[
    {n:'Saab Car Museum',ll:[58.2722,12.2765],cat:'汽車博物館',note:'Innovatum, Trollhättan · 每日10–17 · 160 SEK · 夏天「The Box」特展 · ~2h',o:1},
    {n:'Innovatum Science Center',ll:[58.2720,12.2768],cat:'科學館',note:'Saab 隔離 2 分鐘 · 6/21–8/17 開 · 落雨都室內 OK',o:2},
    {n:'Slussområdet 運河船閘 + 峽谷',ll:[58.2837,12.2909],cat:'步行區(免費)',note:'1700s 古船閘 + 花崗岩峽谷,即使冇放水都上鏡',o:3}],
  notes:['🚆 Göteborg C → Trollhättan ~34–38 分(Västtåg,~每30分一班),當場買。','⚠️ 瀑布放水 2026 夏天冇(Vattenfall 唔做日常放水,只 7/17–19 festival,你之前一星期)→ 改睇 Saab+Innovatum+古船閘峽谷。','Saab hours 官網(10–17)vs 第三方(11–16)有矛盾 → 打 +46-520-289440 confirm 7/10 開。'],
  bk:[{s:'todo',t:'🚆 Göteborg↔Trollhättan 火車(當場)'},{s:'todo',t:'🎟 Saab Car Museum 入場'}] },

{ id:'d0711', date:'7/11', dow:'六', leg:'gbg', color:'#6b8e4e',
  title:'滑翔傘 @ Kareby + Slottsskogen', theme:'天氣 backup 日（老實講半日吊住）',
  accom:{name:'WOW Apartments', status:'pend'},
  meals:{b:'WOW', l:'市區', d:'市區'},
  stops:[
    {n:'Äventyrscenter 滑翔傘',ll:[57.9062,11.9319],cat:'活動(Kareby)',note:'Murhammarv.15 · 週末drop-in 12–15 · 900 SEK · 北27km taxi ~25min/400–550 SEK',o:1},
    {n:'Slottsskogen',ll:[57.6870,11.9419],cat:'公園(免費)',note:'15:00 返到夾得到 · 黃昏行公園+動物(海豹/企鵝)',o:2},
    {n:'Radiomuseet',ll:[57.7087,11.9453],cat:'電台博物館(你 saved)',note:'二–日12–15 · 古董電台 niche · optional',o:8,opt:true}],
  notes:['⚠️ 09:00 後打 070-66 77 210 confirm 天氣(風/雨即 cancel)+ 約 taxi。drop-in 限週末,7/11 六啱。','😤 老實講:滑翔傘係「半日吊住」——唔係飛得耐(空中 5–8 分),係等風+排隊唔可控,隨時拖到 15:00。所以同日唔好再排 must-do,Slottsskogen 黃昏散步當 bonus。','天氣差全日 backup:Universeum 科學館/水族館(室內) + Feskekörka 魚市場 + Haga café。'],
  bk:[{s:'todo',t:'🪂 滑翔傘(當日現場 900 SEK)'}] },

//──────────────────── Älmhult ────────────────────
{ id:'d0712', date:'7/12', dow:'日', leg:'alm', color:'#c2a14a',
  title:'火車 → Älmhult（IKEA 發源地）', theme:'IKEA Hotell 入住',
  accom:{name:'IKEA Hotell（Älmhult）', status:'paid'},
  meals:{b:'WOW / Göteborg', l:'火車上 / Älmhult', d:'🍽 IKEA Hotell 餐廳'},
  stops:[
    {n:'IKEA Hotell',ll:[56.5522,14.1323],cat:'住宿',note:'IKEAgatan 1 · 7/12 夜',o:1},
    {n:'IKEA 旗艦店 Älmhult',ll:[56.5500,14.1625],cat:'IKEA 店',note:'第一間 IKEA 嘅鎮',o:2}],
  notes:['🚆 Göteborg C 09:55 → Älmhult 14:15(SJ,經 Lund) → IKEA Hotell check-in。','下午:IKEA 旗艦店 / Älmhult 鎮散步(Möckeln 湖 15km 較遠無公交)。','🛝 Live! Älmhult Pippi 長襪皮皮 pop-up 6/25–7/18(免費打卡,順路)。'],
  bk:[{s:'paid',t:'🚆 SJ Göteborg→Älmhult'},{s:'paid',t:'🏨 IKEA Hotell'}] },

{ id:'d0713', date:'7/13', dow:'一', leg:'alm', color:'#a8842f',
  title:'IKEA Museum 全日 → 夜車去 Stockholm', theme:'玩足 IKEA 先走',
  accom:{name:'Stockholm · Älvsjö Airbnb（夜到）', status:'pend'},
  meals:{b:'IKEA Hotell', l:'🍽 IKEA Museum café', d:'火車上 / Älvsjö'},
  stops:[
    {n:'IKEA Museum',ll:[56.5523,14.1344],cat:'博物館',note:'IKEAgatan 5 · 原祖 IKEA(1943)展覽 + Småland 積木 · 99–149 SEK · ⚠️7月hours confirm',o:1}],
  notes:['IKEA Museum 全日玩(展覽 + Småland 積木體驗 + café)。','🚆 17:09 火車 → Stockholm 20:38 → Älvsjö ~21:30。','📩 到中央站前主動 message 屋主(host Maria)講 7/13 ~21:30 遲到。'],
  bk:[{s:'paid',t:'🚆 SJ Älmhult→Stockholm'},{s:'pend',t:'🏠 Stockholm Airbnb(Älvsjö·講遲到)'}] },

//──────────────────── Stockholm ────────────────────
{ id:'d0714', date:'7/14', dow:'二', leg:'sto', color:'#b8893f',
  title:'Djurgården 博物館島 + Allsång', theme:'Vasa 早開 + 國民合唱夜',
  accom:{name:'Stockholm · Älvsjö Airbnb', status:'pend'},
  meals:{b:'出發前', l:'🍽 Rosendals Trädgård 花園 café', d:'Skansen 內 / Djurgården'},
  stops:[
    {n:'Vasamuseet',ll:[59.3281,18.0914],cat:'沉船博物館',note:'08:30 早開避團 · 240 SEK',o:1},
    {n:'Nordiska museet',ll:[59.3291,18.0939],cat:'🧶 紡織/文化',note:'紡織收藏(crochet) · 170',o:2},
    {n:'Skansen',ll:[59.3266,18.1053],cat:'露天博物館',note:'歷史村 + 北歐動物;Solliden 台 = Allsång 場',o:3},
    {n:'ABBA The Museum',ll:[59.3249,18.0966],cat:'博物館(你 saved)',note:'同 Skansen 二揀一',o:4,opt:true}],
  notes:['Vasa 08:30 一開就去(人最少最好影)。Skansen / ABBA 二揀一。','🎤 晚 Allsång på Skansen(週二場,Solliden 台,直播 20:00,綵排 17–18)。企位用 Skansen 飛即可;想坐 Ticketmaster 早買 ~495–595。','SL 7-day 票到埗 app 買,試買 290 平票(≤20 歲)。'],
  bk:[{s:'pend',t:'🎫 SL 7-day 票(到埗買·試290平票)'},{s:'todo',t:'🎤 Allsång på Skansen(option·早買)'}] },

{ id:'d0715', date:'7/15', dow:'三', leg:'sto', color:'#2f6f8f',
  title:'RIB 出海 + 咖啡器材 + Fotografiska', theme:'水上日（週三 BOGO 夜）',
  accom:{name:'Stockholm · Älvsjö Airbnb', status:'pend'},
  meals:{b:'出發前', l:'Strandvägen 區輕食', d:'🍽 Fotografiska 餐廳（黃昏景觀·訂位）'},
  stops:[
    {n:'RIB Stockholm 碼頭',ll:[59.3318,18.0842],cat:'RIB 快艇',note:'Strandvägen Kajplats 19 · 1490/人 · 2h · 42節 · 提供保暖連身衣 · 12 歲+',o:1},
    {n:'Drop Coffee',ll:[59.3169,18.0627],cat:'☕ 咖啡器材(你 saved)',note:'Wollmar Yxkullsgatan 10 · 賣豆+器材',o:2},
    {n:'Johan & Nyström',ll:[59.3164,18.0639],cat:'☕ 器材最齊',note:'Swedenborgsgatan 7 概念店',o:3},
    {n:'Fotografiska',ll:[59.3180,18.0847],cat:'攝影博物館(你 saved)',note:'週三18:00後買一送一! · 開到23:00 · 195 SEK',o:4}],
  notes:['🚤 下午 RIB 2h(Dock 19) · 船家提供救生衣+保暖連身衣,著平日衫入面 · ⚠️高速濺水 A7S III 要防水罩唔好換鏡。','黃昏返 SoFo 行咖啡器材(Drop + Johan & Nyström,GF priority)。','📷 Fotografiska 週三 18:00 後買一送一(慳一半!)開到 23:00,夜晚啱影相 + 景觀餐廳。','⚠️ 天氣敏感:RIB+Fjäderholmarna 要好天,落雨同 16/17 對調。查實渡輪尾班船。'],
  bk:[{s:'todo',t:'🎟 RIB Stockholm(fareharbor 訂時段)'}] },

{ id:'d0716', date:'7/16', dow:'四', leg:'sto', color:'#9a4f6e',
  title:'Avicii + 毛線 + 古著黑膠', theme:'crochet 日 + Robyn jackpot 夜',
  accom:{name:'Stockholm · Älvsjö Airbnb', status:'pend'},
  meals:{b:'🍽 Vete-Katten（百年 konditori）', l:'🍽 Kajsas Fisk（Hötorget 魚湯)', d:'🍽 Pelikan / Meatballs for the People'},
  stops:[
    {n:'Avicii Experience',ll:[59.3331,18.0642],cat:'體驗館(你 saved)',note:'Sergelgatan 2 · 10:00 頭場最少人 · 提早訂時段 · ~209 SEK',o:1},
    {n:'Svensk Hemslöjd',ll:[59.3353,18.0712],cat:'🧶 官方手工藝(你 saved)',note:'Norrlandsgatan 20 · 行 5 分鐘 · 瑞典羊毛',o:2},
    {n:'Litet Nystan',ll:[59.3152,18.0823],cat:'🧶 毛線(你 saved)',note:'Folkungagatan 100 · Gotland 羊毛 · 趁一–五 18:00 前',o:3},
    {n:'Pet Sounds Records',ll:[59.3121,18.0780],cat:'二手黑膠',note:'Skånegatan 53',o:4,opt:true},
    {n:'🎵 Robyn @ Avicii Arena',ll:[59.2936,18.0832],cat:'演唱會·電音國寶',note:'7/16 或 7/17 19:30 · jackpot · 早買飛 robyn.com/tour',o:9,opt:true}],
  notes:['🕯️ Avicii 10:00 頭場(提早訂時段)→ 行 5 分鐘 Svensk Hemslöjd(🧶)。','⚠️ 暑假細店多 semesterstängt → Svensk Hemslöjd/Litet Nystan 趁一–五營業 + 18:00 前。','🎵 晚 jackpot:Robyn @ Avicii Arena 7/16 或 7/17 19:30(瑞典電音國寶 hometown,兩晚揀一)→ 要早買飛!'],
  bk:[{s:'todo',t:'🎟 Avicii Experience(提早訂時段)'},{s:'todo',t:'🎵 Robyn 演唱會飛(7/16或17·早買)'}] },

{ id:'d0717', date:'7/17', dow:'五', leg:'sto', color:'#4a5d8a',
  title:'市政廳 + Gamla Stan + 美術館', theme:'攝影/高處（鬆啲，揀一重點）',
  accom:{name:'Stockholm · Älvsjö Airbnb', status:'pend'},
  meals:{b:'Gamla Stan café', l:'🍽 Chokladkoppen（Stortorget）', d:'🍽 Aifur 維京餐 / Nationalmuseum 餐廳'},
  stops:[
    {n:'Stadshuset（市政廳塔）',ll:[59.3275,18.0542],cat:'導覽+觀景',note:'導覽45分(夏季半鐘一團) · 塔5–9月開106m · 票飛T-7/當日08:30 City Hall Shop · 150',o:1},
    {n:'Gamla Stan Stortorget',ll:[59.3250,18.0708],cat:'舊城',note:'晨攝 + Nobel Prize Museum(Stortorget 2,你 saved)',o:2},
    {n:'Nationalmuseum',ll:[59.3285,18.0781],cat:'國家美術館(你 saved)',note:'免費常設 + 設計藏品 · 順路 Kungsträdgården',o:3},
    {n:'Acne Studios',ll:[59.3332,18.0738],cat:'時裝',note:'Norrmalmstorg 2 · 手信',o:4,opt:true}],
  notes:['🏛️ Stadshuset 導覽(45分),塔 5–9 月限定上 106m → 屋頂漫步替代(原 tour 停咗)。票飛 T-7 放,旺季當日 08:30 City Hall Shop 預先。','一日勿塞太多 → Nobel 同 Nationalmuseum 揀一個做重點,另一快閃。','⚠️ Moderna 7 月冇 Free Friday(最後場 6/12)——常設仍免費但唔好當有免費夜場。','🎵 Robyn 7/17 場(同 7/16 二揀一);Bio Rio indie(Reinsve 片)臨行 bio.se 查場次。'],
  bk:[{s:'todo',t:'🎟 Stadshuset Tower(飛 T-7)'}] },

{ id:'d0718', date:'7/18', dow:'六', leg:'sto', color:'#8a8580',
  title:'收尾 + 飛走', theme:'半日 → Arlanda → 22:40 飛 HK',
  accom:{name:'（22:40 飛走）', status:'paid'},
  meals:{b:'晨跑 Årstaviken / 慢早餐', l:'🍽 NK/Åhléns food court', d:'機上'},
  stops:[
    {n:'Årstaviken（晨跑·option）',ll:[59.3078,18.0348],cat:'晨跑步道',note:'7km 水濱',o:1,opt:true},
    {n:'Arlanda 機場',ll:[59.6468,17.9370],cat:'機場',note:'Arlanda Express 18分(另買·youth160) · ~18:00 到',o:2}],
  notes:['🧾 退稅:咖啡器材/Acne 收據留好,退稅貨品隨身唔好 check-in,機場 Global Blue 排隊預 buffer。','⏰ ~16:00 攞返行李 → ~19:00 離開市區坐 Arlanda Express(Central→ARN 18分,每15分,youth 160 SEK)→ ~19:30 到 → 退稅+check-in+安檢 → 22:40 MU290 起飛。','住 Älvsjö → 先 pendeltåg 去 Central 轉 Arlanda Express(或 pendeltåg 直去 Arlanda C 但有過站費 ~130)。護照回程後 ≥6 個月有效。'],
  bk:[{s:'paid',t:'✈️ China Eastern 回程(PNR 喺 Apple Note)'},{s:'todo',t:'🚄 Arlanda Express(到埗買)'}] },
];

/* 交通 tab */
const TRANSPORT = [
  {seg:'HKG→PVG→ARN', mode:'✈️ China Eastern MU724+MU289', time:'6/27 09:45→20:10', tick:'PNR 喺 Apple Note', s:'paid'},
  {seg:'ARN→Kiruna', mode:'✈️ Norwegian D8 4063', time:'6/28 11:35→13:10', tick:'YQCIPT(Apple Note)', s:'paid'},
  {seg:'Kiruna→Abisko(起步)', mode:'🚆/🚌', time:'6/29', tick:'當地買·班次臨行查', s:'todo'},
  {seg:'Nikkaluokta→Kiruna', mode:'🚌 巴士', time:'7/5 16:55→18:30', tick:'青年票·落 Norrmalm', s:'paid'},
  {seg:'Kiruna→Luleå(Arctic Bath)', mode:'🚗 Sixt EX30', time:'7/6 取→7/8 還', tick:'#9943888260', s:'hold'},
  {seg:'LLA→GOT', mode:'✈️ SK2051', time:'7/8 09:55→11:35', tick:'未買(等 Sixt)', s:'todo'},
  {seg:'GOT 機場→市區', mode:'🚌 Flygbussarna', time:'7/8 ~35分', tick:'上車/app 買·≠Västtrafik', s:'todo'},
  {seg:'Göteborg↔Trollhättan', mode:'🚆 Västtåg', time:'7/10 ~38分', tick:'當場買', s:'todo'},
  {seg:'Göteborg→Älmhult', mode:'🚆 SJ(經 Lund)', time:'7/12 09:55→14:15', tick:'W9NULT2R', s:'paid'},
  {seg:'Älmhult→Stockholm', mode:'🚆 SJ X2000 #544', time:'7/13 17:09→20:38', tick:'WRAVLE37', s:'paid'},
  {seg:'Göteborg 市內', mode:'🚊 Västtrafik zon A', time:'7/8–12', tick:'app 買', s:'todo'},
  {seg:'Stockholm 市內', mode:'🚇 SL 7-day', time:'7/13–18', tick:'470 / 試290平票(≤20)·到埗 app 買', s:'todo'},
  {seg:'市區→ARN', mode:'🚄 Arlanda Express', time:'7/18 ~19:00', tick:'另買·youth 160 SEK', s:'todo'},
  {seg:'ARN→PVG→HKG', mode:'✈️ MU290+MU505', time:'7/18 22:40→7/19 19:05', tick:'PNR(Apple Note)', s:'paid'},
];

/* 緊急 tab — 號碼 curl/多源驗證;標 UNKNOWN 嘅臨行 confirm */
const EMERGENCY = [
  {cat:'🚨 全國緊急(警/火/救護/山難)', num:'112', note:'瑞典通用;山難講 Fjällräddning'},
  {cat:'🏥 非緊急醫療諮詢', num:'1177', note:'瑞典國內撥 · 1177.se'},
  {cat:'🇨🇳 中國駐瑞典大使館 領事保護(Stockholm 段)', num:'0046-763383654', note:'只接求助,按需回撥'},
  {cat:'🇨🇳 中國駐哥德堡總領館(7/8–12 用呢個)', num:'0046-709395290', note:'Göteborg 段領事保護'},
  {cat:'🇨🇳 外交部全球領保 12308', num:'+86-10-12308', note:'24h 中文求助'},
  {cat:'🚗 Sixt 客服/roadside', num:'0771 89 00 00', note:'roadside 實際號睇取車租約合同'},
  {cat:'🚗 全國拖車路援(備用)', num:'+46 771-912 912', note:'Assistancekåren'},
  {cat:'🧖 Arctic Bath / 各酒店直線', num:'(訂房 confirm 後抄低)', note:'check-in 抄 reception 號'},
  {cat:'💳 信用卡 lost-card', num:'(Mox 卡背 + 後備卡)', note:'申請後抄低,離線存'},
  {cat:'🛡️ 旅遊保險 24h hotline', num:'(保單上印)', note:'買保險後抄低 + 帶保單 PDF 離線'},
];
const EMERG_NOTE = '行前必做:112 + 兩個領事號 + 12308 存手機;保險 hotline/保單號/Mox 卡號 買完即抄(離線);各住宿直線 check-in 抄低。⚠️ HK 護照非 EU,EHIC 唔 cover → 全靠私人旅保,行山段確認保到。';

/* 清單 tab */
const CHECKLIST = [
  {grp:'🥾 行山段(6/29–7/5 · 最重要)', items:[
    '登山鞋(已 broken-in,唔好新鞋上山) + 羊毛襪 ×4','防水 shell(jacket+pants,山地多雨風)',
    '羊毛/merino 底層 ×2 + 中層 fleece/羽絨(早晚仍凍)','頭燈 + 後備電(午夜太陽全天光但山屋用)',
    '濾水器/淨水片 + 1L 水樽 ×2','⚠️ 氣罐落 Kiruna 當地買(唔上得飛機) + 爐具',
    '防蚊 DEET + 蚊帽 face net(Lapland 夏天蚊極多)','背囊 50–65L + 防水 cover + dry bag',
    '7 日乾糧(Kiruna ICA Kvantum 補,孭 2 日 buffer 沿途補) + 行動電源','急救包 + 水泡膠布 + 個人藥 + 太陽眼鏡 + SPF',
    'STF 會員卡 + 8 山屋 code(離線/紙本) + Kungsleden 紙本地圖'] },
  {grp:'📷 城市段(攝影)', items:[
    'Sony A7S III + 鏡 + 電池/SD + 清潔','三腳架(黃昏水濱/Gamla Stan 晨攝)',
    '轉插:瑞典 Type C/F 230V(HK Type G 要轉插;叉電器多數 100–240V 通用)','城市雨具(折傘+輕防水)',
    '學生證(Hasselblad/Konstmuseum 問免費) + 護照副本 + 保單 PDF(離線)'] },
  {grp:'👩 女友 / 個人', items:[
    'SPF(午夜太陽 UV 仍在)','衛生用品 HK 帶夠(行山段無得補)','個人護膚日用品自備'] },
  {grp:'🧾 文件 / 錢', items:[
    '護照(回程後 ≥6 個月有效)','國際駕照 + 實體信用卡(Sixt 取車按金必須)',
    'Mox 卡(俾錢/按金前申請好) + 後備卡','所有 booking code 離線存(Apple Note)','緊急號碼存手機'] },
];

/* 每日 hero 相（真實 Wikimedia Commons CC 授權，已 download 落 img/） */
const HERO = {
  d0627:'stockholm', d0628:'lapporten', d0629:'midnightsun', d0630:'kungsleden',
  d0701:'kungsleden', d0702:'kebnekaise', d0703:'kungsleden', d0704:'kebnekaise',
  d0705:'kungsleden', d0706:'midnightsun', d0707:'midnightsun', d0708:'haga',
  d0709:'volvo', d0710:'saab', d0711:'haga', d0712:'ikea', d0713:'ikea',
  d0714:'vasa', d0715:'fjaderholmarna', d0716:'avicii', d0717:'gamlastan', d0718:'stockholm',
};
const HERO_CAP = { d0706:'（圖：Lapland 午夜太陽·非 Arctic Bath 實景）', d0707:'（圖：Lapland 午夜太陽·非 Arctic Bath 實景）' };

/* 黃金時刻 / 午夜太陽（按 leg；天文概況，臨行可用 app 查實） */
const SUN = {
  north:{badge:'☀️ 午夜太陽', txt:'Abisko/Kiruna 6 月底–7 月中 太陽不落 → 24 小時都有光,「半夜」天空金紅最 magic。隨時影,唔使追日落。'},
  gbg:{badge:'🌅 黃金時刻', txt:'Göteborg 7 月:日出 ~04:20 · 日落 ~22:00。晨攝 ~04:30–06:00,黃昏金光 ~20:30–22:00,藍調到午夜。'},
  alm:{badge:'🌅 黃金時刻', txt:'Älmhult 7 月:日落 ~22:00。'},
  sto:{badge:'🌅 黃金時刻', txt:'Stockholm 7 月:日出 ~03:40 · 日落 ~22:00。Gamla Stan 晨攝 ~04:00 人最少;Mosebacke/Monteliusvägen 黃昏 ~20:30–22:00 金光;藍調到深夜。'},
};

/* 圖片 attribution（CC 授權,footer 標） */
const IMG_CREDITS = [
  ['lapporten','Lapporten — MPotter-Adams · CC BY-SA 4.0'],['kungsleden','Kungsleden — Alexandre Buisse · CC BY-SA 4.0'],
  ['kebnekaise','Kebnekaise — Carl Månsson · CC BY 2.0'],['midnightsun','午夜太陽 — Jojoo64 · CC BY-SA 4.0'],
  ['volvo','World of Volvo — AleWi · CC BY-SA 4.0'],['saab','Saab Museum — Mangan02 · CC BY-SA 4.0'],
  ['ikea','IKEA Museum — Kigsz · CC BY-SA 4.0'],['vasa','Vasa — Jules Verne Times Two · CC BY-SA 4.0'],
  ['gamlastan','Gamla Stan — Julian Herzog · CC BY 4.0'],['fjaderholmarna','Fjäderholmarna — Olaf Meister · CC BY-SA 4.0'],
  ['fotografiska','Fotografiska — Giuseppe Milo · CC BY 2.0'],['avicii','Avicii Arena — kallerna · CC BY-SA 3.0'],
  ['skansen','Skansen — Øyvind Holmstad · CC BY-SA 4.0'],['stockholm','Stockholm — Anders Pettersson · CC BY 2.0'],
  ['haga','Haga — Gumisza · CC BY-SA 3.0'],['trollhattan','Trollhättan — Øyvind Holmstad · CC BY-SA 3.0'],
];

/* 小抄（實用 Kit） */
const CHEAT = [
  {h:'💳 俾錢', items:['瑞典近乎全面 cashless,拍卡/Apple Pay 通行;好多店唔收現金。','北段偏遠山屋帶少少 SEK emergency buffer(card reader 可能失靈)。']},
  {h:'🎫 車票', items:['Stockholm = SL 7-day(470/試290平票≤20歲);Göteborg = Västtrafik zon A——兩個唔通用!','Arlanda Express(youth 160)≠ Flygbussarna ≠ SL,分開買。']},
  {h:'🧾 退稅', items:['非歐盟旅客單店滿額退稅(Global Blue);收據留好,退稅貨隨身唔好 check-in。','機場出發層 Global Blue 櫃位辦,預 buffer 排隊。']},
  {h:'🍮 文化', items:['免小費(價已含服務,湊整數即可)。','Fika = 停低慢活咖啡+肉桂卷,瑞典精神。','樽罐有 Pant 押金,超市回收機退券。','Systembolaget = 國營酒舖(>3.5% 酒),週日休、要 passport。']},
  {h:'🗣 瑞典語', items:['Hej(嗨)/Tack(唔該/多謝)/Hejdå(拜拜)','Fika(咖啡時光)/Lagom(剛剛好)/En kaffe tack(一杯咖啡唔該)']},
];

window.SWEDEN = { TRIP, BK, LEGS, DAYS, TRANSPORT, EMERGENCY, EMERG_NOTE, CHECKLIST, HERO, HERO_CAP, SUN, IMG_CREDITS, CHEAT };
