import React, { useContext, useEffect, useState } from 'react';
import Stomp from 'stompjs';

import { NavLink as ReactRouterLink, useLocation, useMatch } from 'react-router-dom';
import { Avatar, ButtonGroup, Center, Hide, Link as ChakraLink, PopoverHeader, useToast } from '@chakra-ui/react';

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Img,
  Slide,
  PopoverContent,
  PopoverBody,
  PopoverCloseButton,
  PopoverArrow,
  Popover,
  PopoverTrigger,
  Show,
  useColorModeValue,
  useDisclosure,
  useBreakpointValue,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';

import AuthContext from '../../context/AuthContext';
import { logo, logoWhite } from '../../images';
import {
  bell,
  heart,
  bottom,
  message,
  bellWhite,
  messageWhite,
  heartWhite,
  bottomWhite,
  settings,
  logout,
  money,
  heartFull,
} from '../../icons';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { axiosInstance } from '../../axios';
import { getResponseMessage } from '../../helpers/response.util';

interface NavItem {
  key: string;
  label: string;
  path?: string;
  params?: object;
}

const NAV_ITEMS_TEACHER: Array<NavItem> = [
  {
    key: 'dashboard',
    label: 'Моите уроци',
    path: '/dashboard',
  },
  {
    key: 'calendar',
    label: 'Календар',
    path: '/calendar',
  },
  {
    key: 'help-center',
    label: 'Помощен център',
    path: '/help-center',
  },
];

const NAV_ITEMS_STUDENT: Array<NavItem> = [
  {
    key: 'courses',
    label: 'Курсове',
    path: '/courses',
    params: { isPrivateLesson: false },
  },
  {
    key: 'lessons',
    label: 'Частни уроци',
    path: 'lessons',
    params: { isPrivateLesson: false },
  },
  {
    key: 'dashboard',
    label: 'Моите уроци',
    path: '/my-dashboard',
  },
  {
    key: 'calendar',
    label: 'Календар',
    path: '/calendar',
  },
];

const NAV_ITEMS_DEFAULT: Array<NavItem> = [
  {
    key: 'about',
    label: 'За нас',
    path: '/about-us',
  },
  {
    key: 'courses',
    label: 'Курсове',
    path: '/courses',
    params: { isPrivateLesson: false },
  },
  {
    key: 'lessons',
    label: 'Частни уроци',
    path: 'lessons',
    params: { isPrivateLesson: false },
  },
  {
    key: 'become-a-teacher',
    label: 'Стани учител',
    path: '/become-a-teacher',
  },
];

