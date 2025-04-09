const searchInput = document.getElementById('search-input');
const autocompleteList = document.getElementById('autocomplete-list');
const selectedReposList = document.getElementById('selected-repos-list');

let debounceTimer;

async function fetchRepositories(query) {
  if (!query) return [];

  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc`);
    const data = await response.json();
    return data.items.slice(0, 5);
  } catch (error) {
    console.error('Ошибка при запросе данных с GitHub:', error);
    return [];
  }
}


searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();

  if (!query) {
    clearAutocomplete();
    return;
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    fetchRepositories(query).then(repositories => {
      updateAutocomplete(repositories);
    });
  }, 5000); 
});


function clearAutocomplete() {
  autocompleteList.innerHTML = '';
}


function updateAutocomplete(repositories) {
  clearAutocomplete();

  repositories.forEach(repo => {
    const item = document.createElement('li');
    item.textContent = repo.name;
    item.classList.add('autocomplete-item');

    item.addEventListener('click', () => {
      addRepository(repo);
      clearAutocomplete();
      searchInput.value = '';
    });

    autocompleteList.appendChild(item);
  });
}

function addRepository(repo) {
  const listItem = document.createElement('li');
  listItem.classList.add('repo-item');

  const info = document.createElement('div');
  info.innerHTML = `
    <strong>${repo.name}</strong> <br>
    Владелец: ${repo.owner.login} <br>
    ⭐ ${repo.stargazers_count}
  `;

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Удалить';
  removeBtn.classList.add('remove-btn');
  removeBtn.addEventListener('click', () => {
    listItem.remove();
  });

  listItem.appendChild(info);
  listItem.appendChild(removeBtn);

  selectedReposList.appendChild(listItem);
}