import { useState } from 'react';
import { useMutation, UseMutateFunction } from "@tanstack/react-query";
import { CommentRequest } from '@/lib/validators/comment';
import axios from 'axios';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface UseCreatCommentProps {
    mutate: UseMutateFunction<void, unknown, CommentRequest, unknown>,
    isLoading: boolean
    input: string
    setInput: (value: string) => void;
}

async function createComment(payload: CommentRequest) {
    const { data } = await axios.patch(`/api/subreddit/post/comment`, payload);
    return data;
}


function useCreateComment(): UseCreatCommentProps {
    const [input, setInput] = useState<string>('');
    const router = useRouter();

    const { mutate, isLoading } = useMutation(
        (payload:CommentRequest) => createComment(payload),
        {
            onSuccess: (_data, variables) => {
                router.refresh();
                setInput('')
            },
            onError: () => {
                return toast({
                    title: 'There was a problem',
                    description: 'Something went wrong, please try again.',
                    variant: 'destructive'
                })
            }  
        }
    ) 

    return {
        mutate,
        isLoading,
        input,
        setInput
    }
};

export default useCreateComment;