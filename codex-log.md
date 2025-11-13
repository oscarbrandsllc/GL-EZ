# Codex Log - Game Logs Modal Analysis

## Date: Initial Analysis Session
**Task**: Comprehensive analysis of the game logs modal system

---

## Analysis Overview

This document contains a thorough analysis of the game logs modal implementation across three key files:
- `GL-EZ_DH/rosters/rosters.html` - HTML structure
- `GL-EZ_DH/scripts/app.js` - JavaScript functionality
- `GL-EZ_DH/styles/styles.css` - CSS styling

**Purpose**: To understand the complete architecture and implementation details of the game logs modal system in preparation for implementing additional features.

---

## HTML Structure Analysis (`rosters.html`)

### Modal Container
- **ID**: `game-logs-modal`
- **Classes**: `hidden` (toggled for visibility)
- **Location**: Lines 265-362 in `rosters.html`

### Key Structural Components

#### 1. Modal Overlay
```html
<div class="modal-overlay"></div>
```
- Full-screen backdrop with blur effect
- Click handler closes modal

#### 2. Modal Content
```html
<div class="modal-content glass-panel">
```
- Contains all modal content
- Fixed width: 686px
- Max-height: 90vh
- Uses glass-panel styling

#### 3. Modal Header (`#modal-header`)
- **Player Name**: `#modal-player-name` (h3 element)
- **Player Vitals**: `#modal-player-vitals` (dynamically populated)
- **Summary Chips**: `#modal-summary-chips` container with:
  - FPTS chip (with pos rank and overall rank)
  - PPG chip (with pos rank and overall rank)
  - KTC chip (with pos rank and overall rank)

#### 4. Modal Body (`#modal-body`)
- **Purpose**: Contains the game logs table
- **Structure**: 
  - Container: `.game-logs-table-container`
  - Horizontal scroll wrapper: `.game-logs-hscroll`
  - Header wrapper: `.game-logs-table-header`
  - Body wrapper: `.game-logs-table-body` (scrollable, max-height: 316px)
  - Footer wrapper: `.game-logs-table-footer`

#### 5. Overlay Panels (within `#modal-body`)
Three panels that overlay the game logs table:

**A. Stats Key Panel** (`#stats-key-container`)
- Class: `hidden stats-key-panel`
- Contains comprehensive list of stat abbreviations
- Position: absolute overlay covering entire modal body
- Background: `rgb(21 22 37 / 95%)`

**B. Radar Chart Panel** (`#radar-chart-container`)
- Class: `hidden stats-key-panel`
- Contains: `.radar-chart-content` (canvas rendered here)
- Position: absolute overlay
- Background: radial-gradient

**C. News Container** (`#news-container`)
- Class: `hidden stats-key-panel`
- Contains: `.news-content`
- Position: absolute overlay
- Background: `rgba(13, 14, 27, 0.95)`

#### 6. Modal Footer (`.modal-footer`)
Four tab-like buttons:
- **GM-Logs**: `data-panel="game-logs"` (default active)
- **Performance**: `data-panel="radar-chart"`
- **News**: `data-panel="news"`
- **Key**: `data-panel="stats-key"`

Each button has:
- Icon (Font Awesome)
- Label text
- Active state styling

---

## JavaScript Functionality Analysis (`app.js`)

### Key Constants & Configuration

#### MAX_DISPLAY_WEEKS
```javascript
const MAX_DISPLAY_WEEKS = 17;
```
- Controls how many weeks are displayed in game logs

#### RADAR_STATS_CONFIG
Position-specific configuration for radar chart:
- **QB**: 8 stats (fpts, ppg, pass_rtg, cmp_pct, pa_ypg, ttt, yds_total, imp_per_g), maxRank: 36
- **RB**: 8 stats (fpts, ppg, yds_total, snp_pct, ypc, rec_tgt, mtf_per_att, yco_per_att), maxRank: 48
- **WR/TE**: 8 stats (fpts, ppg, rec, rec_ypg, ts_per_rr, yprr, first_down_rec_rate, imp_per_g), maxRank: 72/24

#### Stat Order Arrays
Position-specific stat display order:
- `qbStatOrder`: 24 stats
- `rbStatOrder`: 23 stats
- `wrTeStatOrder`: 22 stats

### Core Functions

