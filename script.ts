
// Get a reference to the button element using its ID.
const playButton = document.getElementById('easter');

// Get a reference to the audio element using its ID.
const audioPlayer = document.getElementById('easter-audio')! as HTMLAudioElement;

// Check if the elements were found before adding the event listener.
if (playButton && audioPlayer) {
  // Add a 'click' event listener to the button.
  // The code inside this function will run whenever the button is clicked.
  playButton.addEventListener('click', () => {
  // Play the audio.
  // Note: Browser autoplay policies may require a user gesture (like a click) to start playback.
  // This script respects that by playing the audio only after a click.
  audioPlayer.play()
  .catch(error => {
    // Handle potential errors, such as a user denying playback.
    console.error("Error playing audio:", error);
    // You could add a message box here to alert the user.
    // For example: `document.getElementById('message-box').innerText = 'Could not play sound.';`
  });
  });
}
const themeToggle = document.getElementById('theme-toggle')!;
const sunIcon = document.getElementById('sun-icon')!;
const moonIcon = document.getElementById('moon-icon')!;
const body = document.body;

// Check for saved theme preference in local storage
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
  document.documentElement.classList.replace('light', currentTheme);
  updateIcon(currentTheme);
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  if (document.documentElement.classList.contains('light')) {
  document.documentElement.classList.replace('light', 'dark');
  localStorage.setItem('theme', 'dark');
  updateIcon('dark');
  } else {
  document.documentElement.classList.replace('dark', 'light');
  localStorage.setItem('theme', 'light');
  updateIcon('light');
  }
});

// Function to update the visible icon
function updateIcon(theme: string) {
  if (theme === 'dark') {
  moonIcon.classList.add('hidden');
  sunIcon.classList.remove('hidden');
  } else {
  sunIcon.classList.add('hidden');
  moonIcon.classList.remove('hidden');
  }
}

{
  const selectMenu = document.querySelector("#lang-select")!;

  /*<option value="cat">
    <span class="icon" aria-hidden="true">🐱</span><span class="option-label">Cat</span>
  </option>*/ 
  // "name": "flag character"
  const langs = {
    "en": "🇬🇧",
    /*
    "es": "🇪🇸",
    "fr": "🇫🇷",
    "de": "🇩🇪",
    "jp": "🇯🇵",
    "cn": "🇨🇳"
    */
  }
  for (const [lang, flag] of Object.entries(langs)) {
    const option = document.createElement("option");
    option.value = lang;
    option.innerHTML = `<span class="icon" aria-hidden="true">${flag}</span><span class="option-label">${lang.toUpperCase()}</span>`;
    selectMenu.appendChild(option);
  }
}

document.addEventListener('DOMContentLoaded', () => {
const defaultLang = 'en'; // Set your default language
let currentLang = localStorage.getItem('lang') ?? defaultLang;

// Get the elements to be translated
const elementsToTranslate = document.querySelectorAll('[data-i18n]');

// Function to fetch and apply translations
async function setLanguage(lang: string) {
  try {
  const response = await fetch(`lang/${lang}.json`);
  if (!response.ok) {
    throw new Error(`Failed to load translation for ${lang}`);
  }
  const translations: Record<string, string | Record<string, string>> = await response.json();
  
  elementsToTranslate.forEach(element => {
    const key = element.getAttribute('data-i18n')!;
    if (translations[key]) {
      const g = translations[key];
      if (typeof g === "string") {
        element.innerHTML = g;
      } else {
        if (!Object.keys(g).includes("")) {
          console.error(`Translation key ${key} does not have the main translation text available (as the value for the key "").`)
          return;
        }
        // find all instance of {{([a-zA-Z0-9]*)}} in g[""], then for each matches, find a child element with the data-i18n-inline attr of that value and return the matched element's html content
        // use replaceAll i think
        element.innerHTML = g[""].replaceAll(/{{([a-zA-Z0-9-_]*)}}/g, (sub, one)=>{
          const inlineElement = element.querySelector(`[data-i18n-inline="${one}"]`);
          if (inlineElement) {
            return inlineElement.outerHTML;
          } else {
            console.warn(`Inline translation key ${one} not found in element with data-i18n="${key}".`);
            return sub; // return the original match if not found
          }
        })
      }
    }
  });
  currentLang = lang;
  } catch (error) {
  console.error('Error loading language file:', error);
  // Fallback to the default language if an error occurs
  if (lang !== defaultLang) {
    setLanguage(defaultLang);
  }
  }
}

// You can call this function to set the language on page load
setLanguage(defaultLang);

/*
// Example: Add a language switcher
// You would have buttons or a dropdown in your HTML for this
document.getElementById('lang-en-btn')?.addEventListener('click', () => setLanguage('en'));
document.getElementById('lang-es-btn')?.addEventListener('click', () => setLanguage('es'));
*/
});
