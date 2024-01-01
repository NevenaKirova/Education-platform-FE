import React from 'react';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';

import { Heading, Text, Stack, Image, Tag, Img, Box, Button } from '@chakra-ui/react';

import { CourseType } from '../../../pages';
import { capitalizeMonth } from '../../../helpers/capitalizeMonth.util';
import { group } from '../../../icons';

export const courseStatuses = [
  { status: 'STARTED', name: 'Започнал', bg: 'green.status', colorText: 'green.statusText' },
  { status: 'NOT_STARTED', name: 'Незапочнал', bg: 'orange.status', colorText: 'orange.statusText' },
  { status: 'FINISHED', name: 'Приключил', bg: 'blue.status', colorText: 'blue.statusText' },
];

export default function CourseDateCard({
  course,
  isGrid = false,
  setShowAddResources,
  setDateSelected,
}: {
  course: CourseType;
  isGrid?: boolean;
  setShowAddResources?: any;
  setDateSelected?: any;
}) {
  return (
    <Box
      as={Button}
      py={isGrid ? 0 : 6}
      px={0}
      w={'full'}
      transition={'transform .2s'}
      _hover={{ transform: 'scale(1.02)  perspective(1px)', bg: 'transparent' }}
      h={'full'}
      bg={'transparent'}
      onClick={() => {
        setShowAddResources(true);
        setDateSelected(course);
      }}>
      <Stack
        direction={'row'}
        maxH={'230px'}
        w={'full'}
        bg={'white'}
        rounded={'md'}
        boxShadow="custom"
        overflow={'hidden'}
        p={4}
        gap={8}
        position={'relative'}>
        <Image
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
          bg={courseStatuses.find(el => el.status == course?.lessonStatus)?.bg}
          color={courseStatuses.find(el => el.status == course?.lessonStatus)?.colorText}
          p={2}
          position={'absolute'}
          top={4}
          right={4}>
          <Text fontSize={12} fontWeight={600}>
            {courseStatuses.find(el => el.status == course?.lessonStatus)?.name}
          </Text>
        </Tag>

        <Stack flex={1}>
          <Stack direction={'column'} h={'full'} justify={'space-between'}>
            <Stack direction={'column'} spacing={4} align={'start'}>
              <Heading color={'gray.700'} fontSize={{ base: 'lg', md: 'xl' }} textAlign={'start'}>
                {course?.startDate &&
                  capitalizeMonth(format(new Date(course?.startDate), 'dd LLL yyyy', { locale: bg }))}{' '}
                - {course?.endDate && capitalizeMonth(format(new Date(course?.endDate), 'dd LLL yyyy', { locale: bg }))}
              </Heading>

              <Heading color={'gray.700'} fontSize={{ base: 'lg', md: 'xl' }} textAlign={'start'}>
                {course?.courseHours}
              </Heading>

              <Heading color={'gray.500'} fontSize={{ base: 'lg', md: 'xl' }} textAlign={'start'} fontWeight={400}>
                {course?.courseDays}
              </Heading>
            </Stack>

            <Stack direction={'row'} align={'center'}>
              <Img w={6} h={6} src={group}></Img>
              <Text color={'purple.500'} fontSize={16}>
                {course?.numberOfStudents} {`/ ${course?.studentsUpperBound}  ученици`}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
