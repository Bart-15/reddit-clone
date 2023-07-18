"use client"
import { FC } from 'react';
import { Label } from './ui/Label';
import { Textarea } from './ui/TextArea';
import { Button } from './ui/Button';
import { useCreateComment } from '@/data/query-hooks/subreddit';

interface CreateCommentProps {
    postId: string
    replyToId?: string
}

const CreateComment: FC<CreateCommentProps> = ({postId, replyToId}) => {

    const { mutate: createComment, isLoading, input, setInput} = useCreateComment();

    return ( 
        <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your comment</Label>
            <div className="mt-2">
                <Textarea 
                id="comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder='What are your thoughts?'
                />

                <div className="mt-2">
                    <Button 
                    isLoading={isLoading}
                    disabled={!input.length}
                    onClick={
                        () => createComment({
                            postId,
                            text: input,
                            replyToId
                        })
                    }
                    >Post
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CreateComment;