import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Flex, Box, Heading, Text, Button, Center, useBreakpointValue } from '@chakra-ui/react';
import { background1 } from '../../images';

import styles from './testimonial_demo.module.scss';
import { NavLink as ReactRouterLink } from 'react-router-dom';

export const YoutubeEmbed = ({ embedId }: { embedId: string }) => (
  <div className={styles.video_responsive}>
    <iframe
      width="853"
      height="480"
      src={`//www.youtube.com/embed/${embedId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
    />
  </div>
);

YoutubeEmbed.propTypes = {
  embedId: PropTypes.string.isRequired,
};

export default function TestimonialDemoSection() {
  return (
    <Center
      py={12}
      px={{ base: 8, md: 20, lg: 20, xl: '15vw' }}
      w={'full'}
      bg={'purple.100'}
      backgroundImage={background1}
      backgroundSize={'cover'}
      backgroundPosition={{ base: 'center', xl: 'center center' }}>
      <Stack
        w={'full'}
        align={'center'}
        justify={'space-between'}
        spacing={{ base: 20, md: 32, lg: 28 }}
        py={{ base: 10, md: 28 }}
        direction={{ base: 'column', lg: 'row' }}>
        <Stack flex={1} spacing={{ base: 8, md: 10 }} maxW={{ base: '70vw', md: '60vw', lg: '35vw', xl: '25vw' }}>
          <Heading flex={1} as="h1" fontSize={{ base: 24, md: 32, lg: 40 }} textAlign={{ base: 'center', lg: 'left' }}>
            <Text>Стотици онлайн уроци от преподаватели от</Text>
            {''}
            <Text as="span" color={'purple.500'}>
              цялата страна
            </Text>
          </Heading>

          <Stack spacing={3}>
            <Text
              color={'grey.600'}
              fontWeight={400}
              lineHeight={1.35}
              textAlign={{ base: 'center', lg: 'left' }}
              fontSize={useBreakpointValue({ base: '1.8vh', md: '2vw', lg: '1.9vw', xl: '1.2vw' })}>
              „Най-важното явление в училище, най-поучителния предмет, най-живият пример за ученика е самият учител.“
            </Text>

            <Text
              color={'grey.600'}
              fontWeight={400}
              lineHeight={1.35}
              textAlign={{ base: 'center', lg: 'left' }}
              fontSize={useBreakpointValue({ base: '1.8vh', md: '2vw', lg: '1.9vw', xl: '1.2vw' })}>
              - Фридрих Дистервег
            </Text>
          </Stack>

          <Button
            as={ReactRouterLink}
            to={'/lessons'}
            size={{ base: 'sm', md: 'md', '2xl': 'md' }}
            w={{ base: 'full', lg: '12vw' }}
            fontSize={'xl'}
            fontWeight={700}
            bg={'purple.500'}
            color={'white'}
            _hover={{ opacity: '0.9' }}>
            Виж повече
          </Button>
        </Stack>
        <Flex
          flex={1}
          justify={'center'}
          align={'center'}
          position={'relative'}
          maxW={{ base: '80vw', xl: '32vw' }}
          w={'full'}>
          <Box rounded={'xl'} boxShadow={'2xl'} width={'full'} overflow={'hidden'}>
            <YoutubeEmbed embedId="dBGCBOTB5-4?si=bFJuRlVX57RaOIWk" />
          </Box>
        </Flex>
      </Stack>
    </Center>
  );
}
