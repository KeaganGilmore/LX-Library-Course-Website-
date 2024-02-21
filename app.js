document.addEventListener("DOMContentLoaded", function () {
    // Get the moon element (now the enroll button)
    const enrollButton = document.querySelector('.enroll-button');

    // Add event listener for click events
    enrollButton.addEventListener('click', function() {
        // Replace this with the functionality you want when the button is clicked
        alert('Enroll Now button clicked!');
    });

    // Set initial style for the button
    enrollButton.style.transition = 'transform 2s ease';

    // Calculate the starting size of the button as half of the viewport's minimum dimension
    const initialSize = Math.min(window.innerWidth, window.innerHeight) / 2;
    enrollButton.style.width = initialSize + 'px';
    enrollButton.style.height = initialSize + 'px';

    // Define the maximum size of the button as 4/5 of the initial size
    const maxSize = initialSize * 4 / 5;

    // Get the turbulence filter element
    const turbulenceFilter = document.querySelector('#distort feTurbulence');

    // Function to continuously animate and change the button properties
    function animateButton() {
        // Generate random values for scale within the limits
        const randomScale = Math.random() * (maxSize - initialSize) + initialSize;

        // Gradually change the baseFrequency for continuous distortion
        const currentFrequency = parseFloat(turbulenceFilter.getAttribute('baseFrequency'));
        const randomFrequency = Math.random() * 0.1; // Adjust the range based on your preference

        let startTime = null;
        function updateFrequency(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const duration = 3000; // Change duration as needed
            const newFrequency = currentFrequency + (randomFrequency - currentFrequency) * (progress / duration);
            turbulenceFilter.setAttribute('baseFrequency', newFrequency);
            if (progress < duration) {
                requestAnimationFrame(updateFrequency);
            }
        }

        requestAnimationFrame(updateFrequency);

        // Apply distortion effect only to the background shape
        enrollButton.style.filter = `url(#distort)`;
        
        // Apply changes with smooth transitions
        enrollButton.style.transform = `scale(${randomScale}px)`;
    }

    // Trigger the animation function for the button at regular intervals
    setInterval(animateButton, 3000);

    // Additional animation for the SVG elements
    const svgElements = document.querySelectorAll('.moon ellipse.button-shape');
    svgElements.forEach(element => {
        element.style.transition = 'fill 2s ease';
        setInterval(() => {
            const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
            element.style.fill = randomColor;
        }, 2000);
    });
});

const track = document.getElementById("image-track");

const handleOnDown = e => track.dataset.mouseDownAt = e.clientX;

const handleOnUp = () => {
  track.dataset.mouseDownAt = "0";  
  track.dataset.prevPercentage = track.dataset.percentage;
}

const handleOnMove = e => {
  if(track.dataset.mouseDownAt === "0") return;
  
  const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;
  
  const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);
  
  track.dataset.percentage = nextPercentage;
  
  track.animate({
    transform: `translate(${nextPercentage}%, -50%)`
  }, { duration: 1200, fill: "forwards" });
  
  for(const image of track.getElementsByClassName("image")) {
    image.animate({
      objectPosition: `${100 + nextPercentage}% center`
    }, { duration: 1200, fill: "forwards" });
  }
}

/* -- Had to add extra lines for touch events -- */

window.onmousedown = e => handleOnDown(e);

window.ontouchstart = e => handleOnDown(e.touches[0]);

window.onmouseup = e => handleOnUp(e);

window.ontouchend = e => handleOnUp(e.touches[0]);

window.onmousemove = e => handleOnMove(e);

window.ontouchmove = e => handleOnMove(e.touches[0]);
