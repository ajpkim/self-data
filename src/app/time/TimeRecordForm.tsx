import { useState } from 'react'
import { addTimeRecord } from '@/api'
import type { Project } from '@/types'

type TimeRecordFormProps = {
  project: Project
  date: string
  setTriggerRefetch: (boolean) => void
}

export default function TimeRecordForm({
  project,
  date,
  setTriggerRefetch,
}: TimeRecordFormProps) {
  const [minutes, setMinutes] = useState<string>('')

  const handleInputChange = (e) => {
    setMinutes(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newTimeRecord = await addTimeRecord(project.id, date, minutes)

    setMinutes('')
    setTriggerRefetch((prev) => !prev)
  }
  return (
    <form onSubmit={handleSubmit} className="appearance-none">
      <input
        type="text"
        value={minutes}
        onChange={handleInputChange}
        className="py-1 px-2 border-2 border-gray-900 rounded-md bg-gray-700 text-md w-12 focus:border-gray-800 "
        placeholder=""
      />
    </form>
  )
}
