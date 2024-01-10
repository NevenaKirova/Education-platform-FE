import React from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';

import { Heading, Text, Stack, Image, HStack, Tag, IconButton, Img, Box } from '@chakra-ui/react';

import { user } from '../../../icons';

import { CourseType } from '../../../pages';

export default function CreatedCourseCard({ course }: { course: CourseType }) {
  const statuses = [
    { status: 'Active', name: 'активен', bg: 'green.status', colorText: 'green.statusText' },
    { status: 'Inactive', name: 'неактивен', bg: 'blue.status', colorText: 'blue.statusText' },
    { status: 'Draft', name: 'чернова', bg: 'red.status', colorText: 'red.statusText' },
  ];
  return (
    <Stack
      mt={8}
      py={6}
      w={'full'}
      transition={'transform .2s'}
      _hover={{ transform: 'scale(1.04)  perspective(1px)' }}>
      <Stack
        direction={'row'}
        as={ReactRouterLink}
        to={`/lessons/${course?.lessonID}`}
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
            maxH={'190px'}
            boxSize={'450px'}
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
            bg={statuses.find(el => el.status == course?.status)?.bg}
            color={statuses.find(el => el.status == course?.status)?.colorText}
            p={2}
            position={'absolute'}
            top={2}
            left={2}>
            <Text fontSize={12} fontWeight={600}>
              {statuses.find(el => el.status == course?.status)?.name}
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
                    <Box
                      as={IconButton}
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
            </Stack>

            <Stack direction={'column'} fontWeight={500}>
              <Text color={'grey.400'}>Следващ урок: </Text>
              <Text color={'grey.400'}>
                ({course?.numberOfTermins} {course?.numberOfTermins === 1 ? 'предстояща датa' : 'предстоящи дати'})
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
