import { db } from '../../database/db'
import { contacts } from '../../database/schema'
import { getUserFromEvent } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const auth = getUserFromEvent(event)

  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const body = await readBody(event)

  if (!body.organizationId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Organization ID is required'
    })
  }

  const newContact = await db.insert(contacts).values(body).returning().get()

  return newContact
})