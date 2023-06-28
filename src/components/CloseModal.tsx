'use client'

import { useRouter } from "next/navigation";
import { Icons } from "./Icons";
import { Button } from "./ui/Button";

const CloseModal = () => {
    const router = useRouter();

    return ( 
        <Button aria-label='close-modal' variant='subtle' className='h-6 w-6 p-0 rounded-md' onClick={() => router.back()}>
            <Icons.closeIcon className='h-4 w-4'/>
        </Button> 
    );
}

export default CloseModal;