// ══════════════════════════════════════════
//  PEEP STORIES / STATUS SYSTEM
//  Add <script src="stories.js"></script>
//  just before </body> in index.html
// ══════════════════════════════════════════

// ── Story config ──────────────────────────
var STORY_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

// ── Emoji picker options ──────────────────
var STORY_EMOJIS = ['🔥','✨','💫','🎉','😎','❤️','💜','🚀','🌟','💯','👑','🎯','💪','🙌','😍','🤩','🥳','😂','🫶','👋'];

// ── Sticker/mood options ──────────────────
var STORY_MOODS = [
  { label: '🔥 Lit',        bg: 'linear-gradient(135deg,#ff416c,#ff4b2b)' },
  { label: '😎 Vibing',     bg: 'linear-gradient(135deg,#667eea,#764ba2)' },
  { label: '💜 Feeling it', bg: 'linear-gradient(135deg,#a18cd1,#fbc2eb)' },
  { label: '🚀 On a roll',  bg: 'linear-gradient(135deg,#4facfe,#00f2fe)' },
  { label: '🌟 Shining',    bg: 'linear-gradient(135deg,#f7971e,#ffd200)' },
  { label: '🎯 Focused',    bg: 'linear-gradient(135deg,#11998e,#38ef7d)' },
  { label: '💤 Chilling',   bg: 'linear-gradient(135deg,#2c3e50,#4ca1af)' },
  { label: '🎉 Celebrating',bg: 'linear-gradient(135deg,#f953c6,#b91d73)' }
];

