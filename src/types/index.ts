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
