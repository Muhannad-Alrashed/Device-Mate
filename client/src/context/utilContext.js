import { createContext, useState } from "react";

export const UtilContext = createContext();

export const UtilContextProvider = ({ children }) => {
    //
    // Generate cnnection code
    const generateConnectionCode = () => {
        return Array(16).fill(null).map((_, i) =>
            (i % 4 === 3 && i !== 15) ? "-" :
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                    .charAt(Math.floor(Math.random() * 62))
        ).join('');
    };

    // Get time string
    const getDateTime = (theTime = new Date()) => {
        const time = theTime instanceof Date ? theTime : new Date(theTime);
        const year = time.getFullYear();
        const month = String(time.getMonth() + 1).padStart(2, '0');
        const day = String(time.getDate()).padStart(2, '0');
        const hour = String(time.getHours() % 12 || 12).padStart(2, '0');
        const tag = time.getHours() >= 12 ? "PM" : "AM";
        const minute = String(time.getMinutes()).padStart(2, '0');
        return `${month}/${day}/${year} - ${hour}:${minute} ${tag}`;
    };

    // Get time string
    const getTime = (theTime = new Date()) => {
        const time = theTime instanceof Date ? theTime : new Date(theTime);
        const hour = String(time.getHours() % 12 || 12).padStart(2, '0');
        const tag = time.getHours() >= 12 ? "PM" : "AM";
        const minute = String(time.getMinutes()).padStart(2, '0');
        return `${hour}:${minute} ${tag}`;
    };

    // Download file
    const downloadFile = (buffer, filename) => {
        let blob = new Blob(buffer); // Create a Blob object
        const url = URL.createObjectURL(blob); // Create a URL for the Blob object
        const anchor = document.createElement("a"); // Create an anchor element
        anchor.href = url;
        anchor.download = filename; // Set the download attribute with the filename
        document.body.appendChild(anchor); // Append the anchor to the body (required for Firefox)
        anchor.click(); // Programmatically click the anchor to trigger the download
        document.body.removeChild(anchor); // Clean up by removing the anchor and revoking the Blob URL
        URL.revokeObjectURL(url);
    }

    // Pass action triggers
    const [action, setAction] = useState({ name: null, param: null });
    const triggerAction = (actionName, parameter) => {
        setAction({ name: actionName, param: parameter });
    };

    //--------------------------------------------------------------------------------

    return (
        <UtilContext.Provider
            value={{
                generateConnectionCode, downloadFile, getDateTime,
                action, setAction, triggerAction, getTime
            }}>
            {children}
        </UtilContext.Provider>
    );
};