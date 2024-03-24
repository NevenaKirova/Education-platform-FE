import React, { useEffect, useState } from 'react';
import { NavLink as ReactRouterLink } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import { Box, Heading, Text, Button, Stack, Flex, Image, Grid, GridItem, Show, Hide } from '@chakra-ui/react';

import { YoutubeEmbed } from '../components/testimonials/testimonial_demo.component';
import TestimonialCard from '../components/testimonials/testimonial_card.component';
import { FeatureProps } from '../components/reason_section/reason_section.component';

import axios from '../axios';

import { aboutUsBackground, reasons } from '../images';
import { arrowRight, capWhite, groupWhite } from '../icons';

import style from '../components/courses/courses_landing/courses_landing.module.scss';

export const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 1350 },
    items: 5,
    partialVisibilityGutter: 0,
  },
  desktop: {
    breakpoint: { max: 1350, min: 1000 },
    items: 2,
    partialVisibilityGutter: 80,
  },
  tablet: {
    breakpoint: { max: 1000, min: 700 },
    items: 2,
    partialVisibilityGutter: 0,
  },
  miniTablet: {
    breakpoint: { max: 700, min: 600 },
    items: 1,
    partialVisibilityGutter: 100,
  },
  largeMobile: {
    breakpoint: { max: 600, min: 500 },
    items: 1,
    partialVisibilityGutter: 80,
  },
  mobile: {
    breakpoint: { max: 500, min: 0 },
    items: 1,
    partialVisibilityGutter: 0,
  },
};
const Feature = ({ title, text, number, numberColor, shadow = false }: FeatureProps) => {
  return (
    <Stack
      spacing={{ base: 2 }}
      textAlign={'center'}
      boxShadow={shadow ? 'custom' : ''}
      px={{ base: 6, lg: 10 }}
      py={{ base: 8, lg: 6 }}
      rounded={'lg'}
      mb={4}>
      <Text color={numberColor} left={'2.8rem'} fontSize={{ base: 68, lg: '5.5vw' }} fontWeight={700}>
        {number}
      </Text>

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
      pb={{ base: 20, lg: 40 }}
      mt={{ base: 36, lg: 40 }}
      align={'start'}
      justify={'start'}
      w={'full'}
      h={'full'}>
      <Stack
        as={Box}
        px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
        textAlign={{ base: 'center', lg: 'start' }}
        align={{ base: 'center', lg: 'start' }}
        spacing={5}
        fontSize={{ base: 14, lg: 16 }}>
        <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }}>
          <Text as={'span'} color={'purple.500'}>
            За нас{' '}
          </Text>
          и нашата мисия
        </Heading>

        <Text>
          MyClassroom е иновативна онлайн обучителна платформа за ученици и студенти, предлагаща многообразие от онлайн
          уроци, водени от учители, професори и експерти от цялата страна. Нашата мисия е да подпомогнем сферата на
          образование в страната и да насърчим младите да учат и да се развиват с пълния си потенциал. Даваме също така
          възможност на учители и експерти да преподават онлайн своите частни уроци и курсове на платформата на
          MyClassroom. В MyClassroom ще намерите множество от онлайн уроци по всякакви предмети, включително математика,
          физика, химия, биология, чужди езици и други.
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
        h={{ base: 'full', lg: '50vh', xl: '70vh' }}
        px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }}
        py={{ base: '10', lg: 0 }}
        bg={'purple.100'}
        w={'full'}
        fontSize={{ base: 14, lg: 16 }}
        alignItems={'center'}
        direction={{ base: 'column', lg: 'row' }}>
        <Flex flex={1} align={{ base: 'center', lg: 'start' }} justify={{ base: 'center', lg: 'start' }} gap={8}>
          <Stack
            spacing={6}
            w={'full'}
            maxW={'xl'}
            align={{ base: 'center', lg: 'start' }}
            textAlign={{ base: 'center', lg: 'start' }}>
            <Stack spacing={2}>
              <Heading fontWeight={600} color={'purple.500'} fontSize={{ base: 24, lg: 32, xl: 40 }}>
                Кои сме ние?
              </Heading>

              <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }}>
                Екипът на MyClassroom
              </Heading>
            </Stack>

            <Text fontSize={{ base: 14, lg: 16 }}>
              Ние сме амбициозни и млади хора, обединени около една обща идея, да подобрим образованието в страната.
              Създадохме платформата за да осъществим връзката между ученици и студенти, нуждаещи се от допълнителна
              помощ в обучението си и преподаватели, предлагащи такава. Бихме искали да наложим една нова тенденция и да
              покажем, че при онлайн обучението всичко е по-лесно достъпно и удобно за всички. С помощта на MyClassroom
              ние вярваме, че успяхме да направим подготовката от вкъщи на всеки ученик в начален етап, зрелостник и
              висшист по – удобна, по – ефикасна и по – интерактивна.
            </Text>
          </Stack>
        </Flex>

        <Flex flex={1} maxH={{ base: 'inherit' }}>
          <Image rounded={'lg'} alt={'Group Image'} objectFit={'cover'} src={aboutUsBackground} />
        </Flex>
      </Stack>

      <Stack px={{ base: 8, sm: 16, md: 28, lg: 16, xl: 20, '2xl': 40 }} spacing={{ base: 16, md: 24 }}>
        <Stack as={Box} textAlign={{ base: 'center', lg: 'start' }} spacing={10} fontSize={{ base: 14, lg: 16 }}>
          <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'}>
            <Text as={'span'} color={'purple.500'}>
              Какви уроци{' '}
            </Text>{' '}
            предлага платформата?
          </Heading>
          <Text fontSize={{ base: 14, lg: 16 }}>
            MyClassroom предлага групови курсове и частни уроци, които се провеждат онлайн в реално време от нашите
            учители. Уроците на платформата обхващат една голяма част от учебните предмети в учебните заведения,
            включително математика, чужди езици, химия, биология и много други. Независимо дали сте склонни към
            колективно обучение или предпочитате персонализиран подход, MyClassroom предлага и двата вида допълнителни
            уроци, водени от доказани експерти и педагози.
          </Text>

          <Stack
            w={'full'}
            direction={{ base: 'column', lg: 'row' }}
            justify={'space-between'}
            mt={6}
            spacing={{ base: 10, lg: 0 }}>
            <Stack
              maxW={{ base: 'full', lg: '35vw' }}
              w={'full'}
              bg={'purple.100'}
              p={12}
              spacing={6}
              align={{ base: 'center', lg: 'start' }}>
              <Stack align={{ base: 'center', lg: 'start' }}>
                <Text fontSize={24} fontWeight={700} color={'purple.500'}>
                  Групови курсове
                </Text>
                <Box w={'70px'} h={'3px'} bg={'purple.500'}></Box>
              </Stack>

              <Text fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
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

            <Stack
              maxW={{ base: 'full', lg: '35vw' }}
              w={'full'}
              bg={'purple.100'}
              p={12}
              spacing={6}
              align={{ base: 'center', lg: 'start' }}>
              <Stack align={{ base: 'center', lg: 'start' }}>
                <Text fontSize={24} fontWeight={700} color={'purple.500'}>
                  Частни уроци
                </Text>
                <Box w={'70px'} h={'3px'} bg={'purple.500'}></Box>
              </Stack>

              <Text fontSize={{ base: 14, lg: 16 }} color={'grey.500'}>
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

        <Stack
          as={Box}
          textAlign={{ base: 'center' }}
          justify={'space-evenly'}
          fontSize={{ base: 14, lg: 16 }}
          h={{ base: 'full', lg: '50vh', xl: '75vh' }}>
          <Stack>
            <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={{ base: '130%', lg: '90%' }}>
              Защо да изберете точно нас?
            </Heading>

            <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'} color={'purple.500'}>
              5 причини{' '}
            </Heading>
          </Stack>

          <Hide below={'lg'}>
            <Image src={reasons} w={'full'} />
          </Hide>

          <Show below={'lg'}>
            <Box w={'full'} maxW={{ base: '80vw', md: '70vw' }}>
              <Carousel
                autoPlay={false}
                autoPlaySpeed={5000}
                responsive={responsive}
                partialVisible={true}
                showDots={true}
                infinite={true}
                arrows={false}>
                <Feature
                  title={'Многообразие'}
                  text={'Стотици курсове и частни уроци, водени от най-добрите професионалисти.'}
                  number={'01'}
                  numberColor={'#9BB1FF'}
                />

                <Feature
                  title={'Достъпност'}
                  text={'Напълно безплатна регистрация и достъп до курсове и уроци.'}
                  number={'02'}
                  numberColor={'#7694FF'}
                />

                <Feature
                  title={'Гъекавост'}
                  text={'Въможност за включване от всяка точка на странта в удобно за Вас време.'}
                  number={'03'}
                  numberColor={'#5C6CFF'}
                />

                <Feature
                  title={'Сигурност'}
                  text={'Без притеснение за скрити такси и изненадващи клаузи.'}
                  number={'04'}
                  numberColor={'#5E50F1'}
                />

                <Feature
                  title={'Прозрачност'}
                  text={'Прозрачни условия, пълна яснота и бързо клиентско обслужване.'}
                  number={'05'}
                  numberColor={'#4033D6'}
                />
              </Carousel>
            </Box>
          </Show>
        </Stack>

        <Stack
          direction={{ base: 'column', lg: 'row' }}
          w={'full'}
          fontSize={{ base: 14, lg: 16 }}
          justify={'space-between'}
          spacing={{ base: 12, md: 16, lg: 12 }}>
          <Flex
            flex={1}
            w="full"
            align={{ base: 'center', lg: 'start' }}
            justify={{ base: 'center', lg: 'start' }}
            gap={6}>
            <Stack
              spacing={6}
              w={'full'}
              maxW={{ base: 'full', lg: 'xl' }}
              align={{ base: 'center', lg: 'start' }}
              textAlign={{ base: 'center', lg: 'start' }}>
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
                as={ReactRouterLink}
                to={'/become-a-teacher'}
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
            {[1, 2, 3].map((el, index) => (
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
          fontSize={{ base: 14, lg: 16 }}
          w={'full'}
          mb={{ base: 0, lg: reviews?.length ? 20 : 0 }}>
          <Heading fontWeight={600} fontSize={{ base: 24, lg: 32, xl: 40 }} lineHeight={'150%'}>
            <Text as={'span'} color={'purple.500'}>
              Отзиви{' '}
            </Text>
            от родители
          </Heading>

          {reviews?.length ? (
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
          ) : (
            <Text fontSize={{ base: 18, lg: 20 }} color={'grey.500'}>
              Няма налични мнения на родители
            </Text>
          )}
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
            minW={{ base: 'inherit', lg: '35vw' }}
            maxW={{ base: 'full', lg: '45%' }}
            w={'full'}
            bg={'purple.100'}
            align={'center'}
            justify={'space-between'}
            p={6}
            spacing={{ base: 6, md: 4, lg: 6 }}
            direction={{ base: 'column', md: 'row' }}
            flexWrap={{ base: 'wrap', md: 'nowrap' }}>
            <Stack spacing={6} direction={{ base: 'column', md: 'row' }} w={'full'} align={'center'}>
              <Box
                bg={'purple.500'}
                w={{ base: '60px', md: '70px', lg: 'fit-content' }}
                h={{ base: 'fit-content', lg: 'fit-content' }}
                p={4}
                rounded={'md'}>
                <Image
                  boxSize={{ base: 'inherit', lg: '45px' }}
                  objectFit={{ base: 'contain', lg: 'contain' }}
                  src={capWhite}
                  alt="Cap"
                />
              </Box>

              <Stack maxW={{ base: 'full', md: '70%' }} align={{ base: 'center', md: 'start' }}>
                <Stack direction={'row'}>
                  <Text fontSize={18} fontWeight={700}>
                    Станете наш
                  </Text>
                  <Text fontSize={18} fontWeight={700} color={'purple.500'}>
                    ученик
                  </Text>
                </Stack>

                <Text fontSize={16} color={'grey.500'} textAlign={{ base: 'center', md: 'start' }}>
                  Разгледайте нашата селекция от курсове и частни уроци на най-разнообразни теми.
                </Text>
              </Stack>
            </Stack>

            <Image boxSize={8} objectFit="contain" src={arrowRight} alt="arrow" />
          </Stack>

          <Stack
            as={ReactRouterLink}
            to={'/become-a-teacher'}
            minW={{ base: 'inherit', lg: '35vw' }}
            maxW={{ base: 'full', lg: '45%' }}
            w={'full'}
            bg={'purple.100'}
            align={'center'}
            justify={'space-between'}
            p={6}
            spacing={{ base: 6, md: 4, lg: 6 }}
            direction={{ base: 'column', md: 'row' }}
            flexWrap={{ base: 'wrap', md: 'nowrap' }}>
            <Stack spacing={6} direction={{ base: 'column', md: 'row' }} w={'full'} align={'center'}>
              <Box
                bg={'purple.500'}
                w={{ base: '60px', md: '70px', lg: 'fit-content' }}
                h={{ base: 'fit-content', lg: 'fit-content' }}
                p={4}
                rounded={'md'}>
                <Image
                  boxSize={{ base: 'inherit', lg: '45px' }}
                  objectFit={{ base: 'contain', lg: 'contain' }}
                  src={groupWhite}
                  alt="Group"
                />
              </Box>

              <Stack maxW={{ base: 'full', md: '70%' }} align={{ base: 'center', md: 'start' }}>
                <Stack direction={'row'}>
                  <Text fontSize={18} fontWeight={700}>
                    Станете наш
                  </Text>
                  <Text fontSize={18} fontWeight={700} color={'purple.500'}>
                    учител
                  </Text>
                </Stack>

                <Text fontSize={16} color={'grey.500'} textAlign={{ base: 'center', md: 'start' }}>
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
