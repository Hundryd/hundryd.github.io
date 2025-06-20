async function checkForUpdate() {
    try {
      const response = await fetch('/version.json', { cache: 'no-store' });
      const data = await response.json();
      const latestVersion = data.version;
  
      const cachedVersion = localStorage.getItem('site_version');
  
      if (cachedVersion !== latestVersion) {
        const updateButton = document.getElementById('updateButton');
        updateButton.style.display = 'block';
        updateButton.dataset.version = latestVersion; // Store version for updateSite()
      }
    } catch (error) {
      console.error('Error checking for updates:', error);
    }
  }
  
  function updateSite() {
    const updateButton = document.getElementById('updateButton');
    localStorage.setItem('site_version', updateButton.dataset.version); // Store the latest version
    location.reload(true); // Force refresh
  }
  
  // Run update check when the page loads
  document.addEventListener("DOMContentLoaded", checkForUpdate);
