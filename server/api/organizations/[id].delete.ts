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

  const deletedOrganization = await db.delete(organizations)
    .where(eq(organizations.id, parseInt(id)))
    .returning()
    .get()

  if (!deletedOrganization) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Organization not found'
    })
  }

  return {
    success: true,
    message: 'Organization deleted successfully'
  }
})