#### 1. `handlePlayerNameClick(player)` (Line 2988)
**Trigger**: Click on player name
**Flow**:
1. Shows loading panel with spinner
2. Opens modal (`openModal()`)
3. Fetches game logs (`fetchGameLogs(player.id)`)
4. Calculates player ranks (`calculatePlayerStatsAndRanks` or `getStatsPagePlayerRanks`)
5. Renders game logs (`renderGameLogs()`)

**State Updates**:
- Sets `state.isGameLogModalOpenFromComparison` if opened from comparison modal
- Adjusts z-index if needed

#### 2. `fetchGameLogs(playerId)` (Line 1504)
**Purpose**: Retrieves weekly stats for a player
**Data Sources**:
- First ensures stats sheets are loaded (`fetchPlayerStatsSheets()`)
- Then ensures Sleeper live stats are synced (`ensureSleeperLiveStats()`)
- Gets combined weekly stats (`getCombinedWeeklyStats()`)
- Returns array of `{ week, stats }` objects

#### 3. `renderGameLogs(gameLogs, player, playerRanks)` (Line 3129)
**This is the core rendering function - very complex (~1000 lines)**

**Key Responsibilities**:

A. **State Management**:
- Stores current player in `state.currentGameLogsPlayer`
- Stores player ranks in `state.currentGameLogsPlayerRanks`
- Stores summary in `state.currentGameLogsSummary`

B. **Header Rendering**:
- Creates position tag (QB, RB, WR, TE)
- Creates team logo chip
- Renders player vitals
- Renders summary chips (FPTS, PPG, KTC) with rank annotations

C. **Table Structure**:
- Builds column definitions based on position
- Defines column widths (`COLUMN_WIDTHS` object)
- Groups stats by category (all, passing, rushing, receiving)

D. **Row Generation** (Weeks 1-17):
For each week:
- Determines if week is played/unplayed/bye/live
- Creates week tag with opponent and opponent rank
- Calculates stat values (with fallbacks and calculations)
- Handles special cases:
  - Projections (proj cell styling)
  - Live weeks (suppress non-FPTS stats if only live data)
  - Calculated stats (ypc, yprr, ts_per_rr, etc.)
  - Formatting (percentages, decimals, integers)

E. **Table Construction**:
- Uses TanStack Table library (with fallback to manual rendering)
- Creates three sections (header, body, footer)
- Applies column sizing
- Wraps in horizontal scroll container

F. **Footer (Season Totals)**:
- Calculates aggregated totals
- Handles averages (ypc, prs_pct, etc.)
- Displays rank annotations for each stat
- Stores footer stats in `state.currentGameLogsFooterStats` for radar chart

G. **Divider Row**:
- Inserts visual divider between played and upcoming weeks
- Position based on `state.currentNflWeek`

H. **Panel Management**:
- Appends overlay panels (stats-key, radar-chart, news) to modal body
- All panels start hidden

#### 4. `renderPlayerRadarChart(playerId, position)` (Line 2640)
**Trigger**: When radar-chart panel is opened
**Data Source**: `getPlayerRadarData(playerId, position)`

**Process**:
1. Gets radar data from footer stats and season totals
2. Creates Chart.js radar chart
3. Scales ranks (1-7 compressed into 73-85%, rest scaled linearly to 10%)
4. Applies custom plugins:
   - `playerRadarBackgroundPlugin`: Background circles
   - `playerRadarLabelPlugin`: Stat labels around perimeter
   - `playerRadarAxisLabelsPlugin`: Axis labels with values
5. Stores chart instance for cleanup

#### 5. `getPlayerRadarData(playerId, position)` (Line 2213)
**Data Sources** (priority order):
1. `state.currentGameLogsFooterStats` (calculated from game logs)
2. `state.currentGameLogsPlayerRanks` (for PPG specifically)
3. `state.playerSeasonStats` (season totals from sheets)
4. `state.statsPagePlayerData` (if from stats page)

**Stat Calculations**:
- PPG: Always uses `playerRanks.ppg`
- FPTS: Uses summary snapshot or season totals
- Calculated stats (ypc, yco_per_att, etc.): Recalculated from season totals
- Other stats: From footer stats or season totals

**Rank Scaling**:
- Converts ranks to 0-100 scale for radar display
- Rank 1 → 85%
- Ranks 1-7 → 73-85% (compressed)
- Ranks 7-maxRank → 73-10% (linear)

#### 6. `openModal()` (Line 6157)
**Actions**:
- Removes `hidden` class from modal
- Hides all overlay panels
- Activates game-logs button
- Shows modal body

