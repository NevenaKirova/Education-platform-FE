import React, { useContext, useEffect, useState } from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';
import { format } from 'date-fns';

import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Avatar,
  Image,
  HStack,
  Tag,
  IconButton,
  Img,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';

import { heart, heartFull, user } from '../../../icons';
import { FaStar } from 'react-icons/fa';

import pages, { CourseType } from '../../../pages';
import AuthContext from '../../../context/AuthContext';
import { axiosInstance } from '../../../axios';
import { getResponseMessage } from '../../../helpers/response.util';
import { useSelector } from 'react-redux';
import { getStudentLiked } from '../../../store/selectors';
import { getLikedCourses } from '../../../store/features/student/studentFavourites/studentFavourites.async';
import { useAppDispatch } from '../../../store';

export default function CourseCard({
  course,
  onLoginOpen,
  setModalTabIndex,
  sort,
  page,
}: {
  course: CourseType;
  onLoginOpen?: any;
  setModalTabIndex?: any;
  sort?: string;
  page?: number;
}) {
  const dispatch = useAppDispatch();
  const { userData } = useContext(AuthContext);
  const toast = useToast();

  const [heartIcon, setHeartIcon] = useState(heart);
  const [isLiked, setIsLiked] = useState(false);

  const { likedCourses } = useSelector(getStudentLiked);

  useEffect(() => {
    const findCourse = likedCourses?.lessonResponses?.find(el => el?.lessonID === course?.lessonID);

    if (findCourse?.lessonID) setIsLiked(true);
  }, [likedCourses]);

  const addToFavourites = async ev => {
    ev.preventDefault();
    if (userData && userData.id) {
      try {
        await axiosInstance.get(`lessons/likeCourse/${course.lessonID}`);

        setHeartIcon(heartFull);
        setIsLiked(true);
      } catch (err) {
        toast({
          title: getResponseMessage(err),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } else {
      setModalTabIndex(1);
      onLoginOpen();
    }
  };

  const removeFromFavourites = async ev => {
    ev.preventDefault();
    if (userData && userData.id) {
      try {
        await axiosInstance.get(`lessons/dislikeCourse/${course.lessonID}`);
        setHeartIcon(heart);
        setIsLiked(false);

        if (sort && page) dispatch(getLikedCourses({ sort: sort, page: page }));
      } catch (err) {
        toast({
          title: getResponseMessage(err),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    } else {
      setModalTabIndex(1);
      onLoginOpen();
    }
  };
  return (
    <Stack
      h={'full'}
      py={6}
      w={'full'}
      transition={'transform .2s'}
      justify={'flex-start'}
      _hover={{ transform: 'scale(1.02)  perspective(1px)' }}>
      <Box
        as={ReactRouterLink}
        to={course?.privateLesson ? `/lessons/${course?.lessonID}` : `/courses/${course?.lessonID}`}
        maxW={{ base: 'full', md: '42vw', lg: '35vw', xl: '26vw', '2xl': '21vw' }}
        h={'full'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        rounded={'md'}
        p={6}
        boxShadow="custom"
        overflow={'hidden'}
        className={'cardBox'}>
        <Stack h={'full'} justify={'space-between'}>
          <Stack>
            <Box bg={'white'} mt={-6} mx={-6} pos={'relative'} rounded="lg">
              <Image
                src={
                  'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
                }
                alt="Course image"
                borderRadius={20}
                p={4}
              />
            </Box>
            <Stack
              direction={{ base: 'column' }}
              align={{ base: 'start', lg: 'start' }}
              justify={'space-between'}
              flexWrap={'wrap'}>
              <HStack align={'center'} flexWrap={'wrap'}>
                <Tag size={'sm'} variant="solid" bg={'purple.200'} p={2}>
                  <Text color={'purple.500'} fontSize={10} fontWeight={600}>
                    1 {course?.studentsUpperBound > 1 ? `- ${course?.studentsUpperBound} ученици` : 'ученик'}
                  </Text>
                </Tag>

                <Tag size={'sm'} variant="solid" bg={'purple.200'} p={2}>
                  <Text color={'purple.500'} fontSize={10} fontWeight={600}>
                    {course?.weekLength} седмици
                  </Text>
                </Tag>

                {course.grade && (
                  <Tag size={'sm'} variant="solid" bg={'purple.200'} p={2}>
                    <Text color={'purple.500'} fontSize={10} fontWeight={600}>
                      {course?.grade}
                    </Text>
                  </Tag>
                )}

                {course?.privateLesson === false && course?.numberOfStudents && (
                  <Tag size={'sm'} variant="solid" bg={'purple.200'} p={2}>
                    <Text as="span" color={'purple.500'} fontSize={10} fontWeight={600}>
                      {course?.numberOfStudents + '/' + course.studentsUpperBound}
                    </Text>
                    <IconButton
                      aria-label={'students'}
                      size="xs"
                      bg={'none'}
                      p={0}
                      _hover={{ bg: 'none' }}
                      h={'fit'}
                      icon={<Img src={user} w={4} h={3} />}
                    />
                  </Tag>
                )}
              </HStack>

              <HStack align={'center'} spacing={1}>
                <Box as="label" color={'gold'}>
                  <FaStar cursor={'pointer'} size={16} />
                </Box>
                <Text color={'grey.600'} fontSize={12}>
                  {course?.rating}
                </Text>

                <Text color={'grey.500'} fontSize={12}>
                  ({course?.numberOfReviews} отзива)
                </Text>
              </HStack>

              <Stack mt={6} direction={'column'} spacing={4} align={'start'}>
                <Heading color={'gray.700'} fontSize={{ base: 'lg', md: 'xl' }} textAlign={'start'}>
                  {course?.title}
                </Heading>
                <Stack
                  direction={'row'}
                  spacing={2}
                  align={'center'}
                  justify={'space-between'}
                  flexWrap={'wrap'}
                  w={'full'}>
                  <Stack direction={'row'} align={'center'}>
                    <Avatar
                      size={{ base: 'xs', md: 'sm' }}
                      src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
                    />
                    <Text color={'grey.500'}>
                      {course.teacherName} {course.teacherSurname}
                    </Text>
                  </Stack>

                  <Text color={'grey.500'}>
                    {course?.firstDate &&
                      course?.time &&
                      `${format(new Date(course?.firstDate), ' dd/MM/yyyy')} ${course?.time}ч`}
                  </Text>
                </Stack>
              </Stack>
            </Stack>
          </Stack>

          <Stack
            direction={'row'}
            spacing={2}
            mt={6}
            align={'center'}
            justify={'space-between'}
            flexWrap={'wrap'}
            w={'full'}>
            <Text color={'grey.600'} fontWeight={700} fontSize={{ base: 'lg', md: 'xl' }}>
              {course.price}лв{' '}
              <Text as={'span'} fontWeight={500} fontSize={16} color={'grey.500'}>
                / час
              </Text>
            </Text>

            <IconButton
              aria-label={'add to favorites'}
              size="xs"
              bg={'none'}
              _hover={{ bg: 'none' }}
              onMouseEnter={() => setHeartIcon(heartFull)}
              onMouseLeave={() => setHeartIcon(heart)}
              onClick={ev => (isLiked ? removeFromFavourites(ev) : addToFavourites(ev))}
              icon={<Img src={isLiked ? heartFull : heartIcon} w={5} h={5} />}
            />
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}
