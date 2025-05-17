import {AdminRole} from '../../enums';
import {UploadPdfToCloudReturnType, UploadPdfToCloudAPIData} from './types.api';
import {Dispatch, SetStateAction} from 'react';
import {FetchAPI, handleBooleanState} from './helper/fn';

export const uploadPdfToCloudAPI = async (
  data: UploadPdfToCloudAPIData,
  setState?: Dispatch<SetStateAction<boolean>>,
) => {
  try {
    const {role} = data.query;
    const formData = new FormData();
    if (data.media.pdf) {
      const pdfFile = {
        uri: data.media.pdf,
        type: 'application/pdf',
        name: 'receipt.pdf',
      };
      formData.append('pdf', pdfFile as any);
    }
    const fetching = await FetchAPI({
      reqType: 'media',
      route: `/upload/pdf?role=${role}`,
      method: 'POST',
      body: formData,
    });
    return (await fetching.json()) as UploadPdfToCloudReturnType;
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : 'Internal server Error occured while fetching',
      data: {},
      success: false,
    } as UploadPdfToCloudReturnType;
  } finally {
    handleBooleanState(setState, false);
  }
};
