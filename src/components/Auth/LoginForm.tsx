'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, LogIn } from 'lucide-react'

/**
 * @description Tournament login form with role-based authentication
 * @dependencies UI components, Next.js router
 * @accessibility Full keyboard navigation and screen reader support
 * @security Input validation and secure credential handling
 */

interface LoginFormProps {
  onSuccess?: (user: any) => void
  redirectTo?: string
  title?: string
  description?: string
}

export function LoginForm({ 
  onSuccess, 
  redirectTo = '/admin', 
  title = 'Cowtown Showdown Login',
  description = 'Sign in to access the tournament management system'
}: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store auth token
      localStorage.setItem('token', data.token)
      
      // Store user info
      localStorage.setItem('user', JSON.stringify(data.user))

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(data.user)
      }

      // Redirect based on user role
      const redirectPath = data.user.role === 'scorekeeper' 
        ? '/scorekeeper' 
        : redirectTo

      router.push(redirectPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Card className=\"w-full max-w-md mx-auto\">
      <CardHeader className=\"space-y-1\">
        <CardTitle className=\"text-2xl font-bold text-center text-primary-brown\">
          {title}
        </CardTitle>
        <CardDescription className=\"text-center\">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className=\"space-y-4\">
          {error && (
            <Alert variant=\"destructive\">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className=\"space-y-2\">
            <Label htmlFor=\"email\">Email</Label>
            <Input
              id=\"email\"
              name=\"email\"
              type=\"email\"
              placeholder=\"Enter your email\"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              className=\"w-full\"
            />
          </div>
          
          <div className=\"space-y-2\">
            <Label htmlFor=\"password\">Password</Label>
            <div className=\"relative\">
              <Input
                id=\"password\"
                name=\"password\"
                type={showPassword ? 'text' : 'password'}
                placeholder=\"Enter your password\"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className=\"w-full pr-10\"
              />
              <button
                type=\"button\"
                onClick={() => setShowPassword(!showPassword)}
                className=\"absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700\"
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <Button
            type=\"submit\"
            className=\"w-full\"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className=\"animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2\" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className=\"mr-2 h-4 w-4\" />
                Sign In
              </>
            )}
          </Button>
        </form>
        
        <div className=\"mt-4 text-center text-sm text-gray-600\">
          <p>Need help? Contact the tournament administrators.</p>
        </div>
      </CardContent>
    </Card>
  )
}