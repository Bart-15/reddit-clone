"use client"
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';  
import { useCommunity } from '../../../data/query-hooks/useCommunity';

const CreateCommunity = () => {
    const [input, setInput] = useState<string>("");
    const router = useRouter();
    const createCommunity = useCommunity();
    
    return ( 
        <div className="container flex items-center h-full max-w-3xl mx-auto">
            <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
                <h1 className="text-xl font-semibold">Create Community</h1>
            <hr className="bg-zinc-500 h-px"/>

            <div>
                <p className="text-lg font-medium">Name</p>
                <p className="text-xs">Community name including capitalization cannot be changed.</p>
                <div className="relative">
                    <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">r/</p>
                    <Input value={input} onChange={(e) => setInput(e.target.value)} className="pl-6 mt-1"/>
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button variant="subtle" onClick={() =>  router.back()}>Cancel</Button>
                <Button onClick={() => createCommunity({name:input})}>Create Community</Button>
            </div>

            </div>
        </div>
    );
}
 
export default CreateCommunity;