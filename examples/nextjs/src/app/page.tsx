"use client";

import { parseResumeFromFile, pdfjs } from 'nresume';
import { useState } from 'react';

// This is a polyfill for `Promise.withResolvers` it needs to be in the Page.tsx otherwise it wont build on vercel
if (typeof Promise.withResolvers === 'undefined') {
  if (typeof window !== 'undefined') {
      // @ts-expect-error This does not exist outside of polyfill which this is doing
      window.Promise.withResolvers = function () {
          let resolve, reject;
          const promise = new Promise((res, rej) => {
              resolve = res;
              reject = rej;
          });
          return { promise, resolve, reject };
      };
  } else {
      // @ts-expect-error This does not exist outside of polyfill which this is doing
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

// Also need this for loading the worker script && Pdfjs does the processing on a seperate thread than the main thread to not block it
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
        <>
            <div className='flex flex-col'>
                <input type="file" onChange={handleFileChange} />
                <div className='mx-auto px-3 mt-5 border-white border'>
                    {resumeData && (
                        <pre>{JSON.stringify(resumeData, null, 2)}</pre>
                    )}
                </div>
            </div>
        </>
    );
}
