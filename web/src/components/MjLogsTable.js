import React, { useEffect, useState } from 'react';
import {
  isMobile,
  API,
  copy,
  isAdmin,
  showError,
  showSuccess,
  timestamp2string,
} from '../helpers';

import {
  Banner,
  Button,
  Form,
  ImagePreview,
  Layout,
  Modal,
  Progress,
  Table,
  Tag,
  Typography,
} from '@douyinfe/semi-ui';
import { ITEMS_PER_PAGE } from '../constants';

const colors = [
  'amber',
  'blue',
  'cyan',
  'green',
  'grey',
  'indigo',
  'light-blue',
  'lime',
  'orange',
  'pink',
  'purple',
  'red',
  'teal',
  'violet',
  'yellow',
];

function renderType(type) {
  switch (type) {
    case 'IMAGINE':
      return (
        <Tag color='blue' size='large'>
          绘图
        </Tag>
      );
    case 'UPSCALE':
      return (
        <Tag color='orange' size='large'>
          放大
        </Tag>
      );
    case 'VARIATION':
      return (
        <Tag color='purple' size='large'>
          变换
        </Tag>
      );
    case 'HIGH_VARIATION':
      return (
        <Tag color='purple' size='large'>
          强变换
        </Tag>
      );
    case 'LOW_VARIATION':
      return (
        <Tag color='purple' size='large'>
          弱变换
        </Tag>
      );
    case 'PAN':
      return (
        <Tag color='cyan' size='large'>
          平移
        </Tag>
      );
    case 'DESCRIBE':
      return (
        <Tag color='yellow' size='large'>
          图生文
        </Tag>
      );
    case 'BLEND':
      return (
        <Tag color='lime' size='large'>
          图混合
        </Tag>
      );
    case 'SHORTEN':
      return (
        <Tag color='pink' size='large'>
          缩词
        </Tag>
      );
    case 'REROLL':
      return (
        <Tag color='indigo' size='large'>
          重绘
        </Tag>
      );
    case 'INPAINT':
      return (
        <Tag color='violet' size='large'>
          局部重绘-提交
        </Tag>
      );
    case 'ZOOM':
      return (
        <Tag color='teal' size='large'>
          变焦
        </Tag>
      );
    case 'CUSTOM_ZOOM':
      return (
        <Tag color='teal' size='large'>
          自定义变焦-提交
        </Tag>
      );
    case 'MODAL':
      return (
        <Tag color='green' size='large'>
          窗口处理
        </Tag>
      );
    case 'SWAP_FACE':
      return (
        <Tag color='light-green' size='large'>
          换脸
        </Tag>
      );
    default:
      return (
        <Tag color='white' size='large'>
          未知
        </Tag>
      );
  }
}

function renderCode(code) {
  switch (code) {
    case 1:
      return (
        <Tag color='green' size='large'>
          已提交
        </Tag>
      );
    case 21:
      return (
        <Tag color='lime' size='large'>
          等待中
        </Tag>
      );
    case 22:
      return (
        <Tag color='orange' size='large'>
          重复提交
        </Tag>
      );
    case 0:
      return (
        <Tag color='yellow' size='large'>
          未提交
        </Tag>
      );
    default:
      return (
        <Tag color='white' size='large'>
          未知
        </Tag>
      );
  }
}

function renderStatus(type) {
  // Ensure all cases are string literals by adding quotes.
  switch (type) {
    case 'SUCCESS':
      return (
        <Tag color='green' size='large'>
          成功
        </Tag>
      );
    case 'NOT_START':
      return (
        <Tag color='grey' size='large'>
          未启动
        </Tag>
      );
    case 'SUBMITTED':
      return (
        <Tag color='yellow' size='large'>
          队列中
        </Tag>
      );
    case 'IN_PROGRESS':
      return (
        <Tag color='blue' size='large'>
          执行中
        </Tag>
      );
    case 'FAILURE':
      return (
        <Tag color='red' size='large'>
          失败
        </Tag>
      );
    case 'MODAL':
      return (
        <Tag color='yellow' size='large'>
          窗口等待
        </Tag>
      );
    default:
      return (
        <Tag color='white' size='large'>
          未知
        </Tag>
      );
  }
}

