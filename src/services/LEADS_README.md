# Captured Leads Documentation & Database Integration

This document explains how lead capturing is structured in the Chat Assistant and how to connect it to your database backend (Supabase or KiuQ) tomorrow.

## Current Setup (Temporary Local Storage)

Leads captured during the chat advisor's Guided Quote Request flow are stored locally in the user's browser `localStorage` under the key:
`kz-captured-leads`

### Data Structure

Each lead record matches the following TypeScript interface:

```typescript
export interface LeadData {
  id: string;                      // Unique random string ID
  timestamp: string;               // ISO 8601 timestamp when captured
  sourcePage: string;              // Pathname of page where chat was active (e.g. "/typhon-machinery/terror-xxv")
  name: string;                    // User's name
  company?: string;                // User's company name (Step 2/6, optional)
  email?: string;                  // Extracted email (if provided in contact field)
  phone?: string;                  // Extracted phone number (if provided in contact field)
  productInterest?: string;        // Product model name (prefilled or chosen)
  productUrl?: string;             // Catalog or detail link for interest product
  message?: string;                // Description of work/job they plan to do
  location?: string;               // Shipping location (City, State, or Country)
  chatTranscriptSummary?: string;  // Formatted transcript history of user/bot messages
  currentLanguage?: string;        // Language code user was using (e.g. "EN")
  consentIntent?: string;          // Consent notes or query context
}
```

---

## How to Connect to Supabase/KiuQ Tomorrow

To sync captured leads directly to your backend database:

1. **Create the Database Table**
   Create a table (e.g., `leads`) in your database. SQL definition:
   ```sql
   create table public.leads (
     id text primary key,
     created_at timestamptz not null default now(),
     source_page text,
     name text not null,
     company text,
     email text,
     phone text,
     product_interest text,
     product_url text,
     message text,
     location text,
     transcript_summary text,
     current_language text,
     consent_intent text
   );
   ```

2. **Uncomment Backend Sync in leadCaptureService.ts**
   Open [leadCaptureService.ts](file:///Users/sour/Documents/Konstructz%20Project%20Website/src/services/leadCaptureService.ts) and locate the backend integration block at line 64.
   
   Uncomment the block so it triggers the insert on form submission:
   ```typescript
   // 2. Future Backend (Supabase/KiuQ) Integration Hook
   try {
     const { data, error } = await supabase
       .from("leads") // Or your KiuQ system table name
       .insert([
         {
           id: newLead.id,
           created_at: newLead.timestamp,
           source_page: newLead.sourcePage,
           name: newLead.name,
           company: newLead.company,
           email: newLead.email,
           phone: newLead.phone,
           product_interest: newLead.productInterest,
           product_url: newLead.productUrl,
           message: newLead.message,
           location: newLead.location,
           transcript_summary: newLead.chatTranscriptSummary,
           current_language: newLead.currentLanguage,
           consent_intent: newLead.consentIntent
         }
       ]);
     if (error) {
       console.error("[LeadCaptureService] Backend insertion error:", error.message);
     } else {
       console.log("[LeadCaptureService] Lead successfully synced to backend database.");
     }
   } catch (err) {
     console.error("[LeadCaptureService] Backend connection failed:", err);
   }
   ```

3. **Verify supabase.ts Client**
   The service uses the default Supabase client configured in `@/lib/supabase`. Ensure your `.env` contains the required credentials:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
