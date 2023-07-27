import {
  createColumnHelper,
  useReactTable,
  flexRender,
  getCoreRowModel,
} from '@tanstack/react-table'
import classNames from 'classnames'
import { deleteById, toggleProjectActiveStatus } from '@/api'
import type { Project } from '@/types'
import TimeGoalForm from './TimeGoalForm'

type ProjectsConfigTableProps = {
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  startDate: string
  endDate: string
}
export default function ProjectsConfigTable({
  projects,
  setProjects,
  startDate,
  endDate,
}: ProjectsConfigTableProps) {
  const columnHelper = createColumnHelper<Project>()
  const columns = [
    columnHelper.accessor('name', {
      header: <span>Project</span>,
    }),
    columnHelper.accessor((row) => row, {
      id: 'goalCol',
      header: 'Week Target',
      cell: (info) => {
        const row = info.getValue()
        return (
          <TimeGoalForm project={row} startDate={startDate} endDate={endDate} />
        )
      },
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
              const { id: projectId, active } = row
              const updatedProject = await toggleProjectActiveStatus(
                projectId,
                !active,
              )
              const newProjects = projects.map((project) => {
                if (project.id !== projectId) {
                  return project
                } else {
                  return { ...project, active: !active }
                }
              })
              setProjects(newProjects)
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
              const { id: projectId, name, active } = row
              await deleteById('projects', projectId)
              const newProjects = projects.filter(
                (project) => project.id !== projectId,
              )
              setProjects(newProjects)
            }}
          >
            Delete
          </button>
        )
      },
    }),
  ]

  const table = useReactTable({
    data: projects,
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
