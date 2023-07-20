import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Prisma, Subreddit } from '@prisma/client';
import axios from 'axios';
import useDebounce from '@/hooks/useDebounce';

type SearchDataResult = Subreddit & {
    _count: Prisma.SubredditCountOutputType;
}

async function search(input:string) {
    const { data } = await axios.get(`/api/search?q=${input}`); 
    return data as (SearchDataResult[])
}


function useSearchQuery()  {
    const [input, setInput] = useState<string>("");

    const debounceInput = useDebounce(input, 500);

    const { data, refetch, isFetched } = useQuery({
        queryFn: () => search(debounceInput),
        queryKey: ['search-query'],
        enabled: false
    });
    
    useEffect(() => {
        if(debounceInput) {
            refetch();
        }
    }, [debounceInput, refetch])


    return { data, input, setInput, refetch, isFetched };
}

export default useSearchQuery;