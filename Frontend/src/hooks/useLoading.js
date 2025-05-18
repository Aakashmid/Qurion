import { useState, useCallback } from 'react';

export default function useLoading(initial = false) {
    const [loading, setLoading] = useState(initial);

    // Optionally, wrap setLoading for convenience
    const startLoading = useCallback(() => setLoading(true), []);
    const stopLoading = useCallback(() => setLoading(false), []);

    return { loading, setLoading, startLoading, stopLoading };
}