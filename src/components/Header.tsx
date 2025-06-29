import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {ReactNode} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Feather';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {back} from '../utils/nagivationUtils';
import {useTheme, useTTS} from '../hooks/index';
import HeaderIcon from './HeaderIcon';
import AILoader from './shared/AILoader';

type HeaderProps = {
  name?: string;
  showTitle?: boolean;
  titleColor?: string;
  headerBgColor?: string;
  backButton?: boolean;
  menuButton?: boolean;
  customComponent?: boolean;
  renderItem?: ReactNode;
  renderItem1?: ReactNode;
  renderItem2?: ReactNode;
  customAction?: () => void;
  customAction1?: () => void;
  customAction2?: () => void;
  customComponentActiveOpacity?:
    | 0
    | 0.1
    | 0.2
    | 0.3
    | 0.4
    | 0.5
    | 0.6
    | 0.7
    | 0.8
    | 0.9
    | 1;
  curved?: boolean;
  customTitle?: ReactNode;
};

const Header: React.FC<HeaderProps> = ({
  name = '',
  showTitle = true,
  titleColor = '#000',
  headerBgColor,
  backButton = false,
  menuButton = false,
  customComponent = false,
  renderItem,
  customAction = () => {},
  customComponentActiveOpacity = 0.5,
  curved = false,
  customTitle,
  renderItem1,
  renderItem2,
  customAction1,
  customAction2,
}): React.JSX.Element => {
  const navigation = useNavigation();
  const {currentTheme} = useTheme();
  const openMenu = () => navigation.dispatch(DrawerActions.openDrawer());
  const {isPlaying, pause} = useTTS();
  return (
    <View
      style={{
        height: 70,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: headerBgColor ?? '',
        borderBottomRightRadius: curved ? 10 : 0,
        borderBottomLeftRadius: curved ? 10 : 0,
      }}>
      {!backButton && menuButton && (
        <Pressable style={styles.leftActionBtn} onPress={openMenu}>
          <Icon2 name="menu" size={24} color={titleColor} />
        </Pressable>
      )}
      {backButton && !menuButton && (
        <Pressable style={styles.leftActionBtn} onPress={() => back()}>
          <Icon1 name="left" size={24} color={titleColor} />
        </Pressable>
      )}
      {showTitle && (
        <View style={{alignItems: 'center', gap: 4}}>
          {customTitle ? (
            customTitle
          ) : (
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: titleColor,
              }}>
              {name.slice(0, 16)}
            </Text>
          )}
        </View>
      )}
      <View style={[styles.rightCustomBtn, {right: 20}]}>
        {!isPlaying && customComponent && (
          <TouchableOpacity
            activeOpacity={customComponentActiveOpacity}
            onPress={customAction}>
            {renderItem}
          </TouchableOpacity>
        )}
        {!isPlaying && customComponent && renderItem1 && (
          <TouchableOpacity
            activeOpacity={customComponentActiveOpacity}
            onPress={customAction1}>
            {renderItem1}
          </TouchableOpacity>
        )}
        {!isPlaying && customComponent && renderItem2 && (
          <TouchableOpacity
            activeOpacity={customComponentActiveOpacity}
            onPress={customAction2}>
            {renderItem2}
          </TouchableOpacity>
        )}
        {isPlaying && (
          <TouchableOpacity
            activeOpacity={customComponentActiveOpacity}
            onPress={() => pause()}>
            <HeaderIcon horizontal label="Playing audio" paddingHorizontal={12}>
              {/* <Icon name="pause" size={20} color={currentTheme.baseColor} /> */}
              <ActivityIndicator size={20} color={currentTheme.baseColor} />
            </HeaderIcon>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  leftActionBtn: {
    position: 'absolute',
    left: 20,
  },
  rightCustomBtn: {
    position: 'absolute',
    flexDirection: 'row',
    gap: 8,
  },
});

export default Header;
