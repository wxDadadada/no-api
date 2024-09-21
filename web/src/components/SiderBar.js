import React, { useContext, useEffect, useMemo, useState, useTheme } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/User';
import { StatusContext } from '../context/Status';

import {
  API,
  getLogo,
  getSystemName,
  isAdmin,
  isMobile,
  showError,
} from '../helpers';
import '../index.css';

import {
  IconProgress,
  IconTree,
  IconOverflow,
  IconTag,
  IconCard,
  IconToast,
  IconAvatar,
  IconChangelog,
  IconPopover,
  IconImage,
  IconSlider,
} from '@douyinfe/semi-icons-lab';

import { Layout, Nav } from '@douyinfe/semi-ui';
import { setStatusData } from '../helpers/data.js';

const SiderBar = () => {
  const [userState, userDispatch] = useContext(UserContext);
  const [statusState, statusDispatch] = useContext(StatusContext);
  const defaultIsCollapsed =
    isMobile() || localStorage.getItem('default_collapse_sidebar') === 'true';

  let navigate = useNavigate();
  const [selectedKeys, setSelectedKeys] = useState(['home']);
  const systemName = getSystemName();
  const logo = getLogo();
  const [isCollapsed, setIsCollapsed] = useState(defaultIsCollapsed);
  // const theme = useTheme();
  // const setTheme = useSetTheme();

  const routerMap = {
    console: '/console',
    channel: '/console/channel',
    token: '/console/token',
    redemption: '/console/redemption',
    topup: '/console/topup',
    user: '/console/user',
    log: '/console/log',
    midjourney: '/console/midjourney',
    setting: '/setting',
    about: '/about',
    chat: '/console/chat',
    detail: '/console/detail',
    pricing: '/pricing',
    task: '/console/task',
  };

  const headerButtons = useMemo(
    () => [
      {
        text: '仪表盘',
        itemKey: 'console',
        to: '/',
        icon: <IconProgress />,
      },
      {
        text: '渠道管理',
        itemKey: 'channel',
        to: '/channel',
        icon: <IconTree />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },
      {
        text: '在线聊天',
        itemKey: 'chat',
        to: '/chat',
        icon: <IconOverflow />,
        className: localStorage.getItem('chat_link')
          ? 'semi-navigation-item-normal'
          : 'tableHiddle',
      },
      {
        text: '令牌管理',
        itemKey: 'token',
        to: '/token',
        icon: <IconTag />,
      },
      {
        text: '兑换卡密',
        itemKey: 'redemption',
        to: '/redemption',
        icon: <IconCard />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },
      {
        text: '额度充值',
        itemKey: 'topup',
        to: '/topup',
        icon: <IconToast />,
      },
      {
        text: '用户管理',
        itemKey: 'user',
        to: '/user',
        icon: <IconAvatar />,
        className: isAdmin() ? 'semi-navigation-item-normal' : 'tableHiddle',
      },
      {
        text: '日志',
        itemKey: 'logs',
        items: [
          {
            text: '统计图表',
            itemKey: 'detail',
            to: '/detail',
            icon: <IconPopover />,
            className:
              localStorage.getItem('enable_data_export') === 'true'
                ? 'semi-navigation-item-normal'
                : 'tableHiddle',
          },
          {
            text: '请求日志',
            itemKey: 'log',
            to: '/log',
            icon: <IconChangelog />,
          },
          {
            text: '绘图记录',
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
          }
        ]
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
    let localKey = window.location.pathname.split('/')[2];
    if (localKey === '') {
      localKey = 'home';
    }
    setSelectedKeys([localKey]);
  }, []);

  return (
    <>
      <Layout>
        <div style={{
          height: 'calc(100vh - 60px)'
        }}>
          <Nav
            defaultOpenKeys={['logs']}
            bodyStyle={{ maxWidth: 200 }}
            style={{ maxWidth: 200 }}
            isCollapsed={isCollapsed}
            onCollapseChange={(collapsed) => {
              setIsCollapsed(collapsed);
            }}
            selectedKeys={selectedKeys}
            renderWrapper={({ itemElement, isSubNav, isInSubNav, props }) => {
              return (
                <Link
                  style={{ textDecoration: 'none' }}
                  to={routerMap[props.itemKey]}
                >
                  {itemElement}
                </Link>
              );
            }}
            items={headerButtons}
            onSelect={(key) => {
              setSelectedKeys([key.itemKey]);
            }}
          >
          </Nav>
        </div>
      </Layout>
    </>
  );
};

export default SiderBar;
