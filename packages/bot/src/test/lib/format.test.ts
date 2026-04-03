import { describe, it, expect } from 'vitest';
import { fmtPt, betTypeLabel, formatSelection, fmtDeadline, optionHint, buildOptMap } from '../../lib/format';
import type { Game } from '../../lib/api';

// テスト用 optMap ヘルパー
function optMap(pairs: Record<string, string>): Map<string, string> {
  return new Map(Object.entries(pairs));
}

describe('fmtPt', () => {
  it('カンマ区切りで pt を付ける', () => {
    expect(fmtPt(1000)).toBe('1,000pt');
    expect(fmtPt(10000)).toBe('10,000pt');
    expect(fmtPt(0)).toBe('0pt');
    expect(fmtPt(500)).toBe('500pt');
  });
});

describe('betTypeLabel', () => {
  it('single', () => {
    expect(betTypeLabel('single', null)).toBe('単数');
  });
  it('multi_unordered', () => {
    expect(betTypeLabel('multi_unordered', 3)).toBe('複数-選択一致 / 3択');
  });
  it('multi_ordered', () => {
    expect(betTypeLabel('multi_ordered', 2)).toBe('複数-順番一致（重複なし） / 2択');
  });
  it('multi_ordered_dup', () => {
    expect(betTypeLabel('multi_ordered_dup', 4)).toBe('複数-順番一致（重複あり） / 4択');
  });
  it('未知の型はそのまま返す', () => {
    expect(betTypeLabel('unknown_type', null)).toBe('unknown_type');
  });
});

describe('formatSelection', () => {
  const map = optMap({ A: 'チームA', B: 'チームB', C: 'チームC' });

  it('single: 1文字をそのまま表示', () => {
    expect(formatSelection('A', map, 'single')).toBe('A: チームA');
  });

  it('multi_unordered: 読点区切り＋選択一致', () => {
    expect(formatSelection('AB', map, 'multi_unordered')).toBe(
      'A: チームA、B: チームB（選択一致）',
    );
  });

  it('multi_ordered: → 区切り＋順番一致・重複なし', () => {
    expect(formatSelection('BC', map, 'multi_ordered')).toBe(
      'B: チームB → C: チームC（順番一致・重複なし）',
    );
  });

  it('multi_ordered_dup: → 区切り＋順番一致・重複あり', () => {
    expect(formatSelection('AAB', optMap({ A: 'チームA', B: 'チームB' }), 'multi_ordered_dup')).toBe(
      'A: チームA → A: チームA → B: チームB（順番一致・重複あり）',
    );
  });

  it('optMap に存在しない記号はそのまま表示', () => {
    expect(formatSelection('Z', map, 'single')).toBe('Z: Z');
  });
});

describe('fmtDeadline', () => {
  it('ISO 文字列を YYYY-MM-DD HH:mm に変換する', () => {
    // ローカルタイムに依存するため toMatch で部分検証
    const result = fmtDeadline('2024-06-15T12:30:00.000Z');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/);
  });
});

describe('optionHint', () => {
  it('single のヒント', () => {
    expect(optionHint('single', null)).toContain('1文字');
  });
  it('multi_unordered のヒント', () => {
    const hint = optionHint('multi_unordered', 3);
    expect(hint).toContain('3文字');
    expect(hint).toContain('順不同');
  });
  it('multi_ordered のヒント', () => {
    const hint = optionHint('multi_ordered', 2);
    expect(hint).toContain('2文字');
    expect(hint).toContain('順番通り');
  });
  it('multi_ordered_dup のヒント', () => {
    const hint = optionHint('multi_ordered_dup', 3);
    expect(hint).toContain('3文字');
    expect(hint).toContain('重複可');
  });
});

describe('buildOptMap (Game からの Map 生成)', () => {
  it('betOptions から symbol→label の Map を作れる', () => {
    const game = {
      betOptions: [
        { id: 1, symbol: 'A', label: 'チームA', order: 1 },
        { id: 2, symbol: 'B', label: 'チームB', order: 2 },
      ],
    } as Pick<Game, 'betOptions'>;
    const map = buildOptMap(game as Game);
    expect(map.get('A')).toBe('チームA');
    expect(map.get('B')).toBe('チームB');
    expect(map.size).toBe(2);
  });
});
