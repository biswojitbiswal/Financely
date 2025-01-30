import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BASE_URL } from '../../../config';
import { useAuth } from '../../Store/Auth';
import { useRefresh } from '../../Store/RefreshContext';

function ExportImport({ transactions }) {
    const [file, setFile] = useState(null);
    const [isFileSelected, setIsFileSelected] = useState(false)

    const {authorization} = useAuth();
    const {toggleRefresh} = useRefresh();

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setIsFileSelected(true);
    }

    const handleImport = async() => {
        if(!file){
            toast.error("Plz Select A File To Import");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${BASE_URL}/api/financely/transaction/import`, {
                method: "POST",
                headers: {
                    Authorization: authorization,
                },
                body: formData,
            })

            const data = await response.json();
            console.log(data);

            if (response.ok) {
                toast.success("Transactions imported successfully");
                toggleRefresh()
                setFile(null);
                setIsFileSelected(false);
            } else {
                toast.error("Error importing transactions");
            }
        } catch (error) {
            console.log(error)
            toast.error("Error uploading file");
        }

    }

    const handleExport = () => {
        if (transactions.length === 0) {
            toast.error("No Transaction To Export");
            return;
        }

        const headers = ["SL No.", "Name", "Tag", "Date", "Amount", "Type", "Payment Mode"];

        const rows = transactions.map((item, index) => [
            index + 1,
            item.transName,
            item.tag,
            new Date(item.date).toLocaleDateString('en-GB').replace(/\//g, '-'),
            item.transType === 'Income' ? `+${item.amount}` : `-${item.amount}`,
            item.transType,
            item.paymentMode,
        ])

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    return (
        <>
            <div className='d-flex gap-2'>
                <Button variant='primary' onClick={handleExport}>Export</Button>
                <Button
                    variant="primary"
                    onClick={() => {
                        if (isFileSelected) {
                            handleImport(); // Call the handleImport function if file is selected
                        } else {
                            document.getElementById('fileInput').click(); // Open file dialog if no file is selected
                        }
                    }}
                >
                    {isFileSelected ? "Upload" : "Import"} {/* Button text changes based on file selection */}
                </Button>
                <input type="file"
                    onChange={handleFile}
                    id='fileInput'
                    style={{ display: "none" }}
                />
            </div>
        </>
    )
}

export default ExportImport
