let packagesData = [];
let currentLetter = null;

// Load JSON data
fetch('packages.json')
  .then(res => res.json())
  .then(data => {
    packagesData = data;
    displayPackages(packagesData);
    generateLetterFilter();
  })
  .catch(err => console.error('Error loading JSON:', err));

// Display packages and update stats
function displayPackages(data) {
  const tbody = document.querySelector('#package-table tbody');
  tbody.innerHTML = '';
  data.forEach(pkg => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td data-label="Package"><span>${pkg.package}</span></td>
      <td data-label="Version"><span>${pkg.version}</span></td>
      <td data-label="Description"><span>${pkg.description}</span></td>
      <td data-label="Homepage"><span><a href="${pkg.homepage}" target="_blank">${pkg.homepage}</a></span></td>
    `;
    tbody.appendChild(row);
  });

  // Update stats number in red
  const countSpan = document.getElementById('package-count');
  countSpan.textContent = data.length;
}

// Search filter
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', function() {
  const query = this.value.toLowerCase();
  let filtered = packagesData.filter(pkg =>
    pkg.package.toLowerCase().includes(query) ||
    pkg.version.toLowerCase().includes(query) ||
    pkg.description.toLowerCase().includes(query) ||
    pkg.homepage.toLowerCase().includes(query)
  );

  if(currentLetter && currentLetter !== '⇵') {
    filtered = filtered.filter(pkg => pkg.package.toUpperCase().startsWith(currentLetter));
  }

  displayPackages(filtered);
});

// Generate A-Z filter with ⇵ button
function generateLetterFilter() {
  const letters = ['⇵', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];
  const letterFilterDiv = document.getElementById('letter-filter');
  letters.forEach(letter => {
    const span = document.createElement('span');
    span.textContent = letter;
    span.addEventListener('click', () => {
      document.querySelectorAll('#letter-filter span').forEach(s => s.classList.remove('active'));
      span.classList.add('active');

      if(letter === '⇵') {
        currentLetter = null;
        displayPackages(packagesData);
      } else {
        filterByLetter(letter);
      }
    });
    letterFilterDiv.appendChild(span);
  });
}

// Filter by letter
function filterByLetter(letter) {
  currentLetter = letter;
  const query = searchInput.value.toLowerCase();
  let filtered = packagesData.filter(pkg =>
    pkg.package.toLowerCase().includes(query)
  );
  filtered = filtered.filter(pkg => pkg.package.toUpperCase().startsWith(letter));
  displayPackages(filtered);
}