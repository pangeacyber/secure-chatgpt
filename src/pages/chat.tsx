import { nanoid } from 'ai'
import { Chat } from '@/components/chat'
import { useCompletion } from 'ai/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { TooltipProvider } from '@/components/ui/tooltip';
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { useAuth } from '@pangeacyber/react-auth';
import AuthScreen from '@/components/ui/AuthScreen';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
 
export default function Completion() {

  const id = nanoid()
  const {authenticated, login, logout, user} = useAuth()
  const router = useRouter();

  // if(!authenticated) {
  //   router.push('/')
  // } else {
    console.log(authenticated)
    console.log(user)
  // }

  useEffect(() => {
    console.log(authenticated);
  }, [authenticated])
 
  return (
    <>
    {authenticated ? (
      <NextThemesProvider>
          <TooltipProvider>
              <Providers attribute="class" defaultTheme="system" enableSystem>
                  <div className="flex flex-col min-h-screen">
                  <main className="flex flex-col flex-1 bg-muted/50">
                      {/* <Header /> */}
                      <Chat id={id} />
                  </main>
                  </div>
              </Providers>
          </TooltipProvider>
      </NextThemesProvider>
    ): (
      <></>
    )}
    </>
    )
}