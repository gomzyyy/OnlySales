import {StyleSheet} from 'react-native';

const global = StyleSheet.create({
  inputText: {
    borderRadius: 8,
    height: 56,
    fontSize: 18,
    paddingHorizontal: 12,
    backgroundColor: '#f2f2f2',
  },
  modalContainerTopRounded: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalContainerRounded: {
    borderRadius: 20,
  },
  modalContainerCommonStyles: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 8,
    maxWidth: 600,
  },
  modalContainerBottomLifted:{
    marginBottom:10
  }
});
export {global};
