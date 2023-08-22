'use client';
import { useEffect, useState } from "react";
import Navbar from './components/navbar'
import { useDropzone } from 'react-dropzone';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";


export default function Home() {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone();
    const [pdfLink, setPdfLink] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    useEffect(() => {
        fetch("/api")
        .then(res => res.json())
        .then(data => setLoggedIn(data.loggedIn));
    }, []);
    const files = acceptedFiles.map(file => (
        <li key={file.path}>{file.path}</li>
    ));
    const submitFiles = async () => {
        if (acceptedFiles[0] === undefined) {
            toast("Empty file");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("file", acceptedFiles[0]);
            fetch("/api", {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => { toast(data); setPdfLink(data.data.file_output) });
        } catch (err) { toast("Internal error, try again"); }

    }
    return (
        <div className="h-screen flex">
            <Navbar />
            <main className="p-4 w-full">
                {loggedIn ? <>
                    <div {...getRootProps()} className="w-full h-32 border border-8 border-dashed rounded my-4 text-center flex justify-center flex-col text-neutral-500">
                        <input {...getInputProps()} />
                        <p>Drag and drop files here, or click to browse</p>
                        <ul>{files}</ul>
                    </div>
                    <button className="bg-sky-400" onClick={() => submitFiles()}>Translate</button>
                    {pdfLink && <a href={pdfLink} target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 hover:underline">Translated File</a>}
                </> : <>
                    <h1 className="text-center text-5xl text-sky-500">TransLayout</h1>
                    <h2 className="my-4">About us</h2>
                    <p>Blah blah blah blah</p>
                    <Link href="/login"><button className="bg-sky-400">Sign in now</button></Link>
                </>}
                <ToastContainer />
            </main>
        </div>
    )


}
