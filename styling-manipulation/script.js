// Box 1: Click to change color
document.getElementById('box1').addEventListener('click', function() {
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f1c40f', '#9b59b6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    this.style.backgroundColor = randomColor;
});

// Box 2: Hover effect is handled in CSS

// Box 3: Double click to change text
document.getElementById('box3').addEventListener('dblclick', function() {
    this.textContent = 'Double clicked!';
    setTimeout(() => {
        this.textContent = 'Double click me';
    }, 1000);
});

// Size toggle button
document.getElementById('sizeButton').addEventListener('click', function() {
    document.querySelectorAll('.box').forEach(box => {
        box.classList.toggle('large');
    });
});

// Shape toggle button
document.getElementById('shapeButton').addEventListener('click', function() {
    document.querySelectorAll('.box').forEach(box => {
        box.classList.toggle('round');
    });
});

// Box 4: Animation is handled in CSS

// Box 5: Gradient is handled in CSS

// Additional interactive effects
document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('mouseover', function() {
        this.style.opacity = '0.8';
    });
    
    box.addEventListener('mouseout', function() {
        this.style.opacity = '1';
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the style manager
    const styleManager = new StyleManager();

    // Set up demo box interactions
    const demoBoxes = document.querySelectorAll('.demo-box');
    
    demoBoxes.forEach(box => {
        // Click handler
        box.addEventListener('click', () => {
            styleManager.selectedElement = box;
            styleManager.updateControlsFromElement(box);
            
            // Visual feedback for selection
            demoBoxes.forEach(b => b.classList.remove('selected'));
            box.classList.add('selected');
        });

        // Double click handler
        box.addEventListener('dblclick', () => {
            const currentTransform = box.style.transform || '';
            box.style.transform = currentTransform.includes('rotate')
                ? currentTransform.replace(/rotate\([^)]*\)/, '')
                : `${currentTransform} rotate(180deg)`.trim();
            
            styleManager.updateCssOutput();
        });

        // Make boxes draggable
        box.addEventListener('mousedown', (e) => {
            if (!box.classList.contains('interactive')) return;

            const startX = e.clientX - box.offsetLeft;
            const startY = e.clientY - box.offsetTop;
            
            function moveBox(e) {
                box.style.position = 'absolute';
                box.style.left = (e.clientX - startX) + 'px';
                box.style.top = (e.clientY - startY) + 'px';
            }
            
            function stopMoving() {
                document.removeEventListener('mousemove', moveBox);
                document.removeEventListener('mouseup', stopMoving);
            }
            
            document.addEventListener('mousemove', moveBox);
            document.addEventListener('mouseup', stopMoving);
        });
    });

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = element.dataset.tooltip;
        
        element.addEventListener('mouseenter', () => {
            document.body.appendChild(tooltip);
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width - tooltip.offsetWidth) / 2 + 'px';
            tooltip.style.top = rect.bottom + 5 + 'px';
        });
        
        element.addEventListener('mouseleave', () => {
            tooltip.remove();
        });
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!styleManager.selectedElement) return;

        const element = styleManager.selectedElement;
        
        switch(e.key) {
            case 'Delete':
                styleManager.resetElementStyles();
                break;
            case 'ArrowUp':
                element.style.transform = 'translateY(-10px)';
                break;
            case 'ArrowDown':
                element.style.transform = 'translateY(10px)';
                break;
            case 'ArrowLeft':
                element.style.transform = 'translateX(-10px)';
                break;
            case 'ArrowRight':
                element.style.transform = 'translateX(10px)';
                break;
        }
        
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            styleManager.updateCssOutput();
        }
    });

    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            demoBoxes.forEach(box => {
                if (box.classList.contains('interactive')) {
                    const rect = box.getBoundingClientRect();
                    if (rect.right > window.innerWidth) {
                        box.style.left = (window.innerWidth - rect.width - 20) + 'px';
                    }
                    if (rect.bottom > window.innerHeight) {
                        box.style.top = (window.innerHeight - rect.height - 20) + 'px';
                    }
                }
            });
        }, 100);
    });

    // Initialize first demo box as selected
    demoBoxes[0].click();
});
