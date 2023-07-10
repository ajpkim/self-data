import { getX } from '@/api'

export const revalidate = 0

export default async function Habits() {
  const data = await getX('habits')
  return (
    <>
      <p>HABITS YO</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}
