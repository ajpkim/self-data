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
  return date.toLocaleString('en-US', { weekday: 'short' })
}
