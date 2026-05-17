// ══════════════════════════════════════════
//  PEEP COVER PHOTO SYSTEM
//  Add <script src="cover.js"></script>
//  just before </body> in index.html
//  (after script.js and stories.js)
// ══════════════════════════════════════════

// ════════════════════════════════════════════
//  INJECT COVER CSS
// ════════════════════════════════════════════
(function injectCoverCSS() {
  var style = document.createElement('style');
  style.textContent = `

    /* ── Dashboard cover ── */
    #dash-cover-wrap {
      position: relative;
      width: 100%;
      height: 140px;
      background: linear-gradient(135deg,#667eea,#764ba2);
      border-radius: 10px 10px 0 0;
      overflow: hidden;
      margin-bottom: 0;
      flex-shrink: 0;
    }
    #dash-cover-img {
      width: 100%; height: 100%;
      object-fit: cover; display: none;
    }
    #dash-cover-edit-btn {
      position: absolute; bottom: 10px; right: 10px;
      background: rgba(0,0,0,0.45);
      border: 1px solid rgba(255,255,255,0.3);
      color: white; padding: 5px 12px;
      border-radius: 20px; font-size: 11px;
      font-weight: 600; cursor: pointer;
      font-family: inherit; backdrop-filter: blur(4px);
      display: flex; align-items: center; gap: 5px;
      transition: background 0.15s;
    }
    #dash-cover-edit-btn:hover { background: rgba(0,0,0,0.65); }

    /* Make the first dash-card top corners flat when cover is above it */
    .dash-card.with-cover {
      border-radius: 0 0 10px 10px;
      border-top: none;
      margin-top: 0;
    }

    /* Avatar sits on the cover edge */
    .cover-avatar-wrap {
      position: relative;
      margin-top: -32px;
      margin-left: 0;
      width: fit-content;
    }
    #dash-avatar.on-cover {
      border: 3px solid #ffffff;
      box-shadow: 0 2px 8px rgba(27,31,36,0.18);
    }

    /* ── Profile modal cover ── */
    #modal-cover-wrap {
      width: 100%;
      height: 160px;
      background: linear-gradient(135deg,#667eea,#764ba2);
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }
    #modal-cover-img {
      width: 100%; height: 100%;
      object-fit: cover; display: none;
    }

    /* Avatar overlapping cover in modal */
    #modal-avatar.with-cover {
      margin-top: -44px;
      border: 3px solid white !important;
      box-shadow: 0 2px 12px rgba(27,31,36,0.2) !important;
      position: relative;
      z-index: 2;
    }

    /* ── Cover upload modal ── */
    #cover-upload-modal {
      display: none;
      position: fixed; inset: 0;
      background: rgba(27,31,36,0.6);
      z-index: 5000;
      align-items: center; justify-content: center;
    }
    #cover-upload-modal.open { display: flex; }
    .cover-modal-box {
      background: #fff;
      border-radius: 14px;
      border: 1px solid #d0d7de;
      width: 100%; max-width: 400px;
      padding: 24px; margin: 0 16px;
      box-shadow: 0 12px 40px rgba(27,31,36,0.18);
      animation: coverSlideUp 0.22s ease;
    }
    @keyframes coverSlideUp {
      from { transform: translateY(20px); opacity:0; }
      to   { transform: translateY(0);    opacity:1; }
    }
    .cover-modal-box h3 {
      font-size: 16px; font-weight: 700;
      color: #24292f; margin-bottom: 4px;
    }
    .cover-modal-box p {
      font-size: 12px; color: #57606a; margin-bottom: 18px;
    }
    .cover-preview-box {
      width: 100%; height: 120px;
      border-radius: 10px; overflow: hidden;
      background: linear-gradient(135deg,#667eea,#764ba2);
      margin-bottom: 14px; position: relative;
      border: 1px solid #d0d7de;
    }
    .cover-preview-box img {
      width: 100%; height: 100%;
      object-fit: cover; display: none;
    }
    .cover-drop-zone {
      width: 100%; padding: 14px;
      border: 2px dashed #d0d7de;
      border-radius: 10px; text-align: center;
      cursor: pointer; margin-bottom: 14px;
      color: #57606a; font-size: 13px;
      transition: border-color 0.15s, color 0.15s;
    }
    .cover-drop-zone:hover { border-color: #667eea; color: #667eea; }
    .cover-drop-zone i { font-size: 22px; display: block; margin-bottom: 6px; }
    .cover-save-btn {
      width: 100%; padding: 10px; border-radius: 8px;
      border: none; background: linear-gradient(135deg,#667eea,#764ba2);
      color: white; font-size: 14px; font-family: inherit;
      font-weight: 700; cursor: pointer;
    }
    .cover-save-btn:hover { opacity: 0.9; }
    .cover-cancel-btn {
      width: 100%; padding: 9px; border-radius: 8px;
      border: 1px solid #d0d7de; background: #f6f8fa;
      color: #57606a; font-size: 14px; font-family: inherit;
      cursor: pointer; margin-top: 6px;
    }
    .cover-remove-btn {
      width: 100%; padding: 9px; border-radius: 8px;
      border: 1px solid #ffcdd2; background: #fff5f5;
      color: #cf222e; font-size: 13px; font-family: inherit;
      cursor: pointer; margin-top: 6px; font-weight: 600;
    }

    /* Gradient presets row */
    .cover-gradient-row {
      display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px;
    }
    .cover-gradient-swatch {
      width: 36px; height: 36px; border-radius: 8px;
      cursor: pointer; border: 2px solid transparent;
      transition: transform 0.15s, border-color 0.15s;
      flex-shrink: 0;
    }
    .cover-gradient-swatch:hover { transform: scale(1.1); }
    .cover-gradient-swatch.sel { border-color: #24292f; transform: scale(1.1); }

    /* Registration step 2 cover upload */
    #reg-cover-section {
      margin-bottom: 14px;
    }
    .reg-cover-preview {
      width: 100%; height: 90px; border-radius: 10px;
      background: linear-gradient(135deg,#667eea,#764ba2);
      overflow: hidden; position: relative;
      margin-bottom: 8px; cursor: pointer;
      border: 1px solid #d0d7de;
      display: flex; align-items: center; justify-content: center;
    }
    .reg-cover-preview img {
      width: 100%; height: 100%;
      object-fit: cover; display: none; position: absolute; inset: 0;
    }
    .reg-cover-hint {
      color: rgba(255,255,255,0.85); font-size: 12px;
      font-weight: 600; display: flex;
      align-items: center; gap: 6px; z-index: 1;
    }

    @media (max-width: 480px) {
      #dash-cover-wrap { height: 110px; }
      #modal-cover-wrap { height: 130px; }
    }
  `;
  document.head.appendChild(style);
})();

