import type { Theme } from '@/types';
import { useCallback, useEffect, useState } from 'react';

export function UseTheme() {
  const [theme, set_theme] = useState<Theme>('system');
  const [resolved_theme, set_resolved_theme] = useState<'light' | 'dark'>(
    'light'
  );

  const GetSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'light';
  }, []);

  const UpdateResolvedTheme = useCallback(
    (current_theme: Theme) => {
      if (current_theme === 'system') {
        set_resolved_theme(GetSystemTheme());
      } else {
        set_resolved_theme(current_theme);
      }
    },
    [GetSystemTheme]
  );

  const ApplyTheme = useCallback((resolved: 'light' | 'dark') => {
    const root = document.documentElement;
    if (resolved === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  const ChangeTheme = useCallback(
    (new_theme: Theme) => {
      set_theme(new_theme);
      UpdateResolvedTheme(new_theme);
    },
    [UpdateResolvedTheme]
  );

  useEffect(() => {
    ApplyTheme(resolved_theme);
  }, [resolved_theme, ApplyTheme]);

  useEffect(() => {
    const media_query = window.matchMedia('(prefers-color-scheme: dark)');
    const HandleChange = () => {
      if (theme === 'system') {
        set_resolved_theme(GetSystemTheme());
      }
    };
    media_query.addEventListener('change', HandleChange);
    return () => media_query.removeEventListener('change', HandleChange);
  }, [theme, GetSystemTheme]);

  useEffect(() => {
    UpdateResolvedTheme(theme);
  }, [theme, UpdateResolvedTheme]);

  return {
    theme,
    resolved_theme,
    ChangeTheme
  };
}
