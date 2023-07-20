"use client"

import { useCommentVote } from '@/data/query-hooks/subreddit';
import { cn } from '@/lib/utils';
import { CommentVote, VoteType } from '@prisma/client';
import { ArrowBigDown, ArrowBigUp } from 'lucide-react';
import { FC } from 'react';
import { Button } from './ui/Button';


type PartialVote = Pick<CommentVote, 'type'>

interface CommentVotesProps {
    commentId: string
    initialVotesAmt: number
    initialVote?: PartialVote
}

const CommentVotes: FC<CommentVotesProps> = ({commentId, initialVotesAmt, initialVote}) => {

    const { mutate: vote, votesAmt, currentVote } = useCommentVote(initialVote, initialVotesAmt);
    
    return (  
        <div className="flex gap-1">
            <Button onClick={() => vote({commentId, voteType:"UP"})} size="sm" variant="ghost" arial-label="upvote">
                <ArrowBigUp 
                className={cn("h-5 w-5 text-zinc-700", {
                    "text-emerald-500 fill-emerald-500" : currentVote?.type === "UP"
                })}
                />
            </Button>

            <p className="text-center py-2 font-medium text-sm text-zinc-900">
                {votesAmt}
            </p>

            <Button onClick={() => vote({commentId, voteType:"DOWN"})} size="sm" variant="ghost" arial-label="downvote">
                <ArrowBigDown 
                className={cn("h-5 w-5 text-zinc-700", {
                    "text-red-500 fill-red-500" : currentVote?.type === "DOWN"
                })}
                />
            </Button>
        </div>
    );
}

export default CommentVotes;