export const Menu = ({ onLoginOpen, setModalTabIndex }: { onLoginOpen: any; setModalTabIndex: any }) => {
  const { getItem } = useLocalStorage();

  const { userData, logoutUser, authTokens } = useContext(AuthContext);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const [navItems, setNavItems] = useState(NAV_ITEMS_DEFAULT);
  const [stompClient, setStompClient] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const [hasMessageNotification, setHasMessageNotification] = useState(() =>
    getItem('hasMessageNotification') === 'false' ? false : true,
  );

  const [whiteMenu, setWhiteMenu] = useState(false);
  const location = useLocation();
  const matchFavourites = useMatch('/favourites');
  const toast = useToast();

  const handleModalOpen = (tabIndex: number) => {
    setModalTabIndex(tabIndex);
    onLoginOpen();
  };

  const getNotificationsHistory = async () => {
    if (userData) {
      try {
        const res = await axiosInstance.get(`/lessons/getNotifications`);

        setNotifications(res.data);
      } catch (err) {
        toast({
          title: getResponseMessage(err),
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }
    }
  };

  useEffect(() => {
    location.pathname === '/' || location.pathname === '/help-center' || location.pathname === '/help-center-teacher'
      ? setWhiteMenu(true)
      : setWhiteMenu(false);
  }, [location.pathname]);

  useEffect(() => {
    location.pathname.includes('/messages') && setHasMessageNotification(false);
  }, [location.pathname, hasMessageNotification]);

  useEffect(() => {
    isOpen && onClose();
  }, [location]);

  useEffect(() => {
    switch (userData?.role) {
      case 'TEACHER':
        setNavItems(NAV_ITEMS_TEACHER);
        break;
      case 'STUDENT':
        setNavItems(NAV_ITEMS_STUDENT);
        break;
      default:
        setNavItems(NAV_ITEMS_DEFAULT);
    }
  }, [userData]);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/ws');
    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
      setStompClient(stomp);
      stomp.subscribe(`/user/${authTokens?.access_token}/queue/notifications`, message => {
        const newNotification = JSON.parse(message.body);
        setNotificationType(newNotification.body);
        setTimeout(() => {
          setHasMessageNotification(newNotification?.chat);
          localStorage.setItem('hasMessageNotification', JSON.stringify(!!newNotification?.chat));
        }, 500);
      });
    });

    return () => {
      if (stomp) stomp.disconnect();
    };
  }, []);

  useEffect(() => {
    getNotificationsHistory();
  }, [userData]);

  return (
    <Box
      position="absolute"
      w={'full'}
      px={useBreakpointValue({ base: 8, md: 16, lg: 16, xl: 20, '2xl': 40 })}
      py={useBreakpointValue({ base: 4, md: 10, xl: 14 })}>
      <Flex bg="transparent" color={'white'} w={'full'} minH={'60px'} align={'center'} justify={'space-between'}>
        <Flex flex={{ base: 1, md: 0 }} ml={{ base: -2 }} display={{ base: 'flex', lg: 'none' }}>
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? (
                <CloseIcon w={{ base: '5vw', md: 6 }} h={{ base: 6, md: 8 }} zIndex={20} color={'purple.500'} />
              ) : (
                <HamburgerIcon
                  w={{ base: '8vw', md: 8 }}
                  h={{ base: 6, md: 8 }}
                  color={whiteMenu ? 'white' : 'purple.500'}
                />
              )
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
        <Flex justify={{ base: 'center', lg: 'space-between' }}>
          <Box as={ReactRouterLink} to={'/'} zIndex={20}>
            <Img
              h={{ base: '8vw', sm: '34px', lg: '34px', xl: '38px' }}
              src={isOpen || !whiteMenu ? logo : logoWhite}
              alt={'Logo'}
              fill={'white'}
            />
          </Box>
        </Flex>

        <Flex
          flex={{ base: 0, md: 1 }}
          display={{ base: 'none', lg: 'flex' }}
          justify={{ base: 'end', lg: 'center' }}
          ml={10}>
          <DesktopNav isHomePage={whiteMenu} navItems={navItems} />
        </Flex>

        {userData ? (
          <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} align={'center'} direction={'row'} spacing={1}>
            <Show above={'lg'}>
              {userData.role === 'STUDENT' && (
                <IconButton
                  as={ReactRouterLink}
                  to={'/favourites'}
                  bg="transparent"
                  aria-label="favourites"
                  _hover={{ bg: 'transparent', transform: 'scale(1.1)' }}
                  icon={<Img src={whiteMenu ? heartWhite : matchFavourites ? heartFull : heart} h={5} w={'full'} />}
                />
              )}

              <ButtonGroup
                as={ReactRouterLink}
                to={'/messages'}
                size="sm"
                isAttached
                variant="link"
                _hover={{ textDecoration: 'none', bg: 'transparent', transform: 'scale(1.1)' }}
                transition={'transform .2s'}
                position={'relative'}>
                <IconButton
                  bg="transparent"
                  aria-label="messages"
                  _hover={{ bg: 'transparent' }}
                  icon={<Img src={whiteMenu ? messageWhite : message} h={5} w={'full'} />}
                />

                {hasMessageNotification ? (
                  <Box
                    position={'absolute'}
                    right={'3px'}
                    top={'-2px'}
                    rounded={'lg'}
                    h={'10px'}
                    w={'10px'}
                    bg={'red'}
                    zIndex={20}></Box>
                ) : null}
              </ButtonGroup>

              <Popover isLazy>
                <PopoverTrigger>
                  <IconButton
                    bg="transparent"
                    aria-label="notifications"
                    _hover={{ bg: 'transparent', transform: 'scale(1.1)' }}
                    icon={<Img src={whiteMenu ? bellWhite : bell} h={5} w={'full'} />}
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverHeader fontSize={18} fontWeight="500" color={'grey.600'} textAlign={'left'} border={'none'}>
                    Известия
                  </PopoverHeader>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody
                    minH={'150px'}
                    maxH={'300px'}
                    overflow-y={'auto'}
                    css={{
                      '&::-webkit-scrollbar': {
                        width: '6px',
                      },
                      '&::-webkit-scrollbar-track': {
                        width: '6px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#5431D6',
                        borderRadius: '24px',
                      },
                    }}>
                    <Center minH={'100px'}>
                      <Text color={'grey.400'} fontSize={16}>
                        {' '}
                        Нямате налични известия
                      </Text>
                    </Center>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Show>

            <Popover placement="bottom-start">
              <PopoverTrigger>
                <ButtonGroup
                  size="sm"
                  isAttached
                  variant="link"
                  _hover={{ textDecoration: 'none', bg: 'transparent', transform: 'scale(1.05)' }}
                  transition={'transform .2s'}>
                  <Avatar
                    size={{ base: 'md', md: 'md' }}
                    p={{ base: 1, md: 0 }}
                    name={`${userData?.name} ${userData?.surname}`}
                    src={userData?.picture}
                  />

                  <Hide below={'md'}>
                    <IconButton
                      bg="transparent"
                      aria-label="favourites"
                      icon={<Img src={whiteMenu ? bottomWhite : bottom} h={{ base: 3, md: 5 }} w={'full'} />}
                    />
                  </Hide>
                </ButtonGroup>
              </PopoverTrigger>
              <PopoverContent w={'fit-content'} p={0}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverBody color={'grey.500'} p={0} py={6}>
                  <Stack w={'full'} minW={{ base: '100px', lg: '200px' }} spacing={4}>
                    <ButtonGroup
                      as={ReactRouterLink}
                      to={'/my-profile'}
                      size="sm"
                      isAttached
                      variant="link"
                      _hover={{ textDecoration: 'none', bg: 'purple.100' }}
                      transition={'transform .2s'}>
                      <Stack w={'full'} direction={'row'} justify={'start'} align={'center'} spacing={2} px={6} py={2}>
                        <IconButton
                          bg="transparent"
                          aria-label="settings"
                          icon={<Img src={settings} h={5} w={'full'} />}
                        />

                        <Text _hover={{ color: 'purple.500' }}>Настройки</Text>
                      </Stack>
                    </ButtonGroup>

                    <ButtonGroup
                      as={ReactRouterLink}
                      to={'/favourites'}
                      size="sm"
                      isAttached
                      variant="link"
                      _hover={{ textDecoration: 'none', bg: 'purple.100' }}
                      transition={'transform .2s'}>
                      <Stack w={'full'} direction={'row'} justify={'start'} align={'center'} spacing={2} px={6} py={2}>
                        <IconButton
                          bg="transparent"
                          aria-label="favourites"
                          icon={<Img src={heart} h={5} w={'full'} />}
                        />

                        <Text _hover={{ color: 'purple.500' }}>Любими</Text>
                      </Stack>
                    </ButtonGroup>

                    <ButtonGroup
                      as={ReactRouterLink}
                      to={'/messages'}
                      size="sm"
                      isAttached
                      variant="link"
                      _hover={{ textDecoration: 'none', bg: 'purple.100' }}
                      transition={'transform .2s'}>
                      <Stack w={'full'} direction={'row'} justify={'start'} align={'center'} spacing={2} px={6} py={2}>
                        <IconButton
                          bg="transparent"
                          aria-label="messages"
                          icon={<Img src={message} h={5} w={'full'} />}
                        />

                        <Text _hover={{ color: 'purple.500' }}>Съобщения</Text>
                      </Stack>
                    </ButtonGroup>

                    {userData.role === 'STUDENT' && (
                      <ButtonGroup
                        as={ReactRouterLink}
                        to={'/transactions'}
                        size="sm"
                        isAttached
                        variant="link"
                        _hover={{ textDecoration: 'none', bg: 'purple.100' }}
                        transition={'transform .2s'}>
                        <Stack
                          w={'full'}
                          direction={'row'}
                          justify={'start'}
                          align={'center'}
                          spacing={2}
                          px={6}
                          py={2}>
                          <IconButton
                            bg="transparent"
                            aria-label="payments"
                            icon={<Img src={settings} h={5} w={'full'} />}
                          />

                          <Text _hover={{ color: 'purple.500' }}>Плащания</Text>
                        </Stack>
                      </ButtonGroup>
                    )}

                    <ButtonGroup
                      as={ReactRouterLink}
                      to={userData?.role === 'STUDENT' ? '/help-center' : '/help-center-teacher'}
                      size="sm"
                      isAttached
                      variant="link"
                      _hover={{ textDecoration: 'none', bg: 'purple.100' }}
                      transition={'transform .2s'}>
                      <Stack w={'full'} direction={'row'} justify={'start'} align={'center'} spacing={2} px={6} py={2}>
                        <IconButton
                          bg="transparent"
                          aria-label="payments"
                          icon={<Img src={money} h={5} w={'full'} />}
                        />

                        <Text _hover={{ color: 'purple.500' }}>Помощ</Text>
                      </Stack>
                    </ButtonGroup>

                    <ButtonGroup
                      size="sm"
                      variant="link"
                      _hover={{ textDecoration: 'none', bg: 'purple.100', color: 'purple.500' }}
                      transition={'transform .2s'}
                      w={'full'}
                      px={6}
                      py={2}
                      onClick={() => logoutUser()}>
                      <IconButton bg="transparent" aria-label="logout" icon={<Img src={logout} h={5} w={'full'} />} />
                      <Button color={'purple.500'} _hover={{ textDecoration: 'none', opacity: 0.9 }}>
                        <Text fontSize={16} fontWeight={400}>
                          Изход
                        </Text>
                      </Button>
                    </ButtonGroup>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Stack>
        ) : (
          <Stack flex={{ base: 1, md: 0 }} justify={'flex-end'} direction={'row'} spacing={10}>
            <Button
              zIndex={20}
              fontSize={{ base: '5vw', sm: 24, lg: '1.6vw', xl: 20, '2xl': 24 }}
              fontWeight={700}
              variant={'link'}
              color={whiteMenu ? 'white' : 'purple.500'}
              _hover={{ color: whiteMenu ? 'white' : 'purple.500' }}
              onClick={() => handleModalOpen(0)}>
              Вход
            </Button>

            <Show above="lg">
              <Button
                size={{ base: 'lg', lg: 'md', xl: 'md', '2xl': 'lg' }}
                w={'full'}
                bg={whiteMenu ? 'white' : 'purple.500'}
                color={whiteMenu ? 'purple.500' : 'white'}
                fontSize={{ base: 16, md: 18, lg: '1.6vw', xl: 20, '2xl': 24 }}
                fontWeight={700}
                onClick={() => handleModalOpen(1)}
                _hover={{ opacity: '0.9' }}
                _focus={{ outline: 'none' }}
                _active={{ bg: whiteMenu ? 'white' : 'purple.500' }}>
                Регистрация
              </Button>
            </Show>
          </Stack>
        )}
      </Flex>

      <Slide in={isOpen} direction="top" style={{ zIndex: 10 }}>
        <MobileNav navItems={navItems} />
      </Slide>
    </Box>
  );
};

