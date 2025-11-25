# API Reference - Demolition Tracker

## Database Schema

### Demolitions Table
```typescript
{
  id: string (UUID, auto-generated)
  ownerName: string | null
  buildingName: string (required)
  location: string | null
  demolitionDate: Date (with timezone, required)
  imageUrl: string | null
  extractedText: string | null
  notes: string | null
  createdAt: Date (auto-generated)
}
```

## Backend API Endpoints (To Be Implemented)

### GET /api/demolitions
Returns all demolition notices
```json
Response: Array<Demolition>
```

### POST /api/demolitions
Create a new demolition notice
```json
Request Body: {
  ownerName?: string
  buildingName: string
  location?: string
  demolitionDate: string (ISO format)
  imageUrl?: string
  extractedText?: string
  notes?: string
}
```

### PATCH /api/demolitions/:id
Update an existing demolition notice
```json
Request Body: {
  ownerName?: string
  buildingName?: string
  location?: string
  demolitionDate?: string
  imageUrl?: string
  extractedText?: string
  notes?: string
}
```

### DELETE /api/demolitions/:id
Delete a demolition notice

### POST /api/upload-image
Upload and process demolition notice image
```json
Request: FormData with 'image' file
Response: {
  imageUrl: string
  extractedData: {
    ownerName?: string
    buildingName: string
    location?: string
    demolitionDate: string
    extractedText: string
  }
}
```

## AI Integration (OpenAI)

### Available Integration
- **Integration ID**: `javascript_openai` (already installed)
- **Purpose**: Extract demolition information from uploaded images
- **API Key**: Managed automatically by Replit integration

### Image Processing Flow
1. User uploads image → Frontend sends to `/api/upload-image`
2. Backend saves image (can use Replit Object Storage)
3. OpenAI Vision API extracts text from image
4. Parse extracted text for:
   - Owner name
   - Building name
   - Location/region
   - Demolition date and time
5. Return structured data to frontend
6. Show confirmation dialog for user to review/edit
7. Save to database on confirmation

### Example OpenAI Vision Call
```typescript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [{
    role: "user",
    content: [
      {
        type: "text",
        text: "Extract demolition notice information. Return JSON with: ownerName, buildingName, location, demolitionDate (ISO format), fullText"
      },
      {
        type: "image_url",
        image_url: { url: imageUrl }
      }
    ]
  }],
  response_format: { type: "json_object" }
});
```

## Notification System (To Be Implemented)

### Email Options Available
Multiple email integrations available through Replit:
- Replit Mail (built-in, easiest)
- SendGrid
- Resend
- Gmail
- Outlook

### Reminder Logic
Send notifications at:
- 7 days before demolition
- 3 days before demolition
- 1 day before demolition
- 6 hours before demolition

Store last notification sent in database to avoid duplicates.
