import { db } from '../../database/db'
import { organizations } from '../../database/schema'
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

  const newOrganization = await db.insert(organizations).values(body).returning().get()

  return newOrganization
})