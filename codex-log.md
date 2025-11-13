# Codex Change Log

## 2025-11-13
- Created codex-log file to track future edits per AGENTS.md requirements.
- Files Modified: codex-log.md
- Updated Code Block:
```markdown
# Codex Change Log

## 2025-11-13
- Created codex-log file to track future edits per AGENTS.md requirements.
- Files Modified: codex-log.md
- Updated Code Block:
```markdown
# Codex Change Log

## 2025-11-13
- Created codex-log file to track future edits per AGENTS.md requirements.
- Files Modified: codex-log.md
- Updated Code Block:
```markdown
# Codex Change Log

## 2025-11-13
- Created codex-log file to track future edits per AGENTS.md requirements.
- Files Modified: codex-log.md
- Updated Code Block:
(creation entry self-referential for initialization)
```
```
```
```

## 2025-11-13 (Consistency Panel Shell)
- Implemented the new Consistency modal tab, HUD shell, and chart scaffolding plus supporting styles/scripts.
- Files Modified: GL-EZ_DH/rosters/rosters.html, GL-EZ_DH/styles/styles.css, GL-EZ_DH/scripts/app.js
- Updated Code Blocks:
```html
    <div id="consistency-container" class="hidden stats-key-panel consistency-panel">
      <div class="consistency-panel-shell">
        <div class="consistency-hud">
          <div class="consistency-hud-segment consistency-hud-segment--left">
            <div class="consistency-progress-circle consistency-progress-circle--consistency" aria-label="Consistency rate">
              <svg viewBox="0 0 120 120" class="consistency-progress-ring" aria-hidden="true">
                <defs>
                  <linearGradient id="consistencyGradientPanel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#7cf5ff" />
                    <stop offset="55%" stop-color="#9f8bff" />
                    <stop offset="100%" stop-color="#c7a4ff" />
                  </linearGradient>
                </defs>
                <circle class="consistency-progress-ring-track" cx="60" cy="60" r="46"></circle>
                <circle class="consistency-progress-ring-fill" cx="60" cy="60" r="46" stroke="url(#consistencyGradientPanel)" style="--progress: 0.68;"></circle>
              </svg>
              <div class="consistency-progress-circle-inner">
                <div class="consistency-progress-value">66.7%</div>
                <div class="consistency-progress-label">Consistency Rate</div>
                <div class="consistency-progress-caption">2025 Snapshot</div>
              </div>
            </div>
          </div>
          <div class="consistency-hud-segment consistency-hud-segment--center">
            <div class="consistency-hud-player">
              <div class="consistency-hud-eyebrow">Consistency &amp; Ceiling | Weekly Overview</div>
              <div class="consistency-hud-context"><span class="consistency-hud-player-name">Player Name</span> • Weeks 1–9</div>
            </div>
            <div class="consistency-hud-metrics">
              <div class="consistency-metric-block">
                <div class="consistency-metric-label">Consistency</div>
                <div class="consistency-metric-primary">
                  <span class="consistency-metric-value">66.7%</span>
                  <span class="consistency-metric-sub">Pos Rank: —</span>
                </div>
              </div>
              <div class="consistency-metric-block">
                <div class="consistency-metric-label">Ceiling</div>
                <div class="consistency-metric-primary">
                  <span class="consistency-metric-value">28.8</span>
                  <span class="consistency-metric-sub">Pos Rank: —</span>
                </div>
              </div>
            </div>
            <div class="consistency-hud-zones">
              <span class="consistency-zone-chip consistency-zone-chip--bad">Bad 0–16</span>
              <span class="consistency-zone-chip consistency-zone-chip--good">Good 16–22</span>
              <span class="consistency-zone-chip consistency-zone-chip--great">Great 22–40</span>
            </div>
          </div>
          <div class="consistency-hud-segment consistency-hud-segment--right">
            <div class="consistency-progress-circle consistency-progress-circle--ceiling" aria-label="Ceiling positional rank">
              <svg viewBox="0 0 120 120" class="consistency-progress-ring" aria-hidden="true">
                <defs>
                  <linearGradient id="consistencyCeilingGradientPanel" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#ffb47e" />
                    <stop offset="40%" stop-color="#7cf5ff" />
                    <stop offset="100%" stop-color="#ff89cf" />
                  </linearGradient>
                </defs>
                <circle class="consistency-progress-ring-track" cx="60" cy="60" r="46"></circle>
                <circle class="consistency-progress-ring-fill consistency-progress-ring-fill--ceiling" cx="60" cy="60" r="46" stroke="url(#consistencyCeilingGradientPanel)" style="--progress: 0.84;"></circle>
              </svg>
              <div class="consistency-progress-circle-inner">
                <div class="consistency-progress-value">4</div>
                <div class="consistency-progress-label">Ceiling<br/>Rank</div>
                <div class="consistency-progress-caption">2025 Pos Snapshot</div>
              </div>
            </div>
          </div>
        </div>
        <div class="consistency-chart-shell">
          <div class="consistency-chart-box">
            <div class="consistency-chart-y-axis">
              <div class="consistency-chart-y-tick">40</div>
              <div class="consistency-chart-y-tick">32</div>
              <div class="consistency-chart-y-tick">24</div>
              <div class="consistency-chart-y-tick">16</div>
              <div class="consistency-chart-y-tick">8</div>
            </div>
            <div class="consistency-chart-zone consistency-chart-zone--bad">
              <span class="consistency-zone-label">Under &lt; 16</span>
            </div>
            <div class="consistency-chart-zone consistency-chart-zone--good">
              <span class="consistency-zone-label">Solid ≥ 16</span>
            </div>
            <div class="consistency-chart-zone consistency-chart-zone--great">
              <span class="consistency-zone-label">Elite &gt; 22</span>
            </div>
            <div class="consistency-chart-grid" aria-hidden="true"></div>
            <div class="consistency-chart-line-layer"></div>
            <div class="consistency-chart-x-axis">
              <span>WK1</span>
              <span>WK2</span>
              <span>WK3</span>
              <span>WK4</span>
              <span>WK5</span>
              <span>WK6</span>
              <span>WK7</span>
              <span>WK8</span>
              <span>WK9</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
  <div class="key-chip modal-info-btn" data-panel="game-logs">
    <i class="fa-solid fa-rectangle-list"></i>
    <span>GM-Logs</span>
  </div>
  <div class="key-chip modal-info-btn" data-panel="radar-chart">
    <i class="fa-solid fa-chart-area"></i>
    <span>Performance</span>
  </div>
  <div class="key-chip modal-info-btn" data-panel="consistency">
    <i class="fa-solid fa-wave-square"></i>
    <span>Consistency</span>
  </div>
  <div class="key-chip modal-info-btn" data-panel="stats-key">
    <i class="fa-solid fa-key"></i>
    <span>Key</span>
  </div>
