export const downloadFile = file => {
  // Create a Blob from the response
  const fileBlob = new Blob([file]);

  // Create a URL for the Blob
  const fileUrl = URL.createObjectURL(fileBlob);

  // Create a link element
  const link = document.createElement('a');
  link.href = fileUrl;
  link.setAttribute('download', 'filename.ext'); // set the file name

  // Append the link to the body
  document.body.appendChild(link);

  // Trigger the click event on the link
  link.click();

  // Clean up
  URL.revokeObjectURL(fileUrl);
  document.body.removeChild(link);
};
