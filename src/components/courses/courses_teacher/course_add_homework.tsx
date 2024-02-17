import React, { useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { format } from 'date-fns';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Img,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';

import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

import { getResponseMessage } from '../../../helpers/response.util';
import AddHomeworkFileModal from '../modals/homework_add_file';
import { axiosInstance } from '../../../axios';
import { fileDownload, fileUpload, trash } from '../../../icons';

const defultHomeworkValues = {
  title: '',
  description: '',
  date: '',
  time: '',
  files: [],
  altTime: '',
};

const CourseAddHomework = ({
  setOpenedTheme,
  openedTheme,
  isEditHomework,
  setIsEditHomework,
  getOpenedCourse,
}: {
  setOpenedTheme?: any;
  openedTheme?: any;
  isEditHomework?: any;
  setIsEditHomework?: any;
  getOpenedCourse?: any;
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [homeworkData, setHomeworkData] = useState(defultHomeworkValues);
  const [fileToShow, setFileToShow] = useState(null);

  addLocale('bg', {
    firstDayOfWeek: 1,
    dayNames: ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота', 'Неделя'],
    dayNamesMin: ['П', 'В', 'С', 'Ч', 'П', 'С', 'Н'],
    monthNames: [
      'Януари',
      'Февруари',
      'Март',
      'Април',
      'Май',
      'Юни',
      'Юли',
      'Август',
      'Септември',
      'Октомвври',
      'Ноември',
      'Декември',
    ],
    monthNamesShort: ['Ян', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'],
    today: 'Днес',
    clear: 'Календар',
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: defultHomeworkValues,
    values: homeworkData,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'files',
  });

  const acceptedFileItems = fields.map((el, index) => {
    const sizeInKb = el.file?.size / 1024;

    return (
      <Stack key={index} direction={'row'} spacing={2}>
        <Stack direction={'row'} align={'center'} spacing={2}>
          <Img src={fileDownload} alt={'uploaded file'} w={5} h={5} />
          <Text fontWeight={600} color={'grey.600'}>
            {el.file?.path}
          </Text>
        </Stack>

        {sizeInKb > 1024 ? (
          <Text fontWeight={600} color={'grey.400'}>
            ({(sizeInKb / 1024).toFixed(2)} MB)
          </Text>
        ) : (
          <Text fontWeight={600} color={'grey.400'}>
            ({sizeInKb.toFixed(2)} KB)
          </Text>
        )}

        <Box
          as={IconButton}
          aria-label={'delete theme'}
          size="xs"
          bg={'none'}
          _hover={{ bg: 'none' }}
          icon={<Img src={trash} w={5} onClick={() => remove(index)} />}
        />
      </Stack>
    );
  });

  const onSubmit: SubmitHandler<any> = async data => {
    try {
      if (!fileToShow && data?.files[0]?.file) {
        const formData = new FormData();
        formData.append('requestFiles', data?.files[0]?.file);

        const res = await axiosInstance.post(`/lessons/uploadAssignmentFiles`, formData);

        data.fileNames = res.data;
      } else {
        data.fileNames = fileToShow;
      }

      isEditHomework
        ? await axiosInstance.post(`/lessons/editAssignment/${openedTheme?.assignmentId}`, data)
        : await axiosInstance.post(`/lessons/addAssignment/${openedTheme?.id}`, data);

      toast({
        title: 'Успешно създаване на домашно',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      getOpenedCourse();
      setIsEditHomework(false);
      setDate('');
      setTime('');
      setOpenedTheme(null);
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

  const getHomeworkData = async () => {
    try {
      const res = await axiosInstance.get(`/lessons/getAssignment/${openedTheme?.assignmentId}`);
      setHomeworkData(res.data);
      setFileToShow(res.data?.fileNames);
      const date = new Date(res.data?.date);
      setDate(date);
      setTime(res.data?.altTime);
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

  const checkKeyDown = e => {
    if (e.key === 'Enter') e.preventDefault();
  };

  useEffect(() => {
    register('date', { required: 'Полето е задължително' });
    register('time', { required: 'Полето е задължително' });
  }, [register]);

  useEffect(() => {
    isEditHomework && getHomeworkData();
  }, [isEditHomework]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
        <Stack spacing={10}>
          <Heading flex={1} textAlign={'left'} fontSize={{ base: 20, lg: 26, xl: 28 }} color={'grey.600'}>
            {isEditHomework ? 'Редактиране на задание' : 'Добавяне на задание'}
          </Heading>

          <FormControl isInvalid={!!errors.title}>
            <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
              Заглавие{' '}
              <Text as={'span'} color={'red'}>
                *
              </Text>
            </FormLabel>
            <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
              <Input
                pr="4.5rem"
                maxLength={100}
                resize={'none'}
                placeholder={'Въведете тук'}
                {...register('title', { required: 'Полето е задължително' })}
              />
              <InputRightElement width="4.5rem" color={'grey.500'}>
                {watch('title')?.length || 0}/100
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
          </FormControl>

          <Stack spacing={6}>
            <FormControl isInvalid={!!errors?.description}>
              <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                Описание{' '}
                <Text as={'span'} color={'red'}>
                  *
                </Text>
              </FormLabel>
              <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                <Textarea
                  pr="4.5rem"
                  maxLength={1200}
                  resize={'none'}
                  rows={4}
                  {...register('description', { required: 'Полето е задължително' })}
                />
                <InputRightElement width="4.5rem" color={'grey.500'}>
                  {watch('description')?.length || 0}/1200
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
            </FormControl>

            <Text fontSize={{ base: 14, lg: 16 }} fontWeight={400} color={'grey.400'}>
              Тук можете да опишете задание желаете да възложите на учениците си.
            </Text>
          </Stack>

          <Stack spacing={8} maxW={{ base: '70%', xl: '50%' }}>
            <Heading flex={1} textAlign={'left'} fontSize={{ base: 16, lg: 18 }} color={'grey.600'}>
              Краен срок
            </Heading>

            <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 4, xl: 0 }}>
              <FormControl isInvalid={!!errors.date}>
                <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                  Дата{' '}
                  <Text as={'span'} color={'red'}>
                    *
                  </Text>
                </FormLabel>

                <Calendar
                  value={date}
                  onChange={e => {
                    setValue('date', format(e.value, 'yyyy-MM-dd'));
                    setDate(e.value);
                  }}
                  placeholder={'Изберете дата'}
                  minDate={new Date()}
                  dateFormat="dd M yy"
                  locale={'bg'}
                  showIcon
                />

                <FormErrorMessage>{errors?.date?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.time}>
                <FormLabel fontWeight={700} color={'grey.600'} pb={2}>
                  Час{' '}
                  <Text as={'span'} color={'red'}>
                    *
                  </Text>
                </FormLabel>

                <Calendar
                  value={time}
                  onChange={e => {
                    if (e.value) {
                      setTime(e.value);
                      setValue('time', format(e.value, 'HH:mm'));
                      setValue('altTime', e.value);
                    }
                  }}
                  placeholder={'Изберете час'}
                  timeOnly
                />

                <FormErrorMessage>{errors?.date?.message}</FormErrorMessage>
              </FormControl>
            </Stack>
          </Stack>

          <Stack spacing={8} maxW={'50%'}>
            <Stack spacing={4}>
              <Heading flex={1} textAlign={'left'} fontSize={{ base: 16, lg: 18 }} color={'grey.600'}>
                Качване на файл
              </Heading>

              <Text fontSize={{ base: 14, lg: 16 }} fontWeight={400} color={'grey.400'}>
                В случай, че желаете да качите няколко файла наведнъж, групирайте ги в архив
              </Text>
            </Stack>

            {isEditHomework && fileToShow ? (
              <Stack direction={'row'} spacing={2}>
                <Stack direction={'row'} align={'center'} spacing={2}>
                  <Img src={fileDownload} alt={'uploaded file'} w={5} h={5} />
                  <Text fontWeight={600} color={'grey.600'}>
                    {fileToShow}
                  </Text>
                </Stack>

                <Box
                  as={IconButton}
                  aria-label={'delete theme'}
                  size="xs"
                  bg={'none'}
                  _hover={{ bg: 'none' }}
                  icon={<Img src={trash} w={5} onClick={() => setFileToShow(null)} />}
                />
              </Stack>
            ) : (
              acceptedFileItems
            )}

            <Button
              isDisabled={fields.length === 1 || !!fileToShow}
              color={'purple.500'}
              bg={'transparent'}
              _hover={{ bg: 'transparent' }}
              w={'fit-content'}
              p={0}
              onClick={onOpen}>
              <Stack direction={'row'} align={'center'} spacing={4}>
                <Img src={fileUpload} alt={'upload file'} h={5} w={5} />
                <Heading fontSize={{ base: 16, lg: 18 }} color={'purple.500'}>
                  Качване на файл
                </Heading>
              </Stack>
            </Button>
          </Stack>

          <Stack w={'full'} align={'center'} justify={'space-between'} direction={'row'} mt={8}>
            <Button
              type={'submit'}
              size={{ base: 'md' }}
              w={'25vw'}
              py={0}
              bg={'purple.500'}
              color={'white'}
              fontSize={16}
              fontWeight={700}
              _hover={{ opacity: '0.9' }}
              _focus={{ outline: 'none' }}
              _active={{ bg: 'purple.500' }}>
              Качване
            </Button>

            <Button
              size={{ base: 'md' }}
              w={'fit-content'}
              py={0}
              bg={'transparent'}
              color={'purple.500'}
              fontSize={16}
              fontWeight={700}
              _hover={{ opacity: '0.9' }}
              _focus={{ outline: 'none' }}
              _active={{ bg: 'purple.500' }}
              textAlign={'right'}
              onClick={() => {
                reset();
                setOpenedTheme(null);
                setIsEditHomework(false);
              }}>
              Отказ
            </Button>
          </Stack>
        </Stack>
      </form>
      <AddHomeworkFileModal isOpen={isOpen} onClose={onClose} append={append} />
    </>
  );
};

export default CourseAddHomework;
