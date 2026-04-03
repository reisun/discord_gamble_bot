import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ChatInputCommandInteraction, Guild, GuildMember } from 'discord.js';

// config をモック
vi.mock('../../config', () => ({
  config: {
    discordAdminRoleIds: ['role-admin'],
    webAppBaseUrl: 'https://example.github.io/app',
    adminToken: 'secret-admin-token',
  },
}));

import { execute } from '../../commands/admin-link';

function makeMember(isAdmin: boolean): GuildMember {
  return {
    roles: {
      cache: {
        has: (id: string) => isAdmin && id === 'role-admin',
      },
    },
  } as unknown as GuildMember;
}

function makeInteraction(isAdmin: boolean): ChatInputCommandInteraction {
  const member = makeMember(isAdmin);
  return {
    user: { id: 'user-001' },
    guild: {
      members: {
        fetch: vi.fn().mockResolvedValue(member),
      },
    } as unknown as Guild,
    reply: vi.fn().mockResolvedValue(undefined),
  } as unknown as ChatInputCommandInteraction;
}

describe('/admin-link execute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('管理者ロールあり: トークン付き URL を返す（Ephemeral）', async () => {
    const interaction = makeInteraction(true);
    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        ephemeral: true,
        content: expect.stringContaining('https://example.github.io/app/#/?token=secret-admin-token'),
      }),
    );
    const call = vi.mocked(interaction.reply).mock.calls[0][0] as { content: string };
    expect(call.content).toContain('🔑');
    expect(call.content).toContain('共有しないでください');
  });

  it('管理者ロールなし: エラーメッセージ（Ephemeral）', async () => {
    const interaction = makeInteraction(false);
    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        ephemeral: true,
        content: expect.stringContaining('管理者のみ'),
      }),
    );
  });

  it('guild なし（DM）: エラーメッセージ', async () => {
    const interaction = {
      user: { id: 'user-001' },
      guild: null,
      reply: vi.fn().mockResolvedValue(undefined),
    } as unknown as ChatInputCommandInteraction;

    await execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({
        ephemeral: true,
        content: expect.stringContaining('管理者のみ'),
      }),
    );
  });
});
