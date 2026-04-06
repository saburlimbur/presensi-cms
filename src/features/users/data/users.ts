import { faker } from '@faker-js/faker'
import { type User } from './schema'

faker.seed(67890)

const positionValues = [
  'DIRECTOR',
  'MANAGER',
  'SUPERVISOR',
  'TEAM_LEAD',
  'SENIOR_STAFF',
  'STAFF',
  'JUNIOR_STAFF',
  'HR_SPECIALIST',
  'FINANCE_SPECIALIST',
  'IT_SPECIALIST',
  'MARKETING_SPECIALIST',
  'INTERN',
  'CONTRACT',
  'OTHER',
] as const

const departmentNames = ['HRD', 'IT', 'Finance', 'Operations', 'Marketing']

export const users: User[] = Array.from({ length: 100 }, () => {
  const fullName = faker.person.fullName()
  const deptName = faker.helpers.arrayElement(departmentNames)
  return {
    id: faker.string.uuid(),
    email: faker.internet.email({ firstName: fullName.split(' ')[0] }).toLowerCase(),
    fullName,
    phone: faker.phone.number({ style: 'international' }),
    employeeId: `EMP-${faker.string.numeric(5)}`,
    departmentId: faker.string.uuid(),
    departmentName: deptName,
    position: faker.helpers.arrayElement(positionValues),
    role: faker.helpers.arrayElement(['ADMIN', 'EMPLOYEE'] as const),
    joinDate: faker.date.past({ years: 5 }),
    isActive: faker.datatype.boolean({ probability: 0.85 }),
    isFaceRegistered: faker.datatype.boolean({ probability: 0.6 }),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }
})
