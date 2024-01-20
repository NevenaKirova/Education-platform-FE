import React, { useState, useEffect, useContext } from 'react';

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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';

import { axiosInstance } from '../../axios';
import { getResponseMessage } from '../../helpers/response.util';
import {
  message,
  edit,
  calendar,
  clock,
  link,
  trash,
  bottom,
  top,
  add,
  video,
  fileUpload,
  messageWhite,
  report,
  heartFull,
} from '../../icons';

import { Navigate, NavLink as ReactRouterLink, useLocation, useParams } from 'react-router-dom';

import AuthContext from '../../context/AuthContext';
import PageLoader from '../../utils/loader.component';
import { avatar2 } from '../../images';
import ReportModal from '../../components/courses/modals/report';

const StudentOpenedCoursePage = () => {
  const { user } = useContext(AuthContext);
  const { courseId } = useParams();
  const { state } = useLocation();

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const downloadResource = async themeId => {
    try {
      const res = await axiosInstance.get(`lessons/getResourceFile/${themeId}`, {
        responseType: 'blob',
      });
      console.log(res.data);
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

  const getOpenedCourse = async () => {
    try {
      const path = state.isPrivateLesson ? 'getLessonClassroomStudent' : 'getCourseClassroomStudent';
      setIsLoading(true);
      const res = await axiosInstance.get(`lessons/${path}/${courseId}`);
      setCourse(res.data);
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

  useEffect(() => {
    getOpenedCourse();
  }, []);

  if (!user) return <Navigate to={'/'} replace />;

  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <Stack
      spacing={{ base: 8 }}
      py={{ base: 0, lg: 10 }}
      px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
      mt={{ base: 36, lg: 40 }}
      align={'start'}
      justify={'start'}
      flex={1}
      w={'full'}>
      <Breadcrumb fontSize={{ base: 14, lg: 18 }} cursor={'default'}>
        <BreadcrumbItem _hover={{ textDecoration: 'none', cursor: 'default' }} cursor={'default'}>
          <BreadcrumbLink as={ReactRouterLink} to={`/my-dashboard`} textDecoration={'none'} cursor={'default'}>
            Моето табло
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem color={'purple.500'} _hover={{ textDecoration: 'none' }} cursor={'default'}>
          <BreadcrumbLink textDecoration={'none'}>{course?.lessonTitle}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Stack spacing={6} align={'start'} mb={6} w={'full'}>
        <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
          {course?.lessonTitle}
        </Heading>

        <Stack direction={'row'} spacing={4} align={'center'} flexWrap={'wrap'} w={'full'}>
          <Text color={'grey.400'}>Преподавател:</Text>
          <Stack direction={'row'} spacing={2} align={'center'}>
            <Avatar
              as={ReactRouterLink}
              to={`/teacher/${course?.teacherId}`}
              size="xs"
              name={course?.teacherName}
              src="https://bit.ly/dan-abramov"
            />
            <Text color={'grey.400'}>{course?.teacherName}</Text>
          </Stack>
        </Stack>

        <Button bg={'transparent'} color={'purple.500'} fontWeight={700} pl={0} _hover={{ bg: 'transparent' }}>
          <Stack align={'center'} direction={'row'}>
            <Img src={message} mr={2} w={6} h={6} />
            <Text> Свържете се с учителя</Text>
          </Stack>
        </Button>
      </Stack>

      <Stack spacing={14} w={'full'}>
        <Stack spacing={6} justify={'start'}>
          <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'}>
            Описание на курса
          </Heading>

          <Text color={'grey.600'} textAlign={'start'}>
            {course?.lessonDescription}
          </Text>
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
          {course?.themas?.map((el, index) => (
            <AccordionItem key={index} py={4} borderTop={0} borderBottom={'1px solid'} borderColor={'grey.100'}>
              {({ isExpanded }) => (
                <>
                  <AccordionButton as={Stack} direction={'row'}>
                    <Heading flex={1} fontSize={{ base: 18, lg: 24 }} textAlign="start" color={'grey.600'}>
                      {el?.title}
                    </Heading>

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
                      <Text color={'grey.600'} textAlign={'start'}>
                        {el?.description}
                      </Text>

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
                            direction={'row'}
                            justify={'start'}>
                            <Img src={video} w={6} h={6} />
                            <Text color={'grey.600'} fontWeight={'700'}>
                              Видеозапис
                            </Text>
                          </Stack>
                        )}

                        {el?.presentation && (
                          <Stack
                            as={Button}
                            to={el?.linkToRecording}
                            target={'_blank'}
                            rounded={'md'}
                            bg={'purple.100'}
                            w={'full'}
                            p={4}
                            align={'center'}
                            direction={'row'}
                            justify={'start'}
                            onClick={() => downloadResource(el.themaID)}>
                            <Img src={video} w={6} h={6} />
                            <Text color={'grey.600'} fontWeight={'700'}>
                              {el?.presentation}
                            </Text>
                          </Stack>
                        )}

                        {el?.assignment && (
                          <Stack
                            as={ReactRouterLink}
                            to={el?.linkToRecording}
                            target={'_blank'}
                            rounded={'md'}
                            bg={'#E3F7FF'}
                            w={'full'}
                            p={4}
                            align={'center'}
                            direction={'row'}
                            justify={'start'}>
                            <Img src={fileUpload} w={6} h={6} />
                            <Text color={'grey.600'} fontWeight={'700'}>
                              Задача за домашна работа
                            </Text>
                          </Stack>
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

      <Button
        color={'purple.500'}
        bg={'transparent'}
        _hover={{ bg: 'transparent' }}
        p={0}
        onClick={() => {
          onOpen();
        }}>
        <Stack align={'center'} direction={'row'}>
          <Img src={report} alt={'report icon'} w={5} h={5} />
          <Text fontSize={16} fontWeight={700}>
            Докладвай за нередност
          </Text>
        </Stack>
      </Button>

      <ReportModal isOpen={isOpen} onClose={onClose} />
    </Stack>
  );
};

export default StudentOpenedCoursePage;
