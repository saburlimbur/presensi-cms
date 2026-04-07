import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  usersService,
  type UserCreatePayload,
  type UserUpdatePayload,
} from './users.service'

export const usersKeys = {
  all: ['users'] as const,
  lists: () => [...usersKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) =>
    [...usersKeys.lists(), params] as const,
  details: () => [...usersKeys.all, 'detail'] as const,
  detail: (id: string) => [...usersKeys.details(), id] as const,
}

export function useUsers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: usersKeys.list(params ?? {}),
    queryFn: () => usersService.getAll(params),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: usersKeys.detail(id),
    queryFn: () => usersService.getById(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: UserCreatePayload) => usersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      toast.success('Employee created successfully.')
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserUpdatePayload }) =>
      usersService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      toast.success('Employee updated successfully.')
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      toast.success('Employee deleted successfully.')
    },
  })
}

export function useDeleteManyUsers() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ids: string[]) => usersService.deleteMany(ids),
    onSuccess: (_data, ids) => {
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() })
      toast.success(
        `Deleted ${ids.length} ${ids.length > 1 ? 'employees' : 'employee'} successfully.`
      )
    },
  })
}
