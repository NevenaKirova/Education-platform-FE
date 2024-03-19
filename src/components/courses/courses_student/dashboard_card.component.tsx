import React from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

import { Heading, Text, Stack, Image, Tag, Img, Box, Button, Avatar } from '@chakra-ui/react';

import { CourseType } from '../../../pages';
import { capitalizeMonth } from '../../../helpers/capitalizeMonth.util';
import { calendar, clock } from '../../../icons';

import { addMinutesToString, daysArr } from '../courses_teacher/create_course.component';
import StarRating from '../../rating/starRating';

export const courseStatuses = [
  { status: 'Active', name: 'активен', bg: 'green.status', colorText: 'green.statusText' },
  { status: 'Upcoming', name: 'предстоящ', bg: 'orange.status', colorText: 'orange.statusText' },
  { status: 'Inactive', name: 'завършен', bg: 'blue.status', colorText: 'blue.statusText' },
];

export default function DashboardCourseCardStudent({
  course,
  isGrid = false,
  onOpen,
  setOpenModalWithCourse,
}: {
  course: CourseType;
  isGrid?: boolean;
  onOpen: any;
  setOpenModalWithCourse: any;
}) {
  const linkState = {
    isPrivateLesson: course?.privateLesson,
  };
  const hanldeOpenModal = ev => {
    ev.preventDefault();
    setOpenModalWithCourse(course);
    onOpen();
  };

  return (
    <Box
      as={ReactRouterLink}
      to={
        course.privateLesson
          ? `/course/${course?.lessonTerminId}`
          : `/course/${course?.courseTerminRequests[0]?.courseTerminId}`
      }
      state={linkState}
      py={isGrid ? 0 : 4}
      px={0}
      w={'full'}
      transition={'transform .2s'}
      _hover={{ transform: 'scale(1.02)  perspective(1px)', bg: 'transparent' }}
      h={'full'}
      bg={'transparent'}>
      <Stack
        direction={'row'}
        maxH={'230px'}
        w={'full'}
        bg={'white'}
        rounded={'md'}
        px={6}
        boxShadow="custom"
        overflow={'hidden'}
        p={4}
        gap={6}>
        <Stack position={'relative'}>
          <Image
            objectFit={'cover'}
            maxH={'190px'}
            boxSize={isGrid ? '300px' : '390px'}
            src={course?.urlToImage}
            alt="Course image"
            rounded={'lg'}
            p={0}
          />

          <Stack direction={'row'} position={'absolute'} top={2} left={2}>
            <Tag size={'sm'} variant="solid" bg={'purple.200'} color={'purple.500'} p={2}>
              <Text fontSize={12} fontWeight={600}>
                {course?.privateLesson ? 'частен урок' : 'групов курс'}
              </Text>
            </Tag>

            <Tag
              size={'sm'}
              variant="solid"
              bg={courseStatuses.find(el => el.status == course?.status)?.bg}
              color={courseStatuses.find(el => el.status == course?.status)?.colorText}
              p={2}>
              <Text fontSize={12} fontWeight={600}>
                {courseStatuses.find(el => el.status == course?.status)?.name}
              </Text>
            </Tag>
          </Stack>
        </Stack>

        <Stack flex={1} pr={2}>
          <Stack direction={'column'} h={'full'} justify={'space-between'}>
            <Stack direction={'column'} spacing={3} align={'start'}>
              <Heading color={'gray.700'} fontSize={{ base: 'lg', md: 'xl' }} textAlign={'start'}>
                {course?.title}
              </Heading>

              <Stack direction={'row'} align={'center'} justify={'start'} px={0}>
                <Img src={calendar} alt={'calendar icon'} w={5} h={5} />
                <Text fontSize={16} color={'grey.400'} whiteSpace={'nowrap'}>
                  {course?.privateLesson
                    ? capitalizeMonth(format(new Date(course?.firstDate), 'dd LLL yyyy', { locale: bg }))
                    : capitalizeMonth(
                        format(new Date(course?.courseTerminRequests?.[0]?.startDate), 'dd LLL yyyy', { locale: bg }),
                      )}{' '}
                </Text>

                {!course?.privateLesson && (
                  <>
                    {' '}
                    <Text fontSize={16} color={'grey.400'}>
                      -
                    </Text>
                    <Text fontSize={16} color={'grey.400'} whiteSpace={'nowrap'}>
                      {capitalizeMonth(
                        format(new Date(course?.courseTerminRequests?.[0]?.endDate), 'dd LLL yyyy', { locale: bg }),
                      )}{' '}
                    </Text>
                  </>
                )}
              </Stack>

              <Stack direction={'row'} align={'center'} px={0} flexWrap={'wrap'}>
                {!course?.privateLesson && (
                  <>
                    {' '}
                    <Img src={clock} alt={'calendar icon'} w={5} h={5} />
                    <Text fontSize={16} color={'grey.400'}>
                      {course?.courseTerminRequests?.[0]?.courseDaysNumbers
                        .map(day => daysArr[day - 1].short)
                        .toString()}
                    </Text>
                  </>
                )}

                {course?.privateLesson ? (
                  <Stack direction={'row'} align={'center'} px={0} flexWrap={'wrap'}>
                    <Img src={clock} alt={'calendar icon'} w={5} h={5} />
                    <Text fontSize={16} color={'grey.400'}>
                      {course?.time}
                    </Text>
                  </Stack>
                ) : (
                  <Stack direction={'row'} align={'center'} pl={2}>
                    <Text fontSize={16} color={'grey.400'}>
                      {course?.courseTerminRequests?.[0]?.courseHours}
                    </Text>
                    <Text fontSize={16} color={'grey.400'}>
                      -
                    </Text>
                    <Text fontSize={16} color={'grey.400'}>
                      {addMinutesToString(course?.courseTerminRequests?.[0]?.courseHours, course?.length)}
                    </Text>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Stack spacing={0}>
              <Stack w={'full'} align={'end'} justify={{ base: 'end', lg: 'start', '2xl': 'end' }}>
                <Button
                  size={{ base: 'md' }}
                  w={'fit-content'}
                  bg={'transparent'}
                  color={'grey.400'}
                  fontSize={16}
                  fontWeight={500}
                  px={0}
                  _hover={{ bg: 'transparent' }}
                  _focus={{ outline: 'none' }}
                  onClick={hanldeOpenModal}>
                  Оцени {course?.privateLesson ? 'урока' : 'курса'}
                </Button>
              </Stack>

              <Stack direction={'row'} align={'center'} fontWeight={500} flexWrap={'wrap'}>
                <Stack flex={1} direction={'row'} spacing={1} align={'center'} w={'fit-content'}>
                  <Avatar
                    size="xs"
                    name={`${course?.teacherName} ${course?.teacherSurname}`}
                    src={course?.teacherPicture}
                  />
                  <Text color={'grey.600'} w={'fit-content'} whiteSpace={'nowrap'}>
                    {course?.teacherName} {course?.teacherSurname}
                  </Text>
                </Stack>

                <StarRating rating={course.rating} />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
