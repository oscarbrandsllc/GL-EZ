// === Legend hard-hide helper ===
function hideLegend(){ try{ document.getElementById('legend-section')?.classList.add('hidden'); }catch(e){} }
function showLegend(){ try{ document.getElementById('legend-section')?.classList.remove('hidden'); }catch(e){} }
        // --- DOM Elements ---
        const usernameInput = document.getElementById('usernameInput');
        const leagueSelect = document.getElementById('leagueSelect');
        const loadingIndicator = document.getElementById('loading');
        const welcomeScreen = document.getElementById('welcome-screen');
        const rosterView = document.getElementById('rosterView');
        const playerListView = document.getElementById('playerListView');
        const rosterContainer = document.getElementById('rosterContainer');
        const rosterGrid = document.getElementById('rosterGrid');
        const rosterContentVisibilityQuery = (typeof window !== 'undefined' && typeof window.matchMedia === 'function')
            ? window.matchMedia('(max-width: 819px)')
            : null;
        let rosterContentVisibilityEnabled = false;
        const compareButton = document.getElementById('compareButton');
        const compareSearchToggle  = document.getElementById('compareSearchToggle');
        const compareSearchPopover = document.getElementById('compareSearchPopover');
        const compareSearchInput   = document.getElementById('compareSearchInput');
        const compareSearchClose   = document.getElementById('compareSearchClose');
        const positionalViewBtn = document.getElementById('positionalViewBtn');
        const lineupViewBtn = document.getElementById('lineupViewBtn');
        const viewDropdownToggle = document.getElementById('viewDropdownToggle');
        const viewDropdownMenu = document.getElementById('viewDropdownMenu');
        const viewDropdownIcon = document.getElementById('viewDropdownIcon');
        const viewDropdownLabel = document.getElementById('viewDropdownLabel');
        const positionalFiltersContainer = document.getElementById('positional-filters');
        const clearFiltersButton = document.getElementById('clearFiltersButton');
        const tradeSimulator = document.getElementById('tradeSimulator');
        const mainContent = document.getElementById('content');
        const pageType = document.body.dataset.page || 'welcome';
        // New nav buttons
        const homeButton = document.getElementById('homeButton');
        const rostersButton = document.getElementById('rostersButton');
        const ownershipButton = document.getElementById('ownershipButton');
    const statsButton = document.getElementById('statsButton');
        const analyzerButton = document.getElementById('analyzerButton');
        const researchButton = document.getElementById('researchButton');
        const startSitButton = document.getElementById('startSitButton');
        const gameLogsModal = document.getElementById('game-logs-modal');
        const modalCloseBtn = document.querySelector('.modal-close-btn');
        const modalInfoBtns = document.querySelectorAll('.modal-info-btn');
        const statsKeyContainer = document.getElementById('stats-key-container');
        const radarChartContainer = document.getElementById('radar-chart-container');
        const newsContainer = document.getElementById('news-container');
        const modalOverlay = document.querySelector('.modal-overlay');
        const modalPlayerName = document.getElementById('modal-player-name');
        const modalPlayerVitals = document.getElementById('modal-player-vitals');
        const modalBody = document.getElementById('modal-body');
        const playerComparisonModal = document.getElementById('player-comparison-modal');
        const comparisonBackgroundOverlay = document.getElementById('comparison-modal-background-overlay');
        const supportsContentVisibility = typeof CSS !== 'undefined'
            && typeof CSS.supports === 'function'
            && CSS.supports('content-visibility', 'auto');
        function updateRosterContentVisibility() {
            if (!supportsContentVisibility || !rosterGrid) {
                rosterContentVisibilityEnabled = false;
                rosterGrid?.classList.remove('roster-cv-enabled');
                return;
            }
            const shouldEnable = rosterContentVisibilityQuery ? rosterContentVisibilityQuery.matches : false;
            rosterContentVisibilityEnabled = shouldEnable;
            rosterGrid.classList.toggle('roster-cv-enabled', shouldEnable);
        }
        if (supportsContentVisibility) {
            updateRosterContentVisibility();
            if (rosterContentVisibilityQuery) {
                const cvListener = () => updateRosterContentVisibility();
                if (typeof rosterContentVisibilityQuery.addEventListener === 'function') {
                    rosterContentVisibilityQuery.addEventListener('change', cvListener);
                } else if (typeof rosterContentVisibilityQuery.addListener === 'function') {
                    rosterContentVisibilityQuery.addListener(cvListener);
                }
            }
        }
        const COMPARE_BUTTON_PREVIEW_HTML = '<span class="button-text">Preview</span>';
        const COMPARE_BUTTON_SHOW_ALL_HTML = '<span class="compare-show-all-stack"><i aria-hidden="true" class="fa-solid fa-arrows-left-right-to-line compare-show-all-icon"></i><span class="compare-show-all-label">Show All</span></span>';
        if (compareButton) {
            compareButton.innerHTML = COMPARE_BUTTON_PREVIEW_HTML;
        }
        // --- Navigation Logic ---
        // Temporary focus suppression to prevent mobile keyboards from opening
        // when navigation buttons are tapped and other scripts may re-focus inputs.
        // We patch HTMLElement.prototype.focus to ignore focus calls on input-like
        // elements for a short window after navigation gestures.
        let __suppressFocusUntil = 0;
        const __suppressFocusMs = 700;
        function suppressFocusTemporary(ms) {
            __suppressFocusUntil = Date.now() + (ms || __suppressFocusMs);
        }
        (function installFocusGuard(){
            try {
                const originalFocus = HTMLElement.prototype.focus;
                HTMLElement.prototype.focus = function(...args) {
                    try {
                        const now = Date.now();
                        if (now < __suppressFocusUntil) {
                            const tag = (this && this.tagName) ? this.tagName.toUpperCase() : '';
                            const isInputLike = tag === 'INPUT' || tag === 'TEXTAREA' || this.isContentEditable;
                            if (isInputLike) {
                                // swallow the focus call during suppression window
                                return this;
                            }
                        }
                    } catch (e) {
                        // fall through to original focus if anything unexpected
                    }
                    return originalFocus.apply(this, args);
                };
            } catch (e) {
                // If monkey-patching isn't allowed in some environments, ignore.
            }
        })();
        // Optional focus-event instrumentation for debugging autofocusing issues.
        // Enable by adding ?debugFocus=1 to the URL.
        (function installFocusLogger(){
            try {
                const params = new URLSearchParams(window.location.search);
                if (!params.has('debugFocus')) return;
                if (params.get('debugFocus') !== '1') return;
                window._focusLog = window._focusLog || [];
                const maxEntries = 200;
                const pushLog = (entry) => {
                    window._focusLog.push(entry);
                    if (window._focusLog.length > maxEntries) window._focusLog.shift();
                };
                document.addEventListener('focusin', (e) => {
                    try {
                        const el = e.target;
                        const now = Date.now();
                        const tag = el && el.tagName ? el.tagName.toLowerCase() : 'unknown';
                        const name = el && (el.id || el.name || el.className) ? (el.id || el.name || el.className) : '';
                        const stack = (new Error()).stack || '';
                        const msg = `[focusin] ${new Date(now).toISOString()} ${tag} ${name}`;
                        console.warn(msg);
                        pushLog({ t: now, msg, tag, name, stack });
                    } catch (e) {}
                }, true);
                // expose helper to dump logs
                window.dumpFocusLog = function() { return (window._focusLog || []).slice(); };
            } catch (e) {}
        })();
        // Extra protection: when the page is shown or becomes visible (navigation/back),
        // re-enable temporary suppression and blur any active input to avoid the keyboard.
        try {
            window.addEventListener('pageshow', () => {
                try { suppressFocusTemporary(800); } catch (e) {}
                try { usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {}
            });
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    try { suppressFocusTemporary(800); } catch (e) {}
                    try { usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {}
                }
            });
            // As a final safety-net, intercept focusin events and blur input-like
            // elements while suppression is active. This will catch focus that
            // originates from browser heuristics or other scripts.
            document.addEventListener('focusin', (e) => {
                try {
                    if (Date.now() < __suppressFocusUntil) {
                        const el = e.target;
                        const tag = el && el.tagName ? el.tagName.toUpperCase() : '';
                        const isInputLike = tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
                        if (isInputLike) {
                            try { el.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {}
                        }
                    }
                } catch (e) {}
            }, true);
        } catch (e) {}
        const getPageUrl = (page) => {
            const username = usernameInput?.value?.trim() || '';
            let url = '';
            const base = pageType === 'welcome' ? '' : '../';
            switch(page) {
                case 'home':
                    url = pageType === 'welcome' ? '#' : `${base}index.html`;
                    break;
                case 'rosters':
                    url = `${base}rosters/rosters.html`;
                    break;
                case 'ownership':
                    url = `${base}ownership/ownership.html`;
                    break;
                case 'stats':
                    url = `${base}stats/stats.html`;
                    break;
                case 'analyzer':
                    url = `${base}analyzer/analyzer.html`;
                    break;
                case 'research':
                    url = `${base}research/research.html`;
                    break;
            }
            if (username && page !== 'home') {
                url += `?username=${encodeURIComponent(username)}`;
                if (page === 'rosters' || page === 'analyzer' || page === 'stats') {
                     const selected = leagueSelect?.value;
                    if (selected && selected !== 'Select a league...') {
                        url += `&leagueId=${selected}`;
                    } else if (state.currentLeagueId) {
                        url += `&leagueId=${state.currentLeagueId}`;
                    }
                }
            }
            return url;
        };
        // Ensure the username is valid for pages that require it.
        async function ensureValidUser(username) {
            if (!username || !username.trim()) {
                throw new Error('Please enter a username');
            }
            try {
                await fetchAndSetUser(username.trim());
                return true;
            } catch (e) {
                throw e;
            }
        }
        // Helper wrapper to validate username for non-home pages and navigate.
        async function ensureNavigate(page) {
            if (page === 'home') {
                window.location.href = getPageUrl('home');
                return;
            }
            const username = usernameInput?.value?.trim() || '';
            const pagesRequiringUsername = new Set(['rosters', 'ownership', 'analyzer']);
            const needsValidation = pagesRequiringUsername.has(page);
            if (needsValidation && !username) {
                showTemporaryTooltip(usernameInput || document.body, 'League-Connected Content Requires a Valid Username Input via the Home Page');
                return;
            }
            if (needsValidation) {
                try {
                    await ensureValidUser(username);
                } catch (e) {
                    showTemporaryTooltip(usernameInput || document.body, 'Username not found');
                    return;
                }
            }
            window.location.href = getPageUrl(page);
        }
        homeButton?.addEventListener('click', async () => {
                 // Defensive blur to avoid mobile keyboards appearing when nav buttons are tapped
                 try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {}
                 await ensureNavigate('home');
        });
        rostersButton?.addEventListener('click', async () => {
            try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {}
            await ensureNavigate('rosters');
        });
        ownershipButton?.addEventListener('click', async () => {
            try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {}
            await ensureNavigate('ownership');
        });
        // Placeholder stats button (inserted between Ownership and Analyzer)
        statsButton?.addEventListener('click', async () => {
            try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {}
            await ensureNavigate('stats');
        });
        analyzerButton?.addEventListener('click', async () => {
            try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {}
            await ensureNavigate('analyzer');
        });
    researchButton?.addEventListener('click', async () => {
            try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {}
            await ensureNavigate('research');
    });
// Add pointer/touch guards so quick taps on mobile also blur the input before navigation fires
['homeButton','rostersButton','ownershipButton','statsButton','analyzerButton','researchButton'].forEach(id=>{
    const el = document.getElementById(id);
    if (!el) return;
    const handler = () => { try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch(e){} };
    try {
        el.addEventListener('pointerdown', handler, { passive: true });
        el.addEventListener('touchstart', handler, { passive: true });
    } catch (e) {
        // some older browsers may throw on options; fall back
        try { el.addEventListener('pointerdown', handler); el.addEventListener('touchstart', handler); } catch (e) {}
    }
});
// --- Home page menu wiring (only when on welcome page) ---
if (pageType === 'welcome') {
    const homeMenuToggle = document.getElementById('homeMenuToggle');
    const homeMenu = document.getElementById('homeMenu');
    if (homeMenuToggle && homeMenu) {
        homeMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = homeMenu.classList.toggle('hidden') ? true : !homeMenu.classList.contains('hidden');
            homeMenuToggle.setAttribute('aria-expanded', String(!homeMenu.classList.contains('hidden')));
            homeMenu.setAttribute('aria-hidden', String(homeMenu.classList.contains('hidden')));
        });
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!homeMenu.contains(e.target) && !homeMenuToggle.contains(e.target)) {
                if (!homeMenu.classList.contains('hidden')) {
                    homeMenu.classList.add('hidden');
                    homeMenuToggle.setAttribute('aria-expanded', 'false');
                    homeMenu.setAttribute('aria-hidden', 'true');
                }
            }
        });
        // Wire menu items
        homeMenu.querySelectorAll('.home-menu-item').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const page = btn.dataset.page;
                try { suppressFocusTemporary(); usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {}
                // reuse ensureNavigate to validate username where needed
                await ensureNavigate(page);
            });
        });
    }
}
        // --- State ---
