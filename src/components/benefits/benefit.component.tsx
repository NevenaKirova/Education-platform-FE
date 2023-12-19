import React from 'react';
import { Flex, Image, Stack, Text, useBreakpointValue, VStack } from '@chakra-ui/react';

export default function BenefitComponent({
  num,
  header,
  text,
  image,
}: {
  num: string;
  header: string;
  text: string;
  image: any;
}) {
  return (
    <Stack
      w={{ base: '100vw', lg: '90vw' }}
      direction={{ base: 'column', lg: 'row' }}
      px={useBreakpointValue({ base: 0, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 })}
      justify={'space-between'}
      align={'center'}>
      <Flex p={{ base: 6, lg: 8 }} flex={1} align={'center'} maxW={{ base: '100%', lg: '45%' }}>
        <VStack
          w={'full'}
          mt={{ base: '8vh', lg: 0 }}
          justify={{ base: 'start', lg: 'center' }}
          align={{ base: 'center', lg: 'flex-start' }}>
          <Stack align={'center'} justify={'center'} spacing={{ base: '6vh', lg: 14 }}>
            <Stack spacing={{ base: 6, lg: 6 }} mr={{ base: 8, lg: 0 }} align={{ base: 'center', lg: 'start' }}>
              <Text
                color={'grey.600'}
                fontWeight={700}
                lineHeight={1.5}
                textAlign={{ base: 'center', lg: 'left' }}
                fontSize={useBreakpointValue({
                  base: '5.8vw',
                  sm: 'xl',
                  md: '3.5vw',
                  lg: '3vh',
                  xl: '2.2vw',
                })}>
                Какви са {''}
                <Text as="span" color={'purple.500'}>
                  ползите {''}
                </Text>
                за вас?
              </Text>

              <Flex align={'center'}>
                <Text
                  color={'purple.500'}
                  fontWeight={700}
                  lineHeight={1.5}
                  textAlign={{ base: 'center', lg: 'left' }}
                  mr={{ base: 4, lg: 6 }}
                  fontSize={{ base: 28, lg: 54 }}>
                  {num} {''}
                </Text>
                <Text
                  color={'grey.600'}
                  opacity={0.95}
                  fontWeight={700}
                  lineHeight={1.5}
                  textAlign={{ base: 'center', lg: 'left' }}
                  fontSize={{ base: 18, lg: 34 }}>
                  {header}
                </Text>
              </Flex>

              <Text
                fontWeight={400}
                lineHeight={1.35}
                textAlign={{ base: 'center', lg: 'left' }}
                fontSize={useBreakpointValue({ base: 14, md: '2vw', lg: '1.9vw', xl: '1.2vw' })}
                color={'grey.500'}>
                {text}
              </Text>
            </Stack>
          </Stack>
        </VStack>
      </Flex>
      <Flex flex={1} align={'center'} justify={'center'}>
        <Image alt={'Header image'} src={image} w={{ base: '90%', lg: '100%' }} mr={{ base: 8, lg: 0 }} />
      </Flex>
    </Stack>
  );
}
