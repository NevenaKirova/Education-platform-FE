import React, { useEffect, useState } from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

import {
  Stack,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Tabs,
  TabList,
  Tab,
  Button,
  Img,
  Text,
  TabPanels,
  TabPanel,
  TabIndicator,
  Center,
  useToast,
} from '@chakra-ui/react';

import CourseDateCard from '../course_card/course_dates_card_teacher.component';
import { axiosInstance } from '../../../axios';
import { getResponseMessage } from '../../../helpers/response.util';
import CourseResources from './course_resources.component';
import { capitalizeMonth } from '../../../helpers/capitalizeMonth.util';
import CourseAddDate from './course_add_date';
import CreateCourseComponent from './create_course.component';
import { addWhite, calendar, edit, add } from '../../../icons';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

const OpenedCourseComponent = ({
  isPrivateLesson,
  showCreateCourse,
  setShowCreateCourse,
  addDateActive,
  setAddDateActive,
  setIsCourseOpened,
  course,
}: {
  isPrivateLesson: boolean;
  showCreateCourse: boolean;
  setShowCreateCourse: any;
  addDateActive: boolean;
  setAddDateActive: any;
  setIsCourseOpened: any;
  course: any;
}) => {
  const toast = useToast();

  const [showAddResources, setShowAddResources] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [dates, setDates] = useState([]);
  const [courseInfo, setCourseInfo] = useState([]);
  const [courseReviews, setCourseReviews] = useState([]);
  const [dateSelected, setDateSelected] = useState({});
  const [showAddDate, setShowAddDate] = useState(false);
  const [editInfo, setEditInfo] = useState(false);

  const getCourseDates = async course => {
    if (course.lessonID) {
      try {
        const res: any[] = await axiosInstance.get(`/lessons/getCourseDates/${course.lessonID}`);

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
  };

  const getCourseInformation = async () => {
    try {
      const res = await axiosInstance.get(`lessons/getCourseInformation/${course?.lessonID}`);
      setCourseInfo(res.data);
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

  const getCourseReviews = async () => {
    try {
      const res = await axiosInstance.post(`lessons/getReviews`, { id: course.lessonID, sort: '', page: 1 });
      setCourseReviews(res.data);
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
    getCourseDates(course);
  }, [course.lessonID]);

  return (
    <Stack w={{ base: 'full' }} spacing={10}>
      <Stack spacing={8} w={'full'}>
        <Breadcrumb fontSize={{ base: 14, lg: 18 }} cursor={'default'}>
          <BreadcrumbItem _hover={{ textDecoration: 'none', cursor: 'default' }} cursor={'default'}>
            <BreadcrumbLink
              textDecoration={'none'}
              cursor={'default'}
              onClick={() => {
                setShowCreateCourse(false);
                setAddDateActive(false);
                setIsCourseOpened(false);
              }}>
              {isPrivateLesson ? 'Моите частни уроци' : 'Моите курсове'}
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem color={'purple.500'} _hover={{ textDecoration: 'none' }} cursor={'default'}>
            <BreadcrumbLink
              textDecoration={'none'}
              onClick={() => {
                setShowAddResources(false);
                setDateSelected({});
                setShowAddDate(false);
              }}>
              {course?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>

          {dateSelected?.courseTerminId && (
            <BreadcrumbItem color={'purple.500'} _hover={{ textDecoration: 'none' }} cursor={'default'}>
              <BreadcrumbLink textDecoration={'none'}>
                {capitalizeMonth(format(new Date(dateSelected?.startDate), 'dd LLL yyyy', { locale: bg }))} -{' '}
                {dateSelected?.endDate &&
                  capitalizeMonth(format(new Date(dateSelected?.endDate), 'dd LLL yyyy', { locale: bg }))}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
        </Breadcrumb>

        {showAddResources ? (
          <CourseResources course={dateSelected} />
        ) : showAddDate ? (
          <CourseAddDate
            studentsUpperBound={course?.studentsUpperBound}
            courseLength={course?.length}
            setShowAddResources={setShowAddResources}
            setShowAddDate={setShowAddDate}
            courseId={course?.lessonID}
          />
        ) : (
          <Stack spacing={10} mt={4}>
            <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
              {course?.title}{' '}
              {course?.status === 'Draft' && (
                <Text as={'span'} color={'red'}>
                  (Чернова)
                </Text>
              )}
            </Heading>

            <Tabs variant="unstyled" index={activeTab} onChange={index => setActiveTab(index)}>
              <Stack direction={'row'} justify={'space-between'} align={'center'}>
                <TabList gap={8} w={'full'}>
                  <Tab
                    fontSize={{ base: 18, md: 20 }}
                    fontWeight={600}
                    color={'grey.500'}
                    maxW={'fit-content'}
                    pl={0}
                    _selected={{ color: 'purple.500', fontWeight: 700 }}>
                    <Text>Дати</Text>
                  </Tab>
                  <Tab
                    fontSize={{ base: 18, md: 20 }}
                    fontWeight={600}
                    color={'grey.500'}
                    maxW={'fit-content'}
                    _selected={{ color: 'purple.500', fontWeight: 700 }}
                    onClick={getCourseInformation}>
                    <Text>Информация</Text>
                  </Tab>
                  <Tab
                    fontSize={{ base: 18, md: 20 }}
                    fontWeight={600}
                    color={'grey.500'}
                    maxW={'fit-content'}
                    _selected={{ color: 'purple.500', fontWeight: 700 }}
                    onClick={getCourseReviews}>
                    <Text>Отзиви</Text>
                  </Tab>
                </TabList>
                <TabIndicator mt="12" height="2.5px" bg="purple.500" />
                <Stack direction={'row'} spacing={4} w={'full'} justify={'end'}>
                  {activeTab == 0 ? (
                    course?.status === 'Draft' ? (
                      <>
                        <Button
                          size={{ base: 'md', lg: 'md' }}
                          color={'purple.500'}
                          bg={'transparent'}
                          fontSize={{ base: 16, '2xl': 20 }}
                          fontWeight={700}
                          _hover={{ bg: 'transparent' }}
                          px={8}
                          w={'fit-content'}
                          onClick={() => {
                            setShowCreateCourse(true);
                            setActiveTab(1);
                            setEditInfo(true);
                          }}>
                          <Stack direction={'row'} align={'center'} spacing={2}>
                            <Img src={edit} alt={'add course'} h={5} w={5} />
                            <Text>Редактирай</Text>
                          </Stack>
                        </Button>

                        <Button
                          size={{ base: 'md', lg: 'md' }}
                          color={'purple.500'}
                          bg={'transparent'}
                          fontSize={{ base: 16, '2xl': 20 }}
                          fontWeight={700}
                          _hover={{ bg: 'transparent' }}
                          px={8}
                          w={'fit-content'}
                          onClick={() => {
                            setShowAddDate(true);
                          }}>
                          <Stack direction={'row'} align={'center'} spacing={2}>
                            <Img src={add} alt={'add course'} />
                            <Text>Добави дата</Text>
                          </Stack>
                        </Button>

                        <Button
                          isDisabled={dates.length ? false : true}
                          size={{ base: 'md', lg: 'md' }}
                          color={'white'}
                          bg={'purple.500'}
                          fontSize={{ base: 16, '2xl': 20 }}
                          fontWeight={700}
                          _hover={{ bg: 'purple.500', opacity: dates.length ? 0.9 : 0.4 }}
                          px={8}
                          w={'fit-content'}
                          onClick={() => {
                            setShowAddDate(true);
                          }}>
                          <Text>Публикувай</Text>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size={{ base: 'md', lg: 'md' }}
                          color={'purple.500'}
                          bg={'transparent'}
                          fontSize={{ base: 16, '2xl': 20 }}
                          fontWeight={700}
                          _hover={{ bg: 'transparent' }}>
                          <Stack as={ReactRouterLink} to={'/calendar'} direction={'row'} align={'center'}>
                            <Img src={calendar} alt={'calendar icon'} />
                            <Text> Отвори календара </Text>
                          </Stack>
                        </Button>

                        <Button
                          size={{ base: 'md', lg: 'md' }}
                          color={'white'}
                          bg={'purple.500'}
                          fontSize={{ base: 16, '2xl': 20 }}
                          fontWeight={700}
                          _hover={{ bg: 'purple.500', opacity: 0.9 }}
                          px={8}
                          w={'fit-content'}
                          onClick={() => {
                            setShowAddDate(true);
                          }}>
                          <Stack direction={'row'} align={'center'} spacing={2}>
                            <Img src={addWhite} alt={'add course'} />
                            <Text>Добави дата</Text>
                          </Stack>
                        </Button>
                      </>
                    )
                  ) : null}

                  {activeTab == 1 ? (
                    course?.status === 'Draft' ? (
                      <>
                        <Button
                          size={{ base: 'md', lg: 'md' }}
                          color={'purple.500'}
                          bg={'transparent'}
                          fontSize={{ base: 16, '2xl': 20 }}
                          fontWeight={700}
                          _hover={{ bg: 'transparent' }}
                          px={8}
                          w={'fit-content'}
                          onClick={() => {
                            setShowCreateCourse(true);
                            setActiveTab(1);
                            setEditInfo(true);
                          }}>
                          <Stack direction={'row'} align={'center'} spacing={2}>
                            <Img src={edit} alt={'add course'} h={5} w={5} />
                            <Text>Редактирай</Text>
                          </Stack>
                        </Button>

                        <Button
                          size={{ base: 'md', lg: 'md' }}
                          color={'white'}
                          bg={'purple.500'}
                          fontSize={{ base: 16, '2xl': 20 }}
                          fontWeight={700}
                          _hover={{ bg: 'purple.500', opacity: 0.9 }}
                          px={8}
                          w={'fit-content'}
                          onClick={() => {
                            setShowAddDate(true);
                          }}>
                          <Text>Публикувай</Text>
                        </Button>
                      </>
                    ) : (
                      <Button
                        size={{ base: 'md', lg: 'md' }}
                        color={'white'}
                        bg={'purple.500'}
                        fontSize={{ base: 16, '2xl': 20 }}
                        fontWeight={700}
                        _hover={{ bg: 'purple.500', opacity: 0.9 }}
                        px={8}
                        w={'fit-content'}
                        onClick={() => {
                          setShowCreateCourse(true);
                          setEditInfo(true);
                        }}>
                        <Stack direction={'row'} align={'center'} spacing={2}>
                          <Img src={edit} alt={'add course'} h={5} w={5} />
                          <Text>Редактирай</Text>
                        </Stack>
                      </Button>
                    )
                  ) : null}
                </Stack>
              </Stack>

              <TabPanels>
                <TabPanel px={0}>
                  {dates.length ? (
                    dates?.map((el, index) => (
                      <CourseDateCard
                        key={index}
                        course={el}
                        setShowAddResources={setShowAddResources}
                        setDateSelected={setDateSelected}
                      />
                    ))
                  ) : (
                    <Center h={'50vh'}>
                      <Text color={'grey.400'}> Нямате добавени дати</Text>
                    </Center>
                  )}
                </TabPanel>
                <TabPanel px={0}>
                  {editInfo ? (
                    <CreateCourseComponent
                      isPrivateLesson={false}
                      setShowCreateCourse={setShowCreateCourse}
                      showCreateCourse={showCreateCourse}
                      addDateActive={addDateActive}
                      setAddDateActive={setAddDateActive}
                      isEdit={true}
                    />
                  ) : (
                    <Stack rounded={'md'} p={6} mt={8} direction={'column'} spacing={8} bg={'purple.100'}>
                      <Stack direction={'column'} spacing={4}>
                        <Text color={'purple.500'} fontWeight={700} fontSize={18}>
                          Заглавие
                        </Text>
                        <Text color={'grey.500'} fontSize={18}>
                          Математика за 7 клас
                        </Text>
                      </Stack>

                      <Stack direction={'column'} spacing={4}>
                        <Text color={'purple.500'} fontWeight={700} fontSize={18}>
                          Предмет
                        </Text>
                        <Text color={'grey.500'} fontSize={18}>
                          Математика за 7 клас
                        </Text>
                      </Stack>
                      <Stack direction={'column'} spacing={4}>
                        <Text color={'purple.500'} fontWeight={700} fontSize={18}>
                          Клас
                        </Text>
                        <Text color={'grey.500'} fontSize={18}>
                          Математика за 7 клас
                        </Text>
                      </Stack>
                      <Stack direction={'column'} spacing={4}>
                        <Text color={'purple.500'} fontWeight={700} fontSize={18}>
                          Описание на курса
                        </Text>
                        <Text color={'grey.500'} fontSize={18}>
                          Математика за 7 клас
                        </Text>
                      </Stack>
                      <Stack direction={'column'} spacing={4}>
                        <Text color={'purple.500'} fontWeight={700} fontSize={18}>
                          Теми в курса
                        </Text>
                        <Text color={'grey.500'} fontSize={18}>
                          Математика за 7 клас
                        </Text>
                      </Stack>
                      <Stack direction={'column'} spacing={4}>
                        <Text color={'purple.500'} fontWeight={700} fontSize={18}>
                          Дължина на урока
                        </Text>
                        <Text color={'grey.500'} fontSize={18}>
                          Математика за 7 клас
                        </Text>
                      </Stack>
                      <Stack direction={'column'} spacing={4}>
                        <Text color={'purple.500'} fontWeight={700} fontSize={18}>
                          Брой ученици
                        </Text>
                        <Text color={'grey.500'} fontSize={18}>
                          Математика за 7 клас
                        </Text>
                      </Stack>
                      <Stack direction={'column'} spacing={4}>
                        <Text color={'purple.500'} fontWeight={700} fontSize={18}>
                          Продължителност
                        </Text>
                        <Text color={'grey.500'} fontSize={18}>
                          Математика за 7 клас
                        </Text>
                      </Stack>
                      <Stack direction={'column'} spacing={4}>
                        <Text color={'purple.500'} fontWeight={700} fontSize={18}>
                          Уроци седмично
                        </Text>
                        <Text color={'grey.500'} fontSize={18}>
                          Математика за 7 клас
                        </Text>
                      </Stack>
                      <Stack direction={'column'} spacing={4}>
                        <Text color={'purple.500'} fontWeight={700} fontSize={18}>
                          Цена на курса
                        </Text>
                        <Text color={'grey.500'} fontSize={18}>
                          Математика за 7 клас
                        </Text>
                      </Stack>
                      <Stack direction={'column'} spacing={4}>
                        <Text color={'purple.500'} fontWeight={700} fontSize={18}>
                          Дати на провеждане
                        </Text>
                        <Text color={'grey.500'} fontSize={18}>
                          Математика за 7 клас
                        </Text>
                      </Stack>
                    </Stack>
                  )}
                </TabPanel>
                <TabPanel></TabPanel>
                <TabPanel></TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default OpenedCourseComponent;
