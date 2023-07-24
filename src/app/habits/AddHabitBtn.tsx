import { useState } from 'react'
import { createHabit } from '@/api'

type AddHabitBtnProps = {
  onAddHabit: (habitName: string) => void
  setTriggerRefetch: (trigger: boolean) => void
}

export default function AddHabitBtn({
  onAddHabit,
  setTriggerRefetch,
}: AddHabitBtnProps) {
  const [habitName, setHabitName] = useState<string>('')
  const handleInputChange = (e) => {
    setHabitName(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newHabit = await createHabit(habitName)
    onAddHabit(newHabit)
    setTriggerRefetch((prev) => !prev)
    setHabitName('')
  }
  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <input
        type="text"
        value={habitName}
        onChange={handleInputChange}
        className="px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-gray-800"
        placeholder="Add habit"
      />
    </form>
  )
}
