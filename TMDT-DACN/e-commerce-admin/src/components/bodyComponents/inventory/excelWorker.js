// excelWorker.js
importScripts('https://unpkg.com/xlsx/dist/xlsx.full.min.js');

self.addEventListener('message', (e) => {
    const { data, type } = e.data;
    if (type === 'file') {
        // Giả sử bạn đã truyền ArrayBuffer của file
        const workbook = XLSX.read(data, { type: 'array' });
        const result = {};

        workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            result[sheetName] = jsonData;
        });

        postMessage({ fileName: e.data.fileName, sheets: result });
    }
});
