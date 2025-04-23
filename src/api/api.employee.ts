import { SetStateAction } from "react";
import { FetchAPI, handleBooleanState } from "./helper/fn";
import { CreateEmployeeAPIData, CreateEmployeeReturnType } from "./types.api";

export const createEmployeeAPI = async (
    data: CreateEmployeeAPIData,
    setState?: React.Dispatch<SetStateAction<boolean>>,
  ) => {
    handleBooleanState(setState, true);
  
    try {
      const { createdBy, creatorId, role } = data.query;
      const {
        name,
        userId,
        phoneNumber,
        password,
        position,
        positionDescription,
        email,
        address,
        gender,
        department,
        departmentDescription,
        salary,
        status,
        statusDescription,
        skills,
        shift,
        shiftDescription,
        reportsToModel,
        businessOwnerId,
        hrUid,
      } = data.body;
  
      const formData = new FormData();
  
      // Required Fields
      formData.append('name', name);
      formData.append('userId', userId);
      formData.append('password', password);
      formData.append('position', position);
      formData.append('email', email);
      formData.append('gender', gender);
      formData.append('department', department);
      formData.append('salary', salary.toString());
      formData.append('status', status);
      formData.append('shift', shift);
      formData.append('businessOwnerId', businessOwnerId);
  
      // Optional Fields
      if (phoneNumber) formData.append('phoneNumber', phoneNumber);
      if (address) formData.append('address', address);
      if (positionDescription) formData.append('positionDescription', positionDescription);
      if (departmentDescription) formData.append('departmentDescription', departmentDescription);
      if (statusDescription) formData.append('statusDescription', statusDescription);
      if (shiftDescription) formData.append('shiftDescription', shiftDescription);
      if (reportsToModel) formData.append('reportsToModel', reportsToModel);
      if (hrUid) formData.append('hrUid', hrUid);
      if (skills && skills.length > 0) {
        skills.forEach((skill, index) => {
          formData.append(`skills[${index}]`, skill);
        });
      }
  
      // Media (image)
      if (data.media?.image) {
        const imageFile = {
          uri: data.media.image,
          type: 'image/jpeg',
          name: 'profile.jpg',
        };
        formData.append('img', imageFile as any);
      }
  
      // API Call
      const fetching = await FetchAPI({
        reqType: 'media',
        route: `/create/employee?role=${role}&createdBy=${createdBy}&creatorId=${creatorId}`,
        method: 'POST',
        body: formData,
      });
  
      return (await fetching.json()) as CreateEmployeeReturnType;
    } catch (error) {
      return {
        message: 'Internal server Error occurred while fetching',
        data: {
          customer: undefined,
        },
        success: false,
      } as CreateEmployeeReturnType;
    } finally {
      handleBooleanState(setState, false);
    }
  };
  