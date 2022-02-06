import useSWR from 'swr';

async function fetcher(args: RequestInfo) {
    const res = await fetch(args);
    if (!res.ok) throw new Error(`${res.statusText} (${res.status})`);
    return await res.json();
}

export default function useQuery<T>(url: string | null) {
    const { data, error, isValidating } = useSWR(url, fetcher);
    return {
        data: isValidating ? undefined : (data as T),
        error: isValidating ? undefined : error,
        isLoading: isValidating,
    };
}