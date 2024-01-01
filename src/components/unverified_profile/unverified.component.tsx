import React, { useState } from 'react';

import { Stack, Image, Heading, Button } from '@chakra-ui/react';
import { profileVerification } from '../../images';
import VerifyProfileComponent from './verify_profile.component';

export default function UnverifiedComponent() {
  const [showForm, setShowForm] = useState(false);

  return showForm ? (
    <VerifyProfileComponent setShowForm={setShowForm} />
  ) : (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      align={'start'}
      justify={'space-between'}
      h={{ base: '75vh', lg: '70vh' }}
      mt={4}>
      <Stack spacing={6} w={{ base: 'full', lg: '50%' }}>
        <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 30 }} textAlign="start" color={'grey.600'}>
          Необходима е верификация на профила
        </Heading>
        <Heading
          flex={1}
          as="h1"
          fontSize={{ base: 18, lg: 32, xl: 20 }}
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
          mt={6}
          onClick={() => setShowForm(true)}>
          Към верификация
        </Button>
      </Stack>

      <Stack align={'end'} justify={'end'} h={'60vh'}>
        <Image src={profileVerification} alt="Profile Verification" h={'40vh'} />
      </Stack>
    </Stack>
  );
}
