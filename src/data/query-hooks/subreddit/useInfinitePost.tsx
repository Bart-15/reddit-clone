import { INIFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { ExtendedPost } from "@/types/db";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import axios from "axios";

type UseInfiniteProps = {
    initialPosts: ExtendedPost[], 
    subredditName: string
}

interface UseInifinitePost {
    data: InfiniteData<ExtendedPost[]> | undefined,
    fetchNextPage: () => void,
    isFetchingNextPage: boolean
}


function useInfinitePost({ initialPosts, subredditName }: UseInfiniteProps): UseInifinitePost {
    const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
        ["infinite-posts"],
        async ({ pageParam = 0}) => {
            const query = `/api/posts?limit=${INIFINITE_SCROLLING_PAGINATION_RESULTS}&page=${pageParam}` + (!!subredditName ? `&subredditName=${subredditName}` : '');
            const { data } = await axios.get(query)
            return data as ExtendedPost[];
        },
        {
            getNextPageParam: (_, pages) => pages.length + 1,
            initialData: {
                pages: [initialPosts], pageParams: [1]
            }
        }
    )

    return {
        data, fetchNextPage, isFetchingNextPage
    }
}


export default useInfinitePost;