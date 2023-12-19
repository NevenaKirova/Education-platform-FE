import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { Stack, useDisclosure } from '@chakra-ui/react';

import HomePage from './pages/index';
import BecomeATeacherPage from './pages/become_a_teacher';
import LessonsPage from './pages/lessons/lessons';
import LessonPage from './pages/lessons/[id]';
import EnrollLessonPage from './pages/lessons/enroll_lesson';
import PageNotFound from './pages/404';
import Menu from './components/menu/menu.component';
import Footer from './components/footer/footer.component';
import LoginModal from './components/login/login.component';
import ForgottenPasswordForm from './components/login/forgotten_password.component';
import TeacherPage from './pages/teacher_page';
import Calendar from './pages/student/calendar/calendar';
import SecurityPolicyPage from './pages/security_policy';
import TermsOfUsePage from './pages/terms_of_use';
import PersonalDataPage from './pages/personal-data';
import AboutUsPage from './pages/about_us';
import CoursesPage from './pages/courses/courses';

import './App.css';

import DashboardPage from './pages/dashboard/dashboard';
const App = () => {
  const { isOpen: isLoginOpen, onOpen: onLoginOpen, onClose: onLoginClose } = useDisclosure();
  const {
    isOpen: isForgottenPasswordOpen,
    onOpen: onForgottenPasswordOpen,
    onClose: onForgottenPasswordClose,
  } = useDisclosure();

  const [modalTabIndex, setModalTabIndex] = useState(0);
  const [loginAs, setLoginAs] = useState('student');

  return (
    <Stack className="App" justify={'space-between'} minH={'100vh'}>
      <Menu onLoginOpen={onLoginOpen} setModalTabIndex={setModalTabIndex} />
      <Stack flex={1}>
        <Routes>
          <Route path="/" element={<HomePage setModalTabIndex={setModalTabIndex} onLoginOpen={onLoginOpen} />} />
          <Route
            path="/become-a-teacher"
            element={
              <BecomeATeacherPage
                setModalTabIndex={setModalTabIndex}
                onLoginOpen={onLoginOpen}
                setLoginAs={setLoginAs}
              />
            }
          />
          <Route path="/lessons" element={<LessonsPage />}></Route>
          <Route path="/lessons/:lessonId" element={<LessonPage />} />
          <Route path="/lessons/:lessonId/enroll" element={<EnrollLessonPage />} />
          <Route path="/courses" element={<CoursesPage />}></Route>
          <Route path="/courses/:coursesId" element={<LessonPage />} />
          <Route path="/courses/:coursesId/enroll" element={<EnrollLessonPage />} />
          <Route path="/teacher/:teacherId" element={<TeacherPage />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/security-policy" element={<SecurityPolicyPage />} />
          <Route path="/terms-of-use" element={<TermsOfUsePage />} />
          <Route path="/personal-data-policy" element={<PersonalDataPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/404" element={<PageNotFound />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Stack>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={onLoginClose}
        onForgottenPasswordOpen={onForgottenPasswordOpen}
        tabIndex={modalTabIndex}
        setTabIndex={setModalTabIndex}
        loginAs={loginAs}
        setLoginAs={setLoginAs}
      />

      <ForgottenPasswordForm
        isOpen={isForgottenPasswordOpen}
        onClose={onForgottenPasswordClose}
        onLoginOpen={onLoginOpen}
      />
      <Footer />
    </Stack>
  );
};

export default App;