#### 7. `closeModal()` (Line 6173)
**Actions**:
- Adds `hidden` class to modal
- Hides all overlay panels
- Resets button states
- Destroys radar chart instance (memory cleanup)
- Clears state references
- Handles comparison modal z-index reset

#### 8. Panel Toggle Logic (Lines 459-520)
**Behavior**:
- Clicking a panel button toggles that panel
- Only one overlay panel visible at a time
- Game-logs panel can't be toggled off (always show table when no overlay active)
- Radar chart renders when opened (if player data available)

**Button Active States**:
- `.active` class applied to active button
- Visual styling: glow effect, color change

### Rank Annotation System

#### `createRankAnnotation(rank, options)` (Line 2518)
**Options**:
- `wrapInParens`: Wrap in parentheses (default: true)
- `ordinal`: Add ordinal suffix (st, nd, rd, th) (default: false)
- `variant`: CSS variant class (default: 'default')

**Variants**:
- `gamelogs-footer`: Footer rank annotations
- `gamelogs-opponent`: Opponent rank in week tag
- `compare`: Player comparison modal
- `ktc`: KTC rank in player cards

**Structure**:
```html
<span class="stat-rank-annotation stat-rank-variant-{variant}">
  <span class="stat-rank-number">{number}</span>
  <sup class="stat-rank-suffix-{variant}">{suffix}</sup>
</span>
```

#### `getRankDisplayText(rank)` (Line 2202)
- Converts rank value to display string
- Handles null/undefined → 'NA'
- Handles numbers → string conversion

### Stat Calculation & Formatting

#### Complex Stat Calculations:
- **ypc**: `rush_yd / rush_att`
- **yco_per_att**: `rush_yac / rush_att`
- **mtf_per_att**: `mtf / rush_att`
- **pass_imp_per_att**: `(pass_imp / pass_att) * 100`
- **ts_per_rr**: `(rec_tgt / rr) * 100`
- **yprr**: `rec_yd / rr`
- **ypr**: `rec_yd / rec`
- **first_down_rec_rate**: `(rec_fd / rec) * 100`
- **imp_per_g**: Falls back to `imp` if not directly available

#### Formatting Functions:
- `formatPercentage(value)`: Converts to percentage string
- Integer vs decimal detection
- Position-specific decimal precision

### Special Week Handling

#### Week Types:
1. **Unplayed Weeks**: Projection weeks or weeks with no recorded stats
   - Show projections if available
   - Show '-' for other stats
   - Opacity: 0.82
   - Class: `unplayed-week-row`

2. **Live Weeks**: Weeks currently in progress
   - Show FPTS if available
   - May suppress other stats if only live data (`suppressNonFptsForLiveOnly`)
   - Class: `live-week-row`

3. **Bye Weeks**: `opponent === 'BYE'`
   - Show 'BYE' in week tag
   - Class: `bye-week-row`

#### Week Divider:
- Visual divider between completed and upcoming weeks
- Position based on `state.currentNflWeek`
- Class: `week-divider-row`

### Data Flow & State Management

#### State Variables:
- `state.currentGameLogsPlayer`: Current player object
- `state.currentGameLogsPlayerRanks`: Calculated ranks
- `state.currentGameLogsSummary`: Summary stats (fpts, ppg)
- `state.currentGameLogsFooterStats`: Footer stats for radar chart
- `state.isGameLogFromStatsPage`: Flag for stats page context
- `state.statsPagePlayerData`: Player data from stats page
- `state.isGameLogModalOpenFromComparison`: Modal stacking flag

#### Data Sources Priority:

**For Roster Page**:
1. League-specific matchup data (`state.leagueMatchupStats`)
2. Combined weekly stats from sheets
3. Season totals from sheets

**For Stats Page**:
1. Sheet data passed via `state.statsPagePlayerData`
2. Uses `fpt_ppr` instead of calculated FPTS

---

## CSS Styling Analysis (`styles.css`)

### Modal Container Styling

#### Base Modal (`#game-logs-modal`)
- Position: fixed, full screen
- Z-index: 100
- Display: flex, centered
- Transition: opacity 0.2s

#### Modal Content (`.modal-content`)
- Width: 686px
- Max-width: 90%
- Max-height: 90vh
- Fixed height: 600px (when visible)
- Padding: 0.65rem 0.85rem 0.25rem 0.85rem
- Border-radius: `var(--panel-border-radius)`
- Transform animation: scale(0.95 → 1) on open

