export type School = {
  id: string;
  name: string;
  address: string;
};

export type SchoolWithClassesCount = School & {
  classesCount: number;
};

export type SchoolInput = Omit<School, 'id'>;
