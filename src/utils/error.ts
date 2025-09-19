/**
 * Универсальный парсер сообщений об ошибках из ответов API/axios
 * Поддерживает несколько распространённых форматов:
 * - { message: string }
 * - { error: { message, code, details } }
 * - { errors: [{ message }|{ detail }|string] }
 * - { detail: string }
 * - { title: string, status: number }
 * - string
 */
export function extractApiErrorMessage(error: unknown): string {
  // 1) Axios error с response
  const err: any = error as any;
  const responseData = err?.response?.data;

  const fromData = extractFromData(responseData);
  if (fromData) return fromData;

  // 2) Ошибка уровня сети/axios
  if (typeof err?.message === 'string' && err.message.trim().length > 0) {
    return err.message;
  }

  // 3) Фоллбек
  return 'Произошла ошибка при обращении к API';
}

function extractFromData(data: any): string | null {
  if (!data) return null;

  // Строка как ответ
  if (typeof data === 'string') {
    return data;
  }

  // { message }
  if (typeof data?.message === 'string' && data.message.trim().length > 0) {
    return data.message;
  }

  // { error: { message } }
  if (typeof data?.error?.message === 'string' && data.error.message.trim().length > 0) {
    return data.error.message;
  }

  // { detail }
  if (typeof data?.detail === 'string' && data.detail.trim().length > 0) {
    return data.detail;
  }

  // { title, status }
  if (typeof data?.title === 'string' && data.title.trim().length > 0) {
    return data.title;
  }

  // { errors: [...] }
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const first = data.errors[0];
    if (typeof first === 'string') return first;
    if (typeof first?.message === 'string' && first.message.trim().length > 0) return first.message;
    if (typeof first?.detail === 'string' && first.detail.trim().length > 0) return first.detail;
  }

  // { error: string }
  if (typeof data?.error === 'string' && data.error.trim().length > 0) {
    return data.error;
  }

  // Часто встречающиеся альтернативные поля
  const candidates: Array<unknown> = [data?.reason, data?.description, data?.error_description, data?.errorMessage];
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().length > 0) return c;
  }

  return null;
}

export interface NormalizedApiError {
  message: string;
  status?: number;
  code?: string | number;
}

export function normalizeApiError(error: unknown): NormalizedApiError {
  const err: any = error as any;
  const message = extractApiErrorMessage(error);
  const status: number | undefined = err?.response?.status;
  const code: string | number | undefined = err?.response?.data?.code || err?.code;
  return { message, status, code };
}


