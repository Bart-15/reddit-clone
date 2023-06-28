/* eslint-disable no-console */
import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';


function queryErrHandler(error: unknown) {
    // if(error instanceof AxiosError) {
    //     if(error.response?.status === 409){
    //         return toast({
    //             title: 'Ooops, failed ❌',
    //             description: error.response.data,
    //             variant: 'destructive',
    //         });
    //         ;
    //     }
    // }
    const title =
    error instanceof Error ? error.message : 'error connecting to server';
    toast({
        title: title,
        description: 'Ooops, something went wrong',
        variant: 'destructive',
    });
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