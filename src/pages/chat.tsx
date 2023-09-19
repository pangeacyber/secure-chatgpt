'use client';
 
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
  // const {
  //   completion,
  //   input,
  //   stop,
  //   isLoading,
  //   handleInputChange,
  //   handleSubmit,
  // } = useCompletion({
  //   api: '/api/chat',
  // });

  const id = nanoid()
  const {authenticated, login, logout, user} = useAuth()
  const router = useRouter();

  useEffect(() => {
    console.log(authenticated)
    console.log(user)
    // if(!authenticated) {
    //   router.push('/')
    // }
  }, [])
 
  return (
      <NextThemesProvider>
          <TooltipProvider>
        {/* <form onSubmit={handleSubmit}>
          <label>
            Say something...
            <input
              className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2"
              value={input}
              onChange={handleInputChange}
            />
          </label>
          <output>Completion result: {completion}</output>
          <button type="button" onClick={stop}>
            Stop
          </button>
          <button disabled={isLoading} type="submit">
            Send
          </button>
        </form> */}

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
    )
}