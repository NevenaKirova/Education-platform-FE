import React from 'react';
import { ReactElement } from 'react';
import { SimpleGrid, Text, Stack, Flex, Heading, Img } from '@chakra-ui/react';
import { YouTube, profile, book } from '../../icons';

interface FeatureProps {
  title: string;
  text: string;
  number: string;
  numberColor: string;
  icon: ReactElement;
  shadow?: boolean;
}

const Feature = ({ title, text, icon, number, numberColor, shadow = false }: FeatureProps) => {
  return (
    <Stack
      spacing={{ base: 8, lg: 12 }}
      textAlign={'left'}
      maxWidth={{ base: 'full', xl: '19vw' }}
      boxShadow={shadow ? 'custom' : ''}
      px={{ base: 6, lg: 10 }}
      py={{ base: 8, lg: 6 }}
      rounded={'lg'}>
      <Stack position={'relative'}>
        <Flex
          w={{ base: 16, lg: 24 }}
          h={{ base: 16, lg: 24 }}
          align={'center'}
          justify={'center'}
          color={'white'}
          rounded={'full'}
          mb={1}>
          {icon}
        </Flex>
        <Text
          color={numberColor}
          position={'absolute'}
          left={'2.8rem'}
          fontSize={{ base: 68, lg: '5.5vw' }}
          fontWeight={700}>
          {' '}
          {number}
        </Text>
      </Stack>

      <Stack spacing={6}>
        <Text fontWeight={700} fontSize={{ base: 20, lg: '1.3vw' }}>
          {title}
        </Text>
        <Text fontSize={{ base: 14, lg: 16 }} color={'gray.600'}>
          {text}
        </Text>
      </Stack>
    </Stack>
  );
};

export default function ReasonsSection() {
  return (
    <Stack py={4} px={{ base: 8, md: 20, lg: 20, '2xl': '15vw' }} spacing={8} align={'center'}>
      <Heading
        flex={1}
        as="h1"
        fontSize={{ base: '5.8vw', sm: '4.5vw', md: '3.8vw', xl: '2vw' }}
        textAlign="center"
        pb={8}>
        Защо{' '}
        <Text as="span" color={'purple.500'}>
          да изберете
        </Text>{' '}
        нашата <br /> платформа?
      </Heading>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        alignItems="center"
        justifyContent={'center'}
        spacing={{ base: 24, '2xl': 24 }}
        px={{ base: 2, lg: 0 }}>
        <Feature
          icon={<Img src={YouTube} w={'full'} />}
          title={'Учи от всякъде'}
          text={'Присъствай в твоите онлайн уроци от всяка една точка в страната с интернет достъп.'}
          number={'01'}
          numberColor={'purple.300'}
        />
        <Feature
          icon={<Img src={profile} w={'full'} />}
          title={'Учители от цялата страна'}
          text={'Учи с доказани педагози и експерти от цяла България.'}
          number={'02'}
          numberColor={'purple.400'}
          shadow
        />
        <Feature
          icon={<Img src={book} w={'full'} />}
          title={'Удобна и интерактивна учебна среда'}
          text={'Участвай, забавлявай се и подобри знанията си от вкъщи.'}
          number={'03'}
          numberColor={'purple.500'}
        />
      </SimpleGrid>
    </Stack>
  );
}
