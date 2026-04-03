import { describe, it, expect } from 'vitest';
import { AxiosError } from 'axios';
import { extractApiMessage } from '../../lib/api';

function makeAxiosError(responseData: unknown, status = 400): AxiosError {
  const err = new AxiosError('request failed');
  err.response = {
    data: responseData,
    status,
    statusText: 'Bad Request',
    headers: {},
    config: {} as never,
  };
  return err;
}

describe('extractApiMessage', () => {
  it('API が error.message を返す場合はそれを使う', () => {
    const err = makeAxiosError({ error: { code: 'VALIDATION_ERROR', message: 'nameは必須です' } });
    expect(extractApiMessage(err)).toBe('nameは必須です');
  });

  it('error.message がない場合は汎用メッセージを返す', () => {
    const err = makeAxiosError({ error: { code: 'UNKNOWN' } });
    expect(extractApiMessage(err)).toContain('通信エラー');
  });

  it('response が存在しない AxiosError は汎用メッセージ', () => {
    const err = new AxiosError('network error');
    expect(extractApiMessage(err)).toContain('通信エラー');
  });

  it('AxiosError 以外の Error は汎用メッセージ', () => {
    expect(extractApiMessage(new Error('something'))).toContain('通信エラー');
  });

  it('非 Error は汎用メッセージ', () => {
    expect(extractApiMessage('string error')).toContain('通信エラー');
  });
});
