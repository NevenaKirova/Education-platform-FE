import React, { useCallback, useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Navigate, useParams } from 'react-router-dom';
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
import useWebSocket, { ReadyState } from 'react-use-websocket';

import PageLoader from '../utils/loader.component';
import { axiosInstance } from '../axios';
import { getResponseMessage } from '../helpers/response.util';

import { noData } from '../images';
import { attach } from '../icons';
import { SubmitHandler, useForm } from 'react-hook-form';
import Stomp from 'stompjs';

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

  useEffect(() => {
    try {
      const res = axiosInstance.get(`users/getMessages`);

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
  }, []);

  // useEffect(() => {
  //   try {
  //     const res = axiosInstance.get(`users/getMessage/${userId}`);
  //
  //     console.log(res.data);
  //   } catch (err) {
  //     toast({
  //       title: getResponseMessage(err),
  //       status: 'error',
  //       duration: 3000,
  //       isClosable: true,
  //       position: 'top-right',
  //     });
  //   }
  // }, [userId]);

  useEffect(() => {
    console.log(chatRooms);
  }, [chatRooms]);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  useEffect(() => {
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
  }, []);

  const sendMessage = content => {
    const message = {
      senderId: userData?.id,
      recipientId: userData?.id,
      content: content.trim(),
    };

    // try {
    //   const res = axiosInstance.get(`/sendMessage/${userData?.id}&&${userData?.id}&&${content.trim()}`);
    //
    //   console.log(res);
    // } catch (err) {
    //   toast({
    //     title: getResponseMessage(err),
    //     status: 'error',
    //     duration: 3000,
    //     isClosable: true,
    //     position: 'top-right',
    //   });
    // }

    // stompClient.send('/app/chat', {}, JSON.stringify(message));
  };

  if (!user) return <Navigate to={'/'} replace />;

  return isLoading ? (
    <PageLoader isLoading={isLoading} />
  ) : (
    <Stack
      spacing={{ base: 8, lg: 10 }}
      py={{ base: 0, lg: 10 }}
      mt={{ base: 36, lg: 40 }}
      align={'center'}
      justify={'center'}
      flex={1}
      w={'full'}
      minH={'85vh'}>
      <Stack
        direction={'row'}
        maxW={'82vw'}
        w={'full'}
        flex={1}
        rounded={'md'}
        bg={'purple.100'}
        py={{ base: 0, lg: 10 }}
        px={{ base: 10 }}>
        <Stack w={'40%'} spacing={8}>
          <Heading textAlign={'left'} fontSize={{ base: 24, lg: 32, xl: 34 }} color={'grey.600'}>
            Съобщения
          </Heading>

          <InputGroup size={{ base: 'sm', lg: 'md' }} bg={'white'} border="white" rounded={'md'} maxW={'90%'}>
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
              <Stack flex={1} w={'full'}>
                <Text>Messages:</Text>
                {messages.map((msg, index) => (
                  <Text key={index}>{`From: ${msg.senderId}, Content: ${msg.content}`}</Text>
                ))}

                {messages.map((message, index) => (
                  <li key={index}>{message.content}</li>
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
