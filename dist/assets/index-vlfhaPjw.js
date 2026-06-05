(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(e,t){return{row:e,col:t}}function t(e,t){let n=e.row===t.row&&Math.abs(e.col-t.col)===1,r=e.col===t.col&&Math.abs(e.row-t.row)===1;return n||r}function n(n,r,i=null){if(!t(n,r))throw RangeError(`Pontos não adjacentes: (${n.row},${n.col}) e (${r.row},${r.col})`);let a=n.row<r.row||n.row===r.row&&n.col<r.col,o=a?n:r,s=a?r:n;return{from:e(o.row,o.col),to:e(s.row,s.col),ownerId:i}}function r(e){return`${e.from.row===e.to.row?`h`:`v`}-${e.from.row}-${e.from.col}`}function i(e){return`b-${e.row}-${e.col}`}function a(t){let i=t.row,a=t.col;return[r(n(e(i,a),e(i,a+1))),r(n(e(i+1,a),e(i+1,a+1))),r(n(e(i,a),e(i+1,a))),r(n(e(i,a+1),e(i+1,a+1)))]}function o(t,a){if(t<2)throw RangeError(`gridSize deve ser >= 2`);if(a.length<2)throw RangeError(`É necessário ao menos 2 jogadores`);let o={};for(let i=0;i<t;i++)for(let a=0;a<t-1;a++){let t=n(e(i,a),e(i,a+1));o[r(t)]=t}for(let i=0;i<t-1;i++)for(let a=0;a<t;a++){let t=n(e(i,a),e(i+1,a));o[r(t)]=t}let s={};for(let n=0;n<t-1;n++)for(let r=0;r<t-1;r++){let t={topLeft:e(n,r),ownerId:null};s[i(t.topLeft)]=t}let c=a[0];return{gridSize:t,players:a.map(e=>({...e,score:0})),lines:o,boxes:s,currentPlayerId:c.id,status:`playing`}}function s(e,t,n){return{id:e,name:t,color:n,score:0}}function c(e){return{ok:!0,value:e}}function l(e,t=null){return{ok:!1,error:e,code:t}}var u={GAME_FINISHED:`GAME_FINISHED`,LINE_NOT_FOUND:`LINE_NOT_FOUND`,LINE_ALREADY_TAKEN:`LINE_ALREADY_TAKEN`};function d(e,t){if(e.status===`finished`)return l(`A partida já terminou`,u.GAME_FINISHED);let n=r(t),o=e.lines[n];if(o===void 0)return l(`Linha inexistente no tabuleiro`,u.LINE_NOT_FOUND);if(o.ownerId!==null)return l(`Linha já foi jogada`,u.LINE_ALREADY_TAKEN);let s=e.currentPlayerId,d={...e.lines,[n]:{...o,ownerId:s}},p={...e.boxes},m=0;for(let t of Object.values(e.boxes))t.ownerId===null&&a(t.topLeft).every(e=>{let t=d[e];return t!==void 0&&t.ownerId!==null})&&(p[i(t.topLeft)]={...t,ownerId:s},m+=1);let h=e.players.map(e=>e.id===s?{...e,score:e.score+m}:{...e}),g=Object.values(d).every(e=>e.ownerId!==null)?`finished`:`playing`,_=g===`finished`||m>0?s:f(e.players,s);return c({...e,lines:d,boxes:p,players:h,currentPlayerId:_,status:g})}function f(e,t){return e[(e.findIndex(e=>e.id===t)+1)%e.length].id}function p(e){return Object.values(e.lines).filter(e=>e.ownerId===null)}var m=class{state;constructor(e){this.state=this.buildState(e)}buildState(e){let t=e.players.map((e,t)=>s(`p${t+1}`,e.name,e.color));return o(e.gridSize,t)}getState(){return this.state}playLine(e){let t=d(this.state,e);return t.ok?(this.state=t.value,!0):!1}reset(e){this.state=this.buildState(e)}getAvailableLines(){return p(this.state)}},h=80,g=50,_=7,ee=24;function v(e){return g+e*h}function y(e){return g+e*h}function b(e,t){return t?e.players.find(e=>e.id===t)?.color??`#888`:`#ccc`}function x(e){let t=g*2+(e-1)*h;return{width:t,height:t}}function S(e,t,n,i=!1){let{gridSize:a}=t,{width:o,height:s}=x(a);e.clearRect(0,0,o,s),e.fillStyle=`#ffffff`,e.fillRect(0,0,o,s);for(let n of Object.values(t.boxes)){if(!n.ownerId)continue;let r=b(t,n.ownerId),i=v(n.topLeft.col),a=y(n.topLeft.row);e.fillStyle=r+`33`,e.fillRect(i+1,a+1,h-2,h-2);let o=t.players.find(e=>e.id===n.ownerId);o&&(e.fillStyle=r+`bb`,e.font=`bold ${Math.floor(h*.35)}px system-ui, sans-serif`,e.textAlign=`center`,e.textBaseline=`middle`,e.fillText(o.name[0]?.toUpperCase()??`?`,i+h/2,a+h/2))}let c=t.players.find(e=>e.id===t.currentPlayerId);for(let i of Object.values(t.lines)){let a=n!==null&&r(n)===r(i);e.beginPath(),e.moveTo(v(i.from.col),y(i.from.row)),e.lineTo(v(i.to.col),y(i.to.row)),e.lineCap=`round`,i.ownerId===null?a?(e.strokeStyle=(c?.color??`#888`)+`cc`,e.lineWidth=6):(e.strokeStyle=`#dde1e7`,e.lineWidth=3):(e.strokeStyle=b(t,i.ownerId),e.lineWidth=7),e.stroke()}for(let t=0;t<a;t++)for(let n=0;n<a;n++)e.beginPath(),e.arc(v(n),y(t),_,0,Math.PI*2),e.fillStyle=`#2c3e50`,e.fill()}function C(t,i,a){let{gridSize:o}=t,s=null,c=ee;for(let l=0;l<o;l++)for(let u=0;u<o-1;u++){let o=v(u),d=v(u+1),f=y(l);if(i>=o-4&&i<=d+4){let i=Math.abs(a-f);if(i<c){c=i;let a=r(n(e(l,u),e(l,u+1)));s=t.lines[a]??null}}}for(let l=0;l<o-1;l++)for(let u=0;u<o;u++){let o=y(l),d=y(l+1),f=v(u);if(a>=o-4&&a<=d+4){let a=Math.abs(i-f);if(a<c){c=a;let i=r(n(e(l,u),e(l+1,u)));s=t.lines[i]??null}}}return s}var w={"muito-facil":`Muito Fácil`,facil:`Fácil`,medio:`Médio`,dificil:`Difícil`,"muito-dificil":`Muito Difícil`,impossivel:`Impossível`,impulsivo:`Impulsivo`};function T(e){return e[Math.floor(Math.random()*e.length)]}function E(t,n,r){return a(e(n,r)).filter(e=>t.lines[e]?.ownerId!==null).length}function D(e,t){return t.filter(t=>{let{gridSize:n}=e;return O(t,n).some(([t,n])=>E(e,t,n)===3)})}function te(e,t){return t.filter(t=>{let{gridSize:n}=e;return!O(t,n).some(([t,n])=>E(e,t,n)===2)})}function O(e,t){let n=[],{from:r,to:i}=e;if(r.row===i.row){let e=r.row,i=r.col;e>0&&n.push([e-1,i]),e<t-1&&n.push([e,i])}else{let e=r.row,i=r.col;i>0&&n.push([e,i-1]),i<t-1&&n.push([e,i])}return n}function k(e,t){let n=e.players.find(e=>e.id===t),r=e.players.find(e=>e.id!==t);return(n?.score??0)-(r?.score??0)}function A(e,t,n,r,i,a){if(e.status===`finished`||n===0)return k(e,t);let o=p(e);if(o.length===0)return k(e,t);let s=[...o].sort((t,n)=>{let r=+!!O(t,e.gridSize).some(([t,n])=>E(e,t,n)===3);return+!!O(n,e.gridSize).some(([t,n])=>E(e,t,n)===3)-r});if(a){let a=-1/0;for(let o of s){let s=d(e,o);if(!s.ok)continue;let c=s.value.currentPlayerId===t,l=A(s.value,t,n-1,r,i,c);if(a=Math.max(a,l),r=Math.max(r,l),i<=r)break}return a}else{let a=1/0;for(let o of s){let s=d(e,o);if(!s.ok)continue;let c=s.value.currentPlayerId===t,l=A(s.value,t,n-1,r,i,c);if(a=Math.min(a,l),i=Math.min(i,l),i<=r)break}return a}}function j(e,t,n){let r=p(e),i=r[0],a=-1/0;for(let o of r){let r=d(e,o);if(!r.ok)continue;let s=r.value.currentPlayerId===t,c=A(r.value,t,n-1,-1/0,1/0,s);c>a&&(a=c,i=o)}return i}function ne(e,t){let n=p(e);if(n.length===0)throw Error(`Sem movimentos disponíveis`);let r=e.currentPlayerId;switch(t){case`muito-facil`:return T(n);case`facil`:{let t=D(e,n);return t.length>0&&Math.random()<.5?T(t):T(n)}case`medio`:{let t=D(e,n);if(t.length>0)return T(t);let r=te(e,n);return r.length>0?T(r):T(n)}case`dificil`:return j(e,r,3);case`muito-dificil`:return j(e,r,6);case`impossivel`:return j(e,r,e.gridSize<=4?12:8);case`impulsivo`:return Math.random()<.4?j(e,r,8):T(n)}}function re(e){return{"muito-facil":300,facil:400,medio:500,dificil:700,"muito-dificil":900,impossivel:1200,impulsivo:200}[e]}var M=[{range:[1,10],gridSizes:[3],difficulty:`muito-facil`},{range:[11,25],gridSizes:[3,4],difficulty:`muito-facil`},{range:[26,50],gridSizes:[4],difficulty:`facil`},{range:[51,80],gridSizes:[4],difficulty:`facil`},{range:[81,120],gridSizes:[4,5],difficulty:`medio`},{range:[121,170],gridSizes:[5],difficulty:`medio`},{range:[171,230],gridSizes:[5],difficulty:`dificil`},{range:[231,300],gridSizes:[5,6],difficulty:`dificil`},{range:[301,380],gridSizes:[6],difficulty:`muito-dificil`},{range:[381,450],gridSizes:[6],difficulty:`muito-dificil`},{range:[451,490],gridSizes:[6],difficulty:`impossivel`},{range:[491,500],gridSizes:[6],difficulty:`impossivel`}];function ie(e,t){let n=(t-1)*(t-1),r=e%5;if(r===0)return{objectiveType:`dominance`,objectiveValue:60,stars:[`Vença`,`Feche ≥60% das caixas`,`Feche ≥75% das caixas`]};if(r===1){let t=Math.min(2+Math.floor(e/50),Math.floor(n/2));return{objectiveType:`margin`,objectiveValue:t,stars:[`Vença`,`Vença por ≥${t} caixas`,`Vença por ≥${t+2} caixas`]}}return r===2?{objectiveType:`chain`,objectiveValue:2,stars:[`Vença`,`Feche ≥2 caixas em um turno`,`Feche ≥3 caixas em um turno`]}:r===3?{objectiveType:`clean`,objectiveValue:0,stars:[`Vença`,`Vença sem dar caixas ao bot`,`Vença sem dar caixas com margem ≥3`]}:{objectiveType:`win`,objectiveValue:0,stars:[`Vença`,`Vença com ≥${Math.ceil(n*.5)} caixas`,`Vença com ≥${Math.ceil(n*.65)} caixas`]}}function N(e){let t=M.find(t=>e>=t.range[0]&&e<=t.range[1])??M[M.length-1],n=t.gridSizes,r=n[e%n.length]??n[0],i=ie(e,r);return{id:e,gridSize:r,difficulty:t.difficulty,...i}}var P=`dab_profile`;function F(){return{name:`Jogador`,xp:0,stageProgress:{}}}function I(){try{let e=localStorage.getItem(P);return e?JSON.parse(e):F()}catch{return F()}}function L(e){localStorage.setItem(P,JSON.stringify(e))}function R(e,t,n,r){let i=I(),a=i.stageProgress[e];return i.stageProgress[e]={stars:Math.max(t,a?.stars??0),bestScore:Math.max(n,a?.bestScore??0)},i.xp+=r,L(i),i}function z(e){let t=[{rank:`Mestre`,icon:`👑`,min:15e4,next:1/0},{rank:`Diamante`,icon:`🔷`,min:75e3,next:15e4},{rank:`Platina III`,icon:`💎`,min:5e4,next:75e3},{rank:`Platina II`,icon:`💎`,min:4e4,next:5e4},{rank:`Platina I`,icon:`💎`,min:3e4,next:4e4},{rank:`Ouro III`,icon:`🥇`,min:2e4,next:3e4},{rank:`Ouro II`,icon:`🥇`,min:15e3,next:2e4},{rank:`Ouro I`,icon:`🥇`,min:1e4,next:15e3},{rank:`Prata III`,icon:`🥈`,min:6e3,next:1e4},{rank:`Prata II`,icon:`🥈`,min:3500,next:6e3},{rank:`Prata I`,icon:`🥈`,min:2500,next:3500},{rank:`Bronze III`,icon:`🥉`,min:1500,next:2500},{rank:`Bronze II`,icon:`🥉`,min:1e3,next:1500},{rank:`Bronze I`,icon:`🥉`,min:500,next:1e3},{rank:`Iniciante`,icon:`⚪`,min:0,next:500}];return t.find(t=>e>=t.min)??t[t.length-1]}var B=null,V=null,H=document.getElementById(`app`);function U(e,t,n){let r=e.getBoundingClientRect();return{x:(t-r.left)*(e.width/r.width),y:(n-r.top)*(e.height/r.height)}}var W=[`#e74c3c`,`#3498db`,`#2ecc71`,`#f39c12`],ae=[`Jogador 1`,`Jogador 2`,`Jogador 3`,`Jogador 4`];function G(){let e=I(),t=z(e.xp),n=Object.values(e.stageProgress).filter(e=>e.stars>0).length;H.innerHTML=`
    <div class="screen menu-screen">
      <div class="menu-logo">
        <h1>Dots &amp; Boxes</h1>
        <p class="menu-tagline">Conecte • Feche • Domine</p>
      </div>

      <div class="rank-badge">
        <span class="rank-icon">${t.icon}</span>
        <div class="rank-info">
          <span class="rank-name">${t.rank}</span>
          <span class="rank-xp">${e.xp.toLocaleString()} XP</span>
        </div>
      </div>

      <div class="menu-buttons">
        <button class="btn-menu btn-arcade" id="btn-arcade">
          <span class="btn-icon">🕹️</span>
          <div class="btn-text">
            <strong>Arcade</strong>
            <small>${n}/50 fases concluídas</small>
          </div>
        </button>

        <button class="btn-menu btn-bot" id="btn-bot">
          <span class="btn-icon">🤖</span>
          <div class="btn-text">
            <strong>vs Bot</strong>
            <small>Escolha a dificuldade</small>
          </div>
        </button>

        <button class="btn-menu btn-multi" id="btn-multi">
          <span class="btn-icon">👥</span>
          <div class="btn-text">
            <strong>Multijogador</strong>
            <small>2 a 4 jogadores • Duplas ou Solo</small>
          </div>
        </button>
      </div>
    </div>`,document.getElementById(`btn-arcade`).onclick=K,document.getElementById(`btn-bot`).onclick=q,document.getElementById(`btn-multi`).onclick=J}function K(){let e=I(),t=``;for(let n=1;n<=50;n++){let r=e.stageProgress[n]?.stars??0,i=n===1||(e.stageProgress[n-1]?.stars??0)>0,a=`★`.repeat(r)+`☆`.repeat(3-r);t+=`<button class="stage-cell ${i?`unlocked`:`locked`} stars-${r}" data-stage="${n}" ${i?``:`disabled`}>
      <span class="stage-num">${n}</span>
      <span class="stage-stars">${a}</span>
    </button>`}H.innerHTML=`
    <div class="screen arcade-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">← Voltar</button>
        <h2>🕹️ Modo Arcade</h2>
      </div>
      <div class="stage-grid">${t}</div>
    </div>`,document.getElementById(`btn-back`).onclick=G,document.querySelectorAll(`.stage-cell.unlocked`).forEach(e=>{e.onclick=()=>{Y(parseInt(e.dataset.stage,10))}})}function q(){H.innerHTML=`
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">← Voltar</button>
        <h2>🤖 vs Bot</h2>
      </div>
      <div class="setup-section">
        <label class="setup-label">Dificuldade</label>
        <div class="diff-grid">${Object.entries(w).map(([e,t])=>`<button class="btn-diff" data-diff="${e}">${t}</button>`).join(``)}</div>
      </div>
      <div class="setup-section">
        <label class="setup-label">Tamanho da Grade</label>
        <div class="grid-size-row">
          ${[3,4,5,6].map(e=>`<button class="btn-grid-size" data-size="${e}">${e}×${e}</button>`).join(``)}
        </div>
      </div>
      <button class="btn-start" id="btn-start" disabled>Iniciar Partida</button>
    </div>`,document.getElementById(`btn-back`).onclick=G;let e=null,t=4;document.querySelector(`[data-size="4"]`).classList.add(`selected`),document.querySelectorAll(`.btn-diff`).forEach(t=>{t.onclick=()=>{document.querySelectorAll(`.btn-diff`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),e=t.dataset.diff,document.getElementById(`btn-start`).disabled=!1}}),document.querySelectorAll(`.btn-grid-size`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-grid-size`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),t=parseInt(e.dataset.size,10)}}),document.getElementById(`btn-start`).onclick=()=>{e&&X(e,t)}}function J(){H.innerHTML=`
    <div class="screen setup-screen">
      <div class="screen-header">
        <button class="btn-back" id="btn-back">← Voltar</button>
        <h2>👥 Multijogador</h2>
      </div>
      <div class="setup-section">
        <label class="setup-label">Número de Jogadores</label>
        <div class="grid-size-row">
          ${[2,3,4].map(e=>`<button class="btn-player-count" data-count="${e}">${e} jogadores</button>`).join(``)}
        </div>
      </div>
      <div class="setup-section" id="team-section" style="display:none">
        <label class="setup-label">Modo de Equipe</label>
        <div class="grid-size-row">
          <button class="btn-team-mode selected" data-team="false">Solo (todos vs todos)</button>
          <button class="btn-team-mode" data-team="true">Duplas (2v2)</button>
        </div>
      </div>
      <div class="setup-section">
        <label class="setup-label">Tamanho da Grade</label>
        <div class="grid-size-row">
          ${[3,4,5,6].map(e=>`<button class="btn-grid-size" data-size="${e}">${e}×${e}</button>`).join(``)}
        </div>
      </div>
      <button class="btn-start" id="btn-start" disabled>Iniciar Partida</button>
    </div>`,document.getElementById(`btn-back`).onclick=G;let e=0,t=!1,n=4;document.querySelector(`[data-size="4"]`).classList.add(`selected`),document.querySelectorAll(`.btn-player-count`).forEach(t=>{t.onclick=()=>{document.querySelectorAll(`.btn-player-count`).forEach(e=>e.classList.remove(`selected`)),t.classList.add(`selected`),e=parseInt(t.dataset.count,10);let n=document.getElementById(`team-section`);n.style.display=e===4?`block`:`none`,document.getElementById(`btn-start`).disabled=!1}}),document.querySelectorAll(`.btn-team-mode`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-team-mode`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),t=e.dataset.team===`true`}}),document.querySelectorAll(`.btn-grid-size`).forEach(e=>{e.onclick=()=>{document.querySelectorAll(`.btn-grid-size`).forEach(e=>e.classList.remove(`selected`)),e.classList.add(`selected`),n=parseInt(e.dataset.size,10)}}),document.getElementById(`btn-start`).onclick=()=>{e&&Z(e,t,n)}}function Y(e){let t=N(e),n={gridSize:t.gridSize,players:[{name:`Você`,color:W[0]},{name:`Bot`,color:W[1]}]};B={mode:`arcade`,stageId:e,botDifficulty:t.difficulty,controller:new m(n),botPlayerId:`p2`,botThinking:!1},Q()}function X(e,t){B={mode:`vs-bot`,botDifficulty:e,controller:new m({gridSize:t,players:[{name:`Você`,color:W[0]},{name:`Bot`,color:W[1]}]}),botPlayerId:`p2`,botThinking:!1},Q()}function Z(e,t,n){B={mode:`multi`,teamMode:t,playerCount:e,controller:new m({gridSize:n,players:Array.from({length:e},(e,t)=>({name:ae[t],color:W[t]}))}),botThinking:!1},Q()}function Q(){if(!B)return;let e=B;e.controller.getState(),H.innerHTML=`
    <div class="screen game-screen">
      <div class="game-topbar">
        <button class="btn-back-sm" id="btn-back">✕</button>
        <span class="game-mode-label">${e.mode===`arcade`?`Fase ${e.stageId}`:e.mode===`vs-bot`?`vs Bot — ${w[e.botDifficulty]}`:e.teamMode?`Duplas 2v2`:`${e.playerCount} Jogadores`}</span>
        <div style="width:36px"></div>
      </div>
      <div id="scoreboard" class="scoreboard"></div>
      <div id="status" class="status"></div>
      <div class="canvas-wrapper"><canvas id="board"></canvas></div>
      <div id="result-banner" class="result-banner" style="display:none"></div>
    </div>`,document.getElementById(`btn-back`).onclick=()=>{B=null,V=null,e.mode===`arcade`?K():e.mode===`vs-bot`?q():J()};let t=document.getElementById(`board`),n=t.getContext(`2d`);function i(){let r=e.controller.getState(),{width:i,height:o}=x(r.gridSize);t.width=i,t.height=o,S(n,r,V,e.teamMode??!1),a()}function a(){let t=e.controller.getState(),n=document.getElementById(`scoreboard`),r=document.getElementById(`status`);if(e.teamMode&&e.playerCount===4){let e=t.players.filter((e,t)=>t%2==0),r=t.players.filter((e,t)=>t%2==1),i=e.reduce((e,t)=>e+t.score,0),a=r.reduce((e,t)=>e+t.score,0);n.innerHTML=`
        <div class="team-chip" style="--player-color:${W[0]}">
          Time A <strong>${i}</strong>
        </div>
        <div class="team-chip" style="--player-color:${W[1]}">
          Time B <strong>${a}</strong>
        </div>`}else n.innerHTML=t.players.map(e=>`<div class="player-chip ${e.id===t.currentPlayerId&&t.status===`playing`?`player-chip--active`:``}" style="--player-color:${e.color}">
          <span class="player-dot"></span>
          <span class="player-name">${e.name}</span>
          <span class="player-score">${e.score}</span>
        </div>`).join(``);if(t.status===`finished`)r.textContent=``,o();else if(e.botThinking)r.textContent=`Bot pensando...`,r.style.color=`#888`;else{let e=t.players.find(e=>e.id===t.currentPlayerId);r.textContent=`Vez de ${e.name}`,r.style.color=e.color}}function o(){let t=e.controller.getState(),n=document.getElementById(`result-banner`),r=Math.max(...t.players.map(e=>e.score)),i=``,a=0,o=0;if(e.mode===`arcade`&&e.stageId!=null){let n=N(e.stageId),r=t.players.find(t=>t.id!==e.botPlayerId),s=t.players.find(t=>t.id===e.botPlayerId);r.score>s.score?(o=1,a=100,n.objectiveType===`win`?o=r.score>=n.objectiveValue?2:1:n.objectiveType===`margin`&&(o=r.score-s.score>=n.objectiveValue?2:1),o===2&&(a+=50),o===2&&n.objectiveType===`margin`&&r.score-s.score>=n.objectiveValue+2&&(o=3,a+=50),R(e.stageId,o,r.score*100,a),i=`🎉 Vitória! +${a} XP`):(o=0,i=`😞 Derrota — Tente novamente`)}else if(e.mode===`vs-bot`){let n=t.players.find(t=>t.id!==e.botPlayerId).score===r;a=n?60:0,i=n?`🏆 Vitória! +${a} XP`:`😞 Derrota`}else{let e=t.players.filter(e=>e.score===r);i=e.length===1?`🏆 ${e[0].name} venceu!`:`🤝 Empate!`}let s=`★`.repeat(o)+`☆`.repeat(3-o);n.style.display=`block`,n.innerHTML=`
      <div class="result-content">
        <div class="result-msg">${i}</div>
        ${e.mode===`arcade`?`<div class="result-stars">${s}</div>`:``}
        <div class="result-actions">
          <button class="btn-result" id="btn-retry">🔄 ${e.mode===`arcade`?`Tentar de Novo`:`Nova Partida`}</button>
          <button class="btn-result btn-result-back" id="btn-result-back">← Menu</button>
        </div>
      </div>`,document.getElementById(`btn-retry`).onclick=()=>{e.mode===`arcade`&&e.stageId!=null?Y(e.stageId):e.mode===`vs-bot`?X(e.botDifficulty,e.controller.getState().gridSize):Z(e.playerCount,e.teamMode,e.controller.getState().gridSize)},document.getElementById(`btn-result-back`).onclick=()=>{B=null,V=null,e.mode===`arcade`?K():e.mode===`vs-bot`?q():J()}}function s(){return e.botPlayerId?e.controller.getState().currentPlayerId===e.botPlayerId:!1}function c(){e.botDifficulty&&(e.botThinking=!0,a(),setTimeout(()=>{if(!B||B!==e)return;let t=e.controller.getState();if(t.status===`finished`||!s())return;let n=ne(t,e.botDifficulty);e.controller.playLine(n),e.botThinking=!1,i(),s()&&c()},re(e.botDifficulty)))}function l(t){e.controller.getState().status===`finished`||e.botThinking||s()||t.ownerId===null&&(e.controller.playLine(t),V=null,i(),s()&&e.controller.getState().status!==`finished`&&c())}t.addEventListener(`mousemove`,n=>{let a=e.controller.getState();if(a.status===`finished`||e.botThinking||s())return;let{x:o,y:c}=U(t,n.clientX,n.clientY),l=C(a,o,c),u=l?.ownerId===null?l:null;(V?r(V):null)!==(u?r(u):null)&&(V=u,i()),t.style.cursor=V?`pointer`:`default`}),t.addEventListener(`mouseleave`,()=>{V=null,i(),t.style.cursor=`default`}),t.addEventListener(`click`,n=>{let{x:r,y:i}=U(t,n.clientX,n.clientY),a=C(e.controller.getState(),r,i);a&&l(a)}),t.addEventListener(`touchend`,n=>{n.preventDefault();let r=n.changedTouches[0];if(!r)return;let{x:i,y:a}=U(t,r.clientX,r.clientY),o=C(e.controller.getState(),i,a);o&&l(o)},{passive:!1}),i(),s()&&c()}var $=document.createElement(`style`);$.textContent=`
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, -apple-system, sans-serif;
    background: #0f0f1a;
    min-height: 100dvh;
    display: flex; align-items: center; justify-content: center;
    color: #fff;
  }
  #app { width: 100%; max-width: 560px; }

  .screen { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 24px 16px; min-height: 100dvh; width: 100%; }

  /* MENU */
  .menu-screen { justify-content: center; gap: 24px; }
  .menu-logo h1 { font-size: 2.2rem; font-weight: 900; letter-spacing: -1px; background: linear-gradient(135deg, #e74c3c, #3498db); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; text-align: center; }
  .menu-tagline { text-align: center; color: #aaa; font-size: 0.9rem; margin-top: 4px; }

  .rank-badge { display: flex; align-items: center; gap: 10px; background: #1a1a2e; border: 1px solid #333; border-radius: 12px; padding: 10px 16px; }
  .rank-icon { font-size: 1.6rem; }
  .rank-name { font-weight: 700; font-size: 0.95rem; display: block; }
  .rank-xp { font-size: 0.8rem; color: #aaa; }

  .menu-buttons { display: flex; flex-direction: column; gap: 12px; width: 100%; }
  .btn-menu { display: flex; align-items: center; gap: 16px; background: #1a1a2e; border: 1px solid #333; border-radius: 14px; padding: 16px 20px; cursor: pointer; color: #fff; text-align: left; transition: background 0.15s, transform 0.1s; width: 100%; }
  .btn-menu:hover { background: #252540; }
  .btn-menu:active { transform: scale(0.98); }
  .btn-icon { font-size: 1.8rem; flex-shrink: 0; }
  .btn-text strong { font-size: 1rem; display: block; }
  .btn-text small { font-size: 0.8rem; color: #aaa; }
  .btn-arcade { border-color: #e74c3c44; }
  .btn-bot    { border-color: #3498db44; }
  .btn-multi  { border-color: #2ecc7144; }

  /* HEADER */
  .screen-header { display: flex; align-items: center; width: 100%; gap: 12px; }
  .screen-header h2 { font-size: 1.2rem; font-weight: 800; }
  .btn-back { background: #1a1a2e; border: 1px solid #333; border-radius: 8px; padding: 8px 14px; color: #fff; cursor: pointer; font-size: 0.9rem; }
  .btn-back:hover { background: #252540; }

  /* ARCADE MAP */
  .arcade-screen { }
  .stage-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; width: 100%; padding-bottom: 24px; }
  .stage-cell { background: #1a1a2e; border: 1px solid #333; border-radius: 10px; padding: 8px 4px; cursor: pointer; color: #fff; display: flex; flex-direction: column; align-items: center; gap: 2px; transition: background 0.15s; }
  .stage-cell:disabled { opacity: 0.35; cursor: not-allowed; }
  .stage-cell.unlocked:hover { background: #252540; }
  .stage-cell.stars-3 { border-color: #f39c1266; }
  .stage-cell.stars-2 { border-color: #3498db44; }
  .stage-cell.stars-1 { border-color: #2ecc7144; }
  .stage-num { font-size: 0.85rem; font-weight: 700; }
  .stage-stars { font-size: 0.65rem; color: #f39c12; }

  /* SETUP */
  .setup-screen { gap: 20px; }
  .setup-section { width: 100%; }
  .setup-label { font-size: 0.8rem; font-weight: 700; color: #aaa; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 10px; }
  .diff-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
  .btn-diff, .btn-grid-size, .btn-player-count, .btn-team-mode {
    background: #1a1a2e; border: 1px solid #333; border-radius: 10px;
    padding: 12px; color: #fff; cursor: pointer; font-size: 0.9rem;
    transition: background 0.1s; text-align: center; font-weight: 600;
  }
  .btn-diff:hover, .btn-grid-size:hover, .btn-player-count:hover, .btn-team-mode:hover { background: #252540; }
  .btn-diff.selected, .btn-grid-size.selected, .btn-player-count.selected, .btn-team-mode.selected { background: #3498db22; border-color: #3498db; color: #3498db; }
  .grid-size-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .grid-size-row .btn-grid-size, .grid-size-row .btn-player-count, .grid-size-row .btn-team-mode { flex: 1; min-width: 80px; }
  .btn-start { background: #3498db; border: none; border-radius: 12px; padding: 14px 32px; color: #fff; font-size: 1rem; font-weight: 700; cursor: pointer; width: 100%; margin-top: 8px; transition: background 0.15s; }
  .btn-start:hover:not(:disabled) { background: #2980b9; }
  .btn-start:disabled { opacity: 0.4; cursor: not-allowed; }

  /* GAME */
  .game-screen { padding: 12px 16px 24px; gap: 10px; }
  .game-topbar { display: flex; align-items: center; justify-content: space-between; width: 100%; }
  .btn-back-sm { background: #1a1a2e; border: 1px solid #333; border-radius: 8px; padding: 6px 12px; color: #fff; cursor: pointer; font-size: 1rem; }
  .game-mode-label { font-size: 0.85rem; color: #aaa; font-weight: 600; }

  .scoreboard { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .player-chip { display: flex; align-items: center; gap: 7px; background: #1a1a2e; border: 2px solid #333; border-radius: 40px; padding: 7px 14px; font-size: 0.9rem; transition: border-color 0.15s; }
  .player-chip--active { border-color: var(--player-color); box-shadow: 0 0 0 3px color-mix(in srgb, var(--player-color) 20%, transparent); }
  .player-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--player-color); flex-shrink: 0; }
  .player-name { font-weight: 600; }
  .player-score { font-weight: 800; color: var(--player-color); }
  .team-chip { background: #1a1a2e; border: 2px solid var(--player-color); border-radius: 10px; padding: 8px 16px; font-weight: 700; }

  .status { font-size: 0.95rem; font-weight: 600; min-height: 1.4em; transition: color 0.2s; }

  .canvas-wrapper { width: 100%; display: flex; justify-content: center; }
  canvas { max-width: 100%; height: auto; border-radius: 14px; background: #fff; box-shadow: 0 8px 32px rgba(0,0,0,0.4); touch-action: none; display: block; }

  /* RESULT BANNER */
  .result-banner { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10; }
  .result-content { background: #1a1a2e; border: 1px solid #333; border-radius: 20px; padding: 32px 40px; text-align: center; display: flex; flex-direction: column; gap: 16px; min-width: 260px; }
  .result-msg { font-size: 1.4rem; font-weight: 800; }
  .result-stars { font-size: 1.6rem; color: #f39c12; letter-spacing: 4px; }
  .result-actions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
  .btn-result { background: #3498db; border: none; border-radius: 10px; padding: 12px 24px; color: #fff; font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: background 0.15s; }
  .btn-result:hover { background: #2980b9; }
  .btn-result-back { background: #333; }
  .btn-result-back:hover { background: #444; }
`,document.head.appendChild($),G();