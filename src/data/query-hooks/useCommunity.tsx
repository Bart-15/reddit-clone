import { CreateSubredditValidatorInput } from '@/lib/validators/subreddit';
import { useMutation } from '@tanstack/react-query';
import type { UseMutateFunction } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'



// for when server call is needed
async function createCommunity(input: CreateSubredditValidatorInput): Promise<void> {
    const { data } = await axios.post('/api/subreddi', input);
    return data;
}

export function useCommunity():  UseMutateFunction<
void,
unknown,
CreateSubredditValidatorInput,
unknown
> {
    const router = useRouter()

    const { mutate } = useMutation(
        (input: CreateSubredditValidatorInput) => createCommunity(input),
        {
            onSuccess: (data) => {
                // eslint-disable-next-line no-console
                toast({
                    title: 'Success',
                    description: 'Subreddit Created Succesfully!',
                    variant: 'default',
                });

                return router.push(`/r/${data}`)
            }
        }
    )
    return mutate;
}   

