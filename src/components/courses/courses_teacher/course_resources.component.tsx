import React, { useState, useMemo, useEffect } from 'react';

import { format } from 'date-fns';

import { bg } from 'date-fns/locale';

import {
  Stack,
  IconButton,
  Button,
  Text,
  Heading,
  Avatar,
  Img,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Grid,
  GridItem,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';

import { capitalizeMonth } from '../../../helpers/capitalizeMonth.util';
import { axiosInstance } from '../../../axios';
import { getResponseMessage } from '../../../helpers/response.util';
import EditCourseModal from '../modals/edit_course_theme';
import { message, edit, calendar, clock, link, trash, bottom, top, add, video, fileUpload } from '../../../icons';
import AddResourcesModal from '../modals/course_add_resources';
import CourseAddHomework from './course_add_homework';
import { NavLink as ReactRouterLink } from 'react-router-dom';
import SubmissionsComponent from './course_submissions.component';
import PageLoader from '../../../utils/loader.component';
import { downloadFile } from '../../../helpers/downloadFile';

const CourseResources = ({
  date,
  course,
  setShowCreateCourse,
  setShowCreateLesson,
  setActiveTab,
  setEditInfo,
  setShowAddResources,
  setDateSelected,
  setOpenedTheme,
  openedTheme,
  isEditHomework,
  setIsEditHomework,
  showSubmissions,
  setShowSubmissions,
  isPrivateLesson,
}: {
  date: any;
  course: any;
  setShowCreateCourse?: any;
  setShowCreateLesson?: any;
  setActiveTab?: any;
  setEditInfo?: any;
  setShowAddResources: any;
  setDateSelected: any;
  setOpenedTheme: any;
  openedTheme: any;
  isEditHomework?: any;
  setIsEditHomework?: any;
  showSubmissions?: any;
  setShowSubmissions?: any;
  isPrivateLesson?: boolean;
}) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const [openedCourse, setOpenedCourse] = useState(null);
  const [numberOfStudents, setNumberOfStudents] = useState(8);
  const [students, setStudents] = useState([]);
  const [themeToEdit, setThemeToEdit] = useState(null);
  const [showSelected, setShowSelected] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [assignmentId, setAssignmentId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [meeting, setMeeting] = useState(null);

  const studentsToShow = useMemo(() => {
    if (!students?.length) {
      return (
        <Text color={'grey.400'} textAlign="center" fontSize={{ base: 14, lg: 16 }}>
          Няма записани ученици
        </Text>
      );
    }
    return students?.slice(0, numberOfStudents).map((el: any, index: number) => (
      <GridItem key={index}>
        <Stack direction={'column'} align={'center'} spacing={2} maxW={'fit-content'}>
          <Avatar size={{ base: 'sm', md: 'lg' }} src={el?.imageLocation} />
          <Stack direction={'row'} align={'center'} spacing={2}>
            <Text fontSize={14} fontWeight={600}>
              {el?.name} {el?.surname}
            </Text>
            <Box as={ReactRouterLink} to={`/messages/${el.id}`} bg={'transparent'} _hover={{ bg: 'transparent' }} p={0}>
              <Img src={message} w={5} h={5} />
            </Box>
          </Stack>
        </Stack>
      </GridItem>
    ));
  }, [students, numberOfStudents]);

  const downloadResource = async themeId => {
    try {
      const res = await axiosInstance.get(`lessons/getResourceFile/${themeId}`, {
        responseType: 'blob',
      });
      downloadFile(res);
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
  const showAll = () => {
    setNumberOfStudents(students.length);
  };

  const showLess = () => {
    setNumberOfStudents(8);
  };

  const editTheme = (ev, theme) => {
    ev.stopPropagation();
    setThemeToEdit(theme);
    onOpen();
  };

  const openResourcesModal = (ev, themeId, temeTitle) => {
    ev.stopPropagation();
    setSelectedTheme({ id: themeId, title: temeTitle });
    onModalOpen();
  };

  const getOpenedCourse = async () => {
    try {
      setIsLoading(true);
      const id = isPrivateLesson ? date?.lessonTerminId : date?.courseTerminId;
      const path = course.privateLesson ? 'getLessonClassroomPage' : 'getCourseClassroomPage';
      const res = await axiosInstance.get(`lessons/${path}/${id}`);
      setOpenedCourse(res.data);
      setStudents(res.data?.students);
      setIsLoading(false);
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
  };

  const getVirtualClassroomLink = async () => {
    try {
      setIsLoading(true);
      const id = isPrivateLesson ? date?.lessonTerminId : date?.courseTerminId;
      const res = await axiosInstance.get(`lessons/generateMeeting/${id}`);
      setMeeting(res.data);
      setIsLoading(false);
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
  };

  const handleDeleteResource = async (ev, type, themeId) => {
    ev.preventDefault();
    let resourceUrl;
    let resourceData;

    if (type === 'video') {
      resourceUrl = 'addLinkToRecording';
      resourceData = { linkToRecording: '' };
    }

    if (type === 'presentation') {
      resourceUrl = 'deleteResource';
      resourceData = null;
    }

    if (type == 'assignment') {
      const assignment = openedCourse?.themas.find(el => el.themaID == themeId)?.assignmentId;
      try {
        await axiosInstance.post(`lessons/deleteAssignmentFile/${assignment}`);
        await axiosInstance.post(`lessons/deleteAssignment/${assignment}`);

        getOpenedCourse();
      } catch (err) {
        toast({
          title: getResponseMessage(err),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }

      return;
    }

    try {
      resourceData
        ? await axiosInstance.post(`lessons/${resourceUrl}/${themeId}`, resourceData)
        : await axiosInstance.post(`lessons/${resourceUrl}/${themeId}`);

      getOpenedCourse();
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
    getOpenedCourse();
    getVirtualClassroomLink();
  }, []);

  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <>
      {showSubmissions ? (
        <SubmissionsComponent course={course} assignmentId={assignmentId} />
      ) : openedTheme?.id ? (
        <Stack py={{ base: 0, lg: 2 }} spacing={12}>
          <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
            {course?.title}
          </Heading>
          <CourseAddHomework
            setOpenedTheme={setOpenedTheme}
            openedTheme={openedTheme}
            isEditHomework={isEditHomework}
            setIsEditHomework={setIsEditHomework}
            getOpenedCourse={getOpenedCourse}
          />
        </Stack>
      ) : (
        <Stack py={{ base: 0, lg: 2 }} spacing={12}>
          <Stack spacing={6}>
            <Stack w={'full'} direction={{ base: 'column', md: 'row' }}>
              <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
                {course?.title}
              </Heading>

              <Box
                as={Button}
                size={{ base: 'md', lg: 'md' }}
                color={'purple.500'}
                bg={'transparent'}
                fontSize={{ base: 16, '2xl': 20 }}
                fontWeight={700}
                _hover={{ bg: 'transparent' }}
                px={8}
                w={'fit-content'}
                onClick={() => {
                  setActiveTab(1);
                  setDateSelected({});
                  course?.privateLesson ? setShowCreateLesson(true) : setShowCreateCourse(true);
                  setEditInfo(true);
                  setShowAddResources(false);
                }}>
                <Stack direction={'row'} align={'center'} spacing={2}>
                  <Img src={edit} alt={'edit date'} h={5} w={5} />
                  <Text>Редактирай {course?.privateLesson ? 'урока' : 'курса'} </Text>
                </Stack>
              </Box>
            </Stack>

            <Stack spacing={4}>
              <Stack direction={'row'} spacing={4} align={'center'}>
                <Img src={calendar} alt={'calendar icon'} w={5} h={5} />
                {isPrivateLesson ? (
                  <Text color={'grey.500'}>
                    {openedCourse &&
                      capitalizeMonth(format(new Date(openedCourse?.startDate), 'dd LLL yyyy', { locale: bg }))}
                  </Text>
                ) : (
                  <Text color={'grey.500'}>
                    {capitalizeMonth(format(new Date(date?.startDate), 'dd LLL yyyy', { locale: bg }))} -{' '}
                    {date?.endDate && capitalizeMonth(format(new Date(date?.endDate), 'dd LLL yyyy', { locale: bg }))}
                  </Text>
                )}
              </Stack>

              <Stack direction={'row'} spacing={4} align={'start'}>
                <Img src={clock} alt={'calendar icon'} w={5} h={5} mt={2} />
                <Stack spacing={1}>
                  {isPrivateLesson ? (
                    <>
                      <Text color={'grey.500'}>{openedCourse?.courseHours}</Text>
                    </>
                  ) : (
                    <>
                      <Text color={'grey.500'}>{date?.courseDays}</Text>
                      <Text color={'grey.500'}>{date?.courseHours}</Text>
                    </>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Stack spacing={6} justify={'start'}>
            <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'}>
              Записани ученици{' '}
              <Text as={'span'} color={'grey.400'} fontWeight={400}>
                {' '}
                ({openedCourse?.enrolledStudents})
              </Text>
            </Heading>

            <Grid templateColumns={{ base: 'repeat(auto-fill, minmax(150px, 1fr))' }} gap={6} w={'full'}>
              {studentsToShow}
            </Grid>

            {studentsToShow.length && (
              <Button
                fontSize={{ base: 16, lg: 18 }}
                fontWeight={700}
                bg={'transparent'}
                color="purple.500"
                _hover={{ bg: 'transparent' }}
                width={'fit-content'}
                onClick={studentsToShow.length < students.length ? showAll : showLess}>
                {students.length > studentsToShow.length ? 'Виж всички ' : 'Виж по-малко'}
              </Button>
            )}
          </Stack>

          <Stack spacing={6} justify={'start'}>
            <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'}>
              Описание на курса
            </Heading>

            <Text color={'grey.600'}>{openedCourse?.lessonDescription}</Text>
          </Stack>

          <Stack spacing={6} justify={'start'}>
            <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'}>
              Виртуална класна стая
            </Heading>

            <Stack
              as={Button}
              rounded={'md'}
              bg={'purple.100'}
              w={'full'}
              p={6}
              align={'center'}
              justify={'start'}
              direction={'row'}
              spacing={4}>
              <Img src={link} w={6} h={6} />
              <Text color={'grey.600'} fontWeight={'700'}>
                Линк към виртуална класна стая
              </Text>
            </Stack>
          </Stack>

          <Accordion allowMultiple>
            {openedCourse?.themas.map((el, index) => (
              <AccordionItem key={index} py={4} borderTop={0} borderBottom={'1px solid'} borderColor={'grey.100'}>
                {({ isExpanded }) => (
                  <>
                    <AccordionButton as={Stack} direction={'row'}>
                      <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'}>
                        {el?.title}
                      </Heading>

                      <Stack direction={'row'} mr={3} spacing={3}>
                        <Box
                          as={IconButton}
                          aria-label={'add theme'}
                          size="xs"
                          bg={'none'}
                          _hover={{ bg: 'none' }}
                          disabled
                          icon={<Img src={add} w={5} onClick={ev => openResourcesModal(ev, el?.themaID, el?.title)} />}
                        />

                        <Box
                          as={IconButton}
                          aria-label={'edit theme'}
                          size="xs"
                          bg={'none'}
                          _hover={{ bg: 'none' }}
                          icon={<Img src={edit} w={5} onClick={ev => editTheme(ev, el)} />}
                        />
                      </Stack>
                      {isExpanded ? (
                        <Box
                          as={IconButton}
                          aria-label={'collapse theme'}
                          size="xs"
                          bg={'none'}
                          _hover={{ bg: 'none' }}
                          disabled
                          icon={<Img src={top} w={5} />}
                        />
                      ) : (
                        <Box
                          as={IconButton}
                          aria-label={'expand theme'}
                          size="xs"
                          bg={'none'}
                          _hover={{ bg: 'none' }}
                          disabled
                          icon={<Img src={bottom} w={5} />}
                        />
                      )}
                    </AccordionButton>

                    <AccordionPanel py={4}>
                      <Stack spacing={6}>
                        <Text color={'grey.600'}> {el?.description}</Text>

                        <Stack spacing={4}>
                          {el?.linkToRecording && (
                            <Stack
                              as={ReactRouterLink}
                              to={el?.linkToRecording}
                              target={'_blank'}
                              rounded={'md'}
                              bg={'purple.100'}
                              w={'full'}
                              p={4}
                              align={'center'}
                              justify={'space-between'}
                              direction={'row'}>
                              <Stack flex={1} align={'center'} direction={'row'} justify={'start'}>
                                <Img src={video} w={6} h={6} />
                                <Text color={'grey.600'} fontWeight={'700'}>
                                  Видеозапис
                                </Text>
                              </Stack>

                              <Box
                                as={IconButton}
                                aria-label={'delete theme'}
                                size="xs"
                                bg={'none'}
                                _hover={{ bg: 'none' }}
                                disabled
                                icon={<Img src={trash} w={5} />}
                                onClick={ev => handleDeleteResource(ev, 'video', el?.themaID)}
                              />
                            </Stack>
                          )}

                          {el?.presentation && (
                            <Stack
                              rounded={'md'}
                              bg={'purple.100'}
                              w={'full'}
                              align={'center'}
                              justify={'space-between'}
                              direction={'row'}
                              pr={4}>
                              <Stack
                                p={4}
                                h={'full'}
                                as={Button}
                                onClick={() => downloadResource(el.themaID)}
                                flex={1}
                                align={'center'}
                                direction={'row'}
                                justify={'start'}
                                bg={'purple.100'}
                                _hover={{ bg: 'purple.100' }}>
                                <Img src={video} w={6} h={6} />
                                <Text color={'grey.600'} fontWeight={'700'}>
                                  {el?.presentation}
                                </Text>
                              </Stack>

                              <Box
                                as={IconButton}
                                aria-label={'delete theme'}
                                size="xs"
                                bg={'none'}
                                _hover={{ bg: 'none' }}
                                disabled
                                icon={<Img src={trash} w={5} />}
                                onClick={ev => handleDeleteResource(ev, 'presentation', el?.themaID)}
                              />
                            </Stack>
                          )}

                          {el?.assignmentId && (
                            <>
                              <Stack
                                rounded={'md'}
                                bg={'#E3F7FF'}
                                w={'full'}
                                p={4}
                                align={'center'}
                                justify={'space-between'}
                                direction={'row'}>
                                <Stack flex={1} align={'center'} direction={'row'} justify={'start'}>
                                  <Img src={fileUpload} w={6} h={6} />
                                  <Text color={'grey.600'} fontWeight={'700'}>
                                    Задача за домашна работа
                                  </Text>
                                </Stack>

                                <Stack direction={'row'} spacing={4}>
                                  <Box
                                    as={IconButton}
                                    aria-label={'edit assignment'}
                                    size="xs"
                                    bg={'none'}
                                    _hover={{ bg: 'none' }}
                                    onClick={() => {
                                      setOpenedTheme({
                                        id: el?.themaID,
                                        title: el?.title,
                                        assignmentId: el?.assignmentId,
                                      }),
                                        setIsEditHomework(true);
                                    }}
                                    icon={<Img src={edit} w={5} />}
                                  />
                                </Stack>

                                <Box
                                  as={IconButton}
                                  aria-label={'delete assignment'}
                                  size="xs"
                                  bg={'none'}
                                  _hover={{ bg: 'none' }}
                                  disabled
                                  icon={<Img src={trash} w={5} />}
                                  onClick={ev => handleDeleteResource(ev, 'assignment', el?.themaID)}
                                />
                              </Stack>

                              <Stack direction={'row'} align={'center'} justify={'space-between'} w={'full'}>
                                <Text color={'grey.500'}> 0/ {el?.studentSolutions} предадени</Text>

                                <Button
                                  size={{ base: 'md', lg: 'md' }}
                                  color={'purple.500'}
                                  bg={'transparent'}
                                  fontSize={{ base: 16, '2xl': 20 }}
                                  fontWeight={700}
                                  _hover={{ bg: 'transparent', opacity: 0.9 }}
                                  w={'20%'}
                                  pr={0}
                                  onClick={() => {
                                    setShowSubmissions(true);
                                    setAssignmentId(el?.assignmentId);
                                  }}>
                                  Виж предаванията
                                </Button>
                              </Stack>
                            </>
                          )}
                        </Stack>
                      </Stack>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        </Stack>
      )}

      <EditCourseModal isOpen={isOpen} onClose={onClose} theme={themeToEdit} getOpenedCourse={getOpenedCourse} />
      <AddResourcesModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        showSelected={showSelected}
        setShowSelected={setShowSelected}
        theme={selectedTheme}
        setOpenedTheme={setOpenedTheme}
        getOpenedCourse={getOpenedCourse}
      />
    </>
  );
};

export default CourseResources;
