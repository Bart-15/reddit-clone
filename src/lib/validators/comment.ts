import {object, string, z} from "zod";

export const CommentValidator = object({
  postId: string(),
  text: string(),
  replyToId: string().optional(),
});

export type CommentRequest = z.infer<typeof CommentValidator>;
