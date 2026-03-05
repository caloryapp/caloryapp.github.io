const PopupApp = () => {
  const openInFullTab = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('index.html')
    })
  }

  // TODO: add translations
  return (
    <div class="container">
      <header>
        <h1>Calory</h1>
      </header>

      <main>
        <p>Welcome to Calory!</p>
        <p>Your meal planning extension is ready to use.</p>

        <button id="openFullTab" class="btn" onClick={openInFullTab}>
          Open in Full Tab
        </button>
      </main>
    </div>
  )
}

export default PopupApp
