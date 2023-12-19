import React from 'react';
import { Heading, Text, Button, Stack } from '@chakra-ui/react';

export default function PageNotFound() {
  return (
    <Stack textAlign="center" py={10} px={6} align={'center'} justify={'center'} flex={1}>
      <Heading
        display="inline-block"
        as="h2"
        fontSize={72}
        bgGradient="linear(to-r, purple.400, purple.500)"
        backgroundClip="text">
        404
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Страницата не е намерена
      </Text>
      <Text color={'gray.500'} mb={6}>
        За съжаление не можем да намерим страницата, която търсите.
      </Text>

      <Button colorScheme="teal" bgGradient="linear(to-r,  purple.400, purple.500)" color="white" variant="solid">
        Обратно в началната страница
      </Button>
    </Stack>
  );
}
