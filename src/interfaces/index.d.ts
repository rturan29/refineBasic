interface ICategory {
  id: string;
  title: string;
}
interface IPost {
  id: string;
  title: string;
  content: string;
  status: "published" | "draft" | "rejected";
  createdAt: string;
  category: ICategory;
}

interface ICustomComponentProperties {
  icon: React.ReactNode,
  label: string,
  route: string;
}

interface ICourse {
  id: string;
  title: string;
  category: string;
  description: string;
  status: "published" | "draft";
  sessions: Array<string>;
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
  courseId: string;
  status: "published" | "draft";
  teacher: string;
  startDate: string | Date;
  endDate: string | Date;
  quota: number;
  participants: IParticipant[];
  paymentAmount: number;
  description?: string;
}

interface IUser {
  id: string;
  nameSurname: string;
  email: string;
  phone: string;
  courses: Array<string>;
  gender: "male" | "female" | "other";
}
