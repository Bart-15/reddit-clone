import { useState } from 'react';
import { useMutation, UseMutateFunction } from "@tanstack/react-query";
import { CommentRequest } from '@/lib/validators/comment';
import axios, { AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface UseCreatCommentProps {
    mutate: UseMutateFunction<void, unknown, CommentRequest, unknown>,
    isLoading: boolean
    input: string
    setInput: (value: string) => void;
    isReplying: boolean
    setIsReplying: (value: boolean) => void;
}

async function createComment(payload: CommentRequest) {
    const { data } = await axios.patch(`/api/subreddit/post/comment`, payload);
    return data;
}


function useCreateComment(): UseCreatCommentProps {
    const [input, setInput] = useState<string>('');
    const [isReplying, setIsReplying] = useState<boolean>(false);

    const router = useRouter();

    const { mutate, isLoading } = useMutation(
        (payload:CommentRequest) => createComment(payload),
        {
            onSuccess: (_data, variables) => {
                router.refresh();
                setInput('');
                setIsReplying(false)
            },
            onError: (error) => {
                if(error instanceof AxiosError) {
                    if(error?.response?.status !== 401) {
                        return toast({
                            title: 'Something went wrong',
                            description: 'Comment wasnt posted successfully, please try again',
                            variant: 'destructive'
                        })
                    }
                }
            }  
        }
    ) 

    return {
        mutate,
        isLoading,
        input,
        setInput,
        isReplying,
        setIsReplying
    }
};

export default useCreateComment;