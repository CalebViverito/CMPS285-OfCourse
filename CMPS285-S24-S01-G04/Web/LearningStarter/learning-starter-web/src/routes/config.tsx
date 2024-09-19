import { Navigate, Route, Routes as Switch } from "react-router-dom";
import { routes } from ".";
import { useUser } from "../authentication/use-auth";
import { PageWrapper } from "../components/page-wrapper/page-wrapper";
import { CourseListPage } from "../pages/course-list-page/course-list-page";
import { CoursePageReviewUpdate } from "../pages/course-page-review-update/course-page-review-update";
import { CoursePageReview } from "../pages/course-page-review/course-page-review";
import { CoursePage } from "../pages/course-page/course-page";
import { DepartmentCreate } from "../pages/departments-page/department-create";
import { DepartmentUpdate } from "../pages/departments-page/department-update";
import { LandingPage } from "../pages/landing-page/landing-page";
import { NotFoundPage } from "../pages/not-found";
import { ProfessorCourse } from "../pages/professors-page/professor-course";
import { ProfessorCourseCreate } from "../pages/professors-page/professor-course-create";
import { ProfessorCreate } from "../pages/professors-page/professor-create";
import { ProfessorDepartmentCreate } from "../pages/professors-page/professor-department-create";
import { ProfessorDetails } from "../pages/professors-page/professor-details";
import { ProfessorListing } from "../pages/professors-page/professor-listing";
import { ProfessorUpdate } from "../pages/professors-page/professor-update";

import { DepartmentListing } from "../pages/departments-page/department-listing";
import { UniversityCreate } from "../pages/university-page/university-create";
import { UniversityDetails } from "../pages/university-page/university-details";
import { UniversitiesListing } from "../pages/university-page/university-listing";
import { UniversityUpdate } from "../pages/university-page/university-update";
import { UserPage } from "../pages/user-page/user-page";
import { UniversityDepartmentCreate } from "../pages/university-page/university-department-create";
import { CourseCreate } from "../pages/course-create-page/course-create";
import { CourseUpdate } from "../pages/course-update-page/course-update";

//This is where you will tell React Router what to render when the path matches the route specified.
export const Routes = () => {
  //Calling the useUser() from the use-auth.tsx in order to get user information
  const user = useUser();
  return (
    <>
      {/* The page wrapper is what shows the NavBar at the top, it is around all pages inside of here. */}
      <PageWrapper user={user}>
        <Switch>
          {/* When path === / render LandingPage */}
          <Route path={routes.home} element={<LandingPage />} />
          {/* When path === /iser render UserPage */}
          <Route path={routes.user} element={<UserPage />} />
          {/* UNIVERSITIES */}
          <Route
            path={routes.universityListing}
            element={<UniversitiesListing />}
          />
          <Route
            path={routes.universityUpdate}
            element={<UniversityUpdate />}
          />
          <Route
            path={routes.universityCreate}
            element={<UniversityCreate />}
          />
          <Route
            path={routes.universityDetails}
            element={<UniversityDetails />}
          />
          <Route
            path={routes.universityDepartmentCreate}
            element={<UniversityDepartmentCreate />}
          />
          {/* DEPARTMENTS */}
          <Route path={routes.departmentListing} element={<DepartmentListing/>} />
          <Route path={routes.departmentUpdate} element={<DepartmentUpdate />} />
          <Route path={routes.departmentCreate} element={<DepartmentCreate />} />
          {/* COURSES */}
          <Route path={routes.course} element={<CoursePage />} />
          <Route path={routes.courseList} element={<CourseListPage />} />
          <Route path={routes.courseReview} element={<CoursePageReview />} />
          <Route
            path={routes.courseReviewUpdate}
            element={<CoursePageReviewUpdate />}
          />
          <Route path={routes.courseCreate} element={<CourseCreate />} />
          <Route path={routes.courseUpdate} element={<CourseUpdate />} />
          {/* PROFESSORS */}
          <Route
            path={routes.professorListing}
            element={<ProfessorListing />}
          />
          <Route path={routes.professorUpdate} element={<ProfessorUpdate />} />
          <Route path={routes.professorCreate} element={<ProfessorCreate />} />
          <Route
            path={routes.professorDetails}
            element={<ProfessorDetails />}
          />
          <Route path={routes.professorCourse} element={<ProfessorCourse />} />
          <Route
            path={routes.professorCourseCreate}
            element={<ProfessorCourseCreate />}
          />
          <Route
            path={routes.professorDepartmentCreate}
            element={<ProfessorDepartmentCreate />}
          />
          {/* Going to route "localhost:5001/" will go to homepage */}
          <Route path={routes.root} element={<Navigate to={routes.home} />} />

          {/* This should always come last.  
            If the path has no match, show page not found */}
          <Route path="*" element={<NotFoundPage />} />
        </Switch>
      </PageWrapper>
    </>
  );
};
