import React, { useEffect, useState } from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';

import { Box, Heading, Text, Button, Stack, Flex, Image, Grid, GridItem, Center } from '@chakra-ui/react';

import { YoutubeEmbed } from '../components/testimonials/testimonial_demo.component';
import TestimonialCard from '../components/testimonials/testimonial_card.component';

import axios from '../axios';

export default function AboutUsPage() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios
      .get('lessons/getHomePage')
      .then(res => {
        setReviews(res.data?.reviewsResponse);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <Stack
      spacing={{ base: 16, md: 24 }}
      py={{ base: 0, lg: 10 }}
      px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
      mt={{ base: 36, lg: 40 }}
      align={'start'}
      justify={'start'}
      flex={1}
      w={'full'}>
      <Stack as={Box} maxW={'5xl'} textAlign={'start'} spacing={6} fontSize={{ base: 'md', lg: 'lg' }}>
        <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'}>
          За нас
        </Heading>

        <Text color={'gray.600'}>
          MyClassroom е иновативна онлайн обучителна платформа за ученици и студенти, предлагаща многообразие от онлайн
          уроци, водени от учители, професори и експерти от цялата страна.
        </Text>
        <Text color={'gray.600'}>
          Нашата мисия е да подпомогнем сферата на образование в страната и да насърчим младите да учат и да се развиват
          с пълния си потенциал. Даваме също така възможност на учители и експерти да преподават онлайн своите частни
          уроци и курсове на платформата на MyClassroom.
        </Text>
        <Text color={'gray.600'}>
          В MyClassroom ще намерите множество от онлайн уроци по всякакви предмети, включително математика, физика,
          химия, биология, чужди езици и други.
        </Text>

        <Button
          as={ReactRouterLink}
          to={'/lessons'}
          w={{ base: 'full', md: 'fit-content' }}
          mt={6}
          size={{ base: 'sm', md: 'md' }}
          fontWeight={700}
          bg={'white'}
          color={'purple.500'}
          border={'2px solid'}
          borderColor={'purple.500'}
          _active={{ bg: 'white' }}
          _hover={{ opacity: '0.9' }}>
          Виж и разбери сам!{' '}
        </Button>
      </Stack>

      <Stack direction={{ base: 'column', lg: 'row' }} spacing={8} w={'full'} fontSize={{ base: 'md', lg: 'lg' }}>
        <Flex flex={1} align={'start'} justify={'start'} gap={8}>
          <Stack spacing={6} w={'full'} maxW={'2xl'} align={'start'} textAlign={'start'}>
            <Stack>
              <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }}>
                Кои сме ние?
              </Heading>
            </Stack>
            <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }}>
              Екипът на
              <Text as={'span'} color={'purple.500'}>
                {' '}
                MyClassroom
              </Text>
            </Heading>
            <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.600'}>
              Ние сме амбициозни и млади хора, обединени около една обща идеа, да подобрим образованието в страната.
              Създадохме платформата за да осъществим връзката между ученици и студенти, нуждаещи се от допълнителна
              помощ в обучението си и преподаватели, предлагащи такава. Бихме искали да наложим една нова тенденция и да
              покажем, че при онлайн обучението всичко е по-лесно достъпно и удобно за всички. С помощта на MyClassroom
              ние вярваме, че успяхме на направим подготовката от вкъщи на всеки ученик в начален етап, зрелостник и
              висшист по – удобна, по – ефикасна и по – интерактивна.
            </Text>
          </Stack>
        </Flex>
        <Flex flex={1} maxH={{ base: 'inherit', '2xl': '45vh' }}>
          <Image
            rounded={'lg'}
            alt={'Group Image'}
            objectFit={'cover'}
            src={
              'https://img.freepik.com/free-photo/cherful-positive-young-colleagues-using-laptop-computer_171337-753.jpg?w=1380&t=st=1699989520~exp=1699990120~hmac=bb08deaea8a9ebd82ac6fce10c5e8f3e649486af82f1b92bbf28fe946ed2712f'
            }
          />
        </Flex>
      </Stack>

      <Stack as={Box} textAlign={'start'} spacing={6} fontSize={{ base: 'md', lg: 'lg' }}>
        <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'}>
          <Text as={'span'} color={'purple.500'}>
            5 причини{' '}
          </Text>{' '}
          защо да изберете нас?
        </Heading>
        <Text color={'gray.600'}>
          1. Многообразие от курсове и частни уроци, водени от верифицирани доказали се преподаватели и експерти от
          цялата страна
        </Text>

        <Text color={'gray.600'}>
          2. Напълно безплатни регистрация и достъп до преподаватели, групови курсове и частни уроци на платформата.
        </Text>

        <Text color={'gray.600'}>3. Онлайн учи от всякъде по удобно за теб време</Text>
        <Text color={'gray.600'}>4. Без абонаменти и скрити такси</Text>
        <Text color={'gray.600'}>5. Прозрачност, яснота, легитимност и бърз клиентски съпорт</Text>
      </Stack>

      <Stack
        direction={{ base: 'column-reverse', lg: 'row' }}
        w={'full'}
        fontSize={{ base: 'md', lg: 'lg' }}
        spacing={{ base: 12, md: 16, lg: 12 }}>
        <Flex
          flex={1}
          justify={'center'}
          align={'center'}
          position={'relative'}
          w={'full'}
          maxW={{ base: 'full', xl: '40vw' }}>
          <Box rounded={'xl'} boxShadow={'2xl'} width={'full'} overflow={'hidden'}>
            <YoutubeEmbed embedId="dBGCBOTB5-4?si=bFJuRlVX57RaOIWk" />
          </Box>
        </Flex>
        <Flex flex={1} align={'start'} justify={'end'} gap={6}>
          <Stack spacing={6} w={'full'} maxW={'2xl'} align={'start'} textAlign={'start'}>
            <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'}>
              Учителите на
              <Text as={'span'} color={'purple.500'}>
                {' '}
                MyClassroom
              </Text>{' '}
            </Heading>
            <Text color={'gray.600'}>
              Гордеем се с широкия спектър от преподаватели и професионалисти, които преподават в MyClassroom и градят
              своята кариера при нас. Виж ги и ти!
            </Text>

            <Text color={'gray.600'}>Искаш да станеш част от нашия екип?</Text>

            <Button
              mt={{ base: 4, lg: 6 }}
              size={{ base: 'sm', md: 'md', '2xl': 'md' }}
              w={{ base: 'full', lg: 'fit-content', xl: '250px' }}
              fontSize={'xl'}
              fontWeight={700}
              bg={'purple.500'}
              color={'white'}
              _hover={{ opacity: '0.9' }}>
              Стани учител
            </Button>
          </Stack>
        </Flex>
      </Stack>

      <Stack as={Box} textAlign={{ base: 'center', md: 'start' }} spacing={16} w={'full'}>
        <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'}>
          Някои от{' '}
          <Text as={'span'} color={'purple.500'}>
            нашите учители
          </Text>{' '}
        </Heading>

        <Grid templateColumns={'repeat(auto-fill, minmax(200px, 1fr))'} gap={8} w={'full'}>
          <GridItem>
            <Center>
              <Image
                rounded={'lg'}
                alt={'Group Image'}
                boxSize={{ base: '250px', md: '300px' }}
                objectFit="cover"
                src={'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg'}
              />
            </Center>
          </GridItem>
          <GridItem>
            <Center>
              <Image
                rounded={'lg'}
                alt={'Group Image'}
                boxSize={{ base: '250px', md: '300px' }}
                objectFit="cover"
                src={
                  'https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_images/2018-09/shutterstock_648907024.jpg?itok=7lrLYx-B'
                }
              />
            </Center>
          </GridItem>
          <GridItem>
            <Center>
              <Image
                rounded={'lg'}
                alt={'Group Image'}
                boxSize={{ base: '250px', md: '300px' }}
                objectFit="cover"
                src={
                  'https://static01.nyt.com/images/2022/05/19/opinion/firstpersonPromo/firstpersonPromo-superJumbo.jpg'
                }
              />
            </Center>
          </GridItem>

          <GridItem>
            <Center>
              <Image
                rounded={'lg'}
                alt={'Group Image'}
                boxSize={{ base: '250px', md: '300px' }}
                objectFit="cover"
                src={
                  'https://cdn2.psychologytoday.com/assets/styles/manual_crop_1_91_1_1528x800/public/field_blog_entry_images/2018-09/shutterstock_648907024.jpg?itok=7lrLYx-B'
                }
              />
            </Center>
          </GridItem>
          <GridItem>
            <Center>
              <Image
                rounded={'lg'}
                alt={'Group Image'}
                boxSize={{ base: '250px', md: '300px' }}
                objectFit="cover"
                src={
                  'https://static01.nyt.com/images/2022/05/19/opinion/firstpersonPromo/firstpersonPromo-superJumbo.jpg'
                }
              />
            </Center>
          </GridItem>
          <GridItem>
            <Center>
              <Image
                rounded={'lg'}
                alt={'Group Image'}
                boxSize={{ base: '250px', md: '300px' }}
                objectFit="cover"
                src={
                  'https://static01.nyt.com/images/2022/05/19/opinion/firstpersonPromo/firstpersonPromo-superJumbo.jpg'
                }
              />
            </Center>
          </GridItem>
        </Grid>
      </Stack>

      <Stack
        as={Box}
        textAlign={{ base: 'center', md: 'start' }}
        spacing={6}
        fontSize={{ base: 'md', lg: 'lg' }}
        w={'full'}
        mb={20}>
        <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'}>
          <Text as={'span'} color={'purple.500'}>
            Мнения{' '}
          </Text>
          на родители
        </Heading>
        <Grid
          templateColumns={{
            base: 'repeat(auto-fill, minmax(200px, 1fr))',
            lg: 'repeat(auto-fill, minmax(300px, 1fr))',
          }}
          gap={12}
          w={'full'}
          pt={5}>
          {reviews?.map((review, index) => (
            <GridItem key={index}>
              <TestimonialCard review={review} padding={0} />{' '}
            </GridItem>
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
}
