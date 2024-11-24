document.addEventListener('DOMContentLoaded', () => {
    const startYearSelect = document.getElementById('start-year');
    const startMonthSelect = document.getElementById('start-month');
    const startDaySelect = document.getElementById('start-day');
    const endYearSelect = document.getElementById('end-year');
    const endMonthSelect = document.getElementById('end-month');
    const endDaySelect = document.getElementById('end-day');

    const startYear = 1700; // Adjust this value as needed
    const currentYear = 3000; // Adjust this value as needed

    // Populate year dropdowns
    for (let year = startYear; year <= currentYear; year++) {
        let option = document.createElement('option');
        option.value = year;
        option.text = year;
        startYearSelect.add(option.cloneNode(true));
        endYearSelect.add(option.cloneNode(true));
    }

    // Populate month dropdowns
    const monthNames = ['Jan (1)', 'Feb (2)', 'Mar (3)', 'Apr (4)', 'May (5)', 'Jun (6)', 'Jul (7)', 'Aug (8)', 'Sep (9)', 'Oct (10)', 'Nov (11)', 'Dec (12)'];
    monthNames.forEach((month, index) => {
        let option = document.createElement('option');
        option.value = index + 1; // Month index starts at 0, so add 1 for correct month value
        option.text = month;
        startMonthSelect.add(option.cloneNode(true));
        endMonthSelect.add(option.cloneNode(true));
    });

    // Function to populate days based on selected year and month
    function populateDays(selectDay, year, month) {
        if (!year || !month) return;

        const daysInMonth = new Date(year, month, 0).getDate();
        selectDay.innerHTML = ''; // Clear previous options

        for (let day = 1; day <= daysInMonth; day++) {
            let option = document.createElement('option');
            option.value = day;
            option.text = day;
            selectDay.add(option);
        }
    }

    // Populate days on year/month change
    function updateDays() {
        const startYear = parseInt(startYearSelect.value, 10);
        const startMonth = parseInt(startMonthSelect.value, 10);
        
        // Store the current selected day for both start and end dates
        const selectedStartDay = parseInt(startDaySelect.value, 10);
        const selectedEndDay = parseInt(endDaySelect.value, 10);

        // Repopulate the start day dropdown
        populateDays(startDaySelect, startYear, startMonth);
        
        // Reselect the previous start day if possible, otherwise select the last day of the month
        if (selectedStartDay <= startDaySelect.options.length) {
            startDaySelect.value = selectedStartDay;
        } else {
            startDaySelect.value = startDaySelect.options.length;
        }

        const endYear = parseInt(endYearSelect.value, 10);
        const endMonth = parseInt(endMonthSelect.value, 10);
        
        // Repopulate the end day dropdown
        populateDays(endDaySelect, endYear, endMonth);
        
        // Reselect the previous end day if possible, otherwise select the last day of the month
        if (selectedEndDay <= endDaySelect.options.length) {
            endDaySelect.value = selectedEndDay;
        } else {
            endDaySelect.value = endDaySelect.options.length;
        }
    }

    startYearSelect.addEventListener('change', updateDays);
    startMonthSelect.addEventListener('change', updateDays);
    endYearSelect.addEventListener('change', updateDays);
    endMonthSelect.addEventListener('change', updateDays);

    // Function to calculate and display elapsed time
    window.calculateElapse = function() {
        const startYear = parseInt(startYearSelect.value, 10);
        const startMonth = parseInt(startMonthSelect.value, 10);
        const startDay = parseInt(startDaySelect.value, 10);

        const endYear = parseInt(endYearSelect.value, 10);
        const endMonth = parseInt(endMonthSelect.value, 10);
        const endDay = parseInt(endDaySelect.value, 10);

        // Validate selected dates
        if (!startYear || !startMonth || !startDay || !endYear || !endMonth || !endDay || 
            new Date(endYear, endMonth - 1, endDay) < new Date(startYear, startMonth - 1, startDay)) {
            document.querySelector('.date_span').innerHTML = '<span style="color: red;">End date must be greater than start date.</span>';
            return;
        }

        const startDate = new Date(startYear, startMonth - 1, startDay);
        const endDate = new Date(endYear, endMonth - 1, endDay);

        // Calculate total days
        let totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

        // Calculate elapsed years, months, and days
        let elapsedYears = endDate.getFullYear() - startDate.getFullYear();
        let elapsedMonths = endDate.getMonth() - startDate.getMonth();
        let elapsedDays = endDate.getDate() - startDate.getDate();

        if (elapsedDays < 0) {
            let daysInLastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0).getDate();
            elapsedDays += daysInLastMonth;
            elapsedMonths--;
        }
        if (elapsedMonths < 0) {
            elapsedMonths += 12;
            elapsedYears--;
        }

        // Calculate total weeks and remaining days
        let totalWeeks = Math.floor(totalDays / 7);
        let remainingDays = totalDays % 7;

        // Calculate total months
        let totalMonths = elapsedYears * 12 + elapsedMonths;

        // Output
        document.querySelector('.date_span').innerHTML = `${elapsedYears} years, ${elapsedMonths} months, and ${elapsedDays} days<br><br>Or, ${totalMonths} months and ${elapsedDays} days<br><br>Or, ${totalWeeks} weeks and ${remainingDays} days<br><br>Or, ${totalDays} days`;
    }

    // Set both start and end dates to today's date
    function setTodayDate() {
        const today = new Date();

        // Set start date to today's date
        startYearSelect.value = today.getFullYear();
        startMonthSelect.value = today.getMonth() + 1; // Months are 0-indexed
        populateDays(startDaySelect, today.getFullYear(), today.getMonth() + 1);
        startDaySelect.value = today.getDate();

        // Set end date to today's date
        endYearSelect.value = today.getFullYear();
        endMonthSelect.value = today.getMonth() + 1; // Months are 0-indexed
        populateDays(endDaySelect, today.getFullYear(), today.getMonth() + 1);
        endDaySelect.value = today.getDate();

        updateDays(); // Make sure to call this after setting today's date to update days correctly
    }

    // Reset button functionality
    document.getElementById('reset-button').addEventListener('click', function() {
        setTodayDate(); // Set the date pickers to today's date
        document.querySelector('.date_span').innerHTML = ''; // Clear the result display
    });

    setTodayDate(); // Initialize both dates to today's date
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/date/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}


