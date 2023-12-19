import React from 'react';
import { Button, Flex, Image, Stack, Text, useBreakpointValue, VStack } from '@chakra-ui/react';
import { teacherHeader } from '../../images/index';
export default function HeaderSection({
  onLoginOpen,
  setModalTabIndex,
  elRef,
  setLoginAs,
}: {
  onLoginOpen: any;
  setModalTabIndex: any;
  elRef: any;
  setLoginAs: any;
}) {
  const handleModalOpen = (tabIndex: number) => {
    setModalTabIndex(tabIndex);
    setLoginAs('teacher');
    onLoginOpen();
  };
  const handleScroll = () => {
    elRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Stack
      minH={{ base: 'fit-content', lg: '100vh' }}
      mt={{ base: 0, lg: '5vh' }}
      direction={{ base: 'column', lg: 'row' }}
      px={useBreakpointValue({ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 })}
      justify={'space-between'}
      spacing={{ base: 20, lg: 0 }}>
      <Flex p={{ base: 2, lg: 8 }} flex={1} align={{ base: 'start', lg: 'center' }} justify={'center'}>
        <VStack
          w={'full'}
          mt={{ base: '18vh', lg: 0 }}
          justify={{ base: 'start', lg: 'center' }}
          align={{ base: 'center', lg: 'flex-start' }}>
          <Stack align={'center'} justify={'center'} spacing={{ base: '6vh', lg: 14 }}>
            <Stack spacing={{ base: '6vh', lg: 10 }}>
              <Text
                color={'grey.600'}
                fontWeight={700}
                lineHeight={1.5}
                textAlign={{ base: 'center', lg: 'left' }}
                fontSize={useBreakpointValue({
                  base: '5.2vw',
                  sm: 'xl',
                  md: '4.5vw',
                  lg: '2.5vw',
                  xl: '2.2vw',
                })}>
                Стани онлайн учител! <br /> Присъедини се и преподавай в {''}
                <Text as="span" color={'purple.500'}>
                  MyClassroom
                </Text>
              </Text>

              <Text
                color={'grey.600'}
                fontWeight={400}
                lineHeight={1.35}
                textAlign={{ base: 'center', lg: 'left' }}
                fontSize={useBreakpointValue({ base: 14, md: 20, lg: '1.9vw', xl: '1.2vw' })}>
                Създай своята кариера при нас. Преподавай онлайн отвсякъде по всяко време.
              </Text>
            </Stack>

            <Stack
              direction={'row'}
              align={'center'}
              justify={{ base: 'center', lg: 'flex-start' }}
              w={'full'}
              spacing={{ base: 6, sm: 8, md: 14, lg: 8 }}>
              <Button
                w={{ base: 'full', sm: 'fit-content', lg: 'full', xl: 'full' }}
                size={{ base: 'xs', sm: 'sm', md: 'md', xl: 'lg' }}
                p={{ base: '15px', sm: '20px', md: '20px', xl: 0 }}
                fontSize={{ base: 14, md: 'xl' }}
                fontWeight={600}
                bg={'purple.500'}
                color={'white'}
                border={'1px solid'}
                borderColor={'purple.500'}
                _hover={{ opacity: '0.9' }}
                _active={{ bg: 'purple.500' }}
                onClick={() => handleModalOpen(1)}>
                Стани учител
              </Button>

              <Button
                w={{ base: 'full', sm: 'fit-content', lg: 'full', xl: 'full' }}
                size={{ base: 'xs', sm: 'sm', md: 'md', xl: 'lg' }}
                p={{ base: '15px', sm: '20px', md: '20px', xl: 0 }}
                fontSize={{ base: 14, md: 'md', xl: 'xl' }}
                fontWeight={700}
                bg={'white'}
                color={'purple.500'}
                border={'2px solid'}
                borderColor={'purple.500'}
                _hover={{ bg: 'purple.100' }}
                _active={{ bg: 'white' }}
                onClick={handleScroll}>
                Научи повече
              </Button>
            </Stack>
          </Stack>
        </VStack>
      </Flex>
      <Flex align={'center'} justify={'center'}>
        <Image alt={'Header image'} src={teacherHeader} w={{ base: '100%', md: '80%', xl: '70%', '2xl': '80%' }} />
      </Flex>
    </Stack>
  );
}
