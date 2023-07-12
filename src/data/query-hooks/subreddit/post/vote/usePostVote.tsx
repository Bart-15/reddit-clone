import { PostVoteRequest } from "@/lib/validators/vote";
import { useMutation, UseMutateFunction } from "@tanstack/react-query";
import axios from "axios";


interface UsePostVoteProps {
    mutate: UseMutateFunction<void, unknown, PostVoteRequest, unknown>,
}

async function vote(payload: PostVoteRequest) {
    await axios.patch('/api/subreddit/post/vote', payload);
}


function usePostVote(): UsePostVoteProps {

    const { mutate } = useMutation(
        (payload: PostVoteRequest) => vote(payload),

        {
            onSuccess: () => {

            },
            onError: () => {

            }
        }
        
    )
    
    return { mutate }
}