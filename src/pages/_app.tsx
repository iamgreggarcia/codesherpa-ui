import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { ModalProvider } from '@/components/ui/modal.context'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ModalProvider>
      <Component {...pageProps} />
      <ToastContainer />
    </ModalProvider>
  )
}