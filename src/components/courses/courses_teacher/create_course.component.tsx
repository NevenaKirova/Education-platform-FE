import React, { useEffect, useState, useRef } from 'react';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { format, add as addDate } from 'date-fns';
import { bg } from 'date-fns/locale';
import {
  Stack,
  InputGroup,
  InputRightElement,
  Input,
  Text,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Textarea,
  Img,
  IconButton,
  Button,
  RadioGroup,
  Radio,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberInput,
  NumberIncrementStepper,
  FormErrorMessage,
  FormControl,
  Box,
  useToast,
} from '@chakra-ui/react';

import { getResponseMessage } from '../../../helpers/response.util';
import { capitalizeMonth } from '../../../helpers/capitalizeMonth.util';
import PageLoader from '../../../utils/loader.component';
import { axiosInstance } from '../../../axios';
import { useAppDispatch } from '../../../store';
import {
  getCoursesActive,
  getCoursesAll,
  getCoursesDraft,
  getCoursesInactive,
  getUpcomingCourses,
} from '../../../store/features/teacher/teacherCourses/teacherCourses.async';
import CourseAddDate, { DatesForm } from './course_add_date';

import { add, edit, trash, tick } from '../../../icons';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

type Inputs = {
  title: string | null;
  grade: string | null;
  subject: string | null;
  studentsUpperBound: number | null;
  price: number | string | null;
  description: string | null;
  themas: any[];
  length: string;
  courseTerminRequests: DatesForm[];
};

export const daysArr = [
  { name: 'Понеделник', short: 'Пон', value: 1 },
  { name: 'Вторник', short: 'Вт', value: 2 },
  { name: 'Сряда', short: 'Ср', value: 3 },
  { name: 'Четвъртък', short: 'Чет', value: 4 },
  { name: 'Петък', short: 'Пт', value: 5 },
  { name: 'Събота', short: 'Сб', value: 6 },
  { name: 'Неделя', short: 'Нд', value: 7 },
];

const defaultCourseValues = {
  title: null,
  grade: null,
  subject: null,
  price: 200,
  studentsUpperBound: 1,
  description: null,
  length: '60',
  courseTerminRequests: [],
  themas: [{ title: '', description: '' }, {}, {}],
};

