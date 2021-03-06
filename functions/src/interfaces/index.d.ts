import * as dayjs from "dayjs";
import { Moment } from "moment";

interface ICategory {
  id: string;
  title: string;
}
interface ICustomComponentProperties {
  icon: React.ReactNode,
  label: string,
  route: string;
}

type workshopType = "private" | "group";

type workshopStatus = "published" | "draft";

type sessionStatus = workshopStatus | "rejected" | "past" | "quotaFull";

type sessionModalRole = "show" | "create" | "apply";

interface IWorkshop {
  id: string;
  title: string;
  category: string;
  description: string;
  status: workshopStatus;
  sessions: Array<string>;
  type: workshopType;
}

interface ICategory {
  id: string;
  title: string;
}

interface IParticipant {
  participantId: string;
  isPaymentCompleted: boolean;
  selectedPlan?: string
}
interface ISession {
  id: string;
  type?: workshopType;
  workshopId: string;
  status: sessionStatus;
  teacher: string;
  quota: number;
  participants: IParticipant[];
  paymentAmount: number;
  description?: string;
  period: [string, string] | [dayjs.Dayjs, dayjs.Dayjs] | [Date, Date];
  plans?: IPlan[];
  availablePlans?: IAvailablePlan[];
}
interface IPlan {
  day: number,
  time: [Moment, Moment] | [string, string];
}

interface IAvailablePlan {
  day: number,
  time: Array<number>;
}

interface IUser {
  id: string;
  nameSurname: string;
  email: string;
  phone: string;
  workshops: Array<string>;
  gender: "male" | "female" | "other";
}
