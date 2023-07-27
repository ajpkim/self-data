'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getActiveItems, getTimeRecords } from '@/api'
import { getFormattedDateString, getCurrentWeekStartAndEndDates } from '@/utils'
import type { Project, TimeRecord, TimeRecords } from '@/types'
import ProjectsTimeTable from './ProjectsTimeTable'

export default function Time() {
  const [projects, setProjects] = useState<Project[]>([])
  const [projectsRecords, setProjectsRecords] = useState<TimeRecords[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [triggerRefetch, setTriggerRefetch] = useState<boolean>(false)

  useEffect(() => {
    const init = async () => {
      // Initialize projects, startDate, endDate and default daterange to 10 days

      let [start, end] = getCurrentWeekStartAndEndDates()
      let endString = getFormattedDateString(end)
      let startString = getFormattedDateString(start)

      // Fetch the project records
      let activeProjects = await getActiveItems('projects')
      setProjects(activeProjects)
      const records = await getTimeRecords(
        startString,
        endString,
        activeProjects,
      )
      setStartDate(startString)
      setEndDate(endString)
      setProjectsRecords(records)
      setLoading(false)
    }
    init()
  }, [triggerRefetch])

  if (loading) {
    return <p>Loading</p>
  }
  return (
    <>
      <div className="text-right pr-5 text-md italic">
        <Link href="/time/config">Settings</Link>
      </div>
      <div className="text-right pr-5 text-md italic">
        <Link href="/time/records">Records</Link>
      </div>

      <div className="px-2 mt-5">
        <ProjectsTimeTable
          projectsRecords={projectsRecords}
          startDate={startDate}
          endDate={endDate}
          setTriggerRefetch={setTriggerRefetch}
        />
      </div>
    </>
  )
}
