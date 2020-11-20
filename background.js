var rxLookfor = /^(.*)(kayako\.com\/agent\/conversations\/)[1-9]\d*$/;
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      if (rxLookfor.test(changeInfo.url)) {
        chrome.tabs.sendMessage(tabId, 'url-update');   
      }
});
