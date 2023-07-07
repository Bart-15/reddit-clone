import {object, string, z} from "zod";

export const SubredditValidator = object({
    name: string().min(3, {message: "Please choose a name between 3 and 21 letters."}).max(21),
});

export const SubredditSubsciptionValidator = object({
    subredditId: string()
});

export type CreateSubredditValidatorInput = z.infer<typeof SubredditValidator>;
export type SubscribeToSubredditPayload = z.infer<typeof SubredditSubsciptionValidator>;

