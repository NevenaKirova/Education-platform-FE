import React, { useEffect, useState } from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import { Box, Heading, Text, Button, Stack, Flex, Image, Grid, GridItem, Icon } from '@chakra-ui/react';

import { YoutubeEmbed } from '../components/testimonials/testimonial_demo.component';
import TestimonialCard from '../components/testimonials/testimonial_card.component';
import { responsive } from '../components/testimonials/testimonial.component';

import axios from '../axios';

import { aboutUsBackground, reasons } from '../images';
import { arrowRight, capWhite, groupWhite } from '../icons';

import style from '../components/courses/courses_landing/courses_landing.module.scss';

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
      mt={{ base: 36, lg: 40 }}
      align={'start'}
      justify={'start'}
      flex={1}
      w={'full'}>
      <Stack
        as={Box}
        px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
        textAlign={'start'}
        spacing={5}
        fontSize={{ base: 'md', lg: 'lg' }}>
        <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }}>
          <Text as={'span'} color={'purple.500'}>
            За нас{' '}
          </Text>
          и нашата мисия
        </Heading>

        <Text>
          MyClassroom е иновативна онлайн обучителна платформа за ученици и студенти, предлагаща многообразие от онлайн
          уроци, водени от учители, професори и експерти от цялата страна.
        </Text>
        <Text>
          Нашата мисия е да подпомогнем сферата на образование в страната и да насърчим младите да учат и да се развиват
          с пълния си потенциал. Даваме също така възможност на учители и експерти да преподават онлайн своите частни
          уроци и курсове на платформата на MyClassroom.
        </Text>
        <Text>
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
          bg={'purple.500'}
          color={'white'}
          _active={{ bg: 'white' }}
          _hover={{ opacity: '0.95' }}>
          Виж повече
        </Button>
      </Stack>

      <Stack
        h={'70vh'}
        px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
        bg={'purple.100'}
        w={'full'}
        fontSize={{ base: 'md', lg: 'lg' }}
        alignItems={'center'}
        direction={'row'}>
        <Flex flex={1} align={'start'} justify={'start'} gap={8}>
          <Stack spacing={6} w={'full'} maxW={'xl'} align={'start'} textAlign={'start'}>
            <Stack spacing={2}>
              <Heading fontWeight={600} color={'purple.500'} fontSize={{ base: 24, lg: 32, xl: 40 }}>
                Кои сме ние?
              </Heading>

              <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }}>
                Екипът на MyClassroom
              </Heading>
            </Stack>

            <Text fontSize={{ base: 'md', lg: 'lg' }}>
              Ние сме амбициозни и млади хора, обединени около една обща идеа, да подобрим образованието в страната.
              Създадохме платформата за да осъществим връзката между ученици и студенти, нуждаещи се от допълнителна
              помощ в обучението си и преподаватели, предлагащи такава. Бихме искали да наложим една нова тенденция и да
              покажем, че при онлайн обучението всичко е по-лесно достъпно и удобно за всички. С помощта на MyClassroom
              ние вярваме, че успяхме на направим подготовката от вкъщи на всеки ученик в начален етап, зрелостник и
              висшист по – удобна, по – ефикасна и по – интерактивна.
            </Text>
          </Stack>
        </Flex>
        <Flex flex={1} maxH={{ base: 'inherit' }}>
          <Image rounded={'lg'} alt={'Group Image'} objectFit={'cover'} src={aboutUsBackground} />
        </Flex>
      </Stack>

      <Stack px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }} spacing={{ base: 16, md: 24 }}>
        <Stack as={Box} textAlign={'start'} spacing={10} fontSize={{ base: 'md', lg: 'lg' }}>
          <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'}>
            <Text as={'span'} color={'purple.500'}>
              Какви уроци{' '}
            </Text>{' '}
            предлага платформата?
          </Heading>
          <Text fontSize={{ base: 'md', lg: 'lg' }}>
            MyClassroom предлага групови курсове и частни уроци, които се провеждат онлайн, в реално време от нашите
            учители. Уроците на платформата обхващат една голяма част от учебните предвети, включително математика,
            чужди езици, химия,биология и много други. Независимо дали сте склонни към колективно обучение или
            предпочитате персонализиран подход, MyClassroom предлага и двата вида допълнителни уроци, водени от доказани
            експерти и педагози.
          </Text>

          <Stack w={'full'} direction={'row'} justify={'space-between'} mt={6}>
            <Stack maxW={'35vw'} w={'full'} bg={'purple.100'} p={12} spacing={6}>
              <Stack>
                <Text fontSize={24} fontWeight={700} color={'purple.500'}>
                  Групови курсове
                </Text>
                <Box w={'70px'} h={'3px'} bg={'purple.500'}></Box>
              </Stack>

              <Text fontSize={{ base: 'md', lg: 'lg' }} color={'grey.500'}>
                Груповите курсове предоставят уникална възможност за учащите да се включат в динамична образователна
                среда, споделяйки знания и опит с другите учащи от групата. Чрез взаимодействието и комуникацията с
                групата, ученикът започва да учи по-активно с повече внимание върху учебния материал.
              </Text>

              <Button
                as={ReactRouterLink}
                to={'/courses'}
                w={{ base: 'full', md: 'fit-content' }}
                mt={6}
                size={{ base: 'sm', md: 'md' }}
                fontWeight={700}
                bg={'purple.500'}
                color={'white'}
                _active={{ bg: 'white' }}
                _hover={{ opacity: '0.95' }}>
                Към курсовете
              </Button>
            </Stack>

            <Stack maxW={'35vw'} w={'full'} bg={'purple.100'} p={12} spacing={6}>
              <Stack>
                <Text fontSize={24} fontWeight={700} color={'purple.500'}>
                  Частни уроци
                </Text>
                <Box w={'70px'} h={'3px'} bg={'purple.500'}></Box>
              </Stack>

              <Text fontSize={{ base: 'md', lg: 'lg' }} color={'grey.500'}>
                Уроците осигуряват персонализиран подход и възможност за фокусирано внимание върху конкретните нужди на
                учащия. Предоставят възможност за индивидуален напредък на ученика в даден предмет, позволявайки му да
                работи в свой собствен темп и да се съсредоточи върху конкретни затруднения или интереси.
              </Text>

              <Button
                as={ReactRouterLink}
                to={'/lessons'}
                w={{ base: 'full', md: 'fit-content' }}
                mt={6}
                size={{ base: 'sm', md: 'md' }}
                fontWeight={700}
                bg={'purple.500'}
                color={'white'}
                _active={{ bg: 'white' }}
                _hover={{ opacity: '0.95' }}>
                Към уроците
              </Button>
            </Stack>
          </Stack>
        </Stack>

        <Stack as={Box} textAlign={'center'} justify={'space-evenly'} fontSize={{ base: 'md', lg: 'lg' }} h={'75vh'}>
          <Stack>
            <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'90%'}>
              Защо да изберете точно нас?
            </Heading>

            <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'} color={'purple.500'}>
              5 причини{' '}
            </Heading>
          </Stack>

          <Image src={reasons} w={'full'} />
        </Stack>

        <Stack
          direction={{ base: 'column', lg: 'row' }}
          w={'full'}
          fontSize={{ base: 'md', lg: 'lg' }}
          justify={'space-between'}
          spacing={{ base: 12, md: 16, lg: 12 }}>
          <Flex flex={1} w="full" align={'start'} justify={'start'} gap={6}>
            <Stack spacing={6} w={'full'} maxW={{ base: 'full', lg: 'xl' }} align={'start'} textAlign={'start'}>
              <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'}>
                Учителите на
                <Text as={'span'} color={'purple.500'}>
                  {' '}
                  MyClassroom
                </Text>{' '}
              </Heading>
              <Text>
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

          <Flex
            flex={1}
            justify={'center'}
            align={'center'}
            position={'relative'}
            w={'full'}
            maxW={{ base: 'full', xl: '35vw' }}>
            <Box rounded={'xl'} boxShadow={'2xl'} width={'full'} overflow={'hidden'}>
              <YoutubeEmbed embedId="dBGCBOTB5-4?si=bFJuRlVX57RaOIWk" />
            </Box>
          </Flex>
        </Stack>

        <Stack as={Box} textAlign={{ base: 'center' }} spacing={16} w={'full'}>
          <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'}>
            Някои от{' '}
            <Text as={'span'} color={'purple.500'}>
              нашите учители
            </Text>{' '}
          </Heading>

          <Grid
            templateColumns={{ base: 'repeat(auto-fill, minmax(260px, 1fr))' }}
            gap={20}
            w={'full'}
            justifyItems={'center'}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((el, index) => (
              <GridItem key={index}>
                <Stack role="group" position={'relative'} w={{ base: '250px', md: '300px' }}>
                  <Image
                    rounded={'lg'}
                    alt={'Group Image'}
                    boxSize={{ base: '250px', md: '300px' }}
                    objectFit="cover"
                    src={'https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg'}
                  />

                  <Stack
                    position={'absolute'}
                    bottom={0}
                    rounded={'md'}
                    left={0}
                    right={0}
                    background={'rgb(0 0 0 / 70%);'}
                    overflow={'hidden'}
                    width={'full'}
                    height={0}
                    color={'white'}
                    transition={'.5s ease-in-out'}
                    _groupHover={{ h: '60%' }}
                    spacing={3}
                    textAlign={'start'}>
                    <Stack px={4} pt={4}>
                      <Text fontSize={18} fontWeight={700}>
                        Мария Ивнаова
                      </Text>
                      <Box w={'70px'} h={'3px'} bg={'purple.500'}></Box>
                    </Stack>

                    <Text fontSize={14} px={4}>
                      Уроците осигуряват персонализиран подход и възможност за фокусирано внимание върху конкретните
                    </Text>
                  </Stack>
                </Stack>
              </GridItem>
            ))}
          </Grid>
        </Stack>

        <Stack
          as={Box}
          textAlign={{ base: 'center' }}
          spacing={6}
          fontSize={{ base: 'md', lg: 'lg' }}
          w={'full'}
          mb={20}>
          <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'}>
            <Text as={'span'} color={'purple.500'}>
              Отзиви{' '}
            </Text>
            от родители
          </Heading>

          <Carousel
            autoPlay={false}
            autoPlaySpeed={5000}
            responsive={responsive}
            partialVisible={true}
            showDots={true}
            containerClass={style.containerClass}
            infinite={true}
            arrows={false}>
            {reviews?.map((review, index) => <TestimonialCard key={index} review={review} />)}
          </Carousel>
        </Stack>

        <Stack
          w={'full'}
          direction={{ base: 'column', lg: 'row' }}
          justify={'space-between'}
          align={'center'}
          mt={6}
          spacing={24}
          h={'fit-content'}>
          <Stack
            as={ReactRouterLink}
            to={'/courses'}
            minW={'35vw'}
            maxW={'45%'}
            w={'full'}
            bg={'purple.100'}
            align={'center'}
            justify={'space-between'}
            p={6}
            spacing={6}
            direction={'row'}>
            <Stack spacing={6} direction={'row'}>
              <Box bg={'purple.500'} w={'fit-content'} h={'fit-content'} p={4} rounded={'md'}>
                <Image boxSize="45px" objectFit="contain" src={capWhite} alt="Cap" />
              </Box>

              <Stack maxW={'70%'}>
                <Stack direction={'row'}>
                  <Text fontSize={18} fontWeight={700}>
                    Станете наш
                  </Text>
                  <Text fontSize={18} fontWeight={700} color={'purple.500'}>
                    ученик
                  </Text>
                </Stack>

                <Text fontSize={16} color={'grey.500'} textAlign={'start'}>
                  Разгледайте нашата селекция от курсове и частни уроци на най-разнообразни теми.
                </Text>
              </Stack>
            </Stack>

            <Image boxSize={8} objectFit="contain" src={arrowRight} alt="arrow" />
          </Stack>

          <Stack
            as={ReactRouterLink}
            to={'/become-a-teacher'}
            minW={'35vw'}
            maxW={'45%'}
            w={'full'}
            bg={'purple.100'}
            align={'center'}
            p={6}
            spacing={6}
            direction={'row'}
            justify={'space-between'}>
            <Stack spacing={6} direction={'row'}>
              <Box bg={'purple.500'} w={'fit-content'} h={'fit-content'} p={4} rounded={'md'}>
                <Image boxSize="45px" objectFit="contain" src={groupWhite} alt="Cap" />
              </Box>

              <Stack maxW={'70%'}>
                <Stack direction={'row'}>
                  <Text fontSize={18} fontWeight={700}>
                    Станете наш
                  </Text>
                  <Text fontSize={18} fontWeight={700} color={'purple.500'}>
                    учител
                  </Text>
                </Stack>

                <Text fontSize={16} color={'grey.500'} textAlign={'start'}>
                  Присъединете се към професионален екип на MyClassroom и станете един от нашите учители.
                </Text>
              </Stack>
            </Stack>

            <Image boxSize={8} objectFit="contain" src={arrowRight} alt="arrow" />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
