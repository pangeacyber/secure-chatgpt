import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      Open source AI chatbot built with 💜 using {' '}
      <ExternalLink href="https://nextjs.org">Next.js</ExternalLink>, {' '}
      <ExternalLink href="https://pangea.cloud/?utm_source=demos&utm_medium=footer&utm_campaign=secure-chatgpt">
        Pangea
      </ExternalLink> and {' '}
      {process.env.NEXT_PUBLIC_CHOOSE_CHATBOT == "bedrock-llama" ?
        <ExternalLink href="https://aws.amazon.com/bedrock/?ref=pangea.cloud">
          AWS Bedrock
        </ExternalLink>
        :
        <ExternalLink href="https://openai.com/?ref=pangea.cloud">
          OpenAI
        </ExternalLink>
      }
      .
    </p>
  )
}
