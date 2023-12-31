/*
 Return array of dates as strings given string start date and end date.
 */
export function getDatesFromEndpoints(startDate: string, endDate: string) {
  let dates = []
  let a = new Date(startDate)
  let b = new Date(endDate)

  while (a <= b) {
    dates.push(a.toISOString().split('T')[0])
    a.setDate(a.getDate() + 1)
  }
  return dates
}

export function getAbbreviatedDayOfWeek(dateString: string): string {
  const date = new Date(dateString)
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return weekdays[date.getDay()]
}

/*
 * Translate the Date object to a string in yyyy-mm-dd formate
 */
export function getFormattedDateString(date: Date): string {
  let year = date.getFullYear()
  let month = (date.getMonth() + 1).toString().padStart(2, '0')
  let day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

/*
 * Default format Dates to "Month, Day, Year"
 */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  },
): string {
  return date.toLocaleDateString(undefined, options)
}

export function formatISODateString(s: string): string {
  const date = new Date(s)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('en-US', options).format(date)
}

export function getCurrentWeekStartAndEndDates(
  format: boolean = false,
): [Date, Date] | [string, string] {
  const now = new Date()
  const start = new Date(now)
  const end = new Date(now)

  const currentDay = now.getDay()
  const diffToStart = currentDay === 0 ? 6 : currentDay - 1
  const diffToEnd = currentDay === 0 ? 0 : 7 - currentDay

  start.setDate(now.getDate() - diffToStart)
  start.setHours(0, 0, 0, 0)

  end.setDate(now.getDate() + diffToEnd)
  end.setHours(23, 59, 59, 999)

  return format ? [formatDate(start), formatDate(end)] : [start, end]
}

export function getTodayDateFormatted(
  options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  },
) {
  return formatDate(new Date(), options)
}

export function getCurrentISOWeekNumber() {
  const now = new Date()
  const target = new Date(now.valueOf())
  const dayNumber = (now.getDay() + 6) % 7
  target.setDate(target.getDate() - dayNumber + 3)
  const startOfYear = new Date(target.getFullYear(), 0, 1)
  const difference = target.getTime() - startOfYear.getTime()
  const weekNumber = Math.ceil(difference / (7 * 24 * 60 * 60 * 1000))
  return weekNumber
}

export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainder = (minutes % 60).toString().padStart(2, '0')
  return `${hours}:${remainder}`
}
