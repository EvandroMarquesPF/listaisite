/**
 * ListAI - Icon Replacer
 * Replaces Font Awesome icons with optimized SVG icons for mobile
 */

class IconReplacer {
  constructor() {
    this.iconMap = {
      'fa-rocket': 'rocket',
      'fa-download': 'download',
      'fa-brain': 'brain',
      'fa-qrcode': 'qrcode',
      'fa-users': 'users',
      'fa-chart-line': 'chart-line',
      'fa-store': 'store',
      'fa-mobile-alt': 'mobile-alt',
      'fa-map-marker-alt': 'map-marker-alt',
      'fa-search-dollar': 'search-dollar',
      'fa-route': 'route',
      'fa-clock': 'clock',
      'fa-check': 'check',
      'fa-envelope': 'envelope'
    };
    
    this.init();
  }
  
  init() {
    this.replaceIcons();
    this.setupObserver();
  }
  
  replaceIcons() {
    const iconElements = document.querySelectorAll('i[class*="fa-"]');
    
    iconElements.forEach(element => {
      const classes = element.className;
      const iconName = this.getIconName(classes);
      
      if (iconName && this.iconMap[iconName]) {
        this.replaceWithSVG(element, this.iconMap[iconName]);
      }
    });
  }
  
  getIconName(classes) {
    const faClass = classes.match(/fa-[a-z-]+/);
    return faClass ? faClass[0] : null;
  }
  
  replaceWithSVG(element, iconName) {
    const svg = this.createSVGIcon(iconName, element);
    element.parentNode.replaceChild(svg, element);
  }
  
  createSVGIcon(iconName, originalElement) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const iconPath = `icons/${iconName}.svg`;
    
    // Set SVG attributes
    svg.setAttribute('class', `icon ${originalElement.className.replace(/fa-[a-z-]+/g, '').trim()}`);
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '24');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    
    // Copy aria attributes
    if (originalElement.hasAttribute('aria-hidden')) {
      svg.setAttribute('aria-hidden', originalElement.getAttribute('aria-hidden'));
    }
    if (originalElement.hasAttribute('aria-label')) {
      svg.setAttribute('aria-label', originalElement.getAttribute('aria-label'));
    }
    
    // Load SVG content
    this.loadSVGContent(svg, iconPath);
    
    return svg;
  }
  
  async loadSVGContent(svg, iconPath) {
    try {
      const response = await fetch(iconPath);
      const svgText = await response.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgContent = svgDoc.querySelector('svg');
      
      if (svgContent) {
        // Copy all child elements
        while (svgContent.firstChild) {
          svg.appendChild(svgContent.firstChild);
        }
      }
    } catch (error) {
      console.warn(`Failed to load icon: ${iconPath}`, error);
      // Fallback: create a simple placeholder
      this.createFallbackIcon(svg);
    }
  }
  
  createFallbackIcon(svg) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '10');
    circle.setAttribute('fill', 'currentColor');
    svg.appendChild(circle);
  }
  
  setupObserver() {
    // Watch for dynamically added icons
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const iconElements = node.querySelectorAll ? 
              node.querySelectorAll('i[class*="fa-"]') : 
              (node.matches && node.matches('i[class*="fa-"]') ? [node] : []);
            
            iconElements.forEach(element => {
              const classes = element.className;
              const iconName = this.getIconName(classes);
              
              if (iconName && this.iconMap[iconName]) {
                this.replaceWithSVG(element, this.iconMap[iconName]);
              }
            });
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new IconReplacer();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = IconReplacer;
}
