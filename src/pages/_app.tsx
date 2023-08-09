import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { ModalProvider } from '@/components/ui/modal.context'
import { PromptProvider } from '@/components/prompt/prompt.context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <PromptProvider>
        <Component {...pageProps} />
        <ToastContainer />
      </PromptProvider>
    </ModalProvider>
  )
}