// ════════════════════════════════════════════
//  INJECT STORY CSS
// ════════════════════════════════════════════
(function injectStoryCSS() {
  var style = document.createElement('style');
  style.textContent = `
    /* ── Story Ring Strip ── */
    #story-strip {
      display: none;
      overflow-x: auto;
      gap: 14px;
      padding: 16px 4px 8px;
      scrollbar-width: none;
      -ms-overflow-style: none;
      align-items: flex-start;
    }
    #story-strip::-webkit-scrollbar { display: none; }

    .story-bubble {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      flex-shrink: 0;
      cursor: pointer;
      width: 64px;
    }
    .story-ring {
      width: 56px; height: 56px; border-radius: 50%;
      padding: 2.5px;
      background: linear-gradient(135deg,#667eea,#764ba2);
      box-shadow: 0 0 0 2px #f6f8fa;
      transition: transform 0.18s;
      position: relative;
    }
    .story-ring.seen {
      background: #d0d7de;
    }
    .story-ring:hover { transform: scale(1.07); }
    .story-ring-inner {
      width: 100%; height: 100%; border-radius: 50%;
      background: #eaf5ff;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden; font-size: 20px; font-weight: 700;
      color: white; background-size: cover; background-position: center;
    }
    .story-ring-inner img {
      width: 100%; height: 100%; object-fit: cover; border-radius: 50%;
    }
    .story-add-ring {
      background: linear-gradient(135deg,#667eea,#764ba2) !important;
      box-shadow: 0 0 0 2px #f6f8fa !important;
    }
    .story-add-icon {
      font-size: 22px; color: white; font-weight: 400; line-height: 1;
    }
    .story-name {
      font-size: 10px; color: #57606a; text-align: center;
      max-width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-weight: 500;
    }

    /* ── Story Composer Modal ── */
    #story-composer {
      display: none; position: fixed; inset: 0;
      background: rgba(27,31,36,0.65); z-index: 3000;
      align-items: center; justify-content: center;
    }
    #story-composer.open { display: flex; }
    .story-composer-box {
      background: #fff; border-radius: 16px; border: 1px solid #d0d7de;
      width: 100%; max-width: 420px; padding: 24px;
      box-shadow: 0 12px 40px rgba(27,31,36,0.18);
      animation: scaleIn 0.22s ease;
    }
    @keyframes scaleIn { from { transform:scale(0.92);opacity:0; } to { transform:scale(1);opacity:1; } }

    .story-composer-box h3 {
      font-size: 17px; font-weight: 700; color: #24292f; margin-bottom: 4px;
    }
    .story-composer-box p {
      font-size: 12px; color: #57606a; margin-bottom: 20px;
    }

    /* Tabs */
    .story-tabs {
      display: flex; gap: 4px; background: #f6f8fa;
      border: 1px solid #d0d7de; border-radius: 8px; padding: 3px;
      margin-bottom: 18px;
    }
    .story-tab {
      flex: 1; padding: 6px; border-radius: 6px; border: none;
      background: transparent; font-size: 12px; font-weight: 600;
      color: #57606a; cursor: pointer; font-family: inherit;
      transition: all 0.15s;
    }
    .story-tab.active {
      background: #fff; color: #24292f;
      box-shadow: 0 1px 4px rgba(27,31,36,0.1);
    }

    /* Story preview card */
    #story-preview {
      width: 100%; height: 180px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 16px; border: 1px solid #d0d7de;
      background: linear-gradient(135deg,#667eea,#764ba2);
      position: relative; overflow: hidden;
      transition: background 0.3s;
    }
    #story-preview-text {
      font-size: 22px; font-weight: 700; color: white;
      text-align: center; padding: 12px; word-break: break-word;
      text-shadow: 0 1px 4px rgba(0,0,0,0.25); max-width: 90%;
    }
    #story-preview-img {
      width: 100%; height: 100%; object-fit: cover;
      position: absolute; top:0; left:0; display:none;
    }

    /* Text input */
    #story-text-input {
      width: 100%; padding: 10px 14px; border-radius: 8px;
      border: 1px solid #d0d7de; font-size: 14px; font-family: inherit;
      color: #24292f; outline: none; resize: none; background: #fff;
      transition: border-color 0.15s; height: 72px; margin-bottom: 12px;
    }
    #story-text-input:focus { border-color: #667eea; box-shadow: 0 0 0 3px rgba(102,126,234,0.12); }

    /* Emoji row */
    .story-emoji-row {
      display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;
    }
    .story-emoji-btn {
      width: 32px; height: 32px; border-radius: 8px; border: 1px solid #d0d7de;
      background: #f6f8fa; font-size: 16px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.1s;
    }
    .story-emoji-btn:hover { transform: scale(1.15); border-color: #667eea; }

    /* Mood grid */
    .story-mood-grid {
      display: grid; grid-template-columns: repeat(2,1fr); gap: 8px;
      margin-bottom: 16px;
    }
    .story-mood-btn {
      padding: 10px; border-radius: 10px; border: 2px solid transparent;
      font-size: 13px; font-weight: 600; color: white; cursor: pointer;
      font-family: inherit; transition: all 0.15s; text-align: center;
    }
    .story-mood-btn:hover { transform: scale(1.03); box-shadow: 0 3px 10px rgba(0,0,0,0.15); }
    .story-mood-btn.sel { border-color: #fff; box-shadow: 0 0 0 3px rgba(102,126,234,0.35); }

    /* Photo tab */
    .story-photo-drop {
      width: 100%; height: 110px; border: 2px dashed #d0d7de;
      border-radius: 10px; display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 6px;
      cursor: pointer; margin-bottom: 12px; transition: border-color 0.15s;
      color: #57606a; font-size: 13px;
    }
    .story-photo-drop:hover { border-color: #667eea; color: #667eea; }
    .story-photo-drop i { font-size: 24px; }

    /* Post button */
    .story-post-btn {
      width: 100%; padding: 11px; border-radius: 8px; border: none;
      background: linear-gradient(135deg,#667eea,#764ba2); color: white;
      font-size: 14px; font-family: inherit; font-weight: 700; cursor: pointer;
      transition: opacity 0.15s;
    }
    .story-post-btn:hover { opacity: 0.9; }
    .story-cancel-btn {
      width: 100%; padding: 9px; border-radius: 8px;
      border: 1px solid #d0d7de; background: #f6f8fa; color: #57606a;
      font-size: 14px; font-family: inherit; cursor: pointer; margin-top: 6px;
    }

    /* ── Story Viewer Modal ── */
    #story-viewer {
      display: none; position: fixed; inset: 0;
      background: rgba(0,0,0,0.92); z-index: 4000;
      align-items: center; justify-content: center;
      flex-direction: column;
    }
    #story-viewer.open { display: flex; }

    .sv-card {
      position: relative; width: 340px; max-width: 92vw;
      border-radius: 20px; overflow: hidden;
      box-shadow: 0 24px 60px rgba(0,0,0,0.5);
      animation: scaleIn 0.2s ease;
    }
    .sv-bg {
      width: 100%; min-height: 480px; display: flex;
      align-items: center; justify-content: center;
      flex-direction: column; position: relative;
    }
    .sv-img-cover {
      position: absolute; inset:0; width:100%; height:100%;
      object-fit: cover; border-radius: 20px;
    }
    .sv-overlay {
      position: absolute; inset:0; background: linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.45) 100%);
      border-radius: 20px;
    }

    /* Progress bar */
    .sv-progress {
      position: absolute; top: 14px; left: 14px; right: 14px;
      height: 3px; background: rgba(255,255,255,0.3); border-radius: 2px; z-index: 10;
    }
    .sv-progress-fill {
      height: 100%; background: white; border-radius: 2px;
      width: 0%; transition: width 0.1s linear;
    }

    /* Header */
    .sv-header {
      position: absolute; top: 26px; left: 14px; right: 14px;
      display: flex; align-items: center; justify-content: space-between; z-index: 10;
    }
    .sv-user { display: flex; align-items: center; gap: 8px; }
    .sv-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      border: 2px solid white; overflow: hidden;
      background: linear-gradient(135deg,#667eea,#764ba2);
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px; color: white;
      background-size: cover; background-position: center;
    }
    .sv-name { color: white; font-size: 13px; font-weight: 700; }
    .sv-time { color: rgba(255,255,255,0.75); font-size: 11px; }
    .sv-close {
      background: rgba(255,255,255,0.18); border: none;
      color: white; width: 30px; height: 30px; border-radius: 50%;
      font-size: 16px; cursor: pointer; display: flex;
      align-items: center; justify-content: center; backdrop-filter: blur(4px);
    }

    /* Content */
    .sv-content {
      z-index: 5; position: relative; padding: 60px 24px 80px;
      text-align: center; min-height: 480px;
      display: flex; align-items: center; justify-content: center;
    }
    .sv-story-text {
      font-size: 28px; font-weight: 800; color: white;
      text-shadow: 0 2px 8px rgba(0,0,0,0.3); word-break: break-word;
      line-height: 1.25;
    }

    /* Tap zones */
    .sv-tap-prev {
      position: absolute; left:0; top:0; width:40%; height:100%;
      z-index: 20; cursor: pointer; background: transparent; border: none;
    }
    .sv-tap-next {
      position: absolute; right:0; top:0; width:60%; height:100%;
      z-index: 20; cursor: pointer; background: transparent; border: none;
    }

    /* Nav arrows below card */
    .sv-nav {
      display: flex; gap: 20px; margin-top: 18px; z-index: 10;
    }
    .sv-nav-btn {
      background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.25);
      color: white; padding: 10px 28px; border-radius: 50px;
      font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit;
      backdrop-filter: blur(6px); transition: background 0.15s;
    }
    .sv-nav-btn:hover { background: rgba(255,255,255,0.25); }

    /* Story badge on profile modal */
    .story-ring-profile {
      cursor: pointer;
    }

    /* ── Profile story ring ── */
    #modal-avatar.has-story {
      box-shadow: 0 0 0 3px #f6f8fa, 0 0 0 6px #667eea !important;
      cursor: pointer;
    }

    /* ── Delete button in viewer ── */
    #sv-delete-btn {
      display: none;
      position: absolute;
      bottom: 18px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 30;
      background: rgba(207,34,46,0.85);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 8px 22px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      font-family: inherit;
      backdrop-filter: blur(4px);
      transition: background 0.15s;
    }
    #sv-delete-btn:hover { background: rgba(207,34,46,1); }

    @media (max-width: 480px) {
      .story-composer-box { margin: 0 12px; }
      .sv-card { width: 98vw; }
    }
  `;
  document.head.appendChild(style);
})();

