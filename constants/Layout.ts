import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

export const Layout = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  statusBarHeight: STATUSBAR_HEIGHT,
  screenHeight: height,
  screenWidth: width,
};

export const defaultScreenStyle = {
  flex: 1,
  width: '100%',
  height: '100%',
  backgroundColor: 'transparent',
}; 