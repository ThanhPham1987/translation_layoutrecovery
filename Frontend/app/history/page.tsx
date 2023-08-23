"use client";
import { useState, useEffect } from 'react';
import Navbar from "../components/navbar";
import InfiniteScroll from 'react-infinite-scroll-component';
import { redirect } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
const History = () => {
    const [pdfLinks, setPdfLinks] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchLinks, setSearchLinks] = useState([]);
    useEffect(() => {
        setSearching(false);
        fetch("/history/api")
            .then(res => res.json())
            .then(data => {
                if (!data.loggedIn) redirect("/login");
                if (data.status==="success") 
                    setPdfLinks(data.data)
            })
    }, []);

    const loadMore = () => {
        setHasMore(hasMore);
    };

    const getSearch = () => {

        fetch("/history/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: search.replace(/\s/g, '') })
        })
            .then(res => res.json())
            .then(data => { setSearchLinks(data.data); setSearching(true); })
            .catch(err => toast("Internal error, try again"))
    }
    return (
        <div className="min-h-screen flex">
            <Navbar />
            <main className="p-4 w-full overflow-y-scroll">
                <h2>History</h2>
                <div className="flex gap-2 my-2">
                    <input type="text" id="search" placeholder="Search your files here" className="rounded p-2 w-full grow"
                        value={search} onChange={e => setSearch(e.target.value)} />
                    <button className="bg-sky-600" onClick={() => getSearch()}>Search</button>
                    <button className="bg-sky-600 whitespace-nowrap" onClick={() => {setSearch(""); getSearch()}}>Get All Files</button>
                </div>
                {!searching ? (pdfLinks.length ? <InfiniteScroll
                    dataLength={pdfLinks.length}
                    next={loadMore}
                    hasMore={hasMore}
                    loader={<p>Loading...</p>}
                    endMessage={<p>No more PDFs</p>}
                >
                    <table className="w-full">
                        <tr>
                            <th>Input file</th>
                            <th>Output file</th>
                            <th>Status</th>
                            <th>Datetime</th>
                        </tr>
                        {pdfLinks.map((record, index) => {
                            const timestamp = record.time;
                            const [datePart, timePart] = timestamp.split("T")
                            const parsedDate = new Date(datePart + "T" + timePart);
                            const formattedDate = parsedDate.toISOString().replace("T", " ").slice(0, -5);
                            return (
                                <tr className="h-12">
                                    <td>
                                        <a href={record.file_input_url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 hover:underline">
                                            {record.file_input}
                                        </a>
                                    </td>
                                    <td>
                                        <a href={record.file_output_url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 hover:underline">
                                            {record.file_output}
                                        </a>
                                    </td>
                                    <td>{record.status === 1 ? <span className="bg-green-600 text-white py-1 px-2 rounded-full">Successful</span> :
                                        (record.status === 0 ? <span className="bg-yellow-600 text-white py-1 px-2 rounded-full">Processing</span> :
                                            <span className="bg-red-600 text-white py-1 px-2 rounded-full">Unsuccessful</span>)}</td>
                                    <td><span>{formattedDate}</span></td>
                                </tr>
                            )
                        })}
                    </table>
                </InfiniteScroll> : <p>No records, try to translate something!</p>)
                    : (searchLinks.length ? <InfiniteScroll
                        dataLength={searchLinks.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={<p></p>}
                        endMessage={<p></p>}
                    >
                        <table className="w-full">
                            <tr className="text-left">
                                <th>File</th>
                                <th>Language</th>
                                <th>Datetime</th>
                            </tr>
                            {searchLinks.map((record, index) => {
                                const timestamp = record.created_at;
                                const [datePart, timePart] = timestamp.split("T")
                                const parsedDate = new Date(datePart + "T" + timePart);
                                const formattedDate = parsedDate.toISOString().replace("T", " ").slice(0, -5);
                                return (
                                    <tr className="h-12">
                                        <td>
                                            <a href={record.file} target="_blank" rel="noopener noreferrer" className="hover:text-sky-600 hover:underline">
                                                {record.file_name}
                                            </a>
                                        </td>
                                        <td>{record.language === "vi" ? <span className="bg-green-600 text-white py-1 px-2 rounded-full">VI</span> :
                                            (record.language === "en" ? <span className="bg-yellow-600 text-white py-1 px-2 rounded-full">EN</span> :
                                                <span className="bg-red-600 text-white py-1 px-2 rounded-full">JP</span>)}</td>
                                        <td><span>{formattedDate}</span></td>
                                    </tr>
                                )
                            })}
                        </table>
                    </InfiniteScroll> : <p>Nothing found</p>)

                }
                <ToastContainer />
            </main>
        </div>
    )
}

export default History;