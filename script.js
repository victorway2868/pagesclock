// script.js
document.addEventListener('DOMContentLoaded', () => {
    // 7-segment display patterns for digits 0-9
    const digitPatterns = {
        0: ['a', 'b', 'c', 'd', 'e', 'f'],
        1: ['b', 'c'],
        2: ['a', 'b', 'g', 'e', 'd'],
        3: ['a', 'b', 'g', 'c', 'd'],
        4: ['f', 'g', 'b', 'c'],
        5: ['a', 'f', 'g', 'c', 'd'],
        6: ['a', 'f', 'g', 'e', 'd', 'c'],
        7: ['a', 'b', 'c'],
        8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
        9: ['a', 'b', 'c', 'd', 'f', 'g']
    };

    // Initialize all digit displays
    function initializeDigits() {
        const digitIds = ['hour1', 'hour2', 'minute1', 'minute2', 'second1', 'second2'];

        digitIds.forEach(id => {
            const digitElement = document.getElementById(id);

            // Create all 7 segments for each digit
            const segments = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
            segments.forEach(segment => {
                const segmentDiv = document.createElement('div');
                segmentDiv.className = `segment segment-${segment}`;
                digitElement.appendChild(segmentDiv);
            });
        });
    }

    // Display a specific digit on a 7-segment display with smooth transitions
    function displayDigit(digitId, number, delay = 0, isSeconds = false) {
        const digitElement = document.getElementById(digitId);
        const segments = digitElement.querySelectorAll('.segment');

        // For seconds, use immediate updates to avoid flickering
        if (isSeconds) {
            // Clear all segments immediately
            segments.forEach(segment => {
                segment.classList.remove('active');
            });

            // Activate segments for the current number immediately
            const pattern = digitPatterns[number];
            if (pattern) {
                pattern.forEach(segmentName => {
                    const segment = digitElement.querySelector(`.segment-${segmentName}`);
                    if (segment) {
                        segment.classList.add('active');
                    }
                });
            }
        } else {
            // For hours and minutes, use the animated version
            // Clear all segments first with staggered animation
            segments.forEach((segment, index) => {
                setTimeout(() => {
                    segment.classList.remove('active');
                }, delay + index * 15);
            });

            // Activate segments for the current number with staggered animation
            const pattern = digitPatterns[number];
            if (pattern) {
                pattern.forEach((segmentName, index) => {
                    const segment = digitElement.querySelector(`.segment-${segmentName}`);
                    if (segment) {
                        setTimeout(() => {
                            segment.classList.add('active');
                            // Add a brief flash effect for new activations
                            segment.style.filter = 'brightness(1.3) saturate(1.2)';
                            setTimeout(() => {
                                segment.style.filter = '';
                            }, 100);
                        }, delay + 50 + index * 20);
                    }
                });
            }
        }
    }

    // Add digit change animation
    function animateDigitChange(digitId) {
        const digitElement = document.getElementById(digitId);
        digitElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            digitElement.style.transform = '';
        }, 200);
    }

    // Store previous time to detect changes
    let previousTime = { hours: -1, minutes: -1, seconds: -1 };

    // Update the clock display with enhanced animations
    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Format time to always show 2 digits
        const hourStr = hours.toString().padStart(2, '0');
        const minuteStr = minutes.toString().padStart(2, '0');
        const secondStr = seconds.toString().padStart(2, '0');

        // Check for changes and animate accordingly
        const currentTime = { hours, minutes, seconds };

        // Display each digit with appropriate animations
        if (previousTime.hours !== hours) {
            animateDigitChange('hour1');
            animateDigitChange('hour2');
            displayDigit('hour1', parseInt(hourStr[0]), 0, false);
            displayDigit('hour2', parseInt(hourStr[1]), 30, false);
        }

        if (previousTime.minutes !== minutes) {
            animateDigitChange('minute1');
            animateDigitChange('minute2');
            displayDigit('minute1', parseInt(minuteStr[0]), 0, false);
            displayDigit('minute2', parseInt(minuteStr[1]), 30, false);
        }

        if (previousTime.seconds !== seconds) {
            // For seconds, use immediate updates without complex animations
            displayDigit('second1', parseInt(secondStr[0]), 0, true);
            displayDigit('second2', parseInt(secondStr[1]), 0, true);
        }

        // If it's the first run, display all digits
        if (previousTime.hours === -1) {
            displayDigit('hour1', parseInt(hourStr[0]), 0, false);
            displayDigit('hour2', parseInt(hourStr[1]), 50, false);
            displayDigit('minute1', parseInt(minuteStr[0]), 100, false);
            displayDigit('minute2', parseInt(minuteStr[1]), 150, false);
            displayDigit('second1', parseInt(secondStr[0]), 0, true);
            displayDigit('second2', parseInt(secondStr[1]), 0, true);
        }

        previousTime = currentTime;
    }

    // Add some interactive effects
    function addInteractiveEffects() {
        const digitContainers = document.querySelectorAll('.digit-container');

        digitContainers.forEach((container, index) => {
            container.addEventListener('mouseenter', () => {
                container.style.transform = 'scale(1.05) rotateY(5deg)';
                container.style.zIndex = '10';
            });

            container.addEventListener('mouseleave', () => {
                container.style.transform = '';
                container.style.zIndex = '';
            });
        });

        // Add click effect to the entire clock
        const digitalClock = document.querySelector('.digital-clock');
        digitalClock.addEventListener('click', () => {
            digitalClock.style.transform = 'scale(0.98)';
            setTimeout(() => {
                digitalClock.style.transform = '';
            }, 150);
        });
    }

    // Update timezone display
    function updateTimezone() {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneElement = document.getElementById('timezone');
        if (timezoneElement) {
            timezoneElement.textContent = timezone.replace('_', ' ');
        }
    }

    // Initialize everything
    initializeDigits();
    addInteractiveEffects();
    updateTimezone();

    // Start the clock
    updateClock();
    setInterval(updateClock, 1000);
});