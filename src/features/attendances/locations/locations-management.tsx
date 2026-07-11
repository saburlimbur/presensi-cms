import { Skeleton } from '@/components/ui/skeleton'
import { LocationsDialogs } from './components/locations-dialogs'
import { LocationsProvider } from './components/locations-provider'
import { LocationsTable } from './components/locations-table'
import useGetLocations from './hooks/use-get-locations'

// Panel CRUD lokasi kantor — dipakai sebagai tab di dalam halaman Locations.
// Sengaja tanpa Header/Main karena sudah dibungkus oleh index.tsx.
export function LocationsManagement() {
  const { locations, isLoading } = useGetLocations()

  return (
    <LocationsProvider>
      <div className='flex flex-1 flex-col gap-4'>
        <div>
          <h2 className='text-lg font-semibold tracking-tight'>
            Manage Locations
          </h2>
          <p className='text-sm text-muted-foreground'>
            Office locations and check-in geofences.
          </p>
        </div>

        {isLoading ? (
          <div className='space-y-2'>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='h-12 w-full rounded-md' />
            ))}
          </div>
        ) : (
          <LocationsTable data={locations} />
        )}
      </div>

      <LocationsDialogs />
    </LocationsProvider>
  )
}

export default LocationsManagement
