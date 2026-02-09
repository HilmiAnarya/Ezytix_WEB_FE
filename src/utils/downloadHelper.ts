// src/utils/downloadHelper.ts

export const downloadBlob = (blob: Blob, filename: string) => {
    // 1. Buat URL object dari blob data
    const url = window.URL.createObjectURL(blob);

    // 2. Buat elemen anchor (<a>) virtual
    const link = document.createElement("a");
    link.href = url;

    // 3. Set nama file download
    link.setAttribute("download", filename);

    // 4. Append ke body, klik, lalu remove
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);

    // 5. Bersihkan memory
    window.URL.revokeObjectURL(url);
};