// ════════════════════════════════════════════
//  INJECT STORY HTML
// ════════════════════════════════════════════
(function injectStoryHTML() {
  // ── Story strip (goes inside dash-container, before dash-card) ──
  var dashContainer = document.querySelector('.dash-container');
  if (dashContainer) {
    var strip = document.createElement('div');
    strip.id = 'story-strip';
    strip.style.display = 'flex';
    dashContainer.insertBefore(strip, dashContainer.firstChild);
  }

  // ── Story Composer Modal ──
  var composer = document.createElement('div');
  composer.id = 'story-composer';
  composer.innerHTML = `
    <div class="story-composer-box">
      <h3>📸 Add to your Story</h3>
      <p>Share a moment — it disappears after 24 hours.</p>

      <!-- Tabs -->
      <div class="story-tabs">
        <button class="story-tab active" onclick="storyTab('text',this)">✏️ Text</button>
        <button class="story-tab" onclick="storyTab('mood',this)">🎨 Mood</button>
        <button class="story-tab" onclick="storyTab('photo',this)">📷 Photo</button>
      </div>

      <!-- Preview -->
      <div id="story-preview" style="background:linear-gradient(135deg,#667eea,#764ba2);">
        <img id="story-preview-img" alt="">
        <span id="story-preview-text">Your story preview</span>
      </div>

      <!-- Text panel -->
      <div id="story-panel-text">
        <textarea id="story-text-input" placeholder="What's on your mind? Add an emoji too 🔥" oninput="storyUpdatePreview()"></textarea>
        <div class="story-emoji-row" id="story-emoji-row"></div>
        <!-- Bg gradient picker -->
        <div style="display:flex;gap:8px;margin-bottom:14px;align-items:center;">
          <span style="font-size:11px;color:#57606a;font-weight:600;">Background:</span>
          <div id="story-bg-swatches" style="display:flex;gap:6px;"></div>
        </div>
      </div>

      <!-- Mood panel -->
      <div id="story-panel-mood" style="display:none;">
        <div class="story-mood-grid" id="story-mood-grid"></div>
      </div>

      <!-- Photo panel -->
      <div id="story-panel-photo" style="display:none;">
        <div class="story-photo-drop" onclick="document.getElementById('story-photo-input').click()">
          <i class="fas fa-image"></i>
          <span>Tap to choose a photo</span>
          <span style="font-size:11px;color:#8c959f;">JPG, PNG, GIF — max 5MB</span>
        </div>
        <input type="file" id="story-photo-input" accept="image/*" style="display:none;" onchange="storyPhotoSelected(this)">
        <textarea id="story-photo-caption" placeholder="Add a caption (optional)" oninput="storyUpdatePreview()"
          style="width:100%;padding:8px 12px;border-radius:8px;border:1px solid #d0d7de;font-size:13px;font-family:inherit;color:#24292f;outline:none;resize:none;height:54px;margin-top:8px;"></textarea>
      </div>

      <button class="story-post-btn" onclick="storyPost()">🚀 Share Story</button>
      <button class="story-cancel-btn" onclick="storyComposerClose()">Cancel</button>
    </div>
  `;
  document.body.appendChild(composer);

  // ── Story Viewer Modal ──
  var viewer = document.createElement('div');
  viewer.id = 'story-viewer';
  viewer.innerHTML = `
    <div class="sv-card" id="sv-card">
      <div class="sv-bg" id="sv-bg">
        <img class="sv-img-cover" id="sv-img-cover" alt="" style="display:none;">
        <div class="sv-overlay" id="sv-overlay"></div>
        <div class="sv-progress"><div class="sv-progress-fill" id="sv-progress-fill"></div></div>
        <div class="sv-header">
          <div class="sv-user">
            <div class="sv-avatar" id="sv-avatar"></div>
            <div>
              <div class="sv-name" id="sv-name"></div>
              <div class="sv-time" id="sv-time"></div>
            </div>
          </div>
          <button class="sv-close" onclick="storyViewerClose()">✕</button>
        </div>
        <div class="sv-content">
          <div class="sv-story-text" id="sv-story-text"></div>
        </div>
        <button class="sv-tap-prev" onclick="storyViewPrev()"></button>
        <button class="sv-tap-next" onclick="storyViewNext()"></button>
        <button id="sv-delete-btn" onclick="storyDeleteCurrent()">🗑️ Delete Story</button>
      </div>
    </div>
    <div class="sv-nav">
      <button class="sv-nav-btn" onclick="storyViewPrev()">← Prev</button>
      <button class="sv-nav-btn" onclick="storyViewNext()">Next →</button>
    </div>
  `;
  document.body.appendChild(viewer);

  // Close viewer on backdrop click
  viewer.addEventListener('click', function(e) {
    if (e.target === viewer) storyViewerClose();
  });

  // Build emoji row
  var emojiRow = document.getElementById('story-emoji-row');
  STORY_EMOJIS.forEach(function(em) {
    var btn = document.createElement('button');
    btn.className = 'story-emoji-btn';
    btn.textContent = em;
    btn.onclick = function() {
      var inp = document.getElementById('story-text-input');
      inp.value += em;
      storyUpdatePreview();
    };
    emojiRow.appendChild(btn);
  });

  // Build mood grid
  var moodGrid = document.getElementById('story-mood-grid');
  STORY_MOODS.forEach(function(m, idx) {
    var btn = document.createElement('button');
    btn.className = 'story-mood-btn';
    btn.style.background = m.bg;
    btn.textContent = m.label;
    btn.dataset.idx = idx;
    btn.onclick = function() {
      document.querySelectorAll('.story-mood-btn').forEach(function(b){ b.classList.remove('sel'); });
      btn.classList.add('sel');
      selectedMood = m;
      storyUpdatePreview();
    };
    moodGrid.appendChild(btn);
  });

  // Build bg swatches (text tab)
  var swatchBgs = [
    'linear-gradient(135deg,#667eea,#764ba2)',
    'linear-gradient(135deg,#f09433,#dc2743)',
    'linear-gradient(135deg,#11998e,#38ef7d)',
    'linear-gradient(135deg,#f7971e,#ffd200)',
    'linear-gradient(135deg,#4facfe,#00f2fe)',
    'linear-gradient(135deg,#2c3e50,#4ca1af)',
    'linear-gradient(135deg,#f953c6,#b91d73)',
    'linear-gradient(135deg,#24292f,#57606a)',
  ];
  var swatchContainer = document.getElementById('story-bg-swatches');
  swatchBgs.forEach(function(bg, idx) {
    var sw = document.createElement('div');
    sw.style.cssText = 'width:24px;height:24px;border-radius:50%;background:' + bg + ';cursor:pointer;border:2px solid transparent;transition:transform 0.15s,border-color 0.15s;';
    sw.title = 'Background ' + (idx + 1);
    sw.onclick = function() {
      document.querySelectorAll('#story-bg-swatches > div').forEach(function(s){ s.style.borderColor = 'transparent'; s.style.transform = 'scale(1)'; });
      sw.style.borderColor = '#667eea';
      sw.style.transform = 'scale(1.2)';
      selectedBg = bg;
      storyUpdatePreview();
    };
    if (idx === 0) { sw.style.borderColor = '#667eea'; sw.style.transform = 'scale(1.2)'; }
    swatchContainer.appendChild(sw);
  });
})();

