import { fetchStationWind } from '../../src/windApp/api';
import { beaufortDisplay } from '../../src/windApp/beaufort';
import { renderHistoryChart } from '../../src/windApp/history-chart';
import { STATIONS } from '../../src/windApp/stations';
import type {
  StationConfig,
  StationDisplay,
  StationLoadState,
} from '../../src/windApp/types';
import { formatDirection } from '../../src/windApp/wind-direction';
import './styles.css';

const REFRESH_INTERVAL_MS = 60_000;

type SuccessState = Extract<StationLoadState, { status: 'success' }>;

const gridEl = document.getElementById('station-grid');
const lastUpdateEl = document.getElementById('last-update');
const refreshWarningEl = document.getElementById('refresh-warning');

if (!gridEl || !lastUpdateEl || !refreshWarningEl) {
  throw new Error('Erforderliche DOM-Elemente fehlen');
}

const lastSuccessByUuid = new Map<string, SuccessState>();
let lastSuccessfulRefresh: Date | null = null;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatSpeed(ms: number): string {
  return `${ms.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m/s`;
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatKm(km: number): string {
  return `${km.toLocaleString('de-DE', { minimumFractionDigits: 3, maximumFractionDigits: 3 })} km Weser`;
}

function windArrowSvg(degrees: number): string {
  return `
    <svg
      class="wind-arrow"
      viewBox="0 0 64 64"
      width="80"
      height="80"
      role="img"
      aria-label="${escapeHtml(`Wind aus ${formatDirection(degrees)}`)}"
      style="transform: rotate(${degrees}deg)"
    >
      <circle class="wind-arrow__ring" cx="32" cy="32" r="28" />
      <polygon class="wind-arrow__head" points="32,8 24,28 40,28" />
      <rect class="wind-arrow__tail" x="29" y="28" width="6" height="22" rx="2" />
      <text class="wind-arrow__n" x="32" y="14" text-anchor="middle">N</text>
    </svg>
  `;
}

function beaufortBlock(speedMs: number): string {
  const { bft, label, progressPct } = beaufortDisplay(speedMs);
  const prev = Math.max(0, bft - 1);
  const next = Math.min(12, bft + 1);
  const pct = Math.round(progressPct);
  const aria = `Beaufort ${bft}, ${pct} Prozent innerhalb der Stufe`;

  return `
    <div class="beaufort-block">
      <p class="wind-beaufort">Bft ${bft} – ${escapeHtml(label)}</p>
      <div class="beaufort-bar" role="meter" aria-label="${escapeHtml(aria)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
        <div class="beaufort-bar__track">
          <div class="beaufort-bar__fill" style="width: ${progressPct.toFixed(1)}%"></div>
          <div class="beaufort-bar__marker" style="left: ${progressPct.toFixed(1)}%"></div>
        </div>
        <div class="beaufort-bar__labels">
          <span>Bft ${prev}</span>
          <span class="beaufort-bar__current">Bft ${bft}</span>
          <span>Bft ${next}</span>
        </div>
      </div>
    </div>
  `;
}

function renderCardBody(state: StationLoadState): string {
  if (state.status === 'loading') {
    return `
      <div class="card-body card-body--loading">
        <p class="loading-text" aria-busy="true">Daten werden geladen …</p>
      </div>
    `;
  }

  if (state.status === 'error') {
    return `
      <div class="card-body card-body--error" role="alert">
        <p class="error-text">${escapeHtml(state.message)}</p>
      </div>
    `;
  }

  const { data, km, history } = state;
  const speedBlock =
    data.speedMs !== null
      ? `<p class="wind-speed">${formatSpeed(data.speedMs)}</p>${beaufortBlock(data.speedMs)}`
      : '<p class="wind-speed wind-speed--missing">Keine Geschwindigkeitsmessung</p>';

  const directionBlock =
    data.directionDeg !== null
      ? `
        <div class="wind-direction">
          ${windArrowSvg(data.directionDeg)}
          <p class="wind-direction__label">${escapeHtml(formatDirection(data.directionDeg))}</p>
        </div>
      `
      : '<p class="wind-direction--missing">Keine Richtungsmessung</p>';

  const timestampBlock = data.timestamp
    ? `<p class="card-timestamp">Messzeit: ${escapeHtml(formatTimestamp(data.timestamp))}</p>`
    : '';

  return `
    <div class="card-body">
      ${directionBlock}
      ${speedBlock}
      ${timestampBlock}
    </div>
    ${renderHistoryChart(history)}
    <p class="card-km">${escapeHtml(formatKm(km))}</p>
  `;
}

function staleBadge(state: StationLoadState): string {
  if (state.status !== 'success') {
    return '';
  }
  if (state.stale) {
    return '<p class="card-stale-badge" role="status">Stand veraltet</p>';
  }
  if (state.historyStale) {
    return '<p class="card-stale-badge card-stale-badge--history" role="status">Verlauf nicht aktualisiert</p>';
  }
  return '';
}

function cardClass(state: StationLoadState): string {
  const classes = ['station-card'];
  if (state.status === 'error') {
    classes.push('station-card--error');
  } else if (state.status === 'loading') {
    classes.push('station-card--loading');
  } else if (state.stale || state.historyStale) {
    classes.push('station-card--stale');
  }
  return classes.join(' ');
}

function renderStation(station: StationDisplay): string {
  const subtitle = `Pegel ${escapeHtml(station.number)}`;

  return `
    <article class="${cardClass(station.state)}" role="listitem" aria-labelledby="station-${station.uuid}">
      <header class="card-header">
        <h2 id="station-${station.uuid}" class="card-title">${escapeHtml(station.name)}</h2>
        <p class="card-subtitle">${subtitle}</p>
        ${staleBadge(station.state)}
      </header>
      ${renderCardBody(station.state)}
    </article>
  `;
}

function renderGrid(stations: StationDisplay[]): void {
  gridEl.innerHTML = stations.map(renderStation).join('');
  gridEl.setAttribute('aria-busy', 'false');
}

function updateFooter(successes: Array<StationDisplay & { state: SuccessState }>): void {
  const hasFreshCurrent = successes.some((r) => !r.state.stale);

  if (hasFreshCurrent) {
    lastSuccessfulRefresh = new Date();
    refreshWarningEl.hidden = true;
    refreshWarningEl.textContent = '';
    lastUpdateEl.textContent = `Stand: ${lastSuccessfulRefresh.toLocaleString('de-DE')}`;
    return;
  }

  if (successes.some((r) => r.state.stale) && lastSuccessfulRefresh) {
    refreshWarningEl.hidden = false;
    refreshWarningEl.textContent =
      'Aktualisierung fehlgeschlagen – angezeigte Werte sind möglicherweise veraltet.';
    lastUpdateEl.textContent = `Stand: ${lastSuccessfulRefresh.toLocaleString('de-DE')} (veraltet)`;
  }
}

async function loadStation(station: StationConfig): Promise<StationDisplay> {
  const previous = lastSuccessByUuid.get(station.uuid);

  try {
    const { km, reading, history, historyStale } = await fetchStationWind(station, {
      previousHistory: previous?.history,
    });

    const state: SuccessState = {
      status: 'success',
      data: reading,
      km,
      history,
      historyStale,
    };

    lastSuccessByUuid.set(station.uuid, state);
    return { ...station, state };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler';

    if (previous) {
      return {
        ...station,
        state: {
          ...previous,
          stale: true,
          refreshError: message,
        },
      };
    }

    return {
      ...station,
      state: { status: 'error', message },
    };
  }
}

async function refreshAll(showLoading: boolean): Promise<void> {
  if (showLoading) {
    gridEl.setAttribute('aria-busy', 'true');
    renderGrid(
      STATIONS.map((s) => ({
        ...s,
        state: { status: 'loading' as const },
      })),
    );
  }

  const results = await Promise.all(STATIONS.map((s) => loadStation(s)));
  renderGrid(results);

  const successes = results.filter(
    (r): r is StationDisplay & { state: SuccessState } => r.state.status === 'success',
  );
  updateFooter(successes);
}

function start(): void {
  void refreshAll(true);
  window.setInterval(() => {
    void refreshAll(false);
  }, REFRESH_INTERVAL_MS);
}

start();
