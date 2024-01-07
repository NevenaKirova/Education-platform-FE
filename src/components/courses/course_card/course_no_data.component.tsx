import React from 'react';
import { Button, Heading, Image, Img, Stack, Text } from '@chakra-ui/react';
import { noData } from '../../../images';
import { add, addWhite } from '../../../icons';

export default function CourseNoData({
  setShowCreateCourse,
  setShowCreateLesson,
  setActiveTab,
  setIsPrivateLessonToCreate,
}: {
  setShowCreateCourse: any;
  setShowCreateLesson: any;
  setActiveTab: any;
  setIsPrivateLessonToCreate;
}) {
  return (
    <Stack direction={'column'}>
      <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
        Предстоящи курсове и уроци
      </Heading>

      <Stack direction={'column'} align={'center'} justify={'center'} spacing={6} h={'60vh'}>
        <Image src={noData} alt="No data" h={'35vh'} />
        <Text color={'grey.500'}>Нямате създадени курсове или уроци</Text>
        <Button
          size={{ base: 'md', lg: 'md' }}
          color={'white'}
          bg={'purple.500'}
          fontSize={{ base: 16, '2xl': 20 }}
          fontWeight={700}
          _hover={{ bg: 'purple.500', opacity: 0.9 }}
          w={'20%'}
          onClick={() => {
            setShowCreateCourse(true);
            setShowCreateLesson(false);
            setActiveTab(1);
            setIsPrivateLessonToCreate(false);
          }}>
          <Stack direction={'row'} align={'center'} spacing={2}>
            <Img src={addWhite} alt={'add course'} />
            <Text> Създай курс </Text>
          </Stack>
        </Button>

        <Button
          size={{ base: 'md', lg: 'md' }}
          color={'purple.500'}
          bg={'transparent'}
          fontSize={{ base: 16, '2xl': 20 }}
          fontWeight={700}
          _hover={{ bg: 'transparent' }}
          onClick={() => {
            setShowCreateCourse(false);
            setShowCreateLesson(true);
            setActiveTab(2);
            setIsPrivateLessonToCreate(true);
          }}>
          <Stack direction={'row'} align={'center'} spacing={2}>
            <Img src={add} alt={'аdd lesson'} />
            <Text> Създай частен урок </Text>
          </Stack>
        </Button>
      </Stack>
    </Stack>
  );
}
