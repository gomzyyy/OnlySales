import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  Platform,
  Alert,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NotesContainerViewType} from '../../NotesContainer';
import {useTheme} from '../../../hooks';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {
  createNote,
  saveToDraft,
  updateNote,
} from '../../../../store/slices/notes';
import {Note, NoteMedia} from '../../../../types';
import Icon from 'react-native-vector-icons/Feather';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/Entypo';
import Icon4 from 'react-native-vector-icons/FontAwesome';
import SlideUpContainer from '../../SlideUpContainer';
import FilePicker from '../../FilePicker';
import {colors} from '../../../utils/Constants';

type CreateNoteProps = {
  onRequestChangeState: (state: NotesContainerViewType) => void;
  title: string;
  setTitle: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  hashtags: string[];
  setHashtags: (tags: string[]) => void;
  media: NoteMedia[];
  setMedia: (media: NoteMedia[]) => void;
  noteId?: Note['_id'];
  setNoteId: (val: string | undefined) => void;
  onResetState: () => void;
  isArchived?: boolean;
  isFavorite?: boolean;
};

const CreateNote: React.FC<CreateNoteProps> = ({
  onRequestChangeState,
  title,
  setTitle,
  content,
  setContent,
  hashtags,
  setHashtags,
  media,
  setMedia,
  noteId,
  setNoteId,
  onResetState,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const [newTag, setNewTag] = useState('');
  const [openImagePicker, setOpenImagePicker] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>();
  const {currentTheme} = useTheme();

  const showValidationMessage = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      Alert.alert('Validation Error', msg);
    }
  };

  const handleSubmitAction = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (trimmedTitle.length === 0 || trimmedContent.length === 0) {
      showValidationMessage('Title and content are required.');
      return;
    }

    if (trimmedTitle.length < 4) {
      showValidationMessage('Title must be at least 4 characters.');
      return;
    }

    if (trimmedTitle.length > 64) {
      showValidationMessage('Title must be under 64 characters.');
      return;
    }

    const data = {title, content, hashtags, media};

    if (noteId) {
      dispatch(updateNote({uid: user._id, noteId, updates: data}));
      setNoteId(undefined);
    } else {
      dispatch(createNote({uid: user._id, note: data}));
    }

    setTimeout(() => {
      onResetState();
      onRequestChangeState('default');
    }, 0);
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setHashtags([...hashtags, newTag.trim()]);
      setNewTag('');
    }
  };

  const cancelImagePicker = () => {
    setSelectedImage(undefined);
    setOpenImagePicker(false);
  };

  const closeImagePicker = () => setOpenImagePicker(false);

  const addMediaItem = (item: NoteMedia) => {
    setMedia([...media, item]);
  };

  useEffect(() => {
    if (selectedImage) {
      addMediaItem({type: 'image', url: selectedImage});
      closeImagePicker();
      setSelectedImage(undefined);
    }
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      const hasUnsavedInput =
        title.trim().length > 0 || content.trim().length > 0;
      const isValidTitleLength =
        title.trim().length >= 4 && title.trim().length <= 64;
      const shouldSaveDraft = hasUnsavedInput && !isValidTitleLength;

      if (shouldSaveDraft) {
        dispatch(
          saveToDraft({
            uid: user._id,
            note: {
              title,
              content,
              hashtags,
              media,
            },
          }),
        );
      }
    };
  }, []);

  return (
    <View style={[styles.wrapper, {backgroundColor: currentTheme.fadeColor}]}>
      <View
        style={{
          flexDirection: 'row',
          gap: 16,
          position: 'absolute',
          right: 10,
          top: 10,
          backgroundColor: currentTheme.bgColor,
          height:22,
          width:'auto'
        }}>
        <Icon3 size={18} name="archive" color={currentTheme.baseColor} />
        <Icon4 size={18} name="heart" color={colors.danger} />
        <Icon4 size={18} name="heart-o" color={currentTheme.baseColor} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={currentTheme.baseColor}
          style={[styles.titleInput, {color: currentTheme.baseColor}]}
        />

        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Start writing your note..."
          placeholderTextColor={currentTheme.baseColor}
          multiline
          style={[
            styles.contentInput,
            {
              color: currentTheme.baseColor,
              backgroundColor: `${currentTheme.baseColor}10`,
            },
          ]}
        />

        <View style={styles.tagsSection}>
          <TextInput
            value={newTag}
            onChangeText={setNewTag}
            placeholder="Add tag"
            placeholderTextColor={currentTheme.baseColor}
            style={[
              styles.tagInput,
              {
                borderColor: currentTheme.baseColor,
                color: currentTheme.baseColor,
              },
            ]}
          />
          <Pressable onPress={handleAddTag} style={styles.addTagBtn}>
            <Icon name="plus" size={20} color={currentTheme.baseColor} />
          </Pressable>
        </View>

        <View style={styles.tagList}>
          {hashtags.map((tag, index) => (
            <Pressable
              key={index}
              onPress={() =>
                setHashtags(hashtags.filter((_, i) => i !== index))
              }
              style={[
                styles.tagItem,
                {backgroundColor: currentTheme.baseColor + '20'},
              ]}>
              <Text style={{color: currentTheme.baseColor, fontSize: 13}}>
                {tag}
              </Text>
            </Pressable>
          ))}
        </View>

        {media.length > 0 && (
          <View style={styles.mediaPreviewContainer}>
            <Text
              style={{
                color: currentTheme.baseColor,
                marginBottom: 6,
                fontWeight: 'bold',
              }}>
              Attached Images:
            </Text>
            <FlatList
              data={media}
              horizontal
              keyExtractor={(_, index) => index.toString()}
              renderItem={({item, index}) =>
                item.type === 'image' ? (
                  <Pressable
                    onPress={() =>
                      setMedia(media.filter((_, i) => i !== index))
                    }>
                    <Image
                      source={{uri: item.url}}
                      style={styles.previewImage}
                      resizeMode="cover"
                    />
                  </Pressable>
                ) : null
              }
              contentContainerStyle={{gap: 10}}
            />
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {borderTopColor: currentTheme.baseColor + '30'},
        ]}>
        <Pressable
          style={styles.footerIcon}
          onPress={() => setOpenImagePicker(true)}>
          <Icon2 name="image" size={20} color={currentTheme.baseColor} />
        </Pressable>
        <Pressable
          style={[styles.saveBtn, {backgroundColor: currentTheme.baseColor}]}
          onPress={handleSubmitAction}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Save</Text>
        </Pressable>
      </View>

      <SlideUpContainer
        opacity={0.2}
        open={openImagePicker}
        close={cancelImagePicker}
        height={220}>
        <FilePicker
          value={selectedImage}
          setState={setSelectedImage}
          callback={closeImagePicker}
          type="photo"
        />
      </SlideUpContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 60,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '700',
    paddingBottom: 8,
    marginBottom: 14,
  },
  contentInput: {
    fontSize: 16,
    minHeight: 160,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
  tagsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1.2,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  addTagBtn: {
    padding: 10,
    borderRadius: 50,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    gap: 8,
  },
  tagItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    gap: 12,
  },
  footerIcon: {
    padding: 8,
    borderRadius: 50,
  },
  saveBtn: {
    marginLeft: 'auto',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  mediaPreviewContainer: {
    marginVertical: 20,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});

export default CreateNote;
