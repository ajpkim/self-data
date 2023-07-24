'use client'

import { useEffect, useState } from 'react'
import HabitsTable from './HabitsTable'

import { getX } from '@/api'
import { getFormattedDateString } from '@/utils'
import type { Habit } from '@/types'

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  useEffect(() => {
    // Initialize habits, startDate, endDate
    const init = async () => {
      let allHabits = await getX('habits')
      setHabits(allHabits)
      // Initialize start and end date to be today - 14 days
      let end = new Date()
      let endString = getFormattedDateString(end)
      let start = new Date()
      start.setDate(start.getDate() - 10)
      let startString = getFormattedDateString(start)
      setStartDate(startString)
      setEndDate(endString)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) {
    return <p>Loading</p>
  }
  return (
    <>
      <HabitsTable startDate={startDate} endDate={endDate} habits={habits} />
    </>
  )
}
