# Demolition Tracker - Project Documentation

## Overview
A single-user web application for managing property demolition notices extracted from ArcheAge game screenshots using AI. The app tracks demolition data (owner name, building name, location, demolition date) and processes 100s of images weekly.

## Current Status
- **Deployment**: Railway (free tier) instead of Replit ($20/month)
- **GitHub Repo**: Korixo/demolition-tracker
- **Vision API**: Google Cloud Vision (1000 free images/month, $1.50 per 1000 after)
- **OCR**: Switched from Tesseract.js to Google Cloud Vision for better ArcheAge font recognition
- **Styling**: Light mode with soft blue tones (210 40% 96% background)

## Recent Changes (2025-11-25)

### Google Cloud Vision Integration
- Implemented `server/vision.ts` with Google Cloud Vision API
- Replaces Tesseract.js which struggled with ArcheAge custom fonts
- Features:
  - Handles demolition dates in DD.MM.YYYY, MM-DD-YYYY, and YYYY-MM-DD formats
  - Extracts owner name, building name, location, and demolition date from text
  - Returns extracted text for debugging
- Cost-effective: 1000 free images/month via Google Cloud free tier

### Previous Issues Fixed
1. **Payload Size**: Removed base64 image storage from API responses (was causing PayloadTooLargeError)
2. **OCR Accuracy**: Google Cloud Vision handles ArcheAge game UI fonts much better than Tesseract.js
3. **Styling**: Light mode soft blue background reduces eye strain vs pure white

## Project Architecture

### Frontend
- **Framework**: React + TypeScript
- **Routing**: Wouter
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack React Query
- **Key Pages**:
  - Dashboard: List all properties with countdown timers
  - Property Detail Dialog: View property details

### Backend
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon-backed via Replit)
- **ORM**: Drizzle ORM
- **Storage**: In-memory MemStorage for development (can switch to DB)

### Data Model
```typescript
Property {
  id: serial (primary key)
  ownerName?: string
  buildingName: string
  location?: string
  demolitionDate: string (ISO 8601)
}
```

## Environment Variables Required
- `GOOGLE_CLOUD_API_KEY`: Google Cloud Vision API key (for image extraction)
- `DATABASE_URL`: PostgreSQL connection string (auto-managed)
- `SESSION_SECRET`: Express session secret (auto-managed)

## Cost Analysis
For 100-200 images/month:
- **Google Cloud Vision**: Free tier (1000/month)
- **Hosting**: Railway free tier (~$0)
- **Database**: Neon free tier (included in Replit)
- **Total**: ~$0/month until exceeding 1000 images/month

## Next Steps
1. Test image extraction with ArcheAge demolition notice screenshots
2. Verify countdown timer accuracy for demolition dates
3. Deploy updates to Railway and test in production

## User Preferences
- Cost-effective solution (prioritize free/cheap options)
- Gaming aesthetic for ArcheAge theme
- Batch processing capability for 100s of images weekly
- No user authentication needed (single-user app)
