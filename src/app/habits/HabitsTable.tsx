import { useState, useEffect } from 'react'
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import classNames from 'classnames'
import { getDatesFromEndpoints, getAbbreviatedDayOfWeek } from '@/utils'

// DEV
import habitData from './habitData.json'

type HabitRecord = {
  date: string
  completed: boolean
}

type Habit = {
  habit: string
  records: HabitEntry[]
}

type HabitsTableProps = {
  startDate: string
  endDate: string
  habits: string[]
}

export default function HabitsTable({
  startDate,
  endDate,
  habits,
}: HabitsTableProps) {
  const [data, setData] = useState([])

  // TODO: Use real hook to get real data
  useEffect(() => {
    setData(habitData)
  }, [])

  let dates = getDatesFromEndpoints(startDate, endDate)
  const columnHelper = createColumnHelper<Habit>()

  // Dynamically create columns based on the given data range
  const columns = [
    columnHelper.accessor('habit', {
      header: () => <span></span>,
    }),
    ...dates.map((date, i) =>
      columnHelper.accessor(
        (row) => {
          const record = row.records.find((x) => x.date === date)
          return record ? record : { date, completed: false }
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
                onClick={(e) => {
                  // TODO: Make API call to update entry here
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
    data: habitData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <table className="table-auto w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex w-full">
              {headerGroup.headers.map((column, index) => (
                <th
                  className={index === 0 ? 'w-12' : 'flex-grow'}
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
            <tr className="flex w-full" key={row.id}>
              {row.getVisibleCells().map((cell, index) => (
                <td
                  className={index === 0 ? 'w-12' : 'flex-grow'}
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