const renderTimestamp = (timestampInSeconds) => {
  const date = new Date(timestampInSeconds * 1000); // 从秒转换为毫秒

  const year = date.getFullYear(); // 获取年份
  const month = ('0' + (date.getMonth() + 1)).slice(-2); // 获取月份，从0开始需要+1，并保证两位数
  const day = ('0' + date.getDate()).slice(-2); // 获取日期，并保证两位数
  const hours = ('0' + date.getHours()).slice(-2); // 获取小时，并保证两位数
  const minutes = ('0' + date.getMinutes()).slice(-2); // 获取分钟，并保证两位数
  const seconds = ('0' + date.getSeconds()).slice(-2); // 获取秒钟，并保证两位数

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // 格式化输出
};
// 修改renderDuration函数以包含颜色逻辑
function renderDuration(submit_time, finishTime) {
  // 确保startTime和finishTime都是有效的时间戳
  if (!submit_time || !finishTime) return 'N/A';

  // 将时间戳转换为Date对象
  const start = new Date(submit_time);
  const finish = new Date(finishTime);

  // 计算时间差（毫秒）
  const durationMs = finish - start;

  // 将时间差转换为秒，并保留一位小数
  const durationSec = (durationMs / 1000).toFixed(1);

  // 设置颜色：大于60秒则为红色，小于等于60秒则为绿色
  const color = durationSec > 60 ? 'red' : 'green';

  // 返回带有样式的颜色标签
  return (
    <Tag color={color} size="large">
      {durationSec} 秒
    </Tag>
  );
}

const LogsTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const columns = [
    {
      title: '提交时间',
      dataIndex: 'submit_time',
      render: (text, record, index) => {
        return <div>{renderTimestamp(text / 1000)}</div>;
      },
    },
    {
      title: '花费时间',
      dataIndex: 'finish_time', // 以finish_time作为dataIndex
      key: 'finish_time',
      render: (finish, record) => {
        // 假设record.start_time是存在的，并且finish是完成时间的时间戳
        return renderDuration(record.submit_time, finish);
      },
    },
    {
      title: '渠道',
      dataIndex: 'channel_id',
      className: isAdmin() ? 'tableShow' : 'tableHiddle',
      render: (text, record, index) => {
        return (
          <div>
            <Tag
              color={colors[parseInt(text) % colors.length]}
              size='large'
              onClick={() => {
                copyText(text); // 假设copyText是用于文本复制的函数
              }}
            >
              {' '}
              {text}{' '}
            </Tag>
          </div>
        );
      },
    },
    {
      title: '类型',
      dataIndex: 'action',
      render: (text, record, index) => {
        return <div>{renderType(text)}</div>;
      },
    },
    {
      title: '任务ID',
      dataIndex: 'mj_id',
      render: (text, record, index) => {
        return <div>{text}</div>;
      },
    },
    {
      title: '提交结果',
      dataIndex: 'code',
      className: isAdmin() ? 'tableShow' : 'tableHiddle',
      render: (text, record, index) => {
        return <div>{renderCode(text)}</div>;
      },
    },
    {
      title: '任务状态',
      dataIndex: 'status',
      className: isAdmin() ? 'tableShow' : 'tableHiddle',
      render: (text, record, index) => {
        return <div>{renderStatus(text)}</div>;
      },
    },
    {
      title: '进度',
      dataIndex: 'progress',
      render: (text, record, index) => {
        return (
          <div>
            {
              // 转换例如100%为数字100，如果text未定义，返回0
              <Progress
                stroke={
                  record.status === 'FAILURE'
                    ? 'var(--semi-color-warning)'
                    : null
                }
                percent={text ? parseInt(text.replace('%', '')) : 0}
                showInfo={true}
                aria-label='drawing progress'
              />
            }
          </div>
        );
      },
    },
    {
      title: '结果图片',
      dataIndex: 'image_url',
      render: (text, record, index) => {
        if (!text) {
          return '无';
        }
        return (
          <Button
            onClick={() => {
              setModalImageUrl(text); // 更新图片URL状态
              setIsModalOpenurl(true); // 打开模态框
            }}
          >
            查看图片
          </Button>
        );
      },
    },
    {
      title: 'Prompt',
      dataIndex: 'prompt',
      render: (text, record, index) => {
        // 如果text未定义，返回替代文本，例如空字符串''或其他
        if (!text) {
          return '无';
        }

        return (
          <Typography.Text
            ellipsis={{ showTooltip: true }}
            style={{ width: 100 }}
            onClick={() => {
              setModalContent(text);
              setIsModalOpen(true);
            }}
          >
            {text}
          </Typography.Text>
        );
      },
    },
    {
      title: 'PromptEn',
      dataIndex: 'prompt_en',
      render: (text, record, index) => {
        // 如果text未定义，返回替代文本，例如空字符串''或其他
        if (!text) {
          return '无';
        }

        return (
          <Typography.Text
            ellipsis={{ showTooltip: true }}
            style={{ width: 100 }}
            onClick={() => {
              setModalContent(text);
              setIsModalOpen(true);
            }}
          >
            {text}
          </Typography.Text>
        );
      },
    },
    {
      title: '失败原因',
      dataIndex: 'fail_reason',
      render: (text, record, index) => {
        // 如果text未定义，返回替代文本，例如空字符串''或其他
        if (!text) {
          return '无';
        }

        return (
          <Typography.Text
            ellipsis={{ showTooltip: true }}
            style={{ width: 100 }}
            onClick={() => {
              setModalContent(text);
              setIsModalOpen(true);
            }}
          >
            {text}
          </Typography.Text>
        );
      },
    },
  ];

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [logCount, setLogCount] = useState(ITEMS_PER_PAGE);
  const [logType, setLogType] = useState(0);
  const isAdminUser = isAdmin();
  const [isModalOpenurl, setIsModalOpenurl] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  // 定义模态框图片URL的状态和更新函数
  const [modalImageUrl, setModalImageUrl] = useState('');
  let now = new Date();
  // 初始化start_timestamp为前一天
  const [inputs, setInputs] = useState({
    channel_id: '',
    mj_id: '',
    start_timestamp: timestamp2string(now.getTime() / 1000 - 2592000),
    end_timestamp: timestamp2string(now.getTime() / 1000 + 3600),
  });
  const { channel_id, mj_id, start_timestamp, end_timestamp } = inputs;

  const [stat, setStat] = useState({
    quota: 0,
    token: 0,
  });

  const handleInputChange = (value, name) => {
    setInputs((inputs) => ({ ...inputs, [name]: value }));
  };

  const setLogsFormat = (logs) => {
    for (let i = 0; i < logs.length; i++) {
      logs[i].timestamp2string = timestamp2string(logs[i].created_at);
      logs[i].key = '' + logs[i].id;
    }
    // data.key = '' + data.id
    setLogs(logs);
    setLogCount(logs.length + ITEMS_PER_PAGE);
    // console.log(logCount);
  };

  const loadLogs = async (startIdx) => {
    setLoading(true);

    let url = '';
    let localStartTimestamp = Date.parse(start_timestamp);
    let localEndTimestamp = Date.parse(end_timestamp);
    if (isAdminUser) {
      url = `/api/mj/?p=${startIdx}&channel_id=${channel_id}&mj_id=${mj_id}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}`;
    } else {
      url = `/api/mj/self/?p=${startIdx}&mj_id=${mj_id}&start_timestamp=${localStartTimestamp}&end_timestamp=${localEndTimestamp}`;
    }
    const res = await API.get(url);
    const { success, message, data } = res.data;
    if (success) {
      if (startIdx === 0) {
        setLogsFormat(data);
      } else {
        let newLogs = [...logs];
        newLogs.splice(startIdx * ITEMS_PER_PAGE, data.length, ...data);
        setLogsFormat(newLogs);
      }
    } else {
      showError(message);
    }
    setLoading(false);
  };

  const pageData = logs.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page) => {
    setActivePage(page);
    if (page === Math.ceil(logs.length / ITEMS_PER_PAGE) + 1) {
      // In this case we have to load more data and then append them.
      loadLogs(page - 1).then((r) => { });
    }
  };

  const refresh = async () => {
    // setLoading(true);
    setActivePage(1);
    await loadLogs(0);
  };

  const copyText = async (text) => {
    if (await copy(text)) {
      showSuccess('已复制：' + text);
    } else {
      // setSearchKeyword(text);
      Modal.error({ title: '无法复制到剪贴板，请手动复制', content: text });
    }
  };

  useEffect(() => {
    refresh().then();
  }, [logType]);

  useEffect(() => {
    const mjNotifyEnabled = localStorage.getItem('mj_notify_enabled');
    if (mjNotifyEnabled !== 'true') {
      setShowBanner(true);
    }
  }, []);

  return (
    <>
      <Layout>
        {isAdminUser && showBanner ? (
          <Banner
            type='info'
            description='当前未开启Midjourney回调，部分项目可能无法获得绘图结果，可在运营设置中开启。'
          />
        ) : (
          <></>
        )}
        <Form layout='horizontal' labelPosition='inset'>
          <>
            <Form.Input field='channel_id' label='渠道' style={{ width: '250px', marginBottom: '10px' }} value={channel_id}
              placeholder={'可选值'} name='channel_id'
              onChange={(value) => handleInputChange(value, 'channel_id')}
            />
            <Form.Input field='mj_id' label='任务 ID' style={{ width: '250px', marginBottom: '10px' }} value={mj_id}
              placeholder='可选值' name='mj_id'
              onChange={(value) => handleInputChange(value, 'mj_id')}
            />
            <Form.DatePicker field='start_timestamp' label='起始时间' style={{ width: '250px', marginBottom: '10px' }}
              initValue={start_timestamp}
              value={start_timestamp} type='dateTime'
              name='start_timestamp'
              onChange={(value) => handleInputChange(value, 'start_timestamp')}
            />
            <Form.DatePicker field='end_timestamp' fluid label='结束时间' style={{ width: '250px', marginBottom: '10px' }}
              initValue={end_timestamp}
              value={end_timestamp} type='dateTime'
              name='end_timestamp'
              onChange={(value) => handleInputChange(value, 'end_timestamp')}
            />
            <Button label='查询' type='primary' htmlType='submit' className='btn-margin-right' onClick={refresh} style={{ marginBottom: '10px' }}>查询</Button>
          </>
        </Form>
        <Table
          style={{ marginTop: 15, 'white-space': 'nowrap' }}
          bordered={true}
          size='small'
          columns={columns}
          dataSource={pageData}
          pagination={{
            currentPage: activePage,
            pageSize: ITEMS_PER_PAGE,
            total: logCount,
            pageSizeOpts: [10, 20, 50, 100],
            onPageChange: handlePageChange,
          }}
          loading={loading}
        />
        <Modal
          visible={isModalOpen}
          onOk={() => setIsModalOpen(false)}
          onCancel={() => setIsModalOpen(false)}
          closable={null}
          bodyStyle={{ height: '400px', overflow: 'auto' }} // 设置模态框内容区域样式
          width={800} // 设置模态框宽度
        >
          <p style={{ whiteSpace: 'pre-line' }}>{modalContent}</p>
        </Modal>
        <ImagePreview
          src={modalImageUrl}
          visible={isModalOpenurl}
          onVisibleChange={(visible) => setIsModalOpenurl(visible)}
        />
      </Layout>
    </>
  );
};

export default LogsTable;
