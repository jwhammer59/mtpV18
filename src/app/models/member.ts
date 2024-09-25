import { Ministry } from './ministry';

export interface Member {
  id: string;
  firstName: string;
  middleInit: string;
  lastName: string;
  phone: string;
  email: string;
  add1: string;
  add2: string;
  city: string;
  state: string;
  zip: string;
  avatarImgName?: string;
  avatarDownloadUrl?: string;
  ministries: Ministry[];
  familyID: string;
  physician: string;
  dentist: string;
  hospital: string;
  isActive: boolean;
  isFamilyIDHead: boolean;
  isMinsitryHead: boolean;
}
