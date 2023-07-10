import { toast } from "@/hooks/use-toast";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { startTransition } from "react";


interface SubredditPayload extends SubscribeToSubredditPayload {
    subredditName: string
}

interface UseSubsribedProps {
    mutate: UseMutateFunction<void, unknown, SubredditPayload, unknown>,
    isLoading: boolean
}

async function subscribe(payload: SubredditPayload): Promise<void> {
    const { data } = await axios.post('/api/subreddit/subscribe', {subredditId: payload.subredditId});
    return data;
}

function useSubsribe(): UseSubsribedProps{
    
    const router = useRouter();

    const { mutate, isLoading } = useMutation(
        (payload: SubredditPayload) => subscribe(payload),
        {
            onSuccess: (_data, variables) => {
                startTransition(() => {
                    router.refresh();
                })

                toast({
                    title: 'Subscribed',
                    description: `You are now subscribed to r/${variables.subredditName}`,
                    variant: 'default'
                });

            },
            onError: () => {
                return toast({
                    title: 'There was a problem',
                    description: 'Something went wrong, please try again later',
                    variant: 'default'
                })
            }
        }
    )
    
    return { mutate, isLoading };
}

export default useSubsribe;