interface ICategory {
  id: string;
  title: string;
}
interface IPost {
  id: string;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected" | "past" | "quotaFull";
  createdAt: string;
  category: ICategory;
}

interface ICustomComponentProperties {
  icon: React.ReactNode,
  label: string,
  route: string;
}

interface IWorkshop {
  id: string;
  title: string;
  category: string;
  description: string;
  status: "published" | "draft";
  sessions: Array<string>;
  type: "private" | "group";
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
  type: "private" | "group";
  workshopId: string;
  status: "published" | "draft";
  teacher: string;
  quota: number;
  participants: IParticipant[];
  paymentAmount: number;
  description?: string;
  period: [Date, | Date];
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
