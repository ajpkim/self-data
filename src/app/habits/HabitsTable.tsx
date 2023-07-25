'use client'

import { useState, useEffect } from 'react'
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import classNames from 'classnames'
import { getDatesFromEndpoints, getAbbreviatedDayOfWeek } from '@/utils'
import { getHabitRecords, createOrDeleteHabitRecord } from '@/api'
import type { Habit, HabitRecord, HabitRecords } from '@/types'

// Does this belong in a client component???
export const revalidate = 0

type HabitsTableProps = {
  habitsRecords: HabitRecords[]
  startDate: string
  endDate: string
  setTriggerRefetch: (trigger: boolean) => void
  setHabitsRecords: (habitsRecords: HabitRecords[]) => void
}

export default function HabitsTable({
  habitsRecords,
  startDate,
  endDate,
  setTriggerRefetch,
  setHabitsRecords,
}: HabitsTableProps) {
  let dates = getDatesFromEndpoints(startDate, endDate).reverse()
  const columnHelper = createColumnHelper<Habit>()

  // Dynamically create columns based on the given data range
  const columns = [
    columnHelper.accessor((row) => row.habit.name, {
      id: 1,
      header: () => <span></span>,
    }),
    ...dates.map((date, i) =>
      columnHelper.accessor(
        (row) => {
          const record = row.records.find((x) => x.date === date)
          return record
            ? record
            : { habit_id: row.habit.id, date, completed: false }
        },
        {
          id: date,
          header: () => (
            <div className="relative group inline-block">
              <span className="font-mono">{getAbbreviatedDayOfWeek(date)}</span>
              <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-full mt-1 opacity-0 group-hover:opacity-100 transition duration-200 px-3 py-2 rounded text-xs">
                {date}
              </div>
            </div>
          ),
          cell: (info) => {
            const record = info.getValue()
            return (
              <button
                onClick={async (e) => {
                  const { habit_id: habitId, date, completed } = record
                  const newOrDeletedRecord = await createOrDeleteHabitRecord(
                    habitId,
                    date,
                    !completed,
                  )
                  setTriggerRefetch((prev) => !prev)

                  // TODO: Figure out how to update state locally and not have to refetch data...
                  // For some reason this code works to update state only when toggling to NOT active

                  // const newHabitsRecords = habitsRecords.map((x) => {
                  //   if (x.habit.id !== habitId) {
                  //     return { ...x }
                  //   } else {
                  //     let newRecords = x.records.filter(
                  //       (record) => record.date !== date,
                  //     )
                  //     if (!completed) {
                  //       // We created a new record in this case
                  //       newRecords.push(newOrDeletedRecord)
                  //     }
                  //     return {
                  //       habit: { ...x.habit },
                  //       records: newRecords,
                  //     }
                  //   }
                  // }
                  // )
                  // setHabitsRecords(newHabitsRecords)
                }}
                className={classNames(
                  'h-full w-full cursor-pointer flex items-center justify-center',
                  {
                    'bg-rose-500': !record.completed,
                    'bg-emerald-500': record.completed,
                  },
                )}
                style={{ minHeight: '1rem', minWidth: '1rem' }}
              ></button>
            )
          },
        },
      ),
    ),
  ]
  const table = useReactTable({
    data: habitsRecords,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <div className="pt-10">
      <table className="table-auto w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex w-full">
              {headerGroup.headers.map((column, index) => (
                <th
                  className={index === 0 ? 'w-24' : 'flex-grow'}
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
            <tr
              className="flex w-full my-1 hover:bg-zinc-700 hover:font-bold"
              key={row.id}
            >
              {row.getVisibleCells().map((cell, index) => (
                <td
                  className={index === 0 ? 'w-24' : 'flex-grow px-1.5'}
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
