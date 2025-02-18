import {View, Text} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';

type HeaderProps = {
  name: string;
  backButtom?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  name,
  backButtom = false,
}): React.JSX.Element => {
  return (
    <View
      style={{
        height: 70,
        // borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        // backgroundColor:"red",
      }}>
      {backButtom ? (
        <View>
          <Icon name="left" size={24} />
        </View>
      ) : (
        <View />
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

export default Header;