// ════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════
var currentStoryTab   = 'text';
var selectedBg        = 'linear-gradient(135deg,#667eea,#764ba2)';
var selectedMood      = null;
var storyPhotoDataUrl = null;
var storyPhotoUrl     = null;

var viewerStories  = [];
var viewerIndex    = 0;
var viewerTimer    = null;
var viewerDuration = 6000; // ms per story

// ════════════════════════════════════════════
//  TAB SWITCHING
// ════════════════════════════════════════════
function storyTab(tab, btn) {
  currentStoryTab = tab;
  document.querySelectorAll('.story-tab').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('story-panel-text').style.display  = tab === 'text'  ? 'block' : 'none';
  document.getElementById('story-panel-mood').style.display  = tab === 'mood'  ? 'block' : 'none';
  document.getElementById('story-panel-photo').style.display = tab === 'photo' ? 'block' : 'none';

  // Reset preview
  document.getElementById('story-preview-img').style.display = 'none';
  storyUpdatePreview();
}

// ════════════════════════════════════════════
//  PREVIEW UPDATE
// ════════════════════════════════════════════
function storyUpdatePreview() {
  var preview    = document.getElementById('story-preview');
  var previewTxt = document.getElementById('story-preview-text');
  var previewImg = document.getElementById('story-preview-img');

  if (currentStoryTab === 'text') {
    var txt = document.getElementById('story-text-input').value || 'Your story preview';
    preview.style.background = selectedBg;
    previewImg.style.display = 'none';
    previewTxt.style.display = 'block';
    previewTxt.textContent   = txt;

  } else if (currentStoryTab === 'mood') {
    var m = selectedMood || STORY_MOODS[0];
    preview.style.background = m.bg;
    previewImg.style.display = 'none';
    previewTxt.style.display = 'block';
    previewTxt.textContent   = m.label;

  } else if (currentStoryTab === 'photo') {
    if (storyPhotoDataUrl) {
      preview.style.background = '#000';
      previewImg.src = storyPhotoDataUrl;
      previewImg.style.display = 'block';
      var cap = document.getElementById('story-photo-caption').value;
      previewTxt.textContent   = cap;
      previewTxt.style.display = cap ? 'block' : 'none';
    } else {
      preview.style.background = selectedBg;
      previewImg.style.display = 'none';
      previewTxt.textContent   = 'Choose a photo above';
      previewTxt.style.display = 'block';
    }
  }
}

