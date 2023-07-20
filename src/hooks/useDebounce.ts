import {useEffect, useState} from 'react';

const useDebounce = (value: string, timeout:number = 1000): string => {
    const [state, setState] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => setState(value), timeout);

        return () => clearTimeout(handler);
    }, [value, timeout])

    return state;
}

export default useDebounce;