import Image from 'next/image'
import { Inter } from 'next/font/google'
import { CallbackParams, useAuth } from '@pangeacyber/react-auth'
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import AuthScreen from '@/components/ui/AuthScreen';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { authenticated, login } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if(authenticated) {
      router.push('/chat')
    }
  }, [])

  return (
    <AuthScreen login={login} />
  )
}
