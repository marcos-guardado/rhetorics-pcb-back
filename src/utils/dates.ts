interface DateRange {
  startDate: Date
  endDate: Date
}

export function createDateObject(month: number, year: number): DateRange {
  // months are 0-indexed in JavaScript Date (0 for January, 1 for February, etc.)
  const adjustedMonth = month - 1

  // Create a date object for the first day of the given month
  const startDate = new Date(year, adjustedMonth, 1)
  startDate.setUTCHours(0, 0, 0, 0) // Set time to 00:00:00.000
  // Create a date object for the last day of the given month
  // Get the last day of the month by setting the date to the first day of the next month
  // and then subtracting one day
  const endDate = new Date(year, adjustedMonth + 1, 0)
  endDate.setUTCHours(0, 0, 0, 0) // Set time to 00:00:00.000
  return {
    startDate: startDate,
    endDate: endDate,
  }
}