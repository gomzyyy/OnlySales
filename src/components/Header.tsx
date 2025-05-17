import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {ReactNode} from 'react';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Feather';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import {back} from '../utils/nagivationUtils';
import {useAnalytics, useTheme} from '../hooks/index';

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
  const openMenu = () => navigation.dispatch(DrawerActions.openDrawer());

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
              {name.slice(0,12)}
            </Text>
          )}
        </View>
      )}
      <View style={[styles.rightCustomBtn, {right: 20}]}>
        {customComponent && (
          <TouchableOpacity
            activeOpacity={customComponentActiveOpacity}
            onPress={customAction}
            // style={[styles.rightCustomBtn, {right: 20}]}
          >
            {renderItem}
          </TouchableOpacity>
        )}
        {customComponent && renderItem1 && (
          <TouchableOpacity
            activeOpacity={customComponentActiveOpacity}
            onPress={customAction1}
            // style={[styles.rightCustomBtn, {right: 60}]}
          >
            {renderItem1}
          </TouchableOpacity>
        )}
        {customComponent && renderItem2 && (
          <TouchableOpacity
            activeOpacity={customComponentActiveOpacity}
            onPress={customAction2}
            // style={[styles.rightCustomBtn, {right: 100}]}
          >
            {renderItem2}
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
