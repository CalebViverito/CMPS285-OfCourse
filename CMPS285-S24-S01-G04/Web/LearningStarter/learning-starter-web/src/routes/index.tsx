import { UniversityCreate } from "../pages/university-page/university-create";
import { UniversitiesListing } from "../pages/university-page/university-listing";
import { ProfessorDetails } from "../pages/professors-page/professor-details";
import { ProfessorDepartmentCreate } from "../pages/professors-page/professor-department-create";
import { UniversityDepartmentCreate } from "../pages/university-page/university-department-create";

//This is where you will declare all of your routes (the ones that show up in the search bar)
export const routes = {
  root: `/`,
  home: `/home`,
  user: `/user`,
  // UNIVERSITY
  universityListing: "/universities",
  universityUpdate: "/universities/:id",
  universityCreate: "/universities/create",
  universityDetails: "/universities/:id/details",
  universityDepartmentCreate: "/universityDepartment/:id",
  // DEPARTMENT
  departmentListing: `/departments`,
  departmentUpdate: `/departments/:id`,
  departmentCreate: `/departments/create`,
  // COURSE
  courseList: `/course`,
  course: `/course/:id`,
  courseReview: `/course/:id/review`,
  courseReviewUpdate: `/course/:id/review/update/:review`,
  courseCreate: `/courses/create`,
  courseUpdate: `/course/:id/update`,
  // PROFESSOR
  professorListing: `/professors`,
  professorUpdate: `/professors/:id`,
  professorCreate: `/professors/create`,
  professorDetails: `/professors/:id/details`,
  professorCourseCreate: `/professorsCourse/:id`,
  professorCourse: `/professors/:id/course/:courseId`,
  professorDepartmentCreate: `/professorDepartment/:id`,

};
