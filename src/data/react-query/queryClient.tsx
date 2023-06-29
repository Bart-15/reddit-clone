/* eslint-disable no-console */
import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/Button';


function queryErrHandler(error: unknown) {
    
    if(error instanceof AxiosError) {
        const errMsg = error.message ? error.message : 'Error connecting to server'
        console.log('hello', error.message);
        if(error.response?.status === 401) {
            const { dismiss } = toast({
                title: 'Login required',
                description: 'You need to be loged in to do that',
                variant: 'destructive',
                action: (
                    <Link
                    href="/sign-in"
                    onClick={() => dismiss()}
                    className={buttonVariants({variant:'outline'})}>
                    Login
                    </Link>
                )
            })
        }
        
        toast({
            title: 'Ooops, something went wrong',
            description: errMsg,
            variant: 'destructive',
        });
    }

}

export const queryClient = new QueryClient({
    defaultOptions : {
        queries: {
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
        mutations: {
            onError: queryErrHandler,
        },
    }
}) // soon, will edit the global config