import { FormErrors, useForm } from "@mantine/form";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DepartmentGetDto, CourseGetDto, ProfessorCreateUpdateDto, CourseCreateUpdateDto, ApiResponse } from "../../constants/types";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";
import { routes } from "../../routes";
import { Container, TextInput, Space, Flex, Button, Select, Title } from "@mantine/core";

export const CourseUpdate = () => {
    const [departments, setDepartments] = useState<DepartmentGetDto[]>();
    const [course, setCourse] = useState<CourseGetDto>();
    const navigate = useNavigate();
    const { id } = useParams();
  
    const mantineForm = useForm<CourseCreateUpdateDto>({
      initialValues: course,
    });

    const fetchDepartments = useCallback (async () => {
        const response = await api.get<ApiResponse<DepartmentGetDto[]>>("/api/departments");
        if (response.data.hasErrors) {
          showNotification({ message: "Error fetching departments." });
        }
    
        if (response.data.data) {
          setDepartments(response.data.data);
        }
      }, []);

      const fetchCourse = useCallback (async () => {
        const response = await api.get<ApiResponse<CourseGetDto>>(`/api/courses/${id}`)

        if (response.data.hasErrors) {
            showNotification({ message: "Error fetching course." });
          }
      
          if (response.data.data) {
            setCourse(response.data.data);
            mantineForm.setValues(response.data.data);
        mantineForm.resetDirty();
          }

      }, [id]);

      useEffect(() => {
        fetchCourse();
        fetchDepartments();
      }, []);

      const submitCourse= async (values: CourseCreateUpdateDto) => {
        const response = await api.put<ApiResponse<CourseGetDto>>(
          `/api/courses/${id}`,
          values
        );
    
        if (response.data.hasErrors) {
          const formErrors: FormErrors = response.data.errors.reduce(
            (prev, curr) => {
              Object.assign(prev, { [curr.property]: curr.message });
              return prev;
            },
            {} as FormErrors
          );
          mantineForm.setErrors(formErrors);
        }
    
        if (response.data.data) {
          showNotification({ message: "Course updated.", color: "green" });
          navigate(routes.courseList);
        }
      };

    return(<Container>
        {course && (
          <>
            <form onSubmit={mantineForm.onSubmit(submitCourse)}>
              <TextInput
                {...mantineForm.getInputProps("name")}
                label="Name"
                withAsterisk
              />
  
              <Space h={7} />
  
              <TextInput
                {...mantineForm.getInputProps("description")}
                label="description"
                withAsterisk
              />
              <Space h = {7}/>

<Title order ={4}>Select a department for the course</Title>

<Space h={7} />
{departments && (
<Select
{...mantineForm.getInputProps("departmentId")}
data={departments.map((department) => {
  return {
    label: department.name,
    value: String(department.id),
  };
})}
/>
)}
  
              <Space h={18} />
  
              <Flex direction={"row"}>
                <Button type="submit">Submit</Button>
                <Space w={7} />
                <Button
                  type="button"
                  onClick={() => {
                    navigate(routes.courseList);
                  }}
                  variant="outline"
                  color="red"
                >
                  Cancel
                </Button>
              </Flex>
            </form>
          </>
        )}
      </Container>)
};