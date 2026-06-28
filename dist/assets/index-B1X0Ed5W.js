(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))r(n);new MutationObserver(n=>{for(const a of n)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function s(n){const a={};return n.integrity&&(a.integrity=n.integrity),n.referrerPolicy&&(a.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?a.credentials="include":n.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(n){if(n.ep)return;n.ep=!0;const a=s(n);fetch(n.href,a)}})();function O(e,t){const s=new Map(t.map(r=>[r.timestamp,r.value]));return e.map(r=>({timestamp:r.timestamp,speedMs:r.value,directionDeg:s.get(r.timestamp)??null})).sort((r,n)=>new Date(r.timestamp).getTime()-new Date(n.timestamp).getTime())}function y(e){return new Date(e).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}function F(e,t){if(e.length<=t)return e;const s=(e.length-1)/(t-1);return Array.from({length:t},(r,n)=>e[Math.round(n*s)])}function k(e){if(e.length===0)return'<p class="history-empty">Keine Verlaufsdaten für die letzten 2 Stunden</p>';const t=280,s=100,r={top:10,right:10,bottom:24,left:34},n=t-r.left-r.right,a=s-r.top-r.bottom,i=e.map(o=>o.speedMs??0),u=Math.max(...i,1),c=new Date(e[0].timestamp).getTime(),d=new Date(e[e.length-1].timestamp).getTime(),T=Math.max(d-c,1),g=o=>r.left+(new Date(o).getTime()-c)/T*n,L=o=>r.top+a-o/u*a,D=e.filter(o=>o.speedMs!==null).map(o=>`${g(o.timestamp).toFixed(1)},${L(o.speedMs).toFixed(1)}`).join(" "),_=F(e.filter(o=>o.directionDeg!==null),8).map(o=>{const B=g(o.timestamp),R=r.top+a+6,A=o.directionDeg;return`
        <g transform="translate(${B.toFixed(1)}, ${R.toFixed(1)}) rotate(${A})" aria-hidden="true">
          <path class="history-arrow" d="M0,-6 L-2.5,-1 L-1.25,-1 L-1.25,5 L1.25,5 L1.25,-1 L2.5,-1 Z" />
        </g>
      `}).join(""),W=u.toLocaleString("de-DE",{maximumFractionDigits:1});return`
    <section class="history-section" aria-label="Windverlauf der letzten 2 Stunden">
      <h3 class="history-title">Letzten 2 Stunden</h3>
      <svg class="history-chart" viewBox="0 0 ${t} ${s}" width="100%" height="${s}" role="img"
        aria-label="Windgeschwindigkeit und -richtung der letzten 2 Stunden">
        <title>Windverlauf letzten 2 Stunden</title>
        <line class="history-axis" x1="${r.left}" y1="${r.top+a}" x2="${t-r.right}" y2="${r.top+a}" />
        <line class="history-axis" x1="${r.left}" y1="${r.top}" x2="${r.left}" y2="${r.top+a}" />
        <text class="history-label" x="${r.left-4}" y="${r.top+4}" text-anchor="end">${W}</text>
        <text class="history-label" x="${r.left-4}" y="${r.top+a}" text-anchor="end">0</text>
        <polyline class="history-line" points="${D}" />
        ${_}
        <text class="history-label" x="${r.left}" y="${s-4}">${y(e[0].timestamp)}</text>
        <text class="history-label" x="${t-r.right}" y="${s-4}" text-anchor="end">${y(e[e.length-1].timestamp)}</text>
      </svg>
      <p class="history-legend">
        <span class="history-legend__line">— Geschwindigkeit (m/s)</span>
        <span class="history-legend__arrow">↑ Richtung (woher)</span>
      </p>
    </section>
  `}const w=[{uuid:"116572da-c036-4486-ac18-a92932424e30",number:"4970030",name:"RECHTENFLETH"},{uuid:"d3f822a0-e201-4a61-8913-589c74818ae0",number:"4990010",name:"BHV ALTER LEUCHTTURM"},{uuid:"78029185-9dfc-4b1b-8695-45ebc2a09cf4",number:"9460010",name:"ROBBENSÜDSTEERT"},{uuid:"ad3b53f8-8c1b-439f-a0df-9f24827026d5",number:"9460020",name:"DWARSGAT"},{uuid:"c6772c3c-a6bb-4728-9250-a408ab3856bd",number:"9460040",name:"LEUCHTTURM ALTE WESER"}],v="https://www.pegelonline.wsv.de/webservices/rest-api/v2";function H(e){const t=new URLSearchParams({includeTimeseries:"true",includeCurrentMeasurement:"true"});return`${v}/stations/${e}.json?${t.toString()}`}const P="PT2H";function N(e,t){const s=new URLSearchParams({start:P});return`${v}/stations/${e}/${t}/measurements.json?${s.toString()}`}function C(e){const t=e.timeseries.find(c=>c.shortname==="WG"),s=e.timeseries.find(c=>c.shortname==="WR"),r=t?.currentMeasurement?.value??null,n=s?.currentMeasurement?.value??null,a=t?.currentMeasurement?.timestamp??null,i=s?.currentMeasurement?.timestamp??null;return{speedMs:r,directionDeg:n,timestamp:a??i}}async function b(e,t){try{const s=await fetch(N(e,t));return s.ok?{measurements:await s.json(),failed:!1}:{measurements:[],failed:!0}}catch{return{measurements:[],failed:!0}}}async function U(e,t){const[s,r,n]=await Promise.all([fetch(H(e.uuid)),b(e.uuid,"WG"),b(e.uuid,"WR")]);if(!s.ok)throw new Error(`HTTP ${s.status}`);const a=await s.json(),i=C(a),u=r.failed||n.failed;let c=O(r.measurements,n.measurements),d=!1;if((c.length===0&&t?.previousHistory?.length||u&&t?.previousHistory?.length)&&(c=t.previousHistory,d=!0),i.speedMs===null&&i.directionDeg===null&&c.length===0)throw new Error("Keine Windmessung verfügbar");return{km:a.km,reading:i,history:c,historyStale:d||void 0}}const z=.836,I=["Windstille","Leiser Zug","Leichte Brise","Schwache Brise","Mäßige Brise","Frische Brise","Starker Wind","Steifer Wind","Stürmischer Wind","Sturm","Schwerer Sturm","Orkanartiger Sturm","Orkan"];function M(e){return e<=0?0:Math.pow(e/z,2/3)}function j(e){return e<.3?0:Math.min(12,Math.round(M(e)))}function G(e){const t=Math.max(0,Math.min(12,e));return I[t]??"Unbekannt"}function K(e){const t=M(e),s=j(e);let r;if(s===0)r=Math.min(1,t/.5);else if(s>=12)r=Math.min(1,(t-11.5)/.5);else{const n=s-.5,a=s+.5;r=(t-n)/(a-n)}return{bft:s,label:G(s),exact:t,progressPct:Math.max(0,Math.min(100,r*100))}}const V=["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW"];function q(e){const t=(e%360+360)%360,s=Math.round(t/22.5)%16;return V[s]}function E(e){const t=q(e),s=Math.round(e);return`${t} (${s}°)`}const Z=6e4,h=document.getElementById("station-grid"),p=document.getElementById("last-update"),m=document.getElementById("refresh-warning");if(!h||!p||!m)throw new Error("Erforderliche DOM-Elemente fehlen");const $=new Map;let f=null;function l(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Y(e){return`${e.toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1})} m/s`}function J(e){return new Date(e).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}function Q(e){return`${e.toLocaleString("de-DE",{minimumFractionDigits:3,maximumFractionDigits:3})} km Weser`}function X(e){return`
    <svg
      class="wind-arrow"
      viewBox="0 0 64 64"
      width="80"
      height="80"
      role="img"
      aria-label="${l(`Wind aus ${E(e)}`)}"
      style="transform: rotate(${e}deg)"
    >
      <circle class="wind-arrow__ring" cx="32" cy="32" r="28" />
      <polygon class="wind-arrow__head" points="32,8 24,28 40,28" />
      <rect class="wind-arrow__tail" x="29" y="28" width="6" height="22" rx="2" />
      <text class="wind-arrow__n" x="32" y="14" text-anchor="middle">N</text>
    </svg>
  `}function ee(e){const{bft:t,label:s,progressPct:r}=K(e),n=Math.max(0,t-1),a=Math.min(12,t+1),i=Math.round(r),u=`Beaufort ${t}, ${i} Prozent innerhalb der Stufe`;return`
    <div class="beaufort-block">
      <p class="wind-beaufort">Bft ${t} – ${l(s)}</p>
      <div class="beaufort-bar" role="meter" aria-label="${l(u)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${i}">
        <div class="beaufort-bar__track">
          <div class="beaufort-bar__fill" style="width: ${r.toFixed(1)}%"></div>
          <div class="beaufort-bar__marker" style="left: ${r.toFixed(1)}%"></div>
        </div>
        <div class="beaufort-bar__labels">
          <span>Bft ${n}</span>
          <span class="beaufort-bar__current">Bft ${t}</span>
          <span>Bft ${a}</span>
        </div>
      </div>
    </div>
  `}function te(e){if(e.status==="loading")return`
      <div class="card-body card-body--loading">
        <p class="loading-text" aria-busy="true">Daten werden geladen …</p>
      </div>
    `;if(e.status==="error")return`
      <div class="card-body card-body--error" role="alert">
        <p class="error-text">${l(e.message)}</p>
      </div>
    `;const{data:t,km:s,history:r}=e,n=t.speedMs!==null?`<p class="wind-speed">${Y(t.speedMs)}</p>${ee(t.speedMs)}`:'<p class="wind-speed wind-speed--missing">Keine Geschwindigkeitsmessung</p>',a=t.directionDeg!==null?`
        <div class="wind-direction">
          ${X(t.directionDeg)}
          <p class="wind-direction__label">${l(E(t.directionDeg))}</p>
        </div>
      `:'<p class="wind-direction--missing">Keine Richtungsmessung</p>',i=t.timestamp?`<p class="card-timestamp">Messzeit: ${l(J(t.timestamp))}</p>`:"";return`
    <div class="card-body">
      ${a}
      ${n}
      ${i}
    </div>
    ${k(r)}
    <p class="card-km">${l(Q(s))}</p>
  `}function re(e){return e.status!=="success"?"":e.stale?'<p class="card-stale-badge" role="status">Stand veraltet</p>':e.historyStale?'<p class="card-stale-badge card-stale-badge--history" role="status">Verlauf nicht aktualisiert</p>':""}function se(e){const t=["station-card"];return e.status==="error"?t.push("station-card--error"):e.status==="loading"?t.push("station-card--loading"):(e.stale||e.historyStale)&&t.push("station-card--stale"),t.join(" ")}function ne(e){const t=`Pegel ${l(e.number)}`;return`
    <article class="${se(e.state)}" role="listitem" aria-labelledby="station-${e.uuid}">
      <header class="card-header">
        <h2 id="station-${e.uuid}" class="card-title">${l(e.name)}</h2>
        <p class="card-subtitle">${t}</p>
        ${re(e.state)}
      </header>
      ${te(e.state)}
    </article>
  `}function S(e){h.innerHTML=e.map(ne).join(""),h.setAttribute("aria-busy","false")}function ae(e){if(e.some(s=>!s.state.stale)){f=new Date,m.hidden=!0,m.textContent="",p.textContent=`Stand: ${f.toLocaleString("de-DE")}`;return}e.some(s=>s.state.stale)&&f&&(m.hidden=!1,m.textContent="Aktualisierung fehlgeschlagen – angezeigte Werte sind möglicherweise veraltet.",p.textContent=`Stand: ${f.toLocaleString("de-DE")} (veraltet)`)}async function ie(e){const t=$.get(e.uuid);try{const{km:s,reading:r,history:n,historyStale:a}=await U(e,{previousHistory:t?.history}),i={status:"success",data:r,km:s,history:n,historyStale:a};return $.set(e.uuid,i),{...e,state:i}}catch(s){const r=s instanceof Error?s.message:"Unbekannter Fehler";return t?{...e,state:{...t,stale:!0,refreshError:r}}:{...e,state:{status:"error",message:r}}}}async function x(e){e&&(h.setAttribute("aria-busy","true"),S(w.map(r=>({...r,state:{status:"loading"}}))));const t=await Promise.all(w.map(r=>ie(r)));S(t);const s=t.filter(r=>r.state.status==="success");ae(s)}function oe(){x(!0),window.setInterval(()=>{x(!1)},Z)}oe();
