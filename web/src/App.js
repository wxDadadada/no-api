import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loading from './components/Loading';
import User from './pages/Console/User';
import { PrivateRoute } from './components/PrivateRoute';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import NotFound from './pages/NotFound';
import Setting from './pages/Console/Setting';
import EditUser from './pages/Console/User/EditUser';
import { getLogo, getSystemName } from './helpers';
import PasswordResetForm from './components/PasswordResetForm';
import GitHubOAuth from './components/GitHubOAuth';
import PasswordResetConfirm from './components/PasswordResetConfirm';
import { UserContext } from './context/User';
import Channel from './pages/Console/Channel';
import Token from './pages/Console/Token';
import EditChannel from './pages/Console/Channel/EditChannel';
import Redemption from './pages/Console/Redemption';
import TopUp from './pages/Console/TopUp';
import Log from './pages/Console/Log';
import Chat from './pages/Console/Chat';
import Chat2Link from './pages/Chat2Link';
import { Layout } from '@douyinfe/semi-ui';
import Midjourney from './pages/Console/Midjourney';
import Pricing from './pages/Pricing/index.js';
import Task from "./pages/Console/Task/index.js";
// import Console from "./pages/Console";
// import Detail from './pages/Detail';

const Home = lazy(() => import('./pages/Home'));
const Detail = lazy(() => import('./pages/Console/Detail'));
const About = lazy(() => import('./pages/About'));
const Console = lazy(() => import('./pages/Console/index.js'));

function App() {
  const [userState, userDispatch] = useContext(UserContext);
  // const [statusState, statusDispatch] = useContext(StatusContext);

  const loadUser = () => {
    let user = localStorage.getItem('user');
    if (user) {
      let data = JSON.parse(user);
      userDispatch({ type: 'login', payload: data });
    }
  };

  useEffect(() => {
    loadUser();
    let systemName = getSystemName();
    if (systemName) {
      document.title = systemName;
    }
    let logo = getLogo();
    if (logo) {
      let linkElement = document.querySelector("link[rel~='icon']");
      if (linkElement) {
        linkElement.href = logo;
      }
    }
  }, []);

  return (
    <>
      <Routes>
        <Route
          path='/'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path='/console'
            element={
              <Suspense fallback={<Loading></Loading>}>
                <Console />
              </Suspense>
            }
          />
          <Route
            path='/console/channel'
          element={
            <PrivateRoute>
              <Channel />
            </PrivateRoute>
          }
        />
        <Route
          path='/console/channel/edit/:id'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <EditChannel />
            </Suspense>
          }
        />
        <Route
          path='/console/channel/add'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <EditChannel />
            </Suspense>
          }
        />
        <Route
          path='/console/token'
          element={
            <PrivateRoute>
              <Token />
            </PrivateRoute>
          }
        />
        <Route
          path='/console/redemption'
          element={
            <PrivateRoute>
              <Redemption />
            </PrivateRoute>
          }
        />
        <Route
          path='/console/user'
          element={
            <PrivateRoute>
              <User />
            </PrivateRoute>
          }
        />
        <Route
          path='/console/user/edit/:id'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <EditUser />
            </Suspense>
          }
        />
        <Route
          path='/console/user/edit'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <EditUser />
            </Suspense>
          }
        />
        <Route
          path='/console/user/reset'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <PasswordResetConfirm />
            </Suspense>
          }
        />
        <Route
          path='/login'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <LoginForm />
            </Suspense>
          }
        />
        <Route
          path='/register'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <RegisterForm />
            </Suspense>
          }
        />
        <Route
          path='/reset'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <PasswordResetForm />
            </Suspense>
          }
        />
        <Route
          path='/oauth/github'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <GitHubOAuth />
            </Suspense>
          }
        />
        <Route
          path='/console/setting'
          element={
            <PrivateRoute>
              <Suspense fallback={<Loading></Loading>}>
                <Setting />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path='/console/topup'
          element={
            <PrivateRoute>
              <Suspense fallback={<Loading></Loading>}>
                <TopUp />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path='/console/log'
          element={
            <PrivateRoute>
              <Log />
            </PrivateRoute>
          }
        />
        <Route
          path='/console/detail'
          element={
            <PrivateRoute>
              <Suspense fallback={<Loading></Loading>}>
                <Detail />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path='/console/midjourney'
          element={
            <PrivateRoute>
              <Suspense fallback={<Loading></Loading>}>
                <Midjourney />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path='/console/task'
          element={
            <PrivateRoute>
              <Suspense fallback={<Loading></Loading>}>
                <Task />
              </Suspense>
            </PrivateRoute>
          }
        />
        <Route
          path='/pricing'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <Pricing />
            </Suspense>
          }
        />
        <Route
          path='/about'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <About />
            </Suspense>
          }
        />
        <Route
          path='/console/chat'
          element={
            <Suspense fallback={<Loading></Loading>}>
              <Chat />
            </Suspense>
          }
        />
        {/* 方便使用chat2link直接跳转聊天... */}
          <Route
            path='/chat2link'
            element={
              <PrivateRoute>
                <Suspense fallback={<Loading></Loading>}>
                    <Chat2Link />
                </Suspense>
              </PrivateRoute>
            }
          />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </>
  );
}

export default App;
