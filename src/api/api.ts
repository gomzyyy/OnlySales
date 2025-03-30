import {AdminRole} from '../../enums';

export const setImageAPI = async (data: {img: string; role: AdminRole}) => {
  try {
    const {img, role} = data;
    if (!img || role) {
      throw new Error('No path Provided!');
    }
    const formData = new FormData();
    formData.append('img', {
      uri: img,
      name: 'profile.jpg',
      type: 'image/jpeg',
    } as any);
    const fetching = await fetch(
        // `http://192.168.1.71:6900/api/app/upload/image/single?role=${role}`,
      'http://192.168.1.71:6900/api/app//upload/image/test',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      },
    );
    if (!fetching.ok) {
      return {
        message: 'Error occured while fetching',
        success: false,
      };
    }
    const res = await fetching.json();
    return res;
  } catch (error) {
    return {
      message: 'Internal server Error occured while fetching',
      success: false,
    };
  }
};
