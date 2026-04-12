import ApiService from '@/lib/axios'

export const departmentsService = {
  getAll: async (params?: Record<string, any>) => {
    const response = await ApiService.get('/departments', {
      params,
    })
    return response.data.data
  },
}
