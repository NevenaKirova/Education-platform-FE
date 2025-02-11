import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
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
import { useSelector } from 'react-redux';
import { getTeacherCourses } from '../../store/selectors';
import {
  getCoursesActive,
  getCoursesAll,
  getCoursesDraft,
  getCoursesInactive,
  getUpcomingCourses,
} from '../../store/features/teacher/teacherCourses/teacherCourses.async';
import OpenedCourseComponent from '../../components/courses/courses_teacher/opened_course.component';
export default function DashboardPage() {
  const { user, userData } = useContext(AuthContext);
  const dispatch = useAppDispatch();

  if (!user) return <Navigate to={'/'} replace />;

  const { upcomingCourses, allCourses, activeCourses, inactiveCourses, draftCourses, isLoading } =
    useSelector(getTeacherCourses);

  const courseTypes = ['Всички', 'Активни', 'Неактивни', 'Чернови'];

  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [addDateActive, setAddDateActive] = useState(false);
  const [isCourseOpened, setIsCourseOpened] = useState(false);
  const [openedCourse, setOpenedCourse] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const showCourseForm = () => {
    setShowCreateCourse(true);
  };

  const getCourseTypes = () => {
    dispatch(getCoursesAll());
    dispatch(getCoursesActive());
    dispatch(getCoursesInactive());
    dispatch(getCoursesDraft());
  };

  const NoData = () => {
    return (
      <Center h={'50vh'}>
        <Stack justify={'center'} align={'center'} spacing={6}>
          <Image src={noneToShow} alt="Profile Verification" h={'40vh'} />
          <Text color={'grey.400'}>Нямате създадени курсове</Text>
          <Button
            size={{ base: 'md', lg: 'md' }}
            color={'white'}
            w={'full'}
            bg={'purple.500'}
            fontSize={{ base: 16, '2xl': 20 }}
            fontWeight={700}
            _hover={{ bg: 'purple.500', opacity: 0.9 }}
            onClick={showCourseForm}>
            <Stack direction={'row'} align={'center'} spacing={2}>
              <Img src={addWhite} alt={'add course'} />
              <Text> Създай курс </Text>
            </Stack>
          </Button>
        </Stack>
      </Center>
    );
  };

  useEffect(() => {
    dispatch(getUpcomingCourses());
    getCourseTypes();
  }, []);

  return (
    <Stack
      spacing={{ base: 16, md: 24 }}
      py={{ base: 0, lg: 10 }}
      px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
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
          <TabList>
            <Tab
              fontSize={{ base: 18, md: 20 }}
              fontWeight={600}
              color={'grey.500'}
              maxW={'fit-content'}
              _selected={{ color: 'purple.500', fontWeight: 700 }}>
              <Text>Начало</Text>
            </Tab>
            <Tab
              fontSize={{ base: 18, md: 20 }}
              fontWeight={600}
              color={'grey.500'}
              maxW={'fit-content'}
              _selected={{ color: 'purple.500', fontWeight: 700 }}
              onClick={() => {
                setShowCreateCourse(false);
                setAddDateActive(false);
              }}>
              <Text>Моите курсове</Text>
            </Tab>
            <Tab
              fontSize={{ base: 18, md: 20 }}
              fontWeight={600}
              color={'grey.500'}
              maxW={'fit-content'}
              _selected={{ color: 'purple.500', fontWeight: 700 }}>
              <Text>Моите частни уроци</Text>
            </Tab>

            <Tab
              fontSize={{ base: 18, md: 20 }}
              fontWeight={600}
              color={'grey.500'}
              maxW={'fit-content'}
              _selected={{ color: 'purple.500', fontWeight: 700 }}>
              <Text>Приходи</Text>
            </Tab>
          </TabList>

          {isLoading ? (
            <PageLoader isLoading={isLoading} />
          ) : (
            <TabPanels pt={4}>
              <TabPanel p={{ base: 2, lg: 4 }}>
                <Stack spacing={10} mt={4}>
                  {userData?.verified && upcomingCourses && (
                    <Stack>
                      <Stack direction={'row'} align={'center'} justify={'space-between'}>
                        <Heading
                          flex={1}
                          as="h1"
                          fontSize={{ base: 24, lg: 32, xl: 30 }}
                          textAlign="start"
                          color={'grey.600'}>
                          Предстоящи курсове и уроци
                        </Heading>

                        <Button
                          size={{ base: 'md', lg: 'md' }}
                          color={'purple.500'}
                          bg={'transparent'}
                          fontSize={{ base: 16, '2xl': 20 }}
                          fontWeight={700}
                          _hover={{ bg: 'transparent' }}>
                          <Stack direction={'row'} align={'center'}>
                            <Img src={calendar} alt={'calendar icon'} />
                            <Text> Отворете календара </Text>
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
                          />
                        ))}
                      </Stack>
                    </Stack>
                  )}

                  {userData?.verified === false && <UnverifiedComponent />}

                  {/*{userData?.beingVerified === false && <AwaitingVerificationComponent />}*/}

                  {upcomingCourses && !upcomingCourses?.length && <CourseNoData />}
                </Stack>
              </TabPanel>

              <TabPanel p={{ base: 2, lg: 4 }}>
                {isCourseOpened ? (
                  <OpenedCourseComponent
                    isPrivateLesson={false}
                    setShowCreateCourse={setShowCreateCourse}
                    showCreateCourse={showCreateCourse}
                    addDateActive={addDateActive}
                    setAddDateActive={setAddDateActive}
                    setIsCourseOpened={setIsCourseOpened}
                    course={openedCourse}
                  />
                ) : !showCreateCourse && !addDateActive ? (
                  <Stack spacing={10} mt={4}>
                    <Heading
                      flex={1}
                      as="h1"
                      fontSize={{ base: 24, lg: 32, xl: 30 }}
                      textAlign="start"
                      color={'grey.600'}>
                      Моите курсове
                    </Heading>

                    <Tabs variant="unstyled" w={'full'}>
                      <Stack direction={'row'} justify={'space-between'} align={'center'}>
                        <TabList gap={8}>
                          {courseTypes.map((type, index) => (
                            <Tab
                              key={index}
                              _selected={{ color: 'white', bg: 'purple.500' }}
                              rounded={'md'}
                              color={'purple.500'}
                              border={'dashed 2px'}
                              borderColor={'purple.500'}>
                              {type}
                            </Tab>
                          ))}
                        </TabList>

                        {allCourses && allCourses.length && (
                          <Button
                            size={{ base: 'md', lg: 'md' }}
                            color={'white'}
                            bg={'purple.500'}
                            fontSize={{ base: 16, '2xl': 20 }}
                            fontWeight={700}
                            _hover={{ bg: 'purple.500', opacity: 0.9 }}
                            w={'20%'}
                            onClick={showCourseForm}>
                            <Stack direction={'row'} align={'center'} spacing={2}>
                              <Img src={addWhite} alt={'add course'} />
                              <Text> Създай курс </Text>
                            </Stack>
                          </Button>
                        )}
                      </Stack>

                      <TabPanels>
                        <TabPanel>
                          {allCourses && allCourses?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10} mt={8}>
                              {allCourses.map((el, index) => (
                                <DashboardCourseCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
                                />
                              ))}
                            </SimpleGrid>
                          ) : (
                            <NoData />
                          )}
                        </TabPanel>
                        <TabPanel>
                          {activeCourses && allCourses?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={20} mt={8}>
                              {activeCourses.map((el, index) => (
                                <DashboardCourseCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
                                />
                              ))}
                            </SimpleGrid>
                          ) : (
                            <NoData />
                          )}
                        </TabPanel>
                        <TabPanel>
                          {inactiveCourses && allCourses?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={20} mt={8}>
                              {inactiveCourses.map((el, index) => (
                                <DashboardCourseCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
                                />
                              ))}
                            </SimpleGrid>
                          ) : (
                            <NoData />
                          )}
                        </TabPanel>
                        <TabPanel>
                          {draftCourses && allCourses?.length ? (
                            <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={20} mt={8}>
                              {draftCourses.map((el, index) => (
                                <DashboardCourseCard
                                  key={index}
                                  course={el}
                                  setIsCourseOpened={setIsCourseOpened}
                                  setOpenedCourse={setOpenedCourse}
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
                    isPrivateLesson={false}
                    setShowCreateCourse={setShowCreateCourse}
                    showCreateCourse={showCreateCourse}
                    addDateActive={addDateActive}
                    setAddDateActive={setAddDateActive}
                  />
                )}
              </TabPanel>
            </TabPanels>
          )}
        </Tabs>
      </Flex>
    </Stack>
  );
}
