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
import { avatar2 } from '../../../images';
import { message, edit, calendar, clock, link, trash, bottom, top, add } from '../../../icons/index';
import AddResourcesModal from '../modals/course_add_resources';

const CourseResources = ({ course }: { course: any }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

  const [openedCourse, setOpenedCourse] = useState(null);
  const [numberOfStudents, setNumberOfStudents] = useState(8);
  const [students, setStudents] = useState([]);
  const [themeToEdit, setThemeToEdit] = useState(null);
  const [showSelected, setShowSelected] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);

  const studentsToShow = useMemo(() => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
      ?.slice(0, numberOfStudents)
      .map((el: any, index: number) => (
        <GridItem key={index}>
          <Stack direction={'column'} align={'center'} spacing={2}>
            <Avatar size={{ base: 'sm', md: 'lg' }} src={avatar2} />
            <Stack direction={'row'} align={'center'} spacing={0}>
              <Text fontSize={14} fontWeight={600}>
                Стоян Иванов
              </Text>
              <Button bg={'transparent'} _hover={{ bg: 'transparent' }} p={0}>
                <Img src={message} w={5} h={5} />
              </Button>
            </Stack>
          </Stack>
        </GridItem>
      ));
  }, [students, numberOfStudents]);

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

  const openResourcesModal = (ev, themeId) => {
    ev.stopPropagation();
    setSelectedTheme(themeId);
    onModalOpen();
  };

  const getOpenedCourse = async () => {
    try {
      const res = await axiosInstance.get(`lessons/getCourseClassroomPage/${course.courseTerminId}`);
      setOpenedCourse(res.data);
      setStudents(res.data?.students);
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
  }, []);


  return (
    <>
      <Stack py={{ base: 0, lg: 2 }} spacing={12}>
        <Stack spacing={6}>
          <Stack w={'full'} direction={{ base: 'column', md: 'row' }}>
            <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
              Математика за 7 клас
            </Heading>

            <Button
              size={{ base: 'md', lg: 'md' }}
              color={'purple.500'}
              bg={'transparent'}
              fontSize={{ base: 16, '2xl': 20 }}
              fontWeight={700}
              _hover={{ bg: 'transparent' }}
              px={8}
              w={'fit-content'}>
              <Stack direction={'row'} align={'center'} spacing={2}>
                <Img src={edit} alt={'add course'} h={5} w={5} />
                <Text>Редактирай курса</Text>
              </Stack>
            </Button>
          </Stack>

          <Stack spacing={4}>
            <Stack direction={'row'} spacing={4} align={'center'}>
              <Img src={calendar} alt={'calendar icon'} w={5} h={5} />
              <Text color={'grey.500'}>
                {capitalizeMonth(format(new Date(course?.startDate), 'dd LLL yyyy', { locale: bg }))} -{' '}
                {course?.endDate && capitalizeMonth(format(new Date(course?.endDate), 'dd LLL yyyy', { locale: bg }))}
              </Text>
            </Stack>

            <Stack direction={'row'} spacing={4} align={'start'}>
              <Img src={clock} alt={'calendar icon'} w={5} h={5} mt={2} />
              <Stack spacing={1}>
                <Text color={'grey.500'}>{course?.courseDays}</Text>
                <Text color={'grey.500'}>{course?.courseHours}</Text>
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

          <Grid templateColumns={{ base: 'repeat(auto-fit, minmax(150px, 1fr))' }} gap={6} w={'full'}>
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
                  <AccordionButton>
                    <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'}>
                      {el?.title}
                    </Heading>

                    <Stack direction={'row'} mr={3} spacing={3}>
                      <Box
                        as={IconButton}
                        aria-label={'delete theme'}
                        size="xs"
                        bg={'none'}
                        _hover={{ bg: 'none' }}
                        disabled
                        icon={<Img src={add} w={5} onClick={ev => openResourcesModal(ev, el.themaID)} />}
                      />

                      <IconButton
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
                        aria-label={'delete theme'}
                        size="xs"
                        bg={'none'}
                        _hover={{ bg: 'none' }}
                        disabled
                        icon={<Img src={top} w={5} />}
                      />
                    ) : (
                      <Box
                        as={IconButton}
                        aria-label={'delete theme'}
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
                        {[1, 2, 3].map((el, index) => (
                          <Stack
                            key={index}
                            rounded={'md'}
                            bg={'purple.100'}
                            w={'full'}
                            p={4}
                            align={'center'}
                            justify={'space-between'}
                            direction={'row'}>
                            <Stack flex={1} align={'center'} direction={'row'} justify={'start'}>
                              <Img src={link} w={6} h={6} />
                              <Text color={'grey.600'} fontWeight={'700'}>
                                Линк към виртуална класна стая
                              </Text>
                            </Stack>

                            <Stack direction={'row'}>
                              <IconButton
                                aria-label={'edit theme'}
                                size="xs"
                                bg={'none'}
                                _hover={{ bg: 'none' }}
                                icon={<Img src={edit} w={5} />}
                              />

                              <Box
                                as={IconButton}
                                aria-label={'delete theme'}
                                size="xs"
                                bg={'none'}
                                _hover={{ bg: 'none' }}
                                disabled
                                icon={<Img src={trash} w={5} />}
                              />
                            </Stack>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </Stack>
      <EditCourseModal isOpen={isOpen} onClose={onClose} theme={themeToEdit} />
      <AddResourcesModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        showSelected={showSelected}
        setShowSelected={setShowSelected}
        theme={selectedTheme}
      />
    </>
  );
};

export default CourseResources;
