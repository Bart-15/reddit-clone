import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { NextResponse } from "next/server";
import { z } from 'zod';

export async function PATCH(req: Request) {

    try {
        const body = await req.json();

        const { commentId,  voteType } = CommentVoteValidator.parse(body);

        const session = await getAuthSession();

        if(!session?.user) return NextResponse.json({message: 'Unathorized' }, {status: 401})
        

        const existingVote = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId
            }
        });
        
        if (existingVote) {
            // if vote type is the same as existing vote, delete the vote
            if (existingVote.type === voteType) {
                await db.commentVote.delete({
                    where: {
                    userId_commentId: {
                        commentId,
                        userId: session.user.id,
                    },
                },
            })
        
                return NextResponse.json({message: 'Ok', })
            } else {
                // if vote type is different, update the vote
                await db.commentVote.update({
                    where: {
                        userId_commentId: {
                        commentId,
                        userId: session.user.id,
                        },
                    },
                    data: {
                        type: voteType,
                    },
                })
        
        
                return NextResponse.json({message: 'Ok', })
            }
        
        }
    
        // if no existing vote, create a new vote
        await db.commentVote.create({
            data: {
            type: voteType,
            userId: session.user.id,
            commentId,
            },
        })
    
    
        return NextResponse.json({message: 'Ok' })
        
    }catch(error) {
        if(error instanceof z.ZodError) {
            return NextResponse.json({message: 'Error', error: error.message }, {status: 422})
        }
        return NextResponse.json({message: "Could not register your vote, please try again" }, {status: 500})
    }   
}