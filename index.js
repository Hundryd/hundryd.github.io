const SITE_VERSION_KEY = 'site_version';
const DISMISSED_VERSION_KEY = 'site_update_dismissed';
let isRefreshing = false;

function showUpdatePrompt(version) {
    const updateButton = document.getElementById('updateButton');
    if (!updateButton) return;

    updateButton.dataset.version = version;
    updateButton.classList.add('visible');
}

function hideUpdatePrompt() {
    const updateButton = document.getElementById('updateButton');
    if (updateButton) {
        updateButton.classList.remove('visible');
    }
}

async function checkForUpdate() {
    if (isRefreshing) return;

    try {
        const versionUrl = new URL('version.json', window.location.href);
        versionUrl.searchParams.set('ts', Date.now().toString());

        const response = await fetch(versionUrl, { cache: 'no-store' });
        const data = await response.json();
        const latestVersion = data.version;
        const cachedVersion = localStorage.getItem(SITE_VERSION_KEY);
        const dismissedVersion = localStorage.getItem(DISMISSED_VERSION_KEY);

        if (!cachedVersion) {
            localStorage.setItem(SITE_VERSION_KEY, latestVersion);
            return;
        }

        if (cachedVersion === latestVersion) {
            hideUpdatePrompt();
            return;
        }

        if (dismissedVersion === latestVersion) {
            hideUpdatePrompt();
            return;
        }

        showUpdatePrompt(latestVersion);
    } catch (error) {
        console.error('Error checking for updates:', error);
    }
}

function updateSite() {
    isRefreshing = true;

    const updateButton = document.getElementById('updateButton');
    const targetVersion = updateButton ? updateButton.dataset.version : null;

    hideUpdatePrompt();

    if (targetVersion) {
        localStorage.setItem(SITE_VERSION_KEY, targetVersion);
        localStorage.setItem(DISMISSED_VERSION_KEY, targetVersion);
    }

    window.location.reload();
}

document.addEventListener('DOMContentLoaded', () => {
    const updateButton = document.getElementById('updateButton');

    if (updateButton) {
        updateButton.addEventListener('click', updateSite);
    }

    checkForUpdate();
});