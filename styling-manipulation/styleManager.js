class StyleManager {
    constructor() {
        this.selectedElement = null;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistory = 20;
        
        this.effects = {
            pulse: {
                animation: 'pulse 2s infinite',
                duration: '2s'
            },
            shake: {
                animation: 'shake 0.5s',
                duration: '0.5s'
            },
            flip: {
                animation: 'flip 1s',
                duration: '1s'
            },
            bounce: {
                animation: 'bounce 1s',
                duration: '1s'
            },
            swing: {
                animation: 'swing 1s',
                duration: '1s'
            }
        };

        this.init();
    }

    init() {
        this.setupThemeSwitch();
        this.setupControlPanel();
        this.setupEffectsPanel();
        this.setupContextMenu();
        this.setupCopyButton();
        this.setupUndoRedo();
    }

    setupThemeSwitch() {
        const themeBtns = document.querySelectorAll('.theme-btn');
        
        themeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                document.body.setAttribute('data-theme', theme);
                
                themeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.addToHistory({
                    type: 'theme',
                    value: theme
                });
            });
        });
    }

    setupControlPanel() {
        // Background Color Control
        const bgColorPicker = document.getElementById('bgColorPicker');
        bgColorPicker.addEventListener('input', (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.backgroundColor = e.target.value;
                this.updateCssOutput();
            }
        });

        // Border Radius Control
        const radiusSlider = document.getElementById('radiusSlider');
        const radiusDisplay = radiusSlider.nextElementSibling;
        radiusSlider.addEventListener('input', (e) => {
            const value = e.target.value + 'px';
            radiusDisplay.textContent = value;
            if (this.selectedElement) {
                this.selectedElement.style.borderRadius = value;
                this.updateCssOutput();
            }
        });

        // Scale Control
        const scaleSlider = document.getElementById('scaleSlider');
        const scaleDisplay = scaleSlider.nextElementSibling;
        scaleSlider.addEventListener('input', (e) => {
            const value = e.target.value + '%';
            scaleDisplay.textContent = value;
            if (this.selectedElement) {
                const scale = parseInt(e.target.value) / 100;
                this.selectedElement.style.transform = `scale(${scale})`;
                this.updateCssOutput();
            }
        });

        // Rotation Control
        const rotationSlider = document.getElementById('rotationSlider');
        const rotationDisplay = rotationSlider.nextElementSibling;
        rotationSlider.addEventListener('input', (e) => {
            const value = e.target.value + '°';
            rotationDisplay.textContent = value;
            if (this.selectedElement) {
                this.selectedElement.style.transform = `rotate(${e.target.value}deg)`;
                this.updateCssOutput();
            }
        });

        // Animation Speed Control
        const speedSelect = document.getElementById('animationSpeed');
        speedSelect.addEventListener('change', (e) => {
            if (this.selectedElement) {
                this.selectedElement.style.transitionDuration = e.target.value;
                this.updateCssOutput();
            }
        });
    }

    setupEffectsPanel() {
        const effectBtns = document.querySelectorAll('.effect-btn');
        
        effectBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (this.selectedElement) {
                    const effect = this.effects[btn.dataset.effect];
                    this.selectedElement.style.animation = effect.animation;
                    
                    setTimeout(() => {
                        this.selectedElement.style.animation = '';
                    }, parseFloat(effect.duration) * 1000);
                }
            });
        });
    }

    setupContextMenu() {
        const contextMenu = document.getElementById('contextMenu');
        const demoBoxes = document.querySelectorAll('.demo-box');

        // Show context menu
        demoBoxes.forEach(box => {
            box.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.selectedElement = box;
                this.updateControlsFromElement(box);
                
                contextMenu.style.display = 'block';
                contextMenu.style.left = e.pageX + 'px';
                contextMenu.style.top = e.pageY + 'px';
            });
        });

        // Hide context menu
        document.addEventListener('click', () => {
            contextMenu.style.display = 'none';
        });

        // Context menu actions
        contextMenu.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            if (action && this.selectedElement) {
                switch(action) {
                    case 'rotate':
                        this.selectedElement.style.transform = 'rotate(90deg)';
                        break;
                    case 'scale':
                        this.selectedElement.style.transform = 'scale(1.5)';
                        break;
                    case 'reset':
                        this.resetElementStyles();
                        break;
                    case 'animate':
                        this.selectedElement.style.animation = 'pulse 2s infinite';
                        break;
                }
                this.updateCssOutput();
            }
        });
    }

    setupCopyButton() {
        const copyBtn = document.getElementById('copyCss');
        copyBtn.addEventListener('click', () => {
            const cssOutput = document.getElementById('cssOutput');
            navigator.clipboard.writeText(cssOutput.textContent)
                .then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => {
                        copyBtn.textContent = 'Copy CSS';
                    }, 2000);
                });
        });
    }

    setupUndoRedo() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') {
                    e.preventDefault();
                    this.undo();
                } else if (e.key === 'y') {
                    e.preventDefault();
                    this.redo();
                }
            }
        });
    }

    updateControlsFromElement(element) {
        const style = window.getComputedStyle(element);
        
        // Update color picker
        const bgColorPicker = document.getElementById('bgColorPicker');
        bgColorPicker.value = this.rgbToHex(style.backgroundColor);

        // Update radius slider
        const radiusSlider = document.getElementById('radiusSlider');
        radiusSlider.value = parseInt(style.borderRadius);
        radiusSlider.nextElementSibling.textContent = style.borderRadius;

        // Update other controls...
        this.updateCssOutput();
    }

    resetElementStyles() {
        if (this.selectedElement) {
            this.selectedElement.style = '';
            this.updateControlsFromElement(this.selectedElement);
        }
    }

    updateCssOutput() {
        if (!this.selectedElement) return;

        const style = window.getComputedStyle(this.selectedElement);
        const relevantProperties = [
            'background-color',
            'border-radius',
            'transform',
            'transition-duration',
            'animation'
        ];

        const css = relevantProperties
            .map(prop => `    ${prop}: ${style.getPropertyValue(prop)};`)
            .join('\n');

        document.getElementById('cssOutput').textContent = 
            `.demo-box {\n${css}\n}`;
    }

    addToHistory(action) {
        this.historyIndex++;
        this.history = this.history.slice(0, this.historyIndex);
        this.history.push(action);
        
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.historyIndex--;
        }
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.applyHistoryState(this.history[this.historyIndex]);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.applyHistoryState(this.history[this.historyIndex]);
        }
    }

    applyHistoryState(state) {
        if (state.type === 'theme') {
            document.body.setAttribute('data-theme', state.value);
            document.querySelector(`[data-theme="${state.value}"]`).click();
        }
        // Add more state applications as needed
    }

    rgbToHex(rgb) {
        const values = rgb.match(/\d+/g);
        if (!values) return '#000000';
        
        return '#' + values.map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
}