// ════════════════════════════════════════════
//  PHOTO SELECTED
// ════════════════════════════════════════════
function storyPhotoSelected(input) {
  var file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Photo must be under 5MB'); return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    storyPhotoDataUrl = e.target.result;
    storyUpdatePreview();
  };
  reader.readAsDataURL(file);
}

// ════════════════════════════════════════════
//  OPEN / CLOSE COMPOSER
// ════════════════════════════════════════════
function storyComposerOpen() {
  if (!currentUserKey) { showToast('Please sign in first'); return; }
  document.getElementById('story-composer').classList.add('open');
  document.getElementById('story-text-input').value = '';
  storyPhotoDataUrl = null;
  storyPhotoUrl     = null;
  selectedMood      = null;
  document.querySelectorAll('.story-mood-btn').forEach(function(b){ b.classList.remove('sel'); });
  storyUpdatePreview();
}

function storyComposerClose() {
  document.getElementById('story-composer').classList.remove('open');
}

// ════════════════════════════════════════════
//  POST STORY
// ════════════════════════════════════════════
function storyPost() {
  if (!currentUserKey) { showToast('Please sign in first'); return; }

  var storyData = {
    userKey:   currentUserKey,
    createdAt: Date.now(),
    expiresAt: Date.now() + STORY_EXPIRY_MS,
    type:      currentStoryTab
  };

  if (currentStoryTab === 'text') {
    var txt = document.getElementById('story-text-input').value.trim();
    if (!txt) { showToast('Please write something first'); return; }
    storyData.text = txt;
    storyData.bg   = selectedBg;
    doSaveStory(storyData);

  } else if (currentStoryTab === 'mood') {
    if (!selectedMood) { showToast('Please pick a mood'); return; }
    storyData.text = selectedMood.label;
    storyData.bg   = selectedMood.bg;
    doSaveStory(storyData);

  } else if (currentStoryTab === 'photo') {
    if (!storyPhotoDataUrl) { showToast('Please choose a photo'); return; }
    showToast('Uploading photo...');
    // Upload to Cloudinary
    var blob = dataURLtoBlob(storyPhotoDataUrl);
    var fd   = new FormData();
    fd.append('file', blob);
    fd.append('upload_preset', 'i7q7kwai');
    fd.append('cloud_name', 'dlrhbfvyb');
    fetch('https://api.cloudinary.com/v1_1/dlrhbfvyb/image/upload', { method:'POST', body:fd })
    .then(function(r){ return r.json(); })
    .then(function(data) {
      storyData.photoUrl = data.secure_url;
      storyData.text     = document.getElementById('story-photo-caption').value.trim();
      storyData.bg       = '#000';
      doSaveStory(storyData);
    })
    .catch(function(){ showToast('Photo upload failed'); });
    return;
  }
}

