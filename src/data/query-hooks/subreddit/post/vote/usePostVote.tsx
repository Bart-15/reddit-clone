import { PostVoteRequest } from "@/lib/validators/vote";
import { useMutation, UseMutateFunction } from "@tanstack/react-query";

import axios from "axios";


async function vote(payload: PostVoteRequest) {
    await axios.patch('/api/subreddit/post/vote', payload)
}


function usePostVote(): UseMutateFunction<void, unknown, PostVoteRequest, unknown> {

    const { mutate } = useMutation(
        (payload: PostVoteRequest) => vote(payload),

        {
            onSuccess: () => {
                console.log("success")
            },
            onError: () => {

            }
        }
        
    )
    
    return mutate;
}

export default usePostVote;