import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import Icon1 from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/Feather';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import { back } from '../utils/nagivationUtils';

type HeaderProps = {
  name: string;
  backButtom?: boolean;
  menuButton?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  name,
  backButtom = false,
  menuButton = false,
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
      }}>
      {!backButtom && menuButton && (
        <Pressable style={styles.leftActionBtn} onPress={openMenu}>
          <Icon2 name="menu" size={24} color={'black'} />
        </Pressable>
      )}
      {backButtom && !menuButton && (
        <Pressable style={styles.leftActionBtn} onPress={()=>back()}>
          <Icon1 name="left" size={24} color={'black'} />
        </Pressable>
      )}
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
        }}>
        {name}
      </Text>
      <View />
    </View>
  );
};

const styles = StyleSheet.create({
  leftActionBtn: {
    position: 'absolute',
    left: 20,
  },
});

export default Header;
