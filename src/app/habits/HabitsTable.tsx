import { useState, useEffect } from 'react'
import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import { getDatesFromEndpoints } from '@/utils'

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
      header: () => <span>Habit</span>,
    }),
    ...dates.map((date, i) =>
      columnHelper.accessor(
        (row) => {
          const record = row.records.find((x) => x.date === date)
          return record ? record : { date, completed: false }
        },
        {
          id: date,
          header: () => <span>{date}</span>,
          cell: (info) => {
            const record = info.getValue()
            return (
              <input
                type="checkbox"
                checked={record.completed}
                onChange={(e) => {
                  // TODO: Make API call to update entry here
                }}
              />
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
