import { useState } from 'react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    })

    const { token, user } = response.data

    // ✅ Store token in localStorage
    localStorage.setItem('token', token)

    // Optional: Store user info if needed
    localStorage.setItem('user', JSON.stringify(user))

    // ✅ Navigate to dashboard
    navigate('/dashboard')
  } catch (error: any) {
    console.error('Login failed:', error.response?.data || error.message)
    alert(error.response?.data?.message || 'Login failed. Please try again.')
  }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-zinc-900 dark:to-zinc-950">
      <Card className="w-full max-w-md p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col items-center mb-6">
          <LogIn className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-center mt-2">Learning Tracker</h1>
          <p className="text-sm text-muted-foreground mt-1">Login to your account</p>
        </div>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full mt-4">
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