let state = { userId: null, leagues: [], players: {}, oneQbData: {}, sflxData: {}, currentLeagueId: null, isSuperflex: false, cache: {}, teamsToCompare: new Set(), isCompareMode: false, currentRosterView: 'positional', activePositions: new Set(), tradeBlock: {}, isTradeCollapsed: false, weeklyStats: {}, playerSeasonStats: {}, playerSeasonRanks: {}, playerWeeklyStats: {}, statsSheetsLoaded: false, seasonRankCache: null, isGameLogModalOpenFromComparison: false, liveWeeklyStats: {}, liveStatsLoaded: false, currentNflSeason: null, currentNflWeek: null, lastLiveStatsWeek: null, lastLiveStatsFetchTs: 0, calculatedRankCache: null, playerProjectionWeeks: {}, isStartSitMode: false, startSitSelections: [], startSitNextSide: 'left', startSitTeamName: null, leagueMatchupStats: {}, matchupDataLoaded: false, isGameLogFromStatsPage: false, statsPagePlayerData: null, currentGameLogsPlayerRanks: null, currentGameLogsSummary: null };
        const assignedLeagueColors = new Map();
        let nextColorIndex = 0;
        const assignedRyColors = new Map();
        let nextRyColorIndex = 0;
        // --- Constants ---
        const API_BASE = 'https://api.sleeper.app/v1';
        const GOOGLE_SHEET_ID = '1MDTf1IouUIrm4qabQT9E5T0FsJhQtmaX55P32XK5c_0';
        const PLAYER_STATS_SHEET_ID = '1i-cKqSfYw0iFiV9S-wBw8lwZePwXZ7kcaWMdnaMTHDs';
        const PLAYER_STATS_SHEETS = { season: 'SZN', seasonRanks: 'SZN_RKs', weeks: { 1: 'WK1', 2: 'WK2', 3: 'WK3', 4: 'WK4', 5: 'WK5', 6: 'WK6', 7: 'WK7', 8: 'WK8', 9: 'WK9' } };
        // UPDATE THIS: Total number of weeks to display in game logs (including unplayed weeks with projections)
        const MAX_DISPLAY_WEEKS = 17;
        const TAG_COLORS = { QB:"var(--pos-qb)", RB:"var(--pos-rb)", WR:"var(--pos-wr)", TE:"var(--pos-te)", BN:"var(--pos-bn)", TX:"var(--pos-tx)", FLX: "var(--pos-flx)", SFLX: "var(--pos-sflx)" };
        const INJURY_DESIGNATION_COLORS = {
            'IR': '#d93d76',
            'BYE': '#C3A8FB',
            'Q': '#fd9a3dff',
            'D': '#e780c3ff',
            'PUP': '#D47DC6',
            'DNP': '#e780c3ff',
            'OUT': '#D47DC6'
        };
        function parseInjuryDesignation(rawValue) {
            if (rawValue === undefined || rawValue === null) return null;
            const trimmed = String(rawValue).trim();
            if (!trimmed) return null;
            const upper = trimmed.toUpperCase();
            if (upper === 'NA' || upper === 'N/A' || upper === 'UNDEFINED' || upper === 'NULL') return null;
            const numericPattern = /^-?\d+(?:\.\d+)?$/;
            if (numericPattern.test(trimmed)) return null;
            const primaryToken = upper.split(/\s+/)[0]?.replace(/[^A-Z]/g, '') || '';
            if (!primaryToken) return null;
            const color = INJURY_DESIGNATION_COLORS[primaryToken] || 'var(--color-text-secondary)';
            return { designation: primaryToken, color, raw: trimmed };
        }
        const STARTER_ORDER = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'SUPER_FLEX'];
        const TEAM_COLORS = { ARI:"#97233F", ATL:"#A71930", BAL:"#241773", BUF:"#00338D", CAR:"#0085CA", CHI:"#1a2d4e", CIN:"#FB4F14", CLE:"#311D00", DAL:"#003594", DEN:"#FB4F14", DET:"#0076B6", GB:"#203731", HOU:"#03202F", IND:"#002C5F", JAX:"#006778", KC:"#E31837", LAC:"#0080C6", LAR:"#003594", LV:"#A5ACAF", MIA:"#008E97", MIN:"#4F2683", NE:"#002244", NO:"#D3BC8D", NYG:"#0B2265", NYJ:"#125740", PHI:"#004C54", PIT:"#FFB612", SEA:"#69BE28", SF:"#B3995D", TB:"#D50A0A", TEN:"#4B92DB", WAS:"#5A1414", FA: "#64748b" };
      const LEAGUE_COLOR_PALETTE = [
          '#9a99f2',
          '#77b6fb',
          '#f2a8ff',
          '#a0f1da',
          '#96d7ff',
          '#c879ff',
          '#bbdbfe',
          '#8b79d9',
          '#63d4cc',
          '#eabaf6'
        ];
            const RY_COLOR_PALETTE = ['#d7f2ff', '#cfe9ff', '#e0f6ea', '#fff1d6', '#efe2ff', '#ffe0ea', '#e4f0ff'];
              const LEAGUE_ABBR_OVERRIDES = {
            "ff d-league": "DL",
            "the most important league": "TMIL",
            "big boofers club bbc": "BBC",
            "trade hoard eat league": "THE",
            "dynasty footballers": "DFB", "la leaguaaa dynasty est2024": "LLGA",
            "la leaugaaa dynasty est2024": "LLGA"
        };
        function getCurrentNflWeekNumber() {
            if (Number.isFinite(state.currentNflWeek)) return state.currentNflWeek;
            const liveWeeks = Object.keys(state.liveWeeklyStats || {}).map(Number).filter(Number.isFinite);
            const sheetWeeks = Object.keys(state.weeklyStats || {}).map(Number).filter(Number.isFinite);
            const projectionWeeks = state.playerProjectionWeeks || {};
            const nonProjectionSheetWeeks = sheetWeeks.filter(week => projectionWeeks[week] !== true);
            const allWeeks = [...liveWeeks, ...nonProjectionSheetWeeks];
            if (allWeeks.length === 0) return null;
            return Math.max(...allWeeks);
        }
        // --- Event Listeners ---
        if (pageType === 'rosters') {
            leagueSelect?.addEventListener('change', (e) => {
                handleLeagueSelect(e);
                if (e && e.target && e.target.blur) e.target.blur();
            });
            rosterGrid?.addEventListener('click', handleTeamSelect);
            mainContent?.addEventListener('click', handleAssetClickForTrade);
            tradeSimulator.addEventListener('click', (e) => {
                const compareButton = e.target.closest('#comparePlayersButton');
                if (compareButton) {
                    const isModalOpen = !playerComparisonModal.classList.contains('hidden');
                    if (isModalOpen) {
                        closeComparisonModal();
                    } else {
                        const selectedPlayers = state.isStartSitMode
                            ? state.startSitSelections
                            : Object.values(state.tradeBlock).flat().filter(asset => asset.pos !== 'DP');
                        if (selectedPlayers.length !== 2) {
                            showTemporaryTooltip(compareButton, 'Please select exactly 2 players to compare.');
                        } else {
                            handlePlayerCompare(e);
                        }
                    }
                }
            });
            compareButton?.addEventListener('click', handleCompareClick);
            positionalViewBtn?.addEventListener('click', () => setRosterView('positional'));
            lineupViewBtn?.addEventListener('click', () => setRosterView('lineup'));
            
            // View dropdown handlers (mobile)
            viewDropdownToggle?.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = viewDropdownToggle.getAttribute('aria-expanded') === 'true';
                if (isOpen) {
                    closeViewDropdown();
                } else {
                    openViewDropdown();
                }
            });

            viewDropdownMenu?.addEventListener('click', (e) => {
                const option = e.target.closest('.view-dropdown-option');
                if (!option) return;
                const view = option.dataset.view;
                if (view) {
                    setRosterView(view);
                    closeViewDropdown();
                }
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!viewDropdownMenu || !viewDropdownToggle) return;
                if (viewDropdownMenu.classList.contains('hidden')) return;
                if (!viewDropdownMenu.contains(e.target) && !viewDropdownToggle.contains(e.target)) {
                    closeViewDropdown();
                }
            });

            // Close dropdown on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && viewDropdownMenu && !viewDropdownMenu.classList.contains('hidden')) {
                    closeViewDropdown();
                }
            });
            
            positionalFiltersContainer?.addEventListener('click', handlePositionFilter);
            clearFiltersButton?.addEventListener('click', handleClearFilters);
            startSitButton?.addEventListener('click', handleStartSitButtonClick);
            if (gameLogsModal) {
                modalCloseBtn.addEventListener('click', () => closeModal());
                modalOverlay.addEventListener('click', () => closeModal());
                
                // Panel toggle buttons with tab-like behavior
                modalInfoBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        const targetPanel = btn.getAttribute('data-panel');
                        const overlayContainers = {
                            'stats-key': statsKeyContainer,
                            'radar-chart': radarChartContainer,
                            'news': newsContainer
                        };
                        
                        // Special handling for game-logs - can't be toggled off
                        if (targetPanel === 'game-logs') {
                            // Hide all overlay panels to show game logs underneath
                            Object.values(overlayContainers).forEach(container => {
                                if (container) container.classList.add('hidden');
                            });
                            
                            // Update button active states
                            modalInfoBtns.forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            return;
                        }
                        
                        // Check if the clicked overlay panel is currently visible
                        const isCurrentlyVisible = overlayContainers[targetPanel] && 
                                                   !overlayContainers[targetPanel].classList.contains('hidden');
                        
                        // For overlay panels (stats-key, radar-chart, news)
                        if (isCurrentlyVisible) {
                            // Toggling off - return to game-logs view
                            overlayContainers[targetPanel].classList.add('hidden');
                            
                            // Update button active states - activate game-logs
                            modalInfoBtns.forEach(b => {
                                b.classList.remove('active');
                                if (b.getAttribute('data-panel') === 'game-logs') {
                                    b.classList.add('active');
                                }
                            });
                        } else {
                            // Opening a new overlay panel - hide other overlays first
                            Object.values(overlayContainers).forEach(container => {
                                if (container) container.classList.add('hidden');
                            });
                            
                            // Show the target overlay panel
                            overlayContainers[targetPanel].classList.remove('hidden');
                            
                            // Update button active states
                            modalInfoBtns.forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            
                            // If opening radar chart panel, render chart
                            if (targetPanel === 'radar-chart' && state.currentGameLogsPlayer) {
                                const player = state.currentGameLogsPlayer;
                                if (player && player.pos) {
                                    renderPlayerRadarChart(player.id, player.pos);
                                }
                            }
                        }
                    });
                });
                
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && !gameLogsModal.classList.contains('hidden')) {
                        closeModal();
                    }
                });
            }
            if (playerComparisonModal) {
                const closeBtn = playerComparisonModal.querySelector('.modal-close-btn');
                const overlay = playerComparisonModal.querySelector('.modal-overlay');
                if (closeBtn) closeBtn.addEventListener('click', () => closeComparisonModal());
                if (overlay) overlay.addEventListener('click', () => closeComparisonModal());
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && !playerComparisonModal.classList.contains('hidden')) {
                        closeComparisonModal();
                    }
                });
            }
        }
        // --- Initialization ---
        document.addEventListener('DOMContentLoaded', async () => {
            if (pageType === 'analyzer') return;
            if (pageType === 'research') {
                const params = new URLSearchParams(window.location.search);
                const uname = params.get('username');
                if (uname) {
                    usernameInput.value = uname;
                }
                return;
            }
            
            // For welcome page, just show the screen - no loading needed
            if (pageType === 'welcome') {
                if (welcomeScreen) welcomeScreen.classList.remove('hidden');
                // Prevent mobile keyboard appearing when arriving via nav with ?username=
                try {
                    const params = new URLSearchParams(window.location.search);
                    if (params.has('username')) {
                        try { suppressFocusTemporary(600); } catch (e) {}
                        setTimeout(() => { try { usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {} }, 50);
                    }
                } catch (e) {}
                return;
            }
            
            // Prevent mobile keyboard appearing when arriving via nav with ?username=
            try {
                const params = new URLSearchParams(window.location.search);
                if (params.has('username')) {
                    // enable temporary focus suppression and blur after the page settles
                    try { suppressFocusTemporary(600); } catch (e) {}
                    setTimeout(() => { try { usernameInput?.blur(); if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch (e) {} }, 50);
                }
            } catch (e) {}
            setLoading(true, 'Loading initial data...');
            
            // Stats and Rosters pages defer weekly stats loading for better performance
            const initialDataPromises = (pageType === 'stats' || pageType === 'rosters')
                ? [fetchSleeperPlayers(), fetchDataFromGoogleSheet()]
                : [fetchSleeperPlayers(), fetchDataFromGoogleSheet(), fetchPlayerStatsSheets()];
            
            await Promise.all(initialDataPromises);
            setLoading(false);
            if (welcomeScreen) welcomeScreen.classList.remove('hidden');
            const params = new URLSearchParams(window.location.search);
            const uname = params.get('username');
            if (uname) {
                try { suppressFocusTemporary(600); } catch (e) {}
                usernameInput.value = uname;
                if (pageType === 'rosters') {
                    await handleFetchRosters();
                } else if (pageType === 'ownership') {
                    await handleFetchOwnership();
                }
            }
        });
        
        // --- Mobile League Navigation (Rosters Page Only) ---
        if (pageType === 'rosters') {
            const mobileLeagueNav = document.getElementById('mobile-league-nav');
            const leagueNavPrev = mobileLeagueNav?.querySelector('.league-nav-prev');
            const leagueNavNext = mobileLeagueNav?.querySelector('.league-nav-next');
            const leagueNavSelector = mobileLeagueNav?.querySelector('.league-nav-selector');
            const leagueNavName = mobileLeagueNav?.querySelector('.league-nav-name');
            const leagueSelectionPopup = document.getElementById('league-selection-popup');
            const leaguePopupClose = leagueSelectionPopup?.querySelector('.league-popup-close');
            const leaguePopupOverlay = leagueSelectionPopup?.querySelector('.league-popup-overlay');
            const leaguePopupList = leagueSelectionPopup?.querySelector('.league-popup-list');
            
            let scrollTimeout;
            let isScrolling = false;
            
            // Dim nav panel when scrolling
            function handleScroll() {
                if (!mobileLeagueNav) return;
                
                if (!isScrolling) {
                    mobileLeagueNav.classList.add('scrolling');
                    isScrolling = true;
                }
                
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    mobileLeagueNav.classList.remove('scrolling');
                    isScrolling = false;
                }, 150);
            }
            
            window.addEventListener('scroll', handleScroll, { passive: true });
            
            // Update mobile nav panel with current league
            function updateMobileLeagueNav() {
                if (!mobileLeagueNav || !state.leagues || state.leagues.length === 0) {
                    if (mobileLeagueNav) mobileLeagueNav.classList.add('hidden');
                    return;
                }
                
                // Hide mobile nav when in trade/compare/start-sit mode
                if (state.isCompareMode || state.isStartSitMode) {
                    mobileLeagueNav.classList.add('hidden');
                    return;
                }
                
                mobileLeagueNav.classList.remove('hidden');
                
                const currentIndex = state.leagues.findIndex(l => l.league_id === state.currentLeagueId);
                const currentLeague = state.leagues[currentIndex];
                
                if (currentLeague && leagueNavName) {
                    leagueNavName.textContent = currentLeague.name;
                }
                
                // Enable both arrows for cycling (no longer disable at boundaries)
                if (leagueNavPrev) {
                    leagueNavPrev.disabled = false;
                }
                if (leagueNavNext) {
                    leagueNavNext.disabled = false;
                }
            }
            
            // Navigate to previous league (with cycling)
            async function navigateToPreviousLeague() {
                if (!state.leagues || state.leagues.length === 0) return;
                
                const currentIndex = state.leagues.findIndex(l => l.league_id === state.currentLeagueId);
                
                // Cycle to last league if at the beginning
                const prevIndex = currentIndex <= 0 ? state.leagues.length - 1 : currentIndex - 1;
                const prevLeague = state.leagues[prevIndex];
                state.currentLeagueId = prevLeague.league_id;
                
                // Update league select dropdown
                if (leagueSelect) {
                    leagueSelect.value = prevLeague.league_id;
                }
                
                updateMobileLeagueNav();
                await handleLeagueSelect();
            }
            
            // Navigate to next league (with cycling)
            async function navigateToNextLeague() {
                if (!state.leagues || state.leagues.length === 0) return;
                
                const currentIndex = state.leagues.findIndex(l => l.league_id === state.currentLeagueId);
                
                // Cycle to first league if at the end
                const nextIndex = currentIndex >= state.leagues.length - 1 ? 0 : currentIndex + 1;
                const nextLeague = state.leagues[nextIndex];
                state.currentLeagueId = nextLeague.league_id;
                
                // Update league select dropdown
                if (leagueSelect) {
                    leagueSelect.value = nextLeague.league_id;
                }
                
                updateMobileLeagueNav();
                await handleLeagueSelect();
            }
            
            // Open league selection popup
            function openLeaguePopup() {
                if (!leagueSelectionPopup || !leaguePopupList) return;
                
                // Clear existing list
                leaguePopupList.innerHTML = '';
                
                // Render league options
                state.leagues.forEach(league => {
                    const item = document.createElement('div');
                    item.className = 'league-popup-item';
                    if (league.league_id === state.currentLeagueId) {
                        item.classList.add('active');
                    }
                    
                    item.innerHTML = `
                        <span class="league-popup-item-name">${league.name}</span>
                        <i class="fa-solid fa-check league-popup-item-check"></i>
                    `;
                    
                    item.addEventListener('click', async () => {
                        state.currentLeagueId = league.league_id;
                        
                        // Update league select dropdown
                        if (leagueSelect) {
                            leagueSelect.value = league.league_id;
                        }
                        
                        closeLeaguePopup();
                        updateMobileLeagueNav();
                        await handleLeagueSelect();
                    });
                    
                    leaguePopupList.appendChild(item);
                });
                
                leagueSelectionPopup.classList.remove('hidden');
            }
            
            // Close league selection popup
            function closeLeaguePopup() {
                if (leagueSelectionPopup) {
                    leagueSelectionPopup.classList.add('hidden');
                }
            }
            
            // Event listeners
            leagueNavPrev?.addEventListener('click', navigateToPreviousLeague);
            leagueNavNext?.addEventListener('click', navigateToNextLeague);
            leagueNavSelector?.addEventListener('click', openLeaguePopup);
            leaguePopupClose?.addEventListener('click', closeLeaguePopup);
            leaguePopupOverlay?.addEventListener('click', closeLeaguePopup);
            
            // Close popup on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && leagueSelectionPopup && !leagueSelectionPopup.classList.contains('hidden')) {
                    closeLeaguePopup();
                }
            });
            
            // Expose update function for use after loading leagues
            window.updateMobileLeagueNav = updateMobileLeagueNav;
        }
        
        // --- View Toggling and Main Handlers ---
        function setRosterView(view) {
    closeComparisonModal();
    hideLegend();
            state.currentRosterView = view;
            const isPositional = view === 'positional';
            
            // Update dropdown toggle display (mobile)
            if (viewDropdownIcon && viewDropdownLabel) {
                if (isPositional) {
                    viewDropdownIcon.className = 'fa-solid fa-users';
                    viewDropdownLabel.textContent = 'View: POS';
                } else {
                    viewDropdownIcon.className = 'fa-solid fa-list-ol';
                    viewDropdownLabel.textContent = 'View: Lineup';
                }
            }
            
            // Update dropdown menu options active state (mobile)
            if (viewDropdownMenu) {
                const options = viewDropdownMenu.querySelectorAll('.view-dropdown-option');
                options.forEach(opt => {
                    opt.classList.toggle('active', opt.dataset.view === view);
                });
            }
            
            // Legacy support for old button-based switcher (desktop)
            if (positionalViewBtn && lineupViewBtn) {
                positionalViewBtn.classList.toggle('active', isPositional);
                lineupViewBtn.classList.toggle('active', !isPositional);
                positionalViewBtn.classList.toggle('counterpart-active', !isPositional);
                lineupViewBtn.classList.toggle('counterpart-active', isPositional);
            }
            
            if (state.currentTeams) {
                renderAllTeamData(state.currentTeams);
            }
        }
        async function handleFetchRosters() {
    hideLegend();
            const username = usernameInput.value.trim();
            if (!username) return;
            setLoading(true, 'Fetching user leagues...');
            try {
                await fetchAndSetUser(username);
                const leagues = await fetchUserLeagues(state.userId);
                state.leagues = leagues.sort((a, b) => a.name.localeCompare(b.name));
                adjustStickyHeaders(); // Recalculate header height for correct padding
                playerListView.classList.add('hidden');
                rosterView.classList.remove('hidden');
                setRosterView('positional'); // Set default view
                populateLeagueSelect(state.leagues);
                const params = new URLSearchParams(window.location.search);
                const preselectId = params.get('leagueId');
                if (state.leagues.length > 0) {
                    if (preselectId && state.leagues.some(l => l.league_id === preselectId)) {
                        leagueSelect.value = preselectId;
                        await handleLeagueSelect();
                    } else {
                        leagueSelect.selectedIndex = 1;
                        await handleLeagueSelect();
                    }
                    // Update mobile league navigation after league is loaded
                    if (typeof window.updateMobileLeagueNav === 'function') {
                        window.updateMobileLeagueNav();
                    }
                }
            } catch (error) {
                handleError(error, username);
            } finally {
                setLoading(false);
                
                // Start loading weekly stats in background for game logs (non-blocking)
                if (!state.statsSheetsLoaded && typeof fetchPlayerStatsSheets === 'function') {
                    fetchPlayerStatsSheets().catch(err => {
                        console.warn('Background load of weekly stats failed:', err);
                    });
                }
            }
        }
        async function handleFetchOwnership() {
            const username = usernameInput.value.trim();
            if (!username) return;
            setLoading(true, 'Fetching ownership data...');
            try {
                await fetchAndSetUser(username);
                rosterView.classList.add('hidden');
                playerListView.classList.remove('hidden');
                await renderPlayerList();
            } catch (error) {
                handleError(error, username);
            } finally {
                setLoading(false);
            }
        }
        async function handleLeagueSelect() {
    hideLegend();
            const leagueId = leagueSelect.value;
            if (state.isStartSitMode) {
                exitStartSitMode();
            }
            if (!leagueId || leagueId === 'Select a league...') {
                rosterView.classList.add('hidden');
                return;
            };
            state.currentLeagueId = leagueId;
            state.calculatedRankCache = null;
            state.matchupDataLoaded = false; // Reset matchup data state
            handleClearCompare(); 
            const leagueInfo = state.leagues.find(l => l.league_id === leagueId);
            const leagueName = leagueInfo?.name || 'league';
            setLoading(true, `Loading ${leagueName}...`);
            rosterGrid.innerHTML = '';
            try {
                const rosterPositions = leagueInfo.roster_positions;
                const superflexSlots = rosterPositions.filter(p => p === 'SUPER_FLEX').length;
                const qbSlots = rosterPositions.filter(p => p === 'QB').length;
                state.isSuperflex = (superflexSlots > 0) || (qbSlots > 1);
                const [rosters, users, tradedPicks] = await Promise.all([
                    fetchWithCache(`${API_BASE}/league/${leagueId}/rosters`),
                    fetchWithCache(`${API_BASE}/league/${leagueId}/users`),
                    fetchWithCache(`${API_BASE}/league/${leagueId}/traded_picks`),
                ]);
                
                // Fetch league-specific matchup data for FPTS/PPG
                await fetchLeagueMatchupData(leagueId);
                
                const teams = processRosterData(rosters, users, tradedPicks, leagueInfo);
                const userTeam = teams.find(team => team.isUserTeam);
                if (userTeam) {
                    state.userTeamName = userTeam.teamName;
                    state.teamsToCompare.add(userTeam.teamName);
                } else {
                    state.userTeamName = null;
                }
                updateCompareButtonState();
                renderAllTeamData(teams);
                rosterView.classList.remove('hidden');
            } catch (error) {
                console.error(`Error loading league ${leagueId}:`, error);
            } finally {
                setLoading(false);
            }
        }
        // --- Compare & Trade Logic ---
        function handleTeamSelect(e) {
            const header = e.target.closest('.team-header-item');
            if (header) {
                if (state.isStartSitMode) {
                    exitStartSitMode();
                }
                const checkbox = header.querySelector('.team-compare-checkbox');
                const teamName = checkbox.dataset.teamName;
                const isSelected = state.teamsToCompare.has(teamName);
                if (isSelected) {
                    // If a team is deselected, hide the trade preview
                    state.teamsToCompare.delete(teamName);
                    checkbox.classList.remove('selected');
                    state.isCompareMode = false;
                    rosterView.classList.remove('is-trade-mode');
                    rosterGrid.classList.remove('is-preview-mode');
                    clearTrade();
                    setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
                    updateHeaderPreviewState(); // call before render
                    if (typeof window.updateMobileLeagueNav === 'function') {
                        window.updateMobileLeagueNav();
                    }
                    renderAllTeamData(state.currentTeams);
                } else {
                    // If a new team is selected
                    if (state.teamsToCompare.size >= 2) {
                        // Prevent selecting more than 2 teams
                        return;
                    }
                    state.teamsToCompare.add(teamName);
                    checkbox.classList.add('selected');
                    if (state.teamsToCompare.size === 2) {
                        // If we now have 2 teams, show the preview
                        state.isCompareMode = true;
                        rosterView.classList.add('is-trade-mode');
                        rosterGrid.classList.add('is-preview-mode');
                        setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
                        updateHeaderPreviewState(); // call before render
                        if (typeof window.updateMobileLeagueNav === 'function') {
                            window.updateMobileLeagueNav();
                        }
                        renderAllTeamData(state.currentTeams);
                        renderTradeBlock();
                    }
                }
                updateCompareButtonState();
            }
        }
        function updateHeaderPreviewState() {
            const appHeader = document.querySelector('.app-header');
            if (appHeader) {
                appHeader.classList.toggle('preview-active', state.isCompareMode || state.isStartSitMode);
            }
        }
        function handleCompareClick() {
            if (state.isStartSitMode) {
                exitStartSitMode();
            }
            state.isCompareMode = !state.isCompareMode;
            rosterView.classList.toggle('is-trade-mode', state.isCompareMode);
            rosterGrid.classList.toggle('is-preview-mode', state.isCompareMode);
            updateCompareButtonState();
            updateHeaderPreviewState(); // call before render
            if (typeof window.updateMobileLeagueNav === 'function') {
                window.updateMobileLeagueNav();
            }
            if (!state.isCompareMode) {
                clearTrade();
                setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
            } else {
                setTimeout(() => window.scrollTo(0, 0), 0); // scroll to top
                renderTradeBlock();
            }
            renderAllTeamData(state.currentTeams);
        }
        function handleStartSitButtonClick() {
            if (state.isStartSitMode) {
                exitStartSitMode();
            } else {
                enterStartSitMode();
            }
        }
        function enterStartSitMode() {
            const teams = state.currentTeams || [];
            const userTeam = teams.find(team => team.teamName === state.userTeamName) || teams.find(team => team.isUserTeam);
            if (!userTeam) {
                if (startSitButton) {
                    showTemporaryTooltip(startSitButton, 'Load your roster first.');
                }
                return;
            }
            if (state.isCompareMode) {
                handleClearCompare();
            }
            startSitButton?.classList.add('active');
            state.isStartSitMode = true;
            state.startSitTeamName = userTeam.teamName;
            state.startSitSelections = [];
            state.startSitNextSide = 'left';
            rosterView.classList.add('is-trade-mode');
            rosterGrid.classList.add('is-preview-mode');
            rosterGrid.classList.add('start-sit-mode');
            try { closeCompareSearch(); } catch (e) {}
            updateHeaderPreviewState();
            if (typeof window.updateMobileLeagueNav === 'function') {
                window.updateMobileLeagueNav();
            }
            setTimeout(() => window.scrollTo(0, 0), 0);
            if (state.currentTeams) {
                renderAllTeamData(state.currentTeams);
            }
            renderTradeBlock();
        }
        function exitStartSitMode() {
            if (!state.isStartSitMode) return;
            state.isStartSitMode = false;
            state.startSitSelections = [];
            state.startSitNextSide = 'left';
            rosterView.classList.remove('is-trade-mode');
            rosterGrid.classList.remove('is-preview-mode');
            rosterGrid.classList.remove('start-sit-mode');
            startSitButton?.classList.remove('active');
            updateHeaderPreviewState();
            if (typeof window.updateMobileLeagueNav === 'function') {
                window.updateMobileLeagueNav();
            }
            try { closeComparisonModal(); } catch (e) {}
            try {
                if (gameLogsModal && !gameLogsModal.classList.contains('hidden')) {
                    closeModal();
                }
            } catch (e) {}
            renderTradeBlock();
            if (state.currentTeams) {
                renderAllTeamData(state.currentTeams);
            }
        }
        function clearStartSitSelections() {
            if (!state.isStartSitMode) return;
            state.startSitSelections = [];
            state.startSitNextSide = 'left';
            document.querySelectorAll('.roster-column.start-sit-column .player-selected').forEach(el => {
                el.classList.remove('player-selected');
                delete el.dataset.startSitSide;
            });
            renderTradeBlock();
        }
        function recalcStartSitNextSide() {
            const count = state.startSitSelections.length;
            if (count === 0) {
                state.startSitNextSide = 'left';
                return;
            }
            if (count === 1) {
                state.startSitNextSide = state.startSitSelections[0].side === 'left' ? 'right' : 'left';
                return;
            }
            state.startSitNextSide = count % 2 === 0 ? 'left' : 'right';
        }
        function getPlayerProjectionForWeek(playerId, week = null) {
            if (!playerId) return { value: null, display: 'NA' };
            const fallbackWeek = getCurrentNflWeekNumber();
            const candidateWeek = Number(week);
            const numericWeek = Number.isFinite(candidateWeek) && candidateWeek > 0
                ? candidateWeek
                : (Number.isFinite(fallbackWeek) && fallbackWeek > 0 ? fallbackWeek : null);
            if (!Number.isFinite(numericWeek)) return { value: null, display: 'NA' };
            const resolveProjection = (statSource) => {
                if (!statSource || !Object.prototype.hasOwnProperty.call(statSource, 'proj')) return null;
                const raw = statSource.proj;
                if (raw === undefined || raw === null) return null;
                const trimmed = String(raw).trim();
                if (!trimmed) return null;
                if (trimmed.toUpperCase() === 'NA') return { value: null, display: 'NA' };
                const numeric = Number.parseFloat(trimmed.replace(/[^0-9.\-]/g, ''));
                const value = Number.isFinite(numeric) ? numeric : null;
                return {
                    value,
                    display: value !== null ? value.toFixed(1) : trimmed
                };
            };
            const sheetResult = resolveProjection(state.playerWeeklyStats?.[numericWeek]?.[playerId]);
            if (sheetResult) return sheetResult;
            const liveResult = resolveProjection(state.liveWeeklyStats?.[numericWeek]?.[playerId]);
            if (liveResult) return liveResult;
            return { value: null, display: 'NA' };
        }
        function getPlayerMatchupForWeek(playerId, week = null) {
            if (!playerId) return null;
            const fallbackWeek = getCurrentNflWeekNumber();
            const candidateWeek = Number(week);
            const numericWeek = Number.isFinite(candidateWeek) && candidateWeek > 0
                ? candidateWeek
                : (Number.isFinite(fallbackWeek) && fallbackWeek > 0 ? fallbackWeek : null);
            if (!Number.isFinite(numericWeek)) return null;
            const extractFromStats = (stats) => {
                if (!stats) return null;
                const opponentRaw = stats.opponent;
                const opponent = typeof opponentRaw === 'string' ? opponentRaw.trim() : '';
                const isBye = opponent.toUpperCase() === 'BYE';
                let rankValue = null;
                const rankRaw = stats.opponent_rank;
                if (typeof rankRaw === 'number' && Number.isFinite(rankRaw)) {
                    rankValue = rankRaw;
                } else if (typeof rankRaw === 'string') {
                    const trimmedRank = rankRaw.trim();
                    if (trimmedRank && trimmedRank.toUpperCase() !== 'NA') {
                        const parsedRank = Number.parseInt(trimmedRank.replace(/[^0-9]/g, ''), 10);
                        if (Number.isFinite(parsedRank)) {
                            rankValue = parsedRank;
                        }
                    }
                }
                const hasOpponent = Boolean(opponent) || isBye;
                const hasRank = Number.isFinite(rankValue);
                if (!hasOpponent && !hasRank) return null;
                const rankDisplay = getRankDisplayText(rankRaw);
                const ordinalDisplay = hasRank ? ordinalSuffix(rankValue) : null;
                const color = hasRank ? getOpponentRankColor(rankValue) : null;
                return {
                    opponent: isBye ? 'BYE' : opponent,
                    opponentRank: hasRank ? rankValue : null,
                    opponentRankDisplay: rankDisplay,
                    opponentOrdinal: ordinalDisplay,
                    color: color || null,
                    isBye
                };
            };
            const sources = [
                state.playerWeeklyStats?.[numericWeek]?.[playerId],
                state.liveWeeklyStats?.[numericWeek]?.[playerId]
            ];
            for (const stats of sources) {
                const matchup = extractFromStats(stats);
                if (matchup) return matchup;
            }
            return null;
        }
        function getUpcomingProjectionDesignation(playerId) {
            if (!playerId) return null;
            const currentWeek = getCurrentNflWeekNumber();
            if (!Number.isFinite(currentWeek)) return null;
            const statSources = [
                state.playerWeeklyStats?.[currentWeek]?.[playerId],
                state.liveWeeklyStats?.[currentWeek]?.[playerId]
            ];
            for (const statSource of statSources) {
                if (!statSource || !Object.prototype.hasOwnProperty.call(statSource, 'proj')) continue;
                const parsed = parseInjuryDesignation(statSource.proj);
                if (!parsed) continue;
                return { designation: parsed.designation, color: parsed.color, week: currentWeek };
            }
            const projectionInfo = getPlayerProjectionForWeek(playerId, currentWeek);
            const fallback = parseInjuryDesignation(projectionInfo?.display);
            if (!fallback) return null;
            return { designation: fallback.designation, color: fallback.color, week: currentWeek };
        }
        function handleStartSitPlayerClick(e) {
            const row = e.target.closest('.player-row');
            if (!row) return;
            const column = row.closest('.roster-column.start-sit-column');
            if (!column) return;
            const teamName = column.dataset.teamName;
            if (!teamName || teamName !== state.startSitTeamName) return;
            const playerId = row.dataset.assetId;
            if (!playerId) return;
            // Toggle selection if already selected
            const existingIndex = state.startSitSelections.findIndex(sel => sel.id === playerId);
            if (existingIndex > -1) {
                state.startSitSelections.splice(existingIndex, 1);
                row.classList.remove('player-selected');
                delete row.dataset.startSitSide;
                recalcStartSitNextSide();
                renderTradeBlock();
                return;
            }
            if (state.startSitSelections.length >= 2) {
                showTemporaryTooltip(row, 'Select up to two players.');
                return;
            }
            const ranks = calculatePlayerStatsAndRanks(playerId) || getDefaultPlayerRanks();
            const activeWeek = getCurrentNflWeekNumber();
            const rawPpg = typeof ranks.ppg === 'number' ? ranks.ppg : Number.parseFloat(String(ranks.ppg || '').replace(/[^0-9.\-]/g, ''));
            const hasPpg = Number.isFinite(rawPpg);
            const ppgValue = hasPpg ? Number(rawPpg) : null;
            const ppgDisplay = hasPpg ? ppgValue.toFixed(1) : 'NA';
            const rawPpgRank = Number.parseInt(String(ranks.ppgPosRank || '').replace(/[^0-9]/g, ''), 10);
            const hasPpgRank = Number.isFinite(rawPpgRank) && rawPpgRank > 0;
            const basePosRaw = (row.dataset.assetBasePos || '').toUpperCase();
            const displayPos = (row.dataset.assetPos || basePosRaw || '').toUpperCase();
            const normalizedBasePos = basePosRaw || displayPos || '';
            const rankDisplay = normalizedBasePos
                ? (hasPpgRank ? `${normalizedBasePos}·${rawPpgRank}` : `${normalizedBasePos}·NA`)
                : (hasPpgRank ? `${rawPpgRank}` : 'NA');
            const projectionInfo = getPlayerProjectionForWeek(playerId, activeWeek);
            const projectionValue = projectionInfo?.value ?? null;
            const projectionDisplay = projectionInfo?.display || 'NA';
            const matchupInfo = getPlayerMatchupForWeek(playerId, activeWeek);
            const selection = {
                id: playerId,
                label: row.dataset.assetLabel || row.querySelector('.player-name-clickable')?.textContent || 'Unknown Player',
                pos: displayPos || normalizedBasePos || '',
                basePos: normalizedBasePos,
                team: row.dataset.assetTeam || 'FA',
                side: state.startSitNextSide,
                ppg: ppgValue,
                ppgDisplay,
                ppgPosRank: hasPpgRank ? rawPpgRank : null,
                ppgPosRankDisplay: rankDisplay,
                projection: projectionValue,
                projectionDisplay,
                matchup: matchupInfo
            };
            state.startSitSelections.push(selection);
            row.classList.add('player-selected');
            row.dataset.startSitSide = selection.side;
            state.startSitNextSide = selection.side === 'left' ? 'right' : 'left';
            renderTradeBlock();
        }
        function handleClearCompare(keepUserTeam = false) {
            const userTeamName = state.currentTeams?.find(team => team.isUserTeam)?.teamName;
            const teamsToKeep = new Set();
            if (keepUserTeam && userTeamName && state.teamsToCompare.has(userTeamName)) {
                teamsToKeep.add(userTeamName);
            }
            state.teamsToCompare = teamsToKeep;
            state.isCompareMode = false;
            rosterView.classList.remove('is-trade-mode');
            rosterGrid.classList.remove('is-preview-mode');
            updateCompareButtonState();
            clearTrade();
            window.scrollTo(0, 0); // scroll to top
            updateHeaderPreviewState(); // call before render
            if (typeof window.updateMobileLeagueNav === 'function') {
                window.updateMobileLeagueNav();
            }
            if (state.currentTeams) {
                renderAllTeamData(state.currentTeams);
            }
        }
        function lockCompareButtonSize() {
            if (!compareButton) return;
            if (compareButton.style.width && compareButton.style.height) {
                return;
            }
            const rect = compareButton.getBoundingClientRect();
            compareButton.style.width = `${rect.width}px`;
            compareButton.style.height = `${rect.height}px`;
        }
        function unlockCompareButtonSize() {
            if (!compareButton) return;
            compareButton.style.width = '';
            compareButton.style.height = '';
        }
        function updateCompareButtonState() {
            if (!compareButton) {
                return;
            }
            const count = state.teamsToCompare.size;
            compareButton.disabled = count < 2;
            if (count > 1) {
                compareButton.classList.add('glow-on-select');
            } else {
                compareButton.classList.remove('glow-on-select');
            }
            if (state.isCompareMode) {
                lockCompareButtonSize();
                compareButton.innerHTML = COMPARE_BUTTON_SHOW_ALL_HTML;
                compareButton.classList.add('active', 'compare-show-all');
                compareButton.classList.remove('glow-on-select');
            } else {
                compareButton.innerHTML = COMPARE_BUTTON_PREVIEW_HTML;
                compareButton.classList.remove('active');
                compareButton.classList.remove('compare-show-all');
                unlockCompareButtonSize();
            }
            if (count < 2 && state.isCompareMode) {
                handleCompareClick(); // Automatically exit compare mode
            }
        }
        function openCompareSearch() {
            if (!compareSearchPopover || !compareSearchToggle || !compareSearchInput) {
                return;
            }
            compareSearchPopover.classList.remove('hidden');
            compareSearchToggle.setAttribute('aria-expanded', 'true');
            compareSearchInput.focus();
        }
        function closeCompareSearch() {
            if (!compareSearchPopover || !compareSearchToggle || !compareSearchInput) {
                return;
            }
            compareSearchPopover.classList.add('hidden');
            compareSearchToggle.setAttribute('aria-expanded', 'false');
            compareSearchInput.value = '';
            filterTeamsByQuery('');
            if (document.activeElement === compareSearchInput) {
                compareSearchToggle.focus();
            }
        }
        function openViewDropdown() {
            if (!viewDropdownMenu || !viewDropdownToggle) return;
            viewDropdownMenu.classList.remove('hidden');
            viewDropdownToggle.setAttribute('aria-expanded', 'true');
        }
        function closeViewDropdown() {
            if (!viewDropdownMenu || !viewDropdownToggle) return;
            viewDropdownMenu.classList.add('hidden');
            viewDropdownToggle.setAttribute('aria-expanded', 'false');
        }
        function filterTeamsByQuery(q) {
            if (!rosterGrid) {
                return;
            }
            const query = (q || '').trim().toLowerCase();
            const rosterColumns = rosterGrid.querySelectorAll('.roster-column');
            rosterColumns.forEach(column => {
                const playerRows = column.querySelectorAll('.player-row');
                let hasMatch = false;
                playerRows.forEach(row => {
                    const playerName = (row.dataset.playerName || row.dataset.assetLabel || '').toLowerCase();
                    const matches = !query || playerName.includes(query);
                    row.classList.toggle('compare-search-hidden', Boolean(query) && !matches);
                    if (matches) {
                        hasMatch = true;
                    }
                });
                const sections = column.querySelectorAll('.roster-section');
                sections.forEach(section => {
                    const visiblePlayer = section.querySelector('.player-row:not(.compare-search-hidden)');
                    section.classList.toggle('compare-search-hidden', Boolean(query) && !visiblePlayer);
                });
                const pickRows = column.querySelectorAll('.pick-row');
                pickRows.forEach(row => {
                    row.classList.toggle('compare-search-hidden', Boolean(query));
                });
                column.classList.toggle('compare-search-hidden', Boolean(query) && !hasMatch);
            });
        }
        let searchDebounce;
        compareSearchToggle?.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = compareSearchToggle.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                closeCompareSearch();
            } else {
                openCompareSearch();
            }
        });
        document.addEventListener('click', (e) => {
            if (!compareSearchPopover || !compareSearchToggle) {
                return;
            }
            if (compareSearchPopover.classList.contains('hidden')) {
                return;
            }
            if (!compareSearchPopover.contains(e.target) && !compareSearchToggle.contains(e.target)) {
                closeCompareSearch();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeCompareSearch();
            }
        });
        compareSearchInput?.addEventListener('input', (e) => {
            const val = e.target.value;
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => filterTeamsByQuery(val), 120);
        });
        compareSearchClose?.addEventListener('click', (e) => {
            e.stopPropagation();
            closeCompareSearch();
            compareSearchToggle?.focus();
        });
        function handleAssetClickForTrade(e) {
            if (state.isStartSitMode) {
                handleStartSitPlayerClick(e);
                return;
            }
            if (!state.isCompareMode) return;
            const assetRow = e.target.closest('.player-row, .pick-row');
            if (!assetRow) return;
            const teamName = assetRow.closest('.roster-column')?.dataset.teamName;
            if (!teamName || !state.teamsToCompare.has(teamName)) return;
            const { assetId, assetLabel, assetKtc, assetPos, assetBasePos, assetTeam } = assetRow.dataset;
            if (!assetId) return;
            if (!state.tradeBlock[teamName]) {
                state.tradeBlock[teamName] = [];
            }
            const assetIndex = state.tradeBlock[teamName].findIndex(a => a.id === assetId);
            if (assetIndex > -1) {
                state.tradeBlock[teamName].splice(assetIndex, 1);
                assetRow.classList.remove('player-selected');
            } else {
                state.tradeBlock[teamName].push({
                    id: assetId,
                    label: assetLabel,
                    ktc: parseInt(assetKtc, 10) || 0,
                    pos: assetPos,
                    basePos: assetBasePos || assetPos,
                    team: assetTeam || ''
                });
                assetRow.classList.add('player-selected');
            }
            renderTradeBlock();
        }
        function clearTrade() {
            state.tradeBlock = {};
            document.querySelectorAll('.player-selected').forEach(el => el.classList.remove('player-selected'));
            renderTradeBlock();
            closeComparisonModal();
        }
        // --- Position Filter Logic ---
        
        // Debounce helper for performance
        let renderDebounceTimer = null;
        function debouncedRenderAllTeamData(teams, delay = 0) {
            if (renderDebounceTimer) clearTimeout(renderDebounceTimer);
            if (delay === 0) {
                renderAllTeamData(teams);
            } else {
                renderDebounceTimer = setTimeout(() => renderAllTeamData(teams), delay);
            }
        }
        
        function handleClearFilters() {
            closeComparisonModal();
            state.activePositions.clear();
            updatePositionFilterButtons();
            debouncedRenderAllTeamData(state.currentTeams);
            clearFiltersButton.classList.remove('active');
        }
        function handlePositionFilter(e) {
            closeComparisonModal();
            const button = e.target.closest('.filter-btn');
            if (!button) return;
            const position = button.dataset.position;
            const flexPositions = ['RB', 'WR', 'TE'];
   if (position === 'FLX') {
                const isActivating = !state.activePositions.has('FLX');
                const starFilterIsActive = state.activePositions.has('STAR');
                state.activePositions.clear();
                if (starFilterIsActive) {
                    state.activePositions.add('STAR');
                }
                if (isActivating) {
                    flexPositions.forEach(p => state.activePositions.add(p));
                    state.activePositions.add('FLX');
                }
            } else if (position === 'STAR') {
                if (state.activePositions.has('STAR')) {
                    state.activePositions.delete('STAR');
                } else {
                    state.activePositions.add('STAR');
                }
            } else {
                state.activePositions.delete('FLX');
                if (state.activePositions.has(position)) {
                    state.activePositions.delete(position);
                } else {
                    state.activePositions.add(position);
                }
            }
            updatePositionFilterButtons();
            debouncedRenderAllTeamData(state.currentTeams);
            clearFiltersButton.classList.toggle('active', state.activePositions.size > 0);
        }
        function updatePositionFilterButtons() {
            const buttons = positionalFiltersContainer.querySelectorAll('.filter-btn');
            buttons.forEach(btn => {
                const pos = btn.dataset.position;
                btn.classList.toggle('active', state.activePositions.has(pos));
            });
        }
        // --- Data Fetching & Processing ---
        async function fetchAndSetUser(username) {
            const userRes = await fetchWithCache(`${API_BASE}/user/${username}`);
            if (!userRes || !userRes.user_id) throw new Error('User not found.');
            state.userId = userRes.user_id;
        }
        async function fetchUserLeagues(userId) {
            const currentYear = new Date().getFullYear();
            const leaguesRes = await fetchWithCache(`${API_BASE}/user/${userId}/leagues/nfl/${currentYear}`);
            if (!leaguesRes || leaguesRes.length === 0) throw new Error(`No leagues found for this user for ${currentYear}.`);
            return leaguesRes;
        }
        async function fetchSleeperPlayers() {
            try {
                state.players = await fetchWithCache(`${API_BASE}/players/nfl`);
                state.calculatedRankCache = null;
            } catch (e) { console.error("Failed to fetch Sleeper players:", e); }
        }
        async function fetchGameLogs(playerId) {
            if (!state.statsSheetsLoaded) {
                await fetchPlayerStatsSheets();
            } else {
                await ensureSleeperLiveStats();
            }
            const allWeeklyStats = [];
            const weeklyStats = getCombinedWeeklyStats();
            const weeks = Object.keys(weeklyStats).map(Number).sort((a, b) => a - b);
            weeks.forEach(week => {
                const statsForWeek = weeklyStats[week]?.[playerId];
                if (statsForWeek) {
                    allWeeklyStats.push({ week, stats: statsForWeek });
                }
            });
            return allWeeklyStats;
        }
        function getDefaultPlayerRanks() {
            return {
                total_pts: '0.00',
                overallRank: 'NA',
                posRank: 'NA',
                ppg: '0.00',
                ppgOverallRank: 'NA',
                ppgPosRank: 'NA',
            };
        }
        function formatRankValue(rank) {
            if (typeof rank !== 'number' || !Number.isFinite(rank) || rank <= 0) {
                return 'NA';
            }
            return rank > 999 ? 'NA' : rank;
        }
        function buildCalculatedRankCache(scoringSettings, leagueId, scoringHash) {
            const playersById = {};
            for (const pId in state.players) {
                playersById[pId] = {
                    id: pId,
                    pos: state.players[pId]?.position || 'N/A',
                    totalPts: 0,
                    gamesPlayed: 0,
                    ppg: 0,
                    overallRank: null,
                    posRank: null,
                    ppgOverallRank: null,
                    ppgPosRank: null,
                };
            }
            
            // If matchup data is loaded, use it directly for FPTS/PPG calculation
            if (state.matchupDataLoaded && state.leagueMatchupStats) {
                for (const week of Object.keys(state.leagueMatchupStats)) {
                    const weekData = state.leagueMatchupStats[week];
                    for (const [pId, points] of Object.entries(weekData)) {
                        const playerEntry = playersById[pId];
                        if (!playerEntry) continue;
                        
                        playerEntry.totalPts += points;
                        if (points > 0) {
                            playerEntry.gamesPlayed += 1;
                        }
                    }
                }
            } else {
                // Fallback: use combined weekly stats from Google Sheets
                const combinedWeeklyStats = getCombinedWeeklyStats();
                for (const week of Object.keys(combinedWeeklyStats)) {
                    const weeklyData = combinedWeeklyStats[week];
                    for (const [pId, statLine] of Object.entries(weeklyData)) {
                        const playerEntry = playersById[pId];
                        if (!playerEntry) continue;
                        
                        const points = calculateFantasyPoints(statLine, scoringSettings);
                        
                        playerEntry.totalPts += points;
                        if (points > 0) {
                            playerEntry.gamesPlayed += 1;
                        }
                    }
                }
            }
            
            const entries = Object.values(playersById);
            entries.forEach(entry => {
                entry.ppg = entry.gamesPlayed > 0 ? entry.totalPts / entry.gamesPlayed : 0;
            });
            
            // Filter players with actual game data for overall rankings
            const playersWithGames = entries.filter(e => e.gamesPlayed > 0 && e.totalPts > 0);
            
            const totalSorted = playersWithGames.slice().sort((a, b) => b.totalPts - a.totalPts);
            totalSorted.forEach((entry, index) => {
                entry.overallRank = index + 1;
            });
            const posGroups = new Map();
            entries.forEach(entry => {
                const posKey = entry.pos || 'N/A';
                if (!posGroups.has(posKey)) posGroups.set(posKey, []);
                posGroups.get(posKey).push(entry);
            });
            posGroups.forEach(group => {
                // Filter for position ranks too
                const playersWithGamesInPos = group.filter(e => e.gamesPlayed > 0 && e.totalPts > 0);
                playersWithGamesInPos.slice().sort((a, b) => b.totalPts - a.totalPts).forEach((entry, index) => {
                    entry.posRank = index + 1;
                });
                playersWithGamesInPos.slice().sort((a, b) => b.ppg - a.ppg).forEach((entry, index) => {
                    entry.ppgPosRank = index + 1;
                });
            });
            const ppgSorted = playersWithGames.slice().sort((a, b) => b.ppg - a.ppg);
            ppgSorted.forEach((entry, index) => {
                entry.ppgOverallRank = index + 1;
            });
            const cache = {};
            entries.forEach(entry => {
                cache[entry.id] = {
                    total_pts: entry.totalPts.toFixed(1),
                    overallRank: formatRankValue(entry.overallRank),
                    posRank: formatRankValue(entry.posRank),
                    ppg: entry.ppg.toFixed(1),
                    ppgOverallRank: formatRankValue(entry.ppgOverallRank),
                    ppgPosRank: formatRankValue(entry.ppgPosRank),
                };
            });
            return { leagueId, scoringHash, players: cache };
        }
        function calculatePlayerStatsAndRanks(playerId) {
            const league = state.leagues.find(l => l.league_id === state.currentLeagueId);
            if (!league) return getDefaultPlayerRanks();
            const scoringSettings = league.scoring_settings || {};
            const scoringHash = JSON.stringify(scoringSettings || {});
            if (!state.calculatedRankCache || state.calculatedRankCache.leagueId !== state.currentLeagueId || state.calculatedRankCache.scoringHash !== scoringHash) {
                state.calculatedRankCache = buildCalculatedRankCache(scoringSettings, league.league_id, scoringHash);
            }
            return state.calculatedRankCache.players[playerId] || getDefaultPlayerRanks();
        }
        function getStatsPagePlayerRanks(playerId) {
            // ONLY called when state.isGameLogFromStatsPage === true
            // Uses season totals and calculated ranks from STAT_1QB/STAT_SFLX sheets passed by stats.js
            const statsData = state.statsPagePlayerData;
            
            if (!statsData) return getDefaultPlayerRanks();
            
            const fpts = statsData.fpts || 0;
            const ppg = statsData.ppg || 0;
            const gamesPlayed = statsData.gamesPlayed || 0;
            
            // Use the calculated ranks passed from stats.js
            const posRank = statsData.posRank || null;
            const overallRank = statsData.overallRank || null;
            const ppgPosRank = statsData.ppgPosRank || null;
            const ppgOverallRank = statsData.ppgOverallRank || null;
            
            return {
                total_pts: fpts.toFixed(1),
                ppg: ppg.toFixed(1),
                posRank: posRank,
                overallRank: overallRank,
                ppgPosRank: ppgPosRank,
                ppgOverallRank: ppgOverallRank,
                gamesPlayed: gamesPlayed
            };
        }
        async function fetchDataFromGoogleSheet() {
            const sheetNames = { oneQb: 'KTC_1QB', sflx: 'KTC_SFLX' };
            try {
                const [oneQbCsv, sflxCsv] = await Promise.all([
                    fetch(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetNames.oneQb}`).then(res => res.text()),
                    fetch(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetNames.sflx}`).then(res => res.text())
                ]);
                state.oneQbData = parseSheetData(oneQbCsv);
                state.sflxData = parseSheetData(sflxCsv);
            } catch (e) { console.error("Fatal Error: Could not fetch data from Google Sheet.", e); }
        }
        function parseSheetData(csvText) {
            const dataMap = {};
            const { headers, rows } = parseCsv(csvText);
            if (!headers.length || !rows.length) return dataMap;
            const normalizedHeaders = headers.map(normalizeHeader);
            const headerIndex = new Map();
            normalizedHeaders.forEach((header, idx) => {
                headerIndex.set(header.toUpperCase(), idx);
            });
            const normalizeKey = (key) => normalizeHeader(key).toUpperCase();
            const getColumnValue = (columns, names) => {
                const keys = Array.isArray(names) ? names : [names];
                for (const name of keys) {
                    const idx = headerIndex.get(normalizeKey(name));
                    if (idx !== undefined) {
                        const value = columns[idx];
                        if (value !== undefined) return value.trim();
                    }
                }
                return '';
            };
            const toFloat = (value) => {
                const num = parseFloat(value);
                return Number.isNaN(num) ? null : num;
            };
            const toInt = (value) => {
                const num = parseInt(value, 10);
                return Number.isNaN(num) ? null : num;
            };
            rows.forEach(columns => {
                const pos = getColumnValue(columns, 'POS');
                const sleeperId = getColumnValue(columns, 'SLPR_ID');
                const ktcValue = toInt(getColumnValue(columns, ['VALUE', 'KTC']));
                const adp = toFloat(getColumnValue(columns, 'ADP'));
                const posRank = getColumnValue(columns, ['POS·RK', 'POS RK', 'POS_RK']);
                const age = toFloat(getColumnValue(columns, 'AGE'));
                const overallRank = toInt(getColumnValue(columns, ['RANK', 'OVR', 'OVERALL']));
                if (pos === 'RDP') {
                    const pickName = getColumnValue(columns, 'PLAYER NAME');
                    if (pickName) {
                        dataMap[pickName] = {
                            adp: null,
                            ktc: ktcValue,
                            posRank: null,
                            overallRank: null
                        };
                    }
                    return;
                }
                if (!sleeperId || sleeperId === 'NA') return;
                dataMap[sleeperId] = {
                    age: age,
                    adp: adp,
                    ktc: ktcValue,
                    posRank: posRank || null,
                    overallRank: overallRank
                };
            });
            return dataMap;
        }
        async function fetchPlayerStatsSheets() {
            if (state.statsSheetsLoaded) {
                await ensureSleeperLiveStats();
                return;
            }
            try {
                const seasonPromise = fetch(`https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${PLAYER_STATS_SHEETS.season}`).then(res => res.text());
                const seasonRanksPromise = fetch(`https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${PLAYER_STATS_SHEETS.seasonRanks}`).then(res => res.text());
                // Fetch stats for completed weeks (from PLAYER_STATS_SHEETS.weeks)
                const weeklyPromises = Object.entries(PLAYER_STATS_SHEETS.weeks).map(async ([week, sheetName]) => {
                    const csv = await fetch(`https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`).then(res => res.text());
                    return { week: Number(week), csv, hasFullStats: true };
                });
                // Fetch projection data for remaining weeks up to MAX_DISPLAY_WEEKS
                const completedWeeks = Object.keys(PLAYER_STATS_SHEETS.weeks).map(Number);
                const maxCompletedWeek = completedWeeks.length > 0 ? Math.max(...completedWeeks) : 0;
                const projectionPromises = [];
                for (let week = maxCompletedWeek + 1; week <= MAX_DISPLAY_WEEKS; week++) {
                    const sheetName = `WK${week}`;
                    projectionPromises.push(
                        fetch(`https://docs.google.com/spreadsheets/d/${PLAYER_STATS_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheetName}`)
                            .then(res => res.text())
                            .then(csv => ({ week, csv, hasFullStats: false }))
                            .catch(() => ({ week, csv: null, hasFullStats: false })) // Handle missing sheets gracefully
                    );
                }
                const [seasonCsv, seasonRanksCsv, ...allWeeklyCsvs] = await Promise.all([seasonPromise, seasonRanksPromise, ...weeklyPromises, ...projectionPromises]);
                state.playerSeasonStats = parseSeasonStatsCsv(seasonCsv);
                state.playerSeasonRanks = parseSeasonRanksCsv(seasonRanksCsv);
                state.seasonRankCache = computeSeasonRankings(state.playerSeasonStats);
                const weeklyStats = {};
                const projectionWeeks = {};
                allWeeklyCsvs.forEach(({ week, csv, hasFullStats }) => {
                    if (csv) {
                        weeklyStats[week] = parseWeeklyStatsCsv(csv);
                        if (!hasFullStats) {
                            projectionWeeks[week] = true; // Mark this week as projection-only
                        }
                    }
                });
                state.playerWeeklyStats = weeklyStats;
                state.weeklyStats = weeklyStats;
                state.playerProjectionWeeks = projectionWeeks;
                state.statsSheetsLoaded = true;
                state.liveStatsLoaded = false;
                state.calculatedRankCache = null;
                await ensureSleeperLiveStats();
            } catch (error) {
                console.error('Failed to fetch player stats from sheet.', error);
                state.playerSeasonStats = {};
                state.playerSeasonRanks = {};
                state.playerWeeklyStats = {};
                state.weeklyStats = {};
                state.playerProjectionWeeks = {};
                state.seasonRankCache = null;
                state.statsSheetsLoaded = false;
                state.liveWeeklyStats = {};
                state.liveStatsLoaded = true;
                state.calculatedRankCache = null;
            }
        }
        async function ensureSleeperLiveStats(force = false) {
            if (!force && state.liveStatsLoaded) {
                const knownWeek = state.currentNflWeek;
                const lastFetchedWeek = state.lastLiveStatsWeek;
                if (Number.isFinite(knownWeek) && knownWeek === lastFetchedWeek) {
                    const now = Date.now();
                    if (state.lastLiveStatsFetchTs && (now - state.lastLiveStatsFetchTs) < 5 * 60 * 1000) {
                        return;
                    }
                }
            }
            await fetchSleeperLiveStats();
        }
        async function fetchSleeperLiveStats() {
            const sheetWeeks = Object.keys(state.playerWeeklyStats || {}).map(week => Number(week)).filter(week => Number.isFinite(week));
            const latestSheetWeek = sheetWeeks.length > 0 ? Math.max(...sheetWeeks) : 0;
            const existingLiveStats = state.liveWeeklyStats && typeof state.liveWeeklyStats === 'object'
                ? Object.keys(state.liveWeeklyStats).reduce((acc, week) => {
                    const weekStats = state.liveWeeklyStats[week];
                    if (!weekStats || typeof weekStats !== 'object') return acc;
                    acc[week] = { ...weekStats };
                    return acc;
                }, {})
                : {};
            try {
                const response = await fetch(`${API_BASE}/state/nfl`);
                if (!response.ok) throw new Error(`Sleeper state request failed: ${response.status}`);
                const sleeperState = await response.json();
                const season = sleeperState?.season || null;
                const currentWeek = Number(sleeperState?.week);
                state.currentNflSeason = season;
                state.currentNflWeek = Number.isFinite(currentWeek) ? currentWeek : null;
                if (!season || !Number.isFinite(currentWeek) || currentWeek <= 0) {
                    state.liveWeeklyStats = existingLiveStats;
                    return;
                }
                const liveWeeklyStats = { ...existingLiveStats };
                const fetchStartWeek = Math.max(Math.min(latestSheetWeek + 1, currentWeek), 1);
                for (let week = fetchStartWeek; week <= currentWeek; week++) {
                    try {
                        const statsResponse = await fetch(`${API_BASE}/stats/nfl/regular/${season}/${week}`);
                        if (!statsResponse.ok) throw new Error(`Sleeper stats request failed: ${statsResponse.status}`);
                        const statsData = await statsResponse.json();
                        if (!statsData || typeof statsData !== 'object') continue;
                        const weekStats = {};
                        for (const [playerId, statLine] of Object.entries(statsData)) {
                            if (!statLine) continue;
                            const override = Number(statLine?.pts_ppr ?? statLine?.pts ?? statLine?.pts_ppr_total ?? statLine?.fantasy_points_ppr);
                            if (!Number.isFinite(override)) continue;
                            weekStats[playerId] = {
                                fpts: override,
                                fpts_override: override,
                                __live: true
                            };
                        }
                        if (Object.keys(weekStats).length > 0) {
                            liveWeeklyStats[week] = weekStats;
                        }
                    } catch (weekError) {
                        console.warn(`Unable to fetch live fantasy points for week ${week}.`, weekError);
                    }
                }
                state.liveWeeklyStats = liveWeeklyStats;
                state.lastLiveStatsWeek = currentWeek;
                state.calculatedRankCache = null;
            } catch (error) {
                console.warn('Sleeper live stats unavailable.', error);
                state.liveWeeklyStats = existingLiveStats;
                if (!Number.isFinite(state.lastLiveStatsWeek) && Number.isFinite(state.currentNflWeek)) {
                    state.lastLiveStatsWeek = state.currentNflWeek;
                }
                state.calculatedRankCache = null;
            } finally {
                state.liveStatsLoaded = true;
                state.lastLiveStatsFetchTs = Date.now();
            }
        }
        async function fetchLeagueMatchupData(leagueId, maxWeek = null) {
            if (!leagueId) {
                console.warn('fetchLeagueMatchupData: No league ID provided');
                return;
            }
            try {
                const currentWeek = maxWeek || state.currentNflWeek || 18;
                const matchupStats = {};
                
                // Fetch matchups for each week (1 through current week)
                const weekPromises = [];
                for (let week = 1; week <= currentWeek; week++) {
                    weekPromises.push(
                        fetchWithCache(`${API_BASE}/league/${leagueId}/matchups/${week}`)
                            .then(matchups => ({ week, matchups }))
                            .catch(err => {
                                console.warn(`Failed to fetch matchup data for week ${week}:`, err);
                                return { week, matchups: null };
                            })
                    );
                }
                
                const results = await Promise.all(weekPromises);
                
                // Process matchup data
                results.forEach(({ week, matchups }) => {
                    if (!matchups || !Array.isArray(matchups)) return;
                    
                    matchupStats[week] = {};
                    
                    // Each matchup has players_points: { playerId: fpts }
                    matchups.forEach(matchup => {
                        if (matchup.players_points && typeof matchup.players_points === 'object') {
                            Object.entries(matchup.players_points).forEach(([playerId, fpts]) => {
                                if (Number.isFinite(fpts)) {
                                    matchupStats[week][playerId] = fpts;
                                }
                            });
                        }
                    });
                });
                
                state.leagueMatchupStats = matchupStats;
                state.matchupDataLoaded = true;
                console.log(`✅ Loaded matchup data for ${Object.keys(matchupStats).length} weeks`);
            } catch (error) {
                console.error('Error fetching league matchup data:', error);
                state.matchupDataLoaded = false;
            }
        }
        function getCombinedWeeklyStats() {
            const combined = {};
            const baseWeeklyStats = state.weeklyStats || {};
            Object.entries(baseWeeklyStats).forEach(([week, stats]) => {
                const clonedWeek = {};
                Object.entries(stats || {}).forEach(([playerId, statLine]) => {
                    clonedWeek[playerId] = { ...(statLine || {}) };
                });
                combined[week] = clonedWeek;
            });
            const liveWeeklyStats = state.liveWeeklyStats || {};
            Object.entries(liveWeeklyStats).forEach(([week, stats]) => {
                if (!combined[week]) combined[week] = {};
                const weekBucket = combined[week];
                const isProjectionWeek = state.playerProjectionWeeks?.[Number(week)] === true;
                Object.entries(stats || {}).forEach(([playerId, liveLine]) => {
                    const existing = weekBucket[playerId] ? { ...(weekBucket[playerId]) } : {};
                    const merged = { ...existing, ...(liveLine || {}) };
                    const liveFpts = Number.isFinite(liveLine?.fpts)
                        ? liveLine.fpts
                        : (Number.isFinite(liveLine?.fpts_override) ? liveLine.fpts_override : null);
                    if (liveFpts !== null) {
                        merged.fpts = liveFpts;
                        merged.fpts_override = liveFpts;
                    }
                    if (liveLine && liveLine.__live === true && (isProjectionWeek || Object.keys(existing).length === 0)) {
                        merged.__live = true;
                    } else if (!isProjectionWeek && merged.__live) {
                        delete merged.__live;
                    }
                    weekBucket[playerId] = merged;
                });
            });
            return combined;
        }
        function getAdjustedGamesPlayed(playerId, scoringSettings = null) {
            const baseGames = state.playerSeasonStats?.[playerId]?.games_played;
            const initialGames = Number.isFinite(baseGames) ? baseGames : Number(baseGames) || 0;
            const liveWeeklyStats = state.liveWeeklyStats || {};
            let additionalGames = 0;
            for (const [week, stats] of Object.entries(liveWeeklyStats)) {
                if (state.weeklyStats && state.weeklyStats[week]) continue;
                const playerWeek = stats?.[playerId];
                if (!playerWeek) continue;
                const points = calculateFantasyPoints(playerWeek, scoringSettings || {});
                if (points > 0) additionalGames += 1;
            }
            return initialGames + additionalGames;
        }
        const PLAYER_STAT_HEADER_MAP = {
            'paATT': 'pass_att',
            'CMP': 'pass_cmp',
            'CMP%': 'cmp_pct',
            'paYDS': 'pass_yd',
            'paTD': 'pass_td',
            'pa1D': 'pass_fd',
            'IMP/G': 'imp_per_g',
            'paRTG': 'pass_rtg',
            'pIMP': 'pass_imp',
            'pIMP/A': 'pass_imp_per_att',
            'INT': 'pass_int',
            'SAC': 'pass_sack',
            'TTT': 'ttt',
            'PRS%': 'prs_pct',
            'CAR': 'rush_att',
            'ruYDS': 'rush_yd',
            'YPC': 'ypc',
            'ruTD': 'rush_td',
            'ru1D': 'rush_fd',
            'MTF': 'mtf',
            'ELU': 'elu',
            'YCO': 'rush_yac',
            'YCO/A': 'yco_per_att',
            'MTF/A': 'mtf_per_att',
            'TGT': 'rec_tgt',
            'REC': 'rec',
            'recYDS': 'rec_yd',
            'recTD': 'rec_td',
            'rec1D': 'rec_fd',
            'YAC': 'rec_yar',
            'YPR': 'ypr',
            'RR': 'rr',
            'TS%': 'ts_per_rr',
            'YPRR': 'yprr',
            '1DRR': 'first_down_rec_rate',
            'IMP': 'imp',
            'FUM': 'fum',
            'SNP%': 'snp_pct',
            'YDS(t)': 'yds_total',
            'FPOE': 'fpoe',
            'YPG(t)': 'ypg',
            'paYPG': 'pa_ypg',
            'ruYPG': 'ru_ypg',
            'recYPG': 'rec_ypg',
            'PROJ': 'proj',
            'FPT_PPR': 'fpt_ppr',
            'FPTS_PPR': 'fpt_ppr'
        };
        const WEEKLY_META_HEADER_MAP = {
            'VS': 'opponent',
            'vsRK': 'opponent_rank'
        };
        // === Label builder and no-fallback config (added) ===
        function buildStatLabels() {
            const labels = {};
            for (const [header, key] of Object.entries(PLAYER_STAT_HEADER_MAP)) {
                labels[key] = header;
            }
            labels['fpts'] = 'FPTS'; // computed, not from sheet
            labels['ppg'] = 'PPG';   // keep if used elsewhere
            labels['ts_per_rr'] = 'TS%';
            return labels;
        }
        // Stats that must not use code-derived fallbacks; sheet is source of truth
        const NO_FALLBACK_KEYS = new Set([
            'yprr',
            'ts_per_rr',
            'imp_per_g',
            'snp_pct',
            'prs_pct',
            'ypr',
            'first_down_rec_rate'
        ]);
