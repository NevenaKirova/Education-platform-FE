import React, { ReactNode } from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';

import { Box, SimpleGrid, Stack, Text, Flex, Img } from '@chakra-ui/react';
import { Instagram, Facebook, YoutubePurple } from '../../icons';

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={700} fontSize={20} mb={2}>
      {children}
    </Text>
  );
};

const socialMedia = [
  {
    name: 'Youtube',
    icon: YoutubePurple,
    link: '',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    link: '',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    link: '',
  },
];
export default function Footer() {
  return (
    <Box px={'12vw'} py={10} bg={'purple.500'} color={'white'} w={'full'}>
      <Flex direction={{ base: 'column', lg: 'row' }} justify={'space-between'} align={'center'} gap={{ base: 14 }}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={16}>
          <Stack align={'flex-start'} textAlign={'left'}>
            <ListHeader>За нас</ListHeader>
            <Box as={ReactRouterLink} to={'/about-us'}>
              Нашата история
            </Box>
            <Box as={ReactRouterLink} to={'/terms-of-use'}>
              Условия и ползване
            </Box>
          </Stack>
          <Stack align={'flex-start'} textAlign={'left'}>
            <ListHeader>Помощ</ListHeader>
            <Box as={ReactRouterLink} to={'/help-center'}>
              Помощен център
            </Box>
            <Box as={ReactRouterLink} to={'/help-center-teacher'}>
              Помощен център за учители
            </Box>
          </Stack>
          <Stack align={'flex-start'} textAlign={'left'}>
            <ListHeader>Сигурност</ListHeader>
            <Box as={ReactRouterLink} to={'/security-policy'}>
              Политика за сигурност
            </Box>
            <Box as={ReactRouterLink} to={'/personal-data-policy'}>
              Политика за лични данни
            </Box>
          </Stack>
          <Stack align={'flex-start'} textAlign={'left'}>
            <ListHeader>Контакти</ListHeader>
            <Box as={ReactRouterLink} to={'mailto:info@myclassroom.bg'}>
              info@myclassroom.bg
            </Box>
          </Stack>
        </SimpleGrid>

        <Stack direction={'row'} spacing={12}>
          {socialMedia.map((el, index) => (
            <Flex
              as="a"
              href={el?.link}
              align={'center'}
              justify={'center'}
              key={index}
              bg={'white'}
              borderRadius={'50%'}
              w={{ base: 8, xl: '2.6rem' }}
              h={{ base: 8, xl: '2.6rem' }}>
              <Flex
                w={{ base: 4, lg: 6, xl: 8 }}
                h={{ base: 4, lg: 6, xl: 8 }}
                align={'center'}
                justify={'center'}
                color={'white'}
                rounded={'full'}>
                <Img src={el.icon} w={'full'} color={'purple.500'} />
              </Flex>
            </Flex>
          ))}
        </Stack>
      </Flex>
    </Box>
  );
}
