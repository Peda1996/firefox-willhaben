let timerId = null;
let modified = false; // Flag to track if modification has been made

// Function to search for the term and display the date
function searchAndDisplayDate() {
  if (modified) return; // Exit if already modified
  const searchTerm = 'Zuletzt geändert'; // Term to search for
  const elements = document.querySelectorAll('body, body *'); // Select all elements in the body

  elements.forEach(element => {
    const html = element.innerHTML;
    const index = html.indexOf(searchTerm);
    if (index !== -1) {
      const dateAndTime = extractDateTimeFromHTML(html); // Extract date and time from HTML
      const formattedDateTime = formatDateAndTime(dateAndTime);
      const newHTML = html.slice(0, index) + `Veröffentlicht: ${formattedDateTime} | ${searchTerm}` + html.slice(index + searchTerm.length);
      element.innerHTML = newHTML;
      modified = true; // Set flag to true
      return; // Exit the loop since modification has been made
    }
  });
}

// Function to extract the date and time from the HTML
function extractDateTimeFromHTML(html) {
  const dateTimeRegex = /"publishedDate":"(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/; // Regex to match the date and time format
  const match = html.match(dateTimeRegex);
  if (match && match[1] && match[2]) {
    return {
      date: match[1],
      time: match[2]
    };
  }
  return null;
}

// Function to format the date and time
function formatDateAndTime(dateTime) {
  if (!dateTime) return ""; // Return empty string if dateTime is null
  const [year, month, day] = dateTime.date.split("-");
  return `${day}.${month}.${year}, ${dateTime.time} Uhr`;
}

// Function to perform search and display with debounce
function debouncedSearchAndDisplay() {
  if (timerId) {
    clearTimeout(timerId);
  }
  timerId = setTimeout(() => {
    searchAndDisplayDate();
    timerId = null;
  }, 1000); // Debounce time: 1 second
}

// Call the function initially
debouncedSearchAndDisplay();

// Observe changes in the DOM
const observer = new MutationObserver(debouncedSearchAndDisplay);
observer.observe(document.body, { childList: true, subtree: true });

// Listen for tab activation
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    debouncedSearchAndDisplay();
  }
});