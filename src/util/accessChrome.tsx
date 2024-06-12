function accessChrome() {
  //@ts-ignore
  if (window.chrome) {
    //@ts-ignore
    window.chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var activeTab = tabs[0];
      var faviconUrl = activeTab.favIconUrl;
    })

  }
}