const SEASON_META_HEADERS = {
            'POS': 'pos',
            'TM': 'team',
            'GM_P': 'games_played'
        };
        const SEASON_VALUE_HEADERS = {
            'FPT_PPR': 'fpts_ppr',
            'FPTS_PPR': 'fpts_ppr',
            'PRK_PPR': 'pos_rank_ppr'
        };
        function parseSeasonStatsCsv(csvText) {
            const { headers, rows } = parseCsv(csvText);
            const normalizedHeaders = headers.map(normalizeHeader);
            const result = {};
            rows.forEach(columns => {
                let playerId = null;
                const stats = {};
                normalizedHeaders.forEach((header, idx) => {
                    const value = columns[idx];
                    if (!value) return;
                    if (header === 'SLPR_ID') {
                        playerId = value.trim();
                        return;
                    }
                    const statKey = PLAYER_STAT_HEADER_MAP[header];
                    if (statKey) {
                        const parsedValue = parseStatValue(header, value);
                        if (parsedValue !== null) stats[statKey] = parsedValue;
                        return;
                    }
                    const metaKey = SEASON_META_HEADERS[header];
                    if (metaKey) {
                        if (metaKey === 'games_played') {
                            const num = parseFloat(value);
                            if (!Number.isNaN(num)) stats[metaKey] = num;
                        } else {
                            const trimmed = value.trim();
                            if (trimmed) stats[metaKey] = trimmed;
                        }
                        return;
                    }
                    const valueKey = SEASON_VALUE_HEADERS[header];
                    if (valueKey) {
                        const parsed = parseSeasonValue(header, value);
                        if (parsed !== null) stats[valueKey] = parsed;
                        return;
                    }
                });
                if (playerId) {
                    result[playerId] = stats;
                }
            });
            return result;
        }
        function parseSeasonRanksCsv(csvText) {
            const { headers, rows } = parseCsv(csvText);
            const normalizedHeaders = headers.map(normalizeHeader);
            const result = {};
            rows.forEach(columns => {
                let playerId = null;
                const ranks = {};
                normalizedHeaders.forEach((header, idx) => {
                    const value = columns[idx];
                    if (!value) return;
                    if (header === 'SLPR_ID') {
                        playerId = value.trim();
                        return;
                    }
                    const statKey = PLAYER_STAT_HEADER_MAP[header] || SEASON_VALUE_HEADERS[header];
                    if (!statKey) return;
                    const parsedRank = parseRankValue(value);
                    if (parsedRank !== null) ranks[statKey] = parsedRank;
                });
                if (playerId) {
                    result[playerId] = ranks;
                }
            });
            return result;
        }
        function parseSeasonValue(header, value) {
            const trimmed = value.trim();
            if (!trimmed || trimmed.toUpperCase() === 'NA') return null;
            if (header === 'PRK_PPR') {
                const intVal = parseInt(trimmed, 10);
                return Number.isNaN(intVal) ? null : intVal;
            }
            const numVal = parseFloat(trimmed);
            return Number.isNaN(numVal) ? null : numVal;
        }
        function parseRankValue(value) {
            const trimmed = value.trim();
            if (!trimmed) return null;
            const upper = trimmed.toUpperCase();
            if (upper === 'NA' || upper === 'N/A') return null;
            const numVal = parseFloat(trimmed);
            return Number.isNaN(numVal) ? null : numVal;
        }
        const STAT_KEY_RANK_OVERRIDES = { fpts: 'fpts_ppr' };
        function getSeasonRankKey(statKey) {
            return STAT_KEY_RANK_OVERRIDES[statKey] || statKey;
        }
        function getSeasonRankValue(playerId, statKey) {
            const normalizeRank = (value) => {
                if (value === null || value === undefined) return null;
                if (typeof value === 'number') {
                    return Number.isFinite(value) ? value : null;
                }
                if (typeof value === 'string') {
                    return parseRankValue(value) ?? null;
                }
                return parseRankValue(String(value)) ?? null;
            };
            if (statKey === 'fpts' || statKey === 'ppg') {
                // Stats page uses pre-calculated ranks from sheets
                if (state.isGameLogFromStatsPage && state.statsPagePlayerData) {
                    const liveRank = statKey === 'fpts' 
                        ? state.statsPagePlayerData.posRank 
                        : state.statsPagePlayerData.ppgPosRank;
                    const normalizedLiveRank = normalizeRank(liveRank);
                    if (normalizedLiveRank !== null) {
                        return normalizedLiveRank;
                    }
                }
                // Rosters page calculates ranks from league matchup data
                if (typeof calculatePlayerStatsAndRanks === 'function') {
                    const ranks = calculatePlayerStatsAndRanks(playerId);
                    if (ranks) {
                        const liveRank = statKey === 'fpts' ? ranks.posRank : ranks.ppgPosRank;
                        const normalizedLiveRank = normalizeRank(liveRank);
                        if (normalizedLiveRank !== null) {
                            return normalizedLiveRank;
                        }
                    }
                }
                return null;
            }
            const ranks = state.playerSeasonRanks?.[playerId];
            if (!ranks) return null;
            const key = getSeasonRankKey(statKey);
            if (!(key in ranks)) return null;
            const value = ranks[key];
            if (typeof value === 'number') return value;
            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (!trimmed) return null;
                const upper = trimmed.toUpperCase();
                if (upper === 'NA' || upper === 'N/A') return null;
                const parsed = parseFloat(trimmed);
                return Number.isNaN(parsed) ? null : parsed;
            }
            return null;
        }
        function getRankDisplayText(rank) {
            if (rank === null || rank === undefined || Number.isNaN(rank)) {
                return 'NA';
            }
            const rankStr = String(rank).trim();
            if (!rankStr) return 'NA';
            const upper = rankStr.toUpperCase();
            if (upper === 'NA' || upper === 'N/A') return 'NA';
            return rankStr;
        }

        function getPlayerRadarData(playerId, position) {
            const config = RADAR_STATS_CONFIG[position];
            if (!config) return null;

            const radarData = {
                labels: config.labels,
                ranks: [],
                rawRanks: [],
                statValues: [],
                statKeys: config.stats, // Include stat keys for formatting
                maxRank: config.maxRank
            };

            // Use footer stats that were already calculated
            const footerStats = state.currentGameLogsFooterStats || {};
            const seasonTotals = state.playerSeasonStats?.[playerId] || null;
            const playerRanks = state.currentGameLogsPlayerRanks || null;
            const summarySnapshot = state.currentGameLogsSummary || null;

            config.stats.forEach(statKey => {
                const rankValue = getSeasonRankValue(playerId, statKey);
                radarData.rawRanks.push(rankValue);

                let statValue;
                
                // PPG must ALWAYS use playerRanks.ppg (same source as summary chips)
                if (statKey === 'ppg') {
                    statValue = playerRanks?.ppg;
                } else {
                    // For all other stats, try footerStats first
                    statValue = footerStats[statKey];
                    
                    if (statValue === undefined) {
                        if (statKey === 'fpts') {
                            if (summarySnapshot && summarySnapshot.fpts !== undefined) {
                                statValue = summarySnapshot.fpts;
                            }
                            if (statValue === undefined) {
                                if (state.isGameLogFromStatsPage && state.statsPagePlayerData) {
                                    statValue = state.statsPagePlayerData.fpts || state.statsPagePlayerData.totalPts || null;
                                } else if (seasonTotals && typeof seasonTotals.fpts_ppr === 'number') {
                                    statValue = seasonTotals.fpts_ppr;
                                }
                            }
                        } else if (statKey === 'ypc') {
                            if (seasonTotals && typeof seasonTotals.rush_att === 'number' && seasonTotals.rush_att > 0) {
                                const totalYards = typeof seasonTotals.rush_yd === 'number' ? seasonTotals.rush_yd : 0;
                                statValue = totalYards / seasonTotals.rush_att;
                            }
                        } else if (statKey === 'yco_per_att') {
                            if (seasonTotals && typeof seasonTotals.rush_att === 'number' && seasonTotals.rush_att > 0) {
                                const totalYco = typeof seasonTotals.rush_yac === 'number' ? seasonTotals.rush_yac : 0;
                                statValue = totalYco / seasonTotals.rush_att;
                            }
                        } else if (statKey === 'mtf_per_att') {
                            if (seasonTotals && typeof seasonTotals.rush_att === 'number' && seasonTotals.rush_att > 0) {
                                const totalMtf = typeof seasonTotals.mtf === 'number' ? seasonTotals.mtf : 0;
                                statValue = totalMtf / seasonTotals.rush_att;
                            }
                        } else if (statKey === 'pass_imp_per_att') {
                            if (seasonTotals && typeof seasonTotals.pass_att === 'number' && seasonTotals.pass_att > 0) {
                                const totalImp = typeof seasonTotals.pass_imp === 'number' ? seasonTotals.pass_imp : 0;
                                statValue = (totalImp / seasonTotals.pass_att) * 100;
                            }
                        } else if (seasonTotals && typeof seasonTotals[statKey] === 'number') {
                            statValue = seasonTotals[statKey];
                        } else {
                            statValue = null;
                        }
                    }
                }
                if (typeof statValue === 'string') {
                    const trimmed = statValue.trim();
                    if (trimmed.length === 0) {
                        statValue = null;
                    } else if (statKey === 'fpts' || statKey === 'ppg') {
                        statValue = trimmed;
                    } else {
                        const numericCandidate = Number(trimmed);
                        statValue = Number.isNaN(numericCandidate) ? trimmed : numericCandidate;
                    }
                }
                radarData.statValues.push(statValue);

                // Scale ranks from 10% to 85% of radar
                // rank 1 -> 85, rank 7 -> ~73, rank maxRank -> 10
                if (rankValue === null || rankValue === undefined || Number.isNaN(rankValue)) {
                    radarData.ranks.push(10); // No data shows at 10%
                } else if (rankValue <= 1) {
                    radarData.ranks.push(85); // Rank 1 at 85% of max
                } else if (rankValue >= config.maxRank) {
                    radarData.ranks.push(10); // Worst rank at 10%
                } else if (rankValue <= 7) {
                    // Compress ranks 1-7 into the 73-85 range
                    // rank 1 = 85, rank 7 = 73
                    const scaledValue = 85 - ((rankValue - 1) / 6) * 12;
                    radarData.ranks.push(scaledValue);
                } else {
                    // Scale ranks 7-maxRank linearly from 73 to 10
                    const scaledValue = 73 - ((rankValue - 7) / (config.maxRank - 7)) * 63;
                    radarData.ranks.push(scaledValue);
                }
            });

            return radarData;
        }

        // Chart.js plugins for player radar chart
        const playerRadarBackgroundPlugin = {
            id: 'playerRadarBackground',
            beforeDraw(chart, args, options) {
                const scale = chart.scales?.r;
                if (!scale) return;
                const { ctx } = chart;
                const centerX = scale.xCenter;
                const centerY = scale.yCenter;
                const angleStep = (Math.PI * 2) / chart.data.labels.length;
                const startAngle = -Math.PI / 2; // Start at top
                const maxRadius = scale.drawingArea;

                const levels = options.levels || [];

                levels.forEach((level) => {
                    const radius = maxRadius * (level.ratio ?? 1);
                    ctx.beginPath();
                    ctx.strokeStyle = level.stroke || 'rgba(151, 166, 210, 0.15)';
                    ctx.fillStyle = level.fill || 'transparent';
                    ctx.lineWidth = 1;

                    chart.data.labels.forEach((label, index) => {
                        const angle = startAngle + angleStep * index;
                        const x = centerX + Math.cos(angle) * radius;
                        const y = centerY + Math.sin(angle) * radius;

                        if (index === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    });

                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                });
            }
        };

        const playerRadarLabelPlugin = {
            id: 'playerRadarLabels',
            afterDatasetsDraw(chart, args, options) {
                const dataset = chart.data.datasets[0];
                if (!dataset || !dataset.data) return;

                const { ctx } = chart;
                const scale = chart.scales?.r;
                if (!scale) return;

                const centerX = scale.xCenter;
                const centerY = scale.yCenter;
                const angleStep = (Math.PI * 2) / chart.data.labels.length;
                const startAngle = -Math.PI / 2;

                // Helper function for ordinal suffix
                const getOrdinalSuffix = (n) => {
                    const s = ['th', 'st', 'nd', 'rd'];
                    const v = n % 100;
                    return s[(v - 20) % 10] || s[v] || s[0];
                };

                ctx.font = options.font || '11px "Product Sans"';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';

                dataset.data.forEach((value, index) => {
                    const angle = startAngle + angleStep * index;
                    const dataPoint = scale.getPointPositionForValue(index, value);
                    
                    // Base offset with custom spacing adjustments
                    let offsetDistance = options.offset || 18;
                    
                    // Top 2 data points (1st, 2nd clockwise) - bring labels closer
                    if (index === 0 || index === 1) {
                        offsetDistance -= 3; // Reduce by 3 pixels for top points
                    }
                    // 8th position (top-left) - slightly closer
                    else if (index === 7) {
                        offsetDistance -= 1.5; // Reduce by 1.5 pixels for 8th position
                    }
                    // Left-side data points - add extra spacing
                    else if (index === 5 || index === 6) {
                        offsetDistance += 4; // Add 4 extra pixels for left-side points
                    }
                    
                    const offsetX = Math.cos(angle) * offsetDistance;
                    const offsetY = Math.sin(angle) * offsetDistance;

                    const rawRank = dataset.rawRanks?.[index];
                    let label;
                    if (rawRank !== null && rawRank !== undefined && !Number.isNaN(rawRank)) {
                        const rankNum = Math.round(rawRank);
                        const suffix = getOrdinalSuffix(rankNum);
                        label = rankNum.toString();
                        
                        // Color based on rank values
                        const rankColor = getConditionalColorByRank(rawRank, dataset.position);
                        ctx.fillStyle = rankColor;
                        
                        // Draw the rank number
                        ctx.fillText(label, dataPoint.x + offsetX, dataPoint.y + offsetY);
                        
                        // Draw the suffix smaller, same baseline, positioned after the number
                        const metrics = ctx.measureText(label);
                        const suffixFontSize = parseInt(ctx.font) * 0.7; // 70% of original size
                        ctx.font = `${suffixFontSize}px "Product Sans"`;
                        // Position suffix to the right: center + half width of number + small gap
                        ctx.fillText(suffix, dataPoint.x + offsetX + (metrics.width / 2) + 4, dataPoint.y + offsetY);
                        
                        // Reset font for next iteration
                        ctx.font = options.font || '11px "Product Sans"';
                    } else {
                        label = 'NA';
                        const rankColor = getConditionalColorByRank(rawRank, dataset.position);
                        ctx.fillStyle = rankColor;
                        ctx.fillText(label, dataPoint.x + offsetX, dataPoint.y + offsetY);
                    }
                });
            }
        };

        const playerRadarAxisLabelsPlugin = {
            id: 'playerRadarAxisLabels',
            afterDraw(chart, args, options) {
                const scale = chart.scales?.r;
                if (!scale) return;
                const dataset = chart.data.datasets[0];
                if (!dataset) return;
                const labels = chart.data.labels;
                if (!labels || !labels.length) return;

                const isMobile = window.matchMedia('(max-width: 640px)').matches;
                const labelFontSize = isMobile ? (options?.labelFontSizeMobile ?? 11) : (options?.labelFontSize ?? 12);
                const valueFontSize = isMobile ? (options?.valueFontSizeMobile ?? 9) : (options?.valueFontSize ?? 10);
                const labelFont = `${labelFontSize}px "Product Sans", "Google Sans", sans-serif`;
                const valueFont = `${valueFontSize}px "Product Sans", "Google Sans", sans-serif`;
                const labelColor = options?.labelColor || '#EAEBF0';
                const labelOffset = options?.labelOffset ?? (isMobile ? 14 : 18);
                const valueSpacing = options?.valueSpacing ?? (isMobile ? 3 : 4);

                const { ctx } = chart;
                const angleStep = (Math.PI * 2) / labels.length;
                const startAngle = -Math.PI / 2;

                ctx.save();
                for (let index = 0; index < labels.length; index++) {
                    const angle = startAngle + angleStep * index;
                    const cos = Math.cos(angle);
                    const sin = Math.sin(angle);

                    let textAlign = 'center';
                    if (Math.abs(cos) > 1e-4) {
                        textAlign = cos < 0 ? 'right' : 'left';
                    }
                    let textBaseline;
                    if (Math.abs(sin) <= 1e-4) {
                        textBaseline = 'middle';
                    } else {
                        textBaseline = sin < 0 ? 'bottom' : 'top';
                    }

                    const radius = scale.drawingArea + labelOffset;
                    const x = scale.xCenter + cos * radius;
                    const y = scale.yCenter + sin * radius;

                    const labelText = (typeof labels[index] === 'string')
                        ? labels[index]
                        : String(labels[index] ?? '');

                    ctx.font = labelFont;
                    ctx.textAlign = textAlign;
                    ctx.textBaseline = textBaseline;
                    ctx.fillStyle = labelColor;
                    ctx.fillText(labelText, x, y);

                    const statKey = dataset.statKeys?.[index];
                    const statValue = dataset.statValues?.[index];
                    const formattedValue = formatRadarStatValue(statKey, statValue);
                    const rawRank = dataset.rawRanks?.[index];
                    const valueColor = getConditionalColorByRank(rawRank, dataset.position) || labelColor;

                    let valueY = y;
                    if (textBaseline === 'top') {
                        valueY = y + labelFontSize + valueSpacing;
                    } else if (textBaseline === 'middle') {
                        valueY = y + (labelFontSize / 2) + valueSpacing;
                    } else {
                        valueY = y + valueSpacing;
                    }

                    ctx.font = valueFont;
                    ctx.textBaseline = 'top';
                    ctx.fillStyle = valueColor;
                    ctx.fillText(`• ${formattedValue} •`, x, valueY);
                }
                ctx.restore();
            }
        };

    function createRankAnnotation(rank, { wrapInParens = true, ordinal = false, variant = 'default' } = {}) {
                    const span = document.createElement('span');
                    // base class plus variant-specific class so CSS can target per-context
                    span.className = `stat-rank-annotation stat-rank-variant-${variant}`;
                    const displayText = getRankDisplayText(rank);
                    // Helper: return ordinal suffix for integer n
                    const ordinalSuffix = (n) => {
                        const num = Math.abs(Number(n));
                        if (!Number.isFinite(num) || Math.floor(num) !== num) return '';
                        const tens = num % 100;
                        if (tens >= 11 && tens <= 13) return 'th';
                        const ones = num % 10;
                        if (ones === 1) return 'st';
                        if (ones === 2) return 'nd';
                        if (ones === 3) return 'rd';
                        return 'th';
                    };
                    // Render numeric ranks; when ordinal=true, include suffix; otherwise plain number
                    const asNumber = Number(displayText);
                    if (displayText !== 'NA' && Number.isFinite(asNumber)) {
                        // Optionally wrap with parentheses
                        if (wrapInParens) span.appendChild(document.createTextNode('('));
                        const numNode = document.createElement('span');
                        numNode.className = 'stat-rank-number';
                        numNode.textContent = String(asNumber);
                        span.appendChild(numNode);
                        if (ordinal) {
                            if (variant === 'ktc') {
                                const suffix = document.createElement('span');
                                suffix.className = `stat-rank-suffix stat-rank-suffix-${variant}`; // will target ktc specifically in CSS
                                suffix.textContent = ordinalSuffix(asNumber);
                                span.appendChild(suffix);
                            } else {
                                const sup = document.createElement('sup');
                                sup.className = `stat-rank-suffix stat-rank-suffix-${variant}`;
                                sup.textContent = ordinalSuffix(asNumber);
                                span.appendChild(sup);
                            }
                        }
                        if (wrapInParens) span.appendChild(document.createTextNode(')'));
                        return span;
                    }
                    // Fallback for non-numeric or NA values: plain text (optionally parenthesized)
                    span.textContent = wrapInParens ? `(${displayText})` : displayText;
                    return span;
        }
        function computeSeasonRankings(seasonStats) {
            if (!seasonStats || typeof seasonStats !== 'object') return null;
            const entries = [];
            for (const [playerId, stats] of Object.entries(seasonStats)) {
                const fpts = typeof stats.fpts_ppr === 'number' ? stats.fpts_ppr : 0;
                const gamesPlayed = typeof stats.games_played === 'number' ? stats.games_played : 0;
                const pos = stats.pos || state.players[playerId]?.position || null;
                const ppg = gamesPlayed > 0 ? fpts / gamesPlayed : 0;
                stats.fpts_ppr = fpts;
                stats.games_played = gamesPlayed;
                stats.pos = pos;
                stats.ppg = ppg;
                entries.push({ playerId, pos, fpts, gamesPlayed, ppg });
            }
            const overallSorted = entries.slice().sort((a, b) => {
                if (b.fpts !== a.fpts) return b.fpts - a.fpts;
                if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
                if (b.ppg !== a.ppg) return b.ppg - a.ppg;
                return a.playerId.localeCompare(b.playerId);
            });
            overallSorted.forEach((entry, index) => {
                seasonStats[entry.playerId].overall_rank_ppr = index + 1;
            });
            const ppgSorted = entries
                .filter(entry => entry.gamesPlayed > 0)
                .sort((a, b) => {
                    if (b.ppg !== a.ppg) return b.ppg - a.ppg;
                    if (b.fpts !== a.fpts) return b.fpts - a.fpts;
                    if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
                    return a.playerId.localeCompare(b.playerId);
                });
            ppgSorted.forEach((entry, index) => {
                seasonStats[entry.playerId].ppg_rank_ppr = index + 1;
            });
            const positionalRankings = {};
            const groupedByPos = entries.reduce((acc, entry) => {
                if (!entry.pos) return acc;
                if (!acc[entry.pos]) acc[entry.pos] = [];
                acc[entry.pos].push(entry);
                return acc;
            }, {});
            Object.entries(groupedByPos).forEach(([pos, group]) => {
                const posSorted = group.slice().sort((a, b) => {
                    if (b.fpts !== a.fpts) return b.fpts - a.fpts;
                    if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
                    if (b.ppg !== a.ppg) return b.ppg - a.ppg;
                    return a.playerId.localeCompare(b.playerId);
                });
                posSorted.forEach((entry, index) => {
                    if (typeof seasonStats[entry.playerId].pos_rank_ppr !== 'number') {
                        seasonStats[entry.playerId].pos_rank_ppr = index + 1;
                    }
                });
                const posPpgSorted = group
                    .filter(entry => entry.gamesPlayed > 0)
                    .sort((a, b) => {
                        if (b.ppg !== a.ppg) return b.ppg - a.ppg;
                        if (b.fpts !== a.fpts) return b.fpts - a.fpts;
                        if (b.gamesPlayed !== a.gamesPlayed) return b.gamesPlayed - a.gamesPlayed;
                        return a.playerId.localeCompare(b.playerId);
                    });
                posPpgSorted.forEach((entry, index) => {
                    seasonStats[entry.playerId].ppg_pos_rank_ppr = index + 1;
                });
                positionalRankings[pos] = {
                    total: posSorted.map(entry => entry.playerId),
                    ppg: posPpgSorted.map(entry => entry.playerId)
                };
            });
            return {
                overall: overallSorted.map(entry => entry.playerId),
                ppg: ppgSorted.map(entry => entry.playerId),
                positional: positionalRankings
            };
        }

        function renderPlayerRadarChart(playerId, position) {
            const container = document.querySelector('#radar-chart-container .radar-chart-content');
            if (!container) return;

            // Clear existing chart
            container.innerHTML = '';

            const radarData = getPlayerRadarData(playerId, position);
            if (!radarData) {
                container.innerHTML = '<p class="no-data-message">No radar data available for this position.</p>';
                return;
            }

            // Create canvas
            const canvas = document.createElement('canvas');
            canvas.id = 'player-radar-canvas';
            container.appendChild(canvas);

            const ctx = canvas.getContext('2d');
            
            // Match analyzer mobile detection
            const isMobileRadar = window.matchMedia('(max-width: 640px)').matches;
            const radarLayoutPadding = {
                top: isMobileRadar ? 30 : 33,
                bottom: isMobileRadar ? 38 : 52,
                left: isMobileRadar ? 45 : 14,
                right: isMobileRadar ? 45 : 14,
            };
            const radarLabelOffset = isMobileRadar ? 14 : 18;

            // Fixed scale max at 100 for all positions
            const scaleMax = 100;

            const chartInstance = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: radarData.labels,
                    datasets: [{
                        label: 'Player Rank',
                        data: radarData.ranks,
                        rawRanks: radarData.rawRanks,
                        statValues: radarData.statValues,
                        statKeys: radarData.statKeys,
                        position: position,
                        fill: true,
                        backgroundColor: 'rgba(83, 0, 255, 0.33)', // Fallback color
                        borderColor: '#6700ff',
                        borderWidth: 2,
                        pointBackgroundColor: '#6300ff',
                        pointBorderColor: '#0D0E1B',
                        pointRadius: 4.5,
                        analyzerLabels: true,
                        order: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    events: [],
                    layout: {
                        padding: radarLayoutPadding
                    },
                    elements: {
                        line: { tension: 0.40 }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            suggestedMin: 0,
                            suggestedMax: scaleMax,
                            max: scaleMax,
                            grid: { display: false },
                            angleLines: { display: false },
                            ticks: { display: false },
                            pointLabels: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false },
                        playerRadarBackground: {
                            levels: [
                                { ratio: 0.95, fill: '#2c334f62', stroke: '#525a7739', lineWidth: 1 },
                                { ratio: 0.75, fill: '#2D345153', stroke: '#525a7729', lineWidth: 1 },
                                { ratio: 0.55, fill: '#2F365250', stroke: '#525a7729', lineWidth: 1 },
                                { ratio: 0.35, fill: '#30375455', stroke: '#525a7729', lineWidth: 1 },
                                { ratio: 0.18, fill: '#31385565', stroke: '#525a7735', lineWidth: 1 }
                            ]
                        },
                        playerRadarLabels: {
                            font: '12px "Product Sans", "Google Sans", sans-serif',
                            offset: radarLabelOffset
                        },
                        playerRadarAxisLabels: {
                            labelFontSize: 12,
                            labelFontSizeMobile: 11,
                            valueFontSize: 10,
                            valueFontSizeMobile: 9,
                            labelOffset: isMobileRadar ? 14 : 18,
                            valueSpacing: isMobileRadar ? 3 : 4,
                            labelColor: '#EAEBF0'
                        }
                    }
                },
                plugins: [playerRadarBackgroundPlugin, playerRadarLabelPlugin, playerRadarAxisLabelsPlugin]
            });
            
            // Update gradient after chart is rendered using actual scale center
            const scale = chartInstance.scales?.r;
            if (scale) {
                const centerX = scale.xCenter;
                const centerY = scale.yCenter;
                const radius = scale.drawingArea;
                
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(121, 0, 245, 0.13)');   // #5300ff at 18% opacity (center)
            gradient.addColorStop(0.4, 'rgba(92, 0, 255, 0.20)'); // #5700ff at 33% opacity (mid)
            gradient.addColorStop(0.78, 'rgba(75, 0, 255, 0.34)');   // #6300ff at 55% opacity (outer edge)
            gradient.addColorStop(1, 'rgba(34, 0, 255, 0.91)');        

                chartInstance.data.datasets[0].backgroundColor = gradient;
                chartInstance.update('none'); // Update without animation
            }

            // Store chart instance for cleanup
            container._chartInstance = Chart.getChart('player-radar-canvas');
        }

        function parseWeeklyStatsCsv(csvText) {
            const { headers, rows } = parseCsv(csvText);
            const normalizedHeaders = headers.map(normalizeHeader);
            const result = {};
            rows.forEach(columns => {
                let playerId = null;
                const stats = {};
                normalizedHeaders.forEach((header, idx) => {
                    const value = columns[idx];
                    if (header === 'SLPR_ID') {
                        if (value) playerId = value.trim();
                        return;
                    }
                    // Allow PROJ through even if empty/whitespace so we can preserve text values
                    if (header !== 'PROJ' && !value) return;
                    const metaKey = WEEKLY_META_HEADER_MAP[header];
                    if (metaKey) {
                        if (metaKey === 'opponent_rank') {
                            const parsed = parseFloat(value.trim());
                            if (!Number.isNaN(parsed)) stats[metaKey] = parsed;
                        } else {
                            const trimmedOpponent = value.trim();
                            if (trimmedOpponent) stats[metaKey] = trimmedOpponent;
                        }
                        return;
                    }
                    const statKey = PLAYER_STAT_HEADER_MAP[header];
                    if (statKey) {
                        if (header === 'PROJ') {
                            // For PROJ, always store the raw value as a string, even if empty
                            stats[statKey] = value || '';
                        } else {
                            const parsedValue = parseStatValue(header, value);
                            if (parsedValue !== null) stats[statKey] = parsedValue;
                        }
                    }
                });
                if (playerId) {
                    result[playerId] = stats;
                }
            });
            return result;
        }
        function parseCsv(csvText) {
            const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
            if (lines.length === 0) return { headers: [], rows: [] };
            const headers = parseCsvLine(lines[0]);
            const rows = lines.slice(1).map(line => parseCsvLine(line))
                .filter(columns => columns.some(col => col.length > 0));
            return { headers, rows };
        }
        function parseCsvLine(line) {
            const result = [];
            let current = '';
            let inQuotes = false;
            const sanitizedLine = line.replace(/\r$/, '');
            for (let i = 0; i < sanitizedLine.length; i++) {
                const char = sanitizedLine[i];
                if (inQuotes) {
                    if (char === '"') {
                        if (sanitizedLine[i + 1] === '"') {
                            current += '"';
                            i++;
                        } else {
                            inQuotes = false;
                        }
                    } else {
                        current += char;
                    }
                } else {
                    if (char === '"') {
                        inQuotes = true;
                    } else if (char === ',') {
                        result.push(current);
                        current = '';
                    } else {
                        current += char;
                    }
                }
            }
            result.push(current);
            return result;
        }
        function normalizeHeader(header) {
            return header.replace(/[\u00a0\u202f]/g, ' ').trim();
        }
        function parseStatValue(header, value) {
            const trimmed = value.trim();
            // For all non-PROJ columns, PROJ is handled separately
            if (!trimmed || trimmed.toUpperCase() === 'NA') return null;
            if (header === 'SNP%') {
                const numericPortion = parseFloat(trimmed.replace('%', ''));
                if (Number.isNaN(numericPortion)) return null;
                if (trimmed.includes('%') || numericPortion > 1.5) {
                    return numericPortion;
                }
                return numericPortion * 100;
            }
            const num = parseFloat(trimmed);
            if (Number.isNaN(num)) return null;
            return num;
        }
        function processRosterData(rosters, users, tradedPicks, leagueInfo) {
            const userMap = users.reduce((acc, user) => ({ ...acc, [user.user_id]: user }), {});
            const rosterPositions = leagueInfo.roster_positions;
            const taxiSlots = leagueInfo.settings.taxi_slots || 0;
            const teams = rosters.map(roster => {
                const owner = userMap[roster.owner_id];
                const allPlayers = roster.players || [];
                const starterIds = roster.starters || [];
                const starters = starterIds.map((playerId, index) => {
                    const slot = rosterPositions[index] || 'FLEX';
                    return getPlayerData(playerId, slot);
                }).sort((a, b) => STARTER_ORDER.indexOf(a.slot) - STARTER_ORDER.indexOf(b.slot));
                const currentTaxiPlayers = (roster.taxi || []).map(p => getPlayerData(p, 'TX')).sort((a, b) => (b.ktc || 0) - (a.ktc || 0));
                const emptyTaxiSlots = Array(Math.max(0, taxiSlots - currentTaxiPlayers.length)).fill({ isPlaceholder: true });
                const taxi = [...currentTaxiPlayers, ...emptyTaxiSlots];
                const bench = allPlayers.filter(pId => pId && !starterIds.includes(pId) && !(roster.taxi || []).includes(pId));
                const draftPicks = getOwnedPicks(roster.roster_id, tradedPicks, leagueInfo);
               const isUserTeam = roster.owner_id === state.userId || 
               (roster.co_owners?.includes(state.userId) ?? false);
                return {
                    isUserTeam,
                    teamName: owner?.display_name || `Team ${roster.roster_id}`,
                    record: formatTeamRecord(roster.settings),
                    starters,
                    bench: bench.map(p => getPlayerData(p, 'BN')).sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
                    taxi,
                    draftPicks: draftPicks.map(p => getPickData(p, leagueInfo)),
                    allPlayers: allPlayers.map(pId => getPlayerData(pId, ''))
                };
            });
            state.currentTeams = teams;
            return teams.sort((a, b) => {
                if (a.isUserTeam) return -1;
                if (b.isUserTeam) return 1;
                return a.teamName.localeCompare(b.teamName);
            });
        }
        function formatTeamRecord(settings = {}) {
            const wins = Number.isFinite(settings?.wins) ? settings.wins : null;
            const losses = Number.isFinite(settings?.losses) ? settings.losses : null;
            const ties = Number.isFinite(settings?.ties) ? settings.ties : 0;
            if (wins === null || losses === null) {
                return null;
            }
            const baseRecord = `${wins}-${losses}`;
            return ties ? `${baseRecord}-${ties}` : baseRecord;
        }
        function getOwnedPicks(rosterId, tradedPicks, leagueInfo) {
            const defaultRounds = leagueInfo.settings.draft_rounds || 5;
            const leagueSeason = parseInt(leagueInfo.season);
            const firstPickSeason = leagueSeason + 1;
            let ownedPicks = [];
            for (let i = 0; i < 4; i++) {
                const season = firstPickSeason + i;
                for (let round = 1; round <= defaultRounds; round++) {
                    ownedPicks.push({ season: String(season), round, original_owner_id: rosterId });
                }
            }
            tradedPicks.forEach(pick => {
                if (pick.roster_id === rosterId && pick.owner_id !== rosterId) {
                    const i = ownedPicks.findIndex(p => p.season === pick.season && p.round === pick.round && p.original_owner_id === rosterId);
                    if (i > -1) ownedPicks.splice(i, 1);
                }
                if (pick.owner_id === rosterId && pick.roster_id !== rosterId) {
                    if (parseInt(pick.season) >= firstPickSeason) {
                        ownedPicks.push({ season: pick.season, round: pick.round, original_owner_id: pick.roster_id });
                    }
                }
            });
            ownedPicks = ownedPicks.filter(p => parseInt(p.season) < 2029);
            return ownedPicks.sort((a, b) => a.season.localeCompare(b.season) || a.round - b.round);
        }
        function getPlayerData(playerId, slot) {
            const player = state.players[playerId];
            if (!player) return { id: playerId, name: 'Unknown Player', pos: '?', age: '?', team: '?', adp: null, ktc: null, slot, posRank: null, ppg: 0 };
            const valueData = state.isSuperflex ? state.sflxData[playerId] : state.oneQbData[playerId];
            let lastName = player.last_name || '';
            if (lastName.length > 9) lastName = lastName.slice(0, 9) + '..'; // add ellipsis if truncated
            let displayName = `${player.first_name.charAt(0)}. ${lastName}`;
            // Prioritize age from the sheet and format it to one decimal place
            const ageFromSheet = valueData?.age;
            const formattedAge = (typeof ageFromSheet === 'number') ? ageFromSheet.toFixed(1) : (player.age ? Number(player.age).toFixed(1) : '?');
            const playerRanks = calculatePlayerStatsAndRanks(playerId) || getDefaultPlayerRanks();
            const upcomingDesignation = getUpcomingProjectionDesignation(playerId);
            return { 
                id: playerId, 
                name: displayName, 
                pos: player.position || '?', 
                age: formattedAge, // Use the new formatted age
                team: player.team || 'FA', 
                adp: valueData?.adp || null, 
                ktc: valueData?.ktc || null, 
                slot, 
                posRank: valueData?.posRank || null,
                overallRank: valueData?.overallRank || null,
                ppg: playerRanks ? parseFloat(playerRanks.ppg) : 0,
                playerRanks: playerRanks,
                injuryDesignation: upcomingDesignation
            };
        }
        function getPickData(pick) {
            const { season, round } = pick;
            const label = `${season} ${ordinalSuffix(round)}`;
            const staticVals = { oneqb: { 1: 5200, 2: 3200, 3: 2000, 4: 1200, 5: 400 }, sflx: { 1: 4300, 2: 2600, 3: 1700, 4: 1000, 5: 400 } };
            let ktc = null;
            if (parseInt(season) >= 2028 || round >= 5) {
                ktc = (state.isSuperflex ? staticVals.sflx : staticVals.oneqb)[round] || null;
            } else {
                const sfx = round === 1 ? 'st' : round === 2 ? 'nd' : round === 3 ? 'rd' : 'th';
                const ktcKey = `${season} Mid ${round}${sfx}`;
                const dataSet = state.isSuperflex ? state.sflxData : state.oneQbData;
                ktc = dataSet[ktcKey]?.ktc || null;
            }
            return { label, ktc, id: `${season}-${round}-${pick.original_owner_id}` };
        }
        // --- UI Rendering ---
        async function handlePlayerNameClick(player) {
            const fullPlayer = state.players[player.id];
            const playerName = fullPlayer ? `${fullPlayer.first_name} ${fullPlayer.last_name}` : player.name;
            modalPlayerName.textContent = `${playerName}`;
            if (modalPlayerVitals) {
                modalPlayerVitals.innerHTML = '';
            }
            document.getElementById('modal-summary-chips').innerHTML = ''; // Clear previous chips
            const existingHeaderContainer = document.querySelector('.modal-header-left-container');
            if(existingHeaderContainer) existingHeaderContainer.remove();
            
            // Enhanced loading state with animation - add loading classes
            modalBody.classList.add('loading');
            gameLogsModal.classList.add('loading');
            
            // Clear modal body
            modalBody.innerHTML = '';
            
            // Insert loading panel as sibling to modal-body (inside modal-content)
            const modalContent = gameLogsModal.querySelector('.modal-content');
            const existingLoadingPanel = modalContent.querySelector('.game-logs-loading-container');
            if (existingLoadingPanel) existingLoadingPanel.remove();
            
            const loadingPanel = document.createElement('div');
            loadingPanel.className = 'game-logs-loading-container';
            // Different message for stats page vs rosters page
            const loadingMessage = state.isGameLogFromStatsPage
                ? 'Fetching Game Log Data for All Players'
                : 'Fetching Game Log Data for All Players Across Your Leagues';
            loadingPanel.innerHTML = `
                <div class="game-logs-loading-content">
                    <div class="game-logs-loading-spinner">
                </div>
                    <p class="game-logs-loading-message">
                        <strong>Syncing Game Logs ⇄</strong>
                        ${loadingMessage} <br>
                       <br> — This May Take a Few Seconds...
                    </p>
                </div>
                <p class="game-logs-loading-footer">
                    <em>One-Time Sync <b>&</b> Synced Across the Board...   ➜ After this initial load, access every game log instantly—no extra loading  (per-session)</em>
                </p>
            `;
            modalContent.appendChild(loadingPanel);
            
            if (state.isGameLogModalOpenFromComparison) {
                gameLogsModal.style.zIndex = '1050';
            }
            openModal();
            const gameLogs = await fetchGameLogs(player.id);
            
            // Remove loading classes and panel before rendering content
            modalBody.classList.remove('loading');
            gameLogsModal.classList.remove('loading');
            const existingPanel = gameLogsModal.querySelector('.game-logs-loading-container');
            if (existingPanel) existingPanel.remove();
            
            // Stats page uses sheet data, other pages calculate from weekly data
            const playerRanks = state.isGameLogFromStatsPage 
                ? getStatsPagePlayerRanks(player.id)
                : calculatePlayerStatsAndRanks(player.id);
            await renderGameLogs(gameLogs, player, playerRanks);
        }
        function getOpponentRankColor(rank) {
            const numericRank = typeof rank === 'number' ? rank : parseFloat(rank);
            if (!Number.isFinite(numericRank)) return null;
            if (numericRank <= 8) return '#82d8bee0';
            if (numericRank <= 16) return '#73b9e7e0';
            if (numericRank <= 24) return '#c093ebe0';
            if (numericRank <= 32) return '#c456b1e0';
            return null;
        }
        let tableCoreLoaderPromise = null;
        function ensureTableCoreLoaded() {
            if (window.TableCore) return Promise.resolve(window.TableCore);
            if (tableCoreLoaderPromise) return tableCoreLoaderPromise;
            const existingScript = document.querySelector('script[data-tanstack-table-core="true"]');
            if (existingScript) {
                tableCoreLoaderPromise = new Promise((resolve, reject) => {
                    existingScript.addEventListener('load', () => {
                        if (window.TableCore) resolve(window.TableCore);
                        else {
                            tableCoreLoaderPromise = null;
                            reject(new Error('TanStack Table library loaded but TableCore global is unavailable.'));
                        }
                    }, { once: true });
                    existingScript.addEventListener('error', () => {
                        tableCoreLoaderPromise = null;
                        reject(new Error('TanStack Table library failed to load.'));
                    }, { once: true });
                });
                return tableCoreLoaderPromise;
            }
            tableCoreLoaderPromise = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/@tanstack/table-core@8.11.0/build/umd/index.production.min.js';
                script.async = true;
                script.dataset.tanstackTableCore = 'true';
                script.onload = () => {
                    if (window.TableCore) resolve(window.TableCore);
                    else {
                        tableCoreLoaderPromise = null;
                        reject(new Error('TanStack Table library loaded but TableCore global is unavailable.'));
                    }
                };
                script.onerror = () => {
                    script.remove();
                    tableCoreLoaderPromise = null;
                    reject(new Error('TanStack Table library failed to load.'));
                };
                document.head.appendChild(script);
            });
            return tableCoreLoaderPromise;
        }

        // Configuration for radar chart stats per position
        // Stats use internal stat keys (values from PLAYER_STAT_HEADER_MAP)
        // Labels use exact spreadsheet column headers (keys from PLAYER_STAT_HEADER_MAP)
        const RADAR_STATS_CONFIG = {
            QB: {
                stats: ['fpts', 'ppg', 'pass_rtg', 'cmp_pct', 'pa_ypg', 'ttt', 'yds_total', 'imp_per_g'],
                labels: ['FPTS', 'PPG', 'paRTG', 'CMP%', 'paYPG', 'TTT', 'YDS(t)', 'IMP/G'],
                maxRank: 36
            },
            RB: {
                stats: ['fpts', 'ppg', 'yds_total', 'snp_pct', 'ypc', 'rec_tgt', 'mtf_per_att', 'yco_per_att'],
                labels: ['FPTS', 'PPG', 'YDS(t)', 'SNP%', 'YPC', 'TGT', 'MTF/A', 'YCO/A'],
                maxRank: 48
            },
            WR: {
                stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
                labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
                maxRank: 72
            },
            TE: {
                stats: ['fpts', 'ppg', 'rec', 'rec_ypg', 'ts_per_rr', 'yprr', 'first_down_rec_rate', 'imp_per_g'],
                labels: ['FPTS', 'PPG', 'REC', 'recYPG', 'TS%', 'YPRR', '1DRR', 'IMP/G'],
                maxRank: 24
            }
        };

        async function renderGameLogs(gameLogs, player, playerRanks) {
            // Store current player for modal panel interactions (e.g., radar chart)
            state.currentGameLogsPlayer = player;
            state.currentGameLogsPlayerRanks = playerRanks;
            state.currentGameLogsSummary = {
                fpts: playerRanks?.total_pts,
                ppg: playerRanks?.ppg
            };
            
            // Stats page doesn't require league context (uses sheet data), other pages do
            const league = state.leagues.find(l => l.league_id === state.currentLeagueId);
            if (!league && !state.isGameLogFromStatsPage) return;
            const scoringSettings = league?.scoring_settings || {};
            const fullPlayer = state.players[player.id];
            const playerName = fullPlayer ? `${fullPlayer.first_name} ${fullPlayer.last_name}` : player.name;
            const modalHeader = document.getElementById('modal-header');
            
            // Clean up any existing header containers
            const existingContainer = modalHeader.querySelector('.modal-header-left-container');
            if (existingContainer) existingContainer.remove();
            
            const modalHeaderLeftContainer = document.createElement('div');
            modalHeaderLeftContainer.className = 'modal-header-left-container';
            const posTag = document.createElement('div');
            posTag.className = `player-tag modal-pos-tag ${player.pos}`;
            posTag.textContent = player.pos;
            modalHeaderLeftContainer.appendChild(posTag);
            const teamKey = (player.team || 'FA').toUpperCase();
            const logoKeyMap = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
            const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
            const src = `../assets/NFL-Tags_webp/${normalizedKey}.webp`;
            const teamLogoChip = document.createElement('div');
            teamLogoChip.className = 'player-tag modal-team-logo-chip';
            teamLogoChip.dataset.team = teamKey;
            teamLogoChip.innerHTML = (player.team && player.team !== 'FA')
              ? `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="24" height="24" loading="eager">`
              : `<span>FA</span>`;
            modalHeaderLeftContainer.appendChild(teamLogoChip);
            modalHeader.insertBefore(modalHeaderLeftContainer, modalHeader.firstChild);
            if (modalPlayerVitals) {
                modalPlayerVitals.innerHTML = '';
                const vitals = getPlayerVitals(player.id);
                modalPlayerVitals.appendChild(createPlayerVitalsElement(vitals, { variant: 'modal', pos: player.pos }));
            }
            // Render summary chips
            const summaryChipsContainer = document.getElementById('modal-summary-chips');
            summaryChipsContainer.innerHTML = `
                <div class="gamelogs-summary-chip">
                    <h4>
                        <span class="chip-header-value" style="color: ${getConditionalColorByRank(playerRanks.posRank, player.pos)}">${playerRanks.total_pts} </span>
                        <span class="chip-unit"> FPTS</span>
                    </h4>
                    <div class="chip-values">
                         <span class="pos-rank-container">
                            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                            <span style="color: ${getConditionalColorByRank(playerRanks.posRank, player.pos)}">${playerRanks.posRank || 'NA'}</span>
                        </span>
                        <span class="chip-separator">•</span>
                        <span style="color: ${getRankColor(playerRanks.overallRank)}">${typeof playerRanks.overallRank === 'number' ? '#' + playerRanks.overallRank : 'NA'}</span>
                    </div>
                </div>
                <div class="gamelogs-summary-chip">
                    <h4>
                        <span class="chip-header-value" style="color: ${getConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${playerRanks.ppg}</span>
                        <span class="chip-unit"> PPG</span>
                    </h4>
                    <div class="chip-values">
                        <span class="pos-rank-container">
                            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                            <span style="color: ${getConditionalColorByRank(playerRanks.ppgPosRank, player.pos)}">${playerRanks.ppgPosRank || 'NA'}</span>
                        </span>
                      <span class="chip-separator">•</span>
                        <span style="color: ${getRankColor(playerRanks.ppgOverallRank)}">${typeof playerRanks.ppgOverallRank === 'number' ? '#' + playerRanks.ppgOverallRank : 'NA'}</span>
                    </div>
                </div>
                <div class="gamelogs-summary-chip">
                    <h4>
                        <span class="chip-header-value" style="color: ${getKtcColor(player.ktc)}">${player.ktc}</span>
                        <span class="chip-unit"> KTC</span>
                    </h4>
                    <div class="chip-values">
                        <span class="pos-rank-container">
                            <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                            <span style="color: ${getConditionalColorByRank(parseInt(player.posRank?.split('·')[1], 10), player.pos)}">${player.posRank?.split('·')[1] || 'NA'}</span>
                        </span>
                        <span class="chip-separator">•</span>
                        <span style="color: ${getRankColor(player.overallRank)}">${typeof player.overallRank === 'number' ? '#' + player.overallRank : 'NA'}</span>
                    </div>
                </div>
            `;
            modalBody.innerHTML = ''; // Clear existing content
            if (!gameLogs || gameLogs.length === 0) {
                const noLogsEl = document.createElement('p');
                noLogsEl.className = 'no-logs';
                noLogsEl.textContent = `No game logs found for ${playerName} for the current season.`;
                modalBody.appendChild(noLogsEl);
                if (statsKeyContainer) {
                    statsKeyContainer.classList.add('hidden');
                    modalBody.appendChild(statsKeyContainer);
                }
                if (radarChartContainer) {
                    radarChartContainer.classList.add('hidden');
                    modalBody.appendChild(radarChartContainer);
                }
                if (newsContainer) {
                    newsContainer.classList.add('hidden');
                    modalBody.appendChild(newsContainer);
                }
                return;
            }
            const statLabels = buildStatLabels();
const qbStatOrder = [
  'fpts',
  'proj',
  'pass_rtg',
  'pass_yd',
  'pass_td',
  'cmp_pct',
  'yds_total',
  'rush_yd',
  'rush_td',
  'pass_att',
  'pass_cmp',
  'pass_fd',
  'imp_per_g',
  'pass_imp',
  'pass_imp_per_att',
  'rush_att',
  'ypc',
  'ttt',
  'prs_pct',
  'pass_sack',
  'pass_int',
  'fum',
  'fpoe'
];
const rbStatOrder = [
  'fpts',
  'proj',
  'snp_pct',
  'rush_att',
  'rush_yd',
  'ypc',
  'rush_td',
  'rec',
  'rec_yd',
  'rec_tgt',
  'yds_total',
  'elu',
  'mtf_per_att',
  'yco_per_att',  
  'mtf',
  'rush_yac',
  'rush_fd',
  'rec_td',
  'rec_fd',
  'rec_yar',
  'imp_per_g',
  'fum',
  'fpoe'
];
const wrTeStatOrder = [
  'fpts',
  'proj',
  'snp_pct',
  'rec_tgt',
  'rec',
  'ts_per_rr',
  'rec_yd',
  'rec_td',
  'yprr',
  'rec_fd',
  'first_down_rec_rate',
  'rec_yar',
  'ypr',
  'imp_per_g',
  'rr',
  'fpoe',
  'yds_total',
  'rush_att',
  'rush_yd',
  'rush_td',
  'ypc',
  'fum'
];

            const statGroupByKey = new Map();
            const assignStatGroup = (group, keys) => {
                for (const key of keys) statGroupByKey.set(key, group);
            };
            assignStatGroup('all', ['fpts', 'proj', 'snp_pct', 'yds_total', 'imp_per_g', 'fum', 'fpoe']);
            assignStatGroup('passing', [
                'pass_rtg', 'pass_yd', 'pass_td', 'cmp_pct', 'pass_att', 'pass_cmp', 'pass_fd',
                'pass_imp', 'pass_imp_per_att', 'ttt', 'prs_pct', 'pass_sack', 'pass_int'
            ]);
            assignStatGroup('rushing', [
                'rush_att', 'rush_yd', 'ypc', 'rush_td', 'rush_fd', 'elu', 'mtf_per_att',
                'yco_per_att', 'mtf', 'rush_yac'
            ]);
            assignStatGroup('receiving', [
                'rec', 'rec_yd', 'rec_tgt', 'rec_td', 'rec_fd', 'rec_yar', 'ypr', 'yprr',
                'ts_per_rr', 'first_down_rec_rate', 'rr'
            ]);
            let orderedStatKeys;
            if (player.pos === 'QB') orderedStatKeys = qbStatOrder;
            else if (player.pos === 'RB') orderedStatKeys = rbStatOrder;
            else if (player.pos === 'WR' || player.pos === 'TE') orderedStatKeys = wrTeStatOrder;
            else orderedStatKeys = ['fpts', 'pass_att', 'pass_cmp', 'pass_yd', 'pass_td', 'pass_fd', 'imp_per_g', 'pass_rtg', 'pass_imp', 'pass_imp_per_att', 'rush_att', 'rush_yd', 'ypc', 'rush_td', 'rush_fd', 'ttt', 'prs_pct', 'mtf', 'mtf_per_att', 'rush_yac', 'yco_per_att', 'rec_tgt', 'rec', 'rec_yd', 'rec_td', 'rec_fd', 'rec_yar', 'ypr', 'yprr', 'ts_per_rr', 'rr', 'fum', 'snp_pct', 'yds_total', 'fpoe'];
            const container = document.createElement('div');
            container.className = 'game-logs-table-container';
            const COLUMN_WIDTHS = {
                week: 56,
                proj: 34,
                snp_pct: 44,
                ts_per_rr: 34,
                first_down_rec_rate: 30,
                yds_total: 37,
                rush_att: 34,
                rush_td: 35,
                rush_yd: 44,
                rec_tgt: 44,
                rec: 36,
                rec_yd: 38,
                rec_td: 44,
                ypr: 40,
                yprr: 42,
                imp_per_g: 48,
                pass_rtg: 48,
                pass_yd: 40,
                pass_td: 38,
                pass_att: 38,
                pass_cmp: 38,
                pass_imp_per_att: 44,
                prs_pct: 42,
                ttt: 40,
                yco_per_att: 44,
                ypc: 40,
                mtf_per_att: 44,
                fpts: 45,
                ktc: 80,
                pass_fd: 36,
                pass_imp: 36,
                pass_int: 36,
                pass_sack: 36,
                rush_fd: 36,
                mtf: 36,
                elu: 36,
                rush_yac: 36,
                rec_fd: 36,
                rec_yar: 36,
                rr: 36,
                imp: 36,
                fum: 36,
                fpoe: 36,
                ypg: 36,
                pa_ypg: 36,
                ru_ypg: 36,
                rec_ypg: 36
        };
            const DEFAULT_COLUMN_WIDTH = 54;
            const tableColumns = [{
                id: 'week',
                accessorKey: 'week',
                header: () => 'WK  ·  VS ',
                size: COLUMN_WIDTHS.week,
                meta: {
                    headerClass: 'week-column-header',
                    cellClass: 'week-cell',
                    footerClass: 'week-column-header',
                    statKey: null
                }
            }];
            for (const key of orderedStatKeys) {
                if (!statLabels[key]) continue;
                const statGroup = statGroupByKey.get(key);
                tableColumns.push({
                    id: key,
                    accessorKey: key,
                    header: () => statLabels[key],
                    size: COLUMN_WIDTHS[key] || DEFAULT_COLUMN_WIDTH,
                    meta: {
                        headerClass: statGroup ? `gamelog-header-${statGroup}` : undefined,
                        cellClass: key === 'proj' ? 'proj-cell' : undefined,
                        footerClass: key === 'proj' ? 'proj-cell' : undefined,
                        statKey: key
                    }
                });
            }
            const totalColumns = tableColumns.length;
            const tableRows = [];
            const rowsMeta = [];
            const gameLogsWithData = [];
            const gameLogsByWeek = new Map(gameLogs.map(entry => [parseInt(entry.week, 10), entry]));
            const createTextDescriptor = (text, style) => ({
                render: (td) => {
                    td.textContent = text;
                    if (style) Object.assign(td.style, style);
                }
            });
            const getProjectionDisplayValue = (statLine, playerId, week) => {
                // First try the provided statLine (for played weeks)
                if (statLine && Object.prototype.hasOwnProperty.call(statLine, 'proj')) {
                    const rawValue = statLine.proj;
                    // Always return as string, even empty strings
                    return String(rawValue);
                }
                // For unplayed weeks, check weekly stats directly
                const weeklyStat = state.playerWeeklyStats?.[week]?.[playerId];
                if (weeklyStat && Object.prototype.hasOwnProperty.call(weeklyStat, 'proj')) {
                    const rawValue = weeklyStat.proj;
                    // Always return as string, even empty strings
                    return String(rawValue);
                }
                return '';
            };
            for (let week = 1; week <= MAX_DISPLAY_WEEKS; week++) {
                const weekStatsEntry = gameLogsByWeek.get(week) || null;
                const stats = weekStatsEntry?.stats || null;
                const isProjectionWeek = state.playerProjectionWeeks?.[week] === true;
                const sheetStatsForWeek = state.playerWeeklyStats?.[week]?.[player.id] || null;
                const opponent = stats?.opponent || null;
                const isByeWeek = opponent === 'BYE';
                const hasSheetStats = !!sheetStatsForWeek && Object.entries(sheetStatsForWeek).some(([statKey, statVal]) => {
                    if (!statLabels[statKey] || statKey === 'proj') return false;
                    return typeof statVal === 'number';
                });
                const hasRecordedStat = stats
                    ? orderedStatKeys.some(key => {
                        if (!statLabels[key] || key === 'proj') return false;
                        return typeof stats[key] === 'number';
                    })
                    : false;
                const liveFptsValue = typeof stats?.fpts === 'number' && Number.isFinite(stats.fpts) ? stats.fpts : null;
                const isLiveWeek = stats?.__live === true || (liveFptsValue !== null && !isProjectionWeek);
                const suppressNonFptsForLiveOnly = isLiveWeek && !hasSheetStats;
                const isUnplayedWeek = !isLiveWeek && (isProjectionWeek || isByeWeek || !hasRecordedStat);
                const rowMeta = {
                    week,
                    isPlayed: !isUnplayedWeek,
                    rowClasses: []
                };
                const rowData = { __meta: rowMeta };
                if (isByeWeek) rowMeta.rowClasses.push('bye-week-row');
                if (isUnplayedWeek) rowMeta.rowClasses.push('unplayed-week-row');
                else if (isLiveWeek) rowMeta.rowClasses.push('live-week-row');
                const opponentRankColor = getOpponentRankColor(stats?.opponent_rank);
                rowData.week = {
                    render: (td) => {
                        const weekTag = document.createElement('div');
                        weekTag.className = 'gamelog-week-tag';
                        const weekNumberLine = document.createElement('div');
                        weekNumberLine.className = 'gamelog-week-tag-number';
                        weekNumberLine.textContent = `WK-${week}`;
                        weekTag.appendChild(weekNumberLine);
                        if (opponent) {
                            const opponentLine = document.createElement('div');
                            opponentLine.className = 'gamelog-week-tag-opponent';
                            if (isByeWeek) {
                                opponentLine.textContent = 'BYE';
                            } else {
                                const opponentText = document.createElement('span');
                                opponentText.className = 'gamelog-week-tag-opponent-text';
                                opponentText.textContent = opponent;
                                if (opponentRankColor) opponentText.style.color = opponentRankColor;
                                opponentLine.appendChild(opponentText);
                                const opponentRank = stats?.opponent_rank;
                                const opponentRankDisplay = getRankDisplayText(opponentRank);
                                if (opponentRankDisplay !== 'NA') {
                                    const separator = document.createElement('span');
                                    separator.className = 'gamelog-week-tag-separator';
                                    separator.textContent = ' • ';
                                    opponentLine.appendChild(separator);
                                    const rankSpan = document.createElement('span');
                                    rankSpan.className = 'gamelog-week-tag-rank';
                                    if (opponentRankColor) rankSpan.style.color = opponentRankColor;
                                    const rankNumber = document.createElement('span');
                                    rankNumber.className = 'gamelog-week-tag-rank-number';
                                    rankNumber.textContent = opponentRank;
                                    rankSpan.appendChild(rankNumber);
                                    const suffix = document.createElement('span');
                                    suffix.className = 'gamelog-week-tag-rank-suffix';
                                    const j = opponentRank % 10;
                                    const k = opponentRank % 100;
                                    if (j === 1 && k !== 11) suffix.textContent = 'st';
                                    else if (j === 2 && k !== 12) suffix.textContent = 'nd';
                                    else if (j === 3 && k !== 13) suffix.textContent = 'rd';
                                    else suffix.textContent = 'th';
                                    rankSpan.appendChild(suffix);
                                    opponentLine.appendChild(rankSpan);
                                }
                            }
                            weekTag.appendChild(opponentLine);
                        }
                        td.textContent = '';
                        td.appendChild(weekTag);
                    }
                };
                for (const key of orderedStatKeys) {
                    if (!statLabels[key]) continue;
                    if (isUnplayedWeek) {
                        if (key === 'proj') {
                            const projValue = getProjectionDisplayValue(stats, player.id, week);
                            const display = projValue === undefined || projValue === null ? '' : String(projValue);
                            const designationMeta = parseInjuryDesignation(display);
                            rowData[key] = createTextDescriptor(display, { color: designationMeta ? designationMeta.color : '' });
                        } else {
                            rowData[key] = createTextDescriptor('-', { color: '' });
                        }
                        continue;
                    }
                    if (suppressNonFptsForLiveOnly && key !== 'fpts' && key !== 'proj') {
                        rowData[key] = createTextDescriptor('-');
                        continue;
                    }
                    if (!weekStatsEntry || !stats) {
                        rowData[key] = createTextDescriptor('-');
                        continue;
                    }
                    if (key === 'proj') {
                        const projValue = getProjectionDisplayValue(stats, player.id, week);
                        const display = projValue === undefined || projValue === null ? '' : String(projValue);
                        const designationMeta = parseInjuryDesignation(display);
                        rowData[key] = createTextDescriptor(display, { color: designationMeta ? designationMeta.color : '' });
                        continue;
                    }
                    let value;
                    if (NO_FALLBACK_KEYS.has(key)) {
                        const raw = stats[key];
                        value = (typeof raw === 'number') ? raw : null;
                    } else if (key === 'fpts') {
                        // Stats page uses sheet FPT_PPR, rosters page uses league-specific matchup data
                        if (state.isGameLogFromStatsPage) {
                            // Use the FPT_PPR from the weekly sheet - no fallback
                            value = (typeof stats['fpt_ppr'] === 'number') ? stats['fpt_ppr'] : null;
                        } else if (state.matchupDataLoaded && state.leagueMatchupStats[week]?.[player.id] !== undefined) {
                            // Use league-specific matchup data - no fallback
                            value = state.leagueMatchupStats[week][player.id];
                        } else {
                            // No data available
                            value = null;
                        }
                    }
                    else if (key === 'ypc') value = (stats['rush_att'] || 0) > 0 ? ((stats['rush_yd'] || 0) / stats['rush_att']) : 0;
                    else if (key === 'yco_per_att') value = (stats['rush_att'] || 0) > 0 ? ((stats['rush_yac'] || 0) / stats['rush_att']) : 0;
                    else if (key === 'mtf_per_att') value = (stats['rush_att'] || 0) > 0 ? ((stats['mtf'] || 0) / stats['rush_att']) : 0;
                    else if (key === 'pass_imp_per_att') {
                        const passImp = stats['pass_imp'];
                        const passAtt = stats['pass_att'];
                        if (typeof stats[key] === 'number') value = stats[key];
                        else if (typeof passImp === 'number' && typeof passAtt === 'number' && passAtt > 0) value = (passImp / passAtt) * 100;
                        else value = 0;
                    }
                    else if (key === 'ts_per_rr') {
                        if (typeof stats[key] === 'number') value = stats[key];
                        else {
                            const routes = stats['rr'] || 0;
                            const targets = stats['rec_tgt'] || 0;
                            value = routes > 0 ? (targets / routes) * 100 : 0;
                        }
                    }
                    else if (key === 'yprr') {
                        if (typeof stats[key] === 'number') value = stats[key];
                        else {
                            const routes = stats['rr'] || 0;
                            const yards = stats['rec_yd'] || 0;
                            value = routes > 0 ? yards / routes : 0;
                        }
                    }
                    else if (key === 'ypr') {
                        if (typeof stats[key] === 'number') value = stats[key];
                        else {
                            const receptions = stats['rec'] || 0;
                            const yards = stats['rec_yd'] || 0;
                            value = receptions > 0 ? yards / receptions : 0;
                        }
                    }
                    else if (key === 'first_down_rec_rate') {
                        if (typeof stats[key] === 'number') value = stats[key];
                        else {
                            const rec_fd = stats['rec_fd'] || 0;
                            const rec = stats['rec'] || 0;
                            value = rec > 0 ? (rec_fd / rec) : 0;
                        }
                    }
                    else if (key === 'imp_per_g') {
                        if (typeof stats[key] === 'number') value = stats[key];
                        else value = stats['imp'] || 0;
                    }
                    else if (key === 'prs_pct' || key === 'snp_pct' || key === 'cmp_pct') value = typeof stats[key] === 'number' ? stats[key] : 0;
                    else if (key === 'ttt') value = typeof stats[key] === 'number' ? stats[key] : 0;
                    else value = stats[key] || 0;
                    let displayValue;
                    if (value === null || typeof value !== 'number') displayValue = 'N/A';
                    else if (key === 'yco_per_att') displayValue = value.toFixed(2);
                    else if (key === 'mtf_per_att' || key === 'ypc' || key === 'ttt' || key === 'ypr' || key === 'yprr' || key === 'first_down_rec_rate') displayValue = value.toFixed(2);
                    else if (key === 'pass_imp_per_att' || key === 'prs_pct' || key === 'snp_pct' || key === 'ts_per_rr' || key === 'cmp_pct') displayValue = formatPercentage(value);
                    else if (key === 'pass_rtg' || key === 'fpts') displayValue = value.toFixed(1);
                    else displayValue = Number.isInteger(value) ? String(value) : value.toFixed(2);
                    rowData[key] = createTextDescriptor(displayValue);
                }
                if (!isUnplayedWeek && weekStatsEntry) {
                    gameLogsWithData.push(weekStatsEntry);
                }
                tableRows.push(rowData);
                rowsMeta.push(rowMeta);
            }
            const sleeperCurrentWeek = Number.isFinite(state.currentNflWeek) ? state.currentNflWeek : null;
            let dividerIndex = rowsMeta.length;
            if (Number.isFinite(sleeperCurrentWeek)) {
                const currentWeekIndex = rowsMeta.findIndex(meta => meta.week === sleeperCurrentWeek);
                if (currentWeekIndex !== -1) {
                    dividerIndex = rowsMeta[currentWeekIndex].isPlayed ? currentWeekIndex + 1 : currentWeekIndex;
                }
            }
            if (!Number.isFinite(dividerIndex)) dividerIndex = rowsMeta.length;
            if (!rowsMeta.some(meta => meta.isPlayed)) dividerIndex = 0;
            dividerIndex = Math.max(0, Math.min(dividerIndex, rowsMeta.length));
            let tableCore;
            try {
                tableCore = await ensureTableCoreLoaded();
            } catch (error) {
                console.error('Failed to load TanStack Table library', error);
                tableCore = null;
            }
            let tableInstance = null;
            let columnSizes = tableColumns.map(col => Number.isFinite(col.size) ? col.size : DEFAULT_COLUMN_WIDTH);
            if (tableCore) {
                try {
                    const initialColumnOrder = tableColumns.map(c => c.id);
                    tableInstance = tableCore.createTable({
                        data: tableRows,
                        columns: tableColumns,
                        state: { columnOrder: initialColumnOrder },
                        onStateChange: () => {},
                        defaultColumn: { size: DEFAULT_COLUMN_WIDTH, minSize: 64 },
                        columnResizeMode: 'onChange',
                        getCoreRowModel: tableCore.getCoreRowModel(),
                        renderFallbackValue: ''
                    });
                    if (typeof tableInstance.getVisibleLeafColumns === 'function') {
                        const leaf = tableInstance.getVisibleLeafColumns();
                        if (Array.isArray(leaf) && leaf.length === tableColumns.length) {
                            columnSizes = leaf.map((col, i) => {
                                const s = typeof col.getSize === 'function' ? col.getSize() : undefined;
                                return Number.isFinite(s) ? s : (Number.isFinite(tableColumns[i].size) ? tableColumns[i].size : DEFAULT_COLUMN_WIDTH);
                            });
                        }
                    }
                } catch (e) {
                    console.error('TanStack createTable failed; using manual renderer', e);
                    tableInstance = null;
                }
            }
            const createSectionTable = () => {
                const table = document.createElement('table');
                table.className = 'game-logs-table';
                const colgroup = document.createElement('colgroup');
                columnSizes.forEach(size => {
                    const col = document.createElement('col');
                    col.style.width = `${size}px`;
                    colgroup.appendChild(col);
                });
                table.appendChild(colgroup);
                return table;
            };
            const headerWrapper = document.createElement('div');
            headerWrapper.className = 'game-logs-table-header';
            const headerTable = createSectionTable();
            const tableHeaderThead = document.createElement('thead');
            headerTable.appendChild(tableHeaderThead);
            headerWrapper.appendChild(headerTable);
            const bodyWrapper = document.createElement('div');
            bodyWrapper.className = 'game-logs-table-body';
            const bodyTable = createSectionTable();
            const tableBodyTbody = document.createElement('tbody');
            bodyTable.appendChild(tableBodyTbody);
            bodyWrapper.appendChild(bodyTable);
            const footerWrapper = document.createElement('div');
            footerWrapper.className = 'game-logs-table-footer';
            const footerTable = createSectionTable();
            const tableFooterTfoot = document.createElement('tfoot');
            footerTable.appendChild(tableFooterTfoot);
            footerWrapper.appendChild(footerTable);
            const applyCellDescriptor = (td, descriptor) => {
                td.textContent = '';
                td.innerHTML = '';
                if (!descriptor) return;
                if (typeof descriptor.render === 'function') descriptor.render(td);
            };
            if (tableInstance && typeof tableInstance.getHeaderGroups === 'function') {
                tableInstance.getHeaderGroups().forEach(group => {
                    const tr = document.createElement('tr');
                    group.headers.forEach((header, idx) => {
                        const th = document.createElement('th');
                        const meta = header.column.columnDef.meta;
                        if (meta?.headerClass) meta.headerClass.split(' ').forEach(cls => { if (cls) th.classList.add(cls); });
                        if (!header.isPlaceholder) {
                            const hv = header.column.columnDef.header;
                            th.textContent = typeof hv === 'function' ? hv(header.getContext()) : (hv || '');
                        }
                        const w = columnSizes[idx] || DEFAULT_COLUMN_WIDTH;
                        th.style.width = `${w}px`; th.style.minWidth = `${w}px`; th.style.maxWidth = `${w}px`;
                        tr.appendChild(th);
                    });
                    tableHeaderThead.appendChild(tr);
                });
            } else {
                const tr = document.createElement('tr');
                tableColumns.forEach((col, idx) => {
                    const th = document.createElement('th');
                    if (col.meta?.headerClass) col.meta.headerClass.split(' ').forEach(cls => { if (cls) th.classList.add(cls); });
                    const label = typeof col.header === 'function' ? col.header({}) : col.header;
                    th.textContent = label || '';
                    const w = columnSizes[idx] || DEFAULT_COLUMN_WIDTH;
                    th.style.width = `${w}px`; th.style.minWidth = `${w}px`; th.style.maxWidth = `${w}px`;
                    tr.appendChild(th);
                });
                tableHeaderThead.appendChild(tr);
            }
            if (tableInstance && typeof tableInstance.getRowModel === 'function') {
                const rowModel = tableInstance.getRowModel();
                rowModel.rows.forEach((row, index) => {
                    const tr = document.createElement('tr');
                    const meta = rowsMeta[index];
                    if (meta) { meta.domRow = tr; meta.rowClasses.forEach(cls => tr.classList.add(cls)); }
                    row.getVisibleCells().forEach((cell, cIdx) => {
                        const td = document.createElement('td');
                        const columnMeta = cell.column.columnDef.meta;
                        if (columnMeta?.cellClass) columnMeta.cellClass.split(' ').forEach(cls => { if (cls) td.classList.add(cls); });
                        applyCellDescriptor(td, cell.getValue());
                        const w = columnSizes[cIdx] || DEFAULT_COLUMN_WIDTH;
                        td.style.width = `${w}px`; td.style.minWidth = `${w}px`; td.style.maxWidth = `${w}px`;
                        tr.appendChild(td);
                    });
                    tableBodyTbody.appendChild(tr);
                });
            } else {
                tableRows.forEach((rowData, index) => {
                    const tr = document.createElement('tr');
                    const meta = rowsMeta[index];
                    if (meta) { meta.domRow = tr; meta.rowClasses.forEach(cls => tr.classList.add(cls)); }
                    tableColumns.forEach((col, cIdx) => {
                        const td = document.createElement('td');
                        if (col.meta?.cellClass) col.meta.cellClass.split(' ').forEach(cls => { if (cls) td.classList.add(cls); });
                        const descriptor = rowData[col.id];
                        if (descriptor && typeof descriptor.render === 'function') descriptor.render(td);
                        const w = columnSizes[cIdx] || DEFAULT_COLUMN_WIDTH;
                        td.style.width = `${w}px`; td.style.minWidth = `${w}px`; td.style.maxWidth = `${w}px`;
                        tr.appendChild(td);
                    });
                    tableBodyTbody.appendChild(tr);
                });
            }
            const totalTableWidth = columnSizes.reduce((sum, size) => sum + size, 0);
            if (Number.isFinite(totalTableWidth) && totalTableWidth > 0) {
                const widthPx = `${totalTableWidth}px`;
                headerTable.style.minWidth = widthPx;
                headerTable.style.width = widthPx;
                bodyTable.style.minWidth = widthPx;
                bodyTable.style.width = widthPx;
                footerTable.style.minWidth = widthPx;
                footerTable.style.width = widthPx;
            }
            if (rowsMeta.length > 0) {
                const dividerRow = document.createElement('tr');
                dividerRow.className = 'week-divider-row';
                const dividerTd = document.createElement('td');
                dividerTd.colSpan = totalColumns;
                dividerRow.appendChild(dividerTd);
                const referenceRow = rowsMeta[dividerIndex]?.domRow || null;
                tableBodyTbody.insertBefore(dividerRow, referenceRow);
            }
            // Add table footer for totals
            state.currentGameLogsFooterStats = { __gamesPlayed: gameLogsWithData.length };
            if (gameLogsWithData.length > 0) {
                tableFooterTfoot.innerHTML = '';
                // Append a footer header row to mirror the column labels
                const footerHeaderRow = document.createElement('tr');
                tableColumns.forEach((col, idx) => {
                    const th = document.createElement('th');
                    if (idx === 0) th.classList.add('modal-table-footer-label','week-column-header');
                    if (col.meta?.headerClass) {
                        col.meta.headerClass.split(' ').forEach(cls => { if (cls) th.classList.add(cls); });
                    }
                    let headerText = typeof col.header === 'function' ? col.header({}) : col.header;
                    if (col.id === 'week') headerText = 'SZN';
                    th.textContent = headerText || '';
                    const w = columnSizes[idx] || DEFAULT_COLUMN_WIDTH;
                    th.style.width = `${w}px`; th.style.minWidth = `${w}px`; th.style.maxWidth = `${w}px`;
                    footerHeaderRow.appendChild(th);
                });
                tableFooterTfoot.appendChild(footerHeaderRow);
                const footerRow = document.createElement('tr');
                const totalTh = document.createElement('th');
                totalTh.className = 'modal-table-footer-label week-column-header';
                const gamesPlayed = getAdjustedGamesPlayed(player.id, scoringSettings);
                totalTh.innerHTML = `<span class="season-label">2025</span><br><span class="gp-label">(GP: ${gamesPlayed})</span>`;
                const weekColumnSize = columnSizes[0] || DEFAULT_COLUMN_WIDTH;
                totalTh.style.width = `${weekColumnSize}px`;
                totalTh.style.minWidth = `${weekColumnSize}px`;
                totalTh.style.maxWidth = `${weekColumnSize}px`;
                footerRow.appendChild(totalTh);
                const seasonTotals = state.playerSeasonStats?.[player.id] || null;
                const aggregatedTotals = {};
                const snapPctValues = [];
                const statValueCounts = {};
                
                // Store calculated footer stats for radar chart
                const footerStatsForRadar = {};
                
                gameLogsWithData.forEach(weekStats => {
                    for (const key in weekStats.stats) {
                        const statValue = parseFloat(weekStats.stats[key]);
                        if (Number.isNaN(statValue)) continue;
                        if (key === 'snp_pct') {
                            snapPctValues.push(statValue);
                        } else {
                            aggregatedTotals[key] = (aggregatedTotals[key] || 0) + statValue;
                        }
                        statValueCounts[key] = (statValueCounts[key] || 0) + 1;
                    }
                });
                for (let i = 1; i < tableColumns.length; i++) {
                    const column = tableColumns[i];
                    const key = column.meta?.statKey;
                    if (!key || !statLabels[key]) continue;
                    const td = document.createElement('td');
                    const columnSize = columnSizes[i] || DEFAULT_COLUMN_WIDTH;
                    td.style.width = `${columnSize}px`;
                    td.style.minWidth = `${columnSize}px`;
                    td.style.maxWidth = `${columnSize}px`;
                    if (column.meta?.cellClass) {
                        column.meta.cellClass.split(' ').forEach(cls => {
                            if (cls) td.classList.add(cls);
                        });
                    }
                    if (key === 'proj') {
                        td.textContent = '-';
                        footerRow.appendChild(td);
                        continue;
                    }
                    let displayValue;
                    if (NO_FALLBACK_KEYS.has(key)) {
                        const raw = (seasonTotals && typeof seasonTotals[key] === 'number') ? seasonTotals[key] : null;
                        if (raw === null) {
                            displayValue = 'N/A';
                        } else if (key === 'snp_pct' || key === 'prs_pct' || key === 'ts_per_rr' || key === 'cmp_pct') {
                            displayValue = formatPercentage(raw);
                        } else {
                            displayValue = Number.isInteger(raw) ? String(raw) : Number(raw).toFixed(2);
                        }
                    } else if (key === 'fpts') {
                        // Stats page uses season total from passed data, rosters page sums matchup data
                        if (state.isGameLogFromStatsPage) {
                            // Use season total passed from stats.js
                            const statsData = state.statsPagePlayerData;
                            const seasonFpts = statsData?.fpts || 0;
                            displayValue = seasonFpts.toFixed(1);
                        } else {
                            // Sum league-specific matchup data for rosters page
                            const totalPoints = gameLogsWithData.reduce((sum, week) => {
                                const weekNum = week.week;
                                const playerId = player.id;
                                if (state.matchupDataLoaded && state.leagueMatchupStats[weekNum]?.[playerId] !== undefined) {
                                    return sum + state.leagueMatchupStats[weekNum][playerId];
                                }
                                return sum + 0;
                            }, 0);
                            displayValue = totalPoints.toFixed(1);
                        }
                    } else if (key === 'ppg') {
                        // Calculate PPG from FPTS and games played
                        if (state.isGameLogFromStatsPage) {
                            const statsData = state.statsPagePlayerData;
                            const ppg = statsData?.ppg || 0;
                            displayValue = ppg.toFixed(1);
                        } else {
                            // Calculate from matchup data for rosters page
                            const totalPoints = gameLogsWithData.reduce((sum, week) => {
                                const weekNum = week.week;
                                const playerId = player.id;
                                if (state.matchupDataLoaded && state.leagueMatchupStats[weekNum]?.[playerId] !== undefined) {
                                    return sum + state.leagueMatchupStats[weekNum][playerId];
                                }
                                return sum + 0;
                            }, 0);
                            const gamesPlayed = gameLogsWithData.length;
                            const ppg = gamesPlayed > 0 ? totalPoints / gamesPlayed : 0;
                            displayValue = ppg.toFixed(1);
                        }
                    } else if (key === 'ypc') {
                        const totalYards = seasonTotals && typeof seasonTotals.rush_yd === 'number' ? seasonTotals.rush_yd : (aggregatedTotals['rush_yd'] || 0);
                        const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
                        const avgYpc = totalCarries > 0 ? totalYards / totalCarries : 0;
                        displayValue = avgYpc.toFixed(2);
                    } else if (key === 'yco_per_att') {
                        const totalYco = seasonTotals && typeof seasonTotals.rush_yac === 'number' ? seasonTotals.rush_yac : (aggregatedTotals['rush_yac'] || 0);
                        const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
                        const avgYcoPerCar = totalCarries > 0 ? totalYco / totalCarries : 0;
                        displayValue = avgYcoPerCar.toFixed(2);
                    } else if (key === 'mtf_per_att') {
                        const totalMtf = seasonTotals && typeof seasonTotals.mtf === 'number' ? seasonTotals.mtf : (aggregatedTotals['mtf'] || 0);
                        const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
                        const avgMtfPerAtt = totalCarries > 0 ? totalMtf / totalCarries : 0;
                        displayValue = avgMtfPerAtt.toFixed(2);
                    } else if (key === 'pass_rtg') {
                        if (seasonTotals && typeof seasonTotals.pass_rtg === 'number') {
                            const rating = seasonTotals.pass_rtg;
                            displayValue = Number.isInteger(rating) ? String(rating) : rating.toFixed(1);
                        } else {
                            const totalPassRtg = aggregatedTotals['pass_rtg'] || 0;
                            const gamesWithPassAttempts = gameLogsWithData.filter(w => (w.stats['pass_att'] || 0) > 0).length;
                            const avgPassRtg = gamesWithPassAttempts > 0 ? totalPassRtg / gamesWithPassAttempts : 0;
                            displayValue = avgPassRtg.toFixed(1);
                        }
                    } else if (key === 'pass_imp_per_att') {
                        let pctValue = seasonTotals && typeof seasonTotals.pass_imp_per_att === 'number' ? seasonTotals.pass_imp_per_att : null;
                        if (pctValue === null) {
                            const totalPassImp = seasonTotals && typeof seasonTotals.pass_imp === 'number' ? seasonTotals.pass_imp : (aggregatedTotals['pass_imp'] || 0);
                            const totalPassAtt = seasonTotals && typeof seasonTotals.pass_att === 'number' ? seasonTotals.pass_att : (aggregatedTotals['pass_att'] || 0);
                            if (totalPassAtt > 0) pctValue = (totalPassImp / totalPassAtt) * 100;
                            else if (statValueCounts['pass_imp_per_att']) pctValue = (aggregatedTotals['pass_imp_per_att'] || 0) / statValueCounts['pass_imp_per_att'];
                            else pctValue = 0;
                        }
                        displayValue = formatPercentage(pctValue);
                    } else if (key === 'ttt') {
                        let avgTtt = seasonTotals && typeof seasonTotals.ttt === 'number' ? seasonTotals.ttt : null;
                        if (avgTtt === null) {
                            const totalTtt = aggregatedTotals['ttt'] || 0;
                            const count = statValueCounts['ttt'] || 0;
                            avgTtt = count > 0 ? totalTtt / count : 0;
                        }
                        displayValue = Number.isInteger(avgTtt) ? String(avgTtt) : Number(avgTtt).toFixed(2);
                    } else if (key === 'prs_pct') {
                        let pctValue = seasonTotals && typeof seasonTotals.prs_pct === 'number' ? seasonTotals.prs_pct : null;
                        if (pctValue === null) {
                            const total = aggregatedTotals['prs_pct'] || 0;
                            const count = statValueCounts['prs_pct'] || 0;
                            pctValue = count > 0 ? total / count : 0;
                        }
                        displayValue = formatPercentage(pctValue);
                    } else if (key === 'cmp_pct') {
                        let pctValue = seasonTotals && typeof seasonTotals.cmp_pct === 'number' ? seasonTotals.cmp_pct : null;
                        if (pctValue === null) {
                            const total = aggregatedTotals['cmp_pct'] || 0;
                            const count = statValueCounts['cmp_pct'] || 0;
                            pctValue = count > 0 ? total / count : 0;
                        }
                        displayValue = formatPercentage(pctValue);
                    } else if (key === 'snp_pct') {
                        let pctValue = seasonTotals && typeof seasonTotals.snp_pct === 'number' ? seasonTotals.snp_pct : null;
                        if (pctValue === null) {
                            pctValue = snapPctValues.length > 0 ? snapPctValues.reduce((sum, val) => sum + val, 0) / snapPctValues.length : 0;
                        }
                        displayValue = formatPercentage(pctValue);
                    } else if (key === 'imp_per_g') {
                        let impPerGame = seasonTotals && typeof seasonTotals.imp_per_g === 'number' ? seasonTotals.imp_per_g : null;
                        if (impPerGame === null) {
                            const totalImp = seasonTotals && typeof seasonTotals.imp === 'number' ? seasonTotals.imp : (aggregatedTotals['imp'] || 0);
                            const games = seasonTotals && typeof seasonTotals.games_played === 'number' ? seasonTotals.games_played : gameLogsWithData.length;
                            impPerGame = games > 0 ? totalImp / games : 0;
                        }
                        displayValue = Number.isInteger(impPerGame) ? String(impPerGame) : Number(impPerGame).toFixed(2);
                    } else if (key === 'yprr') {
                        let value = seasonTotals && typeof seasonTotals.yprr === 'number' ? seasonTotals.yprr : null;
                        if (value === null) {
                            const totalRoutes = seasonTotals && typeof seasonTotals.rr === 'number' ? seasonTotals.rr : (aggregatedTotals['rr'] || 0);
                            const totalRecYds = seasonTotals && typeof seasonTotals.rec_yd === 'number' ? seasonTotals.rec_yd : (aggregatedTotals['rec_yd'] || 0);
                            value = totalRoutes > 0 ? totalRecYds / totalRoutes : 0;
                        }
                        displayValue = Number.isInteger(value) ? String(value) : Number(value).toFixed(2);
                    } else if (key === 'ts_per_rr') {
                        let pctValue = seasonTotals && typeof seasonTotals.ts_per_rr === 'number' ? seasonTotals.ts_per_rr : null;
                        if (pctValue === null) {
                            const totalRoutes = seasonTotals && typeof seasonTotals.rr === 'number' ? seasonTotals.rr : (aggregatedTotals['rr'] || 0);
                            const totalTargets = seasonTotals && typeof seasonTotals.rec_tgt === 'number' ? seasonTotals.rec_tgt : (aggregatedTotals['rec_tgt'] || 0);
                            pctValue = totalRoutes > 0 ? (totalTargets / totalRoutes) * 100 : 0;
                        }
                        displayValue = formatPercentage(pctValue);
                    } else if (key === 'ypr') {
                        let value = seasonTotals && typeof seasonTotals.ypr === 'number' ? seasonTotals.ypr : null;
                        if (value === null) {
                            const totalReceptions = seasonTotals && typeof seasonTotals.rec === 'number' ? seasonTotals.rec : (aggregatedTotals['rec'] || 0);
                            const totalRecYds = seasonTotals && typeof seasonTotals.rec_yd === 'number' ? seasonTotals.rec_yd : (aggregatedTotals['rec_yd'] || 0);
                            value = totalReceptions > 0 ? totalRecYds / totalReceptions : 0;
                        }
                        displayValue = Number.isInteger(value) ? String(value) : Number(value).toFixed(2);
                    } else if (key === 'first_down_rec_rate') {
                        let value = seasonTotals && typeof seasonTotals.first_down_rec_rate === 'number' ? seasonTotals.first_down_rec_rate : null;
                        if (value === null) {
                            const totalRecFd = seasonTotals && typeof seasonTotals.rec_fd === 'number' ? seasonTotals.rec_fd : (aggregatedTotals['rec_fd'] || 0);
                            const totalRec = seasonTotals && typeof seasonTotals.rec === 'number' ? seasonTotals.rec : (aggregatedTotals['rec'] || 0);
                            value = totalRec > 0 ? (totalRecFd / totalRec) : 0;
                        }
                        displayValue = Number.isInteger(value) ? String(value) : Number(value).toFixed(2);
                    } else {
                        const totalValue = seasonTotals && typeof seasonTotals[key] === 'number' ? seasonTotals[key] : (aggregatedTotals[key] || 0);
                        displayValue = Number.isInteger(totalValue) ? String(totalValue) : Number(totalValue || 0).toFixed(2);
                    }
                    const rankValue = getSeasonRankValue(player.id, key);
                    const rankAnnotation = createRankAnnotation(rankValue, { wrapInParens: false, ordinal: true, variant: 'gamelogs-footer' });
                    rankAnnotation.classList.add('stat-rank-annotation--bulleted');
                    const bulletPrefix = document.createElement('span');
                    bulletPrefix.className = 'stat-rank-bullet';
                    bulletPrefix.textContent = '•';
                    const bulletSuffix = document.createElement('span');
                    bulletSuffix.className = 'stat-rank-bullet';
                    bulletSuffix.textContent = '•';
                    rankAnnotation.insertBefore(bulletPrefix, rankAnnotation.firstChild);
                    rankAnnotation.appendChild(bulletSuffix);
                    // Stack value on first line and rank annotation below with minimal spacing
                    td.textContent = '';
                    const valueSpan = document.createElement('span');
                    valueSpan.className = 'stat-value';
                    valueSpan.textContent = displayValue;
                    td.appendChild(valueSpan);
                    td.appendChild(rankAnnotation);
                    td.classList.add('has-rank-annotation');
                    rankAnnotation.style.color = getConditionalColorByRank(rankValue, player.pos);
                    
                    // Store the calculated numeric value for radar chart
                    // Remove formatting to get raw number
                    const numericValue = parseFloat(displayValue.replace(/[,%]/g, ''));
                    if (!Number.isNaN(numericValue)) {
                        footerStatsForRadar[key] = numericValue;
                    }
                    
                    footerRow.appendChild(td);
                }
                
                // Calculate and store PPG for radar chart (not in sheets, calculated from FPTS)
                if (footerStatsForRadar.fpts !== undefined) {
                    const gamesPlayed = gameLogsWithData.length;
                    footerStatsForRadar.__gamesPlayed = gamesPlayed;
                    if (gamesPlayed > 0) {
                        footerStatsForRadar.ppg = footerStatsForRadar.fpts / gamesPlayed;
                    }
                } else {
                    footerStatsForRadar.__gamesPlayed = gameLogsWithData.length;
                }
                
                // Store calculated footer stats in state for radar chart
                state.currentGameLogsFooterStats = footerStatsForRadar;
                
                tableFooterTfoot.appendChild(footerRow);
                footerWrapper.classList.remove('hidden');
            } else {
                tableFooterTfoot.innerHTML = '';
                footerWrapper.classList.add('hidden');
            }
            // Wrap header/body/footer in a single horizontal scroller so they move in perfect unison
            const hScroll = document.createElement('div');
            hScroll.className = 'game-logs-hscroll';
            const hContent = document.createElement('div');
            hContent.className = 'game-logs-hscroll-content';
            hContent.appendChild(headerWrapper);
            hContent.appendChild(bodyWrapper);
            hContent.appendChild(footerWrapper);
            hScroll.appendChild(hContent);
            container.appendChild(hScroll);
            modalBody.appendChild(container);
            if (statsKeyContainer) {
                statsKeyContainer.classList.add('hidden');
                modalBody.appendChild(statsKeyContainer);
            }
            if (radarChartContainer) {
                radarChartContainer.classList.add('hidden');
                modalBody.appendChild(radarChartContainer);
            }
            if (newsContainer) {
                newsContainer.classList.add('hidden');
                modalBody.appendChild(newsContainer);
            }
            hScroll.scrollLeft = 0;
            bodyWrapper.scrollTop = 0;
            // Route horizontal wheel/trackpad gestures on tbody to the shared scroller
            bodyWrapper.addEventListener('wheel', (e) => {
                if (Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey) {
                    hScroll.scrollLeft += e.deltaX !== 0 ? e.deltaX : e.deltaY;
                    e.preventDefault();
                }
            }, { passive: false });
            // Set player vitals width to match summary chips
            const summaryChipsWidth = summaryChipsContainer.offsetWidth;
            const playerVitalsElement = document.querySelector('.player-vitals--modal');
            if (playerVitalsElement) {
                playerVitalsElement.style.width = `${summaryChipsWidth}px`;
            }
        }
        async function handlePlayerCompare(e) {
            let selectedPlayersWithTeams = [];
            if (state.isStartSitMode) {
                selectedPlayersWithTeams = state.startSitSelections.map(selection => {
                    const fullPlayer = state.players[selection.id];
                    const firstName = (fullPlayer?.first_name || '').trim();
                    const lastName = (fullPlayer?.last_name || '').trim();
                    const playerName = [firstName, lastName].filter(Boolean).join(' ') || selection.label;
                    const normalizedTeam = (selection.team || fullPlayer?.team || 'FA').toUpperCase();
                    const primaryPos = (selection.basePos || fullPlayer?.position || selection.pos || '').toUpperCase();
                    return {
                        id: selection.id,
                        label: selection.label,
                        teamName: state.startSitTeamName || state.userTeamName || 'Start/Sit',
                        name: playerName,
                        pos: primaryPos || selection.pos,
                        displayPos: selection.pos,
                        team: normalizedTeam,
                        side: selection.side
                    };
                });
            } else {
                for (const teamName in state.tradeBlock) {
                    if (Object.prototype.hasOwnProperty.call(state.tradeBlock, teamName)) {
                        const assets = state.tradeBlock[teamName];
                        assets.forEach(asset => {
                            if (asset.pos !== 'DP') {
                                const fullPlayer = state.players[asset.id];
                                const playerName = fullPlayer
                                    ? `${fullPlayer.first_name} ${fullPlayer.last_name}`
                                    : asset.label;
                                const normalizedTeam = (asset.team || fullPlayer?.team || 'FA').toUpperCase();
                                const primaryPos = (asset.basePos || fullPlayer?.position || asset.pos || '').toUpperCase();
                                selectedPlayersWithTeams.push({
                                    ...asset,
                                    teamName,
                                    name: playerName,
                                    pos: primaryPos || asset.pos,
                                    displayPos: asset.pos,
                                    team: normalizedTeam
                                });
                            }
                        });
                    }
                }
            }
            if (state.isStartSitMode) {
                selectedPlayersWithTeams.sort((a, b) => {
                    if (a.side === 'left' && b.side === 'right') return -1;
                    if (a.side === 'right' && b.side === 'left') return 1;
                    return 0;
                });
            } else {
                // Sort to ensure user's player is first
                selectedPlayersWithTeams.sort((a, b) => {
                    if (a.teamName === state.userTeamName) return -1;
                    if (b.teamName === state.userTeamName) return 1;
                    return 0;
                });
            }
            const comparisonModalBody = document.getElementById('comparison-modal-body');
            comparisonModalBody.innerHTML = '<p class="text-center p-4">Loading player comparison...</p>';
            openComparisonModal();
            const playerData = await Promise.all(selectedPlayersWithTeams.map(async (player) => {
                const gameLogs = await fetchGameLogs(player.id);
                const playerRanks = calculatePlayerStatsAndRanks(player.id);
                const seasonStats = state.playerSeasonStats?.[player.id] || null;
                return { ...player, gameLogs, seasonStats, ...playerRanks };
            }));
            renderPlayerComparison(playerData);
        }
        function renderPlayerComparison(players) {
            const comparisonModalBody = document.getElementById('comparison-modal-body');
            comparisonModalBody.innerHTML = ''; // Clear existing content
            const container = document.createElement('div');
            container.className = 'player-comparison-container';
            function escapeHtml(unsafe) {
                if (unsafe === null || unsafe === undefined) return '';
                const str = typeof unsafe === 'string' ? unsafe : String(unsafe);
                return str
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#039;");
            }
            // Player Names Row
            const playerNamesRow = document.createElement('div');
            playerNamesRow.className = 'player-names-row';
            players.forEach(player => {
                const fullPlayer = state.players[player.id];
                const playerName = player.name || (fullPlayer ? `${fullPlayer.first_name} ${fullPlayer.last_name}` : player.label);
                const headerContainer = document.createElement('div');
                headerContainer.className = 'player-name-header-container';
                const nameHeader = document.createElement('div');
                nameHeader.className = 'player-name-header';
                const nameButton = document.createElement('button');
                nameButton.type = 'button';
                nameButton.className = 'player-name-header-link';
                nameButton.textContent = playerName;
                nameButton.onclick = () => {
                    state.isGameLogModalOpenFromComparison = true;
                    const rosterMeta = getPlayerData(player.id, player.displayPos || player.pos || '');
                    const valuations = state.isSuperflex ? state.sflxData[player.id] : state.oneQbData[player.id];
                    const parseNumeric = (value) => {
                        if (typeof value === 'number' && Number.isFinite(value)) return value;
                        if (typeof value === 'string') {
                            const stripped = value.replace(/[^0-9.\-]/g, '');
                            const parsed = Number(stripped);
                            return Number.isFinite(parsed) ? parsed : null;
                        }
                        const parsed = Number(value);
                        return Number.isFinite(parsed) ? parsed : null;
                    };
                    const firstValidNumber = (candidates, { allowZero = false } = {}) => {
                        for (const candidate of candidates) {
                            const parsed = parseNumeric(candidate);
                            if (parsed === null) continue;
                            if (!allowZero && parsed <= 0) continue;
                            return parsed;
                        }
                        return null;
                    };
                    const basePos = (player.pos || rosterMeta.pos || fullPlayer?.position || '').toUpperCase();
                    const canonicalPos = basePos || 'FA';
                    const resolvedTeam = (player.team || rosterMeta.team || fullPlayer?.team || 'FA').toUpperCase();
                    const ktcValue = firstValidNumber([
                        player.ktc,
                        rosterMeta.ktc,
                        valuations?.ktc
                    ]);
                    const overallRankValue = firstValidNumber([
                        player.overallRank,
                        rosterMeta.overallRank,
                        valuations?.overallRank,
                        valuations?.overall_rank_ppr
                    ]);
                    const posRankNumeric = firstValidNumber([
                        player.posRank,
                        rosterMeta.posRank,
                        valuations?.posRank,
                        valuations?.pos_rank_ppr
                    ]);
                    const mergedPlayerData = {
                        id: player.id,
                        name: player.name || playerName,
                        pos: canonicalPos,
                        team: resolvedTeam,
                        ktc: ktcValue,
                        overallRank: overallRankValue ?? null,
                        posRank: posRankNumeric ? `${canonicalPos}·${posRankNumeric}` : null
                    };
                    handlePlayerNameClick(mergedPlayerData);
                };
                const tagsRow = document.createElement('div');
                tagsRow.className = 'player-header-tags';
                const posTag = document.createElement('div');
                posTag.className = `player-tag modal-pos-tag ${player.pos}`;
                posTag.textContent = player.pos;
                const teamKey = (player.team || fullPlayer?.team || 'FA').toUpperCase();
                const logoKeyMap = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
                const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
                const src = `../assets/NFL-Tags_webp/${normalizedKey}.webp`;
                const teamLogoChip = document.createElement('div');
                teamLogoChip.className = 'player-tag modal-team-logo-chip';
                if (teamKey && teamKey !== 'FA') {
                    teamLogoChip.dataset.team = teamKey;
                    teamLogoChip.innerHTML = `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="20" height="20" loading="eager">`;
                } else {
                    teamLogoChip.innerHTML = '<span>FA</span>';
                }
                tagsRow.appendChild(posTag);
                tagsRow.appendChild(teamLogoChip);
                nameHeader.appendChild(nameButton);
                nameHeader.appendChild(tagsRow);
                headerContainer.appendChild(nameHeader);
                playerNamesRow.appendChild(headerContainer);
            });
            container.appendChild(playerNamesRow);
            // Summary Chips Row
            const summaryChipsRow = document.createElement('div');
            summaryChipsRow.className = 'comparison-summary-chips-row';
            players.forEach(player => {
                const summaryChipsContainer = document.createElement('div');
                summaryChipsContainer.className = 'summary-chips-container';
                const compareVitals = createPlayerVitalsElement(getPlayerVitals(player.id), { variant: 'compare', pos: player.pos });
                const overallRankNumber = typeof player.overallRank === 'number' ? player.overallRank : Number(player.overallRank);
                const overallRankDisplay = Number.isFinite(overallRankNumber)
                  ? `#${overallRankNumber}`
                  : (player.overallRank || 'NA');
                const rawPosRank = player.posRank;
                const posRankNumber = typeof rawPosRank === 'number'
                  ? rawPosRank
                  : Number.parseInt(String(rawPosRank).split('·')[1] || String(rawPosRank), 10);
                const posRankDisplay = Number.isFinite(posRankNumber)
                  ? posRankNumber
                  : (rawPosRank || 'NA');
                const posRankColor = Number.isFinite(posRankNumber)
                  ? getConditionalColorByRank(posRankNumber, player.pos)
                  : 'inherit';
                const ppgOverallRankNumber = typeof player.ppgOverallRank === 'number'
                  ? player.ppgOverallRank
                  : Number(player.ppgOverallRank);
                const ppgOverallRankDisplay = Number.isFinite(ppgOverallRankNumber)
                  ? `#${ppgOverallRankNumber}`
                  : (player.ppgOverallRank || 'NA');
                const ppgPosRankNumber = typeof player.ppgPosRank === 'number'
                  ? player.ppgPosRank
                  : Number(player.ppgPosRank);
                const ppgPosRankDisplay = Number.isFinite(ppgPosRankNumber)
                  ? ppgPosRankNumber
                  : (player.ppgPosRank || 'NA');
                const ppgPosRankColor = Number.isFinite(ppgPosRankNumber)
                  ? getConditionalColorByRank(ppgPosRankNumber, player.pos)
                  : 'inherit';
                summaryChipsContainer.innerHTML = `
                  <div class="summary-chip">
                    <h4>
                      <span class="chip-header-value" style="color: ${posRankColor}">${player.total_pts}</span>
                      <span class="chip-unit"> FPTS</span>
                    </h4>
                    <div class="chip-values">
                      <span class="pos-rank-container">
                        <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                        <span style="color: ${posRankColor}">${posRankDisplay}</span>
                      </span>
                      <span class="chip-separator">•</span>
                      <span style="color: ${getRankColor(overallRankNumber)}">${overallRankDisplay}</span>
                    </div>
                  </div>
                  <div class="summary-chip">
                    <h4>
                      <span class="chip-header-value" style="color: ${ppgPosRankColor}">${player.ppg}</span>
                      <span class="chip-unit"> PPG</span>
                    </h4>
                    <div class="chip-values">
                      <span class="pos-rank-container">
                        <span class="chip-pos-rank-label pos-color-${player.pos}">${player.pos}·</span>
                        <span style="color: ${ppgPosRankColor}">${ppgPosRankDisplay}</span>
                      </span>
                      <span class="chip-separator">•</span>
                      <span style="color: ${getRankColor(ppgOverallRankNumber)}">${ppgOverallRankDisplay}</span>
                    </div>
                  </div>
                `;
                summaryChipsContainer.insertBefore(compareVitals, summaryChipsContainer.firstChild);
                summaryChipsRow.appendChild(summaryChipsContainer);
            });
            container.appendChild(summaryChipsRow);
            // Detailed Stats List (compact side-by-side rows)
            const statLabels = buildStatLabels();
            const userPlayer = players[0];
            const otherPlayer = players[1];
            const getStatOrderForPosition = (pos) => {
const qbStatOrder = [
   'fpts',
  'proj',
  'pass_rtg',
  'pass_yd',
  'pass_td',
  'cmp_pct',
  'pa_ypg',
  'yds_total',
  'rush_yd',
  'rush_td',
  'pass_att',
  'pass_cmp',
  'pass_fd',
  'imp_per_g',
  'pass_imp',
  'pass_imp_per_att',
  'rush_att',
  'ypc',
  'ttt',
  'prs_pct',
  'pass_sack',
  'pass_int',
  'fum',
  'fpoe'
];
const rbStatOrder = [
  'fpts',
  'proj',
  'snp_pct',
  'rush_att',
  'rush_yd',
  'ypc',
  'rush_td',
  'rec',
  'rec_yd',
  'rec_tgt',
  'yds_total',
  'ru_ypg',
  'elu',
  'mtf_per_att',
  'yco_per_att',  
  'mtf',
  'rush_yac',
  'rush_fd',
  'rec_td',
  'rec_fd',
  'rec_yar',
  'imp_per_g',
  'fum',
  'fpoe'
];
const wrTeStatOrder = [
  'fpts',
  'proj',
  'snp_pct',
  'rec_tgt',
  'rec',
  'ts_per_rr',
  'rec_yd',
  'rec_td',
  'yprr',
  'rec_fd',
  'first_down_rec_rate',
  'rec_ypg',
  'rec_yar',
  'ypr',
  'imp_per_g',
  'rr',
  'fpoe',
  'yds_total',
  'rush_att',
  'rush_yd',
  'rush_td',
  'ypc',
  'fum'
];
                if (pos === 'QB') return qbStatOrder;
                if (pos === 'RB') return rbStatOrder;
                if (pos === 'WR' || pos === 'TE') return wrTeStatOrder;
                return ['fpts','pass_att','pass_cmp','pass_yd','pass_td','pass_fd','imp_per_g','pass_rtg','pass_imp','pass_imp_per_att','rush_att','rush_yd','ypc','rush_td','rush_fd','ttt','prs_pct','mtf','mtf_per_att','rush_yac','yco_per_att','rec_tgt','rec','rec_yd','rec_td','rec_fd','rec_yar','ypr','yprr','ts_per_rr','rr','fum','snp_pct','yds_total','fpoe'];
            };
            const userPlayerStatOrder = getStatOrderForPosition(userPlayer.pos);
            const otherPlayerStatOrder = getStatOrderForPosition(otherPlayer.pos);
            const commonStats = userPlayerStatOrder.filter(stat => otherPlayerStatOrder.includes(stat));
            const userSpecificStats = userPlayerStatOrder.filter(stat => !otherPlayerStatOrder.includes(stat));
            const otherSpecificStats = otherPlayerStatOrder.filter(stat => !userPlayerStatOrder.includes(stat));
            const orderedStatKeys = [...commonStats, ...userSpecificStats, ...otherSpecificStats];
            const listContainer = document.createElement('div');
            listContainer.className = 'comparison-list';
            const league = state.leagues.find(l => l.league_id === state.currentLeagueId);
            const scoringSettings = league?.scoring_settings || {};
            for (const statKey of orderedStatKeys) {
                if (!statLabels[statKey]) continue;
                // reuse the same calculation logic used previously
                const values = [];
                const displayValues = [];
                let bestValue = -Infinity;
                let bestValueIndices = [];
                for (let i = 0; i < players.length; i++) {
                    const player = players[i];
                    let calculatedValue;
                    let displayValue;
                    const seasonTotals = player.seasonStats || state.playerSeasonStats?.[player.id] || null;
                    const aggregatedTotals = {};
                    const snapPctValues = [];
                    const statValueCounts = {};
                    player.gameLogs.forEach(week => {
                        for (const key in week.stats) {
                            const numericValue = parseFloat(week.stats[key]);
                            if (Number.isNaN(numericValue)) continue;
                            if (key === 'snp_pct') snapPctValues.push(numericValue);
                            else aggregatedTotals[key] = (aggregatedTotals[key] || 0) + numericValue;
                            statValueCounts[key] = (statValueCounts[key] || 0) + 1;
                        }
                    });
                    if (NO_FALLBACK_KEYS.has(statKey)) {
                        const raw = (seasonTotals && typeof seasonTotals[statKey] === 'number') ? seasonTotals[statKey] : null;
                        calculatedValue = (raw === null) ? null : raw;
                        if (raw === null) displayValue = 'N/A';
                        else if (statKey === 'snp_pct' || statKey === 'prs_pct' || statKey === 'ts_per_rr' || statKey === 'cmp_pct') displayValue = formatPercentage(raw);
                        else displayValue = Number.isInteger(raw) ? String(raw) : Number(raw).toFixed(2);
                    } else {
                        const computeStat = (() => {
                            let cv = 0, dv = '0';
                            switch (statKey) {
                                case 'fpts':
                                    // Use league-specific matchup data if available
                                    cv = player.gameLogs.reduce((sum, week) => {
                                        const weekNum = week.week;
                                        const playerId = player.id;
                                        if (state.matchupDataLoaded && state.leagueMatchupStats[weekNum]?.[playerId] !== undefined) {
                                            return sum + state.leagueMatchupStats[weekNum][playerId];
                                        } else {
                                            return sum + calculateFantasyPoints(week.stats, scoringSettings);
                                        }
                                    }, 0);
                                    dv = cv.toFixed(1);
                                    break;
                                case 'ypc': {
                                    const totalYards = seasonTotals && typeof seasonTotals.rush_yd === 'number' ? seasonTotals.rush_yd : (aggregatedTotals['rush_yd'] || 0);
                                    const totalCarries = seasonTotals && typeof seasonTotals.rush_att === 'number' ? seasonTotals.rush_att : (aggregatedTotals['rush_att'] || 0);
                                    cv = totalCarries > 0 ? totalYards / totalCarries : 0;
                                    dv = Number.isInteger(cv) ? String(cv) : Number(cv).toFixed(2);
                                    break;
                                }
                                case 'ypr': {
                                    if (seasonTotals && typeof seasonTotals.ypr === 'number') {
                                        cv = seasonTotals.ypr;
                                    } else {
                                        const totalReceptions = seasonTotals && typeof seasonTotals.rec === 'number' ? seasonTotals.rec : (aggregatedTotals['rec'] || 0);
                                        const totalRecYds = seasonTotals && typeof seasonTotals.rec_yd === 'number' ? seasonTotals.rec_yd : (aggregatedTotals['rec_yd'] || 0);
                                        cv = totalReceptions > 0 ? totalRecYds / totalReceptions : 0;
                                    }
                                    dv = Number.isInteger(cv) ? String(cv) : Number(cv).toFixed(2);
                                    break;
                                }
                                case 'snp_pct': {
                                    const pct = seasonTotals && typeof seasonTotals.snp_pct === 'number'
                                        ? seasonTotals.snp_pct
                                        : (snapPctValues.length > 0 ? snapPctValues.reduce((sum, val) => sum + val, 0) / snapPctValues.length : 0);
                                    cv = pct; dv = formatPercentage(pct); break;
                                }
                                case 'prs_pct': {
                                    const total = aggregatedTotals['prs_pct'] || 0;
                                    const count = statValueCounts['prs_pct'] || 0;
                                    cv = count > 0 ? total / count : 0; dv = formatPercentage(cv); break;
                                }
                                case 'cmp_pct': {
                                    const total = aggregatedTotals['cmp_pct'] || 0;
                                    const count = statValueCounts['cmp_pct'] || 0;
                                    cv = count > 0 ? total / count : 0; dv = formatPercentage(cv); break;
                                }
                                case 'pass_rtg': {
                                    const takeNumeric = (value) => {
                                        if (typeof value === 'number' && Number.isFinite(value)) return value;
                                        const parsed = Number(value);
                                        return Number.isFinite(parsed) ? parsed : null;
                                    };
                                    const computePasserRating = (cmp, att, td, ints, yds) => {
                                        if (!att || att <= 0) return null;
                                        const clamp = (val) => Math.max(0, Math.min(2.375, val));
                                        const a = clamp(((cmp || 0) / att - 0.3) * 5);
                                        const b = clamp(((yds || 0) / att - 3) * 0.25);
                                        const c = clamp(((td || 0) / att) * 20);
                                        const d = clamp(2.375 - (((ints || 0) / att) * 25));
                                        const rating = ((a + b + c + d) / 6) * 100;
                                        return Number.isFinite(rating) ? Number(rating.toFixed(1)) : null;
                                    };
                                    let rating = null;
                                    const seasonPassRating = takeNumeric(seasonTotals?.pass_rtg);
                                    if (seasonPassRating !== null) {
                                        rating = seasonPassRating;
                                    }
                                    if (rating === null) {
                                        const attempts = takeNumeric(seasonTotals?.pass_att) ?? takeNumeric(aggregatedTotals['pass_att']);
                                        const completions = takeNumeric(seasonTotals?.pass_cmp) ?? takeNumeric(aggregatedTotals['pass_cmp']);
                                        const touchdowns = takeNumeric(seasonTotals?.pass_td) ?? takeNumeric(aggregatedTotals['pass_td']);
                                        const interceptions = takeNumeric(seasonTotals?.pass_int) ?? takeNumeric(aggregatedTotals['pass_int']);
                                        const yards = takeNumeric(seasonTotals?.pass_yd) ?? takeNumeric(aggregatedTotals['pass_yd']);
                                        rating = computePasserRating(completions, attempts, touchdowns, interceptions, yards);
                                    }
                                    if (rating === null && statValueCounts['pass_rtg']) {
                                        const totalPassRtg = aggregatedTotals['pass_rtg'] || 0;
                                        const avg = totalPassRtg / statValueCounts['pass_rtg'];
                                        if (Number.isFinite(avg)) rating = Number(avg.toFixed(1));
                                    }
                                    if (rating === null) {
                                        cv = -1;
                                        dv = 'N/A';
                                    } else {
                                        cv = rating;
                                        dv = rating.toFixed(1);
                                    }
                                    break;
                                }
                                default: {
                                    const totalValue = seasonTotals && typeof seasonTotals[statKey] === 'number' ? seasonTotals[statKey] : (aggregatedTotals[statKey] || 0);
                                    cv = totalValue; dv = Number.isInteger(totalValue) ? String(totalValue) : Number(totalValue || 0).toFixed(2);
                                }
                            }
                            return { cv, dv };
                        })();
                        calculatedValue = computeStat.cv;
                        displayValue = computeStat.dv;
                    }
                    const playerStatOrder = getStatOrderForPosition(player.pos);
                    if (!playerStatOrder.includes(statKey)) {
                        displayValue = 'N/A';
                        calculatedValue = -1;
                    }
                    values.push(calculatedValue);
                    displayValues.push(displayValue);
                    if (typeof calculatedValue === 'number' && Number.isFinite(calculatedValue)) {
                        if (calculatedValue > bestValue) { bestValue = calculatedValue; bestValueIndices = [i]; }
                        else if (calculatedValue === bestValue) bestValueIndices.push(i);
                    }
                }
                const leftVal = displayValues[0] || 'N/A';
                const rightVal = displayValues[1] || 'N/A';
                const numericLeft = (typeof values[0] === 'number' && values[0] >= 0) ? values[0] : 0;
                const numericRight = (typeof values[1] === 'number' && values[1] >= 0) ? values[1] : 0;
                const total = numericLeft + numericRight;
                let leftPct = 50, rightPct = 50, neutral = false;
                if (total > 0) { leftPct = Math.round((numericLeft / total) * 100); rightPct = 100 - leftPct; }
                else { neutral = true; }
                const row = document.createElement('div');
                row.className = 'comparison-row';
                const leftValueDiv = document.createElement('div');
                leftValueDiv.className = 'comparison-left';
                leftValueDiv.textContent = escapeHtml(leftVal);
                const rightValueDiv = document.createElement('div');
                rightValueDiv.className = 'comparison-right';
                rightValueDiv.textContent = escapeHtml(rightVal);
                // Append positional rank annotation in parentheses next to each stat value
                // Use getSeasonRankValue to find the player's seasonal/positional rank for this stat
                try {
                    const leftPlayer = players[0];
                    const rightPlayer = players[1];
                    const leftRankVal = getSeasonRankValue(leftPlayer.id, statKey);
                    const rightRankVal = getSeasonRankValue(rightPlayer.id, statKey);
                    if (leftRankVal !== null && leftRankVal !== undefined) {
                        const leftAnnot = createRankAnnotation(leftRankVal, { ordinal: true, variant: 'compare' });
                        leftValueDiv.classList.add('has-rank-annotation');
                        leftValueDiv.appendChild(leftAnnot);
                    }
                    if (rightRankVal !== null && rightRankVal !== undefined) {
                        const rightAnnot = createRankAnnotation(rightRankVal, { ordinal: true, variant: 'compare' });
                        rightValueDiv.classList.add('has-rank-annotation');
                        rightValueDiv.appendChild(rightAnnot);
                    }
                } catch (e) {
                    // fail silently if rank lookup isn't available
                }
                row.innerHTML = `
                    <div class="comparison-center">
                        <div class="comparison-label">${escapeHtml(statLabels[statKey])}</div>
                        <div class="comparison-bar" role="img" aria-label="${escapeHtml(statLabels[statKey])} comparison">
                            <div class="comparison-bar-left" style="width: ${leftPct}%;"></div>
                            <div class="comparison-bar-right" style="width: ${rightPct}%;"></div>
                        </div>
                    </div>
                `;
                row.insertBefore(leftValueDiv, row.firstChild);
                row.appendChild(rightValueDiv);
                if (!neutral) {
                    if (bestValueIndices.length === 1 && bestValueIndices[0] === 0) {
                        leftValueDiv.classList.add('best-stat');
                        row.querySelector('.comparison-bar-right')?.classList.add('worse-stat-bar');
                    }
                    if (bestValueIndices.length === 1 && bestValueIndices[0] === 1) {
                        rightValueDiv.classList.add('best-stat');
                        row.querySelector('.comparison-bar-left')?.classList.add('worse-stat-bar');
                    }
                }
                listContainer.appendChild(row);
            }
            const tableContainer = document.createElement('div');
            tableContainer.className = 'comparison-table-container comparison-list-container';
            tableContainer.appendChild(listContainer);
            container.appendChild(tableContainer);
            comparisonModalBody.appendChild(container);
            const footer = playerComparisonModal.querySelector('.modal-footer');
            const keyContainer = document.getElementById('comparison-stats-key-container');
            if (footer && keyContainer) {
                footer.innerHTML = `
                    <div class="key-chip modal-info-btn">
                        <i class="fa-solid fa-key"></i>
                        <span>Key</span>
                    </div>
                `;
                const statDescriptions = {
                    'fpts': 'Fantasy Points', 'pass_att': 'Passing Attempts', 'pass_cmp': 'Completions', 'pass_yd': 'Passing Yards', 'pass_td': 'Passing Touchdowns', 'pass_fd': 'Passing First Downs', 'imp_per_g': 'Impact per Game', 'pass_rtg': 'Passer Rating', 'pass_imp': 'Passing Impact', 'pass_imp_per_att': 'Passing Impact per Attempt', 'pass_int': 'Interceptions', 'pass_sack': 'Sacks Taken', 'rush_att': 'Carries', 'rush_yd': 'Rushing Yards', 'ypc': 'Yards Per Carry', 'rush_td': 'Rushing Touchdowns', 'rush_fd': 'Rushing First Downs', 'ttt': 'Average Time to Throw', 'prs_pct': 'Pressure Rate', 'mtf': 'Missed Tackles Forced', 'mtf_per_att': 'Missed Tackles Forced per Attempt', 'elu': 'Elusiveness Rating', 'rush_yac': 'Yards After Contact', 'yco_per_att': 'Yards After Contact per Attempt', 'rec_tgt': 'Targets', 'rec': 'Receptions', 'rec_yd': 'Receiving Yards', 'rec_td': 'Receiving Touchdowns', 'rec_fd': 'Receiving First Downs', 'rec_yar': 'Yards After Catch', 'yprr': 'Yards per Route Run', 'first_down_rec_rate': 'First Down Reception Rate', 'ts_per_rr': 'Targets per Route Run', 'rr': 'Routes Run', 'ypr': 'Yards per Reception', 'fum': 'Fumbles Lost', 'snp_pct': 'Snap Percentage', 'yds_total': 'Total Yards (sheet provided)', 'fpoe': 'Fantasy Points Over Expected',
                };
                let listHtml = '<h4>Player Comparison Stats Key<i class="fa-solid fa-square-xmark" id="close-comparison-key"></i></h4><ul>';
                for (const key in statLabels) {
                    if (statDescriptions[key]) {
                        listHtml += `<li><strong>${statLabels[key]}:</strong> ${statDescriptions[key]}</li>`;
                    }
                }
                listHtml += '</ul>';
                keyContainer.innerHTML = listHtml;
                const keyBtn = footer.querySelector('.modal-info-btn');
                if (keyBtn) {
                    keyBtn.addEventListener('click', () => keyContainer.classList.toggle('hidden'));
                }
                const closeBtn = keyContainer.querySelector('#close-comparison-key');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => keyContainer.classList.add('hidden'));
                }
            }
        }
        function populateLeagueSelect(leagues) {
            leagueSelect.innerHTML = '<option>Select a league...</option>';
            leagues.forEach(l => {
                const opt = document.createElement('option');
                opt.value = l.league_id;
                opt.textContent = l.name;
                leagueSelect.appendChild(opt);
            });
            leagueSelect.disabled = false;
        }
        function calibrateTeamCardIntrinsicSize(card) {
            if (!supportsContentVisibility || !rosterContentVisibilityEnabled || !card) return;
            requestAnimationFrame(() => {
                const measuredHeight = card.getBoundingClientRect().height;
                if (measuredHeight > 0) {
                    card.style.setProperty('--team-card-intrinsic-size', `${Math.ceil(measuredHeight)}px`);
                }
            });
        }
        function renderAllTeamData(teams) {
            updateRosterContentVisibility();
            rosterGrid.innerHTML = '';
            rosterGrid.style.justifyContent = ''; // Reset style
            rosterGrid.classList.toggle('start-sit-mode', state.isStartSitMode);
            if (state.isStartSitMode) {
                renderStartSitColumns(teams);
                adjustStickyHeaders();
                syncRosterHeaderPosition();
                return;
            }
            let teamsToRender = teams;
            if (state.isCompareMode) {
                teamsToRender = teams.filter(team => state.teamsToCompare.has(team.teamName));
                rosterGrid.style.justifyContent = 'center';
            }
            
            // Use DocumentFragment for batch DOM insertion
            const fragment = document.createDocumentFragment();
            
            teamsToRender.forEach(team => {
                const columnWrapper = document.createElement('div');
                columnWrapper.className = 'roster-column';
                columnWrapper.dataset.teamName = team.teamName;
                const header = document.createElement('div');
                header.className = 'team-header-item';
                const checkbox = document.createElement('div');
                checkbox.className = 'team-compare-checkbox';
                if (state.teamsToCompare.has(team.teamName)) {
                    checkbox.classList.add('selected');
                }
                checkbox.dataset.teamName = team.teamName;
                const teamNameSpan = document.createElement('span');
                teamNameSpan.className = 'team-name';
                teamNameSpan.textContent = team.teamName;
                if (team.record) {
                    header.title = `${team.teamName} (${team.record})`;
                } else {
                    header.title = team.teamName;
                }
                header.appendChild(checkbox);
                header.appendChild(teamNameSpan);
                if (team.record) {
                    const recordSpan = document.createElement('span');
                    recordSpan.className = 'team-record';
                    recordSpan.textContent = `(${team.record})`;
                    header.appendChild(recordSpan);
                }
                const card = state.currentRosterView === 'positional' ? createPositionalTeamCard(team) : createDepthChartTeamCard(team);
                columnWrapper.appendChild(header);
                columnWrapper.appendChild(card);
                fragment.appendChild(columnWrapper);
                calibrateTeamCardIntrinsicSize(card);
            });
            
            // Single DOM insertion instead of multiple
            rosterGrid.appendChild(fragment);
            
            if (compareSearchInput && compareSearchInput.value) {
                filterTeamsByQuery(compareSearchInput.value);
            }
            adjustStickyHeaders();
            syncRosterHeaderPosition();
        }
        function renderStartSitColumns(teams) {
            const targetTeamName = state.startSitTeamName || state.userTeamName;
            const userTeam = teams.find(team => team.teamName === targetTeamName) || teams.find(team => team.isUserTeam);
            if (!userTeam) {
                return;
            }
            rosterGrid.style.justifyContent = 'center';
            const positions = ['QB', 'RB', 'WR', 'TE'];
            positions.forEach(pos => {
                const columnWrapper = document.createElement('div');
                columnWrapper.className = 'roster-column start-sit-column';
                columnWrapper.dataset.teamName = userTeam.teamName;
                columnWrapper.dataset.position = pos;
                const header = document.createElement('div');
                header.className = 'start-sit-pos-header';
                header.textContent = pos;
                columnWrapper.appendChild(header);
                const cardWrapper = document.createElement('div');
                cardWrapper.className = 'team-card start-sit-card';
                const players = userTeam.allPlayers
                    .filter(player => (player.pos || '').toUpperCase() === pos)
                    .sort((a, b) => (b.ktc || 0) - (a.ktc || 0));
                if (players.length > 0) {
                    players.forEach(player => cardWrapper.appendChild(createPlayerRow(player, userTeam.teamName)));
                } else {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'start-sit-empty';
                    placeholder.textContent = 'None';
                    cardWrapper.appendChild(placeholder);
                }
                const columnShell = document.createElement('div');
                columnShell.className = 'start-sit-column-shell';
                columnShell.appendChild(cardWrapper);
                columnWrapper.appendChild(columnShell);
                rosterGrid.appendChild(columnWrapper);
                calibrateTeamCardIntrinsicSize(cardWrapper);
            });
        }
        function createDepthChartTeamCard(team) {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.innerHTML = `<div class="roster-section starters-section"><h3>Starters</h3></div><div class="roster-section bench-section"><h3>Bench</h3></div><div class="roster-section taxi-section"><h3>Taxi</h3></div><div class="roster-section picks-section"><h3>Draft Picks</h3></div>`;
            const activePos = state.activePositions;
            const filterActive = activePos.size > 0;
            const filterFunc = player => {
                if (!filterActive) return true;
                const isStarActive = activePos.has('STAR');
                // New logic: keep the existing KTC >= 3000 passthrough, but when
                // PPG meets the threshold (>= 9) the player must ALSO have at
                // least 2200 KTC to be considered a star. This prevents low-KTC
                // high-PPG players from slipping through.
                const playerKtc = (player.ktc || 0);
                const playerPpg = (player.ppg || 0);
                const meetsStarCriteria = (playerKtc >= 3900) || (playerPpg >= 12 && playerKtc >= 2900);
                if (isStarActive && !meetsStarCriteria) {
                    return false;
                }
                const posFilters = new Set(activePos);
                posFilters.delete('STAR');
                if (posFilters.size === 0) return true;
                const isFlexActive = posFilters.has('FLX');
                const posMatch = posFilters.has(player.pos);
                const flexMatch = isFlexActive && ['RB', 'WR', 'TE'].includes(player.pos);
                return posMatch || flexMatch;
            };
            const populate = (sel, data, creator) => {
                const el = card.querySelector(sel);
                const filteredData = data.filter(item => item.isPlaceholder || filterFunc(item));
                const h3 = el.querySelector('h3');
                el.innerHTML = '';
                el.appendChild(h3);
                if (filteredData.length > 0) {
                    const fragment = document.createDocumentFragment();
                    filteredData.forEach(item => fragment.appendChild(creator(item, team.teamName)));
                    el.appendChild(fragment);
                } else {
                    el.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
                }
            };
            populate('.starters-section', team.starters, createPlayerRow);
            populate('.bench-section', team.bench, createPlayerRow);
            populate('.taxi-section', team.taxi, createTaxiRow);
            const picksEl = card.querySelector('.picks-section');
            const picksH3 = picksEl.querySelector('h3');
            picksEl.innerHTML = '';
            picksEl.appendChild(picksH3);
            if (team.draftPicks && team.draftPicks.length > 0) {
                const picksFragment = document.createDocumentFragment();
                team.draftPicks.forEach(item => picksFragment.appendChild(createPickRow(item, team.teamName)));
                picksEl.appendChild(picksFragment);
            } else {
                picksEl.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
            }
            return card;
        }
        function createPositionalTeamCard(team) {
            const card = document.createElement('div');
            card.className = 'team-card';
            card.innerHTML = `
                <div class="roster-section qb-section"><h3>QB</h3></div>
                <div class="roster-section rb-section"><h3>RB</h3></div>
                <div class="roster-section wr-section"><h3>WR</h3></div>
                <div class="roster-section te-section"><h3>TE</h3></div>
                <div class="roster-section picks-section"><h3>Draft Picks</h3></div>
            `;
            const activePos = state.activePositions;
            const filterActive = activePos.size > 0;
            const isFlexActive = activePos.has('FLX');
            const isStarActive = activePos.has('STAR');
            const positions = {
                QB: team.allPlayers.filter(p => p.pos === 'QB').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
                RB: team.allPlayers.filter(p => p.pos === 'RB').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
                WR: team.allPlayers.filter(p => p.pos === 'WR').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
                TE: team.allPlayers.filter(p => p.pos === 'TE').sort((a, b) => (b.ktc || 0) - (a.ktc || 0)),
            };
            const populate = (sel, data, creator) => {
                const el = card.querySelector(sel);
                const pos = sel.split('-')[0].toUpperCase().replace('.', '');
                const posFilters = new Set(activePos);
                posFilters.delete('STAR');
                const isPosVisible = posFilters.size === 0 || posFilters.has(pos) || (isFlexActive && ['RB', 'WR', 'TE'].includes(pos));
                el.style.display = 'none';
                if (isPosVisible) {
                    el.style.display = 'block';
                    let filteredData = data;
                    if (isStarActive) {
                        filteredData = data.filter(player => {
                            const playerKtc = (player.ktc || 0);
                            const playerPpg = (player.ppg || 0);
                            return (playerKtc >= 3900) || (playerPpg >= 12 && playerKtc >= 2900);
                        });
                    }
                    const h3 = el.querySelector('h3');
                    el.innerHTML = '';
                    el.appendChild(h3);
                    if (filteredData && filteredData.length > 0) {
                        const fragment = document.createDocumentFragment();
                        filteredData.forEach(item => fragment.appendChild(creator(item, team.teamName)));
                        el.appendChild(fragment);
                    } else {
                        el.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
                    }
                }
            };
            populate('.qb-section', positions.QB, createPlayerRow);
            populate('.rb-section', positions.RB, createPlayerRow);
            populate('.wr-section', positions.WR, createPlayerRow);
            populate('.te-section', positions.TE, createPlayerRow);
            const picksEl = card.querySelector('.picks-section');
            if (picksEl) {
                const picksH3 = picksEl.querySelector('h3');
                picksEl.innerHTML = '';
                picksEl.appendChild(picksH3);
                if (team.draftPicks && team.draftPicks.length > 0) {
                    const picksFragment = document.createDocumentFragment();
                    team.draftPicks.forEach(item => picksFragment.appendChild(createPickRow(item, team.teamName)));
                    picksEl.appendChild(picksFragment);
                } else {
                    picksEl.innerHTML += `<div class="text-xs text-slate-500 p-1 italic">None</div>`;
                }
            }
            return card;
        }
        function createEmptyTaxiRow() {
            const row = document.createElement('div');
            row.className = 'player-row';
            row.innerHTML = `<span style="color: var(--color-text-tertiary); font-style: italic; font-size: 0.8rem; padding: 1.2rem 0.5rem; display: block; width: 100%; text-align: center;">Empty Slot</span>`;
            return row;
        }
        function createTaxiRow(item, teamName) {
            if (item.isPlaceholder) return createEmptyTaxiRow();
            return createPlayerRow(item, teamName);
        }
        function createPlayerRow(player, teamName) {
            const row = document.createElement('div');
            row.className = 'player-row';
            const slotAbbr = { 'SUPER_FLEX': 'SFLX', 'FLEX': 'FLX' };
            const displaySlot = state.currentRosterView === 'depth' ? (slotAbbr[player.slot] || player.slot) : player.pos;
            const fullPlayer = state.players?.[player.id];
            // Use pre-calculated ranks if available, otherwise calculate once
            const playerRanks = player._cachedRanks || calculatePlayerStatsAndRanks(player.id) || getDefaultPlayerRanks();
            if (!player._cachedRanks) player._cachedRanks = playerRanks;
            const firstName = (player.first_name || fullPlayer?.first_name || '').trim();
            const lastName = (player.last_name || fullPlayer?.last_name || '').trim();
            const nameCandidates = [
                player.name,
                player.full_name,
                player.display_name,
                `${firstName} ${lastName}`.trim(),
                fullPlayer?.full_name,
                `${(fullPlayer?.first_name || '').trim()} ${(fullPlayer?.last_name || '').trim()}`.trim(),
                firstName,
                lastName,
                fullPlayer?.first_name,
                fullPlayer?.last_name
            ];
            const playerSearchKey = Array.from(new Set(
                nameCandidates
                    .map(name => (name || '').trim().toLowerCase())
                    .filter(Boolean)
            )).join(' ');
            if (teamName) {
                row.dataset.teamName = teamName;
            }
            row.dataset.assetId = player.id;
            row.dataset.assetLabel = player.name;
            row.dataset.playerName = playerSearchKey || (player.name || '').toLowerCase();
            row.dataset.assetKtc = player.ktc || 0;
            row.dataset.assetPos = displaySlot;
            row.dataset.assetBasePos = (player.pos || displaySlot || '').toUpperCase();
            row.dataset.assetTeam = (player.team || 'FA').toUpperCase();
            if (state.tradeBlock[teamName]?.find(a => a.id === player.id)) {
                row.classList.add('player-selected');
            }
            if (state.isStartSitMode) {
                const startSitSelection = state.startSitSelections.find(sel => sel.id === player.id);
                if (startSitSelection) {
                    row.classList.add('player-selected');
                    row.dataset.startSitSide = startSitSelection.side;
                }
            }
            const ktc = player.ktc || '—';
            const teamKey = (player.team || 'FA').toUpperCase();
            const logoKeyMap = { 'WSH': 'was', 'WAS': 'was', 'JAC': 'jax', 'LA': 'lar' };
            const normalizedKey = logoKeyMap[teamKey] || teamKey.toLowerCase();
            const src = `../assets/NFL-Tags_webp/${normalizedKey}.webp`;
            const teamTagHTML = (player.team && player.team !== 'FA')
              ? `<img class="team-logo glow" src="${src}" alt="${teamKey}" width="19" height="19" loading="eager" decoding="async">`
              : `<div class="team-tag" style="background-color: #64748b; color: white;">FA</div>`;
            const basePos = (player.pos || fullPlayer?.position || displaySlot || '').toUpperCase();
            const fptsPosRankNumber = Number.parseInt(playerRanks.posRank, 10);
            const hasFptsPosRank = Number.isFinite(fptsPosRankNumber) && fptsPosRankNumber > 0;
            const fptsPosRankDisplay = hasFptsPosRank ? `${basePos}·${fptsPosRankNumber}` : basePos;
            const posRankColor = getPosRankColor(fptsPosRankDisplay);
            const ppgRawString = typeof playerRanks.ppg === 'string' ? playerRanks.ppg.trim() : '';
            const numericPpgValue = typeof playerRanks.ppg === 'number'
                ? playerRanks.ppg
                : Number.parseFloat(ppgRawString || '');
            const hasNumericPpgValue = Number.isFinite(numericPpgValue);
            const hasPositivePpgValue = hasNumericPpgValue && numericPpgValue > 0;
            const ppgValue = hasPositivePpgValue
                ? numericPpgValue.toFixed(1)
                : (!hasNumericPpgValue && ppgRawString && ppgRawString.toUpperCase() !== 'NA' ? ppgRawString : 'NA');
            const rawPpgPosRankNumber = Number.parseInt(playerRanks.ppgPosRank, 10);
            const hasPpgPosRank = Number.isFinite(rawPpgPosRankNumber) && rawPpgPosRankNumber > 0;
            const ppgPosRankNumber = hasPpgPosRank ? rawPpgPosRankNumber : null;
            const ktcPosRankMatch = typeof player.posRank === 'string' ? player.posRank.match(/(\d+)/) : null;
            const rawKtcPosRankNumber = ktcPosRankMatch ? Number.parseInt(ktcPosRankMatch[1], 10) : null;
            const ktcPosRankNumber = Number.isFinite(rawKtcPosRankNumber) && rawKtcPosRankNumber > 0 ? rawKtcPosRankNumber : null;
            const injuryDesignation = player.injuryDesignation;
            const injuryBadgeHtml = injuryDesignation
                ? `<div class="player-injury-badge" style="color: ${injuryDesignation.color};">${injuryDesignation.designation}</div>`
                : '';
            row.innerHTML = `
                <div class="player-main-line">
                    <div class="player-tag" style="background-color: ${TAG_COLORS[displaySlot] || 'var(--pos-bn)'};">${displaySlot}</div>
                    <div class="player-name"><span class="player-name-clickable">${player.name}</span></div>
                    ${injuryBadgeHtml}
                </div>
                <div class="player-meta-line">
                    <span class="player-pos-rank" style="color: ${posRankColor}; font-weight: 400;">${fptsPosRankDisplay}</span>
                    <span class="separator">•</span>
                    <span><span class="player-age">${player.age || '?'}</span> y.o. </span>
                    <span class="separator">•</span>
                    ${teamTagHTML}
                </div>
                <div class="player-value-line">
                    <span class="player-ktc-wrapper">KTC:<span class="value player-ktc">${ktc}</span></span>
                    <span class="player-ppg-wrapper">PPG:<span class="value player-ppg">${ppgValue}</span></span>
                </div>
            `;
            const ageEl = row.querySelector('.player-age');
            const ktcEl = row.querySelector('.player-ktc');
            const ppgEl = row.querySelector('.player-ppg');
            const playerPosRankEl = row.querySelector('.player-pos-rank');
            if (playerPosRankEl) {
                playerPosRankEl.textContent = fptsPosRankDisplay;
                playerPosRankEl.style.color = posRankColor;
            }
            if (ageEl && player.age && player.age !== '?') ageEl.style.color = getAgeColorForRoster(player.pos, parseFloat(player.age));
            if (ktcEl && player.ktc) ktcEl.style.color = getKtcColor(player.ktc);
            if (ppgEl) {
                ppgEl.textContent = ppgValue;
                if (hasPositivePpgValue && typeof ppgPosRankNumber === 'number') {
                    ppgEl.style.color = getConditionalColorByRank(ppgPosRankNumber, basePos);
                } else if (!hasPositivePpgValue) {
                    ppgEl.style.color = 'var(--color-text-tertiary)';
                }
            }
            const ktcWrapper = row.querySelector('.player-ktc-wrapper');
            if (ktcWrapper) {
                ktcWrapper.classList.add('has-rank-annotation');
                // Render KTC rank inline with ordinal suffix wrapped in parentheses
                ktcWrapper.appendChild(createRankAnnotation(typeof ktcPosRankNumber === 'number' ? ktcPosRankNumber : 'NA', { wrapInParens: true, ordinal: true, variant: 'ktc' }));
            }
            const playerNameClickableEl = row.querySelector('.player-name-clickable');
            if (playerNameClickableEl) {
                playerNameClickableEl.style.cursor = 'pointer';
                playerNameClickableEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handlePlayerNameClick(player);
                });
            }
            return row;
        }
        function createPickRow(pick, teamName) {
            const row = document.createElement('div');
            row.className = 'pick-row';
            row.dataset.assetId = pick.id;
            row.dataset.assetLabel = pick.label;
            row.dataset.assetKtc = pick.ktc || 0;
            if (state.tradeBlock[teamName]?.find(a => a.id === pick.id)) {
                row.classList.add('player-selected');
            }
            const ktcValue = pick.ktc || '—';
            row.innerHTML = `<span class="pick-label">${pick.label}</span><span class="pick-ktc">KTC: <span class="value">${ktcValue}</span></span>`;
            if (pick.ktc) row.querySelector('.pick-ktc .value').style.color = getKtcColor(pick.ktc);
            return row;
        }
        function renderStartSitPreview() {
            const selections = state.startSitSelections || [];
            const currentWeekNumber = getCurrentNflWeekNumber();
            // weekLabel now holds just the WK number (e.g. WK5). Bracketing and styling are applied in the template.
            const weekLabel = Number.isFinite(currentWeekNumber) ? `WK${currentWeekNumber}` : '';
            const weekLabelDisplay = weekLabel ? `[${weekLabel}]` : '';
            const escapeHtml = (value) => {
                if (value === null || value === undefined) return '';
                return String(value)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
            };
            tradeSimulator.innerHTML = `
                            <div class="trade-container glass-panel start-sit-container">
                    <div class="trade-header">
                            <div class="trade-header-left">
                            <h3><i class="fa-solid fa-elevator analyzer-icon"></i> Start/Sit<span class="start-sit-week">${weekLabelDisplay}</span></h3>
                        </div>
            <div class="trade-header-center">
              <button id="collapseTradeButton"><i class="fa-solid fa-caret-down"></i></button>
            </div>
            <div class="trade-header-right">
              <button id="comparePlayersButton" class="control-button-subtle">
                <i class="fa-solid fa-chart-simple"></i>
                <span class="label">Compare</span>
              </button>
              <button id="clearTradeButton" type="button">
                <i class="fa-solid fa-eraser"></i>
                <span class="label">Clear</span>
              </button>
              <button id="closeTradeButton" type="button">
                <i class="fa-solid fa-circle-xmark"></i>
                <span class="label">Close</span>
              </button>
            </div>
          </div>
          <div class="trade-body"></div>
          <div class="trade-footnote">• Projected Points •</div>
        </div>
    <button id="showTradeButton"><i class="fa-solid fa-circle-chevron-up"></i> <span class="show-button-label">Start/Sit <i class="fa-solid fa-elevator analyzer-icon"></i></span><span class="start-sit-week"></span> <i class="fa-solid fa-circle-chevron-up"></i></button>
  `;
            const sides = ['left', 'right'];
            const sideLabels = { left: 'Player 1', right: 'Player 2' };
            const tradeBody = tradeSimulator.querySelector('.trade-body');
            let bodyHtml = '';
            sides.forEach((side, index) => {
                const selection = selections.find(sel => sel.side === side);
                let assetsHTML = '';
                let totalDisplay = '—';
                let projectionColor = 'var(--color-text-tertiary)';
                let matchupSectionHtml = '';
                if (selection) {
                    const tagColor = TAG_COLORS[selection.pos] || 'var(--pos-bn)';
                    const posForColor = selection.basePos || selection.pos;
                    const rankColor = Number.isFinite(selection.ppgPosRank)
                        ? getConditionalColorByRank(selection.ppgPosRank, posForColor)
                        : 'var(--color-text-tertiary)';
                    const baseLabel = posForColor || '';
                    const rankText = (selection.ppgPosRankDisplay && selection.ppgPosRankDisplay !== 'NA')
                        ? selection.ppgPosRankDisplay
                        : (baseLabel ? `${baseLabel}·NA` : 'NA');
                    const posColor = getPosRankColor(rankText);
                    const ppgText = selection.ppgDisplay || 'NA';
                    const hasPositivePpg = typeof selection.ppg === 'number' && selection.ppg > 0;
                    const hasPpgRankNumber = Number.isFinite(selection.ppgPosRank) && selection.ppgPosRank > 0;
                    const projectionValue = typeof selection.projection === 'number'
                        ? selection.projection
                        : Number.parseFloat(selection.projection);
                    const ppgColor = hasPositivePpg && hasPpgRankNumber
                        ? getConditionalColorByRank(selection.ppgPosRank, posForColor)
                        : (hasPositivePpg ? 'var(--color-text-mid-test1)' : 'var(--color-text-tertiary)');
                    const projectionDisplay = selection.projection !== null
                        ? selection.projection.toFixed(1)
                        : ((selection.projectionDisplay && selection.projectionDisplay.toUpperCase() !== 'NA') ? selection.projectionDisplay : '—');
                    if (Number.isFinite(projectionValue)) {
                        const derivedColor = getProjectionColorForValue(posForColor, projectionValue);
                        if (derivedColor) {
                            projectionColor = derivedColor;
                        } else if (hasPpgRankNumber) {
                            projectionColor = getConditionalColorByRank(selection.ppgPosRank, posForColor);
                        } else if (hasPositivePpg) {
                            projectionColor = 'var(--color-text-mid-test1)';
                        } else {
                            projectionColor = 'var(--color-text-secondary)';
                        }
                    }
                    if (selection.matchup) {
                        const { opponent, opponentOrdinal, opponentRankDisplay, color, isBye } = selection.matchup;
                        const opponentText = opponent || (isBye ? 'BYE' : '');
                        if (opponentText) {
                            const opponentStyle = color && !isBye ? ` style="color: ${color};"` : '';
                            const rankRawText = !isBye
                                ? (opponentOrdinal || (opponentRankDisplay && opponentRankDisplay !== 'NA' ? opponentRankDisplay : ''))
                                : '';
                            const hasRankText = Boolean(rankRawText);
                            const rankStyle = color && !isBye ? ` style="color: ${color};"` : '';
                            const safeOpponent = escapeHtml(opponentText);
                            const rankHtml = hasRankText
                                ? `<span class="start-sit-matchup-sep">•</span><span class="start-sit-matchup-rank"${rankStyle}>${escapeHtml(rankRawText)}</span>`
                                : '';
                            matchupSectionHtml = `<div class="start-sit-matchup-meta"><span class="start-sit-matchup-opponent"${opponentStyle}>${safeOpponent}</span>${rankHtml}</div>`;
                        }
                    }
                    const rankParts = rankText.split('·');
                    const rankNumberDisplay = rankParts.length > 1 ? rankParts.slice(1).join('·') : 'NA';
                    assetsHTML = `
                        <div class="trade-asset-chip start-sit-chip">
                            <div class="start-sit-chip-body">
                                <span class="start-sit-name">
                                    <span class="start-sit-inline-tag player-tag" style="background-color: ${tagColor};">${selection.pos}</span>
                                    <span class="start-sit-name-text">${escapeHtml(selection.label)}</span>
                                </span>
                                <span class="start-sit-metric"><span class="start-sit-metric-value" style="color: ${ppgColor};">${ppgText}</span><span class="start-sit-metric-unit">PPG</span><span class="start-sit-metric-sep">•</span><span class="start-sit-rank"><span class="start-sit-rank-pos" style="color: ${posColor};">${posForColor}</span><span class="start-sit-rank-dot">·</span><span class="start-sit-rank-number" style="color: ${rankColor};">${rankNumberDisplay}</span></span></span>
                            </div>
                        </div>`;
                    totalDisplay = projectionDisplay;
                } else {
                    assetsHTML = `<span class="text-xs text-slate-500 p-2">Select a player...</span>`;
                }
                const safeTotal = escapeHtml(totalDisplay);
                bodyHtml += `
                    <div class="trade-team-column start-sit-preview-column">
                        <h4>${sideLabels[side]}</h4>
                        <div class="trade-assets">${assetsHTML}</div>
                        <div class="trade-total even start-sit-total">
                            <span class="start-sit-total-label">Projected Points:</span>
                            <span class="start-sit-total-value" style="color: ${projectionColor};">${safeTotal}</span>
                        </div>
                        ${matchupSectionHtml}
                    </div>
                `;
                if (index < sides.length - 1) {
                    bodyHtml += `<div class="trade-divider"></div>`;
                }
            });
            tradeBody.innerHTML = bodyHtml;
            const comparePlayersButton = document.getElementById('comparePlayersButton');
            if (comparePlayersButton) {
                if (selections.length === 2) {
                    comparePlayersButton.classList.add('enabled');
                } else {
                    comparePlayersButton.classList.remove('enabled');
                }
            }
            tradeSimulator.classList.toggle('collapsed', state.isTradeCollapsed);
            const clearBtn = document.getElementById('clearTradeButton');
            if (clearBtn) {
                clearBtn.disabled = selections.length === 0;
                clearBtn.addEventListener('click', clearStartSitSelections);
            }
            const closeBtn = document.getElementById('closeTradeButton');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => exitStartSitMode());
            }
            const collapseBtn = document.getElementById('collapseTradeButton');
            if (collapseBtn) {
                collapseBtn.addEventListener('click', () => {
                    tradeSimulator.classList.add('collapsed');
                    state.isTradeCollapsed = true;
                    mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
                    closeComparisonModal();
                });
            }
            const showBtn = document.getElementById('showTradeButton');
            if (showBtn) {
                showBtn.addEventListener('click', () => {
                    tradeSimulator.classList.remove('collapsed');
                    state.isTradeCollapsed = false;
                    mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
                });
            }
            mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
        }
        function renderTradeBlock() {
            const tradeEligible = state.isCompareMode && state.teamsToCompare.size >= 2;
            const startSitActive = state.isStartSitMode;
            if (!tradeEligible && !startSitActive) {
                tradeSimulator.style.display = 'none';
                tradeSimulator.innerHTML = '';
                mainContent.style.paddingBottom = '1rem';
                return;
            }
            tradeSimulator.style.display = 'block';
            if (startSitActive) {
                renderStartSitPreview();
                return;
            }
            tradeSimulator.innerHTML = `
              <div class="trade-container glass-panel">
          <div class="trade-header">
            <div class="trade-header-left">
              <h3>Trade Preview <i class="fa-solid fa-code-compare fa-rotate-270"></i></h3>
            </div>
            <div class="trade-header-center">
              <button id="collapseTradeButton"><i class="fa-solid fa-caret-down"></i></button>
            </div>
            <div class="trade-header-right">
              <button id="comparePlayersButton" class="control-button-subtle">
                <i class="fa-solid fa-chart-simple"></i>
                <span class="label">Compare</span>
              </button>
              <button id="clearTradeButton" type="button">
                <i class="fa-solid fa-eraser"></i>
                <span class="label">Clear</span>
              </button>
              <button id="closeTradeButton" type="button">
                <i class="fa-solid fa-circle-xmark"></i>
                <span class="label">Close</span>
              </button>
            </div>
          </div>
          <div class="trade-body"></div>
          <div class="trade-footnote">• Non-Adjusted Values •</div>
        </div>
        <button id="showTradeButton"><i class="fa-solid fa-circle-chevron-up"></i> Trade Preview <i class="fa-solid fa-circle-chevron-up"></i></button>
  `;
            const tradeBody = tradeSimulator.querySelector('.trade-body');
            const teamNames = Array.from(state.teamsToCompare);
            const tradeData = {};
            teamNames.forEach(name => {
                const assets = state.tradeBlock[name] || [];
                const totalKtc = assets.reduce((sum, asset) => sum + asset.ktc, 0);
                tradeData[name] = { assets, totalKtc };
            });
            const totals = teamNames.map(name => tradeData[name].totalKtc);
            const totalClasses = {};
            if (teamNames.length === 2) {
                const diff = totals[0] - totals[1];
                if (diff > 500) {
                    totalClasses[teamNames[0]] = 'winning';
                    totalClasses[teamNames[1]] = 'losing';
                } else if (diff < -500) {
                    totalClasses[teamNames[0]] = 'losing';
                    totalClasses[teamNames[1]] = 'winning';
                } else {
                    totalClasses[teamNames[0]] = 'even';
                    totalClasses[teamNames[1]] = 'even';
                }
            }
            let bodyHtml = '';
            teamNames.forEach((teamName, index) => {
                const { assets, totalKtc } = tradeData[teamName];
                let assetsHTML = '';
                if (assets.length > 0) {
                    assets.forEach(asset => {
                        const ktcColor = getKtcColor(asset.ktc);
                        const tagColor = TAG_COLORS[asset.pos] || 'var(--pos-bn)';
                        assetsHTML += `<div class="trade-asset-chip"><span class="player-tag" style="background-color: ${tagColor};">${asset.pos || 'DP'}</span><span>${asset.label}</span><span class="ktc" style="color: ${ktcColor}">(${asset.ktc})</span></div>`;
                    });
                } else {
                    assetsHTML = `<span class="text-xs text-slate-500 p-2">Select assets...</span>`;
                }
                const totalClass = totalClasses[teamName] || 'even';
                let teamNameDisplay = teamName;
                if (teamNames.length === 2) {
                    if (index === 0) teamNameDisplay = `${teamName}`;
                    if (index === 1) teamNameDisplay = `${teamName}`;
                }
                bodyHtml += `
                    <div class="trade-team-column">
                       <h4>${teamNameDisplay}</h4>
                        <div class="trade-assets">${assetsHTML}</div>
                        <div class="trade-total ${totalClass}">
                            Total KTC: ${totalKtc}
                        </div>
                    </div>
                `;
                if (index < teamNames.length - 1 && teamNames.length > 1) {
                     bodyHtml += `<div class="trade-divider"></div>`;
                }
            });
            tradeBody.innerHTML = bodyHtml;
            // Disable/enable Clear button based on whether any assets are selected
            const clearBtn = document.getElementById('clearTradeButton');
            try {
                const hasAnyAssets = Object.values(tradeData).some(d => Array.isArray(d.assets) && d.assets.length > 0);
                if (clearBtn) clearBtn.disabled = !hasAnyAssets;
            } catch (e) { /* no-op */ }
            const comparePlayersButton = document.getElementById('comparePlayersButton');
            if (comparePlayersButton) {
                const selectedPlayers = Object.values(state.tradeBlock).flat().filter(asset => asset.pos !== 'DP');
                if (selectedPlayers.length === 2) {
                    comparePlayersButton.classList.add('enabled');
                } else {
                    comparePlayersButton.classList.remove('enabled');
                }
            }
            tradeSimulator.classList.toggle('collapsed', state.isTradeCollapsed);
            document.getElementById('clearTradeButton').addEventListener('click', clearTrade);
            const closeTradeButton = document.getElementById('closeTradeButton');
            if (closeTradeButton) {
                closeTradeButton.addEventListener('click', () => {
                    handleClearCompare(true);
                });
            }
            document.getElementById('collapseTradeButton').addEventListener('click', () => {
                tradeSimulator.classList.add('collapsed');
                state.isTradeCollapsed = true;
                mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
                closeComparisonModal();
            });
            document.getElementById('showTradeButton').addEventListener('click', () => {
                tradeSimulator.classList.remove('collapsed');
                state.isTradeCollapsed = false;
                mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
            });
            mainContent.style.paddingBottom = `${tradeSimulator.offsetHeight + 20}px`;
        }
        // --- Player List (Ownership) Functions ---
        async function renderPlayerList() {
    hideLegend();
            playerListView.innerHTML = '<p class="text-center p-4">Fetching user leagues and rosters...</p>';
            assignedLeagueColors.clear();
            nextColorIndex = 0;
            assignedRyColors.clear();
            nextRyColorIndex = 0;
            const userLeagues = await fetchUserLeagues(state.userId);
            const rostersByLeague = await Promise.all(userLeagues.map(l => fetchWithCache(`${API_BASE}/league/${l.league_id}/rosters`)));
            const agg = new Map();
            rostersByLeague.forEach((rosters, idx) => {
                const leagueName = userLeagues[idx].name;
                const leagueAbbr = getLeagueAbbr(leagueName);
                const myRoster = rosters.find(r => r.owner_id === state.userId || (Array.isArray(r.co_owners) && r.co_owners.includes(state.userId)));
                if (!myRoster) return;
                const pids = new Set((myRoster.players || []).filter(Boolean));
                pids.forEach(pid => {
                    if (!agg.has(pid)) agg.set(pid, new Set());
                    agg.get(pid).add(leagueAbbr);
                });
            });
            const section = document.createElement('div');
            section.className = 'player-list-section';
            const header = createPlayerListHeader();
            section.appendChild(header);
            const rows = Array.from(agg.entries()).map(([pid, leagueSet]) => createPlayerListRow(pid, leagueSet, userLeagues.length)).filter(Boolean);
            rows.sort((a, b) => {
                const countDiff = Number(b.dataset.count || 0) - Number(a.dataset.count || 0);
                if (countDiff !== 0) return countDiff;
                return a.dataset.search.localeCompare(b.dataset.search);
            });
            rows.forEach(r => section.appendChild(r));
            playerListView.innerHTML = '';
            const searchInput = document.createElement('input');
            searchInput.id = 'playerSearch';
            searchInput.type = 'text';
            searchInput.placeholder = 'Filter players by name...';
            playerListView.appendChild(searchInput);
            playerListView.appendChild(section);
            searchInput.oninput = () => {
                const term = searchInput.value.trim().toLowerCase();
                section.querySelectorAll('.pl-player-row:not(.pl-list-header)').forEach(r => {
                    r.style.display = (r.dataset.search || '').includes(term) ? 'flex' : 'none';
                });
            };
        }
        function createPlayerListHeader() {
            const header = document.createElement('div');
            header.className = 'pl-player-row pl-list-header';
            const tagSpacer = document.createElement('div');
            tagSpacer.className = 'pl-list-tag-spacer';
            header.appendChild(tagSpacer);
            const headerInfo = document.createElement('div');
            headerInfo.className = 'pl-player-info';
            headerInfo.innerHTML = '<div class="pl-player-name">Player & Info</div>';
            header.appendChild(headerInfo);
            const headerMeta = document.createElement('div');
            headerMeta.className = 'pl-right-meta';
            headerMeta.innerHTML = `
                <span class="pl-col-count">#</span>
                <span class="pl-col-pct">%</span>
                <span class="pl-col-lgs">Leagues</span>
            `;
            header.appendChild(headerMeta);
            return header;
        }
        function createPlayerListRow(pid, leagueSet, totalLeagues) {
            const p = state.players[pid];
            if (!p) return null;
            const pos = p.position || (p.fantasy_positions && p.fantasy_positions[0]) || '';
            const first = (p.first_name || '').trim();
            const last = (p.last_name || '').trim();
            let displayName = `${first} ${last}`.trim() || pid;
            if (first && last) displayName = `${first.charAt(0)}. ${last}`;
            if (displayName.length > 14) displayName = displayName.substring(0, 14) + '…';
            const row = document.createElement('div');
            row.className = 'pl-player-row';
            row.dataset.search = `${first.toLowerCase()} ${last.toLowerCase()} ${displayName.toLowerCase()}`;
            row.dataset.count = leagueSet.size;
            const valueData = state.isSuperflex ? state.sflxData[pid] : state.oneQbData[pid];
            const ageFromSheet = valueData?.age;
            const formattedAge = (typeof ageFromSheet === 'number') ? ageFromSheet.toFixed(1) : (p.age ? Number(p.age).toFixed(1) : '?');
            const detailParts = [];
            const adp1QB = state.oneQbData[pid]?.adp;
            const adpSFLX = state.sflxData[pid]?.adp;
            const rookieYear = deriveRookieYear(p);
            if (adp1QB) detailParts.push(`ADP <span style="color:${getAdpColorForRoster(adp1QB) || 'inherit'}">${adp1QB.toFixed(1)}</span>`);
            if (adpSFLX) detailParts.push(`SFLX <span style="color:${getAdpColorForRoster(adpSFLX) || 'inherit'}">${adpSFLX.toFixed(1)}</span>`);
            if (rookieYear) {
                const ryAbbr = String(rookieYear).slice(-2);
                detailParts.push(`RY-<span style="color:${getRyColor(rookieYear) || 'inherit'}">${ryAbbr}</span>`);
            }
            const detailsHTML = detailParts.join(' • ');
            const count = leagueSet.size;
            const pctVal = Math.round((count / totalLeagues) * 100);
            let countClass, pctClass;
            if (pctVal >= 80) { countClass = 'pl-count-high'; pctClass = 'pl-pct-high'; }
            else if (pctVal >= 50) { countClass = 'pl-count-mid'; pctClass = 'pl-pct-mid'; }
            else { countClass = 'pl-count-low'; pctClass = 'pl-pct-low'; }
            const sortedAbbrs = Array.from(leagueSet).sort();
            const leaguesHTML = sortedAbbrs.map((abbr, index) => `<span style="color: ${getLeagueColor(abbr)}">${abbr}</span>`).join(', ');
            row.innerHTML = `
                <div class="pl-list-tag" style="background-color: ${TAG_COLORS[pos] || 'var(--pos-bn)'};">${pos}</div>
                <div class="pl-player-info">
                    <div class="pl-player-name">
                        <span>${displayName}</span>
                        <div class="team-tag" style="background-color: ${TEAM_COLORS[p.team] || '#64748b'}; color: white;">${p.team || 'FA'}</div>
                        ${formattedAge !== '?' ? `<span style="font-size: 0.8rem; color: var(--color-text-tertiary);">Age: <span style="color:${getAgeColorForRoster(p.position, parseFloat(formattedAge)) || 'inherit'}">${formattedAge}</span></span>` : ''}
                    </div>
                    <div class="pl-player-details">${detailsHTML}</div>
                </div>
                <div class="pl-right-meta">
                    <span class="pl-col-count ${countClass}">${count}</span>
                    <span class="pl-col-pct ${pctClass}">${pctVal}%</span>
                    <span class="pl-col-lgs">${leaguesHTML}</span>
                </div>
            `;
            return row;
        }
        // --- Formatting Helpers ---
        function deriveRookieYear(player) {
            if (!player) return null;
            let ry = player.metadata?.rookie_year ? Number(player.metadata.rookie_year) : 0;
            const exp = player.years_exp;
            const expNum = (exp === '' || exp === null || exp === undefined) ? null : Number(exp);
            if ((!ry || ry === 0) && expNum === 0) {
                return new Date().getFullYear();
            }
            return ry > 0 ? ry : null;
        }
        function getPosRankColor(posRank) {
            if (!posRank || typeof posRank !== 'string') return 'var(--color-text-secondary)';
            const position = posRank.split('·')[0];
            const colors = {
                QB: '#FFB2D8',
                RB: '#bbf7e0',
                WR: '#A0C2F7',
                TE: '#FFC78A'
            };
            return colors[position] || 'var(--color-text-secondary)';
        }
        function calculateFantasyPoints(stats, scoringSettings) {
            if (!stats) return 0;
            if (typeof stats.fpts === 'number' && Number.isFinite(stats.fpts)) {
                return stats.fpts;
            }
            if (typeof stats.fpts_override === 'number' && Number.isFinite(stats.fpts_override)) {
                return stats.fpts_override;
            }
            if (!scoringSettings) return 0;
            let totalPoints = 0;
            for (const statKey in stats) {
                if (!Object.prototype.hasOwnProperty.call(stats, statKey)) continue;
                if (statKey === 'fpts_override' || statKey === '__live') continue;
                if (scoringSettings[statKey]) {
                    totalPoints += stats[statKey] * scoringSettings[statKey];
                }
            }
            return totalPoints;
        }
        function formatPercentage(value, decimals = 1) {
            // Preserve trailing zeros exactly as specified by `decimals`
            const fallback = (0).toFixed(decimals) + '%';
            if (value === null || value === undefined || Number.isNaN(value)) return fallback;
            const numericValue = Number(value);
            if (Number.isNaN(numericValue)) return fallback;
            return numericValue.toFixed(decimals) + '%';
        }
        function formatRadarStatValue(statKey, value) {
            // Reuse preformatted strings (matches summary chip display for league-specific stats)
            if (typeof value === 'string') {
                const trimmed = value.trim();
                if (trimmed) return trimmed;
            }

            if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';
            
            const numericValue = Number(value);
            if (Number.isNaN(numericValue)) return 'N/A';

            // Percentage stats (1 decimal)
            if (statKey === 'cmp_pct' || statKey === 'snp_pct' || statKey === 'ts_per_rr' || 
                statKey === 'prs_pct' || statKey === 'pass_imp_per_att') {
                return numericValue.toFixed(1) + '%';
            }
            
            // 1DRR (first_down_rec_rate) - 2 decimals, not a percentage display in radar
            if (statKey === 'first_down_rec_rate') {
                return numericValue.toFixed(2);
            }
            
            // FPTS and PPG - always 1 decimal place
            if (statKey === 'fpts' || statKey === 'ppg') {
                return numericValue.toFixed(1);
            }
            
            // Whole number stats
            if (statKey === 'rec' || statKey === 'rec_tgt') {
                return Math.round(numericValue).toString();
            }
            if (statKey === 'yds_total') {
                return Math.round(numericValue).toString();
            }
            
            // recYPG - 1 decimal place (matches table formatting)
            if (statKey === 'rec_ypg') {
                return numericValue.toFixed(1);
            }
            
            // Rating stats (1 decimal)
            if (statKey === 'pass_rtg') {
                return numericValue.toFixed(1);
            }
            if (statKey === 'ttt' || statKey === 'imp_per_g') {
                return numericValue.toFixed(2);
            }
            
            // All other stats (2 decimals)
            return numericValue.toFixed(2);
        }
        function getPlayerVitals(playerId) {
            const fallback = { age: '—', height: '—', weight: '—' };
            const playerData = state.players?.[playerId];
            if (!playerData) return fallback;
            const collect = (...values) => values
                .map(value => (typeof value === 'string' ? value.trim() : value))
                .filter(value => value !== undefined && value !== null && value !== '');
            const parseAge = () => {
                const valueData = state.isSuperflex ? state.sflxData?.[playerId] : state.oneQbData?.[playerId];
                const ageFromSheet = valueData?.age;
                if (typeof ageFromSheet === 'number') {
                    return ageFromSheet.toFixed(1);
                }
                const candidates = collect(
                    playerData.age,
                    playerData.metadata?.age,
                    playerData.metadata?.player_age
                );
                for (const candidate of candidates) {
                    const numeric = Number.parseInt(candidate, 10);
                    if (Number.isFinite(numeric) && numeric > 0) {
                        return Number(numeric).toFixed(1);
                    }
                }
                if (playerData.birthdate) {
                    const birth = new Date(playerData.birthdate);
                    if (!Number.isNaN(birth.getTime())) {
                        const today = new Date();
                        let age = today.getFullYear() - birth.getFullYear();
                        const hasHadBirthdayThisYear =
                            today.getMonth() > birth.getMonth() ||
                            (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
                        if (!hasHadBirthdayThisYear) age -= 1;
                        if (Number.isFinite(age) && age > 0 && age < 80) {
                            return Number(age).toFixed(1);
                        }
                    }
                }
                return null;
            };
            const formatHeightFromParts = (feet, inches) => {
                const f = Number.parseInt(feet, 10);
                const i = Number.parseInt(inches, 10);
                if (!Number.isFinite(f) && !Number.isFinite(i)) return null;
                const safeFeet = Number.isFinite(f) ? f : Math.floor(i / 12);
                const safeInches = Number.isFinite(i) ? i % 12 : 0;
                if (!Number.isFinite(safeFeet) || safeFeet <= 0) return null;
                const boundedInches = Math.max(0, Math.min(11, safeInches));
                return `${safeFeet}'${boundedInches}"`;
            };
            const parseHeightString = (value) => {
                if (value === undefined || value === null) return null;
                const str = String(value).trim();
                if (!str) return null;
                const digits = str.match(/\d+/g);
                if (!digits || digits.length === 0) return null;
                if (digits.length >= 2) {
                    return formatHeightFromParts(digits[0], digits[1]);
                }
                const only = Number.parseInt(digits[0], 10);
                if (!Number.isFinite(only) || only <= 0) return null;
                const raw = digits[0];
                if (raw.length >= 3) {
                    const feetPart = raw.slice(0, raw.length - 2);
                    const inchPart = raw.slice(-2);
                    const formattedFromRaw = formatHeightFromParts(feetPart, inchPart);
                    if (formattedFromRaw) return formattedFromRaw;
                }
                if (only > 12) {
                    const feet = Math.floor(only / 12);
                    const inches = only % 12;
                    return `${feet}'${inches}"`;
                }
                return `${only}'0"`;
            };
            const parseHeight = () => {
                const pairCandidates = [
                    [playerData.height_feet, playerData.height_inches],
                    [playerData.metadata?.height_feet, playerData.metadata?.height_inches],
                    [playerData.height_ft, playerData.height_in],
                    [playerData.metadata?.height_ft, playerData.metadata?.height_in]
                ];
                for (const [feet, inches] of pairCandidates) {
                    const formatted = formatHeightFromParts(feet, inches);
                    if (formatted) return formatted;
                }
                const heightCandidates = collect(
                    playerData.height,
                    playerData.metadata?.height,
                    playerData.metadata?.player_height,
                    playerData.height_inches,
                    playerData.height_in,
                    playerData.metadata?.height_inches,
                    playerData.metadata?.height_in
                );
                for (const candidate of heightCandidates) {
                    const formatted = parseHeightString(candidate);
                    if (formatted) return formatted;
                }
                return null;
            };
            const parseWeight = () => {
                const weightCandidates = collect(
                    playerData.weight,
                    playerData.metadata?.weight,
                    playerData.metadata?.player_weight,
                    playerData.weight_lbs,
                    playerData.metadata?.weight_lbs
                );
                for (const candidate of weightCandidates) {
                    const numeric = Number.parseInt(candidate, 10);
                    if (Number.isFinite(numeric) && numeric > 0) {
                        return `${numeric} lbs`;
                    }
                }
                return null;
            };
            const parseYearsExperience = () => {
                const exp = playerData.years_exp;
                if (exp === null || exp === undefined) return '—';
                return String(exp);
            };
            const parseRookieYear = () => {
                const rookieYear = playerData.rookie_year;
                if (rookieYear && rookieYear !== '0') {
                    return String(rookieYear);
                }
                const exp = playerData.years_exp;
                if (exp !== null && exp !== undefined) {
                    return String(2025 - Number(exp));
                }
                return '—';
            };
            return {
                age: parseAge() ?? '—',
                height: parseHeight() ?? '—',
                weight: parseWeight() ?? '—',
                exp: parseYearsExperience(),
                ry: parseRookieYear()
            };
        }
        function createPlayerVitalsElement(vitals, { variant = 'modal', pos = '' } = {}) {
            const container = document.createElement('div');
            container.className = `player-vitals player-vitals--${variant}`;
            const items = [
                { label: 'AGE', value: vitals.age },
                { label: 'HEIGHT', value: vitals.height },
                { label: 'WEIGHT', value: vitals.weight },
                { label: 'EXP', value: vitals.exp },
                { label: 'RY', value: vitals.ry }
            ];
            items.forEach(({ label, value }) => {
                const item = document.createElement('div');
                item.className = 'player-vitals__item';
                const labelEl = document.createElement('span');
                labelEl.className = 'player-vitals__label';
                labelEl.textContent = label;
                const valueEl = document.createElement('span');
                valueEl.className = 'player-vitals__value';
                valueEl.textContent = value;
                // apply conditional color for AGE, HEIGHT, WEIGHT based on position
                if (label === 'AGE' || label === 'HEIGHT' || label === 'WEIGHT') {
                    const color = getVitalsColor(label, pos, value);
                    if (color) valueEl.style.color = color;
                }
                item.appendChild(labelEl);
                item.appendChild(valueEl);
                container.appendChild(item);
            });
            return container;
        }
        function getRankColor(rank) {
            if (typeof rank !== 'number') return 'var(--color-text-primary)';
            const thresholds = [
                { v: 24, c: '#8BEBCDbb' },
                { v: 48, c: '#97EBE3ab' },
                { v: 72, c: '#7dd1ffaa' },
                { v: 96, c: '#48a6ffaa' },
                { v: 120, c: '#957cffbb' },
                { v: 156, c: '#a642ffbb' },
                { v: 180, c: '#cf60ffcc' },
                { v: 204, c: '#ff6fe1cc' },
                { v: 250, c: '#ff2eb2' },
            ];
            for (const t of thresholds) {
                if (rank <= t.v) return t.c;
            }
            if (rank > 250 && rank < 300) return '#ff0080';
            if (rank >= 300) return '#656565';
            return 'var(--color-text-secondary)';
        }
        function getConditionalColorByRank(rank, position) {
            if (typeof rank !== 'number' || rank <= 0)  return 'inherit';
            const normalizedPos = typeof position === 'string' ? position.trim().toUpperCase() : '';
            const thresholds = normalizedPos === 'WR'
                ? [
                    { v: 12, c: '#51CBA5CF' },
                    { v: 24, c: '#34aabfDA' },
                    { v: 36, c: '#4798fcDA' },
                    { v: 48, c: '#957CFFC5' },
                    { v: 60, c: '#FF6FE1A5' },
                    { v: 72, c: '#FF2EB289' },
                ]
                : [
                    { v: 8, c: '#51CBA5CF' },
                    { v: 16, c: '#34aabfDA' },
                    { v: 24, c: '#4798fcDA' },
                    { v: 32, c: '#957CFFC5' },
                    { v: 44, c: '#FF6FE1A5' },
                    { v: 60, c: '#FF2EB289' },
                ];
            for (const threshold of thresholds) {
                if (rank <= threshold.v) return threshold.c;
            }
            return '#767693';
        }
        const __projectionRankCache = new Map();
        function getProjectionRankForValue(position, projectionValue) {
            const numericProjection = Number.parseFloat(projectionValue);
            if (!Number.isFinite(numericProjection) || numericProjection < 0) {
                return null;
            }
            const normalizedPos = typeof position === 'string' ? position.trim().toUpperCase() : '';
            if (!normalizedPos) {
                return null;
            }
            const calcCache = state.calculatedRankCache;
            if (!calcCache || !calcCache.players) {
                return null;
            }
            const leagueKey = state.currentLeagueId || 'global';
            const cacheKey = `${leagueKey}|${normalizedPos}`;
            let cachedEntry = __projectionRankCache.get(cacheKey);
            if (!cachedEntry || cachedEntry.version !== calcCache) {
                const values = [];
                for (const [playerId, ranks] of Object.entries(calcCache.players)) {
                    if (!ranks) continue;
                    const rosterPlayer = state.players?.[playerId];
                    const playerPos = (rosterPlayer?.position || '').toUpperCase();
                    if (playerPos !== normalizedPos) continue;
                    const ppgValue = Number.parseFloat(ranks.ppg);
                    if (!Number.isFinite(ppgValue)) continue;
                    values.push(ppgValue);
                }
                values.sort((a, b) => b - a);
                cachedEntry = { values, version: calcCache };
                __projectionRankCache.set(cacheKey, cachedEntry);
            }
            const ppgValues = cachedEntry.values;
            if (!ppgValues || ppgValues.length === 0) {
                return null;
            }
            const index = ppgValues.findIndex(ppg => numericProjection >= ppg);
            if (index === -1) {
                return ppgValues.length;
            }
            return index + 1;
        }
        function getProjectionColorForValue(position, projectionValue) {
            const rank = getProjectionRankForValue(position, projectionValue);
            if (!Number.isFinite(rank)) {
                return null;
            }
            return getConditionalColorByRank(rank, position);
        }
        function getKtcColor(v) {
        const s = [
          { v: 9e3, c: "#72edd0B3" },
          { v: 8e3, c: "#58d5ceB3" },
          { v: 7e3, c: "#5bdae8B3" },
          { v: 6e3, c: "#6eb4ebB3" },
          { v: 5500, c: "#62a5f9B3" },
          { v: 5e3, c: "#848bffB3" },
          { v: 4500, c: "#7b63ffB3" },
          { v: 4e3, c: "#964effB3" },
          { v: 3500, c: "#c449f9B3" },
          { v: 3e3, c: "#ee42ffB3" },
          { v: 2500, c: "#d13eb8B3" },
          { v: 2e3, c: "#d032aaB3" },
          { v: 0,   c: "#f94ea4B3" }
        ];        
          if (v === null || v === 0) return "#e0e6ed";
          for (const t of s) {
            if (v >= t.v) return t.c;
          }
          return s[s.length - 1].c;
        }
        // --- Vitals conditional coloring helpers (robust parsing) ---
        function parseHeightToInches(heightStr) {
            if (!heightStr && heightStr !== 0) return null;
            const s = String(heightStr).trim();
            if (!s) return null;
            // Normalize common unicode primes/apostrophes and separators
            const norm = s.replace(/[’‘]/g, "'").replace(/[‐–—−]/g, '-').replace(/\s+ft\b/gi, "'").replace(/\s*in\b/gi, '');
            // Patterns like 6'1" or 6' 1 or 6-1 or 6 1
            let m = norm.match(/^(\d{1,2})\s*(?:'|-)\s*(\d{1,2})\s*(?:\"?)$/);
            if (m) {
                const feet = parseInt(m[1], 10);
                const inches = parseInt(m[2], 10);
                if (Number.isFinite(feet)) return feet * 12 + (Number.isFinite(inches) ? inches : 0);
            }
            // Patterns like 6' or 6 (no inches) -> interpret as feet
            m = norm.match(/^(\d{1,2})\s*(?:'|ft)?\s*$/i);
            if (m) {
                const feet = parseInt(m[1], 10);
                if (Number.isFinite(feet)) return feet * 12;
            }
            // Patterns like 601 or 605 -> interpret as feet+inches if 3 digits
            const digits = norm.match(/\d+/g) || [];
            if (digits.length === 1) {
                const raw = digits[0];
                if (raw.length === 3) {
                    const feet = parseInt(raw.slice(0, 1), 10);
                    const inches = parseInt(raw.slice(1), 10);
                    if (Number.isFinite(feet)) return feet * 12 + (Number.isFinite(inches) ? inches : 0);
                }
                // If a plain number and > 50 and < 90, treat as inches
                const num = parseInt(raw, 10);
                if (num >= 50 && num <= 90) return num;
            }
            // If two numbers separated (e.g., "6 1")
            if (digits.length >= 2) {
                const feet = parseInt(digits[0], 10);
                const inches = parseInt(digits[1], 10);
                if (Number.isFinite(feet)) return feet * 12 + (Number.isFinite(inches) ? inches : 0);
            }
            return null;
        }
        function parseWeightToLbs(weightStr) {
            if (!weightStr && weightStr !== 0) return null;
            const s = String(weightStr);
            // look for number followed by lb or lbs
            let m = s.match(/(\d{2,3})\s*(?:lbs?|lb)?/i);
            if (m) return parseInt(m[1], 10);
            // fallback: first 2-3 digit number
            m = s.match(/(\d{2,3})/);
            if (m) return parseInt(m[1], 10);
            return null;
        }
        function parseAgeValue(ageStr) {
            if (!ageStr && ageStr !== 0) return null;
            const s = String(ageStr).trim();
            if (!s) return null;
            // Accept decimals
            const m = s.match(/\d+(?:\.\d+)?/);
            if (!m) return null;
            const n = Number(m[0]);
            return Number.isFinite(n) ? n : null;
        }
        // Use the stronger color palette you suggested for height/weight
        const HEIGHT_WEIGHT_COLORS = {
            low: '#F7A3EBDF',
            mid: '#84b8fbff',
            high: '#96F2CEB9'
        };
        function getVitalsColor(label, pos, rawValue) {
            const position = (pos || '').toUpperCase();
            if (!rawValue) return null;
            if (label === 'AGE') {
                const age = parseAgeValue(rawValue);
                if (age === null) return null;
                if (position === 'WR') {
                    if (age < 26) return '#96F2CEB9';
                    if (age >= 26 && age < 29) return '#84B8FBFF';
                    if (age >= 29 && age < 31) return '#AB8BF5FF';
                    if (age >= 31) return '#F7A3EBDF';
                }
                if (position === 'RB') {
                    if (age <= 24) return '#96F2CEB9';
                    if (age > 24 && age < 25) return '#84B8FBFF';
                    if (age >= 25 && age < 28) return '#AB8BF5FF';
                    if (age >= 28) return '#F7A3EBDF';
                }
                if (position === 'TE') {
                    if (age < 26) return '#96F2CEB9';
                    if (age >= 26 && age < 29.5) return '#84B8FBFF';
                    if (age >= 29.5 && age < 32) return '#AB8BF5FF';
                    if (age >= 32) return '#F7A3EBDF';
                }
                if (position === 'QB') {
                    if (age < 28.5) return '#96F2CEB9';
                    if (age >= 28.5 && age < 33) return '#84B8FBFF';
                    if (age >= 33 && age < 41) return '#AB8BF5FF';
                    if (age >= 41) return '#F7A3EBDF';
                }
                return null;
            }
            if (label === 'WEIGHT') {
                const w = parseWeightToLbs(rawValue);
                if (w === null) return null;
                if (position === 'QB') {
                    if (w < 210) return HEIGHT_WEIGHT_COLORS.low;
                    if (w >= 210 && w <= 250) return HEIGHT_WEIGHT_COLORS.mid;
                    if (w > 250) return HEIGHT_WEIGHT_COLORS.low;
                }
                if (position === 'RB') {
                    if (w < 190) return HEIGHT_WEIGHT_COLORS.low;
                    if (w >= 190 && w < 200) return HEIGHT_WEIGHT_COLORS.mid;
                    if (w >= 200) return HEIGHT_WEIGHT_COLORS.high;
                }
                if (position === 'TE') {
                    if (w < 230) return HEIGHT_WEIGHT_COLORS.low;
                    if (w >= 230 && w < 240) return HEIGHT_WEIGHT_COLORS.mid;
                    if (w >= 240) return HEIGHT_WEIGHT_COLORS.high;
                }
                if (position === 'WR') {
                    if (w < 190) return HEIGHT_WEIGHT_COLORS.low;
                    if (w >= 190 && w <= 200) return HEIGHT_WEIGHT_COLORS.mid;
                    if (w >= 200 && w <= 234) return HEIGHT_WEIGHT_COLORS.high;
                    if (w >= 235) return HEIGHT_WEIGHT_COLORS.low;
                }
                return null;
            }
            if (label === 'HEIGHT') {
                const inches = parseHeightToInches(rawValue);
                if (inches === null) return null;
                if (position === 'QB') {
                    if (inches < 72) return HEIGHT_WEIGHT_COLORS.low;
                    if (inches >= 72 && inches <= 73) return HEIGHT_WEIGHT_COLORS.mid;
                    if (inches > 73) return HEIGHT_WEIGHT_COLORS.high;
                }
                if (position === 'RB') {
                    if (inches >= 75) return HEIGHT_WEIGHT_COLORS.low; // >=6'3"
                    if (inches > 69 && inches < 75) return HEIGHT_WEIGHT_COLORS.high; // >5'9 and <6'3
                    if (inches >= 67 && inches <= 69) return HEIGHT_WEIGHT_COLORS.mid; // 5'7 - 5'9
                    if (inches < 67) return HEIGHT_WEIGHT_COLORS.low;
                }
                if (position === 'TE') {
                    if (inches > 74) return HEIGHT_WEIGHT_COLORS.high; // >6'2
                    if (inches >= 73 && inches <= 74) return HEIGHT_WEIGHT_COLORS.mid; // 6'1 - 6'2
                    if (inches < 73) return HEIGHT_WEIGHT_COLORS.low;
                }
                if (position === 'WR') {
                    if (inches < 71) return HEIGHT_WEIGHT_COLORS.low; // <5'11
                    if (inches >= 71 && inches <= 72) return HEIGHT_WEIGHT_COLORS.mid; // 5'11 - 6'0
                    if (inches > 72) return HEIGHT_WEIGHT_COLORS.high;
                }
                return null;
            }
            return null;
        }
        function getAdpColorForRoster(a){const s=[{v:12,c:"#00EEB6"},{v:24,c:"#14D7CB"},{v:36,c:"#0599AA"},{v:48,c:"#03a8ce"},{v:60,c:"#0690DC"},{v:72,c:"#066CDC"},{v:84,c:"#1350fd"},{v:96,c:"#5e41ff"},{v:108,c:"#7158ff"},{v:120,c:"#964eff"},{v:144,c:"#9200ff"},{v:168,c:"#b70fff"},{v:192,c:"#ba00cc"},{v:216,c:"#e800ff"},{v:240,c:"#db00af"},{v:280,c:"#c70097"},{v:320,c:"#FF0080"}];if(!a||a===0)return null;for(const t of s)if(a<=t.v)return t.c;return s[s.length-1].c}
        function getAgeColorForRoster(p,a){const s={wrTe:[{v:22.5,c:"#00ffc4"},{v:25,c:"#85fff3"},{v:26,c:"#56dfe8"},{v:27,c:"#7dd1ff"},{v:29,c:"#89a3ff"},{v:30,c:"#957cff"},{v:31,c:"#a642ff"},{v:32,c:"#cf60ff"},{v:33,c:"#ff6fe1"}],rb:[{v:22.5,c:"#00ffc4"},{v:24,c:"#85fff3"},{v:25,c:"#56dfe8"},{v:26,c:"#7dd1ff"},{v:27,c:"#89a3ff"},{v:28,c:"#957cff"},{v:29,c:"#a642ff"},{v:30,c:"#cf60ff"},{v:31,c:"#ff6fe1"}],qb:[{v:25.5,c:"#00ffc4"},{v:28,c:"#85fff3"},{v:29,c:"#7dd1ff"},{v:31,c:"#48a6ff"},{v:33,c:"#957cff"},{v:36,c:"#a642ff"},{v:40,c:"#cf60ff"},{v:44,c:"#ff6fe1"}]};let sc=p==="WR"||p==="TE"?s.wrTe:p==="RB"?s.rb:p==="QB"?s.qb:null;if(!sc||!a||a===0)return null;for(const t of sc)if(a<=t.v)return t.c;return sc[sc.length-1].c}
       function getLeagueAbbr(name) {
            if (!name) return "LG";
            const trimmed = name.trim();                       const normalized = trimmed.toLowerCase().replace(/[.,()]/g, '');
            if (LEAGUE_ABBR_OVERRIDES[normalized]) return LEAGUE_ABBR_OVERRIDES[normalized];
            if (trimmed.length <= 4 && !trimmed.includes(' ') && !trimmed.includes('-')) return trimmed.toUpperCase();
            const words = trimmed.split(/[\s-]+/);
            let abbr = words.map(w => w[0] || '').join('');
            return abbr.toUpperCase();
        }
         function getLeagueColor(abbr) { if (!assignedLeagueColors.has(abbr)) { assignedLeagueColors.set(abbr, LEAGUE_COLOR_PALETTE[nextColorIndex % LEAGUE_COLOR_PALETTE.length]); nextColorIndex++; } return assignedLeagueColors.get(abbr); }
        function getRyColor(year) { if (!assignedRyColors.has(year)) { assignedRyColors.set(year, RY_COLOR_PALETTE[nextRyColorIndex % RY_COLOR_PALETTE.length]); nextRyColorIndex++; } return assignedRyColors.get(year); }
        function ordinalSuffix(i){ const j=i%10, k=i%100; if(j===1&&k!==11) return i+'st'; if(j===2&&k!==12) return i+'nd'; if(j===3&&k!==13) return i+'rd'; return i+'th'; }
        // --- Utility Functions ---
        function adjustStickyHeaders() {
            const headerContainer = document.getElementById('header-container');
            if (!headerContainer) return;
            const headerHeight = headerContainer.offsetHeight;
            const rootStyles = getComputedStyle(document.documentElement);
            // The gap is controlled via the --roster-header-gap custom property so designers can fine-tune spacing without
            // touching the JavaScript. Update the value in styles.css to move the sticky team headers closer to or farther
            // from the global header.
            const rosterGapRaw = rootStyles.getPropertyValue('--roster-header-gap');
            const rosterGap = Number.parseFloat(rosterGapRaw) || 0;
            const stickyOffset = Math.max(headerHeight - rosterGap, 0);
            const teamHeaders = document.querySelectorAll('.team-header-item');
            teamHeaders.forEach(header => {
                header.style.top = `${stickyOffset}px`;
            });
            const isRosterPage = document.body?.dataset?.page === 'rosters';
            if (isRosterPage) {
                document.documentElement.style.setProperty('--roster-header-height', `${headerHeight}px`);
            } else {
                document.documentElement.style.removeProperty('--roster-header-height');
            }
        }
        window.addEventListener('resize', adjustStickyHeaders);
        function syncRosterHeaderPosition() {
            const header = document.getElementById('header-container');
            if (!header) return;
            const isRosterPage = document.body?.dataset?.page === 'rosters';
            if (!isRosterPage) {
                if (header.style.transform) {
                    header.style.transform = '';
                }
                return;
            }
            if (header.style.transform) {
                header.style.transform = '';
            }
        }
        window.addEventListener('scroll', syncRosterHeaderPosition, { passive: true });
        window.addEventListener('resize', syncRosterHeaderPosition);
        syncRosterHeaderPosition();
        function showTemporaryTooltip(element, message) {
            const anchor = element || document.body;
            document.querySelectorAll('.custom-tooltip').forEach(node => node.remove());
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = message;
            document.body.appendChild(tooltip);
            const rect = anchor.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            const viewportLeft = window.scrollX + 8;
            const viewportRight = window.scrollX + document.documentElement.clientWidth - 8;
            let left = rect.left + window.scrollX + (rect.width - tooltipRect.width) / 2;
            if (left < viewportLeft) left = viewportLeft;
            if (left + tooltipRect.width > viewportRight) {
                left = Math.max(viewportLeft, viewportRight - tooltipRect.width);
            }
            const top = rect.bottom + window.scrollY + 12;
            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            requestAnimationFrame(() => tooltip.classList.add('is-visible'));
            setTimeout(() => tooltip.classList.add('is-hiding'), 2000);
            setTimeout(() => tooltip.remove(), 2400);
        }
        function openModal() {
            gameLogsModal.classList.remove('hidden');
            modalBody.classList.remove('hidden'); // Ensure game logs table is visible
            statsKeyContainer.classList.add('hidden');
            if (radarChartContainer) radarChartContainer.classList.add('hidden');
            if (newsContainer) newsContainer.classList.add('hidden');
            
            // Reset all buttons to inactive, then activate game-logs button
            const modalInfoBtns = document.querySelectorAll('.modal-info-btn');
            modalInfoBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-panel') === 'game-logs') {
                    btn.classList.add('active');
                }
            });
        }
        function closeModal() {
            gameLogsModal.classList.add('hidden');
            statsKeyContainer.classList.add('hidden');
            if (radarChartContainer) radarChartContainer.classList.add('hidden');
            if (newsContainer) newsContainer.classList.add('hidden');
            
            // Reset all button active states
            const modalInfoBtns = document.querySelectorAll('.modal-info-btn');
            modalInfoBtns.forEach(btn => btn.classList.remove('active'));
            
            // Destroy radar chart if exists to prevent memory leaks
            const radarContainer = document.querySelector('#radar-chart-container .radar-chart-content');
            if (radarContainer && radarContainer._chartInstance) {
                radarContainer._chartInstance.destroy();
                radarContainer.innerHTML = '';
                radarContainer._chartInstance = null;
            }
            
            // Clear current player reference
            state.currentGameLogsPlayer = null;
            state.currentGameLogsPlayerRanks = null;
            state.currentGameLogsSummary = null;
            
            if (!state.isGameLogModalOpenFromComparison) {
                closeComparisonModal();
            } else {
                gameLogsModal.style.zIndex = ''; // Reset z-index
            }
            // Reset the flag
            state.isGameLogModalOpenFromComparison = false;
        }
        function openComparisonModal() {
            if (playerComparisonModal) {
                const modalContent = playerComparisonModal.querySelector('.modal-content');
                const header = document.getElementById('header-container');
                const tradePreview = document.getElementById('tradeSimulator');
                if (modalContent && header && tradePreview) {
                    const headerRect = header.getBoundingClientRect();
                    const tradePreviewRect = tradePreview.getBoundingClientRect();
                    const topPosition = headerRect.bottom + 10;
                    const spacingAdjustment = 6;
                    const availableHeight = tradePreviewRect.top - topPosition - spacingAdjustment;
                    modalContent.style.top = `${topPosition}px`;
                    modalContent.style.height = `${availableHeight}px`;
                    modalContent.style.bottom = 'auto';
                }
                playerComparisonModal.classList.remove('hidden');
                if (comparisonBackgroundOverlay) {
                    comparisonBackgroundOverlay.classList.remove('hidden');
                }
                if (rosterGrid) {
                    rosterGrid.classList.add('hidden');
                }
            }
        }
        function closeComparisonModal() {
            if (playerComparisonModal) {
                const modalContent = playerComparisonModal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.style.top = '';
                    modalContent.style.height = '';
                    modalContent.style.bottom = '';
                }
                playerComparisonModal.classList.add('hidden');
                if (comparisonBackgroundOverlay) {
                    comparisonBackgroundOverlay.classList.add('hidden');
                }
                const comparisonModalBody = document.getElementById('comparison-modal-body');
                if (comparisonModalBody) {
                    comparisonModalBody.innerHTML = '';
                }
                if (rosterGrid) {
                    rosterGrid.classList.remove('hidden');
                }
            }
        }
function setLoading(isLoading, message = 'Loading...') {
    welcomeScreen?.classList.add('hidden');
    if (document.body?.dataset?.page === 'rosters') {
        adjustStickyHeaders();
    }
    
    // Skip loading panel on stats page (uses inline table spinner instead)
    if (document.body?.dataset?.page === 'stats') {
        return;
    }
    
    // Don't disable nav buttons during loading - allow navigation at any time
    if (isLoading) {
        const msgEl = loadingIndicator.querySelector('.loading-message'); if (msgEl) { msgEl.textContent = message; } else { loadingIndicator.textContent = message; }
        loadingIndicator.classList.remove('hidden');
    } else {
        loadingIndicator.classList.add('hidden');
    }
}
        function handleError(error, username) {
            console.error(`Error for user ${username}:`, error);
            if (welcomeScreen) {
                welcomeScreen.classList.remove('hidden');
                welcomeScreen.innerHTML = `<h2 class="text-red-400">Error</h2><p>Could not fetch data for user: ${username}</p><p>${error.message}</p>`;
            }
            rosterView?.classList.add('hidden');
            playerListView?.classList.add('hidden');
        }
        async function fetchWithCache(url) {
            if (state.cache[url]) return state.cache[url];
            const response = await fetch(url);
            if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
            const data = await response.json();
            state.cache[url] = data;
            return data;
        }
(function(){
  const KEY = 'sleeper_username';
  const input = document.getElementById('usernameInput');
  if (!input) return;
  const normalize = () => (input.value || '').trim().toLowerCase();
  function persistNormalized() {
    const v = normalize();
    input.value = v;
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
    input.blur();
  }
  // iOS viewport reset helper (temporary max-scale=1 toggle)
  function resetIOSZoom() {
    const meta = document.querySelector('meta[name="viewport"]');
    if (!meta) return;
    const orig = meta.getAttribute('content') || 'width=device-width, initial-scale=1';
    const cleaned = orig
      .replace(/\s*,?\s*maximum-scale\s*=\s*[^,]+/gi, '')
      .replace(/\s*,?\s*user-scalable\s*=\s*[^,]+/gi, '');
    meta.setAttribute('content', cleaned + ', maximum-scale=1, user-scalable=no');
    setTimeout(() => meta.setAttribute('content', cleaned), 300);
  }
  // hydrate
  const saved = (localStorage.getItem(KEY) || '').trim();
  if (saved) input.value = saved; else { input.removeAttribute('value'); input.value = ''; }
  // listeners
  input.addEventListener('change', persistNormalized);
  input.addEventListener('blur', () => { persistNormalized(); });
  input.addEventListener('keydown', e => { if (e.key === 'Enter') { persistNormalized(); resetIOSZoom(); }});
  // Hook buttons (capture) so normalization executes before fetch handlers, then reset zoom
  ['rostersButton','ownershipButton', 'analyzerButton', 'researchButton'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', () => { persistNormalized(); resetIOSZoom(); }, { capture: true });
  });
})();
// === Hotfix guards (20250825104842) ===
(function(){ 
  const welcome = document.getElementById('welcome-screen');
  const legend  = document.getElementById('legend-section');
  const roster  = document.getElementById('rosterView');
  const list    = document.getElementById('playerListView');
  function setWelcomeWidthVar(){ 
    if (!welcome) return; 
    const w = Math.round(welcome.getBoundingClientRect().width);
    document.documentElement.style.setProperty('--welcome-width', w>0? w+'px' : '720px');
  }
  function enforceLegendVisibility(){ 
    if (!legend) return;
    const onWelcome = welcome && !welcome.classList.contains('hidden');
    const rosterVisible = roster && !roster.classList.contains('hidden');
    const listVisible = list && !list.classList.contains('hidden');
    // Only show legend on welcome, otherwise hide
    legend.classList.toggle('hidden', !(onWelcome && !rosterVisible && !listVisible));
  }
  window.addEventListener('load', () => { setWelcomeWidthVar(); enforceLegendVisibility(); });
  window.addEventListener('resize', setWelcomeWidthVar);
  if (welcome) new MutationObserver(() => { enforceLegendVisibility(); setWelcomeWidthVar(); }).observe(welcome, { attributes:true, attributeFilter:['class'] });
  if (roster)  new MutationObserver(enforceLegendVisibility).observe(roster,  { attributes:true, attributeFilter:['class'] });
  if (list)    new MutationObserver(enforceLegendVisibility).observe(list,    { attributes:true, attributeFilter:['class'] });
  // Service worker update hard reload once
  navigator.serviceWorker && navigator.serviceWorker.addEventListener('controllerchange', () => { 
    if (!window.__reloadedOnce) { window.__reloadedOnce = true; location.reload(); }
  });
})();
// PWA registration (with version bump to bust old caches)
if ('serviceWorker' in navigator) {
  const swPath = pageType === 'welcome'
    ? 'service-worker.js?v=20250825104842'
    : '../service-worker.js?v=20250825104842';
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swPath).catch(()=>{});
  });
}
// Hide legend when switching away from Welcome via UI controls
['rostersButton','ownershipButton','analyzerButton', 'researchButton', 'leagueSelect','positionalViewBtn','lineupViewBtn'].forEach(id=>{
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', hideLegend, {capture:true});
});
/* one-shot legend guard */
document.addEventListener('DOMContentLoaded', function(){
  var legend = document.getElementById('legend-section');
  var roster = document.getElementById('rosterView');
  var list   = document.getElementById('playerListView');
  if (legend && ((roster && !roster.classList.contains('hidden')) || (list && !list.classList.contains('hidden')))) {
    legend.classList.add('hidden');
  }
});

