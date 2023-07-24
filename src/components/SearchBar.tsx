"use client"
import { FC, useEffect, useRef } from 'react';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList, CommandEmpty } from './ui/Command';
import { useSearchQuery } from '@/data/query-hooks/subreddit';
import { usePathname, useRouter } from 'next/navigation';
import { Users } from 'lucide-react';
import { useOnClickOutside } from '../hooks/use-on-click-outside';
interface SearchBarProps {

}

const SearchBar: FC<SearchBarProps> = ({}) => {

    const router = useRouter();
    const { data: results, input, setInput, isFetched } = useSearchQuery();

    const commandRef = useRef<HTMLDivElement>(null);
    const pathName = usePathname();

    useOnClickOutside(commandRef, () => {
        setInput('');
    })

    useEffect(() => {
        setInput('')
    }, [pathName])

    return ( 
        <Command ref={commandRef} className="relative rounded-lg border max-w-lg z-50 overflow-visible">
            <CommandInput
            value={input}
            onValueChange={(text) => {
                setInput(text);
            }}
            className="outline-none border-none focus:outline-none focus:border-none ring-0"
            placeholder='Search communities'
            />
            {
                input.length > 0 ? (
                    <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
                    { isFetched && <CommandEmpty>No results found.</CommandEmpty>}
                    {
                        (results?.length ?? 0) > 0 ? (
                            <CommandGroup heading="communities">
                                {
                                    results?.map((subreddit) => (
                                        <CommandItem 
                                        key={subreddit.id}
                                        value={subreddit.name}
                                        onSelect={(e) => router.push(`/r/${e}`)}
                                        >
                                        <Users className="mr-2 h-4 w-4"/>
                                        <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                                        </CommandItem>
                                    ))
                                }
                            </CommandGroup>
                        ) : null
                    }
                    </CommandList>
                ) : null
            }
        </Command>
    );
}

export default SearchBar;