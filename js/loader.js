// Set user specific info on the nav
document.getElementById('main').innerHTML = userInfo.realName;
document.getElementById('contact').href = emailMagnet(userInfo.email);

// Get main element (content will be placed in here)
const main = document.getElementById('content');

// Initial load of the content
await loadContent(main, isHash(document.URL) ? document.URL : '#main');

// Whenever the hash changes, update the content inside the main element
window.addEventListener('hashchange', async (event) => {
    // If the old url isn't a hash, its probably just the first page load so its the home page
    await loadContent(main, event.newURL, isHash(event.oldURL) ? event.oldURL : '#main');
});