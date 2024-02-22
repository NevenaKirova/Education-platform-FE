import React, { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Navigate, NavLink as ReactRouterLink, useParams } from 'react-router-dom';
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

import { noData } from '../images';
import { attach } from '../icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import Stomp from 'stompjs';
import { useErrorHandler } from 'next/dist/client/components/react-dev-overlay/internal/helpers/use-error-handler';

const MessagesPage = () => {
  const { user, userData } = useContext(AuthContext);
  const toast = useToast();
  const { userId } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  // const [messageHistory, setMessageHistory] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [hasMessages, setHasMessages] = useState(false);

  const [messages, setMessages] = useState([]);
  const [stompClient, setStompClient] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: errorsReg },
    setValue,
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

  useEffect(() => {
    getChatRooms();
  }, []);

  // useEffect(() => {
  //   if (userId) {
  //     try {
  //       const res = axiosInstance.get(`users/getMessage/${userId}`);
  //
  //       console.log(res.data);
  //     } catch (err) {
  //       toast({
  //         title: getResponseMessage(err),
  //         status: 'error',
  //         duration: 3000,
  //         isClosable: true,
  //         position: 'top-right',
  //       });
  //     }
  //   }
  // }, [userId]);

  // useEffect(() => {
  //   console.log(chatRooms);
  // }, [chatRooms]);
  //
  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  useEffect(() => {
    if (userData) {
      const socket = new WebSocket('ws://localhost:8080/ws');
      const stomp = Stomp.over(socket);
      stomp.connect({}, () => {
        setStompClient(stomp);
        stomp.subscribe(`/user/${userData?.id}/queue/messages`, message => {
          const newMessage = JSON.parse(message.body);

          setMessages(prevMessages => [...prevMessages, newMessage]);
        });
      });

      return () => {
        if (stomp) stomp.disconnect();
      };
    }
  }, [userData]);

  const sendMessage = content => {
    const message = {
      senderId: userData?.id,
      recipientId: userId,
      content: content.trim(),
    };

    if (stompClient && stompClient.connected) {
      stompClient.send('/app/chat', {}, JSON.stringify(message));
      setMessages(prevMessages => [...prevMessages, message]);
      reset();
    } else {
      console.error('WebSocket connection not established.');
    }
  };

  if (!user) return <Navigate to={'/'} replace />;

  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <Stack
      spacing={{ base: 8, lg: 10 }}
      py={{ base: 0, lg: 10 }}
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

          <Stack overflow={'hidden'} w={'full'}>
            {chatRooms?.map((el, index) => (
              <Stack
                as={ReactRouterLink}
                to={`/messages/${el?.contactId}`}
                bg={userId == el?.contactId ? 'white' : 'inherit'}
                py={4}
                rounded={'md'}
                key={index}
                direction={'row'}
                align={'center'}
                justify={'space-between'}
                w={'95%'}
                overflow={'hidden'}
                px={4}>
                <Stack
                  flex={1}
                  direction={'row'}
                  align={'center'}
                  justify={'start'}
                  maxW={{ base: '90%', lg: '82%' }}
                  w={'full'}
                  spacing={4}>
                  <Avatar
                    size={{ base: 'sm', md: 'md' }}
                    src={'https://avatars0.githubusercontent.com/u/1164541?v=4'}
                  />

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
                      {el?.messages[el.messages?.length - 1]?.senderId == userData.id ? 'Вие: ' : ''}{' '}
                      {el?.messages[el.messages?.length - 1]?.content}
                    </Text>
                  </Stack>
                </Stack>

                <Stack align={'start'} justify="start" h="full" w={'fit'}>
                  <Text color={'grey.500'} fontSize={14} fontWeight={500}>
                    {el?.messages[el.messages?.length - 1]?.time}
                  </Text>
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack flex={1} bg={'white'} align={'center'} justify={'center'} rounded={'md'}>
          {!hasMessages && !userId ? (
            <Stack justify={'center'} align={'center'} spacing={6}>
              <Image src={noData} alt="No messages" h={'40vh'} />
              <Text color={'grey.400'}>Нямате проведени разговори </Text>
            </Stack>
          ) : (
            <Stack justify={'start'} align={'center'} spacing={6} h={'full'} w={'full'} p={10}>
              <Stack flex={0} w={'full'}>
                <Stack direction={'row'} spacing={4} align={'center'} justify={'start'}>
                  <Avatar size="md" name={``} src="https://bit.ly/dan-abramov" />
                  <Text color={'grey.600'} fontSize={20}>
                    {/*{course?.teacherName} {course?.teacherSurname}*/}
                    Калина Иванова
                  </Text>
                </Stack>
              </Stack>
              <Stack flex={1} w={'full'} spacing={4}>
                {messages.map((msg, index) => (
                  <Stack
                    w={'50%'}
                    key={'index'}
                    bg={msg.senderId === userData?.id ? 'purple.200' : 'white'}
                    boxShadow={'custom'}
                    alignSelf={msg.senderId === userData?.id ? 'flex-end' : 'flex-start'}
                    p={3}
                    px={4}
                    rounded={'xl'}
                    align={'start'}>
                    <Text key={index} textAlign={'left'}>
                      {msg.content}
                    </Text>
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
  );
};

export default MessagesPage;
