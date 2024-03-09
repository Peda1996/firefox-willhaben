let timerId = null;
let modified = false; // Flag to track if modification has been made
let lastTerm = null;

// Function to search for the term and display the date
function searchAndDisplayDate() {
  if (modified) return; // Exit if already modified
  const searchTerm = 'Zuletzt geändert'; // Term to search for
  document.querySelectorAll('body, body *').forEach(element => {
    // Ensure we're working with text nodes only
    if (element.nodeType === Node.ELEMENT_NODE && element.innerHTML.includes(searchTerm)) {
      const nodes = Array.from(element.childNodes).filter(node => node.nodeType === Node.TEXT_NODE && node.nodeValue.includes(searchTerm));
      nodes.forEach(node => {
        const index = node.nodeValue.indexOf(searchTerm);
        if (index !== -1) {
          // Extract or create the necessary content
          const dateAndTime = extractDateTimeFromHTML(document.documentElement.innerHTML); // Assuming this function works as intended
          let contentToAdd;
          if (dateAndTime) {
            const formattedDateTime = formatDateAndTime(dateAndTime);
            contentToAdd = document.createTextNode(`${formattedDateTime} | `);
          } else {
            // Create a reload button if date and time are not found
            const button = document.createElement('button');
            button.textContent = 'Veröffentlicht';
            button.onclick = () => window.location.reload(true);
            contentToAdd = button;
          }

          // Insert the content before the text node in the element
          const span = document.createElement('span');
          span.appendChild(contentToAdd);
          element.insertBefore(span, node);

          modified = true; // Indicate modification has occurred
        }
      });
    }
  });
}



// Function to extract the date and time from the HTML
function extractDateTimeFromHTML(html) {
  const dateTimeRegex = /"firstPublishedDate":"(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/; // Regex to match the date and time format
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

// Listen for URL changes
window.addEventListener("DOMContentLoaded", function () {
  // Reset flags and run the script again when a new page is loaded
  modified = false;
  lastTerm = null;
  debouncedSearchAndDisplay();
});
