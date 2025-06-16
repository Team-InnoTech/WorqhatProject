import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Mail } from 'lucide-react'
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('')

const handleSendOtp = async (e: React.FormEvent) => {
  e.preventDefault()

  try {
      const response = await axios.post("http://localhost:5000/api/auth/send-otp", {
      email,
    })

    if (response.status === 200) {
      localStorage.setItem("resetEmail", email)
      alert("OTP sent to your email.")
      window.location.href = "/verify-otp"
    } 
    else {
      alert(response.data.message || "Failed to send OTP.")
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error sending OTP:", error)
      alert(
      error?.response?.data?.message ||
      "Something went wrong while sending OTP."
      )
    }
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-zinc-900 dark:to-zinc-950">
      <Card className="w-full max-w-md p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-col items-center mb-6">
          <Mail className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-center mt-2">Forgot Password</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">Enter your email to receive a verification OTP</p>
        </div>

        <CardContent>
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Send OTP
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword
