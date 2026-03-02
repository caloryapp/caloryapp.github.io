// Calory - Main Script

document.addEventListener('DOMContentLoaded', () => {
  console.log('Calory loaded')

  // Initialize the extension
  initializeExtension()

  // Add event listener for "Open in Full Tab" button
  const openFullTabButton = document.getElementById('openFullTab')
  if (openFullTabButton) {
    openFullTabButton.addEventListener('click', openInFullTab)
  }
})

/**
 * Initialize the extension
 */
function initializeExtension(): void {
  // Load saved data from Chrome storage
  loadStorageData()
}

/**
 * Load data from Chrome storage
 */
function loadStorageData(): void {
  chrome.storage.sync.get(['calorieRange', 'sections'], (result) => {
    console.log('Loaded data:', result)

    // Future: handle loaded data here
  })
}

/**
 * Save data to Chrome storage
 */
function saveStorageData(data: Record<string, any>): void {
  chrome.storage.sync.set(data, () => {
    console.log('Data saved:', data)
  })
}

/**
 * Open the app in a full tab
 */
function openInFullTab(): void {
  chrome.tabs.create({
    url: chrome.runtime.getURL('app.html')
  })

  // Close the popup after opening the tab
  window.close()
}
