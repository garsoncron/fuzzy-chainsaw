import { NextRequest } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    
    // Check if any users exist
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })
    
    if (existingUsers.totalDocs > 0) {
      return Response.json({ error: 'Users already exist' }, { status: 400 })
    }
    
    const body = await request.json()
    const { email, password, firstName, lastName, role = 'admin' } = body
    
    // Create the first user
    const user = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        firstName,
        lastName,
        role,
      },
    })
    
    return Response.json({ success: true, user: { id: user.id, email: user.email } })
    
  } catch (error) {
    console.error('First user creation error:', error)
    return Response.json({ error: 'Failed to create user' }, { status: 500 })
  }
}