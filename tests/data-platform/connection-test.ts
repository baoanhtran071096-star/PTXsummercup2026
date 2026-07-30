// ================================================================
// PTX CONNECTION TEST – Kiểm tra kết nối Supabase thật
// ================================================================
import { config } from 'node:process';

// Load .env thủ công
import { readFileSync } from 'fs';
import { resolve } from 'path';

try {
  const envFile = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const [key, ...vals] = trimmed.split('=');
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
  }
} catch { /* .env not found */ }

const SUPABASE_URL = process.env.SUPABASE_URL ?? '';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const ANON_KEY     = process.env.SUPABASE_ANON_KEY ?? '';

console.log('\n🔌 PTX SUPABASE CONNECTION TEST');
console.log('─'.repeat(50));
console.log(`URL: ${SUPABASE_URL}`);
console.log(`Anon Key: ${ANON_KEY.slice(0, 20)}...`);
console.log(`Service Key: ${SERVICE_KEY.slice(0, 20)}...`);
console.log('─'.repeat(50));

async function testConnection() {
  // TC1: Test kết nối cơ bản
  console.log('\n[1/4] Kiểm tra kết nối REST API...');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
    if (res.ok || res.status === 404) {
      console.log('  ✅ REST API kết nối thành công!');
    } else {
      console.log(`  ⚠️  Status: ${res.status} – ${res.statusText}`);
    }
  } catch (e) {
    console.error('  ❌ Kết nối thất bại:', (e as Error).message);
    process.exit(1);
  }

  // TC2: Kiểm tra bảng teams đã tồn tại chưa
  console.log('\n[2/4] Kiểm tra bảng teams...');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/teams?limit=1`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
    if (res.ok) {
      const data = await res.json() as unknown[];
      console.log(`  ✅ Bảng teams tồn tại! Số bản ghi: ${data.length}`);
    } else if (res.status === 406 || res.status === 400) {
      const err = await res.json() as { message?: string };
      if (err.message?.includes('does not exist') || err.message?.includes('relation')) {
        console.log('  ⚠️  Bảng teams CHƯA được tạo → Cần chạy migration SQL');
      } else {
        console.log(`  ⚠️  Lỗi: ${JSON.stringify(err)}`);
      }
    } else {
      console.log(`  ⚠️  Status: ${res.status}`);
    }
  } catch (e) {
    console.error('  ❌ Lỗi kiểm tra bảng:', (e as Error).message);
  }

  // TC3: Kiểm tra bảng matches
  console.log('\n[3/4] Kiểm tra bảng matches...');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/matches?limit=1`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
    if (res.ok) {
      const data = await res.json() as unknown[];
      console.log(`  ✅ Bảng matches tồn tại! Số bản ghi: ${data.length}`);
    } else {
      console.log(`  ⚠️  Bảng matches chưa tồn tại (status: ${res.status})`);
    }
  } catch (e) {
    console.error('  ❌', (e as Error).message);
  }

  // TC4: Check Supabase project info
  console.log('\n[4/4] Kiểm tra thông tin project...');
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` },
    });
    console.log(`  ✅ Server: ${res.headers.get('server') ?? 'PostgREST'}`);
    console.log(`  ✅ Content-Type: ${res.headers.get('content-type') ?? 'ok'}`);
  } catch (e) {
    console.error('  ❌', (e as Error).message);
  }

  console.log('\n' + '─'.repeat(50));
  console.log('📊 Connection test hoàn tất');
  console.log('─'.repeat(50) + '\n');
}

testConnection().catch(console.error);
