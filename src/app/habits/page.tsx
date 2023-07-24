'use client'

import { useEffect, useState } from 'react'
import HabitsTable from './HabitsTable'
import AddHabitBtn from './AddHabitBtn'

import { getActiveHabits, getHabitRecords } from '@/api'
import { getFormattedDateString } from '@/utils'
import type { Habit } from '@/types'

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitsRecords, setHabitsRecords] = useState<HabitRecords[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [triggerRefetch, setTriggerRefetch] = useState<boolean>(false)

  useEffect(() => {
    const init = async () => {
      // Initialize habits, startDate, endDate and default daterange to 10 days
      let end = new Date()
      let endString = getFormattedDateString(end)
      let start = new Date()
      start.setDate(start.getDate() - 10)
      let startString = getFormattedDateString(start)

      // Fetch the habit records
      let activeHabits = await getActiveHabits()
      setHabits(activeHabits)
      const records = await getHabitRecords(
        startString,
        endString,
        activeHabits,
      )
      setStartDate(startString)
      setEndDate(endString)
      setHabitsRecords(records)
      setLoading(false)
    }
    init()
  }, [triggerRefetch])

  const handleAddHabit = (newHabit) => {
    setHabits((prevHabits) => [...prevHabits, newHabit])
  }

  if (loading) {
    return <p>Loading</p>
  }
  return (
    <>
      <div className="px-2">
        <HabitsTable
          habitsRecords={habitsRecords}
          startDate={startDate}
          endDate={endDate}
          setTriggerRefetch={setTriggerRefetch}
        />
        <AddHabitBtn
          onAddHabit={handleAddHabit}
          setTriggerRefetch={setTriggerRefetch}
        />
      </div>
    </>
  )
}
