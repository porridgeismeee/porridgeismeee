let display;
let currentInput = '';
let operator = '';
let previousInput = '';
let shouldResetDisplay = false;

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    display = document.getElementById('display');
    clearDisplay();
});

function appendToDisplay(value) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }
    
    // Handle decimal point
    if (value === '.') {
        if (currentInput.includes('.')) {
            return; // Don't allow multiple decimal points
        }
        if (currentInput === '') {
            currentInput = '0.';
        } else {
            currentInput += value;
        }
    }
    // Handle operators
    else if (['+', '-', '*', '/'].includes(value)) {
        if (currentInput === '' && previousInput === '') {
            return; // Don't allow operator as first input
        }
        
        if (previousInput !== '' && currentInput !== '' && operator !== '') {
            calculate();
        }
        
        if (currentInput !== '') {
            previousInput = currentInput;
            currentInput = '';
        }
        operator = value;
    }
    // Handle numbers
    else {
        currentInput += value;
    }
    
    updateDisplay();
}

function updateDisplay() {
    if (currentInput !== '') {
        display.value = currentInput;
    } else if (operator !== '') {
        display.value = previousInput + ' ' + (operator === '*' ? '×' : operator);
    } else {
        display.value = previousInput || '0';
    }
}

function calculate() {
    if (previousInput === '' || currentInput === '' || operator === '') {
        return;
    }
    
    let prev = parseFloat(previousInput);
    let current = parseFloat(currentInput);
    let result;
    
    try {
        switch (operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    throw new Error('Division by zero');
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Round to avoid floating point precision issues
        result = Math.round(result * 100000000) / 100000000;
        
        currentInput = result.toString();
        previousInput = '';
        operator = '';
        shouldResetDisplay = true;
        
        display.value = currentInput;
        
    } catch (error) {
        display.value = 'Error';
        clearDisplay();
    }
}

function clearDisplay() {
    currentInput = '';
    previousInput = '';
    operator = '';
    shouldResetDisplay = false;
    display.value = '0';
}

function deleteLast() {
    if (currentInput !== '') {
        currentInput = currentInput.slice(0, -1);
        updateDisplay();
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and decimal point
    if (/^[0-9.]$/.test(key)) {
        appendToDisplay(key);
    }
    // Operators
    else if (['+', '-', '*', '/'].includes(key)) {
        appendToDisplay(key);
    }
    // Enter or equals
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    // Escape or 'c' for clear
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    }
    // Backspace for delete
    else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Initialize display when script loads