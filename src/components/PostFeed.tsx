"use client";
import { ExtendedPost } from '@/types/db';
import { FC, useRef } from 'react';
import { useIntersection } from '@mantine/hooks';
import { useInfinitePost } from '@/data/query-hooks/subreddit';
import { useSession } from 'next-auth/react';
import Post from './Post';

interface PostFeedProps {
    initialPosts: ExtendedPost[],
    subredditName: string
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {

    const lastPostRef = useRef<HTMLElement>(null);

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    });

    const { data: session } = useSession();

    const { data, fetchNextPage, isFetchingNextPage } = useInfinitePost({initialPosts, subredditName})
    
    const posts = data?.pages.flatMap((page) => page) ?? initialPosts;


    return ( 
        <ul className="flex flex-col col-span-2 space-y-6">
            {
                posts.map((post, idx) => {
                    const votesAmt = post.votes.reduce((acc, vote) => {
                        if(vote.type === 'UP') return acc + 1
                        if(vote.type === 'DOWN') return acc -1
                    }, 0);

                    const currentVote = post.votes.find((vote) => vote.userId === session?.user.id);

                    if(idx === posts.length - 1) {
                        return (
                            <li key={post.id} ref={ref}>
                                <Post />
                            </li>
                        )
                    } else {
                        return <Post key={post.id} />
                    }
                })
            }
        </ul>
    );
}

export default PostFeed;