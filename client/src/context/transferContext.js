import React, { createContext, useState, useEffect } from 'react';

export const TransferContext = createContext();

export const TransferContextProvider = ({ children }) => {

    // Initialize or load localStorage
    const loadFromLocalStorage = (key, defaultValue) => {
        const storedValue = localStorage.getItem(key);
        return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
    };
    const [isTransferring, setIsTransferring] = useState(
        () => loadFromLocalStorage('transferState', { export: false, import: false }));
    const [sharedFile, setSharedFile] = useState(
        () => loadFromLocalStorage('sharedFile', { metadate: {}, transmitted: 0, buffer: [] }));
    const [exportedFilesList, setExportedFilesList] = useState(
        () => loadFromLocalStorage('exportedFilesList', []));
    const [importedFilesList, setImportedFilesList] = useState(
        () => loadFromLocalStorage('importedFilesList', []));

    // Store data in localStorage
    useEffect(() => {
        localStorage.setItem('transferState', JSON.stringify(isTransferring));
    }, [isTransferring]);
    useEffect(() => {
        localStorage.setItem('sharedFile', JSON.stringify(sharedFile));
    }, [sharedFile]);
    useEffect(() => {
        localStorage.setItem('exportedFilesList', JSON.stringify(exportedFilesList));
    }, [exportedFilesList]);
    useEffect(() => {
        localStorage.setItem('importedFilesList', JSON.stringify(importedFilesList));
    }, [importedFilesList]);

    // Clear localStorage and reset state
    const clearTransferData = () => {
        localStorage.removeItem('transferState');
        localStorage.removeItem('sharedFile');
        localStorage.removeItem('exportedFilesList');
        localStorage.removeItem('importedFilesList');
        setIsTransferring({ export: false, import: false });
        setSharedFile({ metadate: {}, transmitted: 0, buffer: [] });
        setExportedFilesList([]);
        setImportedFilesList([]);
    };

    return (
        <TransferContext.Provider value={{
            isTransferring, setIsTransferring, sharedFile, setSharedFile,
            exportedFilesList, setExportedFilesList, importedFilesList,
            setImportedFilesList, clearTransferData
        }}>
            {children}
        </TransferContext.Provider>
    );
};