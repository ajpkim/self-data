'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getX } from '@/api'
import type { Habit } from '@/types'
import HabitsConfigTable from './HabitsConfigTable'
import AddHabitForm from './AddHabitForm'

export default function HabitsConfig() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const initHabits = async () => {
      let allHabits = await getX('habits')
      allHabits.sort((a, b) => b.active - a.active)
      setHabits(allHabits)
      setLoading(false)
    }
    initHabits()
  }, [])

  if (loading) return <p>Loading</p>

  return (
    <>
      <div className="mx-2">
        <div className="text-right pr-5 text-md italic">
          <Link href="/habits">Habits</Link>
        </div>
        <div className="my-5">
          <HabitsConfigTable habits={habits} setHabits={setHabits} />
          <AddHabitForm setHabits={setHabits} />
        </div>
      </div>
    </>
  )
}
