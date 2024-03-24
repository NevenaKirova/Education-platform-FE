import React, { useContext, useEffect, useState } from 'react';
import { Navigate, NavLink as ReactRouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';

import {
  Heading,
  Text,
  Button,
  Stack,
  Image,
  Center,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  useToast,
  useDisclosure,
  Hide,
} from '@chakra-ui/react';

import AuthContext from '../../context/AuthContext';

import { noneToShow } from '../../images';

import { getStudentCoursesTypes } from '../../store/selectors';

import { getResponseMessage } from '../../helpers/response.util';
import { Dropdown } from 'primereact/dropdown';
import {
  Pagination,
  PaginationContainer,
  PaginationNext,
  PaginationPage,
  PaginationPageGroup,
  PaginationPrevious,
  PaginationSeparator,
  usePagination,
} from '@ajna/pagination';
import {
  getStudentAll,
  getStudentLessons,
  getStudentCourses,
} from '../../store/features/student/studentCourses/studentCourses.async';
import DashboardCourseCardStudent from '../../components/courses/courses_student/dashboard_card.component';
import RateClassModal from '../../components/courses/modals/rate_class';
import Fullcalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import bgLocale from '@fullcalendar/core/locales/bg';
import { axiosInstance } from '../../axios';
import { format } from 'date-fns';
import CalendarDayViewModal from '../calendar/calendar_day_view';
import PageLoader from '../../utils/loader.component';

const courseTypes = [
  { label: 'Всички', type: 'all' },
  { label: 'Курсове', type: 'courses' },
  { label: 'Частни уроци', type: 'lessons' },
];

const sortValues = [
  { label: 'Всички', type: 'all' },
  { label: 'Активни', type: 'Active' },
  { label: 'Предстоящи', type: 'Upcoming' },
  { label: 'Завършени', type: 'Inactive' },
];

export default function MyDashboardPage() {
  const { user, userData } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpenDate, onOpen: onOpenDate, onClose: onCloseDate } = useDisclosure();

  const [sort, setSort] = useState(sortValues[0]);
  const [openModalWithCourse, setOpenModalWithCourse] = useState(null);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(null);
  const [dateEvents, setDateEvents] = useState([]);

  const { all, courses, lessons, isLoading } = useSelector(getStudentCoursesTypes);

  const NoData = ({ isPrivateLesson = false }: { isPrivateLesson?: boolean }) => {
    return (
      <Center h={{ base: '65vh', md: '60vh' }}>
        <Stack justify={'center'} align={{ base: 'start', md: 'center' }} spacing={6}>
          <Image src={noneToShow} alt="Profile Verification" h={'35vh'} />
          <Text color={'grey.400'}>Нямате записани {isPrivateLesson ? ' частни уроци' : 'курсове'} </Text>
          <Button
            as={ReactRouterLink}
            to={isPrivateLesson ? '/lessons' : '/courses'}
            size={{ base: 'md', lg: 'md' }}
            color={'white'}
            w={'full'}
            bg={'purple.500'}
            fontSize={{ base: 16, '2xl': 20 }}
            fontWeight={700}
            _hover={{ bg: 'purple.500', opacity: 0.9 }}>
            <Stack direction={'row'} align={'center'} spacing={2}>
              <Text>{isPrivateLesson ? 'Към частните уроци' : 'Към курсовете'} </Text>
            </Stack>
          </Button>
        </Stack>
      </Center>
    );
  };

  const outerLimit = 2;
  const innerLimit = 2;

  const { pages, pagesCount, currentPage, setCurrentPage } = usePagination({
    limits: {
      outer: outerLimit,
      inner: innerLimit,
    },
    initialState: {
      pageSize: 6,
      currentPage: 1,
    },
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getCourseTypes = async () => {
    try {
      dispatch(getStudentAll({ sort: sort?.type, page: currentPage }));

      dispatch(getStudentCourses({ sort: sort.type, page: currentPage }));

      dispatch(getStudentLessons({ sort: sort.type, page: currentPage }));
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

  const openDayModal = async (info, isEvent) => {
    let date;
    if (isEvent) {
      const dateTemp = info?.event?.start;
      date = format(dateTemp, 'yyyy-MM-dd');
    } else {
      date = info?.dateStr;
    }

    setDate(date);

    if (user && date) {
      try {
        const res: any[] = await axiosInstance.get(`/lessons/getStudentCalendarEvents/${date}`);

        setDateEvents(res.data);
        onOpenDate();
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
  };

  const getEvents = async () => {
    try {
      const res = await axiosInstance.get(`/users/getStudentCalendar`);
      setEvents(res.data);
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
    dispatch(getStudentAll({ sort: sort.type, page: currentPage }));
    getEvents();
  }, []);

  useEffect(() => {
    getCourseTypes();
  }, [currentPage, sort]);

  if (!user) return <Navigate to={'/'} replace />;

  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <>
      <Stack
        spacing={{ base: 6, md: 12 }}
        py={{ base: 0, lg: 10 }}
        px={{ base: 8, md: 16, xl: 20, '2xl': 40 }}
        mt={{ base: 36, lg: 40 }}
        align={'start'}
        justify={'space-between'}
        w={'full'}>
        <Stack align={'start'} spacing={{ base: 6, xl: 16 }} direction={{ base: 'column', xl: 'row' }} w={'full'}>
          <Stack flex={1} spacing={{ base: 5, md: 10 }} minW={'55%'} w={'full'}>
            <Heading flex={1} textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 34 }} color={'grey.600'}>
              Моите уроци
            </Heading>

            <Stack flex={1} spacing={{ base: 5, md: 10 }} w={'full'}>
              <Tabs variant="unstyled" w={'full'}>
                <Stack
                  spacing={{ base: 10, md: 6 }}
                  direction={'row'}
                  flexWrap={'wrap'}
                  w={'full'}
                  justify={'space-between'}>
                  <TabList gap={{ base: 10, md: 8 }}>
                    {courseTypes.map((type, index) => (
                      <Tab
                        key={index}
                        _selected={{ color: 'white', bg: 'purple.500' }}
                        rounded={'md'}
                        color={'purple.500'}
                        border={'dashed 2px'}
                        borderColor={'purple.500'}
                        px={3}
                        fontSize={{ base: 14, md: 16 }}>
                        {type?.label}
                      </Tab>
                    ))}
                  </TabList>

                  <Dropdown
                    value={sort}
                    onChange={e => setSort(e.value)}
                    options={sortValues}
                    optionLabel="label"
                    placeholder="Сортирай по"
                  />
                </Stack>

                <Hide above={'xl'}>
                  <Stack
                    py={{ base: 8 }}
                    px={{ base: 10 }}
                    mt={16}
                    mb={12}
                    justify={'start'}
                    w={{ base: 'full', lg: 'full', '2xl': '40%' }}
                    rounded={'md'}
                    boxShadow={'custom'}
                    className={'dashboard-calendar'}>
                    <Fullcalendar
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                      initialView={'dayGridMonth'}
                      displayEventTime={false}
                      weekNumberCalculation={'ISO'}
                      locale={bgLocale}
                      events={events}
                      eventClassNames={'eventClass'}
                      dateClick={info => openDayModal(info, false)}
                      fixedWeekCount={false}
                      headerToolbar={{
                        start: '',
                        center: 'prev title next',
                        end: '',
                      }}
                      height={'45vh'}
                    />
                  </Stack>
                </Hide>

                <TabPanels pt={2}>
                  <TabPanel p={0}>
                    {all && all?.total ? (
                      <>
                        <SimpleGrid columns={{ base: 1, '3xl': 2 }} spacing={4} mt={8}>
                          {all.lessonResponses?.map((el, index) => (
                            <DashboardCourseCardStudent
                              key={index}
                              course={el}
                              onOpen={onOpen}
                              setOpenModalWithCourse={setOpenModalWithCourse}
                            />
                          ))}
                        </SimpleGrid>
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
                              onClick={() =>
                                console.log('Im executing my own function along with Next component functionality')
                              }>
                              <Text>Следваща</Text>
                            </PaginationNext>
                          </PaginationContainer>
                        </Pagination>
                      </>
                    ) : (
                      <NoData />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {courses && courses?.total ? (
                        <>
                          <SimpleGrid columns={{ base: 1, '3xl': 2 }} spacing={4} mt={8}>
                            {courses.lessonResponses?.map((el, index) => (
                                <DashboardCourseCardStudent
                                    key={index}
                                    course={el}
                                    onOpen={onOpen}
                                    setOpenModalWithCourse={setOpenModalWithCourse}
                                />
                            ))}
                          </SimpleGrid>
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
                                  onClick={() =>
                                      console.log('Im executing my own function along with Next component functionality')
                                  }>
                                <Text>Следваща</Text>
                              </PaginationNext>
                            </PaginationContainer>
                          </Pagination>
                        </>
                    ) : (
                      <NoData />
                    )}
                  </TabPanel>
                  <TabPanel p={0}>
                    {lessons && lessons?.total ? (
                        <>
                          <SimpleGrid columns={{ base: 1, '3xl': 2 }} spacing={4} mt={8}>
                            {lessons.lessonResponses?.map((el, index) => (
                                <DashboardCourseCardStudent
                                    key={index}
                                    course={el}
                                    onOpen={onOpen}
                                    setOpenModalWithCourse={setOpenModalWithCourse}
                                />
                            ))}
                          </SimpleGrid>
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
                                  onClick={() =>
                                      console.log('Im executing my own function along with Next component functionality')
                                  }>
                                <Text>Следваща</Text>
                              </PaginationNext>
                            </PaginationContainer>
                          </Pagination>
                        </>
                    ) : (
                      <NoData isPrivateLesson={true} />
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Stack>
          </Stack>

          <Hide below={'xl'}>
            <Stack
              py={{ base: 8 }}
              px={{ base: 10 }}
              mt={{ base: 0, lg: 44 }}
              mb={12}
              justify={'start'}
              w={{ base: 'full', lg: '34%', '2xl': '40%' }}
              rounded={'md'}
              boxShadow={'custom'}
              className={'dashboard-calendar'}>
              <Fullcalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={'dayGridMonth'}
                displayEventTime={false}
                weekNumberCalculation={'ISO'}
                locale={bgLocale}
                events={events}
                eventClassNames={'eventClass'}
                dateClick={info => openDayModal(info, false)}
                fixedWeekCount={false}
                headerToolbar={{
                  start: '',
                  center: 'prev title next',
                  end: '',
                }}
                height={'45vh'}
              />
            </Stack>
          </Hide>
        </Stack>
      </Stack>

      <RateClassModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} course={openModalWithCourse} />
      <CalendarDayViewModal
        isOpen={isOpenDate}
        onClose={onCloseDate}
        date={date}
        events={dateEvents}
        role={userData?.role}
      />
    </>
  );
}
