import { CreateSubredditValidatorInput } from '@/lib/validators/subreddit';
import { useMutation } from '@tanstack/react-query';
import type { UseMutateFunction } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'



// for when server call is needed
async function createCommunity(input: CreateSubredditValidatorInput): Promise<void> {
    const { data } = await axios.post('/api/subreddit', input);
    return data;
}

export function useAddCommunity():  UseMutateFunction<
void,
unknown,
CreateSubredditValidatorInput,
unknown
> {
    const router = useRouter()

    const { mutate }  = useMutation(
        (input: CreateSubredditValidatorInput) => createCommunity(input),
        {
            onSuccess: (data) => {
                toast({
                    title: 'Success',
                    description: 'Subreddit Created Succesfully!',
                    variant: 'default',
                });

                return router.push(`/r/${data}`)
            },
            onSettled: (_data, error) => {
                if(error instanceof AxiosError) {
                    if(error.response?.status === 409) {
                        return toast({
                            title: 'Subreddit already exists.',
                            description: 'Please choose different subreddit name',
                            variant: 'destructive'
                        })
                    }
                    if(error.response?.status === 422) {
                        return toast({
                            title: 'Inavlid subreddit name',
                            description: 'Please choose a name between 3 and 21 characters',
                            variant: 'destructive'
                        })
                    }
                }
            }
        }
    )

    return mutate;
}   

