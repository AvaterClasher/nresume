# Nresume

This project is a **Resume Parser** that extracts structured information such as job titles, companies, dates, and descriptions from resume PDFs. It processes resumes in the **Browser environments**, making it flexible for different use cases. The extracted data is returned in a JSON format, which can be used for further processing or storage.

## Installation

```bash
npm install nresume
```

## Considerations

Nresume assumes some basic structure in the resume PDFs, such as the use of headings for job titles and companies, and bullet points for descriptions.The parser uses a combination of regular expressions and feature scoring to identify the most relevant information. However, the parser may not work as expected for resumes with complex layouts or unconventional formats.

Right now it only supports `Single column` resumes, the below picture is the structure of the resume that nresume assumes.

![image](https://github.com/user-attachments/assets/31c4e5ab-51b3-4fe7-b78b-64212cc1bd01)

But what about `Projects section` well projects can have way too many variations, so it's hard to predict the structure of the project section in the resume, so for now, the parser doesn't support the project section.


## Features

- **Feature Scoring**: Uses feature scoring logic to identify the most relevant information (titles, companies, dates) based on certain patterns.
- **Bullet Point Detection**: Identifies and extracts descriptions from bullet points within the resume.
- **Flexible Environment**: Works on **browser** for client-side use.

## Usage

### In the Browser (Client-Side)

#### For Next.js

For Next.js, you can use the following code snippet to parse a resume PDF file and display the extracted data in a React component:
There is also a complete example in the [`examples/nextjs/src/app/page.tsx`](examples/nextjs/src/app/page.tsx).

```tsx
"use client";

import { parseResumeFromFile, pdfjs } from 'nresume';
import { useState } from 'react';

// Polyfill for `Promise.withResolvers`, which is required for Next.js builds on Vercel
if (typeof Promise.withResolvers === 'undefined') {
  if (typeof window !== 'undefined') {
    // @ts-expect-error Polyfilling Promise.withResolvers
    window.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  } else {
    // @ts-expect-error Polyfilling Promise.withResolvers
    global.Promise.withResolvers = function () {
      let resolve, reject;
      const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    };
  }
}

// Configure pdf.js worker for the parser the version must be 4.7.76 as the parser is built on top of this version.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.min.mjs`;

export default function Home() {
    const [resumeData, setResumeData] = useState(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const resume = await parseResumeFromFile(file);
                console.log(resume);
                setResumeData(resume);
            } catch (error) {
                console.error('Error parsing resume:', error);
                alert('Error parsing resume file');
            }
        }
    };

    return (
        <div className='flex flex-col items-center p-4'>
            <input type="file" onChange={handleFileChange} />
            <div className='mt-5 p-4 border border-gray-300 rounded w-full max-w-lg'>
                {resumeData ? (
                    <pre>{JSON.stringify(resumeData, null, 2)}</pre>
                ) : (
                    <p>Upload a resume PDF to see parsed data here.</p>
                )}
            </div>
        </div>
    );
}
```

#### For Vanilla JavaScript

```javascript
import { parseResumeFromFile, pdfjs } from 'nresume';

// Need to get the worker from a CDN the version must be 4.7.76 as the parser is built on top of this version.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.7.76/pdf.worker.min.mjs`;

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

## Credits

This project is inspired from the [Open-Resume](https://github.com/xitanggg/open-resume/) project but the feature scoring of that Open-Resume is much better than this project. Mainly due to fact that I wanted to write my own feature scroring logic.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Happy Parsing! 😊
