'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllTimeRecords } from '@/api'
import TimeRecordsTable from './TimeRecordsTable'

export default function Records() {
  const [records, setRecords] = useState<TimeRecord[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const initRecords = async () => {
      const allRecords = await getAllTimeRecords()
      setRecords(allRecords)
      setLoading(false)
    }

    initRecords()
  }, [])

  if (loading) {
    return <p>Loading</p>
  }

  return (
    <>
      <div className="text-right pr-5 text-md italic">
        <Link href="/time">Time</Link>
      </div>
      <div className="text-right pr-5 text-md italic">
        <Link href="/time/config">Settings</Link>
      </div>
      <TimeRecordsTable records={records} setRecords={setRecords} />
    </>
  )
}
