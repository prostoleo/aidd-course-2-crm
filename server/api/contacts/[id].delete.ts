import { db } from '../../database/db'
import { contacts } from '../../database/schema'
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
      statusMessage: 'Contact ID is required'
    })
  }

  const deletedContact = await db.delete(contacts)
    .where(eq(contacts.id, parseInt(id)))
    .returning()
    .get()

  if (!deletedContact) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Contact not found'
    })
  }

  return {
    success: true,
    message: 'Contact deleted successfully'
  }
})