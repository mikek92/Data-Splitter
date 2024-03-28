const basePath = '/data/';
let currentPage = 0;
let totalPages = 0;
const tableHead = document.getElementById('table-head');
const tableBody = document.getElementById('table-body');
const pagination = document.getElementById('pagination');

function fetchTotalPages() {
  // Fetching a file 'total_pages.txt' that contains the total number of pages
  fetch(`${basePath}total_pages.txt`)
    .then(response => response.text())
    .then(total => {
      totalPages = parseInt(total, 10);
      renderPagination();
      loadCsv(currentPage); // Load initial CSV file for the current page
    })
    .catch(error => console.error('Error fetching total pages:', error));
}

function loadCsv(pageNumber) {
    currentPage = pageNumber;
  
    // Build the URL to the CSV file based on the current page
    const csvUrl = `${basePath}chunk_${currentPage}.csv`;
  
    // Fetch the CSV file
    fetch(csvUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(csvText => {
        processData(csvText);
        renderPagination(); 
      })
      .catch(error => {
        console.error('Error loading the CSV:', error);
      });
  }
  function splitCsvLine(line) {
    // This updated regex handles well-formed CSV lines and accounts for escaped quotes within quoted fields
    const regex = /(?!\s*$)\s*(?:"([^"]*(?:""[^"]*)*)"|([^,]*))\s*(?:,|$)/g;
    const values = [];
    let match = regex.exec(line);
    
    // Get all matches and push their first capturing group into the values array
    while (match) {
      // Check if the matched value has leading and trailing double quotes
      let value = match[1] !== undefined ? match[1] : match[2];
      // Replace any double double-quotes with a single double-quote
      if (value) {
        value = value.replace(/""/g, '"');
      }
      values.push(value);
      match = regex.exec(line);
    }
    return values;
  }
  function processData(csvData) {
    // Split CSV data into an array of lines
    const lines = csvData.trim().split('\n');
    
    // The first line is assumed to be headers
    const headers = splitCsvLine(lines.shift());
    
    // Clear existing headers in the table
    tableHead.innerHTML = '';
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header.trim(); // Trim whitespace in header
      tableHead.appendChild(th);
    });
    
    // Clear existing rows in the table body
    tableBody.innerHTML = '';
    lines.forEach(row => {
      const rowData = splitCsvLine(row); // Use the splitCsvLine function instead of split(',')
      const tr = document.createElement('tr');
      rowData.forEach(cellData => {
        const td = document.createElement('td');
        td.textContent = cellData;
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    });
  }
  const filterInput = document.getElementById('filter-input');
  const filterButton = document.getElementById('filter-button');
  
  filterButton.addEventListener('click', () => {
    const filterValue = filterInput.value.toLowerCase();
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const ownerCell = cells[1]; // assuming the OWNER column is the second column
      if (ownerCell && ownerCell.textContent.toLowerCase().includes(filterValue)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
  
  function createPageButton(pageNumber, text) {
    const pageButton = document.createElement('button');
    pageButton.textContent = text || (pageNumber + 1); // Display page numbers starting from 1 instead of 0
    pageButton.classList.add('pagination-button');
  
    // Add Tailwind classes for normal buttons
    pageButton.classList.add('bg-white', 'text-blue-500', 'font-bold', 'py-2', 'px-4', 'rounded', 'hover:bg-blue-700', 'hover:text-white');
    
    pageButton.disabled = pageNumber === currentPage;
    pageButton.addEventListener('click', () => loadCsv(pageNumber));
  
    // Highlight the active page using the 'active' class
    if (pageNumber === currentPage) {
      pageButton.classList.add('active');
      // Remove hover effects for the active page
      pageButton.classList.remove('hover:bg-blue-700', 'hover:text-white');
      pageButton.disabled = true; // Optionally disable the button as well
    } else {
      pageButton.classList.remove('active');
    }
  
    return pageButton;
  }

function renderPagination() {
    pagination.innerHTML = '';
  
    // Only show 'Previous' if not on the first page (where currentPage is page index, i.e., starts from 0)
    if (currentPage > 0) {
      const prevPage = currentPage - 1;
      pagination.appendChild(createPageButton(prevPage, 'Previous'));
    }
  
    const range = 1; // Number of pages to show before and after the current page
  
    // Always show the first page if not in the first group of pages
    if (currentPage > range) {
      pagination.appendChild(createPageButton(0));
      if (currentPage > range + 1) {
        pagination.appendChild(createEllipsis());
      }
    }
  
    // Current page range
    const startRange = Math.max(currentPage - range, 1);
    const endRange = Math.min(currentPage + range, totalPages - 2);
    for (let i = startRange; i <= endRange; i++) {
      pagination.appendChild(createPageButton(i));
    }
  
    // Always show the last page if not in the last group of pages
     if (currentPage < totalPages - range - 1) {
    if (currentPage < totalPages - range - 2) {
      pagination.appendChild(createEllipsis());
    }
    pagination.appendChild(createPageButton(totalPages - 1));
  }
  
    // Only show 'Next' if not on the last page
    if (currentPage < totalPages - 1) {
      const nextPage = currentPage + 1;
      pagination.appendChild(createPageButton(nextPage, 'Next'));
    }
  }
  
  // Create an ellipsis span to denote skipped page numbers
  function createEllipsis() {
    const span = document.createElement('span');
    span.textContent = '...';
    span.classList.add('ellipsis');
    return span;
  }
  
  fetchTotalPages();
