import ApiService from '@/lib/axios'

// bentuk data dari GET /attendance/user-summary-attendances (getSummaryAdmin)
export type TodaySummary = {
  date: string
  total: number
  byStatus: {
    PRESENT: number
    LATE: number
    ABSENT: number
    SICK: number
    PERMIT: number
    ON_LEAVE: number
    HOLIDAY: number
    WORK_FROM_HOME: number
  }
  byWorkMode: {
    WFO: number
    WFA: number
  }
}

export const dashboardService = {
  // tanpa date = hari ini (default backend)
  getTodaySummary: async (date?: string): Promise<TodaySummary> => {
    const res = await ApiService.get('/attendance/user-summary-attendances', {
      params: date ? { date } : undefined,
    })
    return res.data.data as TodaySummary
  },
}
