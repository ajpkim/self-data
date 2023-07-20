import { useState, useEffect } from 'react'
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import { getDatesFromEndpoints } from '@/utils'

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
  const { data, setData } = useState()

  let dates = getDatesFromEndpoints(startDate, endDate)
  const columnHelper = createColumnHelper<Habit>()
  const columns = [
    columnHelper.accessor('habit', {
      header: () => <span>Habit</span>,
    }),
    ...dates.map((date, i) =>
      columnHelper.accessor(
        (row) => {
          const record = row.records.find((x) => x.date === date)
          return record ? record.completed : false
        },
        {
          id: date,
          header: () => <span>{date}</span>,
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
      <table className="table-auto">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th key={column.id}>
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
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
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

// cell: (info) => (
//   <input
//     type="checkbox"
//     checked={info.getValue() || false}
//     onChange={() => handleCheckboxChange(info.row.id, info.column.id)}
//   />
// )
// ,

// TODO: Implement this
// useEffect(() => {
//   // const habitData = useHabitData(startDate, endDate, habits)
//   setData(habitData)
// }, [])

// const handleCheckboxChange = (rowId: string, columnId: string) => {
//   const newHabits = data.map((habit) => {
//     if (habit.habit === rowId) {
//       habit.data = habit.data.map((h) =>
//         h.date === columnId ? { ...h, completed: !h.completed } : h,
//       )
//     }
//     return habit
//   })
//   setData(newHabits)
// }
