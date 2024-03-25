// welcome.js
const typewriterText = "The one-stop solution for all your document conversion needs.";
let index = 0;

function typeWriter() {
    if (index < typewriterText.length) {
        document.querySelector(".welcome-description").textContent += typewriterText.charAt(index);
        index++;
        setTimeout(typeWriter, 100);
    }
}

// Call typewriter on DOM Load
document.addEventListener('DOMContentLoaded', (event) => {
    typeWriter();
});
