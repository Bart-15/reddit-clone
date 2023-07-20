import {object, string, z, any} from "zod";


export const PostVoteValidator = object({
    postId: string(),
    voteType: z.enum(['UP', 'DOWN'])
})

export const CommentVoteValidator = object({
    commentId: string(),
    voteType: z.enum(['UP', 'DOWN'])
})


export type PostVoteRequest = z.infer<typeof PostVoteValidator>
export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>

