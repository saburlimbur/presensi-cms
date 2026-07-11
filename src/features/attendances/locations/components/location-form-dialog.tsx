'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  locationFormSchema,
  type Location,
  type LocationFormValues,
} from '../data/schema'
import useCreateLocation from '../hooks/use-create-location'
import useUpdateLocation from '../hooks/use-update-location'

type LocationFormDialogProps = {
  currentRow?: Location
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEFAULT_VALUES: LocationFormValues = {
  name: '',
  address: '',
  latitude: 0,
  longitude: 0,
  radius: 100,
  isActive: true,
}

export function LocationFormDialog({
  currentRow,
  open,
  onOpenChange,
}: LocationFormDialogProps) {
  const isEdit = !!currentRow
  const createLocation = useCreateLocation()
  const updateLocation = useUpdateLocation()

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open && currentRow) {
      form.reset({
        name: currentRow.name,
        address: currentRow.address ?? '',
        latitude: currentRow.latitude,
        longitude: currentRow.longitude,
        radius: currentRow.radius,
        isActive: currentRow.isActive,
      })
    } else if (open && !currentRow) {
      form.reset(DEFAULT_VALUES)
    }
  }, [open, currentRow, form])

  const isPending = createLocation.isPending || updateLocation.isPending

  const onSubmit = (values: LocationFormValues) => {
    if (isEdit && currentRow) {
      updateLocation.mutate(
        { id: currentRow.id, payload: values },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createLocation.mutate(values, { onSuccess: () => onOpenChange(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Location' : 'Add New Location'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the check-in geofence for this location.'
              : 'Define a new office location employees can check in from.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='location-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='max-h-[60vh] space-y-4 overflow-y-auto pr-1'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. Head Office' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={2}
                      placeholder='Street, city, etc.'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='latitude'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='any'
                        min={-90}
                        max={90}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === '' ? 0 : e.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='longitude'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        step='any'
                        min={-180}
                        max={180}
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === '' ? 0 : e.target.valueAsNumber
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='radius'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Radius (meters)</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={1}
                      max={10000}
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === '' ? 0 : e.target.valueAsNumber
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription className='text-[11px]'>
                    Radius geofence untuk validasi check-in.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='isActive'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-3'>
                  <div className='space-y-0.5'>
                    <FormLabel>Active</FormLabel>
                    <FormDescription className='text-[11px]'>
                      Lokasi non-aktif tidak bisa dipakai untuk check-in.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='location-form' disabled={isPending}>
            {isPending
              ? 'Saving...'
              : isEdit
                ? 'Save changes'
                : 'Create Location'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
