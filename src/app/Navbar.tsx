import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="py-4">
      <Link className="mr-4" href="/">
        Home
      </Link>
      <Link className="mr-4" href="/habits">
        Habits
      </Link>
      <Link className="mr-4" href="/time">
        Time
      </Link>
    </nav>
  )
}
