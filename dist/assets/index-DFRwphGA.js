(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t){return{row:e,col:t}}function t(e,t){let n=e.row===t.row&&Math.abs(e.col-t.col)===1,r=e.col===t.col&&Math.abs(e.row-t.row)===1;return n||r}function n(n,r,i=null){if(!t(n,r))throw RangeError(`Pontos não adjacentes: (${n.row},${n.col}) e (${r.row},${r.col})`);let a=n.row<r.row||n.row===r.row&&n.col<r.col,o=a?n:r,s=a?r:n;return{from:e(o.row,o.col),to:e(s.row,s.col),ownerId:i}}function r(e){return`${e.from.row===e.to.row?`h`:`v`}-${e.from.row}-${e.from.col}`}function i(e){return`b-${e.row}-${e.col}`}function a(t){let i=t.row,a=t.col;return[r(n(e(i,a),e(i,a+1))),r(n(e(i+1,a),e(i+1,a+1))),r(n(e(i,a),e(i+1,a))),r(n(e(i,a+1),e(i+1,a+1)))]}function o(t,a){if(t<2)throw RangeError(`gridSize deve ser >= 2`);if(a.length<2)throw RangeError(`É necessário ao menos 2 jogadores`);let o={};for(let i=0;i<t;i++)for(let a=0;a<t-1;a++){let t=n(e(i,a),e(i,a+1));o[r(t)]=t}for(let i=0;i<t-1;i++)for(let a=0;a<t;a++){let t=n(e(i,a),e(i+1,a));o[r(t)]=t}let s={};for(let n=0;n<t-1;n++)for(let r=0;r<t-1;r++){let t={topLeft:e(n,r),ownerId:null};s[i(t.topLeft)]=t}let c=a[0];return{gridSize:t,players:a.map(e=>({...e,score:0})),lines:o,boxes:s,currentPlayerId:c.id,status:`playing`}}function s(e,t,n){return{id:e,name:t,color:n,score:0}}function c(e){return{ok:!0,value:e}}function l(e,t=null){return{ok:!1,error:e,code:t}}var u={GAME_FINISHED:`GAME_FINISHED`,LINE_NOT_FOUND:`LINE_NOT_FOUND`,LINE_ALREADY_TAKEN:`LINE_ALREADY_TAKEN`};function d(e,t){if(e.status===`finished`)return l(`A partida já terminou`,u.GAME_FINISHED);let n=r(t),o=e.lines[n];if(o===void 0)return l(`Linha inexistente no tabuleiro`,u.LINE_NOT_FOUND);if(o.ownerId!==null)return l(`Linha já foi jogada`,u.LINE_ALREADY_TAKEN);let s=e.currentPlayerId,d={...e.lines,[n]:{...o,ownerId:s}},p={...e.boxes},m=0;for(let t of Object.values(e.boxes))t.ownerId===null&&a(t.topLeft).every(e=>{let t=d[e];return t!==void 0&&t.ownerId!==null})&&(p[i(t.topLeft)]={...t,ownerId:s},m+=1);let h=e.players.map(e=>e.id===s?{...e,score:e.score+m}:{...e}),g=Object.values(d).every(e=>e.ownerId!==null)?`finished`:`playing`,ee=g===`finished`||m>0?s:f(e.players,s);return c({...e,lines:d,boxes:p,players:h,currentPlayerId:ee,status:g})}function f(e,t){return e[(e.findIndex(e=>e.id===t)+1)%e.length].id}function p(e){return Object.values(e.lines).filter(e=>e.ownerId===null)}var m=class{state;constructor(e){this.state=this.buildState(e)}buildState(e){let t=e.players.map((e,t)=>s(`p${t+1}`,e.name,e.color));return o(e.gridSize,t)}getState(){return this.state}playLine(e){let t=d(this.state,e);return t.ok?(this.state=t.value,!0):!1}reset(e){this.state=this.buildState(e)}getAvailableLines(){return p(this.state)}},h=80,g=50,ee=7,te=24;function _(e){return g+e*h}function v(e){return g+e*h}function ne(e,t){return t?e.players.find(e=>e.id===t)?.color??`#888`:`#ccc`}function y(e){let t=g*2+(e-1)*h;return{width:t,height:t}}function re(e,t,n,i=!1){let{gridSize:a}=t,{width:o,height:s}=y(a);e.clearRect(0,0,o,s),e.fillStyle=`#ffffff`,e.fillRect(0,0,o,s);for(let n of Object.values(t.boxes)){if(!n.ownerId)continue;let r=ne(t,n.ownerId),i=_(n.topLeft.col),a=v(n.topLeft.row);e.fillStyle=r+`33`,e.fillRect(i+1,a+1,h-2,h-2);let o=t.players.find(e=>e.id===n.ownerId);o&&(e.fillStyle=r+`bb`,e.font=`bold ${Math.floor(h*.35)}px system-ui, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(o.name[0]?.toUpperCase()??`?`,i+h/2,a+h/2))}let c=t.players.find(e=>e.id===t.currentPlayerId);for(let i of Object.values(t.lines)){let a=n!==null&&r(n)===r(i);e.beginPath(),e.moveTo(_(i.from.col),v(i.from.row)),e.lineTo(_(i.to.col),v(i.to.row)),e.lineCap=`round`,i.ownerId===null?a?(e.strokeStyle=(c?.color??`#888`)+`cc`,e.lineWidth=6):(e.strokeStyle=`#dde1e7`,e.lineWidth=3):(e.strokeStyle=ne(t,i.ownerId),e.lineWidth=7),e.stroke()}for(let t=0;t<a;t++)for(let n=0;n<a;n++)e.beginPath(),e.arc(_(n),v(t),ee,0,Math.PI*2),e.fillStyle=`#2c3e50`,e.fill()}function b(t,i,a){let{gridSize:o}=t,s=null,c=te;for(let l=0;l<o;l++)for(let u=0;u<o-1;u++){let o=_(u),d=_(u+1),f=v(l);if(i>=o-4&&i<=d+4){let i=Math.abs(a-f);if(i<c){c=i;let a=r(n(e(l,u),e(l,u+1)));s=t.lines[a]??null}}}for(let l=0;l<o-1;l++)for(let u=0;u<o;u++){let o=v(l),d=v(l+1),f=_(u);if(a>=o-4&&a<=d+4){let a=Math.abs(i-f);if(a<c){c=a;let i=r(n(e(l,u),e(l+1,u)));s=t.lines[i]??null}}}return s}var x={"pt-BR":`🇧🇷 PT-BR`,"pt-PT":`🇵🇹 PT-PT`,es:`🇪🇸 ES`,en:`🇬🇧 EN`},ie=`dab_lang`;function ae(){let e=localStorage.getItem(ie);if(e&&e in x)return e;let t=navigator.language??``;return t.startsWith(`pt-PT`)?`pt-PT`:t.startsWith(`pt`)?`pt-BR`:t.startsWith(`es`)?`es`:`en`}function oe(e){localStorage.setItem(ie,e)}function S(e,t){let n=se[ae()][e]??se.en[e]??e;if(t)for(let[e,r]of Object.entries(t))n=n.replaceAll(`{${e}}`,String(r));return n}var se={"pt-BR":{tagline:`Conecte • Feche • Domine`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} fases concluídas`,menu_bot:`vs Bot`,menu_bot_sub:`7 dificuldades`,menu_multi:`Multijogador`,menu_multi_sub:`2 a 4 jogadores • Duplas ou Solo`,back:`← Voltar`,lang_label:`Idioma`,energy_no:`⚡ Sem energia! Aguarde a recarga ou assista um anúncio.`,energy_recharged:`⚡ Energia recarregada!`,energy_unlimited:`∞`,settings:`Configurações`,theme:`Tema`,theme_dark:`🌙 Escuro`,theme_light:`☀️ Claro`,multiplatform:`Multiplataforma`,profile:`Perfil`,diff_muito_facil:`Muito Fácil`,diff_facil:`Fácil`,diff_medio:`Médio`,diff_dificil:`Difícil`,diff_muito_dificil:`Muito Difícil`,diff_impossivel:`Impossível`,diff_impulsivo:`Impulsivo`,setup_difficulty:`Dificuldade`,setup_grid:`Grade`,setup_players:`Jogadores`,setup_mode:`Modo`,setup_solo:`Solo (todos vs todos)`,setup_teams:`Duplas (2v2)`,setup_start:`Iniciar Partida`,game_turn:`Vez de {name}`,game_bot_thinking:`Bot pensando...`,stage_label:`Fase {id}`,vs_bot_label:`vs Bot — {diff}`,teams_2v2:`Duplas 2v2`,n_players:`{n} Jogadores`,team_a:`Time A`,team_b:`Time B`,stage_complete:`COMPLETA!`,next_stage:`Próxima Fase →`,map:`📍 Mapa`,victory:`Vitória!`,won_suffix:`venceu!`,tie:`🤝 Empate!`,new_game:`Nova Partida`,xp_gained:`+{xp} XP`,you_lost:`Você perdeu!`,try_again:`⚡ Tentar de novo`,watch_ad:`📺 Assistir anúncio`,ad_label:`ANÚNCIO`,ad_close_timer:`Fechar ({n})`,ad_close_ready:`✓ Fechar`,ad_text:`Baixe agora o melhor jogo!`,ad_cta:`JOGAR GRÁTIS`,god_mode:`👑 God Mode`,god_unlimited_energy:`Energia ilimitada`,god_go_stage:`Ir para fase específica`,god_go:`IR`,god_next:`⏭ Próxima fase ({id})`,god_refill:`⚡ Recarregar energia`,god_activated:`👑 God Mode ATIVADO!`,god_deactivated:`God Mode desativado`,on_label:`ON`,off_label:`OFF`,player_n:`Jogador {n}`,you:`Você`,bot:`Bot`,rank_master:`Mestre`,rank_diamond:`Diamante`,rank_plat_3:`Platina III`,rank_plat_2:`Platina II`,rank_plat_1:`Platina I`,rank_gold_3:`Ouro III`,rank_gold_2:`Ouro II`,rank_gold_1:`Ouro I`,rank_silver_3:`Prata III`,rank_silver_2:`Prata II`,rank_silver_1:`Prata I`,rank_bronze_3:`Bronze III`,rank_bronze_2:`Bronze II`,rank_bronze_1:`Bronze I`,rank_beginner:`Iniciante`},"pt-PT":{settings:`Definições`,theme:`Tema`,theme_dark:`🌙 Escuro`,theme_light:`☀️ Claro`,multiplatform:`Multiplataforma`,profile:`Perfil`,tagline:`Conecte • Feche • Domine`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} fases concluídas`,menu_bot:`vs Bot`,menu_bot_sub:`7 dificuldades`,menu_multi:`Multijogador`,menu_multi_sub:`2 a 4 jogadores • Duplas ou Solo`,back:`← Voltar`,lang_label:`Idioma`,energy_no:`⚡ Sem energia! Aguarde a recarga ou veja um anúncio.`,energy_recharged:`⚡ Energia recarregada!`,energy_unlimited:`∞`,diff_muito_facil:`Muito Fácil`,diff_facil:`Fácil`,diff_medio:`Médio`,diff_dificil:`Difícil`,diff_muito_dificil:`Muito Difícil`,diff_impossivel:`Impossível`,diff_impulsivo:`Impulsivo`,setup_difficulty:`Dificuldade`,setup_grid:`Grelha`,setup_players:`Jogadores`,setup_mode:`Modo`,setup_solo:`Solo (todos vs todos)`,setup_teams:`Duplas (2v2)`,setup_start:`Iniciar Jogo`,game_turn:`Vez de {name}`,game_bot_thinking:`Bot a pensar...`,stage_label:`Fase {id}`,vs_bot_label:`vs Bot — {diff}`,teams_2v2:`Duplas 2v2`,n_players:`{n} Jogadores`,team_a:`Equipa A`,team_b:`Equipa B`,stage_complete:`COMPLETA!`,next_stage:`Próxima Fase →`,map:`📍 Mapa`,victory:`Vitória!`,won_suffix:`venceu!`,tie:`🤝 Empate!`,new_game:`Novo Jogo`,xp_gained:`+{xp} XP`,you_lost:`Perdeu!`,try_again:`⚡ Tentar novamente`,watch_ad:`📺 Ver anúncio`,ad_label:`ANÚNCIO`,ad_close_timer:`Fechar ({n})`,ad_close_ready:`✓ Fechar`,ad_text:`Descarregue agora o melhor jogo!`,ad_cta:`JOGAR GRÁTIS`,god_mode:`👑 God Mode`,god_unlimited_energy:`Energia ilimitada`,god_go_stage:`Ir para fase específica`,god_go:`IR`,god_next:`⏭ Próxima fase ({id})`,god_refill:`⚡ Recarregar energia`,god_activated:`👑 God Mode ATIVADO!`,god_deactivated:`God Mode desativado`,on_label:`ON`,off_label:`OFF`,player_n:`Jogador {n}`,you:`Você`,bot:`Bot`,rank_master:`Mestre`,rank_diamond:`Diamante`,rank_plat_3:`Platina III`,rank_plat_2:`Platina II`,rank_plat_1:`Platina I`,rank_gold_3:`Ouro III`,rank_gold_2:`Ouro II`,rank_gold_1:`Ouro I`,rank_silver_3:`Prata III`,rank_silver_2:`Prata II`,rank_silver_1:`Prata I`,rank_bronze_3:`Bronze III`,rank_bronze_2:`Bronze II`,rank_bronze_1:`Bronze I`,rank_beginner:`Iniciante`},es:{settings:`Ajustes`,theme:`Tema`,theme_dark:`🌙 Oscuro`,theme_light:`☀️ Claro`,multiplatform:`Multiplataforma`,profile:`Perfil`,tagline:`Conecta • Cierra • Domina`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} fases completadas`,menu_bot:`vs Bot`,menu_bot_sub:`7 niveles de dificultad`,menu_multi:`Multijugador`,menu_multi_sub:`2 a 4 jugadores • Parejas o Solo`,back:`← Volver`,lang_label:`Idioma`,energy_no:`⚡ ¡Sin energía! Espera la recarga o ve un anuncio.`,energy_recharged:`⚡ ¡Energía recargada!`,energy_unlimited:`∞`,diff_muito_facil:`Muy Fácil`,diff_facil:`Fácil`,diff_medio:`Medio`,diff_dificil:`Difícil`,diff_muito_dificil:`Muy Difícil`,diff_impossivel:`Imposible`,diff_impulsivo:`Impulsivo`,setup_difficulty:`Dificultad`,setup_grid:`Cuadrícula`,setup_players:`Jugadores`,setup_mode:`Modo`,setup_solo:`Solo (todos vs todos)`,setup_teams:`Parejas (2v2)`,setup_start:`Iniciar Partida`,game_turn:`Turno de {name}`,game_bot_thinking:`Bot pensando...`,stage_label:`Fase {id}`,vs_bot_label:`vs Bot — {diff}`,teams_2v2:`Parejas 2v2`,n_players:`{n} Jugadores`,team_a:`Equipo A`,team_b:`Equipo B`,stage_complete:`¡COMPLETA!`,next_stage:`Siguiente Fase →`,map:`📍 Mapa`,victory:`¡Victoria!`,won_suffix:`¡ganó!`,tie:`🤝 ¡Empate!`,new_game:`Nueva Partida`,xp_gained:`+{xp} XP`,you_lost:`¡Perdiste!`,try_again:`⚡ Intentar de nuevo`,watch_ad:`📺 Ver anuncio`,ad_label:`ANUNCIO`,ad_close_timer:`Cerrar ({n})`,ad_close_ready:`✓ Cerrar`,ad_text:`¡Descarga ahora el mejor juego!`,ad_cta:`JUGAR GRATIS`,god_mode:`👑 Modo Dios`,god_unlimited_energy:`Energía ilimitada`,god_go_stage:`Ir a fase específica`,god_go:`IR`,god_next:`⏭ Siguiente fase ({id})`,god_refill:`⚡ Recargar energía`,god_activated:`👑 ¡Modo Dios ACTIVADO!`,god_deactivated:`Modo Dios desactivado`,on_label:`ON`,off_label:`OFF`,player_n:`Jugador {n}`,you:`Tú`,bot:`Bot`,rank_master:`Maestro`,rank_diamond:`Diamante`,rank_plat_3:`Platino III`,rank_plat_2:`Platino II`,rank_plat_1:`Platino I`,rank_gold_3:`Oro III`,rank_gold_2:`Oro II`,rank_gold_1:`Oro I`,rank_silver_3:`Plata III`,rank_silver_2:`Plata II`,rank_silver_1:`Plata I`,rank_bronze_3:`Bronce III`,rank_bronze_2:`Bronce II`,rank_bronze_1:`Bronce I`,rank_beginner:`Principiante`},en:{settings:`Settings`,theme:`Theme`,theme_dark:`🌙 Dark`,theme_light:`☀️ Light`,multiplatform:`Multiplatform`,profile:`Profile`,tagline:`Connect • Close • Dominate`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} stages completed`,menu_bot:`vs Bot`,menu_bot_sub:`7 difficulty levels`,menu_multi:`Multiplayer`,menu_multi_sub:`2 to 4 players • Teams or Solo`,back:`← Back`,lang_label:`Language`,energy_no:`⚡ No energy! Wait for recharge or watch an ad.`,energy_recharged:`⚡ Energy recharged!`,energy_unlimited:`∞`,diff_muito_facil:`Very Easy`,diff_facil:`Easy`,diff_medio:`Medium`,diff_dificil:`Hard`,diff_muito_dificil:`Very Hard`,diff_impossivel:`Impossible`,diff_impulsivo:`Impulsive`,setup_difficulty:`Difficulty`,setup_grid:`Grid Size`,setup_players:`Players`,setup_mode:`Mode`,setup_solo:`Solo (all vs all)`,setup_teams:`Teams (2v2)`,setup_start:`Start Game`,game_turn:`{name}'s turn`,game_bot_thinking:`Bot thinking...`,stage_label:`Stage {id}`,vs_bot_label:`vs Bot — {diff}`,teams_2v2:`Teams 2v2`,n_players:`{n} Players`,team_a:`Team A`,team_b:`Team B`,stage_complete:`COMPLETE!`,next_stage:`Next Stage →`,map:`📍 Map`,victory:`Victory!`,won_suffix:`won!`,tie:`🤝 Tie!`,new_game:`New Game`,xp_gained:`+{xp} XP`,you_lost:`You lost!`,try_again:`⚡ Try Again`,watch_ad:`📺 Watch Ad`,ad_label:`AD`,ad_close_timer:`Close ({n})`,ad_close_ready:`✓ Close`,ad_text:`Download the best game now!`,ad_cta:`PLAY FREE`,god_mode:`👑 God Mode`,god_unlimited_energy:`Unlimited energy`,god_go_stage:`Go to specific stage`,god_go:`GO`,god_next:`⏭ Next stage ({id})`,god_refill:`⚡ Refill energy`,god_activated:`👑 God Mode ACTIVATED!`,god_deactivated:`God Mode deactivated`,on_label:`ON`,off_label:`OFF`,player_n:`Player {n}`,you:`You`,bot:`Bot`,rank_master:`Master`,rank_diamond:`Diamond`,rank_plat_3:`Platinum III`,rank_plat_2:`Platinum II`,rank_plat_1:`Platinum I`,rank_gold_3:`Gold III`,rank_gold_2:`Gold II`,rank_gold_1:`Gold I`,rank_silver_3:`Silver III`,rank_silver_2:`Silver II`,rank_silver_1:`Silver I`,rank_bronze_3:`Bronze III`,rank_bronze_2:`Bronze II`,rank_bronze_1:`Bronze I`,rank_beginner:`Beginner`}},ce={"muito-facil":`diff_muito_facil`,facil:`diff_facil`,medio:`diff_medio`,dificil:`diff_dificil`,"muito-dificil":`diff_muito_dificil`,impossivel:`diff_impossivel`,impulsivo:`diff_impulsivo`};function le(e){return S(ce[e])}var ue=[`muito-facil`,`facil`,`medio`,`dificil`,`muito-dificil`,`impossivel`,`impulsivo`];function C(e){return e[Math.floor(Math.random()*e.length)]}function w(t,n,r){return a(e(n,r)).filter(e=>t.lines[e]?.ownerId!==null).length}function de(e,t){return t.filter(t=>{let{gridSize:n}=e;return T(t,n).some(([t,n])=>w(e,t,n)===3)})}function fe(e,t){return t.filter(t=>{let{gridSize:n}=e;return!T(t,n).some(([t,n])=>w(e,t,n)===2)})}function T(e,t){let n=[],{from:r,to:i}=e;if(r.row===i.row){let e=r.row,i=r.col;e>0&&n.push([e-1,i]),e<t-1&&n.push([e,i])}else{let e=r.row,i=r.col;i>0&&n.push([e,i-1]),i<t-1&&n.push([e,i])}return n}function pe(e,t){let n=e.players.find(e=>e.id===t),r=e.players.find(e=>e.id!==t);return(n?.score??0)-(r?.score??0)}function E(e,t,n,r,i,a){if(e.status===`finished`||n===0)return pe(e,t);let o=p(e);if(o.length===0)return pe(e,t);let s=[...o].sort((t,n)=>{let r=+!!T(t,e.gridSize).some(([t,n])=>w(e,t,n)===3);return+!!T(n,e.gridSize).some(([t,n])=>w(e,t,n)===3)-r});if(a){let a=-1/0;for(let o of s){let s=d(e,o);if(!s.ok)continue;let c=s.value.currentPlayerId===t,l=E(s.value,t,n-1,r,i,c);if(a=Math.max(a,l),r=Math.max(r,l),i<=r)break}return a}else{let a=1/0;for(let o of s){let s=d(e,o);if(!s.ok)continue;let c=s.value.currentPlayerId===t,l=E(s.value,t,n-1,r,i,c);if(a=Math.min(a,l),i=Math.min(i,l),i<=r)break}return a}}function D(e,t,n){let r=p(e),i=r[0],a=-1/0;for(let o of r){let r=d(e,o);if(!r.ok)continue;let s=r.value.currentPlayerId===t,c=E(r.value,t,n-1,-1/0,1/0,s);c>a&&(a=c,i=o)}return i}function me(e,t){let n=p(e);if(n.length===0)throw Error(`Sem movimentos disponíveis`);let r=e.currentPlayerId;switch(t){case`muito-facil`:return C(n);case`facil`:{let t=de(e,n);return t.length>0&&Math.random()<.5?C(t):C(n)}case`medio`:{let t=de(e,n);if(t.length>0)return C(t);let r=fe(e,n);return r.length>0?C(r):C(n)}case`dificil`:return D(e,r,3);case`muito-dificil`:return D(e,r,6);case`impossivel`:return D(e,r,e.gridSize<=4?12:8);case`impulsivo`:return Math.random()<.4?D(e,r,8):C(n)}}function he(e){return{"muito-facil":300,facil:400,medio:500,dificil:700,"muito-dificil":900,impossivel:1200,impulsivo:200}[e]}var O=[{range:[1,10],gridSizes:[3],difficulty:`muito-facil`},{range:[11,25],gridSizes:[3,4],difficulty:`muito-facil`},{range:[26,50],gridSizes:[4],difficulty:`facil`},{range:[51,80],gridSizes:[4],difficulty:`facil`},{range:[81,120],gridSizes:[4,5],difficulty:`medio`},{range:[121,170],gridSizes:[5],difficulty:`medio`},{range:[171,230],gridSizes:[5],difficulty:`dificil`},{range:[231,300],gridSizes:[5,6],difficulty:`dificil`},{range:[301,380],gridSizes:[6],difficulty:`muito-dificil`},{range:[381,450],gridSizes:[6],difficulty:`muito-dificil`},{range:[451,490],gridSizes:[6],difficulty:`impossivel`},{range:[491,500],gridSizes:[6],difficulty:`impossivel`}];function ge(e,t){let n=(t-1)*(t-1),r=e%5;if(r===0)return{objectiveType:`dominance`,objectiveValue:60,stars:[`Vença`,`Feche ≥60% das caixas`,`Feche ≥75% das caixas`]};if(r===1){let t=Math.min(2+Math.floor(e/50),Math.floor(n/2));return{objectiveType:`margin`,objectiveValue:t,stars:[`Vença`,`Vença por ≥${t} caixas`,`Vença por ≥${t+2} caixas`]}}return r===2?{objectiveType:`chain`,objectiveValue:2,stars:[`Vença`,`Feche ≥2 caixas em um turno`,`Feche ≥3 caixas em um turno`]}:r===3?{objectiveType:`clean`,objectiveValue:0,stars:[`Vença`,`Vença sem dar caixas ao bot`,`Vença sem dar caixas com margem ≥3`]}:{objectiveType:`win`,objectiveValue:0,stars:[`Vença`,`Vença com ≥${Math.ceil(n*.5)} caixas`,`Vença com ≥${Math.ceil(n*.65)} caixas`]}}function _e(e){let t=O.find(t=>e>=t.range[0]&&e<=t.range[1])??O[O.length-1],n=t.gridSizes,r=n[e%n.length]??n[0],i=ge(e,r);return{id:e,gridSize:r,difficulty:t.difficulty,...i}}var ve=`dab_theme`;function ye(){return localStorage.getItem(ve)??`dark`}function be(e){localStorage.setItem(ve,e),document.documentElement.setAttribute(`data-theme`,e)}function xe(){document.documentElement.setAttribute(`data-theme`,ye())}var k=`dab_profile`;function A(){return{name:`Jogador`,xp:0,stageProgress:{}}}function j(){try{let e=localStorage.getItem(k);return e?JSON.parse(e):A()}catch{return A()}}function Se(e){localStorage.setItem(k,JSON.stringify(e))}function Ce(e,t,n,r){let i=j(),a=i.stageProgress[e];return i.stageProgress[e]={stars:Math.max(t,a?.stars??0),bestScore:Math.max(n,a?.bestScore??0)},i.xp+=r,Se(i),i}function we(e){let t=[{key:`rank_master`,icon:`👑`,min:15e4,next:1/0},{key:`rank_diamond`,icon:`🔷`,min:75e3,next:15e4},{key:`rank_plat_3`,icon:`💎`,min:5e4,next:75e3},{key:`rank_plat_2`,icon:`💎`,min:4e4,next:5e4},{key:`rank_plat_1`,icon:`💎`,min:3e4,next:4e4},{key:`rank_gold_3`,icon:`🥇`,min:2e4,next:3e4},{key:`rank_gold_2`,icon:`🥇`,min:15e3,next:2e4},{key:`rank_gold_1`,icon:`🥇`,min:1e4,next:15e3},{key:`rank_silver_3`,icon:`🥈`,min:6e3,next:1e4},{key:`rank_silver_2`,icon:`🥈`,min:3500,next:6e3},{key:`rank_silver_1`,icon:`🥈`,min:2500,next:3500},{key:`rank_bronze_3`,icon:`🥉`,min:1500,next:2500},{key:`rank_bronze_2`,icon:`🥉`,min:1e3,next:1500},{key:`rank_bronze_1`,icon:`🥉`,min:500,next:1e3},{key:`rank_beginner`,icon:`⚪`,min:0,next:500}],n=t.find(t=>e>=t.min)??t[t.length-1];return{rank:S(n.key),icon:n.icon,next:n.next}}var Te=6e4,M=`dab_energy`;function N(){try{let e=localStorage.getItem(M);if(!e)return 15;let t=JSON.parse(e),n=Math.floor((Date.now()-t.lastSaved)/Te);return Math.min(15,t.amount+n)}catch{return 15}}function Ee(e){localStorage.setItem(M,JSON.stringify({amount:e,lastSaved:Date.now()}))}function De(){let e=N();return e<=0?!1:(Ee(e-1),!0)}function Oe(){Ee(15)}var ke=`dab_god`;function Ae(){try{let e=localStorage.getItem(ke);return e?JSON.parse(e):{unlimitedEnergy:!1}}catch{return{unlimitedEnergy:!1}}}function je(e){localStorage.setItem(ke,JSON.stringify(e))}var Me=`v1.2.5`,P=null,F=null,I=Ae(),L=document.getElementById(`app`),R=[`#e74c3c`,`#3498db`,`#2ecc71`,`#f39c12`];xe();function Ne(){return[1,2,3,4].map(e=>S(`player_n`,{n:e}))}function z(e,t,n){let r=e.getBoundingClientRect();return{x:(t-r.left)*(e.width/r.width),y:(n-r.top)*(e.height/r.height)}}function Pe(e){let t=[{key:`rank_master`,icon:`👑`,min:15e4,next:1/0},{key:`rank_diamond`,icon:`🔷`,min:75e3,next:15e4},{key:`rank_plat_3`,icon:`💎`,min:5e4,next:75e3},{key:`rank_plat_2`,icon:`💎`,min:4e4,next:5e4},{key:`rank_plat_1`,icon:`💎`,min:3e4,next:4e4},{key:`rank_gold_3`,icon:`🥇`,min:2e4,next:3e4},{key:`rank_gold_2`,icon:`🥇`,min:15e3,next:2e4},{key:`rank_gold_1`,icon:`🥇`,min:1e4,next:15e3},{key:`rank_silver_3`,icon:`🥈`,min:6e3,next:1e4},{key:`rank_silver_2`,icon:`🥈`,min:3500,next:6e3},{key:`rank_silver_1`,icon:`🥈`,min:2500,next:3500},{key:`rank_bronze_3`,icon:`🥉`,min:1500,next:2500},{key:`rank_bronze_2`,icon:`🥉`,min:1e3,next:1500},{key:`rank_bronze_1`,icon:`🥉`,min:500,next:1e3},{key:`rank_beginner`,icon:`⚪`,min:0,next:500}],n=t.find(t=>e>=t.min)??t[t.length-1];return`
    <svg class="rank-ring-svg" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--ring-bg)" stroke-width="2.5"/>
      <circle cx="18" cy="18" r="15.9" fill="none"
        stroke="url(#rg)" stroke-width="2.5"
        stroke-dasharray="${(n.next===1/0?1:Math.min(1,(e-n.min)/(n.next-n.min)))*100} 100" stroke-linecap="round"
        transform="rotate(-90 18 18)"/>
      <defs>
        <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f39c12"/>
          <stop offset="100%" stop-color="#e74c3c"/>
        </linearGradient>
      </defs>
    </svg>
    <span class="rank-ring-icon">${n.icon}</span>`}function B(){let e=I.unlimitedEnergy?15:N(),t=e/15*100;return`
    <div class="energy-row">
      <span class="energy-bolt">⚡</span>
      <span class="energy-count">${I.unlimitedEnergy?`∞`:`${e}/15`}</span>
      <div class="e-dots-wrap">${Array.from({length:15},(t,n)=>`<span class="e-dot ${n<e?`full`:``}"></span>`).join(``)}</div>
      <div class="e-bar-wrap"><div class="e-bar-fill" style="width:${t}%"></div></div>
    </div>`}function Fe(e=3200){let t=document.createElement(`canvas`);Object.assign(t.style,{position:`fixed`,top:`0`,left:`0`,width:`100%`,height:`100%`,pointerEvents:`none`,zIndex:`998`}),t.width=window.innerWidth,t.height=window.innerHeight,document.body.appendChild(t);let n=t.getContext(`2d`),r=[`#e74c3c`,`#3498db`,`#2ecc71`,`#f39c12`,`#9b59b6`,`#1abc9c`,`#e67e22`,`#ff6b9d`],i=Array.from({length:160},()=>({x:Math.random()*t.width,y:-20-Math.random()*120,w:5+Math.random()*9,h:3+Math.random()*5,color:r[Math.floor(Math.random()*r.length)],vx:(Math.random()-.5)*3,vy:1.5+Math.random()*4,rot:Math.random()*Math.PI*2,drot:(Math.random()-.5)*.15,opacity:1})),a=Date.now();(function r(){let o=(Date.now()-a)/e;n.clearRect(0,0,t.width,t.height);for(let e of i)e.x+=e.vx,e.y+=e.vy,e.rot+=e.drot,o>.65&&(e.opacity=Math.max(0,1-(o-.65)/.35)),n.save(),n.globalAlpha=e.opacity,n.translate(e.x,e.y),n.rotate(e.rot),n.fillStyle=e.color,n.fillRect(-e.w/2,-e.h/2,e.w,e.h),n.restore();o<1?requestAnimationFrame(r):t.remove()})()}function V(e,t,n,r,i,a){Fe();let o=document.createElement(`div`);o.className=`cel-overlay`;let s=[0,1,2].map(t=>`<span class="cel-star ${t<e?`earned`:`empty`}" style="animation-delay:${.4+t*.25}s">★</span>`).join(``);o.innerHTML=`
    <div class="cel-card">
      <div class="cel-label">${n}</div>
      <div class="cel-title">${S(`stage_complete`)}</div>
      <div class="cel-stars">${s}</div>
      ${t>0?`<div class="cel-xp">${S(`xp_gained`,{xp:t})}</div>`:``}
      <div class="cel-actions" id="cel-actions">
        ${r?`<button class="btn-cel-next" id="btn-cel-next">${S(`next_stage`)}</button>`:``}
        <button class="btn-cel-map" id="btn-cel-map">${S(`map`)}</button>
      </div>
    </div>`,document.body.appendChild(o);let c=o.querySelector(`#cel-actions`);c.style.opacity=`0`,setTimeout(()=>{c.style.opacity=`1`,c.style.transition=`opacity 0.4s`},2200),o.querySelector(`#btn-cel-next`)?.addEventListener(`click`,()=>{o.remove(),i()}),o.querySelector(`#btn-cel-map`)?.addEventListener(`click`,()=>{o.remove(),a()})}function Ie(e,t,n){let r=document.createElement(`div`);r.className=`fail-overlay`,r.innerHTML=`
    <div class="fail-card">
      <div class="fail-emoji">😞</div>
      <div class="fail-title">${S(`you_lost`)}</div>
      <div class="fail-actions">
        <button class="btn-retry-pay" id="fr">${S(`try_again`)}</button>
        <button class="btn-ad" id="fa">${S(`watch_ad`)}</button>
        <button class="btn-cel-map" id="fm">${S(`map`)}</button>
      </div>
    </div>`,document.body.appendChild(r),r.querySelector(`#fr`)?.addEventListener(`click`,()=>{r.remove(),e()}),r.querySelector(`#fa`)?.addEventListener(`click`,()=>{r.remove(),t()}),r.querySelector(`#fm`)?.addEventListener(`click`,()=>{r.remove(),n()})}function Le(e){let t=document.createElement(`div`);t.className=`ad-overlay`,t.innerHTML=`
    <div class="ad-card">
      <div class="ad-top"><span class="ad-tag">${S(`ad_label`)}</span><span class="ad-timer" id="at">5</span></div>
      <div class="ad-mock"><div class="ad-logo">🎮</div><div class="ad-text">${S(`ad_text`)}</div><div class="ad-cta">${S(`ad_cta`)}</div></div>
      <div class="ad-progress-wrap"><div class="ad-progress" id="ap"></div></div>
      <button class="btn-close-ad" id="ac" disabled>${S(`ad_close_timer`,{n:5})}</button>
    </div>`,document.body.appendChild(t);let n=5,r=t.querySelector(`#at`),i=t.querySelector(`#ac`),a=t.querySelector(`#ap`);a.style.transition=`width ${n}s linear`,requestAnimationFrame(()=>{a.style.width=`100%`});let o=setInterval(()=>{n--,r.textContent=String(n),i.textContent=n>0?S(`ad_close_timer`,{n}):S(`ad_close_ready`),n<=0&&(clearInterval(o),i.disabled=!1,i.classList.add(`ready`))},1e3);i.addEventListener(`click`,()=>{t.remove(),e()})}function Re(){let e=ye(),t=document.createElement(`div`);t.className=`modal-overlay`,t.innerHTML=`
    <div class="modal-card">
      <div class="modal-header">
        <span>⚙ ${S(`settings`)}</span>
        <button class="modal-close" id="mc">✕</button>
      </div>
      <div class="settings-section">
        <label class="settings-label">${S(`theme`)}</label>
        <div class="theme-row">
          <button class="btn-theme-opt ${e===`dark`?`active`:``}" data-theme="dark">${S(`theme_dark`)}</button>
          <button class="btn-theme-opt ${e===`light`?`active`:``}" data-theme="light">${S(`theme_light`)}</button>
        </div>
      </div>
      <div class="settings-section">
        <label class="settings-label">${S(`lang_label`)}</label>
        <div class="lang-selector settings-lang">${Ve()}</div>
      </div>
      <div class="settings-version">${Me}</div>
    </div>`,document.body.appendChild(t),t.querySelector(`#mc`)?.addEventListener(`click`,()=>t.remove()),t.addEventListener(`click`,e=>{e.target===t&&t.remove()}),t.querySelectorAll(`.btn-theme-opt`).forEach(e=>{e.onclick=()=>{be(e.dataset.theme),t.remove(),J()}}),t.querySelectorAll(`.btn-lang`).forEach(e=>{e.onclick=()=>{oe(e.dataset.lang),t.remove(),J()}})}function ze(e){let t=document.createElement(`div`);t.className=`modal-overlay`,t.innerHTML=`
    <div class="modal-card god-card">
      <div class="modal-header"><span>${S(`god_mode`)}</span><button class="modal-close" id="gc">✕</button></div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${S(`god_unlimited_energy`)}</label>
          <button class="god-toggle ${I.unlimitedEnergy?`on`:``}" id="ge">${I.unlimitedEnergy?S(`on_label`):S(`off_label`)}</button>
        </div>
      </div>
      <div class="settings-section">
        <label class="settings-label">${S(`god_go_stage`)}</label>
        <div class="god-input-row">
          <input class="god-input" id="gs" type="number" min="1" max="500" placeholder="1-500" value="${e??1}" />
          <button class="god-go" id="gg">${S(`god_go`)}</button>
        </div>
      </div>
      ${e?`<button class="god-skip" id="gsk">${S(`god_next`,{id:e+1})}</button>`:``}
      <button class="god-refill" id="gr">${S(`god_refill`)}</button>
    </div>`,document.body.appendChild(t),t.querySelector(`#gc`)?.addEventListener(`click`,()=>t.remove()),t.addEventListener(`click`,e=>{e.target===t&&t.remove()});let n=t.querySelector(`#ge`);n.addEventListener(`click`,()=>{I.unlimitedEnergy=!I.unlimitedEnergy,je(I),n.textContent=I.unlimitedEnergy?S(`on_label`):S(`off_label`),n.classList.toggle(`on`,I.unlimitedEnergy),W()}),t.querySelector(`#gr`)?.addEventListener(`click`,()=>{Oe(),W(),H(S(`energy_recharged`))}),t.querySelector(`#gg`)?.addEventListener(`click`,()=>{let e=parseInt(t.querySelector(`#gs`).value,10);e>=1&&e<=500&&(t.remove(),P=null,F=null,X(e,!0))}),t.querySelector(`#gsk`)?.addEventListener(`click`,()=>{e&&(t.remove(),P=null,F=null,X(e+1,!0))})}function H(e){document.querySelectorAll(`.toast`).forEach(e=>e.remove());let t=document.createElement(`div`);t.className=`toast`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>{t.classList.add(`show`)}),setTimeout(()=>{t.classList.remove(`show`),setTimeout(()=>t.remove(),400)},2200)}var U=null;function W(){document.querySelectorAll(`#energy-display`).forEach(e=>{e.innerHTML=B()})}function Be(){U&&clearInterval(U),U=setInterval(W,15e3)}function G(){U&&=(clearInterval(U),null)}function Ve(){let e=ae();return Object.entries(x).map(([t,n])=>`<button class="btn-lang ${t===e?`active`:``}" data-lang="${t}">${n}</button>`).join(``)}function He(){return`<div class="lang-selector">${Ve()}</div>`}function Ue(e=document){e.querySelectorAll(`.btn-lang`).forEach(e=>{e.onclick=()=>{oe(e.dataset.lang),J()}})}var K=0,q=null;function J(){G(),P=null,F=null;let e=j(),t=we(e.xp),n=Object.values(e.stageProgress).filter(e=>e.stars>0).length,r=n===0;L.innerHTML=`
    <div class="screen menu-screen">

      <div class="topbar">
        <div></div>
        <div class="topbar-right">
          <button class="btn-settings-pill" id="btn-settings">⚙ ${S(`settings`)}</button>
          <button class="btn-profile-icon" id="btn-profile" title="${S(`profile`)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </button>
        </div>
      </div>

      <div class="menu-logo" id="menu-title">
        <h1>Dots &amp; Boxes</h1>
        <p class="menu-tagline">${S(`tagline`)}</p>
      </div>

      <div class="rank-card">
        <div class="rank-ring-wrap">
          ${Pe(e.xp)}
        </div>
        <div class="rank-info">
          <span class="rank-name">${t.rank}</span>
          <span class="rank-xp">${e.xp.toLocaleString()} XP</span>
        </div>
        ${I.unlimitedEnergy?`<button class="btn-god-ring" id="btn-god-menu">👑</button>`:``}
      </div>

      <div id="energy-display">${B()}</div>

      <div class="menu-buttons">
        <button class="btn-menu btn-arcade" id="btn-arcade">
          <div class="btn-menu-icon">🕹️</div>
          <div class="btn-menu-text">
            <strong>${S(`menu_arcade`)}</strong>
            <small>${S(`menu_arcade_sub`,{done:n,total:50})}</small>
          </div>
          ${r?`<span class="badge-new">NEW</span>`:``}
        </button>
        <button class="btn-menu btn-bot" id="btn-bot">
          <div class="btn-menu-icon">🤖</div>
          <div class="btn-menu-text">
            <strong>${S(`menu_bot`)}</strong>
            <small>${S(`menu_bot_sub`)}</small>
          </div>
        </button>
        <button class="btn-menu btn-multi" id="btn-multi">
          <div class="btn-menu-icon">👥</div>
          <div class="btn-menu-text">
            <strong>${S(`menu_multi`)}</strong>
            <small>${S(`menu_multi_sub`)}</small>
          </div>
        </button>
      </div>

      ${He()}

      <div class="bottom-bar">
        <div class="platform-icons">
          <span>🖥 PC</span>
          <span>🤖 Android</span>
          <span>📱 iOS</span>
        </div>
        <div class="platform-label">${S(`multiplatform`)}</div>
        <div class="bottom-star">✦</div>
        <div class="version-tag">${Me}</div>
      </div>

    </div>`,Be(),document.getElementById(`btn-arcade`).onclick=Y,document.getElementById(`btn-bot`).onclick=We,document.getElementById(`btn-multi`).onclick=Ge,document.getElementById(`btn-settings`).onclick=Re,document.getElementById(`btn-profile`)?.addEventListener(`click`,()=>H(`👤 `+S(`profile`)+` — em breve!`)),document.getElementById(`btn-god-menu`)?.addEventListener(`click`,()=>ze()),Ue(),document.getElementById(`menu-title`).addEventListener(`click`,()=>{K++,q&&clearTimeout(q),q=setTimeout(()=>{K=0},3e3),K>=7&&(K=0,I.unlimitedEnergy=!I.unlimitedEnergy,je(I),H(I.unlimitedEnergy?S(`god_activated`):S(`god_deactivated`)),J())})}function Y(){G();let e=j(),t=``;for(let n=1;n<=50;n++){let r=e.stageProgress[n]?.stars??0,i=n===1||(e.stageProgress[n-1]?.stars??0)>0,a=`★`.repeat(r)+`☆`.repeat(3-r);t+=`<button class="stage-cell ${i?`unlocked`:`locked`} stars-${r}" data-stage="${n}" ${i?``:`disabled`}>
      <span class="stage-num">${n}</span><span class="stage-stars">${a}</span></button>`}L.innerHTML=`
    <div class="screen arcade-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${S(`back`)}</button>
        <h2>🕹️ Arcade</h2>
        <div id="energy-display" style="font-size:.75rem">${B()}</div>
      </div>
      <div class="stage-grid">${t}</div>
    </div>`,Be(),document.getElementById(`btn-back`).onclick=J,document.querySelectorAll(`.stage-cell.unlocked`).forEach(e=>{e.onclick=()=>X(parseInt(e.dataset.stage,10))})}function We(){G(),L.innerHTML=`
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${S(`back`)}</button>
        <h2>🤖 ${S(`menu_bot`)}</h2>
      </div>
      <div class="setup-section">
        <label class="setup-label">${S(`setup_difficulty`)}</label>
        <div class="diff-grid">${ue.map(e=>`<button class="btn-diff" data-diff="${e}">${le(e)}</button>`).join(``)}</div>
      </div>
      <div class="setup-section">
        <label class="setup-label">${S(`setup_grid`)}</label>
        <div class="grid-size-row">${[3,4,5,6].map(e=>`<button class="btn-grid-size" data-size="${e}">${e}×${e}</button>`).join(``)}</div>
      </div>
      <button class="btn-start" id="btn-start" disabled>${S(`setup_start`)}</button>
    </div>`,document.getElementById(`btn-back`).onclick=J;let e=null,t=4;document.querySelector(`[data-size="4"]`).classList.add(`selected`),document.querySelectorAll(`.btn-diff`).forEach(t=>{t.onclick=()=>{document.querySelectorAll(`.btn-diff`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),e=t.dataset.diff,document.getElementById(`btn-start`).disabled=!1}}),document.querySelectorAll(`.btn-grid-size`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-grid-size`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),t=parseInt(e.dataset.size,10)}}),document.getElementById(`btn-start`).onclick=()=>{e&&Z(e,t)}}function Ge(){G(),L.innerHTML=`
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${S(`back`)}</button>
        <h2>👥 ${S(`menu_multi`)}</h2>
      </div>
      <div class="setup-section">
        <label class="setup-label">${S(`setup_players`)}</label>
        <div class="grid-size-row">${[2,3,4].map(e=>`<button class="btn-player-count" data-count="${e}">${e}</button>`).join(``)}</div>
      </div>
      <div class="setup-section" id="team-section" style="display:none">
        <label class="setup-label">${S(`setup_mode`)}</label>
        <div class="grid-size-row">
          <button class="btn-team-mode selected" data-team="false">${S(`setup_solo`)}</button>
          <button class="btn-team-mode" data-team="true">${S(`setup_teams`)}</button>
        </div>
      </div>
      <div class="setup-section">
        <label class="setup-label">${S(`setup_grid`)}</label>
        <div class="grid-size-row">${[3,4,5,6].map(e=>`<button class="btn-grid-size" data-size="${e}">${e}×${e}</button>`).join(``)}</div>
      </div>
      <button class="btn-start" id="btn-start" disabled>${S(`setup_start`)}</button>
    </div>`,document.getElementById(`btn-back`).onclick=J;let e=0,t=!1,n=4;document.querySelector(`[data-size="4"]`).classList.add(`selected`),document.querySelectorAll(`.btn-player-count`).forEach(t=>{t.onclick=()=>{document.querySelectorAll(`.btn-player-count`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),e=parseInt(t.dataset.count,10),document.getElementById(`team-section`).style.display=e===4?`block`:`none`,document.getElementById(`btn-start`).disabled=!1}}),document.querySelectorAll(`.btn-team-mode`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-team-mode`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),t=e.dataset.team===`true`}}),document.querySelectorAll(`.btn-grid-size`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-grid-size`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),n=parseInt(e.dataset.size,10)}}),document.getElementById(`btn-start`).onclick=()=>{e&&Ke(e,t,n)}}function X(e,t=!1){if(!t&&!I.unlimitedEnergy&&!De()){H(S(`energy_no`));return}let n=_e(e);P={mode:`arcade`,stageId:e,botDifficulty:n.difficulty,controller:new m({gridSize:n.gridSize,players:[{name:S(`you`),color:R[0]},{name:S(`bot`),color:R[1]}]}),botPlayerId:`p2`,botThinking:!1,freeRetry:!1},Q()}function Z(e,t){P={mode:`vs-bot`,botDifficulty:e,controller:new m({gridSize:t,players:[{name:S(`you`),color:R[0]},{name:S(`bot`),color:R[1]}]}),botPlayerId:`p2`,botThinking:!1,freeRetry:!1},Q()}function Ke(e,t,n){let r=Ne();P={mode:`multi`,teamMode:t,playerCount:e,controller:new m({gridSize:n,players:Array.from({length:e},(e,t)=>({name:r[t],color:R[t]}))}),botThinking:!1,freeRetry:!1},Q()}function Q(){if(!P)return;let e=P;G(),L.innerHTML=`
    <div class="screen game-screen">
      <div class="game-topbar">
        <button class="btn-back-sm" id="btn-back">✕</button>
        <span class="game-mode-label">${e.mode===`arcade`?S(`stage_label`,{id:e.stageId}):e.mode===`vs-bot`?S(`vs_bot_label`,{diff:le(e.botDifficulty)}):e.teamMode?S(`teams_2v2`):S(`n_players`,{n:e.playerCount})}</span>
        <button class="btn-god-corner" id="btn-god-game">👑</button>
      </div>
      <div id="scoreboard" class="scoreboard"></div>
      <div id="status" class="status"></div>
      <div class="canvas-wrapper"><canvas id="board"></canvas></div>
    </div>`,document.getElementById(`btn-back`).onclick=()=>{P=null,F=null,e.mode===`arcade`?Y():e.mode===`vs-bot`?We():Ge()},document.getElementById(`btn-god-game`).onclick=()=>ze(e.stageId);let t=document.getElementById(`board`),n=t.getContext(`2d`);function i(){let r=e.controller.getState(),{width:i,height:o}=y(r.gridSize);t.width=i,t.height=o,re(n,r,F,e.teamMode??!1),a()}function a(){let t=e.controller.getState(),n=document.getElementById(`scoreboard`),r=document.getElementById(`status`);if(!(!n||!r)){if(e.teamMode&&e.playerCount===4){let e=t.players.filter((e,t)=>t%2==0).reduce((e,t)=>e+t.score,0),r=t.players.filter((e,t)=>t%2==1).reduce((e,t)=>e+t.score,0);n.innerHTML=`<div class="team-chip" style="--pc:${R[0]}">${S(`team_a`)} <strong>${e}</strong></div><div class="team-chip" style="--pc:${R[1]}">${S(`team_b`)} <strong>${r}</strong></div>`}else n.innerHTML=t.players.map(e=>`<div class="player-chip ${e.id===t.currentPlayerId&&t.status===`playing`?`player-chip--active`:``}" style="--pc:${e.color}"><span class="player-dot"></span><span class="player-name">${e.name}</span><span class="player-score">${e.score}</span></div>`).join(``);if(t.status===`finished`)r.textContent=``,o();else if(e.botThinking)r.textContent=S(`game_bot_thinking`),r.style.color=`var(--text-2)`;else{let e=t.players.find(e=>e.id===t.currentPlayerId);r.textContent=S(`game_turn`,{name:e.name}),r.style.color=e.color}}}function o(){let t=e.controller.getState(),n=Math.max(...t.players.map(e=>e.score));if(e.mode===`arcade`&&e.stageId!=null){let n=_e(e.stageId),r=t.players.find(t=>t.id!==e.botPlayerId),i=t.players.find(t=>t.id===e.botPlayerId);if(r.score>i.score){let t=1,a=100;(n.objectiveType===`margin`&&r.score-i.score>=n.objectiveValue||n.objectiveType===`dominance`&&r.score/(n.gridSize-1)**2>=n.objectiveValue/100)&&(t=2,a+=50),t===2&&n.objectiveType===`margin`&&r.score-i.score>=n.objectiveValue+2&&(t=3,a+=50),Ce(e.stageId,t,r.score*100,a);let o=e.stageId<50?e.stageId+1:null;V(t,a,S(`stage_label`,{id:e.stageId}),o,()=>{o?X(o):Y()},()=>{P=null,F=null,Y()})}else Ie(()=>{if(!I.unlimitedEnergy&&!De()){H(S(`energy_no`));return}P=null,F=null,X(e.stageId,!0)},()=>Le(()=>{P=null,F=null,X(e.stageId,!0)}),()=>{P=null,F=null,Y()})}else if(e.mode===`vs-bot`)t.players.find(t=>t.id!==e.botPlayerId).score===n?V(1,60,S(`victory`),null,()=>Z(e.botDifficulty,t.gridSize),J):Ie(()=>Z(e.botDifficulty,t.gridSize),()=>Le(()=>Z(e.botDifficulty,t.gridSize)),J);else{let r=t.players.filter(e=>e.score===n);V(3,80,r.length===1?`${r[0].name} ${S(`won_suffix`)}`:S(`tie`),null,()=>Ke(e.playerCount,e.teamMode,t.gridSize),J)}}function s(){return!!e.botPlayerId&&e.controller.getState().currentPlayerId===e.botPlayerId}function c(){e.botDifficulty&&(e.botThinking=!0,a(),setTimeout(()=>{if(!P||P!==e)return;let t=e.controller.getState();t.status===`finished`||!s()||(e.controller.playLine(me(t,e.botDifficulty)),e.botThinking=!1,i(),s()&&e.controller.getState().status!==`finished`&&c())},he(e.botDifficulty)))}function l(t){e.controller.getState().status===`finished`||e.botThinking||s()||t.ownerId!==null||(e.controller.playLine(t),F=null,i(),s()&&e.controller.getState().status!==`finished`&&c())}t.addEventListener(`mousemove`,n=>{let a=e.controller.getState();if(a.status===`finished`||e.botThinking||s())return;let{x:o,y:c}=z(t,n.clientX,n.clientY),l=b(a,o,c),u=l?.ownerId===null?l:null;(F?r(F):null)!==(u?r(u):null)&&(F=u,i()),t.style.cursor=F?`pointer`:`default`}),t.addEventListener(`mouseleave`,()=>{F=null,i(),t.style.cursor=`default`}),t.addEventListener(`click`,n=>{let{x:r,y:i}=z(t,n.clientX,n.clientY),a=b(e.controller.getState(),r,i);a&&l(a)}),t.addEventListener(`touchend`,n=>{n.preventDefault();let r=n.changedTouches[0];if(!r)return;let{x:i,y:a}=z(t,r.clientX,r.clientY),o=b(e.controller.getState(),i,a);o&&l(o)},{passive:!1}),i(),s()&&c()}var $=document.createElement(`style`);$.textContent=`
/* ── Variáveis de tema ─────────────────────────────────────────── */
:root, html[data-theme="dark"] {
  --bg:            #0d1117;
  --bg-2:          #161c27;
  --bg-3:          #1c2535;
  --border:        rgba(255,255,255,0.08);
  --border-strong: rgba(255,255,255,0.14);
  --text:          #e6edf3;
  --text-2:        #8d96a0;
  --text-3:        #555f6d;
  --shadow:        0 4px 24px rgba(0,0,0,0.5);
  --ring-bg:       rgba(255,255,255,0.1);
  --btn-bg:        rgba(255,255,255,0.04);
  --arcade-border: linear-gradient(135deg,#ec4899,#8b5cf6,#06b6d4);
  --arcade-glow:   0 0 24px rgba(139,92,246,0.25), 0 0 48px rgba(236,72,153,0.1);
  --title-gradient:linear-gradient(135deg,#f97316 0%,#a855f7 50%,#06b6d4 100%);
}
html[data-theme="light"] {
  --bg:            #d8e4f0;
  --bg-2:          #ffffff;
  --bg-3:          #eef2f8;
  --border:        rgba(0,0,0,0.08);
  --border-strong: rgba(0,0,0,0.16);
  --text:          #1a202c;
  --text-2:        #4a5568;
  --text-3:        #8896a0;
  --shadow:        0 2px 12px rgba(0,0,0,0.08);
  --ring-bg:       rgba(0,0,0,0.1);
  --btn-bg:        #ffffff;
  --arcade-border: linear-gradient(135deg,#3b82f6,#6366f1);
  --arcade-glow:   0 0 16px rgba(59,130,246,0.15);
  --title-gradient:none;
}

/* ── Reset & Base ──────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: system-ui, -apple-system, sans-serif;
  background: var(--bg);
  min-height: 100dvh;
  display: flex; align-items: center; justify-content: center;
  color: var(--text);
  transition: background 0.3s, color 0.3s;
}

/* Padrão de fundo */
body::before {
  content: '';
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
}
html[data-theme="dark"] body::before {
  background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1.5px, transparent 1.5px);
  background-size: 28px 28px;
}
html[data-theme="light"] body::before {
  background-image:
    linear-gradient(45deg, rgba(0,0,0,0.035) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(0,0,0,0.035) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.035) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.035) 75%);
  background-size: 18px 18px;
  background-position: 0 0, 0 9px, 9px -9px, -9px 0;
}

#app { width: 100%; max-width: 560px; position: relative; z-index: 1; }

.screen {
  display: flex; flex-direction: column; align-items: center;
  gap: 16px; padding: 16px 20px 24px; min-height: 100dvh; width: 100%;
}

/* ── TOPBAR ──────────────────────────────────────────────────── */
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; padding-top: 4px;
}
.topbar-right { display: flex; align-items: center; gap: 10px; }
.btn-settings-pill {
  display: flex; align-items: center; gap: 6px;
  background: var(--bg-2); border: 1px solid var(--border-strong);
  border-radius: 20px; padding: 7px 14px; color: var(--text-2);
  cursor: pointer; font-size: .82rem; font-weight: 600;
  transition: all .15s; backdrop-filter: blur(8px);
}
.btn-settings-pill:hover { background: var(--bg-3); color: var(--text); }
.btn-profile-icon {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--bg-2); border: 1px solid var(--border-strong);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-2); transition: all .15s;
}
.btn-profile-icon:hover { background: var(--bg-3); color: var(--text); }
.btn-profile-icon svg { width: 18px; height: 18px; }

/* ── MENU ────────────────────────────────────────────────────── */
.menu-screen { justify-content: flex-start; padding-top: 12px; gap: 18px; }
.menu-logo { cursor: pointer; user-select: none; text-align: center; }
.menu-logo h1 {
  font-size: 2.4rem; font-weight: 900; letter-spacing: -1px;
  background: var(--title-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
html[data-theme="light"] .menu-logo h1 {
  background: none; -webkit-text-fill-color: #1e293b; color: #1e293b;
  font-weight: 900;
}
.menu-tagline { color: var(--text-2); font-size: .88rem; margin-top: 2px; }

/* ── RANK CARD ───────────────────────────────────────────────── */
.rank-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--bg-2); border: 1px solid var(--border-strong);
  border-radius: 16px; padding: 12px 20px;
  box-shadow: var(--shadow); transition: background .3s;
}
.rank-ring-wrap {
  position: relative; width: 54px; height: 54px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.rank-ring-svg { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(0deg); }
.rank-ring-icon { font-size: 1.6rem; position: relative; z-index: 1; }
.rank-info { display: flex; flex-direction: column; gap: 2px; }
.rank-name { font-size: 1.05rem; font-weight: 800; color: var(--text); }
.rank-xp   { font-size: .8rem; color: var(--text-2); }
.btn-god-ring {
  margin-left: auto; background: none; border: none;
  font-size: 1.1rem; cursor: pointer; opacity: .7;
}
.btn-god-ring:hover { opacity: 1; }

/* ── ENERGIA ─────────────────────────────────────────────────── */
.energy-row {
  display: flex; align-items: center; gap: 10px;
  width: 100%; justify-content: center;
}
.energy-bolt { font-size: 1.1rem; }
.energy-count { font-weight: 800; color: #3b9df8; font-size: .9rem; min-width: 36px; }
.e-dots-wrap { display: flex; gap: 3px; flex-wrap: wrap; max-width: 160px; }
.e-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border-strong); flex-shrink: 0; transition: background .2s; }
.e-dot.full { background: #3b9df8; box-shadow: 0 0 5px #3b9df866; }
.e-bar-wrap { display: none; flex: 1; max-width: 180px; height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
.e-bar-fill { height: 100%; background: #3b9df8; border-radius: 4px; transition: width .3s; }
html[data-theme="light"] .e-dots-wrap { display: none; }
html[data-theme="light"] .e-bar-wrap  { display: block; }

/* ── MENU BUTTONS ────────────────────────────────────────────── */
.menu-buttons { display: flex; flex-direction: column; gap: 10px; width: 100%; }

.btn-menu {
  display: flex; align-items: center; gap: 16px;
  background: var(--btn-bg); border: 1px solid var(--border);
  border-radius: 16px; padding: 14px 18px;
  cursor: pointer; color: var(--text); text-align: left;
  transition: all .15s; width: 100%; position: relative;
  overflow: hidden;
}
.btn-menu:hover { background: var(--bg-3); border-color: var(--border-strong); }
.btn-menu:active { transform: scale(.985); }
.btn-menu-icon { font-size: 1.8rem; flex-shrink: 0; }
.btn-menu-text strong { font-size: .98rem; display: block; font-weight: 700; }
.btn-menu-text small  { font-size: .76rem; color: var(--text-2); }

/* Arcade — gradient border */
.btn-arcade {
  border: 1.5px solid transparent;
  background: linear-gradient(var(--bg-2), var(--bg-2)) padding-box,
              var(--arcade-border) border-box;
  box-shadow: var(--arcade-glow);
}
.btn-arcade:hover { box-shadow: var(--arcade-glow), 0 2px 12px rgba(0,0,0,.2); }

html[data-theme="light"] .btn-arcade {
  background: #fff padding-box, linear-gradient(135deg,#3b82f6,#6366f1) border-box;
}
html[data-theme="light"] .btn-bot,
html[data-theme="light"] .btn-multi { background: #fff; }

.badge-new {
  position: absolute; top: 10px; right: 12px;
  background: #06b6d4; color: #fff;
  font-size: .62rem; font-weight: 800;
  padding: 3px 8px; border-radius: 20px; letter-spacing: .5px;
}

/* ── IDIOMA ──────────────────────────────────────────────────── */
.lang-selector { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
.btn-lang {
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: 20px; padding: 6px 12px; color: var(--text-2);
  cursor: pointer; font-size: .78rem; font-weight: 600;
  transition: all .15s; white-space: nowrap;
}
.btn-lang:hover { border-color: var(--border-strong); color: var(--text); }
.btn-lang.active { background: rgba(59,157,248,0.15); border-color: #3b9df8; color: #3b9df8; }

/* ── BOTTOM BAR ──────────────────────────────────────────────── */
.bottom-bar {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  margin-top: auto; padding-top: 8px; width: 100%;
  position: relative;
}
.platform-icons { display: flex; gap: 16px; font-size: .78rem; color: var(--text-3); }
.platform-label { font-size: .72rem; color: var(--text-3); }
.bottom-star {
  position: absolute; right: 0; bottom: 2px;
  font-size: 1.3rem; color: var(--text-3); opacity: .5;
  font-family: serif;
}
.version-tag {
  position: absolute; right: 0; top: 0;
  font-size: .68rem; color: var(--text-3);
}

/* ── HEADER (outras telas) ───────────────────────────────────── */
.screen-header {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; gap: 10px; padding-bottom: 4px;
}
.screen-header h2 { font-size: 1.1rem; font-weight: 800; color: var(--text); }
.btn-back {
  background: var(--bg-2); border: 1px solid var(--border-strong);
  border-radius: 10px; padding: 8px 14px; color: var(--text-2);
  cursor: pointer; font-size: .84rem; font-weight: 600;
  transition: all .15s; white-space: nowrap;
}
.btn-back:hover { background: var(--bg-3); color: var(--text); }
.btn-god-corner {
  background: var(--bg-2); border: 1px solid rgba(243,156,18,.3);
  border-radius: 10px; padding: 6px 10px; color: #f39c12;
  cursor: pointer; font-size: .95rem; transition: all .15s;
}
.btn-god-corner:hover { background: var(--bg-3); }

/* ── ARCADE MAP ──────────────────────────────────────────────── */
.stage-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 8px; width: 100%; padding-bottom: 24px; }
.stage-cell {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: 12px;
  padding: 8px 4px; cursor: pointer; color: var(--text);
  display: flex; flex-direction: column; align-items: center; gap: 2px; transition: all .15s;
}
.stage-cell:disabled { opacity: .3; cursor: not-allowed; }
.stage-cell.unlocked:hover { background: var(--bg-3); border-color: var(--border-strong); }
.stage-cell.stars-3 { border-color: rgba(243,156,18,.5); }
.stage-cell.stars-2 { border-color: rgba(59,157,248,.4); }
.stage-cell.stars-1 { border-color: rgba(46,204,113,.4); }
.stage-num { font-size: .85rem; font-weight: 700; }
.stage-stars { font-size: .6rem; color: #f39c12; }

/* ── SETUP ───────────────────────────────────────────────────── */
.setup-screen { gap: 20px; }
.setup-section { width: 100%; }
.setup-label { font-size: .72rem; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; }
.diff-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 8px; }
.btn-diff, .btn-grid-size, .btn-player-count, .btn-team-mode {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: 10px;
  padding: 12px; color: var(--text); cursor: pointer; font-size: .875rem;
  transition: all .1s; text-align: center; font-weight: 600;
}
.btn-diff:hover, .btn-grid-size:hover, .btn-player-count:hover, .btn-team-mode:hover { background: var(--bg-3); }
.btn-diff.selected, .btn-grid-size.selected, .btn-player-count.selected, .btn-team-mode.selected {
  background: rgba(59,157,248,.15); border-color: #3b9df8; color: #3b9df8;
}
.grid-size-row { display: flex; gap: 8px; flex-wrap: wrap; }
.grid-size-row > * { flex: 1; min-width: 70px; }
.btn-start {
  background: #3b9df8; border: none; border-radius: 12px; padding: 14px;
  color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer; width: 100%;
  margin-top: 8px; transition: all .15s; box-shadow: 0 4px 16px rgba(59,157,248,.3);
}
.btn-start:hover:not(:disabled) { background: #2980b9; }
.btn-start:disabled { opacity: .4; cursor: not-allowed; box-shadow: none; }

/* ── JOGO ────────────────────────────────────────────────────── */
.game-screen { padding: 10px 16px 20px; gap: 10px; }
.game-topbar { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.btn-back-sm { background: var(--bg-2); border: 1px solid var(--border-strong); border-radius: 8px; padding: 6px 12px; color: var(--text-2); cursor: pointer; font-size: .9rem; transition: all .15s; }
.btn-back-sm:hover { background: var(--bg-3); }
.game-mode-label { font-size: .82rem; color: var(--text-2); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 200px; }
.scoreboard { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
.player-chip { display: flex; align-items: center; gap: 7px; background: var(--bg-2); border: 2px solid var(--border); border-radius: 40px; padding: 7px 14px; font-size: .88rem; transition: border-color .15s; }
.player-chip--active { border-color: var(--pc); box-shadow: 0 0 0 3px color-mix(in srgb, var(--pc) 18%, transparent); }
.player-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--pc); flex-shrink: 0; }
.player-name { font-weight: 600; }
.player-score { font-weight: 800; color: var(--pc); }
.team-chip { background: var(--bg-2); border: 2px solid var(--pc); border-radius: 10px; padding: 8px 16px; font-weight: 700; }
.status { font-size: .92rem; font-weight: 600; min-height: 1.4em; transition: color .2s; }
.canvas-wrapper { width: 100%; display: flex; justify-content: center; }
canvas { max-width: 100%; height: auto; border-radius: 14px; background: #fff; box-shadow: var(--shadow); touch-action: none; display: block; }

/* ── MODAL (Settings + God Mode) ────────────────────────────── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; z-index: 700; backdrop-filter: blur(6px); animation: fadeIn .2s; }
.modal-card { background: var(--bg-2); border: 1px solid var(--border-strong); border-radius: 20px; padding: 24px; width: 320px; display: flex; flex-direction: column; gap: 20px; box-shadow: 0 20px 60px rgba(0,0,0,.4); }
.modal-header { display: flex; justify-content: space-between; align-items: center; font-size: 1.05rem; font-weight: 800; color: var(--text); }
.modal-close { background: none; border: none; color: var(--text-2); cursor: pointer; font-size: 1.1rem; padding: 4px; border-radius: 6px; }
.modal-close:hover { background: var(--bg-3); }
.settings-section { display: flex; flex-direction: column; gap: 10px; }
.settings-label { font-size: .72rem; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 1px; }
.theme-row { display: flex; gap: 8px; }
.btn-theme-opt { flex: 1; background: var(--bg-3); border: 1px solid var(--border); border-radius: 10px; padding: 10px; color: var(--text-2); cursor: pointer; font-size: .88rem; font-weight: 600; transition: all .15s; }
.btn-theme-opt:hover { border-color: var(--border-strong); color: var(--text); }
.btn-theme-opt.active { background: rgba(59,157,248,.15); border-color: #3b9df8; color: #3b9df8; }
.settings-version { font-size: .72rem; color: var(--text-3); text-align: center; }
.settings-lang { margin-top: 0; }

/* God Mode */
.god-card { border-color: rgba(243,156,18,.3); }
.god-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.god-label { font-size: .88rem; color: var(--text-2); font-weight: 600; }
.god-toggle { background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: 8px; padding: 7px 16px; color: var(--text-2); font-weight: 700; cursor: pointer; transition: all .15s; font-size: .85rem; }
.god-toggle.on { background: rgba(243,156,18,.15); border-color: #f39c12; color: #f39c12; }
.god-input-row { display: flex; gap: 8px; }
.god-input { background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: 8px; padding: 8px 12px; color: var(--text); font-size: .9rem; width: 90px; outline: none; }
.god-input:focus { border-color: #3b9df8; }
.god-go { background: #3b9df8; border: none; border-radius: 8px; padding: 8px 14px; color: #fff; font-weight: 700; cursor: pointer; font-size: .85rem; }
.god-skip { background: rgba(155,89,182,.15); border: 1px solid #9b59b6; border-radius: 10px; padding: 10px; color: #9b59b6; font-weight: 700; cursor: pointer; width: 100%; text-align: center; font-size: .88rem; }
.god-skip:hover { background: rgba(155,89,182,.25); }
.god-refill { background: rgba(243,156,18,.1); border: 1px solid rgba(243,156,18,.4); border-radius: 10px; padding: 10px; color: #f39c12; font-weight: 700; cursor: pointer; width: 100%; text-align: center; font-size: .88rem; }
.god-refill:hover { background: rgba(243,156,18,.2); }

/* ── CELEBRAÇÃO ──────────────────────────────────────────────── */
.cel-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.88); display: flex; align-items: center; justify-content: center; z-index: 500; animation: fadeIn .3s; }
.cel-card { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; padding: 16px; }
.cel-label { font-size: .95rem; color: var(--text-2); font-weight: 600; animation: fadeInUp .5s .1s both; }
.cel-title { font-size: 3.5rem; font-weight: 900; letter-spacing: -1px; background: linear-gradient(135deg,#f39c12,#e74c3c,#9b59b6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: bounceIn .7s .2s both; }
.cel-stars { display: flex; gap: 10px; }
.cel-star { font-size: 3rem; color: #333; animation: starPop .4s both; }
.cel-star.earned { color: #f39c12; text-shadow: 0 0 24px #f39c12cc; }
.cel-xp { font-size: 1.6rem; font-weight: 800; color: #2ecc71; animation: fadeInUp .5s 1s both; text-shadow: 0 0 12px #2ecc7166; }
.cel-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
.btn-cel-next { background: linear-gradient(135deg,#2ecc71,#27ae60); border: none; border-radius: 12px; padding: 14px 28px; color: #fff; font-size: 1rem; font-weight: 800; cursor: pointer; transition: transform .1s; box-shadow: 0 4px 16px #2ecc7144; }
.btn-cel-next:hover { transform: scale(1.04); }
.btn-cel-map { background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: 12px; padding: 14px 20px; color: var(--text-2); font-size: .9rem; font-weight: 600; cursor: pointer; }
.btn-cel-map:hover { background: var(--bg-2); }

/* ── DERROTA ─────────────────────────────────────────────────── */
.fail-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.88); display: flex; align-items: center; justify-content: center; z-index: 500; animation: fadeIn .3s; }
.fail-card { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; background: #1a0010; border: 1px solid rgba(231,76,60,.3); border-radius: 20px; padding: 32px 40px; }
.fail-emoji { font-size: 3.5rem; animation: bounceIn .5s both; }
.fail-title { font-size: 1.8rem; font-weight: 900; color: #e74c3c; animation: fadeInUp .4s .2s both; }
.fail-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.btn-retry-pay { background: #e74c3c; border: none; border-radius: 10px; padding: 12px 24px; color: #fff; font-weight: 700; cursor: pointer; font-size: .95rem; transition: background .15s; }
.btn-retry-pay:hover { background: #c0392b; }
.btn-ad { background: transparent; border: 1px solid #3b9df8; border-radius: 10px; padding: 12px 24px; color: #3b9df8; font-weight: 700; cursor: pointer; font-size: .95rem; transition: all .15s; }
.btn-ad:hover { background: rgba(59,157,248,.1); }

/* ── ANÚNCIO ─────────────────────────────────────────────────── */
.ad-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.92); display: flex; align-items: center; justify-content: center; z-index: 600; }
.ad-card { background: #111; border: 1px solid #333; border-radius: 16px; width: 300px; display: flex; flex-direction: column; overflow: hidden; }
.ad-top { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #222; }
.ad-tag { font-size: .7rem; font-weight: 700; color: #aaa; letter-spacing: 2px; }
.ad-timer { font-size: .85rem; font-weight: 700; color: #f39c12; }
.ad-mock { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 32px 20px; }
.ad-logo { font-size: 3rem; }
.ad-text { font-size: .9rem; color: #ccc; text-align: center; }
.ad-cta { background: #e74c3c; border-radius: 8px; padding: 8px 20px; font-weight: 700; font-size: .9rem; color: #fff; }
.ad-progress-wrap { height: 4px; background: #333; }
.ad-progress { height: 100%; width: 0; background: #3b9df8; }
.btn-close-ad { background: #1a1a2e; border: none; padding: 14px; color: #888; font-size: .9rem; font-weight: 700; cursor: not-allowed; transition: all .15s; }
.btn-close-ad.ready { color: #2ecc71; cursor: pointer; }
.btn-close-ad.ready:hover { background: #252540; }

/* ── TOAST ───────────────────────────────────────────────────── */
.toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(20px); background: var(--bg-2); border: 1px solid var(--border-strong); border-radius: 10px; padding: 10px 20px; color: var(--text); font-size: .88rem; font-weight: 600; z-index: 800; opacity: 0; transition: opacity .3s, transform .3s; pointer-events: none; white-space: nowrap; max-width: 90vw; text-align: center; box-shadow: var(--shadow); }
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

/* ── ANIMAÇÕES ───────────────────────────────────────────────── */
@keyframes fadeIn    { from{opacity:0} to{opacity:1} }
@keyframes fadeInUp  { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
@keyframes bounceIn  { 0%{transform:scale(.2);opacity:0} 60%{transform:scale(1.15)} 80%{transform:scale(.95)} 100%{transform:scale(1);opacity:1} }
@keyframes starPop   { 0%{transform:scale(0) rotate(-45deg);opacity:0} 60%{transform:scale(1.3) rotate(8deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
`,document.head.appendChild($),J();