document.addEventListener('DOMContentLoaded', function() {
    // Get references to DOM elements
    const dayInput = document.getElementById('day-input');
    const monthInput = document.getElementById('month-input');
    const yearInput = document.getElementById('year-input');
    const calculateButton = document.querySelector('.bg-black'); // This already targets the arrow button
    const resultYears = document.querySelector('p:nth-of-type(1) .text-purple');
    const resultMonths = document.querySelector('p:nth-of-type(2) .text-purple');
    const resultDays = document.querySelector('p:nth-of-type(3) .text-purple');
    
    // Add labels for error messages
    const inputs = [dayInput, monthInput, yearInput];
    inputs.forEach(input => {
        const errorLabel = document.createElement('span');
        errorLabel.className = 'text-red text-xs hidden';
        input.parentNode.appendChild(errorLabel);
    });
    
    // Get error labels
    const dayError = dayInput.parentNode.querySelector('.text-xs');
    const monthError = monthInput.parentNode.querySelector('.text-xs');
    const yearError = yearInput.parentNode.querySelector('.text-xs');
    
    // Initialize results with dashes
    resultYears.textContent = '--';
    resultMonths.textContent = '--';
    resultDays.textContent = '--';
    
    // Validate inputs and calculate age when button is clicked
    calculateButton.addEventListener('click', calculateAge);
    
    function calculateAge() {
        resetErrors();
        
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);
        
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1; // JavaScript months are 0-indexed
        const currentDay = today.getDate();
        
        let isValid = true;
        
        // Validate year
        if (!yearInput.value) {
            showError(yearInput, yearError, "This field is required");
            isValid = false;
        } else if (isNaN(year) || year < 0) {
            showError(yearInput, yearError, "Must be a valid year");
            isValid = false;
        } else if (year > currentYear) {
            showError(yearInput, yearError, "Must be in the past");
            isValid = false;
        }
        
        // Validate month
        if (!monthInput.value) {
            showError(monthInput, monthError, "This field is required");
            isValid = false;
        } else if (isNaN(month) || month < 1 || month > 12) {
            showError(monthInput, monthError, "Must be a valid month");
            isValid = false;
        } else if (year === currentYear && month > currentMonth) {
            showError(monthInput, monthError, "Must be in the past");
            isValid = false;
        }
        
        // Validate day
        if (!dayInput.value) {
            showError(dayInput, dayError, "This field is required");
            isValid = false;
        } else {
            const daysInMonth = new Date(year, month, 0).getDate();
            if (isNaN(day) || day < 1 || day > daysInMonth) {
                showError(dayInput, dayError, "Must be a valid day");
                isValid = false;
            } else if (year === currentYear && month === currentMonth && day > currentDay) {
                showError(dayInput, dayError, "Must be in the past");
                isValid = false;
            }
        }
        
        // Calculate age if all inputs are valid
        if (isValid) {
            let ageYears = currentYear - year;
            let ageMonths = currentMonth - month;
            let ageDays = currentDay - day;
            
            if (ageDays < 0) {
                ageMonths--;
                const lastMonth = new Date(currentYear, currentMonth - 1, 0);
                ageDays += lastMonth.getDate();
            }
            
            if (ageMonths < 0) {
                ageYears--;
                ageMonths += 12;
            }
            
            // Animate the results
            animateCounter(resultYears, ageYears);
            animateCounter(resultMonths, ageMonths);
            animateCounter(resultDays, ageDays);
        }
    }
    
    function showError(input, errorLabel, message) {
        input.classList.add('border-red', 'text-red');
        input.classList.remove('border-grey');
        const label = input.parentNode.querySelector('label');
        label.classList.add('text-red');
        errorLabel.textContent = message;
        errorLabel.classList.remove('hidden');
    }
    
    function resetErrors() {
        inputs.forEach(input => {
            input.classList.remove('border-red', 'text-red');
            input.classList.add('border-grey');
            const label = input.parentNode.querySelector('label');
            label.classList.remove('text-red');
            const error = input.parentNode.querySelector('.text-xs');
            error.classList.add('hidden');
        });
    }
    
    function animateCounter(element, targetValue) {
        let startValue = 0;
        const duration = 1000;
        const increment = Math.ceil(targetValue / (duration / 20));
        
        const timer = setInterval(() => {
            startValue += increment;
            if (startValue >= targetValue) {
                clearInterval(timer);
                element.textContent = targetValue;
            } else {
                element.textContent = startValue;
            }
        }, 20);
    }
});
