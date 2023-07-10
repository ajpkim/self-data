import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)

// Get ALL the rows in some table "x"
export async function getX(x: string) {
  let { data, error } = await supabase.from(x).select('*')
  if (error) {
    throw new Error(error.message)
  }
  return data === null ? [] : data
}

export async function createHabit(name: string) {
  const { data, error } = await supabase
    .from('habits')
    .insert([{ name: name }])
    .select()

  return data
}