function doSaveStory(data) {
  db.collection('stories').add(data)
  .then(function() {
    showToast('✓ Story posted!');
    storyComposerClose();
    loadStoryStrip();
  })
  .catch(function(err){ showToast('Error: ' + err.message); });
}

// ════════════════════════════════════════════
//  LOAD STORY STRIP (dashboard)
// ════════════════════════════════════════════
function loadStoryStrip() {
  var strip = document.getElementById('story-strip');
  if (!strip) return;

  var now = Date.now();
  db.collection('stories')
    .where('expiresAt', '>', now)
    .orderBy('expiresAt')
    .get()
  .then(function(snapshot) {
    // Group by userKey
    var grouped = {};
    snapshot.forEach(function(doc) {
      var d = doc.data();
      d._id = doc.id;
      if (!grouped[d.userKey]) grouped[d.userKey] = [];
      grouped[d.userKey].push(d);
    });

    var userKeys = Object.keys(grouped);
    if (userKeys.length === 0 && !currentUserKey) {
      strip.style.display = 'none';
      return;
    }

    strip.innerHTML = '';
    strip.style.display = 'flex';

    // "Add Story" bubble (current user)
    if (currentUserKey) {
      strip.appendChild(makeAddStoryBubble());
    }

    // Promise.all to fetch user docs
    var promises = userKeys.map(function(key) {
      return db.collection('users').doc(key).get().then(function(doc) {
        return { key: key, user: doc.exists ? doc.data() : null, stories: grouped[key] };
      });
    });

    Promise.all(promises).then(function(results) {
      results.forEach(function(r) {
        if (!r.user) return;
        var seen = storyWasSeen(r.key);
        var bubble = makeStoryBubble(r.user, r.key, r.stories, seen);
        strip.appendChild(bubble);
      });
    });
  })
  .catch(function(err) {
    console.warn('Story strip error:', err);
    strip.style.display = 'none';
  });
}

function makeAddStoryBubble() {
  var wrap = document.createElement('div');
  wrap.className = 'story-bubble';
  wrap.onclick = storyComposerOpen;
  wrap.innerHTML =
    '<div class="story-ring story-add-ring">' +
    '  <div class="story-ring-inner" style="background:linear-gradient(135deg,#667eea,#764ba2);">' +
    '    <span class="story-add-icon">+</span>' +
    '  </div>' +
    '</div>' +
    '<span class="story-name">Your Story</span>';
  return wrap;
}

function makeStoryBubble(user, key, stories, seen) {
  var wrap = document.createElement('div');
  wrap.className = 'story-bubble';
  wrap.onclick = function() { openStoryViewer(stories, user); };

  var initial = (user.name || '?').charAt(0);
  var avatarStyle = user.photo
    ? 'background-image:url(' + user.photo + ');background-size:cover;background-position:center;'
    : 'background:linear-gradient(135deg,#667eea,#764ba2);';

  wrap.innerHTML =
    '<div class="story-ring ' + (seen ? 'seen' : '') + '">' +
    '  <div class="story-ring-inner" style="' + avatarStyle + '">' +
    (user.photo ? '' : '<span style="color:white;font-weight:700;font-size:18px;">' + initial + '</span>') +
    '  </div>' +
    '</div>' +
    '<span class="story-name">' + (user.handle || user.name || key) + '</span>';
  return wrap;
}

