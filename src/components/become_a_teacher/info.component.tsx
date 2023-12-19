import React from 'react';
import { Heading, Stack, Text } from '@chakra-ui/react';

export default function InfoSection() {
  return (
    <Stack
      bg={'purple.500'}
      spacing={8}
      borderRadius={{ base: '0 70px', lg: '0 150px ' }}
      px={{ base: 8, lg: 24, '2xl': '15vw' }}
      py={{ base: 8, lg: 16, xl: 20 }}>
      <Heading
        flex={1}
        as="h1"
        fontSize={{ base: 20, sm: '4.5vw', md: '2.5vw', xl: '2vw' }}
        textAlign="center"
        color={'white'}>
        Какво е MyClassroom?
      </Heading>

      <Text color={'white'} fontSize={{ base: 14, md: 16, xl: 18 }}>
        My Classroom е иновативна платформа за онлайн обучение на ученици и студенти в България. Напълно безплатно имате
        възможност да преподавате онлайн частни уроци и групови курсове на неограничен брой учащи от цялата страна по
        удобно за вас време. Работете от всяка една точка в страната с интернет достъп и планирайте сами работното си
        време. От My Classroom Ви даваме възможност да изградите своята кариера на онлайн преподавател и да зависите
        само и единствено от себе си.
      </Text>
    </Stack>
  );
}
