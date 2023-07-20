"use client";

import { UserNameRequest, UserNameValidator } from '@/lib/validators/username';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Label } from './ui/Label';
import { Button } from './ui/Button';
import useChangeUserName from '@/data/query-hooks/settings/useChangeUsername';

interface UserNameFormProps {
    user: Pick<User, 'id' | 'username'>
}


const UserNameForm: FC<UserNameFormProps> = ({user}) => {

    const {mutate: updateUsername, isSuccess} = useChangeUserName();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<UserNameRequest>({
        resolver: zodResolver(UserNameValidator),
        defaultValues: {
            name: user?.username || ''
        },
        mode: "onChange"
    })

    async function updateProfile(data:UserNameRequest) {
        const payload = {
            name: data.name,
        }

        updateUsername(payload)
        //Mutation
    }

    return ( 
        <form onSubmit={handleSubmit((data) => updateProfile(data))}>
            <Card>
                <CardHeader>
                    <CardTitle>Your username</CardTitle>
                    <CardDescription>Please enter a display name you are comfortable with</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative grid gap-1">
                        <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
                            <span className="text-sm text-zinc-400">u/</span>
                        </div>
                        <Label className="sr-only" htmlFor="name">Name</Label>
                        <Input id="name" className="w-[400px pl-6" size={32} {...register('name')}/>
                        { errors.name && (
                            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
                        )}
                    </div>
                </CardContent>

                <CardFooter>
                    <Button type="submit">Change Name</Button>
                </CardFooter>
            </Card>
        </form>
    );
}

export default UserNameForm;