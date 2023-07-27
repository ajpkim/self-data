'use client'
import { useEffect, useState } from 'react'
import { upsertTimeGoal, getTimeGoal } from '@/api'
import type { Project } from '@/types'

type TimeGoalFormProps = {
  project: Project
  currGoal: number
  startDate: string
  endDate: string
  setTriggerRefetch: (boolean) => void
}

export default function TimeGoalForm({
  project,
  startDate,
  endDate,
}: TimeGoalFormProps) {
  const [minutes, setMinutes] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [goal, setGoal] = useState<number>()

  useEffect(() => {
    const initGoal = async () => {
      const currGoal = await getTimeGoal(project, startDate, endDate)
      setGoal(currGoal)
      setLoading(false)
    }
    initGoal()
  }, [])

  const handleInputChange = (e) => {
    setMinutes(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newTimeGoal = await upsertTimeGoal(
      project.id,
      startDate,
      endDate,
      minutes,
    )
    setGoal(minutes)
    setMinutes('')
    // setTriggerRefetch((prev) => !prev)
  }

  if (loading) return <p>Loading</p>

  return (
    <form onSubmit={handleSubmit} className="appearance-none">
      <input
        type="text"
        value={minutes}
        onChange={handleInputChange}
        className="py-1 px-2 border-2 border-gray-900 rounded-md bg-gray-700 text-md w-16 focus:border-gray-800 "
        placeholder={goal}
      />
    </form>
  )
}
