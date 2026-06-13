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
  { key:'hike',   name:'🏔 行山 · Kungsleden', accent:'#6b8a9e', days:['d0627','d0628','d0629','d0630','d0701','d0702','d0703','d0704','d0705'] },
  { key:'arctic', name:'🧖 Arctic Bath',       accent:'#5fd0e0', days:['d0706','d0707'] },
  { key:'gbg',    name:'🚋 哥德堡',             accent:'#e8956a', days:['d0708','d0709','d0710','d0711'] },
  { key:'ikea',   name:'🛋 IKEA · Älmhult',    accent:'#5b9bd5', days:['d0712','d0713'] },
  { key:'sto',    name:'🏙 斯德哥爾摩',          accent:'#a78bda', days:['d0714','d0715','d0716','d0717','d0718'] },
];

/* 每日: id,date,dow,leg,color,title,theme, accom{name,status},
   meals{b,l,d}, stops[{n,ll,cat,note,o,opt}], notes[], bk[{s,t}], events[] */
const DAYS = [
//──────────────────── 北段 ────────────────────
{ id:'d0627', date:'6/27', dow:'六', leg:'hike', color:'#6b8a9e',
  title:'抵瑞典', theme:'HK → Arlanda 過夜',
  accom:{name:'Comfort Hotel Arlanda（機場過夜）', status:'paid'},
  meals:{b:'機上', l:'機上', d:'機場 / 酒店'},
  steps:[{t:'07:00',a:'到香港機場 check-in;寄喼叫地勤確認行李牌印 ARN(直掛 Stockholm)'},{t:'09:45',a:'MU724 起飛去上海'},{t:'12:25',a:'到上海 PVG — 唔使攞行李/唔使入境/唔使簽證:過一次轉機安檢去下一班 gate'},{t:'14:50',a:'MU289 起飛去 Stockholm'},{t:'20:10',a:'到 ARN → Comfort Hotel Arlanda(機場內)過夜,買定水/早餐'}],
  stops:[{n:'Comfort Hotel Arlanda',ll:[59.6468,17.9370],cat:'機場酒店',note:'落機過一晚,翌日飛 Kiruna',o:1}],
  notes:['✈️ PVG 轉機 2h25(14:50 起飛)——同一張飛同一間東航,行李直掛去 Stockholm,唔使喺上海攞喼/唔使入境/唔使中國簽證:落機→過轉機安檢→去 gate。','✅ HKG check-in 寄喼時叫地勤 confirm 行李牌印「ARN」(回程印「HKG」)=唯一保險,10 秒事。','落 ARN 21:00 後到 Comfort Hotel Arlanda,買定水/早餐。'],
  bk:[{s:'paid',t:'✈️ China Eastern 來回(PNR 喺 Apple Note)'},{s:'paid',t:'🏨 Comfort Hotel Arlanda'}] },

{ id:'d0628', date:'6/28', dow:'日', leg:'hike', color:'#6b8a9e',
  title:'飛 Kiruna · 買糧+氣罐', theme:'極圈補給日',
  accom:{name:'STF Kiruna', status:'paid'},
  meals:{b:'酒店', l:'機上 / Kiruna', d:'Kiruna'},
  steps:[{t:'08:30',a:'退房 → 去 ARN 國內 gate(Norwegian)'},{t:'11:35',a:'D8 4063 起飛去 Kiruna'},{t:'13:10',a:'到 Kiruna → 叫的士去 STF(400 SEK/車·+46 980-120 20)'},{t:'14:30',a:'ICA Kvantum 買 7 日乾糧 + Jaktia 買氣罐(唔上得飛機要當地買)'},{t:'18:00',a:'執行山裝備、城市行李寄存 STF reception、早瞓'}],
  stops:[
    {n:'Kiruna（極圈城）',ll:[67.8496,20.3063],cat:'城/補給',note:'ARN→Kiruna 11:35–13:10(Norwegian D8 4063)',o:1},
    {n:'ICA Kvantum Kiruna',ll:[67.8485,20.2538],cat:'超市·買糧',note:'Österleden 2 · 每日 07–22 · 行山乾糧/凍乾餐一站買齊 · 黃昏買最順',o:2},
    {n:'Jaktia Kiruna（氣罐）',ll:[67.8444,20.2537],cat:'戶外舖·氣罐',note:'Österleden 12 · 一–五10–18/六10–15 · 買 2×230g 螺紋 gasol · ⚠️氣罐唔上得飛機!',o:3}],
  notes:['🚖 落機去 STF（兩大喼）:的士固定 400 SEK/車(1-4人)·電話 +46 980-120 20(STF reception 推薦);平版 = 機場巴士 110/人 落「Ok/Parken」站行 10 分鐘。','🔥 落 Kiruna 即買 7 日糧(ICA Kvantum)+ 氣罐(Jaktia/Intersport,螺紋EN417)。','⚠️ 氣罐飛機唔可帶 → 一定當地買;趕唔切市區 → 6/29 Abisko Fjällboden 買(會 sell out,email abisko.butik@stfturist.se 預留)。','沿途山屋有得補:Abiskojaure/Alesjaure/Sälka 都有 shop 賣 gasol → 唔使孭7日量,孭2日 buffer。'],
  bk:[{s:'paid',t:'✈️ Norwegian ARN→Kiruna'},{s:'paid',t:'🛏 STF Kiruna'},{s:'todo',t:'🛒 行山糧+氣罐(當地買)'}] },

{ id:'d0629', date:'6/29', dow:'一', leg:'hike', color:'#6b8a9e',
  title:'Abisko 安頓 + 午夜太陽', theme:'輕鬆熱身日(唔行正路)',
  accom:{name:'STF Abisko Turiststation（有餐廳/shop Fjällboden）', status:'paid'},
  meals:{b:'山屋', l:'山屋 Restaurang Kungsleden', d:'山屋'},
  stops:[
    {n:'STF Abisko Turiststation',ll:[68.3574,18.7825],cat:'山屋·起點',note:'Fjällboden shop 有 gas/凍乾餐;可寄行李去 Nikkaluokta',o:1},
    {n:'Aurora Sky Station（吊椅）',ll:[68.3530,18.7300],cat:'吊椅·觀景',note:'午夜太陽班 6/14–7/19 20:00–01:30 → 6/29 行得 · 頂俯瞰 Torneträsk + Lapporten',o:2}],
  notes:['🌞 午夜太陽(Abisko ~5/25–7月中,24 小時日照)——6/29 上 Nuolja 頂影 midnight sun + Lapporten U 形谷。','山頂風大保暖;吊椅班次臨行 confirm。','喺 Fjällboden 安排寄行李去 Nikkaluokta(出山輕身)。'],
  bk:[{s:'paid',t:'🛏 STF Abisko'},{s:'todo',t:'🎟 Aurora Sky Station 吊椅(現場)'}] },

{ id:'d0630', date:'6/30', dow:'二', leg:'hike', color:'#6b8a9e',
  title:'Abisko → Abiskojaure', theme:'15km · +100m · 4–5h（最易·熱身）',
  accom:{name:'STF Abiskojaure（桑拿 + shop）', status:'paid'},
  meals:{b:'山屋', l:'行山乾糧', d:'山屋自煮（共用煤氣爐）'},
  stops:[{n:'STF Abiskojaure',ll:[68.2960,18.6900],cat:'山屋(約位)',note:'沿 Abiskojokk 河 · 穿 Abisko 國家公園 · 有桑拿+補給賣',o:1}],
  notes:['全程最易一日,當熱身。','河水清可直飲;低地蚊多 → 戴頭網。','過河有橋,唔使涉水。'],
  bk:[{s:'paid',t:'🛏 STF Abiskojaure'}] },

{ id:'d0701', date:'7/1', dow:'三', leg:'hike', color:'#6b8a9e',
  title:'Abiskojaure → Alesjaure', theme:'21km · +300m · 6–7h',
  accom:{name:'STF Alesjaure（柴火桑拿 + shop）', status:'paid'},
  meals:{b:'山屋', l:'行山乾糧', d:'山屋自煮'},
  stops:[{n:'STF Alesjaure',ll:[68.1710,18.4820],cat:'山屋(約位)',note:'全程最大山屋之一 · 湖景 · 柴火桑拿 · 有 shop 補給',o:1}],
  notes:['開揚 fell 地貌,「Lapland 最美一面」野河廣谷。','21km 較長,早出發;下午到歎桑拿。','部分行程暑期有船過湖可省路(臨行查船期)。'],
  bk:[{s:'paid',t:'🛏 STF Alesjaure'}] },

{ id:'d0702', date:'7/2', dow:'四', leg:'hike', color:'#6b8a9e',
  title:'Alesjaure → Sälka（過 Tjäktja 山口）', theme:'⚠️ ~25km · 全程最高 1140m · 8–9h（炸彈日）',
  accom:{name:'STF Sälka（桑拿 + shop）', status:'paid'},
  meals:{b:'山屋', l:'行山乾糧（補夠水）', d:'山屋自煮'},
  stops:[
    {n:'Tjäktja Pass 1140m（全程最高）',ll:[68.0500,18.4900],cat:'山口·最高點',note:'兩邊兩種地貌 · 冰川背景 · 過後落谷碎石濕滑',o:1},
    {n:'STF Sälka',ll:[67.9670,18.5030],cat:'山屋(約位)',note:'有桑拿 + shop',o:2}],
  notes:['🔴 全程最辛苦一日!STF 官方拆做兩日,你哋夾一日 ~25km 過最高山口 → 攝影 pace 隨時 10–11 鐘。','務必最早出發(理想 7–8am)。山口天氣變化大、7 月都可能風雪、能見度低 → 慢行、帶行山杖。','高原溪流稀疏,過山口前後補夠水。','💡 可考慮喺 Tjäktja 加一晚拆兩日(要 rebook STF)——同 Yin confirm。'],
  bk:[{s:'paid',t:'🛏 STF Sälka'}] },

{ id:'d0703', date:'7/3', dow:'五', leg:'hike', color:'#6b8a9e',
  title:'Sälka → Singi', theme:'12km · −100m · 3–4h（最短·歎）',
  accom:{name:'STF Singi（❌ 冇 shop）', status:'paid'},
  meals:{b:'山屋', l:'行山乾糧', d:'山屋自煮（糧要 Sälka 買定）'},
  stops:[{n:'STF Singi',ll:[67.9160,18.5000],cat:'山屋·岔路口(約位)',note:'⚠️冇 shop · Kungsleden 喺度分叉(南落 Vakkotavare / 東去 Kebnekaise)',o:1}],
  notes:['穿宏偉 U 形 Tjäktjavagge 冰蝕谷,平坦易行,可慢慢影。','過 Gaskkasjohka 河吊橋;有馴鹿圍欄標 Sami 邊界。','⚠️ Singi 冇補給 → 7/2 Sälka 買定 7/3 全日糧。岔路口睇路標東行 Kebnekaise,唔好行錯。'],
  bk:[{s:'paid',t:'🛏 STF Singi'}] },

{ id:'d0704', date:'7/4', dow:'六', leg:'hike', color:'#6b8a9e',
  title:'Singi → Kebnekaise（經 Kaffedalen）', theme:'14km · ±150m · 4–5h',
  accom:{name:'STF Kebnekaise Fjällstation（淋浴/桑拿/餐廳）', status:'paid'},
  meals:{b:'山屋', l:'行山乾糧 / 打包', d:'🍽 Elsas kök 餐廳 buffet（全程最舒適一晚）'},
  stops:[{n:'STF Kebnekaise Fjällstation',ll:[67.8680,18.6195],cat:'山站·補給點',note:'瑞典最高峰山腳 · 有淋浴/桑拿/正式晚餐餐廳',o:1}],
  notes:['轉東入 Ladtjovagge 谷,經 Kaffedalen「咖啡谷」;瑞典最高峰 Kebnekaise(2097m)逐漸現身。','到站洗澡 + 食好餐回氣,為明日 19km 出山養神。','登頂 Kebnekaise 係另一日 round-trip(行程冇排,唔好臨時加)。','💡 喺呢度有訊號 → 訂定 7/5 16:55 巴士飛(山中冇訊號)。'],
  bk:[{s:'paid',t:'🛏 STF Kebnekaise'}] },

{ id:'d0705', date:'7/5', dow:'日', leg:'hike', color:'#6b8a9e',
  title:'出山 → Nikkaluokta → 巴士 → Kiruna', theme:'19km(可搭船省6km) → 巴士 16:55',
  accom:{name:'STF Kiruna', status:'paid'},
  meals:{b:'山屋', l:'🦌 Nikkaluokta「Lap Dånalds」馴鹿漢堡', d:'Kiruna'},
  steps:[{t:'08:00',a:'最遲出發落山(19km / 或行去湖邊搭 14:00 前 Enoks 船省 6km)'},{t:'14:00',a:'若搭船:Láddjujávri 碼頭上船(500 SEK/人·現金/卡/Swish)'},{t:'15:30',a:'到 Nikkaluokta — Sami 帳篷咖啡 + 馴鹿漢堡'},{t:'16:55',a:'尾班巴士 Nikkaluokta → Kiruna(青年票已買·15:55 網訂截)'},{t:'18:30',a:'到 Kiruna → STF 過夜,攞返寄存行李'}],
  stops:[
    {n:'Nikkaluokta（出山口·巴士站）',ll:[67.8514,19.0154],cat:'村·巴士總站',note:'下船碼頭有 Sami 帳篷咖啡 Kaffekåta + 馴鹿漢堡',o:1},
    {n:'Kiruna',ll:[67.8496,20.3063],cat:'城',note:'巴士 18:30 到 · 落 Norrmalm 站最近 STF',o:2}],
  notes:['🚍 巴士 16:55→18:30(青年票已買)。⚠️ 網訂 15:55 截 → 喺 Kebnekaise(有訊號)訂定;現場上車 +200/人罰貴。','⛴ 湖渡船(慳 6km 腳骨力)詳情:行 Kebnekaise→Nikkaluokta 條 trail 落到 Láddjujávri 湖邊碼頭(trail 有指示牌)上船,船 = Enoks(Nikkaluokta 嗰間)。**500 SEK/人單程·現金/卡/Swish 都收·少過 10 人唔使預約**。⏰ 要趕 16:55 巴士 = **搭 14:00 或之前嗰班**(15:00 班會送車尾)。最穩做法:7/4 晚喺 Kebnekaise Fjällstation 櫃台 confirm 翌日船期(佢哋有貼當日 timetable)。','全走 19km(5.5–6.5h)→ 最遲 8:30am 出發;搭船(~13km 行)可遲啲出發但唔好賭班次。','蚊極多(防蚊+頭網照叮);錯過尾班 = 瞓 Nikkaluokta。'],
  bk:[{s:'paid',t:'🚌 Nikkaluokta→Kiruna 巴士'},{s:'paid',t:'🛏 STF Kiruna'}] },

{ id:'d0706', date:'7/6', dow:'一', leg:'arctic', color:'#5fd0e0',
  title:'火車落 Luleå 取車 → Arctic Bath', theme:'Plan B 定案：LLA 來回租車',
  accom:{name:'Arctic Bath（2 晚 · Harads）', status:'paid'},
  meals:{b:'Kiruna（早餐食飽佢）', l:'火車上（Kiruna 買定）', d:'🍽 Arctic Culinary Dinner（已 book·~20:00）'},
  steps:[{t:'11:00',a:'Kiruna 食飽 + 買車上乾糧;叫 STF reception book 的士 12:10 去火車站'},{t:'12:50',a:'SJ 7153 火車 Kiruna → Luleå(WHRPPGC9·SJ app)'},{t:'17:12',a:'到 Luleå C → 巴士 104 去機場'},{t:'18:00',a:'LLA 取租車(帶護照+HK牌+IDP+實體信用卡)'},{t:'18:30',a:'揸 85km/~1h15 去 Arctic Bath'},{t:'20:00',a:'到 Arctic Bath check-in,夜晚浸冷池'}],
  stops:[
    {n:'Kiruna Station（12:50 火車 7153）',ll:[67.8557,20.2251],cat:'🚆 火車',note:'12:50 開 → Boden 16:31 → Luleå Central ~17:12(4h22)·上車前買定午餐',o:1},
    {n:'Luleå Airport（取車）',ll:[65.5431,22.1219],cat:'🚗 取車',note:'Luleå C 轉巴士 104(~20分,33 SEK)去機場 → ~18:00 SIXT 取車(櫃位開到 21:00)·帶國際駕照+實體信用卡按金',o:2},
    {n:'Arctic Bath',ll:[66.0887,20.9370],cat:'🧖 漂浮 spa 酒店',note:'機場揸 85km/~1h15 → ~19:30-20:00 到 · 浮喺 Lule 河上',o:3}],
  notes:['🚗 LLA 取車帶齊:護照+香港駕照+國際駕照(IDP)+司機名下實體信用卡(按金)+Trip.com「取車所需文件」照單執齊。司機得 Yin 一個。','EV 嘅話 Arctic Bath 場內有充電(Vattenfall InCharge 站 RJ1048),過夜叉滿。'],
  bk:[{s:'paid',t:'🚗 租車 EX30(Trip.com 已確認·7/8 07:30 還)'},{s:'paid',t:'🧖 Arctic Bath(已訂!)'},{s:'paid',t:'🚆 SJ 7153 火車票(SJ app)'}] },

{ id:'d0707', date:'7/7', dow:'二', leg:'arctic', color:'#5fd0e0',
  title:'🎂 Yin 21 歲 · Arctic Bath spa', theme:'純享受日',
  accom:{name:'Arctic Bath', status:'paid'},
  meals:{b:'Arctic Bath', l:'Arctic Bath', d:'🎂 Arctic Culinary 生日晚餐（已 email 安排·行前覆核）'},
  stops:[{n:'Arctic Bath',ll:[66.0887,20.9370],cat:'🧖 spa',note:'冷池 + sauna + 浮 cabin · 全日 relax',o:1}],
  notes:['🎂 Yin 21 歲生日!提早同 Arctic Bath 講有冇生日 surprise / 訂枱。','純 relax,養返行山攰。'],
  bk:[{s:'hold',t:'🧖 Arctic Bath spa'}] },

{ id:'d0708', date:'7/8', dow:'三', leg:'gbg', color:'#e8956a',
  title:'還車 → 飛 GOT → Göteborg 到埗', theme:'⚠️ 超趕 + 轉戰南方',
  accom:{name:'Airbnb Majorna「Cozy apartment」(host Marcus)', status:'paid'},
  meals:{b:'Arctic Bath', l:'機上 / 到埗', d:'🍽 Magasinsgatan 一帶'},
  steps:[{t:'05:30',a:'起身執好行李'},{t:'06:00',a:'攞 breakfast bag → 揸車去 LLA(車程 1h15)'},{t:'08:00',a:'到 LLA P2 還車(影低車況/電量)→ 行 2 分鐘入 terminal'},{t:'09:10',a:'bag drop 截 — 之前到就 OK'},{t:'09:55',a:'SK2051 起飛去 Göteborg(ZCY8VV)'},{t:'11:35',a:'到 GOT → Flygbussarna 入市 → 電車去 Majorna check-in'}],
  stops:[
    {n:'Luleå 機場（還車）',ll:[65.5431,22.1219],cat:'還車+機場',note:'Harads→Luleå ~1h15 · 5:30 起身 → 6:00 攞 breakfast bag 出發 → ~8:00 到 LLA 還車 → bag drop 09:10 前(鬆容)→ 09:55 SK2051 飛 GOT。Trip.com 還車寫 07:30 唔使改:寧早莫遲——還車遲少少佢等你,夾飛機先係硬死線',o:1},
    {n:'Haga Nygata（Göteborg）',ll:[57.6987,11.9552],cat:'老區散步',note:'落機後 Flygbussarna ~35分入市 → check-in → Haga',o:2},
    {n:'Café Husaren',ll:[57.6984,11.9597],cat:'Café',note:'巨型肉桂卷 Hagabullen(vegan)',o:3},
    {n:'da Matteo',ll:[57.7032,11.9624],cat:'咖啡',note:'2025 北歐最佳烘焙 · Magasinsgatan 17A',o:4}],
  notes:['✅ SK2051 已買(Agoda·CityJet):7/8 直航 09:55→11:35。早機!5:30 起身 → 6:00 攞 breakfast bag 出發 → ~8:00 到 LLA(冇晨早 spa)。','11:35 落 GOT → Flygbussarna 入市 → check-in → 下午 Haga + Café Husaren 大肉桂卷 + da Matteo 照原計劃行!','🟢 還車:Trip.com 07:30 唔使改——你 ~8:00 到係比合約遲少少,但還車遲佢等你冇後果;硬死線係 bag drop 09:10,定早保飛機最穩。','還車前影低車況 + 電量(EV 場內叉滿先走);LLA 還車喺 P2(24h)行 2 分鐘入 terminal;breakfast bag 06:00 已同酒店安排。'],
  bk:[{s:'paid',t:'✈️ SK2051 已買(Agoda)'},{s:'paid',t:'🏠 GBG Airbnb Majorna(8–12 Jul 已訂)'}] },

//──────────────────── Göteborg ────────────────────
{ id:'d0709', date:'7/9', dow:'四', leg:'gbg', color:'#e8956a',
  title:'World of Volvo + Hasselblad', theme:'車 + 攝影（兩個地方·搭 tram）',
  accom:{name:'Airbnb Majorna（Cozy apartment）', status:'paid'},
  meals:{b:'Majorna 自煮 / café', l:'🍽 Ceno Brasserie（場內）', d:'🍽 Mr P / Familjen（Götaplatsen）'},
  stops:[
    {n:'World of Volvo',ll:[57.6895,11.9978],cat:'體驗館',note:'Lyckholms Torg 1 · 10:00 開 · 網購全日票慳10%(唔使搶時段) · 成人 220-250(學生≤25 帶證 165-190,慳錢) · tram 2/4 Liseberg Södra',o:1},
    {n:'Hasselblad Center',ll:[57.6966,11.9807],cat:'攝影館',note:'@Konstmuseum Götaplatsen 6(離 Volvo ~3km,搭 tram) · 75 SEK · <20 免 · 逢一閉',o:2},
    {n:'Mr P',ll:[57.6975,11.9790],cat:'餐廳(食)',note:'Götaplatsen · 分享菜+cocktail · Hasselblad 出門口左手',o:3,opt:true}],
  notes:['World of Volvo 同 Hasselblad 係兩個唔同地方相隔 ~3km,中間搭 tram。','Volvo 訂時段慳10%(Comet 訂,俾錢前停)。Konstmuseum 逢一閉(今日四 OK);20 歲要俾 75,帶學生證問免費。','食:場內 Ceno(唔使走) 或 Götaplatsen 嗰邊 Mr P/Familjen(夾 Hasselblad)。'],
  bk:[{s:'todo',t:'🎟 World of Volvo 時段(Comet 訂)'}] },

{ id:'d0710', date:'7/10', dow:'五', leg:'gbg', color:'#e8956a',
  title:'Saab Car Museum @ Trollhättan', theme:'火車 day-trip（換走 Vrångö）',
  accom:{name:'Airbnb Majorna（Cozy apartment）', status:'paid'},
  meals:{b:'Majorna 自煮', l:'Trollhättan café', d:'🍽 Göteborg 市區'},
  stops:[
    {n:'Saab Car Museum「The Box」',ll:[58.2722,12.2765],cat:'汽車博物館',note:'⚠️ 2026 夏(6/6–9/30)因屋頂翻新搬咗去【Nova Arena】以「The Box」形式開放——唔好去 Innovatum 舊館!去前打 +46-520-289440 問清 Nova Arena 位置+當日時間',o:1},
    {n:'Innovatum Science Center',ll:[58.2720,12.2768],cat:'科學館',note:'Saab 隔離 2 分鐘 · 6/21–8/17 開 · 落雨都室內 OK',o:2},
    {n:'Slussområdet 運河船閘 + 峽谷',ll:[58.2837,12.2909],cat:'步行區(免費)',note:'1700s 古船閘 + 花崗岩峽谷,即使冇放水都上鏡',o:3}],
  notes:['🚆 Göteborg C → Trollhättan ~34–38 分(Västtåg,~每30分一班),當場買。','🚗 Saab Car Museum 喺【Nova Arena「The Box」】(Nohabgatan 35·6/6–9/30 夏季展)·唔係 Innovatum 舊館;打 +46-520-289440 confirm 7/10 時間。','⚠️ 瀑布放水 2026 夏天冇(Vattenfall 只 7/17–19 festival,你之前一星期)→ 改睇 The Box+Innovatum 科學館+古船閘峽谷。'],
  bk:[{s:'todo',t:'🚆 Göteborg↔Trollhättan 火車(當場)'},{s:'todo',t:'🎟 Saab Car Museum 入場'}] },

{ id:'d0711', date:'7/11', dow:'六', leg:'gbg', color:'#e8956a',
  title:'滑翔傘 @ Kareby + Slottsskogen', theme:'天氣 backup 日（老實講半日吊住）',
  accom:{name:'Airbnb Majorna（Cozy apartment）', status:'paid'},
  meals:{b:'Majorna 自煮', l:'市區', d:'市區'},
  stops:[
    {n:'Äventyrscenter 滑翔傘',ll:[57.9062,11.9319],cat:'活動(Kareby)',note:'Murhammarv.15 · 週末drop-in 12–15 · 900 SEK · 北27km taxi ~25min/400–550 SEK',o:1},
    {n:'Slottsskogen',ll:[57.6870,11.9419],cat:'公園(免費)',note:'15:00 返到夾得到 · 黃昏行公園+動物(海豹/企鵝)',o:2},
    {n:'Radiomuseet',ll:[57.7087,11.9453],cat:'電台博物館(你 saved)',note:'二–日12–15 · 古董電台 niche · optional',o:8,opt:true}],
  notes:['⚠️ 09:00 後打 070-66 77 210 confirm 天氣(風/雨即 cancel)+ 約 taxi。drop-in 限週末,7/11 六啱。','😤 老實講:滑翔傘係「半日吊住」——唔係飛得耐(空中 5–8 分),係等風+排隊唔可控,隨時拖到 15:00。所以同日唔好再排 must-do,Slottsskogen 黃昏散步當 bonus。','天氣差全日 backup:Universeum 科學館/水族館(室內) + Feskekörka 魚市場 + Haga café。'],
  bk:[{s:'todo',t:'🪂 滑翔傘(當日現場 900 SEK)'}] },

//──────────────────── Älmhult ────────────────────
{ id:'d0712', date:'7/12', dow:'日', leg:'ikea', color:'#5b9bd5',
  title:'火車 → Älmhult（IKEA 發源地）', theme:'IKEA Hotell 入住',
  accom:{name:'IKEA Hotell（Älmhult）', status:'paid'},
  meals:{b:'Majorna / Göteborg', l:'火車上 / Älmhult', d:'🍽 IKEA Hotell 餐廳'},
  steps:[{t:'08:45',a:'退房(影低單位)→ 去 Göteborg C'},{t:'09:55',a:'SJ 火車 → Älmhult(W9NULT2R·經 Lund)'},{t:'14:15',a:'到 Älmhult → IKEA Hotell check-in'},{t:'15:00',a:'IKEA Museum(每日10-18)+ 旗艦店'}],
  stops:[
    {n:'IKEA Hotell',ll:[56.5522,14.1323],cat:'住宿',note:'IKEAgatan 1 · 7/12 夜',o:1},
    {n:'IKEA 旗艦店 Älmhult',ll:[56.5500,14.1625],cat:'IKEA 店',note:'第一間 IKEA 嘅鎮',o:2}],
  notes:['🚆 Göteborg C 09:55 → Älmhult 14:15(SJ,經 Lund) → IKEA Hotell check-in。','下午:IKEA 旗艦店 / Älmhult 鎮散步(Möckeln 湖 15km 較遠無公交)。','🛝 Live! Älmhult Pippi 長襪皮皮 pop-up 6/25–7/18(免費打卡,順路)。'],
  bk:[{s:'paid',t:'🚆 SJ Göteborg→Älmhult'},{s:'paid',t:'🏨 IKEA Hotell'}] },

{ id:'d0713', date:'7/13', dow:'一', leg:'ikea', color:'#5b9bd5',
  title:'IKEA Museum 全日 → 夜車去 Stockholm', theme:'玩足 IKEA 先走',
  accom:{name:'Stockholm · Helenelund Airbnb（夜到）', status:'paid'},
  meals:{b:'IKEA Hotell', l:'🍽 IKEA Museum café', d:'火車上 / Helenelund 簡單煮'},
  steps:[{t:'10:00',a:'IKEA 補完 / Älmhult 散步'},{t:'17:09',a:'SJ X2000 → Stockholm(WRAVLE37)'},{t:'20:38',a:'到中央站 → 落 City 站轉 pendeltåg 41 北行'},{t:'21:15',a:'到 Helenelund → 行去 Airbnb(host Jerker 知你遲到)'}],
  stops:[
    {n:'IKEA Museum',ll:[56.5523,14.1344],cat:'博物館',note:'IKEAgatan 5 · 原祖 IKEA(1943)展覽 + Småland 積木 · 99–149 SEK · ⚠️7月hours confirm',o:1}],
  notes:['IKEA Museum 全日玩(展覽 + Småland 積木體驗 + café)。','🚆 17:09 火車 → Stockholm 20:38 → 行落 City 站轉 pendeltåg 41 北行(~15分一班) → ~16 分鐘到 Helenelund → 行去屋企,預 ~21:15-21:30 到。','📩 host Jerker 已知你哋遲到;有咩變化 Airbnb message 佢。'],
  bk:[{s:'paid',t:'🚆 SJ Älmhult→Stockholm'},{s:'paid',t:'🏠 Stockholm Airbnb(Helenelund·已訂)'}] },

//──────────────────── Stockholm ────────────────────
{ id:'d0714', date:'7/14', dow:'二', leg:'sto', color:'#a78bda',
  title:'Djurgården 博物館島 + Allsång', theme:'Vasa 早開 + 國民合唱夜',
  accom:{name:'Stockholm · Helenelund Airbnb', status:'paid'},
  meals:{b:'出發前', l:'🍽 Rosendals Trädgård 花園 café', d:'Skansen 內 / Djurgården'},
  stops:[
    {n:'Vasamuseet',ll:[59.3281,18.0914],cat:'沉船博物館',note:'08:30 早開避團 · 240 SEK',o:1},
    {n:'Nordiska museet',ll:[59.3291,18.0939],cat:'🧶 紡織/文化',note:'紡織收藏(crochet) · 170',o:2},
    {n:'Skansen',ll:[59.3266,18.1053],cat:'露天博物館',note:'歷史村 + 北歐動物;Solliden 台 = Allsång 場',o:3},
    {n:'ABBA The Museum',ll:[59.3249,18.0966],cat:'博物館(你 saved)',note:'同 Skansen 二揀一',o:4,opt:true}],
  notes:['🎲 彈性日:定咗 = Vasa 08:30(早去先有位企)。Nordiska/Skansen/ABBA/Viking 全部跟心情——ABBA 用 code「AVICII」9 折。Allsång 6 月尾 confirm 先算。','Vasa 08:30 一開就去(人最少最好影)。Skansen / ABBA 二揀一。','🎤 晚 Allsång på Skansen(傳統週二場,Solliden 台)——⚠️ 2026 場次表未驗證到(官方頁 404),6 月尾上 skansen.se/SVT 確認 7/14 真有場先好計入行程/買飛。','SL 7-day 票到埗 app 買:成人 470 SEK。⚠️ reduced 290 淨係 7-19 歲或瑞典學生證(Mecenat)——你哋 7/13 時 Yin 已 21、Kam Ling 20,HK 學生證唔 work → 大機會兩個都俾 470。'],
  bk:[{s:'pend',t:'🎫 SL 7-day 票(成人 470,到埗買)'},{s:'todo',t:'🎤 Allsång på Skansen(option·早買)'}] },

{ id:'d0715', date:'7/15', dow:'三', leg:'sto', color:'#a78bda',
  title:'RIB 出海 + 咖啡器材 + Fotografiska', theme:'水上日（週三 BOGO 夜）',
  accom:{name:'Stockholm · Helenelund Airbnb', status:'paid'},
  meals:{b:'出發前', l:'Strandvägen 區輕食', d:'🍽 Fotografiska 餐廳（黃昏景觀·訂位）'},
  stops:[
    {n:'Fjäderholmarna 群島',ll:[59.3284,18.1751],cat:'群島(你 wish)',note:'Strömma 渡輪 Strandvägen 30 分船到 · craft village + 海鮮午餐 + 游水石灘 · ⚠️查實尾班船',o:1},
    {n:'RIB Stockholm 碼頭',ll:[59.3318,18.0842],cat:'RIB 快艇',note:'Strandvägen Kajplats 19 · 1490/人 · 2h · 42節 · 提供保暖連身衣 · 12 歲+',o:2},
    {n:'Drop Coffee',ll:[59.3169,18.0627],cat:'☕ 咖啡器材(你 saved)',note:'Wollmar Yxkullsgatan 10 · 賣豆+器材',o:3},
    {n:'Johan & Nyström',ll:[59.3164,18.0639],cat:'☕ 器材最齊',note:'Swedenborgsgatan 7 概念店',o:3},
    {n:'Fotografiska',ll:[59.3180,18.0847],cat:'攝影博物館(你 saved)',note:'週三18:00後買一送一! · 開到23:00 · ~195-230 SEK(官網 confirm)',o:4}],
  notes:['🎲 半彈性:定咗 = 上午 Fjäderholmarna + 黃昏 RIB(book 咗先算)。其餘(Kungsträdgården fika/Saluhall)未定,跟心情。落雨成日同 7/16-17 對調。','🚤 下午 RIB 2h(Dock 19) · 船家提供救生衣+保暖連身衣,著平日衫入面 · ⚠️高速濺水 A7S III 要防水罩唔好換鏡。','黃昏返 SoFo 行咖啡器材(Drop + Johan & Nyström,GF priority)。','📷 Fotografiska 週三 18:00 後買一送一(慳一半!)開到 23:00,夜晚啱影相 + 景觀餐廳。','⚠️ 天氣敏感:RIB+Fjäderholmarna 要好天,落雨同 16/17 對調。查實渡輪尾班船。'],
  bk:[{s:'todo',t:'🎟 RIB Stockholm(fareharbor 訂時段)'}] },

{ id:'d0716', date:'7/16', dow:'四', leg:'sto', color:'#a78bda',
  title:'Avicii + 毛線 + 古著黑膠', theme:'crochet 日 + SoFo 日落夜',
  accom:{name:'Stockholm · Helenelund Airbnb', status:'paid'},
  meals:{b:'🍽 Vete-Katten（百年 konditori）', l:'🍽 Kajsas Fisk（Hötorget 魚湯)', d:'🍽 Pelikan / Meatballs for the People'},
  stops:[
    {n:'Avicii Experience',ll:[59.3331,18.0642],cat:'體驗館(你 saved)',note:'Sergelgatan 2 · ✅ 飛已買(YZCB51·10:00 頭場·1 成人+1 學生)· 帶學生證',o:1},
    {n:'Svensk Hemslöjd',ll:[59.3353,18.0712],cat:'🧶 官方手工藝(你 saved)',note:'Norrlandsgatan 20 · 行 5 分鐘 · 瑞典羊毛',o:2},
    {n:'Litet Nystan',ll:[59.3152,18.0823],cat:'🧶 毛線(你 saved)',note:'Folkungagatan 100 · Gotland 羊毛 · 趁一–五 18:00 前',o:3},
    {n:'Pet Sounds Records',ll:[59.3121,18.0780],cat:'二手黑膠',note:'Skånegatan 53',o:4,opt:true},
    {n:'Mosebacke/Monteliusvägen',ll:[59.3186,18.0703],cat:'日落觀景',note:'SoFo 晚餐後行過去睇日落(夏季 ~22:00 先落)',o:9,opt:true}],
  notes:['🎲 半彈性:定咗 = Avicii 10:00(飛已買)。之後成個下晝(Hemslöjd/Kajsas/Söder 咖啡毛線黑膠/晚餐/日落)全部係建議路線,唔使跟足。','🕯️ Avicii 10:00 頭場(提早訂時段)→ 行 5 分鐘 Svensk Hemslöjd(🧶)。','⚠️ 暑假細店多 semesterstängt → Svensk Hemslöjd/Litet Nystan 趁一–五營業 + 18:00 前。','🎵 更正:Robyn Stockholm 場係 10/17 @ 3Arena(trip 之後)——之前「7/16-17 Avicii Arena」係錯,已剔除;行程期間 live/電音替代查緊。'],
  bk:[{s:'paid',t:'🎟 Avicii Experience(已買·YZCB51)'}] },

{ id:'d0717', date:'7/17', dow:'五', leg:'sto', color:'#a78bda',
  title:'市政廳 + Gamla Stan + 美術館', theme:'攝影/高處（鬆啲，揀一重點）',
  accom:{name:'Stockholm · Helenelund Airbnb', status:'paid'},
  meals:{b:'Gamla Stan café', l:'🍽 Chokladkoppen（Stortorget）', d:'🍽 Aifur 維京餐 / Nationalmuseum 餐廳'},
  stops:[
    {n:'Stadshuset（市政廳塔）',ll:[59.3275,18.0542],cat:'導覽+觀景',note:'導覽45分(夏季半鐘一團) · 塔5–9月開106m · 7月時段 09:00/09:50/10:40... · 票飛T-7放/當日08:30 City Hall Shop · 成人100 SEK',o:1},
    {n:'Gamla Stan Stortorget',ll:[59.3250,18.0708],cat:'舊城',note:'晨攝 + Nobel Prize Museum(Stortorget 2,你 saved)',o:2},
    {n:'Nationalmuseum',ll:[59.3285,18.0781],cat:'國家美術館(你 saved)',note:'免費常設 + 設計藏品 · 順路 Kungsträdgården',o:3},
    {n:'Acne Studios',ll:[59.3332,18.0738],cat:'時裝',note:'Norrmalmstorg 2 · 手信',o:4,opt:true}],
  notes:['🎲 彈性日:得 Stadshuset Tower(09:00 頭場·7/10 先有飛賣)係想搶嘅。Nobel/Nationalmuseum/Fotografiska/Aifur 全部未定——嗰朝起身先決定。','🏛️ Stadshuset 導覽(45分),塔 5–9 月限定上 106m → 屋頂漫步替代(原 tour 停咗)。票飛 T-7 放,旺季當日 08:30 City Hall Shop 預先。','一日勿塞太多 → Nobel 同 Nationalmuseum 揀一個做重點,另一快閃。','Moderna Museet 週五開 10-20·正價 170 SEK(冇免費場)→ 想去當付費館,或專心 Fotografiska。','🎬 Bio Rio 7 月場次已出:7/13 Tenet·7/14 Akira·7/16 Cowboy Bebop·7/18 Call Me by Your Name(冇 Sentimental Value→Apple TV SE 租 49 SEK)。'],
  bk:[{s:'todo',t:'🎟 Stadshuset Tower(飛 T-7)'}] },

{ id:'d0718', date:'7/18', dow:'六', leg:'sto', color:'#a78bda',
  title:'收尾 + 飛走', theme:'半日 → Arlanda → 22:40 飛 HK',
  accom:{name:'（22:40 飛走）', status:'paid'},
  meals:{b:'慢早餐(Helenelund)·想跑步就附近輕鬆 jog', l:'🍽 NK/Åhléns food court', d:'機上'},
  steps:[{t:'09:00',a:'慢早餐 / 想跑就附近 jog'},{t:'12:00',a:'最後 Gamla Stan 手信 + 退稅準備(收據+貨品隨身)'},{t:'19:00',a:'起行去機場(SL app 睇 pendeltåg 直去 Arlanda C 定入 City 轉 Arlanda Express)'},{t:'20:10',a:'到 ARN T5 → 退稅 + check-in + 安檢'},{t:'22:40',a:'MU290 起飛返香港'}],
  stops:[
    {n:'Årstaviken（如最後想跑·搬咗屋唔順路,改市內行）',ll:[59.3078,18.0348],cat:'晨跑步道',note:'原 Älvsjö 晨跑線;住 Helenelund 唔順路——想跑改 7/14-17 朝早 Djurgården(10-11km 經典)',o:1,opt:true},
    {n:'Arlanda 機場',ll:[59.6468,17.9370],cat:'機場',note:'Arlanda Express 18分(另買·youth160) · ~18:00 到',o:2}],
  notes:['📦 執嘢日:唯一硬死線 = ~19:00 起行去機場。朝早全部自由。','🧾 退稅:咖啡器材/Acne 收據留好,退稅貨品隨身唔好 check-in,機場 Global Blue 排隊預 buffer。','⏰ ~16:00 攞返行李 → ~19:00 離開市區坐 Arlanda Express(Central→ARN 18分,每15分,youth 160 SEK)→ ~19:30 到 → 退稅+check-in+安檢 → 22:40 MU290 起飛。','住 Helenelund(北邊·Arlanda 同方向):開 SL app 睇有冇 pendeltåg 直去 Arlanda C(~25分,落車有過站費 ~130/人);冇就照入 City 轉 Arlanda Express(youth 160)。護照回程後 ≥6 個月有效。'],
  bk:[{s:'paid',t:'✈️ China Eastern 回程(PNR 喺 Apple Note)'},{s:'todo',t:'🚄 Arlanda Express(到埗買)'}] },
];

