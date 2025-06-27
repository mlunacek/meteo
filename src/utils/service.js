import { fetchAuthSession } from 'aws-amplify/auth';
import pako from 'pako';  // A popular gzip decompression library
import Papa from 'papaparse';  // A library for parsing CSV data

import { jwtDecode } from 'jwt-decode';

const URL = "https://rdboj03te0.execute-api.us-west-2.amazonaws.com/Prod/"


export const submitSQS = async ({ queue_url, num_hours, num_variables, setResponse }) => {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    // const decoded = jwtDecode(token);
    // console.log("decoded", decoded)

    try {

        const body = JSON.stringify({
            "queue_url": queue_url,
            "message": {
                "num_hours": num_hours,
                "num_variables": num_variables
            }
        })

        console.log("body", body)

        const res = await fetch(`${URL}/sqs/send_message`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: body
        });
        // const data = await res.json();

        // const res2 = await fetch(`https://31v8lvbkj1.execute-api.us-west-2.amazonaws.com/Prod/queue`, {
        //     headers: {
        //         Authorization: token
        //     }
        // })
        // const data2 = await res2.json();
        // console.log(data2)
        setResponse(res)
    }
    catch (err) {
        console.error('Error fetching:', err.message || err);
        // Optionally: Show error to user or rethrow
    }


}


export const fetchJson = async ({ key, bucket, operation, setFunction }) => {

    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    try {
        const decoded = jwtDecode(token);
        console.log("decoded", decoded);
    }
    catch (err) {
        console.error('Error decoding', err.message || err);
        return;
    }

    try {
        const res = await fetch(`${URL}/s3/signed-url`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: key,
                bucket: bucket,
                operation: operation
            })
        });

        const data = await res.json();
        console.log(data.url)
        // console.log('Signed URL:', data.url);
        const response = await fetch(data?.url);
        console.log("response", response.status)
        if (!response.ok) {
            throw new Error('Failed to fetch file');
        }
        const content = await response.json();
        if (setFunction) {
            setFunction(content)
        }
        return content
    }
    catch (err) {
        console.error('Error fetching:', err.message || err);
    }
};


export const fetchGzipCsv = async ({ key, bucket, operation, setFunction }) => {

    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    try {
        const decoded = jwtDecode(token);
        console.log("decoded", decoded);
    }
    catch (err) {
        console.error('Error decoding', err.message || err);
    }

    try {
        // const res = await fetch(`https://31v8lvbkj1.execute-api.us-west-2.amazonaws.com/Prod/${path}`,
        //     { headers })
        const res = await fetch(`${URL}/s3/signed-url`, {
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: key,
                bucket: bucket,
                operation: operation
            })
        });

        const data = await res.json();
        console.log(data.url)
        // console.log('Signed URL:', data.url);
        const response = await fetch(data?.url);
        console.log("response", response.status)
        if (!response.ok) {
            throw new Error('Failed to fetch file');
        }

        const compressedData = await response.arrayBuffer();
        const decompressedData = pako.ungzip(new Uint8Array(compressedData), { to: 'string' });

        // Step 4: Parse the decompressed CSV data
        const parsedCSV = Papa.parse(decompressedData, {
            header: true,  // If the CSV has headers
            skipEmptyLines: true,  // Skip empty lines if present
        });

        if (setFunction) {
            setFunction(parsedCSV.data)
        }
        return parsedCSV.data
    }
    catch (err) {
        console.error('Error fetching:', err.message || err);
    }
};