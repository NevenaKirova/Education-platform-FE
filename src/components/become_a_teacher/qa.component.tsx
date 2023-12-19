import React from 'react';
import { Button, Flex, Heading, Image, Stack, Text, Link, useBreakpointValue, VStack } from '@chakra-ui/react';
import { graphics } from '../../images/index';
export default function QASection() {
  return (
    <Stack
      minH={'100vh'}
      direction={{ base: 'column-reverse', lg: 'row' }}
      px={useBreakpointValue({ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 })}
      mb={{ base: 20, lg: 0 }}>
      <Flex align={'center'} justify={'center'}>
        <Image alt={'Header image'} src={graphics} w={{ base: 'full', md: '90%', xl: '80%' }} />
      </Flex>
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <VStack
          w={'full'}
          mt={{ base: '8vh', lg: 0 }}
          justify={{ base: 'start', lg: 'center' }}
          align={{ base: 'center', lg: 'flex-start' }}>
          <Stack
            maxW={{ base: 'full', lg: '40vw', xl: '50vw' }}
            align={{ base: 'center', lg: 'start' }}
            justify={'center'}
            spacing={{ base: '6vh', lg: 14 }}>
            <Stack spacing={{ base: '6vh', md: '2vh', lg: 10 }}>
              <Heading
                flex={1}
                as="h1"
                lineHeight={1.45}
                fontSize={{ base: '5.8vw', sm: '4.5vw', md: '3.5vw', xl: '2vw' }}
                textAlign={{ base: 'center', lg: 'left' }}
                color={'grey.600'}>
                Имате {''}
                <Text as={'span'} color={'purple.500'}>
                  въпроси?
                </Text>{' '}
                <br />
                Ние имаме{' '}
                <Text as={'span'} color={'purple.500'}>
                  отговорите!
                </Text>
              </Heading>

              <Text
                color={'grey.600'}
                fontWeight={400}
                lineHeight={1.42}
                textAlign={{ base: 'center', lg: 'left' }}
                fontSize={useBreakpointValue({ base: 14, md: '2vw', lg: '1.9vw', xl: 20 })}>
                Заповядайте в помощния център на MyClassroom където ще намерите доста от отговорите на вашите въпроси
                или се свържете с нас директно на имейл {''}
                <Link href={'teachers@myclassroom.bg.'} color={'purple.500'}>
                  teachers@myclassroom.bg{' '}
                </Link>
                .
              </Text>
            </Stack>

            <Button
              w={{ base: 'full', sm: 'fit-content', lg: 'inherit', xl: 'full' }}
              size={{ base: 'sm', sm: 'md', lg: 'md', xl: 'lg' }}
              p={{ base: '15px', sm: '20px', lg: 0 }}
              px={{ base: 0, lg: 20 }}
              fontSize={{ base: '5px', md: 'xl' }}
              fontWeight={700}
              bg={'purple.500'}
              color={'white'}
              _hover={{ opacity: '0.9' }}>
              Помощен център
            </Button>
          </Stack>
        </VStack>
      </Flex>
    </Stack>
  );
}
