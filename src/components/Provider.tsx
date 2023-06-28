"use client"
import { queryClient } from "@/data/react-query/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
    <QueryClientProvider client={queryClient}>
        { children }
        <ReactQueryDevtools initialIsOpen={false}/>
    </QueryClientProvider>)
}

export default Providers;