// ════════════════════════════════════════════
//  LOAD STORIES FOR A PROFILE (modal view)
// ════════════════════════════════════════════
function loadProfileStory(userKey, user) {
  var now = Date.now();

  // Remove any existing story button first
  var old = document.getElementById('profile-story-btn');
  if (old) old.remove();

  // Add pulse animation style once
  if (!document.getElementById('story-pulse-style')) {
    var s = document.createElement('style');
    s.id = 'story-pulse-style';
    s.textContent = '@keyframes storyPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.85;transform:scale(1.04)} }';
    document.head.appendChild(s);
  }

  function applyStoryUI(stories) {
    var av = document.getElementById('modal-avatar');
    if (!av) return;

    // Remove old btn again to be safe
    var ob = document.getElementById('profile-story-btn');
    if (ob) ob.remove();

    if (stories.length > 0) {
      av.classList.add('has-story');
      av.title = 'Tap to view story';
      av.onclick = function() { openStoryViewer(stories, user); };

      // Visible "View Story" button
      var btn = document.createElement('button');
      btn.id = 'profile-story-btn';
      btn.innerHTML = '&#128065; View Story';
      btn.style.cssText = 'display:block;margin:10px auto 0;padding:7px 20px;border-radius:20px;border:none;background:linear-gradient(135deg,#667eea,#764ba2);color:white;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;animation:storyPulse 1.8s infinite;';
      btn.onclick = function() { openStoryViewer(stories, user); };

      var verifiedEl = document.getElementById('modal-verified');
      if (verifiedEl && verifiedEl.parentNode) {
        verifiedEl.parentNode.insertAdjacentElement('afterend', btn);
      } else {
        av.insertAdjacentElement('afterend', btn);
      }
    } else {
      av.classList.remove('has-story');
      av.onclick = null;
    }
  }

  // Try compound query first (requires Firestore index)
  db.collection('stories')
    .where('userKey', '==', userKey)
    .where('expiresAt', '>', now)
    .get()
  .then(function(snapshot) {
    var stories = [];
    snapshot.forEach(function(doc) {
      var d = doc.data(); d._id = doc.id;
      stories.push(d);
    });
    applyStoryUI(stories);
  })
  .catch(function() {
    // Fallback: fetch all by userKey, filter client-side (no index needed)
    db.collection('stories')
      .where('userKey', '==', userKey)
      .get()
    .then(function(snapshot) {
      var now2 = Date.now();
      var stories = [];
      snapshot.forEach(function(doc) {
        var d = doc.data(); d._id = doc.id;
        if (d.expiresAt > now2) stories.push(d);
      });
      applyStoryUI(stories);
    })
    .catch(function(e){ console.warn('Story load failed:', e); });
  });
}

// ════════════════════════════════════════════
//  STORY VIEWER
// ════════════════════════════════════════════
function openStoryViewer(stories, user) {
  viewerStories = stories;
  viewerIndex   = 0;
  renderViewerStory(user);
  document.getElementById('story-viewer').classList.add('open');
  document.body.style.overflow = 'hidden';
  markStorySeen(user.handle || user.name || '');
}

function storyViewerClose() {
  document.getElementById('story-viewer').classList.remove('open');
  document.body.style.overflow = '';
  clearTimeout(viewerTimer);
}

