export const downloadFile = response => {
  // Extract filename from response headers
  console.log(response)
  const contentDisposition = response.headers['content-disposition'];
  const fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloaded_file';

  // Create a URL for the Blob
  const fileUrl = URL.createObjectURL(response.data);

  // Create a link element
  const link = document.createElement('a');
  link.href = fileUrl;
  link.setAttribute('download', fileName.trim());

  // Append the link to the body
  document.body.appendChild(link);

  // Trigger the click event on the link
  link.click();

  // Clean up
  URL.revokeObjectURL(fileUrl);
  document.body.removeChild(link);
};
