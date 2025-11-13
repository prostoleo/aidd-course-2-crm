import { db } from '../../database/db'
import { users } from '../../database/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword, generateToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, password } = body

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required'
    })
  }

  const user = await db.select().from(users).where(eq(users.email, email)).get()

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  const validPassword = await verifyPassword(password, user.password)

  if (!validPassword) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  if (!user.isActive) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Account is inactive'
    })
  }

  const token = generateToken(user.id)

  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  })

  const { password: _, ...userWithoutPassword } = user

  return {
    user: userWithoutPassword,
    token
  }
})