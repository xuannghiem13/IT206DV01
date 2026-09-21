import { NextResponse } from 'next/server';
import { SAMPLE_ACCOUNTS, ROLES } from '@/lib/seedData';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const cleanUsername = (username || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // Tìm tài khoản (hỗ trợ cả alias khach101 cho khachthue)
    const account = SAMPLE_ACCOUNTS.find(
      a => (a.username.toLowerCase() === cleanUsername || (cleanUsername === 'khach101' && a.username === 'khachthue')) && a.password === cleanPassword
    );

    if (!account) {
      return NextResponse.json(
        { error: 'Tên đăng nhập hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    const roleInfo = ROLES.find(r => r.key === account.role);

    // Không trả về password trong response
    const { password: _, ...safeUser } = account;

    return NextResponse.json({
      user: safeUser,
      roleInfo
    });
  } catch (err) {
    return NextResponse.json({ error: 'Lỗi đăng nhập' }, { status: 500 });
  }
}
