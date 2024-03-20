import React, { useContext, useEffect, useState } from 'react';
import { Navigate, NavLink as ReactRouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store';

import {
  Heading,
  Text,
  Button,
  Stack,
  Flex,
  Image,
  Center,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Img,
  SimpleGrid,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  useToast,
} from '@chakra-ui/react';

import AuthContext from '../../context/AuthContext';
import { addWhite, calendar } from '../../icons';
import UnverifiedComponent from '../../components/unverified_profile/unverified.component';
import DashboardCourseCard from '../../components/courses/course_card/dashboard_card.component';
import AwaitingVerificationComponent from '../../components/unverified_profile/awaitng_verification.component';
import CourseNoData from '../../components/courses/course_card/course_no_data.component';
import CreateCourseComponent from '../../components/courses/courses_teacher/create_course.component';
import { noneToShow } from '../../images';
import PageLoader from '../../utils/loader.component';
import { getTeacherCourses, getTeacherLessons } from '../../store/selectors';
import {
  getCoursesActive,
  getCoursesAll,
  getCoursesDraft,
  getCoursesInactive,
  getPayments,
  getUpcomingCourses,
} from '../../store/features/teacher/teacherCourses/teacherCourses.async';
import OpenedCourseComponent from '../../components/courses/courses_teacher/opened_course.component';
import { getResponseMessage } from '../../helpers/response.util';
import CreateLessonComponent from '../../components/courses/courses_teacher/create_lesson.component';
import {
  getLessonsActive,
  getLessonsAll,
  getLessonsDraft,
  getLessonsInactive,
} from '../../store/features/teacher/teacherLessons/teacherLessons.async';
import DashboardLessonCard from '../../components/courses/course_card/dashboard__lesson_card.component';

export default function DashboardPage() {
  const { user, userData } = useContext(AuthContext);
  const dispatch = useAppDispatch();
  const toast = useToast();

  const courseTypes = [
    { label: 'Всички', type: 'all' },
    { label: 'Активни', type: 'active' },
    { label: 'Неактивни', type: 'inactive' },
    { label: 'Чернови', type: 'draft' },
  ];

  const { upcomingCourses, allCourses, activeCourses, inactiveCourses, draftCourses, payments, isLoading } =
    useSelector(getTeacherCourses);

  const {
    allLessons,
    activeLessons,
    inactiveLessons,
    draftLessons,
    isLoading: isLessonLoading,
  } = useSelector(getTeacherLessons);

  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [addDateActive, setAddDateActive] = useState(false);
  const [isCourseOpened, setIsCourseOpened] = useState(false);
  const [openedCourse, setOpenedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const [isPrivateLessonToCreate, setIsPrivateLessonToCreate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(payments?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = payments?.slice(startIndex, endIndex);

  const handleClick = page => {
    setCurrentPage(page);
  };

  const showCourseForm = () => {
    setShowCreateCourse(true);
  };

  const showLessonForm = () => {
    setShowCreateLesson(true);
  };

  const getCourseTypes = async () => {
    try {
      dispatch(getCoursesAll());

      dispatch(getCoursesDraft());

      dispatch(getCoursesActive());

      dispatch(getCoursesInactive());
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

  const getLessonTypes = async () => {
    try {
      dispatch(getLessonsAll());

      dispatch(getLessonsActive());

      dispatch(getLessonsInactive());

      dispatch(getLessonsDraft());
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

  const NoData = ({ isPrivateLesson = false }: { isPrivateLesson?: boolean }) => {
    return (
      <Center h={'50vh'}>
        <Stack justify={'center'} align={'center'} spacing={6}>
          <Image src={noneToShow} alt="Profile Verification" h={'40vh'} />
          <Text color={'grey.400'}>Нямате създадени {isPrivateLesson ? 'уроци' : 'курсове'} </Text>
          <Button
            size={{ base: 'md', lg: 'md' }}
            color={'white'}
            w={'full'}
            bg={'purple.500'}
            fontSize={{ base: 16, '2xl': 20 }}
            fontWeight={700}
            _hover={{ bg: 'purple.500', opacity: 0.9 }}
            onClick={() => (isPrivateLesson ? showLessonForm() : showCourseForm())}>
            <Stack direction={'row'} align={'center'} spacing={2}>
              <Img src={addWhite} alt={'add course'} />
              <Text>{isPrivateLesson ? 'Създай урок' : 'Създай курс'} </Text>
            </Stack>
          </Button>
        </Stack>
      </Center>
    );
  };

  useEffect(() => {
    dispatch(getUpcomingCourses());
    dispatch(getPayments());
  }, []);

  useEffect(() => {
    upcomingCourses && getCourseTypes();
    dispatch(getLessonsAll());
  }, [upcomingCourses]);

  useEffect(() => {
    activeTab == 2 && getLessonTypes();
  }, [activeTab]);

  if (!user) return <Navigate to={'/'} replace />;

  return (
    <Stack
      spacing={{ base: 16, md: 24 }}
      py={{ base: 0, lg: 10 }}
      px={{ base: 8, md: 16, xl: 20, '2xl': 40 }}
      mt={{ base: 36, lg: 40 }}
      align={'start'}
      justify={'start'}
      flex={1}
      w={'full'}>
      <Flex flex={1} align={'start'} justify={'start'} w={'full'}>
        <Tabs
          index={activeTab}
          w={'full'}
          align={'start'}
          gap={8}
          isFitted
          position="relative"
          variant="unstyled"
          onChange={index => {
            setIsCourseOpened(false);
            setOpenedCourse(null);
            setActiveTab(index);
          }}>
          <TabList flexWrap={'wrap'} gap={4}>
            <Tab
              p={0}
              fontSize={{ base: 16, md: 18, lg: 20 }}
              fontWeight={600}
              color={'grey.500'}
              whiteSpace={'no-wrap'}
              maxW={'fit-content'}
              minW={'fit-content'}
              _selected={{ color: 'purple.500', fontWeight: 700 }}
              onClick={() => {
                setShowCreateCourse(false);
                setShowCreateLesson(false);
                setAddDateActive(false);
              }}>
              <Text>Начало</Text>
            </Tab>
            <Tab
              p={0}
              fontSize={{ base: 16, md: 18, lg: 20 }}
              fontWeight={600}
              color={'grey.500'}
              maxW={'fit-content'}
              minW={'fit-content'}
              _selected={{ color: 'purple.500', fontWeight: 700 }}
              onClick={() => {
                setShowCreateCourse(false);
                setShowCreateLesson(false);
                setAddDateActive(false);
              }}>
              <Text>Моите курсове</Text>
            </Tab>
            <Tab
              p={0}
              fontSize={{ base: 16, md: 18, lg: 20 }}
              fontWeight={600}
              color={'grey.500'}
              maxW={'fit-content'}
              minW={'fit-content'}
              _selected={{ color: 'purple.500', fontWeight: 700 }}
              onClick={() => {
                setShowCreateCourse(false);
                setShowCreateLesson(false);
                setAddDateActive(false);
              }}>
              <Text>Моите частни уроци</Text>
            </Tab>

            <Tab
              p={0}
              fontSize={{ base: 16, md: 18, lg: 20 }}
              fontWeight={600}
              color={'grey.500'}
              maxW={'fit-content'}
              minW={'fit-content'}
              _selected={{ color: 'purple.500', fontWeight: 700 }}
              onClick={() => {
                setShowCreateCourse(false);
                setShowCreateLesson(false);
                setAddDateActive(false);
              }}>
              <Text>Приходи</Text>
            </Tab>
          </TabList>

          {isLoading && activeTab == 0 ? (
            <PageLoader isLoading={isLoading} />
          ) : (
            <TabPanels pt={4} px={{ base: 0, lg: 2 }}>
              <TabPanel p={{ base: 0, lg: 2 }}>
                <Stack spacing={10}>
                  {userData?.verified === false ? (
                    <UnverifiedComponent />
                  ) : userData?.beingVerified === false ? (
                    <AwaitingVerificationComponent />
                  ) : upcomingCourses && !upcomingCourses?.length ? (
                    <CourseNoData
                      setShowCreateCourse={setShowCreateCourse}
                      setShowCreateLesson={setShowCreateLesson}
                      setActiveTab={setActiveTab}
                      setIsPrivateLessonToCreate={setIsPrivateLessonToCreate}
                    />
                  ) : (
                    <Stack>
                      <Stack
                        direction={{ base: 'column', lg: 'row' }}
                        align={{ base: 'start', lg: 'center' }}
                        justify={'space-between'}
                        spacing={{ base: 6, lg: 10 }}
                        mt={4}>
                        <Heading
                          flex={1}
                          as="h1"
                          fontSize={{ base: 24, lg: 32, xl: 30 }}
                          textAlign="start"
                          color={'grey.600'}>
                          Предстоящи курсове и уроци
                        </Heading>

                        <Button
                          color={'purple.500'}
                          bg={'transparent'}
                          fontSize={{ base: 16, '2xl': 20 }}
                          fontWeight={700}
                          _hover={{ bg: 'transparent' }}
                          p={0}>
                          <Stack as={ReactRouterLink} to={'/calendar'} direction={'row'} align={'center'}>
                            <Img src={calendar} alt={'calendar icon'} />
                            <Text> Отвори календара </Text>
                          </Stack>
                        </Button>
                      </Stack>

                      <Stack mt={8}>
                        {upcomingCourses?.map((el, index) => (
                          <DashboardCourseCard
                            key={index}
                            course={el}
                            setIsCourseOpened={setIsCourseOpened}
                            setOpenedCourse={setOpenedCourse}
                            setActiveTab={setActiveTab}
                            activeTab={activeTab}
                          />
                        ))}
                      </Stack>
                    </Stack>
                  )}
                </Stack>
              </TabPanel>

              <TabPanel p={{ base: 0, lg: 2 }}>
                {userData?.verified === false ? (
                  <UnverifiedComponent />
                ) : userData?.beingVerified === false ? (
                  <AwaitingVerificationComponent />
                ) : isCourseOpened ? (
                  <OpenedCourseComponent
                    isPrivateLesson={isPrivateLessonToCreate}
                    showCreateCourse={showCreateCourse}
                    setShowCreateCourse={setShowCreateCourse}
                    showCreateLesson={showCreateLesson}
                    setShowCreateLesson={setShowCreateLesson}
                    addDateActive={addDateActive}
                    setAddDateActive={setAddDateActive}
                    setIsCourseOpened={setIsCourseOpened}
                    course={openedCourse}
                  />
                ) : !showCreateCourse && !addDateActive ? (
                  <Stack spacing={{ base: 6, lg: 10 }} mt={4}>
                    <Heading
                      flex={1}
                      as="h1"
                      fontSize={{ base: 24, lg: 32, xl: 30 }}
                      textAlign="start"
                      color={'grey.600'}>
                      Моите курсове
                    </Heading>

                    <Tabs variant="unstyled" w={'full'}>
                      <Stack
                        direction={{ base: 'column', md: 'row' }}
                        justify={'space-between'}
                        w={'full'}
                        align={'center'}>
                        <TabList
                          gap={{ base: 4, lg: 8 }}
                          flexWrap={'wrap'}
                          w={'full'}
                          justifyContent={{ base: 'space-between', md: 'flex-start' }}>
                          {courseTypes.map((type, index) => (
                            <Tab
                              key={index}
                              _selected={{ color: 'white', bg: 'purple.500' }}
                              rounded={'md'}
                              color={'purple.500'}
                              border={'dashed 2px'}
                              borderColor={'purple.500'}
                              fontSize={{ base: 14, md: 16 }}
                              px={{ base: '6px', lg: 4 }}
                              py={{ base: 1, lg: 2 }}>
                              {type?.label}
                            </Tab>
                          ))}
                        </TabList>

                        {allCourses && allCourses.length && (
                          <Button
                            color={'white'}
                            bg={'purple.500'}
                            fontSize={{ base: 14, md: 16, lg: 18, '2xl': 20 }}
                            fontWeight={{ base: 500, lg: 700 }}
                            _hover={{ bg: 'purple.500', opacity: 0.9 }}
                            w={{ base: 'fit-content', md: 'fit-content', lg: '20%' }}
                            minW={'fit-content'}
                            py={{ base: 2, lg: 2 }}
                            mt={{ base: 3, md: 0 }}
                            alignSelf={{ base: 'end', md: 'inherit' }}
                            h={{ base: 'fit-content', lg: 'full' }}
                            onClick={showCourseForm}>
                            <Stack direction={'row'} align={'center'} spacing={2}>
                              <Img
                                src={addWhite}
                                alt={'add course'}
                                w={{ base: 4, md: 'inherit' }}
                                h={{ base: 4, md: 'inherit' }}
                              />
                              <Text> Създай курс </Text>
                            </Stack>
                          </Button>
                        )}
                      </Stack>

                      <TabPanels pt={2}>
                        <TabPanel p={0}>
                          {allCourses && allCourses?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10} mt={8}>
                              {allCourses.map((el, index) => (
                                <DashboardCourseCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
                                  activeTab={activeTab}
                                  isGrid={true}
                                />
                              ))}
                            </SimpleGrid>
                          ) : (
                            <NoData />
                          )}
                        </TabPanel>
                        <TabPanel p={0}>
                          {activeCourses && activeCourses?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10} mt={8}>
                              {activeCourses.map((el, index) => (
                                <DashboardCourseCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
                                  activeTab={activeTab}
                                  isGrid={true}
                                />
                              ))}
                            </SimpleGrid>
                          ) : (
                            <NoData />
                          )}
                        </TabPanel>
                        <TabPanel p={0}>
                          {inactiveCourses && inactiveCourses?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10} mt={8}>
                              {inactiveCourses.map((el, index) => (
                                <DashboardCourseCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
                                  activeTab={activeTab}
                                  isGrid={true}
                                />
                              ))}
                            </SimpleGrid>
                          ) : (
                            <NoData />
                          )}
                        </TabPanel>
                        <TabPanel p={0}>
                          {draftCourses && draftCourses?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10} mt={8}>
                              {draftCourses.map((el, index) => (
                                <DashboardCourseCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
                                  activeTab={activeTab}
                                  isGrid={true}
                                />
                              ))}
                            </SimpleGrid>
                          ) : (
                            <NoData />
                          )}
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </Stack>
                ) : (
                  <CreateCourseComponent
                    setShowCreateCourse={setShowCreateCourse}
                    showCreateCourse={showCreateCourse}
                    addDateActive={addDateActive}
                    setAddDateActive={setAddDateActive}
                  />
                )}
              </TabPanel>

              <TabPanel p={{ base: 0, lg: 2 }}>
                {userData?.verified === false ? (
                  <UnverifiedComponent />
                ) : userData?.beingVerified === false ? (
                  <AwaitingVerificationComponent />
                ) : isCourseOpened ? (
                  <OpenedCourseComponent
                    isPrivateLesson={true}
                    showCreateCourse={showCreateLesson}
                    setShowCreateCourse={setShowCreateCourse}
                    showCreateLesson={showCreateLesson}
                    setShowCreateLesson={setShowCreateLesson}
                    addDateActive={addDateActive}
                    setAddDateActive={setAddDateActive}
                    setIsCourseOpened={setIsCourseOpened}
                    course={openedCourse}
                  />
                ) : !showCreateLesson ? (
                  <Stack spacing={10} mt={4}>
                    <Heading
                      flex={1}
                      as="h1"
                      fontSize={{ base: 24, lg: 32, xl: 30 }}
                      textAlign="start"
                      color={'grey.600'}>
                      Моите частни уроци
                    </Heading>

                    <Tabs variant="unstyled" w={'full'}>
                      <Stack
                        direction={{ base: 'column', md: 'row' }}
                        justify={'space-between'}
                        w={'full'}
                        align={'center'}>
                        <TabList gap={8}>
                          {courseTypes.map((type, index) => (
                            <Tab
                              key={index}
                              _selected={{ color: 'white', bg: 'purple.500' }}
                              rounded={'md'}
                              color={'purple.500'}
                              border={'dashed 2px'}
                              borderColor={'purple.500'}
                              fontSize={{ base: 14, md: 16 }}
                              px={{ base: '6px', lg: 4 }}
                              py={{ base: 1, lg: 2 }}>
                              {type?.label}
                            </Tab>
                          ))}
                        </TabList>

                        {allLessons && allLessons.length && (
                          <Button
                            color={'white'}
                            bg={'purple.500'}
                            fontSize={{ base: 14, md: 16, lg: 18, '2xl': 20 }}
                            fontWeight={{ base: 500, lg: 700 }}
                            _hover={{ bg: 'purple.500', opacity: 0.9 }}
                            w={{ base: 'fit-content', md: 'fit-content', lg: '20%' }}
                            minW={'fit-content'}
                            py={{ base: 2, lg: 2 }}
                            mt={{ base: 3, md: 0 }}
                            alignSelf={{ base: 'end', md: 'inherit' }}
                            h={{ base: 'fit-content', lg: 'full' }}
                            onClick={showLessonForm}>
                            <Stack direction={'row'} align={'center'} spacing={2}>
                              <Img
                                src={addWhite}
                                alt={'add lesson'}
                                w={{ base: 4, md: 'inherit' }}
                                h={{ base: 4, md: 'inherit' }}
                              />
                              <Text> Създай урок </Text>
                            </Stack>
                          </Button>
                        )}
                      </Stack>

                      <TabPanels pt={2}>
                        <TabPanel p={0}>
                          {allLessons && allLessons?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10} mt={8}>
                              {allLessons.map((el, index) => (
                                <DashboardLessonCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
                                  activeTab={activeTab}
                                  isGrid={true}
                                />
                              ))}
                            </SimpleGrid>
                          ) : (
                            <NoData isPrivateLesson={true} />
                          )}
                        </TabPanel>
                        <TabPanel p={0}>
                          {activeLessons && activeLessons?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10} mt={8}>
                              {activeLessons.map((el, index) => (
                                <DashboardLessonCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
                                  activeTab={activeTab}
                                  isGrid={true}
                                />
                              ))}
                            </SimpleGrid>
                          ) : (
                            <NoData isPrivateLesson={true} />
                          )}
                        </TabPanel>
                        <TabPanel p={0}>
                          {inactiveLessons && inactiveLessons?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10} mt={8}>
                              {inactiveLessons.map((el, index) => (
                                <DashboardLessonCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
                                  activeTab={activeTab}
                                  isGrid={true}
                                />
                              ))}
                            </SimpleGrid>
                          ) : (
                            <NoData isPrivateLesson={true} />
                          )}
                        </TabPanel>
                        <TabPanel p={0}>
                          {draftLessons && draftLessons?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10} mt={8}>
                              {draftLessons.map((el, index) => (
                                <DashboardLessonCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
                                  activeTab={activeTab}
                                  isGrid={true}
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
                ) : (
                  <CreateLessonComponent
                    setShowCreateCourse={setShowCreateLesson}
                    showCreateCourse={showCreateLesson}
                    setAddDateActive={setAddDateActive}
                  />
                )}
              </TabPanel>

              <TabPanel p={{ base: 0, lg: 2 }}>
                <Stack spacing={10}>
                  {userData?.verified === false ? (
                    <UnverifiedComponent />
                  ) : userData?.beingVerified === false ? (
                    <AwaitingVerificationComponent />
                  ) : (
                    <Stack spacing={12}>
                      <Heading
                        flex={1}
                        as="h1"
                        fontSize={{ base: 24, lg: 32, xl: 30 }}
                        textAlign="start"
                        color={'grey.600'}>
                        Приходи
                      </Heading>

                      <TableContainer>
                        <Table variant="simple">
                          <Thead>
                            <Tr bg={'purple.500'}>
                              <Th color={'white'} fontWeight={700}>
                                Номер
                              </Th>
                              <Th color={'white'} fontWeight={700}>
                                Курс/урок
                              </Th>
                              <Th color={'white'} fontWeight={700}>
                                Дата
                              </Th>
                              <Th color={'white'} fontWeight={700}>
                                Сума
                              </Th>
                            </Tr>
                          </Thead>
                          {payments?.length ? (
                            <Tbody>
                              {currentData.map((el, index) => (
                                <Tr key={index}>
                                  <Td>
                                    <Text fontWeight={700}>{el?.number}</Text>
                                  </Td>
                                  <Td>
                                    <Text color={'grey.500'}>{el?.lesson}</Text>
                                  </Td>
                                  <Td>
                                    <Stack direction={{ base: 'row' }} color={'grey.500'}>
                                      <Text>{el?.date}</Text>
                                      <Text>{el?.time}</Text>
                                    </Stack>
                                  </Td>
                                  <Td>
                                    <Text color={'grey.500'}>{el?.amount} лв.</Text>
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                          ) : null}
                        </Table>

                        {!payments?.length && (
                          <Stack w={'full'} color={'grey.500'} justify={'center'} mt={20}>
                            <Text textAlign={'center'} w={'full'}>
                              Все още нямате получени приходи
                            </Text>
                          </Stack>
                        )}

                        <Flex justifyContent="end" mt={4}>
                          {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                              key={i}
                              border={'none'}
                              variant="outline"
                              onClick={() => handleClick(i + 1)}
                              colorScheme={currentPage === i + 1 ? 'blue' : 'gray'}>
                              {i + 1}
                            </Button>
                          ))}
                        </Flex>
                      </TableContainer>
                    </Stack>
                  )}
                </Stack>
              </TabPanel>
            </TabPanels>
          )}
        </Tabs>
      </Flex>
    </Stack>
  );
}
