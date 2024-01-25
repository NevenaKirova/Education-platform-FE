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
  Img,
  SimpleGrid,
  Grid,
  GridItem,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';

import AuthContext from '../../context/AuthContext';
import { addWhite, calendar } from '../../icons';

import { noneToShow } from '../../images';
import PageLoader from '../../utils/loader.component';
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
  const { user } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [sort, setSort] = useState(sortValues[0]);
  const [openModalWithCourse, setOpenModalWithCourse] = useState(null);

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

      // dispatch(getStudentCourses({ sort: sort.type, page: currentPage }));
      //
      // dispatch(getStudentLessons({ sort: sort.type, page: currentPage }));
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
  }, []);

  // useEffect(() => {
  //   upcomingCourses && getCourseTypes();
  // }, [upcomingCourses]);

  useEffect(() => {
    getCourseTypes();
  }, [currentPage, sort]);

  if (!user) return <Navigate to={'/'} replace />;

  return (
    <>
      <Stack
        spacing={{ base: 6, md: 12 }}
        py={{ base: 0, lg: 10 }}
        px={{ base: 8, md: 16, xl: 20, '2xl': 40 }}
        mt={{ base: 36, lg: 40 }}
        align={'start'}
        justify={'start'}
        w={'full'}>
        <Heading flex={1} textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 34 }} color={'grey.600'}>
          Моето табло
        </Heading>

        <Stack flex={1} spacing={{ base: 5, md: 10 }} w={'full'}>
          <Tabs variant="unstyled" w={'full'}>
            <Grid
              templateColumns={{ base: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr)', xl: 'repeat(8, 1fr)' }}
              gap={{ base: 10, md: 6 }}>
              <GridItem colSpan={{ base: 2, lg: 3 }}>
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
              </GridItem>

              <GridItem colStart={{ base: 2, lg: 4 }} rowStart={{ base: 2, lg: 1 }}>
                <Dropdown
                  value={sort}
                  onChange={e => setSort(e.value)}
                  options={sortValues}
                  optionLabel="label"
                  placeholder="Сортирай по"
                />
              </GridItem>

              <GridItem colStart={{ base: 1, lg: 5, xl: 8 }} rowStart={{ base: 2, lg: 1 }}>
                <Button
                  size={{ base: 'md', lg: 'md' }}
                  color={'purple.500'}
                  bg={'transparent'}
                  fontSize={{ base: 16, '2xl': 20 }}
                  fontWeight={700}
                  _hover={{ bg: 'transparent' }}
                  w={'fit-content'}
                  className={'no-padding'}>
                  <Stack as={ReactRouterLink} to={'/calendar'} direction={'row'} align={'center'} px={0}>
                    <Img src={calendar} alt={'calendar icon'} />
                    <Text> Отвори календара </Text>
                  </Stack>
                </Button>
              </GridItem>
            </Grid>

            <TabPanels pt={2}>
              <TabPanel p={0}>
                {all && all?.length ? (
                  <>
                    <SimpleGrid columns={{ base: 1, '3xl': 2 }} spacing={10} mt={8}>
                      {all.map((el, index) => (
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
                {courses && courses?.length ? (
                  <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10} mt={8}>
                    {courses.map((el, index) => (
                      <DashboardCourseCardStudent
                        key={index}
                        course={el}
                        isGrid={true}
                        onOpen={onOpen}
                        setOpenModalWithCourse={setOpenModalWithCourse}
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <NoData />
                )}
              </TabPanel>
              <TabPanel p={0}>
                {lessons && lessons?.length ? (
                  <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10} mt={8}>
                    {lessons.map((el, index) => (
                      <DashboardCourseCardStudent
                        key={index}
                        course={el}
                        isGrid={true}
                        onOpen={onOpen}
                        setOpenModalWithCourse={setOpenModalWithCourse}
                      />
                    ))}
                  </SimpleGrid>
                ) : (
                  <NoData isPrivateLesson={true} />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Stack>

      <RateClassModal isOpen={isOpen} onClose={onClose} onOpen={onOpen} course={openModalWithCourse} />
    </>
  );
}
