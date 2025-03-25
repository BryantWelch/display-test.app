# Display Test App

A modern, comprehensive display testing application designed to help users evaluate and diagnose various aspects of their displays. From dead pixels to response time, this tool provides a suite of tests to ensure your display is performing optimally. This is a client-side only application built with React, requiring no backend server.

![image](https://github.com/user-attachments/assets/7318370f-0e51-4939-b67a-477aa1d57a29)

## Available Tests

- **Dead Pixel Test**: Cycle through color patterns to identify dead, stuck, or subpixel defects
- **Uniformity Test**: Check screen uniformity and identify backlight bleeding or IPS glow
- **Text Clarity Test**: Assess text clarity, sharpness, and font rendering across different sizes
- **Color Gradient Test**: Evaluate smooth color transitions and check for color banding issues
- **Response Time Test**: Measure display motion performance with customizable moving objects and text
- **Color Distance Test**: Evaluate color accuracy and differentiation capabilities
- **Test Patterns Test**: Comprehensive patterns for geometry, convergence, and resolution testing
- **Gamma Test**: Verify gamma calibration and black level performance
- **Viewing Angle Test**: Assess color and contrast shifts at different viewing angles
- **Brightness Test**: Evaluate display brightness levels and consistency
- **Contrast Test**: Measure contrast ratio and black level performance
- **Matrix Test**: See how deep the rabbit hole goes with the iconic digital rain animation

## Features
- Modern, clean user interface
- Real-time adjustments
- Fullscreen mode support
- Cross-browser compatibility
- Mobile-responsive design

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BryantWelch/display-test.app.git
   cd display-test.app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## Screenshots

![image](https://github.com/user-attachments/assets/72d4ac9e-c1f4-4ee4-baae-832abd38f207)

## Usage Guide

### General Tips
- Run tests in a controlled lighting environment
- Clean your display before testing
- Use native resolution when possible
- Disable any auto-brightness or dynamic contrast features

### Keyboard Controls
- `F11`: Exit current test
- `Esc`: Exit current test
- `Space`: Pause/Resume animations (where applicable)
- Arrow keys: Adjust values in certain tests

## Technical Requirements

### Display Settings
- Recommended: Native resolution
- Refresh Rate: Highest supported refresh rate
- Color Depth: Highest supported color depth
- Display scaling: 100%

### Known Limitations
- Web-based testing may not be as precise as hardware solutions
- Results may vary based on browser and system performance
- Some tests may be affected by display scaling settings

## Troubleshooting

### Common Issues
1. **Test appears blurry**
   - Ensure display scaling is set to 100%
   - Use native resolution
   - Disable browser zoom

2. **Animation stuttering**
   - Close other resource-intensive applications
   - Disable browser extensions
   - Enable hardware acceleration

3. **Colors appear incorrect**
   - Disable night light/blue light filters
   - Check color profile settings
   - Disable auto-brightness

## Browser Compatibility

Tested and supported in:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Development Workflow

### Code Organization
- `/src/pages/tests/` - Individual test components
- `/src/components/` - Reusable UI components
- `/src/styles/` - Global styles and theme configuration
- `/src/assets/` - Static assets and test patterns
- `/src/store/` - Redux store configuration and slices

## Tech Stack

### Frontend
- React.js (v19)
- Redux Toolkit for state management
- React Router v6 for navigation
- Styled-components for styling
- Modern JavaScript (ES6+)

### Development
- Create React App
- ESLint for code quality
- Prettier for code formatting

### Key Dependencies
- @reduxjs/toolkit: ^2.5.1
- react: ^19.0.0
- react-dom: ^19.0.0
- react-router-dom: ^6.22.0
- styled-components: ^6.1.14

## FAQ

### General Questions
**Q: How accurate are these tests?**
A: While web-based tests can't match specialized hardware, they provide a good initial assessment of display performance.

**Q: Should I calibrate my display first?**
A: Basic calibration is recommended for most tests, but some tests specifically help identify calibration issues.

**Q: How often should I test my display?**
A: Regular testing helps track display degradation and identify issues early.

### Technical Questions
**Q: Why do some patterns look different in different browsers?**
A: Browser rendering engines handle color and animation differently. Use Chrome for most consistent results.

**Q: Does screen recording work with these tests?**
A: Screen recording may affect test performance and has not been properly tested. 

## 💖 Support

If you find this project helpful, consider supporting its development:

[![Buy Me a Coffee](https://storage.ko-fi.com/cdn/kofi5.png)](https://ko-fi.com/V7V01A0SJC)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
