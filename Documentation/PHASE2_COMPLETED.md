# Phase 2 — Trades Core ✅

## Overview
Phase 2 focused on building the trading engine: CRUD operations for trades, stats, balance integration, and risk calculator.

## Deliverables
- **CRUD for Trades** (Add, Edit, Close, Delete).
- **Stats**: Total trades, open/closed trades, win rate, total profit.
- **Balance**: Editable + automatically updated with trade results.
- **Risk Calculator**: Suggests lot size, shows risk %, margin usage, and allows "Send to Add Trade".
- **Trades Table**: Full table with columns (symbol, asset class, direction, entry/exit, lot, SL/TP, strategy, timeframe, notes, P/L, status, actions).
- **UX Improvements**: Scroll bar for table, Enter-to-submit shortcut.

## Testing
- Added/closed trades via API (`curl`) → confirmed profit/loss calculation and balance update.
- Verified Risk Calculator calculations (pip size, margin with leverage).
- Confirmed UI displays all trades, stats, and balance properly.

## Status
✔ Phase 2 completed successfully.  
