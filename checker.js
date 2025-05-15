document.addEventListener('DOMContentLoaded', function () {
    const verifyButton = document.querySelector('.verify-button');

    // File Upload Area
    const fileInput = document.querySelector('.upload-area');
    const fileInputElement = document.createElement('input');
    fileInputElement.type = 'file';
    fileInputElement.style.display = 'none';
    fileInput.appendChild(fileInputElement);

    fileInput.addEventListener('click', function () {
        fileInputElement.click();
    });

    // Variables to hold file and hash input
    let file = null;
    let originalHash = null;

    // Handle the file input change (to display the file name)
    fileInput.addEventListener('change', function (event) {
        file = event.target.files[0];

        const fileNameDisplay = document.querySelector('.file-name');
        const uploadMessage = document.querySelector('.upload-message');

        if (file) {
            fileNameDisplay.textContent = `Selected file: ${file.name}`;

            // Hide the icon and text
            if (uploadMessage) {
                uploadMessage.style.display = 'none';
            }
        } else {
            fileNameDisplay.textContent = 'No file selected';

            // Show the icon and text again (optional)
            if (uploadMessage) {
                uploadMessage.style.display = 'block';
            }
        }
    });

    // Handle the verify button click
    verifyButton.addEventListener('click', function () {
        const checkedBoxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
        if (checkedBoxes.length !== 2 || !file) {
            alert("Please upload a file, select two algorithms, and enter the original hash.");
            return;
        }

        const algo1 = checkedBoxes[0].value;
        const algo2 = checkedBoxes[1].value;

        const hashInput = document.querySelector('.hash-input').value.trim();

        // Check if the user has uploaded a file and entered a hash
        if (!file || !algo1 || !algo2 || !hashInput) {
            alert("Please upload a file, select two algorithms, and enter the original hash.");
            return;
        }

        // Prepare form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('algorithm1', algo1);
        formData.append('algorithm2', algo2);
        formData.append('original_hash', hashInput);

        // Send the request to verify integrity
        fetch('/check', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                const resultSection = document.querySelector('.verification-result');
                if (data.error) {
                    resultSection.textContent = `Error: ${data.error}`;
                    return;
                }

                // Remove any previous result styles
                resultSection.classList.remove('tampered', 'authentic');

                // Display the result with the appropriate background color
                const match = data.match ? 'The file is authentic.' : 'The file has been tampered with.';
                resultSection.textContent = `${match}\nRecalculated Hash: ${data.recalculated_hash}`;

                if (data.match) {
                    resultSection.classList.add('authentic'); // light green
                } else {
                    resultSection.classList.add('tampered'); // light red
                }
            })
            .catch(error => {
                console.error('Error verifying file integrity:', error);
            });
    });
});
