import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Center, Img, Stack, Text, Image } from '@chakra-ui/react';
import { fileUpload } from '../icons';

export default function PreviewDropzone({ onFileAccepted }: { onFileAccepted: any }) {
  const [file, setFile] = useState(null);

  const onDrop = useCallback(
    acceptedFiles => {
      onFileAccepted(acceptedFiles[0]);
      setFile(
        Object.assign(acceptedFiles[0], {
          preview: URL.createObjectURL(acceptedFiles[0]),
        }),
      );
    },
    [onFileAccepted],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
  });

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => URL.revokeObjectURL(file?.preview);
  }, []);

  return (
    <Center
      cursor="pointer"
      bg={'grey.100'}
      mt={4}
      minH={'150px'}
      transition="background-color 0.2s ease"
      rounded={'md'}
      maxW={'250px'}
      {...getRootProps()}>
      <input {...getInputProps()} />
      <Stack direction={'column'} align={'center'} spacing={2} w={'full'}>
        {file ? (
          <Image
            w={'full'}
            h={'full'}
            maxH={'full'}
            objectFit="cover"
            src={file?.preview}
            alt="Teacher picture"
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
        ) : (
          <>
            {' '}
            <Img src={fileUpload} alt={'upload file'} w={7} h={7} />
            <Text fontWeight={600} fontSize={16} color={'purple.500'}>
              Качете изображение
            </Text>{' '}
          </>
        )}
      </Stack>

      {/*<aside style={thumbsContainer}>{thumbs}</aside>*/}
    </Center>
  );
}
