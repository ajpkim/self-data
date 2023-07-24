import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

import type { Habit, HabitRecord, HabitRecords } from '@/types'

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

// export async function getHabitNamesFromIds(habitIds: string[]) {
//   let { data, error } = await supabase
//     .from('habits')
//     .select('name')
//     .in('id', habitIds)
//   if (error) {
//     throw new Error(error.message)
//   }
//   return data
// }

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
  } else {
    // Delete
    const { error } = await supabase
      .from('habit_records')
      .delete()
      .eq('habit_id', habitId)
      .eq('date', date)
      .eq('completed', true)
  }
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
