import {View, Text, Button} from 'react-native';
import React, {useState} from 'react';
import Header from '../../components/Header';
import {Confirm} from '../../components/PopUp';
import { currentTheme } from '../../utils/Constants';

const Settings = () => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <View>
      <Header name="Settings" backButtom />
      <Text>Settings</Text>
      <Confirm close={() => setOpen(false)} open={open} title="No TITLEEEE" />
      <Button title="OPEn" onPress={()=>setOpen(true)} color={currentTheme.baseColor} />
    </View>
  );
};

export default Settings;
