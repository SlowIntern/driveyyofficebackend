import { User } from 'src/user/schema/user.schema';
import { Captain } from 'src/captain/schema/captain.schema';

export interface AuthenticatedRequest extends Request {
    user?: User;
    captain?: Captain;
}
