import {object, string, z, any} from "zod";


export const PostValidator = object({
    title: string().min(3, {message: "Title must be longer than 3 characters"}).max(128, {message: "Title must be at least 128 characters"}),
    subredditId: string(),
    content: any()
})

export type PostInputValidator = z.infer<typeof PostValidator>