import React, { useContext, useEffect, useRef, useState } from 'react';
import { Navigate, NavLink as ReactRouterLink, useNavigate, useParams } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import Stomp from 'stompjs';
import { format } from 'date-fns';
import {
  Button,
  Heading,
  Stack,
  Text,
  InputGroup,
  Input,
  InputRightElement,
  Image,
  Avatar,
  IconButton,
  Img,
  useToast,
} from '@chakra-ui/react';

import PageLoader from '../utils/loader.component';
import { axiosInstance } from '../axios';
import { getResponseMessage } from '../helpers/response.util';
import AuthContext from '../context/AuthContext';

import { noData } from '../images';
import { attach } from '../icons';

const MessagesPage = () => {
  const { user, userData, authTokens } = useContext(AuthContext);
  const toast = useToast();
  const { userId } = useParams();

  const scrollRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messageHistory, setMessageHistory] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [hasMessages, setHasMessages] = useState(false);

  const [stompClient, setStompClient] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<any> = async data => {
    sendMessage(data.message);
  };

  const getChatRooms = async () => {
    try {
      const res = await axiosInstance.get(`users/getMessages`);

      setChatRooms(res.data);
      res.data?.length ? setHasMessages(true) : setHasMessages(false);

    } catch (err) {
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const getMessageHistory = async () => {
    try {
      const res = await axiosInstance.get(`users/getMessage/${userId}`);

      setMessageHistory(res.data);
      setIsLoading(false);
    } catch (err) {
      toast({
        title: getResponseMessage(err),
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const sendMessage = content => {
    const message = {
      senderId: authTokens?.access_token,
      recipientId: userId,
      content: content.trim(),
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date().getTime(), 'HH:mm'),
    };

    if (stompClient && stompClient.connected) {
      stompClient.send('/app/chat', {}, JSON.stringify(message));
      setMessageHistory(prevMessages => [...prevMessages, message]);
      reset();
    } else {
      console.error('WebSocket connection not established.');
    }
  };

  useEffect(() => {
    getChatRooms();
  }, [messageHistory]);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      setMessageHistory([]);
      getMessageHistory();
    }
  }, [userId]);

  useEffect(() => {
    if (userData) {
      const socket = new WebSocket('ws://localhost:8080/ws');
      const stomp = Stomp.over(socket);

      stomp.connect({}, () => {
        setStompClient(stomp);
        stomp.subscribe(`/user/${userData?.id}/queue/messages`, message => {
          const newMessage = JSON.parse(message.body);
          setMessageHistory(prevMessages => [...prevMessages, newMessage]);
        });
      });

      return () => {
        if (stomp) stomp.disconnect();
      };
    }
  }, [userData]);

  useEffect(() => {
    if (scrollRef) {
      scrollRef.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'auto' });
      });
    }
  }, [userId]);


  useEffect(()=>{
    if(!hasMessages && !messageHistory.length){
      setIsLoading(false);
    }
  },[hasMessages]);

  if (!user) return <Navigate to={'/'} replace />;
  if (!userId && hasMessages) return <Navigate to={`/messages/${chatRooms[0]?.recipientId}`} replace />;

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <Stack
        spacing={{ base: 8, lg: 10 }}
        pb={{ base: 0, lg: 10 }}
        px={{ base: 8, md: 16, xl: 20, '2xl': 40 }}
        mt={{ base: 36, lg: 40 }}
        align={'center'}
        justify={'center'}
        flex={1}
        w={'full'}
        minH={'85vh'}>
        <Stack
          direction={'row'}
          w={'full'}
          flex={1}
          rounded={'md'}
          bg={'purple.100'}
          py={{ base: 0, lg: 10 }}
          px={{ base: 10 }}>
          <Stack maxW={{ base: '40%', lg: '35%' }} w={'full'} spacing={8}>
            <Heading textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 34 }} color={'grey.600'}>
              Съобщения
            </Heading>

            <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'white'} border="white" rounded={'md'} maxW={'95%'}>
              <Input pr="4.5rem" type="text" placeholder="Търси по име" />
              <InputRightElement width="4.5rem">
                <Button
                  bg={'transparent'}
                  color={'purple.500'}
                  fontSize={14}
                  fontWeight={700}
                  w={'fit'}
                  h={'fit'}
                  mr={4}
                  p={2}>
                  Търси
                </Button>
              </InputRightElement>
            </InputGroup>

            <Stack
              overflowY={'auto'}
              maxH={'55vh'}
              h={'full'}
              w={'full'}
              spacing={6}
              css={{
                '&::-webkit-scrollbar': {
                  width: '6px',
                  background: '#EBEDF1',
                },
                '&::-webkit-scrollbar-track': {
                  width: '6px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#5431D6',
                  borderRadius: '24px',
                },
              }}>
              {chatRooms?.map((el, index) => (
                <Stack
                  as={ReactRouterLink}
                  to={`/messages/${el?.recipientId}`}
                  bg={userId == el?.recipientId ? 'white' : 'inherit'}
                  py={4}
                  rounded={'md'}
                  key={index}
                  direction={'row'}
                  align={'center'}
                  justify={'space-between'}
                  w={'95%'}
                  overflow={'hidden'}
                  minH={'55px'}
                  px={4}>
                  <Stack
                    flex={1}
                    direction={'row'}
                    align={'center'}
                    justify={'start'}
                    maxW={{ base: '90%', lg: '82%' }}
                    w={'full'}
                    spacing={4}>
                    <Avatar size={{ base: 'sm', md: 'md' }} src={"http://localhost:8080/api/v1/users/images/Resource_838652031_0_IMG_1078.JPG"} />

                    <Stack maxW={{ base: '55%', xl: '82%' }} align={'start'} spacing={0}>
                      <Text color={'grey.600'} fontSize={18} fontWeight={500}>
                        {el.name}
                      </Text>

                      <Text
                        color={'grey.500'}
                        fontSize={16}
                        fontWeight={400}
                        noOfLines={1}
                        overflow={'hidden'}
                        textOverflow={'ellipsis'}
                        maxW={{ base: 'full' }}>
                        {el?.senderId == userData?.id ? 'Вие: ' : ''} {el?.content}
                      </Text>
                    </Stack>
                  </Stack>

                  <Stack align={'start'} justify="start" h="full" w={'fit'}>
                    <Text color={'grey.500'} fontSize={14} fontWeight={500}>
                      {el?.time}
                    </Text>
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </Stack>

          <Stack flex={1} bg={'white'} align={'center'} justify={'center'} rounded={'md'}>
            {!hasMessages && !userId && !isLoading ? (
              <Stack justify={'center'} align={'center'} spacing={6}>
                <Image src={noData} alt="No messages" h={'40vh'} />
                <Text color={'grey.400'}>Нямате проведени разговори </Text>
              </Stack>
            ) : (
              <Stack justify={'start'} align={'center'} spacing={6} h={'full'} w={'full'} pl={10} py={10} pr={6}>
                <Stack flex={0} w={'full'} overflow-y={'auto'} maxH={'60vh'} h={'full'}>
                  <Stack direction={'row'} spacing={4} align={'center'} justify={'start'}>
                    <Avatar
                      size="md"
                      name={chatRooms.find(el => el?.recipientId == userId)?.name}
                      src={`${chatRooms.find(el => el?.recipientId == userId)?.picture}`}
                    />
                    <Text color={'grey.600'} fontSize={20}>
                      {chatRooms.find(el => el?.recipientId == userId)?.name}
                    </Text>
                  </Stack>
                </Stack>
                <Stack
                  flex={1}
                  w={'full'}
                  spacing={8}
                  overflow={'auto'}
                  maxH={'45vh'}
                  h={'full'}
                  pr={6}
                  pb={6}
                  css={{
                    '&::-webkit-scrollbar': {
                      width: '6px',
                      background: '#EBEDF1',
                    },
                    '&::-webkit-scrollbar-track': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#5431D6',
                      borderRadius: '24px',
                    },
                  }}
                  ref={scrollRef}>
                  {messageHistory?.map((msg, index) => (
                    <Stack key={index} spacing={2} align={msg.senderId !== userId ? 'flex-end' : 'flex-start'}>
                      <Stack
                        direction={'row'}
                        spacing={4}
                        align={'center'}
                        w={'full'}
                        justify={msg.senderId !== userId ? 'flex-end' : 'flex-start'}>
                        {msg.senderId === userId ? (
                          <Avatar
                            size="sm"
                            name={chatRooms.find(el => el?.recipientId == userId)?.name}
                            src={chatRooms.find(el => el?.recipientId == userId)?.picture}
                          />
                        ) : null}

                        <Stack
                          maxW={'50%'}
                          bg={msg.senderId !== userId ? 'purple.200' : 'white'}
                          boxShadow={'custom'}
                          p={3}
                          px={4}
                          rounded={'xl'}
                          align={'start'}>
                          <Text textAlign={'left'}>{msg.content}</Text>
                        </Stack>
                      </Stack>

                      <Stack
                        direction={'row'}
                        spacing={2}
                        fontSize={14}
                        fontWeight={400}
                        color={'grey.400'}
                        maxW={'58%'}
                        justify={'end'}>
                        <Text>{msg.date}</Text>
                        <Text>{msg.time}</Text>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack flex={0} w={'full'} direction={'row'} spacing={4}>
                    <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'white'} border="white" rounded={'md'} maxW={'90%'}>
                      <Input
                        pr="4.5rem"
                        type="text"
                        bg={'grey.100'}
                        placeholder="Въведете тук"
                        {...register('message')}
                      />
                      <InputRightElement width="4.5rem">
                        <IconButton
                          aria-label={'attach file'}
                          size="xs"
                          bg={'none'}
                          _hover={{ bg: 'none' }}
                          icon={<Img src={attach} w={'full'} />}
                        />
                      </InputRightElement>
                    </InputGroup>

                    <Button
                      type={'submit'}
                      size={{ base: 'md' }}
                      w={'fit-content'}
                      px={16}
                      py={0}
                      bg={'purple.500'}
                      color={'white'}
                      fontSize={16}
                      fontWeight={700}
                      _hover={{ opacity: '0.95' }}
                      _focus={{ outline: 'none' }}
                      _active={{ bg: 'purple.500' }}>
                      Изпрати
                    </Button>
                  </Stack>
                </form>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default MessagesPage;
