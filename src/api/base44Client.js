import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Legacy base44 client — preserved for existing consumers (auth, entities, integrations)
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

// Migration shim: Supabase entity clients re-exported for new consumers
export { Challenges, UserChallenges, Projects, Tracks, UserTracks, supabase } from './supabaseClient.js'
