import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Heading,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { video, upload, fileUpload } from '../../../icons';
import Dropzone from '../../../utils/dropzone';
import { getResponseMessage } from '../../../helpers/response.util';
import { axiosInstance } from '../../../axios';

const AddResourcesModal = ({
  isOpen,
  onClose,
  theme,
  setShowSelected,
  showSelected,
  setOpenedTheme,
  getOpenedCourse,
}: {
  isOpen: boolean;
  onClose: any;
  theme?: any;
  setShowSelected: any;
  showSelected: boolean;
  setOpenedTheme: any;
  getOpenedCourse: any;
}) => {
  const toast = useToast();

  const [activeResource, setActiveResource] = useState(null);
  const [showError, setShowError] = useState(false);

  const {
    register: registerVideo,
    handleSubmit: handleSubmitVideo,
    reset: resetVideo,
    setValue: setValueVideo,
  } = useForm({
    defaultValues: {
      linkToRecording: '',
    },
  });

  const {
    register: registerFile,
    handleSubmit: handleSubmitFile,
    reset: resetFile,
    setValue: setValueFile,
  } = useForm({
    defaultValues: {
      file: '',
    },
  });

  const selectResource = selected => {
    setActiveResource(selected);
  };

  const onSubmitVideo: SubmitHandler<any> = async data => {
    try {
      await axiosInstance.post(`lessons/addLinkToRecording/${theme.id}`, data);
      getOpenedCourse();
      onClose();
      resetVideo();
    } catch (err) {
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const onSubmitFile: SubmitHandler<any> = async data => {
    const formData = new FormData();
    formData.append('file', data.file);

    try {
      await axiosInstance.post(`lessons/addResource/${theme.id}`, formData);
      getOpenedCourse();
      onClose();
      resetFile();
    } catch (err) {
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const onFileAccepted = file => {
    setValueFile('file', file);
  };

  const continueWithSelectedResource = () => {
    if (!activeResource) setShowError(true);

    if (activeResource == 'assignment') {
      setOpenedTheme(theme);
      onClose();
    } else {
      setShowSelected(true);
    }
  };

  const showSelectedResource = useMemo(() => {
    if (activeResource == 'video') {
      return (
        <Stack spacing={6}>
          <Heading flex={1} fontSize={{ base: 16, lg: 18 }} fontWeight={700} textAlign="start" color={'purple.500'}>
            Видеозапис
          </Heading>

          <Heading flex={1} fontSize={{ base: 16, lg: 18 }} fontWeight={500} textAlign="start" color={'grey.500'}>
            Моля добавете линк към мястото, на което е качен записът. Това може да бъде Google Drive, iCloud, OneDrive
            или друга платфома, която използвате.
          </Heading>
        </Stack>
      );
    }

    if (activeResource == 'file') {
      return (
        <Stack spacing={6}>
          <Heading flex={1} fontSize={{ base: 16, lg: 18 }} fontWeight={700} textAlign="start" color={'purple.500'}>
            Файл
          </Heading>

          <Stack spacing={1}>
            <Heading flex={1} fontSize={{ base: 16, lg: 18 }} fontWeight={500} textAlign="start" color={'grey.500'}>
              Добавете файлов ресурс по Ваш избор. В случай, че желаете да качите няколко файла наведнъж, групирайте ги
              в архив. Допустими файлови формати:
            </Heading>
            <Heading flex={1} fontSize={{ base: 16, lg: 18 }} fontWeight={500} textAlign="start" color={'purple.500'}>
              .jpg .jpeg .ppt .pptx .doc .docx .pdf .zip .7-zip .rar
            </Heading>
          </Stack>

          <Dropzone onFileAccepted={onFileAccepted} />
        </Stack>
      );
    }
  }, [activeResource]);

  const footerToShow = useMemo(() => {
    if (showSelected) {
      if (activeResource == 'video') {
        return (
          <form onSubmit={handleSubmitVideo(onSubmitVideo)}>
            <Stack spacing={6} direction={'row'}>
              <Input
                flex={1}
                pr="4.5rem"
                type="url"
                placeholder="https://sample.edu/link?meeting"
                bg={'grey.100'}
                {...registerVideo('linkToRecording')}
              />

              <Button
                type={'submit'}
                size={{ base: 'sm', md: 'md', '2xl': 'md' }}
                w={{ base: 'full', lg: '12vw' }}
                fontSize={'xl'}
                fontWeight={700}
                bg={'purple.500'}
                color={'white'}
                _hover={{ opacity: '0.9' }}>
                Запази
              </Button>
            </Stack>
          </form>
        );
      }

      if (activeResource == 'file') {
        return (
          <form onSubmit={handleSubmitFile(onSubmitFile)}>
            <Button
              type={'submit'}
              size={{ base: 'sm', md: 'md', '2xl': 'md' }}
              w={{ base: 'full', lg: '12vw' }}
              fontSize={'xl'}
              fontWeight={700}
              bg={'purple.500'}
              color={'white'}
              _hover={{ opacity: '0.9' }}>
              Качване
            </Button>
          </form>
        );
      }

      if (activeResource == 'assignment') {
        return <> </>;
      }
    }

    return (
      <Button
        size={{ base: 'sm', md: 'md', '2xl': 'md' }}
        w={{ base: 'full', lg: '12vw' }}
        fontSize={'xl'}
        fontWeight={700}
        bg={'purple.500'}
        color={'white'}
        _hover={{ opacity: '0.9' }}
        onClick={continueWithSelectedResource}>
        Напред
      </Button>
    );
  }, [activeResource, showSelected]);

  useEffect(() => {
    setShowSelected(false);
    setActiveResource(null);
    setShowError(false);
  }, [isOpen]);

  return (
    <Modal size={'4xl'} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={8}>
        <ModalHeader>
          <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'}>
            Добавяне на ресурс
          </Heading>
        </ModalHeader>
        <ModalCloseButton color={'purple.500'} />
        <ModalBody pb={6} minH={'300px'}>
          {showSelected && activeResource ? (
            showSelectedResource
          ) : (
            <Stack align={'center'} h={'full'} spacing={20}>
              <Stack spacing={6}>
                <Heading fontSize={{ base: 16, lg: 18 }} fontWeight={500} textAlign="start" color={'grey.500'}>
                  Можете да добавите линк към видеозапис на изминал урок, файлови ресурси или ново задание за своите
                  ученици.
                </Heading>

                <Alert status="info" rounded={'md'} bg={'purple.200'}>
                  <AlertIcon color={'purple.500'} />
                  Ако вече съществува ресурс от съответния тип, новият ще замести стария.
                </Alert>
              </Stack>

              <Stack flex={1} direction={'row'} align={'center'} justify={'center'} w={'full'} h={'full'} spacing={24}>
                <Stack
                  as={Button}
                  direction={'column'}
                  align={'center'}
                  w={'100px'}
                  h={'100px'}
                  color={activeResource == 'video' ? 'purple.500' : 'grey.500'}
                  border={activeResource == 'video' ? '2px solid' : 'none'}
                  borderColor={activeResource == 'video' ? 'purple.500' : 'none'}
                  bg={activeResource == 'video' ? 'purple.200' : 'purple.100'}
                  onClick={() => selectResource('video')}>
                  <Img w={6} h={6} src={video}></Img>
                  <Text fontSize={14}>Запис</Text>
                </Stack>

                <Stack
                  as={Button}
                  direction={'column'}
                  align={'center'}
                  w={'100px'}
                  h={'100px'}
                  color={activeResource == 'file' ? 'purple.500' : 'grey.500'}
                  border={activeResource == 'file' ? '2px solid' : 'none'}
                  borderColor={activeResource == 'file' ? 'purple.500' : 'none'}
                  bg={activeResource == 'file' ? 'purple.200' : 'purple.100'}
                  onClick={() => selectResource('file')}>
                  <Img w={6} h={6} src={fileUpload}></Img>
                  <Text fontSize={14}>Файл</Text>
                </Stack>

                <Stack
                  as={Button}
                  direction={'column'}
                  align={'center'}
                  w={'100px'}
                  h={'100px'}
                  rounded={'md'}
                  color={activeResource == 'assignment' ? 'purple.500' : 'grey.500'}
                  border={activeResource == 'assignment' ? '2px solid' : 'none'}
                  borderColor={activeResource == 'assignment' ? 'purple.500' : 'none'}
                  bg={activeResource == 'assignment' ? 'purple.200' : 'purple.100'}
                  onClick={() => selectResource('assignment')}>
                  <Img w={6} h={6} src={upload}></Img>
                  <Text fontSize={14}>Задание</Text>
                </Stack>
              </Stack>

              {showError && (
                <Heading flex={1} fontSize={{ base: 14 }} fontWeight={500} textAlign="center" color={'red'}>
                  Изберете задание
                </Heading>
              )}
            </Stack>
          )}
        </ModalBody>

        <ModalFooter>{footerToShow}</ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddResourcesModal;
