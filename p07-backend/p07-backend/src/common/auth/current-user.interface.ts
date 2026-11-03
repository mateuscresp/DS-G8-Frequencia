import { AccessRole } from './access-role.enum';

export interface CurrentUser {
  userId: string;
  username: string;
  email?: string;
  role: AccessRole;
}
