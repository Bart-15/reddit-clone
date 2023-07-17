import { keys } from "@/data/react-query/constants";
import { toast } from "@/hooks/use-toast";
import { PostInputValidator } from "@/lib/validators/post";
import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface UseCreatePost {
    mutate: UseMutateFunction<void, unknown, PostInputValidator, unknown>,
    isLoading: boolean
}


async function createPost(payload: PostInputValidator): Promise<void> {
    const { data } = await axios.post('/api/subreddit/post/create', payload);
    return data;
}

function useCreatePost(): UseCreatePost {

    const pathname = usePathname();
    const router = useRouter();

    const queryClient = useQueryClient();
    
    const { mutate, isLoading } = useMutation(
        (payload: PostInputValidator) => createPost(payload),
        {
            onSuccess: (_data, variables) => {
                // todo
                const newPathname = pathname.split('/').slice(0, -1).join('/'); 
                router.push(newPathname);

                router.refresh();

                queryClient.invalidateQueries({ queryKey: [keys.infinitePost] });
                
                return toast({
                    description: 'Your post has been published!'
                });
                
            },
            onError:(_error) =>{ 
                toast({
                    title: 'Ooops, something went wrong.',
                    description: 'Your post was not published, please try again later.',
                    variant: 'destructive'
                })
            }
        }
    );
    
    return { mutate, isLoading };
}

export default useCreatePost;