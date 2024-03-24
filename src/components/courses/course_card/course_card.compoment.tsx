import React, { useContext, useEffect, useState } from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

import {
  Box,
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

import { heart, heartFull } from '../../../icons';
import { FaStar } from 'react-icons/fa';

import { CourseType } from '../../../pages';
import AuthContext from '../../../context/AuthContext';
import { axiosInstance } from '../../../axios';
import { getResponseMessage } from '../../../helpers/response.util';

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

  useEffect(() => {
    if (course?.likedByStudent) setIsLiked(true);
  }, []);

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
        maxW={{ base: 'full', sm: '58vw', md: '37vw', lg: '28vw', '2xl': '19vw' }}
        h={'full'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        rounded={'md'}
        p={{ base: 6, sm: 4, md: 6 }}
        boxShadow="custom"
        overflow={'hidden'}
        className={'cardBox'}>
        <Stack h={'full'} justify={'space-between'}>
          <Stack>
            <Box bg={'white'} mt={-6} mx={-6} pos={'relative'} rounded="lg">
              <Image src={course?.urlToImage} alt="Course image" borderRadius={20} p={4} />
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
                    {course?.privateLesson ? `${course?.length} мин` : `${course?.weekLength} седмици`}
                  </Text>
                </Tag>

                {course.grade && (
                  <Tag size={'sm'} variant="solid" bg={'purple.200'} p={2}>
                    <Text color={'purple.500'} fontSize={10} fontWeight={600}>
                      {course?.grade}
                    </Text>
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
                <Stack direction={'column'} spacing={4} align={'start'} flexWrap={'wrap'} w={'full'}>
                  <Stack direction={'row'} align={'center'}>
                    <Avatar size={{ base: 'xs', md: 'sm' }} src={course?.teacherResponse?.picture} />
                    <Text color={'grey.500'}>
                      {course.teacherName} {course.teacherSurname}
                    </Text>
                  </Stack>

                  <Stack direction={'row'} align={'center'}>
                    <Text color={'grey.500'} textAlign={'start'}>
                      Начална дата:
                    </Text>
                    <Text color={'grey.500'} textAlign={'end'}>
                      {course?.firstDate &&
                        course?.time &&
                        `${format(new Date(course?.firstDate), ' dd/MM/yyyy')} ${course?.time}ч`}
                    </Text>
                  </Stack>
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
