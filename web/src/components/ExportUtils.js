export async function ExportToCsv(
  gridElement,
  fileName
) {
  const { head, body, foot } = await getGridContent(gridElement);
  const headText = head.map(serialiseCellValue).join(',');
  const bodyText = body.map((cells) => cells.map(serialiseCellValue).join(',')).join('\n');
  const footText = foot.map(serialiseCellValue).join(',');
  downloadFile(fileName, new Blob([`${headText}\n${bodyText}\n${footText}`], { type: 'text/csv;charset=utf-8;' }));
}

async function getGridContent(datalist) {
  const head = [];
  const body = [];
  const foot = [];

  datalist.forEach((item, index) => {
    const tmp = []
    for (var key in item) {
      if (index === 0) {
        head.push(key);
      }
      tmp.push(item[key]);
    }
    body.push(tmp);
  });
  return { head: head, body: body, foot: foot };
}

function serialiseCellValue(value) {
  if (typeof value === 'string') {
    const formattedValue = value.replace(/"/g, '""');
    return formattedValue.includes(',') ? `"${formattedValue}"` : formattedValue;
  }
  return value;
}

function downloadFile(fileName, data) {
  const downloadLink = document.createElement('a');
  downloadLink.download = fileName;
  const url = URL.createObjectURL(data);
  downloadLink.href = url;
  downloadLink.click();
  URL.revokeObjectURL(url);
}
