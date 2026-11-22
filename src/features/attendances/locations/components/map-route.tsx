'use client'

import { useEffect, useState } from 'react'
import {
  Loader2,
  Route,
  LogIn,
  LogOut,
  AlertTriangle,
  Navigation,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Map,
  MapMarker,
  MarkerContent,
  MapRoute,
  MarkerLabel,
} from '@/components/ui/map'

const satelliteStyle = {
  version: 8 as const,
  sources: {
    'esri-satellite': {
      type: 'raster' as const,
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution: 'Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster' as const,
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
}

interface RouteData {
  coordinates: [number, number][]
  duration: number
  distance: number
}

interface MapRouteDistanceProps {
  lat: number
  lng: number
  office: { name: string; latitude: number; longitude: number }
  userName?: string
  checkIn?: string | null
  checkOut?: string | null
  latOut?: number | null
  lngOut?: number | null
  workMode?: string | null
  note?: string | null
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60)
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  const remainingMins = mins % 60
  return `${hours}h ${remainingMins}m`
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function MapRouteDistance({
  lat,
  lng,
  office,
  userName,
  checkIn,
  checkOut,
  latOut,
  lngOut,
  workMode,
  note,
}: MapRouteDistanceProps) {
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const hasCheckOut = latOut != null && lngOut != null

  useEffect(() => {
    async function fetchRoutes() {
      setIsLoading(true)
      setHasError(false)
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${lng},${lat};${office.longitude},${office.latitude}?overview=full&geometries=geojson&alternatives=true&radiuses=unlimited;unlimited`
        )
        const data = await response.json()

        if (data.routes?.length > 0) {
          const routeData: RouteData[] = data.routes.map(
            (route: {
              geometry: { coordinates: [number, number][] }
              duration: number
              distance: number
            }) => {
              const osrmCoords = route.geometry.coordinates
              const seamlessCoords: [number, number][] = [
                [lng, lat],
                ...osrmCoords,
                [office.longitude, office.latitude],
              ]

              return {
                coordinates: seamlessCoords,
                duration: route.duration,
                distance: route.distance,
              }
            }
          )
          setRoutes(routeData)
          setSelectedIndex(0)
        } else {
          setHasError(true)
        }
      } catch {
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    if (lat && lng) {
      fetchRoutes()
    }
  }, [lat, lng, office.latitude, office.longitude])

  const selectedRoute = routes[selectedIndex]

  return (
    <div className='relative h-full w-full overflow-hidden rounded-lg border'>
      <Map
        center={[lng, lat]}
        zoom={15}
        styles={{ light: satelliteStyle, dark: satelliteStyle }}
      >
        {/* route line */}
        {routes
          .map((route, index) => ({ route, index }))
          .sort((a) => (a.index === selectedIndex ? 1 : -1))
          .map(({ route, index }) => {
            const isSelected = index === selectedIndex
            return (
              <MapRoute
                key={index}
                coordinates={route.coordinates}
                color={isSelected ? '#60a5fa' : '#cbd5e1'}
                width={isSelected ? 6 : 4}
                opacity={isSelected ? 1 : 0.5}
                onClick={() => setSelectedIndex(index)}
              />
            )
          })}

        {/* office marker */}
        <MapMarker longitude={office.longitude} latitude={office.latitude}>
          <MarkerContent>
            <div className='relative flex items-center justify-center'>
              <div className='absolute size-8 animate-ping rounded-full bg-red-400 opacity-20' />
              <div className='z-10 size-5 rounded-full border-2 border-white bg-red-500 shadow-lg' />
            </div>
            <MarkerLabel
              position='top'
              className='rounded bg-black/60 px-2 py-0.5 font-bold text-white shadow'
            >
              {office.name}
            </MarkerLabel>
          </MarkerContent>
        </MapMarker>

        <MapMarker longitude={lng} latitude={lat}>
          <MarkerContent>
            <div className='flex size-8 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-xl'>
              <LogIn size={14} />
            </div>
            <MarkerLabel
              position='bottom'
              className='rounded bg-black/60 px-2 py-0.5 text-xs text-white shadow'
            >
              {userName || 'User'} {checkIn ? `- ${formatTime(checkIn)}` : ''}
            </MarkerLabel>
          </MarkerContent>
        </MapMarker>

        {/* Check-out Marker (if exists) */}
        {hasCheckOut && (
          <MapMarker longitude={lngOut!} latitude={latOut!}>
            <MarkerContent>
              <div className='flex size-8 items-center justify-center rounded-full border-2 border-white bg-orange-500 text-white shadow-xl'>
                <LogOut size={14} />
              </div>
              <MarkerLabel
                position='bottom'
                className='rounded bg-black/60 px-2 py-0.5 text-xs text-white shadow'
              >
                Check-out {checkOut ? `- ${formatTime(checkOut)}` : ''}
              </MarkerLabel>
            </MarkerContent>
          </MapMarker>
        )}
      </Map>

      {!isLoading && !hasError && selectedRoute && (
        <div className='pointer-events-auto absolute top-4 right-4 left-4 z-50 max-w-[300px]'>
          <div className='rounded-xl border bg-white/95 shadow-2xl backdrop-blur-sm dark:bg-slate-900/95'>
            {/* Route info row */}
            <div className='flex items-center gap-3 px-4 py-3'>
              <div className='flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50'>
                <Navigation
                  size={18}
                  className='text-indigo-600 dark:text-indigo-400'
                />
              </div>
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-bold text-slate-900 dark:text-white'>
                    {formatDuration(selectedRoute.duration)}
                  </span>
                  <span className='text-xs text-slate-400'>-</span>
                  <span className='text-xs text-slate-500 dark:text-slate-400'>
                    {formatDistance(selectedRoute.distance)}
                  </span>
                  {workMode && (
                    <span
                      className={cn(
                        'ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase',
                        workMode === 'WFO'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400'
                      )}
                    >
                      {workMode}
                    </span>
                  )}
                </div>
                <p className='mt-0.5 text-[11px] text-slate-500 dark:text-slate-400'>
                  Rute ke {office.name}
                </p>
              </div>
            </div>

            {/* time and note */}
            {(checkIn || note) && (
              <div className='border-t border-slate-100 px-4 py-2.5 dark:border-slate-800'>
                <div className='flex items-center gap-4 text-[11px]'>
                  {checkIn && (
                    <span className='flex items-center gap-1 text-slate-500 dark:text-slate-400'>
                      <LogIn size={11} className='text-blue-500' />
                      {formatTime(checkIn)}
                    </span>
                  )}
                  {checkOut && (
                    <span className='flex items-center gap-1 text-slate-500 dark:text-slate-400'>
                      <LogOut size={11} className='text-orange-500' />
                      {formatTime(checkOut)}
                    </span>
                  )}
                  {note && (
                    <span className='ml-auto max-w-50 truncate text-sm text-slate-600 italic dark:text-slate-500'>
                      "{note}"
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Alternative routes */}
            {routes.length > 1 && (
              <div className='flex gap-1 border-t border-slate-100 px-4 py-2 dark:border-slate-800'>
                {routes.map((route, index) => {
                  const isActive = index === selectedIndex
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={cn(
                        'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] transition-all',
                        isActive
                          ? 'bg-indigo-100 font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800'
                      )}
                    >
                      <Route size={11} />
                      {formatDuration(route.duration)}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error state */}
      {!isLoading && hasError && (
        <div className='pointer-events-auto absolute right-4 bottom-4 left-4 z-[50]'>
          <div className='flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50/95 px-4 py-3 shadow-lg backdrop-blur-sm dark:border-amber-800 dark:bg-amber-950/95'>
            <AlertTriangle size={16} className='flex-shrink-0 text-amber-500' />
            <p className='text-xs text-amber-700 dark:text-amber-300'>
              Rute tidak ditemukan. Lokasi mungkin terlalu jauh atau tidak
              terjangkau.
            </p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div className='absolute inset-0 z-[60] flex items-center justify-center bg-background/20 backdrop-blur-[2px]'>
          <div className='flex flex-col items-center gap-3 rounded-xl bg-white/80 p-6 shadow-2xl dark:bg-slate-900/80'>
            <Loader2 className='size-10 animate-spin text-indigo-600' />
            <p className='text-sm font-bold text-slate-700 dark:text-slate-200'>
              Mencari Rute...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
