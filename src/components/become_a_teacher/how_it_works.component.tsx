import React from 'react';
import { Flex, Image, Stack, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import { howItWorksImage } from '../../images/index';
export default function HowItWorksComponent() {
  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      px={useBreakpointValue({ base: 12, sm: 16, md: 28, lg: 16, xl: 32 })}
      mt={{ base: 0, lg: '15vh' }}
      spacing={{ base: 14, md: 24, lg: 0 }}
      align={'center'}>
      <Flex
        px={{ base: 0, lg: 8 }}
        pt={{ base: 2, lg: 8 }}
        maxW={{ base: '100%', md: '80%', xl: '30%' }}
        align={'center'}
        justify={'center'}>
        <VStack
          w={'full'}
          mt={{ base: '8vh', lg: 0 }}
          justify={{ base: 'start', lg: 'center' }}
          align={{ base: 'center', lg: 'start' }}>
          <Stack
            maxW={{ base: 'full', lg: '40vw', xl: '50vw' }}
            align={{ base: 'center', lg: 'start' }}
            justify={{ base: 'center', lg: 'start' }}>
            <Stack spacing={{ base: '6vh', lg: 10 }}>
              <Text
                color={'grey.600'}
                fontWeight={700}
                lineHeight={1.5}
                textAlign={{ base: 'center', lg: 'left' }}
                fontSize={useBreakpointValue({
                  base: '5.8vw',
                  sm: 'xl',
                  md: '3.5vw',
                  xl: '2.2vw',
                })}>
                <Text as="span" color={'purple.500'}>
                  Вашият принос
                </Text>{' '}
                <br />
                за нас
              </Text>

              <Text
                color={'grey.600'}
                fontWeight={400}
                lineHeight={1.35}
                textAlign={{ base: 'center', lg: 'left' }}
                fontSize={useBreakpointValue({ base: 14, md: '2vw', lg: '1.9vw', xl: '1.2vw' })}>
                My Classroom Ви удържа комисионна в размер на 10% от цената, определена от Вас за записал се учащ във
                вашия групов курс / частен урок. Пример: При определена цена от Вас - 30 лв на записал се учащ за вашия
                частен урок, My Classroom ви удържа такса в размер от 3 лв. Комисионната се използва с цел подпомагане
                разрастването и съществуването на онлайн платформата.
              </Text>
            </Stack>
          </Stack>
        </VStack>
      </Flex>
      <Flex flex={1} align={'center'} justify={{ base: 'center', md: 'end' }}>
        <Image alt={'How it works image'} src={howItWorksImage} w={{ base: 'full', xl: '80%' }} />
      </Flex>
    </Stack>
  );
}
