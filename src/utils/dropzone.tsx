import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Center, Stack, Img, Text } from '@chakra-ui/react';
import { fileDownload, fileUploadGrey } from '../icons';

export default function Dropzone({ onFileAccepted }: { onFileAccepted: any }) {
  const onDrop = useCallback(
    acceptedFiles => {
      onFileAccepted(acceptedFiles[0]);
    },
    [onFileAccepted],
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
  });

  const acceptedFileItems = acceptedFiles.map(file => {
    const sizeInKb = file?.size / 1024;

    return (
      <Stack key={file?.path} direction={'row'} spacing={2}>
        <Text fontWeight={600} color={'grey.600'}>
          {file?.path}
        </Text>
        {sizeInKb > 1024 ? (
          <Text fontWeight={600} color={'grey.400'}>
            ({(sizeInKb / 1024).toFixed(2)} MB)
          </Text>
        ) : (
          <Text fontWeight={600} color={'grey.400'}>
            ({sizeInKb.toFixed(2)} KB)
          </Text>
        )}
      </Stack>
    );
  });

  return (
    <>
      {acceptedFileItems.length ? (
        <Stack direction={'row'} align={'center'} spacing={2}>
          <Img src={fileDownload} alt={'uploaded file'} w={5} h={5} />
          <Text as={'span'}>{acceptedFileItems}</Text>
        </Stack>
      ) : (
        ''
      )}

      <Center
        p={10}
        cursor="pointer"
        bg={'grey.100'}
        mt={4}
        minH={'150px'}
        transition="background-color 0.2s ease"
        rounded={'md'}
        {...getRootProps()}>
        <input {...getInputProps()} />
        <Stack direction={'column'} align={'center'} spacing={2}>
          <Img src={fileUploadGrey} alt={'upload file'} w={7} h={7} />
          <Text fontWeight={600} fontSize={16} color={'grey.300'}>
            Качване на файл
          </Text>
        </Stack>
      </Center>
    </>
  );
}
