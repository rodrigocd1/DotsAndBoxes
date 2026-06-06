(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t){return{row:e,col:t}}function t(e){return`${e.row}:${e.col}`}function n(e,t){let n=e.row===t.row&&Math.abs(e.col-t.col)===1,r=e.col===t.col&&Math.abs(e.row-t.row)===1;return n||r}function r(t,r,i=null){if(!n(t,r))throw RangeError(`Pontos não adjacentes: (${t.row},${t.col}) e (${r.row},${r.col})`);let a=t.row<r.row||t.row===r.row&&t.col<r.col,o=a?t:r,s=a?r:t;return{from:e(o.row,o.col),to:e(s.row,s.col),ownerId:i}}function i(e){return`${e.from.row===e.to.row?`h`:`v`}-${e.from.row}-${e.from.col}`}function a(e){return`b-${e.row}-${e.col}`}function o(t){let n=t.row,a=t.col;return[i(r(e(n,a),e(n,a+1))),i(r(e(n+1,a),e(n+1,a+1))),i(r(e(n,a),e(n+1,a))),i(r(e(n,a+1),e(n+1,a+1)))]}var s={version:`v0.01.53`,energy:{max:10,regenMinutes:2,rewardAmount:5},progression:{skipsPerWeek:3,totalStages:60,initialStages:60},board:{minGridSize:2},renderer:{cellSize:80,padding:50,dotRadius:7,hitRadius:24,touchHitRadius:38},admob:{useProductionAds:!1,androidAppIdTest:`ca-app-pub-3940256099942544~3347511713`,androidAppIdProduction:`ca-app-pub-5289795165154473~7698786958`,rewardedAdUnitIdTest:`ca-app-pub-3940256099942544/5224354917`,rewardedAdUnitIdProduction:`ca-app-pub-5289795165154473/3300907170`}},c=s.version,l=s.energy.max,u=s.energy.regenMinutes,d=s.energy.rewardAmount,f=s.progression.skipsPerWeek,ee=s.progression.totalStages,p=s.progression.initialStages,m=s.board.minGridSize,h=s.renderer.cellSize,g=s.renderer.padding,_=s.renderer.dotRadius,te=s.renderer.hitRadius,ne=s.renderer.touchHitRadius,re=s.admob.useProductionAds;s.admob.androidAppIdTest,s.admob.androidAppIdProduction;var ie=s.admob.rewardedAdUnitIdTest,ae=s.admob.rewardedAdUnitIdProduction;function oe(t,n){if(t<m)throw RangeError(`gridSize deve ser >= ${m}`);ce(n);let r={};for(let n=0;n<t;n++)for(let i=0;i<t-1;i++)v(r,e(n,i),e(n,i+1));for(let n=0;n<t-1;n++)for(let i=0;i<t;i++)v(r,e(n,i),e(n+1,i));let i={};for(let n=0;n<t-1;n++)for(let r=0;r<t-1;r++){let t={topLeft:e(n,r),ownerId:null};i[a(t.topLeft)]=t}return le(t,t,r,i,n)}function se(t,n){let{width:r,height:i,cells:o}=t;if(r<1||i<1)throw RangeError(`width e height devem ser >= 1`);if(o.length===0)throw RangeError(`E necessario ao menos 1 celula ativa`);ce(n);let s={},c={};for(let t of o){if(t.x<0||t.x>=r||t.y<0||t.y>=i)throw RangeError(`Celula fora do limite: (${t.x}, ${t.y})`);let n=e(t.y,t.x);c[a(n)]={topLeft:n,ownerId:null},v(s,e(t.y,t.x),e(t.y,t.x+1)),v(s,e(t.y+1,t.x),e(t.y+1,t.x+1)),v(s,e(t.y,t.x),e(t.y+1,t.x)),v(s,e(t.y,t.x+1),e(t.y+1,t.x+1))}return le(i+1,r+1,s,c,n)}function v(e,t,n){let a=r(t,n);e[i(a)]=a}function ce(e){if(e.length<2)throw RangeError(`E necessario ao menos 2 jogadores`)}function le(e,t,n,r,i){let a=i[0];return{gridSize:Math.max(e,t),gridRows:e,gridCols:t,players:i.map(e=>({...e,score:0})),lines:n,boxes:r,currentPlayerId:a.id,status:`playing`}}function ue(e,t,n){return{id:e,name:t,color:n,score:0}}function de(e){return{ok:!0,value:e}}function fe(e,t=null){return{ok:!1,error:e,code:t}}var pe={GAME_FINISHED:`GAME_FINISHED`,LINE_NOT_FOUND:`LINE_NOT_FOUND`,LINE_ALREADY_TAKEN:`LINE_ALREADY_TAKEN`};function me(e,t){if(e.status===`finished`)return fe(`A partida já terminou`,pe.GAME_FINISHED);let n=i(t),r=e.lines[n];if(r===void 0)return fe(`Linha inexistente no tabuleiro`,pe.LINE_NOT_FOUND);if(r.ownerId!==null)return fe(`Linha já foi jogada`,pe.LINE_ALREADY_TAKEN);let s=e.currentPlayerId,c={...e.lines,[n]:{...r,ownerId:s}},l={...e.boxes},u=0;for(let t of Object.values(e.boxes))t.ownerId===null&&o(t.topLeft).every(e=>{let t=c[e];return t!==void 0&&t.ownerId!==null})&&(l[a(t.topLeft)]={...t,ownerId:s},u+=1);let d=e.players.map(e=>e.id===s?{...e,score:e.score+u}:{...e}),f=Object.values(c).every(e=>e.ownerId!==null)?`finished`:`playing`,ee=f===`finished`||u>0?s:he(e.players,s);return de({...e,lines:c,boxes:l,players:d,currentPlayerId:ee,status:f})}function he(e,t){return e[(e.findIndex(e=>e.id===t)+1)%e.length].id}function ge(e){return Object.values(e.lines).filter(e=>e.ownerId===null)}var _e=class{state;constructor(e){this.state=this.buildState(e)}buildState(e){let t=e.players.map((e,t)=>ue(`p${t+1}`,e.name,e.color));return`board`in e?se(e.board,t):oe(e.gridSize,t)}getState(){return this.state}playLine(e){let t=me(this.state,e);return t.ok?(this.state=t.value,!0):!1}reset(e){this.state=this.buildState(e)}getAvailableLines(){return ge(this.state)}};function y(e){return g+e*h}function b(e){return g+e*h}function ve(e,t){return typeof document>`u`?t:getComputedStyle(document.documentElement).getPropertyValue(e).trim()||t}function ye(){return{bg:ve(`--bg-2`,`#ffffff`),emptyLine:ve(`--border-strong`,`#d1d5db`),hoverLine:ve(`--ui-accent`,`#64748b`),dot:ve(`--ui-accent-border`,`#334155`)}}function be(e,t){return t?e.players.find(e=>e.id===t)?.color??`#888`:`#ccc`}function xe(e,t,n,r,i,a,o,s){e.beginPath(),e.moveTo(t,n),e.lineTo(r,i),e.lineCap=`round`,e.lineJoin=`round`,e.strokeStyle=s,e.lineWidth=o+2.5,e.stroke(),e.strokeStyle=a,e.lineWidth=o,e.stroke()}function Se(e,t=e){return{width:g*2+(t-1)*h,height:g*2+(e-1)*h}}function Ce(e,t,n,r=!1){let{width:a,height:o}=Se(t.gridRows,t.gridCols),s=ye();e.clearRect(0,0,a,o),e.fillStyle=s.bg,e.fillRect(0,0,a,o);for(let n of Object.values(t.boxes)){if(!n.ownerId)continue;let r=be(t,n.ownerId),i=y(n.topLeft.col),a=b(n.topLeft.row);e.fillStyle=r+`33`,e.fillRect(i+1,a+1,h-2,h-2);let o=t.players.find(e=>e.id===n.ownerId);o&&(e.fillStyle=r+`bb`,e.font=`bold ${Math.floor(h*.35)}px system-ui, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(o.name[0]?.toUpperCase()??`?`,i+h/2,a+h/2))}let c=t.players.find(e=>e.id===t.currentPlayerId);for(let r of Object.values(t.lines)){let a=n!==null&&i(n)===i(r),o=y(r.from.col),l=b(r.from.row),u=y(r.to.col),d=b(r.to.row);r.ownerId===null?a?xe(e,o,l,u,d,(c?.color??s.hoverLine)+`ee`,6.75,`rgba(0,0,0,0.28)`):xe(e,o,l,u,d,s.emptyLine,3.5,`rgba(0,0,0,0.16)`):xe(e,o,l,u,d,be(t,r.ownerId),7.75,`rgba(0,0,0,0.36)`)}for(let n of Te(t))e.beginPath(),e.arc(y(n.col),b(n.row),_,0,Math.PI*2),e.fillStyle=s.dot,e.fill()}function we(e,t,n,r=te){let i=null,a=r,o=Math.max(4,Math.round(r*.4));for(let r of Object.values(e.lines)){let e=y(r.from.col),s=b(r.from.row),c=y(r.to.col),l=b(r.to.row);if(r.from.row===r.to.row){if(t>=e-o&&t<=c+o){let e=Math.abs(n-s);e<a&&(a=e,i=r)}continue}if(n>=s-o&&n<=l+o){let n=Math.abs(t-e);n<a&&(a=n,i=r)}}return i}function Te(e){let n=new Map;for(let r of Object.values(e.lines))n.set(t(r.from),r.from),n.set(t(r.to),r.to);return[...n.values()]}var Ee={"pt-BR":`🇧🇷`,"pt-PT":`🇵🇹`,es:`🇪🇸`,en:`🇬🇧`},De=`dab_lang`;function Oe(){let e=typeof localStorage<`u`?localStorage.getItem(De):null;if(e&&e in Ee)return e;let t=typeof navigator<`u`?navigator.language??``:``;return t.startsWith(`pt-PT`)?`pt-PT`:t.startsWith(`pt`)?`pt-BR`:t.startsWith(`es`)?`es`:`en`}function ke(e){typeof localStorage<`u`&&localStorage.setItem(De,e)}function x(e,t){let n=Ae[Oe()][e]??Ae.en[e]??e;if(t)for(let[e,r]of Object.entries(t))n=n.replaceAll(`{${e}}`,String(r));return n}var Ae={"pt-BR":{tagline:`Conecte • Feche • Domine`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} fases concluídas`,menu_bot:`Modo Treino`,menu_bot_sub:`7 dificuldades`,menu_multi:`Multijogador`,menu_multi_sub:`2 a 4 jogadores • Duplas ou Solo`,menu_tutorial:`Tutorial`,menu_tutorial_sub:`Aprenda a jogar`,back:`← Voltar`,restart:`↻ Reiniciar`,lang_label:`Idioma`,energy_no:`⚡ Sem energia! Aguarde a recarga ou assista um anúncio.`,energy_recharged:`⚡ Energia recarregada!`,energy_reward_5:`⚡ +{n} energia!`,energy_next:`+1 em {s}s`,energy_unlimited:`∞`,settings:`Configurações`,theme:`Tema`,theme_dark:`🌙 Escuro`,theme_light:`☀️ Claro`,theme_confirm:`Confirmar tema`,multiplatform:`Multiplataforma`,profile:`Perfil`,diff_muito_facil:`Muito Fácil`,diff_facil:`Fácil`,diff_medio:`Médio`,diff_dificil:`Difícil`,diff_muito_dificil:`Muito Difícil`,diff_impossivel:`Impossível`,diff_impulsivo:`Impulsivo`,setup_difficulty:`Dificuldade`,setup_grid:`Grade`,setup_players:`Jogadores`,setup_mode:`Modo`,setup_solo:`Solo (todos vs todos)`,setup_teams:`Duplas (2v2)`,setup_start:`Iniciar Partida`,game_turn:`Vez de {name}`,game_turn_you:`Sua vez!`,game_bot_thinking:`IA pensando...`,stage_label:`Fase {id}`,stage_header:`Fase {id} - Dificuldade {diff}`,stage_intro_title:`Bem-vindo à dificuldade {diff}`,stage_intro_copy:`A fase {id} começou. Boa sorte!`,stage_intro_start:`Começar`,stage_intro_map:`Voltar ao mapa`,vs_bot_label:`vs IA — {diff}`,teams_2v2:`Duplas 2v2`,n_players:`{n} Jogadores`,team_a:`Time A`,team_b:`Time B`,stage_complete:`COMPLETA!`,next_stage:`Próxima Fase →`,map:`📍 Mapa`,victory:`Vitória!`,won_suffix:`venceu!`,tie:`🤝 Empate!`,new_game:`Nova Partida`,xp_gained:`+{xp} XP`,you_lost:`Você perdeu!`,you_tied:`🤝 Você empatou!`,try_again:`⚡ Tentar de novo`,watch_ad:`📺 Assistir anúncio para ganhar +{n} energia`,ad_loading:`Carregando anúncio...`,ad_unavailable:`Anúncio indisponível no momento. Tente novamente em instantes.`,ad_not_completed:`Assista até o final para receber a recompensa.`,ad_error:`Não foi possível carregar o anúncio.`,skip_phase:`Deseja pular a fase?`,skip_via_ad:`📺 Pular com anúncio ({n} restantes)`,no_skips_left:`Sem pulos disponíveis esta semana`,god_skips:`Pulos disponíveis`,tut_step1_title:`Conecte os pontos`,tut_step1_desc:`Clique em dois pontos adjacentes para traçar uma linha.`,tut_step2_title:`Feche o quadrado`,tut_step2_desc:`Ao fechar o 4º lado de um quadrado você pontua e joga de novo.`,tut_step3_title:`Marque mais pontos`,tut_step3_desc:`Vence quem fechar mais quadrados quando todas as linhas acabarem.`,tut_step4_title:`Cuidado com a IA`,tut_step4_desc:`Não deixe o 3º lado de um quadrado aberto — a IA vai completar!`,tut_hint:`Cada ponto conecta-se aos vizinhos. Um quadrado tem 4 lados.`,ad_label:`ANÚNCIO`,ad_close_timer:`Fechar ({n})`,ad_close_ready:`✓ Fechar`,ad_text:`Baixe agora o melhor jogo!`,ad_cta:`JOGAR GRÁTIS`,god_mode:`👑 God Mode`,god_unlimited_energy:`Energia ilimitada`,god_go_stage:`Ir para fase específica`,god_go:`IR`,god_next:`⏭ Próxima fase ({id})`,god_refill:`⚡ Recarregar energia`,god_phase_tools:`Teste da fase`,god_complete_win:`Completar como vitória`,god_complete_loss:`Completar como derrota`,god_energy_tools:`Teste de energia`,god_zero_energy:`Zerar energia`,god_activated:`👑 God Mode ATIVADO!`,god_deactivated:`God Mode desativado`,god_energy_zeroed:`Energia zerada`,god_forced_win:`Fase concluída como vitória`,god_forced_loss:`Fase concluída como derrota`,on_label:`ON`,off_label:`OFF`,settings_vibration:`Vibração`,settings_music:`🎵 Volume da Música`,settings_sound:`🔊 Volume do Som`,settings_mute:`🔇 Mudo (sem sons)`,player_n:`Jogador {n}`,you:`Você`,bot:`IA`,rank_master:`Mestre`,rank_diamond:`Diamante`,rank_plat_3:`Platina III`,rank_plat_2:`Platina II`,rank_plat_1:`Platina I`,rank_gold_3:`Ouro III`,rank_gold_2:`Ouro II`,rank_gold_1:`Ouro I`,rank_silver_3:`Prata III`,rank_silver_2:`Prata II`,rank_silver_1:`Prata I`,rank_bronze_3:`Bronze III`,rank_bronze_2:`Bronze II`,rank_bronze_1:`Bronze I`,rank_beginner:`Iniciante`},"pt-PT":{settings:`Definições`,theme:`Tema`,theme_dark:`🌙 Escuro`,theme_light:`☀️ Claro`,theme_pink:`🌸 Rosa`,theme_confirm:`Confirmar tema`,multiplatform:`Multiplataforma`,profile:`Perfil`,tagline:`Conecte • Feche • Domine`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} fases concluídas`,menu_bot:`Modo Treino`,menu_bot_sub:`7 dificuldades`,menu_multi:`Multijogador`,menu_multi_sub:`2 a 4 jogadores • Duplas ou Solo`,menu_tutorial:`Tutorial`,menu_tutorial_sub:`Aprenda a jogar`,back:`← Voltar`,restart:`↻ Reiniciar`,lang_label:`Idioma`,energy_no:`⚡ Sem energia! Aguarde a recarga ou veja um anúncio.`,energy_recharged:`⚡ Energia recarregada!`,energy_reward_5:`⚡ +{n} energia!`,energy_next:`+1 em {s}s`,energy_unlimited:`∞`,diff_muito_facil:`Muito Fácil`,diff_facil:`Fácil`,diff_medio:`Médio`,diff_dificil:`Difícil`,diff_muito_dificil:`Muito Difícil`,diff_impossivel:`Impossível`,diff_impulsivo:`Impulsivo`,setup_difficulty:`Dificuldade`,setup_grid:`Grelha`,setup_players:`Jogadores`,setup_mode:`Modo`,setup_solo:`Solo (todos vs todos)`,setup_teams:`Duplas (2v2)`,setup_start:`Iniciar Jogo`,game_turn:`Vez de {name}`,game_turn_you:`Sua vez!`,game_bot_thinking:`IA a pensar...`,stage_label:`Fase {id}`,stage_header:`Fase {id} - Dificuldade {diff}`,stage_intro_title:`Bem-vindo à dificuldade {diff}`,stage_intro_copy:`A fase {id} começou. Boa sorte!`,stage_intro_start:`Começar`,stage_intro_map:`Voltar ao mapa`,vs_bot_label:`vs IA — {diff}`,teams_2v2:`Duplas 2v2`,n_players:`{n} Jogadores`,team_a:`Equipa A`,team_b:`Equipa B`,stage_complete:`COMPLETA!`,next_stage:`Próxima Fase →`,map:`📍 Mapa`,victory:`Vitória!`,won_suffix:`venceu!`,tie:`🤝 Empate!`,new_game:`Novo Jogo`,xp_gained:`+{xp} XP`,you_lost:`Perdeu!`,you_tied:`🤝 Empatou!`,try_again:`⚡ Tentar novamente`,watch_ad:`📺 Ver anúncio para ganhar +{n} energia`,ad_loading:`A carregar anúncio...`,ad_unavailable:`Anúncio indisponível de momento. Tenta novamente dentro de instantes.`,ad_not_completed:`Vê o anúncio até ao fim para receber a recompensa.`,ad_error:`Não foi possível carregar o anúncio.`,skip_phase:`Deseja pular a fase?`,skip_via_ad:`📺 Pular com anúncio ({n} restantes)`,no_skips_left:`Sem pulos disponíveis esta semana`,god_skips:`Pulos disponíveis`,tut_step1_title:`Conecte os pontos`,tut_step1_desc:`Clique em dois pontos adjacentes para traçar uma linha.`,tut_step2_title:`Feche o quadrado`,tut_step2_desc:`Ao fechar o 4º lado de um quadrado você pontua e joga de novo.`,tut_step3_title:`Marque mais pontos`,tut_step3_desc:`Vence quem fechar mais quadrados quando todas as linhas acabarem.`,tut_step4_title:`Cuidado com a IA`,tut_step4_desc:`Não deixe o 3º lado de um quadrado aberto — a IA vai completar!`,tut_hint:`Cada ponto conecta-se aos vizinhos. Um quadrado tem 4 lados.`,ad_label:`ANÚNCIO`,ad_close_timer:`Fechar ({n})`,ad_close_ready:`✓ Fechar`,ad_text:`Descarregue agora o melhor jogo!`,ad_cta:`JOGAR GRÁTIS`,god_mode:`👑 God Mode`,god_unlimited_energy:`Energia ilimitada`,god_go_stage:`Ir para fase específica`,god_go:`IR`,god_next:`⏭ Próxima fase ({id})`,god_refill:`⚡ Recarregar energia`,god_phase_tools:`Teste da fase`,god_complete_win:`Completar como vitória`,god_complete_loss:`Completar como derrota`,god_energy_tools:`Teste de energia`,god_zero_energy:`Zerar energia`,god_activated:`👑 God Mode ATIVADO!`,god_deactivated:`God Mode desativado`,god_energy_zeroed:`Energia zerada`,god_forced_win:`Fase concluída como vitória`,god_forced_loss:`Fase concluída como derrota`,on_label:`ON`,off_label:`OFF`,settings_vibration:`Vibração`,settings_music:`🎵 Volume da Música`,settings_sound:`🔊 Volume do Som`,settings_mute:`🔇 Mudo (sem sons)`,player_n:`Jogador {n}`,you:`Você`,bot:`IA`,rank_master:`Mestre`,rank_diamond:`Diamante`,rank_plat_3:`Platina III`,rank_plat_2:`Platina II`,rank_plat_1:`Platina I`,rank_gold_3:`Ouro III`,rank_gold_2:`Ouro II`,rank_gold_1:`Ouro I`,rank_silver_3:`Prata III`,rank_silver_2:`Prata II`,rank_silver_1:`Prata I`,rank_bronze_3:`Bronze III`,rank_bronze_2:`Bronze II`,rank_bronze_1:`Bronze I`,rank_beginner:`Iniciante`},es:{settings:`Ajustes`,theme:`Tema`,theme_dark:`🌙 Oscuro`,theme_light:`☀️ Claro`,theme_pink:`🌸 Rosa`,theme_confirm:`Confirmar tema`,multiplatform:`Multiplataforma`,profile:`Perfil`,tagline:`Conecta • Cierra • Domina`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} fases completadas`,menu_bot:`Modo Entrenamiento`,menu_bot_sub:`7 niveles de dificultad`,menu_multi:`Multijugador`,menu_multi_sub:`2 a 4 jugadores • Parejas o Solo`,menu_tutorial:`Tutorial`,menu_tutorial_sub:`Aprende a jugar`,back:`← Volver`,restart:`↻ Reiniciar`,lang_label:`Idioma`,energy_no:`⚡ ¡Sin energía! Espera la recarga o ve un anuncio.`,energy_recharged:`⚡ ¡Energía recargada!`,energy_reward_5:`⚡ +{n} energía!`,energy_next:`+1 en {s}s`,energy_unlimited:`∞`,diff_muito_facil:`Muy Fácil`,diff_facil:`Fácil`,diff_medio:`Medio`,diff_dificil:`Difícil`,diff_muito_dificil:`Muy Difícil`,diff_impossivel:`Imposible`,diff_impulsivo:`Impulsivo`,setup_difficulty:`Dificultad`,setup_grid:`Cuadrícula`,setup_players:`Jugadores`,setup_mode:`Modo`,setup_solo:`Solo (todos vs todos)`,setup_teams:`Parejas (2v2)`,setup_start:`Iniciar Partida`,game_turn:`Turno de {name}`,game_turn_you:`¡Tu turno!`,game_bot_thinking:`IA pensando...`,stage_label:`Fase {id}`,stage_header:`Fase {id} - Dificultad {diff}`,stage_intro_title:`Bienvenido a la dificultad {diff}`,stage_intro_copy:`La fase {id} empieza ahora. ¡Buena suerte!`,stage_intro_start:`Empezar`,stage_intro_map:`Volver al mapa`,vs_bot_label:`vs IA — {diff}`,teams_2v2:`Parejas 2v2`,n_players:`{n} Jugadores`,team_a:`Equipo A`,team_b:`Equipo B`,stage_complete:`¡COMPLETA!`,next_stage:`Siguiente Fase →`,map:`📍 Mapa`,victory:`¡Victoria!`,won_suffix:`¡ganó!`,tie:`🤝 ¡Empate!`,new_game:`Nueva Partida`,xp_gained:`+{xp} XP`,you_lost:`¡Perdiste!`,you_tied:`🤝 ¡Empataste!`,try_again:`⚡ Intentar de nuevo`,watch_ad:`📺 Ver anuncio para ganar +{n} de energía`,ad_loading:`Cargando anuncio...`,ad_unavailable:`Anuncio no disponible por el momento. Inténtalo de nuevo en unos instantes.`,ad_not_completed:`Mira el anuncio hasta el final para recibir la recompensa.`,ad_error:`No fue posible cargar el anuncio.`,skip_phase:`¿Deseas saltar la fase?`,skip_via_ad:`📺 Saltar con anuncio ({n} restantes)`,no_skips_left:`Sin saltos disponibles esta semana`,god_skips:`Saltos disponibles`,tut_step1_title:`Conecta los puntos`,tut_step1_desc:`Haz clic en dos puntos adyacentes para trazar una línea.`,tut_step2_title:`Cierra el cuadrado`,tut_step2_desc:`Al cerrar el 4º lado de un cuadrado puntúas y vuelves a jugar.`,tut_step3_title:`Más puntos gana`,tut_step3_desc:`Gana quien cierre más cuadrados cuando no queden líneas.`,tut_step4_title:`Cuidado con la IA`,tut_step4_desc:`No dejes el 3er lado abierto — ¡la IA lo completará!`,tut_hint:`Cada punto se conecta a sus vecinos. Un cuadrado tiene 4 lados.`,ad_label:`ANUNCIO`,ad_close_timer:`Cerrar ({n})`,ad_close_ready:`✓ Cerrar`,ad_text:`¡Descarga ahora el mejor juego!`,ad_cta:`JUGAR GRATIS`,god_mode:`👑 Modo Dios`,god_unlimited_energy:`Energía ilimitada`,god_go_stage:`Ir a fase específica`,god_go:`IR`,god_next:`⏭ Siguiente fase ({id})`,god_refill:`⚡ Recargar energía`,god_phase_tools:`Pruebas de fase`,god_complete_win:`Completar como victoria`,god_complete_loss:`Completar como derrota`,god_energy_tools:`Pruebas de energía`,god_zero_energy:`Poner energía a cero`,god_activated:`👑 ¡Modo Dios ACTIVADO!`,god_deactivated:`Modo Dios desactivado`,god_energy_zeroed:`Energía en cero`,god_forced_win:`Fase completada como victoria`,god_forced_loss:`Fase completada como derrota`,on_label:`ON`,off_label:`OFF`,settings_vibration:`Vibración`,settings_music:`🎵 Volumen de Música`,settings_sound:`🔊 Volumen de Sonido`,settings_mute:`🔇 Silencio (sin sonidos)`,player_n:`Jugador {n}`,you:`Tú`,bot:`IA`,rank_master:`Maestro`,rank_diamond:`Diamante`,rank_plat_3:`Platino III`,rank_plat_2:`Platino II`,rank_plat_1:`Platino I`,rank_gold_3:`Oro III`,rank_gold_2:`Oro II`,rank_gold_1:`Oro I`,rank_silver_3:`Plata III`,rank_silver_2:`Plata II`,rank_silver_1:`Plata I`,rank_bronze_3:`Bronce III`,rank_bronze_2:`Bronce II`,rank_bronze_1:`Bronce I`,rank_beginner:`Principiante`},en:{settings:`Settings`,theme:`Theme`,theme_dark:`🌙 Dark`,theme_light:`☀️ Light`,theme_pink:`🌸 Pink`,theme_confirm:`Confirm theme`,multiplatform:`Multiplatform`,profile:`Profile`,tagline:`Connect • Close • Dominate`,menu_arcade:`Arcade`,menu_arcade_sub:`{done}/{total} stages completed`,menu_bot:`Training Mode`,menu_bot_sub:`7 difficulty levels`,menu_multi:`Multiplayer`,menu_multi_sub:`2 to 4 players • Teams or Solo`,menu_tutorial:`Tutorial`,menu_tutorial_sub:`Learn how to play`,back:`← Back`,restart:`↻ Restart`,lang_label:`Language`,energy_no:`⚡ No energy! Wait for recharge or watch an ad.`,energy_recharged:`⚡ Energy recharged!`,energy_reward_5:`⚡ +{n} energy!`,energy_next:`+1 in {s}s`,energy_unlimited:`∞`,diff_muito_facil:`Very Easy`,diff_facil:`Easy`,diff_medio:`Medium`,diff_dificil:`Hard`,diff_muito_dificil:`Very Hard`,diff_impossivel:`Impossible`,diff_impulsivo:`Impulsive`,setup_difficulty:`Difficulty`,setup_grid:`Grid Size`,setup_players:`Players`,setup_mode:`Mode`,setup_solo:`Solo (all vs all)`,setup_teams:`Teams (2v2)`,setup_start:`Start Game`,game_turn:`{name}'s turn`,game_turn_you:`Your turn!`,game_bot_thinking:`AI thinking...`,stage_label:`Stage {id}`,stage_header:`Stage {id} - Difficulty {diff}`,stage_intro_title:`Welcome to difficulty {diff}`,stage_intro_copy:`Stage {id} starts now. Good luck!`,stage_intro_start:`Start`,stage_intro_map:`Back to map`,vs_bot_label:`vs AI — {diff}`,teams_2v2:`Teams 2v2`,n_players:`{n} Players`,team_a:`Team A`,team_b:`Team B`,stage_complete:`COMPLETE!`,next_stage:`Next Stage →`,map:`📍 Map`,victory:`Victory!`,won_suffix:`won!`,tie:`🤝 Tie!`,new_game:`New Game`,xp_gained:`+{xp} XP`,you_lost:`You lost!`,you_tied:`🤝 It's a Tie!`,try_again:`⚡ Try Again`,watch_ad:`📺 Watch an ad to earn +{n} energy`,ad_loading:`Loading ad...`,ad_unavailable:`Ad unavailable right now. Please try again in a moment.`,ad_not_completed:`Watch until the end to receive the reward.`,ad_error:`Could not load the ad.`,skip_phase:`Want to skip this stage?`,skip_via_ad:`📺 Skip with ad ({n} left)`,no_skips_left:`No skips available this week`,god_skips:`Available skips`,tut_step1_title:`Connect the dots`,tut_step1_desc:`Click two adjacent dots to draw a line between them.`,tut_step2_title:`Close the square`,tut_step2_desc:`Close the 4th side of a square to score and play again.`,tut_step3_title:`Score the most`,tut_step3_desc:`The player who closes the most squares wins.`,tut_step4_title:`Watch the AI`,tut_step4_desc:`Don't leave the 3rd side open — the AI will complete it!`,tut_hint:`Each dot connects to its neighbors. A square has 4 sides.`,ad_label:`AD`,ad_close_timer:`Close ({n})`,ad_close_ready:`✓ Close`,ad_text:`Download the best game now!`,ad_cta:`PLAY FREE`,god_mode:`👑 God Mode`,god_unlimited_energy:`Unlimited energy`,god_go_stage:`Go to specific stage`,god_go:`GO`,god_next:`⏭ Next stage ({id})`,god_refill:`⚡ Refill energy`,god_phase_tools:`Stage tools`,god_complete_win:`Complete as win`,god_complete_loss:`Complete as loss`,god_energy_tools:`Energy tools`,god_zero_energy:`Zero energy`,god_activated:`👑 God Mode ACTIVATED!`,god_deactivated:`God Mode deactivated`,god_energy_zeroed:`Energy set to zero`,god_forced_win:`Stage completed as a win`,god_forced_loss:`Stage completed as a loss`,on_label:`ON`,off_label:`OFF`,settings_vibration:`Vibration`,settings_music:`🎵 Music Volume`,settings_sound:`🔊 Sound Volume`,settings_mute:`🔇 Mute (no sounds)`,player_n:`Player {n}`,you:`You`,bot:`AI`,rank_master:`Master`,rank_diamond:`Diamond`,rank_plat_3:`Platinum III`,rank_plat_2:`Platinum II`,rank_plat_1:`Platinum I`,rank_gold_3:`Gold III`,rank_gold_2:`Gold II`,rank_gold_1:`Gold I`,rank_silver_3:`Silver III`,rank_silver_2:`Silver II`,rank_silver_1:`Silver I`,rank_bronze_3:`Bronze III`,rank_bronze_2:`Bronze II`,rank_bronze_1:`Bronze I`,rank_beginner:`Beginner`}},je={"muito-facil":`diff_muito_facil`,facil:`diff_facil`,medio:`diff_medio`,dificil:`diff_dificil`,"muito-dificil":`diff_muito_dificil`,impossivel:`diff_impossivel`,impulsivo:`diff_impulsivo`};function Me(e){return x(je[e])}var Ne=[`muito-facil`,`facil`,`medio`,`dificil`,`muito-dificil`,`impossivel`,`impulsivo`];function S(e){return e[Math.floor(Math.random()*e.length)]}function C(t,n,r){return o(e(n,r)).filter(e=>t.lines[e]?.ownerId!==null).length}function Pe(e,t){return t.filter(t=>w(e,t).some(([t,n])=>C(e,t,n)===3))}function Fe(e,t){return t.filter(t=>!w(e,t).some(([t,n])=>C(e,t,n)===2))}function w(t,n){let r=[],{from:i,to:o}=n;return i.row===o.row?r.push([i.row-1,i.col],[i.row,i.col]):r.push([i.row,i.col-1],[i.row,i.col]),r.filter(([n,r])=>n>=0&&r>=0&&t.boxes[a(e(n,r))]!==void 0)}function Ie(e,t){let n=e.players.find(e=>e.id===t),r=e.players.find(e=>e.id!==t);return(n?.score??0)-(r?.score??0)}function Le(e,t,n,r,i,a){if(e.status===`finished`||n===0)return Ie(e,t);let o=ge(e);if(o.length===0)return Ie(e,t);let s=[...o].sort((t,n)=>{let r=+!!w(e,t).some(([t,n])=>C(e,t,n)===3);return+!!w(e,n).some(([t,n])=>C(e,t,n)===3)-r});if(a){let a=-1/0;for(let o of s){let s=me(e,o);if(!s.ok)continue;let c=s.value.currentPlayerId===t,l=Le(s.value,t,n-1,r,i,c);if(a=Math.max(a,l),r=Math.max(r,l),i<=r)break}return a}let c=1/0;for(let a of s){let o=me(e,a);if(!o.ok)continue;let s=o.value.currentPlayerId===t,l=Le(o.value,t,n-1,r,i,s);if(c=Math.min(c,l),i=Math.min(i,l),i<=r)break}return c}function Re(e,t,n){let r=ge(e),i=r[0],a=-1/0;for(let o of r){let r=me(e,o);if(!r.ok)continue;let s=r.value.currentPlayerId===t,c=Le(r.value,t,n-1,-1/0,1/0,s);c>a&&(a=c,i=o)}return i}function ze(e,t){let n=ge(e);if(n.length===0)throw Error(`Sem movimentos disponiveis`);let r=e.currentPlayerId;switch(t){case`muito-facil`:return S(n);case`facil`:{let t=Pe(e,n);return t.length>0&&Math.random()<.5?S(t):S(n)}case`medio`:{let t=Pe(e,n);if(t.length>0)return S(t);let r=Fe(e,n);return r.length>0?S(r):S(n)}case`dificil`:return Re(e,r,3);case`muito-dificil`:return Re(e,r,6);case`impossivel`:return Re(e,r,Object.keys(e.boxes).length<=9?12:8);case`impulsivo`:return Math.random()<.4?Re(e,r,8):S(n)}}function Be(e){return{"muito-facil":300,facil:400,medio:500,dificil:700,"muito-dificil":900,impossivel:1200,impulsivo:200}[e]}var Ve=[`MUITO_FACIL`,`FACIL`,`MEDIO`,`DIFICIL`,`MUITO_DIFICIL`,`IMPOSSIVEL`],He={MUITO_FACIL:`muito-facil`,FACIL:`facil`,MEDIO:`medio`,DIFICIL:`dificil`,MUITO_DIFICIL:`muito-dificil`,IMPOSSIVEL:`impossivel`},Ue={MUITO_FACIL:`MEDIO`,FACIL:`DIFICIL`,MEDIO:`MUITO_DIFICIL`,DIFICIL:`IMPOSSIVEL`,MUITO_DIFICIL:`IMPOSSIVEL`,IMPOSSIVEL:`IMPOSSIVEL`},We={MUITO_FACIL:{twoStars:.65,threeStars:.8},FACIL:{twoStars:.65,threeStars:.8},MEDIO:{twoStars:.6,threeStars:.75},DIFICIL:{twoStars:.6,threeStars:.75},MUITO_DIFICIL:{twoStars:.55,threeStars:.7},IMPOSSIVEL:{twoStars:.55,threeStars:.7}},Ge={MUITO_FACIL:`diff_muito_facil`,FACIL:`diff_facil`,MEDIO:`diff_medio`,DIFICIL:`diff_dificil`,MUITO_DIFICIL:`diff_muito_dificil`,IMPOSSIVEL:`diff_impossivel`},Ke=[{id:1,name:`Mini Classico`,matrix:[`111`,`111`,`111`]},{id:2,name:`Classico Mobile`,matrix:[`1111`,`1111`,`1111`,`1111`]},{id:3,name:`Cruz Compacta`,matrix:[`00100`,`00100`,`11111`,`00100`,`00100`]},{id:4,name:`Diamante Quadriculado`,matrix:[`00100`,`01110`,`11111`,`01110`,`00100`]},{id:5,name:`Ampulheta Quadriculada`,matrix:[`11011`,`01110`,`00100`,`01110`,`00100`,`01110`,`11011`]},{id:6,name:`Escadinha`,matrix:[`10000`,`11000`,`01100`,`00110`,`00011`]},{id:7,name:`Ilhas Duplas`,matrix:[`11000`,`11000`,`00000`,`00011`,`00011`]},{id:8,name:`Corredor Vertical`,matrix:[`111`,`111`,`111`,`111`,`111`]},{id:9,name:`Campo Tatico`,matrix:[`1111`,`1111`,`1111`]},{id:10,name:`Labirinto Mobile`,matrix:[`11110`,`00010`,`01110`,`01000`,`01111`,`00001`,`11101`,`10101`,`11111`]}].map($e),qe=Array.from({length:ee},(e,t)=>Qe(t+1));function Je(e,t,n,r){if(e<=t)return 0;let i=We[r],a=Math.ceil(n*i.twoStars);return e>=Math.ceil(n*i.threeStars)?3:e>=a?2:1}function Ye(e){return x(Ge[e])}function Xe(e){return x(`stage_header`,{id:e.id,diff:Ye(e.baseDifficulty)})}function Ze(e){return(e-1)%Ke.length==0}function T(e){return qe[Math.max(1,Math.min(ee,Math.floor(e)))-1]??qe[qe.length-1]}function Qe(e){let t=Ke[(e-1)%Ke.length],n=et(e),r=tt(n,e);return{id:e,templateId:t.id,templateName:t.name,board:{width:t.width,height:t.height,cells:t.cells},totalMaxScore:t.totalMaxScore,baseDifficulty:n,effectiveDifficulty:r,difficulty:He[r],stars:nt(t.totalMaxScore,r)}}function $e(e){let t=e.matrix[0]?.length??0,n=e.matrix.length;if(t<1||t>5)throw RangeError(`Template ${e.id} com largura invalida: ${t}`);if(n<1||n>10)throw RangeError(`Template ${e.id} com altura invalida: ${n}`);let r=[];for(let[n,i]of e.matrix.entries()){if(i.length!==t)throw RangeError(`Template ${e.id} com linhas de larguras diferentes`);for(let[t,a]of[...i].entries()){if(a!==`0`&&a!==`1`)throw RangeError(`Template ${e.id} contem valor invalido: ${a}`);a===`1`&&r.push({x:t,y:n})}}return{...e,width:t,height:n,cells:r,totalMaxScore:r.length}}function et(e){return Ve[Math.min(Ve.length-1,Math.max(0,Math.floor((e-1)/Ke.length)))]}function tt(e,t){return t%2==0?Ue[e]:e}function nt(e,t){let n=We[t];return[`Venca`,`Venca com >=${Math.ceil(e*n.twoStars)} caixas`,`Venca com >=${Math.ceil(e*n.threeStars)} caixas`]}var rt=`dab_skips`,it=f,E=l;function at(){let e=new Date;return e.setHours(0,0,0,0),e.setDate(e.getDate()-(e.getDay()+6)%7),e.getTime()}function ot(){try{let e=localStorage.getItem(rt);if(e){let t=JSON.parse(e);if(t.weekStart>=at())return t}}catch{}let e={count:it,weekStart:at()};return localStorage.setItem(rt,JSON.stringify(e)),e}function st(){return ot().count}function ct(){let e=ot();return e.count<=0?!1:(e.count--,localStorage.setItem(rt,JSON.stringify(e)),!0)}function lt(e){let t=ot();t.count=Math.max(0,e),localStorage.setItem(rt,JSON.stringify(t))}var ut=`dab_music_vol`,dt=`dab_mute`;function ft(){return localStorage.getItem(dt)===`1`}function pt(e){localStorage.setItem(dt,e?`1`:`0`)}function mt(){let e=localStorage.getItem(ut);return e===null?.25:Math.max(0,Math.min(1,parseFloat(e)))}function ht(e){localStorage.setItem(ut,String(Math.max(0,Math.min(1,e))))}var gt=`dab_vibration`;function _t(){let e=localStorage.getItem(gt);return e===null?!0:e===`1`}function vt(e){localStorage.setItem(gt,e?`1`:`0`)}function yt(e){if(_t())try{let t=globalThis;t.navigator?.vibrate&&t.navigator.vibrate(e)}catch{}}var bt=`dab_theme`;function xt(e){return e===`dark`||e===`light`||e===`pink`}function St(){let e=localStorage.getItem(bt);return xt(e)?e:`dark`}function Ct(e){localStorage.setItem(bt,e),wt(e)}function wt(e=St()){globalThis.document?.documentElement?.setAttribute(`data-theme`,e)}var Tt={dark:[`#22d3ee`,`#f472b6`,`#f59e0b`,`#a855f7`],light:[`#f59e0b`,`#7c3aed`,`#2563eb`,`#db2777`],pink:[`#ff4fd8`,`#2563eb`,`#a855f7`,`#f59e0b`]};function Et(e=St()){return Tt[e]}var Dt=`dab_profile`;function Ot(){return{name:`Jogador`,xp:0,stageProgress:{}}}function kt(){try{let e=localStorage.getItem(Dt);return e?JSON.parse(e):Ot()}catch{return Ot()}}function At(e){localStorage.setItem(Dt,JSON.stringify(e))}function jt(e,t,n,r){let i=kt(),a=i.stageProgress[e];return i.stageProgress[e]={stars:Math.max(t,a?.stars??0),bestScore:Math.max(n,a?.bestScore??0)},i.xp+=r,At(i),i}function Mt(e){let t=[{key:`rank_master`,icon:`👑`,min:15e4,next:1/0},{key:`rank_diamond`,icon:`🔷`,min:75e3,next:15e4},{key:`rank_plat_3`,icon:`💎`,min:5e4,next:75e3},{key:`rank_plat_2`,icon:`💎`,min:4e4,next:5e4},{key:`rank_plat_1`,icon:`💎`,min:3e4,next:4e4},{key:`rank_gold_3`,icon:`🥇`,min:2e4,next:3e4},{key:`rank_gold_2`,icon:`🥇`,min:15e3,next:2e4},{key:`rank_gold_1`,icon:`🥇`,min:1e4,next:15e3},{key:`rank_silver_3`,icon:`🥈`,min:6e3,next:1e4},{key:`rank_silver_2`,icon:`🥈`,min:3500,next:6e3},{key:`rank_silver_1`,icon:`🥈`,min:2500,next:3500},{key:`rank_bronze_3`,icon:`🥉`,min:1500,next:2500},{key:`rank_bronze_2`,icon:`🥉`,min:1e3,next:1500},{key:`rank_bronze_1`,icon:`🥉`,min:500,next:1e3},{key:`rank_beginner`,icon:`⚪`,min:0,next:500}],n=t.find(t=>e>=t.min)??t[t.length-1];return{rank:x(n.key),icon:n.icon,next:n.next}}var Nt=Math.round(u*6e4),Pt=`dab_energy`;function Ft(){try{let e=localStorage.getItem(Pt);if(!e)return E;let t=JSON.parse(e),n=Math.floor((Date.now()-t.lastSaved)/Nt);return Math.min(E,t.amount+n)}catch{return E}}function It(e){localStorage.setItem(Pt,JSON.stringify({amount:e,lastSaved:Date.now()}))}function Lt(){let e=Ft();return e<=0?!1:(It(e-1),!0)}function Rt(){It(E)}function zt(e){It(Math.min(E,Ft()+e))}function Bt(){try{let e=localStorage.getItem(Pt);if(!e)return 0;let t=JSON.parse(e);return Ft()>=E?0:Nt-(Date.now()-t.lastSaved)%Nt}catch{return 0}}var Vt=`dab_god`;function Ht(){try{let e=localStorage.getItem(Vt);return e?JSON.parse(e):{unlimitedEnergy:!1}}catch{return{unlimitedEnergy:!1}}}function Ut(e){localStorage.setItem(Vt,JSON.stringify(e))}var D;(function(e){e.Unimplemented=`UNIMPLEMENTED`,e.Unavailable=`UNAVAILABLE`})(D||={});var Wt=class extends Error{constructor(e,t,n){super(e),this.message=e,this.code=t,this.data=n}},Gt=e=>e?.androidBridge?`android`:e?.webkit?.messageHandlers?.bridge?`ios`:`web`,Kt=e=>{let t=e.CapacitorCustomPlatform||null,n=e.Capacitor||{},r=n.Plugins=n.Plugins||{},i=()=>t===null?Gt(e):t.name,a=()=>i()!==`web`,o=e=>!!(l.get(e)?.platforms.has(i())||s(e)),s=e=>n.PluginHeaders?.find(t=>t.name===e),c=t=>e.console.error(t),l=new Map;return n.convertFileSrc||=e=>e,n.getPlatform=i,n.handleError=c,n.isNativePlatform=a,n.isPluginAvailable=o,n.registerPlugin=(e,a={})=>{let o=l.get(e);if(o)return console.warn(`Capacitor plugin "${e}" already registered. Cannot register plugins twice.`),o.proxy;let c=i(),u=s(e),d,f=async()=>(!d&&c in a?d=d=typeof a[c]==`function`?await a[c]():a[c]:t!==null&&!d&&`web`in a&&(d=d=typeof a.web==`function`?await a.web():a.web),d),ee=(t,r)=>{if(u){let i=u?.methods.find(e=>r===e.name);if(i)return i.rtype===`promise`?t=>n.nativePromise(e,r.toString(),t):(t,i)=>n.nativeCallback(e,r.toString(),t,i);if(t)return t[r]?.bind(t)}else if(t)return t[r]?.bind(t);else throw new Wt(`"${e}" plugin is not implemented on ${c}`,D.Unimplemented)},p=t=>{let n,r=(...r)=>{let i=f().then(i=>{let a=ee(i,t);if(a){let e=a(...r);return n=e?.remove,e}else throw new Wt(`"${e}.${t}()" is not implemented on ${c}`,D.Unimplemented)});return t===`addListener`&&(i.remove=async()=>n()),i};return r.toString=()=>`${t.toString()}() { [capacitor code] }`,Object.defineProperty(r,"name",{value:t,writable:!1,configurable:!1}),r},m=p(`addListener`),h=p(`removeListener`),g=(e,t)=>{let n=m({eventName:e},t),r=async()=>{h({eventName:e,callbackId:await n},t)},i=new Promise(e=>n.then(()=>e({remove:r})));return i.remove=async()=>{console.warn(`Using addListener() without 'await' is deprecated.`),await r()},i},_=new Proxy({},{get(e,t){switch(t){case`$$typeof`:return;case`toJSON`:return()=>({});case`addListener`:return u?g:m;case`removeListener`:return h;default:return p(t)}}});return r[e]=_,l.set(e,{name:e,proxy:_,platforms:new Set([...Object.keys(a),...u?[c]:[]])}),_},n.Exception=Wt,n.DEBUG=!!n.DEBUG,n.isLoggingEnabled=!!n.isLoggingEnabled,n},O=(e=>e.Capacitor=Kt(e))(typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{}),k=O.registerPlugin,A=class{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(e,t){let n=!1;this.listeners[e]||(this.listeners[e]=[],n=!0),this.listeners[e].push(t);let r=this.windowListeners[e];return r&&!r.registered&&this.addWindowListener(r),n&&this.sendRetainedArgumentsForEvent(e),Promise.resolve({remove:async()=>this.removeListener(e,t)})}async removeAllListeners(){this.listeners={};for(let e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,t,n){let r=this.listeners[e];if(!r){if(n){let n=this.retainedEventArguments[e];n||=[],n.push(t),this.retainedEventArguments[e]=n}return}r.forEach(e=>e(t))}hasListeners(e){return!!this.listeners[e]?.length}registerWindowListener(e,t){this.windowListeners[t]={registered:!1,windowEventName:e,pluginEventName:t,handler:e=>{this.notifyListeners(t,e)}}}unimplemented(e=`not implemented`){return new O.Exception(e,D.Unimplemented)}unavailable(e=`not available`){return new O.Exception(e,D.Unavailable)}async removeListener(e,t){let n=this.listeners[e];if(!n)return;let r=n.indexOf(t);this.listeners[e].splice(r,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){let t=this.retainedEventArguments[e];t&&(delete this.retainedEventArguments[e],t.forEach(t=>{this.notifyListeners(e,t)}))}},qt=e=>encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),Jt=e=>e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent),Yt=class extends A{async getCookies(){let e=document.cookie,t={};return e.split(`;`).forEach(e=>{if(e.length<=0)return;let[n,r]=e.replace(/=/,`CAP_COOKIE`).split(`CAP_COOKIE`);n=Jt(n).trim(),r=Jt(r).trim(),t[n]=r}),t}async setCookie(e){try{let t=qt(e.key),n=qt(e.value),r=e.expires?`; expires=${e.expires.replace(`expires=`,``)}`:``,i=(e.path||`/`).replace(`path=`,``),a=e.url!=null&&e.url.length>0?`domain=${e.url}`:``;document.cookie=`${t}=${n||``}${r}; path=${i}; ${a};`}catch(e){return Promise.reject(e)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(e){return Promise.reject(e)}}async clearCookies(){try{let e=document.cookie.split(`;`)||[];for(let t of e)document.cookie=t.replace(/^ +/,``).replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}};k(`CapacitorCookies`,{web:()=>new Yt});var Xt=async e=>new Promise((t,n)=>{let r=new FileReader;r.onload=()=>{let e=r.result;t(e.indexOf(`,`)>=0?e.split(`,`)[1]:e)},r.onerror=e=>n(e),r.readAsDataURL(e)}),Zt=(e={})=>{let t=Object.keys(e);return Object.keys(e).map(e=>e.toLocaleLowerCase()).reduce((n,r,i)=>(n[r]=e[t[i]],n),{})},Qt=(e,t=!0)=>e?Object.entries(e).reduce((e,n)=>{let[r,i]=n,a,o;return Array.isArray(i)?(o=``,i.forEach(e=>{a=t?encodeURIComponent(e):e,o+=`${r}=${a}&`}),o.slice(0,-1)):(a=t?encodeURIComponent(i):i,o=`${r}=${a}`),`${e}&${o}`},``).substr(1):null,$t=(e,t={})=>{let n=Object.assign({method:e.method||`GET`,headers:e.headers},t),r=Zt(e.headers)[`content-type`]||``;if(typeof e.data==`string`)n.body=e.data;else if(r.includes(`application/x-www-form-urlencoded`)){let t=new URLSearchParams;for(let[n,r]of Object.entries(e.data||{}))t.set(n,r);n.body=t.toString()}else if(r.includes(`multipart/form-data`)||e.data instanceof FormData){let t=new FormData;if(e.data instanceof FormData)e.data.forEach((e,n)=>{t.append(n,e)});else for(let n of Object.keys(e.data))t.append(n,e.data[n]);n.body=t;let r=new Headers(n.headers);r.delete(`content-type`),n.headers=r}else (r.includes(`application/json`)||typeof e.data==`object`)&&(n.body=JSON.stringify(e.data));return n},en=class extends A{async request(e){let t=$t(e,e.webFetchExtra),n=Qt(e.params,e.shouldEncodeUrlParams),r=n?`${e.url}?${n}`:e.url,i=await fetch(r,t),a=i.headers.get(`content-type`)||``,{responseType:o=`text`}=i.ok?e:{};a.includes(`application/json`)&&(o=`json`);let s,c;switch(o){case`arraybuffer`:case`blob`:c=await i.blob(),s=await Xt(c);break;case`json`:s=await i.json();break;default:s=await i.text()}let l={};return i.headers.forEach((e,t)=>{l[t]=e}),{data:s,headers:l,status:i.status,url:i.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:`GET`}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:`POST`}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:`PUT`}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:`PATCH`}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:`DELETE`}))}};k(`CapacitorHttp`,{web:()=>new en});var tn;(function(e){e.Dark=`DARK`,e.Light=`LIGHT`,e.Default=`DEFAULT`})(tn||={});var nn;(function(e){e.StatusBar=`StatusBar`,e.NavigationBar=`NavigationBar`})(nn||={});var rn=class extends A{async setStyle(){this.unavailable(`not available for web`)}async setAnimation(){this.unavailable(`not available for web`)}async show(){this.unavailable(`not available for web`)}async hide(){this.unavailable(`not available for web`)}};k(`SystemBars`,{web:()=>new rn});var an;(function(e){e.General=`General`,e.ParentalGuidance=`ParentalGuidance`,e.Teen=`Teen`,e.MatureAudience=`MatureAudience`})(an||={});var on;(function(e){e.SizeChanged=`bannerAdSizeChanged`,e.Loaded=`bannerAdLoaded`,e.FailedToLoad=`bannerAdFailedToLoad`,e.Opened=`bannerAdOpened`,e.Closed=`bannerAdClosed`,e.AdImpression=`bannerAdImpression`})(on||={});var sn;(function(e){e.TOP_CENTER=`TOP_CENTER`,e.CENTER=`CENTER`,e.BOTTOM_CENTER=`BOTTOM_CENTER`})(sn||={});var cn;(function(e){e.BANNER=`BANNER`,e.FULL_BANNER=`FULL_BANNER`,e.LARGE_BANNER=`LARGE_BANNER`,e.MEDIUM_RECTANGLE=`MEDIUM_RECTANGLE`,e.LEADERBOARD=`LEADERBOARD`,e.ADAPTIVE_BANNER=`ADAPTIVE_BANNER`,e.SMART_BANNER=`SMART_BANNER`})(cn||={});var ln;(function(e){e.Loaded=`interstitialAdLoaded`,e.FailedToLoad=`interstitialAdFailedToLoad`,e.Showed=`interstitialAdShowed`,e.FailedToShow=`interstitialAdFailedToShow`,e.Dismissed=`interstitialAdDismissed`})(ln||={});var un;(function(e){e.Loaded=`onRewardedInterstitialAdLoaded`,e.FailedToLoad=`onRewardedInterstitialAdFailedToLoad`,e.Showed=`onRewardedInterstitialAdShowed`,e.FailedToShow=`onRewardedInterstitialAdFailedToShow`,e.Dismissed=`onRewardedInterstitialAdDismissed`,e.Rewarded=`onRewardedInterstitialAdReward`})(un||={});var j;(function(e){e.Loaded=`onRewardedVideoAdLoaded`,e.FailedToLoad=`onRewardedVideoAdFailedToLoad`,e.Showed=`onRewardedVideoAdShowed`,e.FailedToShow=`onRewardedVideoAdFailedToShow`,e.Dismissed=`onRewardedVideoAdDismissed`,e.Rewarded=`onRewardedVideoAdReward`})(j||={});var dn;(function(e){e.NOT_REQUIRED=`NOT_REQUIRED`,e.OBTAINED=`OBTAINED`,e.REQUIRED=`REQUIRED`,e.UNKNOWN=`UNKNOWN`})(dn||={});var fn;(function(e){e[e.DISABLED=0]=`DISABLED`,e[e.EEA=1]=`EEA`,e[e.NOT_EEA=2]=`NOT_EEA`,e[e.US=3]=`US`,e[e.OTHER=4]=`OTHER`})(fn||={});var pn=`modulepreload`,mn=function(e,t){return new URL(e,t).href},hn={},gn=function(e,t,n){let r=Promise.resolve();if(t&&t.length>0){let e=document.getElementsByTagName(`link`),i=document.querySelector(`meta[property=csp-nonce]`),a=i?.nonce||i?.getAttribute(`nonce`);function o(e){return Promise.all(e.map(e=>Promise.resolve(e).then(e=>({status:`fulfilled`,value:e}),e=>({status:`rejected`,reason:e}))))}r=o(t.map(t=>{if(t=mn(t,n),t in hn)return;hn[t]=!0;let r=t.endsWith(`.css`),i=r?`[rel="stylesheet"]`:``;if(n)for(let n=e.length-1;n>=0;n--){let i=e[n];if(i.href===t&&(!r||i.rel===`stylesheet`))return}else if(document.querySelector(`link[href="${t}"]${i}`))return;let o=document.createElement(`link`);if(o.rel=r?`stylesheet`:pn,r||(o.as=`script`),o.crossOrigin=``,o.href=t,a&&o.setAttribute(`nonce`,a),document.head.appendChild(o),r)return new Promise((e,n)=>{o.addEventListener(`load`,e),o.addEventListener(`error`,()=>n(Error(`Unable to preload CSS for ${t}`)))})}))}function i(e){let t=new Event(`vite:preloadError`,{cancelable:!0});if(t.payload=e,window.dispatchEvent(t),!t.defaultPrevented)throw e}return r.then(t=>{for(let e of t||[])e.status===`rejected`&&i(e.reason);return e().catch(i)})},M=k(`AdMob`,{web:()=>gn(()=>import(`./web-DFLYbUEd.js`).then(e=>new e.AdMobWeb),[],import.meta.url)}),_n=re?ae:ie,vn=`android`,N={Idle:`idle`,Loading:`loading`,Showing:`showing`},P={Rewarded:`rewarded`,Unavailable:`unavailable`,Dismissed:`dismissed`,Error:`error`,Busy:`busy`},yn=!1,bn=null,xn=N.Idle;function Sn(){return O.isNativePlatform()&&O.getPlatform()===vn&&O.isPluginAvailable(`AdMob`)}function Cn(e){for(let t of e)t.remove().catch(()=>{})}function wn(){return{adId:_n,isTesting:!re}}function Tn(){return xn!==N.Idle}async function En(){return Sn()?yn?!0:bn||(bn=(async()=>{try{return await M.initialize({initializeForTesting:!re}),yn=!0,!0}catch{return!1}finally{yn||(bn=null)}})(),bn):!1}async function Dn(){if(Tn())return{status:P.Busy};if(!await En())return{status:P.Unavailable};xn=N.Loading;let e=[],t=!1,n=!1,r=null,i=t=>{if(!r)return;let n=r;r=null,xn=N.Idle,Cn(e),n(t)},a=new Promise(e=>{r=e}),o=()=>{t||(t=!0,xn=N.Showing,M.showRewardVideoAd().catch(()=>{i({status:P.Error})}))};try{return e.push(await M.addListener(j.Loaded,()=>{o()})),e.push(await M.addListener(j.FailedToLoad,()=>{i({status:P.Unavailable})})),e.push(await M.addListener(j.FailedToShow,()=>{i({status:P.Error})})),e.push(await M.addListener(j.Rewarded,e=>{n||(n=!0,i({status:P.Rewarded,reward:e}))})),e.push(await M.addListener(j.Dismissed,()=>{n||i({status:P.Dismissed})})),await M.prepareRewardVideoAd(wn()),await a}catch{return i({status:P.Unavailable}),await a}}var On=`xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`,kn=`<path stroke="none" d="M0 0h24v24H0z" fill="none"/>`;function F(e,t){return`<svg ${On} width="${e}" height="${e}" viewBox="0 0 24 24">${kn}${t}</svg>`}function An(e,t){return`<svg xmlns="http://www.w3.org/2000/svg" width="${e}" height="${e}" viewBox="0 0 24 24" fill="currentColor">${kn}${t}</svg>`}var I=22,jn=16,Mn=F(I,`<path d="M2 12h1"/><path d="M6 8h-2a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2"/><path d="M6 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1"/><path d="M9 12h6"/><path d="M15 7v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-10a1 1 0 0 0-1-1h-1a1 1 0 0 0-1 1"/><path d="M18 8h2a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2"/><path d="M22 12h-1"/>`),L=F(I,`<path d="M5 7a4 4 0 1 0 8 0a4 4 0 1 0-8 0"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/><path d="M21 21v-2a4 4 0 0 0-3-3.85"/>`),Nn=F(I,`<path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0"/><path d="M3 6l0 13"/><path d="M12 6l0 13"/><path d="M21 6l0 13"/>`),Pn=F(jn,`<path d="M4 10l0 6"/><path d="M20 10l0 6"/><path d="M7 9h10v8a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-8a5 5 0 0 1 10 0"/><path d="M8 3l1 2"/><path d="M16 3l-1 2"/><path d="M9 18l0 3"/><path d="M15 18l0 3"/>`),Fn=F(jn,`<path d="M8.286 7.008c-3.216 0-4.286 3.23-4.286 5.92c0 3.229 2.143 8.072 4.286 8.072c1.165-.05 1.799-.538 3.214-.538c1.406 0 1.607.538 3.214.538s4.286-3.229 4.286-5.381c-.03-.011-2.649-.434-2.679-3.23c-.02-2.335 2.589-3.179 2.679-3.228c-1.096-1.606-3.162-2.113-3.75-2.153c-1.535-.12-3.032 1.077-3.75 1.077c-.729 0-2.036-1.077-3.214-1.077"/><path d="M12 4a2 2 0 0 0 2-2a2 2 0 0 0-2 2"/>`),In=F(jn,`<path d="M3 5h6v14h-6l0-14"/><path d="M12 9h10v7h-10l0-7"/><path d="M14 19h6"/><path d="M17 16v3"/><path d="M6 13v.01"/><path d="M6 16v.01"/>`),R=F(I,`<path d="M12 17.75l-6.172 3.245l1.179-6.873l-5-4.867l6.9-1l3.086-6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873l-6.158-3.245"/>`),z=16,Ln=F(z,`<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1-8.313-12.454l0 .008"/><path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0-2 2a2 2 0 0 0-2-2a2 2 0 0 0 2-2"/><path d="M19 11h2m-1-1v2"/>`),Rn=An(z,`<path d="M12 19a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1-1.993 .117l-.007-.117v-1a1 1 0 0 1 1-1z"/><path d="M18.313 16.91l.094 .083l.7 .7a1 1 0 0 1-1.32 1.497l-.094-.083l-.7-.7a1 1 0 0 1 1.218-1.567l.102 .07z"/><path d="M7.007 16.993a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1-1.497-1.32l.083-.094l.7-.7a1 1 0 0 1 1.414 0z"/><path d="M4 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1-.117-1.993l.117-.007h1z"/><path d="M21 11a1 1 0 0 1 .117 1.993l-.117 .007h-1a1 1 0 0 1-.117-1.993l.117-.007h1z"/><path d="M6.213 4.81l.094 .083l.7 .7a1 1 0 0 1-1.32 1.497l-.094-.083l-.7-.7a1 1 0 0 1 1.217-1.567l.102 .07z"/><path d="M19.107 4.893a1 1 0 0 1 .083 1.32l-.083 .094l-.7 .7a1 1 0 0 1-1.497-1.32l.083-.094l.7-.7a1 1 0 0 1 1.414 0z"/><path d="M12 2a1 1 0 0 1 .993 .883l.007 .117v1a1 1 0 0 1-1.993 .117l-.007-.117v-1a1 1 0 0 1 1-1z"/><path d="M12 7a5 5 0 1 1-4.995 5.217l-.005-.217l.005-.217a5 5 0 0 1 4.995-4.783z"/>`),zn=F(z,`<path d="M10.325 4.317a1.95 1.95 0 0 1 3.35 0l.24 .392a1.95 1.95 0 0 0 1.155 .857l.45 .12a1.95 1.95 0 0 1 1.454 2.138l-.067 .462a1.95 1.95 0 0 0 .39 1.535l.295 .355a1.95 1.95 0 0 1 0 2.5l-.295 .355a1.95 1.95 0 0 0-.39 1.535l.067 .462a1.95 1.95 0 0 1-1.454 2.138l-.45 .12a1.95 1.95 0 0 0-1.155 .857l-.24 .392a1.95 1.95 0 0 1-3.35 0l-.24 -.392a1.95 1.95 0 0 0-1.155 -.857l-.45 -.12a1.95 1.95 0 0 1-1.454 -2.138l.067 -.462a1.95 1.95 0 0 0-.39 -1.535l-.295 -.355a1.95 1.95 0 0 1 0 -2.5l.295 -.355a1.95 1.95 0 0 0 .39 -1.535l-.067 -.462a1.95 1.95 0 0 1 1.454 -2.138l.45 -.12a1.95 1.95 0 0 0 1.155 -.857l.24 -.392z"/><circle cx="12" cy="12" r="3"/>`),Bn=F(z,`<path d="M3 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2l0 -14"/><path d="M8 4l2 0"/><path d="M9 17l0 .01"/><path d="M21 6l-2 3l2 3l-2 3l2 3"/>`),Vn=F(z,`<path d="M20 11a8 8 0 1 0 .5 4"/><path d="M20 4v7h-7"/>`),B=null,V=null,H=Ht(),U=document.getElementById(`app`);wt(),En();function W(e,t){return`
    <span class="section-title">
      <span class="section-title-icon">${e}</span>
      <span>${t}</span>
    </span>`}function Hn(e){if(e===`dark`)return x(`theme_dark`);if(e===`light`)return x(`theme_light`);let t=x(`theme_pink`);return t===`theme_pink`?`🌸 Rosa`:t}function Un(e){let t=B,n=T(e),r=t?.controller.getState();if(!t||t.mode!==`arcade`||t.stageId!==e||!r)return;let i=e<p?e+1:null;jt(e,1,n.totalMaxScore*100,100),B=null,V=null,or(1,100,Xe(n),i,()=>{i?Q(i,!0):Z()},()=>{Z()})}function Wn(e){let t=B;!t||t.mode!==`arcade`||t.stageId!==e||(B=null,V=null,sr(()=>{B=null,V=null,Q(e,!0,!0)},()=>{B=null,V=null,Z()}))}function Gn(e,t,n){let r=T(e),i=document.createElement(`div`);i.className=`modal-overlay`,i.innerHTML=`
    <div class="modal-card stage-intro-card">
      <div class="stage-intro-kicker">${W(R,Xe(r))}</div>
      <div class="stage-intro-title">${x(`stage_intro_title`,{diff:Ye(r.baseDifficulty)})}</div>
      <div class="stage-intro-copy">${x(`stage_intro_copy`,{id:r.id})}</div>
      <div class="stage-intro-actions">
        <button class="btn-cel-next" id="si-start">${x(`stage_intro_start`)}</button>
        <button class="btn-cel-map" id="si-map">${x(`stage_intro_map`)}</button>
      </div>
    </div>`,document.body.appendChild(i);let a=()=>i.remove();i.querySelector(`#si-start`)?.addEventListener(`click`,()=>{a(),t()}),i.querySelector(`#si-map`)?.addEventListener(`click`,()=>{a(),n()}),i.addEventListener(`click`,e=>{e.target===i&&(a(),n())})}var G=new Audio(`./bg_music.mp3`);G.loop=!0,G.preload=`none`,G.volume=0,G.muted=ft();function Kn(e,t=5e3){let n=t/60,r=e/60,i=0,a=setInterval(()=>{i=Math.min(i+r,e),G.volume=i,i>=e&&clearInterval(a)},n)}function qn(){G.paused&&G.play().then(()=>Kn(mt())).catch(()=>{})}document.addEventListener(`click`,qn,{once:!0}),document.addEventListener(`touchstart`,qn,{once:!0,passive:!0});function Jn(){return[1,2,3,4].map(e=>x(`player_n`,{n:e}))}function Yn(e,t,n){let r=e.getBoundingClientRect(),i=window.devicePixelRatio||1,a=e.width/i/r.width,o=e.height/i/r.height;return{x:(t-r.left)*a,y:(n-r.top)*o}}function Xn(e){let t=[{key:`rank_master`,icon:`👑`,min:15e4,next:1/0},{key:`rank_diamond`,icon:`🔷`,min:75e3,next:15e4},{key:`rank_plat_3`,icon:`💎`,min:5e4,next:75e3},{key:`rank_plat_2`,icon:`💎`,min:4e4,next:5e4},{key:`rank_plat_1`,icon:`💎`,min:3e4,next:4e4},{key:`rank_gold_3`,icon:`🥇`,min:2e4,next:3e4},{key:`rank_gold_2`,icon:`🥇`,min:15e3,next:2e4},{key:`rank_gold_1`,icon:`🥇`,min:1e4,next:15e3},{key:`rank_silver_3`,icon:`🥈`,min:6e3,next:1e4},{key:`rank_silver_2`,icon:`🥈`,min:3500,next:6e3},{key:`rank_silver_1`,icon:`🥈`,min:2500,next:3500},{key:`rank_bronze_3`,icon:`🥉`,min:1500,next:2500},{key:`rank_bronze_2`,icon:`🥉`,min:1e3,next:1500},{key:`rank_bronze_1`,icon:`🥉`,min:500,next:1e3},{key:`rank_beginner`,icon:`⚪`,min:0,next:500}],n=t.find(t=>e>=t.min)??t[t.length-1];return`
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
    <span class="rank-ring-icon">${n.icon}</span>`}function Zn(){let e=H.unlimitedEnergy?l:Ft(),t=e/l*100;return`
    <div class="energy-row">
      <span class="energy-bolt">⚡</span>
      <span class="energy-count">${H.unlimitedEnergy?`∞`:`${e}/${l}`}</span>
      ${H.unlimitedEnergy||e>=l?``:`<span class="energy-timer">${x(`energy_next`,{s:Math.max(1,Math.ceil(Bt()/1e3))})}</span>`}
      <div class="e-dots-wrap">${Array.from({length:l},(t,n)=>`<span class="e-dot ${n<e?`full`:``}"></span>`).join(``)}</div>
      <div class="e-bar-wrap"><div class="e-bar-fill" style="width:${t}%"></div></div>
    </div>`}function Qn(e=3200){let t=document.createElement(`canvas`);Object.assign(t.style,{position:`fixed`,top:`0`,left:`0`,width:`100%`,height:`100%`,pointerEvents:`none`,zIndex:`998`}),t.width=window.innerWidth,t.height=window.innerHeight,document.body.appendChild(t);let n=t.getContext(`2d`),r=[`#e74c3c`,`#3498db`,`#2ecc71`,`#f39c12`,`#9b59b6`,`#1abc9c`,`#e67e22`,`#ff6b9d`],i=Array.from({length:160},()=>({x:Math.random()*t.width,y:-20-Math.random()*120,w:5+Math.random()*9,h:3+Math.random()*5,color:r[Math.floor(Math.random()*r.length)],vx:(Math.random()-.5)*3,vy:1.5+Math.random()*4,rot:Math.random()*Math.PI*2,drot:(Math.random()-.5)*.15,opacity:1})),a=Date.now();(function r(){let o=(Date.now()-a)/e;n.clearRect(0,0,t.width,t.height);for(let e of i)e.x+=e.vx,e.y+=e.vy,e.rot+=e.drot,o>.65&&(e.opacity=Math.max(0,1-(o-.65)/.35)),n.save(),n.globalAlpha=e.opacity,n.translate(e.x,e.y),n.rotate(e.rot),n.fillStyle=e.color,n.fillRect(-e.w/2,-e.h/2,e.w,e.h),n.restore();o<1?requestAnimationFrame(r):t.remove()})()}var $n=[`Parabéns!`,`Mandou muito!`,`Excelente!`,`Perfeito!`,`Arrasou!`,`Show demais!`,`Você brilhou!`,`Sensacional!`,`Incrível!`,`Missão completa!`,`Jogada perfeita!`,`Resultado top!`,`Você dominou!`,`Que vitória!`,`Muito bem!`,`Desempenho incrível!`,`Nota máxima!`,`Você é fera!`,`Trabalho impecável!`,`Vitória com estilo!`],er=[`Boa!`,`Legal!`,`Foi bem!`,`Bom trabalho!`,`Quase lá!`,`Continue assim!`,`Bom resultado!`,`Mandou bem!`,`Boa tentativa!`,`Está evoluindo!`,`Nada mal!`,`Segue firme!`,`Bom avanço!`,`Você conseguiu!`,`Tá no caminho!`,`Bem jogado!`,`Foi positivo!`,`Boa partida!`,`Progresso feito!`,`Mais uma etapa!`],tr=[`Bom trabalho!`,`Boa jogada!`,`Foi muito bem!`,`Continue assim!`,`Segue firme!`,`Boa partida!`,`Mandou bem!`,`Você conseguiu!`],nr=[`Não foi dessa vez!`,`Quase lá!`,`Tente novamente!`,`Você consegue!`,`Foi por pouco!`,`Continue tentando!`,`A próxima é sua!`,`Não desista!`,`Boa tentativa!`,`Hora da revanche!`,`Mais uma chance!`,`Você está evoluindo!`,`Faz parte do jogo!`,`Dá para virar!`,`Vamos de novo!`,`Aprendizado feito!`,`Faltou pouco!`,`Na próxima vai!`,`Respira e tenta de novo!`,`O jogo ainda não acabou!`],rr=[`Empate!`,`Deu empate!`,`Jogo equilibrado!`,`Foi parelho!`,`Ninguém levou!`,`Disputa acirrada!`,`Boa partida!`,`Bem disputado!`,`Quase vitória!`,`Equilíbrio total!`,`Jogo justo!`,`Batalha equilibrada!`,`Ficou no empate!`,`Ninguém cedeu!`,`Partida apertada!`,`Resultado equilibrado!`,`Deu tudo igual!`,`Grande disputa!`,`Um duelo de respeito!`,`Hora da revanche!`];function ir(e){let t=e>=3?$n:e===2?er:tr;return t[Math.floor(Math.random()*t.length)]}function ar(e){let t=e?rr:nr;return t[Math.floor(Math.random()*t.length)]}function or(e,t,n,r,i,a,o){Qn();let s=document.createElement(`div`);s.className=`cel-overlay`;let c=[0,1,2].map(t=>`<span class="cel-star ${t<e?`earned`:`empty`}" style="animation-delay:${.4+t*.25}s">★</span>`).join(``);s.innerHTML=`
    <div class="cel-card">
      ${n?`<div class="cel-label">${n}</div>`:``}
      <div class="cel-title">${o??x(`stage_complete`)}</div>
      <div class="cel-stars">${c}</div>
      <div class="cel-phrase">${ir(e)}</div>
      ${t>0?`<div class="cel-xp">${x(`xp_gained`,{xp:t})}</div>`:``}
      <div class="cel-actions" id="cel-actions">
        ${r?`<button class="btn-cel-next" id="btn-cel-next">${x(`next_stage`)}</button>`:``}
        <button class="btn-cel-map" id="btn-cel-map">${x(`map`)}</button>
      </div>
    </div>`,document.body.appendChild(s);let l=s.querySelector(`#cel-actions`);l.style.opacity=`0`,setTimeout(()=>{l.style.opacity=`1`,l.style.transition=`opacity 0.4s`},2200),s.querySelector(`#btn-cel-next`)?.addEventListener(`click`,()=>{s.remove(),i()}),s.querySelector(`#btn-cel-map`)?.addEventListener(`click`,()=>{s.remove(),a()})}function sr(e,t,n=!1,r){let i=!n&&r?`
    <div class="fail-skip-section">
      <span class="fail-skip-label">${x(`skip_phase`)}</span>
      ${r.available>0?`<button class="btn-ad" id="fa">${x(`skip_via_ad`,{n:r.available})}</button>`:`<span class="no-skips-label">${x(`no_skips_left`)}</span>`}
    </div>`:``,a=document.createElement(`div`);a.className=`fail-overlay`,a.innerHTML=`
    <div class="fail-card">
      <div class="fail-emoji">${n?`🤝`:`😞`}</div>
      <div class="fail-title">${x(n?`you_tied`:`you_lost`)}</div>
      <div class="fail-phrase">${ar(n)}</div>
      <div class="fail-actions">
        <button class="btn-retry-pay" id="fr">${x(`try_again`)}</button>
        <button class="btn-cel-map" id="fm">${x(`map`)}</button>
      </div>
      ${i}
    </div>`,document.body.appendChild(a),a.querySelector(`#fr`)?.addEventListener(`click`,()=>{a.remove(),e()}),a.querySelector(`#fm`)?.addEventListener(`click`,()=>{a.remove(),t()}),a.querySelector(`#fa`)?.addEventListener(`click`,()=>{a.remove(),r?.onSkip()})}function cr(e){let t=document.createElement(`div`);t.className=`ad-overlay`,t.innerHTML=`
    <div class="ad-card">
      <div class="ad-top"><span class="ad-tag">${x(`ad_label`)}</span><span class="ad-timer" id="at">5</span></div>
      <div class="ad-mock"><div class="ad-logo">🎮</div><div class="ad-text">${x(`ad_text`)}</div><div class="ad-cta">${x(`ad_cta`)}</div></div>
      <div class="ad-progress-wrap"><div class="ad-progress" id="ap"></div></div>
      <button class="btn-close-ad" id="ac" disabled>${x(`ad_close_timer`,{n:5})}</button>
    </div>`,document.body.appendChild(t);let n=5,r=t.querySelector(`#at`),i=t.querySelector(`#ac`),a=t.querySelector(`#ap`);a.style.transition=`width ${n}s linear`,requestAnimationFrame(()=>{a.style.width=`100%`});let o=setInterval(()=>{n--,r.textContent=String(n),i.textContent=n>0?x(`ad_close_timer`,{n}):x(`ad_close_ready`),n<=0&&(clearInterval(o),i.disabled=!1,i.classList.add(`ready`))},1e3);i.addEventListener(`click`,()=>{t.remove(),e()})}function lr(e){let t=document.createElement(`div`);t.className=`modal-overlay`,t.innerHTML=`
    <div class="modal-card energy-ad-card">
      <div class="energy-ad-icon">⚡</div>
      <div class="energy-ad-title">${x(`energy_no`)}</div>
      <div class="energy-ad-copy" id="ea-copy">${x(`energy_reward_5`,{n:d})}</div>
      <button class="btn-energy-ad" id="ew">${x(`watch_ad`,{n:d})}</button>
      <button class="btn-cel-map energy-ad-dismiss" id="ec">${x(`back`)}</button>
    </div>`,document.body.appendChild(t);let n=t.querySelector(`#ea-copy`),r=t.querySelector(`#ew`),i=t.querySelector(`#ec`),a=!1,o=()=>t.remove(),s=e=>{a=!1,n.textContent=e,r.disabled=!1,r.textContent=x(`watch_ad`,{n:d}),i.disabled=!1},c=()=>{a=!0,n.textContent=x(`ad_loading`),r.disabled=!0,r.textContent=x(`ad_loading`),i.disabled=!0};r.addEventListener(`click`,async()=>{if(a)return;c();let t=await e();if(t.status===P.Rewarded){o();return}if(t.status===P.Busy){s(x(`ad_loading`));return}if(t.status===P.Unavailable){s(x(`ad_unavailable`));return}if(t.status===P.Dismissed){s(x(`ad_not_completed`));return}s(x(`ad_error`))}),i.addEventListener(`click`,()=>{a||o()}),t.addEventListener(`click`,e=>{!a&&e.target===t&&o()})}async function ur(e,t=!1,n=!1){let r=await Dn();return r.status===P.Rewarded?(zt(d),J(),K(x(`energy_reward_5`,{n:d})),Q(e,t,n),r):r.status===P.Unavailable?(K(x(`ad_unavailable`)),r):r.status===P.Dismissed?(K(x(`ad_not_completed`)),r):r.status===P.Busy?(K(x(`ad_loading`)),r):(K(x(`ad_error`)),r)}function dr(){let e=St(),t=document.createElement(`div`);t.className=`modal-overlay`,t.innerHTML=`
    <div class="modal-card">
      <div class="modal-header">
        ${W(zn,x(`settings`))}
        <button class="modal-close" id="mc">✕</button>
      </div>
      <div class="settings-section">
        <label class="settings-label">${x(`theme`)}</label>
        <div class="theme-row">
          <button class="btn-theme-opt ${e===`dark`?`active`:``}" data-theme="dark" title="${Hn(`dark`)}">${Ln}</button>
          <button class="btn-theme-opt ${e===`light`?`active`:``}" data-theme="light" title="${Hn(`light`)}">${Rn}</button>
          <button class="btn-theme-opt ${e===`pink`?`active`:``}" data-theme="pink" title="${Hn(`pink`)}">🌸</button>
        </div>
      </div>
      <div class="settings-section">
        <label class="settings-label">${x(`lang_label`)}</label>
        <div class="lang-selector settings-lang">${gr()}</div>
      </div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label settings-vibration-label">
            <span class="settings-vibration-icon">${Bn}</span>
            <span>${x(`settings_vibration`)}</span>
          </label>
          <label class="toggle-switch" id="sv-wrap">
            <input type="checkbox" id="sv" ${_t()?`checked`:``}>
            <span class="toggle-track"></span>
          </label>
        </div>
      </div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${x(`settings_mute`)}</label>
          <label class="toggle-switch">
            <input type="checkbox" id="sm" ${ft()?`checked`:``}>
            <span class="toggle-track"></span>
          </label>
        </div>
      </div>
      <div class="settings-section" id="music-vol-section" style="${ft()?`opacity:.4;pointer-events:none`:``}">
        <label class="settings-label">${x(`settings_music`)}</label>
        <div class="music-vol-row">
          <span class="music-vol-icon">🔇</span>
          <input class="music-vol-slider" id="music-vol" type="range" min="0" max="100" value="${Math.round(mt()*100)}" />
          <span class="music-vol-icon">🔊</span>
          <span class="music-vol-pct" id="music-vol-pct">${Math.round(mt()*100)}%</span>
        </div>
      </div>
      <div class="settings-section" id="sound-vol-section" style="opacity:.45;pointer-events:none">
        <label class="settings-label">${x(`settings_sound`)}</label>
        <div class="music-vol-row">
          <span class="music-vol-icon">🔈</span>
          <input class="music-vol-slider" id="sound-vol" type="range" min="0" max="100" value="50" disabled />
          <span class="music-vol-icon">🔊</span>
          <span class="music-vol-pct" id="sound-vol-pct">—</span>
        </div>
      </div>
      <div class="settings-version">${c}</div>
    </div>`,document.body.appendChild(t),t.querySelector(`#mc`)?.addEventListener(`click`,()=>t.remove()),t.addEventListener(`click`,e=>{e.target===t&&t.remove()}),t.querySelectorAll(`.btn-theme-opt`).forEach(e=>{e.onclick=()=>{Ct(e.dataset.theme),t.querySelectorAll(`.btn-theme-opt`).forEach(e=>e.classList.remove(`active`)),e.classList.add(`active`)}}),t.querySelectorAll(`.btn-lang`).forEach(e=>{e.onclick=()=>{ke(e.dataset.lang),t.remove(),X()}}),t.querySelector(`#sv`)?.addEventListener(`change`,e=>{let t=e.target.checked;vt(t),t&&yt(30)}),t.querySelector(`#sm`)?.addEventListener(`change`,e=>{let n=e.target.checked;pt(n),G.muted=n;let r=t.querySelector(`#music-vol-section`);r&&(r.style.opacity=n?`.4`:``,r.style.pointerEvents=n?`none`:``)}),t.querySelector(`#music-vol`)?.addEventListener(`input`,e=>{let n=parseInt(e.target.value,10)/100;ht(n),G.volume=n;let r=t.querySelector(`#music-vol-pct`);r&&(r.textContent=`${Math.round(n*100)}%`),G.paused&&n>0&&G.play().catch(()=>{})})}function fr(e){let t=document.createElement(`div`);t.className=`modal-overlay`,t.innerHTML=`
    <div class="modal-card god-card">
      <div class="modal-header">${W(zn,x(`god_mode`))}<button class="modal-close" id="gc">✕</button></div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${x(`god_unlimited_energy`)}</label>
          <button class="god-toggle ${H.unlimitedEnergy?`on`:``}" id="ge">${H.unlimitedEnergy?x(`on_label`):x(`off_label`)}</button>
        </div>
      </div>
      <div class="settings-section">
        <div class="god-row">
          <label class="god-label">${x(`god_skips`)} <span id="skip-count-label">${st()}/${f}</span></label>
          <button class="god-go" id="gsr">${x(`god_refill`)}</button>
        </div>
      </div>
      <div class="settings-section">
        <label class="settings-label">${x(`god_go_stage`)}</label>
        <div class="god-input-row">
          <input class="god-input" id="gs" type="number" min="1" max="${p}" placeholder="1-${p}" value="${e??1}" />
          <button class="god-go" id="gg">${x(`god_go`)}</button>
        </div>
      </div>
      ${e==null?``:`
      <div class="settings-section">
        <label class="settings-label">${x(`god_phase_tools`)}</label>
        <button class="god-go" id="gw">${x(`god_complete_win`)}</button>
        <button class="god-skip" id="gl">${x(`god_complete_loss`)}</button>
      </div>`}
      <div class="settings-section">
        <label class="settings-label">${x(`god_energy_tools`)}</label>
        <button class="god-refill" id="gz">${x(`god_zero_energy`)}</button>
      </div>
      ${e!=null&&e<p?`<button class="god-skip" id="gsk">${x(`god_next`,{id:e+1})}</button>`:``}
      <button class="god-refill" id="gr">${x(`god_refill`)}</button>
    </div>`,document.body.appendChild(t),t.querySelector(`#gc`)?.addEventListener(`click`,()=>t.remove()),t.addEventListener(`click`,e=>{e.target===t&&t.remove()});let n=t.querySelector(`#ge`);n.addEventListener(`click`,()=>{H.unlimitedEnergy=!H.unlimitedEnergy,Ut(H),n.textContent=H.unlimitedEnergy?x(`on_label`):x(`off_label`),n.classList.toggle(`on`,H.unlimitedEnergy),J()}),t.querySelector(`#gr`)?.addEventListener(`click`,()=>{Rt(),J(),K(x(`energy_recharged`))}),t.querySelector(`#gz`)?.addEventListener(`click`,()=>{H.unlimitedEnergy=!1,Ut(H),It(0),J(),n.textContent=x(`off_label`),n.classList.remove(`on`),K(x(`god_energy_zeroed`))}),t.querySelector(`#gsr`)?.addEventListener(`click`,()=>{lt(f),t.querySelector(`#skip-count-label`).textContent=`${f}/${f}`,K(`${f} pulos restaurados`)}),t.querySelector(`#gg`)?.addEventListener(`click`,()=>{let e=parseInt(t.querySelector(`#gs`).value,10);e>=1&&e<=p&&(t.remove(),B=null,V=null,Q(e,!0))}),t.querySelector(`#gw`)?.addEventListener(`click`,()=>{t.remove(),Un(e)}),t.querySelector(`#gl`)?.addEventListener(`click`,()=>{t.remove(),Wn(e)}),t.querySelector(`#gsk`)?.addEventListener(`click`,()=>{!e||e>=p||(t.remove(),B=null,V=null,Q(e+1,!0))})}function K(e){document.querySelectorAll(`.toast`).forEach(e=>e.remove());let t=document.createElement(`div`);t.className=`toast`,t.textContent=e,document.body.appendChild(t),requestAnimationFrame(()=>{t.classList.add(`show`)}),setTimeout(()=>{t.classList.remove(`show`),setTimeout(()=>t.remove(),400)},2200)}var q=null;function J(){document.querySelectorAll(`#energy-display`).forEach(e=>{e.innerHTML=Zn()})}function pr(){q&&clearInterval(q),q=setInterval(J,1e3)}function Y(){q&&=(clearInterval(q),null)}var mr={"pt-BR":`Português Brasil`,"pt-PT":`Português Portugal`,es:`Espanhol`,en:`Inglês`},hr={"pt-BR":`br`,"pt-PT":`pt`,es:`es`,en:`gb`};function gr(){let e=Oe();return Object.keys(mr).map(t=>`<button class="btn-lang ${t===e?`active`:``}" data-lang="${t}" title="${mr[t]}" aria-label="${mr[t]}"><span class="fi fi-${hr[t]} fi-flag-icon"></span></button>`).join(``)}function _r(){return`<div class="lang-selector">${gr()}</div>`}function vr(e=document){e.querySelectorAll(`.btn-lang`).forEach(e=>{e.onclick=()=>{ke(e.dataset.lang),X()}})}var yr=0,br=null;function X(){Y(),B=null,V=null;let e=kt(),t=Mt(e.xp),n=Object.entries(e.stageProgress).filter(([e,t])=>Number(e)>=1&&Number(e)<=p&&t.stars>0).length,r=n===0;U.innerHTML=`
    <div class="screen menu-screen">

      <div class="topbar">
        <div></div>
        <div class="topbar-right">
          <div id="energy-display" class="menu-energy-chip">${Zn()}</div>
          <button class="btn-settings-pill" id="btn-settings" title="${x(`settings`)}" aria-label="${x(`settings`)}">${zn}<span>${x(`settings`)}</span></button>
          <button class="btn-profile-icon" id="btn-profile" title="${x(`profile`)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          </button>
        </div>
      </div>

      <div class="menu-main">
        <div class="menu-logo" id="menu-title">
          <h1>Dots &amp; Boxes</h1>
          <p class="menu-tagline">${x(`tagline`)}</p>
        </div>

        <div class="rank-card">
          <div class="rank-ring-wrap">
            ${Xn(e.xp)}
          </div>
          <div class="rank-info">
            <span class="rank-name">${t.rank}</span>
            <span class="rank-xp">${e.xp.toLocaleString()} XP</span>
          </div>
          <button class="btn-god-ring" id="btn-god-menu" title="${x(`god_mode`)}" aria-label="${x(`god_mode`)}">👑</button>
        </div>

        <div class="menu-buttons">
          <button class="btn-menu btn-arcade" id="btn-arcade">
            <div class="btn-menu-icon-wrap btn-icon--arcade">${R}</div>
            <div class="btn-menu-text">
              <strong>${x(`menu_arcade`)}</strong>
              <small>${x(`menu_arcade_sub`,{done:n,total:p})}</small>
            </div>
            ${r?`<span class="badge-new">NEW</span>`:``}
          </button>
          <button class="btn-menu btn-bot" id="btn-bot">
            <div class="btn-menu-icon-wrap btn-icon--bot">${Mn}</div>
            <div class="btn-menu-text">
              <strong>${x(`menu_bot`)}</strong>
              <small>${x(`menu_bot_sub`)}</small>
            </div>
          </button>
          <button class="btn-menu btn-multi" id="btn-multi">
            <div class="btn-menu-icon-wrap btn-icon--multi">${L}</div>
            <div class="btn-menu-text">
              <strong>${x(`menu_multi`)}</strong>
              <small>${x(`menu_multi_sub`)}</small>
            </div>
          </button>
        </div>

        ${_r()}

        <button class="btn-menu btn-tutorial" id="btn-tutorial">
          <div class="btn-menu-icon-wrap btn-icon--tutorial">${Nn}</div>
          <div class="btn-menu-text">
            <strong>${x(`menu_tutorial`)}</strong>
            <small>${x(`menu_tutorial_sub`)}</small>
          </div>
        </button>
      </div>

      <div class="bottom-bar">
        <div class="platform-pills">
          <span class="platform-pill">${In} PC</span>
          <span class="platform-pill">${Pn} Android</span>
          <span class="platform-pill">${Fn} IOS</span>
        </div>
        <div class="bottom-star">✦</div>
        <div class="version-tag">${c}</div>
      </div>

    </div>`,pr(),document.getElementById(`btn-arcade`).onclick=Z,document.getElementById(`btn-bot`).onclick=Cr,document.getElementById(`btn-multi`).onclick=wr,document.getElementById(`btn-tutorial`).onclick=Tr,document.getElementById(`btn-settings`).onclick=dr,document.getElementById(`btn-profile`)?.addEventListener(`click`,()=>K(`👤 `+x(`profile`)+` — em breve!`)),document.getElementById(`btn-god-menu`)?.addEventListener(`click`,()=>fr()),vr(),document.getElementById(`menu-title`).addEventListener(`click`,()=>{yr++,br&&clearTimeout(br),br=setTimeout(()=>{yr=0},3e3),yr>=7&&(yr=0,H.unlimitedEnergy=!H.unlimitedEnergy,Ut(H),K(H.unlimitedEnergy?x(`god_activated`):x(`god_deactivated`)),X())})}function Z(){Y();let e=kt(),t=``;for(let n=1;n<=p;n++){let r=e.stageProgress[n]?.stars??0,i=n===1||(e.stageProgress[n-1]?.stars??0)>0,a=`★`.repeat(r)+`☆`.repeat(3-r);t+=`<button class="stage-cell ${i?`unlocked`:`locked`} stars-${r}" data-stage="${n}" ${i?``:`disabled`}>
      <span class="stage-num">${n}</span><span class="stage-stars">${a}</span></button>`}U.innerHTML=`
    <div class="screen arcade-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${x(`back`)}</button>
        <h2>${W(R,x(`menu_arcade`))}</h2>
        <div id="energy-display" style="font-size:.75rem">${Zn()}</div>
      </div>
      <div class="stage-grid">${t}</div>
    </div>`,pr(),document.getElementById(`btn-back`).onclick=X,document.querySelectorAll(`.stage-cell.unlocked`).forEach(e=>{e.onclick=()=>Q(parseInt(e.dataset.stage,10))})}var xr={"muito-facil":{icon:`☆`,tier:`easy`},facil:{icon:`☆`,tier:`easy`},medio:{icon:`😊`,tier:`easy`},dificil:{icon:`😠`,tier:`hard`},"muito-dificil":{icon:`😠`,tier:`hard`},impossivel:{icon:`💀`,tier:`hard`},impulsivo:{icon:`🎲`,tier:`wild`}};function Sr(e){return`<div class="dot-grid-preview" style="grid-template-columns:repeat(${e},1fr)">${Array.from({length:e*e},()=>`<span class="dot-preview"></span>`).join(``)}</div>`}function Cr(){Y(),U.innerHTML=`
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${x(`back`)}</button>
        <h2>${W(Mn,x(`menu_bot`))}</h2>
        <span class="header-end-spacer"></span>
      </div>
      <div class="setup-section">
        <label class="setup-label">${x(`setup_difficulty`)}</label>
        <div class="diff-grid">${Ne.map(e=>{let t=xr[e];return`<button class="btn-diff btn-diff--${t.tier}" data-diff="${e}"><span class="diff-icon">${t.icon}</span>${Me(e)}</button>`}).join(``)}</div>
      </div>
      <div class="setup-section">
        <label class="setup-label">${x(`setup_grid`)}</label>
        <div class="grid-size-row">${[3,4,5,6].map(e=>`<button class="btn-grid-size" data-size="${e}"><span class="grid-size-label">${e}×${e}</span>${Sr(e)}</button>`).join(``)}</div>
      </div>
      <button class="btn-start" id="btn-start" disabled>${x(`setup_start`)}</button>
    </div>`,document.getElementById(`btn-back`).onclick=X;let e=null,t=4;document.querySelector(`[data-size="4"]`).classList.add(`selected`),document.querySelectorAll(`.btn-diff`).forEach(t=>{t.onclick=()=>{document.querySelectorAll(`.btn-diff`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),e=t.dataset.diff,document.getElementById(`btn-start`).disabled=!1}}),document.querySelectorAll(`.btn-grid-size`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-grid-size`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),t=parseInt(e.dataset.size,10)}}),document.getElementById(`btn-start`).onclick=()=>{e&&$(e,t)}}function wr(){Y(),U.innerHTML=`
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${x(`back`)}</button>
        <h2>${W(L,x(`menu_multi`))}</h2>
      </div>
      <div class="setup-section">
        <label class="setup-label">${x(`setup_players`)}</label>
        <div class="multi-grid multi-grid--players">${[2,3,4].map(e=>`<button class="btn-player-count" data-count="${e}"><span class="diff-icon">${L}</span>${x(`n_players`,{n:e})}</button>`).join(``)}</div>
      </div>
      <div class="setup-section" id="team-section" style="display:none">
        <label class="setup-label">${x(`setup_mode`)}</label>
        <div class="multi-grid multi-grid--teams">
          <button class="btn-team-mode selected" data-team="false">${x(`setup_solo`)}</button>
          <button class="btn-team-mode" data-team="true">${x(`setup_teams`)}</button>
        </div>
      </div>
      <div class="setup-section">
        <label class="setup-label">${x(`setup_grid`)}</label>
        <div class="multi-grid multi-grid--sizes">${[3,4,5,6].map(e=>`<button class="btn-grid-size" data-size="${e}"><span class="grid-size-label">${e}×${e}</span>${Sr(e)}</button>`).join(``)}</div>
      </div>
      <button class="btn-start" id="btn-start" disabled>${x(`setup_start`)}</button>
    </div>`,document.getElementById(`btn-back`).onclick=X;let e=0,t=!1,n=4;document.querySelector(`[data-size="4"]`).classList.add(`selected`),document.querySelectorAll(`.btn-player-count`).forEach(t=>{t.onclick=()=>{document.querySelectorAll(`.btn-player-count`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),e=parseInt(t.dataset.count,10),document.getElementById(`team-section`).style.display=e===4?`block`:`none`,document.getElementById(`btn-start`).disabled=!1}}),document.querySelectorAll(`.btn-team-mode`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-team-mode`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),t=e.dataset.team===`true`}}),document.querySelectorAll(`.btn-grid-size`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-grid-size`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),n=parseInt(e.dataset.size,10)}}),document.getElementById(`btn-start`).onclick=()=>{e&&Er(e,t,n)}}function Tr(){Y();let e=[{icon:`•••`,title:x(`tut_step1_title`),desc:x(`tut_step1_desc`)},{icon:`⬜`,title:x(`tut_step2_title`),desc:x(`tut_step2_desc`)},{icon:`★`,title:x(`tut_step3_title`),desc:x(`tut_step3_desc`)},{icon:`🔄`,title:x(`tut_step4_title`),desc:x(`tut_step4_desc`)}];U.innerHTML=`
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">${x(`back`)}</button>
        <h2>${W(Nn,x(`menu_tutorial`))}</h2>
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
        <p class="tut-hint-text">${x(`tut_hint`)}</p>
      </div>
    </div>`,document.getElementById(`btn-back`).onclick=X}function Q(e,t=!1,n=!1){if(!n&&Ze(e)){Gn(e,()=>Q(e,t,!0),Z);return}if(!t&&!H.unlimitedEnergy&&!Lt()){lr(()=>ur(e,t,n));return}let r=T(e),i=Et();B={mode:`arcade`,stageId:e,botDifficulty:r.difficulty,controller:new _e({board:r.board,players:[{name:x(`you`),color:i[0]},{name:x(`bot`),color:i[1]}]}),botPlayerId:`p2`,botThinking:!1,freeRetry:!1,maxChain:0,finishShown:!1},Dr()}function $(e,t){let n=Et();B={mode:`vs-bot`,botDifficulty:e,controller:new _e({gridSize:t,players:[{name:x(`you`),color:n[0]},{name:x(`bot`),color:n[1]}]}),botPlayerId:`p2`,botThinking:!1,freeRetry:!1,finishShown:!1},Dr()}function Er(e,t,n){let r=Jn(),i=Et();B={mode:`multi`,teamMode:t,playerCount:e,controller:new _e({gridSize:n,players:Array.from({length:e},(e,t)=>({name:r[t],color:i[t%i.length]}))}),botThinking:!1,freeRetry:!1,finishShown:!1},Dr()}function Dr(){if(!B)return;let e=B;Y();let t=e.mode===`arcade`?W(R,Xe(T(e.stageId))):e.mode===`vs-bot`?W(Mn,`${x(`menu_bot`)} · ${Me(e.botDifficulty)}`):W(L,e.teamMode?x(`teams_2v2`):x(`n_players`,{n:e.playerCount}));U.innerHTML=`
    <div class="screen game-screen">
      <div class="game-hud">
        <div class="screen-header">
          <button class="btn-back" id="btn-back">${x(`back`)}</button>
          <h2>${t}</h2>
          <div class="game-header-actions">
            ${e.mode===`vs-bot`?`<button class="btn-restart-corner" id="btn-restart-game" title="${x(`restart`)}" aria-label="${x(`restart`)}">${Vn}</button>`:`<span class="header-end-spacer"></span>`}
            <button class="btn-god-corner" id="btn-god-game" title="${x(`god_mode`)}" aria-label="${x(`god_mode`)}">👑</button>
          </div>
        </div>
        <div id="scoreboard" class="scoreboard"></div>
        <div id="status" class="status"></div>
        ${e.mode===`arcade`?`<div id="energy-display" class="game-energy-display">${Zn()}</div>`:``}
      </div>
      <div class="canvas-wrapper"><canvas id="board"></canvas></div>
    </div>`,document.getElementById(`btn-back`).onclick=()=>{B=null,V=null,e.mode===`arcade`?Z():e.mode===`vs-bot`?Cr():wr()},document.getElementById(`btn-restart-game`)?.addEventListener(`click`,()=>{if(e.mode!==`vs-bot`)return;let t=e.controller.getState();V=null,$(e.botDifficulty,t.gridSize)}),document.getElementById(`btn-god-game`)?.addEventListener(`click`,()=>fr(e.stageId));let n=document.getElementById(`board`),r=n.getContext(`2d`);function a(){let t=e.controller.getState(),{width:i,height:a}=Se(t.gridRows,t.gridCols),s=window.devicePixelRatio||1;n.width=Math.round(i*s),n.height=Math.round(a*s),n.style.width=`${i}px`,n.style.height=`${a}px`,r.setTransform(s,0,0,s,0,0),Ce(r,t,V,e.teamMode??!1),o()}function o(){let t=e.controller.getState(),n=document.getElementById(`scoreboard`),r=document.getElementById(`status`);if(!n||!r)return;let i=Et();if(e.teamMode&&e.playerCount===4){let e=t.players.filter((e,t)=>t%2==0).reduce((e,t)=>e+t.score,0),r=t.players.filter((e,t)=>t%2==1).reduce((e,t)=>e+t.score,0);n.innerHTML=`<div class="team-chip" style="--pc:${i[0]}">${x(`team_a`)} <strong>${e}</strong></div><div class="team-chip" style="--pc:${i[1]}">${x(`team_b`)} <strong>${r}</strong></div>`}else n.innerHTML=t.players.map(e=>`<div class="player-chip ${e.id===t.currentPlayerId&&t.status===`playing`?`player-chip--active`:``}" style="--pc:${e.color}"><span class="player-dot"></span><span class="player-name">${e.name}</span><span class="player-score">${e.score}</span></div>`).join(``);if(t.status===`finished`)r.textContent=``,r.dataset.state=`hidden`,s();else if(e.botThinking)r.textContent=x(`game_bot_thinking`),r.dataset.state=`bot`;else{let e=t.players.find(e=>e.id===t.currentPlayerId);r.textContent=e.name===x(`you`)?x(`game_turn_you`):x(`game_turn`,{name:e.name}),r.dataset.state=`turn`}}function s(){if(e.finishShown)return;e.finishShown=!0;let t=e.controller.getState(),n=Math.max(...t.players.map(e=>e.score));if(e.mode===`arcade`&&e.stageId!=null){let n=T(e.stageId),r=t.players.find(t=>t.id!==e.botPlayerId),i=t.players.find(t=>t.id===e.botPlayerId),a=r.score>i.score,o=r.score===i.score;if(a){let t=Je(r.score,i.score,n.totalMaxScore,n.effectiveDifficulty),a=100;t>=2&&(a+=50),t>=3&&(a+=50),jt(e.stageId,t,r.score*100,a);let o=e.stageId<p?e.stageId+1:null;or(t,a,Xe(n),o,()=>{o?Q(o):Z()},()=>{B=null,V=null,Z()})}else{let t=()=>{B=null,V=null,Q(e.stageId,!1,!0)},n=()=>{B=null,V=null,Z()},r=e.stageId<p?e.stageId+1:null;sr(t,n,o,!o&&r!=null?{available:st(),onSkip:()=>cr(()=>{ct()?(B=null,V=null,Q(r,!0)):K(x(`no_skips_left`))})}:void 0)}}else if(e.mode===`vs-bot`){let r=t.players.find(t=>t.id!==e.botPlayerId),i=t.players.find(t=>t.id===e.botPlayerId);r.score===i.score?sr(()=>$(e.botDifficulty,t.gridSize),X,!0):r.score===n?or(1,60,``,null,()=>$(e.botDifficulty,t.gridSize),X,x(`victory`)):sr(()=>$(e.botDifficulty,t.gridSize),X)}else{let r=t.players.filter(e=>e.score===n);or(3,80,``,null,()=>Er(e.playerCount,e.teamMode,t.gridSize),X,r.length===1?`${r[0].name} ${x(`won_suffix`)}`:x(`tie`))}}function c(){return!!e.botPlayerId&&e.controller.getState().currentPlayerId===e.botPlayerId}function l(){e.botDifficulty&&(e.botThinking=!0,o(),setTimeout(()=>{if(!B||B!==e)return;let t=e.controller.getState();t.status===`finished`||!c()||(e.controller.playLine(ze(t,e.botDifficulty)),e.botThinking=!1,a(),c()&&e.controller.getState().status!==`finished`&&l())},Be(e.botDifficulty)))}function u(t){let n=e.controller.getState();if(n.status===`finished`||e.botThinking||c()||t.ownerId!==null)return;let r=e.botPlayerId==null?0:n.players.find(t=>t.id!==e.botPlayerId)?.score??0;e.controller.playLine(t),V=null,a();let i=e.botPlayerId==null?0:e.controller.getState().players.find(t=>t.id!==e.botPlayerId)?.score??0;if(yt(i>r?[40,20,40]:18),e.mode===`arcade`&&e.botPlayerId!=null){let t=i-r;t>(e.maxChain??0)&&(e.maxChain=t)}c()&&e.controller.getState().status!==`finished`&&l()}n.addEventListener(`mousemove`,t=>{let r=e.controller.getState();if(r.status===`finished`||e.botThinking||c())return;let{x:o,y:s}=Yn(n,t.clientX,t.clientY),l=we(r,o,s),u=l?.ownerId===null?l:null;(V?i(V):null)!==(u?i(u):null)&&(V=u,a()),n.style.cursor=V?`pointer`:`default`}),n.addEventListener(`mouseleave`,()=>{V=null,a(),n.style.cursor=`default`}),n.addEventListener(`pointerdown`,t=>{let r=e.controller.getState();if(r.status===`finished`||e.botThinking||c()||t.pointerType===`mouse`&&t.button!==0)return;t.pointerType!==`mouse`&&t.preventDefault();let i=t.pointerType===`mouse`?24:ne,{x:a,y:o}=Yn(n,t.clientX,t.clientY),s=we(r,a,o,i);s&&u(s)}),a(),e.mode===`arcade`&&pr(),c()&&l()}var Or=document.createElement(`style`);Or.textContent=`
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
  --ui-accent:     #06b6d4;
  --ui-accent-soft:rgba(6,182,212,0.14);
  --ui-accent-border:rgba(6,182,212,0.42);
  --ui-accent-glow:0 0 16px rgba(6,182,212,0.18);
  --ui-accent-contrast:#ffffff;
  --toggle-on:     #22c55e;
  --arcade-border: linear-gradient(135deg,#ec4899,#8b5cf6,#06b6d4);
  --arcade-glow:   0 0 24px rgba(139,92,246,0.25), 0 0 48px rgba(236,72,153,0.1);
  --title-gradient:linear-gradient(135deg,#f97316 0%,#a855f7 50%,#06b6d4 100%);
  --title-shadow: 0 2px 12px rgba(0,0,0,0.35);
}
html[data-theme="light"] {
  --bg:            #f0e8d8;
  --bg-2:          #faf5ee;
  --bg-3:          #e8dcc8;
  --border:        rgba(120,90,50,0.12);
  --border-strong: rgba(120,90,50,0.24);
  --text:          #2d1f0e;
  --text-2:        #6b5540;
  --text-3:        #a08868;
  --shadow:        0 2px 12px rgba(120,90,50,0.12);
  --ring-bg:       rgba(120,90,50,0.1);
  --btn-bg:        #e8dcc8;
  --ui-accent:     #f59e0b;
  --ui-accent-soft:rgba(245,158,11,0.14);
  --ui-accent-border:rgba(245,158,11,0.45);
  --ui-accent-glow:0 0 16px rgba(245,158,11,0.18);
  --ui-accent-contrast:#2d1f0e;
  --toggle-on:     #f59e0b;
  --arcade-border: linear-gradient(135deg,#3b82f6,#6366f1);
  --arcade-glow:   0 0 16px rgba(59,130,246,0.15);
  --title-gradient:linear-gradient(135deg,#7c4a00 0%,#c2410c 52%,#92400e 100%);
  --title-shadow: 0 2px 12px rgba(120,90,50,0.22);
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
  --ui-accent:     #ec4899;
  --ui-accent-soft:rgba(236,72,153,0.14);
  --ui-accent-border:rgba(236,72,153,0.4);
  --ui-accent-glow:0 0 16px rgba(236,72,153,0.18);
  --ui-accent-contrast:#ffffff;
  --toggle-on:     #ec4899;
  --arcade-border: linear-gradient(135deg,#ec4899,#f9a8d4);
  --arcade-glow:   0 0 16px rgba(236,72,153,0.2);
  --title-gradient:linear-gradient(135deg,#7f1d4e 0%,#be185d 52%,#db2777 100%);
  --title-shadow: 0 2px 12px rgba(122,15,75,0.22);
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
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  background: var(--ui-accent-soft); border: 1px solid var(--ui-accent-border);
  border-radius: 999px; min-height: 38px; padding: 0 14px 0 12px;
  color: var(--ui-accent); cursor: pointer; font-size: .78rem; font-weight: 700;
  letter-spacing: .1px; transition: all .15s; backdrop-filter: blur(8px);
  box-shadow: 0 0 0 1px rgba(255,255,255,.02) inset;
  white-space: nowrap;
}
.btn-settings-pill svg { width: 16px; height: 16px; flex-shrink: 0; }
.btn-settings-pill:hover {
  background: var(--bg-3); color: var(--ui-accent); transform: translateY(-1px);
  box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow);
}
.btn-settings-pill:active { transform: translateY(0); }
.btn-settings-pill span { line-height: 1; }
.btn-profile-icon {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--bg-2); border: 1px solid var(--ui-accent-border);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: var(--ui-accent); transition: all .15s;
  box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
}
.btn-profile-icon:hover {
  background: var(--bg-3); color: var(--ui-accent); transform: translateY(-1px);
  box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow);
}
.btn-profile-icon:active { transform: translateY(0); }
.btn-profile-icon svg { width: 18px; height: 18px; }

/* ── MENU ────────────────────────────────────────────────────── */
.menu-screen { justify-content: flex-start; padding-top: 4px; gap: 14px; }
.menu-main {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.menu-logo { cursor: pointer; user-select: none; text-align: center; }
.menu-logo h1,
.theme-setup-brand h1 {
  font-size: 2.4rem; font-weight: 900; letter-spacing: -1px;
  background: var(--title-gradient);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  text-shadow: 0 2px 10px var(--title-shadow);
}
.menu-tagline { color: var(--text-2); font-size: .88rem; margin-top: 2px; }

.theme-setup-screen {
  justify-content: center;
  gap: 18px;
  padding-top: 28px;
  padding-bottom: 32px;
}
.theme-setup-hero {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 8px;
}
.theme-setup-brand { cursor: default; user-select: none; text-align: center; }
.theme-setup-brand h1 { font-size: 2.3rem; }
.theme-setup-subtitle {
  font-size: .88rem;
  color: var(--text-2);
  font-weight: 600;
  letter-spacing: .1px;
}
.theme-setup-hero h2 {
  font-size: 1.35rem;
  color: var(--text);
  font-weight: 800;
}
.theme-setup-panel {
  width: min(100%, 460px);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.theme-choice {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1.5px solid var(--choice-accent-border);
  background: linear-gradient(180deg, color-mix(in srgb, var(--choice-accent-soft) 22%, var(--bg-2) 78%) 0%, var(--bg-2) 100%);
  color: var(--text);
  cursor: pointer;
  transition: all .15s;
  box-shadow: 0 0 0 1px var(--choice-accent-soft) inset;
}
.theme-choice:hover {
  background: var(--bg-3);
  color: var(--text);
  border-color: var(--choice-accent);
  transform: translateY(-1px);
  box-shadow: 0 0 0 1px var(--choice-accent-border) inset, 0 0 18px var(--choice-accent-soft);
}
.theme-choice.active {
  background: linear-gradient(180deg, color-mix(in srgb, var(--choice-accent-soft) 46%, var(--bg-2) 54%) 0%, color-mix(in srgb, var(--choice-accent-soft) 18%, var(--bg-2) 82%) 100%);
  border-color: var(--choice-accent);
  transform: translateY(-2px);
  box-shadow: 0 0 0 1px var(--choice-accent-soft) inset, 0 14px 28px var(--choice-accent-soft);
}
.theme-choice-icon {
  width: 44px; height: 44px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-size: 1.2rem;
  background: var(--choice-accent-soft);
  border: 1px solid var(--choice-accent-border);
  color: var(--choice-accent);
  box-shadow: 0 0 0 1px rgba(255,255,255,.02) inset;
}
.theme-choice-icon svg { width: 18px; height: 18px; flex-shrink: 0; }
.theme-choice-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 0;
}
.theme-choice-text strong { font-size: .98rem; font-weight: 800; }
.theme-choice-text small { font-size: .76rem; color: var(--text-2); }
.theme-choice-arrow {
  color: var(--choice-accent);
  font-size: 1.1rem;
  font-weight: 800;
  line-height: 1;
}

/* ── RANK CARD ───────────────────────────────────────────────── */
.theme-setup-actions {
  width: min(100%, 460px);
  display: flex;
  justify-content: center;
}
.btn-theme-confirm {
  width: 100%;
  background: var(--ui-accent);
  color: var(--ui-accent-contrast);
  border: none;
  border-radius: 14px;
  padding: 14px 18px;
  font-size: .96rem;
  font-weight: 800;
  cursor: pointer;
  transition: all .15s;
  box-shadow: 0 10px 28px var(--ui-accent-soft);
}
.btn-theme-confirm:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}
.btn-theme-confirm:disabled {
  opacity: .5;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

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
.energy-bolt { font-size: 1.1rem; color: var(--ui-accent); }
.energy-count { font-weight: 800; color: var(--ui-accent); font-size: .9rem; min-width: 36px; }
.energy-timer { font-size: .75rem; font-weight: 700; color: var(--text-2); white-space: nowrap; }
.e-dots-wrap { display: none; }
.menu-screen .energy-row { flex-wrap: wrap; justify-content: center; row-gap: 6px; }
.menu-screen .e-dots-wrap { display: flex; flex-basis: 100%; justify-content: center; gap: 3px; }
.menu-screen .e-bar-wrap  { display: none; }
.menu-energy-chip {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
}
.menu-energy-chip .energy-row {
  width: auto;
  flex-wrap: nowrap;
  gap: 6px;
  justify-content: flex-end;
  padding: 6px 10px;
  border-radius: 999px;
  background: var(--ui-accent-soft);
  border: 1px solid var(--ui-accent-border);
  box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
}
.menu-energy-chip .energy-bolt { font-size: .95rem; }
.menu-energy-chip .energy-count { min-width: 0; font-size: .72rem; }
.menu-energy-chip .energy-timer { font-size: .64rem; }
.menu-energy-chip .e-dots-wrap,
.menu-energy-chip .e-bar-wrap { display: none; }
.e-bar-wrap {
  display: flex; flex: 1; max-width: 200px; height: 13px;
  background: rgba(0,0,0,.35); border-radius: 6px; overflow: hidden;
  border: 1px solid rgba(255,255,255,.1);
  box-shadow: inset 0 1px 3px rgba(0,0,0,.4);
}
.e-bar-fill {
  height: 100%; border-radius: 6px; transition: width .4s ease;
  background: linear-gradient(90deg, var(--ui-accent) 0%, color-mix(in srgb, var(--ui-accent) 72%, #ffffff 28%) 60%, color-mix(in srgb, var(--ui-accent) 42%, #ffffff 58%) 100%);
  box-shadow: 0 0 10px var(--ui-accent-soft);
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
.btn-icon--arcade { background: rgba(6,182,212,.14); border: 1.5px solid rgba(6,182,212,.5); }

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
html[data-theme="light"] .btn-tutorial { background: #e8dcc8; }
html[data-theme="light"] .btn-arcade:hover,
html[data-theme="light"] .btn-bot:hover,
html[data-theme="light"] .btn-multi:hover,
html[data-theme="light"] .btn-tutorial:hover { background: #d4c4a8; }
html[data-theme="light"] .btn-arcade,
html[data-theme="light"] .btn-bot,
html[data-theme="light"] .btn-multi,
html[data-theme="light"] .btn-tutorial {
  border-color: var(--ui-accent-border);
  box-shadow: 0 0 14px rgba(245,158,11,.12);
}
html[data-theme="light"] .btn-arcade:hover,
html[data-theme="light"] .btn-bot:hover,
html[data-theme="light"] .btn-multi:hover,
html[data-theme="light"] .btn-tutorial:hover {
  border-color: var(--ui-accent);
  box-shadow: 0 0 22px var(--ui-accent-soft);
}
html[data-theme="light"] .btn-icon--arcade,
html[data-theme="light"] .btn-icon--bot,
html[data-theme="light"] .btn-icon--multi,
html[data-theme="light"] .btn-icon--tutorial {
  background: var(--ui-accent-soft);
  border-color: var(--ui-accent-border);
  color: var(--ui-accent);
}
html[data-theme="light"] .btn-profile-icon {
  background: var(--ui-accent-soft);
  color: var(--ui-accent);
}
html[data-theme="pink"] .btn-arcade,
html[data-theme="pink"] .btn-bot,
html[data-theme="pink"] .btn-multi,
html[data-theme="pink"] .btn-tutorial { background: #fbcfe8; }
html[data-theme="pink"] .btn-arcade:hover,
html[data-theme="pink"] .btn-bot:hover,
html[data-theme="pink"] .btn-multi:hover,
html[data-theme="pink"] .btn-tutorial:hover { background: #f9a8d4; }
html[data-theme="pink"] .btn-arcade,
html[data-theme="pink"] .btn-bot,
html[data-theme="pink"] .btn-multi,
html[data-theme="pink"] .btn-tutorial {
  border-color: var(--ui-accent-border);
  box-shadow: 0 0 14px rgba(236,72,153,.12);
}
html[data-theme="pink"] .btn-arcade:hover,
html[data-theme="pink"] .btn-bot:hover,
html[data-theme="pink"] .btn-multi:hover,
html[data-theme="pink"] .btn-tutorial:hover {
  border-color: var(--ui-accent);
  box-shadow: 0 0 22px var(--ui-accent-soft);
}
html[data-theme="pink"] .btn-menu-icon-wrap {
  background: var(--ui-accent-soft);
  border-color: var(--ui-accent-border);
  color: var(--ui-accent);
}
html[data-theme="pink"] .btn-settings-pill,
html[data-theme="pink"] .btn-profile-icon,
html[data-theme="pink"] .section-title-icon {
  background: var(--ui-accent-soft);
  border-color: var(--ui-accent-border);
  color: var(--ui-accent);
}
html[data-theme="pink"] .btn-settings-pill:hover,
html[data-theme="pink"] .btn-profile-icon:hover {
  background: var(--bg-3); color: var(--ui-accent);
  box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow);
}

/* Pink — seleções e interativos */
html[data-theme="pink"] .btn-lang.active { border-color: var(--ui-accent-border); box-shadow: 0 0 0 2px var(--ui-accent-soft); }
html[data-theme="pink"] .btn-theme-opt.active { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
html[data-theme="pink"] .btn-diff.selected,
html[data-theme="pink"] .btn-grid-size.selected,
html[data-theme="pink"] .btn-player-count.selected,
html[data-theme="pink"] .btn-team-mode.selected { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
html[data-theme="pink"] .btn-grid-size.selected .dot-preview { background: var(--ui-accent); }
html[data-theme="pink"] .btn-start { background: #ec4899; box-shadow: 0 4px 16px rgba(236,72,153,.35); }
html[data-theme="pink"] .btn-start:hover:not(:disabled) { background: #db2777; }
html[data-theme="pink"] .btn-ad { border-color: #ec4899; color: #be185d; }
html[data-theme="pink"] .btn-ad:hover { background: rgba(236,72,153,.1); }
html[data-theme="pink"] .stage-cell.unlocked:hover { border-color: rgba(236,72,153,.5); }
html[data-theme="pink"] .stage-cell.stars-3 { border-color: rgba(236,72,153,.6); }
html[data-theme="pink"] .btn-lang.active { border-color: var(--ui-accent-border); }

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
.btn-lang.active {
  background: var(--ui-accent-soft); border-color: var(--ui-accent-border);
  box-shadow: 0 0 0 2px var(--ui-accent-soft); color: var(--ui-accent);
  transform: scale(1.1);
}

/* ── BOTTOM BAR ──────────────────────────────────────────────── */
.bottom-bar {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  margin-top: auto; padding-top: 8px; width: 100%;
  position: relative;
}
/* ── TOGGLE DE TEMA ──────────────────────────────────────────── */
.theme-toggle-wrap {
  display: flex;
  background: var(--bg-2); border: 1.5px solid var(--ui-accent-border);
  border-radius: 20px; overflow: hidden;
  box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
}
.theme-toggle-opt {
  flex: 1; padding: 5px 10px; font-size: .75rem; font-weight: 800;
  cursor: pointer; border: none; background: transparent;
  color: var(--text-2); transition: all .15s; white-space: nowrap;
  display: flex; align-items: center; justify-content: center;
}
.theme-toggle-opt svg { flex-shrink: 0; }
.theme-toggle-opt:hover { color: var(--ui-accent); }
.theme-toggle-opt.active {
  background: var(--ui-accent-soft); color: var(--ui-accent);
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
  .screen {
    padding: 10px 14px 14px;
    gap: 10px;
  }
  .menu-screen {
    gap: 8px;
    padding-top: 4px;
  }
  .menu-main {
    flex: 1 1 auto;
    justify-content: center;
    gap: 8px;
    padding-block: clamp(4px, 1.2vh, 10px);
    transform: translateY(-25px);
  }
  .topbar {
    padding-top: 0;
  }
  .topbar-right {
    gap: 6px;
  }
  .btn-settings-pill {
    min-height: 34px;
    padding: 0 10px 0 9px;
    font-size: .7rem;
  }
  .btn-settings-pill svg {
    width: 15px;
    height: 15px;
  }
  .btn-profile-icon {
    width: 34px;
    height: 34px;
  }
  .btn-profile-icon svg {
    width: 16px;
    height: 16px;
  }
  .menu-energy-chip .energy-row {
    padding: 5px 8px;
    gap: 5px;
  }
  .menu-energy-chip .energy-bolt {
    font-size: .88rem;
  }
  .menu-energy-chip .energy-count {
    font-size: .68rem;
  }
  .menu-energy-chip .energy-timer {
    font-size: .6rem;
  }
  .menu-logo { margin-top: 0; }
  .menu-logo h1 {
    font-size: clamp(1.55rem, 7vw, 1.95rem);
    line-height: .96;
  }
  .menu-tagline {
    font-size: .72rem;
    margin-top: 0;
  }
  .rank-card {
    padding: 8px 12px;
    gap: 10px;
    border-radius: 14px;
  }
  .rank-ring-wrap {
    width: 44px;
    height: 44px;
  }
  .rank-name {
    font-size: .92rem;
  }
  .rank-xp {
    font-size: .7rem;
  }
  .btn-god-ring {
    font-size: .95rem;
  }
  .menu-buttons {
    gap: 8px;
  }
  .btn-menu {
    padding: 10px 12px;
    border-radius: 14px;
    gap: 10px;
    min-height: 44px;
  }
  .btn-menu-icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    font-size: 1rem;
  }
  .btn-menu-text {
    align-items: flex-start;
    gap: 0;
  }
  .btn-menu-text strong {
    font-size: .87rem;
  }
  .btn-menu-text small {
    font-size: .66rem;
    line-height: 1.05;
  }
  .badge-new {
    top: 8px;
    right: 8px;
    font-size: .52rem;
    padding: 2px 5px;
  }
  .theme-setup-screen {
    padding-top: 20px;
    padding-bottom: 24px;
  }
  .theme-setup-brand h1 {
    font-size: 1.95rem;
  }
  .theme-setup-panel {
    width: 100%;
  }
  .lang-selector {
    gap: 6px;
  }
  .btn-lang {
    width: 34px;
    height: 34px;
  }
  .btn-lang .fi-flag-icon {
    font-size: 1.05rem;
  }
  .bottom-bar {
    padding-bottom: 2px;
    gap: 6px;
  }
  .platform-pills {
    padding: 4px 10px;
    gap: 8px;
  }
  .platform-pill {
    font-size: .62rem;
    letter-spacing: .45px;
  }
  .bottom-star {
    font-size: 1rem;
  }
  .version-tag {
    font-size: .6rem;
  }
  .screen:not(.menu-screen):not(.game-screen):not(.theme-setup-screen) {
    padding-top: clamp(48px, 8vh, 80px);
  }
}

@media (max-width: 767px) and (max-height: 700px) {
  .menu-tagline,
  .btn-menu-text small,
  .platform-pills {
    display: none;
  }
  .menu-screen {
    gap: 6px;
  }
  .menu-main {
    gap: 6px;
    padding-block: 0;
    transform: translateY(-25px);
  }
  .bottom-bar {
    padding-top: 2px;
    min-height: 16px;
  }
}

/* ── HEADER (outras telas) ───────────────────────────────────── */
.screen-header {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%; gap: 10px; padding-bottom: 4px;
}
.screen-header h2 {
  flex: 1; display: flex; align-items: center; justify-content: center;
  text-align: center; font-size: 1.1rem; font-weight: 800; color: var(--text);
  min-width: 0;
}
.section-title { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-width: 0; }
.section-title-icon {
  width: 28px; height: 28px; border-radius: 9px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--ui-accent-soft); border: 1px solid var(--ui-accent-border);
  color: var(--ui-accent); box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
  flex-shrink: 0;
}
.section-title-icon svg { width: 15px; height: 15px; flex-shrink: 0; }
.section-title > span:last-child { min-width: 0; }
.header-end-spacer { flex: 0 0 72px; }
.game-header-actions {
  flex: 0 0 72px;
  min-width: 72px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}
.btn-back {
  background: var(--ui-accent-soft); border: 1px solid var(--ui-accent-border);
  border-radius: 10px; padding: 8px 14px; color: var(--ui-accent);
  cursor: pointer; font-size: .84rem; font-weight: 600;
  transition: all .15s; white-space: nowrap;
  box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
}
.btn-back:hover {
  background: var(--bg-3); color: var(--ui-accent);
  box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow);
}
.btn-god-corner {
  background: var(--ui-accent-soft); border: 1px solid var(--ui-accent-border);
  border-radius: 10px; padding: 6px 10px; color: var(--ui-accent);
  cursor: pointer; font-size: .95rem; transition: all .15s;
  box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
}
.btn-god-corner:hover {
  background: var(--bg-3); box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow);
}

/* ── ARCADE MAP ──────────────────────────────────────────────── */
.stage-grid { display: grid; grid-template-columns: repeat(5,1fr); gap: 8px; width: 100%; padding-bottom: 24px; }
.stage-cell {
  background: var(--bg-2); border: 1px solid var(--border); border-radius: 12px;
  padding: 8px 4px; cursor: pointer; color: var(--text);
  display: flex; flex-direction: column; align-items: center; gap: 2px; transition: all .15s;
}
.stage-cell:disabled { opacity: .58; cursor: not-allowed; filter: saturate(.92); }
.stage-cell.unlocked:hover { background: var(--bg-3); border-color: var(--border-strong); }
.stage-cell.stars-3 { border-color: color-mix(in srgb, var(--ui-accent) 78%, #ffffff 22%); }
.stage-cell.stars-2 { border-color: var(--ui-accent-border); }
.stage-cell.stars-1 { border-color: color-mix(in srgb, var(--ui-accent) 40%, transparent); }
.stage-num { font-size: .85rem; font-weight: 700; }
.stage-stars { font-size: .6rem; color: var(--ui-accent); }

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
  background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent);
}
/* Difficulty buttons — layout + tier colors */
.btn-diff { display: flex; align-items: center; gap: 8px; text-align: left; }
.btn-diff:last-child:nth-child(odd) { grid-column: 1 / -1; justify-content: center; }
.diff-icon { font-size: 1rem; flex-shrink: 0; }
.btn-diff--easy  { border-color: rgba(6,182,212,.4); }
.btn-diff--easy:hover  { border-color: #06b6d4; background: rgba(6,182,212,.06); }
.btn-diff--easy.selected  { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
.btn-diff--hard  { border-color: rgba(168,85,247,.4); }
.btn-diff--hard:hover  { border-color: #a855f7; background: rgba(168,85,247,.06); }
.btn-diff--hard.selected  { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
.btn-diff--wild  { border-color: rgba(249,115,22,.4); }
.btn-diff--wild:hover  { border-color: #f97316; background: rgba(249,115,22,.06); }
.btn-diff--wild.selected  { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
html[data-theme="light"] .btn-diff--easy,
html[data-theme="light"] .btn-diff--hard,
html[data-theme="light"] .btn-diff--wild {
  border-color: var(--ui-accent-border);
}
html[data-theme="light"] .btn-diff--easy:hover,
html[data-theme="light"] .btn-diff--hard:hover,
html[data-theme="light"] .btn-diff--wild:hover {
  border-color: var(--ui-accent);
  background: var(--ui-accent-soft);
}
/* Grid size buttons with dot preview */
.btn-grid-size { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 10px 8px; }
.btn-grid-size:hover { background: var(--bg-3); }
.btn-grid-size.selected { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
.grid-size-label { font-weight: 700; font-size: .85rem; }
.dot-grid-preview { display: grid; gap: 3px; }
.dot-preview { width: 5px; height: 5px; border-radius: 50%; background: rgba(140,155,180,.4); }
.btn-grid-size.selected .dot-preview { background: var(--ui-accent); }
.multi-grid { display: grid; gap: 8px; width: 100%; }
.multi-grid--players { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.multi-grid--teams,
.multi-grid--sizes { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.btn-player-count { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; }
.btn-team-mode { min-height: 48px; }
.grid-size-row { display: flex; gap: 8px; flex-wrap: wrap; }
.grid-size-row > * { flex: 1; min-width: 70px; }
.btn-start {
  background: var(--ui-accent); border: none; border-radius: 12px; padding: 14px;
  color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer; width: 100%;
  margin-top: 8px; transition: all .15s; box-shadow: 0 4px 16px var(--ui-accent-soft);
}
.btn-start:hover:not(:disabled) { filter: brightness(1.06); }
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
  align-items: center;
  pointer-events: none;
}
.game-hud > * { pointer-events: none; }
.game-hud .screen-header,
.game-hud .screen-header * { pointer-events: auto; }
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
.status {
  display: inline-flex; align-items: center; justify-content: center;
  padding: 6px 14px; border-radius: 999px;
  font-size: .82rem; font-weight: 800; letter-spacing: .2px;
  min-height: 30px; min-width: 110px; transition: all .2s;
  text-align: center; white-space: nowrap;
  align-self: center; border: 1px solid transparent;
}
.status[data-state="turn"] {
  background: var(--ui-accent-soft); border-color: var(--ui-accent-border);
  color: var(--ui-accent); box-shadow: 0 0 0 1px var(--ui-accent-soft) inset, var(--ui-accent-glow);
}
.status[data-state="bot"] {
  background: var(--bg-2); border-color: var(--border-strong);
  color: var(--text-2); box-shadow: var(--shadow);
}
.status[data-state="hidden"] { opacity: 0; transform: translateY(-4px); }
.game-energy-display {
  width: min(360px, 100%);
  display: flex;
  justify-content: center;
}
.game-energy-display .energy-row { max-width: 360px; }
.game-energy-display .e-bar-wrap { max-width: 220px; }
.canvas-wrapper { width: 100%; display: flex; justify-content: center; }
canvas { max-width: 100%; height: auto; border-radius: 14px; background: var(--bg-2); box-shadow: var(--shadow); touch-action: none; display: block; }

/* ── MODAL (Settings + God Mode) ────────────────────────────── */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.6); display: flex; align-items: center; justify-content: center; z-index: 700; backdrop-filter: blur(6px); animation: fadeIn .2s; }
.modal-card {
  background: var(--bg-2); border: 1px solid var(--ui-accent-border); border-radius: 20px;
  padding: 24px; width: 320px; display: flex; flex-direction: column; gap: 20px;
  box-shadow: 0 20px 60px rgba(0,0,0,.4), 0 0 0 1px var(--ui-accent-soft);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 1.05rem; font-weight: 800; color: var(--ui-accent);
}
.modal-header > span { display: inline-flex; align-items: center; gap: 6px; }
.modal-header > span svg { width: 16px; height: 16px; flex-shrink: 0; }
.modal-close {
  background: var(--ui-accent-soft); border: 1px solid var(--ui-accent-border);
  color: var(--ui-accent); cursor: pointer; font-size: 1.1rem; padding: 4px;
  border-radius: 6px; transition: all .15s;
}
.modal-close:hover { background: var(--bg-3); box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow); }
.settings-section { display: flex; flex-direction: column; gap: 10px; }
.settings-label { font-size: .72rem; font-weight: 700; color: var(--text-3); text-transform: uppercase; letter-spacing: 1px; }
.theme-row { display: flex; gap: 8px; }
.btn-theme-opt { flex: 1; background: var(--bg-3); border: 1px solid var(--border); border-radius: 10px; padding: 10px; color: var(--text-2); cursor: pointer; font-size: .82rem; font-weight: 600; transition: all .15s; display: flex; align-items: center; justify-content: center; gap: 5px; }
.btn-theme-opt svg { flex-shrink: 0; }
.btn-theme-opt:hover { border-color: var(--ui-accent-border); color: var(--ui-accent); }
.btn-theme-opt.active { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
.settings-vibration-label { display: inline-flex; align-items: center; gap: 8px; }
.settings-vibration-icon { display: inline-flex; align-items: center; justify-content: center; color: var(--ui-accent); }
.settings-vibration-icon svg { width: 16px; height: 16px; flex-shrink: 0; }
.settings-version { font-size: .72rem; color: var(--text-3); text-align: center; }
.settings-lang { margin-top: 0; }
.music-vol-row { display: flex; align-items: center; gap: 8px; width: 100%; }
.music-vol-icon { font-size: 1rem; flex-shrink: 0; }
.music-vol-slider { flex: 1; height: 4px; accent-color: var(--ui-accent); cursor: pointer; border-radius: 4px; }
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
.toggle-switch input:checked + .toggle-track { background: var(--toggle-on); }
.toggle-switch input:checked + .toggle-track::after { transform: translateX(20px); }

/* God Mode */
.god-card { border-color: rgba(243,156,18,.3); }
.god-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.god-label { font-size: .88rem; color: var(--text-2); font-weight: 600; }
.god-toggle { background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: 8px; padding: 7px 16px; color: var(--text-2); font-weight: 700; cursor: pointer; transition: all .15s; font-size: .85rem; }
.god-toggle.on { background: var(--ui-accent-soft); border-color: var(--ui-accent-border); color: var(--ui-accent); }
.god-input-row { display: flex; gap: 8px; }
.god-input { background: var(--bg-3); border: 1px solid var(--border-strong); border-radius: 8px; padding: 8px 12px; color: var(--text); font-size: .9rem; width: 90px; outline: none; }
.god-input:focus { border-color: var(--ui-accent-border); }
.god-go { background: var(--ui-accent); border: none; border-radius: 8px; padding: 8px 14px; color: #fff; font-weight: 700; cursor: pointer; font-size: .85rem; box-shadow: 0 4px 16px var(--ui-accent-soft); }
.god-skip { background: rgba(155,89,182,.15); border: 1px solid #9b59b6; border-radius: 10px; padding: 10px; color: #9b59b6; font-weight: 700; cursor: pointer; width: 100%; text-align: center; font-size: .88rem; }
.god-skip:hover { background: rgba(155,89,182,.25); }
.god-refill { background: rgba(243,156,18,.1); border: 1px solid rgba(243,156,18,.4); border-radius: 10px; padding: 10px; color: #f39c12; font-weight: 700; cursor: pointer; width: 100%; text-align: center; font-size: .88rem; }
.god-refill:hover { background: rgba(243,156,18,.2); }

/* ── CELEBRAÇÃO ──────────────────────────────────────────────── */
.stage-intro-card {
  width: min(420px, calc(100vw - 32px));
  align-items: center;
  text-align: center;
  gap: 16px;
  background:
    radial-gradient(circle at top, color-mix(in srgb, var(--ui-accent-soft) 55%, transparent) 0%, transparent 56%),
    var(--bg-2);
}
.stage-intro-kicker {
  display: flex;
  justify-content: center;
}
.stage-intro-title {
  font-size: 1.22rem;
  font-weight: 900;
  color: var(--text);
  line-height: 1.15;
}
.stage-intro-copy {
  font-size: .92rem;
  line-height: 1.5;
  color: var(--text-2);
}
.stage-intro-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}
.stage-intro-actions .btn-cel-next,
.stage-intro-actions .btn-cel-map {
  min-width: 145px;
}
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
.tut-step-num { width: 28px; height: 28px; border-radius: 50%; background: var(--ui-accent-soft); border: 1.5px solid var(--ui-accent-border); color: var(--ui-accent); font-weight: 800; font-size: .85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.tut-step-body { display: flex; flex-direction: column; gap: 3px; }
.tut-step-body strong { font-size: .9rem; font-weight: 700; color: var(--text); }
.tut-step-body span { font-size: .78rem; color: var(--text-2); line-height: 1.4; }
.tut-board-hint { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 14px; background: var(--bg-2); border: 1px solid var(--border); border-radius: 12px; width: 100%; }
.tut-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; padding: 4px; }
.tut-dot { width: 9px; height: 9px; border-radius: 50%; background: rgba(140,155,180,.45); }
.tut-dot--hl { background: var(--ui-accent); box-shadow: 0 0 8px var(--ui-accent); }
.tut-hint-text { font-size: .76rem; color: var(--text-2); text-align: center; }

.fail-skip-section { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.08); }
.fail-skip-label { font-size: .8rem; color: var(--text-2); font-weight: 600; }
.no-skips-label { font-size: .78rem; color: var(--text-3); }
.btn-ad { background: transparent; border: 1px solid var(--ui-accent-border); border-radius: 10px; padding: 12px 24px; color: var(--ui-accent); font-weight: 700; cursor: pointer; font-size: .95rem; transition: all .15s; width: 100%; }
.btn-ad:hover { background: var(--ui-accent-soft); }

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
.ad-progress { height: 100%; width: 0; background: var(--ui-accent); }
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

.energy-ad-card {
  width: min(340px, calc(100vw - 32px));
  align-items: center;
  text-align: center;
  gap: 14px;
}
.energy-ad-icon {
  width: 56px; height: 56px; border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  background: var(--ui-accent-soft);
  color: var(--ui-accent);
  border: 1px solid var(--ui-accent-border);
  box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
  font-size: 1.6rem;
}
.energy-ad-title {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--text);
  line-height: 1.35;
}
.energy-ad-copy {
  font-size: .86rem;
  color: var(--text-2);
  font-weight: 600;
}
.btn-energy-ad {
  width: 100%;
  background: var(--ui-accent);
  color: var(--ui-accent-contrast);
  border: none;
  border-radius: 12px;
  padding: 14px 18px;
  font-size: .95rem;
  font-weight: 800;
  cursor: pointer;
  transition: filter .15s, transform .15s, box-shadow .15s;
  box-shadow: 0 10px 28px var(--ui-accent-soft);
}
.btn-energy-ad:hover { filter: brightness(1.05); transform: translateY(-1px); }
.btn-energy-ad:active { transform: translateY(0); }
.btn-energy-ad:disabled {
  cursor: wait;
  opacity: .72;
  filter: saturate(.8);
  transform: none;
  box-shadow: none;
}
.energy-ad-dismiss { width: 100%; }
.game-header-actions .btn-god-corner {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: .9rem;
}
.btn-restart-corner {
  width: 32px;
  height: 32px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--ui-accent-soft);
  border: 1px solid var(--ui-accent-border);
  border-radius: 10px;
  color: var(--ui-accent);
  cursor: pointer;
  transition: all .15s;
  box-shadow: 0 0 0 1px var(--ui-accent-soft) inset;
}
.btn-restart-corner:hover {
  background: var(--bg-3);
  box-shadow: 0 0 0 1px var(--ui-accent-border) inset, var(--ui-accent-glow);
}
.btn-restart-corner svg { width: 15px; height: 15px; }
`,document.head.appendChild(Or),document.addEventListener(`click`,e=>{let t=e.target;t.closest(`button`)&&!t.closest(`canvas`)&&yt(8)},{passive:!0}),X();export{A as n,dn as t};