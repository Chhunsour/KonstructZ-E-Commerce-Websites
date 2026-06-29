/**
 * Lead Capture Service
 * 
 * This service handles capturing lead/contact details entered by the user
 * in the chat assistant (e.g. during a Guided Quote Request).
 * 
 * Storage:
 * For now, leads are saved in the local temporary system (localStorage) under 'kz-captured-leads'.
 * 
 * Future Integration:
 * To connect this to your backend system (Supabase or KiuQ) tomorrow:
 * 1. Ensure a 'leads' table exists in Supabase with columns matching LeadData.
 * 2. Uncomment the Supabase insert block in the capture() function.
 */

import { supabase } from "../lib/supabase"; // Pre-imported for quick swap

export interface LeadData {
  id: string;
  timestamp: string;
  sourcePage: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  productInterest?: string;
  productUrl?: string;
  message?: string;
  location?: string;
  chatTranscriptSummary?: string;
  currentLanguage?: string;
  consentIntent?: string;
}

export const leadCaptureService = {
  /**
   * Captures a new lead and saves it to the temporary local storage system.
   * Can be easily pointed to Supabase or KiuQ database tomorrow.
   */
  capture: async (lead: Omit<LeadData, "id" | "timestamp">): Promise<LeadData> => {
    const id = Math.random().toString(36).slice(2, 10);
    const timestamp = new Date().toISOString();
    
    // Clean and split contact info into email & phone if combined
    let email = lead.email;
    let phone = lead.phone;
    
    const newLead: LeadData = {
      id,
      timestamp,
      ...lead,
      email,
      phone
    };

    // 1. Temporary/Local System Storage
    try {
      const stored = localStorage.getItem("kz-captured-leads") || "[]";
      const list = JSON.parse(stored);
      list.push(newLead);
      localStorage.setItem("kz-captured-leads", JSON.stringify(list));
      console.log("[LeadCaptureService] Lead saved locally:", newLead);
    } catch (e) {
      console.error("[LeadCaptureService] Failed to save lead locally:", e);
    }

    // 2. Future Backend (Supabase/KiuQ) Integration Hook
    // TO CONNECT: Simply uncomment the block below:
    /*
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
    */

    return newLead;
  },

  /**
   * Retrieves all locally captured leads.
   */
  getLeads: (): LeadData[] => {
    try {
      const stored = localStorage.getItem("kz-captured-leads") || "[]";
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
};
