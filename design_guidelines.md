# Design Guidelines: Demolition Notice Tracker (Game-Inspired)

## Design Approach

**Selected Approach:** Gaming UI - Dark theme with semi-transparent overlays, inspired by MMORPG property management interfaces
**Rationale:** Based on in-game property management systems. Prioritizes quick information scanning, urgent alerts, and minimal clutter. Dark theme reduces eye strain during extended use.

**Key Principles:**
- Dark-first design with gaming aesthetics
- Information density without clutter
- Urgent notifications prominently displayed
- Semi-transparent overlays and cards
- Focus on property ownership and deadlines

## Color Palette

**Primary Colors:**
- Deep navy/dark blue backgrounds (#0a1628, #0f1f3a)
- Accent blue for highlights (#3b82f6, #60a5fa)
- Urgent red for demolition warnings (#ef4444, #dc2626)
- Success green for completed (#10b981)
- Warning amber for upcoming (#f59e0b)

**Background Strategy:**
- Dark backgrounds as default
- Semi-transparent cards over darker base
- Subtle gradients for depth
- Glowing effects for important info

## Typography

**Font Families:**
- Primary: Inter (clean, gaming-appropriate)
- Data: Monospace for dates/numbers

**Hierarchy:**
- Page titles: text-2xl font-bold
- Property names: text-lg font-semibold
- Info labels: text-xs uppercase tracking-wide opacity-70
- Critical info: text-base font-medium with accent colors

## Layout System

**Spacing:** Compact but readable
- Card padding: p-4
- Section gaps: gap-3 or gap-4
- Minimal whitespace

**Container Strategy:**
- Max width: max-w-6xl
- Floating cards with backdrop blur
- Compact grid layouts

## Component Library

### Property Info Cards
- Dark semi-transparent background
- Blue accent border for active properties
- Red border for urgent demolitions
- Key info: Owner, Property Name, Demo Date, Status
- Compact design like game dialogs

### Urgent Notifications
- Red/amber glow effects
- Prominent countdown timers
- "Go to Location" style buttons
- Floating on top of regular content

### Navigation
- Minimal header with game-style icons
- Dark background with subtle border
- Compact layout

## Key Interactions

- Hover: Subtle glow/highlight
- Click: Slight scale effect
- Urgent items: Pulsing glow animation
- Status changes: Color-coded badges

## Dark Mode
- Default and primary mode
- Optional light mode for accessibility
