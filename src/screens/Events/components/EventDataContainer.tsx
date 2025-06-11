import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {colors, deviceHeight} from '../../../utils/Constants';
import Icon from 'react-native-vector-icons/AntDesign';
import {Customer, Event} from '../../../../types';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {useTheme} from '../../../hooks/index';

type EventDataContainerProps = {
  event: Event;
  close: () => void;
};

const EventDataContainer: React.FC<EventDataContainerProps> = ({
  event,
  close,
}): React.JSX.Element => {
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <Text style={styles.label}>{event.title || ''}</Text>
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.buttonDanger, {backgroundColor: colors.dangerFade}]}
          activeOpacity={0.8}
          >
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
    height: deviceHeight*0.6,
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

export default EventDataContainer;
