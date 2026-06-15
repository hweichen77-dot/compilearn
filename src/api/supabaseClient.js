import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Auth helpers ──────────────────────────────────────────────────────────────
export const auth = {
  signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
  signUp: (email, password) => supabase.auth.signUp({ email, password }),
  signOut: () => supabase.auth.signOut(),
  getSession: () => supabase.auth.getSession(),
  onAuthStateChange: (cb) => supabase.auth.onAuthStateChange(cb),
}

// ── Challenges ────────────────────────────────────────────────────────────────
export const Challenges = {
  list: async (filters = {}) => {
    let q = supabase.from('challenges').select('*')
    if (filters.category) q = q.eq('category', filters.category)
    if (filters.difficulty) q = q.eq('difficulty', filters.difficulty)
    const { data, error } = await q.order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  get: async (id) => {
    const { data, error } = await supabase.from('challenges').select('*').eq('id', id).single()
    if (error) throw error
    return data
  },
  seed: async (challenges) => {
    const { error } = await supabase.from('challenges').upsert(challenges)
    if (error) throw error
  }
}

// ── User Challenge Progress ───────────────────────────────────────────────────
export const UserChallenges = {
  list: async (userId) => {
    const { data, error } = await supabase
      .from('user_challenges')
      .select('*, challenges(*)')
      .eq('user_id', userId)
    if (error) throw error
    return data || []
  },
  upsert: async (userId, challengeId, updates) => {
    const payload = {
      user_id: userId,
      challenge_id: challengeId,
      ...updates,
      updated_at: new Date().toISOString()
    }
    if (updates.status === 'completed' && !updates.completed_at) {
      payload.completed_at = new Date().toISOString()
    }
    const { data, error } = await supabase.from('user_challenges').upsert(payload).select().single()
    if (error) throw error
    return data
  }
}

// ── Projects (Portfolio) ──────────────────────────────────────────────────────
export const Projects = {
  list: async (userId) => {
    const { data, error } = await supabase
      .from('projects').select('*').eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  },
  create: async (project) => {
    const { data, error } = await supabase.from('projects').insert(project).select().single()
    if (error) throw error
    return data
  },
  update: async (id, updates) => {
    const { data, error } = await supabase
      .from('projects').update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id).select().single()
    if (error) throw error
    return data
  },
  delete: async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (error) throw error
  }
}

// ── Tracks ────────────────────────────────────────────────────────────────────
export const Tracks = {
  list: async () => {
    const { data, error } = await supabase.from('tracks').select('*').order('order_index')
    if (error) throw error
    return data || []
  }
}

// ── User Track Progress ───────────────────────────────────────────────────────
export const UserTracks = {
  get: async (userId, trackId) => {
    const { data, error } = await supabase
      .from('user_tracks').select('*').eq('user_id', userId).eq('track_id', trackId).single()
    if (error && error.code !== 'PGRST116') throw error
    return data || { current_lesson_index: 0, completed: false }
  },
  update: async (userId, trackId, updates) => {
    const { data, error } = await supabase
      .from('user_tracks')
      .upsert({ user_id: userId, track_id: trackId, ...updates, updated_at: new Date().toISOString() })
      .select().single()
    if (error) throw error
    return data
  }
}
