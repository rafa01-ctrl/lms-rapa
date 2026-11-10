"use client";
import { useEffect, useState } from 'react';

export type Option = { value: string; label: string };

/**
 * Ambil daftar opsi select dari sebuah endpoint API (mis. /api/subjects, /api/classes).
 * Menghasilkan { value: _id, label: name }.
 */
export function useOptions(endpoint: string) {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    let batal = false;
    fetch(endpoint)
      .then(r => (r.ok ? r.json() : []))
      .then(list => {
        if (batal) return;
        const arr = Array.isArray(list) ? list : [];
        setOptions(
          arr.map((item: any) => ({
            value: String(item._id),
            label: item.name ?? item.title ?? String(item._id),
          }))
        );
      })
      .catch(() => { if (!batal) setOptions([]); });
    return () => { batal = true; };
  }, [endpoint]);

  return options;
}
