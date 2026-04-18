import { useState, useEffect, useCallback, useRef } from 'react';

export default function useApi(apiFn, params = null, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Store apiFn in a ref so changes to it don't retrigger fetches
  const apiFnRef = useRef(apiFn);
  apiFnRef.current = apiFn;

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = params !== null
        ? await apiFnRef.current(params)
        : await apiFnRef.current();
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  // deps is intentionally spread here; callers control when to re-fetch
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, ...deps]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}
