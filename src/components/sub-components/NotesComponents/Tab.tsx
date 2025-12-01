import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ToastAndroid,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {colors, deviceWidth} from '../../../utils/Constants';
import {useTheme} from '../../../hooks';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import Icon from 'react-native-vector-icons/Entypo';
import Icon4 from 'react-native-vector-icons/MaterialIcons';
import {Note} from '../../../../types';
import LinearGradient from 'react-native-linear-gradient';
import LongPressEnabled from '../../../customComponents/LongPressEnabled';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  archiveNote,
  deleteNote,
  permanentlyDeleteNote,
  restoreNote,
  setToFavorite,
} from '../../../../store/slices/notes';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {Confirm} from '../../../service/fn';

type NoteTabProps = {
  note: Note;
  lastIndex?: boolean;
  dummy?: boolean;
  onPress: (note: Note) => void;
};

const Tab: React.FC<NoteTabProps> = ({note, dummy, lastIndex, onPress}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const {currentTheme} = useTheme();

  const tabX = useSharedValue(0);
  const tabAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: tabX.value}],
  }));

  const [showdelBtn, setShowdelBtn] = useState(false);

  const showValidationMessage = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      alert(msg);
    }
  };

  const handleDelete = async () => {
    if (note.isDeleted) {
      const res = await Confirm(
        'Are you sure?',
        'Delete this note permanently?',
      );
      if (res) {
        dispatch(permanentlyDeleteNote({uid: user._id, noteId: note._id}));
        showValidationMessage('Note removed permanently!');
      }
      return;
    }
    dispatch(deleteNote({uid: user._id, noteId: note._id}));
    showValidationMessage('Note removed!');
  };

  const handleRestore = () => {
    dispatch(restoreNote({uid: user._id, noteId: note._id}));
    showValidationMessage('Note restored!');
  };

  const handleSetToFav = () => {
    if (note.isArchived) {
      showValidationMessage('Unarchive first to add to favorite.');
      return;
    }
    dispatch(
      setToFavorite({
        uid: user._id,
        noteId: note._id,
        favorite: !note.isFavorite,
      }),
    );
    showValidationMessage(
      note.isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
    );
  };

  const handleArchive = () => {
    dispatch(
      archiveNote({
        uid: user._id,
        noteId: note._id,
        archived: !note.isArchived,
      }),
    );
    showValidationMessage(note.isArchived ? 'Note unarchived!' : 'Note archived!');
  };

  const tabGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate(e => {
      if (!note.isDeleted) tabX.value = e.translationX;
    })
    .onEnd(e => {
      if (note.isDeleted) return;

      if (e.translationX < -100) {
        runOnJS(handleSetToFav)();
      } else if (e.translationX > 100) {
        runOnJS(handleArchive)();
      }
      tabX.value = withTiming(0);
    });

  return (
    <LongPressEnabled
      longPressCanceledAction={() => onPress(note)}
      longPressAction={() => setShowdelBtn(!showdelBtn)}
      dummy={dummy}
    >
      <GestureDetector gesture={tabGesture}>
        <Animated.View style={tabAnimatedStyles}>
          <LinearGradient
            colors={[currentTheme.fadeColor, currentTheme.contrastColor]}
            start={{x: 0, y: 0}}
            style={[
              tabStyles.container,
              {marginBottom: lastIndex ? 70 : 6, borderLeftColor: currentTheme.baseColor},
            ]}
          >
            {showdelBtn &&
              (!note.isDeleted ? (
                <Pressable
                  onPress={handleDelete}
                  style={{backgroundColor: colors.dangerFade, padding: 4, borderRadius: 6}}
                >
                  <Icon4 name="delete-forever" color={colors.danger} size={20} />
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleRestore}
                  style={{backgroundColor: currentTheme.fadeColor, padding: 4, borderRadius: 6}}
                >
                  <Icon4 name="restore-from-trash" color={currentTheme.baseColor} size={20} />
                </Pressable>
              ))}
            <View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text numberOfLines={1} style={[tabStyles.title, {color: currentTheme.baseColor}]}>
                  {note.title}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{fontSize: 8, fontWeight: 'bold', color: currentTheme.baseColor, marginLeft: 4}}
                >
                  {`(${new Date(note.createdAt).toDateString().split(' ').slice(1).join(' ')})`}
                </Text>
                {note.media.length > 0 && (
                  <View style={{marginLeft: 8, flexDirection: 'row'}}>
                    <Icon name="attachment" color={currentTheme.baseColor} />
                  </View>
                )}
                {note.isDeleted && (
                  <View style={{marginLeft: 6, backgroundColor: colors.dangerFade, justifyContent: 'center', paddingHorizontal: 3, paddingVertical: 1, borderRadius: 4}}>
                    <Text numberOfLines={1} style={{fontSize: 8, fontWeight: 'bold', color: colors.danger}}>
                      deleted
                    </Text>
                  </View>
                )}
                {note.isArchived && (
                  <View style={{marginLeft: 6, backgroundColor: currentTheme.fadeColor, justifyContent: 'center', paddingHorizontal: 3, paddingVertical: 1, borderRadius: 4}}>
                    <Text numberOfLines={1} style={{fontSize: 8, fontWeight: 'bold', color: currentTheme.baseColor}}>
                      archived
                    </Text>
                  </View>
                )}
                {note.isFavorite && (
                  <View style={{marginLeft: 6, justifyContent: 'center'}}>
                    <Icon name="heart" color={colors.danger} />
                  </View>
                )}
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{width: 'auto', maxWidth: '50%'}}>
                  <Text numberOfLines={1} style={[tabStyles.content, {color: currentTheme.baseColor}]}>
                    {note.content}
                  </Text>
                </View>
                <View style={{backgroundColor: currentTheme.fadeColor, justifyContent: 'center', paddingHorizontal: 3, paddingVertical: 1, borderRadius: 4, marginLeft: 2}}>
                  <Text numberOfLines={1} style={{fontSize: 8, fontWeight: 'bold', color: currentTheme.baseColor}}>
                    {`Last updated: ${new Date(note.updatedAt).toDateString()}`}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </GestureDetector>
    </LongPressEnabled>
  );
};

const tabStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 2,
    position: 'relative',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    maxWidth: '70%',
  },
  content: {
    fontSize: 12,
    fontWeight: '600',
    maxWidth: '90%',
  },
});

export default Tab;
