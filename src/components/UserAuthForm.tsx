"use client";
import { FC, useState } from 'react';
import { Button } from './ui/Button';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';
import { Icons } from './Icons';
import { useToast } from '@/hooks/use-toast';

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({className, ...props}) => {

    const [isLoading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();

    async function loginWithGoogle(){
        setLoading(true); 

        try {
            await signIn('google');
        }catch(error) {
            // toas notification
            toast({
                title:'Ooops, something went wrong.',
                description: 'There was an error logging in with Gooogle',
                variant: 'destructive'
            })
        } finally {
            setLoading(false);
        }
    }

    return ( 
        <div className={cn('flex justify-center', className)} {...props}>
            <Button onClick={loginWithGoogle} isLoading={isLoading} size='sm' className="w-full">{ isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}Google</Button>
        </div>
    );
}

export default UserAuthForm;