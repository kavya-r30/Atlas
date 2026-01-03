import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function getSupabaseBrowserClient() {
  if (client) {
    return client
  }

  client = createBrowserClient("https://tqwptkcpcefltuazvrpc.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRxd3B0a2NwY2VmbHR1YXp2cnBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NzQzMzI2MiwiZXhwIjoyMDgzMDA5MjYyfQ.fcilTzgTGgz9Q7xuuXkV1T8N5jXrHRhTBw_EfGgTinQ")

  return client
}