/* 交通 tab */
const TRANSPORT = [
  {seg:'HKG→PVG→ARN', mode:'✈️ China Eastern MU724+MU289', time:'6/27 09:45→20:10', tick:'PNR 喺 Apple Note', s:'paid'},
  {seg:'ARN→Kiruna', mode:'✈️ Norwegian D8 4063', time:'6/28 11:35→13:10', tick:'YQCIPT(Apple Note)', s:'paid'},
  {seg:'Kiruna→Abisko(起步)', mode:'🚆/🚌', time:'6/29', tick:'當地買·班次臨行查', s:'todo'},
  {seg:'Nikkaluokta→Kiruna', mode:'🚌 巴士', time:'7/5 16:55→18:30', tick:'青年票·落 Norrmalm', s:'paid'},
  {seg:'Kiruna→Luleå→Arctic Bath', mode:'🚆 7153 + 🚗 EX30(Trip.com)', time:'7/6 12:50 火車→18:00 取車', tick:'✅ 火車+租車都訂咗(6/11)·7/8 07:30 還車', s:'paid'},
  {seg:'LLA→GOT', mode:'✈️ SK2051', time:'7/8 09:55→11:35', tick:'✅ 已買(Agoda·CityJet 營運)', s:'paid'},
  {seg:'GOT 機場→市區', mode:'🚌 Flygbussarna', time:'7/8 ~35分', tick:'上車/app 買·≠Västtrafik', s:'todo'},
  {seg:'Göteborg↔Trollhättan', mode:'🚆 Västtåg', time:'7/10 ~38分', tick:'當場買', s:'todo'},
  {seg:'Göteborg→Älmhult', mode:'🚆 SJ(經 Lund)', time:'7/12 09:55→14:15', tick:'W9NULT2R', s:'paid'},
  {seg:'Älmhult→Stockholm', mode:'🚆 SJ X2000 #544', time:'7/13 17:09→20:38', tick:'WRAVLE37', s:'paid'},
  {seg:'Göteborg 市內', mode:'🚊 Västtrafik zon A', time:'7/8–12', tick:'app 買', s:'todo'},
  {seg:'Stockholm 市內', mode:'🚇 SL 7-day', time:'7/13–18', tick:'成人 470(reduced 290 淨瑞典學生證/7-19歲,你哋唔合)·到埗 app 買', s:'todo'},
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
  {grp:'🛫 行前必做（數碼準備·最易漏）', items:[
    '📍 預載離線地圖:Gaia GPS / Maps.me 下載 Kungsleden(Abisko→Nikkaluokta)+ Göteborg + Stockholm 區——⚠️山上 6 日(6/30–7/5)冇訊號,app 互動地圖載唔到底圖,靠呢個 + 紙本 Kungsleden 地圖導航',
    '📸 截圖所有 booking 離線:8 個 STF 山屋 code · 兩段機票 confirmation · SJ 三程(app) · Trip.com 租車 voucher+取車文件 · Arctic Bath confirmation · 兩個 Airbnb · Zurich 保單 PDF(詳細喺你私人 Apple Note)',
    '✈️ SK2051 7/8 09:55→11:35 已驗證有班(6/10)→ SIXT 車 confirm 即刻買(HKD ~823–1,949/人,價會浮動)',
    '🛡️ 保險單 PDF 下載離線 + 記低 24h hotline + 保單號',
    '☎ 存手機:112 · 大使館 0046-763383654 · 哥德堡總領館(7/8-12)0046-709395290',
    '📱 eSIM/漫遊開通(瑞典覆蓋好,山區仍可能冇)·帶少量 SEK 現金(北段 card reader 可能失靈)',
  ]},
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
  d0627:'stockholm', d0628:'lapporten', d0629:'midnightsun', d0630:'abiskocanyon',
  d0701:'alesjaure', d0702:'salka', d0703:'singi', d0704:'kebnekaise',
  d0705:'nikkaluokta', d0706:'abiskojaure', d0707:'midnightsun', d0708:'haga',
  d0709:'volvo', d0710:'saab', d0711:'haga', d0712:'ikea', d0713:'ikea',
  d0714:'vasa', d0715:'fjaderholmarna', d0716:'avicii', d0717:'gamlastan', d0718:'stockholm',
};
const HERO_CAP = { d0629:'（圖：Nuoljatoppen 午夜太陽·你 6/29 吊椅上嗰個頂）', d0717:'（圖：Mårten Trotzigs gränd·Gamla Stan 最窄巷）',
  d0706:'（圖：Abiskojaure 午夜太陽·非 Arctic Bath 實景）', d0707:'（圖：Lapland 午夜太陽·非 Arctic Bath 實景·到場自己影）' };

