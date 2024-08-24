import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';
import { useSetTheme, useTheme } from '../context/Theme';
import { StatusContext } from '../context/Status';
import { API, getLogo, getSystemName, showSuccess, isAdmin, isMobile, showError } from '../helpers';
import { setStatusData } from '../helpers/data.js';
import {
  IconInfoCircle,
  IconMoon,
  IconSun,
  IconUser,
} from '@douyinfe/semi-icons';

import {
  IconProgress,
  IconToken,
  IconIntro,
  IconTree,
  IconOverflow,
  IconTag,
  IconCard,
  IconToast,
  IconBanner,
  IconAvatar,
  IconChangelog,
  IconPopover,
  IconImage,
  IconSlider,
  IconConfig,
  IconFaq,
} from '@douyinfe/semi-icons-lab';

import { Layout, Nav, Avatar, Dropdown, Button, Switch, Tag } from '@douyinfe/semi-ui';
import { stringToColor } from '../helpers/render';
import '../index.css';

import fireworks from 'react-fireworks';

// HeaderBar Buttons
const HeaderBar = () => {
  const [userState, userDispatch] = useContext(UserContext);
  const [statusState, statusDispatch] = useContext(StatusContext);
  const defaultIsCollapsed = isMobile() || localStorage.getItem('default_collapse_sidebar') === 'true';
  let navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState(['home']);
  const systemName = getSystemName();
  const logo = getLogo();
  const [isCollapsed, setIsCollapsed] = useState(defaultIsCollapsed);
  const [showSidebar, setShowSidebar] = useState(false);

  const routerMap = {
    home: '/',
    console: '/console',
    channel: '/console/channel',
    token: '/console/token',
    redemption: '/console/redemption',
    topup: '/console/topup',
    user: '/console/user',
    log: '/console/log',
    midjourney: '/console/midjourney',
    setting: '/console/setting',
    about: '/about',
    chat: '/console/chat',
    detail: '/console/detail',
    pricing: '/pricing',
    task: '/console/task',
    login: '/login',
    register: '/register',
  };

  const headerButtons = useMemo(
    () => [
      {
        text: '首页',
        itemKey: 'home',
        to: '/',
        icon: <IconIntro />,
      },
      {
        text: '控制台',
        itemKey: 'console',
        to: '/console',
        icon: <IconToken />,
      },
      {
        text: '渠道',
        itemKey: 'channel',
        to: '/channel',
        icon: <IconTree />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },
      {
        text: '聊天',
        itemKey: 'chat',
        to: '/chat',
        icon: <IconOverflow />,
        className: localStorage.getItem('chat_link')
          ? 'semi-navigation-item-normal'
          : 'tableHiddle',
      },
      {
        text: '令牌',
        itemKey: 'token',
        to: '/token',
        icon: <IconTag />,
      },
      {
        text: '兑换码',
        itemKey: 'redemption',
        to: '/redemption',
        icon: <IconCard />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },
      {
        text: '钱包',
        itemKey: 'topup',
        to: '/topup',
        icon: <IconToast />,
      },
      {
        text: '模型',
        itemKey: 'pricing',
        to: '/pricing',
        icon: <IconBanner />,
      },
      {
        text: '用户',
        itemKey: 'user',
        to: '/user',
        icon: <IconAvatar />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },
      {
        text: '日志',
        itemKey: 'log',
        to: '/log',
        icon: <IconChangelog />,
      },
      {
        text: '看板',
        itemKey: 'detail',
        to: '/detail',
        icon: <IconPopover />,
        className:
          localStorage.getItem('enable_data_export') === 'true'
            ? 'semi-navigation-item-normal'
            : 'tableHiddle',
      },
      {
        text: '绘图',
        itemKey: 'midjourney',
        to: '/midjourney',
        icon: <IconImage />,
        className:
          localStorage.getItem('enable_drawing') === 'true'
            ? 'semi-navigation-item-normal'
            : 'tableHiddle',
      },
      {
        text: '异步任务',
        itemKey: 'task',
        to: '/task',
        icon: <IconSlider />,
        className:
          localStorage.getItem('enable_task') === 'true'
            ? 'semi-navigation-item-normal'
            : 'tableHiddle',
      },
      {
        text: '设置',
        itemKey: 'setting',
        to: '/setting',
        icon: <IconConfig />,
      },
      {
        text: '关于',
        itemKey: 'about',
        to: '/about',
        icon: <IconFaq />
      }
    ],
    [
      localStorage.getItem('enable_data_export'),
      localStorage.getItem('enable_drawing'),
      localStorage.getItem('enable_task'),
      localStorage.getItem('chat_link'),
      isAdmin(),
    ],
  );

  const loadStatus = async () => {
    const res = await API.get('/api/status');
    if (res === undefined) {
      return;
    }
    const { success, data } = res.data;
    if (success) {
      statusDispatch({ type: 'set', payload: data });
      setStatusData(data);
    } else {
      showError('无法正常连接至服务器！');
    }
  };

  useEffect(() => {
    loadStatus().then(() => {
      setIsCollapsed(
        isMobile() ||
        localStorage.getItem('default_collapse_sidebar') === 'true',
      );
    });
    let localKey = window.location.pathname.split('/')[1];
    if (localKey === '') {
      localKey = 'home';
    }
    setSelectedKeys([localKey]);
  }, []);

  async function personal() {
    navigate('/console/setting?tab=personal');
  }
  async function logout() {
    setShowSidebar(false);
    await API.get('/api/user/logout');
    showSuccess('注销成功!');
    userDispatch({ type: 'logout' });
    localStorage.removeItem('user');
    navigate('/login');
  }


  const theme = useTheme();
  const setTheme = useSetTheme();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.setAttribute('theme-mode', 'dark');
    }
  }, []);


  function redirectTo(route) {
    navigate(route);
  }

  function DropdownEvents() {
    const menu = [
      { node: 'item', name: '首页', type: 'tertiary', icon: <IconIntro />, onClick: () => redirectTo('/') },
      { node: 'item', name: '仪表盘', type: 'tertiary', icon: <IconProgress />, onClick: () => redirectTo('/console') },
      { node: 'item', name: '渠道管理', type: 'tertiary', icon: <IconTree />, onClick: () => redirectTo('/console/channel') },
      { node: 'item', name: '在线聊天', type: 'tertiary', icon: <IconOverflow />, onClick: () => redirectTo('/console/chat'), className: localStorage.getItem('chat_link') ? 'semi-navigation-item-normal' : 'tableHiddle' },
      { node: 'item', name: '令牌管理', type: 'tertiary', icon: <IconTag />, onClick: () => redirectTo('/console/token') },
      { node: 'item', name: '兑换卡密', type: 'tertiary', icon: <IconCard />, onClick: () => redirectTo('/console/redemption'), className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle' },
      { node: 'item', name: '额度充值', type: 'tertiary', icon: <IconOverflow />, onClick: () => redirectTo('/console/topup') },
      { node: 'item', name: '用户管理', type: 'tertiary', icon: <IconAvatar />, onClick: () => redirectTo('/console/user'), className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle' },
      { node: 'item', name: '模型价格', type: 'tertiary', icon: <IconBanner />, onClick: () => redirectTo('/pricing') },
      { node: 'title', name: '日志' },
      { node: 'item', name: '统计图表', type: 'tertiary', icon: <IconPopover />, onClick: () => redirectTo('/console/detail'), className: localStorage.getItem('enable_data_export') === 'true' ? 'semi-navigation-item-normal' : 'tableHiddle' },
      { node: 'item', name: '请求日志', type: 'tertiary', icon: <IconChangelog />, onClick: () => redirectTo('/console/log') },
      { node: 'item', name: '绘图记录', type: 'tertiary', icon: <IconImage />, onClick: () => redirectTo('/console/midjourney'), className: localStorage.getItem('enable_drawing') === 'true' ? 'semi-navigation-item-normal' : 'tableHiddle' },
      { node: 'item', name: '异步任务', type: 'tertiary', icon: <IconSlider />, onClick: () => redirectTo('/console/task'), className: localStorage.getItem('enable_task') === 'true' ? 'semi-navigation-item-normal' : 'tableHiddle' },
    ];

    return (
      // <>
      <Dropdown trigger={'click'} position={'bottomLeft'} clickToHide={true} menu={menu}>
        <IconToken size='extra-large' />
      </Dropdown>
    );
  }
  return (
    <>
      <Layout>
        <div>
          <Nav
            mode={'horizontal'}
            selectedKeys={selectedKeys}
            renderWrapper={({ itemElement, props }) => {
              return (
                <Link
                  style={{ textDecoration: 'none' }}
                  to={routerMap[props.itemKey]}
                >
                  {itemElement}
                </Link>
              );
            }}
            items={!isMobile() ? [
              {
                text: '首页',
                itemKey: 'home',
              },
              {
                text: '控制台',
                itemKey: 'console'
              },
              {
                text: '模型价格',
                itemKey: 'pricing',
              },
            ] : []}
            onSelect={(key) => {
              setSelectedKeys([key.itemKey]);
            }}

            header={
              <>
                {!isMobile() ? (
                  <img src={logo} alt='logo' style={{ marginRight: '0.75em', width: '36px', height: '36px' }} onClick={() => redirectTo('/')} />
                ) : (
                  !location.pathname.startsWith('/console') ? (
                    <img src={logo} alt='logo' style={{ marginRight: '0.75em', width: '36px', height: '36px' }} onClick={() => redirectTo('/')} />
                  ) : (
                    DropdownEvents()
                  )
                )}
              </>
            }
            footer={
              <>
                <IconInfoCircle size='large' style={{ color: '#808080' }} onClick={() => redirectTo('/about')} />
                <span
                  onClick={() => {
                    if (theme === 'dark') {
                      setTheme('');
                    } else {
                      setTheme('dark');
                    }
                  }}
                >
                  <Button theme='borderless' type='tertiary'>
                    {theme === 'dark' ? <IconSun size='large' style={{ color: '#808080' }} /> : <IconMoon size='large' style={{ color: '#808080' }} />}
                  </Button>
                  {/* <Nav.Item style={{ 'background-color': 'transparent' }}>
                    {theme === 'dark' ? <IconSun size='large' style={{ color: '#808080' }} /> : <IconMoon size='large' style={{ color: '#808080' }} />}
                  </Nav.Item> */}
                </span>

                {userState.user ? (
                  <>
                    {!location.pathname.startsWith('/console') ? (
                      <Button theme='outline' type='tertiary' icon={<IconToken />} onClick={() => redirectTo('/console')}>控制台</Button>
                    ) : (
                      <Dropdown
                        position='bottomRight'
                        render={
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={personal}>个人中心</Dropdown.Item>
                            <Dropdown.Item onClick={logout}>退出登录</Dropdown.Item>
                          </Dropdown.Menu>
                        }
                      >
                        <Avatar
                          size='small'
                          color={stringToColor(userState.user.username)}
                          style={{ margin: 4 }}
                        >
                          {/* {userState.user.username[0]} */}
                          <IconUser size='large' />
                        </Avatar>
                        {!isMobile() && <span>{userState.user.username}</span>}
                      </Dropdown>
                    )}

                  </>
                ) : (
                  // <>
                  <Button theme='solid' type='primary' onClick={() => redirectTo('/login')}>登录</Button>
                  // </>
                )}
              </>
            }
          ></Nav>
        </div>
      </Layout >
    </>
  );
};

export default HeaderBar;