// === Loading Ring Animation (merged from loader-ring.js) ===
(function(){
  const RUNTIME_MS = 14000;
  let raf = null;
  function tick(start, ring){
    const t = performance.now();
    const elapsed = (t - start) % RUNTIME_MS;
    const angle = (elapsed / RUNTIME_MS) * 360;
    ring.style.setProperty('--angle', angle + 'deg');
    raf = requestAnimationFrame(() => tick(start, ring));
  }
  function startRing(el){
    if (!el) return;
    if (raf) cancelAnimationFrame(raf);
    tick(performance.now(), el);
  }
  function observeLoading(){
    const loading = document.getElementById('loading');
    if (!loading) return;
    const ring = loading.querySelector('.loading-ring');
    if (!ring) return;
    const run = () => {
      const hidden = loading.classList.contains('hidden');
      if (hidden){
        if (raf) { cancelAnimationFrame(raf); raf = null; }
      } else {
        if (!raf) startRing(ring);
      }
    };
    run();
    const obs = new MutationObserver(run);
    obs.observe(loading, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('visibilitychange', run);
    window.addEventListener('pageshow', run);
    window.addEventListener('pagehide', () => { if (raf) { cancelAnimationFrame(raf); raf = null; } });
    window.addEventListener('resize', run);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeLoading);
  } else {
    observeLoading();
  }
})();