#### Modal Overlay (`.modal-overlay`)
- Absolute positioning, full coverage
- Background: `rgba(0, 0, 0, 0.5)`
- Backdrop-filter: blur(4px)

### Header Styling

#### Position & Team Tags
- **`.modal-pos-tag`**: Position tags (QB, RB, WR, TE)
  - Position-specific colors
  - Glass-morphism effect
  - Border-radius: 1rem
  
- **`.modal-team-logo-chip`**: Team logo container
  - Team-specific glow effects (via CSS variables)
  - Per-team box-shadow overrides
  - Logo size: 24x24px

#### Summary Chips (`.gamelogs-summary-chip`)
- Flex layout, equal width
- Glass-morphism background
- Border-radius: 13px
- Three chips: FPTS, PPG, KTC
- Each shows value with position rank and overall rank
- Color-coded by rank quality

### Table Styling

#### Table Container Structure:
```
.game-logs-table-container
  └─ .game-logs-hscroll (horizontal scroll wrapper)
      └─ .game-logs-hscroll-content
          ├─ .game-logs-table-header
          ├─ .game-logs-table-body (max-height: 316px, scrollable)
          └─ .game-logs-table-footer
```

#### Horizontal Scrolling:
- `.game-logs-hscroll`: `overflow-x: auto`
- Mobile scrollbar: 6px height, subtle styling
- Scroll synced across header/body/footer

#### Table Body:
- Max-height: 316px (desktop), 266px (mobile)
- Vertical scrolling: `overflow-y: auto`
- Scrollbar styling: thin, subtle (rgba(255,255,255,0.06))

#### Table Cells:
- Font-size: 0.7rem
- Padding: 0.2rem 0.25rem
- Fixed column widths (via COLUMN_WIDTHS in JS)

#### Column Group Styling:
- **Passing stats**: `gamelog-header-passing` → color: `#FFB2D8`
- **Rushing stats**: `gamelog-header-rushing` → color: `#75e0b7`
- **Receiving stats**: `gamelog-header-receiving` → color: `#63b0de`
- **All stats**: `gamelog-header-all` → color: `#b7adfe`

### Week Tag Styling (`.gamelog-week-tag`)

**Structure**:
- Fixed width: 57px, height: 26px
- Grid layout (2 lines)
- Glass-morphism effect

**Lines**:
1. **Week Number** (`.gamelog-week-tag-number`):
   - Font-size: 0.6rem
   - Font-weight: 700
   - Color: `#8f93ab`

2. **Opponent Line** (`.gamelog-week-tag-opponent`):
   - Font-size: 0.5rem
   - Contains opponent abbreviation and rank
   - Opponent rank color-coded by difficulty

**States**:
- Unplayed weeks: opacity 0.52
- Live weeks: opacity 1

### Footer Styling

#### Footer Header Row:
- Displays column labels again
- First column: "SZN" instead of "WK · VS"
- Shows season year and games played

#### Footer Stats:
- Each stat cell: `.has-rank-annotation`
- Value stacked above rank annotation
- Rank annotation: bulleted style (• rank •)
- Color-coded by position rank quality

#### Rank Annotation Styling:
- Font-size: 0.6rem
- Ordinal suffix (st, nd, rd, th)
- Position-specific color coding

### Overlay Panels Styling

All three panels share similar overlay behavior:

#### Common Properties:
- Position: absolute
- Inset: 0 (covers entire modal body)
- Z-index: 5 (above table)
- Border-radius: 9px
- Overflow-y: auto

#### Stats Key Panel (`#stats-key-container`):
- Background: `rgb(21 22 37 / 95%)`
- Padding: 1rem
- Grid layout: 2 columns (1 column on mobile)
- List items with hover effects

#### Radar Chart Panel (`#radar-chart-container`):
- Background: radial-gradient
- Padding: 0.41rem
- Canvas sizing:
  - Desktop: 370px height, max 460px
  - Mobile: 294px height, max 360px

#### News Container (`#news-container`):
- Background: `rgba(13, 14, 27, 0.95)`
- Padding: 1rem
- Border: `1px solid #444`

### Modal Footer Buttons (`.modal-footer`)

#### Layout:
- Flex layout, centered
- Gap: 0.4rem
- Font-size: 0.75rem

#### Button Styling (`.key-chip`):
- Glass-morphism effect
- Border-radius: 4px
- Padding: 5px 7px
- Transition: color, filter, transform

#### Active State (`.modal-info-btn.active`):
- Color: primary text color
- Glow effect: `drop-shadow` filters
- Brightness: 1.15

