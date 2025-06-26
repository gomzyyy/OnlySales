import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ToastAndroid,
  Platform,
  Alert,
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
import {
  Gesture,
  GestureHandlerRootView,
  GestureDetector,
} from 'react-native-gesture-handler';
import {Confirm} from '../../../service/fn';

type NoteTabProps = {
  note: Note;
  lastIndex?: boolean;
  dummy?: boolean;
  onPress: (note: Note) => void;
};

const Tab: React.FC<NoteTabProps> = ({note, dummy, lastIndex, onPress}) => {
  const d = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const tabX = useSharedValue(0);
  const tabAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: tabX.value}],
  }));
  const {currentTheme} = useTheme();
  const [showdelBtn, setShowdelBtn] = useState<boolean>(false);
  const showValidationMessage = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Validation Error', msg);
    }
  };
  const handleDelete = async () => {
    if (note.isDeleted) {
      const res = await Confirm(
        'Are you sure?',
        'Delete this note permanently?',
      );
      if (res) {
        d(permanentlyDeleteNote({uid: user._id, noteId: note._id}));
        showValidationMessage('Note Removed permanently!');
      }
      return;
    }
    d(deleteNote({uid: user._id, noteId: note._id}));
    showValidationMessage('Note Removed!');
  };
  const handlerestore = () => {
    d(restoreNote({uid: user._id, noteId: note._id}));
    showValidationMessage('Note Restored!');
  };
  const handleSetToFav = () => {
    if (note.isArchived) {
      showValidationMessage('Unarchive first to add to favorite.');
      return;
    }
    d(
      setToFavorite({
        uid: user._id,
        noteId: note._id,
        favorite: note.isFavorite ? false : true,
      }),
    );
    showValidationMessage(
      note.isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
    );
  };
  const handleArchive = () => {
    d(
      archiveNote({
        uid: user._id,
        noteId: note._id,
        archived: note.isArchived ? false : true,
      }),
    );
    showValidationMessage(
      note.isArchived ? 'Note unarchived!' : 'Note archived!',
    );
  };
  const tabGesture = Gesture.Pan()
    .onUpdate(e => {
      if (note.isDeleted) {
        return;
      }
      tabX.value = e.translationX;
    })
    .onEnd(e => {
      if (note.isDeleted) {
        return;
      }
      const x = e.translationX;
      if (x < 0) {
        if (e.translationX > -100) {
          tabX.value = 0;
        } else {
          runOnJS(handleSetToFav)();
          tabX.value = 0;
        }
      } else {
        if (e.translationX < 100) {
          tabX.value = 0;
        } else {
          tabX.value = withTiming(deviceWidth, {duration: 400}, s => {
            if (s) {
              runOnJS(handleArchive)();
            }
          });
        }
      }
    });
  return (
    <LongPressEnabled
      longPressCanceledAction={() => onPress(note)}
      longPressAction={() => setShowdelBtn(!showdelBtn)}
      dummy={dummy}>
      <GestureHandlerRootView>
        <GestureDetector gesture={tabGesture}>
          <Animated.View style={[{flex: 1}, tabAnimatedStyles]}>
            <LinearGradient
              colors={[currentTheme.fadeColor, currentTheme.contrastColor]}
              start={{x: 0, y: 0}}
              style={[
                tabStyles.container,
                {
                  marginBottom: lastIndex ? 70 : 6,
                  borderLeftColor: currentTheme.baseColor,
                },
              ]}>
              {showdelBtn &&
                (!note.isDeleted ? (
                  <Pressable
                    onPress={handleDelete}
                    style={{
                      backgroundColor: colors.dangerFade,
                      padding: 4,
                      borderRadius: 6,
                    }}>
                    <Icon4
                      name="delete-forever"
                      color={colors.danger}
                      size={20}
                    />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={handlerestore}
                    style={{
                      backgroundColor: currentTheme.fadeColor,
                      padding: 4,
                      borderRadius: 6,
                    }}>
                    <Icon4
                      name="restore-from-trash"
                      color={currentTheme.baseColor}
                      size={20}
                    />
                  </Pressable>
                ))}
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    numberOfLines={1}
                    style={[tabStyles.title, {color: currentTheme.baseColor}]}>
                    {note.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 8,
                      fontWeight: 'bold',
                      color: currentTheme.baseColor,
                      marginLeft: 4,
                    }}>
                    {`(${new Date(note.createdAt)
                      .toDateString()
                      .split(' ')
                      .slice(1)
                      .join(' ')})`}
                  </Text>
                  {note.media.length > 0 && (
                    <View style={{marginLeft: 8, flexDirection: 'row'}}>
                      <Icon name="attachment" color={currentTheme.baseColor} />
                    </View>
                  )}
                  {note.isDeleted && (
                    <View
                      style={{
                        marginLeft: 6,
                        backgroundColor: colors.dangerFade,
                        justifyContent: 'center',
                        paddingHorizontal: 3,
                        paddingVertical: 1,
                        borderRadius: 4,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 8,
                          fontWeight: 'bold',
                          color: colors.danger,
                        }}>
                        deleted
                      </Text>
                    </View>
                  )}
                  {note.isArchived && (
                    <View
                      style={{
                        marginLeft: 6,
                        backgroundColor: currentTheme.fadeColor,
                        justifyContent: 'center',
                        paddingHorizontal: 3,
                        paddingVertical: 1,
                        borderRadius: 4,
                      }}>
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 8,
                          fontWeight: 'bold',
                          color: currentTheme.baseColor,
                        }}>
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
                  <View style={{width: 'auto',maxWidth:'50%'}}>
                    <Text
                      numberOfLines={1}
                      style={[
                        tabStyles.content,
                        {color: currentTheme.baseColor},
                      ]}>
                      {note.content}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: currentTheme.fadeColor,
                      justifyContent: 'center',
                      paddingHorizontal: 3,
                      paddingVertical: 1,
                      borderRadius: 4,
                      marginLeft: 2,
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontSize: 8,
                        fontWeight: 'bold',
                        color: currentTheme.baseColor,
                      }}>
                      {`Last updated: ${new Date(
                        note.updatedAt,
                      ).toDateString()}`}
                    </Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
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
    fontWeight: 'semibold',
    maxWidth: '90%',
  },
});
export default Tab;
