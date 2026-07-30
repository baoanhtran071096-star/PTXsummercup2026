// PTX Summer Cup 2026 (v6.5 Ultra Performance) Demo Application Logic

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initChat();
  initPlayerModals();
  initPredictionDemo();
});

// Tab Switching Mechanism
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetElement = document.getElementById(targetTab);
      if (targetElement) {
        targetElement.classList.add('active');
      }
    });
  });
}

// Live Chat Interactivity
function initChat() {
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      // Parse @mentions
      const formattedText = text.replace(/@([a-zA-Z0-9_]+)/g, '<span class="chat-mention">@$1</span>');

      const msgElement = document.createElement('div');
      msgElement.className = 'chat-msg';
      msgElement.innerHTML = `
        <div class="chat-msg-header">
          <span class="chat-sender">Bạn (Bảo Anh)</span>
          <span style="color: var(--text-dim);">Vừa xong</span>
        </div>
        <div class="chat-text">${formattedText}</div>
        <div class="chat-reactions">
          <button class="reaction-btn" onclick="addReaction(this)">👍 0</button>
          <button class="reaction-btn" onclick="addReaction(this)">❤️ 0</button>
          <button class="reaction-btn" onclick="addReaction(this)">🔥 0</button>
        </div>
      `;

      chatMessages.appendChild(msgElement);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      chatInput.value = '';
    });
  }
}

// Reaction Counter
window.addReaction = function(btn) {
  const parts = btn.innerText.split(' ');
  const emoji = parts[0];
  const count = parseInt(parts[1]) + 1;
  btn.innerText = `${emoji} ${count}`;
  btn.style.borderColor = 'var(--primary-green)';
  btn.style.color = 'var(--primary-green)';
};

// Player Detail Modal Popup
function initPlayerModals() {
  const modal = document.getElementById('playerModal');
  const closeBtn = document.getElementById('closeModalBtn');

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }
}

window.openPlayerCard = function(name, number, pos, goals, mvp, passes) {
  const modal = document.getElementById('playerModal');
  if (!modal) return;

  document.getElementById('modalPlayerName').innerText = name;
  document.getElementById('modalPlayerNum').innerText = `#${number} - ${pos}`;
  document.getElementById('modalPlayerGoals').innerText = goals;
  document.getElementById('modalPlayerMvp').innerText = mvp;
  document.getElementById('modalPlayerPasses').innerText = passes;

  modal.classList.add('active');
};

// AI Predictor Interactivity
function initPredictionDemo() {
  const predictBtn = document.getElementById('runPredictorBtn');
  if (predictBtn) {
    predictBtn.addEventListener('click', () => {
      predictBtn.innerText = '🤖 AI Engine đang tính toán...';
      predictBtn.disabled = true;

      setTimeout(() => {
        document.getElementById('aiResultBox').style.display = 'block';
        predictBtn.innerText = '⚡ Chạy Dự đoán AI V2';
        predictBtn.disabled = false;
      }, 600);
    });
  }
}

// Ticket Check-in Demo
window.checkinDemoTicket = function() {
  const statusEl = document.getElementById('ticketStatusBadge');
  if (statusEl) {
    statusEl.innerHTML = '<span style="color: var(--primary-green); font-weight: 700;">✅ DA CHECK-IN (Zone A - Cửa số 2)</span>';
    alert('🎉 Check-in mã QR vé tham dự trận đấu thành công!');
  }
};