// ════════════════════════════════════════════
//  GRADIENT PRESETS
// ════════════════════════════════════════════
var COVER_GRADIENTS = [
  'linear-gradient(135deg,#667eea,#764ba2)',
  'linear-gradient(135deg,#f09433,#dc2743)',
  'linear-gradient(135deg,#11998e,#38ef7d)',
  'linear-gradient(135deg,#f7971e,#ffd200)',
  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'linear-gradient(135deg,#f953c6,#b91d73)',
  'linear-gradient(135deg,#2c3e50,#4ca1af)',
  'linear-gradient(135deg,#24292f,#57606a)',
];

// ════════════════════════════════════════════
//  STATE
// ════════════════════════════════════════════
var coverDataUrl     = null;   // local preview
var coverUploadedUrl = null;   // Cloudinary URL after upload
var coverSelectedBg  = COVER_GRADIENTS[0];
var regCoverDataUrl  = null;
var regCoverUrl      = null;

// ════════════════════════════════════════════
//  INJECT HTML
// ════════════════════════════════════════════
(function injectCoverHTML() {

  // ── Cover upload modal ──
  var modal = document.createElement('div');
  modal.id = 'cover-upload-modal';
  modal.innerHTML = `
    <div class="cover-modal-box">
      <h3>🖼️ Cover Photo</h3>
      <p>This is the banner behind your profile photo.</p>

      <div class="cover-preview-box" id="cover-modal-preview-box">
        <img id="cover-modal-preview-img" alt="">
      </div>

      <p style="font-size:11px;font-weight:600;color:#57606a;margin-bottom:8px;">Choose a gradient:</p>
      <div class="cover-gradient-row" id="cover-gradient-row"></div>

      <div class="cover-drop-zone" onclick="document.getElementById('cover-file-input').click()">
        <i class="fas fa-image"></i>
        Tap to upload your own photo
        <div style="font-size:11px;color:#8c959f;margin-top:4px;">JPG, PNG — max 5MB</div>
      </div>
      <input type="file" id="cover-file-input" accept="image/*" style="display:none;" onchange="coverFileSelected(this)">

      <button class="cover-save-btn" onclick="coverSave()">💾 Save Cover</button>
      <button class="cover-remove-btn" id="cover-remove-btn" onclick="coverRemove()" style="display:none;">✕ Remove cover photo</button>
      <button class="cover-cancel-btn" onclick="coverModalClose()">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);

  // Build gradient swatches
  var row = document.getElementById('cover-gradient-row');
  COVER_GRADIENTS.forEach(function(g, i) {
    var sw = document.createElement('div');
    sw.className = 'cover-gradient-swatch' + (i === 0 ? ' sel' : '');
    sw.style.background = g;
    sw.onclick = function() {
      document.querySelectorAll('.cover-gradient-swatch').forEach(function(s){ s.classList.remove('sel'); });
      sw.classList.add('sel');
      coverSelectedBg = g;
      // Clear uploaded photo, show gradient
      coverDataUrl = null;
      coverUploadedUrl = null;
      document.getElementById('cover-file-input').value = '';
      var img = document.getElementById('cover-modal-preview-img');
      img.style.display = 'none';
      document.getElementById('cover-modal-preview-box').style.background = g;
    };
    row.appendChild(sw);
  });

  // Close on backdrop click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) coverModalClose();
  });

})();

// ════════════════════════════════════════════
//  INJECT DASHBOARD COVER
// ════════════════════════════════════════════
function injectDashCover() {
  var dashCard = document.querySelector('.dash-container .dash-card');
  if (!dashCard || document.getElementById('dash-cover-wrap')) return;

  // Build cover wrap
  var coverWrap = document.createElement('div');
  coverWrap.id = 'dash-cover-wrap';
  coverWrap.innerHTML =
    '<img id="dash-cover-img" alt="Cover photo">' +
    '<button id="dash-cover-edit-btn" onclick="coverModalOpen()"><i class="fas fa-camera"></i> Edit cover</button>';

  // Insert before first dash-card
  dashCard.parentNode.insertBefore(coverWrap, dashCard);
  dashCard.classList.add('with-cover');
}

// ════════════════════════════════════════════
//  INJECT MODAL COVER (search profile view)
// ════════════════════════════════════════════
function injectModalCover() {
  var modal = document.getElementById('searchModal');
  if (!modal || document.getElementById('modal-cover-wrap')) return;

  // The sticky top bar is first child, then profile hero
  // We inject the cover wrap inside the profile hero div
  var heroDiv = modal.querySelector('div[style*="text-align:center"]');
  if (!heroDiv) return;

  var coverWrap = document.createElement('div');
  coverWrap.id = 'modal-cover-wrap';
  coverWrap.innerHTML = '<img id="modal-cover-img" alt="Cover photo">';

  // Insert at the very top of heroDiv
  heroDiv.insertBefore(coverWrap, heroDiv.firstChild);
}

// ════════════════════════════════════════════
//  OPEN / CLOSE COVER MODAL
// ════════════════════════════════════════════
function coverModalOpen() {
  document.getElementById('cover-upload-modal').classList.add('open');

  // Show remove button only if user already has a cover
  var hasExisting = false;
  db.collection('users').doc(currentUserKey).get().then(function(doc) {
    if (doc.exists && doc.data().cover) {
      hasExisting = true;
      document.getElementById('cover-remove-btn').style.display = 'block';
      // Show existing cover in preview
      var img = document.getElementById('cover-modal-preview-img');
      img.src = doc.data().cover;
      img.style.display = 'block';
      document.getElementById('cover-modal-preview-box').style.background = 'none';
    } else {
      document.getElementById('cover-remove-btn').style.display = 'none';
    }
  });
}

function coverModalClose() {
  document.getElementById('cover-upload-modal').classList.remove('open');
  coverDataUrl = null;
  coverUploadedUrl = null;
}

// ════════════════════════════════════════════
//  FILE SELECTED
// ════════════════════════════════════════════
function coverFileSelected(input) {
  var file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Photo must be under 5MB'); return; }

  var reader = new FileReader();
  reader.onload = function(e) {
    coverDataUrl = e.target.result;
    var img = document.getElementById('cover-modal-preview-img');
    img.src = coverDataUrl;
    img.style.display = 'block';
    document.getElementById('cover-modal-preview-box').style.background = 'none';
    // Deselect gradient swatches
    document.querySelectorAll('.cover-gradient-swatch').forEach(function(s){ s.classList.remove('sel'); });
  };
  reader.readAsDataURL(file);
}

// ════════════════════════════════════════════
//  SAVE COVER
// ════════════════════════════════════════════
function coverSave() {
  if (!currentUserKey) { showToast('Please sign in first'); return; }

  if (coverDataUrl) {
    // Upload photo to Cloudinary
    showToast('Uploading cover photo...');
    var blob = dataURLtoBlobCover(coverDataUrl);
    var fd   = new FormData();
    fd.append('file', blob);
    fd.append('upload_preset', 'i7q7kwai');
    fd.append('cloud_name', 'dlrhbfvyb');
    fetch('https://api.cloudinary.com/v1_1/dlrhbfvyb/image/upload', { method:'POST', body:fd })
    .then(function(r){ return r.json(); })
    .then(function(data) {
      coverUploadedUrl = data.secure_url;
      saveCoverToFirestore(coverUploadedUrl, null);
    })
    .catch(function(){ showToast('Upload failed. Try again.'); });

  } else {
    // Save gradient
    saveCoverToFirestore(null, coverSelectedBg);
  }
}

function saveCoverToFirestore(photoUrl, gradient) {
  var update = {};
  if (photoUrl)  update.cover         = photoUrl;
  if (gradient)  update.coverGradient = gradient;
  if (!photoUrl) update.cover         = '';   // clear photo if gradient chosen

  db.collection('users').doc(currentUserKey).update(update)
  .then(function() {
    showToast('✓ Cover updated!');
    coverModalClose();
    applyDashCover(photoUrl, gradient);
  })
  .catch(function(err){ showToast('Error: ' + err.message); });
}

function coverRemove() {
  if (!currentUserKey) return;
  db.collection('users').doc(currentUserKey).update({ cover: '', coverGradient: '' })
  .then(function() {
    showToast('✓ Cover removed');
    coverModalClose();
    applyDashCover(null, COVER_GRADIENTS[0]);
  });
}

// ════════════════════════════════════════════
//  APPLY COVER TO DASHBOARD
// ════════════════════════════════════════════
function applyDashCover(photoUrl, gradient) {
  var wrap = document.getElementById('dash-cover-wrap');
  var img  = document.getElementById('dash-cover-img');
  if (!wrap || !img) return;

  if (photoUrl) {
    img.src = photoUrl;
    img.style.display = 'block';
    wrap.style.background = 'none';
  } else {
    img.style.display = 'none';
    wrap.style.background = gradient || COVER_GRADIENTS[0];
  }
}

// ════════════════════════════════════════════
//  APPLY COVER TO PROFILE MODAL
// ════════════════════════════════════════════
function applyModalCover(photoUrl, gradient) {
  var wrap = document.getElementById('modal-cover-wrap');
  var img  = document.getElementById('modal-cover-img');
  if (!wrap || !img) return;

  if (photoUrl) {
    img.src = photoUrl;
    img.style.display = 'block';
    wrap.style.background = 'none';
  } else {
    img.style.display = 'none';
    wrap.style.background = gradient || COVER_GRADIENTS[0];
  }

  // Make avatar overlap the cover
  var av = document.getElementById('modal-avatar');
  if (av) av.classList.add('with-cover');
}

// ════════════════════════════════════════════
//  LOAD COVER ON DASHBOARD
// ════════════════════════════════════════════
function loadDashCover() {
  if (!currentUserKey) return;
  db.collection('users').doc(currentUserKey).get().then(function(doc) {
    if (!doc.exists) return;
    var user = doc.data();
    applyDashCover(user.cover || null, user.coverGradient || COVER_GRADIENTS[0]);
  });
}

// ════════════════════════════════════════════
//  LOAD COVER ON SEARCH MODAL
// ════════════════════════════════════════════
function loadModalCover(userKey) {
  db.collection('users').doc(userKey).get().then(function(doc) {
    if (!doc.exists) return;
    var user = doc.data();
    applyModalCover(user.cover || null, user.coverGradient || COVER_GRADIENTS[0]);
  });
}

// ════════════════════════════════════════════
//  REGISTRATION — cover upload in step 2
// ════════════════════════════════════════════
function injectRegCoverField() {
  // Find step 2 panel and inject cover picker after the "Full name" label
  var panel2 = document.getElementById('rpanel-2');
  if (!panel2 || document.getElementById('reg-cover-section')) return;

  var section = document.createElement('div');
  section.id = 'reg-cover-section';
  section.innerHTML =
    '<label style="font-size:13px;font-weight:600;color:#24292f;display:block;margin-bottom:6px;">Cover photo <span style="color:#57606a;font-weight:400;">(optional)</span></label>' +
    '<div class="reg-cover-preview" onclick="document.getElementById(\'reg-cover-input\').click()" id="reg-cover-preview">' +
    '  <img id="reg-cover-preview-img" alt="">' +
    '  <span class="reg-cover-hint"><i class="fas fa-camera"></i> Add a cover photo</span>' +
    '</div>' +
    '<input type="file" id="reg-cover-input" accept="image/*" style="display:none;" onchange="regCoverFileSelected(this)">';

  // Insert before the Full name label in step 2
  var authBox2 = panel2.querySelector('.auth-box');
  // After the Back button and step indicator, find first label
  var firstLabel = authBox2.querySelector('label');
  if (firstLabel) {
    authBox2.insertBefore(section, firstLabel);
  } else {
    authBox2.appendChild(section);
  }
}

function regCoverFileSelected(input) {
  var file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Photo must be under 5MB'); return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    regCoverDataUrl = e.target.result;
    var img = document.getElementById('reg-cover-preview-img');
    img.src = regCoverDataUrl;
    img.style.display = 'block';
    var hint = document.querySelector('#reg-cover-preview .reg-cover-hint');
    if (hint) hint.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function uploadRegCoverAndSave(userKey, callback) {
  if (!regCoverDataUrl) { callback(null); return; }
  showToast('Uploading cover photo...');
  var blob = dataURLtoBlobCover(regCoverDataUrl);
  var fd   = new FormData();
  fd.append('file', blob);
  fd.append('upload_preset', 'i7q7kwai');
  fd.append('cloud_name', 'dlrhbfvyb');
  fetch('https://api.cloudinary.com/v1_1/dlrhbfvyb/image/upload', { method:'POST', body:fd })
  .then(function(r){ return r.json(); })
  .then(function(data){ callback(data.secure_url); })
  .catch(function(){ callback(null); });
}

// ════════════════════════════════════════════
//  HOOK INTO showDashboard
// ════════════════════════════════════════════
(function() {
  var _orig = window.showDashboard;
  if (typeof _orig !== 'function') return;
  window.showDashboard = function(user, key) {
    _orig(user, key);
    setTimeout(function() {
      injectDashCover();
      loadDashCover();
    }, 500);
  };
})();

// ════════════════════════════════════════════
//  HOOK INTO SEARCH MODAL — MutationObserver
// ════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', function() {
  var nameEl = document.getElementById('modal-name');
  if (!nameEl) return;

  var observer = new MutationObserver(function() {
    var name = nameEl.textContent.trim();
    if (!name) return;

    var userKey = (document.getElementById('searchInput') || {}).value;
    if (!userKey) return;
    userKey = userKey.toLowerCase().trim();

    // Inject cover wrap if not already there
    setTimeout(function() {
      injectModalCover();
      loadModalCover(userKey);
    }, 50);
  });

  observer.observe(nameEl, { childList: true, subtree: true, characterData: true });
});

// ════════════════════════════════════════════
//  HOOK INTO REGISTRATION — inject cover field
// ════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', function() {
  // Inject cover field into reg step 2 once DOM is ready
  setTimeout(injectRegCoverField, 500);

  // Also re-inject when showAuth is called (in case DOM wasn't ready)
  var _origShowAuth = window.showAuth;
  if (typeof _origShowAuth === 'function') {
    window.showAuth = function(type) {
      _origShowAuth(type);
      if (type === 'register') {
        setTimeout(injectRegCoverField, 200);
        regCoverDataUrl = null;
        regCoverUrl     = null;
      }
    };
  }
});

// ════════════════════════════════════════════
//  HOOK INTO register() to save cover
// ════════════════════════════════════════════
(function() {
  var _origRegister = window.register;
  if (typeof _origRegister !== 'function') return;

  window.register = function() {
    // If no cover photo, just run normally
    if (!regCoverDataUrl) { _origRegister(); return; }

    // Upload cover first, then run original register
    uploadRegCoverAndSave(null, function(coverUrl) {
      regCoverUrl = coverUrl;

      // Patch db.collection to intercept the .set() call
      // and inject the cover URL into the user document
      var _origSet = db.collection('users').doc;

      // We'll override the Firestore set on the fly
      // by temporarily wrapping db.collection
      var _origDbCollection = db.collection.bind(db);
      db.collection = function(name) {
        var colRef = _origDbCollection(name);
        if (name === 'users') {
          var _origDoc = colRef.doc.bind(colRef);
          colRef.doc = function(key) {
            var docRef = _origDoc(key);
            var _origSetFn = docRef.set.bind(docRef);
            docRef.set = function(data, options) {
              if (coverUrl) data.cover = coverUrl;
              // Restore original
              db.collection = _origDbCollection;
              return _origSetFn(data, options);
            };
            return docRef;
          };
        }
        return colRef;
      };

      _origRegister();
    });
  };
})();

// ════════════════════════════════════════════
//  HELPER
// ════════════════════════════════════════════
function dataURLtoBlobCover(dataURL) {
  var arr  = dataURL.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n    = bstr.length;
  var u8   = new Uint8Array(n);
  while (n--) u8[n] = bstr.charCodeAt(n);
  return new Blob([u8], { type: mime });
}
