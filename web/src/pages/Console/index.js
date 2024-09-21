import React from 'react';
import { Layout, Empty, Card } from '@douyinfe/semi-ui';
import { IllustrationSuccess, IllustrationSuccessDark } from '@douyinfe/semi-illustrations';

const About = () => {

  return (
    <>
      <Layout>
        <Layout.Content>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <Empty
              image={<IllustrationSuccess style={{ width: 150, height: 150 }} />}
              darkModeImage={<IllustrationSuccessDark style={{ width: 150, height: 150 }} />}
              description={'欢迎来到控制台'}
              style={{ padding: 30 }}
            />
          </div>

          <Card title='常见问题' style={{ margin: 10 }}>
            <Card
              title='关于模型倍率'
              style={{ marginBottom: 20 }}
            >
              模型倍率是本系统的一种计算方式，每个模型都有属于自己的倍率，并非是官方价格的多少倍。
              <br/>
              消耗额度 = 分组倍率 * 模型倍率 * （提示 token 数 + 补全 token 数 * 补全倍率），
              不同模型的模型倍率和补全倍率都是不同的。
            </Card>
            <Card
              title=' 余额用完了怎么充值'
            >
              1.您可以在额度充值页面进行在线充值；2. 或者使用兑换码进行兑换余额即可；如果您的令牌设置的不是无限额度，充值后还需检查该令牌余额是否充足，以免影响正常使用。
            </Card>
          </Card>
        </Layout.Content>
      </Layout>
    </>
  );
};

export default About;
