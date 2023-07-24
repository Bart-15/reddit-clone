import { toast } from '@/hooks/use-toast';
import { UserNameRequest } from '@/lib/validators/username';
import { UseMutateFunction, useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

interface UseChangeUsernameProps {
    mutate: UseMutateFunction<void, unknown, UserNameRequest, unknown>,
    isSuccess: boolean
}

async function updateUsername(payload: UserNameRequest) {
    await axios.patch('/api/username', payload);
}


function useChangeUserName(): UseChangeUsernameProps {

    const router = useRouter()

    const { mutate, isSuccess } = useMutation(
        (payload: UserNameRequest) => updateUsername(payload),
        {
            onSuccess: () => {
                toast({
                    description: 'Your username has been updated'
                });
                router.refresh();
            },
            onError: (err) => {
                if(err instanceof AxiosError) {
                    if(err.response?.status === 409) {
                        return toast({
                            title:' Username is already taken',
                            description: 'Please choose diferrent username',
                            variant: 'destructive'
                        })
                    }
                }

                return toast({
                    title: 'There was an error',
                    description: 'Could not update username.',
                    variant: 'destructive'
                })
            }
        }
    )


    return {
        mutate,
        isSuccess
    }
}

export default useChangeUserName