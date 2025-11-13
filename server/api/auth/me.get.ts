import { db } from '../../database/db'
import { users } from '../../database/schema'
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

  const user = await db.select({
    id: users.id,
    email: users.email,
    firstName: users.firstName,
    lastName: users.lastName,
    role: users.role,
    isActive: users.isActive
  }).from(users).where(eq(users.id, auth.userId)).get()

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found'
    })
  }

  return user
})