import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'

import type { TimeRecord } from '@/types'
import { deleteById } from '@/api'

type TimeRecordTableProps = {
  records: TimeRecord[]
  setRecords: React.Dispatch<React.SetStateAction<TimeRecord[]>>
}

export default function TimeRecordsTable({ records, setRecords }) {
  const columnHelper = createColumnHelper<TimeRecord>()
  const columns = [
    columnHelper.accessor((row) => row.project.name, {
      id: 'projectCol',
      header: () => <span>Project</span>,
      // cell: (info) =>
    }),
    columnHelper.accessor('date'),
    columnHelper.accessor('minutes'),
    columnHelper.accessor((row) => row, {
      id: 'deleteCol',
      header: () => <span>Delete</span>,
      cell: (info) => {
        const { id: recordId } = info.getValue()
        return (
          <button
            onClick={async (e) => {
              deleteById('time_records', recordId)
              setRecords((prev) => prev.filter((x) => x.id !== recordId))
            }}
          >
            Delete
          </button>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <>
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
    </>
  )
}
