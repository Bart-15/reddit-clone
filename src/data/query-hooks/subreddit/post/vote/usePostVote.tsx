
import { useState, useEffect } from 'react';
import { VoteType } from '@prisma/client';
import { PostVoteRequest } from "@/lib/validators/vote";
import { useMutation, UseMutateFunction } from "@tanstack/react-query";
import { usePrevious } from '@mantine/hooks';

import axios from "axios";
import { toast, useToast } from '@/hooks/use-toast';

interface UseVoteProps {
    mutate: UseMutateFunction<void, unknown, PostVoteRequest, unknown>,
    votesAmt: number
    currentVote: VoteType | null | undefined
    prevVote?: VoteType | null | undefined
}


async function vote(payload: PostVoteRequest) {
    await axios.patch('/api/subreddit/post/vote', payload)
}

function usePostVote(
    initialVote: VoteType | null | undefined,
    initialVotesAmt: number,
): UseVoteProps {
    

    const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
    const [currentVote, setCurrentVote] = useState(initialVote);
    const prevVote = usePrevious(currentVote);
    
    useEffect(() => {
        setCurrentVote(initialVote);
    }, [initialVote]);

    const { mutate } = useMutation(
        (payload: PostVoteRequest) => vote(payload),
        {
            onMutate: (data) => {
                const { voteType } = data;
                if(currentVote === voteType) {
                    setCurrentVote(undefined);
                    if(voteType === "UP") setVotesAmt((prev) => prev - 1)
                    else if (voteType === "DOWN") setVotesAmt((prev) => prev + 1)
                } else {
                    setCurrentVote(voteType);
                    if(voteType === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1))
                    else if (voteType === "DOWN") setVotesAmt((prev) => prev - (currentVote ? 2 : 1))
                }
            },
            // onError: (err, data) => {
            //     if(data.voteType === "UP") setVotesAmt((prev) => prev - 1)
            //     else setVotesAmt((prev) => prev + 1);

            //     setCurrentVote(prevVote);
            // }
            onSettled: (data, error, variables, context) => {
                //if theres an erro
                if(error) {
                    const { voteType } = variables;

                    if(voteType === "UP") setVotesAmt((prev) => prev - 1)
                    else setVotesAmt((prev) => prev + 1);

                    setCurrentVote(prevVote);

                    return toast({
                        title: 'Ooops, something went wrong',
                        description: 'Your vote was not registered, please try again later',
                        variant: 'destructive',

                    })
                }
            },
        }
        )
    
    return { mutate, votesAmt, currentVote, prevVote }
}

export default usePostVote;


