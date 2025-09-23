import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import bcrypt from 'bcrypt'
import * as schema from './schema'

const sqlite = new Database('./crm.db')
const db = drizzle(sqlite, { schema })

async function seed() {
  console.log('Starting database seed...')

  try {
    // Clear existing data
    await db.delete(schema.notes)
    await db.delete(schema.opportunities)
    await db.delete(schema.contacts)
    await db.delete(schema.organizations)
    await db.delete(schema.users)

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10)

    const users = await db.insert(schema.users).values([
      {
        email: 'admin@crm.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isActive: true
      },
      {
        email: 'john.doe@crm.com',
        password: hashedPassword,
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        isActive: true
      },
      {
        email: 'jane.smith@crm.com',
        password: hashedPassword,
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'user',
        isActive: true
      }
    ]).returning()

    // Create organizations
    const organizations = await db.insert(schema.organizations).values([
      {
        name: 'Tech Solutions Inc.',
        website: 'https://techsolutions.com',
        industry: 'Technology',
        phone: '555-0100',
        address: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'USA'
      },
      {
        name: 'Global Marketing Agency',
        website: 'https://globalmarketing.com',
        industry: 'Marketing',
        phone: '555-0200',
        address: '456 Marketing Ave',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      {
        name: 'Healthcare Partners',
        website: 'https://healthcarepartners.com',
        industry: 'Healthcare',
        phone: '555-0300',
        address: '789 Medical Blvd',
        city: 'Boston',
        state: 'MA',
        zip: '02108',
        country: 'USA'
      },
      {
        name: 'Financial Advisors LLC',
        website: 'https://financialadvisors.com',
        industry: 'Finance',
        phone: '555-0400',
        address: '321 Wall Street',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        country: 'USA'
      },
      {
        name: 'Education First',
        website: 'https://educationfirst.com',
        industry: 'Education',
        phone: '555-0500',
        address: '654 University Way',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        country: 'USA'
      }
    ]).returning()

    // Create contacts
    const contacts = await db.insert(schema.contacts).values([
      {
        organizationId: organizations[0].id,
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael.johnson@techsolutions.com',
        phone: '555-0101',
        mobile: '555-9101',
        position: 'CEO',
        department: 'Executive',
        isPrimary: true
      },
      {
        organizationId: organizations[0].id,
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah.williams@techsolutions.com',
        phone: '555-0102',
        mobile: '555-9102',
        position: 'CTO',
        department: 'Technology',
        isPrimary: false
      },
      {
        organizationId: organizations[1].id,
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@globalmarketing.com',
        phone: '555-0201',
        mobile: '555-9201',
        position: 'Marketing Director',
        department: 'Marketing',
        isPrimary: true
      },
      {
        organizationId: organizations[1].id,
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.davis@globalmarketing.com',
        phone: '555-0202',
        mobile: '555-9202',
        position: 'Creative Director',
        department: 'Creative',
        isPrimary: false
      },
      {
        organizationId: organizations[2].id,
        firstName: 'Robert',
        lastName: 'Miller',
        email: 'robert.miller@healthcarepartners.com',
        phone: '555-0301',
        mobile: '555-9301',
        position: 'Medical Director',
        department: 'Medical',
        isPrimary: true
      },
      {
        organizationId: organizations[3].id,
        firstName: 'Jennifer',
        lastName: 'Wilson',
        email: 'jennifer.wilson@financialadvisors.com',
        phone: '555-0401',
        mobile: '555-9401',
        position: 'Senior Advisor',
        department: 'Advisory',
        isPrimary: true
      },
      {
        organizationId: organizations[4].id,
        firstName: 'William',
        lastName: 'Moore',
        email: 'william.moore@educationfirst.com',
        phone: '555-0501',
        mobile: '555-9501',
        position: 'Principal',
        department: 'Administration',
        isPrimary: true
      }
    ]).returning()

    // Create notes
    await db.insert(schema.notes).values([
      {
        userId: users[0].id,
        organizationId: organizations[0].id,
        contactId: contacts[0].id,
        content: 'Initial meeting with CEO to discuss partnership opportunities.',
        type: 'meeting'
      },
      {
        userId: users[1].id,
        organizationId: organizations[0].id,
        content: 'Follow-up call scheduled for next week to review proposal.',
        type: 'call'
      },
      {
        userId: users[1].id,
        organizationId: organizations[1].id,
        contactId: contacts[2].id,
        content: 'Sent marketing campaign proposal via email.',
        type: 'email'
      },
      {
        userId: users[2].id,
        organizationId: organizations[2].id,
        content: 'Healthcare compliance documentation received and reviewed.',
        type: 'note'
      },
      {
        userId: users[0].id,
        organizationId: organizations[3].id,
        contactId: contacts[5].id,
        content: 'Quarterly financial review meeting completed.',
        type: 'meeting'
      }
    ])

    // Create opportunities
    await db.insert(schema.opportunities).values([
      {
        organizationId: organizations[0].id,
        name: 'Enterprise Software License',
        value: 250000,
        stage: 'proposal',
        probability: 75,
        expectedCloseDate: '2024-03-31',
        assignedTo: users[1].id
      },
      {
        organizationId: organizations[1].id,
        name: 'Annual Marketing Campaign',
        value: 150000,
        stage: 'negotiation',
        probability: 60,
        expectedCloseDate: '2024-02-28',
        assignedTo: users[2].id
      },
      {
        organizationId: organizations[2].id,
        name: 'Medical Equipment Supply',
        value: 500000,
        stage: 'qualified',
        probability: 40,
        expectedCloseDate: '2024-04-30',
        assignedTo: users[1].id
      },
      {
        organizationId: organizations[3].id,
        name: 'Investment Advisory Services',
        value: 100000,
        stage: 'closed_won',
        probability: 100,
        expectedCloseDate: '2024-01-15',
        assignedTo: users[0].id
      },
      {
        organizationId: organizations[4].id,
        name: 'Educational Software Platform',
        value: 75000,
        stage: 'lead',
        probability: 25,
        expectedCloseDate: '2024-05-31',
        assignedTo: users[2].id
      }
    ])

    console.log('Database seeded successfully!')
    console.log(`Created ${users.length} users`)
    console.log(`Created ${organizations.length} organizations`)
    console.log(`Created ${contacts.length} contacts`)
    console.log(`Created 5 notes`)
    console.log(`Created 5 opportunities`)

  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  } finally {
    sqlite.close()
  }
}

seed()