import { z } from 'zod/v4';
import { useEffect, useState } from 'react';
import type { FetchState } from '../types/fetch-state';

export function useFetch<T>(url: string, schema: z.ZodType<T>): FetchState<T> {

    const [state, setState] = useState<FetchState<T>>({ status: 'idle' });

    useEffect(() => {
        // AbortController lets us cancel an in-flight request if the component
        // unmounts or the URL changes before the fetch resolves. Without it,
        // React would warn about "state update on an unmounted component" and
        // we could overwrite fresh data with a stale response.
        const controller = new AbortController();
        setState({ status: 'loading' });

        // CONCEPT: Typing async functions
        // The `: Promise<T>` annotation on `response.json()` below isn't there
        // by default — `response.json()` returns `Promise<any>` because the API
        // can't actually know your data shape. We CAST it to `T` to plug it
        // into the generic. This is a controlled, intentional cast — the only
        // unsafe spot, and it lives in one place (here) instead of every caller.

        const run = async (): Promise<void> => {
            try {
                const response = await fetch(url, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} - ${response.statusText}`);
                }

                const resData = await response.json();

                const result = schema.safeParse(resData); 

                if (!result.success) {
                    throw new Error(z.prettifyError(result.error)); 
                }

                setState({ status: 'success', data: result.data }); 

            } catch (err) {
                // AbortError fires on cleanup — that's expected, not a real error.
                if (err instanceof DOMException && err.name === 'AbortError') return;
                const message = err instanceof Error ? err.message : 'Unknown error';
                setState({ status: 'error', error: message });
            }
        };

        void run();
        return () => controller.abort();

    }, [url]);

    return state;
};