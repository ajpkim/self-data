'use client'
import { useState } from 'react'
import HabitsTable from './HabitsTable'

import { getX } from '@/api'

// export const revalidate = 0

export default function Habits() {
  return (
    <>
      <h1>Hi</h1>
      <HabitsTable
        startDate="2023-01-01"
        endDate="2023-01-10"
        habits={['a', 'b']}
      />
    </>
  )
}
