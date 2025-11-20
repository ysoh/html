import './style.css'
import { categories } from './data.js'

document.querySelector('#app').innerHTML = `
  <header>
    <h1>컴퓨터정보학과 실습서버</h1>
    <div class="controls">
      <div class="search-container">
        <input type="text" id="search-input" placeholder="검색어를 입력하세요..." aria-label="Search">
      </div>
      <button id="theme-toggle" class="theme-toggle" aria-label="Toggle Theme">
        🌙
      </button>
    </div>
  </header>
  <main id="content">
    <!-- Categories will be injected here -->
  </main>
`

const contentContainer = document.getElementById('content')
const searchInput = document.getElementById('search-input')
const themeToggle = document.getElementById('theme-toggle')

// Theme Management
const savedTheme = localStorage.getItem('theme') || 'light'
document.documentElement.setAttribute('data-theme', savedTheme)
updateThemeIcon(savedTheme)

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme')
  const newTheme = currentTheme === 'light' ? 'dark' : 'light'

  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
  updateThemeIcon(newTheme)
})

function updateThemeIcon(theme) {
  themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️'
}

// Rendering
function renderCategories(filterText = '') {
  const normalizedFilter = filterText.toLowerCase()

  const filteredCategories = categories.map(category => {
    const filteredLinks = category.links.filter(link =>
      link.name.toLowerCase().includes(normalizedFilter) ||
      link.url.toLowerCase().includes(normalizedFilter)
    )

    return {
      ...category,
      links: filteredLinks
    }
  }).filter(category => category.links.length > 0)

  if (filteredCategories.length === 0) {
    contentContainer.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-color);">
        검색 결과가 없습니다. 😢
      </div>
    `
    return
  }

  contentContainer.innerHTML = filteredCategories.map(category => `
    <div class="category-card">
      <h2 class="category-title">${category.title}</h2>
      <ul class="link-list">
        ${category.links.map(link => `
          <li class="link-item">
            <a href="${link.url}" target="_blank" rel="noopener noreferrer">
              <span class="link-icon">${link.icon}</span>
              <span class="link-text">${link.name}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('')
}

// Search Listener
searchInput.addEventListener('input', (e) => {
  renderCategories(e.target.value)
})

// Initial Render
renderCategories()
