import dayjs from "dayjs";
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

type workshopStatus = "published" | "draft" | "canceled";

type sessionStatus = workshopStatus | "past" | "quotaFull";

type TModalRole = "show" | "create" | "apply" | "addPlan" | "edit" | "editPlan" | "showPlans" | "showParticipants";

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
  selectedPlan?: ISelectedPlan;
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

interface ISelectedPlan {
  day: number,
  time: number;
}

interface IWorkshopCategory {
  name: string;
  description: string;
  order: number;
  caption: IMultiLanguage;
}

interface IMultiLanguage {
  [key: string]: string;
}

interface IUser {
  id: string;
  nameSurname: string;
  email: string;
  phone: string;
  workshops: Array<string>;
  gender: "male" | "female" | "other";
}

type culture = "tr" | "en";

type StatusType = "published" | "draft" | "canceled" | "past" | "quotaFull";

type Colors = "success" | "error" | "default" | "pink" | "red" | "yellow" | "orange"
  | "cyan" | "green" | "blue" | "purple" | "geekblue" | "magenta" | "volcano" | "gold"
  | "lime" | "processing" | "warning";