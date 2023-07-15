import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from 'zod';
import { PostVoteValidator } from "@/lib/validators/vote";
import type { CachedPost } from "@/types/redis";
import { redis } from "@/lib/redis";
import { NextResponse } from "next/server";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: Request) {

    try {
        const body = await req.json();

        const { postId, voteType } = PostVoteValidator.parse(body);

        const session = await getAuthSession();

        if(!session?.user) return NextResponse.json({message: 'Unathorized' }, {status: 401})
        
        const post = await db.post.findUnique({
            where : {
                id: postId
            },
            include: {
                author: true,
                votes: true
            }
        });

        const existingVote = await db.vote.findFirst({
            where: {
                userId: session.user.id,
                postId
            }
        });
        
        if(!post) return NextResponse.json({message: 'Post not found', }, {status: 404})


        if (existingVote) {
            // if vote type is the same as existing vote, delete the vote
            if (existingVote.type === voteType) {
                await db.vote.delete({
                    where: {
                    userId_postId: {
                        postId,
                        userId: session.user.id,
                    },
                },
            })
    
            // Recount the votes
            const votesAmt = post.votes.reduce((acc, vote) => {
                if (vote.type === 'UP') return acc + 1
                if (vote.type === 'DOWN') return acc - 1
                return acc
            }, 0)
    
            if (votesAmt >= CACHE_AFTER_UPVOTES) {
                const cachePayload: CachedPost = {
                    authorUsername: post.author.username ?? '',
                    content: JSON.stringify(post.content),
                    id: post.id,
                    title: post.title,
                    currentVote: null,
                    createdAt: post.createdAt,
                }
    
                await redis.hset(`post:${postId}`, cachePayload) // Store the post data as a hash
            }
    
            return NextResponse.json({message: 'Ok', })
        }
    
            // if vote type is different, update the vote
            await db.vote.update({
                where: {
                    userId_postId: {
                    postId,
                    userId: session.user.id,
                    },
                },
                data: {
                    type: voteType,
                },
            })
    
            // Recount the votes
            const votesAmt = post.votes.reduce((acc, vote) => {
                if (vote.type === 'UP') return acc + 1
                if (vote.type === 'DOWN') return acc - 1
                return acc
            }, 0)
    
            if (votesAmt >= CACHE_AFTER_UPVOTES) {
            const cachePayload: CachedPost = {
                authorUsername: post.author.username ?? '',
                content: JSON.stringify(post.content),
                id: post.id,
                title: post.title,
                currentVote: voteType,
                createdAt: post.createdAt,
            }
    
            await redis.hset(`post:${postId}`, cachePayload) // Store the post data as a hash
            }
    
            return NextResponse.json({message: 'Ok', })
        }
    
        // if no existing vote, create a new vote
        await db.vote.create({
            data: {
            type: voteType,
            userId: session.user.id,
            postId,
            },
        })
    
        // Recount the votes
        const votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type === 'UP') return acc + 1
            if (vote.type === 'DOWN') return acc - 1
            return acc
        }, 0)
    
        if (votesAmt >= CACHE_AFTER_UPVOTES) {
            const cachePayload: CachedPost = {
                authorUsername: post.author.username ?? '',
                content: JSON.stringify(post.content),
                id: post.id,
                title: post.title,
                currentVote: voteType,
                createdAt: post.createdAt,
            }
    
            await redis.hset(`post:${postId}`, cachePayload) // Store the post data as a hash
        }
    
        return NextResponse.json({message: 'Ok' })
        
    }catch(error) {
        if(error instanceof z.ZodError) {
            return NextResponse.json({message: 'Error', error: error.message }, {status: 422})
        }
        return NextResponse.json({message: "Could not register your vote, please try again" }, {status: 500})
    }   
}