/* 黃金時刻 / 午夜太陽（按 leg；天文概況，臨行可用 app 查實） */
const SUN = {
  hike:{badge:'☀️ 午夜太陽', txt:'Abisko/Kiruna 6 月底–7 月中 太陽不落 → 24 小時都有光,「半夜」天空金紅最 magic。隨時影,唔使追日落。'},
  arctic:{badge:'☀️ 午夜太陽', txt:'Harads 喺極圈邊上,7 月頭半夜仲有光——浮喺河上嘅冷池,夜晚浸都唔黑。'},
  gbg:{badge:'🌅 黃金時刻', txt:'Göteborg 7 月:日出 ~04:20 · 日落 ~22:00。晨攝 ~04:30–06:00,黃昏金光 ~20:30–22:00,藍調到午夜。'},
  ikea:{badge:'🌅 黃金時刻', txt:'Älmhult 7 月:日落 ~22:00。'},
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
  {h:'🎫 車票', items:['Stockholm = SL 7-day 成人 470(reduced 290 淨瑞典學生證/7-19歲,你哋唔合);Göteborg = Västtrafik zon A——兩個唔通用!','Arlanda Express 成人 340/youth(18-25)160≠ Flygbussarna ≠ SL,分開買。']},
  {h:'🧾 退稅', items:['非歐盟旅客單店滿額退稅(Global Blue);收據留好,退稅貨隨身唔好 check-in。','機場出發層 Global Blue 櫃位辦,預 buffer 排隊。']},
  {h:'🍮 文化', items:['免小費(價已含服務,湊整數即可)。','Fika = 停低慢活咖啡+肉桂卷,瑞典精神。','樽罐有 Pant 押金,超市回收機退券。','Systembolaget = 國營酒舖(>3.5% 酒),週日休、要 passport。']},
  {h:'🗣 瑞典語', items:['Hej(嗨)/Tack(唔該/多謝)/Hejdå(拜拜)','Fika(咖啡時光)/Lagom(剛剛好)/En kaffe tack(一杯咖啡唔該)']},
];

