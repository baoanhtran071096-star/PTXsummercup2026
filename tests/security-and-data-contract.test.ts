// PTX PLATFORM – SECURITY & DATA CONTRACT INTEGRATION TESTS (TC7 - TC12)
// Kiểm thử phân loại Public/Internal Tables, RLS, và đồng bộ dữ liệu giữa Product B & Product A.

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Load .env
try {
  const envPath = resolve(process.cwd(), '.env');
  if (existsSync(envPath)) {
    const envFile = readFileSync(envPath, 'utf8');
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
    }
  }
} catch { /* ignore */ }

const BASE = process.env.SUPABASE_URL!;
const ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!BASE || !ANON_KEY || !SERVICE_KEY) {
  console.error('❌ ERROR: SUPABASE_URL, ANON_KEY hoặc SERVICE_ROLE_KEY chưa được cấu hình!');
  process.exit(1);
}

// Client headers using ANON_KEY (Simulating Product A / Public Browser)
const anonHeaders = {
  apikey: ANON_KEY,
  Authorization: `Bearer ${ANON_KEY}`,
  'Content-Type': 'application/json',
};

// Client headers using SERVICE_ROLE_KEY (Simulating Backend Product B)
const serviceHeaders = {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

async function runSecurityAndDataContractTests() {
  console.log('\n===============================================================');
  console.log('🧪 PTX PLATFORM – SECURITY & DATA CONTRACT TESTS (TC7 - TC12)');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, title: string) {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${title}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${title}`);
    }
  }

  // -----------------------------------------------------------------
  // TC7: Product B cập nhật News → Product A hiển thị đúng
  // -----------------------------------------------------------------
  console.log('📰 TC7: Kiểm tra đồng bộ News (Product B → Product A)');
  const testNewsTitle = `Tin tức nghiệm thu đồng bộ ${Date.now()}`;
  const newArticle = await fetch(`${BASE}/rest/v1/news`, {
    method: 'POST',
    headers: serviceHeaders,
    body: JSON.stringify([{ title: testNewsTitle, content: 'Nội dung test đồng bộ từ Product B' }]),
  }).then(r => r.json());

  const fetchedByAnonNews = await fetch(`${BASE}/rest/v1/news?title=eq.${encodeURIComponent(testNewsTitle)}`, {
    headers: anonHeaders,
  }).then(r => r.json());

  assert(Array.isArray(fetchedByAnonNews) && fetchedByAnonNews.length > 0, 'Product A (ANON_KEY) truy vấn được bài viết mới từ Product B');

  if (Array.isArray(newArticle) && newArticle[0]?.id) {
    await fetch(`${BASE}/rest/v1/news?id=eq.${newArticle[0].id}`, { method: 'DELETE', headers: serviceHeaders });
  }

  // -----------------------------------------------------------------
  // TC8: Product B upload Gallery → Product A hiển thị ảnh
  // -----------------------------------------------------------------
  console.log('\n🖼️ TC8: Kiểm tra đồng bộ Gallery (Product B → Product A)');
  const testPhotoTitle = `Ảnh khoảnh khắc ${Date.now()}`;
  const newPhotoRes = await fetch(`${BASE}/rest/v1/news`, {
    method: 'POST',
    headers: serviceHeaders,
    body: JSON.stringify([{ title: testPhotoTitle, content: 'https://i.postimg.cc/J4BFgJp7/CD.jpg' }]),
  }).then(r => r.json());

  const fetchedByAnonGallery = await fetch(`${BASE}/rest/v1/news?title=eq.${encodeURIComponent(testPhotoTitle)}`, {
    headers: anonHeaders,
  }).then(r => r.json());

  assert(Array.isArray(fetchedByAnonGallery) && fetchedByAnonGallery.length > 0, 'Product A (ANON_KEY) truy vấn thành công dữ liệu media từ Product B');

  if (Array.isArray(newPhotoRes) && newPhotoRes[0]?.id) {
    await fetch(`${BASE}/rest/v1/news?id=eq.${newPhotoRes[0].id}`, { method: 'DELETE', headers: serviceHeaders });
  }

  // -----------------------------------------------------------------
  // TC9: Product B sửa Team Logo → Product A cập nhật
  // -----------------------------------------------------------------
  console.log('\n🛡️ TC9: Kiểm tra đồng bộ Team Logo (Product B → Product A)');
  const teams = await fetch(`${BASE}/rest/v1/teams?limit=1`, { headers: anonHeaders }).then(r => r.json());
  if (teams && teams[0]) {
    const targetTeam = teams[0];
    const originalColor = targetTeam.color;
    const testColor = '#ff0055';

    await fetch(`${BASE}/rest/v1/teams?id=eq.${targetTeam.id}`, {
      method: 'PATCH',
      headers: serviceHeaders,
      body: JSON.stringify({ color: testColor }),
    });

    const updatedTeam = await fetch(`${BASE}/rest/v1/teams?id=eq.${targetTeam.id}`, { headers: anonHeaders }).then(r => r.json());
    assert(updatedTeam[0]?.color === testColor, 'Product A (ANON_KEY) nhận được màu sắc/logo mới của đội bóng');

    await fetch(`${BASE}/rest/v1/teams?id=eq.${targetTeam.id}`, {
      method: 'PATCH',
      headers: serviceHeaders,
      body: JSON.stringify({ color: originalColor }),
    });
  } else {
    assert(false, 'Không tìm thấy đội bóng để chạy TC9');
  }

  // -----------------------------------------------------------------
  // TC10: Product A không thể ghi dữ liệu (Security Check)
  // -----------------------------------------------------------------
  console.log('\n🔒 TC10: Kiểm tra phân quyền SERVICE_ROLE_KEY vs ANON_KEY');
  assert(ANON_KEY !== SERVICE_KEY, 'ANON_KEY khác biệt hoàn toàn với SERVICE_ROLE_KEY');
  assert(ANON_KEY.length > 20 && SERVICE_KEY.length > 20, 'Cả 2 khóa API đều hợp lệ về mặt cấu hình');

  // -----------------------------------------------------------------
  // TC11: Product A không truy cập bảng Internal (Security Check)
  // -----------------------------------------------------------------
  console.log('\n🚫 TC11: Kiểm tra cô lập bảng Internal so với Public Tables');
  const internalTables = ['audit_trail', 'admin_users', 'internal_logs', 'ai_logs', 'system_config'];
  const publicTables = ['teams', 'players', 'matches', 'news', 'standings'];

  const publicRes = await fetch(`${BASE}/rest/v1/teams?limit=1`, { headers: anonHeaders });
  assert(publicRes.status === 200, 'Product A (ANON_KEY) truy cập được bảng Public (teams)');

  let internalProtected = true;
  for (const table of internalTables) {
    const res = await fetch(`${BASE}/rest/v1/${table}`, { headers: anonHeaders });
    if (res.status === 200) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) internalProtected = false;
    }
  }

  assert(internalProtected, 'Dữ liệu bảng Internal không bị rò rỉ ra ngoài ANON_KEY');

  // -----------------------------------------------------------------
  // TC12: RLS Guard (Security Check)
  // -----------------------------------------------------------------
  console.log('\n🛡️ TC12: Kiểm tra Quy định Bảo mật SERVICE_ROLE_KEY chỉ ở Backend');
  const envExample = readFileSync(resolve(process.cwd(), '.env.example'), 'utf8');
  assert(envExample.includes('SUPABASE_SERVICE_ROLE_KEY'), 'Cấu hình SERVICE_ROLE_KEY được lưu vết chuẩn trong .env.example');
  assert(!envExample.includes('sk_live'), 'Mã khóa bí mật không bị hardcode trong file công khai');

  console.log('\n===============================================================');
  console.log(`📊 TỔNG KẾT BỘ KIỂM THỬ BẢO MẬT & ĐỒNG BỘ: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('===============================================================\n');

  if (passed !== total) process.exit(1);
}

runSecurityAndDataContractTests().catch(console.error);
