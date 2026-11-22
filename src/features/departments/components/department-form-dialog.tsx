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
import { type User } from '@/features/users/data/schema'
import {
  departmentFormSchema,
  type DepartmentFormValues,
  NO_HEAD,
} from '../data/schema'
import useCreateDepartment from '../hooks/use-create-department'
import useUpdateDepartment from '../hooks/use-update-department'
import { type Department } from './departments-columns'

type DepartmentFormDialogProps = {
  currentRow?: Department
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DEFAULT_VALUES: DepartmentFormValues = {
  name: '',
  code: '',
  headId: NO_HEAD,
}

export function DepartmentFormDialog({
  currentRow,
  open,
  onOpenChange,
}: DepartmentFormDialogProps) {
  const isEdit = !!currentRow
  const createDepartment = useCreateDepartment()
  const updateDepartment = useUpdateDepartment()

  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees', { forHead: true }],
    queryFn: () => employeeService.getAll({ limit: 100 }),
    enabled: open,
    staleTime: 1000 * 60 * 5,
  })

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentFormSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open && currentRow) {
      form.reset({
        name: currentRow.name,
        code: currentRow.code,
        headId: currentRow.headId ?? NO_HEAD,
      })
    } else if (open && !currentRow) {
      form.reset(DEFAULT_VALUES)
    }
  }, [open, currentRow, form])

  const isPending = createDepartment.isPending || updateDepartment.isPending

  const headItems = [
    { label: '— Tanpa kepala departemen —', value: NO_HEAD },
    ...((employees?.data ?? []) as User[]).map((u) => ({
      label: `${u.fullName} (${u.employeeId})`,
      value: u.id,
    })),
  ]

  const onSubmit = (values: DepartmentFormValues) => {
    const headId =
      values.headId && values.headId !== NO_HEAD ? values.headId : null
    const payload = { name: values.name, code: values.code, headId }

    if (isEdit && currentRow) {
      updateDepartment.mutate(
        { id: currentRow.id, payload },
        { onSuccess: () => onOpenChange(false) }
      )
    } else {
      createDepartment.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Department' : 'Add New Department'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the department details.'
              : 'Create a new department for your organization.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            id='department-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='e.g. Human Resources' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='e.g. HR'
                      className='uppercase'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className='text-[11px]'>
                    Kode unik, otomatis disimpan dalam huruf kapital.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='headId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Head (optional)</FormLabel>
                  <SelectDropdown
                    isControlled
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                    isPending={isLoadingEmployees}
                    placeholder='Select department head'
                    items={headItems}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <Button type='submit' form='department-form' disabled={isPending}>
            {isPending
              ? 'Saving...'
              : isEdit
                ? 'Save changes'
                : 'Create Department'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
