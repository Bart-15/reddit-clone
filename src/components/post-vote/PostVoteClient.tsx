"use client"

import { VoteType } from '@prisma/client';
import { FC, useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { usePrevious } from '@mantine/hooks';
import { ArrowBigUp, ArrowBigDown } from 'lucide-react';
import { cn } from '@/lib/utils'
import { usePostVote } from '@/data/query-hooks/subreddit';


interface PostVoteClientProps {
    postId: string
    initialVotesAmt: number
    initialVote?: VoteType | null
}

const PostVoteClient: FC<PostVoteClientProps> = ({postId, initialVotesAmt, initialVote}) => {

    const { mutate: vote, votesAmt, currentVote } = usePostVote(initialVote, initialVotesAmt);
    
    return (  
        <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
            <Button onClick={() => vote({postId, voteType:"UP"})} size="sm" variant="ghost" arial-label="upvote">
                <ArrowBigUp 
                className={cn("h-5 w-5 text-zinc-700", {
                    "text-emerald-500 fill-emerald-500" : currentVote === "UP"
                })}
                />
            </Button>

            <p className="text-center py-2 font-medium text-sm text-zinc-900">
                {votesAmt}
            </p>

            <Button onClick={() => vote({postId, voteType:"DOWN"})} size="sm" variant="ghost" arial-label="downvote">
                <ArrowBigDown 
                className={cn("h-5 w-5 text-zinc-700", {
                    "text-red-500 fill-red-500" : currentVote === "DOWN"
                })}
                />
            </Button>
        </div>
    );
}

export default PostVoteClient;