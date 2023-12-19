import React from 'react';
import { Heading, Stack, Text, Img, Show } from '@chakra-ui/react';
import { teacherSteps, registration, teacherSpeaking, profileVerification } from '../../images';

export default function HowToSection() {
  return (
    <Stack
      spacing={{ base: 8, lg: 20 }}
      borderRadius={'0 150px '}
      px={{ base: 20, lg: 24, '2xl': '15vw' }}
      py={{ base: 8, lg: 20 }}>
      <Heading flex={1} as="h1" fontSize={{ base: 24, lg: 32, xl: 36 }} textAlign="center" color={'grey.600'}>
        <Text as={'span'} color={'purple.500'}>
          Как да станете {''}
        </Text>
        наш учител?
      </Heading>

      <Show below={'lg'}>
        <Stack spacing={14}>
          <Stack align={'center'}>
            <Img w={{ base: '100%', md: '50%' }} src={registration} />
            <Text fontSize={{ base: 16, md: 22 }} fontWeight={700}>
              Регистрация
            </Text>
            <Text fontSize={{ base: 16, md: 18 }} color={'grey.500'}>
              Създайте своя безплатен профил в платформата
            </Text>
          </Stack>
          <Stack align={'center'}>
            <Img w={{ base: '100%', md: '50%' }} src={profileVerification} />
            <Text fontSize={{ base: 18, md: 22 }} fontWeight={700}>
              Верификация
            </Text>
            <Text fontSize={{ base: 16, md: 18 }} color={'grey.500'}>
              Изпълнете три прости стъпки на верификация
            </Text>
          </Stack>
          <Stack align={'center'}>
            <Img w={{ base: '100%', md: '50%' }} src={teacherSpeaking} />
            <Text fontSize={{ base: 18, md: 22 }} fontWeight={700}>
              Готово!
            </Text>
            <Text fontSize={{ base: 16, md: 18 }} color={'grey.500'}>
              Вече сте един от учителите на MyClassroom
            </Text>
          </Stack>
        </Stack>
      </Show>
      <Show above={'lg'}>
        <Img src={teacherSteps} />
      </Show>
    </Stack>
  );
}
