import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Heading,
  IconButton,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import { axiosInstance } from '../../../axios';
import { downloadFile } from '../../../helpers/downloadFile';
import { getResponseMessage } from '../../../helpers/response.util';
import { fileDownload, trash } from '../../../icons';
import { capitalizeMonth } from '../../../helpers/capitalizeMonth.util';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

import { SubmitHandler, useForm } from 'react-hook-form';
const SubmissionsAddCommentModal = ({
  isOpen,
  onClose,
  solution,
  course,
}: {
  isOpen: boolean;
  onClose: any;
  solution: number;
  course: any;
}) => {
  const toast = useToast();

  const [comments, setComments] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      message: '',
    },
  });

  const getComments = async () => {
    try {
      const res = await axiosInstance.get(`/lessons/getComments/${solution?.solutionId}`);
      setComments(res.data);
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

  const deleteComment = async commentId => {
    try {
      await axiosInstance.post(`/lessons/deleteComment/${commentId}`);
      getComments();
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

  const downloadResource = async el => {
    try {
      const res = await axiosInstance.get(`/lessons/getSolutionFile/${el?.solutionFileNames}&&${el?.solutionId}`, {
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
    try {
      await axiosInstance.post(`/lessons/leaveComment`, {
        message: data.message,
        lessonId: solution.solutionId,
      });

      getComments();

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

  useEffect(() => {
    getComments();
  }, []);

  return (
    <Modal size={'4xl'} closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent p={8}>
        <ModalCloseButton color={'purple.500'} />
        <ModalBody pb={6} minH={'300px'}>
          <Stack spacing={12}>
            <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
              {course?.title}
            </Heading>

            <Stack spacing={6}>
              <Stack spacing={2}>
                <Stack w={'full'} justify={'space-between'} direction={'row'}>
                  <Stack flex={1} direction={'row'} spacing={2} fontWeight={600} align={'center'}>
                    <Avatar size={{ base: 'xs', md: 'sm' }} src={solution?.image} />

                    <Text>{solution?.studentName}</Text>
                  </Stack>

                  <Text fontSize={16} color={'grey.400'}>
                    {capitalizeMonth(format(new Date(solution?.date), 'dd LLL yyyy', { locale: bg }))} {solution?.time}
                  </Text>
                </Stack>
              </Stack>

              <Stack
                as={Button}
                onClick={downloadResource}
                direction={'row'}
                align={'center'}
                justify={'start'}
                spacing={2}>
                <Img src={fileDownload} alt={'uploaded file'} w={5} h={5} />
                <Text fontWeight={600} color={'grey.600'}>
                  {solution.solutionFileNames}
                </Text>
              </Stack>

              <Heading flex={1} fontSize={{ base: 16, lg: 18 }} textAlign="start" color={'grey.600'} fontWeight={700}>
                Коментари ({comments?.length})
              </Heading>

              <Stack
                spacing={1}
                maxH={'28vh'}
                overflow={'auto'}
                css={{
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#5431D6',
                    borderRadius: '24px',
                  },
                }}>
                {comments?.map((el, index) => (
                  <Stack key={index} color={'grey.500'} pr={6}>
                    <Stack w={'full'} justify={'space-between'} direction={'row'}>
                      <Stack flex={1} direction={'row'} spacing={4} fontWeight={600} align={'center'}>
                        <Avatar size={{ base: 'xs', md: 'sm' }} src={el?.image} />

                        <Text>{el?.teacherName}</Text>

                        <Text fontSize={16} color={'grey.400'}>
                          {capitalizeMonth(format(new Date(el?.date), 'dd LLL yyyy', { locale: bg }))} {el?.time}
                        </Text>
                      </Stack>

                      <Box
                        as={IconButton}
                        aria-label={'delete theme'}
                        size="xs"
                        bg={'none'}
                        _hover={{ bg: 'none' }}
                        onClick={() => deleteComment(el.id)}
                        icon={<Img src={trash} w={5} />}
                      />
                    </Stack>

                    <Text ml={12}>{el?.comment}</Text>
                  </Stack>
                ))}
              </Stack>

              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={6}>
                  <Heading
                    flex={1}
                    fontSize={{ base: 16, lg: 18 }}
                    textAlign="start"
                    color={'grey.600'}
                    fontWeight={700}>
                    Добавяне на коментар
                  </Heading>
                  <Textarea
                    bg={'grey.100'}
                    pr="4.5rem"
                    maxLength={1200}
                    resize={'none'}
                    rows={4}
                    {...register('message', { required: 'Полето е задължително' })}
                  />
                  <Button
                    type={'submit'}
                    size={{ base: 'sm', md: 'md', '2xl': 'md' }}
                    w={{ base: 'full', lg: '16vw' }}
                    fontSize={'xl'}
                    fontWeight={700}
                    bg={'purple.500'}
                    color={'white'}
                    _hover={{ opacity: '0.9' }}>
                    Добави коментар
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SubmissionsAddCommentModal;
