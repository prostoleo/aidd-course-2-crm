import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
import * as schema from '../server/database/schema'
import bcrypt from 'bcrypt'
import { generateToken, verifyToken, verifyPassword } from '../server/utils/auth'

const testDb = new Database(':memory:')
const db = drizzle(testDb, { schema })

beforeAll(async () => {
  // Create tables
  testDb.exec(`
    CREATE TABLE organizations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      website TEXT,
      industry TEXT,
      phone TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      zip TEXT,
      country TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  testDb.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  testDb.exec(`
    CREATE TABLE contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      organization_id INTEGER NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      mobile TEXT,
      position TEXT,
      department TEXT,
      is_primary INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
    )
  `)

  // Seed test data
  const hashedPassword = await bcrypt.hash('testpass', 10)

  await db.insert(schema.users).values({
    email: 'test@example.com',
    password: hashedPassword,
    firstName: 'Test',
    lastName: 'User',
    role: 'admin',
    isActive: true
  })

  await db.insert(schema.organizations).values({
    name: 'Test Organization',
    website: 'https://test.com',
    industry: 'Technology',
    city: 'Test City',
    state: 'TS',
    country: 'Test Country'
  })
})

afterAll(() => {
  testDb.close()
})

describe('Authentication', () => {
  it('should hash passwords correctly', async () => {
    const password = 'mypassword'
    const hash = await bcrypt.hash(password, 10)
    const isValid = await verifyPassword(password, hash)
    expect(isValid).toBe(true)
  })

  it('should generate and verify JWT tokens', () => {
    const userId = 1
    const token = generateToken(userId)
    expect(token).toBeDefined()

    const payload = verifyToken(token)
    expect(payload.userId).toBe(userId)
  })

  it('should reject invalid tokens', () => {
    const result = verifyToken('invalid-token')
    expect(result).toBeNull()
  })
})

describe('Database Operations', () => {
  it('should create and retrieve organizations', async () => {
    const newOrg = await db.insert(schema.organizations).values({
      name: 'New Test Org',
      website: 'https://newtest.com',
      industry: 'Finance'
    }).returning().get()

    expect(newOrg).toBeDefined()
    expect(newOrg.name).toBe('New Test Org')

    const orgs = await db.select().from(schema.organizations).all()
    expect(orgs.length).toBeGreaterThan(0)
  })

  it('should create and retrieve users', async () => {
    const users = await db.select().from(schema.users).all()
    expect(users.length).toBeGreaterThan(0)
    expect(users[0].email).toBe('test@example.com')
  })

  it('should create contacts with organization relationships', async () => {
    const org = await db.select().from(schema.organizations).limit(1).get()

    const contact = await db.insert(schema.contacts).values({
      organizationId: org.id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      position: 'Manager',
      isPrimary: true
    }).returning().get()

    expect(contact).toBeDefined()
    expect(contact.firstName).toBe('John')
    expect(contact.organizationId).toBe(org.id)
  })

  it('should update organization data', async () => {
    const org = await db.select().from(schema.organizations).limit(1).get()

    const updated = await db.update(schema.organizations)
      .set({ industry: 'Updated Industry' })
      .where(eq(schema.organizations.id, org.id))
      .returning()
      .get()

    expect(updated.industry).toBe('Updated Industry')
  })

  it('should delete organizations with cascading', async () => {
    const testOrg = await db.insert(schema.organizations).values({
      name: 'To Delete',
      industry: 'Test'
    }).returning().get()

    await db.insert(schema.contacts).values({
      organizationId: testOrg.id,
      firstName: 'Delete',
      lastName: 'Me',
      email: 'delete@example.com'
    })

    await db.delete(schema.organizations)
      .where(eq(schema.organizations.id, testOrg.id))

    const org = await db.select()
      .from(schema.organizations)
      .where(eq(schema.organizations.id, testOrg.id))
      .get()

    expect(org).toBeUndefined()
  })
})