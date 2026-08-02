import { readdirSync, readFileSync } from 'node:fs'

const workflow = readFileSync('.github/workflows/deploy-supabase.yml', 'utf8')
const dirs = readdirSync('supabase/functions', { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
  .map((d) => d.name)

const missing = dirs.filter((name) => !workflow.includes(`supabase functions deploy ${name} `))

if (missing.length) {
  console.error(`[check-functions] not in the deploy workflow: ${missing.join(', ')}`)
  console.error('[check-functions] a function that is never deployed fails closed at runtime')
  process.exit(1)
}
console.log(`[check-functions] ok, ${dirs.length} functions all present in the deploy workflow`)
