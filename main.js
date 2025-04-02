const searchInput = document.getElementById('search-input');
const autocompleteList = document.getElementById('autocomplete-list');
const selectedReposList = document.getElementById('selected-repos-list');
let debounceTimer;


async function fetchRepositories(query) {
    if (!query) return [];

    try {
        const response = await fetch(`https://api.github.com/search/repositories?q=${query}&sort=stars&order=desc`);
        const data = await response.json();
        return data.items.slice(0, 5); 
    } catch (error) {
        console.error('Ошибка при запросе данных с GitHub:', error);
        return [];
    }
}


function debounce(func, delay) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(func, delay);
}


searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim();

    if (!query) {
        autocompleteList.innerHTML = ''; 
        return;
    }

    debounce(() => {
        fetchRepositories(query).then(repositories => {
            autocompleteList.innerHTML = ''; 
            repositories.forEach(repo => {
                const listItem = document.createElement('li');
                listItem.textContent = repo.name;
                listItem.addEventListener('click', () => {
                    addRepository(repo);
                });
                autocompleteList.appendChild(listItem);
            });
        });
    }, 300); 
});

function addRepository(repo) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        ${repo.name} - ${repo.owner.login} - ${repo.stargazers_count} звезд
        <button onclick="removeRepository(this)">Удалить</button>
    `;
    selectedReposList.appendChild(listItem);
    searchInput.value = ''; 
    autocompleteList.innerHTML = ''; 
}

function removeRepository(button) {
    const listItem = button.parentElement;
    selectedReposList.removeChild(listItem);
}