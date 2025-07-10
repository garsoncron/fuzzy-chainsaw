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
    
    // Handle both JSON and form data
    const contentType = request.headers.get('content-type') || ''
    let email, password, firstName, lastName, role = 'admin'
    
    if (contentType.includes('application/json')) {
      // Handle JSON request
      const body = await request.json()
      ;({ email, password, firstName, lastName, role = 'admin' } = body)
    } else if (contentType.includes('multipart/form-data')) {
      // Handle form data (from Payload's built-in form)
      const formData = await request.formData()
      const payloadData = formData.get('_payload')
      
      if (payloadData && typeof payloadData === 'string') {
        const parsedData = JSON.parse(payloadData)
        ;({ email, password, firstName, lastName, role = 'admin' } = parsedData)
      } else {
        // Direct form fields
        email = formData.get('email') as string
        password = formData.get('password') as string
        firstName = formData.get('firstName') as string
        lastName = formData.get('lastName') as string
        role = (formData.get('role') as string) || 'admin'
      }
    } else {
      return Response.json({ error: 'Unsupported content type' }, { status: 400 })
    }
    
    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return Response.json({ 
        error: 'Missing required fields: email, password, firstName, lastName',
        received: { email: !!email, password: !!password, firstName: !!firstName, lastName: !!lastName }
      }, { status: 400 })
    }
    
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