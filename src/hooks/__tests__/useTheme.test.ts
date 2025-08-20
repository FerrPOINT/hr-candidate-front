import { renderHook } from '@testing-library/react';
import { useTheme } from '../useTheme';

test('useTheme возвращает значение темы', () => {
  const { result } = renderHook(() => useTheme());
  expect(result.current).toBeDefined();
}); 