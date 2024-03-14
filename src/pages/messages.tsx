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
  Box,
  useToast,
  Hide,
} from '@chakra-ui/react';

import PageLoader from '../utils/loader.component';
import { axiosInstance } from '../axios';
import { getResponseMessage } from '../helpers/response.util';
import AuthContext from '../context/AuthContext';

import { noData } from '../images';
import { attach, fileDownload, upload } from '../icons';

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
  const [isWebSocketReady, setIsWebSocketReady] = useState(false);
  const [file, setFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit: SubmitHandler<any> = async data => {
    file ? sendMessage({ content: file, isFile: true }) : sendMessage({ content: data.message });
  };

  const getChatRooms = async () => {
    if (user) {
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
    }
  };

  const handleFileUpload = async file => {
    const formData = new FormData();
    formData.append('file', file[0]);

    try {
      const res = await axiosInstance.post(`users/uploadChatFile`, formData);

      setFile(res.data);
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
    if (user) {
      try {
        const res = await axiosInstance.get(`users/getMessage/${userId}`);

        setMessageHistory(res.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
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

  const sendMessage = ({ content, isFile = false }: { content: string; isFile?: boolean }) => {
    const message = {
      senderId: authTokens?.access_token,
      recipientId: userId,
      content: content?.trim(),
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date().getTime(), 'HH:mm'),
      file: isFile,
    };

    if (isWebSocketReady && stompClient && stompClient.connected) {
      stompClient.send('/app/chat', {}, JSON.stringify(message));
      setMessageHistory(prevMessages => [...prevMessages, message]);
      reset();
      setFile(null);
    } else {
      console.error('WebSocket connection not established.');
    }
  };

  const getUploadedFile = async filePath => {
    try {
      await axiosInstance.get(`users/getChatFile/${filePath}`, {
        responseType: 'blob',
      });
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
    setTimeout(getChatRooms, 300);
  }, [messageHistory]);

  useEffect(() => {
    if (userId) {
      setIsLoading(true);
      setMessageHistory([]);
      getMessageHistory();
      localStorage.setItem('hasMessageNotification', JSON.stringify(false));
    }
  }, [userId]);

  useEffect(() => {
    if (userData) {
      const socket = new WebSocket('ws://localhost:8080/ws');
      const stomp = Stomp.over(socket);

      stomp.connect({}, () => {
        setStompClient(stomp);
        setIsWebSocketReady(true);
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
    if (userId && scrollRef) {
      scrollRef?.current?.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'auto' });
      });
    }
  }, [userId]);

  useEffect(() => console.log(messageHistory), [messageHistory]);

  if (!user) return <Navigate to={'/'} replace />;
  if (!userId && hasMessages) return <Navigate to={`/messages/${chatRooms[0]?.recipientId}`} replace />;

  return (
    <>
      <PageLoader isLoading={isLoading} />
      <Stack
        spacing={{ base: 8, lg: 10 }}
        pb={{ base: 0, lg: 10 }}
        px={{ base: 8, md: 16, xl: 20, '2xl': 40 }}
        mt={{ base: 28, lg: 40 }}
        align={'center'}
        justify={'center'}
        flex={1}
        w={'full'}
        minH={'85vh'}>
        <Hide above={'lg'}>
          <Heading textAlign={'left'} w={'full'} fontSize={{ base: 20, lg: 32, xl: 34 }} color={'grey.600'}>
            Съобщения
          </Heading>
          <InputGroup size={{ base: 'md' }} bg={'grey.100'} border="white" rounded={'md'} maxW={'100%'}>
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
        </Hide>

        <Stack
          direction={'row'}
          w={'full'}
          flex={1}
          rounded={'md'}
          bg={'purple.100'}
          py={{ base: 6, lg: 10 }}
          px={{ base: 4, lg: 10 }}
          mb={8}>
          <Stack maxW={{ base: '15%', lg: '35%' }} w={'full'} spacing={8}>
            <Hide below={'lg'}>
              <Heading textAlign={'left'} fontSize={{ base: 18, lg: 32, xl: 34 }} color={'grey.600'}>
                Съобщения
              </Heading>
            </Hide>

            <Hide below={'lg'}>
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
            </Hide>

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
                  py={{ base: 0, lg: 4 }}
                  rounded={'md'}
                  key={index}
                  direction={'row'}
                  align={'center'}
                  justify={{ base: 'start', md: 'space-between' }}
                  w={{ base: 'full', lg: '95%' }}
                  overflow={'hidden'}
                  minH={'55px'}
                  px={{ base: 0, lg: 4 }}>
                  <Stack
                    flex={1}
                    direction={'row'}
                    align={'center'}
                    justify={'start'}
                    maxW={{ base: '40%', md: '90%', lg: '82%' }}
                    w={'full'}
                    spacing={{ base: 2, lg: 4 }}>
                    <Avatar size={{ base: 'xs', md: 'md' }} src={el?.picture} />

                    <Hide below={'lg'}>
                      <Stack maxW={{ base: '55%', xl: '82%' }} align={'start'} spacing={0}>
                        <Text color={'grey.600'} fontSize={18} fontWeight={500} textAlign={'start'}>
                          {el.name}
                        </Text>

                        <Text
                          w={'full'}
                          color={'grey.500'}
                          fontSize={16}
                          fontWeight={400}
                          noOfLines={1}
                          overflow={'hidden'}
                          textAlign={'start'}
                          textOverflow={'ellipsis'}
                          maxW={{ base: 'full' }}>
                          {el?.senderId == userData?.id ? 'Вие: ' : ''} {el?.content}
                        </Text>
                      </Stack>
                    </Hide>
                  </Stack>

                  <Stack
                    align={{ base: 'center', lg: 'end' }}
                    justify={{ base: 'center', lg: 'start' }}
                    h="full"
                    w={'fit'}>
                    <Hide below={'lg'}>
                      <Text color={'grey.500'} fontSize={14} fontWeight={500}>
                        {el?.time}
                      </Text>
                    </Hide>
                    {!el.read && <Box rounded={'lg'} w={3} h={3} bg={'purple.500'}></Box>}
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
              <Stack
                justify={{ base: 'space-between', lg: 'start' }}
                align={'center'}
                spacing={6}
                h={'full'}
                w={'full'}
                pl={{ base: 4, md: 10 }}
                py={{ base: 3, lg: 10 }}
                pr={{ base: 2, md: 6 }}>
                <Stack flex={0} w={'full'} overflow-y={'auto'} maxH={'60vh'} h={'full'}>
                  <Stack direction={'row'} spacing={4} align={'center'} justify={'start'}>
                    <Avatar
                      size={{ base: 'sm', lg: 'md' }}
                      name={chatRooms.find(el => el?.recipientId == userId)?.name}
                      src={chatRooms.find(el => el?.recipientId == userId)?.picture}
                    />
                    <Text color={'grey.600'} fontSize={{ base: 18, lg: 20 }}>
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
                  pr={{ base: 2, md: 6 }}
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
                            size={{ base: 'xs', md: 'sm' }}
                            name={chatRooms.find(el => el?.recipientId == userId)?.name}
                            src={chatRooms.find(el => el?.recipientId == userId)?.picture}
                          />
                        ) : null}

                        <Stack
                          maxW={{ base: 'full', md: '50%' }}
                          bg={msg.senderId !== userId ? 'purple.200' : 'white'}
                          boxShadow={'custom'}
                          p={{ base: 2, md: 3 }}
                          px={4}
                          rounded={'xl'}
                          align={'start'}
                          h={'100%'}
                          overflow={'hidden'}>
                          {msg?.file ? (
                            <Stack
                              as={Button}
                              onClick={() => getUploadedFile(msg?.content)}
                              bg={msg.senderId !== userId ? 'purple.200' : 'white'}
                              _hover={{ bg: msg.senderId !== userId ? 'purple.200' : 'white' }}
                              direction={'row'}
                              align={'center'}
                              spacing={2}
                              w={'full'}>
                              <Img src={fileDownload} alt={'uploaded file'} w={5} h={5} />
                              <Text fontWeight={600} color={'grey.500'}>
                                Прикчен файл
                              </Text>
                            </Stack>
                          ) : (
                            <Text
                              textAlign={'left'}
                              fontSize={{ base: 14, md: 16 }}
                              maxW={'400px'}
                              wordBreak={'break-all'}
                              h={'fit-content'}>
                              {msg?.content}
                            </Text>
                          )}
                        </Stack>
                      </Stack>

                      <Stack
                        direction={'row'}
                        spacing={2}
                        fontSize={{ base: 12, md: 14 }}
                        fontWeight={400}
                        color={'grey.400'}
                        maxW={{ base: 'full', md: '58%' }}
                        justify={'end'}>
                        <Text>{msg.date}</Text>
                        <Text>{msg.time}</Text>
                      </Stack>
                    </Stack>
                  ))}
                </Stack>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack direction={'column'} w={'full'}>
                    {file && (
                      <Stack w={'fit-content'} direction={'row'} rounded={'md'} align={'center'} spacing={6}>
                        <Stack
                          w={'fit-content'}
                          position={'relative'}
                          p={3}
                          bg={'grey.100'}
                          rounded={'md'}
                          align={'center'}>
                          <Image w={6} h={6} maxH={'full'} objectFit="cover" src={upload} alt="uploaded file" />

                          <Button
                            size={'xxs'}
                            p={2}
                            h={4}
                            w={'fit-content'}
                            rounded={'lg'}
                            bg={'white'}
                            boxShadow={'custom'}
                            _hover={{ bg: 'white', opacity: 0.8 }}
                            position={'absolute'}
                            left={8}
                            top={0}
                            onClick={() => setFile(null)}>
                            x
                          </Button>
                        </Stack>

                        <Stack overflow={'hidden'} maxW={'150px'}>
                          <Text fontSize={12} whiteSpace={'nowrap'} overflow={'hidden'} textOverflow={'ellipsis'}>
                            {file}
                          </Text>
                        </Stack>
                      </Stack>
                    )}

                    <Stack flex={0} w={'full'} direction={{ base: 'column', md: 'row' }} spacing={4}>
                      <InputGroup
                        size={{ base: 'sm', lg: 'md' }}
                        bg={'white'}
                        border="white"
                        rounded={'md'}
                        maxW={{ base: 'full', md: '90%' }}>
                        <Input
                          pr="4.5rem"
                          type="text"
                          bg={'grey.100'}
                          placeholder="Въведете тук"
                          disabled={!!file}
                          {...register('message')}
                        />
                        <Input
                          pr="4.5rem"
                          type="file"
                          display="none"
                          id="file-upload"
                          onChange={e => handleFileUpload(e.target.files)}
                        />
                        <InputRightElement width="4.5rem">
                          <IconButton
                            aria-label="Attach file"
                            size="xs"
                            bg="none"
                            _hover={{ bg: 'none' }}
                            icon={<Img src={attach} w="full" />}
                            onClick={() => document.getElementById('file-upload').click()}
                          />
                        </InputRightElement>
                      </InputGroup>

                      <Button
                        type={'submit'}
                        size={{ base: 'sm', md: 'md' }}
                        w={{ base: 'full', md: 'fit-content' }}
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
