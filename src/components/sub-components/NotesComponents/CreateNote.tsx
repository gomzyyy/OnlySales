import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {NotesContainerViewType} from '../../NotesContainer';
import {useTheme} from '../../../hooks';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../../../../store/store';
import {createNote} from '../../../../store/slices/notes';
import {Note} from '../../../../types';
import Icon from 'react-native-vector-icons/Feather';
import Icon1 from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/Ionicons';
import SlideUpContainer from '../../SlideUpContainer';
import FilePicker from '../../FilePicker';

type CreateNoteProps = {
  onRequestChangeState: (state: NotesContainerViewType) => void;
};

const CreateNote: React.FC<CreateNoteProps> = ({onRequestChangeState}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((s: RootState) => s.appData.user)!;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [media, setMedia] = useState<Note['media']>([]);
  const [newTag, setNewTag] = useState('');
  const [openDocPicker, setOpenDocPicker] = useState<boolean>(false);
  const [openImagePicker, setOpenImagePicker] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>();
   const [openVideoPicker, setOpenVideoPicker] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>();
  const {currentTheme} = useTheme();

  const handleSubmitAction = () => {
    dispatch(
      createNote({uid: user._id, note: {title, content, hashtags, media}}),
    );
    onRequestChangeState('default');
  };

  const handleAddTag = () => {
    if (newTag.trim() !== '') {
      setHashtags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };
  const cancelImagePicker = () => {
    setSelectedImage(undefined);
    setOpenImagePicker(false);
  };

  const closeImagePicker = () => {
    setOpenImagePicker(false);
  };
  const cancelVideoPicker = () => {
    setSelectedImage(undefined);
    setOpenVideoPicker(false);
  };

  const closeVideoPicker = () => {
    setOpenVideoPicker(false);
  };

  return (
    <View style={[styles.wrapper, {backgroundColor: currentTheme.fadeColor}]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Title"
          placeholderTextColor={currentTheme.baseColor}
          style={[
            styles.titleInput,
            {
              color: currentTheme.baseColor,
            },
          ]}
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
            <View
              key={index}
              style={[
                styles.tagItem,
                {backgroundColor: currentTheme.baseColor + '20'},
              ]}>
              <Text style={{color: currentTheme.baseColor, fontSize: 13}}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {borderTopColor: currentTheme.baseColor + '30'},
        ]}>
        <Pressable style={styles.footerIcon} onPress={() => setOpenDocPicker(true)}>
          <Icon1 name="attachment" size={20} color={currentTheme.baseColor} />
        </Pressable>
        <Pressable
          style={styles.footerIcon}
          onPress={() => setOpenImagePicker(true)}>
          <Icon2 name="image" size={20} color={currentTheme.baseColor} />
        </Pressable>
        <Pressable
          style={styles.footerIcon}
          onPress={() => setOpenVideoPicker(true)}>
          <Icon2 name="videocam" size={20} color={currentTheme.baseColor} />
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
      <SlideUpContainer
        opacity={0.2}
        open={openVideoPicker}
        close={cancelVideoPicker}
        height={220}>
        <FilePicker
          value={selectedVideo}
          setState={setSelectedVideo}
          callback={closeVideoPicker}
          type="video"
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
});

export default CreateNote;
