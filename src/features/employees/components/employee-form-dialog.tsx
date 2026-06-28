'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import useGetAllDepartments from '@/features/departments/hooks/useGetAllDepartments'
import { positions } from '@/features/users/data/data'
import {
  type User,
  type Department,
} from '@/features/users/data/schema'
import {
  employeeFormSchema,
  type EmployeeFormValues,
} from '../data/schema'
import useCreateEmployee from '../hooks/use-create-employee'

type EmployeeFormDialogProps = {
  currentRow?: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeeFormDialog({
  currentRow,
  open,
  onOpenChange,
}: EmployeeFormDialogProps) {
  const isEdit = !!currentRow

  const { data: departments, isLoading: isLoadingDepartments } =
    useGetAllDepartments()

  // API call + toast + cache invalidation di-handle hook; komponen tinggal
  // pass extra `onSuccess` untuk UI-side (reset form, close dialog).
  const createEmployee = useCreateEmployee()

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: isEdit
      ? {
        fullName: currentRow.fullName,
        email: currentRow.email,
        phone: currentRow.phone,
        departmentCode: currentRow.department?.code ?? '',
        position: currentRow.position,
        password: '',
        confirmPassword: '',
        isEdit,
      }
      : {
        fullName: '',
        email: '',
        phone: '',
        departmentCode: '',
        position: 'STAFF',
        password: '',
        confirmPassword: '',
        isEdit,
      },
  })

  const onSubmit = (values: EmployeeFormValues) => {
    if (isEdit) {
      // TODO: backend belum punya endpoint PUT /users/:id untuk full update.
      // Sementara hanya close dialog. Update profile self-only via
      // PATCH /users/profile sudah tersedia di userService.
      toast.info('Edit employee belum tersedia di backend.')
      onOpenChange(false)
      return
    }

    // Kirim HANYA field yang diterima backend createUserSchema.
    // employeeId, isActive, isFaceRegistered, joinDate di-handle backend
    // (joinDate di-set ke hari ini Asia/Jakarta di user.service.createUser).
    createEmployee.mutate(
      {
        email: values.email,
        password: values.password,
        fullName: values.fullName,
        phone: values.phone,
        departmentCode: values.departmentCode,
        position: values.position,
        role: 'EMPLOYEE',
      },
      {
        onSuccess: () => {
          form.reset()
          onOpenChange(false)
        },
      }
    )
  }

  const departmentItems = (departments ?? []).map((d: Department) => ({
    label: `${d.name} (${d.code})`,
    value: d.code,
  }))

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        form.reset()
        onOpenChange(state)
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Employee' : 'Add New Employees'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the employee here. '
              : 'Create new employee here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='h-105 w-[calc(100%+0.75rem)] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='employee-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              <FormField
                control={form.control}
                name='fullName'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
                        className='col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='john.doe@company.com'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='+62812345678'
                        className='col-span-4'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='departmentCode'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Department
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder={
                        isLoadingDepartments
                          ? 'Loading departments...'
                          : 'Select department'
                      }
                      className='col-span-4'
                      items={departmentItems}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='position'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-end'>
                      Position
                    </FormLabel>
                    <SelectDropdown
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      placeholder='Select position'
                      className='col-span-4'
                      items={positions.map(({ label, value }) => ({
                        label,
                        value,
                      }))}
                    />
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              {!isEdit && (
                <>
                  <FormField
                    control={form.control}
                    name='password'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder='e.g., S3cur3P@ssw0rd'
                            className='col-span-4'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='confirmPassword'
                    render={({ field }) => (
                      <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                        <FormLabel className='col-span-2 text-end'>
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder='Confirm your password'
                            className='col-span-4'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='col-span-4 col-start-3' />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            form='employee-form'
            disabled={createEmployee.isPending}
          >
            {createEmployee.isPending
              ? 'Saving...'
              : isEdit
                ? 'Save changes'
                : 'Create Employees'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
