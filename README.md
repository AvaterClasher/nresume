# Nresume

This project is a **Resume Parser** that extracts structured information such as job titles, companies, dates, and descriptions from resume PDFs. It processes resumes in the **Browser environments**, making it flexible for different use cases. The extracted data is returned in a JSON format, which can be used for further processing or storage.

## Considerations

Nresume assumes some basic structure in the resume PDFs, such as the use of headings for job titles and companies, and bullet points for descriptions.The parser uses a combination of regular expressions and feature scoring to identify the most relevant information. However, the parser may not work as expected for resumes with complex layouts or unconventional formats.

Right now it only supports `Single column` resumes, the below picture is the structure of the resume that nresume assumes.

![image](https://github.com/user-attachments/assets/31c4e5ab-51b3-4fe7-b78b-64212cc1bd01)

But what about `Projects section` well projects can have way too many variations, so it's hard to predict the structure of the project section in the resume, so for now, the parser doesn't support the project section.


## Features

-   **Feature Scoring**: Uses feature scoring logic to identify the most relevant information (titles, companies, dates) based on certain patterns.
-   **Bullet Point Detection**: Identifies and extracts descriptions from bullet points within the resume.
-   **Flexible Environment**: Works on **browser** for client-side use.

## Installation

### Using npm:

```bash
npm install nresume
```

## Usage

### In Node.js (Server Environment)

<-- IN PROGRESS -->

### In the Browser (Client-Side)

To use the parser in a browser, import the necessary functions and pass in the PDF file as a Blob.
Setting the `pdfjs.GlobalWorkerOptions.workerSrc` to `nresume/pdf.worker.min.mjs` is necessary to load the worker script from the correct location.

```javascript
import { parseResumeFromFile, pdfjs } from 'nresume';

pdfjs.GlobalWorkerOptions.workerSrc = `nresume/pdf.worker.min.mjs`;

// Handle file upload (for example, through an input element)
const fileInput = document
    .getElementById('fileInput')
    .addEventListener('change', async event => {
        const file = event.target.files[0];
        if (file) {
            try {
                const resumeData = await parseResumeFromFile(file);
                document.getElementById('output').textContent = JSON.stringify(
                    resumeData,
                    null,
                    2
                );
            } catch (error) {
                console.error('Error parsing resume:', error);
            }
        }
    });
```

## Development

If you'd like to contribute or improve the project:

1. Clone the repository:

```bash
git clone https://github.com/AvaterClasher/nresume.git
cd nresume
```

2. Install dependencies:

```bash
npm install
```

3. Build the package:

```bash
npm run build
```

4. For using the package:

```bash
npm link
```

## Contribution

Feel free to open issues, submit pull requests, or suggest improvements. Before contributing, ensure that the code adheres to the code style.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Happy Parsing! 😊
