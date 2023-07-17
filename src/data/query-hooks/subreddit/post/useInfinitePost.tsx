import { useRef, useEffect } from 'react';
import { INIFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { useIntersection } from '@mantine/hooks';
import { ExtendedPost } from "@/types/db";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import axios from "axios";
import { keys } from "@/data/react-query/constants";

type UseInfiniteProps = {
    initialPosts: ExtendedPost[], 
    subredditName?: string
}

interface UseInifinitePost {
    data: InfiniteData<ExtendedPost[]> | undefined,
    isFetchingNextPage: boolean
    ref: (element: any) => void
}

async function fetchPosts(pageParam: any, subredditName?: string){
    const query = `/api/posts?limit=${INIFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` + (!!subredditName ? `&subredditName=${subredditName}` : '');
    const { data } = await axios.get(query);
    console.log("dataaa", data);
    return data as ExtendedPost[];
}


function useInfinitePost({ initialPosts,  subredditName }: UseInfiniteProps): UseInifinitePost {

    // const queryClient = useQueryClient();


    const lastPostRef = useRef<HTMLElement>(null);

    const { ref, entry } = useIntersection({
        root: lastPostRef.current,
        threshold: 1
    });

    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
        [keys.infinitePost],
        async ({ pageParam = 1 }) => fetchPosts(pageParam, subredditName),
        {
            refetchOnMount: true,
            getNextPageParam: (_, pages) => {
                return pages.length + 1
            },
            initialData: { pages: [initialPosts], pageParams: [1] },
        }
    )
    
    useEffect(() => {
        if (entry?.isIntersecting) {
            fetchNextPage() // Load more posts when the last post comes into view
        }
    }, [entry, fetchNextPage])

    return {
        data, isFetchingNextPage, ref
    }
}


export default useInfinitePost;