type Habit = {
  id: string
  name: string
  active: boolean
}

type HabitRecord = {
  habit: Habit
  date: string
  completed: boolean
}

type HabitRecords = {
  habit: Habit
  records: HabitRecord[]
}

type Project = {
  id: string
  name: string
  created_at: string
}

type ProjectRecord = {
  project: Project
  date: string
  minutes: number
}

type ProjectRecords = {
  project: Project
  records: ProjectRecord[]
}
