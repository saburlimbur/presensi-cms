import ApiService from '@/lib/axios'
import {
  type CreateLeaveBalanceFormValues,
  type LeaveBalance,
  type UpdateLeaveBalanceFormValues,
} from '../data/schema'

type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export const leaveBalancesService = {
  getAll: async (
    params?: Record<string, unknown>
  ): Promise<{ data: LeaveBalance[]; pagination?: Pagination }> => {
    const res = await ApiService.get('/leave-balances', { params })
    return res.data as { data: LeaveBalance[]; pagination?: Pagination }
  },

  getByUser: async (userId: string): Promise<LeaveBalance[]> => {
    const res = await ApiService.get(`/leave-balances/by-user/${userId}`)
    return (res.data?.data ?? []) as LeaveBalance[]
  },

  create: async (
    payload: CreateLeaveBalanceFormValues
  ): Promise<LeaveBalance> => {
    const res = await ApiService.post('/leave-balances', payload)
    return res.data.data as LeaveBalance
  },

  update: async (
    id: string,
    payload: UpdateLeaveBalanceFormValues
  ): Promise<LeaveBalance> => {
    const res = await ApiService.patch(`/leave-balances/${id}`, payload)
    return res.data.data as LeaveBalance
  },
}
