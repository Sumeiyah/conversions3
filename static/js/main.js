document.addEventListener('DOMContentLoaded', () => {
    const welcomeSection = document.getElementById('welcome-section');
    const conversionToolSection = document.getElementById('conversion-tool-section');
    const joinBtn = document.getElementById('join-btn');
    const conversionOptions = document.getElementById('conversion-options');
    const uploadForm = document.getElementById('upload-form');
    const statusDiv = document.getElementById('status');

    // Function to toggle between sections with smooth animations
    const toggleSections = (hideSection, showSection) => {
        hideSection.style.opacity = '0';
        hideSection.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            hideSection.style.display = 'none';
            showSection.style.display = 'block';
            setTimeout(() => {
                showSection.style.opacity = '1';
            }, 100);
        }, 500);
    };

    // Event listener for join button click
    joinBtn.addEventListener('click', () => {
        toggleSections(welcomeSection, conversionToolSection);
    });

    // Define the available conversion types
    const conversions = [
        { name: 'PDF to Word', value: 'pdf_to_word' },
        { name: 'PDF to PowerPoint', value: 'pdf_to_ppt' },
        { name: 'Word to PDF', value: 'word_to_pdf' },
        { name: 'Word to JPG', value: 'word_to_jpg' }
        // Add other conversion types here
    ];

    // Add buttons for each conversion type with animations
    conversions.forEach(conversion => {
        let button = document.createElement('button');
        button.textContent = conversion.name;
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        button.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        button.onclick = () => {
            uploadForm.style.display = 'block';
            uploadForm['conversion_type'].value = conversion.value;
        };
        setTimeout(() => {
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 300);
        conversionOptions.appendChild(button);
    });

    // Event listener for form submission with smooth animations
    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let formData = new FormData(this);
        formData.append('conversion_type', uploadForm['conversion_type'].value);

        fetch('/convert', {
            method: 'POST',
            body: formData
        }).then(response => {
            if(response.ok) {
                return response.blob();
            } else {
                return response.json().then(error => { throw new Error(error.error); });
            }
        }).then(blob => {
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'converted_file'; // Modify this line to set the filename dynamically based on conversion type or server response
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        }).catch(error => {
            statusDiv.innerText = 'Error: ' + error.message;
        });
    });
});
