
import { PostVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from '@mantine/hooks';
import { VoteType } from '@prisma/client';
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from 'react';

import { toast } from '@/hooks/use-toast';
import axios, { AxiosError } from "axios";

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

            onSettled: (data, error, variables, context) => {
                if(error instanceof AxiosError) {
                    if(error?.response?.status !== 401) {
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

                    const { voteType } = variables;
    
                    if(voteType === "UP") setVotesAmt((prev) => prev - 1)
                    else setVotesAmt((prev) => prev + 1);

                    setCurrentVote(prevVote);
                
                }
            },
        }
        )
    
    return { mutate, votesAmt, currentVote, prevVote }
}

export default usePostVote;