function renderViewerStory(user) {
  clearTimeout(viewerTimer);
  if (viewerIndex < 0) viewerIndex = 0;
  if (viewerIndex >= viewerStories.length) { storyViewerClose(); return; }

  var s   = viewerStories[viewerIndex];
  var bg  = document.getElementById('sv-bg');
  var img = document.getElementById('sv-img-cover');
  var txt = document.getElementById('sv-story-text');

  bg.style.background = s.bg || 'linear-gradient(135deg,#667eea,#764ba2)';
  if (s.photoUrl) {
    img.src = s.photoUrl;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
  txt.textContent = s.text || '';

  // Avatar
  var av = document.getElementById('sv-avatar');
  var initial = (user.name || '?').charAt(0);
  if (user.photo) {
    av.style.backgroundImage = 'url(' + user.photo + ')';
    av.style.backgroundSize  = 'cover';
    av.innerHTML = '';
  } else {
    av.style.backgroundImage = '';
    av.innerHTML = initial;
  }

  document.getElementById('sv-name').textContent = user.handle || user.name || '';
  document.getElementById('sv-time').textContent = timeAgo(s.createdAt);

  // Progress bar
  var fill = document.getElementById('sv-progress-fill');
  fill.style.transition = 'none';
  fill.style.width = '0%';
  setTimeout(function() {
    fill.style.transition = 'width ' + viewerDuration + 'ms linear';
    fill.style.width = '100%';
  }, 30);

  // Auto advance
  viewerTimer = setTimeout(function() { storyViewNext(user); }, viewerDuration);

  // Show delete button only if this story belongs to logged-in user
  var deleteBtn = document.getElementById('sv-delete-btn');
  if (deleteBtn) {
    if (currentUserKey && s.userKey === currentUserKey) {
      deleteBtn.style.display = 'block';
    } else {
      deleteBtn.style.display = 'none';
    }
  }
}

function storyViewNext(user) {
  viewerIndex++;
  if (viewerIndex >= viewerStories.length) { storyViewerClose(); return; }
  // Re-fetch user if not passed
  if (!user) {
    var key = viewerStories[viewerIndex].userKey;
    db.collection('users').doc(key).get().then(function(doc) {
      renderViewerStory(doc.exists ? doc.data() : {name:key});
    });
  } else {
    renderViewerStory(user);
  }
}

function storyViewPrev(user) {
  viewerIndex--;
  if (viewerIndex < 0) { viewerIndex = 0; return; }
  if (!user && viewerStories[viewerIndex]) {
    var key = viewerStories[viewerIndex].userKey;
    db.collection('users').doc(key).get().then(function(doc) {
      renderViewerStory(doc.exists ? doc.data() : {name:key});
    });
  } else {
    renderViewerStory(user);
  }
}

// ════════════════════════════════════════════
//  SEEN TRACKING (localStorage)
// ════════════════════════════════════════════
function markStorySeen(key) {
  try {
    var seen = JSON.parse(localStorage.getItem('peep_seen') || '{}');
    seen[key] = Date.now();
    localStorage.setItem('peep_seen', JSON.stringify(seen));
  } catch(e){}
}

function storyWasSeen(key) {
  try {
    var seen = JSON.parse(localStorage.getItem('peep_seen') || '{}');
    if (!seen[key]) return false;
    return (Date.now() - seen[key]) < STORY_EXPIRY_MS;
  } catch(e){ return false; }
}

// ════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════
function storyDeleteCurrent() {
  var s = viewerStories[viewerIndex];
  if (!s || !s._id) { showToast('Cannot delete this story'); return; }
  if (s.userKey !== currentUserKey) { showToast('You can only delete your own stories'); return; }

  if (!confirm('Delete this story?')) return;

  db.collection('stories').doc(s._id).delete()
  .then(function() {
    showToast('✓ Story deleted');
    // Remove from local array
    viewerStories.splice(viewerIndex, 1);
    if (viewerStories.length === 0) {
      storyViewerClose();
      loadStoryStrip();
      return;
    }
    // Stay on same index (now points to next story)
    if (viewerIndex >= viewerStories.length) viewerIndex = viewerStories.length - 1;
    // Re-fetch user to render
    var key = viewerStories[viewerIndex].userKey;
    db.collection('users').doc(key).get().then(function(doc) {
      renderViewerStory(doc.exists ? doc.data() : { name: key });
    });
    loadStoryStrip();
  })
  .catch(function(err) { showToast('Error: ' + err.message); });
}

function timeAgo(ts) {
  var diff = Date.now() - ts;
  var mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return mins + 'm ago';
  var hrs = Math.floor(mins / 60);
  if (hrs < 24)  return hrs + 'h ago';
  return Math.floor(hrs / 24) + 'd ago';
}

function dataURLtoBlob(dataURL) {
  var arr  = dataURL.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n    = bstr.length;
  var u8   = new Uint8Array(n);
  while (n--) u8[n] = bstr.charCodeAt(n);
  return new Blob([u8], { type: mime });
}

// ════════════════════════════════════════════
//  HOOK INTO EXISTING FUNCTIONS
// ════════════════════════════════════════════

// After showDashboard: load the story strip
(function() {
  var _orig = window.showDashboard;
  if (typeof _orig === 'function') {
    window.showDashboard = function(user, key) {
      _orig(user, key);
      setTimeout(loadStoryStrip, 300);
    };
  }
})();

// Watch modal-name for content — fires after Firestore populates the modal
window.addEventListener('DOMContentLoaded', function() {
  var nameEl = document.getElementById('modal-name');
  if (!nameEl) return;

  var observer = new MutationObserver(function() {
    var name = nameEl.textContent.trim();
    if (!name) return; // empty = not found state, skip

    var userKey  = (document.getElementById('searchInput') || {}).value;
    if (!userKey) return;
    userKey = userKey.toLowerCase().trim();

    var handleEl = document.getElementById('modal-handle');
    var avEl     = document.getElementById('modal-avatar');
    var photo    = (avEl ? avEl.style.backgroundImage : '').replace(/url\(["']?|["']?\)/g, '');

    var userData = {
      name:   name,
      handle: handleEl ? handleEl.textContent : '',
      photo:  photo
    };

    loadProfileStory(userKey, userData);
  });

  observer.observe(nameEl, { childList: true, subtree: true, characterData: true });
});

// ════════════════════════════════════════════
//  AUTO-CLEANUP expired stories (on load)
// ════════════════════════════════════════════
window.addEventListener('load', function() {
  setTimeout(function() {
    db.collection('stories')
      .where('expiresAt', '<', Date.now())
      .get()
    .then(function(snapshot) {
      var batch = db.batch();
      snapshot.forEach(function(doc) { batch.delete(doc.ref); });
      if (!snapshot.empty) batch.commit();
    })
    .catch(function(){});
  }, 2000);
});
