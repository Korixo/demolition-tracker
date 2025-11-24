# Design Guidelines: Demolition Notice Management System

## Design Approach

**Selected Approach:** Design System - Material Design influenced dashboard pattern
**Rationale:** Utility-focused property management tool requiring data density, clear forms, and efficient workflows. Prioritizes usability and information hierarchy over visual experimentation.

**Key Principles:**
- Information clarity above decoration
- Efficient data scanning and action flows
- Professional property management aesthetic
- Mobile-responsive for field use

## Typography

**Font Families:**
- Primary: Inter (headings, UI elements)
- Secondary: System fonts for data/tables

**Hierarchy:**
- Page titles: text-3xl font-bold
- Section headers: text-xl font-semibold
- Card titles: text-lg font-medium
- Body text: text-base
- Helper text/metadata: text-sm text-gray-600
- Data labels: text-xs font-medium uppercase tracking-wide

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4 or p-6
- Section spacing: gap-6 or gap-8
- Card spacing: p-6
- Form field spacing: space-y-4

**Container Strategy:**
- Max width: max-w-7xl mx-auto
- Dashboard grid: 12-column responsive grid
- Side padding: px-4 md:px-6 lg:px-8

## Component Library

### Navigation
- **Top Navigation Bar:** Sticky header with logo left, user menu right, minimal height (h-16)
- **Sidebar (Desktop):** 256px width, collapsible, navigation links with icons
- **Mobile:** Hamburger menu, slide-out drawer

### Dashboard Layout
- **Stats Cards:** 3-4 column grid showing: Total Properties, Upcoming Demolitions, Alerts, Recent Activity
- **Main Content Area:** Two-column split (70/30) - data table/cards on left, upcoming reminders sidebar on right
- **Quick Actions:** Floating action button (bottom-right) for "Upload New Notice"

### Forms & Upload
- **Upload Zone:** Large drag-and-drop area (min-h-64), dashed border, centered icon and text
- **Confirmation Dialog:** Modal overlay with extracted data preview, editable fields, Accept/Reject buttons
- **Input Fields:** Full-width with labels above, helper text below, clear validation states

### Data Display
- **Property Cards:** Grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
  - Property image thumbnail
  - Address as card title
  - Demolition date (prominent, with countdown)
  - Status badge (Pending/Confirmed/Reminded)
  - Quick action buttons (Edit, View Details, Delete)

- **Data Table (Alternative View):** Sortable columns: Property, Address, Demolition Date, Status, Actions
  - Sticky header, zebra striping, row hover states
  - Pagination at bottom

### Notifications & Reminders
- **Reminder Sidebar:** Chronological list of upcoming demolitions
  - Time-based grouping (Today, Tomorrow, This Week, Later)
  - Compact card format with address, time remaining
  - Dismiss/snooze actions

- **Toast Notifications:** Top-right corner for success/error messages after actions

### Detail View
- **Property Detail Page:** 
  - Hero area with property image (h-64)
  - Split layout: Property info (left), Timeline & Reminders (right)
  - Tabbed interface for Documents, History, Notes

## Images

**Hero Section:** No traditional hero - dashboard-first approach. Direct to functionality.

**Property Images:**
- Thumbnail size: aspect-square, object-cover in cards
- Detail view: aspect-video, max-h-96
- Upload preview: Full-width within modal, max-h-screen

**Placeholders:** Use icon-based placeholders (building icon) when no image uploaded

**Image Locations:**
- Property cards: Top of card, full-width
- Detail view: Top section, full-width with subtle overlay for status badge
- Upload confirmation: Center of modal with extracted text overlay

## Responsive Behavior

**Desktop (lg:):** 
- Sidebar visible, multi-column grids
- Table view default for data

**Tablet (md:):**
- Collapsible sidebar, 2-column grids
- Hybrid table/card view

**Mobile (base):**
- Hidden sidebar (hamburger), single column
- Card view only, stacked layout
- Bottom navigation for key actions

## Key Interactions

- **Upload Flow:** Click/drop image → AI processing indicator → Confirmation modal with editable fields → Success toast + redirect to property list
- **Reminder Setup:** Auto-scheduled on confirmation, visible in sidebar with countdown timers
- **Search/Filter:** Top bar with property search, date range picker, status filter dropdowns
- **Batch Actions:** Checkbox selection in table view for bulk operations

## Form Components

- Text inputs: border, rounded-md, focus:ring state
- Dropdowns: Native select styling with chevron icon
- Date pickers: Calendar widget with time selector
- File upload: Drag-drop zone with progress indicator
- Buttons: Primary (solid), Secondary (outline), Destructive (red)

## Accessibility

- Clear focus states on all interactive elements
- Proper heading hierarchy (h1 → h2 → h3)
- ARIA labels for icon-only buttons
- Form labels always visible (no placeholder-only)
- Keyboard navigation support throughout