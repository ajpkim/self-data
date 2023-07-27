'use client'

import { useState, useEffect } from 'react'
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import classNames from 'classnames'
import {
  getDatesFromEndpoints,
  getAbbreviatedDayOfWeek,
  getTodayDate,
  formatMinutes,
} from '@/utils'
import { getTimeRecords, createOrDeleteTimeRecord } from '@/api'
import type { Project, TimeRecord, TimeRecords } from '@/types'
import TimeRecordForm from './TimeRecordForm'

// Does this belong in a client component???
export const revalidate = 0

type ProjectsTableProps = {
  projectsRecords: TimeRecords[]
  startDate: string
  endDate: string
  setTriggerRefetch: (trigger: boolean) => void
  setProjectsRecords: (projectsRecords: TimeRecords[]) => void
}

export default function ProjectsTimeTable({
  projectsRecords,
  startDate,
  endDate,
  setTriggerRefetch,
  setProjectsRecords,
}: ProjectsTableProps) {
  let dates = getDatesFromEndpoints(startDate, endDate)
  const columnHelper = createColumnHelper<Project>()

  const columns = [
    columnHelper.accessor((row) => row.project.name, {
      id: 'nameCol',
      header: () => <span></span>,
    }),
    columnHelper.accessor('target', {
      header: () => <span>Target</span>,
      cell: (info) => formatMinutes(info.getValue()),
    }),
    columnHelper.accessor('progress', {
      header: () => <span>Progress</span>,
      cell: (info) => formatMinutes(info.getValue()),
    }),
    columnHelper.accessor((row) => row, {
      id: 'logCol',
      header: () => <span>Log</span>,
      cell: (info) => {
        const row = info.getValue()
        let today = new Date()
        today = today.toISOString().split('T')[0]
        return (
          <TimeRecordForm
            project={row.project}
            date={today}
            setTriggerRefetch={setTriggerRefetch}
          />
        )
      },
    }),
  ]

  const table = useReactTable({
    data: projectsRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <div>
      <table className="table-auto w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((column, index) => (
                <th
                  className="w-1/2 md:w-auto py-2 text-left font-medium px-2"
                  key={column.id}
                >
                  {flexRender(
                    column.column.columnDef.header,
                    column.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr className="hover:bg-gray-900" key={row.id}>
              {row.getVisibleCells().map((cell, index) => (
                <td
                  className="w-1/2 md:w-auto py-2 text-left font-medium px-2"
                  key={cell.id}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
