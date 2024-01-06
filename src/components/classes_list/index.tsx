import React, { useEffect, useState } from 'react';
import { addDays, addMonths, format } from 'date-fns';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Dropdown } from 'primereact/dropdown';
import {
  Stack,
  InputGroup,
  InputRightElement,
  Input,
  Grid,
  GridItem,
  Button,
  Text,
  Heading,
  Flex,
  Spacer,
  PopoverHeader,
  PopoverContent,
  PopoverBody,
  RangeSliderThumb,
  RangeSliderFilledTrack,
  RangeSlider,
  RangeSliderTrack,
  Checkbox,
  Image,
  Popover,
  PopoverTrigger,
  useToast,
} from '@chakra-ui/react';

import {
  Pagination,
  PaginationPage,
  PaginationNext,
  PaginationPrevious,
  PaginationPageGroup,
  PaginationContainer,
  PaginationSeparator,
  usePagination,
} from '@ajna/pagination';

import CourseCard from '../../components/courses/course_card/course_card.compoment';
import PageLoader from '../../utils/loader.component';
import { getResponseMessage } from '../../helpers/response.util';
import axios from '../../axios';

import { CloseIcon } from '@chakra-ui/icons';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { noData } from '../../images';

type Filters = {
  days: number[];
  grade: string | null;
  subject: string | null;
  date: string | null;
  hoursLowerBound: string | null;
  hoursUpperBound: string | null;
  lowerBound: string | null;
  upperBound: string | null;
  searchTerm: string | null;
  price: number | string | null;
};

const sortValues = [
  { name: 'Най-ниска цена', value: 'Lowest price' },
  { name: 'Най-висок рейтинг', value: 'Highest rating' },
  { name: 'Най-скорошен', value: 'Starting soonest' },
];

const outerLimit = 2;
const innerLimit = 2;

