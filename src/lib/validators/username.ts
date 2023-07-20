import { object, string, z } from "zod";

export const UserNameValidator = object({
    name: string().min(3).max(32).regex(/^[a-zA-Z0-9_]+$/)
})


export type UserNameRequest = z.infer<typeof UserNameValidator>