</div>
```
```css
/* Consistency Container - HUD + chart overlay */
#game-logs-modal #modal-body #consistency-container {
    position: absolute;
    inset: 0;
    margin: 0;
    padding: 0.6rem 0.75rem 0.75rem;
    max-height: none;
    overflow-y: auto;
    border-radius: 9px;
    background: radial-gradient(circle at 10% 0%, rgba(17, 19, 36, 0.98), rgba(10, 13, 27, 0.96));
    border: 1px solid rgba(119, 125, 191, 0.35);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    z-index: 5;
}

.consistency-panel {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    min-height: 100%;
}

.consistency-panel-shell {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    min-height: 100%;
}

.consistency-hud {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 2.1fr) minmax(0, 1.1fr);
    gap: 1.1rem;
    padding: 0.85rem 1rem;
    border-radius: 18px;
    background: linear-gradient(135deg, rgba(64, 70, 114, 0.18), rgba(21, 25, 61, 0.45));
    border: 1px solid rgba(156, 177, 255, 0.22);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(6px);
}

.consistency-hud-segment {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.35rem;
}

.consistency-hud-segment--center {
    text-align: center;
    align-items: center;
}

.consistency-progress-circle {
    position: relative;
    width: 132px;
    height: 132px;
    padding: 10px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(circle, rgba(78, 92, 155, 0.25), rgba(13, 14, 27, 0.35));
    border: 1px solid rgba(159, 194, 255, 0.32);
    box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.02), 0 8px 32px rgba(0, 0, 0, 0.65);
}

.consistency-progress-ring {
    position: absolute;
    inset: -10px;
    transform: rotate(-90deg);
}

.consistency-progress-ring-track {
    fill: none;
    stroke: rgba(109, 123, 172, 0.32);
    stroke-width: 7;
}

.consistency-progress-ring-fill {
    fill: none;
    stroke-width: 7;
    stroke-linecap: round;
    stroke-dasharray: 289;
    stroke-dashoffset: calc(289 * (1 - var(--progress, 0)));
}

.consistency-progress-ring-fill--ceiling {
    transform-origin: 60px 60px;
}

.consistency-progress-circle-inner {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    text-align: center;
    gap: 0.05rem;
}

.consistency-progress-value {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--color-text-primary);
    text-shadow: 0 0 12px rgba(124, 245, 255, 0.45);
}

.consistency-progress-label {
    font-size: 0.7rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-text-secondary);
}

.consistency-progress-caption {
    font-size: 0.52rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-text-tertiary);
}

.consistency-hud-player {
    margin-bottom: 0.25rem;
}

.consistency-hud-eyebrow {
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
}

