import './style.css';
import { playSound } from './utils/speech.js';
import { renderRoadmapView } from './views/roadmapView.js';
import { renderLessonsView } from './views/lessonsView.js';
import { renderPinyinView } from './views/pinyinView.js';
import { renderVocabView } from './views/vocabView.js';
import { renderFlashcardView } from './views/flashcardView.js';
import { renderRadicalsView } from './views/radicalsView.js';
import { renderGrammarView } from './views/grammarView.js';
import { renderQuizView } from './views/quizView.js';

// --- Quản lý chuỗi ngày học liên tục (Streak) ---
function updateLearningStreak() {
  const today = new Date().toISOString().split('T')[0];
  const lastActive = localStorage.getItem('hsk_last_active_date');
  let streak = parseInt(localStorage.getItem('hsk_streak_days') || '1', 10);

  if (lastActive) {
    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffDays = Math.round((currentDate - lastDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Ngày liên tiếp
      streak += 1;
      localStorage.setItem('hsk_streak_days', streak.toString());
    } else if (diffDays > 1) {
      // Đứt chuỗi, bắt đầu lại
      streak = 1;
      localStorage.setItem('hsk_streak_days', '1');
    }
  }

  localStorage.setItem('hsk_last_active_date', today);
  const streakEl = document.querySelector('#streakCounter');
  if (streakEl) streakEl.textContent = streak;
}

// --- Khởi tạo Ứng Dụng ---
document.addEventListener('DOMContentLoaded', () => {
  const mainContent = document.querySelector('#mainContent');
  const navTabs = document.querySelectorAll('.nav-tab-btn');
  const themeToggle = document.querySelector('#btnThemeToggle');
  const brandLogo = document.querySelector('#brandHome');

  // Khôi phục giao diện Dark/Light
  const savedTheme = localStorage.getItem('hsk_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('hsk_theme', next);
      themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
      playSound('click');
    });
  }

  // Router Map
  const viewMap = {
    roadmap: renderRoadmapView,
    lessons: renderLessonsView,
    pinyin: renderPinyinView,
    vocab: renderVocabView,
    flashcard: renderFlashcardView,
    radicals: renderRadicalsView,
    grammar: renderGrammarView,
    quiz: renderQuizView
  };

  function switchTab(tabId) {
    if (!viewMap[tabId]) tabId = 'roadmap';

    navTabs.forEach(btn => {
      if (btn.dataset.tab === tabId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    window.location.hash = tabId;
    viewMap[tabId](mainContent);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      switchTab(btn.dataset.tab);
    });
  });

  if (brandLogo) {
    brandLogo.addEventListener('click', () => {
      playSound('click');
      switchTab('roadmap');
    });
  }

  // Khởi động với Hash trên URL hoặc mặc định là 'roadmap'
  const initialTab = window.location.hash.replace('#', '') || 'roadmap';
  switchTab(initialTab);

  updateLearningStreak();
});
