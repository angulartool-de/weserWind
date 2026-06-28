(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const i of a.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function n(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function r(s){if(s.ep)return;s.ep=!0;const a=n(s);fetch(s.href,a)}})();function O(e,t){const n=new Map(t.map(r=>[r.timestamp,r.value]));return e.map(r=>({timestamp:r.timestamp,speedMs:r.value,directionDeg:n.get(r.timestamp)??null})).sort((r,s)=>new Date(r.timestamp).getTime()-new Date(s.timestamp).getTime())}function y(e){return new Date(e).toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}function k(e,t){if(e.length<=t)return e;const n=(e.length-1)/(t-1);return Array.from({length:t},(r,s)=>e[Math.round(s*n)])}function H(e){if(e.length===0)return'<p class="history-empty">Keine Verlaufsdaten für die letzten 2 Stunden</p>';const t=280,n=100,r={top:10,right:10,bottom:24,left:34},s=t-r.left-r.right,a=n-r.top-r.bottom,i=e.map(o=>o.speedMs??0),u=Math.max(...i,1),l=new Date(e[0].timestamp).getTime(),d=new Date(e[e.length-1].timestamp).getTime(),D=Math.max(d-l,1),w=o=>r.left+(new Date(o).getTime()-l)/D*s,_=o=>r.top+a-o/u*a,L=e.filter(o=>o.speedMs!==null).map(o=>`${w(o.timestamp).toFixed(1)},${_(o.speedMs).toFixed(1)}`).join(" "),W=k(e.filter(o=>o.directionDeg!==null),8).map(o=>{const R=w(o.timestamp),A=r.top+a+6,F=o.directionDeg;return`
        <g transform="translate(${R.toFixed(1)}, ${A.toFixed(1)}) rotate(${F})" aria-hidden="true">
          <path class="history-arrow" d="M0,-6 L-2.5,-1 L-1.25,-1 L-1.25,5 L1.25,5 L1.25,-1 L2.5,-1 Z" />
        </g>
      `}).join(""),B=u.toLocaleString("de-DE",{maximumFractionDigits:1});return`
    <section class="history-section" aria-label="Windverlauf der letzten 2 Stunden">
      <h3 class="history-title">Letzten 2 Stunden</h3>
      <svg class="history-chart" viewBox="0 0 ${t} ${n}" width="100%" height="${n}" role="img"
        aria-label="Windgeschwindigkeit und -richtung der letzten 2 Stunden">
        <title>Windverlauf letzten 2 Stunden</title>
        <line class="history-axis" x1="${r.left}" y1="${r.top+a}" x2="${t-r.right}" y2="${r.top+a}" />
        <line class="history-axis" x1="${r.left}" y1="${r.top}" x2="${r.left}" y2="${r.top+a}" />
        <text class="history-label" x="${r.left-4}" y="${r.top+4}" text-anchor="end">${B}</text>
        <text class="history-label" x="${r.left-4}" y="${r.top+a}" text-anchor="end">0</text>
        <polyline class="history-line" points="${L}" />
        ${W}
        <text class="history-label" x="${r.left}" y="${n-4}">${y(e[0].timestamp)}</text>
        <text class="history-label" x="${t-r.right}" y="${n-4}" text-anchor="end">${y(e[e.length-1].timestamp)}</text>
      </svg>
      <p class="history-legend">
        <span class="history-legend__line">— Geschwindigkeit (m/s)</span>
        <span class="history-legend__arrow">↑ Richtung (woher)</span>
      </p>
    </section>
  `}const $=[{uuid:"116572da-c036-4486-ac18-a92932424e30",number:"4970030",name:"RECHTENFLETH"},{uuid:"d3f822a0-e201-4a61-8913-589c74818ae0",number:"4990010",name:"BHV ALTER LEUCHTTURM"},{uuid:"78029185-9dfc-4b1b-8695-45ebc2a09cf4",number:"9460010",name:"ROBBENSÜDSTEERT"},{uuid:"ad3b53f8-8c1b-439f-a0df-9f24827026d5",number:"9460020",name:"DWARSGAT"},{uuid:"c6772c3c-a6bb-4728-9250-a408ab3856bd",number:"9460040",name:"LEUCHTTURM ALTE WESER"}],M="https://www.pegelonline.wsv.de/webservices/rest-api/v2";function P(e){const t=new URLSearchParams({includeTimeseries:"true",includeCurrentMeasurement:"true"});return`${M}/stations/${e}.json?${t.toString()}`}const N="PT2H";function C(e,t){const n=new URLSearchParams({start:N});return`${M}/stations/${e}/${t}/measurements.json?${n.toString()}`}function U(e){const t=e.timeseries.find(l=>l.shortname==="WG"),n=e.timeseries.find(l=>l.shortname==="WR"),r=t?.currentMeasurement?.value??null,s=n?.currentMeasurement?.value??null,a=t?.currentMeasurement?.timestamp??null,i=n?.currentMeasurement?.timestamp??null;return{speedMs:r,directionDeg:s,timestamp:a??i}}async function b(e,t){try{const n=await fetch(C(e,t));return n.ok?{measurements:await n.json(),failed:!1}:{measurements:[],failed:!0}}catch{return{measurements:[],failed:!0}}}async function z(e,t){const[n,r,s]=await Promise.all([fetch(P(e.uuid)),b(e.uuid,"WG"),b(e.uuid,"WR")]);if(!n.ok)throw new Error(`HTTP ${n.status}`);const a=await n.json(),i=U(a),u=r.failed||s.failed;let l=O(r.measurements,s.measurements),d=!1;if((l.length===0&&t?.previousHistory?.length||u&&t?.previousHistory?.length)&&(l=t.previousHistory,d=!0),i.speedMs===null&&i.directionDeg===null&&l.length===0)throw new Error("Keine Windmessung verfügbar");return{km:a.km,reading:i,history:l,historyStale:d||void 0}}const j=.836,I=["Windstille","Leiser Zug","Leichte Brise","Schwache Brise","Mäßige Brise","Frische Brise","Starker Wind","Steifer Wind","Stürmischer Wind","Sturm","Schwerer Sturm","Orkanartiger Sturm","Orkan"];function E(e){return e<=0?0:Math.pow(e/j,2/3)}function G(e){return e<.3?0:Math.min(12,Math.round(E(e)))}function K(e){const t=Math.max(0,Math.min(12,e));return I[t]??"Unbekannt"}function V(e){const t=E(e),n=G(e);let r;if(n===0)r=Math.min(1,t/.5);else if(n>=12)r=Math.min(1,(t-11.5)/.5);else{const s=n-.5,a=n+.5;r=(t-s)/(a-s)}return{bft:n,label:K(n),exact:t,progressPct:Math.max(0,Math.min(100,r*100))}}function q(e,t,n){const s=(n?new Date(n).getTime():Date.now())-t*6e4,a=e.filter(i=>i.speedMs!==null&&new Date(i.timestamp).getTime()>=s).map(i=>i.speedMs);return a.length===0?{min:null,max:null}:{min:Math.min(...a),max:Math.max(...a)}}const Z=["N","NNO","NO","ONO","O","OSO","SO","SSO","S","SSW","SW","WSW","W","WNW","NW","NNW"];function Y(e){const t=(e%360+360)%360,n=Math.round(t/22.5)%16;return Z[n]}function T(e){const t=Y(e),n=Math.round(e);return`${t} (${n}°)`}const J=6e4,h=document.getElementById("station-grid"),g=document.getElementById("last-update"),m=document.getElementById("refresh-warning");if(!h||!g||!m)throw new Error("Erforderliche DOM-Elemente fehlen");const S=new Map;let p=null;function c(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Q(e){return`${e.toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1})} m/s`}function X(e){return new Date(e).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"})}function ee(e){return`${e.toLocaleString("de-DE",{minimumFractionDigits:3,maximumFractionDigits:3})} km Weser`}function te(e){return`
    <svg
      class="wind-arrow"
      viewBox="0 0 64 64"
      width="80"
      height="80"
      role="img"
      aria-label="${c(`Wind aus ${T(e)}`)}"
      style="transform: rotate(${e}deg)"
    >
      <circle class="wind-arrow__ring" cx="32" cy="32" r="28" />
      <polygon class="wind-arrow__head" points="32,8 24,28 40,28" />
      <rect class="wind-arrow__tail" x="29" y="28" width="6" height="22" rx="2" />
      <text class="wind-arrow__n" x="32" y="14" text-anchor="middle">N</text>
    </svg>
  `}function f(e){return e.toLocaleString("de-DE",{minimumFractionDigits:1,maximumFractionDigits:1})}function re(e,t){return`
    <div class="wind-speed-range" aria-hidden="true">
      <p class="wind-speed-range__line">Max ${f(t)} m/s</p>
      <p class="wind-speed-range__line">Min ${f(e)} m/s</p>
      <p class="wind-speed-range__period">10 min</p>
    </div>
  `}function ne(e,t,n){const r=q(t,10,n),s=r.min!==null&&r.max!==null?re(r.min,r.max):"",a=r.min!==null&&r.max!==null?`, Maximum ${f(r.max)}, Minimum ${f(r.min)} in den letzten 10 Minuten`:"";return`
    <div class="wind-speed-row" aria-label="Windgeschwindigkeit: aktuell ${f(e)}${a}">
      <p class="wind-speed">${Q(e)}</p>
      ${s}
    </div>
    ${se(e)}
  `}function se(e){const{bft:t,label:n,progressPct:r}=V(e),s=Math.max(0,t-1),a=Math.min(12,t+1),i=Math.round(r),u=`Beaufort ${t}, ${i} Prozent innerhalb der Stufe`;return`
    <div class="beaufort-block">
      <p class="wind-beaufort">Bft ${t} – ${c(n)}</p>
      <div class="beaufort-bar" role="meter" aria-label="${c(u)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${i}">
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
  `}function ae(e){if(e.status==="loading")return`
      <div class="card-body card-body--loading">
        <p class="loading-text" aria-busy="true">Daten werden geladen …</p>
      </div>
    `;if(e.status==="error")return`
      <div class="card-body card-body--error" role="alert">
        <p class="error-text">${c(e.message)}</p>
      </div>
    `;const{data:t,km:n,history:r}=e,s=t.speedMs!==null?ne(t.speedMs,r,t.timestamp):'<p class="wind-speed wind-speed--missing">Keine Geschwindigkeitsmessung</p>',a=t.directionDeg!==null?`
        <div class="wind-direction">
          ${te(t.directionDeg)}
          <p class="wind-direction__label">${c(T(t.directionDeg))}</p>
        </div>
      `:'<p class="wind-direction--missing">Keine Richtungsmessung</p>',i=t.timestamp?`<p class="card-timestamp">Messzeit: ${c(X(t.timestamp))}</p>`:"";return`
    <div class="card-body">
      ${a}
      ${s}
      ${i}
    </div>
    ${H(r)}
    <p class="card-km">${c(ee(n))}</p>
  `}function ie(e){return e.status!=="success"?"":e.stale?'<p class="card-stale-badge" role="status">Stand veraltet</p>':e.historyStale?'<p class="card-stale-badge card-stale-badge--history" role="status">Verlauf nicht aktualisiert</p>':""}function oe(e){const t=["station-card"];return e.status==="error"?t.push("station-card--error"):e.status==="loading"?t.push("station-card--loading"):(e.stale||e.historyStale)&&t.push("station-card--stale"),t.join(" ")}function le(e){const t=`Pegel ${c(e.number)}`;return`
    <article class="${oe(e.state)}" role="listitem" aria-labelledby="station-${e.uuid}">
      <header class="card-header">
        <h2 id="station-${e.uuid}" class="card-title">${c(e.name)}</h2>
        <p class="card-subtitle">${t}</p>
        ${ie(e.state)}
      </header>
      ${ae(e.state)}
    </article>
  `}function x(e){h.innerHTML=e.map(le).join(""),h.setAttribute("aria-busy","false")}function ce(e){if(e.some(n=>!n.state.stale)){p=new Date,m.hidden=!0,m.textContent="",g.textContent=`Stand: ${p.toLocaleString("de-DE")}`;return}e.some(n=>n.state.stale)&&p&&(m.hidden=!1,m.textContent="Aktualisierung fehlgeschlagen – angezeigte Werte sind möglicherweise veraltet.",g.textContent=`Stand: ${p.toLocaleString("de-DE")} (veraltet)`)}async function ue(e){const t=S.get(e.uuid);try{const{km:n,reading:r,history:s,historyStale:a}=await z(e,{previousHistory:t?.history}),i={status:"success",data:r,km:n,history:s,historyStale:a};return S.set(e.uuid,i),{...e,state:i}}catch(n){const r=n instanceof Error?n.message:"Unbekannter Fehler";return t?{...e,state:{...t,stale:!0,refreshError:r}}:{...e,state:{status:"error",message:r}}}}async function v(e){e&&(h.setAttribute("aria-busy","true"),x($.map(r=>({...r,state:{status:"loading"}}))));const t=await Promise.all($.map(r=>ue(r)));x(t);const n=t.filter(r=>r.state.status==="success");ce(n)}function de(){v(!0),window.setInterval(()=>{v(!1)},J)}de();
