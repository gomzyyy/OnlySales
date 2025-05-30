import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {colors} from '../../../utils/Constants';
import Icon from 'react-native-vector-icons/AntDesign';
import {useTheme} from '../../../hooks/index';
import FS from 'react-native-fs';

type TabLongPressOptionsProps = {
  file: FS.ReadDirItem;
  close: () => void;
};

const TabLongPressOptions: React.FC<TabLongPressOptionsProps> = ({
  file,
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const [loading, setLoading] = useState<boolean>(false);
  const handleDeleteFile = async () => {
    setLoading(true);
    try {
      await FS.unlink(file.path);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      close();
    }
  };
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={styles.label}>{file.name}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.buttonDanger, {backgroundColor: colors.dangerFade}]}
          activeOpacity={0.8}
          onPress={handleDeleteFile}>
          <Text style={[styles.buttonDangerText, {color: colors.danger}]}>
            {loading ? 'Deleteing' : 'Delete'}
          </Text>
          {loading ? (
            <ActivityIndicator size={18} color={colors.danger} />
          ) : (
            <Icon name="delete" size={18} color={colors.danger} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    paddingVertical: 14,
    height: 'auto',
    borderRadius: 20,
    marginBottom: 10,
    elevation: 30,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginTop: 26,
    gap: 10,
  },
  buttonDanger: {
    borderRadius: 12,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonIconContainer: {
    alignItems: 'center',
  },
  buttonDangerText: {
    textAlign: 'center',
    fontSize: 20,
  },
  buttonEdit: {
    height: 50,
    borderRadius: 12,
    borderWidth: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  buttonEditText: {
    textAlign: 'center',

    fontSize: 20,
  },
});

export default TabLongPressOptions;
