(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t){return{row:e,col:t}}function t(e,t){let n=e.row===t.row&&Math.abs(e.col-t.col)===1,r=e.col===t.col&&Math.abs(e.row-t.row)===1;return n||r}function n(n,r,i=null){if(!t(n,r))throw RangeError(`Pontos não adjacentes: (${n.row},${n.col}) e (${r.row},${r.col})`);let a=n.row<r.row||n.row===r.row&&n.col<r.col,o=a?n:r,s=a?r:n;return{from:e(o.row,o.col),to:e(s.row,s.col),ownerId:i}}function r(e){return`${e.from.row===e.to.row?`h`:`v`}-${e.from.row}-${e.from.col}`}function i(e){return`b-${e.row}-${e.col}`}function a(t){let i=t.row,a=t.col;return[r(n(e(i,a),e(i,a+1))),r(n(e(i+1,a),e(i+1,a+1))),r(n(e(i,a),e(i+1,a))),r(n(e(i,a+1),e(i+1,a+1)))]}function o(t,a){if(t<2)throw RangeError(`gridSize deve ser >= 2`);if(a.length<2)throw RangeError(`É necessário ao menos 2 jogadores`);let o={};for(let i=0;i<t;i++)for(let a=0;a<t-1;a++){let t=n(e(i,a),e(i,a+1));o[r(t)]=t}for(let i=0;i<t-1;i++)for(let a=0;a<t;a++){let t=n(e(i,a),e(i+1,a));o[r(t)]=t}let s={};for(let n=0;n<t-1;n++)for(let r=0;r<t-1;r++){let t={topLeft:e(n,r),ownerId:null};s[i(t.topLeft)]=t}let c=a[0];return{gridSize:t,players:a.map(e=>({...e,score:0})),lines:o,boxes:s,currentPlayerId:c.id,status:`playing`}}function s(e,t,n){return{id:e,name:t,color:n,score:0}}function c(e){return{ok:!0,value:e}}function l(e,t=null){return{ok:!1,error:e,code:t}}var u={GAME_FINISHED:`GAME_FINISHED`,LINE_NOT_FOUND:`LINE_NOT_FOUND`,LINE_ALREADY_TAKEN:`LINE_ALREADY_TAKEN`};function d(e,t){if(e.status===`finished`)return l(`A partida já terminou`,u.GAME_FINISHED);let n=r(t),o=e.lines[n];if(o===void 0)return l(`Linha inexistente no tabuleiro`,u.LINE_NOT_FOUND);if(o.ownerId!==null)return l(`Linha já foi jogada`,u.LINE_ALREADY_TAKEN);let s=e.currentPlayerId,d={...e.lines,[n]:{...o,ownerId:s}},p={...e.boxes},m=0;for(let t of Object.values(e.boxes))t.ownerId===null&&a(t.topLeft).every(e=>{let t=d[e];return t!==void 0&&t.ownerId!==null})&&(p[i(t.topLeft)]={...t,ownerId:s},m+=1);let h=e.players.map(e=>e.id===s?{...e,score:e.score+m}:{...e}),g=Object.values(d).every(e=>e.ownerId!==null)?`finished`:`playing`,ee=g===`finished`||m>0?s:f(e.players,s);return c({...e,lines:d,boxes:p,players:h,currentPlayerId:ee,status:g})}function f(e,t){return e[(e.findIndex(e=>e.id===t)+1)%e.length].id}function p(e){return Object.values(e.lines).filter(e=>e.ownerId===null)}var m=class{state;constructor(e){this.state=this.buildState(e)}buildState(e){let t=e.players.map((e,t)=>s(`p${t+1}`,e.name,e.color));return o(e.gridSize,t)}getState(){return this.state}playLine(e){let t=d(this.state,e);return t.ok?(this.state=t.value,!0):!1}reset(e){this.state=this.buildState(e)}getAvailableLines(){return p(this.state)}},h=80,g=50,ee=7,te=24;function _(e){return g+e*h}function v(e){return g+e*h}function ne(e,t){return t?e.players.find(e=>e.id===t)?.color??`#888`:`#ccc`}function re(e){let t=g*2+(e-1)*h;return{width:t,height:t}}function ie(e,t,n,i=!1){let{gridSize:a}=t,{width:o,height:s}=re(a);e.clearRect(0,0,o,s),e.fillStyle=`#ffffff`,e.fillRect(0,0,o,s);for(let n of Object.values(t.boxes)){if(!n.ownerId)continue;let r=ne(t,n.ownerId),i=_(n.topLeft.col),a=v(n.topLeft.row);e.fillStyle=r+`33`,e.fillRect(i+1,a+1,h-2,h-2);let o=t.players.find(e=>e.id===n.ownerId);o&&(e.fillStyle=r+`bb`,e.font=`bold ${Math.floor(h*.35)}px system-ui, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(o.name[0]?.toUpperCase()??`?`,i+h/2,a+h/2))}let c=t.players.find(e=>e.id===t.currentPlayerId);for(let i of Object.values(t.lines)){let a=n!==null&&r(n)===r(i);e.beginPath(),e.moveTo(_(i.from.col),v(i.from.row)),e.lineTo(_(i.to.col),v(i.to.row)),e.lineCap=`round`,i.ownerId===null?a?(e.strokeStyle=(c?.color??`#888`)+`cc`,e.lineWidth=6):(e.strokeStyle=`#dde1e7`,e.lineWidth=3):(e.strokeStyle=ne(t,i.ownerId),e.lineWidth=7),e.stroke()}for(let t=0;t<a;t++)for(let n=0;n<a;n++)e.beginPath(),e.arc(_(n),v(t),ee,0,Math.PI*2),e.fillStyle=`#2c3e50`,e.fill()}function ae(t,i,a){let{gridSize:o}=t,s=null,c=te;for(let l=0;l<o;l++)for(let u=0;u<o-1;u++){let o=_(u),d=_(u+1),f=v(l);if(i>=o-4&&i<=d+4){let i=Math.abs(a-f);if(i<c){c=i;let a=r(n(e(l,u),e(l,u+1)));s=t.lines[a]??null}}}for(let l=0;l<o-1;l++)for(let u=0;u<o;u++){let o=v(l),d=v(l+1),f=_(u);if(a>=o-4&&a<=d+4){let a=Math.abs(i-f);if(a<c){c=a;let i=r(n(e(l,u),e(l+1,u)));s=t.lines[i]??null}}}return s}var oe={"pt-BR":`🇧🇷`,"pt-PT":`🇵🇹`,es:`🇪🇸`,en:`🇬🇧`},se=`dab_lang`;function ce(){let e=localStorage.getItem(se);if(e&&e in oe)return e;let t=navigator.language??``;return t.startsWith(`pt-PT`)?`pt-PT`:t.startsWith(`pt`)?`pt-BR`:t.startsWith(`es`)?`es`:`en`}function le(e){localStorage.setItem(se,e)}function y(e,t){let n=ue[ce()][e]??ue.en[e]??e;if(t)for(let[e,r]of Object.entries(t))n=n.replaceAll(`{${e}}`,String(r));return n}var ue={"pt-BR":{tagline:`Conecte • Feche • Domine`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} fases concluídas`,menu_bot:`Modo Treino`,menu_bot_sub:`7 dificuldades`,menu_multi:`Multijogador`,menu_multi_sub:`2 a 4 jogadores • Duplas ou Solo`,menu_tutorial:`Tutorial`,menu_tutorial_sub:`Aprenda a jogar`,back:`← Voltar`,lang_label:`Idioma`,energy_no:`⚡ Sem energia! Aguarde a recarga ou assista um anúncio.`,energy_recharged:`⚡ Energia recarregada!`,energy_unlimited:`∞`,settings:`Configurações`,theme:`Tema`,theme_dark:`🌙 Escuro`,theme_light:`☀️ Claro`,multiplatform:`Multiplataforma`,profile:`Perfil`,diff_muito_facil:`Muito Fácil`,diff_facil:`Fácil`,diff_medio:`Médio`,diff_dificil:`Difícil`,diff_muito_dificil:`Muito Difícil`,diff_impossivel:`Impossível`,diff_impulsivo:`Impulsivo`,setup_difficulty:`Dificuldade`,setup_grid:`Grade`,setup_players:`Jogadores`,setup_mode:`Modo`,setup_solo:`Solo (todos vs todos)`,setup_teams:`Duplas (2v2)`,setup_start:`Iniciar Partida`,game_turn:`Vez de {name}`,game_bot_thinking:`Bot pensando...`,stage_label:`Fase {id}`,vs_bot_label:`vs Bot — {diff}`,teams_2v2:`Duplas 2v2`,n_players:`{n} Jogadores`,team_a:`Time A`,team_b:`Time B`,stage_complete:`COMPLETA!`,next_stage:`Próxima Fase →`,map:`📍 Mapa`,victory:`Vitória!`,won_suffix:`venceu!`,tie:`🤝 Empate!`,new_game:`Nova Partida`,xp_gained:`+{xp} XP`,you_lost:`Você perdeu!`,you_tied:`🤝 Você empatou!`,try_again:`⚡ Tentar de novo`,watch_ad:`📺 Assistir anúncio`,skip_phase:`Deseja pular a fase?`,skip_via_ad:`📺 Pular com anúncio ({n} restantes)`,no_skips_left:`Sem pulos disponíveis esta semana`,god_skips:`Pulos disponíveis`,tut_step1_title:`Conecte os pontos`,tut_step1_desc:`Clique em dois pontos adjacentes para traçar uma linha.`,tut_step2_title:`Feche o quadrado`,tut_step2_desc:`Ao fechar o 4º lado de um quadrado você pontua e joga de novo.`,tut_step3_title:`Marque mais pontos`,tut_step3_desc:`Vence quem fechar mais quadrados quando todas as linhas acabarem.`,tut_step4_title:`Cuidado com o bot`,tut_step4_desc:`Não deixe o 3º lado de um quadrado aberto — o bot vai completar!`,tut_hint:`Cada ponto conecta-se aos vizinhos. Um quadrado tem 4 lados.`,ad_label:`ANÚNCIO`,ad_close_timer:`Fechar ({n})`,ad_close_ready:`✓ Fechar`,ad_text:`Baixe agora o melhor jogo!`,ad_cta:`JOGAR GRÁTIS`,god_mode:`👑 God Mode`,god_unlimited_energy:`Energia ilimitada`,god_go_stage:`Ir para fase específica`,god_go:`IR`,god_next:`⏭ Próxima fase ({id})`,god_refill:`⚡ Recarregar energia`,god_activated:`👑 God Mode ATIVADO!`,god_deactivated:`God Mode desativado`,on_label:`ON`,off_label:`OFF`,settings_vibration:`📳 Vibração`,settings_music:`🎵 Volume da Música`,settings_mute:`🔇 Mudo (sem sons)`,player_n:`Jogador {n}`,you:`Você`,bot:`Bot`,rank_master:`Mestre`,rank_diamond:`Diamante`,rank_plat_3:`Platina III`,rank_plat_2:`Platina II`,rank_plat_1:`Platina I`,rank_gold_3:`Ouro III`,rank_gold_2:`Ouro II`,rank_gold_1:`Ouro I`,rank_silver_3:`Prata III`,rank_silver_2:`Prata II`,rank_silver_1:`Prata I`,rank_bronze_3:`Bronze III`,rank_bronze_2:`Bronze II`,rank_bronze_1:`Bronze I`,rank_beginner:`Iniciante`},"pt-PT":{settings:`Definições`,theme:`Tema`,theme_dark:`🌙 Escuro`,theme_light:`☀️ Claro`,theme_pink:`🌸 Rosa`,multiplatform:`Multiplataforma`,profile:`Perfil`,tagline:`Conecte • Feche • Domine`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} fases concluídas`,menu_bot:`Modo Treino`,menu_bot_sub:`7 dificuldades`,menu_multi:`Multijogador`,menu_multi_sub:`2 a 4 jogadores • Duplas ou Solo`,menu_tutorial:`Tutorial`,menu_tutorial_sub:`Aprenda a jogar`,back:`← Voltar`,lang_label:`Idioma`,energy_no:`⚡ Sem energia! Aguarde a recarga ou veja um anúncio.`,energy_recharged:`⚡ Energia recarregada!`,energy_unlimited:`∞`,diff_muito_facil:`Muito Fácil`,diff_facil:`Fácil`,diff_medio:`Médio`,diff_dificil:`Difícil`,diff_muito_dificil:`Muito Difícil`,diff_impossivel:`Impossível`,diff_impulsivo:`Impulsivo`,setup_difficulty:`Dificuldade`,setup_grid:`Grelha`,setup_players:`Jogadores`,setup_mode:`Modo`,setup_solo:`Solo (todos vs todos)`,setup_teams:`Duplas (2v2)`,setup_start:`Iniciar Jogo`,game_turn:`Vez de {name}`,game_bot_thinking:`Bot a pensar...`,stage_label:`Fase {id}`,vs_bot_label:`vs Bot — {diff}`,teams_2v2:`Duplas 2v2`,n_players:`{n} Jogadores`,team_a:`Equipa A`,team_b:`Equipa B`,stage_complete:`COMPLETA!`,next_stage:`Próxima Fase →`,map:`📍 Mapa`,victory:`Vitória!`,won_suffix:`venceu!`,tie:`🤝 Empate!`,new_game:`Novo Jogo`,xp_gained:`+{xp} XP`,you_lost:`Perdeu!`,you_tied:`🤝 Empatou!`,try_again:`⚡ Tentar novamente`,watch_ad:`📺 Ver anúncio`,skip_phase:`Deseja pular a fase?`,skip_via_ad:`📺 Pular com anúncio ({n} restantes)`,no_skips_left:`Sem pulos disponíveis esta semana`,god_skips:`Pulos disponíveis`,tut_step1_title:`Conecte os pontos`,tut_step1_desc:`Clique em dois pontos adjacentes para traçar uma linha.`,tut_step2_title:`Feche o quadrado`,tut_step2_desc:`Ao fechar o 4º lado de um quadrado você pontua e joga de novo.`,tut_step3_title:`Marque mais pontos`,tut_step3_desc:`Vence quem fechar mais quadrados quando todas as linhas acabarem.`,tut_step4_title:`Cuidado com o bot`,tut_step4_desc:`Não deixe o 3º lado de um quadrado aberto — o bot vai completar!`,tut_hint:`Cada ponto conecta-se aos vizinhos. Um quadrado tem 4 lados.`,ad_label:`ANÚNCIO`,ad_close_timer:`Fechar ({n})`,ad_close_ready:`✓ Fechar`,ad_text:`Descarregue agora o melhor jogo!`,ad_cta:`JOGAR GRÁTIS`,god_mode:`👑 God Mode`,god_unlimited_energy:`Energia ilimitada`,god_go_stage:`Ir para fase específica`,god_go:`IR`,god_next:`⏭ Próxima fase ({id})`,god_refill:`⚡ Recarregar energia`,god_activated:`👑 God Mode ATIVADO!`,god_deactivated:`God Mode desativado`,on_label:`ON`,off_label:`OFF`,settings_vibration:`📳 Vibração`,settings_music:`🎵 Volume da Música`,settings_mute:`🔇 Mudo (sem sons)`,player_n:`Jogador {n}`,you:`Você`,bot:`Bot`,rank_master:`Mestre`,rank_diamond:`Diamante`,rank_plat_3:`Platina III`,rank_plat_2:`Platina II`,rank_plat_1:`Platina I`,rank_gold_3:`Ouro III`,rank_gold_2:`Ouro II`,rank_gold_1:`Ouro I`,rank_silver_3:`Prata III`,rank_silver_2:`Prata II`,rank_silver_1:`Prata I`,rank_bronze_3:`Bronze III`,rank_bronze_2:`Bronze II`,rank_bronze_1:`Bronze I`,rank_beginner:`Iniciante`},es:{settings:`Ajustes`,theme:`Tema`,theme_dark:`🌙 Oscuro`,theme_light:`☀️ Claro`,theme_pink:`🌸 Rosa`,multiplatform:`Multiplataforma`,profile:`Perfil`,tagline:`Conecta • Cierra • Domina`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} fases completadas`,menu_bot:`Modo Entrenamiento`,menu_bot_sub:`7 niveles de dificultad`,menu_multi:`Multijugador`,menu_multi_sub:`2 a 4 jugadores • Parejas o Solo`,menu_tutorial:`Tutorial`,menu_tutorial_sub:`Aprende a jugar`,back:`← Volver`,lang_label:`Idioma`,energy_no:`⚡ ¡Sin energía! Espera la recarga o ve un anuncio.`,energy_recharged:`⚡ ¡Energía recargada!`,energy_unlimited:`∞`,diff_muito_facil:`Muy Fácil`,diff_facil:`Fácil`,diff_medio:`Medio`,diff_dificil:`Difícil`,diff_muito_dificil:`Muy Difícil`,diff_impossivel:`Imposible`,diff_impulsivo:`Impulsivo`,setup_difficulty:`Dificultad`,setup_grid:`Cuadrícula`,setup_players:`Jugadores`,setup_mode:`Modo`,setup_solo:`Solo (todos vs todos)`,setup_teams:`Parejas (2v2)`,setup_start:`Iniciar Partida`,game_turn:`Turno de {name}`,game_bot_thinking:`Bot pensando...`,stage_label:`Fase {id}`,vs_bot_label:`vs Bot — {diff}`,teams_2v2:`Parejas 2v2`,n_players:`{n} Jugadores`,team_a:`Equipo A`,team_b:`Equipo B`,stage_complete:`¡COMPLETA!`,next_stage:`Siguiente Fase →`,map:`📍 Mapa`,victory:`¡Victoria!`,won_suffix:`¡ganó!`,tie:`🤝 ¡Empate!`,new_game:`Nueva Partida`,xp_gained:`+{xp} XP`,you_lost:`¡Perdiste!`,you_tied:`🤝 ¡Empataste!`,try_again:`⚡ Intentar de nuevo`,watch_ad:`📺 Ver anuncio`,skip_phase:`¿Deseas saltar la fase?`,skip_via_ad:`📺 Saltar con anuncio ({n} restantes)`,no_skips_left:`Sin saltos disponibles esta semana`,god_skips:`Saltos disponibles`,tut_step1_title:`Conecta los puntos`,tut_step1_desc:`Haz clic en dos puntos adyacentes para trazar una línea.`,tut_step2_title:`Cierra el cuadrado`,tut_step2_desc:`Al cerrar el 4º lado de un cuadrado puntúas y vuelves a jugar.`,tut_step3_title:`Más puntos gana`,tut_step3_desc:`Gana quien cierre más cuadrados cuando no queden líneas.`,tut_step4_title:`Cuidado con el bot`,tut_step4_desc:`No dejes el 3er lado abierto — ¡el bot lo completará!`,tut_hint:`Cada punto se conecta a sus vecinos. Un cuadrado tiene 4 lados.`,ad_label:`ANUNCIO`,ad_close_timer:`Cerrar ({n})`,ad_close_ready:`✓ Cerrar`,ad_text:`¡Descarga ahora el mejor juego!`,ad_cta:`JUGAR GRATIS`,god_mode:`👑 Modo Dios`,god_unlimited_energy:`Energía ilimitada`,god_go_stage:`Ir a fase específica`,god_go:`IR`,god_next:`⏭ Siguiente fase ({id})`,god_refill:`⚡ Recargar energía`,god_activated:`👑 ¡Modo Dios ACTIVADO!`,god_deactivated:`Modo Dios desactivado`,on_label:`ON`,off_label:`OFF`,settings_vibration:`📳 Vibración`,settings_music:`🎵 Volumen de Música`,settings_mute:`🔇 Silencio (sin sonidos)`,player_n:`Jugador {n}`,you:`Tú`,bot:`Bot`,rank_master:`Maestro`,rank_diamond:`Diamante`,rank_plat_3:`Platino III`,rank_plat_2:`Platino II`,rank_plat_1:`Platino I`,rank_gold_3:`Oro III`,rank_gold_2:`Oro II`,rank_gold_1:`Oro I`,rank_silver_3:`Plata III`,rank_silver_2:`Plata II`,rank_silver_1:`Plata I`,rank_bronze_3:`Bronce III`,rank_bronze_2:`Bronce II`,rank_bronze_1:`Bronce I`,rank_beginner:`Principiante`},en:{settings:`Settings`,theme:`Theme`,theme_dark:`🌙 Dark`,theme_light:`☀️ Light`,theme_pink:`🌸 Pink`,multiplatform:`Multiplatform`,profile:`Profile`,tagline:`Connect • Close • Dominate`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} stages completed`,menu_bot:`Training Mode`,menu_bot_sub:`7 difficulty levels`,menu_multi:`Multiplayer`,menu_multi_sub:`2 to 4 players • Teams or Solo`,menu_tutorial:`Tutorial`,menu_tutorial_sub:`Learn how to play`,back:`← Back`,lang_label:`Language`,energy_no:`⚡ No energy! Wait for recharge or watch an ad.`,energy_recharged:`⚡ Energy recharged!`,energy_unlimited:`∞`,diff_muito_facil:`Very Easy`,diff_facil:`Easy`,diff_medio:`Medium`,diff_dificil:`Hard`,diff_muito_dificil:`Very Hard`,diff_impossivel:`Impossible`,diff_impulsivo:`Impulsive`,setup_difficulty:`Difficulty`,setup_grid:`Grid Size`,setup_players:`Players`,setup_mode:`Mode`,setup_solo:`Solo (all vs all)`,setup_teams:`Teams (2v2)`,setup_start:`Start Game`,game_turn:`{name}'s turn`,game_bot_thinking:`Bot thinking...`,stage_label:`Stage {id}`,vs_bot_label:`vs Bot — {diff}`,teams_2v2:`Teams 2v2`,n_players:`{n} Players`,team_a:`Team A`,team_b:`Team B`,stage_complete:`COMPLETE!`,next_stage:`Next Stage →`,map:`📍 Map`,victory:`Victory!`,won_suffix:`won!`,tie:`🤝 Tie!`,new_game:`New Game`,xp_gained:`+{xp} XP`,you_lost:`You lost!`,you_tied:`🤝 It's a Tie!`,try_again:`⚡ Try Again`,watch_ad:`📺 Watch Ad`,skip_phase:`Want to skip this stage?`,skip_via_ad:`📺 Skip with ad ({n} left)`,no_skips_left:`No skips available this week`,god_skips:`Available skips`,tut_step1_title:`Connect the dots`,tut_step1_desc:`Click two adjacent dots to draw a line between them.`,tut_step2_title:`Close the square`,tut_step2_desc:`Close the 4th side of a square to score and play again.`,tut_step3_title:`Score the most`,tut_step3_desc:`The player who closes the most squares wins.`,tut_step4_title:`Watch the bot`,tut_step4_desc:`Don't leave the 3rd side open — the bot will complete it!`,tut_hint:`Each dot connects to its neighbors. A square has 4 sides.`,ad_label:`AD`,ad_close_timer:`Close ({n})`,ad_close_ready:`✓ Close`,ad_text:`Download the best game now!`,ad_cta:`PLAY FREE`,god_mode:`👑 God Mode`,god_unlimited_energy:`Unlimited energy`,god_go_stage:`Go to specific stage`,god_go:`GO`,god_next:`⏭ Next stage ({id})`,god_refill:`⚡ Refill energy`,god_activated:`👑 God Mode ACTIVATED!`,god_deactivated:`God Mode deactivated`,on_label:`ON`,off_label:`OFF`,settings_vibration:`📳 Vibration`,settings_music:`🎵 Music Volume`,settings_mute:`🔇 Mute (no sounds)`,player_n:`Player {n}`,you:`You`,bot:`Bot`,rank_master:`Master`,rank_diamond:`Diamond`,rank_plat_3:`Platinum III`,rank_plat_2:`Platinum II`,rank_plat_1:`Platinum I`,rank_gold_3:`Gold III`,rank_gold_2:`Gold II`,rank_gold_1:`Gold I`,rank_silver_3:`Silver III`,rank_silver_2:`Silver II`,rank_silver_1:`Silver I`,rank_bronze_3:`Bronze III`,rank_bronze_2:`Bronze II`,rank_bronze_1:`Bronze I`,rank_beginner:`Beginner`}},de={"muito-facil":`diff_muito_facil`,facil:`diff_facil`,medio:`diff_medio`,dificil:`diff_dificil`,"muito-dificil":`diff_muito_dificil`,impossivel:`diff_impossivel`,impulsivo:`diff_impulsivo`};function fe(e){return y(de[e])}var pe=[`muito-facil`,`facil`,`medio`,`dificil`,`muito-dificil`,`impossivel`,`impulsivo`];function b(e){return e[Math.floor(Math.random()*e.length)]}function x(t,n,r){return a(e(n,r)).filter(e=>t.lines[e]?.ownerId!==null).length}function me(e,t){return t.filter(t=>{let{gridSize:n}=e;return S(t,n).some(([t,n])=>x(e,t,n)===3)})}function he(e,t){return t.filter(t=>{let{gridSize:n}=e;return!S(t,n).some(([t,n])=>x(e,t,n)===2)})}function S(e,t){let n=[],{from:r,to:i}=e;if(r.row===i.row){let e=r.row,i=r.col;e>0&&n.push([e-1,i]),e<t-1&&n.push([e,i])}else{let e=r.row,i=r.col;i>0&&n.push([e,i-1]),i<t-1&&n.push([e,i])}return n}function ge(e,t){let n=e.players.find(e=>e.id===t),r=e.players.find(e=>e.id!==t);return(n?.score??0)-(r?.score??0)}function C(e,t,n,r,i,a){if(e.status===`finished`||n===0)return ge(e,t);let o=p(e);if(o.length===0)return ge(e,t);let s=[...o].sort((t,n)=>{let r=+!!S(t,e.gridSize).some(([t,n])=>x(e,t,n)===3);return+!!S(n,e.gridSize).some(([t,n])=>x(e,t,n)===3)-r});if(a){let a=-1/0;for(let o of s){let s=d(e,o);if(!s.ok)continue;let c=s.value.currentPlayerId===t,l=C(s.value,t,n-1,r,i,c);if(a=Math.max(a,l),r=Math.max(r,l),i<=r)break}return a}else{let a=1/0;for(let o of s){let s=d(e,o);if(!s.ok)continue;let c=s.value.currentPlayerId===t,l=C(s.value,t,n-1,r,i,c);if(a=Math.min(a,l),i=Math.min(i,l),i<=r)break}return a}}function w(e,t,n){let r=p(e),i=r[0],a=-1/0;for(let o of r){let r=d(e,o);if(!r.ok)continue;let s=r.value.currentPlayerId===t,c=C(r.value,t,n-1,-1/0,1/0,s);c>a&&(a=c,i=o)}return i}function _e(e,t){let n=p(e);if(n.length===0)throw Error(`Sem movimentos disponíveis`);let r=e.currentPlayerId;switch(t){case`muito-facil`:return b(n);case`facil`:{let t=me(e,n);return t.length>0&&Math.random()<.5?b(t):b(n)}case`medio`:{let t=me(e,n);if(t.length>0)return b(t);let r=he(e,n);return r.length>0?b(r):b(n)}case`dificil`:return w(e,r,3);case`muito-dificil`:return w(e,r,6);case`impossivel`:return w(e,r,e.gridSize<=4?12:8);case`impulsivo`:return Math.random()<.4?w(e,r,8):b(n)}}function ve(e){return{"muito-facil":300,facil:400,medio:500,dificil:700,"muito-dificil":900,impossivel:1200,impulsivo:200}[e]}var ye=[{range:[1,10],gridSizes:[3],difficulty:`muito-facil`},{range:[11,25],gridSizes:[3,4],difficulty:`muito-facil`},{range:[26,50],gridSizes:[4],difficulty:`facil`},{range:[51,80],gridSizes:[4],difficulty:`facil`},{range:[81,120],gridSizes:[4,5],difficulty:`medio`},{range:[121,170],gridSizes:[5],difficulty:`medio`},{range:[171,230],gridSizes:[5],difficulty:`dificil`},{range:[231,300],gridSizes:[5,6],difficulty:`dificil`},{range:[301,380],gridSizes:[6],difficulty:`muito-dificil`},{range:[381,450],gridSizes:[6],difficulty:`muito-dificil`},{range:[451,490],gridSizes:[6],difficulty:`impossivel`},{range:[491,500],gridSizes:[6],difficulty:`impossivel`}];function be(e,t){let n=(t-1)*(t-1),r=e%5;if(r===0)return{objectiveType:`dominance`,objectiveValue:60,stars:[`Vença`,`Feche ≥60% das caixas`,`Feche ≥75% das caixas`]};if(r===1){let t=Math.min(2+Math.floor(e/50),Math.floor(n/2));return{objectiveType:`margin`,objectiveValue:t,stars:[`Vença`,`Vença por ≥${t} caixas`,`Vença por ≥${t+2} caixas`]}}return r===2?{objectiveType:`chain`,objectiveValue:2,stars:[`Vença`,`Feche ≥2 caixas em um turno`,`Feche ≥3 caixas em um turno`]}:r===3?{objectiveType:`clean`,objectiveValue:0,stars:[`Vença`,`Vença sem dar caixas ao bot`,`Vença sem dar caixas com margem ≥3`]}:{objectiveType:`win`,objectiveValue:0,stars:[`Vença`,`Vença com ≥${Math.ceil(n*.5)} caixas`,`Vença com ≥${Math.ceil(n*.65)} caixas`]}}function xe(e){let t=ye.find(t=>e>=t.range[0]&&e<=t.range[1])??ye[ye.length-1],n=t.gridSizes,r=n[e%n.length]??n[0],i=be(e,r);return{id:e,gridSize:r,difficulty:t.difficulty,...i}}var T=`dab_skips`;function Se(){let e=new Date;return e.setHours(0,0,0,0),e.setDate(e.getDate()-(e.getDay()+6)%7),e.getTime()}function Ce(){try{let e=localStorage.getItem(T);if(e){let t=JSON.parse(e);if(t.weekStart>=Se())return t}}catch{}let e={count:3,weekStart:Se()};return localStorage.setItem(T,JSON.stringify(e)),e}function we(){return Ce().count}function Te(){let e=Ce();return e.count<=0?!1:(e.count--,localStorage.setItem(T,JSON.stringify(e)),!0)}function Ee(e){let t=Ce();t.count=Math.max(0,e),localStorage.setItem(T,JSON.stringify(t))}var De=`dab_music_vol`,Oe=`dab_mute`;function E(){return localStorage.getItem(Oe)===`1`}function ke(e){localStorage.setItem(Oe,e?`1`:`0`)}function D(){let e=localStorage.getItem(De);return e===null?.25:Math.max(0,Math.min(1,parseFloat(e)))}function Ae(e){localStorage.setItem(De,String(Math.max(0,Math.min(1,e))))}var je=`dab_vibration`;function Me(){let e=localStorage.getItem(je);return e===null?!0:e===`1`}function Ne(e){localStorage.setItem(je,e?`1`:`0`)}function O(e){if(Me())try{typeof window<`u`&&window.navigator?.vibrate&&window.navigator.vibrate(e)}catch{}}var Pe=`dab_theme`;function k(){return localStorage.getItem(Pe)??`dark`}function Fe(e){localStorage.setItem(Pe,e),document.documentElement.setAttribute(`data-theme`,e)}function Ie(){document.documentElement.setAttribute(`data-theme`,k())}var Le=`dab_profile`;function Re(){return{name:`Jogador`,xp:0,stageProgress:{}}}function A(){try{let e=localStorage.getItem(Le);return e?JSON.parse(e):Re()}catch{return Re()}}function ze(e){localStorage.setItem(Le,JSON.stringify(e))}function Be(e,t,n,r){let i=A(),a=i.stageProgress[e];return i.stageProgress[e]={stars:Math.max(t,a?.stars??0),bestScore:Math.max(n,a?.bestScore??0)},i.xp+=r,ze(i),i}function Ve(e){let t=[{key:`rank_master`,icon:`👑`,min:15e4,next:1/0},{key:`rank_diamond`,icon:`🔷`,min:75e3,next:15e4},{key:`rank_plat_3`,icon:`💎`,min:5e4,next:75e3},{key:`rank_plat_2`,icon:`💎`,min:4e4,next:5e4},{key:`rank_plat_1`,icon:`💎`,min:3e4,next:4e4},{key:`rank_gold_3`,icon:`🥇`,min:2e4,next:3e4},{key:`rank_gold_2`,icon:`🥇`,min:15e3,next:2e4},{key:`rank_gold_1`,icon:`🥇`,min:1e4,next:15e3},{key:`rank_silver_3`,icon:`🥈`,min:6e3,next:1e4},{key:`rank_silver_2`,icon:`🥈`,min:3500,next:6e3},{key:`rank_silver_1`,icon:`🥈`,min:2500,next:3500},{key:`rank_bronze_3`,icon:`🥉`,min:1500,next:2500},{key:`rank_bronze_2`,icon:`🥉`,min:1e3,next:1500},{key:`rank_bronze_1`,icon:`🥉`,min:500,next:1e3},{key:`rank_beginner`,icon:`⚪`,min:0,next:500}],n=t.find(t=>e>=t.min)??t[t.length-1];return{rank:y(n.key),icon:n.icon,next:n.next}}var He=6e4,Ue=`dab_energy`;function We(){try{let e=localStorage.getItem(Ue);if(!e)return 15;let t=JSON.parse(e),n=Math.floor((Date.now()-t.lastSaved)/He);return Math.min(15,t.amount+n)}catch{return 15}}function Ge(e){localStorage.setItem(Ue,JSON.stringify({amount:e,lastSaved:Date.now()}))}function Ke(){let e=We();return e<=0?!1:(Ge(e-1),!0)}function qe(){Ge(15)}var Je=`dab_god`;function Ye(){try{let e=localStorage.getItem(Je);return e?JSON.parse(e):{unlimitedEnergy:!1}}catch{return{unlimitedEnergy:!1}}}function Xe(e){localStorage.setItem(Je,JSON.stringify(e))}var Ze=`xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`,Qe=`<path stroke="none" d="M0 0h24v24H0z" fill="none"/>`;function j(e,t){return`<svg ${Ze} width="${e}" height="${e}" viewBox="0 0 24 24">${Qe}${t}</svg>`}var M=22,N=16,$e=j(M,`<path d="M2 12h1"/><path d="M6 8h-2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2"/><path d="M6 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1"/><path d="M9 12h6"/><path d="M15 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1"/><path d="M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2"/><path d="M22 12h-1"/>`),et=j(M,`<path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/>`),tt=j(M,`<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6l0 13"/><path d="M12 6l0 13"/><path d="M21 6l0 13"/>`),nt=j(N,`<path d="M4 10l0 6"/><path d="M20 10l0 6"/><path d="M7 9h10v8a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-8a5 5 0 0 1 10 0"/><path d="M8 3l1 2"/><path d="M16 3l-1 2"/><path d="M9 18l0 3"/><path d="M15 18l0 3"/>`),rt=j(N,`<path d="M8.286 7.008c-3.216 0-4.286 3.23-4.286 5.92c0 3.229 2.143 8.072 4.286 8.072c1.165-.05 1.799-.538 3.214-.538c1.406 0 1.607.538 3.214.538s4.286-3.229 4.286-5.381c-.03-.011-2.649-.434-2.679-3.23c-.02-2.335 2.589-3.179 2.679-3.228c-1.096-1.606-3.162-2.113-3.75-2.153c-1.535-.12-3.032 1.077-3.75 1.077c-.729 0-2.036-1.077-3.214-1.077"/><path d="M12 4a2 2 0 0 0 2-2a2 2 0 0 0-2 2"/>`),it=j(N,`<path d="M3 5h6v14h-6l0-14"/><path d="M12 9h10v7h-10l0-7"/><path d="M14 19h6"/><path d="M17 16v3"/><path d="M6 13v.01"/><path d="M6 16v.01"/>`),at=j(M,`<path d="M12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158-3.245"/>`),ot=`v0.01.30`,P=null,F=null,I=Ye(),L=document.getElementById(`app`),R=[`#e74c3c`,`#3498db`,`#2ecc71`,`#f39c12`];Ie();var z=new Audio(`./bg_music.mp3`);z.loop=!0,z.preload=`none`,z.volume=0,z.muted=E();function st(e,t=5e3){let n=t/60,r=e/60,i=0,a=setInterval(()=>{i=Math.min(i+r,e),z.volume=i,i>=e&&clearInterval(a)},n)}function ct(){z.paused&&z.play().then(()=>st(D())).catch(()=>{})}document.addEventListener(`click`,ct,{once:!0}),document.addEventListener(`touchstart`,ct,{once:!0,passive:!0});function lt(){return[1,2,3,4].map(e=>y(`player_n`,{n:e}))}function B(e,t,n){let r=e.getBoundingClientRect();return{x:(t-r.left)*(e.width/r.width),y:(n-r.top)*(e.height/r.height)}}function ut(e){let t=[{key:`rank_master`,icon:`👑`,min:15e4,next:1/0},{key:`rank_diamond`,icon:`🔷`,min:75e3,next:15e4},{key:`rank_plat_3`,icon:`💎`,min:5e4,next:75e3},{key:`rank_plat_2`,icon:`💎`,min:4e4,next:5e4},{key:`rank_plat_1`,icon:`💎`,min:3e4,next:4e4},{key:`rank_gold_3`,icon:`🥇`,min:2e4,next:3e4},{key:`rank_gold_2`,icon:`🥇`,min:15e3,next:2e4},{key:`rank_gold_1`,icon:`🥇`,min:1e4,next:15e3},{key:`rank_silver_3`,icon:`🥈`,min:6e3,next:1e4},{key:`rank_silver_2`,icon:`🥈`,min:3500,next:6e3},{key:`rank_silver_1`,icon:`🥈`,min:2500,next:3500},{key:`rank_bronze_3`,icon:`🥉`,min:1500,next:2500},{key:`rank_bronze_2`,icon:`🥉`,min:1e3,next:1500},{key:`rank_bronze_1`,icon:`🥉`,min:500,next:1e3},{key:`rank_beginner`,icon:`⚪`,min:0,next:500}],n=t.find(t=>e>=t.min)??t[t.length-1];return`
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
    <span class="rank-ring-icon">${n.icon}</span>`}function V(){let e=I.unlimitedEnergy?15:We(),t=e/15*100;return`
    <div class="energy-row">
      <span class="energy-bolt">⚡</span>
      <span class="energy-count">${I.unlimitedEnergy?`∞`:`${e}/15`}</span>
      <div class="e-dots-wrap">${Array.from({length:15},(t,n)=>`<span class="e-dot ${n<e?`full`:``}"></span>`).join(``)}</div>
      <div class="e-bar-wrap"><div class="e-bar-fill" style="width:${t}%"></div></div>
    </div>`}function dt(e=3200){let t=document.createElement(`canvas`);Object.assign(t.style,{position:`fixed`,top:`0`,left:`0`,width:`100%`,height:`100%`,pointerEvents:`none`,zIndex:`998`}),t.width=window.innerWidth,t.height=window.innerHeight,document.body.appendChild(t);let n=t.getContext(`2d`),r=[`#e74c3c`,`#3498db`,`#2ecc71`,`#f39c12`,`#9b59b6`,`#1abc9c`,`#e67e22`,`#ff6b9d`],i=Array.from({length:160},()=>({x:Math.random()*t.width,y:-20-Math.random()*120,w:5+Math.random()*9,h:3+Math.random()*5,color:r[Math.floor(Math.random()*r.length)],vx:(Math.random()-.5)*3,vy:1.5+Math.random()*4,rot:Math.random()*Math.PI*2,drot:(Math.random()-.5)*.15,opacity:1})),a=Date.now();(function r(){let o=(Date.now()-a)/e;n.clearRect(0,0,t.width,t.height);for(let e of i)e.x+=e.vx,e.y+=e.vy,e.rot+=e.drot,o>.65&&(e.opacity=Math.max(0,1-(o-.65)/.35)),n.save(),n.globalAlpha=e.opacity,n.translate(e.x,e.y),n.rotate(e.rot),n.fillStyle=e.color,n.fillRect(-e.w/2,-e.h/2,e.w,e.h),n.restore();o<1?requestAnimationFrame(r):t.remove()})()}var ft=[`Parabéns!`,`Mandou muito!`,`Excelente!`,`Perfeito!`,`Arrasou!`,`Show demais!`,`Você brilhou!`,`Sensacional!`,`Incrível!`,`Missão completa!`,`Jogada perfeita!`,`Resultado top!`,`Você dominou!`,`Que vitória!`,`Muito bem!`,`Desempenho incrível!`,`Nota máxima!`,`Você é fera!`,`Trabalho impecável!`,`Vitória com estilo!`],pt=[`Boa!`,`Legal!`,`Foi bem!`,`Bom trabalho!`,`Quase lá!`,`Continue assim!`,`Bom resultado!`,`Mandou bem!`,`Boa tentativa!`,`Está evoluindo!`,`Nada mal!`,`Segue firme!`,`Bom avanço!`,`Você conseguiu!`,`Tá no caminho!`,`Bem jogado!`,`Foi positivo!`,`Boa partida!`,`Progresso feito!`,`Mais uma etapa!`],mt=[`Bom trabalho!`,`Boa jogada!`,`Foi muito bem!`,`Continue assim!`,`Segue firme!`,`Boa partida!`,`Mandou bem!`,`Você conseguiu!`],ht=[`Não foi dessa vez!`,`Quase lá!`,`Tente novamente!`,`Você consegue!`,`Foi por pouco!`,`Continue tentando!`,`A próxima é sua!`,`Não desista!`,`Boa tentativa!`,`Hora da revanche!`,`Mais uma chance!`,`Você está evoluindo!`,`Faz parte do jogo!`,`Dá para virar!`,`Vamos de novo!`,`Aprendizado feito!`,`Faltou pouco!`,`Na próxima vai!`,`Respira e tenta de novo!`,`O jogo ainda não acabou!`],gt=[`Empate!`,`Deu empate!`,`Jogo equilibrado!`,`Foi parelho!`,`Ninguém levou!`,`Disputa acirrada!`,`Boa partida!`,`Bem disputado!`,`Quase vitória!`,`Equilíbrio total!`,`Jogo justo!`,`Batalha equilibrada!`,`Ficou no empate!`,`Ninguém cedeu!`,`Partida apertada!`,`Resultado equilibrado!`,`Deu tudo igual!`,`Grande disputa!`,`Um duelo de respeito!`,`Hora da revanche!`];function _t(e){let t=e>=3?ft:e===2?pt:mt;return t[Math.floor(Math.random()*t.length)]}function vt(e){let t=e?gt:ht;return t[Math.floor(Math.random()*t.length)]}function H(e,t,n,r,i,a,o){dt();let s=document.createElement(`div`);s.className=`cel-overlay`;let c=[0,1,2].map(t=>`<span class="cel-star ${t<e?`earned`:`empty`}" style="animation-delay:${.4+t*.25}s">★</span>`).join(``);s.innerHTML=`
    <div class="cel-card">
      ${n?`<div class="cel-label">${n}</div>`:``}
      <div class="cel-title">${o??y(`stage_complete`)}</div>
      <div class="cel-stars">${c}</div>
      <div class="cel-phrase">${_t(e)}</div>
      ${t>0?`<div class="cel-xp">${y(`xp_gained`,{xp:t})}</div>`:``}
      <div class="cel-actions" id="cel-actions">
        ${r?`<button class="btn-cel-next" id="btn-cel-next">${y(`next_stage`)}</button>`:``}
        <button class="btn-cel-map" id="btn-cel-map">${y(`map`)}</button>
      </div>
    </div>`,document.body.appendChild(s);let l=s.querySelector(`#cel-actions`);l.style.opacity=`0`,setTimeout(()=>{l.style.opacity=`1`,l.style.transition=`opacity 0.4s`},2200),s.querySelector(`#btn-cel-next`)?.addEventListener(`click`,()=>{s.remove(),i()}),s.querySelector(`#btn-cel-map`)?.addEventListener(`click`,()=>{s.remove(),a()})}function U(e,t,n=!1,r){let i=!n&&r?`
    <div class="fail-skip-section">
      <span class="fail-skip-label">${y(`skip_phase`)}</span>
      ${r.available>0?`<button class="btn-ad" id="fa">${y(`skip_via_ad`,{n:r.available})}</button>`:`<span class="no-skips-label">${y(`no_skips_left`)}</span>`}
    </div>`:``,a=document.createElement(`div`);a.className=`fail-overlay`,a.innerHTML=`
    <div class="fail-card">
      <div class="fail-emoji">${n?`🤝`:`😞`}</div>
      <div class="fail-title">${y(n?`you_tied`:`you_lost`)}</div>
      <div class="fail-phrase">${vt(n)}</div>
      <div class="fail-actions">
        <button class="btn-retry-pay" id="fr">${y(`try_again`)}</button>
        <button class="btn-cel-map" id="fm">${y(`map`)}</button>
      </div>
      ${i}
    </div>`,document.body.appendChild(a),a.querySelector(`#fr`)?.addEventListener(`click`,()=>{a.remove(),e()}),a.querySelector(`#fm`)?.addEventListener(`click`,()=>{a.remove(),t()}),a.querySelector(`#fa`)?.addEventListener(`click`,()=>{a.remove(),r?.onSkip()})}function yt(e){let t=document.createElement(`div`);t.className=`ad-overlay`,t.innerHTML=`
    <div class="ad-card">
      <div class="ad-top"><span class="ad-tag">${y(`ad_label`)}</span><span class="ad-timer" id="at">5</span></div>
      <div class="ad-mock"><div class="ad-logo">🎮</div><div class="ad-text">${y(`ad_text`)}</div><div class="ad-cta">${y(`ad_cta`)}</div></div>
      <div class="ad-progress-wrap"><div class="ad-progress" id="ap"></div></div>
      <button class="btn-close-ad" id="ac" disabled>${y(`ad_close_timer`,{n:5})}</button>
    </div>`,document.body.appendChild(t);let n=5,r=t.querySelector(`#at`),i=t.querySelector(`#ac`),a=t.querySelector(`#ap`);a.style.transition=`width ${n}s linear`,requestAnimationFrame(()=>{a.style.width=`100%`});let o=setInterval(()=>{n--,r.textContent=String(n),i.textContent=n>0?y(`ad_close_timer`,{n}):y(`ad_close_ready`),n<=0&&(clearInterval(o),i.disabled=!1,i.classList.add(`ready`))},1e3);i.addEventListener(`click`,()=>{t.remove(),e()})}function bt(){let e=k(),t=document.createElement(`div`);t.className=`modal-overlay`,t.innerHTML=`
    <div class="modal-card">
      <div class="modal-header">
        <span>⚙ ${y(`settings`)}</span>
        <button class="modal-close" id="mc">✕</button>
      </div>
      <div class="settings-section">
        <label class="settings-label">${y(`theme`)}</label>
        <div class="theme-row">
          <button class="btn-theme-opt ${e===`dark`?`active`:``}" data-theme="dark">${y(`theme_dark`).replace(/^.\s/,``)}</button>
          <button class="btn-theme-opt ${e===`light`?`active`:``}" data-theme="light">${y(`theme_light`).replace(/^.\s/,``)}</button>
          <button class="btn-theme-opt ${e===`pink`?`active`:``}" data-theme="pink">${y(`theme_pink`).replace(/^.\s/,``)}</button>
        </div>
      </div>
      <div class="settings-section">
        <label class="settings-label">${y(`lang_label`)}</label>
        <div class="lang-selector settings-lang">${Tt()}</div>
      </div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${y(`settings_vibration`)}</label>
          <label class="toggle-switch" id="sv-wrap">
            <input type="checkbox" id="sv" ${Me()?`checked`:``}>
            <span class="toggle-track"></span>
          </label>
        </div>
      </div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${y(`settings_mute`)}</label>
          <label class="toggle-switch">
            <input type="checkbox" id="sm" ${E()?`checked`:``}>
            <span class="toggle-track"></span>
          </label>
        </div>
      </div>
      <div class="settings-section" id="music-vol-section" style="${E()?`opacity:.4;pointer-events:none`:``}">
        <label class="settings-label">${y(`settings_music`)}</label>
        <div class="music-vol-row">
          <span class="music-vol-icon">🔇</span>
          <input class="music-vol-slider" id="music-vol" type="range" min="0" max="100" value="${Math.round(D()*100)}" />
          <span class="music-vol-icon">🔊</span>
          <span class="music-vol-pct" id="music-vol-pct">${Math.round(D()*100)}%</span>
        </div>
      </div>
      <div class="settings-version">${ot}</div>
    </div>`,document.body.appendChild(t),t.querySelector(`#mc`)?.addEventListener(`click`,()=>t.remove()),t.addEventListener(`click`,e=>{e.target===t&&t.remove()}),t.querySelectorAll(`.btn-theme-opt`).forEach(e=>{e.onclick=()=>{Fe(e.dataset.theme),t.querySelectorAll(`.btn-theme-opt`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`)}}),t.querySelectorAll(`.btn-lang`).forEach(e=>{e.onclick=()=>{le(e.dataset.lang),t.remove(),X()}}),t.querySelector(`#sv`)?.addEventListener(`change`,e=>{let t=e.target.checked;Ne(t),t&&O(30)}),t.querySelector(`#sm`)?.addEventListener(`change`,e=>{let n=e.target.checked;ke(n),z.muted=n;let r=t.querySelector(`#music-vol-section`);r&&(r.style.opacity=n?`.4`:``,r.style.pointerEvents=n?`none`:``)}),t.querySelector(`#music-vol`)?.addEventListener(`input`,e=>{let n=parseInt(e.target.value,10)/100;Ae(n),z.volume=n;let r=t.querySelector(`#music-vol-pct`);r&&(r.textContent=`${Math.round(n*100)}%`),z.paused&&n>0&&z.play().catch(()=>{})})}function xt(e){let t=document.createElement(`div`);t.className=`modal-overlay`,t.innerHTML=`
    <div class="modal-card god-card">
      <div class="modal-header"><span>${y(`god_mode`)}</span><button class="modal-close" id="gc">✕</button></div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${y(`god_unlimited_energy`)}</label>
          <button class="god-toggle ${I.unlimitedEnergy?`on`:``}" id="ge">${I.unlimitedEnergy?y(`on_label`):y(`off_label`)}</button>
        </div>
      </div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${y(`god_skips`)} <span id="skip-count-label">${we()}/3</span></label>
          <button class="god-go" id="gsr">${y(`god_refill`)}</button>
        </div>
      </div>
      <div class="settings-section">
        <label class="settings-label">${y(`god_go_stage`)}</label>
        <div class="god-input-row">
          <input class="god-input" id="gs" type="number" min="1" max="500" placeholder="1-500" value="${e??1}" />
          <button class="god-go" id="gg">${y(`god_go`)}</button>
        </div>
      </div>
      ${e?`<button class="god-skip" id="gsk">${y(`god_next`,{id:e+1})}</button>`:``}
      <button class="god-refill" id="gr">${y(`god_refill`)}</button>
    </div>`,document.body.appendChild(t),t.querySelector(`#gc`)?.addEventListener(`click`,()=>t.remove()),t.addEventListener(`click`,e=>{e.target===t&&t.remove()});let n=t.querySelector(`#ge`);n.addEventListener(`click`,()=>{I.unlimitedEnergy=!I.unlimitedEnergy,Xe(I),n.textContent=I.unlimitedEnergy?y(`on_label`):y(`off_label`),n.classList.toggle(`on`,I.unlimitedEnergy),K()}),t.querySelector(`#gr`)?.addEventListener(`click`,()=>{qe(),K(),W(y(`energy_recharged`))}),t.querySelector(`#gsr`)?.addEventListener(`click`,()=>{Ee(3),t.querySelector(`#skip-count-label`).textContent=`3/3`,W(`3 pulos restaurados`)}),t.querySelector(`#gg`)?.addEventListener(`click`,()=>{let e=parseInt(t.querySelector(`#gs`).value,10);e>=1&&e<=500&&(t.remove(),P=null,F=null,Q(e,!0))}),t.querySelector(`#gsk`)?.addEventListener(`click`,()=>{e&&(t.remove(),P=null,F=null,Q(e+1,!0))})}function W(e){document.querySelectorAll(`.toast`).forEach(e=>e.remove());let t=document.createElement(`div`);t.className=`toast`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>{t.classList.add(`show`)}),setTimeout(()=>{t.classList.remove(`show`),setTimeout(()=>t.remove(),400)},2200)}var G=null;function K(){document.querySelectorAll(`#energy-display`).forEach(e=>{e.innerHTML=V()})}function St(){G&&clearInterval(G),G=setInterval(K,15e3)}function q(){G&&=(clearInterval(G),null)}var Ct={"pt-BR":`Português Brasil`,"pt-PT":`Português Portugal`,es:`Espanhol`,en:`Inglês`},wt={"pt-BR":`br`,"pt-PT":`pt`,es:`es`,en:`gb`};function Tt(){let e=ce();return Object.keys(Ct).map(t=>`<button class="btn-lang ${t===e?`active`:``}" data-lang="${t}" title="${Ct[t]}" aria-label="${Ct[t]}"><span class="fi fi-${wt[t]} fi-flag-icon"></span></button>`).join(``)}function Et(){return`<div class="lang-selector">${Tt()}</div>`}function Dt(e=document){e.querySelectorAll(`.btn-lang`).forEach(e=>{e.onclick=()=>{le(e.dataset.lang),X()}})}var J=0,Y=null;function X(){q(),P=null,F=null;let e=A(),t=Ve(e.xp),n=Object.values(e.stageProgress).filter(e=>e.stars>0).length,r=n===0;L.innerHTML=`
    <div class="screen menu-screen">

      <div class="topbar">
        <div></div>
        <div class="topbar-right">
          <button class="btn-settings-pill" id="btn-settings" title="${y(`settings`)}" aria-label="${y(`settings`)}">⚙</button>
          <button class="btn-profile-icon" id="btn-profile" title="${y(`profile`)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </button>
        </div>
      </div>

      <div class="menu-logo" id="menu-title">
        <h1>Dots &amp; Boxes</h1>
        <p class="menu-tagline">${y(`tagline`)}</p>
      </div>

      <div class="rank-card">
        <div class="rank-ring-wrap">
          ${ut(e.xp)}
        </div>
        <div class="rank-info">
          <span class="rank-name">${t.rank}</span>
          <span class="rank-xp">${e.xp.toLocaleString()} XP</span>
        </div>
        ${I.unlimitedEnergy?`<button class="btn-god-ring" id="btn-god-menu">👑</button>`:``}
      </div>

      <div id="energy-display">${V()}</div>

      <div class="menu-buttons">
        <button class="btn-menu btn-arcade" id="btn-arcade">
          <div class="btn-menu-icon-wrap btn-icon--arcade">${at}</div>
          <div class="btn-menu-text">
            <strong>${y(`menu_arcade`)}</strong>
            <small>${y(`menu_arcade_sub`,{done:n,total:50})}</small>
          </div>
          ${r?`<span class="badge-new">NEW</span>`:``}
        </button>
        <button class="btn-menu btn-bot" id="btn-bot">
          <div class="btn-menu-icon-wrap btn-icon--bot">${$e}</div>
          <div class="btn-menu-text">
            <strong>${y(`menu_bot`)}</strong>
            <small>${y(`menu_bot_sub`)}</small>
          </div>
        </button>
        <button class="btn-menu btn-multi" id="btn-multi">
          <div class="btn-menu-icon-wrap btn-icon--multi">${et}</div>
          <div class="btn-menu-text">
            <strong>${y(`menu_multi`)}</strong>
            <small>${y(`menu_multi_sub`)}</small>
          </div>
        </button>
      </div>

      ${Et()}

      <button class="btn-menu btn-tutorial" id="btn-tutorial">
        <div class="btn-menu-icon-wrap btn-icon--tutorial">${tt}</div>
        <div class="btn-menu-text">
          <strong>${y(`menu_tutorial`)}</strong>
          <small>${y(`menu_tutorial_sub`)}</small>
        </div>
      </button>

      <div class="theme-toggle-wrap">
        <button class="theme-toggle-opt ${k()===`dark`?`active`:``}" data-t="dark" title="${y(`theme_dark`).replace(/^.\s/,``)}">🌙</button>
        <button class="theme-toggle-opt ${k()===`light`?`active`:``}" data-t="light" title="${y(`theme_light`).replace(/^.\s/,``)}">☀️</button>
        <button class="theme-toggle-opt ${k()===`pink`?`active`:``}" data-t="pink" title="${y(`theme_pink`).replace(/^.\s/,``)}">🌸</button>
      </div>

      <div class="bottom-bar">
        <div class="platform-pills">
          <span class="platform-pill">${it} PC</span>
          <span class="platform-pill">${nt} Android</span>
          <span class="platform-pill">${rt} IOS</span>
        </div>
        <div class="bottom-star">✦</div>
        <div class="version-tag">${ot}</div>
      </div>

    </div>`,St(),document.getElementById(`btn-arcade`).onclick=Z,document.getElementById(`btn-bot`).onclick=At,document.getElementById(`btn-multi`).onclick=jt,document.getElementById(`btn-tutorial`).onclick=Mt,document.querySelectorAll(`.theme-toggle-opt`).forEach(e=>{e.onclick=()=>{Fe(e.dataset.t),X()}}),document.getElementById(`btn-settings`).onclick=bt,document.getElementById(`btn-profile`)?.addEventListener(`click`,()=>W(`👤 `+y(`profile`)+` — em breve!`)),document.getElementById(`btn-god-menu`)?.addEventListener(`click`,()=>xt()),Dt(),document.getElementById(`menu-title`).addEventListener(`click`,()=>{J++,Y&&clearTimeout(Y),Y=setTimeout(()=>{J=0},3e3),J>=7&&(J=0,I.unlimitedEnergy=!I.unlimitedEnergy,Xe(I),W(I.unlimitedEnergy?y(`god_activated`):y(`god_deactivated`)),X())})}function Z(){q();let e=A(),t=``;for(let n=1;n<=50;n++){let r=e.stageProgress[n]?.stars??0,i=n===1||(e.stageProgress[n-1]?.stars??0)>0,a=`★`.repeat(r)+`☆`.repeat(3-r);t+=`<button class="stage-cell ${i?`unlocked`:`locked`} stars-${r}" data-stage="${n}" ${i?``:`disabled`}>
      <span class="stage-num">${n}</span><span class="stage-stars">${a}</span></button>`}L.innerHTML=`
    <div class="screen arcade-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${y(`back`)}</button>
        <h2>🕹️ Arcade</h2>
        <div id="energy-display" style="font-size:.75rem">${V()}</div>
      </div>
      <div class="stage-grid">${t}</div>
    </div>`,St(),document.getElementById(`btn-back`).onclick=X,document.querySelectorAll(`.stage-cell.unlocked`).forEach(e=>{e.onclick=()=>Q(parseInt(e.dataset.stage,10))})}var Ot={"muito-facil":{icon:`☆`,tier:`easy`},facil:{icon:`☆`,tier:`easy`},medio:{icon:`😊`,tier:`easy`},dificil:{icon:`😠`,tier:`hard`},"muito-dificil":{icon:`😠`,tier:`hard`},impossivel:{icon:`💀`,tier:`hard`},impulsivo:{icon:`🎲`,tier:`wild`}};function kt(e){return`<div class="dot-grid-preview" style="grid-template-columns:repeat(${e},1fr)">${Array.from({length:e*e},()=>`<span class="dot-preview"></span>`).join(``)}</div>`}function At(){q(),L.innerHTML=`
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${y(`back`)}</button>
        <h2>🏋️ ${y(`menu_bot`)}</h2>
        <span class="header-end-spacer"></span>
      </div>
      <div class="setup-section">
        <label class="setup-label">${y(`setup_difficulty`)}</label>
        <div class="diff-grid">${pe.map(e=>{let t=Ot[e];return`<button class="btn-diff btn-diff--${t.tier}" data-diff="${e}"><span class="diff-icon">${t.icon}</span>${fe(e)}</button>`}).join(``)}</div>
      </div>
      <div class="setup-section">
        <label class="setup-label">${y(`setup_grid`)}</label>
        <div class="grid-size-row">${[3,4,5,6].map(e=>`<button class="btn-grid-size" data-size="${e}"><span class="grid-size-label">${e}×${e}</span>${kt(e)}</button>`).join(``)}</div>
      </div>
      <button class="btn-start" id="btn-start" disabled>${y(`setup_start`)}</button>
    </div>`,document.getElementById(`btn-back`).onclick=X;let e=null,t=4;document.querySelector(`[data-size="4"]`).classList.add(`selected`),document.querySelectorAll(`.btn-diff`).forEach(t=>{t.onclick=()=>{document.querySelectorAll(`.btn-diff`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),e=t.dataset.diff,document.getElementById(`btn-start`).disabled=!1}}),document.querySelectorAll(`.btn-grid-size`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-grid-size`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),t=parseInt(e.dataset.size,10)}}),document.getElementById(`btn-start`).onclick=()=>{e&&$(e,t)}}function jt(){q(),L.innerHTML=`
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${y(`back`)}</button>
        <h2>👥 ${y(`menu_multi`)}</h2>
      </div>
      <div class="setup-section">
        <label class="setup-label">${y(`setup_players`)}</label>
        <div class="grid-size-row">${[2,3,4].map(e=>`<button class="btn-player-count" data-count="${e}">${e}</button>`).join(``)}</div>
      </div>
      <div class="setup-section" id="team-section" style="display:none">
        <label class="setup-label">${y(`setup_mode`)}</label>
        <div class="grid-size-row">
          <button class="btn-team-mode selected" data-team="false">${y(`setup_solo`)}</button>
          <button class="btn-team-mode" data-team="true">${y(`setup_teams`)}</button>
        </div>
      </div>
      <div class="setup-section">
        <label class="setup-label">${y(`setup_grid`)}</label>
        <div class="grid-size-row">${[3,4,5,6].map(e=>`<button class="btn-grid-size" data-size="${e}">${e}×${e}</button>`).join(``)}</div>
      </div>
      <button class="btn-start" id="btn-start" disabled>${y(`setup_start`)}</button>
    </div>`,document.getElementById(`btn-back`).onclick=X;let e=0,t=!1,n=4;document.querySelector(`[data-size="4"]`).classList.add(`selected`),document.querySelectorAll(`.btn-player-count`).forEach(t=>{t.onclick=()=>{document.querySelectorAll(`.btn-player-count`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),e=parseInt(t.dataset.count,10),document.getElementById(`team-section`).style.display=e===4?`block`:`none`,document.getElementById(`btn-start`).disabled=!1}}),document.querySelectorAll(`.btn-team-mode`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-team-mode`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),t=e.dataset.team===`true`}}),document.querySelectorAll(`.btn-grid-size`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-grid-size`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),n=parseInt(e.dataset.size,10)}}),document.getElementById(`btn-start`).onclick=()=>{e&&Nt(e,t,n)}}function Mt(){q();let e=[{icon:`•••`,title:y(`tut_step1_title`),desc:y(`tut_step1_desc`)},{icon:`⬜`,title:y(`tut_step2_title`),desc:y(`tut_step2_desc`)},{icon:`★`,title:y(`tut_step3_title`),desc:y(`tut_step3_desc`)},{icon:`🔄`,title:y(`tut_step4_title`),desc:y(`tut_step4_desc`)}];L.innerHTML=`
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${y(`back`)}</button>
        <h2>🎓 ${y(`menu_tutorial`)}</h2>
        <span class="header-end-spacer"></span>
      </div>
      <div class="tut-steps">
        ${e.map((e,t)=>`
          <div class="tut-step">
            <div class="tut-step-num">${t+1}</div>
            <div class="tut-step-body">
              <strong>${e.title}</strong>
              <span>${e.desc}</span>
            </div>
          </div>`).join(``)}
      </div>
      <div class="tut-board-hint">
        <div class="tut-grid">${Array.from({length:9},(e,t)=>`<div class="tut-dot ${t===4?`tut-dot--hl`:``}"></div>`).join(``)}</div>
        <p class="tut-hint-text">${y(`tut_hint`)}</p>
      </div>
    </div>`,document.getElementById(`btn-back`).onclick=X}function Q(e,t=!1){if(!t&&!I.unlimitedEnergy&&!Ke()){W(y(`energy_no`));return}let n=xe(e);P={mode:`arcade`,stageId:e,botDifficulty:n.difficulty,controller:new m({gridSize:n.gridSize,players:[{name:y(`you`),color:R[0]},{name:y(`bot`),color:R[1]}]}),botPlayerId:`p2`,botThinking:!1,freeRetry:!1,maxChain:0},Pt()}function $(e,t){P={mode:`vs-bot`,botDifficulty:e,controller:new m({gridSize:t,players:[{name:y(`you`),color:R[0]},{name:y(`bot`),color:R[1]}]}),botPlayerId:`p2`,botThinking:!1,freeRetry:!1},Pt()}function Nt(e,t,n){let r=lt();P={mode:`multi`,teamMode:t,playerCount:e,controller:new m({gridSize:n,players:Array.from({length:e},(e,t)=>({name:r[t],color:R[t]}))}),botThinking:!1,freeRetry:!1},Pt()}function Pt(){if(!P)return;let e=P;q();let t=e.mode===`arcade`?`🕹️ ${y(`stage_label`,{id:e.stageId})}`:e.mode===`vs-bot`?`🏋️ ${y(`menu_bot`)} · ${fe(e.botDifficulty)}`:`👥 ${e.teamMode?y(`teams_2v2`):y(`n_players`,{n:e.playerCount})}`;L.innerHTML=`
    <div class="screen game-screen">
      <div class="game-hud">
        <div class="screen-header">
          <button class="btn-back" id="btn-back">${y(`back`)}</button>
          <h2>${t}</h2>
          ${I.unlimitedEnergy?`<button class="btn-god-corner" id="btn-god-game">👑</button>`:`<span class="header-end-spacer"></span>`}
        </div>
        <div id="scoreboard" class="scoreboard"></div>
        <div id="status" class="status"></div>
      </div>
      <div class="canvas-wrapper"><canvas id="board"></canvas></div>
    </div>`,document.getElementById(`btn-back`).onclick=()=>{P=null,F=null,e.mode===`arcade`?Z():e.mode===`vs-bot`?At():jt()},document.getElementById(`btn-god-game`)?.addEventListener(`click`,()=>xt(e.stageId));let n=document.getElementById(`board`),i=n.getContext(`2d`);function a(){let t=e.controller.getState(),{width:r,height:a}=re(t.gridSize);n.width=r,n.height=a,ie(i,t,F,e.teamMode??!1),o()}function o(){let t=e.controller.getState(),n=document.getElementById(`scoreboard`),r=document.getElementById(`status`);if(!(!n||!r)){if(e.teamMode&&e.playerCount===4){let e=t.players.filter((e,t)=>t%2==0).reduce((e,t)=>e+t.score,0),r=t.players.filter((e,t)=>t%2==1).reduce((e,t)=>e+t.score,0);n.innerHTML=`<div class="team-chip" style="--pc:${R[0]}">${y(`team_a`)} <strong>${e}</strong></div><div class="team-chip" style="--pc:${R[1]}">${y(`team_b`)} <strong>${r}</strong></div>`}else n.innerHTML=t.players.map(e=>`<div class="player-chip ${e.id===t.currentPlayerId&&t.status===`playing`?`player-chip--active`:``}" style="--pc:${e.color}"><span class="player-dot"></span><span class="player-name">${e.name}</span><span class="player-score">${e.score}</span></div>`).join(``);if(t.status===`finished`)r.textContent=``,s();else if(e.botThinking)r.textContent=y(`game_bot_thinking`),r.style.color=`var(--text-2)`;else{let e=t.players.find(e=>e.id===t.currentPlayerId);r.textContent=y(`game_turn`,{name:e.name}),r.style.color=e.color}}}function s(){let t=e.controller.getState(),n=Math.max(...t.players.map(e=>e.score));if(e.mode===`arcade`&&e.stageId!=null){let n=xe(e.stageId),r=t.players.find(t=>t.id!==e.botPlayerId),i=t.players.find(t=>t.id===e.botPlayerId),a=r.score>i.score,o=r.score===i.score;if(a){let t=(n.gridSize-1)**2,a=1,o=100;if(n.objectiveType===`win`)r.score>=Math.ceil(t*.65)?(a=3,o+=100):r.score>=Math.ceil(t*.5)&&(a=2,o+=50);else if(n.objectiveType===`margin`)r.score-i.score>=n.objectiveValue+2?(a=3,o+=100):r.score-i.score>=n.objectiveValue&&(a=2,o+=50);else if(n.objectiveType===`dominance`)r.score/t>=.75?(a=3,o+=100):r.score/t>=n.objectiveValue/100&&(a=2,o+=50);else if(n.objectiveType===`clean`)i.score===0&&r.score-i.score>=3?(a=3,o+=100):i.score===0&&(a=2,o+=50);else if(n.objectiveType===`chain`){let t=e.maxChain??0;t>=3?(a=3,o+=100):t>=2&&(a=2,o+=50)}Be(e.stageId,a,r.score*100,o);let s=e.stageId<50?e.stageId+1:null;H(a,o,y(`stage_label`,{id:e.stageId}),s,()=>{s?Q(s):Z()},()=>{P=null,F=null,Z()})}else{let t=()=>{if(!I.unlimitedEnergy&&!Ke()){W(y(`energy_no`));return}P=null,F=null,Q(e.stageId,!0)},n=()=>{P=null,F=null,Z()},r=e.stageId<50?e.stageId+1:null;U(t,n,o,!o&&r!=null?{available:we(),onSkip:()=>yt(()=>{Te()?(P=null,F=null,Q(r,!0)):W(y(`no_skips_left`))})}:void 0)}}else if(e.mode===`vs-bot`){let r=t.players.find(t=>t.id!==e.botPlayerId),i=t.players.find(t=>t.id===e.botPlayerId);r.score===i.score?U(()=>$(e.botDifficulty,t.gridSize),X,!0):r.score===n?H(1,60,y(`victory`),null,()=>$(e.botDifficulty,t.gridSize),X):U(()=>$(e.botDifficulty,t.gridSize),X)}else{let r=t.players.filter(e=>e.score===n);H(3,80,``,null,()=>Nt(e.playerCount,e.teamMode,t.gridSize),X,r.length===1?`${r[0].name} ${y(`won_suffix`)}`:y(`tie`))}}function c(){return!!e.botPlayerId&&e.controller.getState().currentPlayerId===e.botPlayerId}function l(){e.botDifficulty&&(e.botThinking=!0,o(),setTimeout(()=>{if(!P||P!==e)return;let t=e.controller.getState();t.status===`finished`||!c()||(e.controller.playLine(_e(t,e.botDifficulty)),e.botThinking=!1,a(),c()&&e.controller.getState().status!==`finished`&&l())},ve(e.botDifficulty)))}function u(t){let n=e.controller.getState();if(n.status===`finished`||e.botThinking||c()||t.ownerId!==null)return;let r=e.botPlayerId==null?0:n.players.find(t=>t.id!==e.botPlayerId)?.score??0;e.controller.playLine(t),F=null,a();let i=e.botPlayerId==null?0:e.controller.getState().players.find(t=>t.id!==e.botPlayerId)?.score??0;if(O(i>r?[40,20,40]:18),e.mode===`arcade`&&e.botPlayerId!=null){let t=i-r;t>(e.maxChain??0)&&(e.maxChain=t)}c()&&e.controller.getState().status!==`finished`&&l()}n.addEventListener(`mousemove`,t=>{let i=e.controller.getState();if(i.status===`finished`||e.botThinking||c())return;let{x:o,y:s}=B(n,t.clientX,t.clientY),l=ae(i,o,s),u=l?.ownerId===null?l:null;(F?r(F):null)!==(u?r(u):null)&&(F=u,a()),n.style.cursor=F?`pointer`:`default`}),n.addEventListener(`mouseleave`,()=>{F=null,a(),n.style.cursor=`default`}),n.addEventListener(`click`,t=>{let{x:r,y:i}=B(n,t.clientX,t.clientY),a=ae(e.controller.getState(),r,i);a&&u(a)}),n.addEventListener(`touchend`,t=>{t.preventDefault();let r=t.changedTouches[0];if(!r)return;let{x:i,y:a}=B(n,r.clientX,r.clientY),o=ae(e.controller.getState(),i,a);o&&u(o)},{passive:!1}),a(),c()&&l()}var Ft=document.createElement(`style`);Ft.textContent=`
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
html[data-theme="pink"] {
  --bg:            #fdf2f8;
  --bg-2:          #fff0f6;
  --bg-3:          #fce7f3;
  --border:        rgba(236,72,153,0.15);
  --border-strong: rgba(236,72,153,0.3);
  --text:          #1a202c;
  --text-2:        #6b3a5a;
  --text-3:        #a8729a;
  --shadow:        0 2px 12px rgba(236,72,153,0.12);
  --ring-bg:       rgba(236,72,153,0.1);
  --btn-bg:        #fbcfe8;
  --arcade-border: linear-gradient(135deg,#ec4899,#f9a8d4);
  --arcade-glow:   0 0 16px rgba(236,72,153,0.2);
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

/* Imagem de fundo */
body::before {
  content: '';
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
html[data-theme="dark"] body::before {
  background-image: url('./bg-dark-mobile.jpeg');
}
html[data-theme="light"] body::before { background-image: url('./bg-light-mobile.jpeg'); }
html[data-theme="pink"]  body::before { background-image: url('./bg-pink-mobile.jpeg'); }
@media (min-width: 768px) {
  html[data-theme="dark"]  body::before { background-image: url('./bg-dark.jpeg'); }
  html[data-theme="light"] body::before { background-image: url('./bg-light.jpeg'); }
  html[data-theme="pink"]  body::before { background-image: url('./bg-light.jpeg'); }
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
  display: flex; align-items: center; justify-content: center;
  background: var(--bg-2); border: 1px solid var(--border-strong);
  border-radius: 50%; width: 38px; height: 38px; color: var(--text-2);
  cursor: pointer; font-size: 1.25rem;
  transition: all .15s; backdrop-filter: blur(8px);
}
.btn-settings-pill:hover { background: var(--bg-3); color: var(--text); transform: rotate(30deg); }
.btn-profile-icon {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--bg-2); border: 1px solid var(--border-strong);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--text-2); transition: all .15s;
}
.btn-profile-icon:hover { background: var(--bg-3); color: var(--text); }
.btn-profile-icon svg { width: 18px; height: 18px; }

/* ── MENU ────────────────────────────────────────────────────── */
.menu-screen { justify-content: flex-start; padding-top: 4px; gap: 14px; }
.menu-logo { cursor: pointer; user-select: none; text-align: center; }
.menu-logo h1 {
  font-size: 2.4rem; font-weight: 900; letter-spacing: -1px;
  background: var(--title-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
html[data-theme="light"] .menu-logo h1,
html[data-theme="pink"] .menu-logo h1 {
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
.energy-count { font-weight: 800; color: #22c55e; font-size: .9rem; min-width: 36px; }
.e-dots-wrap { display: none; }
.menu-screen .energy-row { flex-wrap: wrap; justify-content: center; row-gap: 6px; }
.menu-screen .e-dots-wrap { display: flex; flex-basis: 100%; justify-content: center; gap: 3px; }
.menu-screen .e-bar-wrap  { display: none; }
.e-bar-wrap {
  display: flex; flex: 1; max-width: 200px; height: 13px;
  background: rgba(0,0,0,.35); border-radius: 6px; overflow: hidden;
  border: 1px solid rgba(255,255,255,.1);
  box-shadow: inset 0 1px 3px rgba(0,0,0,.4);
}
.e-bar-fill {
  height: 100%; border-radius: 6px; transition: width .4s ease;
  background: linear-gradient(90deg, #16a34a 0%, #22c55e 60%, #86efac 100%);
  box-shadow: 0 0 10px #22c55e88;
  background-size: 200px 100%;
}

/* ── MENU BUTTONS ────────────────────────────────────────────── */
.menu-buttons { display: flex; flex-direction: column; gap: 10px; width: 100%; }

.btn-menu {
  display: flex; align-items: center; gap: 14px;
  border-radius: 16px; padding: 14px 16px;
  cursor: pointer; color: var(--text);
  transition: all .15s; width: 100%; position: relative;
  overflow: hidden;
}
.btn-menu:active { transform: scale(.985); }
.btn-menu-icon-wrap {
  width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.35rem; transition: transform .15s;
}
.btn-menu-icon-wrap svg { display: block; flex-shrink: 0; }
.btn-menu:hover .btn-menu-icon-wrap { transform: scale(1.08); }
.btn-menu-text { flex: 1; display: flex; flex-direction: column; gap: 2px; align-items: center; }
.btn-menu-text strong { font-size: .98rem; display: block; font-weight: 700; }
.btn-menu-text small  { font-size: .76rem; color: var(--text-2); }

/* Arcade */
.btn-arcade {
  background: rgba(0,0,0,.82); border: 1.5px solid rgba(6,182,212,.5);
  box-shadow: 0 0 14px rgba(6,182,212,.12);
}
.btn-arcade:hover { border-color: #06b6d4; background: rgba(0,0,0,.9); box-shadow: 0 0 22px rgba(6,182,212,.22); }
.btn-icon--arcade { background: rgba(6,182,212,.14); border: 1.5px solid rgba(6,182,212,.5); color: #06b6d4; }

/* Bot */
.btn-bot {
  background: rgba(0,0,0,.82); border: 1.5px solid rgba(236,72,153,.5);
  box-shadow: 0 0 14px rgba(236,72,153,.12);
}
.btn-bot:hover { border-color: #ec4899; background: rgba(0,0,0,.9); box-shadow: 0 0 22px rgba(236,72,153,.22); }
.btn-icon--bot { background: rgba(236,72,153,.14); border: 1.5px solid rgba(236,72,153,.5); }

/* Multi */
.btn-multi {
  background: rgba(0,0,0,.82); border: 1.5px solid rgba(139,92,246,.5);
  box-shadow: 0 0 14px rgba(139,92,246,.12);
}
.btn-multi:hover { border-color: #8b5cf6; background: rgba(0,0,0,.9); box-shadow: 0 0 22px rgba(139,92,246,.22); }
.btn-icon--multi { background: rgba(139,92,246,.14); border: 1.5px solid rgba(139,92,246,.5); }

/* Tutorial */
.btn-tutorial {
  background: rgba(0,0,0,.82); border: 1.5px solid rgba(245,158,11,.5);
  box-shadow: 0 0 14px rgba(245,158,11,.12);
}
.btn-tutorial:hover { border-color: #f59e0b; background: rgba(0,0,0,.9); box-shadow: 0 0 22px rgba(245,158,11,.22); }
.btn-icon--tutorial { background: rgba(245,158,11,.14); border: 1.5px solid rgba(245,158,11,.5); }

html[data-theme="light"] .btn-arcade,
html[data-theme="light"] .btn-bot,
html[data-theme="light"] .btn-multi,
html[data-theme="light"] .btn-tutorial { background: #d1d5db; }
html[data-theme="light"] .btn-arcade:hover,
html[data-theme="light"] .btn-bot:hover,
html[data-theme="light"] .btn-multi:hover,
html[data-theme="light"] .btn-tutorial:hover { background: #b8bcc4; }
html[data-theme="pink"] .btn-arcade,
html[data-theme="pink"] .btn-bot,
html[data-theme="pink"] .btn-multi,
html[data-theme="pink"] .btn-tutorial { background: #fbcfe8; }
html[data-theme="pink"] .btn-arcade:hover,
html[data-theme="pink"] .btn-bot:hover,
html[data-theme="pink"] .btn-multi:hover,
html[data-theme="pink"] .btn-tutorial:hover { background: #f9a8d4; }

/* Pink — seleções e interativos */
html[data-theme="pink"] .btn-lang.active { border-color: #ec4899; box-shadow: 0 0 0 2px rgba(236,72,153,.3); }
html[data-theme="pink"] .btn-theme-opt.active { background: rgba(236,72,153,.15); border-color: #ec4899; color: #be185d; }
html[data-theme="pink"] .btn-diff.selected,
html[data-theme="pink"] .btn-grid-size.selected,
html[data-theme="pink"] .btn-player-count.selected,
html[data-theme="pink"] .btn-team-mode.selected { background: rgba(236,72,153,.15); border-color: #ec4899; color: #be185d; }
html[data-theme="pink"] .btn-grid-size.selected .dot-preview { background: #ec4899; }
html[data-theme="pink"] .btn-start { background: #ec4899; box-shadow: 0 4px 16px rgba(236,72,153,.35); }
html[data-theme="pink"] .btn-start:hover:not(:disabled) { background: #db2777; }
html[data-theme="pink"] .btn-ad { border-color: #ec4899; color: #be185d; }
html[data-theme="pink"] .btn-ad:hover { background: rgba(236,72,153,.1); }
html[data-theme="pink"] .stage-cell.unlocked:hover { border-color: rgba(236,72,153,.5); }
html[data-theme="pink"] .stage-cell.stars-3 { border-color: rgba(236,72,153,.6); }
html[data-theme="pink"] .btn-lang.active { border-color: #ec4899; }

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
  border-radius: 10px; width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: 1.6rem; line-height: 1;
  transition: all .15s; padding: 0;
}
.btn-lang .fi-flag-icon { border-radius: 3px; box-shadow: 0 1px 3px rgba(0,0,0,.3); }
.btn-lang:hover { border-color: var(--border-strong); transform: scale(1.1); }
.btn-lang.active { border-color: #3b9df8; box-shadow: 0 0 0 2px rgba(59,157,248,0.35); transform: scale(1.1); }

/* ── BOTTOM BAR ──────────────────────────────────────────────── */
.bottom-bar {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  margin-top: auto; padding-top: 8px; width: 100%;
  position: relative;
}
/* ── TOGGLE DE TEMA ──────────────────────────────────────────── */
.theme-toggle-wrap {
  display: flex;
  background: var(--bg-2); border: 1.5px solid var(--border-strong);
  border-radius: 20px; overflow: hidden;
}
.theme-toggle-opt {
  flex: 1; padding: 5px 10px; font-size: .75rem; font-weight: 800;
  cursor: pointer; border: none; background: transparent;
  color: var(--text-2); transition: all .15s; white-space: nowrap;
}
.theme-toggle-opt:hover { color: var(--text); }
.theme-toggle-opt.active {
  background: var(--border-strong); color: var(--text);
}

.platform-pills {
  display: flex; gap: 12px;
  border: 1.5px solid var(--border-strong); border-radius: 20px;
  padding: 5px 18px;
  background: var(--bg-2);
}
.platform-pill {
  display: flex; align-items: center; gap: 4px;
  font-size: .75rem; font-weight: 800;
  color: var(--text-2); letter-spacing: .8px;
}
.platform-pill svg { flex-shrink: 0; }
.bottom-star {
  position: absolute; right: 0; bottom: 2px;
  font-size: 1.3rem; color: var(--text-3); opacity: .5;
  font-family: serif;
}
.version-tag {
  position: absolute; right: 0; top: 0;
  font-size: .68rem; color: var(--text-3);
}

@media (max-width: 767px) {
  .menu-logo {
    margin-top: clamp(18px, 4vh, 56px);
  }
  .bottom-bar {
    padding-bottom: 4px;
  }
  .screen:not(.menu-screen):not(.game-screen) {
    padding-top: clamp(48px, 8vh, 80px);
  }
}

/* ── HEADER (outras telas) ───────────────────────────────────── */
.screen-header {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; gap: 10px; padding-bottom: 4px;
}
.screen-header h2 { flex: 1; text-align: center; font-size: 1.1rem; font-weight: 800; color: var(--text); }
.header-end-spacer { flex: 0 0 72px; }
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
.btn-diff:hover, .btn-player-count:hover, .btn-team-mode:hover { background: var(--bg-3); }
.btn-player-count.selected, .btn-team-mode.selected {
  background: rgba(59,157,248,.15); border-color: #3b9df8; color: #3b9df8;
}
/* Difficulty buttons — layout + tier colors */
.btn-diff { display: flex; align-items: center; gap: 8px; text-align: left; }
.btn-diff:last-child:nth-child(odd) { grid-column: 1 / -1; justify-content: center; }
.diff-icon { font-size: 1rem; flex-shrink: 0; }
.btn-diff--easy  { border-color: rgba(6,182,212,.4); }
.btn-diff--easy:hover  { border-color: #06b6d4; background: rgba(6,182,212,.06); }
.btn-diff--easy.selected  { background: rgba(6,182,212,.14); border-color: #06b6d4; color: #06b6d4; }
.btn-diff--hard  { border-color: rgba(168,85,247,.4); }
.btn-diff--hard:hover  { border-color: #a855f7; background: rgba(168,85,247,.06); }
.btn-diff--hard.selected  { background: rgba(168,85,247,.14); border-color: #a855f7; color: #a855f7; }
.btn-diff--wild  { border-color: rgba(249,115,22,.4); }
.btn-diff--wild:hover  { border-color: #f97316; background: rgba(249,115,22,.06); }
.btn-diff--wild.selected  { background: rgba(249,115,22,.14); border-color: #f97316; color: #f97316; }
/* Grid size buttons with dot preview */
.btn-grid-size { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 8px; }
.btn-grid-size:hover { background: var(--bg-3); }
.btn-grid-size.selected { background: rgba(59,157,248,.15); border-color: #3b9df8; color: #3b9df8; }
.grid-size-label { font-weight: 700; font-size: .85rem; }
.dot-grid-preview { display: grid; gap: 3px; }
.dot-preview { width: 5px; height: 5px; border-radius: 50%; background: rgba(140,155,180,.4); }
.btn-grid-size.selected .dot-preview { background: #3b9df8; }
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
/* "mobile" e "responsivo" são equivalentes neste projeto: max-width: 767px */
.game-screen {
  position: relative; padding: 0; gap: 0;
  display: flex; align-items: center; justify-content: center;
}
.game-hud {
  position: absolute; top: 10px; left: 16px; right: 16px;
  display: flex; flex-direction: column; gap: 10px; z-index: 2;
  pointer-events: none;
}
.game-hud > * { pointer-events: auto; }
.game-screen .canvas-wrapper { display: flex; justify-content: center; }
@media (max-width: 767px) {
  .game-screen .canvas-wrapper { margin-bottom: 40px; }
}
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
.music-vol-row { display: flex; align-items: center; gap: 8px; width: 100%; }
.music-vol-icon { font-size: 1rem; flex-shrink: 0; }
.music-vol-slider { flex: 1; height: 4px; accent-color: #3b9df8; cursor: pointer; border-radius: 4px; }
.music-vol-pct { font-size: .78rem; font-weight: 700; color: var(--text-2); min-width: 36px; text-align: right; }
html[data-theme="pink"] .music-vol-slider { accent-color: #ec4899; }

/* Toggle switch (vibração) */
.toggle-switch { position: relative; width: 46px; height: 26px; cursor: pointer; flex-shrink: 0; }
.toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
.toggle-track {
  position: absolute; inset: 0; border-radius: 13px;
  background: var(--border-strong); transition: background .2s;
}
.toggle-track::after {
  content: ""; position: absolute;
  width: 20px; height: 20px; border-radius: 50%;
  background: #fff; top: 3px; left: 3px;
  transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.3);
}
.toggle-switch input:checked + .toggle-track { background: #22c55e; }
.toggle-switch input:checked + .toggle-track::after { transform: translateX(20px); }
html[data-theme="pink"] .toggle-switch input:checked + .toggle-track { background: #ec4899; }

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
.cel-phrase { font-size: 1.1rem; font-weight: 700; color: #e6edf3; letter-spacing: .3px; animation: fadeInUp .4s .85s both; text-align: center; }
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
.fail-phrase { font-size: 1rem; font-weight: 600; color: #e6edf3; letter-spacing: .3px; animation: fadeInUp .4s .45s both; text-align: center; }
.fail-actions { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.btn-retry-pay { background: #e74c3c; border: none; border-radius: 10px; padding: 12px 24px; color: #fff; font-weight: 700; cursor: pointer; font-size: .95rem; transition: background .15s; }
.btn-retry-pay:hover { background: #c0392b; }
/* ── TUTORIAL ────────────────────────────────────────────────── */
.tut-steps { display: flex; flex-direction: column; gap: 10px; width: 100%; }
.tut-step { display: flex; align-items: flex-start; gap: 12px; background: var(--bg-2); border: 1px solid var(--border); border-radius: 12px; padding: 12px 14px; }
.tut-step-num { width: 28px; height: 28px; border-radius: 50%; background: rgba(245,158,11,.15); border: 1.5px solid rgba(245,158,11,.55); color: #f59e0b; font-weight: 800; font-size: .85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tut-step-body { display: flex; flex-direction: column; gap: 3px; }
.tut-step-body strong { font-size: .9rem; font-weight: 700; color: var(--text); }
.tut-step-body span { font-size: .78rem; color: var(--text-2); line-height: 1.4; }
.tut-board-hint { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px; background: var(--bg-2); border: 1px solid var(--border); border-radius: 12px; width: 100%; }
.tut-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; padding: 4px; }
.tut-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(140,155,180,.45); }
.tut-dot--hl { background: #06b6d4; box-shadow: 0 0 8px #06b6d4; }
.tut-hint-text { font-size: .76rem; color: var(--text-2); text-align: center; }

.fail-skip-section { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.08); }
.fail-skip-label { font-size: .8rem; color: var(--text-2); font-weight: 600; }
.no-skips-label { font-size: .78rem; color: var(--text-3); }
.btn-ad { background: transparent; border: 1px solid #3b9df8; border-radius: 10px; padding: 12px 24px; color: #3b9df8; font-weight: 700; cursor: pointer; font-size: .95rem; transition: all .15s; width: 100%; }
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
`,document.head.appendChild(Ft),document.addEventListener(`click`,e=>{let t=e.target;t.closest(`button`)&&!t.closest(`canvas`)&&O(8)},{passive:!0}),X();