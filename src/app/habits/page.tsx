'use client'

import { useState } from 'react'
import HabitsTable from './HabitsTable'

import { getX } from '@/api'

export default function Habits() {
  return (
    <>
      <h1>Hi</h1>
      <HabitsTable
        startDate="2023-01-01"
        endDate="2023-01-05"
        habits={['a', 'b']}
      />
    </>
  )
}

// export const revalidate = 0

// export default async function Habits() {
//   const data = await getX('habits')
//   return (
//     <>
//       <p>HABITS YO</p>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </>
//   )
// }

// Create the react-table column defs based on column names

/*
TODO: Implement the custom react-table with checkboxes in each and
an API on click handler

Params for request should look like: (dateRange).

Then fetched data should look like:
[
{habit: sleep, data: [{date: 2023-01-01, completed: true}, {date: 2023-01-02, completed: true},
{habit: exercise, data: [{date: 2023-01-01, completed: true}, {date: 2023-01-02, completed: true},
]

OR, it could be like:
[
 {
 habit: sleep,
 dates: [{2023-01-01: true}, {2023-01-02: true}]
 },
 {
 habit: exercise,
 dates: [{2023-01-01: true}, {2023-01-02: true}]
 },


 */

// const HabitGrid = () => {
//   const data = [
//     {
//       habit: 'sleep',
//       data: [
//         { date: '2023-01-01', completed: true },
//         { date: '2023-01-02', completed: false },
//       ],
//     },
//     {
//       habit: 'exercise',
//       data: [
//         { date: '2023-01-01', completed: false },
//         { date: '2023-01-02', completed: true },
//       ],
//     },
//   ]

//   const [habits, setHabits] = useState(data)

//   // Find all unique dates across all habits
//   let dates = new Set()
//   habits.forEach((habit) => habit.data.forEach((h) => dates.add(h.date)))
//   dates = Array.from(dates).sort()

//   // Event handler to update the completed field for a habit on a particular date
//   const updateHabit = (date, habitName) => {
//     const newHabits = habits.map((habit) => {
//       if (habit.habit === habitName) {
//         habit.data = habit.data.map((h) =>
//           h.date === date ? { ...h, completed: !h.completed } : h,
//         )
//       }
//       return habit
//     })
//     setHabits(newHabits)
//   }

//   return (
//     <table style={{ width: '100%', textAlign: 'left' }}>
//       <thead>
//         <tr>
//           <th>Habit</th>
//           {dates.map((date) => (
//             <th key={date}>{date}</th>
//           ))}
//         </tr>
//       </thead>
//       <tbody>
//         {habits.map((habit) => (
//           <tr key={habit.habit}>
//             <td>{habit.habit}</td>
//             {dates.map((date) => {
//               const habitData = habit.data.find((h) => h.date === date)
//               return (
//                 <td key={date}>
//                   {habitData && (
//                     <input
//                       type="checkbox"
//                       checked={habitData.completed}
//                       onChange={() => updateHabit(date, habit.habit)}
//                     />
//                   )}
//                 </td>
//               )
//             })}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )
// }

// export default HabitGrid