export const addMinutesToString = (time, length) => {
  function D(J) {
    return (J < 10 ? '0' : '') + J;
  }

  const piece = time.split(':');
  const mins = piece[0] * 60 + +piece[1] + +length;

  return D(((mins % (24 * 60)) / 60) | 0) + ':' + D(mins % 60);
};
const CreateCourseComponent = ({
  setShowCreateCourse,
  showCreateCourse,
  addDateActive,
  setAddDateActive,
  setEditInfo,
  editInfo,
  courseInfo,
  courseId,
  getCourseInformation,
  getCourseDates,
}: {
  setShowCreateCourse: any;
  showCreateCourse: boolean;
  addDateActive: boolean;
  setAddDateActive: any;
  setEditInfo?: any;
  editInfo?: any;
  courseInfo?: any;
  courseId?: number;
  getCourseInformation?: any;
  getCourseDates?: any;
}) => {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const themesRef = useRef(null);
  const topRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [dates, setDates] = useState<DatesForm[]>([]);
  const [grade, setSelectedGrade] = useState<any>(null);
  const [subject, setSelectedSubject] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [editableIndexes, setEditableIndexes] = useState([]);
  const [courseLength, setCourseLength] = useState<string>('60');
  const [showThemasError, setShowThemasError] = useState(false);
  const [course, setCourse] = useState(defaultCourseValues);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    trigger,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: course,
    values: course,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'themas',
  });

  const allowEdit = index => {
    const arr = [...editableIndexes];

    if (arr.indexOf(index) == -1) {
      arr.push(index);
      setEditableIndexes(arr);
    }
  };

  const completeEdit = index => {
    const arr = [...editableIndexes].filter(el => el != index);

    setEditableIndexes(arr);
  };

  const showAddDate = () => {
    setAddDateActive(true);
    setShowCreateCourse(false);
  };

  const refreshCourseForm = () => {
    reset();
    setSelectedSubject(null);
    setSelectedGrade(null);
    setEditableIndexes([]);
    setDates([]);
  };
  const handleScroll = ref => {
    ref.current?.scrollIntoView({ inline: 'start', behavior: 'smooth', block: 'center' });
  };

  const getSubjects = async () => {
    const res = await axiosInstance.get('/lessons/getSubjectGrades');
    const subjectObj = Object.assign(res.data?.subjects?.map(key => ({ name: key.replace('_', ' '), code: key })));
    const gradesObj = Object.assign(res.data?.grades?.map(key => ({ grade: key, value: key })));

    setAvailableSubjects(subjectObj);
    setAvailableGrades(gradesObj);
  };

  const submitAsDraft = async () => {
    setValue(
      'themas',
      getValues('themas').filter(el => el.title.length),
    );

    const hasTitle = await trigger('title');

    if (!hasTitle) return handleScroll(topRef);
    setIsLoading(true);
    try {
      await axiosInstance.post('/lessons/saveCourseDraft', getValues());

      setShowCreateCourse(false);
      refreshCourseForm();
      dispatch(getCoursesDraft());
      dispatch(getCoursesAll());
      setIsLoading(false);

      toast({
        title: 'Успешно запазване на чернова',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (err) {
      setValue('themas', [{ title: '', description: '' }, {}, {}]);
      setIsLoading(false);
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
    const oneHasTitle = data.themas.some(el => el.title);

    if (!data?.themas?.length || !oneHasTitle) {
      setShowThemasError(true);
      handleScroll(themesRef);
    } else {
      data.themas = data.themas.filter(el => el.title.length);
      setIsLoading(true);
      try {
        if (editInfo) {
          if (!!courseInfo && courseInfo.isDraft) {
            await axiosInstance.post(`/lessons/editCourseDraft/${courseId}`, data);
          } else {
            await axiosInstance.post(`/lessons/editCourse/${courseId}`, data);
          }
          setEditInfo(false);
          getCourseInformation(data.lessonID);
          getCourseDates(data.lessonID);
        } else {
          await axiosInstance.post('/lessons/createCourse', data);
          dispatch(getCoursesAll());
          dispatch(getCoursesActive());
          dispatch(getCoursesInactive());
          dispatch(getUpcomingCourses());
        }

        setShowCreateCourse(false);
        refreshCourseForm();

        setIsLoading(false);
        toast({
          title: editInfo ? 'Успешна редакция на курс' : 'Успешно създаване на курс',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      } catch (err) {
        setIsLoading(false);
        toast({
          title: getResponseMessage(err),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }
  };

  const removeDate = index => {
    if (dates[index] !== undefined) {
      const newDates = dates;
      newDates.splice(index, 1);
      setValue('courseTerminRequests', newDates, { shouldValidate: true });
      setDates([...newDates]);
    }
  };

  useEffect(() => {
    register('subject', {
      validate: value => {
        if (courseInfo?.draft) return true;

        if (!value) return 'Полето е задължително';
      },
    });
    register('courseTerminRequests', {
      validate: value => {
        if (courseInfo?.draft) return true;

        if (!value) return 'Добавете поне една дата на провеждане';
      },
    });
  }, [register]);

  useEffect(() => {
    getSubjects();
  }, []);

  useEffect(() => {
    if (courseInfo) {
      setCourse(courseInfo);
      setSelectedGrade(courseInfo?.grade);
      setSelectedSubject({ name: courseInfo?.subject, code: courseInfo?.subject });
      setCourseLength(courseInfo?.length?.toString());
      setDates(courseInfo?.courseTerminResponses);
    }
  }, [courseInfo, availableGrades, availableSubjects]);

  return (
    <>
      <Stack w={{ base: 'full', xl: '40vw' }} spacing={10}>
        <Stack spacing={8} w={'full'} ref={topRef}>
          {showCreateCourse && !editInfo && (
            <Breadcrumb fontSize={{ base: 14, lg: 18 }} cursor={'default'}>
              <BreadcrumbItem _hover={{ textDecoration: 'none', cursor: 'default' }} cursor={'default'}>
                <BreadcrumbLink
                  textDecoration={'none'}
                  cursor={'default'}
                  onClick={() => {
                    setShowCreateCourse(false);
                    setAddDateActive(false);
                  }}>
                  Моите курсове
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem color={'purple.500'} _hover={{ textDecoration: 'none' }} cursor={'default'}>
                <BreadcrumbLink textDecoration={'none'}>Създаване на курс</BreadcrumbLink>
              </BreadcrumbItem>

              {addDateActive && (
                <BreadcrumbItem color={'purple.500'} _hover={{ textDecoration: 'none' }} cursor={'default'}>
                  <BreadcrumbLink textDecoration={'none'}>Добавяне на дата</BreadcrumbLink>
                </BreadcrumbItem>
              )}
            </Breadcrumb>
          )}
        </Stack>

        {showCreateCourse && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={10}>
              {!editInfo && (
                <Heading flex={1} textAlign={'left'} fontSize={{ base: 20, lg: 26, xl: 28 }} color={'grey.600'}>
                  Създаване на курс
                </Heading>
              )}

              <Stack spacing={4}>
                <Text fontSize={18} fontWeight={600}>
                  Заглавие{' '}
                  <Text as={'span'} color={'red'}>
                    {courseInfo?.draft ? '' : '*'}
                  </Text>
                </Text>
                <FormControl isInvalid={!!errors.title}>
                  <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                    <Input
                      pr="4.5rem"
                      type="text"
                      placeholder="Български език за 8ми клас"
                      maxLength={100}
                      isDisabled={editInfo && !courseInfo?.draft}
                      {...register('title', {
                        validate: value => {
                          if (courseInfo?.draft) return true;

                          if (!value) return 'Полето е задължително';
                        },
                      })}
                    />
                    <InputRightElement width="4.5rem" color={'grey.500'}>
                      {watch('title')?.length || 0}/100
                    </InputRightElement>
                  </InputGroup>

                  <FormErrorMessage>{errors?.title?.message}</FormErrorMessage>
                </FormControl>

                <Text fontSize={16} fontWeight={400} color={'grey.400'}>
                  Моля въведете подходящо и описателно заглавие за вашия курс
                </Text>
              </Stack>

              <Stack spacing={4} className={editInfo && !courseInfo?.draft ? 'stack-disabled' : ''}>
                <Text fontSize={18} fontWeight={600}>
                  Предмет{' '}
                  <Text as={'span'} color={'red'}>
                    {courseInfo?.draft ? '' : '*'}
                  </Text>
                </Text>

                <FormControl isInvalid={!!errors.subject}>
                  <Dropdown
                    value={subject}
                    onChange={e => {
                      setValue('subject', e.value?.name, { shouldValidate: true });
                      setSelectedSubject(e.value);
                    }}
                    options={availableSubjects}
                    optionLabel="name"
                    placeholder="Изберете предмет"
                    disabled={editInfo && !courseInfo?.draft}
                    className={errors.subject ? 'invalid-dropdown w-full' : 'p-invalid w-full'}
                    showClear
                  />

                  <FormErrorMessage>{errors?.subject?.message}</FormErrorMessage>
                </FormControl>
                <Text fontSize={16} fontWeight={400} color={'grey.400'}>
                  Моля изберете предмет, върху който ще се фокусира Вашият курс
                </Text>
              </Stack>

              <Stack spacing={4} className={editInfo && !courseInfo?.draft ? 'stack-disabled' : ''}>
                <Text fontSize={18} fontWeight={600}>
                  Клас
                </Text>

                <Dropdown
                  value={grade}
                  onChange={e => {
                    setValue('grade', e.value, { shouldValidate: true });
                    setSelectedGrade(e.value);
                  }}
                  options={availableGrades}
                  disabled={editInfo && !courseInfo?.draft}
                  optionLabel="grade"
                  placeholder="Изберете клас"
                  className={errors.grade ? 'p-invalid' : ''}
                />

                <Text fontSize={16} fontWeight={400} color={'grey.400'}>
                  Моля изберете за кой клас е подходящ Вашият курс
                </Text>
              </Stack>

              <Stack spacing={4}>
                <Text fontSize={18} fontWeight={600}>
                  Описание на курса{' '}
                  <Text as={'span'} color={'red'}>
                    {courseInfo?.draft ? '' : '*'}
                  </Text>
                </Text>

                <FormControl isInvalid={!!errors.description}>
                  <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                    <Textarea
                      pr="4.5rem"
                      maxLength={600}
                      resize={'none'}
                      rows={4}
                      {...register('description', {
                        validate: value => {
                          if (courseInfo?.draft) return true;

                          if (!value) return 'Полето е задължително';
                        },
                      })}
                    />
                    <InputRightElement width="4.5rem" color={'grey.500'}>
                      {watch('description')?.length || 0}/600
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
                </FormControl>

                <Text fontSize={16} fontWeight={400} color={'grey.400'}>
                  Моля добавете кратко описание. Използвайте ясни изрази и ключови думи, за да могат учениците по-лесно
                  да разбират Вашия курс
                </Text>
              </Stack>

              <Stack spacing={4}>
                <Text fontSize={18} fontWeight={600}>
                  Теми в курса{' '}
                  <Text as={'span'} color={'red'}>
                    {courseInfo?.draft ? '' : '*'}
                  </Text>
                </Text>

                {fields.map((el, index: number) => (
                  <Stack key={index} direction={'column'} spacing={4} ref={themesRef}>
                    <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                      <Input
                        pr="4.5rem"
                        type="text"
                        placeholder={`Тема ${index + 1}`}
                        maxLength={100}
                        readOnly={editableIndexes.indexOf(index) == -1}
                        {...register(`themas.${index}.title`)}
                      />
                      <InputRightElement width="4.5rem" color={'grey.500'}>
                        <Stack direction={'row'} spacing={2}>
                          <IconButton
                            aria-label={'edit theme'}
                            size="xs"
                            bg={'none'}
                            _hover={{ bg: 'none' }}
                            onClick={() =>
                              editableIndexes.indexOf(index) == -1 ? allowEdit(index) : completeEdit(index)
                            }
                            icon={<Img src={editableIndexes.indexOf(index) == -1 ? edit : tick} w={5} />}
                          />

                          <Box
                            as={IconButton}
                            aria-label={'delete theme'}
                            size="xs"
                            bg={'none'}
                            _hover={{ bg: 'none' }}
                            disabled
                            icon={<Img src={trash} w={5} onClick={() => fields.length > 1 && remove(index)} />}
                          />
                        </Stack>
                      </InputRightElement>
                    </InputGroup>

                    {editableIndexes.indexOf(index) != -1 && (
                      <Textarea
                        pr="4.5rem"
                        maxLength={255}
                        resize={'none'}
                        rows={2}
                        placeholder={`Добавете описание на Тема ${index + 1}`}
                        bg={'grey.100'}
                        {...register(`themas.${index}.description`)}
                      />
                    )}
                  </Stack>
                ))}

                <FormControl isInvalid={!!showThemasError}>
                  <FormErrorMessage>Попълнете поне една тема</FormErrorMessage>
                </FormControl>

                <Button
                  size={{ base: 'md', lg: 'md' }}
                  color={'purple.500'}
                  fontSize={{ base: 16, '2xl': 20 }}
                  fontWeight={700}
                  bg={'transparent'}
                  _hover={{ bg: 'transparent' }}
                  w={'full'}
                  border={'1px dashed'}
                  mt={4}
                  borderColor={'purple.500'}
                  onClick={() => append({ title: '', description: '' })}>
                  <Stack direction={'row'} align={'center'} spacing={2}>
                    <Img src={add} alt={'add course'} />
                    <Text> Добавяне на тема</Text>
                  </Stack>
                </Button>
              </Stack>

              <Stack spacing={4}>
                <Text fontSize={18} fontWeight={600}>
                  Дължина на урок{' '}
                  <Text as={'span'} color={'red'}>
                    {courseInfo?.draft ? '' : '*'}
                  </Text>
                </Text>

                <RadioGroup
                  value={courseLength}
                  defaultValue="60"
                  onChange={e => {
                    setValue('length', e);
                    setCourseLength(e);
                  }}>
                  <Stack spacing={10} direction="row" align={'start'}>
                    <Radio
                      size="lg"
                      colorScheme="purple"
                      value={'15'}
                      isDisabled={!!dates?.length && !courseInfo?.draft}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        15 мин
                      </Text>
                    </Radio>
                    <Radio
                      size="lg"
                      colorScheme="purple"
                      value={'30'}
                      isDisabled={!!dates?.length && !courseInfo?.draft}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        30 мин
                      </Text>
                    </Radio>
                    <Radio
                      size="lg"
                      colorScheme="purple"
                      value={'45'}
                      isDisabled={!!dates?.length && !courseInfo?.draft}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        45 мин
                      </Text>
                    </Radio>
                    <Radio
                      size="lg"
                      colorScheme="purple"
                      value={'60'}
                      defaultChecked
                      isDisabled={!!dates?.length && !courseInfo?.draft}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        60 мин
                      </Text>
                    </Radio>
                    <Radio
                      size="lg"
                      colorScheme="purple"
                      value={'90'}
                      isDisabled={!!dates?.length && !courseInfo?.draft}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        90 мин
                      </Text>
                    </Radio>
                    <Radio
                      size="lg"
                      colorScheme="purple"
                      value={'120'}
                      isDisabled={!!dates?.length && !courseInfo?.draft}>
                      <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                        120 мин
                      </Text>
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Stack>

              <Stack spacing={4}>
                <Text fontSize={18} fontWeight={600}>
                  Брой ученици{' '}
                  <Text as={'span'} color={'red'}>
                    {courseInfo?.draft ? '' : '*'}
                  </Text>
                </Text>

                <NumberInput
                  defaultValue={15}
                  max={20}
                  keepWithinRange={true}
                  clampValueOnBlur={false}
                  w={{ base: 'full', md: '30%' }}
                  isDisabled={!!dates?.length && !courseInfo?.draft}>
                  <NumberInputField {...register('studentsUpperBound', { required: true })} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <Stack direction={'column'}>
                  <Text fontSize={16} fontWeight={400} color={'grey.400'}>
                    Моля добавете какъв брой ученици ще могат да се запишат за Вашия курс.
                  </Text>
                  <Text fontSize={16} fontWeight={400} color={'grey.400'}>
                    (Максимален брой - 20 ученици)
                  </Text>
                </Stack>
              </Stack>

              <Stack spacing={4}>
                <Text fontSize={18} fontWeight={600}>
                  Цена на курса{' '}
                  <Text as={'span'} color={'red'}>
                    {courseInfo?.draft ? '' : '*'}
                  </Text>
                </Text>

                <Stack direction={'row'} spacing={4} align={'center'}>
                  <NumberInput
                    defaultValue={200}
                    clampValueOnBlur={false}
                    w={{ base: 'full', md: '30%' }}
                    bg={'grey.100'}
                    isDisabled={editInfo && !courseInfo?.draft}>
                    <NumberInputField {...register('price', { required: true })} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <Text fontSize={16} fontWeight={400} color={'grey.500'}>
                    лв
                  </Text>
                </Stack>

                <Text fontSize={16} fontWeight={400} color={'grey.400'}>
                  Моля изберете на каква цена желаете да предлагате Вашия курс
                </Text>
              </Stack>

              <Stack spacing={4}>
                <Text fontSize={18} fontWeight={600}>
                  Дати на провеждане{' '}
                  <Text as={'span'} color={'red'}>
                    {courseInfo?.draft ? '' : '*'}
                  </Text>
                </Text>

                {dates?.length && (
                  <Stack spacing={6} w={'full'}>
                    {dates.map((el, index) => (
                      <Stack
                        key={index}
                        direction={{ bae: 'column', xl: 'row' }}
                        justify={'space-between'}
                        align={'center'}
                        bg={'grey.100'}
                        p={2}
                        px={4}
                        rounded={'md'}
                        color={'grey.500'}
                        fontWeight={600}
                        gap={8}>
                        <Stack
                          direction={{ base: 'column', md: 'row' }}
                          justify={{ base: 'start' }}
                          gap={{ base: 4, lg: 6 }}
                          w={'85%'}
                          flexWrap={'wrap'}>
                          <Stack direction={'row'} gap={2}>
                            <Text>
                              {capitalizeMonth(format(new Date(el.startDate), 'dd LLL yyyy', { locale: bg }))}
                            </Text>
                            <Text>-</Text>
                            <Text>
                              {capitalizeMonth(
                                format(addDate(new Date(el.startDate), { weeks: el.weekLength }), 'dd LLL yyyy', {
                                  locale: bg,
                                }),
                              )}
                            </Text>
                          </Stack>

                          <Text wordBreak={'break-word'}>
                            {el?.courseDaysNumbers
                              ?.sort()
                              ?.map(el => daysArr[el - 1].short)
                              ?.toString()}
                          </Text>

                          <Stack direction={'row'} gap={2}>
                            <Text>{el?.courseHours}</Text>
                            <Text>-</Text>
                            <Text>{addMinutesToString(el?.courseHours, courseLength)}</Text>
                          </Stack>
                        </Stack>

                        <IconButton
                          aria-label={'delete theme'}
                          size="xs"
                          bg={'none'}
                          _hover={{ bg: 'none' }}
                          isDisabled={el?.numberOfStudents > 0}
                          onClick={() => removeDate(index)}
                          icon={<Img src={trash} w={5} />}
                        />
                      </Stack>
                    ))}
                  </Stack>
                )}

                <Button
                  size={{ base: 'md', lg: 'md' }}
                  color={'purple.500'}
                  fontSize={{ base: 16, '2xl': 20 }}
                  fontWeight={700}
                  bg={'transparent'}
                  _hover={{ bg: 'transparent' }}
                  w={'full'}
                  border={'1px dashed'}
                  mt={4}
                  borderColor={'purple.500'}
                  onClick={() => {
                    showAddDate();
                    handleScroll(topRef);
                  }}>
                  <Stack direction={'row'} align={'center'} spacing={2}>
                    <Img src={add} alt={'add course'} />
                    <Text> Добавяне на дата</Text>
                  </Stack>
                </Button>

                <FormControl isInvalid={!!errors.courseTerminRequests}>
                  <FormErrorMessage>{errors?.courseTerminRequests?.message}</FormErrorMessage>
                </FormControl>
              </Stack>

              {editInfo ? (
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  justify={{ base: 'center', md: 'space-between' }}
                  mt={12}>
                  <Button
                    type={'submit'}
                    size={{ base: 'md' }}
                    w={'fit-content'}
                    px={16}
                    py={0}
                    bg={'purple.500'}
                    color={'white'}
                    fontSize={16}
                    fontWeight={700}
                    _hover={{ opacity: '0.9' }}
                    _focus={{ outline: 'none' }}
                    _active={{ bg: 'purple.500' }}>
                    Запази промените
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
                      refreshCourseForm();
                      setEditInfo(false);
                      setShowCreateCourse(false);
                    }}>
                    Отказ
                  </Button>
                </Stack>
              ) : (
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  justify={{ base: 'center', md: 'space-between' }}
                  mt={12}>
                  <Button
                    type={'submit'}
                    size={{ base: 'md' }}
                    w={'fit-content'}
                    px={16}
                    py={0}
                    bg={'purple.500'}
                    color={'white'}
                    fontSize={16}
                    fontWeight={700}
                    _hover={{ opacity: '0.9' }}
                    _focus={{ outline: 'none' }}
                    _active={{ bg: 'purple.500' }}>
                    Публикувай курса
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
                      submitAsDraft();
                    }}>
                    Запази като чернова
                  </Button>
                </Stack>
              )}
            </Stack>
          </form>
        )}

        {addDateActive && (
          <CourseAddDate
            setShowCreateCourse={setShowCreateCourse}
            setDates={setDates}
            setAddDateActive={setAddDateActive}
            studentsUpperBound={getValues('studentsUpperBound')}
            setValue={setValue}
            courseLength={courseLength}
            dates={dates}
            isCreateCourse={true}
          />
        )}
      </Stack>
      <PageLoader isLoading={isLoading} />
    </>
  );
};

export default CreateCourseComponent;
