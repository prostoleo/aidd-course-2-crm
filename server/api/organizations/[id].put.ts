import { db } from '../../database/db'
import { organizations } from '../../database/schema'
import { eq } from 'drizzle-orm'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const auth = getUserFromEvent(event)

  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Organization ID is required'
    })
  }

  const body = await readBody(event)

  const updatedOrganization = await db.update(organizations)
    .set({ ...body, updatedAt: new Date().toISOString() })
    .where(eq(organizations.id, parseInt(id)))
    .returning()
    .get()

  if (!updatedOrganization) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Organization not found'
    })
  }

  return updatedOrganization
})