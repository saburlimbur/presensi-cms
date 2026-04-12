export type Department = {
  id: string
  name: string
  code: string
  headId: string | null
  head: { id: string; fullName: string } | null
  _count: {
    employees: number
  }
  createdAt: string
  updatedAt: string
}
