import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import {deviceHeight} from '../utils/Constants';
import Header from './Header';
import {useTheme} from '../hooks';
import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import FallbackMessage from './FallbackMessage';
import ExpandButton from './animated/ExpandButton';
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/Feather';
import {Note} from '../../types';
import LinearGradient from 'react-native-linear-gradient';
import LongPressEnabled from '../customComponents/LongPressEnabled';
import HeaderIcon from './HeaderIcon';
import CreateNote from './sub-components/NotesComponents/CreateNote';

type NoteTabProps = {
  note: Note;
  lastIndex?: boolean;
  dummy?: boolean;
};

const Tab: React.FC<NoteTabProps> = ({note, dummy, lastIndex}) => {
  const {currentTheme} = useTheme();
  return (
    <LongPressEnabled
      longPressCanceledAction={() => {}}
      longPressAction={() => {}}
      dummy={dummy}>
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
        <Text style={[tabStyles.title, {color: currentTheme.baseColor}]}>
          {note.title}
        </Text>
      </LinearGradient>
    </LongPressEnabled>
  );
};

type NotesContainerProps = {
  close: () => void;
};

export type NotesContainerViewType =
  | 'default'
  | 'create'
  | 'favorite'
  | 'archived'
  | 'trash';

export type ComponentState = {
  state: NotesContainerViewType;
  headerName: string;
};

const NotesContainer: React.FC<NotesContainerProps> = ({close}) => {
  const {currentTheme} = useTheme();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const data = useSelector(
    (s: RootState) => s.notes.notes[user._id]?.data ?? [],
  );

  const [componentState, setComponentState] = useState<ComponentState>({
    state: 'default',
    headerName: 'Sticky Notes',
  });

  const updateComponentState = (view: NotesContainerViewType) => {
    const headerMap: Record<NotesContainerViewType, string> = {
      default: 'Sticky Notes',
      create: 'Create Note',
      favorite: 'Favorites',
      archived: 'Archived',
      trash: 'Trash',
    };
    setComponentState({state: view, headerName: headerMap[view]});
  };

  const filteredData = (state: NotesContainerViewType) => {
    switch (state) {
      case 'favorite':
        return data.filter(d => d.isFavorite);
      case 'archived':
        return data.filter(d => d.isArchived);
      case 'trash':
        return data.filter(d => d.isDeleted);
      default:
        return data;
    }
  };

  const renderBody = () => {
    if (componentState.state === 'create')
      return <CreateNote onRequestChangeState={updateComponentState} />;

    const renderNotes = filteredData(componentState.state);

    if (!renderNotes || renderNotes.length === 0) {
      return <FallbackMessage text="No Records found." />;
    }

    return (
      <FlatList
        data={renderNotes}
        keyExtractor={s => s._id}
        renderItem={({item, index}) => (
          <Tab note={item} lastIndex={renderNotes.length - 1 === index} />
        )}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <View
      style={[styles.parent, {backgroundColor: currentTheme.contrastColor}]}>
      <ExpandButton
        btn={{
          icon: <Icon2 name="arrow-back" size={14} color={'rgba(0,0,0,0.8)'} />,
          label: 'back',
          onPress: () =>
            componentState.state === 'default'
              ? close()
              : updateComponentState('default'),
        }}
        btn1={{
          icon: <Icon3 name="plus" size={14} color={'rgba(0,0,0,0.8)'} />,
          label: 'new',
          onPress: () => updateComponentState('create'),
        }}
      />

      <Header
        curved
        headerBgColor={currentTheme.fadeColor}
        name={componentState.headerName}
        titleColor={currentTheme.baseColor}
        customComponent={componentState.state === 'default'}
        renderItem={
          <HeaderIcon label="favorites">
            <Icon name="heart" size={20} color={currentTheme.baseColor} />
          </HeaderIcon>
        }
        customAction={() => updateComponentState('favorite')}
        renderItem1={
          <HeaderIcon label="archived">
            <Icon name="archive" size={20} color={currentTheme.baseColor} />
          </HeaderIcon>
        }
        customAction1={() => updateComponentState('archived')}
      />

      <View style={styles.content}>{renderBody()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  parent: {
    height: deviceHeight * 0.62,
    borderTopRightRadius: 16,
    borderTopLeftRadius: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  createContainer: {
    flex: 1,
    gap: 14,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: '700',
    borderBottomWidth: 1.5,
    paddingBottom: 6,
  },
  contentInput: {
    fontSize: 16,
    flex: 1,
    textAlignVertical: 'top',
    paddingTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  saveBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 12,
  },
});

const tabStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderLeftWidth: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotesContainer;
