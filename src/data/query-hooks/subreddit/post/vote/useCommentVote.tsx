
import { CommentVoteRequest, PostVoteRequest } from "@/lib/validators/vote";
import { usePrevious } from '@mantine/hooks';
import { CommentVote, VoteType } from '@prisma/client';
import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from 'react';

import { toast } from '@/hooks/use-toast';
import axios, { AxiosError } from "axios";

type PartialVote = Pick<CommentVote, 'type'>


interface UseVoteProps {
    mutate: UseMutateFunction<void, unknown, CommentVoteRequest, unknown>,
    votesAmt: number
    currentVote?: PartialVote
    prevVote?: PartialVote
}


async function vote(payload: CommentVoteRequest) {
    await axios.patch('/api/subreddit/post/comment/vote', payload)
}

function useCommentVote(
    initialVote: PartialVote | undefined,
    initialVotesAmt: number,
): UseVoteProps {
    

    const [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt);
    const [currentVote, setCurrentVote] = useState<PartialVote | undefined>(initialVote);
    const prevVote = usePrevious(currentVote);
    
    useEffect(() => {
        setCurrentVote(initialVote);
    }, [initialVote]);

    const { mutate } = useMutation(
        (payload: CommentVoteRequest) => vote(payload),
        {
            onMutate: (data) => {
                const { voteType } = data;
                if(currentVote?.type === voteType) {
                    setCurrentVote(undefined);
                    if(voteType === "UP") setVotesAmt((prev) => prev - 1)
                    else if (voteType === "DOWN") setVotesAmt((prev) => prev + 1)
                } else {
                    setCurrentVote({type: voteType});
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

export default useCommentVote;


