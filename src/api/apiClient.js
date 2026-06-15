import { createClient } from '@api/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// Legacy api client — preserved for existing consumers (auth, entities, integrations)
export const api = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: '',
  requiresAuth: false,
  appBaseUrl
});

// Migration shim: Supabase entity clients re-exported for new consumers
export { Challenges, UserChallenges, Projects, Tracks, UserTracks, supabase } from './supabaseClient.js'
