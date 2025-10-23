import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"

// Singleton pattern to prevent multiple client instances
let client: ReturnType<typeof createSupabaseBrowserClient> | null = null

export function createBrowserClient() {
  if (client) return client

  client = createSupabaseBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  return client
}

// Legacy export for backward compatibility
export function createClient() {
  return createBrowserClient()
}
