export type Habit = {
  id: string
  name: string
  active: boolean
}

export type HabitRecord = {
  habit: Habit
  date: string
  completed: boolean
}

export type HabitRecords = {
  habit: Habit
  records: HabitRecord[]
}

export type Project = {
  id: string
  name: string
  created_at: string
}

export type TimeRecord = {
  project: Project
  date: string
  minutes: number
}

export type TimeRecords = {
  project: Project
  records: ProjectRecord[]
}
