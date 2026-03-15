'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { useState } from 'react';

export default function Providers({ children, session }) {
  // Create QueryClient per-render to avoid shared state between SSR requests
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime:           1000 * 60 * 5,  // 5 min
            gcTime:              1000 * 60 * 10, // 10 min
            retry:               2,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  );

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}

          {/* Toast — available everywhere including /admin dashboard */}
          <Toaster
            position="top-right"
            richColors
            closeButton
            expand={false}
            duration={4000}
            toastOptions={{
              classNames: {
                toast:       'font-sans text-sm',
                title:       'font-semibold',
                description: 'text-xs opacity-80',
              },
            }}
          />
        </ThemeProvider>

        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
}