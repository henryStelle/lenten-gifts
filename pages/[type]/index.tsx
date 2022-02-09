import React from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();
    React.useEffect(() => {
        if (router.query.type) router.replace(`${router.asPath}/view`);
    }, [router]);
    return null;
}
