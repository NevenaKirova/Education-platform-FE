import React, { useEffect, useState } from 'react';

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
  useToast,
} from '@chakra-ui/react';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';

import {
  createCourse,
  getCoursesActive,
  getCoursesAll,
  getCoursesInactive,
} from '../../../store/features/teacher/teacherCourses/teacherCourses.async';
import {addWhite, calendar, edit} from '../../../icons';
import DashboardCourseCard, { courseStatuses } from '../course_card/dashboard_card.component';
import CourseDateCard from '../course_card/course_dates_card_teacher.component';
import { axiosInstance } from '../../../axios';
import createToastMessage from '../../../utils/toast.util';
import { getResponseMessage } from '../../../helpers/response.util';

const OpenedCourseComponent = ({
  isPrivateLesson,
  setShowCreateCourse,
  showCreateCourse,
  addDateActive,
  setAddDateActive,
  setIsCourseOpened,
  course,
}: {
  isPrivateLesson: boolean;
  setShowCreateCourse: any;
  showCreateCourse: boolean;
  addDateActive: boolean;
  setAddDateActive: any;
  setIsCourseOpened: any;
  course: any;
}) => {
  const toast = useToast();

  const [showAddResources, setShowAddResources] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [dates, setDates] = useState([]);

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
            <BreadcrumbLink textDecoration={'none'}>{course?.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Stack spacing={10} mt={4}>
          <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
            Моите курсове
          </Heading>

          <Tabs variant="unstyled" onChange={index => setActiveTab(index)}>
            <Stack direction={'row'} justify={'space-between'} align={'center'}>
              <TabList gap={8} w={'full'}>
                <Tab
                  fontSize={{ base: 18, md: 20 }}
                  fontWeight={600}
                  color={'grey.500'}
                  maxW={'fit-content'}
                  _selected={{ color: 'purple.500', fontWeight: 700 }}>
                  <Text>Дати</Text>
                </Tab>
                <Tab
                  fontSize={{ base: 18, md: 20 }}
                  fontWeight={600}
                  color={'grey.500'}
                  maxW={'fit-content'}
                  _selected={{ color: 'purple.500', fontWeight: 700 }}>
                  <Text>Информация</Text>
                </Tab>
                <Tab
                  fontSize={{ base: 18, md: 20 }}
                  fontWeight={600}
                  color={'grey.500'}
                  maxW={'fit-content'}
                  _selected={{ color: 'purple.500', fontWeight: 700 }}>
                  <Text>Отзиви</Text>
                </Tab>
              </TabList>
              <TabIndicator mt="12" height="2.5px" bg="purple.500" />
              <Stack direction={'row'} spacing={4} w={'full'} justify={'end'}>
                {activeTab == 0 && (
                  <>
                    <Button
                      size={{ base: 'md', lg: 'md' }}
                      color={'purple.500'}
                      bg={'transparent'}
                      fontSize={{ base: 16, '2xl': 20 }}
                      fontWeight={700}
                      _hover={{ bg: 'transparent' }}>
                      <Stack direction={'row'} align={'center'}>
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
                      w={'fit-content'}>
                      <Stack direction={'row'} align={'center'} spacing={2}>
                        <Img src={addWhite} alt={'add course'} />
                        <Text>Добави дата</Text>
                      </Stack>
                    </Button>
                  </>
                )}

                {activeTab == 1 && (
                  <Button
                    size={{ base: 'md', lg: 'md' }}
                    color={'white'}
                    bg={'purple.500'}
                    fontSize={{ base: 16, '2xl': 20 }}
                    fontWeight={700}
                    _hover={{ bg: 'purple.500', opacity: 0.9 }}
                    px={8}
                    w={'fit-content'}>
                    <Stack direction={'row'} align={'center'} spacing={2}>
                      <Img src={edit} alt={'add course'} />
                      <Text>Редактирай</Text>
                    </Stack>
                  </Button>
                )}
              </Stack>
            </Stack>

            <TabPanels>
              <TabPanel>{[1, 2, 3]?.map((el, index) => <CourseDateCard key={index} course={el} />)}</TabPanel>
              <TabPanel>
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
              </TabPanel>
              <TabPanel></TabPanel>
              <TabPanel></TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default OpenedCourseComponent;
