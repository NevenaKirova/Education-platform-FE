import { Avatar, Stack, Text } from '@chakra-ui/react';
import { Rating } from '../testimonials/testimonial_card.component';
import { BiDislike, BiLike } from 'react-icons/all';
import React from 'react';

export default function ReviewsSection(reviews, numberOfReviewsShown) {
  return reviews?.slice(0, numberOfReviewsShown).map((el: any, index: number) => (
    <Stack key={index} w={'full'} justify={'space-between'} align={'start'} direction={'row'}>
      <Stack spacing={6} align={{ base: 'center', md: 'start' }}>
        <Stack
          spacing={4}
          direction={{ base: 'column', lg: 'row' }}
          align={{ base: 'start', lg: 'center' }}
          justify={'space-between'}>
          <Stack flex={1} direction={'row'} spacing={4} align={'center'}>
            <Avatar size="sm" name={`${el.studentsName} ${el.studentsSurname}`} src="https://bit.ly/dan-abramov" />
            <Text color={'grey.600'}>
              {el.studentName} {el.studentSurname}
            </Text>
            <Rating rating={el.rating} />
          </Stack>

          <Text color={'grey.400'} w={'fit-content'}>
            {el.date}
          </Text>
        </Stack>

        <Stack maxW={'80%'} spacing={6}>
          <Text textAlign={'start'}>{el.message}</Text>

          {/*<Stack direction={'row'}>*/}
          {/*  <Button*/}
          {/*    bg={'transparent'}*/}
          {/*    _hover={{ bg: 'transparent', transform: 'scale(1.04)' }}*/}
          {/*    transition={'transform .2s'}>*/}
          {/*    <Stack spacing={4} direction={'row'}>*/}
          {/*      <Icon as={BiLike} />*/}
          {/*      <Text>Да</Text>*/}
          {/*    </Stack>*/}
          {/*  </Button>*/}

          {/*  <Button*/}
          {/*    bg={'transparent'}*/}
          {/*    _hover={{ bg: 'transparent', transform: 'scale(1.04 )' }}*/}
          {/*    transition={'transform .2s'}>*/}
          {/*    <Stack spacing={4} direction={'row'}>*/}
          {/*      <Icon as={BiDislike} />*/}
          {/*      <Text>Не</Text>*/}
          {/*    </Stack>*/}
          {/*  </Button>*/}
          {/*</Stack>*/}
        </Stack>
      </Stack>
    </Stack>
  ));
}
