import { Suspense, useState } from 'react';
import { Col, Menu, Row } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import IntroduceRow from './components/IntroduceRow';
import SalesCard from './components/SalesCard';

import OfflineData from './components/OfflineData';
import { useRequest } from 'umi';
import { fakeChartData } from './service';
import { getTimeDistance } from './utils/utils';
import styles from './style.less';
import DemoHeatmap from './components/HeatMap';
import ProCard from '@ant-design/pro-card';


const Analysis = () => {
  const [salesType, setSalesType] = useState('all');
  const [rangePickerValue, setRangePickerValue] = useState(getTimeDistance('year'));
  const { loading, data } = useRequest(fakeChartData);

  const selectDate = (type) => {
    setRangePickerValue(getTimeDistance(type));
  };

  const handleRangePickerChange = (value) => {
    setRangePickerValue(value);
  };

  const isActive = (type) => {
    if (!rangePickerValue) {
      return '';
    }

    const value = getTimeDistance(type);

    if (!value) {
      return '';
    }

    if (!rangePickerValue[0] || !rangePickerValue[1]) {
      return '';
    }

    if (
      rangePickerValue[0].isSame(value[0], 'day') &&
      rangePickerValue[1].isSame(value[1], 'day')
    ) {
      return styles.currentDate;
    }

    return '';
  };

  let salesPieData;

  if (salesType === 'all') {
    salesPieData = data?.salesTypeData;
  } else {
    salesPieData = salesType === 'online' ? data?.salesTypeDataOnline : data?.salesTypeDataOffline;
  }

  // const activeKey = currentTabKey || (data?.offlineData[0] && data?.offlineData[0].name) || '';
  return (
    <GridContent>
      <>
        {/* Displaing Total Number of Visits */}
        <Suspense>
          <IntroduceRow loading={loading} visitData={data?.visitData || []} />
        </Suspense>

        {/* Displaying Foor Trafic */}
        <Suspense fallback={null}>
          <SalesCard
            rangePickerValue={rangePickerValue}
            salesData={data?.salesData || []}
            isActive={isActive}
            handleRangePickerChange={handleRangePickerChange}
            loading={loading}
            selectDate={selectDate}
          />
        </Suspense>

        {/* Display Traffic for all Stores */}
        {/* <Suspense fallback={null}>
          <OfflineData
            activeKey={activeKey}
            loading={loading}
            offlineData={data?.offlineData || []}
            offlineChartData={data?.offlineChartData || []}
            handleTabChange={handleTabChange}
          />
        </Suspense> */}
        
        <Row
          gutter={24}
          style={{
            marginTop: 24,
          }}
        >
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
              <ProCard colSpan={24}
              layout="center" bordered
              >
                <DemoHeatmap/>
              </ProCard>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
           <ProCard>
             <DemoHeatmap/>
           </ProCard>
          </Col>
          
        </Row>
      </>
    </GridContent>
  );
};

export default Analysis;
