import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';

import { Calendar } from 'primereact/calendar';
import { format } from 'date-fns';
import { MultiSelect } from 'primereact/multiselect';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { daysArr } from './create_course.component';
import { addLocale } from 'primereact/api';
import { axiosInstance } from '../../../axios';
import { getResponseMessage } from '../../../helpers/response.util';

export type DatesForm = {
  startDate: Date | string;
  courseDaysNumbers: number[] | null;
  courseHours: string;
  weekLength: number | null;
  studentsUpperBound: number | null;
};
const CourseAddDate = ({
  setAddDateActive,
  setShowCreateCourse,
  studentsUpperBound,
  setValue,
  setDates,
  courseLength,
  dates,
  setShowAddResources,
  setShowAddDate,
  courseId,
  isCreateCourse = false,
}: {
  setAddDateActive?: any;
  setShowCreateCourse?: any;
  studentsUpperBound: any;
  setValue?: any;
  setDates?: any;
  courseLength?: number | string;
  dates?: any;
  setShowAddResources?: any;
  setShowAddDate?: any;
  isCreateCourse?: boolean;
  courseId?: number;
}) => {
  const defaultTime = new Date();
  defaultTime.setHours(8);
  defaultTime.setMinutes(0);

  const toast = useToast();

  const [dateStartValue, setDateStartValue] = useState(new Date());
  const [dateEndValue, setDateEndValue] = useState();
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [time, setTime] = useState(new Date(defaultTime));

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
    register: registerDate,
    handleSubmit: handleSubmitDate,
    reset: resetDate,
    getValues: getValuesDate,
    setValue: setValueDate,
    watch: watchDate,
    trigger,
    formState: { errors: errorsDate },
  } = useForm<DatesForm>({
    defaultValues: {
      startDate: format(new Date(), 'yyyy-MM-dd'),
      courseDaysNumbers: [],
      courseHours: format(new Date(defaultTime), 'HH:mm'),
      weekLength: 4,
      studentsUpperBound: studentsUpperBound,
    },
  });

  const refreshDateForm = () => {
    resetDate();

    setDateStartValue(new Date());
    setSelectedDates([]);
    setTime(new Date(defaultTime));

    if (isCreateCourse) {
      setAddDateActive && setAddDateActive(false);
      setShowCreateCourse && setShowCreateCourse(true);
    } else {
      setShowAddDate(false);
      setShowAddResources(false);
    }
  };

  const onDateSubmit: SubmitHandler<any> = async data => {
    await trigger('courseDaysNumbers');

    if (isCreateCourse) {
      const datesArr = dates;
      datesArr.push(data);
      setValue('courseTerminRequests', datesArr, { shouldValidate: true });
      setDates([...datesArr]);
    } else {
      try {
        const res: any[] = await axiosInstance.post(`/lessons/addDate/${courseId}`, { data });

        setDates(res.data);
      } catch (err) {
        toast({
          title: getResponseMessage(err),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }

    refreshDateForm();
  };

  const addWeeksToDate = (dateObj, numberOfWeeks) => {
    const date = new Date(dateObj);
    date.setDate(new Date(dateObj).getDate() + numberOfWeeks * 7);
    setDateEndValue(date);
  };

  function addMinutes(time, minutes) {
    return !!time && new Date(time.getTime() + minutes * 60000);
  }

  useEffect(() => {
    addWeeksToDate(getValuesDate('startDate'), getValuesDate('weekLength'));
  }, []);

  useEffect(() => {
    addWeeksToDate(getValuesDate('startDate'), getValuesDate('weekLength'));
  }, [getValuesDate('weekLength'), getValuesDate('startDate')]);

  return (
    <form onSubmit={handleSubmitDate(onDateSubmit)}>
      <Stack spacing={10}>
        <Heading flex={1} textAlign={'left'} fontSize={{ base: 20, lg: 26, xl: 28 }} color={'grey.600'}>
          Добавяне на дата
        </Heading>
        <Stack spacing={4}>
          <Text fontSize={18} fontWeight={600}>
            Продължителност{' '}
            <Text as={'span'} color={'red'}>
              *
            </Text>
          </Text>

          <Stack direction={'row'} spacing={4} align={'center'}>
            <NumberInput
              defaultValue={4}
              clampValueOnBlur={false}
              w={{ base: 'full', md: '30%' }}
              min={1}
              keepWithinRange={true}
              onChange={e => {
                setValueDate('weekLength', e);
              }}>
              <NumberInputField {...registerDate('weekLength', { required: true })} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <Text fontSize={16} fontWeight={400} color={'grey.500'}>
              седмици
            </Text>
          </Stack>

          <Stack direction={'column'}>
            <Text fontSize={16} fontWeight={400} color={'grey.400'}>
              Моля изберете колко седмици желаете да продължи Вашият курс
            </Text>
          </Stack>
        </Stack>

        <Stack spacing={6}>
          <Text fontSize={18} fontWeight={600}>
            Начало{' '}
            <Text as={'span'} color={'red'}>
              *
            </Text>
          </Text>
          <Stack direction={'row'} spacing={10} align={'center'}>
            <Calendar
              value={dateStartValue}
              onChange={e => {
                setValueDate('startDate', format(e.value, 'yyyy-MM-dd'));
                setDateStartValue(e.value);
              }}
              minDate={new Date()}
              dateFormat="dd M yy"
              locale={'bg'}
              showIcon
            />
            <Text> - </Text>

            <Calendar value={dateEndValue} dateFormat="dd M yy" locale={'bg'} showIcon disabled />
          </Stack>

          <Stack>
            <Text fontSize={16} fontWeight={600} color={'purple.500'}>
              Забележка *
            </Text>
            <Text fontSize={16} color={'grey.500'}>
              Този курс има зададена продължителност от <b>{watchDate('weekLength')} седмици</b>. Крайната дата на курса
              ще се генерира автоматично, след като посочите неговото начало.
            </Text>
          </Stack>
        </Stack>

        <Stack spacing={6}>
          <Text fontSize={18} fontWeight={600}>
            Дни на провеждане{' '}
            <Text as={'span'} color={'red'}>
              *
            </Text>
          </Text>

          <FormControl isInvalid={!!errorsDate.courseDaysNumbers}>
            <MultiSelect
              {...registerDate('courseDaysNumbers', {
                required: 'Полето е задължително',
                minLength: { value: 1, message: 'das' },
              })}
              value={selectedDates}
              onChange={e => {
                setSelectedDates(e.value);
                setValueDate('courseDaysNumbers', e.value, { shouldValidate: true });
              }}
              options={daysArr}
              optionLabel="name"
              placeholder="Дни на провеждане"
              className="w-full"
              showClear
            />

            <FormErrorMessage>{errorsDate?.courseDaysNumbers?.message}</FormErrorMessage>
          </FormControl>
        </Stack>

        <Stack spacing={6}>
          <Text fontSize={18} fontWeight={600}>
            Час на провеждане{' '}
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
                  setValueDate('courseHours', format(e.value, 'HH:mm'));
                }
              }}
              timeOnly
            />
            <Text> - </Text>
            <Calendar value={addMinutes(new Date(time), courseLength)} timeOnly disabled />
          </Stack>

          <Stack>
            <Text fontSize={16} fontWeight={600} color={'purple.500'}>
              Забележка *
            </Text>
            <Text fontSize={16} color={'grey.500'}>
              Уроците в този курс имат продължителност от <b>{courseLength} минути</b>. Крайният час на всеки урок се
              генерира автоматично, след като посочите неговото начало.
            </Text>
          </Stack>
        </Stack>

        <Stack w={'full'} align={'center'} justify={'space-between'} direction={'row'}>
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
            Запази
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
              refreshDateForm();
            }}>
            Отказ
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};

export default CourseAddDate;
