/**
 * Auth Guard - Shared authentication check for all pages
 * Ensures user is logged in before page is fully loaded
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ── CONFIG — Supabase connection ────────────────────────
const SUPABASE_URL  = 'https://tzzuxemddkgvgipsaadr.supabase.co';
const SUPABASE_ANON = 'sb_publishable_hV5vJlRZn0MOwQFErJPbww_9605nepF';
// ────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Hide all content initially
document.documentElement.style.opacity = '0';

async function initAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Redirect to login if not authenticated
      window.location.href = 'login.html';
      return;
    }

    // User is authenticated, show content
    document.documentElement.style.opacity = '1';
  } catch (error) {
    console.error('Auth check failed:', error);
    window.location.href = 'login.html';
  }
}

// Initialize auth check
initAuth();

// Export supabase client for use in other scripts
export { supabase };