.consistency-hud-player-name {
    font-weight: 600;
    color: var(--color-text-primary);
}

.consistency-hud-context {
    margin-top: 0.25rem;
    color: var(--color-text-secondary);
    font-size: 0.85rem;
}

.consistency-hud-metrics {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.consistency-metric-block {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
}

.consistency-metric-label {
    font-size: 0.62rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--color-text-tertiary);
}

.consistency-metric-primary {
    display: flex;
    gap: 0.45rem;
    align-items: baseline;
}

.consistency-metric-value {
    font-size: 1.3rem;
    font-weight: 600;
    color: #c4b8ff;
}

.consistency-metric-sub {
    font-size: 0.78rem;
    color: #7fd9f2;
}

.consistency-hud-zones {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
    justify-content: center;
}

.consistency-zone-chip {
    padding: 0.15rem 0.55rem;
    border-radius: 999px;
    border: 1px solid rgba(148, 177, 255, 0.3);
    text-transform: uppercase;
    font-size: 0.58rem;
    letter-spacing: 0.14em;
    color: var(--color-text-secondary);
}

.consistency-zone-chip--bad { border-color: rgba(255, 111, 182, 0.7); }
.consistency-zone-chip--good { border-color: rgba(185, 172, 255, 0.65); }
.consistency-zone-chip--great { border-color: rgba(124, 245, 255, 0.75); }

.consistency-chart-shell {
    border-radius: 12px;
    border: 1px solid rgba(133, 154, 233, 0.4);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    background: rgba(9, 10, 20, 0.75);
    padding: 0.35rem;
}

.consistency-chart-box {
    position: relative;
    height: clamp(280px, 42vh, 380px);
    border-radius: 9px;
    overflow: hidden;
}

.consistency-chart-y-axis {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0.4rem;
    width: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0.9rem 0.1rem 2.1rem;
    font-size: 0.55rem;
    letter-spacing: 0.12em;
    color: rgba(234, 235, 240, 0.7);
    text-transform: uppercase;
    z-index: 4;
}

.consistency-chart-grid {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(
        to top,
        rgba(255, 255, 255, 0.04) 0px,
        rgba(255, 255, 255, 0.04) 1px,
        transparent 1px,
        transparent 28px
    );
    pointer-events: none;
    z-index: 1;
}

.consistency-chart-zone {
    position: absolute;
    left: 3.2rem;
    right: 0.35rem;
    border-radius: 4px;
    padding: 0.2rem;
    color: rgba(239, 246, 255, 0.6);
    font-size: 0.45rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.consistency-chart-zone--bad {
    top: calc(100% - 26%);
    bottom: 0;
    background: linear-gradient(180deg, rgba(255, 111, 182, 0.08), transparent);
}

.consistency-chart-zone--good {
    top: calc(100% - 45%);
    bottom: calc(100% - 26%);
    background: linear-gradient(180deg, rgba(185, 172, 255, 0.08), transparent);
}

.consistency-chart-zone--great {
    top: 0;
    bottom: calc(100% - 45%);
    background: linear-gradient(180deg, rgba(124, 245, 255, 0.12), transparent);
}

.consistency-zone-label {
    position: absolute;
    top: 4px;
    right: 0.4rem;
}

.consistency-chart-line-layer {
    position: absolute;
    inset: 0.9rem 0.5rem 2.2rem 3.3rem;
    z-index: 3;
}

.consistency-chart-x-axis {
    position: absolute;
    bottom: 0;
    left: 3.3rem;
    right: 0.35rem;
    display: flex;
    justify-content: space-between;
    font-size: 0.55rem;
    color: rgba(234, 235, 240, 0.85);
    background: rgba(18, 21, 41, 0.85);
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding: 0.35rem 0.15rem;
    letter-spacing: 0.04em;
    z-index: 5;
}

.consistency-chart-x-axis span {
    flex: 1;
    text-align: center;
}

@media (max-width: 960px) {
    .consistency-hud {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .consistency-hud-segment--left,
    .consistency-hud-segment--right {
        align-items: center;
    }
}
```
```javascript
        const modalInfoBtns = document.querySelectorAll(.modal-info-btn);
        const statsKeyContainer = document.getElementById(stats-key-container);
        const radarChartContainer = document.getElementById(radar-chart-container);
        const consistencyContainer = document.getElementById(consistency-container);

                        const overlayContainers = {
                            stats-key: statsKeyContainer,
                            radar-chart: radarChartContainer,
                            consistency: consistencyContainer
                        };

            if (consistencyContainer) {
                consistencyContainer.classList.add(hidden);
                modalBody.appendChild(consistencyContainer);
            }

            if (consistencyContainer) consistencyContainer.classList.add(hidden);
```
