'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
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
import { SelectDropdown } from '@/components/select-dropdown'
import { employeeService } from '@/features/employees/api/employee.service'
import {
  createLeaveBalanceFormSchema,
  type CreateLeaveBalanceFormValues,
  type LeaveBalance,
} from '../data/schema'
import useCreateLeaveBalance from '../hooks/use-create-leave-balance'
import useUpdateLeaveBalance from '../hooks/use-update-leave-balance'

type LeaveBalanceFormDialogProps = {
  currentRow?: LeaveBalance
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CURRENT_YEAR = new Date().getFullYear()

export function LeaveBalanceFormDialog({
  currentRow,
  open,
  onOpenChange,
}: LeaveBalanceFormDialogProps) {
  const isEdit = !!currentRow
  const createLeaveBalance = useCreateLeaveBalance()
  const updateLeaveBalance = useUpdateLeaveBalance()

  const { data: employeesData, isLoading: isEmployeesLoading } = useQuery({
    queryKey: ['employees-picker'],
    queryFn: () => employeeService.getAll({ limit: 100 }),
    staleTime: 1000 * 60 * 5,
  })

  const employeeItems = (employeesData?.data ?? []).map((u) => ({
    label: `${u.fullName} (${u.employeeId})`,
    value: u.id,
  }))

  const form = useForm<CreateLeaveBalanceFormValues>({
    resolver: zodResolver(createLeaveBalanceFormSchema),
    defaultValues: {
      userId: '',
      year: CURRENT_YEAR,
      annualQuota: 12,
      carryOverDays: 0,
    },
  })

  useEffect(() => {
    if (open && currentRow) {
      form.reset({
        userId: currentRow.userId,
        year: currentRow.year,
        annualQuota: currentRow.annualQuota,
        carryOverDays: currentRow.carryOverDays,
      })
    } else if (open && !currentRow) {
      form.reset({
        userId: '',
        year: CURRENT_YEAR,
        annualQuota: 12,
        carryOverDays: 0,
      })
    }
  }, [open, currentRow, form])

  const isPending = createLeaveBalance.isPending || updateLeaveBalance.isPending

  const onSubmit = (values: CreateLeaveBalanceFormValues) => {
    if (isEdit && currentRow) {
      updateLeaveBalance.mutate(
        {
          id: currentRow.id,
          payload: {
            annualQuota: values.annualQuota,
            carryOverDays: values.carryOverDays,
          },
        },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createLeaveBalance.mutate(values, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Leave Balance' : 'Add New Leave Balance'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the annual quota and carry over days for this employee.'
              : 'Assign an annual leave quota to an employee for a given year.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='leave-balance-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='max-h-[60vh] space-y-4 overflow-y-auto pr-1'
          >
            <FormField
              control={form.control}
              name='userId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Employee</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    placeholder='Select employee'
                    isPending={isEmployeesLoading}
                    items={employeeItems}
                    disabled={isEdit}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='year'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      min={2000}
                      max={2100}
                      disabled={isEdit}
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === ''
                            ? CURRENT_YEAR
                            : e.target.valueAsNumber
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-3'>
              <FormField
                control={form.control}
                name='annualQuota'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Quota</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
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
                name='carryOverDays'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Carry Over</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        min={0}
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

            <FormDescription className='text-[11px]'>
              Remaining days are calculated automatically by the server.
            </FormDescription>
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='leave-balance-form' disabled={isPending}>
            {isPending
              ? 'Saving...'
              : isEdit
                ? 'Save changes'
                : 'Create Balance'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
