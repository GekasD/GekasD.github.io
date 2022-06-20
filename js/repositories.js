// Make a get request to github to retrieve the user's repositories
const response = await axios.get(`https://api.github.com/users/GekasD/repos`);

// Get the repositories html table
const table = document.getElementById('repos');

// For each repository of the user
for (const repo of response.data) {
    // Write the repository info to the table
    const row = table.insertRow();
    const cell1 = row.insertCell(); // Name/URL cell
    const cell2 = row.insertCell(); // Description cell
    const cell3 = row.insertCell(); // License cell
    const cell4 = row.insertCell(); // Language cell
    cell1.innerHTML = `<a target="_blank" href="${repo.html_url}">${repo.name}</a>`;
    cell2.innerHTML = repo.description;
    cell3.innerHTML = repo.license?.spdx_id || 'None';
    cell4.innerHTML = repo.language || Object.keys((await axios.get(repo.languages_url)).data).join(', ');
}