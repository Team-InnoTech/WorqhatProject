import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { LockKeyhole } from 'lucide-react'

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()

    const email = localStorage.getItem('resetEmail')
    if (!email) {
      alert('Email not found. Please go back and verify your email again.')
      window.location.href = '/forget-password'
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      })

      const data = await response.json();

      if (response.ok) {
        alert('Password reset successful. Please login.')
        localStorage.removeItem('resetEmail')
        window.location.href = '/'
      } else {
        alert(data.message || 'Failed to reset password.')
      }
    } catch (error) {
      console.error('Error resetting password:', error)
      alert('Something went wrong.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-zinc-900 dark:to-zinc-950">
      <Card className="w-full max-w-md p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col items-center mb-6">
          <LockKeyhole className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-center mt-2">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">Enter your new password below</p>
        </div>

        <CardContent>
          <form onSubmit={handleReset} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                type="password"
                id="newPassword"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ResetPassword
