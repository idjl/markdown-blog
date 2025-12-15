
// Search functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const noResults = document.getElementById('no-results');
  
  if (!searchInput || !searchResults) return;
  
  let searchTimeout;
  let posts = [];
  
  // Load search index
  fetch('/search-index.json')
    .then(response => response.json())
    .then(data => {
      posts = data;
    })
    .catch(error => {
      console.error('Failed to load search index:', error);
    });
  
  // Search function
  function search(query) {
    if (!query.trim()) {
      searchResults.innerHTML = '';
      noResults.classList.add('hidden');
      return;
    }
    
    const results = posts.filter(post => {
      const searchTerm = query.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        (post.category && post.category.toLowerCase().includes(searchTerm)) ||
        (post.description && post.description.toLowerCase().includes(searchTerm))
      );
    }).slice(0, 10);
    
    displayResults(results, query);
  }
  
  // Display search results
  function displayResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = '';
      noResults.classList.remove('hidden');
      return;
    }
    
    noResults.classList.add('hidden');
    
    const html = results.map(post => {
      const excerpt = highlightText(post.excerpt || '', query);
      const title = highlightText(post.title, query);
      
      return `
        <div class="search-result">
          <div class="search-result-title">
            <a href="${post.url}" class="text-primary hover:underline">
              ${title}
            </a>
          </div>
          <div class="search-result-excerpt">
            ${excerpt}
          </div>
          <div class="search-result-meta">
            <time>${post.date}</time>
            ${post.readingTime ? ` • ${post.readingTime} 分钟阅读` : ''}
            ${post.category ? ` • <span>${post.category}</span>` : ''}
          </div>
        </div>
      `;
    }).join('');
    
    searchResults.innerHTML = html;
  }
  
  // Highlight search terms
  function highlightText(text, query) {
    const regex = new RegExp('(' + query + ')', 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>');
  }
  
  // Search input event
  searchInput.addEventListener('input', function(e) {
    clearTimeout(searchTimeout);
    const query = e.target.value;
    
    searchTimeout = setTimeout(() => {
      search(query);
    }, 300);
  });
  
  // Initial search if query exists
  const urlParams = new URLSearchParams(window.location.search);
  const query = urlParams.get('q');
  if (query) {
    searchInput.value = query;
    search(query);
  }
});
