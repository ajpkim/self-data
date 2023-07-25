import { createClient } from '@supabase/supabase-js'
import type { Habit, HabitRecord, HabitRecords } from '@/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

/*
 * GET all the rows in some table 'x'
 */
export async function getX(x: string) {
  let { data, error } = await supabase.from(x).select('*')
  if (error) {
    throw new Error(error.message)
  }
  return data === null ? [] : data
}

export async function getActiveHabits() {
  let { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('active', true)
  if (error) {
    throw new Error(error.message)
  }
  return data
}
/*
 * Fetch the habit records for the HabitTable component given date
 * range and array of habits.
 */
export async function getHabitRecords(
  startDate: string,
  endDate: string,
  habits: Habit[],
) {
  let habitIds = habits.map((h) => h.id)
  let { data: records, error } = await supabase
    .from('habit_records')
    .select('*')
    .in('habit_id', habitIds)
    .gte('date', startDate)
    .lte('date', endDate)
  if (error) {
    throw new Error(error.message)
  }
  let habitsMap = habits.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.id]: {
        habit: curr,
        records: [],
      },
    }),
    {},
  )
  for (const record of records) {
    habitsMap[record.habit_id]['records'].push(record)
  }
  return Object.values(habitsMap)
}

export async function deleteHabit(habitId: string) {
  const { error } = await supabase.from('habits').delete().eq('id', habitId)
}

export async function createHabit(name: string) {
  const { data, error } = await supabase
    .from('habits')
    .insert([{ name }])
    .select('*')
  if (error) {
    throw new Error(error.message)
  }
  return data[0]
}

export async function createOrDeleteHabitRecord(
  habitId: string,
  date: string,
  completed: boolean,
) {
  if (completed) {
    // Insert
    const { data, error } = await supabase
      .from('habit_records')
      .insert([{ habit_id: habitId, date: date, completed: true }])
      .select()
    if (error) {
      throw new Error(error.message)
    }
    return data
  } else {
    // Delete
    const { data, error } = await supabase
      .from('habit_records')
      .delete()
      .eq('habit_id', habitId)
      .eq('date', date)
      .eq('completed', true)
      .select()
    if (error) {
      throw new Error(error.message)
    }
    return data
  }
}

export async function toggleHabitActiveStatus(habitId, active) {
  const { data, error } = await supabase
    .from('habits')
    .update({ active: active })
    .eq('id', habitId)
  if (error) {
    throw new Error(error.message)
  }
  return data
}

// .lt('column', 'Less than')
// .gte('column', 'Greater than or equal to')
// .lte('column', 'Less than or equal to')
// .like('column', '%CaseSensitive%')
// .ilike('column', '%CaseInsensitive%')
// .is('column', null)
// .in('column', ['Array', 'Values'])
// .neq('column', 'Not equal to')

// // Arrays
// .cs('array_column', ['array', 'contains'])
// .cd('array_column', ['contained', 'by'])
