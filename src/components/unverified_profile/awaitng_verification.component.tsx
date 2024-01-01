import React from 'react';

import { Flex, Stack, Image, Heading } from '@chakra-ui/react';
import { profileVerification } from '../../images';

export default function AwaitingVerificationComponent() {
  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      align={'start'}
      justify={'space-between'}
      h={{ base: '75vh', lg: '70vh' }}
      mt={4}>
      <Stack spacing={6} w={{ base: 'full', lg: '50%' }}>
        <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
          Верификацията на профила Ви е в процес на проверка.
        </Heading>
        <Heading
          flex={1}
          as="h1"
          fontSize={{ base: 18, lg: 32, xl: 20 }}
          fontWeight={400}
          textAlign="start"
          color={'grey.500'}>
          Благодарим Ви! Вашият профил се проверява от нашия екип. Ще получите потвърждение на имейл, когато профилът Ви
          е активен.
        </Heading>
      </Stack>

      <Stack align={'end'} justify={'end'} h={'60vh'}>
        <Image src={profileVerification} alt="Profile Verification" h={'40vh'} />
      </Stack>
    </Flex>
  );
}
