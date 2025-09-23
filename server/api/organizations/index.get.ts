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

  const query = getQuery(event)
  const limit = Number(query.limit) || 50
  const offset = Number(query.offset) || 0

  const results = await db.select()
    .from(organizations)
    .limit(limit)
    .offset(offset)
    .all()

  return {
    data: results,
    limit,
    offset
  }
})