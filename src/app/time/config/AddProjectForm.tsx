'use client'
import { useState } from 'react'
import { createProject } from '@/api'

type AddProjectFormProps = {
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}

export default function AddProjectForm({ setProjects }: AddProjectBtnProps) {
  const [projectName, setProjectName] = useState<string>('')
  const handleInputChange = (e) => {
    setProjectName(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newProject = await createProject(projectName)
    setProjects((prev) => [...prev, newProject].sort((a, b) => b.name - a.name))
    setProjectName('')
  }
  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <input
        type="text"
        value={projectName}
        onChange={handleInputChange}
        className="py-1 px-2 border-2 border-gray-900 rounded-md bg-gray-900 text-md focus:outline-none focus:border-gray-800"
        placeholder="Add project"
      />
    </form>
  )
}
