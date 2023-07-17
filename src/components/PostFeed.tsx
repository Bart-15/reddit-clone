"use client";
import { ExtendedPost } from '@/types/db';
import { FC } from 'react';
import { Loader2 } from 'lucide-react'
import { useInfinitePost } from '@/data/query-hooks/subreddit';
import { useSession } from 'next-auth/react';
import Post from './Post';

interface PostFeedProps {
    initialPosts: ExtendedPost[],
    subredditName?: string
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {

    const { data: session } = useSession();

    const { data, isFetchingNextPage, ref } = useInfinitePost({initialPosts, subredditName})
    
    const posts = data?.pages.flatMap((page) => page);

    return ( 
        <ul className="flex flex-col col-span-2 space-y-6">
            {
                posts?.map((post, idx) => {
                    const votesAmt = post.votes.reduce((acc, vote) => {
                        if(vote.type === 'UP') return acc + 1
                        if(vote.type === 'DOWN') return acc -1
                        return acc;
                    }, 0);

                    // @ts-ignore
                    const currentVote = post.votes.find((vote) => vote.userId === session?.user.id);

                    if(idx === posts.length - 1) {
                        return (
                            <li className="mt-6" key={post.id} ref={ref}>
                                <Post currentVote={currentVote} votesAmt={votesAmt} commentAmt={post.comments.length} post={post} subredditName={post.subreddit.name} />
                            </li>
                        )
                    } else {
                        return <Post currentVote={currentVote} votesAmt={votesAmt} commentAmt={post.comments.length} post={post} subredditName={post.subreddit.name} key={post.id} />
                    }
                })
            }
            { isFetchingNextPage && (
                <li className='flex justify-center'>
                <Loader2 className='w-6 h-6 text-zinc-500 animate-spin' />
                </li>
            )}
        </ul>
    );
}

export default PostFeed;