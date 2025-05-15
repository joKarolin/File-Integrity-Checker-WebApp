document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.querySelector('.generate-button');
    const fileInput = document.querySelector('#file-input');
    const resultBox = document.querySelector('.result-box');
    const copyButton = document.querySelector('.copy-button');

    // Handle the file input
    document.querySelector('.upload-area').addEventListener('click', function () {
        fileInput.click();
    });

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


    // Handle the generate button click
    generateButton.addEventListener('click', function () {
        const checkedBoxes = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
        if (checkedBoxes.length !== 2 || !file) {
            alert("Please upload a file, select two algorithms, and enter the original hash.");
            return;
        }

        const algo1 = checkedBoxes[0].value;
        const algo2 = checkedBoxes[1].value;

        if (!fileInput.files.length || !algo1 || !algo2) {
            alert("Please upload a file and select two algorithms.");
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('algorithm1', algo1);
        formData.append('algorithm2', algo2);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.hybrid_hash) {
                    resultBox.textContent = data.hybrid_hash; 
                } else {
                    alert(data.error || "Something went wrong.");
                }
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error generating the hash.");
            });
    });
    // Handle copy button click
    copyButton.addEventListener('click', function () {
        const textToCopy = resultBox.textContent;

        if (!textToCopy) {
            alert("No hash to copy!");
            return;
        }

        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert("Hash copied to clipboard!");
            })
            .catch(err => {
                console.error("Failed to copy text: ", err);
            });
    });
});