const DesktopNav = ({ isHomePage, navItems }: { isHomePage: boolean; navItems: NavItem[] }) => {
  return (
    <Stack direction={'row'} spacing={4}>
      {navItems?.map(navItem => (
        <Box key={navItem.label}>
          <ChakraLink
            as={ReactRouterLink}
            to={navItem.path ?? '#'}
            p={2}
            fontSize={{ base: 16, md: 18, lg: '1.6vw', '2xl': 24 }}
            fontWeight={500}
            color={isHomePage ? 'white' : 'grey.600'}
            _hover={{ textDecoration: 'none', opacity: 0.9 }}
            _activeLink={{ color: 'purple.500' }}>
            {navItem.label}
          </ChakraLink>
        </Box>
      ))}
    </Stack>
  );
};

const MobileNav = ({ navItems }: { navItems: NavItem[] }) => {
  return (
    <Stack
      bg={'purple.100'}
      borderRadius={'0 48% 0 0'}
      pt={32}
      w={'full'}
      h={'100vh'}
      display={{ base: 'flex', lg: 'none' }}
      align={'center'}
      spacing={4}>
      {navItems?.map(({ key, ...navItem }) => <MobileNavItem key={key} {...navItem} />)}
    </Stack>
  );
};

const MobileNavItem = ({ label, path }: NavItem) => {
  const { isOpen } = useDisclosure();

  return (
    <Stack spacing={4}>
      <Box
        py={2}
        as={ReactRouterLink}
        to={path ?? '#'}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: 'none',
        }}>
        <Text fontWeight={600} fontSize={22} color={'grey.500'}>
          {label}
        </Text>
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}></Stack>
      </Collapse>
    </Stack>
  );
};

export default Menu;