### Loading Animation

#### Loading Container (`.game-logs-loading-container`):
- Position: absolute, covers modal body
- Z-index: 100 (above everything)
- Padding: 2rem

#### Spinner (`.game-logs-loading-spinner`):
- Size: 140px
- Two rings (before/after pseudo-elements)
- Animation: `game-logs-spin` (1.4s rotation)
- Pulse animation on inner glow

#### Loading Message:
- Font-size: 1rem
- Max-width: 420px
- Color: `#BDC1D8`

### Responsive Design

#### Mobile Breakpoint: `@media (max-width: 640px)`

**Modal Content**:
- Height: 545px (desktop: 600px)

**Modal Body**:
- Height: 352px (desktop: 416px)
- Max-height: 65vh

**Table Body**:
- Max-height: 266px (desktop: 316px)

**Radar Chart**:
- Height: 294px (desktop: 370px)
- Max-height: 360px (desktop: 460px)
- Reduced padding

### Special Styling Patterns

#### Glass-Morphism:
Widely used throughout:
- Backdrop-filter: blur + saturate
- Border: semi-transparent
- Box-shadow: inset highlights
- Multiple layers with pseudo-elements

#### Color System:
- Position colors (CSS variables):
  - QB: `#FF3A75`
  - RB: `#00EBC7`
  - WR: `#58A7FF`
  - TE: `#B469FF`

- Rank colors:
  - Position-specific conditional coloring
  - Overall rank color scale
  - Opponent rank color coding

#### Transition & Animation:
- Modal open/close: transform + opacity (0.2s)
- Button hover: color transition (0.2s)
- Loading spinner: rotation + pulse
- Panel transitions: instant (no animation)

---

## Key Architectural Patterns

### 1. Panel Management
- Overlay panels are absolutely positioned within modal body
- Only one panel visible at a time
- Game logs table always underneath
- Tab-like button interface

### 2. Data Flow
- Game logs → renderGameLogs → footer stats → radar chart
- State management for current player context
- Separate data paths for rosters page vs stats page

### 3. Scroll Management
- Horizontal scroll: shared across header/body/footer
- Vertical scroll: body only
- Wheel events routed to horizontal scroll
- Mobile-optimized scrollbars

### 4. Stat Display Strategy
- Position-specific stat orders
- Calculated stats vs raw stats
- Formatting based on stat type (percentage, decimal, integer)
- Rank annotations with position-specific coloring

### 5. Week Rendering Logic
- Week-by-week iteration (1-17)
- Complex state determination (played/unplayed/live/bye)
- Divider insertion based on current week
- Special handling for projections and live data

---

## Dependencies & Libraries

### External Libraries:
1. **Chart.js**: Radar chart rendering
2. **TanStack Table**: Table structure (with manual fallback)
3. **Font Awesome**: Icons throughout

### Internal Dependencies:
- Player data from Sleeper API
- Stats data from Google Sheets
- League-specific scoring calculations

---

## Notes for Future Development

### Areas That May Need Extension:
1. **Rank Annotations**: Currently used in footer and week tags; could extend to table cells
2. **Panel System**: Easily extensible - just add new panel container and button
3. **Stat Calculations**: Complex but modular - new stats can be added to calculation chains
4. **Data Sources**: Multiple fallback chains - consider centralizing
5. **Week Handling**: Currently hardcoded to 17 weeks; consider making configurable

### Performance Considerations:
1. Large table rendering (~1000 lines in renderGameLogs)
2. Chart.js instance cleanup (currently handled)
3. Scroll event handling (wheel events)
4. State management (multiple state variables)

### Accessibility Considerations:
1. Modal keyboard navigation (ESC to close)
2. Focus management
3. ARIA labels on buttons
4. Screen reader considerations for table structure

---

## Files Modified in This Analysis Session

**No code changes made** - This is an analysis-only session.

**Files Analyzed**:
- `GL-EZ_DH/rosters/rosters.html` (lines 265-362)
- `GL-EZ_DH/scripts/app.js` (multiple sections)
- `GL-EZ_DH/styles/styles.css` (lines 2736-4285+)

---

## Conclusion

The game logs modal is a sophisticated, multi-layered component with:
- Complex data fetching and calculation logic
- Flexible panel system for overlays
- Comprehensive stat display with position-specific configurations
- Advanced styling with glass-morphism effects
- Responsive design considerations
- Clean state management

The system is well-architected for extension, with clear separation of concerns and modular design patterns.

