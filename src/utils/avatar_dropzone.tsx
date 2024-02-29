import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Center, Img, Stack, Text, Image, Box } from '@chakra-ui/react';
import { fileUpload } from '../icons';
import { account } from '../images';

export default function AvatarDropzone({ onFileAccepted }: { onFileAccepted: any }) {
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
    <Stack
      cursor="pointer"
      bg={'transparent'}
      minH={'150px'}
      transition="background-color 0.2s ease"
      rounded={'md'}
      maxW={'250px'}
      {...getRootProps()}>
      <input {...getInputProps()} />
      <Stack
        direction="row"
        as={'button'}
        align={'center'}
        spacing={4}
        onClick={ev => {
          ev.preventDefault();
        }}>
        <Box
          role="group"
          bg={'purple.500'}
          borderRadius="full"
          _hover={{
            transition: 'transform .2s',
            transform: 'scale(1.05)',
          }}>
          <Image borderRadius="full" boxSize={20} src={account} alt={'add picture'} />
        </Box>

        <Text textAlign={'left'} fontSize={{ base: 16 }} fontWeight={700} color={'purple.500'}>
          Добави снимка
        </Text>
      </Stack>
    </Stack>
  );
}
