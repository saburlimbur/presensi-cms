import { useQuery } from '@tanstack/react-query'
import { usersService } from '../api/users.service'
import type { User } from '../data/schema'

export function useGetProfile() {
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      return await usersService.getProfile()
    },
  })

  return { profile: data as User | null, isLoading }
}
