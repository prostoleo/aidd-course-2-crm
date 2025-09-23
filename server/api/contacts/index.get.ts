import { db } from '../../database/db'
import { contacts, organizations } from '../../database/schema'
import { getUserFromEvent } from '../../utils/auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const auth = getUserFromEvent(event)

  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const query = getQuery(event)
  const limit = Number(query.limit) || 50
  const offset = Number(query.offset) || 0
  const organizationId = query.organizationId ? Number(query.organizationId) : null

  let queryBuilder = db.select({
    contact: contacts,
    organization: organizations
  })
    .from(contacts)
    .leftJoin(organizations, eq(contacts.organizationId, organizations.id))
    .limit(limit)
    .offset(offset)

  if (organizationId) {
    queryBuilder = queryBuilder.where(eq(contacts.organizationId, organizationId))
  }

  const results = await queryBuilder.all()

  return {
    data: results.map(r => ({ ...r.contact, organization: r.organization })),
    limit,
    offset
  }
})