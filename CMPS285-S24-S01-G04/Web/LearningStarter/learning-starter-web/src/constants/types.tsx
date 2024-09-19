//This type uses a generic (<T>).  For more information on generics see: https://www.typescriptlang.org/docs/handbook/2/generics.html
//You probably wont need this for the scope of this class :)
export type ApiResponse<T> = {
  data: T;
  errors: ApiError[];
  hasErrors: boolean;
};

export type ApiError = {
  property: string;
  message: string;
};

export type AnyObject = {
  [index: string]: any;
};

export type UserDto = {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
};

export type UniversityGetDto = {
  id: number;
  name: string;
  departments: UniversityDepartmentGetDto[];
};

export type UniversityCreateUpdateDto = {
  name: string;
};

export type DepartmentGetDto = {
  id: number;
  name: string;
  courses: CourseGetDto[];
};

export type CourseGetDto = {
  id: number;
  name: string;
  description: string;
  departmentId: number;
  department: string;
};

export type ProfessorGetDto = {
  id: number;
  firstName: string;
  lastName: string;
  departments: ProfessorDepartmentGetDto[];
  courses: ProfessorCourseGetDto[];
};

export type ReviewGetDto = {
  id: number;
  userId: number;
  user: string;

  professorCourseId: number;
  professorName: string;
  courseName: string;

  rating: number;
  comment: string;
  dateCreated: Date;

  tags: ReviewTagGetDto[];
};

export type TagGetDto = {
  id: number;
  name: string;
};

// intermediary get dto
export type ProfessorCourseGetDto = {
  id: number;
  name: string;
  description: string;
  reviews: ReviewGetDto[];
};

export type ProfessorDepartmentGetDto = {
  id: number;
  name: string;
};

export type ReviewTagGetDto = {
  id: number;
  name: string;
};

export type UniversityDepartmentGetDto = {
  id: number;
  name: string;
};

// create update dto
export type ProfessorCreateUpdateDto = {
  firstName: string;
  lastName: string;
};

export type ProfessorCourseCreateUpdateDto = {
  professorId: number;
  courseId: number;
};

export type DepartmentCreateUpdateDto = {
  name: string;
  };
export type ProfessorDepartmentCreateUpdateDto = {
  professorId: number;
  departmentId: number;
};

export type UniversityDepartmentCreateUpdateDto = {
  universityId: number;
  departmentId: number;
};

export type CourseCreateUpdateDto = {
  name: string;
  description: string;
  departmentId: number;
};
