// Function for checking if a url is a hash
const isHash = (url) => url.includes('#');

// Function for getting the fragment identifier of the current document's url (example: #main, #software)
const getHash = (url) => /[^/]*$/.exec(url)[0];

// Function for getting a mail magnet link for an email
const emailMagnet = (email) => `mailto:${email}`;

// Function for calculating someone's age using a string in the format: YYYY/MM/DD
function getAge(date) {
    // Make 2 Date objects, one for today and one for the birth date
    const today = new Date();
    const birthDate = new Date(date);

    // Approximate age not including months
    let age = today.getFullYear() - birthDate.getFullYear();

    // Get even more precise using months
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

    return age;
}

// Function for loading an html file inside of an HTML element
async function loadContent(element, newUrl, oldUrl) {
    // Get the name of the new tab
    const newHashWithoutHash = getHash(newUrl).slice(1);

    // Page title
    document.title = '[' + newHashWithoutHash[0].toUpperCase() + newHashWithoutHash.slice(1) + '] ' + userInfo.realName;

    // Navbar brackets
    const navLink = document.getElementById(newHashWithoutHash);
    if (navLink) navLink.innerHTML = '<b>[ ' + navLink.innerHTML + ' ]</b>';
    if (oldUrl) {
        const oldLink = document.getElementById(getHash(oldUrl).slice(1));
        if (oldLink) oldLink.innerHTML = oldLink.innerHTML.slice(5, -6);
    }

    // Load the html page inside the element
    element.innerHTML = await (await fetch(`views/${newHashWithoutHash}.html`)).text();

    // Extra code to run for specific tabs
    if (newHashWithoutHash === 'projects') {
        const repoTable = document.getElementById('repos');
        fillRepositoryTable(repoTable, userInfo.githubUsername);
    } else if (newHashWithoutHash === 'main') {
        document.getElementById('age').innerHTML = getAge(userInfo.birthDate);
        document.getElementById('name').innerHTML = userInfo.realName;

        const email = document.getElementById('email');
        email.href = emailMagnet(userInfo.email);
        email.innerHTML = userInfo.email;
    }
}

// Function that fills the repository table
async function fillRepositoryTable(table, githubUsername) {
    // Put some text inside the table to inform the user it's loading
    table.innerHTML = "Fetching user's GitHub repositories...";

    // Make a get request to github to retrieve the user's repositories
    const repos = await (await fetch(`https://api.github.com/users/${githubUsername}/repos`)).json();

    // Remove the "loading" text
    table.innerHTML = '';

    // Insert 4 main rows
    const titles = ['Name', 'Description', 'License', 'Language'];
    const headerRow = table.insertRow();
    for (const title of titles) {
        const headerCell = document.createElement('th');
        headerCell.innerHTML = title;
        headerRow.appendChild(headerCell);
    }

    // For each repository of the user
    for (const repo of repos) {
        // Write the repository info to the table
        const row = table.insertRow();
        const cell1 = row.insertCell(); // Name/URL cell
        const cell2 = row.insertCell(); // Description cell
        const cell3 = row.insertCell(); // License cell
        const cell4 = row.insertCell(); // Language cell
        cell1.innerHTML = `<a target="_blank" href="${repo.html_url}">${repo.name}</a>`;
        cell2.innerHTML = repo.description;
        cell3.innerHTML = repo.license?.spdx_id || 'None';
        cell4.innerHTML = repo.language || Object.keys(await (await fetch(repo.languages_url)).json()).join(', ');
    }
}