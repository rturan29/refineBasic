import dayjs from "dayjs";

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

type sessionStatus = workshopStatus | "rejected" | "past" | "quotaFull"

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
  plans?: { day: number, time: [any, any]; }[];
}

interface IUser {
  id: string;
  nameSurname: string;
  email: string;
  phone: string;
  workshops: Array<string>;
  gender: "male" | "female" | "other";
}
