type Habit = {
  id: string
  name: string
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
