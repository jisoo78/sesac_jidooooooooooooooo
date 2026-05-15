import { Plant, Generator, Asset, Sensor, AdminEmail } from './types';

export const PLANTS: Plant[] = [
  {
    id: '김포',
    name: '김포열병합발전소',
    address: '경기도 김포시 양촌읍 학운리',
    lat: 37.60,
    lng: 126.65,
    capacity: '495 MW',
    generatorsCount: 2,
    status: 'normal',
    warningCount: 0,
    errorCount: 0,
  },
  {
    id: '서인천',
    name: '서인천발전본부',
    address: '인천광역시 서구 장도로 57',
    lat: 37.52,
    lng: 126.62,
    capacity: '1,861.8 MW',
    generatorsCount: 8,
    status: 'caution',
    warningCount: 2,
    errorCount: 0,
  },
  {
    id: '태안',
    name: '태안발전본부',
    address: '충청남도 태안군 원북면 발전로 457',
    lat: 36.88,
    lng: 126.23,
    capacity: '6,504.5 MW',
    generatorsCount: 11,
    status: 'caution',
    warningCount: 3,
    errorCount: 0,
  },
  {
    id: '평택',
    name: '평택발전본부',
    address: '경기도 평택시 포승읍 남양만로 175-2',
    lat: 36.98,
    lng: 126.85,
    capacity: '871.4 MW',
    generatorsCount: 7,
    status: 'normal',
    warningCount: 0,
    errorCount: 0,
  },
  {
    id: '군산',
    name: '군산발전본부',
    address: '전라북도 군산시 구암 3.1로 91-5',
    lat: 35.95,
    lng: 126.70,
    capacity: '719.4 MW',
    generatorsCount: 1,
    status: 'normal',
    warningCount: 0,
    errorCount: 0,
  }
];

export const MOCK_EMAILS: AdminEmail[] = [
  {
    id: 'e1',
    email: 'kimgwanri@kowepo.co.kr',
    name: '김관리',
    plantId: '태안',
    assetScope: '전체',
    isVerified: true,
    isActive: true
  },
  {
    id: 'e2',
    email: 'park_gunsan@kowepo.co.kr',
    name: '박군산',
    plantId: '군산',
    assetScope: '전체',
    isVerified: true,
    isActive: true
  },
  {
    id: 'e3',
    email: 'lee_seoincheon@kowepo.co.kr',
    name: '이서인',
    plantId: '서인천',
    assetScope: '전체',
    isVerified: true,
    isActive: true
  },
  {
    id: 'e4',
    email: 'choi_pyeongtaek@kowepo.co.kr',
    name: '최평택',
    plantId: '평택',
    assetScope: '전체',
    isVerified: true,
    isActive: true
  },
  {
    id: 'e5',
    email: 'jung_gimpo@kowepo.co.kr',
    name: '정김포',
    plantId: '김포',
    assetScope: '전체',
    isVerified: false,
    isActive: true
  }
];

export const COLORS = {
  normal: '#00C853',
  caution: '#FFD600',
  none: '#757575',
  bg: '#0A0A0B',
  card: '#161618',
  border: '#2A2A2E'
};

// Map settings
export const MAP_DIMENSIONS = {
  width: 800,
  height: 1000
};
