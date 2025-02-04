# Display Test App

A modern, comprehensive display testing application designed to help users evaluate and diagnose various aspects of their displays. From dead pixels to response time, this tool provides a suite of tests to ensure your display is performing optimally. This is a client-side only application built with React, requiring no backend server.

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

### Building for Production

To create a production build:
```bash
npm run build
```

The build artifacts will be stored in the `build/` directory.

## Screenshots
[Coming Soon] Visual examples of each test will be added here.

## Usage Guide

### General Tips
- Run tests in a controlled lighting environment
- Clean your display before testing
- Use native resolution when possible
- Disable any auto-brightness or dynamic contrast features

### Keyboard Controls
- `F11`: Toggle fullscreen mode
- `Esc`: Exit current test
- `Space`: Pause/Resume animations (where applicable)
- Arrow keys: Adjust values in certain tests

### Test-Specific Instructions
[Coming Soon] Detailed instructions for each test will be added here.

## Browser Compatibility

Tested and supported in:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

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

## Development Workflow

### Pattern Generation
The application includes a pattern generation script that creates test patterns for various display tests:
```bash
node scripts/generate-pattern-index.js
```
This script should be run whenever new patterns are added to the `src/assets/patterns` directory.

### Development Best Practices
- Use the provided ESLint configuration for code consistency
- Follow React hooks best practices for component development
- Ensure all tests are responsive and work in fullscreen mode
- Test changes across different browsers before submitting PRs

### Code Organization
- `/src/pages/tests/` - Individual test components
- `/src/components/` - Reusable UI components
- `/src/styles/` - Global styles and theme configuration
- `/src/assets/` - Static assets and test patterns
- `/src/store/` - Redux store configuration and slices

## Roadmap
[Coming soon!]

## FAQ

### General Questions
**Q: How accurate are these tests?**
A: While web-based tests can't match specialized hardware, they provide a good initial assessment of display performance.

**Q: Should I calibrate my display first?**
A: Basic calibration is recommended for most tests, but some tests specifically help identify calibration issues.

**Q: How often should I test my display?**
A: Regular testing (monthly) helps track display degradation and identify issues early.

### Technical Questions
**Q: Why do some patterns look different in different browsers?**
A: Browser rendering engines handle color and animation differently. Use Chrome for most consistent results.

**Q: Does screen recording work with these tests?**
A: Screen recording may affect test performance. It's recommended to run tests without recording.

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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by various display testing tools
- Built with modern web technologies
- Designed for display enthusiasts and professionals
