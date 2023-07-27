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

export async function deleteById(table: string, rowId: string) {
  const { error } = await supabase.from(table).delete().eq('id', rowId)
}

export async function getActiveItems(table) {
  let { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('active', true)
  if (error) {
    throw new Error(error.message)
  }
  return data
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

export async function toggleHabitActiveStatus(
  habitId: string,
  active: boolean,
) {
  const { data, error } = await supabase
    .from('habits')
    .update({ active: active })
    .eq('id', habitId)
  if (error) {
    throw new Error(error.message)
  }
  return data
}

////////////////////////////////////////////////////////////////////////////////
export async function createProject(name: string) {
  const { data, error } = await supabase
    .from('projects')
    .insert([{ name }])
    .select('*')
  if (error) {
    throw new Error(error.message)
  }
  return data[0]
}

export async function toggleProjectActiveStatus(
  projectId: string,
  active: boolean,
) {
  const { data, error } = await supabase
    .from('projects')
    .update({ active: active })
    .eq('id', projectId)
  if (error) {
    throw new Error(error.message)
  }
  return data
}

export async function getTimeRecords(
  startDate: string,
  endDate: string,
  projects: Project[],
) {
  let projectIds = projects.map((h) => h.id)
  let { data: records, records_error } = await supabase
    .from('time_records')
    .select('*')
    .in('project_id', projectIds)
    .gte('date', startDate)
    .lte('date', endDate)
  if (records_error) {
    throw new Error(records_error.message)
  }
  // Organize the records by project

  let { data: goals, goals_error } = await supabase
    .from('time_goals')
    .select('*')
    .in('project_id', projectIds)
    .gte('start_date', startDate)
    .lte('end_date', endDate)

  if (goals_error) {
    throw new Error(goals_error.message)
  }

  let projectsMap = projects.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.id]: {
        project: curr,
        target: 0,
        progress: 0,
        records: [],
      },
    }),
    {},
  )

  for (const goal of goals) {
    projectsMap[goal.project_id]['target'] = goal.minutes
  }

  // Switched to having only a single goal for each start/end pair
  // const target = goals.reduce((acc, curr) => acc + curr.minutes, 0)

  for (const record of records) {
    projectsMap[record.project_id]['records'].push(record)
    projectsMap[record.project_id]['progress'] += record.minutes
  }

  let data = Object.values(projectsMap)
  data.sort((a, b) => a.project.name > b.project.name)
  return data
}

export async function addTimeRecord(
  projectId: string,
  date: string,
  minutes: number,
) {
  const { data, error } = await supabase
    .from('time_records')
    .insert([{ project_id: projectId, date: date, minutes }])
    .select()
}

export async function upsertTimeGoal(
  projectId: string,
  startDate: string,
  endDate: string,
  minutes: number,
) {
  const { data: updated, update_error } = await supabase
    .from('time_goals')
    .update({
      project_id: projectId,
      start_date: startDate,
      end_date: endDate,
      minutes: minutes,
    })
    .eq('project_id', projectId)
    .eq('start_date', startDate)
    .eq('end_date', endDate)
    .select()

  if (update_error) {
    throw new Error(update_error.message)
  }

  if (updated.length === 0) {
    const { data: updated, create_error } = await supabase
      .from('time_goals')
      .insert([
        {
          project_id: projectId,
          start_date: startDate,
          end_date: endDate,
          minutes: minutes,
        },
      ])
    if (create_error) {
      throw new Error(create_error.message)
    }
  }
}

/*
 * Limited to specific start-end date time goals currently
 */
export async function getTimeGoal(
  project: Project,
  startDate: string,
  endDate: string,
) {
  const { data, error } = await supabase
    .from('time_goals')
    .select('minutes')
    .eq('project_id', project.id)
    .eq('start_date', startDate)
    .eq('end_date', endDate)

  if (error) {
    throw new Error(error.message)
  }
  // const target = data.reduce((acc, curr) => acc + curr.minutes, 0)
  let target = data.length > 0 ? data[0].minutes : 0
  return target
}

/*
 * Return data for the Time Records page
 */
export async function getAllTimeRecords(): [
  { project: Project; date: string; minutes: number },
] {
  const { data: records, records_error } = await supabase
    .from('time_records')
    .select('*')
  if (records_error) {
    throw new Error(records_error.message)
  }

  const projects = await getX('projects')
  let projectsMap = {}
  for (const project of projects) {
    projectsMap[project.id] = project
  }

  const ret = []
  for (const record of records) {
    ret.push({
      ...record,
      project: projectsMap[record.project_id],
    })
  }
  return ret
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
