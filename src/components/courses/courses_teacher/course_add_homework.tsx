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
import { format } from 'date-fns';
import React, { useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { addLocale } from 'primereact/api';
import { getResponseMessage } from '../../../helpers/response.util';

import { fileDownload, fileUpload, trash } from '../../../icons';
import AddHomeworkFileModal from '../modals/homework_add_file';

export type DatesForm = {
  startDate: Date | string;
  courseDaysNumbers: number[] | null;
  courseHours: string;
  weekLength: number | null;
  studentsUpperBound: number | null;
  files: any[];
};
const CourseAddHomework = ({ setOpenedTheme }: { setOpenedTheme?: any }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [files, setFiles] = useState([]);

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
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      files: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'files',
  });

  const onFileAccepted = files => {
    setValue('files', files);
  };

  const handleDeleteFile = index => {
    console.log(index);
    const newFiles = files;
    newFiles.splice(index, 1);
    console.log(newFiles);
    setFiles(newFiles);
  };

  const acceptedFileItems = fields.map((file, index) => {
    const sizeInKb = file?.size / 1024;

    return (
      <Stack key={file?.path} direction={'row'} spacing={2}>
        <Stack direction={'row'} align={'center'} spacing={2}>
          <Img src={fileDownload} alt={'uploaded file'} w={5} h={5} />
          <Text fontWeight={600} color={'grey.600'}>
            {file?.path}
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
      // const res: any[] = await axiosInstance.post(`/lessons/addDate/${courseId}`, { data });
      //
      // setDates(res.data);
    } catch (err) {
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }

    reset();
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={10}>
          <Heading flex={1} textAlign={'left'} fontSize={{ base: 20, lg: 26, xl: 28 }} color={'grey.600'}>
            Добавяне на задание
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

          <Stack spacing={8} maxW={'50%'}>
            <Heading flex={1} textAlign={'left'} fontSize={{ base: 16, lg: 18 }} color={'grey.600'}>
              Краен срок
            </Heading>

            <Stack direction={{ base: 'column', md: 'row' }} spacing={{ base: 4, lg: 0 }}>
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
                Качете до 4 файла
              </Text>
            </Stack>

            {acceptedFileItems}

            <Button
              isDisabled={files.length === 4}
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
              }}>
              Отказ
            </Button>
          </Stack>
        </Stack>
      </form>
      <AddHomeworkFileModal isOpen={isOpen} onClose={onClose} files={files} setFiles={setFiles} append={append} />
    </>
  );
};

export default CourseAddHomework;