/* 逐日代入式 enrichment（4-agent + Codex 逐日 hour-by-hour sim 整合）:🎒帶咩 / 💡小提示(順路+你 saved) / ⏱節奏 */
const EX = {
 d0627:{carry:'護照(回程後≥6月)·booking code 離線·尿袋/降噪耳機·輕外套(夜凍)',tip:'PVG 轉機只 2h25 = 唯一壓力位,落機即衝;Comfort Hotel 喺機場行得到,買定聽日早餐+水。',pace:'純 transit,瞓飽——上山前最後一張正常床(到 7/4 先有淋浴)。'},
 d0628:{carry:'購物袋×2·信用卡·少量現金·shell+中層保暖',tip:'落機放低嘢→Österleden 一條街掃晒:ICA Kvantum 買 6 日糧(只孭 2 日,沿途補)+ Jaktia/Intersport 買 2×230g 螺紋氣罐(⚠️唔上得飛機)。咖啡控買定靚掛耳上山。',pace:'⚠️週日戶外舖多數閉→氣罐當 6/29 Abisko 買(email abisko.butik@stfturist.se 預留);今晚試孭背囊重量。'},
 d0629:{carry:'背囊正式上身·濾水器·防蚊頭網·行山杖·腳架(影午夜太陽)·冷帽手套(Nuolja 頂近0°C)',tip:'黃昏/夜上 Aurora Sky 吊椅(夜班20:00-01:30)→Nuolja 頂俯瞰 Torneträsk+Lapporten=攝影 jackpot;Fjällboden 順手買氣罐+寄行李去 Nikkaluokta。',pace:'安頓+輕鬆熱身(唔行正路);午夜太陽冇盡頭易玩通頂,但聽日行 15km,瞓夠。'},
 d0630:{carry:'頭網+防蚊(低地蚊巢)·水樽×2+濾水器·輕雨衣',tip:'穿 Abisko 國家公園峽谷,清澈河水+白樺林攝影亮點密;Abiskojaure 有桑拿+shop,早到沖湖焗桑拿補糧。',pace:'15km·+100m·4-5h 最易一日,搵節奏。'},
 d0701:{carry:'多1條能量bar·防曬+太陽眼鏡(無遮蔭·午夜太陽UV)·shell(高地風大)',tip:'「Lapland 最美一面」野河廣谷=Yin 影 landscape 大日,留夠電+SD;Alesjaure 柴火桑拿+shop,補返一罐氣罐;暑期或有船過湖省路(臨行查)。',pace:'21km·+300m·6-7h(攝影 pace 預 7-8h),早出發 8-9am。'},
 d0702:{carry:'⚠️過山口前裝滿2樽水(高原溪流稀疏)·全套保暖+shell+冷帽手套(7月都可能風雪)·行山杖(落坡碎石濕滑)·多1-2份高能量糧',tip:'🚨炸彈日!~25km 過全程最高 Tjäktja 1140m(STF 官方拆兩日);選 2-3 個 must-shoot(山口頂/谷景/窄橋)其餘行邊影邊;💡可考慮 Tjäktja 加一晚(rebook STF)。',pace:'~25km·8-9h 淨行(攝影預 10-11h),務必 7-8am 出發;Sälka 到埗買定 7/3 全日糧(Singi 冇 shop)。'},
 d0703:{carry:'Sälka 買定嘅一日糧(Singi 冇 shop)·相機留夠電',tip:'宏偉 U 形 Tjäktjavagge 冰蝕谷+馴鹿+吊橋,炸彈日後恢復日,慢慢等光等馴鹿、中途煮午餐沖咖啡、Kam Ling 鈎針。',pace:'12km·-100m·3-4h 最短最 chill,唔使早起;⚠️Singi 岔路口睇路標東行。'},
 d0704:{carry:'輕量換洗衫(今晚有淋浴+桑拿!)·相機電(瑞典最高峰現身)·錢/卡(餐廳 buffet)',tip:'經 Kaffedalen 咖啡谷,Kebnekaise 主峰現身;全程最舒適一晚,洗澡食 buffet 回氣;💡有訊號→訂定 7/5 16:55 巴士飛(山中冇訊號)。',pace:'14km·±150m·4-5h;唔好臨時加登頂(另一日 round-trip)。'},
 d0705:{carry:'防蚊頭網(Nikkaluokta 段蚊極多)·相機',tip:'回望 Kebnekaise 雪峰+Ladtjojaure 綠湖;下船碼頭 Sami 帳篷咖啡 Kaffekåta+馴鹿漢堡打卡;可搭湖船省 6km(臨行查船期)。',pace:'19km·5.5-6.5h→最遲 8:30am 出發趕 16:55 尾班巴士(網訂 15:55 截,喺 Kebnekaise 訂定);錯過=瞓 Nikkaluokta。'},
 d0706:{carry:'護照+HK牌+國際駕照+司機名下實體信用卡(按金)·火車午餐 Kiruna 買定·相機(車窗外極圈景)',tip:'💡朝早叫 STF reception 代 book 的士 12:10 去火車站(佢哋已話肯幫);12:50 上車前食飽+買車上乾糧;Luleå C 落車跟 104 巴士去機場;兩晚 Arctic Culinary 都 book 咗。',pace:'火車 4h22 → 巴士 20 分 → 取車+租車手續/EV 檢查(15-30 分)→ 揸 1h15;~19:45-20:00 到酒店(晚餐 20:00 會貼線,reception 講聲)。'},
 d0707:{carry:'泳衣/拖鞋(spa)·相機(Commons 冇 Arctic Bath 相,自己影)',tip:'🎂 Yin 21 歲!純 relax 養返行山攰;漂浮 cabin+冷池+sauna。',pace:'純享受日,冇行程壓力。'},
 d0708:{carry:'前一晚執好行李·還車前影低車況+電量·機票 QR 離線截圖',tip:'11:35 落 GOT→Flygbussarna 入市→電車 3/9/11 去 Majorna check-in→下午 Haga/da Matteo 照行(Majorna 去 Haga 電車 ~10 分鐘)。',pace:'⏰ 早機 09:55!Yin plan:5:30 起→6:00 攞 breakfast bag 出發→~8:00 到 LLA(1h15 車程+buffer)→還車→入 terminal→bag drop 09:10 前鬆容。寧早莫遲。'},
 d0709:{carry:'學生證(問博物館學生價,20歲要俾75)·薄外套(室內冷氣坐成日)·水樽+snack·相機多帶電+卡',tip:'💡你 saved 嘅 Victor Hasselblad Statue 今日順路影(攝影朝聖);食:Hasselblad 出門 Mr P/Familjen,或場內 Ceno;da Matteo 順手一杯。',pace:'World of Volvo ~2-3h(唔使搶 timed,網買慳10%全日有效)+Hasselblad ~1-1.5h;Konstmuseum 逢一閉今日四 OK;全室內落雨唔怕。'},
 d0710:{carry:'暖 layer(室內+火車冷氣)·Västtrafik app·水樽+snack(Trollhättan 嘢食少)·相機',tip:'💡Saab 隔籬 Innovatum 科學館行2分(combo 票)+運河船閘古工程峽谷(免費上鏡);⚠️瀑布放水 2026 夏天冇(只7/17-19);Radiomuseet/Backa Teater 喺市內唔順路留返。',pace:'火車~38分;Saab~2h+Innovatum~1.5h+船閘~1-1.5h;⚠️Saab hours 矛盾→打 +46-520-289440 confirm 週五開;學生證慳60/人。'},
 d0711:{carry:'⚠️現金 1800 SEK(滑翔傘唔收咭)·波鞋長褲風褸(高空凍)·相機綁帶/GoPro·水樽snack(等風)',tip:'9am 後打 070-66 77 210 confirm 天氣先叫 taxi 去 Kareby(~25分·400-550 SEK);飛唔到→Radiomuseet(週六12-15)/Haga/Feskekörka/Universeum;~15:00 返到 Slottsskogen 黃昏散步。',pace:'全程最靠天一日:飛到=賺,飛唔到=室外咖啡攝影日;滑翔傘半日吊住,唔好再排 must-do。'},
 d0712:{carry:'早餐/snack 上火車(4h20)·行李齊裝退房·薄外套·SJ W9NULT2R 截圖離線',tip:'💡IKEA Museum(每日10-18,成人60/18歲下免)館內有餐廳→14:15 到先食遲午餐(瑞典肉丸朝聖)再入館;Gothia Cup+Pippi pop-up 暑期氛圍。',pace:'⚠️趕 09:55 早火車(退房+行李+去 Göteborg C 預 buffer);坐4鐘→先 check-in 放行李食飽再行展(~2-3h 暖身)。'},
 d0713:{carry:'行李退房寄存·薄外套·SJ WRAVLE37 截圖·snack/晚餐(車上食)',tip:'💡IKEA Museum 限定手信(唔係普通 IKEA 貨)今日最後機會;⚠️host Jerker 已知 ~21:30 到;有變化先 message。',pace:'玩足上半日(~3-4h)+12:00 午餐,~15:30-16:00 攞行李去站;17:09→20:38 坐成晚。'},
 d0714:{carry:'⚠️薄外套/冷衫(Vasa 館內 18-19°C,坐成日)·水樽+snack(島上貴)·A7S III 廣角(暗船高ISO)·防曬太陽眼鏡(Skansen 露天)·摺傘·舒服波鞋',tip:'💡Vasa 隔籬 Vikingaliv(你 saved)+Nordiska 同一條 Djurgårdsvägen 串連順路;Rosendals Trädgård 花園 fika;晚 Allsång på Skansen 就喺島上唔使轉場。',pace:'Vasa 08:30 早開~2h+Nordiska~2h(crochet 核心,可 3-4h)+Skansen 半日;⚠️ABBA/Viking 做機動,四館一日做唔晒→鎖 Vasa+Nordiska+Skansen。'},
 d0715:{carry:'🚤RIB 後備衫+唔怕濕鞋(高速濺水,入面衫濕咗冇得換)·A7S III 防水罩(海上唔換鏡)·防風褸(海上凍)·水樽snack(船上2h冇得買)',tip:'💡碼頭 Strandvägen 順路 Östermalms Saluhall 晚餐+Kungsträdgården fika;黃昏返 SoFo 掃咖啡器材(Drop+Johan&Nyström);Fotografiska 週三18:00後買一送一,開到23:00。',pace:'RIB 2h(提早幾日 book,揀黃昏場光靚)+Fjäderholmarna 半日(⚠️查實尾班船);睇天氣,落雨同16/17對調。'},
 d0716:{carry:'舒服行街鞋(行成日)·環保袋(買毛線+豆器材+黑膠)·薄外套(店冷氣+河邊風)·摺傘·A7S III',tip:'💡Avicii 10:00 頭場→行5分 Svensk Hemslöjd(🧶);午餐 Kajsas Fisk;SoFo 你 saved 嘅 Bar Ottocento/Meatballs 晚餐;Mosebacke/Monteliusvägen 日落(夏季 ~22:00)。',pace:'⚠️暑假細店多 sem→Svensk Hemslöjd+Litet Nystan 趁一-五+18:00前(週四=安全日);Avicii~1.5-2h 提早訂時段。'},
 d0717:{carry:'⚠️layer 外套(美術館坐成日凍+Stadshuset 塔頂106m風大)·A7S III+三腳架(晨攝/夜場 Fotografiska 到23:00)·舒服鞋(鵝卵石)·學生證·摺傘',tip:'💡Gamla Stan 晨攝必影 Mårten Trotzigs gränd 最窄巷+Stortorget 彩色屋;你 saved Nobel(Stortorget 2)順路;Nationalmuseum 隔籬 Kungsträdgården+Acne;晚 Aifur 維京餐(淨Fri/Sat,要 book)/Bio Rio indie。',pace:'⚠️一日塞太多→Nobel 同 National 揀一重點另一快閃;Fotografiska 唔重複就鬆;🔴Moderna 週五免費場 6/12 已完,正價 170——可以 skip。'},
 d0718:{carry:'退稅貨+收據隨身唔好 check-in(要驗貨)·外套(機艙/Arlanda Express 凍)·護照+booking code 離線',tip:'💡最後 fika/Gamla Stan 漏網/Åhléns·NK 手信;退稅 Global Blue 喺出發層預 20-40 分排隊。',pace:'⚠️冇 buffer:最遲 20:10 到 ARN(起飛前2.5h)→~19:00 一定起行;住 Helenelund 順方向——SL app 睇 pendeltåg 直去 Arlanda C(~25分+過站費130/人)定入 City 轉 Arlanda Express(youth 160)邊樣快。'},
};

