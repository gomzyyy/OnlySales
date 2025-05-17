import {Text, TouchableOpacity, View} from 'react-native';
import React, {Dispatch, SetStateAction} from 'react';
import {useHaptics, useTheme} from '../../../../hooks';
import {navigate} from '../../../../utils/nagivationUtils';

export type DropDownOptionsType = {
  id: number;
  name: string;
  navigateTo: string | undefined;
  icon: (color?: string, size?: number) => JSX.Element;
  onPress: (cb?: () => void) => void | undefined;
  callback?: () => void;
};

type DropDownMenuProps = {
  visible: boolean;
  close: () => void;
  dropDownOptions: DropDownOptionsType[];
  top?: number;
  bottom?: number;
  right?: number;
  left?: number;
};

const DropDownMenu: React.FC<DropDownMenuProps> = ({
  visible,
  close,
  dropDownOptions,
  top,
  bottom,
  right,
  left,
}) => {
  const {currentTheme} = useTheme();
  const {lightTap} = useHaptics();

  const handleNavigation = (navigateTo: string) => {
    navigate(navigateTo);
    lightTap();
    return;
  };

  return (
    <View
      style={[
        {
          width: 140,
          position: 'absolute',
          top,
          right,
          left,
          bottom,
          zIndex: 2,
          elevation: 10,
          borderRadius: 6,
          backgroundColor: currentTheme.contrastColor,
          overflow: 'hidden',
          paddingHorizontal: 10,
        },
      ]}>
      {dropDownOptions.map((s: DropDownOptionsType, i: number) => (
        <TouchableOpacity
          key={s.id}
          style={{
            borderBottomColor: '#ababab',
            borderBottomWidth: i === dropDownOptions.length - 1 ? 0 : 1,
            height: 30,
            alignItems: 'center',
            flexDirection: 'row',
            paddingLeft: 10,
          }}
          onPress={() => {
            close();
            s.navigateTo
              ? handleNavigation(s.navigateTo)
              : s.onPress(() => {
                  s.callback && s.callback();
                  close();
                });
          }}>
          <View style={{flex: 1}}>{s.icon()}</View>
          <Text style={{flex: 3, fontWeight: '600'}}>
            {s.name.toLowerCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default DropDownMenu;
