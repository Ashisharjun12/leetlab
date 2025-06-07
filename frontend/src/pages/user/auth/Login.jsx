import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(4, { message: 'Password must be at least 4 characters.' }),
})

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const {login , isLoggingIn} = useAuthStore()

  const onSubmit = async (values) => {
    try {
      await login(values);
      window.location.reload();
      navigate('/');
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-2">
      <Card className="w-full max-w-sm p-4 md:p-6 shadow-2xl border border-border rounded-2xl flex flex-col justify-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-primary">Login to codesheet.in</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 md:gap-7">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-base">Email</Label>
            <Input id="email" type="email" placeholder="you@email.com" {...register('email')} className="h-12 text-base" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-2 relative">
            <Label htmlFor="password" className="text-base">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                {...register('password')}
                className="h-12 text-base pr-12"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <Button type="submit" className="w-full h-12 text-base mt-2 cursor-pointer" disabled={isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <div className="mt-6 md:mt-8 text-center text-muted-foreground text-base">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-primary hover:underline font-semibold cursor-pointer"
            onClick={() => navigate('/signup')}
          >
            Sign up
          </button>
        </div>
      </Card>
    </div>
  )
}

export default Login