/* Sixt 單點故障 → 實際 Plan B mini-itinerary */
const PLANB = {title:'🧯 後備知識（車已訂——僅供萬一取車出事先用）', steps:[
 '🅱️1 首選·7/6 入：火車 7153 Kiruna 12:50→Boden 16:31 → 同站轉 Buss 44 16:55→Harads Gulf 17:40（行 ~1.2km 到 Arctic Bath / 叫酒店接）。想早到：Buss 10 Kiruna 07:20→Luleå 12:40 → Buss 44 13:50→15:23 到。⚠️ 夏季表冇「10:46 火車」呢回事,Kiruna 朝早冇直達火車。',
 '🅱️1 首選·7/8 出（⛔ 公共交通最早 09:57 先到機場 = 趕唔切 09:55 機,實測）：Arctic Bath transfer 或 taxi ~07:00 走 → 08:15 到 LLA。Taxi 預 2,500–3,000 SEK/車（同村 Treehotel 官方接送 2,700 做基準）。Boden Taxi +46 921-177 00 要【7/7 18:00 前】book 死線;後備 Luleå Taxi 0920-10 000（24h）。',
 '🅱️1b 慳錢 hybrid（進取先用）：Buss 44 07:10→Boden 07:55 + 預約 taxi 08:00 由 Boden→LLA ~08:40（taxi 只行 42km,~900–1,300 SEK,慳一半）。bag drop 09:10 前 30 分鐘 margin——巴士誤點就冇命,穩陣首選都係成程 transfer。',
 '🅱️2 改下晝機（先查!）：訂票引擎 7/8 嗰個 HKD823 選項若果係 13:55→15:35 直航(SK2079)→ 改買佢:朝早唔使趕,09:15 Buss 44→Luleå 10:50→轉 104 11:08→LLA 11:28,歎埋 Arctic Bath 早餐先走。2 人慳 ~HKD4,000,代價 = 遲 4 鐘到 GOT(蝕半日)。⚠️ 823 若係朝早轉機班就唔抵,要先撳入去睇時間。',
 '🅱️3 完全唔飛：7/8 全日 Arctic Bath → Buss 44 19:02→Boden 19:45 → SJ 夜火車 21:46→Stockholm 10:13(7/9) → X2000 11:08→GOT 15:55(7/9)。賺成日 spa+慳一晚住宿,蝕 7/9 大半日(GBG 行程順延)。sj.se 訂臥鋪。',
 '🅱️4（最痛）棄 Arctic Bath：7/6-8 留 Kiruna 直接飛 GOT。最後手段,生日 spa 冇咗。',
 '⏰ cut-off：7/5 出山前車仲未 confirm → 即切 B1（同時等緊 Arctic Bath transfer 報價·已 email）。⚠️ 交通鎖死先買機票、先俾錢訂 Arctic Bath（100% 不可退）。臨行 3-7 日 resrobot.se 覆核班次（夏季 banarbete 會改點）。',
]};

/* Yin Google Maps saved 但未排成行程點嘅地方 → 全部上地圖(淡色,撳「顯示 saved」)·標建議(唔再 silently drop) */
const SAVED = [
 {n:'Medborgarplatsen',ll:[59.3152,18.0732],rec:'opt',why:'Söder 中央廣場·7/16 順路'},
 {n:'Kungsträdgården',ll:[59.3317,18.0713],rec:'opt',why:'中央公園·7/15 順路 fika'},
 {n:'Vikingaliv 維京博物館',ll:[59.3266,18.0948],rec:'opt',why:'Djurgården·7/14 有力先加'},
 {n:'Armémuseum 軍事館',ll:[59.3347,18.0802],rec:'opt',why:'Östermalm·免費·軍事 niche·落雨先'},
 {n:'Bar Ottocento',ll:[59.3137,18.0745],rec:'opt',why:'Söder natural wine·7/16 晚餐 alt'},
 {n:'Bibon',ll:[59.3341,18.0730],rec:'opt',why:'Bibliotekstan 新 bistro·難 book'},
 {n:'Stora Bageriet',ll:[59.3414,18.0381],rec:'opt',why:'Vasastan 麵包店·偏西北'},
 {n:'Max Burgers',ll:[59.3362,18.0704],rec:'skip',why:'連鎖快餐·HK 都食到(你 saved×2)'},
 {n:'Lilla Ego',ll:[59.3436,18.0456],rec:'skip',why:'最難 book+貴·綁死一晚唔值'},
 {n:'Restaurang Amalia',ll:[59.3373,18.0675],rec:'skip',why:'貴·evening drinking·唔夾 chill'},
 {n:'Francesco',ll:[59.3144,18.0845],rec:'skip',why:'deli·同 quick-bite 重複'},
 {n:'Balue',ll:[59.3109,18.0971],rec:'skip',why:'查唔到·疑結業'},
 {n:'Gullegårdens GF Bageri',ll:[59.3455,18.0968],rec:'skip',why:'查唔到·無 gluten-free 需要免去'},
 {n:'H&M Studios',ll:[59.3178,18.0716],rec:'skip',why:'對唔到實體·疑誤存'},
 {n:'Stockholms Centralstation',ll:[59.3300,18.0586],rec:'skip',why:'車站·transit'},
 {n:'Marina Viator(GBG)',ll:[57.7101,11.9621],rec:'skip',why:'其實係 Viator 網上租電動船 listing·7/10/群島已坐船重複'},
 {n:'Backa Teater(GBG)',ll:[57.7059,11.9360],rec:'opt',why:'瑞典語劇場·niche·有 show 先去'},
 {n:'Vrångö(GBG·換咗 Saab)',ll:[57.5756,11.7851],rec:'opt',why:'原 7/10 群島·你揀咗 Saab 換走·想返轉頭 call 我'},
];

