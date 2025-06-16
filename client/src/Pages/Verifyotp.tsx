import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { ShieldCheck } from 'lucide-react'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../components/ui/input-otp'

const VerifyOtp = () => {
  const [otp, setOtp] = useState('')
  const navigate = useNavigate()

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()

    const email = localStorage.getItem('resetEmail')
    if (!email) {
      alert('Email not found. Please go back and enter your email again.')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert('OTP verified successfully.')
        navigate('/reset-password')
      } else {
        alert(data.message || 'Invalid OTP')
      }
    } catch (err) {
      console.error('OTP verification failed:', err)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-zinc-900 dark:to-zinc-950">
      <Card className="w-full max-w-md p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col items-center mb-6">
          <ShieldCheck className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-center mt-2">Verify OTP</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter the 6-digit OTP sent to your email</p>
        </div>

        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex flex-col items-center">
              <Label htmlFor="otp">OTP</Label>
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(val) => setOtp(val)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button type="submit" className="w-full">
              Verify OTP
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Didn’t receive OTP?{' '}
              <a href="/forgot-password" className="text-blue-600 hover:underline">
                Resend
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default VerifyOtp
