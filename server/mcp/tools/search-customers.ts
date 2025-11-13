import { eq, or, sql } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '~~/server/database/db'
import { customers, organizations } from '~~/server/database/schema'

const inputSchema = z.object({
    str: z.string().describe('Search string')
})

type Input = z.infer<typeof inputSchema>

async function handler(input: Input) {
  const searchStr = input.str.toLowerCase()

  const results = await db
    .select({
      id: customers.id,
      firstName: customers.firstName,
      lastName: customers.lastName,
      email: customers.email,
      phone: customers.phone,
      position: customers.position,
      department: customers.department,
      credit: customers.credit,
      organizationId: customers.organizationId,
      organizationName: organizations.name,
      organizationWebsite: organizations.website,
      organizationIndustry: organizations.industry
    })
    .from(customers)
    .leftJoin(organizations, eq(customers.organizationId, organizations.id))
    .where(
      or(
        sql`LOWER(${customers.firstName}) LIKE ${`%${searchStr}%`}`,
        sql`LOWER(${customers.lastName}) LIKE ${`%${searchStr}%`}`,
        sql`LOWER(${customers.email}) LIKE ${`%${searchStr}%`}`,
        sql`LOWER(${organizations.name}) LIKE ${`%${searchStr}%`}`,
        sql`LOWER(${organizations.website}) LIKE ${`%${searchStr}%`}`,
        sql`LOWER(${organizations.industry}) LIKE ${`%${searchStr}%`}`
      )
    )
    .limit(20)

  return {
    success: true,
    data: results
  }
}

export default {
  name: 'search_customers',
  description: 'Search for customers by name, website, or industry',
  inputSchema,
  handler,
  readOnly: true
}