/* 🎯 你要訂嘅嘢 — 每樣齊晒:訂邊日/幾多人/大約幾多錢/喺邊度(link)/幾時截。價標 FACT/估算·落單前 confirm */
const BOOK = [
 {t:'💳 取車按金實體卡（決定咗就剔）',s:'todo',d:'出發前袋好',pax:'司機 Ng Cho Yin 名下',price:'—',where:'https://mox.com',wl:'Mox 狀態',dl:'7/6 LLA 取車按金要「司機名下實體信用卡」。Mox 未寄出 = 唔等,直接帶你現有實體信用卡(confirm 額度夠按金)。二揀一,袋咗落銀包就完成'},
 {t:'🚗 租車 EX30 @ Luleå（已訂 ✅）',s:'paid',d:'7/6 18:00 取 → 7/8 07:30 還（LLA 同站）',pax:'司機只有 Ng Cho Yin（取車日 20 歲·已過供應商審批）',price:'Trip.com 訂單已確認（Volvo EX30 或同級）',where:'https://www.trip.com',wl:'Trip.com 訂單',dl:'⚠️ 出發前照 Trip.com 附件執齊「取車所需文件」：護照+HK牌+IDP+司機名下實體信用卡（按金）。舊 Sixt 單程已正式取消（書面確認 free of charge）'},
 {t:'🧖 Arctic Bath（已訂 ✅ 生日 spa）',s:'paid',d:'7/6–7/8（2 晚）',pax:'2 人 · Land Suite',price:'8,995 SEK/晚 ×2 = 17,990（含早餐+全 SPA）',where:'mailto:booking@arcticbath.se',wl:'email 酒店',dl:'已確認（BookVisit 6/11）。記住 confirm 埋：7/7 Arctic Culinary 生日晚餐 訂咗未 + 7/8 06:45 breakfast bag——酒店之前答應咗,出發前一週 email 覆核一次'},
 {t:'✈️ SK2051 LLA→GOT',s:'todo',d:'7/8 09:55→11:35（直航·已驗證）',pax:'2 人',price:'HKD ~823–1,949/人（6/10 所見·2 人 ~HKD 1,646–3,898·會浮動）',where:'https://www.flysas.com',wl:'flysas.com',dl:'✅ 6/10 已驗證 7/8 真有直航(CityJet)。早機:07:00 要離開 Arctic Bath(bag drop 09:10 截)。SIXT 車 confirm【即刻】買——價會升。揀有寄艙行李 fare(兩個大喼)'},
 {t:'🏠 GBG Airbnb Majorna（已訂 ✅）',s:'paid',d:'7/8–7/12（4 晚·日期已改正）',pax:'2 人 · host Marcus · 全新 listing',price:'已付（Airbnb 收據）',where:'https://www.airbnb.com',wl:'Airbnb app',dl:'⚠️ 零評價新盤:check-in 日影低單位狀況,有唔對辦 24 小時內 app 內 report。電車 3/9/11 出市區,去 Haga ~10 分鐘'},
 {t:'🏠 Stockholm Airbnb（Helenelund·已訂 ✅）',s:'paid',d:'7/13–7/18（5 晚）',pax:'2 人 · host Jerker · ★4.96 · 30m²',price:'已付（Airbnb 收據）',where:'https://www.airbnb.com',wl:'Airbnb app',dl:'host 知你 ~21:30 到;去 Vasa 等景點 = pendeltåg 入 City 轉,門到門 ~40-45 分鐘'},
 {t:'🎟 World of Volvo',s:'todo',d:'7/9',pax:'2 人',price:'成人 220–250 SEK（學生≤25 帶證 165–190）',where:'https://www.worldofvolvo.com/en/visit/',wl:'worldofvolvo.com',dl:'網購慳 10%·全日有效唔使搶時段'},
 {t:'🕯 Avicii Experience（已買 ✅）',s:'paid',d:'7/16 10:00 頭場',pax:'1 成人 + 1 學生（帶學生證）',price:'已付（YZCB51）',where:'https://aviciiexperience.com',wl:'YZCB51',dl:'✅ 飛已買。送 ABBA Museum 9 折 code「AVICII」(成人飛用)'},
 {t:'🏛 Stadshuset Tower',s:'todo',d:'7/17 · 09:00 頭場',pax:'2 人',price:'成人 100 SEK/人（Codex 官方更正·原寫 150 錯）',where:'https://stadshuset.stockholm/en/visit-stockholm-city-hall/city-hall-tower/',wl:'City Hall',dl:'飛 T-7 日放(即 7/10·reminder set) / 當日 08:30 City Hall Shop。7 月時段 09:00/09:50/10:40...'},
 {t:'🚤 RIB Stockholm',s:'todo',d:'7/15 下午（黃昏光靚）',pax:'2 人',price:'1,490 SEK/人（2 人 2,980）',where:'https://www.ribstockholm.com/experiences/2-hour-tour/',wl:'ribstockholm.com',dl:'提早幾日揀日子·睇天氣前一兩日 lock'},
 {t:'🎤 Allsång på Skansen',s:'todo',d:'7/14 晚（⚠️未驗證）',pax:'2 人',price:'~495–595 SEK/人（企位用 Skansen 飛即可）',where:'https://www.skansen.se',wl:'skansen.se',dl:'⚠️ 2026 場次表官方頁 404 未驗證——6 月尾上 skansen.se/SVT 確認 7/14 真有場先買;確認唔到就剔除'},
 {t:'🪂 滑翔傘（天氣 backup）',s:'todo',d:'7/11 12–15（drop-in）',pax:'2 人',price:'900 SEK/人（2 人 1,800·現金/Swish）',where:'tel:0706677210',wl:'打 070-66 77 210',dl:'當日 9am 後打確認天氣先去·唔收咭'},
 {t:'🛡️ 旅遊保險（已買 ✅）',s:'paid',d:'生效 6/27 · Zurich 自在旅遊',pax:'持有人 Yin（⚠️ 覆核埋 Kam Ling 有冇 cover）',price:'已付 HK$1,086',where:'https://www.zurich.com.hk',wl:'保單 PDF',dl:'開保單 PDF check 兩樣:①cover 唔 cover 第二人 ②條款有冇 hiking + emergency evacuation。保單 PDF 下載落手機離線'},
];

window.SWEDEN = { TRIP, BK, LEGS, DAYS, TRANSPORT, EMERGENCY, EMERG_NOTE, CHECKLIST, HERO, HERO_CAP, SUN, IMG_CREDITS, CHEAT, EX, PLANB, SAVED, BOOK };
