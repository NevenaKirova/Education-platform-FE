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
import { fileDownload } from '../../../icons';
import Dropzone from '../../../utils/dropzone';
import { getResponseMessage } from '../../../helpers/response.util';
import { axiosInstance } from '../../../axios';
import { capitalizeMonth } from '../../../helpers/capitalizeMonth.util';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

import { downloadFile } from '../../../helpers/downloadFile';

const AddStudentHomeworkModal = ({
  isOpen,
  onClose,
  homework,
  assignmentId,
}: {
  isOpen: boolean;
  onClose: any;
  homework: any;
  assignmentId: number;
}) => {
  const toast = useToast();

  const { handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      file: '',
    },
  });

  const downloadResource = async () => {
    try {
      const res = await axiosInstance.get(`/lessons/getAssignmentFile/${homework?.fileNames}&&${assignmentId}`, {
        responseType: 'blob',
      });

      downloadFile(res);
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

  const onSubmit: SubmitHandler<any> = async data => {
    const formData = new FormData();
    formData.append('requestFiles', data.file);

    try {
      await axiosInstance.post(`lessons/uploadSolutionFiles/${assignmentId}`, formData);
      toast({
        title: 'Успешно добавяне на домашно!',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
      onClose();
      reset();
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
    setValue('file', file);
  };

  return (
    <Modal size={'4xl'} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={8}>
        <ModalHeader>
          <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'}>
            Задача за домашна работа
          </Heading>
        </ModalHeader>
        <ModalCloseButton color={'purple.500'} />
        <ModalBody pb={6} minH={'300px'}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={8}>
              <Stack spacing={6}>
                <Stack spacing={2}>
                  <Stack direction={'row'} spacing={2} fontWeight={600}>
                    <Text fontSize={16}>Краен срок:</Text>
                    <Text fontSize={16} color={'grey.400'}>
                      {capitalizeMonth(format(new Date(homework?.date), 'dd LLL yyyy', { locale: bg }))}{' '}
                      {homework?.time}
                    </Text>
                  </Stack>

                  <Stack direction={'row'} spacing={2} fontSize={16} fontWeight={600}>
                    <Text>Състояние:</Text>

                    {homework?.status === 'Not submitted' ? (
                      <Text color={'red'}>Непредаден </Text>
                    ) : (
                      <Text color={'green.100'}>Предаден </Text>
                    )}
                  </Stack>
                </Stack>

                <Heading flex={1} fontSize={{ base: 16, lg: 18 }} fontWeight={500} textAlign="start" color={'grey.500'}>
                  {homework?.description}
                </Heading>

                <Stack as={Button} onClick={downloadResource} direction={'row'} align={'center'} spacing={2}>
                  <Img src={fileDownload} alt={'uploaded file'} w={5} h={5} />
                  <Text fontWeight={600} color={'grey.600'}>
                    {homework.fileNames}
                  </Text>
                </Stack>

                <Heading flex={1} fontSize={{ base: 16, lg: 20 }} textAlign="start" color={'grey.600'} fontWeight={700}>
                  Моите файлове
                </Heading>

                <Stack spacing={1}>
                  <Heading
                    flex={1}
                    fontSize={{ base: 16, lg: 18 }}
                    fontWeight={500}
                    textAlign="start"
                    color={'grey.500'}>
                    Добавете файлов ресурс по Ваш избор. В случай, че желаете да качите няколко файла наведнъж,
                    групирайте ги в архив. Допустими файлови формати:
                  </Heading>
                  <Heading
                    flex={1}
                    fontSize={{ base: 16, lg: 18 }}
                    fontWeight={500}
                    textAlign="start"
                    color={'purple.500'}>
                    .jpg .jpeg .ppt .pptx .doc .docx .pdf .zip .7-zip .rar
                  </Heading>
                </Stack>

                <Dropzone onFileAccepted={onFileAccepted} />
              </Stack>

              <Button
                type={'submit'}
                size={{ base: 'sm', md: 'md', '2xl': 'md' }}
                w={{ base: 'full', lg: '12vw' }}
                fontSize={'xl'}
                fontWeight={700}
                bg={'purple.500'}
                color={'white'}
                alignSelf={'end'}
                _hover={{ opacity: '0.9' }}>
                Предаване
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddStudentHomeworkModal;
