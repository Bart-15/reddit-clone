"use client"

import { FC } from 'react';
import { Button } from './ui/Button';
import { useSubscribe, useUnsubscribe } from '@/data/query-hooks/subreddit';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';


interface SubscribeLeaveToggleProps {
    subredditId: string,
    subredditName: string,
    isSubscribed: boolean
}

interface SubredditPayload extends SubscribeToSubredditPayload {
    subredditName: string
}


const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
    subredditId,
    subredditName,
    isSubscribed
}) => {

    const { mutate: subscribe, isLoading: subLoading} = useSubscribe();
    const { mutate: unsubscribe, isLoading: unsubLoading } = useUnsubscribe();

    const payload: SubredditPayload = { subredditId, subredditName };

    return ( isSubscribed ? (<Button className="w-full mt-1 mb-4" isLoading={unsubLoading} onClick={() => unsubscribe(payload)}>Leave Community</Button>) : (<Button isLoading={subLoading} className="w-full mt-1 mb-4" onClick={() => subscribe(payload)}>Join to post</Button>));
}

export default SubscribeLeaveToggle;