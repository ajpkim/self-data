'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getX } from '@/api'
import { getFormattedDateString, getCurrentWeekStartAndEndDates } from '@/utils'
import AddProjectForm from './AddProjectForm'
import ProjectConfigTable from './ProjectConfigTable'

import type { Project } from '@/types'

export default function TimeConfig() {
  const [projects, setProjects] = useState<Project[]>([])
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const initProjects = async () => {
      let [start, end] = getCurrentWeekStartAndEndDates()
      let endString = getFormattedDateString(end)
      let startString = getFormattedDateString(start)
      let allProjects = await getX('projects')
      allProjects.sort((a, b) => a.active < b.active)
      setProjects(allProjects)
      setStartDate(startString)
      setEndDate(endString)
      setLoading(false)
    }
    initProjects()
  }, [])

  if (loading) return <p>Loading</p>

  return (
    <>
      <div className="text-right pr-5 text-md italic">
        <Link href="/time">Time</Link>
      </div>
      <div className="text-right pr-5 text-md italic">
        <Link href="/time/records">Records</Link>
      </div>
      <div className="px-2 mt-5">
        <ProjectConfigTable
          projects={projects}
          setProjects={setProjects}
          startDate={startDate}
          endDate={endDate}
        />
        <AddProjectForm setProjects={setProjects} />
      </div>
    </>
  )
}
