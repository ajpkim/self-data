import { useState } from 'react'
import { createHabit } from '@/api'

type AddHabitBtnProps = {
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
}

export default function AddHabitBtn({ setHabits }: AddHabitBtnProps) {
  const [habitName, setHabitName] = useState<string>('')
  const handleInputChange = (e) => {
    setHabitName(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newHabit = await createHabit(habitName)
    setHabits((prev) => [...prev, newHabit].sort((a, b) => b.active - a.active))
    setHabitName('')
  }
  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <input
        type="text"
        value={habitName}
        onChange={handleInputChange}
        className="py-1 px-2 border-2 border-gray-900 rounded-md bg-gray-900 text-md focus:outline-none focus:border-gray-800"
        placeholder="Add habit"
      />
    </form>
  )
}
