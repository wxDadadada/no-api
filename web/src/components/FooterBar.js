import React, { useEffect, useState } from 'react';

import { isMobile, getFooterHTML, getSystemName } from '../helpers';
import { Layout, Tooltip } from '@douyinfe/semi-ui';

const Footer = () => {
  const systemName = getSystemName();
  const [footer, setFooter] = useState(getFooterHTML());
  let remainCheckTimes = 5;

  const loadFooter = () => {
    let footer_html = localStorage.getItem('footer_html');
    if (footer_html) {
      setFooter(footer_html);
    }
  };

  const defaultFooter = (
    <div style={{
      display: 'flex',
      wordWrap: 'break-word',
      alignItems: 'center',
      padding: 20,
      height: 60,
      color: 'var(--semi-color-text-2)',
      backgroundColor: 'rgba(var(--semi-grey-0), 1)',
      justifyContent: !isMobile() ? 'space-between' : 'center',
      flexDirection: !isMobile() ? 'row' : 'column',
    }}>
      <span>
        <span>Copyright © 2024&nbsp;
          <a href='https://docs.qq.com/doc/p/af2a94ff20cd066dc642d20179a04006c9cba162' style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', marginRight: '10px' }}
            target='_blank'
            rel='noreferrer'
          >
            No API
          </a>All Rights Reserved.</span>
      </span>
      <div style={{ textAlign: 'center' }}>
        <a href='https://github.com/Calcium-Ion/new-api' style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit', marginRight: '10px' }}
          target='_blank'
          rel='noreferrer'
        >
          New API
        </a>
        <a
          href='https://github.com/songquanpeng/one-api' style={{ textAlign: 'center', textDecoration: 'none', color: 'inherit' }}
          target='_blank'
          rel='noreferrer'
        >
          One API
        </a>
      </div>
    </div>
  );

  useEffect(() => {
    const timer = setInterval(() => {
      if (remainCheckTimes <= 0) {
        clearInterval(timer);
        return;
      }
      remainCheckTimes--;
      loadFooter();
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Layout>
      <Layout.Content style={{ textAlign: 'center' }}>
        {footer ? (
          <Tooltip content={defaultFooter}>
            <div
              // className='custom-footer'
              dangerouslySetInnerHTML={{ __html: footer }}
            ></div>
          </Tooltip>
        ) : (
          defaultFooter
        )}
      </Layout.Content>
      </Layout>
    </>
  );
};

export default Footer;
