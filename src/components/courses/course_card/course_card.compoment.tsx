import React, { useState } from 'react';
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
} from '@chakra-ui/react';

import { BsStarFill } from 'react-icons/bs';
import { heart, heartFull, user } from '../../../icons';

import { CourseType } from '../../../pages';

export default function CourseCard({ course }: { course: CourseType }) {
  const [heartIcon, setHeartIcon] = useState(heart);

  return (
    <Center py={6} w={'full'} transition={'transform .2s'} _hover={{ transform: 'scale(1.04)  perspective(1px)' }}>
      <Box
        as={ReactRouterLink}
        to={`/lessons/${course?.lessonID}`}
        maxW={{ base: '70vw', sm: '39vw', md: '35vw', lg: '25vw', xl: '24vw', '2xl': '20vw' }}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        rounded={'md'}
        p={6}
        boxShadow="custom"
        overflow={'hidden'}>
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
          direction={{ base: 'column', lg: 'row' }}
          align={{ base: 'start', lg: 'center' }}
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
            <BsStarFill style={{ marginLeft: '1' }} color={'gold'} />
            <Text color={'grey.600'} fontSize={12}>
              {course?.rating}
            </Text>

            <Text color={'grey.500'} fontSize={12}>
              ({course?.numberOfReviews} отзива)
            </Text>
          </HStack>
        </Stack>

        <Stack mt={6} direction={'column'} spacing={4} align={'start'}>
          <Heading color={'gray.700'} fontSize={{ base: 'lg', md: 'xl' }} textAlign={'start'}>
            {course?.title}
          </Heading>
          <Stack direction={'row'} spacing={2} align={'center'} justify={'space-between'} flexWrap={'wrap'} w={'full'}>
            <Stack direction={'row'} align={'center'}>
              <Avatar size={{ base: 'xs', md: 'sm' }} src={'https://avatars0.githubusercontent.com/u/1164541?v=4'} />
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
              icon={<Img src={heartIcon} w={5} h={5} />}
            />
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
