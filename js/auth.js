// ═══════════════════════════════════════════════════
// auth.js — KartPit Supabase Auth Helper
// Include this script on every protected page
// ═══════════════════════════════════════════════════

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ── Config ── Replace with your Supabase project details
export const SUPABASE_URL  = 'https://tzzuxemddkgvgipsaadr.supabase.co';
export const SUPABASE_ANON = 'sb_publishable_hV5vJlRZn0MOwQFErJPbww_9605nepF';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ── Get current session ──────────────────────────────────
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ── Get profile row (includes role) ─────────────────────
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('Profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

// ── Require login — redirect to login.html if not authed ─
export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

// ── Require admin role ───────────────────────────────────
export async function requireAdmin() {
  const session = await requireAuth();
  if (!session) return null;
  const profile = await getProfile(session.user.id);
  if (!profile || profile.role !== 'admin') {
    window.location.href = 'index.html'; // redirect non-admins
    return null;
  }
  return { session, profile };
}

// ── Sign out ─────────────────────────────────────────────
export async function signOut() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}
