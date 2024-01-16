import React from 'react';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

import { Heading, Text, Stack, Image, HStack, Tag, Img, Box, Button } from '@chakra-ui/react';

import { CourseType } from '../../../pages';
import { capitalizeMonth } from '../../../helpers/capitalizeMonth.util';
import { user } from '../../../icons';

export const courseStatuses = [
  { status: 'Active', name: 'активен', bg: 'green.status', colorText: 'green.statusText' },
  { status: 'Inactive', name: 'неактивен', bg: 'blue.status', colorText: 'blue.statusText' },
  { status: 'Draft', name: 'чернова', bg: 'red.status', colorText: 'red.statusText' },
];
export default function DashboardCourseCard({
  course,
  isGrid = false,
  setIsCourseOpened,
  setOpenedCourse,
  activeTab,
  setActiveTab,
}: {
  course: CourseType;
  isGrid?: boolean;
  setIsCourseOpened?: any;
  setOpenedCourse?: any;
  activeTab: number;
  setActiveTab?: any;
}) {
  const handleOpenCourse = () => {
    if (activeTab == 0) course?.privateLesson ? setActiveTab(2) : setActiveTab(1);
    setIsCourseOpened(true);
    setOpenedCourse(course);
  };

  return (
    <Box
      as={Button}
      py={isGrid ? 0 : 4}
      px={0}
      w={'full'}
      transition={'transform .2s'}
      _hover={{ transform: 'scale(1.02)  perspective(1px)', bg: 'transparent' }}
      h={'full'}
      bg={'transparent'}
      onClick={() => handleOpenCourse()}>
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
        gap={8}>
        <Stack position={'relative'}>
          <Image
            objectFit={'cover'}
            maxH={'190px'}
            boxSize={isGrid ? '300px' : '440px'}
            src={
              'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            }
            alt="Course image"
            rounded={'lg'}
            p={0}
          />

          <Tag
            size={'sm'}
            variant="solid"
            bg={courseStatuses.find(el => el.status == course?.status)?.bg}
            color={courseStatuses.find(el => el.status == course?.status)?.colorText}
            p={2}
            position={'absolute'}
            top={2}
            left={2}>
            <Text fontSize={12} fontWeight={600}>
              {courseStatuses.find(el => el.status == course?.status)?.name}
            </Text>
          </Tag>
        </Stack>

        <Stack flex={1}>
          <Stack direction={'column'} h={'full'} justify={'space-between'}>
            <Stack direction={'column'} spacing={4} align={'start'}>
              <Heading color={'gray.700'} fontSize={{ base: 'lg', md: 'xl' }} textAlign={'start'}>
                {course?.title}
              </Heading>

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

                {course?.privateLesson && course.length && (
                  <Tag size={'sm'} variant="solid" bg={'purple.200'} p={2}>
                    <Text color={'purple.500'} fontSize={10} fontWeight={600}>
                      {course?.length} мин
                    </Text>
                  </Tag>
                )}

                {course?.privateLesson === false && course?.numberOfStudents && (
                  <Tag size={'sm'} variant="solid" bg={'purple.200'} p={2}>
                    <Text as="span" color={'purple.500'} fontSize={10} fontWeight={600}>
                      {course?.numberOfStudents + '/' + course.studentsUpperBound}
                    </Text>
                    <Img aria-label={'students'} w={4} h={3} bg={'none'} p={0} _hover={{ bg: 'none' }} src={user} />
                  </Tag>
                )}
              </HStack>
            </Stack>

            <Stack direction={'column'} align={'start'} fontWeight={500}>
              {course.firstDate && (
                <Text color={'grey.400'}>
                  Следващ урок: {capitalizeMonth(format(new Date(course?.firstDate), 'dd LLL yyyy', { locale: bg }))}{' '}
                  {course?.time} ч.
                </Text>
              )}
              <Text color={'grey.400'}>
                ({course?.numberOfTermins} {course?.numberOfTermins === 1 ? 'предстояща датa' : 'предстоящи дати'})
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
