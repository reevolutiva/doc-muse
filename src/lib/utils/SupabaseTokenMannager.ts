"use client"

export class SupabaseTokenManager {
  static setSession(session: any) {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem("supabase.session") && session) {
        localStorage.setItem("supabase.session", JSON.stringify(session));
      }
    }
  }

  static getSession() {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem("supabase.session") || "{}");
    }
    return {};
  }
}