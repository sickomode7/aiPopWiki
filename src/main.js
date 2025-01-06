import { marked } from 'marked';
import OpenAI from 'openai';

// Initialize DeepSeek client with proper configuration
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
  dangerouslyAllowBrowser: true // Explicitly allow browser usage
});

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const wikiContent = document.getElementById('wikiContent');

const showError = (message) => {
  wikiContent.innerHTML = `<div class="error">${message}</div>`;
};

const showLoading = () => {
  wikiContent.innerHTML = '<div class="loading">Searching the pop culture universe...</div>';
};

const renderContent = (content) => {
  wikiContent.innerHTML = marked.parse(content);
};

const searchWiki = async (query) => {
  try {
    showLoading();
    
    // Check if API key is present
    if (!import.meta.env.VITE_DEEPSEEK_API_KEY) {
      throw new Error('API key is missing. Please check your .env file.');
    }

    const response = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "You are a pop culture encyclopedia. Provide detailed, accurate information about the requested topic in markdown format. Include interesting facts, historical context, and cultural impact where relevant."
        },
        {
          role: "user",
          content: `Provide a comprehensive overview of ${query} in pop culture. Include key facts, cultural significance, and notable appearances or references.`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    if (response.choices && response.choices[0].message) {
      renderContent(response.choices[0].message.content);
    } else {
      showError('No results found. Please try a different search term.');
    }
  } catch (error) {
    console.error('API Error:', error);
    if (error.response) {
      showError(`API Error: ${error.response.status} - ${error.response.statusText}`);
    } else if (error.request) {
      showError('Network Error: Please check your internet connection.');
    } else {
      showError(`Error: ${error.message}`);
    }
  }
};

// Event listeners
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    searchWiki(query);
  } else {
    showError('Please enter a search term.');
  }
});

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    if (query) {
      searchWiki(query);
    } else {
      showError('Please enter a search term.');
    }
  }
});
