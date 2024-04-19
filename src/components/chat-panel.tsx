import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import axios from 'axios';
import { Switch } from './ui/switch'
import { Label } from './ui/label'
import { useState } from 'react'
import { useToast } from './ui/use-toast'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string
  user?: Object
  logout?: any
  redactStatus: boolean
  setRedactStatus: any
  auditLogStatus: boolean
  setAuditLogStatus: any
}

export function ChatPanel({
  id,
  user,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  logout,
  redactStatus,
  setRedactStatus,
  auditLogStatus,
  setAuditLogStatus
}: ChatPanelProps) {
  const { toast } = useToast()

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            onSubmit={async value => {
              console.log(auditLogStatus, redactStatus)
              if(auditLogStatus) {
                await axios.post('/api/audit-log', {
                  message: value,
                  user_id: (user as any).email as string,
                  session_id: id,
                  actor: 'user'
                }).catch(error => {
                  if(error.response.status === 403) {
                    toast({
                      title: "Error: No PANGEA_TOKEN",
                      description: "Please set PANGEA_TOKEN in server environment",
                      color: "#E54D2E"
                    })
                  } else {
                    toast({
                      title: "Error: Unable to send Pangea Requests",
                      description: "Please reach out on the pangea.cloud slack if the error persists"
                    })
                  }
                })
              }

              let outputMessage = "";
              if(redactStatus) {
                const redactedText = await axios.post('/api/redact', {
                  message: value
                }).catch(error => {
                  if(error.response.status === 403) {
                    toast({
                      title: "Error: No PANGEA_TOKEN",
                      description: "Please set PANGEA_TOKEN in server environment",
                      color: "#E54D2E"
                    })
                  } else {
                    toast({
                      title: "Error: Unable to send Pangea Requests",
                      description: "Please reach out on the pangea.cloud slack if the error persists"
                    })
                  }
                })

                outputMessage = redactedText?.data.message;

              } else {
                outputMessage = value;
              }

              await append({
                id,
                content: outputMessage,
                role: 'user'
              })
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          <div className="flex flex-row justify-between">
            <div className=''>
              <Switch id="redact-status" onCheckedChange={e => {
                setRedactStatus(!redactStatus)
              }} />
              <Label htmlFor="redact-status">Redact</Label>
            </div>

            <div>
            <Switch id="audit-log-status" onCheckedChange={e => {
                setAuditLogStatus(!auditLogStatus)
              }} />
              <Label htmlFor="airplane-mode">Audit Log</Label>
            </div>

            {/* <div>
              <button className='bg-red-500 p-2 text-sm rounded-md' onClick={async () => {
                await logout();
                window.location.reload();
              }}>Logout</button>
            </div> */}
          </div>
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
