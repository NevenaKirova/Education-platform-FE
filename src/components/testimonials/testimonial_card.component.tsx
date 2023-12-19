import React from 'react';
import { format } from 'date-fns';

import { Flex, Box, Avatar, Text, Stack, useColorModeValue } from '@chakra-ui/react';
import { BsStar, BsStarFill, BsStarHalf } from 'react-icons/bs';

const data = {
  imageURL:
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
  name: 'Wayfarer Classic',
  rating: 4.4,
  date: '24/05/2024',
  ratingText: 'Повече от доволна',
  comment:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
};

interface RatingProps {
  rating: number;
}

interface TestimonialProps {
  review: any;
  padding?: number;
}

export function Rating({ rating }: RatingProps) {
  return (
    <Box display="flex" alignItems="center">
      {Array(5)
        .fill('')
        .map((_, i) => {
          const roundedRating = Math.round(rating * 2) / 2;
          if (roundedRating - i >= 1) {
            return <BsStarFill key={i} style={{ marginLeft: '1' }} color={'gold'} />;
          }
          if (roundedRating - i === 0.5) {
            return <BsStarHalf key={i} style={{ marginLeft: '1' }} color={'gold'} />;
          }
          return <BsStar key={i} style={{ marginLeft: '1' }} color={'gold'} />;
        })}
    </Box>
  );
}

function TestimonialCard({ review, padding = 5 }: TestimonialProps) {
  return (
    <Flex p={padding} w="full" alignItems="center" justifyContent="center">
      <Box
        w={'full'}
        maxW={{ base: '70vw', sm: '50vw', md: '35vw', lg: '35vw', xl: '24vw', '2xl': '20vw' }}
        bg={useColorModeValue('white', 'gray.800')}
        p={8}
        rounded="lg"
        boxShadow="custom"
        position="relative">
        <Stack spacing={4} w={'full'} align={'start'}>
          <Stack
            direction={{ base: 'column', lg: 'row' }}
            align={{ base: 'start', lg: 'center' }}
            justify={'space-between'}
            spacing={{ base: 4, lg: 0 }}
            w={'full'}>
            <Stack direction={'row'} spacing={{ base: 6, lg: 4 }} align={'center'}>
              <Avatar size={'sm'} src={data?.imageURL} />
              <Text textAlign={{ base: 'left', lg: 'center' }} color={'grey.500'} fontSize={16}>
                {review?.studentName} {review?.studentSurname}
              </Text>
            </Stack>

            <Text color={'grey.500'} fontSize={14}>
              {format(new Date(review?.date), 'dd/MM/yyyy')}
            </Text>
          </Stack>
          <Rating rating={review?.rating} />
        </Stack>

        <Box pt={6} w={'full'}>
          <Flex mt="1" justifyContent="space-between" alignContent="center">
            <Text textAlign={'left'}>{review?.message}</Text>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}

export default TestimonialCard;
