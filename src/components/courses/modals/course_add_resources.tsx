import React, { useEffect, useMemo, useState } from 'react';
import {
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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { video, upload, fileUpload } from '../../../icons';
import Dropzone from '../../../utils/dropzone';

const AddResourcesModal = ({
  isOpen,
  onClose,
  setShowSelected,
  showSelected,
}: {
  isOpen: boolean;
  onClose: any;
  theme?: any;
  setShowSelected: any;
  showSelected: boolean;
}) => {
  const [activeResource, setActiveResource] = useState(null);
  const [showError, setShowError] = useState(false);

  const {
    register: registerVideo,
    handleSubmit: handleSubmitVideo,
    reset: resetVideo,
    setValue: setValueVideo,
  } = useForm({
    defaultValues: {
      video: '',
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

  const onSubmitVideo = () => {
    resetVideo();
  };

  const onFileAccepted = file => {
    setValueFile('file', file);
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

    if (activeResource == 'assignment') {
      return (
        <Stack spacing={6}>
          <Heading flex={1} fontSize={{ base: 16, lg: 18 }} fontWeight={700} textAlign="start" color={'purple.500'}>
            Задание
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
                type="text"
                placeholder="https://sample.edu/link?meeting"
                bg={'grey.100'}
                {...registerVideo('video')}
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
        onClick={() => (activeResource ? setShowSelected(true) : setShowError(true))}>
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
              <Heading fontSize={{ base: 16, lg: 18 }} fontWeight={500} textAlign="start" color={'grey.500'}>
                Можете да добавите линк към видеозапис на изминал урок, файлови ресурси или ново задание за своите
                ученици.
              </Heading>
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