const ClassesComponent = ({ isPrivateLesson }: { isPrivateLesson: boolean }) => {
  const toast = useToast();

  const [sort, setSort] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [classes, setClasses] = useState<any>([]);
  const [classesTotal, setClassesTotal] = useState<number | undefined>(0);

  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);
  const [availablePrices, setAvailablePrices] = useState([]);
  const [hours, setHours] = useState([8, 18]);
  const [days, setDays] = useState<any>([]);
  const [startDate, setStartDate] = useState(null);
  const [subject, setSubject] = useState(null);
  const [grade, setGrade] = useState<any>(null);
  const [price, setPrice] = useState<any>(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Filters>({
    defaultValues: {
      days: [],
      grade: null,
      subject: null,
      date: null,
      hoursLowerBound: null,
      hoursUpperBound: null,
      lowerBound: null,
      upperBound: null,
      searchTerm: null,
    },
  });

  const defaultFilters = { pageNumber: 1, sort: '', isPrivateLesson: isPrivateLesson };

  const daysArr = [
    { name: 'Понеделник', value: 1 },
    { name: 'Вторник', value: 2 },
    { name: 'Сряда', value: 3 },
    { name: 'Четвъртък', value: 4 },
    { name: 'Петък', value: 5 },
    { name: 'Събота', value: 6 },
    { name: 'Неделя', value: 7 },
  ];

  const startDateArr = [
    {
      name: 'Днес',
      day: {
        lowerBound: format(new Date(), 'yyyy-MM-dd'),
        upperBound: format(new Date(), 'yyyy-MM-dd'),
      },
    },
    {
      name: 'До 7 дни',
      day: {
        lowerBound: format(new Date(), 'yyyy-MM-dd'),
        upperBound: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      },
    },
    {
      name: 'До 14 дни',
      day: {
        lowerBound: format(new Date(), 'yyyy-MM-dd'),
        upperBound: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
      },
    },
    {
      name: 'До месец',
      day: {
        lowerBound: format(new Date(), 'yyyy-MM-dd'),
        upperBound: format(addMonths(new Date(), 1), 'yyyy-MM-dd'),
      },
    },
  ];

  const { pages, pagesCount, currentPage, setCurrentPage } = usePagination({
    total: classesTotal,
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: {
      pageSize: 10,
      currentPage: 1,
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const convertNumToTime = num => {
    return num % 1 === 0 ? `${num}:00` : `${num.toString().split('.')[0]}:30`;
  };

  const handleDayChange = e => {
    const { value, checked } = e.target;

    if (checked) {
      const selectedDays = [...getValues('days'), value];
      setValue('days', selectedDays);
      setDays(selectedDays);
    } else {
      const selectedDays = getValues('days').filter(e => e !== value);
      setValue('days', selectedDays);
      setDays(selectedDays);
    }
  };

  const handleResetForm = () => {
    reset();
    setDays([]);
    setHours([8, 18]);
    setSubject(null);
    setGrade(null);
    setStartDate(null);

    getClasses(defaultFilters);
  };

  const getClasses = async filters => {
    setIsLoading(true);
    try {
      const res = await axios.post('/lessons/getFilteredClasses', {
        ...filters,
        isPrivateLesson: isPrivateLesson,
        sort: sort,
        pageNumber: currentPage,
      });

      await setTimeout(() => setIsLoading(false), 200);
      setShowClasses(!!res.data.length);
      setClasses(res.data);
      setClassesTotal(res.data.length);
    } catch (error) {
      setIsLoading(false);
      setShowClasses(false);
      setClassesTotal(0);
      toast({
        title: getResponseMessage(error),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const searchText = () => {
    const text = getValues('searchTerm');
    getClasses({ text });
  };
  const onSubmit: SubmitHandler<any> = async data => {
    getClasses(data);
  };

  useEffect(() => {
    const values = getValues();
    getClasses(values);
  }, [currentPage, sort]);

  useEffect(() => {
    const getFiltersUrl = isPrivateLesson ? '/lessons/getLessonFilters' : '/lessons/getCourseFilters';
    setIsLoading(true);
    axios
      .get(getFiltersUrl)
      .then(res => {
        const subjectObj = Object.assign(res.data?.subjects?.map(key => ({ name: key, code: key })));
        const gradesObj = Object.assign(res.data?.grades?.map(key => ({ grade: key, value: key })));
        const pricesObj = Object.assign(res.data?.prices?.map(key => ({ price: key, value: key })));

        setAvailableSubjects(subjectObj);
        setAvailableGrades(gradesObj);
        setAvailablePrices(pricesObj);
      })
      .catch(function (error) {
        toast({
          title: getResponseMessage(error),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      });
  }, []);

  return (
    <Stack
      spacing={12}
      py={{ base: 0, lg: 10 }}
      px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
      mt={{ base: 36, lg: 40 }}
      align={'start'}
      justify={'start'}
      flex={1}
      w={'full'}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={8} w={'full'}>
          <Grid
            templateColumns={{ base: 'repeat(auto-fill, minmax(200px, 1fr))', xl: 'repeat(6, 1fr)' }}
            gap={6}
            w={'full'}>
            <GridItem colSpan={3}>
              <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'grey.100'} rounded={'md'}>
                <Input pr="4.5rem" type="text" placeholder="Търси учител или предмет" {...register('searchTerm')} />
                <InputRightElement width="4.5rem">
                  <Button
                    bg={'transparent'}
                    color={'purple.500'}
                    fontSize={14}
                    fontWeight={700}
                    w={'fit'}
                    h={'fit'}
                    mr={4}
                    p={2}
                    onClick={searchText}>
                    Търси
                  </Button>
                </InputRightElement>
              </InputGroup>
            </GridItem>
          </Grid>

          <Grid
            templateColumns={{ base: 'repeat(auto-fill, minmax(300px, 1fr))', xl: 'repeat(7, 1fr)' }}
            gap={{ base: 6, lg: 4 }}
            w={'full'}>
            <GridItem>
              <Dropdown
                value={subject}
                onChange={e => {
                  setValue('subject', e.value?.name);
                  setSubject(e.value);
                }}
                options={availableSubjects}
                optionLabel="name"
                placeholder="Предмет"
                className="w-full"
                showClear
              />
            </GridItem>

            <GridItem w={'full'}>
              <Popover>
                <PopoverTrigger>
                  <Button w={'full'} bg={'grey.100'} _hover={{ bg: '#ebedf1' }} size={{ base: 'sm', lg: 'md' }}>
                    <Stack direction={'row'} justify={'space-between'} w={'full'}>
                      <Text
                        fontWeight={days.length ? 500 : 400}
                        color={days.length ? 'grey.500' : '#8492a4'}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                        maxW={{ base: 'full', '2xl': '200px' }}>
                        {days.length ? (
                          <Text as={'span'} isTruncated minW={0} maxW={'20px'}>
                            {days.map(day => daysArr[day - 1].name).toString()}{' '}
                          </Text>
                        ) : (
                          <Text as={'span'} isTruncated minW={0} maxW={'20px'}>
                            Ден от седмицата
                          </Text>
                        )}{' '}
                      </Text>
                      <div
                        className="p-dropdown-trigger"
                        role="button"
                        aria-haspopup="listbox"
                        aria-expanded="false"
                        aria-label="Ден от седмицата"
                        data-pc-section="trigger">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="p-icon p-dropdown-trigger-icon p-clickable"
                          aria-hidden="true"
                          data-pc-section="dropdownicon">
                          <path
                            d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
                            fill="#6C757D"></path>
                        </svg>
                      </div>
                    </Stack>
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  rounded={'md'}
                  border={'grey.100'}
                  boxShadow={'custom'}
                  maxW={{ base: 'full', xl: '220px' }}>
                  <PopoverHeader border={'none'}></PopoverHeader>
                  <PopoverBody>
                    <Stack spacing={4} px={4} pb={4}>
                      <Text color={'grey.500'} fontWeight={600} align={'start'}>
                        Ден от седмицата{' '}
                      </Text>

                      <Stack spacing={4} direction="column">
                        {daysArr.map((day, index) => (
                          <Checkbox
                            key={index}
                            value={day?.value}
                            colorScheme="purple"
                            size={'md'}
                            onChange={e => {
                              handleDayChange(e);
                            }}>
                            <Text color={'grey.500'} opacity={0.9} ml={2}>
                              {' '}
                              {day?.name}
                            </Text>
                          </Checkbox>
                        ))}
                      </Stack>

                      <Text color={'grey.500'} fontWeight={600} align={'start'} mt={3}>
                        Часови диапазон
                      </Text>

                      <Stack>
                        <RangeSlider
                          aria-label={['min', 'max']}
                          defaultValue={hours}
                          min={6}
                          max={22}
                          onChange={val => {
                            setValue('hoursLowerBound', convertNumToTime(val[0]));
                            setValue('hoursUpperBound', convertNumToTime(val[1]));
                            setHours(val);
                          }}
                          step={0.5}>
                          <RangeSliderTrack bg="grey.200">
                            <RangeSliderFilledTrack bg={'purple.500'} />
                          </RangeSliderTrack>
                          <RangeSliderThumb index={0} border={'3px solid'} borderColor={'purple.500'} />
                          <RangeSliderThumb index={1} border={'3px solid'} borderColor={'purple.500'} />
                        </RangeSlider>
                        <Stack
                          w={'full'}
                          direction={'row'}
                          justify={'space-between'}
                          align={'center'}
                          fontSize={12}
                          color={'grey.400'}>
                          <Text>{convertNumToTime(hours[0])}</Text>

                          <Text>{convertNumToTime(hours[1])}</Text>
                        </Stack>
                      </Stack>
                    </Stack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </GridItem>

            <GridItem>
              <Dropdown
                value={startDate}
                onChange={e => {
                  setValue('lowerBound', e.value?.day?.lowerBound);
                  setValue('upperBound', e.value?.day?.upperBound);
                  setStartDate(e.value);
                }}
                options={startDateArr}
                optionLabel="name"
                placeholder="Начало"
                className="w-full"
                showClear
              />
            </GridItem>

            <GridItem>
              <Dropdown
                value={grade}
                onChange={e => {
                  setValue('grade', e.value?.value);
                  setGrade(e.value);
                }}
                options={availableGrades}
                optionLabel="grade"
                placeholder="Клас"
                className="w-full"
                showClear
              />
            </GridItem>

            <GridItem>
              <Dropdown
                value={price}
                onChange={e => {
                  setValue('price', e.value?.value);
                  setPrice(e.value);
                }}
                options={availablePrices}
                optionLabel="price"
                placeholder="Цена"
                className="w-full"
                showClear
              />
            </GridItem>

            <GridItem justifySelf={{ base: 'center', lg: 'end' }} colStart={{ base: 'auto', xl: 7 }} w={'full'}>
              <Stack
                direction={{ base: 'column', md: 'row' }}
                gap={{ base: 4, lg: 2 }}
                align={'start'}
                w={{ base: 'full', md: 'full' }}>
                <Button
                  type={'submit'}
                  w={{ base: 'full', md: 'fit-content' }}
                  size={{ base: 'sm', lg: 'md' }}
                  bg={'purple.500'}
                  color={'white'}
                  _hover={{ bg: 'purple.500', opacity: 0.9 }}>
                  <Text>Приложи</Text>
                </Button>

                <Button
                  size={{ base: 'sm', lg: 'md' }}
                  w={{ base: 'full', md: 'fit-content' }}
                  bg={'transparent'}
                  color={'purple.500'}
                  onClick={() => handleResetForm()}>
                  <Stack direction={'row'} align={'end'} spacing={3}>
                    <CloseIcon w={5} h={5} border="1px solid" borderRadius={'50%'} p={1} borderColor={'purple.500'} />
                    <Text>Премахни филтрите</Text>
                  </Stack>
                </Button>
              </Stack>
            </GridItem>
          </Grid>
        </Stack>
      </form>
      <Stack
        direction={{ base: 'column', lg: 'row' }}
        w={'100%'}
        justify={'space-between'}
        spacing={{ base: 6, lg: 'none' }}>
        <Heading flex={1} textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 34 }} color={'grey.600'}>
          {isPrivateLesson ? 'Частни уроци' : 'Курсове'}
        </Heading>

        <Dropdown
          value={sort}
          onChange={e => setSort(e.value)}
          options={sortValues}
          optionLabel="name"
          placeholder="Сортирай по"
        />
      </Stack>

      {isLoading ? (
        <PageLoader isLoading={isLoading} />
      ) : showClasses ? (
        <>
          <Grid w={'full'} templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={12}>
            {classes?.map((el, index) => <CourseCard key={index} course={el} />)}
          </Grid>

          <Flex p={2} justify={'end'} w={'full'}>
            <Spacer />

            <Pagination pagesCount={pagesCount} currentPage={currentPage} onPageChange={handlePageChange}>
              <PaginationContainer align="center" justify="end" p={4} w="full">
                <PaginationPrevious
                  _hover={{
                    bg: 'transparent',
                  }}
                  bg="transparent">
                  <Text>Предишна</Text>
                </PaginationPrevious>
                <PaginationPageGroup
                  align="center"
                  separator={<PaginationSeparator bg="blue.300" fontSize="sm" w={7} jumpSize={11} />}>
                  {pages.map((page: number) => (
                    <PaginationPage
                      w={7}
                      bg="transparent"
                      key={`pagination_page_${page}`}
                      page={page}
                      fontSize="sm"
                      color={'grey.400'}
                      _hover={{
                        color: 'purple.400',
                      }}
                      _current={{
                        color: 'purple.500',
                        bg: 'transparent',
                        fontSize: 'sm',
                        w: 7,
                      }}
                    />
                  ))}
                </PaginationPageGroup>
                <PaginationNext
                  _hover={{
                    bg: 'transparent',
                  }}
                  color={'purple.500'}
                  bg="transparent"
                  onClick={() => console.log('Im executing my own function along with Next component functionality')}>
                  <Text>Следваща</Text>
                </PaginationNext>
              </PaginationContainer>
            </Pagination>
          </Flex>
        </>
      ) : (
        <Stack direction={'column'} spacing={0} w={'full'} align={'center'} mt={-50}>
          <Image src={noData} alt="No data" h={'50vh'} />

          <Button
            type={'submit'}
            w={{ base: 'full', md: 'fit-content' }}
            size={{ base: 'sm', lg: 'md' }}
            bg={'purple.500'}
            color={'white'}
            _hover={{ bg: 'purple.500', opacity: 0.9 }}
            onClick={() => handleResetForm()}>
            <Text>Изчисти филтрите</Text>
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default ClassesComponent;
