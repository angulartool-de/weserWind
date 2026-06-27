(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const o of a.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();function O(e,t){const n=new Map(t.map(r=>[r.timestamp,r.value]));return e.map(r=>({timestamp:r.timestamp,speedMs:r.value,directionDeg:n.get(r.timestamp)??null})).sort((r,s)=>new Date(r.timestamp).getTime()-new Date(s.timestamp).getTime())}function h(e){return new Date(e).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}function A(e,t){if(e.length<=t)return e;const n=(e.length-1)/(t-1);return Array.from({length:t},(r,s)=>e[Math.round(s*n)])}function R(e){if(e.length===0)return'<p class="history-empty">Keine Verlaufsdaten für die letzten 2 Stunden</p>';const t=280,n=100,r={top:10,right:10,bottom:24,left:34},s=t-r.left-r.right,a=n-r.top-r.bottom,o=e.map(i=>i.speedMs??0),p=Math.max(...o,1),c=new Date(e[0].timestamp).getTime(),u=new Date(e[e.length-1].timestamp).getTime(),m=Math.max(u-c,1),l=i=>r.left+(new Date(i).getTime()-c)/m*s,d=i=>r.top+a-i/p*a,T=e.filter(i=>i.speedMs!==null).map(i=>`${l(i.timestamp).toFixed(1)},${d(i.speedMs).toFixed(1)}`).join(" "),L=A(e.filter(i=>i.directionDeg!==null),8).map(i=>{const D=l(i.timestamp),W=r.top+a+6,B=i.directionDeg;return`
        <g transform="translate(${D.toFixed(1)}, ${W.toFixed(1)}) rotate(${B})" aria-hidden="true">
          <path class="history-arrow" d="M0,-6 L-2.5,-1 L-1.25,-1 L-1.25,5 L1.25,5 L1.25,-1 L2.5,-1 Z" />
        </g>
      `}).join(""),_=p.toLocaleString("de-DE",{maximumFractionDigits:1});return`
    <section class="history-section" aria-label="Windverlauf der letzten 2 Stunden">
      <h3 class="history-title">Letzten 2 Stunden</h3>
      <svg class="history-chart" viewBox="0 0 ${t} ${n}" width="100%" height="${n}" role="img"
        aria-label="Windgeschwindigkeit und -richtung der letzten 2 Stunden">
        <title>Windverlauf letzten 2 Stunden</title>
        <line class="history-axis" x1="${r.left}" y1="${r.top+a}" x2="${t-r.right}" y2="${r.top+a}" />
        <line class="history-axis" x1="${r.left}" y1="${r.top}" x2="${r.left}" y2="${r.top+a}" />
        <text class="history-label" x="${r.left-4}" y="${r.top+4}" text-anchor="end">${_}</text>
        <text class="history-label" x="${r.left-4}" y="${r.top+a}" text-anchor="end">0</text>
        <polyline class="history-line" points="${T}" />
        ${L}
        <text class="history-label" x="${r.left}" y="${n-4}">${h(e[0].timestamp)}</text>
        <text class="history-label" x="${t-r.right}" y="${n-4}" text-anchor="end">${h(e[e.length-1].timestamp)}</text>
      </svg>
      <p class="history-legend">
        <span class="history-legend__line">— Geschwindigkeit (m/s)</span>
        <span class="history-legend__arrow">↑ Richtung (woher)</span>
      </p>
    </section>
  `}const g=[{uuid:"116572da-c036-4486-ac18-a92932424e30",number:"4970030",name:"RECHTENFLETH"},{uuid:"d3f822a0-e201-4a61-8913-589c74818ae0",number:"4990010",name:"BHV ALTER LEUCHTTURM"},{uuid:"78029185-9dfc-4b1b-8695-45ebc2a09cf4",number:"9460010",name:"ROBBENSÜDSTEERT"},{uuid:"ad3b53f8-8c1b-439f-a0df-9f24827026d5",number:"9460020",name:"DWARSGAT"},{uuid:"c6772c3c-a6bb-4728-9250-a408ab3856bd",number:"9460040",name:"LEUCHTTURM ALTE WESER"}],w="https://www.pegelonline.wsv.de/webservices/rest-api/v2";function F(e){const t=new URLSearchParams({includeTimeseries:"true",includeCurrentMeasurement:"true"});return`${w}/stations/${e}.json?${t.toString()}`}const P="PT2H";function k(e,t){const n=new URLSearchParams({start:P});return`${w}/stations/${e}/${t}/measurements.json?${n.toString()}`}function H(e){var c,u,m,l;const t=e.timeseries.find(d=>d.shortname==="WG"),n=e.timeseries.find(d=>d.shortname==="WR"),r=((c=t==null?void 0:t.currentMeasurement)==null?void 0:c.value)??null,s=((u=n==null?void 0:n.currentMeasurement)==null?void 0:u.value)??null,a=((m=t==null?void 0:t.currentMeasurement)==null?void 0:m.timestamp)??null,o=((l=n==null?void 0:n.currentMeasurement)==null?void 0:l.timestamp)??null;return{speedMs:r,directionDeg:s,timestamp:a??o}}async function b(e,t){const n=await fetch(k(e,t));return n.ok?await n.json():[]}async function N(e){const[t,n,r]=await Promise.all([fetch(F(e.uuid)),b(e.uuid,"WG"),b(e.uuid,"WR")]);if(!t.ok)throw new Error(`HTTP ${t.status}`);const s=await t.json(),a=H(s),o=O(n,r);if(a.speedMs===null&&a.directionDeg===null&&o.length===0)throw new Error("Keine Windmessung verfügbar");return{km:s.km,reading:a,history:o}}const C=.836,U=["Windstille","Leiser Zug","Leichte Brise","Schwache Brise","Mäßige Brise","Frische Brise","Starker Wind","Steifer Wind","Stürmischer Wind","Sturm","Schwerer Sturm","Orkanartiger Sturm","Orkan"];function S(e){return e<=0?0:Math.pow(e/C,2/3)}function z(e){return e<.3?0:Math.min(12,Math.round(S(e)))}function G(e){const t=Math.max(0,Math.min(12,e));return U[t]??"Unbekannt"}function I(e){const t=S(e),n=z(e);let r;if(n===0)r=Math.min(1,t/.5);else if(n>=12)r=Math.min(1,(t-11.5)/.5);else{const s=n-.5,a=n+.5;r=(t-s)/(a-s)}return{bft:n,label:G(n),exact:t,progressPct:Math.max(0,Math.min(100,r*100))}}const j=["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW"];function K(e){const t=(e%360+360)%360,n=Math.round(t/22.5)%16;return j[n]}function x(e){const t=K(e),n=Math.round(e);return`${t} (${n}°)`}const V=6e4,M=document.getElementById("station-grid"),v=document.getElementById("last-update");if(!M||!v)throw new Error("Erforderliche DOM-Elemente fehlen");const f=M,q=v;function Z(e){return`${e.toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1})} m/s`}function Y(e){return new Date(e).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}function J(e){return`
    <svg
      class="wind-arrow"
      viewBox="0 0 64 64"
      width="80"
      height="80"
      role="img"
      aria-label="${`Wind aus ${x(e)}`}"
      style="transform: rotate(${e}deg)"
    >
      <circle class="wind-arrow__ring" cx="32" cy="32" r="28" />
      <polygon class="wind-arrow__head" points="32,8 24,28 40,28" />
      <rect class="wind-arrow__tail" x="29" y="28" width="6" height="22" rx="2" />
      <text class="wind-arrow__n" x="32" y="14" text-anchor="middle">N</text>
    </svg>
  `}function Q(e){const{bft:t,label:n,progressPct:r}=I(e),s=Math.max(0,t-1),a=Math.min(12,t+1),o=`Beaufort ${t}, ${Math.round(r)} Prozent innerhalb der Stufe`;return`
    <div class="beaufort-block">
      <p class="wind-beaufort">Bft ${t} – ${n}</p>
      <div class="beaufort-bar" role="meter" aria-label="${o}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(r)}">
        <div class="beaufort-bar__track">
          <div class="beaufort-bar__fill" style="width: ${r.toFixed(1)}%"></div>
          <div class="beaufort-bar__marker" style="left: ${r.toFixed(1)}%"></div>
        </div>
        <div class="beaufort-bar__labels">
          <span>Bft ${s}</span>
          <span class="beaufort-bar__current">Bft ${t}</span>
          <span>Bft ${a}</span>
        </div>
      </div>
    </div>
  `}function X(e){if(e.status==="loading")return`
      <div class="card-body card-body--loading">
        <p class="loading-text" aria-busy="true">Daten werden geladen …</p>
      </div>
    `;if(e.status==="error")return`
      <div class="card-body card-body--error" role="alert">
        <p class="error-text">${E(e.message)}</p>
      </div>
    `;const{data:t,km:n,history:r}=e,s=t.speedMs!==null?`
            <p class="wind-speed">${Z(t.speedMs)}</p>
            ${Q(t.speedMs)}
          `:'<p class="wind-speed wind-speed--missing">Keine Geschwindigkeitsmessung</p>',a=t.directionDeg!==null?`
        <div class="wind-direction">
          ${J(t.directionDeg)}
          <p class="wind-direction__label">${x(t.directionDeg)}</p>
        </div>
      `:'<p class="wind-direction--missing">Keine Richtungsmessung</p>',o=t.timestamp?`<p class="card-timestamp">Messzeit: ${Y(t.timestamp)}</p>`:"";return`
    <div class="card-body">
      ${a}
      ${s}
      ${o}
    </div>
    ${R(r)}
    <p class="card-km">${n.toLocaleString("de-DE",{minimumFractionDigits:3,maximumFractionDigits:3})} km Weser</p>
  `}function E(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function ee(e){const t=`Pegel ${e.number}`;return`
    <article class="station-card${e.state.status==="error"?" station-card--error":e.state.status==="loading"?" station-card--loading":""}" role="listitem" aria-labelledby="station-${e.uuid}">
      <header class="card-header">
        <h2 id="station-${e.uuid}" class="card-title">${E(e.name)}</h2>
        <p class="card-subtitle">${t}</p>
      </header>
      ${X(e.state)}
    </article>
  `}function y(e){f.innerHTML=e.map(ee).join(""),f.setAttribute("aria-busy","false")}async function te(e){try{const{km:t,reading:n,history:r}=await N(e);return{...e,state:{status:"success",data:n,km:t,history:r}}}catch(t){const n=t instanceof Error?t.message:"Unbekannter Fehler";return{...e,state:{status:"error",message:n}}}}async function $(e=!1){if(e){f.setAttribute("aria-busy","true");const n=g.map(r=>({...r,state:{status:"loading"}}));y(n)}const t=await Promise.all(g.map(n=>te(n)));y(t),q.textContent=`Stand: ${new Date().toLocaleString("de-DE")}`}function re(){$(!0),window.setInterval(()=>{$(!1)},V)}re();
