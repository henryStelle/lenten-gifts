import useSWR from 'swr';

async function fetcher(args: RequestInfo, options: RequestInit = {}) {
    const res = await fetch(args, options);
    if (!res.ok) throw new Error(`${res.statusText} (${res.status})`);
    return await res.json();
}

export default function useQuery<T>(
    url: string | null,
    options: RequestInit = {}
) {
    const { data, error, isValidating, mutate } = useSWR(url, (url) =>
        fetcher(url, options)
    );
    return {
        data: isValidating ? undefined : (data as T),
        error: isValidating ? undefined : error,
        isLoading: isValidating,
        mutate,
    };
}
