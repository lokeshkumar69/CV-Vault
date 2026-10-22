document.addEventListener('DOMContentLoaded', () => {
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('resumeFileInput');
  const dropZoneContent = document.getElementById('dropZoneContent');
  const browseFileBtn = document.getElementById('browseFileBtn');
  const filePreviewBox = document.getElementById('filePreviewBox');
  const previewFileName = document.getElementById('previewFileName');
  const previewFileSize = document.getElementById('previewFileSize');
  const previewFileTypeIcon = document.getElementById('previewFileTypeIcon');
  const removeFileBtn = document.getElementById('removeFileBtn');
  
  const uploadForm = document.getElementById('uploadForm');
  const submitBtn = document.getElementById('submitBtn');
  const alertBox = document.getElementById('alertBox');

  const resumesContainer = document.getElementById('resumesContainer');
  const searchInput = document.getElementById('searchInput');
  const categoryFilterPills = document.getElementById('categoryFilterPills');

  const statTotalCount = document.getElementById('statTotalCount');
  const statStorageSize = document.getElementById('statStorageSize');
  const statTopCategory = document.getElementById('statTopCategory');
  const statCloudProvider = document.getElementById('statCloudProvider');
  const storageStatusText = document.getElementById('storageStatusText');
  const dbStatusText = document.getElementById('dbStatusText');

  const previewModal = document.getElementById('previewModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCandidateName = document.getElementById('modalCandidateName');
  const modalCategory = document.getElementById('modalCategory');
  const modalFileName = document.getElementById('modalFileName');
  const modalFileSize = document.getElementById('modalFileSize');
  const modalDate = document.getElementById('modalDate');
  const modalTagsContainer = document.getElementById('modalTagsContainer');
  const modalNotesBox = document.getElementById('modalNotesBox');
  const modalNotesText = document.getElementById('modalNotesText');
  const previewIframe = document.getElementById('previewIframe');
  const modalDownloadBtn = document.getElementById('modalDownloadBtn');

  let selectedFile = null;
  let activeCategoryFilter = 'All';
  let allResumes = [];

  fetchStats();
  fetchResumes();

  browseFileBtn.addEventListener('click', (e) => {
    e.preventDefault();
    fileInput.click();
  });

  dropZone.addEventListener('click', (e) => {
    if (e.target !== removeFileBtn && !removeFileBtn.contains(e.target) && e.target !== browseFileBtn) {
      fileInput.click();
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt.files && dt.files.length > 0) {
      handleFileSelected(dt.files[0]);
    }
  });

  function handleFileSelected(file) {
    selectedFile = file;
    previewFileName.textContent = file.name;
    previewFileSize.textContent = formatBytes(file.size);

    if (file.type === 'application/pdf') {
      previewFileTypeIcon.className = 'fa-solid fa-file-pdf';
    } else if (file.type.includes('word')) {
      previewFileTypeIcon.className = 'fa-solid fa-file-word';
    } else if (file.type.includes('image')) {
      previewFileTypeIcon.className = 'fa-solid fa-file-image';
    } else {
      previewFileTypeIcon.className = 'fa-solid fa-file-lines';
    }

    dropZoneContent.classList.add('hidden');
    filePreviewBox.classList.remove('hidden');
  }

  removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    selectedFile = null;
    fileInput.value = '';
    filePreviewBox.classList.add('hidden');
    dropZoneContent.classList.remove('hidden');
  });

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      showAlert('Please select a resume file to upload.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('resume', selectedFile);
    formData.append('candidateName', document.getElementById('candidateNameInput').value.trim());
    formData.append('category', document.getElementById('categorySelect').value);
    formData.append('tags', document.getElementById('tagsInput').value.trim());
    formData.append('notes', document.getElementById('notesInput').value.trim());

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Uploading to Storage...';

    try {
      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        showAlert(result.message, 'success');
        uploadForm.reset();
        selectedFile = null;
        filePreviewBox.classList.add('hidden');
        dropZoneContent.classList.remove('hidden');

        fetchStats();
        fetchResumes();
      } else {
        showAlert(result.message || 'Failed to upload resume.', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Network error while uploading resume.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Upload Resume to Vault';
    }
  });

  async function fetchResumes() {
    try {
      const search = searchInput.value.trim();
      let url = `/api/resumes?category=${encodeURIComponent(activeCategoryFilter)}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        allResumes = data.data;
        renderResumes(allResumes);
      }
    } catch (err) {
      console.error('Fetch Resumes Error:', err);
    }
  }

  function renderResumes(resumes) {
    if (resumes.length === 0) {
      resumesContainer.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-folder-open" style="font-size: 40px; margin-bottom: 12px; opacity: 0.5;"></i>
          <p>No resumes found in vault.</p>
          <span style="font-size: 12px;">Upload a new resume using the panel on the left.</span>
        </div>
      `;
      return;
    }

    resumesContainer.innerHTML = resumes.map(r => `
      <div class="resume-card">
        <div class="card-top">
          <h3 class="candidate-name">${escapeHtml(r.candidateName)}</h3>
          <span class="category-badge">${escapeHtml(r.category)}</span>
        </div>

        <div class="file-detail">
          <i class="fa-solid ${getFileIcon(r.mimeType)}"></i>
          <span title="${escapeHtml(r.originalName)}">${truncateString(r.originalName, 26)}</span>
        </div>

        <div class="tags-row">
          ${(r.tags || []).map(tag => `<span class="tag-chip">#${escapeHtml(tag)}</span>`).join('')}
        </div>

        <div class="card-bottom">
          <span class="card-date">${formatDate(r.createdAt)} • ${formatBytes(r.size)}</span>
          <div class="card-actions">
            <button class="action-btn" onclick="openPreviewModal('${r._id}')" title="Preview & View Details">
              <i class="fa-solid fa-eye"></i>
            </button>
            <a class="action-btn" href="${r.fileUrl}" target="_blank" download title="Download Resume">
              <i class="fa-solid fa-download"></i>
            </a>
            <button class="action-btn delete-btn" onclick="deleteResume('${r._id}', '${escapeHtml(r.candidateName)}')" title="Delete Resume">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  async function fetchStats() {
    try {
      const res = await fetch('/api/resumes/stats/summary');
      const result = await res.json();

      if (result.success) {
        const { totalCount, totalSizeMB, categoriesCount, storageProvider, dbStatus } = result.data;
        statTotalCount.textContent = totalCount;
        statStorageSize.textContent = totalSizeMB;

        let topCat = 'General';
        let maxCount = 0;
        for (const [cat, count] of Object.entries(categoriesCount || {})) {
          if (count > maxCount) {
            maxCount = count;
            topCat = cat;
          }
        }
        statTopCategory.textContent = topCat;

        const isAzure = storageProvider === 'azure';
        statCloudProvider.textContent = isAzure ? 'Azure Blob' : 'Local Disk';
        storageStatusText.textContent = `Storage: ${isAzure ? 'Azure Blob Storage' : 'Local (Dev Fallback)'}`;
        dbStatusText.textContent = dbStatus;
      }
    } catch (err) {
      console.error('Stats Error:', err);
    }
  }

  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(fetchResumes, 300);
  });

  categoryFilterPills.addEventListener('click', (e) => {
    if (e.target.classList.contains('pill')) {
      document.querySelectorAll('.filter-pills .pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      activeCategoryFilter = e.target.getAttribute('data-category');
      fetchResumes();
    }
  });

  window.openPreviewModal = (id) => {
    const resume = allResumes.find(r => r._id === id);
    if (!resume) return;

    modalCandidateName.textContent = resume.candidateName;
    modalCategory.textContent = resume.category;
    modalFileName.textContent = resume.originalName;
    modalFileSize.textContent = formatBytes(resume.size);
    modalDate.textContent = formatDate(resume.createdAt);

    modalTagsContainer.innerHTML = (resume.tags || [])
      .map(t => `<span class="tag-chip">#${escapeHtml(t)}</span>`)
      .join('');

    if (resume.notes) {
      modalNotesText.textContent = resume.notes;
      modalNotesBox.classList.remove('hidden');
    } else {
      modalNotesBox.classList.add('hidden');
    }

    previewIframe.src = resume.fileUrl;
    modalDownloadBtn.href = resume.fileUrl;

    previewModal.classList.remove('hidden');
  };

  modalCloseBtn.addEventListener('click', () => {
    previewModal.classList.add('hidden');
    previewIframe.src = '';
  });

  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) {
      previewModal.classList.add('hidden');
      previewIframe.src = '';
    }
  });

  window.deleteResume = async (id, candidateName) => {
    if (!confirm(`Are you sure you want to delete resume for "${candidateName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      const result = await res.json();

      if (result.success) {
        showAlert(`Resume for ${candidateName} deleted successfully.`, 'success');
        fetchStats();
        fetchResumes();
      } else {
        showAlert(result.message || 'Failed to delete resume.', 'error');
      }
    } catch (err) {
      showAlert('Error deleting resume.', 'error');
    }
  };

  function showAlert(msg, type) {
    alertBox.textContent = msg;
    alertBox.className = `alert-box alert-${type}`;
    alertBox.classList.remove('hidden');

    setTimeout(() => {
      alertBox.classList.add('hidden');
    }, 4000);
  }

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function getFileIcon(mime) {
    if (mime.includes('pdf')) return 'fa-file-pdf';
    if (mime.includes('word')) return 'fa-file-word';
    if (mime.includes('image')) return 'fa-file-image';
    return 'fa-file-lines';
  }

  function truncateString(str, num) {
    if (str.length <= num) return str;
    return str.slice(0, num) + '...';
  }

  function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }
});
