import React, { useEffect, useState, useRef } from 'react';
import { SubmitHandler, useForm, useFieldArray } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { format } from 'date-fns';

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
  useToast,
  IconButton,
  Box,
} from '@chakra-ui/react';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';

import { getResponseMessage } from '../../../helpers/response.util';
import PageLoader from '../../../utils/loader.component';
import { axiosInstance } from '../../../axios';
import { useAppDispatch } from '../../../store';
import { getCoursesAll, getCoursesDraft } from '../../../store/features/teacher/teacherCourses/teacherCourses.async';
import { addMinutesToString } from './create_course.component';
import { add, close, closeRed, trash } from '../../../icons';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import {
  getLessonsActive,
  getLessonsAll,
  getLessonsInactive,
} from '../../../store/features/teacher/teacherLessons/teacherLessons.async';

type Inputs = {
  title: string | null;
  subject: string | null;
  studentsUpperBound: number | null;
  price: number | string | null;
  description: string | null;
  themas: [];
  length: string;
  privateLessonTermins: any[];
  isPrivateLesson: boolean;
};
const CreateLessonComponent = ({
  setShowCreateCourse,
  showCreateCourse,
  setAddDateActive,
  isEdit = false,
}: {
  setShowCreateCourse: any;
  showCreateCourse: boolean;
  setAddDateActive: any;
  isEdit?: boolean;
}) => {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const dateRef = useRef(null);
  const topRef = useRef(null);

  const defaultTime = new Date();
  defaultTime.setHours(8);
  defaultTime.setMinutes(0);

  const [isLoading, setIsLoading] = useState(false);
  const [lowerGrade, setLowerGrade] = useState<any>(null);
  const [upperGrade, setUpperGrade] = useState<any>(null);
  const [subject, setSelectedSubject] = useState(null);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [courseLength, setCourseLength] = useState<string>('60');
  const [dates, setDates] = useState([]);
  const [editableIndexes, setEditableIndexes] = useState([0]);
  const [showDateError, setShowDateError] = useState(false);

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
    defaultValues: {
      title: null,
      subject: null,
      isPrivateLesson: true,
      price: 200,
      studentsUpperBound: 1,
      description: null,
      length: '60',
      privateLessonTermins: [
        {
          date: '',
          lessonHours: [],
        },
      ],
      themas: [{ title: '' }],
    },
  });

  const NestedTime = ({ nestIndex }: { nestIndex: number }) => {
    const {
      fields: timeFields,
      remove: removeTime,
      append: appendTime,
    } = useFieldArray({
      control,
      name: `privateLessonTermins.${nestIndex}.lessonHours`,
    });

    const [time, setTime] = useState(new Date(defaultTime));

    return (
      <>
        <Stack direction={'row'} spacing={4} flexWrap={'wrap'}>
          {timeFields.map((item, k) => (
            <Stack
              key={k}
              direction={'row'}
              gap={2}
              bg={'white'}
              border={'1.2px solid'}
              borderColor={'grey.200'}
              borderRadius={'md'}
              w={'fit-content'}
              align={'center'}
              justify={'center'}
              pl={2}>
              <Text>{item?.time}</Text>
              <Text>-</Text>
              <Text>{addMinutesToString(item?.time, courseLength)}</Text>

              <IconButton
                bg="transparent"
                aria-label="delete time"
                _hover={{ bg: 'white' }}
                onClick={() => removeTime(k)}
                isDisabled={timeFields.length <= 1}
                icon={<Img src={closeRed} h={{ base: 5 }} w={'full'} />}
              />
            </Stack>
          ))}

          {timeFields.length && (
            <Button
              size={{ base: 'sm', lg: 'md' }}
              color={'purple.500'}
              bg={'transparent'}
              fontSize={{ base: 16, '2xl': 20 }}
              fontWeight={700}
              _hover={{ bg: 'transparent' }}
              onClick={() => setEditableIndexes([nestIndex])}>
              <Img src={add} alt={'аdd lesson'} w={5} h={5} />
            </Button>
          )}
        </Stack>

        {editableIndexes.indexOf(nestIndex) != -1 && (
          <Stack spacing={8}>
            <Stack spacing={6}>
              <Text fontSize={16} fontWeight={600}>
                Добавяне на час{' '}
                <Text as={'span'} color={'red'}>
                  *
                </Text>
              </Text>
              <Stack direction={'row'} spacing={10} align={'center'}>
                <Calendar
                  value={time}
                  onChange={e => {
                    if (e.value) {
                      setTime(e.value);
                    }
                  }}
                  placeholder={'Изберете час'}
                  timeOnly
                />
                <Text> - </Text>
                <Calendar value={addMinutes(new Date(time), getValues('length'))} timeOnly disabled />
              </Stack>

              <Stack>
                <Text fontSize={16} fontWeight={600} color={'purple.500'}>
                  Забележка *
                </Text>
                <Text fontSize={16} color={'grey.500'}>
                  Този урок има зададена продължителност от <b>{watch('length')} минути</b>. Крайният час на урока ще се
                  генерира автоматично, след като посочите неговото начало.
                </Text>
              </Stack>
            </Stack>

            <Button
              isDisabled={!getValues(`privateLessonTermins[${nestIndex}].date`)}
              type={'submit'}
              size={{ base: 'md' }}
              w={'fit-content'}
              px={10}
              py={0}
              bg={'purple.500'}
              color={'white'}
              fontSize={16}
              fontWeight={700}
              _hover={{ opacity: '0.9' }}
              _focus={{ outline: 'none' }}
              _active={{ bg: 'purple.500' }}
              _disabled={{ opacity: '0.3', cursor: 'not-allowed' }}
              onClick={() => appendTime({ time: format(time, 'HH:mm') })}>
              Запази
            </Button>
          </Stack>
        )}
      </>
    );
  };

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'privateLessonTermins',
  });

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

  function addMinutes(time, minutes) {
    return !!time && new Date(time.getTime() + minutes * 60000);
  }

  const refreshForm = () => {
    reset();
    setSelectedSubject(null);
    setLowerGrade(null);
    setUpperGrade(null);
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
    try {
      await axiosInstance.post('/lessons/savePrivateLessonDraft', getValues());

      setIsLoading(false);
      setShowCreateCourse(false);
      refreshForm();
      dispatch(getCoursesDraft());
      dispatch(getCoursesAll());

      toast({
        title: 'Успешно запазване на чернова',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
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
    const oneHasData = data.privateLessonTermins.some(el => el.date && el.lessonHours.length);

    if (!data?.privateLessonTermins?.length || !oneHasData) {
      setShowDateError(true);
      handleScroll(dateRef);
    } else {
      data.privateLessonTermins = data.privateLessonTermins.filter(el => el.date.length);

      setIsLoading(true);
      try {
        // if (editInfo) {
        //   if (!!courseInfo && courseInfo.isDraft) {
        //     await axiosInstance.post(`/lessons/editCourseDraft/${courseId}`, data);
        //   } else {
        //     await axiosInstance.post(`/lessons/editCourse/${courseId}`, data);
        //   }
        //   setEditInfo(false);
        //   getCourseInformation(data.lessonID);
        //   getCourseDates(data.lessonID);
        // } else {
        await axiosInstance.post('/lessons/createPrivateLesson', data);
        dispatch(getLessonsAll());
        dispatch(getLessonsActive());
        dispatch(getLessonsInactive());
        // }

        setShowCreateCourse(false);
        reset();

        setIsLoading(false);
        // toast({
        //   title: editInfo ? 'Успешна редакция на курс' : 'Успешно създаване на курс',
        //   status: 'success',
        //   duration: 3000,
        //   position: 'top-right',
        // });
      } catch (err) {
        setIsLoading(false);
        toast({
          title: getResponseMessage(err),
          status: 'error',
          duration: 3000,
          position: 'top-right',
        });
      }
    }
  };

  useEffect(() => {
    register('subject', { required: 'Полето е задължително' });
    // register('privateLessonTermins', { required: 'Добавете поне една дата на провеждане' });
  }, [register]);

  useEffect(() => {
    getSubjects();
  }, []);

  useEffect(() => {
    fields?.length == 1 && setEditableIndexes([0]);
  }, [fields.length]);

  return (
    <Stack w={{ base: 'full', xl: '40vw' }} spacing={10}>
      <Stack spacing={8} w={'full'} ref={topRef}>
        {showCreateCourse && !isEdit && (
          <Breadcrumb fontSize={{ base: 14, lg: 18 }} cursor={'default'}>
            <BreadcrumbItem _hover={{ textDecoration: 'none', cursor: 'default' }} cursor={'default'}>
              <BreadcrumbLink
                textDecoration={'none'}
                cursor={'default'}
                onClick={() => {
                  setShowCreateCourse(false);
                  setAddDateActive(false);
                }}>
                Моите частни уроци
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color={'purple.500'} _hover={{ textDecoration: 'none' }} cursor={'default'}>
              <BreadcrumbLink textDecoration={'none'}>Създаване на частен урок</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        )}
      </Stack>

      {showCreateCourse && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={10}>
            {!isEdit && (
              <Heading flex={1} textAlign={'left'} fontSize={{ base: 20, lg: 26, xl: 28 }} color={'grey.600'}>
                Създаване на частен урок
              </Heading>
            )}

            <Stack spacing={4}>
              <Text fontSize={18} fontWeight={600}>
                Заглавие{' '}
                <Text as={'span'} color={'red'}>
                  *
                </Text>
              </Text>
              <FormControl isInvalid={!!errors.title}>
                <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                  <Input
                    pr="4.5rem"
                    type="text"
                    placeholder="Български език за 8ми клас"
                    maxLength={100}
                    {...register('title', { required: 'Полето е задължително' })}
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

            <Stack spacing={4}>
              <Text fontSize={18} fontWeight={600}>
                Предмет{' '}
                <Text as={'span'} color={'red'}>
                  *
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
                  className={errors.subject ? 'invalid-dropdown w-full' : 'p-invalid w-full'}
                  showClear
                />

                <FormErrorMessage>{errors?.subject?.message}</FormErrorMessage>
              </FormControl>
              <Text fontSize={16} fontWeight={400} color={'grey.400'}>
                Моля изберете предмет, върху който ще се фокусира Вашият курс
              </Text>
            </Stack>

            <Stack spacing={4} w={'full'}>
              <Text fontSize={18} fontWeight={600}>
                Клас
              </Text>
              <Stack
                direction={{ base: 'column', md: 'row' }}
                align={'center'}
                spacing={{ base: 8, lg: 12 }}
                w={'full'}>
                <Dropdown
                  value={lowerGrade}
                  onChange={e => {
                    setLowerGrade(e.value);
                    setValue('lowerGrade', e.value);
                  }}
                  options={availableGrades}
                  optionLabel="grade"
                  placeholder="От"
                  className={'w-full'}
                  showClear
                />
                <Text>-</Text>
                <Dropdown
                  value={upperGrade}
                  onChange={e => {
                    setUpperGrade(e.value);
                    setValue('upperGrade', e.value);
                  }}
                  options={availableGrades}
                  optionLabel="grade"
                  placeholder="До"
                  className={'w-full'}
                  showClear
                />
              </Stack>

              <Text fontSize={16} fontWeight={400} color={'grey.400'}>
                Моля изберете за кои класове желаете да давате частни уроци
              </Text>
            </Stack>

            <Stack spacing={4}>
              <Text fontSize={18} fontWeight={600}>
                Описание на урока{' '}
                <Text as={'span'} color={'red'}>
                  *
                </Text>
              </Text>

              <FormControl isInvalid={!!errors.description}>
                <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                  <Textarea
                    pr="4.5rem"
                    maxLength={600}
                    resize={'none'}
                    rows={4}
                    {...register('description', { required: 'Полето е задължително' })}
                  />
                  <InputRightElement width="4.5rem" color={'grey.500'}>
                    {watch('description')?.length || 0}/600
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.description?.message}</FormErrorMessage>
              </FormControl>

              <Text fontSize={16} fontWeight={400} color={'grey.400'}>
                Моля добавете кратко описание. Използвайте ясни изрази и ключови думи, за да могат учениците по-лесно да
                разбират Вашия курс
              </Text>
            </Stack>

            <Stack spacing={4}>
              <Text fontSize={18} fontWeight={600}>
                Тема{' '}
                <Text as={'span'} color={'red'}>
                  *
                </Text>
              </Text>

              <FormControl isInvalid={!!errors.themas}>
                <Input
                  pr="4.5rem"
                  type="text"
                  placeholder="Тема"
                  maxLength={100}
                  size={{ base: 'sm', lg: 'md' }}
                  bg={'grey.100'}
                  rounded={'md'}
                  {...register('themas[0].title', { required: 'Полето е задължително' })}
                />

                <FormErrorMessage>{errors?.themas?.message}</FormErrorMessage>
              </FormControl>
            </Stack>

            <Stack spacing={4}>
              <Text fontSize={18} fontWeight={600}>
                Продължителност на урока{' '}
                <Text as={'span'} color={'red'}>
                  *
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
                  <Radio size="lg" colorScheme="purple" value={'15'} isDisabled={!!dates.length}>
                    <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                      15 мин
                    </Text>
                  </Radio>
                  <Radio size="lg" colorScheme="purple" value={'30'} isDisabled={!!dates.length}>
                    <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                      30 мин
                    </Text>
                  </Radio>
                  <Radio size="lg" colorScheme="purple" value={'45'} isDisabled={!!dates.length}>
                    <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                      45 мин
                    </Text>
                  </Radio>
                  <Radio size="lg" colorScheme="purple" value={'60'} defaultChecked isDisabled={!!dates.length}>
                    <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                      60 мин
                    </Text>
                  </Radio>
                  <Radio size="lg" colorScheme="purple" value={'90'} isDisabled={!!dates.length}>
                    <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                      90 мин
                    </Text>
                  </Radio>
                  <Radio size="lg" colorScheme="purple" value={'120'} isDisabled={!!dates.length}>
                    <Text textAlign={'left'} fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
                      120 мин
                    </Text>
                  </Radio>
                </Stack>
              </RadioGroup>
            </Stack>

            <Stack spacing={4}>
              <Text fontSize={18} fontWeight={600}>
                Цена на урок{' '}
                <Text as={'span'} color={'red'}>
                  *
                </Text>
              </Text>

              <Stack direction={'row'} spacing={4} align={'center'}>
                <NumberInput
                  defaultValue={200}
                  clampValueOnBlur={false}
                  w={{ base: 'full', md: '30%' }}
                  bg={'grey.100'}>
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
                  *
                </Text>
              </Text>

              <Stack spacing={10} w={'full'}>
                {fields?.map((el, index: number) => (
                  <Stack key={index} direction={'column'} spacing={6} ref={dateRef} w={'full'}>
                    <Stack direction={'row'} spacing={2} w={'full'} align={'center'}>
                      <Calendar
                        value={
                          getValues(`privateLessonTermins[${index}].date`)
                            ? new Date(getValues(`privateLessonTermins[${index}].date`))
                            : ''
                        }
                        onChange={e => {
                          if (e.value) {
                            setValue(`privateLessonTermins[${index}].date`, format(e.value, 'yyyy-MM-dd'));
                            setEditableIndexes([index]);
                          }
                          trigger('privateLessonTermins');
                        }}
                        placeholder={'Изберете дата'}
                        minDate={new Date()}
                        dateFormat="dd M yy"
                        locale={'bg'}
                        showIcon
                        className={'max-w-full w-full'}
                      />

                      <Box
                        as={IconButton}
                        aria-label={'delete theme'}
                        size="xs"
                        bg={'none'}
                        _hover={{ bg: 'none' }}
                        isDisabled={fields.length == 1}
                        onClick={() => {
                          remove(index);
                          const length = getValues('privateLessonTermins').length;
                          setEditableIndexes([length - 1]);
                        }}
                        icon={<Img src={trash} w={5} />}
                      />
                    </Stack>

                    <NestedTime nestIndex={index} />
                  </Stack>
                ))}

                <FormControl isInvalid={showDateError}>
                  <FormErrorMessage>Добавете поне една дата</FormErrorMessage>
                </FormControl>
              </Stack>
            </Stack>

            <Button
              isDisabled={
                getValues('privateLessonTermins')?.filter(el => el.date).length !==
                getValues('privateLessonTermins').length
              }
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
                if (!getValues(`privateLessonTermins[${editableIndexes[0]}].lessonHours`)?.length) {
                  setValue(`privateLessonTermins[${editableIndexes[0]}].lessonHours`, [{ time: '08:00' }]);
                }

                append({
                  date: '',
                  lessonHours: [],
                });

                const length = getValues('privateLessonTermins').length;
                setEditableIndexes([length - 1]);
              }}>
              <Stack direction={'row'} align={'center'} spacing={2}>
                <Img src={add} alt={'add course'} />
                <Text> Добавяне на дата</Text>
              </Stack>
            </Button>

            {isEdit ? (
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
                  Публикувай урока
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

      <PageLoader isLoading={isLoading} />
    </Stack>
  );
};

export default CreateLessonComponent;
