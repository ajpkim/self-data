import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import classNames from 'classnames'
import { deleteHabit, toggleHabitActiveStatus } from '@/api'
import type { Habit } from '@/types'

type HabitsConfigTableProps = {
  habits: Habit[]
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>
}
export default function HabitsConfigTable({
  habits,
  setHabits,
}: HabitsConfigTableProps) {
  const columnHelper = createColumnHelper<Habit>()
  const columns = [
    columnHelper.accessor('name', {
      header: <span>Habit</span>,
    }),
    columnHelper.accessor((row) => row, {
      id: 'activeCol',
      header: <span>Active</span>,
      cell: (info) => {
        const row = info.getValue()
        return (
          <button
            className={classNames(
              'w-16 text-black rounded-lg p-1 text-sm shadow-sm',
              {
                'bg-rose-300 hover:bg-rose-500': !row.active,
                'bg-emerald-300 hover:bg-emerald-500': row.active,
              },
            )}
            onClick={async (e) => {
              const { id: habitId, active } = row
              const updatedHabit = await toggleHabitActiveStatus(
                habitId,
                !active,
              )
              const newHabits = habits.map((habit) => {
                if (habit.id !== habitId) {
                  return habit
                } else {
                  return { ...habit, active: !active }
                }
              })
              setHabits(newHabits)
            }}
          >
            {row.active.toString()}
          </button>
        )
      },
    }),
    columnHelper.accessor((row) => row, {
      id: 'deleteCol',
      header: <span className="">Delete</span>,
      cell: (info) => {
        const row = info.getValue()
        return (
          <button
            className="w-16 text-black rounded-lg bg-gray-200 p-1 text-sm shadow-sm hover:bg-gray-400"
            onClick={async (e) => {
              const { id: habitId, name, active } = row
              await deleteHabit(habitId)
              const newHabits = habits.filter((habit) => habit.id !== habitId)
              setHabits(newHabits)
            }}
          >
            Delete
          </button>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: habits,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })
  return (
    <>
      <table className="table-auto w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((column, index) => (
                <th
                  key={column.id}
                  className="w-1/2 md:w-auto py-2 text-left font-medium px-2"
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
            <tr key={row.id} className="hover:bg-gray-900">
              {row.getVisibleCells().map((cell, index) => (
                <td
                  key={cell.id}
                  className={classNames('w-1/2 md:w-auto py-2 px-2')}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
