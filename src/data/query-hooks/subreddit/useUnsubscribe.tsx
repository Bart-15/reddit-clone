import { toast } from "@/hooks/use-toast";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { startTransition } from "react";


interface SubredditPayload extends SubscribeToSubredditPayload {
    subredditName: string
}

interface UseunsubscribeProps {
    mutate: UseMutateFunction<void, unknown, SubredditPayload, unknown>,
    isLoading: boolean
}


// begin

async function unsubscribe(payload: SubredditPayload): Promise<void> {
    const { data } = await axios.post('/api/subreddit/unsubscribe', {subredditId: payload.subredditId});
    return data;
}

function useUnsubscribe(): UseunsubscribeProps{
    
    const router = useRouter();

    const { mutate, isLoading } = useMutation(
        (payload: SubredditPayload) => unsubscribe(payload),
        {
            onSuccess: (_data, variables) => {
                startTransition(() => {
                    router.refresh();
                })

                return toast({
                    title: 'Unsubscribe',
                    description: `You are now unsubscribe to r/${variables.subredditName}`,
                    variant: 'default'
                });

            }
        }
    )
    
    return { mutate, isLoading };
}

export default useUnsubscribe;