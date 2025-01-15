document.addEventListener('DOMContentLoaded', function() {
    // Display resolution
    function updateResolution() {
        const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        document.getElementById('resolution-value').textContent = `${width} x ${height}`;
    }
    
    updateResolution();
    window.addEventListener('resize', updateResolution);

    // Create color bars
    const colors = ['red', 'green', 'blue', 'yellow', 'cyan', 'magenta', 'white'];
    const colorBars = document.querySelector('.color-bars');
    colors.forEach(color => {
        const div = document.createElement('div');
        div.style.backgroundColor = color;
        colorBars.appendChild(div);
    });
});
