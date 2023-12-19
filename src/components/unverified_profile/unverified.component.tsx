import React from 'react';

import { Flex, Stack, Image, Heading, Button } from '@chakra-ui/react';
import { profileVerification } from '../../images';

export default function UnverifiedComponent() {
  return (
    <Flex align={'start'} justify={'space-between'} h={'70vh'}>
      <Stack spacing={6} w={'50%'}>
        <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
          Необходима е верификация на профила
        </Heading>
        <Heading
          flex={1}
          as="h1"
          fontSize={{ base: 24, lg: 32, xl: 20 }}
          fontWeight={400}
          textAlign="start"
          color={'grey.500'}>
          Профилът Ви все още не е завършен. Моля изпълнете стъпките за верификация преди да започнете да преподавате в
          MyClassroom
        </Heading>

        <Button
          type={'submit'}
          size={{ base: 'md', lg: 'md' }}
          color={'white'}
          bg={'purple.500'}
          fontSize={{ base: 16, '2xl': 20 }}
          fontWeight={700}
          _hover={{ opacity: '0.9' }}
          w={'60%'}
          mt={6}>
          Към верификация
        </Button>
      </Stack>

      <Stack align={'end'} justify={'end'} h={'60vh'}>
        <Image src={profileVerification} alt="Profile Verification" h={'40vh'} />
      </Stack>
    </Flex>
  );
}
