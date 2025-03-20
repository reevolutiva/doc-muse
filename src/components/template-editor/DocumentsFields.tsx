import React, { useState } from 'react';

const DocumentsFields = () => {
    const [sectionType, setSectionType] = useState("heading1");
    const [content, setContent] = useState("");
    const [ia, setIa] = useState("");
    const [url, setUrl] = useState("");

    return ( 
        <div className="project-fields">

            <div className="flex flex-col gap-2">
            <label htmlFor="section_type">Section Type:</label>
            <select 
                id="section_type" 
                required
                value={sectionType}
                onChange={(e) => setSectionType(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-smmt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            >
                <option value="heading1">Heading 1</option>
                <option value="heading2">Heading 2</option>
                <option value="paragraph">Paragraph</option>
                <option value="table">Table</option>
                <option value="image">Image</option>
            </select>
            </div>

            <div className="flex flex-col gap-2">
            <label htmlFor="content">Content:</label>
            <textarea 
                id="content" 
                required 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
            </div>

            <div className="flex flex-col gap-2">
            <label htmlFor="ia">IA:</label>
            <input 
                type="text" 
                id="ia" 
                value={ia}
                onChange={(e) => setIa(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            />
            </div>

            {sectionType === "image" && (
                <div className="flex flex-col gap-2">
                    <label htmlFor="url">URL:</label>
                    <input 
                        type="url" 
                        id="url" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    />
                </div>
            )}

        </div>
     );
}

export default DocumentsFields;