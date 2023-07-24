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

/*
 * Translate the Date object to a string in yyyy-mm-dd formate
 */
export function getFormattedDateString(date: Date): string {
  let year = date.getFullYear()
  let month = (date.getMonth() + 1).toString().padStart(2, '0')
  let day = date.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