const themeToggle = document.getElementById('themeToggle');

        // Function to set the theme based on user preference or system setting
        function setTheme(theme) {
            document.body.className = theme;
            themeToggle.textContent = theme === 'dark' ? '🌙' : '🔆';
            localStorage.setItem('theme', theme);
        }

        // Check local storage for user preference
        const storedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (storedTheme) {
            setTheme(storedTheme);
        } else if (systemPrefersDark) {
            setTheme('dark');
        } else {
            setTheme('light');
        }

        // Event listener for button click to toggle theme
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
            setTheme(currentTheme === 'dark' ? 'light' : 'dark');
        });


document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('.footer');
  const btnInstall = document.getElementById('btnInstall');
  let deferredInstallPrompt;

  // Check if the app is running as a PWA (Standalone mode)
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  // If the app is already installed as a PWA, update the footer content
  if (isPWA) {
    if (footer) {
      footer.innerHTML = `
        <p>&nbsp;&nbsp;&nbsp;Copyright &nbsp;© &nbsp;&nbsp;2024-2025&nbsp;&nbsp;|&nbsp;&nbsp;Date Mate</p>
      `;
    }

    // Hide the install button as the app is installed
    if (btnInstall) {
      btnInstall.style.display = 'none';
    }
  } else {
    // Show install button on web version if app is not installed
    if (btnInstall) {
      btnInstall.style.display = 'block';
      btnInstall.textContent = 'Install App';
    }
  }

  // Listen for 'beforeinstallprompt' to save the install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); // Prevent the default install prompt from showing automatically
    deferredInstallPrompt = e; // Save the install prompt
    console.log('Install prompt saved');
    
    // Show the install button when the prompt is available
    if (btnInstall) {
      btnInstall.style.display = 'block';
      btnInstall.textContent = 'Install App';
    }
  });

  // Listen for install button click
  btnInstall.addEventListener('click', () => {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt(); // Show the install prompt
      deferredInstallPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          console.log('User accepted the installation');
          btnInstall.style.display = 'none'; // Hide the install button after installation
        } else {
          console.log('User dismissed the installation');
        }
      });
    } else {
      // If the app is already installed or there's no install prompt available
      alert('This app is already installed on your device. or Install prompt is not available now.');
    }
  });

  // Listen for the 'appinstalled' event and update the footer
  window.addEventListener('appinstalled', () => {
    console.log('App installed, hiding the button');
    btnInstall.style.display = 'none'; // Hide the install button after the app is installed

    // Update the footer when the app is installed as a PWA
    if (footer) {
      footer.innerHTML = `
        <p>&nbsp;&nbsp;&nbsp;Copyright &nbsp;© &nbsp;&nbsp;2024-2025&nbsp;&nbsp;|&nbsp;&nbsp;Date Mate</p>
      `;
    }
  });
});
