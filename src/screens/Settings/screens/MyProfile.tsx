import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../store/store';
import {AdminRole} from '../../../../enums';
import OwnerProfile from './components/OwnerProfile';
import EmployeeProfile from './components/EmployeeProfile';

const MyProfile = () => {
  const user = useSelector((s: RootState) => s.appData.user);
  if (!user) return null;
  if (user.role === AdminRole.OWNER) return <OwnerProfile />;
  else if (user.role === AdminRole.EMPLOYEE) return <EmployeeProfile />;
  return null;
};

export default MyProfile;
