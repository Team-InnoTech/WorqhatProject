import { useState } from 'react'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (res.status === 200) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))

        navigate('/dashboard')
      } else {
        setError('Login failed')
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
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
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
                <a href="/forget-password" className="text-blue-600 hover:underline">
                    Forget Password?
                </a>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {error && (
            <p className="text-red-500 text-center mt-4 text-sm">{error}</p>
          )}

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